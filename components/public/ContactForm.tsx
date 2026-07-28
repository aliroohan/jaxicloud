"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Headphones,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import styles from "./ContactForm.module.css";

const REQUEST_TYPES = [
  "Get Price Quote",
  "Book Live Demo",
  "Technical Integration",
  "General Inquiry",
];

export function ContactForm() {
  const [requestType, setRequestType] = useState("Get Price Quote");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const formCardRef = useRef<HTMLDivElement>(null);

  leftCardsRef.current = [];
  const addToLeftCards = (el: HTMLDivElement | null) => {
    if (el && !leftCardsRef.current.includes(el)) {
      leftCardsRef.current.push(el);
    }
  };

  useEffect(() => {
    if (!pageRef.current) return;
    
    // Initial states for animation
    gsap.set(headerRef.current, { y: 40, opacity: 0 });
    gsap.set(leftCardsRef.current, { y: 40, opacity: 0 });
    gsap.set(formCardRef.current, { x: 40, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.1 });
    
    tl.to(headerRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    })
    .to(leftCardsRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.4")
    .to(formCardRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6");
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      requestType,
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      company: String(form.get("company") || ""),
      fleetSize: String(form.get("fleetSize") || ""),
      message: String(form.get("message") || ""),
      items: [],
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to submit");
    }
  }

  return (
    <div ref={pageRef}>
      {/* Editorial Header Block */}
      <div className={styles.headerBlock} ref={headerRef}>
        <div className={styles.sectionTag}>
          <Headphones className="w-3.5 h-3.5 text-cyan-600" />
          <span>ENTERPRISE TELEMATICS CONSULTATION</span>
        </div>
        <h1 className={styles.pageTitle}>Contact Sales Engineering</h1>
        <p className={styles.subheadline}>
          Speak directly with a senior telematics solutions architect. Request a live demo,
          custom hardware pricing sheet, or technical CANbus SDK specs.
        </p>
      </div>

      <div className={styles.contactGrid}>
        {/* Left Column: Global Support Hub */}
        <div className={styles.supportHub}>
          {/* Animated Live Status Badge */}
          <div className={styles.statusBadge} ref={addToLeftCards}>
            <div className={styles.pulseDot} />
            <span>Solutions Engineers Online • Sub-15 Min SLA</span>
          </div>

          {/* Support Cards */}
          <div className={styles.cardList}>
            {/* Sales Hotline */}
            <div className={styles.supportCard} ref={addToLeftCards}>
            <div className={styles.iconBox}>
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className={styles.cardTitle}>Enterprise Sales Hotline</div>
              <div className={styles.cardVal}>+1 (800) 555-JAXI</div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard("+1 (800) 555-JAXI", "phone")}
              className={styles.copyBtn}
            >
              {copiedField === "phone" ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Solutions Email */}
          <div className={styles.supportCard} ref={addToLeftCards}>
            <div className={styles.iconBox}>
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className={styles.cardTitle}>Solutions Engineering</div>
              <div className={styles.cardVal}>solutions@jaxicloud.com</div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard("solutions@jaxicloud.com", "email")}
              className={styles.copyBtn}
            >
              {copiedField === "email" ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Global HQ Hubs */}
          <div className={styles.supportCard} ref={addToLeftCards}>
            <div className={styles.iconBox}>
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className={styles.cardTitle}>Global Telematics Hubs</div>
              <div className={styles.cardVal}>San Jose, CA & Shenzhen Tech Park</div>
            </div>
          </div>
        </div>

        {/* Support Topics Row */}
        <div className={styles.topicSection} ref={addToLeftCards}>
          <div className={styles.topicLabel}>Direct Consultation Topics</div>
          <div className={styles.topicRow}>
            <span className={styles.topicBadge}>Hardware Pricing</span>
            <span className={styles.topicBadge}>Live Demo Request</span>
            <span className={styles.topicBadge}>CANbus SDK Integration</span>
            <span className={styles.topicBadge}>Distributor Partner</span>
          </div>
        </div>
      </div>

      {/* Right Column: Animated Form Card */}
      <div className={styles.formCard} ref={formCardRef}>
        {status === "ok" ? (
          <div className={styles.successCard}>
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h2 className={styles.successTitle}>Inquiry Sent Successfully!</h2>
            <p className={styles.successDesc}>
              Thank you for reaching out. A dedicated telematics solutions architect
              has been assigned to your request and will follow up within 15 minutes.
            </p>
          </div>
        ) : (
          <div>
            <h2 className={styles.formTitle}>Consultation Request</h2>
            <p className={styles.formSubtitle}>
              Select your inquiry objective and complete your corporate details below.
            </p>

            {/* Request Type Selector Tabs */}
            <div className={styles.tabsRow}>
              {REQUEST_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRequestType(type)}
                  className={`${styles.tabBtn} ${
                    requestType === type ? styles.tabBtnActive : ""
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name *</label>
                <input
                  required
                  name="name"
                  placeholder="e.g. Alexander Vance"
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Corporate Email *</label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="vance@logistics.com"
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Direct Phone Number</label>
                <input
                  name="phone"
                  placeholder="+1 (555) 019-2834"
                  className={styles.inputField}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Company / Organization *</label>
                <input
                  required
                  name="company"
                  placeholder="Vance Freight Lines Inc."
                  className={styles.inputField}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Estimated Fleet Size</label>
                <select name="fleetSize" className={styles.inputField}>
                  <option value="1-25">1–25 Commercial Fleets</option>
                  <option value="25-100">25–100 Mid-Market Fleets</option>
                  <option value="100-500">100–500 Enterprise Fleets</option>
                  <option value="500+">500+ Global Heavy Fleets</option>
                </select>
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Message & Project Specs</label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder={`Tell us more about your ${requestType.toLowerCase()} requirements, vehicle types, or deployment timeline...`}
                  className={styles.inputField}
                />
              </div>

              {status === "error" && (
                <p className="col-span-full text-xs font-semibold text-rose-600">
                  {error}
                </p>
              )}

              <div className="col-span-full">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={styles.submitBtn}
                >
                  <span>{status === "loading" ? "Dispatching..." : "Send Consultation Request"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
