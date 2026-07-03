// app/birikmalar/page.js
"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function BirikmalarPage() {
  const [compounds, setCompounds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [geometryFilter, setGeometryFilter] = useState('all')

  useEffect(() => {
    fetchCompounds()
  }, [search, categoryFilter, geometryFilter])

  const fetchCompounds = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        category: categoryFilter,
        geometry: geometryFilter
      })
      const res = await fetch(`/api/compounds?${params}`)
      const data = await res.json()
      if (res.ok) setCompounds(data.compounds)
    } catch (err) {
      console.error('Xatolik:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Kategoriya badge rangi
  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Kation': return 'bg-blue-600/20 text-blue-400 border-blue-600/30'
      case 'Anion': return 'bg-red-600/20 text-red-400 border-red-600/30'
      case 'Neytral': return 'bg-green-600/20 text-green-400 border-green-600/30'
      default: return 'bg-purple-600/20 text-purple-400 border-purple-600/30'
    }
  }

  // Geometriya icon
  const getGeometryIcon = (geo) => {
    switch (geo) {
      case 'Oktaedr': return '🔷'
      case 'Tetraedr': return '🔺'
      case 'Kvadrat tekislik': return '⬜'
      case 'Chiziqli': return '➖'
      default: return '⚪'
    }
  }

  // Koordinatsion son badge
  const getCoordinationColor = (num) => {
    if (num === 2) return 'text-cyan-400'
    if (num === 4) return 'text-yellow-400'
    if (num === 6) return 'text-purple-400'
    return 'text-gray-400'
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 bg-purple-950/80 backdrop-blur-md sticky top-0 z-40">
        <Link href="/" className="text-purple-400 hover:text-purple-300 transition-all text-lg flex items-center gap-2">
          <span>←</span>
          <span>Orqaga</span>
        </Link>
        <div className="h-8 w-px bg-purple-800"></div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            🧪 Kompleks Birikmalar
          </h1>
          <p className="text-purple-400 text-sm">
            Koordinatsion kimyo asoslari • Boshlang'ich daraja
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Koordinatsion birikmalar olamiga xush kelibsiz!
            </h2>
            <p className="text-purple-200 mb-6 max-w-3xl leading-relaxed">
              Bu sahifada siz <strong className="text-yellow-400">kompleks birikmalar</strong>ning asosiy xususiyatlari bilan tanishasiz. 
              Har bir birikma uchun <span className="text-cyan-400">formula</span>, <span className="text-green-400">nomi</span>, 
              <span className="text-pink-400">geometriyasi</span> va <span className="text-orange-400">koordinatsion soni</span> ko'rsatilgan.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                <div className="text-3xl mb-2">🔷</div>
                <div className="text-sm text-purple-300">Oktaedr</div>
                <div className="text-xs text-purple-500 mt-1">K.S = 6</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                <div className="text-3xl mb-2">🔺</div>
                <div className="text-sm text-purple-300">Tetraedr</div>
                <div className="text-xs text-purple-500 mt-1">K.S = 4</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                <div className="text-3xl mb-2">⬜</div>
                <div className="text-sm text-purple-300">Kvadrat tekislik</div>
                <div className="text-xs text-purple-500 mt-1">K.S = 4</div>
              </div>
              <div className="bg-purple-950/50 rounded-xl p-4 text-center border border-purple-700/30">
                <div className="text-3xl mb-2">➖</div>
                <div className="text-sm text-purple-300">Chiziqli</div>
                <div className="text-xs text-purple-500 mt-1">K.S = 2</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Qidiruv */}
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 Formula, nomi yoki markaziy atom bo'yicha qidirish..."
                className="w-full px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white placeholder-purple-500 focus:border-yellow-500 outline-none transition-all"
              />
            </div>

            {/* Kategoriya filtri */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none"
            >
              <option value="all">Barcha turlari</option>
              <option value="Kation">🔵 Kation</option>
              <option value="Anion">🔴 Anion</option>
              <option value="Neytral">🟢 Neytral</option>
            </select>

            {/* Geometriya filtri */}
            <select
              value={geometryFilter}
              onChange={(e) => setGeometryFilter(e.target.value)}
              className="px-4 py-3 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white focus:border-yellow-500 outline-none"
            >
              <option value="all">Barcha geometriyalar</option>
              <option value="Oktaedr">🔷 Oktaedr</option>
              <option value="Tetraedr">🔺 Tetraedr</option>
              <option value="Kvadrat tekislik">⬜ Kvadrat tekislik</option>
              <option value="Chiziqli">➖ Chiziqli</option>
            </select>
          </div>

          {/* Natijalar soni */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-purple-400">
              {compounds.length} ta birikma topildi
            </span>
            {(search || categoryFilter !== 'all' || geometryFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearch('')
                  setCategoryFilter('all')
                  setGeometryFilter('all')
                }}
                className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                ✕ Filtrlarni tozalash
              </button>
            )}
          </div>
        </div>

        {/* Compounds Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin text-5xl mb-4">⏳</div>
            <p className="text-purple-300">Birikmalar yuklanmoqda...</p>
          </div>
        ) : compounds.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">Birikmalar topilmadi</h3>
            <p className="text-purple-300">Qidiruv yoki filtrlarni o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compounds.map((compound) => (
              <Link
                key={compound.id}
                href={`/birikmalar/${compound.id}`}
                className="group bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-500/50 transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
              >
                {/* Formula (katta) */}
                <div className="text-center mb-4">
                  <div className="text-3xl font-mono font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">
                    {compound.formula}
                  </div>
                </div>

                {/* Nomi */}
                <div className="text-center mb-4">
                  <div className="text-sm font-semibold text-white leading-snug">
                    {compound.name}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-purple-700/30 my-4"></div>

                {/* Xususiyatlar */}
                <div className="space-y-3">
                  {/* Markaziy atom */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-400">Markaziy atom:</span>
                    <span className="text-sm font-bold text-white bg-purple-800/50 px-2 py-0.5 rounded">
                      {compound.centralAtom}
                      <sup className="text-yellow-400 ml-1">
                        {compound.oxidationState > 0 ? '+' : ''}{compound.oxidationState}
                      </sup>
                    </span>
                  </div>

                  {/* Koordinatsion son */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-400">Koordinatsion son:</span>
                    <span className={`text-sm font-bold ${getCoordinationColor(compound.coordinationNumber)}`}>
                      {compound.coordinationNumber}
                    </span>
                  </div>

                  {/* Geometriya */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-400">Geometriya:</span>
                    <span className="text-sm text-purple-200 flex items-center gap-1">
                      {getGeometryIcon(compound.geometry)}
                      {compound.geometry}
                    </span>
                  </div>

                  {/* Kategoriya */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-400">Turi:</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadge(compound.category)}`}>
                      {compound.category}
                    </span>
                  </div>

                  {/* Rang (agar bor bo'lsa) */}
                  {compound.color && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-400">Rangi:</span>
                      <span className="text-sm text-purple-200">
                        {compound.color}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-purple-700/30 flex items-center justify-between">
                  <span className="text-xs text-purple-500">Batafsil ko'rish</span>
                  <span className="text-yellow-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Qanday o'qish kerak */}
        <div className="mt-12 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📖</span>
            Qanday o'qish kerak?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Formula</div>
                  <div className="text-sm text-purple-300">
                    <code className="bg-purple-950/50 px-2 py-0.5 rounded">[Cu(NH₃)₄]SO₄</code> — 
                    Kvadrat qavs ichida <strong>ichki sfera</strong>, tashqarisida <strong>tashqi sfera</strong>.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Markaziy atom</div>
                  <div className="text-sm text-purple-300">
                    Kompleksning markazida joylashgan metall atomi (masalan, <strong>Cu</strong>, <strong>Fe</strong>, <strong>Co</strong>).
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Ligandlar</div>
                  <div className="text-sm text-purple-300">
                    Markaziy atomga bog'langan molekulalar yoki ionlar (masalan, <strong>NH₃</strong>, <strong>H₂O</strong>, <strong>Cl⁻</strong>).
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Koordinatsion son</div>
                  <div className="text-sm text-purple-300">
                    Markaziy atomga bog'langan <strong>donor atomlar soni</strong> (odatda 2, 4 yoki 6).
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Geometriya</div>
                  <div className="text-sm text-purple-300">
                    Molekulaning fazodagi shakli: <strong>oktaedr</strong>, <strong>tetraedr</strong>, <strong>kvadrat tekislik</strong>, <strong>chiziqli</strong>.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold flex-shrink-0">
                  6
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">IUPAC nomi</div>
                  <div className="text-sm text-purple-300">
                    Xalqaro qoidalar bo'yicha nomlash: ligandlar + metall + oksidlanish darajasi.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm mb-2">
            📚 <strong>Manba:</strong> A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari
          </p>
          <p className="text-purple-400 text-xs">
            © 2026 JDA KIMYO • jdakimyo.uz
          </p>
        </div>
      </section>
    </main>
  )
}