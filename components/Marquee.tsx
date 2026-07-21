import PieceIcon from "./PieceIcon";

const words = [
  "Wooden",
  "Handcrafted",
  "Customized",
  "Whimsy pieces",
  "Gift-ready",
  "Made in Egypt",
];

function Strip() {
  return (
    <>
      {words.map((w) => (
        <span key={w} className="flex shrink-0 items-center gap-6 pr-6">
          <span className="font-display text-2xl font-bold italic sm:text-3xl">
            {w}
          </span>
          <PieceIcon className="h-6 w-6 text-sun" />
        </span>
      ))}
    </>
  );
}

export default function Marquee() {
  return (
    <div className="rotate-[-1deg] border-y-2 border-ink bg-ink py-4 text-paper">
      <div className="flex overflow-hidden">
        <div className="animate-marquee flex shrink-0">
          <Strip />
          <Strip />
        </div>
      </div>
    </div>
  );
}
