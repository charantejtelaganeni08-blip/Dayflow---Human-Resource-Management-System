import AdminSidebar from "../../components/AdminSidebar";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Overview of your organization's workforce.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Employees */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Total Employees
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              42
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Active employees
            </p>
          </div>

          {/* Present */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Present Today
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              36
            </p>

            <p className="text-sm text-gray-400 mt-1">
              85.7% attendance
            </p>
          </div>

          {/* On Leave */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              On Leave
            </p>

            <p className="text-3xl font-bold text-yellow-600 mt-2">
              4
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Employees today
            </p>
          </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Pending Requests
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              7
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Need your attention
            </p>
          </div>

        </div>

        {/* Today's Attendance */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">

          <div className="flex justify-between items-center mb-6">

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Today's Attendance
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Current workforce attendance overview.
              </p>
            </div>

            <span className="text-sm text-gray-400">
              Today
            </span>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-500">
                Present
              </p>

              <p className="text-2xl font-bold text-green-600 mt-2">
                36
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-500">
                Absent
              </p>

              <p className="text-2xl font-bold text-red-600 mt-2">
                2
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-500">
                On Leave
              </p>

              <p className="text-2xl font-bold text-yellow-600 mt-2">
                4
              </p>
            </div>

          </div>

        </div>

        {/* Pending Leave Requests */}
        <div className="bg-white rounded-xl shadow-sm p-8">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Pending Leave Requests
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Leave requests waiting for approval.
            </p>
          </div>

          <div className="space-y-4">

            <div className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <p className="font-semibold text-gray-800">
                  John Doe
                </p>

                <p className="text-sm text-gray-500">
                  Casual Leave · Aug 25 - Aug 26
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium w-fit">
                Pending
              </span>

            </div>

            <div className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <p className="font-semibold text-gray-800">
                  Sarah Wilson
                </p>

                <p className="text-sm text-gray-500">
                  Sick Leave · Aug 23
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium w-fit">
                Pending
              </span>

            </div>

            <div className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <p className="font-semibold text-gray-800">
                  Michael Brown
                </p>

                <p className="text-sm text-gray-500">
                  Casual Leave · Aug 29 - Aug 30
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium w-fit">
                Pending
              </span>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;