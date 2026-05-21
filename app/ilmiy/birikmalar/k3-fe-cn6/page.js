import Link from "next/link"

export default function K3FeCN6() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/birikmalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Birikmalar bazasi</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">K₃[Fe(CN)₆]</h1>
          <p className="text-purple-400 text-sm">kaliy geksasiyanoferrat(III) • "Qizil qon tuzi"</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOTLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-purple-400 text-xs mb-1">IUPAC nomi</div>
              <div className="text-white font-bold">kaliy geksasiyanoferrat(III)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🏷️</div>
              <div className="text-purple-400 text-xs mb-1">Tarixiy nomi</div>
              <div className="text-red-400 font-bold">Qizil qon tuzi</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-purple-400 text-xs mb-1">Molekulyar massa</div>
              <div className="text-white font-bold">329.24 g/mol</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Rangi", "Qizil kristall"],
              ["Holati", "Qattiq modda"],
              ["CAS raqami", "13746-66-2"],
              ["Zichlik", "1.89 g/cm³"],
              ["Eruvchanlik (suv)", "330 g/L (20°C)"],
              ["Eruvchanlik (etanol)", "Erimaydi"],
              ["Sistema", "Monoklinik"],
              ["Fazoviy guruh", "P2₁/c"],
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/20 rounded-xl p-3 text-center">
                <div className="text-purple-400 text-xs">{r[0]}</div>
                <div className="text-white font-semibold text-sm">{r[1]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. TUZILISHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Tuzilishi va geometriyasi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Kompleks tarkibi</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Tashqi sfera:</strong> 3K⁺</li>
                <li>• <strong>Ichki sfera:</strong> [Fe(CN)₆]³⁻</li>
                <li>• <strong>Markaziy atom:</strong> Fe³⁺ (d⁵)</li>
                <li>• <strong>Ligandlar:</strong> 6 ta CN⁻ (siyano)</li>
                <li>• <strong>Koordinatsion son:</strong> 6</li>
                <li>• <strong>Geometriya:</strong> Oktaedrik</li>
                <li>• <strong>Gibridlanish:</strong> d²sp³ (kuchli maydon)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Kristall panjara</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Sistema:</strong> Monoklinik</li>
                <li>• <strong>Fazoviy guruh:</strong> P2₁/c</li>
                <li>• <strong>a =</strong> 7.07 Å</li>
                <li>• <strong>b =</strong> 10.38 Å</li>
                <li>• <strong>c =</strong> 13.44 Å</li>
                <li>• <strong>β =</strong> 100.6°</li>
                <li>• <strong>Fe-C masofa:</strong> ~1.93 Å</li>
                <li>• <strong>C≡N masofa:</strong> ~1.16 Å</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. KRISTALL MAYDON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Kristall maydon nazariyasi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Elektron konfiguratsiya</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Fe³⁺:</strong> d⁵</li>
                <li>• <strong>CN⁻:</strong> kuchli maydonli ligand</li>
                <li>• <strong>Δo &gt; P:</strong> quyi spinli</li>
                <li>• <strong>Konfiguratsiya:</strong> t₂g⁵ eg⁰</li>
                <li>• <strong>Toq elektronlar:</strong> 1 ta</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">KMBE hisoblash</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• t₂g: 5 × (−0.4Δo) = −2.0Δo</li>
                <li>• eg: 0 × (+0.6Δo) = 0</li>
                <li>• <strong>KMBE = −2.0Δo</strong></li>
                <li>• Juftlashish energiyasi: 2P</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. MAGNIT XOSSALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧲 Magnit xossalari</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-purple-400 text-sm mb-1">Toq elektronlar</div>
                <div className="text-3xl font-extrabold text-yellow-400">1 ta</div>
                <div className="text-purple-300 text-xs">t₂g⁵ eg⁰</div>
              </div>
              <div>
                <div className="text-purple-400 text-sm mb-1">μeff (nazariy)</div>
                <div className="text-3xl font-extrabold text-yellow-400">1.73 μB</div>
                <div className="text-purple-300 text-xs">μ = √1(1+2)</div>
              </div>
              <div>
                <div className="text-purple-400 text-sm mb-1">μeff (tajriba)</div>
                <div className="text-3xl font-extrabold text-yellow-400">2.20 μB</div>
                <div className="text-purple-300 text-xs">spin-orbit hisobiga</div>
              </div>
            </div>
            <p className="text-purple-300 text-sm mt-4 text-center">
              <strong>Paramagnit</strong> — 1 ta toq elektron mavjud. Spin-orbit bog'lanish tufayli tajriba qiymati nazariydan biroz katta.
            </p>
          </div>
        </div>

        {/* 5. ELEKTRON SPEKTRI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎨 Elektron spektri va rangi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">UB-Vis spektri</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Yutilish maksimumi:</strong> 420 nm</li>
                <li>• <strong>ε qiymati:</strong> ~1000 L·mol⁻¹·cm⁻¹</li>
                <li>• <strong>O'tish turi:</strong> LMCT (Fe-CN)</li>
                <li>• <strong>Rangi:</strong> Qizil (yashil-ko'k nurni yutadi)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">IQ spektri</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>C≡N valent:</strong> 2118 cm⁻¹</li>
                <li>• <strong>Fe-C valent:</strong> 510 cm⁻¹</li>
                <li>• <strong>Fe-C≡N deformatsion:</strong> 416 cm⁻¹</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 6. KIMYOVIY XOSSALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚗️ Kimyoviy xossalari</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Berlin ko'ki hosil bo'lishi</h3>
              <p className="text-purple-200 text-sm mb-2">
                Fe²⁺ ionlari bilan to'q ko'k cho'kma — Turnbul ko'ki hosil qiladi:
              </p>
              <p className="font-mono text-yellow-400 text-sm">
                3Fe²⁺ + 2[Fe(CN)₆]³⁻ → Fe₃[Fe(CN)₆]₂↓
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qaytarilish reaksiyasi</h3>
              <p className="text-purple-200 text-sm mb-2">
                [Fe(CN)₆]³⁻ + e⁻ → [Fe(CN)₆]⁴⁻ (E° = +0.36 V)
              </p>
              <p className="text-purple-300 text-sm">
                Qizil qon tuzi qaytarilganda sariq qon tuzi (K₄[Fe(CN)₆]) hosil bo'ladi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Barqarorligi</h3>
              <p className="text-purple-200 text-sm">
                Kstab ≈ 10⁴² — juda barqaror. Kislotalarda ham ichki sfera buzilmaydi. 
                Yorug'lik ta'sirida sekin parchalanadi (qorong'i joyda saqlash kerak).
              </p>
            </div>
          </div>
        </div>

        {/* 7. AMALIY AHAMIYATI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌍 Amaliy ahamiyati</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "🔬 Analitik kimyo", desc: "Fe²⁺ ionlarini sifat aniqlashda (Turnbul ko'ki)." },
              { title: "🎨 Pigment", desc: "Bo'yoqlar va siyoh ishlab chiqarishda." },
              { title: "📷 Fotografiya", desc: "Qadimgi fotografiya usullarida (siyanotipiya)." },
              { title: "💎 Kristallografiya", desc: "Model birikma sifatida ilmiy tadqiqotlarda." }
            ].map((a, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{a.title}</h3>
                <p className="text-purple-200 text-sm">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 8. XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>K₃[Fe(CN)₆] — <strong className="text-yellow-400">qizil qon tuzi</strong>, Fe³⁺ oktaedrik kompleks</li>
            <li>CN⁻ — <strong>kuchli maydonli ligand</strong>, quyi spinli (t₂g⁵)</li>
            <li><strong>1 ta toq elektron</strong> — paramagnit, μeff ≈ 2.20 μB</li>
            <li>Fe²⁺ bilan <strong>Turnbul ko'ki</strong> (to'q ko'k cho'kma) hosil qiladi</li>
          </ol>
        </div>

      </section>
    </main>
  )
}