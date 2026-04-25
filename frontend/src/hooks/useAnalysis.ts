"use client";

import { useState } from "react";
import {
  analyzeText,
  transcribeAudio,
  type AnalyzeResponse,
} from "@/lib/api";

export function useAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);

  async function analyze(text: string) {
    setIsLoading(true);
    setError(null);
    setTranscription(null);
    try {
      const response = await analyzeText(text);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function transcribe(blob: Blob) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await transcribeAudio(blob);
      setTranscription(response.transcription);
      setResult(response.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription failed");
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setTranscription(null);
  }

  return { isLoading, error, result, transcription, analyze, transcribe, reset };
}
