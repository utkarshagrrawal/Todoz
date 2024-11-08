import { Link } from "react-router-dom";
import Footer from "../components/footer";
import Header from "../components/header";
import MyPhoto from "../assets/me.png";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AboutUs() {
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
      <div className="min-h-screen py-16 px-6 flex flex-col items-center">
        <section className="w-full max-w-4xl text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
          <p className="text-lg text-gray-600">
            Welcome to Todoz! Our mission is to help you stay organized, boost
            productivity, and achieve your goals effortlessly. At Todoz, we
            believe that simplicity is the key to getting things done.
          </p>
        </section>

        <section className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 mb-16 text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600">
            Todoz was built to help people manage their daily tasks in a
            seamless and efficient way. We are committed to providing an
            easy-to-use tool that keeps you on track without overwhelming you.
            We aim to empower individuals and teams to reach their full
            potential by focusing on what matters most.
          </p>
        </section>

        <section className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Meet the Creator
          </h2>
          <div className="bg-white rounded-lg p-8 text-center">
            <img
              src={MyPhoto}
              alt="Utkarsh Agrawal"
              className="w-48 h-48 rounded-full object-contain mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              Utkarsh Agrawal
            </h3>
            <p className="text-blue-600">Founder & Developer</p>
            <p className="text-gray-600 mt-4">
              I’m passionate about productivity and simplicity, which inspired
              me to create Todoz as a tool to help others manage their tasks
              effortlessly. With a focus on intuitive design and functionality,
              I’m committed to continually enhancing Todoz for everyone.
            </p>
          </div>
        </section>

        <section className="w-full max-w-4xl text-center p-8 bg-blue-600 text-white rounded-lg shadow-md mb-16">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg mb-8">
            Have questions or want to learn more about Todoz? Feel free to reach
            out, and we’d be happy to chat with you.
          </p>
          <Link
            to="/contact"
            className="bg-white text-blue-600 font-semibold text-lg px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
          >
            Contact Us
          </Link>
        </section>

        <section className="w-full max-w-4xl mx-auto text-center py-12 bg-gray-50 rounded-lg shadow-md mt-8 mb-16">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Notes & Extra Information
          </h3>
          <p className="text-gray-600 mb-4">
            Please note that the backend is hosted on Render, so pages may
            occasionally take up to 2 minutes to load due to server spin-up
            times.
          </p>
          <p className="text-gray-600">
            Website logo attribution:
            <a
              href="https://www.flaticon.com/free-icons/todo"
              title="todo icons"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Todo icons created by Freepik - Flaticon
            </a>
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
