// components/ProfilHikoyalar.jsx
"use client"
//
// 24 soatlik "Ilmiy Hikoyalar" (Stories) tasmasi, yaratish oynasi
// (dolzarb mavzu yoki postni hikoyaga ulashish) va to'liq ekranli ko'rish oynasi.

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Ikon from '@/components/Ikon'
import TasdiqBelgisi from '@/components/TasdiqBelgisi'
import { qachon } from '@/lib/sana'
import {
  MAX_HIKOYA_MATN,
  HIKOYA_TURLARI,
  HIKOYA_USLUBLARI,
  hikoyaTuriHaqida,
  hikoyaUslubiHaqida,
} from '@/lib/hikoya-turlari'
import { tegHaqida } from '@/lib/post-tavsiyalar'

const SLAYD_VAQTI_MS = 6500
const MUSTAQIL_TURLAR = HIKOYA_TURLARI.filter((t) => t.kalit !== 'repost')

export default function ProfilHikoyalar({
  muallifId = null,
  ulashilayotganPost = null,
  onUlashishYopildi = null,
}) {
  const { data: session } = useSession()
  const [guruhlar, setGuruhlar] = useState([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)

  // Yaratish modali holati
  const [yaratishOchiq, setYaratishOchiq] = useState(false)
  const [turi, setTuri] = useState('dolzarb')
  const [uslub, setUslub] = useState('kosmik')
  const [matn, setMatn] = useState('')
  const [repostPost, setRepostPost] = useState(null)
  const [joylanmoqda, setJoylanmoqda] = useState(false)

  // Ko'rish (Story Viewer) modali holati
  const [faolGuruhIdx, setFaolGuruhIdx] = useState(null)
  const [faolSlaydIdx, setFaolSlaydIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [toxtatilgan, setToxtatilgan] = useState(false)

  const yukla = useCallback(async () => {
    try {
      const manzil = muallifId
        ? `/api/profil/hikoyalar?muallifId=${encodeURIComponent(muallifId)}`
        : '/api/profil/hikoyalar'
      const res = await fetch(manzil)
      const data = await res.json().catch(() => ({}))
      if (res.ok && Array.isArray(data.guruhlar)) {
        setGuruhlar(data.guruhlar)
      }
    } catch {
      // jim
    } finally {
      setYuklanmoqda(false)
    }
  }, [muallifId])

  useEffect(() => {
    yukla()
  }, [yukla])

  // Tashqaridan "Hikoyaga ulashish" bosilganda modalni darhol ochamiz
  useEffect(() => {
    if (ulashilayotganPost) {
      setRepostPost(ulashilayotganPost)
      setTuri('repost')
      setMatn('')
      setYaratishOchiq(true)
    }
  }, [ulashilayotganPost])

  const yaratishniYop = () => {
    setYaratishOchiq(false)
    setRepostPost(null)
    setMatn('')
    if (onUlashishYopildi) onUlashishYopildi()
  }

  const yangiHikoyaOch = () => {
    setRepostPost(null)
    setTuri('dolzarb')
    setMatn('')
    setYaratishOchiq(true)
  }

  const faolGuruh = faolGuruhIdx !== null ? guruhlar[faolGuruhIdx] || null : null
  const faolHikoya = faolGuruh ? faolGuruh.hikoyalar?.[faolSlaydIdx] || null : null

  const korishniYop = useCallback(() => {
    setFaolGuruhIdx(null)
    setFaolSlaydIdx(0)
    setProgress(0)
    setToxtatilgan(false)
  }, [])

  const keyingiSlayd = useCallback(() => {
    if (faolGuruhIdx === null) return
    const guruh = guruhlar[faolGuruhIdx]
    if (!guruh) {
      korishniYop()
      return
    }
    if (faolSlaydIdx + 1 < guruh.hikoyalar.length) {
      setFaolSlaydIdx((s) => s + 1)
      setProgress(0)
    } else if (faolGuruhIdx + 1 < guruhlar.length) {
      setFaolGuruhIdx((g) => g + 1)
      setFaolSlaydIdx(0)
      setProgress(0)
    } else {
      korishniYop()
    }
  }, [faolGuruhIdx, faolSlaydIdx, guruhlar, korishniYop])

  const oldingiSlayd = useCallback(() => {
    if (faolGuruhIdx === null) return
    if (faolSlaydIdx > 0) {
      setFaolSlaydIdx((s) => s - 1)
      setProgress(0)
    } else if (faolGuruhIdx > 0) {
      const oldGuruh = guruhlar[faolGuruhIdx - 1]
      setFaolGuruhIdx((g) => g - 1)
      setFaolSlaydIdx(Math.max(0, (oldGuruh?.hikoyalar?.length || 1) - 1))
      setProgress(0)
    } else {
      setProgress(0)
    }
  }, [faolGuruhIdx, faolSlaydIdx, guruhlar])

  // Hikoya ochilganda "ko'rildi" deb belgilash
  useEffect(() => {
    if (!faolHikoya || !session?.user?.id) return
    if (faolHikoya.korildimi && faolGuruh?.ozimniki) return

    const storyId = faolHikoya.id
    fetch('/api/profil/hikoyalar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: storyId, amal: 'korildi' }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!d?.success) return
        setGuruhlar((old) =>
          old.map((g) => ({
            ...g,
            hikoyalar: g.hikoyalar.map((h) =>
              h.id === storyId
                ? {
                    ...h,
                    korildimi: true,
                    korishlarSoni: d.korishlarSoni ?? h.korishlarSoni,
                  }
                : h
            ),
            yangiSoni: g.hikoyalar.filter(
              (h) => h.id !== storyId && !h.korildimi && !g.ozimniki
            ).length,
          }))
        )
      })
      .catch(() => {})
  }, [faolHikoya?.id, session?.user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Avtomatik progress taymeri
  useEffect(() => {
    if (!faolHikoya || toxtatilgan) return
    const qadamMs = 65
    const ortish = (qadamMs / SLAYD_VAQTI_MS) * 100

    const timer = setInterval(() => {
      setProgress((eski) => {
        if (eski + ortish >= 100) {
          return 100
        }
        return eski + ortish
      })
    }, qadamMs)

    return () => clearInterval(timer)
  }, [faolHikoya, toxtatilgan])

  useEffect(() => {
    if (progress >= 100 && faolHikoya) {
      keyingiSlayd()
    }
  }, [progress, faolHikoya, keyingiSlayd])

  // Klaviatura boshqaruvi
  useEffect(() => {
    if (faolGuruhIdx === null) return
    const tugmaBosildi = (e) => {
      if (e.key === 'Escape') korishniYop()
      if (e.key === 'ArrowRight') keyingiSlayd()
      if (e.key === 'ArrowLeft') oldingiSlayd()
    }
    window.addEventListener('keydown', tugmaBosildi)
    return () => window.removeEventListener('keydown', tugmaBosildi)
  }, [faolGuruhIdx, korishniYop, keyingiSlayd, oldingiSlayd])

  const hikoyaJoyla = async (e) => {
    if (e) e.preventDefault()
    if (!repostPost && !matn.trim()) {
      toast.error('Hikoya matnini kiriting')
      return
    }
    setJoylanmoqda(true)
    try {
      const res = await fetch('/api/profil/hikoyalar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          turi: repostPost ? 'repost' : turi,
          uslub,
          matn: matn.trim(),
          postId: repostPost?.id || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Hikoyani joylab bo'lmadi")

      toast.success(data.message || 'Hikoya joylandi!')
      yaratishniYop()
      await yukla()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setJoylanmoqda(false)
    }
  }

  const olovchaBos = async (hikoya) => {
    if (!session?.user?.id) {
      toast.error('Avval tizimga kiring')
      return
    }
    const oldYoqdi = Boolean(hikoya.yoqdimi)
    const oldSoni = Number(hikoya.yoqdiSoni) || 0
    const yangiYoqdi = !oldYoqdi
    const yangiSoni = Math.max(0, oldSoni + (yangiYoqdi ? 1 : -1))

    setGuruhlar((old) =>
      old.map((g) => ({
        ...g,
        hikoyalar: g.hikoyalar.map((h) =>
          h.id === hikoya.id
            ? { ...h, yoqdimi: yangiYoqdi, yoqdiSoni: yangiSoni }
            : h
        ),
      }))
    )

    try {
      const res = await fetch('/api/profil/hikoyalar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: hikoya.id, amal: 'yoqdi' }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setGuruhlar((old) =>
        old.map((g) => ({
          ...g,
          hikoyalar: g.hikoyalar.map((h) =>
            h.id === hikoya.id
              ? {
                  ...h,
                  yoqdimi: d.yoqdimi,
                  yoqdiSoni: d.yoqdiSoni,
                  korishlarSoni: d.korishlarSoni,
                }
              : h
          ),
        }))
      )
    } catch {
      setGuruhlar((old) =>
        old.map((g) => ({
          ...g,
          hikoyalar: g.hikoyalar.map((h) =>
            h.id === hikoya.id
              ? { ...h, yoqdimi: oldYoqdi, yoqdiSoni: oldSoni }
              : h
          ),
        }))
      )
    }
  }

  const hikoyaniOchir = async (hikoyaId) => {
    if (!confirm("Shu hikoya o'chirilsinmi?")) return
    try {
      const res = await fetch(
        `/api/profil/hikoyalar?id=${encodeURIComponent(hikoyaId)}`,
        { method: 'DELETE' }
      )
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success(d.message || "Hikoya o'chirildi")
      korishniYop()
      await yukla()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const ozGuruhimIdx = guruhlar.findIndex((g) => g.ozimniki)
  const ozGuruhim = ozGuruhimIdx >= 0 ? guruhlar[ozGuruhimIdx] : null
  const tanlanganUslubInfo = hikoyaUslubiHaqida(uslub)
  const tanlanganTurInfo = hikoyaTuriHaqida(repostPost ? 'repost' : turi)

  // Agar bitta muallif rejimi bo'lsa (ochiq profilda) va unda faol hikoya bo'lmasa hech narsa chizmaymiz
  if (muallifId && !yuklanmoqda && guruhlar.length === 0) {
    return null
  }

  return (
    <>
      {/* ═══ GORIZONTAL HIKOYALAR TASMASI ═══ */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-0.5 select-none">
        {/* 1. O'z hikoyam / Yangi hikoya qo'shish tugmasi (faqat umumiy lentada) */}
        {!muallifId && (
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (ozGuruhim) {
                  setFaolGuruhIdx(ozGuruhimIdx)
                  setFaolSlaydIdx(0)
                  setProgress(0)
                } else {
                  yangiHikoyaOch()
                }
              }}
              className="group flex flex-col items-center gap-1.5 w-16 text-center shrink-0"
            >
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-2xl p-[2.5px] transition-transform group-hover:scale-105"
                  style={{
                    background: ozGuruhim
                      ? hikoyaUslubiHaqida(
                          ozGuruhim.hikoyalar[ozGuruhim.hikoyalar.length - 1]?.uslub
                        ).halqaStyle
                      : 'var(--v3-chiziq)',
                  }}
                >
                  <div className="w-full h-full rounded-[13px] bg-[var(--v3-yuza)] flex items-center justify-center text-sm font-bold text-[var(--v3-urgu)] overflow-hidden">
                    {session?.user?.avatar ? (
                      <img
                        src={session.user.avatar}
                        alt="Siz"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Ikon nom={ozGuruhim ? 'uchqun' : 'qosh'} olcham={20} />
                    )}
                  </div>
                </div>
                <span
                  onClick={(e) => {
                    if (ozGuruhim) {
                      e.stopPropagation()
                      yangiHikoyaOch()
                    }
                  }}
                  title="Yangi hikoya qo'shish"
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] flex items-center justify-center shadow-md border border-[var(--v3-fon)]"
                >
                  <Ikon nom="qosh" olcham={12} />
                </span>
              </div>
              <span className="text-[10.5px] font-semibold text-[var(--v3-matn)] truncate w-full">
                {ozGuruhim ? `Hikoyam (${ozGuruhim.hikoyalar.length})` : '+ Hikoya'}
              </span>
            </button>
          </div>
        )}

        {/* 2. Boshqa foydalanuvchilarning (yoki muallifId ning) faol hikoyalari */}
        {guruhlar.map((guruh, idx) => {
          if (!muallifId && guruh.ozimniki) return null
          const oxirgi = guruh.hikoyalar[guruh.hikoyalar.length - 1]
          const uslubObj = hikoyaUslubiHaqida(oxirgi?.uslub)
          const turObj = hikoyaTuriHaqida(oxirgi?.turi)
          const ism = guruh.muallif?.fullName || guruh.muallif?.username || 'Kimyogar'
          const yangiBor = guruh.yangiSoni > 0 || guruh.ozimniki

          return (
            <button
              key={guruh.muallifId}
              type="button"
              onClick={() => {
                setFaolGuruhIdx(idx)
                setFaolSlaydIdx(0)
                setProgress(0)
              }}
              className="group flex flex-col items-center gap-1.5 w-16 text-center shrink-0"
            >
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-2xl p-[2.5px] transition-transform group-hover:scale-105"
                  style={{
                    background: yangiBor ? uslubObj.halqaStyle : 'var(--v3-chiziq)',
                  }}
                >
                  <div className="w-full h-full rounded-[13px] bg-[var(--v3-yuza-2)] flex items-center justify-center text-sm font-bold text-[var(--v3-urgu)] overflow-hidden">
                    {guruh.muallif?.avatar ? (
                      <img
                        src={guruh.muallif.avatar}
                        alt={ism}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (ism[0] || 'K').toUpperCase()
                    )}
                  </div>
                </div>

                {/* Hikoya turi belgisi */}
                <span
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg flex items-center justify-center shadow-md border border-[var(--v3-fon)] text-white"
                  style={{ background: uslubObj.urguRang }}
                >
                  <Ikon nom={turObj.ikon} olcham={11} />
                </span>

                {/* Nechta slayd borligi */}
                {guruh.hikoyalar.length > 1 && (
                  <span className="absolute -top-1 -left-1 px-1.5 py-0.2 rounded-md bg-[var(--v3-fon)]/90 border border-[var(--v3-chiziq)] text-[9px] font-mono font-bold text-[var(--v3-matn)]">
                    {guruh.hikoyalar.length}
                  </span>
                )}
              </div>

              <span className="text-[10.5px] font-medium text-[var(--v3-matn)] truncate w-full">
                {muallifId ? `Hikoya (${guruh.hikoyalar.length})` : ism.split(' ')[0]}
              </span>
            </button>
          )
        })}
      </div>

      {/* ═══ YANGI HIKOYA / POSTNI HIKOYAGA ULASHISH MODALI ═══ */}
      {yaratishOchiq && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={yaratishniYop}
        >
          <div
            className="v3-panel-karta max-w-lg w-full p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[var(--v3-matn)] flex items-center gap-2">
                  <Ikon nom="uchqun" olcham={18} className="text-[var(--v3-urgu)]" />
                  <span>
                    {repostPost ? 'Postni 24 soatlik hikoyaga ulashish' : 'Yangi 24 soatlik hikoya'}
                  </span>
                </h3>
                <p className="text-xs text-[var(--v3-xira)] mt-0.5">
                  Hikoya 24 soat davomida obunachilaringiz va tavsiyalar tasmasida ko{"'"}rinadi.
                </p>
              </div>
              <button
                type="button"
                onClick={yaratishniYop}
                className="v3-ikon-tugma"
                aria-label="Yopish"
              >
                <Ikon nom="yopish" olcham={16} />
              </button>
            </div>

            {/* Mustaqil hikoya uchun mavzu turi tanlagichi */}
            {!repostPost && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--v3-xira)]">
                  Hikoya mavzusi
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MUSTAQIL_TURLAR.map((t) => {
                    const faol = turi === t.kalit
                    return (
                      <button
                        key={t.kalit}
                        type="button"
                        onClick={() => setTuri(t.kalit)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                          faol
                            ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] shadow-sm'
                            : 'bg-[var(--v3-fon-2)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)] border border-[var(--v3-chiziq)]'
                        }`}
                      >
                        <Ikon nom={t.ikon} olcham={13} />
                        <span>{t.nom}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Fon uslubini tanlash */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--v3-xira)]">
                Kartochka uslubi
              </label>
              <div className="flex flex-wrap gap-2">
                {HIKOYA_USLUBLARI.map((u) => {
                  const faol = uslub === u.kalit
                  return (
                    <button
                      key={u.kalit}
                      type="button"
                      onClick={() => setUslub(u.kalit)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 border transition-all ${
                        faol
                          ? 'border-[var(--v3-urgu)] bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] font-bold'
                          : 'border-[var(--v3-chiziq)] bg-[var(--v3-fon-2)] text-[var(--v3-xira)]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ background: u.halqaStyle }}
                      />
                      <span>{u.nom}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Jonli ko'rinish va matn kiritish */}
            <div
              className={`rounded-2xl p-5 border border-white/15 text-white space-y-3.5 shadow-xl ${tanlanganUslubInfo.fonClass}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-white/12 backdrop-blur-sm"
                  style={{ color: tanlanganUslubInfo.urguRang }}
                >
                  <Ikon nom={tanlanganTurInfo.ikon} olcham={13} />
                  <span>{tanlanganTurInfo.nom}</span>
                </span>
                <span className="text-[11px] font-mono text-white/65">
                  {matn.length}/{MAX_HIKOYA_MATN}
                </span>
              </div>

              <textarea
                rows={repostPost ? 2 : 4}
                maxLength={MAX_HIKOYA_MATN}
                value={matn}
                onChange={(e) => setMatn(e.target.value.slice(0, MAX_HIKOYA_MATN))}
                placeholder={tanlanganTurInfo.maslahat}
                className="w-full rounded-xl bg-black/25 border border-white/15 p-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 resize-none"
                autoFocus
              />

              {repostPost && (
                <div className="rounded-xl bg-black/35 border border-white/15 p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs text-white/80">
                    <span className="font-bold">
                      @{repostPost.muallif?.username || session?.user?.username || 'kimyogar'}
                    </span>
                    {repostPost.teg && (
                      <span className="font-mono text-[11px] text-sky-300">
                        #{repostPost.teg}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/90 line-clamp-4 whitespace-pre-line leading-relaxed">
                    {repostPost.matn}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={yaratishniYop}
                disabled={joylanmoqda}
                className="v3-tugma text-xs py-2 px-4"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={hikoyaJoyla}
                disabled={joylanmoqda || (!repostPost && !matn.trim())}
                className="v3-tugma v3-tugma-asosiy text-xs py-2 px-5 font-bold inline-flex items-center gap-1.5 disabled:opacity-40"
              >
                <Ikon nom="uchqun" olcham={14} />
                <span>{joylanmoqda ? 'Joylanmoqda...' : 'Hikoyaga joylash'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TO'LIQ EKRANLI HIKOYA KO'RISH OYNASI (STORY VIEWER) ═══ */}
      {faolGuruh && faolHikoya && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
          onClick={korishniYop}
        >
          <div
            className={`relative w-full max-w-md min-h-[480px] sm:min-h-[540px] rounded-3xl border border-white/20 p-5 sm:p-6 flex flex-col justify-between text-white shadow-2xl overflow-hidden ${
              hikoyaUslubiHaqida(faolHikoya.uslub).fonClass
            }`}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={() => setToxtatilgan(true)}
            onMouseUp={() => setToxtatilgan(false)}
            onTouchStart={() => setToxtatilgan(true)}
            onTouchEnd={() => setToxtatilgan(false)}
          >
            {/* 1. Yuqori progress chiziqlari va Muallif sarlavhasi */}
            <div className="space-y-3 relative z-20">
              <div className="flex gap-1.5">
                {faolGuruh.hikoyalar.map((h, i) => {
                  const foiz =
                    i < faolSlaydIdx ? 100 : i === faolSlaydIdx ? progress : 0
                  return (
                    <div
                      key={h.id}
                      className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden"
                    >
                      <div
                        className="h-full bg-white transition-all duration-75 rounded-full"
                        style={{ width: `${foiz}%` }}
                      />
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/profil/${faolGuruh.muallif?.userId || faolGuruh.muallif?.username}`}
                  onClick={korishniYop}
                  className="flex items-center gap-2.5 min-w-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                    {faolGuruh.muallif?.avatar ? (
                      <img
                        src={faolGuruh.muallif.avatar}
                        alt={faolGuruh.muallif.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (
                        faolGuruh.muallif?.fullName?.[0] ||
                        faolGuruh.muallif?.username?.[0] ||
                        'K'
                      ).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold truncate">
                        {faolGuruh.muallif?.fullName || faolGuruh.muallif?.username}
                      </span>
                      <TasdiqBelgisi
                        tasdiqlangan={faolGuruh.muallif?.isVerified}
                        olcham="kichik"
                      />
                    </div>
                    <div className="text-[10.5px] text-white/70 font-mono">
                      {qachon(faolHikoya.createdAt)}
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-1.5">
                  {faolGuruh.ozimniki && (
                    <button
                      type="button"
                      onClick={() => hikoyaniOchir(faolHikoya.id)}
                      title="Hikoyani o'chirish"
                      className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/35 text-red-200 transition"
                    >
                      <Ikon nom="ochir" olcham={15} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={korishniYop}
                    aria-label="Yopish"
                    className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition"
                  >
                    <Ikon nom="yopish" olcham={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Markaziy Hikoya Mazmuni */}
            <div className="my-auto py-6 space-y-4 relative z-20">
              <div className="flex items-center justify-center">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/12 border border-white/15 backdrop-blur-sm"
                  style={{
                    color: hikoyaUslubiHaqida(faolHikoya.uslub).urguRang,
                  }}
                >
                  <Ikon
                    nom={hikoyaTuriHaqida(faolHikoya.turi).ikon}
                    olcham={13}
                  />
                  <span>{hikoyaTuriHaqida(faolHikoya.turi).nom}</span>
                </span>
              </div>

              {faolHikoya.matn && (
                <p
                  className={`${
                    faolHikoya.postMatn
                      ? 'text-sm sm:text-base'
                      : 'text-base sm:text-lg font-medium'
                  } text-center text-white leading-relaxed whitespace-pre-line break-words px-2`}
                >
                  {faolHikoya.matn}
                </p>
              )}

              {/* Agar bu post repost qilingan hikoya bo'lsa, asl post kartochkasini chiqaramiz */}
              {faolHikoya.postMatn && (
                <div className="rounded-2xl bg-black/40 border border-white/20 p-4 space-y-2.5 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white/90">
                      {faolHikoya.postMuallifIsm || `@${faolHikoya.postMuallifUsername || 'kimyogar'}`}
                    </span>
                    {tegHaqida(faolHikoya.postTeg) && (
                      <span className="px-2 py-0.5 rounded-md text-[10.5px] font-mono bg-white/10 text-sky-300">
                        {tegHaqida(faolHikoya.postTeg).nom}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed whitespace-pre-line break-words max-h-48 overflow-y-auto">
                    {faolHikoya.postMatn}
                  </p>

                  {(faolHikoya.postMuallifUserId || faolHikoya.postMuallifUsername) && (
                    <div className="pt-1 flex justify-end">
                      <Link
                        href={`/profil/${
                          faolHikoya.postMuallifUserId || faolHikoya.postMuallifUsername
                        }`}
                        onClick={korishniYop}
                        className="inline-flex items-center gap-1 text-xs font-bold text-sky-300 hover:text-sky-200"
                      >
                        <span>Muallif profiliga o{"'"}tish</span>
                        <Ikon nom="ong" olcham={12} />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chap / O'ng slaydga o'tkazish tugmalari */}
            <div className="flex items-center justify-between gap-2 relative z-20 pt-3 border-t border-white/15">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={oldingiSlayd}
                  className="p-2 rounded-xl bg-white/12 hover:bg-white/20 text-white transition"
                  title="Oldingi"
                >
                  <Ikon nom="chap" olcham={15} />
                </button>
                <button
                  type="button"
                  onClick={keyingiSlayd}
                  className="p-2 rounded-xl bg-white/12 hover:bg-white/20 text-white transition"
                  title="Keyingi"
                >
                  <Ikon nom="ong" olcham={15} />
                </button>
                <span className="text-xs text-white/75 font-mono ml-1">
                  👁 {faolHikoya.korishlarSoni || 0}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {faolGuruh.ozimniki && (
                  <button
                    type="button"
                    onClick={() => {
                      korishniYop()
                      yangiHikoyaOch()
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Ikon nom="qosh" olcham={13} />
                    <span>Yangi</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => olovchaBos(faolHikoya)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition active:scale-95 ${
                    faolHikoya.yoqdimi
                      ? 'bg-amber-400 text-slate-950 shadow-lg'
                      : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                >
                  <Ikon nom="olov" olcham={14} />
                  <span>Foydali</span>
                  {Number(faolHikoya.yoqdiSoni) > 0 && (
                    <span className="font-mono">{faolHikoya.yoqdiSoni}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
