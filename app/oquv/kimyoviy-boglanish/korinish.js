"use client"

import Link from "next/link"
import OquvHeader from "@/components/oquv/OquvHeader"

const NAZARIYALAR = [
  {
    href: "/oquv/kimyoviy-boglanish/vb-nazariyasi",
    icon: "🔗",
    title: "Valent bog'lanishlar nazariyasi (VB)",
    tavsif: "Laynus Poling modeli • Gibridlanish turlari (sp³, dsp², d²sp³, sp³d²) • Donor-akseptor bog'lanish",
    izoh: "Markaziy metallning bo'sh gibrid orbitallari va ligandlarning taqsimlanmagan elektron juftlari",
    teglar: ["Gibridlanish", "Donor-akseptor", "Geometriya"],
    step: "01"
  },
  {
    href: "/oquv/kimyoviy-boglanish/kristall-maydon",
    icon: "💎",
    title: "Kristall maydon nazariyasi (KMN)",
    tavsif: "Xans Bete modeli • d-orbitallarning t₂g va eg sathi bo'yicha ajralishi • Δo va Δt • KMBE hisobi",
    izoh: "Elektrostatik model, spektrokimyoviy qator, yuqori va quyi spinli elektron taqsimoti",
    teglar: ["Δo / Δt", "KMBE", "Yuqori/Quyi spin"],
    step: "02"
  },
  {
    href: "/oquv/kimyoviy-boglanish/yan-teller",
    icon: "⚡",
    title: "Yan-Teller effekti",
    tavsif: "Nolisonik energiya pasayishi • Oktaedrik deformatsiya • Cu²⁺ (d⁹) va Cr²⁺ (d⁴) komplekslari",
    izoh: "Orbitallar tengsiz to'lganda geometrik buzilish orqali kompleks barqarorligining ortishi",
    teglar: ["d⁴ / d⁹", "Cu²⁺ misoli", "Ekvatorial/Aksial"],
    step: "03"
  },
  {
    href: "/oquv/kimyoviy-boglanish/ligand-maydon",
    icon: "🧩",
    title: "Ligand maydon nazariyasi (LMN)",
    tavsif: "Kovalent + elektrostatik MO yondashuvi • σ-donor, π-donor va π-akseptor ligandlar • MO diagrammalari",
    izoh: "Kvant-mexanik molekulyar orbitallar usuli va metall-ligand sinergetik bog'i",
    teglar: ["MO diagramma", "σ-donor", "π-akseptor"],
    step: "04"
  }
]

export default function KimyoviyBoglanish() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--v3-fon)",
        color: "var(--v3-matn)"
      }}
    >
      <OquvHeader
        sarlavha="Kimyoviy bog'lanish nazariyalari"
        tavsif="Koordinatsion birikmalarning elektron tuzilishi, rangi, magnit xossalari va geometriyasini tushuntiruvchi 4 ta fundamental nazariya"
        ikon="⚛️"
        nishon="03-BOSQICH"
        yol={[{ nom: "Kimyoviy bog'lanish" }]}
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
          <div className="v3-nishon mb-1.5">Nazariy poydevor</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: "var(--v3-matn)" }}>
            Komplekslarda bog&apos;lanishning 4 ta bosqichi
          </h2>
          <p className="v3-xira text-xs sm:text-sm leading-relaxed max-w-3xl mb-6">
            Koordinatsion birikmalardagi kimyoviy bog&apos;lanish oddiy molekulalardan tubdan farq qiladi. Fanning rivojlanishi davomida yaratilgan to&apos;rtta yirik nazariya metall va ligandlar o&apos;rtasidagi elektron taqsimotini bosqichma-bosqich yoritib beradi:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <strong style={{ color: "var(--v3-urgu)" }}>1. VB nazariyasi</strong>
              <p className="v3-xira text-[11px] mt-0.5">Gibridlanish va fazoviy shakl</p>
            </div>
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <strong style={{ color: "var(--v3-urgu)" }}>2. Kristall maydon</strong>
              <p className="v3-xira text-[11px] mt-0.5">d-orbital ajralishi va rang</p>
            </div>
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <strong style={{ color: "var(--v3-urgu)" }}>3. Yan-Teller</strong>
              <p className="v3-xira text-[11px] mt-0.5">Geometrik buzilish va barqarorlik</p>
            </div>
            <div className="p-3.5 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <strong style={{ color: "var(--v3-urgu)" }}>4. Ligand maydon</strong>
              <p className="v3-xira text-[11px] mt-0.5">Kovalent MO va π-bog&apos;lanish</p>
            </div>
          </div>
        </div>

        {/* ═══ 4 TA NAZARIYA KARTALARI ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {NAZARIYALAR.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="group rounded-2xl p-6 border transition-all flex flex-col justify-between hover:scale-[1.01] shadow-xs"
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
                    {n.icon}
                  </div>
                  <span className="v3-nishon">{n.step}-NAZARIYA</span>
                </div>

                <h3
                  className="text-lg font-bold transition-colors group-hover:opacity-90 mb-2"
                  style={{ color: "var(--v3-matn)" }}
                >
                  {n.title}
                </h3>
                <p className="v3-xira text-xs sm:text-sm leading-relaxed mb-3">
                  {n.tavsif}
                </p>
                <p className="text-xs italic opacity-75 mb-4" style={{ color: "var(--v3-urgu)" }}>
                  {n.izoh}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {n.teglar.map((t, j) => (
                    <span
                      key={j}
                      className="text-[11px] px-2.5 py-0.5 rounded-full border"
                      style={{
                        background: "color-mix(in srgb, var(--v3-urgu) 8%, var(--v3-yuza))",
                        borderColor: "color-mix(in srgb, var(--v3-urgu) 25%, var(--v3-chiziq))",
                        color: "var(--v3-urgu)"
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="flex items-center justify-end pt-4 mt-6 border-t text-xs font-semibold"
                style={{ borderColor: "var(--v3-chiziq)", color: "var(--v3-urgu)" }}
              >
                Nazariyani o&apos;rganish →
              </div>
            </Link>
          ))}
        </div>

        {/* ═══ PASTKI NAVIGATSIYA ═══ */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t" style={{ borderColor: "var(--v3-chiziq)" }}>
          <Link
            href="/oquv/klassifikatsiyasi"
            className="px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors hover:opacity-80"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)"
            }}
          >
            ← 02-bosqich: Klassifikatsiyasi
          </Link>
          <Link
            href="/oquv/izomeriyasi"
            className="px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors hover:opacity-80"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)"
            }}
          >
            04-bosqich: Izomeriyasi →
          </Link>
        </div>
      </main>
    </div>
  )
}
