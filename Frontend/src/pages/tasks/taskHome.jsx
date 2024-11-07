import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar";
import {
  DismissToast,
  ErrorNotify,
  LoadingNotify,
} from "../../components/toast";

export default function TaskHome() {
  const [userDetails, setUserDetails] = useState({});
  const [taskData, setTaskData] = useState({
    description: "",
    priority: "low",
    completed: false,
  });
  const [page, setPage] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [selectedTab, setSelectedTab] = useState("home");

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
        setUserDetails({});
      });
  }, []);

  useEffect(() => {
    // TODO: Implement IntersectionObserver for infinite scrolling
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });
  }, []);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/tasks/list?page=" + page, {
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
        ErrorNotify("Failed to fetch tasks");
      });
  }, [page]);

  const handleNewTaskChange = (e) => {
    setTaskData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.name === "completed" ? e.target.checked : e.target.value,
    }));
  };

  const handleNewTaskSubmit = () => {
    if (!taskData.description || taskData.description.trim() === "") {
      ErrorNotify("Task description is required");
      return;
    }
    if (!taskData.priority) {
      ErrorNotify("Task priority is required");
      return;
    }
    const toastId = LoadingNotify("Adding new task...");
    let deadline = new Date();
    deadline.setHours(24, 0, 0, 0);
    taskData.deadline = deadline;
    taskData.status = taskData.completed ? "completed" : "pending";
    axios
      .post(import.meta.env.VITE_API_URL + "/api/tasks/create", taskData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data == "Task created successfully") {
          setTasks((prev) => [taskData, ...prev]);
          setTaskData({
            description: "",
            priority: "low",
            completed: false,
          });
          SuccessNotify(res.data);
        } else {
          ErrorNotify(res.data);
        }
      })
      .catch((err) => {
        ErrorNotify("Failed to add task");
      })
      .finally(() => {
        DismissToast(toastId);
      });
  };

  const handleTaskEdit = (task) => {
    const toastId = LoadingNotify("Updating task...");
    axios
      .put(import.meta.env.VITE_API_URL + "/api/tasks/update", task, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data == "Task updated successfully") {
          SuccessNotify(res.data);
        } else {
          ErrorNotify(res.data);
        }
      })
      .catch((err) => {
        ErrorNotify("Failed to update task");
      })
      .finally(() => {
        DismissToast(toastId);
      });
  };

  return (
    <div className="min-h-screen w-full flex">
      <Sidebar
        userDetails={userDetails}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <section className="w-full min-h-screen ml-16 p-6 bg-gray-950">
        <div className="text-center items-center mb-8 text-white font-bold text-4xl">
          Today's Tasks
        </div>
        <div className="flex flex-col space-y-4">
          {tasks.length > 0 &&
            tasks.map((task) => (
              <div key={task._id} className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  className="size-7 text-blue-500 border-gray-500 rounded-full transition-all"
                  value={task.completed}
                  onChange={() => {
                    setTasks((prev) =>
                      prev.map((t) =>
                        t._id === task._id
                          ? { ...t, completed: !t.completed }
                          : t
                      )
                    );
                    handleTaskEdit(task);
                  }}
                />
                <input
                  className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={task.description}
                  onChange={() => {
                    setTasks((prev) =>
                      prev.map((t) =>
                        t._id === task._id
                          ? { ...t, description: task.description }
                          : t
                      )
                    );
                    handleTaskEdit(task);
                  }}
                />
                <select
                  name="priority"
                  value={task.priority}
                  onChange={() => {
                    setTasks((prev) =>
                      prev.map((t) =>
                        t._id === task._id
                          ? { ...t, priority: task.priority }
                          : t
                      )
                    );
                    handleTaskEdit(task);
                  }}
                  className="bg-transparent border border-gray-600 rounded-md px-4 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            ))}
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              name="completed"
              value={taskData.completed}
              onChange={handleNewTaskChange}
              className="size-7 text-blue-500 border-gray-500 rounded-full transition-all"
            />
            <input
              className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              name="description"
              value={taskData.description}
              onChange={handleNewTaskChange}
              onKeyDown={(e) => e.key === "Enter" && handleNewTaskSubmit()}
              placeholder="Add a new task..."
            />
            <select
              name="priority"
              value={taskData.priority}
              onChange={handleNewTaskChange}
              className="bg-transparent border border-gray-600 rounded-md px-4 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}