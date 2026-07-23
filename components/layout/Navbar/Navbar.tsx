"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Search } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo/BrandLogo";
import { MegaDropdown } from "@/components/layout/Navbar/MegaDropdown";
import { MobileDrawer } from "@/components/layout/Navbar/MobileDrawer";
import { InquiryBadge } from "@/components/public/InquiryBadge";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";
import styles from "./Navbar.module.css";

const NAV_ITEMS = [
  { id: "products", label: "Products", href: "/products", hasMega: true },
  { id: "solutions", label: "Solutions", href: "/solutions", hasMega: true },
  { id: "bundles", label: "Bundles", href: "/bundles", hasMega: false },
  { id: "contact", label: "Contact", href: "/contact", hasMega: false },
];

export function Navbar() {
  const { isScrolled } = useScrollPosition(40);
  const [activeMegaTab, setActiveMegaTab] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const megaTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (tabId: string, hasMega: boolean) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    if (hasMega) {
      setActiveMegaTab(tabId);
    } else {
      setActiveMegaTab(null);
    }
  };

  const handleMouseLeave = () => {
    megaTimeoutRef.current = setTimeout(() => {
      setActiveMegaTab(null);
    }, 180);
  };

  return (
    <div
      className={`${styles.headerOuter} ${
        isScrolled ? styles.headerOuterScrolled : ""
      }`}
    >
      <header
        className={`${styles.navbarWrapper} ${
          isScrolled ? styles.navbarScrolled : ""
        }`}
      >
        {/* Left: Brand Logo */}
        <div className={styles.brandGroup}>
          <Link href="/" className="flex items-center">
            <BrandLogo size="md" />
          </Link>
        </div>

        {/* Center: Desktop Navigation Links with Mega Dropdown triggers */}
        <nav
          className={styles.navLinks}
          onMouseLeave={handleMouseLeave}
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className={styles.navItemWrapper}
              onMouseEnter={() => handleMouseEnter(item.id, item.hasMega)}
            >
              <Link
                href={item.href}
                className={`${styles.navButton} ${
                  activeMegaTab === item.id ? styles.navButtonActive : ""
                }`}
              >
                <span>{item.label}</span>
                {item.hasMega && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeMegaTab === item.id ? "rotate-180 text-cyan-600" : ""
                    }`}
                  />
                )}
              </Link>
            </div>
          ))}
        </nav>

        {/* Active Mega Dropdown Panel Centered relative to Navbar Container */}
        {activeMegaTab && (
          <MegaDropdown
            activeTab={activeMegaTab}
            onClose={() => setActiveMegaTab(null)}
            onMouseEnter={() => {
              if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          />
        )}

        {/* Right: Actions Group (Search Trigger, Inquiry Counter, CTA & Mobile Hamburger) */}
        <div className={styles.actionsGroup}>
          {/* Global Search Quick Trigger */}
          <button
            type="button"
            onClick={() => {
              // Quick trigger helper
              const event = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
              });
              window.dispatchEvent(event);
            }}
            className={styles.searchTrigger}
            aria-label="Quick Search"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search hardware...</span>
            <kbd className={styles.kbd}>⌘K</kbd>
          </button>

          {/* Quote Inquiry Shortlist Badge */}
          <InquiryBadge />

          {/* Primary CTA */}
          <Link href="/contact" className={styles.primaryCta}>
            <span>Contact Sales</span>
          </Link>

          {/* Mobile Navigation Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className={styles.mobileToggle}
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Slide-over Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />
    </div>
  );
}
