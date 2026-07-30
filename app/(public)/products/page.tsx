import Link from "next/link";
import type { Metadata } from "next";
import { Cpu } from "lucide-react";
import { getCategories, getPublishedProducts } from "@/lib/queries";
import { CategoryScrollSection } from "@/components/public/CategoryScrollSection";
import styles from "@/components/public/MinimalistProduct.module.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Enterprise Fleet Telematics Hardware | JaxiCloud Catalog",
  description: "Explore enterprise AI dashcams, MDVRs, driver terminals, and passenger sensors.",
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

  // We always render all categories now (Category Centric)
  const activeCategories = categories;

  return (
    <div className={styles.pageWrapper}>
      {/* Page Header Area (Stays static at top) */}
      <div className={styles.container}>
        <div className={styles.headerBlock}>
          <div className={styles.sectionTag}>
            <Cpu className="w-3.5 h-3.5 text-cyan-600" />
            <span>ENTERPRISE HARDWARE CATALOG</span>
          </div>
          <h1 className={styles.pageTitle}>Commercial Fleet Telematics</h1>
          <p className={styles.subheadline}>
            Explore enterprise-grade 4K AI vision dashcams, multi-channel MDVRs,
            rugged Android driver terminals, and passenger counting sensors.
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className={styles.filterRow}>
          <form className={styles.searchForm} method="get">
            <input
              name="q"
              defaultValue={params.q || ""}
              placeholder="Search by hardware name, model number, or spec tag..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.filterBtn}>
              Search Catalog
            </button>
          </form>
        </div>

        {/* Category Filter Tabs Bar - Now used for smooth scrolling */}
        <div className={styles.categoryTabs}>
          <Link
            href="#"
            className={`${styles.categoryTab} ${styles.categoryTabActive}`}
          >
            All Hardware
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`#category-${c.slug}`}
              className={styles.categoryTab}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.horizontalSectionsContainer}>
        {activeCategories.map(category => {
          // Filter products for this specific category
          const categoryProducts = products.filter(p => p.category?.id === category.id);
          
          if (categoryProducts.length === 0) return null;
          
          return (
            <div key={category.id} id={`category-${category.slug}`} className="scroll-mt-32">
              <CategoryScrollSection category={category} products={categoryProducts} />
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="py-20 text-center text-slate-500">
          <p className="font-display text-xl text-navy">No products found</p>
          <p className="mt-1 text-sm">
            Try adjusting your search criteria or select another hardware category.
          </p>
        </div>
      )}
    </div>
  );
}
