"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "cis-[Pt(NH₃)₂Cl₂]", nomi: "Sisplatin", ion: "Pt²⁺ (5d⁸)", rang: "Sariq", ahamiyat: "Kuchli onkologik antitumor preparat" },
  { formula: "trans-[Pt(NH₃)₂Cl₂]", nomi: "Transplatin", ion: "Pt²⁺ (5d⁸)", rang: "Och sariq", ahamiyat: "Biologik nofaol geometrik izomer" },
  { formula: "[Ni(CN)₄]²⁻", nomi: "Tetrasianonikelat(II)", ion: "Ni²⁺ (3d⁸)", rang: "Sariq", ahamiyat: "Kuchli maydon CN⁻ ta'sirida hosil bo'lgan diamagnit kvadrat" },
  { formula: "[PdCl₄]²⁻", nomi: "Tetraxloropalladat(II)", ion: "Pd²⁺ (4d⁸)", rang: "Jigarrang", ahamiyat: "4d metallar doim tekis-kvadrat hosil qiladi" },
  { formula: "[AuCl₄]⁻", nomi: "Tetraxloroaurat(III)", ion: "Au³⁺ (5d⁸)", rang: "Sariq", ahamiyat: "Zarhal (shoh arog'i) reaksiyasi mahsuloti" },
  { formula: "[Cu(NH₃)₄]²⁺", nomi: "Tetraamminmis(II)", ion: "Cu²⁺ (3d⁹)", rang: "To'q ko'k", ahamiyat: "Shveysariya reagenti (tsellyuloza erituvchisi)" }
]

export default function TekisKvadrat() {
  return (
    <MavzuLayout
      sarlavha="Tekis kvadrat geometriya (KS = 4)"
      tavsif="Koordinatsion soni 4 bo'lgan d⁸ va d⁹ komplekslar • dsp² gibridlanish • 90° valent burchak • D₄ₕ simmetriya"
      ikon="◻️"
      nishon="KS = 4 (d⁸)"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Tekis kvadrat geometriya" }
      ]}
      oldingiMavzu={{ nom: "Tetraedrik geometriya (KS=4)", havola: "/oquv/fazoviy/tetraedrik" }}
      keyingiMavzu={{ nom: "Trigonal bipiramida (KS=5)", havola: "/oquv/fazoviy/trigonal-bipiramida" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/tekis-kvadrat/3d"
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
            <div className="text-xs opacity-90 font-mono">cis-[Pt(NH₃)₂Cl₂] (Sisplatin) interaktiv</div>
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
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>4</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Valent burchak</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>90°</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>dsp²</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>D₄ₕ</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Tekis kvadrat geometriyada 4 ta ligand va markaziy atom bitta XY tekisligida joylashadi. Bu shakl d⁸ metallari (Pt²⁺, Pd²⁺, Au³⁺, kuchli maydonda Ni²⁺) uchun juda xos bo&apos;lib, d_x²-y² orbitali eng yuqori energiyaga chiqadi va bo&apos;sh qoladi.
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
          Tekis kvadrat komplekslarga namunalar
        </h3>

        <InteraktivJadval
          sarlavha="KS=4 tekis kvadrat komplekslar"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "24%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "26%" },
            { kalit: "ion", nom: "Markaziy ion", format: "kod", kenglik: "16%" },
            { kalit: "rang", nom: "Rangi", kenglik: "12%" },
            { kalit: "ahamiyat", nom: "Ahamiyati", kenglik: "22%" }
          ]}
          qatorlar={MISOLLAR}
        />
      </div>
    </MavzuLayout>
  )
}