import React from "react";
import Button from "./ui/Button.jsx";

export default function Pagination({ page, totalPages, onPage }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-3 shadow-soft">
      <Button variant="secondary" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        السابق
      </Button>

      <div className="text-sm text-gray-600">
        صفحة <b className="text-gray-900">{page}</b> من <b className="text-gray-900">{totalPages}</b>
      </div>

      <Button variant="secondary" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
        التالي
      </Button>
    </div>
  );
}
