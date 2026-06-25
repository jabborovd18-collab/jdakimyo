"use client"

import Link from "next/link"

export default function Metalloproteinlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik" className="text-purple-400 hover:text-purple-300 text-lg">← Bioanorganik</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🩸 Metalloproteinlar</h1>
          <p className="text-purple-400 text-sm">Gemoglobin • Mioglobin • Sitoxromlar • Xlorofil</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Metalloproteinlar — metall saqlovchi oqsillar</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-red-400">Metalloproteinlar</strong> — 
              tarkibida bir yoki bir nechta <strong>metall ioni</strong> saqlovchi oqsillar.
              Metall ionlari oqsil funksiyasi uchun zarur — ular 
              <strong> katalitik markaz</strong>, <strong>elektron tashuvchi</strong> 
              yoki <strong>strukturaviy element</strong> sifatida xizmat qiladi.
              Inson oqsillarining <strong>~30% i</strong> metalloproteinlardir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Asosiy funksiyalari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>O₂ tashish:</strong> Gemoglobin, mioglobin (Fe)</li>
                <li>• <strong>Elektron tashish:</strong> Sitoxromlar (Fe), plastosianin (Cu)</li>
                <li>• <strong>Fotosintez:</strong> Xlorofil (Mg)</li>
                <li>• <strong>Kataliz:</strong> Karboangidraza (Zn), SOD (Cu, Zn)</li>
                <li>• <strong>Struktura:</strong> Rux barmoq oqsillari (Zn)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Metall bog'lanish turlari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Bezovta bog'lanish:</strong> Metall erkin holda bog'lanadi (Ca²⁺, Zn²⁺)</li>
                <li>• <strong>Kofaktor orqali:</strong> Gem (Fe), xlorin (Mg), B₁₂ (Co)</li>
                <li>• <strong>Klaster:</strong> Fe-S klasterlar, FeMo-kofaktor</li>
                <li>• <strong>Ko'prik ligand:</strong> O²⁻, S²⁻ orqali ko'p yadroli markazlar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* MAVZULAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📂 Metalloprotein turlari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/gemoglobin" 
              className="bg-purple-800/40 border border-red-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🩸</div>
              <h3 className="text-red-400 font-bold group-hover:text-red-300">Gemoglobin (Hb)</h3>
              <p className="text-purple-300 text-xs mt-2">
                α₂β₂ tetramer • 4 ta Fe²⁺-gem • O₂ tashish • Kooperativlik • Bor effekti
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/mioglobin" 
              className="bg-purple-800/40 border border-red-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">💪</div>
              <h3 className="text-red-400 font-bold group-hover:text-red-300">Mioglobin (Mb)</h3>
              <p className="text-purple-300 text-xs mt-2">
                Monomer • 1 ta Fe²⁺-gem • O₂ zaxirasi • Giperbolik kinetika
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/sitoxromlar" 
              className="bg-purple-800/40 border border-amber-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-amber-400 font-bold group-hover:text-amber-300">Sitoxromlar</h3>
              <p className="text-purple-300 text-xs mt-2">
                a, b, c, P450 • Fe²⁺/Fe³⁺ • Elektron tashish zanjiri • O₂ reduksiyasi
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/xlorofil" 
              className="bg-purple-800/40 border border-green-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🌿</div>
              <h3 className="text-green-400 font-bold group-hover:text-green-300">Xlorofil</h3>
              <p className="text-purple-300 text-xs mt-2">
                Mg-xlorin • Fotosintez • Yorug'lik yig'ish • Reaksiya markazi
              </p>
            </Link>
          </div>
        </div>

        {/* SOLISHTIRISH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚖️ Asosiy metalloproteinlar solishtirilishi</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-3 px-4 text-yellow-400">Xususiyat</th>
                  <th className="text-left py-3 px-4 text-red-400">Gemoglobin</th>
                  <th className="text-left py-3 px-4 text-red-400">Mioglobin</th>
                  <th className="text-left py-3 px-4 text-amber-400">Sitoxrom c</th>
                  <th className="text-left py-3 px-4 text-green-400">Xlorofil</th>
                </tr>
              </thead>
              <tbody className="text-purple-200 text-xs">
                {[
                  ["Metall", "Fe²⁺", "Fe²⁺", "Fe²⁺/Fe³⁺", "Mg²⁺"],
                  ["Makrotsikl", "Porfirin (gem)", "Porfirin (gem)", "Porfirin (gem C)", "Xlorin"],
                  ["Oqsillar soni", "4 (α₂β₂)", "1 (monomer)", "1", "Ko'p (LHCI, LHCII)"],
                  ["Funksiyasi", "O₂ tashish", "O₂ zaxirasi", "e⁻ tashish", "Yorug'lik yig'ish"],
                  ["O₂ bog'laydimi?", "Ha (kooperativ)", "Ha (giperbolik)", "Yo'q", "Yo'q"],
                  ["Redoks faolmi?", "Yo'q (faqat O₂)", "Yo'q (faqat O₂)", "Ha (Fe²⁺↔Fe³⁺)", "Ha (fotoinduktsiya)"],
                  ["Spektr (asosiy)", "Sore ~415 nm", "Sore ~418 nm", "α ~550 nm", "Q-tasma ~680 nm"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-4"><strong>{row[0]}</strong></td>
                    <td className="py-2 px-4">{row[1]}</td>
                    <td className="py-2 px-4">{row[2]}</td>
                    <td className="py-2 px-4">{row[3]}</td>
                    <td className="py-2 px-4">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Bioanorganik</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/gemoglobin" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Gemoglobin →</Link>
        </div>

      </section>
    </main>
  )
}