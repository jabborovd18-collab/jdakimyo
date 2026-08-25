"use client"

import { useState } from "react"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  {
    formula: "[Co(NH₃)₆]Cl₃",
    nom: "Geksaamminkobalt(III) xlorid",
    tahlil: {
      ichki: "[Co(NH₃)₆]³⁺",
      tashqi: "3Cl⁻",
      metall: "Co³⁺ (d⁶)",
      ligandlar: "6 ta NH₃ (neytral monodentat)",
      geometriya: "Muntazam oktaedr",
      rang: "Zarg'aldoq-sariq",
      magnit: "Diamagnit (t₂g⁶ e_g⁰)"
    }
  },
  {
    formula: "[Co(NH₃)₅Cl]Cl₂",
    nom: "Pentaamminkloridokobalt(III) xlorid",
    tahlil: {
      ichki: "[Co(NH₃)₅Cl]²⁺",
      tashqi: "2Cl⁻",
      metall: "Co³⁺ (d⁶)",
      ligandlar: "5 ta NH₃ + 1 ta Cl⁻",
      geometriya: "Oktaedrik (monoqisqargan)",
      rang: "Pushti-binafsha",
      magnit: "Diamagnit"
    }
  },
  {
    formula: "K₃[Fe(CN)₆]",
    nom: "Kaliy geksatsianoferrat(III)",
    tahlil: {
      ichki: "[Fe(CN)₆]³⁻",
      tashqi: "3K⁺",
      metall: "Fe³⁺ (d⁵)",
      ligandlar: "6 ta CN⁻ (kuchli maydon)",
      geometriya: "Oktaedrik",
      rang: "To'q qizil",
      magnit: "Paramagnit (1 ta toq e⁻)"
    }
  },
  {
    formula: "cis-[Pt(NH₃)₂Cl₂]",
    nom: "sis-Diammindixloridoplatina(II) (Sisplatin)",
    tahlil: {
      ichki: "[Pt(NH₃)₂Cl₂]",
      tashqi: "yo'q (neytral kompleks)",
      metall: "Pt²⁺ (d⁸)",
      ligandlar: "2 ta NH₃ + 2 ta Cl⁻",
      geometriya: "Tekis-kvadrat (Square planar)",
      rang: "Och sariq",
      magnit: "Diamagnit"
    }
  },
  {
    formula: "[Cu(NH₃)₄(H₂O)₂]SO₄",
    nom: "Tetraammindiakvamis(II) sulfat",
    tahlil: {
      ichki: "[Cu(NH₃)₄(H₂O)₂]²⁺",
      tashqi: "SO₄²⁻",
      metall: "Cu²⁺ (d⁹)",
      ligandlar: "4 ta NH₃ (ekvatorial) + 2 ta H₂O (aksial)",
      geometriya: "Yan-Teller cho'zilgan oktaedr",
      rang: "To'q ko'k (Shveysariya reagenti)",
      magnit: "Paramagnit (1 ta toq e⁻)"
    }
  }
]

