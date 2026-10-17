import { mockProducts } from "@/data/mock-products";
import type { Category, Origin, Product, Order } from "@/types/product";

const categories: Category[] = ["baby", "women", "men", "other"];
const origins: Origin[] = ["korea", "india", "usa", "china"];

function getApiUrl() {
  return process.env.GOOGLE_APPS_SCRIPT_URL ?? process.env.APPS_SCRIPT_URL ?? "";
}

function getApiKey() {
  return process.env.GOOGLE_APPS_SCRIPT_KEY ?? process.env.APPS_SCRIPT_KEY ?? "";
}

function readField(row: Record<string, unknown>, ...names: string[]) {
  const fields = new Map(Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/[^a-z0-9]/g, ""), value]));
  for (const name of names) {
    const value = fields.get(name.toLowerCase().replace(/[^a-z0-9]/g, ""));
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return undefined;
}

function normalizeImage(value: unknown) {
  const image = String(value ?? "").trim();
  if (!image) return "";
  if (/^https?:\/\/drive\.google\.com\/(?:file\/d\/|open\?)/i.test(image)) {
    const id = image.match(/\/file\/d\/([^/?]+)/i)?.[1] ?? new URL(image).searchParams.get("id");
    if (id) return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`;
  }
  return image;
}

function normalizeCategory(value: unknown): Category | undefined {
  const raw = String(value ?? "").trim().toLowerCase().replace(/['\u2019]s?$/, "");
  if (raw === "other" || raw === "unisex" || raw === "body" || raw === "mist") return "other";
  return categories.includes(raw as Category) ? (raw as Category) : undefined;
}

function normalizeOrigin(value: unknown): Origin | undefined {
  const raw = String(value ?? "").trim().toLowerCase();
  return origins.includes(raw as Origin) ? (raw as Origin) : undefined;
}

export function normalizeProducts(input: unknown): Product[] {
  const rows = Array.isArray(input) ? input : (input && typeof input === "object" && Array.isArray((input as { products?: unknown }).products) ? (input as { products: unknown[] }).products : []);
  return rows.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const p = row as Record<string, unknown>;
    const category = normalizeCategory(readField(p, "category"));
    const origin = normalizeOrigin(readField(p, "origin", "country"));
    const productId = String(readField(p, "productId", "id", "sku", "productid") ?? "").trim();
    const name = String(readField(p, "name", "productName", "title", "productname") ?? "").trim();
    const rawPrice = String(readField(p, "price", "amount", "yourPriceOptional", "priceInr", "priceinr") ?? "").replace(/[^\d.-]/g, "");
    const price = Number(rawPrice);
    const image = normalizeImage(readField(p, "image", "imageUrl", "photo", "photoUrl", "imageurl"));
    const stock = Number(readField(p, "stock", "quantity", "inventory") ?? 0);
    const brand = String(readField(p, "brand") ?? "").trim() || undefined;
    const size = String(readField(p, "size") ?? "").trim() || undefined;
    const note = String(readField(p, "note", "description", "whypicked", "whyPicked") ?? "").trim() || undefined;
    if (!productId || !name || !Number.isFinite(price) || price < 0 || !category || !origin) return [];
    return [{ productId, name, price, image, category, origin, stock: Number.isFinite(stock) ? stock : 0, brand, size, note }];
  });
}

async function fetchFromAppsScript(): Promise<Product[] | null> {
  const url = getApiUrl();
  const key = getApiKey();
  if (!url || !key) return null;
  try {
    const endpoint = new URL(url);
    endpoint.searchParams.set("action", "products");
    endpoint.searchParams.set("key", key);
    const response = await fetch(endpoint, { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) {
      console.error(`Apps Script products request failed with status ${response.status}.`);
      return null;
    }
    const data = await response.json() as { error?: string; products?: unknown };
    if (data.error) {
      console.error(`Apps Script products error: ${data.error}`);
      return null;
    }
    const products = normalizeProducts(data.products ?? data);
    if (!products.length) return null;
    return products;
  } catch (error) {
    console.error("Apps Script products unavailable.", error);
    return null;
  }
}

async function fetchPricesFromSheet(): Promise<Map<string, number>> {
  const prices = new Map<string, number>();
  try {
    const sheetId = "14gF4A7erFoWx118S6sxdrTqoL5yCUcdccO06lqGnupk";
    const response = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) return prices;
    const text = await response.text();
    const json = text.replace(/^\/\*O_o\*\/\n/, "").replace(/google\.visualization\.Query\.setResponse\(/, "").replace(/\);?\s*$/, "");
    const data = JSON.parse(json);
    const cols = data.table.cols.map((c: { label: string }) => c.label);
    const pidIdx = cols.findIndex((l: string) => /product\s*id/i.test(l));
    const priceIdx = cols.findIndex((l: string) => /price/i.test(l));
    if (pidIdx === -1 || priceIdx === -1) return prices;
    for (const row of data.table.rows) {
      const pid = row.c[pidIdx]?.v;
      const price = row.c[priceIdx]?.v;
      if (pid && typeof price === "number") prices.set(String(pid), price);
    }
  } catch (error) {
    console.error("Could not fetch prices from sheet.", error);
  }
  return prices;
}

export async function getLiveProducts(): Promise<Product[] | null> {
  const products = await fetchFromAppsScript();
  if (!products) return null;
  const needsPrices = products.some((p) => p.price === 0);
  if (needsPrices) {
    const prices = await fetchPricesFromSheet();
    if (prices.size) {
      return products.map((p) => prices.has(p.productId) ? { ...p, price: prices.get(p.productId)! } : p);
    }
  }
  return products;
}

export async function getProducts(): Promise<Product[]> {
  return (await getLiveProducts()) ?? mockProducts;
}

export async function getOrders(): Promise<Order[]> {
  const url = getApiUrl();
  const key = getApiKey();
  if (!url || !key) return [];
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "orderHistory", key }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return [];
    const data = await response.json() as { error?: string; orders?: Order[]; history?: Order[] };
    if (data.error) {
      console.error(`Apps Script orderHistory error: ${data.error}`);
      return [];
    }
    return data.orders ?? data.history ?? [];
  } catch (error) {
    console.error("Apps Script orderHistory unavailable.", error);
    return [];
  }
}

export function getCountryName(origin: string) {
  return ({ korea: "Korea", india: "India", usa: "USA", china: "China" } as Record<string, string>)[origin] ?? origin;
}
