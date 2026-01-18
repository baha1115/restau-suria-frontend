// File: src/components/layout/PublicLayout.jsx
import React, { useMemo } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import Button from "../ui/Button.jsx";
import {
  LogIn,
  LogOut,
  Home as HomeIcon,
  Search as SearchIcon,
  Store as StoreIcon,
  LayoutDashboard as DashboardIcon
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LOGO_LOTTIE =
  "https://lottie.host/d4b67383-4e42-498c-89cc-9217a50b1759/EmHQYJRWdC.lottie";

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="text-sm text-gray-600 hover:text-green-700 transition">
      {children}
    </Link>
  );
}

function LottieLogo({ size = 44 }) {
  return (
    <div
      className="lottie-fit rounded-xl shadow-sm overflow-hidden bg-transparent"
      style={{ width: size, height: size }}
      aria-label="Syrian Menu Logo"
    >
      <DotLottieReact src={LOGO_LOTTIE} loop autoplay />
    </div>
  );
}

function MobileNavItem({ to, icon: Icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition",
          "min-w-[72px]",
          isActive
            ? "bg-green-50 text-green-700 shadow-[0_10px_25px_rgba(22,163,74,0.12)]"
            : "text-gray-500 hover:bg-gray-50"
        ].join(" ")
      }
    >
      <Icon size={20} />
      <span className="text-[11px] font-semibold">{label}</span>
    </NavLink>
  );
}

export default function PublicLayout() {
  const { user, isAuthed, logout } = useAuth();
  const loc = useLocation();

  const dashboardLink = useMemo(() => {
    if (!isAuthed) return "/login";
    if (user?.role === "admin") return "/admin/restaurants";
    return "/owner";
  }, [isAuthed, user?.role]);

  const dashboardLabel = useMemo(() => {
    if (!isAuthed) return "دخول";
    if (user?.role === "admin") return "الأدمن";
    return "لوحتي";
  }, [isAuthed, user?.role]);

  return (
    // ✅ pb للهواتف حتى ما يغطي الـ mobile nav المحتوى/الفوتر
    <div className="min-h-screen bg-gray-50 bg-grid flex flex-col pb-[calc(84px+env(safe-area-inset-bottom))] sm:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="container-page flex items-center justify-between py-3">
          <Link to="/" className="group flex items-center gap-2">
            <div className="transition group-hover:scale-[1.02]">
              <LottieLogo size={44} />
            </div>

            <div className="leading-tight">
              <div className="text-sm font-extrabold text-gray-900">Syrian Menu</div>
              <div className="text-xs text-gray-500">QR للمطاعم</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {isAuthed ? (
              <>
                {user?.role === "admin" ? (
                  <Link to="/admin/restaurants" className="hidden sm:block">
                    <Button variant="secondary">لوحة الأدمن</Button>
                  </Link>
                ) : (
                  <Link to="/owner" className="hidden sm:block">
                    <Button variant="secondary">لوحة المطعم</Button>
                  </Link>
                )}

                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                    if (loc.pathname.startsWith("/owner") || loc.pathname.startsWith("/admin")) {
                      window.location.href = "/";
                    }
                  }}
                  className="gap-2"
                >
                  <LogOut size={16} />
                  خروج
                </Button>
              </>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button className="gap-2">
                  <LogIn size={16} />
                  دخول
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container-page py-6 flex-1">
        <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-soft sm:p-6">
          <Outlet />
        </div>
      </main>

      {/* Footer (يظهر على الموبايل أيضًا) */}
      <footer className="mt-10 border-t border-gray-100 bg-white">
        <div className="bg-gradient-to-b from-white to-gray-50">
          <div className="container-page py-8">
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Brand */}
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3">
                  <LottieLogo size={40} />
                  <div>
                    <div className="text-base font-extrabold">Syrian Menu</div>
                    <div className="text-xs text-gray-500">منيو سريع للمطاعم عبر QR</div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  تجربة بسيطة وسريعة: تصفّح المطاعم، افتح المنيو، واطلب عبر واتساب.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600">
                    سريع
                  </span>
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600">
                    خدمة سريعة 
                  </span>
                </div>
              </div>

              {/* Links */}
              <div className="lg:col-span-3">
                <div className="text-sm font-extrabold text-gray-900">روابط سريعة</div>
                <div className="mt-3 flex flex-col gap-2">
                  <FooterLink to="/">الرئيسية</FooterLink>
                  <FooterLink to="/restaurants">المطاعم</FooterLink>
                  <FooterLink to="/search">بحث</FooterLink>
                </div>
              </div>

              {/* Dashboard */}
              <div className="lg:col-span-4">
                <div className="text-sm font-extrabold text-gray-900">لوحات التحكم</div>
                <div className="mt-3 flex flex-col gap-2">
                  {isAuthed ? (
                    <>
                      {user?.role === "admin" ? (
                        <FooterLink to="/admin/restaurants">لوحة الأدمن</FooterLink>
                      ) : (
                        <FooterLink to="/owner">لوحة المطعم</FooterLink>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          window.location.href = "/";
                        }}
                        className="text-right text-sm text-gray-600 hover:text-red-600 transition"
                      >
                        تسجيل الخروج
                      </button>
                    </>
                  ) : (
                    <>
                      <FooterLink to="/login">تسجيل الدخول</FooterLink>
                      <div className="text-xs text-gray-500">التسجيل العام مغلق حالياً.</div>
                    </>
                  )}
                </div>

                <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
                  <div className="text-sm font-bold text-gray-900">هل أنت صاحب مطعم؟</div>
                  <div className="mt-1 text-xs text-gray-500">
                    اطلب حساب Owner من الأدمن لتفعيل لوحتك وإضافة المنيو.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-gray-500">
                © {new Date().getFullYear()} Syrian QR Menu — كل الحقوق محفوظة
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  واجهة عربية RTL
                </span>
                <span className="hidden sm:inline">•</span>
                <span>صحة وعافية</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ✅ Mobile Bottom Nav (يرجع مثل قبل) */}
      <nav
        className={[
          "sm:hidden fixed left-0 right-0 bottom-0 z-50",
          "pb-[env(safe-area-inset-bottom)]"
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-3 rounded-3xl border border-gray-100 bg-white/95 backdrop-blur shadow-[0_20px_40px_rgba(0,0,0,0.10)]">
            <div className="flex items-center justify-between px-2 py-2">
              <MobileNavItem to="/" icon={HomeIcon} label="الرئيسية" end />
              <MobileNavItem to="/restaurants" icon={StoreIcon} label="المطاعم" />
              <MobileNavItem to="/search" icon={SearchIcon} label="بحث" />
              <MobileNavItem to={dashboardLink} icon={DashboardIcon} label={dashboardLabel} />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
