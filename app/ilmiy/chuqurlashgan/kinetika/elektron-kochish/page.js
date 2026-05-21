import Link from "next/link"

export default function ElektronKochish() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kinetika" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Kinetika
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">⚡ Elektron ko&apos;chish reaksiyalari</h1>
          <p className="text-purple-400 text-sm">Tashqi sfera • Ichki sfera • Markus nazariyasi • [Fe(H₂O)₆]²⁺/³⁺ • Qayta tashkil etish energiyasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Elektron ko&apos;chish reaksiyalari — oksidlanish-qaytarilish almashinuvi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Elektron ko&apos;chish reaksiyalari</strong> — bir metall 
              ionidan ikkinchisiga elektron o&apos;tishi bilan boradigan oksidlanish-qaytarilish jarayonlari.
              Kompleks birikmalar uchun <strong>ikki asosiy mexanizm</strong> mavjud:
              <strong className="text-yellow-400"> tashqi sfera (outer-sphere)</strong> — ligand qobiqlari 
              o&apos;zgarmaydi, va <strong className="text-yellow-400">ichki sfera (inner-sphere)</strong> — 
              ko&apos;prik ligand orqali elektron ko&apos;chadi.
              Bu reaksiyalar <strong>bioenergetika, kataliz va materialshunoslik</strong> uchun fundamental ahamiyatga ega.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Tashqi sfera mexanizmi</h3>
              <p className="text-purple-200 text-sm">
                <strong>Mexanizm:</strong> elektron bevosita metall ionlari orasida ko&apos;chadi, ligandlar o&apos;zgarmaydi.<br/>
                <strong>Shart:</strong> ikkala kompleksning ligand qobiqlari barqaror.<br/>
                <strong>Tezlik:</strong> Franck-Condon prinsipi bilan cheklangan.<br/>
                <strong>Misol:</strong> [Fe(H₂O)₆]²⁺ + [Fe*(H₂O)₆]³⁺ → [Fe(H₂O)₆]³⁺ + [Fe*(H₂O)₆]²⁺
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ichki sfera mexanizmi</h3>
              <p className="text-purple-200 text-sm">
                <strong>Mexanizm:</strong> ko&apos;prik ligand orqali elektron ko&apos;chadi, ligand almashinadi.<br/>
                <strong>Shart:</strong> kamida bitta kompleks labil bo&apos;lishi kerak.<br/>
                <strong>Tezlik:</strong> ko&apos;prik ligand tabiatiga bog&apos;liq.<br/>
                <strong>Misol:</strong> [Co(NH₃)₅Cl]²⁺ + [Cr(H₂O)₆]²⁺ → [Co(NH₃)₅(H₂O)]²⁺ + [Cr(H₂O)₅Cl]²⁺
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. TASHQI SFERA MEXANIZMI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌐 Tashqi sfera mexanizmi — Markus nazariyasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Tashqi sfera (outer-sphere)</strong> mexanizmda elektron 
              ikki kompleksning <strong>tashqi ligand qobiqlari orasidan</strong> tunnel o&apos;tish orqali ko&apos;chadi.
              <strong className="text-yellow-400"> Rudolf Markus</strong> 1956 yilda bu mexanizmning 
              nazariyasini yaratdi va 1992 yilda <strong>Nobel mukofoti</strong>ga sazovor bo&apos;ldi.
              Markus nazariyasiga ko&apos;ra, elektron ko&apos;chish tezligi 
              <strong> qayta tashkil etish energiyasi (λ)</strong> va 
              <strong> harakatlantiruvchi kuch (ΔG°)</strong> bilan belgilanadi.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-xl">
              Markus tenglamasi: k<sub>et</sub> = κν<sub>n</sub> exp(−ΔG<sup>‡</sup>/RT)
            </p>
            <p className="text-purple-200 text-sm mt-2">
              <strong>ΔG<sup>‡</sup> = (λ + ΔG°)² / 4λ</strong> — aktivatsiya energiyasi<br/>
              λ — qayta tashkil etish energiyasi, ΔG° — reaksiyaning Gibbs energiyasi
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                tushuncha: "Qayta tashkil etish energiyasi (λ)",
                izoh: "Elektron ko&apos;chishi uchun reagentlar o&apos;z geometriyalarini o&apos;zgartirishi kerak. λ — bu geometrik o&apos;zgarish uchun zarur energiya. Ikki komponentdan iborat: <strong>ichki sfera (λ<sub>i</sub>)</strong> — bog&apos; uzunliklari o&apos;zgarishi, <strong>tashqi sfera (λ<sub>o</sub>)</strong> — erituvchi molekulalarining qayta tashkil etishi.",
              },
              {
                tushuncha: "Markusning teskari hududi",
                izoh: "Markus nazariyasining eng mashhur bashorati: <strong>harakatlantiruvchi kuch (−ΔG°) juda katta bo&apos;lganda reaksiya tezligi kamayadi!</strong> Bu — &quot;teskari hudud&quot; (inverted region). Sababi: −ΔG° &gt; λ bo&apos;lganda ΔG<sup>‡</sup> qaytadan ortadi. Eksperimental isbotlangan (Closs, Miller, 1984).",
              },
              {
                tushuncha: "Franck-Condon prinsipi",
                izoh: "Elektron ko&apos;chishi yadro harakatidan ancha tez (10⁻¹⁵ s vs 10⁻¹³ s). Elektron ko&apos;chish vaqtida yadrolar o&apos;z holatini o&apos;zgartirmaydi. Shuning uchun reagentlar oldindan &quot;tayyorlanishi&quot; kerak — bog&apos; uzunliklari oraliq qiymatga moslashishi kerak.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.tushuncha}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.izoh }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. ICHKI SFERA MEXANIZMI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Ichki sfera mexanizmi — Taube mezoni</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Ichki sfera (inner-sphere)</strong> mexanizmda elektron 
              <strong> ko&apos;prik ligand orqali</strong> bir metall ionidan ikkinchisiga o&apos;tadi.
              <strong className="text-yellow-400"> Genri Taube</strong> 1950-yillarda bu mexanizmni kashf etdi 
              va 1983 yilda <strong>Nobel mukofoti</strong>ga sazovor bo&apos;ldi.
              Mexanizmning isboti — <strong>ko&apos;prik ligandning bir kompleksdan ikkinchisiga o&apos;tishi</strong>.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                bosqich: "1-bosqich: Ko&apos;prik hosil bo&apos;lishi",
                izoh: "Bir kompleks (odatda labil) o&apos;z ligandlaridan birini ikkinchi metall ioni bilan ko&apos;prik qilib beradi. Ko&apos;prik ligand kamida bitta erkin elektron juftiga ega bo&apos;lishi kerak. Masalan: Cl⁻, Br⁻, N₃⁻, CN⁻, SCN⁻.",
              },
              {
                bosqich: "2-bosqich: Elektron ko&apos;chishi",
                izoh: "Elektron ko&apos;prik ligandning π yoki σ orbitallari orqali bir metalldan ikkinchisiga o&apos;tadi. Ko&apos;prik ligand elektron o&apos;tkazgich vazifasini bajaradi. Tezlik ko&apos;prikning elektron o&apos;tkazuvchanligiga bog&apos;liq.",
              },
              {
                bosqich: "3-bosqich: Mahsulotlar ajralishi",
                izoh: "Ko&apos;prik ligand endi ikkinchi metall ioni bilan qoladi (yoki birinchisiga qaytadi). Natijada ligand bir kompleksdan ikkinchisiga o&apos;tgan bo&apos;ladi. Bu — ichki sfera mexanizmining <strong>asosiy isboti</strong>.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.bosqich}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-blue-400 font-bold mb-2">Klassik misol: Taube mezoni</h3>
            <p className="text-purple-200 text-sm">
              <strong>[Co(NH₃)₅Cl]²⁺ + [Cr(H₂O)₆]²⁺ → [Co(NH₃)₅(H₂O)]²⁺ + [Cr(H₂O)₅Cl]²⁺</strong><br/>
              Co³⁺ (d⁶, QS) — inert, Cr²⁺ (d⁴, YS) — labil.<br/>
              Cl⁻ ko&apos;prik ligand vazifasini bajaradi. Reaksiya natijasida Cl⁻ Cr²⁺ ga o&apos;tadi.<br/>
              <strong>Isbot:</strong> Co³⁺ inert — u Cl⁻ ni yo&apos;qotmaydi (tashqi sfera mexanizmda Cl⁻ Co da qolishi kerak edi). 
              Cr²⁺ labil — Cl⁻ ni qabul qiladi. <strong>Cl⁻ ning ko&apos;chishi ichki sfera mexanizmining isboti!</strong>
            </p>
          </div>
        </div>

        {/* ── 4. TASHQI VS ICHKI SFERA TAQQOSLASH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚖️ Tashqi sfera vs Ichki sfera — qiyosiy tahlil</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Xususiyat</th>
                <th className="py-3 px-4 text-purple-300">Tashqi sfera</th>
                <th className="py-3 px-4 text-purple-300">Ichki sfera</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Ligandlar o&apos;zgarishi", "Yo&apos;q (qobiqlar saqlanadi)", "Ha (ko&apos;prik ligand ko&apos;chadi)"],
                  ["Ko&apos;prik ligand", "Kerak emas", "Kerak (Cl⁻, Br⁻, CN⁻ va h.k.)"],
                  ["Kompleks labilligi", "Har ikkalasi inert bo&apos;lishi mumkin", "Kamida bittasi labil bo&apos;lishi kerak"],
                  ["Tezlik diapazoni", "10⁻⁶ − 10⁶ M⁻¹s⁻¹", "10⁻³ − 10⁹ M⁻¹s⁻¹"],
                  ["Nazariy asos", "Markus nazariyasi", "Taube mexanizmi"],
                  ["Misol", "[Fe(H₂O)₆]²⁺/³⁺ almashinuv", "[Co(NH₃)₅Cl]²⁺ + [Cr(H₂O)₆]²⁺"],
                  ["Qayta tashkil etish E", "Katta (bog&apos; uzunliklari o&apos;zgaradi)", "Kichik (ko&apos;prik yordam beradi)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 5. AMALIY AHAMIYAT ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Elektron ko&apos;chish reaksiyalarining amaliy ahamiyati</h2>
          
          <div className="space-y-4">
            {[
              {
                soha: "Biologik sistemalar",
                matn: "Nafas olish zanjiri (mitoxondriya): sitoxromlar orasida elektron ko&apos;chishi — tashqi sfera mexanizm. Fotosintez (xloroplast): elektron ko&apos;chish zanjiri. Azotfiksatsiya: Fe-Mo kofaktorda elektron ko&apos;chishi.",
              },
              {
                soha: "Kataliz va energetika",
                matn: "Yoqilg&apos;i elementlari: O₂ qaytarilishi va H₂ oksidlanishi — elektron ko&apos;chish reaksiyalari. Suv fotolizi: Ru komplekslari katalizator sifatida. Metall-organik karkaslar (MOF): elektron ko&apos;chish xossalari.",
              },
              {
                soha: "Molekulyar elektronika",
                matn: "Molekulyar simlar: ko&apos;prik ligandlar orqali elektron ko&apos;chishi. Redoks-aktiv ligandlar: elektron saqlash va uzatish. Spintronika: spin-selektiv elektron ko&apos;chishi.",
              },
              {
                soha: "Sintezda qo&apos;llanish",
                matn: "Oksidlanish-qaytarilish katalizi: elektron ko&apos;chish tezligini boshqarish orqali selektivlikni oshirish. Metall-organik sintez: elektron ko&apos;chish orqali yangi bog&apos;lar hosil qilish.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.soha}</h3>
                <p className="text-purple-200 text-sm">{r.matn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-yellow-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Tashqi sfera:</strong> ligandlar o&apos;zgarmaydi, Markus nazariyasi, qayta tashkil etish energiyasi λ</li>
            <li><strong className="text-yellow-400">Ichki sfera:</strong> ko&apos;prik ligand orqali, Taube mezoni, ligand almashinuvi</li>
            <li><strong className="text-yellow-400">Markusning teskari hududi:</strong> −ΔG° &gt; λ bo&apos;lganda tezlik kamayadi</li>
            <li><strong className="text-yellow-400">Klassik misol:</strong> [Co(NH₃)₅Cl]²⁺ + [Cr(H₂O)₆]²⁺ — Cl⁻ ko&apos;chishi ichki sfera isboti</li>
            <li><strong className="text-yellow-400">Amaliyot:</strong> biologiya, energetika, molekulyar elektronika, kataliz</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kinetika/kvadrat-planar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Kvadrat-planar almashinish
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kinetika/parametrlar" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            Kinetik parametrlar →
          </Link>
        </div>

      </section>
    </main>
  )
}