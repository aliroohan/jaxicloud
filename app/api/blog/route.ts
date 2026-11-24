import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/lib/models";
import { serializeDoc } from "@/lib/api";
import { buildPublicBlogSearchFilter } from "@/lib/blogAdmin";
import {
  parseLocaleParam,
  resolveBlogPostForLocale,
} from "@/lib/blogTranslations";

export const revalidate = 0;

const PAGE_SIZE = 9;

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const q = searchParams.get("q")?.trim() || "";
  const tag = searchParams.get("tag")?.trim() || "";
  const locale = parseLocaleParam(searchParams.get("locale"));

  const now = new Date();

  // Lazy scheduled-publish: promote any due "scheduled" posts before querying.
  await BlogPost.updateMany(
    { status: "scheduled", publishedAt: { $lte: now } },
    { $set: { status: "published" } },
  );

  const filter: Record<string, unknown> = { status: "published" };
  if (tag) filter.tags = tag;
  if (q) Object.assign(filter, buildPublicBlogSearchFilter(q));

  const [posts, total] = await Promise.all([
    BlogPost.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    BlogPost.countDocuments(filter),
  ]);

  const data = posts.map((p) =>
    resolveBlogPostForLocale(serializeDoc(p as Record<string, unknown>), locale),
  );

  return NextResponse.json({
    posts: data,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    locale,
  });
}
