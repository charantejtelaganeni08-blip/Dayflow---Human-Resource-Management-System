import Sidebar from "../../components/Sidebar";

function EmployeeDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">

      <Sidebar />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome back, Employee
          </h2>

          <p className="text-gray-500 mt-1">
            Here's what's happening with your work today.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Attendance */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Today's Attendance
            </p>

            <p className="text-2xl font-bold text-green-600 mt-2">
              Present
            </p>

            <p className="text-sm text-gray-400 mt-1">
              09:12 AM - Working
            </p>
          </div>

          {/* Leave */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Leave Requests
            </p>

            <p className="text-2xl font-bold text-gray-800 mt-2">
              2
            </p>

            <p className="text-sm text-gray-400 mt-1">
              1 pending request
            </p>
          </div>

          {/* Payroll */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Net Salary
            </p>

            <p className="text-2xl font-bold text-gray-800 mt-2">
              ₹50,000
            </p>

            <p className="text-sm text-gray-400 mt-1">
              August 2026
            </p>
          </div>

        </div>

        {/* Today's Attendance */}
        <div className="bg-white rounded-xl shadow-sm mt-8 p-6">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Today's Attendance
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Track your working hours
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
              Present
            </span>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

            <div>
              <p className="text-sm text-gray-500">
                Check In
              </p>

              <p className="text-xl font-semibold mt-1">
                09:12 AM
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Check Out
              </p>

              <p className="text-xl font-semibold mt-1">
                --
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Working Hours
              </p>

              <p className="text-xl font-semibold mt-1">
                4h 32m
              </p>
            </div>

          </div>

          <button className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700">
            Check Out
          </button>

        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm mt-8 p-6">

          <h3 className="text-lg font-semibold text-gray-800">
            Recent Activity
          </h3>

          <div className="mt-4 space-y-4">

            <div className="flex justify-between border-b pb-4">
              <div>
                <p className="font-medium">
                  Leave request submitted
                </p>

                <p className="text-sm text-gray-500">
                  Sick Leave • Aug 20
                </p>
              </div>

              <span className="text-yellow-600 text-sm">
                Pending
              </span>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="font-medium">
                  Salary credited
                </p>

                <p className="text-sm text-gray-500">
                  August payroll
                </p>
              </div>

              <span className="text-green-600 text-sm">
                Completed
              </span>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default EmployeeDashboard;