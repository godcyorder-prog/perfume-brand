import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { ProductGrid } from "@/components/product-grid";
import { getCountryName, getProducts } from "@/lib/products";
import type { Origin } from "@/types/product";
const origins: Origin[] = ["korea", "india", "usa", "china"];
async function CountryContent({ params }: PageProps<"/country/[origin]">) {
  const { origin } = await params;
  if (!origins.includes(origin as Origin)) notFound();
  const products = (await getProducts()).filter((p) => p.origin === origin);
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-5 pb-14 pt-5 sm:px-8 sm:pt-8 lg:px-12">
      <BackLink />
      <header className="mb-8 mt-8 sm:mt-10">
        <p className="text-[10px] uppercase tracking-[.28em] text-[#cdb171]">Scented around the world</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Made in {getCountryName(origin)}</h1>
      </header>
      {products.length > 0 ? <ProductGrid products={products} /> : (
        <div className="rounded-3xl border border-white/10 bg-white/[.025] py-24 text-center">
          <p className="text-sm text-white/50">No products found for this origin</p>
        </div>
      )}
    </main>
  );
}
export default function CountryPage(props: PageProps<"/country/[origin]">) {
  return <Suspense fallback={<main className="mx-auto min-h-screen max-w-7xl animate-pulse px-5 py-8 sm:px-8"><div className="h-14 w-28 rounded-full bg-white/10"/><div className="mt-10 h-12 w-64 rounded-xl bg-white/10"/><div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">{Array.from({length:8},(_,i)=><div key={i} className="aspect-[.82] rounded-[22px] bg-white/[.06]"/>)}</div></main>}><CountryContent {...props}/></Suspense>;
}
import { Suspense } from "react";
