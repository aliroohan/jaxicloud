"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, BrainCircuit, CheckCircle2, Layers, Plus } from "lucide-react";
import styles from "./FeaturedProducts.module.css";

import { useInquiryStore } from "@/store/inquiry";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LUXURY_CATALOG = [
  {
    id: "streamax-xpad-5-0",
    slug: "driver-terminals/xpad-5-0",
    name: "Streamax XPAD 5.0",
    category: "Driver Terminals & ELD",
    status: "In Stock • Commercial Certified",
    image: "https://www.streamax.com/upload/image/2025/12/01/e5c8eb62-5dbb-4cad-aeee-673588ea522f.png",
    headline: "Octa-Core 8\" Android Driver Terminal",
    description: "Industrial 8-inch Android vehicle display featuring dual CANbus 2.0B interfaces, NFC driver ID, high-precision GNSS, and ELD compliance.",
    specs: ["OCTA-CORE 2.0GHZ", "8.0\" IPS 1280x800", "DUAL CANBUS 2.0B", "NFC DRIVER ID"],
  },
  {
    id: "streamax-ad-plus-2-0",
    slug: "mining-machinery/ad-plus-2-0",
    name: "Streamax AD Plus 2.0",
    category: "Mining & Heavy AI Dashcams",
    status: "In Stock • Commercial Certified",
    image: "https://www.streamax.com/upload/image/2025/08/21/d9622d9c-dfcf-4b72-a74f-9e665d9d74e3.png",
    headline: "Commercial AI Dashcam with ADAS & DMS",
    description: "Dual-vision AI camera system detecting forward collision, lane departure, driver fatigue, smoking, and phone distraction in harsh environments.",
    specs: ["1080P ADAS + DMS", "EDGE NEURAL AI", "HARSH BRAKE ALERT", "IP69K RUGGED"],
  },
  {
    id: "streamax-p3d",
    slug: "passenger-sensors/p3d",
    name: "Streamax P3D APC Camera",
    category: "Passenger & APC Sensors",
    status: "In Stock • Commercial Certified",
    image: "https://www.streamax.com/upload/image/2025/08/21/9dbbd62c-63b7-4c74-8b63-149b106208cb.png",
    headline: "3D Stereoscopic Passenger Counter",
    description: "Over-door 3D stereoscopic vision sensor achieving over 98% counting accuracy for municipal buses, passenger vans, and emergency transit.",
    specs: ["3D STEREOSCOPIC", ">98% APC ACCURACY", "AUTO ILLUMINATION", "IP67 WATERPROOF"],
  },
  {
    id: "streamax-c53",
    slug: "mining-machinery/c53",
    name: "Streamax C53 Mining Camera",
    category: "Mining & Heavy Equipment",
    status: "In Stock • Commercial Certified",
    image: "https://www.streamax.com/upload/image/2025/08/21/577ceec9-fa20-410e-bdce-cdac244cf5ef.png",
    headline: "Industrial Open-Pit Haul Truck Vision",
    description: "Ruggedized heavy machinery vision camera engineered with anti-vibration shock mounts, infrared night vision, and IP69K washdown rating.",
    specs: ["IP69K WASHDOWN", "HEAVY ANTI-VIBE", "INFRARED NIGHT VISION", "HEAVY MINING"],
  },
];

export function FeaturedProducts() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const addItem = useInquiryStore((s) => s.addItem);

  // GSAP ScrollTrigger 300vh Pinned Scrubbing Timeline
  useEffect(() => {
    if (!stageRef.current) return;

    const stage = stageRef.current;

    const st = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => {
        const idx = Math.min(
          LUXURY_CATALOG.length - 1,
          Math.max(0, Math.floor(self.progress * LUXURY_CATALOG.length))
        );
        setActiveIndex(idx);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  // 3D Cursor Parallax Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (y / (rect.height / 2)) * -8,
      y: (x / (rect.width / 2)) * 8,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleAddToQuote = (product: (typeof LUXURY_CATALOG)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      type: "product",
      quantity: 1,
    });
    setToastMessage(`Added "${product.name}" to quote request`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeProduct = LUXURY_CATALOG[activeIndex];
  const progressPct = ((activeIndex + 1) / LUXURY_CATALOG.length) * 100;

  return (
    <div ref={stageRef} className={styles.stageContainer}>
      {/* Pinned Viewport Stage */}
      <div className={styles.pinnedViewport}>
        <div className={styles.container}>
          {/* Left Column: Sticky Editorial Story Stage */}
          <div className={styles.editorialStage}>
            <div className={styles.sectionTag}>
              <Layers className="w-3.5 h-3.5 text-cyan-600" />
              <span>FLAGSHIP TELEMATICS CATALOG</span>
            </div>

            {/* Active Counter & Progress Line */}
            <div className={styles.productCounterRow}>
              <span className={styles.activeNumber}>
                {(activeIndex + 1).toString().padStart(2, "0")}
              </span>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className={styles.totalNumber}>
                / {LUXURY_CATALOG.length.toString().padStart(2, "0")}
              </span>
            </div>

            <div className={styles.categoryTag}>{activeProduct.category}</div>

            <h2 className={styles.sectionTitle}>{activeProduct.headline}</h2>

            <p className={styles.subheadline}>{activeProduct.description}</p>
          </div>

          {/* Right Column: 3D Frosted Glass Spotlight Card */}
          <div className={styles.cardStageWrapper}>
            {/* Ambient Cyan Radial Backlight */}
            <div className={styles.ambientBacklight} />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                ref={cardRef}
                initial={{ opacity: 0, y: 35, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -25, scale: 0.94 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
                className={styles.glassProductCard}
              >
                {/* Status Row */}
                <div className={styles.cardHeaderRow}>
                  <span className={styles.categoryTag}>
                    {activeProduct.category}
                  </span>
                  <div className={styles.statusPill}>
                    <div className={styles.statusDot} />
                    <span>{activeProduct.status}</span>
                  </div>
                </div>

                {/* Product Render Stage */}
                <div className={styles.productRenderStage}>
                  {/* Floating AI Badge (Revealed on Hover) */}
                  <div className={styles.aiFloatingBadge}>
                    <BrainCircuit className="w-5 h-5" />
                  </div>

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    className={styles.productImg}
                  />
                </div>

                <h3 className={styles.cardTitle}>{activeProduct.name}</h3>
                <p className={styles.cardDesc}>{activeProduct.description}</p>

                {/* Spec Badges Row */}
                <div className={styles.specRow}>
                  {activeProduct.specs.map((spec) => (
                    <span key={spec} className={styles.specBadge}>
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Action Footer */}
                <div className={styles.cardFooter}>
                  <button
                    type="button"
                    onClick={() => handleAddToQuote(activeProduct)}
                    className={styles.quoteBtn}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Request Quote</span>
                  </button>

                  <Link
                    href={`/products/${activeProduct.slug}`}
                    className={styles.detailsLink}
                  >
                    <span>Full Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Quote Confirmation Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={styles.toastAlert}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
