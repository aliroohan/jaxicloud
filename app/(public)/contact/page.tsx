import type { Metadata } from "next";
import { Headphones } from "lucide-react";
import { ContactForm } from "@/components/public/ContactForm";
import styles from "@/components/public/ContactForm.module.css";

export const metadata: Metadata = {
  title: "Contact Enterprise Sales Engineering | JaxiCloud",
  description: "Consult with a senior telematics solutions engineer. Request live demos & hardware quotes.",
};

export default function ContactPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Minimalist Editorial Header */}
        <div className={styles.headerBlock}>
          <div className={styles.sectionTag}>
            <Headphones className="w-3.5 h-3.5 text-cyan-600" />
            <span>ENTERPRISE TELEMATICS CONSULTATION</span>
          </div>
          <h1 className={styles.pageTitle}>Contact Sales Engineering</h1>
          <p className={styles.subheadline}>
            Speak directly with a senior telematics solutions architect. Request a live demo,
            custom hardware pricing sheet, or technical CANbus SDK specs.
          </p>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
