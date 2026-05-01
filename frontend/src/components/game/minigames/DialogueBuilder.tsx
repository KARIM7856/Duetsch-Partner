"use client";

import { useEffect, useMemo, useState } from "react";
import { Reorder, motion, AnimatePresence } from "framer-motion";

type DialoguePart =
  | { type: "text"; value: string }
  | { type: "blank"; answer: string; hint?: string };

interface DialogueLineDef {
  speaker: string;
  parts: DialoguePart[];
}

interface DialogueBuilderConfig {
  lines: DialogueLineDef[];
}

type Result = "idle" | "correct" | "incorrect";

interface DialogueBuilderProps {
  config: Record<string, unknown>;
  onComplete?: () => void;
  onAward?: () => void;
}

function shuffleIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (n > 1 && arr.every((v, i) => v === i)) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function DialogueBuilder({ config, onComplete, onAward }: DialogueBuilderProps) {
  const { lines } = config as unknown as DialogueBuilderConfig;

  const [currentOrder, setCurrentOrder] = useState<number[]>(() =>
    shuffleIndices(lines.length),
  );
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result>("idle");

  useEffect(() => {
    if (result === "correct") onAward?.();
  }, [result, onAward]);

  const blankKeys = useMemo(() => {
    const keys: { lineIdx: number; partIdx: number; answer: string }[] = [];
    lines.forEach((line, lineIdx) => {
      line.parts.forEach((part, partIdx) => {
        if (part.type === "blank") {
          keys.push({ lineIdx, partIdx, answer: part.answer });
        }
      });
    });
    return keys;
  }, [lines]);

  const orderCorrect = currentOrder.every((v, i) => v === i);
  const wrongLineIds = new Set(
    currentOrder.filter((v, i) => v !== i),
  );
  const wrongInputKeys = new Set(
    blankKeys
      .filter(({ lineIdx, partIdx, answer }) => {
        const value = inputs[`${lineIdx}-${partIdx}`] ?? "";
        return normalize(value) !== normalize(answer);
      })
      .map(({ lineIdx, partIdx }) => `${lineIdx}-${partIdx}`),
  );

  const handleCheck = () => {
    setResult(orderCorrect && wrongInputKeys.size === 0 ? "correct" : "incorrect");
  };

  const handleRetry = () => {
    setResult("idle");
  };

  const containerBorder =
    result === "correct"
      ? "border-emerald-400"
      : result === "incorrect"
        ? "border-rose-300"
        : "border-slate-200";

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">
        Sortiere die Sätze und fülle die Lücken
      </p>

      <Reorder.Group
        axis="y"
        values={currentOrder}
        onReorder={(next) => {
          setCurrentOrder(next);
          if (result !== "idle") setResult("idle");
        }}
        className={`space-y-2 max-h-[55vh] overflow-y-auto rounded-lg border-2 p-2 transition-colors ${containerBorder}`}
      >
        {currentOrder.map((lineIdx) => {
          const line = lines[lineIdx];
          const isWrongLine = result === "incorrect" && wrongLineIds.has(lineIdx);
          return (
            <Reorder.Item
              key={lineIdx}
              value={lineIdx}
              className={`bg-slate-50 rounded-lg border p-3 cursor-grab active:cursor-grabbing select-none transition-colors ${
                isWrongLine ? "border-rose-300 bg-rose-50" : "border-slate-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-slate-300 text-lg leading-none mt-0.5" aria-hidden>
                  ≡
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    {line.speaker}
                  </p>
                  <p className="text-slate-800 text-sm leading-relaxed">
                    {line.parts.map((part, partIdx) => {
                      if (part.type === "text") {
                        return <span key={partIdx}>{part.value}</span>;
                      }
                      const key = `${lineIdx}-${partIdx}`;
                      const value = inputs[key] ?? "";
                      const isWrongInput =
                        result === "incorrect" && wrongInputKeys.has(key);
                      const stateClass =
                        result === "correct"
                          ? "border-emerald-500 bg-emerald-50/70 text-emerald-900"
                          : isWrongInput
                            ? "border-rose-500 bg-rose-50/70 text-rose-900"
                            : "border-slate-400 bg-slate-100/70 text-slate-900 hover:bg-slate-100 focus:bg-white focus:border-slate-700 focus:shadow-[0_2px_0_0_rgba(15,23,42,0.08)]";
                      const widthCh =
                        Math.max(part.answer.length, part.hint?.length ?? 0, 5) + 1;
                      return (
                        <input
                          key={partIdx}
                          type="text"
                          value={value}
                          onChange={(e) => {
                            setInputs((prev) => ({ ...prev, [key]: e.target.value }));
                            if (result !== "idle") setResult("idle");
                          }}
                          onPointerDown={(e) => e.stopPropagation()}
                          placeholder={part.hint}
                          aria-label={part.hint ? `Lücke: ${part.hint}` : `Lücke ${partIdx}`}
                          className={`mx-1 px-2 py-0.5 rounded-t-md border-b-2 border-dotted outline-none transition-all duration-150 placeholder:text-slate-400 placeholder:italic placeholder:font-normal text-center font-medium ${stateClass}`}
                          style={{ width: `${widthCh}ch` }}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck={false}
                        />
                      );
                    })}
                  </p>
                </div>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <AnimatePresence mode="wait">
        {result === "correct" && (
          <motion.div
            key="correct"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-center text-sm font-semibold text-emerald-700"
          >
            ✓ Sehr gut! 🎉
          </motion.div>
        )}
        {result === "incorrect" && (
          <motion.div
            key="incorrect"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-center text-sm font-semibold text-rose-700"
          >
            Nicht ganz — versuche es nochmal.
          </motion.div>
        )}
      </AnimatePresence>

      {result === "incorrect" ? (
        <button
          onClick={handleRetry}
          className="w-full py-2.5 bg-slate-100 text-slate-800 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm"
        >
          Noch einmal versuchen
        </button>
      ) : result === "correct" ? (
        <button
          onClick={() => onComplete?.()}
          className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm"
        >
          Fertig
        </button>
      ) : (
        <button
          onClick={handleCheck}
          className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors text-sm"
        >
          Prüfen
        </button>
      )}
    </div>
  );
}
