import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { BlogPost } from "@/lib/models";
import { blogPostInputSchema } from "@/lib/validators";
import { serializeDoc } from "@/lib/api";
import {
  buildAdminBlogSearchFilter,
  buildTranslationsFromInput,
  denormalizePrimaryTranslation,
  publishedAtFromInput,
  resolveSlugFromInput,
} from "@/lib/blogAdmin";
import {
  displayTitleFromBlogDoc,
  normalizeBlogTranslations,
  resolveBlogPostForLocale,
} from "@/lib/blogTranslations";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  await connectDB();
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") || searchParams.get("search");
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.max(
    1,
    Math.min(100, parseInt(searchParams.get("limit") || "20", 10) || 20),
  );

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (q) {
    filter.$or = buildAdminBlogSearchFilter(q);
  }

  const total = await BlogPost.countDocuments(filter);
  const posts = await BlogPost.find(filter)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({
    posts: posts.map((p) => {
      const serialized = serializeDoc(p as Record<string, unknown>);
      const resolved = resolveBlogPostForLocale(serialized, DEFAULT_LOCALE);
      return {
        ...resolved,
        title: displayTitleFromBlogDoc(serialized),
        translations: normalizeBlogTranslations(serialized),
      };
    }),
    total,
    page,
    limit,
  });
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = blogPostInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDB();
    const data = parsed.data;
    const translations = buildTranslationsFromInput(data);
    const slug = resolveSlugFromInput(data, translations);
    const denorm = denormalizePrimaryTranslation(translations);

    const existing = await BlogPost.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const publishedAt = publishedAtFromInput(data);

    const post = await BlogPost.create({
      slug,
      coverImage: data.coverImage,
      tags: data.tags,
      author: data.author,
      status: data.status,
      publishedAt,
      translations,
      ...denorm,
      viewCount: 0,
    });

    const serialized = serializeDoc(post.toObject() as Record<string, unknown>);
    return NextResponse.json(
      {
        post: {
          ...resolveBlogPostForLocale(serialized, DEFAULT_LOCALE),
          translations: normalizeBlogTranslations(serialized),
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("admin blog post create", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
