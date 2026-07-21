"use client";

import { motion } from "motion/react";
import JigsawHero from "./JigsawHero";
import PieceIcon from "./PieceIcon";
import { SHOP_URL } from "@/lib/data";

const headline = ["Piece", "together", "something", "wonderful."];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      {/* floating decorative pieces */}
      <PieceIcon
        className="animate-bob absolute -left-8 top-40 h-28 w-28 text-sun/50"
        style={{ "--bob-rot": "-18deg" } as React.CSSProperties}
      />
      <PieceIcon
        className="animate-bob absolute right-[-2rem] top-24 h-36 w-36 text-teal/30"
        style={{ "--bob-rot": "24deg", animationDelay: "-2.5s" } as React.CSSProperties}
      />
      <PieceIcon
        className="animate-bob absolute bottom-10 left-[12%] hidden h-20 w-20 text-terra/25 lg:block"
        style={{ "--bob-rot": "40deg", animationDelay: "-4s" } as React.CSSProperties}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cocoa"
          >
            <PieceIcon className="h-4 w-4 text-terra" />
            Handcrafted wooden puzzles · Egypt
          </motion.p>

          <h1 className="font-display text-[clamp(3rem,8vw,5.8rem)] font-black leading-[0.98] tracking-tight">
            {headline.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 46, rotate: 2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  duration: 0.75,
                  delay: 0.12 + i * 0.11,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`inline-block pr-[0.24em] ${
                  word === "wonderful." ? "italic text-terra" : ""
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-md text-lg leading-relaxed text-cocoa"
          >
            Laser-cut birch, whimsy-shaped pieces and pictures worth a thousand
            evenings — from your own photos to our playful originals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-terra px-8 py-4 font-semibold text-paper shadow-[0_14px_30px_-10px_rgba(228,87,46,0.65)] transition-transform hover:-translate-y-0.5"
            >
              Shop the puzzles
            </a>
            <a
              href="#custom"
              className="rounded-full border-2 border-ink/20 px-8 py-4 font-semibold text-ink transition-colors hover:border-terra hover:text-terra"
            >
              Make yours custom
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <JigsawHero />
        </motion.div>
      </div>
    </section>
  );
}
