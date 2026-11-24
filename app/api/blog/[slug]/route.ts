import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/lib/models";
import { serializeDoc } from "@/lib/api";
import {
  parseLocaleParam,
  resolveBlogPostForLocale,
} from "@/lib/blogTranslations";

export const revalidate = 0;

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const locale = parseLocaleParam(request.nextUrl.searchParams.get("locale"));
  await connectDB();

  const now = new Date();

  const post = await BlogPost.findOne({ slug }).lean();
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isPublished = post.status === "published";
  const isDueScheduled =
    post.status === "scheduled" && post.publishedAt && post.publishedAt <= now;

  if (!isPublished && !isDueScheduled) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (isDueScheduled) {
    await BlogPost.updateOne({ _id: post._id }, { $set: { status: "published" } });
    post.status = "published";
  }

  await BlogPost.updateOne({ _id: post._id }, { $inc: { viewCount: 1 } });

  const tags = post.tags || [];
  let relatedDocs = tags.length
    ? await BlogPost.find({
        _id: { $ne: post._id },
        status: "published",
        tags: { $in: tags },
      })
        .sort({ publishedAt: -1 })
        .limit(3)
        .lean()
    : [];

  if (relatedDocs.length < 3) {
    const excludeIds = [post._id, ...relatedDocs.map((d) => d._id)];
    const fallback = await BlogPost.find({
      _id: { $nin: excludeIds },
      status: "published",
    })
      .sort({ publishedAt: -1 })
      .limit(3 - relatedDocs.length)
      .lean();
    relatedDocs = [...relatedDocs, ...fallback];
  }

  const resolved = resolveBlogPostForLocale(
    serializeDoc(post as Record<string, unknown>),
    locale,
  );

  return NextResponse.json({
    post: resolved,
    relatedPosts: relatedDocs.map((d) =>
      resolveBlogPostForLocale(serializeDoc(d as Record<string, unknown>), locale),
    ),
    locale,
  });
}
