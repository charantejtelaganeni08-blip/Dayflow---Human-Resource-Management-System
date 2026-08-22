import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Employees from "./pages/admin/Employees";
import AdminAttendance from "./pages/admin/Attendance";
import AdminLeave from "./pages/admin/Leave";
import AdminPayroll from "./pages/admin/Payroll";

import Login from "./pages/Login";

import EmployeeDashboard from "./pages/employee/Dashboard";
import Profile from "./pages/employee/Profile";
import Attendance from "./pages/employee/Attendance";
import Leave from "./pages/employee/Leave";
import Payroll from "./pages/employee/Payroll";

import AdminDashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/employee"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/employee/profile"
          element={<Profile />}
        />

        <Route
          path="/employee/attendance"
          element={<Attendance />}
        />

        <Route
          path="/employee/leave"
          element={<Leave />}
        />

        <Route
          path="/employee/payroll"
          element={<Payroll />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
        <Route
  path="/admin/attendance"
  element={<AdminAttendance />}
/>
<Route
  path="/admin/leave"
  element={<AdminLeave />}
/>
<Route
  path="/admin/payroll"
  element={<AdminPayroll />}
/>
        <Route
  path="/admin/employees"
  element={<Employees />}
/>

      </Routes>
    </BrowserRouter>
  );
  
}

export default App;