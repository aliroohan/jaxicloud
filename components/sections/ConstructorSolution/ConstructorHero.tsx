"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import styles from "./ConstructorHero.module.css";

export function ConstructorHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLSpanElement>(null);
  const title2Ref = useRef<HTMLSpanElement>(null);
  const title3Ref = useRef<HTMLSpanElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      // Initial Load Animation
      const tl = gsap.timeline();

      tl.to(overlayRef.current, {
        opacity: 0.6,
        duration: 2,
        ease: "power2.inOut"
      })
      .to(imageRef.current, {
        scale: 1,
        duration: 2.5,
        ease: "power3.out"
      }, "-=2")
      .fromTo([title1Ref.current, title2Ref.current, title3Ref.current], {
        y: 100,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      }, "-=1.5");

      // Scroll Animation (Parallax and Fade Out)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        }
      });

      scrollTl
        .to(imageRef.current, {
          y: 200,
          scale: 1.1,
        }, 0)
        .to(textContentRef.current, {
          y: -100,
          opacity: 0,
        }, 0);
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className={styles.heroSection} ref={containerRef}>
      
      {/* Background Image */}
      <div className={styles.backgroundWrapper}>
        <Image
          ref={imageRef}
          src="/images/excavator_hero.png"
          alt="Heavy Construction Machinery"
          fill
          priority
          className={styles.backgroundImage}
        />
        {/* Dark Overlay for Cinematic Feel */}
        <div ref={overlayRef} className={styles.overlay} />
      </div>

      {/* Foreground Content */}
      <div className={styles.contentContainer}>
        
        {/* Massive Headline */}
        <div className={styles.textContent} ref={textContentRef}>
          <h1 className={styles.headline}>
            <div className={styles.lineMask}>
              <span ref={title1Ref}>Master the Site.</span>
            </div>
            <div className={styles.lineMask}>
              <span ref={title2Ref}>Control the</span>
            </div>
            <div className={styles.lineMask}>
              <span ref={title3Ref} className={styles.highlight}>Machine.</span>
            </div>
          </h1>
        </div>
      </div>

    </section>
  );
}
