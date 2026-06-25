import Link from "next/link"

export default function RuteniyDorilar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/metall-dorilar" className="text-purple-400 hover:text-purple-300 text-lg">← Metall dori vositalari</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🔬 Ru(III) komplekslari</h1>
          <p className="text-purple-400 text-sm">NAMI-A • KP1019 • KP1339 • Antimetastatik • Transferrin • Aktivatsiya-qaytarilish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Ruteniy dori vositalari haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-purple-400">Ruteniy komplekslari</strong> — platina dori vositalariga 
              <strong className="text-purple-400"> muqobil sifatida</strong> ishlab chiqilgan. Ularning 
              asosiy afzalligi — <strong className="text-purple-400">antimetastatik faollik</strong> 
              (birlamchi o'simtadan tashqari, metastazlarga ham ta'sir qiladi). 
              <strong className="text-purple-400">NAMI-A</strong> — birinchi klinik sinovdan o'tgan 
              antimetastatik metall dori. Ru(III) komplekslari <strong>transferrin orqali tashiladi</strong> — 
              saraton hujayralari transferrin retseptorlarini ko'p ekspressiya qiladi (temirga bo'lgan 
              yuqori ehtiyoj tufayli). Bu <strong>targeted delivery</strong> imkonini beradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "NAMI-A", formula: "[ImH][RuCl₄(Im)(DMSO)]", im: "Im = imidazol", target: "Antimetastatik (o'pka metastazlari)",
                status: "Klinik sinov (I/II faza yakunlangan)", tox: "Yengil — qabziyat, ko'ngil aynishi",
                note: "Birinchi antimetastatik Ru dori. O'simta massasiga ta'sir qilmaydi, lekin metastazlarni kamaytiradi."
              },
              {
                name: "KP1019 (IT-139)", formula: "[IndH][RuCl₄(Ind)₂]", im: "Ind = indazol", target: "Birlamchi o'simta (kolorektal, o'pka)",
                status: "Klinik sinov (I faza yakunlangan, II faza)", tox: "O'rtacha — charchoq, anemiya",
                note: "O'simta hajmini kamaytiradi. Endoplazmatik retikulum stress orqali apoptoz."
              },
              {
                name: "KP1339 (BOLD-100)", formula: "Na[RuCl₄(Ind)₂]", im: "Ind = indazol (Na⁺ tuzi)", target: "Solid o'smalar (oshqozon, o'pka)",
                status: "Klinik sinov (I faza yakunlangan, II faza davom etmoqda)", tox: "Yengil — charchoq, giponatriemiya",
                note: "KP1019 ning yaxshilangan formulasi. Erishchanligi yuqori. GRP78 oqsilini targetlaydi."
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
                <h3 className="text-purple-400 font-bold font-mono text-sm">{r.name}</h3>
                <p className="text-purple-300 text-xs mt-1">{r.formula}</p>
                <p className="text-purple-500 text-xs mt-1">{r.im}</p>
                <div className="mt-3 space-y-1 text-xs">
                  <p><strong className="text-yellow-400">Target:</strong> {r.target}</p>
                  <p><strong className="text-green-400">Holat:</strong> {r.status}</p>
                  <p><strong className="text-red-400">Toksiklik:</strong> {r.tox}</p>
                </div>
                <p className="text-purple-400 text-xs mt-3 italic">{r.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. AKTIVATSIYA-QAYTARILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ "Aktivatsiya-qaytarilish" mexanizmi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-purple-400">Ru(III) komplekslari (d⁵, LS, S=1/2)</strong> kinetik inert — 
            ular qonda barqaror va ligand almashinmaydi. <strong>Saraton hujayralarining gipoksik 
            (kislorodsiz) va qaytaruvchi muhitida</strong> Ru(III) → Ru(II) ga qaytariladi. 
            Ru(II) (d⁶) labil — ligandlarni tez almashinadi va DNK/oqsillar bilan bog'lanadi. 
            Bu <strong>"aktivatsiya-qaytarilish" (activation-by-reduction)</strong> mexanizmi 
            sog'lom hujayralarda (oksidlovchi muhit) dori faolsiz qolishini ta'minlaydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Qonda (pH 7.4, oksidlovchi muhit)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Ru(III) — inert (d⁵ LS)</strong> — ligand almashmaydi</li>
                <li>• Transferrin bilan bog'lanadi (Fe³⁺ ni taqlid qiladi)</li>
                <li>• Qon oqsillari (albumin) bilan bog'lanadi</li>
                <li>• <strong>Barqaror — nojo'ya ta'sirlar kam!</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Saraton hujayrasida (gipoksik, qaytaruvchi)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Ru(III) + e⁻ → Ru(II)</strong> — qaytariladi</li>
                <li>• Qaytaruvchilar: GSH (10 mM), askorbat, NADH</li>
                <li>• <strong>Ru(II) — labil (d⁶)</strong> — ligand almashadi</li>
                <li>• DNK, oqsillar bilan bog'lanadi → apoptoz</li>
                <li>• <strong>Sog'lom hujayralarda bu jarayon sekin!</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. TRANSFERRIN TARGETING */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Transferrin orqali tashilish — tabiiy targeting</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-purple-400">Saraton hujayralari</strong> tez bo'linishi uchun 
            ko'p miqdorda temirga muhtoj. Shuning uchun ular <strong>transferrin retseptorlarini (TfR1) 
            haddan tashqari ko'p ekspressiya qiladi</strong> (normal hujayralarga nisbatan 10−100 marta ko'p).
            Ru(III) ionlari Fe³⁺ ga o'xshash (radius, zaryad) — <strong>transferrin Ru(III) ni 
            "temir deb adashtiradi"</strong> va saraton hujayrasiga yetkazib beradi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-purple-400 font-bold mb-3">Transferrin yo'li:</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">1.</strong> Transferrin (Tf) qonda aylanadi — 2 ta Fe³⁺ bog'lash joyi bor (~30% to'ldirilgan)</p>
              <p><strong className="text-yellow-400">2.</strong> Ru(III) bo'sh joylarga bog'lanadi (Fe³⁺ bilan raqobat qiladi)</p>
              <p><strong className="text-yellow-400">3.</strong> Tf-Ru kompleksi saraton hujayrasi yuzasidagi TfR1 ga bog'lanadi</p>
              <p><strong className="text-yellow-400">4.</strong> Endotsitoz — Tf-TfR1 kompleksi hujayra ichiga o'tadi</p>
              <p><strong className="text-yellow-400">5.</strong> Endosoma ichida pH pasayadi (pH 5.5) — Ru(III) ajraladi</p>
              <p><strong className="text-yellow-400">6.</strong> Ru(III) qaytariladi → Ru(II) faollashadi → apoptoz</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Ru(III) — <strong className="text-purple-400">kinetik inert prodrug</strong>, hujayrada Ru(II) ga qaytariladi</li>
            <li>NAMI-A — <strong className="text-purple-400">birinchi antimetastatik metall dori</strong></li>
            <li>Transferrin targeting — <strong className="text-purple-400">TfR1 haddan tashqari ekspressiyasi</strong> orqali</li>
            <li>"Aktivatsiya-qaytarilish" — <strong className="text-purple-400">sog'lom hujayralarda faolsiz</strong>, saraton hujayralarida faol</li>
            <li>KP1339 (BOLD-100) — <strong className="text-purple-400">GRP78 target</strong>, klinik sinovlarda davom etmoqda</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/metall-dorilar/platina" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Pt komplekslari</Link>
          <Link href="/ilmiy/chuqurlashgan/metall-dorilar/oltin" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Au(I) komplekslari →</Link>
        </div>

      </section>
    </main>
  )
}