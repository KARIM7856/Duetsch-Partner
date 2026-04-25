"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WordAnalysis } from "@/lib/api";

export function WordLink({ data }: { data: WordAnalysis }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const colorClass = data.is_correct
    ? "text-slate-900"
    : "text-red-600 underline decoration-dotted decoration-red-400 cursor-pointer";

  return (
    <span
      className="relative inline-block mx-0.5"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className={colorClass}>{data.word}</span>

      <AnimatePresence>
        {showTooltip && !data.is_correct && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-white border border-slate-200 p-3 rounded-lg shadow-lg z-10 text-xs"
          >
            <p className="font-bold text-red-500">
              Correction: {data.correction}
            </p>
            {data.rule_name && (
              <p className="mt-1 text-slate-600">{data.rule_name}</p>
            )}
            {data.rule_url && (
              <a
                href={data.rule_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline block mt-1 hover:text-blue-700"
              >
                Learn Rule &rarr;
              </a>
            )}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-slate-200 -rotate-45 -mt-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
