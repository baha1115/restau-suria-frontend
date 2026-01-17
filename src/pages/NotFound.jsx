// File: src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <div className="text-center">
      <div className="text-2xl font-black">404</div>
      <div className="mt-1 text-sm text-gray-600">الصفحة غير موجودة</div>
      <div className="mt-4">
        <Link to="/">
          <Button>العودة للرئيسية</Button>
        </Link>
      </div>
    </div>
  );
}
