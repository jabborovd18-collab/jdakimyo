"use client"

import Link from "next/link"
import { useState } from "react"

function MbSlayder() {
  const [tab, setTab] = useState("struktura")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "struktura", label: "🧬 Tuzilish" },
          { key: "solishtirma", label: "⚖️ Hb vs Mb" },
          { key: "spektr", label: "🌈 Spektr" },
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
        {tab === "struktura" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-red-400 font-bold">Mioglobin — monomer O₂ zaxirasi</h4>
            <p>
              Mioglobin (Mb) — <strong className="text-yellow-400">monomer oqsil</strong> 
              (153 aminokislota, ~17 kDa). Tarkibida <strong>bitta gem guruhi</strong> va 
              bitta Fe²⁺ ioni mavjud. Asosan <strong>muskul to'qimalarida</strong> 
              joylashgan bo'lib, O₂ zaxirasi vazifasini bajaradi.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-red-400 font-bold text-xs mb-1">Strukturaviy xususiyatlar</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>8 ta α-spiral</strong> (A dan H gacha nomlangan)</li>
                  <li>• Gem guruhi <strong>E va F spirallari</strong> orasida</li>
                  <li>• Proksimal His (F8) — 93-o'rin</li>
                  <li>• Distal His (E7) — 64-o'rin (O₂ ni stabillashtiradi)</li>
                  <li>• <strong>Gidrofob cho'ntak</strong> gemni himoya qiladi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-red-400 font-bold text-xs mb-1">Fiziologik roli</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Muskullarda <strong>O₂ zaxirasi</strong></li>
                  <li>• Kislorod yetishmovchiligida O₂ yetkazib beradi</li>
                  <li>• Dengiz sutemizuvchilarda <strong>juda ko'p</strong> (sho'ng'ish uchun)</li>
                  <li>• O₂ diffuziyasini <strong>osonlashtiradi</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "solishtirma" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-red-400 font-bold">Mioglobin vs Gemoglobin</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-purple-700/50">
                    <th className="text-left py-2 px-3 text-yellow-400">Xususiyat</th>
                    <th className="text-left py-2 px-3 text-red-400">Mioglobin (Mb)</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Gemoglobin (Hb)</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["Tuzilish", "Monomer (1 zanjir)", "Tetramer (α₂β₂)"],
                    ["Gem soni", "1", "4"],
                    ["Molekulyar massa", "~17 kDa", "~64.5 kDa"],
                    ["O₂ bog'lash egrisi", "Giperbolik", "Sigmasimon"],
                    ["Kooperativlik", "Yo'q (n_H = 1)", "Bor (n_H ≈ 2.8)"],
                    ["P₅₀ (O₂ ga yaqinlik)", "~1 mmHg (juda yuqori)", "~26 mmHg"],
                    ["Bor effekti", "Yo'q", "Bor"],
                    ["2,3-BPG ta'siri", "Yo'q", "Bor"],
                    ["Joylashuvi", "Muskullar", "Eritrotsitlar"],
                    ["Funksiyasi", "O₂ zaxirasi", "O₂ tashish"],
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

        {tab === "spektr" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-red-400 font-bold">Spektral xususiyatlari</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">UB-Vis spektri</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Sore tasmasi:</strong> ~418 nm (ε ≈ 10⁵) — porfirin π→π*</li>
                  <li>• <strong>α-tasma:</strong> ~580 nm — O₂-Mb (qizil)</li>
                  <li>• <strong>β-tasma:</strong> ~540 nm</li>
                  <li>• Deoksi-Mb: α-tasma yo'q, keng yutilish</li>
                  <li>• CO-Mb: α-tasma ~570 nm da</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">EPR signali</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Deoksi-Mb (HS Fe²⁺, S=2):</strong> kuchli EPR signali</li>
                  <li>• <strong>Oksi-Mb (LS Fe²⁺, S=0):</strong> EPR signali yo'q (diamagnit)</li>
                  <li>• <strong>Met-Mb (HS Fe³⁺, S=5/2):</strong> g ≈ 6 signali</li>
                  <li>• EPR — oksidlanish holatini aniqlashda muhim</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Mioglobin() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/gemoglobin" className="text-purple-400 hover:text-purple-300 text-lg">← Gemoglobin</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🩸 Mioglobin (Mb)</h1>
          <p className="text-purple-400 text-sm">Monomer O₂ zaxirasi • Fe-porfirin • Giperbolik bog'lanish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Mioglobin — birinchi rentgen tuzilishi aniqlangan oqsil</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-red-400">Mioglobin (Mb)</strong> — 
              mushak to'qimalarida uchraydigan <strong>monomer gemoprotein</strong>. 
              Uning asosiy vazifasi — <strong>kislorod zaxirasi</strong> yaratish va 
              kislorod yetishmovchiligi (gipoksiya) sharoitida uni mitoxondriyalarga 
              yetkazib berish. Mioglobin <strong>1958-yilda</strong> John Kendrew 
              tomonidan rentgen kristallografiyasi yordamida birinchi bo'lib 
              <strong> uch o'lchamli strukturasi</strong> aniqlangan oqsildir 
              (Nobel mukofoti, 1962, Perutz bilan birga gemoglobin uchun).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Tarixiy ahamiyati</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>1958:</strong> Kendrew — Mb 6 Å ruxsatda strukturasi</li>
                <li>• <strong>1960:</strong> Kendrew — Mb 2 Å ruxsatda (atom darajasida)</li>
                <li>• <strong>1962:</strong> Nobel mukofoti — Kendrew + Perutz</li>
                <li>• Mb — <strong>oqsil strukturasini tushunishda</strong> asos bo'lgan</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Nima uchun Mb o'rganish muhim?</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Oddiy model:</strong> monomer — kooperativlik yo'q</li>
                <li>• Hb bilan solishtirish orqali <strong>kooperativlik mexanizmi</strong> tushuniladi</li>
                <li>• <strong>Oqsil dinamikasi:</strong> ligand bog'lanish kinetikasi</li>
                <li>• <strong>Tibbiy ahamiyat:</strong> mioglobinuriya, rabdomioliz</li>
              </ul>
            </div>
          </div>
        </div>

        {/* O2 BOG'LANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ O₂ bog'lanish — giperbolik kinetika</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              Mioglobin O₂ ni <strong className="text-yellow-400">giperbolik egri chiziq</strong> 
              bo'yicha bog'laydi — bu <strong>kooperativlik yo'qligini</strong> ko'rsatadi.
              Reaksiya oddiy muvozanat bilan ifodalanadi:
              <span className="font-mono block mt-2 text-center">Mb + O₂ ⇌ MbO₂</span>
              <span className="block mt-1">Dissotsilanish konstantasi: <strong>K_d = [Mb][O₂] / [MbO₂]</strong></span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-900/50 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold text-sm mb-2">Bog'lanish tenglamasi</h3>
              <p className="text-purple-200 text-xs font-mono">
                Y = [O₂] / (K_d + [O₂])
              </p>
              <p className="text-purple-200 text-xs mt-2">
                Y — to'yinganlik darajasi. K_d — dissotsilanish konstantasi.
                <strong> P₅₀ = K_d</strong> (Y=0.5 bo'lganda).
                Mb uchun P₅₀ ≈ <strong>1 mmHg</strong> — juda kichik,
                ya'ni O₂ ga <strong>juda yuqori yaqinlik</strong>.
              </p>
            </div>
            <div className="bg-purple-900/50 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold text-sm mb-2">Hill grafigi</h3>
              <p className="text-purple-200 text-xs font-mono">
                log(Y/(1−Y)) = n_H·log(pO₂) − log(K)
              </p>
              <p className="text-purple-200 text-xs mt-2">
                Mb uchun <strong>n_H = 1</strong> — kooperativlik yo'q.
                Grafikda <strong>to'g'ri chiziq</strong>, og'ish burchagi 45°.
                Hb uchun n_H ≈ 2.8 — qiya chiziq.
              </p>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MbSlayder />
        </div>

        {/* DENGIZ SUTEMIZUVCHILAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🐋 Dengiz sutemizuvchilarda mioglobin</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-sm mb-3">
              Dengiz sutemizuvchilari (tyulen, kit, delfin) mushaklarida mioglobin miqdori 
              <strong className="text-yellow-400"> quruqlik hayvonlariga nisbatan 10-30 marta ko'p</strong>. 
              Bu ularga uzoq vaqt sho'ng'ish imkonini beradi.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                <p className="text-red-400 font-bold">~0.5 g/100g</p>
                <p className="text-purple-300">Odam muskuli</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                <p className="text-red-400 font-bold">~5 g/100g</p>
                <p className="text-purple-300">Tyulen muskuli</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                <p className="text-red-400 font-bold">~7 g/100g</p>
                <p className="text-purple-300">Kashalot muskuli</p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Mioglobin — <strong className="text-red-400">monomer gemoprotein</strong>, 1 ta Fe²⁺-gem markazi</li>
            <li>O₂ bog'lanish egrisi <strong className="text-red-400">giperbolik</strong> — kooperativlik yo'q (n_H = 1)</li>
            <li>O₂ ga yaqinligi juda yuqori — <strong className="text-red-400">P₅₀ ≈ 1 mmHg</strong> (Hb da ~26 mmHg)</li>
            <li><strong className="text-red-400">Birinchi 3D strukturasi</strong> aniqlangan oqsil (Kendrew, 1958)</li>
            <li>Dengiz sutemizuvchilarida <strong className="text-red-400">10-30× ko'p</strong> — sho'ng'ish adaptatsiyasi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/gemoglobin" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Gemoglobin</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/sitoxromlar" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Sitoxromlar →</Link>
        </div>

      </section>
    </main>
  )
}