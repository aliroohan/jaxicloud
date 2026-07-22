import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Solution } from "@/lib/models";
import { serializeDoc } from "@/lib/api";

export const revalidate = 3600;

export async function GET() {
  await connectDB();
  const solutions = await Solution.find().sort({ name: 1 }).lean();
  return NextResponse.json({
    solutions: solutions.map((s) =>
      serializeDoc(s as Record<string, unknown>),
    ),
  });
}
