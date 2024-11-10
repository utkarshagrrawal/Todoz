import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  DismissToast,
  ErrorNotify,
  LoadingNotify,
  SuccessNotify,
} from "../../components/toast";
import "./datepicker.css";
import DeleteIcon from "../../components/icons/trash";

export default function Completed() {
  const [userDetails, setUserDetails] = useState({});
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [deletePopup, setDeletePopup] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState({});
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

  const handleUpdate = (task) => {
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

  const handleDelete = () => {
    if (!taskToDelete._id) {
      ErrorNotify("Please refresh the page and try again");
      return;
    }
    const toastId = LoadingNotify("Deleting task...");
    axios
      .delete(
        import.meta.env.VITE_API_URL +
          "/api/tasks/delete?id=" +
          taskToDelete._id,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data === "Task deleted successfully") {
          setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
          SuccessNotify(res.data);
        } else {
          ErrorNotify(res.data);
        }
      })
      .catch((err) => {
        ErrorNotify(err.response?.data || "Failed to delete task");
      })
      .finally(() => {
        DismissToast(toastId);
        setDeletePopup(false);
      });
  };

  return (
    <section className="w-full min-h-screen ml-16 p-6 bg-gray-950">
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50 flex justify-center items-center ${
          !deletePopup && "hidden"
        }`}
      >
        <div className="bg-white p-8 rounded-lg shadow-2xl transform transition-all duration-300 ease-in-out max-w-sm w-full">
          <div className="text-gray-900 font-semibold text-2xl mb-6 text-center">
            Are you sure you want to delete this task?
          </div>
          <div className="flex justify-center space-x-6">
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-sm"
              onClick={handleDelete}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium shadow-sm"
              onClick={() => setDeletePopup(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
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
                  handleUpdate(task);
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
                onKeyDown={(e) => e.key === "Enter" && handleUpdate(task)}
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
                  handleUpdate(task);
                }}
                className="bg-transparent border border-gray-600 rounded-md px-4 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="0">Low</option>
                <option value="1">Medium</option>
                <option value="2">High</option>
              </select>
              <input
                type="date"
                className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-1 max-w-36 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={new Date(task.deadline).toISOString().split("T")[0]}
                onChange={(e) => {
                  setTasks((prev) =>
                    prev.map((t) =>
                      t._id === task._id
                        ? { ...t, deadline: e.target.value }
                        : t
                    )
                  );
                  task.deadline = new Date(e.target.value).toISOString();
                  handleUpdate(task);
                }}
              />
              <button
                className="border border-gray-600 bg-transparent text-white font-medium p-2 rounded-lg shadow-md hover:bg-red-700 transition flex items-center"
                onClick={() => {
                  setDeletePopup(true);
                  setTaskToDelete(task);
                }}
              >
                <DeleteIcon className="text-white w-5 h-5" />
              </button>
            </div>
          ))}
      </div>
    </section>
  );
}
