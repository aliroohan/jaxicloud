import { Hero } from "@/components/sections/Hero/Hero";
import { Counters } from "@/components/sections/Counters/Counters";
import { TruckAnimation } from "@/components/sections/TruckAnimation/TruckAnimation";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts/FeaturedProducts";
import { SolutionsSection } from "@/components/sections/SolutionsSection/SolutionsSection";
import { PartnerMatrix } from "@/components/sections/PartnerMatrix/PartnerMatrix";

export const revalidate = 3600;

export default async function HomePage() {
  return (
    <div>
      <Hero />
      <Counters />
      <TruckAnimation />
      <FeaturedProducts />
      <SolutionsSection />
      <PartnerMatrix />
    </div>
  );
}
