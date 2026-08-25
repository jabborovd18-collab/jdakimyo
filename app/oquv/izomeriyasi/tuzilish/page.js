"use client"

import Link from "next/link"
import OquvHeader from "@/components/oquv/OquvHeader"

const TUZILISH_TURLARI = [
  {
    href: "/oquv/izomeriyasi/tuzilish/ionlanish",
    icon: "⚡",
    title: "Ionlanish izomeriyasi",
    desc: "Ichki va tashqi sferadagi kislota qoldiqlari o'rni almashinadi",
    misol: "[Co(NH₃)₅Br]SO₄ (qizil) va [Co(NH₃)₅SO₄]Br (qizil-binafsha)",
    izoh: "BaCl₂ va AgNO₃ bilan turlicha cho'kma beradi",
    badge: "Asosiy",
    has3D: true
  },
  {
    href: "/oquv/izomeriyasi/tuzilish/gidrat",
    icon: "💧",
    title: "Gidrat (Solvat) izomeriyasi",
    desc: "Suv molekulalarining ichki koordinatsion yoki tashqi kristallogidrat sferasida taqsimlanishi",
    misol: "[Cr(H₂O)₆]Cl₃ (binafsha), [Cr(H₂O)₅Cl]Cl₂·H₂O (och yashil), [Cr(H₂O)₄Cl₂]Cl·2H₂O (to'q yashil)",
    izoh: "AgNO₃ bilan 3, 2 yoki 1 mol AgCl cho'kmasi",
    badge: "Asosiy",
    has3D: true
  },
  {
    href: "/oquv/izomeriyasi/tuzilish/boglanish",
    icon: "🔗",
    title: "Bog'lanish izomeriyasi",
    desc: "Ambidentat ligandlarning turli donor atomlar orqali markaziy atomga bog'lanishi",
    misol: "[Co(NH₃)₅(NO₂)]²⁺ (nitro, sariq) va [Co(NH₃)₅(ONO)]²⁺ (nitrito, qizil)",
    izoh: "NO₂⁻ / ONO⁻, SCN⁻ / NCS⁻",
    badge: "Asosiy",
    has3D: true
  },
  {
    href: "/oquv/izomeriyasi/tuzilish/koordinatsion",
    icon: "🔄",
    title: "Koordinatsion izomeriya",
    desc: "Kation va anion kompleks ionlar o'rtasida ligandlar yoki markaziy metallarning almashishi",
    misol: "[Co(NH₃)₆][Cr(CN)₆] va [Cr(NH₃)₆][Co(CN)₆]",
    izoh: "Kation va anion sferalari to'liq almashinadi",
    badge: "Asosiy",
    has3D: true
  },
  {
    href: "/oquv/izomeriyasi/tuzilish/orinbosar",
    icon: "🔀",
    title: "O'rinbosar izomeriyasi",
    desc: "Ligandning o'zida o'rinbosar guruhlarning har xil joylashishi (orto, meta, para)",
    misol: "orto-, meta- va para-diaminobenzol ligandli komplekslar",
    izoh: "Ligandning o'z strukturasidagi izomeriya",
    badge: "Kengaytirilgan",
    has3D: true
  },
  {
    href: "/oquv/izomeriyasi/tuzilish/konformatsion",
    icon: "🌀",
    title: "Konformatsion izomeriya",
    desc: "Xelat halqasining fazoviy konformatsiyalari (δ va λ shakllari)",
    misol: "[Co(en)₃]³⁺ da etilendiamin halqasining fazoviy burilishi",
    izoh: "Chelate ring konformatsiyasi",
    badge: "Kengaytirilgan",
    has3D: true
  },
  {
    href: "/oquv/izomeriyasi/tuzilish/holat",
    icon: "🎯",
    title: "Holat (Spin) izomeriyasi",
    desc: "Yuqori va quyi spinli elektron holatlari o'rtasidagi muvozanat",
    misol: "Fe²⁺ (d⁶) ning t₂g⁴ e_g² (YS) va t₂g⁶ (QS) shakllari",
    izoh: "Harorat yoki bosim ta'sirida spin-krossover (SCO)",
    badge: "Kengaytirilgan",
    has3D: true
  },
  {
    href: "/oquv/izomeriyasi/tuzilish/elektron",
    icon: "⚛️",
    title: "Elektron izomeriyasi",
    desc: "Valensiya taqsimotining almashinuvi (Valence tautomerism)",
    misol: "Co³⁺-katexolat va Co²⁺-semixinonat holatlari",
    izoh: "Metall-ligand redoks muvozanati",
    badge: "Kengaytirilgan",
    has3D: true
  },
  {
    href: "/oquv/izomeriyasi/tuzilish/formal",
    icon: "📐",
    title: "Formal (Polimerlanish) izomeriyasi",
    desc: "Empirik formulasi bir xil, lekin molekulyar massasi karrali ortgan komplekslar",
    misol: "[Pt(NH₃)₂Cl₂] va [Pt(NH₃)₄][PtCl₄]",
    izoh: "Monomer va dimer shakllar",
    badge: "Kengaytirilgan",
    has3D: true
  },
  {
    href: "/oquv/izomeriyasi/tuzilish/transformatsion",
    icon: "🔮",
    title: "Koordinatsion o'rin almashish",
    desc: "Ko'prikli komplekslarda ligandlarning metallar o'rtasida notekis taqsimlanishi",
    misol: "[(NH₃)₄Co(μ-NH₂)(μ-NO₂)Co(NH₃)₂Cl₂]Cl₂ izomerlari",
    izoh: "Ko'prikli polinuklear komplekslar",
    badge: "Kengaytirilgan",
    has3D: true
  }
]

