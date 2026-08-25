"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const ATSIDO_KOMPLEKSLAR = [
  { formula: "K₄[Fe(CN)₆]", nomi: "Kaliy geksatsianidoferrat(II)", ligand: "CN⁻ (tsianido)", ks: 6, rang: "Sariq" },
  { formula: "K₃[Co(NO₂)₆]", nomi: "Kaliy geksanitritokobaltat(III)", ligand: "NO₂⁻ (nitrito)", ks: 6, rang: "Sariq (Fischer tuzi)" },
  { formula: "K₂[PtCl₆]", nomi: "Kaliy geksaxloridoplatinat(IV)", ligand: "Cl⁻ (xlorido)", ks: 6, rang: "Sariq" },
  { formula: "K₃[Cr(C₂O₄)₃]", nomi: "Kaliy trioksalatoxromat(III)", ligand: "C₂O₄²⁻ (oksalato)", ks: 6, rang: "To'q yashil" },
  { formula: "Na₃[Ag(S₂O₃)₂]", nomi: "Natriy ditiosulfatoargentat(I)", ligand: "S₂O₃²⁻ (tiosulfato)", ks: 2, rang: "Rangsiz (fotofiksaj)" },
]

export default function Atsidokomplekslar() {
  return (
    <MavzuLayout
      sarlavha="Atsidokomplekslar"
      tavsif="Ligandi kislota qoldig'i anionlari (CN⁻, NO₂⁻, Cl⁻, C₂O₄²⁻, S₂O₃²⁻) bo'lgan eng katta komplekslar oilasi"
      ikon="⚡"
      nishon="ATSIDO LIGANDLARI"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Ligand tabiatiga ko'ra", havola: "/oquv/klassifikatsiyasi/ligand" },
        { nom: "Atsidokomplekslar" }
      ]}
      oldingiMavzu={{ nom: "Ammiakatlar", havola: "/oquv/klassifikatsiyasi/ligand/ammin" }}
      keyingiMavzu={{ nom: "Gidroksokomplekslar", havola: "/oquv/klassifikatsiyasi/ligand/gidrokso" }}
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
          <span>Atsidokomplekslar xususiyatlari</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Atsidokomplekslar</strong> (lotincha <em>acidus</em> — kislota) — ligand sifatida turli noorganik va organik kislotalarning <strong style={{ color: "var(--v3-urgu)" }}>anionlari</strong> (F⁻, Cl⁻, Br⁻, I⁻, CN⁻, SCN⁻, NO₂⁻, SO₄²⁻, C₂O₄²⁻) bog&apos;langan birikmalardir. Ularning aksariyati kuchli koordinatsion barqarorlikka ega.
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
          Eng muhim atsidokomplekslar
        </h3>

        <InteraktivJadval
          sarlavha="Atsidokomplekslar ro'yxati"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "24%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "32%" },
            { kalit: "ligand", nom: "Kislota anioni", kenglik: "22%" },
            { kalit: "rang", nom: "Rangi", kenglik: "22%" }
          ]}
          qatorlar={ATSIDO_KOMPLEKSLAR}
        />
      </div>
    </MavzuLayout>
  )
}