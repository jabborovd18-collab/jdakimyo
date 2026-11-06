"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import Ikon from "@/components/Ikon"
import {
  RASCH_BO_LIMLARI,
  MILLIY_SERTIFIKAT_VARIANTLARI,
  SERTIFIKAT_DARAJALARI,
} from "@/lib/milliy-sertifikat-data"

export default function MilliySertifikatBoshSahifa() {
  const [tanlanganBolim, setTanlanganBolim] = useState("all")
  const [qidiruv, setQidiruv] = useState("")

  // Bo'lim va qidiruv bo'yicha filtrlangan variantlar
  const saralanganVariantlar = useMemo(() => {
    return MILLIY_SERTIFIKAT_VARIANTLARI.filter((v) => {
      const bolimMos =
        tanlanganBolim === "all" || v.bolimId === tanlanganBolim
      const matnMos =
        !qidiruv.trim() ||
        v.nom.toLowerCase().includes(qidiruv.toLowerCase()) ||
        v.qisqa.toLowerCase().includes(qidiruv.toLowerCase()) ||
        v.daraja.toLowerCase().includes(qidiruv.toLowerCase())
      return bolimMos && matnMos
    })
  }, [tanlanganBolim, qidiruv])

  // Joriy bo'lim ma'lumotlari
  const joriyBolim = useMemo(() => {
    if (tanlanganBolim === "all") return null
    return RASCH_BO_LIMLARI.find((b) => b.id === tanlanganBolim)
  }, [tanlanganBolim])

  return (
    <main
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className="min-h-screen flex flex-col font-serif bg-gradient-to-b from-[#0b0d2d] via-[#081845] via-35% via-[#051135] to-[#020514] text-white relative overflow-x-hidden justify-between"
    >
      {/* ─── FON EFFEKTLARI (TO'Q MOVİY-SAFIR AMBIENT NURLAR) ─── */}
      <div className="absolute top-0 left-1/4 w-[42rem] h-[42rem] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-72 -left-20 w-[36rem] h-[36rem] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-10 w-[38rem] h-[38rem] bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-48 left-1/3 w-[40rem] h-[40rem] bg-blue-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─── 1. YUQORI SARLAVHA (HEADER) ─── */}
      <header className="border-b border-blue-900/50 bg-[#070c29]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl border border-blue-800/60 bg-[#0b1437]/70 hover:border-yellow-400/50 hover:bg-[#102054]/80 text-blue-200 hover:text-white transition"
              title="Bosh sahifaga qaytish"
            >
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                  Rasch IRT &amp; Milliy sertifikat
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-blue-700/50 bg-blue-900/40 text-blue-200 font-sans">
                  Ilmiy baholash
                </span>
              </div>
              <div className="text-xs text-blue-300/80">
                Georg Rasch logit modeli asosidagi tayyorgarlik sinovlari
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/testlar"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-blue-800/60 bg-[#09153a]/60 hover:border-yellow-400/50 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition hidden sm:flex items-center gap-1.5"
            >
              <Ikon nom="quiz" olcham={14} />
              <span>Boshqa testlar</span>
            </Link>
            <Link
              href="/profil"
              className="p-2.5 rounded-xl border border-blue-800/60 bg-[#0b1437]/70 hover:border-yellow-400/50 hover:bg-[#102054]/80 text-blue-200 hover:text-white transition"
              title="Shaxsiy profil"
            >
              <Ikon nom="odam" olcham={18} />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 2. HERO BO'LIMI: RASCH IRT VA DAVLAT STANDARTI ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 w-full relative z-10">
        <div className="p-4 sm:p-8 rounded-3xl border border-blue-800/50 bg-gradient-to-br from-[#121646]/70 via-[#0a183d]/70 to-[#07112c]/70 backdrop-blur-md shadow-2xl shadow-blue-950/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 rounded-full text-xs font-semibold">
              <Ikon nom="atom" olcham={14} />
              <span>Item Response Theory (IRT) &amp; Georg Rasch modeli</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Kimyo bo&apos;yicha ilmiy bilim darajangizni aniqlang
            </h2>
            <p className="text-sm text-blue-200/90 leading-relaxed">
              Bu tizimda shunchaki to&apos;g&apos;ri javoblar soni emas, balki har bir savolning
              qiyinchilik logiti (<span className="text-cyan-300 font-mono font-semibold">bᵢ</span>) va sizning individual qobiliyatingiz (<span className="text-yellow-300 font-mono font-semibold">θ</span>) hisoblanadi.
              Wright Map orqali qaysi mavzularni o&apos;zlashtirganingiz va qaysi savollar
              bilim chegarangizda ekani aniqlab beriladi.
            </p>
          </div>

          {/* 3 ta ilmiy parametr kartasi */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto shrink-0">
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-[#070f2b]/80 border border-blue-800/50 text-center space-y-1">
              <div className="text-yellow-400 flex justify-center">
                <Ikon nom="kuzatuv" olcham={20} />
              </div>
              <div className="text-sm sm:text-lg font-bold text-white font-mono">
                θ (Theta)
              </div>
              <div className="text-[10px] sm:text-[11px] text-blue-300/80">Logit shkalasi</div>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-[#070f2b]/80 border border-blue-800/50 text-center space-y-1">
              <div className="text-yellow-400 flex justify-center">
                <Ikon nom="soat" olcham={20} />
              </div>
              <div className="text-sm sm:text-lg font-bold text-white font-mono">
                60–150 daq
              </div>
              <div className="text-[10px] sm:text-[11px] text-blue-300/80">Vaqt me&apos;yori</div>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-[#070f2b]/80 border border-blue-800/50 text-center space-y-1">
              <div className="text-yellow-400 flex justify-center">
                <Ikon nom="medal" olcham={20} />
              </div>
              <div className="text-sm sm:text-lg font-bold text-white font-mono">
                A+ / 70+ ball
              </div>
              <div className="text-[10px] sm:text-[11px] text-blue-300/80">Rasmiy shkala</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. BO'LIMLAR FILTRI VA QIDIRUV ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 w-full relative z-10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Ikon nom="filtr" olcham={18} className="text-yellow-400" />
              <span>Sinov yo&apos;nalishlari va simulyatorlar</span>
            </h3>
            <p className="text-xs text-blue-300/80">
              Diagnostika, milliy sertifikatga tayyorgarlik yoki attestatsiya sinovini tanlang
            </p>
          </div>

          {/* Qidiruv input */}
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400">
              <Ikon nom="qidiruv" olcham={15} />
            </span>
            <input
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Sinov nomi yoki daraja..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-blue-800/60 bg-[#09153a]/60 text-white placeholder-blue-300/40 text-xs focus:border-yellow-400 focus:outline-none transition backdrop-blur-sm"
            />
            {qidiruv && (
              <button
                onClick={() => setQidiruv("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-400 hover:text-white"
                title="Tozalash"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Bo'lim Tablari */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {RASCH_BO_LIMLARI.map((b) => {
            const faol = tanlanganBolim === b.id
            return (
              <button
                key={b.id}
                onClick={() => setTanlanganBolim(b.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 border ${
                  faol
                    ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/20 font-bold scale-[1.02]"
                    : "bg-[#0b1437]/70 hover:bg-[#102054]/80 text-blue-200 border-blue-800/50 hover:border-blue-700"
                }`}
              >
                <Ikon nom={b.ikon || "quiz"} olcham={15} />
                <span>{b.nom}</span>
              </button>
            )
          })}
        </div>

        {/* Tanlangan bo'lim haqida tushuntirish */}
        {joriyBolim && (
          <div className="p-4 rounded-2xl border border-blue-800/40 bg-gradient-to-r from-[#0d1640]/70 to-[#070f2b]/70 backdrop-blur-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
              <Ikon nom={joriyBolim.ikon || "kuzatuv"} olcham={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  {joriyBolim.nom}
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-sans">
                  {joriyBolim.badge}
                </span>
              </div>
              <div className="text-xs text-blue-300/80">
                {joriyBolim.tavsif}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ─── 4. SINOV VARIANTLARI KATALOGI (GRID) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 w-full relative z-10 flex-1">
        {saralanganVariantlar.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-blue-800/40 bg-[#070f2b]/60 backdrop-blur-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-900/30 text-blue-300 flex items-center justify-center mx-auto">
              <Ikon nom="qidiruv" olcham={24} />
            </div>
            <h4 className="text-base font-bold text-white">
              Hech qanday sinov topilmadi
            </h4>
            <p className="text-xs text-blue-300/70 max-w-sm mx-auto">
              Qidiruv so&apos;zini o&apos;zgartiring yoki boshqa bo&apos;limni tanlang.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {saralanganVariantlar.map((v) => (
              <div
                key={v.id}
                className="p-5 sm:p-7 rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/40 via-[#0b1a3d]/50 to-[#070f2b]/40 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Yuqori qator: Ikon va Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover:text-yellow-400 transition-colors">
                      <Ikon nom={v.ikon || "sertifikat"} olcham={24} />
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-sm ${
                        v.badgeRang ||
                        "border-blue-700/50 bg-blue-900/40 text-blue-200"
                      }`}
                    >
                      {v.badge}
                    </span>
                  </div>

                  {/* Sarlavha */}
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors mt-0.5">
                      {v.nom}
                    </h4>
                    <div className="text-xs text-yellow-400/90 font-medium mt-1">
                      {v.qisqa}
                    </div>
                    <p className="text-xs text-blue-200/80 mt-2 leading-relaxed">
                      {v.tavsif}
                    </p>
                  </div>

                  {/* Ko'rsatkichlar: Savollar, Vaqt, Model */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-900/40 text-center">
                    <div className="p-2.5 rounded-xl bg-[#070f2b]/60 border border-blue-800/30">
                      <div className="text-[11px] text-blue-300/70">Savollar</div>
                      <div className="text-sm font-bold text-white font-mono mt-0.5">
                        {v.savollarSoni} ta
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#070f2b]/60 border border-blue-800/30">
                      <div className="text-[11px] text-blue-300/70">Vaqt</div>
                      <div className="text-sm font-bold text-white font-mono mt-0.5">
                        {v.vaqtMin} daq
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#070f2b]/60 border border-blue-800/30">
                      <div className="text-[11px] text-blue-300/70">Model</div>
                      <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5 truncate">
                        Rasch IRT
                      </div>
                    </div>
                  </div>

                  {/* Savollar tuzilmasi */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-sans text-blue-300/80">
                    <span className="px-2.5 py-0.5 rounded bg-[#09153a]/80 border border-blue-800/40">
                      Yopiq: {v.tuzilma.yopiq}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-[#09153a]/80 border border-blue-800/40">
                      Moslashtirish: {v.tuzilma.moslashtirish}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Ochiq: {v.tuzilma.ochiq}
                    </span>
                  </div>
                </div>

                {/* Harakat tugmasi */}
                <div className="mt-6 pt-4 border-t border-blue-900/40 flex items-center gap-3">
                  <Link
                    href={`/milliy-sertifikat/${v.slug}`}
                    className="flex-1 py-3 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black transition shadow-md shadow-yellow-500/20 flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                  >
                    <Ikon nom="play" olcham={15} />
                    <span>Sinovni boshlash</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── 5. RASCH ILMIY BAHOLASH MODELI VA WRIGHT MAP TUSHUNTIRIShI ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full relative z-10">
        <div className="p-6 sm:p-7 rounded-3xl border border-yellow-500/30 bg-gradient-to-r from-[#171c4d]/60 via-[#101b3d]/60 to-[#0c1630]/60 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 flex items-center justify-center shrink-0 mt-1">
              <Ikon nom="kuzatuv" olcham={22} />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                Ilmiy asos &amp; Georg Rasch modeli
              </div>
              <h4 className="text-lg font-bold text-white">
                Nima uchun oddiy foiz emas, balki Rasch logiti (θ)?
              </h4>
              <p className="text-xs text-blue-200/90 max-w-2xl leading-relaxed">
                Klassik testlarda 30 ta oson savolni yechgan o&apos;quvchi bilan 30 ta qiyin savolni
                yechgan o&apos;quvchi bir xil ball oladi. <b>Rasch modeli</b> esa har bir savolning
                haqiqiy qiyinligini hisobga oladi. Murakkab savollarni to&apos;g&apos;ri yechish
                bilim logitini (<span className="text-yellow-300 font-mono font-bold">θ</span>) keskin oshiradi va adolatli baho beradi.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto text-xs font-mono text-blue-200">
            <div className="px-3.5 py-1.5 rounded-xl bg-[#070f2b]/80 border border-blue-800/40 text-center">
              Formula: <span className="text-yellow-400 font-bold font-mono">P = 1 / (1 + e<sup>-(θ - b)</sup>)</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-[#070f2b]/80 border border-blue-800/40 text-center">
              Wright Map &amp; Infit/Outfit MNSQ
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. SERTIFIKAT DARAJALARI ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full relative z-10 space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-900/40 border border-blue-700/40 text-blue-300 text-xs font-semibold">
            <Ikon nom="medal" olcham={13} />
            <span>Rasmiy shkala</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Milliy sertifikat darajalari
          </h3>
          <p className="text-xs text-blue-200/80">
            Natijangiz taxminiy: bu sinov davlat sertifikati bermaydi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {SERTIFIKAT_DARAJALARI.map((d) => (
            <div
              key={d.daraja}
              className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-sm space-y-2.5 transition-all ${d.chegaraRang}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold font-mono tracking-tight">
                  {d.daraja}
                </span>
                <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-black/30 border border-white/10">
                  {d.shkala}
                </span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed pt-1 border-t border-white/10">
                {d.imtiyoz}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. FOOTER ─── */}
      <footer className="border-t border-blue-900/50 bg-[#070c29]/90 py-8 relative z-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300/70">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-slate-950">
              <Ikon nom="atom" olcham={13} qalin={2} />
            </span>
            <span className="font-bold text-white">JDA KIMYO</span>
            <span>— Rasch IRT Ilmiy Baholash va Milliy Sertifikat Tizimi</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-yellow-400 transition">
              Bosh sahifa
            </Link>
            <Link href="/maktabkimyo" className="hover:text-yellow-400 transition">
              Maktab kimyosi
            </Link>
            <Link href="/oliykimyo" className="hover:text-yellow-400 transition">
              Oliy kimyo
            </Link>
            <Link href="/testlar" className="hover:text-yellow-400 transition">
              Boshqa testlar
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
