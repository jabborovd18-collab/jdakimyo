import Link from "next/link"

export default function UBVisspektroskopiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🌈 UB-Vis spektroskopiya</h1>
          <p className="text-purple-400 text-sm">Ultrabinafsha va ko&apos;rinadigan soha spektroskopiyasi • d-d o&apos;tishlar • Δo aniqlash</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── BIRIKMALAR UB-VIS TAHLILI KARTASI ── */}
        <Link 
          href="/ilmiy/tahlil/ub-vis/birikmalar"
          className="group block bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-900/60 hover:border-pink-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
              🔍
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-pink-400 group-hover:text-pink-300 transition-colors">
                Birikmalarning UB-Vis tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalarning UB-Vis spektrlari tahlili. Har bir birikma uchun yutilish maksimumlari, 
                Δ<sub>o</sub> qiymati, d-d va CT o&apos;tishlar, ε koeffitsiyenti, rang sababi va Tanabe-Sugano diagrammalari.
              </p>
            </div>
            <div className="text-3xl text-pink-400 group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">10 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">d-d o&apos;tishlar</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Δo hisoblash</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Rang sababi</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Tanabe-Sugano</span>
          </div>
        </Link>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 UB-Vis spektroskopiya haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">UB-Vis spektroskopiya</strong> (Ultrabinafsha va ko&apos;rinadigan soha) — 
              kompleks birikmalarning <strong className="text-yellow-400">eng muhim tahlil usullaridan biri</strong>. 
              Bu usul yordamida d-d o&apos;tishlar, zaryad ko&apos;chishi (LMCT, MLCT), kompleks geometriyasi va 
              <strong className="text-yellow-400"> Δo qiymati</strong> aniqlanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Moddaning <strong>rangi</strong></li>
                <li>• <strong>d-d elektron o&apos;tishlar</strong></li>
                <li>• <strong>Δo</strong> — kristall maydon ajralish energiyasi</li>
                <li>• <strong>Zaryad ko&apos;chishi</strong> (LMCT, MLCT)</li>
                <li>• Kompleks <strong>geometriyasi</strong> haqida ma&apos;lumot</li>
                <li>• <strong>ε</strong> — molyar yutilish koeffitsienti</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday ishlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Namunadan <strong>yorug&apos;lik o&apos;tkaziladi</strong></li>
                <li>• 200-800 nm to&apos;lqin uzunligida</li>
                <li>• Yutilgan nur <strong>spektr</strong> sifatida qayd etiladi</li>
                <li>• <strong>Beer-Lambert qonuni:</strong> A = ε·c·l</li>
                <li>• Yutilish maksimumidan <strong>Δo hisoblanadi</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. BEER-LAMBERT QONUNI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Beer-Lambert qonuni</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 text-center mb-6">
            <p className="text-2xl font-extrabold text-yellow-400 mb-3">A = ε · c · l</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400">A</div>
                <div className="text-white font-bold">Optik zichlik</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400">ε</div>
                <div className="text-white font-bold">Molyar yutilish (L·mol⁻¹·cm⁻¹)</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-purple-400">c · l</div>
                <div className="text-white font-bold">Konsentratsiya × yo&apos;l uzunligi</div>
              </div>
            </div>
          </div>
          
          <p className="text-purple-200 text-sm">
            <strong className="text-yellow-400">ε qiymati</strong> elektron o&apos;tishning ehtimolini ko&apos;rsatadi. 
            Tanlash qoidalari bilan ruxsat etilgan o&apos;tishlar uchun ε katta (10³-10⁵), 
            ta&apos;qiqlangan o&apos;tishlar uchun ε kichik (&lt;1).
          </p>
        </div>

        {/* 3. ELEKTRON O'TISHLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Kompleks birikmalarda elektron o&apos;tish turlari</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">1. d-d o&apos;tishlar</h3>
              <p className="text-purple-200 text-sm mb-2">
                Elektron t₂g orbitallardan eg orbitallarga o&apos;tadi. 
                <strong>Laporta qoidasi bilan ta&apos;qiqlangan</strong> (oktaedrik komplekslarda).
                Shuning uchun ε kichik (1-100). Oktaedrik komplekslarning rangi aynan shu o&apos;tishlar hisobiga.
              </p>
              <p className="text-purple-300 text-sm">
                <strong>Misol:</strong> [Ti(H₂O)₆]³⁺ (d¹) — 510 nm yutilish → binafsha-qizg&apos;ish rang.
              </p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">2. Zaryad ko&apos;chishi (CT)</h3>
              <p className="text-purple-200 text-sm mb-2">
                Elektron metaldan ligandga (MLCT) yoki liganddan metallga (LMCT) o&apos;tadi.
                <strong>Laporta qoidasi bilan ruxsat etilgan</strong>. ε juda katta (10³-10⁵).
              </p>
              <p className="text-purple-300 text-sm">
                <strong>Misol:</strong> [Fe(CN)₆]³⁻ — 420 nm LMCT o&apos;tish (Fe←CN), ε ≈ 1000.
              </p>
            </div>
          </div>
        </div>

        {/* 4. TANLASH QOIDALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📏 Tanlash qoidalari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Qoida</th><th className="py-3 px-4 text-purple-300">Tavsifi</th><th className="py-3 px-4 text-purple-300">Natijasi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-yellow-400">Laporta</td>
                  <td className="py-3 px-4 text-sm">Δl = ±1 (s→p, p→d ruxsat, d→d ta&apos;qiq)</td>
                  <td className="py-3 px-4 text-sm">Tetraedrikda ruxsat (markaz yo&apos;q), oktaedrikda ta&apos;qiq</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-yellow-400">Spin</td>
                  <td className="py-3 px-4 text-sm">ΔS = 0 (spin o&apos;zgarmasligi kerak)</td>
                  <td className="py-3 px-4 text-sm">d⁵ yuqori spinli komplekslarda barcha o&apos;tishlar ta&apos;qiqlangan</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-yellow-400">Juftlik</td>
                  <td className="py-3 px-4 text-sm">g→g va u→u ta&apos;qiq (sentrosimmetrik molekulalarda)</td>
                  <td className="py-3 px-4 text-sm">Oktaedrikda t₂g→eg ta&apos;qiq, tetraedrikda e→t₂ ruxsat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Δo HISOBLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 Δo — kristall maydon ajralish energiyasini hisoblash</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 mb-6">
            <h3 className="text-yellow-400 font-bold mb-3">Misol: [Ti(H₂O)₆]³⁺</h3>
            <ul className="text-purple-200 space-y-2 text-sm">
              <li>• d¹ konfiguratsiya, yagona elektron t₂g → eg o&apos;tadi</li>
              <li>• λ<sub>max</sub> = 510 nm (yutilish maksimumi)</li>
              <li>• Δo = h·c/λ = (6.626·10⁻³⁴)(2.998·10⁸)/(510·10⁻⁹)</li>
              <li>• <strong>Δo = 3.90·10⁻¹⁹ J = 235 kJ/mol</strong></li>
            </ul>
          </div>
          
          <p className="text-purple-200 text-sm">
            Topilgan Δo qiymati <strong className="text-yellow-400">spektrokimyoviy qatordagi</strong> ligand kuchiga mos keladi. 
            H₂O — o&apos;rtacha kuchsiz ligand (Δo = 170-240 kJ/mol).
          </p>
        </div>

        {/* 6. MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Kompleks birikmalarda UB-Vis misollar</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th><th className="py-3 px-4 text-purple-300">λ<sub>max</sub> (nm)</th><th className="py-3 px-4 text-purple-300">Rangi</th><th className="py-3 px-4 text-purple-300">O&apos;tish turi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Ti(H₂O)₆]³⁺", "510", "Binafsha-qizg&apos;ish", "d-d"],
                  ["[Cu(H₂O)₆]²⁺", "810", "Havorang", "d-d"],
                  ["[Co(H₂O)₆]²⁺", "515", "Pushti", "d-d"],
                  ["[Fe(CN)₆]³⁻", "420", "Qizil", "LMCT"],
                  ["[MnO₄]⁻", "528", "Binafsha", "LMCT"],
                  ["[Co(NH₃)₆]³⁺", "440", "Sariq", "d-d"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    {r.map((c, j) => (
                      <td key={j} className={`py-3 px-4 ${j===0 ? "font-mono text-purple-400" : ""} ${j===2 ? "font-semibold" : ""} text-sm`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>UB-Vis — <strong className="text-yellow-400">komplekslarning rangini tushuntiruvchi</strong> eng muhim usul</li>
            <li>d-d o&apos;tishlar orqali <strong>Δo qiymati</strong> aniqlanadi</li>
            <li>Beer-Lambert qonuni: <strong>A = ε·c·l</strong></li>
            <li>Tanlash qoidalari o&apos;tish ehtimolini belgilaydi</li>
            <li>LMCT/MLCT — kuchli yutilish, d-d — kuchsiz yutilish</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Tahlil usullari</Link>
          <Link href="/ilmiy/tahlil/iq" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">IQ spektroskopiya →</Link>
        </div>

      </section>
    </main>
  )
}