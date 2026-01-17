// File: src/pages/auth/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import authApi from "../../api/auth.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!email.trim()) return;

    setBusy(true);
    try {
      // backend يرجع نفس الرسالة سواء الإيميل موجود أو لا
      await authApi.forgotPassword(email.trim());
      setMsg("إذا كان هذا البريد مسجلاً لدينا فستصلك رسالة تحتوي على رابط إعادة تعيين كلمة المرور.");
    } catch (e2) {
      setErr(e2.message || "فشل إرسال الطلب");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
      <div className="text-lg font-black">نسيت كلمة المرور</div>
      <div className="mt-1 text-sm text-gray-500">ادخل بريدك ليصلك رابط إعادة التعيين</div>

      {err ? <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}
      {msg ? <div className="mt-3 rounded-xl bg-green-50 px-3 py-2 text-sm text-green-800">{msg}</div> : null}

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-xs text-gray-600">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@test.com" />
        </div>

        <Button className="w-full" disabled={busy}>
          {busy ? "جارِ الإرسال..." : "إرسال رابط إعادة التعيين"}
        </Button>
      </form>

      <div className="mt-4 text-sm">
        <Link to="/login" className="font-semibold text-green-700 hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </div>
    </div>
  );
}
