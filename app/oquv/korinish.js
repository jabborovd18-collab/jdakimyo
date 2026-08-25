"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import OquvBreadcrumb from "@/components/oquv/OquvBreadcrumb"

// ═══════════════════════════════════════════════════════════
// O'QUV BOSQICHLARI
// Raqamlar haqiqiy mavzular soniga mos (Yagona manba)
// ═══════════════════════════════════════════════════════════
const BOSQICHLAR = [
  {
    id: "nomlanishi",
    href: "/oquv/nomlanishi",
    icon: "📖",
    title: "Nomlanishi",
    desc: "IUPAC qoidalari, formula yozish, 5.3 va 5.4-jadvallar",
    nima: "Kimyoning alifbosi — birikmani to'g'ri o'qish va yozish",
    mavzular: 6,
    uchD: 0,
  },
  {
    id: "klassifikatsiyasi",
    href: "/oquv/klassifikatsiyasi",
    icon: "🗂️",
    title: "Klassifikatsiyasi",
    desc: "Sinf, ligand va zaryad bo'yicha tasniflash",
    nima: "Minglab birikmani tizimga solish",
    mavzular: 21,
    uchD: 0,
  },
  {
    id: "fazoviy",
    href: "/oquv/fazoviy",
    icon: "💎",
    title: "Fazoviy tuzilishi",
    desc: "Geometrik shakllar, VSEPR, 3D modellar",
    nima: "KS=2 dan KS=12 gacha — molekulani fazoda ko'rish",
    mavzular: 36,
    uchD: 17,
  },
  {
    id: "izomeriyasi",
    href: "/oquv/izomeriyasi",
    icon: "🔄",
    title: "Izomeriyasi",
    desc: "Tuzilish va stereoizomeriya turlari",
    nima: "Bir xil formula, boshqa xossalar — nega?",
    mavzular: 26,
    uchD: 11,
  },
  {
    id: "kimyoviy-boglanish",
    href: "/oquv/kimyoviy-boglanish",
    icon: "🔗",
    title: "Kimyoviy bog'lanish",
    desc: "VB nazariyasi, kristall maydon, Yan-Teller",
    nima: "Rang, magnetizm va barqarorlik qayerdan keladi",
    mavzular: 5,
    uchD: 0,
  },
  {
    id: "video-darsliklar",
    href: "/oquv/video-darsliklar",
    icon: "🎯",
    title: "Video va testlar",
    desc: "Barcha mavzular bo'yicha amaliy sinov",
    nima: "Bilimni mustahkamlash va o'zini tekshirish",
    mavzular: 13,
    uchD: 0,
    isTest: true,
  },
]

const JAMI_MAVZU = BOSQICHLAR.reduce((s, b) => s + b.mavzular, 0)
const JAMI_3D = BOSQICHLAR.reduce((s, b) => s + b.uchD, 0)

