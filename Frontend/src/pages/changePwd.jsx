import axios from "axios";
import { useEffect, useState } from "react";
import CheckIcon from "../components/icons/check";
import WarningIcon from "../components/icons/warning";

export default function ChangePassword() {
  const [userDetails, setUserDetails] = useState({});
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [score, setScore] = useState("");
  const conditions = [
    "At least 1 lowercase letter",
    "At least 1 uppercase letter",
    "At least 1 number",
    "At least 1 special character",
    "Password length between 12 and 48 characters",
  ];
  const [status, setStatus] = useState({
    success: false,
    message: "",
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
        if (err.status === 400 || err.status === 401) {
          window.location.href =
            "/login?redirect=" + encodeURIComponent("/change-password");
        }
        setStatus({
          success: false,
          message: err.response?.data || "Failed to fetch user details",
        })
      });
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "newPassword") {
      const password = e.target.value;
      let tempScore = "";
      if (password.match(/[a-z]/)) tempScore += "L";
      if (password.match(/[A-Z]/)) tempScore += "U";
      if (password.match(/[0-9]/)) tempScore += "N";
      if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) tempScore += "S";
      if (password.length > 12 && password.length < 48) tempScore += "M";
      setScore(tempScore);
    }
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (score.length !== 5) {
      setStatus({
        success: false,
        message: "Password does not meet the required conditions",
      });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setStatus({
        success: false,
        message: "Passwords do not match",
      });
      return;
    }

    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/user/change-password",
        passwords,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data === "Password updated successfully") {
          window.location.href = "/profile";
        }
      })
      .catch((err) => {
        setStatus({
          success: false,
          message: err.response?.data || "Failed to change password",
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <section className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Change Password
        </h2>
        {status.message && (
          <div
            className={`p-4 mb-4 rounded-lg ${
              status.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <p className="text-sm">{status.message}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Old Password */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Old Password</label>
            <input
              name="oldPassword"
              type="password"
              placeholder="Enter old password"
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={userDetails.oldPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">New Password</label>
            <input
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={userDetails.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <ul
            className={`text-sm text-gray-500 space-y-2 list-outside ${
              score === "" && "hidden"
            }`}
          >
            <li className="flex items-center">
              {score.includes("L") ? (
                <CheckIcon className="text-green-500 mr-2 size-4" />
              ) : (
                <WarningIcon className="text-red-500 mr-2 size-4" />
              )}
              {conditions[0]}
            </li>
            <li className="flex items-center">
              {score.includes("U") ? (
                <CheckIcon className="text-green-500 mr-2 size-4" />
              ) : (
                <WarningIcon className="text-red-500 mr-2 size-4" />
              )}
              {conditions[1]}
            </li>
            <li className="flex items-center">
              {score.includes("N") ? (
                <CheckIcon className="text-green-500 mr-2 size-4" />
              ) : (
                <WarningIcon className="text-red-500 mr-2 size-4" />
              )}
              {conditions[2]}
            </li>
            <li className="flex items-center">
              {score.includes("S") ? (
                <CheckIcon className="text-green-500 mr-2 size-4" />
              ) : (
                <WarningIcon className="text-red-500 mr-2 size-4" />
              )}
              {conditions[3]}
            </li>
            <li className="flex items-center">
              {score.includes("M") ? (
                <CheckIcon className="text-green-500 mr-2 size-4" />
              ) : (
                <WarningIcon className="text-red-500 mr-2 size-4" />
              )}
              {conditions[4]}
            </li>
          </ul>

          {/* Confirm New Password */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Confirm New Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={userDetails.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button className="w-full bg-blue-600 text-white font-medium p-3 rounded-lg shadow-md hover:bg-blue-700 transition">
            Change Password
          </button>
        </form>
      </section>
    </div>
  );
}
