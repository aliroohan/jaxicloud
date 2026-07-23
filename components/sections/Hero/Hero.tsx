"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, ChevronDown, Layers, ShieldCheck } from "lucide-react";
import styles from "./Hero.module.css";

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgMediaRef = useRef<HTMLDivElement>(null);
  const statusChipRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const buttonGroupRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax Effect
  useEffect(() => {
    const section = sectionRef.current;
    const bgMedia = bgMediaRef.current;
    if (!section || !bgMedia) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPos = (clientX / innerWidth - 0.5) * 30;
      const yPos = (clientY / innerHeight - 0.5) * 20;

      gsap.to(bgMedia, {
        x: xPos,
        y: yPos,
        duration: 1.2,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // GSAP Entrance Animation Timeline
  useEffect(() => {
    const statusChip = statusChipRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const subhead = subheadRef.current;
    const buttonGroup = buttonGroupRef.current;

    const tl = gsap.timeline({ delay: 0.2 });

    // Initial Hidden State
    gsap.set([statusChip, line1, line2, subhead, buttonGroup], {
      opacity: 0,
      y: 30,
      filter: "blur(8px)",
    });

    // 1. Status Chip Unmask
    tl.to(statusChip, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.6,
      ease: "power3.out",
    });

    // 2. Line 1 Unmask
    tl.to(
      line1,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.4"
    );

    // 3. Line 2 Unmask with Cyan Highlight
    tl.to(
      line2,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.5"
    );

    // 4. Subheadline Reveal
    tl.to(
      subhead,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4"
    );

    // 5. CTAs Spring In
    tl.to(
      buttonGroup,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "back.out(1.4)",
      },
      "-=0.4"
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.heroSection}>
      {/* Background Visual Layer with Parallax tracking */}
      <div ref={bgMediaRef} className={styles.bgMediaWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1544620341-1ada2ff8c6ef?auto=format&fit=crop&w=2000&q=85"
          alt="Commercial fleet connected with JaxiCloud telematics"
          className={styles.bgImage}
        />
      </div>

      {/* Gradient & Technical Grid Overlays */}
      <div className={styles.gradientOverlay} />
      <div className={styles.lightGridOverlay} />

      {/* Main Editorial Hero Content Container */}
      <div className={styles.heroContainer}>
        {/* Live Scale Status Chip */}
        <div ref={statusChipRef} className={styles.statusChip}>
          <div className={styles.statusDot} />
          <span>500,000+ Vehicles Connected Across 45 Countries</span>
        </div>

        {/* SplitText Headline Group */}
        <div className={styles.headlineGroup}>
          <div ref={line1Ref} className={styles.headlineMain}>
            Connecting Every Fleet
          </div>
          <div ref={line2Ref} className={styles.headlineMain}>
            <span className={styles.headlineHighlight}>
              with Intelligence.
            </span>
          </div>
        </div>

        {/* Subheadline */}
        <p ref={subheadRef} className={styles.subheadline}>
          Cameras, trackers, tablets, and sensors—curated for commercial fleets.
          Re-engineered into one unified, intelligent telematics ecosystem.
        </p>

        {/* Commercial Action CTAs */}
        <div ref={buttonGroupRef} className={styles.buttonGroup}>
          <Link href="/solutions" className={styles.primaryButton}>
            <span>Explore Solutions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/products" className={styles.secondaryButton}>
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>

      {/* Pulsing Scroll Cue */}
      <div className={styles.scrollCue}>
        <span>SCROLL TO DISCOVER</span>
        <ChevronDown className={styles.scrollCueIcon} />
      </div>
    </section>
  );
}
