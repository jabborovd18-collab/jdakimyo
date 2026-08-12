"use client"

import { useState, useEffect } from "react"
import { FONLAR, ODDIY_FON, fonOqi, fonYoz } from "@/lib/sahifa-fon"
import Ikon from "./Ikon"

/**
 * FON TANLASH — v3 sahifalari uchun (tun, siyoh, grafit, kunduz).
 * Tanlovni darhol saqlaydi va `<html>` ga `data-fon` bo'lib yozadi.
 */
export function useFon() {
  const [fon, setFon] = useState(ODDIY_FON)

  useEffect(() => {
    const saqlangan = fonOqi()
    if (saqlangan) {
      setFon(saqlangan)
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute("data-fon", saqlangan)
      }
    } else if (typeof document !== 'undefined') {
      document.documentElement.setAttribute("data-fon", ODDIY_FON)
    }
  }, [])

  const almashtir = (id) => {
    const toza = fonYoz(id)
    setFon(toza)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute("data-fon", toza)
    }
  }

  return [fon, almashtir]
}

export default function FonTanlagich({ fon, tanla, onFonTanla, onTanla }) {
  const [ochiq, setOchiq] = useState(false)
  const joriy = FONLAR.find((f) => f.id === fon) || FONLAR[0]
  const oziTanla = onFonTanla || tanla || onTanla || (() => {})

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOchiq((v) => !v)}
        className="v3-ikon-tugma"
        aria-haspopup="menu"
        aria-expanded={ochiq}
        title={`Fon: ${joriy.nom}`}
      >
        <Ikon nom="palitra" olcham={18} />
        <span className="sr-only">Fonni almashtirish</span>
      </button>

      {ochiq && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOchiq(false)} />
          <div className="v3-menyu v3-tushish absolute right-0 mt-2 w-60 z-50 p-1.5" role="menu">
            <div className="v3-nishon px-2.5 pt-1.5 pb-2">Sahifa foni</div>
            {FONLAR.map((f) => (
              <button
                key={f.id}
                type="button"
                role="menuitemradio"
                aria-checked={f.id === fon}
                onClick={() => {
                  oziTanla(f.id)
                  setOchiq(false)
                }}
                className={`v3-menyu-qator w-full text-left ${f.id === fon ? "is-tanlangan" : ""}`}
              >
                <span
                  className="v3-fon-namuna"
                  style={{ background: f.namuna.fon, borderColor: f.namuna.urgu }}
                />
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-semibold">{f.nom}</span>
                  <span className="block text-[11px] v3-xira truncate">{f.tavsif}</span>
                </span>
                {f.id === fon && <Ikon nom="belgi" olcham={15} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
