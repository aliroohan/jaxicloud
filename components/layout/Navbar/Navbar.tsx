"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, Search, Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { BrandLogo } from "@/components/common/BrandLogo/BrandLogo";
import { MegaDropdown } from "@/components/layout/Navbar/MegaDropdown";
import { MobileDrawer } from "@/components/layout/Navbar/MobileDrawer";
import { InquiryBadge } from "@/components/public/InquiryBadge";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";
import {
  DEFAULT_LOCALE,
  LOCALE_LABELS,
  LOCALES,
  hasLocalizedRoute,
  stripLocale,
  swapLocale,
  withLocale,
  type Locale,
} from "@/lib/i18n/config";
import styles from "./Navbar.module.css";

const LANGUAGES = LOCALES.map((locale) => ({
  locale,
  code: LOCALE_LABELS[locale].code,
  label: LOCALE_LABELS[locale].native,
}));

const NAV_ITEMS = [
  { id: "products", label: "Products", href: "/products", hasMega: true },
  { id: "solutions", label: "Solutions", href: "/solutions", hasMega: true },
  { id: "applications", label: "Application", href: "/applications", hasMega: true },
  { id: "services", label: "Services", href: "/services", hasMega: false },
  { id: "blog", label: "Blog", href: "/blog", hasMega: false },
  { id: "contact", label: "Contact", href: "/contact", hasMega: false },
];

const MagneticButton = ({ children, className, href }: { children: React.ReactNode; className?: string; href: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.a>
  );
};

