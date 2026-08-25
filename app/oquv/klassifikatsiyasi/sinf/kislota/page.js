"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const KISLOTALAR = [
  {
    formula: "H₂[SiF₆]",
    nomi: "Geksaftoridosilikat(IV) kislota",
    tashqi: "2H⁺",
    ichki: "[SiF₆]²⁻",
    markaz: "Si⁴⁺",
    ligand: "6 ta F⁻ (ftorido)",
    ks: 6,
    geometriya: "Muntazam oktaedr",
    xossasi: "Kuchli noorganik kislota, suvda to'liq dissotsilanadi, shisha va silikatlarni yemiradi. Sanoatda ftoridli birikmalar ishlab chiqarishda ishlatiladi.",
    reaksiya: "H₂[SiF₆] → 2H⁺ + [SiF₆]²⁻"
  },
  {
    formula: "H[AuCl₄]",
    nomi: "Tetraxloridoaurat(III) kislota",
    tashqi: "H⁺",
    ichki: "[AuCl₄]⁻",
    markaz: "Au³⁺",
    ligand: "4 ta Cl⁻ (xlorido)",
    ks: 4,
    geometriya: "Tekis-kvadrat (Square planar)",
    xossasi: "Oltinni 'zarhal suvi'da (tsarskaya vodka: HNO₃ + 3HCl) eritish natijasida hosil bo'ladi. Sariq-oltin rangli kristall modda.",
    reaksiya: "Au + HNO₃ + 4HCl → H[AuCl₄] + NO↑ + 2H₂O"
  },
  {
    formula: "H₂[PtCl₆]",
    nomi: "Geksaxloridoplatinat(IV) kislota",
    tashqi: "2H⁺",
    ichki: "[PtCl₆]²⁻",
    markaz: "Pt⁴⁺",
    ligand: "6 ta Cl⁻ (xlorido)",
    ks: 6,
    geometriya: "Oktaedrik",
    xossasi: "Platinaning eng muhim kimyoviy birikmasi. Qizil-jigarrang kristall modda, kaliy (K⁺) va ammoniy (NH₄⁺) ionlarini cho'ktirishda analitik reagent.",
    reaksiya: "H₂[PtCl₆] + 2KCl → K₂[PtCl₆]↓ (sariq cho'kma) + 2HCl"
  }
]

export default function KompleksKislotalar() {
  return (
    <MavzuLayout
      sarlavha="Kompleks kislotalar"
      tavsif="Tashqi sferasida dissotsilanuvchi vodorod kationi (H⁺) tutgan kompleks kislotalarning tuzilishi va reaksiyalari"
      ikon="🧪"
      nishon="KISLOTALAR"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Sinfiga ko'ra", havola: "/oquv/klassifikatsiyasi/sinf" },
        { nom: "Kompleks kislotalar" }
      ]}
      keyingiMavzu={{ nom: "Kompleks asoslar", havola: "/oquv/klassifikatsiyasi/sinf/asos" }}
      quizHavola="/oquv/video-darsliklar/quiz/klassifikatsiyasi"
    >
      {/* ═══ TA'RIF ═══ */}
      <div
        className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          background: "var(--v3-yuza)",
          borderColor: "var(--v3-chiziq)"
        }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
          <span>📋</span>
          <span>Kompleks kislotalar haqida</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Kompleks kislotalar</strong> — tashqi sferasida <strong style={{ color: "var(--v3-urgu)" }}>vodorod ioni (H⁺)</strong> tutgan koordinatsion birikmalardir. Ular suvli eritmada to&apos;liq dissotsilanib H⁺ ionlarini hosil qiladi, lakmusni qizil rangga bo&apos;yaydi va metallar hamda asoslar bilan odatiy kislotali reaksiyalarga kirishadi.
          </p>
        </div>
      </div>

      {/* ═══ MISOLLAR ═══ */}
      <div className="space-y-6">
        {KISLOTALAR.map((k, i) => (
          <div
            key={k.formula}
            className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-6"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b" style={{ borderColor: "var(--v3-chiziq)" }}>
              <div>
                <div className="text-lg sm:text-xl font-mono font-bold" style={{ color: "var(--v3-matn)" }}>
                  <KimyoFormula formula={k.formula} ajratilgan={true} />
                </div>
                <div className="text-xs sm:text-sm font-semibold mt-1" style={{ color: "var(--v3-urgu)" }}>
                  {k.nomi}
                </div>
              </div>
              <span className="v3-nishon">Namunaviy kislota #{i + 1}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Tashqi sfera (kation):</div>
                <strong style={{ color: "var(--v3-urgu)" }}>{k.tashqi}</strong>
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Ichki sfera (anion):</div>
                <KimyoFormula formula={k.ichki} olcham="kichik" />
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Markaziy atom va KS:</div>
                <strong>{k.markaz} (KS = {k.ks})</strong>
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Ligandlar:</div>
                <strong>{k.ligand}</strong>
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Geometriya:</div>
                <strong>{k.geometriya}</strong>
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Dissotsilanishi:</div>
                <strong className="font-mono text-[11px]">{k.reaksiya}</strong>
              </div>
            </div>

            <p className="v3-xira text-xs leading-relaxed">
              💡 <strong>Amaliy ahamiyati:</strong> {k.xossasi}
            </p>
          </div>
        ))}
      </div>
    </MavzuLayout>
  )
}