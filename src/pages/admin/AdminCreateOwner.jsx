// File: src/pages/admin/AdminCreateOwner.jsx
import React, { useState } from "react";
import adminApi from "../../api/admin.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

export default function AdminCreateOwner() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await adminApi.createOwner(form);
      alert("تم إنشاء Owner ✅");
      setForm({ name: "", email: "", password: "" });
    } catch (e2) {
      setErr(e2.message || "فشل");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="text-sm font-extrabold">إنشاء Owner جديد</div>
      </div>

      {err ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

      <form onSubmit={onSubmit} className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
        <div>
          <div className="mb-1 text-xs text-gray-600">الاسم</div>
          <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <div className="mb-1 text-xs text-gray-600">الإيميل</div>
          <Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <div className="mb-1 text-xs text-gray-600">كلمة المرور</div>
          <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
        </div>

        <Button className="w-full" disabled={busy}>
          {busy ? "..." : "إنشاء"}
        </Button>
      </form>
    </div>
  );
}
