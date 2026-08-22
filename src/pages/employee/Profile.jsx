import { useState } from "react";
import Sidebar from "../../components/Sidebar";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@dayflow.demo",
    phone: "+91 98765 43210",
    department: "Engineering",
    jobTitle: "Software Engineer",
    joiningDate: "January 15, 2025",
  });

  const [savedProfile, setSavedProfile] = useState(profile);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setSavedProfile(profile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Profile
          </h1>

          <p className="text-gray-500 mt-1">
            View and manage your personal information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-8">

          {/* Profile Header */}
          <div className="flex items-center gap-5 pb-6 border-b">

            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {profile.name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {profile.name}
              </h2>

              <p className="text-gray-500">
                {profile.jobTitle}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Employee ID: EMP001
              </p>
            </div>

          </div>

          {/* Personal Information */}
          <div className="mt-8">

            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Department
                </label>

                <input
                  type="text"
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Job Title
                </label>

                <input
                  type="text"
                  name="jobTitle"
                  value={profile.jobTitle}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Joining Date */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Joining Date
                </label>

                <input
                  type="text"
                  name="joiningDate"
                  value={profile.joiningDate}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-3">

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default Profile;