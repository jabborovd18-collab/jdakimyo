import Link from "next/link"

export default function HostGuest() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/supramolekulyar" className="text-purple-400 hover:text-purple-300 text-lg">← Supramolekulyar</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🔒 Host-guest kimyosi</h1>
          <p className="text-purple-400 text-sm">Crown efirlar • Kriptandlar • Kaliksarenlar • Siklodekstrinlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Host-guest kimyosi haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-purple-400">Host-guest kimyosi</strong> — supramolekulyar kimyoning 
              eng asosiy bo'limi. <strong className="text-purple-400">Host (egasi)</strong> — bo'shliqqa ega 
              molekula, <strong className="text-purple-400">guest (mehmon)</strong> — bu bo'shliqqa 
              joylashadigan ion yoki molekula. Bog'lanish kovalent emas — vodorod bog'lar, 
              ion-dipol, Van der Waals va gidrofob o'zaro ta'sirlar orqali amalga oshadi.
              <strong>Kation tanib olish</strong> — host-guest kimyosining eng rivojlangan yo'nalishi.
              <strong>Pedersen (1967)</strong> crown efirlarni kashf etgan, 
              <strong>Lehn (1969)</strong> kriptandlarni, <strong>Cram (1970-lar)</strong> sferandlarni 
              yaratgan — uchchalasi 1987-yilda Nobel mukofotini olgan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Molekulyar tanib olish prinsipi</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Komplementarlik:</strong> Host bo'shlig'i va guest o'lchami mos bo'lishi kerak</li>
                <li>• <strong>Preorganizatsiya:</strong> Host bog'lanishdan oldin kerakli konformatsiyada bo'lsa — bog'lanish kuchliroq</li>
                <li>• <strong>Selektivlik:</strong> Host ma'lum bir guest ni boshqalaridan afzal ko'radi</li>
                <li>• <strong>Termodinamik barqarorlik:</strong> K_ass = [HG]/([H][G]) — bog'lanish konstantasi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Asosiy host molekulalar</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">Host</th><th className="text-left py-2 text-purple-300">Bo'shliq turi</th><th className="text-left py-2 text-purple-300">Guest</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["Crown efirlar","Siklik (2D halqa)","Ishqoriy/ishqoriy-yer metallar"],["Kriptandlar","3D qafas","Ishqoriy metallar (kuchliroq)"],["Kaliksarenlar","Kosa shaklida","Organik molekulalar, C₆₀"],["Siklodekstrinlar","Kesik konus","Gidrofob molekulalar (suvda)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5 font-bold text-purple-400">{r[0]}</td><td className="py-1.5">{r[1]}</td><td className="py-1.5">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. CROWN EFIRLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">👑 Crown efirlar — Pedersen kashfiyoti (1967)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-purple-400">Crown efirlar</strong> — siklik polieterlar. Ularning 
            kislorod atomlari <strong>ion-dipol o'zaro ta'sir</strong> orqali metall kationlarini 
            bog'laydi. <strong>"Kation-bo'shliq" mosligi</strong> — crown efir bo'shlig'i o'lchami 
            metall ioni radiusiga mos kelganda eng barqaror kompleks hosil bo'ladi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Crown efir</th>
                <th className="py-3 px-4 text-purple-300">Bo'shliq (Å)</th>
                <th className="py-3 px-4 text-purple-300">Eng yaxshi kation</th>
                <th className="py-3 px-4 text-purple-300">Ion radiusi (Å)</th>
                <th className="py-3 px-4 text-purple-300">log K (MeOH)</th>
                <th className="py-3 px-4 text-purple-300">Selektivlik</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["12-crown-4","1.2−1.5","Li⁺","0.76","~4.0","Li⁺ {'>'} Na⁺, K⁺"],
                  ["15-crown-5","1.7−2.2","Na⁺","1.02","~6.5","Na⁺ {'>'} K⁺, Li⁺"],
                  ["18-crown-6","2.6−3.2","K⁺","1.38","~6.1","K⁺ {'>>'} Na⁺ (1000×)"],
                  ["Dibenzo-18-crown-6","2.6−3.2","K⁺","1.38","~5.0","K⁺ {'>'} Na⁺"],
                  ["21-crown-7","3.4−4.3","Cs⁺","1.67","~4.5","Cs⁺ {'>'} Rb⁺, K⁺"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-purple-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[4]}</td>
                    <td className="py-3 px-4 text-xs">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. KRIPTANDLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔐 Kriptandlar — Lehn kashfiyoti (1969)</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-purple-400">Kriptandlar</strong> — 3D qafas shaklidagi 
            bisiklik polieterlar. Crown efirlardan farqli o'laroq, ular kationni <strong>har 
            tomonlama o'rab oladi</strong> — bu bog'lanishni ancha kuchliroq qiladi (kriptat effekti).
            <strong>Kriptand [2.2.2]</strong> K⁺ ni 18-crown-6 dan <strong>10⁴ marta kuchliroq</strong> bog'laydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs">
            {[
              { name: "[1.1.1]", bridge: "N−C₂−O−C₂−N", cavity: "Kichik", best: "Li⁺, Na⁺", logK: "~5−8" },
              { name: "[2.2.2]", bridge: "N−C₂−O−C₂−O−C₂−N", cavity: "O'rta", best: "K⁺, Ba²⁺", logK: "~10.5 (K⁺)" },
              { name: "[3.3.3]", bridge: "N−C₃−O−C₃−O−C₃−O−C₃−N", cavity: "Katta", best: "Cs⁺, Rb⁺", logK: "~6−8" },
            ].map((r, i) => (
              <div key={i} className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-4">
                <p className="text-purple-400 font-bold font-mono">{r.name}</p>
                <p className="text-purple-300 mt-1">{r.bridge}</p>
                <p className="text-yellow-400 mt-2">Eng yaxshi: {r.best}</p>
                <p className="text-green-400 mt-1">log K: {r.logK}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-yellow-400 font-bold text-sm mb-2">Kriptat effekti</h3>
            <p className="text-purple-200 text-sm">
              Kriptandlar crown efirlardan <strong>10³−10⁴ marta kuchliroq</strong> bog'laydi. Sababi: 
              3D qafas kationni to'liq o'rab oladi — <strong>solvatatsion qobiq butunlay siqib chiqariladi</strong>, 
              entropik hissa katta musbat. Bundan tashqari, kriptandlar <strong>sekin almashinish kinetikasiga</strong> 
              ega — bir marta bog'langan kation "qafasdan chiqib ketolmaydi".
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Crown efirlar — <strong className="text-purple-400">ishqoriy metall kationlarini</strong> tanib oladi</li>
            <li>"Kation-bo'shliq" mosligi — <strong className="text-purple-400">selektivlik asosi</strong></li>
            <li>Kriptandlar — crown efirlardan <strong className="text-purple-400">10³−10⁴ marta kuchliroq</strong></li>
            <li>Nobel 1987 — <strong className="text-purple-400">Pedersen, Lehn, Cram</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/supramolekulyar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Supramolekulyar komplekslar</Link>
          <Link href="/ilmiy/chuqurlashgan/supramolekulyar/mof" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">MOF →</Link>
        </div>

      </section>
    </main>
  )
}