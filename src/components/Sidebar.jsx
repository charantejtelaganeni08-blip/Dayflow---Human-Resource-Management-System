import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}
      <div className="px-6 py-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          Dayflow
        </h1>

        <p className="text-xs text-gray-500 mt-1">
          HR Management System
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">

        <Link
          to="/employee"
          className={`block w-full px-4 py-3 rounded-lg font-medium mb-2 ${
            location.pathname === "/employee"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/employee/profile"
          className={`block w-full px-4 py-3 rounded-lg font-medium mb-2 ${
            location.pathname === "/employee/profile"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Profile
        </Link>

        <Link
          to="/employee/attendance"
          className={`block w-full px-4 py-3 rounded-lg font-medium mb-2 ${
            location.pathname === "/employee/attendance"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Attendance
        </Link>

        <Link
          to="/employee/leave"
          className={`block w-full px-4 py-3 rounded-lg font-medium mb-2 ${
            location.pathname === "/employee/leave"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Leave
        </Link>

        <Link
          to="/employee/payroll"
          className={`block w-full px-4 py-3 rounded-lg font-medium mb-2 ${
            location.pathname === "/employee/payroll"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Payroll
        </Link>

      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50">
          Logout
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;