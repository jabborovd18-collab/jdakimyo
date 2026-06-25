"use client"

import Link from "next/link"
import { useState } from "react"

function BioilhomSlayder() {
  const [tab, setTab] = useState("asosiy")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "asosiy", label: "🧬 Asosiy tamoyillar" },
          { key: "namunalar", label: "🔬 Namunalar" },
          { key: "kb", label: "⚛️ KB aloqasi" },
          { key: "kelajak", label: "🚀 Kelajak" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key 
                ? "bg-green-600/80 text-white" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        {tab === "asosiy" && (
          <div className="space-y-4 text-sm text-purple-200">
            <h4 className="text-green-400 font-bold">Bioilhomlantirilgan kataliz — tabiatdan o'rganish</h4>
            
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-2">Asosiy strategiyalar:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-purple-800/30 rounded p-3">
                  <p className="text-green-400 font-bold">1. Strukturaviy biomimetika</p>
                  <p>Ferment faol markazining aynan nusxasini sintez qilish. Misol: [FeFe]-gidrogenaza sun'iy analoglari.</p>
                </div>
                <div className="bg-purple-800/30 rounded p-3">
                  <p className="text-green-400 font-bold">2. Funksional biomimetika</p>
                  <p>Ferment funksiyasini bajaradigan, lekin strukturaviy jihatdan farq qiladigan tizimlar. Misol: Mn-salen (SOD mimikasi).</p>
                </div>
                <div className="bg-purple-800/30 rounded p-3">
                  <p className="text-green-400 font-bold">3. Sun'iy metalofermentlar</p>
                  <p>Oqsil "skafold"iga sintetik metall kompleksini kiritish. Yangi katalitik funksiyalar.</p>
                </div>
                <div className="bg-purple-800/30 rounded p-3">
                  <p className="text-green-400 font-bold">4. Gibrid katalizatorlar</p>
                  <p>Nanomaterial + biomolekula = yangi xossalar. Oltin nanozarralar + ferment.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "namunalar" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-green-400 font-bold">Muvaffaqiyatli bioilhomlantirilgan tizimlar</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-purple-700/50">
                    <th className="text-left py-2 px-3 text-yellow-400">Sun'iy tizim</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Tabiiy analog</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Metall</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Funksiyasi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Holati</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["Mn-salen komplekslari", "Mn-SOD", "Mn³⁺", "O₂⁻ dismutatsiyasi", "Klinik sinov (EU-134)"],
                    ["[FeFe]-gidrogenaza modellari", "[FeFe]-gidrogenaza", "Fe", "H₂ sintezi", "Tadqiqot bosqichi"],
                    ["Mo-N₂ komplekslari", "Nitrogenaza", "Mo", "N₂ → NH₃", "Tadqiqot (Nishibayashi)"],
                    ["Fe-porfirin (sun'iy P450)", "P450", "Fe", "C−H gidroksillanishi", "Organik sintezda qo'llaniladi"],
                    ["Zn-siklen komplekslari", "Karboangidraza", "Zn²⁺", "CO₂ gidratatsiyasi", "CO₂ ushlash"],
                    ["Ru-bipy fotokatalizatorlar", "Fotosistema II", "Ru", "Suv oksidlanishi", "Sun'iy fotosintez"],
                    ["Mn₄Ca klaster modellari", "OEC (PSII)", "Mn, Ca", "Suv oksidlanishi", "Tadqiqot bosqichi"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-2 px-3"><strong className="text-green-400">{row[0]}</strong></td>
                      <td className="py-2 px-3">{row[1]}</td>
                      <td className="py-2 px-3">{row[2]}</td>
                      <td className="py-2 px-3">{row[3]}</td>
                      <td className="py-2 px-3">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "kb" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-green-400 font-bold">KB tamoyillarining bioilhomlantirilgan katalizdagi roli</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Geometriya nazorati</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Koordinatsion son:</strong> metall markazi atrofidagi bo'shliq substrat uchun</li>
                  <li>• <strong>Xelat effekti:</strong> makrotsiklik ligandlar — barqarorlik</li>
                  <li>• <strong>Sterik himoya:</strong> katta ligandlar — selektivlik</li>
                  <li>• <strong>Entatik holat:</strong> buzilgan geometriya — aktivatsiya energiyasini pasaytirish</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Elektron xususiyatlar</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Redoks potensial sozlanishi:</strong> ligand donorlik kuchi orqali</li>
                  <li>• <strong>CFSE:</strong> spin holat va geometriya tanlash</li>
                  <li>• <strong>HSAB:</strong> metall-ligand mosligi — selektivlik</li>
                  <li>• <strong>Ikkinchi koordinatsion sfera:</strong> proton uzatish, H-bog'lar</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "kelajak" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-green-400 font-bold">Kelajak yo'nalishlari</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Sun'iy fotosintez</p>
                <p className="text-xs">Suv + CO₂ + yorug'lik → yoqilg'i. Ru/Ir komplekslari + Mn₄Ca modellari. Quyosh energiyasini saqlash.</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">N₂ fiksatsiyasi (yumshoq sharoitda)</p>
                <p className="text-xs">Haber-Bosch alternativi. FeMo-kofaktor modellari. Xona haroratida NH₃ sintezi.</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Sun'iy metalofermentlar evolyutsiyasi</p>
                <p className="text-xs">Oqsil dizayni + yangi metall markazlar. Tabiatda uchramaydigan katalitik reaksiyalar.</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">CO₂ utilizatsiyasi</p>
                <p className="text-xs">CO₂ → CH₃OH, CO, HCOOH. Karboangidraza + P450 gibrid tizimlari.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Bioilhomlantirilgan() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/transferrin" className="text-purple-400 hover:text-purple-300 text-lg">← Transferrin</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🧪 Bioilhomlantirilgan kataliz</h1>
          <p className="text-purple-400 text-sm">Sun'iy fermentlar • Biomimetik komplekslar • Ko'p yadroli markazlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Bioilhomlantirilgan kataliz — tabiatdan o'rganib, yangi katalizatorlar yaratish</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-green-400">Bioilhomlantirilgan (biomimetik) kataliz</strong> — 
              tabiiy fermentlarning <strong>tuzilishi va funksiyasidan ilhomlanib</strong>, 
              yangi sun'iy katalizatorlar yaratish. Maqsad: fermentlarning 
              <strong> yuqori samaradorligi va selektivligini</strong> sanoat miqyosida 
              qo'llash mumkin bo'lgan barqaror katalizatorlarga ko'chirish.
              <strong className="text-yellow-400">Koordinatsion birikmalar kimyosi</strong> 
              bu sohaning asosiy qurolidir — metall markazi, ligandlar, geometriya va 
              elektron xususiyatlarni aniq nazorat qilish imkonini beradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">Strukturaviy</p>
              <p className="text-purple-300">Biomimetika</p>
              <p className="text-purple-400 mt-1">
                Ferment faol markazining aynan nusxasi. [FeFe]-gidrogenaza modellari, Mn₄Ca klasterlar.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">Funksional</p>
              <p className="text-purple-300">Biomimetika</p>
              <p className="text-purple-400 mt-1">
                Funksiyani bajaradigan, lekin boshqa strukturali tizimlar. Mn-salen (SOD mimikasi).
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">Sun'iy</p>
              <p className="text-purple-300">Metalofermentlar</p>
              <p className="text-purple-400 mt-1">
                Oqsil + sintetik metall kompleksi. Yangi, tabiatda uchramaydigan funksiyalar.
              </p>
            </div>
          </div>
        </div>

        {/* ASOSIY YUTUQLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏆 Asosiy yutuqlar — tabiatga yaqinlashish</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              Bioilhomlantirilgan kataliz sohasida <strong className="text-yellow-400">eng katta muvaffaqiyatlar</strong>:
              <strong> Mn-salen komplekslari</strong> (SOD mimikasi) klinik sinovlargacha yetib kelgan.
              <strong> Nishibayashi Mo-N₂ komplekslari</strong> xona haroratida N₂ ni NH₃ ga qaytaradi
              (Haber-Bosch ga alternativ). <strong> Sun'iy fotosintez tizimlari</strong> 
              quyosh energiyasidan H₂ ishlab chiqaradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-green-400 font-bold text-sm mb-2">SOD mimikalari</p>
              <ul className="space-y-0.5">
                <li>• <strong>Mn-salen (EU-134):</strong> Mn³⁺ — oktaedrik, O₂⁻ dismutatsiyasi</li>
                <li>• <strong>Mn-porfirin:</strong> AEOL10150 — radiatsiya himoyasi</li>
                <li>• <strong>Afzalligi:</strong> oqsil emas — barqaror, hujayraga kiradi</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-green-400 font-bold text-sm mb-2">Sun'iy gidrogenazalar</p>
              <ul className="space-y-0.5">
                <li>• <strong>[FeFe]-modellar:</strong> Fe₂(CO)₆-x(CN)x — H₂ sintezi</li>
                <li>• <strong>[NiFe]-modellar:</strong> Ni-Fe komplekslar — H₂ oksidlanishi</li>
                <li>• <strong>Elektrokataliz:</strong> elektrodda immobilizatsiya qilingan</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-green-400 font-bold text-sm mb-2">Sun'iy P450</p>
              <ul className="space-y-0.5">
                <li>• <strong>Fe-porfirin + oksidlovchi:</strong> C−H gidroksillanishi</li>
                <li>• <strong>Mn-porfirin:</strong> enantioselektiv epoksidlanish</li>
                <li>• <strong>Organik sintez:</strong> dorilar sintezida qo'llaniladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <BioilhomSlayder />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Bioilhomlantirilgan kataliz — <strong className="text-green-400">tabiiy fermentlardan ilhomlanib</strong> sun'iy katalizatorlar yaratish</li>
            <li><strong className="text-green-400">Strukturaviy biomimetika:</strong> faol markaz nusxasi; <strong className="text-green-400">Funksional:</strong> boshqa struktura, bir xil funksiya</li>
            <li>Eng muvaffaqiyatli namunalar: <strong className="text-green-400">Mn-salen (SOD), Fe-porfirin (P450), [FeFe]-modellar</strong></li>
            <li><strong className="text-green-400">KB tamoyillari:</strong> geometriya, CFSE, HSAB, ikkinchi koordinatsion sfera — katalizator dizaynida</li>
            <li>Kelajak: <strong className="text-green-400">sun'iy fotosintez, N₂ fiksatsiyasi, CO₂ utilizatsiyasi</strong> — yumshoq sharoitda</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/transferrin" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Transferrin</Link>
          <Link href="/ilmiy/chuqurlashgan" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Chuqurlashgan →</Link>
        </div>

      </section>
    </main>
  )
}