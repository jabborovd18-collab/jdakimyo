"use client"

import Link from "next/link"
import OquvBreadcrumb from "./OquvBreadcrumb"

/**
 * O'quv bo'limi barcha sahifalari uchun umumiy V3 Sarlavha (Header).
 * 
 * @param {string} sarlavha - Asosiy sarlavha
 * @param {string} [tavsif] - Qisqacha ilmiy tavsif
 * @param {string} [ikon] - Katta emoji yoki belgi
 * @param {string} [nishon] - Yuqori kichik yorliq (masalan, "Mavzu 01", "IUPAC")
 * @param {Array<{nom: string, havola?: string}>} [yol] - Breadcrumb ro'yxati
 * @param {React.ReactNode} [ongTaraf] - O'ng tarafdagi qo'shimcha tugmalar
 */
export default function OquvHeader({
  sarlavha,
  tavsif,
  ikon,
  nishon,
  yol = [],
  ongTaraf
}) {
  return (
    <header className="v3-header">
      <div className="v3-konteyner py-4">
        {yol.length > 0 && <OquvBreadcrumb yol={yol} />}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {nishon && <div className="v3-nishon mb-1.5">{nishon}</div>}
            <h1 className="v3-h1 text-2xl md:text-3xl font-bold flex items-center gap-2.5 m-0">
              {ikon && <span className="text-2xl md:text-3xl select-none">{ikon}</span>}
              <span>{sarlavha}</span>
            </h1>
            {tavsif && (
              <p className="v3-xira text-sm mt-1.5 max-w-3xl leading-relaxed">
                {tavsif}
              </p>
            )}
          </div>
          {ongTaraf && (
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              {ongTaraf}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
