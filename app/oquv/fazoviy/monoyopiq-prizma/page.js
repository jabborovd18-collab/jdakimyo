"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[NbF₇]²⁻", nomi: "Geptafloroniobat(V)", ion: "Nb⁵⁺ (4d⁰)", xususiyat: "Niobiy(V) ning klassik 7-koordinatali ftorid kompleksi" },
  { formula: "[TaF₇]²⁻", nomi: "Geptaflorotantalat(V)", ion: "Ta⁵⁺ (5d⁰)", xususiyat: "Tantal(V) kristallarida monoyopiq trigonal prizma" },
  { formula: "[ZrF₇]³⁻", nomi: "Geptaflorotsirkonat(IV)", ion: "Zr⁴⁺ (4d⁰)", xususiyat: "PBP va monoyopiq prizma o'rtasida polimorfizm" }
]

export default function MonoyopiqPrizma() {
  return (
    <MavzuLayout
      sarlavha="Monoyopiq trigonal prizma (KS = 7)"
      tavsif="Koordinatsion soni 7 bo'lgan komplekslar • C₂ᵥ simmetriya • Trigonal prizmaning to'rtburchak yoqi ustida 7-ligand"
      ikon="🏰"
      nishon="KS = 7 (Monoyopiq)"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Monoyopiq prizma" }
      ]}
      oldingiMavzu={{ nom: "Pentagonal bipiramida (KS=7)", havola: "/oquv/fazoviy/pentagonal-bipiramida" }}
      keyingiMavzu={{ nom: "Kvadrat antiprizma (KS=8)", havola: "/oquv/fazoviy/kvadrat-antiprizma" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/monoyopiq-prizma/3d"
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
            <div className="text-xs opacity-90 font-mono">[NbF₇]²⁻ va [TaF₇]²⁻ interaktiv</div>
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
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>7</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>sp³d³</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>C₂ᵥ</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Tuzilish shakli</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>6 prizma + 1 qopqoq</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Monoyopiq trigonal prizma (Capped trigonal prism) — 6 ta ligand trigonal prizma uchlarida va 7-ligand to&apos;rtburchak yon yuzlardan birining markazi ustida (qopqoq tarzida) joylashishi natijasida hosil bo&apos;ladi. Nb⁵⁺ va Ta⁵⁺ ftoridlarida uchraydi.
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
          Monoyopiq prizmatik komplekslar
        </h3>

        <InteraktivJadval
          sarlavha="KS=7 monoyopiq prizma namunalari"
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