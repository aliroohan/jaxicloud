import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Bus, HardHat, Layers, ShieldCheck, Snowflake, Truck, Users } from "lucide-react";
import { getSolutions } from "@/lib/queries";
import styles from "@/components/public/MinimalistSolution.module.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Industry Fleet Telematics Solutions | JaxiCloud",
  description: "Explore commercial telematics architectures for freight, transit, cold-chain, and mining.",
};

const ICON_MAP: Record<string, React.ElementType> = {
  truck: Truck,
  bus: Bus,
  snowflake: Snowflake,
  hardhat: HardHat,
  users: Users,
  shield: ShieldCheck,
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

        {/* Solutions Grid Cards */}
        <div className={styles.solutionGrid}>
          {solutions.map((s) => (
            <Link key={s.id} href={`/solutions/${s.slug}`} className={styles.solutionCard}>
              <div className={styles.iconPod}>
                <Truck className="w-6 h-6" />
              </div>

              <h2 className={styles.solutionTitle}>{s.name}</h2>
              <p className={styles.solutionDesc}>{s.description}</p>

              <div className={styles.cardFooter}>
                <div className={styles.viewDetailsLink}>
                  <span>Explore Vertical Solution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
