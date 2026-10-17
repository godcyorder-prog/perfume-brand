"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { Order } from "@/types/product";

export default function ManagePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshCount]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 pb-16 pt-5 sm:px-8 sm:pt-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex min-h-14 items-center gap-2 rounded-full border border-white/10 px-5 text-sm text-white/70">← <span>Store</span></Link>
        <button onClick={() => setRefreshCount((c) => c + 1)} disabled={loading} className="flex min-h-11 items-center rounded-full border border-white/10 px-5 text-xs font-semibold text-white/70 transition hover:border-[#c9a96a]/50 disabled:opacity-50">
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <h1 className="mt-8 font-display text-4xl font-bold">Manage Orders</h1>
      <p className="mt-2 text-sm text-white/45">Orders placed on your website, saved to Google Sheets.</p>

      {error && (
        <div className="mt-6 rounded-[20px] border border-red-400/25 bg-red-400/[.07] p-5 text-sm text-red-200">
          <p className="font-semibold">Could not load orders</p>
          <p className="mt-1 text-red-200/70">{error}</p>
          <p className="mt-2 text-xs text-red-200/50">The Apps Script orderHistory action may be experiencing a lock timeout. Try refreshing in a few moments.</p>
        </div>
      )}

      {loading && !error && (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-[20px] bg-white/[.06]" />
          ))}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-8 rounded-[24px] border border-white/10 bg-[#101217] px-6 py-16 text-center">
          <p className="text-lg text-white/50">No orders yet</p>
          <p className="mt-2 text-sm text-white/35">Orders will appear here once customers place them.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.orderId} className="rounded-[20px] border border-white/10 bg-[#101217] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg font-bold">Order #{order.orderId}</p>
                  <p className="mt-1 text-sm text-white/45">{order.date}</p>
                </div>
                <span className="rounded-full border border-[#c9aa6a]/30 bg-[#c9aa6a]/10 px-3 py-1 text-xs font-semibold text-[#d4b778]">{order.status}</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[.14em] text-white/35">Customer</p>
                  <p className="mt-1 text-sm">{order.customerName}</p>
                  <p className="text-xs text-white/40">{order.customerPhone}</p>
                  <p className="text-xs text-white/40">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[.14em] text-white/35">Items</p>
                  {order.items.map((item, idx) => (
                    <p key={idx} className="mt-1 text-sm">{item.productName} × {item.quantity}</p>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-sm text-white/50">Total</span>
                <span className="text-sm font-semibold text-[#d4b778]">₹{order.total.toLocaleString("en-IN")}</span>
              </div>
              {order.paymentStatus && (
                <p className="mt-2 text-xs text-white/35">Payment: {order.paymentStatus}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
