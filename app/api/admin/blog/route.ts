import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { BlogPost } from "@/lib/models";
import { blogPostInputSchema } from "@/lib/validators";
import { serializeDoc } from "@/lib/api";
import { slugify } from "@/lib/slugify";
import { computeReadingTimeMinutes } from "@/lib/readingTime";

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
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { slug: { $regex: q, $options: "i" } },
      { excerpt: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } },
    ];
  }

  const total = await BlogPost.countDocuments(filter);
  const posts = await BlogPost.find(filter)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({
    posts: posts.map((p) => serializeDoc(p as Record<string, unknown>)),
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
    const slug = data.slug?.trim() || slugify(data.title);

    const existing = await BlogPost.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const readingTimeMinutes = computeReadingTimeMinutes(data.contentHtml);
    const publishedAt =
      data.status === "published" && !data.publishedAt
        ? new Date()
        : data.publishedAt
          ? new Date(data.publishedAt)
          : null;

    const post = await BlogPost.create({
      ...data,
      slug,
      readingTimeMinutes,
      publishedAt,
    });
    return NextResponse.json(
      { post: serializeDoc(post.toObject() as Record<string, unknown>) },
      { status: 201 },
    );
  } catch (err) {
    console.error("admin blog post create", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
