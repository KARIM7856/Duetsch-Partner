"use client";

import { motion } from "framer-motion";
import type { AnalyzeResponse } from "@/lib/api";
import { WordLink } from "./WordLink";

function ScoreBadge({ score }: { score: number }) {
  let colorClass = "bg-red-100 text-red-700 border-red-200";
  if (score >= 80) colorClass = "bg-green-100 text-green-700 border-green-200";
  else if (score >= 60)
    colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}
    >
      Score: {score}%
    </span>
  );
}

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const wordVariant = {
  hidden: { opacity: 0, y: 5 },
  show: { opacity: 1, y: 0 },
};

export function CorrectedTranscript({
  analysis,
}: {
  analysis: AnalyzeResponse;
}) {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
          Analysis Result
        </h3>
        <ScoreBadge score={analysis.score} />
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-lg leading-relaxed flex flex-wrap"
        >
          {analysis.words.map((word, i) => (
            <motion.span key={i} variants={wordVariant}>
              <WordLink data={word} />
            </motion.span>
          ))}
        </motion.div>
      </div>

      {analysis.corrected_text !== analysis.original_text && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-700 mb-1">
            Corrected version:
          </p>
          <p className="text-green-900">{analysis.corrected_text}</p>
        </div>
      )}
    </div>
  );
}
