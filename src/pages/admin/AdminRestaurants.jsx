// File: src/pages/admin/AdminRestaurants.jsx
import React, { useEffect, useState } from "react";
import adminApi from "../../api/admin.js";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Pagination from "../../components/Pagination.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function AdminRestaurants() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load(p = page) {
    setErr("");
    setLoading(true);
    try {
      const d = await adminApi.listRestaurants({
        page: p,
        limit: 12,
        city: city || undefined,
        type: type || undefined
      });
      setItems(d.items || []);
      setPage(d.page || p);
      setTotalPages(d.totalPages || 1);
    } catch (e) {
      setErr(e.message || "فشل");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleActive(r) {
    try {
      await adminApi.activateRestaurant(r._id, !r.isActive);
      await load(page);
    } catch (e) {
      alert(e.message || "فشل");
    }
  }

  async function toggleFeatured(r) {
    try {
      await adminApi.featureRestaurant(r._id, !r.isFeatured);
      await load(page);
    } catch (e) {
      alert(e.message || "فشل");
    }
  }

  if (loading) return <Loader />;
  if (err) return <EmptyState title="خطأ" hint={err} />;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="text-sm font-extrabold">إدارة المطاعم (Admin)</div>
        <div className="mt-1 text-xs text-gray-500">تفعيل/إيقاف + مميز</div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="text-sm font-extrabold">فلترة</div>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City (optional)" />
          <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Type (optional)" />
          <Button
            onClick={() => {
              load(1);
            }}
          >
            تطبيق
          </Button>
        </div>
      </div>

      {items.length ? (
        <>
          <div className="space-y-2">
            {items.map((r) => (
              <div key={r._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-extrabold">{r.name}</div>
                    <div className="mt-1 text-xs text-gray-600">
                      {r.city} • {r.type} • slug: <span className="font-semibold">{r.slug}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {r.isActive ? <Badge tone="green">Active</Badge> : <Badge tone="red">Inactive</Badge>}
                      {r.isFeatured ? <Badge tone="yellow">Featured</Badge> : <Badge>Normal</Badge>}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Public: <span className="font-semibold text-green-700">/r/{r.slug}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => toggleActive(r)}>
                      تفعيل/إيقاف
                    </Button>
                    <Button variant="secondary" onClick={() => toggleFeatured(r)}>
                      مميز/عادي
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPage={(p) => load(p)} />
        </>
      ) : (
        <EmptyState title="لا يوجد مطاعم" />
      )}
    </div>
  );
}
