// File: src/pages/owner/OwnerOffers.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth.js";
import publicApi from "../../api/public.js";
import ownerApi from "../../api/owner.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Modal from "../../components/ui/Modal.jsx";

export default function OwnerOffers() {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId?._id || user?.restaurantId || null;
  const slug = localStorage.getItem("owner_restaurant_slug") || "";
  const [createImage, setCreateImage] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const createFileRef = useRef(null);
const editFileRef = useRef(null);

const [createPreview, setCreatePreview] = useState("");
const [editPreview, setEditPreview] = useState("");

  const [todayOffers, setTodayOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [create, setCreate] = useState({
    title: "",
    description: "",
    startAt: "",
    endAt: ""
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
useEffect(() => {
  if (!createImage) {
    setCreatePreview("");
    return;
  }
  const url = URL.createObjectURL(createImage);
  setCreatePreview(url);
  return () => URL.revokeObjectURL(url);
}, [createImage]);

useEffect(() => {
  if (!editImage) {
    setEditPreview("");
    return;
  }
  const url = URL.createObjectURL(editImage);
  setEditPreview(url);
  return () => URL.revokeObjectURL(url);
}, [editImage]);

  const myOffers = useMemo(() => {
  const rid = String(restaurantId || "");
  return (todayOffers || []).filter((o) => {
    const oid = String(o?.restaurantId?._id || o?.restaurantId || "");
    return oid === rid;
  });
}, [todayOffers, restaurantId]);


async function load() {
  setErr("");
  setLoading(true);
  try {
    // بدل publicApi.home()
    const d = await ownerApi.listOffers(restaurantId, { active: "true" });
    setTodayOffers(d.offers || []); // نعيد استخدام نفس state حتى لا نخرب الصفحة
  } catch (e) {
    setErr(e.message || "فشل تحميل العروض");
  } finally {
    setLoading(false);
  }
}



  useEffect(() => {
    load();
  }, []);
if (!restaurantId) return <EmptyState title="لا يوجد مطعم" hint="الحساب لا يملك RestaurantId — اطلب من الأدمن ربطه." />;

 async function onCreate() {
  if (!create.title.trim() || !create.startAt || !create.endAt) return;

  const body = {
    title: create.title.trim(),
    description: create.description,
    startAt: new Date(create.startAt).toISOString(),
    endAt: new Date(create.endAt).toISOString(),
  };

  try {
    const d = await ownerApi.createOffer(restaurantId, body);

    // حسب الباك اند: createOffer يرجّع { offer }  :contentReference[oaicite:6]{index=6}
    const offerId = d?.offer?._id || d?._id;

    if (offerId && createImage) {
      await ownerApi.uploadOfferImage(offerId, createImage);
      setCreateImage(null);
    }

    setCreate({ title: "", description: "", startAt: "", endAt: "" });
    await load();
    alert("تم إنشاء العرض ✅");
  } catch (e) {
    alert(e.message || "فشل");
  }
}


  async function onDelete(offerId) {
    if (!confirm("حذف العرض؟")) return;
    try {
      await ownerApi.deleteOffer(offerId);
      await load();
    } catch (e) {
      alert(e.message || "فشل");
    }
  }

 async function onSaveEdit() {
  try {
    const body = {
      title: editing.title,
      description: editing.description,
      startAt: new Date(editing.startAt).toISOString(),
      endAt: new Date(editing.endAt).toISOString(),
    };

    await ownerApi.updateOffer(editing._id, body);

    if (editImage) {
      await ownerApi.uploadOfferImage(editing._id, editImage);
      setEditImage(null);
    }

    setEditOpen(false);
    setEditing(null);
    await load();
  } catch (e) {
    alert(e.message || "فشل");
  }
}

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="text-sm font-extrabold">عروض اليوم</div>
      </div>

      {err ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="text-sm font-extrabold">إضافة عرض</div>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <div>
            <div className="mb-1 text-xs text-gray-600">العنوان</div>
            <Input value={create.title} onChange={(e) => setCreate((c) => ({ ...c, title: e.target.value }))} />
          </div>
         <div className="md:col-span-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 transition hover:bg-green-50">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <div className="text-xs font-bold text-gray-700">صورة العرض (اختياري)</div>
      <div className="mt-1 text-[11px] text-gray-500">PNG / JPG — صورة واحدة</div>
    </div>

    <input
      ref={createFileRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => setCreateImage(e.target.files?.[0] || null)}
    />

    <Button
      type="button"
      variant="secondary"
      className="shadow-none"
      onClick={() => createFileRef.current?.click()}
    >
      اختر صورة
    </Button>
  </div>

  {createImage ? (
    <div className="mt-3 flex items-center gap-3">
      {createPreview ? (
        <img
          src={createPreview}
          alt="preview"
          className="h-16 w-16 rounded-2xl border border-gray-200 object-cover"
        />
      ) : null}

      <div className="min-w-0">
        <div className="truncate text-xs font-semibold text-gray-700">{createImage.name}</div>
        <button
          type="button"
          className="mt-1 text-xs font-semibold text-red-600 hover:underline"
          onClick={() => setCreateImage(null)}
        >
          إزالة الصورة
        </button>
      </div>
    </div>
  ) : (
    <div className="mt-3 text-xs text-gray-500">لم يتم اختيار صورة</div>
  )}
</div>

          <div>
            <div className="mb-1 text-xs text-gray-600">الوصف</div>
            <Input value={create.description} onChange={(e) => setCreate((c) => ({ ...c, description: e.target.value }))} />
          </div>
          <div>
            <div className="mb-1 text-xs text-gray-600">بداية</div>
            <Input type="datetime-local" value={create.startAt} onChange={(e) => setCreate((c) => ({ ...c, startAt: e.target.value }))} />
          </div>
          <div>
            <div className="mb-1 text-xs text-gray-600">نهاية</div>
            <Input type="datetime-local" value={create.endAt} onChange={(e) => setCreate((c) => ({ ...c, endAt: e.target.value }))} />
          </div>
        </div>
        <div className="mt-3">
         <Button className="w-full py-3 text-base" onClick={onCreate}>
  إنشاء العرض
</Button>

        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="text-sm font-extrabold">العروض النشطة لمطعمي</div>

        {loading ? (
          <div className="py-6 text-sm text-gray-600">تحميل...</div>
        ) : myOffers.length ? (
          <div className="mt-3 space-y-2">
            {myOffers.map((o) => (
              <div key={o._id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold">{o.title}</div>
                    {o.imageUrl ? (
  <img src={o.imageUrl} alt={o.title} className="h-16 w-16 rounded-2xl border object-cover" />
) : null}

                    {o.description ? <div className="mt-1 text-xs text-gray-600">{o.description}</div> : null}
                    <div className="mt-2 text-xs text-gray-500">
                      من {new Date(o.startAt).toLocaleString()} إلى {new Date(o.endAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditing({
                          _id: o._id,
                          title: o.title,
                          description: o.description || "",
                          startAt: o.startAt,
                          endAt: o.endAt
                        });
                        setEditOpen(true);
                      }}
                    >
                      تعديل
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(o._id)}>
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="لا يوجد عروض نشطة لمطعمي" hint="أضف عرض وتأكد من الوقت (startAt/endAt)" />
        )}
      </div>

      <Modal open={editOpen} title="تعديل عرض" onClose={() => setEditOpen(false)}>
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-xs text-gray-600">العنوان</div>
            <Input value={editing?.title || ""} onChange={(e) => setEditing((x) => ({ ...x, title: e.target.value }))} />
          </div>
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 transition hover:bg-green-50">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <div className="text-xs font-bold text-gray-700">صورة العرض (اختياري)</div>
      <div className="mt-1 text-[11px] text-gray-500">تحديث صورة العرض</div>
    </div>

    <input
      ref={editFileRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => setEditImage(e.target.files?.[0] || null)}
    />

    <Button
      type="button"
      variant="secondary"
      className="shadow-none"
      onClick={() => editFileRef.current?.click()}
    >
      اختر صورة
    </Button>
  </div>

  {editImage ? (
    <div className="mt-3 flex items-center gap-3">
      {editPreview ? (
        <img
          src={editPreview}
          alt="preview"
          className="h-16 w-16 rounded-2xl border border-gray-200 object-cover"
        />
      ) : null}

      <div className="min-w-0">
        <div className="truncate text-xs font-semibold text-gray-700">{editImage.name}</div>
        <button
          type="button"
          className="mt-1 text-xs font-semibold text-red-600 hover:underline"
          onClick={() => setEditImage(null)}
        >
          إزالة الصورة
        </button>
      </div>
    </div>
  ) : (
    <div className="mt-3 text-xs text-gray-500">لم يتم اختيار صورة</div>
  )}
</div>

          <div>
            <div className="mb-1 text-xs text-gray-600">الوصف</div>
            <Input value={editing?.description || ""} onChange={(e) => setEditing((x) => ({ ...x, description: e.target.value }))} />
          </div>
          <Button className="w-full" onClick={onSaveEdit}>
            حفظ
          </Button>
        </div>
      </Modal>
    </div>
  );
}
