import Reveal from "./Reveal";
import { INSTAGRAM_URL } from "@/lib/data";

const facts = [
  { big: "Birch", small: "laser-cut wood, sanded smooth" },
  { big: "Whimsy", small: "surprise-shaped pieces in every box" },
  { big: "Gift-ready", small: "packed to be opened twice" },
];

export default function Story() {
  return (
    <section id="story" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal">
            The story
          </p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-5xl">
            Slow evenings,
            <br />
            <span className="italic text-terra">carved in wood.</span>
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-cocoa">
            OZ Puzzle began with a simple idea: screens off, hands busy, people
            around one table. Every puzzle is drawn, cut and packed with the
            kind of care you can feel in the click of a well-fitted piece —
            from playful originals to puzzles made of your own memories.
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-terra underline decoration-2 underline-offset-4 transition-colors hover:text-ink"
          >
            Follow the making on Instagram @ozpuzzle ↗
          </a>
        </Reveal>

        <div className="grid content-center gap-4">
          {facts.map((f, i) => (
            <Reveal key={f.big} delay={0.1 + i * 0.08}>
              <div className="flex items-baseline gap-4 rounded-2xl border-2 border-ink/10 bg-cream/60 px-6 py-5">
                <span className="font-display text-3xl font-black text-ink">
                  {f.big}
                </span>
                <span className="text-sm text-cocoa">{f.small}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
