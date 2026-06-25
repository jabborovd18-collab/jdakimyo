import Link from "next/link"

export default function MolekulyarMashinalar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/supramolekulyar" className="text-purple-400 hover:text-purple-300 text-lg">← Supramolekulyar</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">⚙️ Molekulyar mashinalar</h1>
          <p className="text-purple-400 text-sm">Rotaksanlar • Katenanlar • Molekulyar motorlar • Nobel 2016</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Molekulyar mashinalar haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Molekulyar mashinalar</strong> — tashqi stimul (yorug'lik, 
              pH, harorat, elektr maydoni) ta'sirida <strong>mexanik harakatni</strong> amalga oshiradigan 
              supramolekulyar tizimlar. <strong>Nobel mukofoti 2016</strong> aynan shu sohaga berilgan:
              <strong className="text-yellow-400"> Sauvage</strong> (katenanlar), 
              <strong className="text-yellow-400"> Stoddart</strong> (rotaksanlar) va 
              <strong className="text-yellow-400"> Feringa</strong> (molekulyar motorlar).
              Bu mashinalar <strong>~1−10 nm</strong> o'lchamda bo'lib, ularning harakati 
              <strong>Braun harakatidan farqli</strong> — yo'naltirilgan va boshqariladigan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
            {[
              { laureate: "Jean-Pierre Sauvage", year: "1983", invention: "Katenanlar sintezi — templat usuli", prize: "Nobel 2016", note: "Ikkita bir-biriga o'tkazilgan halqa — mexanik bog'langan molekulalar" },
              { laureate: "Fraser Stoddart", year: "1991", invention: "Rotaksanlar — molekulyar moki", prize: "Nobel 2016", note: "Halqa o'q bo'ylab harakatlanadi — molekulyar lift, mushak" },
              { laureate: "Bernard Feringa", year: "1999", invention: "Molekulyar motor — C=C izomerlanishi", prize: "Nobel 2016", note: "Yorug'lik ta'sirida bir yo'nalishda aylanadigan motor" },
            ].map((r, i) => (
              <div key={i} className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-400 font-bold text-xs">{r.laureate}</p>
                <p className="text-purple-300 text-xs mt-1">{r.year} — {r.invention}</p>
                <p className="text-white font-bold text-xs mt-2">{r.prize}</p>
                <p className="text-purple-400 text-xs mt-2">{r.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. ROTAKSANLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Rotaksanlar — molekulyar moki</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">Rotaksan</strong> — o'q shaklidagi molekula (dumbbell) 
            va unga o'tkazilgan <strong>halqa (ring)</strong> dan iborat mexanik bog'langan tizim.
            O'qning ikki uchidagi <strong>katta to'xtatuvchi guruhlar (stoppers)</strong> halqaning 
            chiqib ketishini oldini oladi. Halqa o'q bo'ylab <strong>ikki stansiya o'rtasida</strong> 
            harakatlanadi — bu <strong>molekulyar moki (shuttle)</strong> deb ataladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">Stoddart rotaksani — molekulyar lift:</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">Komponentlar:</strong> O'q — viologen (V²⁺) va naftalin (N) stansiyalari bilan. Halqa — CBPQT⁴⁺ (siklobis(parakvat-p-fenilen)).</p>
              <p><strong className="text-yellow-400">Harakat:</strong> Halqa V²⁺ stansiyasida turadi. V²⁺ qaytarilganda (V⁺•) — halqa N stansiyasiga o'tadi. V⁺• oksidlanganda — halqa yana V²⁺ ga qaytadi.</p>
              <p className="text-green-400 mt-1"><strong>Boshqarish:</strong> Elektr potensiali yoki pH o'zgarishi — qaytar jarayon, ko'p marta takrorlanadi.</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
              <h3 className="text-green-400 font-bold text-sm mb-2">Rotaksan qo'llanishlari</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Molekulyar elektronika:</strong> Molekulyar kalit (switch) — 0 va 1 holatlari</li>
                <li>• <strong>Dori yetkazish:</strong> Halqa harakati orqali dorini "qulf ochish"</li>
                <li>• <strong>Molekulyar mushak:</strong> Rotaksan qisqarishi/cho'zilishi — makroskopik harakat</li>
                <li>• <strong>Xotira qurilmalari:</strong> 1 bit = 1 molekula!</li>
              </ul>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
              <h3 className="text-blue-400 font-bold text-sm mb-2">Metall kompleksli rotaksanlar</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• Sauvage usuli — Cu⁺ templat: ikkita fenantrolin ligandini tetraedrik Cu⁺ to'playdi</li>
                <li>• Halqa yopilgach — Cu⁺ olib tashlanadi (KCN bilan)</li>
                <li>• Metall almashinuvi — Cu⁺/Zn²⁺ orqali harakat boshqariladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. MOLEKULYAR MOTORLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Feringa molekulyar motorlari</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">Bernard Feringa (1999)</strong> — yorug'lik ta'sirida 
            <strong>bir yo'nalishda uzluksiz aylanadigan</strong> birinchi molekulyar motorni yaratgan.
            Motor <strong>C=C bog'ining fotoizomerlanishiga</strong> asoslangan: UV nurlanish 
            <strong>trans → sis</strong> izomerlanishni keltirib chiqaradi, so'ng <strong>termal 
            helix inversiyasi</strong> orqali molekula dastlabki holatga qaytadi — lekin 
            <strong>180° ga burilgan holda!</strong> Bu sikl takrorlanib, to'liq 360° aylanish 
            amalga oshiriladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">Feringa motori — 4 bosqichli sikl:</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">1. Fotoizomerlanish (UV):</strong> trans → sis (C=C burilishi). Molekula "yuqori energiyali" holatga o'tadi.</p>
              <p><strong className="text-yellow-400">2. Helix inversiyasi (Δ):</strong> Issiqlik ta'sirida molekula yana barqaror konformatsiyaga qaytadi — lekin 180° burilgan!</p>
              <p><strong className="text-yellow-400">3. Fotoizomerlanish (UV):</strong> Yana trans → sis — yana burilish.</p>
              <p><strong className="text-yellow-400">4. Helix inversiyasi (Δ):</strong> Issiqlik — dastlabki holatga qaytadi. <strong>To'liq 360° aylanish!</strong></p>
              <p className="text-green-400 mt-2"><strong>Aylanish chastotasi:</strong> Dastlabki motor — ~1 aylanish/soat. Zamonaviy motorlar — ~12 MHz (12 million aylanish/sekund!).</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Rotaksanlar — <strong className="text-yellow-400">halqa o'q bo'ylab harakatlanadi</strong> (molekulyar moki)</li>
            <li>Katenanlar — <strong className="text-yellow-400">ikkita mexanik bog'langan halqa</strong></li>
            <li>Feringa motorlari — <strong className="text-yellow-400">yorug'lik + issiqlik = bir yo'nalishli aylanish</strong></li>
            <li>Nobel 2016 — <strong className="text-yellow-400">Sauvage, Stoddart, Feringa</strong></li>
            <li>Kelajak — <strong className="text-yellow-400">molekulyar nanorobotlar, aqlli dorilar, molekulyar kompyuterlar</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/supramolekulyar/metallosupramolekulyar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Metallosupramolekulyar</Link>
          <Link href="/ilmiy/chuqurlashgan/supramolekulyar/sensorlar" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Supramolekulyar sensorlar →</Link>
        </div>

      </section>
    </main>
  )
}