import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

function Employees() {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employees = [
    {
      id: "EMP001",
      name: "John Doe",
      email: "john.doe@dayflow.demo",
      department: "Engineering",
      jobTitle: "Software Engineer",
      status: "Present",
    },
    {
      id: "EMP002",
      name: "Sarah Wilson",
      email: "sarah.wilson@dayflow.demo",
      department: "Human Resources",
      jobTitle: "HR Manager",
      status: "On Leave",
    },
    {
      id: "EMP003",
      name: "Michael Brown",
      email: "michael.brown@dayflow.demo",
      department: "Finance",
      jobTitle: "Accountant",
      status: "Present",
    },
    {
      id: "EMP004",
      name: "Emily Davis",
      email: "emily.davis@dayflow.demo",
      department: "Marketing",
      jobTitle: "Marketing Executive",
      status: "Absent",
    },
    {
      id: "EMP005",
      name: "David Miller",
      email: "david.miller@dayflow.demo",
      department: "Engineering",
      jobTitle: "Frontend Developer",
      status: "Present",
    },
    {
      id: "EMP006",
      name: "Jessica Taylor",
      email: "jessica.taylor@dayflow.demo",
      department: "Sales",
      jobTitle: "Sales Executive",
      status: "Present",
    },
  ];

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase();

    return (
      employee.name.toLowerCase().includes(searchText) ||
      employee.id.toLowerCase().includes(searchText) ||
      employee.department.toLowerCase().includes(searchText) ||
      employee.jobTitle.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Employees
            </h1>

            <p className="text-gray-500 mt-1">
              Manage and view your organization's employees.
            </p>
          </div>

          <button
            className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + Add Employee
          </button>

        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

          <div className="relative">

            <input
              type="text"
              placeholder="Search by name, employee ID, department or job title..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        {/* Employee Count */}
        <div className="mb-4">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredEmployees.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {employees.length}
            </span>{" "}
            employees
          </p>

        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">

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
                    Job Title
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Status
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-100 last:border-0"
                  >

                    {/* Employee */}
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

                    {/* Department */}
                    <td className="py-5 text-sm text-gray-700">
                      {employee.department}
                    </td>

                    {/* Job Title */}
                    <td className="py-5 text-sm text-gray-700">
                      {employee.jobTitle}
                    </td>

                    {/* Status */}
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

                    {/* Action */}
                    <td className="py-5">

                      <button
                        onClick={() => setSelectedEmployee(employee)}
                        className="text-blue-600 font-medium hover:text-blue-800"
                      >
                        View
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            {/* No Results */}
            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">

                <p className="text-gray-500">
                  No employees found.
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Try a different search.
                </p>

              </div>
            )}

          </div>

        </div>

      </main>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8">

            {/* Modal Header */}
            <div className="flex justify-between items-start">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">

                  <span className="text-blue-600 text-lg font-bold">
                    {selectedEmployee.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()}
                  </span>

                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedEmployee.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {selectedEmployee.id}
                  </p>

                </div>

              </div>

              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>

            </div>

            {/* Details */}
            <div className="mt-8 space-y-5">

              <div>
                <p className="text-sm text-gray-400">
                  Email
                </p>

                <p className="font-medium text-gray-800 mt-1">
                  {selectedEmployee.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  Department
                </p>

                <p className="font-medium text-gray-800 mt-1">
                  {selectedEmployee.department}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  Job Title
                </p>

                <p className="font-medium text-gray-800 mt-1">
                  {selectedEmployee.jobTitle}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  Today's Status
                </p>

                <span
                  className={`inline-flex mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                    selectedEmployee.status === "Present"
                      ? "bg-green-100 text-green-700"
                      : selectedEmployee.status === "On Leave"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedEmployee.status}
                </span>
              </div>

            </div>

            {/* Close */}
            <div className="flex justify-end mt-8">

              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Employees;