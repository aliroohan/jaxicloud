"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import type { ServicesCopy } from "@/lib/i18n/pageCopy";
import styles from "./ServicesGrid.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ServicesGrid({ copy }: { copy: ServicesCopy }) {
  const PANELS = [
    {
      id: "purpose",
      title: copy.panelPurposeTitle,
      text: copy.panelPurposeText,
      image: "/images/service_environment.png"
    },
    {
      id: "task-list",
      title: copy.panelTaskListTitle,
      text: copy.panelTaskListText,
      image: "/images/task_1.png"
    },
    {
      id: "offers",
      title: copy.panelOffersTitle,
      text: copy.panelOffersText,
      image: "/images/route_optimization.png"
    },
    {
      id: "how-it-works",
      title: copy.panelHowTitle,
      text: copy.panelHowText,
      image: "/images/task_2.png"
    },
    {
      id: "control",
      title: copy.panelControlTitle,
      text: copy.panelControlText,
      image: "/images/control_center.png"
    },
    {
      id: "partner",
      title: copy.panelPartnerTitle,
      text: copy.panelPartnerText,
      image: "/images/driver_safety.png"
    }
  ];

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
            <div className={styles.tagline}>{copy.gridTag}</div>
            <h2 className={styles.introTitle}>
              {copy.gridIntroTitleBefore}{" "}
              <span className={styles.highlight}>{copy.gridIntroTitleHighlight}</span>
            </h2>
            <p className={styles.introDesc}>{copy.gridIntroDesc}</p>
            <div className={styles.scrollIndicator}>
              <span>{copy.gridScrollHint}</span>
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
