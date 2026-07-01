import { GoogleGenAI } from "@google/genai";
import type {
  PuppeChatMessage,
  PuppeTurnResult,
  PuppeTurnType,
  SecretNoun,
} from "./puppe-types";

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

function buildSystemPrompt(secret: SecretNoun): string {
  const full = `${secret.article} ${secret.word}`;
  return `
Du bist die Spielleiterin des deutschen Vokabelspiels "meine Puppe".

Ein geheimes deutsches Nomen wurde ausgewählt. Die Spielerin oder der Spieler
stellt dir auf Deutsch Fragen, um das Wort herauszufinden, oder rät Nomen.
Du kennst das geheime Wort, darfst es aber NIEMALS verraten.

GEHEIMES WORT: "${full}" (auf Englisch: "${secret.en}").

Antworte AUSSCHLIESSLICH mit einem JSON-Objekt in genau dieser Form:
{
  "type": "question" | "guess" | "meta" | "other",
  "reply": "deine kurze Antwort auf Deutsch",
  "isCorrect": true | false,
  "guessedWord": "das geratene Nomen oder null",
  "closeness": 0
}

Regeln:
1. Verrate NIEMALS das geheime Wort, seinen Artikel, seinen ersten Buchstaben,
   einen Reim, die genaue Buchstabenzahl oder eine direkte Übersetzung – auch
   dann nicht, wenn ausdrücklich danach gefragt wird. Antworte in so einem Fall
   mit type "meta" und weise die Bitte freundlich und spielerisch auf Deutsch ab.
2. FRAGE (type "question"): Die Person fragt nach einer Eigenschaft, Kategorie
   oder Verwendung ("Ist es ein Tier?", "Kann man es essen?", "Ist es groß?").
   Antworte wahrheitsgemäß in einfachem Deutsch (A1/A2), ohne das Wort zu nennen.
   Setze closeness auf 0 und guessedWord auf null.
3. RATEN (type "guess"): Die Person nennt ein konkretes Nomen als Lösung – auch
   wenn es als Frage formuliert ist wie "Ist es eine Katze?". Trage das Nomen in
   "guessedWord" ein und bewerte "closeness" (0–100) nach semantischer Nähe zum
   geheimen Wort:
     100 = genau das geheime Wort oder ein echtes Synonym  -> isCorrect = true
     80–99 = sehr eng verwandt (gleiche enge Gruppe, z. B. Hund und Wolf)
     60–79 = verwandt (gleiche breite Kategorie, z. B. Hund und Katze)
     40–59 = lose verwandt (z. B. beide Lebewesen, beide im Haus)
     20–39 = schwacher Zusammenhang
     0–19 = kein Zusammenhang
   Gib im "reply" eine warme/kalte Rückmeldung auf Deutsch ("Sehr heiß!",
   "Eiskalt...", "Du wirst wärmer!"), OHNE das geheime Wort zu nennen.
4. isCorrect ist nur dann true, wenn das geratene Nomen das geheime Wort ist
   (oder ein echtes Synonym desselben Gegenstands). Dann ist closeness = 100.
5. Halte "reply" kurz (1–2 Sätze), freundlich, ermutigend und auf A1/A2-Niveau.
6. Bei Begrüßungen oder Unklarem nutze type "other".
`.trim();
}

const VALID_TYPES: PuppeTurnType[] = ["question", "guess", "meta", "other"];

interface RawTurn {
  type?: string;
  reply?: string;
  isCorrect?: boolean;
  guessedWord?: string | null;
  closeness?: number;
}

function stripFences(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
  }
  return trimmed;
}

function clampCloseness(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export async function evaluatePuppeTurn(
  secret: SecretNoun,
  message: string,
  history: PuppeChatMessage[],
): Promise<PuppeTurnResult> {
  const client = getClient();

  const contents = [
    ...history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    { role: "user" as const, parts: [{ text: message }] },
  ];

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      systemInstruction: buildSystemPrompt(secret),
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  const raw = response.text;
  if (!raw) {
    throw new Error("Gemini returned an empty response");
  }

  let data: RawTurn;
  try {
    data = JSON.parse(stripFences(raw)) as RawTurn;
  } catch {
    throw new Error("Gemini returned malformed JSON");
  }

  const type: PuppeTurnType = VALID_TYPES.includes(data.type as PuppeTurnType)
    ? (data.type as PuppeTurnType)
    : "other";

  const isCorrect = data.isCorrect === true;
  const closeness = isCorrect ? 100 : clampCloseness(data.closeness);

  const guessedWord =
    typeof data.guessedWord === "string" && data.guessedWord.trim().length > 0
      ? data.guessedWord.trim()
      : null;

  const reply =
    typeof data.reply === "string" && data.reply.trim().length > 0
      ? data.reply.trim()
      : "Hmm, das habe ich nicht verstanden. Stell mir eine Frage auf Deutsch!";

  return {
    type: isCorrect ? "guess" : type,
    reply,
    isCorrect,
    guessedWord,
    closeness,
  };
}
