import axios from "axios";
import { useEffect, useRef, useState } from "react";
import DeleteIcon from "../../components/icons/trash";

export default function TodayTasks() {
  const [taskData, setTaskData] = useState({
    description: "",
    priority: "0",
    completed: false,
  });
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const scroll = useRef(0);
  const [deletePopup, setDeletePopup] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState({});
  const [status, setStatus] = useState({
    success: 0,
    message: "",
  });

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
    if(!loading) return;
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
        setStatus({
          success: 2,
          message: err.response?.data || "Failed to fetch tasks",
        });
      }).finally(() => setLoading(false));
  }, [page, loading]);

  const handleSubmit = () => {
    if (!taskData.description || taskData.description.trim() === "") {
      setStatus({
        success: 2,
        message: "Task description is required",
      });
      return;
    }
    setStatus({
      success: 1,
      message: "Adding task...",
    });
    let deadline = new Date();
    deadline.setHours(23, 59, 59, 999);
    taskData.deadline = deadline;
    taskData.status = taskData.completed ? "completed" : "pending";
    taskData.priority = parseInt(taskData.priority);
    axios
      .post(import.meta.env.VITE_API_URL + "/api/tasks/create", taskData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data === "Task created successfully") {
          setLoading(true);
          setTaskData({
            description: "",
            priority: "0",
            completed: false,
          });
          setStatus({
            success: 0,
            message: "Task added successfully",
          });
        } else {
          setStatus({
            success: 2,
            message: res.data || "Failed to add task",
          });
        }
      })
      .catch((err) => {
        setStatus({
          success: 2,
          message: err.response?.data || "Failed to add task",
        });
      });
  };

  const handleUpdate = (task) => {
    if (!task.description || task.description.trim() === "") {
      setStatus({
        success: 2,
        message: "Task description is required",
      });
      return;
    }
    if (!task.deadline) {
      setStatus({
        success: 2,
        message: "Task deadline is required",
      });
      return;
    }
    setStatus({
      success: 1,
      message: "Updating task details...",
    });
    task.priority = parseInt(task.priority);
    axios
      .put(import.meta.env.VITE_API_URL + "/api/tasks/update", task, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data === "Task details updated") {
          setStatus({
            success: 0,
            message: "Task details updated successfully",
          });
          if (task.is_completed) {
            setTasks((prev) => prev.filter((t) => t._id !== task._id));
          }
        } else {
          setStatus({
            success: 2,
            message: res.data || "Failed to update task",
          });
        }
      })
      .catch((err) => {
        setStatus({
          success: 2,
          message: err.response?.data || "Failed to update task",
        });
      });
  };

  const handleDelete = () => {
    if (!taskToDelete._id) {
      setStatus({
        success: 2,
        message: "No task selected for deletion",
      });
      return;
    }
    setStatus({
      success: 1,
      message: "Deleting task...",
    });
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
          setStatus({
            success: 0,
            message: "Task deleted successfully",
          });
        } else {
          setStatus({
            success: 2,
            message: res.data || "Failed to delete task",
          });
        }
      })
      .catch((err) => {
        setStatus({
          success: 2,
          message: err.response?.data || "Failed to delete task",
        });
      })
      .finally(() => {
        setDeletePopup(false);
      });
  };

  return (
    <section className="w-full min-h-screen ml-16 p-6">
      <div
        className={`fixed inset-0 backdrop-blur-md z-50 flex justify-center items-center ${!deletePopup && "hidden"
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
      <div className="text-center items-center mb-8 font-bold text-4xl">
        Today's Tasks
      </div>
      {status.message && (
        <div
          className={`p-4 mb-4 rounded-lg ${status.success === 0
            ? "bg-green-100 text-green-800"
            : status.success === 1
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          <p className="text-sm">{status.message}</p>
        </div>
      )}
      <div className="flex flex-col space-y-4">
        {Array.isArray(tasks) &&
          tasks.length > 0 &&
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
                className={`w-full border border-gray-600 rounded-md px-4 py-1 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${task.status === "overdue"
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
                className="bg-transparent border border-gray-600 rounded-md px-4 py-1 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="0">Low</option>
                <option value="1">Medium</option>
                <option value="2">High</option>
              </select>
              <input
                type="date"
                value={new Date(task.deadline).toISOString().split("T")[0]}
                min={new Date().toISOString().split("T")[0]}
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
                className="w-full border border-gray-600 rounded-md px-4 py-1 max-w-36 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                className="border border-gray-600 bg-transparent font-medium p-2 rounded-lg shadow-md hover:bg-red-700 transition flex items-center"
                onClick={() => {
                  setDeletePopup(true);
                  setTaskToDelete(task);
                }}
              >
                <DeleteIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            value={taskData.completed}
            onChange={(e) => setTaskData(prev => ({ ...prev, completed: e.target.checked }))}
            className="size-7 text-blue-500 border-gray-500 rounded-full transition-all"
          />
          <input
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-1 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={taskData.description}
            onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Add a new task..."
          />
          <select
            value={taskData.priority}
            onChange={(e) => setTaskData(prev => ({ ...prev, priority: e.target.value }))}
            className="bg-transparent border border-gray-600 rounded-md px-4 py-1 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="0">Low</option>
            <option value="1">Medium</option>
            <option value="2">High</option>
          </select>
        </div>
      </div>
    </section>
  );
}
