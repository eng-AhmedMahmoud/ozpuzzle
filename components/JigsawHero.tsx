"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "motion/react";
import { jigsawPieces } from "@/lib/jigsaw";
import { heroImages } from "@/lib/data";

const W = 1200;
const H = 900;
// Deterministic seed → identical paths on server and client (no hydration mismatch).
const PIECES = jigsawPieces({ cols: 6, rows: 4, width: W, height: H, seed: 11 });

const OUT_EASE: [number, number, number, number] = [0.55, 0.06, 0.68, 0.19];
const IN_EASE: [number, number, number, number] = [0.34, 1.4, 0.64, 1];

/**
 * Hero jigsaw board. Homage to PointC's "SVG <pattern> jigsaw puzzle gallery"
 * (codepen.io/PointC/pen/PLMmQe): every piece is a path filled with a shared
 * userSpaceOnUse pattern, and image swaps happen piece-by-piece with a
 * center-out stagger.
 */
export default function JigsawHero() {
  const svgRef = useRef<SVGSVGElement>(null);
  const imgRefs = useRef<(SVGImageElement | null)[]>([]);
  const activeRef = useRef(0);
  const busyRef = useRef(false);
  const [active, setActive] = useState(0);

  const pathEls = () =>
    svgRef.current?.querySelectorAll<SVGPathElement>(".jig") ?? [];

  const swap = async (next: number) => {
    if (busyRef.current || next === activeRef.current) return;
    busyRef.current = true;
    const paths = pathEls();
    await animate(
      paths,
      { scale: 0, opacity: 0 },
      { duration: 0.4, ease: OUT_EASE, delay: stagger(0.016, { from: "center" }) }
    );
    imgRefs.current.forEach((img, i) => {
      if (img) img.style.opacity = i === next ? "1" : "0";
    });
    activeRef.current = next;
    setActive(next);
    await animate(
      paths,
      { scale: 1, opacity: 1 },
      { duration: 0.5, ease: IN_EASE, delay: stagger(0.016, { from: "center" }) }
    );
    busyRef.current = false;
  };

  // Assemble on mount, then auto-cycle.
  useEffect(() => {
    const paths = pathEls();
    animate(
      paths,
      { scale: [0, 1], opacity: [0, 1] },
      { duration: 0.6, ease: IN_EASE, delay: stagger(0.03, { from: "center" }) }
    );
    const id = setInterval(() => {
      swap((activeRef.current + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      <div className="rotate-[-1.5deg] rounded-2xl bg-cream p-3 shadow-[0_30px_60px_-20px_rgba(43,26,16,0.35)] ring-1 ring-ink/10 sm:p-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full rounded-lg"
          role="img"
          aria-label={`OZ Puzzle — ${heroImages[active].label}`}
        >
          <defs>
            <pattern
              id="ozhero"
              patternUnits="userSpaceOnUse"
              width={W}
              height={H}
            >
              <rect width={W} height={H} fill="#f7e6c6" />
              {heroImages.map((img, i) => (
                <image
                  key={img.src}
                  ref={(el) => {
                    imgRefs.current[i] = el;
                  }}
                  href={img.src}
                  width={W}
                  height={H}
                  preserveAspectRatio="xMidYMid slice"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                />
              ))}
            </pattern>
          </defs>
          {PIECES.map((d) => (
            <path
              key={d}
              d={d}
              className="jig"
              fill="url(#ozhero)"
              stroke="#2b1a10"
              strokeOpacity={0.45}
              strokeWidth={2.5}
              opacity={0}
            />
          ))}
        </svg>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        {heroImages.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => swap(i)}
            aria-label={`Show ${img.label}`}
            className={`h-12 w-12 overflow-hidden rounded-lg ring-2 transition-all duration-300 sm:h-14 sm:w-14 ${
              i === active
                ? "ring-terra scale-110 shadow-[0_8px_20px_-6px_rgba(228,87,46,0.5)]"
                : "ring-ink/15 opacity-60 hover:opacity-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
