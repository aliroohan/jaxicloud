"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProductCard } from "@/components/public/ProductCard";
import type { Product } from "@/lib/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  products: Product[];
  className?: string;
}

export function AnimatedProductGrid({ products, className }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reset refs on re-render
  cardRefs.current = [];

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  useEffect(() => {
    if (!gridRef.current || cardRefs.current.length === 0) return;

    // Set initial state
    gsap.set(cardRefs.current, { y: 60, opacity: 0, scale: 0.95 });

    const st = ScrollTrigger.create({
      trigger: gridRef.current,
      start: "top 85%",
      onEnter: () => {
        gsap.to(cardRefs.current, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.2)",
          clearProps: "transform,opacity", // clean up after animation to allow CSS hover effects
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [products]);

  return (
    <div ref={gridRef} className={className}>
      {products.map((product) => (
        <div key={product.id} ref={addToRefs}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
