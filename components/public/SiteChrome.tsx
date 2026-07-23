import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar/TopBar";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";

export function SiteHeader() {
  return (
    <>
      <TopBar />
      <Navbar />
    </>
  );
}

export function SiteFooter() {
  return <Footer />;
}
