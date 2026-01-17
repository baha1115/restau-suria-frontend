// File: src/pages/owner/OwnerSections.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth.js";
import publicApi from "../../api/public.js";
import ownerApi from "../../api/owner.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function OwnerSections() {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId || null;
  const slug = localStorage.getItem("owner_restaurant_slug") || "";

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [createName, setCreateName] = useState("");
  const [createSort, setCreateSort] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  async function load() {
    if (!slug) {
      setLoading(false);
      setSections([]);
      return;
    }
    setErr("");
    setLoading(true);
    try {
      const d = await publicApi.getMenu(slug, "");
      setSections(d.sections || []);
    } catch (e) {
      setErr(e.message || "فشل تحميل الأقسام");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!restaurantId) return <EmptyState title="لا يوجد مطعم" hint="أنشئ مطعم أولاً" />;
  if (!slug) return <EmptyState title="لا يوجد slug" hint="اذهب إلى OwnerHome واربط slug للمطعم" />;

  async function onCreate() {
    if (!createName.trim()) return;
    try {
      await ownerApi.createSection(restaurantId, { name: createName.trim(), sortOrder: Number(createSort) || 0 });
      setCreateName("");
      setCreateSort(0);
      await load();
    } catch (e) {
      alert(e.message || "فشل إنشاء القسم");
    }
  }

  async function onToggle(sectionId) {
    try {
      await ownerApi.toggleSection(sectionId);
      await load();
    } catch (e) {
      alert(e.message || "فشل");
    }
  }

  async function onDelete(sectionId) {
    if (!confirm("حذف القسم (soft delete)؟")) return;
    try {
      await ownerApi.deleteSection(sectionId);
      await load();
    } catch (e) {
      alert(e.message || "فشل");
    }
  }

  async function onSaveEdit() {
    try {
      await ownerApi.updateSection(editing._id, { name: editing.name, sortOrder: Number(editing.sortOrder) || 0 });
      setEditOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      alert(e.message || "فشل تعديل القسم");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="text-sm font-extrabold">إدارة أقسام المنيو</div>
        <div className="mt-1 text-xs text-gray-500">القراءة تتم من Public API، والتعديل يتم عبر Owner API</div>
      </div>

      {err ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="text-sm font-extrabold">إضافة قسم</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Input value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="مثال: مقبلات" />
          <Input value={createSort} onChange={(e) => setCreateSort(e.target.value)} placeholder="ترتيب (0)" />
          <Button onClick={onCreate}>إضافة</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="text-sm font-extrabold">الأقسام</div>

        {loading ? (
          <div className="py-6 text-sm text-gray-600">تحميل...</div>
        ) : sections.length ? (
          <div className="mt-3 space-y-2">
            {sections.map((s) => (
              <div key={s._id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                <div>
                  <div className="text-sm font-bold">{s.name}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    sortOrder: {s.sortOrder ?? 0} • items: {s.items?.length || 0}
                  </div>
                  {!s.isActive ? <div className="mt-2"><Badge tone="red">مغلق</Badge></div> : null}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditing({ _id: s._id, name: s.name, sortOrder: s.sortOrder ?? 0 });
                      setEditOpen(true);
                    }}
                  >
                    تعديل
                  </Button>
                  <Button variant="secondary" onClick={() => onToggle(s._id)}>
                    تفعيل/إيقاف
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(s._id)}>
                    حذف
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="لا يوجد أقسام" hint="أضف قسم جديد" />
        )}
      </div>

      <Modal open={editOpen} title="تعديل قسم" onClose={() => setEditOpen(false)}>
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-xs text-gray-600">الاسم</div>
            <Input value={editing?.name || ""} onChange={(e) => setEditing((x) => ({ ...x, name: e.target.value }))} />
          </div>
          <div>
            <div className="mb-1 text-xs text-gray-600">ترتيب</div>
            <Input value={editing?.sortOrder ?? 0} onChange={(e) => setEditing((x) => ({ ...x, sortOrder: e.target.value }))} />
          </div>
          <Button className="w-full" onClick={onSaveEdit}>
            حفظ
          </Button>
        </div>
      </Modal>
    </div>
  );
}
