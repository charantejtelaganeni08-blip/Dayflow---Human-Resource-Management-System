
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { eachDayOfInterval, format, isWeekend, parseISO } from 'date-fns';
import type {
  AppNotification,
  AttendanceRecord,
  AttendanceStatus,
  Employee,
  LeaveRequest,
  LeaveType,
  Payslip,
  Role,
  SalaryStructure,
} from '../types/hr';
import { supabase } from '../lib/supabase';
import { ISO, todayIso } from '../utils/date';

interface NewEmployeeInput {
  id: string;
  name: string;
  workEmail: string;
  password: string;
  role: Role;
}

interface ApplyLeaveInput {
  employeeId: string;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  remarks: string;
}

interface AttendanceCorrection {
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  note: string;
}

interface HRDataValue {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  payslips: Payslip[];
  notifications: AppNotification[];

  getEmployee: (id: string) => Employee | undefined;
  attendanceFor: (id: string) => AttendanceRecord[];
  attendanceOn: (id: string, date: string) => AttendanceRecord | undefined;
  leavesFor: (id: string) => LeaveRequest[];
  payslipsFor: (id: string) => Payslip[];
  notificationsFor: (id: string) => AppNotification[];

  addEmployee: (input: NewEmployeeInput) => Employee;
  verifyEmployee: (id: string) => void;
  updateEmployee: (id: string, patch: Partial<Employee>) => void;

  checkIn: (id: string) => void;
  checkOut: (id: string) => void;
  correctAttendance: (
    employeeId: string,
    date: string,
    correction: AttendanceCorrection
  ) => void;

  applyLeave: (input: ApplyLeaveInput) => LeaveRequest;
  withdrawLeave: (id: string) => void;
  decideLeave: (
    id: string,
    decision: 'approved' | 'rejected',
    comment: string,
    adminId: string
  ) => void;

  updateSalary: (employeeId: string, structure: SalaryStructure) => void;
  publishPayroll: (month: string) => number;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (employeeId: string) => void;
}

const HRDataContext = createContext<HRDataValue | null>(null);

function nowTime(): string {
  return format(new Date(), 'HH:mm');
}

function mapStatus(status: string): AttendanceStatus {
  if (status === 'half_day') return 'half-day';
  return status as AttendanceStatus;
}

function mapLeaveType(type: string): LeaveType {
  if (type === 'paid') return 'casual';
  return type as LeaveType;
}

