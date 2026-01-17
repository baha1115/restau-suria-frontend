// File: src/components/ui/Toggle.jsx
import React from "react";

export default function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-3 transition hover:border-gray-300">
      <span className="text-sm font-semibold text-gray-800">{label}</span>

      <span className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={!!checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span
          className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-green-600 peer-focus:ring-2 peer-focus:ring-green-100"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute right-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition
          peer-checked:-translate-x-5"
          aria-hidden="true"
        />
      </span>
    </label>
  );
}
