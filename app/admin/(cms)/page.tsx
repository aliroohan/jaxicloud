import Link from "next/link";

export default function AdminDashboardPage() {
  const cards = [
    { href: "/admin/products", label: "Products", desc: "Create and publish catalog items" },
    { href: "/admin/categories", label: "Categories", desc: "Organize the product taxonomy" },
    { href: "/admin/bundles", label: "Bundles", desc: "Package multi-product kits" },
    { href: "/admin/solutions", label: "Solutions", desc: "Industry solution mappings" },
    { href: "/admin/inquiries", label: "Inquiries", desc: "Review quote requests" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Manage the Jaxicloud Fleet catalog and inbound inquiries.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-500"
          >
            <h2 className="text-lg font-semibold">{card.label}</h2>
            <p className="mt-2 text-sm text-slate-600">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
