"use client";

import { useCart } from "../cart/CartContext";
import type { ShopifyProduct } from "@/lib/shopify";

/** One-click add for single-variant products; multi-variant links to the PDP. */
export default function QuickAdd({ product }: { product: ShopifyProduct }) {
  const { add } = useCart();
  const single = product.variants.length === 1 ? product.variants[0] : null;

  if (!product.available) {
    return (
      <span className="rounded-full border-2 border-ink/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cocoa/60">
        Sold out
      </span>
    );
  }

  if (!single) {
    return (
      <span className="rounded-full border-2 border-ink/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors group-hover:border-terra group-hover:text-terra">
        Choose options
      </span>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add({
          variantId: single.id,
          handle: product.handle,
          title: product.title,
          variantTitle: single.title,
          price: single.price,
          image: product.images[0],
        });
      }}
      className="rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-wide text-paper transition-colors hover:bg-terra"
    >
      Add to box
    </button>
  );
}
