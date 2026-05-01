"use client";

import { motion } from "framer-motion";
import type { CharacterConfig } from "@/lib/games/types";

interface CharacterSpriteProps {
  character: CharacterConfig;
  onClick: () => void;
  locked?: boolean;
}

export function CharacterSprite({ character, onClick, locked = false }: CharacterSpriteProps) {
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
      aria-label={locked ? `${name} (locked)` : name}
    >
      <span className="relative" style={{ fontSize: "2.5rem", lineHeight: 1 }}>
        <span
          className={`select-none block transition-all ${
            locked ? "grayscale opacity-60" : ""
          }`}
        >
          {sprite.kind === "emoji" ? (
            sprite.value
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sprite.url} alt={sprite.alt} className="w-10 h-10 object-contain" />
          )}
        </span>
        {locked && (
          <span
            className="absolute -top-1 -right-2 bg-white/95 rounded-full w-6 h-6 flex items-center justify-center shadow-md ring-1 ring-slate-200"
            style={{ fontSize: "0.85rem", lineHeight: 1 }}
            aria-hidden
          >
            🔒
          </span>
        )}
      </span>
      <span
        className={`text-xs font-semibold text-white drop-shadow rounded-full px-2 py-0.5 whitespace-nowrap ${
          locked ? "bg-slate-700/60" : "bg-black/40"
        }`}
      >
        {name}
      </span>
    </motion.button>
  );
}
