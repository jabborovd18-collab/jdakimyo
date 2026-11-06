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
  const oqilmaganChat = bildirishnoma?.chat || 0

  useEffect(() => {
    if (!session?.user) return
    let bekor = false

    async function yuklaProfil() {
      try {
        const res = await fetch("/api/profil")
        if (!res.ok) return
        const data = await res.json()
        if (!bekor && data?.user) {
          setProfilData(data.user)
        }
      } catch {
        // Tarmoq xatosi bo'lsa session ma'lumotlariga suyaniladi
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
    if (isAdminRole(session.user.role)) {
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

  const userCoins = profilData?.coins ?? 0
  const userGems = profilData?.gems ?? 0
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
                  href="/auth/login"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-purple-700/60 bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 hover:text-white transition"
                >
                  Kirish
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold transition shadow-md shadow-yellow-500/20"
                >
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── 2. SHAXSIY KABINET VIDJETI (KO'RINARLI HERO BO'LIMI) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 w-full relative z-10">
        {session ? (
          <div className="p-5 md:p-6 rounded-3xl border border-blue-800/50 bg-gradient-to-br from-[#121646]/70 via-[#0a183d]/70 to-[#07112c]/70 backdrop-blur-md shadow-2xl shadow-blue-950/40 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center font-bold text-xl text-black shadow-lg shadow-yellow-500/30 shrink-0">
                {bosHarf()}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-lg md:text-xl font-bold text-white">
                    {session.user?.fullName || session.user?.username}
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 font-semibold">
                    {userDaraja.daraja}-daraja
                  </span>
                </div>
                <div className="text-xs text-blue-200/80 mt-1">
                  @{session.user?.username} · ID: {session.user?.userId}
                </div>
              </div>
            </div>

            {/* Hisob ko'rsatkichlari va kabinetga o'tish */}
            <div className="flex items-center gap-4 md:gap-6 flex-wrap text-xs">
              <div className="flex items-center gap-1.5 bg-[#091333]/80 px-3 py-1.5 rounded-xl border border-blue-900/50">
                <span className="text-amber-400">
                  <Ikon nom="tanga" olcham={16} />
                </span>
                <span className="text-blue-100">
                  <strong className="text-sm font-bold text-white">{userCoins}</strong> tanga
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#091333]/80 px-3 py-1.5 rounded-xl border border-blue-900/50">
                <span className="text-cyan-400">
                  <Ikon nom="olmos" olcham={16} />
                </span>
                <span className="text-blue-100">
                  <strong className="text-sm font-bold text-white">{userGems}</strong> olmos
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#091333]/80 px-3 py-1.5 rounded-xl border border-blue-900/50">
                <span className="text-yellow-400">
                  <Ikon nom="yulduz" olcham={16} />
                </span>
                <span className="text-blue-100">
                  <strong className="text-sm font-bold text-white">{userStars}</strong> yulduz
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#091333]/80 px-3 py-1.5 rounded-xl border border-blue-900/50">
                <span className="text-orange-400">
                  <Ikon nom="olov" olcham={16} />
                </span>
                <span className="text-blue-100">
                  <strong className="text-sm font-bold text-white">{userStreak}</strong> kun
                </span>
              </div>

              <Link
                href="/profil"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black transition shadow-lg shadow-yellow-500/20 ml-auto md:ml-2 flex items-center gap-1.5"
              >
                <Ikon nom="odam" olcham={14} />
                <span>Shaxsiy kabinet</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8 rounded-3xl border border-blue-800/50 bg-gradient-to-br from-[#121646]/70 via-[#0a183d]/70 to-[#07112c]/70 backdrop-blur-md shadow-2xl shadow-blue-950/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-600/20 border border-yellow-600/30 rounded-full text-xs font-semibold text-yellow-300 mb-3 backdrop-blur-sm">
                <Ikon nom="atom" olcham={14} />
                <span>ILMIY VA ZAMONAVIY TA&apos;LIM PLATFORMASI</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {NOM}
                </span>{" "}
                ta&apos;lim portali
              </h1>
              <p className="text-sm text-blue-100/90 mt-2 max-w-2xl leading-relaxed">
                Maktab darsliklari, oliy kimyo video ma&apos;ruzalari va milliy sertifikat (Rasch IRT modeli) tayyorgarligi.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/auth/login"
                className="px-5 py-2.5 text-xs font-semibold rounded-xl border border-blue-700/60 bg-[#09153a]/60 hover:bg-[#0c1f54]/70 text-blue-200 hover:text-white transition backdrop-blur-sm"
              >
                Kirish
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black transition shadow-lg shadow-yellow-500/20"
              >
                Ro&apos;yxatdan o&apos;tish
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ─── 3. ASOSIY TA'LIM DARVOZALARI (6 TA ASOSIY BO'LIM) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full relative z-10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. MAKTAB KIMYOSI */}
          <div className="p-5 sm:p-7 rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/40 via-[#0b1a3d]/50 to-[#070f2b]/40 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:text-yellow-400 transition-colors">
                  <Ikon nom="maktab" olcham={24} />
                </div>
                <span className="px-3.5 py-1 bg-yellow-600/20 text-yellow-300 border border-yellow-600/30 rounded-full text-xs font-semibold backdrop-blur-sm">
                  7–11 sinflar
                </span>
              </div>

              <Link href="/maktabkimyo">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                  Maktab kimyosi
                </h3>
              </Link>

              {/* Tezkor sinf tugmalari */}
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                {["7", "8", "9", "10", "11"].map((sinf) => (
                  <Link
                    key={sinf}
                    href={`/maktabkimyo/${sinf}sinf`}
                    className="px-3 py-1 rounded-lg border border-blue-700/50 bg-[#09153a]/60 hover:bg-yellow-500/20 hover:border-yellow-400/50 text-xs font-semibold text-blue-200 hover:text-yellow-300 transition"
                  >
                    {sinf}-sinf
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/maktabkimyo"
              className="mt-6 pt-4 border-t border-blue-900/40 flex items-center justify-between text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition"
            >
              <span>Maktab bo&apos;limiga kirish</span>
              <Ikon nom="ong" olcham={15} />
            </Link>
          </div>

          {/* 2. OLIY KIMYO */}
          <Link
            href="/oliykimyo"
            className="p-5 sm:p-7 rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/40 via-[#0b1a3d]/50 to-[#070f2b]/40 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600/30 to-cyan-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 group-hover:text-yellow-400 transition-colors">
                  <Ikon nom="oliy" olcham={24} />
                </div>
                <span className="px-3.5 py-1 bg-blue-600/20 text-blue-300 border border-blue-600/30 rounded-full text-xs font-semibold backdrop-blur-sm">
                  Video ma&apos;ruzalar
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                Oliy kimyo
              </h3>
            </div>

            <div className="mt-8 pt-4 border-t border-blue-900/40 flex items-center justify-between text-xs font-semibold text-yellow-400 group-hover:text-yellow-300 transition">
              <span>Fanlarni ochish</span>
              <Ikon nom="ong" olcham={15} />
            </div>
          </Link>

          {/* 3. MILLIY SERTIFIKAT SINOV TESTI */}
          <Link
            href="/milliy-sertifikat"
            className="p-5 sm:p-7 rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/40 via-[#0b1a3d]/50 to-[#070f2b]/40 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover:text-yellow-400 transition-colors">
                  <Ikon nom="sertifikat" olcham={24} />
                </div>
                <span className="px-3.5 py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-600/30 rounded-full text-xs font-semibold backdrop-blur-sm">
                  Rasch IRT modeli
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                Milliy sertifikat sinov testi
              </h3>
            </div>

            <div className="mt-8 pt-4 border-t border-blue-900/40 flex items-center justify-between text-xs font-semibold text-yellow-400 group-hover:text-yellow-300 transition">
              <span>Test tizimiga o&apos;tish</span>
              <Ikon nom="ong" olcham={15} />
            </div>
          </Link>

          {/* 4. BOSHQA TESTLAR */}
          <Link
            href="/testlar"
            className="p-5 sm:p-7 rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/40 via-[#0b1a3d]/50 to-[#070f2b]/40 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-600/30 to-rose-600/30 border border-pink-500/40 flex items-center justify-center text-pink-300 group-hover:text-yellow-400 transition-colors">
                  <Ikon nom="quiz" olcham={24} />
                </div>
                <span className="px-3.5 py-1 bg-pink-600/20 text-pink-300 border border-pink-600/30 rounded-full text-xs font-semibold backdrop-blur-sm">
                  Amaliy mashqlar
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                Boshqa testlar
              </h3>
            </div>

            <div className="mt-8 pt-4 border-t border-blue-900/40 flex items-center justify-between text-xs font-semibold text-yellow-400 group-hover:text-yellow-300 transition">
              <span>Testlar katalogi</span>
              <Ikon nom="ong" olcham={15} />
            </div>
          </Link>

          {/* 5. LABORATORIYA MASHG'ULOTLARI (VIDEOLAR VA QO'LLANMALAR) */}
          <Link
            href="/laboratoriya"
            className="p-5 sm:p-7 rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/40 via-[#0b1a3d]/50 to-[#070f2b]/40 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600/30 to-teal-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 group-hover:text-yellow-400 transition-colors">
                  <Ikon nom="kolba" olcham={24} />
                </div>
                <span className="px-3.5 py-1 bg-cyan-600/20 text-cyan-300 border border-cyan-600/30 rounded-full text-xs font-semibold backdrop-blur-sm">
                  Videolar va qo&apos;llanmalar
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                Laboratoriya mashg&apos;ulotlari
              </h3>
            </div>

            <div className="mt-8 pt-4 border-t border-blue-900/40 flex items-center justify-between text-xs font-semibold text-yellow-400 group-hover:text-yellow-300 transition">
              <span>Mashg&apos;ulotlarni ochish</span>
              <Ikon nom="ong" olcham={15} />
            </div>
          </Link>

          {/* 6. KIMYO LABORATORIYA MAHSULOTLARINING SOTUVI */}
          <Link
            href="/dokon"
            className="p-5 sm:p-7 rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#121644]/40 via-[#0b1a3d]/50 to-[#070f2b]/40 hover:border-yellow-400/50 transition-all duration-300 backdrop-blur-sm shadow-xl flex flex-col justify-between group hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600/30 to-yellow-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300 group-hover:text-yellow-400 transition-colors">
                  <Ikon nom="savat" olcham={24} />
                </div>
                <span className="px-3.5 py-1 bg-amber-600/20 text-amber-300 border border-amber-600/30 rounded-full text-xs font-semibold backdrop-blur-sm">
                  Jihozlar va reaktivlar
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                Kimyo laboratoriya mahsulotlarining sotuvi
              </h3>
            </div>

            <div className="mt-8 pt-4 border-t border-blue-900/40 flex items-center justify-between text-xs font-semibold text-yellow-400 group-hover:text-yellow-300 transition">
              <span>Mahsulotlar katalogi</span>
              <Ikon nom="ong" olcham={15} />
            </div>
          </Link>
        </div>

        {/* 5. JDA KIMYO AI — TO'LIQ QULFLANGAN VA FAQAT PREMIUM */}
        <div className="p-5 sm:p-7 rounded-3xl border-2 border-yellow-500/40 bg-gradient-to-br from-yellow-950/20 via-[#0e1742]/50 to-[#060c24]/70 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-600/30 border border-yellow-500/50 flex items-center justify-center text-yellow-400 shrink-0 shadow-lg shadow-yellow-500/20">
                <Ikon nom="qulf" olcham={28} />
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                  JDA Kimyo AI
                </h3>
                <span className="px-3 py-0.5 rounded-full border border-yellow-500/50 bg-yellow-500/20 text-yellow-300 text-xs font-bold flex items-center gap-1.5">
                  <Ikon nom="qulf" olcham={12} />
                  <span>PREMIUM</span>
                </span>
              </div>
            </div>

            {/* Telegram orqali bog'lanish harakati */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0">
              <div className="text-xs text-yellow-200/90 text-left md:text-right">
                Premiumni faollashtirish uchun:
              </div>
              <a
                href="https://t.me/diyorbek_jabborov"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
              >
                <Ikon nom="telegram" olcham={15} />
                <span>@diyorbek_jabborov ga yozish</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. PLATFORMA ASBOBLARI VA HAMJAMIYAT (3 TA TOZA MODUL) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dolzarb"
            className="p-4 rounded-2xl border border-blue-900/40 bg-[#091538]/40 hover:border-yellow-400/50 hover:bg-[#0c1f52]/50 transition-all flex items-center gap-3 backdrop-blur-sm group"
          >
            <span className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 shrink-0 group-hover:scale-105 transition-transform">
              <Ikon nom="muhokama" olcham={18} />
            </span>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">
                Dolzarb mavzular
              </div>
              <div className="text-[11px] text-blue-300">Savol-javob</div>
            </div>
          </Link>

          <Link
            href="/kochat"
            className="p-4 rounded-2xl border border-blue-900/40 bg-[#091538]/40 hover:border-yellow-400/50 hover:bg-[#0c1f52]/50 transition-all flex items-center gap-3 backdrop-blur-sm group"
          >
            <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
              <Ikon nom="kristall" olcham={18} />
            </span>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">
                Kimyogar ko&apos;chati
              </div>
              <div className="text-[11px] text-blue-300">Gamifikatsiya</div>
            </div>
          </Link>

          <Link
            href="/chat"
            className="p-4 rounded-2xl border border-blue-900/40 bg-[#091538]/40 hover:border-yellow-400/50 hover:bg-[#0c1f52]/50 transition-all flex items-center gap-3 backdrop-blur-sm group"
          >
            <span className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 shrink-0 group-hover:scale-105 transition-transform">
              <Ikon nom="xabar" olcham={18} />
            </span>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">
                Ilmiy chat
              </div>
              <div className="text-[11px] text-blue-300">Hamjamiyat</div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── 5. YARATUVCHI FOOTER (ASL ESKI USLUBDAGI YARATUVCHI KARTASI) ─── */}
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
