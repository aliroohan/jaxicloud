"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { BrandLogo } from "@/components/common/BrandLogo/BrandLogo";
import { useSplashScreen } from "@/lib/hooks/useSplashScreen";
import styles from "./SplashScreen.module.css";

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { isVisible, finishSplash } = useSplashScreen();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lock body scroll while splash is active
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  useEffect(() => {
    if (isVisible !== true) return;

    const wrapper = wrapperRef.current;
    const logo = logoRef.current;
    const shimmer = shimmerRef.current;
    const progressBar = progressBarRef.current;
    const tagline = taglineRef.current;
    const skipBtn = skipButtonRef.current;

    if (!wrapper || !logo) return;

    // Build GSAP Aperture Focus & Light Sweep Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        handleExit();
      },
    });

    // 1. Initial State
    gsap.set(logo, { opacity: 0, scale: 0.92, filter: "blur(12px)" });
    gsap.set(tagline, { opacity: 0, y: 12, filter: "blur(6px)" });
    gsap.set(shimmer, { opacity: 0, x: "-100%" });
    if (skipBtn) gsap.set(skipBtn, { opacity: 0 });

    // 2. Logo Reveal (0ms - 500ms)
    tl.to(logo, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.6,
      ease: "power3.out",
    });

    // 3. Progress Fill & Shimmer Sweep (400ms - 1200ms)
    tl.to(
      {},
      {
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: function () {
          const val = Math.round(this.progress() * 100);
          setProgress(val);
          if (progressBar) {
            progressBar.style.width = `${val}%`;
          }
        },
      },
      "-=0.3"
    );

    tl.to(
      shimmer,
      {
        opacity: 1,
        x: "300%",
        duration: 0.7,
        ease: "power2.out",
      },
      "-=0.7"
    );

    // 4. Tagline Unmasking (900ms - 1300ms)
    tl.to(
      tagline,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.4"
    );

    if (skipBtn) {
      tl.to(
        skipBtn,
        {
          opacity: 0.7,
          duration: 0.3,
        },
        "-=0.4"
      );
    }

    // 5. Brief Hold at 100% (1300ms - 1600ms)
    tl.to({}, { duration: 0.3 });

    function handleExit() {
      if (!wrapper) {
        finishSplash();
        onComplete?.();
        return;
      }

      gsap.to(wrapper, {
        opacity: 0,
        scale: 1.04,
        filter: "blur(16px)",
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          finishSplash();
          onComplete?.();
        },
      });
    }

    return () => {
      tl.kill();
    };
  }, [isVisible]);

  // If storage check has determined already seen, render nothing
  if (isVisible === false || isVisible === null) {
    return null;
  }

  const handleSkip = () => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      gsap.to(wrapper, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          finishSplash();
          onComplete?.();
        },
      });
    } else {
      finishSplash();
      onComplete?.();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.splashWrapper}
      aria-label="Loading JaxiCloud Fleet Intelligence Platform"
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.splashContent}>
        <div ref={logoRef} className={styles.logoContainer}>
          <BrandLogo size="lg" />
          <div ref={shimmerRef} className={styles.shimmerLayer} />
        </div>

        <div
          ref={taglineRef}
          className={styles.tagline}
          aria-hidden="true"
        >
          Connecting Every Fleet With Intelligence
        </div>

        <div className={styles.progressBarTrack} aria-hidden="true">
          <div ref={progressBarRef} className={styles.progressBarFill} />
        </div>
      </div>

      <button
        ref={skipButtonRef}
        type="button"
        onClick={handleSkip}
        className={styles.skipButton}
      >
        SKIP Intro ({progress}%)
      </button>
    </div>
  );
}
