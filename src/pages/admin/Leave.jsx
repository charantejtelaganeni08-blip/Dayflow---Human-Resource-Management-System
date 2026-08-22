import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

function AdminLeave() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      employee: "John Doe",
      employeeId: "EMP001",
      type: "Casual Leave",
      startDate: "Aug 25, 2026",
      endDate: "Aug 26, 2026",
      days: 2,
      reason: "Personal work",
      status: "Pending",
    },
    {
      id: 2,
      employee: "Sarah Wilson",
      employeeId: "EMP002",
      type: "Sick Leave",
      startDate: "Aug 23, 2026",
      endDate: "Aug 23, 2026",
      days: 1,
      reason: "Not feeling well",
      status: "Pending",
    },
    {
      id: 3,
      employee: "Michael Brown",
      employeeId: "EMP003",
      type: "Casual Leave",
      startDate: "Aug 29, 2026",
      endDate: "Aug 30, 2026",
      days: 2,
      reason: "Family function",
      status: "Pending",
    },
    {
      id: 4,
      employee: "Emily Davis",
      employeeId: "EMP004",
      type: "Sick Leave",
      startDate: "Aug 18, 2026",
      endDate: "Aug 18, 2026",
      days: 1,
      reason: "Medical appointment",
      status: "Approved",
    },
  ]);

  const [filter, setFilter] = useState("All");

  const updateStatus = (id, newStatus) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === id
          ? { ...request, status: newStatus }
          : request
      )
    );
  };

  const filteredRequests = requests.filter((request) => {
    return filter === "All" || request.status === filter;
  });

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "Approved"
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "Rejected"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <AdminSidebar />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Leave Requests
          </h1>

          <p className="text-gray-500 mt-1">
            Review and manage employee leave requests.
          </p>

        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-sm p-6">

            <p className="text-sm text-gray-500">
              Pending Requests
            </p>

            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {pendingCount}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Need your attention
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">

            <p className="text-sm text-gray-500">
              Approved
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {approvedCount}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Approved requests
            </p>

          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">

            <p className="text-sm text-gray-500">
              Rejected
            </p>

            <p className="text-3xl font-bold text-red-600 mt-2">
              {rejectedCount}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Rejected requests
            </p>

          </div>

        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h2 className="font-semibold text-gray-800">
                All Leave Requests
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Review employee applications.
              </p>

            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">
                All Requests
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>

            </select>

          </div>

        </div>

        {/* Requests */}
        <div className="space-y-5">

          {filteredRequests.map((request) => (

            <div
              key={request.id}
              className="bg-white rounded-xl shadow-sm p-6"
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                {/* Employee */}
                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">

                    <span className="text-blue-600 font-bold">
                      {request.employee
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </span>

                  </div>

                  <div>

                    <p className="font-semibold text-gray-800">
                      {request.employee}
                    </p>

                    <p className="text-sm text-gray-400">
                      {request.employeeId}
                    </p>

                  </div>

                </div>

                {/* Leave Details */}
                <div className="flex-1 lg:px-8">

                  <div className="flex flex-wrap gap-x-8 gap-y-3">

                    <div>

                      <p className="text-xs text-gray-400">
                        Leave Type
                      </p>

                      <p className="text-sm font-medium text-gray-700 mt-1">
                        {request.type}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Dates
                      </p>

                      <p className="text-sm font-medium text-gray-700 mt-1">
                        {request.startDate} - {request.endDate}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Duration
                      </p>

                      <p className="text-sm font-medium text-gray-700 mt-1">
                        {request.days} day
                        {request.days !== 1 ? "s" : ""}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Reason
                      </p>

                      <p className="text-sm font-medium text-gray-700 mt-1">
                        {request.reason}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Status + Actions */}
                <div className="flex flex-col items-start lg:items-end gap-3">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : request.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {request.status}
                  </span>

                  {request.status === "Pending" && (

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          updateStatus(request.id, "Approved")
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(request.id, "Rejected")
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                      >
                        Reject
                      </button>

                    </div>

                  )}

                </div>

              </div>

            </div>

          ))}

          {filteredRequests.length === 0 && (

            <div className="bg-white rounded-xl shadow-sm p-12 text-center">

              <p className="text-gray-500">
                No leave requests found.
              </p>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default AdminLeave;