import Link from "next/link"

export default function KatalitikSikllar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/reaksiyalar" className="text-purple-400 hover:text-purple-300 text-lg">← Reaksiyalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">⚗️ Metall kompleks katalizatorlari</h1>
          <p className="text-purple-400 text-sm">Monsanto • Wacker • Grubbs • Suzuki/Heck • Ziegler-Natta</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Metall kompleks katalizatorlari haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-blue-400">Metall kompleks katalizatorlari</strong> — zamonaviy sanoat 
              kimyosining <strong className="text-blue-400">yuragi</strong>. Ular <strong>yuqori selektivlik, 
              past harorat va bosimda ishlash, yumshoq sharoitda murakkab molekulalarni sintez qilish</strong> 
              imkonini beradi. 2001, 2005 va 2010-yillarda Nobel mukofotlari aynan metall kompleks katalizatorlari 
              uchun berilgan (Knowles, Noyori, Sharpless — asimmetrik kataliz; Chauvin, Grubbs, Schrock — 
              metatezis; Heck, Negishi, Suzuki — cross-coupling).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            {[
              { award: "Nobel 2001", laureates: "Knowles, Noyori, Sharpless", topic: "Asimmetrik gidrogenlash va oksidlanish" },
              { award: "Nobel 2005", laureates: "Chauvin, Grubbs, Schrock", topic: "Olefin metatezisi" },
              { award: "Nobel 2010", laureates: "Heck, Negishi, Suzuki", topic: "Palladiy katalizli cross-coupling" },
            ].map((r, i) => (
              <div key={i} className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-yellow-400 font-bold text-sm">{r.award}</p>
                <p className="text-purple-300 text-xs mt-1">{r.laureates}</p>
                <p className="text-blue-400 text-xs mt-2">{r.topic}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. MONSANTO — Rh KATALIZI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏭 Monsanto jarayoni — Sirka kislota sintezi (Rh)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-blue-400">Monsanto jarayoni</strong> — metanoldan sirka kislota olishning 
            sanoat usuli (1966). <strong>[Rh(CO)₂I₂]⁻</strong> katalizatori ishtirokida 
            <strong>CH₃OH + CO → CH₃COOH</strong>. Selektivlik {'>'} 99%, bosim 30−60 atm, harorat 150−200°C.
            Keyinchalik <strong>Cativa jarayoni</strong> (Ir katalizatori) bilan takomillashtirilgan.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-blue-400 font-bold mb-3">Katalitik sikl — 6 bosqich:</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">1. Oksidlovchi qo'shilish:</strong> [Rh(CO)₂I₂]⁻ + CH₃I → [Rh(CO)₂I₃(CH₃)]⁻ (Rh⁺ → Rh³⁺)</p>
              <p><strong className="text-yellow-400">2. Migratsion kiritilish:</strong> [Rh(CO)₂I₃(CH₃)]⁻ → [Rh(CO)I₃(COCH₃)]⁻ (CH₃ CO ga hujum qiladi)</p>
              <p><strong className="text-yellow-400">3. CO koordinatsiyasi:</strong> [Rh(CO)I₃(COCH₃)]⁻ + CO → [Rh(CO)₂I₃(COCH₃)]⁻</p>
              <p><strong className="text-yellow-400">4. Qaytaruvchi ajralish:</strong> [Rh(CO)₂I₃(COCH₃)]⁻ → [Rh(CO)₂I₂]⁻ + CH₃COI</p>
              <p><strong className="text-yellow-400">5. Gidroliz:</strong> CH₃COI + H₂O → CH₃COOH + HI (katalizatordan tashqari)</p>
              <p><strong className="text-yellow-400">6. CH₃I regeneratsiyasi:</strong> CH₃OH + HI → CH₃I + H₂O</p>
            </div>
          </div>
        </div>

        {/* 3. WACKER — Pd/Cu */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏭 Wacker jarayoni — Asetaldegid sintezi (Pd/Cu)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-blue-400">Wacker jarayoni</strong> — etilenni bevosita oksidlab 
            asetaldegid olish (1959). <strong>PdCl₂ + CuCl₂</strong> katalitik tizimi:
            <strong>C₂H₄ + ½O₂ → CH₃CHO</strong>. Pd²⁺ etilenni oksidlaydi, Cu²⁺ Pd⁰ ni Pd²⁺ ga qaytaradi, 
            O₂ Cu⁺ ni Cu²⁺ ga oksidlaydi — <strong>mukammal katalitik sikl!</strong>
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-blue-400 font-bold mb-3">Wacker sikli — 4 asosiy bosqich:</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">1. Etilen koordinatsiyasi va hujum:</strong> [PdCl₄]²⁻ + C₂H₄ + H₂O → [PdCl₂(C₂H₄)] + 2Cl⁻; so'ng suv hujumi → [PdCl₂(CH₂CH₂OH)]⁻</p>
              <p><strong className="text-yellow-400">2. β-gidrid ajralishi:</strong> [PdCl₂(CH₂CH₂OH)]⁻ → HPdCl₂ + CH₃CHO (asetaldegid ajraladi)</p>
              <p><strong className="text-yellow-400">3. Pd⁰ qayta oksidlanishi:</strong> Pd⁰ + 2CuCl₂ + 2Cl⁻ → [PdCl₄]²⁻ + 2CuCl</p>
              <p><strong className="text-yellow-400">4. Cu⁺ oksidlanishi:</strong> 2CuCl + ½O₂ + 2HCl → 2CuCl₂ + H₂O</p>
            </div>
          </div>
        </div>

        {/* 4. GRUBBS — Ru METATEZISI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Grubbs katalizatori — Olefin metatezisi (Ru)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-blue-400">Olefin metatezisi</strong> — ikkita alken o'rtasida 
            <strong> C=C bog'larining almashinuvi</strong>: R₁CH=CHR₂ + R₃CH=CHR₄ ⇌ R₁CH=CHR₃ + R₂CH=CHR₄.
            <strong>Grubbs katalizatori (1992)</strong> — Ru asosidagi barqaror karben kompleksi.
            Bu reaksiya <strong>farmatsevtika, polimerlar va nozik organik sintezda</strong> keng qo'llaniladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">Grubbs I — birinchi avlod</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Formula:</strong> RuCl₂(PCy₃)₂(=CHPh)</li>
                <li>• <strong>Faolligi:</strong> O'rtacha — terminal alkenlar bilan</li>
                <li>• <strong>Barqarorligi:</strong> Havoda barqaror — ishlatish oson</li>
                <li>• <strong>Kamchiligi:</strong> Ichki alkenlar bilan sekin</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">Grubbs II — ikkinchi avlod</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Formula:</strong> RuCl₂(IMes)(PCy₃)(=CHPh)</li>
                <li>• <strong>Faolligi:</strong> Yuqori — ichki alkenlar bilan ham</li>
                <li>• <strong>NHC ligand:</strong> IMes (N-heterotsiklik karben) — donorlik kuchli</li>
                <li>• <strong>Qo'llanish:</strong> Polimerlar, makrotsikllar, farmatsevtika</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-blue-400 font-bold mb-2">Metatezis mexanizmi — Chauvin modeli (1971):</h3>
            <div className="space-y-1 text-xs text-purple-200">
              <p>• Metall karben (M=CHR) + alken → metallatsiklobutan oraliq birikmasi</p>
              <p>• Metallatsiklobutan → yangi M=CHR' + yangi alken ([2+2] sikloaddit-si qayta)</p>
              <p>• Bu siklik jarayon <strong>qaytar</strong> — muvozanatni siljitish orqali kerakli mahsulotga yo'naltiriladi</p>
            </div>
          </div>
        </div>

        {/* 5. SUZUKI — Pd CROSS-COUPLING */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Suzuki-Miyaura cross-coupling (Pd)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-blue-400">Suzuki reaksiyasi (1979)</strong> — Pd katalizatori ishtirokida 
            organobor kislotalari va organogalogenidlar o'rtasidagi <strong>C−C bog' hosil qilish</strong> 
            reaksiyasi. Yumshoq sharoitda boradi, <strong>suvga va havoga chidamli</strong>, 
            turli funktsional guruhlar bilan mos keladi. Farmatsevtika sanoatida eng ko'p qo'llaniladigan 
            cross-coupling reaksiyasi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-blue-400 font-bold mb-3">Suzuki katalitik sikli — 3 asosiy bosqich:</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">1. Oksidlovchi qo'shilish:</strong> Pd⁰Lₙ + R−X → R−Pd²⁺−X (Pd⁰ → Pd²⁺, organogalogenid aktivlanadi)</p>
              <p><strong className="text-yellow-400">2. Transmetallash:</strong> R−Pd−X + R'−B(OH)₂ + NaOH → R−Pd−R' + Na[B(OH)₃X]</p>
              <p><strong className="text-yellow-400">3. Qaytaruvchi ajralish:</strong> R−Pd−R' → Pd⁰Lₙ + R−R' (C−C bog' hosil bo'ladi, katalizator regeneratsiya)</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
              <h3 className="text-green-400 font-bold text-sm mb-2">Afzalliklari</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• Bor reagentlari <strong>toksik emas</strong> (Sn, Zn dan farqli)</li>
                <li>• Suvli muhitda ishlaydi</li>
                <li>• Yumshoq sharoit (60−100°C)</li>
                <li>• Keng substrat diapazoni</li>
              </ul>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
              <h3 className="text-yellow-400 font-bold text-sm mb-2">Qo'llanish sohalari</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Farmatsevtika:</strong> Losartan, valsartan (gipertoniya dori)</li>
                <li>• <strong>Agrokimyo:</strong> Boscalid (fungitsid)</li>
                <li>• <strong>Materiallar:</strong> OLED, suyuq kristallar</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Monsanto — <strong className="text-blue-400">Rh katalizli sirka kislota sintezi</strong>, {'>'}99% selektivlik</li>
            <li>Wacker — <strong className="text-blue-400">Pd/Cu tandem katalizi</strong> — etilen → asetaldegid</li>
            <li>Grubbs — <strong className="text-blue-400">Ru katalizli olefin metatezisi</strong> (Nobel 2005)</li>
            <li>Suzuki — <strong className="text-blue-400">Pd katalizli C−C cross-coupling</strong> (Nobel 2010)</li>
            <li>Barcha sikllarda <strong className="text-blue-400">oksidlovchi qo'shilish, migratsion kiritilish, qaytaruvchi ajralish</strong> — asosiy elementar bosqichlar</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar/oksidlanish-qaytarilish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Oksidlanish-qaytarilish</Link>
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar/fotokimyoviy" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Fotokimyoviy reaksiyalar →</Link>
        </div>

      </section>
    </main>
  )
}