export default function OquvPage() {
  const [progress, setProgress] = useState({})
  const [signedIn, setSignedIn] = useState(false)
  const [yuklandi, setYuklandi] = useState(false)

  useEffect(() => {
    let bekor = false
    fetch("/api/oquv/progress")
      .then((r) => r.json())
      .then((d) => {
        if (bekor) return
        setProgress(d.progress || {})
        setSignedIn(Boolean(d.signedIn))
      })
      .catch(() => {})
      .finally(() => { if (!bekor) setYuklandi(true) })
    return () => { bekor = true }
  }, [])

  const olchanganlar = Object.values(progress)
  const umumiy = olchanganlar.length
    ? Math.round(olchanganlar.reduce((s, v) => s + v, 0) / olchanganlar.length)
    : 0

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--v3-fon)",
        color: "var(--v3-matn)"
      }}
    >
      {/* ═══ HEADER ═══ */}
      <header className="v3-header">
        <div className="v3-konteyner py-4 flex items-center justify-between gap-4">
          <div>
            <OquvBreadcrumb />
            <h1 className="v3-h1 text-2xl md:text-3xl font-bold flex items-center gap-2 m-0">
              <span className="text-2xl md:text-3xl select-none">📚</span>
              <span>O&apos;quv bo&apos;limi</span>
            </h1>
          </div>
          <Link
            href="/ilmiy"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border transition-all hover:opacity-80"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)",
              color: "var(--v3-matn)"
            }}
          >
            <span>🔬 Ilmiy bo&apos;lim</span>
            <span>→</span>
          </Link>
        </div>
      </header>

      <main className="v3-konteyner py-8 md:py-12 space-y-12 flex-1">
        {/* ═══ HERO ═══ */}
        <div
          className="relative rounded-3xl p-6 sm:p-10 border overflow-hidden transition-all shadow-sm"
          style={{
            background: "color-mix(in srgb, var(--v3-fon-2) 80%, var(--v3-yuza))",
            borderColor: "var(--v3-chiziq)"
          }}
        >
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{ background: "var(--v3-nur-1)" }}
          />
          <div
            className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{ background: "var(--v3-nur-2)" }}
          />

          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold mb-5 border"
              style={{
                background: "color-mix(in srgb, var(--v3-urgu) 12%, transparent)",
                borderColor: "color-mix(in srgb, var(--v3-urgu) 30%, transparent)",
                color: "var(--v3-urgu)"
              }}
            >
              <span className="v3-nuqta" />
              <span>6 bosqichli to&apos;liq o&apos;quv yo&apos;li</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              <span>Kompleks birikmalar</span>
              <br />
              <span className="v3-xira text-xl sm:text-2xl md:text-3xl font-medium">
                noldan professionallargacha
              </span>
            </h2>

            <p className="v3-xira max-w-2xl mb-8 leading-relaxed text-sm sm:text-base">
              Nomlashdan boshlab kimyoviy bog&apos;lanish nazariyalarigacha —
              har bosqich interaktiv modellar, jadvallar va amaliy testlar bilan.
            </p>

            {/* Statistika kartalari */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
              {[
                { son: JAMI_MAVZU, label: "mavzu" },
                { son: JAMI_3D, label: "3D model" },
                { son: BOSQICHLAR.length, label: "bosqich" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-4 text-center border shadow-xs"
                  style={{
                    background: "var(--v3-yuza)",
                    borderColor: "var(--v3-chiziq)"
                  }}
                >
                  <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--v3-urgu)" }}>
                    {s.son}
                  </div>
                  <div className="v3-xira text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ PROGRESS ═══ */}
        {yuklandi && (
          signedIn ? (
            <div
              className="rounded-2xl p-6 border shadow-sm"
              style={{
                background: "var(--v3-yuza)",
                borderColor: "var(--v3-chiziq)"
              }}
            >
              <div className="flex items-center justify-between mb-3 gap-3">
                <div>
                  <div className="font-bold text-base">Sizning natijangiz</div>
                  <div className="v3-xira text-xs mt-0.5">
                    {olchanganlar.length > 0
                      ? `${olchanganlar.length} ta mavzuda test topshirilgan`
                      : "Hali test topshirmadingiz"}
                  </div>
                </div>
                <div className="text-3xl font-extrabold" style={{ color: "var(--v3-urgu)" }}>
                  {umumiy}%
                </div>
              </div>
              <div
                className="w-full h-2.5 rounded-full overflow-hidden"
                style={{ background: "var(--v3-fon-2)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${umumiy}%`,
                    background: "var(--v3-urgu)"
                  }}
                />
              </div>
              <p className="v3-xira text-xs mt-2 opacity-80">
                Natija har mavzudagi eng yaxshi test ballingizdan hisoblanadi
              </p>
            </div>
          ) : (
            <div
              className="rounded-2xl p-6 border border-dashed flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
              style={{
                background: "var(--v3-yuza)",
                borderColor: "var(--v3-chiziq)"
              }}
            >
              <div>
                <div className="font-semibold text-base">📊 Progressni kuzatib boring</div>
                <div className="v3-xira text-xs mt-0.5">
                  Tizimga kirsangiz, har mavzu bo&apos;yicha test natijangiz saqlanadi
                </div>
              </div>
              <Link
                href="/login"
                className="shrink-0 px-6 py-2.5 rounded-xl font-bold text-sm text-center transition-all hover:scale-105"
                style={{
                  background: "var(--v3-urgu)",
                  color: "var(--v3-urgu-matn)"
                }}
              >
                Kirish
              </Link>
            </div>
          )
        )}

        {/* ═══ YO'L XARITASI ═══ */}
        <div className="space-y-6">
          <div>
            <div className="v3-nishon mb-1">O&apos;quv dasturi</div>
            <h2 className="v3-h2 text-xl sm:text-2xl font-bold">O&apos;quv yo&apos;li</h2>
            <p className="v3-xira text-xs sm:text-sm mt-1">
              Ketma-ket borish tavsiya etiladi — har bosqich oldingisiga tayanadi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BOSQICHLAR.map((b, i) => {
              const foiz = progress[b.id]
              const bor = typeof foiz === "number"

              return (
                <Link
                  key={b.id}
                  href={b.href}
                  className="group rounded-2xl p-5 border transition-all flex flex-col justify-between hover:scale-[1.01]"
                  style={{
                    background: "var(--v3-yuza)",
                    borderColor: "var(--v3-chiziq)"
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase"
                          style={{
                            background: "var(--v3-yuza-2)",
                            color: "var(--v3-urgu)"
                          }}
                        >
                          {b.isTest ? "SINOV" : `${i + 1}-BOSQICH`}
                        </span>
                        {b.uchD > 0 && (
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                            style={{
                              borderColor: "var(--v3-chiziq)",
                              color: "var(--v3-urgu-2)"
                            }}
                          >
                            {b.uchD} ta 3D
                          </span>
                        )}
                      </div>

                      {bor ? (
                        <span className="text-xs font-bold" style={{ color: "var(--v3-urgu)" }}>
                          {foiz}%
                        </span>
                      ) : (
                        <span className="text-xl select-none">{b.icon}</span>
                      )}
                    </div>

                    <h3
                      className="text-lg font-bold transition-colors group-hover:opacity-90"
                      style={{ color: "var(--v3-matn)" }}
                    >
                      {b.title}
                    </h3>
                    <p className="v3-xira text-xs sm:text-sm mt-1 leading-relaxed">{b.desc}</p>
                    <p className="text-xs mt-2 italic opacity-75" style={{ color: "var(--v3-urgu)" }}>
                      {b.nima}
                    </p>
                  </div>

                  <div
                    className="flex items-center justify-between pt-4 mt-4 border-t text-xs font-medium"
                    style={{ borderColor: "var(--v3-chiziq)" }}
                  >
                    <span className="v3-xira">{b.mavzular} ta mavzu</span>
                    <span
                      className="font-semibold transition-transform group-hover:translate-x-1 inline-flex items-center gap-1"
                      style={{ color: "var(--v3-urgu)" }}
                    >
                      Ochish →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* ═══ TAVSIYALAR ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="rounded-2xl p-6 border"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "var(--v3-urgu)" }}>
              <span>🚀</span>
              <span>Yangi boshlovchiga maslahat</span>
            </h3>
            <ol className="space-y-3">
              {[
                ["Nomlanishi", "birikmani to'g'ri o'qishni o'rganing"],
                ["Klassifikatsiyasi", "turlarga ajratishni tushuning"],
                ["Fazoviy tuzilishi", "3D modellarda ko'ring"],
                ["Har bosqichdan keyin", "amaliy testni yeching"],
              ].map(([bosh, izoh], i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    style={{
                      background: "color-mix(in srgb, var(--v3-urgu) 18%, transparent)",
                      color: "var(--v3-urgu)"
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <strong style={{ color: "var(--v3-matn)" }}>{bosh}</strong> —{" "}
                    <span className="v3-xira">{izoh}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div
            className="rounded-2xl p-6 border"
            style={{
              background: "var(--v3-yuza)",
              borderColor: "var(--v3-chiziq)"
            }}
          >
            <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "var(--v3-matn)" }}>
              <span>💡</span>
              <span>Samarali o&apos;rganish qoidalari</span>
            </h3>
            <div className="space-y-3">
              {[
                ["📅", "Har kuni 30–60 daqiqa", "Bir kunda 5 soatdan ko'ra, har kuni ozdan o'qish samaraliroq"],
                ["✍️", "Qo'lda yozing", "Formulalarni qog'ozga ko'chiring — esda yaxshiroq qoladi"],
                ["🔄", "1 · 3 · 7 kun qoidasi", "Yangi mavzuni shu kunlarda takrorlang"],
              ].map(([icon, bosh, izoh]) => (
                <div
                  key={bosh}
                  className="rounded-xl p-3 flex gap-3 border"
                  style={{
                    background: "var(--v3-yuza-2)",
                    borderColor: "var(--v3-chiziq)"
                  }}
                >
                  <span className="text-base shrink-0 select-none">{icon}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs sm:text-sm" style={{ color: "var(--v3-urgu)" }}>
                      {bosh}
                    </div>
                    <div className="v3-xira text-xs mt-0.5">{izoh}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ CTA ═══ */}
        <div
          className="relative rounded-2xl p-8 text-center border overflow-hidden shadow-sm"
          style={{
            background: "color-mix(in srgb, var(--v3-fon-2) 70%, var(--v3-yuza))",
            borderColor: "var(--v3-chiziq)"
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: "var(--v3-matn)" }}>
            Birinchi bosqichdan boshlang
          </h2>
          <p className="v3-xira text-xs sm:text-sm mb-6 max-w-xl mx-auto">
            <strong style={{ color: "var(--v3-urgu)" }}>Nomlanishi</strong> — kompleks
            birikmalar kimyosining alifbosi. Boshqa barcha bo&apos;limlar shunga tayanadi.
          </p>
          <Link
            href="/oquv/nomlanishi"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-md"
            style={{
              background: "var(--v3-urgu)",
              color: "var(--v3-urgu-matn)"
            }}
          >
            <span>📖 Nomlanishidan boshlash</span>
            <span>→</span>
          </Link>
        </div>
      </main>

      <footer
        className="border-t py-8 mt-12"
        style={{ borderColor: "var(--v3-chiziq)" }}
      >
        <div className="v3-konteyner text-center text-xs v3-xira">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo ta&apos;lim portali</p>
          <p className="mt-1 opacity-70">
            O&apos;quv bo&apos;limi • {BOSQICHLAR.length} bosqich • {JAMI_MAVZU} mavzu • {JAMI_3D} interaktiv 3D model
          </p>
        </div>
      </footer>
    </div>
  )
}
