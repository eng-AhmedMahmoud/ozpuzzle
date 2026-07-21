"use client";

import { useState } from "react";
import { useCart } from "../cart/CartContext";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";

export default function ProductForm({ product }: { product: ShopifyProduct }) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState(
    (product.variants.find((v) => v.available) ?? product.variants[0])?.id
  );
  const [qty, setQty] = useState(1);

  const variant = product.variants.find((v) => v.id === variantId);
  const hasChoices =
    product.variants.length > 1 ||
    (product.variants[0] && product.variants[0].title !== "Default Title");

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <p className="font-display text-3xl font-black">
          {variant ? formatPrice(variant.price) : formatPrice(product.minPrice)}{" "}
          <span className="text-lg font-semibold text-cocoa">EGP</span>
        </p>
        {variant?.compareAt && (
          <p className="text-lg text-cocoa/50 line-through">
            {formatPrice(variant.compareAt)}
          </p>
        )}
      </div>

      {hasChoices && (
        <fieldset className="mt-6">
          <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa">
            Options
          </legend>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={!v.available}
                onClick={() => setVariantId(v.id)}
                className={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-colors ${
                  v.id === variantId
                    ? "border-terra bg-terra text-paper"
                    : v.available
                      ? "border-ink/15 hover:border-terra hover:text-terra"
                      : "border-ink/10 text-cocoa/40 line-through"
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border-2 border-ink/15">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-3 font-bold hover:text-terra"
          >
            −
          </button>
          <span className="min-w-8 text-center font-semibold">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="px-4 py-3 font-bold hover:text-terra"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={!variant?.available}
          onClick={() =>
            variant &&
            add(
              {
                variantId: variant.id,
                handle: product.handle,
                title: product.title,
                variantTitle: variant.title,
                price: variant.price,
                image: product.images[0],
              },
              qty
            )
          }
          className="flex-1 rounded-full bg-terra px-8 py-4 font-semibold text-paper shadow-[0_14px_30px_-10px_rgba(228,87,46,0.65)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-ink/20 disabled:shadow-none"
        >
          {variant?.available ? "Add to box" : "Sold out"}
        </button>
      </div>
    </div>
  );
}
