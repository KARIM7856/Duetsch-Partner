"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InteractionConfig } from "@/lib/games/types";

type DialogueConfig = Extract<InteractionConfig, { type: "dialogue" }>;

interface DialogueInteractionProps {
  config: DialogueConfig;
  onComplete: () => void;
}

const lineVariants = {
  enter: { opacity: 0, x: 12 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};

export function DialogueInteraction({ config, onComplete }: DialogueInteractionProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const currentLine = config.lines[lineIndex];
  const isLast = lineIndex === config.lines.length - 1;

  const advance = () => {
    if (isLast) {
      onComplete();
    } else {
      setLineIndex((i) => i + 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress dots */}
      <div className="flex gap-1.5 justify-center">
        {config.lines.map((_, i) => (
          <span
            key={i}
            className={`block h-1.5 rounded-full transition-all duration-300 ${
              i === lineIndex
                ? "w-6 bg-slate-800"
                : i < lineIndex
                ? "w-1.5 bg-slate-400"
                : "w-1.5 bg-slate-200"
            }`}
          />
        ))}
      </div>

      {/* Speaker */}
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
        {currentLine.speaker}
      </p>

      {/* Dialogue text */}
      <div className="min-h-[5rem] relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={lineIndex}
            variants={lineVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="text-slate-800 text-base leading-relaxed"
          >
            {currentLine.text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Advance button */}
      <button
        onClick={advance}
        className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors text-sm"
      >
        {isLast ? "Fertig" : "Weiter →"}
      </button>
    </div>
  );
}
