/**
 * Types shared between the "meine Puppe" client UI and the server route.
 * This module deliberately imports nothing from `@google/genai` so it stays
 * safe to import into client components.
 */

import type { Article } from "./games/nouns";

/** The secret noun the player is trying to guess. */
export interface SecretNoun {
  word: string;
  article: Article;
  en: string;
}

/** Conversation roles as understood by the Gemini API. */
export type PuppeRole = "user" | "model";

export interface PuppeChatMessage {
  role: PuppeRole;
  text: string;
}

/** How the model interpreted the player's latest message. */
export type PuppeTurnType =
  | "question" // asked about a property of the word
  | "guess" // proposed a concrete noun as the answer
  | "meta" // tried to make the AI reveal the word directly
  | "other"; // greeting, off-topic, unclear

export interface PuppeTurnResult {
  type: PuppeTurnType;
  /** The AI's reply, always in German, never containing the secret word. */
  reply: string;
  /** True only when the player named the secret noun (or a true synonym). */
  isCorrect: boolean;
  /** The noun the player guessed, normalised; null when not a guess. */
  guessedWord: string | null;
  /** Semantic warmth of the guess vs. the secret, 0 (cold) – 100 (correct). */
  closeness: number;
}

export interface PuppeTurnRequest {
  secret: SecretNoun;
  message: string;
  history: PuppeChatMessage[];
}
