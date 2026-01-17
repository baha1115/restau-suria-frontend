// File: src/pages/auth/RegisterPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!name.trim()) return setErr("الاسم مطلوب");
    if (!email.trim()) return setErr("الإيميل مطلوب");
    if (!password || password.length < 6) return setErr("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    if (password !== confirm) return setErr("كلمتا المرور غير متطابقتين");

    setBusy(true);
    try {
      const user = await register(name.trim(), email.trim(), password);

      // بعد التسجيل سيتم تسجيل الدخول تلقائيًا لأننا خزّنا token
      if (user.role === "admin") nav("/admin/restaurants");
      else nav("/owner");
    } catch (e2) {
      // أمثلة شائعة: 409 Email already used / 403 Register disabled
      setErr(e2.message || "فشل إنشاء الحساب");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
      <div className="text-lg font-black">إنشاء حساب</div>
      <div className="mt-1 text-sm text-gray-500">أنشئ حساب Owner لإدارة مطعمك</div>

      {err ? <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-xs text-gray-600">الاسم</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: Ahmad" />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-600">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@test.com" />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-600">كلمة المرور</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-600">تأكيد كلمة المرور</label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••" />
        </div>

        <Button className="w-full" disabled={busy}>
          {busy ? "جارِ الإنشاء..." : "إنشاء حساب"}
        </Button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        لديك حساب؟{" "}
        <Link to="/login" className="font-semibold text-green-700 hover:underline">
          تسجيل الدخول
        </Link>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        ملاحظة: إذا كان الـ Backend مضبوط على <b>ALLOW_PUBLIC_REGISTER=false</b> فلن يعمل التسجيل من هذه الصفحة (سيحتاج Admin).
      </div>
    </div>
  );
}
