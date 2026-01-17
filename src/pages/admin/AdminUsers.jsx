// File: src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import adminApi from "../../api/admin.js";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Pagination from "../../components/Pagination.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function AdminUsers() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load(p = 1) {
    setErr("");
    setLoading(true);
    try {
      const d = await adminApi.listUsers({ page: p, limit: 12 });
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
  }, []);

  async function toggleUser(u) {
    try {
      await adminApi.activateUser(u._id, !u.isActive);
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
        <div className="text-sm font-extrabold">المستخدمين (Admin)</div>
      </div>

      {items.length ? (
        <>
          <div className="space-y-2">
            {items.map((u) => (
              <div key={u._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-extrabold">{u.name}</div>
                    <div className="mt-1 text-xs text-gray-600">{u.email}</div>
                    <div className="mt-2 flex gap-2">
                      <Badge tone="gray">role: {u.role}</Badge>
                      {u.isActive ? <Badge tone="green">Active</Badge> : <Badge tone="red">Inactive</Badge>}
                      {u.restaurantId ? <Badge tone="yellow">has restaurantId</Badge> : <Badge>no restaurantId</Badge>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => toggleUser(u)}>
                      تفعيل/إيقاف
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPage={(p) => load(p)} />
        </>
      ) : (
        <EmptyState title="لا يوجد مستخدمين" />
      )}
    </div>
  );
}
