"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[Fe(CO)₅]", nomi: "Pentakarboniltemir(0)", ion: "Fe⁰ (3d⁸)", xususiyat: "Klassik 18-elektronli organometall kompleks" },
  { formula: "[CuCl₅]³⁻", nomi: "Pentaxlorokuprat(II)", ion: "Cu²⁺ (3d⁹)", xususiyat: "Trigonal bipiramidal anorganik kompleks" },
  { formula: "[Ni(CN)₅]³⁻", nomi: "Pentasianonikelat(II)", ion: "Ni²⁺ (3d⁸)", xususiyat: "TBP va kvadrat piramida oraliq muvozanatida (Berry psevdorotatsiyasi)" },
  { formula: "PCl₅", nomi: "Fosfor pentaxlorid", ion: "P⁵⁺", xususiyat: "Klassik anorganik TBP etaloni (gaz/suyuq fazada)" }
]

export default function TrigonalBipiramida() {
  return (
    <MavzuLayout
      sarlavha="Trigonal bipiramida geometriyasi (KS = 5)"
      tavsif="Koordinatsion soni 5 bo'lgan komplekslar • sp³d (d_z²) gibridlanish • 90° va 120° burchaklar • D₃ₕ simmetriya"
      ikon="🔷"
      nishon="KS = 5 (TBP)"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Trigonal bipiramida" }
      ]}
      oldingiMavzu={{ nom: "Tekis kvadrat (KS=4)", havola: "/oquv/fazoviy/tekis-kvadrat" }}
      keyingiMavzu={{ nom: "Kvadrat piramida (KS=5)", havola: "/oquv/fazoviy/kvadrat-piramida" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/trigonal-bipiramida/3d"
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
            <div className="text-xs opacity-90 font-mono">[Fe(CO)₅] interaktiv 3D</div>
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
          <span>Geometrik xususiyatlar</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Koordinatsion son</span>
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>5</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Valent burchaklar</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>90° & 120°</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>sp³d (d_z²)</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>D₃ₕ</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Trigonal bipiramida geometriyasida ligandlar 2 ta guruhga bo&apos;linadi: 3 ta ekvatorial ligand (o&apos;zaro 120°) va 2 ta aksial ligand (ekvatorga 90°, o&apos;zaro 180°). Berry psevdorotatsiyasi tufayli aksial va ekvatorial ligandlar past energiya to&apos;sig&apos;i bilan tez almashinib turadi.
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
          Trigonal bipiramidal komplekslar
        </h3>

        <InteraktivJadval
          sarlavha="KS=5 TBP komplekslar"
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