import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import taskService, {
  CreateTaskInput,
  getTaskErrorMessage,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "./taskService";

interface TaskState {
  tasks: Task[];
  filter: "all" | TaskStatus;
  isLoading: boolean;
  isMutating: boolean;
  isError: boolean;
  message: string;
}

const initialState: TaskState = {
  tasks: [],
  filter: "all",
  isLoading: false,
  isMutating: false,
  isError: false,
  message: "",
};

export const getTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  "tasks/getAll",
  async (_, thunkAPI) => {
    try {
      return await taskService.getTasks();
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(getTaskErrorMessage(error));
    }
  },
);

export const createTask = createAsyncThunk<
  Task,
  CreateTaskInput,
  { rejectValue: string }
>("tasks/create", async (taskData, thunkAPI) => {
  try {
    return await taskService.createTask(taskData);
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(getTaskErrorMessage(error));
  }
});

export const updateTask = createAsyncThunk<
  Task,
  { taskId: string; taskData: UpdateTaskInput },
  { rejectValue: string }
>("tasks/update", async ({ taskId, taskData }, thunkAPI) => {
  try {
    return await taskService.updateTask(taskId, taskData);
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(getTaskErrorMessage(error));
  }
});

export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("tasks/delete", async (taskId, thunkAPI) => {
  try {
    return await taskService.deleteTask(taskId);
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(getTaskErrorMessage(error));
  }
});

export const updateTaskStatus = createAsyncThunk<
  Task,
  { taskId: string; status: TaskStatus },
  { rejectValue: string }
>("tasks/updateStatus", async ({ taskId, status }, thunkAPI) => {
  try {
    return await taskService.updateTaskStatus(taskId, status);
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(getTaskErrorMessage(error));
  }
});

const setMutationPending = (state: TaskState) => {
  state.isMutating = true;
  state.isError = false;
  state.message = "";
};

const setMutationRejected = (
  state: TaskState,
  action: PayloadAction<string | undefined>,
) => {
  state.isMutating = false;
  state.isError = true;
  state.message = action.payload ?? "Task request failed.";
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    resetTasks: () => initialState,
    setFilter: (state, action: PayloadAction<"all" | TaskStatus>) => {
      state.filter = action.payload;
    },
    resetStatus: (state) => {
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Unable to load tasks.";
      })
      .addCase(createTask.pending, setMutationPending)
      .addCase(createTask.fulfilled, (state, action) => {
        state.isMutating = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, setMutationRejected)
      .addCase(updateTask.pending, setMutationPending)
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isMutating = false;
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(updateTask.rejected, setMutationRejected)
      .addCase(deleteTask.pending, setMutationPending)
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isMutating = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, setMutationRejected)
      .addCase(updateTaskStatus.pending, setMutationPending)
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.isMutating = false;
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(updateTaskStatus.rejected, setMutationRejected);
  },
});

export const { resetTasks, setFilter, resetStatus } = taskSlice.actions;
export { type Task } from "./taskService";
export default taskSlice.reducer;
