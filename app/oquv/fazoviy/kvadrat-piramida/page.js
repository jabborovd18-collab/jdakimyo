import Link from "next/link"

export default function KvadratPiramida() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🏛️ Kvadrat piramida geometriya</h1>
          <p className="text-purple-400 text-sm">KS = 5 • sp³d gibridlanish • Valent burchak: ~90° • Simmetriya: C₄v</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 3D ICONKA */}
        <div className="text-center">
          <Link href="/oquv/fazoviy/kvadrat-piramida/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-red-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-red-200">[VO(acac)₂] — interaktiv</div></div>
          </Link>
        </div>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Koordinatsion son:</strong> 5</li>
                <li>• <strong>Gibridlanish:</strong> sp³d</li>
                <li>• <strong>Valent burchak:</strong> ~90° (bazal-bazal va apikal-bazal)</li>
                <li>• <strong>Simmetriya:</strong> C₄v</li>
                <li>• <strong>Ligandlar:</strong> 4 ta bazal (kvadrat asosda) + 1 ta apikal (uchida)</li>
                <li>• <strong>Strukturasi:</strong> Piramida — kvadrat asos va bitta uch</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Gibridlanish sxemasi</h3>
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-purple-200 mb-2">s + p<sub>x</sub> + p<sub>y</sub> + p<sub>z</sub> + d<sub>z²</sub> → <strong className="text-yellow-400">5 ta sp³d gibrid orbital</strong></p>
              </div>
              <p className="text-purple-300 text-sm mt-3">
                4 tasi kvadrat asos uchlariga (~90°), 1 tasi piramida uchiga yo'nalgan.
              </p>
            </div>
          </div>
        </div>

        {/* 2. XARAKTERLI IONLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Xarakterli ionlar va misollar</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Kvadrat piramida KS = 5 uchun trigonal bipiramida bilan <strong className="text-yellow-400">raqobatlashuvchi</strong> shakldir. 
            Ko'pchilik Cu²⁺ (d⁹) komplekslari <strong className="text-yellow-400">Yan-Teller effekti</strong> tufayli cho'zilgan oktaedrdan 
            bitta ligand yo'qolishi natijasida kvadrat piramida shaklini oladi.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">Formula</th><th className="py-3 px-4 text-purple-300">Nomi</th><th className="py-3 px-4 text-purple-300">Markaziy ion</th><th className="py-3 px-4 text-purple-300">Xususiyati</th></tr></thead>
              <tbody className="text-purple-200">
                {[
                  { f: "[VO(acac)₂]", n: "oksovanadiy(IV) atsetilasetonat", ion: "V⁴⁺ (d¹)", x: "Vanadil kompleksi, O apikalda" },
                  { f: "[Ni(CN)₅]³⁻", n: "pentasiyanonikkolat(II) ioni", ion: "Ni²⁺ (d⁸)", x: "Kvadrat piramida yoki TBP" },
                  { f: "[Cu(NH₃)₄(H₂O)]²⁺", n: "akvatetraamminmis(II) ioni", ion: "Cu²⁺ (d⁹)", x: "Yan-Teller effekti natijasi" },
                  { f: "[SbPh₅]", n: "pentafenilsurma(V)", ion: "Sb⁵⁺ (d⁰)", x: "Organik metall kompleks" },
                  { f: "[MnCl₅]²⁻", n: "pentaxloromanganat(II)", ion: "Mn²⁺ (d⁵)", x: "Kvadrat piramida shakli" },
                ].map((m, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-red-400">{m.f}</td><td className="py-3 px-4 text-sm">{m.n}</td><td className="py-3 px-4 text-yellow-400">{m.ion}</td><td className="py-3 px-4 text-sm">{m.x}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. VANADIL KOMPLEKSI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Vanadil kompleksi [VO(acac)₂]</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">[VO(acac)₂]</strong> — eng mashhur kvadrat piramida kompleks. 
            V=O guruhi (vanadil) apikal pozitsiyada joylashgan. To'rtta kislorod atomi (atsetilasetonat ligandlaridan) 
            kvadrat asosni tashkil qiladi. Vanadiy atomi kvadrat asos markazidan biroz yuqorida joylashgan.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Tarkibi</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Markaziy atom: <strong>V⁴⁺</strong></li>
                <li>• Apikal ligand: <strong>O²⁻ (oksido)</strong></li>
                <li>• Bazal ligandlar: <strong>4 ta O (acac dan)</strong></li>
                <li>• Koordinatsion son: <strong>5</strong></li>
                <li>• V=O bog' uzunligi: <strong>~1.6 Å</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xossalari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Ko'k-yashil kristall modda</li>
                <li>• Organik erituvchilarda eriydi</li>
                <li>• Katalizator sifatida ishlatiladi</li>
                <li>• d¹ konfiguratsiya — paramagnit</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. BERRI PSEVDOROTASIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Trigonal bipiramida bilan bog'liqligi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">Berri psevdorotasiyasi</strong> orqali kvadrat piramida va trigonal bipiramida 
            bir-biriga o'tib turadi. Energetik to'siq juda kichik (~5-10 kJ/mol). Apikal ligand ekvatorialga, 
            ekvatorial ligand esa aksialga aylanadi.
          </p>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4 text-center">
            <p className="text-yellow-300 font-bold">Kvadrat piramida ⇄ Trigonal bipiramida</p>
            <p className="text-purple-300 text-sm mt-2">Berri psevdorotasiyasi orqali</p>
          </div>
        </div>

        {/* 5. YAN-TELLER EFFEKTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Yan-Teller effekti va kvadrat piramida</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Cu²⁺ (d⁹) oktaedrik komplekslarda Yan-Teller buzilishi natijasida 2 ta aksial bog' uzayadi. 
            Bu esa amalda <strong className="text-yellow-400">kvadrat piramida</strong> yoki hatto tekis kvadrat shaklga o'tishga olib keladi.
          </p>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="font-mono text-purple-200 text-center">
              [Cu(H₂O)₆]²⁺ → [Cu(H₂O)₄]²⁺ + 2H₂O
            </p>
            <p className="text-purple-300 text-sm text-center mt-2">Oktaedr → Kvadrat piramida → Tekis kvadrat</p>
          </div>
        </div>

        {/* 6. XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Kvadrat piramida — <strong className="text-yellow-400">KS = 5, sp³d gibridlanish</strong></li>
            <li>4 ta ligand <strong>bazal tekislikda</strong> (kvadrat asos), 1 ta <strong>apikalda</strong></li>
            <li>Simmetriya: <strong>C₄v</strong></li>
            <li>Trigonal bipiramida bilan <strong>Berri psevdorotasiyasi</strong></li>
            <li>Cu²⁺ (d⁹) komplekslarida <strong>Yan-Teller effekti</strong> tufayli keng tarqalgan</li>
            <li>Muhim misol: <strong>[VO(acac)₂]</strong> — vanadil kompleksi</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/trigonal-bipiramida" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Trigonal bipiramida</Link>
          <Link href="/oquv/fazoviy/oktaedrik" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Oktaedrik →</Link>
        </div>

      </section>
    </main>
  )
}