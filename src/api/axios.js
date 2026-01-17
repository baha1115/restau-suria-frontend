// File: src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  timeout: 20000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function unwrap(res) {
  const payload = res?.data;
  if (!payload?.success) {
    const msg = payload?.message || "Request failed";
    const details = payload?.errors ? `\n${payload.errors.join("\n")}` : "";
    throw new Error(msg + details);
  }
  return payload.data;
}

export { unwrap };
export default api;
