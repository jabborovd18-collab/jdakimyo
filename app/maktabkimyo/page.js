"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { MAKTAB_SINFLARI, sinfHavolasi } from "@/lib/fanlar"
import Ikon from "@/components/Ikon"
import TasdiqBelgisi from "@/components/TasdiqBelgisi"

function YaratuvchiRasmi() {
  const [xato, setXato] = useState(false)
  const rasmRef = useRef(null)

  useEffect(() => {
    const el = rasmRef.current
    if (el && el.complete && el.naturalWidth === 0) setXato(true)
  }, [])

  return (
    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500/60 shadow-xl shadow-yellow-500/20 shrink-0">
      {xato ? (
        <span className="w-full h-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
          <Ikon nom="odam" olcham={32} qalin={1.5} />
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={rasmRef}
          src="/yaratuvchi.jpg"
          alt="Diyorbek Jabborov"
          className="w-full h-full object-cover rounded-full"
          onError={() => setXato(true)}
        />
      )}
    </div>
  )
}

export default function MaktabKimyosiBoshSahifa() {
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

      {/* ─── 1. SARLAVHA (HEADER) ─── */}
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
                  Maktab kimyosi
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-blue-700/50 bg-blue-900/40 text-blue-200 font-sans">
                  7–11 sinf
                </span>
              </div>
              <div className="text-xs text-blue-300/80">Davlat standarti darsliklari va multimedia ta&apos;limi</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dolzarb"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-blue-800/60 bg-[#09153a]/60 hover:border-yellow-400/50 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition hidden sm:flex items-center gap-1.5"
            >
              <Ikon nom="muhokama" olcham={14} />
              <span>Dolzarb mavzular</span>
            </Link>
            <Link
              href="/"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold transition shadow-md shadow-yellow-500/20"
            >
              Bosh sahifa
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 2. SINF TANLASH BO'LIMI ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 flex-1 w-full relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-xs font-semibold text-yellow-300 mb-3 shadow-sm">
            <Ikon nom="kitob" olcham={14} />
            <span>Umumta&apos;lim maktab kimyosi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Sinfni tanlang
          </h2>
          <p className="text-sm sm:text-base text-blue-200/80 mt-2.5 leading-relaxed">
            Davlat ta&apos;lim standarti asosida tayyorlangan kimyo darsliklari, interaktiv namoyishlar va metodik qo&apos;llanmalar.
          </p>
        </div>

        {/* 5 ta sinf kartalari: 7-sinf OCHIQ, 8–11 QULFDA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {MAKTAB_SINFLARI.map((s) => {
            const ochiqmi = s.sinf === 7

            if (ochiqmi) {
              return (
                <Link
                  key={s.sinf}
                  href={sinfHavolasi(s.sinf)}
                  className="group relative p-6 sm:p-7 rounded-3xl border-2 border-emerald-500/60 bg-gradient-to-br from-[#0c2444]/80 via-[#0a1a3d]/80 to-[#07132e]/90 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all flex flex-col justify-between overflow-hidden backdrop-blur-md"
                >
                  {/* Yashil ambient burchak nuri */}
                  <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/25 transition-all" />

                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="w-14 h-14 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                        <Ikon nom="kolba" olcham={28} />
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/20 text-xs font-bold text-emerald-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          OCHIQ
                        </span>
                        <span className="text-xs font-mono px-2.5 py-1 rounded-xl border border-blue-800/60 bg-[#091538]/70 text-blue-200">
                          {s.belgi}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                      {s.qisqa}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-emerald-300 transition-colors mt-1">
                      {s.sinf}-sinf
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-200/85 mt-2.5 leading-relaxed">
                      {s.tavsif}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-blue-900/50 flex items-center justify-between text-xs font-semibold">
                    <span className="text-blue-300 flex items-center gap-1.5">
                      <Ikon nom="kitob" olcham={14} />
                      {s.darslarSoni} ta dars
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold group-hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20">
                      <span>Darslarni ochish</span>
                      <Ikon nom="ong" olcham={14} />
                    </div>
                  </div>
                </Link>
              )
            }

            return (
              <div
                key={s.sinf}
                className="relative p-6 sm:p-7 rounded-3xl border border-blue-900/40 bg-gradient-to-br from-[#09112a]/60 via-[#070e24]/60 to-[#050a1b]/60 backdrop-blur-md flex flex-col justify-between overflow-hidden opacity-85 select-none"
              >
                {/* Fon qulf suv belgisi */}
                <div className="absolute -bottom-6 -right-6 text-white/[0.03] pointer-events-none">
                  <Ikon nom="qulf" olcham={130} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-14 h-14 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                      <Ikon nom="qulf" olcham={24} />
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/15 text-xs font-bold text-amber-300">
                        <Ikon nom="qulf" olcham={12} />
                        Yaqinda ochiladi
                      </span>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-xl border border-blue-900/60 bg-[#091538]/50 text-blue-300/80">
                        {s.belgi}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-amber-300/90 font-semibold uppercase tracking-wider">
                    {s.qisqa}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-200 mt-1">
                    {s.sinf}-sinf
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-300/70 mt-2.5 leading-relaxed">
                    {s.tavsif}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-blue-900/40 flex items-center justify-between text-xs">
                  <span className="text-blue-300/60 flex items-center gap-1.5">
                    <Ikon nom="kitob" olcham={14} />
                    {s.darslarSoni} ta dars
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 font-semibold">
                    <Ikon nom="qulf" olcham={13} />
                    Tayyorlanmoqda
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ─── MA'LUMOT BANNERI ─── */}
        <div className="mt-12 p-5 sm:p-6 rounded-3xl border border-blue-800/40 bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-blue-950/40 backdrop-blur-md max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left shadow-xl">
          <div className="flex items-center gap-4">
            <span className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
              <Ikon nom="qulf" olcham={22} />
            </span>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                8–11 sinf darsliklari ustida ish olib borilmoqda
              </h4>
              <p className="text-xs sm:text-sm text-blue-200/70 mt-1">
                Davlat ta&apos;lim standarti bo&apos;yicha yangi multimedia darslari, reaksiyalar va metodik qo&apos;llanmalar bosqichma-bosqich platformaga joylanadi.
              </p>
            </div>
          </div>
          <Link
            href="/maktabkimyo/7sinf"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shrink-0 transition shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
          >
            <span>7-sinf darslari</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </section>

      {/* ─── 3. YARATUVCHI FOOTER (ASL ESKI USLUBDAGI YARATUVCHI KARTASI) ─── */}
      <footer className="mt-auto border-t border-blue-900/50 bg-[#050920]/90 backdrop-blur-xl py-12 text-xs text-blue-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-6 md:p-8 rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/40 via-[#0a1738]/50 to-[#070e28]/40 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
              {/* Yaratuvchi ma'lumotlari */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <YaratuvchiRasmi />
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-xs font-semibold text-yellow-300 mb-2">
                    Sayt yaratuvchisi
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h4 className="font-bold text-lg text-white">Diyorbek Jabborov</h4>
                    <TasdiqBelgisi tasdiqlangan olcham="katta" jonli />
                  </div>
                  <p className="text-blue-200/80 text-sm mt-0.5">
                    Kimyo o&apos;qituvchisi · platforma asoschisi
                  </p>

                  <div className="flex flex-wrap gap-2.5 mt-4 justify-center sm:justify-start">
                    <Link
                      href="/profil/343229943"
                      className="px-3.5 py-1.5 rounded-xl border border-blue-800/50 bg-[#09153a]/60 hover:border-yellow-400/50 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Ikon nom="odam" olcham={15} />
                      <span>Profil</span>
                    </Link>
                    <a
                      href="https://t.me/diyorbek_jabborov"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl border border-blue-800/50 bg-[#09153a]/60 hover:border-yellow-400/50 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Ikon nom="telegram" olcham={15} />
                      <span>Telegram</span>
                    </a>
                    <a
                      href="mailto:jabborovd18@gmail.com"
                      className="px-3.5 py-1.5 rounded-xl border border-blue-800/50 bg-[#09153a]/60 hover:border-yellow-400/50 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Ikon nom="pochta" olcham={15} />
                      <span>Email</span>
                    </a>
                    <a
                      href="https://t.me/jdakimyouzbot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl border border-blue-800/50 bg-[#09153a]/60 hover:border-yellow-400/50 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition flex items-center gap-1.5"
                    >
                      <Ikon nom="bot" olcham={15} />
                      <span>Bot</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* O'ng tomon: Versiya, JDA KIMYO nima, copyright */}
              <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-800/50 bg-[#09153a]/60 text-xs font-semibold text-blue-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  v3.0.0
                </span>
                <Link
                  href="/jda-kimyo"
                  className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold flex items-center gap-1 mt-1 transition"
                >
                  <Ikon nom="atom" olcham={15} />
                  <span>JDA KIMYO nima?</span>
                </Link>
                <p className="text-blue-300/70 text-xs mt-1">© 2026 JDA KIMYO</p>
                <p className="text-blue-300/50 text-[11px]">Kimyo ta&apos;lim platformasi</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
