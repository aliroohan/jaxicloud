import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { Category, Product } from "@/lib/models";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/solutions",
    "/contact",
    "/inquiry",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  try {
    await connectDB();
    const [products, categories] = await Promise.all([
      Product.find({ status: "published" }).populate("categoryId", "slug").lean(),
      Category.find().lean(),
    ]);

    const productRoutes: MetadataRoute.Sitemap = products
      .map((p) => {
        const cat = p.categoryId as unknown as { slug?: string } | null;
        if (!cat?.slug) return null;
        return {
          url: `${base}/products/${cat.slug}/${p.slug}`,
          lastModified: p.updatedAt || new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };
      })
      .filter(Boolean) as MetadataRoute.Sitemap;

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${base}/products?category=${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
  } catch {
    return staticRoutes;
  }
}
