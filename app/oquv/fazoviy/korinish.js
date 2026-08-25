"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import OquvHeader from "@/components/oquv/OquvHeader"

const SHAKLLAR = [
  // ── KS=2 ──
  {
    ks: 2,
    href: "/oquv/fazoviy/chiziqli",
    icon: "📏",
    title: "Chiziqli",
    desc: "KS=2 • 180° burchak • D_∞h simmetriya",
    gibrid: "sp (oddiy) yoki sd (o'tish metallari)",
    misollar: ["[Ag(NH₃)₂]⁺", "[AuCl₂]⁻", "BeCl₂"],
    badge: "KS=2",
    has3D: true,
    featured: true
  },
  // ── KS=3 ──
  {
    ks: 3,
    href: "/oquv/fazoviy/uchburchak",
    icon: "📐",
    title: "Uchburchak tekislik",
    desc: "KS=3 • 120° burchak • D₃ₕ simmetriya",
    gibrid: "sp²",
    misollar: ["[Pt(PPh₃)₃]", "[Cu(CN)₃]²⁻", "BF₃"],
    badge: "KS=3",
    has3D: true
  },
  // ── KS=4 ──
  {
    ks: 4,
    href: "/oquv/fazoviy/tetraedrik",
    icon: "🔺",
    title: "Tetraedrik",
    desc: "KS=4 • 109.5° • T_d simmetriya",
    gibrid: "sp³ (asosiy guruh) • sd³ (o'tish metallari)",
    misollar: ["[CoCl₄]²⁻", "[Zn(OH)₄]²⁻", "[Ni(CO)₄]"],
    badge: "KS=4",
    has3D: true,
    featured: true
  },
  {
    ks: 4,
    href: "/oquv/fazoviy/tekis-kvadrat",
    icon: "◻️",
    title: "Tekis kvadrat",
    desc: "KS=4 • 90° • D₄ₕ simmetriya",
    gibrid: "dsp² (d⁸ konfiguratsiyalar)",
    misollar: ["[PtCl₄]²⁻", "cis-[Pt(NH₃)₂Cl₂]", "[Ni(CN)₄]²⁻", "[Cu(NH₃)₄]²⁺"],
    badge: "KS=4",
    has3D: true,
    featured: true
  },
  // ── KS=5 ──
  {
    ks: 5,
    href: "/oquv/fazoviy/trigonal-bipiramida",
    icon: "🔷",
    title: "Trigonal bipiramida",
    desc: "KS=5 • 90°/120° • D₃ₕ simmetriya",
    gibrid: "dsp³ (d_z² ishtirokida)",
    misollar: ["[Fe(CO)₅]", "[CuCl₅]³⁻", "PCl₅"],
    badge: "KS=5",
    has3D: true
  },
  {
    ks: 5,
    href: "/oquv/fazoviy/kvadrat-piramida",
    icon: "🏛️",
    title: "Kvadrat piramida",
    desc: "KS=5 • ~90° • C₄ᵥ simmetriya",
    gibrid: "dsp³ (d_x²-y² ishtirokida)",
    misollar: ["[Ni(CN)₅]³⁻", "[VO(acac)₂]", "[InCl₅]²⁻"],
    badge: "KS=5",
    has3D: true
  },
  // ── KS=6 ──
  {
    ks: 6,
    href: "/oquv/fazoviy/oktaedrik",
    icon: "💎",
    title: "Oktaedrik",
    desc: "KS=6 • 90° • Oₕ simmetriya",
    gibrid: "d²sp³ (ichki) yoki sp³d² (tashqi)",
    misollar: ["[Co(NH₃)₆]³⁺", "[Fe(CN)₆]³⁻", "[Cr(H₂O)₆]³⁺", "SF₆"],
    badge: "KS=6",
    has3D: true,
    featured: true
  },
  {
    ks: 6,
    href: "/oquv/fazoviy/trigonal-prizma",
    icon: "⛺",
    title: "Trigonal prizma",
    desc: "KS=6 • D₃ₕ simmetriya • d⁰/d¹/d² tizimlar",
    gibrid: "d²sp³ (trigonal prizmatik)",
    misollar: ["[Re(S₂C₂Ph₂)₃]", "[W(CH₃)₆]", "MoS₂ qatlami"],
    badge: "KS=6",
    has3D: true
  },
  // ── KS=7 ──
  {
    ks: 7,
    href: "/oquv/fazoviy/pentagonal-bipiramida",
    icon: "⭐",
    title: "Pentagonal bipiramida",
    desc: "KS=7 • D₅ₕ simmetriya",
    gibrid: "sp³d³",
    misollar: ["[UO₂(H₂O)₅]²⁺", "IF₇", "[ZrF₇]³⁻"],
    badge: "KS=7",
    has3D: true
  },
  {
    ks: 7,
    href: "/oquv/fazoviy/monoyopiq-prizma",
    icon: "🏰",
    title: "Monoyopiq trigonal prizma",
    desc: "KS=7 • C₂ᵥ simmetriya",
    gibrid: "sp³d³",
    misollar: ["[TaF₇]²⁻", "[NbF₇]²⁻"],
    badge: "KS=7",
    has3D: true
  },
  // ── KS=8 ──
  {
    ks: 8,
    href: "/oquv/fazoviy/kubsimon",
    icon: "🧊",
    title: "Kubsimon",
    desc: "KS=8 • Oₕ simmetriya • f-metallarda",
    gibrid: "sp³d³f (kam uchraydi)",
    misollar: ["[UF₈]⁴⁻", "[Th(C₂O₄)₄]⁴⁻"],
    badge: "KS=8",
    has3D: true
  },
  {
    ks: 8,
    href: "/oquv/fazoviy/kvadrat-antiprizma",
    icon: "💠",
    title: "Kvadrat antiprizma",
    desc: "KS=8 • D₄_d simmetriya • Eng barqaror KS=8",
    gibrid: "sp³d⁴",
    misollar: ["[TaF₈]³⁻", "[Zr(C₂O₄)₄]⁴⁻", "[Mo(CN)₈]⁴⁻"],
    badge: "KS=8",
    has3D: true,
    featured: true
  },
  {
    ks: 8,
    href: "/oquv/fazoviy/dodekaedrik",
    icon: "🔮",
    title: "Dodekaedrik (D₂_d)",
    desc: "KS=8 • D₂_d simmetriya • 8 ta uchburchak yoq",
    gibrid: "sp³d⁴",
    misollar: ["[Mo(CN)₈]³⁻", "[Zr(acac)₄]"],
    badge: "KS=8",
    has3D: true
  },
  // ── KS=9 ──
  {
    ks: 9,
    href: "/oquv/fazoviy/uch-yoqli-prizma",
    icon: "🎯",
    title: "Uch yoqli yopiq prizma",
    desc: "KS=9 • D₃ₕ simmetriya • Lantanoidlar",
    gibrid: "sp³d⁵",
    misollar: ["[ReH₉]²⁻", "[Nd(H₂O)₉]³⁺", "[La(H₂O)₉]³⁺"],
    badge: "KS=9",
    has3D: true
  },
  // ── KS=10 ──
  {
    ks: 10,
    href: "/oquv/fazoviy/ikki-yoqli-antiprizma",
    icon: "🎖️",
    title: "Ikki yoqli yopiq antiprizma",
    desc: "KS=10 • D₄_d simmetriya • Aktinoidlar",
    gibrid: "sp³d⁵f",
    misollar: ["[Th(NO₃)₅]²⁻", "[Ce(NO₃)₅]²⁻"],
    badge: "KS=10",
    has3D: true
  },
  // ── KS=12 ──
  {
    ks: 12,
    href: "/oquv/fazoviy/ikosaedrik",
    icon: "🌐",
    title: "Ikosaedrik (Kubooktaedr)",
    desc: "KS=12 • I_h / O_h • Katta kationlar",
    gibrid: "Chelatlovchi NO₃⁻ ligandlar bilan",
    misollar: ["[Ce(NO₃)₆]²⁻", "[Th(NO₃)₆]²⁻"],
    badge: "KS=12",
    has3D: true
  },
  // ── Maxsus ──
  {
    ks: "Maxsus",
    href: "/oquv/fazoviy/sendvich",
    icon: "🥪",
    title: "Sendvich tuzilishi",
    desc: "π-komplekslar • η⁵ va η⁶ ligandlar",
    gibrid: "Organometall π-bog'lanish",
    misollar: ["Fe(C₅H₅)₂ (Ferrosen)", "Cr(C₆H₆)₂", "U(C₈H₈)₂"],
    badge: "π-kompleks",
    has3D: true,
    featured: true
  }
]

