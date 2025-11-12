/**
 * User model
 *
 * Stores account credentials for JWT-based login.
 * Passwords are hashed with bcrypt in a pre-save hook so plaintext never hits the DB.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      // Normalize emails so "User@X.com" and "user@x.com" collide correctly.
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true },
);

// Hash password before first save (and when password is modified).
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare a plaintext password to the stored hash (used during login).
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
