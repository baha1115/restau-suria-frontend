import React from "react";

const toneMap = {
  green: "bg-green-50 text-green-800 ring-1 ring-green-200",
  red: "bg-red-50 text-red-800 ring-1 ring-red-200",
  gray: "bg-gray-50 text-gray-800 ring-1 ring-gray-200",
  yellow: "bg-yellow-50 text-yellow-900 ring-1 ring-yellow-200"
};

export default function Badge({ children, tone = "gray", className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        "leading-none",
        toneMap[tone] || toneMap.gray,
        className
      ].join(" ")}
    >
      {children}
    </span>
  );
}
