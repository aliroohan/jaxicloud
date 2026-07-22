import Link from "next/link";
import { getCategories, getPublishedBundles, getPublishedProducts, getSolutions } from "@/lib/queries";
import { ProductCard } from "@/components/public/ProductCard";

export const revalidate = 3600;

export default async function HomePage() {
  const [products, categories, bundles, solutions] = await Promise.all([
    getPublishedProducts(),
    getCategories(),
    getPublishedBundles(),
    getSolutions(),
  ]);

  const featured = products.slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(105deg, rgba(11,28,44,0.92) 0%, rgba(11,28,44,0.72) 45%, rgba(14,116,144,0.45) 100%), url('https://images.unsplash.com/photo-1544620341-1ada2ff8c6ef?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6">
          <p className="font-display text-4xl text-white sm:text-6xl md:text-7xl">
            Jaxicloud
          </p>
          <h1 className="mt-3 max-w-2xl text-2xl font-medium leading-tight text-cyan-50 sm:text-3xl">
            Fleet hardware that works as one system
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-200 sm:text-lg">
            Cameras, trackers, tablets, and sensors — curated for commercial
            fleets. Browse the catalog and request a quote. No checkout.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-dark"
            >
              Browse products
            </Link>
            <Link
              href="/solutions"
              className="rounded-md border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              Explore solutions
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-navy">Featured products</h2>
            <p className="mt-2 text-muted">
              Published catalog items ready for quote requests.
            </p>
          </div>
          <Link href="/products" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="rounded-xl border border-border bg-background p-5 transition hover:border-accent"
            >
              <h3 className="font-display text-xl text-navy">{cat.name}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl text-navy">Solutions by industry</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Pre-mapped product sets for transit, logistics, and school transport.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {solutions.map((s) => (
            <Link
              key={s.id}
              href={`/solutions/${s.slug}`}
              className="rounded-xl border border-border bg-card p-6 transition hover:shadow-md"
            >
              <h3 className="font-display text-2xl text-navy">{s.name}</h3>
              <p className="mt-3 text-sm text-muted">{s.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-navy">Bundles</h2>
          <Link href="/bundles" className="text-sm font-medium text-accent hover:underline">
            All bundles
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {bundles.map((b) => (
            <Link
              key={b.id}
              href={`/bundles/${b.slug}`}
              className="overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-md"
            >
              {b.images?.[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.images[0].url}
                  alt={b.images[0].alt || b.name}
                  className="h-48 w-full object-cover"
                />
              ) : null}
              <div className="p-5">
                <h3 className="font-display text-xl text-navy">{b.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {b.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
