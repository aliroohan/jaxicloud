import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Boxes, CheckCircle2 } from "lucide-react";
import { getPublishedBundles } from "@/lib/queries";
import styles from "@/components/public/MinimalistBundle.module.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pre-Configured Fleet Telematics Hardware Bundles | JaxiCloud",
  description: "Explore turn-key hardware packages pre-paired by vehicle type for rapid deployment.",
};

export default async function BundlesPage() {
  const bundles = await getPublishedBundles();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Minimalist Editorial Header */}
        <div className={styles.headerBlock}>
          <div className={styles.sectionTag}>
            <Boxes className="w-3.5 h-3.5 text-cyan-600" />
            <span>PRE-CONFIGURED HARDWARE KITS</span>
          </div>
          <h1 className={styles.pageTitle}>Turn-Key Telematics Bundles</h1>
          <p className={styles.subheadline}>
            Complete plug-and-play hardware packages pre-paired for instant commercial
            fleet deployment. Add pre-configured kit bundles directly to your quote.
          </p>
        </div>

        {/* Bundle Grid Cards */}
        <div className={styles.bundleGrid}>
          {bundles.map((bundle) => (
            <div key={bundle.id} className={styles.bundleCard}>
              <Link href={`/bundles/${bundle.slug}`} className={styles.imageStage}>
                {bundle.images?.[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={bundle.images[0].url}
                    alt={bundle.images[0].alt || bundle.name}
                    className={styles.bundleImg}
                  />
                ) : (
                  <div className="text-sm font-medium text-slate-400">
                    Hardware Package Stage
                  </div>
                )}
              </Link>

              <div className={styles.cardContent}>
                <div className={styles.categoryTag}>PRE-CONFIGURED KIT</div>
                <Link href={`/bundles/${bundle.slug}`} className={styles.bundleTitle}>
                  {bundle.name}
                </Link>
                <p className={styles.bundleDesc}>{bundle.description}</p>

                {/* Included Hardware Items Pills */}
                {bundle.products && bundle.products.length > 0 && (
                  <div className={styles.itemPillsRow}>
                    {bundle.products.map((p) => (
                      <span key={p.id} className={styles.itemPill}>
                        1x {p.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.cardFooter}>
                  <span className={styles.priceTag}>
                    {bundle.price || "Contact for Package Pricing"}
                  </span>

                  <Link href={`/bundles/${bundle.slug}`} className={styles.viewDetailsLink}>
                    <span>View Package Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {bundles.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500">
              <p className="font-display text-xl text-navy">No hardware bundles published yet.</p>
              <p className="mt-1 text-sm">Check back shortly for new fleet starter kits.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
