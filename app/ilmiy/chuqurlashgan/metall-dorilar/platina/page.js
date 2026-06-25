import Link from "next/link"

export default function PlatinaDorilar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/metall-dorilar" className="text-purple-400 hover:text-purple-300 text-lg">← Metall dori vositalari</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">💊 Pt(II) va Pt(IV) komplekslari</h1>
          <p className="text-purple-400 text-sm">Sisplatin • Karboplatin • Oksaliplatin • DNK cross-linking • Rezistentlik</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Platina dori vositalari haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-blue-400">Platina komplekslari</strong> — onkologiyada 
              <strong className="text-blue-400"> eng ko'p qo'llaniladigan metall dori vositalari</strong>.
              <strong>Sisplatin (1978)</strong> — FDA tomonidan tasdiqlangan birinchi metall dori.
              Hozirda <strong>saraton kimyoterapiyasining 50% dan ko'prog'ida</strong> platina dori vositalari 
              qo'llaniladi. Ularning ta'sir mexanizmi — <strong className="text-blue-400">DNK bilan 
              kovalent bog'lanish (cross-linking)</strong> orqali replikatsiya va transkripsiyani to'xtatish.
              Asosiy muammo — <strong>rezistentlik (chidamlilik) va nojo'ya ta'sirlar</strong> 
              (nefrotoksiklik, neyrotoksiklik, ototoksiklik).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Sisplatin", formula: "sis-[PtCl₂(NH₃)₂]", year: "1978 (FDA)", target: "Tuxumdon, moyak, qovuq saratoni",
                dose: "60−120 mg/m²", toxicity: "Nefrotoksik (+++), Neyrotoksik (+), Emetogen (+++)",
                note: "Birinchi avlod. Eng kuchli, lekin eng toksik."
              },
              {
                name: "Karboplatin", formula: "[Pt(CBDCA)(NH₃)₂]", year: "1989 (FDA)", target: "Tuxumdon, o'pka saratoni",
                dose: "300−600 mg/m² (Kalvert formulasi)", toxicity: "Miyelosupressiya (+++), Nefrotoksik (+)",
                note: "Ikkinchi avlod. Sisplatindan kam toksik, lekin miyelosupressiya."
              },
              {
                name: "Oksaliplatin", formula: "[Pt(DACH)(oxalato)]", year: "1996 (FDA)", target: "Kolorektal saraton (FOLFOX)",
                dose: "85−130 mg/m²", toxicity: "Neyrotoksik (+++ — sovuq giperesteziyasi), Nefrotoksik (−)",
                note: "Uchinchi avlod. Sisplatin-rezistent saratonlarda faol."
              },
            ].map((r, i) => (
              <div key={i} className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                <h3 className="text-blue-400 font-bold font-mono text-sm">{r.name}</h3>
                <p className="text-purple-300 text-xs mt-1">{r.formula}</p>
                <div className="mt-3 space-y-1 text-xs">
                  <p><strong className="text-yellow-400">FDA:</strong> {r.year}</p>
                  <p><strong className="text-green-400">Target:</strong> {r.target}</p>
                  <p><strong className="text-purple-300">Doza:</strong> {r.dose}</p>
                  <p><strong className="text-red-400">Toksiklik:</strong> {r.toxicity}</p>
                </div>
                <p className="text-purple-400 text-xs mt-3 italic">{r.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. TA'SIR MEXANIZMI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧬 DNK cross-linking — asosiy ta'sir mexanizmi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-blue-400">Sisplatinning ta'sir mexanizmi</strong> 4 bosqichdan iborat:
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <div className="space-y-3 text-sm text-purple-200">
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                <p><strong className="text-yellow-400">1. Hujayra ichiga kirish:</strong> Sisplatin passiv diffuziya yoki CTR1 (copper transporter 1) orqali hujayra ichiga kiradi. Qonda Cl⁻ konsentratsiyasi yuqori (~100 mM) — sisplatin neytral holda saqlanadi.</p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                <p><strong className="text-yellow-400">2. Akvatsiya (aktivatsiya):</strong> Hujayra ichida [Cl⁻] past (~4−20 mM) — Cl⁻ ligandlari H₂O bilan almashinadi: sis-[PtCl₂(NH₃)₂] + 2H₂O → sis-[Pt(H₂O)₂(NH₃)₂]²⁺ + 2Cl⁻. Hosil bo'lgan akva kompleks kuchli elektrofil — DNK asoslari bilan reaksiyaga kirishadi.</p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                <p><strong className="text-yellow-400">3. DNK bilan bog'lanish:</strong> Pt²⁺ asosan guanin N7 atomiga bog'lanadi (eng nukleofil markaz). 1,2-intrastrand cross-link: Pt ikkita qo'shni guanin asosini bog'laydi (~60−65%). 1,3-intrastrand (~20−30%), interstrand (~5−10%), DNK-oqsil cross-link (~5%).</p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                <p><strong className="text-yellow-400">4. Apoptoz:</strong> DNK-Pt adduktlari DNK strukturasini buzadi (egilish ~32−40°). Bu zararlanish hujayra tomonidan tan olinadi → p53, ATM, ATR signallari → apoptoz (dasturlashtirilgan hujayra o'limi).</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
              <h3 className="text-green-400 font-bold text-sm mb-2">Nima uchun aynan guanin N7?</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• Guanin N7 — DNK asoslari orasida <strong>eng nukleofil markaz</strong></li>
                <li>• N7 pozitsiyasi DNK katta ariqchasida (major groove) — oson kirish</li>
                <li>• Vodorod bog'lari hosil qilmaydi — erkin</li>
                <li>• Pt−N7(G) bog'i termodinamik juda barqaror</li>
              </ul>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
              <h3 className="text-yellow-400 font-bold text-sm mb-2">DNK-Pt adduktlarining oqibatlari</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• DNK qo'sh spiralining <strong>egilishi</strong> (~32−40°)</li>
                <li>• <strong>Replikatsiya bloklanadi</strong> — hujayra bo'linishi to'xtaydi</li>
                <li>• <strong>Transkripsiya bloklanadi</strong> — oqsil sintezi buziladi</li>
                <li>• HMGB1 oqsillari Pt-DNK adduktini "tanib oladi" — reparatsiyani bloklaydi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. REZISTENTLIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚠️ Platina dori vositalariga rezistentlik mexanizmlari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-blue-400">Rezistentlik</strong> — platina terapiyasining asosiy muammosi.
            Hujayralar bir nechta mexanizmlar orqali sisplatinga chidamli bo'lib qoladi:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "1. Kamaygan hujayra ichiga kirish", desc: "CTR1 ekspressiyasi pasayishi — Pt kamroq kiradi. ATP7A/ATP7B efflux nasoslari — Pt ni hujayradan chiqaradi." },
              { title: "2. Ko'tarilgan detoksifikatsiya", desc: "Glutation (GSH) va metallotioneinlar (MT) — Pt ni bog'lab, faolsizlantiradi. GSH-Pt konjugati hujayradan chiqariladi." },
              { title: "3. Kuchaygan DNK reparatsiyasi", desc: "NER (Nucleotide Excision Repair) — Pt-DNK adduktlarini kesib tashlaydi. ERCC1 yuqori ekspressiyasi — yomon prognoz belgisi." },
              { title: "4. Apoptozga chidamlilik", desc: "p53 mutatsiyalari (50% saratonlarda) — apoptoz signali bloklanadi. Bcl-2 yuqori ekspressiyasi — antiapoptoz oqsil." },
            ].map((r, i) => (
              <div key={i} className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h3 className="text-red-400 font-bold text-sm mb-2">{r.title}</h3>
                <p className="text-purple-200 text-xs">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Pt(IV) PRODRUGLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Pt(IV) prodruglar — yangi avlod</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-blue-400">Pt(IV) komplekslari (d⁶, oktaedrik)</strong> — 
            <strong>kinetik inert</strong> bo'lgani uchun qonda barqaror. Hujayra ichida 
            <strong>qaytariluvchi muhitda</strong> (GSH, askorbat) Pt(II) ga qaytariladi va 
            faollashadi. Bu <strong>prodrug strategiyasi</strong> nojo'ya ta'sirlarni kamaytirish 
            va og'iz orqali qabul qilish imkonini beradi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs">
            {[
              { name: "Satraplatin", formula: "Pt(IV)Cl₂(NH₃)(C₆H₁₁NH₂)(OAc)₂", status: "Klinik sinov (III faza)", note: "Birinchi og'iz orqali Pt dori. Mielosupressiya." },
              { name: "LA-12", formula: "Pt(IV)Cl₂(NH₃)(C₆H₁₁NH₂)(OAc)₂(ada)", status: "Klinik sinov (I faza)", note: "Adamantil guruhi — lipofillik. Sisplatin-rezistent hujayralarda faol." },
              { name: "Asplatin", formula: "sis-[Pt(NH₃)₂Cl₂(aspirin)₂]", status: "Tadqiqot bosqichida", note: "Aspirin ligandlari — COX-2 ingibitori. Yallig'lanishga qarshi + sitostatik." },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <p className="text-blue-400 font-bold font-mono">{r.name}</p>
                <p className="text-purple-300 mt-1">{r.formula}</p>
                <p className="text-yellow-400 mt-2">{r.status}</p>
                <p className="text-purple-400 mt-1">{r.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Sisplatin — <strong className="text-blue-400">DNK cross-linking</strong> orqali apoptozni induksiyalaydi</li>
            <li>Akvatsiya — <strong className="text-blue-400">hujayra ichida Cl⁻ → H₂O almashinuvi</strong> faollashtirish bosqichi</li>
            <li>Rezistentlik — <strong className="text-blue-400">4 ta asosiy mexanizm</strong> (kirish, detoks, reparatsiya, apoptoz)</li>
            <li>Pt(IV) prodruglar — <strong className="text-blue-400">kinetik inert, hujayrada qaytariladi</strong></li>
            <li>Sisplatin hozirda <strong className="text-blue-400">saraton kimyoterapiyasining 50%+</strong> da qo'llaniladi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/metall-dorilar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Metall dori vositalari</Link>
          <Link href="/ilmiy/chuqurlashgan/metall-dorilar/ruteniy" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Ru(III) komplekslari →</Link>
        </div>

      </section>
    </main>
  )
}