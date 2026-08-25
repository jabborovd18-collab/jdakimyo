"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[Ce(NO₃)₆]²⁻", nomi: "Geksanitratoserat(IV)", ion: "Ce⁴⁺ (4f⁰)", xususiyat: "6 ta bidentat nitrat NO₃⁻ guruhlari orqali 12 ta kislorodli ikosaedrik sfera" },
  { formula: "[Th(NO₃)₆]²⁻", nomi: "Geksanitratotorat(IV)", ion: "Th⁴⁺ (5f⁰)", xususiyat: "Toriy(IV) ning 12-koordinatali izostrukturali kompleksi" },
  { formula: "[B₁₂H₁₂]²⁻", nomi: "Dodekagidro-kloso-dodekaborat", ion: "B₁₂ klaster", xususiyat: "Bor kimyosidagi 12 burchakli mukammal ikosaedr" }
]

export default function Ikosaedrik() {
  return (
    <MavzuLayout
      sarlavha="Ikosaedrik geometriya (KS = 12)"
      tavsif="Koordinatsion soni 12 bo'lgan komplekslar • 20 ta uchburchak yoq va 12 ta uch • I_h eng yuqori simmetriya"
      ikon="🌐"
      nishon="KS = 12"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Ikosaedrik geometriya" }
      ]}
      oldingiMavzu={{ nom: "Ikki yoqli antiprizma (KS=10)", havola: "/oquv/fazoviy/ikki-yoqli-antiprizma" }}
      keyingiMavzu={{ nom: "Sendvich komplekslar", havola: "/oquv/fazoviy/sendvich" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/ikosaedrik/3d"
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
            <div className="text-xs opacity-90 font-mono">[Ce(NO₃)₆]²⁻ va B₁₂H₁₂²⁻ interaktiv</div>
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
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>12</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Yuzlar soni</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>20 ta uchburchak</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Qirralar soni</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>30 ta</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>I_h</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Ikosaedr — 20 ta muntazam uchburchak yuz, 12 ta uch va 30 ta qirraga ega bo&apos;lgan Platon jismidir. Koordinatsion kimyoda KS=12 lantanoid va aktinoidlarning bidentat (masalan, NO₃⁻) ligandlar bilan hosil qilgan komplekslarida uchraydi.
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
          KS=12 komplekslariga namunalar
        </h3>

        <InteraktivJadval
          sarlavha="KS=12 ikosaedrik komplekslar"
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