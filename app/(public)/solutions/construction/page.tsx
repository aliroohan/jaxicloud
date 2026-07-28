"use client";

import React, { useEffect } from "react";
import { ConstructorHero } from "@/components/sections/ConstructorSolution/ConstructorHero";
import { ConstructorCommandCenter } from "@/components/sections/ConstructorSolution/ConstructorCommandCenter";

export default function ConstructorPage() {
  // Ensure we start at the top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-slate-900 text-white min-h-screen">
      <ConstructorHero />
      <ConstructorCommandCenter />
      {/* Forced recompilation */}
    </main>
  );
}
