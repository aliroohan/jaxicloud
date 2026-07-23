"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, Cpu, Globe, TrendingUp, Truck } from "lucide-react";
import styles from "./Counters.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Counters() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // State for interpolated numeric values
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const [countriesCount, setCountriesCount] = useState(0);
  const [uptimeCount, setUptimeCount] = useState(0);
  const [hardwareCount, setHardwareCount] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    if (!section) return;

    // SVG Energy Line Setup
    if (path) {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      // Animate SVG line on scroll into view
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 50%",
          scrub: 1,
        },
      });
    }

    // GSAP ScrollTrigger for Cards Entrance & Kinetic Number Rolling
    const countObj = {
      vehicles: 0,
      countries: 0,
      uptime: 0,
      hardware: 0,
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    // 1. Cards Stagger Reveal
    tl.fromTo(
      cardsRef.current,
      {
        opacity: 0,
        y: 45,
        scale: 0.95,
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      }
    );

    // 2. Kinetic Number Interpolation Tween with GSAP power3.out Easing
    tl.to(
      countObj,
      {
        vehicles: 500000,
        countries: 45,
        uptime: 99.98,
        hardware: 120,
        duration: 2.2,
        ease: "power3.out",
        onUpdate: function () {
          setVehiclesCount(Math.floor(countObj.vehicles));
          setCountriesCount(Math.floor(countObj.countries));
          setUptimeCount(Number(countObj.uptime.toFixed(2)));
          setHardwareCount(Math.floor(countObj.hardware));
        },
      },
      "-=0.6"
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.countersSection}>
      {/* Background SVG Telematics Network Stage */}
      <svg className={styles.bgSvgStage} viewBox="0 0 1400 600" fill="none">
        {/* Animated Connecting Telemetry Energy Line */}
        <path
          ref={pathRef}
          d="M 150 280 C 350 150, 500 400, 700 250 C 900 100, 1100 350, 1250 260"
          stroke="url(#energyGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="energyGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#0E7490" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0E7490" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      <div className={styles.container}>
        {/* Header Block */}
        <div className={styles.headerBlock}>
          <div className={styles.sectionTag}>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
            <span>GLOBAL INFRASTRUCTURE SCALE</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Engineered to Power Commercial Fleets{" "}
            <span className={styles.sectionTitleHighlight}>
              At Global Standard.
            </span>
          </h2>
        </div>

        {/* 4-Column Asymmetrical Counter Cards Grid */}
        <div className={styles.grid}>
          {/* Card 1: Active Vehicles */}
          <div
            ref={(el) => {
              cardsRef.current[0] = el;
            }}
            className={styles.card}
          >
            <div className={styles.nodeGlow} />
            <div className={styles.iconPod}>
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className={styles.numberDisplay}>
                <span className={styles.numberGradient}>
                  {vehiclesCount.toLocaleString()}+
                </span>
              </div>
              <div className={styles.cardLabel}>Connected Vehicles</div>
              <div className={styles.cardDesc}>
                Active commercial vehicles monitored continuously in real time.
              </div>
            </div>
          </div>

          {/* Card 2: Countries Deployed */}
          <div
            ref={(el) => {
              cardsRef.current[1] = el;
            }}
            className={styles.card}
          >
            <div className={styles.nodeGlow} />
            <div className={styles.iconPod}>
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className={styles.numberDisplay}>
                <span className={styles.numberGradient}>
                  {countriesCount}+
                </span>
              </div>
              <div className={styles.cardLabel}>Countries Deployed</div>
              <div className={styles.cardDesc}>
                Global telematics operations across Americas, Europe, Asia & MEA.
              </div>
            </div>
          </div>

          {/* Card 3: Platform Uptime */}
          <div
            ref={(el) => {
              cardsRef.current[2] = el;
            }}
            className={styles.card}
          >
            <div className={styles.nodeGlow} />
            <div className={styles.iconPod}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className={styles.numberDisplay}>
                <span className={styles.numberGradient}>{uptimeCount}%</span>
              </div>
              <div className={styles.cardLabel}>Mission-Critical Uptime</div>
              <div className={styles.cardDesc}>
                Enterprise Cloud SLAs ensuring uninterrupted fleet connectivity.
              </div>
            </div>
          </div>

          {/* Card 4: Compatible Hardware */}
          <div
            ref={(el) => {
              cardsRef.current[3] = el;
            }}
            className={styles.card}
          >
            <div className={styles.nodeGlow} />
            <div className={styles.iconPod}>
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className={styles.numberDisplay}>
                <span className={styles.numberGradient}>
                  {hardwareCount}+
                </span>
              </div>
              <div className={styles.cardLabel}>Compatible Hardware Models</div>
              <div className={styles.cardDesc}>
                Cameras, OBD trackers, CANbus interfaces & BLE sensors.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
