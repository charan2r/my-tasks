import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import authService, {
  AuthResponse,
  getAuthErrorMessage,
  LoginCredentials,
  RegisterCredentials,
  UserData,
} from "./authService";

const loadStoredAuth = (): AuthResponse | null => {
  try {
    const rawAuth = localStorage.getItem("auth");
    if (!rawAuth) return null;

    const auth = JSON.parse(rawAuth) as Partial<AuthResponse>;
    return auth.user && typeof auth.token === "string"
      ? (auth as AuthResponse)
      : null;
  } catch {
    localStorage.removeItem("auth");
    return null;
  }
};

interface AuthState {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const storedAuth = loadStoredAuth();

const initialState: AuthState = {
  user: storedAuth?.user ?? null,
  token: storedAuth?.token ?? null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const register = createAsyncThunk<
  AuthResponse,
  RegisterCredentials,
  { rejectValue: string }
>("auth/register", async (user, thunkAPI) => {
  try {
    const response = await authService.register(user);
    localStorage.setItem("auth", JSON.stringify(response));
    return response;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(getAuthErrorMessage(error));
  }
});

export const login = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (user, thunkAPI) => {
  try {
    const response = await authService.login(user);
    localStorage.setItem("auth", JSON.stringify(response));
    return response;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(getAuthErrorMessage(error));
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    logout: (state) => {
      localStorage.removeItem("auth");
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Registration failed.";
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Login failed.";
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
