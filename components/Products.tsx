import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { products } from "@/lib/data";

export default function Products() {
  return (
    <section id="shop" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal">
              Bestsellers
            </p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-black tracking-tight sm:text-5xl">
              Loved to <span className="italic text-terra">the last piece.</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="font-semibold text-terra underline decoration-2 underline-offset-4 transition-colors hover:text-ink"
          >
            Browse all 55+ puzzles →
          </Link>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
        {products.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <Link href={`/products/${p.slug}`} className="group block">
              <div
                className={`relative aspect-square overflow-hidden rounded-2xl bg-cream ring-1 ring-ink/10 transition-transform duration-500 group-hover:-translate-y-2 ${
                  i % 2 ? "rotate-[1.2deg]" : "rotate-[-1.2deg]"
                } group-hover:rotate-0`}
              >
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />
                {p.compareAt && (
                  <span className="absolute left-3 top-3 rounded-full bg-terra px-3 py-1 text-xs font-bold uppercase tracking-wide text-paper">
                    Sale
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{p.title}</h3>
              <p className="mt-1 text-sm text-cocoa">
                {p.fromPrice && <span className="text-cocoa/60">From </span>}
                <span className="font-semibold text-ink">{p.price} EGP</span>
                {p.compareAt && (
                  <span className="ml-2 text-cocoa/50 line-through">
                    {p.compareAt}
                  </span>
                )}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
