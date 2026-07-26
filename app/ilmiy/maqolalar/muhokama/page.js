"use client"

import Link from "next/link"
import Muhokama from "@/components/Muhokama"

/**
 * Umumiy muhokama lentasi — dolzarb kimyoviy mavzular.
 * Maqolaga bog'liq emas: istalgan mavzu ochiladi.
 */
export default function MuhokamaLenta() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/maqolalar" className="hover:text-purple-300">Maqolalar</Link>
            <span className="text-purple-600">›</span>
            <span className="text-yellow-400 font-semibold">Muhokama</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <span>💬</span>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Dolzarb mavzular
            </span>
          </h1>
          <p className="text-purple-400 text-sm mt-1">
            Kimyoviy savol bering, tajriba ulashing, muhokama qiling
          </p>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <Muhokama />
      </section>
    </main>
  )
}
