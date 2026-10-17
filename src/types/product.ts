export type Category = "baby" | "women" | "men" | "other";
export type Origin = "korea" | "india" | "usa" | "china";
export type Product = { productId: string; name: string; price: number; image: string; category: Category; origin: Origin; note?: string; stock: number; brand?: string; size?: string };
export type CartItem = Product & { quantity: number };
export type Customer = { customerName: string; customerPhone: string; customerEmail: string; country: string; state: string; address: string };
export type OrderItem = { productId: string; productName: string; quantity: number; price: number };
export type Order = { orderId: string; date: string; customerName: string; customerPhone: string; customerEmail: string; items: OrderItem[]; total: number; status: string; paymentStatus?: string; address?: string };
