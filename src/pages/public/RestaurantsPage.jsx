import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import publicApi from "../../api/public.js";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Select from "../../components/ui/Select.jsx";
import Toggle from "../../components/ui/Toggle.jsx";
import Button from "../../components/ui/Button.jsx";
import RestaurantCard from "../../components/RestaurantCard.jsx";
import Pagination from "../../components/Pagination.jsx";
import { Filter } from "lucide-react";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function RestaurantsPage() {
  const nav = useNavigate();
  const qp = useQuery();

  const [meta, setMeta] = useState({ cities: [], types: [] });
  const [list, setList] = useState(null);

  const [filters, setFilters] = useState(() => ({
    city: qp.get("city") || "",
    type: qp.get("type") || "",
    openNow: qp.get("openNow") === "true",
    delivery: qp.get("delivery") === "true"
  }));

  const [page, setPage] = useState(parseInt(qp.get("page") || "1", 10));
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const home = await publicApi.home();
      setMeta({ cities: home.cities || [], types: home.types || [] });

      const params = {
        city: filters.city || undefined,
        type: filters.type || undefined,
        openNow: filters.openNow ? "true" : undefined,
        delivery: filters.delivery ? "true" : undefined,
        page,
        limit: 12
      };
      const data = await publicApi.listRestaurants(params);
      setList(data);
    } catch (e) {
      setErr(e.message || "فشل تحميل المطاعم");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function applyFilters() {
    setPage(1);
    const sp = new URLSearchParams();
    if (filters.city) sp.set("city", filters.city);
    if (filters.type) sp.set("type", filters.type);
    if (filters.openNow) sp.set("openNow", "true");
    if (filters.delivery) sp.set("delivery", "true");
    sp.set("page", "1");
    nav(`/restaurants?${sp.toString()}`);
    load();
  }

  function resetFilters() {
    const next = { city: "", type: "", openNow: false, delivery: false };
    setFilters(next);
    setPage(1);
    nav("/restaurants");
    load();
  }

  if (loading) return <Loader />;
  if (err) return <EmptyState title="حدث خطأ" hint={err} />;

  const items = list?.items || [];

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="card-surface p-4">
        <div className="flex items-center gap-2 text-sm font-extrabold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-green-50 text-green-700 border border-green-100">
            <Filter size={18} />
          </span>
          فلترة المطاعم
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <div className="mb-1 text-xs text-gray-600">المدينة</div>
            <Select value={filters.city} onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}>
              <option value="">الكل</option>
              {meta.cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <div className="mb-1 text-xs text-gray-600">التصنيف</div>
            <Select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
              <option value="">الكل</option>
              {meta.types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>

          <Toggle label="مفتوح الآن" checked={filters.openNow} onChange={(v) => setFilters((f) => ({ ...f, openNow: v }))} />
          <Toggle label="يوفر توصيل" checked={filters.delivery} onChange={(v) => setFilters((f) => ({ ...f, delivery: v }))} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={applyFilters}>تطبيق</Button>
          <Button variant="secondary" onClick={resetFilters}>
            إعادة ضبط
          </Button>
        </div>
      </div>

      {items.length ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r) => (
              <RestaurantCard key={r._id || r.slug} r={r} />
            ))}
          </div>

          <Pagination
            page={list?.page || page}
            totalPages={list?.totalPages || 1}
            onPage={(p) => {
              setPage(p);
              const sp = new URLSearchParams(window.location.search);
              sp.set("page", String(p));
              nav(`/restaurants?${sp.toString()}`);
            }}
          />
        </>
      ) : (
        <EmptyState title="لا يوجد مطاعم" hint="جرّب تغيير الفلاتر" />
      )}
    </div>
  );
}
