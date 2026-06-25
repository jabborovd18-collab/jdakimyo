import Link from "next/link"

export default function OLEDMateriallar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/fotokimyo" className="text-purple-400 hover:text-purple-300 text-lg">← Fotokimyo</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🖥️ OLED materiallari — Ir(III) va Pt(II)</h1>
          <p className="text-purple-400 text-sm">Spin-orbit bog'lanish • 100% ichki kvant unumi • Fosforessensiya • TADF</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 OLED va fosforessensiya haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">OLED (Organic Light-Emitting Diode)</strong> — organik yarim o'tkazgich 
              materiallar asosidagi yorug'lik diodlari. An'anaviy organik OLED larda faqat <strong>singlet qo'zg'algan 
              holatlar (25%)</strong> nurlanishga hissa qo'shadi — tripletlar (75%) issiqlik sifatida yo'qoladi.
              <strong className="text-yellow-400">Ir(III) va Pt(II) komplekslari</strong> kuchli spin-orbit 
              bog'lanish tufayli <strong>singlet va triplet holatlarni aralashtiradi</strong> — natijada 
              <strong className="text-yellow-400">100% ichki kvant unumi</strong> bilan fosforessensiya kuzatiladi.
              Bu <strong>PHOLED (Phosphorescent OLED)</strong> texnologiyasining asosidir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nima uchun Ir(III) va Pt(II)?</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Yuqori Z (Ir=77, Pt=78)</strong> — kuchli spin-orbit bog'lanish</li>
                <li>• <strong>d⁶ (Ir³⁺) / d⁸ (Pt²⁺)</strong> — barqaror elektron konfiguratsiyalar</li>
                <li>• <strong>Kuchli ligand maydoni</strong> — MC holatlar yuqori energiyada (parchalanish yo'q)</li>
                <li>• <strong>MLCT/LC aralashgan holatlar</strong> — qisqa yashash vaqti (1−10 μs)</li>
                <li>• <strong>Rang sozlanishi</strong> — ligand modifikatsiyasi orqali</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Fl uoressensiya vs Fosforessensiya OLED</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">Parametr</th><th className="text-left py-2 text-sky-400">Fluoressensiya</th><th className="text-left py-2 text-yellow-400">Fosforessensiya</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["Ichki kvant unumi","25% (maksimal)","100% (barcha eksitonlar)"],["Yashash vaqti","ns","μs"],["Materiallar","Organik molekulalar","Ir(III), Pt(II), Os(II)"],["Samaradorlik","Past-o'rtacha","Yuqori (20−30% EQE)"],["Narxi","Arzon","Qimmat (Ir — nodir metall)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5">{r[0]}</td><td className="py-1.5 text-sky-300">{r[1]}</td><td className="py-1.5 text-yellow-300">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. ASOSIY Ir(III) KOMPLEKSLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Asosiy Ir(III) fosforessensiya materiallari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Ir(ppy)₃",
                full: "Tris(2-fenilpiridinato)iridiy(III)",
                color: "Yashil",
                em: "514 nm",
                qe: "Φ = 0.97",
                tau: "τ = 1.6 μs",
                eqe: "EQE ≈ 20%",
                note: "Birinchi yuqori samarali PHOLED materiali (2000)"
              },
              {
                name: "FIrpic",
                full: "Bis(4,6-difluorofenil)-piridinato iridiy(III) pikolinat",
                color: "Ko'k",
                em: "470 nm",
                qe: "Φ = 0.87",
                tau: "τ = 1.4 μs",
                eqe: "EQE ≈ 15%",
                note: "Ko'k PHOLED — eng qiyin rang (yuqori energiya)"
              },
              {
                name: "Ir(piq)₃",
                full: "Tris(1-fenilizoxinolin)iridiy(III)",
                color: "Qizil",
                em: "620 nm",
                qe: "Φ = 0.45",
                tau: "τ = 2.0 μs",
                eqe: "EQE ≈ 10%",
                note: "Qizil PHOLED — energiya bo'shlig'i qonuni cheklovi"
              },
            ].map((r, i) => (
              <div key={i} className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
                <h3 className="text-yellow-400 font-bold font-mono">{r.name}</h3>
                <p className="text-purple-300 text-xs mt-1">{r.full}</p>
                <div className="mt-3 space-y-1 text-xs">
                  <p className="text-white"><strong>Rang:</strong> {r.color} — λ_em = {r.em}</p>
                  <p className="text-green-400"><strong>Kvant unumi:</strong> {r.qe}</p>
                  <p className="text-sky-400"><strong>Yashash vaqti:</strong> {r.tau}</p>
                  <p className="text-yellow-300"><strong>Samaradorlik:</strong> {r.eqe}</p>
                </div>
                <p className="text-purple-400 text-xs mt-3 italic">{r.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. TADF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 TADF — Termal Aktivlashtirilgan Kechikkan Fluoressensiya</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">TADF (Thermally Activated Delayed Fluorescence)</strong> — 
            Ir(III) komplekslariga muqobil, <strong>faqat organik molekulalar</strong> asosidagi texnologiya.
            Kichik ΔE(S₁−T₁) {'<'} 0.1 eV bo'lganda, triplet holatdan singletga <strong>teskari ISC (RISC)</strong> 
            orqali o'tish mumkin. Bu <strong>100% ichki kvant unumi</strong> ni nodir metallarsiz ta'minlaydi 
            (4-nasl OLED). 2014-yilda Chihaya Adachi tomonidan taklif qilingan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">TADF ishlash prinsipi</h3>
              <ol className="text-purple-200 text-xs space-y-1 list-decimal list-inside">
                <li>Elektr qo'zg'alish → 25% S₁ + 75% T₁</li>
                <li>T₁ holatlar <strong>RISC</strong> orqali S₁ ga qaytadi (termal aktivatsiya)</li>
                <li>S₁ → S₀ + hν (kechikkan fluoressensiya)</li>
                <li>Kichik ΔE(S₁−T₁) talab qilinadi — donor-akseptor dizayni</li>
              </ol>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">PHOLED vs TADF</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-1 text-purple-400">Parametr</th><th className="text-left py-1 text-yellow-400">PHOLED</th><th className="text-left py-1 text-green-400">TADF</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["Material","Ir(III)/Pt(II)","Organik D-A molekulalar"],["IQE","100%","100% (nazariy)"],["Narxi","Qimmat (Ir — nodir)","Arzon (faqat C,H,N,O)"],["Ko'k OLED","Qiyin (FIrpic)","Osonroq"],["Barqarorlik","Yuqori","O'rtacha (T₁ uzoq yashaydi)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/20"><td className="py-1">{r[0]}</td><td className="py-1 text-yellow-300">{r[1]}</td><td className="py-1 text-green-300">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>PHOLED — <strong className="text-yellow-400">100% ichki kvant unumi</strong> Ir(III)/Pt(II) spin-orbit bog'lanish orqali</li>
            <li>Ir(ppy)₃ (yashil), FIrpic (ko'k), Ir(piq)₃ (qizil) — <strong className="text-yellow-400">asosiy materiallar</strong></li>
            <li>TADF — <strong className="text-yellow-400">nodir metallarsiz 100% IQE</strong> (4-nasl OLED)</li>
            <li>Ko'k PHOLED — <strong className="text-yellow-400">eng qiyin</strong> (yuqori energiya → MC holat parchalanishi)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/fotokimyo/lantanidlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Lantanid komplekslari</Link>
          <Link href="/ilmiy/chuqurlashgan/fotokimyo/fotokataliz" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Fotokatalitik sikllar →</Link>
        </div>

      </section>
    </main>
  )
}