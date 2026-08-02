// components/LabWidget.jsx
"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * Shaxsiy kabinetdagi laboratoriya kartochkasi.
 *
 * Nega kerak: laboratoriya alohida sahifada va o'z sarlavhasi bilan
 * ochiladi, ya'ni kabinetga kirgan odam uning borligini bilmasligi mumkin.
 * Bu kartochka darajani, valyutani va inventarni ko'rsatib, kirish nuqtasi
 * bo'lib turadi.
 *
 * Yuklanmasa jim yo'qoladi: kabinetning asosiy qismi laboratoriyaga
 * bog'liq emas, xato xabari u yerda ortiqcha shovqin bo'lardi.
 */
export default function LabWidget() {
  const [holat, setHolat] = useState(null)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)

  useEffect(() => {
    let bekor = false
    ;(async () => {
      try {
        const res = await fetch('/api/laboratoriya')
        if (!res.ok) return
        const data = await res.json()
        if (!bekor) setHolat(data)
      } catch {
        // jim
      } finally {
        if (!bekor) setYuklanmoqda(false)
      }
    })()
    return () => { bekor = true }
  }, [])

  if (yuklanmoqda) {
    return (
      <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border border-cyan-700/40 rounded-2xl p-6 animate-pulse">
        <div className="h-6 w-40 bg-cyan-800/40 rounded mb-3" />
        <div className="h-4 w-64 bg-cyan-800/30 rounded" />
      </div>
    )
  }

  if (!holat?.lab) return null

  const daraja = holat.lab.darajaHolati || { daraja: holat.lab.daraja, joriy: 0, kerak: 1, foiz: 0 }
  const inventar = holat.inventar || []
  const jihozSoni = inventar.filter((i) => i.turi === 'jihoz').length
  const reagentSoni = inventar.filter((i) => i.turi === 'reagent').length

  return (
    <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border border-cyan-700/40 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="text-5xl">🔬</div>
          <div>
            <h2 className="text-xl font-bold text-white">{holat.lab.nom}</h2>
            <p className="text-sm text-cyan-300">{daraja.daraja}-daraja laboratoriya</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-700/40 text-center">
            <div className="text-lg font-bold text-amber-400">🪙 {holat.balans?.coins ?? 0}</div>
            <div className="text-[10px] text-amber-300/70">Tanga</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-cyan-950/40 border border-cyan-700/40 text-center">
            <div className="text-lg font-bold text-cyan-300">💎 {holat.balans?.gems ?? 0}</div>
            <div className="text-[10px] text-cyan-300/70">Olmos</div>
          </div>
        </div>
      </div>

      {/* Daraja tajribadan o'sadi — keyingisigacha qancha qolgani */}
      <div className="mt-4">
        <div className="h-2 rounded-full bg-cyan-950 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-teal-400"
            style={{ width: `${daraja.foiz}%` }}
          />
        </div>
        <div className="text-[11px] text-cyan-400/80 mt-1">
          {daraja.joriy} / {daraja.kerak} tajriba → {daraja.daraja + 1}-daraja
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <span className="text-xs text-cyan-200/80">🔧 {jihozSoni} xil jihoz</span>
        <span className="text-xs text-cyan-200/80">⚗️ {reagentSoni} xil reagent</span>
      </div>

      <div className="flex gap-2 mt-4">
        <Link
          href="/laboratoriya"
          className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold text-sm"
        >
          Laboratoriyaga kirish
        </Link>
        {inventar.length === 0 && (
          <span className="hidden sm:flex items-center px-3 text-[11px] text-cyan-400/70">
            Laboratoriya hali bo'sh — kunlik yetkazib berish bepul
          </span>
        )}
      </div>
    </div>
  )
}
