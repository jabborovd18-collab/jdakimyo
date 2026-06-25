import Link from "next/link"

export default function Mexanizmlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/metall-dorilar" className="text-purple-400 hover:text-purple-300 text-lg">← Metall dori vositalari</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">⚡ Ta'sir mexanizmlari</h1>
          <p className="text-purple-400 text-sm">DNK bilan bog'lanish • Oqsillar bilan ta'sir • Redoks aktivatsiya • ICD</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Metall dori vositalarining ta'sir mexanizmlari</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-cyan-400">Metall dori vositalari</strong> organik dorilardan farqli o'laroq, 
              <strong className="text-cyan-400"> ko'p tomonlama va murakkab ta'sir mexanizmlariga</strong> ega.
              Ular bir vaqtning o'zida <strong>DNK, oqsillar, membranalar va redoks muvozanatiga</strong> 
              ta'sir qilishi mumkin. Bu ko'p targetli ta'sir <strong>rezistentlik rivojlanishini 
              qiyinlashtiradi</strong>. Asosiy mexanizmlar: DNK bilan kovalent bog'lanish (Pt), 
              oqsillar bilan koordinatsion bog'lanish (Au, Ru), redoks sikllar (Fe, Cu), 
              prodrug aktivatsiyasi (Pt(IV), Ru(III)), immunogen hujayra o'limi (ICD).
            </p>
          </div>
        </div>

        {/* 2. ASOSIY MEXANIZMLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Asosiy molekulyar targetlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "DNK — kovalent bog'lanish",
                metals: "Pt(II), Ru(II), Cu(II)",
                desc: "Metall ioni DNK asoslarining nukleofil markazlariga (guanin N7, adenin N7) kovalent bog'lanadi. Cross-linking (intrastrand, interstrand) DNK strukturasini buzadi → replikatsiya va transkripsiya bloklanadi.",
                example: "Sisplatin: 1,2-intrastrand GpG cross-link (60−65%)"
              },
              {
                title: "Oqsillar — koordinatsion bog'lanish",
                metals: "Au(I), Ru(III), Pt(II)",
                desc: "Metall ioni oqsillarning sistein (Cys), selenotsistein (Sec), metionin (Met) va gistidin (His) qoldiqlariga bog'lanadi. Ferment faol markazlari bloklanadi yoki oqsil konformatsiyasi o'zgaradi.",
                example: "Auranofin: TrxR — Sec qoldig'iga bog'lanadi"
              },
              {
                title: "Redoks sikllar — ROS hosil qilish",
                metals: "Fe(II/III), Cu(I/II), V(IV/V)",
                desc: "Metall ioni Fenton tipidagi reaksiyalar orqali reaktiv kislorod turlarini (•OH, O₂•⁻, H₂O₂) hosil qiladi. Oksidlovchi stress → lipid peroksidlanishi, DNK oksidlanishi, oqsil karbonillanishi.",
                example: "Bleomitsin: Fe(II) + O₂ → Fe(III)−OOH (DNK ni uzadi)"
              },
              {
                title: "Membrana va mitoxondriya",
                metals: "Ru(III), Ga(III), Cu(II)",
                desc: "Metall komplekslari hujayra membranasiga joylashib, o'tkazuvchanlikni o'zgartiradi yoki mitoxondriya membranasi potensialini buzadi. Sitoxrom c ajralishi → kaspaza kaskadi → apoptoz.",
                example: "KP1019: Endoplazmatik retikulum stress → apoptoz"
              },
            ].map((r, i) => (
              <div key={i} className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5">
                <h3 className="text-cyan-400 font-bold text-sm mb-2">{r.title}</h3>
                <p className="text-yellow-400 text-xs mb-2"><strong>Metallar:</strong> {r.metals}</p>
                <p className="text-purple-200 text-xs mb-2">{r.desc}</p>
                <p className="text-cyan-300 text-xs italic"><strong>Misol:</strong> {r.example}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. PRODRUG STRATEGIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💊 Prodrug strategiyasi — selektiv aktivatsiya</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-cyan-400">Prodrug</strong> — faolsiz holda yuborilib, 
            <strong>organizmda faol shaklga aylanadigan</strong> dori vositasi. Metall dori vositalarida 
            prodrug strategiyasi <strong>nojo'ya ta'sirlarni kamaytirish</strong> va 
            <strong>selektivlikni oshirish</strong> uchun qo'llaniladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs">
            {[
              {
                title: "Pt(IV) → Pt(II)",
                inactive: "Pt(IV) — oktaedrik, inert",
                activation: "Saraton hujayrasida qaytariladi (GSH, askorbat)",
                active: "Pt(II) — kvadrat planar, faol",
                drugs: "Satraplatin, LA-12, Asplatin"
              },
              {
                title: "Ru(III) → Ru(II)",
                inactive: "Ru(III) — d⁵ LS, inert",
                activation: "Gipoksik/qaytaruvchi muhitda qaytariladi",
                active: "Ru(II) — d⁶, labil",
                drugs: "NAMI-A, KP1019, KP1339"
              },
              {
                title: "Fotodinamik terapiya (PDT)",
                inactive: "Ru(II), Ir(III) — qorong'ida faolsiz",
                activation: "Yorug'lik ta'sirida (450−650 nm)",
                active: "³MLCT → ¹O₂ (singlet kislorod)",
                drugs: "TLD-1433 (Ru), Ir(ppy)₃"
              },
            ].map((r, i) => (
              <div key={i} className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-4">
                <p className="text-cyan-400 font-bold">{r.title}</p>
                <p className="text-purple-300 mt-2">{r.inactive}</p>
                <p className="text-yellow-400 mt-1">{r.activation}</p>
                <p className="text-green-400 mt-1">{r.active}</p>
                <p className="text-purple-500 text-xs mt-2 italic">{r.drugs}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. ICD */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🛡️ Immunogen hujayra o'limi (ICD)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-cyan-400">Immunogen hujayra o'limi (ICD)</strong> — metall dori vositalarining 
            eng yangi kashf etilgan ta'sir mexanizmi. Ba'zi komplekslar (ayniqsa, oksaliplatin va Pt(IV) 
            prodruglar) saraton hujayralarini <strong>immun tizimi tomonidan "tanib olinadigan"</strong> 
            tarzda o'ldiradi. Bunda hujayra yuzasida <strong>DAMP (Damage-Associated Molecular Patterns)</strong> 
            signallari paydo bo'ladi — kalretikulin (CRT), HMGB1, ATP ajralishi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-cyan-400 font-bold mb-3">ICD bosqichlari:</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">1. Endoplazmatik retikulum (ER) stress:</strong> Metall dori ER stressni keltirib chiqaradi → ROS to'planadi → kalretikulin (CRT) ER dan hujayra yuzasiga chiqadi.</p>
              <p><strong className="text-yellow-400">2. DAMP signallari:</strong> CRT — "meni yeng" signali (dendrit hujayralarni jalb qiladi). HMGB1 — TLR4 orqali dendrit hujayralarni aktivlashtiradi. ATP — "top meni" signali (ximotaksis).</p>
              <p><strong className="text-yellow-400">3. Immun javob:</strong> Dendrit hujayralar o'simta antigenlarini T-hujayralarga taqdim etadi. CD8⁺ T-limfotsitlar faollashadi va saraton hujayralariga hujum qiladi.</p>
              <p className="text-cyan-300 mt-2"><strong>Natija:</strong> Kimyoterapiyadan keyin ham immun "xotira" saqlanadi — metastazlar va residivlardan himoya!</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Ko'p targetli ta'sir — <strong className="text-cyan-400">DNK + oqsillar + membranalar</strong> bir vaqtda</li>
            <li>Prodrug strategiyasi — <strong className="text-cyan-400">selektiv aktivatsiya</strong> (Pt(IV)→Pt(II), Ru(III)→Ru(II))</li>
            <li>Redoks mexanizmlar — <strong className="text-cyan-400">Fenton reaksiyasi, ROS hosil qilish</strong></li>
            <li>ICD — <strong className="text-cyan-400">immun tizimini jalb qilish</strong>, uzoq muddatli himoya</li>
            <li>Kelajak — <strong className="text-cyan-400">personalizatsiyalangan metall dori terapiyasi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/metall-dorilar/boshqa" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Boshqa metall dori vositalari</Link>
          <Link href="/ilmiy/chuqurlashgan/supramolekulyar" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">Supramolekulyar komplekslar →</Link>
        </div>

      </section>
    </main>
  )
}