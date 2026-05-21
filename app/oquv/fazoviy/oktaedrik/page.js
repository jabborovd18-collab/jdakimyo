import Link from "next/link"

export default function Oktaedrik() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">💎 Oktaedrik geometriya</h1>
          <p className="text-purple-400 text-sm">KS = 6 • d²sp³ yoki sp³d² • 90° • Oh • ENG KO'P TARQALGAN GEOMETRIYA</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="text-center">
          <Link href="/oquv/fazoviy/oktaedrik/3d" className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-purple-600/30">
            <span className="text-4xl">💎</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-purple-200">[Co(NH₃)₆]³⁺ — interaktiv</div></div>
          </Link>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Oktaedrik komplekslar</strong> — markaziy atom oktaedr markazida, 
              6 ta ligand esa oktaedrning 6 ta uchida joylashgan komplekslardir. Bu 
              <strong className="text-yellow-400"> eng keng tarqalgan</strong> kompleks birikmalar geometriyasi hisoblanadi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Koordinatsion son:</strong> 6</li>
                <li>• <strong>Gibridlanish:</strong> d²sp³ (kuchli maydon) yoki sp³d² (kuchsiz)</li>
                <li>• <strong>Valent burchak:</strong> 90°</li>
                <li>• <strong>Simmetriya:</strong> Oh</li>
                <li>• <strong>Yuzlar:</strong> 8 ta uchburchak</li>
                <li>• <strong>Qirralar:</strong> 12 ta</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Gibridlanish</h3>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-green-400 font-bold mb-1">d²sp³ (kuchli maydon):</p>
                <p className="text-purple-300 text-sm">d<sub>z²</sub>+d<sub>x²−y²</sub>+s+p<sub>x</sub>+p<sub>y</sub>+p<sub>z</sub></p>
                <p className="text-yellow-400 font-bold mt-3 mb-1">sp³d² (kuchsiz maydon):</p>
                <p className="text-purple-300 text-sm">s+p<sub>x</sub>+p<sub>y</sub>+p<sub>z</sub>+d<sub>z²</sub>+d<sub>x²−y²</sub></p>
              </div>
              <p className="text-purple-300 text-sm mt-3">d²sp³ — quyi spin (diamagnit), sp³d² — yuqori spin (paramagnit)</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eng muhim oktaedrik komplekslar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Formula</th><th className="py-3 px-4 text-purple-300">Nomi</th>
                <th className="py-3 px-4 text-purple-300">dⁿ</th><th className="py-3 px-4 text-purple-300">Spin</th>
                <th className="py-3 px-4 text-purple-300">Rangi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-3 px-4 font-mono text-purple-400">[Cr(H₂O)₆]³⁺</td>
                  <td className="py-3 px-4">geksaakvaxrom(III)</td><td className="py-3 px-4">d³</td>
                  <td className="py-3 px-4">—</td><td className="py-3 px-4 text-purple-300 font-semibold">Binafsha</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-3 px-4 font-mono text-purple-400">[Co(NH₃)₆]³⁺</td>
                  <td className="py-3 px-4">geksaamminkobalt(III)</td><td className="py-3 px-4">d⁶</td>
                  <td className="py-3 px-4">Quyi</td><td className="py-3 px-4 text-yellow-400 font-semibold">Sariq</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-3 px-4 font-mono text-purple-400">[Fe(CN)₆]⁴⁻</td>
                  <td className="py-3 px-4">geksasiyanoferrat(II)</td><td className="py-3 px-4">d⁶</td>
                  <td className="py-3 px-4">Quyi</td><td className="py-3 px-4 text-yellow-400 font-semibold">Sariq</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-3 px-4 font-mono text-purple-400">[Fe(H₂O)₆]²⁺</td>
                  <td className="py-3 px-4">geksaakvatemir(II)</td><td className="py-3 px-4">d⁶</td>
                  <td className="py-3 px-4">Yuqori</td><td className="py-3 px-4 text-green-400 font-semibold">Och yashil</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-3 px-4 font-mono text-purple-400">[Ni(H₂O)₆]²⁺</td>
                  <td className="py-3 px-4">geksaakvanikel(II)</td><td className="py-3 px-4">d⁸</td>
                  <td className="py-3 px-4">—</td><td className="py-3 px-4 text-green-400 font-semibold">Yashil</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-3 px-4 font-mono text-purple-400">[Cu(H₂O)₆]²⁺</td>
                  <td className="py-3 px-4">geksaakvamis(II)</td><td className="py-3 px-4">d⁹</td>
                  <td className="py-3 px-4">—</td><td className="py-3 px-4 text-cyan-400 font-semibold">Havorang</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Kristall maydon nazariyasi</h2>
          <p className="text-purple-200 mb-6">Oktaedrik maydonda beshta d-orbital ikki guruhga ajraladi:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 text-center">
              <h3 className="text-green-400 font-bold text-xl mb-3">t₂g (3 ta)</h3>
              <p className="text-purple-200 text-lg">d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub></p>
              <p className="text-green-300 font-bold mt-2">−0.4 Δo (stabillashgan)</p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 text-center">
              <h3 className="text-red-400 font-bold text-xl mb-3">eg (2 ta)</h3>
              <p className="text-purple-200 text-lg">d<sub>z²</sub>, d<sub>x²−y²</sub></p>
              <p className="text-red-300 font-bold mt-2">+0.6 Δo (destabillashgan)</p>
            </div>
          </div>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">Spektrokimyoviy qator:</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              I⁻ &lt; Br⁻ &lt; Cl⁻ &lt; F⁻ &lt; <strong className="text-yellow-400">H₂O</strong> &lt; <strong className="text-yellow-400">NH₃</strong> &lt; en &lt; <strong className="text-green-400">CN⁻</strong> &lt; <strong className="text-green-400">CO</strong>
            </p>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧲 Yuqori spin vs Quyi spin</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Yuqori spinli</h3>
              <p className="text-purple-200 text-sm">Δo &lt; P. Ko'proq toq elektronlar. Paramagnit. Misol: [Fe(H₂O)₆]²⁺</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Quyi spinli</h3>
              <p className="text-purple-200 text-sm">Δo &gt; P. Kamroq toq elektronlar. Diamagnit. Misol: [Fe(CN)₆]⁴⁻</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Izomeriya</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">Sis-trans</h3>
              <p className="text-purple-200 text-sm">MA₄B₂ tipi. Sisplatin eng mashhur misol.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold mb-2">Fac-mer</h3>
              <p className="text-purple-200 text-sm">MA₃B₃ tipi. [Co(NH₃)₃Cl₃] klassik misol.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Optik</h3>
              <p className="text-purple-200 text-sm">Xiral komplekslar. Enantiomerlar qutblangan nurni buradi.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌍 Amaliy ahamiyati</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-1">🩸 Gemoglobin</h3>
              <p className="text-purple-200 text-sm">Temir(II) oktaedrik kompleksi — O₂ tashuvchi.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-1">🌿 Xlorofill</h3>
              <p className="text-purple-200 text-sm">Magniy(II) oktaedrik kompleksi — fotosintez.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-1">💊 Sisplatin</h3>
              <p className="text-purple-200 text-sm">Saraton kasalliklarini davolashda.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-1">🏭 Katalizatorlar</h3>
              <p className="text-purple-200 text-sm">Sanoat katalizatorlari.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Oktaedrik — <strong className="text-yellow-400">eng ko'p tarqalgan</strong> geometriya</li>
            <li>Gibridlanish: <strong>d²sp³</strong> (quyi spin) yoki <strong>sp³d²</strong> (yuqori spin)</li>
            <li>d-orbitallar: <strong>t₂g</strong> (−0.4Δo) va <strong>eg</strong> (+0.6Δo)</li>
            <li><strong>Sis-trans</strong> va <strong>fac-mer</strong> geometrik izomeriya</li>
            <li>Biologik ahamiyati: <strong>gemoglobin, xlorofill</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/kvadrat-piramida" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Kvadrat piramida</Link>
          <Link href="/oquv/fazoviy/trigonal-prizma" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Trigonal prizma →</Link>
        </div>

      </section>
    </main>
  )
}