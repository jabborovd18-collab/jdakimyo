"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  {
    formula: "[Co(NH₃)₆]Cl₃",
    nomi: "Geksaamminkobalt(III) xlorid",
    hisob: "Co³⁺ (+3) + 6×NH₃ (0) = +3",
    zaryad: "+3",
    tashqi: "3Cl⁻ (anionlar)"
  },
  {
    formula: "[Cu(NH₃)₄]SO₄",
    nomi: "Tetraamminmis(II) sulfat",
    hisob: "Cu²⁺ (+2) + 4×NH₃ (0) = +2",
    zaryad: "+2",
    tashqi: "SO₄²⁻ (anion)"
  },
  {
    formula: "[Cr(H₂O)₆]Cl₃",
    nomi: "Geksaakvaxrom(III) xlorid",
    hisob: "Cr³⁺ (+3) + 6×H₂O (0) = +3",
    zaryad: "+3",
    tashqi: "3Cl⁻ (anionlar)"
  }
]

export default function KationKomplekslar() {
  return (
    <MavzuLayout
      sarlavha="Kation komplekslar"
      tavsif="Ichki koordinatsion sferasi musbat zaryadga ega bo'lgan komplekslar tuzilishi va zaryad hisoblash usuli"
      ikon="➕"
      nishon="KATION KOMPLEKSLAR"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Zaryadiga ko'ra", havola: "/oquv/klassifikatsiyasi/zaryad" },
        { nom: "Kation komplekslar" }
      ]}
      keyingiMavzu={{ nom: "Anion komplekslar", havola: "/oquv/klassifikatsiyasi/zaryad/anion" }}
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
          <span>Kation komplekslar mohiyati</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Kation komplekslar</strong> — ichki koordinatsion sferasining umumiy zaryadi musbat bo&apos;lgan birikmalardir. Odatda metall musbat kationi bilan neytral ligandlar (NH₃, H₂O, en) bog&apos;langanda yoki musbat zaryad anion ligandlar sonidan ustun bo&apos;lganda hosil bo&apos;ladi. Tashqi sferada kislota qoldiqlari (Cl⁻, Br⁻, SO₄²⁻, NO₃⁻) joylashadi.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {MISOLLAR.map((m, i) => (
          <div
            key={m.formula}
            className="rounded-2xl p-6 border shadow-xs space-y-4"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: "var(--v3-chiziq)" }}>
              <div className="font-mono text-base sm:text-lg font-bold" style={{ color: "var(--v3-matn)" }}>
                <KimyoFormula formula={m.formula} ajratilgan={true} />
              </div>
              <span className="text-xs font-semibold" style={{ color: "var(--v3-urgu)" }}>
                {m.nomi}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Zaryad hisobi:</div>
                <strong className="font-mono">{m.hisob}</strong>
              </div>
              <div className="p-3 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Tashqi sfera neytrallovchisi:</div>
                <strong>{m.tashqi}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MavzuLayout>
  )
}