"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

// ═══════════════════════════════════════════════════════════
// O'QUV BOSQICHLARI
// Raqamlar (mavzular, 3D modellar) haqiqiy sahifalar soniga mos —
// qo'lda yozilgan "50+ mavzu" kabi taxminlar eskirib qolgandi.
// ═══════════════════════════════════════════════════════════
const BOSQICHLAR = [
  {
    id: "nomlanishi",
    href: "/oquv/nomlanishi",
    icon: "📖",
    title: "Nomlanishi",
    desc: "IUPAC qoidalari, formula yozish, ligandlar",
    nima: "Kimyoning alifbosi — birikmani to'g'ri o'qish va yozish",
    mavzular: 6,
    uchD: 0,
    accent: "emerald",
  },
  {
    id: "klassifikatsiyasi",
    href: "/oquv/klassifikatsiyasi",
    icon: "🗂️",
    title: "Klassifikatsiyasi",
    desc: "Sinf, ligand va zaryad bo'yicha tasniflash",
    nima: "Minglab birikmani tizimga solish",
    mavzular: 21,
    uchD: 0,
    accent: "cyan",
  },
  {
    id: "fazoviy",
    href: "/oquv/fazoviy",
    icon: "💎",
    title: "Fazoviy tuzilishi",
    desc: "Geometrik shakllar, VSEPR, 3D modellar",
    nima: "KS=2 dan KS=12 gacha — molekulani fazoda ko'rish",
    mavzular: 36,
    uchD: 17,
    accent: "amber",
  },
  {
    id: "izomeriyasi",
    href: "/oquv/izomeriyasi",
    icon: "🔄",
    title: "Izomeriyasi",
    desc: "Tuzilish va stereoizomeriya turlari",
    nima: "Bir xil formula, boshqa xossalar — nega?",
    mavzular: 26,
    uchD: 11,
    accent: "pink",
  },
  {
    id: "kimyoviy-boglanish",
    href: "/oquv/kimyoviy-boglanish",
    icon: "🔗",
    title: "Kimyoviy bog'lanish",
    desc: "VB nazariyasi, kristall maydon, Yan-Teller",
    nima: "Rang, magnetizm va barqarorlik qayerdan keladi",
    mavzular: 5,
    uchD: 0,
    accent: "orange",
  },
  {
    id: "video-darsliklar",
    href: "/oquv/video-darsliklar",
    icon: "🎯",
    title: "Video va testlar",
    desc: "Barcha mavzular bo'yicha amaliy sinov",
    nima: "Bilimni mustahkamlash va o'zini tekshirish",
    mavzular: 13,
    uchD: 0,
    accent: "violet",
    isTest: true,
  },
]

// Tailwind sinflari TO'LIQ yozilishi shart — `text-${rang}-400` kabi dinamik
// birlashtirish purge'da yo'qoladi, chunki Tailwind faylni matn sifatida skanerlaydi
const ACCENT = {
  emerald: { text: "text-emerald-400", hover: "group-hover:text-emerald-400", ring: "stroke-emerald-400", border: "hover:border-emerald-400/60", chip: "bg-emerald-500/15 text-emerald-300" },
  cyan:    { text: "text-cyan-400",    hover: "group-hover:text-cyan-400",    ring: "stroke-cyan-400",    border: "hover:border-cyan-400/60",    chip: "bg-cyan-500/15 text-cyan-300" },
  amber:   { text: "text-amber-400",   hover: "group-hover:text-amber-400",   ring: "stroke-amber-400",   border: "hover:border-amber-400/60",   chip: "bg-amber-500/15 text-amber-300" },
  pink:    { text: "text-pink-400",    hover: "group-hover:text-pink-400",    ring: "stroke-pink-400",    border: "hover:border-pink-400/60",    chip: "bg-pink-500/15 text-pink-300" },
  orange:  { text: "text-orange-400",  hover: "group-hover:text-orange-400",  ring: "stroke-orange-400",  border: "hover:border-orange-400/60",  chip: "bg-orange-500/15 text-orange-300" },
  violet:  { text: "text-violet-400",  hover: "group-hover:text-violet-400",  ring: "stroke-violet-400",  border: "hover:border-violet-400/60",  chip: "bg-violet-500/15 text-violet-300" },
}

const JAMI_MAVZU = BOSQICHLAR.reduce((s, b) => s + b.mavzular, 0)
const JAMI_3D = BOSQICHLAR.reduce((s, b) => s + b.uchD, 0)

