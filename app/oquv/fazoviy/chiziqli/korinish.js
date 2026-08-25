"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  {
    formula: "[Ag(NH₃)₂]⁺",
    nomi: "Diamminkumush(I) ioni",
    ion: "Ag⁺ (4d¹⁰)",
    ligand: "2 × NH₃",
    rang: "Rangsiz",
    magnit: "Diamagnit",
    qollanilish: "Tollens reaktivi (kumush oyna)"
  },
  {
    formula: "[Ag(CN)₂]⁻",
    nomi: "Disianoargentat(I) ioni",
    ion: "Ag⁺ (4d¹⁰)",
    ligand: "2 × CN⁻",
    rang: "Rangsiz",
    magnit: "Diamagnit",
    qollanilish: "Galvanotexnika, kumush qoplash"
  },
  {
    formula: "[Cu(NH₃)₂]⁺",
    nomi: "Diamminmis(I) ioni",
    ion: "Cu⁺ (3d¹⁰)",
    ligand: "2 × NH₃",
    rang: "Rangsiz",
    magnit: "Diamagnit",
    qollanilish: "Mis(I) eritmalari"
  },
  {
    formula: "[Au(CN)₂]⁻",
    nomi: "Disianoaurat(I) ioni",
    ion: "Au⁺ (5d¹⁰)",
    ligand: "2 × CN⁻",
    rang: "Rangsiz",
    magnit: "Diamagnit",
    qollanilish: "Sianid usulida oltin ajratish"
  },
  {
    formula: "[Hg(NH₃)₂]²⁺",
    nomi: "Diamminmerkuriy(II) ioni",
    ion: "Hg²⁺ (5d¹⁰)",
    ligand: "2 × NH₃",
    rang: "Rangsiz",
    magnit: "Diamagnit",
    qollanilish: "Tibbiyot va kimyoviy sintez"
  }
]

export default function Chiziqli() {
  return (
    <MavzuLayout
      sarlavha="Chiziqli geometriya (KS = 2)"
      tavsif="Koordinatsion soni 2 bo'lgan komplekslar • sp (sd) gibridlanish • 180° valent burchak • D_∞h simmetriya"
      ikon="📏"
      nishon="KS = 2"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Chiziqli geometriya" }
      ]}
      oldingiMavzu={{ nom: "Fazoviy geometriyalar", havola: "/oquv/fazoviy" }}
      keyingiMavzu={{ nom: "Uchburchak tekislik (KS=3)", havola: "/oquv/fazoviy/uchburchak" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/chiziqli/3d"
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
            <div className="text-xs opacity-90 font-mono">[Ag(NH₃)₂]⁺ va [Au(CN)₂]⁻ interaktiv</div>
          </div>
        </Link>
      </div>

      {/* ═══ 1. XUSUSIYATLAR VA PARAMETRLAR ═══ */}
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
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>2</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Valent burchak</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>180°</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>sp / sd</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya guruhi</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>D_∞h</strong>
          </div>
        </div>

        <div className="pt-2">
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            Chiziqli geometriyada markaziy atom va 2 ta ligand bitta to&apos;g&apos;ri chiziq bo&apos;ylab 180° burchak ostida joylashadi. Bu konfiguratsiya asosan d¹⁰ elektron qobiqqa ega bo&apos;lgan o&apos;tish metallari (Ag⁺, Au⁺, Cu⁺, Hg²⁺) uchun xosdir.
          </p>
        </div>
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
          Chiziqli komplekslarga namunalar
        </h3>

        <InteraktivJadval
          sarlavha="KS=2 bo'lgan kompleks birikmalar"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "24%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "28%" },
            { kalit: "ion", nom: "Metall kationi", format: "kod", kenglik: "18%" },
            { kalit: "qollanilish", nom: "Amaliy qo'llanilishi", kenglik: "30%" }
          ]}
          qatorlar={MISOLLAR}
        />
      </div>
    </MavzuLayout>
  )
}