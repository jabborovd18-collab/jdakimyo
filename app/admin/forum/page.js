// app/admin/forum/page.js
"use client"
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const HOLATLAR = [
  { key: 'pending', label: 'Tekshiruvda', rang: 'bg-amber-600/20 text-amber-400 border-amber-600/40' },
  { key: 'approved', label: 'Tasdiqlangan', rang: 'bg-green-600/20 text-green-400 border-green-600/40' },
  { key: 'rejected', label: 'Rad etilgan', rang: 'bg-red-600/20 text-red-400 border-red-600/40' },
  { key: 'all', label: 'Hammasi', rang: 'bg-purple-600/20 text-purple-300 border-purple-600/40' },
]

export default function AdminForumPage() {
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 })
  const [filter, setFilter] = useState('pending')
  const [isLoading, setIsLoading] = useState(true)
  const [ishlanmoqda, setIshlanmoqda] = useState(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/forum?status=${filter}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPosts(data.posts)
      setStats(data.stats)
    } catch (error) {
      toast.error('Xatolik: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }, [filter])

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
    const reason = prompt('Rad etish sababi (ixtiyoriy) — muallifga ko\'rsatiladi:')
    if (reason === null) return // bekor qilindi
    amal(id, 'reject', reason)
  }

  const ochir = async (id) => {
    if (!confirm('Post butunlay o\'chirilsinmi? Javoblari ham o\'chadi.')) return
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
    <div className="space-y-6">
      {/* Sarlavha */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">💬 Muhokama</h1>
          <p className="text-purple-300 text-sm">
            Postlar tasdiqlangandan keyingina saytda ko&apos;rinadi
          </p>
        </div>
        <Link
          href="/ilmiy/maqolalar/muhokama"
          target="_blank"
          className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-xl text-sm text-purple-200"
        >
          Saytda ko&apos;rish ↗
        </Link>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Tekshiruvda', son: stats.pending, rang: 'text-amber-400', bg: 'from-amber-900/30 to-orange-900/20 border-amber-700/40' },
          { label: 'Tasdiqlangan', son: stats.approved, rang: 'text-green-400', bg: 'from-green-900/30 to-emerald-900/20 border-green-700/40' },
          { label: 'Rad etilgan', son: stats.rejected, rang: 'text-red-400', bg: 'from-red-900/30 to-rose-900/20 border-red-700/40' },
        ].map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.bg} border rounded-2xl p-4`}>
            <div className={`text-3xl font-bold ${s.rang}`}>{s.son}</div>
            <div className="text-xs text-purple-300 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {stats.pending > 0 && filter !== 'pending' && (
        <button
          onClick={() => setFilter('pending')}
          className="w-full bg-amber-900/20 border border-amber-700/50 rounded-xl p-3 text-sm text-amber-300 text-left"
        >
          ⏳ {stats.pending} ta post tekshiruvni kutmoqda — ko&apos;rish uchun bosing
        </button>
      )}

      {/* Filtr */}
      <div className="flex gap-2 flex-wrap">
        {HOLATLAR.map((h) => (
          <button
            key={h.key}
            onClick={() => setFilter(h.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              filter === h.key ? h.rang : 'bg-slate-900/50 text-purple-400 border-purple-800/50 hover:border-purple-600/50'
            }`}
          >
            {h.label}
          </button>
        ))}
      </div>

      {/* Ro'yxat */}
      {isLoading ? (
        <div className="text-center py-12 text-purple-400">Yuklanmoqda...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/50 border border-purple-800/50 rounded-2xl">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-purple-400 text-sm">
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
                className="bg-slate-900/50 border border-purple-800/50 rounded-2xl p-4 space-y-3"
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
                      <div className="text-sm font-semibold text-white truncate">
                        {p.author.fullName || p.author.username}
                      </div>
                      <div className="text-xs text-purple-500">
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
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-800/50 text-purple-300">
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
                <div className="bg-purple-950/40 rounded-xl p-3">
                  {p.parent?.title && (
                    <div className="text-[11px] text-purple-500 mb-1.5">
                      ↳ mavzu: {p.parent.title}
                    </div>
                  )}
                  {p.title && (
                    <div className="font-bold text-white text-sm mb-1.5">{p.title}</div>
                  )}
                  <p className="text-purple-200 text-sm whitespace-pre-wrap break-words leading-relaxed">
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
                      className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 rounded-lg text-xs text-green-400 font-semibold disabled:opacity-50"
                    >
                      ✓ Tasdiqlash
                    </button>
                  )}
                  {p.status !== 'rejected' && (
                    <button
                      onClick={() => radEt(p.id)}
                      disabled={band}
                      className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-600/50 rounded-lg text-xs text-amber-400 font-semibold disabled:opacity-50"
                    >
                      ✕ Rad etish
                    </button>
                  )}
                  {p.status === 'approved' && !p.parentId && (
                    <button
                      onClick={() => amal(p.id, 'pin')}
                      disabled={band}
                      className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/50 rounded-lg text-xs text-purple-200 disabled:opacity-50"
                    >
                      {p.isPinned ? '📌 Qadashni olish' : '📌 Yuqoriga qadash'}
                    </button>
                  )}
                  <button
                    onClick={() => ochir(p.id)}
                    disabled={band}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-xs text-red-400 disabled:opacity-50 ml-auto"
                  >
                    🗑 O&apos;chirish
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
