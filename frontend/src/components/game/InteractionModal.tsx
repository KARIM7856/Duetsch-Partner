"use client";

import { motion } from "framer-motion";
import type { CharacterConfig } from "@/lib/games/types";
import { DialogueInteraction } from "./DialogueInteraction";
import { MinigameInteraction } from "./MinigameInteraction";

interface InteractionModalProps {
  character: CharacterConfig;
  onClose: () => void;
  onComplete: () => void;
  onAward: () => void;
  lockedBy?: string[];
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export function InteractionModal({
  character,
  onClose,
  onComplete,
  onAward,
  lockedBy = [],
}: InteractionModalProps) {
  const isLocked = lockedBy.length > 0;

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
          {isLocked ? (
            <LockedView lockedBy={lockedBy} onClose={onClose} />
          ) : character.interaction.type === "dialogue" ? (
            <DialogueInteraction config={character.interaction} onComplete={onComplete} />
          ) : (
            <MinigameInteraction
              config={character.interaction}
              onComplete={onComplete}
              onAward={onAward}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function LockedView({ lockedBy, onClose }: { lockedBy: string[]; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <span className="text-5xl" aria-hidden>
        🔒
      </span>
      <p className="text-slate-800 font-semibold">Noch gesperrt</p>
      <p className="text-slate-500 text-sm">
        Erledige zuerst{" "}
        <span className="font-semibold text-slate-700">
          {lockedBy.join(", ")}
        </span>
        , um dieses Gespräch zu öffnen.
      </p>
      <button
        onClick={onClose}
        className="mt-2 py-2.5 px-5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors text-sm"
      >
        OK
      </button>
    </div>
  );
}
