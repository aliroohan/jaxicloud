"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ServicesCopy } from "@/lib/i18n/pageCopy";
import styles from "./ServicesHero.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ServicesHero({ copy }: { copy: ServicesCopy }) {
  const containerRef = useRef<HTMLElement>(null);
  const textLinesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mockupWrapperRef = useRef<HTMLDivElement>(null);
  const mockupInnerRef = useRef<HTMLDivElement>(null);
  const mockupShadowRef = useRef<HTMLDivElement>(null);
  const textColumnRef = useRef<HTMLDivElement>(null);

  // Framer Motion for subtle continuous floating
  const floatY = useMotionValue(0);
  const floatSpring = useSpring(floatY, { damping: 10, stiffness: 50 });
  const floatTransform = useTransform(floatSpring, [-1, 1], [-15, 15]);

  useEffect(() => {
    // 1. Initial Load Animation (Graceful Drop-In)
    const loadTl = gsap.timeline();
    
    // Set initial states
    gsap.set(textLinesRef.current, { y: "-100%" }); // Start above the overflow hidden mask
    gsap.set([subtitleRef.current, buttonRef.current], { opacity: 0, y: 20 });
    
    // Set 3D initial state for the mockup
    gsap.set(mockupWrapperRef.current, { 
      rotationX: 15, 
      rotationY: -25, 
      rotationZ: 5,
      scale: 0.85,
      opacity: 0,
      y: 100,
      transformPerspective: 1000
    });

    loadTl
      .to(textLinesRef.current, {
        y: "0%",
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.2
      })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.8")
      .to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.8")
      .to(mockupWrapperRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
      }, "-=1.2");

    // Continuous floating animation (Framer Motion is driven by a `setInterval` or we can just use GSAP yoyo)
    // Actually, GSAP is cleaner for an infinite yoyo float here.
    const floatAnim = gsap.to(mockupWrapperRef.current, {
      y: "-=20",
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    // 2. Scroll Storytelling (Rotating UI Mockup)
    if (!containerRef.current) return;

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%", // Scroll distance
        scrub: 1, // Smooth scrub
        pin: true,
        onUpdate: () => {
          // Pause the infinite float while scrubbing, or let them combine?
          // We can just let them combine, GSAP handles it smoothly.
        }
      },
    });

    // Elements to fade out on the left
    // We animate the parent column instead of the individual children
    // to prevent conflicts with the initial load timeline.
    scrollTl
      .to(textColumnRef.current, {
        opacity: 0,
        x: -100,
        duration: 1,
        ease: "power2.inOut"
      })
      .to(mockupWrapperRef.current, {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 1.8,
        x: "-25vw", // Shift left slightly to center
        duration: 2,
        ease: "power3.inOut"
      }, "-=1")
      .to(mockupInnerRef.current, {
        borderRadius: "0px", // Remove border radius so it becomes a perfect rectangle
        duration: 2,
        ease: "power3.inOut"
      }, "-=2")
      .to(mockupShadowRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=2");

    return () => {
      loadTl.kill();
      scrollTl.kill();
      floatAnim.kill();
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.heroSection}>
      <div className={styles.stickyContent}>
        
        {/* Left: Typography & CTA */}
        <div ref={textColumnRef} className={styles.textColumn}>
          <h1 className={styles.headline}>
            <div className={styles.lineMask}>
              <span ref={el => { textLinesRef.current[0] = el; }}>{copy.heroLine1}</span>
            </div>
            <div className={styles.lineMask}>
              <span ref={el => { textLinesRef.current[1] = el; }}>{copy.heroLine2}</span>
            </div>
            <div className={styles.lineMask}>
              <span ref={el => { textLinesRef.current[2] = el; }} className={styles.highlight}>{copy.heroLine3}</span>
            </div>
          </h1>
          <p ref={subtitleRef} className={styles.subtitle}>
            {copy.heroSub}
          </p>
          <div className={styles.ctaWrapper}>
            <button 
              ref={buttonRef} 
              className={styles.primaryButton}
              onClick={() => {
                document.getElementById('contact-terminal')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {copy.heroCta}
            </button>
          </div>
        </div>

        {/* Right: Floating 3D SaaS Mockup */}
        <div className={styles.mockupColumn}>
          <div ref={mockupWrapperRef} className={styles.mockupWrapper}>
            <div ref={mockupInnerRef} className={styles.mockupInner}>
              <Image
                src="/images/service_environment.png"
                alt={copy.heroMockupAlt}
                fill
                priority
                className={styles.mockupImage}
              />
            </div>
            {/* Soft decorative shadow below the mockup */}
            <div ref={mockupShadowRef} className={styles.mockupShadow} />
          </div>
        </div>

      </div>
    </section>
  );
}
