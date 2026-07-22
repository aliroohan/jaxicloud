import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminCmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <AdminSidebar />
      <div className="flex-1 p-4 sm:p-8">{children}</div>
    </div>
  );
}
