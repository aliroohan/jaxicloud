import Link from "next/link";
import { InquiryBadge } from "@/components/public/InquiryBadge";

const nav = [
  { href: "/products", label: "Products" },
  { href: "/bundles", label: "Bundles" },
  { href: "/solutions", label: "Solutions" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex flex-col leading-tight">
          <span className="font-display text-xl tracking-tight text-navy sm:text-2xl">
            Jaxicloud
          </span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
            Fleet
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-steel md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <InquiryBadge />
          <Link
            href="/contact"
            className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-dark"
          >
            Contact Sales
          </Link>
        </div>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-border/60 px-4 py-2 text-sm md:hidden">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap text-steel">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
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
