"use client";

// VAQTINCHALIK — fon ro'yxati canvas ustida ko'rinadimi va bosiladimi.
// korinish.js dagi tuzilish aynan takrorlangan. Commitdan oldin o'chiriladi.
import FonTanlagich, { useFon } from "@/components/FonTanlagich";

export default function OldindanKorish() {
  const [fon, tanla] = useFon();

  return (
    <div
      className="flex h-screen w-screen flex-col overflow-hidden"
      style={{ background: "var(--v3-fon)", color: "var(--v3-matn)" }}
    >
      <header
        className="relative z-50 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5 backdrop-blur-md"
        style={{ background: "var(--v3-fon-2)", borderColor: "var(--v3-chiziq)" }}
      >
        <h1 className="text-sm font-bold">🔬 3D Laboratoriya</h1>
        <FonTanlagich fon={fon} tanla={tanla} />
      </header>

      <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
        <main className="relative h-full w-full flex-1 overflow-hidden">
          <div id="soxta-canvas" className="absolute inset-0 h-full w-full bg-slate-800" />
        </main>
      </div>
    </div>
  );
}
