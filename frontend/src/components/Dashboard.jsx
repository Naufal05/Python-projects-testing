import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      handleLogout();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", { title, description, status: "pending" });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
      fetchTasks();
    } catch (err) {
      alert("Failed to update task");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="flex justify-between items-center mb-8 pb-4 border-b">
        <h1 className="text-3xl font-extrabold text-indigo-600">Taskify</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Task Creation Form */}
      <form
        onSubmit={handleCreateTask}
        className="bg-white p-6 rounded-lg shadow-sm mb-8 border space-y-4"
      >
        <h2 className="text-xl font-semibold">Create New Task</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="p-2 border rounded-md w-full focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="text"
            placeholder="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded-md w-full focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Task
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found. Add some above!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border"
            >
              <div>
                <h3
                  className={`text-lg font-bold ${task.status === "Completed" ? "line-through text-gray-400" : ""}`}
                >
                  {task.title}
                </h3>
                <p className="text-gray-600 text-sm">{task.description}</p>
                <span
                  className={`text-xs px-2 py-1 rounded font-semibold mt-1 inline-block ${task.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                >
                  {task.status}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleStatus(task)}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 text-sm"
                >
                  {task.status === "Completed"
                    ? "Mark Pending"
                    : "Mark Complete"}
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
