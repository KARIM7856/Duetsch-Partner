"use client";

import { motion } from "framer-motion";
import type { CharacterConfig } from "@/lib/games/types";

interface CharacterSpriteProps {
  character: CharacterConfig;
  onClick: () => void;
}

export function CharacterSprite({ character, onClick }: CharacterSpriteProps) {
  const { position, sprite, name } = character;

  return (
    <motion.button
      className="absolute flex flex-col items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <span className="select-none" style={{ fontSize: "2.5rem", lineHeight: 1 }}>
        {sprite.kind === "emoji" ? (
          sprite.value
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sprite.url} alt={sprite.alt} className="w-10 h-10 object-contain" />
        )}
      </span>
      <span className="text-xs font-semibold text-white drop-shadow bg-black/40 rounded-full px-2 py-0.5 whitespace-nowrap">
        {name}
      </span>
    </motion.button>
  );
}
