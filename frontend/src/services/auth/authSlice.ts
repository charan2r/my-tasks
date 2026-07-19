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
  isCheckingAuth: boolean;
  isAuthChecked: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const storedAuth = loadStoredAuth();

const initialState: AuthState = {
  user: storedAuth?.user ?? null,
  token: storedAuth?.token ?? null,
  isLoading: false,
  isCheckingAuth: false,
  isAuthChecked: !storedAuth,
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

export const getMe = createAsyncThunk<
  UserData,
  void,
  { rejectValue: string }
>("auth/getMe", async (_, thunkAPI) => {
  try {
    return await authService.getMe();
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
      state.isCheckingAuth = false;
      state.isAuthChecked = true;
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
        state.isAuthChecked = true;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
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
        state.isAuthChecked = true;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.isError = true;
        state.message = action.payload ?? "Login failed.";
      })
      .addCase(getMe.pending, (state) => {
        state.isCheckingAuth = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.isCheckingAuth = false;
        state.isAuthChecked = true;
        state.user = action.payload;

        if (state.token) {
          localStorage.setItem(
            "auth",
            JSON.stringify({ user: action.payload, token: state.token }),
          );
        }
      })
      .addCase(getMe.rejected, (state, action) => {
        localStorage.removeItem("auth");
        state.isCheckingAuth = false;
        state.isAuthChecked = true;
        state.user = null;
        state.token = null;
        state.isError = true;
        state.message = action.payload ?? "Your session is no longer valid.";
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
