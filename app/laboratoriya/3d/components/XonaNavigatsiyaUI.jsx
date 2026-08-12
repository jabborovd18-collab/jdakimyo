"use client"

import { useState } from 'react'
import Ikon from '@/components/Ikon'
import { XONA_ZONALARI } from '../lib/xona-zonalari.js'

export default function XonaNavigatsiyaUI({ faolZona = 'asosiy', onZonaTanlandi }) {
  const [ochiq, setOchiq] = useState(false)

  const zonalari = Object.values(XONA_ZONALARI)

  return (
    <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2">
      {/* Desktop & Tablet: Horizontal floating navigation bar */}
      <div className="hidden sm:flex items-center gap-1 p-1.5 rounded-2xl border backdrop-blur-xl bg-[var(--v3-fon-2)]/95 border-[var(--v3-chiziq-2)] shadow-xl">
        {zonalari.map((z) => {
          const isActive = faolZona === z.kalit

          return (
            <button
              key={z.kalit}
              type="button"
              onClick={() => typeof onZonaTanlandi === 'function' && onZonaTanlandi(z.kalit)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] font-bold shadow-sm'
                  : 'text-[var(--v3-xira)] hover:text-[var(--v3-matn)] hover:bg-[var(--v3-yuza)]'
              }`}
              title={z.tavsif}
            >
              <Ikon nom={z.ikon} olcham={14} />
              <span>{z.nom.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* Mobile: Compact Zone Selector Button & Dropdown */}
      <div className="sm:hidden relative">
        <button
          type="button"
          onClick={() => setOchiq(!ochiq)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border backdrop-blur-xl bg-[var(--v3-fon-2)]/95 border-[var(--v3-chiziq-2)] text-xs font-bold text-[var(--v3-urgu)] shadow-xl"
        >
          <Ikon nom="kolba" olcham={14} />
          <span>{XONA_ZONALARI[faolZona]?.nom || 'Xona zonasi'}</span>
          <Ikon nom="past" olcham={12} />
        </button>

        {ochiq && (
          <div className="absolute right-0 mt-1.5 w-56 rounded-2xl border p-2 backdrop-blur-xl bg-[var(--v3-fon-2)] border-[var(--v3-chiziq-2)] shadow-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="v3-nishon px-2 py-1 text-[10px]">Laboratoriya zonalari</div>
            {zonalari.map((z) => {
              const isActive = faolZona === z.kalit

              return (
                <button
                  key={z.kalit}
                  type="button"
                  onClick={() => {
                    if (typeof onZonaTanlandi === 'function') onZonaTanlandi(z.kalit)
                    setOchiq(false)
                  }}
                  className={`w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)]'
                      : 'text-[var(--v3-matn)] hover:bg-[var(--v3-yuza)]'
                  }`}
                >
                  <Ikon nom={z.ikon} olcham={15} />
                  <span>{z.nom}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
