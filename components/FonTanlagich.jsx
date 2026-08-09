"use client"

import { useState, useEffect } from "react"
import { FONLAR, ODDIY_FON, fonOqi, fonYoz } from "@/lib/sahifa-fon"
import Ikon from "./Ikon"

/**
 * FON TANLASH — v3 sahifalari uchun.
 *
 * `useFon()` tanlovni saqlaydi va `<html>` ga `data-fon` bo'lib yozadi;
 * CSS o'zgaruvchilari (app/globals.css, "v3.0.0" bo'limi) shu atributga
 * bog'langan.
 *
 * SAHIFADAN CHIQQANDA ATRIBUT O'CHIRILADI. Bu shart, tozalik uchun emas:
 * saytning qolgan ~650 sahifasida ranglar Tailwind sinflari bilan qattiq
 * yozilgan va ular doim qorong'u fonni nazarda tutadi. "Kunduz" foni
 * o'sha sahifalarga o'tib ketsa, oq fonda oq matn chiqadi va sahifa
 * o'qib bo'lmaydigan holga keladi.
 *
 * NEGA SERVERDA EMAS. Tanlov localStorage'da — ya'ni birinchi chizishda
 * server uni bilmaydi va sahifa ODDIY_FON bilan keladi. Buni cookie bilan
 * hal qilish mumkin, lekin u har bir so'rovni shaxsiylashtiradi va statik
 * keshni buzadi. Bitta kadrlik almashuv shunga arzimaydi.
 */
export function useFon() {
  const [fon, setFon] = useState(ODDIY_FON)

  useEffect(() => {
    const saqlangan = fonOqi()
    if (saqlangan) setFon(saqlangan)
  }, [])

  useEffect(() => {
    const el = document.documentElement
    el.setAttribute("data-fon", fon)
    return () => el.removeAttribute("data-fon")
  }, [fon])

  return [fon, (id) => setFon(fonYoz(id))]
}

export default function FonTanlagich({ fon, tanla }) {
  const [ochiq, setOchiq] = useState(false)
  const joriy = FONLAR.find((f) => f.id === fon) || FONLAR[0]

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
                onClick={() => { tanla(f.id); setOchiq(false) }}
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
