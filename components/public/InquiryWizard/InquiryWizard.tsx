"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bus,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Compass,
  Globe,
  HardHat,
  Layers,
  MapPin,
  Minus,
  Plus,
  Radio,
  Search,
  Share2,
  ShieldCheck,
  Snowflake,
  Truck,
  UserCheck,
  Users,
} from "lucide-react";
import { useInquiryStore } from "@/store/inquiry";
import styles from "./InquiryWizard.module.css";

const FLEET_SCALES = [
  { id: "s1", title: "1–25 Fleets", subtitle: "Small Commercial Fleet" },
  { id: "s2", title: "25–100 Fleets", subtitle: "Mid-Market Operator" },
  { id: "s3", title: "100–500 Fleets", subtitle: "Enterprise Logistics" },
  { id: "s4", title: "500+ Enterprise", subtitle: "Global Heavy Fleet" },
];

const INDUSTRIES = [
  {
    id: "ind-1",
    name: "Freight & Highway",
    desc: "Long-haul semi trucks, ADAS cameras, CANbus fuel monitoring.",
    icon: Truck,
  },
  {
    id: "ind-2",
    name: "Passenger Transit",
    desc: "Municipal buses, passenger counters, driver tablets, ELD logs.",
    icon: Bus,
  },
  {
    id: "ind-3",
    name: "Cold-Chain Logistics",
    desc: "Refrigerated transport, wireless BLE temp pods, door sensors.",
    icon: Snowflake,
  },
  {
    id: "ind-4",
    name: "Heavy Construction",
    desc: "Underground excavators, IP69K asset trackers, PTO sensors.",
    icon: HardHat,
  },
  {
    id: "ind-5",
    name: "School Transport",
    desc: "Student safety cameras, stop-arm alerts, cabin passenger monitoring.",
    icon: Users,
  },
  {
    id: "ind-6",
    name: "Municipal & OEM",
    desc: "Government vehicles, emergency services, OEM gateway integration.",
    icon: ShieldCheck,
  },
];

const CHANNELS = [
  { id: "ch-1", name: "LinkedIn", icon: Globe },
  { id: "ch-2", name: "Industry Referral", icon: Share2 },
  { id: "ch-3", name: "Trade Show Expo", icon: Compass },
  { id: "ch-4", name: "Search Engine", icon: Search },
  { id: "ch-5", name: "Email Newsletter", icon: Radio },
  { id: "ch-6", name: "Other Channel", icon: Globe },
];

const MILESTONES = [
  { id: 0, title: "Fleet Scale", subtitle: "Units & Scale" },
  { id: 1, title: "Industry", subtitle: "Vertical Application" },
  { id: 2, title: "Identity", subtitle: "Corporate Info" },
  { id: 3, title: "Channel", subtitle: "Finalize & Submit" },
];

