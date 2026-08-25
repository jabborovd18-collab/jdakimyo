"use client"

import Link from "next/link"
import OquvHeader from "@/components/oquv/OquvHeader"

const TASNIF_TURLARI = [
  {
    href: "/oquv/klassifikatsiyasi/sinf",
    icon: "🧪",
    title: "Birikmalar sinfiga ko'ra",
    desc: "Kompleks kislotalar, kompleks asoslar va kompleks tuzlar",
    izoh: "Tashqi sferadagi H⁺, OH⁻ yoki metall kationi/anioniga qarab",
    mavzular: 3
  },
  {
    href: "/oquv/klassifikatsiyasi/ligand",
    icon: "🧩",
    title: "Ligandlar tabiatiga ko'ra",
    desc: "Akvakomplekslar, ammiakatlar, atsidokomplekslar, karbonillar, xelatlar va boshqalar",
    izoh: "Koordinatsion sferada qanday ligandlar birikkaniga qarab (11 ta guruh)",
    mavzular: 11
  },
  {
    href: "/oquv/klassifikatsiyasi/zaryad",
    icon: "⚡",
    title: "Kompleks zaryadiga ko'ra",
    desc: "Kation komplekslar [ ]⁺, Anion komplekslar [ ]⁻ va Neytral komplekslar [ ]⁰",
    izoh: "Ichki koordinatsion sferaning yig'indi elektr zaryadiga qarab",
    mavzular: 3
  }
]

export default function Klassifikatsiyasi() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--v3-fon)",
        color: "var(--v3-matn)"
      }}
    >
      {/* ═══ HEADER ═══ */}
      <OquvHeader
        sarlavha="Klassifikatsiyasi"
        tavsif="Kompleks birikmalarni tasniflashning 3 ta asosiy yondashuvi: sinf, ligand va zaryad bo'yicha"
        ikon="🗂️"
        nishon="02-BOSQICH"
        yol={[{ nom: "Klassifikatsiyasi" }]}
        ongTaraf={
          <Link
            href="/oquv"
            className="px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-colors hover:opacity-80"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)"
            }}
          >
            ← O&apos;quv
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
          <div className="v3-nishon mb-1.5">Mavzular umumiy tavsifi</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: "var(--v3-matn)" }}>
            Kompleks birikmalarni tizimlashtirish
          </h2>
          <p className="v3-xira text-xs sm:text-sm leading-relaxed max-w-3xl mb-6">
            Koordinatsion birikmalar nihoyatda xilma-xil bo&apos;lib, ularni o&apos;rganish va tahlil qilish uchun kimyoda uchta asosiy tasniflash mezoni qabul qilingan:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <strong style={{ color: "var(--v3-urgu)" }}>1. Anorganik sinflar</strong>
              <p className="v3-xira text-[11px] mt-0.5">Kislota, asos yoki tuz xarakteri</p>
            </div>
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <strong style={{ color: "var(--v3-urgu)" }}>2. Ligand turi</strong>
              <p className="v3-xira text-[11px] mt-0.5">Akva, ammin, atsedo, xelat...</p>
            </div>
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <strong style={{ color: "var(--v3-urgu)" }}>3. Sfera zaryadi</strong>
              <p className="v3-xira text-[11px] mt-0.5">Kation, anion yoki neytral</p>
            </div>
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <strong style={{ color: "var(--v3-urgu)" }}>4. Amaliy namunalar</strong>
              <p className="v3-xira text-[11px] mt-0.5">Dissotsilanish va xossalar</p>
            </div>
          </div>
        </div>

        {/* ═══ 3 TA ASOSIY GURUH KARTALARI ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TASNIF_TURLARI.map((b) => (
            <Link
              key={b.href}
              href={b.href}
              className="group rounded-2xl p-6 border transition-all flex flex-col justify-between hover:scale-[1.02] shadow-xs"
              style={{
                background: "var(--v3-yuza)",
                borderColor: "var(--v3-chiziq)"
              }}
            >
              <div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 border transition-transform group-hover:scale-110"
                  style={{
                    background: "var(--v3-yuza-2)",
                    borderColor: "var(--v3-chiziq)"
                  }}
                >
                  {b.icon}
                </div>

                <h3
                  className="text-lg font-bold transition-colors group-hover:opacity-90 mb-2"
                  style={{ color: "var(--v3-matn)" }}
                >
                  {b.title}
                </h3>
                <p className="v3-xira text-xs sm:text-sm leading-relaxed mb-3">
                  {b.desc}
                </p>
                <p className="text-xs italic opacity-75" style={{ color: "var(--v3-urgu)" }}>
                  {b.izoh}
                </p>
              </div>

              <div
                className="flex items-center justify-between pt-4 mt-6 border-t text-xs font-semibold"
                style={{ borderColor: "var(--v3-chiziq)" }}
              >
                <span className="v3-xira">{b.mavzular} ta bo&apos;lim</span>
                <span
                  className="transition-transform group-hover:translate-x-1 inline-flex items-center gap-1"
                  style={{ color: "var(--v3-urgu)" }}
                >
                  Batafsil o&apos;rganish →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* ═══ PASTKI NAVIGATSIYA ═══ */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t" style={{ borderColor: "var(--v3-chiziq)" }}>
          <Link
            href="/oquv/nomlanishi"
            className="px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors hover:opacity-80"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)"
            }}
          >
            ← 01-bosqich: Nomlanishi
          </Link>
          <Link
            href="/oquv/fazoviy"
            className="px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors hover:opacity-80"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)"
            }}
          >
            03-bosqich: Fazoviy tuzilishi →
          </Link>
        </div>
      </main>
    </div>
  )
}
