import type { GameConfig } from "./types";

export const villageGame: GameConfig = {
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
            {
              speaker: "Du",
              parts: [
                { type: "text", value: "Ja, bitte. Wie viel " },
                { type: "blank", answer: "kostet", hint: "costs" },
                { type: "text", value: " das Brot?" },
              ],
            },
            {
              speaker: "Der Bäcker",
              parts: [
                { type: "text", value: "Das Brot kostet " },
                { type: "blank", answer: "zwei", hint: "two" },
                { type: "text", value: " Euro." },
              ],
            },
            {
              speaker: "Du",
              parts: [
                { type: "text", value: "Hier sind zwei Euro. Danke " },
                { type: "blank", answer: "schön", hint: "nicely" },
                { type: "text", value: "!" },
              ],
            },
            {
              speaker: "Der Bäcker",
              parts: [
                { type: "text", value: "Bitte schön! Auf " },
                { type: "blank", answer: "Wiedersehen", hint: "goodbye" },
                { type: "text", value: "!" },
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
