"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[Fe(η⁵-C₅H₅)₂]", nomi: "Bis(siklopentadienil)temir (Ferrosen)", xususiyat: "1951-yilda kashf etilgan, 1973-yil Nobel mukofoti (Fischer, Wilkinson), 18e⁻ qoidasiga to'liq mos", rang: "To'q sariq" },
  { formula: "[Cr(η⁶-C₆H₆)₂]", nomi: "Bis(benzol)xrom(0)", xususiyat: "Ikkita neytral benzol halqasi orasida xrom atomi, 18e⁻", rang: "Jigarrang" },
  { formula: "[U(η⁸-C₈H₈)₂]", nomi: "Uranotsen", xususiyat: "Siklooktatetraen (COT²⁻) halqalari bilan aktinoid sendvichi", rang: "Yashil" },
  { formula: "[Co(η⁵-C₅H₅)₂]", nomi: "Kobaltotsen", xususiyat: "19 elektronli kuchli qaytaruvchi radikal (1 ta toq elektron)", rang: "To'q binafsha" },
  { formula: "[Ni(η⁵-C₅H₅)₂]", nomi: "Nikelotsen", xususiyat: "20 elektronli paramagnit (2 ta toq elektron)", rang: "Zumrad yashil" }
]

export default function Sendvich() {
  return (
    <MavzuLayout
      sarlavha="Sendvich birikmalar (Metallosenlar)"
      tavsif="Aromatik π-halqalar orasidagi metall atomi • Ferrosen va 18-elektron qoidasi • 1973-yil Nobel mukofoti"
      ikon="🥪"
      nishon="π-KOMPLEKSLAR"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Sendvich komplekslar" }
      ]}
      oldingiMavzu={{ nom: "Ikosaedrik geometriya (KS=12)", havola: "/oquv/fazoviy/ikosaedrik" }}
      keyingiMavzu={{ nom: "CPK ranglar jadvali", havola: "/oquv/fazoviy/cpk-ranglar" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/sendvich/3d"
          className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl font-bold transition-transform hover:scale-105 shadow-sm border"
          style={{
            background: "var(--v3-urgu)",
            color: "var(--v3-urgu-matn)",
            borderColor: "var(--v3-urgu)"
          }}
        >
          <span className="text-3xl">🥪</span>
          <div className="text-left">
            <div className="text-base sm:text-lg font-extrabold">3D Modelni Ko&apos;rish</div>
            <div className="text-xs opacity-90 font-mono">Ferrosen [Fe(C₅H₅)₂] interaktiv 3D</div>
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
          <span>Sendvich tuzilish mohiyati</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Markaziy metall</span>
            <strong className="text-base" style={{ color: "var(--v3-urgu)" }}>Fe²⁺ (d⁶)</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gaptlik</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>η⁵ (har bir halqa)</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Valent elektronlar</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>18 e⁻</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>D₅ₕ / D₅_d</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Ferrosenda temir atomi ikkita parallel siklopentadienil halqasi orasida joylashadi. Temirning d-orbitallari va halqaning delokallangan π-molekulyar orbitallari o&apos;rtasida kuchli kovalent kovergent bog&apos;lanish yuzaga keladi.
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
          Sendvich (metallosen) komplekslari
        </h3>

        <InteraktivJadval
          sarlavha="Metallosenlar oilasi"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "24%" },
            { kalit: "nomi", nom: "Nomi", kenglik: "28%" },
            { kalit: "rang", nom: "Rangi", kenglik: "16%" },
            { kalit: "xususiyat", nom: "Xususiyati", kenglik: "32%" }
          ]}
          qatorlar={MISOLLAR}
        />
      </div>
    </MavzuLayout>
  )
}