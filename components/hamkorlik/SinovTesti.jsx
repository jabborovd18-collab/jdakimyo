// components/hamkorlik/SinovTesti.jsx
"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ALCHEMIQ_SAVOLLAR } from '@/data/hamkorlik/alchemiq-savollar'
import SertifikatYuklab from '@/components/SertifikatYuklab'

function soniyaFormat(s) {
  const min = Math.floor(s / 60)
  const sec = s % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function SinovTesti({ partnership, user, onFinish }) {
  const savollar = ALCHEMIQ_SAVOLLAR
  const jamiVaqtSec = (partnership?.timeLimitMin || 40) * 60

  const [joriyIndex, setJoriyIndex] = useState(0)
  const [javoblar, setJavoblar] = useState({}) // { [savolId]: variantIndex }
  const [qolganVaqt, setQolganVaqt] = useState(jamiVaqtSec)
  const [sarflanganVaqt, setSarflanganVaqt] = useState(0)
  const [sinovYakunlandi, setSinovYakunlandi] = useState(false)
  const [tasdiqModali, setTasdiqModali] = useState(false)
  const [natija, setNatija] = useState(null)
  const [yuborilmoqda, setYuborilmoqda] = useState(false)

  const taymerRef = useRef(null)

  // Countdown taymeri
  useEffect(() => {
    if (sinovYakunlandi) return

    taymerRef.current = setInterval(() => {
      setQolganVaqt((prev) => {
        if (prev <= 1) {
          clearInterval(taymerRef.current)
          yakunlashniBajar(true)
          return 0
        }
        return prev - 1
      })
      setSarflanganVaqt((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(taymerRef.current)
  }, [sinovYakunlandi])

  // Variant tanlash / almashtirish
  const variantTanla = (variantIndex) => {
    if (sinovYakunlandi) return
    const savol = savollar[joriyIndex]
    setJavoblar((prev) => ({
      ...prev,
      [savol.id]: variantIndex
    }))
  }

  // Sinovni yakunlash va serverga yuborish
  const yakunlashniBajar = async (avtomatik = false) => {
    if (sinovYakunlandi || yuborilmoqda) return
    setTasdiqModali(false)
    setYuborilmoqda(true)
    clearInterval(taymerRef.current)

    // Ballarni hisoblash
    let togriSoni = 0
    savollar.forEach((savol) => {
      if (javoblar[savol.id] === savol.correct) {
        togriSoni++
      }
    })

    const foiz = parseFloat(((togriSoni / savollar.length) * 100).toFixed(1))
    const otdimi = foiz >= (partnership?.minPassPercent || 75.0)

    try {
      const res = await fetch(`/api/hamkorlik/${partnership.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_attempt',
          score: togriSoni,
          percentage: foiz,
          totalQuestions: savollar.length,
          timeSpentSec: sarflanganVaqt,
          passed: otdimi
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setNatija({
        score: togriSoni,
        percentage: foiz,
        total: savollar.length,
        timeSpentSec: sarflanganVaqt,
        passed: otdimi,
        certId: data.certId || null,
        certificate: data.certificate || null
      })
      setSinovYakunlandi(true)

      if (otdimi) {
        toast.success('Tabriklaymiz! Siz sinovdan a\'lo o\'tdingiz va sertifikatga ega bo\'ldingiz! 🏆', { duration: 6000 })
      } else {
        toast.error('Afsuski, o\'tish baliga ozgina yetmadi.', { duration: 5000 })
      }

      if (onFinish) onFinish()
    } catch (e) {
      console.error('[Sinov Yakunlash Xatosi]:', e)
      toast.error('Natijani saqlashda xatolik: ' + e.message)
      // Lokal hisobni baribir ko'rsatamiz
      setNatija({
        score: togriSoni,
        percentage: foiz,
        total: savollar.length,
        timeSpentSec: sarflanganVaqt,
        passed: otdimi
      })
      setSinovYakunlandi(true)
    } finally {
      setYuborilmoqda(false)
    }
  }

  const joriySavol = savollar[joriyIndex]
  const javobBerilganSoni = Object.keys(javoblar).length
  const qolganSavollarSoni = savollar.length - javobBerilganSoni

  // ═══════════════════════════════════════════════════════════════
  // NATIJA EKRANI
  // ═══════════════════════════════════════════════════════════════
  if (sinovYakunlandi && natija) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
        {/* Natija kartasi */}
        <div className="bg-slate-900/90 border border-purple-800/50 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-yellow-500/20 border-2 border-yellow-400 flex items-center justify-center text-4xl shadow-lg">
            {natija.passed ? '🏆' : '📊'}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {natija.passed ? 'Sinov Muvaffaqiyatli Yakunlandi!' : 'Sinov Yakunlandi'}
            </h2>
            <p className="text-sm text-purple-300">
              {partnership.partnerName} va JDA Kimyo hamkorligidagi {partnership.title}
            </p>
          </div>

          {/* Statistik ko'rsatkichlar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-center">
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-800/40">
              <span className="text-[11px] text-purple-400 block font-semibold">To&apos;g&apos;ri javoblar</span>
              <strong className="text-2xl font-bold text-white mt-1 block">
                {natija.score} / {natija.total}
              </strong>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-800/40">
              <span className="text-[11px] text-purple-400 block font-semibold">Natija foizi</span>
              <strong className={`text-2xl font-bold mt-1 block ${natija.passed ? 'text-green-400' : 'text-red-400'}`}>
                {natija.percentage}%
              </strong>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-800/40">
              <span className="text-[11px] text-purple-400 block font-semibold">Sarflangan vaqt</span>
              <strong className="text-2xl font-bold text-yellow-400 mt-1 block font-mono">
                {soniyaFormat(natija.timeSpentSec)}
              </strong>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-800/40">
              <span className="text-[11px] text-purple-400 block font-semibold">O&apos;tish holati</span>
              <strong className={`text-base font-bold mt-2 block ${natija.passed ? 'text-green-400' : 'text-purple-400'}`}>
                {natija.passed ? "O'TDI ✅" : "O'TMADI ❌"}
              </strong>
            </div>
          </div>

          {/* SERTIFIKAT YUKLASH TUGMASI */}
          {natija.passed && natija.certId && (
            <div className="pt-4 space-y-4 max-w-lg mx-auto">
              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-300">
                🎉 Siz rasmiy hamkorlik sertifikatini qo&apos;lga kiritdingiz! Sertifikat ID: <strong className="font-mono text-white underline">{natija.certId}</strong>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/sertifikat/verify/${natija.certId}`}
                  target="_blank"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-extrabold text-sm shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <span>📜</span>
                  <span>Sertifikatni Ko&apos;rish va Yuklab Olish</span>
                </Link>
                <Link
                  href="/profil/sertifikatlar"
                  className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-purple-700/50 flex items-center justify-center gap-2"
                >
                  <span>📂</span>
                  <span>Mening Sertifikatlarim</span>
                </Link>
              </div>
            </div>
          )}

          {!natija.passed && (
            <div className="text-xs text-purple-300 max-w-md mx-auto pt-2">
              Sertifikat olish uchun kamida <strong>{partnership.minPassPercent}%</strong> to&apos;plash talab etiladi. Bilimlaringizni oshirib, keyingi mavsumiy sinovlarda albatta qatnashing!
            </div>
          )}
        </div>

        {/* SAVOLLAR TAHLILI */}
        <div className="bg-slate-900/80 border border-purple-800/40 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📋</span>
            <span>Savollar Tahlili va To&apos;g&apos;ri Javoblar</span>
          </h3>

          <div className="space-y-4">
            {savollar.map((savol, idx) => {
              const tanlangan = javoblar[savol.id]
              const togri = tanlangan === savol.correct

              return (
                <div
                  key={savol.id}
                  className={`p-5 rounded-2xl border ${
                    togri
                      ? 'bg-green-950/20 border-green-700/40'
                      : tanlangan !== undefined
                      ? 'bg-red-950/20 border-red-700/40'
                      : 'bg-slate-950/40 border-purple-900/40'
                  } space-y-3`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-black/40 text-purple-300">
                      Savol {idx + 1}
                    </span>
                    <span className={`text-xs font-bold ${togri ? 'text-green-400' : 'text-red-400'}`}>
                      {togri ? 'To\'g\'ri (+1 ball)' : tanlangan !== undefined ? 'Noto\'g\'ri' : 'Javob berilmagan'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white whitespace-pre-line">{savol.question}</p>

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
                          {isCorrectOpt && <span className="ml-auto text-green-400">✓</span>}
                          {isUserChoice && !isCorrectOpt && <span className="ml-auto text-red-400">✗</span>}
                        </div>
                      )
                    })}
                  </div>

                  {savol.explanation && (
                    <div className="text-xs text-purple-300 bg-black/30 p-3 rounded-xl border border-purple-900/30">
                      💡 <strong>Tushuntirish:</strong> {savol.explanation}
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
  // SINOV TESTI EKRANI (IMTIHON REJIMI)
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="max-w-6xl mx-auto space-y-4 px-4 py-4">
      {/* Yuqori boshqaruv paneli */}
      <div className="bg-slate-900/90 border border-purple-800/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-40 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 flex items-center justify-center text-xl font-bold">
            🧪
          </span>
          <div>
            <span className="text-xs font-mono text-purple-400 block font-bold">
              SAVOL {joriyIndex + 1} / {savollar.length}
            </span>
            <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
              {partnership.partnerName} & JDA Kimyo Sinovi
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Taymer */}
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono font-bold text-sm sm:text-base ${
            qolganVaqt <= 300
              ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
              : 'bg-purple-900/40 border-purple-700/50 text-yellow-400'
          }`}>
            <span>⏳</span>
            <span>{soniyaFormat(qolganVaqt)}</span>
          </div>

          {/* Yakunlash tugmasi */}
          <button
            type="button"
            onClick={() => setTasdiqModali(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-transform"
          >
            🏁 Sinovni Yakunlash
          </button>
        </div>
      </div>

      {/* Asosiy ishchi maydon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* CHAP / O'RTA: SAVOL MATNI VA VARIANTLAR */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-purple-800/40 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs text-purple-400 border-b border-purple-800/40 pb-3">
            <span className="font-mono font-bold">Savol #{joriyIndex + 1}</span>
            <span className="text-yellow-400 font-semibold">1 ball</span>
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
              const isSelected = javoblar[joriySavol.id] === vIdx

              return (
                <button
                  key={vIdx}
                  type="button"
                  onClick={() => variantTanla(vIdx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 text-sm sm:text-base ${
                    isSelected
                      ? 'bg-yellow-500/20 border-yellow-400 text-white font-bold shadow-md scale-[1.01]'
                      : 'bg-purple-950/20 border-purple-800/40 hover:border-purple-600 text-purple-200 hover:text-white'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-yellow-400 text-black'
                      : 'bg-purple-900/50 text-purple-300'
                  }`}>
                    {String.fromCharCode(65 + vIdx)}
                  </span>
                  <span className="leading-snug">{variant}</span>
                </button>
              )
            })}
          </div>

          {/* Navigatsiya tugmalari */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-800/40">
            <button
              type="button"
              disabled={joriyIndex === 0}
              onClick={() => setJoriyIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800 text-white text-xs font-bold disabled:opacity-30 disabled:hover:bg-purple-900/40 transition-colors"
            >
              ← Oldingi savol
            </button>

            <span className="text-xs text-purple-400 font-mono">
              {javobBerilganSoni} / {savollar.length} javob berildi
            </span>

            <button
              type="button"
              disabled={joriyIndex === savollar.length - 1}
              onClick={() => setJoriyIndex((prev) => Math.min(savollar.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 text-xs font-bold disabled:opacity-30 transition-colors"
            >
              Keyingi savol →
            </button>
          </div>
        </div>

        {/* O'NG: 30 TALIK SAVOLLAR XARITASI */}
        <div className="bg-slate-900/80 border border-purple-800/40 rounded-3xl p-5 sm:p-6 space-y-4 h-fit">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <span>🗺️</span>
              <span>Savollar Xaritasi</span>
            </h3>
            <span className="text-xs text-yellow-400 font-mono font-bold">
              {Math.round((javobBerilganSoni / savollar.length) * 100)}%
            </span>
          </div>

          {/* 1..30 Kataklar to'plami */}
          <div className="grid grid-cols-5 gap-2">
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
                      ? 'bg-yellow-400 text-black border-yellow-300 shadow-md scale-105 ring-2 ring-yellow-400/50'
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
              <span className="w-3 h-3 rounded-md bg-yellow-400 inline-block" />
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
          <div className="bg-slate-900 border border-purple-700/60 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center text-3xl">
              ⚠️
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Sinovni Yakunlashni Xohlaysizmi?</h3>
              {qolganSavollarSoni > 0 ? (
                <p className="text-xs text-yellow-300">
                  Siz hali <strong>{qolganSavollarSoni} ta</strong> savolga javob bermadingiz. Belgilanmagan savollar noto&apos;g&apos;ri deb hisoblanadi.
                </p>
              ) : (
                <p className="text-xs text-purple-300">
                  Barcha 30 ta savolga javob berildi. Natijalarni ko&apos;rish va sertifikatni tekshirish uchun yakunlang.
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => setTasdiqModali(false)}
                className="px-5 py-2.5 rounded-xl border border-purple-700/50 text-purple-300 hover:text-white text-xs font-bold"
              >
                Davom etish
              </button>
              <button
                type="button"
                disabled={yuborilmoqda}
                onClick={() => yakunlashniBajar(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-extrabold shadow-md hover:scale-105 transition-transform"
              >
                {yuborilmoqda ? 'Hisoblanmoqda...' : 'Ha, Yakunlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
