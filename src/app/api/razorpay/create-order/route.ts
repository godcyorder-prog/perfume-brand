import { getLiveProducts } from "@/lib/products";
import { razorpayClient } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { items?: { productId?: unknown; quantity?: unknown }[] };
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return Response.json({ error: "Your cart is empty." }, { status: 400 });

    const products = await getLiveProducts();
    if (!products) return Response.json({ error: "Live product pricing is unavailable. Please try again shortly." }, { status: 503 });

    let totalAmount = 0;
    for (const item of items) {
      const productId = typeof item.productId === "string" ? item.productId : "";
      const quantity = Number(item.quantity);
      if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        return Response.json({ error: "Invalid cart item." }, { status: 400 });
      }
      const product = products.find((p) => p.productId === productId);
      if (!product) return Response.json({ error: "A product in your cart is no longer available." }, { status: 404 });
      if (product.stock < quantity) return Response.json({ error: `${product.name} has only ${product.stock} left in stock.` }, { status: 400 });
      totalAmount += product.price * quantity;
    }

    const order = await razorpayClient().orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `cy-${Date.now()}`.slice(0, 40),
      notes: { items: JSON.stringify(items.map((i) => ({ productId: String(i.productId), quantity: Number(i.quantity) }))) },
    });
    return Response.json({ id: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error("Razorpay order creation failed", error);
    return Response.json({ error: "Payments are not available right now. Please try again later." }, { status: 503 });
  }
}
