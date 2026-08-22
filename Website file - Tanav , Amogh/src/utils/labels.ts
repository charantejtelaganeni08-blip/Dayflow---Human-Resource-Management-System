import type { AttendanceStatus, LeaveStatus, LeaveType } from '../types/hr';

export const attendanceMeta: Record<
  AttendanceStatus,
  {label: string;dot: string;chip: string;hex: string;}> =
{
  present: {
    label: 'Present',
    dot: 'bg-status-present',
    chip: 'bg-green-50 text-green-700 ring-green-600/20',
    hex: '#16a34a'
  },
  'half-day': {
    label: 'Half-day',
    dot: 'bg-status-halfday',
    chip: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    hex: '#f59e0b'
  },
  absent: {
    label: 'Absent',
    dot: 'bg-status-absent',
    chip: 'bg-red-50 text-red-700 ring-red-600/20',
    hex: '#dc2626'
  },
  leave: {
    label: 'Leave',
    dot: 'bg-status-leave',
    chip: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    hex: '#0ea5e9'
  }
};

export const leaveStatusMeta: Record<LeaveStatus, {label: string;chip: string;}> = {
  pending: { label: 'Pending', chip: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
  approved: { label: 'Approved', chip: 'bg-green-50 text-green-700 ring-green-600/20' },
  rejected: { label: 'Rejected', chip: 'bg-red-50 text-red-700 ring-red-600/20' },
  withdrawn: { label: 'Withdrawn', chip: 'bg-slate-100 text-slate-600 ring-slate-500/20' }
};

export const leaveTypeMeta: Record<LeaveType, {label: string;hex: string;}> = {
  casual: { label: 'Casual', hex: '#4f46e5' },
  sick: { label: 'Sick', hex: '#0ea5e9' },
  earned: { label: 'Earned', hex: '#16a34a' },
  unpaid: { label: 'Unpaid', hex: '#94a3b8' }
};

export const leaveTypes: LeaveType[] = ['casual', 'sick', 'earned', 'unpaid'];