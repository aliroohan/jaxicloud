"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const pathsRef = useRef<(SVGPathElement | null)[]>([]);
  const keywordsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  textMasksRef.current = [];
  const addToTextMasks = (el: HTMLSpanElement | null) => {
    if (el) textMasksRef.current.push(el);
  };

  staggerItemsRef.current = [];
  const addToStagger = (el: HTMLElement | null) => {
    if (el) staggerItemsRef.current.push(el);
  };

  pathsRef.current = [];
  const addToPaths = (el: SVGPathElement | null) => {
    if (el) pathsRef.current.push(el);
  };

  keywordsRef.current = [];
  const addToKeywords = (el: HTMLAnchorElement | null) => {
    if (el) keywordsRef.current.push(el);
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

    // Energy Links & Robotic Text Reveal
    const paths = pathsRef.current;
    const keywords = keywordsRef.current;
    
    if (paths.length && keywords.length) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
      
      tl.addLabel("drawLines", "-=0.2");
      
      paths.forEach((path, index) => {
        if (!path) return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
        
        // 1. Draw the line (starts with heading animation)
        tl.to(path, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.inOut",
        }, "drawLines");

        // 2. Scramble Text Reveal (starts when line is almost finished drawing)
        const kw = keywords[index];
        const finalWord = kw?.getAttribute("data-word") || "";
        const scrambleObj = { progress: 0 };
        
        if (kw) {
          tl.to(scrambleObj, {
            progress: 1,
            duration: 1,
            ease: "none",
            onUpdate: () => {
              let res = "";
              const revealCount = Math.floor(scrambleObj.progress * finalWord.length);
              for (let i = 0; i < finalWord.length; i++) {
                if (i < revealCount) {
                  res += finalWord[i];
                } else {
                  res += chars[Math.floor(Math.random() * chars.length)];
                }
              }
              kw.innerText = res;
              kw.style.opacity = "1";
              kw.style.textShadow = `0 0 ${10 - (scrambleObj.progress * 10)}px #38bdf8`;
            }
          }, "drawLines+=0.8"); // Trigger slightly before the line finishes
        }
      });
    }

    // Subtle parallax zoom on the background image as you scroll through the section
    gsap.fromTo(
      bgImageRef.current,
      { scale: 1.05 },
      {
        scale: 1.20,
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
          src="/advanced-fleet-bg.png"
          alt="Advanced AI Fleet Management"
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
              <span className={styles.btnText}>Learn More</span>
              <div className={styles.btnGlow} />
            </Link>
          </div>
        </div>

        {/* Neural Network Energy Links */}
        <div className={styles.networkContainer}>
          <svg className={styles.networkSvg} viewBox="0 0 500 500" preserveAspectRatio="none">
            <defs>
              <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(56, 189, 248, 0)" />
                <stop offset="50%" stopColor="rgba(56, 189, 248, 0.5)" />
                <stop offset="100%" stopColor="rgba(56, 189, 248, 1)" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Smooth branching paths - shortened to prevent text overflow */}
            <path ref={addToPaths} className={`${styles.networkPath} ${hoveredIndex === 0 ? styles.pathHovered : ""}`} d="M 0,250 C 100,250 150,50 280,50" />
            <path ref={addToPaths} className={`${styles.networkPath} ${hoveredIndex === 1 ? styles.pathHovered : ""}`} d="M 0,250 C 100,250 150,150 320,150" />
            <path ref={addToPaths} className={`${styles.networkPath} ${hoveredIndex === 2 ? styles.pathHovered : ""}`} d="M 0,250 C 120,245 180,255 350,250" />
            <path ref={addToPaths} className={`${styles.networkPath} ${hoveredIndex === 3 ? styles.pathHovered : ""}`} d="M 0,250 C 100,250 150,350 320,350" />
            <path ref={addToPaths} className={`${styles.networkPath} ${hoveredIndex === 4 ? styles.pathHovered : ""}`} d="M 0,250 C 100,250 150,450 280,450" />
          </svg>
          
          <Link 
            href="/solutions"
            ref={addToKeywords} 
            className={`${styles.keyword} ${styles.kw1} ${hoveredIndex === 0 ? styles.keywordHovered : ""}`} 
            data-word="Solutions"
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
          <Link 
            href="/solutions/security"
            ref={addToKeywords} 
            className={`${styles.keyword} ${styles.kw2} ${hoveredIndex === 1 ? styles.keywordHovered : ""}`} 
            data-word="Security"
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
          <Link 
            href="/solutions/efficiency"
            ref={addToKeywords} 
            className={`${styles.keyword} ${styles.kw3} ${hoveredIndex === 2 ? styles.keywordHovered : ""}`} 
            data-word="Efficiency"
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
          <Link 
            href="/solutions/service-quality"
            ref={addToKeywords} 
            className={`${styles.keyword} ${styles.kw4} ${hoveredIndex === 3 ? styles.keywordHovered : ""}`} 
            data-word="Service Quality"
            onMouseEnter={() => setHoveredIndex(3)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
          <Link 
            href="/solutions/satisfaction"
            ref={addToKeywords} 
            className={`${styles.keyword} ${styles.kw5} ${hoveredIndex === 4 ? styles.keywordHovered : ""}`} 
            data-word="Satisfaction"
            onMouseEnter={() => setHoveredIndex(4)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        </div>
      </div>

    </section>
  );
}
