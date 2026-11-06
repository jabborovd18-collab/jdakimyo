"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { mavzuHavolasi, sinfHavolasi } from "@/lib/fanlar"
import Ikon from "@/components/Ikon"
import TasdiqBelgisi from "@/components/TasdiqBelgisi"
import Mavzu1_1 from "@/components/maktab/Mavzu1_1"
import Mavzu1_2 from "@/components/maktab/Mavzu1_2"
import Mavzu1_3 from "@/components/maktab/Mavzu1_3"
import Mavzu1_4 from "@/components/maktab/Mavzu1_4"
import Mavzu1_5 from "@/components/maktab/Mavzu1_5"
import Mavzu2_1 from "@/components/maktab/Mavzu2_1"
import Mavzu2_2 from "@/components/maktab/Mavzu2_2"
import Mavzu3_1 from "@/components/maktab/Mavzu3_1"
import Mavzu3_2 from "@/components/maktab/Mavzu3_2"
import Mavzu3_3 from "@/components/maktab/Mavzu3_3"
import Mavzu3_4 from "@/components/maktab/Mavzu3_4"
import Mavzu3_5 from "@/components/maktab/Mavzu3_5"
import Mavzu3_6 from "@/components/maktab/Mavzu3_6"
import Mavzu3_7 from "@/components/maktab/Mavzu3_7"
import Mavzu4_1 from "@/components/maktab/Mavzu4_1"
import Mavzu4_2 from "@/components/maktab/Mavzu4_2"
import Mavzu4_3 from "@/components/maktab/Mavzu4_3"
import Mavzu5_1 from "@/components/maktab/Mavzu5_1"
import Mavzu5_2 from "@/components/maktab/Mavzu5_2"
import Mavzu5_3 from "@/components/maktab/Mavzu5_3"
import Mavzu5_4 from "@/components/maktab/Mavzu5_4"
import Mavzu5_5 from "@/components/maktab/Mavzu5_5"

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

