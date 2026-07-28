"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import styles from "./SolutionsSection.module.css";

const SOLUTIONS_DATA = [
  {
    id: "long-haul-logistics",
    industry: "FREIGHT & LOGISTICS",
    tabLabel: "Freight Logistics",
    title: "Long-Haul Freight & Highway Logistics",
    description:
      "Continuous 4K ADAS video coverage, fuel consumption tracking, and CANbus engine DTC diagnostics engineered for heavy-duty freight fleets.",
    bundle: "Includes: 1x JaxiCam AI + 1x JaxiTrack Pro OBD-II + 1x Fuel Telemetry Probe",
    image: "https://images.unsplash.com/photo-1544620341-1ada2ff8c6ef?auto=format&fit=crop&w=1200&q=80",
    href: "/solutions/fleet-tracking",
    hotspots: [
      { id: "h1", top: "32%", left: "42%", label: "JaxiCam AI (4K ADAS Windshield)" },
      { id: "h2", top: "58%", left: "55%", label: "JaxiTrack Pro (CANbus Diagnostics)" },
      { id: "h3", top: "72%", left: "70%", label: "Fuel Telemetry Probe" },
    ],
  },
  {
    id: "public-transit",
    industry: "PASSENGER TRANSIT",
    tabLabel: "Passenger Transit",
    title: "Public Transit & Municipal Bus Fleets",
    description:
      "Compliance-tested driver displays, automated passenger counting, and ELD hours-of-service logging for municipal transit authorities.",
    bundle: "Includes: 1x JaxiTab 8\" Display + 2x Passenger Counters + 1x CANbus Hub",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
    href: "/solutions/passenger-transit",
    hotspots: [
      { id: "h1", top: "28%", left: "38%", label: "JaxiTab 8\" Driver Display" },
      { id: "h2", top: "52%", left: "68%", label: "Automated Passenger Counter" },
      { id: "h3", top: "70%", left: "48%", label: "CANbus Engine Hub" },
    ],
  },
  {
    id: "cold-chain",
    industry: "COLD-CHAIN LOGISTICS",
    tabLabel: "Cold-Chain Logistics",
    title: "Refrigerated Transport & Cold Chain",
    description:
      "Wireless Bluetooth 5.2 temperature sensors monitoring cargo refrigeration, trailer door open states, and instant thermal alert triggers.",
    bundle: "Includes: 1x JaxiTrack Pro + 3x BLE Temp Sensors + 1x Door Sensor",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    href: "/solutions/cold-chain-logistics",
    hotspots: [
      { id: "h1", top: "35%", left: "52%", label: "BLE Thermal Temp Pod (-40°C to +85°C)" },
      { id: "h2", top: "62%", left: "75%", label: "Trailer Door Open State Sensor" },
      { id: "h3", top: "45%", left: "32%", label: "JaxiTrack Gateway" },
    ],
  },
  {
    id: "heavy-assets",
    industry: "HEAVY CONSTRUCTION",
    tabLabel: "Heavy Machinery",
    title: "Construction & Heavy Asset Machinery",
    description:
      "IP69K waterproof asset trackers monitoring PTO engine hours, equipment location, and anti-theft geofence boundaries.",
    bundle: "Includes: 1x Rugged Asset Tracker (IP69K) + 1x PTO Engine Hour Sensor",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80",
    href: "/solutions/heavy-machinery",
    hotspots: [
      { id: "h1", top: "42%", left: "48%", label: "Rugged Asset Tracker (IP69K)" },
      { id: "h2", top: "62%", left: "62%", label: "PTO Engine Hour Sensor" },
    ],
  },
];

export function SolutionsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const activeSolution = SOLUTIONS_DATA[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : SOLUTIONS_DATA.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < SOLUTIONS_DATA.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header Row with Slider Prev/Next Controls */}
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <div className={styles.sectionTag}>
              <Layers className="w-3.5 h-3.5 text-cyan-600" />
              <span>SOLUTIONS BY INDUSTRY</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Tailored Telematics Stacks Mapped for Every Commercial Vertical.
            </h2>
            <p className={styles.subheadline}>
              Pre-configured, compliance-tested hardware bundles engineered for long-haul
              freight, public transit, cold-chain logistics, and heavy construction.
            </p>
          </div>

          {/* Slider Prev / Next Controls */}
          <div className={styles.sliderControls}>
            <div className={styles.counterLabel}>
              <span className={styles.counterActive}>
                {(activeIndex + 1).toString().padStart(2, "0")}
              </span>{" "}
              / {SOLUTIONS_DATA.length.toString().padStart(2, "0")}
            </div>

            <button
              type="button"
              onClick={handlePrev}
              className={styles.arrowBtn}
              aria-label="Previous Industry Solution"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className={styles.arrowBtn}
              aria-label="Next Industry Solution"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Industry Tabs Row */}
        <div className={styles.tabsRow}>
          {SOLUTIONS_DATA.map((sol, idx) => (
            <button
              key={sol.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`${styles.tabBtn} ${
                activeIndex === idx ? styles.tabBtnActive : ""
              }`}
            >
              <span>{`0${idx + 1}`}</span>
              <span>{sol.tabLabel}</span>
            </button>
          ))}
        </div>

        {/* Active Solution Slide Card (Clean Framer Motion Slide - Zero Blur) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSolution.id}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={styles.solutionSlideCard}
          >
            {/* Photo Stage & Interactive Hotspots */}
            <div className={styles.photoStage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeSolution.image}
                alt={activeSolution.title}
                className={styles.slideImg}
              />
              <div className={styles.photoOverlayGradient} />

              {/* Pulsing Hotspot Target Rings */}
              {activeSolution.hotspots.map((spot) => (
                <div
                  key={spot.id}
                  className={styles.hotspotTarget}
                  style={{ top: spot.top, left: spot.left }}
                  onMouseEnter={() => setActiveHotspot(`${activeSolution.id}-${spot.id}`)}
                  onMouseLeave={() => setActiveHotspot(null)}
                >
                  <div className={styles.hotspotDot} />

                  {/* Sharp Solid Tooltip Badge */}
                  <AnimatePresence>
                    {activeHotspot === `${activeSolution.id}-${spot.id}` && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 2 }}
                        transition={{ duration: 0.15 }}
                        className={styles.hotspotTooltip}
                      >
                        {spot.label}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Text Content Area */}
            <div className={styles.textContent}>
              <div className={styles.industryTag}>{activeSolution.industry}</div>
              <h3 className={styles.cardTitle}>{activeSolution.title}</h3>
              <p className={styles.cardDesc}>{activeSolution.description}</p>

              {/* Pre-Mapped Hardware Bundle Box */}
              <div className={styles.bundleBox}>
                <div className={styles.bundleLabel}>PRE-MAPPED HARDWARE PACKAGE</div>
                <div className={styles.bundleItems}>{activeSolution.bundle}</div>
              </div>

              {/* Action CTA */}
              <Link href={activeSolution.href} className={styles.ctaBtn}>
                <span>Explore Solution Bundle</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
