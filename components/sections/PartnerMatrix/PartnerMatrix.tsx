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
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activePartner, setActivePartner] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerBlock}>
          <div className={styles.sectionTag}>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            <span>ENTERPRISE ECOSYSTEM PARTNERS</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Integrated Across Global Fleet Ecosystems.
          </h2>
          <p className={styles.subheadline}>
            Native out-of-the-box integration with vehicle OEMs, enterprise ERPs,
            cloud networks, and logistics management platforms.
          </p>
        </div>

        {/* 4x3 Interactive Partner Matrix Grid */}
        <div className={styles.matrixGrid}>
          {ECOSYSTEM_PARTNERS.map((partner, idx) => (
            <div
              key={partner.id}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              onMouseEnter={() => setActivePartner(partner.id)}
              onMouseLeave={() => setActivePartner(null)}
              className={styles.partnerCard}
            >
              <div className={styles.partnerLogoName}>{partner.name}</div>
              <div className={styles.partnerCategory}>{partner.category}</div>

              {/* Floating Glass Tooltip */}
              <AnimatePresence>
                {activePartner === partner.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.92 }}
                    transition={{ duration: 0.18 }}
                    className={styles.tooltipBadge}
                  >
                    {partner.integration}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
