"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import OquvHeader from "@/components/oquv/OquvHeader"

const MAVZULAR = [
  {
    id: "verner",
    href: "/oquv/nomlanishi/verner",
    icon: "🏛️",
    title: "Verner nazariyasi",
    desc: "Alfred Verner (1866–1919) • Kompleks tuzilishi • Asosiy va qo'shimcha valentlik",
    stats: ["1893 yil", "Nobel 1913", "Koordinatsion son"],
    step: 1
  },
  {
    id: "formula",
    href: "/oquv/nomlanishi/formula",
    icon: "📝",
    title: "Formula yozish",
    desc: "Ichki va tashqi sfera • Ligandlar ketma-ketligi • Ambidentat ligandlar",
    stats: ["Markaziy atom", "Ligandlar", "Tashqi sfera"],
    step: 2
  },
  {
    id: "iupac",
    href: "/oquv/nomlanishi/iupac",
    icon: "📖",
    title: "IUPAC nomlanishi",
    desc: "11 ta asosiy qoida • Kation va anion tartibi • Grekcha prefikslar",
    stats: ["11 qoida", "Prefikslar", "Oksidlanish darajasi"],
    step: 3
  },
  {
    id: "ligandlar",
    href: "/oquv/nomlanishi/ligandlar",
    icon: "🧩",
    title: "Ligandlar",
    desc: "5.3-jadval • Anion va neytral ligandlar • Polidentat ligandlar",
    stats: ["Anion ligandlar", "Neytral ligandlar", "Xelat"],
    step: 4
  },
  {
    id: "anion",
    href: "/oquv/nomlanishi/anion",
    icon: "⚛️",
    title: "Anion komplekslar",
    desc: "5.4-jadval • Lotincha nomlar • \"at\" qo'shimchasi",
    stats: ["Lotincha nomlar", "Ferrate", "Cuprate"],
    step: 5
  }
]

const MOTIVATIONAL = [
  "Har bir kimyogar birinchi qadamdan boshlagan! 🌟",
  "Bugun o'rgangan narsangiz ertaga kashfiyotga aylanadi! 🚀",
  "Xato qilish — o'rganishning eng yaxshi usuli! 💪",
  "Koordinatsion kimyo — 130 yillik sarguzasht! 📚",
]

