import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { evaluatePuppeTurn } from "@/lib/puppe";
import type {
  PuppeChatMessage,
  PuppeTurnRequest,
  SecretNoun,
} from "@/lib/puppe-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isSecret(value: unknown): value is SecretNoun {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.word === "string" &&
    v.word.length > 0 &&
    (v.article === "der" || v.article === "die" || v.article === "das") &&
    typeof v.en === "string"
  );
}

function isHistory(value: unknown): value is PuppeChatMessage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (m) =>
        typeof m === "object" &&
        m !== null &&
        ((m as PuppeChatMessage).role === "user" ||
          (m as PuppeChatMessage).role === "model") &&
        typeof (m as PuppeChatMessage).text === "string",
    )
  );
}

export async function POST(request: NextRequest) {
  let body: Partial<PuppeTurnRequest>;
  try {
    body = (await request.json()) as Partial<PuppeTurnRequest>;
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  if (!isSecret(body.secret)) {
    return NextResponse.json(
      { detail: "'secret' must be { word, article, en }" },
      { status: 422 },
    );
  }

  if (typeof body.message !== "string" || body.message.trim().length === 0) {
    return NextResponse.json(
      { detail: "'message' must be a non-empty string" },
      { status: 422 },
    );
  }

  const history = isHistory(body.history) ? body.history : [];

  try {
    const result = await evaluatePuppeTurn(
      body.secret,
      body.message.trim(),
      history,
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/puppe] failed", err);
    const message = err instanceof Error ? err.message : "Turn failed";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
