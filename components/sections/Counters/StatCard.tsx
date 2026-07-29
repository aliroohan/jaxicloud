"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { StatDetail } from "./constants";
import { useCounter } from "./useCounter";
import { combinedCardVariants } from "./animations";
import styles from "./StatsSection.module.css";

interface StatCardProps {
  detail: StatDetail;
  index: number;
  inView: boolean;
}

export function StatCard({ detail, index, inView }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Parallax while scrolling
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax depth multiplier based on index
  const depth = (index % 2 === 0) ? 15 : 30;
  const yParallax = useTransform(scrollYProgress, [0, 1], [depth, -depth]);

  // Mouse Parallax (only enabled if not reduced motion)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Calculate distance from center of card (-1 to 1)
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    
    // Max movement 10px
    mouseX.set(x * 10);
    mouseY.set(y * 10);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Start counter only when GSAP reveals the card (inView true)
  const count = useCounter(detail.number, 2000, inView);

  return (
    <motion.div
      ref={cardRef}
      className={styles.statCardWrapper}
      style={{
        y: prefersReducedMotion ? 0 : yParallax,
        x: prefersReducedMotion ? 0 : smoothMouseX,
        translateY: prefersReducedMotion ? 0 : smoothMouseY,
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={`stat-card ${styles.statCard}`} // GSAP will target .stat-card
        variants={!prefersReducedMotion ? combinedCardVariants : undefined}
        initial="initial"
        whileHover={!prefersReducedMotion ? "hover" : undefined}
      >
        {/* Subtle glow underneath on hover is handled by box-shadow in variants */}
        
        <div className={styles.numberWrapper}>
          <motion.span 
            className={styles.chevronAccent}
            variants={{
              initial: { x: 0 },
              hover: { x: 6, color: "#29A8FF" }
            }}
          >
            {'>'}
          </motion.span>
          
          <div className={styles.numberDisplay}>
            <motion.span 
              className={styles.numberText}
              variants={{
                hover: { filter: "brightness(1.2)" }
              }}
            >
              {count}{detail.suffix}
            </motion.span>
          </div>
        </div>
        
        <motion.div 
          className={styles.cardLabel}
          variants={{
            hover: { letterSpacing: "0.08em" }
          }}
        >
          {detail.name}
        </motion.div>
        
        <div className={styles.cardDesc}>
          {detail.description}
        </div>
      </motion.div>
    </motion.div>
  );
}
