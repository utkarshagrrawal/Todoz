import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { ErrorNotify, SuccessNotify } from "../../components/toast";

export default function NonCompletedTasks() {
  const [taskData, setTaskData] = useState({
    description: "",
    priority: "0",
    completed: false,
    deadline: new Date(),
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
      .get(
        import.meta.env.VITE_API_URL + "/api/tasks/non-completed?page=" + page,
        {
          withCredentials: true,
        }
      )
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
    setTaskData((prev) => {
      if (e instanceof Date) {
        return {
          ...prev,
          deadline: e,
        };
      } else {
        return {
          ...prev,
          [e.target.name]:
            e.target.name === "completed" ? e.target.checked : e.target.value,
        };
      }
    });
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
    if (!taskData.deadline) {
      ErrorNotify("Task deadline is required");
      return;
    }
    taskData.deadline = new Date(taskData.deadline).toISOString();
    taskData.priority = parseInt(taskData.priority);
    axios
      .post(import.meta.env.VITE_API_URL + "/api/tasks/create", taskData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data === "Task created successfully") {
          SuccessNotify(res.data);
          if (!taskData.completed) {
            setTasks((prev) => [...prev, taskData]);
          }
          setTaskData({
            description: "",
            priority: "0",
            completed: false,
            deadline: new Date(),
          });
        } else {
          ErrorNotify(res.data);
        }
      })
      .catch((err) => {
        ErrorNotify("Failed to create task");
      });
  };

  const handleTaskEdit = (task) => {
    if (!task.description || task.description.trim() === "") {
      ErrorNotify("Task description is required");
      return;
    }
    if (!task.priority) {
      ErrorNotify("Task priority is required");
      return;
    }
    if (!task.deadline) {
      ErrorNotify("Task deadline is required");
      return;
    }
    task.deadline = new Date(task.deadline).toISOString();
    task.priority = parseInt(task.priority);
    axios
      .put(import.meta.env.VITE_API_URL + "/api/tasks/update", task, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data === "Task details updated") {
          SuccessNotify(res.data);
          if (task.is_completed) {
            setTasks((prev) => prev.filter((t) => t._id !== task._id));
          }
        } else {
          ErrorNotify(res.data);
        }
      })
      .catch((err) => {
        ErrorNotify("Failed to update task");
      });
  };

  return (
    <section className="w-full min-h-screen ml-16 p-6 bg-gray-950">
      <div className="text-center items-center mb-8 text-white font-bold text-4xl">
        All incomplete tasks
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
            <option value="0">Low</option>
            <option value="1">Medium</option>
            <option value="2">High</option>
          </select>
          <DatePicker
            selected={taskData.deadline}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            minDate={new Date()}
            dateFormat={"dd/MMM/yyyy"}
            value={taskData.deadline}
            onChange={(date) => handleNewTaskChange(date)}
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>
    </section>
  );
}
