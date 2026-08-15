"use client"

// components/ilmiy/IlmiyBoshPanel.jsx
//
// Ilmiy sahifalarning yuqori paneli: yo'l (breadcrumb) va fon tanlagich.
//
// NEGA ALOHIDA CLIENT KOMPONENT. Tahlil sahifalarining o'zi SERVER
// komponenti — mazmuni statik matn va jadval, shuning uchun u build
// paytida HTML ga aylanadi va brauzerga JS yuborilmaydi. Lekin fon
// tanlash tugmasi holat saqlaydi va localStorage bilan ishlaydi, ya'ni
// u client bo'lishi shart.
//
// Yechim — orolcha: butun sahifani "use client" qilish o'rniga faqat
// SHU kichik bo'lak client bo'ladi. Sahifaning qolgan 15 000 belgilik
// ilmiy matni server tomonda qoladi.
//
// NEGA `<main data-fon>` KERAK EMAS. `useFon` tanlovni to'g'ridan-to'g'ri
// `<html>` elementiga `data-fon` atributi qilib yozadi (va sahifadan
// chiqqanda o'chiradi). CSS o'zgaruvchilari `[data-fon='...']` ga
// bog'langan, shuning uchun butun sahifa avtomatik bo'yaladi — server
// komponentga atribut qo'yish shart emas.

import Link from 'next/link'
import FonTanlagich, { useFon } from '@/components/FonTanlagich'

export default function IlmiyBoshPanel({ bandlar }) {
  const [fon, fonTanla] = useFon()

  return (
    <div className="v3-ilmiy-bosh">
      <nav className="v3-ilmiy-yol" aria-label="Sahifa yo'li">
        {bandlar.map((b, i) => (
          <span key={i} className="contents">
            {i > 0 && <span className="ajratgich">›</span>}
            {b.havola ? <Link href={b.havola}>{b.nom}</Link> : <span className="joriy">{b.nom}</span>}
          </span>
        ))}
      </nav>
      <FonTanlagich fon={fon} tanla={fonTanla} />
    </div>
  )
}
