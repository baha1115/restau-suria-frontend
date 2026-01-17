// File: src/pages/public/MenuPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import publicApi from "../../api/public.js";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { Minus, Plus, ShoppingCart, MessageCircle } from "lucide-react";

export default function MenuPage() {
  const { slug } = useParams();
  const [sp] = useSearchParams();
  const tableNumber = sp.get("t") ? Number(sp.get("t")) : null;

  const [q, setQ] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // cart: { [itemId]: { id, name, qty, optionsSelected: [] } }
  const [cart, setCart] = useState({});
  const cartCount = useMemo(() => Object.values(cart).reduce((s, it) => s + (it.qty || 0), 0), [cart]);

  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);

  const [activeSectionId, setActiveSectionId] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  async function loadMenu(searchText = "") {
    setErr("");
    setLoading(true);
    try {
      const d = await publicApi.getMenu(slug, searchText);
      setData(d);
      const firstSection = d?.sections?.[0]?._id || "";
      setActiveSectionId((prev) => prev || firstSection);
    } catch (e) {
      setErr(e.message || "فشل تحميل المنيو");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMenu("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function changeQty(item, delta) {
    setCart((prev) => {
      const copy = { ...prev };
      const current = copy[item._id] || { id: item._id, name: item.name, qty: 0, optionsSelected: [] };
      const nextQty = Math.max((current.qty || 0) + delta, 0);

      if (nextQty === 0) {
        delete copy[item._id];
        return copy;
      }

      copy[item._id] = { ...current, qty: nextQty };
      return copy;
    });
  }

  function toggleOption(itemId, optionName) {
    setCart((prev) => {
      const current = prev[itemId];
      if (!current) return prev;

      const exists = current.optionsSelected?.includes(optionName);
      const nextOptions = exists
        ? current.optionsSelected.filter((x) => x !== optionName)
        : [...(current.optionsSelected || []), optionName];

      return {
        ...prev,
        [itemId]: { ...current, optionsSelected: nextOptions }
      };
    });
  }

  async function orderViaWhatsapp() {
    const items = Object.values(cart).map((it) => ({
      name: it.name,
      qty: it.qty,
      options: it.optionsSelected || []
    }));

    if (!items.length) {
      alert("السلة فارغة");
      return;
    }

    setSending(true);
    try {
      const res = await publicApi.whatsappMessage({
        slug,
        tableNumber,
        items,
        notes
      });

      window.open(res.whatsappUrl, "_blank");
      setCartOpen(false);
    } catch (e) {
      alert(e.message || "فشل إنشاء رابط واتساب");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <Loader />;
  if (err) return <EmptyState title="خطأ" hint={err} />;

  const restaurant = data?.restaurant;
  const sections = data?.sections || [];

  if (!restaurant) return <EmptyState title="المطعم غير موجود" />;

  const activeSection = sections.find((s) => String(s._id) === String(activeSectionId)) || sections[0];
  const items = activeSection?.items || [];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-black">{restaurant.name}</div>
            <div className="mt-1 text-sm text-gray-600">
              {restaurant.city} • {restaurant.type}
            </div>
            {tableNumber ? (
              <div className="mt-2">
                <Badge tone="yellow">طاولة: {tableNumber}</Badge>
              </div>
            ) : null}
          </div>

          <Button variant="secondary" onClick={() => setCartOpen(true)}>
            <ShoppingCart size={18} />
            السلة ({cartCount})
          </Button>
        </div>

        <div className="mt-3 flex gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث داخل المنيو..." />
          <Button variant="secondary" onClick={() => loadMenu(q.trim())}>
            بحث
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setQ("");
              loadMenu("");
            }}
          >
            مسح
          </Button>
        </div>
      </div>

      {/* Sections Tabs */}
      <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-soft">
        <div className="flex flex-wrap gap-2">
          {sections.map((s) => (
            <button
              key={s._id}
              onClick={() => setActiveSectionId(s._id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                String(activeSectionId) === String(s._id)
                  ? "bg-green-600 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-green-50"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      {items.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => {
            const qty = cart[it._id]?.qty || 0;
            const selected = cart[it._id]?.optionsSelected || [];

            return (
              <div key={it._id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-soft">
                {/* ✅ NEW: show dish image */}
                <div className="h-32 w-full bg-gray-100">
                  {it.imageUrl ? (
                    <img src={it.imageUrl} alt={it.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                      لا توجد صورة
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold">{it.name}</div>
                      <div className="mt-1 text-xs text-gray-600">
                        {it.price} {it.currency || "SYP"}
                      </div>
                      {it.description ? <div className="mt-2 text-xs text-gray-500">{it.description}</div> : null}
                      <div className="mt-2">{it.isAvailable ? <Badge tone="green">متوفر</Badge> : <Badge tone="red">غير متوفر اليوم</Badge>}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-xl border border-gray-200 bg-white p-2 hover:bg-gray-50"
                          onClick={() => changeQty(it, -1)}
                          disabled={qty <= 0}
                        >
                          <Minus size={16} />
                        </button>
                        <div className="w-8 text-center text-sm font-bold">{qty}</div>
                        <button
                          className="rounded-xl bg-green-600 p-2 text-white hover:bg-green-700 disabled:opacity-50"
                          onClick={() => changeQty(it, +1)}
                          disabled={!it.isAvailable}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {it.options?.length ? <div className="text-xs text-gray-500">إضافات: {it.options.length}</div> : null}
                    </div>
                  </div>

                  {/* Options (simple) */}
                  {qty > 0 && it.options?.length ? (
                    <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <div className="text-xs font-bold text-gray-700">اختر الإضافات (اختياري)</div>
                      <div className="mt-2 space-y-2">
                        {it.options.map((op, idx) => (
                          <label key={idx} className="flex items-center justify-between gap-3 text-xs">
                            <span>
                              {op.name} {op.price ? <span className="text-gray-500">(+{op.price})</span> : null}
                            </span>
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-green-600"
                              checked={selected.includes(op.name)}
                              onChange={() => toggleOption(it._id, op.name)}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="لا يوجد أصناف في هذا القسم" hint="جرّب قسم آخر أو غيّر البحث" />
      )}

      {/* Cart Modal */}
      <Modal open={cartOpen} title="سلة الطلب" onClose={() => setCartOpen(false)}>
        {cartCount ? (
          <div className="space-y-3">
            <div className="space-y-2">
              {Object.values(cart).map((it) => (
                <div key={it.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold">{it.name}</div>
                      {it.optionsSelected?.length ? (
                        <div className="mt-1 text-xs text-gray-600">إضافات: {it.optionsSelected.join("، ")}</div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-xl border border-gray-200 bg-white p-2 hover:bg-gray-50"
                        onClick={() =>
                          setCart((prev) => {
                            const copy = { ...prev };
                            const curr = copy[it.id];
                            const nextQty = Math.max((curr.qty || 0) - 1, 0);
                            if (nextQty === 0) delete copy[it.id];
                            else copy[it.id] = { ...curr, qty: nextQty };
                            return copy;
                          })
                        }
                      >
                        <Minus size={16} />
                      </button>
                      <div className="w-8 text-center text-sm font-bold">{it.qty}</div>
                      <button
                        className="rounded-xl bg-green-600 p-2 text-white hover:bg-green-700"
                        onClick={() =>
                          setCart((prev) => ({
                            ...prev,
                            [it.id]: { ...prev[it.id], qty: (prev[it.id].qty || 0) + 1 }
                          }))
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="mb-1 text-xs text-gray-600">ملاحظات عامة (اختياري)</div>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="مثال: بدون مخلل" />
            </div>

            <Button className="w-full py-3" onClick={orderViaWhatsapp} disabled={sending}>
              <MessageCircle size={18} />
              {sending ? "جارِ التحضير..." : "اطلب عبر واتساب"}
            </Button>
          </div>
        ) : (
          <EmptyState title="السلة فارغة" hint="أضف أصناف من المنيو" />
        )}
      </Modal>
    </div>
  );
}
