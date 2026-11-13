"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Map, Droplet, Shield, FileText } from "lucide-react";
import type { HomeCopy } from "@/lib/i18n/pageCopy";
import styles from "./ServicesStory.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ServicesStory({ copy }: { copy: HomeCopy }) {
  const SERVICES_DATA = [
    {
      id: "route-optimization",
      title: copy.serviceRouteTitle,
      description: copy.serviceRouteDesc,
      image: "/images/route_optimization_light.png",
      icon: Map,
    },
    {
      id: "fuel-control",
      title: copy.serviceFuelTitle,
      description: copy.serviceFuelDesc,
      image: "/images/fuel_control_light.png",
      icon: Droplet,
    },
    {
      id: "driver-safety",
      title: copy.serviceSafetyTitle,
      description: copy.serviceSafetyDesc,
      image: "/images/driver_safety_light.png",
      icon: Shield,
    },
    {
      id: "compliance",
      title: copy.serviceComplianceTitle,
      description: copy.serviceComplianceDesc,
      image: "/images/compliance_reporting_light.png",
      icon: FileText,
    }
  ];

  const [activeId, setActiveId] = useState<string>(SERVICES_DATA[0].id);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Reset refs on render
  cardsRef.current = [];
  const addToCards = (el: HTMLDivElement | null) => {
    if (el) cardsRef.current.push(el);
  };

  useEffect(() => {
    if (!containerRef.current || !headerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // 1. Header fades and floats up
    tl.fromTo(
      headerRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
    );

    // 2. Cards fly in with a luxury 3D tilt and elastic bounce
    const cards = cardsRef.current;
    if (cards.length) {
      tl.fromTo(
        cards,
        { opacity: 0, y: 100, scale: 0.9, rotateX: 15 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "elastic.out(1, 0.6)",
          clearProps: "all", // CRUCIAL: strip GSAP styles so framer-motion/CSS hover can work
        },
        "-=0.6" // start while header is still animating in
      );
    }
  }, []);

  return (
    <section ref={containerRef} className={styles.sectionContainer}>
      <div className={styles.innerContainer}>
        
        <div ref={headerRef} className={styles.header}>
          <div className={styles.tagline}>{copy.servicesStoryTag}</div>
          <h2 className={styles.mainTitle}>
            {copy.servicesStoryTitleBefore} <span className={styles.highlight}>{copy.servicesStoryTitleHighlight}</span>
          </h2>
          <p className={styles.subtext}>
            {copy.servicesStorySub}
          </p>
        </div>

        <div className={styles.accordionContainer}>
          {SERVICES_DATA.map((service) => {
            const isActive = activeId === service.id;
            const Icon = service.icon;

            return (
              <motion.div
                key={service.id}
                layout
                ref={addToCards}
                onMouseEnter={() => setActiveId(service.id)}
                className={`${styles.accordionCard} ${isActive ? styles.cardActive : styles.cardInactive}`}
                transition={{ layout: { type: "spring", damping: 25, stiffness: 200 } }}
              >
                {/* Background Image (always present, but obscured/scaled depending on state) */}
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className={styles.cardImage} 
                />
                <div className={styles.imageOverlay} />

                {/* Content Container */}
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div className={`${styles.iconPod} ${isActive ? styles.iconPodActive : ""}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className={styles.cardTextContent}>
                    <h3 className={styles.cardTitle}>{service.title}</h3>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
                        >
                          <p className={styles.cardDesc}>{service.description}</p>
                          <div className={styles.exploreLink}>
                            <span>{copy.serviceExploreLink}</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
