// File: src/routes/AdminRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function AdminRoute() {
  const { loading, isAuthed, user } = useAuth();

  if (loading) return null;
  if (!isAuthed) return <Navigate to="/login" replace />;

  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}
