import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorNotify, SuccessNotify } from "../components/toast";
import WarningIcon from "../components/icons/warning";
import CheckIcon from "../components/icons/check";

export default function Signup() {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "male",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [score, setScore] = useState("");
  const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    setLoading(true);
    axios
      .get(import.meta.env.VITE_API_URL + "/api/user/details", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data?.email) {
          navigate("/");
        } else {
          ErrorNotify(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setSignupData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "password") {
      const password = e.target.value;
      let tempScore = "";
      if (password.match(/[a-z]/)) tempScore += "L";
      if (password.match(/[A-Z]/)) tempScore += "U";
      if (password.match(/[0-9]/)) tempScore += "N";
      if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) tempScore += "S";
      if (password.length > 12 && password.length < 48) tempScore += "M";
      setScore(tempScore);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (score.length !== 5) {
      ErrorNotify("Password does not meet the requirements");
      return;
    }

    setLoading(true);

    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/user/create",
        JSON.stringify(signupData),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data == "Account created successfully") {
          SuccessNotify(res.data);
          if (searchParams.get("redirect"))
            navigate(
              "/login?redirect=" +
                encodeURIComponent(searchParams.get("redirect"))
            );
          else navigate("/login");
        } else {
          ErrorNotify(res.data);
        }
      })
      .catch((err) => {
        ErrorNotify(err.response?.data || "Error creating account!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Create an Account
        </h2>
        <p className="text-center text-gray-500">
          Join us and start organizing with Todoz!
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-semibold">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-200"
              value={signupData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-semibold">
              Gender
            </label>
            <select
              name="gender"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-200"
              value={signupData.gender}
              onChange={handleChange}
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-semibold">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-200"
              value={signupData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-semibold">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="9876543210"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-200"
              value={signupData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-semibold">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-200"
              value={signupData.password}
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
              At least one lowercase letter
            </li>
            <li className="flex items-center">
              {score.includes("U") ? (
                <CheckIcon className="text-green-500 mr-2 size-4" />
              ) : (
                <WarningIcon className="text-red-500 mr-2 size-4" />
              )}
              At least one uppercase letter
            </li>
            <li className="flex items-center">
              {score.includes("N") ? (
                <CheckIcon className="text-green-500 mr-2 size-4" />
              ) : (
                <WarningIcon className="text-red-500 mr-2 size-4" />
              )}
              At least one number
            </li>
            <li className="flex items-center">
              {score.includes("S") ? (
                <CheckIcon className="text-green-500 mr-2 size-4" />
              ) : (
                <WarningIcon className="text-red-500 mr-2 size-4" />
              )}
              At least one special character
            </li>
            <li className="flex items-center">
              {score.includes("M") ? (
                <CheckIcon className="text-green-500 mr-2 size-4" />
              ) : (
                <WarningIcon className="text-red-500 mr-2 size-4" />
              )}
              Password length between 12 and 48 characters
            </li>
          </ul>

          <button
            type="submit"
            className={`w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-semibold shadow-md transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-500">
          Already have an account?
          <Link
            to={
              searchParams.get("redirect")
                ? `/login?redirect=${encodeURIComponent(
                    searchParams.get("redirect")
                  )}`
                : `/login`
            }
            className="text-blue-500 font-medium hover:underline ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
