import { GoogleGenAI } from "@google/genai";
import type { AnalyzeResponse, WordAnalysis } from "./api";

const ANALYSIS_SYSTEM_PROMPT = `
You are a German language expert specializing in A1-level German. Analyze the user's German text for grammatical and spelling errors.

Return ONLY a JSON object with the following structure:
{
  "original_sentence": "the original input text",
  "corrected_sentence": "the fully corrected version of the text",
  "analysis": [
    {
      "word": "the word as written by the user",
      "is_correct": true or false,
      "correction": "the correct form, or null if correct",
      "rule_name": "name of the grammar rule violated, or null if correct",
      "rule_url": "URL to a German grammar resource explaining the rule, or null if correct"
    }
  ]
}

Rules:
1. Analyze EVERY word in the input. Each word must appear in the analysis array.
2. If a word is correct, set is_correct to true and correction/rule_name/rule_url to null.
3. If a word is incorrect, provide:
   - The specific correction
   - The grammar rule name (e.g., "Verb Conjugation", "Article Gender", "Word Order", "Case (Akkusativ/Dativ)", "Verb Position in Nebensatz")
   - A URL to a reputable German grammar resource (e.g., from deutsch.lingolia.com, mein-deutschbuch.de, or grammatikdeutsch.de)
4. Focus on A1-level grammar: articles (der/die/das), verb conjugation (present tense), basic word order (V2 rule), cases (Nominativ/Akkusativ), common prepositions, and basic sentence structure.
5. Be encouraging but accurate. Flag real errors, do not invent problems with correct text.
6. For punctuation attached to words, include the punctuation with the word.
`;

const COMPLEXITY_KEYWORDS = [
  "weil", "dass", "obwohl", "wenn", "als", "nachdem",
  "damit", "bevor", "ob", "während",
];

const PASSIVE_INDICATORS = ["wird", "werden", "wurde", "wurden", "worden"];

interface RawWord {
  word: string;
  is_correct: boolean;
  correction: string | null;
  rule_name: string | null;
  rule_url: string | null;
}

interface RawModelResponse {
  original_sentence?: string;
  corrected_sentence?: string;
  analysis: RawWord[];
}

let cachedClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  cachedClient = new GoogleGenAI({ apiKey });
  return cachedClient;
}

function calculateComplexityFactor(text: string): number {
  const lower = text.toLowerCase();
  let factor = 1.0;

  for (const keyword of COMPLEXITY_KEYWORDS) {
    if (lower.includes(keyword)) {
      factor += 0.05;
    }
  }

  for (const indicator of PASSIVE_INDICATORS) {
    if (lower.includes(indicator)) {
      factor += 0.1;
      break;
    }
  }

  return Math.min(factor, 1.3);
}

export async function analyzeGerman(text: string): Promise<AnalyzeResponse> {
  const client = getClient();

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: text,
    config: {
      systemInstruction: ANALYSIS_SYSTEM_PROMPT,
      responseMimeType: "application/json",
    },
  });

  const raw = response.text;
  if (!raw) {
    throw new Error("Gemini returned an empty response");
  }

  const data = JSON.parse(raw) as RawModelResponse;

  const words: WordAnalysis[] = data.analysis.map((w) => ({
    word: w.word,
    is_correct: w.is_correct,
    correction: w.correction ?? null,
    rule_name: w.rule_name ?? null,
    rule_url: w.rule_url ?? null,
  }));

  const correctedText = data.corrected_sentence ?? text;

  const total = words.length;
  const correct = words.reduce((n, w) => n + (w.is_correct ? 1 : 0), 0);
  const baseScore = total > 0 ? (correct / total) * 100 : 0;
  const complexity = calculateComplexityFactor(text);
  const score = Math.min(Math.round(baseScore * complexity * 10) / 10, 100);

  return {
    original_text: text,
    corrected_text: correctedText,
    words,
    score,
  };
}
