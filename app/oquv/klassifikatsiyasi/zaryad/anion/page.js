"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const MISOLLAR = [
  {
    formula: "K₄[Fe(CN)₆]",
    nomi: "Kaliy geksatsianidoferrat(II)",
    hisob: "Fe²⁺ (+2) + 6×CN⁻ (-6) = -4",
    zaryad: "-4",
    tashqi: "4K⁺ (ishqoriy metall kationlari)"
  },
  {
    formula: "Na[AuCl₄]",
    nomi: "Natriy tetraxloridoaurat(III)",
    hisob: "Au³⁺ (+3) + 4×Cl⁻ (-4) = -1",
    zaryad: "-1",
    tashqi: "Na⁺ (kation)"
  },
  {
    formula: "H₂[SiF₆]",
    nomi: "Geksaftoridosilikat(IV) kislota",
    hisob: "Si⁴⁺ (+4) + 6×F⁻ (-6) = -2",
    zaryad: "-2",
    tashqi: "2H⁺ (vodorod kationlari)"
  }
]

export default function AnionKomplekslar() {
  return (
    <MavzuLayout
      sarlavha="Anion komplekslar"
      tavsif="Ichki koordinatsion sferasi manfiy zaryadga ega bo'lgan komplekslar va ularning nomenklatura qoidalari"
      ikon="➖"
      nishon="ANION KOMPLEKSLAR"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Zaryadiga ko'ra", havola: "/oquv/klassifikatsiyasi/zaryad" },
        { nom: "Anion komplekslar" }
      ]}
      oldingiMavzu={{ nom: "Kation komplekslar", havola: "/oquv/klassifikatsiyasi/zaryad/kation" }}
      keyingiMavzu={{ nom: "Neytral komplekslar", havola: "/oquv/klassifikatsiyasi/zaryad/neytral" }}
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
          <span>Anion komplekslar mohiyati</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Anion komplekslar</strong> — ichki sferasining umumiy zaryadi manfiy bo&apos;lgan birikmalardir. Anion ligandlar (CN⁻, Cl⁻, F⁻, OH⁻) keltirgan manfiy zaryad markaziy metallning musbat zaryadidan ko&apos;p bo&apos;lganda hosil bo&apos;ladi. Nomlanishida markaziy metall nomiga <strong style={{ color: "var(--v3-urgu)" }}>&quot;-at&quot;</strong> qo&apos;shimchasi ulanadi.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {MISOLLAR.map((m, i) => (
          <div
            key={m.formula}
            className="rounded-2xl p-6 border shadow-xs space-y-4"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: "var(--v3-chiziq)" }}>
              <div className="font-mono text-base sm:text-lg font-bold" style={{ color: "var(--v3-matn)" }}>
                <KimyoFormula formula={m.formula} ajratilgan={true} />
              </div>
              <span className="text-xs font-semibold" style={{ color: "var(--v3-urgu)" }}>
                {m.nomi}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Zaryad hisobi:</div>
                <strong className="font-mono">{m.hisob}</strong>
              </div>
              <div className="p-3 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Tashqi sfera kationi:</div>
                <strong>{m.tashqi}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MavzuLayout>
  )
}