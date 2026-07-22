import type { Metadata } from "next";
import { InquiryPageClient } from "@/components/public/InquiryPageClient";

export const metadata: Metadata = {
  title: "Inquiry",
  description: "Review your inquiry list and submit a quote request.",
};

export default function InquiryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl text-navy">Your inquiry</h1>
      <p className="mt-2 text-muted">
        Items are stored in your browser until you submit. No payment required.
      </p>
      <div className="mt-8">
        <InquiryPageClient />
      </div>
    </div>
  );
}