export default function FazoviyKorinish() {
  const [qidiruv, setQidiruv] = useState("")
  const [tanlanganKS, setTanlanganKS] = useState("all")
  const [faqat3D, setFaqat3D] = useState(false)

  const ksOptions = ["all", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "Maxsus"]

  const filtrlangan = useMemo(() => {
    return SHAKLLAR.filter((s) => {
      if (faqat3D && !s.has3D) return false
      if (tanlanganKS !== "all" && String(s.ks) !== tanlanganKS) return false
      if (!qidiruv.trim()) return true

      const q = qidiruv.toLowerCase()
      return (
        s.title.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.gibrid.toLowerCase().includes(q) ||
        s.misollar.some((m) => m.toLowerCase().includes(q))
      )
    })
  }, [qidiruv, tanlanganKS, faqat3D])

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--v3-fon)",
        color: "var(--v3-matn)"
      }}
    >
      <OquvHeader
        sarlavha="Fazoviy tuzilishi (Geometriya)"
        tavsif="Koordinatsion soni 2 dan 12 gacha bo'lgan fazoviy geometriyalar, simmetriya guruhlari va 3D modellar"
        ikon="💎"
        nishon="05-BOSQICH"
        yol={[{ nom: "Fazoviy tuzilishi" }]}
        ongTaraf={
          <div className="flex items-center gap-3">
            <Link
              href="/oquv/fazoviy/cpk-ranglar"
              className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors hover:opacity-80"
              style={{
                background: "var(--v3-yuza)",
                borderColor: "var(--v3-chiziq)",
                color: "var(--v3-urgu)"
              }}
            >
              🎨 CPK ranglar
            </Link>
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

      <main className="v3-konteyner py-8 md:py-12 space-y-8 flex-1">
        {/* ═══ QIDIRUV VA FILTRLAR ═══ */}
        <div
          className="rounded-2xl p-6 border shadow-xs space-y-4"
          style={{
            background: "var(--v3-yuza)",
            borderColor: "var(--v3-chiziq)"
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={qidiruv}
                onChange={(e) => setQidiruv(e.target.value)}
                placeholder="Shakl, formula yoki gibridlanish qidirish..."
                className="w-full px-3.5 py-2 pl-9 rounded-xl text-xs sm:text-sm border outline-none"
                style={{
                  background: "var(--v3-yuza-2)",
                  borderColor: "var(--v3-chiziq)",
                  color: "var(--v3-matn)"
                }}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-50">
                🔍
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFaqat3D(!faqat3D)}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all"
                style={{
                  background: faqat3D
                    ? "color-mix(in srgb, var(--v3-urgu) 20%, var(--v3-yuza))"
                    : "var(--v3-yuza-2)",
                  borderColor: faqat3D ? "var(--v3-urgu)" : "var(--v3-chiziq)",
                  color: faqat3D ? "var(--v3-urgu)" : "var(--v3-matn)"
                }}
              >
                {faqat3D ? "✓ Faqat 3D modellar" : "☐ 3D modellar"}
              </button>
            </div>
          </div>

          {/* KS tugmalari */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs v3-xira mr-2 shrink-0">KS:</span>
            {ksOptions.map((ks) => {
              const faol = tanlanganKS === ks
              return (
                <button
                  key={ks}
                  onClick={() => setTanlanganKS(ks)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 border"
                  style={{
                    background: faol ? "var(--v3-urgu)" : "var(--v3-yuza-2)",
                    color: faol ? "var(--v3-urgu-matn)" : "var(--v3-matn)",
                    borderColor: faol ? "var(--v3-urgu)" : "var(--v3-chiziq)"
                  }}
                >
                  {ks === "all" ? "Barchasi" : ks}
                </button>
              )
            })}
          </div>
        </div>

        {/* ═══ SHAKLLAR GRID ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtrlangan.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between hover:scale-[1.02] shadow-xs"
              style={{
                background: "var(--v3-yuza)",
                borderColor: "var(--v3-chiziq)"
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border transition-transform group-hover:scale-110"
                    style={{
                      background: "var(--v3-yuza-2)",
                      borderColor: "var(--v3-chiziq)"
                    }}
                  >
                    {s.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {s.featured && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full border font-bold"
                        style={{
                          background: "color-mix(in srgb, var(--v3-urgu) 15%, transparent)",
                          color: "var(--v3-urgu)",
                          borderColor: "color-mix(in srgb, var(--v3-urgu) 30%, transparent)"
                        }}
                      >
                        ⭐ Muhim
                      </span>
                    )}
                    {s.has3D && <span className="v3-nishon">3D</span>}
                    <span className="v3-nishon">{s.badge}</span>
                  </div>
                </div>

                <h3
                  className="text-base sm:text-lg font-bold transition-colors group-hover:opacity-90 mb-1"
                  style={{ color: "var(--v3-matn)" }}
                >
                  {s.title}
                </h3>
                <p className="v3-xira text-xs leading-relaxed mb-3">
                  {s.desc}
                </p>

                <div
                  className="p-2.5 rounded-xl border font-mono text-[11px] mb-3"
                  style={{
                    background: "var(--v3-yuza-2)",
                    borderColor: "var(--v3-chiziq)",
                    color: "var(--v3-urgu)"
                  }}
                >
                  {s.gibrid}
                </div>

                <div className="flex flex-wrap gap-1">
                  {s.misollar.map((m, j) => (
                    <span
                      key={j}
                      className="text-[10px] px-2 py-0.5 rounded-md border font-mono"
                      style={{
                        background: "var(--v3-yuza-2)",
                        borderColor: "var(--v3-chiziq)"
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="flex items-center justify-end pt-3 mt-5 border-t text-xs font-semibold"
                style={{ borderColor: "var(--v3-chiziq)", color: "var(--v3-urgu)" }}
              >
                3D interaktiv ko&apos;rish →
              </div>
            </Link>
          ))}
        </div>

        {filtrlangan.length === 0 && (
          <div
            className="rounded-2xl p-12 text-center border shadow-xs"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-base font-bold mb-1" style={{ color: "var(--v3-matn)" }}>
              Hech qanday shakl topilmadi
            </h3>
            <p className="v3-xira text-xs mb-4">
              Qidiruv so&apos;zini yoki filtrlarni o&apos;zgartirib ko&apos;ring
            </p>
            <button
              onClick={() => {
                setQidiruv("")
                setTanlanganKS("all")
                setFaqat3D(false)
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold"
              style={{
                background: "var(--v3-urgu)",
                color: "var(--v3-urgu-matn)"
              }}
            >
              Filtrlarni tozalash
            </button>
          </div>
        )}
      </main>
    </div>
  )
}