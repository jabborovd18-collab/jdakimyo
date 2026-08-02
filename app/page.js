"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"

// Hero'dagi aylanuvchi kompleks uchun ligandlar (oktaedrik: 3 halqa × 2 ligand)
const ORBIT_RINGS = [
  { tilt: "jda-tilt-a", speed: "jda-spin-slow", ligands: ["NH₃", "NH₃"] },
  { tilt: "jda-tilt-b", speed: "jda-spin-mid", ligands: ["CN⁻", "CN⁻"] },
  { tilt: "jda-tilt-c", speed: "jda-spin-fast", ligands: ["H₂O", "Cl⁻"] },
]

const TICKER_FORMULAS = [
  "[Co(NH₃)₆]³⁺", "[Fe(CN)₆]⁴⁻", "[Cu(H₂O)₄]²⁺", "[Ni(CO)₄]",
  "[PtCl₄]²⁻", "[Cr(NH₃)₆]³⁺", "[Ag(NH₃)₂]⁺", "[Zn(OH)₄]²⁻",
  "[Fe(H₂O)₆]³⁺", "[Co(en)₃]³⁺",
]

export default function Home() {
  const { data: session, status } = useSession()
  const [showMobileWarning, setShowMobileWarning] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const role = session?.user?.role
  const isAdmin = ['admin', 'superadmin', 'moderator'].includes(role)
  const isTeacher = ['teacher', 'ustoz', 'superadmin'].includes(role)

  useReveal()

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const dismissed = localStorage.getItem("mobileWarningDismissed")

    if (isMobile && !dismissed) {
      setShowMobileWarning(true)
    }
  }, [])

  const dismissMobileWarning = () => {
    localStorage.setItem("mobileWarningDismissed", "true")
    setShowMobileWarning(false)
  }

  // Foydalanuvchi ismining bosh harfi
  const getUserInitial = () => {
    if (session?.user?.fullName) {
      return session.user.fullName.charAt(0).toUpperCase()
    }
    if (session?.user?.username) {
      return session.user.username.charAt(0).toUpperCase()
    }
    return "U"
  }

  const navLinks = [
    { href: "/oquv", label: "O'quv" },
    { href: "/ilmiy", label: "Ilmiy" },
    { href: "/birikmalar", label: "Birikmalar" },
    { href: "/oquv/video-darsliklar", label: "Video & Quiz" },
    { href: "/laboratoriya", label: "Laboratoriya" },
  ]

  // Rolga qarab bosh sahifadagi shaxsiy panel plitkasi (kabinet / ustoz / admin)
  const roleTile = isAdmin
    ? {
        href: "/admin",
        icon: "🛡️",
        badge: "Boshqaruv",
        title: "Admin nazorat paneli",
        desc: "Foydalanuvchilar, kontent va tizim sozlamalarini boshqaring",
        glow: "bg-orange-500",
        chipBg: "bg-orange-600/30",
        chipText: "text-orange-300",
      }
    : isTeacher
    ? {
        href: "/ustoz",
        icon: "👨‍🏫",
        badge: "Ustoz",
        title: "Ustoz paneli",
        desc: "Guruhlar, vazifalar va talabalaringizni shu yerdan boshqaring",
        glow: "bg-green-500",
        chipBg: "bg-green-600/30",
        chipText: "text-green-300",
      }
    : session
    ? {
        href: "/profil",
        icon: "👤",
        badge: "Kabinet",
        title: "Mening kabinetim",
        desc: "Profil, statistika, yutuqlar va do'stlaringiz",
        glow: "bg-purple-500",
        chipBg: "bg-purple-600/30",
        chipText: "text-purple-300",
      }
    : {
        href: "/register",
        icon: "🚀",
        badge: "Bepul",
        title: "Ro'yxatdan o'tish",
        desc: "Hisob yarating, progressingizni kuzating va yutuqlar to'plang",
        glow: "bg-yellow-500",
        chipBg: "bg-yellow-600/30",
        chipText: "text-yellow-300",
      }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950 to-purple-950 text-white overflow-x-hidden">

      {/* MOBILE OGOHLANTIRISH MODAL */}
      {showMobileWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 jda-fade-in">
          <div className="bg-gradient-to-br from-yellow-950/95 to-orange-950/95 border-2 border-yellow-500/60 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-yellow-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl flex-shrink-0">
                📱
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-300">Mobile qurilma aniqlandi</h3>
                <p className="text-xs text-yellow-100/70">Muhim ma'lumot</p>
              </div>
            </div>

            <p className="text-yellow-100 text-sm leading-relaxed mb-4">
              Ushbu sayt <strong className="text-yellow-300">kompyuterlar uchun</strong> to'liq moslashgan.
              Mobile qurilmalarda ba'zi bo'limlarda <strong className="text-yellow-300">nosozliklar, qotishlar</strong> yoki
              3D modellarda sekin ishlash kuzatilishi mumkin.
            </p>

            <div className="bg-black/30 border border-yellow-600/30 rounded-lg p-3 mb-5">
              <p className="text-xs text-yellow-200/90">
                💡 <strong>Eng yaxshi tajriba</strong> uchun kompyuter yoki planshetdan foydalanishni tavsiya etamiz.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={dismissMobileWarning}
                className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all"
              >
                Tushundim, davom etish
              </button>
            </div>

            <label className="flex items-center gap-2 mt-3 cursor-pointer justify-center">
              <input
                type="checkbox"
                className="accent-yellow-500"
                defaultChecked
                onChange={(e) => {
                  if (!e.target.checked) {
                    localStorage.removeItem("mobileWarningDismissed")
                  }
                }}
              />
              <span className="text-xs text-yellow-100/70">Boshqa ko'rsatilmasin</span>
            </label>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-purple-800/50 bg-purple-950/80 backdrop-blur-xl">
        <div className="flex justify-between items-center px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -ml-2 text-purple-200 hover:text-yellow-400 transition-colors"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>

            <Link href="/" className="group flex items-center gap-2">
              <span className="jda-logo-mark" aria-hidden="true" />
              <span className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                JDA KIMYO
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="jda-nav-link px-3 py-2 text-purple-300 hover:text-yellow-400 transition-colors text-sm font-medium">
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin"
                className="ml-2 flex items-center gap-1.5 px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/40 rounded-full text-orange-300 hover:text-orange-200 transition-all text-xs font-semibold"
              >
                <span>🛡️</span> Admin panel
              </Link>
            )}
            {isTeacher && (
              <Link
                href="/ustoz"
                className="ml-2 flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 border border-green-600/40 rounded-full text-green-300 hover:text-green-200 transition-all text-xs font-semibold"
              >
                <span>👨‍🏫</span> Ustoz paneli
              </Link>
            )}
          </nav>

          <div className="flex gap-2 items-center">
            <Link href="/qidiruv" className="px-3 sm:px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
              <span>🔍</span>
              <span className="hidden sm:inline">Qidiruv</span>
              <kbd className="hidden lg:inline-block text-[10px] bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-700">Ctrl+K</kbd>
            </Link>

            {/* ═══════════════════════════════════════════════════ */}
            {/* PROFIL / KIRISH TUGMASI */}
            {/* ═══════════════════════════════════════════════════ */}
            {status === "loading" ? (
              <div className="w-10 h-10 rounded-full bg-purple-800/50 animate-pulse"></div>
            ) : session ? (
              // LOGGED IN - User Menu
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-gradient-to-r from-purple-800/50 to-purple-700/50 hover:from-purple-700/70 hover:to-purple-600/70 border border-purple-600/50 rounded-full transition-all group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-bold text-black">
                    {getUserInitial()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-white max-w-[120px] truncate">
                    {session.user?.fullName || session.user?.username || "Profil"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-purple-300 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />

                    {/* Menu */}
                    <div className="jda-dropdown absolute right-0 mt-2 w-64 bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-xl border border-purple-700/50 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">

                      {/* User Info Header */}
                      <div className="px-4 py-4 border-b border-purple-700/50 bg-purple-950/50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xl font-bold text-black flex-shrink-0">
                            {getUserInitial()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-white truncate">
                              {session.user?.fullName || session.user?.username}
                            </div>
                            <div className="text-xs text-purple-400 truncate">
                              @{session.user?.username}
                            </div>
                            <div className="text-xs text-yellow-400 font-mono mt-0.5">
                              ID: {session.user?.userId}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-900/30 transition-all group"
                          >
                            <span className="text-xl">🛡️</span>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-orange-300 group-hover:text-orange-200 transition-colors">
                                Admin nazorat paneli
                              </div>
                              <div className="text-xs text-purple-400">Tizim boshqaruvi</div>
                            </div>
                            <span className="text-purple-500 group-hover:text-orange-300 group-hover:translate-x-1 transition-all">→</span>
                          </Link>
                        )}

                        {isTeacher && (
                          <Link
                            href="/ustoz"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-900/30 transition-all group"
                          >
                            <span className="text-xl">👨‍🏫</span>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-green-300 group-hover:text-green-200 transition-colors">
                                Ustoz paneli
                              </div>
                              <div className="text-xs text-purple-400">Guruhlar va talabalar</div>
                            </div>
                            <span className="text-purple-500 group-hover:text-green-300 group-hover:translate-x-1 transition-all">→</span>
                          </Link>
                        )}

                        <Link
                          href="/profil"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-800/50 transition-all group"
                        >
                          <span className="text-xl">👤</span>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors">
                              Shaxsiy kabinet
                            </div>
                            <div className="text-xs text-purple-400">Profil, statistika, do'stlar</div>
                          </div>
                          <span className="text-purple-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all">→</span>
                        </Link>

                        <Link
                          href="/profil/quizlar"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-800/50 transition-all group"
                        >
                          <span className="text-xl">📝</span>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors">
                              Quiz natijalarim
                            </div>
                            <div className="text-xs text-purple-400">Barcha test tarixi</div>
                          </div>
                          <span className="text-purple-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all">→</span>
                        </Link>

                        <Link
                          href="/profil/yutuqlar"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-800/50 transition-all group"
                        >
                          <span className="text-xl">🏆</span>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors">
                              Yutuqlarim
                            </div>
                            <div className="text-xs text-purple-400">Badges va mukofotlar</div>
                          </div>
                          <span className="text-purple-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all">→</span>
                        </Link>

                        <Link
                          href="/profil/dostlar"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-800/50 transition-all group"
                        >
                          <span className="text-xl">👥</span>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors">
                              Do'stlarim
                            </div>
                            <div className="text-xs text-purple-400">Do'stlarni boshqarish</div>
                          </div>
                          <span className="text-purple-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all">→</span>
                        </Link>

                        <Link
                          href="/laboratoriya"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-800/50 transition-all group"
                        >
                          <span className="text-xl">🔬</span>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors">
                              Laboratoriyam
                            </div>
                            <div className="text-xs text-purple-400">Inventar, tajriba, do'kon</div>
                          </div>
                          <span className="text-purple-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all">→</span>
                        </Link>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-purple-700/50 p-2">
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            signOut({ callbackUrl: '/' })
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-900/30 transition-all group"
                        >
                          <span className="text-xl">🚪</span>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-semibold text-red-400 group-hover:text-red-300 transition-colors">
                              Chiqish
                            </div>
                            <div className="text-xs text-purple-400">Hisobdan chiqish</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // NOT LOGGED IN - Login/Register Buttons
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <span>🔐</span>
                  <span className="hidden sm:inline">Kirish</span>
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black rounded-xl text-sm font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-yellow-500/20 flex items-center gap-2"
                >
                  <span>✨</span>
                  <span className="hidden sm:inline">Ro'yxatdan o'tish</span>
                </Link>
              </div>
            )}

            <Link href="/hamkorlik" className="hidden sm:inline-flex p-2 hover:bg-purple-800/50 rounded-full transition-all" title="Hamkorlik">🤝</Link>
          </div>
        </div>

        {/* MOBILE NAV PANEL */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 border-t border-purple-800/50' : 'max-h-0'}`}>
          <nav className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-purple-200 hover:bg-purple-800/50 hover:text-yellow-400 transition-all text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/hamkorlik"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-purple-200 hover:bg-purple-800/50 hover:text-yellow-400 transition-all text-sm font-medium"
            >
              🤝 Hamkorlik
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-orange-600/20 border border-orange-600/40 text-orange-300 text-sm font-semibold mt-1"
              >
                <span>🛡️</span> Admin panel
              </Link>
            )}
            {isTeacher && (
              <Link
                href="/ustoz"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-600/20 border border-green-600/40 text-green-300 text-sm font-semibold mt-1"
              >
                <span>👨‍🏫</span> Ustoz paneli
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════ */}
      {/* HERO — matn + jonli oktaedrik kompleks                */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="relative px-4 py-14 md:py-24 overflow-hidden">

        {/* Fon nurlari */}
        <div className="absolute top-10 -left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl jda-breathe"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl jda-breathe jda-delay-2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="jda-grid-overlay absolute inset-0" aria-hidden="true"></div>

        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-8 items-center">

          {/* CHAP: matn */}
          <div className="text-center lg:text-left">
            {session ? (
              <Link
                href={roleTile.href}
                className="group inline-flex items-center gap-3 pl-2 pr-4 py-2 bg-purple-800/40 hover:bg-purple-800/60 border border-purple-600/50 rounded-full text-sm font-semibold text-purple-100 mb-6 backdrop-blur-sm transition-all"
              >
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xs font-bold text-black">
                  {getUserInitial()}
                </span>
                <span>
                  Xush kelibsiz, <strong className="text-yellow-300">{session.user?.fullName || session.user?.username}</strong>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleTile.chipBg} ${roleTile.chipText}`}>
                  {roleTile.badge}
                </span>
                <span className="text-purple-400 group-hover:text-yellow-400 group-hover:translate-x-0.5 transition-all">→</span>
              </Link>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-800/40 border border-purple-600/50 rounded-full text-xs font-semibold text-purple-200 mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                O'zbek tilidagi kompleks birikmalar platformasi
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold mb-5 leading-[1.05]">
              <span className="jda-shimmer bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Kompleks
              </span>
              <br />
              <span className="text-white">birikmalar dunyosi</span>
            </h1>

            <p className="text-base sm:text-lg text-purple-200 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Koordinatsion kimyoning barcha jihatlarini — <strong className="text-yellow-400">nazariyadan tortib</strong>
              <strong className="text-orange-400"> ilmiy tadqiqotlargacha</strong> — interaktiv, tushunarli va
              professional darajada o'rganing.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
              <Link href="/qidiruv" className="group px-7 py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-2xl text-black font-bold text-base shadow-2xl shadow-orange-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-3">
                <span>🔍</span>
                <span>Qidiruv</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/ishlashi" className="px-7 py-3.5 bg-purple-800/50 hover:bg-purple-700/70 border-2 border-purple-600/50 rounded-2xl text-white font-bold text-base backdrop-blur-sm transition-all transform hover:-translate-y-1 flex items-center gap-3">
                <span>📖</span>
                <span>Sayt qanday ishlatiladi</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0">
              {[
                { value: "120+", label: "Birikmalar", icon: "🧪" },
                { value: "20", label: "Tahlil usuli", icon: "📊" },
                { value: "500+", label: "Quiz savollari", icon: "📝" },
                { value: "∞", label: "Interaktiv", icon: "⚡" },
              ].map((stat, i) => (
                <div key={i} className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-3.5 backdrop-blur-sm hover:bg-purple-800/50 hover:border-yellow-500/40 transition-all">
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-extrabold text-yellow-400">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="text-purple-300 text-[11px] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* O'NG: jonli oktaedrik kompleks */}
          <div className="flex justify-center lg:justify-end">
            <div className="jda-complex" role="img" aria-label="Aylanuvchi oktaedrik kompleks birikma modeli">
              <div className="jda-complex-stage">
                {/* Markaziy metall ioni */}
                <div className="jda-core">
                  <span className="jda-core-label">Co</span>
                  <span className="jda-core-charge">3+</span>
                </div>
                <div className="jda-core-halo" aria-hidden="true"></div>

                {/* Ligand halqalari */}
                {ORBIT_RINGS.map((ring, i) => (
                  <div key={i} className={`jda-ring-tilt ${ring.tilt}`}>
                    <div className={`jda-ring ${ring.speed}`}>
                      {ring.ligands.map((lig, j) => (
                        <span
                          key={j}
                          className="jda-ligand"
                          style={{ transform: `rotate(${j * 180}deg) translateX(var(--jda-r)) rotate(${-j * 180}deg)` }}
                        >
                          {lig}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-xs text-purple-400 font-mono">
                [Co(NH₃)₆]³⁺ — oktaedrik koordinatsiya
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULA TICKER */}
      <div className="relative border-y border-purple-800/50 bg-purple-950/40 py-3 overflow-hidden">
        <div className="jda-ticker flex gap-8 whitespace-nowrap">
          {[...TICKER_FORMULAS, ...TICKER_FORMULAS].map((f, i) => (
            <span key={i} className="text-sm font-mono text-purple-400/70 flex items-center gap-8">
              {f}
              <span className="text-yellow-500/40">◆</span>
            </span>
          ))}
        </div>
        {/* Chetlarda yumshoq o'tish */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-purple-950 to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-purple-950 to-transparent"></div>
      </div>

      {/* ASOSIY BO'LIMLAR (bento-grid) */}
      <section className="px-4 py-16 md:py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12" data-reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Asosiy bo'limlar</h2>
          <p className="text-purple-300">Har bir bo'lim alohida auditoriya uchun mo'ljallangan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

          {/* 01 O'QUV BO'LIM — eng ko'p ishlatiladigan kirish nuqtasi, shuning uchun kengroq */}
          <SpotlightCard
            href="/oquv"
            className="lg:col-span-2 from-purple-600/20 to-purple-900/40"
            glow="bg-purple-500"
            index="01"
            indexClass="bg-purple-600/30 text-purple-300"
            icon="📚"
            iconSize="text-5xl md:text-6xl"
            title="O'quv bo'lim"
            desc="Talabalar uchun — asoslardan boshlab murakkab mavzulargacha"
            tags={["Boshlang'ich mavzular", "Komplekslarning 3D animatsiyalari"]}
            delay={0}
          />

          {/* 02 ILMIY BO'LIM */}
          <SpotlightCard
            href="/ilmiy"
            className="from-blue-600/20 to-blue-900/40"
            glow="bg-blue-500"
            index="02"
            indexClass="bg-blue-600/30 text-blue-300"
            icon="🔬"
            title="Ilmiy bo'lim"
            desc="Tadqiqotchilar uchun — zamonaviy tahlil usullari va ilmiy ishlar"
            tags={["Fizikaviy tahlil usullari", "Maqolalar", "Birikmalar", "Chuqurlashgan murakkab mavzular", "Tadqiqotlar"]}
            delay={80}
          />

          {/* 03 QUIZ TESTLAR VA VIDEO DARSLIKLAR */}
          <SpotlightCard
            href="/oquv/video-darsliklar"
            className="from-yellow-600/20 to-yellow-900/40"
            glow="bg-yellow-500"
            index="03"
            indexClass="bg-yellow-600/30 text-yellow-300"
            icon="🎯"
            title="Quiz testlar va Video darsliklar"
            desc="Bilimingizni sinang va professional video darsliklarni ko'ring"
            tags={["Yirik test baza", "Natijalarni PDF shaklida yuklab olish", "Video darsliklar"]}
            delay={160}
          />

          {/* 04 HAMKORLIK */}
          <SpotlightCard
            href="/hamkorlik"
            className="from-red-600/20 to-red-900/40"
            glow="bg-red-500"
            index="04"
            indexClass="bg-red-600/30 text-red-300"
            icon="🤝"
            title="Hamkorlik"
            desc="Jamoa bilan birga o'rganing va loyihalarda ishtirok eting"
            tags={["Jamoaga taklif", "FAQ", "Bog'lanish", "Yangiliklar"]}
            featuredTag={{ icon: "🏆", label: "Sayt hamkorlari" }}
            delay={240}
          />

          {/* 05 ROLGA QARAB: KABINET / USTOZ PANELI / ADMIN PANEL / RO'YXATDAN O'TISH */}
          <SpotlightCard
            href={roleTile.href}
            className="from-slate-800/40 to-slate-900/60"
            glow={roleTile.glow}
            index={roleTile.badge}
            indexClass={`${roleTile.chipBg} ${roleTile.chipText}`}
            icon={roleTile.icon}
            title={roleTile.title}
            desc={roleTile.desc}
            tags={[]}
            delay={320}
          />

          {/* 06 LABORATORIYA — butun kenglikda: bu boshqalardan farqli o'laroq
              o'qish emas, ishlash joyi. Uchinchi qatorni to'liq egallaydi,
              shunda tarmoq bo'sh katakcha bilan qolmaydi. */}
          <SpotlightCard
            href="/laboratoriya"
            className="lg:col-span-3 from-cyan-600/20 to-teal-900/40"
            glow="bg-cyan-500"
            index="06"
            indexClass="bg-cyan-600/30 text-cyan-300"
            icon="🔬"
            iconSize="text-5xl md:text-6xl"
            title="Virtual laboratoriya"
            desc="Reagent yig'ing, jihoz oling va tajriba o'tkazing — reaksiya nima berishini o'zingiz ko'rasiz"
            tags={["200 dan ortiq reaksiya", "Inventar va do'kon", "Kashfiyot daftari"]}
            featuredTag={{ icon: "🧪", label: "Yangi" }}
            delay={400}
          />

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/50 px-4 py-12 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-3xl p-8 md:p-10 backdrop-blur-sm text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              <div className="flex-1">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl">
                    👨‍🔬
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Yaratuvchi</h4>
                    <p className="text-purple-300 text-sm">Diyorbek Jabborov Arslonivich</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <a
                    href="mailto:jabborovd18@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-yellow-400 hover:text-yellow-300 transition-all text-sm"
                  >
                    <span>📧</span>
                    <span>jabborovd18@gmail.com</span>
                  </a>
                  <a
                    href="https://t.me/diyorbek_jabborov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-yellow-400 hover:text-yellow-300 transition-all text-sm"
                  >
                    <span>✈️</span>
                    <span>@diyorbek_jabborov</span>
                  </a>
                  <a
                    href="https://jdakimyo.uz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-yellow-400 hover:text-yellow-300 transition-all text-sm"
                  >
                    <span>🌐</span>
                    <span>jdakimyo.uz</span>
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-600/30 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-green-400 text-xs font-mono font-bold">v2.1.0</span>
                </div>
                <p className="text-purple-400 text-xs text-center md:text-right">
                  © 2026 JDA KIMYO
                </p>
                <p className="text-purple-500 text-[10px] text-center md:text-right">
                  Kompleks birikmalar platformasi
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        /* ═══ Kirish animatsiyalari ═══ */
        @keyframes jda-fade-in { from { opacity: 0 } to { opacity: 1 } }
        .jda-fade-in { animation: jda-fade-in .3s ease-out }

        @keyframes jda-drop-in {
          from { opacity: 0; transform: translateY(-8px) scale(.98) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
        .jda-dropdown { animation: jda-drop-in .16s ease-out }

        /* ═══ Scroll bo'yicha ochilish ═══ */
        [data-reveal] {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1);
          transition-delay: var(--jda-delay, 0ms);
        }
        [data-reveal].jda-revealed { opacity: 1; transform: none }

        /* ═══ Sarlavha jilosi ═══ */
        @keyframes jda-shimmer { to { background-position: 200% center } }
        .jda-shimmer {
          background-size: 200% auto;
          animation: jda-shimmer 5s linear infinite;
        }

        /* ═══ Fon nurlarining nafas olishi ═══ */
        @keyframes jda-breathe {
          0%,100% { opacity: .5; transform: scale(1) }
          50%     { opacity: .9; transform: scale(1.12) }
        }
        .jda-breathe { animation: jda-breathe 9s ease-in-out infinite }
        .jda-delay-2 { animation-delay: -4.5s }

        /* ═══ Nozik to'r fon ═══ */
        .jda-grid-overlay {
          background-image:
            linear-gradient(rgba(168,85,247,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,.055) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 40%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, #000 40%, transparent 100%);
        }

        /* ═══ Logotip belgisi ═══ */
        .jda-logo-mark {
          width: 10px; height: 10px; border-radius: 50%;
          background: linear-gradient(135deg, #facc15, #fb923c);
          box-shadow: 0 0 0 3px rgba(250,204,21,.18), 0 0 14px rgba(251,146,60,.7);
          animation: jda-breathe 3.5s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* ═══ Navigatsiya tagidagi chiziq ═══ */
        .jda-nav-link { position: relative }
        .jda-nav-link::after {
          content: '';
          position: absolute; left: 12px; right: 12px; bottom: 4px; height: 2px;
          background: linear-gradient(90deg, #facc15, #fb923c);
          border-radius: 2px;
          transform: scaleX(0); transform-origin: left;
          transition: transform .25s cubic-bezier(.22,1,.36,1);
        }
        .jda-nav-link:hover::after { transform: scaleX(1) }

        /* ═══ Formulalar lentasi ═══ */
        @keyframes jda-ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .jda-ticker { animation: jda-ticker 40s linear infinite; width: max-content }

        /* ═══ Kartadagi kursor nuri ═══ */
        .jda-spotlight { position: relative; isolation: isolate }
        .jda-spotlight::before {
          content: '';
          position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(360px circle at var(--jda-mx, 50%) var(--jda-my, 50%), rgba(250,204,21,.10), transparent 45%);
          opacity: 0; transition: opacity .3s; pointer-events: none; z-index: 1;
        }
        .jda-spotlight:hover::before { opacity: 1 }

        /* ═══════════════════════════════════════════ */
        /* OKTAEDRIK KOMPLEKS ANIMATSIYASI              */
        /* ═══════════════════════════════════════════ */
        /* --jda-r = halqa radiusi. Ligand markazi aynan halqa chizig'iga tushishi va
           ligand shari sahna chegarasidan chiqib ketmasligi uchun halqa 26px ichkariga surilgan. */
        .jda-complex { --jda-size: 280px; --jda-r: 114px }
        @media (min-width: 768px) { .jda-complex { --jda-size: 360px; --jda-r: 154px } }

        .jda-complex-stage {
          position: relative;
          width: var(--jda-size); height: var(--jda-size);
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        /* Markaziy ion */
        .jda-core {
          position: absolute; top: 50%; left: 50%;
          width: 84px; height: 84px; margin: -42px;
          border-radius: 50%;
          background: radial-gradient(circle at 32% 28%, #fde68a, #f59e0b 45%, #c2410c 100%);
          box-shadow: 0 0 34px rgba(251,146,60,.55), inset 0 0 18px rgba(120,53,15,.5);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          z-index: 5;
          animation: jda-core-pulse 4s ease-in-out infinite;
        }
        .jda-core-label { font-weight: 800; font-size: 24px; color: #451a03; line-height: 1 }
        .jda-core-charge { font-size: 11px; font-weight: 700; color: #7c2d12 }
        @keyframes jda-core-pulse {
          0%,100% { box-shadow: 0 0 30px rgba(251,146,60,.45), inset 0 0 18px rgba(120,53,15,.5) }
          50%     { box-shadow: 0 0 52px rgba(251,146,60,.75), inset 0 0 18px rgba(120,53,15,.5) }
        }

        /* Elektron buluti */
        .jda-core-halo {
          position: absolute; top: 50%; left: 50%;
          width: 150px; height: 150px; margin: -75px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(250,204,21,.13), transparent 68%);
          z-index: 4;
          animation: jda-breathe 5s ease-in-out infinite;
        }

        /* Halqalar */
        .jda-ring-tilt {
          position: absolute; inset: 26px;
          transform-style: preserve-3d;
        }
        .jda-tilt-a { transform: rotateX(74deg) }
        .jda-tilt-b { transform: rotateX(74deg) rotateY(60deg) }
        .jda-tilt-c { transform: rotateX(74deg) rotateY(120deg) }

        .jda-ring {
          position: absolute; inset: 0;
          border: 1px dashed rgba(196,181,253,.28);
          border-radius: 50%;
          transform-style: preserve-3d;
        }
        .jda-spin-slow { animation: jda-orbit 16s linear infinite }
        .jda-spin-mid  { animation: jda-orbit 12s linear infinite reverse }
        .jda-spin-fast { animation: jda-orbit  9s linear infinite }
        @keyframes jda-orbit { from { transform: rotateZ(0deg) } to { transform: rotateZ(360deg) } }

        /* Ligandlar */
        .jda-ligand {
          position: absolute; top: 50%; left: 50%;
          width: 46px; height: 46px; margin: -23px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #ddd6fe;
          background: linear-gradient(145deg, rgba(126,34,206,.92), rgba(30,58,138,.92));
          border: 1px solid rgba(196,181,253,.42);
          box-shadow: 0 0 16px rgba(147,51,234,.4);
          backdrop-filter: blur(2px);
        }

        /* ═══ Harakatni kamaytirish rejimi ═══ */
        @media (prefers-reduced-motion: reduce) {
          .jda-shimmer, .jda-breathe, .jda-logo-mark,
          .jda-ticker, .jda-core, .jda-core-halo,
          .jda-spin-slow, .jda-spin-mid, .jda-spin-fast {
            animation: none !important;
          }
          [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important }
        }
      `}</style>

    </main>
  )
}

