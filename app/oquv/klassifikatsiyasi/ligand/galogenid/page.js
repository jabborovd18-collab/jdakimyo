"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const GALOGENID_KOMPLEKSLAR = [
  { formula: "H₂[SiF₆]", nomi: "Geksaftoridosilikat(IV) kislota", galogen: "F⁻ (ftorido)", ks: 6, xossasi: "Shishani erituvchi kislota" },
  { formula: "K₂[PtCl₆]", nomi: "Kaliy geksaxloridoplatinat(IV)", galogen: "Cl⁻ (xlorido)", ks: 6, xossasi: "Sariq kristall analitik reagent" },
  { formula: "K₂[HgI₄]", nomi: "Kaliy tetrayodidomerkurat(II) (Nessler reagenti)", galogen: "I⁻ (yodido)", ks: 4, xossasi: "NH₃ va NH₄⁺ ionlarini aniqlashda sariq-jigarrang cho'kma beradi" },
  { formula: "[CoCl₄]²⁻", nomi: "Tetraxloridokobaltat(II) ioni", galogen: "Cl⁻ (xlorido)", ks: 4, xossasi: "Tetraedrik, to'q ko'k rangli (suvsizlangan muhitda)" },
  { formula: "Na[AuCl₄]", nomi: "Natriy tetraxloridoaurat(III)", galogen: "Cl⁻ (xlorido)", ks: 4, xossasi: "Oltin xloridli kompleksi" },
]

export default function GalogenidKomplekslar() {
  return (
    <MavzuLayout
      sarlavha="Galogenid komplekslar"
      tavsif="Ligandi galogen ionlari (F⁻, Cl⁻, Br⁻, I⁻) bo'lgan eng muhim noorganik komplekslar"
      ikon="🧂"
      nishon="GALOGENID LIGANDLARI"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Ligand tabiatiga ko'ra", havola: "/oquv/klassifikatsiyasi/ligand" },
        { nom: "Galogenid komplekslar" }
      ]}
      oldingiMavzu={{ nom: "Gidroksokomplekslar", havola: "/oquv/klassifikatsiyasi/ligand/gidrokso" }}
      keyingiMavzu={{ nom: "Karbonil komplekslar", havola: "/oquv/klassifikatsiyasi/ligand/karbonil" }}
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
          <span>Galogenid komplekslar xususiyatlari</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Galogenid komplekslar</strong> — ligandi galogenid ionlari (<strong style={{ color: "var(--v3-urgu)" }}>F⁻, Cl⁻, Br⁻, I⁻</strong>) bo&apos;lgan atsidokomplekslarning maxsus katta sinfidir. Ular kuchsiz maydon hosil qiluvchi (spektrokimyoviy qatorda chapda turuvchi) ligandlar bo&apos;lib, ko&apos;pincha yuqori spinli oktaedrik yoki tetraedrik geometriyani hosil qiladi.
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
          Galogenid komplekslarining analitik namunalari
        </h3>

        <InteraktivJadval
          sarlavha="Galogenid komplekslar jadvali"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "22%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "30%" },
            { kalit: "galogen", nom: "Galogen ioni", kenglik: "18%" },
            { kalit: "xossasi", nom: "Amaliy xossasi", kenglik: "30%" }
          ]}
          qatorlar={GALOGENID_KOMPLEKSLAR}
        />
      </div>
    </MavzuLayout>
  )
}