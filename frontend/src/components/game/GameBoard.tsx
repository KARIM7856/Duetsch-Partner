"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { GameConfig, CharacterConfig } from "@/lib/games/types";
import { CharacterSprite } from "./CharacterSprite";
import { InteractionModal } from "./InteractionModal";

interface GameBoardProps {
  config: GameConfig;
  onAwardGranted?: () => void;
}

const storageKey = (gameId: string) => `deutschflow:awards:${gameId}`;

function loadAwards(key: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(key) ?? "";
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((v): v is string => typeof v === "string"));
    }
  } catch {
    // ignore parse / privacy-mode failures
  }
  return new Set();
}

function persistAwards(key: string, awards: Set<string>) {
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(awards)));
  } catch {
    // ignore quota / privacy-mode failures
  }
}

export function GameBoard({ config, onAwardGranted }: GameBoardProps) {
  const [activeCharacter, setActiveCharacter] = useState<CharacterConfig | null>(null);
  const key = storageKey(config.id);

  const [awards, setAwards] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setAwards(loadAwards(key));
  }, [key]);

  const grantAward = useCallback(
    (id: string) => {
      setAwards((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      // Write to localStorage immediately (outside React's render cycle)
      const current = loadAwards(key);
      current.add(id);
      persistAwards(key, current);
      onAwardGranted?.();
    },
    [key, onAwardGranted],
  );

  const awardOwners = useMemo(() => {
    const map = new Map<string, string>();
    config.characters.forEach((c) => {
      if (c.award) map.set(c.award, c.name);
    });
    return map;
  }, [config.characters]);

  const unmetFor = useCallback(
    (character: CharacterConfig): string[] =>
      (character.requires ?? [])
        .filter((req) => !awards.has(req))
        .map((req) => awardOwners.get(req) ?? req),
    [awards, awardOwners],
  );

  const handleAward = useCallback(() => {
    if (activeCharacter?.award) grantAward(activeCharacter.award);
  }, [activeCharacter, grantAward]);

  const handleComplete = useCallback(() => {
    if (activeCharacter?.award) grantAward(activeCharacter.award);
    setActiveCharacter(null);
  }, [activeCharacter, grantAward]);

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
            locked={unmetFor(character).length > 0}
            onClick={() => setActiveCharacter(character)}
          />
        ))}
      </div>

      <AnimatePresence>
        {activeCharacter && (
          <InteractionModal
            character={activeCharacter}
            lockedBy={unmetFor(activeCharacter)}
            onClose={() => setActiveCharacter(null)}
            onComplete={handleComplete}
            onAward={handleAward}
          />
        )}
      </AnimatePresence>
    </>
  );
}
