"use client"

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import SertifikatKarta from './SertifikatKarta'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'
import Ikon from '@/components/Ikon'
import { sana } from '@/lib/sana'
import { chatKirishHavolasi } from '@/lib/chat-interfeys'

const CONFIG = {
  achievements: { title: 'Yutuqlar', subtitle: 'Qo‘lga kiritgan ilmiy va amaliy yutuqlaringiz', ikon: 'orin' },
  certificates: { title: 'Sertifikatlar', subtitle: 'Rasmiy hujjatlar', ikon: 'fayl' },
  ms_urinishlar: { title: 'Milliy Sertifikat natijalari', subtitle: 'Topshirilgan Rasch va tayyorgarlik sinovlari', ikon: 'sertifikat' },
  quizzes: { title: 'Quiz natijalari', subtitle: 'So‘nggi topshirilgan quizlar tarixi', ikon: 'quiz' },
  friends: { title: "Do‘stlar", subtitle: "Platformadagi do‘stlaringiz ro‘yxati", ikon: 'odamlar' },
  followers: { title: 'Obunachilar', subtitle: 'Sizga obuna bo‘lgan foydalanuvchilar', ikon: 'odam' },
  following: { title: 'Obunalar', subtitle: 'Siz obuna bo‘lgan foydalanuvchilar', ikon: 'tashqi' }
}

const ODAMLAR = new Set(['friends', 'followers', 'following'])

const BOSH_HOLAT = {
  certificates: {
    matn: 'Sertifikatingiz yo‘q.',
    izoh: 'Sinov yoki olimpiadada sertifikat oling.',
    havola: { href: '/milliy-sertifikat', matn: 'Sinovlar' },
  },
  ms_urinishlar: {
    matn: 'Hali MS sinovlarini topshirmagansiz.',
    izoh: 'Milliy Sertifikat tayyorgarlik sinovida qatnashing — natijangiz shu yerda ko‘rinadi.',
    havola: { href: '/milliy-sertifikat', matn: 'Sinovga o‘tish' },
  },
  friends: {
    matn: "Hali do'st qo'shmagansiz.",
    izoh: "Qidiruvdan ism, username yoki ID bo'yicha odam toping va taklif yuboring.",
  },
  followers: {
    matn: 'Sizga hali hech kim obuna bo‘lmagan.',
    izoh: 'Faolroq bo‘lsangiz — quiz yeching, muhokamada qatnashing — sizni topishadi.',
    havola: { href: '/profil/dostlar', matn: "Do'st qidirish" },
  },
  following: {
    matn: 'Siz hali hech kimga obuna bo‘lmagansiz.',
    izoh: 'Boshqa foydalanuvchini toping va uning profilidan obuna bo‘ling.',
    havola: { href: '/profil/dostlar', matn: 'Odam qidirish' },
  },
}

const FETCH_TIMEOUT_MS = 15000
const PAGE_SIZE = 20

function nameOf(item) {
  return item.name || item.fullName || item.username || item.quizName || item.examName || 'Noma’lum'
}

