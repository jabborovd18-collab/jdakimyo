"use client"

import Link from "next/link"
import Muhokama from "@/components/Muhokama"
import Ikon from "@/components/Ikon"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"

export default function DolzarbMavzularSahifasi() {
  const [fon, fonTanla] = useFon()

  return (
    <main data-fon={fon} className="v3 min-h-screen flex flex-col font-serif">
      {/* Sarlavha */}
      <header className="v3-header">
        <div className="v3-konteyner flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:border-[var(--v3-chiziq-2)] transition"
              title="Bosh sahifa"
            >
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[var(--v3-matn)]">
                Dolzarb mavzular
              </h1>
              <div className="text-xs v3-xira">
                Kimyoviy savol-javoblar, o&apos;quv muhokamalari va ilmiy forum
              </div>
            </div>
          </div>

          <FonTanlagich fon={fon} tanla={fonTanla} />
        </div>
      </header>

      {/* Muhokama lentasi */}
      <div className="v3-konteyner py-6 max-w-4xl mx-auto flex-1 w-full space-y-4">
        <div className="p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-xs v3-xira">
          Bu yerda o&apos;quvchilar, talabalar va o&apos;qituvchilar kimyo bo&apos;yicha savol berishlari, tajriba va metodikalar ulashishlari mumkin.
        </div>
        <Muhokama />
      </div>
    </main>
  )
}
