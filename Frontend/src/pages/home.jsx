import { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import axios from "axios";
import TestimonialCard from "../components/cards/testimonial";
import FaqItem from "../components/cards/faq";
import { Link } from "react-router-dom";

export default function Home() {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/user/details", {
        withCredentials: true,
      })
      .then((res) => {
        setUserDetails(res.data);
      })
      .catch((err) => {
        setUserDetails({});
      });
  }, []);

  return (
    <>
      <Header userDetails={userDetails} />
      <section className="w-full max-w-5xl mx-auto text-center py-16 bg-blue-600 text-white rounded-lg shadow-md mb-16 mt-8">
        {userDetails.name ? (
          <>
            <h3 className="text-3xl font-bold mb-4">
              Welcome Back, {userDetails.name}!
            </h3>
            <p className="text-lg mb-8">
              We're glad to have you here. Keep track of your tasks and stay
              productive!
            </p>
            <Link
              to="/tasks"
              className="bg-white text-blue-600 font-semibold text-lg px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
            >
              Go to Your Tasks
            </Link>
          </>
        ) : (
          <>
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-8">
              Sign up today and experience the simplicity of Todoz.
            </p>
            <Link
              to="/signup"
              className="bg-white text-blue-600 font-semibold text-lg px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
            >
              Sign Up Now
            </Link>
          </>
        )}
      </section>
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-16 mb-16">
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Easy Task Management
          </h3>
          <p className="text-gray-600 text-center">
            Quickly add, edit, and categorize your tasks to stay organized
            effortlessly.
          </p>
        </div>

        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Seamless Sync
          </h3>
          <p className="text-gray-600 text-center">
            Access your tasks anywhere and keep them synced across all your
            devices.
          </p>
        </div>

        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Minimalist Design
          </h3>
          <p className="text-gray-600 text-center">
            Experience a clutter-free, intuitive design that lets you focus on
            your tasks.
          </p>
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto text-center py-16 mb-16">
        <h3 className="text-3xl font-bold text-gray-800 mb-6">
          What Our Users Say
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Our users love how Todoz helps them stay organized and focused. Here’s
          what they have to say.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TestimonialCard
            text="Todoz has transformed the way I manage my tasks. Simple and effective!"
            name="Sarah J."
            role="Product Manager"
          />
          <TestimonialCard
            text="I love the clean design and ease of use. Highly recommend it to anyone!"
            name="James L."
            role="Freelancer"
          />
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto text-left py-16 mb-16">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Frequently Asked Questions
        </h3>
        <FaqItem
          question="How do I create a new task?"
          answer="Simply click on 'Add Task' in the main dashboard, enter your task details, and save."
        />
        <FaqItem
          question="Can I use Todoz on multiple devices?"
          answer="Yes! Todoz is synced across all your devices for seamless task management."
        />
        <FaqItem
          question="Is Todoz free to use?"
          answer="Yes, Todoz is completely free with all essential features included."
        />
      </section>

      <Footer />
    </>
  );
}
