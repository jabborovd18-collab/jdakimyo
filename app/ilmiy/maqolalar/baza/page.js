"use client"

import Link from "next/link"
import { Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { sana } from "@/lib/sana"
import { useMaqolalar } from "@/lib/use-maqola-stat"

/**
 * Umumiy maqolalar bazasi — qidiruv va kalit so'z filtri.
 *
 * Ikki tuzatish:
 *  • Ko'rish/yuklash sonlari bazadan keladi (avval JSON'dagi qotib qolgan
 *    raqam edi), fayl yuklab olinsa sanoqchi oshadi.
 *  • URL'dagi ?q= va ?kalit= o'qiladi. Bosh sahifadagi qidiruv va "Mashhur
 *    mavzular" havolalari shu parametrlarni yuborardi, lekin bu sahifa
 *    ularni e'tiborsiz qoldirib har safar to'liq ro'yxatni ko'rsatardi.
 */
function Baza() {
  const params = useSearchParams()
  const { maqolalar, yuklandi, yuklashniHisobla } = useMaqolalar()

  const [qidiruv, setQidiruv] = useState(() => params.get("q") || "")
  const [selectedKalit, setSelectedKalit] = useState(() => params.get("kalit") || "")

  const barchaKalitSozlar = useMemo(
    () => [...new Set(maqolalar.flatMap((m) => m.kalitSozlar || []))].sort(),
    [maqolalar]
  )

  // Filtrni alohida state'da saqlamaymiz — hisoblab olamiz. Avval qidiruv
  // natijasi state'da turardi va ro'yxat yuklanishidan oldin yozilgan matn
  // eski ro'yxat bo'yicha filtrlanib qolardi.
  const filtrlangan = useMemo(() => {
    let natija = maqolalar

    const q = qidiruv.trim().toLowerCase()
    if (q) {
      natija = natija.filter(
        (m) =>
          m.sarlavha.toLowerCase().includes(q) ||
          m.muallif.toLowerCase().includes(q) ||
          m.qisqacha.toLowerCase().includes(q) ||
          (m.kalitSozlar || []).some((k) => k.toLowerCase().includes(q))
      )
    }

    if (selectedKalit) {
      natija = natija.filter((m) => (m.kalitSozlar || []).includes(selectedKalit))
    }

    return natija
  }, [maqolalar, qidiruv, selectedKalit])

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
          <h1 className="text-2xl font-bold text-blue-400">📚 Umumiy maqolalar bazasi</h1>
          <p className="text-purple-400 text-sm">Barcha maqolalar • Qidiruv • Kalit so'zlar bo'yicha filtr</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">

        {/* Qidiruv paneli */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-8">
          <div className="relative mb-4">
            <input
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Sarlavha, muallif yoki kalit so'z bo'yicha qidirish..."
              className="w-full px-6 py-4 pl-14 rounded-2xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-blue-400 transition-all text-lg"
              aria-label="Maqolalarni qidirish"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            {qidiruv && (
              <button
                onClick={() => setQidiruv("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors text-xl"
                aria-label="Qidiruvni tozalash"
              >
                ✕
              </button>
            )}
          </div>

          {/* Kalit so'zlar filtri */}
          <div>
            <p className="text-purple-400 text-xs mb-3">Kalit so'zlar bo'yicha filtr:</p>
            <div className="flex flex-wrap gap-2">
              {barchaKalitSozlar.map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedKalit(k === selectedKalit ? "" : k)}
                  aria-pressed={selectedKalit === k}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    selectedKalit === k
                      ? "bg-blue-500/30 text-blue-300 border-blue-400"
                      : "bg-purple-800/30 text-purple-300 border-purple-600/30 hover:border-blue-400/50"
                  }`}
                >
                  #{k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Natijalar soni */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <p className="text-purple-300">
            <span className="text-white font-bold">{filtrlangan.length}</span> ta maqola topildi
            {(qidiruv || selectedKalit) && (
              <span className="text-purple-400"> (jami {maqolalar.length} tadan)</span>
            )}
          </p>
          {(qidiruv || selectedKalit) && (
            <button
              onClick={() => { setQidiruv(""); setSelectedKalit("") }}
              className="text-sm text-purple-400 hover:text-white transition-colors"
            >
              ✕ Filtrlarni tozalash
            </button>
          )}
        </div>

        {/* Maqolalar ro'yxati */}
        {filtrlangan.length === 0 ? (
          <div className="text-center py-20 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">Hech narsa topilmadi</h3>
            <p className="text-purple-300">Qidiruv so'zini o'zgartirib ko'ring yoki filtrlarni tozalang</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filtrlangan.map((m) => (
              <div key={m.id} className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-blue-400/50 transition-all">

                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-purple-400 text-sm">{sana(m.sana)}</span>
                  <span className="text-purple-600">•</span>
                  <span className="text-purple-400 text-sm">👁️ {m.korishlar} ko'rish</span>
                  <span className="text-purple-600">•</span>
                  <span className="text-purple-400 text-sm">📥 {m.yuklashlar} yuklash</span>
                  {!yuklandi && <span className="text-purple-600 text-xs">yangilanmoqda…</span>}
                </div>

                {/* Sarlavha endi maqola sahifasiga olib boradi — avval
                    hover rangi bor edi-yu, havola yo'q edi */}
                <Link href={`/ilmiy/maqolalar/${m.id}`}>
                  <h3 className="text-xl font-bold text-white mb-3 hover:text-blue-400 transition-colors">
                    {m.sarlavha}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {m.muallif.charAt(0)}
                  </div>
                  <span className="text-purple-300 font-semibold">{m.muallif}</span>
                </div>

                <p className="text-purple-200 text-sm mb-4 leading-relaxed">{m.qisqacha}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(m.kalitSozlar || []).map((k, j) => (
                    <button
                      key={k}
                      onClick={() => setSelectedKalit(k === selectedKalit ? "" : k)}
                      className={`text-xs px-2 py-0.5 rounded-full border transition-all hover:brightness-125 ${kalitRanglar[j % kalitRanglar.length]}`}
                    >
                      #{k}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  <Link
                    href={`/ilmiy/maqolalar/${m.id}`}
                    className="px-5 py-2.5 bg-purple-800/50 border border-purple-600/50 rounded-xl text-purple-200 font-semibold hover:bg-purple-700/60 transition-all"
                  >
                    💬 Ochish va muhokama
                  </Link>
                  <a
                    href={m.fayl}
                    download
                    onClick={() => yuklashniHisobla(m.id)}
                    className="px-5 py-2.5 bg-blue-600/30 border border-blue-500/30 rounded-xl text-blue-400 font-semibold hover:bg-blue-600/50 transition-all"
                  >
                    📥 Yuklab olish
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Pastki navigatsiya */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/ilmiy/maqolalar/yangi" className="px-6 py-3 border-2 border-green-500 rounded-xl text-green-400 font-semibold hover:bg-green-500/10 transition-all">
            🆕 Yangi maqolalar
          </Link>
          <Link href="/ilmiy/maqolalar/yaratish" className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-black font-bold hover:from-yellow-400 hover:to-orange-400 transition-all">
            ✍️ Maqola yaratish
          </Link>
        </div>

      </section>
    </main>
  )
}

/**
 * useSearchParams (?q=, ?kalit=) Suspense chegarasini talab qiladi —
 * aks holda Next 16 sahifani oldindan render qilganda build to'xtaydi.
 */
export default function MaqolalarBazasi() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-purple-300 mt-4">Maqolalar yuklanmoqda...</p>
          </div>
        </main>
      }
    >
      <Baza />
    </Suspense>
  )
}
