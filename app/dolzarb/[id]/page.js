"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import Ikon from "@/components/Ikon"
import { useFon } from "@/components/FonTanlagich"
import ForumKartochka, { ForumOchirishModali } from "@/components/ForumKartochka"
import { isAdminRole } from "@/lib/roles"

/**
 * Bitta mavzu va uning javoblari.
 * Javob ham admin tasdiqlagandan keyin barchaga ko'rinadi.
 */
export default function MavzuSahifasi() {
  const { id } = useParams()
  const router = useRouter()
  const [fon] = useFon()
  const { data: session, status } = useSession()
  const kirgan = status === "authenticated"
  const adminmi = Boolean(session?.user && isAdminRole(session.user.role))

  const [malumot, setMalumot] = useState(null)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xato, setXato] = useState("")
  const [javob, setJavob] = useState("")
  const [yuborilmoqda, setYuborilmoqda] = useState(false)

  const [ochirMaqsad, setOchirMaqsad] = useState(null)
  const [ochirilmoqda, setOchirilmoqda] = useState(false)

  const yukla = useCallback(async () => {
    try {
      const res = await fetch(`/api/forum/posts/${id}`)
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || "Yuklab bo'lmadi")
      setMalumot(d)
      setXato("")
    } catch (e) {
      setXato(e.message)
    } finally {
      setYuklanmoqda(false)
    }
  }, [id])

  useEffect(() => { yukla() }, [yukla])

  const javobYubor = async () => {
    if (javob.trim().length < 2) {
      toast.error("Javob yozing")
      return
    }
    setYuborilmoqda(true)
    try {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId: id, content: javob }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || "Yuborib bo'lmadi")
      toast.success(d.message, { duration: 5000 })
      setJavob("")
      yukla()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setYuborilmoqda(false)
    }
  }

  // Optimistik layk — butun sahifani qayta yuklamasdan darhol yangilanadi
  const layk = async (targetPost) => {
    if (!kirgan) {
      toast.error("Layk uchun tizimga kiring")
      return
    }

    const postId = targetPost.id
    const almashtir = (p, liked, likes) =>
      p.id === postId ? { ...p, likedByMe: liked, likes } : p

    setMalumot((oldi) => {
      if (!oldi) return oldi
      const yangiLiked = !targetPost.likedByMe
      const yangiLikes = targetPost.likes + (yangiLiked ? 1 : -1)
      return {
        ...oldi,
        post: almashtir(oldi.post, yangiLiked, yangiLikes),
        replies: (oldi.replies || []).map((r) => almashtir(r, yangiLiked, yangiLikes)),
      }
    })

    try {
      const res = await fetch(`/api/forum/posts/${postId}/like`, { method: "POST" })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || "Xatolik")
      setMalumot((oldi) => {
        if (!oldi) return oldi
        return {
          ...oldi,
          post: almashtir(oldi.post, d.liked, d.likes),
          replies: (oldi.replies || []).map((r) => almashtir(r, d.liked, d.likes)),
        }
      })
    } catch (e) {
      toast.error(e.message || "Xatolik")
      yukla()
    }
  }

  const postYangilandi = (yangiPost) => {
    if (!yangiPost) return
    setMalumot((oldi) => {
      if (!oldi) return oldi
      if (oldi.post.id === yangiPost.id) {
        return { ...oldi, post: yangiPost }
      }
      return {
        ...oldi,
        replies: (oldi.replies || []).map((r) => (r.id === yangiPost.id ? yangiPost : r)),
      }
    })
  }

  const tasdiqlaOchir = async () => {
    if (!ochirMaqsad) return
    const target = ochirMaqsad
    setOchirilmoqda(true)
    try {
      const res = await fetch(`/api/forum/posts/${target.id}`, { method: "DELETE" })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || "O'chirib bo'lmadi")

      toast.success("O'chirildi")
      setOchirMaqsad(null)

      if (malumot?.post?.id === target.id) {
        router.push("/dolzarb")
        return
      }
      setMalumot((oldi) => {
        if (!oldi) return oldi
        return {
          ...oldi,
          replies: (oldi.replies || []).filter((r) => r.id !== target.id),
        }
      })
    } catch (e) {
      toast.error(e.message)
    } finally {
      setOchirilmoqda(false)
    }
  }

  if (yuklanmoqda) {
    return (
      <main data-fon={fon} className="v3 min-h-screen flex items-center justify-center p-4 font-serif overflow-x-hidden">
        <div className="v3-panel-karta px-6 py-4 text-sm text-[var(--v3-xira)]">
          Yuklanmoqda...
        </div>
      </main>
    )
  }

  if (xato || !malumot) {
    return (
      <main data-fon={fon} className="v3 min-h-screen flex items-center justify-center p-4 font-serif overflow-x-hidden">
        <div className="v3-panel-karta border-red-500/40 p-6 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center bg-red-500/15 border border-red-500/30 text-red-400">
            <Ikon nom="ogohlantirish" olcham={22} />
          </div>
          <p className="text-red-300 text-sm">{xato || "Mavzu topilmadi"}</p>
          <Link
            href="/dolzarb"
            className="v3-tugma inline-flex items-center gap-2 text-sm min-h-[42px]"
          >
            <Ikon nom="chap" olcham={16} />
            <span>Barcha mavzular</span>
          </Link>
        </div>
      </main>
    )
  }

  const { post, replies = [] } = malumot
  const mavzuMuallifi = Boolean(session?.user?.id && session.user.id === post.author?.id)

  return (
    <main data-fon={fon} className="v3 min-h-screen flex flex-col font-serif overflow-x-hidden">
      <header className="v3-header">
        <div className="v3-konteyner max-w-3xl mx-auto w-full flex items-center justify-between gap-3 py-2.5 sm:py-3.5">
          <Link
            href="/dolzarb"
            className="min-h-[40px] inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:border-[var(--v3-chiziq-2)] text-[var(--v3-matn)] text-xs sm:text-sm font-medium transition shrink-0"
          >
            <Ikon nom="chap" olcham={16} />
            <span>Barcha mavzular</span>
          </Link>
          <span className="text-xs text-[var(--v3-xira)] truncate">
            {replies.length > 0 ? `${replies.length} ta javob` : "Muhokama"}
          </span>
        </div>
      </header>

      <section className="v3-konteyner max-w-3xl mx-auto w-full py-4 sm:py-6 pb-10 space-y-3.5 sm:space-y-4">
        <ForumKartochka
          post={post}
          asosiy
          canModify={mavzuMuallifi || adminmi}
          requireTitle={!post.articleId}
          onLike={layk}
          onUpdated={postYangilandi}
          onRequestDelete={setOchirMaqsad}
        />

        <div className="flex items-center justify-between pt-2">
          <h2 className="text-xs sm:text-sm font-semibold text-[var(--v3-xira)] flex items-center gap-2">
            <Ikon nom="muhokama" olcham={16} className="text-[var(--v3-urgu-2)]" />
            <span>
              {replies.length > 0 ? `${replies.length} ta javob` : "Hali javob yo'q"}
            </span>
          </h2>
        </div>

        <div className="space-y-3 pl-3 sm:pl-5 border-l-2 border-[var(--v3-chiziq)]">
          {replies.map((r) => {
            const javobMuallifi = Boolean(session?.user?.id && session.user.id === r.author?.id)
            return (
              <ForumKartochka
                key={r.id}
                post={r}
                canModify={javobMuallifi || adminmi}
                requireTitle={false}
                onLike={layk}
                onUpdated={postYangilandi}
                onRequestDelete={setOchirMaqsad}
              />
            )
          })}
        </div>

        {/* Javob yozish */}
        {post.status === "approved" && (
          kirgan ? (
            <div className="v3-panel-karta p-3.5 sm:p-4 space-y-3 mt-2">
              <label htmlFor="javob-maydon" className="block text-xs font-semibold text-[var(--v3-matn)]">
                Javobingizni yozing
              </label>
              <textarea
                id="javob-maydon"
                value={javob}
                onChange={(e) => setJavob(e.target.value)}
                rows={3}
                maxLength={3000}
                placeholder="Fikringiz yoki yechimingiz... Formulalar uchun $H_2SO_4$ shaklidan foydalanishingiz mumkin."
                className="v3-kiritish w-full text-base sm:text-sm resize-y"
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <span className="text-[11px] text-[var(--v3-xira)]">
                  Admin tasdiqlagandan keyin ko&apos;rinadi · {javob.length}/3000
                </span>
                <button
                  type="button"
                  onClick={javobYubor}
                  disabled={yuborilmoqda}
                  className="v3-tugma-asosiy text-sm min-h-[44px] w-full sm:w-auto justify-center disabled:opacity-50"
                >
                  <Ikon nom="jonat" olcham={15} />
                  <span>{yuborilmoqda ? "Yuborilmoqda..." : "Javob berish"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="v3-panel-karta border-dashed border-[var(--v3-chiziq-2)] p-4 text-center space-y-2.5">
              <p className="text-xs sm:text-sm text-[var(--v3-xira)]">
                Muhokamaga javob yozish uchun tizimga kiring
              </p>
              <Link
                href="/login"
                className="v3-tugma-asosiy inline-flex text-sm min-h-[42px] justify-center"
              >
                Kirish
              </Link>
            </div>
          )
        )}
      </section>

      <ForumOchirishModali
        post={ochirMaqsad}
        yuklanmoqda={ochirilmoqda}
        onBekor={() => setOchirMaqsad(null)}
        onTasdiq={tasdiqlaOchir}
      />
    </main>
  )
}
