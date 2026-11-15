"use client"

import Link from "next/link"
import { useState, useEffect, useMemo, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import { ustozPaneliOchiqmi, isAdminRole } from "@/lib/roles"
import { NOM, TARIF, YARATUVCHI } from "@/lib/sayt-malumot"
import Ikon from "@/components/Ikon"
import TasdiqBelgisi from "@/components/TasdiqBelgisi"
import { useFon } from "@/components/FonTanlagich"
import { useBildirishnomaSanoq } from "@/lib/use-bildirishnoma"
import { darajaHolati } from "@/lib/daraja"
import { keshdanProfilniOl, profilniYuklabOl } from "@/lib/profil-kesh"

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

export default function BoshSahifa() {
  const { data: session, status } = useSession()
  const [fon] = useFon()
  const [menyu, setMenyu] = useState(false)
  const [profilData, setProfilData] = useState(null)
  const [qidiruv, setQidiruv] = useState("")

  const bildirishnoma = useBildirishnomaSanoq(Boolean(session))
  const oqilmaganChat = bildirishnoma?.sanoq?.chat ?? bildirishnoma?.chat ?? 0

  useEffect(() => {
    if (!session?.user) return
    let bekor = false

    const kesh = keshdanProfilniOl(session.user)
    if (kesh?.user) {
      setProfilData(kesh.user)
    }

    async function yuklaProfil() {
      try {
        const data = await profilniYuklabOl({ sessionUser: session.user })
        if (!bekor && data?.user) {
          setProfilData(data.user)
        }
      } catch {
        // Tarmoq xatosi bo'lsa kesh va session ma'lumotlariga suyaniladi
      }
    }

    yuklaProfil()
    return () => {
      bekor = true
    }
  }, [session])

  const bosHarf = () => {
    const ism = session?.user?.fullName || session?.user?.username || "U"
    return ism.charAt(0).toUpperCase()
  }

  const rolPanellari = useMemo(() => {
    if (!session?.user) return []
    const panellar = []
    if (isAdminRole(session.user.role) && !session.user.doskaTugaydi) {
      panellar.push({ href: "/admin", ikon: "qalqon", label: "Boshqaruv" })
    }
    if (ustozPaneliOchiqmi(session.user)) {
      panellar.push({ href: "/ustoz", ikon: "ustoz", label: "Ustoz paneli" })
    }
    return panellar
  }, [session])

  const qidiruvBajar = (e) => {
    e.preventDefault()
    if (!qidiruv.trim()) return
    window.location.href = `/qidiruv?q=${encodeURIComponent(qidiruv.trim())}`
  }

  const userStars = profilData?.stars ?? 0
  const userStreak = profilData?.streak ?? 0
  const userDaraja = darajaHolati(userStars)

  return (
    <main
      data-fon={fon}
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className="v3 min-h-screen flex flex-col font-serif bg-gradient-to-b from-[#0b0d2d] via-[#081845] via-35% via-[#051135] to-[#020514] text-white relative overflow-x-hidden"
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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
              <Ikon nom="atom" olcham={18} qalin={2} />
            </span>
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
              {NOM}
            </span>
          </Link>

          {/* Qidiruv satri */}
          <form
            onSubmit={qidiruvBajar}
            className="hidden md:flex items-center flex-1 max-w-md mx-6"
          >
            <div className="relative w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400">
                <Ikon nom="qidiruv" olcham={16} />
              </span>
              <input
                type="text"
                value={qidiruv}
                onChange={(e) => setQidiruv(e.target.value)}
                placeholder="Mavzular, sinflar, formulalar qidirish..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-purple-700/50 bg-purple-900/30 text-white placeholder-purple-300/50 text-sm focus:border-yellow-400 focus:outline-none transition-colors backdrop-blur-sm"
              />
            </div>
          </form>

          {/* O'ng tomon navigatsiya va profil */}
          <div className="flex items-center gap-2">
            <Link
              href="/dolzarb"
              className="px-3.5 py-1.5 bg-[#0e163b]/60 hover:bg-[#142055]/80 border border-blue-800/50 rounded-xl text-xs font-semibold text-blue-200 hover:text-white transition-all hidden sm:inline-flex items-center gap-1.5 backdrop-blur-sm"
              title="Dolzarb mavzular"
            >
              <Ikon nom="muhokama" olcham={15} />
              <span>Dolzarb</span>
            </Link>

            {rolPanellari.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="px-3 py-1.5 bg-[#0e163b]/60 hover:bg-[#142055]/80 border border-blue-800/50 rounded-xl text-xs font-semibold text-blue-200 hover:text-white transition-all hidden sm:inline-flex items-center gap-1.5 backdrop-blur-sm"
                title={p.label}
              >
                <Ikon nom={p.ikon} olcham={15} />
                <span className="hidden xl:inline">{p.label}</span>
              </Link>
            ))}

            {session && (
              <Link
                href="/chat"
                className="relative p-2 rounded-xl border border-purple-700/50 bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 hover:text-white transition"
                title="Xabarlar"
              >
                <Ikon nom="xabar" olcham={17} />
                {oqilmaganChat > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-rose-600 text-[10px] font-bold rounded-full text-white">
                    {oqilmaganChat > 99 ? "99+" : oqilmaganChat}
                  </span>
                )}
              </Link>
            )}

            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full border border-purple-700 animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setMenyu((v) => !v)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-purple-700/50 bg-purple-900/40 hover:bg-purple-800/60 transition"
                  aria-expanded={menyu}
                >
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 text-slate-950 font-bold flex items-center justify-center text-xs">
                    {bosHarf()}
                  </span>
                  <span className="hidden sm:inline max-w-[120px] truncate text-xs font-semibold text-purple-100">
                    {session.user?.fullName || session.user?.username}
                  </span>
                  <Ikon
                    nom="past"
                    olcham={13}
                    className={`transition-transform duration-200 text-purple-300 ${
                      menyu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {menyu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenyu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 z-50 rounded-2xl border border-purple-700/60 bg-gradient-to-br from-purple-950 to-slate-950 p-2 shadow-2xl backdrop-blur-xl">
                      <div className="flex items-center gap-3 p-2.5 border-b border-purple-800/50">
                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 text-slate-950 font-bold flex items-center justify-center text-base">
                          {bosHarf()}
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold truncate text-sm text-white">
                            {session.user?.fullName || session.user?.username}
                          </div>
                          <div className="text-purple-300 text-xs truncate">
                            @{session.user?.username}
                          </div>
                        </div>
                      </div>

                      <div className="p-1 space-y-1">
                        <Link
                          href="/profil"
                          onClick={() => setMenyu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-900/50 text-xs font-medium text-purple-100 hover:text-white transition"
                        >
                          <Ikon nom="odam" olcham={15} />
                          <span>Shaxsiy kabinet</span>
                        </Link>
                        {ustozPaneliOchiqmi(session.user) && !session.user?.doskaTugaydi && (
                          <Link
                            href="/doska/skaner"
                            onClick={() => setMenyu(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-900/50 text-xs font-medium text-amber-200 hover:text-white transition"
                          >
                            <Ikon nom="skaner" olcham={15} />
                            <span>Doska skaneri</span>
                          </Link>
                        )}
                        <Link
                          href="/chat"
                          onClick={() => setMenyu(false)}
                          className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl hover:bg-purple-900/50 text-xs font-medium text-purple-100 hover:text-white transition"
                        >
                          <span className="flex items-center gap-2">
                            <Ikon nom="xabar" olcham={15} />
                            <span>Xabarlar</span>
                          </span>
                          {oqilmaganChat > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-[10px] font-bold text-white leading-none">
                              {oqilmaganChat > 99 ? '99+' : oqilmaganChat}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/profil/quizlar"
                          onClick={() => setMenyu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-900/50 text-xs font-medium text-purple-100 hover:text-white transition"
                        >
                          <Ikon nom="quiz" olcham={15} />
                          <span>Test natijalarim</span>
                        </Link>
                        <Link
                          href="/profil/yutuqlar"
                          onClick={() => setMenyu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-900/50 text-xs font-medium text-purple-100 hover:text-white transition"
                        >
                          <Ikon nom="yulduz" olcham={15} />
                          <span>Yutuqlarim</span>
                        </Link>
                        <div className="my-1 border-t border-purple-800/50" />
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-950/40 text-xs font-medium text-rose-300 hover:text-rose-200 transition w-full text-left"
                        >
                          <Ikon nom="chiqish" olcham={15} />
                          <span>Chiqish</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-purple-700/60 bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 hover:text-white transition"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold transition shadow-md shadow-yellow-500/20"
                >
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── MOBIL QIDIRUV SATRI (FAQAT MOBILDA) ─── */}
      <div className="md:hidden max-w-7xl mx-auto px-3.5 pt-3 w-full relative z-10">
        <form onSubmit={qidiruvBajar} className="relative w-full">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400">
            <Ikon nom="qidiruv" olcham={15} />
          </span>
          <input
            type="text"
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            placeholder="Mavzular, sinflar, formulalar qidirish..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-blue-800/50 bg-[#0a1538]/80 text-white placeholder-blue-300/50 text-xs focus:border-yellow-400 focus:outline-none transition-colors backdrop-blur-sm"
          />
        </form>
      </div>

      {/* ─── 2. SHAXSIY KABINET VIDJETI (KO'RINARLI HERO BO'LIMI) ─── */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 pt-3 sm:pt-6 pb-1 sm:pb-2 w-full relative z-10">
        {session ? (
          <div className="p-3.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-blue-800/50 bg-gradient-to-br from-[#121646]/70 via-[#0a183d]/70 to-[#07112c]/70 backdrop-blur-md shadow-2xl shadow-blue-950/40 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center font-bold text-base sm:text-xl text-black shadow-lg shadow-yellow-500/30 shrink-0">
                {bosHarf()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-white truncate">
                    {session.user?.fullName || session.user?.username}
                  </h2>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 font-semibold">
                    {userDaraja.daraja}-daraja
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs text-blue-200/80 mt-0.5 truncate">
                  @{session.user?.username} · ID: {session.user?.userId}
                </div>
              </div>
            </div>

            {/* Hisob ko'rsatkichlari va kabinetga o'tish */}
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-wrap text-xs">
              <div className="flex items-center gap-1 bg-[#091333]/80 px-2.5 py-1.5 rounded-xl border border-blue-900/50">
                <span className="text-yellow-400">
                  <Ikon nom="yulduz" olcham={14} />
                </span>
                <span className="text-blue-100 text-[11px] sm:text-xs">
                  <strong className="font-bold text-white">{userStars}</strong> yulduz
                </span>
              </div>
              <div className="flex items-center gap-1 bg-[#091333]/80 px-2.5 py-1.5 rounded-xl border border-blue-900/50">
                <span className="text-orange-400">
                  <Ikon nom="olov" olcham={14} />
                </span>
                <span className="text-blue-100 text-[11px] sm:text-xs">
                  <strong className="font-bold text-white">{userStreak}</strong> kun
                </span>
              </div>

              <Link
                href="/profil"
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black transition shadow-lg shadow-yellow-500/20 ml-auto md:ml-2 flex items-center gap-1.5"
              >
                <Ikon nom="odam" olcham={14} />
                <span>Kabinet</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-blue-800/50 bg-gradient-to-br from-[#121646]/70 via-[#0a183d]/70 to-[#07112c]/70 backdrop-blur-md shadow-2xl shadow-blue-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-yellow-600/20 border border-yellow-600/30 rounded-full text-[10px] sm:text-xs font-semibold text-yellow-300 mb-2 sm:mb-3 backdrop-blur-sm">
                <Ikon nom="atom" olcham={13} />
                <span>ILMIY VA ZAMONAVIY TA&apos;LIM PLATFORMASI</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {NOM}
                </span>{" "}
                ta&apos;lim portali
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 sm:mt-2 max-w-2xl leading-relaxed">
                Maktab darsliklari, oliy kimyo video ma&apos;ruzalari va milliy sertifikat (Rasch IRT modeli) tayyorgarligi.
              </p>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <Link
                href="/login"
                className="flex-1 sm:flex-initial text-center px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-semibold rounded-xl border border-blue-700/60 bg-[#09153a]/60 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition backdrop-blur-sm"
              >
                Kirish
              </Link>
              <Link
                href="/register"
                className="flex-1 sm:flex-initial text-center px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black transition shadow-lg shadow-yellow-500/20"
              >
                Ro&apos;yxatdan o&apos;tish
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ─── 3. ASOSIY TA'LIM DARVOZALARI (9 TA ASOSIY BO'LIM — 3x3 SIMMETRIK TO'R) ─── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6 w-full relative z-10 space-y-3 sm:space-y-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-5">
          {/* 1. MAKTAB KIMYOSI */}
          <div className="p-2.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/55 via-[#0b1a3d]/65 to-[#070f2b]/55 hover:border-yellow-400/50 active:scale-[0.98] transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1">
            <Link href="/maktabkimyo" className="flex flex-col items-center text-center sm:items-stretch sm:text-left flex-1">
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:text-yellow-400 transition-colors shrink-0">
                  <Ikon nom="maktab" olcham={20} />
                </div>
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/35 rounded-full text-[9px] sm:text-xs font-semibold backdrop-blur-sm truncate max-w-full">
                  7–8 ochiq
                </span>
              </div>

              <h3 className="text-[12px] sm:text-xl md:text-2xl font-bold tracking-tight leading-tight sm:leading-snug text-white group-hover:text-yellow-400 transition-colors">
                Maktab kimyosi
              </h3>

              <p className="hidden sm:block text-xs text-blue-200/80 mt-2 leading-relaxed">
                7–8-sinf darsliklari ochiq, 9–11-sinflar tez kunda qo&apos;shiladi.
              </p>
            </Link>

            {/* Tezkor sinf tugmalari (planshet va kompyuterda karta ichida) */}
            <div className="hidden md:flex items-center gap-1.5 mt-3 flex-wrap">
              {[
                { s: "7", ochiq: true },
                { s: "8", ochiq: true },
                { s: "9", ochiq: false },
                { s: "10", ochiq: false },
                { s: "11", ochiq: false },
              ].map(({ s, ochiq }) =>
                ochiq ? (
                  <Link
                    key={s}
                    href={`/maktabkimyo/${s}sinf`}
                    className="px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-[11px] font-semibold text-emerald-200 transition"
                  >
                    {s}-sinf
                  </Link>
                ) : (
                  <Link
                    key={s}
                    href="/maktabkimyo"
                    className="px-2 py-1 rounded-lg border border-blue-800/50 bg-[#09153a]/50 text-[11px] text-blue-300/65 hover:text-amber-300 transition"
                    title="Tez kunda qo'shiladi"
                  >
                    {s}-sinf
                  </Link>
                )
              )}
            </div>

            <Link
              href="/maktabkimyo"
              className="hidden sm:flex mt-4 pt-3 border-t border-blue-900/40 items-center justify-between text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition"
            >
              <span className="truncate">Darsliklarni ochish</span>
              <Ikon nom="ong" olcham={13} className="shrink-0" />
            </Link>
          </div>

          {/* 2. OLIY KIMYO */}
          <Link
            href="/oliykimyo"
            className="p-2.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/55 via-[#0b1a3d]/65 to-[#070f2b]/55 hover:border-yellow-400/50 active:scale-[0.98] transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center sm:items-stretch sm:text-left">
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600/30 to-cyan-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 group-hover:text-yellow-400 transition-colors shrink-0">
                  <Ikon nom="oliy" olcham={20} />
                </div>
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-amber-600/20 text-amber-300 border border-amber-500/35 rounded-full text-[9px] sm:text-xs font-semibold backdrop-blur-sm truncate max-w-full">
                  Tez kunda
                </span>
              </div>

              <h3 className="text-[12px] sm:text-xl md:text-2xl font-bold tracking-tight leading-tight sm:leading-snug text-white group-hover:text-yellow-400 transition-colors">
                Oliy kimyo
              </h3>

              <p className="hidden sm:block text-xs text-blue-200/80 mt-2 leading-relaxed">
                Umumiy, anorganik, organik, analitik, fizikaviy, kolloid, biokimyo va kvant kimyosi (12 ta fan — tez kunda).
              </p>
            </div>

            <div className="hidden sm:flex mt-4 pt-3 border-t border-blue-900/40 items-center justify-between text-xs font-semibold text-amber-300 group-hover:text-yellow-300 transition">
              <span className="truncate">12 ta fan · Tez kunda qo&apos;shiladi</span>
              <Ikon nom="ong" olcham={13} className="shrink-0" />
            </div>
          </Link>

          {/* 3. MILLIY SERTIFIKAT SINOV TESTI */}
          <Link
            href="/milliy-sertifikat"
            className="p-2.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/55 via-[#0b1a3d]/65 to-[#070f2b]/55 hover:border-yellow-400/50 active:scale-[0.98] transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center sm:items-stretch sm:text-left">
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover:text-yellow-400 transition-colors shrink-0">
                  <Ikon nom="sertifikat" olcham={20} />
                </div>
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/35 rounded-full text-[9px] sm:text-xs font-semibold backdrop-blur-sm truncate max-w-full">
                  Rasch IRT
                </span>
              </div>

              <h3 className="text-[12px] sm:text-xl md:text-2xl font-bold tracking-tight leading-tight sm:leading-snug text-white group-hover:text-yellow-400 transition-colors">
                <span className="sm:hidden">Sertifikat</span>
                <span className="hidden sm:inline">Milliy sertifikat sinov testi</span>
              </h3>

              <p className="hidden sm:block text-xs text-blue-200/80 mt-2 leading-relaxed">
                Rasch modeli asosidagi tayyorgarlik sinovlari va taxminiy daraja tahlili.
              </p>
            </div>

            <div className="hidden sm:flex mt-4 pt-3 border-t border-blue-900/40 items-center justify-between text-xs font-semibold text-yellow-400 group-hover:text-yellow-300 transition">
              <span className="truncate">Sinov testiga o&apos;tish</span>
              <Ikon nom="ong" olcham={13} className="shrink-0" />
            </div>
          </Link>

          {/* 4. BOSHQA TESTLAR */}
          <Link
            href="/testlar"
            className="p-2.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/55 via-[#0b1a3d]/65 to-[#070f2b]/55 hover:border-yellow-400/50 active:scale-[0.98] transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center sm:items-stretch sm:text-left">
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-600/30 to-rose-600/30 border border-pink-500/40 flex items-center justify-center text-pink-300 group-hover:text-yellow-400 transition-colors shrink-0">
                  <Ikon nom="quiz" olcham={20} />
                </div>
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-pink-600/20 text-pink-300 border border-pink-500/35 rounded-full text-[9px] sm:text-xs font-semibold backdrop-blur-sm truncate max-w-full">
                  Mashqlar
                </span>
              </div>

              <h3 className="text-[12px] sm:text-xl md:text-2xl font-bold tracking-tight leading-tight sm:leading-snug text-white group-hover:text-yellow-400 transition-colors">
                Boshqa testlar
              </h3>

              <p className="hidden sm:block text-xs text-blue-200/80 mt-2 leading-relaxed">
                Ustoz tuzgan variantli testlar va yozma nazorat ishlari markazi.
              </p>
            </div>

            <div className="hidden sm:flex mt-4 pt-3 border-t border-blue-900/40 items-center justify-between text-xs font-semibold text-yellow-400 group-hover:text-yellow-300 transition">
              <span className="truncate">Testlar katalogi</span>
              <Ikon nom="ong" olcham={13} className="shrink-0" />
            </div>
          </Link>

          {/* 5. LABORATORIYA MASHG'ULOTLARI (TEZ KUNDA) */}
          <Link
            href="/laboratoriya"
            className="p-2.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/55 via-[#0b1a3d]/65 to-[#070f2b]/55 hover:border-yellow-400/50 active:scale-[0.98] transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center sm:items-stretch sm:text-left">
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-600/30 to-teal-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 group-hover:text-yellow-400 transition-colors shrink-0">
                  <Ikon nom="kolba" olcham={20} />
                </div>
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-amber-600/20 text-amber-300 border border-amber-500/35 rounded-full text-[9px] sm:text-xs font-semibold backdrop-blur-sm truncate max-w-full">
                  Tez kunda
                </span>
              </div>

              <h3 className="text-[12px] sm:text-xl md:text-2xl font-bold tracking-tight leading-tight sm:leading-snug text-white group-hover:text-yellow-400 transition-colors">
                <span className="sm:hidden">Laboratoriya</span>
                <span className="hidden sm:inline">Laboratoriya mashg&apos;ulotlari</span>
              </h3>

              <p className="hidden sm:block text-xs text-blue-200/80 mt-2 leading-relaxed">
                7–11-sinf amaliy tajribalari va video-eksperimentlar tez kunda qo&apos;shiladi.
              </p>
            </div>

            <div className="hidden sm:flex mt-4 pt-3 border-t border-blue-900/40 items-center justify-between text-xs font-semibold text-amber-300 group-hover:text-yellow-300 transition">
              <span className="truncate">Tez kunda qo&apos;shiladi</span>
              <Ikon nom="ong" olcham={13} className="shrink-0" />
            </div>
          </Link>

          {/* 6. KIMYO LABORATORIYA MAHSULOTLARINING SOTUVI (TEZ KUNDA) */}
          <Link
            href="/dokon"
            className="p-2.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/55 via-[#0b1a3d]/65 to-[#070f2b]/55 hover:border-yellow-400/50 active:scale-[0.98] transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center sm:items-stretch sm:text-left">
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-600/30 to-yellow-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300 group-hover:text-yellow-400 transition-colors shrink-0">
                  <Ikon nom="savat" olcham={20} />
                </div>
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-amber-600/20 text-amber-300 border border-amber-500/35 rounded-full text-[9px] sm:text-xs font-semibold backdrop-blur-sm truncate max-w-full">
                  Tez kunda
                </span>
              </div>

              <h3 className="text-[12px] sm:text-xl md:text-2xl font-bold tracking-tight leading-tight sm:leading-snug text-white group-hover:text-yellow-400 transition-colors">
                <span className="sm:hidden">Kimyo do&apos;koni</span>
                <span className="hidden sm:inline">Kimyo laboratoriya mahsulotlarining sotuvi</span>
              </h3>

              <p className="hidden sm:block text-xs text-blue-200/80 mt-2 leading-relaxed">
                Laboratoriya shisha idishlari, asboblar va o&apos;quv reaktivlari tez kunda qo&apos;shiladi.
              </p>
            </div>

            <div className="hidden sm:flex mt-4 pt-3 border-t border-blue-900/40 items-center justify-between text-xs font-semibold text-amber-300 group-hover:text-yellow-300 transition">
              <span className="truncate">Tez kunda qo&apos;shiladi</span>
              <Ikon nom="ong" olcham={13} className="shrink-0" />
            </div>
          </Link>

          {/* 7. KIMYOVIY O'YINLAR (YANGI RUKN) */}
          <Link
            href="/oyinlar"
            className="p-2.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/55 via-[#0b1a3d]/65 to-[#070f2b]/55 hover:border-yellow-400/50 active:scale-[0.98] transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center sm:items-stretch sm:text-left">
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 group-hover:text-yellow-400 transition-colors shrink-0">
                  <Ikon nom="oyin" olcham={20} />
                </div>
              </div>

              <h3 className="text-[12px] sm:text-xl md:text-2xl font-bold tracking-tight leading-tight sm:leading-snug text-white group-hover:text-yellow-400 transition-colors">
                <span className="sm:hidden">Kimyo o&apos;yinlar</span>
                <span className="hidden sm:inline">Kimyoviy o&apos;yinlar</span>
              </h3>

              <p className="hidden sm:block text-xs text-blue-200/80 mt-2 leading-relaxed">
                Smart doskada formulalar va molekulalarni topish o‘yini.
              </p>
            </div>

            <div className="hidden sm:flex mt-4 pt-3 border-t border-blue-900/40 items-center justify-between text-xs font-semibold text-amber-300 group-hover:text-yellow-300 transition">
              <span className="truncate">O‘yinlarni ochish</span>
              <Ikon nom="ong" olcham={13} className="shrink-0" />
            </div>
          </Link>

          {/* 8. KIMYOGARLAR HAQIDA MAQOLALAR (YANGI RUKN) */}
          <Link
            href="/kimyogarlar"
            className="p-2.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/55 via-[#0b1a3d]/65 to-[#070f2b]/55 hover:border-yellow-400/50 active:scale-[0.98] transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center sm:items-stretch sm:text-left">
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-600/30 to-indigo-600/30 border border-sky-500/40 flex items-center justify-center text-sky-300 group-hover:text-yellow-400 transition-colors shrink-0">
                  <Ikon nom="maqola" olcham={20} />
                </div>
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-amber-600/20 text-amber-300 border border-amber-500/35 rounded-full text-[9px] sm:text-xs font-semibold backdrop-blur-sm truncate max-w-full">
                  Tez kunda
                </span>
              </div>

              <h3 className="text-[12px] sm:text-xl md:text-2xl font-bold tracking-tight leading-tight sm:leading-snug text-white group-hover:text-yellow-400 transition-colors">
                <span className="sm:hidden">Kimyogarlar</span>
                <span className="hidden sm:inline">Kimyogarlar haqida maqolalar</span>
              </h3>

              <p className="hidden sm:block text-xs text-blue-200/80 mt-2 leading-relaxed">
                Buyuk va zamonaviy kimyogar olimlarning hayoti hamda ilmiy ijodi haqida batafsil maqolalar.
              </p>
            </div>

            <div className="hidden sm:flex mt-4 pt-3 border-t border-blue-900/40 items-center justify-between text-xs font-semibold text-amber-300 group-hover:text-yellow-300 transition">
              <span className="truncate">Ilmiy maqolalar · Tez kunda</span>
              <Ikon nom="ong" olcham={13} className="shrink-0" />
            </div>
          </Link>

          {/* 9. ENG YAQIN KIMYO-BIOLOGIYA REPITITORLARI (KARTA ORQALI — YANGI RUKN) */}
          <Link
            href="/repititorlar"
            className="p-2.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/55 via-[#0b1a3d]/65 to-[#070f2b]/55 hover:border-yellow-400/50 active:scale-[0.98] transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center sm:items-stretch sm:text-left">
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-600/30 to-emerald-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300 group-hover:text-yellow-400 transition-colors shrink-0">
                  <Ikon nom="xarita" olcham={20} />
                </div>
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/35 rounded-full text-[9px] sm:text-xs font-semibold backdrop-blur-sm truncate max-w-full">
                  Jonli xarita
                </span>
              </div>

              <h3 className="text-[12px] sm:text-xl md:text-2xl font-bold tracking-tight leading-tight sm:leading-snug text-white group-hover:text-yellow-400 transition-colors">
                <span className="sm:hidden">Repititorlar</span>
                <span className="hidden sm:inline">Eng yaqin kimyo-biologiya repititorlari</span>
              </h3>

              <p className="hidden sm:block text-xs text-blue-200/80 mt-2 leading-relaxed">
                Hududingizdagi kimyo va biologiya repititorlarini jonli xarita (GPS) orqali toping yoki o&apos;z markazingizni qo&apos;shing.
              </p>
            </div>

            <div className="hidden sm:flex mt-4 pt-3 border-t border-blue-900/40 items-center justify-between text-xs font-semibold text-emerald-300 group-hover:text-yellow-300 transition">
              <span className="truncate">Karta orqali topish va qo&apos;shish</span>
              <Ikon nom="ong" olcham={13} className="shrink-0" />
            </div>
          </Link>
        </div>

        {/* Mobilda Maktab sinflariga tezkor o'tish paneli */}
        <div className="sm:hidden p-2.5 rounded-2xl border border-blue-800/40 bg-[#0b1538]/60 backdrop-blur-sm flex items-center justify-between gap-1.5">
          <span className="text-[11px] font-semibold text-blue-200 pl-1 shrink-0">Sinflar:</span>
          <div className="grid grid-cols-5 gap-1.5 flex-1">
            {[
              { s: "7", ochiq: true },
              { s: "8", ochiq: true },
              { s: "9", ochiq: false },
              { s: "10", ochiq: false },
              { s: "11", ochiq: false },
            ].map(({ s, ochiq }) => (
              <Link
                key={s}
                href={ochiq ? `/maktabkimyo/${s}sinf` : "/maktabkimyo"}
                className={`py-1.5 rounded-xl border text-[11px] font-bold text-center transition ${
                  ochiq
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300 active:bg-emerald-500/25"
                    : "border-blue-800/50 bg-[#09153a]/60 text-blue-300/60"
                }`}
              >
                {s}-sinf
              </Link>
            ))}
          </div>
        </div>

        {/* 5. JDA KIMYO AI — TO'LIQ QULFLANGAN VA FAQAT PREMIUM */}
        <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl border-2 border-yellow-500/40 bg-gradient-to-br from-yellow-950/20 via-[#0e1742]/50 to-[#060c24]/70 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-600/30 border border-yellow-500/50 flex items-center justify-center text-yellow-400 shrink-0 shadow-lg shadow-yellow-500/20">
                <Ikon nom="qulf" olcham={24} />
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h3 className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                  JDA Kimyo AI
                </h3>
                <span className="px-2.5 py-0.5 rounded-full border border-yellow-500/50 bg-yellow-500/20 text-yellow-300 text-[10px] sm:text-xs font-bold flex items-center gap-1">
                  <Ikon nom="qulf" olcham={11} />
                  <span>PREMIUM</span>
                </span>
              </div>
            </div>

            {/* Telegram orqali bog'lanish harakati */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0">
              <div className="text-[11px] sm:text-xs text-yellow-200/90 text-left md:text-right">
                Premiumni faollashtirish uchun:
              </div>
              <a
                href="https://t.me/diyorbek_jabborov"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
              >
                <Ikon nom="telegram" olcham={15} />
                <span>@diyorbek_jabborov ga yozish</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. PLATFORMA ASBOBLARI VA HAMJAMIYAT (3 TA TOZA MODUL) ─── */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 py-3 sm:py-6 w-full relative z-10">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          <Link
            href="/dolzarb"
            className="p-3 sm:p-4 rounded-2xl border border-blue-900/40 bg-[#091538]/40 hover:border-yellow-400/50 hover:bg-[#0c1f52]/50 active:scale-[0.98] transition-all flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 backdrop-blur-sm group"
          >
            <span className="p-2 sm:p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 shrink-0 group-hover:scale-105 transition-transform">
              <Ikon nom="muhokama" olcham={18} />
            </span>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-white group-hover:text-yellow-400 transition-colors leading-tight">
                Dolzarb mavzular
              </div>
              <div className="text-[10px] sm:text-[11px] text-blue-300 mt-0.5">Savol-javob</div>
            </div>
          </Link>

          <Link
            href="/kochat"
            className="p-3 sm:p-4 rounded-2xl border border-blue-900/40 bg-[#091538]/40 hover:border-yellow-400/50 hover:bg-[#0c1f52]/50 active:scale-[0.98] transition-all flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 backdrop-blur-sm group"
          >
            <span className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
              <Ikon nom="kristall" olcham={18} />
            </span>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-white group-hover:text-yellow-400 transition-colors leading-tight">
                Kimyogar ko&apos;chati
              </div>
              <div className="text-[10px] sm:text-[11px] text-blue-300 mt-0.5">Gamifikatsiya</div>
            </div>
          </Link>

          <Link
            href="/chat"
            className="p-3 sm:p-4 rounded-2xl border border-blue-900/40 bg-[#091538]/40 hover:border-yellow-400/50 hover:bg-[#0c1f52]/50 active:scale-[0.98] transition-all flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 backdrop-blur-sm group"
          >
            <span className="p-2 sm:p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 shrink-0 group-hover:scale-105 transition-transform">
              <Ikon nom="xabar" olcham={18} />
            </span>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-bold text-white group-hover:text-yellow-400 transition-colors leading-tight">
                Ilmiy chat
              </div>
              <div className="text-[10px] sm:text-[11px] text-blue-300 mt-0.5">Hamjamiyat</div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── 5. YARATUVCHI FOOTER (ASL ESKI USLUBDAGI YARATUVCHI KARTASI) ─── */}
      <footer className="mt-auto border-t border-blue-900/50 bg-[#050920]/90 backdrop-blur-xl pt-10 pb-24 md:py-12 text-xs text-blue-200 relative z-10">
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
                  v4.0.0
                </span>
                <Link
                  href="/jda-kimyo"
                  className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold flex items-center gap-1 mt-1 transition"
                >
                  <Ikon nom="atom" olcham={15} />
                  <span>JDA KIMYO nima?</span>
                </Link>
                <Link
                  href="/sertifikat"
                  className="text-xs text-blue-300 hover:text-yellow-300 font-semibold flex items-center gap-1 transition"
                >
                  <Ikon nom="qalqon" olcham={14} />
                  <span>Sertifikatni tekshirish</span>
                </Link>
                <p className="text-blue-300/70 text-xs mt-1">© 2026 JDA KIMYO</p>
                <p className="text-blue-300/50 text-[11px]">Kimyo ta&apos;lim platformasi</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── MOBIL PASTKI NAVIGATSIYA BAR (FAQAT MOBILDA) ─── */}
      <nav
        aria-label="Tezkor mobil navigatsiya"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-blue-900/60 bg-[#060b26]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 h-16">
          <Link
            href="/"
            aria-current="page"
            className="flex flex-col items-center justify-center gap-1 text-[10px] font-bold text-yellow-400"
          >
            <Ikon nom="atom" olcham={19} qalin={2} />
            <span>Asosiy</span>
          </Link>

          <Link
            href="/maktabkimyo"
            className="flex flex-col items-center justify-center gap-1 text-[10px] font-semibold text-blue-200/80 active:text-yellow-400 transition-colors"
          >
            <Ikon nom="maktab" olcham={19} />
            <span>Maktab</span>
          </Link>

          <Link
            href="/milliy-sertifikat"
            className="flex flex-col items-center justify-center gap-1 text-[10px] font-semibold text-blue-200/80 active:text-yellow-400 transition-colors"
          >
            <Ikon nom="sertifikat" olcham={19} />
            <span>Sertifikat</span>
          </Link>

          <Link
            href="/chat"
            className="relative flex flex-col items-center justify-center gap-1 text-[10px] font-semibold text-blue-200/80 active:text-yellow-400 transition-colors"
          >
            <div className="relative">
              <Ikon nom="xabar" olcham={19} />
              {oqilmaganChat > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 flex items-center justify-center rounded-full bg-rose-600 text-white text-[9px] font-bold leading-none">
                  {oqilmaganChat > 99 ? "99+" : oqilmaganChat}
                </span>
              )}
            </div>
            <span>Chat</span>
          </Link>

          <Link
            href={session ? "/profil" : "/login"}
            className="flex flex-col items-center justify-center gap-1 text-[10px] font-semibold text-blue-200/80 active:text-yellow-400 transition-colors"
          >
            <Ikon nom="odam" olcham={19} />
            <span>{session ? "Kabinet" : "Kirish"}</span>
          </Link>
        </div>
      </nav>
    </main>
  )
}
