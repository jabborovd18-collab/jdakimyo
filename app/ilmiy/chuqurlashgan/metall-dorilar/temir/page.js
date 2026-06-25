import Link from "next/link"

export default function TemirDorilar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/metall-dorilar" className="text-purple-400 hover:text-purple-300 text-lg">← Metall dori vositalari</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🩸 Fe komplekslari</h1>
          <p className="text-purple-400 text-sm">Ferroquine • Bleomitsin • Ferrosen hosilalari • Tamoksifen analoglari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Temir dori vositalari haqida</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-red-400">Temir — hayotiy muhim biometal</strong>. Organizmda kislorod tashish 
              (gemoglobin), elektron tashish (sitoxromlar) va kataliz (katalaza, peroksidaza) kabi 
              funksiyalarni bajaradi. <strong className="text-red-400">Temir komplekslari</strong> 
              dori vositalari sifatida <strong>bezgak (ferroquine), saraton (bleomitsin, ferrosen 
              hosilalari)</strong> va temir yetishmovchiligi (temir xelatlari) da qo'llaniladi.
              <strong>Ferrosen</strong> — sandvich strukturali metallotsen — uning biologik faolligi 
              va past toksikligi uni dori dizayni uchun ideal qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Nima uchun temir komplekslari?</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Redoks faollik:</strong> Fe²⁺ ↔ Fe³⁺ — Fenton reaksiyasi (ROS hosil qilish)</li>
                <li>• <strong>Organizmda mavjud:</strong> Tabiiy tashish tizimlari (transferrin, ferritin)</li>
                <li>• <strong>Ferrosen:</strong> Barqaror, lipofil, past toksik — ideal dori platformasi</li>
                <li>• <strong>Saraton hujayralari:</strong> Temirga yuqori ehtiyoj — TfR1 ko'p ekspressiyalangan</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Asosiy Fe dori vositalari</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">Dori</th><th className="text-left py-2 text-red-400">Fe holati</th><th className="text-left py-2 text-purple-300">Kasallik</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["Ferroquine (FQ)","Fe(II) — ferrosen","Bezgak (xloroxin-rezistent)"],["Bleomitsin","Fe(II) — kompleks","Saraton (limfoma, testikulyar)"],["Ferrosen-tamoksifen","Fe(II) — ferrosen","Ko'krak saratoni (ER+)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5 font-mono text-red-400">{r[0]}</td><td className="py-1.5 text-xs">{r[1]}</td><td className="py-1.5 text-xs">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. FERROQUINE */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🦟 Ferroquine — bezgakka qarshi ferrosen dori</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-red-400">Ferroquine (FQ)</strong> — xloroxin (CQ) molekulasiga 
            <strong>ferrosen yadrosi</strong> kovalent bog'langan gibrid dori. Xloroxin 1950-yillardan 
            beri bezgakka qarshi qo'llaniladi, lekin <strong>Plasmodium falciparum</strong> 
            xloroxinga rezistentlik rivojlantirgan. Ferroquine bu rezistentlikni 
            <strong>yengib o'tadi</strong> — ferrosen yadrosi tufayli <strong>boshqa mexanizm</strong> 
            orqali ta'sir qiladi. Hozirda klinik sinovlarning II bosqichida.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold text-sm mb-2">Ta'sir mexanizmi</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• Parazitning ovqat hazm qilish vakuolasiga kiradi</li>
                <li>• <strong>Fe²⁺ → Fe³⁺ oksidlanishi</strong> — ROS hosil bo'ladi</li>
                <li>• Gemozoin (bezgak pigmenti) kristallanishini ingibirlaydi</li>
                <li>• Parazit uchun toksik erkin gem to'planadi</li>
                <li>• <strong>Xloroxin-rezistent shtammlarda ham faol!</strong></li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold text-sm mb-2">Ferroquine vs Xloroxin</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-red-800/30"><th className="text-left py-1 text-red-300">Xususiyat</th><th className="text-left py-1 text-red-300">CQ</th><th className="text-left py-1 text-red-300">FQ</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["Rezistentlik","Mavjud","Yo'q (yoki past)"],["Lipofillik","Past","Yuqori (ferrosen)"],["Redoks faollik","Yo'q","Ha (Fe²⁺/Fe³⁺)"],["IC₅₀ (CQ-R)","{'>>'} 100 nM","~10−30 nM"]].map((r,i)=>(<tr key={i} className="border-b border-red-800/20"><td className="py-1">{r[0]}</td><td className="py-1">{r[1]}</td><td className="py-1 text-green-400">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. BLEOMITSIN */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💉 Bleomitsin — temirga bog'liq sitostatik</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-red-400">Bleomitsin (BLM)</strong> — Streptomyces verticillus dan 
            ajratilgan <strong>glikopeptid antibiotik</strong>. U DNK ni <strong>Fe²⁺ va O₂ 
            ishtirokida</strong> oksidlovchi parchalaydi. <strong>"Aktivatsiyalangan bleomitsin"</strong> — 
            Fe(III)−OOH kompleksi — DNK dagi dezoksiribozani radikal mexanizm orqali uzadi.
            Asosan <strong>limfoma, testikulyar saraton va bosh-o'smalari</strong> da qo'llaniladi.
            <strong>O'pkaga toksik</strong> — asosiy nojo'ya ta'siri (pulmonar fibroz).
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-red-400 font-bold mb-3">Bleomitsin ta'sir mexanizmi:</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">1. Metall bog'lanish:</strong> BLM + Fe²⁺ → Fe(II)−BLM (1:1 kompleks)</p>
              <p><strong className="text-yellow-400">2. Kislorod aktivatsiyasi:</strong> Fe(II)−BLM + O₂ → Fe(III)−OOH−BLM ("aktivatsiyalangan bleomitsin")</p>
              <p><strong className="text-yellow-400">3. DNK hujumi:</strong> Fe(III)−OOH−BLM + DNK → DNK radikal + Fe(III)−BLM + H₂O</p>
              <p><strong className="text-yellow-400">4. DNK uzilishi:</strong> DNK radikal → zanjir uzilishi (asosan GC ketma-ketliklarida)</p>
              <p className="text-purple-300 mt-2"><strong>Selektivlik:</strong> Saraton hujayralarida BLM gidrolizlovchi ferment (BLM hidrolaza) kamroq — dori faol qoladi.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Ferroquine — <strong className="text-red-400">ferrosen + xloroxin gibridi</strong>, rezistentlikni yengadi</li>
            <li>Bleomitsin — <strong className="text-red-400">Fe²⁺ + O₂ → DNK uzilishi</strong>, testikulyar saratonda standart terapiya</li>
            <li>Ferrosen platformasi — <strong className="text-red-400">barqaror, lipofil, past toksik</strong></li>
            <li>Temir metabolizmi — <strong className="text-red-400">saraton hujayralarining zaif nuqtasi</strong> (TfR1 yuqori ekspressiyasi)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/metall-dorilar/oltin" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Au(I) komplekslari</Link>
          <Link href="/ilmiy/chuqurlashgan/metall-dorilar/boshqa" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Boshqa metall dori vositalari →</Link>
        </div>

      </section>
    </main>
  )
}