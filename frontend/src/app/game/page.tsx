import { villageGame } from "@/lib/games/village";
import { GameBoard } from "@/components/game/GameBoard";

export default function GamePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 bg-slate-50">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">{villageGame.title}</h1>
          <p className="text-slate-500 mt-1 text-sm">Click on a character to start a conversation</p>
        </div>
        <GameBoard config={villageGame} />
      </div>
    </main>
  );
}
