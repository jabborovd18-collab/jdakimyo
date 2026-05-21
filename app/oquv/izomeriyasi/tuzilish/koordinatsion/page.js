import Link from "next/link"

export default function KoordinatsionIzomeriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/izomeriyasi/tuzilish" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🔄 Koordinatsion izomeriya</h1>
          <p className="text-purple-400 text-sm">Kation va anion komplekslar o'zaro ligandlarini almashganda kuzatiladi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 3D ICONKA */}
        <div className="text-center">
          <Link href="/oquv/izomeriyasi/tuzilish/koordinatsion/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-purple-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left">
              <div>3D modelni ko'rish</div>
              <div className="text-sm font-normal text-purple-200">[Cr(NH₃)₆][Fe(CN)₆] vs [Fe(NH₃)₆][Cr(CN)₆]</div>
            </div>
          </Link>
        </div>

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Koordinatsion izomeriya haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Koordinatsion izomeriya</strong> — kation va anion komplekslar 
              <strong className="text-yellow-400"> o'zaro bir yoki bir nechta ligandlarini almashganda</strong> kuzatiladi.
              Ham kation, ham anion kompleks tutgan tuzlarda uchraydi. Ligandlar almashinuvi natijasida 
              markaziy atomlar o'z ligandlarini almashtiradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday hosil bo'ladi?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Birikmada <strong>ham kation, ham anion kompleks</strong> mavjud</li>
                <li>• Ikkala kompleks <strong>har xil metall</strong> yoki <strong>har xil ligand</strong> tutadi</li>
                <li>• Metallar <strong>ligandlarini almashtiradi</strong></li>
                <li>• Natijada <strong>yangi juftlik</strong> hosil bo'ladi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday farqlanadi?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Rangi:</strong> metall-ligand o'zgarishi bilan o'zgaradi</li>
                <li>• <strong>Kimyoviy xossalari:</strong> har xil reaksiyalar</li>
                <li>• <strong>Spektroskopiya:</strong> UB-Vis, IQ</li>
                <li>• <strong>Eruvchanlik:</strong> farq qilishi mumkin</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. KLASSIK MISOL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Klassik misol</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-center text-lg">
              <span className="font-mono text-yellow-400">[Cr(NH₃)₆][Fe(CN)₆]</span> 
              &nbsp;va&nbsp; 
              <span className="font-mono text-yellow-400">[Fe(NH₃)₆][Cr(CN)₆]</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-3">Izomer 1</h3>
              <p className="font-mono text-yellow-400 text-lg mb-3">[Cr(NH₃)₆][Fe(CN)₆]</p>
              <p className="text-purple-200 mb-4"><strong>geksaamminxrom(III) geksasiyanoferrat(III)</strong></p>
              
              <div className="bg-purple-900/50 rounded-lg p-4 space-y-2">
                <p className="text-purple-200 text-sm"><strong>Kation kompleks:</strong> <span className="text-blue-400">[Cr(NH₃)₆]³⁺</span></p>
                <p className="text-purple-200 text-sm"><strong>Anion kompleks:</strong> <span className="text-yellow-400">[Fe(CN)₆]³⁻</span></p>
                <p className="text-purple-200 text-sm"><strong>Cr:</strong> NH₃ ligandlar bilan</p>
                <p className="text-purple-200 text-sm"><strong>Fe:</strong> CN⁻ ligandlar bilan</p>
              </div>
            </div>

            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-3">Izomer 2</h3>
              <p className="font-mono text-yellow-400 text-lg mb-3">[Fe(NH₃)₆][Cr(CN)₆]</p>
              <p className="text-purple-200 mb-4"><strong>geksaammintemir(III) geksasiyanoxromat(III)</strong></p>
              
              <div className="bg-purple-900/50 rounded-lg p-4 space-y-2">
                <p className="text-purple-200 text-sm"><strong>Kation kompleks:</strong> <span className="text-purple-400">[Fe(NH₃)₆]³⁺</span></p>
                <p className="text-purple-200 text-sm"><strong>Anion kompleks:</strong> <span className="text-yellow-400">[Cr(CN)₆]³⁻</span></p>
                <p className="text-purple-200 text-sm"><strong>Fe:</strong> NH₃ ligandlar bilan</p>
                <p className="text-purple-200 text-sm"><strong>Cr:</strong> CN⁻ ligandlar bilan</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-4 mt-4 text-center">
            <p className="text-yellow-300 text-sm">
              <strong>💡 Almashinuv:</strong> Cr³⁺ va Fe³⁺ o'z ligandlarini (NH₃ ↔ CN⁻) almashtiradi!
            </p>
          </div>
        </div>

        {/* 3. BOSHQA MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Boshqa misollar</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">[Pt(NH₃)₄][CuCl₄] va [Cu(NH₃)₄][PtCl₄]</h3>
              <p className="text-purple-200 text-sm">
                Pt²⁺ va Cu²⁺ NH₃ va Cl⁻ ligandlarini almashtiradi. Har ikkala metall ham kvadrat-planar komplekslar hosil qiladi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">[Co(NH₃)₆][Cr(CN)₆] va [Cr(NH₃)₆][Co(CN)₆]</h3>
              <p className="text-purple-200 text-sm">
                Co³⁺ va Cr³⁺ o'rtasida ligand almashinuvi. Ikkala metall ham oktaedrik komplekslar hosil qiladi.
              </p>
            </div>
          </div>
        </div>

        {/* 4. XULOSA */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Koordinatsion izomeriya — <strong className="text-yellow-400">kation va anion komplekslar ligand almashadi</strong></li>
            <li>Ikkala metall <strong>har xil</strong> bo'lishi kerak</li>
            <li>Eng mashhur: <strong>[Cr(NH₃)₆][Fe(CN)₆] va [Fe(NH₃)₆][Cr(CN)₆]</strong></li>
            <li>Metallar o'z ligandlarini (NH₃ ↔ CN⁻) almashtiradi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish/boglanish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Bog'lanish izomeriyasi</Link>
          <Link href="/oquv/izomeriyasi/tuzilish/boshqa" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Qolgan turlari →</Link>
        </div>

      </section>
    </main>
  )
}