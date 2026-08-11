"use client";

import React, { useEffect } from "react";
import { ServicesHero } from "@/components/sections/Services/ServicesHero";
import { ServicesGrid } from "@/components/sections/Services/ServicesGrid";
import { ServicesStory } from "@/components/sections/Services/ServicesStory";
import { ServicesCTA } from "@/components/sections/Services/ServicesCTA";
import type { ServicesCopy } from "@/lib/i18n/pageCopy";

export function ServicesPageContent({ copy }: { copy: ServicesCopy }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-white text-slate-900 min-h-screen">
      <ServicesHero copy={copy} />
      <ServicesGrid copy={copy} />
      <ServicesStory copy={copy} />
      <ServicesCTA copy={copy} />
    </main>
  );
}
