// File: src/pages/owner/OwnerUploads.jsx
import React, { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth.js";
import ownerApi from "../../api/owner.js";
import Button from "../../components/ui/Button.jsx";
import Loader from "../../components/ui/Loader.jsx";

export default function OwnerUploads() {
  const { user } = useAuth();

  const restaurantId = user?.restaurantId || null;

  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

  const [logoFile, setLogoFile] = useState(null);
  const [coverFiles, setCoverFiles] = useState([]);

  const logoPreview = useMemo(() => {
    if (!logoFile) return "";
    return URL.createObjectURL(logoFile);
  }, [logoFile]);

  const coversPreview = useMemo(() => {
    return [...coverFiles].map((f) => ({ file: f, url: URL.createObjectURL(f) }));
  }, [coverFiles]);

  // تنظيف object URLs
  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      coversPreview.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRestaurant = async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      const data = await ownerApi.getRestaurant(restaurantId);
      setRestaurant(data.restaurant);
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "فشل تحميل بيانات المطعم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  const onUploadLogo = async () => {
    if (!restaurantId) return alert("لا يوجد RestaurantId مرتبط بحسابك");
    if (!logoFile) return alert("اختر ملف شعار أولاً");

    setLoading(true);
    try {
      const data = await ownerApi.uploadLogo(restaurantId, logoFile);
      // ✅ حدث الستيت مباشرة (بدون كاش)
      setRestaurant((prev) => ({
        ...(prev || {}),
        logoUrl: data.logoUrl || prev?.logoUrl || ""
      }));
      setLogoFile(null);
      alert("تم رفع الشعار بنجاح ✅");
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "فشل رفع الشعار");
    } finally {
      setLoading(false);
    }
  };

  const onUploadCovers = async () => {
    if (!restaurantId) return alert("لا يوجد RestaurantId مرتبط بحسابك");
    if (!coverFiles?.length) return alert("اختر صور الغلاف أولاً");

    setLoading(true);
    try {
      const data = await ownerApi.uploadCovers(restaurantId, coverFiles);
      // ✅ حدث الستيت مباشرة (بدون كاش)
      setRestaurant((prev) => ({
        ...(prev || {}),
        coverUrls: data.coverUrls || prev?.coverUrls || []
      }));
      setCoverFiles([]);
      alert("تم رفع صور الغلاف بنجاح ✅");
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "فشل رفع صور الغلاف");
    } finally {
      setLoading(false);
    }
  };
const removePreviewCover = (idx) => {
  setCoverFiles((prev) => {
    const arr = Array.from(prev || []);
    arr.splice(idx, 1);
    return arr;
  });
};

const deleteCoverFromServer = async (url) => {
  if (!restaurantId) return;
  if (!url) return;
  if (!confirm("حذف هذه الصورة من الغلاف؟")) return;

  setLoading(true);
  try {
    const data = await ownerApi.deleteCover(restaurantId, url);
    setRestaurant((prev) => ({ ...(prev || {}), coverUrls: data.coverUrls || [] }));
  } catch (e) {
    alert(e?.response?.data?.message || e.message || "فشل حذف الصورة");
  } finally {
    setLoading(false);
  }
};


const deleteLogoFromServer = async () => {
  if (!restaurantId) return;
  if (!confirm("حذف الشعار؟")) return;

  setLoading(true);
  try {
    const data = await ownerApi.deleteLogo(restaurantId);
    setRestaurant((prev) => ({ ...(prev || {}), logoUrl: data.logoUrl || "" }));
  } catch (e) {
    alert(e?.response?.data?.message || e.message || "فشل حذف الشعار");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-extrabold">رفع الصور :</div>
            
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Loader />
              جاري...
            </div>
          ) : (
            <Button variant="secondary" onClick={loadRestaurant}>
              تحديث
            </Button>
          )}
        </div>
      </div>

      {!restaurantId ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600">
          لا يوجد RestaurantId مرتبط بحسابك. أنشئ مطعمًا أولاً من صفحة بيانات المطعم.
        </div>
      ) : (
        <>
          {/* Covers */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
           <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex items-center gap-3">
    <input
      id="covers-input"
      type="file"
      multiple
      accept="image/*"
      onChange={(e) => setCoverFiles(e.target.files || [])}
      className="hidden"
    />
    <label
      htmlFor="covers-input"
      className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 active:scale-[0.99] transition"
    >
      اختر صور الغلاف
    </label>

    <div className="text-xs text-gray-500">
      {coverFiles?.length ? `تم اختيار ${coverFiles.length} صورة` : "لم يتم اختيار صور"}
    </div>
  </div>

  <Button onClick={onUploadCovers} disabled={loading || !coverFiles?.length}>
    رفع الصور
  </Button>
</div>


        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
  {(restaurant?.coverUrls || []).map((url, idx) => (
    <div key={url + idx} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white">
      <img
        src={url}
        alt="cover"
        className="h-24 w-full object-cover"
        loading="lazy"
      />

      <button
        type="button"
       onClick={() => deleteCoverFromServer(url)}

        className="absolute right-2 top-2 hidden rounded-lg bg-white/90 px-2 py-1 text-xs font-bold text-red-600 shadow-sm hover:bg-white group-hover:inline-flex"
      >
        حذف
      </button>
    </div>
  ))}
</div>

            {/* Preview */}
           <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
  {coversPreview.map((p, idx) => (
    <div key={p.url + idx} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white">
      <img src={p.url} alt="preview" className="h-24 w-full object-cover" />
      <button
        type="button"
        onClick={() => removePreviewCover(idx)}
        className="absolute right-2 top-2 hidden rounded-lg bg-white/90 px-2 py-1 text-xs font-bold text-gray-700 shadow-sm hover:bg-white group-hover:inline-flex"
      >
        إزالة
      </button>
    </div>
  ))}
</div>

          </div>

          {/* Logo */}
         <div className="mt-4 grid gap-4 md:grid-cols-2">
  <div className="flex items-center gap-3">
    <input
      id="logo-input"
      type="file"
      accept="image/*"
      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
      className="hidden"
    />
    <label
      htmlFor="logo-input"
      className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 active:scale-[0.99] transition"
    >
      اختر شعار
    </label>
    <div className="text-xs text-gray-500">{logoFile ? logoFile.name : "لم يتم اختيار شعار"}</div>
  </div>

  <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
    <div className="flex items-center gap-3">
      <div className="h-14 w-14 rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={logoPreview || restaurant?.logoUrl || ""}
          alt="logo"
          className="h-full w-full object-contain"
          onError={(e) => {
            e.currentTarget.src = "";
          }}
        />
      </div>
      <div className="text-xs text-gray-600">
        <div className="font-bold text-gray-800">الشعار الحالي</div>
        <div className="mt-0.5 text-gray-500">logoUrl</div>
      </div>
    </div>

    <div className="flex items-center gap-2">
      {!!restaurant?.logoUrl && (
        <Button variant="ghost" onClick={deleteLogoFromServer} disabled={loading}>
          حذف
        </Button>
      )}
      <Button onClick={onUploadLogo} disabled={loading || !logoFile}>
        رفع
      </Button>
    </div>
  </div>
</div>

        </>
      )}
    </div>
  );
}
