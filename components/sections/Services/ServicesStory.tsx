"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ServicesStory.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STORY_STEPS = [
  {
    id: "step1",
    num: "01",
    title: "All necessary information gathered in one place",
    text: "When an incident occurs, it automatically appears as a task in a dedicated tab under Tasks. The intuitive interface ensures dispatchers can quickly access critical information, providing greater visibility and control over fleet assets.",
    image: "/images/task_1.png"
  },
  {
    id: "step2",
    num: "02",
    title: "Different interaction options for tasks",
    text: "Users can interact directly with tasks in Jaxicloud, allowing them to review and edit important information, assign tasks to colleagues, adjust their priority and status, and leave comments. This ensures thorough tracking of each task.",
    image: "/images/task_2.png"
  },
  {
    id: "step3",
    num: "03",
    title: "Task history is available at any time",
    text: "The tab collects and stores information about all tasks, providing access to a full history when needed. This data provides valuable insights that help identify patterns, evaluate dispatcher performance, and implement process improvements.",
    image: "/images/task_3.png"
  }
];

export function ServicesStory() {
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
        <h2 className={styles.sectionTitle}>Practical <span className={styles.highlight}>tasks</span></h2>
        <p className={styles.sectionDesc}>Experience the complete lifecycle of task management.</p>
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
