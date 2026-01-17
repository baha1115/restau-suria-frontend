// File: src/pages/owner/OwnerItems.jsx
import React, { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth.js";
import publicApi from "../../api/public.js";
import ownerApi from "../../api/owner.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Toggle from "../../components/ui/Toggle.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function OwnerItems() {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId || null;
  const slug = localStorage.getItem("owner_restaurant_slug") || "";

  const [menu, setMenu] = useState({ sections: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [sectionFilter, setSectionFilter] = useState("");

  const [create, setCreate] = useState({
    sectionId: "",
    name: "",
    description: "",
    price: "",
    currency: "SYP",
    isAvailable: true
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  async function load() {
    if (!slug) {
      setLoading(false);
      setMenu({ sections: [] });
      return;
    }
    setErr("");
    setLoading(true);
    try {
      const d = await publicApi.getMenu(slug, "");
      setMenu(d);
      const first = d.sections?.[0]?._id || "";
      setCreate((c) => ({ ...c, sectionId: c.sectionId || first }));
      setSectionFilter((prev) => prev || "");
    } catch (e) {
      setErr(e.message || "فشل تحميل المنيو");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const sections = menu?.sections || [];

  const allItems = useMemo(() => {
    const list = [];
    sections.forEach((s) => {
      (s.items || []).forEach((it) => {
        list.push({ ...it, sectionName: s.name, sectionId: s._id });
      });
    });
    return list;
  }, [sections]);

  const shownItems = useMemo(() => {
    if (!sectionFilter) return allItems;
    return allItems.filter((it) => String(it.sectionId) === String(sectionFilter));
  }, [allItems, sectionFilter]);

  if (!restaurantId) return <EmptyState title="لا يوجد مطعم" hint="أنشئ مطعم أولاً" />;
  if (!slug) return <EmptyState title="لا يوجد slug" hint="اذهب إلى OwnerHome واربط slug للمطعم" />;

  async function onCreate() {
    if (!create.sectionId || !create.name.trim() || !create.price) return;

    try {
      await ownerApi.createItem(restaurantId, {
        sectionId: create.sectionId,
        name: create.name.trim(),
        description: create.description,
        price: Number(create.price),
        currency: create.currency || "SYP",
        isAvailable: !!create.isAvailable
      });
      setCreate((c) => ({ ...c, name: "", description: "", price: "" }));
      await load();
    } catch (e) {
      alert(e.message || "فشل إضافة الصنف");
    }
  }

  async function onToggleAvailability(itemId, isAvailable) {
    try {
      await ownerApi.updateAvailability(itemId, isAvailable);
      await load();
    } catch (e) {
      alert(e.message || "فشل");
    }
  }

  async function onDelete(itemId) {
    if (!confirm("حذف الصنف (soft delete)؟")) return;
    try {
      await ownerApi.deleteItem(itemId);
      await load();
    } catch (e) {
      alert(e.message || "فشل");
    }
  }

  async function onSaveEdit() {
    try {
      await ownerApi.updateItem(editing._id, {
        sectionId: editing.sectionId,
        name: editing.name,
        description: editing.description || "",
        price: Number(editing.price),
        currency: editing.currency || "SYP",
        isAvailable: !!editing.isAvailable
      });
      setEditOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      alert(e.message || "فشل تعديل الصنف");
    }
  }

  // ✅ NEW: upload dish image for a menu item
  async function uploadDishImage(itemId, file) {
    if (!file) return;
    try {
      await ownerApi.uploadItemImage(itemId, file);
      alert("تم رفع صورة الطبق ✅");
      await load();
    } catch (e) {
      alert(e.message || "فشل رفع صورة الطبق");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="text-sm font-extrabold">إدارة أصناف المنيو</div>
        <div className="mt-1 text-xs text-gray-500">إضافة/تعديل/إيقاف صنف + رفع صورة للطبق</div>
      </div>

      {err ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="text-sm font-extrabold">إضافة صنف</div>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <div>
            <div className="mb-1 text-xs text-gray-600">القسم</div>
            <Select value={create.sectionId} onChange={(e) => setCreate((c) => ({ ...c, sectionId: e.target.value }))}>
              {sections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <div className="mb-1 text-xs text-gray-600">اسم الصنف</div>
            <Input value={create.name} onChange={(e) => setCreate((c) => ({ ...c, name: e.target.value }))} />
          </div>

          <div>
            <div className="mb-1 text-xs text-gray-600">السعر</div>
            <Input value={create.price} onChange={(e) => setCreate((c) => ({ ...c, price: e.target.value }))} placeholder="35000" />
          </div>

          <div>
            <div className="mb-1 text-xs text-gray-600">الوصف</div>
            <Input value={create.description} onChange={(e) => setCreate((c) => ({ ...c, description: e.target.value }))} placeholder="اختياري" />
          </div>

          <Toggle label="متوفر" checked={create.isAvailable} onChange={(v) => setCreate((c) => ({ ...c, isAvailable: v }))} />
        </div>

        <div className="mt-3">
          <Button onClick={onCreate}>إضافة</Button>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          رفع صورة الصنف يتم بعد الإنشاء من القائمة .
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-extrabold">قائمة الأصناف</div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-600">فلتر قسم:</div>
            <Select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className="w-44">
              <option value="">الكل</option>
              {sections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="py-6 text-sm text-gray-600">تحميل...</div>
        ) : shownItems.length ? (
          <div className="mt-3 space-y-2">
            {shownItems.map((it) => (
              <div key={it._id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* ✅ NEW: image preview */}
                    <div className="h-16 w-16 overflow-hidden rounded-xl border border-gray-100 bg-white">
                      {it.imageUrl ? (
                        <img src={it.imageUrl} alt={it.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-bold">{it.name}</div>
                      <div className="mt-1 text-xs text-gray-600">
                        {it.price} {it.currency || "SYP"} • القسم: {it.sectionName}
                      </div>
                      {it.description ? <div className="mt-1 text-xs text-gray-500">{it.description}</div> : null}
                      <div className="mt-2">{it.isAvailable ? <Badge tone="green">متوفر</Badge> : <Badge tone="red">غير متوفر</Badge>}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditing({
                          _id: it._id,
                          sectionId: it.sectionId,
                          name: it.name,
                          description: it.description,
                          price: it.price,
                          currency: it.currency || "SYP",
                          isAvailable: !!it.isAvailable,
                          imageUrl: it.imageUrl || ""
                        });
                        setEditOpen(true);
                      }}
                    >
                      تعديل
                    </Button>

                    <Button variant="secondary" onClick={() => onToggleAvailability(it._id, !it.isAvailable)}>
                      تبديل التوفر
                    </Button>

                    {/* ✅ NEW: upload image button */}
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-soft hover:bg-green-50">
                      رفع صورة
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          // لتسمح برفع نفس الملف مرتين
                          e.target.value = "";
                          await uploadDishImage(it._id, file);
                        }}
                      />
                    </label>

                    <Button variant="danger" onClick={() => onDelete(it._id)}>
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="لا يوجد أصناف" />
        )}
      </div>

      <Modal open={editOpen} title="تعديل صنف" onClose={() => setEditOpen(false)}>
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-xs text-gray-600">القسم</div>
            <Select value={editing?.sectionId || ""} onChange={(e) => setEditing((x) => ({ ...x, sectionId: e.target.value }))}>
              {sections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <div className="mb-1 text-xs text-gray-600">الاسم</div>
            <Input value={editing?.name || ""} onChange={(e) => setEditing((x) => ({ ...x, name: e.target.value }))} />
          </div>

          <div>
            <div className="mb-1 text-xs text-gray-600">السعر</div>
            <Input value={editing?.price ?? ""} onChange={(e) => setEditing((x) => ({ ...x, price: e.target.value }))} />
          </div>

          <div>
            <div className="mb-1 text-xs text-gray-600">الوصف</div>
            <Input value={editing?.description || ""} onChange={(e) => setEditing((x) => ({ ...x, description: e.target.value }))} />
          </div>

          <Toggle label="متوفر" checked={editing?.isAvailable} onChange={(v) => setEditing((x) => ({ ...x, isAvailable: v }))} />

          {editing?.imageUrl ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="text-xs text-gray-600">الصورة الحالية</div>
              <img src={editing.imageUrl} alt="dish" className="mt-2 h-32 w-full rounded-xl object-cover" />
            </div>
          ) : null}

          <Button className="w-full" onClick={onSaveEdit}>
            حفظ
          </Button>
        </div>
      </Modal>
    </div>
  );
}
