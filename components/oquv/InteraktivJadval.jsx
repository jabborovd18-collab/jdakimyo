"use client"

import { useState, useMemo } from "react"
import KimyoFormula from "./KimyoFormula"

/**
 * Kimyoviy jadvallar uchun V3 qidiruvli va moslashuvchan jadval komponenti.
 * 
 * @param {string} [sarlavha] - Jadval sarlavhasi
 * @param {Array<{kalit: string, nom: string, kenglik?: string, format?: "formula" | "matn" | "kod"}>} ustunlar - Ustunlar ta'rifi
 * @param {Array<Object>} qatorlar - Ma'lumotlar
 * @param {string} [qidiruvMaydoni] - Qaysi maydon bo'yicha qidirish
 */
export default function InteraktivJadval({
  sarlavha,
  ustunlar = [],
  qatorlar = [],
  qidiruvMaydoni
}) {
  const [qidiruv, setQidiruv] = useState("")

  const filtrlangan = useMemo(() => {
    if (!qidiruv.trim()) return qatorlar
    const matn = qidiruv.toLowerCase()
    return qatorlar.filter((q) => {
      if (qidiruvMaydoni && q[qidiruvMaydoni]) {
        return String(q[qidiruvMaydoni]).toLowerCase().includes(matn)
      }
      return Object.values(q).some((v) =>
        String(v).toLowerCase().includes(matn)
      )
    })
  }, [qatorlar, qidiruv, qidiruvMaydoni])

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all shadow-sm"
      style={{
        background: "var(--v3-yuza)",
        borderColor: "var(--v3-chiziq)"
      }}
    >
      {/* ═══ QIDIRUV VA SARLAVHA ═══ */}
      {(sarlavha || qatorlar.length > 5) && (
        <div
          className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ borderColor: "var(--v3-chiziq)" }}
        >
          {sarlavha && (
            <h3 className="text-base font-semibold" style={{ color: "var(--v3-matn)" }}>
              {sarlavha}
              <span className="ml-2 text-xs font-normal opacity-60">
                ({filtrlangan.length} ta)
              </span>
            </h3>
          )}

          {qatorlar.length > 5 && (
            <div className="relative">
              <input
                type="text"
                value={qidiruv}
                onChange={(e) => setQidiruv(e.target.value)}
                placeholder="Jadvaldan qidirish..."
                className="px-3 py-1.5 pl-8 rounded-xl text-xs sm:text-sm border outline-none transition-colors w-full sm:w-56"
                style={{
                  background: "color-mix(in srgb, var(--v3-fon) 50%, transparent)",
                  borderColor: "var(--v3-chiziq)",
                  color: "var(--v3-matn)"
                }}
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs opacity-50">
                🔍
              </span>
            </div>
          )}
        </div>
      )}

      {/* ═══ JADVAL ═══ */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr
              style={{
                background: "color-mix(in srgb, var(--v3-fon) 40%, var(--v3-yuza))",
                borderBottom: "1px solid var(--v3-chiziq)"
              }}
            >
              {ustunlar.map((u) => (
                <th
                  key={u.kalit}
                  className="px-4 py-3 font-semibold text-xs uppercase tracking-wider"
                  style={{
                    color: "var(--v3-xira)",
                    width: u.kenglik || "auto"
                  }}
                >
                  {u.nom}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--v3-chiziq)" }}>
            {filtrlangan.length === 0 ? (
              <tr>
                <td
                  colSpan={ustunlar.length}
                  className="px-4 py-8 text-center opacity-60"
                >
                  Mos ma&apos;lumot topilmadi
                </td>
              </tr>
            ) : (
              filtrlangan.map((qator, index) => (
                <tr
                  key={index}
                  className="hover:opacity-90 transition-colors"
                  style={{
                    background:
                      index % 2 === 1
                        ? "color-mix(in srgb, var(--v3-fon) 20%, transparent)"
                        : "transparent"
                  }}
                >
                  {ustunlar.map((u) => {
                    const qiymat = qator[u.kalit]
                    return (
                      <td
                        key={u.kalit}
                        className="px-4 py-3 align-middle"
                        style={{ color: "var(--v3-matn)" }}
                      >
                        {u.format === "formula" ? (
                          <KimyoFormula formula={String(qiymat || "")} />
                        ) : u.format === "kod" ? (
                          <code
                            className="px-1.5 py-0.5 rounded text-xs"
                            style={{
                              background: "var(--v3-yuza-2)",
                              color: "var(--v3-urgu)"
                            }}
                          >
                            {qiymat}
                          </code>
                        ) : (
                          qiymat
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
