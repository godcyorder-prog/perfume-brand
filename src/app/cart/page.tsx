"use client";
import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { ProductImage } from "@/components/product-image";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-5 pb-16 pt-5 sm:px-8 sm:pt-8">
      <Link href="/" className="inline-flex min-h-14 items-center gap-2 rounded-full border border-white/10 px-5 text-sm text-white/70">← <span>Continue shopping</span></Link>
      <h1 className="mt-8 font-display text-4xl font-bold">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-[24px] border border-white/10 bg-[#101217] px-6 py-16 text-center">
          <p className="text-lg text-white/60">Your cart is empty</p>
          <Link href="/" className="mt-6 inline-flex min-h-14 items-center justify-center rounded-full bg-[#d0b273] px-8 text-sm font-bold text-[#17140f]">Browse fragrances</Link>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 rounded-[20px] border border-white/10 bg-[#101217] p-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[14px] bg-[#1b1c1e]">
                  <ProductImage src={item.image} alt={`${item.name} perfume bottle`} sizes="96px" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold">{item.name}</h3>
                    <p className="mt-1 text-sm text-white/45">₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button aria-label="Decrease quantity" onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 hover:text-[#d4b778]">−</button>
                      <span className="min-w-6 text-center text-sm">{item.quantity}</span>
                      <button aria-label="Increase quantity" onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 hover:text-[#d4b778]">+</button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-[#d4b778]">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                      <button aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.productId)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs text-white/50 hover:border-red-400/40 hover:text-red-300">✕</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-[#101217] p-6">
            <div className="flex items-center justify-between text-sm text-white/55">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-white/55">
              <span>Shipping</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-base font-semibold">
              <span>Total</span>
              <span className="text-[#d4b778]">₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <Link href="/checkout" className="mt-6 flex min-h-16 items-center justify-center rounded-full bg-[#d0b273] px-6 text-sm font-bold tracking-[.07em] text-[#17140f] transition hover:bg-[#e2c783]">
              Proceed to Checkout · ₹{totalPrice.toLocaleString("en-IN")}
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
