"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCart } from "./CartContext";
import { checkoutUrl, formatPrice } from "@/lib/shopify";
import PieceIcon from "../PieceIcon";

export default function CartDrawer() {
  const { items, subtotal, open, setOpen, setQty, remove } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close cart"
            className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col bg-paper shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b-2 border-ink/10 px-6 py-5">
              <h2 className="flex items-center gap-2 font-display text-2xl font-black">
                <PieceIcon className="h-6 w-6 text-terra" />
                Your box
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink/15 text-lg transition-colors hover:border-terra hover:text-terra"
              >
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <PieceIcon className="h-16 w-16 text-ink/15" />
                <p className="font-display text-xl font-bold">
                  Not a single piece yet.
                </p>
                <p className="text-sm text-cocoa">
                  Find a puzzle worth an evening.
                </p>
                <a
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-terra px-6 py-3 text-sm font-semibold text-paper"
                >
                  Browse the shop
                </a>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
                  {items.map((item) => (
                    <li key={item.variantId} className="flex gap-4 py-5">
                      <a
                        href={`/products/${item.handle}`}
                        onClick={() => setOpen(false)}
                        className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream ring-1 ring-ink/10"
                      >
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <PieceIcon className="m-auto mt-4 h-10 w-10 text-ink/20" />
                        )}
                      </a>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="truncate font-display font-bold">
                          {item.title}
                        </p>
                        {item.variantTitle !== "Default Title" && (
                          <p className="text-xs text-cocoa">{item.variantTitle}</p>
                        )}
                        <p className="mt-1 text-sm font-semibold">
                          {formatPrice(item.price)} EGP
                        </p>
                        <div className="mt-auto flex items-center gap-3">
                          <div className="flex items-center rounded-full border-2 border-ink/15">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() => setQty(item.variantId, item.qty - 1)}
                              className="px-2.5 py-0.5 font-bold hover:text-terra"
                            >
                              −
                            </button>
                            <span className="min-w-6 text-center text-sm font-semibold">
                              {item.qty}
                            </span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() => setQty(item.variantId, item.qty + 1)}
                              className="px-2.5 py-0.5 font-bold hover:text-terra"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => remove(item.variantId)}
                            className="text-xs text-cocoa/70 underline underline-offset-2 hover:text-terra"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t-2 border-ink/10 px-6 py-5">
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="text-sm uppercase tracking-[0.16em] text-cocoa">
                      Subtotal
                    </span>
                    <span className="font-display text-2xl font-black">
                      {formatPrice(subtotal)} EGP
                    </span>
                  </div>
                  <a
                    href={checkoutUrl(items)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-full bg-terra py-4 text-center font-semibold text-paper shadow-[0_14px_30px_-10px_rgba(228,87,46,0.65)] transition-transform hover:-translate-y-0.5"
                  >
                    Checkout · {formatPrice(subtotal)} EGP
                  </a>
                  <p className="mt-3 text-center text-xs text-cocoa/70">
                    Secure checkout completes on ozpuzzle.com — your pieces carry
                    over automatically.
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
