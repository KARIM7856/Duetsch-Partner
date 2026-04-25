"use client";

import { motion } from "framer-motion";
import type { CharacterConfig } from "@/lib/games/types";
import { DialogueInteraction } from "./DialogueInteraction";
import { MinigameInteraction } from "./MinigameInteraction";

interface InteractionModalProps {
  character: CharacterConfig;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export function InteractionModal({ character, onClose }: InteractionModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <motion.div
        className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        variants={panelVariants}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{character.name}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Interaction content */}
        <div className="p-6">
          {character.interaction.type === "dialogue" ? (
            <DialogueInteraction config={character.interaction} onComplete={onClose} />
          ) : (
            <MinigameInteraction config={character.interaction} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
