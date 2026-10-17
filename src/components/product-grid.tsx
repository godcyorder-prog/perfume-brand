import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product-card";
export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <p className="rounded-3xl border border-white/10 bg-white/[.025] py-24 text-center text-sm text-white/50">No products yet</p>;
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.productId} product={product} />)}</div>;
}
