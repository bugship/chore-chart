/**
 * seed.js — populate MongoDB with demo users and tasks for local testing.
 *
 * Usage: npm run seed  (requires MONGODB_URI in .env)
 * WARNING: clears existing users and tasks before inserting sample data.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Task from "./models/Task.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Wipe collections so the seed is idempotent for demos.
    await User.deleteMany({});
    await Task.deleteMany({});

    // Insert already-hashed passwords (bypass model hooks by using insertMany).
    const users = await User.insertMany([
      {
        email: "user1@example.com",
        password: await bcrypt.hash("password1", 10),
      },
      {
        email: "user2@example.com",
        password: await bcrypt.hash("password2", 10),
      },
    ]);

    await Task.insertMany([
      {
        title: "Draft project proposal",
        description: "Outline goals, timeline, and deliverables",
        status: "incomplete",
        priority: "High",
        userId: users[0]._id,
      },
      {
        title: "Review API documentation",
        description: "Confirm endpoints match the frontend contract",
        status: "complete",
        priority: "Medium",
        userId: users[0]._id,
      },
      {
        title: "Weekly team sync",
        description: "Share progress and blockers",
        status: "incomplete",
        priority: "Low",
        userId: users[1]._id,
      },
    ]);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
