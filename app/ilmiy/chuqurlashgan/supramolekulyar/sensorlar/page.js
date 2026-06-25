import Link from "next/link"

export default function Sensorlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/supramolekulyar" className="text-purple-400 hover:text-purple-300 text-lg">← Supramolekulyar</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">📡 Supramolekulyar sensorlar</h1>
          <p className="text-purple-400 text-sm">Anion/Kation tanib olish • Fluoressensiya • Kolorimetrik • Turn-on/off</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Supramolekulyar sensorlar haqida</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-red-400">Supramolekulyar sensorlar</strong> — ma'lum bir analit 
              (ion yoki molekula) bilan <strong>selektiv bog'lanib, o'lchanadigan signal</strong> 
              (optik, elektrokimyoviy) hosil qiladigan molekulyar tizimlar. Ular <strong>uch 
              komponentdan</strong> iborat: <strong>retseptor</strong> (tanib oluvchi qism), 
              <strong>signallovchi birlik</strong> (fluorofor yoki xromofor) va <strong>linker</strong> 
              (ularni bog'lovchi). Bog'lanish natijasida signal o'zgaradi — 
              <strong>turn-on (yoqiladi), turn-off (o'chadi)</strong> yoki <strong>ratsiometrik</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Sensor dizayni prinsiplari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Selektivlik:</strong> Faqat ma'lum analitga javob berish</li>
                <li>• <strong>Sezgirlik:</strong> Past konsentratsiyalarda aniqlash (nM−pM)</li>
                <li>• <strong>Qaytarlik:</strong> Bog'lanish qaytar bo'lishi — qayta ishlatish</li>
                <li>• <strong>Tezkor javob:</strong> Real vaqt rejimida ishlash</li>
                <li>• <strong>Suvli muhitda ishlash:</strong> Biologik qo'llanish uchun</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Signal mexanizmlari</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">Mexanizm</th><th className="text-left py-2 text-red-400">Prinsip</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["PET (Photoinduced Electron Transfer)","Bog'lanish → PET bloklanadi → fluoressensiya YOQILADI (turn-on)"],["ICT (Internal Charge Transfer)","Bog'lanish → dipol moment o'zgaradi → spektr siljiydi (ratsiometrik)"],["FRET (Forster Resonance Energy Transfer)","Ikki fluorofor — bog'lanish → masofa o'zgaradi → FRET signali"],["Excimer/Exciplex","Bog'lanish → ikki fluorofor yaqinlashadi → yangi emission piki"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5 font-bold text-red-400 text-xs">{r[0]}</td><td className="py-1.5 text-xs">{r[1]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. KATION SENSORLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔵 Kation sensorlar — metall ionlarini aniqlash</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-red-400">Kation sensorlar</strong> — biologik va ekologik ahamiyatga ega 
            metall ionlarini (Na⁺, K⁺, Ca²⁺, Zn²⁺, Cu²⁺, Fe³⁺, Hg²⁺, Pb²⁺) tanib oladi.
            Ular crown efirlar, kaliksarenlar yoki ko'p tishli ligandlar asosida quriladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold text-sm mb-3">Hg²⁺ sensor — tanlab olish</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Retseptor:</strong> Tioamid yoki tiokarbon guruhi — Hg²⁺ bilan kuchli bog'lanadi (yumshoq-yumshoq)</li>
                <li>• <strong>Mexanizm:</strong> PET turn-on — bog'languncha fluoressensiya o'chgan, bog'langandan keyin yonadi</li>
                <li>• <strong>LOD:</strong> 0.1−10 nM (ichimlik suvidagi ruxsat etilgan chegaradan past)</li>
                <li>• <strong>Selektivlik:</strong> Boshqa metall ionlari (Na⁺, K⁺, Ca²⁺, Mg²⁺, Zn²⁺) xalaqit bermaydi</li>
              </ul>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold text-sm mb-3">Zn²⁺ sensor — biologik ahamiyat</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Retseptor:</strong> Dipikolilamin (DPA) — Zn²⁺ ni Cd²⁺ va boshqalardan ajratib tanib oladi</li>
                <li>• <strong>Mexanizm:</strong> ICT — bog'lanish natijasida fluoressensiya spektri siljiydi</li>
                <li>• <strong>Qo'llanish:</strong> Hujayra ichidagi Zn²⁺ konsentratsiyasini kuzatish — neyronlarda, oshqozon osti bezida</li>
                <li>• <strong>Zinquin, FluoZin-3:</strong> Tijorat Zn²⁺ sensorlari</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. ANION SENSORLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🟡 Anion sensorlar — portlovchi moddalarni aniqlash</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-red-400">Anion sensorlar</strong> — kation sensorlarga nisbatan 
            murakkabroq, chunki anionlar kattaroq, diffuz zaryadli va pH ga sezgir. Eng muhim 
            qo'llanishlardan biri — <strong>nitroaromatik portlovchi moddalarni</strong> (TNT, DNT) 
            fluoressensiya orqali aniqlash. Bu sensorlar <strong>xavfsizlik va harbiy sohada</strong> 
            keng qo'llaniladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-red-400 font-bold mb-3">Portlovchi moddalar sensorlari — MOF va metall komplekslar:</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">Mexanizm:</strong> Nitroaromatik birikmalar (TNT, DNT) — elektron akseptorlar. Lyuminestsent MOF yoki metall kompleksning qo'zg'algan holati elektronini TNT ga uzatadi → fluoressensiya o'chadi (turn-off).</p>
              <p><strong className="text-yellow-400">Sezgirlik:</strong> TNT bug'lari — ppb darajasida aniqlash mumkin. Hatto 1 fentogramm (10⁻¹⁵ g) TNT!</p>
              <p><strong className="text-yellow-400">Materiallar:</strong> Zn-MOF, Ln-MOF (Eu, Tb), [Ru(bpy)₃]²⁺ polimerlari, piren asosidagi sensorlar.</p>
              <p className="text-green-400 mt-2"><strong>Afzalligi:</strong> Ko'chma, tezkor, arzon — aeroport xavfsizligi, minalarni aniqlash.</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-center text-xs">
            {[
              { anion: "F⁻ (ftorid)", receptor: "Si−O / Si−C bog'lari (fluoridga sezgir)", app: "Ichish suvi sifati, tish pastasi" },
              { anion: "CN⁻ (sianid)", receptor: "Cu²⁺ komplekslari — CN⁻ Cu²⁺ ni ajratib oladi", app: "Sanoat chiqindilari, terrorizmga qarshi" },
              { anion: "H₂PO₄⁻ (fosfat)", receptor: "Amid / karbamid guruhlari — vodorod bog'lar", app: "Biologik suyuqliklar, o'g'itlar" },
            ].map((r, i) => (
              <div key={i} className="bg-red-600/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 font-bold">{r.anion}</p>
                <p className="text-purple-300 mt-1">{r.receptor}</p>
                <p className="text-yellow-400 mt-1">{r.app}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Sensor — <strong className="text-red-400">retseptor + signallovchi birlik</strong></li>
            <li>PET mexanizmi — <strong className="text-red-400">turn-on fluoressensiya</strong></li>
            <li>Portlovchi moddalarni aniqlash — <strong className="text-red-400">ppb darajasida</strong> TNT bug'lari</li>
            <li>Kation va anion sensorlar — <strong className="text-red-400">selektivlik HSAB prinsipiga asoslangan</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/supramolekulyar/molekulyar-mashinalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Molekulyar mashinalar</Link>
          <Link href="/ilmiy/chuqurlashgan/supramolekulyar/biologik" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Biologik tizimlar →</Link>
        </div>

      </section>
    </main>
  )
}