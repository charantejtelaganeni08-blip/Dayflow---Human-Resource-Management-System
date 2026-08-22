```sql
-- ============================================================
-- DAYFLOW HRMS - BACKEND FUNCTIONS
-- ============================================================
-- This migration contains the backend functions currently
-- deployed in the Dayflow Supabase database.
-- ============================================================


-- ============================================================
-- ADMIN HELPER
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.employees
    WHERE user_id = auth.uid()
      AND is_admin = TRUE
  );
$$;


-- ============================================================
-- ATTENDANCE FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.check_in()
RETURNS public.attendance
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_employee_id UUID;
  new_attendance public.attendance;
BEGIN

  -- Find the employee profile belonging to the logged-in user
  SELECT id
  INTO current_employee_id
  FROM public.employees
  WHERE user_id = auth.uid();

  -- Make sure the logged-in user has an employee profile
  IF current_employee_id IS NULL THEN
    RAISE EXCEPTION 'Employee profile not found';
  END IF;

  -- Prevent checking in twice on the same day
  IF EXISTS (
    SELECT 1
    FROM public.attendance
    WHERE employee_id = current_employee_id
      AND date = CURRENT_DATE
  ) THEN
    RAISE EXCEPTION 'Attendance already recorded for today';
  END IF;

  -- Create today's attendance record
  INSERT INTO public.attendance (
    employee_id,
    date,
    status,
    check_in_time
  )
  VALUES (
    current_employee_id,
    CURRENT_DATE,
    'present',
    CURRENT_TIMESTAMP
  )
  RETURNING *
  INTO new_attendance;

  RETURN new_attendance;

END;
$function$;


CREATE OR REPLACE FUNCTION public.check_out()
RETURNS public.attendance
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_employee_id UUID;
  updated_attendance public.attendance;
BEGIN

  -- Find the employee profile belonging to the logged-in user
  SELECT id
  INTO current_employee_id
  FROM public.employees
  WHERE user_id = auth.uid();

  -- Make sure the logged-in user has an employee profile
  IF current_employee_id IS NULL THEN
    RAISE EXCEPTION 'Employee profile not found';
  END IF;

  -- Find today's attendance record
  SELECT *
  INTO updated_attendance
  FROM public.attendance
  WHERE employee_id = current_employee_id
    AND date = CURRENT_DATE;

  -- Make sure the employee checked in first
  IF updated_attendance.id IS NULL THEN
    RAISE EXCEPTION 'You must check in before checking out';
  END IF;

  -- Prevent checking out twice
  IF updated_attendance.check_out_time IS NOT NULL THEN
    RAISE EXCEPTION 'You have already checked out today';
  END IF;

  -- Record the check-out time
  UPDATE public.attendance
  SET
    check_out_time = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = updated_attendance.id
  RETURNING *
  INTO updated_attendance;

  RETURN updated_attendance;

END;
$function$;


CREATE OR REPLACE FUNCTION public.get_my_attendance()
RETURNS SETOF public.attendance
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_employee_id UUID;
BEGIN

  -- Find the employee profile belonging to the logged-in user
  SELECT id
  INTO current_employee_id
  FROM public.employees
  WHERE user_id = auth.uid();

  -- Make sure the user has an employee profile
  IF current_employee_id IS NULL THEN
    RAISE EXCEPTION 'Employee profile not found';
  END IF;

  -- Return only this employee's attendance records
  RETURN QUERY
  SELECT *
  FROM public.attendance
  WHERE employee_id = current_employee_id
  ORDER BY date DESC;

END;
$function$;


CREATE OR REPLACE FUNCTION public.get_all_attendance()
RETURNS TABLE(
  attendance_id uuid,
  employee_id uuid,
  first_name text,
  last_name text,
  department text,
  attendance_date date,
  attendance_status public.attendance_status,
  check_in_time timestamp without time zone,
  check_out_time timestamp without time zone,
  notes text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN

  -- Only Admin/HR users may access all attendance records
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can view all attendance records';
  END IF;

  RETURN QUERY
  SELECT
    a.id,
    e.id,
    e.first_name,
    e.last_name,
    e.department,
    a.date,
    a.status,
    a.check_in_time,
    a.check_out_time,
    a.notes
  FROM public.attendance a
  JOIN public.employees e
    ON e.id = a.employee_id
  ORDER BY a.date DESC, e.first_name ASC;

END;
$function$;


-- ============================================================
-- LEAVE REQUEST FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.submit_leave_request(
  requested_leave_type public.leave_type,
  requested_start_date date,
  requested_end_date date,
  requested_reason text DEFAULT NULL::text
)
RETURNS public.leave_requests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_employee_id UUID;
  new_leave_request public.leave_requests;
BEGIN

  -- Find the employee profile belonging to the logged-in user
  SELECT id
  INTO current_employee_id
  FROM public.employees
  WHERE user_id = auth.uid();

  -- Make sure the user has an employee profile
  IF current_employee_id IS NULL THEN
    RAISE EXCEPTION 'Employee profile not found';
  END IF;

  -- Validate dates
  IF requested_end_date < requested_start_date THEN
    RAISE EXCEPTION 'End date cannot be before start date';
  END IF;

  -- Create the leave request
  INSERT INTO public.leave_requests (
    employee_id,
    leave_type,
    start_date,
    end_date,
    reason,
    status
  )
  VALUES (
    current_employee_id,
    requested_leave_type,
    requested_start_date,
    requested_end_date,
    requested_reason,
    'pending'
  )
  RETURNING *
  INTO new_leave_request;

  RETURN new_leave_request;

END;
$function$;


CREATE OR REPLACE FUNCTION public.approve_leave_request(request_id uuid)
RETURNS public.leave_requests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_employee_id UUID;
  leave_request public.leave_requests;
BEGIN

  -- Make sure the logged-in user is an Admin
  SELECT id
  INTO current_employee_id
  FROM public.employees
  WHERE user_id = auth.uid()
    AND is_admin = TRUE;

  IF current_employee_id IS NULL THEN
    RAISE EXCEPTION 'Only administrators can approve leave requests';
  END IF;

  -- Find the requested leave record
  SELECT *
  INTO leave_request
  FROM public.leave_requests
  WHERE id = request_id;

  -- Make sure the request exists
  IF leave_request.id IS NULL THEN
    RAISE EXCEPTION 'Leave request not found';
  END IF;

  -- Only pending requests can be approved
  IF leave_request.status <> 'pending' THEN
    RAISE EXCEPTION 'Only pending leave requests can be approved';
  END IF;

  -- Approve the request
  UPDATE public.leave_requests
  SET
    status = 'approved',
    approved_by = current_employee_id,
    approved_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = request_id
  RETURNING *
  INTO leave_request;

  RETURN leave_request;

END;
$function$;


CREATE OR REPLACE FUNCTION public.reject_leave_request(request_id uuid)
RETURNS public.leave_requests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_employee_id UUID;
  leave_request public.leave_requests;
BEGIN

  -- Make sure the logged-in user is an Admin
  SELECT id
  INTO current_employee_id
  FROM public.employees
  WHERE user_id = auth.uid()
    AND is_admin = TRUE;

  IF current_employee_id IS NULL THEN
    RAISE EXCEPTION 'Only administrators can reject leave requests';
  END IF;

  -- Find the requested leave record
  SELECT *
  INTO leave_request
  FROM public.leave_requests
  WHERE id = request_id;

  -- Make sure the request exists
  IF leave_request.id IS NULL THEN
    RAISE EXCEPTION 'Leave request not found';
  END IF;

  -- Only pending requests can be rejected
  IF leave_request.status <> 'pending' THEN
    RAISE EXCEPTION 'Only pending leave requests can be rejected';
  END IF;

  -- Reject the request
  UPDATE public.leave_requests
  SET
    status = 'rejected',
    approved_by = current_employee_id,
    approved_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = request_id
  RETURNING *
  INTO leave_request;

  RETURN leave_request;

END;
$function$;


CREATE OR REPLACE FUNCTION public.get_my_leave_requests()
RETURNS SETOF public.leave_requests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_employee_id UUID;
BEGIN

  -- Find the employee profile belonging to the logged-in user
  SELECT id
  INTO current_employee_id
  FROM public.employees
  WHERE user_id = auth.uid();

  -- Make sure the user has an employee profile
  IF current_employee_id IS NULL THEN
    RAISE EXCEPTION 'Employee profile not found';
  END IF;

  -- Return only this employee's leave requests
  RETURN QUERY
  SELECT *
  FROM public.leave_requests
  WHERE employee_id = current_employee_id
  ORDER BY created_at DESC;

END;
$function$;


CREATE OR REPLACE FUNCTION public.get_all_leave_requests()
RETURNS TABLE(
  request_id uuid,
  employee_id uuid,
  first_name text,
  last_name text,
  department text,
  leave_type public.leave_type,
  start_date date,
  end_date date,
  reason text,
  status public.leave_status,
  approved_by uuid,
  approved_at timestamp without time zone,
  created_at timestamp without time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN

  -- Only Admin/HR users may view everyone's leave requests
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can view all leave requests';
  END IF;

  RETURN QUERY
  SELECT
    lr.id,
    e.id,
    e.first_name,
    e.last_name,
    e.department,
    lr.leave_type,
    lr.start_date,
    lr.end_date,
    lr.reason,
    lr.status,
    lr.approved_by,
    lr.approved_at,
    lr.created_at
  FROM public.leave_requests lr
  JOIN public.employees e
    ON e.id = lr.employee_id
  ORDER BY
    CASE
      WHEN lr.status = 'pending' THEN 0
      ELSE 1
    END,
    lr.created_at DESC;

END;
$function$;


-- ============================================================
-- PAYROLL FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_payroll(
  target_employee_id uuid,
  period_start date,
  period_end date,
  payroll_base_salary numeric,
  payroll_deductions numeric DEFAULT 0,
  payroll_bonuses numeric DEFAULT 0
)
RETURNS public.payroll
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_admin_id UUID;
  new_payroll public.payroll;
  calculated_net_pay DECIMAL(12, 2);
BEGIN

  -- Make sure the logged-in user is an Admin
  SELECT id
  INTO current_admin_id
  FROM public.employees
  WHERE user_id = auth.uid()
    AND is_admin = TRUE;

  IF current_admin_id IS NULL THEN
    RAISE EXCEPTION 'Only administrators can create payroll records';
  END IF;

  -- Validate employee exists
  IF NOT EXISTS (
    SELECT 1
    FROM public.employees
    WHERE id = target_employee_id
  ) THEN
    RAISE EXCEPTION 'Employee not found';
  END IF;

  -- Validate pay period
  IF period_end < period_start THEN
    RAISE EXCEPTION 'Pay period end cannot be before start date';
  END IF;

  -- Validate salary values
  IF payroll_base_salary < 0 THEN
    RAISE EXCEPTION 'Base salary cannot be negative';
  END IF;

  IF payroll_deductions < 0 THEN
    RAISE EXCEPTION 'Deductions cannot be negative';
  END IF;

  IF payroll_bonuses < 0 THEN
    RAISE EXCEPTION 'Bonuses cannot be negative';
  END IF;

  -- Calculate net pay
  calculated_net_pay :=
    payroll_base_salary
    + payroll_bonuses
    - payroll_deductions;

  -- Prevent negative net pay
  IF calculated_net_pay < 0 THEN
    RAISE EXCEPTION 'Deductions cannot exceed salary plus bonuses';
  END IF;

  -- Create payroll record
  INSERT INTO public.payroll (
    employee_id,
    pay_period_start,
    pay_period_end,
    base_salary,
    deductions,
    bonuses,
    net_pay,
    status
  )
  VALUES (
    target_employee_id,
    period_start,
    period_end,
    payroll_base_salary,
    payroll_deductions,
    payroll_bonuses,
    calculated_net_pay,
    'draft'
  )
  RETURNING *
  INTO new_payroll;

  RETURN new_payroll;

END;
$function$;


CREATE OR REPLACE FUNCTION public.process_payroll(payroll_record_id uuid)
RETURNS public.payroll
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_admin_id UUID;
  payroll_record public.payroll;
BEGIN

  -- Make sure the logged-in user is an Admin
  SELECT id
  INTO current_admin_id
  FROM public.employees
  WHERE user_id = auth.uid()
    AND is_admin = TRUE;

  IF current_admin_id IS NULL THEN
    RAISE EXCEPTION 'Only administrators can process payroll';
  END IF;

  -- Find the payroll record
  SELECT *
  INTO payroll_record
  FROM public.payroll
  WHERE id = payroll_record_id;

  -- Make sure it exists
  IF payroll_record.id IS NULL THEN
    RAISE EXCEPTION 'Payroll record not found';
  END IF;

  -- Only draft payroll can be processed
  IF payroll_record.status <> 'draft' THEN
    RAISE EXCEPTION 'Only draft payroll can be processed';
  END IF;

  -- Mark payroll as processed
  UPDATE public.payroll
  SET
    status = 'processed',
    updated_at = CURRENT_TIMESTAMP
  WHERE id = payroll_record_id
  RETURNING *
  INTO payroll_record;

  RETURN payroll_record;

END;
$function$;


CREATE OR REPLACE FUNCTION public.mark_payroll_paid(payroll_record_id uuid)
RETURNS public.payroll
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_admin_id UUID;
  payroll_record public.payroll;
BEGIN

  -- Make sure the logged-in user is an Admin
  SELECT id
  INTO current_admin_id
  FROM public.employees
  WHERE user_id = auth.uid()
    AND is_admin = TRUE;

  IF current_admin_id IS NULL THEN
    RAISE EXCEPTION 'Only administrators can mark payroll as paid';
  END IF;

  -- Find the payroll record
  SELECT *
  INTO payroll_record
  FROM public.payroll
  WHERE id = payroll_record_id;

  -- Make sure it exists
  IF payroll_record.id IS NULL THEN
    RAISE EXCEPTION 'Payroll record not found';
  END IF;

  -- Only processed payroll can be marked as paid
  IF payroll_record.status <> 'processed' THEN
    RAISE EXCEPTION 'Only processed payroll can be marked as paid';
  END IF;

  -- Mark payroll as paid and record today's payment date
  UPDATE public.payroll
  SET
    status = 'paid',
    payment_date = CURRENT_DATE,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = payroll_record_id
  RETURNING *
  INTO payroll_record;

  RETURN payroll_record;

END;
$function$;


CREATE OR REPLACE FUNCTION public.get_my_payroll()
RETURNS SETOF public.payroll
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_employee_id UUID;
BEGIN

  -- Find the employee profile belonging to the logged-in user
  SELECT id
  INTO current_employee_id
  FROM public.employees
  WHERE user_id = auth.uid();

  -- Make sure the user has an employee profile
  IF current_employee_id IS NULL THEN
    RAISE EXCEPTION 'Employee profile not found';
  END IF;

  -- Return only this employee's payroll records
  RETURN QUERY
  SELECT *
  FROM public.payroll
  WHERE employee_id = current_employee_id
  ORDER BY pay_period_end DESC;

END;
$function$;


CREATE OR REPLACE FUNCTION public.get_all_payroll()
RETURNS TABLE(
  payroll_id uuid,
  employee_id uuid,
  first_name text,
  last_name text,
  department text,
  pay_period_start date,
  pay_period_end date,
  base_salary numeric,
  deductions numeric,
  bonuses numeric,
  net_pay numeric,
  status public.payroll_status,
  payment_date date,
  created_at timestamp without time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN

  -- Only Admin/HR users may view everyone's payroll
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can view all payroll records';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    e.id,
    e.first_name,
    e.last_name,
    e.department,
    p.pay_period_start,
    p.pay_period_end,
    p.base_salary,
    p.deductions,
    p.bonuses,
    p.net_pay,
    p.status,
    p.payment_date,
    p.created_at
  FROM public.payroll p
  JOIN public.employees e
    ON e.id = p.employee_id
  ORDER BY p.pay_period_end DESC, e.first_name ASC;

END;
$function$;


-- ============================================================
-- NOTIFICATION FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_notification(
  target_user_id uuid,
  notification_title text,
  notification_message text,
  notification_type text
)
RETURNS public.notifications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_notification public.notifications;
BEGIN

  -- Only Admins can create system notifications
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can create notifications';
  END IF;

  -- Make sure the target user exists
  IF NOT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = target_user_id
  ) THEN
    RAISE EXCEPTION 'Target user not found';
  END IF;

  -- Create the notification
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type
  )
  VALUES (
    target_user_id,
    notification_title,
    notification_message,
    notification_type
  )
  RETURNING *
  INTO new_notification;

  RETURN new_notification;

END;
$function$;


CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id uuid)
RETURNS public.notifications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  updated_notification public.notifications;
BEGIN

  -- Find and update only the logged-in user's notification
  UPDATE public.notifications
  SET
    is_read = TRUE,
    read_at = CURRENT_TIMESTAMP
  WHERE id = notification_id
    AND user_id = auth.uid()
    AND is_read = FALSE
  RETURNING *
  INTO updated_notification;

  -- Make sure the notification was found and belonged to the user
  IF updated_notification.id IS NULL THEN
    RAISE EXCEPTION 'Notification not found or already marked as read';
  END IF;

  RETURN updated_notification;

END;
$function$;


-- ============================================================
-- AUTOMATIC RLS FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS event_trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL
        AND cmd.schema_name IN ('public')
        AND cmd.schema_name NOT IN ('pg_catalog','information_schema')
        AND cmd.schema_name NOT LIKE 'pg_toast%'
        AND cmd.schema_name NOT LIKE 'pg_temp%'
     THEN
       BEGIN
         EXECUTE format(
           'alter table if exists %s enable row level security',
           cmd.object_identity
         );
         RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
       EXCEPTION
         WHEN OTHERS THEN
           RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
       END;
     ELSE
        RAISE LOG
          'rls_auto_enable: skip % (either system schema or not in enforced list: %.)',
          cmd.object_identity,
          cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;


-- ============================================================
-- END OF BACKEND FUNCTIONS
-- ============================================================
```
