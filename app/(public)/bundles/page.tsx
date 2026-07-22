import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedBundles } from "@/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Bundles",
  description: "Pre-configured Jaxicloud fleet hardware bundles.",
};

export default async function BundlesPage() {
  const bundles = await getPublishedBundles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl text-navy">Bundles</h1>
      <p className="mt-2 text-muted">
        Curated kits for faster quoting. Add a bundle to your inquiry list.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {bundles.map((bundle) => (
          <Link
            key={bundle.id}
            href={`/bundles/${bundle.slug}`}
            className="overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-md"
          >
            {bundle.images?.[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bundle.images[0].url}
                alt={bundle.images[0].alt || bundle.name}
                className="h-52 w-full object-cover"
              />
            ) : null}
            <div className="p-5">
              <h2 className="font-display text-2xl text-navy">{bundle.name}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted">
                {bundle.description}
              </p>
              <p className="mt-4 text-sm font-medium text-accent">
                {bundle.price || "Contact for pricing"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
