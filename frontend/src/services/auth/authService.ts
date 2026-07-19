import axios from "axios";
import api from "../../api/axiosInstance";

export interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiErrorResponse {
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export const getAuthErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const validationMessage = error.response?.data.errors?.[0]?.message;
    return (
      validationMessage ??
      error.response?.data.message ??
      (error.response ? "Authentication failed." : "Unable to reach the server.")
    );
  }

  return error instanceof Error ? error.message : "Authentication failed.";
};

const register = async (
  userData: RegisterCredentials,
): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    userData,
  );
  return response.data.data;
};

const login = async (userData: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    userData,
  );
  return response.data.data;
};

const getMe = async (): Promise<UserData> => {
  const response = await api.get<ApiResponse<{ user: UserData }>>("/auth/me");
  return response.data.data.user;
};

const authService = { register, login, getMe };

export default authService;
