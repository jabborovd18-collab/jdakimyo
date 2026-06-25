"use client"

import Link from "next/link"

export default function CaNasos() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/na-k-kanal" className="text-purple-400 hover:text-purple-300 text-lg">← Na⁺/K⁺-ATFaza</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🦴 Ca²⁺ nasoslari</h1>
          <p className="text-purple-400 text-sm">Signal uzatish • Mushak qisqarishi • Ca-ATFaza • Na⁺/Ca²⁺ almashinuvchi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Ca²⁺ — universal ikkinchi xabarchi</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-cyan-400">Ca²⁺ ioni</strong> — 
              hujayra ichidagi eng muhim <strong>signal molekulasi</strong>.
              Sitoplazmadagi Ca²⁺ konsentratsiyasi <strong>~100 nM</strong> 
              (juda past!), tashqarida <strong>~1-2 mM</strong> — 10 000 marta farq!
              Bu gradient <strong>Ca²⁺ nasoslari</strong> tomonidan saqlanadi:
              <strong> PMCA</strong> (plazma membrana Ca-ATFaza) va 
              <strong> SERCA</strong> (sarkoplazmatik retikulum Ca-ATFaza).
              Ca²⁺ — <strong className="text-yellow-400">qattiq kislota</strong> (HSAB),
              O-donor ligandlarni afzal ko'radi (karboksilat, karbonil).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">PMCA (Plazma Membrana Ca-ATFaza)</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Stoxiometriya:</strong> 1Ca²⁺ / 1ATP</li>
                <li>• <strong>Joyl ashgan:</strong> Plazma membranasi</li>
                <li>• Ca²⁺ ni <strong>hujayradan tashqariga</strong> chiqaradi</li>
                <li>• <strong>Yuqori yaqinlik:</strong> K_d ~10-100 nM</li>
                <li>• <strong>Kalmodulin</strong> tomonidan faollashtiriladi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">SERCA (Sarkoplazmatik Retikulum Ca-ATFaza)</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Stoxiometriya:</strong> 2Ca²⁺ / 1ATP</li>
                <li>• <strong>Joyl ashgan:</strong> Sarkoplazmatik retikulum membranasi</li>
                <li>• Ca²⁺ ni <strong>SR ichiga</strong> (zaxiraga) olib kiradi</li>
                <li>• Mushak bo'shashishi uchun Ca²⁺ ni tezda olib ketadi</li>
                <li>• <strong>Fosfolamban</strong> tomonidan regulyatsiya qilinadi</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Ca²⁺ koordinatsion kimyosi</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              Ca²⁺ — <strong className="text-yellow-400">d⁰ konfiguratsiya</strong>, CFSE=0.
              Mg²⁺ dan farqli o'laroq, Ca²⁺ <strong>kattaroq radiusga</strong> (1.00 Å vs 0.72 Å)
              va <strong>yuqori koordinatsion songa</strong> (6-8 vs 4-6) ega.
              Bu farq <strong>Ca²⁺ ni Mg²⁺ dan selektiv ajratish</strong> imkonini beradi.
              Ca²⁺ — <strong>qattiq kislota</strong>, O-donor ligandlarni afzal ko'radi:
              karboksilat (Asp, Glu), karbonil (Asn, Gln amidlari), suv molekulalari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-cyan-400 font-bold text-lg">d⁰</p>
              <p className="text-purple-300">CFSE = 0</p>
              <p className="text-purple-400 mt-1">
                Elektron konfiguratsiya yo'q — geometriya ligandlar bilan belgilanadi.
                Koordinatsion son 6-8.
              </p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-cyan-400 font-bold text-lg">r = 1.00 Å</p>
              <p className="text-purple-300">Ion radiusi</p>
              <p className="text-purple-400 mt-1">
                Mg²⁺ (0.72 Å) dan kattaroq. Bu farq biologik selektivlik uchun asos.
              </p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-cyan-400 font-bold text-lg">O-donor</p>
              <p className="text-purple-300">HSAB: qattiq kislota</p>
              <p className="text-purple-400 mt-1">
                Karboksilat (Asp, Glu), karbonil, suv — qattiq asoslar bilan bog'lanadi.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Ca²⁺ — <strong className="text-cyan-400">universal signal molekulasi</strong>, sitoplazmada ~100 nM (tashqarida 1-2 mM)</li>
            <li><strong className="text-cyan-400">PMCA:</strong> 1Ca²⁺/ATP (hujayradan chiqaradi); <strong className="text-cyan-400">SERCA:</strong> 2Ca²⁺/ATP (SR ichiga)</li>
            <li>Ca²⁺ koordinatsion soni <strong className="text-cyan-400">6-8</strong>, Mg²⁺ dan kattaroq radius — selektivlik asosi</li>
            <li><strong className="text-cyan-400">HSAB:</strong> Ca²⁺ qattiq kislota — O-donor ligandlar (Asp, Glu karboksilat)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/na-k-kanal" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Na⁺/K⁺-ATFaza</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/transferrin" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">Transferrin →</Link>
        </div>

      </section>
    </main>
  )
}