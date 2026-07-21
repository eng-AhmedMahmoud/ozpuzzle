import PieceIcon from "./PieceIcon";
import { INSTAGRAM_URL, SHOP_URL } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-ink pb-10 pt-20 text-paper">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-10">
          <div>
            <p className="font-display text-[clamp(3.5rem,10vw,8rem)] font-black leading-none tracking-tight">
              OZ&nbsp;Puzzle
            </p>
            <p className="mt-4 max-w-sm text-paper/60">
              Handcrafted wooden jigsaw puzzles, made in Egypt with pieces of
              wonder.
            </p>
          </div>
          <nav className="flex flex-col gap-3 text-paper/80">
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-sun"
            >
              Shop — ozpuzzle.com ↗
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-sun"
            >
              Instagram — @ozpuzzle ↗
            </a>
            <a href="#collections" className="transition-colors hover:text-sun">
              Collections
            </a>
            <a href="#custom" className="transition-colors hover:text-sun">
              Custom puzzles
            </a>
          </nav>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-6 text-sm text-paper/50">
          <p className="flex items-center gap-2">
            <PieceIcon className="h-4 w-4 text-terra" />
            &copy; {new Date().getFullYear()} OZ Puzzle. Every piece matters.
          </p>
          <p>Wooden puzzles · Dollhouses · Guest books · Custom photos</p>
        </div>
      </div>
    </footer>
  );
}
