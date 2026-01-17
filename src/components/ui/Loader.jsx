// File: src/components/ui/Loader.jsx
import React from "react";

export default function Loader({ label = "جارِ التحميل..." }) {
  return (
    <div className="flex w-full items-center justify-center py-12">
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-soft"
      >
        <span
          className="h-5 w-5 rounded-full border-2 border-gray-200 border-t-green-600 animate-spin"
          aria-hidden="true"
        />
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
    </div>
  );
}
