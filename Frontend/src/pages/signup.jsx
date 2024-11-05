import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Create an Account
        </h2>
        <p className="text-center text-gray-500">
          Join us and start organizing with Todoz!
        </p>

        <form className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-semibold">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-semibold">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="9876543210"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-semibold shadow-md transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-500">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-500 font-medium hover:underline ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
