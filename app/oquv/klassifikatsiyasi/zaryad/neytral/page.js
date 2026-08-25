"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  {
    formula: "[Pt(NH₃)₂Cl₂]",
    nomi: "Diammindixloridoplatina(II) (Sisplatin)",
    hisob: "Pt²⁺ (+2) + 2×NH₃ (0) + 2×Cl⁻ (-2) = 0",
    xossasi: "Eng mashhur antitumor preparat. Qutbsiz organik erituvchilarda eriydi, suvda ionlarga ajralmaydi (elektrolit emas)."
  },
  {
    formula: "[Ni(CO)₄]",
    nomi: "Tetrakarbonilnikel(0)",
    hisob: "Ni⁰ (0) + 4×CO (0) = 0",
    xossasi: "Uchuvchan rangsiz suyuqlik. Mond usuli bo'yicha toza nikel ishlab chiqarishda oraliq modda."
  },
  {
    formula: "[Fe(CO)₅]",
    nomi: "Pentakarboniltemir(0)",
    hisob: "Fe⁰ (0) + 5×CO (0) = 0",
    xossasi: "Sariq suyuqlik, trigonal bipiramida geometriyasiga ega gometrik karbonil."
  },
  {
    formula: "[Co(NH₃)₃Cl₃]",
    nomi: "Triammintrixloridokobalt(III)",
    hisob: "Co³⁺ (+3) + 3×NH₃ (0) + 3×Cl⁻ (-3) = 0",
    xossasi: "Verner qatorining 4-birikmasi, AgNO₃ bilan cho'kma bermaydi."
  }
]

export default function NeytralKomplekslar() {
  return (
    <MavzuLayout
      sarlavha="Neytral komplekslar"
      tavsif="Ichki sferasi zaryadsiz bo'lgan, tashqi sferasi mavjud bo'lmagan noelektrolit kompleks birikmalar"
      ikon="⭕"
      nishon="NEYTRAL KOMPLEKSLAR"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Zaryadiga ko'ra", havola: "/oquv/klassifikatsiyasi/zaryad" },
        { nom: "Neytral komplekslar" }
      ]}
      oldingiMavzu={{ nom: "Anion komplekslar", havola: "/oquv/klassifikatsiyasi/zaryad/anion" }}
      keyingiMavzu={{ nom: "Ligandlar tabiatiga ko'ra", havola: "/oquv/klassifikatsiyasi/ligand" }}
      quizHavola="/oquv/video-darsliklar/quiz/klassifikatsiyasi"
    >
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
          <span>📋</span>
          <span>Neytral komplekslar xususiyatlari</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Neytral komplekslar</strong> — ichki koordinatsion sferasining umumiy elektr zaryadi nolga teng bo&apos;lgan birikmalardir. Ularning tashqi sferasi bo&apos;lmaydi, suvda ionlarga ajralmaydi (noelektrolitlar) va elektr tokini o&apos;tkazmaydi. Ko&apos;pincha organik erituvchilarda (benzol, xloroform, efir) yaxshi eriydi.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {MISOLLAR.map((m, i) => (
          <div
            key={m.formula}
            className="rounded-2xl p-6 border shadow-xs space-y-3"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: "var(--v3-chiziq)" }}>
              <div className="font-mono text-base sm:text-lg font-bold" style={{ color: "var(--v3-matn)" }}>
                <KimyoFormula formula={m.formula} />
              </div>
              <span className="text-xs font-semibold" style={{ color: "var(--v3-urgu)" }}>
                {m.nomi}
              </span>
            </div>

            <div className="p-3 rounded-xl border text-xs font-mono" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
              <span className="v3-xira">Zaryad balansi: </span>
              <strong>{m.hisob}</strong>
            </div>

            <p className="v3-xira text-xs leading-relaxed">
              💡 {m.xossasi}
            </p>
          </div>
        ))}
      </div>
    </MavzuLayout>
  )
}