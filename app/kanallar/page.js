// app/kanallar/page.js
"use client"
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const TURLAR = [
  { id: 'all', nom: 'Hammasi', icon: '📚' },
  { id: 'talim', nom: "Ta'lim", icon: '📚' },
  { id: 'ilmiy', nom: 'Ilmiy', icon: '🔬' },
  { id: 'amaliy', nom: 'Amaliy', icon: '🧪' },
]

export default function KanallarPage() {
  const [kanallar, setKanallar] = useState([])
  const [qidiruv, setQidiruv] = useState('')
  const [turi, setTuri] = useState('all')
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [ishlamoqda, setIshlamoqda] = useState(null)
  // Xato alohida holat: usiz yuklash yiqilganda sahifa "Kanal topilmadi"
  // deb chizardi — ya'ni nosozlikni "kanal yo'q" deb ko'rsatardi
  const [xato, setXato] = useState('')

  const yukla = useCallback(async () => {
    try {
      const p = new URLSearchParams({ qidiruv, turi })
      const res = await fetch(`/api/kanallar?${p}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Kanallar yuklanmadi')
      setKanallar(data.kanallar || [])
      setXato('')
    } catch (e) {
      setXato(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [qidiruv, turi])

  useEffect(() => {
    const kutish = setTimeout(yukla, 300)
    return () => clearTimeout(kutish)
  }, [yukla])

  const obuna = async (kanal) => {
    setIshlamoqda(kanal.id)
    try {
      const res = await fetch(`/api/kanallar/${kanal.slug}/obuna`, {
        method: kanal.obunaman ? 'DELETE' : 'POST',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setKanallar((oldin) =>
        oldin.map((k) =>
          k.id === kanal.id ? { ...k, obunaman: data.obunaman, obunachilar: data.obunachilar } : k,
        ),
      )
      toast.success(data.obunaman ? '✓ Obuna bo\'ldingiz' : 'Obuna bekor qilindi')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIshlamoqda(null)
    }
  }

  const tavsiya = kanallar.filter((k) => k.tavsiyada)
  const qolgan = kanallar.filter((k) => !k.tavsiyada)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      <header className="border-b border-purple-800/50 bg-purple-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            JDA KIMYO
          </Link>
          <span className="h-6 w-px bg-purple-800" />
          <span className="text-purple-300">📢 Kanallar</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Kanallar</h1>
          <p className="text-purple-300 text-sm mt-1 max-w-2xl">
            Hamkorlarimiz kanallari: e'lonlar, video darsliklar va materiallar.
            Obuna bo'lsangiz yangi post chiqqanda bildirishnoma olasiz.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <input
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            placeholder="🔍 Kanal nomi bo'yicha qidirish"
            className="flex-1 min-w-[240px] px-4 py-2.5 bg-slate-900/60 border border-purple-800/50 rounded-xl text-white placeholder-purple-500 outline-none focus:border-yellow-500"
          />
          <div className="flex gap-2">
            {TURLAR.map((t) => (
              <button
                key={t.id}
                onClick={() => setTuri(t.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border ${
                  turi === t.id
                    ? 'bg-yellow-500 text-black border-yellow-400'
                    : 'bg-slate-900/60 border-purple-800/50 text-purple-200'
                }`}
              >
                {t.icon} {t.nom}
              </button>
            ))}
          </div>
        </div>

        {yuklanmoqda ? (
          <div className="text-center py-16 text-purple-300">⏳ Yuklanmoqda...</div>
        ) : xato ? (
          <div className="text-center py-14 bg-slate-900/40 border border-red-800/50 rounded-2xl">
            <div className="text-5xl mb-3">⚠️</div>
            <h2 className="text-lg font-bold mb-1">Kanallar yuklanmadi</h2>
            <p className="text-sm text-purple-300 mb-1">{xato}</p>
            <p className="text-xs text-purple-500 mb-5">
              Bu kanal yo'qligini bildirmaydi — ro'yxat kelmadi, xolos.
            </p>
            <button
              onClick={() => { setYuklanmoqda(true); yukla() }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm"
            >
              🔄 Qayta urinish
            </button>
          </div>
        ) : kanallar.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-purple-800/50 rounded-2xl">
            <div className="text-5xl mb-3">📭</div>
            <h2 className="text-lg font-bold mb-1">Kanal topilmadi</h2>
            <p className="text-sm text-purple-300">
              Hozircha ochiq kanal yo'q yoki qidiruvga mos kelmadi.
            </p>
          </div>
        ) : (
          <>
            {tavsiya.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-yellow-300 mb-3">⭐ Tavsiya etamiz</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tavsiya.map((k) => (
                    <KanalKarta key={k.id} kanal={k} onObuna={obuna} ishlamoqda={ishlamoqda === k.id} katta />
                  ))}
                </div>
              </div>
            )}

            {qolgan.length > 0 && (
              <div>
                {tavsiya.length > 0 && (
                  <h2 className="text-sm font-bold text-purple-300 mb-3 mt-6">Barcha kanallar</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {qolgan.map((k) => (
                    <KanalKarta key={k.id} kanal={k} onObuna={obuna} ishlamoqda={ishlamoqda === k.id} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

function KanalKarta({ kanal, onObuna, ishlamoqda, katta }) {
  return (
    <div
      className={`rounded-2xl border overflow-hidden bg-slate-900/50 ${
        katta ? 'border-yellow-600/40' : 'border-purple-800/50'
      }`}
    >
      {kanal.banner && (
        <img src={kanal.banner} alt="" className="w-full h-24 object-cover" />
      )}
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl font-bold text-black flex-shrink-0 overflow-hidden">
            {kanal.avatar ? (
              <img src={kanal.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              kanal.nom.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Link href={`/kanallar/${kanal.slug}`} className="font-bold text-white hover:text-yellow-400">
              {kanal.nom}
            </Link>
            <div className="text-[11px] text-purple-400 mt-0.5">
              {kanal.ega?.fullName || kanal.ega?.username} · {kanal.obunachilar} obunachi
            </div>
          </div>
        </div>

        {kanal.tavsif && (
          <p className="text-[13px] text-purple-200/80 mt-3 leading-relaxed line-clamp-3">
            {kanal.tavsif}
          </p>
        )}

        <div className="flex items-center gap-3 mt-3 text-[11px] text-purple-400">
          <span>📝 {kanal.postSoni} post</span>
          <span>🎬 {kanal.videoSoni} video</span>
        </div>

        <div className="flex gap-2 mt-4">
          <Link
            href={`/kanallar/${kanal.slug}`}
            className="flex-1 text-center py-2 rounded-xl bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 text-sm font-semibold"
          >
            Ochish
          </Link>
          <button
            onClick={() => onObuna(kanal)}
            disabled={ishlamoqda}
            className={`flex-1 py-2 rounded-xl text-sm font-bold disabled:opacity-50 ${
              kanal.obunaman
                ? 'bg-slate-800 text-purple-300 border border-purple-700/50'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
            }`}
          >
            {ishlamoqda ? '...' : kanal.obunaman ? '✓ Obuna' : 'Obuna bo\'lish'}
          </button>
        </div>
      </div>
    </div>
  )
}
