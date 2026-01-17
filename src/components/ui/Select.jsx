// File: src/components/ui/Select.jsx
import React from "react";

export default function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 outline-none transition
      hover:border-gray-300
      focus:border-green-500 focus:ring-2 focus:ring-green-100
      disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400
      ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
