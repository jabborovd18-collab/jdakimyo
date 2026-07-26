"use client"

import Link from "next/link"
import { useMemo } from "react"
import { sana } from "@/lib/sana"
import { useMaqolalar } from "@/lib/use-maqola-stat"

/**
 * Oxirgi 7 kunda qo'shilgan maqolalar.
 *
 * Tuzatilgan joylar:
 *  • "Bugun / Kecha" belgisi ro'yxatdagi o'rin bo'yicha qo'yilardi — birinchi
 *    maqola necha kun oldin chiqqanidan qat'i nazar "Bugun" deb yozilardi.
 *    Endi belgi haqiqiy sanadan hisoblanadi.
 *  • Sarlavha va "Batafsil" tugmasi hech qayerga olib bormasdi (tugma oddiy
 *    <button> edi) — endi maqola sahifasiga havola.
 *  • Ko'rish/yuklash sonlari bazadan, yuklab olinsa sanoqchi oshadi.
 */

const KUN_MS = 24 * 60 * 60 * 1000

/** Sanani kunning boshiga keltirib, necha kun oldin bo'lganini qaytaradi. */
function kunOldin(qiymat) {
  const d = new Date(qiymat)
  if (Number.isNaN(d.getTime())) return null

  d.setHours(0, 0, 0, 0)
  const bugun = new Date()
  bugun.setHours(0, 0, 0, 0)

  return Math.round((bugun - d) / KUN_MS)
}

function sanaBelgisi(qiymat) {
  const kun = kunOldin(qiymat)
  if (kun === null) return "📅 Sana noma'lum"
  if (kun <= 0) return "🕐 Bugun"
  if (kun === 1) return "📅 Kecha"
  return `📅 ${kun} kun oldin`
}

export default function YangiMaqolalar() {
  const { maqolalar, yuklandi, yuklashniHisobla } = useMaqolalar()

  // Oxirgi 7 kun. maqolalar allaqachon yangisidan boshlab tartiblangan.
  const yangilar = useMemo(() => {
    const chegara = Date.now() - 7 * KUN_MS
    return maqolalar.filter((m) => {
      const t = new Date(m.sana).getTime()
      return !Number.isNaN(t) && t >= chegara
    })
  }, [maqolalar])

  const kalitRanglar = [
    "bg-blue-600/20 text-blue-400 border-blue-600/30",
    "bg-green-600/20 text-green-400 border-green-600/30",
    "bg-pink-600/20 text-pink-400 border-pink-600/30",
    "bg-purple-600/20 text-purple-400 border-purple-600/30",
    "bg-orange-600/20 text-orange-400 border-orange-600/30",
    "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/maqolalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Maqolalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🆕 Yangi maqolalar</h1>
          <p className="text-purple-400 text-sm">Oxirgi 7 kun ichida qo'shilgan ilmiy maqolalar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">

        {/* Header info */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center text-2xl">📅</div>
            <div>
              <p className="text-white font-bold">Oxirgi 7 kun</p>
              <p className="text-purple-400 text-sm">{sana(new Date())} gacha</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-green-400">{yangilar.length}</div>
              <div className="text-purple-400 text-xs">ta yangi maqola</div>
            </div>
          </div>
        </div>

        {/* Maqolalar ro'yxati */}
        {yangilar.length === 0 ? (
          <div className="text-center py-20 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-white mb-2">Maqolalar topilmadi</h3>
            <p className="text-purple-300">Oxirgi 7 kun ichida yangi maqolalar qo'shilmagan</p>
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              <Link href="/ilmiy/maqolalar/baza" className="px-6 py-3 border-2 border-blue-500 rounded-xl text-blue-400 font-semibold hover:bg-blue-500/10 transition-all">
                📚 Barcha maqolalar
              </Link>
              <Link href="/ilmiy/maqolalar/yaratish" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
                ✍️ Maqola qo'shish
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {yangilar.map((m) => (
              <div key={m.id} className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-green-400/50 transition-all">

                {/* Sana badge — ro'yxatdagi o'rin emas, haqiqiy sana bo'yicha */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">
                    {sanaBelgisi(m.sana)}
                  </span>
                  <span className="text-purple-400 text-sm">{sana(m.sana)}</span>
                </div>

                {/* Sarlavha */}
                <Link href={`/ilmiy/maqolalar/${m.id}`}>
                  <h3 className="text-xl font-bold text-white mb-3 hover:text-green-400 transition-colors">
                    {m.sarlavha}
                  </h3>
                </Link>

                {/* Muallif */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {m.muallif.charAt(0)}
                  </div>
                  <span className="text-purple-300 font-semibold">{m.muallif}</span>
                </div>

                {/* Qisqacha */}
                <p className="text-purple-200 text-sm mb-4 leading-relaxed">{m.qisqacha}</p>

                {/* Kalit so'zlar */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(m.kalitSozlar || []).map((k, j) => (
                    <Link
                      key={k}
                      href={`/ilmiy/maqolalar/baza?kalit=${encodeURIComponent(k)}`}
                      className={`text-xs px-2 py-0.5 rounded-full border transition-all hover:brightness-125 ${kalitRanglar[j % kalitRanglar.length]}`}
                    >
                      #{k}
                    </Link>
                  ))}
                </div>

                {/* Statistika va tugmalar */}
                <div className="flex items-center justify-between border-t border-purple-700/50 pt-4 gap-4 flex-wrap">
                  <div className="flex items-center gap-4 text-sm text-purple-400">
                    <span>👁️ {m.korishlar}</span>
                    <span>📥 {m.yuklashlar}</span>
                    {!yuklandi && <span className="text-purple-600 text-xs">yangilanmoqda…</span>}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <a
                      href={m.fayl}
                      download
                      onClick={() => yuklashniHisobla(m.id)}
                      className="px-4 py-2 bg-green-600/30 border border-green-500/30 rounded-xl text-green-400 text-sm font-semibold hover:bg-green-600/50 transition-all"
                    >
                      📥 Yuklab olish
                    </a>
                    <Link
                      href={`/ilmiy/maqolalar/${m.id}`}
                      className="px-4 py-2 bg-purple-600/30 border border-purple-500/30 rounded-xl text-purple-300 text-sm font-semibold hover:bg-purple-600/50 transition-all"
                    >
                      👁️ Batafsil
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Pastki navigatsiya */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/ilmiy/maqolalar/baza" className="px-6 py-3 border-2 border-blue-500 rounded-xl text-blue-400 font-semibold hover:bg-blue-500/10 transition-all">
            📚 Umumiy baza
          </Link>
          <Link href="/ilmiy/maqolalar/yaratish" className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-black font-bold hover:from-yellow-400 hover:to-orange-400 transition-all">
            ✍️ Maqola yaratish
          </Link>
        </div>

      </section>
    </main>
  )
}
