import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    employeeId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: String,
    department: String,
    designation: String,
    salary: Number,
    joiningDate: Date,
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    profileImage: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Employee", employeeSchema);
