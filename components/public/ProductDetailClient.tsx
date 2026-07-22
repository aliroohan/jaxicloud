"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

export function ProductDetailClient({ product }: { product: Product }) {
  const images = product.images?.length
    ? product.images
    : [{ url: "", alt: product.name }];
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];

  return (
    <div>
      <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-slate-100">
        {current?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.url}
            alt={current.alt || product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            No image
          </div>
        )}
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={`${img.url}-${idx}`}
              type="button"
              onClick={() => setActive(idx)}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-md border ${
                idx === active ? "border-accent" : "border-border"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || ""}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
