import Link from "next/link";
import { ArrowRight, BrainCircuit } from "lucide-react";
import type { Product } from "@/lib/types";
import styles from "./MinimalistProduct.module.css";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];
  const href = product.category
    ? `/products/${product.category.slug}/${product.slug}`
    : `/products`;

  // Grab the first 6 specs across all groups to show as pills
  const specPills: string[] = [];
  product.specifications?.forEach(group => {
    group.items?.forEach(item => {
      if (specPills.length < 6) specPills.push(item.value);
    });
  });

  const isNewOrHot = product.tags?.find(t => t.toLowerCase() === 'new' || t.toLowerCase() === 'hot');

  return (
    <Link href={href} className={styles.productCard}>
      {/* Top Header Row */}
      <div className={styles.cardHeader}>
        {product.category && (
          <span className={styles.categoryTag}>{product.category.name}</span>
        )}
        {isNewOrHot && (
          <span className={`${styles.statusBadge} ${isNewOrHot.toLowerCase() === 'hot' ? styles.statusHot : styles.statusNew}`}>
            {isNewOrHot.toUpperCase()}
          </span>
        )}
      </div>

      {/* Product Image Stage */}
      <div className={styles.cardImageStage}>
        {image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={image.alt || product.name}
            className={styles.cardImg}
          />
        ) : (
          <div className="text-sm font-medium text-slate-400">
            Hardware Render Pending
          </div>
        )}
        {/* Glow effect behind image */}
        <div className={styles.imageGlow}></div>
      </div>

      {/* Card Content Area */}
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{product.name}</h3>
        {product.tagline && (
          <p className={styles.cardTagline}>{product.tagline}</p>
        )}

        {/* Tech Spec Pills */}
        {specPills.length > 0 && (
          <div className={styles.specPillContainer}>
            {specPills.map((spec, i) => (
              <span key={i} className={styles.specPill}>{spec}</span>
            ))}
          </div>
        )}

        {/* Certifications Row */}
        {product.certifications && product.certifications.length > 0 && (
          <div className={styles.certContainer}>
            {product.certifications.slice(0, 4).map((cert, i) => (
              <span key={i} className={styles.certPill}>{cert}</span>
            ))}
            {product.certifications.length > 4 && (
              <span className={styles.certMore}>[+{product.certifications.length - 4} more]</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
