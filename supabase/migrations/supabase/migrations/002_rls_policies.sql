-- ============================================================
-- DAYFLOW HRMS - ROW LEVEL SECURITY POLICIES
-- ============================================================


-- ============================================================
-- HELPER FUNCTION
-- Determines whether the current authenticated user is Admin/HR
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
-- ENABLE RLS
-- ============================================================

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- EMPLOYEES POLICIES
-- ============================================================

CREATE POLICY "Employees can view own profile or admins can view all"
ON public.employees
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_admin()
);


CREATE POLICY "Employees can update own profile or admins can update all"
ON public.employees
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_admin()
)
WITH CHECK (
  user_id = auth.uid()
  OR public.is_admin()
);


CREATE POLICY "Admins can create employees"
ON public.employees
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin()
);


CREATE POLICY "Admins can delete employees"
ON public.employees
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);


-- ============================================================
-- ATTENDANCE POLICIES
-- ============================================================

CREATE POLICY "Users can view own attendance or admins can view all"
ON public.attendance
FOR SELECT
TO authenticated
USING (
  employee_id IN (
    SELECT id
    FROM public.employees
    WHERE user_id = auth.uid()
  )
  OR public.is_admin()
);


CREATE POLICY "Employees can create own attendance"
ON public.attendance
FOR INSERT
TO authenticated
WITH CHECK (
  employee_id IN (
    SELECT id
    FROM public.employees
    WHERE user_id = auth.uid()
  )
);


CREATE POLICY "Users can update own attendance or admins can update all"
ON public.attendance
FOR UPDATE
TO authenticated
USING (
  employee_id IN (
    SELECT id
    FROM public.employees
    WHERE user_id = auth.uid()
  )
  OR public.is_admin()
)
WITH CHECK (
  employee_id IN (
    SELECT id
    FROM public.employees
    WHERE user_id = auth.uid()
  )
  OR public.is_admin()
);


CREATE POLICY "Admins can delete attendance"
ON public.attendance
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);


-- ============================================================
-- LEAVE REQUEST POLICIES
-- ============================================================

CREATE POLICY "Users can view own leave or admins can view all"
ON public.leave_requests
FOR SELECT
TO authenticated
USING (
  employee_id IN (
    SELECT id
    FROM public.employees
    WHERE user_id = auth.uid()
  )
  OR public.is_admin()
);


CREATE POLICY "Employees can create own leave requests"
ON public.leave_requests
FOR INSERT
TO authenticated
WITH CHECK (
  employee_id IN (
    SELECT id
    FROM public.employees
    WHERE user_id = auth.uid()
  )
);


CREATE POLICY "Users can update own leave or admins can update all"
ON public.leave_requests
FOR UPDATE
TO authenticated
USING (
  employee_id IN (
    SELECT id
    FROM public.employees
    WHERE user_id = auth.uid()
  )
  OR public.is_admin()
)
WITH CHECK (
  employee_id IN (
    SELECT id
    FROM public.employees
    WHERE user_id = auth.uid()
  )
  OR public.is_admin()
);


CREATE POLICY "Admins can delete leave requests"
ON public.leave_requests
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);


-- ============================================================
-- PAYROLL POLICIES
-- ============================================================

CREATE POLICY "Users can view own payroll or admins can view all"
ON public.payroll
FOR SELECT
TO authenticated
USING (
  employee_id IN (
    SELECT id
    FROM public.employees
    WHERE user_id = auth.uid()
  )
  OR public.is_admin()
);


CREATE POLICY "Admins can create payroll"
ON public.payroll
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin()
);


CREATE POLICY "Admins can update payroll"
ON public.payroll
FOR UPDATE
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);


CREATE POLICY "Admins can delete payroll"
ON public.payroll
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);


-- ============================================================
-- NOTIFICATION POLICIES
-- ============================================================

CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);


CREATE POLICY "Users can update own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
)
WITH CHECK (
  user_id = auth.uid()
);


CREATE POLICY "Users can delete own notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
);


-- ============================================================
-- END OF RLS POLICIES
-- ============================================================

