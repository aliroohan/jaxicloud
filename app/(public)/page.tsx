import { Hero } from "@/components/sections/Hero/Hero";
import { Counters } from "@/components/sections/Counters/Counters";
import { Applications } from "@/components/sections/Applications/Applications";
import { TruckAnimation } from "@/components/sections/TruckAnimation/TruckAnimation";
import { ServicesStory } from "@/components/sections/ServicesStory/ServicesStory";
import { ProductHighlights } from "@/components/sections/ProductHighlights/ProductHighlights";
import { BusinessImpact } from "@/components/sections/BusinessImpact/BusinessImpact";
import { PartnerMatrix } from "@/components/sections/PartnerMatrix/PartnerMatrix";
import { BlogSection } from "@/components/sections/BlogSection/BlogSection";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getPageCopy } from "@/lib/i18n/pageCopy";

export const revalidate = 3600;

/** Bare `/` fallback (proxy redirects to `/{DEFAULT_LOCALE}`). */
export default async function HomePage() {
  const copy = getPageCopy("home", DEFAULT_LOCALE);

  return (
    <div>
      <Hero copy={copy} />
      <Counters copy={copy} />
      <Applications copy={copy} />
      <TruckAnimation copy={copy} />
      <ServicesStory copy={copy} />
      <ProductHighlights copy={copy} />
      <BusinessImpact copy={copy} />
      <PartnerMatrix copy={copy} />
      <BlogSection copy={copy} />
    </div>
  );
}
