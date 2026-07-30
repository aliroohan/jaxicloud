import type { Metadata } from "next";
import { ContactForm } from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Contact Enterprise Sales Engineering | JaxiCloud",
  description: "Consult with a senior telematics solutions engineer. Request live demos & hardware quotes.",
};

export default function ContactPage() {
  return <ContactForm />;
}
