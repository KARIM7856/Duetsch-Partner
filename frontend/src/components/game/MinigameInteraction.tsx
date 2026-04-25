"use client";

import type { InteractionConfig } from "@/lib/games/types";

type MinigameConfig = Extract<InteractionConfig, { type: "minigame" }>;

/**
 * Registry of available minigame components.
 * To add a minigame: import the component and add an entry here.
 */
const MINIGAME_REGISTRY: Record<
  string,
  React.ComponentType<{ config: Record<string, unknown> }>
> = {
  // VocabularyQuiz: VocabularyQuiz,
};

interface MinigameInteractionProps {
  config: MinigameConfig;
}

export function MinigameInteraction({ config }: MinigameInteractionProps) {
  const Component = MINIGAME_REGISTRY[config.componentName];

  if (!Component) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <span className="text-4xl">🚧</span>
        <p className="text-slate-700 font-semibold">Minigame: {config.componentName}</p>
        <p className="text-slate-400 text-sm">Coming soon! This minigame is not yet implemented.</p>
        <pre className="mt-2 text-xs text-left bg-slate-50 border border-slate-200 rounded p-3 w-full overflow-auto">
          {JSON.stringify(config.config, null, 2)}
        </pre>
      </div>
    );
  }

  return <Component config={config.config} />;
}
