import Link from "next/link"

export default function LMNAsoslari() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/ligand-maydon" className="text-purple-400 hover:text-purple-300 text-lg">← Ligand maydon</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">📐 LMN asoslari</h1>
          <p className="text-purple-400 text-sm">KMN va MO birlashmasi • Metall-ligand orbitallarining simmetriya bo'yicha ta'siri • SALC</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Ligand maydon nazariyasi haqida</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Ligand maydon nazariyasi (LMN)</strong> — bu kristall maydon nazariyasi (KMN) 
              va molekulyar orbitallar (MO) nazariyasining <strong className="text-yellow-400">sintezi</strong> hisoblanadi.
              KMN faqat d-orbitallarga e'tibor berib, ligandlarni oddiy nuqtaviy manfiy zaryad deb hisoblaydi.
              LMN esa <strong className="text-yellow-400">ligandlarning orbitallarini ham hisobga oladi</strong> — 
              bu esa unga KMN tushuntira olmagan ko'plab xususiyatlarni izohlash imkonini beradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nima uchun LMN kerak?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• KMN <strong>π-bog'lanishni</strong> tushuntirmaydi</li>
                <li>• Nega CO kuchli, Cl⁻ kuchsiz maydonli — KMN bilmaydi</li>
                <li>• <strong>Zaryad ko'chishi</strong> (LMCT, MLCT) — faqat LMN da</li>
                <li>• <strong>Spektrlarning intensivligi</strong> — LMN tushuntiradi</li>
                <li>• Δo ni <strong>hisoblash</strong> imkonini beradi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">LMN ning asosiy g'oyasi</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Metall va ligand orbitallari <strong>birgalikda</strong> qaraladi</li>
                <li>• Faqat <strong>bir xil simmetriyali</strong> orbitallar ta'sirlashadi</li>
                <li>• Ligand orbitallari <strong>SALC</strong> ga birlashtiriladi</li>
                <li>• Hosil bo'lgan MO lar — bog'lovchi, bo'shashtiruvchi, bog'lamaydigan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. KMN KAMCHILIKLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚠️ KMN ning 4 ta asosiy kamchiligi</h2>
          
          <div className="space-y-4">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">1. Metall-ligand bog'lanishini hisobga olmaydi</h3>
              <p className="text-purple-200 text-sm">
                KMN ligandlarni <strong>nuqtaviy manfiy zaryad</strong> deb qaraydi. Aslida esa metall va ligand 
                orbitallari <strong>qoplashadi</strong> va kovalent bog' hosil qiladi. LMN bu qoplashishni hisobga oladi.
              </p>
            </div>
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-2">2. Nega CO kuchli, Cl⁻ kuchsiz maydonli?</h3>
              <p className="text-purple-200 text-sm">
                Ikkalasi ham manfiy zaryadli emas (CO neytral, Cl⁻ manfiy). KMN bo'yicha Cl⁻ kuchliroq bo'lishi kerak edi.
                Aslida <strong>CO — eng kuchli maydonli ligand</strong>. Sababi: π-akseptor xususiyati. Buni faqat LMN tushuntiradi.
              </p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">3. Barqarorlikni tushuntirmaydi</h3>
              <p className="text-purple-200 text-sm">
                KMN faqat elektrostatik tortishishni hisobga oladi. Aslida <strong>kovalent bog'lanish</strong> ham 
                mavjud — ayniqsa kuchli maydonli ligandlarda. LMN buni hisobga oladi.
              </p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">4. Δo ni aniq hisoblay olmaydi</h3>
              <p className="text-purple-200 text-sm">
                KMN da Δo — <strong>empirik parametr</strong>, uni faqat tajribada o'lchash mumkin.
                LMN da esa orbitallarning qoplashish darajasidan <strong>nazariy hisoblash</strong> imkoniyati mavjud.
              </p>
            </div>
          </div>
        </div>

        {/* 3. SALC */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔤 SALC — Simmetriya adaptasiyalangan chiziqli kombinatsiya</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">SALC (Symmetry Adapted Linear Combination)</strong> — 
              bu bir xil simmetriyaga ega bo'lgan <strong>ligand orbitallarining matematik kombinatsiyasi</strong>.
              Oktaedrik kompleksda 6 ta ligandning har biri bittadan σ-orbital beradi (jami 6 ta).
              Bu 6 ta orbital simmetriya bo'yicha <strong>4 ta guruhga</strong> ajraladi.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">a₁g — 1 ta SALC</h3>
              <p className="text-purple-200 text-sm">
                Barcha 6 ta ligand orbitali <strong>bir xil ishorada</strong> qo'shiladi (to'liq simmetrik).
                Bu kombinatsiya <strong>metallning s-orbitali</strong> bilan bir xil simmetriyaga ega — ular ta'sirlashadi.
              </p>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-2">t₁u — 3 ta SALC</h3>
              <p className="text-purple-200 text-sm">
                Ligand orbitallari <strong>x, y, z o'qlari bo'ylab</strong> qarama-qarshi ishoralarda qo'shiladi.
                Bu kombinatsiyalar <strong>metallning p<sub>x</sub>, p<sub>y</sub>, p<sub>z</sub> orbitallari</strong> bilan bir xil simmetriyaga ega.
              </p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">eg — 2 ta SALC</h3>
              <p className="text-purple-200 text-sm">
                Ligand orbitallari <strong>dz² va dx²−y²</strong> simmetriyasida qo'shiladi.
                Aynan shu orbitallar oktaedrik maydonda <strong>eng yuqori energiyaga</strong> ega bo'ladi.
              </p>
            </div>
            <div className="bg-gray-600/10 border border-gray-500/30 rounded-xl p-5">
              <h3 className="text-gray-400 font-bold mb-2">t₂g — mos kelmaydi!</h3>
              <p className="text-purple-200 text-sm">
                Metallning <strong>dxy, dxz, dyz</strong> orbitallari hech qaysi ligand SALC bilan simmetriya bo'yicha mos kelmaydi.
                Shuning uchun ular <strong>bog'lamaydigan orbital</strong> bo'lib qoladi — aynan KMN dagi t₂g!
              </p>
            </div>
          </div>
        </div>

        {/* 4. JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Oktaedrik kompleksda metall va ligand orbitallarining simmetriya mosligi</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Simmetriya</th>
                <th className="py-3 px-4 text-purple-300">Metall orbitali</th>
                <th className="py-3 px-4 text-purple-300">Ligand SALC soni</th>
                <th className="py-3 px-4 text-purple-300">Hosil bo'lgan MO</th>
                <th className="py-3 px-4 text-purple-300">Energiya</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-mono font-bold text-yellow-400">a₁g</td>
                  <td className="py-3 px-4">4s</td><td className="py-3 px-4">1 ta</td>
                  <td className="py-3 px-4"><span className="text-green-400">1σ</span> + <span className="text-red-400">1σ*</span></td>
                  <td className="py-3 px-4 text-xs">Eng past / Yuqori</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-mono font-bold text-yellow-400">t₁u</td>
                  <td className="py-3 px-4">4p<sub>x</sub>, 4p<sub>y</sub>, 4p<sub>z</sub></td><td className="py-3 px-4">3 ta</td>
                  <td className="py-3 px-4"><span className="text-green-400">3σ</span> + <span className="text-red-400">3σ*</span></td>
                  <td className="py-3 px-4 text-xs">Past / Yuqori</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-mono font-bold text-yellow-400">eg</td>
                  <td className="py-3 px-4">3d<sub>z²</sub>, 3d<sub>x²−y²</sub></td><td className="py-3 px-4">2 ta</td>
                  <td className="py-3 px-4"><span className="text-green-400">2σ</span> + <span className="text-red-400">2σ*</span></td>
                  <td className="py-3 px-4 text-xs">O'rta / Yuqori</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-yellow-400">t₂g</td>
                  <td className="py-3 px-4">3d<sub>xy</sub>, 3d<sub>xz</sub>, 3d<sub>yz</sub></td>
                  <td className="py-3 px-4 text-red-400">0 (mos kelmaydi)</td>
                  <td className="py-3 px-4"><span className="text-gray-400">Bog'lamaydigan</span></td>
                  <td className="py-3 px-4 text-xs">Oraliq (Δo ni belgilaydi)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>LMN = <strong className="text-yellow-400">KMN + MO nazariyasi</strong> — ikkalasining kuchli tomonlarini birlashtiradi</li>
            <li>KMN ning 4 ta kamchiligini bartaraf etadi</li>
            <li>Ligand orbitallari <strong>SALC</strong> orqali simmetriya bo'yicha guruhlanadi</li>
            <li>t₂g — <strong>bog'lamaydigan</strong> (ligandda mos keladigan simmetriya yo'q)</li>
            <li>LMN <strong>barcha xossalarni</strong> — rang, magnit, spektr, barqarorlik — tushuntiradi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/ligand-maydon" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Ligand maydon</Link>
          <Link href="/ilmiy/chuqurlashgan/ligand-maydon/sigma-boglanish" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">σ-bog'lanish →</Link>
        </div>

      </section>
    </main>
  )
}