import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getPublishedProducts } from "@/lib/queries";
import { ProductCard } from "@/components/public/ProductCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Products",
  description: "Browse Jaxicloud fleet cameras, trackers, tablets, and sensors.",
};

type Props = {
  searchParams: Promise<{ category?: string; tag?: string; q?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getPublishedProducts({
      categorySlug: params.category,
      tag: params.tag,
      q: params.q,
    }),
    getCategories(),
  ]);

  const tags = Array.from(
    new Set(products.flatMap((p) => p.tags || [])),
  ).slice(0, 12);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl text-navy">Products</h1>
      <p className="mt-2 text-muted">
        Filter by category or tag. Request a quote from any product page.
      </p>

      <form className="mt-8 flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={params.q || ""}
          placeholder="Search products…"
          className="min-w-[200px] flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm"
        />
        <select
          name="category"
          defaultValue={params.category || ""}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
        >
          Filter
        </button>
      </form>

      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/products${params.category ? `?category=${params.category}` : ""}`}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              !params.tag ? "bg-accent text-white" : "bg-slate-100 text-steel"
            }`}
          >
            All tags
          </Link>
          {tags.map((tag) => {
            const qs = new URLSearchParams();
            if (params.category) qs.set("category", params.category);
            qs.set("tag", tag);
            return (
              <Link
                key={tag}
                href={`/products?${qs.toString()}`}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  params.tag === tag
                    ? "bg-accent text-white"
                    : "bg-slate-100 text-steel"
                }`}
              >
                {tag}
              </Link>
            );
          })}
        </div>
      ) : null}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 ? (
        <p className="mt-10 text-muted">No products match these filters.</p>
      ) : null}
    </div>
  );
}
