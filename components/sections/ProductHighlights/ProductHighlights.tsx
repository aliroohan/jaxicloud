"use client";

import React, { useEffect, useRef } from "react";
import { Globe2, Puzzle, Cpu } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeCopy } from "@/lib/i18n/pageCopy";
import styles from "./ProductHighlights.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ProductHighlights({ copy }: { copy: HomeCopy }) {
  const HIGHLIGHTS_DATA = [
    {
      icon: <Globe2 className={styles.cardIcon} strokeWidth={1.5} />,
      title: copy.highlightLangTitle,
      description: copy.highlightLangDesc,
    },
    {
      icon: <Puzzle className={styles.cardIcon} strokeWidth={1.5} />,
      title: copy.highlightIntegrationsTitle,
      description: copy.highlightIntegrationsDesc,
    },
    {
      icon: <Cpu className={styles.cardIcon} strokeWidth={1.5} />,
      title: copy.highlightHardwareTitle,
      description: copy.highlightHardwareDesc,
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const textMasksRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  textMasksRef.current = [];
  const addToTextMasks = (el: HTMLSpanElement | null) => {
    if (el) textMasksRef.current.push(el);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    if (titleRef.current) {
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    }

    const textMasks = textMasksRef.current;
    if (textMasks.length) {
      tl.fromTo(
        textMasks,
        { y: "120%" },
        { y: "0%", duration: 0.8, stagger: 0.1, ease: "power4.out" },
        "-=0.2"
      );
    }

    if (cardsRef.current.length > 0) {
      tl.fromTo(cardsRef.current, {
        opacity: 0,
        y: 80,
        rotateX: 20,
        scale: 0.95,
      }, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 1.2,
        stagger: {
          each: 0.15,
          from: "start"
        },
        ease: "elastic.out(1, 0.6)",
        clearProps: "transform"
      }, "-=0.4");
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === containerRef.current) st.kill();
      });
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className={styles.container}>
        
        {/* Glowing ambient background orb */}
        <div className={styles.ambientOrb} />

        {/* Animated Title */}
        <div ref={titleRef} className={styles.titleContainer}>
          <div className={styles.titleBadge}>{copy.highlightsBadge}</div>
          <h2 className={styles.title}>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={styles.textMaskInner}>
                <span className={styles.titleBold}>
                  {copy.highlightsTitleBrand.split(copy.highlightsTitleBrandHighlight)[0]}
                  <span className={styles.highlight}>{copy.highlightsTitleBrandHighlight}</span>
                </span>
              </span>
            </span>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={styles.textMaskInner}>
                <span className={styles.titleLight}>{copy.highlightsTitleSub}</span>
              </span>
            </span>
          </h2>
        </div>

        {/* Animated Grid */}
        <div className={styles.grid}>
          {HIGHLIGHTS_DATA.map((item, index) => (
            <div 
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={styles.card}
            >
              <div className={styles.cardGlow} />
              <div className={styles.iconWrapper}>
                {item.icon}
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
