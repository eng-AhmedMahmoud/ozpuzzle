import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/shop/ProductCard";
import PieceIcon from "@/components/PieceIcon";
import {
  getCollectionProducts,
  getCollections,
  getProducts,
} from "@/lib/shopify";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Shop — OZ Puzzle",
  description:
    "Every wooden puzzle, dollhouse, guest book and acrylic piece OZ Puzzle makes — live prices, straight from the workshop.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const [collections, products] = await Promise.all([
    getCollections(),
    c ? getCollectionProducts(c) : getProducts(),
  ]);
  const activeCollection = collections.find((col) => col.handle === c);

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8 sm:pt-36">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal">
          The whole workshop
        </p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-6xl">
          {activeCollection ? (
            <>
              <span className="italic text-terra">{activeCollection.title}</span>
            </>
          ) : (
            <>
              Every piece <span className="italic text-terra">we make.</span>
            </>
          )}
        </h1>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link
            href="/shop"
            className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
              !c
                ? "border-ink bg-ink text-paper"
                : "border-ink/15 hover:border-terra hover:text-terra"
            }`}
          >
            All
          </Link>
          {collections.map((col) => (
            <Link
              key={col.handle}
              href={`/shop?c=${col.handle}`}
              className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                c === col.handle
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 hover:border-terra hover:text-terra"
              }`}
            >
              {col.title}
              <span className="ml-1.5 text-xs opacity-60">{col.count}</span>
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="mt-20 flex flex-col items-center gap-4 text-center">
            <PieceIcon className="h-16 w-16 text-ink/15" />
            <p className="font-display text-2xl font-bold">
              No pieces here right now.
            </p>
            <p className="text-cocoa">
              The workshop may be catching its breath — try another shelf.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} tilt={i % 2 ? 1 : -1} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
