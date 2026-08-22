import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

function Attendance() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    if (!date) return "--";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateWorkingTime = () => {
    if (!checkInTime) return "0h 0m";

    const endTime = checkOutTime || currentTime;

    const difference = endTime - checkInTime;

    const totalMinutes = Math.floor(difference / 60000);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const handleCheckIn = () => {
    const now = new Date();

    setCheckInTime(now);
    setCheckOutTime(null);
    setIsCheckedIn(true);
  };

  const handleCheckOut = () => {
    const now = new Date();

    setCheckOutTime(now);
    setIsCheckedIn(false);
  };

  const attendanceHistory = [
    {
      date: "Aug 22, 2026",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      status: "Present",
    },
    {
      date: "Aug 21, 2026",
      checkIn: "09:12 AM",
      checkOut: "06:05 PM",
      status: "Present",
    },
    {
      date: "Aug 20, 2026",
      checkIn: "--",
      checkOut: "--",
      status: "Absent",
    },
    {
      date: "Aug 19, 2026",
      checkIn: "09:05 AM",
      checkOut: "06:10 PM",
      status: "Present",
    },
    {
      date: "Aug 18, 2026",
      checkIn: "09:20 AM",
      checkOut: "06:00 PM",
      status: "Late",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Attendance
          </h1>

          <p className="text-gray-500 mt-1">
            Track your daily attendance and working hours.
          </p>
        </div>

        {/* Today's Attendance */}
        <div className="bg-white rounded-xl shadow-sm p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Today's Status
              </p>

              <div className="flex items-center gap-2 mt-2">

                <span
                  className={`w-3 h-3 rounded-full ${
                    isCheckedIn
                      ? "bg-green-500"
                      : checkOutTime
                      ? "bg-blue-500"
                      : "bg-gray-400"
                  }`}
                />

                <h2 className="text-2xl font-semibold text-gray-800">
                  {isCheckedIn
                    ? "Working"
                    : checkOutTime
                    ? "Completed"
                    : "Not Checked In"}
                </h2>

              </div>
            </div>

            {/* Action Button */}
            {!isCheckedIn && !checkOutTime && (
              <button
                onClick={handleCheckIn}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Check In
              </button>
            )}

            {isCheckedIn && (
              <button
                onClick={handleCheckOut}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition"
              >
                Check Out
              </button>
            )}

            {!isCheckedIn && checkOutTime && (
              <span className="px-5 py-3 rounded-lg bg-green-100 text-green-700 font-medium">
                Attendance Completed
              </span>
            )}

          </div>

          {/* Attendance Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

            {/* Check In */}
            <div className="border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-500">
                Check In
              </p>

              <p className="text-2xl font-semibold text-gray-800 mt-2">
                {formatTime(checkInTime)}
              </p>
            </div>

            {/* Check Out */}
            <div className="border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-500">
                Check Out
              </p>

              <p className="text-2xl font-semibold text-gray-800 mt-2">
                {formatTime(checkOutTime)}
              </p>
            </div>

            {/* Working Hours */}
            <div className="border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-500">
                Working Hours
              </p>

              <p className="text-2xl font-semibold text-gray-800 mt-2">
                {calculateWorkingTime()}
              </p>
            </div>

          </div>

          {/* Current Time */}
          <div className="mt-6 text-sm text-gray-400">
            Current time: {formatTime(currentTime)}
          </div>

        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-xl shadow-sm mt-8 p-8">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Attendance History
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your recent attendance records.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-gray-200">

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Date
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Check In
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Check Out
                  </th>

                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {attendanceHistory.map((record, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 last:border-0"
                  >

                    <td className="py-4 text-sm text-gray-700">
                      {record.date}
                    </td>

                    <td className="py-4 text-sm text-gray-700">
                      {record.checkIn}
                    </td>

                    <td className="py-4 text-sm text-gray-700">
                      {record.checkOut}
                    </td>

                    <td className="py-4">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : record.status === "Late"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {record.status}
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

export default Attendance;