function mapEmployee(row: any): Employee {
  const salary = Number(row.salary ?? 0);

  return {
    id: row.id,
    name: `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim(),
    workEmail: row.work_email ?? '',
    personalEmail: '',
    phone: row.phone_number ?? '',
    address: '',
    emergency: {
      name: '',
      relationship: '',
      phone: '',
    },
    department: row.department ?? 'Unassigned',
    designation: row.position ?? 'Employee',
    manager: '',
    employmentType: 'Full-time',
    joinDate: row.hire_date ?? '',
    employmentStatus: 'Active',
    role: row.is_admin ? 'admin' : 'employee',
    password: '',
    verified: true,
    verificationCode: '',
    balances: {
      casual: { total: 12, used: 0 },
      sick: { total: 10, used: 0 },
      earned: { total: 18, used: 0 },
      unpaid: { total: 0, used: 0 },
    },
    salary: {
      basic: salary,
      hra: 0,
      allowances: 0,
      tax: 0,
      pf: 0,
    },
  };
}

function mapAttendance(row: any): AttendanceRecord {
  return {
    id: row.id,
    employeeId: row.employee_id,
    date: row.date,
    status: mapStatus(row.status),
    checkIn: row.check_in_time
      ? format(new Date(row.check_in_time), 'HH:mm')
      : undefined,
    checkOut: row.check_out_time
      ? format(new Date(row.check_out_time), 'HH:mm')
      : undefined,
    note: row.notes ?? undefined,
  };
}

function mapLeave(row: any): LeaveRequest {
  const from = row.start_date;
  const to = row.end_date;

  const days =
    eachDayOfInterval({
      start: parseISO(from),
      end: parseISO(to),
    }).filter((day) => !isWeekend(day)).length;

  return {
    id: row.id,
    employeeId: row.employee_id,
    type: mapLeaveType(row.leave_type),
    from,
    to,
    days,
    remarks: row.reason ?? '',
    status: row.status,
    decidedBy: row.approved_by ?? undefined,
    decidedAt: row.approved_at ?? undefined,
    appliedAt: row.created_at,
  };
}

function mapNotification(row: any): AppNotification {
  return {
    id: row.id,
    employeeId: row.user_id,
    title: row.title,
    body: row.message,
    at: row.created_at,
    read: row.is_read,
    href: '/',
  };
}

function mapPayroll(row: any): Payslip {
  const month = row.pay_period_start?.slice(0, 7) ?? '';

  return {
    id: row.id,
    employeeId: row.employee_id,
    month,
    published: row.status !== 'draft',
    structure: {
      basic: Number(row.base_salary ?? 0),
      hra: 0,
      allowances: Number(row.bonuses ?? 0),
      tax: 0,
      pf: Number(row.deductions ?? 0),
    },
  };
}

export function HRDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadData = useCallback(async () => {
    const [
      employeesResult,
      attendanceResult,
      leavesResult,
      payrollResult,
    ] = await Promise.all([
      supabase.from('employees').select('*').order('created_at', {
        ascending: false,
      }),

      supabase.from('attendance').select('*').order('date', {
        ascending: false,
      }),

      supabase.from('leave_requests').select('*').order('created_at', {
        ascending: false,
      }),

      supabase.from('payroll').select('*').order('pay_period_start', {
        ascending: false,
      }),
    ]);

    if (employeesResult.error) {
      console.error('Employees:', employeesResult.error);
    } else {
      setEmployees((employeesResult.data ?? []).map(mapEmployee));
    }

    if (attendanceResult.error) {
      console.error('Attendance:', attendanceResult.error);
    } else {
      setAttendance((attendanceResult.data ?? []).map(mapAttendance));
    }

    if (leavesResult.error) {
      console.error('Leave requests:', leavesResult.error);
    } else {
      setLeaves((leavesResult.data ?? []).map(mapLeave));
    }

    if (payrollResult.error) {
      console.error('Payroll:', payrollResult.error);
    } else {
      setPayslips((payrollResult.data ?? []).map(mapPayroll));
    }

    const { data: notificationRows, error: notificationError } =
      await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

    if (notificationError) {
      console.error('Notifications:', notificationError);
    } else {
      setNotifications(
        (notificationRows ?? []).map(mapNotification)
      );
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getEmployee = useCallback(
    (id: string) => employees.find((employee) => employee.id === id),
    [employees]
  );

  const attendanceFor = useCallback(
    (id: string) =>
      attendance
        .filter((record) => record.employeeId === id)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [attendance]
  );

  const attendanceOn = useCallback(
    (id: string, date: string) =>
      attendance.find(
        (record) =>
          record.employeeId === id && record.date === date
      ),
    [attendance]
  );

  const leavesFor = useCallback(
    (id: string) =>
      leaves
        .filter((request) => request.employeeId === id)
        .sort((a, b) =>
          a.appliedAt < b.appliedAt ? 1 : -1
        ),
    [leaves]
  );

  const payslipsFor = useCallback(
    (id: string) =>
      payslips
        .filter((slip) => slip.employeeId === id)
        .sort((a, b) => (a.month < b.month ? 1 : -1)),
    [payslips]
  );

  const notificationsFor = useCallback(
    (id: string) =>
      notifications
        .filter((item) => item.employeeId === id)
        .sort((a, b) => (a.at < b.at ? 1 : -1)),
    [notifications]
  );

  const addEmployee = useCallback(
    (input: NewEmployeeInput): Employee => {
      const { firstName, lastName } = (() => {
        const parts = input.name.trim().split(/\s+/);

        return {
          firstName: parts[0] ?? '',
          lastName: parts.slice(1).join(' '),
        };
      })();

      const tempEmployee: Employee = {
        id: input.id,
        name: input.name,
        workEmail: input.workEmail,
        personalEmail: '',
        phone: '',
        address: '',
        emergency: {
          name: '',
          relationship: '',
          phone: '',
        },
        department: 'Unassigned',
        designation:
          input.role === 'admin'
            ? 'HR Administrator'
            : 'New Joiner',
        manager: '',
        employmentType: 'Full-time',
        joinDate: todayIso(),
        employmentStatus: 'Active',
        role: input.role,
        password: '',
        verified: false,
        verificationCode: '',
        balances: {
          casual: { total: 12, used: 0 },
          sick: { total: 10, used: 0 },
          earned: { total: 18, used: 0 },
          unpaid: { total: 0, used: 0 },
        },
        salary: {
          basic: 0,
          hra: 0,
          allowances: 0,
          tax: 0,
          pf: 0,
        },
      };

      void supabase.auth.admin;

      return tempEmployee;
    },
    []
  );

  const verifyEmployee = useCallback((_id: string) => {
    // Email verification is now handled by Supabase Auth.
  }, []);

  const updateEmployee = useCallback(
    (id: string, patch: Partial<Employee>) => {
      setEmployees((current) =>
        current.map((employee) =>
          employee.id === id
            ? { ...employee, ...patch }
            : employee
        )
      );

      const dbPatch: Record<string, any> = {};

      if (patch.name) {
        const parts = patch.name.trim().split(/\s+/);
        dbPatch.first_name = parts[0] ?? '';
        dbPatch.last_name = parts.slice(1).join(' ');
      }

      if (patch.department !== undefined) {
        dbPatch.department = patch.department;
      }

      if (patch.designation !== undefined) {
        dbPatch.position = patch.designation;
      }

      if (patch.phone !== undefined) {
        dbPatch.phone_number = patch.phone;
      }

      if (patch.joinDate !== undefined) {
        dbPatch.hire_date = patch.joinDate;
      }

      if (patch.salary?.basic !== undefined) {
        dbPatch.salary = patch.salary.basic;
      }

      if (Object.keys(dbPatch).length > 0) {
        void supabase
          .from('employees')
          .update(dbPatch)
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              console.error('Update employee:', error);
            }
          });
      }
    },
    []
  );

  const checkIn = useCallback((id: string) => {
    const date = todayIso();
    const time = nowTime();
    const timestamp = `${date}T${time}:00`;

    setAttendance((current) => {
      const existing = current.find(
        (record) =>
          record.employeeId === id && record.date === date
      );

      if (existing) {
        return current.map((record) =>
          record.id === existing.id
            ? {
                ...record,
                status: 'present',
                checkIn: time,
              }
            : record
        );
      }

      return [
        ...current,
        {
          id: `temp-${id}-${date}`,
          employeeId: id,
          date,
          status: 'present',
          checkIn: time,
        },
      ];
    });

    void supabase
      .from('attendance')
      .upsert(
        {
          employee_id: id,
          date,
          status: 'present',
          check_in_time: timestamp,
        },
        {
          onConflict: 'employee_id,date',
        }
      )
      .then(({ error }) => {
        if (error) {
          console.error('Check in:', error);
        } else {
          void loadData();
        }
      });
  }, [loadData]);

  const checkOut = useCallback((id: string) => {
    const date = todayIso();
    const time = nowTime();
    const timestamp = `${date}T${time}:00`;

    setAttendance((current) =>
      current.map((record) =>
        record.employeeId === id && record.date === date
          ? { ...record, checkOut: time }
          : record
      )
    );

    void supabase
      .from('attendance')
      .update({
        check_out_time: timestamp,
      })
      .eq('employee_id', id)
      .eq('date', date)
      .then(({ error }) => {
        if (error) {
          console.error('Check out:', error);
        } else {
          void loadData();
        }
      });
  }, [loadData]);

  const correctAttendance = useCallback(
    (
      employeeId: string,
      date: string,
      correction: AttendanceCorrection
    ) => {
      const dbStatus =
        correction.status === 'half-day'
          ? 'half_day'
          : correction.status;

      void supabase
        .from('attendance')
        .upsert(
          {
            employee_id: employeeId,
            date,
            status: dbStatus,
            check_in_time: correction.checkIn
              ? `${date}T${correction.checkIn}:00`
              : null,
            check_out_time: correction.checkOut
              ? `${date}T${correction.checkOut}:00`
              : null,
            notes: correction.note,
          },
          {
            onConflict: 'employee_id,date',
          }
        )
        .then(({ error }) => {
          if (error) {
            console.error('Correct attendance:', error);
          } else {
            void loadData();
          }
        });
    },
    [loadData]
  );

  const applyLeave = useCallback(
    (input: ApplyLeaveInput): LeaveRequest => {
      const dbType =
        input.type === 'casual'
          ? 'paid'
          : input.type;

      const request: LeaveRequest = {
        id: `temp-${Date.now()}`,
        employeeId: input.employeeId,
        type: input.type,
        from: input.from,
        to: input.to,
        days: input.days,
        remarks: input.remarks,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      };

      setLeaves((current) => [request, ...current]);

      void supabase
        .from('leave_requests')
        .insert({
          employee_id: input.employeeId,
          leave_type: dbType,
          start_date: input.from,
          end_date: input.to,
          reason: input.remarks,
          status: 'pending',
        })
        .select()
        .single()
        .then(({ error }) => {
          if (error) {
            console.error('Apply leave:', error);
          } else {
            void loadData();
          }
        });

      return request;
    },
    [loadData]
  );

  const withdrawLeave = useCallback(
    (id: string) => {
      setLeaves((current) =>
        current.map((request) =>
          request.id === id
            ? { ...request, status: 'withdrawn' }
            : request
        )
      );

      void supabase
        .from('leave_requests')
        .update({ status: 'rejected' })
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            console.error('Withdraw leave:', error);
          } else {
            void loadData();
          }
        });
    },
    [loadData]
  );

  const decideLeave = useCallback(
    (
      id: string,
      decision: 'approved' | 'rejected',
      comment: string,
      adminId: string
    ) => {
      void supabase
        .from('leave_requests')
        .update({
          status: decision,
          approved_by: adminId,
          approved_at: new Date().toISOString(),
          reason: comment || undefined,
        })
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            console.error('Decide leave:', error);
          } else {
            void loadData();
          }
        });
    },
    [loadData]
  );

  const updateSalary = useCallback(
    (employeeId: string, structure: SalaryStructure) => {
      setEmployees((current) =>
        current.map((employee) =>
          employee.id === employeeId
            ? { ...employee, salary: structure }
            : employee
        )
      );

      void supabase
        .from('employees')
        .update({
          salary: structure.basic,
        })
        .eq('id', employeeId)
        .then(({ error }) => {
          if (error) {
            console.error('Update salary:', error);
          } else {
            void loadData();
          }
        });
    },
    [loadData]
  );

  const publishPayroll = useCallback(
    (month: string) => {
      let published = 0;

      payslips.forEach((slip) => {
        if (slip.month === month && !slip.published) {
          published += 1;

          void supabase
            .from('payroll')
            .update({
              status: 'processed',
            })
            .eq('id', slip.id);
        }
      });

      void loadData();

      return published;
    },
    [payslips, loadData]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, read: true }
          : item
      )
    );

    void supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', id);
  }, []);

  const markAllNotificationsRead = useCallback(
    (employeeId: string) => {
      const employee = employees.find(
        (item) => item.id === employeeId
      );

      if (!employee) return;

      setNotifications((current) =>
        current.map((item) =>
          item.employeeId === employeeId
            ? { ...item, read: true }
            : item
        )
      );

      void supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('user_id', employeeId);
    },
    [employees]
  );

  const value = useMemo<HRDataValue>(
    () => ({
      employees,
      attendance,
      leaves,
      payslips,
      notifications,
      getEmployee,
      attendanceFor,
      attendanceOn,
      leavesFor,
      payslipsFor,
      notificationsFor,
      addEmployee,
      verifyEmployee,
      updateEmployee,
      checkIn,
      checkOut,
      correctAttendance,
      applyLeave,
      withdrawLeave,
      decideLeave,
      updateSalary,
      publishPayroll,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      employees,
      attendance,
      leaves,
      payslips,
      notifications,
      getEmployee,
      attendanceFor,
      attendanceOn,
      leavesFor,
      payslipsFor,
      notificationsFor,
      addEmployee,
      verifyEmployee,
      updateEmployee,
      checkIn,
      checkOut,
      correctAttendance,
      applyLeave,
      withdrawLeave,
      decideLeave,
      updateSalary,
      publishPayroll,
      markNotificationRead,
      markAllNotificationsRead,
    ]
  );

  return (
    <HRDataContext.Provider value={value}>
      {children}
    </HRDataContext.Provider>
  );
}

export function useHRData(): HRDataValue {
  const context = useContext(HRDataContext);

  if (!context) {
    throw new Error(
      'useHRData must be used within HRDataProvider'
    );
  }

  return context;
}
