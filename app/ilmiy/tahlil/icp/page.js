import Link from "next/link"

export default function ICP() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-300">🧬 ICP-OES / ICP-MS</h1>
          <p className="text-purple-400 text-sm">Induktiv bog'langan plazma • Ko'p elementli tahlil • ppb−ppt • Izotop nisbati</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <Link 
          href="/ilmiy/tahlil/icp/birikmalar"
          className="group block bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-2xl p-6 hover:bg-cyan-900/60 hover:border-cyan-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🧬</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                Birikmalarning ICP-OES/ICP-MS tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalarning ko'p elementli ICP tahlili. Metall konsentratsiyasi,
                izotop nisbati, LOD/LOQ va matritsa effektlari har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-cyan-300 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-cyan-600/20 text-cyan-300 border border-cyan-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Ko'p elementli</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Izotop nisbati</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">ppb−ppt</span>
          </div>
        </Link>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 ICP-OES va ICP-MS haqida</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-cyan-300">ICP (Inductively Coupled Plasma)</strong> — 
              <strong className="text-cyan-300"> 6000−10000 K</strong> haroratdagi argon plazmasida namunani 
              atomlashtirish va ionlashtirishga asoslangan zamonaviy element tahlil usuli.
              <strong className="text-cyan-300"> ICP-OES (Optical Emission Spectroscopy)</strong> 
              qo'zg'algan atomlarning nurlanishini, 
              <strong className="text-cyan-300"> ICP-MS (Mass Spectrometry)</strong> esa 
              hosil bo'lgan ionlarning mass/zaryad nisbatini o'lchaydi. ICP-MS 
              <strong className="text-cyan-300"> ppt (ng/L) darajasida</strong> aniqlash imkonini beradi 
              va <strong className="text-cyan-300">izotop nisbatlarini</strong> ham aniqlay oladi.
              Kompleks birikmalarda <strong className="text-cyan-300">barcha metallarni bir vaqtda</strong> 
              miqdoriy tahlil qilish uchun eng qulay usul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-300 font-bold mb-2">ICP-OES</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Prinsip:</strong> Atom emission spektroskopiya</li>
                <li>• <strong>LOD:</strong> 0.1−10 μg/L (ppb)</li>
                <li>• <strong>Dinamik diapazon:</strong> 10⁵−10⁶ (keng)</li>
                <li>• <strong>Afzalligi:</strong> Yuqori matritsa chidamliligi, keng chiziqli diapazon</li>
                <li>• <strong>Kamchiligi:</strong> ICP-MS ga nisbatan past sezgirlik</li>
                <li>• <strong>Spektr:</strong> Har bir element bir nechta chiziq — tanlash imkoniyati</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-300 font-bold mb-2">ICP-MS</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Prinsip:</strong> Mass-spektrometriya (m/z ajratish)</li>
                <li>• <strong>LOD:</strong> 0.001−0.1 μg/L (ppq−ppt)</li>
                <li>• <strong>Izotop nisbati:</strong> Har bir izotop alohida aniqlanadi</li>
                <li>• <strong>Afzalligi:</strong> Juda yuqori sezgirlik, izotop ma'lumoti</li>
                <li>• <strong>Kamchiligi:</strong> Matritsa effektlariga sezgirroq</li>
                <li>• <strong>Spektr:</strong> Oddiy — har bir massa bitta pik</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. PLAZMA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔥 ICP plazmasi — 6000−10000 K harorat</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-cyan-300">Induktiv bog'langan plazma</strong> — argon gazi orqali 
            o'tadigan yuqori chastotali (27.12 yoki 40.68 MHz) elektr maydoni yordamida hosil qilinadi.
            Plazma harorati <strong className="text-cyan-300">6000−10000 K</strong> bo'lib, 
            bu barcha kimyoviy bog'larni uzish va elementlarni <strong>to'liq atomlashtirish/ionlashtirish</strong> 
            uchun yetarli. Alanga AAS (2000−3000°C) bilan taqqoslaganda, ICP 
            <strong className="text-cyan-300"> kimyoviy interferensiyalardan deyarli xoli</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            {[
              { zone: "Tashqi zona (10 000 K)", desc: "Energiya uzatish — induksion g'altak orqali" },
              { zone: "Markaziy kanal (6000 K)", desc: "Namuna purkaladi — atomlashtirish/ionlashtirish" },
              { zone: "Analitik zona (5000 K)", desc: "Nurlanish kuzatiladi (OES) yoki ionlar olinadi (MS)" },
            ].map((r, i) => (
              <div key={i} className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-cyan-300 font-bold text-sm">{r.zone}</p>
                <p className="text-purple-400 text-xs mt-2">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. KOMPLEKSLAR UCHUN PARAMETRLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Komplekslar tarkibidagi metallar uchun ICP parametrlari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Element</th>
                <th className="py-3 px-4 text-purple-300">ICP-OES λ (nm)</th>
                <th className="py-3 px-4 text-purple-300">ICP-MS m/z (asosiy)</th>
                <th className="py-3 px-4 text-purple-300">LOD OES (μg/L)</th>
                <th className="py-3 px-4 text-purple-300">LOD MS (ng/L)</th>
                <th className="py-3 px-4 text-purple-300">Interferensiyalar</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Fe", "238.2 / 259.9", "56 (91.7%)", "0.5", "0.5", "⁴⁰Ar¹⁶O⁺ (m/z=56) — He rejimi"],
                  ["Cu", "324.7 / 327.4", "63 (69.2%)", "0.3", "0.2", "⁴⁰Ar²³Na⁺ (m/z=63) — oz ta'sir"],
                  ["Co", "228.6 / 238.9", "59 (100%)", "0.5", "0.1", "Mononuklid — interferensiyasiz"],
                  ["Ni", "231.6 / 221.6", "58 (68.1%)", "0.8", "0.3", "⁴⁰Ar¹⁸O⁺ (m/z=58) — He rejimi"],
                  ["Cr", "267.7 / 283.6", "52 (83.8%)", "0.5", "0.3", "⁴⁰Ar¹²C⁺ (m/z=52) — He rejimi"],
                  ["Pt", "214.4 / 265.9", "195 (33.8%)", "2.0", "0.5", "Yuqori massa — kam interferensiya"],
                  ["Ag", "328.1 / 338.3", "107 (51.8%)", "0.5", "0.1", "Mononuklid jufti — oson"],
                  ["Zn", "213.9 / 206.2", "64 (49.2%)", "0.2", "0.1", "⁴⁰Ar²⁴Mg⁺ (m/z=64) — oz ta'sir"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-bold text-cyan-300 text-xs">{r[0]}</td>
                    <td className="py-2 px-3 font-mono text-yellow-400 text-xs">{r[1]}</td>
                    <td className="py-2 px-3 font-mono text-yellow-400 text-xs">{r[2]}</td>
                    <td className="py-2 px-3 text-xs">{r[3]}</td>
                    <td className="py-2 px-3 text-xs">{r[4]}</td>
                    <td className="py-2 px-3 text-xs">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. ICP-MS vs ICP-OES vs AAS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚖️ ICP-OES vs ICP-MS vs AAS — taqqoslash</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Parametr</th>
                <th className="py-3 px-4 text-purple-300">FAAS</th>
                <th className="py-3 px-4 text-purple-300">GFAAS</th>
                <th className="py-3 px-4 text-purple-300">ICP-OES</th>
                <th className="py-3 px-4 text-purple-300">ICP-MS</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["LOD", "ppm", "ppb", "ppb", "ppt"],
                  ["Ko'p elementli", "Yo'q (ketma-ket)", "Yo'q (ketma-ket)", "Ha (bir vaqtda 60+)", "Ha (bir vaqtda 70+)"],
                  ["Dinamik diapazon", "10²", "10²", "10⁶", "10⁸"],
                  ["Izotop ma'lumoti", "Yo'q", "Yo'q", "Yo'q", "Ha"],
                  ["Namuna hajmi", "1−5 mL", "10−50 μL", "1−5 mL", "0.1−2 mL"],
                  ["Narxi (taxminiy)", "$15−30K", "$30−50K", "$80−150K", "$200−500K"],
                  ["Ishlatish narxi", "Past", "O'rtacha", "O'rtacha", "Yuqori"],
                  ["Matritsa chidamliligi", "O'rtacha", "Yuqori", "Yuqori", "O'rtacha"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 text-cyan-300 text-xs">{r[0]}</td>
                    <td className="py-2 px-3 text-xs">{r[1]}</td>
                    <td className="py-2 px-3 text-xs">{r[2]}</td>
                    <td className="py-2 px-3 text-xs">{r[3]}</td>
                    <td className="py-2 px-3 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. QO'LLANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Kompleks birikmalarda ICP qo'llanishi</h2>
          
          <div className="space-y-4">
            {[
              {
                title: "1. Ko'p metalli komplekslarda barcha metallarni bir vaqtda tahlil qilish",
                desc: "ICP-OES yoki ICP-MS bir vaqtning o'zida 60 dan ortiq elementni aniqlay oladi. Geterobimetallik komplekslarda (Fe/Co, Cu/Zn, Pt/Pd) har bir metallning aniq konsentratsiyasi va nisbati bitta o'lchashda aniqlanadi."
              },
              {
                title: "2. Izotop nisbati orqali metall manbasini aniqlash",
                desc: "ICP-MS izotop nisbatlarini ham o'lchaydi. Bu xususiyat metallning tabiiy yoki sintetik manbasini aniqlashda, izotop nishonlash tajribalarida va metallning metabolizmini o'rganishda muhim."
              },
              {
                title: "3. Juda past konsentratsiyadagi metallarni aniqlash (ultra-iz element tahlili)",
                desc: "ICP-MS ppt darajasida aniqlash imkonini beradi. Katalitik miqdordagi metallar, qoldiq metallar, qon va biologik namunalardagi metall dori vositalarining konsentratsiyasi ICP-MS orqali aniqlanadi."
              },
              {
                title: "4. Element analiz (CHNS) bilan birgalikda to'liq formula validatsiyasi",
                desc: "ICP-MS + CHNS + AAS kombinatsiyasi kompleksning to'liq element tarkibini (C, H, N, S + barcha metallar) aniqlash imkonini beradi. Bu yangi sintez qilingan komplekslar uchun majburiy tahlil paketidir."
              },
            ].map((item, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-cyan-300 font-bold mb-2">{item.title}</h3>
                <p className="text-purple-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>ICP-OES — <strong className="text-cyan-300">ko'p elementli (60+) tahlil, ppb darajasida</strong></li>
            <li>ICP-MS — <strong className="text-cyan-300">ppt darajasida aniqlash, izotop nisbati</strong> ma'lumoti</li>
            <li>ICP plazmasi (6000−10000 K) — <strong className="text-cyan-300">kimyoviy interferensiyalardan deyarli xoli</strong></li>
            <li>AAS ga nisbatan <strong className="text-cyan-300">qimmatroq, lekin bir vaqtda ko'p element</strong> aniqlaydi</li>
            <li>Kompleks birikmalar uchun <strong className="text-cyan-300">eng zamonaviy element tahlil usuli</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/aas" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← AAS</Link>
          <Link href="/ilmiy/tahlil/konduktometriya" className="px-6 py-3 bg-cyan-700/80 rounded-xl hover:bg-cyan-600 text-white font-semibold">Konduktometriya →</Link>
        </div>

      </section>
    </main>
  )
}