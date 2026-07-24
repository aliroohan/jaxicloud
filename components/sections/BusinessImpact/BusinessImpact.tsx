"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./BusinessImpact.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function BusinessImpact() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
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
    if (!sectionRef.current || !bgImageRef.current || !contentWrapperRef.current) return;

    // Remove the initial hidden opacity from the wrapper so we can animate children
    gsap.set(contentWrapperRef.current, { opacity: 1, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    const textMasks = textMasksRef.current;
    if (textMasks.length) {
      tl.fromTo(
        textMasks,
        { y: "120%" },
        { y: "0%", duration: 0.8, stagger: 0.1, ease: "power4.out" }
      );
    }

    const staggerItems = staggerItemsRef.current;
    if (staggerItems.length) {
      tl.fromTo(
        staggerItems,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" },
        "-=0.4"
      );
    }

    // Subtle parallax zoom on the background image as you scroll through the section
    gsap.fromTo(
      bgImageRef.current,
      { scale: 1.0 },
      {
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === sectionRef.current) st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      
      {/* Cinematic AI Vision Background */}
      <div className={styles.bgWrapper}>
        <div className={styles.bgOverlay} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          ref={bgImageRef}
          src="/ai-vision-bg.png" 
          alt="AI Vision Tracking Highway" 
          className={styles.bgImage}
        />
      </div>

      <div className={styles.container}>
        <div ref={contentWrapperRef} className={styles.contentWrapper}>
          <h2 className={styles.title}>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={styles.textMaskInner}>What we do for</span>
            </span>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={styles.textMaskInner}>your business</span>
            </span>
          </h2>
          <p ref={addToStagger} className={styles.description}>
            Jaxicloud Fleet Management Bus Solutions provide a comprehensive package of safety, security, operational efficiency and cost-saving benefits, ultimately leading to improved service quality and customer satisfaction.
          </p>
          
          <div ref={addToStagger}>
            <Link href="/solutions" className={styles.ctaBtn}>
              Learn More
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
