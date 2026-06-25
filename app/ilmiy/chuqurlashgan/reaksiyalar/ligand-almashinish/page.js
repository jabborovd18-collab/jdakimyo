import Link from "next/link"

export default function LigandAlmashinish() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/reaksiyalar" className="text-purple-400 hover:text-purple-300 text-lg">← Reaksiyalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🔄 Ligand almashinish reaksiyalari</h1>
          <p className="text-purple-400 text-sm">D, A, I mexanizmlar • Trans-ta'sir • Kinetik trans-effekt • Eyring tenglamasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Ligand almashinish reaksiyalari haqida</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-green-400">Ligand almashinish</strong> — kompleks birikmalarning 
              <strong className="text-green-400"> eng fundamental reaksiyasi</strong>. Bu jarayonda bir yoki bir nechta 
              ligand boshqa ligand(lar) bilan almashinadi. Reaksiya mexanizmi <strong>D (dissotsiativ)</strong>, 
              <strong>A (assotsiativ)</strong> yoki <strong>I (almashinish)</strong> bo'lishi mumkin.
              Reaksiya tezligi metallning <strong>elektron konfiguratsiyasi, oksidlanish darajasi, 
              koordinatsion soni va ligand maydon kuchiga</strong> bog'liq. Kinetik inertlik — 
              termodinamik barqarorlikdan farqli tushuncha: [Co(NH₃)₆]³⁺ termodinamik barqaror EMAS 
              (kislotali eritmada parchalanadi), lekin kinetik INERT (juda sekin almashinadi).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Inert va Labil komplekslar</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">Konfiguratsiya</th><th className="text-left py-2 text-green-400">Xarakteri</th><th className="text-left py-2 text-yellow-400">Misol</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["d³ (t₂g³)","Kinetik INERT","[Cr(H₂O)₆]³⁺ (t₁/₂ ≈ 40 soat)"],["d⁶ LS (t₂g⁶)","Kinetik INERT","[Co(NH₃)₆]³⁺ (t₁/₂ ≈ bir necha kun)"],["d⁸ (kvadrat planar)","O'rtacha inert","[PtCl₄]²⁻ (Pt²⁺ — inert)"],["d¹⁰","LABIL","[Zn(H₂O)₆]²⁺ (juda tez almashinadi)"],["d⁴ HS, d⁹","LABIL","[Cu(H₂O)₆]²⁺ (Yahn-Teller, tez)"],["d⁵ HS, d⁶ HS","LABIL","[Fe(H₂O)₆]²⁺ (tez almashinadi)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5 font-mono text-xs">{r[0]}</td><td className="py-1.5 text-xs">{r[1]}</td><td className="py-1.5 text-xs">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">KMN asosida bashorat — LFSE farqi</h3>
              <p className="text-purple-200 text-sm mb-2">
                <strong>Kinetik inertlik</strong> ligand almashinishning aktivatsiya energiyasi bilan bog'liq.
                KMN bo'yicha: <strong>ΔLFSE = LFSE(oraliq holat) − LFSE(boshlang'ich)</strong>. 
                Agar ΔLFSE katta manfiy bo'lsa — aktivatsiya energiyasi yuqori — kompleks INERT.
              </p>
              <table className="w-full text-xs mt-2">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-1 text-purple-400">dⁿ</th><th className="text-left py-1 text-yellow-400">LFSE (Oh)</th><th className="text-left py-1 text-yellow-400">LFSE (oraliq)</th><th className="text-left py-1 text-green-400">ΔLFSE</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["d³","1.2 Δo","1.0 Δo","−0.2 Δo (INERT)"],["d⁶ LS","2.4 Δo","2.0 Δo","−0.4 Δo (JUDA INERT)"],["d⁸","1.2 Δo","1.0 Δo","−0.2 Δo (INERT)"],["d¹⁰","0","0","0 (LABIL)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/20"><td className="py-1 font-mono">{r[0]}</td><td className="py-1">{r[1]}</td><td className="py-1">{r[2]}</td><td className="py-1 text-green-300">{r[3]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. D, A, I MEXANIZMLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 D, A, I mexanizmlar — Langford-Grey klassifikatsiyasi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-green-400">Langford va Grey (1965)</strong> ligand almashinish mexanizmlarini 
            <strong>D (dissotsiativ), A (assotsiativ) va I (almashinish)</strong> ga ajratgan. 
            Har bir mexanizm <strong>oraliq birikma</strong> xarakteri bilan farq qiladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">D — Dissotsiativ mexanizm</h3>
              <div className="space-y-2 text-xs text-purple-200">
                <p><strong className="text-yellow-400">ML₆ → ML₅ + L</strong> (sekin, 1-tartib)</p>
                <p><strong>ML₅ + L' → ML₅L'</strong> (tez)</p>
                <p className="mt-2">• KCh kamayadi (oraliq: KCh=5)</p>
                <p>• Tezlik = k[ML₆] — faqat kompleksga bog'liq</p>
                <p>• <strong>Misollar:</strong> Co³⁺ (d⁶ LS), Cr³⁺ (d³), Pt²⁺ (d⁸)</p>
                <p>• <strong>Tezlik:</strong> Kichik ligandlar tezroq</p>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">A — Assotsiativ mexanizm</h3>
              <div className="space-y-2 text-xs text-purple-200">
                <p><strong className="text-yellow-400">ML₆ + L' → ML₆L'</strong> (sekin, 2-tartib)</p>
                <p><strong>ML₆L' → ML₅L' + L</strong> (tez)</p>
                <p className="mt-2">• KCh ortadi (oraliq: KCh=7)</p>
                <p>• Tezlik = k[ML₆][L'] — ikkalasiga ham bog'liq</p>
                <p>• <strong>Misollar:</strong> Ni²⁺ (d⁸), Cu²⁺ (d⁹), Zn²⁺ (d¹⁰)</p>
                <p>• <strong>Tezlik:</strong> Katta ligandlar sekinroq</p>
              </div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">I — Almashinish mexanizmi</h3>
              <div className="space-y-2 text-xs text-purple-200">
                <p><strong className="text-yellow-400">ML₆ + L' ⇌ [ML₆···L']‡</strong></p>
                <p><strong>[ML₆···L']‡ → ML₅L' + L</strong></p>
                <p className="mt-2">• <strong>I_d:</strong> Dissotsiativ almashinish (bog' uzilishi muhimroq)</p>
                <p>• <strong>I_a:</strong> Assotsiativ almashinish (bog' hosil bo'lishi muhimroq)</p>
                <p>• <strong>I:</strong> Sof almashinish — ikkalasi teng hissa</p>
                <p>• <strong>Aksariyat komplekslar</strong> I_d yoki I_a orqali almashinadi</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TRANS-TA'SIR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Trans-ta'sir — kvadrat planar komplekslarda</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-green-400">Trans-ta'sir</strong> — kvadrat planar Pt(II) komplekslarida 
            kashf etilgan (Chernyayev, 1926). Ma'lum ligandlar <strong>o'ziga qarama-qarshi (trans) 
            pozitsiyadagi ligandning almashinishini tezlashtiradi</strong>. Bu effekt 
            <strong>kinetik trans-effekt</strong> (reaksiya tezligiga ta'sir) va 
            <strong>termodinamik trans-ta'sir</strong> (bog' uzunligiga ta'sir) ga bo'linadi.
            Sisplatin sintezida muhim amaliy ahamiyatga ega.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-3">Trans-ta'sir qatori (kinetik):</h3>
              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 mb-3">
                <p className="text-yellow-400 text-sm font-mono leading-relaxed">
                  CO, CN⁻, C₂H₄ {'>'} PR₃, H⁻ {'>'} CH₃⁻, SC(NH₂)₂ {'>'} C₆H₅⁻, NO₂⁻, I⁻, SCN⁻ {'>'} Br⁻, Cl⁻ {'>'} py, NH₃, OH⁻, H₂O
                </p>
              </div>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Kuchli trans-ta'sir:</strong> Kuchli π-akseptorlar (CO, CN⁻, C₂H₄) — π-bog'lanish oraliq holatni stabilizatsiya qiladi</li>
                <li>• <strong>O'rtacha:</strong> Kuchli σ-donorlar (PR₃, H⁻, CH₃⁻)</li>
                <li>• <strong>Kuchsiz:</strong> Oddiy ligandlar (NH₃, H₂O, Cl⁻)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-3">Sisplatin sintezida trans-ta'sir:</h3>
              <div className="space-y-2 text-xs text-purple-200">
                <p><strong>1-bosqich:</strong> [PtCl₄]²⁻ + 2NH₃ → trans-[PtCl₂(NH₃)₂]</p>
                <p className="text-purple-400">Cl⁻ kuchli trans-ta'sirga ega emas — 2-NH₃ trans- joylashadi</p>
                <p><strong>2-bosqich:</strong> trans-[PtCl₂(NH₃)₂] + 2NH₃ → [Pt(NH₃)₄]Cl₂</p>
                <p className="text-purple-400">Cl⁻ o'rniga NH₃ kiradi (Cl⁻ kuchsiz trans-ta'sir)</p>
                <p><strong>3-bosqich:</strong> [Pt(NH₃)₄]Cl₂ + 2KCl → sis-[PtCl₂(NH₃)₂]</p>
                <p className="text-yellow-400">NH₃ kuchliroq trans-ta'sir — Cl⁻ NH₃ ga sis- joylashadi!</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. EYRING TENGLAMASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Eyring tenglamasi — aktivatsiya parametrlari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-green-400">Eyring tenglamasi</strong> ligand almashinish reaksiyalarining 
            <strong>aktivatsiya entalpiyasi (ΔH‡) va entropiyasi (ΔS‡)</strong> ni aniqlash imkonini beradi.
            Bu parametrlar reaksiya mexanizmini (D, A yoki I) farqlash uchun ishlatiladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-green-400 font-bold mb-3">Eyring tenglamasi:</h3>
            <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4 mb-3">
              <p className="text-yellow-400 font-mono text-sm text-center">
                k = (k_B·T / h) · exp(ΔS‡/R) · exp(−ΔH‡/RT)
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-400 font-bold mb-1">D mexanizm — dissotsiativ:</p>
                <p className="text-purple-200"><strong>ΔS‡ {'>'} 0</strong> (musbat) — oraliq holatda tartibsizlik ortadi (bog' uzilishi)</p>
                <p className="text-purple-200"><strong>ΔH‡ katta</strong> — bog' uzish uchun energiya kerak</p>
                <p className="text-purple-400 text-xs mt-1">Misol: [Co(NH₃)₆]³⁺ + H₂O — ΔS‡ ≈ +30 J/mol·K</p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-400 font-bold mb-1">A mexanizm — assotsiativ:</p>
                <p className="text-purple-200"><strong>ΔS‡ {'<'} 0</strong> (manfiy) — oraliq holatda tartib ortadi (yangi bog' hosil bo'lishi)</p>
                <p className="text-purple-200"><strong>ΔH‡ kichik</strong> — bog' uzilmaydi</p>
                <p className="text-purple-400 text-xs mt-1">Misol: [Ni(H₂O)₆]²⁺ + bpy — ΔS‡ ≈ −40 J/mol·K</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>D mexanizm — <strong className="text-green-400">birinchi bog' uziladi, keyin yangi bog' hosil bo'ladi</strong> (ΔS‡ {'>'} 0)</li>
            <li>A mexanizm — <strong className="text-green-400">yangi bog' hosil bo'ladi, keyin eski bog' uziladi</strong> (ΔS‡ {'<'} 0)</li>
            <li>KMN inertlikni bashorat qiladi — <strong className="text-green-400">katta manfiy ΔLFSE → INERT</strong></li>
            <li>Trans-ta'sir — <strong className="text-green-400">sisplatin sintezida</strong> hal qiluvchi rol o'ynaydi</li>
            <li>Eyring tenglamasi — <strong className="text-green-400">ΔS‡ belgisi mexanizmni aniqlaydi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Reaksiyalar</Link>
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar/oksidlanish-qaytarilish" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Oksidlanish-qaytarilish →</Link>
        </div>

      </section>
    </main>
  )
}