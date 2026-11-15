"use client"

import Link from "next/link"
import { OLIY_KIMYO } from "@/lib/fanlar"
import Ikon from "@/components/Ikon"
import { useFon } from "@/components/FonTanlagich"

export default function OliyKimyoSahifa() {
  const [fon] = useFon()

  return (
    <main data-fon={fon} className="v3 min-h-screen flex flex-col">
      {/* Sarlavha */}
      <header className="v3-header">
        <div className="v3-konteyner flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="p-2 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:border-[var(--v3-chiziq-2)] transition shrink-0"
              title="Bosh sahifa"
            >
              <Ikon nom="chap" olcham={18} />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-[var(--v3-matn)] truncate">
                  Oliy kimyo fanlari
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 flex items-center gap-1 shrink-0">
                  <Ikon nom="soat" olcham={11} />
                  <span>Tez kunda qo&apos;shiladi</span>
                </span>
              </div>
              <div className="text-xs v3-xira truncate">
                Bakalavriat va magistratura yo&apos;nalishlari uchun fundamental kurslar ({OLIY_KIMYO.length} ta fan)
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:border-[var(--v3-urgu)] text-[var(--v3-matn)] transition shrink-0"
          >
            Bosh sahifa
          </Link>
        </div>
      </header>

      {/* Asosiy kontent */}
      <div className="v3-konteyner py-6 sm:py-8 flex-1 space-y-6">
        {/* Tez kunda ma'lumot banneri */}
        <div className="p-5 sm:p-6 rounded-2xl border border-amber-500/35 bg-amber-500/[0.07] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Ikon nom="oliy" olcham={22} />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-[var(--v3-matn)]">
                  Oliy kimyo kurslari tayyorlanmoqda — tez kunda qo&apos;shiladi
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[var(--v3-xira)] mt-1 leading-relaxed">
                Universitet dasturi asosida {OLIY_KIMYO.length} ta fundamental kimyo fani bo&apos;yicha nazariy ma&apos;ruzalar, reaksiya mexanizmlari, spektrlar tahlili va seminar masalalari bosqichma-bosqich joylashtiriladi.
              </p>
            </div>
          </div>
          <Link
            href="/maktabkimyo"
            className="px-4 py-2.5 rounded-xl bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-semibold text-xs shrink-0 hover:opacity-90 transition flex items-center gap-1.5"
          >
            <Ikon nom="kitob" olcham={14} />
            <span>Maktab kimyosiga o&apos;tish</span>
          </Link>
        </div>

        {/* 12 ta Oliy kimyo fanlari ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OLIY_KIMYO.map((fan, idx) => {
            const ochiq = fan.holat === "ochiq"
            return (
              <div
                key={fan.slug}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition ${
                  ochiq
                    ? "border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:border-[var(--v3-urgu)]"
                    : "border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:border-amber-500/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-9 h-9 rounded-xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-urgu)] flex items-center justify-center shrink-0">
                        <Ikon nom={fan.ikon || "atom"} olcham={18} />
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-urgu)]">
                        {fan.belgi}
                      </span>
                    </div>

                    {ochiq ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                        <Ikon nom="ochiq" olcham={12} />
                        <span>Ochiq</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 flex items-center gap-1">
                        <Ikon nom="soat" olcham={12} />
                        <span>Tez kunda</span>
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--v3-urgu)]">
                    {idx + 1}-kurs yo&apos;nalishi · {fan.qisqa}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--v3-matn)] mt-0.5">
                    {fan.nom}
                  </h3>
                  <p className="text-xs text-[var(--v3-xira)] mt-2 leading-relaxed">
                    {fan.tavsif}
                  </p>

                  {Array.isArray(fan.mavzular) && fan.mavzular.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-[var(--v3-chiziq)] space-y-1.5">
                      <div className="text-[11px] font-semibold text-[var(--v3-xira)]">
                        Rejadagi asosiy bo&apos;limlar:
                      </div>
                      <ul className="space-y-1">
                        {fan.mavzular.slice(0, 3).map((m, i) => (
                          <li
                            key={i}
                            className="text-[11px] text-[var(--v3-xira)] flex items-start gap-1.5 leading-snug"
                          >
                            <span className="text-[var(--v3-urgu)] font-bold mt-0.5">•</span>
                            <span>{m.nom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--v3-chiziq)]">
                  {ochiq ? (
                    <Link
                      href={`/fan/${fan.slug}`}
                      className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] hover:opacity-90 transition flex items-center justify-center gap-1.5"
                    >
                      <Ikon nom="play" olcham={13} />
                      <span>Kursni ochish</span>
                    </Link>
                  ) : (
                    <div className="py-2 px-3 text-xs font-semibold rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center justify-center gap-1.5 select-none">
                      <Ikon nom="soat" olcham={13} />
                      <span>Tez kunda qo&apos;shiladi</span>
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
