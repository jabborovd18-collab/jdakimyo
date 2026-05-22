"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function Home() {
  const [qidiruv, setQidiruv] = useState("")
  const [barchaMalumotlar, setBarchaMalumotlar] = useState([])
  const [natijalar, setNatijalar] = useState([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetch("/data/search-index.json")
      .then(res => res.json())
      .then(data => setBarchaMalumotlar(data))
      .catch(() => setBarchaMalumotlar([]))
  }, [])

  const handleQidiruv = (value) => {
    setQidiruv(value)
    if (value.length < 2) {
      setNatijalar([])
      setShowResults(false)
      return
    }
    const q = value.toLowerCase()
    const filtered = barchaMalumotlar.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.desc.toLowerCase().includes(q) ||
      (m.keys && m.keys.toLowerCase().includes(q))
    )
    setNatijalar(filtered.slice(0, 10))
    setShowResults(true)
  }

  const typeLabels = {
    birikma: "Birikma", maqola: "Maqola", tahlil: "Tahlil usuli",
    chuqur: "Chuqur mavzu", oquv: "O'quv bo'limi", umumiy: "Umumiy"
  }
  const typeColors = {
    birikma: "bg-red-600/20 text-red-400 border-red-600/30",
    maqola: "bg-green-600/20 text-green-400 border-green-600/30",
    tahlil: "bg-purple-600/20 text-purple-400 border-purple-600/30",
    chuqur: "bg-orange-600/20 text-orange-400 border-orange-600/30",
    oquv: "bg-blue-600/20 text-blue-400 border-blue-600/30",
    umumiy: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
  }
  const rangMap = {
    birikma: "text-red-400", maqola: "text-green-400", tahlil: "text-purple-400",
    chuqur: "text-orange-400", oquv: "text-blue-400", umumiy: "text-yellow-400"
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex justify-between items-center px-6 py-4 border-b border-purple-800/50">
        <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          JDA KIMYO
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/hamkorlik/boglanish" className="p-2 hover:bg-purple-800/50 rounded-full transition-all" title="Bog'lanish">📞</Link>
          <Link href="/hamkorlik/yangiliklar" className="p-2 hover:bg-purple-800/50 rounded-full transition-all" title="Yangiliklar">🔔</Link>
          <Link href="/sertifikat" className="p-2 hover:bg-purple-800/50 rounded-full transition-all" title="Sertifikat">🏅</Link>
          <Link href="/hamkorlik" className="p-2 hover:bg-purple-800/50 rounded-full transition-all" title="Hamkorlik">🤝</Link>
        </div>
      </header>

      <section className="flex flex-col items-center justify-center text-center px-4 py-16 relative">
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
          JDA KIMYO
        </h1>
        
        <p className="text-lg md:text-xl text-purple-200 max-w-2xl mb-10">
          Kompleks birikmalar bo'yicha o'zbek tilidagi o'rganishni osonlashtiradigan platforma
        </p>
        
        <div className="w-full max-w-2xl relative z-20">
          <div className="relative">
            <input type="text" value={qidiruv} onChange={(e) => handleQidiruv(e.target.value)}
              placeholder="Birikma, maqola, tahlil usuli yoki mavzu qidiring..."
              className="w-full px-6 py-5 pl-16 rounded-2xl bg-purple-900/70 border-2 border-purple-600 text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400 transition-all text-lg shadow-2xl shadow-purple-900/50"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl">🔍</span>
            {qidiruv && (
              <button onClick={() => { setQidiruv(""); setNatijalar([]); setShowResults(false) }}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors text-2xl">✕</button>
            )}
          </div>

          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-purple-900/95 border border-purple-700/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
              {natijalar.length === 0 ? (
                <div className="p-6 text-center text-purple-400">Hech narsa topilmadi</div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {natijalar.map((n, i) => (
                    <Link key={i} href={n.href}
                      className="flex items-center gap-4 p-4 hover:bg-purple-800/50 transition-all border-b border-purple-800/30 last:border-none"
                      onClick={() => { setQidiruv(""); setShowResults(false) }}>
                      <span className={`text-lg font-bold ${rangMap[n.type] || "text-white"} flex-shrink-0 w-8 text-center`}>
                        {n.type === "birikma" ? "🧪" : n.type === "maqola" ? "📄" : n.type === "tahlil" ? "📊" : n.type === "chuqur" ? "🔬" : n.type === "oquv" ? "📖" : "📌"}
                      </span>
                      <div className="flex-1 text-left">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[n.type] || ""}`}>{typeLabels[n.type] || n.type}</span>
                        <p className="font-bold text-white mt-1">{n.title}</p>
                        <p className="text-purple-400 text-sm">{n.desc}</p>
                      </div>
                      <span className="text-purple-500">→</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-purple-400 text-sm mt-4">
          Masalan: "qizil qon tuzi", "sisplatin", "UB-Vis", "Yan-Teller" deb qidirib ko'ring
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full mt-12">
          {[
            { href: "/oquv", icon: "📚", title: "O'quv", desc: "Kompleks birikmalarni o'rganish" },
            { href: "/ilmiy", icon: "🔬", title: "Ilmiy", desc: "Ilmiy tadqiqotlar uchun" },
            { href: "/sertifikat", icon: "🏅", title: "Sertifikat", desc: "O'rganish darajasiga qarab" },
            { href: "/hamkorlik", icon: "🤝", title: "Hamkorlik", desc: "Ilmiy tadqiqotchilar uchun" }
          ].map((item, i) => (
            <Link key={i} href={item.href}
              className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 text-center hover:bg-purple-800/60 hover:border-yellow-400/50 transition-all transform hover:-translate-y-2">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">{item.title}</h3>
              <p className="text-purple-300 text-xs">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="text-center py-10 border-t border-purple-800/50 px-4">
        <p className="text-purple-300 mb-2">Yaratuvchi</p>
        <p className="text-xl font-bold text-white mb-2">Diyorbek Jabborov Arslonivich</p>
        <a href="https://t.me/diyorbek_jabborov" target="_blank"
          className="text-yellow-400 hover:text-yellow-300 transition-all inline-flex items-center gap-2">
          <span>✈️</span> @diyorbek_jabborov
        </a>
      </footer>
      
    </main>
  )
}