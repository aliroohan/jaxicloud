"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
  delay?: number;
  /** Entrance bias. Default `up` preserves existing fade-up behavior. */
  from?: "up" | "left" | "right";
};

function hiddenOffset(from: RevealProps["from"]) {
  if (from === "left") return { opacity: 0, x: -36, y: 0 };
  if (from === "right") return { opacity: 0, x: 36, y: 0 };
  return { opacity: 0, x: 0, y: 20 };
}

export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  from = "up",
}: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={{
        hidden: hiddenOffset(from),
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay,
          },
        },
      }}
    >
      {children}
    </Comp>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={staggerParent}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp} style={{ transitionTimingFunction: `cubic-bezier(${ease.join(",")})` }}>
      {children}
    </motion.div>
  );
}
