import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import publicApi from "../../api/public.js";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import RestaurantCard from "../../components/RestaurantCard.jsx";
import { Search } from "lucide-react";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchPage() {
  const qp = useQuery();
  const q = (qp.get("q") || "").trim();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        if (!q) {
          setData({ restaurants: [], menuItems: [] });
        } else {
          const d = await publicApi.search(q);
          setData(d);
        }
      } catch (e) {
        setErr(e.message || "فشل البحث");
      } finally {
        setLoading(false);
      }
    })();
  }, [q]);

  if (loading) return <Loader />;
  if (err) return <EmptyState title="خطأ" hint={err} />;

  const restaurants = data?.restaurants || [];
  const menuItems = data?.menuItems || [];

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="card-surface p-4">
        <div className="flex items-center gap-2 text-sm font-extrabold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-green-50 text-green-700 border border-green-100">
            <Search size={18} />
          </span>
          نتائج البحث
        </div>
        <div className="mt-2 text-sm text-gray-600">
          الكلمة:{" "}
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-900">
            {q || "-"}
          </span>
        </div>
      </div>

      <div className="card-surface p-4">
        <div className="text-sm font-extrabold">مطاعم</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.length ? restaurants.map((r) => <RestaurantCard key={r._id || r.slug} r={r} />) : <EmptyState title="لا يوجد مطاعم" />}
        </div>
      </div>

      <div className="card-surface p-4">
        <div className="text-sm font-extrabold">أصناف</div>
        <div className="mt-4 space-y-2">
          {menuItems.length ? (
            menuItems.map((it) => (
              <div key={it._id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-white hover:shadow-sm">
                <div className="text-sm font-extrabold">{it.name}</div>
                <div className="mt-1 text-xs text-gray-600">
                  السعر: {it.price} {it.currency}
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  المطعم:{" "}
                  <Link to={`/r/${it.restaurantId?.slug || ""}`} className="font-semibold text-green-700 hover:underline">
                    {it.restaurantId?.name || "-"}
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="لا يوجد أصناف" />
          )}
        </div>
      </div>
    </div>
  );
}
