"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import styles from "./ServicesGrid.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PANELS = [
  {
    id: "purpose",
    title: "Purpose of the concept",
    text: "To give transport companies, hauliers and fleet owners access to their own digital monitoring center. Here they can manage and respond to incidents, breakdowns and operational disruptions themselves - faster and cheaper than with external help.",
    image: "/images/service_environment.png"
  },
  {
    id: "task-list",
    title: "Task list with cases",
    text: "All incidents, e.g. from the AI cameras, from driver alarms or error codes in the engine, appear as active tasks on a clear dashboard. From there they can be investigated, commented on and resolved.",
    image: "/images/task_1.png"
  },
  {
    id: "offers",
    title: "Dynamic Rules",
    text: "Define whether the respective case is active or inactive and which specific rules apply, such as speed limit, time limit, required sensors and which actions are triggered when an alarm occurs.",
    image: "/images/route_optimization.png"
  },
  {
    id: "how-it-works",
    title: "How it works in practice",
    text: "As soon as an alarm is triggered, it appears in the task list. The dispatcher checks the data, decides on the measures and records the progress until the case is completed and archived.",
    image: "/images/task_2.png"
  },
  {
    id: "control",
    title: "24/7 Control Center",
    text: "Act as your own monitoring center. Instead of relying on a third-party alarm center, you get full control, can respond immediately and save time and money on every incident.",
    image: "/images/control_center.png"
  },
  {
    id: "partner",
    title: "Rescue Partner",
    text: "A Rescue partner manages emergency alarms and security for transport companies, ensuring quick responses and optimal safety at all times.",
    image: "/images/driver_safety.png"
  }
];

export function ServicesGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    // Calculate total scroll distance
    // The track width minus the viewport width
    const getScrollAmount = () => {
      let trackWidth = trackRef.current ? trackRef.current.scrollWidth : 0;
      return -(trackWidth - window.innerWidth);
    };

    const tween = gsap.to(trackRef.current, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`, // Scroll distance equals track width
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    // Add Parallax to images
    imagesRef.current.forEach((img, i) => {
      if (img) {
        gsap.to(img, {
          x: "20vw", // Move image opposite to track direction to create parallax
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      }
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.horizontalSection}>
      <div ref={trackRef} className={styles.track}>
        
        {/* Intro Panel */}
        <div className={styles.introPanel}>
          <div className={styles.introContent}>
            <div className={styles.tagline}>CAPABILITIES</div>
            <h2 className={styles.introTitle}>Everything you need to <br/>take full <span className={styles.highlight}>control.</span></h2>
            <p className={styles.introDesc}>Scroll to explore the features that turn your daily operations into a seamless workflow.</p>
            <div className={styles.scrollIndicator}>
              <span>Scroll</span>
              <ArrowRight className={styles.arrowIcon} />
            </div>
          </div>
        </div>

        {/* Feature Panels */}
        {PANELS.map((panel, index) => (
          <div key={panel.id} className={styles.panel}>
            <div className={styles.panelInner}>
              {/* Background Image with Parallax */}
              <div className={styles.imageWrapper}>
                <Image
                  ref={(el) => { imagesRef.current[index] = el; }}
                  src={panel.image}
                  alt={panel.title}
                  fill
                  className={styles.parallaxImage}
                />
                <div className={styles.imageOverlay} />
              </div>
              
              {/* Content */}
              <div className={styles.panelContent}>
                <div className={styles.panelNumber}>0{index + 1}</div>
                <h3 className={styles.panelTitle}>{panel.title}</h3>
                <p className={styles.panelText}>{panel.text}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Outro Spacing so the last panel doesn't slam into the edge */}
        <div className={styles.outroSpacer} />

      </div>
    </section>
  );
}
