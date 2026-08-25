"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[Co(NH₃)₆]³⁺", nomi: "Geksaamminkobalt(III)", ion: "Co³⁺ (3d⁶)", spin: "QS (d²sp³)", rang: "Sariq-to'q sariq", xususiyat: "Klassik quyi spinli diamagnit oktaedr" },
  { formula: "[Fe(CN)₆]³⁻", nomi: "Geksasianoferrat(III)", ion: "Fe³⁺ (3d⁵)", spin: "QS (d²sp³)", rang: "Qizil", xususiyat: "Qizil qon tuzi, bitta toq elektron" },
  { formula: "[Fe(CN)₆]⁴⁻", nomi: "Geksasianoferrat(II)", ion: "Fe²⁺ (3d⁶)", spin: "QS (d²sp³)", rang: "Sariq", xususiyat: "Sariq qon tuzi, to'liq to'lgan t₂g⁶ diamagnit" },
  { formula: "[Fe(H₂O)₆]²⁺", nomi: "Geksaakvatemir(II)", ion: "Fe²⁺ (3d⁶)", spin: "YS (sp³d²)", rang: "Och yashil", xususiyat: "Kuchsiz maydon H₂O, 4 ta toq elektron" },
  { formula: "[Cr(H₂O)₆]³⁺", nomi: "Geksaakvaxrom(III)", ion: "Cr³⁺ (3d³)", spin: "d³ (t₂g³)", rang: "Binafsha-ko'k", xususiyat: "CFSE = -1.2 Δo bo'lgan juda barqaror kation" },
  { formula: "[Ni(H₂O)₆]²⁺", nomi: "Geksaakvanikel(II)", ion: "Ni²⁺ (3d⁸)", spin: "d⁸ (t₂g⁶ eg²)", rang: "Zumrad yashil", xususiyat: "Paramagnit (2 ta toq elektron)" }
]

export default function Oktaedrik() {
  return (
    <MavzuLayout
      sarlavha="Oktaedrik geometriya (KS = 6)"
      tavsif="Koordinatsion kimyoda eng ko'p tarqalgan shakl • d²sp³ (ichki) va sp³d² (tashqi) gibridlanish • 90° burchak • O_h simmetriya"
      ikon="💎"
      nishon="KS = 6 (ENG ASOSIY)"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Oktaedrik geometriya" }
      ]}
      oldingiMavzu={{ nom: "Kvadrat piramida (KS=5)", havola: "/oquv/fazoviy/kvadrat-piramida" }}
      keyingiMavzu={{ nom: "Trigonal prizma (KS=6)", havola: "/oquv/fazoviy/trigonal-prizma" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/oktaedrik/3d"
          className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl font-bold transition-transform hover:scale-105 shadow-sm border"
          style={{
            background: "var(--v3-urgu)",
            color: "var(--v3-urgu-matn)",
            borderColor: "var(--v3-urgu)"
          }}
        >
          <span className="text-3xl">💎</span>
          <div className="text-left">
            <div className="text-base sm:text-lg font-extrabold">3D Modelni Ko&apos;rish</div>
            <div className="text-xs opacity-90 font-mono">[Co(NH₃)₆]³⁺ va [Fe(CN)₆]³⁻ interaktiv 3D</div>
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
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>6</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Valent burchak</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>90° & 180°</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>d²sp³ / sp³d²</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>O_h</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Oktaedr — koordinatsion kimyodagi eng universal va yuqori simmetriyali shakldir. Markaziy atom oktaedr markazida, 6 ta ligand esa 6 ta uchida joylashgan bo&apos;lib, 8 ta muntazam uchburchak yoq va 12 ta qirrani hosil qiladi.
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
          Oktaedrik komplekslarga namunalar
        </h3>

        <InteraktivJadval
          sarlavha="KS=6 oktaedrik komplekslar"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "22%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "26%" },
            { kalit: "ion", nom: "Markaziy ion", format: "kod", kenglik: "16%" },
            { kalit: "spin", nom: "Gibridlanish", format: "kod", kenglik: "16%" },
            { kalit: "rang", nom: "Rangi", kenglik: "20%" }
          ]}
          qatorlar={MISOLLAR}
        />
      </div>
    </MavzuLayout>
  )
}