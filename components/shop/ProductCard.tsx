import Link from "next/link";
import Image from "next/image";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import PieceIcon from "../PieceIcon";
import QuickAdd from "./QuickAdd";

export default function ProductCard({
  product,
  tilt = 0,
}: {
  product: ShopifyProduct;
  tilt?: number;
}) {
  const onSale = product.compareAt !== null;
  const ranged = product.minPrice !== product.maxPrice;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div
        className="relative aspect-square overflow-hidden rounded-2xl bg-cream ring-1 ring-ink/10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-0"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <PieceIcon className="absolute inset-0 m-auto h-20 w-20 text-ink/15" />
        )}
        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-terra px-3 py-1 text-xs font-bold uppercase tracking-wide text-paper">
            Sale
          </span>
        )}
        {!product.available && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-paper">
            Sold out
          </span>
        )}
        <div className="absolute inset-x-3 bottom-3 flex justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <QuickAdd product={product} />
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold leading-tight">
            {product.title}
          </h3>
          {product.productType && (
            <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-cocoa/60">
              {product.productType}
            </p>
          )}
        </div>
        <p className="shrink-0 text-right text-sm">
          {ranged && <span className="text-cocoa/60">From </span>}
          <span className="font-semibold">{formatPrice(product.minPrice)}</span>
          {onSale && product.compareAt && (
            <span className="ml-1.5 text-cocoa/50 line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
