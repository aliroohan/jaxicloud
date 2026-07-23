"use client";

import { useEffect, useState } from "react";

const SPLASH_STORAGE_KEY = "jaxicloud_splash_seen_v1";

export function useSplashScreen() {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      // Allow URL parameter ?splash=true to force preview the splash screen anytime
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("splash") === "true") {
        sessionStorage.removeItem(SPLASH_STORAGE_KEY);
        setIsVisible(true);
        return;
      }

      const hasSeen = sessionStorage.getItem(SPLASH_STORAGE_KEY);
      if (hasSeen === "true") {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const finishSplash = () => {
    try {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
    } catch {
      // Ignore storage quota or disabled storage errors
    }
    setIsVisible(false);
  };

  const resetSplash = () => {
    try {
      sessionStorage.removeItem(SPLASH_STORAGE_KEY);
    } catch {}
    setIsVisible(true);
  };

  return {
    isVisible,
    finishSplash,
    resetSplash,
  };
}

