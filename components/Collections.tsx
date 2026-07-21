import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { collections } from "@/lib/data";

/* Asymmetric editorial grid — first two cards larger, rest staggered. */
const spans = [
  "sm:col-span-3 sm:row-span-2",
  "sm:col-span-3",
  "sm:col-span-3",
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
];

export default function Collections() {
  return (
    <section id="collections" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal">
          The shelves
        </p>
        <h2 className="mt-3 max-w-xl font-display text-4xl font-black tracking-tight sm:text-5xl">
          Six worlds, <span className="italic text-terra">one table.</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-6 sm:[grid-auto-rows:220px]">
        {collections.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.06} className={spans[i]}>
            <Link
              href={`/shop?c=${c.slug}`}
              className="group relative block h-64 overflow-hidden rounded-2xl ring-1 ring-ink/10 sm:h-full"
            >
              <Image
                src={c.image}
                alt={c.title}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-2xl font-bold text-paper">
                  {c.title}
                </h3>
                <p className="mt-1 text-sm text-paper/75 opacity-0 transition-all duration-500 group-hover:opacity-100">
                  {c.tagline}
                </p>
              </div>
              <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-paper/90 text-ink opacity-0 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100">
                ↗
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
