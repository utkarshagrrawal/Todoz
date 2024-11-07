import { Link } from "react-router-dom";
import MaleAvatar from "../assets/male-avatar.jpg";
import FemaleAvatar from "../assets/female-avatar.jpg";

export default function Header({ userDetails }) {
  return (
    <header className="w-full flex items-center justify-between py-4 px-8 sm:px-12 bg-white border-b border-gray-200 shadow-md">
      <div className="flex items-center space-x-4">
        <a
          href="/"
          className="text-3xl font-extrabold text-blue-600 tracking-tight"
        >
          Todoz
        </a>
      </div>

      <div className="flex items-center gap-10">
        <Link
          to="/"
          className="text-gray-600 hover:text-blue-600 cursor-pointer transition duration-300"
        >
          Home
        </Link>
        <Link
          to="/about-us"
          className="text-gray-600 hover:text-blue-600 cursor-pointer transition duration-300"
        >
          About Us
        </Link>
        <Link
          to="/contact-us"
          className="text-gray-600 hover:text-blue-600 cursor-pointer transition duration-300"
        >
          Contact Us
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {userDetails?.name ? (
          <Link
            to="/profile"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition duration-300"
          >
            <img
              src={userDetails?.gender === "male" ? MaleAvatar : FemaleAvatar}
              alt="User"
              className="w-10 h-10 rounded-full object-cover shadow-lg"
            />
          </Link>
        ) : (
          <Link
            to="/login"
            className="text-gray-600 hover:text-blue-600 transition duration-300"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
