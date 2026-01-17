// File: src/components/layout/DashboardShell.jsx
import React, { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import Button from "../ui/Button.jsx";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Image,
  Layers,
  List,
  Tag,
  QrCode,
  Users,
  Store,
  LogOut,
  Menu,
  X,
  MoreHorizontal
} from "lucide-react";

function NavItem({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition outline-none focus-visible:ring-2 focus-visible:ring-green-500/40 ${
          isActive ? "bg-green-50 text-green-800 border border-green-200" : "text-gray-700 hover:bg-gray-50"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`grid h-8 w-8 place-items-center rounded-lg border transition ${
              isActive
                ? "border-green-200 bg-white text-green-700"
                : "border-gray-100 bg-white text-gray-500 group-hover:text-gray-700"
            }`}
          >
            {icon}
          </span>
          <span className="flex-1">{label}</span>
          <span
            className={`h-2 w-2 rounded-full transition ${
              isActive ? "bg-green-500" : "bg-gray-200 opacity-0 group-hover:opacity-100"
            }`}
          />
        </>
      )}
    </NavLink>
  );
}

function MobileTab({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-semibold transition ${
          isActive ? "text-green-700" : "text-gray-600 hover:text-gray-800"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`grid h-10 w-10 place-items-center rounded-2xl border transition ${
              isActive ? "border-green-200 bg-green-50" : "border-gray-100 bg-white hover:bg-gray-50"
            }`}
          >
            {icon}
          </span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function DashboardShell({ kind = "owner" }) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const ownerMenu = useMemo(
    () => [
      { to: "/owner", label: "نظرة عامة", icon: <LayoutDashboard size={18} /> },
      { to: "/owner/restaurant", label: "بيانات المطعم", icon: <Store size={18} /> },
      { to: "/owner/uploads", label: "الصور", icon: <Image size={18} /> },
      { to: "/owner/menu/sections", label: "أقسام المنيو", icon: <Layers size={18} /> },
      { to: "/owner/menu/items", label: "أصناف المنيو", icon: <List size={18} /> },
      { to: "/owner/offers", label: "عروض اليوم", icon: <Tag size={18} /> },
      { to: "/owner/tables", label: "الطاولات و QR", icon: <QrCode size={18} /> }
    ],
    []
  );

  const adminMenu = useMemo(
    () => [
      { to: "/admin/restaurants", label: "المطاعم", icon: <Store size={18} /> },
      { to: "/admin/users", label: "المستخدمين", icon: <Users size={18} /> },
      { to: "/admin/create-owner", label: "إنشاء Owner", icon: <UtensilsCrossed size={18} /> }
    ],
    []
  );

  const menu = kind === "admin" ? adminMenu : ownerMenu;

  const initials = (user?.name || "U")
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  // mobile shortcuts (keep it minimal)
  const mobileTabs =
    kind === "admin"
      ? [
          { to: "/admin/restaurants", label: "المطاعم", icon: <Store size={18} /> },
          { to: "/admin/users", label: "المستخدمين", icon: <Users size={18} /> },
          { to: "/admin/create-owner", label: "إنشاء", icon: <UtensilsCrossed size={18} /> }
        ]
      : [
          { to: "/owner", label: "لوحة", icon: <LayoutDashboard size={18} /> },
          { to: "/owner/uploads", label: "الصور", icon: <Image size={18} /> },
          { to: "/owner/offers", label: "العروض", icon: <Tag size={18} /> },
          { to: "/owner/tables", label: "QR", icon: <QrCode size={18} /> }
        ];

  return (
    <div className="rounded-3xl bg-gray-50 p-2 sm:p-4">
      {/* Mobile top bar */}
      <div className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-soft lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-green-600 text-white font-black shadow-sm">
            QR
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-gray-900">Syrian Menu</div>
            <div className="text-xs text-gray-500">{kind === "admin" ? "لوحة الأدمن" : "لوحة المطعم"}</div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-gray-100 bg-gray-50 text-sm font-extrabold text-gray-700">
            {initials}
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-2xl border border-gray-100 bg-white hover:bg-gray-50"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden h-fit rounded-2xl border border-gray-100 bg-white p-3 shadow-soft lg:sticky lg:top-4 lg:block">
          <Link
            to="/"
            className="mb-3 flex items-center gap-3 rounded-2xl bg-green-600 px-3 py-3 text-white shadow-sm transition hover:brightness-[0.98]"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-lg font-black">QR</div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold">Syrian Menu</div>
              <div className="text-xs opacity-90">{kind === "admin" ? "لوحة الأدمن" : "لوحة المطعم"}</div>
            </div>
          </Link>

          <div className="mb-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white border border-gray-100 text-sm font-extrabold text-gray-700">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-500">المستخدم</div>
                <div className="truncate text-sm font-bold text-gray-900">{user?.name || "-"}</div>
                <div className="mt-0.5 text-xs text-gray-600">role: {user?.role}</div>
              </div>
            </div>

            {user?.restaurantId ? (
              <div className="mt-2 rounded-xl bg-white px-3 py-2 text-xs text-gray-600 border border-gray-100">
                RestaurantId: <span className="font-semibold">{user.restaurantId}</span>
              </div>
            ) : null}
          </div>

          <nav className="flex flex-col gap-2">{menu.map((m) => <NavItem key={m.to} {...m} />)}</nav>

          <div className="mt-4">
            <Button
              variant="ghost"
              className="w-full justify-center gap-2"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
            >
              <LogOut size={16} />
              خروج
            </Button>
          </div>
        </aside>

        {/* Content (add bottom padding for mobile nav) */}
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft sm:p-6 pb-24 lg:pb-6">
          <Outlet />
        </section>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <div className="mx-auto max-w-6xl px-4 pb-safe">
          <div className="mb-3 rounded-3xl border border-gray-100 bg-white/90 p-2 shadow-soft backdrop-blur">
            <div className={`grid ${kind === "admin" ? "grid-cols-4" : "grid-cols-5"} gap-2`}>
              {kind === "admin" ? (
                <>
                  <MobileTab to={mobileTabs[0].to} label={mobileTabs[0].label} icon={mobileTabs[0].icon} />
                  <MobileTab to={mobileTabs[1].to} label={mobileTabs[1].label} icon={mobileTabs[1].icon} />
                  <MobileTab to={mobileTabs[2].to} label={mobileTabs[2].label} icon={mobileTabs[2].icon} />
                  <button
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-semibold text-gray-600 hover:text-gray-800"
                    onClick={() => setDrawerOpen(true)}
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-2xl border border-gray-100 bg-white hover:bg-gray-50">
                      <MoreHorizontal size={18} />
                    </span>
                    <span>المزيد</span>
                  </button>
                </>
              ) : (
                <>
                  {mobileTabs.slice(0, 4).map((t) => (
                    <MobileTab key={t.to} to={t.to} label={t.label} icon={t.icon} />
                  ))}
                  <button
                    className="flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-semibold text-gray-600 hover:text-gray-800"
                    onClick={() => setDrawerOpen(true)}
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-2xl border border-gray-100 bg-white hover:bg-gray-50">
                      <MoreHorizontal size={18} />
                    </span>
                    <span>المزيد</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-3xl bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="text-sm font-extrabold">القائمة</div>
              <button
                className="grid h-10 w-10 place-items-center rounded-2xl border border-gray-100 bg-white hover:bg-gray-50"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                <div className="text-xs text-gray-500">المستخدم</div>
                <div className="mt-1 text-sm font-bold text-gray-900">{user?.name || "-"}</div>
                <div className="mt-1 text-xs text-gray-600">role: {user?.role}</div>
                {user?.restaurantId ? (
                  <div className="mt-2 text-xs text-gray-600">
                    RestaurantId: <span className="font-semibold">{user.restaurantId}</span>
                  </div>
                ) : null}
                <div className="mt-2 text-[11px] text-gray-500 truncate">
                  {loc.pathname}
                </div>
              </div>

              <nav className="flex flex-col gap-2">
                {menu.map((m) => (
                  <NavItem key={m.to} {...m} onClick={() => setDrawerOpen(false)} />
                ))}
              </nav>

              <div className="mt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    setDrawerOpen(false);
                    logout();
                    window.location.href = "/";
                  }}
                >
                  <LogOut size={16} />
                  خروج
                </Button>
              </div>
            </div>

            <div className="h-4 pb-safe" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
