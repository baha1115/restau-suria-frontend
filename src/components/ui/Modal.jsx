// File: src/components/ui/Modal.jsx
import React from "react";
import Button from "./Button.jsx";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      aria-hidden="false"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Modal"}
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="text-sm font-extrabold text-gray-900 line-clamp-1">{title}</div>
          <Button variant="ghost" onClick={onClose} className="!shadow-none">
            إغلاق
          </Button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
