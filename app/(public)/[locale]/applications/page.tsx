import type { Metadata } from "next";
import { ApplicationAuthForm } from "@/components/public/ApplicationAuthForm";

export const metadata: Metadata = {
  title: "Application Login | JaxiCloud",
  description: "Sign in to the JaxiCloud Platform to manage your fleet.",
};

export default function ApplicationsPage() {
  return (
    <ApplicationAuthForm />
  );
}
