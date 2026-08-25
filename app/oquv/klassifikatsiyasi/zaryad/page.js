"use client"

import Link from "next/link"
import OquvHeader from "@/components/oquv/OquvHeader"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const TURLAR = [
  {
    href: "/oquv/klassifikatsiyasi/zaryad/kation",
    icon: "➕",
    title: "Kation komplekslar",
    zaryad: "Q > 0 (Musbat)",
    desc: "Ichki sfera musbat zaryadga ega bo'lib, tashqi sferada kislota anionlari joylashadi",
    formula: "[Co(NH₃)₆]³⁺, [Cu(NH₃)₄]²⁺",
    rang: "var(--v3-urgu)"
  },
  {
    href: "/oquv/klassifikatsiyasi/zaryad/anion",
    icon: "➖",
    title: "Anion komplekslar",
    zaryad: "Q < 0 (Manfiy)",
    desc: "Ichki sfera manfiy zaryadga ega bo'lib, tashqi sferada metall yoki vodorod kationlari turadi",
    formula: "[Fe(CN)₆]⁴⁻, [AuCl₄]⁻",
    rang: "var(--v3-urgu-2)"
  },
  {
    href: "/oquv/klassifikatsiyasi/zaryad/neytral",
    icon: "⭕",
    title: "Neytral komplekslar",
    zaryad: "Q = 0 (Zaryadsiz)",
    desc: "Ichki sfera zaryadi nolga teng, shuning uchun tashqi sferasi bo'lmaydi va ionlarga ajralmaydi",
    formula: "[Pt(NH₃)₂Cl₂], [Ni(CO)₄]",
    rang: "var(--v3-xira)"
  }
]

export default function ZaryadBoyicha() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--v3-fon)",
        color: "var(--v3-matn)"
      }}
    >
      <OquvHeader
        sarlavha="Kompleks zaryadiga ko'ra"
        tavsif="Ichki koordinatsion sferaning umumiy elektr zaryadiga qarab tasniflash"
        ikon="⚡"
        nishon="ZARYAD TASNIFI"
        yol={[
          { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
          { nom: "Zaryadiga ko'ra" }
        ]}
        ongTaraf={
          <Link
            href="/oquv/klassifikatsiyasi"
            className="px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-colors hover:opacity-80"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)"
            }}
          >
            ← Klassifikatsiya
          </Link>
        }
      />

      <main className="v3-konteyner py-8 md:py-12 space-y-10 flex-1">
        {/* ═══ FORMULA QOIDASI ═══ */}
        <div
          className="rounded-3xl p-6 sm:p-8 border shadow-xs"
          style={{
            background: "color-mix(in srgb, var(--v3-fon-2) 80%, var(--v3-yuza))",
            borderColor: "var(--v3-chiziq)"
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: "var(--v3-matn)" }}>
            Ichki sfera zaryadini hisoblash qoidasi
          </h2>
          <p className="v3-xira text-xs sm:text-sm leading-relaxed mb-6">
            Ichki sfera zaryadi (<strong style={{ color: "var(--v3-matn)" }}>Q</strong>) markaziy metall ioni oksidlanish darajasi va barcha birikkan ligandlar zaryadlarining algebraik yig&apos;indisiga teng:
          </p>

          <div
            className="rounded-2xl p-4 border text-center font-mono text-sm sm:text-base font-bold shadow-xs"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-urgu)"
            }}
          >
            Q(ichki sfera) = Z(markaziy ion) + ∑ Z(ligandlar)
          </div>
        </div>

        {/* ═══ 3 TA GURUH ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TURLAR.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-2xl p-6 border transition-all flex flex-col justify-between hover:scale-[1.02] shadow-xs"
              style={{
                background: "var(--v3-yuza)",
                borderColor: "var(--v3-chiziq)"
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border transition-transform group-hover:scale-110"
                    style={{
                      background: "var(--v3-yuza-2)",
                      borderColor: "var(--v3-chiziq)"
                    }}
                  >
                    {t.icon}
                  </div>
                  <span className="v3-nishon">{t.zaryad}</span>
                </div>

                <h3
                  className="text-lg font-bold transition-colors group-hover:opacity-90 mb-2"
                  style={{ color: "var(--v3-matn)" }}
                >
                  {t.title}
                </h3>
                <p className="v3-xira text-xs sm:text-sm leading-relaxed mb-4">
                  {t.desc}
                </p>

                <div
                  className="rounded-xl p-3 border font-mono text-xs mb-3"
                  style={{
                    background: "var(--v3-yuza-2)",
                    borderColor: "var(--v3-chiziq)",
                    color: "var(--v3-urgu)"
                  }}
                >
                  {t.formula}
                </div>
              </div>

              <div
                className="flex items-center justify-end pt-4 mt-6 border-t text-xs font-semibold"
                style={{ borderColor: "var(--v3-chiziq)", color: "var(--v3-urgu)" }}
              >
                Mavzuga o&apos;tish →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}