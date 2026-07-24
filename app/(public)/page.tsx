import { Hero } from "@/components/sections/Hero/Hero";
import { Counters } from "@/components/sections/Counters/Counters";
import { Applications } from "@/components/sections/Applications/Applications";
import { TruckAnimation } from "@/components/sections/TruckAnimation/TruckAnimation";
import { ServicesStory } from "@/components/sections/ServicesStory/ServicesStory";
import { ProductHighlights } from "@/components/sections/ProductHighlights/ProductHighlights";
import { BusinessImpact } from "@/components/sections/BusinessImpact/BusinessImpact";
import { PartnerMatrix } from "@/components/sections/PartnerMatrix/PartnerMatrix";

export const revalidate = 3600;

export default async function HomePage() {
  return (
    <div>
      <Hero />
      <Counters />
      <Applications />
      <TruckAnimation />
      <ServicesStory />
      <ProductHighlights />
      <BusinessImpact />
      <PartnerMatrix />
    </div>
  );
}
