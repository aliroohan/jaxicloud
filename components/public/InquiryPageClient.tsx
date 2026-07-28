"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useInquiryStore } from "@/store/inquiry";
import styles from "./InquiryPage.module.css";

const FLEET_SCALES = [
  "1-25 Fleets",
  "25-100 Fleets",
  "100-500 Fleets",
  "500+ Enterprise",
];

export function InquiryPageClient() {
  const { items, removeItem, updateQuantity, clear } = useInquiryStore();
  const [fleetScale, setFleetScale] = useState("25-100 Fleets");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) {
      setError("Please add at least one hardware unit to your proposal list first.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      company: String(form.get("company") || ""),
      fleetScale,
      message: String(form.get("message") || ""),
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
        <h2 className={styles.successTitle}>Proposal Request Submitted!</h2>
        <p className={styles.successDesc}>
          Your inquiry has been routed to our senior enterprise telematics team.
          A dedicated solutions engineer will send your custom hardware pricing sheet
          and SLA agreement within 24 business hours.
        </p>
        <Link href="/products" className={styles.browseBtn}>
          <span>Return to Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.inquiryGrid}>
      {/* Left Column: Hardware Review Deck */}
      <div className={styles.deckWrapper}>
        <div className={styles.deckHeader}>
          <h2 className={styles.deckTitle}>Selected Hardware Stack</h2>
          <span className={styles.itemCountBadge}>
            {items.length} {items.length === 1 ? "Unit Selected" : "Units Selected"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className={styles.emptyCard}>
            <h3 className={styles.emptyTitle}>Your Proposal List is Empty</h3>
            <p className={styles.emptyDesc}>
              Browse our commercial catalog to select AI dashcams, MDVR units, driver tablets, or BLE sensors.
            </p>
            <Link href="/products" className={styles.browseBtn}>
              <span>Explore Hardware Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div key={`${item.type}-${item.id}`} className={styles.itemCard}>
              <div className={styles.itemLeft}>
                <div>
                  <div className={styles.itemBadge}>{item.type}</div>
                  <Link
                    href={`/products/${item.slug}`}
                    className={styles.itemName}
                  >
                    {item.name}
                  </Link>
                </div>
              </div>

              <div className={styles.itemRight}>
                {/* Quantity Controller */}
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
          ))
        )}
      </div>

      {/* Right Column: Sticky Form Panel */}
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Enterprise Proposal Form</h2>
        <p className={styles.formSubtitle}>
          Complete your corporate contact details for official hardware quote & SLA proposal.
        </p>

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
            <label className={styles.formLabel}>Company / Fleet Operator *</label>
            <input
              required
              name="company"
              placeholder="Vance Freight Lines Inc."
              className={styles.inputField}
            />
          </div>

          {/* Fleet Scale Chips */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Fleet Scale Size</label>
            <div className={styles.scaleChipsRow}>
              {FLEET_SCALES.map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => setFleetScale(scale)}
                  className={`${styles.scaleChip} ${
                    fleetScale === scale ? styles.scaleChipActive : ""
                  }`}
                >
                  {scale}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Project Notes & Timeline</label>
            <textarea
              name="message"
              rows={3}
              placeholder="Describe your fleet deployment timeline, preferred hardware models, or special CANbus requirements..."
              className={styles.inputField}
            />
          </div>

          {status === "error" && (
            <p className="text-xs font-semibold text-rose-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className={styles.submitBtn}
          >
            <span>{status === "loading" ? "Submitting Request..." : "Request Proposal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* SLA Guarantee Box */}
        <div className={styles.slaBox}>
          <ShieldCheck className="w-5 h-5 text-cyan-600 shrink-0" />
          <div className={styles.slaText}>
            <strong>24-Hour Proposal Guarantee:</strong> Dedicated telematics engineer assigned upon submission. Zero commercial obligation.
          </div>
        </div>
      </div>
    </div>
  );
}
