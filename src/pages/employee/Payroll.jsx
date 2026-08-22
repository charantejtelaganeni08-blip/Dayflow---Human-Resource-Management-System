import { useState } from "react";
import Sidebar from "../../components/Sidebar";

function Payroll() {
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const payslips = [
    {
      month: "August 2026",
      gross: "₹50,000",
      deductions: "₹4,000",
      net: "₹46,000",
      date: "August 31, 2026",
    },
    {
      month: "July 2026",
      gross: "₹50,000",
      deductions: "₹4,000",
      net: "₹46,000",
      date: "July 31, 2026",
    },
    {
      month: "June 2026",
      gross: "₹50,000",
      deductions: "₹4,500",
      net: "₹45,500",
      date: "June 30, 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <Sidebar />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Payroll
          </h1>

          <p className="text-gray-500 mt-1">
            View your salary information and payslips.
          </p>
        </div>

        {/* Salary Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Monthly Salary
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              ₹50,000
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Gross monthly salary
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Total Deductions
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              ₹4,000
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Estimated monthly deductions
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Net Salary
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              ₹46,000
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Take-home salary
            </p>
          </div>

        </div>

        {/* Current Salary Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Salary Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Earnings */}
            <div>

              <h3 className="font-medium text-gray-700 mb-4">
                Earnings
              </h3>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Basic Salary
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹25,000
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    House Allowance
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹10,000
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Transport Allowance
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹5,000
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Other Allowance
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹10,000
                  </span>
                </div>

                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold text-gray-700">
                    Gross Salary
                  </span>

                  <span className="font-bold text-gray-800">
                    ₹50,000
                  </span>
                </div>

              </div>

            </div>

            {/* Deductions */}
            <div>

              <h3 className="font-medium text-gray-700 mb-4">
                Deductions
              </h3>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Tax
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹3,000
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Other Deductions
                  </span>

                  <span className="font-medium text-gray-800">
                    ₹1,000
                  </span>
                </div>

                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold text-gray-700">
                    Total Deductions
                  </span>

                  <span className="font-bold text-gray-800">
                    ₹4,000
                  </span>
                </div>

                <div className="bg-green-50 rounded-lg p-4 flex justify-between">
                  <span className="font-semibold text-green-700">
                    Net Salary
                  </span>

                  <span className="font-bold text-green-700">
                    ₹46,000
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Payslips */}
        <div className="bg-white rounded-xl shadow-sm p-8">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Payslips
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View your recent salary statements.
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-gray-200">

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Month
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Gross Salary
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

                {payslips.map((payslip, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 last:border-0"
                  >

                    <td className="py-4 text-sm text-gray-700">
                      {payslip.month}
                    </td>

                    <td className="py-4 text-sm text-gray-700">
                      {payslip.gross}
                    </td>

                    <td className="py-4 text-sm text-gray-700">
                      {payslip.deductions}
                    </td>

                    <td className="py-4 text-sm font-medium text-green-600">
                      {payslip.net}
                    </td>

                    <td className="py-4">

                      <button
                        onClick={() => setSelectedPayslip(payslip)}
                        className="text-blue-600 font-medium hover:text-blue-800"
                      >
                        View Payslip
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

      {/* Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8">

            <div className="flex justify-between items-start mb-6">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Dayflow Payslip
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedPayslip.month}
                </p>
              </div>

              <button
                onClick={() => setSelectedPayslip(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>

            </div>

            {/* Employee Details */}
            <div className="border-b pb-5 mb-5">

              <p className="text-sm text-gray-500">
                Employee
              </p>

              <p className="font-semibold text-gray-800">
                John Doe
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Employee ID: EMP001
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Software Engineer
              </p>

            </div>

            {/* Earnings */}
            <div className="space-y-3">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Basic Salary
                </span>

                <span>
                  ₹25,000
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Allowances
                </span>

                <span>
                  ₹25,000
                </span>
              </div>

              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold">
                  Gross Salary
                </span>

                <span className="font-semibold">
                  {selectedPayslip.gross}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Deductions
                </span>

                <span>
                  -{selectedPayslip.deductions}
                </span>
              </div>

              <div className="bg-green-50 rounded-lg p-4 flex justify-between mt-4">

                <span className="font-bold text-green-700">
                  Net Salary
                </span>

                <span className="font-bold text-green-700">
                  {selectedPayslip.net}
                </span>

              </div>

            </div>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t">

              <p className="text-xs text-gray-400">
                Payslip generated for {selectedPayslip.date}.
              </p>

            </div>

            <div className="flex justify-end mt-6">

              <button
                onClick={() => setSelectedPayslip(null)}
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

export default Payroll;