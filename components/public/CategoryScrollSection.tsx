import React from "react";
import { ProductCard } from "@/components/public/ProductCard";
import type { Product, Category } from "@/lib/types";
import styles from "./CategoryScrollSection.module.css";

interface Props {
  category: Category;
  products: Product[];
}

export function CategoryScrollSection({ category, products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className={styles.scrollSection}>
      <div className={styles.stickyLayout}>
        
        {/* Left Column: Pinned Category Info */}
        <div className={styles.leftColumn}>
          <div className={styles.categoryInfo}>
            <h2 className={styles.categoryTitle}>{category.name}</h2>
            <p className={styles.categoryDesc}>
              {category.description || `Explore our highly reliable ${category.name} designed for professional operations.`}
            </p>
          </div>
        </div>

        {/* Right Column: Native Horizontal Scrolling Track */}
        <div className={styles.rightColumn}>
          <div className={styles.track}>
            {products.map(product => (
              <div key={product.id} className={styles.trackItem}>
                <ProductCard product={product} />
              </div>
            ))}
            
            <div className={styles.trackSpacer} />
          </div>
        </div>

      </div>
    </section>
  );
}


