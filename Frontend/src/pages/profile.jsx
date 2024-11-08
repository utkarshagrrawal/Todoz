import axios from "axios";
import { useEffect, useState } from "react";
import MaleAvatar from "../assets/male-avatar.jpg";
import FemaleAvatar from "../assets/female-avatar.jpg";
import { Link } from "react-router-dom";
import { ErrorNotify } from "../components/toast";

export default function Profile() {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
  });

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/user/details", {
        withCredentials: true,
      })
      .then((res) => {
        setUserDetails(res.data);
      })
      .catch((err) => {
        if (err.status === 401) {
          window.location.href =
            "/login?redirect=" + encodeURIComponent("/profile");
        }
        ErrorNotify(err.response?.data);
      });
  }, []);

  const handleDetails = (e) => {
    setUserDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = (e) => {};

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080/')] bg-cover bg-center opacity-50 pointer-events-none"></div>

      <div className="w-full max-w-2xl mx-auto p-10 bg-white rounded-3xl shadow-lg z-10">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">
          Profile
        </h2>

        <div className="flex flex-col items-center mb-10">
          <div className="relative w-28 h-28 mb-4">
            <img
              src={userDetails.gender === "male" ? MaleAvatar : FemaleAvatar}
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
            <span className="absolute bottom-0 right-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                className="w-8 h-8 rounded-full"
              >
                <circle cx="12" cy="12" r="12" fill="blue" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75l2.25 2.25L15 9.75"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </span>
          </div>
        </div>

        <form id="myForm" className="space-y-6">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Full Name</label>
            <input
              name="name"
              type="text"
              className="mt-1 p-2 border border-gray-300 rounded-lg bg-white bg-opacity-75 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Your Name"
              value={userDetails.name}
              onChange={handleDetails}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Email</label>
            <input
              name="email"
              type="email"
              className="mt-1 p-2 border border-gray-300 rounded-lg bg-white bg-opacity-75 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="you@example.com"
              value={userDetails.email}
              onChange={handleDetails}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Phone</label>
            <input
              name="phone"
              type="tel"
              className="mt-1 p-2 border border-gray-300 rounded-lg bg-white bg-opacity-75 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Your Phone Number"
              value={userDetails.phone}
              onChange={handleDetails}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Gender</label>
            <select
              name="gender"
              className="mt-1 p-2 border border-gray-300 rounded-lg bg-white bg-opacity-75 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={userDetails.gender}
              onChange={handleDetails}
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </form>

        <div className="flex justify-center mt-10 space-x-4">
          <button
            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            form="myForm"
          >
            Save Changes
          </button>
          <Link
            to="/change-password"
            className="bg-gray-600 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
          >
            Change password
          </Link>
          <button className="bg-red-500 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:bg-red-600 transition">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
