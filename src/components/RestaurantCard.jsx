// File: src/components/RestaurantCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import Badge from "./ui/Badge.jsx";

export default function RestaurantCard({ r }) {
  const cover = r?.coverUrls?.[0] || r?.logoUrl || "";

  return (
    <Link
      to={`/r/${r.slug}`}
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Image */}
      <div className="relative h-32 w-full bg-gray-100">
        {cover ? (
          <>
            <img
              src={cover}
              alt={r?.name || "restaurant"}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-700 font-black">
              QR
            </div>
          </div>
        )}

        {/* ✅ Featured badge (always visible) */}
        {r?.isFeatured ? (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-[11px] font-extrabold text-white shadow-sm">
              ✨ مميز
            </span>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-gray-900 truncate">
              {r?.name || "-"}
            </div>
            <div className="mt-0.5 text-xs text-gray-500">
              {r?.city || "-"} • {r?.type || "-"}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {r?.openNow === true ? <Badge tone="green">مفتوح الآن</Badge> : null}
          {r?.openNow === false ? <Badge tone="red">مغلق</Badge> : null}
          {r?.deliveryEnabled ? <Badge>توصيل</Badge> : null}
          {r?.pickupEnabled ? <Badge>استلام</Badge> : null}
        </div>
      </div>
    </Link>
  );
}
