"use client"

import { useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { qachon } from "@/lib/sana"
import Ikon from "@/components/Ikon"
import TasdiqBelgisi from "@/components/TasdiqBelgisi"
import LatexBoyMatn from "@/components/LatexBoyMatn"

/**
 * Forum mavzusi va javoblari uchun umumiy karta.
 * Lenta (/dolzarb) va mavzu sahifasi (/dolzarb/[id]) bitta ko'rinish va
 * tahrir/layk/o'chirish mantiqini bo'lishadi.
 */
export default function ForumKartochka({
  post,
  asosiy = false,
  linkTitle = false,
  showReplyCount = false,
  canModify = false,
  requireTitle = true,
  onLike,
  onUpdated,
  onRequestDelete,
}) {
  const [tahrirda, setTahrirda] = useState(false)
  const [sarlavha, setSarlavha] = useState(post.title || "")
  const [matn, setMatn] = useState(post.content || "")
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)

  const kutmoqda = post.status === "pending"
  const radEtilgan = post.status === "rejected"
  const tasdiqlangan = post.status === "approved"

  const chegaraKlass = radEtilgan
    ? "border-red-500/45"
    : kutmoqda
      ? "border-amber-500/45"
      : post.isPinned
        ? "border-[var(--v3-urgu)]/45"
        : "border-[var(--v3-chiziq)]"

  const tahrirniOch = () => {
    setSarlavha(post.title || "")
    setMatn(post.content || "")
    setTahrirda(true)
  }

  const tahrirniSaqla = async () => {
    if (matn.trim().length < 2) {
      toast.error("Matn yozing")
      return
    }
    if (requireTitle && sarlavha.trim().length < 5) {
      toast.error("Sarlavha kamida 5 ta belgidan iborat bo'lsin")
      return
    }

    setSaqlanmoqda(true)
    try {
      const res = await fetch(`/api/forum/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: requireTitle ? sarlavha : undefined,
          content: matn,
        }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || "Saqlab bo'lmadi")

      toast.success(d.message || "Yangilandi", { duration: 4000 })
      setTahrirda(false)
      onUpdated?.(d.post)
    } catch (e) {
      toast.error(e.message || "Xatolik")
    } finally {
      setSaqlanmoqda(false)
    }
  }

  const muallifNomi = post.author?.fullName || post.author?.username || "Foydalanuvchi"
  const avatarHarf = muallifNomi[0].toUpperCase()

  return (
    <article
      className={`v3-panel-karta p-3.5 sm:p-5 border ${chegaraKlass} transition-colors`}
    >
      {/* Muallif va holat nishonlari */}
      <div className="flex items-start gap-2.5 sm:gap-3">
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden border border-[var(--v3-chiziq)]"
          style={{
            background: "linear-gradient(135deg, var(--v3-urgu), var(--v3-urgu-2))",
            color: "var(--v3-urgu-matn)",
          }}
        >
          {post.author?.avatar ? (
            <img
              src={post.author.avatar}
              alt={muallifNomi}
              className="w-full h-full object-cover"
            />
          ) : (
            avatarHarf
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[var(--v3-matn)] text-sm inline-flex items-center gap-1 min-w-0 max-w-full">
              <span className="truncate">{muallifNomi}</span>
              <TasdiqBelgisi tasdiqlangan={post.author?.isVerified} olcham="kichik" />
            </span>

            {post.isPinned && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-[var(--v3-urgu)]/40 bg-[var(--v3-urgu)]/10 text-[var(--v3-urgu)] font-medium">
                <Ikon nom="qadash" olcham={11} />
                Qadalgan
              </span>
            )}

            {kutmoqda && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-300 font-medium">
                <Ikon nom="soat" olcham={11} />
                Tekshiruvda
              </span>
            )}

            {radEtilgan && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-red-500/45 bg-red-500/15 text-red-300 font-medium">
                <Ikon nom="ogohlantirish" olcham={11} />
                Rad etilgan
              </span>
            )}
          </div>

          <div className="text-[11px] text-[var(--v3-xira)] mt-0.5">
            {qachon(post.createdAt)}
          </div>
        </div>
      </div>

      {/* Rad etish sababi (faqat muallif ko'radi) */}
      {radEtilgan && !tahrirda && (
        <div className="mt-3 rounded-xl border border-red-500/35 bg-red-500/10 p-3 space-y-2">
          <div className="text-xs text-red-200 leading-relaxed">
            <span className="font-semibold text-red-300">Moderator izohi: </span>
            {post.rejectReason ||
              "Post forum qoidalariga mos kelmadi. Uni tahrirlab qayta tekshiruvga yuborishingiz mumkin."}
          </div>
          {canModify && (
            <button
              type="button"
              onClick={tahrirniOch}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-200 hover:text-white underline underline-offset-4"
            >
              <Ikon nom="tahrir" olcham={13} />
              Tahrirlab qayta yuborish
            </button>
          )}
        </div>
      )}

      {/* Mazmun yoki tahrir shakli */}
      {tahrirda ? (
        <div className="mt-3 space-y-3">
          {requireTitle && (
            <input
              type="text"
              value={sarlavha}
              onChange={(e) => setSarlavha(e.target.value)}
              maxLength={160}
              placeholder="Mavzu sarlavhasi"
              className="v3-kiritish w-full text-base sm:text-sm"
            />
          )}
          <textarea
            value={matn}
            onChange={(e) => setMatn(e.target.value)}
            rows={4}
            maxLength={3000}
            placeholder="Matn..."
            className="v3-kiritish w-full text-base sm:text-sm resize-y"
          />
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] text-[var(--v3-xira)]">
              Saqlangach qayta tekshiruvga tushadi · {matn.length}/3000
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setTahrirda(false)}
                disabled={saqlanmoqda}
                className="v3-tugma text-xs min-h-[38px]"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={tahrirniSaqla}
                disabled={saqlanmoqda}
                className="v3-tugma-asosiy text-xs min-h-[38px] disabled:opacity-50"
              >
                {saqlanmoqda ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 min-w-0">
          {post.title && (
            asosiy ? (
              <h1 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] mb-2 leading-snug break-words">
                {post.title}
              </h1>
            ) : linkTitle ? (
              <Link href={`/dolzarb/${post.id}`} className="block group">
                <h3 className="font-bold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors text-base sm:text-[17px] mb-1.5 leading-snug break-words">
                  {post.title}
                </h3>
              </Link>
            ) : (
              <h3 className="font-bold text-[var(--v3-matn)] text-base mb-1.5 leading-snug break-words">
                {post.title}
              </h3>
            )
          )}

          <div className="text-[var(--v3-matn)]/90 text-sm sm:text-[15px] leading-relaxed break-words overflow-hidden">
            <LatexBoyMatn matn={post.content} />
          </div>
        </div>
      )}

      {/* Pastki amallar — mobil barmoqqa qulay (>=40px) */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[var(--v3-chiziq)]">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => onLike?.(post)}
            disabled={!tasdiqlangan}
            aria-label={post.likedByMe ? "Laykni olish" : "Layk bosish"}
            className={`min-h-[40px] px-2.5 sm:px-3 -ml-1.5 rounded-xl inline-flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
              post.likedByMe
                ? "text-pink-400 bg-pink-500/10"
                : "text-[var(--v3-xira)] hover:text-pink-400 hover:bg-[var(--v3-yuza-2)]"
            }`}
          >
            <Ikon
              nom="yurak"
              olcham={16}
              fill={post.likedByMe ? "currentColor" : "none"}
            />
            <span>{post.likes}</span>
          </button>

          {showReplyCount && (
            <Link
              href={`/dolzarb/${post.id}`}
              className="min-h-[40px] px-2.5 sm:px-3 rounded-xl inline-flex items-center gap-1.5 text-xs font-medium text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)] transition-colors"
            >
              <Ikon nom="muhokama" olcham={16} />
              <span>{post.replyCount} javob</span>
            </Link>
          )}
        </div>

        {canModify && !tahrirda && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={tahrirniOch}
              title="Tahrirlash"
              aria-label="Tahrirlash"
              className="min-h-[40px] min-w-[40px] px-2.5 rounded-xl inline-flex items-center justify-center gap-1 text-xs text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)] transition-colors"
            >
              <Ikon nom="tahrir" olcham={15} />
              <span className="hidden sm:inline">Tahrirlash</span>
            </button>
            <button
              type="button"
              onClick={() => onRequestDelete?.(post)}
              title="O'chirish"
              aria-label="O'chirish"
              className="min-h-[40px] min-w-[40px] px-2.5 rounded-xl inline-flex items-center justify-center gap-1 text-xs text-[var(--v3-xira)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Ikon nom="ochir" olcham={15} />
              <span className="hidden sm:inline">O&apos;chirish</span>
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

/** Brauzerning `confirm()` oynasi o'rniga v4 uslubidagi o'chirish tasdiq oynasi. */
export function ForumOchirishModali({ post, yuklanmoqda = false, onBekor, onTasdiq }) {
  if (!post) return null

  const javobmi = Boolean(post.parentId)

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forum-ochir-sarlavha"
      onClick={() => !yuklanmoqda && onBekor?.()}
    >
      <div
        className="bg-[var(--v3-fon)] border border-red-500/40 rounded-2xl p-5 sm:p-6 max-w-sm w-full space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
            <Ikon nom="ochir" olcham={18} />
          </div>
          <div>
            <h3 id="forum-ochir-sarlavha" className="text-base font-bold text-[var(--v3-matn)]">
              {javobmi ? "Javobni o'chirish" : "Mavzuni o'chirish"}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--v3-xira)] mt-1 leading-relaxed">
              {javobmi
                ? "Ushbu javob butunlay o'chirilsinmi?"
                : "Mavzu va uning barcha javoblari butunlay o'chib ketadi."}
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onBekor}
            disabled={yuklanmoqda}
            className="v3-tugma text-sm min-h-[42px]"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={onTasdiq}
            disabled={yuklanmoqda}
            className="px-4 py-2 min-h-[42px] rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            {yuklanmoqda ? "O'chirilmoqda..." : "O'chirish"}
          </button>
        </div>
      </div>
    </div>
  )
}
