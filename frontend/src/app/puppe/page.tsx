import { PuppeGame } from "@/components/puppe/PuppeGame";

export default function PuppePage() {
  return (
    <main className="puppe-page flex-1 flex flex-col items-center justify-start px-4 py-8 sm:py-10">
      <PuppeGame />
    </main>
  );
}
