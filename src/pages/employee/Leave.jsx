import { useState } from "react";
import Sidebar from "../../components/Sidebar";

function Leave() {
  const [showForm, setShowForm] = useState(false);

  const [leaveRequests, setLeaveRequests] = useState([
    {
      type: "Casual Leave",
      startDate: "Aug 25, 2026",
      endDate: "Aug 26, 2026",
      reason: "Personal work",
      status: "Pending",
    },
    {
      type: "Sick Leave",
      startDate: "Aug 10, 2026",
      endDate: "Aug 10, 2026",
      reason: "Not feeling well",
      status: "Approved",
    },
  ]);

  const [form, setForm] = useState({
    type: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.startDate || !form.endDate || !form.reason) {
      return;
    }

    const newRequest = {
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason,
      status: "Pending",
    };

    setLeaveRequests((currentRequests) => [
      newRequest,
      ...currentRequests,
    ]);

    setForm({
      type: "Casual Leave",
      startDate: "",
      endDate: "",
      reason: "",
    });

    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <Sidebar />

      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Leave
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your leave requests.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {showForm ? "Close Form" : "Apply for Leave"}
          </button>

        </div>

        {/* Leave Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Casual Leave
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              8
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Days remaining
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Sick Leave
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              6
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Days remaining
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Leave Without Pay
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              Unlimited
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Subject to approval
            </p>
          </div>

        </div>

        {/* Apply Leave Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Apply for Leave
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Leave Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Leave Type
                  </label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Casual Leave</option>
                    <option>Sick Leave</option>
                    <option>Leave Without Pay</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Reason
                  </label>

                  <input
                    type="text"
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    placeholder="Enter reason for leave"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              <div className="flex justify-end mt-6">

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Submit Leave Request
                </button>

              </div>

            </form>

          </div>
        )}

        {/* Leave Requests */}
        <div className="bg-white rounded-xl shadow-sm p-8">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              My Leave Requests
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View the status of your submitted leave requests.
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-gray-200">

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Leave Type
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Start Date
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    End Date
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Reason
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {leaveRequests.map((request, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 last:border-0"
                  >

                    <td className="py-4 text-sm text-gray-700">
                      {request.type}
                    </td>

                    <td className="py-4 text-sm text-gray-700">
                      {request.startDate}
                    </td>

                    <td className="py-4 text-sm text-gray-700">
                      {request.endDate}
                    </td>

                    <td className="py-4 text-sm text-gray-700">
                      {request.reason}
                    </td>

                    <td className="py-4">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : request.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {request.status}
                      </span>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Leave;