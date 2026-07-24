import Link from "next/link";
import { ArrowRight, BrainCircuit } from "lucide-react";
import type { Product } from "@/lib/types";
import styles from "./MinimalistProduct.module.css";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];
  const href = product.category
    ? `/products/${product.category.slug}/${product.slug}`
    : `/products`;

  return (
    <article className={styles.productCard}>
      {/* Product Image Stage */}
      <Link href={href} className={styles.cardImageStage}>
        {/* Floating AI Badge (Revealed on Hover) */}
        <div className={styles.aiFloatingBadge}>
          <BrainCircuit className="w-4 h-4" />
        </div>

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
      </Link>

      {/* Card Content Area */}
      <Link href={href} className={styles.cardContent}>
        <div className={styles.tagLinks}>
          {product.category && (
            <span className={styles.categoryTag}>{product.category.name}</span>
          )}
          {product.tags?.[0] && (
            <span className={styles.categoryTag}>{product.tags[0]}</span>
          )}
        </div>

        <h3 className={styles.cardTitle}>{product.name}</h3>

        {product.tagline && (
          <p className={styles.cardTagline}>{product.tagline}</p>
        )}
      </Link>
    </article>
  );
}