export default function MavzuKorinish({
  sinf,
  mavzu,
}) {
  return (
    <main
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className="min-h-screen flex flex-col font-serif bg-gradient-to-b from-[#0b0d2d] via-[#081845] via-35% via-[#051135] to-[#020514] text-white relative overflow-x-hidden justify-between"
    >
      {/* ─── FON EFFEKTLARI (TO'Q MOVIY-SAFIR AMBIENT NURLAR) ─── */}
      <div className="absolute top-0 left-1/4 w-[42rem] h-[42rem] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-72 -left-20 w-[36rem] h-[36rem] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-10 w-[38rem] h-[38rem] bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-48 left-1/3 w-[40rem] h-[40rem] bg-blue-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─── 1. SARLAVHA (HEADER) ─── */}
      <header className="border-b border-blue-900/50 bg-[#070c29]/85 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={sinfHavolasi(sinf.sinf)}
              className="p-2.5 rounded-xl border border-blue-800/60 bg-[#0b1437]/70 hover:border-yellow-400/50 hover:bg-[#102054]/80 text-blue-200 hover:text-white transition shrink-0"
              title="Mavzular ro'yxatiga qaytish"
            >
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xs sm:text-sm px-2.5 py-1 rounded-lg border border-yellow-500/40 bg-yellow-500/15 text-yellow-300 font-bold shrink-0">
                {mavzu.raqam}
              </span>
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-white truncate">
                {mavzu.nom}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={sinfHavolasi(sinf.sinf)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-blue-800/60 bg-[#09153a]/60 hover:border-yellow-400/50 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition hidden sm:inline-flex items-center gap-1.5"
            >
              <Ikon nom="kitob" olcham={14} />
              <span>Mavzular</span>
            </Link>
            <Link
              href="/"
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold transition shadow-md shadow-yellow-500/20"
            >
              Bosh sahifa
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 2. ASOSIY MAVZU KONTENTI ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1 w-full relative z-10">

        {/* ─── 1.1-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "1-1" || mavzu.raqam === "1.1") && (
          <section className="w-full">
            <Mavzu1_1 />
          </section>
        )}

        {/* ─── 1.2-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "1-2" || mavzu.raqam === "1.2") && (
          <section className="w-full">
            <Mavzu1_2 />
          </section>
        )}

        {/* ─── 1.3-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "1-3" || mavzu.raqam === "1.3") && (
          <section className="w-full">
            <Mavzu1_3 />
          </section>
        )}

        {/* ─── 1.4-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "1-4" || mavzu.raqam === "1.4") && (
          <section className="w-full">
            <Mavzu1_4 />
          </section>
        )}

        {/* ─── 1.5-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "1-5" || mavzu.raqam === "1.5") && (
          <section className="w-full">
            <Mavzu1_5 />
          </section>
        )}

        {/* ─── 2.1-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "2-1" || mavzu.raqam === "2.1") && (
          <section className="w-full">
            <Mavzu2_1 />
          </section>
        )}

        {/* ─── 2.2-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "2-2" || mavzu.raqam === "2.2") && (
          <section className="w-full">
            <Mavzu2_2 />
          </section>
        )}

        {/* ─── 3.1-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "3-1" || mavzu.raqam === "3.1") && (
          <section className="w-full">
            <Mavzu3_1 />
          </section>
        )}

        {/* ─── 3.2-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "3-2" || mavzu.raqam === "3.2") && (
          <section className="w-full">
            <Mavzu3_2 />
          </section>
        )}

        {/* ─── 3.3-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "3-3" || mavzu.raqam === "3.3") && (
          <section className="w-full">
            <Mavzu3_3 />
          </section>
        )}

        {/* ─── 3.4-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "3-4" || mavzu.raqam === "3.4") && (
          <section className="w-full">
            <Mavzu3_4 />
          </section>
        )}

        {/* ─── 3.5-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "3-5" || mavzu.raqam === "3.5") && (
          <section className="w-full">
            <Mavzu3_5 />
          </section>
        )}

        {/* ─── 3.6-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "3-6" || mavzu.raqam === "3.6") && (
          <section className="w-full">
            <Mavzu3_6 />
          </section>
        )}

        {/* ─── 3.7-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "3-7" || mavzu.raqam === "3.7") && (
          <section className="w-full">
            <Mavzu3_7 />
          </section>
        )}

        {/* ─── 4.1-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "4-1" || mavzu.raqam === "4.1") && (
          <section className="w-full">
            <Mavzu4_1 />
          </section>
        )}

        {/* ─── 4.2-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "4-2" || mavzu.raqam === "4.2") && (
          <section className="w-full">
            <Mavzu4_2 />
          </section>
        )}

        {/* ─── 4.3-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "4-3" || mavzu.raqam === "4.3") && (
          <section className="w-full">
            <Mavzu4_3 />
          </section>
        )}

        {/* ─── 5.1-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "5-1" || mavzu.raqam === "5.1") && (
          <section className="w-full">
            <Mavzu5_1 />
          </section>
        )}

        {/* ─── 5.2-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "5-2" || mavzu.raqam === "5.2") && (
          <section className="w-full">
            <Mavzu5_2 />
          </section>
        )}

        {/* ─── 5.3-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "5-3" || mavzu.raqam === "5.3") && (
          <section className="w-full">
            <Mavzu5_3 />
          </section>
        )}

        {/* ─── 5.4-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "5-4" || mavzu.raqam === "5.4") && (
          <section className="w-full">
            <Mavzu5_4 />
          </section>
        )}

        {/* ─── 5.5-MAVZU UCHUN SMART DOSKA INTERAKTIV TA'LIM MODULI ─── */}
        {(mavzu.slug === "5-5" || mavzu.raqam === "5.5") && (
          <section className="w-full">
            <Mavzu5_5 />
          </section>
        )}

        {/* ─── 6-7 BOBLAR UCHUN TAYYORLANAYOTGAN MODUL XABARI ─── */}
        {![
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
          "4-1",
          "4-2",
          "4-3",
          "5-1",
          "5-2",
          "5-3",
          "5-4",
          "5-5",
        ].includes(mavzu.slug) && (
          <section className="p-8 rounded-3xl border border-amber-500/40 bg-[#091234]/80 text-center space-y-3 shadow-2xl">
            <h3 className="text-xl font-bold text-white">
              {mavzu.raqam}. {mavzu.nom}
            </h3>
            <p className="text-sm text-blue-200/80">
              Ushbu mavzu tayyorlanmoqda.
            </p>
          </section>
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