import Link from "next/link"

export default function TemplatSintez() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/reaksiyalar" className="text-purple-400 hover:text-purple-300 text-lg">← Reaksiyalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🏗️ Templat sintez</h1>
          <p className="text-purple-400 text-sm">Metall templat effekti • Makrotsikllar • Crown efirlar • Schiff asoslari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Templat sintez haqida</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-cyan-400">Templat sintez</strong> — metall ionidan 
              <strong className="text-cyan-400"> "qolip" (templat) sifatida foydalanib</strong>, 
              murakkab organik ligandlarni sintez qilish usuli. Metall ioni reagentlarni 
              <strong>kerakli fazoviy yo'nalishda</strong> to'playdi va sikllanish reaksiyasini 
              <strong>termodinamik va kinetik jihatdan qulay</strong> qiladi. Bu usul yordamida 
              <strong>crown efirlar, ftalotsianinlar, Schiff asoslari, porfirinlar</strong> 
              kabi muhim makrotsiklik birikmalar sintez qilinadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">Templat effekt mexanizmi</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>1. Koordinatsiya:</strong> Metall ioni reagentlarni o'z atrofiga to'playdi</li>
                <li>• <strong>2. Preorganizatsiya:</strong> Reagentlar kerakli orientatsiyada joylashadi</li>
                <li>• <strong>3. Sikllanish:</strong> Kovalent bog'lar hosil bo'ladi (entropik qulay)</li>
                <li>• <strong>4. Demetallash:</strong> Kerak bo'lsa, metall olib tashlanadi</li>
                <li>• <strong>Termodinamik templat:</strong> Muvozanatni mahsulot tomon siljitadi</li>
                <li>• <strong>Kinetik templat:</strong> Sikllanish tezligini oshiradi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">Afzalliklari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Yuqori unum</strong> — yonaki reaksiyalar kamayadi</li>
                <li>• <strong>Selektivlik</strong> — kerakli o'lchamdagi makrotsikl hosil bo'ladi</li>
                <li>• <strong>Yumshoq sharoit</strong> — yuqori harorat talab qilinmaydi</li>
                <li>• <strong>Metal ionining o'lchami</strong> makrotsikl o'lchamini belgilaydi</li>
                <li>• <strong>"O'z-o'zini yig'ish"</strong> (self-assembly) imkoniyati</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. CROWN EFIRLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">👑 Crown efirlar — Pedersen kashfiyoti (Nobel 1987)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-cyan-400">Crown efirlar</strong> — siklik polieterlar bo'lib, 
            <strong>ishqoriy va ishqoriy-yer metall ionlarini</strong> tanib oladi va ular bilan 
            barqaror komplekslar hosil qiladi. <strong>Charles Pedersen (1967)</strong> ularni tasodifan 
            kashf etgan — reaksiya aralashmasidagi Na⁺ ioni templat vazifasini o'tagan. 
            Crown efirlarning <strong>bo'shlig'i o'lchami</strong> qaysi metall ioni bilan 
            kompleks hosil qilishini belgilaydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            {[
              { name: "12-crown-4", ring: "12 a'zoli, 4 ta O", cavity: "1.2−1.5 Å", best: "Li⁺ (r=0.76 Å)" },
              { name: "15-crown-5", ring: "15 a'zoli, 5 ta O", cavity: "1.7−2.2 Å", best: "Na⁺ (r=1.02 Å)" },
              { name: "18-crown-6", ring: "18 a'zoli, 6 ta O", cavity: "2.6−3.2 Å", best: "K⁺ (r=1.38 Å)" },
            ].map((r, i) => (
              <div key={i} className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-cyan-400 font-bold font-mono">{r.name}</p>
                <p className="text-purple-300 text-xs mt-1">{r.ring}</p>
                <p className="text-yellow-400 text-xs mt-1">Bo'shliq: {r.cavity}</p>
                <p className="text-green-400 text-xs mt-1">Eng yaxshi: {r.best}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-cyan-400 font-bold mb-2">"Kation-bo'shliq" mosligi prinsipi</h3>
            <p className="text-purple-200 text-sm">
              Crown efir bo'shlig'i o'lchami metall ioni radiusiga <strong>mos kelganda</strong> eng barqaror 
              kompleks hosil bo'ladi. Bu "qulf va kalit" mexanizmi <strong>molekulyar tanib olish</strong> 
              ning asosidir. 18-crown-6 K⁺ ni Na⁺ dan <strong>1000 marta yaxshiroq</strong> bog'laydi — 
              bu selektivlik templat sintez va host-guest kimyosining asosiy yutug'idir.
            </p>
          </div>
        </div>

        {/* 3. FTALOTSIANINLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔷 Ftalotsianinlar — metall templat sintezi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-cyan-400">Ftalotsianinlar (Pc)</strong> — porfiringa o'xshash 
            makrotsiklik birikmalar. Ularning sintezi uchun <strong>metall ioni templat</strong> 
            sifatida ishlatiladi. Metall ftalotsianinlar <strong>bo'yoqlar, katalizatorlar, 
            sensorlar va fotodinamik terapiya</strong> da keng qo'llaniladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-cyan-400 font-bold mb-3">Ftalotsianin sintezi:</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">Reagentlar:</strong> Ftalonitril (4 molekula) + metall tuzi (MX₂)</p>
              <p><strong className="text-yellow-400">Templat:</strong> M²⁺ ioni 4 ta ftalonitrilni o'z atrofiga to'playdi</p>
              <p><strong className="text-yellow-400">Sikllanish:</strong> 200−300°C da siklotetramerizatsiya — MPc hosil bo'ladi</p>
              <p><strong className="text-yellow-400">Metallsiz Pc:</strong> Kuchli kislota bilan demetallash orqali olinadi</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-center">
            {[
              { metal: "CuPc", color: "Ko'k", app: "Bo'yoq (Pigment Blue 15), siyoh" },
              { metal: "CoPc", color: "Qizil-binafsha", app: "Katalizator (Mercaptan oksidlanishi)" },
              { metal: "ZnPc", color: "Yashil", app: "Fotodinamik terapiya (singlet O₂)" },
            ].map((r, i) => (
              <div key={i} className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-3">
                <p className="text-cyan-400 font-bold">{r.metal}</p>
                <p className="text-white text-sm">{r.color}</p>
                <p className="text-purple-400 mt-1">{r.app}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. SCHIFF ASOSLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Schiff asoslari — [2+2] va [2+3] templat sintez</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-cyan-400">Schiff asoslari (iminlar)</strong> — amin va karbonil 
            birikmalarining kondensatsiya mahsulotlari. Metall ioni templat sifatida 
            <strong>bir nechta Schiff asosi fragmentini</strong> bir vaqtda hosil qilish va 
            makrotsiklik ligandga yig'ish imkonini beradi. <strong>Robson tipidagi makrotsikllar</strong> 
            — ikkita karbonil va ikkita aminning [2+2] kondensatsiyasi orqali olinadi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-cyan-400 font-bold mb-3">Robson makrotsikli — klassik templat sintez:</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">Komponentlar:</strong> 2,6-diformilpiridin + 1,3-diaminopropan + Ni²⁺</p>
              <p><strong className="text-yellow-400">Templat:</strong> Ni²⁺ ioni 2 ta dialdegid va 2 ta diaminni to'playdi</p>
              <p><strong className="text-yellow-400">Sikllanish:</strong> 4 ta C=N bog'i bir vaqtda hosil bo'ladi — [2+2] makrotsikl</p>
              <p><strong className="text-yellow-400">Unum:</strong> {'>'} 80% (templatsiz — {'<'} 5%!)</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Templat effekt — <strong className="text-cyan-400">metall ioni reagentlarni preorganizatsiya qiladi</strong></li>
            <li>Crown efirlar — <strong className="text-cyan-400">ishqoriy metall ionlarini tanib oladi</strong> (Nobel 1987)</li>
            <li>Ftalotsianinlar — <strong className="text-cyan-400">metall templat yordamida sanoat sintezi</strong></li>
            <li>Templat sintez — <strong className="text-cyan-400">unumdorlikni keskin oshiradi</strong> (5% → 80%+)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar/kislota-asos" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Kislota-asos reaksiyalari</Link>
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar/koordinatsion-polimerlar" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">Koordinatsion polimerlanish →</Link>
        </div>

      </section>
    </main>
  )
}