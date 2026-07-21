import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import PieceIcon from "./PieceIcon";

const steps = [
  {
    n: "01",
    title: "Send a photo",
    body: "A wedding, a grandparent, a cat mid-yawn — any picture you love.",
  },
  {
    n: "02",
    title: "We cut it in wood",
    body: "Laser-cut birch with whimsy pieces hidden in the mix.",
  },
  {
    n: "03",
    title: "You piece it back",
    body: "An evening (or three) of slow, satisfying assembly.",
  },
];

export default function CustomCta() {
  return (
    <section id="custom" className="bg-teal py-24 text-paper">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="rotate-[2deg] overflow-hidden rounded-2xl ring-4 ring-paper/20">
              <Image
                src="https://ozpuzzle.com/cdn/shop/files/WoodenPuzzle8.jpg?v=1778574686&width=1100"
                alt="Customized wooden photo puzzle"
                width={1100}
                height={825}
                unoptimized
                className="h-auto w-full object-cover"
              />
            </div>
            <PieceIcon
              className="animate-bob absolute -right-6 -top-8 h-24 w-24 text-sun"
              style={{ "--bob-rot": "14deg" } as React.CSSProperties}
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sun">
              Customized puzzle
            </p>
            <h2 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-5xl">
              Your photo,
              <br />
              <span className="italic text-sun">300 hand-cut pieces.</span>
            </h2>
          </Reveal>

          <div className="mt-10 space-y-7">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={0.1 + i * 0.08}>
                <div className="flex gap-5">
                  <span className="font-display text-3xl font-black text-paper/40">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold">{s.title}</h3>
                    <p className="mt-1 max-w-sm text-sm leading-relaxed text-paper/70">
                      {s.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.35}>
            <Link
              href="/shop?c=customized-puzzle"
              className="mt-10 inline-block rounded-full bg-paper px-8 py-4 font-semibold text-teal transition-transform hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.4)]"
            >
              Start your custom puzzle
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
