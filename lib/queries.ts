import { connectDB } from "@/lib/db";
import { Bundle, BlogPost, Category, Product, Solution } from "@/lib/models";
import { serializeDoc, stripSupplierSource, toId } from "@/lib/api";
import type {
  BlogPost as BlogPostT,
  Bundle as BundleT,
  Category as CategoryT,
  Product as ProductT,
  Solution as SolutionT,
} from "@/lib/types";

const BLOG_PAGE_SIZE = 9;

export async function getPublishedBlogPosts(filters?: {
  page?: number;
  q?: string;
  tag?: string;
}): Promise<{ posts: BlogPostT[]; total: number; totalPages: number; page: number }> {
  const page = Math.max(1, filters?.page || 1);
  try {
    const db = await connectDB();
    if (!db) return { posts: [], total: 0, totalPages: 1, page };

    const now = new Date();
    await BlogPost.updateMany(
      { status: "scheduled", publishedAt: { $lte: now } },
      { $set: { status: "published" } },
    );

    const filter: Record<string, unknown> = { status: "published" };
    if (filters?.tag) filter.tags = filters.tag;
    if (filters?.q) filter.$text = { $search: filters.q };

    const [docs, total] = await Promise.all([
      BlogPost.find(filter, filters?.q ? { score: { $meta: "textScore" } } : undefined)
        .sort(filters?.q ? { score: { $meta: "textScore" } } : { publishedAt: -1 })
        .skip((page - 1) * BLOG_PAGE_SIZE)
        .limit(BLOG_PAGE_SIZE)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    return {
      posts: docs.map((d) => serializeDoc(d as Record<string, unknown>) as BlogPostT),
      total,
      totalPages: Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE)),
      page,
    };
  } catch (err) {
    console.warn("getPublishedBlogPosts skipped:", err);
    return { posts: [], total: 0, totalPages: 1, page };
  }
}

export async function getBlogTags(): Promise<string[]> {
  try {
    const db = await connectDB();
    if (!db) return [];
    const tags = await BlogPost.distinct("tags", { status: "published" });
    return (tags as string[]).filter(Boolean).sort();
  } catch (err) {
    console.warn("getBlogTags skipped:", err);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<{ post: BlogPostT; relatedPosts: BlogPostT[] } | null> {
  try {
    const db = await connectDB();
    if (!db) return null;

    const now = new Date();
    const doc = await BlogPost.findOne({ slug }).lean();
    if (!doc) return null;

    const isPublished = doc.status === "published";
    const isDueScheduled =
      doc.status === "scheduled" && doc.publishedAt && doc.publishedAt <= now;
    if (!isPublished && !isDueScheduled) return null;

    if (isDueScheduled) {
      await BlogPost.updateOne({ _id: doc._id }, { $set: { status: "published" } });
      doc.status = "published";
    }
    await BlogPost.updateOne({ _id: doc._id }, { $inc: { viewCount: 1 } });

    const tags = doc.tags || [];
    let relatedDocs = tags.length
      ? await BlogPost.find({
          _id: { $ne: doc._id },
          status: "published",
          tags: { $in: tags },
        })
          .sort({ publishedAt: -1 })
          .limit(3)
          .lean()
      : [];

    if (relatedDocs.length < 3) {
      const excludeIds = [doc._id, ...relatedDocs.map((d) => d._id)];
      const fallback = await BlogPost.find({
        _id: { $nin: excludeIds },
        status: "published",
      })
        .sort({ publishedAt: -1 })
        .limit(3 - relatedDocs.length)
        .lean();
      relatedDocs = [...relatedDocs, ...fallback];
    }

    return {
      post: serializeDoc(doc as Record<string, unknown>) as BlogPostT,
      relatedPosts: relatedDocs.map(
        (d) => serializeDoc(d as Record<string, unknown>) as BlogPostT,
      ),
    };
  } catch (err) {
    console.warn("getBlogPostBySlug error:", err);
    return null;
  }
}

export async function getCategories(): Promise<CategoryT[]> {
  try {
    const db = await connectDB();
    if (!db) return [];
    const categories = await Category.find().sort({ name: 1 }).lean();
    return categories.map((c) => serializeDoc(c as Record<string, unknown>) as CategoryT);
  } catch (err) {
    console.warn("getCategories query skipped:", err);
    return [];
  }
}

export async function getPublishedProducts(filters?: {
  categorySlug?: string;
  tag?: string;
  q?: string;
}): Promise<ProductT[]> {
  try {
    const db = await connectDB();
    if (!db) return [];
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
  } catch (err) {
    console.warn("getPublishedProducts query skipped:", err);
    return [];
  }
}

export async function getProductByCategorySlug(
  categorySlug: string,
  slug: string,
): Promise<ProductT | null> {
  try {
    console.log(`[getProductByCategorySlug] called with categorySlug: "${categorySlug}", slug: "${slug}"`);
    const db = await connectDB();
    if (!db) return null;
    const category = await Category.findOne({ slug: categorySlug }).lean();
    if (!category) {
      console.log(`[getProductByCategorySlug] Category not found for slug: "${categorySlug}"`);
      return null;
    }

    const product = await Product.findOne({
      slug,
      categoryId: category._id,
      status: "published",
    }).lean();
    if (!product) {
      console.log(`[getProductByCategorySlug] Product not found for slug: "${slug}", categoryId: "${category._id}"`);
      return null;
    }

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
  } catch (err) {
    console.warn("getProductByCategorySlug error:", err);
    return null;
  }
}

export async function getPublishedBundles(): Promise<BundleT[]> {
  try {
    const db = await connectDB();
    if (!db) return [];
    const bundles = await Bundle.find({ status: "published" })
      .sort({ createdAt: -1 })
      .lean();
    return bundles.map((b) => serializeDoc(b as Record<string, unknown>) as BundleT);
  } catch (err) {
    console.warn("getPublishedBundles skipped:", err);
    return [];
  }
}

export async function getBundleBySlug(slug: string): Promise<BundleT | null> {
  try {
    const db = await connectDB();
    if (!db) return null;
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
  } catch (err) {
    console.warn("getBundleBySlug error:", err);
    return null;
  }
}

export async function getSolutions(): Promise<SolutionT[]> {
  try {
    const db = await connectDB();
    if (!db) return [];
    const solutions = await Solution.find().sort({ name: 1 }).lean();
    return solutions.map(
      (s) => serializeDoc(s as Record<string, unknown>) as SolutionT,
    );
  } catch (err) {
    console.warn("getSolutions skipped:", err);
    return [];
  }
}

export async function getSolutionBySlug(slug: string): Promise<SolutionT | null> {
  try {
    const db = await connectDB();
    if (!db) return null;
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
  } catch (err) {
    console.warn("getSolutionBySlug error:", err);
    return null;
  }
}
