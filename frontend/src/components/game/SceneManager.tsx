"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SceneGameConfig } from "@/lib/games/types";
import { GameBoard } from "./GameBoard";

interface SceneManagerProps {
  config: SceneGameConfig;
}

const sceneKey = (gameId: string) => `deutschflow:scene:${gameId}`;
const awardsKey = (sceneId: string) => `deutschflow:awards:${sceneId}`;

function loadSceneIndex(key: string, max: number): number {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 && n < max ? n : 0;
  } catch {
    return 0;
  }
}

function persistSceneIndex(key: string, index: number) {
  try {
    window.localStorage.setItem(key, String(index));
  } catch {
    // ignore
  }
}

function loadAwardsSet(key: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(key) ?? "";
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((v): v is string => typeof v === "string"));
    }
  } catch {
    // ignore
  }
  return new Set();
}

export function SceneManager({ config }: SceneManagerProps) {
  const key = sceneKey(config.id);
  const [sceneIndex, setSceneIndex] = useState<number>(0);
  const [resetKey, setResetKey] = useState<number>(0);

  useEffect(() => {
    setSceneIndex(loadSceneIndex(key, config.scenes.length));
  }, [key, config.scenes.length]);

  const currentScene = config.scenes[sceneIndex];

  const requiredAwards = useMemo(
    () =>
      currentScene.characters
        .filter((c) => c.award)
        .map((c) => c.award!),
    [currentScene],
  );

  const [allAwardsEarned, setAllAwardsEarned] = useState(false);

  const checkAwards = useCallback(() => {
    if (requiredAwards.length === 0) {
      setAllAwardsEarned(false);
      return;
    }
    const earned = loadAwardsSet(awardsKey(currentScene.id));
    setAllAwardsEarned(requiredAwards.every((a) => earned.has(a)));
  }, [requiredAwards, currentScene.id]);

  useEffect(() => {
    checkAwards();
  }, [checkAwards]);

  const isLastScene = sceneIndex === config.scenes.length - 1;

  const handleAdvance = useCallback(() => {
    if (isLastScene) return;
    const next = sceneIndex + 1;
    setSceneIndex(next);
    persistSceneIndex(key, next);
  }, [sceneIndex, isLastScene, key]);

  const handleBoardChange = useCallback(() => {
    checkAwards();
  }, [checkAwards]);

  const handleReset = useCallback(() => {
    if (!window.confirm("Fortschritt zurücksetzen? Alle Auszeichnungen und Szenen werden gelöscht.")) {
      return;
    }
    try {
      window.localStorage.removeItem(key);
      config.scenes.forEach((scene) => {
        window.localStorage.removeItem(awardsKey(scene.id));
      });
    } catch {
      // ignore
    }
    setSceneIndex(0);
    setAllAwardsEarned(false);
    setResetKey((n) => n + 1);
  }, [key, config.scenes]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
          Szene {sceneIndex + 1} / {config.scenes.length}
        </p>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">{currentScene.title}</h1>
        <p className="text-slate-500 mt-1 text-sm">Click on a character to start a conversation</p>
      </div>

      <GameBoard
        key={`${currentScene.id}:${resetKey}`}
        config={currentScene}
        onAwardGranted={handleBoardChange}
      />

      <AnimatePresence mode="wait">
        {allAwardsEarned && !isLastScene && (
          <motion.div
            key="advance"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <button
              onClick={handleAdvance}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all text-sm"
            >
              Nächste Szene →
            </button>
          </motion.div>
        )}
        {allAwardsEarned && isLastScene && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="text-lg font-bold text-emerald-700">🎉 Herzlichen Glückwunsch!</p>
            <p className="text-slate-500 text-sm mt-1">Du hast alle Szenen abgeschlossen!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center pt-2">
        <button
          onClick={handleReset}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 underline underline-offset-4"
        >
          Fortschritt zurücksetzen
        </button>
      </div>
    </div>
  );
}
