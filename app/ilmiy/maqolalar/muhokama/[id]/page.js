"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { qachon } from "@/lib/sana"

/**
 * Bitta mavzu va uning javoblari.
 * Javob ham admin tasdiqlagandan keyin ko'rinadi.
 */
export default function MavzuSahifasi() {
  const { id } = useParams()
  const { data: session, status } = useSession()
  const kirgan = status === "authenticated"

  const [malumot, setMalumot] = useState(null)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xato, setXato] = useState("")
  const [javob, setJavob] = useState("")
  const [yuborilmoqda, setYuborilmoqda] = useState(false)

  const yukla = useCallback(async () => {
    try {
      const res = await fetch(`/api/forum/posts/${id}`)
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || "Yuklab bo'lmadi")
      setMalumot(d)
    } catch (e) {
      setXato(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [id])

  useEffect(() => { yukla() }, [yukla])

  const javobYubor = async () => {
    if (javob.trim().length < 2) { toast.error("Javob yozing"); return }
    setYuborilmoqda(true)
    try {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId: id, content: javob }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success(d.message, { duration: 5000 })
      setJavob("")
      yukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setYuborilmoqda(false)
    }
  }

  const layk = async (postId) => {
    if (!kirgan) { toast.error("Layk uchun tizimga kiring"); return }
    try {
      const res = await fetch(`/api/forum/posts/${postId}/like`, { method: "POST" })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      yukla()
    } catch (e) {
      toast.error(e.message || "Xatolik")
    }
  }


  if (yuklanmoqda) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-purple-300">Yuklanmoqda...</div>
      </main>
    )
  }

  if (xato || !malumot) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6 max-w-md w-full text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-red-400 text-sm mb-5">{xato}</p>
          <Link
            href="/ilmiy/maqolalar/muhokama"
            className="px-5 py-2.5 bg-purple-800/60 border border-purple-600/50 rounded-xl inline-block text-white text-sm"
          >
            Muhokamaga qaytish
          </Link>
        </div>
      </main>
    )
  }

  const { post, replies } = malumot

  const Kartochka = ({ p, asosiy }) => (
    <article className={`bg-purple-900/30 border rounded-2xl p-4 ${
      p.status === "pending" ? "border-amber-600/40" : "border-purple-700/50"
    }`}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold text-black shrink-0 overflow-hidden">
          {p.author.avatar
            ? <img src={p.author.avatar} alt="" className="w-full h-full object-cover" />
            : (p.author.fullName || p.author.username || "?")[0].toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">
              {p.author.fullName || p.author.username}
            </span>
            {p.status === "pending" && (
              <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                tekshiruvda
              </span>
            )}
          </div>
          <div className="text-[11px] text-purple-500">{qachon(p.createdAt)}</div>
        </div>
      </div>

      <div className="mt-3">
        {asosiy && p.title && (
          <h1 className="text-lg sm:text-xl font-bold text-white mb-2">{p.title}</h1>
        )}
        <p className="text-purple-200 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {p.content}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-purple-800/40">
        <button
          onClick={() => layk(p.id)}
          disabled={p.status === "pending"}
          className={`flex items-center gap-1.5 text-xs transition-colors disabled:opacity-40 ${
            p.likedByMe ? "text-pink-400" : "text-purple-400 hover:text-pink-400"
          }`}
        >
          <span>{p.likedByMe ? "❤️" : "🤍"}</span>
          <span>{p.likes}</span>
        </button>
      </div>
    </article>
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href={post.articleId
              ? `/ilmiy/maqolalar/${post.articleId}`
              : "/ilmiy/maqolalar/muhokama"}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            ← {post.articleId ? "Maqolaga qaytish" : "Barcha mavzular"}
          </Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <Kartochka p={post} asosiy />

        <h2 className="text-sm font-semibold text-purple-300 pt-2">
          {replies.length > 0 ? `${replies.length} ta javob` : "Hali javob yo'q"}
        </h2>

        {replies.map((r) => (
          <div key={r.id} className="sm:pl-6 sm:border-l-2 sm:border-purple-800/40">
            <Kartochka p={r} />
          </div>
        ))}

        {/* Javob yozish */}
        {kirgan ? (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-4 space-y-3">
            <textarea
              value={javob}
              onChange={(e) => setJavob(e.target.value)}
              rows={3}
              maxLength={3000}
              placeholder="Javobingizni yozing..."
              className="w-full px-4 py-2.5 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white text-sm placeholder-purple-500 focus:border-yellow-500 outline-none resize-y"
            />
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-[11px] text-purple-500">
                Admin tasdiqlagandan keyin ko&apos;rinadi
              </span>
              <button
                onClick={javobYubor}
                disabled={yuborilmoqda}
                className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl text-sm disabled:opacity-50"
              >
                {yuborilmoqda ? "Yuborilmoqda..." : "Javob berish"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-purple-900/20 border border-purple-700/40 border-dashed rounded-2xl p-4 text-center">
            <Link href="/login" className="text-yellow-400 font-semibold text-sm">
              Javob berish uchun kiring →
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
