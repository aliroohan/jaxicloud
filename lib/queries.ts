import { connectDB } from "@/lib/db";
import { Bundle, Category, Product, Solution } from "@/lib/models";
import { serializeDoc, stripSupplierSource, toId } from "@/lib/api";
import type { Bundle as BundleT, Category as CategoryT, Product as ProductT, Solution as SolutionT } from "@/lib/types";

export async function getCategories(): Promise<CategoryT[]> {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return categories.map((c) => serializeDoc(c as Record<string, unknown>) as CategoryT);
}

export async function getPublishedProducts(filters?: {
  categorySlug?: string;
  tag?: string;
  q?: string;
}): Promise<ProductT[]> {
  await connectDB();
  const filter: Record<string, unknown> = { status: "published" };

  if (filters?.categorySlug) {
    const category = await Category.findOne({ slug: filters.categorySlug }).lean();
    if (!category) return [];
    filter.categoryId = category._id;
  }
  if (filters?.tag) filter.tags = filters.tag;
  if (filters?.q) {
    filter.$or = [
      { name: { $regex: filters.q, $options: "i" } },
      { tagline: { $regex: filters.q, $options: "i" } },
      { tags: { $regex: filters.q, $options: "i" } },
    ];
  }

  const products = await Product.find(filter)
    .populate("categoryId", "name slug")
    .sort({ createdAt: -1 })
    .lean();

  return products.map((p) => {
    const serialized = stripSupplierSource(
      serializeDoc(p as Record<string, unknown>),
    ) as ProductT;
    const category = p.categoryId as unknown as {
      _id?: unknown;
      name?: string;
      slug?: string;
    } | null;
    if (category && typeof category === "object" && "slug" in category) {
      serialized.category = {
        id: toId(category._id as never),
        name: category.name || "",
        slug: category.slug || "",
      };
      serialized.categoryId = toId(category._id as never);
    }
    return serialized;
  });
}

export async function getProductByCategorySlug(
  categorySlug: string,
  slug: string,
): Promise<ProductT | null> {
  await connectDB();
  const category = await Category.findOne({ slug: categorySlug }).lean();
  if (!category) return null;

  const product = await Product.findOne({
    slug,
    categoryId: category._id,
    status: "published",
  }).lean();
  if (!product) return null;

  const [solutions, bundles] = await Promise.all([
    Solution.find({ _id: { $in: product.solutionIds || [] } }).lean(),
    Bundle.find({ status: "published", productIds: product._id }).lean(),
  ]);

  const serialized = stripSupplierSource(
    serializeDoc(product as Record<string, unknown>),
  ) as ProductT;
  serialized.category = {
    id: toId(category._id),
    name: category.name,
    slug: category.slug,
  };
  serialized.categoryId = toId(category._id);
  serialized.solutions = solutions.map(
    (s) => serializeDoc(s as Record<string, unknown>) as SolutionT,
  );
  serialized.bundles = bundles.map(
    (b) => serializeDoc(b as Record<string, unknown>) as BundleT,
  );
  return serialized;
}

export async function getPublishedBundles(): Promise<BundleT[]> {
  await connectDB();
  const bundles = await Bundle.find({ status: "published" })
    .sort({ createdAt: -1 })
    .lean();
  return bundles.map((b) => serializeDoc(b as Record<string, unknown>) as BundleT);
}

export async function getBundleBySlug(slug: string): Promise<BundleT | null> {
  await connectDB();
  const bundle = await Bundle.findOne({ slug, status: "published" }).lean();
  if (!bundle) return null;

  const products = await Product.find({
    _id: { $in: bundle.productIds || [] },
    status: "published",
  })
    .populate("categoryId", "name slug")
    .lean();

  const serialized = serializeDoc(bundle as Record<string, unknown>) as BundleT;
  serialized.products = products.map((p) => {
    const item = stripSupplierSource(
      serializeDoc(p as Record<string, unknown>),
    ) as ProductT;
    const category = p.categoryId as unknown as {
      _id?: unknown;
      name?: string;
      slug?: string;
    } | null;
    if (category && typeof category === "object" && "slug" in category) {
      item.category = {
        id: toId(category._id as never),
        name: category.name || "",
        slug: category.slug || "",
      };
    }
    return item;
  });
  return serialized;
}

export async function getSolutions(): Promise<SolutionT[]> {
  await connectDB();
  const solutions = await Solution.find().sort({ name: 1 }).lean();
  return solutions.map(
    (s) => serializeDoc(s as Record<string, unknown>) as SolutionT,
  );
}

export async function getSolutionBySlug(slug: string): Promise<SolutionT | null> {
  await connectDB();
  const solution = await Solution.findOne({ slug }).lean();
  if (!solution) return null;

  const products = await Product.find({
    _id: { $in: solution.productIds || [] },
    status: "published",
  })
    .populate("categoryId", "name slug")
    .lean();

  const serialized = serializeDoc(solution as Record<string, unknown>) as SolutionT;
  serialized.products = products.map((p) => {
    const item = stripSupplierSource(
      serializeDoc(p as Record<string, unknown>),
    ) as ProductT;
    const category = p.categoryId as unknown as {
      _id?: unknown;
      name?: string;
      slug?: string;
    } | null;
    if (category && typeof category === "object" && "slug" in category) {
      item.category = {
        id: toId(category._id as never),
        name: category.name || "",
        slug: category.slug || "",
      };
    }
    return item;
  });
  return serialized;
}
