// File: src/components/map/MapPicker.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix marker icons for Vite/React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

function ClickToSetMarker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

// يضمن أن الخريطة تتحرك لمكان الماركر وتعيد حساب الحجم
function MapFixer({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    // مهم جدًا: إذا كان الكونتاينر تغيّر حجمه بعد الرندر
    setTimeout(() => {
      try {
        map.invalidateSize();
      } catch {}
    }, 50);
  }, [map]);

  useEffect(() => {
    if (!center) return;
    try {
      map.setView(center, zoom, { animate: true });
    } catch {}
  }, [map, center, zoom]);

  return null;
}

export default function MapPicker({ value, onChange }) {
  const hasValue = value?.lat != null && value?.lng != null;

  const defaultCenter = useMemo(() => {
    // دمشق افتراضيًا
    return [33.5138, 36.2765];
  }, []);

  const center = hasValue ? [value.lat, value.lng] : defaultCenter;
  const zoom = hasValue ? 16 : 12;

  // (اختياري) لتفادي مشاكل SSR/هيدرَيشِن
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="px-3 py-2 text-xs text-gray-600 border-b border-gray-100">
        اسحب للتحريك • Zoom بعجلة الماوس أو Pinch على الموبايل • اضغط لتحديد الموقع
      </div>

      <div className="h-72 w-full">
        <MapContainer
          center={center}
          zoom={zoom}
          className="h-full w-full"
          // ✅ فعّل التفاعل صراحة لتفادي سلوكيات غريبة على بعض الأجهزة
          dragging={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          touchZoom={true}
          keyboard={true}
          zoomControl={true}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // ✅ يحسن الجودة على الشاشات Retina
            detectRetina={true}
            maxZoom={19}
          />

          <MapFixer center={center} zoom={zoom} />

          <ClickToSetMarker onPick={onChange} />

          {hasValue ? <Marker position={[value.lat, value.lng]} /> : null}
        </MapContainer>
      </div>

      <div className="px-3 py-2 text-xs text-gray-600 border-t border-gray-100 flex items-center justify-between gap-2">
        <span className="truncate">
          {hasValue
            ? `Lat: ${value.lat.toFixed(6)} , Lng: ${value.lng.toFixed(6)}`
            : "لم يتم اختيار موقع بعد"}
        </span>

        {hasValue ? (
          <button
            type="button"
            className="shrink-0 rounded-lg px-2 py-1 text-green-700 hover:bg-green-50 hover:text-green-800 font-bold"
            onClick={() => onChange({ lat: null, lng: null })}
          >
            إزالة
          </button>
        ) : null}
      </div>
    </div>
  );
}
