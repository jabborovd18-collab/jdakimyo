"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const TUZLAR = [
  {
    formula: "K₄[Fe(CN)₆]",
    nomi: "Kaliy geksatsianidoferrat(II) (Sariq qon tuzi)",
    ichki: "[Fe(CN)₆]⁴⁻",
    tashqi: "4K⁺",
    markaz: "Fe²⁺",
    ligand: "6 ta CN⁻ (tsianido)",
    ks: 6,
    geometriya: "Muntazam oktaedr",
    xossasi: "Sariq kristall modda. Fe³⁺ ionlari bilan to'q ko'k 'Berlin lazuri' (Prussian blue) cho'kmasini beruvchi analitik reagent.",
    reaksiya: "4Fe³⁺ + 3[Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃↓ (Berlin lazuri)"
  },
  {
    formula: "K₃[Fe(CN)₆]",
    nomi: "Kaliy geksatsianidoferrat(III) (Qizil qon tuzi)",
    ichki: "[Fe(CN)₆]³⁻",
    tashqi: "3K⁺",
    markaz: "Fe³⁺",
    ligand: "6 ta CN⁻ (tsianido)",
    ks: 6,
    geometriya: "Oktaedrik",
    xossasi: "To'q qizil kristall modda. Fe²⁺ ionlari bilan to'q ko'k 'Turbul ko'ki' (Turnbull's blue) cho'kmasini beradi.",
    reaksiya: "3Fe²⁺ + 2[Fe(CN)₆]³⁻ → Fe₃[Fe(CN)₆]₂↓ (Turbul ko'ki)"
  },
  {
    formula: "[Cr(H₂O)₆]Cl₃",
    nomi: "Geksaakvaxrom(III) xlorid",
    ichki: "[Cr(H₂O)₆]³⁺",
    tashqi: "3Cl⁻",
    markaz: "Cr³⁺",
    ligand: "6 ta H₂O (akva)",
    ks: 6,
    geometriya: "Muntazam oktaedr",
    xossasi: "Binafsha rangli gidratlangan kompleks tuz. Suvda to'liq ionlarga ajraladi va AgNO₃ bilan 3 mol AgCl cho'kmasi beradi.",
    reaksiya: "[Cr(H₂O)₆]Cl₃ + 3AgNO₃ → 3AgCl↓ + [Cr(H₂O)₆](NO₃)₃"
  }
]

export default function KompleksTuzlar() {
  return (
    <MavzuLayout
      sarlavha="Kompleks tuzlar"
      tavsif="Tashqi sferasida metall kationlari yoki kislota qoldig'i anionlari tutgan eng keng tarqalgan kompleks tuzlar"
      ikon="🧂"
      nishon="TUZLAR"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Sinfiga ko'ra", havola: "/oquv/klassifikatsiyasi/sinf" },
        { nom: "Kompleks tuzlar" }
      ]}
      oldingiMavzu={{ nom: "Kompleks asoslar", havola: "/oquv/klassifikatsiyasi/sinf/asos" }}
      keyingiMavzu={{ nom: "Zaryadiga ko'ra tasnif", havola: "/oquv/klassifikatsiyasi/zaryad" }}
      quizHavola="/oquv/video-darsliklar/quiz/klassifikatsiyasi"
    >
      {/* ═══ TA'RIF ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
          <span>📋</span>
          <span>Kompleks tuzlar haqida</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Kompleks tuzlar</strong> — tashqi sferasida H⁺ yoki OH⁻ dan boshqa oddiy metall kationlari (K⁺, Na⁺, Ca²⁺) yoki kislota qoldiqlari (Cl⁻, SO₄²⁻, NO₃⁻) tutgan birikmalardir. Bu eng keng tarqalgan koordinatsion birikmalar guruhidir.
          </p>
        </div>
      </div>

      {/* ═══ MISOLLAR ═══ */}
      <div className="space-y-6">
        {TUZLAR.map((t, i) => (
          <div
            key={t.formula}
            className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-6"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b" style={{ borderColor: "var(--v3-chiziq)" }}>
              <div>
                <div className="text-lg sm:text-xl font-mono font-bold" style={{ color: "var(--v3-matn)" }}>
                  <KimyoFormula formula={t.formula} ajratilgan={true} />
                </div>
                <div className="text-xs sm:text-sm font-semibold mt-1" style={{ color: "var(--v3-urgu)" }}>
                  {t.nomi}
                </div>
              </div>
              <span className="v3-nishon">Namunaviy tuz #{i + 1}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Ichki sfera:</div>
                <KimyoFormula formula={t.ichki} olcham="kichik" />
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Tashqi sfera:</div>
                <strong style={{ color: "var(--v3-urgu)" }}>{t.tashqi}</strong>
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Markaziy atom va KS:</div>
                <strong>{t.markaz} (KS = {t.ks})</strong>
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Ligandlar:</div>
                <strong>{t.ligand}</strong>
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Geometriya:</div>
                <strong>{t.geometriya}</strong>
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Analitik reaksiya:</div>
                <strong className="font-mono text-[11px]">{t.reaksiya}</strong>
              </div>
            </div>

            <p className="v3-xira text-xs leading-relaxed">
              💡 <strong>Xossalari:</strong> {t.xossasi}
            </p>
          </div>
        ))}
      </div>
    </MavzuLayout>
  )
}