"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const GIBRIDLANISH_TURLARI = [
  { ks: "2", gibrid: "sp", geometriya: "Chiziqli (180°)", orbitallar: "s + p_z", misollar: "[Ag(NH₃)₂]⁺, [CuCl₂]⁻" },
  { ks: "3", gibrid: "sp²", geometriya: "Tekis uchburchak (120°)", orbitallar: "s + p_x + p_y", misollar: "[HgI₃]⁻" },
  { ks: "4", gibrid: "sp³", geometriya: "Tetraedr (109.5°)", orbitallar: "s + p_x + p_y + p_z", misollar: "[Zn(NH₃)₄]²⁺, [Ni(CO)₄], [CoCl₄]²⁻" },
  { ks: "4", gibrid: "dsp²", geometriya: "Tekis-kvadrat (90°)", orbitallar: "d_x²-y² + s + p_x + p_y", misollar: "[PtCl₄]²⁻, [Ni(CN)₄]²⁻, cis-[Pt(NH₃)₂Cl₂]" },
  { ks: "5", gibrid: "dsp³ (sp³d)", geometriya: "Trigonal bipiramida", orbitallar: "d_z² + s + 3p", misollar: "[Fe(CO)₅], [CuCl₅]³⁻" },
  { ks: "6", gibrid: "d²sp³", geometriya: "Oktaedr (Ichki orbitalli)", orbitallar: "(n-1)d_z², (n-1)d_x²-y² + ns + np³", misollar: "[Co(NH₃)₆]³⁺, [Fe(CN)₆]⁴⁻ (Diamagnit)" },
  { ks: "6", gibrid: "sp³d²", geometriya: "Oktaedr (Tashqi orbitalli)", orbitallar: "ns + np³ + nd_z², nd_x²-y²", misollar: "[Fe(H₂O)₆]²⁺, [CoF₆]³⁻ (Paramagnit)" },
]

export default function VBNazariyasi() {
  return (
    <MavzuLayout
      sarlavha="Valent bog'lanishlar nazariyasi (VB)"
      tavsif="Linus Pauling modeli • Bo'sh gibrid orbitallar va donor-akseptor bog'lanish • Fazoviy geometriya"
      ikon="🔗"
      nishon="01-NAZARIYA"
      yol={[
        { nom: "Kimyoviy bog'lanish", havola: "/oquv/kimyoviy-boglanish" },
        { nom: "VB nazariyasi" }
      ]}
      keyingiMavzu={{ nom: "Kristall maydon nazariyasi", havola: "/oquv/kimyoviy-boglanish/kristall-maydon" }}
      quizHavola="/oquv/video-darsliklar/quiz/kimyoviy-boglanish"
    >
      {/* ═══ 1. KIRISH ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
          <span>📋</span>
          <span>VB nazariyasining asosiy qoidalari</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Valent bog&apos;lanishlar (VB) nazariyasi</strong> (1931, Linus Pauling) bo&apos;yicha markaziy metall kationi o&apos;zining bo&apos;sh s-, p- va d-orbitallarini gibridlab, ligandlar bilan koordinatsion (donor-akseptor) bog&apos; hosil qiladi. Bunda metall <strong>akseptor</strong>, ligand esa taqsimlanmagan juft elektron beruvchi <strong>donor</strong> hisoblanadi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
          <div className="p-4 rounded-xl border space-y-1.5" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <strong style={{ color: "var(--v3-urgu)" }}>Ichki orbitalli komplekslar (d²sp³):</strong>
            <p className="v3-xira text-xs leading-relaxed">Kuchli ligandlar (CN⁻, NH₃) ta&apos;sirida d-elektronlar juftlashadi va ichki (n-1)d orbitallar bo&apos;shab gibridlanishda qatnashadi. Ular past spinli yoki diamagnit bo&apos;ladi.</p>
          </div>
          <div className="p-4 rounded-xl border space-y-1.5" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
            <strong style={{ color: "var(--v3-urgu)" }}>Tashqi orbitalli komplekslar (sp³d²):</strong>
            <p className="v3-xira text-xs leading-relaxed">Kuchsiz ligandlar (F⁻, H₂O) d-elektronlarni juftlay olmaydi, gibridlanishga tashqi nd orbitallar jalb qilinadi. Ular yuqori spinli va paramagnit bo&apos;ladi.</p>
          </div>
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
          Gibridlanish turlari va fazoviy geometriya
        </h3>

        <InteraktivJadval
          sarlavha="VB gibridlanish jadvali"
          ustunlar={[
            { kalit: "ks", nom: "KS", kenglik: "10%" },
            { kalit: "gibrid", nom: "Gibridlanish", format: "kod", kenglik: "18%" },
            { kalit: "geometriya", nom: "Fazoviy shakli", kenglik: "24%" },
            { kalit: "orbitallar", nom: "Ishtirok etuvchi orbitallar", kenglik: "24%" },
            { kalit: "misollar", nom: "Namunaviy komplekslar", kenglik: "24%" }
          ]}
          qatorlar={GIBRIDLANISH_TURLARI}
        />
      </div>
    </MavzuLayout>
  )
}