"use client"

import Link from "next/link"
import { useState } from "react"

function KatalazaSlayder() {
  const [tab, setTab] = useState("mexanizm")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "mexanizm", label: "⚡ Mexanizm" },
          { key: "struktura", label: "🧬 Struktura" },
          { key: "kb", label: "⚛️ KB aloqasi" },
          { key: "solishtirma", label: "⚖️ Solishtirish" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key 
                ? "bg-red-600/80 text-white" 
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
            <h4 className="text-red-400 font-bold">Katalitik mexanizm — ikki bosqichli sik l</h4>
            
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-2">Umumiy reaksiya:</p>
              <p className="text-xs font-mono text-center mb-3">2H₂O₂ → 2H₂O + O₂</p>
              <p className="text-xs">
                Katalaza — <strong>eng tezkor ferment</strong> (k_cat ~10⁷ s⁻¹!).
                Bir molekula katalaza <strong>har sekundda 40 million</strong> H₂O₂ molekulasini
                parchalaydi. Har bir katalitik sikl ~25 ns davom etadi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-red-400 font-bold text-xs mb-2">1-bosqich: Oksidlanish</p>
                <p className="text-xs font-mono mb-1">Por−Fe³⁺ + H₂O₂ → Por•⁺−Fe⁴⁺=O + H₂O</p>
                <p className="text-xs text-purple-300 mb-2">(Por•⁺−Fe⁴⁺=O — I birikma, oksoferril porfirin π-kation radikali)</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Fe³⁺ (d⁵) → <strong>Fe⁴⁺ (d⁴)</strong> — ikki elektronli oksidlanish</li>
                  <li>• Porfirin halqasi → <strong>Por•⁺ (π-kation radikali)</strong> — bir elektron yo'qotadi</li>
                  <li>• H₂O₂ da O−O bog'i <strong>geterolitik ajraladi</strong></li>
                  <li>• O−O bog'i uzilishi: <strong>2e⁻ o'tishi</strong> bilan</li>
                  <li>• H₂O ajralib chiqadi, Fe=O hosil bo'ladi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-red-400 font-bold text-xs mb-2">2-bosqich: Qaytarilish</p>
                <p className="text-xs font-mono mb-1">Por•⁺−Fe⁴⁺=O + H₂O₂ → Por−Fe³⁺ + H₂O + O₂</p>
                <p className="text-xs text-purple-300 mb-2">(I birikma + H₂O₂ → dastlabki holat + mahsulotlar)</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Fe⁴⁺ (d⁴) → <strong>Fe³⁺ (d⁵)</strong> — bir elektronli qaytarilish</li>
                  <li>• Por•⁺ → <strong>Por</strong> — qaytarilish, radikal yo'qoladi</li>
                  <li>• Ikkinchi H₂O₂ <strong>qaytaruvchi</strong> sifatida ishlaydi</li>
                  <li>• O₂ va H₂O ajralib chiqadi</li>
                  <li>• Katalaza <strong>dastlabki holatga qaytadi</strong></li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold text-xs mb-2">Nima uchun katalaza shunchalik tezkor?</p>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div>
                  <p className="text-red-400 font-bold">1. Yuqori valentli Fe</p>
                  <p className="text-purple-300">Fe⁴⁺=O — juda reaksion, kuchli oksidlovchi</p>
                </div>
                <div>
                  <p className="text-red-400 font-bold">2. Radikal stabillanishi</p>
                  <p className="text-purple-300">Por•⁺ — porfirin halqasi bo'ylab delokalizatsiya</p>
                </div>
                <div>
                  <p className="text-red-400 font-bold">3. Optimal geometriya</p>
                  <p className="text-purple-300">Fe=O H₂O₂ bilan to'g'ri burchak ostida ta'sirlashadi</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "struktura" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-red-400 font-bold">Katalaza — tetramerik gemoprotein</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Umumiy tuzilish</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>4 ta subbirlik</strong> — gomotetramer</li>
                  <li>• Har bir subbirlik: ~60 kDa, ~500 aminokislota</li>
                  <li>• Jami molekulyar massa: <strong>~240 kDa</strong></li>
                  <li>• Har bir subbirlikda <strong>1 ta gem (Fe³⁺-protoporfirin IX)</strong></li>
                  <li>• Jami 4 ta Fe³⁺ faol markazi</li>
                  <li>• Har bir subbirlikda <strong>NADPH bog'lanish joyi</strong></li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Fe³⁺ faol markazi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Ligandlar:</strong> Porfirin N₄ (ekvatorial), Tyr357 (O⁻, proksimal)</li>
                  <li>• <strong>5-koordinatsion:</strong> Fe³⁺ — kvadrat piramida</li>
                  <li>• <strong>Tyr357−O⁻:</strong> fenolat anioni — <strong>kuchli donor</strong></li>
                  <li>• <strong>Distal tomon:</strong> His74, Asn147 — H₂O₂ ni yo'naltiradi</li>
                  <li>• Tyr357 — Fe⁴⁺=O hosil bo'lishida <strong>elektron push effekti</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "kb" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-red-400 font-bold">Koordinatsion birikmalar nuqtai nazaridan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Fe³⁺ — yuqori spinli d⁵</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>d⁵ konfiguratsiya:</strong> barcha d-orbitallarda 1 tadan elektron</li>
                  <li>• <strong>S = 5/2</strong> — yuqori spinli, paramagnit</li>
                  <li>• <strong>CFSE = 0</strong> — oktaedrik maydonda ham barqarorlik energiyasi yo'q</li>
                  <li>• Geometriya: <strong>kvadrat piramida</strong> (5-koordinatsion)</li>
                  <li>• Tyr357−O⁻ — kuchli σ- va π-donor ligand</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Fe⁴⁺=O — yuqori valentli oraliq birikma</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>d⁴ konfiguratsiya</strong> — kam uchraydigan oksidlanish darajasi</li>
                  <li>• <strong>Fe=O bog'i:</strong> ~1.65-1.70 Å — qisqa, kuchli qo'sh bog'</li>
                  <li>• Porfirin π-kation radikali bilan birgalikda — <strong>I birikma</strong></li>
                  <li>• Peroksidazalardagi I birikmaga o'xshash, lekin <strong>reaktivroq</strong></li>
                  <li>• Sun'iy modellar: [Fe⁴⁺(O)(TMP)] — TMP = tetrametilporfirin</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Tyr357 — proksimal ligand</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Fenolat (Tyr−O⁻)</strong> — gemoglobin va mioglobindagi His dan farq qiladi</li>
                  <li>• <strong>Kuchli elektron donor:</strong> Fe⁴⁺=O hosil bo'lishini osonlashtiradi</li>
                  <li>• <strong>Elektron push effekti:</strong> O−O bog'i geterolitik ajralishiga yordam beradi</li>
                  <li>• <strong>HSAB:</strong> O⁻ — qattiq asos, Fe³⁺/Fe⁴⁺ — qattiq kislotalar</li>
                  <li>• <strong>Nima uchun Tyr?</strong> His dan kuchliroq donor — yuqori valentli Fe ni barqarorlaydi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">NADPH — himoya mexanizmi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Har bir subbirlikda <strong>NADPH bog'langan</strong></li>
                  <li>• NADPH — I birikmani <strong>ortiqcha reaksiyalardan himoya qiladi</strong></li>
                  <li>• Agar H₂O₂ konsentratsiyasi past bo'lsa, I birikma NADPH ni oksidlab, <strong>noaktiv holatga</strong> o'tadi</li>
                  <li>• Bu — <strong>substrat yetishmovchiligidan himoya</strong> mexanizmi</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "solishtirma" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-red-400 font-bold">Katalaza vs Peroksidazalar</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-purple-700/50">
                    <th className="text-left py-2 px-3 text-yellow-400">Xususiyat</th>
                    <th className="text-left py-2 px-3 text-red-400">Katalaza</th>
                    <th className="text-left py-2 px-3 text-green-400">Peroksidazalar (HRP, MPO)</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["Reaksiya", "2H₂O₂ → 2H₂O + O₂", "H₂O₂ + AH₂ → 2H₂O + A"],
                    ["Substrat", "Faqat H₂O₂ (kichik)", "H₂O₂ + organik substrat"],
                    ["Proksimal ligand", "Tyr−O⁻ (fenolat)", "His (imidazol)"],
                    ["I birikma", "Por•⁺−Fe⁴⁺=O (tez)", "Por•⁺−Fe⁴⁺=O"],
                    ["II birikma", "Yo'q", "Por−Fe⁴⁺=O (uzoq umrli)"],
                    ["k_cat", "~10⁷ s⁻¹ (juda tez)", "~10²-10⁴ s⁻¹"],
                    ["Gem turi", "Protoporfirin IX (gem B)", "Protoporfirin IX (gem B)"],
                    ["Oksidlanish holati", "Fe³⁺ → Fe⁴⁺ → Fe³⁺", "Fe³⁺ → Fe⁴⁺ → Fe⁴⁺ → Fe³⁺"],
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

export default function Katalaza() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/superoksid-dismutaza" className="text-purple-400 hover:text-purple-300 text-lg">← SOD</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">💥 Katalaza</h1>
          <p className="text-purple-400 text-sm">Fe³⁺-gem • H₂O₂ → H₂O + O₂ • Eng tezkor ferment • Tyr−O⁻ ligand</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Katalaza — eng tezkor ferment</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-red-400">Katalaza</strong> — 
              <strong> Fe³⁺-gem</strong> saqlovchi antioksidant ferment.
              Reaksiyasi: <strong>2H₂O₂ → 2H₂O + O₂</strong>.
              Bu — <strong>eng tezkor ma'lum ferment</strong>: k_cat ≈ 10⁷ s⁻¹,
              har bir katalitik sikl atigi <strong>~25 nanosekund</strong> davom etadi.
              Katalaza organizmda SOD bilan birgalikda ishlaydi: 
              SOD O₂⁻ ni H₂O₂ ga aylantiradi, katalaza H₂O₂ ni zararsizlantiradi.
              Fe³⁺ dan farqli o'laroq gemoglobin va mioglobinda Fe²⁺, katalazada 
              <strong> Tyr−O⁻ (fenolat)</strong> proksimal ligand sifatida xizmat qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">~10⁷ s⁻¹</p>
              <p className="text-purple-300">k_cat — eng tezkor ferment</p>
              <p className="text-purple-400 mt-1">
                Har sekundda ~40 million H₂O₂ molekulasi parchalanadi.
                Har bir katalitik sikl ~25 ns.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">Fe³⁺ → Fe⁴⁺</p>
              <p className="text-purple-300">Noyob oksidlanish darajasi</p>
              <p className="text-purple-400 mt-1">
                Fe⁴⁺=O — yuqori valentli oraliq birikma.
                Porfirin π-kation radikali bilan stabillashgan.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">Tyr−O⁻</p>
              <p className="text-purple-300">Fenolat proksimal ligand</p>
              <p className="text-purple-400 mt-1">
                His o'rniga Tyr — kuchli elektron donor.
                O−O bog'i geterolitik ajralishini osonlashtiradi.
              </p>
            </div>
          </div>
        </div>

        {/* MEXANIZM */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Katalitik mexanizm — I birikma orqali</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              Katalaza mexanizmi <strong className="text-yellow-400">I birikma</strong> 
              (oksifer ril porfirin π-kation radikali, Por•⁺−Fe⁴⁺=O) orqali boradi.
              Bu — <strong>ikki bosqichli redoks reaksiyasi</strong>. 
              Birinchi H₂O₂ Fe³⁺ ni Fe⁴⁺ ga oksidlab, o'zi H₂O ga qaytariladi.
              Ikkinchi H₂O₂ Fe⁴⁺ ni Fe³⁺ ga qaytarib, o'zi O₂ ga oksidlanadi.
              <strong> Muhim farq:</strong> katalazada II birikma hosil bo'lmaydi 
              (peroksidazalardan farqli) — ikkinchi H₂O₂ to'g'ridan-to'g'ri 
              I birikma bilan reaksiyaga kirishadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-900/50 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold text-sm mb-3">1-bosqich: I birikma hosil bo'lishi</h3>
              <div className="bg-purple-800/30 rounded-lg p-4 mb-2">
                <p className="text-xs font-mono text-center">Por−Fe³⁺ + H₂O₂ → Por•⁺−Fe⁴⁺=O + H₂O</p>
              </div>
              <ul className="text-xs text-purple-200 space-y-1">
                <li>• H₂O₂ O−O bog'i <strong>geterolitik ajraladi</strong></li>
                <li>• <strong>2e⁻ o'tishi:</strong> 1e⁻ Fe³⁺ dan, 1e⁻ porfirindan</li>
                <li>• Fe³⁺ (d⁵) → <strong>Fe⁴⁺ (d⁴)</strong> — oksoferril</li>
                <li>• Por → <strong>Por•⁺</strong> — π-kation radikali</li>
                <li>• O−O bog'i uzunligi ~1.48 Å dan <strong>Fe=O ~1.65 Å</strong> ga o'zgaradi</li>
                <li>• Tyr357 fenolat — <strong>push effekti</strong> bilan O−O ajralishini tezlashtiradi</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold text-sm mb-3">2-bosqich: Qaytarilish va O₂ ajralishi</h3>
              <div className="bg-purple-800/30 rounded-lg p-4 mb-2">
                <p className="text-xs font-mono text-center">Por•⁺−Fe⁴⁺=O + H₂O₂ → Por−Fe³⁺ + H₂O + O₂</p>
              </div>
              <ul className="text-xs text-purple-200 space-y-1">
                <li>• Ikkinchi H₂O₂ <strong>qaytaruvchi</strong> sifatida ishlaydi</li>
                <li>• Fe⁴⁺ (d⁴) → <strong>Fe³⁺ (d⁵)</strong> — 1e⁻ qaytarilish</li>
                <li>• Por•⁺ → <strong>Por</strong> — 1e⁻ qaytarilish, radikal yo'qoladi</li>
                <li>• H₂O₂ → O₂ + 2H⁺ + 2e⁻ (oksidlanish)</li>
                <li>• <strong>O₂ ajraladi</strong> — ko'piksimon pufakchalar!</li>
                <li>• Katalaza dastlabki holatga qaytadi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* TYR357 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔑 Tyr357 — proksimal ligandning o'ziga xos roli</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              Katalazaning <strong className="text-yellow-400">eng muhim farqi</strong> —
              proksimal ligand <strong>Tyr357 fenolat anioni (Tyr−O⁻)</strong>.
              Gemoglobin va mioglobinda proksimal ligand — His (imidazol),
              peroksidazalarda ham His. Lekin katalazada <strong>Tyr</strong>.
              <strong> Nima uchun?</strong> Tyr−O⁻ — His ga qaraganda 
              <strong> kuchliroq elektron donor</strong>. Bu Fe⁴⁺=O hosil bo'lishini 
              osonlashtiradi va O−O bog'ining geterolitik ajralishini tezlashtiradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-red-400 font-bold text-sm mb-2">Elektron push effekti</p>
              <p className="text-purple-200">
                Tyr−O⁻ — <strong>kuchli σ-donor va π-donor</strong>.
                Fe−O(Tyr) bog'i orqali elektron zichligini Fe ga uzatadi.
                Bu O−O bog'ining geterolitik ajralishini <strong>108 marta</strong> tezlashtiradi
                (His ga nisbatan)!
              </p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-red-400 font-bold text-sm mb-2">HSAB tahlili</p>
              <p className="text-purple-200">
                Fe³⁺ — <strong>qattiq kislota</strong> (zaryad yuqori, radius kichik).
                O⁻ (fenolat) — <strong>qattiq asos</strong>. His (N-donor) — 
                <strong>chegaraviy asos</strong>. HSAB bo'yicha Fe³⁺−O⁻ juftligi 
                Fe³⁺−N(His) juftligidan <strong>barqarorroq</strong>.
              </p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-red-400 font-bold text-sm mb-2">pK_a farqi</p>
              <p className="text-purple-200">
                Tyr−OH pK_a ≈ 10 (fenol). His−H⁺ pK_a ≈ 6 (imidazol).
                Fiziologik pH da Tyr <strong>protonlangan</strong> holda bo'lishi kerak,
                lekin oqsil muhiti pK_a ni <strong>pasaytiradi</strong> — 
                Tyr fenolat anion holatida.
              </p>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <KatalazaSlayder />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Katalaza — <strong className="text-red-400">eng tezkor ferment</strong> (k_cat ~10⁷ s⁻¹), 2H₂O₂ → 2H₂O + O₂</li>
            <li><strong className="text-red-400">I birikma</strong> (Por•⁺−Fe⁴⁺=O) — yuqori valentli Fe⁴⁺ va porfirin radikali</li>
            <li><strong className="text-red-400">Tyr−O⁻ proksimal ligand</strong> — elektron push effekti orqali O−O ajralishini tezlashtiradi</li>
            <li><strong className="text-red-400">II birikma hosil bo'lmaydi</strong> — peroksidazalardan asosiy farq</li>
            <li>SOD + Katalaza — <strong className="text-red-400">antioksidant himoya tizimi</strong>: O₂⁻ → H₂O₂ → H₂O</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/superoksid-dismutaza" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← SOD</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/nitrogenaza" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Nitrogenaza →</Link>
        </div>

      </section>
    </main>
  )
}