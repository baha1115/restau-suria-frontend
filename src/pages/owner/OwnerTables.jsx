// File: src/pages/owner/OwnerTables.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth.js";
import ownerApi from "../../api/owner.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function OwnerTables() {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId || null;

  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(20);

  const [tables, setTables] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // store qr objectURLs per table number
  const [qrUrls, setQrUrls] = useState({});

  async function loadTables() {
    if (!restaurantId) return;
    setErr("");
    setLoading(true);
    try {
      const d = await ownerApi.listTables(restaurantId);
      setTables(d.tables || []);
    } catch (e) {
      setErr(e.message || "فشل تحميل الطاولات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  if (!restaurantId) return <EmptyState title="لا يوجد مطعم" hint="أنشئ مطعم أولاً" />;

  async function onBulkCreate() {
    try {
      await ownerApi.bulkCreateTables(restaurantId, { from: Number(from), to: Number(to) });
      alert("تم إنشاء الطاولات ✅");
      await loadTables();
    } catch (e) {
      alert(e.message || "فشل");
    }
  }

  async function showQrForTable(n) {
    try {
      const blob = await ownerApi.fetchQrBlob(restaurantId, n);
      const url = URL.createObjectURL(blob);
      setQrUrls((m) => ({ ...m, [n]: url }));
    } catch (e) {
      alert(e.message || "فشل جلب QR");
    }
  }

  async function showQrGeneral() {
    try {
      const blob = await ownerApi.fetchQrBlob(restaurantId, null);
      const url = URL.createObjectURL(blob);
      setQrUrls((m) => ({ ...m, general: url }));
    } catch (e) {
      alert(e.message || "فشل");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="text-sm font-extrabold">الطاولات و QR</div>
        <div className="mt-1 text-xs text-gray-500">Bulk create + عرض QR (يتم جلبه كـ Blob مع التوكن)</div>
      </div>

      {err ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="text-sm font-extrabold">إنشاء طاولات</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="from" />
          <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="to" />
          <Button onClick={onBulkCreate}>إنشاء</Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={showQrGeneral}>QR للمنيو العام</Button>
          {qrUrls.general ? (
            <div className="flex items-center gap-2">
              <Badge tone="green">جاهز</Badge>
              <img src={qrUrls.general} alt="qr" className="h-20 w-20 rounded-xl border border-gray-100" />
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="text-sm font-extrabold">قائمة الطاولات</div>

        {loading ? (
          <div className="py-6 text-sm text-gray-600">تحميل...</div>
        ) : tables.length ? (
          <div className="mt-3 space-y-2">
            {tables.map((t) => (
              <div key={t._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                <div>
                  <div className="text-sm font-bold">{t.label || `Table ${t.number}`}</div>
                  <div className="mt-1 text-xs text-gray-500">رقم الطاولة: {t.number}</div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={() => showQrForTable(t.number)}>
                    عرض QR
                  </Button>
                  {qrUrls[t.number] ? (
                    <img src={qrUrls[t.number]} alt="qr" className="h-20 w-20 rounded-xl border border-gray-100" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="لا يوجد طاولات" hint="أنشئ طاولات من الأعلى" />
        )}
      </div>
    </div>
  );
}