export default function ProfileCollection({ type, actions = null, refreshKey = 0 }) {
  const config = CONFIG[type] || CONFIG.achievements
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [busyItemId, setBusyItemId] = useState(null)

  const handleRemoveFriend = async (item) => {
    if (!confirm(`${nameOf(item)} ni do'stlar ro'yxatidan chiqarmoqchimisiz?`)) return
    setBusyItemId(item.id)
    try {
      const res = await fetch('/api/friends', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId: item.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Do'stlikdan chiqarib bo'lmadi")
      setItems((prev) => prev.filter((x) => x.id !== item.id))
      toast.success(data.message || "Do'stlar ro'yxatidan chiqarildi")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusyItemId(null)
    }
  }

  const handleUnfollowItem = async (item) => {
    if (!confirm(`${nameOf(item)} ga obunani bekor qilmoqchimisiz?`)) return
    setBusyItemId(item.id)
    try {
      const res = await fetch('/api/follow', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: item.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Obunani bekor qilib bo'lmadi")
      setItems((prev) => prev.filter((x) => x.id !== item.id))
      toast.success(data.message || 'Obuna bekor qilindi')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusyItemId(null)
    }
  }

  const loadPage = useCallback(async (pageToLoad) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    try {
      const response = await fetch(`/api/profil/collection?type=${type}&page=${pageToLoad}&limit=${PAGE_SIZE}`, {
        signal: controller.signal
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.error || 'Ma’lumot yuklanmadi')

      setItems(prev => (pageToLoad === 1 ? payload.items : [...prev, ...payload.items]))
      setHasMore(Boolean(payload.hasMore))
      setPage(pageToLoad)
      setError('')
    } catch (err) {
      setError(err.name === 'AbortError' ? 'Server javob berishga juda ko‘p vaqt oldi. Qayta urinib ko‘ring.' : err.message)
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [type])

  useEffect(() => {
    setIsLoading(true)
    setItems([])
    loadPage(1)
  }, [loadPage, refreshKey])

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    loadPage(page + 1)
  }

  if (!config) return null

  const royxat = error && items.length === 0 ? (
    <div className="v3-panel-karta p-6 text-center space-y-3">
      <p className="text-xs text-red-400">{error}</p>
      <button
        onClick={() => { setIsLoading(true); loadPage(1) }}
        className="v3-tugma v3-tugma-asosiy text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5"
      >
        <Ikon nom="qayta" olcham={14} />
        Qayta urinish
      </button>
    </div>
  ) : isLoading ? (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
        <Ikon nom="vaqt" olcham={28} className="animate-spin" />
        <span className="text-xs">Ma{"'"}lumotlar yuklanmoqda...</span>
      </div>
    </div>
  ) : (
    <>
      {items.length === 0 ? (
        <div className="v3-panel-karta py-16 text-center text-xs text-[var(--v3-xira)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom={config.ikon} olcham={20} />
          </div>
          {BOSH_HOLAT[type] ? (
            <div className="space-y-1 max-w-sm mx-auto">
              <p className="font-bold text-[var(--v3-matn)] text-sm">{BOSH_HOLAT[type].matn}</p>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed">{BOSH_HOLAT[type].izoh}</p>
              {BOSH_HOLAT[type].havola && (
                <div className="pt-3">
                  <Link
                    href={BOSH_HOLAT[type].havola.href}
                    className="v3-tugma v3-tugma-asosiy text-xs py-1.5 px-3.5 inline-flex font-bold"
                  >
                    {BOSH_HOLAT[type].havola.matn} →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            'Hali bu yerda ma’lumot yo‘q.'
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-3.5 md:grid-cols-2">
            {items.map((item) =>
              type === 'certificates' ? (
                <SertifikatKarta key={item.id} sertifikat={item} />
              ) : type === 'ms_urinishlar' ? (
                <article key={item.id} className="v3-panel-karta p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="font-bold text-sm text-[var(--v3-matn)] break-words">
                        {item.examName || item.slug}
                      </h2>
                      <div className="text-[11px] font-mono text-[var(--v3-xira)] mt-0.5">
                        {sana(item.yakunlanganVaqt || item.boshlanganVaqt)}
                      </div>
                    </div>
                    {item.elonQilingan ? (
                      <span className="v3-tag v3-tag-ochiq text-xs font-mono font-bold shrink-0">
                        {item.daraja || '—'} · {item.shkalaBalli}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                        <Ikon nom="vaqt" olcham={11} />
                        Kutilmoqda
                      </span>
                    )}
                  </div>

                  {item.elonQilingan ? (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--v3-chiziq)] text-[11px]">
                      <div>
                        <div className="text-[var(--v3-xira)]">To{"'"}g{"'"}ri</div>
                        <div className="font-mono font-bold text-[var(--v3-matn)]">
                          {item.rawScore}/{item.jamiSavollar} ({item.oddiyFoiz ?? 0}%)
                        </div>
                      </div>
                      <div>
                        <div className="text-[var(--v3-xira)]">Theta</div>
                        <div className="font-mono font-bold text-[var(--v3-matn)]">
                          {item.theta > 0 ? `+${item.theta}` : item.theta}
                        </div>
                      </div>
                      <div>
                        <div className="text-[var(--v3-xira)]">O{"'"}rin</div>
                        <div className="font-mono font-bold text-[var(--v3-matn)]">
                          {item.cohortRank && item.cohortTotal
                            ? `${item.cohortRank}/${item.cohortTotal}`
                            : item.percentile != null
                            ? `Top ${Math.max(1, Math.round(100 - item.percentile))}%`
                            : '—'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--v3-xira)]">
                      Natijalar kohort baholashi yakunlangach e{"'"}lon qilinadi.
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {item.elonQilingan && (
                      <Link
                        href={`/milliy-sertifikat/${item.slug}`}
                        className="v3-tugma text-[11px] py-1 px-2.5 inline-flex items-center gap-1"
                      >
                        <Ikon nom="grafik" olcham={12} />
                        <span>Tahlil</span>
                      </Link>
                    )}
                    {item.certId && (
                      <Link
                        href={`/tekshirish/${item.certId}`}
                        className="v3-tugma v3-tugma-asosiy text-[11px] py-1 px-2.5 inline-flex items-center gap-1 font-bold"
                      >
                        <Ikon nom="sertifikat" olcham={12} />
                        <span>Sertifikat ({item.certId})</span>
                      </Link>
                    )}
                  </div>
                </article>
              ) : ODAMLAR.has(type) ? (
                <div
                  key={item.id}
                  className="v3-panel-karta p-4 flex items-center gap-3 hover:border-[var(--v3-chiziq-2)] transition-all"
                >
                  <Link
                    href={`/profil/${item.userId || item.id}`}
                    className="flex items-center gap-3.5 min-w-0 flex-1 group"
                  >
                    <div className="w-11 h-11 flex-shrink-0 grid place-items-center overflow-hidden rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-xs font-bold text-[var(--v3-urgu)]">
                      {item.avatar ? (
                        <img src={item.avatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        (item.fullName || item.username || '?')[0].toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-bold text-xs text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                          {nameOf(item)}
                        </span>
                        <TasdiqBelgisi tasdiqlangan={item.isVerified} olcham="kichik" />
                      </div>
                      {item.username && (
                        <div className="truncate text-[10.5px] text-[var(--v3-xira)] font-mono">
                          @{item.username}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.userId ? (
                      <Link
                        href={chatKirishHavolasi({
                          yozishUserId: item.userId,
                          qaytish:
                            type === 'friends'
                              ? '/profil/dostlar'
                              : type === 'following'
                              ? '/profil/obunalar'
                              : type === 'followers'
                              ? '/profil/obunachilar'
                              : '/profil',
                        })}
                        className="v3-tugma text-xs py-1.5 px-2.5 shrink-0 inline-flex items-center gap-1.5"
                        title="Xabar yozish"
                      >
                        <Ikon nom="xabar" olcham={13} />
                        <span className="hidden sm:inline">Yozish</span>
                      </Link>
                    ) : (
                      <Ikon nom="ong" olcham={14} className="text-[var(--v3-xira)] shrink-0" />
                    )}

                    {type === 'friends' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFriend(item)}
                        disabled={busyItemId === item.id}
                        className="v3-tugma text-xs py-1.5 px-2.5 text-red-400 hover:border-red-500/40 shrink-0 inline-flex items-center gap-1 disabled:opacity-50"
                        title="Do'stlikdan chiqarish"
                      >
                        <Ikon nom="ochir" olcham={13} />
                        <span className="hidden sm:inline">
                          {busyItemId === item.id ? '...' : 'Chiqarish'}
                        </span>
                      </button>
                    )}

                    {type === 'following' && (
                      <button
                        type="button"
                        onClick={() => handleUnfollowItem(item)}
                        disabled={busyItemId === item.id}
                        className="v3-tugma text-xs py-1.5 px-2.5 text-red-400 hover:border-red-500/40 shrink-0 inline-flex items-center gap-1 disabled:opacity-50"
                        title="Obunani bekor qilish"
                      >
                        <Ikon nom="yopish" olcham={13} />
                        <span className="hidden sm:inline">
                          {busyItemId === item.id ? '...' : 'Obunani uzish'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <article key={item.id} className="v3-panel-karta p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold text-sm text-[var(--v3-matn)]">{nameOf(item)}</h2>
                    {item.percentage != null ? (
                      <span className="v3-tag v3-tag-ochiq text-[11px] font-mono font-bold">
                        {item.percentage}%
                      </span>
                    ) : item.rarity ? (
                      <span className="v3-tag v3-tag-yopiq text-[10px]">
                        {item.rarity}
                      </span>
                    ) : null}
                  </div>
                  {item.description && (
                    <p className="text-xs text-[var(--v3-xira)] leading-relaxed">{item.description}</p>
                  )}
                </article>
              )
            )}
          </div>
          {hasMore && (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full v3-tugma py-2.5 text-xs font-bold justify-center"
            >
              {isLoadingMore ? 'Yuklanmoqda...' : 'Ko‘proq yuklash ↓'}
            </button>
          )}
        </>
      )}
    </>
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--v3-chiziq)]">
        <div>
          <div className="v3-nishon">Shaxsiy to{"'"}plam</div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--v3-matn)] flex items-center gap-2">
            <Ikon nom={config.ikon} olcham={22} className="text-[var(--v3-urgu)]" />
            <span>{config.title}</span>
          </h1>
          <p className="text-xs text-[var(--v3-xira)] mt-1">{config.subtitle}</p>
        </div>
      </div>

      {actions}
      {royxat}
    </div>
  )
}
