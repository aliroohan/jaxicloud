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
        <ContactForm />
      </div>
    </div>
  );
}