export function InquiryWizard() {
  const { items, removeItem, updateQuantity, clear } = useInquiryStore();

  const [step, setStep] = useState(0); // 0, 1, 2, 3
  const [direction, setDirection] = useState(1);

  // Form State
  const [fleetScale, setFleetScale] = useState("25–100 Fleets");
  const [selectedIndustry, setSelectedIndustry] = useState("Freight & Highway");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [region, setRegion] = useState("North America");
  const [discoveryChannel, setDiscoveryChannel] = useState("LinkedIn");
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const lineFillPct = (step / 3) * 100;

  const handleNext = () => {
    if (step < 3) {
      setDirection(1);
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((prev) => prev - 1);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !email || !company) {
      setError("Please complete all required contact fields.");
      return;
    }

    setStatus("loading");
    setError("");

    const payload = {
      name: fullName,
      email,
      phone,
      company,
      region,
      fleetScale,
      industry: selectedIndustry,
      discoveryChannel,
      message: notes,
      items: items.map((item) => ({
        productId: item.type === "product" ? item.id : undefined,
        bundleId: item.type === "bundle" ? item.id : undefined,
        name: item.name,
        slug: item.slug,
        quantity: item.quantity,
        type: item.type,
      })),
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit proposal request");
      }

      clear();
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Submission failed");
    }
  }

  if (status === "ok") {
    return (
      <div className={styles.successCard}>
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
        <div className={styles.refBadge}>PROPOSAL TRACKING ID: #JXC-8942-PR</div>
        <h2 className={styles.successTitle}>Proposal Journey Complete!</h2>
        <p className={styles.successDesc}>
          Your custom telematics requirements have been dispatched to our senior engineering team.
          A dedicated telematics solutions architect will email your official hardware pricing sheet
          and compatibility audit within 24 business hours.
        </p>
        <Link href="/products" className={styles.nextBtn} style={{ margin: "0 auto" }}>
          <span>Return to Hardware Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Milestone Progress Tracker Stage */}
      <div className={styles.milestoneStage}>
        <div className={styles.milestonesRow}>
          {/* Connecting Line Track */}
          <div className={styles.milestoneLineTrack}>
            <div
              className={styles.milestoneLineFill}
              style={{ width: `${lineFillPct}%` }}
            />
          </div>

          {MILESTONES.map((ms) => {
            const isCompleted = step > ms.id;
            const isActive = step === ms.id;

            return (
              <div
                key={ms.id}
                onClick={() => {
                  setDirection(ms.id > step ? 1 : -1);
                  setStep(ms.id);
                }}
                className={`${styles.milestoneCard} ${
                  isActive ? styles.milestoneActive : ""
                } ${isCompleted ? styles.milestoneCompleted : ""}`}
              >
                <div className={styles.milestoneCircle}>
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span>{`0${ms.id + 1}`}</span>
                  )}
                </div>

                <div className={styles.milestoneTitle}>{ms.title}</div>
                <div className={styles.milestoneSub}>{ms.subtitle}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Wizard Card Stage (Directional Slide - Zero Blur) */}
      <div className={styles.wizardCard}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className={styles.stepTitle}>01. Hardware Stack & Fleet Scale</h2>
              <p className={styles.stepSubtitle}>
                Review your selected units and choose your operational fleet scale.
              </p>

              {/* Selected Hardware Items */}
              {items.length > 0 ? (
                <div className={styles.hardwareList}>
                  {items.map((item) => (
                    <div key={`${item.type}-${item.id}`} className={styles.itemRow}>
                      <div>
                        <div className={styles.itemCategory}>{item.type}</div>
                        <div className={styles.itemName}>{item.name}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={styles.quantityBox}>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.type,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className={styles.quantityBtn}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className={styles.quantityVal}>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.type, item.quantity + 1)
                            }
                            className={styles.quantityBtn}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id, item.type)}
                          className={styles.removeBtn}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-8 text-sm text-slate-500 italic">
                  No items selected from catalog yet. You can still request a custom hardware quote below.
                </p>
              )}

              {/* Fleet Scale Choice Grid */}
              <div className={styles.scaleGrid}>
                {FLEET_SCALES.map((scale) => (
                  <div
                    key={scale.id}
                    onClick={() => setFleetScale(scale.title)}
                    className={`${styles.scaleCard} ${
                      fleetScale === scale.title ? styles.scaleCardActive : ""
                    }`}
                  >
                    <div className={styles.scaleTitle}>{scale.title}</div>
                    <div className={styles.scaleSubtitle}>{scale.subtitle}</div>
                  </div>
                ))}
              </div>

              {/* Step Navigation Bar */}
              <div className={styles.navBar}>
                <div />
                <button type="button" onClick={handleNext} className={styles.nextBtn}>
                  <span>Next: Select Industry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className={styles.stepTitle}>02. Commercial Industry Vertical</h2>
              <p className={styles.stepSubtitle}>
                Select your primary fleet vertical for pre-mapped CANbus compliance.
              </p>

              {/* Industry Cards Grid */}
              <div className={styles.industryGrid}>
                {INDUSTRIES.map((ind) => {
                  const IconComp = ind.icon;
                  const isSelected = selectedIndustry === ind.name;

                  return (
                    <div
                      key={ind.id}
                      onClick={() => setSelectedIndustry(ind.name)}
                      className={`${styles.industryCard} ${
                        isSelected ? styles.industryCardActive : ""
                      }`}
                    >
                      <div className={styles.industryHeader}>
                        <IconComp className={`w-6 h-6 ${styles.industryIcon}`} />
                        {isSelected && <CheckSquare className="w-5 h-5 text-cyan-400" />}
                      </div>

                      <div className={styles.industryName}>{ind.name}</div>
                      <div className={styles.industryDesc}>{ind.desc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Step Navigation Bar */}
              <div className={styles.navBar}>
                <button type="button" onClick={handlePrev} className={styles.prevBtn}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button type="button" onClick={handleNext} className={styles.nextBtn}>
                  <span>Next: Contact Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className={styles.stepTitle}>03. Identity & Corporate Details</h2>
              <p className={styles.stepSubtitle}>
                Where should we send your official telematics proposal?
              </p>

              {/* Form Inputs Grid */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name *</label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Corporate Email *</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcus@vancefreight.com"
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Direct Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Company / Fleet Operator *</label>
                  <input
                    required
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Vance Freight Lines Inc."
                    className={styles.inputField}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.formLabel}>Operational Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className={styles.inputField}
                  >
                    <option value="North America">North America (US & Canada)</option>
                    <option value="Europe">European Union & UK</option>
                    <option value="Latin America">Latin America</option>
                    <option value="Asia Pacific">Asia Pacific & Australia</option>
                    <option value="Middle East & Africa">Middle East & Africa</option>
                  </select>
                </div>
              </div>

              {/* Step Navigation Bar */}
              <div className={styles.navBar}>
                <button type="button" onClick={handlePrev} className={styles.prevBtn}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!fullName || !email || !company}
                  className={styles.nextBtn}
                >
                  <span>Next: Final Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className={styles.stepTitle}>04. How Did You Discover Us?</h2>
              <p className={styles.stepSubtitle}>
                Select your referral channel and add optional fleet deployment notes.
              </p>

              {/* Channel Grid Cards */}
              <div className={styles.channelGrid} style={{ marginBottom: "2rem" }}>
                {CHANNELS.map((ch) => {
                  const IconComponent = ch.icon;
                  const isSelected = discoveryChannel === ch.name;

                  return (
                    <div
                      key={ch.id}
                      onClick={() => setDiscoveryChannel(ch.name)}
                      className={`${styles.channelCard} ${
                        isSelected ? styles.channelCardActive : ""
                      }`}
                    >
                      <IconComponent className="w-4 h-4 text-cyan-600" />
                      <span className={styles.channelName}>{ch.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Notes Textarea */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Deployment Notes & Requirements</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us about your fleet timeline, preferred hardware models, or CANbus integration needs..."
                  className={styles.inputField}
                />
              </div>

              {error && <p className="mt-3 text-xs font-semibold text-rose-600">{error}</p>}

              {/* Step Navigation Bar */}
              <div className={styles.navBar}>
                <button type="button" onClick={handlePrev} className={styles.prevBtn}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className={styles.nextBtn}
                >
                  <span>{status === "loading" ? "Submitting..." : "Submit Proposal Request"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
