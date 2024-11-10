import axios from "axios";
import {
  DismissToast,
  ErrorNotify,
  LoadingNotify,
  SuccessNotify,
} from "../../components/toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useRef, useState } from "react";

export default function TodayTasks() {
  const [taskData, setTaskData] = useState({
    description: "",
    priority: "low",
    completed: false,
  });
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
      .get(import.meta.env.VITE_API_URL + "/api/tasks/today?page=" + page, {
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
    deadline.setHours(23, 59, 59, 999);
    taskData.deadline = deadline;
    taskData.status = taskData.completed ? "completed" : "pending";
    axios
      .post(import.meta.env.VITE_API_URL + "/api/tasks/create", taskData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data === "Task created successfully") {
          setTasks((prev) => [...prev, taskData]);
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
        if (res.data === "Task details updated") {
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
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
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
  );
}