export default function FormulaYozish() {
  const [activeExample, setActiveExample] = useState(0)
  const currentMisollar = MISOLLAR[activeExample]

  return (
    <MavzuLayout
      sarlavha="Formula yozish tartibi"
      tavsif="Koordinatsion birikmalar formulasini IUPAC 2005/2020 tavsiyalari bo'yicha to'g'ri yozish qoidalari"
      ikon="📝"
      nishon="02-MAVZU"
      yol={[
        { nom: "Nomlanishi", havola: "/oquv/nomlanishi" },
        { nom: "Formula yozish" }
      ]}
      oldingiMavzu={{ nom: "Verner nazariyasi", havola: "/oquv/nomlanishi/verner" }}
      keyingiMavzu={{ nom: "IUPAC nomlanishi", havola: "/oquv/nomlanishi/iupac" }}
      quizHavola="/oquv/video-darsliklar/quiz/nomlanishi"
    >
      {/* ═══ 1. ASOSIY QOIDALAR ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-6"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2.5" style={{ color: "var(--v3-matn)" }}>
          <span>📋</span>
          <span>Koordinatsion formula tuzishning 4 ta qoidasi</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-2xl p-5 border space-y-2"
            style={{
              background: "var(--v3-yuza-2)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--v3-urgu)", color: "var(--v3-urgu-matn)" }}
              >
                1
              </span>
              <h3 className="font-bold text-sm sm:text-base" style={{ color: "var(--v3-matn)" }}>
                Kvadrat qavs [ ] — Ichki sfera
              </h3>
            </div>
            <p className="v3-xira text-xs leading-relaxed">
              Kompleks hosil qiluvchi markaziy metall va unga to&apos;g&apos;ridan-to&apos;g&apos;ri bog&apos;langan barcha ligandlar har doim kvadrat qavs <strong style={{ color: "var(--v3-matn)" }}>[ ]</strong> ichiga olinadi. Qavs tashqarisidagi qism esa tashqi sfera hisoblanadi.
            </p>
          </div>

          <div
            className="rounded-2xl p-5 border space-y-2"
            style={{
              background: "var(--v3-yuza-2)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--v3-urgu)", color: "var(--v3-urgu-matn)" }}
              >
                2
              </span>
              <h3 className="font-bold text-sm sm:text-base" style={{ color: "var(--v3-matn)" }}>
                Ichki tartib: Metall birinchi
              </h3>
            </div>
            <p className="v3-xira text-xs leading-relaxed">
              Kvadrat qavs ichida dastlab <strong style={{ color: "var(--v3-urgu)" }}>markaziy metall belgisi</strong> yoziladi, undan so&apos;ng barcha ligandlar keltiriladi: <code className="font-mono text-xs px-1 rounded" style={{ background: "var(--v3-yuza)" }}>[M L₁ L₂ ...]</code>
            </p>
          </div>

          <div
            className="rounded-2xl p-5 border space-y-2"
            style={{
              background: "var(--v3-yuza-2)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--v3-urgu)", color: "var(--v3-urgu-matn)" }}
              >
                3
              </span>
              <h3 className="font-bold text-sm sm:text-base" style={{ color: "var(--v3-matn)" }}>
                Ligandlar: Alifbo tartibi (IUPAC)
              </h3>
            </div>
            <p className="v3-xira text-xs leading-relaxed">
              IUPAC ning zamonaviy tavsiyasiga ko&apos;ra, qavs ichidagi barcha ligandlar (zaryadidan qat&apos;i nazar) ularning kimyoviy formulasi bo&apos;yicha <strong style={{ color: "var(--v3-matn)" }}>alifbo tartibida</strong> joylashtiriladi.
            </p>
          </div>

          <div
            className="rounded-2xl p-5 border space-y-2"
            style={{
              background: "var(--v3-yuza-2)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--v3-urgu)", color: "var(--v3-urgu-matn)" }}
              >
                4
              </span>
              <h3 className="font-bold text-sm sm:text-base" style={{ color: "var(--v3-matn)" }}>
                Ko&apos;p atomli ligandlar: Qavs ( )
              </h3>
            </div>
            <p className="v3-xira text-xs leading-relaxed">
              Ikki yoki undan ortiq atomdan iborat bo&apos;lgan barcha ligandlar (NH₃, H₂O, CN, en, ox) o&apos;z indekslari bilan birga oddiy qavs <strong style={{ color: "var(--v3-matn)" }}>( )</strong> ichiga olinadi: masalan, <code className="font-mono text-xs px-1 rounded" style={{ background: "var(--v3-yuza)" }}>(NH₃)₆</code>, <code className="font-mono text-xs px-1 rounded" style={{ background: "var(--v3-yuza)" }}>(en)₂</code>.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ 2. INTERAKTIV FORMULA TAHLILCHISI ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-6"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl font-bold flex items-center gap-2.5" style={{ color: "var(--v3-matn)" }}>
            <span>🔬</span>
            <span>Interaktiv formula anatomiyasi</span>
          </h2>
          <span className="text-xs v3-xira">Namuna tanlang:</span>
        </div>

        {/* Tanlov tugmalari */}
        <div className="flex flex-wrap gap-2">
          {MISOLLAR.map((m, i) => {
            const faol = activeExample === i
            return (
              <button
                key={m.formula}
                onClick={() => setActiveExample(i)}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all border font-medium"
                style={{
                  background: faol
                    ? "color-mix(in srgb, var(--v3-urgu) 15%, var(--v3-yuza))"
                    : "var(--v3-yuza-2)",
                  color: faol ? "var(--v3-urgu)" : "var(--v3-matn)",
                  borderColor: faol ? "var(--v3-urgu)" : "var(--v3-chiziq)"
                }}
              >
                {m.formula}
              </button>
            )
          })}
        </div>

        {/* Tanlangan formula kartasi */}
        <div
          className="rounded-2xl p-6 border shadow-xs space-y-6"
          style={{
            background: "color-mix(in srgb, var(--v3-fon) 50%, var(--v3-yuza))",
            borderColor: "var(--v3-chiziq)"
          }}
        >
          <div className="text-center space-y-2 pb-4 border-b" style={{ borderColor: "var(--v3-chiziq)" }}>
            <div className="v3-nishon">Formula va nomi:</div>
            <div>
              <KimyoFormula formula={currentMisollar.formula} ajratilgan={true} olcham="katta" />
            </div>
            <div className="text-sm font-semibold" style={{ color: "var(--v3-urgu)" }}>
              {currentMisollar.nom}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <div className="v3-xira text-[11px] mb-1">Ichki kompleks sfera:</div>
              <KimyoFormula formula={currentMisollar.tahlil.ichki} olcham="kichik" />
            </div>
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <div className="v3-xira text-[11px] mb-1">Tashqi sfera:</div>
              <KimyoFormula formula={currentMisollar.tahlil.tashqi} olcham="kichik" />
            </div>
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <div className="v3-xira text-[11px] mb-1">Markaziy metall:</div>
              <strong style={{ color: "var(--v3-urgu)" }}>{currentMisollar.tahlil.metall}</strong>
            </div>
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <div className="v3-xira text-[11px] mb-1">Ligandlar:</div>
              <strong>{currentMisollar.tahlil.ligandlar}</strong>
            </div>
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <div className="v3-xira text-[11px] mb-1">Fazoviy geometriya:</div>
              <strong>{currentMisollar.tahlil.geometriya}</strong>
            </div>
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <div className="v3-xira text-[11px] mb-1">Magnit xossasi:</div>
              <strong style={{ color: "var(--v3-urgu-2)" }}>{currentMisollar.tahlil.magnit}</strong>
            </div>
          </div>
        </div>
      </div>
    </MavzuLayout>
  )
}