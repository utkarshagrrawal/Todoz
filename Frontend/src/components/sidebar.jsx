import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import MaleAvatar from "../assets/male-avatar.jpg";
import FemaleAvatar from "../assets/female-avatar.jpg";
import { GetMonthName } from "../utils/getDayName";

export default function Sidebar({ userDetails, selectedTab, setSelectedTab }) {
  const navigate = useNavigate();

  return (
    <aside className="w-16 bg-black text-white p-5 space-y-6 shadow-lg fixed left-0 top-0 h-full">
      <div className="flex flex-col justify-between items-center gap-4">
        <img src={Logo} alt="Logo" className="w-10 h-10 object-contain" />
        <div className="border-2 border-gray-200 bg-gray-700 rounded-lg py-1 px-2 flex flex-col items-center justify-center">
          <span className="text-xs">{GetMonthName(new Date().getMonth())}</span>
          <span className="font-bold text-lg">{new Date().getDate()}</span>
        </div>
      </div>

      <nav>
        <ul className="space-y-4">
          <li className={`${selectedTab === "home" && "text-blue-600"}`}>
            <Link
              to="/tasks/home"
              onClick={() => setSelectedTab("home")}
              className="flex items-center gap-3 text-lg hover:text-blue-300 transition"
            >
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
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </Link>
          </li>
          <li
            className={`${selectedTab === "not-completed" && "text-blue-600"}`}
          >
            <Link
              to="/tasks/not-completed"
              onClick={() => setSelectedTab("not-completed")}
              className="flex items-center gap-3 text-lg hover:text-blue-300 transition"
            >
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
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </Link>
          </li>
          <li className={`${selectedTab === "completed" && "text-blue-600"}`}>
            <Link
              to="/tasks/completed"
              onClick={() => setSelectedTab("completed")}
              className="flex items-center gap-3 text-lg hover:text-blue-300 transition"
            >
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
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </Link>
          </li>
        </ul>
      </nav>

      <section className="fixed bottom-0 py-6">
        <img
          src={userDetails.gender === "male" ? MaleAvatar : FemaleAvatar}
          alt="User"
          className="w-8 h-8 rounded-full object-cover shadow-lg cursor-pointer"
          onClick={() => navigate("/profile")}
        />
      </section>
    </aside>
  );
}
