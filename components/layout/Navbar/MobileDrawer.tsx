"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ArrowRight, ChevronRight, X, Layers, Network, Package, Phone, FileText } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo/BrandLogo";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOBILE_NAV_LINKS = [
  {
    href: "/products",
    label: "Products Catalog",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { href: "/products/dashcams", label: "AI Dashcams" },
      { href: "/products/gps", label: "GPS Tracking" },
      { href: "/products/eld", label: "ELD Compliance" },
      { href: "/products/sensors", label: "Environment Sensors" },
    ]
  },
  {
    href: "/solutions",
    label: "Fleet Solutions",
    icon: <Network className="w-5 h-5" />,
    items: [
      { href: "/solutions/trucking", label: "Commercial Trucking" },
      { href: "/solutions/delivery", label: "Last Mile Delivery" },
      { href: "/solutions/construction", label: "Heavy Construction" },
      { href: "/solutions/transit", label: "Public Transit" },
    ]
  },
  { href: "/bundles", label: "Hardware Bundles", icon: <Package className="w-5 h-5" /> },
  { href: "/contact", label: "Contact Sales", icon: <Phone className="w-5 h-5" /> },
  { href: "/inquiry", label: "View Quote Inquiry", icon: <FileText className="w-5 h-5" /> },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const slideIn: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  exit: { opacity: 0, x: -20 }
};

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpand = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with strong blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md"
          />

          {/* Drawer Slide Panel */}
          <motion.div
            initial={{ x: "100%", borderTopLeftRadius: "50%" }}
            animate={{ x: 0, borderTopLeftRadius: "1.5rem", borderBottomLeftRadius: "1.5rem" }}
            exit={{ x: "100%", borderTopLeftRadius: "50%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-[101] w-[85%] max-w-sm bg-white/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.1)] flex flex-col border-l border-white/50"
          >
            {/* Drawer Header (Sticky) */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 pb-4 border-b border-slate-200/60 bg-white/50">
              <BrandLogo size="sm" />
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-100/50 hover:bg-slate-200/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items (Scrollable Body) */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <motion.div
                className="flex flex-col gap-2"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {MOBILE_NAV_LINKS.map((link) => {
                  const isExpanded = expandedItem === link.label;

                  return (
                    <motion.div key={link.href} variants={slideIn} className="flex flex-col">
                      <Link
                        href={link.items ? "#" : link.href}
                        onClick={(e) => {
                          if (link.items) {
                            toggleExpand(e, link.label);
                          } else {
                            onClose();
                          }
                        }}
                        className="group flex items-center p-3 rounded-2xl text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all duration-300 focus:outline-none focus:bg-sky-50"
                      >
                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors mr-3 sm:mr-4 flex-shrink-0 ${isExpanded ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 group-hover:bg-sky-100 group-hover:text-sky-600 text-slate-500'}`}>
                          {link.icon}
                        </div>
                        {/* Use text-[15px] on ultra-small screens, text-base on slightly larger to prevent wrapping */}
                        <span className="font-semibold text-[15px] sm:text-base flex-1 tracking-tight">
                          {link.label}
                        </span>
                        <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${isExpanded ? "rotate-90 text-sky-500" : "text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1"}`} />
                      </Link>

                      {/* Accordion Sub-Menu */}
                      <AnimatePresence>
                        {isExpanded && link.items && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden pl-[3.25rem] sm:pl-[4.25rem] pr-2"
                          >
                            <div className="flex flex-col gap-1 pb-3 pt-1">
                              {link.items.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  onClick={onClose}
                                  className="text-sm font-medium text-slate-500 hover:text-sky-600 py-2 transition-colors focus:outline-none focus:text-sky-600"
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Drawer Bottom CTA (Sticky) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="flex-shrink-0 p-6 pt-4 border-t border-slate-200/60 bg-white/50"
            >
              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-4 px-3 rounded-2xl bg-slate-900 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-slate-800 transition-all duration-300 text-[15px] sm:text-base whitespace-nowrap"
              >
                <span>Contact Enterprise Sales</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </Link>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
