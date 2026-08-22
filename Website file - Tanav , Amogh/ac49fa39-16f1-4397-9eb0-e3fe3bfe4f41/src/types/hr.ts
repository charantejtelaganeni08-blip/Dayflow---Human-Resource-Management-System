export type Role = 'admin' | 'employee';

export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'leave';

export type LeaveType = 'casual' | 'sick' | 'earned' | 'unpaid';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface SalaryStructure {
  basic: number;
  hra: number;
  allowances: number;
  tax: number;
  pf: number;
}

export interface LeaveBalance {
  total: number;
  used: number;
}

export interface Employee {
  id: string;
  name: string;
  workEmail: string;
  personalEmail: string;
  phone: string;
  address: string;
  emergency: EmergencyContact;
  department: string;
  designation: string;
  manager: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  joinDate: string;
  employmentStatus: 'Active' | 'On notice' | 'Inactive';
  role: Role;
  avatarUrl?: string;
  password: string;
  verified: boolean;
  verificationCode: string;
  balances: Record<LeaveType, LeaveBalance>;
  salary: SalaryStructure;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  note?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  remarks: string;
  status: LeaveStatus;
  decisionComment?: string;
  decidedBy?: string;
  appliedAt: string;
  decidedAt?: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  month: string;
  published: boolean;
  structure: SalaryStructure;
}

export interface AppNotification {
  id: string;
  employeeId: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  href: string;
}