export default function Nomlanishi() {
  const [completedSteps, setCompletedSteps] = useState([])
  const [motivationalIndex, setMotivationalIndex] = useState(0)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nomlanishi-progress")
      if (saved) {
        setCompletedSteps(JSON.parse(saved))
      }
    } catch {}
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setMotivationalIndex((prev) => (prev + 1) % MOTIVATIONAL.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const toggleComplete = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setCompletedSteps((prev) => {
      const next = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      try {
        localStorage.setItem("nomlanishi-progress", JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const progressPercent = Math.round((completedSteps.length / MAVZULAR.length) * 100)

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--v3-fon)",
        color: "var(--v3-matn)"
      }}
    >
      {/* ═══ HEADER ═══ */}
      <OquvHeader
        sarlavha="Nomlanishi"
        tavsif="Kompleks birikmalarning IUPAC qoidalari asosida nomlanishi • 5 ta asosiy mavzu"
        ikon="📖"
        nishon="01-BOSQICH"
        yol={[{ nom: "Nomlanishi" }]}
        ongTaraf={
          <div className="flex items-center gap-3">
            <div
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold"
              style={{
                background: "var(--v3-yuza)",
                borderColor: "var(--v3-chiziq)"
              }}
            >
              <span className="v3-xira">Progress:</span>
              <div
                className="w-20 h-2 rounded-full overflow-hidden"
                style={{ background: "var(--v3-fon-2)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressPercent}%`,
                    background: "var(--v3-urgu)"
                  }}
                />
              </div>
              <span style={{ color: "var(--v3-urgu)" }}>{progressPercent}%</span>
            </div>
            <Link
              href="/oquv"
              className="px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-colors hover:opacity-80"
              style={{
                background: "var(--v3-yuza)",
                borderColor: "var(--v3-chiziq)",
                color: "var(--v3-matn)"
              }}
            >
              ← O&apos;quv
            </Link>
          </div>
        }
      />

      <main className="v3-konteyner py-8 md:py-12 space-y-10 flex-1">
        {/* ═══ HERO ═══ */}
        <div
          className="relative rounded-3xl p-6 sm:p-10 border overflow-hidden shadow-sm"
          style={{
            background: "color-mix(in srgb, var(--v3-fon-2) 80%, var(--v3-yuza))",
            borderColor: "var(--v3-chiziq)"
          }}
        >
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{ background: "var(--v3-nur-1)" }}
          />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              <span>Kompleks birikmalarni nomlash</span>
              <br />
              <span className="v3-xira text-xl sm:text-2xl md:text-3xl font-medium">
                xalqaro IUPAC standartlari bo&apos;yicha
              </span>
            </h2>

            <p className="v3-xira text-sm sm:text-base max-w-3xl mb-6 leading-relaxed">
              Bu bo&apos;limda kompleks birikmalarni <strong style={{ color: "var(--v3-urgu)" }}>IUPAC xalqaro qoidalari</strong> asosida to&apos;g&apos;ri o&apos;qish va yozishni o&apos;rganasiz.
              Har bir mavzu qadamma-qadam, tushunarli va amaliy misollar bilan berilgan.
            </p>

            <div
              className="rounded-2xl p-4 border text-center text-xs sm:text-sm font-medium transition-all"
              style={{
                background: "var(--v3-yuza)",
                borderColor: "var(--v3-chiziq)",
                color: "var(--v3-matn)"
              }}
            >
              <p>{MOTIVATIONAL[motivationalIndex]}</p>
            </div>
          </div>
        </div>

        {/* ═══ MAVZULAR RO'YXATI ═══ */}
        <div className="space-y-4">
          {MAVZULAR.map((m) => {
            const isCompleted = completedSteps.includes(m.id)

            return (
              <div key={m.id} className="relative">
                <Link
                  href={m.href}
                  className="group block rounded-2xl p-5 sm:p-6 border transition-all hover:scale-[1.01]"
                  style={{
                    background: "var(--v3-yuza)",
                    borderColor: isCompleted
                      ? "color-mix(in srgb, var(--v3-urgu) 50%, var(--v3-chiziq))"
                      : "var(--v3-chiziq)"
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Bosqich raqami va ikonkasi */}
                    <div className="relative shrink-0">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl border transition-transform group-hover:scale-110 shadow-xs"
                        style={{
                          background: "var(--v3-yuza-2)",
                          borderColor: "var(--v3-chiziq)"
                        }}
                      >
                        {m.icon}
                      </div>
                      <div
                        className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{
                          background: "var(--v3-urgu)",
                          color: "var(--v3-urgu-matn)"
                        }}
                      >
                        {m.step}
                      </div>
                    </div>

                    {/* Mazmun */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-base sm:text-lg font-bold transition-colors group-hover:opacity-90"
                        style={{ color: "var(--v3-matn)" }}
                      >
                        {m.title}
                      </h3>
                      <p className="v3-xira text-xs sm:text-sm mt-1 mb-3 leading-relaxed">
                        {m.desc}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {m.stats.map((stat, j) => (
                          <span
                            key={j}
                            className="text-[11px] px-2.5 py-0.5 rounded-full border"
                            style={{
                              background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
                              borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))",
                              color: "var(--v3-urgu)"
                            }}
                          >
                            {stat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Harakat tugmalari */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all group-hover:translate-x-1"
                        style={{
                          background: isCompleted ? "var(--v3-urgu)" : "var(--v3-yuza-2)",
                          color: isCompleted ? "var(--v3-urgu-matn)" : "var(--v3-matn)"
                        }}
                      >
                        {isCompleted ? "✓" : "→"}
                      </div>
                      <button
                        onClick={(e) => toggleComplete(m.id, e)}
                        className="text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors"
                        style={{
                          background: isCompleted
                            ? "color-mix(in srgb, var(--v3-urgu) 15%, transparent)"
                            : "var(--v3-yuza)",
                          borderColor: isCompleted
                            ? "color-mix(in srgb, var(--v3-urgu) 30%, transparent)"
                            : "var(--v3-chiziq)",
                          color: isCompleted ? "var(--v3-urgu)" : "var(--v3-xira)"
                        }}
                      >
                        {isCompleted ? "✅ Bajarildi" : "☐ Belgilash"}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        {/* ═══ QANDAY BOSHLASH ═══ */}
        <div
          className="rounded-2xl p-6 sm:p-8 border shadow-sm"
          style={{
            background: "var(--v3-yuza)",
            borderColor: "var(--v3-chiziq)"
          }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
            <span>🚀</span>
            <span>Qanday o&apos;rganish kerak?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-3">
              <h3 className="font-bold text-sm" style={{ color: "var(--v3-urgu)" }}>
                📖 O&apos;rganish tartibi
              </h3>
              <ol className="space-y-2.5">
                {[
                  ["Verner nazariyasi", "kimyoning poydevori"],
                  ["Formula yozish", "sferalarni to'g'ri ajratish"],
                  ["IUPAC qoidalari", "11 ta qoidani yod olish"],
                  ["Jadvallar", "ligandlar va anionlar lotincha nomlari"],
                ].map(([bosh, izoh], i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                      style={{
                        background: "color-mix(in srgb, var(--v3-urgu) 18%, transparent)",
                        color: "var(--v3-urgu)"
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <strong style={{ color: "var(--v3-matn)" }}>{bosh}</strong> —{" "}
                      <span className="v3-xira">{izoh}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm" style={{ color: "var(--v3-matn)" }}>
                💡 Foydalanilgan manbalar
              </h3>
              <div className="space-y-2">
                {[
                  { title: "A.M. Nasimov, X.Sh. Tashpulatov", desc: "Noorganik kimyoning tanlangan boblari (5.1-5.2)" },
                  { title: "IUPAC Recommendations 2005/2020", desc: "Nomenclature of Inorganic Chemistry" },
                  { title: "Cotton & Wilkinson", desc: "Advanced Inorganic Chemistry" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-3.5 py-2.5 border"
                    style={{
                      background: "var(--v3-yuza-2)",
                      borderColor: "var(--v3-chiziq)"
                    }}
                  >
                    <div className="font-semibold text-xs" style={{ color: "var(--v3-urgu)" }}>
                      {item.title}
                    </div>
                    <div className="v3-xira text-[11px] mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ CTA ═══ */}
        <div
          className="rounded-2xl p-8 text-center border overflow-hidden shadow-sm"
          style={{
            background: "color-mix(in srgb, var(--v3-fon-2) 70%, var(--v3-yuza))",
            borderColor: "var(--v3-chiziq)"
          }}
        >
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--v3-matn)" }}>
            Tayyormisiz? Birinchi mavzudan boshlaymiz!
          </h2>
          <p className="v3-xira text-xs sm:text-sm mb-6 max-w-xl mx-auto">
            <strong style={{ color: "var(--v3-urgu)" }}>Verner nazariyasi</strong> — kompleks birikmalar kimyosining alifbosi.
          </p>
          <Link
            href="/oquv/nomlanishi/verner"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-md"
            style={{
              background: "var(--v3-urgu)",
              color: "var(--v3-urgu-matn)"
            }}
          >
            <span>🏛️ Verner nazariyasidan boshlash</span>
            <span>→</span>
          </Link>
        </div>

        {/* ═══ NAVIGATION ═══ */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <Link
            href="/oquv"
            className="px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors hover:opacity-80"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)"
            }}
          >
            ← O&apos;quv bo&apos;limi
          </Link>
          <Link
            href="/oquv/klassifikatsiyasi"
            className="px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors hover:opacity-80"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)"
            }}
          >
            Klassifikatsiyasi →
          </Link>
        </div>
      </main>

      <footer
        className="border-t py-8 mt-12"
        style={{ borderColor: "var(--v3-chiziq)" }}
      >
        <div className="v3-konteyner text-center text-xs v3-xira">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo ta&apos;lim portali</p>
          <p className="mt-1 opacity-70">
            Nomlanishi • 5 ta mavzu • IUPAC qoidalari • 11 ta qoida
          </p>
        </div>
      </footer>
    </div>
  )
}