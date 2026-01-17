// File: src/context/AuthContext.jsx
import React, { createContext, useEffect, useMemo, useState } from "react";
import authApi from "../api/auth.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const isAuthed = !!token;

  async function refreshMe() {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await authApi.me();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (e) {
      // token invalid
      logout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email, password) {
    const data = await authApi.login({ email, password });

    setToken(data.token);
    localStorage.setItem("token", data.token);

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data.user;
  }

  // ✅ NEW: register like login (save token + user)
  async function register(name, email, password) {
    const data = await authApi.register({ name, email, password });

    setToken(data.token);
    localStorage.setItem("token", data.token);

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data.user;
  }

  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const value = useMemo(
    () => ({ token, user, isAuthed, loading, login, register, logout, refreshMe }),
    [token, user, isAuthed, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
