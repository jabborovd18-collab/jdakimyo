'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Ikon from '@/components/Ikon'
import { sertifikatPDFYuklab } from '@/lib/sertifikat-pdf'

function soniyaFormat(s) {
  const m = Math.floor(s / 60)
  const qolganS = s % 60
  return `${m.toString().padStart(2, '0')}:${qolganS.toString().padStart(2, '0')}`
}

export default function SinovTesti({
  partnership,
  savollar = [],
  userAttempt = null,
  isLoggedIn = false
}) {
  const router = useRouter()

  // Holatlar
  const [joriyIndex, setJoriyIndex] = useState(0)
  const [javoblar, setJavoblar] = useState({})
  const [qolganVaqt, setQolganVaqt] = useState((partnership.timeLimitMin || 40) * 60)
  const [boshlanganVaqt] = useState(Date.now())
  const [yakunlandi, setYakunlandi] = useState(Boolean(userAttempt?.hasSubmitted || userAttempt?.completedAt))
  const [natija, setNatija] = useState(userAttempt)
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [xatolik, setXatolik] = useState('')
  const [tasdiqModali, setTasdiqModali] = useState(false)
  const [pdfYuklanmoqda, setPdfYuklanmoqda] = useState(false)

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

  // 2. JAVOBNI TANLASH / ALMASHTIRISH
  const javobTanla = (variantIndex) => {
    if (yakunlandi) return
    const savolId = savollar[joriyIndex]?.id
    if (!savolId) return

    setJavoblar((prev) => ({
      ...prev,
      [savolId]: variantIndex
    }))
  }

  // 3. SINOVNI YAKUNLASH VA SERVERGA YUBORISH
  const testniYakunla = async () => {
    setTasdiqModali(false)
    if (yuklanmoqda || yakunlandi) return

    setYuklanmoqda(true)
    setXatolik('')

    try {
      let togriSoni = 0
      savollar.forEach((savol) => {
        const tanlangan = javoblar[savol.id]
        if (tanlangan === savol.correct) {
          togriSoni++
        }
      })

      const jamiSavol = savollar.length || 30
      const foiz = Number(((togriSoni / jamiSavol) * 100).toFixed(1))
      const sarflanganVaqt = Math.floor((Date.now() - boshlanganVaqt) / 1000)

      const res = await fetch(`/api/hamkorlik/${partnership.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: togriSoni,
          percentage: foiz,
          totalQuestions: jamiSavol,
          timeSpentSec: sarflanganVaqt
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Natijani saqlashda xatolik')

      setYakunlandi(true)
      setNatija({
        hasSubmitted: true,
        isAnnounced: partnership.isAnnounced,
        completedAt: new Date()
      })
    } catch (err) {
      setXatolik(err.message || 'Xatolik yuz berdi')
    } finally {
      setYuklanmoqda(false)
    }
  }

  // 4. SERTIFIKAT PDF YUKLAB OLISH
  const sertifikatYuklabOlish = async () => {
    if (!natija?.certId) return
    setPdfYuklanmoqda(true)
    try {
      const res = await fetch(`/api/sertifikat?certId=${natija.certId}`)
      const data = await res.json()
      if (data?.sertifikat) {
        await sertifikatPDFYuklab(data.sertifikat)
      } else {
        alert('Sertifikat ma\'lumoti topilmadi')
      }
    } catch (e) {
      console.error(e)
      alert('Sertifikatni yuklab olishda xatolik yuz berdi')
    } finally {
      setPdfYuklanmoqda(false)
    }
  }

  const joriySavol = savollar[joriyIndex] || savollar[0]
  const joriyTanlangan = javoblar[joriySavol?.id]
  const javobBerilganSoni = Object.keys(javoblar).length

  // ═══════════════════════════════════════════════════════════════
  // 1-HOLAT: TEST TOPSHIRILGAN, LEKIN NATIJALAR HALI E'LON QILINMAGAN (KUTILMOQDA)
  // ═══════════════════════════════════════════════════════════════
  if ((yakunlandi || userAttempt?.hasSubmitted) && !partnership.isAnnounced) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 px-4 py-8">
        <div className="bg-slate-900/90 border border-purple-800/50 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          {/* Orqa fon tusi */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Ikonka */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500/20 to-purple-600/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg">
            <Ikon nom="tasdiq" olcham={40} className="text-amber-400" />
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Ikon nom="soat" olcham={14} /> SINOV YAKUNLANDI
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Javoblaringiz Muvaffaqiyatli Qabul Qilindi!
            </h1>
            <p className="text-sm sm:text-base text-purple-200/80 max-w-xl mx-auto leading-relaxed">
              Hurmatli ishtirokchi, siz <strong>{partnership.title}</strong> bo‘yicha sinovni yakunladingiz. Har bir ishtirokchiga faqat bitta urinish berilganligi sababli, javoblaringiz tizimga qayd etildi.
            </p>
          </div>

          {/* Xolislik va e'lon xabarnomasi */}
          <div className="bg-black/40 border border-purple-800/40 rounded-2xl p-5 text-left space-y-2 text-xs sm:text-sm text-purple-300">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Ikon nom="ogohlantirish" olcham={18} />
              <span>Natijalar Qachon E'lon Qilinadi?</span>
            </div>
            <p className="text-purple-200/70 leading-relaxed">
              Olimpiada va sinov testlarining adolatli va xolis o'tishi uchun ishtirokchilarning to'plagan ballari va rasmiy sertifikatlar sinov muddati yakunlangach, barcha uchun <strong>bir vaqtda</strong> rasman e'lon qilinadi.
            </p>
          </div>

          {/* Navigatsiya tugmalari */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/profil"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <Ikon nom="odam" olcham={18} /> Profilga o'tish
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-black/40 hover:bg-black/60 border border-purple-800/40 text-purple-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Ikon nom="chap" olcham={18} /> Bosh sahifa
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // 2-HOLAT: NATIJALAR ADMIN TOMONIDAN RASMAN E'LON QILINGAN
  // ═══════════════════════════════════════════════════════════════
  if (yakunlandi && partnership.isAnnounced && natija) {
    const passed = natija.passed || natija.percentage >= (partnership.minPassPercent || 75.0)

    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-8">
        {/* Natija kartasi */}
        <div className="bg-slate-900/90 border border-purple-800/50 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-bold shadow-lg">
            <Ikon nom="kubok" olcham={40} className="text-slate-950" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-900/50 border border-purple-700/50 text-purple-300 font-bold">
              RASMIY NATIJA E'LON QILINDI
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              {passed ? "Tabriklaymiz! Sinovdan Muvaffaqiyatli O'tdingiz!" : "Sinov Yakunlandi"}
            </h1>
            <p className="text-xs sm:text-sm text-purple-300 max-w-md mx-auto">
              {passed
                ? `Siz ${partnership.partnerName} & JDA Kimyo talablarini to'liq bajardingiz va rasmiy sertifikatga ega bo'ldingiz.`
                : `Siz o'tish chegarasidan o'ta olmadingiz. Bilimlaringizni oshirib, keyingi mavsumiy testlarda yana sinab ko'ring.`}
            </p>
          </div>

          {/* Ko'rsatkichlar */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-800/40">
              <span className="text-xs text-purple-400 block font-medium">To'g'ri javob</span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-white">
                {natija.score || 0} / {savollar.length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-purple-800/40">
              <span className="text-xs text-purple-400 block font-medium">Natija</span>
              <span className={`text-xl sm:text-2xl font-mono font-extrabold ${passed ? 'text-green-400' : 'text-amber-400'}`}>
                {natija.percentage || 0}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-purple-800/40">
              <span className="text-xs text-purple-400 block font-medium">Holat</span>
              <span className={`text-xs sm:text-sm font-bold block pt-1 ${passed ? 'text-green-400' : 'text-red-400'}`}>
                {passed ? "A'LO (O'tdi)" : "O'tmadi"}
              </span>
            </div>
          </div>

          {/* Sertifikat blok */}
          {passed && natija.certId && (
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={sertifikatYuklabOlish}
                disabled={pdfYuklanmoqda}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-sm shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-2 hover:scale-105 transition-all"
              >
                <Ikon nom="sertifikat" olcham={20} />
                <span>{pdfYuklanmoqda ? 'PDF Tayyorlanmoqda...' : 'Sertifikatni Yuklab Olish (PDF)'}</span>
              </button>

              <Link
                href={`/sertifikat/verify/${natija.certId}`}
                target="_blank"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-black/40 border border-purple-800/60 hover:bg-black/60 text-purple-200 font-bold text-sm flex items-center justify-center gap-2"
              >
                <Ikon nom="tashqi" olcham={18} /> Haqiqiyligini tekshirish
              </Link>
            </div>
          )}
        </div>

        {/* Tahlil */}
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Ikon nom="kitob" olcham={20} className="text-purple-400" />
            <span>Savollar Tahlili va To'g'ri Javoblar:</span>
          </h2>

          <div className="space-y-3">
            {savollar.map((savol, idx) => {
              const tanlangan = javoblar[savol.id]
              const togri = tanlangan === savol.correct

              return (
                <div
                  key={savol.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    togri
                      ? 'bg-slate-900/60 border-green-800/40'
                      : 'bg-slate-900/60 border-red-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 pb-2">
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-black/40 text-purple-300">
                      Savol {idx + 1}
                    </span>
                    <span className={`text-xs font-bold flex items-center gap-1 ${togri ? 'text-green-400' : 'text-red-400'}`}>
                      <Ikon nom={togri ? 'tasdiq' : 'yopish'} olcham={14} />
                      {togri ? "To'g'ri (+1 ball)" : tanlangan !== undefined ? "Noto'g'ri" : "Javob berilmagan"}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white whitespace-pre-line leading-relaxed pb-3">
                    {savol.question}
                  </p>

                  {savol.image && (
                    <div className="mb-3 p-3 bg-black/40 rounded-xl border border-purple-800/40 flex justify-center">
                      <img src={savol.image} alt="Savol rasmi" className="max-h-48 object-contain rounded-lg" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {savol.options.map((opt, oIdx) => {
                      const isCorrectOpt = oIdx === savol.correct
                      const isUserChoice = oIdx === tanlangan

                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            isCorrectOpt
                              ? 'bg-green-600/30 border-green-500 text-green-200 font-bold'
                              : isUserChoice
                              ? 'bg-red-600/30 border-red-500 text-red-200 font-bold'
                              : 'bg-black/20 border-purple-900/30 text-purple-300 opacity-70'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center font-mono text-[10px]">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      )
                    })}
                  </div>

                  {savol.explanation && (
                    <div className="mt-3 p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200 leading-relaxed">
                      <strong>Tushuntirish:</strong> {savol.explanation}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // 3-HOLAT: SINOV TESTI EKRANI (IMTIHON JARAYONI)
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="max-w-6xl mx-auto space-y-4 px-4 py-4">
      {/* Yuqori boshqaruv paneli */}
      <div className="bg-slate-900/95 border border-purple-800/50 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-4 sticky top-2 z-40 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Ikon nom="kolba" olcham={20} />
          </span>
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs font-mono text-purple-400 block font-bold truncate">
              SAVOL {joriyIndex + 1} / {savollar.length}
            </span>
            <h1 className="text-xs sm:text-base font-bold text-white truncate max-w-[140px] sm:max-w-md">
              {partnership.partnerName} & JDA Kimyo
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Taymer */}
          <div className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl border flex items-center gap-1.5 font-mono font-bold text-xs sm:text-base ${
            qolganVaqt <= 300
              ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
              : 'bg-purple-900/40 border-purple-700/50 text-amber-300'
          }`}>
            <Ikon nom="soat" olcham={16} />
            <span>{soniyaFormat(qolganVaqt)}</span>
          </div>

          {/* Yakunlash tugmasi */}
          <button
            type="button"
            onClick={() => setTasdiqModali(true)}
            className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-transform flex items-center gap-1.5"
          >
            <Ikon nom="tasdiq" olcham={16} />
            <span className="hidden sm:inline">Sinovni Yakunlash</span>
            <span className="sm:hidden">Yakunlash</span>
          </button>
        </div>
      </div>

      {/* Asosiy ishchi maydon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* CHAP / O'RTA: SAVOL MATNI VA VARIANTLAR */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-purple-800/40 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs text-purple-400 border-b border-purple-800/40 pb-3">
            <span className="font-mono font-bold">Savol #{joriyIndex + 1}</span>
            <span className="text-amber-400 font-semibold">1 ball</span>
          </div>

          {/* Savol matni */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-xl font-bold text-white leading-relaxed whitespace-pre-line">
              {joriySavol.question}
            </h2>

            {/* Agar savolda rasm bo'lsa */}
            {joriySavol.image && (
              <div className="p-3 bg-black/40 rounded-2xl border border-purple-800/40 flex justify-center">
                <img src={joriySavol.image} alt="Savol rasmi" className="max-h-64 object-contain rounded-xl" />
              </div>
            )}
          </div>

          {/* Variantlar */}
          <div className="space-y-3 pt-2">
            {joriySavol.options.map((variant, vIdx) => {
              const isSelected = joriyTanlangan === vIdx

              return (
                <button
                  key={vIdx}
                  type="button"
                  onClick={() => javobTanla(vIdx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-400 text-white font-bold shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                      : 'bg-black/30 border-purple-800/40 hover:border-purple-600/70 text-purple-200 hover:bg-black/50'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-purple-900/40 text-purple-300 border border-purple-700/40'
                    }`}
                  >
                    {String.fromCharCode(65 + vIdx)}
                  </span>
                  <span className="text-sm sm:text-base leading-snug flex-1">{variant}</span>
                </button>
              )
            })}
          </div>

          {/* Oldingi / Keyingi navigatsiya */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-800/40">
            <button
              type="button"
              onClick={() => setJoriyIndex((i) => Math.max(0, i - 1))}
              disabled={joriyIndex === 0}
              className="px-5 py-2.5 rounded-xl bg-black/40 border border-purple-800/40 text-purple-300 hover:text-white hover:bg-purple-900/30 disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-semibold flex items-center gap-2"
            >
              <Ikon nom="chap" olcham={16} /> Oldingi savol
            </button>

            <button
              type="button"
              onClick={() => setJoriyIndex((i) => Math.min(savollar.length - 1, i + 1))}
              disabled={joriyIndex === savollar.length - 1}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md"
            >
              Keyingi savol <Ikon nom="ong" olcham={16} />
            </button>
          </div>
        </div>

        {/* O'NG: 30 TALIK SAVOLLAR XARITASI */}
        <div className="bg-slate-900/80 border border-purple-800/40 rounded-3xl p-5 sm:p-6 space-y-4 h-fit">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
            <div className="flex items-center gap-2">
              <Ikon nom="quiz" olcham={18} className="text-amber-400" />
              <h3 className="text-sm font-bold text-white">Savollar Xaritasi</h3>
            </div>
            <span className="text-xs text-amber-400 font-mono font-bold">
              {Math.round((javobBerilganSoni / savollar.length) * 100)}%
            </span>
          </div>

          {/* 1..30 Kataklar to'plami */}
          <div className="grid grid-cols-6 sm:grid-cols-5 gap-1.5 sm:gap-2">
            {savollar.map((savol, idx) => {
              const isCurrent = idx === joriyIndex
              const isAnswered = javoblar[savol.id] !== undefined

              return (
                <button
                  key={savol.id}
                  type="button"
                  onClick={() => setJoriyIndex(idx)}
                  className={`h-10 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center border ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105 ring-2 ring-amber-400/50'
                      : isAnswered
                      ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300 font-bold'
                      : 'bg-black/30 border-purple-800/40 text-purple-300 hover:border-purple-600 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>

          {/* Izohlar */}
          <div className="space-y-1.5 text-[11px] text-purple-400 pt-2 border-t border-purple-800/40">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber-400 inline-block" />
              <span>Joriy savol</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-600/40 border border-emerald-500/60 inline-block" />
              <span>Javob berilgan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-black/40 border border-purple-800/50 inline-block" />
              <span>Javob berilmagan</span>
            </div>
          </div>
        </div>
      </div>

      {/* YAKUNLASH TASDIQ MODALI */}
      {tasdiqModali && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-700/60 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
              <Ikon nom="ogohlantirish" olcham={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Sinovni yakunlaysizmi?</h3>
              <p className="text-xs sm:text-sm text-purple-300 leading-relaxed">
                Siz <strong>{savollar.length}</strong> ta savoldan <strong>{javobBerilganSoni}</strong> tasiga javob berdingiz.
                {javobBerilganSoni < savollar.length && (
                  <span className="block text-amber-400 font-medium pt-1">
                    Diqqat: {savollar.length - javobBerilganSoni} ta savol belgilanmasdan qolgan!
                  </span>
                )}
              </p>
            </div>

            {xatolik && (
              <div className="p-3 bg-red-900/30 border border-red-500/40 rounded-xl text-xs text-red-300 font-bold">
                {xatolik}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTasdiqModali(false)}
                className="flex-1 py-3 rounded-xl bg-black/40 border border-purple-800/50 text-purple-300 hover:bg-black/60 text-xs sm:text-sm font-semibold"
              >
                Davom ettirish
              </button>

              <button
                type="button"
                onClick={testniYakunla}
                disabled={yuklanmoqda}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md"
              >
                {yuklanmoqda ? 'Yuborilmoqda...' : 'Ha, yakunlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
