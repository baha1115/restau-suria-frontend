// File: src/routes/OwnerRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function OwnerRoute() {
  const { loading, isAuthed, user } = useAuth();

  if (loading) return null;
  if (!isAuthed) return <Navigate to="/login" replace />;

  const role = user?.role;
  if (role !== "owner" && role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}
