"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, Layers } from "lucide-react";
import styles from "./Hero.module.css";

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textMasksRef = useRef<(HTMLSpanElement | null)[]>([]);
  const staggerItemsRef = useRef<(HTMLElement | null)[]>([]);

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

    const tl = gsap.timeline();

    // 1. Video Fade & Scale In
    if (videoRef.current) {
      tl.to(videoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 2,
        ease: "power2.out",
      });
    }

    // 2. Apple-style Text Mask Reveal for the Title
    const textMasks = textMasksRef.current;
    if (textMasks.length) {
      gsap.set(textMasks, { y: "120%" });
      tl.to(textMasks, {
        y: "0%",
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
      }, "-=1.2"); // Overlap with video animation
    }

    // 3. Stagger subheadline and buttons
    const staggerItems = staggerItemsRef.current;
    if (staggerItems.length) {
      gsap.set(staggerItems, { opacity: 0, y: 20 });
      tl.to(staggerItems, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      }, "-=0.8");
    }
  }, []);

  return (
    <section ref={sectionRef} className={styles.heroSection}>
      {/* Full-Bleed Background Video */}
      <video
        ref={videoRef}
        src="/semi1.mp4"
        autoPlay
        muted
        loop
        playsInline
        className={styles.videoBackground}
      />
      <div className={styles.videoOverlay} />
      <div className={styles.bottomBlur} />

      {/* Foreground Content */}
      <div className={styles.contentWrapper}>
        <h1 className={styles.headlineMain}>
          <span className={styles.textMask}>
            <span ref={addToTextMasks} className={styles.textMaskInner}>Connecting Every Fleet</span>
          </span>
          <span className={styles.textMask}>
            <span ref={addToTextMasks} className={`${styles.textMaskInner} ${styles.headlineHighlight}`}>with Intelligence.</span>
          </span>
        </h1>

        <div className={styles.subheadline}>
          <div className={styles.textMask}>
            <span ref={addToTextMasks} className={styles.textMaskInner}>
              Cameras, trackers, tablets, and sensors—curated for commercial fleets.
            </span>
          </div>
          <div className={styles.textMask}>
            <span ref={addToTextMasks} className={styles.textMaskInner}>
              Re-engineered into one unified, intelligent telematics ecosystem.
            </span>
          </div>
        </div>

        <div ref={addToStagger} className={styles.buttonGroup}>
          <Link href="/solutions" className={styles.primaryButton}>
            <span>Explore Platform</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/products" className={styles.secondaryButton}>
            <Layers className="w-4 h-4" />
            <span>Hardware Catalog</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
