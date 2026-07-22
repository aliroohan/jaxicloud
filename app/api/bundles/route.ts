import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Bundle } from "@/lib/models";
import { serializeDoc } from "@/lib/api";

export const revalidate = 3600;

export async function GET() {
  await connectDB();
  const bundles = await Bundle.find({ status: "published" })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({
    bundles: bundles.map((b) => serializeDoc(b as Record<string, unknown>)),
  });
}
