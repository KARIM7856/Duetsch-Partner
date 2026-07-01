import type { PuppeTurnRequest, PuppeTurnResult } from "./puppe-types";

export interface WordAnalysis {
  word: string;
  is_correct: boolean;
  correction: string | null;
  rule_name: string | null;
  rule_url: string | null;
}

export interface AnalyzeResponse {
  original_text: string;
  corrected_text: string;
  words: WordAnalysis[];
  score: number;
}

export interface TranscribeResponse {
  transcription: string;
  analysis: AnalyzeResponse;
}

const API_BASE = "/api";

export async function analyzeText(text: string): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error(`Analysis failed: ${res.statusText}`);
  }
  return res.json();
}

export async function transcribeAudio(
  audioBlob: Blob
): Promise<TranscribeResponse> {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");

  const res = await fetch(`${API_BASE}/transcribe`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error(`Transcription failed: ${res.statusText}`);
  }
  return res.json();
}

export async function playPuppeTurn(
  req: PuppeTurnRequest,
): Promise<PuppeTurnResult> {
  const res = await fetch(`${API_BASE}/puppe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error(`Turn failed: ${res.statusText}`);
  }
  return res.json();
}
