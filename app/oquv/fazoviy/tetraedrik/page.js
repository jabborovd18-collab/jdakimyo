"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[CoCl₄]²⁻", nomi: "Tetraxlorokobaltat(II) ioni", ion: "Co²⁺ (3d⁷)", rang: "To'q ko'k", xususiyat: "Kuchsiz maydon Cl⁻ ligandlari bilan tetraedr" },
  { formula: "[Zn(OH)₄]²⁻", nomi: "Tetragidroksotsinkat(II) ioni", ion: "Zn²⁺ (3d¹⁰)", rang: "Rangsiz", xususiyat: "Amfoter tsinkning ishqordagi barqaror shakli" },
  { formula: "[Ni(CO)₄]", nomi: "Tetrakarbonilnikel(0)", ion: "Ni⁰ (3d¹⁰)", rang: "Rangsiz suyuqlik", xususiyat: "Mond jarayoni, 18-elektron qoidasiga to'la mos" },
  { formula: "[FeCl₄]⁻", nomi: "Tetraxloroferrat(III) ioni", ion: "Fe³⁺ (3d⁵)", rang: "Sariq-jigarrang", xususiyat: "Yuqori spinli d⁵ tetraedrik kompleks" },
  { formula: "[MnO₄]⁻", nomi: "Permanganat ioni", ion: "Mn⁷⁺ (3d⁰)", rang: "To'q binafsha", xususiyat: "Liganddan metallga zaryad ko'chishi (LMCT)" }
]

export default function Tetraedrik() {
  return (
    <MavzuLayout
      sarlavha="Tetraedrik geometriya (KS = 4)"
      tavsif="Koordinatsion soni 4 bo'lgan komplekslar • sp³ (yoki sd³) gibridlanish • 109.5° valent burchak • T_d simmetriya"
      ikon="🔺"
      nishon="KS = 4"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Tetraedrik geometriya" }
      ]}
      oldingiMavzu={{ nom: "Uchburchak tekislik (KS=3)", havola: "/oquv/fazoviy/uchburchak" }}
      keyingiMavzu={{ nom: "Tekis kvadrat (KS=4)", havola: "/oquv/fazoviy/tekis-kvadrat" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/tetraedrik/3d"
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
            <div className="text-xs opacity-90 font-mono">[CoCl₄]²⁻ va [Ni(CO)₄] interaktiv</div>
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
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>4</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Valent burchak</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>109.5°</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>sp³ / sd³</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>T_d</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Tetraedrik geometriyada 4 ta ligand markaziy atom atrofida tetraedrning 4 ta uchiga yo&apos;naladi. Kristall maydon nazariyasida d-orbitallar <strong>e (past)</strong> va <strong>t₂ (yuqori)</strong> guruhlarga ajraladi (Δt ≈ 4/9 Δo).
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
          Tetraedrik komplekslarga namunalar
        </h3>

        <InteraktivJadval
          sarlavha="KS=4 tetraedrik komplekslar"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "22%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "28%" },
            { kalit: "ion", nom: "Markaziy ion", format: "kod", kenglik: "18%" },
            { kalit: "rang", nom: "Rangi", kenglik: "14%" },
            { kalit: "xususiyat", nom: "Xususiyati", kenglik: "18%" }
          ]}
          qatorlar={MISOLLAR}
        />
      </div>
    </MavzuLayout>
  )
}