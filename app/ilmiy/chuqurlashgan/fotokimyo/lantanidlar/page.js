import Link from "next/link"

export default function LantanidlarFotofizikasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/fotokimyo" className="text-purple-400 hover:text-purple-300 text-lg">← Fotokimyo</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🔬 Lantanid komplekslari fotofizikasi</h1>
          <p className="text-purple-400 text-sm">Antenna effekti • Eu³⁺/Tb³⁺ • f−f o'tishlar • Vaqt-ajraladigan fluoressensiya</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Lantanid komplekslari fotofizikasi haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-purple-400">Lantanid ionlari (Ln³⁺)</strong> noyob fotofizik xossalarga ega: 
              <strong className="text-purple-400"> tor emission chiziqlar</strong> (f−f o'tishlar, Laporte taqiqlangan),
              <strong className="text-purple-400"> uzoq yashash vaqtlari</strong> (τ ≈ 0.5−5 ms) va 
              <strong className="text-purple-400"> katta Stokes siljishi</strong>. f−f o'tishlar taqiqlanganligi 
              sababli ular yorug'likni bevosita juda kuchsiz yutadi (ε {'<'} 10 M⁻¹sm⁻¹). 
              <strong className="text-purple-400">Antenna effekti</strong> bu muammoni hal qiladi — 
              xromofor ligandlar yorug'likni yutadi va energiyani metall markaziga uzatadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Nima uchun f−f o'tishlar maxsus?</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>4f orbitallar ichki qobiqda</strong> — 5s²5p⁶ bilan ekranlangan</li>
                <li>• <strong>Laporte taqiqlangan</strong> — ε {'<'} 10 M⁻¹sm⁻¹</li>
                <li>• <strong>Geometriya deyarli o'zgarmaydi</strong> — kichik Stokes siljishi</li>
                <li>• <strong>Tebranish so'ndirilishi kuchsiz</strong> — uzoq yashash vaqti</li>
                <li>• <strong>O'tishlar o'tkir</strong> — FWHM ~5−10 nm</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Antenna effekti bosqichlari</h3>
              <ol className="text-purple-200 text-sm space-y-1 list-decimal list-inside">
                <li><strong>Ligand yutilishi:</strong> S₀ → S₁ (ππ*, ε ≈ 10⁴−10⁵ M⁻¹sm⁻¹)</li>
                <li><strong>ISC:</strong> S₁ → T₁ (og'ir atom effekti yordamida)</li>
                <li><strong>Energiya uzatilishi:</strong> T₁(ligand) → qabul qiluvchi sath (Ln³⁺)</li>
                <li><strong>Metall nurlanishi:</strong> Ln³⁺* → Ln³⁺ + hν (xarakterli chiziqlar)</li>
              </ol>
            </div>
          </div>
        </div>

        {/* 2. Eu³⁺ va Tb³⁺ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eu³⁺ va Tb³⁺ — eng muhim lyuminestsent lantanidlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Eu³⁺ (f⁶) — Qizil lyuminestsensiya</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-red-800/30"><th className="text-left py-1 text-red-300">O'tish</th><th className="text-left py-1 text-red-300">λ (nm)</th><th className="text-left py-1 text-red-300">Nisbiy intensivlik</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["⁵D₀ → ⁷F₀","580","Juda kuchsiz"],["⁵D₀ → ⁷F₁","595","O'rtacha (magnit dipol)"],["⁵D₀ → ⁷F₂","612","Kuchli (elektr dipol — gipersezgir!)"],["⁵D₀ → ⁷F₃","650","Kuchsiz"],["⁵D₀ → ⁷F₄","700","O'rtacha"]].map((r,i)=>(<tr key={i} className="border-b border-red-800/20"><td className="py-1 font-mono">{r[0]}</td><td className="py-1 text-yellow-400">{r[1]}</td><td className="py-1">{r[2]}</td></tr>))}
                </tbody>
              </table>
              <p className="text-purple-300 text-xs mt-2">
                <strong>⁵D₀ → ⁷F₂</strong> — gipersezgir o'tish. Intensivligi Eu³⁺ atrofidagi simmetriyaga kuchli bog'liq.
                Asimmetrik muhitda juda kuchli, simmetrik muhitda kuchsiz.
              </p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Tb³⁺ (f⁸) — Yashil lyuminestsensiya</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-green-800/30"><th className="text-left py-1 text-green-300">O'tish</th><th className="text-left py-1 text-green-300">λ (nm)</th><th className="text-left py-1 text-green-300">Nisbiy intensivlik</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["⁵D₄ → ⁷F₆","490","O'rtacha"],["⁵D₄ → ⁷F₅","545","Juda kuchli — eng intensiv!"],["⁵D₄ → ⁷F₄","585","O'rtacha"],["⁵D₄ → ⁷F₃","620","Kuchsiz"]].map((r,i)=>(<tr key={i} className="border-b border-green-800/20"><td className="py-1 font-mono">{r[0]}</td><td className="py-1 text-yellow-400">{r[1]}</td><td className="py-1">{r[2]}</td></tr>))}
                </tbody>
              </table>
              <p className="text-purple-300 text-xs mt-2">
                <strong>⁵D₄ → ⁷F₅</strong> — eng intensiv o'tish (yashil). Tb³⁺ komplekslari 
                eng yuqori kvant unumiga ega (Φ 0.95 gacha).
              </p>
            </div>
          </div>
        </div>

        {/* 3. ANTENNA EFFEKTI ENERGETIKASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Antenna effekti energetikasi — optimal ligand tanlash</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-purple-400">Antenna effekti samaradorligi</strong> ligand triplet holati (T₁) 
            energiyasi va lantanid qabul qiluvchi sathi orasidagi <strong>energetik moslikka</strong> bog'liq.
            T₁ energiyasi qabul qiluvchi sathdan <strong>2000−4000 sm⁻¹ yuqori</strong> bo'lishi kerak — 
            juda yaqin bo'lsa teskari energiya uzatilishi, juda uzoq bo'lsa samarasiz uzatish bo'ladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-purple-400 font-bold mb-3">Optimal ligand T₁ energiyalari:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs">
              {[
                { ion: "Eu³⁺", level: "⁵D₀: 17,250 sm⁻¹", optimal: "T₁ ≈ 21,000−25,000 sm⁻¹", ligands: "β-diketonatlar, tta" },
                { ion: "Tb³⁺", level: "⁵D₄: 20,500 sm⁻¹", optimal: "T₁ ≈ 24,000−27,000 sm⁻¹", ligands: "Asetilasetonat, bpy" },
                { ion: "Sm³⁺", level: "⁴G₅/₂: 17,900 sm⁻¹", optimal: "T₁ ≈ 21,000−24,000 sm⁻¹", ligands: "β-diketonatlar" },
              ].map((r, i) => (
                <div key={i} className="bg-purple-900/50 rounded-lg p-3 border border-purple-700/30">
                  <p className="text-purple-400 font-bold">{r.ion}</p>
                  <p className="text-yellow-400 font-mono mt-1">{r.level}</p>
                  <p className="text-green-400 mt-1">{r.optimal}</p>
                  <p className="text-purple-500 mt-1">{r.ligands}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. VAQT-AJRALADIGAN FLUORESSENSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⏱️ Vaqt-ajraladigan fluoressensiya (TRF)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-purple-400">TRF (Time-Resolved Fluorescence)</strong> — lantanid komplekslarining 
            uzoq yashash vaqtidan foydalanib, <strong>qisqa yashovchi fon fluoressensiyasidan</strong> 
            signalni ajratish usuli. Odatda <strong>50−200 μs kechikish</strong> bilan o'lchash 
            organik fonni butunlay yo'qotadi va <strong>signal/shovqin nisbatini 100−1000 marta</strong> oshiradi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            {[
              { label: "Qo'zg'atish", value: "Pulse (∼10 μs)", note: "Lazer yoki ksenon lampa" },
              { label: "Kechikish", value: "50−200 μs", note: "Qisqa fluoressensiya so'nadi" },
              { label: "O'lchash", value: "200−1000 μs", note: "Faqat Ln³⁺ signali qoladi" },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <p className="text-purple-400 font-bold text-sm">{r.label}</p>
                <p className="text-white font-mono mt-2">{r.value}</p>
                <p className="text-purple-500 text-xs mt-2">{r.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-purple-400 font-bold mb-2">TRF qo'llanish sohalari</h3>
            <ul className="text-purple-200 text-sm space-y-1">
              <li>• <strong>Bioanalitik tahlil:</strong> Immunoferment analiz (DELFIA), DNK gibridizatsiyasi</li>
              <li>• <strong>Bioimaging:</strong> Hujayra ichidagi lantanid komplekslari — fon signalisiz</li>
              <li>• <strong>Sensorlar:</strong> Kislorod, pH, metall ionlari, anionlar</li>
              <li>• <strong>Xavfsizlik:</strong> Banknota va hujjat himoyasi (EURO banknotalari Eu³⁺ bilan)</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>f−f o'tishlar — <strong className="text-purple-400">tor, o'tkir chiziqlar</strong> (FWHM ~5−10 nm)</li>
            <li>Antenna effekti — <strong className="text-purple-400">ligand T₁ energiyasi</strong> optimal bo'lishi kerak</li>
            <li>Eu³⁺ (612 nm, qizil) va Tb³⁺ (545 nm, yashil) — <strong className="text-purple-400">eng muhim ionlar</strong></li>
            <li>TRF — <strong className="text-purple-400">signal/shovqin nisbatini 100−1000 marta oshiradi</strong></li>
            <li>Yashash vaqti τ ≈ 0.5−5 ms — <strong className="text-purple-400">organik fluoressensiyadan 10³−10⁶ marta uzoq</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/fotokimyo/mlct-holati" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← MLCT qo'zg'algan holat</Link>
          <Link href="/ilmiy/chuqurlashgan/fotokimyo/oled" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">OLED materiallari →</Link>
        </div>

      </section>
    </main>
  )
}