import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { BlogPost } from "@/lib/models";
import { blogPostInputSchema } from "@/lib/validators";
import { serializeDoc } from "@/lib/api";
import { slugify } from "@/lib/slugify";
import { computeReadingTimeMinutes } from "@/lib/readingTime";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  await connectDB();
  const post = await BlogPost.findById(id).lean();
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    post: serializeDoc(post as Record<string, unknown>),
  });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { id } = await params;
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

    const conflict = await BlogPost.findOne({ slug, _id: { $ne: id } });
    if (conflict) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const readingTimeMinutes = computeReadingTimeMinutes(data.contentHtml);
    const publishedAt =
      data.status === "published" && !data.publishedAt
        ? new Date()
        : data.publishedAt
          ? new Date(data.publishedAt)
          : null;

    const post = await BlogPost.findByIdAndUpdate(
      id,
      { ...data, slug, readingTimeMinutes, publishedAt },
      { new: true },
    ).lean();

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      post: serializeDoc(post as Record<string, unknown>),
    });
  } catch (err) {
    console.error("admin blog post update", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  await connectDB();
  const post = await BlogPost.findByIdAndDelete(id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
