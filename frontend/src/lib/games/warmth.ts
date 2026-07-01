/**
 * Maps a guess "closeness" (0–100) to a colour-coded warmth tier used by the
 * "meine Puppe" game. Beyond the chip/bar styling, each tier also carries the
 * HSL + glow + kind values that drive the whole-chat "Tempel" ambiance
 * (aura wash, frost/heat overlays, shake/shiver/confetti).
 *
 * Class strings are written out in full so Tailwind's JIT compiler can detect
 * them (no dynamic class concatenation).
 */

export type WarmthKind = "win" | "hot" | "mild" | "cold";

export interface WarmthTier {
  /** Stable identifier for the tier (used for ambiance intensity tweaks). */
  key: string;
  /** German label shown to the player. */
  label: string;
  emoji: string;
  /** Background + text + border classes for the warmth chip. */
  chip: string;
  /** Fill colour for the warmth bar. */
  bar: string;
  /** Drives which ambiance/animation the whole chat plays. */
  kind: WarmthKind;
  /** Ambiance hue/saturation/lightness (saturation & lightness are percentages). */
  h: number;
  s: number;
  l: number;
  /** Ambiance glow intensity, 0–1. */
  glow: number;
}

export function warmthTier(closeness: number, isCorrect: boolean): WarmthTier {
  if (isCorrect || closeness >= 100) {
    return {
      key: "richtig",
      label: "Richtig!",
      emoji: "🎉",
      chip: "bg-green-100 text-green-800 border-green-300",
      bar: "bg-green-500",
      kind: "win",
      h: 145,
      s: 63,
      l: 42,
      glow: 0.92,
    };
  }
  if (closeness >= 80) {
    return {
      key: "brennt",
      label: "Brennt heiß",
      emoji: "🔥",
      chip: "bg-red-100 text-red-700 border-red-300",
      bar: "bg-red-500",
      kind: "hot",
      h: 0,
      s: 84,
      l: 60,
      glow: 0.85,
    };
  }
  if (closeness >= 60) {
    return {
      key: "heiss",
      label: "Heiß",
      emoji: "♨️",
      chip: "bg-orange-100 text-orange-700 border-orange-300",
      bar: "bg-orange-500",
      kind: "hot",
      h: 24,
      s: 95,
      l: 53,
      glow: 0.6,
    };
  }
  if (closeness >= 40) {
    return {
      key: "warm",
      label: "Warm",
      emoji: "🌤️",
      chip: "bg-amber-100 text-amber-700 border-amber-300",
      bar: "bg-amber-400",
      kind: "mild",
      h: 43,
      s: 96,
      l: 56,
      glow: 0.36,
    };
  }
  if (closeness >= 20) {
    return {
      key: "kuehl",
      label: "Kühl",
      emoji: "🌬️",
      chip: "bg-sky-100 text-sky-700 border-sky-300",
      bar: "bg-sky-400",
      kind: "cold",
      h: 199,
      s: 89,
      l: 60,
      glow: 0.34,
    };
  }
  return {
    key: "eiskalt",
    label: "Eiskalt",
    emoji: "❄️",
    chip: "bg-blue-100 text-blue-700 border-blue-300",
    bar: "bg-blue-500",
    kind: "cold",
    h: 217,
    s: 91,
    l: 60,
    glow: 0.55,
  };
}
