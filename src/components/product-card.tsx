import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import type { Product } from "@/types/product";

const flags: Record<string, string> = { korea: "🇰🇷", india: "🇮🇳", usa: "🇺🇸", china: "🇨🇳" };
export function ProductCard({ product }: { product: Product }) {
  return <Link href={`/product/${product.productId}`} className="product-card group block rounded-[22px] border border-white/[.09] bg-[#101217] p-3 transition duration-300 hover:-translate-y-1 hover:border-[#cba96a]/50 sm:p-4">
    <div className="relative aspect-[.94] overflow-hidden rounded-[16px] bg-[#17191d]">
      <ProductImage src={product.image} alt={`${product.name} perfume bottle`} sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 240px" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
      <span className="absolute right-2 top-2 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-xs" aria-label={`Made in ${product.origin}`}>{flags[product.origin]} <span className="uppercase">{product.origin}</span></span>
    </div>
    <div className="px-1 pb-1 pt-4"><h2 className="line-clamp-1 text-[15px] font-semibold text-[#f4f1e9] sm:text-base">{product.name}</h2><p className="mt-2 text-sm font-medium text-[#d4b778]">₹{product.price.toLocaleString("en-IN")}</p></div>
  </Link>;
}
