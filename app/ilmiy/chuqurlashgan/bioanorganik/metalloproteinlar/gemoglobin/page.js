"use client"

import Link from "next/link"
import { useState } from "react"

// Gemoglobin strukturasi interaktiv ko'rinishi
function GemTuzilishSlayder() {
  const [tab, setTab] = useState("struktura")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "struktura", label: "🧬 Tuzilish" },
          { key: "mexanizm", label: "⚡ Mexanizm" },
          { key: "kooperativ", label: "🔄 Kooperativlik" },
          { key: "effekt", label: "🌡️ Bor effekti" },
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
            <h4 className="text-red-400 font-bold">Gemoglobin — tetramer tuzilish</h4>
            <p>
              Gemoglobin (Hb) — <strong className="text-yellow-400">α₂β₂ geterotetramer</strong>: 
              ikkita α-zanjir (141 aminokislota) va ikkita β-zanjir (146 aminokislota). 
              Har bir subbirlikda bittadan <strong className="text-yellow-400">gem guruhi</strong> mavjud — 
              jami 4 ta Fe²⁺ ioni.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-red-400 font-bold text-xs mb-1">Gem guruhi tuzilishi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Fe²⁺ <strong>porfirin halqasi</strong> markazida</li>
                  <li>• 4 ta N atomi (ekvatorial) — tekis kvadrat</li>
                  <li>• 5-koordinatsion o'rin — <strong>proksimal His (F8)</strong></li>
                  <li>• 6-koordinatsion o'rin — <strong>O₂ bog'lanadigan joy</strong></li>
                  <li>• Gem guruhi <strong>gidrofob cho'ntakda</strong> joylashgan</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-red-400 font-bold text-xs mb-1">O₂ bog'lanishdan oldin</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Deoksi-Hb: Fe²⁺ <strong>yuqori spinli (S=2)</strong></li>
                  <li>• Fe atomi porfirin tekisligidan <strong>~0.4 Å tashqarida</strong></li>
                  <li>• Gumbazsimon (domed) konformatsiya</li>
                  <li>• Rang: <strong>to'q qizil-binafsha</strong> (venoz qon)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "mexanizm" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-red-400 font-bold">O₂ bog'lanish mexanizmi</h4>
            <ol className="space-y-2 list-decimal list-inside">
              <li>O₂ molekulasi gem cho'ntagiga kiradi</li>
              <li>Fe²⁺ ga <strong>6-koordinatsion o'rin</strong> orqali bog'lanadi</li>
              <li>Fe²⁺ <strong>past spinli (S=0)</strong> holatga o'tadi</li>
              <li>Fe atomi porfirin tekisligiga <strong>tortiladi</strong></li>
              <li>Proksimal His (F8) siljiydi → <strong>subbirliklar konformatsiyasi o'zgaradi</strong></li>
              <li><strong>T-holat → R-holat</strong> o'tish (barcha 4 subbirlikda)</li>
            </ol>
            <div className="bg-purple-900/50 rounded-lg p-3 mt-2">
              <p className="text-yellow-400 font-bold text-xs mb-1">Muhim:</p>
              <p className="text-xs">
                Fe²⁺ oksidlanib Fe³⁺ ga o'tmaydi! Agar Fe²⁺ → Fe³⁺ o'tsa, 
                <strong className="text-red-400"> metgemoglobin</strong> hosil bo'ladi — 
                bu O₂ tashiy olmaydi. Metgemoglobinreduktaza fermenti Fe³⁺ ni qaytaradi.
              </p>
            </div>
          </div>
        )}

        {tab === "kooperativ" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-red-400 font-bold">Kooperativlik — sigmasimon egri chiziq</h4>
            <p>
              Gemoglobin O₂ ga <strong className="text-yellow-400">musbat kooperativlik</strong> 
              ko'rsatadi: birinchi O₂ bog'lanishi qiyin, ammo keyingilari osonlashadi.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-red-400 font-bold text-xs mb-1">Hill tenglamasi</p>
                <p className="text-xs font-mono">log(Y/(1−Y)) = n_H·log(pO₂) − log(K)</p>
                <p className="text-xs mt-1">
                  <strong>n_H (Hill koeffitsienti) ≈ 2.8</strong> — musbat kooperativlik.
                  Agar n_H = 1 bo'lsa — kooperativlik yo'q (mioglobin).
                  n_H {'>'} 1 — musbat, n_H {'<'} 1 — manfiy.
                </p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-red-400 font-bold text-xs mb-1">T → R o'tish</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>T-holat (Tense):</strong> O₂ ga past yaqinlik, barqaror tuz konfiguratsiyasi</li>
                  <li>• <strong>R-holat (Relaxed):</strong> O₂ ga yuqori yaqinlik, tuz ko'priklari uzilgan</li>
                  <li>• Bir subbirlik O₂ bog'lasa — qo'shnilari R-holatga o'tadi</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "effekt" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-red-400 font-bold">Bor effekti va allosterik regulyatsiya</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">🌡️ Bor effekti</p>
                <p className="text-xs">
                  <strong>pH↓ yoki CO₂↑</strong> → Hb ning O₂ ga yaqinligi <strong>kamayadi</strong>.
                  To'qimalarda pH past — O₂ oson ajraladi.
                  O'pkada pH yuqori — O₂ oson bog'lanadi.
                </p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">🧪 2,3-BPG effekti</p>
                <p className="text-xs">
                  2,3-bisfosfoglitserat (BPG) — Hb markaziy bo'shlig'iga bog'lanib,
                  <strong>T-holatni stabillashtiradi</strong>. O₂ yaqinligini pasaytiradi.
                  Yuqori balandlikda BPG miqdori oshadi.
                </p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">☠️ CO zaharlanishi</p>
                <p className="text-xs">
                  CO gemoglobinga O₂ dan <strong>~210 marta kuchli</strong> bog'lanadi →
                  karboksigemoglobin. Yorqin qizil rang.
                  Davolash: <strong>sof O₂</strong> yoki giperbarik O₂ terapiyasi.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Gemoglobin() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar" className="text-purple-400 hover:text-purple-300 text-lg">← Metalloproteinlar</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🩸 Gemoglobin (Hb)</h1>
          <p className="text-purple-400 text-sm">Fe-porfirin • O₂ tashish • Kooperativlik • Bor effekti</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Gemoglobin haqida asosiy ma'lumot</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-red-400">Gemoglobin (Hb)</strong> — 
              qizil qon tanachalaridagi (eritrotsitlar) asosiy oqsil bo'lib, 
              <strong> O₂ ni o'pkadan to'qimalarga</strong> va 
              <strong> CO₂ ni to'qimalardan o'pkaga</strong> tashiydi. 
              Har bir eritrotsitda <strong>~270 million</strong> gemoglobin molekulasi mavjud. 
              Gemoglobin — <strong className="text-yellow-400">metalloprotein</strong> bo'lib, 
              uning faol markazida <strong>Fe²⁺-porfirin (gem)</strong> kompleksi joylashgan. 
              Bu bioanorganik kimyoning eng mukammal o'rganilgan tizimlaridan biridir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Asosiy xususiyatlari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Molekulyar massa:</strong> ~64.5 kDa (tetramer)</li>
                <li>• <strong>Tarkibi:</strong> α₂β₂ — 4 ta subbirlik</li>
                <li>• <strong>Har bir subbirlikda:</strong> 1 ta gem + 1 ta Fe²⁺</li>
                <li>• <strong>O₂ bog'lash:</strong> 4 molekula O₂ / 1 molekula Hb</li>
                <li>• <strong>Metall:</strong> Fe²⁺ — past spinli (S=0) oksi-Hb da</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Mioglobin bilan taqqoslash</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Mioglobin (Mb):</strong> monomer — 1 ta gem</li>
                <li>• <strong>Gemoglobin:</strong> tetramer — 4 ta gem + kooperativlik</li>
                <li>• Mb — <strong>giperbolik</strong> O₂ bog'lanish egrisi</li>
                <li>• Hb — <strong>sigmasimon</strong> O₂ bog'lanish egrisi</li>
                <li>• Mb — O₂ <strong>zaxirasi</strong> (muskullarda)</li>
                <li>• Hb — O₂ <strong>tashuvchisi</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* GEM STRUKTURASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Gem guruhi — Fe-porfirin kompleksi</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-yellow-400">Gem</strong> — bu 
              <strong> Fe²⁺ ioni protoporfirin IX</strong> halqasi markazida joylashgan 
              makrotsiklik kompleks. Porfirin halqasi <strong>4 ta pirrol halqasi</strong> dan 
              iborat bo'lib, ular metin ko'priklari (=CH−) orqali bog'langan. 
              Fe²⁺ ioni 4 ta pirrol N atomi bilan <strong>ekvatorial tekislikda</strong> 
              koordinatsiyalangan. <strong>5-koordinatsion o'rin</strong> — 
              oqsil zanjiridagi proksimal gistidin (His F8) qoldig'i. 
              <strong>6-koordinatsion o'rin</strong> — O₂ molekulasi bog'lanadigan joy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-900/50 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold text-sm mb-2">Fe elektron tuzilishi</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Deoksi-Hb:</strong> Fe²⁺ (d⁶), yuqori spinli (S=2, HS)</li>
                <li>• 4 ta juftlanmagan elektron — <strong>paramagnit</strong></li>
                <li>• Fe porfirin tekisligidan <strong>~0.4 Å tashqarida</strong></li>
                <li>• <strong>Oksi-Hb:</strong> Fe²⁺ (d⁶), past spinli (S=0, LS)</li>
                <li>• Barcha elektronlar juftlashgan — <strong>diamagnit</strong></li>
                <li>• Fe porfirin tekisligiga <strong>tortilgan</strong></li>
                <li>• O₂ <strong>uchinchi proton</strong> distal His (E7) bilan H-bog' hosil qiladi</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold text-sm mb-2">Kristall maydon nazariyasi</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• Gem — <strong>tetragonal bipiramida</strong> (5-koord.) yoki oktaedr (6-koord.)</li>
                <li>• Porfirin N₄ — kuchli maydon ligand (~ CO, CN⁻ darajasida)</li>
                <li>• Kuchli ekvatorial maydon → d-orbitallar kuchli ajralgan</li>
                <li>• <strong>Δ₀ (porfirin) {'>'} juftlanish energiyasi (P)</strong> → past spin</li>
                <li>• Deoksi-Hb da Fe tekislikdan tashqarida → <strong>maydon kuchsizroq</strong> → HS</li>
              </ul>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <GemTuzilishSlayder />
        </div>

        {/* MIQDORIY KO'RSATKICHLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Miqdoriy ko'rsatkichlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <p className="text-red-400 text-3xl font-bold">64.5</p>
              <p className="text-purple-300 text-xs mt-1">kDa — molekulyar massa</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <p className="text-red-400 text-3xl font-bold">4</p>
              <p className="text-purple-300 text-xs mt-1">O₂ molekulasi / 1 Hb</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <p className="text-red-400 text-3xl font-bold">2.8</p>
              <p className="text-purple-300 text-xs mt-1">Hill koeffitsienti (n_H)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <p className="text-red-400 text-3xl font-bold">~26</p>
              <p className="text-purple-300 text-xs mt-1">pO₂ (mmHg) — P₅₀ qiymati</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <p className="text-red-400 text-3xl font-bold">210×</p>
              <p className="text-purple-300 text-xs mt-1">CO ning O₂ ga nisbatan yaqinligi</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <p className="text-red-400 text-3xl font-bold">~270M</p>
              <p className="text-purple-300 text-xs mt-1">Hb molekulasi / 1 eritrotsit</p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Gemoglobin — <strong className="text-red-400">α₂β₂ tetramer</strong>, 4 ta Fe²⁺-gem markazi</li>
            <li>Fe²⁺ O₂ bog'laganda <strong className="text-red-400">yuqori spin → past spin</strong> o'tadi, lekin oksidlanmaydi</li>
            <li>Kooperativlik tufayli O₂ bog'lanish egrisi <strong className="text-red-400">sigmasimon</strong> — samarali tashish va yetkazib berish</li>
            <li>Bor effekti, 2,3-BPG va CO — <strong className="text-red-400">fiziologik regulyatsiya</strong> omillari</li>
            <li>Gemoglobin — <strong className="text-red-400">bioanorganik kimyoning eng klassik namunasi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Metalloproteinlar</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/mioglobin" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Mioglobin →</Link>
        </div>

      </section>
    </main>
  )
}