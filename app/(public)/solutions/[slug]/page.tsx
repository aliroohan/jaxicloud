import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSolutionBySlug } from "@/lib/queries";
import { ProductCard } from "@/components/public/ProductCard";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = await getSolutionBySlug(slug);
  if (!solution) return { title: "Solution not found" };
  return {
    title: solution.metaTitle || solution.name,
    description:
      solution.metaDescription || solution.description?.slice(0, 160),
  };
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const solution = await getSolutionBySlug(slug);
  if (!solution) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/solutions" className="hover:text-accent">
          Solutions
        </Link>
        <span className="mx-2">/</span>
        <span className="text-navy">{solution.name}</span>
      </nav>
      <h1 className="font-display text-4xl text-navy">{solution.name}</h1>
      <p className="mt-4 max-w-3xl text-muted">{solution.description}</p>
      <section className="mt-12">
        <h2 className="font-display text-2xl text-navy">Recommended products</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solution.products?.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
