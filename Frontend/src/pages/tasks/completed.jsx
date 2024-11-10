import axios from "axios";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  DismissToast,
  ErrorNotify,
  LoadingNotify,
  SuccessNotify,
} from "../../components/toast";

export default function Completed() {
  const [userDetails, setUserDetails] = useState({});
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const scroll = useRef(0);

  useEffect(() => {
    const observer = () => {
      if (window.scrollY - scroll.current > 100) {
        setPage((prev) => prev + 1);
        scroll.current = window.scrollY;
      }
    };
    window.addEventListener("scroll", observer);
    return () => window.removeEventListener("scroll", observer);
  }, []);

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
            "/login?redirect=" + encodeURIComponent("/tasks/completed");
        }
        ErrorNotify(err.response?.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/tasks/completed?page=" + page, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data?.length > 0) {
          page === 1
            ? setTasks(res.data)
            : setTasks((prev) => [...prev, ...res.data]);
        }
      })
      .catch((err) => {
        ErrorNotify(err.response?.data);
      });
  }, [page]);

  const handleTaskEdit = (task) => {
    const toastId = LoadingNotify("Updating task");
    task.priority = parseInt(task.priority);
    axios
      .put(import.meta.env.VITE_API_URL + "/api/tasks/update", task, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data === "Task details updated") {
          SuccessNotify(res.data);
          if (!task.is_completed) {
            setTasks((prev) => prev.filter((t) => t._id !== task._id));
          }
          return;
        }
        ErrorNotify(res.data);
      })
      .catch((err) => {
        ErrorNotify(err.response?.data);
      })
      .finally(() => {
        DismissToast(toastId);
      });
  };

  return (
    <section className="w-full min-h-screen ml-16 p-6 bg-gray-950">
      <div className="text-center items-center mb-8 text-white font-bold text-4xl">
        Completed tasks
      </div>
      <div className="flex flex-col space-y-4">
        {tasks.length > 0 &&
          tasks.map((task, i) => (
            <div key={i} className="flex items-center space-x-4">
              <input
                type="checkbox"
                className="size-7 text-blue-500 border-gray-500 rounded-full transition-all"
                checked={task.is_completed}
                onChange={(e) => {
                  setTasks((prev) =>
                    prev.map((t) =>
                      t._id === task._id
                        ? { ...t, is_completed: e.target.checked }
                        : t
                    )
                  );
                  task.is_completed = e.target.checked;
                  handleTaskEdit(task);
                }}
              />
              <input
                className={`w-full border border-gray-600 rounded-md px-4 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  task.status === "overdue"
                    ? "bg-red-700"
                    : task.status === "completed"
                    ? "bg-green-700"
                    : "bg-transparent"
                }`}
                value={task.description}
                onChange={(e) =>
                  setTasks((prev) =>
                    prev.map((t) =>
                      t._id === task._id
                        ? { ...t, description: e.target.value }
                        : t
                    )
                  )
                }
                onKeyDown={(e) => e.key === "Enter" && handleTaskEdit(task)}
              />
              <select
                name="priority"
                value={task.priority}
                onChange={(e) => {
                  setTasks((prev) =>
                    prev.map((t) =>
                      t._id === task._id
                        ? { ...t, priority: e.target.value }
                        : t
                    )
                  );
                  task.priority = e.target.value;
                  handleTaskEdit(task);
                }}
                className="bg-transparent border border-gray-600 rounded-md px-4 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="0">Low</option>
                <option value="1">Medium</option>
                <option value="2">High</option>
              </select>
              <DatePicker
                selected={task.deadline}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                minDate={new Date()}
                dateFormat={"dd/MMM/yyyy"}
                onChange={(date) => {
                  setTasks((prev) =>
                    prev.map((t) =>
                      t._id === task._id ? { ...t, deadline: date } : t
                    )
                  );
                  task.deadline = new Date(date).toISOString();
                  handleTaskEdit(task);
                }}
                className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          ))}
      </div>
    </section>
  );
}
