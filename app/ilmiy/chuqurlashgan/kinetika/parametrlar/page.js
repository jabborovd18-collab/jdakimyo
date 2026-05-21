import Link from "next/link"

export default function Parametrlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kinetika" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Kinetika
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🧮 Kinetik parametrlarni aniqlash</h1>
          <p className="text-purple-400 text-sm">Tezlik konstantasi (k) • E<sub>a</sub> • Eyring tenglamasi • ΔH<sup>‡</sup>, ΔS<sup>‡</sup>, ΔG<sup>‡</sup> • Stopped-flow</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kinetik parametrlar — reaksiya mexanizmining kaliti</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Kinetik parametrlar</strong> — reaksiya tezligini miqdoriy 
              xarakterlovchi kattaliklar. Ular orqali <strong>reaksiya mexanizmini aniqlash, aktivatsiya 
              energiyasini hisoblash va o&apos;tish holati tuzilishini</strong> tushunish mumkin.
              Asosiy parametrlar: <strong>tezlik konstantasi (k), aktivatsiya energiyasi (E<sub>a</sub>), 
              aktivatsiya entalpiyasi (ΔH<sup>‡</sup>), aktivatsiya entropiyasi (ΔS<sup>‡</sup>) va 
              aktivatsiya Gibbs energiyasi (ΔG<sup>‡</sup>)</strong>.
              Bu parametrlar <strong>Arrenius va Eyring tenglamalari</strong> orqali eksperimental 
              ma&apos;lumotlardan hisoblanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">Arrenius parametrlari</h3>
              <p className="text-purple-200 text-sm">k = A·exp(−E<sub>a</sub>/RT)</p>
              <p className="text-purple-400 text-xs mt-1">A — eksponensial omil, E<sub>a</sub> — aktivatsiya energiyasi</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">Eyring parametrlari</h3>
              <p className="text-purple-200 text-sm">k = (k<sub>B</sub>T/h)·exp(−ΔG<sup>‡</sup>/RT)</p>
              <p className="text-purple-400 text-xs mt-1">ΔH<sup>‡</sup>, ΔS<sup>‡</sup>, ΔG<sup>‡</sup> — aktivatsiya parametrlari</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">Hajm parametri</h3>
              <p className="text-purple-200 text-sm">ΔV<sup>‡</sup> = −RT(∂lnk/∂P)<sub>T</sub></p>
              <p className="text-purple-400 text-xs mt-1">Aktivatsiya hajmi — mexanizm diagnostikasi</p>
            </div>
          </div>
        </div>

        {/* ── 2. TEZLIK KONSTANTASI VA REAKSIYA TARTIBI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Tezlik konstantasi (k) va reaksiya tartibini aniqlash</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Tezlik konstantasi (k)</strong> — reaksiya tezligining 
              konsentratsiyaga bog&apos;liq bo&apos;lmagan qismi. Birligi reaksiya tartibiga bog&apos;liq.
              Kompleks birikmalar uchun ligand almashinish reaksiyalari ko&apos;pincha 
              <strong>psevdo-birinchi tartibli</strong> sharoitda o&apos;rganiladi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Tartib</th>
                <th className="py-3 px-4 text-purple-300">Tezlik qonuni</th>
                <th className="py-3 px-4 text-purple-300">k birligi</th>
                <th className="py-3 px-4 text-purple-300">Integral shakl</th>
                <th className="py-3 px-4 text-purple-300">t<sub>½</sub></th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["0-tartib", "v = k", "mol·L⁻¹·s⁻¹", "[A] = [A]₀ − kt", "t<sub>½</sub> = [A]₀/2k"],
                  ["1-tartib", "v = k[A]", "s⁻¹", "ln[A] = ln[A]₀ − kt", "t<sub>½</sub> = ln2/k"],
                  ["2-tartib", "v = k[A][B]", "L·mol⁻¹·s⁻¹", "1/[A] = 1/[A]₀ + kt", "t<sub>½</sub> = 1/k[A]₀"],
                  ["Psevdo-1-tartib", "v = k<sub>kuz</sub>[A]", "s⁻¹", "ln[A] = ln[A]₀ − k<sub>kuz</sub>t", "t<sub>½</sub> = ln2/k<sub>kuz</sub>"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: r[3] }}></td>
                    <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: r[4] }}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Psevdo-birinchi tartibli sharoit</h3>
            <p className="text-purple-200 text-sm">
              Ligand almashinish reaksiyalarida kiruvchi ligand Y katta ortiqcha miqdorda olinadi ([Y] &gt;&gt; [ML₅X]).
              Y konsentratsiyasi deyarli o&apos;zgarmaydi — uni doimiy deb hisoblash mumkin.
              <strong>k<sub>kuz</sub> = k[Y]</strong> (agar reaksiya Y ga nisbatan birinchi tartibli bo&apos;lsa).
              Turli [Y] larda k<sub>kuz</sub> o&apos;lchab, haqiqiy tartib va k aniqlanadi.
            </p>
          </div>
        </div>

        {/* ── 3. ARRENIUS TENGLAMASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📈 Arrenius tenglamasi — E<sub>a</sub> va A ni aniqlash</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Arrenius tenglamasi</strong> — tezlik konstantasining 
              haroratga bog&apos;liqligini ifodalaydi. Turli haroratlarda k o&apos;lchab, 
              <strong>ln k vs 1/T</strong> grafigidan E<sub>a</sub> va A aniqlanadi.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-xl">
              k = A·exp(−E<sub>a</sub>/RT)
            </p>
            <p className="text-purple-300 text-sm mt-2">
              <strong>Chiziqli shakl:</strong> ln k = ln A − E<sub>a</sub>/RT<br/>
              Nishab = −E<sub>a</sub>/R, kesishish = ln A
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks / Reaksiya</th>
                <th className="py-3 px-4 text-purple-300">E<sub>a</sub> (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">A (s⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">Mexanizm</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Ni(H₂O)₆]²⁺ + H₂O*", "57", "~10¹²", "I<sub>d</sub>"],
                  ["[Co(H₂O)₆]²⁺ + H₂O*", "47", "~10¹³", "I<sub>d</sub>"],
                  ["[Cr(H₂O)₆]³⁺ + H₂O*", "110", "~10¹³", "I<sub>a</sub>"],
                  ["[Co(NH₃)₅Cl]²⁺ + H₂O", "98", "~10¹⁴", "D"],
                  ["[PtCl₄]²⁻ + NH₃", "65", "~10⁸", "A"],
                  ["[Fe(H₂O)₆]²⁺/³⁺ almashinuv", "32", "~10⁵", "Tashqi sfera"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4 text-red-400">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 text-green-400">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">E<sub>a</sub> ning fizik ma&apos;nosi</h3>
            <p className="text-purple-200 text-sm">
              <strong>E<sub>a</sub></strong> — reagent molekulalarining reaksiyaga kirishishi uchun 
              yengib o&apos;tishi kerak bo&apos;lgan <strong>energetik to&apos;siq</strong>.
              E<sub>a</sub> qancha katta bo&apos;lsa, reaksiya shuncha sekin boradi.<br/>
              <strong>A (eksponensial omil)</strong> — to&apos;qnashuvlar soni va orientatsion omil bilan bog&apos;liq.
              Odatda A ≈ 10¹⁰−10¹³ s⁻¹ (birinchi tartibli reaksiyalar uchun).
              A qiymati ΔS<sup>‡</sup> haqida ma&apos;lumot beradi.
            </p>
          </div>
        </div>

        {/* ── 4. EYRING TENGLAMASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Eyring tenglamasi — o&apos;tish holati nazariyasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Eyring tenglamasi</strong> — o&apos;tish holati nazariyasiga asoslangan.
              Arrenius tenglamasidan farqli ravishda, <strong>termodinamik ma&apos;noga ega parametrlar</strong> 
              (ΔH<sup>‡</sup>, ΔS<sup>‡</sup>, ΔG<sup>‡</sup>) beradi. Bu parametrlar orqali 
              <strong>o&apos;tish holatining tuzilishi va mexanizm</strong> haqida xulosa chiqarish mumkin.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-xl">
              k = (k<sub>B</sub>T/h)·exp(ΔS<sup>‡</sup>/R)·exp(−ΔH<sup>‡</sup>/RT)
            </p>
            <p className="text-purple-300 text-sm mt-2">
              <strong>Chiziqli shakl:</strong> ln(k/T) = ln(k<sub>B</sub>/h) + ΔS<sup>‡</sup>/R − ΔH<sup>‡</sup>/RT<br/>
              Nishab = −ΔH<sup>‡</sup>/R, kesishish = ln(k<sub>B</sub>/h) + ΔS<sup>‡</sup>/R
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">ΔH<sup>‡</sup> (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">ΔS<sup>‡</sup> (J/mol·K)</th>
                <th className="py-3 px-4 text-purple-300">ΔG<sup>‡</sup> (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">Mexanizm</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Ni(H₂O)₆]²⁺ almashinuvi", "54", "+7", "52", "I<sub>d</sub>"],
                  ["[Co(H₂O)₆]²⁺ almashinuvi", "44", "+10", "41", "I<sub>d</sub>"],
                  ["[Cr(H₂O)₆]³⁺ almashinuvi", "106", "−15", "110", "I<sub>a</sub>"],
                  ["[Co(NH₃)₅Cl]²⁺ + H₂O", "94", "+30", "85", "D"],
                  ["[PtCl₄]²⁻ + NH₃", "60", "−20", "66", "A"],
                  ["[Fe(H₂O)₆]²⁺/³⁺ almashinuv", "28", "−25", "35", "Tashqi sfera"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4 text-red-400">{r[1]}</td>
                    <td className="py-3 px-4">
                      {r[2].startsWith("+") || parseFloat(r[2]) > 0 
                        ? <span className="text-green-400">{r[2]}</span> 
                        : <span className="text-blue-400">{r[2]}</span>}
                    </td>
                    <td className="py-3 px-4 text-cyan-400">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-cyan-400 font-bold mb-2">ΔS<sup>‡</sup> — mexanizm diagnostikasi</h3>
            <p className="text-purple-200 text-sm">
              <strong>ΔS<sup>‡</sup> &gt; 0 (musbat):</strong> o&apos;tish holatida tartibsizlik ortadi — 
              bog&apos; uzilishi dominant. D yoki I<sub>d</sub> mexanizm.<br/>
              <strong>ΔS<sup>‡</sup> &lt; 0 (manfiy):</strong> o&apos;tish holatida tartib ortadi — 
              yangi bog&apos; hosil bo&apos;lishi dominant. A yoki I<sub>a</sub> mexanizm.<br/>
              <strong>ΔS<sup>‡</sup> ≈ 0:</strong> sof almashinish (I) mexanizm.
            </p>
          </div>
        </div>

        {/* ── 5. EKSPERIMENTAL USULLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Eksperimental kinetik usullar</h2>
          
          <div className="space-y-4">
            {[
              {
                usul: "Stopped-flow (to&apos;xtatilgan oqim)",
                tavsif: "Ikkita eritma juda tez aralashtiriladi va oqim to&apos;xtatiladi. Spektrofotometrik detektor yordamida absorbansning vaqtga bog&apos;liqligi qayd etiladi. O&apos;lik vaqt: ~1 ms. Yarim yemirilish davri 1 ms dan katta bo&apos;lgan reaksiyalar uchun.",
                misol: "[Ni(H₂O)₆]²⁺ + en → [Ni(en)(H₂O)₄]²⁺ + 2H₂O. k ≈ 10⁵ M⁻¹s⁻¹, stopped-flow bilan o&apos;lchangan.",
              },
              {
                usul: "T-jump (harorat sakrashi)",
                tavsif: "Eritma orqali kuchli elektr toki o&apos;tkaziladi — harorat bir necha mikrosoniyada 5−10°C ga ko&apos;tariladi. Muvozanat siljiydi va yangi muvozanatga qaytish tezligi kuzatiladi. O&apos;lik vaqt: ~1 μs. Tez reaksiyalar uchun.",
                misol: "[Fe(H₂O)₆]²⁺/³⁺ elektron almashinuvi — t<sub>½</sub> ~10⁻³ s, T-jump bilan o&apos;lchangan.",
              },
              {
                usul: "NMR — chiziq kengayishi",
                tavsif: "Ligand almashinuvi tezligi NMR spektridagi chiziqlarning kengayishidan aniqlanadi. Tez almashinuvda chiziqlar kengayadi, juda tez almashinuvda esa o&apos;rtacha signal kuzatiladi. O&apos;rtacha tezliklar uchun (k ≈ 10¹−10⁵ s⁻¹).",
                misol: "[Al(H₂O)₆]³⁺ + DMSO — ¹H NMR chiziq kengayishi orqali k ≈ 10² s⁻¹ aniqlangan.",
              },
              {
                usul: "Izotop almashinuvi",
                tavsif: "Radioaktiv yoki barqaror izotop bilan belgilangan ligandning almashinish tezligi o&apos;lchanadi. Juda sekin reaksiyalar uchun (t<sub>½</sub> soatlab, kunlab). Inert komplekslar ([Cr(H₂O)₆]³⁺, [Co(NH₃)₆]³⁺) uchun asosiy usul.",
                misol: "[Co(NH₃)₆]³⁺ + ¹⁵NH₃ — izotop almashinuvi kunlar davomida kuzatilgan.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.usul}</h3>
                <p className="text-purple-200 text-sm">{r.tavsif}</p>
                <p className="text-purple-400 text-xs mt-1">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Arrenius:</strong> ln k vs 1/T → E<sub>a</sub> va A. E<sub>a</sub> — energetik to&apos;siq</li>
            <li><strong className="text-yellow-400">Eyring:</strong> ln(k/T) vs 1/T → ΔH<sup>‡</sup> va ΔS<sup>‡</sup>. Termodinamik ma&apos;noga ega</li>
            <li><strong className="text-yellow-400">ΔS<sup>‡</sup> diagnostikasi:</strong> musbat → D/I<sub>d</sub>, manfiy → A/I<sub>a</sub></li>
            <li><strong className="text-yellow-400">Psevdo-birinchi tartib:</strong> [Y] &gt;&gt; [ML₅X], k<sub>kuz</sub> = k[Y]</li>
            <li><strong className="text-yellow-400">Eksperimental usullar:</strong> stopped-flow (ms), T-jump (μs), NMR, izotop almashinuvi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kinetika/elektron-kochish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Elektron ko&apos;chish
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kinetika/3d" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold transition-all">
            3D vizualizatsiya →
          </Link>
        </div>

      </section>
    </main>
  )
}