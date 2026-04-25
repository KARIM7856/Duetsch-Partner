# Game Mode

A config-driven top-down board game where players click characters to trigger dialogue or minigames. Adding a new game requires only a new config file — no component changes.

---

## How It Works

The game renders a responsive 16:10 board with characters placed at percentage-based positions. Clicking a character opens an animated modal showing either a step-through dialogue or a minigame slot.

```
/game  →  GameBoard  →  CharacterSprite (×N)
                    →  InteractionModal
                           →  DialogueInteraction   (type: "dialogue")
                           →  MinigameInteraction   (type: "minigame")
```

---

## File Structure

```
src/
  app/
    game/
      page.tsx                    Route entry point — imports a GameConfig and renders GameBoard
  components/
    NavBar.tsx                    Sticky top nav: Grammar ↔ Game Mode (active link highlighted)
    game/
      GameBoard.tsx               Board container + modal open/close state
      CharacterSprite.tsx         Clickable emoji/image sprite with hover animation
      InteractionModal.tsx        Fixed overlay modal with spring animation
      DialogueInteraction.tsx     Step-through visual novel dialogue
      MinigameInteraction.tsx     Registry-based slot for future minigames
  lib/
    games/
      types.ts                    TypeScript config types
      village.ts                  Example game: "Das Dorf"
```

---

## Config Types

Defined in `src/lib/games/types.ts`.

```typescript
interface GameConfig {
  id: string
  title: string
  board: {
    backgroundCss: string   // Tailwind class string, e.g. "bg-gradient-to-b from-sky-300 to-green-500"
    label?: string          // Optional floating scene label on the board
  }
  characters: CharacterConfig[]
}

interface CharacterConfig {
  id: string
  name: string
  sprite: SpriteSource      // { kind: "emoji", value: "👨‍🍳" } or { kind: "image", url, alt }
  position: { x: number; y: number }  // 0–100 percent, board-relative
  interaction: InteractionConfig
}

// Two interaction types:
type InteractionConfig =
  | { type: "dialogue";  lines: DialogueLine[] }
  | { type: "minigame";  componentName: string; config: Record<string, unknown> }

interface DialogueLine {
  speaker: string
  text: string
}
```

---

## Adding a New Game

1. Create `src/lib/games/<name>.ts` and export a `GameConfig` object.
2. Import it in `src/app/game/page.tsx` and pass it to `<GameBoard config={...} />`.

No other files need to change.

**Example:**

```typescript
// src/lib/games/cafe.ts
import type { GameConfig } from "./types";

export const cafeGame: GameConfig = {
  id: "cafe",
  title: "Das Café",
  board: {
    backgroundCss: "bg-gradient-to-b from-amber-100 to-amber-300",
    label: "Willkommen im Café!",
  },
  characters: [
    {
      id: "waiter",
      name: "Der Kellner",
      sprite: { kind: "emoji", value: "🧑‍🍽️" },
      position: { x: 30, y: 50 },
      interaction: {
        type: "dialogue",
        lines: [
          { speaker: "Der Kellner", text: "Guten Tag! Was möchten Sie trinken?" },
          { speaker: "Du",          text: "Einen Kaffee, bitte." },
          { speaker: "Der Kellner", text: "Mit Milch oder ohne?" },
        ],
      },
    },
  ],
};
```

---

## Adding a Minigame

1. Create `src/components/game/minigames/<Name>.tsx` — a `"use client"` component accepting `{ config: Record<string, unknown> }`.
2. Add it to the registry in `src/components/game/MinigameInteraction.tsx`:

```typescript
import { VocabularyQuiz } from "./minigames/VocabularyQuiz";

const MINIGAME_REGISTRY = {
  VocabularyQuiz: VocabularyQuiz,
};
```

3. Reference it by name in any game config:

```typescript
interaction: {
  type: "minigame",
  componentName: "VocabularyQuiz",
  config: { topic: "greetings", level: "A1" },
}
```

Until a minigame is registered, its character shows a "Coming soon" placeholder with the config JSON.

---

## Dialogue Interaction

- Lines are stepped through one at a time (click "Weiter →" to advance).
- Progress dots show position in the conversation (active = wide pill, past = dark, future = light).
- Line text slides in/out with a Framer Motion transition.
- The final line's button reads "Fertig" and closes the modal on click.

---

## Positioning Characters

Positions are percentage-based (`x: 0–100`, `y: 0–100`) relative to the board. The character sprite is centered on that coordinate.

```
(0,0) ──────────── (100,0)
  │                    │
  │   x:20, y:55 ●     │
  │                    │
(0,100) ──────────(100,100)
```

Spread characters out to avoid overlap. At the default 16:10 aspect ratio, a rough grid of safe positions:

| Area        | x   | y   |
|-------------|-----|-----|
| Left-mid    | 15–25 | 45–60 |
| Center-top  | 45–60 | 25–45 |
| Right-mid   | 65–80 | 55–70 |
| Center-low  | 35–50 | 65–78 |

---

## Example Game — Das Dorf

Located at `src/lib/games/village.ts`. Board: sky-to-grass gradient.

| Character | Sprite | Position | Type |
|---|---|---|---|
| Der Bäcker | 👨‍🍳 | (20, 55) | Dialogue — shopping for bread |
| Die Lehrerin | 👩‍🏫 | (55, 35) | Dialogue — German practice intro |
| Das Kind | 🧒 | (75, 65) | Dialogue — playing Fußball |
| Der Bürgermeister | 🧑‍💼 | (40, 72) | Minigame placeholder — VocabularyQuiz (A1 greetings) |
