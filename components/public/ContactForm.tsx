"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import styles from "./ContactForm.module.css";

const REQUEST_TYPES = ["Get Price Quote", "Book Live Demo", "Technical Integration", "General Inquiry"];

export function ContactForm() {
  const [requestType, setRequestType] = useState("Get Price Quote");
  const [status, setStatus]           = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error,  setError]            = useState("");

  const pageRef        = useRef<HTMLDivElement>(null);
  const tagRef         = useRef<HTMLDivElement>(null);
  const line1Ref       = useRef<HTMLSpanElement>(null);
  const line2Ref       = useRef<HTMLSpanElement>(null);
  const subRef         = useRef<HTMLParagraphElement>(null);
  const videoPanelRef  = useRef<HTMLDivElement>(null);
  const formPanelRef   = useRef<HTMLDivElement>(null);
  const formTitleRef   = useRef<HTMLDivElement>(null);
  const chipsRef       = useRef<HTMLDivElement>(null);
  const fieldsRef      = useRef<(HTMLDivElement | null)[]>([]);
  const submitRef      = useRef<HTMLButtonElement>(null);
  const infoRowRef     = useRef<HTMLDivElement>(null);

  fieldsRef.current = [];
  const addField = (el: HTMLDivElement | null) => {
    if (el && !fieldsRef.current.includes(el)) fieldsRef.current.push(el);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ─── Set all elements invisible before the story begins ───
      gsap.set(tagRef.current,        { opacity: 0, y: 24, filter: "blur(6px)" });
      gsap.set([line1Ref.current, line2Ref.current], { opacity: 0, y: 60, skewY: 3 });
      gsap.set(subRef.current,        { opacity: 0, y: 20 });
      gsap.set(videoPanelRef.current, { clipPath: "inset(0 100% 0 0)", opacity: 0 });
      gsap.set(formPanelRef.current,  { opacity: 0, x: 50 });
      gsap.set(formTitleRef.current,  { opacity: 0, y: 20 });
      gsap.set(chipsRef.current,      { opacity: 0, y: 16 });
      gsap.set(fieldsRef.current,     { opacity: 0, y: 20 });
      gsap.set(submitRef.current,     { opacity: 0, y: 16, scale: 0.96 });
      gsap.set(infoRowRef.current,    { opacity: 0, y: 30 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // SCENE 1 — Live badge fades in + unblurs (0.0s)
      tl.to(tagRef.current, {
        opacity: 1, y: 0, filter: "blur(0px)",
        duration: 0.7,
      })

      // SCENE 2 — Hero headline rises line by line, like a curtain lift (0.4s)
      .to(line1Ref.current, {
        opacity: 1, y: 0, skewY: 0,
        duration: 0.9, ease: "power4.out",
      }, "-=0.2")
      .to(line2Ref.current, {
        opacity: 1, y: 0, skewY: 0,
        duration: 0.9, ease: "power4.out",
      }, "-=0.65")

      // SCENE 3 — Subheadline drifts in (1.0s)
      .to(subRef.current, {
        opacity: 1, y: 0,
        duration: 0.8,
      }, "-=0.5")

      // SCENE 4 — Video panel wipes in from left like a cinema curtain (1.2s)
      .to(videoPanelRef.current, {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        duration: 1.1, ease: "power2.inOut",
      }, "-=0.4")

      // SCENE 5 — Form panel slides in from right (1.6s)
      .to(formPanelRef.current, {
        opacity: 1, x: 0,
        duration: 0.9, ease: "back.out(1.2)",
      }, "-=0.7")

      // SCENE 6 — Form title + chips appear inside the card (2.0s)
      .to(formTitleRef.current, {
        opacity: 1, y: 0, duration: 0.55,
      }, "-=0.4")
      .to(chipsRef.current, {
        opacity: 1, y: 0, duration: 0.45,
      }, "-=0.3")

      // SCENE 7 — Fields cascade in with stagger, creating a "filling the form" feel (2.3s)
      .to(fieldsRef.current, {
        opacity: 1, y: 0,
        duration: 0.5,
        stagger: 0.09,
        ease: "power2.out",
      }, "-=0.2")

      // SCENE 8 — Submit button springs in last (2.8s)
      .to(submitRef.current, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6, ease: "back.out(1.6)",
      }, "-=0.15")

      // SCENE 9 — Info cards row rises below (3.0s)
      .to(infoRowRef.current, {
        opacity: 1, y: 0, duration: 0.7,
      }, "-=0.4");

    }, pageRef);

    return () => ctx.revert();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form    = new FormData(e.currentTarget);
    const payload = {
      requestType,
      name:      String(form.get("name")      || ""),
      email:     String(form.get("email")     || ""),
      phone:     String(form.get("phone")     || ""),
      company:   String(form.get("company")   || ""),
      fleetSize: String(form.get("fleetSize") || ""),
      message:   String(form.get("message")   || ""),
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
    <div className={styles.page} ref={pageRef}>
      <div className={styles.container}>

        {/* ── TOP: Heading ── */}
        <div className={styles.topHeading}>
          <div className={styles.liveTag} ref={tagRef}>
            <span className={styles.pulseDot} />
            Solutions Engineers Online
          </div>
          <h1 className={styles.heroHeading}>
            <span ref={line1Ref} style={{ display: "block", overflow: "hidden", paddingBottom: "0.05em" }}>
              Let&apos;s build your
            </span>
            <span ref={line2Ref} style={{ display: "block", overflow: "hidden", paddingBottom: "0.05em" }}>
              <span className={styles.heroHeadingAccent}>fleet of tomorrow.</span>
            </span>
          </h1>
          <p className={styles.heroSub} ref={subRef}>
            Speak directly with a senior telematics solutions architect. Request a live demo,
            custom hardware pricing, or CANbus SDK specs. Average response: under&nbsp;15&nbsp;min.
          </p>
        </div>

        {/* ── MAIN CARD: video left | form right (equal height via flex stretch) ── */}
        <div className={styles.mainCard}>

          {/* Video panel — cinematic clip-path wipe reveal */}
          <div className={styles.videoPanel} ref={videoPanelRef}>
            <video
              autoPlay loop muted playsInline
              className={styles.video}
            >
              <source src="/video/seamless.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Form panel */}
          <div className={styles.formPanel} ref={formPanelRef}>
            {status === "ok" ? (
              <div className={styles.successState}>
                <CheckCircle2 className={styles.successIcon} />
                <h3>Request Received!</h3>
                <p>A solutions engineer will reach out within 15&nbsp;minutes.</p>
                <button
                  className={styles.submitBtn}
                  onClick={() => setStatus("idle")}
                  style={{ marginTop: "1.5rem" }}
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <>
                <div ref={formTitleRef}>
                  <div className={styles.formTitle}>Consultation Request</div>
                  <div className={styles.formSubtitle}>
                    Fill out the form and our team will reach out shortly.
                  </div>
                </div>

                <div className={styles.chipRow} ref={chipsRef}>
                  {REQUEST_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRequestType(type)}
                      className={`${styles.chip} ${requestType === type ? styles.chipActive : ""}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  {error && <div className={styles.errorMsg}>{error}</div>}

                  <div className={styles.grid2} ref={addField}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Full Name</label>
                      <input type="text" name="name" required placeholder="Jane Doe" className={styles.input} />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Work Email</label>
                      <input type="email" name="email" required placeholder="jane@company.com" className={styles.input} />
                    </div>
                  </div>

                  <div className={styles.grid2} ref={addField}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Company</label>
                      <input type="text" name="company" placeholder="Acme Logistics" className={styles.input} />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Fleet Size</label>
                      <div className={styles.selectWrap}>
                        <select name="fleetSize" className={styles.select}>
                          <option value="1-50">1–50 Vehicles</option>
                          <option value="51-200">51–200 Vehicles</option>
                          <option value="201-1000">201–1,000 Vehicles</option>
                          <option value="1000+">1,000+ Vehicles</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={styles.fieldGroup} ref={addField}>
                    <label className={styles.label}>Phone (optional)</label>
                    <input type="tel" name="phone" placeholder="+1 (555) 000-0000" className={styles.input} />
                  </div>

                  <div className={styles.fieldGroup} style={{ flex: 1 }} ref={addField}>
                    <label className={styles.label}>Message</label>
                    <textarea name="message" placeholder="Tell us about your operational challenges…" className={styles.textarea} />
                  </div>

                  <button type="submit" disabled={status === "loading"} className={styles.submitBtn} ref={submitRef}>
                    {status === "loading" ? "Sending…" : "Submit Request"}
                    <Send size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* ── INFO ROW: three cards below the main card ── */}
        <div className={styles.infoRow} ref={infoRowRef}>
          {[
            { icon: <Phone size={17} />, label: "Enterprise Hotline",    value: "+1 (800) 555-JAXI" },
            { icon: <Mail  size={17} />, label: "Solutions Engineering",  value: "solutions@jaxicloud.com" },
            { icon: <MapPin size={17}/>, label: "Global Telematics Hubs", value: "San Jose, CA · Shenzhen" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={styles.infoCard}
              whileHover={{ y: -4, boxShadow: "0 10px 28px rgba(14,165,233,0.14)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className={styles.infoIconBox}>{item.icon}</div>
              <div>
                <div className={styles.infoCardLabel}>{item.label}</div>
                <div className={styles.infoCardValue}>{item.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
