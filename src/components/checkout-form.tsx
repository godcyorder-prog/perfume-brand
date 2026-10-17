"use client";
import Script from "next/script";
import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { useState } from "react";
import type { Product, CartItem, Customer } from "@/types/product";

declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void }; } }
const inputClass = "mt-2 min-h-14 w-full rounded-[14px] border border-white/10 bg-[#111318] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#c9aa6a]/70";

type Props = { product?: Product; quantity?: number; cartItems?: CartItem[]; razorpayKey: string };

export function CheckoutForm({ product, quantity = 1, cartItems, razorpayKey }: Props) {
  const items: CartItem[] = cartItems ?? (product ? [{ ...product, quantity }] : []);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const [form, setForm] = useState<Customer>({ customerName: "", customerPhone: "", customerEmail: "", country: "India", state: "", address: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const update = (key: keyof Customer, value: string) => setForm((old) => ({ ...old, [key]: value }));

  async function pay(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    if (!window.Razorpay) { setError("Payment could not load. Please refresh and try again."); setBusy(false); return; }
    try {
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })) }),
      });
      const order = await response.json();
      if (!response.ok) throw new Error(order.error ?? "Could not start payment.");

      const checkout = new window.Razorpay({
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "COYILO",
        description: items.map((i) => i.name).join(", "),
        order_id: order.id,
        prefill: { name: form.customerName, email: form.customerEmail, contact: form.customerPhone },
        theme: { color: "#d0b273" },
        handler: async (payment: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            const result = await fetch("/api/order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...payment, items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })), ...form }),
            });
            const data = await result.json();
            if (!result.ok) throw new Error(data.error ?? "Payment verification failed.");
            window.location.assign(`/thank-you?orderId=${encodeURIComponent(data.orderId)}`);
          } catch (e) {
            setError(e instanceof Error ? e.message : "We could not confirm your order. Please contact support with your payment ID.");
            setBusy(false);
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      checkout.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start payment. Please try again.");
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return <main className="mx-auto min-h-screen w-full max-w-6xl px-5 pt-5 sm:px-8 sm:pt-8"><p className="text-white/50">Your cart is empty. <Link href="/" className="text-[#d4b778]">Continue shopping</Link>.</p></main>;
  }

  return <>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" onError={() => setError("Payment could not load. Check your connection and refresh.")} />
    <main className="mx-auto min-h-screen w-full max-w-6xl px-5 pb-8 pt-5 sm:px-8 sm:pt-8">
      <Link href={cartItems ? "/cart" : `/product/${items[0].productId}`} className="inline-flex min-h-14 items-center gap-2 rounded-full border border-white/10 px-5 text-sm text-white/70">← <span>Back</span></Link>
      <h1 className="mt-8 font-display text-4xl font-bold">Checkout</h1>
      <div className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-[.8fr_1.2fr]">
        <section className="h-fit rounded-[24px] border border-white/10 bg-[#101217] p-4 sm:p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[.18em] text-white/55">Your order</h2>
          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[15px] bg-[#1b1c1e]">
                  <ProductImage src={item.image} alt={`${item.name} perfume bottle`} sizes="96px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="font-display text-lg font-bold">{item.name}</h3>
                  <p className="mt-1 text-sm text-white/45">Quantity · {item.quantity}</p>
                  <p className="mt-2 text-sm font-semibold text-[#d4b778]">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-white/10 pt-3 text-right text-sm font-semibold text-[#d4b778]">Total · ₹{totalAmount.toLocaleString("en-IN")}</div>
        </section>

        <form onSubmit={pay} className="rounded-[24px] border border-white/10 bg-[#101217] p-4 sm:p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[.18em] text-white/55">Delivery details</h2>
          <div className="mt-4 grid gap-x-3 gap-y-4 sm:grid-cols-2">
            <label className="text-xs font-medium text-white/65 sm:col-span-2">Name<input required autoComplete="name" minLength={2} value={form.customerName} onChange={e => update("customerName", e.target.value)} className={inputClass} placeholder="Your full name" /></label>
            <label className="text-xs font-medium text-white/65">Phone<input required autoComplete="tel" type="tel" pattern="[0-9+() -]{8,16}" value={form.customerPhone} onChange={e => update("customerPhone", e.target.value)} className={inputClass} placeholder="+91 98765 43210" /></label>
            <label className="text-xs font-medium text-white/65">Email<input required autoComplete="email" type="email" value={form.customerEmail} onChange={e => update("customerEmail", e.target.value)} className={inputClass} placeholder="you@example.com" /></label>
            <label className="text-xs font-medium text-white/65">Country<input required autoComplete="country-name" value={form.country} onChange={e => update("country", e.target.value)} className={inputClass} /></label>
            <label className="text-xs font-medium text-white/65">State<input required autoComplete="address-level1" value={form.state} onChange={e => update("state", e.target.value)} className={inputClass} placeholder="State or region" /></label>
            <label className="text-xs font-medium text-white/65 sm:col-span-2">Address<textarea required autoComplete="street-address" minLength={8} rows={3} value={form.address} onChange={e => update("address", e.target.value)} className={`${inputClass} resize-y py-4`} placeholder="Street, area, city and postal code" /></label>
          </div>
          {error && <p role="alert" className="mt-4 rounded-xl border border-red-400/25 bg-red-400/[.07] p-3 text-sm text-red-200">{error}</p>}
          <button disabled={busy} className="mt-5 flex min-h-16 w-full items-center justify-center rounded-full bg-[#d0b273] px-6 text-sm font-bold tracking-[.07em] text-[#17140f] transition hover:bg-[#e2c783] disabled:cursor-wait disabled:opacity-60">
            {busy ? "Opening secure checkout…" : `Pay ₹${totalAmount.toLocaleString("en-IN")}`}
          </button>
          <p className="mt-3 text-center text-[10px] text-white/35">Secure payment powered by Razorpay</p>
        </form>
      </div>
    </main>
  </>;
}
