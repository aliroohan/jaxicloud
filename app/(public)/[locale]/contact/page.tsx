import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/public/ContactForm";
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
  if (!isLocale(localeParam)) {
    return { title: "Contact | JaxiCloud" };
  }
  const copy = getPageCopy("contact", localeParam);
  return {
    title: copy.seoTitle,
    description: copy.seoDescription,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, withLocale(l, "/contact")]),
      ),
    },
  };
}

export default async function LocalizedContactPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const copy = getPageCopy("contact", locale);

  return <ContactForm copy={copy} />;
}
