import Link from "next/link"

export default function KompleksMetallar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="text-purple-400 hover:text-purple-300 text-lg">← Atom tuzilishi</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🧲 Kompleks hosil qiluvchi metallar</h1>
          <p className="text-purple-400 text-sm">3d, 4d, 5d elementlari • Ion radiusi • Elektron konfiguratsiya ta'siri</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kompleks hosil qiluvchi metallar haqida</h2>
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">d-elementlar</strong> — kompleks birikmalarning asosiy markaziy atomlari.
              Ular <strong className="text-yellow-400">bo'sh d-orbitallarga</strong> ega bo'lgani uchun ligandlardan elektron juftlarini qabul qiladi (Luis kislotasi).
              3d, 4d va 5d elementlari orasida kompleks hosil qilish qobiliyati <strong>ion radiusi, zaryad va elektron konfiguratsiyaga</strong> bog'liq.
            </p>
          </div>
        </div>

        {/* 2. 3D METALLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🟢 3d metallar (birinchi qator)</h2>
          
          <p className="text-purple-200 mb-4">Eng ko'p o'rganilgan va eng keng tarqalgan kompleks hosil qiluvchi metallar.</p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ion</th><th className="py-3 px-4 text-purple-300">dⁿ</th><th className="py-3 px-4 text-purple-300">Radius (pm)</th><th className="py-3 px-4 text-purple-300">Asosiy KS</th><th className="py-3 px-4 text-purple-300">Xususiyati</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Ti³⁺", "d¹", "67", "6", "d¹ — eng sodda konfiguratsiya"],
                  ["V³⁺", "d²", "64", "6", "Ikki toq elektron — paramagnit"],
                  ["Cr³⁺", "d³", "62", "6", "Juda barqaror oktaedrik komplekslar"],
                  ["Mn²⁺", "d⁵", "83", "6", "Yuqori spin — 5 ta toq elektron"],
                  ["Fe²⁺/Fe³⁺", "d⁶/d⁵", "78/65", "6", "Eng muhim metall — gemoglobin"],
                  ["Co²⁺/Co³⁺", "d⁷/d⁶", "75/61", "4/6", "Co³⁺ — Verner klassikasi"],
                  ["Ni²⁺", "d⁸", "69", "4/6", "Tekis kvadrat yoki oktaedrik"],
                  ["Cu²⁺", "d⁹", "73", "4/6", "Yan-Teller effekti — havorang"],
                  ["Zn²⁺", "d¹⁰", "74", "4", "To'liq to'lgan — rangsiz, diamagnit"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 font-bold text-white">{r[3]}</td>
                    <td className="py-3 px-4 text-sm text-purple-300">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
            <p className="text-green-300 text-sm">
              <strong>✅ 3d metallar xususiyatlari:</strong> Kichik ion radiusi, ko'pincha KS=6, 
              suvda akvakompleks holida, rangli birikmalar, paramagnit (d¹−d⁹).
            </p>
          </div>
        </div>

        {/* 3. 4D VA 5D METALLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔵 4d va 5d metallar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">4d elementlari</h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Ru²⁺/Ru³⁺", "d⁶/d⁵", "Koordinatsion son 6, inert"],
                  ["Rh³⁺", "d⁶", "Faqat quyi spinli komplekslar"],
                  ["Pd²⁺", "d⁸", "Deyarli barchasi tekis kvadrat"],
                  ["Ag⁺", "d¹⁰", "Chiziqli komplekslar (KS=2)"],
                  ["Cd²⁺", "d¹⁰", "Tetraedrik komplekslar"],
                ].map((r, i) => (
                  <div key={i} className="bg-purple-900/50 rounded-lg p-3">
                    <p className="text-yellow-400 font-bold">{r[0]}</p>
                    <p className="text-purple-300">{r[1]}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">5d elementlari</h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Os²⁺/Os³⁺", "d⁶/d⁵", "Eng inert komplekslar"],
                  ["Ir³⁺", "d⁶", "Faqat quyi spinli"],
                  ["Pt²⁺", "d⁸", "Sisplatin — saraton davosi!"],
                  ["Au³⁺", "d⁸", "Tekis kvadrat, zar suvi"],
                  ["Hg²⁺", "d¹⁰", "Chiziqli yoki tetraedrik"],
                ].map((r, i) => (
                  <div key={i} className="bg-purple-900/50 rounded-lg p-3">
                    <p className="text-yellow-400 font-bold">{r[0]}</p>
                    <p className="text-purple-300">{r[1]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 mt-4">
            <p className="text-blue-300 text-sm">
              <strong>✅ 4d/5d metallar xususiyatlari:</strong> Katta ion radiusi, yuqori KS mumkin (7, 8, 9), 
              deyarli har doim quyi spinli (Δo juda katta), inert komplekslar.
            </p>
          </div>
        </div>

        {/* 4. ION RADIUSI TA'SIRI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📏 Ion radiusining KS ga ta'siri</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="text-yellow-400 font-bold">Kichik radius</p>
                <p className="text-purple-300">3d metallar</p>
                <p className="text-white">KS = 4 yoki 6</p>
              </div>
              <div>
                <p className="text-yellow-400 font-bold">O'rtacha radius</p>
                <p className="text-purple-300">4d metallar</p>
                <p className="text-white">KS = 6 yoki 7</p>
              </div>
              <div>
                <p className="text-yellow-400 font-bold">Katta radius</p>
                <p className="text-purple-300">5d, f-elementlar</p>
                <p className="text-white">KS = 7, 8, 9, 12</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>3d metallar — <strong className="text-yellow-400">eng ko'p o'rganilgan</strong>, KS asosan 4 yoki 6</li>
            <li>4d/5d metallar — <strong>katta ion radiusi</strong>, yuqori KS, quyi spinli</li>
            <li>Ion radiusi ortishi bilan <strong>KS ham ortadi</strong></li>
            <li>Pt²⁺ (sisplatin), Fe²⁺ (gemoglobin) — <strong>eng muhim kompleks metallar</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/elektron-konfig" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Elektron konfiguratsiyalar</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Atom tuzilishi →</Link>
        </div>

      </section>
    </main>
  )
}