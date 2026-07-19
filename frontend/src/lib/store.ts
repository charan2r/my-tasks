import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../services/auth/authSlice";
import taskReducer from "../services/tasks/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
