import axios from "axios";
import api from "../../api/axiosInstance";

export type TaskStatus = "pending" | "completed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface TaskListData {
  tasks: Task[];
  count: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface ApiErrorResponse {
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export const getTaskErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data.errors?.[0]?.message ??
      error.response?.data.message ??
      (error.response ? "Task request failed." : "Unable to reach the server.")
    );
  }

  return error instanceof Error ? error.message : "Task request failed.";
};

const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<ApiResponse<TaskListData>>("/tasks", {
    params: { limit: 100 },
  });
  return response.data.data.tasks;
};

const createTask = async (taskData: CreateTaskInput): Promise<Task> => {
  const response = await api.post<ApiResponse<{ task: Task }>>(
    "/tasks",
    taskData,
  );
  return response.data.data.task;
};

const updateTask = async (
  taskId: string,
  taskData: UpdateTaskInput,
): Promise<Task> => {
  const response = await api.patch<ApiResponse<{ task: Task }>>(
    `/tasks/${taskId}`,
    taskData,
  );
  return response.data.data.task;
};

const deleteTask = async (taskId: string): Promise<string> => {
  await api.delete(`/tasks/${taskId}`);
  return taskId;
};

const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus,
): Promise<Task> => {
  const response = await api.patch<ApiResponse<{ task: Task }>>(
    `/tasks/${taskId}/status`,
    { status },
  );
  return response.data.data.task;
};

export default { getTasks, createTask, updateTask, deleteTask, updateTaskStatus };
