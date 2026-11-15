"use client"

import Link from "next/link"
import Muhokama from "@/components/Muhokama"
import Ikon from "@/components/Ikon"
import { useFon } from "@/components/FonTanlagich"

export default function DolzarbMavzularSahifasi() {
  const [fon] = useFon()

  return (
    <main data-fon={fon} className="v3 min-h-screen flex flex-col font-serif overflow-x-hidden">
      {/* Sarlavha */}
      <header className="v3-header">
        <div className="v3-konteyner flex items-center justify-between gap-2.5 sm:gap-3 py-2.5 sm:py-3.5">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <Link
              href="/"
              className="w-10 h-10 flex items-center justify-center shrink-0 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:border-[var(--v3-chiziq-2)] text-[var(--v3-matn)] transition"
              title="Bosh sahifa"
              aria-label="Bosh sahifa"
            >
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-bold text-[var(--v3-matn)] truncate">
                Dolzarb mavzular
              </h1>
              <div className="text-[11px] sm:text-xs v3-xira truncate">
                Kimyoviy savol-javoblar, o&apos;quv muhokamalari va ilmiy forum
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Muhokama lentasi */}
      <div className="v3-konteyner py-4 sm:py-6 max-w-4xl mx-auto flex-1 w-full space-y-3 sm:space-y-4">
        <div className="px-3.5 py-2.5 sm:p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-xs v3-xira leading-relaxed">
          Bu yerda o&apos;quvchilar, talabalar va o&apos;qituvchilar kimyo bo&apos;yicha savol berishlari, tajriba va metodikalar ulashishlari mumkin.
        </div>
        <Muhokama />
      </div>
    </main>
  )
}
