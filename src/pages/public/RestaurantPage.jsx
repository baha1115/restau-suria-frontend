import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import publicApi from "../../api/public.js";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { Phone, MapPin, Share2, Menu, MessageCircle } from "lucide-react";

export default function RestaurantPage() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const table = sp.get("t");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const d = await publicApi.getRestaurant(slug);
        setData(d);
      } catch (e) {
        setErr(e.message || "فشل تحميل المطعم");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const restaurant = data?.restaurant;
  const cover = restaurant?.coverUrls?.[0] || restaurant?.logoUrl || "";
  const openNow = restaurant?.openNow;

  const mapUrl = useMemo(() => {
    const lat = restaurant?.location?.lat;
    const lng = restaurant?.location?.lng;
    if (lat == null || lng == null) return "";
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`;

  }, [restaurant]);

  if (loading) return <Loader />;
  if (err) return <EmptyState title="خطأ" hint={err} />;
  if (!restaurant) return <EmptyState title="المطعم غير موجود" />;

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft">
        <div className="relative h-56 bg-gray-100">
          {cover ? (
            <>
              <img src={cover} alt={restaurant.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </>
          ) : null}

          <div className="absolute bottom-4 right-4 left-4">
            <div className="flex flex-wrap items-center gap-2">
              {openNow === true ? <Badge tone="green">مفتوح الآن</Badge> : null}
              {openNow === false ? <Badge tone="red">مغلق</Badge> : null}
              {restaurant.deliveryEnabled ? <Badge>توصيل</Badge> : null}
              {restaurant.pickupEnabled ? <Badge>استلام</Badge> : null}
              {table ? <Badge tone="yellow">طاولة: {table}</Badge> : null}
              {restaurant.isFeatured ? <Badge tone="yellow">⭐ مميز</Badge> : null}
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="text-xl font-black">{restaurant.name}</div>
          <div className="mt-1 text-sm text-gray-600">
            {restaurant.city} • {restaurant.type}
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Button
              onClick={() => {
                const num = (restaurant.whatsapp || "").replace("+", "");
                window.open(`https://wa.me/${num}`, "_blank");
              }}
              className="w-full"
            >
              <MessageCircle size={18} />
              واتساب
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                if (!restaurant.phone) return;
                window.location.href = `tel:${restaurant.phone}`;
              }}
              className="w-full"
            >
              <Phone size={18} />
              اتصال
            </Button>

            <Button
              variant="secondary"
              disabled={!mapUrl}
              onClick={() => window.open(mapUrl, "_blank")}
              className="w-full"
            >
              <MapPin size={18} />
              الموقع
            </Button>

            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  alert("تم نسخ الرابط ✅");
                } catch {
                  alert("لم يتم النسخ، انسخ يدويًا.");
                }
              }}
              className="w-full"
            >
              <Share2 size={18} />
              مشاركة
            </Button>
          </div>

          <div className="mt-5">
            <Button
              className="w-full py-3 text-base"
              onClick={() => {
                const qp = table ? `?t=${encodeURIComponent(table)}` : "";
                nav(`/r/${restaurant.slug}/menu${qp}`);
              }}
            >
              <Menu size={18} />
              افتح المنيو
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
