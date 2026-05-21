import Link from "next/link"

export default function NitrozilKomplekslar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/ligand" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🔵 Nitrozil komplekslar</h1>
          <p className="text-purple-400 text-sm">Ligand: NO (azot(II) oksidi) • Chiziqli yoki burchakli bog'lanish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Nitrozil komplekslar haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Nitrozil komplekslar</strong> — ligandi 
              <strong className="text-yellow-400"> azot(II) oksidi (NO)</strong> bo'lgan kompleks birikmalardir. 
              NO molekulasi ikki xil usulda bog'lanishi mumkin: <strong className="text-yellow-400">chiziqli</strong> (NO⁺ sifatida) 
              yoki <strong className="text-yellow-400">burchakli</strong> (NO⁻ sifatida). Eng muhim vakili — natriy nitroprussid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ligand xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Ligand:</strong> NO — nitrozil (IUPAC)</li>
                <li>• <strong>Donor atom:</strong> Azot (N)</li>
                <li>• <strong>Turi:</strong> Monodentat</li>
                <li>• <strong>Bog'lanish:</strong> Chiziqli yoki burchakli</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">NO bog'lanish turlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>NO⁺ (nitrozil kation):</strong> Chiziqli, M-N-O burchagi 180°</li>
                <li>• <strong>NO⁻ (nitrozil anion):</strong> Burchakli, M-N-O burchagi ~120°</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. NATRIY NITROPRUSSID */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Natriy nitroprussid — eng muhim vakil</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-blue-400 mb-3">Na₂[Fe(CN)₅NO]</h3>
            <p className="text-purple-200 mb-2">
              <strong>natriy pentasiyanonitrozilferrat(III)</strong>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Tarkibi</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Tashqi sfera: <strong>2Na⁺</strong></li>
                <li>• Ichki sfera: <strong>[Fe(CN)₅NO]²⁻</strong></li>
                <li>• Markaziy atom: <strong>Fe³⁺</strong></li>
                <li>• 5 ta CN⁻ + 1 ta NO</li>
                <li>• Koordinatsion son: <strong>6</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xossalari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Qizil kristall modda</li>
                <li>• Suvda yaxshi eriydi</li>
                <li>• Tibbiyotda qo'llaniladi</li>
                <li>• Sulfid ionlari bilan binafsha rang</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <h3 className="text-yellow-400 font-bold mb-2">🏆 Analitik ahamiyati</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              Natriy nitroprussid sulfid ionlari (S²⁻) bilan xarakterli <strong className="text-purple-400">binafsha rang</strong> hosil qiladi. 
              Bu reaksiya analitik kimyoda oltingugurt saqlovchi birikmalarni sifat aniqlashda ishlatiladi.
            </p>
          </div>
        </div>

        {/* 3. BOSHQA MISOL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Boshqa nitrozil komplekslar</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">[Fe(CO)₃(NO)]⁻</h3>
              <p className="text-purple-200 text-sm">
                <strong>trikarbonilnitrozilferrat(0)</strong> — aralash ligandli kompleks. 
                CO va NO birgalikda ligand sifatida qatnashadi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">[Ru(NH₃)₅NO]³⁺</h3>
              <p className="text-purple-200 text-sm">
                <strong>pentaamminnitrozilruteniy(III)</strong> — ruteniy nitrozil kompleksi. 
                Chiziqli NO bog'lanishga ega.
              </p>
            </div>
          </div>
        </div>

        {/* 4. XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>NO — <strong className="text-yellow-400">nitrozil</strong> ligandi</li>
            <li>Ikki xil bog'lanish: <strong>chiziqli (NO⁺)</strong> va <strong>burchakli (NO⁻)</strong></li>
            <li>Natriy nitroprussid — <strong>eng muhim vakil</strong></li>
            <li>S²⁻ ionlari bilan binafsha rang — analitik ahamiyat</li>
            <li>Tibbiyotda qon bosimini tushiruvchi vosita sifatida qo'llaniladi</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/karbonil" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Karbonil komplekslar
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/sianid" 
            className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 transition-all text-white font-semibold"
          >
            Keyingi: Sianid komplekslar →
          </Link>
        </div>

      </section>

    </main>
  )
}