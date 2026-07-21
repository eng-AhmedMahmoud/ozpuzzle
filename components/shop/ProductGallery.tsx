"use client";

import { useState } from "react";
import PieceIcon from "../PieceIcon";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="grid aspect-square place-items-center rounded-2xl bg-cream ring-1 ring-ink/10">
        <PieceIcon className="h-24 w-24 text-ink/15" />
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-cream ring-1 ring-ink/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={title}
          className="aspect-square w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={`h-18 w-18 shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${
                i === active
                  ? "ring-terra"
                  : "ring-ink/10 opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
