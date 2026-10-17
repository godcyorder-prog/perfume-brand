import { notFound } from "next/navigation";
import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/products";
import type { Origin } from "@/types/product";

const categories: Record<string, string> = { baby: "Baby", women: "Women", men: "Men", other: "Other" };
const filters: ("all" | Origin)[] = ["all", "korea", "india", "usa", "china"];

async function CategoryContent({ params, searchParams }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  if (!categories[slug]) notFound();
  const query = await searchParams;
  const country = typeof query.country === "string" ? query.country : "all";
  const products = (await getProducts()).filter((p) => p.category === slug && (country === "all" || p.origin === country));
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-5 pb-14 pt-5 sm:px-8 sm:pt-8 lg:px-12">
      <BackLink />
      <header className="mb-6 mt-8 sm:mb-8 sm:mt-10">
        <p className="text-[10px] uppercase tracking-[.28em] text-[#cdb171]">Find your signature</p>
        <h1 className="mt-2 font-display text-4xl font-bold capitalize sm:text-5xl">{categories[slug]} fragrances</h1>
      </header>
      <nav aria-label="Filter by country" className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {filters.map((f) => (
          <Link key={f} href={f === "all" ? `/category/${slug}` : `/category/${slug}?country=${f}`} className={`flex min-h-14 shrink-0 items-center rounded-full border px-5 text-[11px] font-semibold uppercase tracking-[.13em] transition ${country === f ? "border-[#c9aa6a] bg-[#c9aa6a] text-[#14120e]" : "border-white/10 bg-white/[.025] text-white/65 hover:border-[#c9aa6a]/60"}`}>{f}</Link>
        ))}
      </nav>
      {products.length > 0 ? <ProductGrid products={products} /> : (
        <div className="rounded-3xl border border-white/10 bg-white/[.025] py-24 text-center">
          <p className="text-sm text-white/50">No products found in this category</p>
          <Link href="/" className="mt-4 inline-block text-sm text-[#d4b778]">View all products</Link>
        </div>
      )}
    </main>
  );
}

export default function CategoryPage(props: PageProps<"/category/[slug]">) {
  return <Suspense fallback={<main className="mx-auto min-h-screen max-w-7xl animate-pulse px-5 py-8 sm:px-8"><div className="h-14 w-28 rounded-full bg-white/10"/><div className="mt-10 h-12 w-64 rounded-xl bg-white/10"/><div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">{Array.from({length:8},(_,i)=><div key={i} className="aspect-[.82] rounded-[22px] bg-white/[.06]"/>)}</div></main>}><CategoryContent {...props}/></Suspense>;
}
import { Suspense } from "react";
