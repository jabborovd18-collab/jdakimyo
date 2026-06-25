import Link from "next/link"

export default function KoordinatsionPolimerlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/reaksiyalar" className="text-purple-400 hover:text-purple-300 text-lg">← Reaksiyalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🔗 Koordinatsion polimerlanish</h1>
          <p className="text-purple-400 text-sm">MOF sintezi • O'z-o'zini yig'ish • Sol-gel • Koordinatsion tarmoqlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Koordinatsion polimerlar haqida</h2>
          
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-orange-400">Koordinatsion polimerlar (CP)</strong> — metall ionlari 
              va ko'prik ligandlarning <strong>o'z-o'zini yig'ish (self-assembly)</strong> orqali 
              hosil qilgan cheksiz tarmoqli birikmalari. <strong className="text-orange-400">MOF 
              (Metal-Organic Frameworks)</strong> — koordinatsion polimerlarning eng muhim sinfi bo'lib, 
              <strong>yuqori g'ovaklik, katta ichki yuza (BET 1000−7000 m²/g) va sozlanuvchan tuzilish</strong> 
              ga ega. MOF lar <strong>gaz saqlash (H₂, CH₄, CO₂), kataliz, dori yetkazib berish 
              va sensorlar</strong> da qo'llaniladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold mb-2">MOF — Metal-Organic Framework</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Metall tugunlar (SBU):</strong> Zn₄O, Cu₂, Zr₆, Cr₃ klasterlari</li>
                <li>• <strong>Ko'prik ligandlar:</strong> Dikarbonatlar (BDC, BTC), bipiridinlar, imidazolatlar</li>
                <li>• <strong>Tuzilish:</strong> 1D, 2D yoki 3D tarmoqlar</li>
                <li>• <strong>G'ovaklik:</strong> 50−90% bo'sh hajm</li>
                <li>• <strong>BET yuzasi:</strong> 1000−7000 m²/g (rekord: 7800 m²/g!)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold mb-2">Sintez usullari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Solvotermal:</strong> Metall tuzi + ligand + erituvchi → 80−200°C, avtoklav</li>
                <li>• <strong>Mikroto'lqinli:</strong> Tezroq, kichik kristallar</li>
                <li>• <strong>Mexanokimyoviy:</strong> Qattiq fazada, erituvchisiz</li>
                <li>• <strong>Elektrokimyoviy:</strong> Metall elektrod + ligand eritmasi</li>
                <li>• <strong>Sol-gel:</strong> Kolloid zol → gel → quritish → aerogel</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. KLASSIK MOF LAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Klassik MOF materiallari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "MOF-5 (IRMOF-1)",
                formula: "Zn₄O(BDC)₃",
                sbu: "Zn₄O (tetraedrik)",
                bet: "~3000 m²/g",
                pore: "12 Å",
                year: "1999 (Yaghi)",
                note: "Birinchi yuqori g'ovakli MOF"
              },
              {
                name: "HKUST-1",
                formula: "Cu₃(BTC)₂",
                sbu: "Cu₂ paddlewheel",
                bet: "~1800 m²/g",
                pore: "9 Å",
                year: "1999 (Williams)",
                note: "Ko'k kristall, katalizda"
              },
              {
                name: "ZIF-8",
                formula: "Zn(MeIM)₂",
                sbu: "Zn (tetraedrik)",
                bet: "~1900 m²/g",
                pore: "3.4 Å",
                year: "2006 (Yaghi)",
                note: "Zeolit tipidagi, suvga chidamli"
              },
            ].map((r, i) => (
              <div key={i} className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
                <h3 className="text-orange-400 font-bold font-mono">{r.name}</h3>
                <p className="text-purple-300 text-xs mt-1">{r.formula}</p>
                <div className="mt-3 space-y-1 text-xs">
                  <p className="text-white"><strong>SBU:</strong> {r.sbu}</p>
                  <p className="text-yellow-400"><strong>BET:</strong> {r.bet}</p>
                  <p className="text-green-400"><strong>G'ovak:</strong> {r.pore}</p>
                  <p className="text-cyan-400"><strong>Yil:</strong> {r.year} ({r.note})</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. MOF QO'LLANISHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 MOF larning qo'llanish sohalari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Gaz saqlash va ajratish",
                desc: "H₂ saqlash (77 K, 60 bar — 7.5 wt%), CH₄ saqlash, CO₂ ushlash (zavod chiqindilaridan). MOF-210 — rekord BET 6240 m²/g. Gaz molekulalarini o'lchamiga qarab molekulyar elak sifatida ajratish.",
                color: "bg-blue-600/10 border-blue-500/30"
              },
              {
                title: "Kataliz",
                desc: "MOF larda metall tugunlar (Lewis kislota markazlari) yoki g'ovaklardagi katalitik nan zarrachalar. HKUST-1 — CO oksidlanishi, ZIF-8 — Knoevenagel kondensatsiyasi. Enantioselektiv kataliz uchun xiral MOF lar.",
                color: "bg-green-600/10 border-green-500/30"
              },
              {
                title: "Dori yetkazib berish",
                desc: "MOF g'ovaklariga dori molekulalarini yuklash va pH/haroratga sezgir ajratish. MIL-100(Fe) — ibuprofen yetkazib berish (3 kun davomida ajraladi). Zr-MOF lar — fosfat buferida barqaror (biomuhitda).",
                color: "bg-red-600/10 border-red-500/30"
              },
              {
                title: "Sensorlar va o'tkazgichlar",
                desc: "Lyuminestsent MOF lar — nitroaromatik portlovchi moddalarni aniqlash (ppm darajasida). Proton o'tkazuvchan MOF lar — yoqilg'i elementlari uchun. Elektr o'tkazuvchan MOF lar — superkondensatorlar.",
                color: "bg-purple-600/10 border-purple-500/30"
              },
            ].map((r, i) => (
              <div key={i} className={`rounded-xl p-5 border ${r.color}`}>
                <h3 className="text-orange-400 font-bold mb-2">{r.title}</h3>
                <p className="text-purple-200 text-xs">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. SOL-GEL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Sol-gel jarayoni — koordinatsion kimyoda</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-orange-400">Sol-gel</strong> — metall alkoksidlarining gidrolizi va 
            kondensatsiyasi orqali <strong>kolloid zol → gel → kserogel/aerogel</strong> o'tish jarayoni.
            Koordinatsion kimyo nuqtai nazaridan, bu <strong>M−O−M ko'prik bog'lari</strong> orqali 
            polimerlanishdir.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-orange-400 font-bold mb-3">Sol-gel bosqichlari (TEOS misolida):</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">1. Gidroliz:</strong> Si(OEt)₄ + 4H₂O → Si(OH)₄ + 4EtOH</p>
              <p><strong className="text-yellow-400">2. Kondensatsiya:</strong> 2Si(OH)₄ → (HO)₃Si−O−Si(OH)₃ + H₂O</p>
              <p><strong className="text-yellow-400">3. Polikondensatsiya:</strong> Si−O−Si tarmoq o'sadi → zol (kolloid)</p>
              <p><strong className="text-yellow-400">4. Gel hosil bo'lishi:</strong> Zol zarrachalari bog'lanadi → gel</p>
              <p><strong className="text-yellow-400">5. Quritish:</strong> Erituvchi bug'lanadi → kserogel (oddiy) yoki aerogel (CO₂ da)</p>
            </div>
          </div>

          <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-yellow-400 font-bold mb-2">Gibrid sol-gel materiallar</h3>
            <p className="text-purple-200 text-sm">
              Metall komplekslari sol-gel matritsaga <strong>immobilizatsiya qilinadi</strong> — 
              [Ru(bpy)₃]²⁺, lantanid komplekslari, metall porfirinlar. Natijada 
              <strong>fotofaol, katalitik yoki sensor xossali</strong> gibrid materiallar olinadi.
              Masalan, [Ru(bpy)₃]²⁺ @ SiO₂ — kislorod sensori (fosforessensiya so'ndirilishi orqali).
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>MOF — <strong className="text-orange-400">metall tugunlar + ko'prik ligandlar</strong> = g'ovakli 3D tarmoq</li>
            <li>BET yuzasi <strong className="text-orange-400">1000−7800 m²/g</strong> — eng yuqori g'ovakli materiallar</li>
            <li>Qo'llanish: <strong className="text-orange-400">gaz saqlash, kataliz, dori yetkazish, sensorlar</strong></li>
            <li>Sol-gel — <strong className="text-orange-400">M−O−M ko'priklar orqali</strong> koordinatsion polimerlanish</li>
            <li>O'z-o'zini yig'ish — <strong className="text-orange-400">termodinamik nazorat ostida</strong> tartibli tuzilmalar</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar/templat-sintez" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Templat sintez</Link>
          <Link href="/ilmiy/chuqurlashgan/metall-dorilar" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">Metall dori vositalari →</Link>
        </div>

      </section>
    </main>
  )
}