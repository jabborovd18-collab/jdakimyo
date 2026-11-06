"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { YETTI_SINF_BOBLAR, mavzuHavolasi } from "@/lib/fanlar"
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

const INTERAKTIV_TAYYOR_SLUGLAR = new Set([
  "1-1",
  "1-2",
  "1-3",
  "1-4",
  "1-5",
  "2-1",
  "2-2",
  "3-1",
  "3-2",
  "3-3",
  "3-4",
  "3-5",
  "3-6",
  "3-7",
])

export default function SinfKorinish({ sinf }) {
  const ochiqmi = sinf.sinf === 7
  const [rejim, setRejim] = useState("uzun") // "uzun" yoki "qisqa"
  const [tanlanganBob, setTanlanganBob] = useState("barchasi")
  const [qidiruv, setQidiruv] = useState("")

  // 7-sinf uchun rasmiy darslik mundarijasi (boblar va mavzular)
  const boblar = sinf.boblar || YETTI_SINF_BOBLAR

  const filtrlanganBoblar = boblar
    .filter((b) => tanlanganBob === "barchasi" || b.bob === tanlanganBob)
    .map((b) => {
      const soz = qidiruv.trim().toLowerCase()
      if (!soz) return b
      return {
        ...b,
        mavzular: b.mavzular.filter(
          (m) =>
            m.raqam.toLowerCase().includes(soz) ||
            m.nom.toLowerCase().includes(soz) ||
            String(m.sahifa).includes(soz)
        ),
      }
    })
    .filter((b) => b.mavzular.length > 0)

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
              href="/maktabkimyo"
              className="p-2.5 rounded-xl border border-blue-800/60 bg-[#0b1437]/70 hover:border-yellow-400/50 hover:bg-[#102054]/80 text-blue-200 hover:text-white transition"
              title="Maktab kimyosiga qaytish"
            >
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                  {sinf.nom}
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded-lg border border-blue-800/60 bg-[#091538]/70 text-blue-200">
                  {sinf.belgi}
                </span>
                {ochiqmi ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 text-[11px] font-bold text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    OCHIQ
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/15 text-[11px] font-bold text-amber-300">
                    <Ikon nom="qulf" olcham={10} />
                    Yaqinda ochiladi
                  </span>
                )}
              </div>
              <div className="text-xs text-blue-300/80">{sinf.qisqa}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/maktabkimyo"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-blue-800/60 bg-[#09153a]/60 hover:border-yellow-400/50 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition hidden sm:inline-flex items-center gap-1.5"
            >
              <Ikon nom="kitob" olcham={14} />
              <span>Barcha sinflar</span>
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

      {/* ─── 2. ASOSIY KONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6 relative z-10">
        {/* AGAR SINF QULFDA BO'LSA (8, 9, 10, 11) */}
        {!ochiqmi ? (
          <div className="p-8 sm:p-12 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-[#12163b]/70 via-[#0a1433]/70 to-[#070d25]/80 backdrop-blur-md shadow-2xl text-center max-w-2xl mx-auto my-8">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20">
              <Ikon nom="qulf" olcham={38} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-amber-500/40 bg-amber-500/15 text-xs font-bold text-amber-300 mb-3">
              <Ikon nom="qulf" olcham={13} />
              Yaqinda ochiladi
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {sinf.nom} darsliklari tayyorlanmoqda
            </h2>

            <p className="text-sm sm:text-base text-blue-200/80 mt-3 leading-relaxed max-w-lg mx-auto">
              Ushbu sinf uchun davlat ta&apos;lim standarti bo&apos;yicha yangi multimedia darslari, animatsiyalar va o&apos;quv materiallari ishlab chiqilmoqda. Yaqin kunlarda to&apos;liq taqdim etiladi.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/maktabkimyo/7sinf"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                <span>7-sinf darslariga o&apos;tish (Ochiq)</span>
                <Ikon nom="ong" olcham={15} />
              </Link>
              <Link
                href="/maktabkimyo"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-blue-800/60 bg-[#091538]/70 hover:border-yellow-400/50 hover:bg-[#0c1f54]/80 text-blue-200 hover:text-white text-sm font-semibold transition"
              >
                Sinflar ro&apos;yxatiga qaytish
              </Link>
            </div>
          </div>
        ) : (
          /* AGAR 7-SINF (OCHIQ) BO'LSA */
          <div className="space-y-6">
            {/* Sinf sarlavhasi va rejim tanlagich */}
            <div className="p-4 sm:p-5 rounded-3xl border border-blue-800/50 bg-gradient-to-br from-[#121644]/70 via-[#0a1738]/70 to-[#070e28]/70 backdrop-blur-md shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                7-sinf mavzulari
              </h2>

              {/* REJIM TANLAGICH: Qisqa / Uzun */}
              <div className="flex items-center gap-1.5 bg-[#070d24]/90 p-1.5 rounded-2xl border border-blue-800/60 shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setRejim("qisqa")}
                  className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                    rejim === "qisqa"
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow-md"
                      : "text-blue-200 hover:text-white"
                  }`}
                >
                  <Ikon nom="kristall" olcham={15} />
                  <span>Qisqa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRejim("uzun")}
                  className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                    rejim === "uzun"
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow-md"
                      : "text-blue-200 hover:text-white"
                  }`}
                >
                  <Ikon nom="fayl" olcham={15} />
                  <span>To&apos;liq</span>
                </button>
              </div>
            </div>

            {/* BOBLAR VA MAVZULAR RO'YXATI */}
            <div className="space-y-5">
              {boblar.map((bob) => (
                <section
                  key={bob.bob}
                  className="p-5 rounded-3xl border border-blue-900/60 bg-gradient-to-br from-[#0c173c]/60 via-[#091333]/60 to-[#060e25]/60 backdrop-blur-md shadow-lg"
                >
                  {/* Bob sarlavhasi */}
                  <div className="flex items-center gap-3 pb-3 mb-4 border-b border-blue-900/50">
                    <span className="w-9 h-9 rounded-xl bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 font-bold text-sm flex items-center justify-center shrink-0">
                      {bob.bob}
                    </span>
                    <h3 className="text-base sm:text-xl font-bold text-white">
                      {bob.bob}-bob. {bob.nom}
                    </h3>
                  </div>

                  {/* 1) QISQA REJIM */}
                  {rejim === "qisqa" ? (
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3">
                      {bob.mavzular.map((m) => (
                        <Link
                          key={m.slug}
                          href={mavzuHavolasi(sinf.sinf, m)}
                          title={`${m.raqam}. ${m.nom}`}
                          className="group p-4 rounded-2xl border border-blue-800/60 bg-[#09153a]/60 hover:border-yellow-400 hover:bg-[#0f245e]/80 transition-all flex items-center justify-center text-center shadow-sm"
                        >
                          <span className="w-12 h-12 rounded-xl bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 font-bold text-base sm:text-lg flex items-center justify-center group-hover:scale-105 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                            {m.raqam}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    /* 2) TO'LIQ REJIM */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {bob.mavzular.map((m) => (
                        <Link
                          key={m.slug}
                          href={mavzuHavolasi(sinf.sinf, m)}
                          className="p-3.5 sm:p-4 rounded-2xl border border-blue-800/60 bg-[#09153a]/60 hover:border-yellow-400/80 hover:bg-[#0d225c]/80 transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <span className="w-11 h-11 rounded-xl bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 font-bold text-base flex items-center justify-center shrink-0 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                              {m.raqam}
                            </span>
                            <h4 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-yellow-300 transition-colors truncate">
                              {m.nom}
                            </h4>
                          </div>

                          <span className="p-2 rounded-xl text-blue-300 group-hover:text-yellow-300 shrink-0">
                            <Ikon nom="ong" olcham={16} />
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        )}
      </div>

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
