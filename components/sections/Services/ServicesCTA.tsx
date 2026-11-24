"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import type { ServicesCopy } from "@/lib/i18n/pageCopy";
import styles from "./ServicesCTA.module.css";

export function ServicesCTA({ copy }: { copy: ServicesCopy }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const formVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <section id="contact-terminal" className={styles.ctaSection} ref={containerRef}>
      <div className={styles.container}>
        
        {/* Massive Typography */}
        <div className={styles.textColumn}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className={styles.title}>
              {copy.ctaTitleBefore}{" "}
              <span className={styles.highlight}>{copy.ctaTitleHighlight}</span>
            </h2>
            <p className={styles.subtitle}>
              {copy.ctaSub}
            </p>
          </motion.div>
        </div>

        {/* Floating Terminal */}
        <div className={styles.terminalColumn}>
          <motion.div 
            className={styles.terminalWrapper}
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={isInView ? { opacity: 1, scale: 1, rotateX: 0 } : { opacity: 0, scale: 0.9, rotateX: 10 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* The Floating Animation is continuous */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className={styles.terminal}
            >
              
              {/* macOS Style Header */}
              <div className={styles.terminalHeader}>
                <div className={styles.windowControls}>
                  <div className={styles.dot} style={{ backgroundColor: '#FF5F56' }} />
                  <div className={styles.dot} style={{ backgroundColor: '#FFBD2E' }} />
                  <div className={styles.dot} style={{ backgroundColor: '#27C93F' }} />
                </div>
                <div className={styles.terminalTitle}>
                  <Terminal size={14} />
                  <span>{copy.ctaTerminalTitle}</span>
                </div>
              </div>

              {/* Form Content */}
              <motion.form 
                className={styles.formContent}
                variants={formVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <motion.div className={styles.inputGroup} variants={itemVariants}>
                  <label>{copy.ctaLabelName}</label>
                  <input type="text" placeholder={copy.ctaPlaceholderName} className={styles.input} />
                </motion.div>

                <motion.div className={styles.inputGroup} variants={itemVariants}>
                  <label>{copy.ctaLabelEmail}</label>
                  <input type="email" placeholder={copy.ctaPlaceholderEmail} className={styles.input} />
                </motion.div>

                <motion.div className={styles.inputGroup} variants={itemVariants}>
                  <label>{copy.ctaLabelCompanySize}</label>
                  <select className={styles.select}>
                    <option>{copy.ctaFleetOpt1}</option>
                    <option>{copy.ctaFleetOpt2}</option>
                    <option>{copy.ctaFleetOpt3}</option>
                  </select>
                </motion.div>

                <motion.button 
                  type="button" 
                  className={styles.submitButton}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{copy.ctaSubmit}</span>
                  <ArrowRight size={18} />
                </motion.button>
              </motion.form>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
