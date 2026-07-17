import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "user",
      enum: ["EMPLOYEE", "SUPER_ADMIN", "HR"],
    },
    isActive: { type: Boolean, default: true, enum: [true, false] },
  },
  { timestamps: true },
);
