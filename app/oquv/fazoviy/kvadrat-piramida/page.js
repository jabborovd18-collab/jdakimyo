"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[VO(acac)₂]", nomi: "Vanadil atsetilatsetonat", ion: "V⁴⁺ (3d¹)", xususiyat: "V=O qo'shbog'i kuchli qisqarish hosil qilib apikal uchda turadi" },
  { formula: "[Ni(CN)₅]³⁻", nomi: "Pentasianonikelat(II)", ion: "Ni²⁺ (3d⁸)", xususiyat: "Kvadrat piramida va TBP oraliq holatida" },
  { formula: "[InCl₅]²⁻", nomi: "Pentaxloroindat(III)", ion: "In³⁺", xususiyat: "Anorganik indiy(III) xlorid kompleksi" },
  { formula: "[Fe(porfirin)(Cl)]", nomi: "Xlorohemin", ion: "Fe³⁺ (3d⁵)", xususiyat: "Gemoglobin va mioglobin faol markazi modeli" }
]

export default function KvadratPiramida() {
  return (
    <MavzuLayout
      sarlavha="Kvadrat piramida geometriyasi (KS = 5)"
      tavsif="Koordinatsion soni 5 bo'lgan komplekslar • sp³d (d_x²-y²) gibridlanish • ~90° valent burchaklar • C₄ᵥ simmetriya"
      ikon="🏛️"
      nishon="KS = 5 (SP)"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Kvadrat piramida" }
      ]}
      oldingiMavzu={{ nom: "Trigonal bipiramida (KS=5)", havola: "/oquv/fazoviy/trigonal-bipiramida" }}
      keyingiMavzu={{ nom: "Oktaedrik geometriya (KS=6)", havola: "/oquv/fazoviy/oktaedrik" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/kvadrat-piramida/3d"
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
            <div className="text-xs opacity-90 font-mono">[VO(acac)₂] interaktiv 3D</div>
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
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>5</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Valent burchak</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>~90°</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>sp³d (d_x²-y²)</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>C₄ᵥ</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Kvadrat piramidada 4 ta bazal ligand kvadrat shaklidagi asosda joylashadi, 1 ta apikal ligand esa piramida uchini egallaydi. Odatda metall ioni kvadrat asosdan apikal ligand tomonga biroz ko&apos;tarilgan bo&apos;ladi.
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
          Kvadrat piramidal komplekslar
        </h3>

        <InteraktivJadval
          sarlavha="KS=5 kvadrat piramidal komplekslar"
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