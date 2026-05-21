import Link from "next/link"

export default function BoshqaMisollar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/yan-teller" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Yan-Teller
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🔬 Boshqa Yan-Teller ionlari</h1>
          <p className="text-purple-400 text-sm">d⁴ (Cr²⁺, Mn³⁺) • d⁷ (Co²⁺) • d⁹ (Ag²⁺) • Dinamik Yan-Teller effekti</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Cu²⁺ dan tashqari Yan-Teller ionlari</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Yan-Teller effekti faqat Cu²⁺ da emas — <strong className="text-yellow-400">eg orbitallarda elektronlar notekis taqsimlangan 
              barcha konfiguratsiyalarda</strong> kuzatiladi. Asosiy Yan-Teller ionlari: 
              <strong className="text-yellow-400"> d⁴ (yuqori spin), d⁷ (quyi spin) va d⁹</strong>.
              t₂g orbitallardagi degeneratlik ham kuchsiz Yan-Teller effektiga sabab bo&apos;ladi,
              lekin bu holatda buzilish darajasi ancha kichik (odatda 0.1-0.5 kJ/mol).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ion</th>
                <th className="py-3 px-4 text-purple-300">d-konfig</th>
                <th className="py-3 px-4 text-purple-300">Spin holati</th>
                <th className="py-3 px-4 text-purple-300">eg to&apos;lishi</th>
                <th className="py-3 px-4 text-purple-300">Effekt kuchi</th>
                <th className="py-3 px-4 text-purple-300">Barqarorlashish E</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Cr²⁺", "d⁴", "Yuqori spin (S=2)", "eg¹", "KUCHLI", "~15-25 kJ/mol"],
                  ["Mn³⁺", "d⁴", "Yuqori spin (S=2)", "eg¹", "KUCHLI", "~10-20 kJ/mol"],
                  ["Mn²⁺", "d⁵", "Yuqori spin (S=5/2)", "eg²", "YO&apos;Q", "—"],
                  ["Fe³⁺", "d⁵", "Yuqori spin (S=5/2)", "eg²", "YO&apos;Q", "—"],
                  ["Fe²⁺", "d⁶", "Yuqori spin (S=2)", "eg²", "YO&apos;Q", "—"],
                  ["Fe²⁺", "d⁶", "Quyi spin (S=0)", "eg⁰", "YO&apos;Q", "—"],
                  ["Co²⁺", "d⁷", "Yuqori spin (S=3/2)", "eg²", "YO&apos;Q", "—"],
                  ["Co²⁺", "d⁷", "Quyi spin (S=1/2)", "eg¹", "KUCHLI", "~8-15 kJ/mol"],
                  ["Ni²⁺", "d⁸", "—", "eg²", "YO&apos;Q", "—"],
                  ["Ni³⁺", "d⁷", "Quyi spin (S=1/2)", "eg¹", "KUCHLI", "~10-18 kJ/mol"],
                  ["Cu²⁺", "d⁹", "—", "eg³", "KUCHLI", "~10-20 kJ/mol"],
                  ["Ag²⁺", "d⁹", "—", "eg³", "KUCHLI", "~15-30 kJ/mol"],
                  ["Zn²⁺", "d¹⁰", "—", "eg⁴", "YO&apos;Q", "—"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 font-bold">
                      {r[4].includes("KUCHLI") 
                        ? <span className="text-orange-400">{r[4]}</span> 
                        : <span className="text-green-400">{r[4]}</span>}
                    </td>
                    <td className="py-3 px-4 text-sm text-blue-400">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mt-4">
            <p className="text-green-300 text-sm">
              <strong>Muhim qoida:</strong> Yan-Teller effekti <strong>eg orbitallarda 1 yoki 3 ta elektron</strong> bo&apos;lganda 
              (ya&apos;ni eg¹ yoki eg³) KUCHLI namoyon bo&apos;ladi. eg⁰, eg² va eg⁴ konfiguratsiyalarda 
              degeneratlik yo&apos;q — effekt kuzatilmaydi.
            </p>
          </div>
        </div>

        {/* ── 2. d⁴ IONLARI: Cr²⁺ ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🟠 d⁴ ionlari: Cr²⁺ (xrom(II))</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Cr²⁺</strong> — elektron konfiguratsiyasi [Ar] 3d⁴.
              Oktaedrik maydonda yuqori spinli holatda t₂g³ eg¹ konfiguratsiya hosil bo&apos;ladi.
              eg¹ — bitta elektron dz² yoki dx²−y² orbitalda bo&apos;lishi mumkin, bu degeneratlikka olib keladi.
              <strong className="text-yellow-400">Yan-Teller effekti tufayli Cr²⁺ ning deyarli barcha komplekslari buzilgan oktaedrik geometriyaga ega.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Elektron tuzilishi</h3>
              <p className="text-purple-200 text-sm">
                <strong>Erkin ion:</strong> [Ar] 3d⁴<br/>
                <strong>O<sub>h</sub> maydonda (YS):</strong> t₂g³ eg¹<br/>
                <strong>Spin:</strong> S = 2 (4 ta juftlanmagan e⁻)<br/>
                <strong>Asosiy term:</strong> ⁵D (erkin ion) → ⁵E<sub>g</sub> (O<sub>h</sub>)
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Yan-Teller buzilishi</h3>
              <p className="text-purple-200 text-sm">
                <strong>eg¹ → degeneratlik bor</strong><br/>
                <strong>Natija:</strong> cho&apos;zilgan yoki siqilgan oktaedr<br/>
                <strong>Simmetriya:</strong> O<sub>h</sub> → D<sub>4h</sub><br/>
                <strong>Barqarorlashish:</strong> 15-25 kJ/mol
              </p>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <h3 className="text-orange-400 font-bold mb-2">Misollar</h3>
            <div className="space-y-3 text-sm">
              {[
                { formula: "[Cr(H₂O)₆]²⁺", desc: "Och ko&apos;k rangli. Cho&apos;zilgan oktaedr. Cr-O(ekv) ≈ 2.06 Å, Cr-O(aks) ≈ 2.30 Å. Juda labil — suv almashinish tezligi yuqori.", rang: "Och ko&apos;k" },
                { formula: "[Cr(NH₃)₆]²⁺", desc: "Sariq rangli. Kuchli Yan-Teller cho&apos;zilishi. Havoda tez oksidlanib Cr³⁺ ga o&apos;tadi.", rang: "Sariq" },
                { formula: "CrF₂", desc: "Qattiq modda. Kristall panjarada Cr²⁺ atrofida 4+2 koordinatsiya (buzilgan rutil strukturasi).", rang: "Yashil-kulrang" },
              ].map((k, i) => (
                <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-400 font-bold">{k.formula}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400 border border-purple-600/30">
                      🎨 {k.rang}
                    </span>
                  </div>
                  <p className="text-purple-200">{k.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. d⁴ IONLARI: Mn³⁺ ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🟣 d⁴ ionlari: Mn³⁺ (marganes(III))</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Mn³⁺</strong> — [Ar] 3d⁴, Cr²⁺ bilan izoelektron.
              Oktaedrik maydonda yuqori spinli t₂g³ eg¹ konfiguratsiya. Cr²⁺ dan farqli ravishda 
              Mn³⁺ komplekslari ko&apos;pincha <strong>siqilgan oktaedrik</strong> geometriyaga ega.
              Sababi — Mn³⁺ da zaryad yuqoriroq (+3 vs +2), ligandlar bilan bog&apos; kuchliroq.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Cho&apos;zilgan vs Siqilgan</h3>
              <p className="text-purple-200 text-sm">
                Mn³⁺ da <strong>siqilgan oktaedr</strong> ko&apos;proq uchraydi (Cr²⁺ da cho&apos;zilgan).
                Bu — Mn³⁺ ning yuqori zaryadi va kichikroq ion radiusi bilan bog&apos;liq.
                Siqilganda 2 ta aksial bog&apos; qisqa, 4 ta ekvatorial bog&apos; uzun bo&apos;ladi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Jahn-Teller tartiblanishi</h3>
              <p className="text-purple-200 text-sm">
                Mn³⁺ oksidlarda (masalan, LaMnO₃ perovskit) Yan-Teller buzilishi 
                <strong> kooperativ tartiblanishga</strong> olib keladi. 
                Bu — kolossal magnit qarshilik (CMR) effektining sabablaridan biridir.
              </p>
            </div>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
            <h3 className="text-purple-400 font-bold mb-2">Mn³⁺ komplekslari misollari</h3>
            <div className="space-y-3 text-sm">
              {[
                { formula: "[MnF₆]³⁻", desc: "Kuchli siqilgan oktaedr. Mn-F(aks) &lt; Mn-F(ekv). Rentgen strukturaviy tahlilda aniq ko&apos;rinadi.", rang: "Qizil-binafsha" },
                { formula: "[Mn(H₂O)₆]³⁺", desc: "Beqaror — suvni oksidlaydi. Kislotali muhitda qisqa vaqt mavjud bo&apos;ladi. Cho&apos;zilgan oktaedr.", rang: "To&apos;q qizil" },
                { formula: "[Mn(acac)₃]", desc: "Mn³⁺ ning eng barqaror komplekslaridan biri. Oktaedrik geometriya Yan-Teller ta&apos;sirida buzilgan.", rang: "To&apos;q yashil" },
                { formula: "K₂[Mn(CN)₆]", desc: "Quyi spinli d⁴ (t₂g⁴ eg⁰) — Yan-Teller YO&apos;Q. Oktaedrik simmetriya saqlanadi. Kam uchraydigan holat.", rang: "Rangsiz" },
              ].map((k, i) => (
                <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-400 font-bold">{k.formula}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400 border border-purple-600/30">
                      🎨 {k.rang}
                    </span>
                  </div>
                  <p className="text-purple-200">{k.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4. d⁷ IONLARI: Co²⁺ (quyi spin) ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔵 d⁷ ionlari: Co²⁺ (kobalt(II)) quyi spin</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Co²⁺ (d⁷)</strong> — qiziqarli holat. Yuqori spinli holatda (t₂g⁵ eg²) 
              Yan-Teller effekti YO&apos;Q. Ammo <strong className="text-yellow-400">quyi spinli holatda (t₂g⁶ eg¹)</strong> eg¹ 
              degeneratlik tufayli KUCHLI Yan-Teller effekti kuzatiladi. Quyi spinli Co²⁺ faqat kuchli maydonli 
              ligandlar (CN⁻, R₃P, CO) bilan hosil bo&apos;ladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Yuqori spin (S=3/2)</h3>
              <p className="text-purple-200 text-sm">
                <strong>Konfiguratsiya:</strong> t₂g⁵ eg²<br/>
                <strong>eg to&apos;lishi:</strong> 2 ta — degeneratlik YO&apos;Q<br/>
                <strong>Yan-Teller:</strong> YO&apos;Q<br/>
                <strong>Misol:</strong> [Co(H₂O)₆]²⁺, [Co(NH₃)₆]²⁺
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Quyi spin (S=1/2)</h3>
              <p className="text-purple-200 text-sm">
                <strong>Konfiguratsiya:</strong> t₂g⁶ eg¹<br/>
                <strong>eg to&apos;lishi:</strong> 1 ta — degeneratlik BOR<br/>
                <strong>Yan-Teller:</strong> KUCHLI<br/>
                <strong>Misol:</strong> [Co(CN)₆]⁴⁻, [Co(CNR)₆]²⁺
              </p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <h3 className="text-blue-400 font-bold mb-2">Quyi spinli Co²⁺ komplekslari</h3>
            <div className="space-y-3 text-sm">
              {[
                { formula: "[Co(CN)₆]⁴⁻", desc: "Geksasianokobaltat(II). Kuchli maydon — CN⁻. Quyi spin, eg¹. Cho&apos;zilgan oktaedr. EPR da aniq Yan-Teller signali.", rang: "Och yashil" },
                { formula: "[Co(CNR)₆]²⁺", desc: "Izosianid komplekslari. Quyi spinli, Yan-Teller faol. Rentgen difraksiyasida 4+2 koordinatsiya.", rang: "Sariq" },
                { formula: "[Co(dmg)₂L₂]", desc: "Dimetilglioksim (B₁₂ modeli). Aksial ligandlarga qarab Yan-Teller buzilishi turlicha.", rang: "Qizil-jigarrang" },
              ].map((k, i) => (
                <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-400 font-bold">{k.formula}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30">
                      🎨 {k.rang}
                    </span>
                  </div>
                  <p className="text-purple-200">{k.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 5. d⁹ IONLARI: Ag²⁺ ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚪ d⁹ ionlari: Ag²⁺ (kumush(II))</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Ag²⁺</strong> — [Kr] 4d⁹ konfiguratsiya, Cu²⁺ ning og&apos;ir analogi.
              4d orbitallar 3d ga nisbatan kengroq tarqalgan, shuning uchun <strong>Yan-Teller effekti Cu²⁺ dagidan ham kuchliroq</strong>.
              Ag²⁺ kuchli oksidlovchi (E° = +1.98 V), shuning uchun komplekslari beqaror va kam o&apos;rganilgan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Cu²⁺ bilan taqqoslash</h3>
              <p className="text-purple-200 text-sm">
                <strong>4d vs 3d:</strong> Ag²⁺ da 4d orbitallar ligandlar bilan kuchliroq o&apos;zaro ta&apos;sirlashadi.<br/>
                <strong>Yan-Teller:</strong> Ag²⁺ da cho&apos;zilish farqi kattaroq (Δr ≈ 0.4-0.6 Å vs Cu²⁺ da 0.3 Å)<br/>
                <strong>Barqarorlashish:</strong> 15-30 kJ/mol
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Barqarorlashtirish usullari</h3>
              <p className="text-purple-200 text-sm">
                Ag²⁺ ni barqarorlashtirish uchun <strong>makrotsiklik ligandlar</strong> 
                (porfirinlar, ftalosianinlar) yoki <strong>piridin hosilalari</strong> ishlatiladi.
                Xelat effekti va Yan-Teller buzilishi birgalikda barqarorlikni ta&apos;minlaydi.
              </p>
            </div>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
            <h3 className="text-purple-400 font-bold mb-2">Ag²⁺ komplekslari</h3>
            <div className="space-y-3 text-sm">
              {[
                { formula: "[Ag(py)₄]²⁺ (S₂O₈²⁻ bilan)", desc: "Piridin kompleksi. Kvadrat-planar (Yan-Teller cho&apos;zilishi tufayli aksial ligandlar deyarli yo&apos;q). To&apos;q qizil eritma.", rang: "To&apos;q qizil" },
                { formula: "[Ag(porfirin)]²⁺", desc: "Porfirin halqasida Ag²⁺. 4 ta ekvatorial N-donor. Yan-Teller ta&apos;sirida aksial pozitsiyalar zaif bog&apos;langan.", rang: "Yashil-ko&apos;k" },
                { formula: "[AgF₆]²⁻ (nazariy)", desc: "Nazariy jihatdan mavjud. Kuchli Yan-Teller cho&apos;zilishi kutiladi. Eksperimental ma&apos;lumotlar cheklangan.", rang: "—" },
              ].map((k, i) => (
                <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-400 font-bold">{k.formula}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400 border border-purple-600/30">
                      🎨 {k.rang}
                    </span>
                  </div>
                  <p className="text-purple-200">{k.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 6. t₂g ORBITALLARDAGI YAN-TELLER ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🟡 t₂g orbitallarda kuchsiz Yan-Teller effekti</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">t₂g orbitallarda (dxy, dxz, dyz) degeneratlik</strong> ham Yan-Teller 
              effektiga sabab bo&apos;ladi, lekin bu holda buzilish <strong>juda kichik</strong> (0.1-0.5 kJ/mol).
              Chunki t₂g orbitallar ligandlarga to&apos;g&apos;ridan-to&apos;g&apos;ri qaragan emas — 
              ularning to&apos;lishidagi farq bog&apos; uzunliklariga kam ta&apos;sir qiladi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Konfiguratsiya</th>
                <th className="py-3 px-4 text-purple-300">t₂g to&apos;lishi</th>
                <th className="py-3 px-4 text-purple-300">Degeneratlik</th>
                <th className="py-3 px-4 text-purple-300">Yan-Teller</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹ (YS)", "t₂g¹", "Ha (dxy, dxz, dyz)", "KUCHSIZ", "Ti³⁺, V⁴⁺"],
                  ["d² (YS)", "t₂g²", "Ha", "KUCHSIZ", "V³⁺, Cr⁴⁺"],
                  ["d³", "t₂g³", "Yo&apos;q", "YO&apos;Q", "Cr³⁺, Mn⁴⁺"],
                  ["d⁴ (QS)", "t₂g⁴", "Ha", "KUCHSIZ", "Mn³⁺ (QS)"],
                  ["d⁵ (QS)", "t₂g⁵", "Ha", "KUCHSIZ", "Fe³⁺ (QS), Mn²⁺ (QS)"],
                  ["d⁶ (QS)", "t₂g⁶", "Yo&apos;q", "YO&apos;Q", "Fe²⁺ (QS), Co³⁺ (QS)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 font-bold">
                      {r[3].includes("KUCHSIZ") 
                        ? <span className="text-yellow-400">{r[3]}</span> 
                        : <span className="text-green-400">{r[3]}</span>}
                    </td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mt-4">
            <p className="text-yellow-300 text-sm">
              <strong>Amaliy ahamiyati:</strong> t₂g Yan-Teller effekti spektroskopik usullarda kuzatiladi 
              (EPR da kuchsiz anizotropiya, past haroratli UB-Vis da polosalar kengayishi), 
              lekin geometriyaga sezilarli ta&apos;sir ko&apos;rsatmaydi. Odatda &quot;kuchsiz Yan-Teller&quot; 
              deb yuritiladi va ko&apos;pincha e&apos;tiborga olinmaydi.
            </p>
          </div>
        </div>

        {/* ── 7. DINAMIK YAN-TELLER ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Dinamik Yan-Teller effekti</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Dinamik Yan-Teller effekti</strong> — yuqori haroratda kuzatiladigan hodisa.
              Bunda buzilish bir o&apos;qda doimiy emas, balki <strong>3 ta ekvivalent o&apos;q orasida tez almashinib turadi</strong>.
              O&apos;rtacha vaqt bo&apos;yicha molekula oktaedrik simmetriyaga ega bo&apos;lib ko&apos;rinadi (rentgen difraksiyasida),
              lekin spektroskopik usullar (EPR, UB-Vis) buzilish mavjudligini ko&apos;rsatadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Statik rejim</h3>
              <p className="text-purple-200 text-sm">
                <strong>Past harorat</strong> (&lt; 100 K)<br/>
                Buzilish bir o&apos;qda doimiy<br/>
                Rentgen: aniq ko&apos;rinadi<br/>
                EPR: kuchli anizotropiya
              </p>
            </div>
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-2">Dinamik rejim</h3>
              <p className="text-purple-200 text-sm">
                <strong>Xona harorati</strong> (≈ 300 K)<br/>
                Buzilish o&apos;qlar orasida tebranadi<br/>
                Rentgen: oktaedr ko&apos;rinadi<br/>
                EPR: izotrop signal
              </p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">O&apos;tish harorati</h3>
              <p className="text-purple-200 text-sm">
                Har bir kompleks uchun individual<br/>
                Cu²⁺: ~150-250 K<br/>
                Cr²⁺: ~100-180 K<br/>
                Ag²⁺: ~200-350 K
              </p>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-2">Adiabatik potensial sirt</h3>
            <p className="text-purple-200 text-sm">
              Yan-Teller buzilishining <strong>adiabatik potensial energiya sirti</strong> &quot;meksika shlyapasi&quot; 
              (Mexican hat) shaklida bo&apos;ladi. Cho&apos;zilgan va siqilgan oktaedrlar potensial chuqurliklarda 
              joylashgan. Dinamik rejimda sistema bu chuqurliklar orasida tunnel o&apos;tish yoki termik aktivlanish 
              orqali almashinadi. Ikkala chuqurlik orasidagi energiya to&apos;siq — 
              <strong>Yan-Teller barqarorlashish energiyasi</strong> ga teng.
            </p>
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-green-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">d⁴ (YS):</strong> Cr²⁺ va Mn³⁺ — eg¹ tufayli kuchli Yan-Teller. Cr²⁺ da cho&apos;zilgan, Mn³⁺ da siqilgan oktaedr ko&apos;proq.</li>
            <li><strong className="text-yellow-400">d⁷ (QS):</strong> Co²⁺ (quyi spin) — eg¹, kuchli Yan-Teller. Faqat kuchli maydonli ligandlar bilan.</li>
            <li><strong className="text-yellow-400">d⁹:</strong> Ag²⁺ — Cu²⁺ dan kuchliroq Yan-Teller (4d orbitallar). Barqaror komplekslari kam.</li>
            <li><strong className="text-yellow-400">t₂g Yan-Teller:</strong> Kuchsiz (0.1-0.5 kJ/mol). Geometriyaga ta&apos;siri kam, spektroskopik aniqlanadi.</li>
            <li><strong className="text-yellow-400">Dinamik rejim:</strong> Yuqori haroratda buzilish o&apos;qlar orasida tebranadi. Rentgen da oktaedr ko&apos;rinadi.</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/yan-teller/spektroskopik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Spektroskopik
          </Link>
          <Link href="/ilmiy/chuqurlashgan" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            Chuqurlashgan mavzular →
          </Link>
        </div>

      </section>
    </main>
  )
}