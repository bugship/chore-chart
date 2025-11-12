/**
 * server.js — Express API entry point for Chore Chart.
 *
 * Responsibilities:
 *  - Load environment variables (PORT, MONGODB_URI, JWT_SECRET)
 *  - Enable CORS and JSON body parsing
 *  - Mount /api/auth and /api/tasks routers
 *  - Connect to MongoDB, then listen for HTTP traffic
 */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();

// Allow the Vite frontend (and other clients) to call this API from another origin.
app.use(cors());
// Parse application/json request bodies into req.body.
app.use(express.json());

// Route modules
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Connect to MongoDB using the URI from .env (or Docker Compose environment).
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