export default function OquvPage() {
  // Progress endi haqiqiy quiz natijalaridan keladi (/api/oquv/progress).
  // Avval localStorage'dan o'qilardi, lekin unga hech kim yozmagani uchun
  // har doim 0% ko'rsatardi.
  const [progress, setProgress] = useState({})
  const [signedIn, setSignedIn] = useState(false)
  const [yuklandi, setYuklandi] = useState(false)

  useEffect(() => {
    let bekor = false
    fetch("/api/oquv/progress")
      .then((r) => r.json())
      .then((d) => {
        if (bekor) return
        setProgress(d.progress || {})
        setSignedIn(Boolean(d.signedIn))
      })
      .catch(() => {})
      .finally(() => { if (!bekor) setYuklandi(true) })
    return () => { bekor = true }
  }, [])

  const olchanganlar = Object.values(progress)
  const umumiy = olchanganlar.length
    ? Math.round(olchanganlar.reduce((s, v) => s + v, 0) / olchanganlar.length)
    : 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      {/* ═══ HEADER ═══ */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <span className="text-yellow-400 font-semibold">O&apos;quv bo&apos;limi</span>
          </nav>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <span className="text-3xl">📚</span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                O&apos;quv bo&apos;limi
              </span>
            </h1>
            <Link href="/ilmiy" className="hidden sm:inline-block text-xs bg-purple-800/60 hover:bg-purple-700/70 border border-purple-600/50 text-purple-200 px-4 py-2 rounded-lg transition-colors">
              🔬 Ilmiy bo&apos;lim →
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* ═══ HERO ═══ */}
        <div className="relative bg-gradient-to-br from-purple-900/60 to-blue-900/50 border border-purple-700/50 rounded-3xl p-6 sm:p-10 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-800/50 border border-purple-600/50 rounded-full text-[11px] font-semibold text-purple-200 mb-5">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              6 bosqichli yo&apos;l
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-[1.1]">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Kompleks birikmalar
              </span>
              <br />
              <span className="text-white text-xl sm:text-2xl md:text-3xl">
                noldan professionallargacha
              </span>
            </h2>

            <p className="text-purple-200 max-w-2xl mb-7 leading-relaxed text-sm sm:text-base">
              Nomlashdan boshlab kimyoviy bog&apos;lanish nazariyalarigacha —
              har bosqich interaktiv modellar va amaliy misollar bilan.
            </p>

            {/* Haqiqiy statistika */}
            <div className="grid grid-cols-3 gap-3 max-w-lg">
              {[
                { son: JAMI_MAVZU, label: "mavzu" },
                { son: JAMI_3D, label: "3D model" },
                { son: BOSQICHLAR.length, label: "bosqich" },
              ].map((s) => (
                <div key={s.label} className="bg-purple-950/50 border border-purple-700/40 rounded-2xl px-3 py-3 text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-yellow-400">{s.son}</div>
                  <div className="text-[11px] text-purple-300 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ PROGRESS ═══ */}
        {yuklandi && (
          signedIn ? (
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3 gap-3">
                <div>
                  <div className="font-bold text-white text-sm sm:text-base">Sizning natijangiz</div>
                  <div className="text-purple-400 text-xs">
                    {olchanganlar.length > 0
                      ? `${olchanganlar.length} ta mavzuda test topshirilgan`
                      : "Hali test topshirmadingiz"}
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-yellow-400">{umumiy}%</div>
              </div>
              <div className="w-full h-2.5 bg-purple-950/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-700"
                  style={{ width: `${umumiy}%` }}
                />
              </div>
              <p className="text-[11px] text-purple-500 mt-2">
                Natija har mavzudagi eng yaxshi test ballingizdan hisoblanadi
              </p>
            </div>
          ) : (
            <div className="bg-purple-900/20 border border-purple-700/40 border-dashed rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <div className="font-semibold text-white text-sm">📊 Progressni kuzatib boring</div>
                <div className="text-purple-400 text-xs mt-0.5">
                  Tizimga kirsangiz, har mavzu bo&apos;yicha natijangiz shu yerda ko&apos;rinadi
                </div>
              </div>
              <Link
                href="/login"
                className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl text-sm text-center"
              >
                Kirish
              </Link>
            </div>
          )
        )}

        {/* ═══ YO'L XARITASI ═══ */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">O&apos;quv yo&apos;li</h2>
          <p className="text-purple-400 text-sm mb-6">
            Ketma-ket borish tavsiya etiladi — har bosqich oldingisiga tayanadi
          </p>

          <div className="relative">
            {/* Bosqichlarni bog'lovchi chiziq */}
            <div
              className="absolute left-[26px] sm:left-[30px] top-4 bottom-4 w-px bg-gradient-to-b from-emerald-400/40 via-amber-400/40 to-violet-400/40"
              aria-hidden="true"
            />

            <ol className="space-y-4">
              {BOSQICHLAR.map((b, i) => {
                const a = ACCENT[b.accent]
                const foiz = progress[b.id]
                const bor = typeof foiz === "number"

                return (
                  <li key={b.id} className="relative">
                    <Link
                      href={b.href}
                      className={`group flex gap-4 sm:gap-5 bg-purple-900/30 border border-purple-700/50 ${a.border} rounded-2xl p-4 sm:p-5 transition-all hover:bg-purple-900/50`}
                    >
                      {/* Bosqich raqami + progress halqasi */}
                      <div className="relative shrink-0 w-[52px] sm:w-[60px] flex justify-center">
                        <div className="relative">
                          <svg className="-rotate-90" width="52" height="52" viewBox="0 0 52 52">
                            <circle cx="26" cy="26" r="23" fill="rgb(59 7 100 / 0.6)" className="stroke-purple-800" strokeWidth="2" />
                            {bor && (
                              <circle
                                cx="26" cy="26" r="23" fill="none"
                                className={a.ring}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 23}
                                strokeDashoffset={2 * Math.PI * 23 * (1 - foiz / 100)}
                                style={{ transition: "stroke-dashoffset .7s ease" }}
                              />
                            )}
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {bor ? (
                              <span className={`text-xs font-bold ${a.text}`}>{foiz}%</span>
                            ) : (
                              <span className="text-lg">{b.icon}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Mazmun */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.chip}`}>
                            {b.isTest ? "SINOV" : `${i + 1}-BOSQICH`}
                          </span>
                          {b.uchD > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-700/50 text-purple-300">
                              {b.uchD} ta 3D
                            </span>
                          )}
                        </div>

                        <h3 className={`text-base sm:text-lg font-bold text-white ${a.hover} transition-colors`}>
                          {b.title}
                        </h3>
                        <p className="text-purple-300 text-xs sm:text-sm mt-0.5">{b.desc}</p>
                        <p className="text-purple-500 text-[11px] mt-1.5 italic">{b.nima}</p>

                        <div className="flex items-center gap-3 mt-3 text-xs">
                          <span className="text-purple-400">{b.mavzular} ta mavzu</span>
                          <span className={`font-semibold ${a.text} group-hover:translate-x-1 transition-transform inline-flex items-center gap-1`}>
                            Ochish →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        {/* ═══ QANDAY O'RGANISH ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-yellow-600/10 to-orange-600/5 border border-yellow-500/25 rounded-2xl p-5 sm:p-6">
            <h3 className="text-base font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <span>🚀</span> Yangi boshlovchiga
            </h3>
            <ol className="space-y-2.5">
              {[
                ["Nomlanishi", "birikmani o'qishni o'rganing"],
                ["Klassifikatsiyasi", "turlarga ajratishni tushuning"],
                ["Fazoviy tuzilishi", "3D modellarda ko'ring"],
                ["Har bosqichdan keyin", "testni yeching"],
              ].map(([bosh, izoh], i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-[10px] font-bold text-yellow-400 shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-purple-200">
                    <strong className="text-white">{bosh}</strong> — {izoh}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5 sm:p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span>💡</span> Samarali o&apos;rganish
            </h3>
            <div className="space-y-2.5">
              {[
                ["📅", "Har kuni 30–60 daqiqa", "Bir kunda 5 soatdan ko'ra, har kuni ozdan samaraliroq"],
                ["✍️", "Qo'lda yozing", "Formulalarni qog'ozga ko'chiring — esda yaxshiroq qoladi"],
                ["🔄", "1 · 3 · 7 kun qoidasi", "Yangi mavzuni shu kunlarda takrorlang"],
              ].map(([icon, bosh, izoh]) => (
                <div key={bosh} className="bg-purple-950/50 rounded-xl p-3 flex gap-3">
                  <span className="text-lg shrink-0">{icon}</span>
                  <div className="min-w-0">
                    <div className="text-yellow-400 font-semibold text-sm">{bosh}</div>
                    <div className="text-purple-300 text-xs mt-0.5">{izoh}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ CTA ═══ */}
        <div className="relative bg-gradient-to-r from-purple-900/50 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 sm:p-8 text-center overflow-hidden">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Birinchi bosqichdan boshlaymiz
            </h2>
            <p className="text-purple-300 text-sm mb-6 max-w-xl mx-auto">
              <strong className="text-yellow-400">Nomlanishi</strong> — kompleks
              birikmalar kimyosining alifbosi. Boshqa hamma narsa shunga tayanadi.
            </p>
            <Link
              href="/oquv/nomlanishi"
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-xl text-black font-bold transition-all transform hover:-translate-y-1 shadow-xl shadow-orange-500/20"
            >
              📖 Nomlanishidan boshlash
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* ═══ NAVIGATSIYA ═══ */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
          <Link href="/" className="px-6 py-3 border border-purple-600/50 rounded-xl hover:bg-purple-800/40 text-purple-300 text-center text-sm transition-colors">
            ← Bosh sahifa
          </Link>
          <Link href="/ilmiy" className="px-6 py-3 bg-purple-800/60 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-white font-semibold text-center text-sm transition-colors">
            🔬 Ilmiy bo&apos;lim →
          </Link>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo ta&apos;lim portali</p>
          <p className="mt-1">
            O&apos;quv bo&apos;limi • {BOSQICHLAR.length} bosqich • {JAMI_MAVZU} mavzu • {JAMI_3D} interaktiv 3D model
          </p>
        </div>
      </footer>
    </main>
  )
}
