import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Inquiry } from "@/lib/models";
import { serializeDoc } from "@/lib/api";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  await connectDB();
  const status = request.nextUrl.searchParams.get("status");
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;

  const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({
    inquiries: inquiries.map((i) =>
      serializeDoc(i as Record<string, unknown>),
    ),
  });
}
