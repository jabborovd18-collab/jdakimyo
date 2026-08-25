"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[Pt(PPh₃)₃]", nomi: "Tris(trifenilfosfin)platina(0)", ion: "Pt⁰ (5d¹⁰)", xususiyat: "Katta hajmga ega fosfin ligandlari bilan barqaror" },
  { formula: "[Cu(CN)₃]²⁻", nomi: "Trisiyanokuprat(I) ioni", ion: "Cu⁺ (3d¹⁰)", xususiyat: "Eritmada va kristall panjarada tekis uchburchak" },
  { formula: "[HgI₃]⁻", nomi: "Triyodomerkurat(II) ioni", ion: "Hg²⁺ (5d¹⁰)", xususiyat: "Katta yodid ligandlari fazoviy to'siq yaratadi" },
  { formula: "BF₃", nomi: "Bor triftorid (Klassik)", ion: "B³⁺ (sp²)", xususiyat: "Klassik 120° tekis uchburchak etaloni" }
]

export default function Uchburchak() {
  return (
    <MavzuLayout
      sarlavha="Uchburchak tekislik geometriyasi (KS = 3)"
      tavsif="Koordinatsion soni 3 bo'lgan komplekslar • sp² gibridlanish • 120° valent burchak • D₃ₕ simmetriya"
      ikon="📐"
      nishon="KS = 3"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Uchburchak tekislik" }
      ]}
      oldingiMavzu={{ nom: "Chiziqli geometriya (KS=2)", havola: "/oquv/fazoviy/chiziqli" }}
      keyingiMavzu={{ nom: "Tetraedrik geometriya (KS=4)", havola: "/oquv/fazoviy/tetraedrik" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/uchburchak/3d"
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
            <div className="text-xs opacity-90 font-mono">[Cu(CN)₃]²⁻ va [Pt(PPh₃)₃] interaktiv</div>
          </div>
        </Link>
      </div>

      {/* ═══ 1. XUSUSIYATLAR ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
          <span>📋</span>
          <span>Geometrik parametrlar</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Koordinatsion son</span>
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>3</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Valent burchak</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>120°</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>sp²</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>D₃ₕ</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Uchburchak tekislik shaklida 3 ta ligand markaziy atom atrofida bitta tekislikda 120° burchak ostida joylashadi. Bu shakl koordinatsion kimyoda kam uchraydi va asosan d¹⁰ metallari katta hajmli (sterik to&apos;siqli) ligandlar (masalan, trifenilfosfin PPh₃) bilan birikkanda hosil bo&apos;ladi.
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
          KS=3 komplekslariga namunalar
        </h3>

        <InteraktivJadval
          sarlavha="Uchburchak tekislik komplekslari"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "25%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "30%" },
            { kalit: "ion", nom: "Metall holati", format: "kod", kenglik: "18%" },
            { kalit: "xususiyat", nom: "Xususiyati", kenglik: "27%" }
          ]}
          qatorlar={MISOLLAR}
        />
      </div>
    </MavzuLayout>
  )
}