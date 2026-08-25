"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const GIDROKSO_KOMPLEKSLAR = [
  { formula: "Na[Al(OH)₄]", nomi: "Natriy tetragidroksidoalyuminat(III)", amfoter: "Al(OH)₃ + NaOH", ks: 4, eritma: "Rangsiz shaffof" },
  { formula: "Na₂[Zn(OH)₄]", nomi: "Natriy tetragidroksidotsinkat(II)", amfoter: "Zn(OH)₂ + 2NaOH", ks: 4, eritma: "Rangsiz" },
  { formula: "K₂[Pb(OH)₄]", nomi: "Kaliy tetragidroksidoplyumbat(II)", amfoter: "Pb(OH)₂ + 2KOH", ks: 4, eritma: "Rangsiz" },
  { formula: "K₂[Pb(OH)₆]", nomi: "Kaliy geksagidroksidoplyumbat(IV)", amfoter: "PbO₂ + 2KOH + 2H₂O", ks: 6, eritma: "Rangsiz" },
  { formula: "K₃[Cr(OH)₆]", nomi: "Kaliy geksagidroksidoxromat(III)", amfoter: "Cr(OH)₃ + 3KOH", ks: 6, eritma: "Yashil" },
  { formula: "Na₂[Sn(OH)₆]", nomi: "Natriy geksagidroksidostannat(IV)", amfoter: "SnO₂ + 2NaOH + 2H₂O", ks: 6, eritma: "Rangsiz" },
]

export default function Gidroksokomplekslar() {
  return (
    <MavzuLayout
      sarlavha="Gidroksokomplekslar"
      tavsif="Ligandi OH⁻ (gidroksid ioni) bo'lgan, amfoter metall gidroksidlarining ishqor ortiqchasida erishidan hosil bo'luvchi komplekslar"
      ikon="🔬"
      nishon="GIDROKSO LIGANDI"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Ligand tabiatiga ko'ra", havola: "/oquv/klassifikatsiyasi/ligand" },
        { nom: "Gidroksokomplekslar" }
      ]}
      oldingiMavzu={{ nom: "Atsidokomplekslar", havola: "/oquv/klassifikatsiyasi/ligand/atsido" }}
      keyingiMavzu={{ nom: "Galogenid komplekslar", havola: "/oquv/klassifikatsiyasi/ligand/galogenid" }}
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
          <span>Gidroksokomplekslar mohiyati</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Gidroksokomplekslar</strong> — ligand sifatida <strong style={{ color: "var(--v3-urgu)" }}>gidroksid (OH⁻)</strong> ionlarini tutgan anion komplekslardir. Ular amfoter elementlar (Al, Zn, Be, Cr, Sn, Pb) ning gidroksidlari yoki tuzlariga kuchli ishqor (NaOH, KOH) eritmasi ortiqcha miqdorda qo&apos;shilganda cho&apos;kmaning qayta erishi orqali hosil bo&apos;ladi.
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
          Amfoter metallarning gidroksokomplekslari
        </h3>

        <InteraktivJadval
          sarlavha="Gidroksokomplekslar jadvali"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "24%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "32%" },
            { kalit: "amfoter", nom: "Hosil bo'lish reaksiyasi", kenglik: "24%" },
            { kalit: "eritma", nom: "Eritma rangi", kenglik: "20%" }
          ]}
          qatorlar={GIDROKSO_KOMPLEKSLAR}
        />
      </div>
    </MavzuLayout>
  )
}