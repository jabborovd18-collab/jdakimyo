"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { qachon } from "@/lib/sana"
import TasdiqBelgisi from "@/components/TasdiqBelgisi"

/**
 * Muhokama — ikki rejimda ishlaydi:
 *
 *   articleId berilmasa  -> umumiy lenta (dolzarb kimyoviy mavzular, sarlavha majburiy)
 *   articleId berilsa    -> shu maqola ostidagi muhokama (sarlavha shart emas)
 *
 * Postlar admin tasdiqlagandan keyin barchaga ko'rinadi. Muallif o'zining
 * kutayotgan postini "tekshiruvda" belgisi bilan ko'radi.
 */
const SAHIFA = 20

// Umumiy lentada "dolzarb" — vaqt bilan susayadigan ball bo'yicha.
// Maqola ostidagi muhokama xronologik o'qiladi.
const TARTIBLAR = [
  ["dolzarb", "Dolzarb"],
  ["yangi", "Yangi"],
  ["ommabop", "Ommabop"],
]

export default function Muhokama({ articleId = null, compact = false }) {
  const { data: session, status } = useSession()
  const kirgan = status === "authenticated"

  const [posts, setPosts] = useState([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xato, setXato] = useState("")
  const [sort, setSort] = useState(articleId ? "yangi" : "dolzarb")

  // Sahifalash. API `limit`/`offset`/`total`/`hasMore` ni allaqachon
  // qaytarardi, lekin komponent ularni yubormasdi — natijada lenta 20 ta
  // mavzuda ko'rinmas devorga urilardi.
  const [total, setTotal] = useState(0)
  const [yanaBormi, setYanaBormi] = useState(false)
  const [keyingiOfset, setKeyingiOfset] = useState(0)
  const [yanaYuklanmoqda, setYanaYuklanmoqda] = useState(false)

  const [sarlavha, setSarlavha] = useState("")
  const [matn, setMatn] = useState("")
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  const [ochiq, setOchiq] = useState(!compact)

  const sahifaOl = useCallback(async (ofset) => {
    const params = new URLSearchParams({
      sort,
      limit: String(SAHIFA),
      offset: String(ofset),
    })
    if (articleId) params.set("articleId", String(articleId))

    const res = await fetch(`/api/forum/posts?${params}`)
    const d = await res.json()
    if (!res.ok) throw new Error(d.error || "Yuklab bo'lmadi")
    return d
  }, [articleId, sort])

  /** Boshidan yuklash — sort o'zgarganda va yangi post yuborilgandan keyin. */
  const yukla = useCallback(async () => {
    setYuklanmoqda(true)
    setXato("")
    try {
      const d = await sahifaOl(0)
      const olingan = d.posts || []
      setPosts(olingan)
      setTotal(d.total || olingan.length)
      setYanaBormi(Boolean(d.hasMore))
      setKeyingiOfset(olingan.length)
    } catch (e) {
      setXato(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [sahifaOl])

  useEffect(() => { yukla() }, [yukla])

  /**
   * Keyingi sahifa. Ofsetni alohida hisoblaymiz — `posts.length` ga
   * tayanib bo'lmaydi, chunki post o'chirilsa ro'yxat qisqarib, keyingi
   * sahifadan bitta mavzu tushib qolardi.
   */
  const koproq = async () => {
    setYanaYuklanmoqda(true)
    try {
      const d = await sahifaOl(keyingiOfset)
      const olingan = d.posts || []
      // Takrorni chetlab o'tamiz: yuklash orasida yangi post tasdiqlansa
      // ofset siljib, bir mavzu ikki marta chiqishi mumkin.
      setPosts((oldi) => {
        const bor = new Set(oldi.map((p) => p.id))
        return [...oldi, ...olingan.filter((p) => !bor.has(p.id))]
      })
      setTotal(d.total || 0)
      setYanaBormi(Boolean(d.hasMore))
      setKeyingiOfset((k) => k + olingan.length)
    } catch (e) {
      toast.error(e.message || "Yuklab bo'lmadi")
    } finally {
      setYanaYuklanmoqda(false)
    }
  }

  const yubor = async () => {
    if (!matn.trim()) {
      toast.error("Matn yozing")
      return
    }
    if (!articleId && sarlavha.trim().length < 5) {
      toast.error("Sarlavha kamida 5 ta belgidan iborat bo'lsin")
      return
    }

    setYuborilmoqda(true)
    try {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: articleId ? String(articleId) : undefined,
          title: articleId ? undefined : sarlavha,
          content: matn,
        }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || "Yuborib bo'lmadi")

      toast.success(d.message, { duration: 5000 })
      setSarlavha("")
      setMatn("")
      yukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setYuborilmoqda(false)
    }
  }

  const layk = async (post) => {
    if (!kirgan) { toast.error("Layk uchun tizimga kiring"); return }
    // Darhol ko'rsatamiz, so'rov keyin
    setPosts((oldi) => oldi.map((p) =>
      p.id === post.id
        ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) }
        : p,
    ))
    try {
      const res = await fetch(`/api/forum/posts/${post.id}/like`, { method: "POST" })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setPosts((oldi) => oldi.map((p) =>
        p.id === post.id ? { ...p, likedByMe: d.liked, likes: d.likes } : p,
      ))
    } catch (e) {
      toast.error(e.message || "Xatolik")
      yukla()
    }
  }

  const ochir = async (post) => {
    if (!confirm("Post o'chirilsinmi?")) return
    try {
      const res = await fetch(`/api/forum/posts/${post.id}`, { method: "DELETE" })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success("O'chirildi")
      setPosts((oldi) => oldi.filter((p) => p.id !== post.id))
      setTotal((t) => Math.max(0, t - 1))
    } catch (e) {
      toast.error(e.message)
    }
  }


  return (
    <section className="space-y-4">
      {/* Sarlavha */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>💬</span>
          {articleId ? "Muhokama" : "Dolzarb mavzular"}
          {total > 0 && (
            <span className="text-xs font-normal text-purple-400">({total})</span>
          )}
        </h2>

        {!articleId && total > 1 && (
          <div className="flex gap-1 bg-purple-950/50 rounded-lg p-1">
            {TARTIBLAR.map(([k, label]) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  sort === k ? "bg-purple-700 text-white" : "text-purple-400 hover:text-purple-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Yozish */}
      {kirgan ? (
        ochiq ? (
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-4 space-y-3">
            {!articleId && (
              <input
                value={sarlavha}
                onChange={(e) => setSarlavha(e.target.value)}
                placeholder="Mavzu sarlavhasi — masalan: Sisplatin qarshiligini qanday yengish mumkin?"
                maxLength={160}
                className="w-full px-4 py-2.5 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white text-sm placeholder-purple-500 focus:border-yellow-500 outline-none"
              />
            )}
            <textarea
              value={matn}
              onChange={(e) => setMatn(e.target.value)}
              rows={compact ? 3 : 4}
              maxLength={3000}
              placeholder={articleId ? "Maqola haqida fikringiz..." : "Fikringizni batafsil yozing..."}
              className="w-full px-4 py-2.5 bg-purple-950/60 border border-purple-700/50 rounded-xl text-white text-sm placeholder-purple-500 focus:border-yellow-500 outline-none resize-y"
            />
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-[11px] text-purple-500">
                Admin tasdiqlagandan keyin barchaga ko&apos;rinadi · {matn.length}/3000
              </span>
              <button
                onClick={yubor}
                disabled={yuborilmoqda}
                className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl text-sm disabled:opacity-50"
              >
                {yuborilmoqda ? "Yuborilmoqda..." : "Yuborish"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setOchiq(true)}
            className="w-full text-left px-4 py-3 bg-purple-900/30 border border-purple-700/50 border-dashed rounded-2xl text-purple-400 text-sm hover:bg-purple-900/50 transition-colors"
          >
            ✍️ Fikringizni yozing...
          </button>
        )
      ) : (
        <div className="bg-purple-900/20 border border-purple-700/40 border-dashed rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <span className="text-purple-300 text-sm">
            Muhokamada qatnashish uchun tizimga kiring
          </span>
          <Link
            href="/login"
            className="shrink-0 px-5 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl text-sm text-center"
          >
            Kirish
          </Link>
        </div>
      )}

      {/* Ro'yxat */}
      {yuklanmoqda ? (
        <div className="text-center py-10 text-purple-400 text-sm">Yuklanmoqda...</div>
      ) : xato ? (
        <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-4 text-red-400 text-sm">
          {xato}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-purple-900/20 border border-purple-700/40 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">💭</div>
          <p className="text-purple-300 text-sm">
            {articleId
              ? "Bu maqola hali muhokama qilinmagan — birinchi bo'ling"
              : "Hali mavzu ochilmagan — birinchi mavzuni siz boshlang"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => {
            const oziniki = session?.user?.id === p.author.id
            const kutmoqda = p.status === "pending"

            return (
              <article
                key={p.id}
                className={`bg-purple-900/30 border rounded-2xl p-4 ${
                  kutmoqda ? "border-amber-600/40" : "border-purple-700/50"
                }`}
              >
                {/* Muallif */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold text-black shrink-0 overflow-hidden">
                    {p.author.avatar ? (
                      <img src={p.author.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (p.author.fullName || p.author.username || "?")[0].toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm truncate flex items-center gap-1">
                        <span className="truncate">{p.author.fullName || p.author.username}</span>
                        <TasdiqBelgisi tasdiqlangan={p.author.isVerified} olcham="kichik" />
                      </span>
                      {p.isPinned && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                          📌 qadalgan
                        </span>
                      )}
                      {kutmoqda && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                          tekshiruvda
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-purple-500">{qachon(p.createdAt)}</div>
                  </div>

                  {oziniki && (
                    <button
                      onClick={() => ochir(p)}
                      className="text-purple-500 hover:text-red-400 text-sm shrink-0 transition-colors"
                      title="O'chirish"
                    >
                      🗑
                    </button>
                  )}
                </div>

                {/* Mazmun */}
                <div className="mt-3">
                  {p.title && (
                    <h3 className="font-bold text-white text-base mb-1.5">{p.title}</h3>
                  )}
                  <p className="text-purple-200 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {p.content}
                  </p>
                </div>

                {/* Amallar */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-purple-800/40">
                  <button
                    onClick={() => layk(p)}
                    disabled={kutmoqda}
                    className={`flex items-center gap-1.5 text-xs transition-colors disabled:opacity-40 ${
                      p.likedByMe ? "text-pink-400" : "text-purple-400 hover:text-pink-400"
                    }`}
                  >
                    <span>{p.likedByMe ? "❤️" : "🤍"}</span>
                    <span>{p.likes}</span>
                  </button>

                  <Link
                    href={`/ilmiy/maqolalar/muhokama/${p.id}`}
                    className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-200 transition-colors"
                  >
                    <span>💬</span>
                    <span>{p.replyCount} javob</span>
                  </Link>
                </div>
              </article>
            )
          })}

          {yanaBormi && (
            <button
              onClick={koproq}
              disabled={yanaYuklanmoqda}
              className="w-full px-4 py-3 bg-purple-900/40 border border-purple-700/50 rounded-2xl text-purple-300 text-sm font-semibold hover:bg-purple-800/50 disabled:opacity-50 transition-colors"
            >
              {yanaYuklanmoqda
                ? "Yuklanmoqda..."
                : `Ko'proq ko'rsatish (${total - posts.length} ta qoldi)`}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
