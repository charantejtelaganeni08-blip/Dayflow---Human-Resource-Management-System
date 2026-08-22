import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
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
  SalaryStructure } from
'../types/hr';
import {
  buildAttendance,
  buildEmployees,
  buildLeaveRequests,
  buildNotifications,
  buildPayslips } from
'../data/seed';
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
  correctAttendance: (employeeId: string, date: string, correction: AttendanceCorrection) => void;
  applyLeave: (input: ApplyLeaveInput) => LeaveRequest;
  withdrawLeave: (id: string) => void;
  decideLeave: (id: string, decision: 'approved' | 'rejected', comment: string, adminId: string) => void;
  updateSalary: (employeeId: string, structure: SalaryStructure) => void;
  publishPayroll: (month: string) => number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (employeeId: string) => void;
}

const HRDataContext = createContext<HRDataValue | null>(null);

function nowTime(): string {
  return format(new Date(), 'HH:mm');
}

export function HRDataProvider({ children }: {children: React.ReactNode;}) {
  const [employees, setEmployees] = useState<Employee[]>(() => buildEmployees());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => buildAttendance(buildEmployees()));
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => buildLeaveRequests(buildEmployees()));
  const [payslips, setPayslips] = useState<Payslip[]>(() => buildPayslips(buildEmployees()));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => buildNotifications());

  const pushNotification = useCallback(
    (employeeId: string, title: string, body: string, href: string) => {
      setNotifications((current) => [
      {
        id: `ntf-${Math.random().toString(36).slice(2, 9)}`,
        employeeId,
        title,
        body,
        at: new Date().toISOString(),
        read: false,
        href
      },
      ...current]
      );
    },
    []
  );

  const getEmployee = useCallback(
    (id: string) => employees.find((employee) => employee.id === id),
    [employees]
  );

  const attendanceFor = useCallback(
    (id: string) =>
    attendance.
    filter((record) => record.employeeId === id).
    sort((a, b) => a.date < b.date ? 1 : -1),
    [attendance]
  );

  const attendanceOn = useCallback(
    (id: string, date: string) =>
    attendance.find((record) => record.employeeId === id && record.date === date),
    [attendance]
  );

  const leavesFor = useCallback(
    (id: string) =>
    leaves.
    filter((request) => request.employeeId === id).
    sort((a, b) => a.appliedAt < b.appliedAt ? 1 : -1),
    [leaves]
  );

  const payslipsFor = useCallback(
    (id: string) =>
    payslips.
    filter((slip) => slip.employeeId === id).
    sort((a, b) => a.month < b.month ? 1 : -1),
    [payslips]
  );

  const notificationsFor = useCallback(
    (id: string) =>
    notifications.
    filter((item) => item.employeeId === id).
    sort((a, b) => a.at < b.at ? 1 : -1),
    [notifications]
  );

  const addEmployee = useCallback((input: NewEmployeeInput) => {
    const employee: Employee = {
      id: input.id,
      name: input.name,
      workEmail: input.workEmail,
      personalEmail: '',
      phone: '',
      address: '',
      emergency: { name: '', relationship: '', phone: '' },
      department: 'Unassigned',
      designation: input.role === 'admin' ? 'HR Administrator' : 'New Joiner',
      manager: 'Priya Menon',
      employmentType: 'Full-time',
      joinDate: todayIso(),
      employmentStatus: 'Active',
      role: input.role,
      password: input.password,
      verified: false,
      verificationCode: String(Math.floor(100000 + Math.random() * 900000)),
      balances: {
        casual: { total: 12, used: 0 },
        sick: { total: 10, used: 0 },
        earned: { total: 18, used: 0 },
        unpaid: { total: 0, used: 0 }
      },
      salary: { basic: 80000, hra: 32000, allowances: 16000, tax: 9600, pf: 9600 }
    };
    setEmployees((current) => [...current, employee]);
    return employee;
  }, []);

  const verifyEmployee = useCallback((id: string) => {
    setEmployees((current) =>
    current.map((employee) => employee.id === id ? { ...employee, verified: true } : employee)
    );
  }, []);

  const updateEmployee = useCallback((id: string, patch: Partial<Employee>) => {
    setEmployees((current) =>
    current.map((employee) => employee.id === id ? { ...employee, ...patch } : employee)
    );
  }, []);

  const checkIn = useCallback((id: string) => {
    const date = todayIso();
    setAttendance((current) => {
      const existing = current.find((record) => record.employeeId === id && record.date === date);
      if (existing) {
        return current.map((record) =>
        record === existing ? { ...record, status: 'present', checkIn: record.checkIn ?? nowTime() } : record
        );
      }
      return [
      ...current,
      { id: `att-${id}-${date}`, employeeId: id, date, status: 'present', checkIn: nowTime() }];

    });
  }, []);

  const checkOut = useCallback((id: string) => {
    const date = todayIso();
    setAttendance((current) =>
    current.map((record) =>
    record.employeeId === id && record.date === date ?
    { ...record, checkOut: nowTime() } :
    record
    )
    );
  }, []);

  const correctAttendance = useCallback(
    (employeeId: string, date: string, correction: AttendanceCorrection) => {
      setAttendance((current) => {
        const existing = current.find(
          (record) => record.employeeId === employeeId && record.date === date
        );
        if (existing) {
          return current.map((record) =>
          record === existing ? { ...record, ...correction } : record
          );
        }
        return [...current, { id: `att-${employeeId}-${date}`, employeeId, date, ...correction }];
      });
      pushNotification(
        employeeId,
        'Attendance updated by HR',
        `Your record for ${date} was set to ${correction.status}. Reason: ${correction.note}`,
        '/attendance'
      );
    },
    [pushNotification]
  );

  const applyLeave = useCallback(
    (input: ApplyLeaveInput) => {
      const request: LeaveRequest = {
        id: `lv-${Math.random().toString(36).slice(2, 8)}`,
        ...input,
        status: 'pending',
        appliedAt: new Date().toISOString()
      };
      setLeaves((current) => [request, ...current]);
      const admins = employees.filter((employee) => employee.role === 'admin');
      const applicant = employees.find((employee) => employee.id === input.employeeId);
      admins.forEach((admin) =>
      pushNotification(
        admin.id,
        'New leave request',
        `${applicant?.name ?? input.employeeId} requested ${input.days} day${input.days === 1 ? '' : 's'} of ${input.type} leave.`,
        '/admin/leave'
      )
      );
      return request;
    },
    [employees, pushNotification]
  );

  const withdrawLeave = useCallback((id: string) => {
    setLeaves((current) =>
    current.map((request) => request.id === id ? { ...request, status: 'withdrawn' } : request)
    );
  }, []);

  const decideLeave = useCallback(
    (id: string, decision: 'approved' | 'rejected', comment: string, adminId: string) => {
      const request = leaves.find((item) => item.id === id);
      if (!request) return;

      setLeaves((current) =>
      current.map((item) =>
      item.id === id ?
      {
        ...item,
        status: decision,
        decisionComment: comment,
        decidedBy: adminId,
        decidedAt: new Date().toISOString()
      } :
      item
      )
      );

      if (decision === 'approved') {
        setEmployees((current) =>
        current.map((employee) =>
        employee.id === request.employeeId ?
        {
          ...employee,
          balances: {
            ...employee.balances,
            [request.type]: {
              ...employee.balances[request.type],
              used: employee.balances[request.type].used + request.days
            }
          }
        } :
        employee
        )
        );

        const days = eachDayOfInterval({ start: parseISO(request.from), end: parseISO(request.to) }).
        filter((day) => !isWeekend(day)).
        map((day) => format(day, ISO));

        setAttendance((current) => {
          const next = [...current];
          days.forEach((date) => {
            const index = next.findIndex(
              (record) => record.employeeId === request.employeeId && record.date === date
            );
            const leaveRecord: AttendanceRecord = {
              id: `att-${request.employeeId}-${date}`,
              employeeId: request.employeeId,
              date,
              status: 'leave',
              note: 'Approved leave'
            };
            if (index >= 0) next[index] = leaveRecord;else
            next.push(leaveRecord);
          });
          return next;
        });
      }

      pushNotification(
        request.employeeId,
        decision === 'approved' ? 'Leave approved' : 'Leave rejected',
        comment || `Your ${request.type} leave request was ${decision}.`,
        '/leave'
      );
    },
    [leaves, pushNotification]
  );

  const updateSalary = useCallback(
    (employeeId: string, structure: SalaryStructure) => {
      setEmployees((current) =>
      current.map((employee) =>
      employee.id === employeeId ? { ...employee, salary: structure } : employee
      )
      );
      setPayslips((current) =>
      current.map((slip) =>
      slip.employeeId === employeeId && !slip.published ? { ...slip, structure } : slip
      )
      );
      pushNotification(
        employeeId,
        'Salary structure updated',
        'Your salary structure was revised by HR. Open payslips to review it.',
        '/payslips'
      );
    },
    [pushNotification]
  );

  const publishPayroll = useCallback(
    (month: string) => {
      let published = 0;
      setPayslips((current) =>
      current.map((slip) => {
        if (slip.month === month && !slip.published) {
          published += 1;
          return { ...slip, published: true };
        }
        return slip;
      })
      );
      employees.forEach((employee) =>
      pushNotification(
        employee.id,
        'Payslip published',
        `Your payslip for ${month} is now available.`,
        '/payslips'
      )
      );
      return published;
    },
    [employees, pushNotification]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((current) =>
    current.map((item) => item.id === id ? { ...item, read: true } : item)
    );
  }, []);

  const markAllNotificationsRead = useCallback((employeeId: string) => {
    setNotifications((current) =>
    current.map((item) => item.employeeId === employeeId ? { ...item, read: true } : item)
    );
  }, []);

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
      markAllNotificationsRead
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
    markAllNotificationsRead]

  );

  return <HRDataContext.Provider value={value}>{children}</HRDataContext.Provider>;
}

export function useHRData(): HRDataValue {
  const context = useContext(HRDataContext);
  if (!context) throw new Error('useHRData must be used within HRDataProvider');
  return context;
}