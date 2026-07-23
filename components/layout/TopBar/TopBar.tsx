"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe, Headphones, Mail, Phone } from "lucide-react";
import styles from "./TopBar.module.css";

const LANGUAGES = [
  { code: "EN", label: "English (US)" },
  { code: "ES", label: "Español" },
  { code: "FR", label: "Français" },
  { code: "DE", label: "Deutsch" },
];

export function TopBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  const langWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
        setIsLangOpen(false);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <div
      className={`${styles.topBarWrapper} ${
        isScrolled ? styles.topBarHidden : ""
      }`}
    >
      <div className={styles.container}>
        {/* Left Utility Links: Sales Phone & Email */}
        <div className={styles.leftGroup}>
          <a href="tel:+18005555294" className={styles.itemLink}>
            <Phone className={styles.icon} />
            <span>+1 (800) 555-JAXI</span>
          </a>

          <div className={styles.divider} aria-hidden="true" />

          <a href="mailto:sales@jaxicloud.com" className={styles.itemLink}>
            <Mail className={styles.icon} />
            <span>sales@jaxicloud.com</span>
          </a>
        </div>

        {/* Right Utility Links: Support Portal & Language Selector */}
        <div className={styles.rightGroup}>
          <a
            href="https://support.jaxicloud.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.itemLink}
          >
            <Headphones className={styles.icon} />
            <span>Support Portal</span>
          </a>

          <div className={styles.divider} aria-hidden="true" />

          {/* Regional Language Switcher Dropdown */}
          <div ref={langWrapperRef} className={styles.langDropdownWrapper}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={styles.langButton}
              aria-expanded={isLangOpen}
              aria-label="Select Language"
            >
              <Globe className={styles.icon} />
              <span>{selectedLang}</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  isLangOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={styles.langMenu}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setSelectedLang(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`${styles.langOption} ${
                        selectedLang === lang.code ? styles.langOptionActive : ""
                      }`}
                    >
                      <span>{lang.label}</span>
                      {selectedLang === lang.code && (
                        <Check className="w-3 h-3 text-cyan-400" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
