"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const KARBONIL_KOMPLEKSLAR = [
  { formula: "[Ni(CO)₄]", nomi: "Tetrakarbonilnikel(0)", metall: "Ni⁰ (d¹⁰)", geometriya: "Tetraedr", holat: "Uchuvchan rangsiz suyuqlik (q.h. 43°C)" },
  { formula: "[Fe(CO)₅]", nomi: "Pentakarboniltemir(0)", metall: "Fe⁰ (d⁸)", geometriya: "Trigonal bipiramida", holat: "Sariq suyuqlik (q.h. 103°C)" },
  { formula: "[Cr(CO)₆]", nomi: "Geksakarbonilxrom(0)", metall: "Cr⁰ (d⁶)", geometriya: "Oktaedr", holat: "Rangsiz sublimatsiyalanuvchi kristall" },
  { formula: "[Mo(CO)₆]", nomi: "Geksakarbonilmolibden(0)", metall: "Mo⁰ (d⁶)", geometriya: "Oktaedr", holat: "Oq kristall" },
  { formula: "[W(CO)₆]", nomi: "Geksakarbonilvolfram(0)", metall: "W⁰ (d⁶)", geometriya: "Oktaedr", holat: "Oq kristall" },
  { formula: "[Co₂(CO)₈]", nomi: "Oktakarbonildikobalt(0)", metall: "Co⁰ (d⁹)", geometriya: "Ko'prikli (μ-CO)", holat: "To'q qizil qattiq modda (Gidroformillash katalizatori)" },
]

export default function KarbonilKomplekslar() {
  return (
    <MavzuLayout
      sarlavha="Karbonil komplekslar (Metall karbonillari)"
      tavsif="Ligandi CO (uglerod oksidi) bo'lgan, metall nolinchi oksidlanish darajasida bo'lgan π-akseptor komplekslar"
      ikon="🫧"
      nishon="KARBONIL LIGANDI"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Ligand tabiatiga ko'ra", havola: "/oquv/klassifikatsiyasi/ligand" },
        { nom: "Karbonil komplekslar" }
      ]}
      oldingiMavzu={{ nom: "Galogenid komplekslar", havola: "/oquv/klassifikatsiyasi/ligand/galogenid" }}
      keyingiMavzu={{ nom: "Nitrozil komplekslar", havola: "/oquv/klassifikatsiyasi/ligand/nitrozil" }}
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
          <span>Metall karbonillarining tuzilish xususiyatlari</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Metall karbonillari</strong> — metall atomining <strong style={{ color: "var(--v3-urgu)" }}>uglerod(II) oksidi (CO)</strong> molekulalari bilan hosil qilgan neytral birikmalaridir. Metallar nolinchi oksidlanish darajasida bo&apos;lib, CO molekulasi uglerod orqali donor-akseptor (σ-bog&apos;) va metall d-orbitallaridan CO ning bo&apos;sh π*-orbitallariga teskari datsiv (π-bog&apos;) hosil qiladi (<strong style={{ color: "var(--v3-urgu)" }}>Sinergetik bog&apos;lanish</strong>).
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
          Gomoleptik metall karbonillari
        </h3>

        <InteraktivJadval
          sarlavha="Metall karbonillari ro'yxati (18-elektron qoidasi)"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "22%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "30%" },
            { kalit: "geometriya", nom: "Fazoviy geometriya", kenglik: "22%" },
            { kalit: "holat", nom: "Agregat holati va xossalari", kenglik: "26%" }
          ]}
          qatorlar={KARBONIL_KOMPLEKSLAR}
        />
      </div>
    </MavzuLayout>
  )
}