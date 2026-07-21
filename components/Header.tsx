"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PieceIcon from "./PieceIcon";
import CartButton from "./cart/CartButton";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/#collections", label: "Collections" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#custom", label: "Custom" },
  { href: "/#story", label: "Story" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-paper/85 backdrop-blur-md shadow-[0_1px_0_0_rgba(43,26,16,0.12)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <PieceIcon className="h-8 w-8 text-terra transition-transform duration-500 group-hover:rotate-90" />
          <span className="font-display text-2xl font-black tracking-tight">
            OZ&nbsp;Puzzle
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-cocoa transition-colors hover:text-terra"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-all hover:bg-terra hover:shadow-[0_8px_24px_-8px_rgba(228,87,46,0.6)] sm:block"
          >
            Shop now
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
