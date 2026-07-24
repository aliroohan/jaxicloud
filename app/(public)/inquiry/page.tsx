import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";
import { InquiryWizard } from "@/components/public/InquiryWizard/InquiryWizard";
import styles from "@/components/public/InquiryWizard/InquiryWizard.module.css";

export const metadata: Metadata = {
  title: "Interactive Proposal Journey | JaxiCloud Commercial Fleet",
  description: "Configure your commercial fleet scale, industry vertical, and hardware specs.",
};

export default function InquiryPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Minimalist Editorial Header */}
        <div className={styles.headerBlock}>
          <div className={styles.sectionTag}>
            <ClipboardList className="w-3.5 h-3.5 text-cyan-600" />
            <span>COMMERCIAL PROPOSAL JOURNEY</span>
          </div>
          <h1 className={styles.pageTitle}>Custom Telematics Proposal Journey</h1>
          <p className={styles.subheadline}>
            Tailor your telematics proposal step-by-step. Specify fleet scale, commercial
            industry vertical, contact details, and discovery channel.
          </p>
        </div>

        <InquiryWizard />
      </div>
    </div>
  );
}
