"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const NITRIT_KOMPLEKSLAR = [
  { formula: "[Co(NH₃)₅(NO₂)]Cl₂", nomi: "Pentaammin(nitrito-κN)kobalt(III) xlorid (Nitro izomer)", donor: "Azot (N)", rang: "Sariq (barqaror)" },
  { formula: "[Co(NH₃)₅(ONO)]Cl₂", nomi: "Pentaammin(nitrito-κO)kobalt(III) xlorid (Nitrito izomer)", donor: "Kislorod (O)", rang: "Qizil (termik labil)" },
  { formula: "K₃[Co(NO₂)₆]", nomi: "Kaliy geksanitritokobaltat(III)", donor: "Barchasi N orqali", rang: "Sariq kristall" },
  { formula: "Na₃[Co(NO₂)₆]", nomi: "Natriy geksanitritokobaltat(III)", donor: "Barchasi N orqali", rang: "K⁺ ionini aniqlovchi reagent" },
]

export default function NitritKomplekslar() {
  return (
    <MavzuLayout
      sarlavha="Nitrit komplekslar (Ambidentat bog'lanish)"
      tavsif="Ligandi NO₂⁻ yoki ONO⁻ bo'lgan, azot yoki kislorod orqali bog'lanish izomeriyasi hosil qiluvchi komplekslar"
      ikon="🟠"
      nishon="NITRIT LIGANDI"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Ligand tabiatiga ko'ra", havola: "/oquv/klassifikatsiyasi/ligand" },
        { nom: "Nitrit komplekslar" }
      ]}
      oldingiMavzu={{ nom: "Nitrozil komplekslar", havola: "/oquv/klassifikatsiyasi/ligand/nitrozil" }}
      keyingiMavzu={{ nom: "Xelat komplekslar", havola: "/oquv/klassifikatsiyasi/ligand/xelat" }}
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
          <span>Ambidentat nitrit ligandining mohiyati</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Nitrit ioni (NO₂⁻)</strong> — ambidentat (ikki xil donor atomli) ligand hisoblanadi. U markaziy metall bilan <strong style={{ color: "var(--v3-urgu)" }}>azot atomi</strong> orqali bog&apos;lansa <em>nitro-</em> (nitrito-κN), <strong style={{ color: "var(--v3-urgu-2)" }}>kislorod atomi</strong> orqali bog&apos;lansa <em>nitrito-</em> (nitrito-κO) izomeri deb ataladi. Bu bog&apos;lanish izomeriyasining eng klassik namunasi hisoblanadi (Verner va Yorgensen tomonidan 1894-yilda o&apos;rganilgan).
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
          Nitrit va nitro komplekslar
        </h3>

        <InteraktivJadval
          sarlavha="Nitrit komplekslari va izomerlari"
          ustunlar={[
            { kalit: "formula", nom: "Formula", format: "formula", kenglik: "24%" },
            { kalit: "nomi", nom: "IUPAC nomi", kenglik: "32%" },
            { kalit: "donor", nom: "Koordinatsiyalangan atom", kenglik: "22%" },
            { kalit: "rang", nom: "Rangi va barqarorligi", kenglik: "22%" }
          ]}
          qatorlar={NITRIT_KOMPLEKSLAR}
        />
      </div>
    </MavzuLayout>
  )
}