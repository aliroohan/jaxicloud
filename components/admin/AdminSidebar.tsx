"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  Cpu,
  ExternalLink,
  FolderTree,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Package,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo/BrandLogo";
import styles from "./AdminConsole.module.css";

const GROUPS = [
  {
    title: "OVERVIEW",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    title: "CATALOG MANAGEMENT",
    items: [
      { href: "/admin/products", label: "Products Catalog", icon: Package, exact: false },
      { href: "/admin/categories", label: "Categories", icon: FolderTree, exact: false },
      { href: "/admin/bundles", label: "Hardware Bundles", icon: Boxes, exact: false },
      { href: "/admin/solutions", label: "Industry Solutions", icon: Layers, exact: false },
    ],
  },
  {
    title: "LEADS & QUOTES",
    items: [
      { href: "/admin/inquiries", label: "Proposal Inquiries", icon: Inbox, exact: false },
    ],
  },
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
    <aside className={styles.sidebar}>
      {/* Brand Header */}
      <div className={styles.brandHeader}>
        <Link href="/admin" className="flex items-center gap-2">
          <BrandLogo size="sm" />
          <span className={styles.systemBadge}>OS ADMIN</span>
        </Link>
      </div>

      {/* Grouped Navigation Links */}
      {GROUPS.map((group) => (
        <div key={group.title} className={styles.navGroup}>
          <div className={styles.navGroupTitle}>{group.title}</div>
          <div className={styles.navList}>
            {group.items.map((link) => {
              const IconComp = link.icon;
              const active = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.navItem} ${
                    active ? styles.navItemActive : ""
                  }`}
                >
                  <IconComp className={styles.navIcon} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* Footer Profile & System Status */}
      <div className={styles.sidebarFooter}>
        <div className={styles.statusIndicator}>
          <div className={styles.pulseGreen} />
          <span>MongoDB Connected • Sync Active</span>
        </div>

        <button type="button" onClick={logout} className={styles.logoutBtn}>
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
