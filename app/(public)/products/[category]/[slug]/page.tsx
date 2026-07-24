import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { getProductByCategorySlug } from "@/lib/queries";
import {
  AddToInquiryButton,
  RequestQuoteLink,
} from "@/components/public/InquiryActions";
import { ProductDetailClient } from "@/components/public/ProductDetailClient";
import styles from "@/components/public/MinimalistProduct.module.css";

export const revalidate = 3600;

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProductByCategorySlug(category, slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.metaTitle || `${product.name} | JaxiCloud Fleet Hardware`,
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
    brand: { "@type": "Brand", name: "JaxiCloud" },
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
    <div className={styles.pageWrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.container}>
        {/* Minimalist Breadcrumbs */}
        <nav className={styles.detailBreadcrumb}>
          <Link href="/products" className={styles.breadcrumbLink}>
            Hardware Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/products?category=${product.category?.slug}`}
            className={styles.breadcrumbLink}
          >
            {product.category?.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{product.name}</span>
        </nav>

        {/* 2-Column Minimalist Hero Stage */}
        <div className={styles.detailHeroGrid}>
          <ProductDetailClient product={product} />

          {/* Right Product Essentials Info Panel */}
          <div className={styles.detailInfoPanel}>
            {product.category && (
              <div className={styles.detailCategoryTag}>
                {product.category.name} {product.modelNumber ? `• ${product.modelNumber}` : ""}
              </div>
            )}

            <h1 className={styles.detailTitle}>{product.name}</h1>

            {product.tagline && (
              <p className={styles.detailTagline}>{product.tagline}</p>
            )}

            <p className={styles.detailOverview}>{product.overview}</p>

            {/* Actions Row */}
            <div className={styles.actionRow}>
              <AddToInquiryButton
                id={product.id}
                name={product.name}
                slug={product.slug}
                href={`/products/${product.category?.slug}/${product.slug}`}
                className={styles.primaryQuoteBtn}
              />
              <Link href="/contact" className={styles.contactSalesBtn}>
                Contact Enterprise Sales
              </Link>
            </div>

            {/* Spec Tag Pills */}
            {product.tags && product.tags.length > 0 && (
              <div className={styles.tagRow}>
                {product.tags.map((tag) => (
                  <span key={tag} className={styles.tagBadge}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Key Features Deck */}
        {product.keyFeatures && product.keyFeatures.length > 0 && (
          <section className={styles.specSection}>
            <h2 className={styles.specSectionTitle}>Key Features & Engineering</h2>
            <div className={styles.featuresGrid}>
              {product.keyFeatures.map((f) => (
                <div key={f.title} className={styles.featureCard}>
                  <CheckCircle2 className={`w-5 h-5 ${styles.featureIcon}`} />
                  <div>
                    <h3 className={styles.featureTitle}>{f.title}</h3>
                    {f.description && (
                      <p className={styles.featureDesc}>{f.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Specifications Deck */}
        {product.specifications && product.specifications.length > 0 && (
          <section className={styles.specSection}>
            <h2 className={styles.specSectionTitle}>Technical Specifications</h2>
            <div className="space-y-6">
              {product.specifications.map((group) => (
                <div key={group.groupName}>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-cyan-700">
                    {group.groupName}
                  </h3>
                  <dl className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {group.items.map((item) => (
                      <div
                        key={item.label}
                        className="grid grid-cols-2 gap-4 border-b border-slate-100 px-5 py-3.5 last:border-0"
                      >
                        <dt className="text-sm font-medium text-slate-500">{item.label}</dt>
                        <dd className="text-sm font-semibold text-navy">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Row */}
        {product.certifications && product.certifications.length > 0 && (
          <section className={styles.specSection}>
            <h2 className={styles.specSectionTitle}>Industry Certifications</h2>
            <div className="flex flex-wrap gap-2.5">
              {product.certifications.map((c) => (
                <span
                  key={c}
                  className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Floating Bottom Quote Bar */}
      <div className="sticky bottom-4 z-30 mt-16 flex justify-center">
        <div className="flex flex-wrap items-center gap-3 rounded-full border border-slate-200 bg-white/95 px-5 py-3 shadow-xl backdrop-blur-md">
          <span className="hidden text-sm font-medium text-slate-600 sm:inline">
            Specify {product.name} for your fleet?
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
