import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { analyzeGerman } from "@/lib/analyzer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AnalyzeBody {
  text?: string;
}

export async function POST(request: NextRequest) {
  let body: AnalyzeBody;
  try {
    body = (await request.json()) as AnalyzeBody;
  } catch {
    return NextResponse.json(
      { detail: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const text = body.text;
  if (typeof text !== "string" || text.length === 0) {
    return NextResponse.json(
      { detail: "'text' must be a non-empty string" },
      { status: 422 },
    );
  }

  try {
    const result = await analyzeGerman(text);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/analyze] failed", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
