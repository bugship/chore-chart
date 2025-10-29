import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Low",
  });
  const [error, setError] = useState("");
  const { token, logout } = useAuth();

  const fetchTasks = async () => {
    try {
      const url =
        filter === "all"
          ? `${import.meta.env.VITE_API_URL}/tasks`
          : `${import.meta.env.VITE_API_URL}/tasks?status=${filter}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTasks([...tasks, data]);
      setNewTask({ title: "", description: "", priority: "Low" });
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTasks(tasks.map((task) => (task._id === id ? data : task)));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter, token]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
          onSubmit={addTask}
          className="bg-white p-6 rounded shadow-md mb-6"
        >
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Priority</label>
            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </form>

        <div className="mb-6">
          <label className="mr-2">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All</option>
            <option value="incomplete">Active</option>
            <option value="complete">Completed</option>
          </select>
        </div>

        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded shadow-md flex justify-between items-center"
            >
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    task.status === "complete" ? "line-through" : ""
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500">
                  Priority: {task.priority}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateTask(task._id, {
                      status:
                        task.status === "complete" ? "incomplete" : "complete",
                    })
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  {task.status === "complete" ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
