"use client"

import Link from "next/link"
import { OLIY_KIMYO } from "@/lib/fanlar"
import Ikon from "@/components/Ikon"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"

export default function OliyKimyoSahifa() {
  const [fon, fonTanla] = useFon()

  return (
    <main data-fon={fon} className="v3 min-h-screen flex flex-col">
      {/* Sarlavha */}
      <header className="v3-header">
        <div className="v3-konteyner flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:border-[var(--v3-chiziq-2)] transition"
              title="Bosh sahifa"
            >
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[var(--v3-matn)]">
                Oliy kimyo
              </h1>
              <div className="text-xs v3-xira">Bakalavriat va magistratura video ma&apos;ruzalari</div>
            </div>
          </div>

          <FonTanlagich fon={fon} tanla={fonTanla} />
        </div>
      </header>

      {/* Fanlar ro'yxati */}
      <div className="v3-konteyner py-6 flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OLIY_KIMYO.map((fan) => {
            const ochiq = fan.holat === "ochiq"
            return (
              <div
                key={fan.slug}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition ${
                  ochiq
                    ? "border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:border-[var(--v3-urgu)]"
                    : "border-[var(--v3-chiziq)] bg-[var(--v3-yuza-2)] opacity-80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-urgu)]">
                      {fan.belgi}
                    </span>
                    {ochiq ? (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <Ikon nom="video" olcham={13} />
                        <span>{fan.videoDarslar} ta video</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                        <Ikon nom="qulf" olcham={13} />
                        <span>Tayyorlanmoqda</span>
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-[var(--v3-matn)]">
                    {fan.nom}
                  </h2>
                  <div className="text-xs v3-xira mt-0.5">{fan.qisqa}</div>
                  <p className="text-xs text-[var(--v3-xira)] mt-2.5">
                    {fan.tavsif}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--v3-chiziq)]">
                  {ochiq ? (
                    <Link
                      href={`/fan/${fan.slug}`}
                      className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] hover:opacity-90 transition flex items-center justify-center gap-1.5"
                    >
                      <Ikon nom="play" olcham={13} />
                      <span>Video darslarni ko&apos;rish</span>
                    </Link>
                  ) : (
                    <div className="py-2 px-3 text-xs font-medium rounded-xl bg-[var(--v3-yuza-2)] text-[var(--v3-xira)] flex items-center justify-center gap-1.5 cursor-not-allowed">
                      <Ikon nom="qulf" olcham={13} />
                      <span>Yaqinda taqdim etiladi</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
