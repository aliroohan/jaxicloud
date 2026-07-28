"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Bus, HardHat, ShieldCheck, Snowflake, Truck, Users } from "lucide-react";
import styles from "@/components/public/MinimalistSolution.module.css";
import type { Solution } from "@/lib/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const getIcon = (slug: string) => {
  if (slug.includes('transit') || slug.includes('bus')) return Bus;
  if (slug.includes('cold') || slug.includes('temp')) return Snowflake;
  if (slug.includes('mining') || slug.includes('construct')) return HardHat;
  if (slug.includes('passenger') || slug.includes('people')) return Users;
  if (slug.includes('security') || slug.includes('shield')) return ShieldCheck;
  return Truck;
};

interface Props {
  solutions: Solution[];
  className?: string;
}

export function AnimatedSolutionGrid({ solutions, className }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  cardRefs.current = [];

  const addToRefs = (el: HTMLAnchorElement | null) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  useEffect(() => {
    if (!gridRef.current || cardRefs.current.length === 0) return;

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
          stagger: 0.15,
          ease: "back.out(1.2)",
          clearProps: "transform,opacity",
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [solutions]);

  return (
    <div ref={gridRef} className={className}>
      {solutions.map((s) => {
        const IconComponent = getIcon(s.slug);

        return (
          <Link 
            key={s.id} 
            href={`/solutions/${s.slug}`} 
            className={styles.solutionCard}
            ref={addToRefs}
          >
            <div className={styles.iconPod}>
              <IconComponent className="w-6 h-6" />
            </div>

            <h2 className={styles.solutionTitle}>{s.name}</h2>
            <p className={styles.solutionDesc}>{s.description}</p>

            <div className={styles.cardFooter}>
              <div className={styles.viewDetailsLink}>
                <span>Explore Vertical Solution</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
