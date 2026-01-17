import React from "react";

export default function EmptyState({ title = "لا يوجد بيانات", hint = "" }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-7 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-700 ring-1 ring-green-100">
        <span className="text-lg font-black">i</span>
      </div>

      <div className="text-sm font-extrabold text-gray-900">{title}</div>
      {hint ? <div className="mt-1 text-xs leading-relaxed text-gray-500">{hint}</div> : null}
    </div>
  );
}
