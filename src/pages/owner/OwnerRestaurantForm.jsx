// File: src/pages/owner/OwnerRestaurantForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth.js";
import ownerApi from "../../api/owner.js";
import publicApi from "../../api/public.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Select from "../../components/ui/Select.jsx";
import Toggle from "../../components/ui/Toggle.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import MapPicker from "../../components/map/MapPicker.jsx";

const defaultWeekly = [
  { day: 0, isClosed: false, open: "09:00", close: "23:00" },
  { day: 1, isClosed: false, open: "09:00", close: "23:00" },
  { day: 2, isClosed: false, open: "09:00", close: "23:00" },
  { day: 3, isClosed: false, open: "09:00", close: "23:00" },
  { day: 4, isClosed: false, open: "09:00", close: "23:00" },
  { day: 5, isClosed: false, open: "09:00", close: "23:00" },
  { day: 6, isClosed: false, open: "09:00", close: "23:00" }
];

function dayLabel(day) {
  const map = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  return map[day] || "";
}
function onlyDigits(s) {
  return String(s || "").replace(/\D/g, "");
}

// سوري موبايل غالباً: 9xxxxxxxx (9 أرقام) بعد 963
function isValidSyrianMobileDigits(localDigits) {
  // localDigits = "9xxxxxxxx"
  return /^9\d{8}$/.test(localDigits);
}

// يحوّل أي إدخال لحالة ثابتة: 963 + localDigits
function normalizeWhatsappTo963(raw) {
  const digits = onlyDigits(raw);

  // إذا كتب المستخدم +9639xxxxxx أو 009639xxxxxx أو 9639xxxxxx
  if (digits.startsWith("963")) {
    return digits; // نخليه digits فقط بدون +
  }

  // إذا كتب 0xxxxxxxxx (محلي)
  if (digits.startsWith("0") && digits.length >= 10) {
    return "963" + digits.slice(1);
  }

  // إذا كتب 9xxxxxxxx مباشرة
  if (digits.length === 9 && digits.startsWith("9")) {
    return "963" + digits;
  }

  // fallback: رجّع digits كما هو (لكن UI رح يحده)
  return digits;
}

