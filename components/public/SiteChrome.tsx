import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar/TopBar";
import { Navbar } from "@/components/layout/Navbar/Navbar";

export function SiteHeader() {
  return (
    <>
      <TopBar />
      <Navbar />
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-navy text-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-2xl text-white">Jaxicloud Fleet</p>
          <p className="mt-2 max-w-md text-sm text-slate-300">
            Integrated vehicle safety and telematics hardware for commercial
            fleets — catalog and quote requests only.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/products" className="hover:text-white">
            Products
          </Link>
          <Link href="/bundles" className="hover:text-white">
            Bundles
          </Link>
          <Link href="/solutions" className="hover:text-white">
            Solutions
          </Link>
          <Link href="/inquiry" className="hover:text-white">
            Inquiry
          </Link>
          <Link href="/admin" className="hover:text-white">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
