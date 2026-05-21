"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function YangiMaqolalar() {
  const [maqolalar, setMaqolalar] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/data/maqolalar.json")
      .then(res => res.json())
      .then(data => {
        const bugun = new Date()
        const yettiKunOldin = new Date(bugun.getTime() - 7 * 24 * 60 * 60 * 1000)
        
        const yangilar = data.filter(m => {
          const sana = new Date(m.sana)
          return sana >= yettiKunOldin && sana <= bugun
        }).sort((a, b) => new Date(b.sana) - new Date(a.sana))
        
        setMaqolalar(yangilar)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const formatDate = (sana) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(sana).toLocaleDateString('uz-UZ', options)
  }

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
              <p className="text-purple-400 text-sm">{new Date().toLocaleDateString('uz-UZ')} gacha</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-green-400">{maqolalar.length}</div>
              <div className="text-purple-400 text-xs">ta yangi maqola</div>
            </div>
          </div>
        </div>

        {/* Maqolalar ro'yxati */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-purple-300 mt-4">Maqolalar yuklanmoqda...</p>
          </div>
        ) : maqolalar.length === 0 ? (
          <div className="text-center py-20 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-white mb-2">Maqolalar topilmadi</h3>
            <p className="text-purple-300">Oxirgi 7 kun ichida yangi maqolalar qo'shilmagan</p>
            <Link href="/ilmiy/maqolalar/yaratish" className="inline-block mt-4 px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
              ✍️ Maqola qo'shish
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {maqolalar.map((m, i) => (
              <div key={m.id} className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-green-400/50 transition-all">
                
                {/* Sana badge */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">
                    {i === 0 ? "🕐 Bugun" : i === 1 ? "📅 Kecha" : `📅 ${Math.ceil((new Date() - new Date(m.sana)) / (1000 * 60 * 60 * 24))} kun oldin`}
                  </span>
                  <span className="text-purple-400 text-sm">{formatDate(m.sana)}</span>
                </div>

                {/* Sarlavha */}
                <h3 className="text-xl font-bold text-white mb-3 hover:text-green-400 transition-colors">
                  {m.sarlavha}
                </h3>

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
                  {m.kalitSozlar.map((k, j) => (
                    <span key={j} className={`text-xs px-2 py-0.5 rounded-full border ${kalitRanglar[j % kalitRanglar.length]}`}>
                      #{k}
                    </span>
                  ))}
                </div>

                {/* Statistika va tugmalar */}
                <div className="flex items-center justify-between border-t border-purple-700/50 pt-4">
                  <div className="flex items-center gap-4 text-sm text-purple-400">
                    <span>👁️ {m.korishlar}</span>
                    <span>📥 {m.yuklashlar}</span>
                  </div>
                  <div className="flex gap-3">
                    <a 
                      href={m.fayl} 
                      download
                      className="px-4 py-2 bg-green-600/30 border border-green-500/30 rounded-xl text-green-400 text-sm font-semibold hover:bg-green-600/50 transition-all"
                    >
                      📥 Yuklab olish
                    </a>
                    <button className="px-4 py-2 bg-purple-600/30 border border-purple-500/30 rounded-xl text-purple-300 text-sm font-semibold hover:bg-purple-600/50 transition-all">
                      👁️ Batafsil
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Pastki navigatsiya */}
        <div className="mt-10 flex justify-center gap-4">
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