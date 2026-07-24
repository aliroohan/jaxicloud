"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Plus, Search } from "lucide-react";
import styles from "./AdminConsole.module.css";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Executive Dashboard",
  "/admin/products": "Hardware Products Catalog",
  "/admin/categories": "Taxonomy Categories",
  "/admin/bundles": "Hardware Bundles",
  "/admin/solutions": "Industry Solutions Mappings",
  "/admin/inquiries": "Inbound Proposal Inquiries",
};

export function AdminHeader() {
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] || "Admin Console";

  return (
    <header className={styles.topHeader}>
      <div className={styles.headerTitleBlock}>
        <h1 className={styles.headerTitle}>{pageTitle}</h1>
      </div>

      <div className={styles.headerActions}>
        <Link href="/" target="_blank" className={styles.siteBtn}>
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {pathname === "/admin/products" && (
          <Link href="/admin/products/new" className={styles.primaryAddBtn}>
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        )}
      </div>
    </header>
  );
}
