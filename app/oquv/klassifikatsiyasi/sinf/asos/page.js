"use client"

import MavzuLayout from "@/components/oquv/MavzuLayout"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const ASOSLAR = [
  {
    formula: "[Ag(NH₃)₂]OH",
    nomi: "Diamminkumush(I) gidroksid (Tollens reagenti)",
    ichki: "[Ag(NH₃)₂]⁺",
    tashqi: "OH⁻",
    markaz: "Ag⁺",
    ligand: "2 ta NH₃ (ammin)",
    ks: 2,
    geometriya: "Chiziqli (Linear)",
    xossasi: "Eng mashhur kompleks asos. Aldegidlar va qaytaruvchi qandlarni aniqlashda 'kumush ko'zgu' sifat reaksiyasini beradi. Uzoq saqlanganda portlovchi nitrid (Ag₃N) hosil bo'ladi, shu sababli ishlatishdan oldin yangi tayyorlanadi.",
    reaksiya: "R-CHO + 2[Ag(NH₃)₂]OH → R-COONH₄ + 2Ag↓ + 3NH₃ + H₂O"
  },
  {
    formula: "[Cu(NH₃)₄](OH)₂",
    nomi: "Tetraamminmis(II) gidroksid (Shveysariya reagenti)",
    ichki: "[Cu(NH₃)₄]²⁺",
    tashqi: "2OH⁻",
    markaz: "Cu²⁺",
    ligand: "4 ta NH₃ (ammin)",
    ks: 4,
    geometriya: "Tekis-kvadrat (Square planar)",
    xossasi: "To'q ko'k rangli kuchli kompleks asos. Sellyuloza (paxta, yog'och tolasi)ni to'liq eritish xususiyatiga ega. Sun'iy ipak (mis-ammiakli ipak) ishlab chiqarishda qo'llaniladi.",
    reaksiya: "Cu(OH)₂ + 4NH₃ → [Cu(NH₃)₄](OH)₂ (to'q ko'k eritma)"
  }
]

export default function KompleksAsoslar() {
  return (
    <MavzuLayout
      sarlavha="Kompleks asoslar"
      tavsif="Tashqi sferasida gidroksid anioni (OH⁻) tutgan kompleks asoslarning tuzilishi va amaliy qo'llanilishi"
      ikon="🧴"
      nishon="ASOSLAR"
      yol={[
        { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
        { nom: "Sinfiga ko'ra", havola: "/oquv/klassifikatsiyasi/sinf" },
        { nom: "Kompleks asoslar" }
      ]}
      oldingiMavzu={{ nom: "Kompleks kislotalar", havola: "/oquv/klassifikatsiyasi/sinf/kislota" }}
      keyingiMavzu={{ nom: "Kompleks tuzlar", havola: "/oquv/klassifikatsiyasi/sinf/tuz" }}
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
          <span>Kompleks asoslar haqida</span>
        </h2>
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
            borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
          }}
        >
          <p className="v3-xira text-xs sm:text-sm leading-relaxed">
            <strong style={{ color: "var(--v3-matn)" }}>Kompleks asoslar</strong> — tashqi sferasida <strong style={{ color: "var(--v3-urgu)" }}>gidroksid ioni (OH⁻)</strong> tutgan komplekslardir. Ular suvli eritmada ishqoriy muhit (pH &gt; 7) hosil qiladi, fenolftaleinni malina rangiga bo&apos;yaydi va kislotalar bilan neytrallanish reaksiyasiga kirishadi.
          </p>
        </div>
      </div>

      {/* ═══ MISOLLAR ═══ */}
      <div className="space-y-6">
        {ASOSLAR.map((a, i) => (
          <div
            key={a.formula}
            className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-6"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b" style={{ borderColor: "var(--v3-chiziq)" }}>
              <div>
                <div className="text-lg sm:text-xl font-mono font-bold" style={{ color: "var(--v3-matn)" }}>
                  <KimyoFormula formula={a.formula} ajratilgan={true} />
                </div>
                <div className="text-xs sm:text-sm font-semibold mt-1" style={{ color: "var(--v3-urgu)" }}>
                  {a.nomi}
                </div>
              </div>
              <span className="v3-nishon">Namunaviy asos #{i + 1}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Ichki sfera (kation):</div>
                <KimyoFormula formula={a.ichki} olcham="kichik" />
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Tashqi sfera (anion):</div>
                <strong style={{ color: "var(--v3-urgu)" }}>{a.tashqi}</strong>
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Markaziy atom va KS:</div>
                <strong>{a.markaz} (KS = {a.ks})</strong>
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Ligandlar:</div>
                <strong>{a.ligand}</strong>
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Geometriya:</div>
                <strong>{a.geometriya}</strong>
              </div>
              <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza-2)", borderColor: "var(--v3-chiziq)" }}>
                <div className="v3-xira text-[11px] mb-1">Xarakterli reaksiya:</div>
                <strong className="font-mono text-[11px]">{a.reaksiya}</strong>
              </div>
            </div>

            <p className="v3-xira text-xs leading-relaxed">
              💡 <strong>Amaliy ahamiyati:</strong> {a.xossasi}
            </p>
          </div>
        ))}
      </div>
    </MavzuLayout>
  )
}