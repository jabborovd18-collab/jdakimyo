"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[TaF₈]³⁻", nomi: "Oktaflorotantalat(V)", ion: "Ta⁵⁺ (5d⁰)", xususiyat: "Kvadrat antiprizmaning barqaror anorganik etaloni" },
  { formula: "[Mo(CN)₈]⁴⁻", nomi: "Oktasianomolibdat(IV)", ion: "Mo⁴⁺ (4d²)", xususiyat: "Eritmada kvadrat antiprizma, kristallda dodekaedr muvozanatida" },
  { formula: "[Zr(C₂O₄)₄]⁴⁻", nomi: "Tetraoksalatotsirkonat(IV)", ion: "Zr⁴⁺ (4d⁰)", xususiyat: "Xelat oksalat ligandlari bilan antiprizma hosil qiladi" },
  { formula: "[ReF₈]²⁻", nomi: "Oktaflororenat(VI)", ion: "Re⁶⁺ (5d¹)", xususiyat: "5d o'tish metalli ftoridli 8-koordinatsiyasi" }
]

export default function KvadratAntiprizma() {
  return (
    <MavzuLayout
      sarlavha="Kvadrat antiprizma geometriyasi (KS = 8)"
      tavsif="Koordinatsion soni 8 bo'lgan eng barqaror shakl • sp³d⁴ gibridlanish • D₄_d simmetriya • 45° burilgan kvadratlar"
      ikon="💠"
      nishon="KS = 8 (SAP)"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Kvadrat antiprizma" }
      ]}
      oldingiMavzu={{ nom: "Monoyopiq prizma (KS=7)", havola: "/oquv/fazoviy/monoyopiq-prizma" }}
      keyingiMavzu={{ nom: "Dodekaedrik geometriya (KS=8)", havola: "/oquv/fazoviy/dodekaedrik" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/kvadrat-antiprizma/3d"
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
            <div className="text-xs opacity-90 font-mono">[Mo(CN)₈]⁴⁻ va [TaF₈]³⁻ interaktiv</div>
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
            <span className="v3-xira text-[11px] block">Burilish burchagi</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>45° (Staggered)</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>sp³d⁴</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>D₄_d</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Kvadrat antiprizma (Square antiprism) — kubdan farqli o&apos;laroq, yuqori va pastki kvadrat yuzlar bir-biriga nisbatan 45° ga burilgan bo&apos;ladi. Natijada kubning to&apos;rtburchak yon yuzlari o&apos;rniga 8 ta uchburchak yon yuz hosil bo&apos;ladi va ligandlararo itarilish minimal darajaga tushadi.
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
          KS=8 kvadrat antiprizma namunalari
        </h3>

        <InteraktivJadval
          sarlavha="Kvadrat antiprizmatik komplekslar"
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