// app/kanallar/[slug]/page.js
"use client"
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { qachon } from '@/lib/sana'

/** YouTube havolasidan ko'mish uchun id */
function youtubeId(url) {
  const m = String(url || '').match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  )
  return m ? m[1] : null
}

export default function KanalSahifasi() {
  const params = useParams()
  const [malumot, setMalumot] = useState(null)
  const [tab, setTab] = useState('lenta')
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xato, setXato] = useState('')
  const [ishlamoqda, setIshlamoqda] = useState(false)

  const yukla = useCallback(async () => {
    try {
      const res = await fetch(`/api/kanallar/${params.slug}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Kanal ochilmadi')
      setMalumot(data)
      setXato('')
    } catch (e) {
      setXato(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [params.slug])

  useEffect(() => { yukla() }, [yukla])

  const obuna = async () => {
    setIshlamoqda(true)
    try {
      const res = await fetch(`/api/kanallar/${params.slug}/obuna`, {
        method: malumot.obunaman ? 'DELETE' : 'POST',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMalumot((m) => ({
        ...m,
        obunaman: data.obunaman,
        kanal: { ...m.kanal, obunachilar: data.obunachilar },
      }))
      toast.success(data.obunaman ? '✓ Obuna bo\'ldingiz' : 'Obuna bekor qilindi')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIshlamoqda(false)
    }
  }

  if (yuklanmoqda) {
    return <Sahifa><div className="text-center py-20 text-purple-300">⏳ Yuklanmoqda...</div></Sahifa>
  }

  if (xato || !malumot) {
    return (
      <Sahifa>
        <div className="max-w-md mx-auto text-center bg-red-900/20 border border-red-700/50 rounded-2xl p-8 mt-10">
          <div className="text-5xl mb-3">📭</div>
          <h1 className="text-xl font-bold text-red-400 mb-2">Kanal ochilmadi</h1>
          <p className="text-sm text-purple-300 mb-5">{xato}</p>
          <div className="flex gap-2 justify-center">
            <button onClick={yukla} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
              🔄 Qayta urinish
            </button>
            <Link href="/kanallar" className="px-5 py-2.5 rounded-xl bg-purple-800/50 border border-purple-600/50 font-semibold">
              ← Kanallar
            </Link>
          </div>
        </div>
      </Sahifa>
    )
  }

  const { kanal, postlar, videolar, obunaman, ozimniki } = malumot

  return (
    <Sahifa>
      {/* Banner va sarlavha */}
      <div className="rounded-2xl overflow-hidden border border-purple-800/50 bg-slate-900/50">
        {kanal.banner ? (
          <img src={kanal.banner} alt="" className="w-full h-36 md:h-48 object-cover" />
        ) : (
          <div className="w-full h-24 bg-gradient-to-r from-purple-800/40 to-blue-800/40" />
        )}

        <div className="p-5 md:p-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl font-bold text-black overflow-hidden -mt-12 border-4 border-slate-900">
              {kanal.avatar ? (
                <img src={kanal.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                kanal.nom.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1 min-w-[200px]">
              <h1 className="text-2xl font-bold">{kanal.nom}</h1>
              <div className="text-sm text-purple-300 mt-0.5">
                <Link href={`/profil/${kanal.ega?.userId}`} className="hover:text-yellow-400">
                  {kanal.ega?.fullName || kanal.ega?.username}
                </Link>
                {' · '}
                {kanal.obunachilar} obunachi
                {!kanal.ochiq && ' · 🔒 yopiq kanal'}
              </div>
            </div>

            {ozimniki ? (
              <Link
                href="/hamkorlar"
                className="px-5 py-2.5 rounded-xl bg-cyan-700/70 hover:bg-cyan-600 text-white font-bold text-sm"
              >
                ⚙️ Kanalni boshqarish
              </Link>
            ) : (
              <button
                onClick={obuna}
                disabled={ishlamoqda}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 ${
                  obunaman
                    ? 'bg-slate-800 text-purple-300 border border-purple-700/50'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                }`}
              >
                {ishlamoqda ? '...' : obunaman ? '✓ Obunasiz' : 'Obuna bo\'lish'}
              </button>
            )}
          </div>

          {kanal.tavsif && (
            <p className="text-sm text-purple-200/85 mt-4 leading-relaxed whitespace-pre-line">
              {kanal.tavsif}
            </p>
          )}
        </div>
      </div>

      {/* Tablar */}
      <div className="flex gap-2 mt-6">
        {[
          { id: 'lenta', nom: `📝 Lenta (${postlar.length})` },
          { id: 'videolar', nom: `🎬 Video darsliklar (${videolar.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm ${
              tab === t.id
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                : 'bg-slate-900/60 border border-purple-800/50 text-purple-200'
            }`}
          >
            {t.nom}
          </button>
        ))}
      </div>

      {tab === 'lenta' && (
        <div className="space-y-4 mt-5">
          {postlar.length === 0 ? (
            <Bosh icon="📝" matn="Kanalda hali post yo'q" />
          ) : (
            postlar.map((p) => (
              <article key={p.id} className="rounded-2xl border border-purple-800/50 bg-slate-900/50 overflow-hidden">
                {p.rasm && <img src={p.rasm} alt="" className="w-full max-h-96 object-cover" />}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-bold text-white">{p.sarlavha}</h2>
                    {!p.nashr && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-600/20 text-orange-300 border border-orange-600/40 flex-shrink-0">
                        qoralama
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-purple-100/90 mt-2 leading-relaxed whitespace-pre-line">
                    {p.matn}
                  </p>
                  <div className="text-[11px] text-purple-500 mt-3">{qachon(p.createdAt)}</div>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {tab === 'videolar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {videolar.length === 0 ? (
            <div className="md:col-span-2"><Bosh icon="🎬" matn="Video darslik hali qo'shilmagan" /></div>
          ) : (
            videolar.map((v) => {
              const yt = youtubeId(v.videoUrl)
              return (
                <div key={v.id} className="rounded-2xl border border-purple-800/50 bg-slate-900/50 overflow-hidden">
                  {yt ? (
                    <div className="aspect-video bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${yt}`}
                        title={v.sarlavha}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  ) : v.thumbnail ? (
                    <img src={v.thumbnail} alt="" className="w-full aspect-video object-cover" />
                  ) : null}

                  <div className="p-4">
                    <h3 className="font-bold text-white text-sm">{v.sarlavha}</h3>
                    {v.tavsif && (
                      <p className="text-[12px] text-purple-300/85 mt-1 leading-relaxed">{v.tavsif}</p>
                    )}
                    {!yt && (
                      <a
                        href={v.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 px-4 py-2 rounded-lg bg-purple-800/60 border border-purple-600/50 text-xs font-semibold"
                      >
                        ▶️ Videoni ochish
                      </a>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </Sahifa>
  )
}

function Sahifa({ children }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      <header className="border-b border-purple-800/50 bg-purple-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/kanallar" className="text-purple-400 hover:text-purple-200 text-sm">← Kanallar</Link>
          <span className="h-6 w-px bg-purple-800" />
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            JDA KIMYO
          </Link>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-6">{children}</div>
    </main>
  )
}

function Bosh({ icon, matn }) {
  return (
    <div className="text-center py-14 bg-slate-900/40 border border-purple-800/50 rounded-2xl">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-sm text-purple-300">{matn}</p>
    </div>
  )
}
