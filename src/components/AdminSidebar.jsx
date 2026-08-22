import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-5">

      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold text-blue-600">
          Dayflow
        </h1>

        <p className="text-xs text-gray-400 mt-1">
          Admin Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">

        <NavLink
          to="/admin"
          end
          className={linkClass}
        >
          <span>📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/employees"
          className={linkClass}
        >
          <span>👥</span>
          <span>Employees</span>
        </NavLink>

        <NavLink
          to="/admin/attendance"
          className={linkClass}
        >
          <span>🕒</span>
          <span>Attendance</span>
        </NavLink>

        <NavLink
          to="/admin/leave"
          className={linkClass}
        >
          <span>📋</span>
          <span>Leave Requests</span>
        </NavLink>

        <NavLink
          to="/admin/payroll"
          className={linkClass}
        >
          <span>💰</span>
          <span>Payroll</span>
        </NavLink>

      </nav>

      {/* Admin Information */}
      <div className="mt-auto pt-10">

        <div className="border-t border-gray-200 pt-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                A
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                Admin
              </p>

              <p className="text-xs text-gray-400">
                Administrator
              </p>
            </div>

          </div>

        </div>

      </div>

    </aside>
  );
}

export default AdminSidebar;