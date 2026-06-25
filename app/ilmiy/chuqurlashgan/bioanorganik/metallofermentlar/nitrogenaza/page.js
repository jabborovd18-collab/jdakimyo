"use client"

import Link from "next/link"
import { useState } from "react"

function NitrogenazaSlayder() {
  const [tab, setTab] = useState("mexanizm")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "mexanizm", label: "⚡ Mexanizm" },
          { key: "struktura", label: "🧬 Struktura" },
          { key: "femoko", label: "💎 FeMo-kofaktor" },
          { key: "kb", label: "⚛️ KB aloqasi" },
          { key: "sanoat", label: "🏭 Haber-Bosch" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key 
                ? "bg-green-600/80 text-white" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        {tab === "mexanizm" && (
          <div className="space-y-4 text-sm text-purple-200">
            <h4 className="text-green-400 font-bold">N₂ fiksatsiyasi — 8 elektronli qaytarilish</h4>
            
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-2">Stoxiometrik reaksiya:</p>
              <p className="text-xs font-mono text-center mb-3">N₂ + 8H⁺ + 8e⁻ + 16MgATP → 2NH₃ + H₂ + 16MgADP + 16Pᵢ</p>
              <p className="text-xs">
                <strong>Muhim:</strong> Har bir N₂ molekulasi uchun <strong>kamida 1 ta H₂</strong> 
                ajralib chiqadi — bu "muqarrar" qo'shimcha mahsulot. 
                <strong>16 ta ATP</strong> sarflanadi — bu biologik reaksiyalar orasida 
                eng ko'p energiya talab qiladigan jarayonlardan biri!
              </p>
            </div>

            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold text-xs mb-2">Lowe-Thorniley sikli — 8 bosqich:</p>
              <div className="space-y-1 text-xs">
                <p><strong>E₀:</strong> Dam olish holati — FeMo-kofaktor N₂ ni kutadi</p>
                <p><strong>E₁ → E₂:</strong> 1-2 e⁻ qaytarilish — FeMo-kofaktor qaytariladi</p>
                <p><strong>E₃ → E₄:</strong> 3-4 e⁻ — N₂ bog'lanishga tayyor holat (yan E₄ — "Yulduzli" holat)</p>
                <p className="text-green-400"><strong>E₄ + N₂:</strong> N₂ bog'lanadi, H₂ ajraladi (qaytaruvchi eliminatsiya)</p>
                <p><strong>E₅ → E₆:</strong> 5-6 e⁻ — N₂ qaytariladi, N−N bog'i zaiflashadi</p>
                <p><strong>E₇:</strong> 7 e⁻ — N−N bog'i uziladi, NH₃ ajrala boshlaydi</p>
                <p><strong>E₈ → E₀:</strong> 8 e⁻ — 2NH₃ to'liq ajraladi, kofaktor qayta tiklanadi</p>
              </div>
            </div>
          </div>
        )}

        {tab === "struktura" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-green-400 font-bold">Nitrogenaza — ikki komponentli ferment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Fe-oqsil (dinitrogenaza reduktaza)</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>γ₂ dimer</strong> — ~64 kDa</li>
                  <li>• <strong>[4Fe-4S] klaster</strong> — elektron manbai</li>
                  <li>• <strong>MgATP bog'lash joyi</strong> — 2 ta</li>
                  <li>• Elektronlarni FeMo-oqsilga uzatadi</li>
                  <li>• Har bir elektron uzatish uchun <strong>2 ta ATP</strong> gidrolizlanadi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">FeMo-oqsil (dinitrogenaza)</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>α₂β₂ tetramer</strong> — ~240 kDa</li>
                  <li>• <strong>2 ta FeMo-kofaktor</strong> (α-subbirliklarda)</li>
                  <li>• <strong>2 ta P-klaster</strong> [8Fe-7S] (α-β interfeysida)</li>
                  <li>• P-klaster — elektronlarni FeMo-kofaktorga uzatadi</li>
                  <li>• Faol markaz — <strong>FeMo-kofaktor</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "femoko" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-green-400 font-bold">FeMo-kofaktor — tabiatning eng murakkab metall klasteri</h4>
            
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-2">Tarkibi: [MoFe₇S₉C] + gomotsitrat + His442</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-green-400 font-bold">Metall atomlari:</p>
                  <ul className="space-y-0.5">
                    <li>• <strong>1 ta Mo</strong> — gomotsitrat bilan bog'langan</li>
                    <li>• <strong>7 ta Fe</strong> — 6 ta Fe + 1 ta markaziy C ga bog'langan</li>
                    <li>• <strong>1 ta C (karbid!)</strong> — klaster markazida, 6 ta Fe bilan bog'langan!</li>
                    <li>• Jami: <strong>8 ta metall + 1 ta karbid uglerod</strong></li>
                  </ul>
                </div>
                <div>
                  <p className="text-green-400 font-bold">Sulfid ko'priklar:</p>
                  <ul className="space-y-0.5">
                    <li>• <strong>9 ta S²⁻</strong> — metallarni ko'prik qilib bog'laydi</li>
                    <li>• <strong>μ₂-S</strong> va <strong>μ₃-S</strong> ko'priklar</li>
                    <li>• S lar klaster strukturasini ushlab turadi</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-yellow-400 font-bold text-xs mb-1">Markaziy karbid (C⁴⁻) — 2011 yilgi kashfiyot!</p>
              <p className="text-xs">
                Klaster markazida <strong>interstitsial uglerod atomi</strong> (C⁴⁻) 
                joylashgan — bu 6 ta Fe atomi bilan trigonal prizmatik koordinatsiyalangan.
                <strong> Bu — biologik tizimdagi yagona karbid ligand!</strong>
                C⁴⁻ — eng kuchli elektron donor, Fe klasterini elektronlarga boyitadi.
                Rentgen kristallografiyasi (1.0 Å ruxsat) va ESEEM spektroskopiyasi bilan isbotlangan.
              </p>
            </div>
          </div>
        )}

        {tab === "kb" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-green-400 font-bold">Koordinatsion birikmalar nuqtai nazaridan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">FeMo-kofaktor — ko'p yadroli KB</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>8 yadroli metall klaster</strong> — 7Fe + 1Mo + 1C</li>
                  <li>• <strong>Ko'prik ligandlar:</strong> S²⁻ (μ₂ va μ₃), C⁴⁻ (μ₆!)</li>
                  <li>• <strong>Terminal ligandlar:</strong> S (sistein), N (His), O (gomotsitrat)</li>
                  <li>• <strong>Fe−Fe masofalari:</strong> ~2.5-2.7 Å — to'g'ridan-to'g'ri metall bog'lanish</li>
                  <li>• <strong>Fe−C (karbid) masofasi:</strong> ~2.0 Å</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Elektron tuzilish</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Fe atomlari <strong>turli oksidlanish darajalarida</strong> (Fe²⁺, Fe³⁺ aralash)</li>
                  <li>• <strong>Aralash valentli klaster</strong> — Robin-Day II/III sinf</li>
                  <li>• Elektronlar butun klaster bo'ylab <strong>delokalizatsiyalangan</strong></li>
                  <li>• Mo — Mo³⁺ yoki Mo⁴⁺ (d³ yoki d²)</li>
                  <li>• Umumiy spin: S = 3/2 (dam olish holatida)</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Bel uglerod (C⁴⁻) — noyob ligand</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>C⁴⁻</strong> — karbid anioni, 6 ta Fe bilan bog'langan</li>
                  <li>• <strong>μ₆-koordinatsiya</strong> — koordinatsion kimyoda juda kam uchraydi</li>
                  <li>• C⁴⁻ — <strong>kuchli σ- va π-donor</strong>, elektron zichlikni klasterga beradi</li>
                  <li>• Klasterning elektron holatini <strong>nozik sozlaydi</strong></li>
                  <li>• Sun'iy modellarda C⁴⁻ bo'lmagani uchun N₂ ni qaytara olmaydi!</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">N₂ bog'lanish joyi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Yan E₄ holat:</strong> FeMo-kofaktorning "bel" qismida 2 ta Fe atomi</li>
                  <li>• N₂ <strong>Fe₂ yuziga</strong> bog'lanadi (μ₂-η¹:η¹ yoki μ₂-η²:η²)</li>
                  <li>• <strong>Qaytaruvchi eliminatsiya:</strong> 2 ta gidrid (Fe−H) birlashib H₂ ajraladi, N₂ bog'lanadi</li>
                  <li>• N−N bog'i <strong>1.10 Å dan ~1.25-1.30 Å gacha</strong> cho'ziladi</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "sanoat" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-green-400 font-bold">Haber-Bosch jarayoni vs Nitrogenaza</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-purple-700/50">
                    <th className="text-left py-2 px-3 text-yellow-400">Parametr</th>
                    <th className="text-left py-2 px-3 text-green-400">Nitrogenaza (biologik)</th>
                    <th className="text-left py-2 px-3 text-red-400">Haber-Bosch (sanoat)</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["Katalizator", "FeMo-kofaktor (oqsil ichida)", "Fe (α-Fe + K₂O, Al₂O₃)"],
                    ["Harorat", "25-35°C (xona harorati!)", "400-500°C"],
                    ["Bosim", "1 atm (atmosfera bosimi!)", "150-300 atm"],
                    ["Energiya manbai", "ATP (16 ta / N₂)", "Issiqlik + bosim"],
                    ["H₂ ajralishi", "1 H₂ / N₂ (muqarrar)", "H₂ — xomashyo (N₂ + 3H₂)"],
                    ["Yillik ishlab chiqarish", "~2×10⁸ tonna (global N₂ fiksatsiyasi)", "~1.5×10⁸ tonna NH₃"],
                    ["Samaradorlik", "~75% (ATP energiyasi bo'yicha)", "~60% (umumiy energiya)"],
                    ["CO₂ emissiyasi", "0 (qayta tiklanuvchi)", "~1.5% global CO₂ emissiyasi"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-2 px-3"><strong>{row[0]}</strong></td>
                      <td className="py-2 px-3">{row[1]}</td>
                      <td className="py-2 px-3">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Nitrogenaza() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/katalaza" className="text-purple-400 hover:text-purple-300 text-lg">← Katalaza</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🌾 Nitrogenaza</h1>
          <p className="text-purple-400 text-sm">FeMo-kofaktor • N₂ → NH₃ • 8e⁻ + 8H⁺ • 16 ATP • Karbid uglerod</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Nitrogenaza — atmosfera azotini fiksatsiya qiluvchi ferment</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-green-400">Nitrogenaza</strong> — 
              atmosferadagi N₂ ni NH₃ ga aylantiruvchi <strong>yagona biologik ferment</strong>.
              Bu — <strong>biologik azot fiksatsiyasi</strong>. Reaksiya:
              <strong> N₂ + 8H⁺ + 8e⁻ + 16ATP → 2NH₃ + H₂ + 16ADP + 16Pᵢ</strong>.
              Nitrogenaza <strong>ikki komponentli metalloferment</strong>: 
              Fe-oqsil (elektron donor) va FeMo-oqsil (katalitik markaz).
              FeMo-oqsilning faol markazi — <strong>FeMo-kofaktor</strong> — 
              tabiatdagi <strong>eng murakkab metall klaster</strong> (7Fe + 1Mo + 1C + 9S).
              Bu — <strong className="text-yellow-400">ko'p yadroli koordinatsion birikma</strong> ning 
              eng mukammal biologik namunasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">N≡N</p>
              <p className="text-purple-300">Uchlamchi bog' — juda mustahkam</p>
              <p className="text-purple-400 mt-1">
                Bog' energiyasi: <strong>941 kJ/mol</strong>.
                Eng mustahkam kimyoviy bog'lardan biri.
                Uni uzish uchun 8 ta elektron kerak.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">[MoFe₇S₉C]</p>
              <p className="text-purple-300">FeMo-kofaktor tarkibi</p>
              <p className="text-purple-400 mt-1">
                8 ta metall + 9 ta S + 1 ta karbid C.
                Yagona biologik karbid ligand!
                Klaster massasi ~800 Da.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">16 ATP</p>
              <p className="text-purple-300">Har bir N₂ molekulasi uchun</p>
              <p className="text-purple-400 mt-1">
                Eng ko'p energiya sarflanadigan biologik reaksiyalardan biri.
                ~40% samaradorlik (energiya yo'qotilishi).
              </p>
            </div>
          </div>
        </div>

        {/* STRUKTURA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧬 Nitrogenaza strukturasi — ikki komponentli tizim</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              Nitrogenaza <strong className="text-yellow-400">ikki alohida oqsildan</strong> iborat:
              <strong> Fe-oqsil</strong> (dinitrogenaza reduktaza) va 
              <strong> FeMo-oqsil</strong> (dinitrogenaza). Fe-oqsil elektronlarni 
              ferredoksin/flavodoksin dan olib, FeMo-oqsilga uzatadi. Har bir elektron 
              uzatish uchun <strong>2 ta ATP</strong> gidrolizlanadi. FeMo-oqsil 
              elektronlarni qabul qilib, FeMo-kofaktorda N₂ ni qaytaradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-green-400 font-bold mb-2">Fe-oqsil (γ₂, ~64 kDa)</p>
              <ul className="space-y-0.5">
                <li>• <strong>[4Fe-4S] klaster</strong> — 2 ta subbirlik orasida ko'prik</li>
                <li>• <strong>MgATP bog'lash joyi</strong> — 2 ta (har bir subbirlikda)</li>
                <li>• ATP gidrolizi → <strong>konformatsion o'zgarish</strong></li>
                <li>• FeMo-oqsil bilan <strong>vaqtinchalik kompleks</strong> hosil qiladi</li>
                <li>• Elektron uzatish tezligi: ~5 s⁻¹ (sekin — tezlikni belgilovchi bosqich!)</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-green-400 font-bold mb-2">FeMo-oqsil (α₂β₂, ~240 kDa)</p>
              <ul className="space-y-0.5">
                <li>• <strong>2 ta FeMo-kofaktor</strong> — α-subbirliklarda</li>
                <li>• <strong>2 ta P-klaster [8Fe-7S]</strong> — elektron o'tkazish yo'lida</li>
                <li>• P-klaster — [4Fe-4S] + [4Fe-3S] birlashgan</li>
                <li>• Elektron yo'li: Fe-oqsil → P-klaster → FeMo-kofaktor</li>
                <li>• Masofa: ~40 Å (Fe-oqsil [4Fe-4S] dan FeMo-kofaktorgacha)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FeMo-KOFAKTOR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 FeMo-kofaktor — koordinatsion kimyoning mo''jizasi</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-green-400">FeMo-kofaktor</strong> — 
              bu <strong>[MoFe₇S₉C]</strong> tarkibli, 8 ta metall atomi, 9 ta sulfid 
              ko'prik va <strong>1 ta markaziy karbid uglerod (C⁴⁻)</strong> dan 
              iborat klaster. Mo atomi <strong>gomotsitrat</strong> (α-gidroksikarboksilat) 
              bilan xelatlangan va <strong>His442</strong> orqali oqsilga bog'langan.
              Klasterning aniq strukturasi <strong>1992-yilda</strong> (Kim & Rees, 1.7 Å) 
              va markaziy uglerod <strong>2011-yilda</strong> (Spatzal & Einsle, 1.0 Å) 
              aniqlangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-green-400 font-bold text-sm mb-2">Mo markazi</p>
              <ul className="space-y-0.5">
                <li>• 3 ta S bilan bog'langan (klaster ichida)</li>
                <li>• <strong>Gomotsitrat</strong> — O,O-xelat (2 ta O atomi)</li>
                <li>• <strong>His442−N</strong> — oqsilga bog'laydi</li>
                <li>• <strong>Oktaedrik geometriya</strong> (buzilgan)</li>
                <li>• Mo³⁺/Mo⁴⁺ — oksidlanish darajasi aniq emas</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-green-400 font-bold text-sm mb-2">Fe "bel" qismi</p>
              <ul className="space-y-0.5">
                <li>• 2 ta Fe atomi — <strong>N₂ bog'lanadigan joy</strong></li>
                <li>• Fe−Fe masofasi ~2.5 Å</li>
                <li>• <strong>Fe−H (gidrid)</strong> — E₄ holatda</li>
                <li>• Gidridlar birlashib H₂ ajraladi → N₂ bog'lanadi</li>
                <li>• <strong>Qaytaruvchi eliminatsiya</strong> mexanizmi</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-green-400 font-bold text-sm mb-2">Markaziy C⁴⁻</p>
              <ul className="space-y-0.5">
                <li>• <strong>μ₆-koordinatsiya</strong> — 6 ta Fe bilan</li>
                <li>• Trigonal prizmatik Fe₆C yadro</li>
                <li>• <strong>Fe−C ~2.0 Å</strong></li>
                <li>• Kuchli elektron donor — klaster elektron holatini belgilaydi</li>
                <li>• <strong>Yagona biologik karbid!</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <NitrogenazaSlayder />
        </div>

        {/* SUN'IY MODELLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Sun'iy modellar — biomimetik katalizatorlar</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-sm mb-3">
              Kimyogarlar FeMo-kofaktorning <strong className="text-yellow-400">sun'iy analoglari</strong> ni 
              sintez qilishga harakat qilmoqda. Maqsad — xona haroratida va atmosfera bosimida 
              N₂ ni NH₃ ga aylantiradigan <strong>sanoat katalizatori</strong> yaratish.
              Bu Haber-Bosch jarayoniga <strong>alternativ</strong> bo'lardi.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-green-400 font-bold mb-1">Hidaka kompleksi (2000-yillar)</p>
                <p className="text-purple-200">
                  Mo-Fe-S klasterlar — N₂ ni qaytarishda <strong>cheklangan faollik</strong>.
                  Asosiy muammo: markaziy karbidni sintez qilish qiyin.
                </p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-green-400 font-bold mb-1">Nishibayashi komplekslari (2010-yillar)</p>
                <p className="text-purple-200">
                  Mo-N₂ komplekslari — <strong>N₂ ni NH₃ ga qaytara oladi!</strong>
                  Lekin faollik past (~10-20 aylanish).
                </p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-green-400 font-bold mb-1">Peters (2013)</p>
                <p className="text-purple-200">
                  Fe-N₂ komplekslari — <strong>tris(fosfin)boran</strong> ligandli.
                  NH₃ hosil bo'ladi, lekin ~7 ekvivalent.
                </p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-green-400 font-bold mb-1">Hozirgi holat</p>
                <p className="text-purple-200">
                  Hech bir sun'iy katalizator <strong>xona haroratida samarali ishlamaydi</strong>.
                  Markaziy karbidning roli to'liq tushunilmagan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Nitrogenaza — <strong className="text-green-400">N₂ ni NH₃ ga aylantiruvchi yagona biologik ferment</strong></li>
            <li>FeMo-kofaktor — <strong className="text-green-400">[MoFe₇S₉C]</strong>, 8 metall + markaziy karbid, eng murakkab biologik klaster</li>
            <li>Markaziy <strong className="text-green-400">C⁴⁻ (karbid)</strong> — yagona biologik karbid ligand, μ₆-koordinatsiya</li>
            <li>Reaksiya <strong className="text-green-400">8e⁻ + 8H⁺ + 16ATP</strong> — eng energiya talabchan biologik jarayonlardan biri</li>
            <li><strong className="text-green-400">Haber-Bosch alternativi</strong> — sun'iy modellar hali samarali emas</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/katalaza" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Katalaza</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/gidrogenaza" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Gidrogenaza →</Link>
        </div>

      </section>
    </main>
  )
}