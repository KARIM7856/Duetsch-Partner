export type SpriteSource =
  | { kind: "emoji"; value: string }
  | { kind: "image"; url: string; alt: string };

export interface DialogueLine {
  speaker: string;
  text: string;
}

export type InteractionConfig =
  | { type: "dialogue"; lines: DialogueLine[] }
  | { type: "minigame"; componentName: string; config: Record<string, unknown> };

export interface CharacterConfig {
  id: string;
  name: string;
  sprite: SpriteSource;
  /** Percentage-based position on the board (0–100 for both axes) */
  position: { x: number; y: number };
  interaction: InteractionConfig;
}

export interface GameConfig {
  id: string;
  title: string;
  board: {
    backgroundCss: string;
    label?: string;
  };
  characters: CharacterConfig[];
}
