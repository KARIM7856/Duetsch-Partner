import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import OpenAI, { toFile } from "openai";
import { analyzeGerman } from "@/lib/analyzer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

let cachedClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { detail: "Expected multipart/form-data body" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json(
      { detail: "Missing 'file' field" },
      { status: 422 },
    );
  }

  const filename =
    file instanceof File && file.name ? file.name : "audio.webm";

  try {
    const upload = await toFile(file, filename);
    const transcription = await getOpenAI().audio.transcriptions.create({
      file: upload,
      model: "whisper-1",
      language: "de",
    });

    const text = transcription.text ?? "";
    const analysis = await analyzeGerman(text);

    return NextResponse.json({ transcription: text, analysis });
  } catch (err) {
    console.error("[/api/transcribe] failed", err);
    const message = err instanceof Error ? err.message : "Transcription failed";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
