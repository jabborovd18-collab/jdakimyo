import Link from "next/link"

export default function KCh5_6() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/koordinator-son" className="text-purple-400 hover:text-purple-300 text-lg">← Koordinator son</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🔷 KCh = 5−6: O'rta koordinator sonlar</h1>
          <p className="text-purple-400 text-sm">Trigonal bipiramida • Kvadrat piramida • Oktaedrik — eng ko'p uchraydigan geometriyalar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KCh = 5 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 KCh = 5 — Ikki xil geometriya</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-blue-400">KCh = 5</strong> — oraliq koordinator son. Ikkita asosiy geometriya mavjud: 
              <strong className="text-blue-400"> trigonal bipiramida (TBP, D₃h)</strong> va 
              <strong className="text-blue-400"> kvadrat piramida (C₄v)</strong>. 
              Ikkala geometriya energiyasi juda yaqin (farq ~1−5 kJ/mol) — 
              <strong> Berry psevdorotatsiyasi</strong> orqali o'zaro o'tadi. Bu KCh asosan 
              <strong> Fe⁰, Cu²⁺, VO²⁺, Mn²⁺</strong> komplekslarida uchraydi.
            </p>
          </div>

          {/* TBP */}
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-blue-400 font-bold mb-2">Trigonal bipiramida (TBP) — D₃h simmetriya</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ul className="text-purple-200 text-sm space-y-1">
                  <li>• <strong>3 ta ekvatorial</strong> ligand — 120° burchak ostida, bir tekislikda</li>
                  <li>• <strong>2 ta aksial</strong> ligand — tekislikka perpendikulyar, 180° burchak ostida</li>
                  <li>• <strong>Gibridlanish:</strong> sp³d (dsp³)</li>
                  <li>• <strong>Aksial bog'lar</strong> odatda ekvatorialdan uzunroq (sterik to'siq)</li>
                  <li>• <strong>Ekvatorial pozitsiya</strong> — kuchli π-akseptor ligandlar uchun afzal (CO, CN⁻)</li>
                </ul>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-300 text-xs font-semibold mb-1">TBP kompleks misollar:</p>
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-blue-800/30"><th className="text-left py-1 text-blue-300">Kompleks</th><th className="text-left py-1 text-blue-300">Metall</th><th className="text-left py-1 text-blue-300">Aks/ekv farqi</th></tr></thead>
                  <tbody className="text-purple-200">
                    {[["[Fe(CO)₅]","Fe⁰ (d⁸)","Fe−C(aks): 1.828 > Fe−C(ekv): 1.812 Å"],["[CuCl₅]³⁻","Cu²⁺ (d⁹)","Yahn-Teller: aksial uzun"],["[CdCl₅]³⁻","Cd²⁺ (d¹⁰)","~teng (d¹⁰ — KMN=0)"]].map((r,i)=>(<tr key={i} className="border-b border-blue-800/20"><td className="py-1 font-mono text-yellow-400">{r[0]}</td><td className="py-1">{r[1]}</td><td className="py-1 text-purple-300">{r[2]}</td></tr>))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Kvadrat piramida */}
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-blue-400 font-bold mb-2">Kvadrat piramida — C₄v simmetriya</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ul className="text-purple-200 text-sm space-y-1">
                  <li>• <strong>4 ta bazal</strong> ligand — kvadrat asosda, 90° burchak ostida</li>
                  <li>• <strong>1 ta apikal</strong> ligand — cho'qqida, bazal tekislikka perpendikulyar</li>
                  <li>• <strong>Apikal bog'</strong> odatda bazaldan qisqaroq (kuchliroq bog')</li>
                  <li>• <strong>Metall</strong> bazal tekislikdan biroz yuqorida (apikal ligand tomon)</li>
                </ul>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-300 text-xs font-semibold mb-1">Kvadrat piramida misollar:</p>
                <p className="text-purple-200 text-xs">[VO(acac)₂] — V=O apikal, 4 ta O bazal</p>
                <p className="text-purple-200 text-xs">[Cu(NH₃)₅]²⁺ — Yahn-Teller, apikal NH₃ uzoqroq</p>
                <p className="text-purple-200 text-xs">[Ni(CN)₅]³⁻ — oraliq holat</p>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-yellow-400 font-bold mb-2">TBP ↔ Kvadrat piramida o'tish — Berry psevdorotatsiyasi</h3>
            <p className="text-purple-200 text-sm">
              Ikkala geometriya orasidagi energetik to'siq juda past (~5 kJ/mol). 
              Xona haroratida ular NMR vaqt shkalasida bir-biriga o'tadi. 
              Qattiq fazada kristall maydon geometriyadan birini "muzlatib" qo'yadi. 
              Batafsil: <Link href="/ilmiy/chuqurlashgan/koordinator-son/berry-psevdorotatsiya" className="text-blue-400 underline">Berry psevdorotatsiyasi sahifasi</Link>
            </p>
          </div>
        </div>

        {/* KCh = 6 — OKTAEDRIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 KCh = 6 — Oktaedrik geometriya (Oh) — ENG KO'P UCHRAYDIGANI</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-green-400">Oktaedrik (Oh)</strong> — koordinatsion kimyoda 
              <strong className="text-green-400"> eng muhim va eng ko'p uchraydigan</strong> geometriya.
              3d metallarning deyarli barcha komplekslari oktaedrik yoki buzilgan oktaedrik geometriyaga ega.
              6 ta ligand <strong>90°</strong> burchak ostida joylashgan. <strong>d²sp³</strong> (ichki orbital) 
              yoki <strong>sp³d²</strong> (tashqi orbital) gibridlanish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Ichki orbital (d²sp³) — past spinli</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Gibridlanish:</strong> (n−1)d² ns⁰ np³</li>
                <li>• <strong>Elektronlar:</strong> juftlashgan (past spinli)</li>
                <li>• <strong>Misol:</strong> [Co(NH₃)₆]³⁺ — Co³⁺ d⁶ LS, diamagnit</li>
                <li>• <strong>Misol:</strong> [Fe(CN)₆]⁴⁻ — Fe²⁺ d⁶ LS, diamagnit</li>
                <li>• <strong>Misol:</strong> [Cr(H₂O)₆]³⁺ — Cr³⁺ d³ (har doim LS)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Tashqi orbital (sp³d²) — yuqori spinli</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Gibridlanish:</strong> ns⁰ np³ nd²</li>
                <li>• <strong>Elektronlar:</strong> juftlashmagan (yuqori spinli)</li>
                <li>• <strong>Misol:</strong> [Fe(H₂O)₆]²⁺ — Fe²⁺ d⁶ HS, paramagnit</li>
                <li>• <strong>Misol:</strong> [CoF₆]³⁻ — Co³⁺ d⁶ HS, paramagnit</li>
                <li>• <strong>Misol:</strong> [Fe(H₂O)₆]³⁺ — Fe³⁺ d⁵ HS, paramagnit</li>
              </ul>
            </div>
          </div>

          {/* Oktaedrik buzilishlar */}
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-green-400 font-bold mb-3">Oktaedrik buzilish turlari</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
                <h4 className="text-yellow-400 font-semibold text-sm mb-2">Tetragonal cho'zilish</h4>
                <p className="text-purple-300 text-xs">z o'qi bo'yicha 2 ta bog' uzun, 4 ta bog' qisqa. d⁹ (Cu²⁺), d⁴ (Cr²⁺, Mn³⁺) — Yahn-Teller faol</p>
                <p className="text-yellow-400 text-xs mt-2 font-mono">[Cu(H₂O)₆]²⁺: Cu−O(ekv)=1.97, Cu−O(aks)=2.28 Å</p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                <h4 className="text-blue-400 font-semibold text-sm mb-2">Tetragonal siqilish</h4>
                <p className="text-purple-300 text-xs">z o'qi bo'yicha 2 ta bog' qisqa, 4 ta bog' uzun. Kam uchraydi — d⁸ LS (Ni²⁺ kvadrat planar chegarasi)</p>
                <p className="text-blue-400 text-xs mt-2 font-mono">[Ni(CN)₆]⁴⁻: Ni−C(aks)=1.87, Ni−C(ekv)=1.95 Å</p>
              </div>
              <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-4">
                <h4 className="text-purple-400 font-semibold text-sm mb-2">Rombik buzilish</h4>
                <p className="text-purple-300 text-xs">Barcha 3 o'q bo'yicha turli uzunlikdagi bog'lar. Kristall maydon effekti yoki turli ligandlar ta'sirida</p>
                <p className="text-purple-400 text-xs mt-2 font-mono">[Cu(acac)₂]: Cu−O 1.91−1.95 Å</p>
              </div>
            </div>
          </div>

          {/* Oktaedrik komplekslar jadvali */}
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-green-400 font-bold mb-3">Klassik oktaedrik komplekslar</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 px-3 text-purple-400">Kompleks</th><th className="text-left py-2 px-3 text-purple-400">Metall</th><th className="text-left py-2 px-3 text-purple-400">dⁿ</th><th className="text-left py-2 px-3 text-purple-400">Spin</th><th className="text-left py-2 px-3 text-purple-400">μ (BM)</th><th className="text-left py-2 px-3 text-purple-400">Rang</th><th className="text-left py-2 px-3 text-purple-400">Buzilish</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["[Cr(H₂O)₆]³⁺","Cr³⁺","d³","4 (LS)","3.87","Yashil-binafsha","Yo'q (ideal Oh)"],["[Co(NH₃)₆]³⁺","Co³⁺","d⁶","0 (LS)","0","Sariq-to'q sariq","Yo'q"],["[Fe(CN)₆]⁴⁻","Fe²⁺","d⁶","0 (LS)","0","Sariq","Yo'q"],["[Fe(H₂O)₆]²⁺","Fe²⁺","d⁶","4 (HS)","5.1−5.5","Yashil","Kuchsiz"],["[Cu(H₂O)₆]²⁺","Cu²⁺","d⁹","1","1.9−2.0","Ko'k","Kuchli (Yahn-Teller)"],["[Fe(CN)₆]³⁻","Fe³⁺","d⁵","1 (LS)","2.0−2.3","Qizil","Yo'q"],["[CoF₆]³⁻","Co³⁺","d⁶","4 (HS)","5.0−5.4","Ko'k","Yo'q"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-2 px-3 font-mono text-yellow-400 text-xs">{r[0]}</td><td className="py-2 px-3 text-xs">{r[1]}</td><td className="py-2 px-3">{r[2]}</td><td className="py-2 px-3">{r[3]}</td><td className="py-2 px-3">{r[4]}</td><td className="py-2 px-3 text-xs">{r[5]}</td><td className="py-2 px-3 text-xs">{r[6]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* KMN — Oktaedrik */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔮 Oktaedrik KMN — d-orbital bo'linishi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Oktaedrik maydonda 5 ta d-orbital ikki guruhga ajraladi: 
            <strong className="text-green-400"> t₂g (dxy, dxz, dyz)</strong> — past energiyali, 
            <strong className="text-red-400"> eg (dz², dx²−y²)</strong> — yuqori energiyali. 
            Ajralish energiyasi <strong className="text-yellow-400">Δo (yoki 10Dq)</strong>. 
            Kuchli maydon ligandlari (CN⁻, CO) katta Δo beradi → past spinli komplekslar. 
            Kuchsiz maydon ligandlari (Cl⁻, H₂O, F⁻) kichik Δo → yuqori spinli komplekslar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
              <h3 className="text-green-400 font-bold mb-2">Katta Δo — Past spinli (LS)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>d⁴:</strong> t₂g⁴ eg⁰ (S=1) — [Cr(CN)₆]⁴⁻</li>
                <li>• <strong>d⁵:</strong> t₂g⁵ eg⁰ (S=1/2) — [Fe(CN)₆]³⁻</li>
                <li>• <strong>d⁶:</strong> t₂g⁶ eg⁰ (S=0) — [Co(NH₃)₆]³⁺, [Fe(CN)₆]⁴⁻</li>
                <li>• <strong>d⁷:</strong> t₂g⁶ eg¹ (S=1/2) — [Co(CN)₆]⁴⁻</li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
              <h3 className="text-red-400 font-bold mb-2">Kichik Δo — Yuqori spinli (HS)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>d⁴:</strong> t₂g³ eg¹ (S=2) — [Cr(H₂O)₆]²⁺</li>
                <li>• <strong>d⁵:</strong> t₂g³ eg² (S=5/2) — [Fe(H₂O)₆]³⁺</li>
                <li>• <strong>d⁶:</strong> t₂g⁴ eg² (S=2) — [Fe(H₂O)₆]²⁺</li>
                <li>• <strong>d⁷:</strong> t₂g⁵ eg² (S=3/2) — [Co(H₂O)₆]²⁺</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>KCh=5 — <strong className="text-blue-400">TBP va kvadrat piramida</strong> o'rtasidagi farq ~1−5 kJ/mol</li>
            <li>KCh=6 — <strong className="text-green-400">eng ko'p uchraydigan</strong> geometriya, 3d metallar uchun asosiy</li>
            <li>Oktaedrik KMN — <strong className="text-yellow-400">Δo</strong> ligand maydon kuchiga bog'liq (spektrokimyoviy qator)</li>
            <li>Yahn-Teller effekti — <strong className="text-red-400">d⁴ va d⁹</strong> konfiguratsiyalarda oktaedr buziladi</li>
            <li>Ichki orbital (d²sp³) = kuchli maydon, <strong>past spinli</strong>; Tashqi orbital (sp³d²) = kuchsiz maydon, <strong>yuqori spinli</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/koordinator-son/kch-2-4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← KCh = 2−4</Link>
          <Link href="/ilmiy/chuqurlashgan/koordinator-son/kch-7-12" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">KCh = 7−12 →</Link>
        </div>

      </section>
    </main>
  )
}