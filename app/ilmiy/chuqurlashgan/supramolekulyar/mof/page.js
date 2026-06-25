import Link from "next/link"

export default function MOF() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/supramolekulyar" className="text-purple-400 hover:text-purple-300 text-lg">← Supramolekulyar</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🏗️ MOF — Metall-Organic Frameworks</h1>
          <p className="text-purple-400 text-sm">G'ovakli koordinatsion polimerlar • Gaz saqlash • Kataliz • Dori yetkazish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 MOF haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-blue-400">MOF (Metal-Organic Frameworks)</strong> — metall ionlari 
              (yoki klasterlari) va organik ko'prik ligandlardan tashkil topgan 
              <strong className="text-blue-400"> g'ovakli kristall materiallar</strong>. 
              <strong>Omar Yaghi (1995)</strong> tomonidan asos solingan. MOF lar 
              <strong className="text-blue-400"> rekord darajadagi ichki yuza</strong> (BET 7800 m²/g gacha), 
              <strong className="text-blue-400"> sozlanuvchan g'ovak o'lchami</strong> (3−100 Å) va 
              <strong className="text-blue-400"> dasturlashtiriladigan funktsionalligi</strong> bilan ajralib turadi.
              Hozirda 100 000 dan ortiq MOF strukturasi sintez qilingan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">MOF komponentlari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>SBU (Secondary Building Unit):</strong> Metall tugunlar — Zn₄O, Cu₂, Zr₆O₄(OH)₄, Cr₃O</li>
                <li>• <strong>Ko'prik ligandlar:</strong> Dikarbonatlar (BDC, BTC, NDC), bipiridinlar, imidazolatlar</li>
                <li>• <strong>Topologiya:</strong> pcu, fcu, bcu, MOF-5 — pcu (primitive cubic)</li>
                <li>• <strong>Izoretikulyar dizayn:</strong> Bir xil topologiyada turli ligandlar — g'ovak o'lchamini sozlash</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">Klassik MOF materiallari</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">MOF</th><th className="text-left py-2 text-blue-400">SBU</th><th className="text-left py-2 text-yellow-400">BET (m²/g)</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["MOF-5 (IRMOF-1)","Zn₄O(BDC)₃","~3000"],["HKUST-1","Cu₂(BTC)₂ (paddlewheel)","~1800"],["ZIF-8","Zn(MeIM)₂ (sodalit)","~1900"],["UiO-66","Zr₆O₄(OH)₄(BDC)₆","~1200"],["MIL-101(Cr)","Cr₃O(BDC)₃","~4100"],["MOF-210","Zn₄O(BTE)₃","~6240"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5 font-mono text-blue-400">{r[0]}</td><td className="py-1.5 text-xs">{r[1]}</td><td className="py-1.5 text-xs">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. GAZ SAQLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💨 Gaz saqlash va ajratish</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            MOF larning <strong>eng muhim qo'llanish sohasi</strong>. Yuqori g'ovaklik va sozlanuvchan 
            yuza kimyosi tufayli ular <strong>H₂, CH₄, CO₂</strong> kabi gazlarni samarali saqlaydi 
            va <strong>molekulyar elak</strong> sifatida gaz aralashmalarini ajratadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs">
            {[
              { gas: "H₂ saqlash", temp: "77 K, 60 bar", record: "7.5 wt% (MOF-210)", goal: "DOE maqsadi: 5.5 wt%", note: "Kriogen harorat kerak — xona haroratida past" },
              { gas: "CO₂ ushlash", temp: "298 K, 1 bar", record: "~5 mmol/g (Mg-MOF-74)", goal: "Zavod chiqindilaridan", note: "Amin funktsionalizatsiyasi samaradorlikni oshiradi" },
              { gas: "CH₄ saqlash", temp: "298 K, 65 bar", record: "~200 v/v (HKUST-1)", goal: "Avtomobil yoqilg'isi", note: "Tabiiy gaz uchun — CNG ga muqobil" },
            ].map((r, i) => (
              <div key={i} className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-400 font-bold">{r.gas}</p>
                <p className="text-purple-300 mt-1">Sharoit: {r.temp}</p>
                <p className="text-yellow-400 mt-1">Rekord: {r.record}</p>
                <p className="text-green-400 mt-1">Maqsad: {r.goal}</p>
                <p className="text-purple-500 mt-2">{r.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. KATALIZ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚗️ MOF katalizatorlari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            MOF lar <strong>geterogen katalizator</strong> sifatida uchta asosiy katalitik markazga ega:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {[
              { title: "Metall tugunlar", desc: "SBU dagi to'yinmagan metall markazlari — Lyuis kislota katalizi. HKUST-1: Cu²⁺ — CO oksidlanishi, aldol kondensatsiyasi.", example: "HKUST-1, MIL-101(Cr)" },
              { title: "Ligand funktsional guruhlari", desc: "Ligandlarga kovalent bog'langan katalitik guruhlar — NH₂, SO₃H, piridin. Knoevenagel kondensatsiyasi, esterifikatsiya.", example: "IRMOF-3 (NH₂-BDC)" },
              { title: "G'ovaklardagi nan zarrachalar", desc: "MOF g'ovaklariga kiritilgan metall nan zarrachalari (Pd, Pt, Au). Hajmiy selektivlik — faqat g'ovakka sig'adigan substratlar.", example: "Pd@MOF-5, Au@ZIF-8" },
            ].map((r, i) => (
              <div key={i} className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-400 font-bold">{r.title}</p>
                <p className="text-purple-300 mt-1">{r.desc}</p>
                <p className="text-yellow-400 mt-2 text-xs italic">{r.example}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>MOF — <strong className="text-blue-400">SBU + ko'prik ligandlar</strong> = g'ovakli kristall material</li>
            <li>BET yuzasi <strong className="text-blue-400">7800 m²/g gacha</strong> — eng yuqori g'ovakli materiallar</li>
            <li>Qo'llanish: <strong className="text-blue-400">gaz saqlash, kataliz, dori yetkazish</strong></li>
            <li>Izoretikulyar dizayn — <strong className="text-blue-400">g'ovak o'lchamini aniq sozlash</strong></li>
            <li>100 000+ MOF strukturasi — <strong className="text-blue-400">eng tez rivojlanayotgan materiallar sinfi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/supramolekulyar/host-guest" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Host-guest kimyosi</Link>
          <Link href="/ilmiy/chuqurlashgan/supramolekulyar/metallosupramolekulyar" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Metallosupramolekulyar →</Link>
        </div>

      </section>
    </main>
  )
}