import Link from "next/link"

export default function ElektronKonfiguratsiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-amber-400">📝 Elektron konfiguratsiya va termlar</h1>
          <p className="text-purple-400 text-sm">dⁿ konfiguratsiyalar • Russell-Saunders termlari • Hund qoidasi • Mikroholatlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Elektron konfiguratsiya va term belgilar</h2>
          
          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-amber-400">Term belgi</strong> — atom yoki ionning 
              <strong className="text-amber-400"> umumiy spin (S) va orbital (L) burchak momentlarini</strong> 
              ifodalovchi kvant-mexanik belgi: <strong className="text-amber-400">²S⁺¹L</strong>. 
              Kompleks birikmalarda metall markazining term belgisi uning 
              <strong>spektral, magnit va kimyoviy xossalarini</strong> tushunish uchun asos bo'ladi.
              Termlar <strong>Russell-Saunders (LS) bog'lanish sxemasi</strong> asosida aniqlanadi 
              (3d metallar uchun qo'llaniladi).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-amber-400 font-bold mb-2">Term belgi tarkibi: ²S⁺¹L</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>S</strong> — umumiy spin kvant soni (toq elektronlar yig'indisi)</li>
                <li>• <strong>2S+1</strong> — spin multiplikligi (singlet=1, dublet=2, triplet=3...)</li>
                <li>• <strong>L</strong> — umumiy orbital burchak momenti (S, P, D, F, G...)</li>
                <li>• <strong>J</strong> — umumiy burchak moment (|L−S| dan L+S gacha)</li>
                <li>• To'liq belgi: <strong>²S⁺¹L_J</strong> (masalan: ³P₂, ⁵D₄)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-amber-400 font-bold mb-2">Hund qoidalari</h3>
              <ol className="text-purple-200 text-sm space-y-1 list-decimal list-inside">
                <li><strong>Maksimal S</strong> — eng past energiyali term maksimal spinga ega</li>
                <li><strong>Maksimal L</strong> — bir xil S bo'lsa, maksimal L term barqarorroq</li>
                <li><strong>J qiymati:</strong> qobiq yarimdan kam to'lgan bo'lsa — eng kichik J; yarimdan ko'p to'lgan bo'lsa — eng katta J</li>
              </ol>
            </div>
          </div>
        </div>

        {/* 2. dⁿ KONFIGURATSIYALAR UCHUN TERMLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 dⁿ konfiguratsiyalar uchun erkin ion termlari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">dⁿ</th>
                <th className="py-3 px-4 text-purple-300">Ion misoli</th>
                <th className="py-3 px-4 text-purple-300">Barcha termlar</th>
                <th className="py-3 px-4 text-purple-300">Asosiy (Hund) termi</th>
                <th className="py-3 px-4 text-purple-300">S</th>
                <th className="py-3 px-4 text-purple-300">2S+1</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹", "Ti³⁺, V⁴⁺", "²D", "²D", "1/2", "2 (dublet)"],
                  ["d²", "V³⁺, Cr⁴⁺", "³F, ³P, ¹G, ¹D, ¹S", "³F", "1", "3 (triplet)"],
                  ["d³", "Cr³⁺, Mn⁴⁺", "⁴F, ⁴P, ²G, ²F, ²D, ²H", "⁴F", "3/2", "4 (kvartet)"],
                  ["d⁴", "Cr²⁺, Mn³⁺", "⁵D, ³H, ³G, ³F, ³D, ³P, ¹I...", "⁵D", "2", "5 (kvintet)"],
                  ["d⁵", "Mn²⁺, Fe³⁺", "⁶S, ⁴G, ⁴F, ⁴D, ⁴P, ²I...", "⁶S", "5/2", "6 (sekstet)"],
                  ["d⁶", "Fe²⁺, Co³⁺", "⁵D, ³H, ³G, ³F, ³D, ³P, ¹I...", "⁵D", "2", "5 (kvintet)"],
                  ["d⁷", "Co²⁺, Ni³⁺", "⁴F, ⁴P, ²G, ²F, ²D, ²H...", "⁴F", "3/2", "4 (kvartet)"],
                  ["d⁸", "Ni²⁺, Cu³⁺", "³F, ³P, ¹G, ¹D, ¹S", "³F", "1", "3 (triplet)"],
                  ["d⁹", "Cu²⁺", "²D", "²D", "1/2", "2 (dublet)"],
                  ["d¹⁰", "Zn²⁺, Cd²⁺", "¹S", "¹S", "0", "1 (singlet)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-amber-400">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[2]}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400 font-bold text-xs">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                    <td className="py-3 px-4 text-xs">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-purple-400 text-xs mt-3">
            * d⁴ va d⁹ konfiguratsiyalar bir-biriga "teskari" — bir xil termlarga ega (teshiklarning ekvivalentligi).
            d¹ va d⁹, d² va d⁸, d³ va d⁷, d⁴ va d⁶ juftliklari o'xshash.
          </p>
        </div>

        {/* 3. MIKROHOLATLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Mikroholatlar jadvali — d² konfiguratsiya misolida</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-amber-400">Mikroholat</strong> — elektronlarning orbitallar bo'yicha 
            aniq taqsimoti. Term — bir xil energiyaga ega mikroholatlar guruhi.
            d² konfiguratsiya uchun jami <strong>45 ta mikroholat</strong> mavjud bo'lib, ular 
            <strong>⁵ ta termga</strong> birlashadi: ³F (21 mikroholat), ³P (9), ¹G (9), ¹D (5), ¹S (1).
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-amber-400 font-bold mb-3">d² mikroholatlar taqsimoti:</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-xs">
              {[
                { term: "³F", m: 21, spin: "Triplet", note: "Asosiy — Hund" },
                { term: "³P", m: 9, spin: "Triplet", note: "Qo'zg'algan" },
                { term: "¹G", m: 9, spin: "Singlet", note: "Yuqori energiya" },
                { term: "¹D", m: 5, spin: "Singlet", note: "Yuqori energiya" },
                { term: "¹S", m: 1, spin: "Singlet", note: "Eng yuqori" },
              ].map((r, i) => (
                <div key={i} className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3">
                  <p className="text-amber-400 font-bold text-lg">{r.term}</p>
                  <p className="text-white">{r.m} mikroholat</p>
                  <p className="text-purple-400">{r.spin}</p>
                  <p className="text-purple-500 mt-1">{r.note}</p>
                </div>
              ))}
            </div>
            <p className="text-purple-400 text-xs mt-3">
              <strong>Hisob:</strong> d² konfiguratsiya — 2 ta elektron 5 ta d-orbitalga: C(10,2) = 45 mikroholat.
              <strong>Spin ko'plik:</strong> parallel spinli (S=1) — 30 ta, antiparallel spinli (S=0) — 15 ta.
            </p>
          </div>
        </div>

        {/* 4. OKTAEDRIK MAYDONDA TERMLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 Oktaedrik maydonda term belgilar</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Erkin ion termlari oktaedrik (Oh) maydonda <strong>ajraladi</strong>. Har bir term 
            ma'lum simmetriyaga ega holatlarga bo'linadi. Bu bo'linish 
            <strong>Tanabe-Sugano va Orgel diagrammalari</strong> uchun asos bo'ladi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Erkin ion termi</th>
                <th className="py-3 px-4 text-purple-300">Oh maydonda</th>
                <th className="py-3 px-4 text-purple-300">Degeneratsiya</th>
                <th className="py-3 px-4 text-purple-300">dⁿ misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["S (L=0)", "A₁g", "1", "d⁵ HS: ⁶S → ⁶A₁g"],
                  ["P (L=1)", "T₁g", "3", "d²: ³P → ³T₁g(P)"],
                  ["D (L=2)", "E_g + T₂g", "2+3", "d¹: ²D → ²T₂g + ²E_g"],
                  ["F (L=3)", "A₂g + T₁g + T₂g", "1+3+3", "d²: ³F → ³T₁g(F) + ³T₂g + ³A₂g"],
                  ["G (L=4)", "A₁g + E_g + T₁g + T₂g", "1+2+3+3", "d²: ¹G → ¹A₁g + ¹E_g + ¹T₁g + ¹T₂g"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-amber-400">{r[0]}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-600/10 to-purple-600/10 border border-amber-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Term belgi: <strong className="text-amber-400">²S⁺¹L</strong> — umumiy spin va orbital momentlarni ifodalaydi</li>
            <li>dⁿ konfiguratsiyalar — <strong className="text-amber-400">Hund qoidalari</strong> asosida asosiy holat aniqlanadi</li>
            <li>Oktaedrik maydonda termlar <strong className="text-amber-400">simmetriyaga qarab ajraladi</strong> (Tanabe-Sugano asosi)</li>
            <li>Mikroholatlar soni — <strong className="text-amber-400">C(10,n)</strong> formula bilan hisoblanadi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Zaryad ko'chishi spektrlari</Link>
          <Link href="/ilmiy/chuqurlashgan/fotokimyo" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">Fotokimyo va fotofizika →</Link>
        </div>

      </section>
    </main>
  )
}