import { HomeExperience } from "@/components/home-experience";
import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      <HomeExperience />
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-xl font-bold text-[#eee9df] sm:text-2xl">All fragrances</h2>
          <span className="text-[10px] uppercase tracking-[.18em] text-white/35">From Google Sheets</span>
        </div>
        <ProductGrid products={products} />
      </section>
    </>
  );
}
