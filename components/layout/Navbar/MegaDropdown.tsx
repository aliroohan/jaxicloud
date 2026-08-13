"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Activity, AlertCircle, ArrowRight, Camera, Clock, Cpu, HardDrive, Layers, MapPin, Navigation, Power, ShieldCheck, Truck, Users, Wifi, Wrench } from "lucide-react";
import { withLocale, type Locale } from "@/lib/i18n/config";
import styles from "./Navbar.module.css";

interface MegaDropdownProps {
  activeTab: string;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  locale?: Locale;
}

const SOLUTIONS_4COL_DATA = [
  {
    image: "/images/route_optimization.png",
    links: [
      { label: "Constructor", href: "/solutions/constractor" },
      { label: "Lorry", href: "/solutions/lorry" },
      { label: "Leasing control", href: "/solutions/leasing-control" },
      { label: "Public transport", href: "/solutions/nimbus" },
      { label: "Agriculture", href: "/solutions/hecterra-agriculture" }
    ]
  },
  {
    image: "/images/fuel_control.png",
    links: [
      { label: "Cooling monitoring", href: "/solutions/cooling-monitoring" },
      { label: "Logistics delivery", href: "/solutions/logistics-delivery-system" },
      { label: "Eco drive", href: "/solutions/eco-drive" },
      { label: "Maintanace module", href: "/solutions/fleetrun-fleet-volunteer" },
      { label: "WIA tag", href: "/solutions/wia-tag" }
    ]
  },
  {
    image: "/images/driver_safety.png",
    links: [
      { label: "Fuel management System", href: "/solutions/fuel-management-system" },
      { label: "Tpms ebs cooling fuel monitoring", href: "/solutions/tpms-ebs-cooling-fuel-monitoring" },
      { label: "Dashcam", href: "/solutions/dashcam" },
      { label: "Registration of truck door opening", href: "/solutions/registration-of-truck-door-opening" }
    ]
  },
  {
    image: "/images/compliance_reporting.png",
    links: [
      { label: "Temperature monitoring", href: "/solutions/temperature-monitoring-work" },
      { label: "Geolocation of construction tools", href: "/solutions/geolocation-of-construction-tools" },
      { label: "Opening detection of truck side panels", href: "/solutions/opening-detection-of-truck-side-panels" },
      { label: "E-drivers book", href: "/solutions/e-drivers-book" }
    ]
  }
];

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
};

const APPLICATIONS_DATA = {
  col1Title: "Connectivity & Maintenance",
  col1Items: [
    {
      href: "/applications/click-and-connect",
      icon: Wifi,
      title: "Click & Connect",
      desc: "Whether you're just starting out or an existing customer, the easiest way to register your devices.",
    },
    {
      href: "/applications/tacho-simpel",
      icon: Clock,
      title: "Tacho Simple",
      desc: "The complete solution for digital tachograph and driver time management to comply with EU regulations.",
    },
    {
      href: "/applications/tpms",
      icon: AlertCircle,
      title: "TPMS Solutions",
      desc: "Our highly developed devices deliver unsurpassed quality, lowest life cycle costs, longest product life.",
    },
  ],
  col2Title: "Safety & Performance",
  col2Items: [
    {
      href: "/applications/safe-start",
      icon: Power,
      title: "Safe Start",
      desc: "A modern digital solution for vehicle inspections, designed to improve fleet safety, compliance, and transparency.",
    },
    {
      href: "/applications/driver-behaviour",
      icon: Activity,
      title: "Driver Behaviour",
      desc: "Monitor driver performance, eco-driving events, and safety indicators in one simple dashboard.",
    },
    {
      href: "/applications/platform",
      icon: MapPin,
      title: "Jaxicloud Platform",
      desc: "Global GPS tracking and fleet management solution for real-time monitoring and optimization across industries.",
    },
  ],
  spotlight: {
    tag: "FEATURED APPLICATION",
    title: "JaxiCloud Platform",
    desc: "A global GPS tracking and fleet management solution for real-time monitoring and optimization of vehicles, assets, and operations.",
    href: "/applications/platform",
  },
} as const;

type MegaSpotlight = {
  tag: string;
  title: string;
  desc: string;
  href: string;
};

function getMegaSpotlight(
  data: typeof PRODUCTS_DATA | typeof APPLICATIONS_DATA | null,
): MegaSpotlight | null {
  if (!data || !("spotlight" in data)) return null;
  return data.spotlight as MegaSpotlight;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
};

export function MegaDropdown({ activeTab, onClose, onMouseEnter, onMouseLeave, locale = "en" }: MegaDropdownProps) {
  const data = activeTab === "products" ? PRODUCTS_DATA : activeTab === "applications" ? APPLICATIONS_DATA : null;

  if (!data && activeTab !== "solutions") return null;

  const spotlight = getMegaSpotlight(data);
  const hasSpotlight = Boolean(spotlight);
  const solutionHref = (href: string) =>
    href.startsWith("/solutions") ? withLocale(locale, href) : href;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ layout: { type: "spring", bounce: 0, duration: 0.3 }, duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${styles.megaMenuPanel} ${!hasSpotlight && activeTab !== "solutions" ? styles.megaMenuPanel2Col : ""}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {activeTab === "solutions" ? (
          <motion.div
            key="solutions-layout"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, x: 15 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.08, delayChildren: 0.05 }
              },
              exit: { opacity: 0, x: -15, transition: { duration: 0.15 } }
            }}
            className={styles.megaSolutionsGrid}
          >
            {SOLUTIONS_4COL_DATA.map((col, idx) => (
              <motion.div key={idx} variants={itemVariants} className={styles.megaSolutionsCol}>
                <img src={col.image} alt={`Solution group ${idx + 1}`} className={styles.megaSolutionsImg} />
                {col.links.map(link => (
                  <Link
                    key={link.href}
                    href={solutionHref(link.href)}
                    onClick={onClose}
                    className={styles.megaSolutionsLink}
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, x: activeTab === "products" ? -15 : 15 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.08, delayChildren: 0.05 }
              },
              exit: { opacity: 0, x: activeTab === "products" ? 15 : -15, transition: { duration: 0.15 } }
            }}
            className={`${styles.megaMenuGrid} ${!hasSpotlight ? styles.megaMenuGrid2Col : ""}`}
          >
            {data && (
              <>
                {/* Column 1 */}
                <motion.div variants={itemVariants}>
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
                </motion.div>

                {/* Column 2 */}
                <motion.div variants={itemVariants}>
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
                </motion.div>

                {/* Column 3: Featured Hardware / Solution Spotlight Card */}
                {spotlight ? (
                  <motion.div variants={itemVariants} className={styles.spotlightCard}>
                    <div>
                      <span className={styles.spotlightTag}>{spotlight.tag}</span>
                      <h4 className={styles.spotlightTitle}>{spotlight.title}</h4>
                      <p className={styles.spotlightDesc}>{spotlight.desc}</p>
                    </div>
                    <Link
                      href={spotlight.href}
                      onClick={onClose}
                      className={styles.spotlightLink}
                    >
                      <span>Explore Specifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                ) : null}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
