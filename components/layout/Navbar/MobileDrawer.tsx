"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight, X } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo/BrandLogo";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOBILE_NAV_LINKS = [
  { href: "/products", label: "Products Catalog" },
  { href: "/solutions", label: "Fleet Solutions" },
  { href: "/bundles", label: "Hardware Bundles" },
  { href: "/contact", label: "Contact Sales" },
  { href: "/inquiry", label: "View Quote Inquiry" },
];

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm"
          />

          {/* Drawer Slide Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white p-6 shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <BrandLogo size="sm" />
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-slate-500 hover:text-navy rounded-full hover:bg-slate-100 transition"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="mt-6 flex flex-col gap-2">
                {MOBILE_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl font-medium text-navy hover:bg-cyan-50/60 hover:text-accent transition"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Drawer Bottom CTA */}
            <div className="pt-6 border-t border-border">
              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-accent text-white font-semibold shadow-md hover:bg-accent-dark transition"
              >
                <span>Contact Enterprise Sales</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
