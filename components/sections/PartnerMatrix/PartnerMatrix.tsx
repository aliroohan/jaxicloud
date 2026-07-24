"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, ShieldCheck } from "lucide-react";
import styles from "./PartnerMatrix.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ECOSYSTEM_PARTNERS = [
  { id: "p1", name: "Volvo Trucks", category: "OEM VEHICLE GATEWAY", integration: "Direct J1939 CANbus Telemetry Sync" },
  { id: "p2", name: "Daimler Truck", category: "OEM VEHICLE GATEWAY", integration: "Native Powertrain DTC Reading" },
  { id: "p3", name: "AWS IoT Core", category: "CLOUD INFRASTRUCTURE", integration: "Sub-Second Telematics Stream Relay" },
  { id: "p4", name: "SAP S/4HANA", category: "ENTERPRISE ERP", integration: "Automated Fleet Billing & Dispatch API" },
  { id: "p5", name: "Salesforce", category: "FIELD SERVICE CRM", integration: "Real-Time Work Order & ETA Sync" },
  { id: "p6", name: "Geotab OS", category: "TELEMATICS ECOSYSTEM", integration: "Cross-Platform Gateway Data Sync" },
  { id: "p7", name: "DHL Logistics", category: "CARRIER NETWORK", integration: "Cold-Chain Thermal Alert Relay" },
  { id: "p8", name: "Amazon Freight", category: "LOGISTICS NETWORK", integration: "Autonomous Geofence ETA Tracking" },
  { id: "p9", name: "AT&T IoT LTE", category: "CARRIER CONNECTIVITY", integration: "Multi-Carrier Global 4G/5G LTE" },
  { id: "p10", name: "Verizon Connect", category: "CARRIER CONNECTIVITY", integration: "Dual-Band Gateway Fallback" },
  { id: "p11", name: "Continental", category: "HARDWARE SENSORS", integration: "Wireless BLE Tire TPMS Sensor Pods" },
  { id: "p12", name: "Samsara OS", category: "TELEMATICS ECOSYSTEM", integration: "Unified Telematics REST API Sync" },
];

export function PartnerMatrix() {
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

    // 1. Tag fade in
    if (tagRef.current) {
      tl.fromTo(
        tagRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }

    // 2. Apple-style Text Mask Reveal for the Heading
    const textMasks = textMasksRef.current;
    if (textMasks.length) {
      tl.fromTo(
        textMasks,
        { y: "120%" },
        { y: "0%", duration: 0.8, stagger: 0.1, ease: "power4.out" },
        "-=0.2"
      );
    }

    // 3. Fade in subheadline
    if (subheadlineRef.current) {
      tl.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );
    }

    // 4. Marquee pop-up
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

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerBlock}>
          <div ref={tagRef} className={styles.sectionTag}>
            ENTERPRISE ECOSYSTEM PARTNERS
          </div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={styles.textMaskInner}>Integrated Across Global Fleet</span>
            </span>
            <span className={styles.textMask}>
              <span ref={addToTextMasks} className={`${styles.textMaskInner} ${styles.highlight}`}>Ecosystems.</span>
            </span>
          </h2>
          <p ref={subheadlineRef} className={styles.subheadline}>
            Native out-of-the-box integration with vehicle OEMs, enterprise ERPs,
            cloud networks, and logistics management platforms.
          </p>
        </div>

        {/* Infinite Partner Marquees - Highway Traffic! */}
        <div ref={marqueeContainerRef} className={styles.marqueeContainer}>
          
          {/* Top Lane: Fast Highway (Right to Left) */}
          <div className={`${styles.marqueeRow} ${styles.scrollLeftFast}`}>
            {[...ECOSYSTEM_PARTNERS, ...ECOSYSTEM_PARTNERS, ...ECOSYSTEM_PARTNERS].map((partner, idx) => (
              <div
                key={`top-${idx}`}
                onMouseEnter={() => setActivePartner(`top-${idx}`)}
                onMouseLeave={() => setActivePartner(null)}
                className={styles.truckCard}
              >
                <img src="/truck.png" alt="Truck" className={styles.truckImage} />
                
                {/* Partner Name painted on the trailer */}
                <div className={styles.truckDecal}>
                  <Layers className={styles.decalIcon} size={28} />
                  <span>{partner.name}</span>
                </div>

                {/* Floating Glass Tooltip */}
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

          {/* Bottom Lane: Heavy Load (Right to Left, slightly slower) */}
          <div className={`${styles.marqueeRow} ${styles.scrollLeftSlow}`}>
            {/* Start from halfway through the list to randomize */}
            {[...ECOSYSTEM_PARTNERS.slice(6), ...ECOSYSTEM_PARTNERS.slice(0, 6), ...ECOSYSTEM_PARTNERS.slice(6), ...ECOSYSTEM_PARTNERS.slice(0, 6)].map((partner, idx) => (
              <div
                key={`bottom-${idx}`}
                onMouseEnter={() => setActivePartner(`bottom-${idx}`)}
                onMouseLeave={() => setActivePartner(null)}
                className={styles.truckCard}
              >
                <img src="/truck.png" alt="Truck" className={styles.truckImage} />
                
                {/* Partner Name painted on the trailer */}
                <div className={styles.truckDecal}>
                  <Layers className={styles.decalIcon} size={28} />
                  <span>{partner.name}</span>
                </div>

                {/* Floating Glass Tooltip */}
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
