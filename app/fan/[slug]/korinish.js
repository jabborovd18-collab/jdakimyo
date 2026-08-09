"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import Ikon from "@/components/Ikon"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import { FANLAR, fanHavolasi } from "@/lib/fanlar"

/**
 * Fan sahifasining ko'rinishi.
 *
 * NEGA `page.js` DAN AJRATILGAN. Sahifaga `useSession` va fon tanlagich
 * kerak, ya'ni u mijoz komponenti. Lekin `"use client"` yozilgan fayl
 * `metadata` eksport qila olmaydi — natijada sahifa butun saytga umumiy
 * sarlavha bilan indekslanardi. Shuning uchun `page.js` server bo'lib
 * qoladi (sarlavha, canonical, `generateStaticParams`), ko'rinish esa shu
 * yerda. Bu naqsh loyihada allaqachon 54 ta sahifada ishlatilgan.
 *
 * RANGLAR faqat `--v3-*` o'zgaruvchilari orqali (app/globals.css). Tailwind
 * rang sinfi yozilsa, "kunduz" fonida sahifa buziladi.
 */
export default function Korinish({ fan }) {
  const { data: session } = useSession()
  const [fon, fonTanla] = useFon()

  const asosiylar = fan.bolimlar.filter((b) => b.asosiy)
  const qolganlar = fan.bolimlar.filter((b) => !b.asosiy)

  // Yon ustundagi "boshqa fanlar" ro'yxati — hozircha hammasi yopiq,
  // shuning uchun ular havola emas, holat ko'rsatkichi.
  const boshqalar = FANLAR.filter((f) => f.slug !== fan.slug)

  return (
    <main data-fon={fon} className="v3 min-h-screen overflow-x-hidden">

      {/* ═══ SARLAVHA ═══ */}
      <header className="v3-header">
        <div className="v3-konteyner flex items-center justify-between gap-3 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="v3-logo" aria-hidden="true" />
              <span className="v3-logo-matn">JDA KIMYO</span>
            </Link>
            <span className="v3-yol-ajratgich hidden sm:inline">/</span>
            <span className="hidden sm:inline text-[13px] v3-xira truncate">{fan.nom}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link href="/" className="v3-orqa mr-1 hidden md:inline-flex">
              <Ikon nom="ong" olcham={15} />
              Barcha fanlar
            </Link>

            <FonTanlagich fon={fon} tanla={fonTanla} />

            <Link href="/qidiruv" className="v3-qidiruv">
              <Ikon nom="qidiruv" olcham={17} />
              <span className="hidden lg:inline">Qidiruv</span>
            </Link>

            {session ? (
              <Link href="/profil" className="v3-ikon-tugma" title="Shaxsiy kabinet">
                <Ikon nom="odam" olcham={17} />
              </Link>
            ) : (
              <Link href="/login" className="v3-tugma">Kirish</Link>
            )}
          </div>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="v3-nur v3-nur-a" aria-hidden="true" />
        <div className="v3-tor-fon" aria-hidden="true" />

        <div className="v3-konteyner relative z-10 pt-10 pb-14 md:pt-14 md:pb-20">
          <nav className="v3-yol" aria-label="Yo'l">
            <Link href="/">Bosh sahifa</Link>
            <span className="v3-yol-ajratgich">/</span>
            <Link href="/#fanlar">Fanlar</Link>
            <span className="v3-yol-ajratgich">/</span>
            <span style={{ color: "var(--v3-matn)" }}>{fan.nom}</span>
          </nav>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="v3-holat is-ochiq">
                  <Ikon nom="ochiq" olcham={13} qalin={1.8} />
                  Ochiq
                </span>
                <span className="v3-nishon">{fan.qisqa}</span>
              </div>

              <h1 className="v3-h1" style={{ fontSize: "clamp(34px, 5.5vw, 60px)" }}>
                {fan.nom}
              </h1>

              <p className="v3-lid">{fan.kirish}</p>

              <div className="flex flex-wrap gap-3">
                {asosiylar.map((b) => (
                  <Link key={b.href} href={b.href} className="v3-tugma-asosiy v3-katta">
                    {b.nom}
                    <Ikon nom="ong" olcham={17} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="w-full">
              <div className="v3-fan-hero-belgi mb-5">{fan.belgi}</div>

              <div className="v3-oyoq-karta" style={{ padding: "20px" }}>
                <div className="v3-nishon mb-3">Boshqa fanlar</div>
                <ul className="flex flex-col gap-2.5">
                  {boshqalar.map((f) => (
                    <li key={f.slug} className="flex items-center gap-2.5 text-[13px]">
                      {f.holat === "ochiq" ? (
                        <Link href={fanHavolasi(f)} className="flex items-center gap-2.5 flex-1">
                          <span className="v3-nuqta" />
                          <span className="flex-1">{f.nom}</span>
                          <Ikon nom="ong" olcham={14} />
                        </Link>
                      ) : (
                        <>
                          <span style={{ color: "var(--v3-xira)", opacity: .6 }}>
                            <Ikon nom="qulf" olcham={14} />
                          </span>
                          <span className="flex-1 v3-xira">{f.nom}</span>
                          <span className="v3-xira text-[11px]">yopiq</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ YO'NALISHLAR ═══ */}
      <section className="v3-konteyner pb-16 md:pb-24">
        <div className="v3-bosh">
          <div>
            <div className="v3-nishon mb-2">Fan ichida</div>
            <h2 className="v3-h2">Yo{"'"}nalishlar</h2>
          </div>
          <p className="v3-bosh-izoh">
            Bu bo{"'"}limlar faqat shu fanga tegishli. Laboratoriya, testlar,
            kanallar va shaxsiy kabinet kabi umumiy bo{"'"}limlar{" "}
            <Link href="/" style={{ color: "var(--v3-urgu)" }}>bosh sahifada</Link>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...asosiylar, ...qolganlar].map((b) => (
            <Link
              key={b.href}
              href={b.href}
              className={`v3-yonalish ${b.asosiy ? "is-asosiy" : ""}`}
            >
              <span className="v3-yonalish-ikon">
                <Ikon nom={b.ikon} olcham={21} qalin={1.5} />
              </span>
              <h3 className="v3-yonalish-nom">{b.nom}</h3>
              <p className="v3-yonalish-tavsif">{b.tavsif}</p>
              <span className="v3-yonalish-oyoq">
                <span>{b.birlik}</span>
                <Ikon nom="ong" olcham={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ OYOQ ═══ */}
      <footer className="v3-oyoq">
        <div className="v3-konteyner py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="v3-orqa">
            <Ikon nom="ong" olcham={15} />
            Barcha fanlarga qaytish
          </Link>
          <p className="v3-xira text-xs">© 2026 JDA KIMYO · Oliy kimyo platformasi</p>
        </div>
      </footer>
    </main>
  )
}
