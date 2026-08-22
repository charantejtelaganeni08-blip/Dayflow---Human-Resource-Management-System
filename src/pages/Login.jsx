import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
  event.preventDefault();

  if (email === "employee@dayflow.demo" && password === "123456") {
    navigate("/employee");
    return;
  }

  if (email === "admin@dayflow.demo" && password === "123456") {
    navigate("/admin");
    return;
  }

  alert("Invalid demo credentials");
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            Dayflow
          </h1>

          <p className="text-gray-500 mt-2">
            Human Resource Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome back
          </h2>

          <p className="text-gray-500 mt-1 mb-6">
            Sign in to your Dayflow account
          </p>

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-6">

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>

            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Sign In
            </button>

          </form>

        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Dayflow HRMS
        </p>

      </div>
    </div>
  );
}

export default Login;