"use client";

import React, { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./TruckAnimation.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 240;

export function TruckAnimation() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  const getFramePath = (index: number) => {
    const num = (index + 1).toString().padStart(3, "0");
    return `/truck_animation/ezgif-frame-${num}.jpg`;
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
        <div className={styles.canvasStage}>
          {/* HTML5 Canvas Rendering Engine */}
          <canvas ref={canvasRef} className={styles.canvas} />
        </div>
      </div>
    </div>
  );
}
