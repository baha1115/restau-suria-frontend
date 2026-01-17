import React from "react";

const variants = {
  primary:
    "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
  secondary:
    "bg-white text-green-700 border border-green-200 hover:bg-green-50 active:bg-green-100",
  ghost:
    "bg-transparent text-green-700 hover:bg-green-50 active:bg-green-100",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      className={[
        // base
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold",
        "shadow-soft transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-100 focus-visible:ring-offset-0",
        "disabled:opacity-60 disabled:pointer-events-none",
        variants[variant] || variants.primary,
        className
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
