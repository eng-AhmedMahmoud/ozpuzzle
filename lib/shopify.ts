/**
 * Storefront data layer backed by Shopify's public JSON endpoints on
 * ozpuzzle.com (no API token required):
 *   /products.json, /products/{handle}.json, /collections.json,
 *   /collections/{handle}/products.json
 *
 * Checkout is handed off to the real store via Shopify cart permalinks:
 *   https://ozpuzzle.com/cart/{variantId}:{qty},{variantId}:{qty}
 */

export const STORE_URL = "https://ozpuzzle.com";
const REVALIDATE = 1800; // 30 min — prices/stock stay fresh without hammering the store

export type ShopifyVariant = {
  id: number;
  title: string;
  price: number;
  compareAt: number | null;
  available: boolean;
};

export type ShopifyProduct = {
  id: number;
  handle: string;
  title: string;
  productType: string;
  tags: string[];
  descriptionHtml: string;
  images: string[];
  variants: ShopifyVariant[];
  minPrice: number;
  maxPrice: number;
  compareAt: number | null;
  available: boolean;
};

export type ShopifyCollection = {
  handle: string;
  title: string;
  count: number;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProduct(p: any): ShopifyProduct {
  const variants: ShopifyVariant[] = (p.variants ?? []).map((v: any) => ({
    id: v.id,
    title: v.title,
    price: parseFloat(v.price),
    compareAt: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
    available: v.available !== false,
  }));
  const prices = variants.map((v) => v.price);
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    productType: p.product_type ?? "",
    tags: p.tags ?? [],
    descriptionHtml: p.body_html ?? "",
    images: (p.images ?? []).map((i: any) => i.src).filter(Boolean),
    variants,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    compareAt: variants.find((v) => v.compareAt)?.compareAt ?? null,
    available: variants.some((v) => v.available),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function fetchJson(path: string): Promise<unknown | null> {
  try {
    const res = await fetch(`${STORE_URL}${path}`, {
      next: { revalidate: REVALIDATE },
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getProducts(): Promise<ShopifyProduct[]> {
  const data = (await fetchJson("/products.json?limit=250")) as {
    products?: unknown[];
  } | null;
  return (data?.products ?? []).map(mapProduct);
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = (await fetchJson(`/products/${handle}.json`)) as {
    product?: unknown;
  } | null;
  return data?.product ? mapProduct(data.product) : null;
}

export async function getCollections(): Promise<ShopifyCollection[]> {
  const data = (await fetchJson("/collections.json")) as {
    collections?: { handle: string; title: string; products_count: number }[];
  } | null;
  return (data?.collections ?? [])
    .map((c) => ({ handle: c.handle, title: c.title, count: c.products_count }))
    .filter((c) => c.count > 0);
}

export async function getCollectionProducts(
  handle: string
): Promise<ShopifyProduct[]> {
  const data = (await fetchJson(
    `/collections/${handle}/products.json?limit=250`
  )) as { products?: unknown[] } | null;
  return (data?.products ?? []).map(mapProduct);
}

export function formatPrice(n: number): string {
  return `LE ${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

export function checkoutUrl(items: { variantId: number; qty: number }[]): string {
  return `${STORE_URL}/cart/${items
    .map((i) => `${i.variantId}:${i.qty}`)
    .join(",")}`;
}
