"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const ARALASH_KOMPLEKSLAR = [
  { formula: "[Pt(NH₃)₂Cl₂]", nomi: "Diammindixloridoplatina(II) (Sisplatin)", ligandlar: "2 ta NH₃ (ammin) + 2 ta Cl⁻ (xlorido)", ks: 4, tip: "Neytral + Anion" },
  { formula: "[Co(NH₃)₅Cl]Cl₂", nomi: "Pentaamminkloridokobalt(III) xlorid", ligandlar: "5 ta NH₃ + 1 ta Cl⁻", ks: 6, tip: "Neytral + Anion" },
  { formula: "[Co(NH₃)₄(H₂O)Cl]Cl₂", nomi: "Tetraamminakvakloridokobalt(III) xlorid", ligandlar: "4 ta NH₃ + 1 ta H₂O + 1 ta Cl⁻", ks: 6, tip: "Uch xil turdagi ligand" },
  { formula: "[Cr(en)₂Cl₂]Cl", nomi: "Dixloridobis(etilendiamin)xrom(III) xlorid", ligandlar: "2 ta en (bidentat) + 2 ta Cl⁻", ks: 6, tip: "Xelat + Anion" },
  { formula: "[Pt(NH₃)₂(py)Cl]Cl", nomi: "Diamminkloridopiridinplatina(II) xlorid", ligandlar: "2 ta NH₃ + 1 ta py + 1 ta Cl⁻", ks: 4, tip: "Turli organik va anorganik ligandlar" },
]

export default function AralashLigandli() {
  return (
    <MavzuLayout
      sarlavha="Aralash (Geteroligand) komplekslar"
      tavsif="Ichki koordinatsion sferasida ikki yoki undan ortiq turli kimyoviy tabiatdagi ligandlarni bir vaqtda tutgan birikmalar"
      ikon="🎨"
      nishon="ARALASH LIGANDLAR"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Ligand tabiatiga ko'ra", havola: "/oquv/klassifikatsiyasi/ligand" },
        { nom: "Aralash ligandli" }
      ]}
      oldingiMavzu={{ nom: "Metallosenlar", havola: "/oquv/klassifikatsiyasi/ligand/metallosen" }}
      keyingiMavzu={{ nom: "Kimyoviy bog'lanish bo'limi", havola: "/oquv/kimyoviy-boglanish" }}
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
          <span>Geteroligandli komplekslar xususiyatlari</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Aralash (geteroligandli) komplekslar</strong> — bitta markaziy atomga turli xil donor xususiyatiga ega bo&apos;lgan bir necha turdagi ligandlar birikkan komplekslardir. Ular gomoleptik (bir xil ligandli) komplekslarga qaraganda simmetriyasi pastroq bo&apos;lib, geometrik (sis/trans, fas/mer) hamda optik izomeriyaga nihoyatda boydir.
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
          Aralash ligandli komplekslarning muhim namunalari
        </h3>

        <InteraktivJadval
          sarlavha="Geteroligandli komplekslar jadvali"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "22%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "30%" },
            { kalit: "ligandlar", nom: "Ligandlar tarkibi", kenglik: "28%" },
            { kalit: "tip", nom: "Tasnif turi", kenglik: "20%" }
          ]}
          qatorlar={ARALASH_KOMPLEKSLAR}
        />
      </div>
    </MavzuLayout>
  )
}