// File: src/App.jsx
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout.jsx";
import OwnerLayout from "./components/layout/OwnerLayout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";

import HomePage from "./pages/public/HomePage.jsx";
import RestaurantsPage from "./pages/public/RestaurantsPage.jsx";
import RestaurantPage from "./pages/public/RestaurantPage.jsx";
import MenuPage from "./pages/public/MenuPage.jsx";
import SearchPage from "./pages/public/SearchPage.jsx";

import LoginPage from "./pages/auth/LoginPage.jsx";
//import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";

import OwnerRoute from "./routes/OwnerRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

import OwnerHome from "./pages/owner/OwnerHome.jsx";
import OwnerRestaurantForm from "./pages/owner/OwnerRestaurantForm.jsx";
import OwnerUploads from "./pages/owner/OwnerUploads.jsx";
import OwnerSections from "./pages/owner/OwnerSections.jsx";
import OwnerItems from "./pages/owner/OwnerItems.jsx";
import OwnerOffers from "./pages/owner/OwnerOffers.jsx";
import OwnerTables from "./pages/owner/OwnerTables.jsx";

import AdminRestaurants from "./pages/admin/AdminRestaurants.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminCreateOwner from "./pages/admin/AdminCreateOwner.jsx";

import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/r/:slug" element={<RestaurantPage />} />
        <Route path="/r/:slug/menu" element={<MenuPage />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      {/*<Route path="/register" element={<RegisterPage />} />*/}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Owner */}
      <Route element={<OwnerRoute />}>
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<OwnerHome />} />
          <Route path="restaurant" element={<OwnerRestaurantForm />} />
          <Route path="uploads" element={<OwnerUploads />} />
          <Route path="menu/sections" element={<OwnerSections />} />
          <Route path="menu/items" element={<OwnerItems />} />
          <Route path="offers" element={<OwnerOffers />} />
          <Route path="tables" element={<OwnerTables />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/restaurants" replace />} />
          <Route path="restaurants" element={<AdminRestaurants />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="create-owner" element={<AdminCreateOwner />} />
        </Route>
      </Route>

      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
