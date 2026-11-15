// app/admin/forum/page.js
"use client"
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const HOLATLAR = [
  { key: 'pending', label: 'Tekshiruvda', rang: 'bg-amber-600/20 text-amber-400 border-amber-600/40' },
  { key: 'approved', label: 'Tasdiqlangan', rang: 'bg-green-600/20 text-green-400 border-green-600/40' },
  { key: 'rejected', label: 'Rad etilgan', rang: 'bg-red-600/20 text-red-400 border-red-600/40' },
  { key: 'all', label: 'Hammasi', rang: 'bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq-2)]' },
]

export default function AdminForumPage() {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 })
  const [filter, setFilter] = useState('pending')
  const [qidiruv, setQidiruv] = useState('')
  const [faolQidiruv, setFaolQidiruv] = useState('')
  const [sahifa, setSahifa] = useState(1)
  const [sahifalar, setSahifalar] = useState(1)
  const [jami, setJami] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [ishlanmoqda, setIshlanmoqda] = useState(null)
  const [radOyna, setRadOyna] = useState({ ochiq: false, id: null, sabab: '' })
  const [ochirOyna, setOchirOyna] = useState({ ochiq: false, id: null })

  useEffect(() => {
    const taymer = setTimeout(() => {
      setFaolQidiruv(qidiruv.trim())
      setSahifa(1)
    }, 300)
    return () => clearTimeout(taymer)
  }, [qidiruv])

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        status: filter,
        page: String(sahifa),
        limit: '25',
      })
      if (faolQidiruv) params.set('q', faolQidiruv)

      const res = await fetch(`/api/admin/forum?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPosts(data.posts || [])
      setStats(data.stats || { pending: 0, approved: 0, rejected: 0 })
      setSahifalar(data.sahifalar || 1)
      setJami(data.jami ?? (data.posts?.length || 0))
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }, [filter, sahifa, faolQidiruv])

  useEffect(() => { load() }, [load])

  const amal = async (id, action, reason) => {
    setIshlanmoqda(id)
    try {
      const res = await fetch('/api/admin/forum', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, reason }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message)
      load()
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIshlanmoqda(null)
    }
  }

  const radEt = (id) => {
    setRadOyna({ ochiq: true, id, sabab: '' })
  }

  const tasdiqlaRad = async () => {
    if (!radOyna.id) return
    const { id, sabab } = radOyna
    setRadOyna({ ochiq: false, id: null, sabab: '' })
    await amal(id, 'reject', sabab)
  }

  const ochir = (id) => {
    setOchirOyna({ ochiq: true, id })
  }

  const tasdiqlaOchir = async () => {
    if (!ochirOyna.id) return
    const id = ochirOyna.id
    setOchirOyna({ ochiq: false, id: null })
    setIshlanmoqda(id)
    try {
      const res = await fetch(`/api/admin/forum?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('✓ O\'chirildi')
      load()
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIshlanmoqda(null)
    }
  }

  const sana = (d) =>
    new Date(d).toLocaleString('uz-UZ', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    })

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Sarlavha */}
      <div className="flex items-start justify-between flex-wrap gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--v3-matn)] mb-1">💬 Muhokama</h1>
          <p className="text-[var(--v3-xira)] text-xs sm:text-sm">
            Postlar tasdiqlangandan keyingina saytda ko&apos;rinadi
          </p>
        </div>
        <Link
          href="/dolzarb"
          target="_blank"
          className="v3-tugma text-xs sm:text-sm min-h-[40px]"
        >
          Saytda ko&apos;rish ↗
        </Link>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: 'Tekshiruvda', son: stats.pending, rang: 'text-amber-400', bg: 'from-amber-900/30 to-orange-900/20 border-amber-700/40' },
          { label: 'Tasdiqlangan', son: stats.approved, rang: 'text-green-400', bg: 'from-green-900/30 to-emerald-900/20 border-green-700/40' },
          { label: 'Rad etilgan', son: stats.rejected, rang: 'text-red-400', bg: 'from-red-900/30 to-rose-900/20 border-red-700/40' },
        ].map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.bg} border rounded-2xl p-3 sm:p-4`}>
            <div className={`text-2xl sm:text-3xl font-bold ${s.rang}`}>{s.son}</div>
            <div className="text-[11px] sm:text-xs text-[var(--v3-xira)] mt-1 truncate">{s.label}</div>
          </div>
        ))}
      </div>

      {stats.pending > 0 && filter !== 'pending' && (
        <button
          onClick={() => { setFilter('pending'); setSahifa(1) }}
          className="w-full bg-amber-900/20 border border-amber-700/50 rounded-xl p-3 text-xs sm:text-sm text-amber-300 text-left"
        >
          ⏳ {stats.pending} ta post tekshiruvni kutmoqda — ko&apos;rish uchun bosing
        </button>
      )}

      {/* Filtr va qidiruv */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          {HOLATLAR.map((h) => (
            <button
              key={h.key}
              onClick={() => { setFilter(h.key); setSahifa(1) }}
              className={`px-3 sm:px-4 py-2 min-h-[38px] rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                filter === h.key ? h.rang : 'bg-[var(--v3-yuza)] text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:border-[var(--v3-chiziq-2)]'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          placeholder="Sarlavha, matn yoki muallif..."
          className="v3-kiritish w-full sm:w-64 text-base sm:text-sm min-h-[40px]"
        />
      </div>

      {/* Ro'yxat */}
      {isLoading ? (
        <div className="text-center py-12 text-[var(--v3-xira)]">Yuklanmoqda...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 v3-panel-karta">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-[var(--v3-xira)] text-sm">
            {filter === 'pending' ? 'Tekshiruvni kutayotgan post yo\'q' : 'Bu holatda post yo\'q'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => {
            const band = ishlanmoqda === p.id
            return (
              <div
                key={p.id}
                className="v3-panel-karta p-4 space-y-3"
              >
                {/* Muallif va meta */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold text-black shrink-0 overflow-hidden">
                      {p.author.avatar
                        ? <img src={p.author.avatar} alt="" className="w-full h-full object-cover" />
                        : (p.author.fullName || p.author.username || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[var(--v3-matn)] truncate">
                        {p.author.fullName || p.author.username}
                      </div>
                      <div className="text-xs text-[var(--v3-xira)]">
                        @{p.author.username} · {sana(p.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      HOLATLAR.find((h) => h.key === p.status)?.rang || ''
                    }`}>
                      {HOLATLAR.find((h) => h.key === p.status)?.label || p.status}
                    </span>
                    {p.articleId && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/40">
                        maqola #{p.articleId}
                      </span>
                    )}
                    {p.parentId && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-xira)]">
                        javob
                      </span>
                    )}
                    {p.isPinned && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-600/20 text-yellow-400">
                        📌
                      </span>
                    )}
                  </div>
                </div>

                {/* Mazmun */}
                <div className="bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] rounded-xl p-3">
                  {p.parent?.title && (
                    <div className="text-[11px] text-[var(--v3-xira)] mb-1.5">
                      ↳ mavzu: {p.parent.title}
                    </div>
                  )}
                  {p.title && (
                    <div className="font-bold text-[var(--v3-matn)] text-sm mb-1.5 break-words">{p.title}</div>
                  )}
                  <p className="text-[var(--v3-matn)] text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {p.content}
                  </p>
                </div>

                {p.rejectReason && (
                  <div className="text-xs text-red-400 bg-red-900/20 rounded-lg px-3 py-2">
                    Rad etish sababi: {p.rejectReason}
                  </div>
                )}

                {/* Amallar */}
                <div className="flex flex-wrap gap-2">
                  {p.status !== 'approved' && (
                    <button
                      onClick={() => amal(p.id, 'approve')}
                      disabled={band}
                      className="px-3.5 py-2 min-h-[38px] bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded-lg text-xs text-green-400 font-semibold disabled:opacity-50"
                    >
                      ✓ Tasdiqlash
                    </button>
                  )}
                  {p.status !== 'rejected' && (
                    <button
                      onClick={() => radEt(p.id)}
                      disabled={band}
                      className="px-3.5 py-2 min-h-[38px] bg-amber-600/20 hover:bg-amber-600/30 border border-amber-600/50 rounded-lg text-xs text-amber-400 font-semibold disabled:opacity-50"
                    >
                      ✕ Rad etish
                    </button>
                  )}
                  {p.status === 'approved' && !p.parentId && (
                    <button
                      onClick={() => amal(p.id, 'pin')}
                      disabled={band}
                      className="v3-tugma text-xs py-1.5 px-3 min-h-[38px] disabled:opacity-50"
                    >
                      {p.isPinned ? '📌 Qadashni olish' : '📌 Yuqoriga qadash'}
                    </button>
                  )}
                  {p.status === 'approved' && (
                    <Link
                      href={`/dolzarb/${p.parentId || p.id}`}
                      target="_blank"
                      className="v3-tugma text-xs py-1.5 px-3 min-h-[38px]"
                    >
                      Ko&apos;rish ↗
                    </Link>
                  )}
                  <button
                    onClick={() => ochir(p.id)}
                    disabled={band}
                    className="px-3.5 py-2 min-h-[38px] bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-xs text-red-400 disabled:opacity-50 sm:ml-auto"
                  >
                    🗑 O&apos;chirish
                  </button>
                </div>
              </div>
            )
          })}

          {sahifalar > 1 && (
            <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
              <span className="text-xs text-[var(--v3-xira)]">
                Sahifa {sahifa} / {sahifalar} · jami {jami} ta
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSahifa((s) => Math.max(1, s - 1))}
                  disabled={sahifa <= 1}
                  className="v3-tugma text-xs min-h-[38px] disabled:opacity-40"
                >
                  ← Oldingi
                </button>
                <button
                  type="button"
                  onClick={() => setSahifa((s) => Math.min(sahifalar, s + 1))}
                  disabled={sahifa >= sahifalar}
                  className="v3-tugma text-xs min-h-[38px] disabled:opacity-40"
                >
                  Keyingi →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {radOyna.ochiq && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--v3-fon)] border border-[var(--v3-chiziq-2)] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[var(--v3-matn)]">Postni rad etish</h3>
            <p className="text-xs text-[var(--v3-xira)]">
              Rad etish sababi (ixtiyoriy) — muallifga ko&apos;rsatiladi.
            </p>
            <textarea
              rows={3}
              value={radOyna.sabab}
              onChange={(e) => setRadOyna((prev) => ({ ...prev, sabab: e.target.value }))}
              placeholder="Masalan: Forum qoidalariga mos kelmaydi..."
              className="v3-kiritish w-full resize-none"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setRadOyna({ ochiq: false, id: null, sabab: '' })}
                className="v3-tugma text-sm"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={tasdiqlaRad}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold"
              >
                Rad etish
              </button>
            </div>
          </div>
        </div>
      )}

      {ochirOyna.ochiq && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--v3-fon)] border border-red-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[var(--v3-matn)]">Postni o&apos;chirish</h3>
            <p className="text-sm text-[var(--v3-xira)]">
              Post butunlay o&apos;chirilsinmi? Barcha javoblari ham o&apos;chib ketadi.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setOchirOyna({ ochiq: false, id: null })}
                className="v3-tugma text-sm"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={tasdiqlaOchir}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold"
              >
                O&apos;chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
