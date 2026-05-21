import Link from "next/link"

export default function OptikIzomeriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/izomeriyasi/stereo" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🔮 Optik izomeriya</h1>
          <p className="text-purple-400 text-sm">Enantiomerlar • Xirallik • Qutblangan nur burilishi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 3D ICONKA */}
        <div className="text-center">
          <Link href="/oquv/izomeriyasi/stereo/optik/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-green-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left">
              <div>3D modelni ko'rish</div>
              <div className="text-sm font-normal text-green-200">Λ va Δ enantiomerlar — [Co(en)₂Cl₂]⁺</div>
            </div>
          </Link>
        </div>

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Optik izomeriya haqida</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Optik izomeriya</strong> — molekula oynadagi aksi bilan 
              <strong className="text-yellow-400"> ustma-ust tushmaganda</strong> kuzatiladi. Bunday molekulalar 
              <strong className="text-yellow-400"> xiral</strong> deyiladi va ular <strong className="text-yellow-400">enantiomerlar</strong> (optik izomerlar) holida uchraydi.
              Enantiomerlar bir-birining oynadagi aksi bo'lib, qo'lqopning chap va o'ng qo'l kabi farq qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xirallik shartlari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Molekulada <strong>simmetriya markazi</strong> bo'lmasligi kerak</li>
                <li>• Molekulada <strong>simmetriya tekisligi</strong> bo'lmasligi kerak</li>
                <li>• Oynadagi aksi bilan <strong>ustma-ust tushmasligi</strong> kerak</li>
                <li>• Ko'pincha <strong>bidentat ligandlar</strong> xirallik keltirib chiqaradi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Enantiomerlar xossalari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Fizik xossalari:</strong> bir xil (T_suyuq, T_qayn, eruvchanlik)</li>
                <li>• <strong>Kimyoviy xossalari:</strong> oddiy reagentlar bilan bir xil</li>
                <li>• <strong>Optik faollik:</strong> qutblangan nurni qarama-qarshi tomonga buradi</li>
                <li>• <strong>Biologik faollik:</strong> har xil bo'lishi mumkin!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. QUTBLANGAN NUR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Qutblangan nur va polyarimetr</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">Polyarimetr</strong> — optik faol moddalarni aniqlash uchun ishlatiladigan asbob.
            Oddiy yorug'lik barcha tekisliklarda tebranadi. Polyarizator orqali o'tgach, faqat bitta tekislikda tebranadigan 
            <strong className="text-yellow-400"> qutblangan nur</strong> hosil bo'ladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
            <div className="text-center space-y-3">
              <p className="text-purple-200">
                <strong>Oddiy yorug'lik</strong> → [Polyarizator] → <strong className="text-yellow-400">Qutblangan nur</strong> → 
                [Optik faol modda] → <strong className="text-green-400">Burilgan nur</strong> → [Analizator]
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
              <h4 className="text-blue-400 font-bold mb-2">(+) yoki d — o'ngga buruvchi</h4>
              <p className="text-purple-200 text-sm">Qutblangan nurni soat strelkasi bo'yicha buradi (dextrorotatory).</p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
              <h4 className="text-red-400 font-bold mb-2">(−) yoki l — chapga buruvchi</h4>
              <p className="text-purple-200 text-sm">Qutblangan nurni soat strelkasiga qarshi buradi (levorotatory).</p>
            </div>
          </div>
        </div>

        {/* 3. MISOL: [Co(en)₂Cl₂]⁺ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Klassik misol: [Co(en)₂Cl₂]⁺</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">[Co(en)₂Cl₂]⁺</strong> kompleksining sis-izomeri optik faol, 
            trans-izomeri esa optik faol emas. Sis-izomer ikkita enantiomer (Λ va Δ) holida uchraydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-3">trans-[Co(en)₂Cl₂]⁺</h3>
              <p className="text-purple-200 text-sm mb-2"><strong>Optik faol EMAS</strong></p>
              <ul className="text-purple-300 text-sm space-y-1">
                <li>• Simmetriya tekisligi mavjud</li>
                <li>• Oynadagi aksi bilan ustma-ust tushadi</li>
                <li>• Qutblangan nurni burmaydi</li>
              </ul>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">sis-[Co(en)₂Cl₂]⁺</h3>
              <p className="text-purple-200 text-sm mb-2"><strong>Optik faol — 2 ta enantiomer</strong></p>
              <ul className="text-purple-300 text-sm space-y-1">
                <li>• Simmetriya tekisligi yo'q</li>
                <li>• Oynadagi aksi bilan ustma-ust tushmaydi</li>
                <li>• Λ (lambda) va Δ (delta) izomerlar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Λ va Δ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔤 Λ (lambda) va Δ (delta) belgilari</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Oktaedrik komplekslarda xirallik ko'pincha <strong className="text-yellow-400">Λ va Δ</strong> prefikslari bilan belgilanadi.
            Bu belgilar xelat halqalarining fazoviy joylashuviga asoslangan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <h3 className="text-blue-400 font-bold text-xl mb-3">Λ (lambda)</h3>
              <p className="text-purple-200 text-sm">Xelat halqalari <strong>chapga</strong> bukilgan.</p>
              <p className="text-purple-300 text-xs mt-2">Chap qo'l konfiguratsiyasi</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <h3 className="text-pink-400 font-bold text-xl mb-3">Δ (delta)</h3>
              <p className="text-purple-200 text-sm">Xelat halqalari <strong>o'ngga</strong> bukilgan.</p>
              <p className="text-purple-300 text-xs mt-2">O'ng qo'l konfiguratsiyasi</p>
            </div>
          </div>
        </div>

        {/* 5. AMALIY AHAMIYATI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌍 Amaliy ahamiyati</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">💊 Farmatsevtika</h3>
              <p className="text-purple-200 text-sm">
                Dori moddalarining enantiomerlari har xil biologik ta'sirga ega bo'lishi mumkin. 
                Ba'zan bir enantiomer shifobaxsh, ikkinchisi zararli! (Masalan: talidomid fojiasi, 1960-yillar).
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🧪 Analitik kimyo</h3>
              <p className="text-purple-200 text-sm">
                Polyarimetr yordamida optik faol moddalarning konsentratsiyasi va tozaligini aniqlash mumkin.
              </p>
            </div>
          </div>
        </div>

        {/* 6. XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Optik izomeriya — <strong className="text-yellow-400">xiral molekulalar</strong> oynadagi aksi bilan ustma-ust tushmaydi</li>
            <li>Enantiomerlar <strong>qutblangan nurni qarama-qarshi tomonga buradi</strong></li>
            <li>Λ (lambda) — chapga, Δ (delta) — o'ngga burilgan</li>
            <li>Polyarimetr — optik faollikni o'lchash asbobi</li>
            <li>Farmatsevtikada enantiomerlarning farqi <strong>hayotiy ahamiyatga ega</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/izomeriyasi/stereo/geometrik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Geometrik izomeriya</Link>
          <Link href="/oquv/izomeriyasi/stereo" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Stereoizomeriya →</Link>
        </div>

      </section>
    </main>
  )
}