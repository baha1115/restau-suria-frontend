// File: src/pages/auth/ResetPasswordPage.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authApi from "../../api/auth.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

export default function ResetPasswordPage() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const token = useMemo(() => (sp.get("token") || "").trim(), [sp]);

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!token) {
      setErr("الرابط غير صحيح (token مفقود).");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErr("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    if (newPassword !== confirm) {
      setErr("كلمتا المرور غير متطابقتين.");
      return;
    }

    setBusy(true);
    try {
      await authApi.resetPassword(token, newPassword);
      setMsg("تم تغيير كلمة المرور بنجاح ✅ سيتم تحويلك لتسجيل الدخول...");
      setTimeout(() => nav("/login"), 900);
    } catch (e2) {
      setErr(e2.message || "فشل إعادة التعيين (قد يكون الرابط منتهي الصلاحية)");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
      <div className="text-lg font-black">إعادة تعيين كلمة المرور</div>
      <div className="mt-1 text-sm text-gray-500">ادخل كلمة مرور جديدة</div>

      {!token ? (
        <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          الرابط غير صحيح: لا يوجد token.
        </div>
      ) : null}

      {err ? <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}
      {msg ? <div className="mt-3 rounded-xl bg-green-50 px-3 py-2 text-sm text-green-800">{msg}</div> : null}

      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-xs text-gray-600">كلمة المرور الجديدة</label>
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••" />
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-600">تأكيد كلمة المرور</label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••" />
        </div>

        <Button className="w-full" disabled={busy || !token}>
          {busy ? "جارِ الحفظ..." : "حفظ كلمة المرور"}
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
