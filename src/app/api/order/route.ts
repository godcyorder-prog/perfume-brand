import { createHmac, timingSafeEqual } from "node:crypto";
import { getLiveProducts } from "@/lib/products";
import { razorpayClient } from "@/lib/razorpay";
import type { Customer } from "@/types/product";

type Payload = Customer & {
  items?: { productId?: unknown; quantity?: unknown }[];
  razorpay_order_id?: unknown;
  razorpay_payment_id?: unknown;
  razorpay_signature?: unknown;
};

function validCustomer(body: Payload): body is Payload & Required<Customer> {
  return typeof body.customerName === "string" && body.customerName.trim().length >= 2
    && typeof body.customerPhone === "string" && /^[0-9+() -]{8,16}$/.test(body.customerPhone)
    && typeof body.customerEmail === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customerEmail)
    && typeof body.country === "string" && body.country.trim().length > 0
    && typeof body.state === "string" && body.state.trim().length > 0
    && typeof body.address === "string" && body.address.trim().length >= 8;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Payload;
    const items = Array.isArray(body.items) ? body.items : [];
    const orderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id : "";
    const paymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
    const signature = typeof body.razorpay_signature === "string" ? body.razorpay_signature : "";

    if (!items.length || !orderId || !paymentId || !signature || !validCustomer(body)) {
      return Response.json({ error: "Please check your order and delivery details." }, { status: 400 });
    }

    const products = await getLiveProducts();
    if (!products) return Response.json({ error: "Live product pricing is unavailable. Contact Coyilo support before retrying payment." }, { status: 503 });

    const client = razorpayClient();
    const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(`${orderId}|${paymentId}`).digest();
    const given = Buffer.from(signature, "hex");
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
      return Response.json({ error: "Payment signature could not be verified." }, { status: 400 });
    }

    const order = await client.orders.fetch(orderId);
    let totalAmount = 0;
    for (const item of items) {
      const productId = typeof item.productId === "string" ? item.productId : "";
      const quantity = Number(item.quantity);
      const product = products.find((p) => p.productId === productId);
      if (!product) return Response.json({ error: "A product in your order is no longer available." }, { status: 404 });
      if (product.stock < quantity) return Response.json({ error: `${product.name} is out of stock.` }, { status: 400 });
      totalAmount += product.price * quantity;
    }
    const amount = Math.round(totalAmount * 100);
    if (order.amount !== amount || order.currency !== "INR") {
      return Response.json({ error: "The payment amount does not match this order." }, { status: 400 });
    }

    const payment = await client.payments.fetch(paymentId);
    if (payment.order_id !== orderId || payment.status !== "captured") {
      return Response.json({ error: "This payment has not been captured." }, { status: 400 });
    }

    const appsUrl = process.env.GOOGLE_APPS_SCRIPT_URL ?? process.env.APPS_SCRIPT_URL;
    const key = process.env.GOOGLE_APPS_SCRIPT_KEY ?? process.env.APPS_SCRIPT_KEY;
    if (!appsUrl || !key) {
      return Response.json({ error: "Payment received, but order recording is not configured. Contact Coyilo support with payment ID " + paymentId + "." }, { status: 503 });
    }

    let lastOrderId = "";
    for (const item of items) {
      const productId = typeof item.productId === "string" ? item.productId : "";
      const quantity = Number(item.quantity);
      const response = await fetch(appsUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          key,
          productId,
          quantity,
          customerName: body.customerName.trim(),
          customerPhone: body.customerPhone.trim(),
          customerEmail: body.customerEmail.trim(),
          country: body.country.trim(),
          state: body.state.trim(),
          address: body.address.trim(),
          paymentId,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error(`Apps Script returned ${response.status}`);
      const result = await response.json() as { orderId?: unknown; id?: unknown; error?: unknown };
      if (result.error) throw new Error(String(result.error));
      const savedId = result.orderId ?? result.id;
      if (!savedId) throw new Error("Apps Script did not return an order ID");
      lastOrderId = String(savedId);
    }

    return Response.json({ orderId: lastOrderId });
  } catch (error) {
    console.error("Order confirmation failed", error);
    return Response.json({ error: "We could not finish recording your order. Keep your payment ID and contact Coyilo support." }, { status: 503 });
  }
}
