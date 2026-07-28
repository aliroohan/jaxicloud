"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

// Physics settings
const NUM_POINTS = 20; // Length of the rope
const SPRING_FACTOR = 0.4; // How fast the rope snaps to the leader (higher = stiffer)

export function CustomCursor() {
  const leaderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Mouse position ref (so the animation loop can always read the latest position)
  const mouse = useRef({ x: -100, y: -100 });
  
  // Array of points for the rope simulation
  const points = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const leader = leaderRef.current;
    const canvas = canvasRef.current;
    if (!leader || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize points array
    points.current = Array(NUM_POINTS).fill({ x: -100, y: -100 });

    // Handle Resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    let isFirstMove = true;

    // Mouse Move Event
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (isFirstMove) {
        // Teleport all points instantly on first move so the rope doesn't stretch from the corner
        points.current = Array(NUM_POINTS).fill({ x: e.clientX, y: e.clientY });
        isFirstMove = false;
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    // Track global hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    // Animation Loop
    let animationFrameId: number;

    const render = () => {
      // 1. Update Leader DOM element
      // Using transform directly in rAF is the most performant way to sync DOM with Canvas
      leader.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%) ${isHovering ? 'scale(1.5)' : 'scale(1)'}`;

      // 2. Update Physics Points
      // The first point is the mouse
      const pts = points.current;
      pts[0] = { x: mouse.current.x, y: mouse.current.y };

      // Each subsequent point interpolates towards the point in front of it
      for (let i = 1; i < NUM_POINTS; i++) {
        pts[i] = {
          x: pts[i].x + (pts[i - 1].x - pts[i].x) * SPRING_FACTOR,
          y: pts[i].y + (pts[i - 1].y - pts[i].y) * SPRING_FACTOR,
        };
      }

      // 3. Draw Rope on Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // We only draw if the mouse is on screen
      if (mouse.current.x !== -100) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);

        // Smooth curve through the points
        for (let i = 1; i < NUM_POINTS - 1; i++) {
          const midX = (pts[i].x + pts[i + 1].x) / 2;
          const midY = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
        }
        
        // Connect to the last point
        ctx.lineTo(pts[NUM_POINTS - 1].x, pts[NUM_POINTS - 1].y);

        // Styling the rope
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 4;
        
        // Gradient stroke (opaque at head, transparent at tail)
        const gradient = ctx.createLinearGradient(
          pts[0].x, pts[0].y, 
          pts[NUM_POINTS - 1].x, pts[NUM_POINTS - 1].y
        );
        gradient.addColorStop(0, "rgba(14, 165, 233, 0.8)"); // Jaxicloud Sky Blue
        gradient.addColorStop(1, "rgba(14, 165, 233, 0)");   // Fade out completely
        
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovering]);

  return (
    <div className={styles.cursorContainer}>
      <canvas ref={canvasRef} className={styles.ropeCanvas} />
      <div 
        ref={leaderRef} 
        className={`${styles.cursorLeader} ${isHovering ? styles.hovering : ""}`} 
      >
        j
      </div>
    </div>
  );
}
