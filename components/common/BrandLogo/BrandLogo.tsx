"use client";

import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "hero";
  showTagline?: boolean;
}

export function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  // Use height to scale the logo while preserving its natural aspect ratio
  const dimensions = {
    sm: { height: 28 },
    md: { height: 36 },
    lg: { height: 48 },
    hero: { height: 64 },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo/jaxi.png"
        alt="JaxiCloud"
        style={{ height: dimensions.height, width: "auto", objectFit: "contain" }}
        className="select-none"
      />
    </div>
  );
}
