import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

function AdminAttendance() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const attendance = [
    {
      id: "EMP001",
      name: "John Doe",
      department: "Engineering",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      workingHours: "9h 0m",
      status: "Present",
    },
    {
      id: "EMP002",
      name: "Sarah Wilson",
      department: "Human Resources",
      checkIn: "--",
      checkOut: "--",
      workingHours: "--",
      status: "On Leave",
    },
    {
      id: "EMP003",
      name: "Michael Brown",
      department: "Finance",
      checkIn: "09:12 AM",
      checkOut: "06:05 PM",
      workingHours: "8h 53m",
      status: "Present",
    },
    {
      id: "EMP004",
      name: "Emily Davis",
      department: "Marketing",
      checkIn: "--",
      checkOut: "--",
      workingHours: "--",
      status: "Absent",
    },
    {
      id: "EMP005",
      name: "David Miller",
      department: "Engineering",
      checkIn: "09:25 AM",
      checkOut: "--",
      workingHours: "7h 15m",
      status: "Present",
    },
    {
      id: "EMP006",
      name: "Jessica Taylor",
      department: "Sales",
      checkIn: "08:55 AM",
      checkOut: "05:55 PM",
      workingHours: "9h 0m",
      status: "Present",
    },
  ];

  const filteredAttendance = attendance.filter((employee) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      employee.name.toLowerCase().includes(searchText) ||
      employee.id.toLowerCase().includes(searchText) ||
      employee.department.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "All" || employee.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <AdminSidebar />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Attendance
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor employee attendance and working hours.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Total Employees
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              42
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Present
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              36
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Absent
            </p>

            <p className="text-3xl font-bold text-red-600 mt-2">
              2
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              On Leave
            </p>

            <p className="text-3xl font-bold text-yellow-600 mt-2">
              4
            </p>
          </div>

        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Leave</option>
            </select>

          </div>

        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Today's Attendance
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                August 22, 2026
              </p>
            </div>

            <span className="text-sm text-gray-400">
              {filteredAttendance.length} records
            </span>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-gray-200">

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Employee
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Department
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Check In
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Check Out
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Working Hours
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredAttendance.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-100 last:border-0"
                  >

                    <td className="py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">

                          <span className="text-blue-600 font-semibold">
                            {employee.name
                              .split(" ")
                              .map((name) => name[0])
                              .join("")
                              .toUpperCase()}
                          </span>

                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            {employee.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {employee.id}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="py-5 text-sm text-gray-700">
                      {employee.department}
                    </td>

                    <td className="py-5 text-sm text-gray-700">
                      {employee.checkIn}
                    </td>

                    <td className="py-5 text-sm text-gray-700">
                      {employee.checkOut}
                    </td>

                    <td className="py-5 text-sm text-gray-700">
                      {employee.workingHours}
                    </td>

                    <td className="py-5">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          employee.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : employee.status === "On Leave"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {employee.status}
                      </span>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            {filteredAttendance.length === 0 && (
              <div className="text-center py-12">

                <p className="text-gray-500">
                  No attendance records found.
                </p>

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminAttendance;