import Task from "../models/Task.js";

function formatTask(task) {
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

function taskNotFound(res) {
  return res.status(404).json({
    success: false,
    message: "Task not found.",
  });
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const getTasks = async (req, res) => {
  const { status, search, sortBy, sortOrder, page, limit } = req.validatedQuery;
  const filter = { user: req.user._id };

  if (status !== "all") {
    filter.status = status;
  }

  if (search) {
    const searchPattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: searchPattern }, { description: searchPattern }];
  }

  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort({ [sortBy]: sortDirection, _id: sortDirection })
      .skip(skip)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    message: "Tasks fetched successfully.",
    data: {
      tasks: tasks.map(formatTask),
      count: tasks.length,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  });
};

export const createTask = async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;
  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    priority,
    status,
    dueDate,
  });

  return res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: { task: formatTask(task) },
  });
};

export const getTaskById = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    return taskNotFound(res);
  }

  return res.status(200).json({
    success: true,
    message: "Task fetched successfully.",
    data: { task: formatTask(task) },
  });
};

export const updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!task) {
    return taskNotFound(res);
  }

  return res.status(200).json({
    success: true,
    message: "Task updated successfully.",
    data: { task: formatTask(task) },
  });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    return taskNotFound(res);
  }

  return res.status(200).json({
    success: true,
    message: "Task deleted successfully.",
    data: { task: formatTask(task) },
  });
};

export const updateTaskStatus = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: { status: req.body.status } },
    { new: true, runValidators: true },
  );

  if (!task) {
    return taskNotFound(res);
  }

  return res.status(200).json({
    success: true,
    message: "Task status updated successfully.",
    data: { task: formatTask(task) },
  });
};
