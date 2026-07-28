import Link from "next/link";
import type { Metadata } from "next";
import { Layers } from "lucide-react";
import { getSolutions } from "@/lib/queries";
import { AnimatedSolutionGrid } from "@/components/public/AnimatedSolutionGrid";
import styles from "@/components/public/MinimalistSolution.module.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Industry Fleet Telematics Solutions | JaxiCloud",
  description: "Explore commercial telematics architectures for freight, transit, cold-chain, and mining.",
};



export default async function SolutionsPage() {
  const solutions = await getSolutions();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Minimalist Editorial Header */}
        <div className={styles.headerBlock}>
          <div className={styles.sectionTag}>
            <Layers className="w-3.5 h-3.5 text-cyan-600" />
            <span>COMMERCIAL TELEMATICS VERTICALS</span>
          </div>
          <h1 className={styles.pageTitle}>Tailored Industry Solutions</h1>
          <p className={styles.subheadline}>
            Pre-mapped CANbus architectures, ELD regulatory compliance, and vision AI tuned for
            commercial logistics, public transit, cold-chain transport, and mining operations.
          </p>
        </div>

        {/* Solutions Grid Cards with GSAP Scroll Animations */}
        <AnimatedSolutionGrid solutions={solutions} className={styles.solutionGrid} />
      </div>
    </div>
  );
}
