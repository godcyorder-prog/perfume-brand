import { cookies } from "next/headers";
import type { CartItem } from "@/types/product";

const CART_COOKIE = "coyilo_cart";

export async function getCartItems(): Promise<CartItem[]> {
  try {
    const store = await cookies();
    const raw = store.get(CART_COOKIE)?.value;
    if (!raw) return [];
    const parsed = JSON.parse(decodeURIComponent(raw));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
