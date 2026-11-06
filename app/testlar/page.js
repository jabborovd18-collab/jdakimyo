"use client"

import Link from "next/link"
import { BOSHQA_TESTLAR } from "@/lib/fanlar"
import Ikon from "@/components/Ikon"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"

export default function TestlarSahifa() {
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
                Kimyo testlari
              </h1>
              <div className="text-xs v3-xira">Mavzuli, DTM blok va blits mashg&apos;ulotlar</div>
            </div>
          </div>

          <FonTanlagich fon={fon} tanla={fonTanla} />
        </div>
      </header>

      {/* Testlar ro'yxati */}
      <div className="v3-konteyner py-6 flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BOSHQA_TESTLAR.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] flex flex-col justify-between hover:border-[var(--v3-urgu)] transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 rounded-xl bg-[var(--v3-yuza-2)] text-[var(--v3-urgu)]">
                    <Ikon nom={b.ikon} olcham={20} />
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] text-[var(--v3-urgu)]">
                    {b.soni}
                  </span>
                </div>

                <h2 className="font-bold text-base text-[var(--v3-matn)]">
                  {b.nom}
                </h2>
                <p className="text-xs text-[var(--v3-xira)] mt-2">
                  {b.tavsif}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--v3-chiziq)]">
                <Link
                  href="/profil/quizlar"
                  className="w-full py-2.5 px-3 text-xs font-semibold rounded-xl bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] hover:opacity-90 transition flex items-center justify-center gap-1.5"
                >
                  <Ikon nom="ong" olcham={14} />
                  <span>Mashqni boshlash</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
