// app/hamkorlar/page.js
"use client"
//
// Hamkor dashboardi — kanal shu yerdan yuritiladi.
//
// Avval bu sahifa maket edi: kanal egaligi kodga yozilgan ikkita email
// bilan aniqlanardi va hamma raqam o'ylab topilgan edi. Endi hammasi
// bazadan keladi va yozilgan post haqiqatan obunachilarga boradi.
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { qachon, sana } from '@/lib/sana'

const MENU = [
  { id: 'umumiy', nom: 'Umumiy holat', icon: '📊' },
  { id: 'lenta', nom: 'Lenta', icon: '📝' },
  { id: 'videolar', nom: 'Video darsliklar', icon: '🎬' },
  { id: 'obunachilar', nom: 'Obunachilar', icon: '👥' },
  { id: 'sozlama', nom: 'Kanal sozlamalari', icon: '⚙️' },
]

export default function HamkorDashboard() {
  const { data: session, status } = useSession()
  const [bolim, setBolim] = useState('umumiy')
  const [holat, setHolat] = useState(null)
  const [xato, setXato] = useState('')
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  // Tanlangan kanal. `null` — birinchisi (server o'zi tanlaydi).
  const [kanalId, setKanalId] = useState(null)

  const yukla = useCallback(async () => {
    try {
      const res = await fetch(`/api/hamkor/kanal${kanalId ? `?kanal=${kanalId}` : ''}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setHolat(data)
      setXato('')
    } catch (e) {
      setXato(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [kanalId])

  useEffect(() => {
    if (status === 'authenticated') yukla()
    if (status === 'unauthenticated') setYuklanmoqda(false)
  }, [status, yukla])

  if (status === 'loading' || yuklanmoqda) {
    return <Xabar icon="⏳" sarlavha="Yuklanmoqda..." />
  }

  if (!session) {
    return (
      <Xabar
        icon="🔐"
        sarlavha="Kirish talab qilinadi"
        matn="Hamkor dashboardidan foydalanish uchun tizimga kiring."
        havola="/login?callbackUrl=/hamkorlar"
        tugma="Kirish"
      />
    )
  }

  if (xato || !holat?.kanal) {
    return (
      <Xabar
        icon="🤝"
        sarlavha="Sizda kanal yo'q"
        matn={xato || 'Kanal sayt administratori tomonidan ochiladi va sizga biriktiriladi.'}
        havola="/hamkorlik/jamoaga-taklif"
        tugma="Hamkorlik haqida"
      />
    )
  }

  const { kanal } = holat

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      <header className="border-b border-purple-800/50 bg-purple-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              JDA KIMYO
            </Link>
            <span className="h-6 w-px bg-purple-800" />
            <span className="text-sm text-purple-300 truncate">🤝 Hamkor paneli</span>
          </div>
          <Link
            href={`/kanallar/${kanal.slug}`}
            className="px-4 py-2 rounded-xl bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 text-sm font-semibold"
          >
            Kanalni ko'rish ↗
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Kanal sarlavhasi */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl font-bold text-black overflow-hidden">
            {kanal.avatar ? (
              <img src={kanal.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              kanal.nom.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold">{kanal.nom}</h1>
            <div className="text-xs text-purple-400">
              /kanallar/{kanal.slug} · {kanal.ochiq ? 'ochiq' : '🔒 yopiq'} ·{' '}
              {sana(kanal.createdAt)} dan beri
            </div>
          </div>

          {/* KANAL ALMASHTIRGICH — faqat bittadan ko'p kanal bo'lganda.
              Ilgari dashboard doim eng eski kanalni ochardi va
              ikkinchisiga umuman kirib bo'lmasdi. */}
          {holat.kanallar?.length > 1 && (
            <div className="ml-auto">
              <label className="block text-[11px] text-purple-400 mb-1">
                Kanal ({holat.kanallar.length} ta)
              </label>
              <select
                value={kanal.id}
                onChange={(e) => {
                  setKanalId(e.target.value)
                  setYuklanmoqda(true)
                  // Bo'lim boshiga qaytamiz: ochilgan lenta boshqa
                  // kanalniki bo'lib qolmasin
                  setBolim('umumiy')
                }}
                className="bg-purple-950/60 border border-purple-700/50 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-yellow-500"
              >
                {holat.kanallar.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nom}{k.faol ? '' : ' (to\'xtatilgan)'}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Bo'limlar */}
        <div className="flex gap-2 flex-wrap mb-6">
          {MENU.map((m) => (
            <button
              key={m.id}
              onClick={() => setBolim(m.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold ${
                bolim === m.id
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                  : 'bg-slate-900/60 border border-purple-800/50 text-purple-200'
              }`}
            >
              {m.icon} {m.nom}
            </button>
          ))}
        </div>

        {/* `key` — kanal almashganda komponent qaytadan yaratilsin:
            aks holda eski kanalning postlari ekranda qolib ketardi */}
        {bolim === 'umumiy' && <Umumiy holat={holat} onOtish={setBolim} />}
        {bolim === 'lenta' && <Lenta key={kanal.id} kanalId={kanal.id} />}
        {bolim === 'videolar' && <Videolar key={kanal.id} kanalId={kanal.id} />}
        {bolim === 'obunachilar' && <Obunachilar holat={holat} />}
        {bolim === 'sozlama' && (
          <Sozlama key={kanal.id} kanal={kanal} turlar={holat.turlar} onSaqlandi={yukla} />
        )}
      </div>
    </main>
  )
}

