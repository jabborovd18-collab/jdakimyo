"use client"

import Link from "next/link"
import OquvHeader from "@/components/oquv/OquvHeader"
import KimyoFormula from "@/components/oquv/KimyoFormula"

const STEREO_TURLARI = [
  {
    href: "/oquv/izomeriyasi/stereo/geometrik",
    icon: "📐",
    title: "Geometrik (Fazoviy) izomeriya",
    desc: "Ligandlarning bir-biriga nisbatan burchak yoki tekislikdagi joylashuvi (sis/trans, fas/mer)",
    misollar: "cis-[Pt(NH₃)₂Cl₂] (Sisplatin) va trans-[Pt(NH₃)₂Cl₂]; cis/trans-[Co(NH₃)₄Cl₂]⁺; fac/mer-[Co(NH₃)₃Cl₃]",
    izoh: "Tekis-kvadrat (MA₂B₂) va Oktaedrik (MA₄B₂, MA₃B₃) komplekslarda kuzatiladi",
    has3D: true
  },
  {
    href: "/oquv/izomeriyasi/stereo/optik",
    icon: "🔮",
    title: "Optik izomeriya (Enantiomeriya)",
    desc: "Oyna aksi bilan ustma-ust tushmaydigan, polyarlangan nur tekisligini o'ngga (d) yoki chapga (l) buruvchi xiral komplekslar",
    misollar: "[Co(en)₃]³⁺ (Δ va Λ enantiomerlar), cis-[Co(en)₂Cl₂]⁺",
    izoh: "Simmetriya markazi va tekisligi bo'lmagan xiral oktaedr va xelatlarda kuzatiladi",
    has3D: true
  }
]

export default function StereoIzomeriya() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--v3-fon)",
        color: "var(--v3-matn)"
      }}
    >
      <OquvHeader
        sarlavha="Stereoizomeriya (Fazoviy izomeriya)"
        tavsif="Atomlar bog'lanish tartibi bir xil, lekin ularning fazodagi yo'nalishi va konfiguratsiyasi farq qiluvchi izomerlar"
        ikon="🔄"
        nishon="STEREOIZOMERIYA"
        yol={[
          { nom: "Izomeriyasi", havola: "/oquv/izomeriyasi" },
          { nom: "Stereoizomeriya" }
        ]}
        ongTaraf={
          <Link
            href="/oquv/izomeriyasi"
            className="px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-colors hover:opacity-80"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)"
            }}
          >
            ← Izomeriya
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
          <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: "var(--v3-matn)" }}>
            Fazoviy konfiguratsiya va xirallik
          </h2>
          <p className="v3-xira text-xs sm:text-sm leading-relaxed max-w-3xl mb-6">
            Stereoizomerlar koordinatsion kimyoning eng nozik va amaliy ahamiyati yuqori sohasidir. Masalan, <strong>sis-platin</strong> kuchli onkologik preparat bo&apos;lsa, uning <strong>trans-izomeri</strong> tibbiy jihatdan nofaol va organizm uchun zaharli hisoblanadi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border space-y-1.5" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <strong style={{ color: "var(--v3-urgu)" }}>1. Geometrik (Diastereomerlar):</strong>
              <p className="v3-xira text-[11px] leading-relaxed">
                Bir xil ligandlar bir tomonda (sis / fas) yoki qarama-qarshi tomonda (trans / mer) joylashadi. Fizik va kimyoviy xossalari butunlay farq qiladi.
              </p>
            </div>
            <div className="p-4 rounded-xl border space-y-1.5" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <strong style={{ color: "var(--v3-urgu-2)" }}>2. Optik (Enantiomerlar):</strong>
              <p className="v3-xira text-[11px] leading-relaxed">
                Molekula o&apos;zining ko&apos;zgudagi aksi bilan ustma-ust tushmaydi. Xiral muhitda va polyarlangan nur tekisligini burishda farqlanadi.
              </p>
            </div>
          </div>
        </div>

        {/* ═══ KARTALAR ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STEREO_TURLARI.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-2xl p-6 sm:p-8 border transition-all flex flex-col justify-between hover:scale-[1.01] shadow-xs"
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
                  <span className="v3-nishon">3D MODEL MAVJUD</span>
                </div>

                <h3
                  className="text-lg sm:text-xl font-bold transition-colors group-hover:opacity-90 mb-2"
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
                  {s.misollar}
                </div>

                <p className="v3-xira text-[11px]">
                  💡 {s.izoh}
                </p>
              </div>

              <div
                className="flex items-center justify-end pt-4 mt-6 border-t text-xs font-semibold"
                style={{ borderColor: "var(--v3-chiziq)", color: "var(--v3-urgu)" }}
              >
                Mavzuga o&apos;tish va 3D ko&apos;rish →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}