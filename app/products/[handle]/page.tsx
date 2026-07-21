import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductForm from "@/components/shop/ProductForm";
import ProductCard from "@/components/shop/ProductCard";
import PieceIcon from "@/components/PieceIcon";
import { getProduct, getProducts } from "@/lib/shopify";

export const revalidate = 1800;

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Not found — OZ Puzzle" };
  return {
    title: `${product.title} — OZ Puzzle`,
    description: product.descriptionHtml
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160),
    openGraph: product.images[0] ? { images: [{ url: product.images[0] }] } : undefined,
  };
}

const perks = [
  "Laser-cut wood, sanded smooth",
  "Gift-ready packaging",
  "Made in Egypt with care",
];

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const related = (await getProducts())
    .filter((p) => p.handle !== product.handle)
    .filter(
      (p) =>
        p.productType === product.productType ||
        p.tags.some((t) => product.tags.includes(t))
    )
    .slice(0, 4);

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <nav className="mb-8 text-sm text-cocoa" aria-label="Breadcrumb">
          <Link href="/shop" className="hover:text-terra">
            ← Back to the shop
          </Link>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} title={product.title} />

          <div>
            {product.productType && (
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cocoa">
                <PieceIcon className="h-4 w-4 text-terra" />
                {product.productType}
              </p>
            )}
            <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
              {product.title}
            </h1>

            <div className="mt-6">
              <ProductForm product={product} />
            </div>

            <ul className="mt-8 space-y-2.5 border-t-2 border-ink/10 pt-6">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-sm text-cocoa">
                  <PieceIcon className="h-4 w-4 shrink-0 text-teal" />
                  {perk}
                </li>
              ))}
            </ul>

            {product.descriptionHtml && (
              <div
                className="prose-oz mt-8 max-w-none text-cocoa"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display text-3xl font-black tracking-tight">
              Pieces <span className="italic text-terra">nearby.</span>
            </h2>
            <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} tilt={i % 2 ? 1 : -1} />
              ))}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
