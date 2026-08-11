"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ServicesCopy } from "@/lib/i18n/pageCopy";
import styles from "./ServicesStory.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ServicesStory({ copy }: { copy: ServicesCopy }) {
  const STORY_STEPS = [
    {
      id: "step1",
      num: copy.step1Num,
      title: copy.step1Title,
      text: copy.step1Text,
      image: "/images/task_1.png"
    },
    {
      id: "step2",
      num: copy.step2Num,
      title: copy.step2Title,
      text: copy.step2Text,
      image: "/images/task_2.png"
    },
    {
      id: "step3",
      num: copy.step3Num,
      title: copy.step3Title,
      text: copy.step3Text,
      image: "/images/task_3.png"
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const cardContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardInnersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const containers = cardContainersRef.current;
    const inners = cardInnersRef.current;

    containers.forEach((container, i) => {
      if (!container || !inners[i]) return;
      
      // If there is a next card, we use its scroll position to shrink the current card
      if (i < containers.length - 1) {
        const nextContainer = containers[i + 1];
        
        gsap.to(inners[i], {
          scale: 0.92,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: nextContainer,
            start: "top bottom", // When next card enters viewport from bottom
            end: "top top+=100", // When next card reaches the sticky position (roughly 10vh)
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section className={styles.stackingSection}>
      <div className={styles.introHeader}>
        <h2 className={styles.sectionTitle}>
          {copy.tasksTitleBefore}{" "}
          <span className={styles.highlight}>{copy.tasksTitleHighlight}</span>
        </h2>
        <p className={styles.sectionDesc}>{copy.tasksDesc}</p>
      </div>

      <div ref={containerRef} className={styles.cardsWrapper}>
        {STORY_STEPS.map((step, i) => (
          <div 
            key={step.id} 
            className={styles.cardContainer}
            ref={(el) => { cardContainersRef.current[i] = el; }}
          >
            <div 
              className={styles.cardInner}
              ref={(el) => { cardInnersRef.current[i] = el; }}
              style={{
                // Optional: offset the top position slightly for each card to create a stepped stack effect
                // top: `calc(10vh + ${i * 20}px)` // If we wanted them to stack like a deck of cards
              }}
            >
              {/* Left Content */}
              <div className={styles.cardContent}>
                <div className={styles.stepNumber}>{step.num}</div>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.cardText}>{step.text}</p>
              </div>

              {/* Right Image */}
              <div className={styles.cardImageWrapper}>
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  priority={i === 0}
                  className={styles.cardImage}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
