"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const AKVA_KOMPLEKSLAR = [
  { formula: "[Cu(H₂O)₆]²⁺", nomi: "Geksaakvamis(II) ioni", ion: "Cu²⁺ (d⁹)", rang: "Moviy-havorang", geometriya: "Buzilgan oktaedr (Yan-Teller)" },
  { formula: "[Co(H₂O)₆]²⁺", nomi: "Geksaakvakobalt(II) ioni", ion: "Co²⁺ (d⁷)", rang: "Pushti", geometriya: "Oktaedrik" },
  { formula: "[Ni(H₂O)₆]²⁺", nomi: "Geksaakvanikel(II) ioni", ion: "Ni²⁺ (d⁸)", rang: "Yashil", geometriya: "Muntazam oktaedr" },
  { formula: "[Cr(H₂O)₆]³⁺", nomi: "Geksaakvaxrom(III) ioni", ion: "Cr³⁺ (d³)", rang: "Binafsha", geometriya: "Muntazam oktaedr" },
  { formula: "[Fe(H₂O)₆]²⁺", nomi: "Geksaakvatemir(II) ioni", ion: "Fe²⁺ (d⁶)", rang: "Och yashil", geometriya: "Oktaedrik (yuqori spinli)" },
  { formula: "[Fe(H₂O)₆]³⁺", nomi: "Geksaakvatemir(III) ioni", ion: "Fe³⁺ (d⁵)", rang: "Sariq-jigarrang", geometriya: "Oktaedrik" },
  { formula: "[Ti(H₂O)₆]³⁺", nomi: "Geksaakvatitan(III) ioni", ion: "Ti³⁺ (d¹)", rang: "Binafsha-qizg'ish", geometriya: "Oktaedrik (d-d o'tish)" },
  { formula: "[Mn(H₂O)₆]²⁺", nomi: "Geksaakvamarganes(II) ioni", ion: "Mn²⁺ (d⁵)", rang: "Och pushti (deyarli rangsiz)", geometriya: "Oktaedrik (spin taqiqlangan)" },
]

export default function Akvakomplekslar() {
  return (
    <MavzuLayout
      sarlavha="Akvakomplekslar"
      tavsif="Ligandi H₂O (suv molekulasi) bo'lgan, eritmalar va kristallar holidagi eng keng tarqalgan komplekslar"
      ikon="💧"
      nishon="AKVA LIGANDI"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Ligand tabiatiga ko'ra", havola: "/oquv/klassifikatsiyasi/ligand" },
        { nom: "Akvakomplekslar" }
      ]}
      keyingiMavzu={{ nom: "Ammiakatlar", havola: "/oquv/klassifikatsiyasi/ligand/ammin" }}
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
          <span>Akvakomplekslar haqida</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Akvakomplekslar</strong> — ligandi <strong style={{ color: "var(--v3-urgu)" }}>suv (H₂O)</strong> bo&apos;lgan birikmalardir. Suv molekulasidagi kislorod atomi o&apos;zining taqsimlanmagan elektron jufti orqali markaziy metall ioni bilan donor-akseptor bog&apos; hosil qiladi. Suvli eritmada deyarli barcha o&apos;tish metallari erkin ion holida emas, aynan akvakomplekslar <code className="font-mono text-xs px-1 rounded" style={{ background: "var(--v3-yuza-2)" }}>[M(H₂O)₆]ⁿ⁺</code> ko&apos;rinishida mavjud bo&apos;ladi.
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
          Eng muhim akvakomplekslar jadvali
        </h3>

        <InteraktivJadval
          sarlavha="Akvakompleks ionlari va ranglari"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "22%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "28%" },
            { kalit: "ion", nom: "Metall konfiguratsiyasi", kenglik: "20%" },
            { kalit: "rang", nom: "Eritmadagi rangi", kenglik: "30%" }
          ]}
          qatorlar={AKVA_KOMPLEKSLAR}
        />
      </div>
    </MavzuLayout>
  )
}