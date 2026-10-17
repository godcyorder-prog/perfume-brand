import { notFound, redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { getProducts } from "@/lib/products";
import { getCartItems } from "@/lib/cart-server";
async function CheckoutContent({ searchParams }: PageProps<"/checkout">) {
  const query = await searchParams;
  const id = typeof query.productId === "string" ? query.productId : "";
  const raw = typeof query.quantity === "string" ? Number(query.quantity) : 1;
  const quantity = Number.isInteger(raw) ? Math.max(1, Math.min(10, raw)) : 1;

  const cartItems = await getCartItems();
  if (cartItems.length > 0) {
    return <CheckoutForm cartItems={cartItems} razorpayKey={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ""} />;
  }

  if (!id) redirect("/");
  const product = (await getProducts()).find((p) => p.productId === id);
  if (!product) notFound();
  return <CheckoutForm product={product} quantity={quantity} razorpayKey={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ""} />;
}
export default function CheckoutPage(props: PageProps<"/checkout">) { return <Suspense fallback={<main className="mx-auto min-h-screen max-w-6xl animate-pulse px-5 py-8"><div className="h-14 w-28 rounded-full bg-white/10"/><div className="mt-8 h-12 w-64 rounded-xl bg-white/10"/><div className="mt-8 h-96 rounded-[24px] bg-white/[.06]"/></main>}><CheckoutContent {...props}/></Suspense>; }
import { Suspense } from "react";
