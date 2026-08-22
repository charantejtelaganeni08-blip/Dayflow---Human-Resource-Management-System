import React from 'react';
import {
  BarChart3Icon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  LayoutDashboardIcon,
  ReceiptIndianRupeeIcon,
  UserIcon,
  UsersIcon,
  WalletIcon } from
'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

export const employeeNav: NavItem[] = [
{ to: '/', label: 'Dashboard', icon: <LayoutDashboardIcon className="h-4 w-4" />, end: true },
{ to: '/attendance', label: 'My Attendance', icon: <CalendarCheckIcon className="h-4 w-4" /> },
{ to: '/leave', label: 'Leave', icon: <CalendarDaysIcon className="h-4 w-4" /> },
{ to: '/payslips', label: 'Payslips', icon: <ReceiptIndianRupeeIcon className="h-4 w-4" /> },
{ to: '/profile', label: 'Profile', icon: <UserIcon className="h-4 w-4" /> }];


export const adminNav: NavItem[] = [
{ to: '/', label: 'Dashboard', icon: <LayoutDashboardIcon className="h-4 w-4" />, end: true },
{ to: '/admin/employees', label: 'Employees', icon: <UsersIcon className="h-4 w-4" /> },
{ to: '/admin/attendance', label: 'Attendance', icon: <CalendarCheckIcon className="h-4 w-4" /> },
{ to: '/admin/leave', label: 'Leave Approvals', icon: <CalendarDaysIcon className="h-4 w-4" /> },
{ to: '/admin/payroll', label: 'Payroll', icon: <WalletIcon className="h-4 w-4" /> },
{ to: '/admin/reports', label: 'Reports', icon: <BarChart3Icon className="h-4 w-4" /> },
{ to: '/profile', label: 'Profile', icon: <UserIcon className="h-4 w-4" /> }];