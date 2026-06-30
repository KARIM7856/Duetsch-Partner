import type { GameConfig, SceneGameConfig } from "./types";

const villageScene: GameConfig = {
  id: "village",
  title: "Das Dorf — The Village",
  board: {
    backgroundCss:
      "bg-gradient-to-b from-sky-300 via-green-300 to-green-500",
    label: "Willkommen im Dorf!",
  },
  characters: [
    {
      id: "baker",
      name: "Der Bäcker",
      sprite: { kind: "emoji", value: "👨‍🍳" },
      position: { x: 20, y: 90 },
      award: "baker-talked",
      interaction: {
        type: "minigame",
        componentName: "DialogueBuilder",
        config: {
          lines: [
            {
              speaker: "Der Bäcker",
              parts: [
                { type: "text", value: "Guten " },
                { type: "blank", answer: "Morgen", hint: "morning" },
                { type: "text", value: "! Möchten Sie Brot kaufen?" },
              ],
            },
          ],
        },
      },
    },
    {
      id: "teacher",
      name: "Die Lehrerin",
      sprite: { kind: "emoji", value: "👩‍🏫" },
      position: { x: 55, y: 35 },
      interaction: {
        type: "dialogue",
        lines: [
          { speaker: "Die Lehrerin", text: "Hallo! Lernst du Deutsch?" },
          { speaker: "Du", text: "Ja, ich lerne Deutsch. Es ist schwer!" },
          { speaker: "Die Lehrerin", text: "Kein Problem. Übung macht den Meister." },
          { speaker: "Die Lehrerin", text: "Wiederhole: Ich heiße… wie heißt du?" },
          { speaker: "Du", text: "Ich heiße… ich übe noch!" },
        ],
      },
    },
    {
      id: "child",
      name: "Das Kind",
      sprite: { kind: "emoji", value: "🧒" },
      position: { x: 75, y: 65 },
      requires: ["baker-talked"],
      interaction: {
        type: "dialogue",
        lines: [
          { speaker: "Das Kind", text: "Hallo! Willst du spielen?" },
          { speaker: "Du", text: "Ja, gerne! Was spielst du?" },
          { speaker: "Das Kind", text: "Ich spiele Fußball. Kommst du mit?" },
        ],
      },
    },
    {
      id: "mayor",
      name: "Der Bürgermeister",
      sprite: { kind: "emoji", value: "🧑‍💼" },
      position: { x: 40, y: 72 },
      interaction: {
        type: "minigame",
        componentName: "VocabularyQuiz",
        config: { topic: "greetings", level: "A1" },
      },
    },
  ],
};

const marketScene: GameConfig = {
  id: "market",
  title: "Der Marktplatz — The Marketplace",
  board: {
    backgroundCss:
      "bg-gradient-to-b from-amber-200 via-orange-200 to-stone-300",
    label: "Willkommen auf dem Marktplatz!",
  },
  characters: [
    {
      id: "vendor",
      name: "Die Verkäuferin",
      sprite: { kind: "emoji", value: "🧑‍🌾" },
      position: { x: 30, y: 80 },
      award: "vendor-talked",
      interaction: {
        type: "dialogue",
        lines: [
          { speaker: "Die Verkäuferin", text: "Guten Tag! Frisches Obst heute!" },
          { speaker: "Du", text: "Was kostet ein Kilo Äpfel?" },
          { speaker: "Die Verkäuferin", text: "Drei Euro das Kilo." },
          { speaker: "Du", text: "Ich nehme zwei Kilo, bitte." },
          { speaker: "Die Verkäuferin", text: "Sehr gerne! Das macht sechs Euro." },
        ],
      },
    },
    {
      id: "musician",
      name: "Der Musiker",
      sprite: { kind: "emoji", value: "🎵" },
      position: { x: 65, y: 45 },
      award: "musician-talked",
      interaction: {
        type: "dialogue",
        lines: [
          { speaker: "Der Musiker", text: "Hallo! Magst du Musik?" },
          { speaker: "Du", text: "Ja! Was spielst du?" },
          { speaker: "Der Musiker", text: "Ich spiele Gitarre. Hör zu!" },
          { speaker: "Du", text: "Das klingt wunderschön!" },
        ],
      },
    },
    {
      id: "tourist",
      name: "Der Tourist",
      sprite: { kind: "emoji", value: "📸" },
      position: { x: 50, y: 75 },
      requires: ["vendor-talked", "musician-talked"],
      interaction: {
        type: "dialogue",
        lines: [
          { speaker: "Der Tourist", text: "Entschuldigung, wo ist das Museum?" },
          { speaker: "Du", text: "Gehen Sie geradeaus und dann links." },
          { speaker: "Der Tourist", text: "Vielen Dank! Deutschland ist toll!" },
        ],
      },
    },
  ],
};

export const villageGame: SceneGameConfig = {
  id: "village",
  scenes: [villageScene, marketScene],
};
