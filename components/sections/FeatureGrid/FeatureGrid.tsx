"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Camera, Cpu, Layers, Navigation, ShieldCheck, Wifi } from "lucide-react";
import styles from "./FeatureGrid.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function FeatureGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leadCardRef = useRef<HTMLDivElement>(null);
  const supportingCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeTab, setActiveTab] = useState<"gps" | "ai" | "canbus">("gps");

  useEffect(() => {
    const section = sectionRef.current;
    const leadCard = leadCardRef.current;
    const supporting = supportingCardsRef.current;

    if (!section || !leadCard) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    // 1. Lead Card Stagger
    tl.fromTo(
      leadCard,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
    );

    // 2. Supporting Cards Sequential Stagger
    tl.fromTo(
      supporting,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      },
      "-=0.5"
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.featureSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerBlock}>
          <div className={styles.sectionTag}>
            <Layers className="w-3.5 h-3.5" />
            <span>FLEET INTELLIGENCE ENGINE</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Fleet Hardware Architecture. Unified Into One System.
          </h2>
          <p className={styles.subheadline}>
            Connecting high-definition vision, satellite GPS, CANbus engine
            diagnostics, and wireless sensor telemetry into a single real-time
            cloud dashboard.
          </p>
        </div>

        {/* Asymmetrical 12-Column Grid */}
        <div className={styles.gridAsymmetrical}>
          {/* Left Column (7 Cols): Lead Hero Feature Card */}
          <div ref={leadCardRef} className={`${styles.cardBase} ${styles.leadCard}`}>
            <div className={styles.leadHeader}>
              <h3 className={styles.leadTitle}>
                Unified Telematics Operating System
              </h3>
              <p className={styles.leadDesc}>
                Single-pane visibility across video feeds, satellite location,
                engine health, and driver safety scores. Engineered to scale from 10
                to 50,000+ assets.
              </p>
              <div className={styles.badgeRow}>
                <span className={styles.badge}>REST API 2.0</span>
                <span className={styles.badge}>CANBUS 2.0B</span>
                <span className={styles.badge}>4K EDGE AI</span>
                <span className={styles.badge}>BLE 5.2</span>
              </div>
            </div>

            {/* Interactive Telemetry Tab Switcher Widget */}
            <div className={styles.widgetStage}>
              <div className={styles.tabPillRow}>
                <button
                  type="button"
                  onClick={() => setActiveTab("gps")}
                  className={`${styles.tabPill} ${
                    activeTab === "gps" ? styles.tabPillActive : ""
                  }`}
                >
                  Live GPS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ai")}
                  className={`${styles.tabPill} ${
                    activeTab === "ai" ? styles.tabPillActive : ""
                  }`}
                >
                  Edge AI Vision
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("canbus")}
                  className={`${styles.tabPill} ${
                    activeTab === "canbus" ? styles.tabPillActive : ""
                  }`}
                >
                  CANbus Telemetry
                </button>
              </div>

              {/* Tab Content Output */}
              <AnimatePresence mode="wait">
                {activeTab === "gps" && (
                  <motion.div
                    key="gps"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className={styles.telemetryOutput}
                  >
                    <div className={styles.telemetryBox}>
                      <div className={styles.telemetryLabel}>Coordinates</div>
                      <div className={styles.telemetryVal}>37.7749° N, 122.4194° W</div>
                    </div>
                    <div className={styles.telemetryBox}>
                      <div className={styles.telemetryLabel}>Speed / Status</div>
                      <div className={styles.telemetryVal}>62 MPH • In Route</div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "ai" && (
                  <motion.div
                    key="ai"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className={styles.telemetryOutput}
                  >
                    <div className={styles.telemetryBox}>
                      <div className={styles.telemetryLabel}>ADAS Vision Engine</div>
                      <div className={styles.telemetryVal}>Dual 4K LTE Stream</div>
                    </div>
                    <div className={styles.telemetryBox}>
                      <div className={styles.telemetryLabel}>Driver Safety Score</div>
                      <div className={styles.telemetryVal}>98/100 • Zero Distraction</div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "canbus" && (
                  <motion.div
                    key="canbus"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className={styles.telemetryOutput}
                  >
                    <div className={styles.telemetryBox}>
                      <div className={styles.telemetryLabel}>Diagnostic DTCs</div>
                      <div className={styles.telemetryVal}>NO_FAULTS • 100% OK</div>
                    </div>
                    <div className={styles.telemetryBox}>
                      <div className={styles.telemetryLabel}>Fuel Efficiency</div>
                      <div className={styles.telemetryVal}>9.4 L/100km • Optimal</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column (5 Cols): 4 Supporting Capability Cards */}
          <div className={styles.supportingGrid}>
            {/* Supporting 1 */}
            <div
              ref={(el) => {
                supportingCardsRef.current[0] = el;
              }}
              className={`${styles.cardBase} ${styles.supportingCard}`}
            >
              <div>
                <div className={styles.iconPod}>
                  <Camera className="w-5 h-5" />
                </div>
                <h4 className={styles.cardTitle}>Edge AI Dual Cameras</h4>
                <p className={styles.cardBody}>
                  Road and cabin dual 4K video vision detecting tailgating, fatigue,
                  and lane drift in sub-seconds.
                </p>
              </div>
              <Link href="/products?category=dash-cameras" className={styles.cardFooterLink}>
                <span>Explore AI Cameras</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Supporting 2 */}
            <div
              ref={(el) => {
                supportingCardsRef.current[1] = el;
              }}
              className={`${styles.cardBase} ${styles.supportingCard}`}
            >
              <div>
                <div className={styles.iconPod}>
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className={styles.cardTitle}>CANbus & Engine DTCs</h4>
                <p className={styles.cardBody}>
                  Direct OBD-II & J1939 CANbus reading for instant engine fault codes
                  and fuel monitoring.
                </p>
              </div>
              <Link href="/products?category=gps-trackers" className={styles.cardFooterLink}>
                <span>Explore Trackers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Supporting 3 */}
            <div
              ref={(el) => {
                supportingCardsRef.current[2] = el;
              }}
              className={`${styles.cardBase} ${styles.supportingCard}`}
            >
              <div>
                <div className={styles.iconPod}>
                  <Navigation className="w-5 h-5" />
                </div>
                <h4 className={styles.cardTitle}>Autonomous Geofence Engine</h4>
                <p className={styles.cardBody}>
                  Instant push alerts upon unauthorized route deviation, speed violation,
                  or engine start.
                </p>
              </div>
              <Link href="/solutions/fleet-tracking" className={styles.cardFooterLink}>
                <span>Explore Tracking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Supporting 4 */}
            <div
              ref={(el) => {
                supportingCardsRef.current[3] = el;
              }}
              className={`${styles.cardBase} ${styles.supportingCard}`}
            >
              <div>
                <div className={styles.iconPod}>
                  <Wifi className="w-5 h-5" />
                </div>
                <h4 className={styles.cardTitle}>Enterprise ERP Integration</h4>
                <p className={styles.cardBody}>
                  Seamless REST APIs syncing vehicle telemetry directly into SAP, Salesforce,
                  and custom WMS systems.
                </p>
              </div>
              <Link href="/solutions" className={styles.cardFooterLink}>
                <span>Explore Integrations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
