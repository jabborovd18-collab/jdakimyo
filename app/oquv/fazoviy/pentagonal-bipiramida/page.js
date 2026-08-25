"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[UO₂(H₂O)₅]²⁺", nomi: "Uranil pentaakva kompleksi", ion: "U⁶⁺ (Aktinoid)", xususiyat: "O=U=O chiziqli aksial o'q va 5 ta ekvatorial suv molekulasi" },
  { formula: "[V(CN)₇]⁴⁻", nomi: "Geptasianovanadat(III)", ion: "V³⁺ (3d²)", xususiyat: "Klassik 7-koordinatali d² anorganik kompleks" },
  { formula: "[ZrF₇]³⁻", nomi: "Geptaflorotsirkonat(IV)", ion: "Zr⁴⁺ (4d⁰)", xususiyat: "Tsirkoniy(IV) ning barqaror ftoridli kompleksi" },
  { formula: "IF₇", nomi: "Yod geptaftorid", ion: "I⁷⁺", xususiyat: "Galogenlararo 72° va 90° li sof PBP etaloni" }
]

export default function PentagonalBipiramida() {
  return (
    <MavzuLayout
      sarlavha="Pentagonal bipiramida (KS = 7)"
      tavsif="Koordinatsion soni 7 bo'lgan komplekslar • sp³d³ gibridlanish • 72° va 90° burchaklar • D₅ₕ simmetriya"
      ikon="⭐"
      nishon="KS = 7 (PBP)"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Pentagonal bipiramida" }
      ]}
      oldingiMavzu={{ nom: "Trigonal prizma (KS=6)", havola: "/oquv/fazoviy/trigonal-prizma" }}
      keyingiMavzu={{ nom: "Monoyopiq trigonal prizma (KS=7)", havola: "/oquv/fazoviy/monoyopiq-prizma" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/pentagonal-bipiramida/3d"
          className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl font-bold transition-transform hover:scale-105 shadow-sm border"
          style={{
            background: "var(--v3-urgu)",
            color: "var(--v3-urgu-matn)",
            borderColor: "var(--v3-urgu)"
          }}
        >
          <span className="text-3xl">🔄</span>
          <div className="text-left">
            <div className="text-base sm:text-lg font-extrabold">3D Modelni Ko&apos;rish</div>
            <div className="text-xs opacity-90 font-mono">[UO₂(H₂O)₅]²⁺ va IF₇ interaktiv</div>
          </div>
        </Link>
      </div>

      {/* ═══ 1. PARAMETRLAR ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
          <span>📋</span>
          <span>Geometrik xarakteristika</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Koordinatsion son</span>
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>7</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Valent burchak</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>72° & 90°</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>sp³d³</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>D₅ₕ</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Pentagonal bipiramidada 5 ta ligand muntazam beshburchak shaklidagi ekvatorial tekislikda (72° burchak bilan) va 2 ta aksial ligand yuqori va pastki o&apos;qda (90° burchak bilan) joylashadi. Uranil UO₂²⁺ va lantanoid komplekslarida ko&apos;p uchraydi.
        </p>
      </div>

      {/* ═══ 2. JADVAL ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h3 className="text-lg font-bold" style={{ color: "var(--v3-matn)" }}>
          KS=7 pentagonal bipiramidal komplekslar
        </h3>

        <InteraktivJadval
          sarlavha="Pentagonal bipiramidal komplekslar"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "25%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "30%" },
            { kalit: "ion", nom: "Markaziy ion", format: "kod", kenglik: "18%" },
            { kalit: "xususiyat", nom: "Xususiyati", kenglik: "27%" }
          ]}
          qatorlar={MISOLLAR}
        />
      </div>
    </MavzuLayout>
  )
}