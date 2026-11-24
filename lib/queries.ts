import { connectDB } from "@/lib/db";
import { BlogPost, Category, Product } from "@/lib/models";
import { serializeDoc, stripSupplierSource, toId } from "@/lib/api";
import type {
  BlogPost as BlogPostT,
  Category as CategoryT,
  Product as ProductT,
} from "@/lib/types";
import { buildPublicBlogSearchFilter } from "@/lib/blogAdmin";
import {
  parseLocaleParam,
  resolveBlogPostForLocale,
} from "@/lib/blogTranslations";
import type { Locale } from "@/lib/i18n/config";

const BLOG_PAGE_SIZE = 9;

export async function getPublishedBlogPosts(filters?: {
  page?: number;
  q?: string;
  tag?: string;
  locale?: string | Locale;
}): Promise<{ posts: BlogPostT[]; total: number; totalPages: number; page: number }> {
  const page = Math.max(1, filters?.page || 1);
  const locale = parseLocaleParam(
    typeof filters?.locale === "string" ? filters.locale : filters?.locale,
  );
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
    if (filters?.q) Object.assign(filter, buildPublicBlogSearchFilter(filters.q));

    const [docs, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1 })
        .skip((page - 1) * BLOG_PAGE_SIZE)
        .limit(BLOG_PAGE_SIZE)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    return {
      posts: docs.map((d) =>
        resolveBlogPostForLocale(serializeDoc(d as Record<string, unknown>), locale),
      ),
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
  locale?: string | Locale,
): Promise<{ post: BlogPostT; relatedPosts: BlogPostT[] } | null> {
  const resolvedLocale = parseLocaleParam(
    typeof locale === "string" ? locale : locale,
  );
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
      post: resolveBlogPostForLocale(
        serializeDoc(doc as Record<string, unknown>),
        resolvedLocale,
      ),
      relatedPosts: relatedDocs.map((d) =>
        resolveBlogPostForLocale(
          serializeDoc(d as Record<string, unknown>),
          resolvedLocale,
        ),
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

    const serialized = stripSupplierSource(
      serializeDoc(product as Record<string, unknown>),
    ) as ProductT;
    serialized.category = {
      id: toId(category._id),
      name: category.name,
      slug: category.slug,
    };
    serialized.categoryId = toId(category._id);
    return serialized;
  } catch (err) {
    console.warn("getProductByCategorySlug error:", err);
    return null;
  }
}
