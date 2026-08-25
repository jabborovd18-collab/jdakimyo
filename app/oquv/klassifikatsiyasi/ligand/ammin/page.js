"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const AMMIN_KOMPLEKSLAR = [
  { formula: "[Co(NH₃)₆]Cl₃", nomi: "Geksaamminkobalt(III) xlorid", markaz: "Co³⁺ (d⁶)", rang: "Zarg'aldoq-sariq", ks: 6 },
  { formula: "[Cu(NH₃)₄]SO₄", nomi: "Tetraamminmis(II) sulfat", markaz: "Cu²⁺ (d⁹)", rang: "To'q ko'k", ks: 4 },
  { formula: "[Ni(NH₃)₆]Cl₂", nomi: "Geksaamminnikel(II) xlorid", markaz: "Ni²⁺ (d⁸)", rang: "Binafsha-ko'k", ks: 6 },
  { formula: "[Ag(NH₃)₂]Cl", nomi: "Diamminkumush(I) xlorid", markaz: "Ag⁺ (d¹⁰)", rang: "Rangsiz", ks: 2 },
  { formula: "[Pt(NH₃)₄]Cl₂", nomi: "Tetraamminplatina(II) xlorid", markaz: "Pt²⁺ (d⁸)", rang: "Oq-sarg'ish", ks: 4 },
  { formula: "[Zn(NH₃)₄]SO₄", nomi: "Tetraamminrux(II) sulfat", markaz: "Zn²⁺ (d¹⁰)", rang: "Rangsiz", ks: 4 },
]

export default function Ammiakatlar() {
  return (
    <MavzuLayout
      sarlavha="Ammiakatlar (Ammin komplekslar)"
      tavsif="Ligandi NH₃ (ammiak molekulasi) bo'lgan, azotning bo'sh elektron jufti orqali koordinatsiyalangan birikmalar"
      ikon="🧪"
      nishon="AMMIN LIGANDI"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Ligand tabiatiga ko'ra", havola: "/oquv/klassifikatsiyasi/ligand" },
        { nom: "Ammiakatlar" }
      ]}
      oldingiMavzu={{ nom: "Akvakomplekslar", havola: "/oquv/klassifikatsiyasi/ligand/akva" }}
      keyingiMavzu={{ nom: "Atsidokomplekslar", havola: "/oquv/klassifikatsiyasi/ligand/atsido" }}
      quizHavola="/oquv/video-darsliklar/quiz/klassifikatsiyasi"
    >
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
          <span>📋</span>
          <span>Ammiakatlar xususiyatlari</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Ammiakatlar</strong> — ligand sifatida <strong style={{ color: "var(--v3-urgu)" }}>ammiak (NH₃)</strong> molekulasini tutgan komplekslardir. IUPAC nomenklaturasida &quot;ammin&quot; deb yoziladi (ikkita &apos;m&apos; bilan, organik aminlardan farqlash uchun). Ammiak suvga nisbatan kuchliroq maydon hosil qiladi, shuning uchun ko&apos;pincha akvakomplekslardagi suvni siqib chiqarib, barqarorroq ammiakatlarga aylanadi.
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h3 className="text-lg font-bold" style={{ color: "var(--v3-matn)" }}>
          Keng tarqalgan ammin komplekslar
        </h3>

        <InteraktivJadval
          sarlavha="Ammiakatlar ro'yxati"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "24%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "30%" },
            { kalit: "markaz", nom: "Markaziy atom", kenglik: "20%" },
            { kalit: "rang", nom: "Rangi", kenglik: "26%" }
          ]}
          qatorlar={AMMIN_KOMPLEKSLAR}
        />
      </div>
    </MavzuLayout>
  )
}