export function Navbar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { locale: pathLocale } = stripLocale(pathname);
  const activeLocale: Locale = pathLocale || DEFAULT_LOCALE;

  const { isScrolled } = useScrollPosition(40);
  const [activeMegaTab, setActiveMegaTab] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const megaTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const langWrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const brandGroupRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLElement>(null);
  const actionsGroupRef = useRef<HTMLDivElement>(null);

  const selectedLang = LOCALE_LABELS[activeLocale].code;

  const localizedHref = (href: string) => {
    if (hasLocalizedRoute(href)) {
      return withLocale(activeLocale, href);
    }
    return href;
  };

  const switchLocale = (next: Locale) => {
    setIsLangOpen(false);
    const { path } = stripLocale(pathname);
    // Stay on the current page when it has a localized route; otherwise fall back to solutions
    if (hasLocalizedRoute(path)) {
      router.push(swapLocale(pathname, next));
      return;
    }
    router.push(withLocale(next, "/solutions"));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langWrapperRef.current &&
        !langWrapperRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  useEffect(() => {
    if (!headerRef.current || !navLinksRef.current || !actionsGroupRef.current || !brandGroupRef.current) return;

    // The Apple-style Dynamic Pill Entrance (Physical Width Expansion)
    const tl = gsap.timeline();

    // 1. Initial State: Small physical pill, starting above screen
    gsap.set(headerRef.current, {
      y: -80,
      width: "120px",
      opacity: 0,
      overflow: "hidden", // Keep children from breaking the pill
    });

    // Hide content initially so the pill is empty while dropping
    gsap.set([brandGroupRef.current, navLinksRef.current, actionsGroupRef.current], {
      opacity: 0,
      scale: 0.95,
    });

    // 2. Drop the Pill
    tl.to(headerRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "elastic.out(1, 0.75)"
    });

    // 3. Expand the Pill horizontally
    tl.to(headerRef.current, {
      width: "100%", // Margin: 0 auto ensures it expands equally from the center!
      duration: 1.8, // Slowed down significantly for a luxurious feel
      ease: "power3.inOut" // Smoother, less snappy ease than expo
    }, "-=0.1"); // Start slightly later so it drops more before expanding

    // 4. Fade in and scale up the content gracefully inside the expanded pill
    tl.to([brandGroupRef.current, navLinksRef.current, actionsGroupRef.current], {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    }, "-=0.6");

    // 5. Cleanup overflow so MegaDropdowns can overflow safely
    tl.to(headerRef.current, {
      clearProps: "overflow,width",
      duration: 0.1
    });

  }, []);

  return (
    <>
      <div
        className={`${styles.headerOuter} ${isScrolled ? styles.headerOuterScrolled : ""
          }`}
      >
        <header
          ref={headerRef}
          className={`${styles.navbarWrapper} ${isScrolled ? styles.navbarScrolled : ""
            }`}
        >
          {/* Left: Brand Logo */}
          <div ref={brandGroupRef} className={styles.brandGroup}>
            <Link href={withLocale(activeLocale, "/")} className="flex items-center">
              <BrandLogo size="md" />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links with Mega Dropdown triggers */}
          <nav
            ref={navLinksRef}
            className={styles.navLinks}
            onMouseLeave={() => {
              handleMouseLeave();
              setHoveredTab(null);
            }}
            aria-label="Main Navigation"
          >
            {/* Gooey SVG Filter Definition */}
            <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
              <defs>
                <filter id="nav-goo">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                  <feBlend in="SourceGraphic" in2="goo" />
                </filter>
              </defs>
            </svg>

            {/* Background Liquid Layer */}
            <div className={styles.gooeyLayer}>
              {NAV_ITEMS.map((item) => (
                <div key={`bg-${item.id}`} className={styles.navItemWrapper}>
                  <div className={styles.navButtonPlaceholder}>
                    {/* Invisible text to force identical width */}
                    <span className={styles.navItemTextHidden}>{item.label}</span>
                    {item.hasMega && <ChevronDown className="w-3.5 h-3.5 opacity-0" />}

                    {/* Static Anchor Dot for liquid pulling */}
                    <div className={styles.navAnchorDot} />

                    {/* Moving Hover Pill */}
                    {hoveredTab === item.id && (
                      <motion.div
                        layoutId="navHoverPill"
                        className={styles.navHoverPill}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Foreground Text Layer */}
            <div className={styles.textLayer}>
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className={styles.navItemWrapper}
                  onMouseEnter={() => {
                    handleMouseEnter(item.id, item.hasMega);
                    setHoveredTab(item.id);
                  }}
                >
                  <Link
                    href={localizedHref(item.href)}
                    className={`${styles.navButton} ${activeMegaTab === item.id ? styles.navButtonActive : ""
                      }`}
                  >
                    <span className={styles.navItemText}>{item.label}</span>
                    {item.hasMega && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 relative z-10 ${activeMegaTab === item.id ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </nav>

          {/* Active Mega Dropdown Panel Centered relative to Navbar Container */}
          {activeMegaTab && (
            <MegaDropdown
              activeTab={activeMegaTab}
              locale={activeLocale}
              onClose={() => setActiveMegaTab(null)}
              onMouseEnter={() => {
                if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
              }}
              onMouseLeave={handleMouseLeave}
            />
          )}

          {/* Right: Actions Group (Search Trigger, Inquiry Counter, CTA & Mobile Hamburger) */}
          <div ref={actionsGroupRef} className={styles.actionsGroup}>
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
              <Search className="w-4 h-4" />
            </button>

            {/* Quote Inquiry Shortlist Badge */}
            <div className={styles.hideOnMobile}>
              <InquiryBadge />
            </div>

            {/* Language Switcher */}
            <div ref={langWrapperRef} className={`${styles.langDropdownWrapper} ${styles.hideOnMobile}`}>
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={styles.langButton}
              >
                <Globe className="w-4 h-4" />
                <span>{selectedLang}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className={styles.langMenu}
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.locale}
                        type="button"
                        onClick={() => switchLocale(lang.locale)}
                        className={`${styles.langOption} ${selectedLang === lang.code ? styles.langOptionActive : ""
                          }`}
                      >
                        <span>{lang.label}</span>
                        {selectedLang === lang.code && (
                          <Check className="w-3 h-3 text-current" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary CTA (Magnetic Effect) */}
            <MagneticButton href={localizedHref("/contact")} className={`${styles.primaryCta} ${styles.hideOnMobile}`}>
              <span>Contact Sales</span>
            </MagneticButton>

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
      </div>

      {/* Slide-over Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />
    </>
  );
}
