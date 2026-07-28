"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import styles from "./ApplicationAuthForm.module.css";
import { BrandLogo } from "@/components/common/BrandLogo/BrandLogo";

export function ApplicationAuthForm() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Connect to your auth backend later
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.brandHeader}>
          <div className="flex justify-center mb-6">
            <BrandLogo />
          </div>
          <h1 className={styles.brandTitle}>JaxiCloud Platform</h1>
          <p className={styles.brandDesc}>
            Sign in to access your enterprise fleet management dashboard.
          </p>
        </div>

        <div className={styles.formCard}>
          <div className={styles.tabsRow}>
            <button
              onClick={() => setActiveTab("login")}
              className={`${styles.tabBtn} ${activeTab === "login" ? styles.tabBtnActive : ""}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`${styles.tabBtn} ${activeTab === "register" ? styles.tabBtnActive : ""}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="popLayout" initial={false}>
              {activeTab === "register" && (
                <motion.div
                  key="username-field"
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        required
                        type="text"
                        placeholder="Choose a username"
                        className={`${styles.inputField} pl-12`}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Corporate Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  required
                  type="email"
                  placeholder="name@company.com"
                  className={`${styles.inputField} pl-12`}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className={`${styles.inputField} pl-12`}
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span>{activeTab === "login" ? "Access Dashboard" : "Register Account"}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>

          <div className={styles.formFooter}>
            {activeTab === "login" ? (
              <p>
                Forgot your password? <a href="#" className={styles.formFooterLink}>Reset it here</a>
              </p>
            ) : (
              <p>
                By registering, you agree to our <a href="#" className={styles.formFooterLink}>Terms of Service</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
