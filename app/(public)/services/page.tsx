"use client";

import React, { useEffect } from "react";
import { ServicesHero } from "@/components/sections/Services/ServicesHero";
import { ServicesGrid } from "@/components/sections/Services/ServicesGrid";
import { ServicesStory } from "@/components/sections/Services/ServicesStory";
import { ServicesCTA } from "@/components/sections/Services/ServicesCTA";

export default function ServicesPage() {
  // Ensure we start at the top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-white text-slate-900 min-h-screen">
      <ServicesHero />
      <ServicesGrid />
      <ServicesStory />
      <ServicesCTA />
    </main>
  );
}
