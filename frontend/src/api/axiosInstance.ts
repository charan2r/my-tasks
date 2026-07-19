import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("auth");
    const auth = raw ? JSON.parse(raw) : null;

    if (typeof auth?.token === "string") {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
  } catch {
    localStorage.removeItem("auth");
  }

  return config;
});

export default api;
