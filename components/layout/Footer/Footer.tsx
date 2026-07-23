"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo/BrandLogo";
import styles from "./Footer.module.css";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className={styles.footerSection}>
      <div className={styles.container}>
        {/* Top Band: Frosted Glass Newsletter Subscription Card */}
        <div className={styles.newsletterCard}>
          <div>
            <h3 className={styles.newsletterTitle}>
              Stay Ahead of Commercial Telematics Innovation.
            </h3>
            <p className={styles.newsletterDesc}>
              Receive quarterly enterprise insights on AI vision, CANbus protocols,
              and fleet compliance. Zero spam.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your corporate email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.emailInput}
              required
            />
            <button type="submit" className={styles.subscribeBtn}>
              {subscribed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Subscribe Insights</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Middle Band: 5-Column Navigation Grid */}
        <div className={styles.navGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link href="/" className="inline-block">
              <BrandLogo className="h-9 w-auto text-navy" />
            </Link>
            <p className={styles.brandTagline}>
              Enterprise fleet technology platform unifying AI vision, satellite GPS,
              and CANbus diagnostics into one intelligent operating system.
            </p>
            <div className={styles.brandContact}>
              <div>
                Sales Inquiry:{" "}
                <a href="mailto:sales@jaxicloud.com" className={styles.brandContactLink}>
                  sales@jaxicloud.com
                </a>
              </div>
              <div>
                Support Portal:{" "}
                <a href="tel:+18005555294" className={styles.brandContactLink}>
                  +1 (800) 555-JAXI
                </a>
              </div>
            </div>
          </div>

          {/* Col 1: Products */}
          <div>
            <div className={styles.colTitle}>Hardware Products</div>
            <ul className={styles.linkList}>
              <li>
                <Link href="/products?category=dash-cameras" className={styles.footerLink}>
                  Dash Cameras & AI
                </Link>
              </li>
              <li>
                <Link href="/products?category=gps-trackers" className={styles.footerLink}>
                  GPS Trackers & OBD
                </Link>
              </li>
              <li>
                <Link href="/products?category=driver-terminals" className={styles.footerLink}>
                  Driver Terminals & ELD
                </Link>
              </li>
              <li>
                <Link href="/products?category=sensors" className={styles.footerLink}>
                  BLE Sensors & TPMS
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Solutions */}
          <div>
            <div className={styles.colTitle}>Fleet Solutions</div>
            <ul className={styles.linkList}>
              <li>
                <Link href="/solutions/fleet-tracking" className={styles.footerLink}>
                  Freight & Highway
                </Link>
              </li>
              <li>
                <Link href="/solutions/passenger-transit" className={styles.footerLink}>
                  Passenger Transit
                </Link>
              </li>
              <li>
                <Link href="/solutions/cold-chain-logistics" className={styles.footerLink}>
                  Cold-Chain Logistics
                </Link>
              </li>
              <li>
                <Link href="/solutions/heavy-machinery" className={styles.footerLink}>
                  Construction & Assets
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform */}
          <div>
            <div className={styles.colTitle}>Platform Tech</div>
            <ul className={styles.linkList}>
              <li>
                <Link href="/bundles" className={styles.footerLink}>
                  Hardware Bundles
                </Link>
              </li>
              <li>
                <a href="#api" className={styles.footerLink}>
                  REST API 2.0 Docs
                </a>
              </li>
              <li>
                <a href="#canbus" className={styles.footerLink}>
                  CANbus J1939 Specs
                </a>
              </li>
              <li>
                <a href="#security" className={styles.footerLink}>
                  Security & SOC 2
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Company */}
          <div>
            <div className={styles.colTitle}>Company & Legal</div>
            <ul className={styles.linkList}>
              <li>
                <Link href="/contact" className={styles.footerLink}>
                  Contact Enterprise Sales
                </Link>
              </li>
              <li>
                <a href="#about" className={styles.footerLink}>
                  About JaxiCloud
                </a>
              </li>
              <li>
                <a href="#privacy" className={styles.footerLink}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className={styles.footerLink}>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Band: Compliance Seals & Copyright */}
        <div className={styles.bottomBar}>
          <div className={styles.complianceRow}>
            <span className={styles.complianceTag}>ISO 27001 CERTIFIED</span>
            <span className={styles.complianceTag}>SOC 2 TYPE II VERIFIED</span>
            <span className={styles.complianceTag}>GDPR COMPLIANT</span>
          </div>

          <div className={styles.copyrightText}>
            © {new Date().getFullYear()} JaxiCloud Technologies Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