export default function OwnerRestaurantForm() {
  const { user, refreshMe } = useAuth();
  const restaurantId = user?.restaurantId || null;

  const [slug, setSlug] = useState(localStorage.getItem("owner_restaurant_slug") || "");
  const [prefillInfo, setPrefillInfo] = useState(null);
  const [homeMeta, setHomeMeta] = useState({ cities: [], types: [] });
const [loadingMeta, setLoadingMeta] = useState(true);
useEffect(() => {
  (async () => {
    try {
      const d = await publicApi.home();
      setHomeMeta({ cities: d.cities || [], types: d.types || [] });
    } catch (e) {
      // لو فشل عادي، نخلي الفورم شغال
    } finally {
      setLoadingMeta(false);
    }
  })();
}, []);
function getTypeEmoji(type) {
  const t = (type || "").toLowerCase();
  if (t.includes("شاورما")) return "🥙";
  if (t.includes("بيتزا")) return "🍕";
  if (t.includes("مشاوي")) return "🍢";
  if (t.includes("حلويات")) return "🍰";
  if (t.includes("قهوة") || t.includes("كافيه")) return "☕";
  if (t.includes("سمك")) return "🐟";
  return "🍽️";
}

  const [form, setForm] = useState({
    name: "",
    city: "",
    type: "",
    whatsapp: "",
    phone: "",
    addressText: "",
    deliveryEnabled: false,
    pickupEnabled: true,
    location: { lat: null, lng: null },
    hours: { timezone: "Asia/Damascus", weekly: defaultWeekly }
  });
  const [waLocal, setWaLocal] = useState("");
const [waError, setWaError] = useState("");

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const hasRestaurant = !!restaurantId;

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function prefillBySlug() {
    if (!slug.trim()) return;

    setErr("");
    try {
      const d = await publicApi.getRestaurant(slug.trim());
      const r = d.restaurant;

      setPrefillInfo(r);
      setForm((f) => ({
        ...f,
        name: r.name || "",
        city: r.city || "",
        type: r.type || "",
        whatsapp: r.whatsapp || "",
        phone: r.phone || "",
        addressText: r.addressText || "",
        deliveryEnabled: !!r.deliveryEnabled,
        pickupEnabled: r.pickupEnabled !== undefined ? !!r.pickupEnabled : true,
        location: r.location || { lat: null, lng: null },
        hours: r.hours?.weekly?.length ? r.hours : { timezone: "Asia/Damascus", weekly: defaultWeekly }
      }));
      const normalized = normalizeWhatsappTo963(r.whatsapp || "");
const local = normalized.startsWith("963") ? normalized.slice(3) : "";
setWaLocal(local);
setWaError(local && !isValidSyrianMobileDigits(local) ? "رقم واتساب غير صالح (مثال: 9xxxxxxxx)" : "");

      localStorage.setItem("owner_restaurant_slug", slug.trim());
    } catch (e) {
      setErr(e.message || "فشل جلب المطعم");
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setSaving(true);
const local = waLocal;
if (!isValidSyrianMobileDigits(local)) {
  setErr("رقم واتساب غير صالح. اكتب 9 أرقام تبدأ بـ 9 (مثال: 9xxxxxxxx).");
  setSaving(false);
  return;
}

    try {
      if (!hasRestaurant) {
        const d = await ownerApi.createRestaurant(form);
        await refreshMe();
        const r = d.restaurant;
        
        // خزّن slug للقراءة عبر public APIs
        localStorage.setItem("owner_restaurant_slug", r.slug);
        alert(`تم إنشاء المطعم ✅ slug: ${r.slug}`);
        await refreshMe();
      } else {
        await ownerApi.updateRestaurant(restaurantId, form);
        alert("تم تحديث بيانات المطعم ✅");
      }
    } catch (e2) {
      setErr(e2.message || "فشل الحفظ");
      console.log(e2);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="text-sm font-extrabold">{hasRestaurant ? "تعديل بيانات المطعم" : "إنشاء مطعم جديد"}</div>
        <div className="mt-1 text-xs text-gray-500">
          ملاحظة: عند تغيير الاسم لا تغيّر slug تلقائيًا حتى لا ينكسر QR.
        </div>
      </div>

      {err ? <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="text-xs text-gray-500">اختياري: املأ الحقول تلقائيًا من slug</div>
        <div className="mt-2 flex gap-2">
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="alsham-grill" />
          <Button variant="secondary" onClick={prefillBySlug}>
            جلب
          </Button>
        </div>
        {prefillInfo ? (
          <div className="mt-2 text-xs text-gray-600">
            تم جلب: <b>{prefillInfo.name}</b>
          </div>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="text-sm font-extrabold">معلومات أساسية</div>
            <div className="mt-3 space-y-3">
              <div>
                <div className="mb-1 text-xs text-gray-600">اسم المطعم</div>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <div className="mb-1 text-xs text-gray-600">المدينة</div>
               <input
  list="cities-list"
  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
  value={form.city}
  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
  placeholder={loadingMeta ? "جارِ تحميل المدن..." : "ابدأ بكتابة اسم المدينة..."}
/>

<datalist id="cities-list">
  {homeMeta.cities.map((c) => (
    <option key={c} value={c} />
  ))}
</datalist>
</div>
              <div>
  <div className="mb-1 text-xs text-gray-600">نوع المطعم</div>

  <div className="flex items-center gap-2">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700 border border-green-100">
      {getTypeEmoji(form.type)}
    </div>

    {/* Input + Dropdown (datalist) */}
    <input
      list="types-list"
      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
      value={form.type}
      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
      placeholder={loadingMeta ? "جارِ تحميل الأنواع..." : "اكتب أو اختر نوع المطعم..."}
    />
  </div>

  <datalist id="types-list">
    {homeMeta.types.map((t) => (
      <option key={t} value={t} />
    ))}
  </datalist>

  <div className="mt-1 text-[11px] text-gray-500">
    يمكنك كتابة نوع جديد (مثال: برغر، فلافل...) أو اختياره من القائمة.
  </div>
</div>

              <div>
  <div className="mb-1 text-xs text-gray-600">واتساب</div>

  <div className="flex items-stretch overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100">
    {/* Prefix ثابت */}
    <div className="flex items-center gap-1 px-3 text-sm font-bold text-gray-700 bg-gray-50 border-r border-gray-200">
      <span dir="ltr">+963</span>
    </div>

    {/* المستخدم يكتب فقط 9xxxxxxxx */}
    <input
      dir="ltr"
      inputMode="numeric"
      className="w-full px-3 py-2 text-sm outline-none"
      placeholder="9xxxxxxxx"
      value={waLocal}
      onChange={(e) => {
        const digits = onlyDigits(e.target.value).slice(0, 9); // حد أقصى 9 أرقام
        setWaLocal(digits);

        // خزن في form بصيغة backend: 963 + digits
        const full = digits ? `963${digits}` : "";
        setForm((f) => ({ ...f, whatsapp: full }));

        // تحقق فوري
        if (!digits) {
          setWaError("رقم واتساب مطلوب");
        } else if (!isValidSyrianMobileDigits(digits)) {
          setWaError("رقم واتساب غير صالح (مثال: 9xxxxxxxx)");
        } else {
          setWaError("");
        }
      }}
    />
  </div>

  {waError ? <div className="mt-1 text-xs text-red-600">{waError}</div> : null}
  <div className="mt-1 text-[11px] text-gray-500">
    اكتب رقم الموبايل بدون 0 — مثال: <span dir="ltr">9xxxxxxxx</span>
  </div>
</div>

              <div>
                <div className="mb-1 text-xs text-gray-600">هاتف (اختياري)</div>
                <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="011xxxxxx" />
              </div>
              <div>
                <div className="mb-1 text-xs text-gray-600">العنوان</div>
                <Input value={form.addressText} onChange={(e) => setForm((f) => ({ ...f, addressText: e.target.value }))} placeholder="مثال: المزة - شارع..." />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="text-sm font-extrabold">إعدادات الخدمة</div>
            <div className="mt-3 space-y-3">
              <Toggle
                label="يوفر توصيل"
                checked={form.deliveryEnabled}
                onChange={(v) => setForm((f) => ({ ...f, deliveryEnabled: v }))}
              />
              <Toggle
                label="يوفر استلام من المطعم"
                checked={form.pickupEnabled}
                onChange={(v) => setForm((f) => ({ ...f, pickupEnabled: v }))}
              />

              <div className="rounded-xl border border-gray-200 bg-white p-3">
  <div className="text-xs font-bold text-gray-700">الموقع (اختياري)</div>

  <div className="mt-2">
    <MapPicker
      value={form.location}
      onChange={({ lat, lng }) =>
        setForm((f) => ({ ...f, location: { lat, lng } }))
      }
    />
  </div>
</div>


              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <div className="text-xs font-bold text-gray-700">ساعات العمل :</div>
                <div className="mt-2 space-y-2">
                  {form.hours.weekly.map((d, idx) => (
                    <div key={d.day} className="grid grid-cols-4 items-center gap-2 text-xs">
                      <div className="col-span-1 font-semibold">{dayLabel(d.day)}</div>
                      <label className="col-span-1 flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-green-600"
                          checked={!!d.isClosed}
                          onChange={(e) => {
                            const isClosed = e.target.checked;
                            setForm((f) => {
                              const weekly = [...f.hours.weekly];
                              weekly[idx] = { ...weekly[idx], isClosed };
                              return { ...f, hours: { ...f.hours, weekly } };
                            });
                          }}
                        />
                        <span>مغلق</span>
                      </label>
                      <Input
                        className="col-span-1"
                        value={d.open}
                        disabled={d.isClosed}
                        onChange={(e) => {
                          const open = e.target.value;
                          setForm((f) => {
                            const weekly = [...f.hours.weekly];
                            weekly[idx] = { ...weekly[idx], open };
                            return { ...f, hours: { ...f.hours, weekly } };
                          });
                        }}
                      />
                      <Input
                        className="col-span-1"
                        value={d.close}
                        disabled={d.isClosed}
                        onChange={(e) => {
                          const close = e.target.value;
                          setForm((f) => {
                            const weekly = [...f.hours.weekly];
                            weekly[idx] = { ...weekly[idx], close };
                            return { ...f, hours: { ...f.hours, weekly } };
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-[11px] text-gray-500">الوقت بصيغة HH:MM مثل 09:00</div>
              </div>
            </div>
          </div>
        </div>

        <Button className="w-full py-3" disabled={saving}>
          {saving ? "جارِ الحفظ..." : hasRestaurant ? "حفظ التعديل" : "إنشاء المطعم"}
        </Button>

        {!hasRestaurant ? (
          <div className="text-xs text-gray-500">
            إذا ظهر لك slug بعد الإنشاء، انسخه وضعه في صفحة "نظرة عامة" داخل حقل ربط slug.
          </div>
        ) : null}
      </form>
    </div>
  );
}
