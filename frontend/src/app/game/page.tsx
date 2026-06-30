import { villageGame } from "@/lib/games/village";
import { SceneManager } from "@/components/game/SceneManager";

export default function GamePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 bg-slate-50">
      <div className="w-full max-w-5xl">
        <SceneManager config={villageGame} />
      </div>
    </main>
  );
}
