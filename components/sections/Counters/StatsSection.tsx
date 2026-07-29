"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { TrendingUp } from "lucide-react";
import { STAT_DETAILS } from "./constants";
import { StatCard } from "./StatCard";
import { ConnectorSVG } from "./ConnectorSVG";
import styles from "./StatsSection.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

export function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const textMasksRef = useRef<(HTMLSpanElement | null)[]>([]);
  
  // State to trigger the React counting hook once GSAP reveals the cards
  const [cardsRevealed, setCardsRevealed] = useState(false);
  
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  textMasksRef.current = [];
  const addToTextMasks = (el: HTMLSpanElement | null) => {
    if (el) textMasksRef.current.push(el);
  };

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current || !headerRef.current) return;
    
    // Set initial GSAP states
    const cards = containerRef.current.querySelectorAll('.stat-card');
    const path = containerRef.current.querySelector('.connector-path');
    const pulse = containerRef.current.querySelector('.connector-pulse');

    if (!prefersReducedMotion) {
      gsap.set(headerRef.current, { opacity: 1 }); // Header wrapper doesn't fade, contents do
      if (tagRef.current) gsap.set(tagRef.current, { opacity: 0, y: 15 });
      if (textMasksRef.current.length > 0) gsap.set(textMasksRef.current, { y: "120%" });
      gsap.set(containerRef.current, { opacity: 0, y: 50 });
      gsap.set(cards, { opacity: 0, y: 60, scale: 0.95 });
      if (path) gsap.set(path, { strokeDashoffset: 3000 }); // Matches strokeDasharray
      if (pulse) gsap.set(pulse, { opacity: 0 });
    }

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Fallback for reduced motion
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          onEnter: () => setCardsRevealed(true)
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      // 1. Fade in the tag
      if (tagRef.current) {
        tl.to(tagRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        });
      }

      // 2. Apple-style Text Mask Reveal for the Heading
      if (textMasksRef.current.length > 0) {
        tl.to(textMasksRef.current, {
          y: "0%",
          duration: 0.8,
          stagger: 0.1,
          ease: "power4.out"
        }, "-=0.2");
      }

      // 3. Fade in the entire section container
      tl.to(containerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3");

      // 2. Animate the SVG connector drawing itself
      if (path && pulse) {
        tl.to(path, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power3.inOut",
          onComplete: () => {
            // Once the initial draw is complete, start an infinite energy pulse
            const pulseTl = gsap.timeline({ repeat: -1 });
            
            pulseTl.addLabel("pulseStart", 0);

            // Fade pulse in
            pulseTl.to(pulse, {
              opacity: 1,
              duration: 0.2
            }, "pulseStart");
            
            // Travel along the path
            pulseTl.to(pulse, {
              motionPath: {
                path: path as SVGPathElement,
                align: path as SVGPathElement,
                alignOrigin: [0.5, 0.5],
                autoRotate: false
              },
              duration: 3.5, // Slightly slower so the scaling feels natural
              ease: "none" // Constant speed looks best for an energy flow
            }, "pulseStart"); 
            
            // Make each card scale up as the energy passes it
            // The timings are approximated based on the SVG path length distribution
            if (cards.length === 4) {
              const popConfig = { scale: 1.05, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out" };
              pulseTl.to(cards[0], popConfig, "pulseStart+=0.2");  // Energy starts at card 0
              pulseTl.to(cards[1], popConfig, "pulseStart+=1.3");  // Energy reaches card 1
              pulseTl.to(cards[2], popConfig, "pulseStart+=2.2");  // Energy reaches card 2
              pulseTl.to(cards[3], popConfig, "pulseStart+=3.1");  // Energy reaches card 3
            }

            // Fade out at end
            pulseTl.to(pulse, {
              opacity: 0,
              duration: 0.2
            }, "pulseStart+=3.3"); // fade out right before it reaches the absolute end
            
            // Pause before repeating the energy wave
            pulseTl.to({}, { duration: 1.5 });
          }
        }, "-=0.2");
      }

      // 4. Reveal cards sequentially
      tl.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.18,
        ease: "power3.out",
        onStart: () => {
          // Trigger the counter animations once cards start revealing
          setCardsRevealed(true);
        }
      }, path ? "-=1.2" : "-=0.2"); // Start revealing while path is still drawing
      
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className={styles.sectionWrapper}>
      <div className={styles.radialGlow} />
      
      <div className={styles.layoutContainer}>
        <div ref={headerRef} className={styles.headerBlock}>
          <div ref={tagRef} className={styles.sectionTag}>
            GLOBAL INFRASTRUCTURE SCALE
          </div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={styles.textMaskInner}>Engineered to Power Commercial Fleets</span>
            </span>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={`${styles.textMaskInner} ${styles.sectionTitleHighlight}`}>At Global Standard.</span>
            </span>
          </h2>
        </div>

        <div ref={containerRef} className={styles.contentContainer}>
          {/* The SVG connector layer (only visible on desktop via CSS) */}
          <ConnectorSVG />
          
          {/* The Cards Grid Layer */}
          <div className={styles.gridTimeline}>
            {STAT_DETAILS.map((detail, idx) => (
              <StatCard 
                key={detail.id} 
                detail={detail} 
                index={idx} 
                inView={prefersReducedMotion ? true : cardsRevealed} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
