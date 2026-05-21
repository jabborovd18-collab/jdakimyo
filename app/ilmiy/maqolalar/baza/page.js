"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function MaqolalarBazasi() {
  const [barchaMaqolalar, setBarchaMaqolalar] = useState([])
  const [filteredMaqolalar, setFilteredMaqolalar] = useState([])
  const [loading, setLoading] = useState(true)
  const [qidiruv, setQidiruv] = useState("")
  const [selectedKalit, setSelectedKalit] = useState("")

  useEffect(() => {
    fetch("/data/maqolalar.json")
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => new Date(b.sana) - new Date(a.sana))
        setBarchaMaqolalar(sorted)
        setFilteredMaqolalar(sorted)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Barcha unikal kalit so'zlarni yig'ish
  const barchaKalitSozlar = [...new Set(barchaMaqolalar.flatMap(m => m.kalitSozlar))].sort()

  // Qidiruv funksiyasi
  const handleQidiruv = (value) => {
    setQidiruv(value)
    filterMaqolalar(value, selectedKalit)
  }

  // Kalit so'z filtri
  const handleKalitFilter = (kalit) => {
    const newKalit = kalit === selectedKalit ? "" : kalit
    setSelectedKalit(newKalit)
    filterMaqolalar(qidiruv, newKalit)
  }

  const filterMaqolalar = (q, k) => {
    let filtered = barchaMaqolalar

    if (q) {
      const lowerQ = q.toLowerCase()
      filtered = filtered.filter(m => 
        m.sarlavha.toLowerCase().includes(lowerQ) ||
        m.muallif.toLowerCase().includes(lowerQ) ||
        m.qisqacha.toLowerCase().includes(lowerQ) ||
        m.kalitSozlar.some(k => k.toLowerCase().includes(lowerQ))
      )
    }

    if (k) {
      filtered = filtered.filter(m => m.kalitSozlar.includes(k))
    }

    setFilteredMaqolalar(filtered)
  }

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
          <h1 className="text-2xl font-bold text-blue-400">📚 Umumiy maqolalar bazasi</h1>
          <p className="text-purple-400 text-sm">Barcha maqolalar • Qidiruv • Kalit so'zlar bo'yicha filtr</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Qidiruv paneli */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-8">
          {/* Qidiruv input */}
          <div className="relative mb-4">
            <input 
              type="text"
              value={qidiruv}
              onChange={(e) => handleQidiruv(e.target.value)}
              placeholder="Sarlavha, muallif yoki kalit so'z bo'yicha qidirish..."
              className="w-full px-6 py-4 pl-14 rounded-2xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-blue-400 transition-all text-lg"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            {qidiruv && (
              <button 
                onClick={() => handleQidiruv("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            )}
          </div>

          {/* Kalit so'zlar filtri */}
          <div>
            <p className="text-purple-400 text-xs mb-3">Kalit so'zlar bo'yicha filtr:</p>
            <div className="flex flex-wrap gap-2">
              {barchaKalitSozlar.map((k, i) => (
                <button
                  key={i}
                  onClick={() => handleKalitFilter(k)}
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
        <div className="flex items-center justify-between mb-6">
          <p className="text-purple-300">
            <span className="text-white font-bold">{filteredMaqolalar.length}</span> ta maqola topildi
            {(qidiruv || selectedKalit) && (
              <span className="text-purple-400"> (jami {barchaMaqolalar.length} tadan)</span>
            )}
          </p>
        </div>

        {/* Maqolalar ro'yxati */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-purple-300 mt-4">Maqolalar yuklanmoqda...</p>
          </div>
        ) : filteredMaqolalar.length === 0 ? (
          <div className="text-center py-20 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">Hech narsa topilmadi</h3>
            <p className="text-purple-300">Qidiruv so'zini o'zgartirib ko'ring yoki filtrlarni tozalang</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredMaqolalar.map((m) => (
              <div key={m.id} className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-blue-400/50 transition-all">
                
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-purple-400 text-sm">{formatDate(m.sana)}</span>
                  <span className="text-purple-600">•</span>
                  <span className="text-purple-400 text-sm">👁️ {m.korishlar} ko'rish</span>
                  <span className="text-purple-600">•</span>
                  <span className="text-purple-400 text-sm">📥 {m.yuklashlar} yuklash</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 hover:text-blue-400 transition-colors">
                  {m.sarlavha}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {m.muallif.charAt(0)}
                  </div>
                  <span className="text-purple-300 font-semibold">{m.muallif}</span>
                </div>

                <p className="text-purple-200 text-sm mb-4 leading-relaxed">{m.qisqacha}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {m.kalitSozlar.map((k, j) => (
                    <span key={j} className={`text-xs px-2 py-0.5 rounded-full border ${kalitRanglar[j % kalitRanglar.length]}`}>
                      #{k}
                    </span>
                  ))}
                </div>

                <div className="flex justify-end">
                  <a 
                    href={m.fayl} 
                    download
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
        <div className="mt-10 flex justify-center gap-4">
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