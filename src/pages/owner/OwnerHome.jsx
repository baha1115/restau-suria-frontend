// File: src/pages/owner/OwnerHome.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth.js";
import publicApi from "../../api/public.js";
import ownerApi from "../../api/owner.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function OwnerHome() {
  const { user, refreshMe } = useAuth();

  const [slug, setSlug] = useState(localStorage.getItem("owner_restaurant_slug") || "");
  const [restaurant, setRestaurant] = useState(null);
  const [err, setErr] = useState("");
  const [autoLinkLoading, setAutoLinkLoading] = useState(false);

  async function loadBySlug(s) {
    setErr("");
    try {
      const d = await publicApi.getRestaurant(s);
      setRestaurant(d.restaurant);
      localStorage.setItem("owner_restaurant_slug", s);
    } catch (e) {
      setErr(e.message || "فشل جلب المطعم");
    }
  }

  // 1) on mount: refresh + try saved slug
  useEffect(() => {
    refreshMe();
    const saved = localStorage.getItem("owner_restaurant_slug");
    if (saved) {
      setSlug(saved);
      loadBySlug(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Auto link slug from restaurantId (if slug missing)
  useEffect(() => {
    const saved = localStorage.getItem("owner_restaurant_slug");

    // إذا عندك مطعم مرتبط بالمستخدم، لكن slug غير محفوظ بالمتصفح
    if (user?.restaurantId && !saved && !restaurant && !autoLinkLoading) {
      (async () => {
        setAutoLinkLoading(true);
        setErr("");
        try {
          const d = await ownerApi.getRestaurant(user.restaurantId);
          const s = d?.restaurant?.slug;

          if (s) {
            localStorage.setItem("owner_restaurant_slug", s);
            setSlug(s);
            await loadBySlug(s);
          } else {
            setErr("تم العثور على المطعم لكن لا يوجد slug (تحقق من بيانات المطعم).");
          }
        } catch (e) {
          setErr(e.message || "فشل جلب بيانات المطعم من لوحة المالك");
        } finally {
          setAutoLinkLoading(false);
        }
      })();
    }
  }, [user?.restaurantId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function manualLink() {
    const s = slug.trim();
    if (!s) return;
    await loadBySlug(s);
    alert("تم ربط المطعم ✅");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="text-sm font-extrabold">نظرة عامة</div>
        <div className="mt-2 text-sm text-gray-700">
          أهلاً <b>{user?.name}</b> 👋
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge tone="gray">role: {user?.role}</Badge>
          {user?.restaurantId ? (
            <Badge tone="green">RestaurantId موجود</Badge>
          ) : (
            <Badge tone="yellow">لا يوجد RestaurantId بعد</Badge>
          )}
          {autoLinkLoading ? <Badge tone="gray">جاري ربط slug تلقائياً...</Badge> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        {err ? <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div> : null}

        <div className="mt-3 flex gap-2">
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="مثال: alsham-grill" />
          <Button onClick={manualLink} disabled={autoLinkLoading}>
            ربط
          </Button>
        </div>

        {restaurant ? (
          <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-3">
            <div className="text-sm font-bold">{restaurant.name}</div>
            <div className="mt-1 text-xs text-gray-600">
              {restaurant.city} • {restaurant.type}
            </div>
            <div className="mt-2 text-xs text-gray-500">
               <span className="font-semibold text-green-700">{restaurant.slug}</span>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState title="لم يتم ربط مطعم بعد" hint="سيتم ربطه تلقائياً إن كان لديك RestaurantId، أو اربطه يدويًا بالـslug." />
          </div>
        )}
      </div>
    </div>
  );
}