// ─────────────────────────────────────────────────────────────

function Umumiy({ holat, onOtish }) {
  const s = holat.statistika
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Raqam
          icon="👥"
          son={s.obunachilar}
          nom="Obunachi"
          izoh={s.haftalikOsish > 0 ? `+${s.haftalikOsish} shu hafta` : "shu hafta yangi yo'q"}
        />
        <Raqam icon="📝" son={s.postlar} nom="Post" />
        <Raqam icon="🎬" son={s.videolar} nom="Video darslik" />
        <Raqam icon="👁️" son={s.korishlar} nom="Post ko'rishlari" />
      </div>

      {s.postlar === 0 && s.videolar === 0 && (
        <div className="rounded-2xl border border-yellow-700/40 bg-yellow-950/20 p-5">
          <h3 className="font-bold text-yellow-300 mb-1">Kanal hali bo'sh</h3>
          <p className="text-sm text-yellow-100/80 leading-relaxed mb-4">
            Birinchi postni yozing yoki video darslik qo'shing. Obunachilar
            yangi post chiqqanda bildirishnoma oladi — obuna bo'lishning
            ma'nosi aynan shunda.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => onOtish('lenta')} className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-bold text-sm">
              📝 Post yozish
            </button>
            <button onClick={() => onOtish('videolar')} className="px-4 py-2 rounded-xl bg-purple-800/60 border border-purple-600/50 text-sm font-semibold">
              🎬 Video qo'shish
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold text-purple-300 mb-2">Oxirgi obunachilar</h2>
        {holat.oxirgiObunachilar.length === 0 ? (
          <div className="rounded-xl border border-purple-800/50 bg-slate-900/40 p-5 text-sm text-purple-400 text-center">
            Hali obunachi yo'q
          </div>
        ) : (
          <div className="rounded-xl border border-purple-800/50 bg-slate-900/40 divide-y divide-purple-900/50">
            {holat.oxirgiObunachilar.map((o, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <Link href={`/profil/${o.user.userId}`} className="text-sm text-white hover:text-yellow-400">
                  {o.user.fullName || o.user.username}
                </Link>
                <span className="text-[11px] text-purple-400">{qachon(o.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// `kanalId` HAR SO'ROVDA yuboriladi: hamkorda bir nechta kanal
// bo'lishi mumkin va server aks holda birinchisini oladi — post
// noto'g'ri kanalga tushib qolardi.
function Lenta({ kanalId }) {
  const [postlar, setPostlar] = useState([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [tahrir, setTahrir] = useState(null)
  const [ishlamoqda, setIshlamoqda] = useState(false)

  const yukla = useCallback(async () => {
    try {
      const res = await fetch(`/api/hamkor/postlar?kanal=${kanalId}`)
      const data = await res.json()
      if (res.ok) setPostlar(data.postlar || [])
    } finally {
      setYuklanmoqda(false)
    }
  }, [kanalId])

  useEffect(() => { yukla() }, [yukla])

  const saqla = async () => {
    setIshlamoqda(true)
    try {
      const res = await fetch('/api/hamkor/postlar', {
        method: tahrir.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tahrir, kanalId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setTahrir(null)
      yukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIshlamoqda(false)
    }
  }

  const ochir = async (id) => {
    if (!confirm("Post o'chirilsinmi? Buni qaytarib bo'lmaydi.")) return
    try {
      const res = await fetch(`/api/hamkor/postlar?id=${id}&kanal=${kanalId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      yukla()
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (yuklanmoqda) return <div className="text-purple-300 py-8 text-center">⏳ Yuklanmoqda...</div>

  return (
    <div className="space-y-4">
      {!tahrir && (
        <button
          onClick={() => setTahrir({ sarlavha: '', matn: '', rasm: '', nashr: true })}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm"
        >
          ➕ Yangi post
        </button>
      )}

      {tahrir && (
        <div className="rounded-2xl border border-purple-700/50 bg-slate-900/60 p-5 space-y-3">
          <h3 className="font-bold">{tahrir.id ? 'Postni tahrirlash' : 'Yangi post'}</h3>
          <input
            value={tahrir.sarlavha}
            onChange={(e) => setTahrir({ ...tahrir, sarlavha: e.target.value })}
            placeholder="Sarlavha"
            className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
          />
          <textarea
            value={tahrir.matn}
            onChange={(e) => setTahrir({ ...tahrir, matn: e.target.value })}
            rows={6}
            placeholder="Post matni"
            className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500 resize-y"
          />
          <input
            value={tahrir.rasm || ''}
            onChange={(e) => setTahrir({ ...tahrir, rasm: e.target.value })}
            placeholder="Rasm havolasi (ixtiyoriy)"
            className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={tahrir.nashr !== false}
              onChange={(e) => setTahrir({ ...tahrir, nashr: e.target.checked })}
              className="accent-yellow-500"
            />
            <span className="text-sm text-purple-200">
              Darhol nashr etilsin — obunachilarga bildirishnoma boradi
            </span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={saqla}
              disabled={ishlamoqda || !tahrir.sarlavha.trim() || !tahrir.matn.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm disabled:opacity-40"
            >
              {ishlamoqda ? '⏳ Saqlanmoqda...' : 'Saqlash'}
            </button>
            <button onClick={() => setTahrir(null)} className="px-5 py-2.5 rounded-xl bg-slate-800 border border-purple-700/50 text-sm font-semibold">
              Bekor qilish
            </button>
          </div>
        </div>
      )}

      {postlar.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 border border-purple-800/50 rounded-2xl text-sm text-purple-300">
          Hali post yo'q
        </div>
      ) : (
        <div className="space-y-3">
          {postlar.map((p) => (
            <div key={p.id} className="rounded-2xl border border-purple-800/50 bg-slate-900/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white">{p.sarlavha}</h3>
                    {!p.nashr && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-600/20 text-orange-300 border border-orange-600/40">
                        qoralama
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-purple-300/85 mt-1 line-clamp-2">{p.matn}</p>
                  <div className="text-[11px] text-purple-500 mt-1.5">
                    {qachon(p.createdAt)} · 👁️ {p.korishlar}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setTahrir({ id: p.id, sarlavha: p.sarlavha, matn: p.matn, rasm: p.rasm || '', nashr: p.nashr })}
                    className="px-3 py-1.5 rounded-lg bg-purple-800/60 border border-purple-600/50 text-xs font-semibold"
                  >
                    Tahrir
                  </button>
                  <button
                    onClick={() => ochir(p.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-600/40 text-red-300 text-xs font-semibold"
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Videolar({ kanalId }) {
  const [videolar, setVideolar] = useState([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [tahrir, setTahrir] = useState(null)
  const [ishlamoqda, setIshlamoqda] = useState(false)

  const yukla = useCallback(async () => {
    try {
      const res = await fetch(`/api/hamkor/videolar?kanal=${kanalId}`)
      const data = await res.json()
      if (res.ok) setVideolar(data.videolar || [])
    } finally {
      setYuklanmoqda(false)
    }
  }, [kanalId])

  useEffect(() => { yukla() }, [yukla])

  const saqla = async () => {
    setIshlamoqda(true)
    try {
      const res = await fetch('/api/hamkor/videolar', {
        method: tahrir.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tahrir, kanalId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      setTahrir(null)
      yukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIshlamoqda(false)
    }
  }

  const ochir = async (id) => {
    if (!confirm("Video o'chirilsinmi?")) return
    try {
      const res = await fetch(`/api/hamkor/videolar?id=${id}&kanal=${kanalId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      yukla()
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (yuklanmoqda) return <div className="text-purple-300 py-8 text-center">⏳ Yuklanmoqda...</div>

  return (
    <div className="space-y-4">
      {!tahrir && (
        <button
          onClick={() => setTahrir({ sarlavha: '', tavsif: '', videoUrl: '', thumbnail: '', tartib: 0, nashr: true })}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm"
        >
          ➕ Video qo'shish
        </button>
      )}

      {tahrir && (
        <div className="rounded-2xl border border-purple-700/50 bg-slate-900/60 p-5 space-y-3">
          <h3 className="font-bold">{tahrir.id ? 'Videoni tahrirlash' : 'Yangi video'}</h3>
          <input
            value={tahrir.sarlavha}
            onChange={(e) => setTahrir({ ...tahrir, sarlavha: e.target.value })}
            placeholder="Video sarlavhasi"
            className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
          />
          <input
            value={tahrir.videoUrl}
            onChange={(e) => setTahrir({ ...tahrir, videoUrl: e.target.value })}
            placeholder="Video havolasi — YouTube bo'lsa kanal sahifasida to'g'ridan-to'g'ri ochiladi"
            className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
          />
          <textarea
            value={tahrir.tavsif || ''}
            onChange={(e) => setTahrir({ ...tahrir, tavsif: e.target.value })}
            rows={3}
            placeholder="Qisqacha tavsif (ixtiyoriy)"
            className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500 resize-y"
          />
          <div className="flex gap-2 items-center flex-wrap">
            <input
              type="number"
              value={tahrir.tartib ?? 0}
              onChange={(e) => setTahrir({ ...tahrir, tartib: Number(e.target.value) })}
              className="w-28 px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none"
            />
            <span className="text-xs text-purple-400">Tartib raqami — kichigi yuqorida turadi</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saqla}
              disabled={ishlamoqda || !tahrir.sarlavha.trim() || !tahrir.videoUrl.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm disabled:opacity-40"
            >
              {ishlamoqda ? '⏳ Saqlanmoqda...' : 'Saqlash'}
            </button>
            <button onClick={() => setTahrir(null)} className="px-5 py-2.5 rounded-xl bg-slate-800 border border-purple-700/50 text-sm font-semibold">
              Bekor qilish
            </button>
          </div>
        </div>
      )}

      {videolar.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 border border-purple-800/50 rounded-2xl text-sm text-purple-300">
          Hali video yo'q
        </div>
      ) : (
        <div className="space-y-3">
          {videolar.map((v) => (
            <div key={v.id} className="rounded-2xl border border-purple-800/50 bg-slate-900/50 p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-bold text-white text-sm">{v.sarlavha}</h3>
                <div className="text-[11px] text-purple-400 mt-1 truncate max-w-md">{v.videoUrl}</div>
                <div className="text-[11px] text-purple-500 mt-1">
                  Tartib {v.tartib} · {v.nashr ? 'nashr etilgan' : 'qoralama'} · 👁️ {v.korishlar}
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setTahrir({ id: v.id, sarlavha: v.sarlavha, tavsif: v.tavsif || '', videoUrl: v.videoUrl, thumbnail: v.thumbnail || '', tartib: v.tartib, nashr: v.nashr })}
                  className="px-3 py-1.5 rounded-lg bg-purple-800/60 border border-purple-600/50 text-xs font-semibold"
                >
                  Tahrir
                </button>
                <button
                  onClick={() => ochir(v.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-600/40 text-red-300 text-xs font-semibold"
                >
                  O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Obunachilar({ holat }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Raqam icon="👥" son={holat.statistika.obunachilar} nom="Jami obunachi" />
        <Raqam icon="📈" son={holat.statistika.haftalikOsish} nom="Shu haftada yangi" />
      </div>

      <div>
        <h2 className="text-sm font-bold text-purple-300 mb-2">Oxirgi 10 ta obunachi</h2>
        {holat.oxirgiObunachilar.length === 0 ? (
          <div className="rounded-xl border border-purple-800/50 bg-slate-900/40 p-6 text-center text-sm text-purple-300">
            Hali hech kim obuna bo'lmagan. Kanal katalogda ko'rinishi uchun u
            ochiq bo'lishi kerak — buni administrator sozlaydi.
          </div>
        ) : (
          <div className="rounded-xl border border-purple-800/50 bg-slate-900/40 divide-y divide-purple-900/50">
            {holat.oxirgiObunachilar.map((o, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold text-black overflow-hidden flex-shrink-0">
                    {o.user.avatar ? (
                      <img src={o.user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (o.user.fullName || o.user.username).charAt(0).toUpperCase()
                    )}
                  </div>
                  <Link href={`/profil/${o.user.userId}`} className="text-sm text-white hover:text-yellow-400 truncate">
                    {o.user.fullName || o.user.username}
                  </Link>
                </div>
                <span className="text-[11px] text-purple-400 flex-shrink-0">{qachon(o.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Sozlama({ kanal, turlar, onSaqlandi }) {
  const [shakl, setShakl] = useState({
    nom: kanal.nom,
    tavsif: kanal.tavsif || '',
    avatar: kanal.avatar || '',
    banner: kanal.banner || '',
    turi: kanal.turi,
  })
  const [ishlamoqda, setIshlamoqda] = useState(false)

  const saqla = async () => {
    setIshlamoqda(true)
    try {
      const res = await fetch('/api/hamkor/kanal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...shakl, kanalId: kanal.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      onSaqlandi()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIshlamoqda(false)
    }
  }

  return (
    <div className="rounded-2xl border border-purple-800/50 bg-slate-900/50 p-5 space-y-4 max-w-2xl">
      <div>
        <label className="text-sm text-purple-300 font-semibold block mb-1">Kanal nomi</label>
        <input
          value={shakl.nom}
          onChange={(e) => setShakl({ ...shakl, nom: e.target.value })}
          className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500"
        />
      </div>

      <div>
        <label className="text-sm text-purple-300 font-semibold block mb-1">Tavsif</label>
        <textarea
          value={shakl.tavsif}
          onChange={(e) => setShakl({ ...shakl, tavsif: e.target.value })}
          rows={4}
          placeholder="Kanal nima haqida, kim uchun foydali"
          className="w-full px-4 py-2.5 bg-purple-950/50 border border-purple-700/50 rounded-xl text-white outline-none focus:border-yellow-500 resize-y"
        />
      </div>

      <div>
        <label className="text-sm text-purple-300 font-semibold block mb-2">Kanal turi</label>
        <div className="flex gap-2 flex-wrap">
          {turlar.map((t) => (
            <button
              key={t.id}
              onClick={() => setShakl({ ...shakl, turi: t.id })}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold ${
                shakl.turi === t.id
                  ? 'bg-yellow-500 text-black border-yellow-400'
                  : 'bg-purple-950/40 border-purple-800/50 text-purple-200'
              }`}
            >
              {t.icon} {t.nom}
            </button>
          ))}
        </div>
      </div>

      {/* RASMLAR YUKLANADI, MANZIL YOZILMAYDI. Ilgari bu yerda faqat
          "Avatar havolasi" matn maydoni turardi — ya'ni rasmni avval
          boshqa joyga yuklab, keyin manzilini ko'chirib kelish kerak
          edi. Amalda buni hech kim qilmadi va kanallar avatarsiz
          qoldi. Manzilni qo'lda yozish ham qoldirilgan: tayyor rasm
          boshqa joyda bo'lsa, yuklashning hojati yo'q. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RasmMaydoni
          nom="Avatar"
          izoh="Kvadrat rasm, kanal nomi yonida chiqadi"
          qiymat={shakl.avatar}
          maqsad="avatar"
          kanalId={kanal.id}
          dumaloq
          onOzgardi={(url) => setShakl({ ...shakl, avatar: url })}
        />
        <RasmMaydoni
          nom="Banner"
          izoh="Keng rasm, kanal sahifasining tepasida"
          qiymat={shakl.banner}
          maqsad="banner"
          kanalId={kanal.id}
          onOzgardi={(url) => setShakl({ ...shakl, banner: url })}
        />
      </div>

      <div className="rounded-xl bg-purple-950/40 border border-purple-800/50 p-4 text-[12px] text-purple-300 leading-relaxed">
        Kanal manzili (<span className="font-mono">/kanallar/{kanal.slug}</span>), ochiqligi
        va tavsiyaga chiqishi administrator tomonidan boshqariladi — manzil
        o'zgarsa tarqatilgan havolalar ishlamay qolardi.
      </div>

      <button
        onClick={saqla}
        disabled={ishlamoqda || !shakl.nom.trim()}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm disabled:opacity-40"
      >
        {ishlamoqda ? '⏳ Saqlanmoqda...' : '💾 Saqlash'}
      </button>
    </div>
  )
}

/**
 * Rasm maydoni: yuklash, ko'rish va olib tashlash.
 *
 * Yuklangan rasm DARHOL saqlanmaydi — u faqat shakl holatiga
 * yoziladi va "Saqlash" bosilganda kanalga o'tadi. Shunday qilinmasa,
 * tasodifan yuklangan rasm darhol jonli kanalda paydo bo'lardi.
 */
function RasmMaydoni({ nom, izoh, qiymat, maqsad, kanalId, dumaloq, onOzgardi }) {
  const [band, setBand] = useState(false)

  const yukla = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBand(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('maqsad', maqsad)
      fd.append('kanalId', kanalId)
      const res = await fetch('/api/hamkor/rasm', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onOzgardi(data.url)
      toast.success(`${nom} yuklandi — saqlashni unutmang`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBand(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <label className="text-sm text-purple-300 font-semibold block mb-1">{nom}</label>
      <div className="text-[11px] text-purple-500 mb-2">{izoh}</div>

      <div className="flex items-center gap-3">
        <div
          className={`${dumaloq ? 'rounded-full' : 'rounded-xl'} w-16 h-16 shrink-0 overflow-hidden bg-purple-950/60 border border-purple-800/50 flex items-center justify-center`}
        >
          {qiymat ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qiymat} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-purple-600 text-xl">🖼️</span>
          )}
        </div>

        <div className="min-w-0">
          <label className="inline-block px-3 py-1.5 rounded-lg bg-purple-800/50 border border-purple-600/50 text-xs text-purple-200 cursor-pointer hover:bg-purple-700/50 transition-all">
            {band ? 'Yuklanmoqda...' : qiymat ? 'Almashtirish' : 'Rasm yuklash'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={yukla}
              disabled={band}
              className="hidden"
            />
          </label>
          {qiymat ? (
            <button
              onClick={() => onOzgardi('')}
              className="block text-[11px] text-red-300 underline mt-1.5 hover:text-red-200"
            >
              Olib tashlash
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Raqam({ icon, son, nom, izoh }) {
  return (
    <div className="rounded-2xl border border-purple-800/50 bg-slate-900/50 p-4">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-yellow-400">{son ?? 0}</div>
      <div className="text-[11px] text-purple-300">{nom}</div>
      {izoh && <div className="text-[10px] text-purple-500 mt-0.5">{izoh}</div>}
    </div>
  )
}

function Xabar({ icon, sarlavha, matn, havola, tugma }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-slate-900/60 border border-purple-800/50 rounded-2xl p-8">
        <div className="text-5xl mb-4">{icon}</div>
        <h1 className="text-xl font-bold mb-2">{sarlavha}</h1>
        {matn && <p className="text-purple-300 text-sm mb-6 leading-relaxed">{matn}</p>}
        {havola && (
          <Link href={havola} className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
            {tugma}
          </Link>
        )}
      </div>
    </main>
  )
}
