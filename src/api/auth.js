// File: src/api/auth.js
import api, { unwrap } from "./axios.js";

const authApi = {
  async login(body) {
    const res = await api.post("/api/auth/login", body);
    return unwrap(res);
  },
  async register(body) {
    const res = await api.post("/api/auth/register", body);
    return unwrap(res);
  },
  async me() {
    const res = await api.get("/api/auth/me");
    return unwrap(res);
  },

  // ✅ NEW (Backend updates)
  async forgotPassword(email) {
    const res = await api.post("/api/auth/forgot-password", { email });
    return unwrap(res);
  },
  async resetPassword(token, newPassword) {
    const res = await api.post("/api/auth/reset-password", { token, newPassword });
    return unwrap(res);
  }
};

export default authApi;