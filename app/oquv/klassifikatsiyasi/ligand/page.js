"use client"

import Link from "next/link"
import OquvHeader from "@/components/oquv/OquvHeader"

const GURUHLAR = [
  {
    href: "/oquv/klassifikatsiyasi/ligand/akva",
    icon: "💧",
    title: "Akvakomplekslar",
    desc: "Ligand: H₂O (suv). Suvli eritmalardagi gidratlangan metall kationlari.",
    misol: "[Cr(H₂O)₆]³⁺, [Fe(H₂O)₆]²⁺",
    guruh: "Neytral"
  },
  {
    href: "/oquv/klassifikatsiyasi/ligand/ammin",
    icon: "🧪",
    title: "Ammiakatlar",
    desc: "Ligand: NH₃ (ammiak). Verner nazariyasining klassik asosi.",
    misol: "[Co(NH₃)₆]³⁺, [Cu(NH₃)₄]²⁺",
    guruh: "Neytral"
  },
  {
    href: "/oquv/klassifikatsiyasi/ligand/atsido",
    icon: "⚡",
    title: "Atsidokomplekslar",
    desc: "Ligand: Kislota qoldiqlari anionlari (CN⁻, NO₂⁻, SO₄²⁻, C₂O₄²⁻).",
    misol: "K₄[Fe(CN)₆], K₃[Co(NO₂)₆]",
    guruh: "Anion"
  },
  {
    href: "/oquv/klassifikatsiyasi/ligand/gidrokso",
    icon: "🔬",
    title: "Gidroksokomplekslar",
    desc: "Ligand: OH⁻ (gidroksid). Amfoter metallarning ishqorda erishi.",
    misol: "Na[Al(OH)₄], Na₂[Zn(OH)₄]",
    guruh: "Anion"
  },
  {
    href: "/oquv/klassifikatsiyasi/ligand/galogenid",
    icon: "🧂",
    title: "Galogenid komplekslar",
    desc: "Ligand: F⁻, Cl⁻, Br⁻, I⁻. Ftoridli va xloridli komplekslar.",
    misol: "H₂[SiF₆], K₂[PtCl₆], K₂[HgI₄]",
    guruh: "Anion"
  },
  {
    href: "/oquv/klassifikatsiyasi/ligand/karbonil",
    icon: "🫧",
    title: "Karbonil komplekslar",
    desc: "Ligand: CO (uglerod oksidi). Metallar nolinchi oksidlanish darajasida.",
    misol: "[Ni(CO)₄], [Fe(CO)₅], [Cr(CO)₆]",
    guruh: "Organometall"
  },
  {
    href: "/oquv/klassifikatsiyasi/ligand/nitrozil",
    icon: "🔵",
    title: "Nitrozil komplekslar",
    desc: "Ligand: NO (azot(II) oksidi). Nitroprussid kabi analitik reagentlar.",
    misol: "Na₂[Fe(CN)₅NO] (Nitroprussid)",
    guruh: "Maxsus"
  },
  {
    href: "/oquv/klassifikatsiyasi/ligand/nitrit",
    icon: "🟠",
    title: "Nitrit komplekslar",
    desc: "Ligand: NO₂⁻ yoki ONO⁻. Bog'lanish izomeriyasi beruvchi ambidentat.",
    misol: "[Co(NH₃)₅(NO₂)]²⁺, [Co(NH₃)₅(ONO)]²⁺",
    guruh: "Ambidentat"
  },
  {
    href: "/oquv/klassifikatsiyasi/ligand/xelat",
    icon: "🦞",
    title: "Xelatlar (Ichki kompleks)",
    desc: "Polidentat ligandlar hosil qiluvchi siklik barqaror halqalar.",
    misol: "[Cu(en)₂]²⁺, [Ca(EDTA)]²⁻",
    guruh: "Polidentat"
  },
  {
    href: "/oquv/klassifikatsiyasi/ligand/metallosen",
    icon: "🥪",
    title: "Metallosenlar (Sendvich)",
    desc: "Aromatik siklopentadienil (Cp) halqalari orasidagi metall atomi.",
    misol: "Fe(C₅H₅)₂ (Ferrosen)",
    guruh: "π-kompleks"
  },
  {
    href: "/oquv/klassifikatsiyasi/ligand/aralash",
    icon: "🎨",
    title: "Aralash ligandli",
    desc: "Bir vaqtning o'zida har xil turdagi ligandlarni biriktirgan komplekslar.",
    misol: "[Pt(NH₃)₂Cl₂], [Co(NH₃)₄(H₂O)Cl]²⁺",
    guruh: "Geteroligand"
  }
]

export default function LigandTabiatigaKora() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--v3-fon)",
        color: "var(--v3-matn)"
      }}
    >
      <OquvHeader
        sarlavha="Ligandlar tabiatiga ko'ra"
        tavsif="Koordinatsion sferadagi ligandlarning kimyoviy xarakteriga qarab 11 ta asosiy guruh"
        ikon="🧩"
        nishon="LIGAND TASNIFI"
        yol={[
          { nom: "Klassifikatsiyasi", havola: "/oquv/klassifikatsiyasi" },
          { nom: "Ligand tabiatiga ko'ra" }
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
          <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: "var(--v3-matn)" }}>
            Ligandlar bo&apos;yicha 11 ta guruh
          </h2>
          <p className="v3-xira text-xs sm:text-sm leading-relaxed max-w-3xl">
            Ligandning tabiati kompleksning rangi, magnit xossasi, barqarorligi va reaksiyaga kirishish tezligini belgilovchi bosh omildir. Quyidagi 11 ta guruhni batafsil o&apos;rganishingiz mumkin:
          </p>
        </div>

        {/* ═══ 11 TA GURUH GRID ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GURUHLAR.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group rounded-2xl p-5 border transition-all flex flex-col justify-between hover:scale-[1.02] shadow-xs"
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
                    {g.icon}
                  </div>
                  <span className="v3-nishon">{g.guruh}</span>
                </div>

                <h3
                  className="text-base font-bold transition-colors group-hover:opacity-90 mb-1.5"
                  style={{ color: "var(--v3-matn)" }}
                >
                  {g.title}
                </h3>
                <p className="v3-xira text-xs leading-relaxed mb-3">
                  {g.desc}
                </p>

                <div
                  className="rounded-xl p-2.5 border font-mono text-[11px]"
                  style={{
                    background: "var(--v3-yuza-2)",
                    borderColor: "var(--v3-chiziq)",
                    color: "var(--v3-urgu)"
                  }}
                >
                  {g.misol}
                </div>
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