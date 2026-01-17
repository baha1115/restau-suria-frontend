// File: src/pages/public/HomePage.jsx
import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import publicApi from "../../api/public.js";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import RestaurantCard from "../../components/RestaurantCard.jsx";
import {
  MapPin,
  Search,
  Sparkles,
  Tag,
  ChevronLeft,
  ChevronRight,
  Compass,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LOTTIE_SCAN =
  "https://lottie.host/be460caf-fa32-4ca4-aa3c-851d0bd4eaca/nBbawMbk2u.lottie";
const LOTTIE_DELIVERY =
  "https://lottie.host/ec0e8e22-3fb1-4c66-b9e8-a5b39755af85/3bLrhY4FE8.lottie";

function SectionTitle({ icon, title, hint, action }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-green-50 text-green-700 border border-green-100">
          {icon}
        </span>
        <div>
          <div className="text-sm font-extrabold">{title}</div>
          {hint ? <div className="text-xs text-gray-500">{hint}</div> : null}
        </div>
      </div>
      {action}
    </div>
  );
}

function Chip({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition
                 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50 active:translate-y-0
                 focus:outline-none focus:ring-2 focus:ring-green-200"
    >
      {children}
    </button>
  );
}

/** ✅ City pill card (جمالية أعلى من Chip) */
function CityPill({ name, onClick }) {
  return (
    <button
      onClick={onClick}
      className="snap-start shrink-0 min-w-[170px] sm:min-w-[190px] rounded-3xl border border-gray-100 bg-white shadow-soft
                 px-4 py-3 text-right transition
                 hover:-translate-y-0.5 hover:shadow-lg hover:border-green-100
                 focus:outline-none focus:ring-2 focus:ring-green-200"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-gray-900 truncate">
            {name}
          </div>
          <div className="mt-1 text-xs text-gray-500">اعرض مطاعم هذه المدينة</div>
        </div>

        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 border border-green-100 text-green-700">
          <MapPin size={18} />
        </span>
      </div>

      <div className="mt-3 h-1 w-10 rounded-full bg-green-200 opacity-70" />
    </button>
  );
}

/** ✅ Category card */
function CategoryCard({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group rounded-3xl border border-gray-100 bg-white shadow-soft p-4 text-right transition
                 hover:-translate-y-0.5 hover:shadow-lg hover:border-green-100
                 focus:outline-none focus:ring-2 focus:ring-green-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-gray-900 truncate">{title}</div>
          <div className="mt-1 text-xs text-gray-500">اضغط لعرض المطاعم</div>
        </div>

        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 border border-green-100 text-green-700 transition group-hover:scale-[1.03]">
          <Tag size={18} />
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-bold text-green-700">استكشف</span>
        <span className="h-1 w-12 rounded-full bg-green-200 opacity-0 transition group-hover:opacity-100" />
      </div>
    </button>
  );
}

