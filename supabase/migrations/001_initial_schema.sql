-- ============================================================
-- DAYFLOW HRMS - INITIAL DATABASE SCHEMA
-- Creates the 5 MVP tables
-- ============================================================

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE attendance_status AS ENUM (
  'present',
  'absent',
  'half_day',
  'leave'
);

CREATE TYPE leave_type AS ENUM (
  'paid',
  'sick',
  'unpaid'
);

CREATE TYPE leave_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE payroll_status AS ENUM (
  'draft',
  'processed',
  'paid'
);


-- ============================================================
-- TABLE 1: employees
-- ============================================================

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Links employee to Supabase Auth user
  user_id UUID NOT NULL UNIQUE
    REFERENCES auth.users(id) ON DELETE CASCADE,

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  department TEXT,
  position TEXT,

  salary DECIMAL(12, 2) NOT NULL
    CHECK (salary >= 0),

  hire_date DATE NOT NULL,
  phone_number TEXT,

  -- FALSE = Employee
  -- TRUE = Admin/HR
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- TABLE 2: attendance
-- ============================================================

CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  employee_id UUID NOT NULL
    REFERENCES employees(id) ON DELETE CASCADE,

  date DATE NOT NULL,
  status attendance_status NOT NULL,

  check_in_time TIMESTAMP,
  check_out_time TIMESTAMP,
  notes TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- One attendance record per employee per day
  UNIQUE(employee_id, date),

  -- Check-out cannot be earlier than check-in
  CHECK (
    check_out_time IS NULL
    OR check_in_time IS NULL
    OR check_out_time >= check_in_time
  )
);

CREATE INDEX idx_attendance_employee_id
  ON attendance(employee_id);

CREATE INDEX idx_attendance_date
  ON attendance(date);


-- ============================================================
-- TABLE 3: leave_requests
-- ============================================================

CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  employee_id UUID NOT NULL
    REFERENCES employees(id) ON DELETE CASCADE,

  leave_type leave_type NOT NULL,

  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  reason TEXT,

  status leave_status NOT NULL DEFAULT 'pending',

  -- Admin/HR employee who approved/rejected the request
  approved_by UUID
    REFERENCES employees(id) ON DELETE SET NULL,

  approved_at TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CHECK (end_date >= start_date)
);

CREATE INDEX idx_leave_requests_employee_id
  ON leave_requests(employee_id);

CREATE INDEX idx_leave_requests_status
  ON leave_requests(status);


-- ============================================================
-- TABLE 4: payroll
-- ============================================================

CREATE TABLE payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  employee_id UUID NOT NULL
    REFERENCES employees(id) ON DELETE CASCADE,

  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,

  base_salary DECIMAL(12, 2) NOT NULL
    CHECK (base_salary >= 0),

  deductions DECIMAL(12, 2) NOT NULL DEFAULT 0
    CHECK (deductions >= 0),

  bonuses DECIMAL(12, 2) NOT NULL DEFAULT 0
    CHECK (bonuses >= 0),

  net_pay DECIMAL(12, 2) NOT NULL
    CHECK (net_pay >= 0),

  status payroll_status NOT NULL DEFAULT 'draft',

  payment_date DATE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CHECK (pay_period_end >= pay_period_start),

  -- Prevent duplicate payroll for the same employee/pay period
  UNIQUE(employee_id, pay_period_start, pay_period_end)
);

CREATE INDEX idx_payroll_employee_id
  ON payroll(employee_id);

CREATE INDEX idx_payroll_pay_period_start
  ON payroll(pay_period_start);


-- ============================================================
-- TABLE 5: notifications
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Links notification to Supabase Auth user
  user_id UUID NOT NULL
    REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,

  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CHECK (
    (is_read = TRUE AND read_at IS NOT NULL)
    OR
    (is_read = FALSE AND read_at IS NULL)
  )
);

CREATE INDEX idx_notifications_user_id
  ON notifications(user_id);

CREATE INDEX idx_notifications_is_read
  ON notifications(is_read);


-- ============================================================
-- END OF INITIAL DATABASE SCHEMA
-- ============================================================
