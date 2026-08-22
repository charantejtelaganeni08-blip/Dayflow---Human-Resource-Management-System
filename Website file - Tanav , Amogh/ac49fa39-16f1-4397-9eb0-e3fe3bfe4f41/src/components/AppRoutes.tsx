import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { SignIn } from '../pages/auth/SignIn';
import { SignUp } from '../pages/auth/SignUp';
import { VerifyEmail } from '../pages/auth/VerifyEmail';
import { EmployeeDashboard } from '../pages/employee/Dashboard';
import { MyAttendance } from '../pages/employee/MyAttendance';
import { MyLeave } from '../pages/employee/MyLeave';
import { Payslips } from '../pages/employee/Payslips';
import { Profile } from '../pages/Profile';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { Employees } from '../pages/admin/Employees';
import { EmployeeDetail } from '../pages/admin/EmployeeDetail';
import { AdminAttendance } from '../pages/admin/AdminAttendance';
import { LeaveApprovals } from '../pages/admin/LeaveApprovals';
import { Payroll } from '../pages/admin/Payroll';
import { Reports } from '../pages/admin/Reports';
import { useAuth } from '../contexts/AuthContext';

export function AppRoutes() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>);

  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={isAdmin ? <AdminDashboard /> : <EmployeeDashboard />} />
        <Route path="/profile" element={<Profile />} />

        {!isAdmin &&
        <>
            <Route path="/attendance" element={<MyAttendance />} />
            <Route path="/leave" element={<MyLeave />} />
            <Route path="/payslips" element={<Payslips />} />
          </>
        }

        {isAdmin &&
        <>
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/employees/:employeeId" element={<EmployeeDetail />} />
            <Route path="/admin/attendance" element={<AdminAttendance />} />
            <Route path="/admin/leave" element={<LeaveApprovals />} />
            <Route path="/admin/payroll" element={<Payroll />} />
            <Route path="/admin/reports" element={<Reports />} />
          </>
        }

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>);

}