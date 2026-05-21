import Link from "next/link"

export default function KompleksAsoslar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/sinf" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🧴 Kompleks asoslar</h1>
          <p className="text-purple-400 text-sm">Tashqi sferasida gidroksid ioni (OH⁻) tutgan kompleks birikmalar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kompleks asoslar haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Kompleks asoslar</strong> — tashqi sferasida 
              <strong className="text-yellow-400"> gidroksid ioni (OH⁻)</strong> tutgan kompleks birikmalardir. 
              Ular suvda eriganda gidroksid ionini beradi va oddiy asoslar kabi 
              <strong className="text-yellow-400"> indikator rangini o'zgartiradi</strong>, 
              kislotalar bilan neytrallanish reaksiyasiga kirishadi.
            </p>
          </div>

          <p className="text-purple-200 leading-relaxed mb-4">
            Kompleks asoslarning tashqi sferasida OH⁻ ioni joylashgan. Suvli eritmada dissotsilanganda 
            gidroksid ionlari ajralib chiqadi va eritma ishqoriy muhitga ega bo'ladi. 
            Ichki sfera esa butunligicha saqlanib qoladi.
          </p>
        </div>

        {/* 2. MISOL 1 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">1️⃣ [Ag(NH₃)₂]OH</h2>
          <p className="text-blue-400 font-semibold text-lg mb-6">diamminkumush(I) gidroksid</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Tarkibi</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Ichki sfera: <strong className="text-blue-400">[Ag(NH₃)₂]⁺</strong></li>
                <li>• Tashqi sfera: <strong className="text-blue-400">OH⁻</strong></li>
                <li>• Markaziy atom: <strong>Ag⁺ (kumush)</strong></li>
                <li>• Ligandlar: <strong>2 ta NH₃</strong></li>
                <li>• Koordinatsion son: <strong>2</strong></li>
                <li>• Geometriya: <strong>Chiziqli</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Xossalari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Rangsiz eritma</li>
                <li>• Ishqoriy muhit</li>
                <li>• Kumush ko'zgu reaksiyasi</li>
                <li>• Aldegidlarni aniqlashda</li>
                <li>• Uzoq saqlansa Ag₃N portlovchi modda hosil bo'ladi</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-4">
            <h3 className="text-yellow-400 font-bold mb-2">🏆 Tollens reaktivi</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              [Ag(NH₃)₂]OH — <strong>eng mashhur kompleks asos</strong>, Tollens reaktivi sifatida tanilgan. 
              Organik kimyoda aldegidlarni sifat aniqlashda ishlatiladi. Aldegidlar bilan reaksiyaga kirishganda 
              &quot;kumush ko'zgu&quot; — probirka ichida yaltiroq kumush qatlami hosil bo'ladi.
            </p>
          </div>
          
          <div className="bg-purple-900/50 rounded-xl p-5 text-center">
            <p className="text-purple-200 mb-2">Hosil bo'lish reaksiyasi:</p>
            <div className="font-mono text-purple-300 text-sm space-y-1">
              <p>AgNO₃ + NaOH → AgOH↓ + NaNO₃</p>
              <p>AgOH + 2NH₃ → <strong className="text-yellow-400">[Ag(NH₃)₂]OH</strong></p>
            </div>
          </div>
        </div>

        {/* 3. MISOL 2 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">2️⃣ [Cu(NH₃)₄](OH)₂</h2>
          <p className="text-blue-400 font-semibold text-lg mb-6">tetraamminmis(II) gidroksid</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Tarkibi</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Ichki sfera: <strong className="text-blue-400">[Cu(NH₃)₄]²⁺</strong></li>
                <li>• Tashqi sfera: <strong className="text-blue-400">2OH⁻</strong></li>
                <li>• Markaziy atom: <strong>Cu²⁺ (mis)</strong></li>
                <li>• Ligandlar: <strong>4 ta NH₃</strong></li>
                <li>• Koordinatsion son: <strong>4</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Xossalari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• To'q ko'k rangli eritma</li>
                <li>• Shveytser reaktivi</li>
                <li>• Tsellyulozani eritadi</li>
                <li>• Sun'iy ipak ishlab chiqarishda</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-purple-900/50 rounded-xl p-5 text-center">
            <p className="text-purple-200 mb-2">Dissotsilanish reaksiyasi:</p>
            <p className="font-mono text-yellow-400 text-lg">
              [Cu(NH₃)₄](OH)₂ → [Cu(NH₃)₄]²⁺ + 2OH⁻
            </p>
          </div>
        </div>

        {/* 4. UMUMIY XUSUSIYATLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Kompleks asoslarning umumiy xususiyatlari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🔵 Indikator ta'siri</h3>
              <p className="text-purple-300 text-sm">Lakmusni ko'kartiradi, fenolftaleinni pushti-qizil rangga bo'yaydi.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🧪 Kislotalar bilan reaksiya</h3>
              <p className="text-purple-300 text-sm">Kislotalar bilan neytrallanish reaksiyasiga kirishib, tuz va suv hosil qiladi.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">💧 Dissotsilanish</h3>
              <p className="text-purple-300 text-sm">Suvda eriganda faqat tashqi sfera OH⁻ ionlari ajraladi. Ichki sfera butunligicha qoladi.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">⚠️ Barqarorlik</h3>
              <p className="text-purple-300 text-sm">Ba'zi kompleks asoslar (ayniqsa Ag⁺ komplekslari) uzoq saqlanganda portlovchi moddalar hosil qilishi mumkin.</p>
            </div>
          </div>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Kompleks asoslar tashqi sferasida <strong className="text-yellow-400">OH⁻ ioni</strong> tutadi</li>
            <li>Suvda eriganda <strong className="text-yellow-400">gidroksid ioni</strong> ajratadi</li>
            <li>Oddiy asoslarga xos barcha xususiyatlarga ega</li>
            <li><strong>Tollens reaktivi</strong> — eng muhim kompleks asos (ald egidlarni aniqlash)</li>
            <li><strong>Shveytser reaktivi</strong> — tsellyulozani eritadi</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/sinf/kislota" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Kompleks kislotalar
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/sinf/tuz" 
            className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 transition-all text-white font-semibold"
          >
            Keyingi: Kompleks tuzlar →
          </Link>
        </div>

      </section>

    </main>
  )
}