import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/sidebar";
import TodayTasks from "./today";
import NonCompletedTasks from "./pending";
import Completed from "./completed";

export default function TaskHome() {
  const { section } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [selectedTab, setSelectedTab] = useState(section || "home");

  useEffect(() => {
    if (["home", "not-completed", "completed"].includes(section)) {
      setSelectedTab(section);
    } else {
      window.location.href = "/tasks/home";
    }
  }, [section]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/user/details", {
        withCredentials: true,
      })
      .then((res) => {
        setUserDetails(res.data);
      })
      .catch((err) => {
        if (err.response.data === "Authorization token cannot be identified") {
          window.location.href =
            "/login?redirect=" + encodeURIComponent("/tasks");
        }
      });
  }, []);

  return (
    <div className="min-h-screen w-full flex">
      <Sidebar
        userDetails={userDetails}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {/* Home */}
      {selectedTab === "home" && <TodayTasks />}

      {/* Not completed */}
      {selectedTab === "not-completed" && <NonCompletedTasks />}

      {/* Completed */}
      {selectedTab === "completed" && <Completed />}
    </div>
  );
}
