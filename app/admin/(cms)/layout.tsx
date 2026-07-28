import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import styles from "@/components/admin/AdminConsole.module.css";

export default function AdminCmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.pageWrapper}>
      <AdminSidebar />
      <div className={styles.mainStage}>
        <AdminHeader />
        <div className={styles.contentBody}>{children}</div>
      </div>
    </div>
  );
}
