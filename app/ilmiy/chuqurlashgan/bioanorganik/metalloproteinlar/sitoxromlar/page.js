"use client"

import Link from "next/link"
import { useState } from "react"

function SitoxromSlayder() {
  const [tab, setTab] = useState("turlari")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "turlari", label: "📋 Turlari" },
          { key: "mexanizm", label: "⚡ Mexanizm" },
          { key: "p450", label: "🔬 P450" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key 
                ? "bg-amber-600/80 text-white" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        {tab === "turlari" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-amber-400 font-bold">Sitoxromlar klassifikatsiyasi</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-purple-700/50">
                    <th className="text-left py-2 px-3 text-yellow-400">Turi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Gem turi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Metall</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Funksiyasi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">λ_max (α-tasma)</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["a / a₃", "Gem A", "Fe, Cu", "O₂ reduksiyasi (sitoxrom c oksidaza)", "~600 nm"],
                    ["b", "Gem B (protohem)", "Fe", "Elektron tashish, P450", "~556 nm"],
                    ["c", "Gem C (kovalent bog'langan)", "Fe", "Elektron tashish (sitoxrom c)", "~550 nm"],
                    ["d", "Gem D", "Fe", "Bakterial nitritreduktaza", "~600 nm"],
                    ["f", "Gem F", "Fe", "Fotosintez (b₆f kompleks)", "~554 nm"],
                    ["P450", "Gem B (tiolat ligand)", "Fe", "Monooksigenaza", "~450 nm (CO kompleks)"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-2 px-3"><strong className="text-amber-400">{row[0]}</strong></td>
                      <td className="py-2 px-3">{row[1]}</td>
                      <td className="py-2 px-3">{row[2]}</td>
                      <td className="py-2 px-3">{row[3]}</td>
                      <td className="py-2 px-3 text-amber-300">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "mexanizm" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-amber-400 font-bold">Elektron tashish zanjiri</h4>
            <p>
              Mitoxondriya ichki membranasida joylashgan sitoxromlar 
              <strong className="text-yellow-400"> elektron tashish zanjiri (ETZ)</strong> ni 
              tashkil qiladi. Elektronlar NADH dan O₂ ga ketma-ket o'tadi.
            </p>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-amber-400 font-bold text-xs mb-2">ETZ ketma-ketligi:</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-purple-800 px-2 py-1 rounded">NADH</span>
                <span className="text-purple-400">→</span>
                <span className="bg-purple-800 px-2 py-1 rounded">Kompleks I (NADH dehidrogenaza)</span>
                <span className="text-purple-400">→</span>
                <span className="bg-purple-800 px-2 py-1 rounded">UQ (ubixinon)</span>
                <span className="text-purple-400">→</span>
                <span className="bg-purple-800 px-2 py-1 rounded">Kompleks III (sitoxrom bc₁)</span>
                <span className="text-purple-400">→</span>
                <span className="bg-amber-800 px-2 py-1 rounded font-bold">Sitoxrom c</span>
                <span className="text-purple-400">→</span>
                <span className="bg-purple-800 px-2 py-1 rounded">Kompleks IV (sitoxrom c oksidaza)</span>
                <span className="text-purple-400">→</span>
                <span className="bg-amber-800 px-2 py-1 rounded font-bold">O₂ → H₂O</span>
              </div>
            </div>
          </div>
        )}

        {tab === "p450" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-amber-400 font-bold">Sitoxrom P450 — maxsus monooksigenaza</h4>
            <p>
              P450 — <strong className="text-yellow-400">tiolat (sisteinat) ligandli</strong> 
              yagona gem oqsili. Fe³⁺ ga <strong>S⁻ (sistein)</strong> 5-koordinatsion 
              ligand sifatida bog'langan. CO bilan kompleksi <strong>450 nm</strong> da 
              yutiladi — nomi shundan.
            </p>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold text-xs mb-1">P450 reaksiyasi:</p>
              <p className="text-xs font-mono">
                R−H + O₂ + NADPH + H⁺ → R−OH + H₂O + NADP⁺
              </p>
              <p className="text-xs mt-1">
                P450 jigarda dori metabolizmi, steroid sintezi va ksenobiotik detoksifikatsiyasida 
                ishtirok etadi.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Sitoxromlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/mioglobin" className="text-purple-400 hover:text-purple-300 text-lg">← Mioglobin</Link>
        <div>
          <h1 className="text-2xl font-bold text-amber-400">⚡ Sitoxromlar</h1>
          <p className="text-purple-400 text-sm">Elektron tashish zanjiri • a, b, c, P450 • O₂ reduksiyasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Sitoxromlar — elektron tashish oqsillari</h2>
          
          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-amber-400">Sitoxromlar</strong> — 
              tarkibida <strong>gem guruhi</strong> saqlovchi va 
              <strong> elektron tashish</strong> vazifasini bajaruvchi oqsillar oilasi.
              Ular <strong>Fe²⁺ ↔ Fe³⁺</strong> o'tish orqali elektronlarni tashiydi.
              Barcha tirik organizmlarda uchraydi — bakteriyalardan odamgacha.
              Asosiy funksiyalari: <strong>nafas olish zanjiri</strong> (mitoxondriya), 
              <strong> fotosintez</strong> (xloroplast), 
              <strong> detoksifikatsiya</strong> (P450).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-amber-400 font-bold mb-2">Umumiy xususiyatlar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Gem oqsillari</strong> — Fe-porfirin faol markazi</li>
                <li>• <strong>Fe²⁺/Fe³⁺</strong> redoks juftligi orqali elektron tashish</li>
                <li>• UB-Vis spektrida <strong>α, β, γ (Sore)</strong> tasmalari</li>
                <li>• Qaytarilgan holatda (Fe²⁺) <strong>intensiv rang</strong></li>
                <li>• Oksidlangan holat (Fe³⁺) <strong>rangi o'zgaradi</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-amber-400 font-bold mb-2">Gem turlari va bog'lanishi</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Gem B (protohem):</strong> gemoglobin, mioglobin, sitoxrom b</li>
                <li>• <strong>Gem C:</strong> sitoxrom c — oqsilga <strong>kovalent</strong> bog'langan (tioefir)</li>
                <li>• <strong>Gem A:</strong> sitoxrom a/a₃ — formil + gidroksifarnezil guruhlari</li>
                <li>• <strong>Gem D, F:</strong> bakterial va fotosintetik sitoxromlar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SITOXROM C */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Sitoxrom c — eng yaxshi o'rganilgan sitoxrom</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-amber-400">Sitoxrom c</strong> — kichik (~12 kDa) 
              gemoprotein. Gem guruhi oqsil zanjiriga <strong>ikkita tioefir bog'i</strong> 
              orqali kovalent bog'langan (sistein qoldiqlari vinil guruhlariga birikadi).
              <strong> Met80 va His18</strong> — Fe ga aksial ligandlar (6-koordinatsion).
              Sitoxrom c — <strong className="text-yellow-400">evolyutsion konservativ</strong> 
              oqsil, turlar orasidagi farqlar filogenetik tadqiqotlarda ishlatiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-3 text-center">
              <p className="text-amber-400 font-bold">~12 kDa</p>
              <p className="text-purple-300">Molekulyar massa</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3 text-center">
              <p className="text-amber-400 font-bold">+0.26 V</p>
              <p className="text-purple-300">Redoks potensial (Fe³⁺/Fe²⁺)</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3 text-center">
              <p className="text-amber-400 font-bold">~550 nm</p>
              <p className="text-purple-300">α-tasma (qaytarilgan holat)</p>
            </div>
          </div>
        </div>

        {/* SITOXROM C OKSIDAZA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🫁 Sitoxrom c oksidaza (Kompleks IV)</h2>
          
          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-amber-400">Sitoxrom c oksidaza (CcO)</strong> — 
              elektron tashish zanjirining <strong>oxirgi fermenti</strong>. Tarkibida 
              <strong> 2 ta gem A</strong> (sitoxrom a va a₃) va 
              <strong> 2 ta mis markazi</strong> (Cu_A va Cu_B) mavjud.
              <strong> O₂ ni H₂O ga qaytaradi</strong> — hayot uchun eng muhim reaksiyalardan biri.
            </p>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold text-sm mb-2">O₂ reduksiyasi — 4 elektronli jarayon</h3>
            <p className="text-purple-200 text-xs font-mono mb-2">
              O₂ + 4e⁻ + 4H⁺ → 2H₂O
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-amber-400 font-bold mb-1">Metall markazlari:</p>
                <ul className="space-y-0.5 text-purple-200">
                  <li>• <strong>Sitoxrom a:</strong> Fe (gem A), past spin</li>
                  <li>• <strong>Sitoxrom a₃:</strong> Fe (gem A), yuqori spin, O₂ bog'laydi</li>
                  <li>• <strong>Cu_A:</strong> 2 ta Cu — elektron kirish joyi</li>
                  <li>• <strong>Cu_B:</strong> Fe(a₃) yaqinida — O₂ aktivatsiyasi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-amber-400 font-bold mb-1">Mexanizm:</p>
                <ol className="space-y-0.5 text-purple-200 list-decimal list-inside">
                  <li>Elektron Cu_A orqali kiradi</li>
                  <li>Gem a orqali gem a₃ ga o'tadi</li>
                  <li>O₂ Fe(a₃)−Cu_B markazga bog'lanadi</li>
                  <li>4e⁻ + 4H⁺ → 2H₂O ajraladi</li>
                  <li>Har bir O₂ uchun <strong>4 proton</strong> membranadan o'tkaziladi</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SitoxromSlayder />
        </div>

        {/* SITOXROM BC1 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Sitoxrom bc₁ (Kompleks III)</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-sm mb-3">
              <strong className="text-amber-400">Sitoxrom bc₁</strong> — 
              <strong> Q-sikl</strong> mexanizmi orqali ishlaydigan dimerik ferment.
              Tarkibida <strong>3 ta redoks markaz</strong> mavjud:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-amber-400 font-bold">Riske Fe-S klaster</p>
                <p className="text-purple-200">[2Fe-2S] — yuqori potensialli (ISP)</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-amber-400 font-bold">Sitoxrom b</p>
                <p className="text-purple-200">2 ta gem B (b_L va b_H) — past va yuqori potensialli</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-amber-400 font-bold">Sitoxrom c₁</p>
                <p className="text-purple-200">Gem C — sitoxrom c ga elektron beradi</p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-amber-600/10 to-purple-600/10 border border-amber-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Sitoxromlar — <strong className="text-amber-400">gem oqsillari</strong>, Fe²⁺/Fe³⁺ redoks juftligi orqali elektron tashiydi</li>
            <li><strong className="text-amber-400">a, b, c, P450</strong> turlari — gem turi, ligand va funksiyaga qarab klassifikatsiya</li>
            <li>Sitoxrom c — <strong className="text-amber-400">kovalent bog'langan</strong> gem, evolyutsion konservativ</li>
            <li>Sitoxrom c oksidaza — <strong className="text-amber-400">Fe + Cu</strong> markazlari, O₂ → H₂O</li>
            <li>P450 — <strong className="text-amber-400">tiolat ligandli</strong> yagona sitoxrom, detoksifikatsiya</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/mioglobin" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Mioglobin</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/xlorofil" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">Xlorofil →</Link>
        </div>

      </section>
    </main>
  )
}