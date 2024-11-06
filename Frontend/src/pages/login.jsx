import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ErrorNotify, SuccessNotify } from "../components/toast";
import { useEffect, useState } from "react";

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        import.meta.env.VITE_API_URL + "/api/login",
        {
          email: loginData.email,
          password: loginData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data == "Login successfull") {
          navigate("/");
          SuccessNotify(res.data);
        } else {
          ErrorNotify(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        ErrorNotify(
          err.response?.data || "An error occurred. Please try again later."
        );
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Login to Todoz
        </h2>
        <p className="text-center text-gray-500">
          Welcome back! Please enter your details.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-semibold">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={loginData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-200"
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
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-500 text-sm">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-0"
              />
              Remember me
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-semibold shadow-md transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500">
          Don't have an account?
          <Link
            to="/signup"
            className="text-blue-500 font-medium hover:underline ml-1"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
