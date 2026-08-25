"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[Re(S₂C₂Ph₂)₃]", nomi: "Tris(ditiolat)reniy(VI)", ion: "Re⁶⁺ (5d¹)", xususiyat: "Ditiolen xelat ligandlar prizmatik shaklni majburiy ushlab turadi" },
  { formula: "[W(CH₃)₆]", nomi: "Geksametilvolfram(VI)", ion: "W⁶⁺ (5d⁰)", xususiyat: "d⁰ neytral organometall birikma, qisqa C–W masofalari" },
  { formula: "[Mo(S₂C₂H₂)₃]", nomi: "Tris(ditiolat)molibden", ion: "Mo⁴⁺ (4d²)", xususiyat: "Trigonal prizmatik oltingugurt koordinatsiyasi" },
  { formula: "MoS₂ (qatlam)", nomi: "Molibden disulfid kristall", ion: "Mo⁴⁺", xususiyat: "2D qatlamli kristall panjarada Mo atomlari trigonal prizma markazida" }
]

export default function TrigonalPrizma() {
  return (
    <MavzuLayout
      sarlavha="Trigonal prizma geometriyasi (KS = 6)"
      tavsif="Koordinatsion soni 6 bo'lgan kam uchraydigan komplekslar • sd⁵ / d²sp³ gibridlanish • D₃ₕ simmetriya • d⁰, d¹, d² tizimlar"
      ikon="⛺"
      nishon="KS = 6 (Prizma)"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Trigonal prizma" }
      ]}
      oldingiMavzu={{ nom: "Oktaedrik geometriya (KS=6)", havola: "/oquv/fazoviy/oktaedrik" }}
      keyingiMavzu={{ nom: "Pentagonal bipiramida (KS=7)", havola: "/oquv/fazoviy/pentagonal-bipiramida" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/trigonal-prizma/3d"
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
            <div className="text-xs opacity-90 font-mono">[W(CH₃)₆] va [Re(S₂C₂Ph₂)₃] interaktiv</div>
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
            <span className="v3-xira text-[11px] block">Torsion burchak</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>0° (Eclipsed)</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>sd⁵ / d²sp³</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>D₃ₕ</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Trigonal prizmada yuqori va quyi uchburchak yuzlar bir-biriga ro&apos;parama-ro&apos;para (burilmasdan, 0° burchak ostida) joylashadi. Oktaedr esa trigonal antiprizma bo&apos;lib, unda 60° burilish mavjud. Trigonal prizma maxsus ditiolen ligandlar yoki d⁰-d² metallarda uchraydi.
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
          Trigonal prizmatik komplekslar
        </h3>

        <InteraktivJadval
          sarlavha="KS=6 trigonal prizma namunalari"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "25%" },
            { kalit: "nomi", nom: "Nomi", kenglik: "30%" },
            { kalit: "ion", nom: "Metall ioni", format: "kod", kenglik: "18%" },
            { kalit: "xususiyat", nom: "Xususiyati", kenglik: "27%" }
          ]}
          qatorlar={MISOLLAR}
        />
      </div>
    </MavzuLayout>
  )
}