import { getOrders } from "@/lib/products";

export async function GET() {
  const orders = await getOrders();
  return Response.json(orders, { headers: { "Cache-Control": "no-store" } });
}
