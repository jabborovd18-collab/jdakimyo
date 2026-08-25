"use client"

import Link from "next/link"
import OquvHeader from "@/components/oquv/OquvHeader"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const SINFLAR = [
  {
    href: "/oquv/klassifikatsiyasi/sinf/kislota",
    icon: "🧪",
    title: "Kompleks kislotalar",
    desc: "Tashqi sferasida erkin dissotsilanuvchi vodorod kationi (H⁺) tutgan birikmalar",
    formula: "H₂[SiF₆], H[AuCl₄], H₂[PtCl₆]",
    xususiyat: "Suvda kuchli kislotali muhit hosil qiladi, indikatorlarni qizil rangga bo'yaydi",
    step: "01"
  },
  {
    href: "/oquv/klassifikatsiyasi/sinf/asos",
    icon: "🧴",
    title: "Kompleks asoslar",
    desc: "Tashqi sferasida gidroksid anioni (OH⁻) tutgan ishqoriy xarakterdagi birikmalar",
    formula: "[Ag(NH₃)₂]OH, [Cu(NH₃)₄](OH)₂",
    xususiyat: "Tollens va Shveysariya reagentlari, kislotalar bilan neytrallanadi",
    step: "02"
  },
  {
    href: "/oquv/klassifikatsiyasi/sinf/tuz",
    icon: "🧂",
    title: "Kompleks tuzlar",
    desc: "Tashqi sferasida oddiy kationlar (K⁺, Na⁺) yoki anionlar (Cl⁻, SO₄²⁻) tutgan tuzlar",
    formula: "K₄[Fe(CN)₆], [Cr(H₂O)₆]Cl₃",
    xususiyat: "Eng keng tarqalgan komplekslar oilasi, analitik kimyo indikatorlari",
    step: "03"
  }
]

export default function SinfBoyicha() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--v3-fon)",
        color: "var(--v3-matn)"
      }}
    >
      <OquvHeader
        sarlavha="Birikmalar sinfiga ko'ra"
        tavsif="Kompleks kislotalar, kompleks asoslar va kompleks tuzlar • Anorganik sinflar tasnifi"
        ikon="🧪"
        nishon="SINF TASNIFI"
        yol={[
          { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
          { nom: "Sinfiga ko'ra" }
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
        {/* ═══ INTRO ═══ */}
        <div
          className="rounded-3xl p-6 sm:p-8 border shadow-xs"
          style={{
            background: "color-mix(in srgb, var(--v3-fon-2) 80%, var(--v3-yuza))",
            borderColor: "var(--v3-chiziq)"
          }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--v3-matn)" }}>
            Anorganik sinflar bo&apos;yicha bo&apos;linish
          </h2>
          <p className="v3-xira text-xs sm:text-sm leading-relaxed max-w-3xl">
            Kompleks birikmalar tashqi sferasida qaysi ion joylashganiga ko&apos;ra 3 ta asosiy anorganik sinfga bo&apos;linadi. Suvda eriganda aynan shu tashqi sfera ionlari dissotsilanib, eritmaning kislotali, asosli yoki neytral xossasini belgilaydi.
          </p>
        </div>

        {/* ═══ KARTALAR ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SINFLAR.map((s) => (
            <Link
              key={s.href}
              href={s.href}
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
                    {s.icon}
                  </div>
                  <span className="v3-nishon">{s.step}</span>
                </div>

                <h3
                  className="text-lg font-bold transition-colors group-hover:opacity-90 mb-2"
                  style={{ color: "var(--v3-matn)" }}
                >
                  {s.title}
                </h3>
                <p className="v3-xira text-xs sm:text-sm leading-relaxed mb-4">
                  {s.desc}
                </p>

                <div
                  className="rounded-xl p-3 border font-mono text-xs mb-3"
                  style={{
                    background: "var(--v3-yuza-2)",
                    borderColor: "var(--v3-chiziq)",
                    color: "var(--v3-urgu)"
                  }}
                >
                  {s.formula}
                </div>

                <p className="v3-xira text-[11px] leading-relaxed">
                  💡 {s.xususiyat}
                </p>
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