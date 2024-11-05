import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="w-full flex items-center justify-between py-4 px-12 shadow-lg bg-white border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">
          Todoz
        </h1>
      </div>
      <div className="flex items-center gap-8">
        <span className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer">
          Home
        </span>
        <span className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer">
          About
        </span>
        <span className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer">
          Contact
        </span>
      </div>
      <div className="flex items-center gap-6">
        <Link
          to="/login"
          className="text-gray-600 hover:text-blue-500 transition-colors"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="border border-blue-500 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 font-medium shadow-md transition-all"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
