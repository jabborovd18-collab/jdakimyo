"use client"

import { useEffect } from "react"
import { ODDIY_FON, fonOqi } from "@/lib/sahifa-fon"

/**
 * YAGONA V4 FON (Safir `tun`).
 * `<html>` ustida `data-fon="tun"` ni barqaror ushlab turadi.
 */
export function useFon() {
  useEffect(() => {
    fonOqi()
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute("data-fon", ODDIY_FON)
    }
  }, [])

  return [ODDIY_FON, () => ODDIY_FON]
}

// Eski 4-mavzuli tanlagich butun platformada o'chirildi (yakka V4 Safir foni)
export default function FonTanlagich() {
  return null
}