function OfferCard({ offer, onOpenRestaurant }) {
  const img = offer?.imageUrl || ""; // لو ضفت imageUrl لاحقاً بالباك
  const restName = offer?.restaurantId?.name || "-";
  const restSlug = offer?.restaurantId?.slug || "";

  return (
    <div className="snap-start w-[280px] sm:w-[320px] shrink-0 rounded-3xl border border-gray-100 bg-white shadow-soft overflow-hidden">
      <div className="relative h-28 bg-gradient-to-l from-green-600/15 via-green-600/5 to-transparent">
        {img ? (
          <img
            src={img}
            alt={offer?.title || "offer"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="lottie-fit h-24 w-24 opacity-90">
              <DotLottieReact
                src={LOTTIE_DELIVERY}
                style={{ width: "100%", height: "100%" }}
                loop
                autoplay
              />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      <div className="p-4">
        <div className="text-sm font-extrabold text-gray-900 line-clamp-2">
          {offer?.title}
        </div>
        {offer?.description ? (
          <div className="mt-1 text-xs text-gray-600 line-clamp-2">
            {offer.description}
          </div>
        ) : (
          <div className="mt-1 text-xs text-gray-500">عرض فعّال الآن</div>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-xs text-gray-500">
            المطعم:{" "}
            <button
              className="font-semibold text-green-700 hover:underline"
              onClick={() => onOpenRestaurant(restSlug)}
              disabled={!restSlug}
            >
              {restName}
            </button>
          </div>

          <button
            onClick={() => onOpenRestaurant(restSlug)}
            className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-bold text-green-800 hover:bg-green-100 transition"
            disabled={!restSlug}
          >
            فتح
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturedCard({ r, onOpen }) {
  const cover = (r?.coverUrls && r.coverUrls[0]) || "";
  const logo = r?.logoUrl || "";
  const img = cover || logo || "";

  return (
    <div className="snap-start w-[270px] sm:w-[310px] md:w-[340px] shrink-0">
      <button
        onClick={onOpen}
        className="group w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg text-right"
      >
        <div className="relative h-36 bg-gradient-to-l from-green-600/15 via-green-600/5 to-transparent">
          {img ? (
            <img
              src={img}
              alt={r?.name || "restaurant"}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-700 font-black">
                QR
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

          <div className="absolute top-3 right-3 flex gap-2">
            <span className="rounded-full bg-green-600 text-white text-[11px] font-extrabold px-3 py-1 shadow-sm">
              مميز ✨
            </span>
            {r?.deliveryEnabled ? (
              <span className="rounded-full bg-white/90 border border-gray-200 text-[11px] font-bold px-3 py-1 text-gray-700">
                توصيل
              </span>
            ) : null}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-base font-extrabold text-gray-900 truncate">
                {r?.name || "-"}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {r?.city || "-"} • {r?.type || "-"}
              </div>
            </div>

            <div className="shrink-0 rounded-2xl bg-green-50 border border-green-100 px-3 py-2 text-xs font-extrabold text-green-700">
              افتح
            </div>
          </div>

          <div className="mt-3 h-1 w-12 rounded-full bg-green-200 opacity-0 transition group-hover:opacity-100" />
        </div>
      </button>
    </div>
  );
}

export default function HomePage() {
  const nav = useNavigate();
  const featuredRef = useRef(null);

  const scrollFeatured = useCallback((dir) => {
    const el = featuredRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.85) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

  const [q, setQ] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const d = await publicApi.home();
        setData(d);
      } catch (e) {
        setErr(e.message || "فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function goRestaurantsWithFilters(filters) {
    const sp = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) sp.set(k, v);
    });
    nav(`/restaurants?${sp.toString()}`);
  }

  const cities = data?.cities || [];
  const types = data?.types || [];
  const featured = data?.featuredRestaurants || [];
  const offers = data?.todayOffers || [];

  const topCities = useMemo(() => cities.slice(0, 10), [cities]);
  const topTypes = useMemo(() => types.slice(0, 8), [types]);

  if (loading) return <Loader />;
  if (err) return <EmptyState title="حدث خطأ" hint={err} />;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-l from-green-600/10 via-transparent to-transparent" />
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-green-500/10 blur-2xl animate-pulse" />
        <div className="absolute -right-14 -bottom-14 h-52 w-52 rounded-full bg-green-500/10 blur-2xl animate-pulse" />

        <div className="relative p-5 md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="md:max-w-[70%]">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                <Sparkles size={14} />
                تجربة منيو حديثة
              </div>
              <div className="mt-3 text-xl md:text-2xl font-black">
                اكتشف مطاعم قريبة وافتح المنيو بسرعة
              </div>
              <div className="mt-1 text-sm text-gray-600">
                بحث ذكي، تصنيفات، وعروض اليوم — كله بمكان واحد.
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div
                className="lottie-fit rounded-3xl border border-gray-100 bg-white shadow-soft
                           h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-40 lg:w-40"
              >
                <DotLottieReact
                  src={LOTTIE_SCAN}
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-5 grid gap-2 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </span>
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pr-10"
                placeholder="ابحث: مطعم / صنف / مدينة"
              />
            </div>

            <Button
              onClick={() => {
                if (!q.trim()) return;
                nav(`/search?q=${encodeURIComponent(q.trim())}`);
              }}
            >
              بحث
            </Button>

            <Button variant="ghost" onClick={() => setQ("")}>
              مسح
            </Button>
          </div>

          {/* Quick chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip onClick={() => goRestaurantsWithFilters({ openNow: "true" })}>
              مفتوح الآن
            </Chip>
            <Chip onClick={() => goRestaurantsWithFilters({ delivery: "true" })}>
              توصيل
            </Chip>
            <Chip onClick={() => nav("/restaurants")}>
              تصفّح حسب المدينة/التصنيف
            </Chip>
          </div>
        </div>
      </div>

      {/* ✅ Cities (محسّن) */}
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-soft">
        <SectionTitle
          icon={<MapPin size={18} />}
          title="المدن"
          hint="اختصر الطريق واختر مدينتك"
          action={
            <button
              onClick={() => nav("/restaurants")}
              className="text-sm font-semibold text-green-700 hover:underline"
            >
              عرض الكل
            </button>
          }
        />

        <div className="mt-4 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />

          <div className="no-scrollbar flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
            {topCities.length ? (
              topCities.map((c) => (
                <CityPill
                  key={c}
                  name={c}
                  onClick={() => goRestaurantsWithFilters({ city: c })}
                />
              ))
            ) : (
              <div className="w-full">
                <EmptyState
                  title="لا يوجد مدن بعد"
                  hint="أضف مطاعم من لوحة التحكم ليظهروا هنا"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Types (محسّن) */}
            {/* Types */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
        <SectionTitle icon={<Tag size={18} />} title="التصنيفات" hint="اكتشف المنيو حسب النوع" />

        {/* ✅ سويبر (سحب أفقي) */}
        <div className="mt-4 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />

          <div className="no-scrollbar flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
            {topTypes.length ? (
              topTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => goRestaurantsWithFilters({ type: t })}
                  className="snap-start shrink-0 w-[240px] sm:w-[280px]
                             group rounded-3xl border border-gray-100 bg-white p-4 text-right
                             shadow-soft transition hover:-translate-y-0.5 hover:border-green-100 hover:bg-green-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-gray-900 truncate">{t}</div>
                      <div className="mt-1 text-xs text-gray-500">اضغط لعرض المطاعم</div>
                    </div>

                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-green-100 bg-green-50 text-green-700">
                      <Tag size={18} />
                    </span>
                  </div>

                  <div className="mt-4 h-1 w-14 rounded-full bg-green-200 opacity-70 transition group-hover:w-20" />
                </button>
              ))
            ) : (
              <div className="w-full">
                <EmptyState title="لا يوجد تصنيفات بعد" hint="سيتم استخراجها تلقائيًا من المطاعم" />
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Featured */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
        <SectionTitle
          icon={<Sparkles size={18} />}
          title="مطاعم مميزة"
          hint="أفضل الخيارات المقترحة"
          action={
            <button
              onClick={() => nav("/restaurants")}
              className="text-sm font-semibold text-green-700 hover:underline"
            >
              عرض الكل
            </button>
          }
        />

        <div className="mt-4 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />

          <div className="hidden md:flex items-center gap-2 absolute -top-12 left-0">
            <button
              type="button"
              onClick={() => scrollFeatured(-1)}
              className="h-9 w-9 rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition"
              aria-label="Prev"
            >
              <ChevronRight size={18} className="mx-auto text-gray-700" />
            </button>
            <button
              type="button"
              onClick={() => scrollFeatured(1)}
              className="h-9 w-9 rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition"
              aria-label="Next"
            >
              <ChevronLeft size={18} className="mx-auto text-gray-700" />
            </button>
          </div>

          <div
            ref={featuredRef}
            className="no-scrollbar flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth"
          >
            {featured.length ? (
              featured.map((r) => (
                <FeaturedCard
                  key={r._id || r.slug}
                  r={r}
                  onOpen={() => nav(`/r/${r.slug}`)}
                />
              ))
            ) : (
              <div className="w-full">
                <EmptyState title="لا يوجد مطاعم مميزة بعد" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offers */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
        <SectionTitle
          icon={<Tag size={18} />}
          title="عروض اليوم"
          hint="خصومات و عروض فعّالة حالياً"
        />

        <div className="mt-4 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />

          <div className="no-scrollbar flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
            {offers.length ? (
              offers.map((o) => (
                <OfferCard
                  key={o._id}
                  offer={o}
                  onOpenRestaurant={(slug) => slug && nav(`/r/${slug}`)}
                />
              ))
            ) : (
              <div className="w-full">
                <EmptyState
                  title="لا يوجد عروض اليوم"
                  hint="سيظهر هنا العروض النشطة خلال الوقت"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
