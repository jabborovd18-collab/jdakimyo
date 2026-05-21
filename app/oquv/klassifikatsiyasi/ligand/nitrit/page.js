import Link from "next/link"

export default function NitritKomplekslar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/ligand" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🟠 Nitrit komplekslar</h1>
          <p className="text-purple-400 text-sm">Ligand: NO₂⁻ yoki ONO⁻ • Ambidentat ligand • Nitro va nitrito izomerlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Nitrit komplekslar haqida</h2>
          
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Nitrit komplekslar</strong> — NO₂⁻ guruhi ligand sifatida qatnashgan komplekslardir.
              NO₂⁻ — <strong className="text-yellow-400">ambidentat ligand</strong> bo'lib, markaziy atomga ikki xil atom orqali bog'lanishi mumkin:
              azot orqali (<strong>nitro</strong>) yoki kislorod orqali (<strong>nitrito</strong>).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Bog'lanish turlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Nitro (—NO₂):</strong> Azot orqali bog'lanish</li>
                <li>• <strong>Nitrito (—ONO):</strong> Kislorod orqali bog'lanish</li>
                <li>• Ikkalasi ham bir xil formula, lekin har xil xossa</li>
                <li>• Bu bog'lanish izomeriyasiga misol</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Muhim faktlar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Nitro — odatda barqarorroq</li>
                <li>• Nitrito — yorug'lik ta'sirida nitroga o'tishi mumkin</li>
                <li>• Rang farqi orqali aniqlash mumkin</li>
                <li>• Verner bu izomeriyani birinchi bo'lib kashf etgan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. VERNER KLASSIKASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏛️ Verner kashfiyoti — kobalt nitrit komplekslari</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Alfred Verner tomonidan o'rganilgan eng mashhur bog'lanish izomeriyasi misoli — kobalt(III) ning 
            nitro va nitrito komplekslari. U rentgen difraksiyasi yo'q davrda komplekslarning 
            <strong className="text-yellow-400"> rangiga qarab</strong> bog'lanish turini to'g'ri aniqlagan!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">[Co(NH₃)₅NO₂]Cl₂</h3>
              <p className="text-purple-200 mb-3">
                <strong>nitropentaamminkobalt(III) xlorid</strong>
              </p>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Bog'lanish:</strong> N orqali (Nitro)</li>
                <li>• <strong>Rangi:</strong> Sariq</li>
                <li>• <strong>Sababi:</strong> 6 ta N-donor (5 NH₃ + 1 NO₂)</li>
                <li>• <strong>Barqarorligi:</strong> Yuqori</li>
              </ul>
            </div>
            
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-400 mb-3">[Co(NH₃)₅ONO]Cl₂</h3>
              <p className="text-purple-200 mb-3">
                <strong>nitritopentaamminkobalt(III) xlorid</strong>
              </p>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Bog'lanish:</strong> O orqali (Nitrito)</li>
                <li>• <strong>Rangi:</strong> Qizg'ish-pushti</li>
                <li>• <strong>Sababi:</strong> 5 ta N-donor + 1 ta O-donor</li>
                <li>• <strong>Barqarorligi:</strong> Yorug'likda nitroga o'tadi</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">
              <strong>💡 Verner dahosi:</strong> Nitro-kompleks sariq (6 ta N-donor), nitrito-kompleks qizg'ish (5 ta N-donor). 
              Verner donor atomlar soniga qarab rang o'zgarishini to'g'ri bashorat qilgan!
            </p>
          </div>
        </div>

        {/* 3. FISHER TUZI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Fisher tuzi — K₃[Co(NO₂)₆]</h2>
          
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-orange-400 mb-3">K₃[Co(NO₂)₆]</h3>
            <p className="text-purple-200">
              <strong>kaliy geksanitrokobaltat(III)</strong> — Fisher tuzi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Tarkibi</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Tashqi sfera: <strong>3K⁺</strong></li>
                <li>• Ichki sfera: <strong>[Co(NO₂)₆]³⁻</strong></li>
                <li>• Markaziy atom: <strong>Co³⁺ (d⁶)</strong></li>
                <li>• Ligandlar: <strong>6 ta NO₂⁻ (nitro)</strong></li>
                <li>• Koordinatsion son: <strong>6</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xossalari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Sariq kristall modda</li>
                <li>• Barcha ligandlar N orqali bog'langan</li>
                <li>• Analitik kimyoda K⁺ ni aniqlashda</li>
                <li>• Suvda yomon eriydi (cho'kma)</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">
              <strong>🔬 Analitik ahamiyati:</strong> K₃[Co(NO₂)₆] kaliy ionlari bilan sariq cho'kma hosil qiladi. 
              Bu reaksiya analitik kimyoda kaliyni sifat va miqdoriy aniqlashda ishlatiladi.
            </p>
          </div>
        </div>

        {/* 4. BOSHQA MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Boshqa nitrit komplekslar</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Na₃[Co(NO₂)₆]</h3>
              <p className="text-purple-200 text-sm">
                <strong>natriy geksanitrokobaltat(III)</strong> — Fisher tuzining natriy analogi. 
                Kaliy variantiga qaraganda suvda yaxshiroq eriydi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">[Ir(NO₂)₆]³⁻</h3>
              <p className="text-purple-200 text-sm">
                <strong>geksanitroiridat(III)</strong> — iridiy kompleksi. Barcha ligandlar N orqali bog'langan (nitro).
              </p>
            </div>
          </div>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>NO₂⁻ — <strong className="text-yellow-400">ambidentat ligand</strong></li>
            <li>Ikki xil bog'lanish: <strong>nitro (—NO₂)</strong> va <strong>nitrito (—ONO)</strong></li>
            <li>Verner rang farqiga qarab izomerlarni birinchi bo'lib aniqlagan</li>
            <li>Fisher tuzi K₃[Co(NO₂)₆] — eng muhim vakil</li>
            <li>Bog'lanish izomeriyasining eng yorqin misoli</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/galogenid" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Galogenid komplekslar
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/aralash" 
            className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 transition-all text-white font-semibold"
          >
            Keyingi: Aralash ligandli →
          </Link>
        </div>

      </section>

    </main>
  )
}