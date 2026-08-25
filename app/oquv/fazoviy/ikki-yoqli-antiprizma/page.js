"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[Th(NO₃)₅]²⁻", nomi: "Pentanitratotorat(IV)", ion: "Th⁴⁺ (5f⁰)", xususiyat: "Bidentat 5 ta nitrat NO₃⁻ ligandlari orqali 10 ta kislorod atomi bog'lanadi" },
  { formula: "[Ce(NO₃)₅]²⁻", nomi: "Pentanitratoserat(III)", ion: "Ce³⁺ (4f¹)", xususiyat: "Lantanoid kationi atrofida 10-koordinatsion sfera" },
  { formula: "[La(EDTA)(H₂O)₄]⁻", nomi: "Etilendiamintetraatsetatolakvatolantan", ion: "La³⁺ (4f⁰)", xususiyat: "Geksadentat EDTA + 4 ta suv molekulasi = 10" }
]

export default function IkkiYoqliAntiprizma() {
  return (
    <MavzuLayout
      sarlavha="Ikki yoqli kvadrat antiprizma (KS = 10)"
      tavsif="Koordinatsion soni 10 bo'lgan lantanoid va aktinoid komplekslari • D₄_d simmetriya • Bidentat NO₃⁻ va EDTA ligandlari"
      ikon="🎖️"
      nishon="KS = 10"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Ikki yoqli antiprizma" }
      ]}
      oldingiMavzu={{ nom: "Uch yoqli prizma (KS=9)", havola: "/oquv/fazoviy/uch-yoqli-prizma" }}
      keyingiMavzu={{ nom: "Ikosaedrik geometriya (KS=12)", havola: "/oquv/fazoviy/ikosaedrik" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/ikki-yoqli-antiprizma/3d"
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
            <div className="text-xs opacity-90 font-mono">[Th(NO₃)₅]²⁻ interaktiv 3D</div>
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
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>10</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Strukturasi</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>8 antiprizma + 2 qopqoq</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>sp³d⁵f</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>D₄_d</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Ikki yoqli kvadrat antiprizma (Bicapped square antiprism) — kvadrat antiprizmaning ikkala parallel kvadrat asoslari ustiga bittadan (jami 2 ta) qo&apos;shimcha qopqoq ligandlar birikishi orqali 10 ta donor atomli yuqori koordinatsiyani hosil qiladi.
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
          KS=10 komplekslariga namunalar
        </h3>

        <InteraktivJadval
          sarlavha="KS=10 bo'lgan komplekslar"
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