import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    reportingManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "employeeId"
  seq: { type: Number, default: 0 },
});

export const Counter = mongoose.model('Counter', counterSchema);
export const Employee = mongoose.model('Employee', employeeSchema);