/* ═══════════════════════════════════════════════════ */
/* Scroll bo'yicha ochilish (barcha [data-reveal] uchun) */
/* ═══════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!els.length) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      els.forEach(el => el.classList.add('jda-revealed'))
      return
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('jda-revealed')
          io.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })

    els.forEach(el => io.observe(el))

    // Zaxira: fon tabida (document.hidden) IntersectionObserver umuman ishlamaydi —
    // bunda kontent opacity:0 holida ko'rinmay qolmasligi uchun majburan ochamiz.
    const fallback = setTimeout(() => {
      els.forEach(el => el.classList.add('jda-revealed'))
      io.disconnect()
    }, 1500)

    return () => {
      clearTimeout(fallback)
      io.disconnect()
    }
  }, [])
}

/* ═══════════════════════════════════════════════════ */
/* Ko'rinishga kirganda raqamni sanab chiqadigan stat    */
/* ═══════════════════════════════════════════════════ */
function CountUp({ value, duration = 1300 }) {
  const match = /^(\d+)(.*)$/.exec(value)
  const target = match ? parseInt(match[1], 10) : null
  const suffix = match ? match[2] : ''

  const [display, setDisplay] = useState(target === null ? value : `0${suffix}`)
  const ref = useRef(null)

  useEffect(() => {
    if (target === null) return
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setDisplay(`${target}${suffix}`)
      return
    }

    let frame = null
    let animating = false

    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return
      io.disconnect()
      animating = true

      const started = performance.now()
      const step = (now) => {
        const progress = Math.min((now - started) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(`${Math.round(target * eased)}${suffix}`)
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }, { threshold: 0.4 })

    io.observe(el)

    // Zaxira: fon tabida IntersectionObserver ham, requestAnimationFrame ham
    // ishlamaydi — raqam "0+" bo'lib qotib qolmasligi uchun oxirgi qiymatni qo'yamiz.
    const fallback = setTimeout(() => {
      if (!animating) {
        io.disconnect()
        setDisplay(`${target}${suffix}`)
      }
    }, 1500)

    return () => {
      clearTimeout(fallback)
      io.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [target, suffix, duration])

  return <span ref={ref}>{display}</span>
}

/* ═══════════════════════════════════════════════════ */
/* Kursor nuri bilan yoritiladigan bo'lim kartasi        */
/* ═══════════════════════════════════════════════════ */
function SpotlightCard({
  href, className = '', glow, index, indexClass, icon, iconSize = 'text-5xl',
  title, desc, tags = [], featuredTag, delay = 0,
}) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--jda-mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--jda-my', `${e.clientY - rect.top}px`)
  }

  return (
    <Link
      href={href}
      onMouseMove={handleMouseMove}
      data-reveal
      style={{ '--jda-delay': `${delay}ms` }}
      className={`jda-spotlight group bg-gradient-to-br ${className} border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden`}
    >
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 ${glow}`}></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`${iconSize} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
            {icon}
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg ${indexClass}`}>
            {index}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>
        <p className="text-purple-200 text-sm mb-4 leading-relaxed max-w-md">
          {desc}
        </p>

        {(tags.length > 0 || featuredTag) && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                {tag}
              </span>
            ))}
            {featuredTag && (
              <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border border-yellow-500/50 rounded-full text-yellow-300 font-semibold flex items-center gap-1">
                <span>{featuredTag.icon}</span>
                <span>{featuredTag.label}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
