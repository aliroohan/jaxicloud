import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductByCategorySlug } from "@/lib/queries";
import {
  AddToInquiryButton,
  RequestQuoteLink,
} from "@/components/public/InquiryActions";
import { ProductDetailClient } from "@/components/public/ProductDetailClient";

export const revalidate = 3600;

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProductByCategorySlug(category, slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.tagline || product.overview.slice(0, 160),
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.tagline,
      images: product.images?.[0]?.url ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const product = await getProductByCategorySlug(category, slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.overview,
    sku: product.modelNumber || product.slug,
    brand: { "@type": "Brand", name: "Jaxicloud" },
    image: product.images?.map((i) => i.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${category}/${slug}`,
      description: product.price || "Contact for pricing",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-6 text-sm text-muted">
        <Link href="/products" className="hover:text-accent">
          Products
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products?category=${product.category?.slug}`}
          className="hover:text-accent"
        >
          {product.category?.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-navy">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductDetailClient product={product} />
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            {product.category?.name}
            {product.modelNumber ? ` · ${product.modelNumber}` : ""}
          </p>
          <h1 className="mt-2 font-display text-4xl text-navy">{product.name}</h1>
          {product.tagline ? (
            <p className="mt-3 text-lg text-steel">{product.tagline}</p>
          ) : null}
          <p className="mt-4 text-muted">{product.overview}</p>
          <p className="mt-4 text-sm font-medium text-navy">
            {product.price || "Contact for pricing"}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <AddToInquiryButton
              id={product.id}
              name={product.name}
              slug={product.slug}
              href={`/products/${product.category?.slug}/${product.slug}`}
            />
            <RequestQuoteLink />
            <Link
              href="/contact"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-navy hover:border-accent"
            >
              Contact Sales
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-steel"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {product.keyFeatures?.length ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl text-navy">Key features</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {product.keyFeatures.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h3 className="font-medium text-navy">{f.title}</h3>
                <p className="mt-2 text-sm text-muted">{f.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {product.specifications?.length ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl text-navy">Specifications</h2>
          <div className="mt-6 space-y-6">
            {product.specifications.map((group) => (
              <div key={group.groupName}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                  {group.groupName}
                </h3>
                <dl className="overflow-hidden rounded-xl border border-border bg-card">
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      className="grid grid-cols-2 gap-4 border-b border-border px-4 py-3 last:border-0"
                    >
                      <dt className="text-sm text-muted">{item.label}</dt>
                      <dd className="text-sm font-medium text-navy">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {product.certifications?.length ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl text-navy">Certifications</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.certifications.map((c) => (
              <span
                key={c}
                className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {product.solutions?.length ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl text-navy">Related solutions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {product.solutions.map((s) => (
              <Link
                key={s.id}
                href={`/solutions/${s.slug}`}
                className="rounded-md border border-border bg-card px-4 py-2 text-sm hover:border-accent"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {product.bundles?.length ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl text-navy">Included in bundles</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {product.bundles.map((b) => (
              <Link
                key={b.id}
                href={`/bundles/${b.slug}`}
                className="rounded-xl border border-border bg-card p-4 hover:shadow-md"
              >
                <h3 className="font-medium text-navy">{b.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {b.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {product.videoUrls?.length ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl text-navy">Videos</h2>
          <ul className="mt-4 space-y-2">
            {product.videoUrls.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-accent hover:underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {product.specSheetUrl ? (
        <section className="mt-10">
          <a
            href={product.specSheetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-accent"
          >
            Download spec sheet (PDF)
          </a>
        </section>
      ) : null}

      <div className="sticky bottom-4 z-30 mt-16 flex justify-center">
        <div className="flex flex-wrap items-center gap-3 rounded-full border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
          <span className="hidden text-sm text-muted sm:inline">
            Ready to specify this unit?
          </span>
          <AddToInquiryButton
            id={product.id}
            name={product.name}
            slug={product.slug}
            href={`/products/${product.category?.slug}/${product.slug}`}
            className="!rounded-full"
          />
          <RequestQuoteLink className="!rounded-full" />
        </div>
      </div>
    </div>
  );
}
