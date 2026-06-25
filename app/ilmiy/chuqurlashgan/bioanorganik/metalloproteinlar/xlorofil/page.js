"use client"

import Link from "next/link"
import { useState } from "react"

function XlorofilSlayder() {
  const [tab, setTab] = useState("tuzilish")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "tuzilish", label: "🧬 Tuzilish" },
          { key: "fotosintez", label: "☀️ Fotosintez" },
          { key: "turlari", label: "📋 Turlari" },
          { key: "kb", label: "⚛️ KB aloqasi" },
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
        {tab === "tuzilish" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-green-400 font-bold">Xlorofil — Mg-xlorin kompleksi</h4>
            <p>
              Xlorofil — <strong className="text-yellow-400">Mg²⁺ ioni xlorin halqasi</strong> 
              markazida joylashgan makrotsiklik kompleks. Xlorin — bu 
              <strong> porfirinning qisman qaytarilgan shakli</strong>: 
              bitta pirrol halqasidagi qo'sh bog' yo'q (17,18-uglerodlar).
              Mg²⁺ ioni <strong>4 ta N atomi</strong> bilan ekvatorial tekislikda 
              koordinatsiyalangan.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-green-400 font-bold text-xs mb-1">Xlorin vs Porfirin</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Porfirin:</strong> 4 ta pirrol, to'liq konjugatsiya, tekis</li>
                  <li>• <strong>Xlorin:</strong> 1 ta pirrol to'yingan (17,18-bog' yo'q)</li>
                  <li>• Natija: <strong>spektr siljishi</strong> — Q-tasma ~680 nm da</li>
                  <li>• Mg²⁺ — <strong>kuchsiz maydon</strong> (d¹⁰ — rang yo'q)</li>
                  <li>• <strong>Rang liganddan:</strong> π→π* o'tish (xlorofil yashil)</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-green-400 font-bold text-xs mb-1">Koordinatsion bog'lanish</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Ekvatorial:</strong> 4 ta N atomi (xlorin halqasi)</li>
                  <li>• <strong>Aksial (5-koord.):</strong> ko'pincha His yoki H₂O</li>
                  <li>• <strong>Geometriya:</strong> kvadrat piramida (5) yoki oktaedr (6)</li>
                  <li>• Mg²⁺ radiusi kichik (0.72 Å) — halqa markaziga mos</li>
                  <li>• <strong>Fitil zanjiri:</strong> uzun gidrofob "dumi" — membranada ushlaydi</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "fotosintez" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-green-400 font-bold">Fotosintez — yorug'likdan kimyoviy energiyaga</h4>
            <p>
              Xlorofil molekulalari <strong className="text-yellow-400">fotosistema I va II</strong> 
              da joylashgan. Ular yorug'lik energiyasini yutib, 
              <strong> zaryad ajralishi</strong> hosil qiladi.
            </p>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-green-400 font-bold text-xs mb-2">Fotosistema II — suv oksidlanishi:</p>
              <ol className="text-xs space-y-1 list-decimal list-inside">
                <li>P680 (xlorofil jufti) yorug'lik yutadi → <strong>P680*</strong> (qo'zg'algan holat)</li>
                <li>P680* elektron beradi → feofitinga o'tadi</li>
                <li>P680⁺ — kuchli oksidlovchi (E° ≈ +1.2 V)</li>
                <li><strong>Mn₄Ca klaster</strong> (OEC) — suvni oksidlaydi: 2H₂O → O₂ + 4H⁺ + 4e⁻</li>
                <li>Elektron plastoxinon orqali sitoxrom b₆f ga, so'ng PSI ga o'tadi</li>
              </ol>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3 mt-2">
              <p className="text-green-400 font-bold text-xs mb-2">Fotosistema I — NADP⁺ qaytarilishi:</p>
              <ol className="text-xs space-y-1 list-decimal list-inside">
                <li>P700 (xlorofil jufti) yorug'lik yutadi</li>
                <li>P700* elektron beradi → ferredoksinga</li>
                <li>Ferredoksin → <strong>NADP⁺ + H⁺ → NADPH</strong></li>
                <li>NADPH — Kalvin sikli uchun qaytaruvchi</li>
              </ol>
            </div>
          </div>
        )}

        {tab === "turlari" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-green-400 font-bold">Xlorofil turlari</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-purple-700/50">
                    <th className="text-left py-2 px-3 text-yellow-400">Turi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Rangi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">λ_max (Q-tasma)</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Uchrashi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Xususiyati</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["Xlorofil a", "Ko'k-yashil", "~680 nm", "Barcha o'simliklar, suvo'tlar", "Asosiy fotosintetik pigment, PSI + PSII"],
                    ["Xlorofil b", "Sariq-yashil", "~650 nm", "Yuqori o'simliklar", "Yordamchi pigment, yorug'lik yig'ish (LHC)"],
                    ["Xlorofil c", "Yashil", "~630 nm", "Diatom suvo'tlar", "Fotosintezda yordamchi"],
                    ["Xlorofil d", "Qizil", "~710 nm", "Qizil suvo'tlar (akarioxlorofit)", "NIR yutilish — ekstremofil"],
                    ["Bakterioxlorofil a", "Binafsha", "~800-850 nm", "Binafsha bakteriyalar", "Anoksigen fotosintez"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-2 px-3"><strong className="text-green-400">{row[0]}</strong></td>
                      <td className="py-2 px-3">{row[1]}</td>
                      <td className="py-2 px-3 text-green-300">{row[2]}</td>
                      <td className="py-2 px-3">{row[3]}</td>
                      <td className="py-2 px-3">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "kb" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-green-400 font-bold">Koordinatsion birikmalar bilan bog'liqligi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Geometriya</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Mg²⁺ — <strong>d¹⁰ konfiguratsiya</strong>, CFSE=0</li>
                  <li>• Geometriya — <strong>kvadrat piramida (5)</strong> yoki oktaedr (6)</li>
                  <li>• CFSE=0 bo'lgani uchun <strong>geometriya erkin tanlanadi</strong></li>
                  <li>• Makrotsikl effekti — <strong>xelat barqarorligi</strong></li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Elektron xususiyatlar</p>
                <ul className="text-xs space-y-0.5">
                  <li>• d¹⁰ — <strong>rang yo'q (d-d o'tish yo'q)</strong></li>
                  <li>• <strong>Rang liganddan:</strong> π→π* (Sore ~430 nm, Q ~680 nm)</li>
                  <li>• <strong>MLCT yo'q</strong> — Mg²⁺ oksidlanmaydi</li>
                  <li>• <strong>Fluoressensiya:</strong> Q-tasmadan emissiya (qizil)</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Ligand maydon nazariyasi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Xlorin — <strong>makrotsiklik N₄ ligand</strong></li>
                  <li>• Porfirin analogi, lekin <strong>simmetriya pastroq</strong></li>
                  <li>• Δ₀ porfirindan <strong>kichikroq</strong> (to'yingan bog' tufayli)</li>
                  <li>• Mg²⁺ — <strong>qattiq kislota</strong> (HSAB), N-donorlarga yaqin</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Spektroskopik xususiyatlar</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Sore tasmasi:</strong> ~430 nm (B-tasma, π→π*)</li>
                  <li>• <strong>Q-tasma:</strong> ~680 nm (xlorofil a), ~650 nm (xlorofil b)</li>
                  <li>• Q-tasma intensivligi porfiringa nisbatan <strong>yuqori</strong></li>
                  <li>• <strong>Qo'zg'algan holat:</strong> ¹Chl* — singlet, ~1.8 eV energiya</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Xlorofil() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/sitoxromlar" className="text-purple-400 hover:text-purple-300 text-lg">← Sitoxromlar</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🌿 Xlorofil</h1>
          <p className="text-purple-400 text-sm">Mg-xlorin kompleksi • Fotosintez • Yorug'lik yig'ish • Fluoressensiya</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Xlorofil — fotosintezning markaziy molekulasi</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-green-400">Xlorofil</strong> — 
              <strong> Mg²⁺-xlorin kompleksi</strong> bo'lib, fotosintez jarayonida 
              yorug'lik energiyasini yutib, uni <strong>kimyoviy energiyaga</strong> 
              aylantiradi. Bu Yerdagi eng muhim biokimyoviy molekulalardan biri — 
              atmosferadagi kislorodning deyarli barchasi xlorofil orqali suvning 
              fotooksidlanishidan hosil bo'ladi. Xlorofil — 
              <strong className="text-yellow-400">koordinatsion birikma</strong> 
              sifatida makrotsiklik ligand (xlorin) va markaziy metall ioni (Mg²⁺) 
              dan iborat klassik misoldir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Asosiy xususiyatlari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Metall:</strong> Mg²⁺ — d¹⁰, diamagnit, rangsiz erkin ion</li>
                <li>• <strong>Ligand:</strong> Xlorin (N₄ makrotsikl) — porfirin analogi</li>
                <li>• <strong>Koordinatsion son:</strong> 4 (kvadrat), 5 (kvadrat piramida)</li>
                <li>• <strong>Rang:</strong> Yashil — π→π* o'tish (Q-tasma ~680 nm)</li>
                <li>• <strong>CFSE:</strong> 0 (d¹⁰ — barqarorlik energiyasi yo'q)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Fotosintetik roli</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Yorug'lik yutilishi:</strong> 400-500 nm (ko'k) va 650-700 nm (qizil)</li>
                <li>• <strong>Energiya uzatish:</strong> LHC → reaksiya markazi (P680/P700)</li>
                <li>• <strong>Zaryad ajralishi:</strong> Chl* → Chl⁺ + e⁻</li>
                <li>• <strong>Suv oksidlanishi:</strong> Mn₄Ca klaster (OEC) orqali</li>
                <li>• Umumiy reaksiya: <strong>6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* KB BILAN ALOQA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Koordinatsion birikmalar nuqtai nazaridan</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              Xlorofil — <strong className="text-yellow-400">makrotsiklik ligandli koordinatsion birikma</strong>.
              Mg²⁺ ioni xlorin halqasining 4 ta N atomi bilan bog'lanib, 
              <strong> kvadraplanar</strong> geometriya hosil qiladi. Beshinchi koordinatsion o'ringa 
              ko'pincha <strong>gistidin (His)</strong> qoldig'i yoki H₂O molekulasi bog'lanadi.
              Mg²⁺ — d¹⁰ konfiguratsiyali ion, shuning uchun <strong>CFSE = 0</strong>. 
              Bu degani, geometriya ligandning sterik talablari bilan belgilanadi.
              Makrotsikl effekti tufayli kompleks <strong>juda barqaror</strong> — 
              hatto kislotali muhitda ham Mg²⁺ ajralib chiqmaydi (fenofitin hosil bo'lishidan tashqari).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-3 text-center">
              <p className="text-green-400 font-bold text-lg">d¹⁰</p>
              <p className="text-purple-300">Mg²⁺ elektron konfiguratsiyasi</p>
              <p className="text-purple-400 mt-1">CFSE = 0 — geometriya ligand bilan belgilanadi</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3 text-center">
              <p className="text-green-400 font-bold text-lg">N₄</p>
              <p className="text-purple-300">Makrotsiklik ligand</p>
              <p className="text-purple-400 mt-1">Xelat effekti — yuqori barqarorlik</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3 text-center">
              <p className="text-green-400 font-bold text-lg">π→π*</p>
              <p className="text-purple-300">Elektron o'tish</p>
              <p className="text-purple-400 mt-1">d-d o'tish yo'q — rang liganddan</p>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <XlorofilSlayder />
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌈 UB-Vis spektri va fl uoressensiya</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold text-sm mb-2">Yutilish spektri</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Sore (B) tasmasi:</strong> ~430 nm — kuchli (ε ≈ 10⁵)</li>
                <li>• <strong>Q_x tasmasi:</strong> ~580 nm — kuchsiz</li>
                <li>• <strong>Q_y tasmasi:</strong> ~680 nm (Chl a) — o'rtacha kuchli</li>
                <li>• <strong>Yashil rang:</strong> ~500-550 nm — yutilmaydi, qaytadi</li>
                <li>• <strong>Nima uchun yashil?</strong> Ko'k+qizil yutiladi, yashil qaytadi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold text-sm mb-2">Fluoressensiya</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Emissiya:</strong> Q_y dan — ~680-700 nm (qizil)</li>
                <li>• <strong>Stoks siljishi:</strong> ~10-20 nm — juda kichik</li>
                <li>• <strong>Kvant chiqishi:</strong> ~0.3 (Chl a eritmada)</li>
                <li>• <strong>In vivo:</strong> energiya uzatiladi — fluoressensiya past</li>
                <li>• <strong>Qo'zg'algan holat umri:</strong> ~5-8 ns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* OEC - Mn4Ca */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💧 Suv oksidlovchi kompleks (OEC) — Mn₄Ca klaster</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-green-400">OEC (Oxygen-Evolving Complex)</strong> — 
              fotosistema II ning suv oksidlovchi markazi. Tarkibida 
              <strong> 4 ta Mn ioni + 1 ta Ca²⁺</strong> bo'lgan noyob 
              <strong className="text-yellow-400"> ko'p yadroli metall klaster</strong>.
              Bu — tabiatdagi eng muhim oksidlanish katalizatori:
              <strong> 2H₂O → O₂ + 4H⁺ + 4e⁻</strong>.
              Kok-sikl (S₀→S₁→S₂→S₃→S₄→S₀) orqali ishlaydi.
            </p>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold text-sm mb-2">OEC — koordinatsion birikma sifatida</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-green-400 font-bold">Mn ionlari</p>
                <p className="text-purple-200">
                  4 ta Mn — turli oksidlanish darajalarida (Mn³⁺/Mn⁴⁺). 
                  O'zaro <strong>μ-okso ko'priklar</strong> orqali bog'langan.
                  Bu klassik <strong>ko'p yadroli KB</strong> namunasidir.
                </p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-green-400 font-bold">Ca²⁺ roli</p>
                <p className="text-purple-200">
                  Ca²⁺ — <strong>strukturaviy va elektrostatik</strong> rol o'ynaydi.
                  Suv molekulalarini faollashtiradi, Mn klasterini stabillashtiradi.
                  Ca ni Sr ga almashtirish — faollik pasayadi.
                </p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-green-400 font-bold">Ligandlar</p>
                <p className="text-purple-200">
                  O²⁻ (μ-okso), OH⁻, H₂O, karboksilat (Asp, Glu), 
                  imidazol (His). <strong>O-donor ligandlar</strong> — 
                  Mn qattiq metall, HSAB bo'yicha O ni afzal ko'radi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Xlorofil — <strong className="text-green-400">Mg²⁺-xlorin</strong> makrotsiklik koordinatsion birikma</li>
            <li>d¹⁰ konfiguratsiya — <strong className="text-green-400">CFSE = 0</strong>, rang liganddan (π→π*)</li>
            <li>Fotosintezda <strong className="text-green-400">yorug'lik energiyasini yutib</strong> zaryad ajratadi</li>
            <li>OEC (Mn₄Ca) — <strong className="text-green-400">ko'p yadroli KB</strong>, suvni oksidlaydi</li>
            <li>Xlorofil — <strong className="text-green-400">KB nazariyasining biologik tatbiqi</strong> uchun mukammal namuna</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/sitoxromlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Sitoxromlar</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Metallofermentlar →</Link>
        </div>

      </section>
    </main>
  )
}