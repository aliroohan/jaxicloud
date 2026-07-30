"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Smartphone, Shield, Gauge, Radio, ArrowRight } from "lucide-react";
import styles from "./Applications.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Applications() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const textMasksRef = useRef<(HTMLSpanElement | null)[]>([]);
  const staggerItemsRef = useRef<(HTMLElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // State for auto-cycling hover effect
  const [sequenceStep, setSequenceStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sequence = [0, 1, 3, 2]; // Custom circular order: 1st, 2nd, 4th, 3rd

  // Auto-cycle the active index slightly faster, paused if hovered
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setSequenceStep((prev) => (prev + 1) % sequence.length);
    }, 1400); // Faster speed
    
    return () => clearInterval(interval);
  }, [isHovered]);

  const activeIndex = sequence[sequenceStep];

  textMasksRef.current = [];
  const addToTextMasks = (el: HTMLSpanElement | null) => {
    if (el) textMasksRef.current.push(el);
  };

  staggerItemsRef.current = [];
  const addToStagger = (el: HTMLElement | null) => {
    if (el) staggerItemsRef.current.push(el);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // 0. Tag Reveal
    if (tagRef.current) {
      tl.fromTo(
        tagRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }

    // 1. Title Mask Reveal
    const textMasks = textMasksRef.current;
    if (textMasks.length) {
      tl.fromTo(
        textMasks,
        { y: "120%" },
        { y: "0%", duration: 0.8, stagger: 0.1, ease: "power4.out" },
        "-=0.2"
      );
    }

    // 2. Stagger paragraph and button
    const staggerItems = staggerItemsRef.current;
    if (staggerItems.length) {
      tl.fromTo(
        staggerItems,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" },
        "-=0.4"
      );
    }

    // 2. Cards fly in from 3D space
    // They are randomly staggered and fly in from different depths and angles
    tl.fromTo(
      cardsRef.current,
      {
        opacity: 0,
        z: -500, // Deep in the screen
        y: 150,
        rotationX: 45,
        rotationY: -45,
        scale: 0.5
      },
      {
        opacity: 1,
        z: 0,
        y: 0,
        rotationX: 0, // Reset to CSS rotations
        rotationY: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "back.out(1.5)",
        clearProps: "all" // Very important: clears all GSAP inline styles so CSS hover works flawlessly!
      },
      "<0.2" // Start almost simultaneously with the text, drastically reducing delay
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className={styles.appsSection}>
      <div className={styles.bgMesh} />

      <div className={styles.container}>

        {/* Left Side: Storytelling Text */}
        <div ref={textContainerRef} className={styles.contentBlock}>
          <div ref={tagRef} className={styles.sectionTag}>
            FLEET APPLICATIONS
          </div>
          <h2 className={styles.title}>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={styles.textMaskInner}>Applications to</span>
            </span>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={styles.textMaskInner}>make your business</span>
            </span>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={`${styles.textMaskInner} ${styles.highlight}`}>easier</span>
            </span>
          </h2>
          <p ref={addToStagger} className={styles.desc}>
            Use one of our carefully developed applications that makes your business easier. If you want to track tachograph states, tire states or do the vehicle and trailer inspection, solutions such as Tacho Simple, Safe Start or TPMS will help your logistics to faster get to the information and organize your fleet.
          </p>
          <div ref={addToStagger}>
            <button className={styles.learnMoreBtn}>
              Learn More
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: The Glass Collage */}
        <div 
          className={styles.collageCanvas}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >

          {/* Card 1: Click and connect */}
          <div ref={addToRefs} className={`${styles.glassCard} ${styles.card1} ${activeIndex === 0 && !isHovered ? styles.activeHover : ""}`}>
            <div className={styles.iconPod}>
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className={styles.cardTitle}>Click and connect</h3>
          </div>

          {/* Card 2: Safe start */}
          <div ref={addToRefs} className={`${styles.glassCard} ${styles.card2} ${activeIndex === 1 && !isHovered ? styles.activeHover : ""}`}>
            <div className={styles.iconPod}>
              <Shield className="w-8 h-8" />
            </div>
            <h3 className={styles.cardTitle}>Safe start</h3>
          </div>

          {/* Card 3: Tacho simple */}
          <div ref={addToRefs} className={`${styles.glassCard} ${styles.card3} ${activeIndex === 2 && !isHovered ? styles.activeHover : ""}`}>
            <div className={styles.iconPod}>
              <Gauge className="w-8 h-8" />
            </div>
            <h3 className={styles.cardTitle}>Tacho simple</h3>
          </div>

          {/* Card 4: TPMS */}
          <div ref={addToRefs} className={`${styles.glassCard} ${styles.card4} ${activeIndex === 3 && !isHovered ? styles.activeHover : ""}`}>
            <div className={styles.iconPod}>
              <Radio className="w-8 h-8" />
            </div>
            <h3 className={styles.cardTitle}>TPMS</h3>
          </div>

        </div>

      </div>
    </section>
  );
}
