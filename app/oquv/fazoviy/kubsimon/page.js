"use client"

import Link from "next/link"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  { formula: "[UF₈]⁴⁻", nomi: "Oktaflorouranat(IV)", ion: "U⁴⁺ (5f²)", xususiyat: "Katta ion radiusli uran(IV) ning kubik ftorid kompleksi" },
  { formula: "[PaF₈]³⁻", nomi: "Oktafloroprotaktinat(V)", ion: "Pa⁵⁺ (5f⁰)", xususiyat: "Aktinoidlarga xos f-orbitallar ishtirokidagi kubsimon shakl" },
  { formula: "[Th(C₂O₄)₄]⁴⁻", nomi: "Tetraoksalatotorat(IV)", ion: "Th⁴⁺ (5f⁰)", xususiyat: "Toriy(IV) ning yuqori simmetriyali kubik kristall panjarasi" }
]

export default function Kubsimon() {
  return (
    <MavzuLayout
      sarlavha="Kubsimon geometriya (KS = 8)"
      tavsif="Koordinatsion soni 8 bo'lgan yuqori simmetriyali shakl • sp³d³f gibridlanish • O_h simmetriya • Aktinoidlar uchun xos"
      ikon="🧊"
      nishon="KS = 8 (Kub)"
      yol={[
        { nom: "Fazoviy tuzilishi", havola: "/oquv/fazoviy" },
        { nom: "Kubsimon geometriya" }
      ]}
      oldingiMavzu={{ nom: "Dodekaedrik geometriya (KS=8)", havola: "/oquv/fazoviy/dodekaedrik" }}
      keyingiMavzu={{ nom: "Uch yoqli yopiq prizma (KS=9)", havola: "/oquv/fazoviy/uch-yoqli-prizma" }}
      quizHavola="/oquv/video-darsliklar/quiz/fazoviy"
    >
      {/* ═══ 3D TUGMA ═══ */}
      <div className="text-center">
        <Link
          href="/oquv/fazoviy/kubsimon/3d"
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
            <div className="text-xs opacity-90 font-mono">[UF₈]⁴⁻ va [PaF₈]³⁻ interaktiv</div>
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
            <span className="v3-xira text-[11px] block">Valent burchak</span>
            <strong className="text-base" style={{ color: "var(--v3-matn)" }}>70.5° & 109.5°</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Gibridlanish</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-matn)" }}>sp³d³f</strong>
          </div>
          <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <span className="v3-xira text-[11px] block">Simmetriya</span>
            <strong className="text-base font-mono" style={{ color: "var(--v3-urgu-2)" }}>O_h</strong>
          </div>
        </div>

        <p className="v3-xira text-xs sm:text-sm leading-relaxed pt-2">
          Kubsimon geometriyalarda 8 ta ligand kubning 8 ta uchida joylashadi. Kub shaklida ligandlar o&apos;zaro to&apos;g&apos;ri burchakli to&apos;rtburchaklarda ro&apos;para turgani sababli itarilish kuchi yuqori bo&apos;ladi, shuning uchun bu shakl asosan f-metallarning katta ionlarida (U⁴⁺, Th⁴⁺, Pa⁵⁺) uchraydi.
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
          Kubsimon komplekslar
        </h3>

        <InteraktivJadval
          sarlavha="KS=8 kubsimon komplekslar"
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