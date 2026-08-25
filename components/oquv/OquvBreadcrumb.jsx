"use client"

import Link from "next/link"

/**
 * O'quv bo'limi uchun V3 breadcrumb (yo'l ko'rsatkich) komponenti.
 * 
 * Barcha 4 ta mavzuda (`tun`, `siyoh`, `grafit`, `kunduz`) to'g'ri o'qilishi
 * uchun qattiq ranglar emas, `var(--v3-xira)` va `var(--v3-matn)` ishlatiladi.
 * 
 * @param {Array<{nom: string, havola?: string}>} yol - yo'l bo'laklari
 */
export default function OquvBreadcrumb({ yol = [] }) {
  return (
    <nav className="v3-yol flex items-center gap-1.5 text-xs flex-wrap mb-3" aria-label="Yo'l">
      <Link href="/" className="hover:opacity-80 transition-opacity">
        Bosh sahifa
      </Link>
      <span className="v3-yol-ajratgich text-sm opacity-40">/</span>
      <Link href="/oquv" className="hover:opacity-80 transition-opacity">
        O&apos;quv
      </Link>
      {yol.map((qadam, index) => {
        const oxirgi = index === yol.length - 1
        return (
          <span key={index} className="inline-flex items-center gap-1.5">
            <span className="v3-yol-ajratgich text-sm opacity-40">/</span>
            {oxirgi || !qadam.havola ? (
              <span className="font-semibold" style={{ color: "var(--v3-matn)" }}>
                {qadam.nom}
              </span>
            ) : (
              <Link href={qadam.havola} className="hover:opacity-80 transition-opacity">
                {qadam.nom}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
