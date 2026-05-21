import Link from "next/link"

export default function BarqarorlikKonstantasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/termodinamika" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Termodinamika
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">⚖️ Barqarorlik konstantasi</h1>
          <p className="text-purple-400 text-sm">K<sub>stab</sub> ta&apos;rifi • Bosqichli va umumiy konstantalar • O&apos;lchash usullari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Barqarorlik konstantasi — asosiy tushuncha</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Barqarorlik konstantasi (K<sub>stab</sub>)</strong> — kompleks 
              birikmaning eritmadagi barqarorligini miqdoriy ifodalovchi asosiy termodinamik parametr.
              Bu — <strong>kompleks hosil bo&apos;lish reaksiyasining muvozanat konstantasi</strong>.
              K<sub>stab</sub> qancha katta bo&apos;lsa, kompleks shuncha barqaror. 
              Odatda log K<sub>stab</sub> ko&apos;rinishida ifodalanadi.
              Kompleks birikmalar uchun K<sub>stab</sub> qiymatlari <strong>10³ dan 10⁵⁰ gacha</strong> 
              bo&apos;lishi mumkin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Hosil bo&apos;lish reaksiyasi</h3>
              <p className="text-purple-200 text-sm">
                <strong>M + nL ⇌ ML<sub>n</sub></strong><br/>
                K<sub>stab</sub> = [ML<sub>n</sub>] / ([M] × [L]<sup>n</sup>)<br/>
                <strong>K<sub>diss</sub> = 1/K<sub>stab</sub></strong> — dissotsilanish konstantasi<br/>
                Barqaror komplekslar: K<sub>stab</sub> &gt; 1, log K &gt; 0
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Termodinamik ma&apos;nosi</h3>
              <p className="text-purple-200 text-sm">
                <strong>ΔG° = −RT ln K<sub>stab</sub></strong><br/>
                K<sub>stab</sub> = 10 → ΔG° = −5.7 kJ/mol<br/>
                K<sub>stab</sub> = 10¹⁰ → ΔG° = −57 kJ/mol<br/>
                K<sub>stab</sub> = 10²⁰ → ΔG° = −114 kJ/mol<br/>
                Har bir 10 karra K ortishi ΔG° ga −5.7 kJ qo&apos;shadi
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. BOSQICHLI VA UMUMIY KONSTANTALAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 Bosqichli va umumiy barqarorlik konstantalari</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Kompleks hosil bo&apos;lishi <strong className="text-yellow-400">bosqichma-bosqich</strong> boradi.
              Har bir bosqich o&apos;zining <strong>bosqichli konstantasi (K<sub>i</sub>)</strong> bilan,
              umumiy jarayon esa <strong>umumiy konstanta (β<sub>n</sub>)</strong> bilan xarakterlanadi.
              β<sub>n</sub> = K<sub>1</sub> × K<sub>2</sub> × ... × K<sub>n</sub>.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6">
            <h3 className="text-yellow-400 font-bold mb-2 text-center">[Ni(NH₃)₆]²⁺ hosil bo&apos;lish bosqichlari</h3>
            <div className="space-y-1 text-sm">
              {[
                { bosqich: "Ni²⁺ + NH₃ ⇌ [Ni(NH₃)]²⁺", K: "K₁ = 10²·⁸⁰ = 630", logK: "2.80" },
                { bosqich: "[Ni(NH₃)]²⁺ + NH₃ ⇌ [Ni(NH₃)₂]²⁺", K: "K₂ = 10²·²⁴ = 174", logK: "2.24" },
                { bosqich: "[Ni(NH₃)₂]²⁺ + NH₃ ⇌ [Ni(NH₃)₃]²⁺", K: "K₃ = 10¹·⁷³ = 54", logK: "1.73" },
                { bosqich: "[Ni(NH₃)₃]²⁺ + NH₃ ⇌ [Ni(NH₃)₄]²⁺", K: "K₄ = 10¹·¹⁹ = 15", logK: "1.19" },
                { bosqich: "[Ni(NH₃)₄]²⁺ + NH₃ ⇌ [Ni(NH₃)₅]²⁺", K: "K₅ = 10⁰·⁷⁵ = 5.6", logK: "0.75" },
                { bosqich: "[Ni(NH₃)₅]²⁺ + NH₃ ⇌ [Ni(NH₃)₆]²⁺", K: "K₆ = 10⁰·⁰³ = 1.07", logK: "0.03" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center bg-purple-800/20 rounded-lg px-3 py-1.5">
                  <span className="text-purple-200">{r.bosqich}</span>
                  <span className="text-green-400 text-xs">{r.K}</span>
                </div>
              ))}
            </div>
            <p className="text-purple-300 text-sm mt-3 text-center">
              <strong>Umumiy konstanta:</strong> β<sub>6</sub> = K₁K₂K₃K₄K₅K₆ = 10⁸·⁷⁴ = 5.5×10⁸<br/>
              <strong>Muhim:</strong> K<sub>1</sub> &gt; K<sub>2</sub> &gt; ... &gt; K<sub>n</sub> — har doim kamayib boradi!
            </p>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-2">Nima uchun K<sub>i</sub> kamayib boradi?</h3>
            <p className="text-purple-200 text-sm">
              <strong>1. Statistik omil:</strong> ligandlar soni ortgan sari bo&apos;sh koordinatsion o&apos;rinlar 
              kamayadi — yangi ligandning birikish ehtimoli pasayadi.<br/>
              <strong>2. Elektrostatik omil:</strong> ligandlar orasidagi itarilish kuchayadi.<br/>
              <strong>3. Sterik omil:</strong> katta ligandlarda fazoviy to&apos;siq ortadi.<br/>
              <strong>4. Elektron omil:</strong> metallning effektiv zaryadi kamayadi.
            </p>
          </div>
        </div>

        {/* ── 3. TURLI KOMPLEKSLARNING Kstab ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Turli komplekslarning barqarorlik konstantalari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">Markaziy ion</th>
                <th className="py-3 px-4 text-purple-300">Ligand</th>
                <th className="py-3 px-4 text-purple-300">log β<sub>n</sub></th>
                <th className="py-3 px-4 text-purple-300">Barqarorlik darajasi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Ag(NH₃)₂]⁺", "Ag⁺", "NH₃", "7.2", "O&apos;rtacha"],
                  ["[Cu(NH₃)₄]²⁺", "Cu²⁺", "NH₃", "13.3", "Yuqori"],
                  ["[Ni(NH₃)₆]²⁺", "Ni²⁺", "NH₃", "8.7", "O&apos;rtacha"],
                  ["[Co(NH₃)₆]³⁺", "Co³⁺", "NH₃", "35.2", "Juda yuqori"],
                  ["[Fe(CN)₆]⁴⁻", "Fe²⁺", "CN⁻", "35.4", "Juda yuqori"],
                  ["[Fe(CN)₆]³⁻", "Fe³⁺", "CN⁻", "43.9", "Ekstremal"],
                  ["[Hg(CN)₄]²⁻", "Hg²⁺", "CN⁻", "41.5", "Ekstremal"],
                  ["[Cu(en)₂]²⁺", "Cu²⁺", "en", "20.0", "Juda yuqori (xelat)"],
                  ["[Ni(en)₃]²⁺", "Ni²⁺", "en", "18.3", "Juda yuqori (xelat)"],
                  ["[Fe(EDTA)]²⁻", "Fe²⁺", "EDTA⁴⁻", "14.3", "Yuqori (xelat)"],
                  ["[Fe(EDTA)]⁻", "Fe³⁺", "EDTA⁴⁻", "25.1", "Juda yuqori (xelat)"],
                  ["[Co(EDTA)]⁻", "Co³⁺", "EDTA⁴⁻", "41.4", "Ekstremal (xelat)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 font-bold text-green-400">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Barqarorlik darajalari klassifikatsiyasi</h3>
            <p className="text-purple-200 text-sm">
              <strong>Kuchsiz:</strong> log β &lt; 5 (masalan, [Ni(NH₃)₆]²⁺ — 8.7)<br/>
              <strong>O&apos;rtacha:</strong> log β = 5−10 (masalan, [Ag(NH₃)₂]⁺ — 7.2)<br/>
              <strong>Yuqori:</strong> log β = 10−20 (masalan, [Cu(en)₂]²⁺ — 20.0)<br/>
              <strong>Juda yuqori:</strong> log β = 20−35 (masalan, [Fe(CN)₆]⁴⁻ — 35.4)<br/>
              <strong>Ekstremal:</strong> log β &gt; 35 (masalan, [Fe(CN)₆]³⁻ — 43.9)
            </p>
          </div>
        </div>

        {/* ── 4. O'LCHASH USULLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Barqarorlik konstantalarini o&apos;lchash usullari</h2>
          
          <div className="space-y-4">
            {[
              {
                usul: "1. Potensiometrik titrlash",
                izoh: "Eng keng tarqalgan usul. pH-elektrod yordamida ligandning protonlanish konstantalari va metall-ligand barqarorlik konstantalari aniqlanadi. Afzalligi: yuqori aniqlik (±0.01 log K), keng qo&apos;llanish. Kamchiligi: faqat protonlanuvchi ligandlar uchun.",
                misol: "Bjerrum usuli — [Ni(NH₃)₆]²⁺ konstantalarini aniqlash. NH₃ konsentratsiyasi oshishi bilan pH o&apos;zgarishi kuzatiladi.",
              },
              {
                usul: "2. Spektrofotometrik usul",
                izoh: "UB-Vis spektrlardagi o&apos;zgarishlar orqali. Kompleks hosil bo&apos;lishi natijasida yutilish spektri o&apos;zgaradi. Job usuli (uzluksiz variatsiyalar) — kompleks tarkibini va K<sub>stab</sub> ni aniqlash. Afzalligi: rangli komplekslar uchun juda sezgir.",
                misol: "[Fe(SCN)]²⁺ — qizil rang, λ=480 nm. Fe³⁺ va SCN⁻ konsentratsiyalarini o&apos;zgartirib, K<sub>stab</sub> aniqlanadi.",
              },
              {
                usul: "3. Kalorimetrik usul",
                izoh: "Kompleks hosil bo&apos;lishidagi issiqlik effektini o&apos;lchash. Izotermik titrlash kalorimetriyasi (ITC) — to&apos;g&apos;ridan-to&apos;g&apos;ri K<sub>stab</sub> va ΔH ni bir vaqtda beradi. Eng informativ, lekin qimmat usul.",
                misol: "EDTA komplekslarining K<sub>stab</sub> va ΔH qiymatlari ITC yordamida yuqori aniqlikda aniqlangan.",
              },
              {
                usul: "4. Boshqa usullar",
                izoh: "<strong>Polyarografiya:</strong> elektrokimyoviy usul, metall ioni konsentratsiyasi o&apos;zgarishini kuzatish. <strong>Ion almashinish:</strong> ionit yordamida erkin metall ajratiladi. <strong>Eriuvchanlik:</strong> kam eruvchan tuzning eruvchanligi o&apos;zgarishi orqali.",
                misol: "Hg²⁺ komplekslari — polyarografiya bilan. Lantanoid komplekslari — ion almashinish bilan.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.usul}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
                <p className="text-purple-400 text-xs mt-1">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. AMALIY AHAMIYAT ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Barqarorlik konstantasining amaliy ahamiyati</h2>
          
          <div className="space-y-4">
            {[
              {
                soha: "Analitik kimyo",
                matn: "Kompleksonometrik titrlash (EDTA bilan) — K<sub>stab</sub> farqiga asoslangan. Metall ionlarini selektiv aniqlash. Maskirovkalash: keraksiz ionlarni barqaror kompleksga aylantirib yashirish.",
              },
              {
                soha: "Sanoat",
                matn: "Galvanik qoplamalar — kompleks barqarorligi qoplama sifatini belgilaydi. Gidrometallurgiya — oltin va kumushni sianid eritmalari bilan ajratib olish (Au(CN)₂⁻ — log β=38.3).",
              },
              {
                soha: "Tibbiyot",
                matn: "Xelat terapiya — og&apos;ir metallar bilan zaharlanganda EDTA, DMSA kabi ligandlar yordamida zaharni chiqarish. Kontrast moddalar — [Gd(DTPA)]²⁻ (MRI da ishlatiladi, K<sub>stab</sub> juda yuqori bo&apos;lishi kerak).",
              },
              {
                soha: "Ekologiya",
                matn: "Suv tozalash — og&apos;ir metall ionlarini kompleks hosil qilib cho&apos;ktirish yoki ajratish. Tuproqda metall ionlarining harakatchanligi — kompleks barqarorligi bilan belgilanadi.",
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
        <div className="bg-gradient-to-r from-purple-600/10 to-teal-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">K<sub>stab</sub></strong> — kompleks barqarorligining miqdoriy o&apos;lchovi, ΔG° = −RT ln K</li>
            <li><strong className="text-yellow-400">Bosqichli K<sub>i</sub></strong> har doim kamayib boradi: statistik, elektrostatik, sterik omillar</li>
            <li><strong className="text-yellow-400">β<sub>n</sub> = K<sub>1</sub>K<sub>2</sub>...K<sub>n</sub></strong> — umumiy konstanta, log β = Σ log K<sub>i</sub></li>
            <li><strong className="text-yellow-400">O&apos;lchash:</strong> potensiometriya (eng keng tarqalgan), spektrofotometriya, kalorimetriya</li>
            <li><strong className="text-yellow-400">Amaliyot:</strong> titrlash, gidrometallurgiya, tibbiyot (xelat terapiya), ekologiya</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/termodinamika" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Termodinamika
          </Link>
          <Link href="/ilmiy/chuqurlashgan/termodinamika/parametrlar" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold transition-all">
            Termodinamik parametrlar →
          </Link>
        </div>

      </section>
    </main>
  )
}