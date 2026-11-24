import { ServicesPageContent } from "@/components/sections/Services/ServicesPageContent";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getPageCopy } from "@/lib/i18n/pageCopy";

export const revalidate = 3600;

/** Bare `/services` fallback (proxy redirects to `/{DEFAULT_LOCALE}/services`). */
export default function ServicesPage() {
  const copy = getPageCopy("services", DEFAULT_LOCALE);
  return <ServicesPageContent copy={copy} />;
}
