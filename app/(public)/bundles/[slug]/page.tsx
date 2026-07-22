import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBundleBySlug } from "@/lib/queries";
import {
  AddToInquiryButton,
  RequestQuoteLink,
} from "@/components/public/InquiryActions";
import { ProductCard } from "@/components/public/ProductCard";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getBundleBySlug(slug);
  if (!bundle) return { title: "Bundle not found" };
  return {
    title: bundle.metaTitle || bundle.name,
    description: bundle.metaDescription || bundle.description.slice(0, 160),
  };
}

export default async function BundleDetailPage({ params }: Props) {
  const { slug } = await params;
  const bundle = await getBundleBySlug(slug);
  if (!bundle) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/bundles" className="hover:text-accent">
          Bundles
        </Link>
        <span className="mx-2">/</span>
        <span className="text-navy">{bundle.name}</span>
      </nav>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-slate-100">
          {bundle.images?.[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bundle.images[0].url}
              alt={bundle.images[0].alt || bundle.name}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center text-muted">
              No image
            </div>
          )}
        </div>
        <div>
          <h1 className="font-display text-4xl text-navy">{bundle.name}</h1>
          <p className="mt-4 text-muted">{bundle.description}</p>
          <p className="mt-4 font-medium text-navy">
            {bundle.price || "Contact for pricing"}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <AddToInquiryButton
              id={bundle.id}
              name={bundle.name}
              slug={bundle.slug}
              type="bundle"
              href={`/bundles/${bundle.slug}`}
            />
            <RequestQuoteLink />
          </div>
        </div>
      </div>
      <section className="mt-14">
        <h2 className="font-display text-2xl text-navy">Included products</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bundle.products?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
