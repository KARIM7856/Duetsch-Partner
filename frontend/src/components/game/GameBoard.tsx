"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { GameConfig, CharacterConfig } from "@/lib/games/types";
import { CharacterSprite } from "./CharacterSprite";
import { InteractionModal } from "./InteractionModal";

interface GameBoardProps {
  config: GameConfig;
}

export function GameBoard({ config }: GameBoardProps) {
  const [activeCharacter, setActiveCharacter] = useState<CharacterConfig | null>(null);

  return (
    <>
      <div
        className={`relative w-full overflow-hidden rounded-2xl shadow-xl ${config.board.backgroundCss}`}
        style={{ aspectRatio: "16 / 10" }}
      >
        {config.board.label && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-black/30 backdrop-blur-sm text-white text-sm font-medium px-4 py-1 rounded-full">
            {config.board.label}
          </div>
        )}

        {config.characters.map((character) => (
          <CharacterSprite
            key={character.id}
            character={character}
            onClick={() => setActiveCharacter(character)}
          />
        ))}
      </div>

      <AnimatePresence>
        {activeCharacter && (
          <InteractionModal
            character={activeCharacter}
            onClose={() => setActiveCharacter(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
