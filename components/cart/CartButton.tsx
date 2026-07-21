"use client";

import { useCart } from "./CartContext";

export default function CartButton() {
  const { count, setOpen } = useCart();

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${count} items`}
      className="relative grid h-11 w-11 place-items-center rounded-full border-2 border-ink/15 text-ink transition-colors hover:border-terra hover:text-terra"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 7h12l1.5 13.5a1 1 0 0 1-1 1.1H5.5a1 1 0 0 1-1-1.1L6 7Z" />
        <path d="M9 10V6a3 3 0 0 1 6 0v4" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-terra px-1 text-[11px] font-bold text-paper">
          {count}
        </span>
      )}
    </button>
  );
}
