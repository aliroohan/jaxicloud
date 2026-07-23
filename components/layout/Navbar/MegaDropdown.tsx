"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Cpu, HardDrive, Layers, Navigation, ShieldCheck, Truck, Wrench } from "lucide-react";
import styles from "./Navbar.module.css";

interface MegaDropdownProps {
  activeTab: string;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const SOLUTIONS_DATA = {
  col1Title: "Core Fleet Solutions",
  col1Items: [
    {
      href: "/solutions/fleet-tracking",
      icon: Navigation,
      title: "Real-Time Fleet Tracking",
      desc: "Live GPS telemetry, route history, and geofencing.",
    },
    {
      href: "/solutions/driver-safety",
      icon: ShieldCheck,
      title: "AI Driver Safety & ADAS",
      desc: "Dual-camera vision systems detecting risky driving behavior.",
    },
    {
      href: "/solutions/asset-monitoring",
      icon: HardDrive,
      title: "Equipment & Asset Monitoring",
      desc: "Battery-powered trackers for trailers, heavy machinery, and containers.",
    },
  ],
  col2Title: "Industry Vertical Solutions",
  col2Items: [
    {
      href: "/solutions/logistics",
      icon: Truck,
      title: "Logistics & Commercial Freight",
      desc: "High-capacity telematics for long-haul trucking fleets.",
    },
    {
      href: "/solutions/public-transit",
      icon: Layers,
      title: "Public Transit & Municipalities",
      desc: "Passenger counting, fare validation, and emergency response.",
    },
    {
      href: "/solutions/construction",
      icon: Wrench,
      title: "Construction & Heavy Operations",
      desc: "Ruggedized sensors monitoring engine hours and PTO status.",
    },
  ],
  spotlight: {
    tag: "FEATURED SOLUTION",
    title: "AI Predictive Safety Ecosystem",
    desc: "Reduce fleet accident risk by up to 40% with automated video coaching and edge AI alerts.",
    href: "/solutions/driver-safety",
  },
};

const PRODUCTS_DATA = {
  col1Title: "Hardware Categories",
  col1Items: [
    {
      href: "/products?category=dash-cameras",
      icon: Camera,
      title: "AI Dash Cameras",
      desc: "Dual 4K road & cabin vision with LTE cloud connectivity.",
    },
    {
      href: "/products?category=gps-trackers",
      icon: Navigation,
      title: "GPS & CANbus Trackers",
      desc: "OBD-II and wired vehicle trackers with remote engine kill.",
    },
    {
      href: "/products?category=sensors",
      icon: Cpu,
      title: "Wireless Sensor Arrays",
      desc: "Bluetooth BLE temperature, door, and tire pressure sensors.",
    },
  ],
  col2Title: "Hardware Accessories",
  col2Items: [
    {
      href: "/products?category=tablets",
      icon: HardDrive,
      title: "Ruggedized Driver Tablets",
      desc: "IP67 vehicle-mounted displays for ELD and dispatch.",
    },
    {
      href: "/bundles",
      icon: Layers,
      title: "Pre-Configured Hardware Bundles",
      desc: "Complete plug-and-play kits optimized by vehicle type.",
    },
  ],
  spotlight: {
    tag: "FLAGSHIP HARDWARE",
    title: "Jaxi-Cam Dual Vision AI Pro",
    desc: "Quad-core neural processor with real-time lane departure and distracted driver prevention.",
    href: "/products/dash-cameras",
  },
};

export function MegaDropdown({ activeTab, onClose, onMouseEnter, onMouseLeave }: MegaDropdownProps) {
  const data = activeTab === "solutions" ? SOLUTIONS_DATA : activeTab === "products" ? PRODUCTS_DATA : null;

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98, x: 0 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, y: 8, scale: 0.98, x: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={styles.megaMenuPanel}
    >
      {/* Column 1 */}
      <div>
        <div className={styles.megaColumnTitle}>{data.col1Title}</div>
        <div className={styles.megaItemList}>
          {data.col1Items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={styles.megaItemCard}
              >
                <div className={styles.megaIconPod}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className={styles.megaItemName}>{item.title}</div>
                  <div className={styles.megaItemDesc}>{item.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Column 2 */}
      <div>
        <div className={styles.megaColumnTitle}>{data.col2Title}</div>
        <div className={styles.megaItemList}>
          {data.col2Items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={styles.megaItemCard}
              >
                <div className={styles.megaIconPod}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className={styles.megaItemName}>{item.title}</div>
                  <div className={styles.megaItemDesc}>{item.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Column 3: Featured Hardware / Solution Spotlight Card */}
      <div className={styles.spotlightCard}>
        <div>
          <span className={styles.spotlightTag}>{data.spotlight.tag}</span>
          <h4 className={styles.spotlightTitle}>{data.spotlight.title}</h4>
          <p className={styles.spotlightDesc}>{data.spotlight.desc}</p>
        </div>
        <Link
          href={data.spotlight.href}
          onClick={onClose}
          className={styles.spotlightLink}
        >
          <span>Explore Specifications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
