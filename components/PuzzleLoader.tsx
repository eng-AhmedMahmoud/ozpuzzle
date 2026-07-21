import { jigsawPieces } from "@/lib/jigsaw";

/* Same seed as the gallery quadrants — the brand's signature 2×2 cut. */
const PIECES = jigsawPieces({ cols: 2, rows: 2, width: 100, height: 100, seed: 5 });

const FILLS = ["#e4572e", "#17786b", "#f2a93b", "#45301f"];

export default function PuzzleLoader({ label = "Piecing it together" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-6" role="status" aria-live="polite">
      <svg viewBox="-14 -14 128 128" className="pl-svg h-24 w-24" aria-hidden>
        {PIECES.map((d, i) => (
          <path
            key={d}
            d={d}
            fill={FILLS[i % FILLS.length]}
            stroke="#fff3e0"
            strokeWidth={1.5}
            className={`pl-piece pl-p${i}`}
          />
        ))}
      </svg>
      <p className="pl-label font-display text-lg font-bold italic text-cocoa">
        {label}
      </p>
      <span className="sr-only">Loading</span>
    </div>
  );
}
