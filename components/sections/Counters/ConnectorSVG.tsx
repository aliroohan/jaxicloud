"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin);
}

export function ConnectorSVG() {
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // GSAP handles the drawing animation in the main StatsSection timeline.
    // However, the glowing dot pulse can be initialized here.
    
    // We will let StatsSection trigger a custom event or we can just animate it infinitely
    // once the main scroll trigger is fired. To keep it simple, we will expose
    // classes that the parent timeline can target.
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block">
      <svg
        ref={svgRef}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 8px rgba(41, 168, 255, 0.3))" }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#29A8FF" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#29A8FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#29A8FF" stopOpacity="0.2" />
          </linearGradient>

          <mask id="drawMask">
            {/* The main connecting zig-zag path that GSAP animates to reveal the mask */}
            <path
              ref={pathRef}
              className="connector-path"
              d="M 150 250 L 280 250 Q 300 250 300 230 L 300 120 Q 300 100 320 100 L 580 100 Q 600 100 600 120 L 600 280 Q 600 300 620 300 L 830 300 Q 850 300 850 280 L 850 120 Q 850 100 870 100 L 1050 100"
              fill="none"
              stroke="#FFF"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="3000"
              strokeDashoffset="3000" 
            />
          </mask>
        </defs>
        
        {/* The visible dotted path */}
        <path
          d="M 150 250 L 280 250 Q 300 250 300 230 L 300 120 Q 300 100 320 100 L 580 100 Q 600 100 600 120 L 600 280 Q 600 300 620 300 L 830 300 Q 850 300 850 280 L 850 120 Q 850 100 870 100 L 1050 100"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6 8" /* Creates the dotted effect */
          mask="url(#drawMask)"
        />
        
        {/* The glowing pulse that travels along the path */}
        <circle
          ref={glowRef}
          className="connector-pulse"
          r="4"
          fill="#FFF"
          stroke="#29A8FF"
          strokeWidth="2"
          style={{ opacity: 0 }}
        />
      </svg>
    </div>
  );
}
