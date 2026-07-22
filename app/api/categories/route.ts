import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models";
import { serializeDoc } from "@/lib/api";

export const revalidate = 3600;

export async function GET() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return NextResponse.json({
    categories: categories.map((c) =>
      serializeDoc(c as Record<string, unknown>),
    ),
  });
}
