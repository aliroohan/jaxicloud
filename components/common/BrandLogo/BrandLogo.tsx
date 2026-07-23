"use client";

import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  showTagline?: boolean;
}

export function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  const dimensions = {
    sm: { width: 140, height: 32 },
    md: { width: 185, height: 42 },
    lg: { width: 240, height: 54 },
    hero: { width: 320, height: 72 },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 280 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-logo-svg select-none"
      >
        <defs>
          {/* Brand Blue Gradient */}
          <linearGradient id="jaxiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0E7490" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0B1C2C" />
          </linearGradient>

          {/* Shimmer Light Sweep */}
          <linearGradient id="shimmerSweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0E7490" stopOpacity="0" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0E7490" stopOpacity="0" />
          </linearGradient>

          {/* Soft Shadow */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Telematics Fleet Node Symbol */}
        <g className="brand-logo-symbol" filter="url(#logoGlow)">
          {/* Outer Ring Segment */}
          <path
            d="M 12 32 A 20 20 0 1 1 36 48"
            stroke="url(#jaxiGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="brand-symbol-path-outer"
          />
          {/* Inner Signal Core */}
          <circle
            cx="24"
            cy="32"
            r="6"
            fill="#0E7490"
            className="brand-symbol-core"
          />
          {/* Satellite Orbital Nodes */}
          <circle cx="36" cy="18" r="2.5" fill="#38BDF8" className="brand-symbol-node-1" />
          <circle cx="42" cy="32" r="2.5" fill="#0E7490" className="brand-symbol-node-2" />
          <circle cx="32" cy="48" r="2.5" fill="#0284C7" className="brand-symbol-node-3" />
        </g>

        {/* JAXICLOUD Text Wordmark */}
        <g className="brand-logo-text">
          <text
            x="64"
            y="41"
            fontFamily="var(--font-fraunces), Georgia, serif"
            fontSize="34"
            fontWeight="700"
            letterSpacing="-0.03em"
            fill="#0B1C2C"
            className="brand-text-main"
          >
            Jaxi<tspan fill="#0E7490">cloud</tspan>
          </text>

          {/* Enterprise Sub-Badge */}
          <text
            x="66"
            y="55"
            fontFamily="var(--font-dm-sans), sans-serif"
            fontSize="9"
            fontWeight="600"
            letterSpacing="0.22em"
            fill="#667085"
            className="brand-text-sub"
          >
            FLEET INTELLIGENCE
          </text>
        </g>
      </svg>
    </div>
  );
}
