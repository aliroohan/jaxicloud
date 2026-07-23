"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Cpu, HardDrive, Layers, Navigation, ShieldCheck, Truck, Users, Wrench } from "lucide-react";
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
  col1Title: "Core Telematics Hardware",
  col1Items: [
    {
      href: "/products?category=dash-cameras",
      icon: Camera,
      title: "Dash Cameras & AI Vision",
      desc: "Dual 4K vision dashcams with onboard ADAS & DMS fatigue alerts.",
    },
    {
      href: "/products?category=mdvr-computing",
      icon: HardDrive,
      title: "Mobile MDVR & AI Computing",
      desc: "Multi-channel Mobile DVRs and edge computing hubs for heavy fleets.",
    },
    {
      href: "/products?category=driver-terminals",
      icon: Cpu,
      title: "Driver Terminals & ELD",
      desc: "Ruggedized Android displays for ELD logs, navigation, & dispatch.",
    },
  ],
  col2Title: "Sensors & Mining Systems",
  col2Items: [
    {
      href: "/products?category=passenger-sensors",
      icon: Users,
      title: "Passenger & APC Sensors",
      desc: "3D stereoscopic automated passenger counting & cabin sensors.",
    },
    {
      href: "/products?category=mining-machinery",
      icon: Wrench,
      title: "Mining & Heavy Machinery",
      desc: "IP69K rugged cameras for open-pit haul trucks & extreme environments.",
    },
    {
      href: "/products",
      icon: Layers,
      title: "Complete Hardware Catalog",
      desc: "Explore all 31 Streamax enterprise hardware units and spec sheets.",
    },
  ],
  spotlight: {
    tag: "FLAGSHIP TERMINAL",
    title: "XPAD 5.0 Driver Terminal",
    desc: "Octa-core 8-inch Android vehicle display with dual CANbus, NFC driver authentication, & IP65 ruggedization.",
    href: "/products/driver-terminals/xpad-5-0",
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
