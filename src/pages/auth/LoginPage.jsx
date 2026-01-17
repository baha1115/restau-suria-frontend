// File: src/pages/auth/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === "admin") nav("/admin/restaurants");
      else nav("/owner");
    } catch (e2) {
      setErr(e2.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
      <div className="text-lg font-black">تسجيل الدخول</div>
      <div className="mt-1 text-sm text-gray-500">ادخل بريدك وكلمة المرور</div>

      {err ? <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-xs text-gray-600">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@email.com" />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-600">Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
        </div>

        <div className="flex items-center justify-between">
         {/* <Link to="/forgot-password" className="text-sm font-semibold text-green-700 hover:underline">
            نسيت كلمة المرور؟
          </Link>

          <Link to="/register" className="text-sm font-semibold text-green-700 hover:underline">
            إنشاء حساب جديد
          </Link>*/}
          <div className="mt-4 text-xs text-gray-500">
            . للحصول على حساب تواصل مع الإدارة ليتم إنشاؤه لك
</div>

        </div>

        <Button className="w-full" disabled={loading}>
          {loading ? "..." : "دخول"}
        </Button>
      </form>

     {/* <div className="mt-4 text-xs text-gray-500">
        إذا كان التسجيل العام مقفلًا في الـ Backend (ALLOW_PUBLIC_REGISTER=false) فسيظهر لك خطأ عند إنشاء الحساب.
      </div>*/}
    </div>
  );
}
