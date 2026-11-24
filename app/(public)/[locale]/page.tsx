import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero/Hero";
import { Counters } from "@/components/sections/Counters/Counters";
import { Applications } from "@/components/sections/Applications/Applications";
import { TruckAnimation } from "@/components/sections/TruckAnimation/TruckAnimation";
import { ServicesStory } from "@/components/sections/ServicesStory/ServicesStory";
import { ProductHighlights } from "@/components/sections/ProductHighlights/ProductHighlights";
import { BusinessImpact } from "@/components/sections/BusinessImpact/BusinessImpact";
import { PartnerMatrix } from "@/components/sections/PartnerMatrix/PartnerMatrix";
import { BlogSection } from "@/components/sections/BlogSection/BlogSection";
import { isLocale, LOCALES, withLocale, type Locale } from "@/lib/i18n/config";
import { getPageCopy } from "@/lib/i18n/pageCopy";

export const dynamicParams = false;
export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return { title: "JaxiCloud" };
  return {
    title: "JaxiCloud — Fleet Intelligence",
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, withLocale(l, "/")]),
      ),
    },
  };
}

export default async function LocalizedHomePage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const copy = getPageCopy("home", locale);

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
