/**
 * Task model
 *
 * Each task belongs to exactly one user (userId). Status and priority are enums
 * so the API and UI stay in sync on allowed values.
 */
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    // "incomplete" = active; "complete" = done (matches frontend filter values).
    status: {
      type: String,
      enum: ["incomplete", "complete"],
      default: "incomplete",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    // Owner of the task — used to scope list/update/delete to the logged-in user.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Task", taskSchema);
