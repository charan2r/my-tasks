import { z } from "zod";

const taskIdParams = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Enter a valid task ID."),
});

const taskStatus = z.enum(["pending", "completed"], {
  error: "Status must be pending or completed.",
});

const taskPriority = z.enum(["low", "medium", "high"], {
  error: "Priority must be low, medium or high.",
});

const dueDate = z
  .string({ error: "Due date is required." })
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid due date.");

export const taskIdSchema = z.object({
  params: taskIdParams,
});

export const listTasksSchema = z.object({
  query: z.object({
    status: z.enum(["all", "pending", "completed"]).optional().default("all"),
    search: z.string().trim().max(100, "Search cannot exceed 100 characters.").optional(),
    sortBy: z
      .enum(["createdAt", "updatedAt", "dueDate", "title", "priority"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  }),
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({ error: "Title is required." })
      .trim()
      .min(4, "Title must contain at least 4 characters.")
      .max(100, "Title cannot exceed 100 characters."),
    description: z
      .string()
      .trim()
      .max(1000, "Description cannot exceed 1000 characters.")
      .optional()
      .default(""),
    priority: taskPriority.optional().default("medium"),
    status: taskStatus,
    dueDate,
  }),
});

export const updateTaskSchema = z.object({
  params: taskIdParams,
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(4, "Title must contain at least 4 characters.")
        .max(100, "Title cannot exceed 100 characters.")
        .optional(),
      description: z
        .string()
        .trim()
        .max(1000, "Description cannot exceed 1000 characters.")
        .optional(),
      priority: taskPriority.optional(),
      dueDate: dueDate.optional(),
      status: taskStatus.optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "Provide at least one field to update.",
    }),
});

export const updateTaskStatusSchema = z.object({
  params: taskIdParams,
  body: z.object({ status: taskStatus }),
});
