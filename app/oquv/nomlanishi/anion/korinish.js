"use client"

import { useState } from "react"
import MavzuLayout from "@/components/oquv/MavzuLayout"
import InteraktivJadval from "@/components/oquv/InteraktivJadval"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const SECTIONS = [
  { id: "qoida", label: "Asosiy qoida", icon: "📜" },
  { id: "metallar", label: "5.4-Jadval (Metallar)", icon: "📊" },
  { id: "misollar", label: "Amaliy namunalar", icon: "✍️" },
]

const ASOSIY_METALLAR = [
  { belgi: "Fe", element: "Temir", lotincha: "Ferrum", anion: "ferrat", misol: "K₄[Fe(CN)₆] → kaliy geksatsianidoferrat(II)" },
  { belgi: "Cu", element: "Mis", lotincha: "Cuprum", anion: "kuprat", misol: "K₂[CuCl₄] → kaliy tetraxloridokuprat(II)" },
  { belgi: "Ag", element: "Kumush", lotincha: "Argentum", anion: "argentat", misol: "Na[Ag(CN)₂] → natriy ditsianidoargentat(I)" },
  { belgi: "Au", element: "Oltin", lotincha: "Aurum", anion: "aurat", misol: "Na[AuCl₄] → natriy tetraxloridoaurat(III)" },
  { belgi: "Pb", element: "Qo'rg'oshin", lotincha: "Plumbum", anion: "plyumbat", misol: "K₂[Pb(OH)₆] → kaliy geksagidroksidoplyumbat(IV)" },
  { belgi: "Sn", element: "Qalay", lotincha: "Stannum", anion: "stannat", misol: "Na₂[Sn(OH)₆] → natriy geksagidroksidostannat(IV)" },
  { belgi: "Zn", element: "Rux", lotincha: "Zincum", anion: "tsinkat (sinkat)", misol: "K₂[Zn(CN)₄] → kaliy tetratsianidotsinkat(II)" },
  { belgi: "Hg", element: "Simob", lotincha: "Hydrargyrum", anion: "merkurat", misol: "K₂[HgI₄] → kaliy tetrayodidomerkurat(II)" },
  { belgi: "Al", element: "Alyuminiy", lotincha: "Aluminium", anion: "alyuminat", misol: "Na[Al(OH)₄] → natriy tetragidroksidoalyuminat(III)" },
  { belgi: "Cr", element: "Xrom", lotincha: "Chromium", anion: "xromat", misol: "K₃[Cr(C₂O₄)₃] → kaliy trioksalatoxromat(III)" },
  { belgi: "Co", element: "Kobalt", lotincha: "Cobaltum", anion: "kobaltat", misol: "K₃[Co(NO₂)₆] → kaliy geksanitritokobaltat(III)" },
  { belgi: "Ni", element: "Nikel", lotincha: "Niccolum", anion: "nikkolat", misol: "K₂[Ni(CN)₄] → kaliy tetratsianidonikkolat(II)" },
  { belgi: "Pt", element: "Platina", lotincha: "Platinum", anion: "platinat", misol: "K₂[PtCl₆] → kaliy geksaxloridoplatinat(IV)" },
  { belgi: "Mn", element: "Marganes", lotincha: "Manganum", anion: "manganat", misol: "K₂[Mn(CN)₆] → kaliy geksatsianidomanganat(IV)" },
]

const MISOLLAR = [
  { formula: "K₄[Fe(CN)₆]", nomi: "kaliy geksatsianidoferrat(II)", izoh: "Fe → ferrat, KS = 6, oksidlanish darajasi +2" },
  { formula: "Na[AuCl₄]", nomi: "natriy tetraxloridoaurat(III)", izoh: "Au → aurat, KS = 4, oksidlanish darajasi +3" },
  { formula: "K₂[Pb(OH)₆]", nomi: "kaliy geksagidroksidoplyumbat(IV)", izoh: "Pb → plyumbat, KS = 6, oksidlanish darajasi +4" },
  { formula: "Na₂[Sn(OH)₆]", nomi: "natriy geksagidroksidostannat(IV)", izoh: "Sn → stannat, KS = 6, oksidlanish darajasi +4" },
  { formula: "K₂[Zn(CN)₄]", nomi: "kaliy tetratsianidotsinkat(II)", izoh: "Zn → tsinkat, KS = 4, oksidlanish darajasi +2" },
  { formula: "K₂[HgI₄]", nomi: "kaliy tetrayodidomerkurat(II)", izoh: "Hg → merkurat (Nessler reagenti), KS = 4" },
  { formula: "Na[Al(OH)₄]", nomi: "natriy tetragidroksidoalyuminat(III)", izoh: "Al → alyuminat, KS = 4" },
]

