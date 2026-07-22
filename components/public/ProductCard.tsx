import Link from "next/link";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];
  const href = product.category
    ? `/products/${product.category.slug}/${product.slug}`
    : `/products`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={href} className="block aspect-[4/3] overflow-hidden bg-slate-100">
        {image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={image.alt || product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            No image
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.category ? (
          <p className="text-xs uppercase tracking-wide text-muted">
            {product.category.name}
          </p>
        ) : null}
        <h3 className="font-display text-lg leading-snug text-navy">
          <Link href={href} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        {product.tagline ? (
          <p className="line-clamp-2 text-sm text-muted">{product.tagline}</p>
        ) : null}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {product.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-steel"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
