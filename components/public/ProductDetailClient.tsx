"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import styles from "./MinimalistProduct.module.css";

export function ProductDetailClient({ product }: { product: Product }) {
  const images = product.images?.length
    ? product.images
    : [{ url: "", alt: product.name }];
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];

  return (
    <div className={styles.galleryWrapper}>
      {/* Main High-Res Render Stage */}
      <div className={styles.mainPhotoStage}>
        {current?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.url}
            alt={current.alt || product.name}
            className={styles.mainPhotoImg}
          />
        ) : (
          <div className="text-sm font-medium text-slate-400">
            Hardware Render Pending
          </div>
        )}
      </div>

      {/* Thumbnail Selector Row */}
      {images.length > 1 && (
        <div className={styles.thumbnailRow}>
          {images.map((img, idx) => (
            <button
              key={`${img.url}-${idx}`}
              type="button"
              onClick={() => setActive(idx)}
              className={`${styles.thumbnailBtn} ${
                idx === active ? styles.thumbnailBtnActive : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || ""}
                className={styles.thumbnailImg}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
