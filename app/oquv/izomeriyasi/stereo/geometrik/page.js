import Link from "next/link"

export default function GeometrikIzomeriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/izomeriyasi/stereo" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">📐 Geometrik izomeriya</h1>
          <p className="text-purple-400 text-sm">Sis-trans • Fac-mer • Tekis kvadrat va oktaedrik komplekslarda</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 3D ICONKA */}
        <div className="text-center">
          <Link href="/oquv/izomeriyasi/stereo/geometrik/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-blue-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left">
              <div>3D modelni ko'rish</div>
              <div className="text-sm font-normal text-blue-200">Sis-trans + Fac-mer • Interaktiv</div>
            </div>
          </Link>
        </div>

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Geometrik izomeriya haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Geometrik izomeriya</strong> — bir xil ligandlar 
              <strong className="text-yellow-400"> fazoda har xil joylashganda</strong> kuzatiladi. 
              Bu stereoizomeriyaning eng muhim turi bo'lib, kompleksning kimyoviy va biologik xossalariga bevosita ta'sir qiladi.
              <strong className="text-yellow-400"> Tetraedrik komplekslarda geometrik izomeriya bo'lmaydi</strong>, chunki barcha 4 ta uch ekvivalent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qaysi komplekslarda bo'ladi?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Tekis kvadrat</strong> (KS=4): MA₂B₂ tipi</li>
                <li>• <strong>Oktaedrik</strong> (KS=6): MA₄B₂ tipi (sis-trans)</li>
                <li>• <strong>Oktaedrik</strong> (KS=6): MA₃B₃ tipi (fac-mer)</li>
                <li>• <strong>Tetraedrikda YO'Q</strong> — 4 ta uch ekvivalent</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nima uchun muhim?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Rang:</strong> sis va trans izomerlar har xil rangda</li>
                <li>• <strong>Biologik faollik:</strong> sisplatin — saraton davosi</li>
                <li>• <strong>Eruvchanlik:</strong> qutbliligi har xil</li>
                <li>• <strong>Reaksion qobiliyat:</strong> har xil reaksiyalarga kirishadi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. SIS-TRANS (TEKIS KVADRAT) */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">◻️ Sis-trans izomeriya (MA₂B₂ — tekis kvadrat)</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong>MA₂B₂</strong> tipidagi tekis kvadrat komplekslarda ikkita bir xil ligand 
            <strong className="text-yellow-400"> yonma-yon</strong> (sis) yoki <strong className="text-yellow-400"> qarama-qarshi</strong> (trans) joylashishi mumkin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4">sis-izomer</h3>
              <p className="text-purple-200 mb-3">
                <strong>Bir xil ligandlar yonma-yon</strong> — 90° burchak ostida
              </p>
              <div className="bg-purple-900/50 rounded-lg p-4 mb-4 text-center">
                <p className="font-mono text-purple-200">
                  Cl — Pt — Cl<br/>
                  &nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>
                  NH₃&nbsp;&nbsp;&nbsp;NH₃
                </p>
              </div>
              
              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-400 font-bold mb-2">⭐ sis-[PtCl₂(NH₃)₂] — SISPLATIN</h4>
                <ul className="text-purple-200 text-sm space-y-1">
                  <li>• <strong>Saraton davosi</strong> — DNK bilan bog'lanadi</li>
                  <li>• 1978 yildan beri qo'llaniladi</li>
                  <li>• Testikulyar, tuxumdon saratonida</li>
                  <li>• Jahon sog'liqni saqlash tashkiloti asosiy dori ro'yxatida</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-orange-400 mb-4">trans-izomer</h3>
              <p className="text-purple-200 mb-3">
                <strong>Bir xil ligandlar qarama-qarshi</strong> — 180° burchak ostida
              </p>
              <div className="bg-purple-900/50 rounded-lg p-4 mb-4 text-center">
                <p className="font-mono text-purple-200">
                  Cl — Pt — NH₃<br/>
                  &nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>
                  NH₃&nbsp;&nbsp;&nbsp;Cl
                </p>
              </div>
              
              <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-red-400 font-bold mb-2">❌ trans-[PtCl₂(NH₃)₂]</h4>
                <ul className="text-purple-200 text-sm space-y-1">
                  <li>• <strong>Biologik faol EMAS</strong></li>
                  <li>• DNK bilan bog'lana olmaydi</li>
                  <li>• Cl⁻ ligandlari qarama-qarshi tomonda</li>
                  <li>• Stereokimyoning hayotiy ahamiyatini ko'rsatadi!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SIS-TRANS (OKTAEDRIK) */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 Sis-trans izomeriya (MA₄B₂ — oktaedrik)</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong>MA₄B₂</strong> tipidagi oktaedrik komplekslarda ham sis-trans izomeriya kuzatiladi.
            Oktaedrda ham ligandlar yonma-yon (sis) yoki qarama-qarshi (trans) joylashishi mumkin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">sis-[CrCl₂(H₂O)₄]⁺</h3>
              <p className="text-purple-200 text-sm">2 ta Cl⁻ yonma-yon (90°). Binafsha rangli.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold mb-2">trans-[CrCl₂(H₂O)₄]⁺</h3>
              <p className="text-purple-200 text-sm">2 ta Cl⁻ qarama-qarshi (180°). Yashil rangli.</p>
            </div>
          </div>
        </div>

        {/* 4. FAC-MER (OKTAEDRIK) */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔷 Fac-mer izomeriya (MA₃B₃ — oktaedrik)</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong>MA₃B₃</strong> tipidagi oktaedrik komplekslarda geometrik izomeriyaning yana bir turi — 
            <strong className="text-yellow-400"> fac-mer izomeriya</strong> kuzatiladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-400 mb-4">fac-izomer (facial)</h3>
              <p className="text-purple-200 mb-3">
                3 ta bir xil ligand oktaedrning <strong className="text-yellow-400">bir yuzida</strong> (uchburchakda) joylashgan.
              </p>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="font-mono text-yellow-400">fac-[Co(NH₃)₃Cl₃]</p>
                <p className="text-purple-300 text-sm mt-2">Barcha 3 ta Cl bir uchburchak yuzda — yonma-yon.</p>
              </div>
            </div>

            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-pink-400 mb-4">mer-izomer (meridional)</h3>
              <p className="text-purple-200 mb-3">
                3 ta bir xil ligand <strong className="text-yellow-400">meridian bo'ylab</strong> (2 tasi qarama-qarshi) joylashgan.
              </p>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="font-mono text-yellow-400">mer-[Co(NH₃)₃Cl₃]</p>
                <p className="text-purple-300 text-sm mt-2">2 ta Cl qarama-qarshi, 1 ta Cl perpendikulyar.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. AMALIY AHAMIYATI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌍 Amaliy ahamiyati</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">💊 Tibbiyot</h3>
              <p className="text-purple-200 text-sm">
                Sisplatin — saraton davosi. Trans-izomer ta'sirsiz. Geometrik izomeriyaning hayotiy ahamiyatini ko'rsatadi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🎨 Rang farqi</h3>
              <p className="text-purple-200 text-sm">
                sis-[CrCl₂(H₂O)₄]⁺ binafsha, trans-izomer yashil. Rang orqali izomerlarni farqlash mumkin.
              </p>
            </div>
          </div>
        </div>

        {/* 6. XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Geometrik izomeriya — <strong className="text-yellow-400">ligandlarning fazoda har xil joylashishi</strong></li>
            <li><strong>Sis-trans:</strong> MA₂B₂ (tekis kvadrat) va MA₄B₂ (oktaedrik)</li>
            <li><strong>Fac-mer:</strong> MA₃B₃ (oktaedrik)</li>
            <li><strong>Tetraedrikda geometrik izomeriya yo'q</strong></li>
            <li><strong>Sisplatin</strong> — eng muhim amaliy misol</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/izomeriyasi/stereo" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Stereoizomeriya</Link>
          <Link href="/oquv/izomeriyasi/stereo/optik" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Optik izomeriya →</Link>
        </div>

      </section>
    </main>
  )
}