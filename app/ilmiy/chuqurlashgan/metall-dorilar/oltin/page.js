import Link from "next/link"

export default function OltinDorilar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/metall-dorilar" className="text-purple-400 hover:text-purple-300 text-lg">← Metall dori vositalari</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">✨ Au(I) komplekslari</h1>
          <p className="text-purple-400 text-sm">Auranofin • Xrizoterapiya • Tioridoksin reduktaza • Revmatoid artrit</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Oltin dori vositalari haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Xrizoterapiya (oltin terapiyasi)</strong> — 
              tibbiyot tarixidagi <strong className="text-yellow-400">eng qadimiy metall dori</strong> yo'nalishlaridan biri.
              1920-yillarda Robert Koch oltin birikmalarining silga qarshi faolligini kashf etgan.
              Hozirda <strong className="text-yellow-400">Au(I) komplekslari</strong> asosan 
              <strong className="text-yellow-400">revmatoid artrit</strong>ni davolashda qo'llaniladi.
              <strong>Auranofin (1985, FDA)</strong> — og'iz orqali qabul qilinadigan birinchi oltin dori.
              So'nggi tadqiqotlar auranofinning <strong>saraton, bakterial infeksiyalar va parazitar 
              kasalliklarga</strong> qarshi ham faolligini ko'rsatmoqda — "eski dorining qayta kashf etilishi".
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Au(I) — Nima uchun oltin?</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>d¹⁰ konfiguratsiya</strong> — KMN stabilizatsiyasi yo'q (KMN=0)</li>
                <li>• <strong>Chiziqli geometriya</strong> — ikkita ligand bilan koordinatsiyalanadi</li>
                <li>• <strong>"Yumshoq" Lyuis kislota</strong> — tiolat (RS⁻) va selenolat (RSe⁻) ligandlarni afzal ko'radi</li>
                <li>• <strong>Tioredoksin reduktaza (TrxR)</strong> — asosiy molekulyar target</li>
                <li>• Au(I) → Au(III) oksidlanishi mumkin (kuchli oksidlovchilar ta'sirida)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Asosiy Au(I) dori vositalari</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">Dori</th><th className="text-left py-2 text-yellow-400">Formula</th><th className="text-left py-2 text-purple-300">Qo'llanish</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["Auranofin","Au(PEt₃)(TATG) — og'iz orqali","Revmatoid artrit (FDA 1985)"],["Natriy aurotiomalat","Au(SC₄H₃O₃)Na — inyeksiya","Revmatoid artrit (og'ir formalar)"],["Aurotioglyukoza","Au(SC₆H₁₁O₅) — inyeksiya","Revmatoid artrit (moy suspensiyasi)"],["Natriy aurotiosulfat","Na₃[Au(S₂O₃)₂] — inyeksiya","Revmatoid artrit (kam qo'llaniladi)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5 font-mono text-yellow-400">{r[0]}</td><td className="py-1.5 text-xs">{r[1]}</td><td className="py-1.5 text-xs">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. TRXR INGIBITORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Tioredoksin reduktaza (TrxR) — asosiy molekulyar target</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">Tioredoksin reduktaza (TrxR)</strong> — hujayraning 
            <strong>antioksidant himoya tizimining</strong> muhim fermenti. Uning faol markazida 
            <strong>selenotsistein (Sec) qoldig'i</strong> mavjud — bu noyob aminokislota 
            Au(I) uchun <strong>ideal "yumshoq" bog'lanish joyi</strong>. Auranofin TrxR ning 
            Sec qoldig'iga bog'lanib, fermentni <strong>qaytmas ingibirlaydi</strong>. Natijada 
            hujayrada <strong>oksidlovchi stress</strong> kuchayadi va apoptoz boshlanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold text-sm mb-2">TrxR ingibirlanishi oqibatlari:</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Tioredoksin (Trx)</strong> oksidlangan holda qoladi — qaytarilmaydi</li>
                <li>• <strong>Ribonukleotid reduktaza (RNR)</strong> faolligi pasayadi — DNK sintezi buziladi</li>
                <li>• <strong>H₂O₂ va ROOH</strong> to'planadi — oksidlovchi stress kuchayadi</li>
                <li>• <strong>ASK1 signal yo'li</strong> aktivlanadi → apoptoz</li>
                <li>• <strong>Mitoxondriya membranasi potensiali</strong> buziladi → sitoxrom c ajraladi</li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold text-sm mb-2">Nima uchun saraton hujayralari sezgir?</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• Saraton hujayralarida <strong>ROS darajasi yuqori</strong> — antioksidant himoyaga muhtoj</li>
                <li>• TrxR haddan tashqari ekspressiyalangan (normal hujayralarga nisbatan)</li>
                <li>• TrxR ingibirlanishi — "oxirgi tomchi" effekti → apoptoz</li>
                <li>• Sog'lom hujayralarda antioksidant zaxiralar yetarli — kamroq ta'sir</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. QAYTA KASHF ETILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Auranofinning "qayta kashf etilishi" — yangi ko'rsatmalar</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            So'nggi 10 yilda auranofin <strong>"dori qayta ishlatish" (drug repurposing)</strong> 
            dasturlarida keng o'rganilmoqda. Uning TrxR ingibirlash xossasi ko'plab kasalliklarda 
            foydali ekanligi aniqlandi:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { disease: "Saraton", target: "TrxR (saraton hujayralarida)", status: "Klinik sinov (II faza — tuxumdon, o'pka saratoni)", note: "Sisplatin bilan kombinatsiyada sinergizm" },
              { disease: "Bakterial infeksiyalar", target: "TrxR (bakteriya hujayralarida)", status: "Tadqiqot bosqichida", note: "MRSA, H. pylori, M. tuberculosis ga qarshi faol" },
              { disease: "Amyobiaz (parazitar)", target: "Entamoeba histolytica TrxR", status: "Klinik sinov (II faza)", note: "Metronidazolga muqobil" },
              { disease: "COVID-19", target: "Virus oqsillari (PLpro)", status: "Tadqiqot bosqichida", note: "SARS-CoV-2 replikatsiyasini ingibirlaydi" },
            ].map((r, i) => (
              <div key={i} className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
                <h3 className="text-yellow-400 font-bold text-sm mb-2">{r.disease}</h3>
                <p className="text-purple-200 text-xs"><strong>Target:</strong> {r.target}</p>
                <p className="text-green-400 text-xs mt-1"><strong>Holati:</strong> {r.status}</p>
                <p className="text-purple-400 text-xs mt-1">{r.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Au(I) — <strong className="text-yellow-400">yumshoq Lyuis kislota</strong>, tiolat va selenolat ligandlarni afzal ko'radi</li>
            <li>TrxR — <strong className="text-yellow-400">asosiy molekulyar target</strong>, selenotsistein qoldig'iga bog'lanadi</li>
            <li>Auranofin — <strong className="text-yellow-400">og'iz orqali qabul qilinadigan</strong> yagona oltin dori</li>
            <li>Drug repurposing — <strong className="text-yellow-400">saraton, infeksiyalar, COVID-19</strong> uchun yangi ko'rsatmalar</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/metall-dorilar/ruteniy" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Ru(III) komplekslari</Link>
          <Link href="/ilmiy/chuqurlashgan/metall-dorilar/temir" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Fe komplekslari →</Link>
        </div>

      </section>
    </main>
  )
}