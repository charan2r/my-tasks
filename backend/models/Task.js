import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: ["todo", "in_progress", "completed"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
