"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to smoothly count from 0 to target value.
 * Preserves decimal places if target is a float (like 99.98).
 */
export function useCounter(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const frameRef = useRef<number>(0);
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }

    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = timestamp - startTime.current;
      
      const t = Math.min(progress / duration, 1);
      const easedT = easeOutExpo(t);
      
      setCount(easedT * target);

      if (t < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      startTime.current = null;
    };
  }, [target, duration, start, prefersReducedMotion]);

  // Determine decimal places dynamically
  const isFloat = !Number.isInteger(target);
  const decimals = isFloat ? 2 : 0;

  // Format with commas and fixed decimals
  return count.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
