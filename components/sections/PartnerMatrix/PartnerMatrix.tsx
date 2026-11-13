"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeCopy } from "@/lib/i18n/pageCopy";
import styles from "./PartnerMatrix.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function PartnerMatrix({ copy }: { copy: HomeCopy }) {
  const ECOSYSTEM_PARTNERS = [
    {
      id: "p1",
      name: copy.partnerCarrierName,
      logo: "/partners/logoklijent.jpg",
      integration: copy.partnerCarrierIntegration,
    },
    {
      id: "p2",
      name: copy.partnerHerlevName,
      logo: "/partners/logoklijent2.jpg",
      integration: copy.partnerHerlevIntegration,
    },
    {
      id: "p3",
      name: copy.partnerKobenhavnName,
      logo: "/partners/logoklijent3.jpg",
      integration: copy.partnerKobenhavnIntegration,
    },
    {
      id: "p4",
      name: copy.partnerOne2moveName,
      logo: "/partners/logoklijent4.jpg",
      integration: copy.partnerOne2moveIntegration,
    },
    {
      id: "p5",
      name: copy.partnerGenericName,
      logo: "/partners/logoklijent5.jpg",
      integration: copy.partnerGenericIntegration,
    },
    {
      id: "p6",
      name: copy.partnerEsecureName,
      logo: "/partners/logoklijent6.jpg",
      integration: copy.partnerEsecureIntegration,
    },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const textMasksRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [activePartner, setActivePartner] = useState<string | null>(null);

  textMasksRef.current = [];
  const addToTextMasks = (el: HTMLSpanElement | null) => {
    if (el) textMasksRef.current.push(el);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    if (tagRef.current) {
      tl.fromTo(
        tagRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }

    const textMasks = textMasksRef.current;
    if (textMasks.length) {
      tl.fromTo(
        textMasks,
        { y: "120%" },
        { y: "0%", duration: 0.8, stagger: 0.1, ease: "power4.out" },
        "-=0.2"
      );
    }

    if (subheadlineRef.current) {
      tl.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );
    }

    if (marqueeContainerRef.current) {
      tl.fromTo(
        marqueeContainerRef.current,
        { opacity: 0, scale: 0.95, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" },
        "-=0.4"
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section) t.kill();
      });
    };
  }, []);

  const topLane = [...ECOSYSTEM_PARTNERS, ...ECOSYSTEM_PARTNERS, ...ECOSYSTEM_PARTNERS];
  const bottomLane = [
    ...ECOSYSTEM_PARTNERS.slice(3),
    ...ECOSYSTEM_PARTNERS.slice(0, 3),
    ...ECOSYSTEM_PARTNERS.slice(3),
    ...ECOSYSTEM_PARTNERS.slice(0, 3),
  ];

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerBlock}>
          <div ref={tagRef} className={styles.sectionTag}>
            {copy.partnersTag}
          </div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={styles.textMaskInner}>
                {copy.partnersTitleLine1}
              </span>
            </span>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={`${styles.textMaskInner} ${styles.highlight}`}>
                {copy.partnersTitleLine2}
              </span>
            </span>
          </h2>
          <p ref={subheadlineRef} className={styles.subheadline}>
            {copy.partnersSub}
          </p>
        </div>

        <div ref={marqueeContainerRef} className={styles.marqueeContainer}>
          <div className={`${styles.marqueeRow} ${styles.scrollLeftFast}`}>
            {topLane.map((partner, idx) => (
              <div
                key={`top-${idx}`}
                onMouseEnter={() => setActivePartner(`top-${idx}`)}
                onMouseLeave={() => setActivePartner(null)}
                className={styles.truckCard}
              >
                <img src="/truck.png" alt="" className={styles.truckImage} />

                <div className={styles.truckDecal}>
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className={styles.partnerLogo}
                  />
                </div>

                <AnimatePresence>
                  {activePartner === `top-${idx}` && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: -20, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={styles.tooltipBadge}
                    >
                      <span className={styles.integrationText}>{partner.integration}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className={`${styles.marqueeRow} ${styles.scrollRight}`}>
            {bottomLane.map((partner, idx) => (
              <div
                key={`bottom-${idx}`}
                onMouseEnter={() => setActivePartner(`bottom-${idx}`)}
                onMouseLeave={() => setActivePartner(null)}
                className={styles.truckCard}
              >
                <img src="/truck.png" alt="" className={styles.truckImageRight} />

                <div className={styles.truckDecalRight}>
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className={styles.partnerLogo}
                  />
                </div>

                <AnimatePresence>
                  {activePartner === `bottom-${idx}` && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: -20, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={styles.tooltipBadge}
                    >
                      <span className={styles.integrationText}>{partner.integration}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
