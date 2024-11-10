import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import axios from "axios";
import { ErrorNotify, SuccessNotify } from "../components/toast";

export default function ContactUs() {
  const [userDetails, setUserDetails] = useState({});
  const [details, setDetails] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(import.meta.env.VITE_API_URL + "/api/user/details", {
        withCredentials: true,
      })
      .then((res) => {
        setUserDetails(res.data);
      })
      .catch((err) => {
        setUserDetails({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    axios
      .post(import.meta.env.VITE_API_URL + "/api/user/contact-us", details)
      .then((res) => {
        SuccessNotify(res.data);
        setDetails({
          name: "",
          email: "",
          message: "",
        });
      })
      .catch((err) => {
        ErrorNotify(err.response?.data || "An error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Header userDetails={userDetails} />

      <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            We'd love to hear from you! Whether you have a question about
            features, trials, pricing, need a demo, or anything else, our team
            is ready to answer all your questions.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="w-full lg:w-2/3 p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={details.name}
                  onChange={(e) =>
                    setDetails((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={details.email}
                  onChange={(e) =>
                    setDetails((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Message
                </label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={details.message}
                  onChange={(e) =>
                    setDetails((prev) => ({ ...prev, message: e.target.value }))
                  }
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-md py-2 px-4 font-semibold hover:bg-blue-700 transition duration-200"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="w-full lg:w-1/3 bg-blue-50 p-8 flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              Get in Touch
            </h3>
            <p className="text-gray-600 mb-6">
              We’re here to help! Reach out to us through any of the contact
              methods below.
            </p>

            <div className="flex items-center text-blue-600 space-x-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              <span className="text-gray-700">utkarsh09jan@gmail.com</span>
            </div>

            <div className="flex items-center text-blue-600 space-x-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              <span className="text-gray-700">+91 63505 55537</span>
            </div>

            <div className="flex items-center text-blue-600 space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <span className="text-gray-700">Pune, Maharashtra</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
