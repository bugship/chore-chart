/**
 * Task routes — all endpoints require a valid JWT (authMiddleware).
 * Tasks are always scoped to req.userId from the token payload.
 */
import express from "express";
import jwt from "jsonwebtoken";
import Task from "../models/Task.js";

const router = express.Router();

/**
 * Express middleware: verify Bearer token and attach userId to the request.
 */
const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * GET /api/tasks?status=incomplete|complete
 * Lists the authenticated user's tasks, optionally filtered by status.
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.userId };
    if (status && ["complete", "incomplete"].includes(status)) {
      filter.status = status;
    }

    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/tasks
 * Body: { title, description?, priority? }
 * Creates a task owned by the authenticated user.
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = new Task({
      title,
      description,
      priority: ["Low", "Medium", "High"].includes(priority) ? priority : "Low",
      userId: req.userId,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/tasks/:id
 * Updates fields on a task the user owns (title, description, status, priority).
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    // Scope by userId so one user cannot edit another's task.
    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = ["complete", "incomplete"].includes(status)
      ? status
      : task.status;
    task.priority = ["Low", "Medium", "High"].includes(priority)
      ? priority
      : task.priority;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/tasks/:id
 * Deletes a task owned by the authenticated user.
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
