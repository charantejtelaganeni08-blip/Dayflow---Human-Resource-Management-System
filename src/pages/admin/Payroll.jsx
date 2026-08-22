import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

function AdminPayroll() {
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const payroll = [
    {
      id: "EMP001",
      name: "John Doe",
      department: "Engineering",
      jobTitle: "Software Engineer",
      basic: "₹25,000",
      allowances: "₹25,000",
      gross: "₹50,000",
      deductions: "₹4,000",
      net: "₹46,000",
    },
    {
      id: "EMP002",
      name: "Sarah Wilson",
      department: "Human Resources",
      jobTitle: "HR Manager",
      basic: "₹30,000",
      allowances: "₹20,000",
      gross: "₹50,000",
      deductions: "₹5,000",
      net: "₹45,000",
    },
    {
      id: "EMP003",
      name: "Michael Brown",
      department: "Finance",
      jobTitle: "Accountant",
      basic: "₹24,000",
      allowances: "₹16,000",
      gross: "₹40,000",
      deductions: "₹3,500",
      net: "₹36,500",
    },
    {
      id: "EMP004",
      name: "Emily Davis",
      department: "Marketing",
      jobTitle: "Marketing Executive",
      basic: "₹22,000",
      allowances: "₹13,000",
      gross: "₹35,000",
      deductions: "₹3,000",
      net: "₹32,000",
    },
    {
      id: "EMP005",
      name: "David Miller",
      department: "Engineering",
      jobTitle: "Frontend Developer",
      basic: "₹28,000",
      allowances: "₹22,000",
      gross: "₹50,000",
      deductions: "₹4,000",
      net: "₹46,000",
    },
  ];

  const filteredPayroll = payroll.filter((employee) => {
    const text = search.toLowerCase();

    return (
      employee.name.toLowerCase().includes(text) ||
      employee.id.toLowerCase().includes(text) ||
      employee.department.toLowerCase().includes(text)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <AdminSidebar />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Payroll
          </h1>

          <p className="text-gray-500 mt-1">
            Manage employee salaries and payroll information.
          </p>

        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Employees
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              42
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Active employees
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Monthly Payroll
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              ₹18.5L
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Estimated gross payroll
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Payroll Status
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              Processed
            </p>

            <p className="text-sm text-gray-400 mt-1">
              August 2026
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          <div className="mb-6">

            <h2 className="text-xl font-semibold text-gray-800">
              Employee Payroll
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              August 2026 payroll information.
            </p>

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
                    Gross
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Deductions
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Net Salary
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredPayroll.map((employee) => (

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
                      {employee.gross}
                    </td>

                    <td className="py-5 text-sm text-gray-700">
                      {employee.deductions}
                    </td>

                    <td className="py-5 text-sm font-semibold text-green-600">
                      {employee.net}
                    </td>

                    <td className="py-5">

                      <button
                        onClick={() => setSelectedEmployee(employee)}
                        className="text-blue-600 font-medium hover:text-blue-800"
                      >
                        View Payslip
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {filteredPayroll.length === 0 && (

              <div className="text-center py-12">

                <p className="text-gray-500">
                  No employees found.
                </p>

              </div>

            )}

          </div>

        </div>

      </main>

      {/* Payslip Modal */}
      {selectedEmployee && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8">

            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Employee Payslip
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  August 2026
                </p>

              </div>

              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>

            </div>

            {/* Employee */}
            <div className="border-b pb-5 mb-5">

              <p className="font-semibold text-gray-800">
                {selectedEmployee.name}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {selectedEmployee.id}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {selectedEmployee.jobTitle}
              </p>

            </div>

            {/* Salary */}
            <div className="space-y-4">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Basic Salary
                </span>

                <span className="font-medium">
                  {selectedEmployee.basic}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Allowances
                </span>

                <span className="font-medium">
                  {selectedEmployee.allowances}
                </span>
              </div>

              <div className="flex justify-between border-t pt-4">
                <span className="font-semibold">
                  Gross Salary
                </span>

                <span className="font-semibold">
                  {selectedEmployee.gross}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Deductions
                </span>

                <span className="font-medium">
                  -{selectedEmployee.deductions}
                </span>
              </div>

              <div className="bg-green-50 rounded-lg p-4 flex justify-between">

                <span className="font-bold text-green-700">
                  Net Salary
                </span>

                <span className="font-bold text-green-700">
                  {selectedEmployee.net}
                </span>

              </div>

            </div>

            {/* Close */}
            <div className="flex justify-end mt-6">

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

export default AdminPayroll;