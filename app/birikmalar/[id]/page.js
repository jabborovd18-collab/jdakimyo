// app/birikmalar/[id]/page.js
"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function CompoundDetailPage() {
  const params = useParams()
  const [compound, setCompound] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params?.id) {
      fetchCompound()
    }
  }, [params?.id])

  const fetchCompound = async () => {
    try {
      const res = await fetch(`/api/compounds/${params.id}`)
      const data = await res.json()
      if (res.ok) setCompound(data.compound)
    } catch (err) {
      console.error('Xatolik:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-4">⏳</div>
          <p className="text-purple-300">Yuklanmoqda...</p>
        </div>
      </main>
    )
  }

  if (!compound) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Birikma topilmadi</h2>
          <Link
            href="/birikmalar"
            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl"
          >
            ← Birikmalarga qaytish
          </Link>
        </div>
      </main>
    )
  }

  // Kategoriya badge
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 bg-purple-950/80 backdrop-blur-md sticky top-0 z-40">
        <Link href="/birikmalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg flex items-center gap-2">
          <span>←</span>
          <span>Birikmalarga qaytish</span>
        </Link>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            {/* Formula */}
            <div className="text-center mb-6">
              <div className="text-5xl font-mono font-bold text-yellow-400 mb-4">
                {compound.formula}
              </div>
              <div className="text-xl font-semibold text-white">
                {compound.name}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${getCategoryBadge(compound.category)}`}>
                {compound.category} kompleks
              </span>
              <span className="px-4 py-2 text-sm font-semibold rounded-full border bg-purple-600/20 text-purple-400 border-purple-600/30">
                {getGeometryIcon(compound.geometry)} {compound.geometry}
              </span>
              {compound.color && (
                <span className="px-4 py-2 text-sm font-semibold rounded-full border bg-pink-600/20 text-pink-400 border-pink-600/30">
                  🎨 {compound.color}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Xususiyatlar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Markaziy atom */}
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl">
                ⚛️
              </div>
              <div>
                <div className="text-sm text-purple-400">Markaziy atom</div>
                <div className="text-xl font-bold text-white">
                  {compound.centralAtom}
                </div>
              </div>
            </div>
            <div className="bg-purple-950/50 rounded-xl p-4">
              <div className="text-sm text-purple-300 mb-2">Oksidlanish darajasi:</div>
              <div className="text-3xl font-bold text-yellow-400">
                {compound.oxidationState > 0 ? '+' : ''}{compound.oxidationState}
              </div>
            </div>
          </div>

          {/* Koordinatsion son */}
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl">
                🔢
              </div>
              <div>
                <div className="text-sm text-purple-400">Koordinatsion son</div>
                <div className="text-xl font-bold text-white">
                  {compound.coordinationNumber}
                </div>
              </div>
            </div>
            <div className="bg-purple-950/50 rounded-xl p-4">
              <div className="text-sm text-purple-300 mb-2">Geometriya:</div>
              <div className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                {getGeometryIcon(compound.geometry)}
                {compound.geometry}
              </div>
            </div>
          </div>

          {/* Ligandlar */}
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl">
                🧬
              </div>
              <div>
                <div className="text-sm text-purple-400">Ligandlar</div>
                <div className="text-xl font-bold text-white">
                  {compound.ligands}
                </div>
              </div>
            </div>
            <div className="bg-purple-950/50 rounded-xl p-4">
              <div className="text-sm text-purple-300 leading-relaxed">
                Ligandlar — markaziy atomga bog'langan molekulalar yoki ionlar. 
                Ular <strong className="text-green-400">donor atomlari</strong> orqali metall bilan bog'lanadi va <strong className="text-yellow-400">koordinatsion sonni</strong> hosil qiladi.
              </div>
            </div>
          </div>
        </div>

        {/* Tavsif */}
        {compound.description && (
          <div className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📝</span>
              Qo'shimcha ma'lumot
            </h3>
            <div className="text-purple-200 leading-relaxed">
              {compound.description}
            </div>
          </div>
        )}

        {/* Qanday nomlanadi? */}
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📖</span>
            IUPAC bo'yicha nomlash
          </h3>
          <div className="bg-purple-950/50 rounded-xl p-4 mb-4">
            <div className="text-lg font-mono text-yellow-400 text-center mb-2">
              {compound.name}
            </div>
            <div className="text-sm text-purple-300 text-center">
              <strong className="text-green-400">Ligandlar</strong> + <strong className="text-cyan-400">Metall</strong> + <strong className="text-orange-400">(Oksidlanish darajasi)</strong>
            </div>
          </div>
          <div className="text-sm text-purple-300 space-y-2">
            <p>✓ <strong>Avval ligandlar</strong> alifbo tartibida sanaladi</p>
            <p>✓ <strong>Keyin metall</strong> nomi (kation kompleksda o'zbekcha, anionda lotincha + "-at")</p>
            <p>✓ <strong>Oxidlanish darajasi</strong> rim raqami bilan qavsda ko'rsatiladi</p>
          </div>
        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <Link
            href="/birikmalar"
            className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all"
          >
            ← Barcha birikmalarga qaytish
          </Link>
        </div>
      </section>
    </main>
  )
}