export default function AnionKomplekslar() {
  const [faolBolim, setFaolBolim] = useState("qoida")

  return (
    <MavzuLayout
      sarlavha="Anion komplekslar markazi"
      tavsif="Anion komplekslarda markaziy metallning lotincha o'zagi asosida '-at' qo'shimchasi bilan nomlanishi (5.4-jadval)"
      ikon="⚛️"
      nishon="05-MAVZU"
      yol={[
        { nom: "Nomlanishi", havola: "/oquv/nomlanishi" },
        { nom: "Anion komplekslar" }
      ]}
      bolimlar={SECTIONS}
      faolBolim={faolBolim}
      onBolimTanla={setFaolBolim}
      oldingiMavzu={{ nom: "Ligandlar jadvali", havola: "/oquv/nomlanishi/ligandlar" }}
      keyingiMavzu={{ nom: "Klassifikatsiyasi bo'limi", havola: "/oquv/klassifikatsiyasi" }}
      quizHavola="/oquv/video-darsliklar/quiz/nomlanishi"
    >
      {/* ═══ 1. ASOSIY QOIDA ═══ */}
      {faolBolim === "qoida" && (
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-6"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <h2 className="text-xl font-bold flex items-center gap-2.5" style={{ color: "var(--v3-matn)" }}>
              <span>📜</span>
              <span>Anion komplekslar uchun asosiy qoida</span>
            </h2>

            <div
              className="rounded-2xl p-5 border"
              style={{
                background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
                borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))"
              }}
            >
              <p className="v3-xira text-xs sm:text-sm leading-relaxed">
                Agar kompleks ion <strong style={{ color: "var(--v3-urgu)" }}>anion (manfiy zaryadli)</strong> bo&apos;lsa, markaziy metall nomiga <strong style={{ color: "var(--v3-urgu)" }}>&quot;-at&quot; qo&apos;shimchasi</strong> qo&apos;shiladi. Ko&apos;plab metallar uchun lotincha nom ildiziga &quot;-at&quot; ulanadi (masalan, Ferrum → ferrat, Cuprum → kuprat).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div
                className="rounded-2xl p-5 border space-y-2"
                style={{
                  background: "var(--v3-yuza-2)",
                  borderColor: "var(--v3-chiziq)"
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold" style={{ color: "var(--v3-urgu-2)" }}>Kation kompleks (O&apos;zgarmaydi)</span>
                  <span className="v3-nishon">[ ]⁺</span>
                </div>
                <div className="font-mono text-sm py-1">
                  <KimyoFormula formula="[Cu(NH₃)₄]SO₄" />
                </div>
                <div className="font-semibold" style={{ color: "var(--v3-matn)" }}>
                  tetraammin<strong style={{ color: "var(--v3-urgu-2)" }}>mis</strong>(II) sulfat
                </div>
                <p className="v3-xira text-[11px]">Kationda markaziy metall nomi (mis) o&apos;zgarishsiz qoladi.</p>
              </div>

              <div
                className="rounded-2xl p-5 border space-y-2"
                style={{
                  background: "color-mix(in srgb, var(--v3-urgu) 10%, var(--v3-yuza))",
                  borderColor: "color-mix(in srgb, var(--v3-urgu) 30%, var(--v3-chiziq))"
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold" style={{ color: "var(--v3-urgu)" }}>Anion kompleks (&quot;-at&quot; ulanadi)</span>
                  <span className="v3-nishon">[ ]⁻</span>
                </div>
                <div className="font-mono text-sm py-1">
                  <KimyoFormula formula="K₂[CuCl₄]" />
                </div>
                <div className="font-semibold" style={{ color: "var(--v3-matn)" }}>
                  kaliy tetraxlorido<strong style={{ color: "var(--v3-urgu)" }}>kuprat</strong>(II)
                </div>
                <p className="v3-xira text-[11px]">Anionda lotincha Cuprum ildiziga &quot;-at&quot; qo&apos;shilib &quot;kuprat&quot; bo&apos;ladi.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 2. METALLAR JADVALI ═══ */}
      {faolBolim === "metallar" && (
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: "var(--v3-matn)" }}>
                5.4-jadval: Anion komplekslarda metallarning lotincha nomlari
              </h2>
            </div>
            <p className="v3-xira text-xs sm:text-sm leading-relaxed">
              O&apos;zbek va xalqaro anorganik kimyoda eng ko&apos;p ishlatiladigan metallarning anion shakllari:
            </p>

            <InteraktivJadval
              sarlavha="5.4-jadval: Markaziy metallar"
              ustunlar={[
                { kalit: "belgi", nom: "Belgi", format: "kod", kenglik: "12%" },
                { kalit: "element", nom: "Element", kenglik: "18%" },
                { kalit: "lotincha", nom: "Lotincha nomi", kenglik: "20%" },
                { kalit: "anion", nom: "Anionda atalishi", format: "kod", kenglik: "22%" },
                { kalit: "misol", nom: "Namuna birikma", kenglik: "28%" }
              ]}
              qatorlar={ASOSIY_METALLAR}
            />
          </div>
        </div>
      )}

      {/* ═══ 3. AMALIY MISOLLAR ═══ */}
      {faolBolim === "misollar" && (
        <div className="space-y-6">
          <div
            className="rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">✍️</span>
              <h2 className="text-lg sm:text-xl font-bold" style={{ color: "var(--v3-matn)" }}>
                Anion komplekslarni to&apos;g&apos;ri nomlash amaliyoti
              </h2>
            </div>
            <p className="v3-xira text-xs sm:text-sm leading-relaxed">
              Har bir birikma formulasidan uning kationi, ligandlari va lotincha anion nomini hosil qilish namunasi:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MISOLLAR.map((m, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 sm:p-5 border space-y-2"
                  style={{
                    background: "var(--v3-yuza-2)",
                    borderColor: "var(--v3-chiziq)"
                  }}
                >
                  <div className="font-mono text-sm sm:text-base">
                    <KimyoFormula formula={m.formula} ajratilgan={true} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold" style={{ color: "var(--v3-urgu)" }}>
                    → {m.nomi}
                  </div>
                  <div className="v3-xira text-[11px] pt-1 border-t" style={{ borderColor: "var(--v3-chiziq)" }}>
                    💡 {m.izoh}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </MavzuLayout>
  )
}
