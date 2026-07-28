"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, MapPin, Droplet, Activity, Scale, Timer, MousePointer2 } from "lucide-react";
import styles from "./ConstructorCommandCenter.module.css";

const features = [
  {
    id: "gps",
    title: "GPS tracking & movement history",
    subtitle: "Know exactly where your machines are and how they are used.",
    icon: <MapPin size={32} className={styles.iconBlue} />,
    x: 45, // Top of cabin
    y: 35,
    value: "Live",
    status: "Tracking",
  },
  {
    id: "canbus",
    title: "CAN Bus data integration",
    subtitle: "Access engine data, RPM, working hours, and operational status.",
    icon: <Zap size={32} className={styles.iconBlue} />,
    x: 25, // Engine area
    y: 55,
    value: "Active",
    status: "Integrated",
  },
  {
    id: "fuelLevel",
    title: "Fuel level monitoring (probes)",
    subtitle: "Detect fuel theft and ensure accurate consumption tracking.",
    icon: <Droplet size={32} className={styles.iconBlue} />,
    x: 35, // Fuel tank
    y: 65,
    value: "92%",
    status: "Secured",
  },
  {
    id: "fuelConsumption",
    title: "Fuel consumption (flowmeters)",
    subtitle: "Measure real fuel usage with high precision.",
    icon: <Activity size={32} className={styles.iconBlue} />,
    x: 30, // Fuel line / engine
    y: 60,
    value: "4.2 L/h",
    status: "Optimal",
  },
  {
    id: "weight",
    title: "Weight sensors & load monitoring",
    subtitle: "Track productivity and prevent overloading.",
    icon: <Scale size={32} className={styles.iconBlue} />,
    x: 80, // Arm/bucket
    y: 75,
    value: "14.5 T",
    status: "Load OK",
  },
  {
    id: "idle",
    title: "Idle time & utilization analysis",
    subtitle: "Optimize machine usage and reduce downtime.",
    icon: <Timer size={32} className={styles.iconBlue} />,
    x: 52, // Cabin
    y: 48,
    value: "12 mins",
    status: "Analyzing",
  }
];

export function ConstructorCommandCenter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      // Pin the right column (the image) while scrolling through the left column
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: rightColRef.current,
        pinSpacing: false,
      });

      // Highlight corresponding text and hotspot as you scroll
      textRefs.current.forEach((textEl, index) => {
        if (!textEl) return;
        
        ScrollTrigger.create({
          trigger: textEl,
          start: "center center",
          end: "bottom center",
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
        });

        // Opacity animation for text blocks
        gsap.to(textEl, {
          scrollTrigger: {
            trigger: textEl,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
          opacity: 1,
          scale: 1,
          ease: "power2.inOut",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.storySection} ref={containerRef}>
      <div className={styles.container}>
        
        {/* Left Column (Scrolling Text Story) */}
        <div className={styles.leftCol} ref={leftColRef}>
          <div className={styles.introHeader}>
            <h2 className={styles.title}>Complete Machine Monitoring in <br/> <span className={styles.highlight}>Real Time.</span></h2>
            <p className={styles.subtitle}>We provide advanced tracking and monitoring of all critical machine parameters:</p>
          </div>

          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className={`${styles.textBlock} ${activeStep === index ? styles.textActive : styles.textInactive}`}
              ref={(el) => { textRefs.current[index] = el; }}
            >
              <div className={styles.iconWrapper}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureSubtitle}>{feature.subtitle}</p>
            </div>
          ))}

          {/* Conclusion Text at the very bottom */}
          <div className={styles.conclusionBlock}>
            <p className={styles.conclusionText}>
              All data is available in a centralized dashboard, giving you actionable insights in real time.
            </p>
          </div>

          <div className={styles.spacer} />
        </div>

        {/* Right Column (Pinned Image & Hotspots) */}
        <div className={styles.rightCol} ref={rightColRef}>
          <div className={styles.imageContainer}>
            <Image
              src="/images/excavator_hotspots.png"
              alt="Excavator Analysis"
              fill
              className={styles.excavatorImage}
            />
            <div className={styles.imageOverlay} />

            {/* Virtual Mouse Cursor that moves to the active feature */}
            <div 
              className={styles.virtualCursor}
              style={{ 
                left: `${features[activeStep].x}%`, 
                top: `${features[activeStep].y}%` 
              }}
            >
              {/* Connecting line (Visual effect) */}
              <div className={styles.connectionLine} key={`line-${activeStep}`} />

              {/* Animated selection box that draws itself on each step change */}
              <div className={styles.selectionBox} key={`box-${activeStep}`}>
                
                {/* The Cursor Icon attached to the bottom right of the box */}
                <MousePointer2 
                  size={32} 
                  className={styles.cursorIcon} 
                  fill="#1e293b" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
