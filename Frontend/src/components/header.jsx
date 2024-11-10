import { Link } from "react-router-dom";
import MaleAvatar from "../assets/male-avatar.jpg";
import FemaleAvatar from "../assets/female-avatar.jpg";

export default function Header({ userDetails }) {
  return (
    <header className="w-full flex flex-wrap items-center justify-between py-4 px-8 sm:px-12 bg-white border-b border-gray-200 shadow-md">
      <div className="flex items-center space-x-4">
        <a href="/" className="text-3xl font-extrabold text-blue-600">
          Todoz
        </a>
      </div>

      <div className="flex items-center gap-10 bg-white">
        <Link
          to="/"
          className="text-gray-700 font-medium hover:text-blue-500 transition duration-300 relative"
        >
          Home
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link
          to="/about-us"
          className="text-gray-700 font-medium hover:text-blue-500 transition duration-300 relative"
        >
          About Us
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link
          to="/contact-us"
          className="text-gray-700 font-medium hover:text-blue-500 transition duration-300 relative"
        >
          Contact Us
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {userDetails?.name ? (
          <Link
            to="/profile"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <img
              src={userDetails?.gender === "male" ? MaleAvatar : FemaleAvatar}
              alt="User Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
            />
            <div className="flex flex-col">
              <span className="text-base font-semibold">
                {userDetails.name}
              </span>
              <span className="text-sm text-gray-500">View Profile</span>
            </div>
          </Link>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 rounded-full bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
