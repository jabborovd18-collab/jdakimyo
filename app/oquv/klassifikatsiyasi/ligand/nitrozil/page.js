"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const NITROZIL_KOMPLEKSLAR = [
  { formula: "Na₂[Fe(CN)₅(NO)]", nomi: "Natriy pentatsianidonitrozilferrat(III) (Nitroprussid)", xossasi: "S²⁻ sulfid ionlarini aniqlashda to'q binafsha rang beradi", tip: "NO⁺ (chiziqli)" },
  { formula: "[Fe(H₂O)₅(NO)]SO₄", nomi: "Pentaakvanitroziltemir(II) sulfat", xossasi: "Nitrat (NO₃⁻) ionlarini aniqlashda 'qo'ng'ir halqa' (brown ring) beradi", tip: "NO⁺ (qo'ng'ir halqa)" },
  { formula: "[Co(NH₃)₅(NO)]Cl₂", nomi: "Pentaamminnitrozilkobalt(II) xlorid", xossasi: "Burchakli bog'langan nitrozil", tip: "NO⁻ (burchakli)" },
]

export default function NitrozilKomplekslar() {
  return (
    <MavzuLayout
      sarlavha="Nitrozil komplekslar"
      tavsif="Ligandi NO (azot(II) oksidi) bo'lgan, 'qo'ng'ir halqa' va nitroprussid kabi mashhur analitik reagentlar"
      ikon="🔵"
      nishon="NITROZIL LIGANDI"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Ligand tabiatiga ko'ra", havola: "/oquv/klassifikatsiyasi/ligand" },
        { nom: "Nitrozil komplekslar" }
      ]}
      oldingiMavzu={{ nom: "Karbonil komplekslar", havola: "/oquv/klassifikatsiyasi/ligand/karbonil" }}
      keyingiMavzu={{ nom: "Nitrit komplekslar", havola: "/oquv/klassifikatsiyasi/ligand/nitrit" }}
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
          <span>Nitrozil ligandining o&apos;ziga xosligi</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Nitrozil komplekslar</strong> — ligand sifatida <strong style={{ color: "var(--v3-urgu)" }}>azot(II) oksidi (NO)</strong> tutgan birikmalardir. NO molekulasi metall bilan bog&apos;langanda chiziqli (M-N≡O, 3-elektronli donor, NO⁺) yoki burchakli (M-N=O, 1-elektronli donor, NO⁻) shaklda koordinatsiyalana oladi.
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h3 className="text-lg font-bold" style={{ color: "var(--v3-matn)" }}>
          Analitik kimyoda eng mashhur nitrozil komplekslari
        </h3>

        <InteraktivJadval
          sarlavha="Nitrozil komplekslari"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "24%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "32%" },
            { kalit: "tip", nom: "Bog'lanish turi", kenglik: "20%" },
            { kalit: "xossasi", nom: "Sifat tahlildagi roli", kenglik: "24%" }
          ]}
          qatorlar={NITROZIL_KOMPLEKSLAR}
        />
      </div>
    </MavzuLayout>
  )
}