export default function TuzilishIzomeriyasi() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--v3-fon)",
        color: "var(--v3-matn)"
      }}
    >
      <OquvHeader
        sarlavha="Tuzilish (Konstitutsion) izomeriyasi"
        tavsif="Kompleks birikmalarda atomlar va ionlar o'rtasidagi kimyoviy bog'lanish tartibiga ko'ra 10 ta asosiy tur"
        ikon="🧬"
        nishon="TUZILISH IZOMERIYASI"
        yol={[
          { nom: "Izomeriyasi", havola: "/oquv/izomeriyasi" },
          { nom: "Tuzilish izomeriyasi" }
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
            Tuzilish izomeriyasining 10 ta turi
          </h2>
          <p className="v3-xira text-xs sm:text-sm leading-relaxed max-w-3xl">
            Tuzilish izomerlarida molekuladagi atomlarning o&apos;zaro bog&apos;lanish tartibi yoki ligandlarning joylashishi farqlanadi. Har bir tur o&apos;ziga xos kimyoviy tahlil usullari (cho&apos;ktirish, spektroskopiya) orqali aniqlanadi:
          </p>
        </div>

        {/* ═══ GRID ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TUZILISH_TURLARI.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-2xl p-6 border transition-all flex flex-col justify-between hover:scale-[1.01] shadow-xs"
              style={{
                background: "var(--v3-yuza)",
                borderColor: "var(--v3-chiziq)"
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl border transition-transform group-hover:scale-110"
                    style={{
                      background: "var(--v3-yuza-2)",
                      borderColor: "var(--v3-chiziq)"
                    }}
                  >
                    {t.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {t.has3D && <span className="v3-nishon">3D MODEL</span>}
                    <span className="v3-nishon">{t.badge}</span>
                  </div>
                </div>

                <h3
                  className="text-base sm:text-lg font-bold transition-colors group-hover:opacity-90 mb-1.5"
                  style={{ color: "var(--v3-matn)" }}
                >
                  {t.title}
                </h3>
                <p className="v3-xira text-xs leading-relaxed mb-3">
                  {t.desc}
                </p>

                <div
                  className="rounded-xl p-3 border font-mono text-xs mb-2"
                  style={{
                    background: "var(--v3-yuza-2)",
                    borderColor: "var(--v3-chiziq)",
                    color: "var(--v3-urgu)"
                  }}
                >
                  {t.misol}
                </div>

                <p className="v3-xira text-[11px]">
                  💡 {t.izoh}
                </p>
              </div>

              <div
                className="flex items-center justify-end pt-3 mt-4 border-t text-xs font-semibold"
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