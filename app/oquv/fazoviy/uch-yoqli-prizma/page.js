"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[ReH₉]²⁻", nomi: "Nonagidridorenat(VII)", ion: "Re⁷⁺ (5d⁰)", xususiyat: "Kichik gidrid H⁻ ligandlari bilan klassik 9-koordinatali etalon" },
  { formula: "[Nd(H₂O)₉]³⁺", nomi: "Nonaakvaneodim(III)", ion: "Nd³⁺ (4f³)", xususiyat: "Lantanoidlarning suvli eritmalaridagi odatiy koordinatsiyasi" },
  { formula: "[La(H₂O)₉]³⁺", nomi: "Nonaakvalantan(III)", ion: "La³⁺ (4f⁰)", xususiyat: "Katta lantan(III) kationi atrofidagi 9 ta suv molekulasi" }
]

export default function UchYoqliPrizma() {
  return (
    <MavzuLayout
      sarlavha="Uch yoqli yopiq prizma (KS = 9)"
      tavsif="Koordinatsion soni 9 bo'lgan lantanoid va gidrid komplekslari • sp³d⁵ gibridlanish • D₃ₕ simmetriya"
      ikon="🎯"
      nishon="KS = 9"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Uch yoqli prizma" }
      ]}
      oldingiMavzu={{ nom: "Kubsimon geometriya (KS=8)", havola: "/oquv/fazoviy/kubsimon" }}
      keyingiMavzu={{ nom: "Ikki yoqli antiprizma (KS=10)", havola: "/oquv/fazoviy/ikki-yoqli-antiprizma" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/uch-yoqli-prizma/3d"
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
            <div className="text-xs opacity-90 font-mono">[ReH₉]²⁻ va [Nd(H₂O)₉]³⁺ interaktiv</div>
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
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>9</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Tuzilish shakli</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>6 prizma + 3 qopqoq</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>sp³d⁵</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>D₃ₕ</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Uch yoqli yopiq trigonal prizma (Tricapped trigonal prism) — trigonal prizmaning 6 ta uchidagi ligandlarga qo&apos;shimcha ravishda barcha 3 ta to&apos;rtburchak yon yuzlar markazi ustiga bittadan (jami 3 ta) ligand joylashishi natijasida yuzaga keladi. [ReH₉]²⁻ va akvalantanoidlarda uchraydi.
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
          KS=9 komplekslariga namunalar
        </h3>

        <InteraktivJadval
          sarlavha="Uch yoqli prizmatik komplekslar"
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