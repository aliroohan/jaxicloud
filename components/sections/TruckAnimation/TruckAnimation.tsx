"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./TruckAnimation.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 240;

const HOTSPOTS = [
  {
    id: "dashcam",
    top: "35%",
    left: "28%",
    title: "AI Dashcam",
    desc: "ADAS & DMS Vision",
    path: "M0,0 L-40,-60 L-120,-60",
    labelPos: { top: "-85px", left: "-260px" }
  },
  {
    id: "agriculture",
    top: "60%",
    left: "48%",
    title: "Agriculture",
    desc: "Tractor Telemetry",
    path: "M0,0 L0,-120 L-80,-120",
    labelPos: { top: "-145px", left: "-220px" }
  },
  {
    id: "construction",
    top: "60%",
    left: "62%",
    title: "Construction",
    desc: "Heavy Machinery",
    path: "M0,0 L30,-140 L100,-140",
    labelPos: { top: "-165px", left: "110px" }
  },
  {
    id: "public-transport",
    top: "60%",
    left: "72%",
    title: "Public Transport",
    desc: "Bus APC Counters",
    path: "M0,0 L60,-90 L120,-90",
    labelPos: { top: "-115px", left: "130px" }
  },
  {
    id: "tpms",
    top: "85%",
    left: "38%",
    title: "TPMS & Fuel",
    desc: "EBS Cooling Monitoring",
    path: "M0,0 L-40,60 L-100,60",
    labelPos: { top: "35px", left: "-270px" }
  },
];

export function TruckAnimation() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [showHotspots, setShowHotspots] = useState(false);

  const getFramePath = (index: number) => {
    const num = (index + 1).toString().padStart(3, "0");
    return `/truck_animation/ezgif-frame-${num}.jpg?v=3`;
  };

  // Canvas Drawing Helper with Right-Edge Trimming and Nearest-Loaded Frame Fallback
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Fallback to nearest loaded frame if exact frame is buffering
    let targetIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, frameIdx));
    while (
      targetIdx > 0 &&
      (!imagesRef.current[targetIdx] || !imagesRef.current[targetIdx].complete)
    ) {
      targetIdx--;
    }

    const img = imagesRef.current[targetIdx];
    if (!ctx || !img || !img.complete) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (width === 0 || height === 0) return;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Crop 10px off the right edge of source frame to eliminate the thin vertical line artifact
    const srcWidth = Math.max(1, img.width - 10);
    const srcHeight = img.height;

    const imgRatio = srcWidth / srcHeight;
    const canvasRatio = width / height;
    let drawW = width;
    let drawH = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawH = width / imgRatio;
      offsetY = (height - drawH) / 2;
    } else {
      drawW = height * imgRatio;
      offsetX = (width - drawW) / 2;
    }

    ctx.drawImage(img, 0, 0, srcWidth, srcHeight, offsetX, offsetY, drawW, drawH);
    ctx.restore();
  }, []);

  // Preload frames upfront into memory
  useEffect(() => {
    const imgArray: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);

      if (i === 0) {
        img.onload = () => {
          drawFrame(0);
        };
      }

      imgArray.push(img);
    }

    imagesRef.current = imgArray;

    if (imgArray[0] && imgArray[0].complete) {
      drawFrame(0);
    }
  }, [drawFrame]);

  // GSAP ScrollTrigger 300vh Instant Bidirectional Scrubbing Engine
  useEffect(() => {
    if (!stageRef.current) return;

    const stage = stageRef.current;

    const st = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const idx = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(self.progress * (TOTAL_FRAMES - 1)))
        );
        currentFrameRef.current = idx;
        drawFrame(idx);

        // Show robotic HUD earlier (halfway through the scroll)
        if (idx >= 120) {
          setShowHotspots(true);
        } else {
          setShowHotspots(false);
        }
      },
    });

    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      st.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [drawFrame]);

  return (
    <div ref={stageRef} className={styles.stageContainer}>
      {/* Pinned 100vh Viewport with Fixed Container Spacing */}
      <div className={styles.pinnedViewport}>
        {/* Animated Section Heading */}
        <motion.div 
          className={styles.headingContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.div 
            className={styles.headingTag}
            variants={{ hidden: { opacity: 0, y: -20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
          >
            Hardware Solutions
          </motion.div>
          <h2 className={styles.headingTitle}>
            <span className={styles.textMask}>
              <motion.span variants={{ hidden: { y: "120%" }, show: { y: "0%", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }} className={styles.textMaskInner}>
                Unified Fleet 
              </motion.span>
            </span>
            <span className={styles.textMask}>
              <motion.span variants={{ hidden: { y: "120%" }, show: { y: "0%", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }} className={styles.textMaskInner}>
                <span>Intelligence</span>
              </motion.span>
            </span>
          </h2>
        </motion.div>

        <div className={styles.canvasStage}>
          {/* HTML5 Canvas Rendering Engine */}
          <canvas ref={canvasRef} className={styles.canvas} />

          {/* Robotic HUD Overlay */}
          <AnimatePresence>
            {showHotspots && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.hudOverlay}
              >
                {HOTSPOTS.map((spot, i) => (
                  <div
                    key={spot.id}
                    className={styles.hotspotGroup}
                    style={{ top: spot.top, left: spot.left }}
                  >
                    {/* The glowing dot anchor */}
                    <div className={styles.dotNode} />

                    {/* The robotic SVG line */}
                    <svg className={styles.svgLine} width="400" height="400" style={{ transform: 'translate(-50%, -50%)' }}>
                      <motion.path
                        d={spot.path}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        exit={{ pathLength: 0, opacity: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="translate(200, 200)"
                      />
                    </svg>

                    {/* The Glass Label */}
                    <motion.div
                      className={styles.hudLabel}
                      style={{ top: spot.labelPos.top, left: spot.labelPos.left }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: (i * 0.05) + 0.1 }}
                    >
                      <span className={styles.hudTitle}>{spot.title}</span>
                      <span className={styles.hudDesc}>{spot.desc}</span>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
