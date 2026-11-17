"use client"

import Link from "next/link"
import { useState, useMemo, useEffect } from "react"
import Ikon from "@/components/Ikon"
import { sanaVaqt } from "@/lib/sana"
import {
  RASCH_BO_LIMLARI,
  MILLIY_SERTIFIKAT_VARIANTLARI,
  SERTIFIKAT_DARAJALARI,
} from "@/lib/milliy-sertifikat-data"

function muddatFormat(ms) {
  if (!ms || ms <= 0) return "00:00:00"
  const jamiS = Math.floor(ms / 1000)
  const kun = Math.floor(jamiS / 86400)
  const soat = Math.floor((jamiS % 86400) / 3600)
  const daq = Math.floor((jamiS % 3600) / 60)
  const son = jamiS % 60
  const p = (x) => String(x).padStart(2, "0")
  return kun > 0 ? `${kun} kun ${p(soat)}:${p(daq)}:${p(son)}` : `${p(soat)}:${p(daq)}:${p(son)}`
}

export default function MilliySertifikatBoshSahifa() {
  const [tanlanganBolim, setTanlanganBolim] = useState("all")
  const [qidiruv, setQidiruv] = useState("")
  const [serverSinovlar, setServerSinovlar] = useState(null)
  const [kirganmi, setKirganmi] = useState(null)
  const [superadminRejimi, setSuperadminRejimi] = useState(false)
  const [soatFarqiMs, setSoatFarqiMs] = useState(0)
  const [hozirMs, setHozirMs] = useState(() => Date.now())

  // Sinov holati va imtihon jadvali faqat serverdan keladi
  useEffect(() => {
    fetch("/api/milliy-sertifikat/katalog")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.sinovlar)) {
          setServerSinovlar(d.sinovlar)
        }
        if (typeof d?.kirganmi === "boolean") {
          setKirganmi(d.kirganmi)
        }
        if (d?.superadminRejimi) {
          setSuperadminRejimi(true)
        }
        if (d?.serverVaqt) {
          const sv = new Date(d.serverVaqt).getTime()
          if (!Number.isNaN(sv)) setSoatFarqiMs(sv - Date.now())
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const t = setInterval(() => setHozirMs(Date.now() + soatFarqiMs), 1000)
    return () => clearInterval(t)
  }, [soatFarqiMs])

  // Bo'lim va qidiruv bo'yicha filtrlangan variantlar
  const saralanganVariantlar = useMemo(() => {
    const manba = serverSinovlar || MILLIY_SERTIFIKAT_VARIANTLARI
    return manba.filter((v) => {
      const bolimMos =
        tanlanganBolim === "all" || v.bolimId === tanlanganBolim
      const matnMos =
        !qidiruv.trim() ||
        v.nom.toLowerCase().includes(qidiruv.toLowerCase()) ||
        v.qisqa.toLowerCase().includes(qidiruv.toLowerCase()) ||
        v.daraja.toLowerCase().includes(qidiruv.toLowerCase())
      return bolimMos && matnMos
    })
  }, [tanlanganBolim, qidiruv, serverSinovlar])

  // Joriy bo'lim ma'lumotlari
  const joriyBolim = useMemo(() => {
    if (tanlanganBolim === "all") return null
    return RASCH_BO_LIMLARI.find((b) => b.id === tanlanganBolim)
  }, [tanlanganBolim])

  return (
    <main
      className="ms-akademik ms-fon min-h-screen flex flex-col font-serif text-white relative overflow-x-hidden justify-between"
    >
      {/* ─── FON EFFEKTLARI (YORQIN SAFIR-ZUMRAD AMBIENT NURLAR) ─── */}
      <div className="hidden md:block absolute -top-10 left-1/4 w-[42rem] h-[42rem] bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute top-64 -left-24 w-[36rem] h-[36rem] bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute top-80 right-0 w-[38rem] h-[38rem] bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute bottom-48 left-1/3 w-[40rem] h-[40rem] bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute bottom-8 right-10 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* ─── 1. YUQORI SARLAVHA (HEADER) ─── */}
      <header className="ms-header md:backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl border border-sky-400/35 bg-[#102260]/80 hover:border-amber-300/70 hover:bg-[#173287] text-sky-100 hover:text-white transition shadow-sm"
              title="Bosh sahifaga qaytish"
            >
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
                Milliy sertifikat
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/sertifikat"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-sky-400/35 bg-[#102260]/80 hover:border-amber-300/70 hover:bg-[#173287] text-sky-100 hover:text-white transition hidden sm:flex items-center gap-1.5 shadow-sm"
            >
              <Ikon nom="qalqon" olcham={14} />
              <span>Tekshirish</span>
            </Link>
            <Link
              href="/testlar"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-sky-400/35 bg-[#102260]/80 hover:border-amber-300/70 hover:bg-[#173287] text-sky-100 hover:text-white transition hidden sm:flex items-center gap-1.5 shadow-sm"
            >
              <Ikon nom="quiz" olcham={14} />
              <span>Testlar</span>
            </Link>
            <Link
              href={kirganmi === false ? "/login?callbackUrl=%2Fmilliy-sertifikat" : "/profil"}
              className={`rounded-xl border transition shadow-sm flex items-center gap-1.5 text-xs font-semibold ${
                kirganmi === false
                  ? "px-3.5 py-2 border-amber-300/60 bg-amber-400/20 hover:bg-amber-400/30 text-amber-100"
                  : "p-2.5 border-sky-400/35 bg-[#102260]/80 hover:border-amber-300/70 hover:bg-[#173287] text-sky-100 hover:text-white"
              }`}
              title={kirganmi === false ? "Profilga kirish" : "Shaxsiy profil"}
            >
              <Ikon nom="odam" olcham={18} />
              {kirganmi === false && <span>Kirish</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 2. HERO BO'LIMI: RASCH IRT VA DAVLAT STANDARTI ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 w-full relative z-10 space-y-4">
        {superadminRejimi && (
          <div className="ms-karta-oltin px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-100">
              <Ikon nom="toj" olcham={15} className="text-amber-300 shrink-0" />
              <span>
                <strong className="text-amber-300">Superadmin:</strong> cheksiz sinov, natija bazaga yozilmaydi.
              </span>
            </div>
            <Link
              href="/admin/milliy-sertifikat"
              className="px-3 py-1.5 rounded-xl bg-[#0b1947]/90 hover:bg-[#13296e] border border-amber-300/45 text-amber-200 font-semibold inline-flex items-center gap-1.5 transition shrink-0"
            >
              <Ikon nom="grafik" olcham={14} />
              <span>Hisobot</span>
            </Link>
          </div>
        )}
        {kirganmi === false && (
          <div className="ms-karta-oltin px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-sky-100">
              <Ikon nom="odam" olcham={15} className="text-amber-300 shrink-0" />
              <span>Natija va sertifikat uchun tizimga kiring.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/login?callbackUrl=%2Fmilliy-sertifikat"
                className="ms-tugma-oltin px-3.5 py-1.5 rounded-xl border border-amber-200/80 font-bold transition"
              >
                Kirish
              </Link>
              <Link
                href="/register?callbackUrl=%2Fmilliy-sertifikat"
                className="px-3 py-1.5 rounded-xl bg-[#0b1947]/90 hover:bg-[#13296e] border border-sky-400/40 text-sky-100 font-semibold transition"
              >
                Ro&apos;yxatdan o&apos;tish
              </Link>
            </div>
          </div>
        )}
        <div className="ms-karta-hero p-4 sm:p-7 rounded-3xl md:backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
          <div className="hidden md:block absolute -right-20 -top-20 w-64 h-64 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 max-w-2xl relative">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
              Kimyo milliy sertifikat sinovlari
            </h2>
            <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
              Rasch IRT modeli (<span className="text-amber-300 font-mono font-semibold">θ</span>,{' '}
              <span className="text-cyan-300 font-mono font-semibold">bᵢ</span>) va Wright Map tahlili.
            </p>
          </div>

          {/* 3 ta ilmiy parametr kartasi */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto shrink-0 relative">
            <div className="ms-karta-ichki p-2.5 sm:p-3.5 rounded-2xl text-center space-y-1">
              <div className="text-amber-300 flex justify-center">
                <Ikon nom="kuzatuv" olcham={18} />
              </div>
              <div className="text-xs sm:text-base font-bold text-white font-mono whitespace-nowrap">
                θ (Theta)
              </div>
              <div className="text-[10px] sm:text-[11px] text-sky-200/90">Logit</div>
            </div>

            <div className="ms-karta-ichki p-2.5 sm:p-3.5 rounded-2xl text-center space-y-1">
              <div className="text-cyan-300 flex justify-center">
                <Ikon nom="soat" olcham={18} />
              </div>
              <div className="text-xs sm:text-base font-bold text-white font-mono whitespace-nowrap">
                {Math.min(...MILLIY_SERTIFIKAT_VARIANTLARI.map((v) => v.vaqtMin))}–
                {Math.max(...MILLIY_SERTIFIKAT_VARIANTLARI.map((v) => v.vaqtMin))} daq
              </div>
              <div className="text-[10px] sm:text-[11px] text-sky-200/90">Vaqt</div>
            </div>

            <div className="ms-karta-ichki p-2.5 sm:p-3.5 rounded-2xl text-center space-y-1">
              <div className="text-emerald-300 flex justify-center">
                <Ikon nom="medal" olcham={18} />
              </div>
              <div className="text-xs sm:text-base font-bold text-white font-mono whitespace-nowrap">
                A+ (70+)
              </div>
              <div className="text-[10px] sm:text-[11px] text-sky-200/90">Shkala</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. BO'LIMLAR FILTRI VA QIDIRUV ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 w-full relative z-10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Ikon nom="filtr" olcham={18} className="text-amber-300" />
            <span>Sinovlar</span>
          </h3>

          {/* Qidiruv input */}
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300">
              <Ikon nom="qidiruv" olcham={15} />
            </span>
            <input
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Qidirish..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-sky-400/40 bg-[#0d1f59]/95 md:bg-[#0d1f59]/85 text-white placeholder-sky-200/55 text-xs focus:border-amber-300 focus:outline-none transition-colors md:backdrop-blur-sm shadow-inner"
            />
            {qidiruv && (
              <button
                onClick={() => setQidiruv("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-300 hover:text-white inline-flex items-center"
                title="Tozalash"
              >
                <Ikon nom="yopish" olcham={13} />
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
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-[transform,background-color,border-color,color] shrink-0 flex items-center gap-2 border ${
                  faol
                    ? "ms-tugma-oltin border-amber-200 font-bold scale-[1.02]"
                    : "bg-[#112462]/90 md:bg-[#112462]/85 hover:bg-[#173184] text-sky-100 border-sky-400/30 hover:border-sky-300/60"
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
          <div className="ms-karta px-4 py-3 rounded-2xl md:backdrop-blur-sm flex items-center gap-3 text-xs text-sky-100">
            <Ikon nom={joriyBolim.ikon || "kuzatuv"} olcham={16} className="text-amber-300 shrink-0" />
            <span className="font-bold text-white shrink-0">{joriyBolim.nom}:</span>
            <span className="text-sky-200/90">{joriyBolim.tavsif}</span>
          </div>
        )}
      </section>

      {/* ─── 4. SINOV VARIANTLARI KATALOGI (GRID) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 w-full relative z-10 flex-1">
        {saralanganVariantlar.length === 0 ? (
          <div className="ms-karta p-12 text-center rounded-3xl md:backdrop-blur-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-400/20 border border-sky-400/40 text-sky-200 flex items-center justify-center mx-auto">
              <Ikon nom="qidiruv" olcham={24} />
            </div>
            <h4 className="text-base font-bold text-white">
              Hech qanday sinov topilmadi
            </h4>
            <p className="text-xs text-sky-200/85 max-w-sm mx-auto">
              Qidiruv so&apos;zini o&apos;zgartiring yoki boshqa bo&apos;limni tanlang.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {saralanganVariantlar.map((v) => {
              const jadval = v.jadval
              const ur = v.meningUrinishim
              const boshMs = jadval?.startsAt ? new Date(jadval.startsAt).getTime() : null
              const tugashMs = jadval?.endsAt ? new Date(jadval.endsAt).getTime() : null

              // Real-vaqtda server vaqti farqiga ko'ra holatni yangilaymiz
              let joriyHolat = v.holat
              if (v.bankTayyor && jadval && jadval.rejim === "jadval" && jadval.faol && boshMs && tugashMs) {
                if (jadval.isAnnounced) joriyHolat = "elon_qilindi"
                else if (hozirMs < boshMs) joriyHolat = "kutilmoqda"
                else if (hozirMs <= tugashMs) joriyHolat = "ochiq"
                else joriyHolat = "tekshirilmoqda"
              }

              return (
              <div
                key={v.id}
                className="ms-karta ms-karta-interaktiv p-5 sm:p-7 rounded-3xl md:backdrop-blur-sm flex flex-col justify-between group md:hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Yuqori qator: Ikon va Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/30 via-teal-400/25 to-cyan-500/25 border border-emerald-300/55 flex items-center justify-center text-emerald-200 group-hover:text-amber-200 group-hover:border-amber-300/65 transition-colors shadow-md shadow-emerald-500/15">
                      <Ikon nom={v.ikon || "sertifikat"} olcham={24} />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {jadval?.rejim === "jadval" && (
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-300/55 bg-amber-400/20 text-amber-200">
                          Belgilangan kun
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border md:backdrop-blur-sm ${
                          v.badgeRang ||
                          "border-sky-400/45 bg-sky-400/20 text-sky-100"
                        }`}
                      >
                        {v.badge}
                      </span>
                    </div>
                  </div>

                  {/* Sarlavha */}
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors mt-0.5 leading-snug">
                      {jadval?.sarlavha || v.nom}
                    </h4>
                    <div className="text-xs text-amber-300 font-semibold mt-1">
                      {v.qisqa}
                    </div>
                    <p className="text-xs text-sky-100/90 mt-2 leading-relaxed">
                      {jadval?.tavsif || v.tavsif}
                    </p>
                  </div>

                  {/* Imtihon jadvali oynasi */}
                  {v.bankTayyor && jadval?.rejim === "jadval" && boshMs && tugashMs && (
                    <div className="ms-karta-ichki p-3 rounded-2xl space-y-1.5 text-[11px] border border-amber-300/30">
                      <div className="flex items-center justify-between gap-2 text-sky-200">
                        <span>Boshlanish</span>
                        <strong className="text-white font-mono">{sanaVaqt(jadval.startsAt)}</strong>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-sky-200">
                        <span>Yopilish</span>
                        <strong className="text-white font-mono">{sanaVaqt(jadval.endsAt)}</strong>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-sky-400/20 text-amber-200">
                        <span>
                          <strong className="font-mono">{jadval.qatnashchilarSoni ?? 0}</strong> nafar
                        </span>
                        {joriyHolat === "kutilmoqda" && (
                          <span className="font-mono font-bold text-amber-300">
                            {muddatFormat(boshMs - hozirMs)} qoldi
                          </span>
                        )}
                        {joriyHolat === "ochiq" && (
                          <span className="font-mono font-bold text-emerald-300">
                            Ochiq · {muddatFormat(tugashMs - hozirMs)}
                          </span>
                        )}
                        {joriyHolat === "tekshirilmoqda" && (
                          <span className="font-semibold text-cyan-200">
                            Kalibrlanmoqda
                          </span>
                        )}
                        {joriyHolat === "elon_qilindi" && (
                          <span className="font-semibold text-emerald-300">
                            E&apos;lon qilindi
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ko'rsatkichlar: Savollar, Vaqt, Model */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-sky-400/20 text-center">
                    <div className="ms-karta-ichki p-2.5 rounded-xl">
                      <div className="text-[11px] text-sky-200/85">Savollar</div>
                      <div className="text-sm font-bold text-white font-mono mt-0.5">
                        {v.bankTayyor || joriyHolat === "ochiq" ? `${v.savollarSoni} ta` : "—"}
                      </div>
                    </div>
                    <div className="ms-karta-ichki p-2.5 rounded-xl">
                      <div className="text-[11px] text-sky-200/85">Vaqt</div>
                      <div className="text-sm font-bold text-white font-mono mt-0.5">
                        {v.vaqtMin} daq
                      </div>
                    </div>
                    <div className="ms-karta-ichki p-2.5 rounded-xl">
                      <div className="text-[11px] text-sky-200/85">Baholash</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-300 font-mono mt-0.5 truncate">
                        Rasch + Oddiy
                      </div>
                    </div>
                  </div>

                  {/* Savollar tuzilmasi */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-sans text-sky-100">
                    <span className="px-2.5 py-0.5 rounded bg-[#0e2261]/90 border border-sky-400/30">
                      Yopiq: {v.tuzilma.yopiq}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-[#0e2261]/90 border border-sky-400/30">
                      Moslashtirish: {v.tuzilma.moslashtirish}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-200 border border-amber-300/45">
                      Ochiq: {v.tuzilma.ochiq}
                    </span>
                  </div>
                </div>

                {/* Harakat tugmasi */}
                <div className="mt-6 pt-4 border-t border-sky-400/20 flex items-center gap-3">
                  {superadminRejimi && v.bankTayyor ? (
                    <Link
                      href={`/milliy-sertifikat/${v.slug}`}
                      className="ms-tugma-oltin flex-1 py-3 px-4 text-xs font-bold rounded-xl border border-amber-200/80 flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                    >
                      <Ikon nom="play" olcham={15} />
                      <span>Yechish</span>
                    </Link>
                  ) : kirganmi === false && v.bankTayyor ? (
                    <Link
                      href={`/login?callbackUrl=${encodeURIComponent(`/milliy-sertifikat/${v.slug}`)}`}
                      className="ms-tugma-oltin flex-1 py-3 px-4 text-xs font-bold rounded-xl border border-amber-200/80 flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                    >
                      <Ikon nom="odam" olcham={15} />
                      <span>Kirish</span>
                    </Link>
                  ) : ur?.topshirildi && ur?.natijaOchiq ? (
                    <Link
                      href={`/milliy-sertifikat/${v.slug}`}
                      className="ms-tugma-oltin flex-1 py-3 px-4 text-xs font-bold rounded-xl border border-amber-200/80 flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                    >
                      <Ikon nom="sertifikat" olcham={15} />
                      <span>Natija</span>
                    </Link>
                  ) : ur?.topshirildi && !ur?.natijaOchiq ? (
                    <Link
                      href={`/milliy-sertifikat/${v.slug}`}
                      className="flex-1 py-3 px-4 text-xs font-bold rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-300/50 text-sky-100 flex items-center justify-center gap-2 transition"
                    >
                      <Ikon nom="soat" olcham={15} />
                      <span>Kutilmoqda</span>
                    </Link>
                  ) : joriyHolat === "ochiq" ? (
                    <Link
                      href={`/milliy-sertifikat/${v.slug}`}
                      className="ms-tugma-oltin flex-1 py-3 px-4 text-xs font-bold rounded-xl border border-amber-200/80 flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                    >
                      <Ikon nom="play" olcham={15} />
                      <span>Boshlash</span>
                    </Link>
                  ) : joriyHolat === "kutilmoqda" ? (
                    <Link
                      href={`/milliy-sertifikat/${v.slug}`}
                      className="flex-1 py-3 px-4 text-xs font-bold rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-300/45 text-amber-200 flex items-center justify-center gap-2 transition"
                    >
                      <Ikon nom="soat" olcham={15} />
                      <span>{boshMs ? muddatFormat(boshMs - hozirMs) : "Tez kunda"}</span>
                    </Link>
                  ) : joriyHolat === "tekshirilmoqda" ? (
                    <Link
                      href={`/milliy-sertifikat/${v.slug}`}
                      className="flex-1 py-3 px-4 text-xs font-bold rounded-xl bg-[#0e2261]/90 hover:bg-[#163188] border border-cyan-300/45 text-cyan-200 flex items-center justify-center gap-2 transition"
                    >
                      <Ikon nom="kuzatuv" olcham={15} />
                      <span>Kalibrlanmoqda</span>
                    </Link>
                  ) : joriyHolat === "elon_qilindi" ? (
                    <Link
                      href={`/milliy-sertifikat/${v.slug}`}
                      className="flex-1 py-3 px-4 text-xs font-bold rounded-xl bg-[#0d1f59]/85 hover:bg-[#163188] border border-sky-400/40 text-sky-100 text-center transition"
                    >
                      Natijalar
                    </Link>
                  ) : v.bankTayyor ? (
                    <span className="flex-1 py-3 px-4 text-xs font-bold rounded-xl bg-[#0d1f59]/80 border border-sky-400/30 text-sky-200 text-center">
                      Tez kunda
                    </span>
                  ) : (
                    <span className="flex-1 py-3 px-4 text-xs font-bold rounded-xl bg-[#0d1f59]/80 border border-sky-400/30 text-sky-200 text-center">
                      Tayyorlanmoqda
                    </span>
                  )}
                </div>
              </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ─── 5. RASCH ILMIY BAHOLASH MODELI ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 w-full relative z-10">
        <div className="ms-karta-oltin px-5 py-4 rounded-2xl md:backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-white font-semibold">
            <Ikon nom="kuzatuv" olcham={17} className="text-amber-300 shrink-0" />
            <span>Rasch IRT modeli — savol qiyinligiga ko&apos;ra baholash</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-sky-100">
            <span className="ms-karta-ichki px-3 py-1.5 rounded-xl">
              P = 1 / (1 + e<sup>-(θ - b)</sup>)
            </span>
            <span className="ms-karta-ichki px-3 py-1.5 rounded-xl text-cyan-200">
              Wright Map · MNSQ
            </span>
          </div>
        </div>
      </section>

      {/* ─── 6. SERTIFIKAT DARAJALARI ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-5 w-full relative z-10 space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Sertifikat darajalari
          </h3>
          <p className="text-xs text-sky-100/85">
            Tayyorgarlik sinovi — davlat sertifikati bermaydi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {SERTIFIKAT_DARAJALARI.map((d) => (
            <div
              key={d.daraja}
              className={`p-4 sm:p-5 rounded-2xl border md:backdrop-blur-sm space-y-2.5 transition-[transform,border-color] md:hover:-translate-y-0.5 ${d.chegaraRang}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-mono tracking-tight">
                  {d.daraja}
                </span>
                <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#091642]/70 border border-white/25 text-white">
                  {d.shkala}
                </span>
              </div>
              <p className="text-xs text-white/95 leading-relaxed pt-1 border-t border-white/15">
                {d.imtiyoz}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. FOOTER ─── */}
      <footer className="border-t border-sky-400/25 bg-[#08133e]/95 py-6 relative z-10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-200/90">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-slate-950 shadow-sm shadow-amber-400/40">
              <Ikon nom="atom" olcham={13} qalin={2} />
            </span>
            <span className="font-bold text-white">JDA KIMYO</span>
            <span>— Milliy Sertifikat</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-amber-300 transition">
              Bosh sahifa
            </Link>
            <Link href="/maktabkimyo" className="hover:text-amber-300 transition">
              Maktab kimyosi
            </Link>
            <Link href="/oliykimyo" className="hover:text-amber-300 transition">
              Oliy kimyo
            </Link>
            <Link href="/testlar" className="hover:text-amber-300 transition">
              Testlar
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
