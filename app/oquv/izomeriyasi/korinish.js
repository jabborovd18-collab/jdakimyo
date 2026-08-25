"use client"

import Link from "next/link"
import OquvHeader from "@/components/oquv/OquvHeader"

const IZOMERIYA_GURUHLARI = [
  {
    href: "/oquv/izomeriyasi/tuzilish",
    icon: "🧬",
    title: "Tuzilish izomeriyasi (Konstitutsion)",
    tavsif: "Atomlar va ligandlarning o'zaro bog'lanish tartibi bo'yicha 10 ta asosiy tur",
    mavzular: [
      "Bog'lanish izomeriyasi (NO₂⁻ / ONO⁻, SCN⁻ / NCS⁻)",
      "Ionlanish izomeriyasi ([Co(NH₃)₅Br]SO₄ va [Co(NH₃)₅SO₄]Br)",
      "Gidrat (Solvat) izomeriyasi ([Cr(H₂O)₆]Cl₃ qatori)",
      "Koordinatsion izomeriya ([Co(NH₃)₆][Cr(CN)₆])",
      "Koordinatsion o'rinbosar, elektron, formal, holat va konformatsion turlar"
    ],
    soni: "10 ta tur",
    step: "01"
  },
  {
    href: "/oquv/izomeriyasi/stereo",
    icon: "🔄",
    title: "Stereoizomeriya (Fazoviy)",
    tavsif: "Atomlar bog'lanish tartibi bir xil, lekin ularning fazodagi yo'nalishi har xil bo'lgan turlar",
    mavzular: [
      "Geometrik izomeriya (sis/trans, fas/mer, kvadrat va oktaedr)",
      "Optik izomeriya (Enantiomerlar, xiral markaz, ayna simmetriyasi yo'qligi)",
      "Polyarlangan nurni chapga/o'ngga burish (d/l shakllar)",
      "Sisplatin va uning trans-analogining tibbiyotdagi tub farqi"
    ],
    soni: "2 ta tur + 3D",
    step: "02"
  }
]

export default function Izomeriyasi() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--v3-fon)",
        color: "var(--v3-matn)"
      }}
    >
      <OquvHeader
        sarlavha="Kompleks birikmalar izomeriyasi"
        tavsif="Koordinatsion birikmalardagi tuzilish va stereoizomeriya turlari, 3D fazoviy modellar va tahlillar"
        ikon="🔄"
        nishon="04-BOSQICH"
        yol={[{ nom: "Izomeriyasi" }]}
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
          <div className="v3-nishon mb-1.5">Izomeriya klassifikatsiyasi</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: "var(--v3-matn)" }}>
            Koordinatsion kimyoda 12 ta izomeriya turi
          </h2>
          <p className="v3-xira text-xs sm:text-sm leading-relaxed max-w-3xl mb-6">
            Izomerlar — kimyoviy formulasi va molekulyar massasi bir xil, ammo tuzilishi yoki fazoviy shakli har xil bo&apos;lganligi sababli turlicha fizik-kimyoviy xossalarga ega birikmalardir. Koordinatsion kimyoda ular ikkita katta tarmoqqa bo&apos;linadi:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
            <div className="p-4 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <div className="text-2xl mb-1">🧬</div>
              <strong className="text-sm" style={{ color: "var(--v3-urgu)" }}>10 ta tur</strong>
              <p className="v3-xira text-[11px] mt-0.5">Tuzilish izomeriyasi</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <div className="text-2xl mb-1">🔄</div>
              <strong className="text-sm" style={{ color: "var(--v3-urgu)" }}>2 ta tur</strong>
              <p className="v3-xira text-[11px] mt-0.5">Stereoizomeriya (3D)</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ background: "var(--v3-yuza)", borderColor: "var(--v3-chiziq)" }}>
              <div className="text-2xl mb-1">🏆</div>
              <strong className="text-sm" style={{ color: "var(--v3-urgu)" }}>Alfred Verner</strong>
              <p className="v3-xira text-[11px] mt-0.5">Stereokimyo asoschisi</p>
            </div>
          </div>
        </div>

        {/* ═══ 2 TA ASOSIY GURUH KARTASI ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {IZOMERIYA_GURUHLARI.map((g) => (
            <Link
              key={g.href}
              href={g.href}
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
                    {g.icon}
                  </div>
                  <span className="v3-nishon">{g.soni}</span>
                </div>

                <h3
                  className="text-xl font-bold transition-colors group-hover:opacity-90 mb-2"
                  style={{ color: "var(--v3-matn)" }}
                >
                  {g.title}
                </h3>
                <p className="v3-xira text-xs sm:text-sm leading-relaxed mb-4">
                  {g.tavsif}
                </p>

                <ul className="space-y-2 text-xs mb-6">
                  {g.mavzular.map((m, j) => (
                    <li key={j} className="flex items-start gap-2 v3-xira">
                      <span style={{ color: "var(--v3-urgu)" }}>•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="flex items-center justify-end pt-4 border-t text-xs font-semibold"
                style={{ borderColor: "var(--v3-chiziq)", color: "var(--v3-urgu)" }}
              >
                Bo&apos;limni o&apos;rganish →
              </div>
            </Link>
          ))}
        </div>

        {/* ═══ PASTKI NAVIGATSIYA ═══ */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t" style={{ borderColor: "var(--v3-chiziq)" }}>
          <Link
            href="/oquv/kimyoviy-boglanish"
            className="px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors hover:opacity-80"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)"
            }}
          >
            ← 03-bosqich: Kimyoviy bog&apos;lanish
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
            05-bosqich: Fazoviy geometriya →
          </Link>
        </div>
      </main>
    </div>
  )
}
