import type { Metadata } from "next";
import { ContactForm } from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Jaxicloud Fleet sales for quotes and demos.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl text-navy">Contact Sales</h1>
      <p className="mt-2 text-muted">
        Tell us about your fleet. We&apos;ll follow up with a quote — no online
        checkout.
      </p>
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <ContactForm />
      </div>
    </div>
  );
}
