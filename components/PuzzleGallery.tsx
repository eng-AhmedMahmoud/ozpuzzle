import Reveal from "./Reveal";
import { jigsawPieces } from "@/lib/jigsaw";
import { galleryItems } from "@/lib/data";

/*
 * Hover-assemble puzzle cards. Homage to golle404's "Puzzle Grid Gallery"
 * (codepen.io/golle404/pen/qZZLLM): each card is one photo split into four
 * interlocking clip-path pieces that float apart in 3D and snap together
 * on hover — same 0.45s cubic-bezier(0.65,0.05,0.36,1) feel as the pen.
 */
const QUADS = jigsawPieces({ cols: 2, rows: 2, seed: 5 });

export default function PuzzleGallery() {
  return (
    <section id="gallery" className="bg-ink py-24 text-paper">
      {/* clip-path defs shared by every card (objectBoundingBox = unit space) */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          {QUADS.map((d, i) => (
            <clipPath key={d} id={`pzq${i}`} clipPathUnits="objectBoundingBox">
              <path d={d} />
            </clipPath>
          ))}
        </defs>
      </svg>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sun">
            The gallery
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-xl font-display text-4xl font-black tracking-tight sm:text-5xl">
              Hover to <span className="italic text-sun">snap it together.</span>
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-paper/60">
              Every OZ puzzle starts scattered and ends as a picture. These
              cards work the same way.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08}>
              <div className="pz-card" tabIndex={0}>
                <div
                  className="pz-scene"
                  style={{ "--img": `url("${item.image}")` } as React.CSSProperties}
                >
                  <div className="pz-piece" />
                  <div className="pz-piece" />
                  <div className="pz-piece" />
                  <div className="pz-piece" />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="font-display text-xl font-bold">{item.title}</h3>
                  <p className="text-xs uppercase tracking-[0.16em] text-paper/50">
                    {item.note}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
