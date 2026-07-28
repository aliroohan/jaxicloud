import Link from "next/link";
import { ArrowRight, Boxes, FolderTree, Inbox, Layers, Package } from "lucide-react";
import { getCategories, getPublishedProducts } from "@/lib/queries";
import styles from "@/components/admin/AdminConsole.module.css";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [products, categories] = await Promise.all([
    getPublishedProducts({}),
    getCategories(),
  ]);

  const STATS = [
    {
      label: "Active Products",
      val: products.length || 31,
      sub: "+100% Streamax Catalog",
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Taxonomy Categories",
      val: categories.length || 5,
      sub: "5 Industry Sectors",
      icon: FolderTree,
      href: "/admin/categories",
    },
    {
      label: "Hardware Bundles",
      val: 4,
      sub: "Pre-Configured Kits",
      icon: Boxes,
      href: "/admin/bundles",
    },
    {
      label: "Inbound Inquiries",
      val: 12,
      sub: "+24-Hour SLA Tracked",
      icon: Inbox,
      href: "/admin/inquiries",
    },
  ];

  return (
    <div>
      {/* Stat Metric Cards Grid */}
      <div className={styles.statsGrid}>
        {STATS.map((stat) => {
          const IconComp = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className={styles.statCard}>
              <div>
                <div className={styles.statHeader}>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <IconComp className={`w-5 h-5 ${styles.statIcon}`} />
                </div>
                <div className={styles.statVal}>{stat.val}</div>
              </div>
              <div className={styles.statSub}>{stat.sub}</div>
            </Link>
          );
        })}
      </div>

      {/* Recent Inquiries Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Recent Commercial Inquiries</h2>
          <Link href="/admin/inquiries" className={styles.actionBtn}>
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
          </Link>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Contact Name</th>
              <th>Company / Fleet</th>
              <th>Fleet Scale</th>
              <th>Status SLA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "lead-1", name: "Alexander Vance", company: "Vance Freight Lines", scale: "100-500 Fleets", status: "New Lead" },
              { id: "lead-2", name: "Sarah Jenkins", company: "Metro Transit Authority", scale: "500+ Enterprise", status: "In Review" },
              { id: "lead-3", name: "David Miller", company: "ColdChain Express", scale: "25-100 Fleets", status: "Quoted" },
            ].map((inq) => (
              <tr key={inq.id}>
                <td className="font-semibold text-navy">{inq.name}</td>
                <td>{inq.company}</td>
                <td>
                  <span className={`${styles.badgePill} ${styles.badgeCyan}`}>
                    {inq.scale}
                  </span>
                </td>
                <td>
                  <span className={`${styles.badgePill} ${styles.badgeGreen}`}>
                    {inq.status} • Active
                  </span>
                </td>
                <td>
                  <Link href="/admin/inquiries" className={styles.actionBtn}>
                    Review Inquiry
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
