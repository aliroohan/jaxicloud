"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, Cpu, Globe, TrendingUp, Truck } from "lucide-react";
import styles from "./Counters.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Counters() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerTagRef = useRef<HTMLDivElement>(null);
  const textMasksRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  textMasksRef.current = [];
  const addToTextMasks = (el: HTMLSpanElement | null) => {
    if (el) textMasksRef.current.push(el);
  };

  // State for interpolated numeric values
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const [countriesCount, setCountriesCount] = useState(0);
  const [uptimeCount, setUptimeCount] = useState(0);
  const [hardwareCount, setHardwareCount] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const countObj = {
      vehicles: 0,
      countries: 0,
      uptime: 0,
      hardware: 0,
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%", // Start revealing when section enters the viewport
        toggleActions: "play none none reverse",
      },
    });

    // 0. Small Tag fades in
    tl.fromTo(
      headerTagRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );

    // 0.5. Apple-style Text Mask Reveal for the Header Lines
    const textMasks = textMasksRef.current;
    if (textMasks.length) {
      tl.fromTo(
        textMasks,
        { y: "120%" },
        { y: "0%", duration: 0.8, stagger: 0.1, ease: "power4.out" },
        "-=0.2" // overlap slightly with the tag fading in
      );
    }

    // 1. Unique entry points for grid cells
    const cards = cardsRef.current;
    if (cards.length >= 4) {
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // Simple slide up on mobile to prevent horizontal scroll/clipping
        gsap.set(cards, { opacity: 0, y: 40 });
      } else {
        // Top Left comes from left
        gsap.set(cards[0], { opacity: 0, x: -80, y: 0 });
        // Top Right comes from right
        gsap.set(cards[1], { opacity: 0, x: 80, y: 0 });
        // Bottom two come from bottom
        gsap.set(cards[2], { opacity: 0, x: 0, y: 80 });
        gsap.set(cards[3], { opacity: 0, x: 0, y: 80 });
      }

      tl.to(
        cards,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          clearProps: "transform" // Ensure hover scale works after animation completes
        },
        "-=0.4"
      );
    }

    // 2. Numbers roll up simultaneously as cards appear
    tl.to(
      countObj,
      {
        vehicles: 500000,
        countries: 45,
        uptime: 99.98,
        hardware: 120,
        duration: 2.5,
        ease: "power2.out",
        onUpdate: () => {
          setVehiclesCount(Math.floor(countObj.vehicles));
          setCountriesCount(Math.floor(countObj.countries));
          setUptimeCount(Number(countObj.uptime.toFixed(2)));
          setHardwareCount(Math.floor(countObj.hardware));
        },
      },
      "<" // Start exactly at the same time as the previous animation (the cards popping up)
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
    <section ref={sectionRef} className={styles.countersSection}>
      <div className={styles.container}>

        {/* Header Block */}
        <div className={styles.headerBlock}>
          <div ref={headerTagRef} className={styles.sectionTag}>
            <TrendingUp className="w-3.5 h-3.5" />
            <span>GLOBAL INFRASTRUCTURE SCALE</span>
          </div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={styles.textMaskInner}>Engineered to Power Commercial Fleets</span>
            </span>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={`${styles.textMaskInner} ${styles.sectionTitleHighlight}`}>
                At Global Standard.
              </span>
            </span>
          </h2>
        </div>

        <div className={styles.grid}>

          {/* Card 1 */}
          <div ref={addToRefs} className={`${styles.card} ${styles.borderBottom} ${styles.borderRight}`}>
            <div className={styles.numberWrapper}>
              <span className={styles.chevronAccent}>{'>'}</span>
              <div className={styles.numberDisplay}>
                <span className={styles.numberGradient}>{vehiclesCount.toLocaleString()}+</span>
              </div>
            </div>
            <div className={styles.cardLabel}>Connected Vehicles</div>
            <div className={styles.cardDesc}>
              Active commercial vehicles monitored continuously in real time.
            </div>
          </div>

          {/* Card 2 */}
          <div ref={addToRefs} className={`${styles.card} ${styles.borderBottom}`}>
            <div className={styles.numberWrapper}>
              <span className={styles.chevronAccent}>{'>'}</span>
              <div className={styles.numberDisplay}>
                <span className={styles.numberGradient}>{countriesCount}+</span>
              </div>
            </div>
            <div className={styles.cardLabel}>Countries Deployed</div>
            <div className={styles.cardDesc}>
              Global telematics operations across Americas, Europe, Asia & MEA.
            </div>
          </div>

          {/* Card 3 */}
          <div ref={addToRefs} className={`${styles.card} ${styles.borderRight}`}>
            <div className={styles.numberWrapper}>
              <span className={styles.chevronAccent}>{'>'}</span>
              <div className={styles.numberDisplay}>
                <span className={styles.numberGradient}>{uptimeCount}%</span>
              </div>
            </div>
            <div className={styles.cardLabel}>Mission-Critical Uptime</div>
            <div className={styles.cardDesc}>
              Enterprise Cloud SLAs ensuring uninterrupted fleet connectivity.
            </div>
          </div>

          {/* Card 4 */}
          <div ref={addToRefs} className={styles.card}>
            <div className={styles.numberWrapper}>
              <span className={styles.chevronAccent}>{'>'}</span>
              <div className={styles.numberDisplay}>
                <span className={styles.numberGradient}>{hardwareCount}+</span>
              </div>
            </div>
            <div className={styles.cardLabel}>Hardware Models</div>
            <div className={styles.cardDesc}>
              Cameras, OBD trackers, CANbus interfaces & BLE sensors.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
