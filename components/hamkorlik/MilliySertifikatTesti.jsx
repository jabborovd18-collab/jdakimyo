// components/hamkorlik/MilliySertifikatTesti.jsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Ikon from '@/components/Ikon'

function soniyaFormat(s) {
  const m = Math.floor(s / 60)
  const qolganS = s % 60
  return `${m.toString().padStart(2, '0')}:${qolganS.toString().padStart(2, '0')}`
}

export default function MilliySertifikatTesti({
  partnership,
  savollar = [],
  userAttempt = null,
  isLoggedIn = false
}) {
  const [joriyIndex, setJoriyIndex] = useState(0)
  const [javoblar, setJavoblar] = useState({})
  const [qolganVaqt, setQolganVaqt] = useState((partnership?.timeLimitMin || 100) * 60)
  const [yakunlandi, setYakunlandi] = useState(Boolean(userAttempt?.hasSubmitted || userAttempt?.completedAt))
  const [natija, setNatija] = useState(userAttempt)
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [xatolik, setXatolik] = useState('')
  const [tasdiqModali, setTasdiqModali] = useState(false)
  const [navigatsiyaModali, setNavigatsiyaModali] = useState(false)
  const [zoomRasm, setZoomRasm] = useState(null)
  const [zoomScale, setZoomScale] = useState(1.4)

  const navigatorScrollRef = useRef(null)
  const activePillRef = useRef(null)

  // LocalStorage kesh kaliti
  const storageKalit = `ms_sinov_javoblar_${partnership?.slug || 'sea-ms-sinov'}`

  // 1. Dastlabki yuklashda xotiradan (localStorage) tiklash
  useEffect(() => {
    if (yakunlandi) return
    try {
      const saqlangan = localStorage.getItem(storageKalit)
      if (saqlangan) {
        const parsed = JSON.parse(saqlangan)
        if (parsed && typeof parsed === 'object') {
          setJavoblar((prev) => ({ ...parsed, ...prev }))
        }
      }
    } catch {
      // xotira o'qish xatosi e'tiborga olinmaydi
    }
  }, [storageKalit, yakunlandi])

  // Javoblar o'zgarganda localStorage'ga yozib borish
  useEffect(() => {
    if (yakunlandi) return
    try {
      if (Object.keys(javoblar).length > 0) {
        localStorage.setItem(storageKalit, JSON.stringify(javoblar))
      }
    } catch {
      // xotira yozish xatosi
    }
  }, [javoblar, storageKalit, yakunlandi])

  // 2. TAYMER MANTIG'I
  useEffect(() => {
    if (yakunlandi || userAttempt?.hasSubmitted) return

    const taymerInterval = setInterval(() => {
      setQolganVaqt((old) => {
        if (old <= 1) {
          clearInterval(taymerInterval)
          testniYakunla()
          return 0
        }
        return old - 1
      })
    }, 1000)

    return () => clearInterval(taymerInterval)
  }, [yakunlandi, userAttempt])

  // 3. Gorizontal navigatorda faol savolga avtomatik scroll qilish
  useEffect(() => {
    if (activePillRef.current && navigatorScrollRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      })
    }
  }, [joriyIndex])

  // 4. Variantni tanlash
  const javobTanla = useCallback((variantHarf) => {
    if (yakunlandi) return
    const savolId = savollar[joriyIndex]?.id
    if (!savolId) return

    setJavoblar((prev) => ({
      ...prev,
      [savolId]: variantHarf
    }))
  }, [yakunlandi, savollar, joriyIndex])

  // 5. Ochiq masala javobini kiritish (36-40)
  const ochiqJavobYoz = useCallback((qiymat) => {
    if (yakunlandi) return
    const savolId = savollar[joriyIndex]?.id
    if (!savolId) return

    setJavoblar((prev) => ({
      ...prev,
      [savolId]: qiymat
    }))
  }, [yakunlandi, savollar, joriyIndex])

  // Klaviaturadagi tugmalar orqali tezkor boshqarish (Desktop)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (tasdiqModali || navigatsiyaModali || zoomRasm) return
      // Agar foydalanuvchi input maydonida yozayotgan bo'lsa, variant tugmalarini tutmaymiz
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return

      const harf = e.key.toUpperCase()
      const joriy = savollar[joriyIndex]

      if (joriy?.turi !== 'ochiq') {
        const ruxsatVariantlar = joriy?.options || ['A', 'B', 'C', 'D']
        if (ruxsatVariantlar.includes(harf)) {
          e.preventDefault()
          javobTanla(harf)
        }
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setJoriyIndex((i) => Math.min(savollar.length - 1, i + 1))
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setJoriyIndex((i) => Math.max(0, i - 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [joriyIndex, savollar, javobTanla, tasdiqModali, navigatsiyaModali, zoomRasm])

  // 6. Testni serverga topshirish
  const testniYakunla = async () => {
    setTasdiqModali(false)
    if (yuklanmoqda || yakunlandi) return

    setYuklanmoqda(true)
    setXatolik('')

    try {
      const sarflanganVaqt = (partnership?.timeLimitMin || 100) * 60 - qolganVaqt

      const res = await fetch(`/api/hamkorlik/${partnership.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          javoblar,
          timeSpentSec: Math.max(1, sarflanganVaqt)
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Natijani saqlashda xatolik yuz berdi')

      try {
        localStorage.removeItem(storageKalit)
      } catch {
        // xotirani tozalash
      }

      setYakunlandi(true)
      setNatija({
        hasSubmitted: true,
        completedAt: data.completedAt,
        totalQuestions: 40
      })
    } catch (err) {
      setXatolik(err.message)
    } finally {
      setYuklanmoqda(false)
    }
  }

  // AGAR FOYDALANUVCHI TOPSHIRIB BO'LGAN BO'LSA
  if (yakunlandi || userAttempt?.hasSubmitted) {
    return (
      <div className="v3-panel-karta p-6 sm:p-10 text-center space-y-6 max-w-2xl mx-auto my-6 border border-emerald-500/30">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl shadow-sm">
          ✓
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
            Javoblar Qabul Qilindi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--v3-matn)]">
            Sinov Muvaffaqiyatli Yakunlandi!
          </h2>
          <p className="text-sm text-[var(--v3-xira)] leading-relaxed max-w-lg mx-auto">
            Sizning 40 ta savolga bergan barcha javoblaringiz serverda xavfsiz qayd etildi.
          </p>
        </div>

        {/* Natija vaqti ko'rsatkichi */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-left space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-[var(--v3-matn)]">📅 Natijalar e&apos;lon qilinishi:</span>
            <span className="font-bold font-mono text-amber-400">Bugun 00:00 da</span>
          </div>
          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
            Haqiqiy Milliy Sertifikat imtihoni mezonlari asosida barcha to&apos;g&apos;ri javoblar va ishtirokchilar reytingi soat 00:00 da ushbu sahifada ochiladi.
          </p>
        </div>

        {/* Oylik marafon jadvali */}
        <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/10 border border-blue-500/25 text-left space-y-2.5">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs sm:text-sm">
            <Ikon nom="taqvim" olcham={16} />
            <span>Keyingi Sinov Testlari Jadvali (17:00 da):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
              <span className="block font-bold text-[var(--v3-matn)]">2-Sinov Testi</span>
              <span className="text-[11px] text-[var(--v3-xira)]">8-sentyabr (Seshanba)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
              <span className="block font-bold text-[var(--v3-matn)]">3-Sinov Testi</span>
              <span className="text-[11px] text-[var(--v3-xira)]">10-sentyabr (Payshanba)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)]">
              <span className="block font-bold text-[var(--v3-matn)]">4-Sinov Testi</span>
              <span className="text-[11px] text-[var(--v3-xira)]">12-sentyabr (Shanba)</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {partnership?.isAdmin && (
            <button
              onClick={() => {
                setYakunlandi(false)
                setJavoblar({})
                setQolganVaqt((partnership?.timeLimitMin || 100) * 60)
                setJoriyIndex(0)
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              🔄 Qaytadan Sinash (Admin)
            </button>
          )}
          <Link
            href="/profil"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[var(--v3-yuza-2)] hover:bg-[var(--v3-chiziq)] text-[var(--v3-matn)] text-xs sm:text-sm font-semibold transition-all border border-[var(--v3-chiziq)]"
          >
            ← Shaxsiy Profilga Qaytish
          </Link>
          <a
            href="https://t.me/AlchemistryIQ"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Ikon nom="telegram" olcham={16} />
            <span>SEA Kimyo Telegram (@AlchemistryIQ)</span>
          </a>
        </div>
      </div>
    )
  }

  const joriySavol = savollar[joriyIndex]
  const joriyJavob = joriySavol ? javoblar[joriySavol.id] : undefined
  const belgilanganlarSoni = Object.keys(javoblar).filter((k) => javoblar[k] !== undefined && javoblar[k] !== '').length
  const foiz = Math.round((belgilanganlarSoni / (savollar.length || 40)) * 100)

  return (
    <div className="space-y-4 max-w-4xl mx-auto select-none">
      {/* ═══ 1. IXCHAM STICKY BOSHQARUV VA TAYMER PANELI ═══ */}
      <div className="sticky top-2 z-30 v3-panel-karta p-3 sm:p-4 backdrop-blur-md bg-[var(--v3-yuza)]/95 border border-[var(--v3-chiziq)] shadow-xl rounded-2xl flex items-center justify-between gap-3">
        {/* Savol indeksi va progress */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setNavigatsiyaModali(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--v3-yuza-2)] hover:bg-[var(--v3-chiziq)] border border-[var(--v3-chiziq)] text-xs font-bold text-[var(--v3-matn)] transition-all"
            title="Barcha 40 ta savol xaritasini ochish"
          >
            <span className="text-amber-400">☰</span>
            <span>{joriyIndex + 1} / {savollar.length}</span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs text-[var(--v3-xira)]">
            <div className="w-20 h-2 rounded-full bg-[var(--v3-yuza-2)] overflow-hidden border border-[var(--v3-chiziq)]">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${foiz}%` }}
              />
            </div>
            <span>{belgilanganlarSoni}/{savollar.length}</span>
          </div>
        </div>

        {/* Taymer */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-colors ${
            qolganVaqt < 600
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/40 animate-pulse'
              : 'bg-[var(--v3-yuza-2)] text-amber-400 border-amber-500/30'
          }`}
        >
          <Ikon nom="soat" olcham={15} />
          <span>{soniyaFormat(qolganVaqt)}</span>
        </div>

        {/* Yakunlash tugmasi */}
        <button
          onClick={() => setTasdiqModali(true)}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 active:scale-95 shrink-0"
        >
          <Ikon nom="tekshir" olcham={14} />
          <span className="hidden sm:inline">Testni Yakunlash</span>
          <span className="sm:hidden">Yakunlash</span>
        </button>
      </div>

      {/* ═══ 2. SILLIQ GORIZONTAL SAVOLLAR LENTASI (1-40) ═══ */}
      <div className="v3-panel-karta p-2 sm:p-2.5 rounded-2xl flex items-center gap-2">
        <button
          onClick={() => setJoriyIndex((i) => Math.max(0, i - 1))}
          disabled={joriyIndex === 0}
          className="w-8 h-8 rounded-xl bg-[var(--v3-yuza-2)] hover:bg-[var(--v3-chiziq)] disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center justify-center shrink-0 border border-[var(--v3-chiziq)] transition-all"
          aria-label="Oldingi savol"
        >
          ‹
        </button>

        <div
          ref={navigatorScrollRef}
          className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scroll-smooth no-scrollbar flex-1"
        >
          {savollar.map((s, idx) => {
            const javobBormi = javoblar[s.id] !== undefined && javoblar[s.id] !== ''
            const tanlangan = idx === joriyIndex

            return (
              <button
                key={s.id}
                ref={tanlangan ? activePillRef : null}
                onClick={() => setJoriyIndex(idx)}
                className={`min-w-[34px] h-[34px] px-2 rounded-xl text-xs font-mono font-bold shrink-0 transition-all flex items-center justify-center relative border ${
                  tanlangan
                    ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)] shadow-md scale-105'
                    : javobBormi
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-[var(--v3-yuza-2)] text-[var(--v3-xira)] hover:bg-[var(--v3-chiziq)] border-[var(--v3-chiziq)]'
                }`}
              >
                {idx + 1}
                {s.turi === 'ochiq' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => setJoriyIndex((i) => Math.min(savollar.length - 1, i + 1))}
          disabled={joriyIndex === savollar.length - 1}
          className="w-8 h-8 rounded-xl bg-[var(--v3-yuza-2)] hover:bg-[var(--v3-chiziq)] disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center justify-center shrink-0 border border-[var(--v3-chiziq)] transition-all"
          aria-label="Keyingi savol"
        >
          ›
        </button>
      </div>

      {/* ═══ 3. ASOSIY SAVOL KARTASI ═══ */}
      {joriySavol && (
        <div className="v3-panel-karta p-4 sm:p-6 space-y-4 rounded-3xl border border-[var(--v3-chiziq)] shadow-lg">
          {/* Savol sarlavhasi */}
          <div className="flex items-center justify-between border-b border-[var(--v3-chiziq)] pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-base sm:text-lg text-[var(--v3-matn)]">
                {joriyIndex + 1}-savol
              </span>
              {joriySavol.turi === 'ochiq' ? (
                <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/25">
                  ✍️ Ochiq masala (faqat son yozing)
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/25">
                  🔘 Variantli test ({joriySavol.options?.length || 4} ta variant)
                </span>
              )}
            </div>

            {/* Kattalashtirish (Zoom) tugmasi */}
            <button
              onClick={() => {
                setZoomRasm(joriySavol.rasm)
                setZoomScale(1.4)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--v3-yuza-2)] hover:bg-[var(--v3-chiziq)] text-[11px] font-semibold text-[var(--v3-matn)] border border-[var(--v3-chiziq)] transition-all"
            >
              <span>🔍 Kattalashtirish</span>
            </button>
          </div>

          {/* Savol Rasmi — Oppog'i toza fon bilan */}
          <div
            onClick={() => {
              setZoomRasm(joriySavol.rasm)
              setZoomScale(1.4)
            }}
            className="relative bg-[#ffffff] rounded-2xl p-2 sm:p-5 border border-[var(--v3-chiziq)] flex items-center justify-center overflow-hidden cursor-zoom-in group shadow-inner min-h-[220px]"
          >
            <img
              src={joriySavol.rasm}
              alt={`${joriyIndex + 1}-savol`}
              className="max-h-[480px] w-auto max-w-full object-contain select-none transition-transform duration-200 group-hover:scale-[1.01]"
              loading="eager"
            />
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-medium backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              To&apos;liq ekranda ko&apos;rish uchun bosing
            </div>
          </div>

          {/* ═══ 4. JAVOB BERISH BO'LIMI ═══ */}
          <div className="pt-2">
            {joriySavol.turi === 'ochiq' ? (
              /* ─── OCHIQ MASALA (36-40) ─── */
              <div className="space-y-4 max-w-md mx-auto">
                <div className="text-center space-y-1">
                  <label className="block text-xs font-bold text-[var(--v3-matn)]">
                    Masala javobini kiriting:
                  </label>
                  <p className="text-[11px] text-[var(--v3-xira)]">
                    Faqat son yoki o&apos;nli kasr (masalan: <b>64</b> yoki <b>22.4</b>)
                  </p>
                </div>

                {/* Input maydoni */}
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={joriyJavob || ''}
                    onChange={(e) => {
                      const tozalangan = e.target.value.replace(/[^0-9.,-]/g, '')
                      ochiqJavobYoz(tozalangan)
                    }}
                    placeholder="Masalan: 64 yoki 22.4"
                    className="w-full text-center text-2xl font-mono font-extrabold py-3.5 px-4 rounded-2xl bg-[var(--v3-yuza-2)] border-2 border-[var(--v3-urgu)] text-[var(--v3-matn)] focus:outline-none shadow-md placeholder:text-[var(--v3-xira)]/40"
                    autoComplete="off"
                  />
                  {joriyJavob && (
                    <button
                      onClick={() => ochiqJavobYoz('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--v3-xira)] hover:text-rose-400 p-1.5"
                      title="Tozalash"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Mobil va sensorli ekranlar uchun raqamlar yordamchisi */}
                <div className="grid grid-cols-6 gap-1.5 pt-1">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '⌫'].map((belgi) => (
                    <button
                      key={belgi}
                      type="button"
                      onClick={() => {
                        const hozirgi = String(joriyJavob || '')
                        if (belgi === '⌫') {
                          ochiqJavobYoz(hozirgi.slice(0, -1))
                        } else {
                          ochiqJavobYoz(hozirgi + belgi)
                        }
                      }}
                      className="py-2 rounded-xl bg-[var(--v3-yuza-2)] hover:bg-[var(--v3-chiziq)] active:scale-95 border border-[var(--v3-chiziq)] text-xs sm:text-sm font-mono font-bold text-[var(--v3-matn)] transition-all"
                    >
                      {belgi}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ─── VARIANTLI TESTLAR (1-35) ─── */
              <div className="space-y-3 max-w-xl mx-auto">
                <div className="text-center text-xs font-bold text-[var(--v3-xira)]">
                  To&apos;g&apos;ri javobni tanlang:
                </div>

                {/* Variant tugmalari */}
                <div
                  className={`grid gap-2.5 sm:gap-3 ${
                    (joriySavol.options || []).length > 4
                      ? 'grid-cols-2 sm:grid-cols-3'
                      : 'grid-cols-2 sm:grid-cols-4'
                  }`}
                >
                  {(joriySavol.options || ['A', 'B', 'C', 'D']).map((harf) => {
                    const tanlangan = joriyJavob === harf
                    const label = joriySavol.optionLabels?.[harf]

                    return (
                      <button
                        key={harf}
                        type="button"
                        onClick={() => javobTanla(harf)}
                        className={`p-3 sm:p-4 rounded-2xl font-bold transition-all border-2 flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 ${
                          tanlangan
                            ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)] scale-105 shadow-md'
                            : 'bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)]/60'
                        }`}
                      >
                        <span className="text-lg sm:text-xl font-mono">{harf}</span>
                        {label && (
                          <span className={`text-xs font-mono font-semibold ${
                            tanlangan ? 'text-[var(--v3-urgu-matn)]/90' : 'text-[var(--v3-xira)]'
                          }`}>
                            {label}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ═══ 5. OLDINGI VA KEYINGI HARAKAT TUGMALARI ═══ */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--v3-chiziq)]">
            <button
              onClick={() => setJoriyIndex((i) => Math.max(0, i - 1))}
              disabled={joriyIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-[var(--v3-yuza-2)] text-xs sm:text-sm font-semibold text-[var(--v3-matn)] hover:bg-[var(--v3-chiziq)] disabled:opacity-30 disabled:pointer-events-none transition-all border border-[var(--v3-chiziq)] active:scale-95"
            >
              ← Oldingi
            </button>

            <span className="text-xs font-mono text-[var(--v3-xira)]">
              {joriyIndex + 1} / {savollar.length}
            </span>

            <button
              onClick={() => setJoriyIndex((i) => Math.min(savollar.length - 1, i + 1))}
              disabled={joriyIndex === savollar.length - 1}
              className="px-4 py-2.5 rounded-xl bg-[var(--v3-yuza-2)] text-xs sm:text-sm font-semibold text-[var(--v3-matn)] hover:bg-[var(--v3-chiziq)] disabled:opacity-30 disabled:pointer-events-none transition-all border border-[var(--v3-chiziq)] active:scale-95"
            >
              Keyingi →
            </button>
          </div>
        </div>
      )}

      {/* ═══ 6. TO'LIQ 40 TA SAVOL XARITASI (MODAL / DRAWER) ═══ */}
      {navigatsiyaModali && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="v3-panel-karta w-full sm:max-w-lg p-5 rounded-t-3xl sm:rounded-3xl border border-[var(--v3-chiziq)] shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[var(--v3-chiziq)] pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base text-[var(--v3-matn)]">
                  Barcha 40 ta Savol Xaritasi
                </h3>
                <p className="text-xs text-[var(--v3-xira)]">
                  Yechilgan: <b className="text-emerald-400">{belgilanganlarSoni} ta</b> | Qolgan: <b className="text-amber-400">{savollar.length - belgilanganlarSoni} ta</b>
                </p>
              </div>
              <button
                onClick={() => setNavigatsiyaModali(false)}
                className="w-8 h-8 rounded-full bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] hover:bg-[var(--v3-chiziq)] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 overflow-y-auto py-2 pr-1">
              {savollar.map((s, idx) => {
                const javobBormi = javoblar[s.id] !== undefined && javoblar[s.id] !== ''
                const tanlangan = idx === joriyIndex

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setJoriyIndex(idx)
                      setNavigatsiyaModali(false)
                    }}
                    className={`h-11 rounded-xl text-xs font-mono font-bold transition-all flex flex-col items-center justify-center relative border ${
                      tanlangan
                        ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)] shadow-md'
                        : javobBormi
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-[var(--v3-yuza-2)] text-[var(--v3-xira)] hover:bg-[var(--v3-chiziq)] border-[var(--v3-chiziq)]'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {javobBormi ? (
                      <span className="text-[10px] font-semibold opacity-90 truncate max-w-[30px]">
                        {javoblar[s.id]}
                      </span>
                    ) : (
                      <span className="text-[9px] opacity-40">—</span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="pt-2 border-t border-[var(--v3-chiziq)] flex items-center justify-between text-xs text-[var(--v3-xira)]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-md bg-emerald-500/40 border border-emerald-500/60" /> Yechilgan
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-md bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)]" /> Belgilanmagan
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-md bg-[var(--v3-urgu)]" /> Joriy savol
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 7. KATTALASHTIRISh (ZOOM LIGHTBOX) MODALI ═══ */}
      {zoomRasm && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 select-none">
          {/* Yuqori panel */}
          <div className="w-full max-w-3xl flex items-center justify-between text-white pb-3 border-b border-white/15">
            <span className="text-xs sm:text-sm font-bold flex items-center gap-2">
              <span>🔬 {joriyIndex + 1}-savol (Kattalashtirilgan ko&apos;rinish)</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomScale((s) => Math.max(1.0, s - 0.3))}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono font-bold flex items-center justify-center text-base"
                title="Kichraytirish"
              >
                -
              </button>
              <span className="text-xs font-mono w-10 text-center">{Math.round(zoomScale * 100)}%</span>
              <button
                onClick={() => setZoomScale((s) => Math.min(2.8, s + 0.3))}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono font-bold flex items-center justify-center text-base"
                title="Kattalashtirish"
              >
                +
              </button>
              <button
                onClick={() => setZoomRasm(null)}
                className="ml-3 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold"
              >
                Yopish ✕
              </button>
            </div>
          </div>

          {/* Rasm maydoni */}
          <div className="flex-1 w-full max-w-4xl flex items-center justify-center overflow-auto p-2 my-2">
            <img
              src={zoomRasm}
              alt="Kattalashtirilgan savol"
              style={{ transform: `scale(${zoomScale})`, transformOrigin: 'center center' }}
              className="max-h-[80vh] w-auto object-contain transition-transform duration-150 rounded-lg shadow-2xl bg-white p-2"
            />
          </div>

          {/* Pastki yordamchi matn */}
          <div className="text-center text-[11px] text-white/60">
            Savol matni va kimyoviy formulalarni diqqat bilan o&apos;rganing. Yopish uchun &apos;Yopish ✕&apos; tugmasini bosing.
          </div>
        </div>
      )}

      {/* ═══ 8. TESTNI YAKUNLASHNI TASDIQLASH MODALI ═══ */}
      {tasdiqModali && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="v3-panel-karta p-6 max-w-md w-full space-y-4 border border-[var(--v3-chiziq)] shadow-2xl rounded-3xl">
            <div className="text-center space-y-2">
              <span className="text-3xl">⚠️</span>
              <h3 className="text-lg font-bold text-[var(--v3-matn)]">
                Testni Yakunlaysizmi?
              </h3>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
                Siz 40 ta savoldan <b>{belgilanganlarSoni} tasiga</b> javob berdingiz.
                Topshirilgandan so&apos;ng javoblarni o&apos;zgartirib bo&apos;lmaydi.
              </p>
            </div>

            {belgilanganlarSoni < savollar.length && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs text-center leading-relaxed">
                ⚠️ Diqqat: Hali <b>{savollar.length - belgilanganlarSoni} ta</b> savolga javob belgilanmagan!
              </div>
            )}

            {xatolik && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center">
                {xatolik}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setTasdiqModali(false)}
                className="flex-1 py-2.5 rounded-xl bg-[var(--v3-yuza-2)] text-xs font-semibold text-[var(--v3-matn)] hover:bg-[var(--v3-chiziq)] border border-[var(--v3-chiziq)] transition-all"
              >
                Davom etish
              </button>
              <button
                onClick={testniYakunla}
                disabled={yuklanmoqda}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-md disabled:opacity-50"
              >
                {yuklanmoqda ? 'Yuborilmoqda...' : 'Ha, Yakunlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

