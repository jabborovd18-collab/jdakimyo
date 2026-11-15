"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import Ikon from "@/components/Ikon"
import ForumKartochka, { ForumOchirishModali } from "@/components/ForumKartochka"
import { isAdminRole } from "@/lib/roles"

/**
 * Muhokama — forum lentasi va yozish oynasi.
 *
 *   articleId berilmasa  -> umumiy lenta (/dolzarb, sarlavha majburiy)
 *   articleId berilsa    -> maqola ostidagi muhokama (sarlavha shart emas)
 *
 * Postlar admin tasdiqlagandan keyin barchaga ko'rinadi. Muallif o'zining
 * kutayotgan va rad etilgan postlarini (sababi bilan) ko'ra oladi.
 */
const SAHIFA = 20

const TARTIBLAR = [
  ["dolzarb", "Dolzarb"],
  ["yangi", "Yangi"],
  ["ommabop", "Ommabop"],
]

export default function Muhokama({ articleId = null, compact = false }) {
  const { data: session, status } = useSession()
  const kirgan = status === "authenticated"
  const adminmi = Boolean(session?.user && isAdminRole(session.user.role))

  const [posts, setPosts] = useState([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xato, setXato] = useState("")
  const [sort, setSort] = useState(articleId ? "yangi" : "dolzarb")

  const [qidiruvMatni, setQidiruvMatni] = useState("")
  const [faolQidiruv, setFaolQidiruv] = useState("")

  const [total, setTotal] = useState(0)
  const [yanaBormi, setYanaBormi] = useState(false)
  const [keyingiOfset, setKeyingiOfset] = useState(0)
  const [yanaYuklanmoqda, setYanaYuklanmoqda] = useState(false)

  const [sarlavha, setSarlavha] = useState("")
  const [matn, setMatn] = useState("")
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  // Mobil ekranda ham mavzular darhol ko'rinishi uchun yozish shakli
  // ixcham tugma ostida turadi va bir bosishda ochiladi.
  const [ochiq, setOchiq] = useState(false)

  const [ochirMaqsad, setOchirMaqsad] = useState(null)
  const [ochirilmoqda, setOchirilmoqda] = useState(false)

  // Qidiruv matnini har bir harfda so'rov ketmasligi uchun kechiktirib qo'llaymiz.
  useEffect(() => {
    const taymer = setTimeout(() => {
      setFaolQidiruv(qidiruvMatni.trim())
    }, 320)
    return () => clearTimeout(taymer)
  }, [qidiruvMatni])

  const sahifaOl = useCallback(async (ofset) => {
    const params = new URLSearchParams({
      sort,
      limit: String(SAHIFA),
      offset: String(ofset),
    })
    if (articleId) params.set("articleId", String(articleId))
    if (faolQidiruv) params.set("q", faolQidiruv)

    const res = await fetch(`/api/forum/posts?${params}`)
    const d = await res.json()
    if (!res.ok) throw new Error(d.error || "Yuklab bo'lmadi")
    return d
  }, [articleId, sort, faolQidiruv])

  /** Boshidan yuklash — sort, qidiruv yoki yangi postdan keyin. */
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

  const koproq = async () => {
    setYanaYuklanmoqda(true)
    try {
      const d = await sahifaOl(keyingiOfset)
      const olingan = d.posts || []
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
      setOchiq(false)
      yukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setYuborilmoqda(false)
    }
  }

  const layk = async (post) => {
    if (!kirgan) {
      toast.error("Layk uchun tizimga kiring")
      return
    }
    setPosts((oldi) =>
      oldi.map((p) =>
        p.id === post.id
          ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) }
          : p
      )
    )
    try {
      const res = await fetch(`/api/forum/posts/${post.id}/like`, { method: "POST" })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setPosts((oldi) =>
        oldi.map((p) =>
          p.id === post.id ? { ...p, likedByMe: d.liked, likes: d.likes } : p
        )
      )
    } catch (e) {
      toast.error(e.message || "Xatolik")
      yukla()
    }
  }

  const tasdiqlaOchir = async () => {
    if (!ochirMaqsad) return
    const targetId = ochirMaqsad.id
    setOchirilmoqda(true)
    try {
      const res = await fetch(`/api/forum/posts/${targetId}`, { method: "DELETE" })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || "O'chirib bo'lmadi")
      toast.success("O'chirildi")
      setPosts((oldi) => oldi.filter((p) => p.id !== targetId))
      setTotal((t) => Math.max(0, t - 1))
      setOchirMaqsad(null)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setOchirilmoqda(false)
    }
  }

  const postYangilandi = (yangiPost) => {
    if (!yangiPost) return
    setPosts((oldi) => oldi.map((p) => (p.id === yangiPost.id ? yangiPost : p)))
  }

  return (
    <section className="space-y-3.5 sm:space-y-4">
      {/* Sarlavha + Yangi mavzu tugmasi */}
      <div className="flex items-center justify-between gap-2.5 flex-wrap">
        <h2 className="text-base sm:text-lg font-bold text-[var(--v3-matn)] flex items-center gap-2">
          <Ikon nom="muhokama" olcham={19} className="text-[var(--v3-urgu)] shrink-0" />
          <span>{articleId ? "Muhokama" : "Mavzular lentasi"}</span>
          {total > 0 && (
            <span className="text-xs font-normal text-[var(--v3-xira)]">({total})</span>
          )}
        </h2>

        {kirgan && !ochiq && (
          <button
            type="button"
            onClick={() => setOchiq(true)}
            aria-expanded={ochiq}
            className="v3-tugma-asosiy text-xs sm:text-sm min-h-[40px] px-3.5 sm:px-4"
          >
            <Ikon nom="qosh" olcham={16} />
            <span>{articleId ? "Fikr yozish" : "Yangi mavzu"}</span>
          </button>
        )}
      </div>

      {/* Yozish oynasi */}
      {kirgan ? (
        ochiq && (
          <div className="v3-panel-karta p-3.5 sm:p-4 space-y-3 border border-[var(--v3-chiziq-2)]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[var(--v3-matn)]">
                {articleId ? "Fikringizni qoldiring" : "Yangi mavzu ochish"}
              </span>
              <button
                type="button"
                onClick={() => setOchiq(false)}
                aria-label="Yopish"
                className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)]"
              >
                <Ikon nom="yopish" olcham={16} />
              </button>
            </div>

            {!articleId && (
              <input
                type="text"
                value={sarlavha}
                onChange={(e) => setSarlavha(e.target.value)}
                placeholder="Mavzu sarlavhasi — masalan: KMnO4 oksidlash kuchi qachon yuqori?"
                maxLength={160}
                className="v3-kiritish w-full text-base sm:text-sm"
              />
            )}

            <textarea
              value={matn}
              onChange={(e) => setMatn(e.target.value)}
              rows={compact ? 3 : 4}
              maxLength={3000}
              placeholder={
                articleId
                  ? "Maqola haqida fikringiz..."
                  : "Savol yoki fikringizni batafsil yozing... Formulalar uchun $H_2SO_4$ ko'rinishidan foydalanishingiz mumkin."
              }
              className="v3-kiritish w-full text-base sm:text-sm resize-y"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-[11px] text-[var(--v3-xira)]">
                Admin tasdiqlagandan keyin barchaga ko&apos;rinadi · {matn.length}/3000
              </span>
              <div className="flex items-center gap-2 sm:ml-auto">
                <button
                  type="button"
                  onClick={() => setOchiq(false)}
                  disabled={yuborilmoqda}
                  className="v3-tugma text-xs sm:text-sm min-h-[42px] flex-1 sm:flex-none justify-center"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={yubor}
                  disabled={yuborilmoqda}
                  className="v3-tugma-asosiy text-xs sm:text-sm min-h-[42px] flex-1 sm:flex-none justify-center disabled:opacity-50"
                >
                  <Ikon nom="jonat" olcham={15} />
                  <span>{yuborilmoqda ? "Yuborilmoqda..." : "Yuborish"}</span>
                </button>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="v3-panel-karta p-3.5 sm:p-4 border border-dashed border-[var(--v3-chiziq-2)] flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <span className="text-[var(--v3-xira)] text-xs sm:text-sm">
            Muhokamada qatnashish va savol berish uchun tizimga kiring
          </span>
          <Link
            href="/login"
            className="v3-tugma-asosiy text-xs sm:text-sm min-h-[40px] justify-center shrink-0"
          >
            Kirish
          </Link>
        </div>
      )}

      {/* Qidiruv va saralash paneli */}
      {!articleId && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 justify-between">
          <div className="relative flex-1 min-w-0">
            <Ikon
              nom="qidiruv"
              olcham={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--v3-xira)] pointer-events-none"
            />
            <input
              type="search"
              value={qidiruvMatni}
              onChange={(e) => setQidiruvMatni(e.target.value)}
              placeholder="Mavzu yoki kalit so'z bo'yicha qidirish..."
              className="v3-kiritish w-full pl-10 pr-9 py-2 min-h-[42px] text-base sm:text-sm"
            />
            {qidiruvMatni && (
              <button
                type="button"
                onClick={() => {
                  setQidiruvMatni("")
                  setFaolQidiruv("")
                }}
                aria-label="Qidiruvni tozalash"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg inline-flex items-center justify-center text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
              >
                <Ikon nom="yopish" olcham={15} />
              </button>
            )}
          </div>

          <div
            role="tablist"
            aria-label="Mavzularni saralash"
            className="grid grid-cols-3 sm:inline-flex gap-1 p-1 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] shrink-0"
          >
            {TARTIBLAR.map(([k, label]) => {
              const faol = sort === k
              return (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={faol}
                  onClick={() => setSort(k)}
                  className={`min-h-[36px] px-3 rounded-lg text-xs font-semibold transition-all ${
                    faol
                      ? "bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] shadow-sm"
                      : "text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Ro'yxat */}
      {yuklanmoqda ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="v3-panel-karta p-4 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--v3-yuza-2)]" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-32 rounded bg-[var(--v3-yuza-2)]" />
                  <div className="h-2.5 w-20 rounded bg-[var(--v3-yuza-2)]" />
                </div>
              </div>
              <div className="h-4 w-3/4 rounded bg-[var(--v3-yuza-2)]" />
              <div className="h-3 w-full rounded bg-[var(--v3-yuza-2)]" />
            </div>
          ))}
        </div>
      ) : xato ? (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-300 text-sm flex items-center justify-between gap-3 flex-wrap">
          <span>{xato}</span>
          <button
            type="button"
            onClick={yukla}
            className="v3-tugma text-xs min-h-[36px]"
          >
            Qayta urinish
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="v3-panel-karta p-8 sm:p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-urgu)]">
            <Ikon nom={faolQidiruv ? "qidiruv" : "muhokama"} olcham={22} />
          </div>
          <p className="text-[var(--v3-xira)] text-sm">
            {faolQidiruv
              ? `"${faolQidiruv}" bo'yicha mavzu topilmadi`
              : articleId
                ? "Bu maqola hali muhokama qilinmagan — birinchi bo'ling"
                : "Hali mavzu ochilmagan — birinchi mavzuni siz boshlang"}
          </p>
          {faolQidiruv && (
            <button
              type="button"
              onClick={() => {
                setQidiruvMatni("")
                setFaolQidiruv("")
              }}
              className="v3-tugma text-xs min-h-[38px]"
            >
              Qidiruvni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => {
            const oziniki = Boolean(session?.user?.id && session.user.id === p.author?.id)
            return (
              <ForumKartochka
                key={p.id}
                post={p}
                linkTitle
                showReplyCount
                canModify={oziniki || adminmi}
                requireTitle={!p.articleId}
                onLike={layk}
                onUpdated={postYangilandi}
                onRequestDelete={setOchirMaqsad}
              />
            )
          })}

          {yanaBormi && (
            <button
              type="button"
              onClick={koproq}
              disabled={yanaYuklanmoqda}
              className="v3-tugma w-full min-h-[44px] justify-center text-sm font-semibold disabled:opacity-50"
            >
              {yanaYuklanmoqda
                ? "Yuklanmoqda..."
                : `Ko'proq ko'rsatish (${Math.max(0, total - posts.length)} ta qoldi)`}
            </button>
          )}
        </div>
      )}

      <ForumOchirishModali
        post={ochirMaqsad}
        yuklanmoqda={ochirilmoqda}
        onBekor={() => setOchirMaqsad(null)}
        onTasdiq={tasdiqlaOchir}
      />
    </section>
  )
}
