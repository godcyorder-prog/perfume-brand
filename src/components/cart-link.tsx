"use client";
import Link from "next/link";
import { useCart } from "@/components/cart-context";

export function CartLink() {
  const { totalItems } = useCart();
  return (
    <Link href="/cart" aria-label={`Cart, ${totalItems} items`} className="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#101217]/90 text-sm font-semibold text-[#d4b778] backdrop-blur transition hover:border-[#c9a96a]/50 sm:right-6 sm:top-6">
      🛍{totalItems > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d0b273] text-[10px] font-bold text-[#17140f]">{totalItems}</span>}
    </Link>
  );
}
