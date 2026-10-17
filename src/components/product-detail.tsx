"use client";
import { useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { useCart } from "@/components/cart-context";
import type { Product } from "@/types/product";
import { getCountryName } from "@/lib/products";
export function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;
  return <main className="mx-auto min-h-screen w-full max-w-6xl px-5 pb-32 pt-5 sm:px-8 sm:pb-14 sm:pt-8"><Link href={`/category/${product.category}`} className="inline-flex min-h-14 items-center gap-2 rounded-full border border-white/10 px-5 text-sm font-medium text-white/75 hover:border-[#c9a96b]">← <span>Back</span></Link>
    <div className="mt-6 grid gap-7 sm:mt-10 sm:grid-cols-2 sm:items-center sm:gap-12"><div className="relative aspect-square overflow-hidden rounded-[28px] border border-white/10 bg-[#111317]"><ProductImage src={product.image} alt={`${product.name} perfume bottle`} priority sizes="(max-width: 640px) 100vw, 50vw" className="object-cover"/></div><div><p className="text-[10px] uppercase tracking-[.28em] text-[#c9aa6a]">{product.category} collection</p><h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">{product.name}</h1>{product.brand && <p className="mt-2 text-sm text-white/50">{product.brand}{product.size ? ` · ${product.size}` : ""}</p>}<p className="mt-4 text-xl font-medium text-[#d4b778]">₹{product.price.toLocaleString("en-IN")}</p><p className="mt-4 text-sm leading-6 text-white/55">{product.note ?? "A thoughtfully composed fragrance, made to stay with you."}</p><p className="mt-5 inline-flex min-h-12 items-center rounded-full border border-white/10 px-4 text-xs text-white/65">Made in {getCountryName(product.origin)}</p>
      {outOfStock ? <p className="mt-4 inline-flex min-h-12 items-center rounded-full border border-red-400/25 bg-red-400/[.07] px-4 text-xs text-red-300">Out of stock</p> : product.stock <= 5 ? <p className="mt-4 inline-flex min-h-12 items-center rounded-full border border-amber-400/25 bg-amber-400/[.07] px-4 text-xs text-amber-300">Only {product.stock} left in stock</p> : null}
      <div className="mt-6 flex items-center gap-4"><span className="text-xs uppercase tracking-[.16em] text-white/50">Quantity</span><div className="flex min-h-14 items-center rounded-full border border-white/10"><button aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-14 w-14 rounded-full text-xl text-white/75 hover:text-[#d4b778]">−</button><span className="min-w-7 text-center text-sm" aria-live="polite">{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="h-14 w-14 rounded-full text-xl text-white/75 hover:text-[#d4b778]">+</button></div></div>
      <div className="mt-7 flex gap-3">
        <button onClick={() => addItem(product, quantity)} disabled={outOfStock} className="flex min-h-16 flex-1 items-center justify-center rounded-full border border-[#d0b273]/50 px-6 text-sm font-bold tracking-[.08em] text-[#d0b273] transition hover:bg-[#d0b273]/10 disabled:cursor-not-allowed disabled:opacity-40">Add to Cart</button>
        <Link href={`/checkout?productId=${encodeURIComponent(product.productId)}&quantity=${quantity}`} className={`flex min-h-16 flex-1 items-center justify-center rounded-full bg-[#d0b273] px-6 text-sm font-bold tracking-[.08em] text-[#17140f] shadow-[0_9px_28px_#c9a55c25] transition hover:bg-[#e2c783] ${outOfStock ? "pointer-events-none opacity-40" : ""}`}>Buy Now · ₹{(product.price * quantity).toLocaleString("en-IN")}</Link>
      </div>
    </div></div></main>;
}
