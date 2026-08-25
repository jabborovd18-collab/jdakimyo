"use client"

import Link from "next/link"
import OquvHeader from "./OquvHeader"

/**
 * Barcha o'quv mavzulari uchun yagona V3 shablon komponenti.
 * 
 * @param {string} sarlavha - Mavzu nomi
 * @param {string} [tavsif] - Mavzu tavsifi
 * @param {string} [ikon] - Emoji yoki belgi
 * @param {string} [nishon] - Masalan: "01-MAVZU"
 * @param {Array<{nom: string, havola?: string}>} yol - Breadcrumb yo'li
 * @param {Array<{id: string, label: string, icon?: string}>} [bolimlar] - Ichki bo'limlar navigatsiyasi
 * @param {string} [faolBolim] - Hozirgi tanlangan ichki bo'lim id si
 * @param {Function} [onBolimTanla] - Bo'lim tanlanganda chaqiriluvchi funksiya
 * @param {{nom: string, havola: string}} [oldingiMavzu] - Oldingi mavzuga havola
 * @param {{nom: string, havola: string}} [keyingiMavzu] - Keyingi mavzuga havola
 * @param {string} [quizHavola] - Mavzuga oid test havolasi
 * @param {React.ReactNode} children - Asosiy mazmun
 */
export default function MavzuLayout({
  sarlavha,
  tavsif,
  ikon,
  nishon,
  yol = [],
  bolimlar = [],
  faolBolim,
  onBolimTanla,
  oldingiMavzu,
  keyingiMavzu,
  quizHavola,
  ongTaraf,
  children
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--v3-fon)",
        color: "var(--v3-matn)"
      }}
    >
      {/* ═══ YAGONA HEADER ═══ */}
      <OquvHeader
        sarlavha={sarlavha}
        tavsif={tavsif}
        ikon={ikon}
        nishon={nishon}
        yol={yol}
        ongTaraf={ongTaraf}
      />

      {/* ═══ ICHKI BO'LIMLAR TABLARI (AGAR BO'LSA) ═══ */}
      {bolimlar.length > 0 && (
        <div
          className="border-b sticky top-[73px] z-30 backdrop-blur-md"
          style={{
            borderColor: "var(--v3-chiziq)",
            background: "color-mix(in srgb, var(--v3-fon) 88%, transparent)"
          }}
        >
          <div className="v3-konteyner py-2.5 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 min-w-max">
              {bolimlar.map((b) => {
                const faol = faolBolim === b.id
                return (
                  <button
                    key={b.id}
                    onClick={() => onBolimTanla && onBolimTanla(b.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-medium transition-all flex items-center gap-2 border"
                    style={{
                      background: faol
                        ? "color-mix(in srgb, var(--v3-urgu) 15%, var(--v3-yuza))"
                        : "var(--v3-yuza)",
                      color: faol ? "var(--v3-urgu)" : "var(--v3-xira)",
                      borderColor: faol
                        ? "color-mix(in srgb, var(--v3-urgu) 40%, var(--v3-chiziq))"
                        : "var(--v3-chiziq)"
                    }}
                  >
                    {b.icon && <span>{b.icon}</span>}
                    <span>{b.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ ASOSIY MAZMUN ═══ */}
      <main className="v3-konteyner py-8 md:py-12 flex-1 w-full space-y-10">
        {children}

        {/* ═══ MAVZULARARO NAVIGATSIYA & QUIZ ═══ */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--v3-chiziq)" }}
        >
          <div>
            {oldingiMavzu ? (
              <Link
                href={oldingiMavzu.havola}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:opacity-80"
                style={{
                  background: "var(--v3-yuza)",
                  borderColor: "var(--v3-chiziq)",
                  color: "var(--v3-matn)"
                }}
              >
                <span>←</span>
                <span>{oldingiMavzu.nom}</span>
              </Link>
            ) : (
              <div />
            )}
          </div>

          {quizHavola && (
            <Link
              href={quizHavola}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-md"
              style={{
                background: "var(--v3-urgu)",
                color: "var(--v3-urgu-matn)"
              }}
            >
              <span>🎯</span>
              <span>Mavzu bo&apos;yicha test ishlash</span>
            </Link>
          )}

          <div>
            {keyingiMavzu ? (
              <Link
                href={keyingiMavzu.havola}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:opacity-80"
                style={{
                  background: "var(--v3-yuza)",
                  borderColor: "var(--v3-chiziq)",
                  color: "var(--v3-matn)"
                }}
              >
                <span>{keyingiMavzu.nom}</span>
                <span>→</span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
