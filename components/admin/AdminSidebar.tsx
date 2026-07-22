"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/bundles", label: "Bundles" },
  { href: "/admin/solutions", label: "Solutions" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col border-b border-slate-800 bg-slate-950 text-slate-200 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="px-5 py-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Admin</p>
        <p className="mt-1 font-display text-xl text-white">Jaxicloud</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition ${
                active
                  ? "bg-cyan-500/20 text-cyan-200"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex gap-2 border-t border-slate-800 p-4">
        <Link
          href="/"
          className="rounded-md px-3 py-2 text-sm text-slate-400 hover:text-white"
        >
          View site
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded-md px-3 py-2 text-sm text-slate-400 hover:text-white"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
