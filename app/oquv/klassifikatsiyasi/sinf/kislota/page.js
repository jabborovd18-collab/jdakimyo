import Link from "next/link"

export default function KompleksKislotalar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/sinf" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🧪 Kompleks kislotalar</h1>
          <p className="text-purple-400 text-sm">Tashqi sferasida vodorod ioni (H⁺) tutgan kompleks birikmalar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kompleks kislotalar haqida</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Kompleks kislotalar</strong> — tashqi sferasida 
              <strong className="text-yellow-400"> vodorod ioni (H⁺)</strong> tutgan kompleks birikmalardir. 
              Ular suvda eriganda vodorod ionini beradi. Oddiy kislotalar kabi ular ham 
              <strong className="text-yellow-400"> indikator rangini o'zgartiradi</strong>, metallar bilan 
              reaksiyaga kirishib tuz hosil qiladi va asoslar bilan neytrallanish reaksiyasiga kirishadi.
            </p>
          </div>

          <p className="text-purple-200 leading-relaxed mb-4">
            Kompleks kislotalarning <strong className="text-yellow-400">eng muhim xususiyati</strong> — 
            ularning tashqi sferasida vodorod ioni joylashgan bo'lib, suvli eritmada dissotsilanganda 
            aynan shu ionlar ajralib chiqadi. Ichki sfera esa butunligicha saqlanib qoladi.
          </p>
        </div>

        {/* 2. MISOL 1 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">1️⃣ H₂[SiF₆]</h2>
          <p className="text-red-400 font-semibold text-lg mb-6">geksaftorosilikat (IV) kislota</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Tarkibi</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Tashqi sfera: <strong className="text-red-400">2H⁺</strong></li>
                <li>• Ichki sfera: <strong className="text-blue-400">[SiF₆]²⁻</strong></li>
                <li>• Markaziy atom: <strong>Si (kremniy)</strong></li>
                <li>• Ligandlar: <strong>6 ta F⁻</strong></li>
                <li>• Koordinatsion son: <strong>6</strong></li>
                <li>• Geometriya: <strong>Oktaedrik</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Xossalari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Rangsiz suyuqlik</li>
                <li>• Kuchli kislota</li>
                <li>• Suvda yaxshi eriydi</li>
                <li>• Shisha va silikatlarni eritadi</li>
                <li>• Sanoatda alyuminiy tozalashda ishlatiladi</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-purple-900/50 rounded-xl p-5 text-center">
            <p className="text-purple-200 mb-2">Dissotsilanish reaksiyasi:</p>
            <p className="font-mono text-yellow-400 text-lg">
              H₂[SiF₆] → 2H⁺ + [SiF₆]²⁻
            </p>
            <p className="text-purple-400 text-xs mt-2">
              Ichki sfera [SiF₆]²⁻ mustahkam — keyingi dissotsilanish kuzatilmaydi
            </p>
          </div>
        </div>

        {/* 3. MISOL 2 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">2️⃣ H[AuCl₄]</h2>
          <p className="text-red-400 font-semibold text-lg mb-6">tetraxloroaurat (III) kislota</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Tarkibi</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Tashqi sfera: <strong className="text-red-400">H⁺</strong></li>
                <li>• Ichki sfera: <strong className="text-blue-400">[AuCl₄]⁻</strong></li>
                <li>• Markaziy atom: <strong>Au³⁺ (oltin)</strong></li>
                <li>• Ligandlar: <strong>4 ta Cl⁻</strong></li>
                <li>• Koordinatsion son: <strong>4</strong></li>
                <li>• Geometriya: <strong>Tekis kvadrat</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Xossalari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Sariq kristall modda</li>
                <li>• Suvda va spirtda eriydi</li>
                <li>• Oltinni eritishda ishlatiladi</li>
                <li>• Zar suvi tarkibiga kiradi</li>
                <li>• Analitik kimyoda qo'llaniladi</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-4">
            <h3 className="text-yellow-400 font-bold mb-2">🏆 Tarixiy ahamiyati</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              H[AuCl₄] — &quot;zar suvi&quot; (aqua regia) tarkibidagi asosiy moddalardan biri. 
              Zar suvi HCl + HNO₃ aralashmasi bo'lib, unda oltin eritilganda aynan H[AuCl₄] hosil bo'ladi. 
              Bu kashfiyot oltinni kimyoviy qayta ishlash imkonini bergan.
            </p>
          </div>
          
          <div className="bg-purple-900/50 rounded-xl p-5 text-center">
            <p className="text-purple-200 mb-2">Dissotsilanish reaksiyasi:</p>
            <p className="font-mono text-yellow-400 text-lg">
              H[AuCl₄] → H⁺ + [AuCl₄]⁻
            </p>
          </div>
        </div>

        {/* 4. MISOL 3 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">3️⃣ H₂[PtCl₆]</h2>
          <p className="text-red-400 font-semibold text-lg mb-6">geksaxloroplatinat (IV) kislota</p>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <h3 className="text-yellow-400 font-bold mb-3">Tarkibi</h3>
            <ul className="text-purple-200 space-y-2 text-sm">
              <li>• Tashqi sfera: <strong className="text-red-400">2H⁺</strong></li>
              <li>• Ichki sfera: <strong className="text-blue-400">[PtCl₆]²⁻</strong></li>
              <li>• Markaziy atom: <strong>Pt⁴⁺ (platina)</strong></li>
              <li>• Ligandlar: <strong>6 ta Cl⁻</strong></li>
              <li>• Koordinatsion son: <strong>6</strong></li>
              <li>• Geometriya: <strong>Oktaedrik</strong></li>
            </ul>
          </div>
          
          <div className="bg-purple-900/50 rounded-xl p-5 text-center">
            <p className="text-purple-200 mb-2">Dissotsilanish reaksiyasi:</p>
            <p className="font-mono text-yellow-400 text-lg">
              H₂[PtCl₆] → 2H⁺ + [PtCl₆]²⁻
            </p>
          </div>
        </div>

        {/* 5. UMUMIY XUSUSIYATLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Kompleks kislotalarning umumiy xususiyatlari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🔴 Indikator ta'siri</h3>
              <p className="text-purple-300 text-sm">Lakmusni qizartiradi, metiloranjni pushti rangga bo'yaydi.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">⚗️ Metallar bilan reaksiya</h3>
              <p className="text-purple-300 text-sm">Faol metallar bilan reaksiyaga kirishib, vodorod ajralib chiqadi va tuz hosil bo'ladi.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">💧 Dissotsilanish</h3>
              <p className="text-purple-300 text-sm">Suvda eriganda faqat tashqi sfera H⁺ ionlari ajraladi. Ichki sfera butunligicha qoladi.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🧪 Neytrallanish</h3>
              <p className="text-purple-300 text-sm">Asoslar bilan neytrallanish reaksiyasiga kirishib, tegishli kompleks tuzlarni hosil qiladi.</p>
            </div>
          </div>
        </div>

        {/* 6. XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Kompleks kislotalar tashqi sferasida <strong className="text-yellow-400">H⁺ ioni</strong> tutadi</li>
            <li>Suvda eriganda <strong className="text-yellow-400">vodorod ioni</strong> ajratadi</li>
            <li>Oddiy kislotalarga xos barcha xususiyatlarga ega</li>
            <li>Ichki sfera <strong className="text-yellow-400">dissotsilanmaydi</strong></li>
            <li>Eng muhim vakillari: <strong>H₂[SiF₆], H[AuCl₄], H₂[PtCl₆]</strong></li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/sinf" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Sinf bo'limi
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/sinf/asos" 
            className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 transition-all text-white font-semibold"
          >
            Keyingi: Kompleks asoslar →
          </Link>
        </div>

      </section>

    </main>
  )
}