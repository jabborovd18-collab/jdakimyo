import Link from "next/link"

export default function Sendvich() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🥪 Sendvich (Ferrosen)</h1>
          <p className="text-purple-400 text-sm">KS = 10 • Metallosen • [Fe(C₅H₅)₂] • Nobel mukofoti (1973)</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="text-center">
          <Link href="/oquv/fazoviy/sendvich/3d" className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-purple-600/30">
            <span className="text-4xl">🥪</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-purple-200">[Fe(C₅H₅)₂] — interaktiv</div></div>
          </Link>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Ferrosen [Fe(C₅H₅)₂]</strong> — eng mashhur metallosen. 
              Ikkita siklopentadienil (C₅H₅⁻) halqasi parallel joylashgan bo'lib, ular orasida temir atomi 
              <strong className="text-yellow-400"> sendvich</strong> kabi joylashgan. 1951 yilda kashf etilgan. 
              1973 yilda Nobel mukofoti berilgan (Ernst Otto Fischer, Geoffrey Wilkinson).
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Tarkibi va xususiyatlari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Formula:</strong> [Fe(C₅H₅)₂] — ferrosen</li>
                <li>• <strong>Markaziy atom:</strong> Fe²⁺ (d⁶)</li>
                <li>• <strong>Oksidlanish darajasi:</strong> +2</li>
                <li>• <strong>Har bir C₅H₅⁻:</strong> 5 ta C donor atom</li>
                <li>• <strong>Jami Fe-C bog'lar:</strong> 10 ta</li>
                <li>• <strong>18 elektron qoidasi:</strong> Fe²⁺ (6e⁻) + 2×C₅H₅⁻ (12e⁻) = 18e⁻</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Fizik-kimyoviy xossalari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Rangi:</strong> To'q sariq kristall</li>
                <li>• <strong>T_suyuq:</strong> 173°C</li>
                <li>• <strong>T_qayn:</strong> 249°C</li>
                <li>• <strong>Suvda:</strong> Erimaydi</li>
                <li>• <strong>Organik erituvchilarda:</strong> Yaxshi eriydi</li>
                <li>• <strong>Havoda:</strong> Barqaror (oksidlanmaydi)</li>
                <li>• <strong>Magnit xossasi:</strong> Diamagnit</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏆 Tarixiy ahamiyati</h2>
          <div className="space-y-4">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">1951 yil — Kashf etilishi</h3>
              <p className="text-purple-200 text-sm">Tasodifan ikkita mustaqil laboratoriyada sintez qilingan. Pauson va Kealy (AQSh), Miller va boshqalar (Angliya).</p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">1973 yil — Nobel mukofoti</h3>
              <p className="text-purple-200 text-sm">Ernst Otto Fischer va Geoffrey Wilkinson ferrosen va boshqa metallosenlarning tuzilishini aniqlagani uchun Nobel mukofotiga sazovor bo'lishdi.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Kimyoviy xossalari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Reaksiyalar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Elektrofil almashinish (Friedel-Crafts)</li>
                <li>• Oksidlanish (Fe²⁺ → Fe³⁺)</li>
                <li>• Litiyli organik birikmalar bilan</li>
                <li>• Sulfolash, nitrolash</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Barqarorligi</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• 400°C gacha barqaror</li>
                <li>• Kislota va ishqorlarga chidamli</li>
                <li>• Havoda oksidlanmaydi</li>
                <li>• Yorug'lik ta'siriga chidamli</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌍 Amaliy ahamiyati</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🏭</div>
              <h3 className="text-yellow-400 font-bold mb-2">Kataliz</h3>
              <p className="text-purple-200 text-sm">Chiral ferrosen hosilalari asimmetrik sintezda katalizator sifatida.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">💊</div>
              <h3 className="text-yellow-400 font-bold mb-2">Tibbiyot</h3>
              <p className="text-purple-200 text-sm">Ferrosen hosilalari saraton va bezgakka qarshi dori vositalarida.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🔬</div>
              <h3 className="text-yellow-400 font-bold mb-2">Analitik kimyo</h3>
              <p className="text-purple-200 text-sm">Ferrosen elektrod sifatida elektrokimyoviy sensorlarda va biosensorlarda.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Ferrosen — <strong className="text-yellow-400">birinchi va eng mashhur metallosen</strong></li>
            <li>Sendvich tuzilish — <strong>ikkita C₅H₅⁻ halqasi orasida Fe²⁺</strong></li>
            <li>Fe-C bog'lar soni: <strong>10 ta</strong></li>
            <li><strong>18 elektron qoidasiga</strong> to'liq mos keladi</li>
            <li><strong>Nobel mukofoti (1973)</strong> — kashfiyot va tuzilish uchun</li>
            <li>Havoda barqaror, <strong>diamagnit</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/ikosaedrik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Ikosaedrik</Link>
          <Link href="/oquv/fazoviy" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Fazoviy bo'limi →</Link>
        </div>

      </section>
    </main>
  )
}