import React from "react";

export default function Input({ className = "", ...props }) {
  return (
    <input
      className={[
        "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900",
        "placeholder:text-gray-400 shadow-sm",
        "outline-none transition",
        "focus:border-green-500 focus:ring-4 focus:ring-green-100",
        "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
        className
      ].join(" ")}
      {...props}
    />
  );
}
