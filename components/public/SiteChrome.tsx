import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";

export function SiteHeader() {
  return (
    <>
      <Navbar />
    </>
  );
}

export function SiteFooter() {
  return <Footer />;
}
