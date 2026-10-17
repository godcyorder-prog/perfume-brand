import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getProducts } from "@/lib/products";
async function ProductContent({ params }: PageProps<"/product/[id]">) { const { id } = await params; const product = (await getProducts()).find((p) => p.productId === id); if (!product) notFound(); return <ProductDetail product={product}/>; }
export default function ProductPage(props: PageProps<"/product/[id]">) { return <Suspense fallback={<main className="mx-auto min-h-screen max-w-6xl animate-pulse px-5 py-8"><div className="h-14 w-28 rounded-full bg-white/10"/><div className="mt-8 aspect-square rounded-[28px] bg-white/[.06] sm:aspect-[2/1]"/></main>}><ProductContent {...props}/></Suspense>; }
import { Suspense } from "react";
