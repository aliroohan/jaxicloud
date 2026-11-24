import type { Metadata } from "next";
import { ContactForm } from "@/components/public/ContactForm";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getPageCopy } from "@/lib/i18n/pageCopy";

const copy = getPageCopy("contact", DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: copy.seoTitle,
  description: copy.seoDescription,
};

export default function ContactPage() {
  return <ContactForm copy={copy} />;
}
