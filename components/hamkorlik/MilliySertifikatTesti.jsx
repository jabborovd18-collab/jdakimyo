// components/hamkorlik/MilliySertifikatTesti.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

  const [joriyIndex, setJoriyIndex] = useState(0)
  const [javoblar, setJavoblar] = useState({})
  const [qolganVaqt, setQolganVaqt] = useState((partnership?.timeLimitMin || 100) * 60)
  const [yakunlandi, setYakunlandi] = useState(Boolean(userAttempt?.hasSubmitted || userAttempt?.completedAt))
  const [natija, setNatija] = useState(userAttempt)
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [xatolik, setXatolik] = useState('')
  const [tasdiqModali, setTasdiqModali] = useState(false)

  // 1. TAYMER MANTIG'I
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

  // 2. JAVOBNI BELGILASH (Variantli)
  const javobTanla = (variantHarf) => {
    if (yakunlandi) return
    const savolId = savollar[joriyIndex]?.id
    if (!savolId) return

    setJavoblar((prev) => ({
      ...prev,
      [savolId]: variantHarf
    }))
  }

  // 3. JAVOBNI YOZISH (Ochiq sonli masala)
  const ochiqJavobYoz = (qiymat) => {
    if (yakunlandi) return
    const savolId = savollar[joriyIndex]?.id
    if (!savolId) return

    setJavoblar((prev) => ({
      ...prev,
      [savolId]: qiymat
    }))
  }

  // 4. TESTNI SERVERGA TOPSHIRISH
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
      <div className="v3-panel-karta p-6 sm:p-10 text-center space-y-6 max-w-2xl mx-auto my-8 border border-emerald-500/30">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl">
          ✅
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[var(--v3-matn)]">
            Sinov Testi Muvaffaqiyatli Topshirildi!
          </h2>
          <p className="text-sm text-[var(--v3-xira)] leading-relaxed">
            Sizning 40 ta savolga bergan javoblaringiz qabul qilindi va serverda xavfsiz saqlandi.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-left space-y-2 text-sm">
          <div className="flex items-center justify-between text-xs text-[var(--v3-xira)]">
            <span>📅 Natijalar e&apos;lon qilinish vaqti:</span>
            <span className="font-bold text-amber-400">Bugun 00:00 da</span>
          </div>
          <p className="text-xs text-[var(--v3-xira)]">
            Barcha qatnashchilar uchun ballar, to&apos;g&apos;ri javoblar va Respublika Leaderboard reytingi soat 00:00 da ushbu sahifada to&apos;liq ochiladi.
          </p>
        </div>

        {/* Jadval va Eslatma */}
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-left space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
            <Ikon nom="taqvim" olcham={16} />
            <span>Keyingi Sinov Testlari Jadvali (Haftada 3 kun 17:00 da):</span>
          </div>
          <ul className="text-xs text-[var(--v3-xira)] space-y-1">
            <li>• <b>2-sinov:</b> 8-sentyabr (Seshanba) — 17:00</li>
            <li>• <b>3-sinov:</b> 10-sentyabr (Payshanba) — 17:00</li>
            <li>• <b>4-sinov:</b> 12-sentyabr (Shanba) — 17:00</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/profil"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[var(--v3-yuza-2)] hover:bg-[var(--v3-chiziq)] text-[var(--v3-matn)] text-sm font-semibold transition-all border border-[var(--v3-chiziq)]"
          >
            ← Shaxsiy Profilga Qaytish
          </Link>
          <a
            href="https://t.me/jdakimyouz"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Ikon nom="telegram" olcham={16} />
            <span>Telegramda Yangiliklarni Kuzatish</span>
          </a>
        </div>
      </div>
    )
  }

  const joriySavol = savollar[joriyIndex]
  const joriyJavob = joriySavol ? javoblar[joriySavol.id] : undefined
  const belgilanganlarSoni = Object.keys(javoblar).length

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ═══ YUQORI TAYMER VA STATISTIKA PANELI ═══ */}
      <div className="sticky top-16 z-30 v3-panel-karta p-4 backdrop-blur-md bg-[var(--v3-yuza)]/90 border border-[var(--v3-chiziq)] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="v3-tag v3-tag-ochiq font-bold text-xs">
            Savol: {joriyIndex + 1} / {savollar.length}
          </span>
          <span className="text-xs text-[var(--v3-xira)] hidden sm:inline">
            Yechildi: <b className="text-[var(--v3-matn)]">{belgilanganlarSoni} ta</b>
          </span>
        </div>

        {/* Taymer */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border ${
          qolganVaqt < 600
            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
            : 'bg-[var(--v3-yuza-2)] text-amber-400 border-amber-500/30'
        }`}>
          <Ikon nom="soat" olcham={16} />
          <span>{soniyaFormat(qolganVaqt)}</span>
        </div>

        {/* Tugatish tugmasi */}
        <button
          onClick={() => setTasdiqModali(true)}
          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5"
        >
          <Ikon nom="tekshir" olcham={14} />
          <span>Testni Yakunlash</span>
        </button>
      </div>

      {/* ═══ SAVOLLAR NAVIGATORI (1-40) ═══ */}
      <div className="v3-panel-karta p-4">
        <div className="text-[11px] font-bold text-[var(--v3-xira)] uppercase tracking-wider mb-2">
          Savollar Navigatori:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {savollar.map((s, idx) => {
            const javobBormi = javoblar[s.id] !== undefined && javoblar[s.id] !== ''
            const tanlangan = idx === joriyIndex
            return (
              <button
                key={s.id}
                onClick={() => setJoriyIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                  tanlangan
                    ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] shadow-md scale-105'
                    : javobBormi
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[var(--v3-yuza-2)] text-[var(--v3-xira)] hover:bg-[var(--v3-chiziq)] border border-[var(--v3-chiziq)]'
                }`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══ ASOSIY SAVOL KARTASI ═══ */}
      {joriySavol && (
        <div className="v3-panel-karta p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--v3-chiziq)] pb-3">
            <h3 className="font-bold text-base sm:text-lg text-[var(--v3-matn)]">
              {joriyIndex + 1}-savol
              {joriySavol.turi === 'ochiq' && (
                <span className="ml-2 text-xs font-normal text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  Ochiq masala (son yozing)
                </span>
              )}
            </h3>
            <span className="text-xs text-[var(--v3-xira)] font-mono">
              {joriySavol.turi === 'ochiq' ? 'Masala (36-40)' : 'Variantli test'}
            </span>
          </div>

          {/* Savol Rasmi */}
          <div className="bg-white rounded-xl p-2 sm:p-4 border border-[var(--v3-chiziq)] flex items-center justify-center overflow-hidden shadow-inner">
            <img
              src={joriySavol.rasm}
              alt={`${joriyIndex + 1}-savol`}
              className="max-h-[500px] w-auto object-contain select-none"
              loading="lazy"
            />
          </div>

          {/* JAVOB KIRITISH QISMI */}
          <div className="pt-2">
            {joriySavol.turi === 'ochiq' ? (
              /* OCHIQ MASALA INPUTI */
              <div className="space-y-3 max-w-md mx-auto">
                <label className="block text-xs font-bold text-[var(--v3-xira)] text-center">
                  Masala javobini kiriting (faqat son, masalan: 64 yoki 22.3):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={joriyJavob || ''}
                    onChange={(e) => ochiqJavobYoz(e.target.value)}
                    placeholder="Javobni yozing..."
                    className="w-full text-center text-xl font-mono font-bold py-3 px-4 rounded-xl bg-[var(--v3-yuza-2)] border-2 border-[var(--v3-urgu)] text-[var(--v3-matn)] focus:outline-none shadow-lg placeholder:text-[var(--v3-xira)]/50"
                  />
                </div>
                {joriyJavob && (
                  <p className="text-center text-xs text-emerald-400">
                    ✓ Kiritildi: <b>{joriyJavob}</b>
                  </p>
                )}
              </div>
            ) : (
              /* VARIANT TUGMALARI */
              <div className="space-y-2">
                <div className="text-xs font-bold text-[var(--v3-xira)] text-center mb-3">
                  To&apos;g&apos;ri variantni tanlang:
                </div>
                <div className={`grid gap-3 max-w-lg mx-auto ${
                  joriySavol.options?.length > 4 ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-2 sm:grid-cols-4'
                }`}>
                  {(joriySavol.options || ['A', 'B', 'C', 'D']).map((harf) => {
                    const tanlangan = joriyJavob === harf
                    return (
                      <button
                        key={harf}
                        onClick={() => javobTanla(harf)}
                        className={`py-3 px-4 rounded-xl text-base font-bold font-mono transition-all border-2 shadow-sm ${
                          tanlangan
                            ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)] scale-105 shadow-md'
                            : 'bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)]/50'
                        }`}
                      >
                        {harf}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* OLDINGI / KEYINGI TUGMALARI */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--v3-chiziq)]">
            <button
              onClick={() => setJoriyIndex((i) => Math.max(0, i - 1))}
              disabled={joriyIndex === 0}
              className="px-4 py-2 rounded-xl bg-[var(--v3-yuza-2)] text-xs font-semibold text-[var(--v3-matn)] hover:bg-[var(--v3-chiziq)] disabled:opacity-30 disabled:pointer-events-none transition-all border border-[var(--v3-chiziq)]"
            >
              ← Oldingi
            </button>
            <span className="text-xs text-[var(--v3-xira)]">
              {joriyIndex + 1} / {savollar.length}
            </span>
            <button
              onClick={() => setJoriyIndex((i) => Math.min(savollar.length - 1, i + 1))}
              disabled={joriyIndex === savollar.length - 1}
              className="px-4 py-2 rounded-xl bg-[var(--v3-yuza-2)] text-xs font-semibold text-[var(--v3-matn)] hover:bg-[var(--v3-chiziq)] disabled:opacity-30 disabled:pointer-events-none transition-all border border-[var(--v3-chiziq)]"
            >
              Keyingi →
            </button>
          </div>
        </div>
      )}

      {/* ═══ TASDIQLASH MODALI ═══ */}
      {tasdiqModali && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="v3-panel-karta p-6 max-w-md w-full space-y-4 border border-[var(--v3-chiziq)] shadow-2xl">
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
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs text-center">
                Eslatma: {savollar.length - belgilanganlarSoni} ta savol hali belgilanmagan!
              </div>
            )}

            {xatolik && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
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
