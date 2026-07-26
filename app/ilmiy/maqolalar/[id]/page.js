"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import Muhokama from "@/components/Muhokama"
import { sana } from "@/lib/sana"
import { maqolaTop } from "@/lib/maqolalar"
import { useMaqolaKorish } from "@/lib/use-maqola-stat"

/**
 * Maqolaning alohida sahifasi.
 *
 * Avval maqolalar faqat ro'yxatda ko'rinardi — alohida sahifasi yo'q edi,
 * shuning uchun muhokamani biriktirish uchun joy ham yo'q edi.
 *
 * Ma'lumot lib/maqolalar.js dan keladi (import, ya'ni darhol), ko'rish va
 * yuklash sonlari esa bazadan — /api/maqolalar/stats orqali.
 */
export default function MaqolaSahifasi() {
  const { id } = useParams()
  const maqola = maqolaTop(id)

  // Sahifa ochilganda ko'rish hisoblanadi (sessiyada bir marta).
  const { stat, yuklashniHisobla } = useMaqolaKorish(maqola?.id, !!maqola)

  if (!maqola) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">📄</div>
          <h1 className="text-lg font-bold text-white mb-2">Maqola topilmadi</h1>
          <Link
            href="/ilmiy/maqolalar/baza"
            className="px-5 py-2.5 bg-purple-800/60 border border-purple-600/50 rounded-xl inline-block text-white text-sm mt-3"
          >
            Barcha maqolalar
          </Link>
        </div>
      </main>
    )
  }

  // Sanoqchilar bazadan keladi; javob kelmaguncha 0 turadi.
  const korishlar = stat?.views ?? 0
  const yuklashlar = stat?.downloads ?? 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/maqolalar/baza" className="hover:text-purple-300">Maqolalar</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Maqola */}
        <article className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 sm:p-7">
          <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-3">
            {maqola.sarlavha}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-purple-400 mb-5">
            <span>✍️ {maqola.muallif}</span>
            <span>📅 {sana(maqola.sana)}</span>
            <span>👁 {korishlar.toLocaleString("uz-UZ")} ko'rish</span>
            <span>⬇ {yuklashlar.toLocaleString("uz-UZ")} yuklash</span>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-4 mb-5">
            <h2 className="text-xs font-semibold text-yellow-400 mb-2">ANNOTATSIYA</h2>
            <p className="text-purple-200 text-sm leading-relaxed">{maqola.qisqacha}</p>
          </div>

          {Array.isArray(maqola.kalitSozlar) && maqola.kalitSozlar.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {maqola.kalitSozlar.map((k) => (
                <Link
                  key={k}
                  href={`/ilmiy/maqolalar/baza?kalit=${encodeURIComponent(k)}`}
                  className="text-[11px] px-2.5 py-1 bg-purple-800/50 border border-purple-700/50 rounded-full text-purple-300 hover:border-purple-500 hover:text-purple-200 transition-colors"
                >
                  #{k}
                </Link>
              ))}
            </div>
          )}

          {maqola.fayl && (
            <a
              href={maqola.fayl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={yuklashniHisobla}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl text-sm hover:from-yellow-400 hover:to-orange-400 transition-colors"
            >
              📄 Maqolani yuklab olish
            </a>
          )}
        </article>

        {/* Muhokama — shu maqolaga biriktirilgan */}
        <Muhokama articleId={maqola.id} compact />

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
          <Link
            href="/ilmiy/maqolalar/baza"
            className="px-6 py-3 border border-purple-600/50 rounded-xl hover:bg-purple-800/40 text-purple-300 text-center text-sm transition-colors"
          >
            ← Barcha maqolalar
          </Link>
          <Link
            href="/ilmiy/maqolalar/muhokama"
            className="px-6 py-3 bg-purple-800/60 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-white font-semibold text-center text-sm transition-colors"
          >
            💬 Umumiy muhokama →
          </Link>
        </div>
      </section>
    </main>
  )
}
