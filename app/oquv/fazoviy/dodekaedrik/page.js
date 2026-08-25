"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[Mo(CN)₈]³⁻", nomi: "Oktasianomolibdat(V)", ion: "Mo⁵⁺ (4d¹)", xususiyat: "Kristall panjarada D₂_d simmetriyali dodekaedr" },
  { formula: "[Zr(acac)₄]", nomi: "Tetrakis(atsetilatsetonato)tsirkoniy(IV)", ion: "Zr⁴⁺ (4d⁰)", xususiyat: "Bidentat xelat ligandlari bilan dodekaedrik kompleks" },
  { formula: "[W(CN)₈]⁴⁻", nomi: "Oktasianovolframat(IV)", ion: "W⁴⁺ (5d²)", xususiyat: "Dodekaedrik d² diamagnit 8-koordinatsion kompleks" }
]

export default function Dodekaedrik() {
  return (
    <MavzuLayout
      sarlavha="Dodekaedrik geometriya (KS = 8)"
      tavsif="Koordinatsion soni 8 bo'lgan uchburchakli ko'pyoq • sp³d⁴ gibridlanish • D₂_d simmetriya • 8 ta uch va 12 ta yoq"
      ikon="🔮"
      nishon="KS = 8 (Dodekaedr)"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Dodekaedrik geometriya" }
      ]}
      oldingiMavzu={{ nom: "Kvadrat antiprizma (KS=8)", havola: "/oquv/fazoviy/kvadrat-antiprizma" }}
      keyingiMavzu={{ nom: "Kubsimon geometriya (KS=8)", havola: "/oquv/fazoviy/kubsimon" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/dodekaedrik/3d"
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
            <div className="text-xs opacity-90 font-mono">[Mo(CN)₈]³⁻ va [Zr(acac)₄] interaktiv</div>
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
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>8</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Shakl turi</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>12 ta uchburchak yoq</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>sp³d⁴</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>D₂_d</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Dodekaedrik komplekslar (D₂_d simmetriyali ko&apos;pyoq) — ligandlar 4 tadan iborat ikkita perpendikulyar tetraedrga o&apos;xshash trapezoid to&apos;plamga bo&apos;linadi (A va B sinf pozitsiyalari).
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
          KS=8 dodekaedrik komplekslar
        </h3>

        <InteraktivJadval
          sarlavha="Dodekaedrik komplekslar namunalari"
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