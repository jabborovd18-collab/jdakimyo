"use client"

import Link from "next/link"
import { useState, useMemo, useEffect } from "react"

// ============================================================================
// KIRISH — ILMIY ABSTRAKT
// ============================================================================
function IlmiyAbstract() {
  return (
    <div className="bg-gradient-to-br from-teal-900/40 via-purple-900/30 to-blue-900/40 border border-teal-500/40 rounded-2xl p-8">
      <div className="flex items-start gap-4">
        <div className="text-5xl">⚛️</div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-teal-400 mb-3">Mössbauer spektroskopiyasi — ilmiy asoslar</h2>
          <p className="text-purple-100 leading-relaxed text-sm">
            <strong className="text-teal-300">Mössbauer spektroskopiyasi</strong> — bu qattiq jismdagi ma&apos;lum
            izotoplarning atom yadrolari orqali <strong className="text-yellow-300">qaytishsiz (recoil-free)
            gamma-kvant rezonans yutilishi</strong> hodisasiga asoslangan noyob yadro-spektroskopik usul.
            Usul <strong className="text-teal-300">1958 yilda Rudolf L. Mössbauer</strong> tomonidan kashf etilgan
            va bu kashfiyot uchun 1961 yilda Nobel mukofoti berilgan. Kimyo va koordinatsion birikmalar sohasida
            asosan <strong className="text-teal-300">⁵⁷Fe</strong> (tabiiy izotop mo&apos;lligi 2.119%),
            <strong> ¹¹⁹Sn</strong>, <strong>¹⁵¹Eu</strong>, <strong>¹²¹Sb</strong> va <strong>¹⁹⁷Au</strong>
            izotoplari uchun qo&apos;llaniladi.
          </p>
          <p className="text-purple-200 leading-relaxed text-sm mt-3">
            Rezonans sharti Doppler effekti orqali ta&apos;minlanadi: <strong className="text-yellow-300">gamma-manba
            (odatda ⁵⁷Co matrisadagi Rh yoki Pd)</strong> nisbatan ±10&nbsp;mm/s (kimyoviy shift uchun) yoki ±100&nbsp;mm/s
            gacha (magnit sekstet uchun) tezlik bilan yurgiziladi. Manba va absorbent orasidagi <em>nisbiy tezlik</em>
            gamma-fotonning energiyasini o&apos;zgartiradi (Δ<em>E</em> = <em>E</em><sub>γ</sub>·<em>v</em>/<em>c</em>), va
            aynan rezonans sharti bajarilganda absorbentda maksimal yutilish sodir bo&apos;ladi.
          </p>
          <p className="text-purple-200 leading-relaxed text-sm mt-3">
            Mössbauer spektri uchta asosiy giperkichik (<em>hyperfine</em>) o&apos;zaro ta&apos;sirdan ma&apos;lumot beradi:
            (1) <strong className="text-teal-300">izomer siljish δ</strong> — yadro atrofidagi s-elektron
            zichligini tavsiflaydi va oksidlanish darajasi, spin holati, kovalent ulushni aniqlaydi;
            (2) <strong className="text-yellow-300">kvadrupol bo&apos;linishi ΔE<sub>Q</sub></strong> — yadroning kvadrupol
            momenti va elektr maydon gradienti (EFG) o&apos;zaro ta&apos;siri, koordinatsion simmetriyani ko&apos;rsatadi;
            (3) <strong className="text-emerald-300">magnit o&apos;ta nozik tuzilish (Zeeman sekstet, H)</strong> —
            yadroda mavjud ichki magnit maydonini o&apos;lchaydi va magnit tartib turi (ferro-, antiferro-, ferrimagnit,
            paramagnit) haqida ma&apos;lumot beradi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <div className="bg-purple-950/60 border border-teal-500/20 rounded-lg p-3 text-center">
          <p className="text-yellow-400 font-bold text-lg">14.4125 keV</p>
          <p className="text-purple-300 text-[10px] mt-1">⁵⁷Fe rezonans energiyasi<br/>(I=3/2 → I=1/2)</p>
        </div>
        <div className="bg-purple-950/60 border border-teal-500/20 rounded-lg p-3 text-center">
          <p className="text-yellow-400 font-bold text-lg">Γ<sub>nat</sub> = 0.097</p>
          <p className="text-purple-300 text-[10px] mt-1">tabiiy chiziq kengligi<br/>(mm/s, Heisenberg limiti)</p>
        </div>
        <div className="bg-purple-950/60 border border-teal-500/20 rounded-lg p-3 text-center">
          <p className="text-yellow-400 font-bold text-lg">τ = 141 ns</p>
          <p className="text-purple-300 text-[10px] mt-1">yadro qo&apos;zg&apos;algan<br/>holat yashash vaqti</p>
        </div>
        <div className="bg-purple-950/60 border border-teal-500/20 rounded-lg p-3 text-center">
          <p className="text-yellow-400 font-bold text-lg">ΔE/E ≈ 3·10⁻¹³</p>
          <p className="text-purple-300 text-[10px] mt-1">energetik aniqlik<br/>(dunyodagi eng yuqori)</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 1. FIZIK ASOS — RECOIL-FREE FRAKSIYA VA MÖSSBAUER EFFEKTI
// ============================================================================
function FizikAsos() {
  const [T, setT] = useState(80)
  const [thetaD, setThetaD] = useState(400)

  // Debye modeli bo'yicha Lamb-Mössbauer omili (soddalashtirilgan)
  // f = exp(-<x²> · k²) — past haroratda va yuqori Debye haroratida f katta
  const ER = 1.96e-3 // eV, ⁵⁷Fe uchun recoil energiya
  const kB = 8.617e-5 // eV/K
  const f_LM = useMemo(() => {
    const x = T / thetaD
    // Lamb-Mössbauer factor for Debye solid (limit T << θ_D):
    // f = exp[-6ER/(kB·θ_D) · (1/4 + (T/θ_D)² · π²/6)]
    const exponent = -6 * ER / (kB * thetaD) * (0.25 + (x * x) * Math.PI * Math.PI / 6)
    return Math.exp(exponent)
  }, [T, thetaD])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🎯</span>
        <div>
          <h3 className="text-white font-bold text-lg">Fizik asos — Mössbauer effekti va recoil-free fraksiya</h3>
          <p className="text-purple-400 text-xs">Nima uchun aynan qattiq jismda rezonans mumkin?</p>
        </div>
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">

        {/* NAZARIY MATN */}
        <div className="bg-purple-950/40 rounded-lg p-4 text-xs text-purple-200 space-y-3 leading-relaxed">
          <p>
            Erkin atom γ-kvantni chiqarganda (yoki yutganda) impuls saqlanishi qonuniga ko&apos;ra atomga
            <strong className="text-yellow-300"> otdirish energiyasi</strong> (recoil) berilishi shart:
          </p>
          <div className="bg-black/40 rounded-lg p-3 text-center border border-teal-500/20 font-mono text-teal-300">
            E<sub>R</sub> = E<sub>γ</sub>² / (2·M·c²) ≈ 1.96·10⁻³ eV  (⁵⁷Fe, E<sub>γ</sub> = 14.4 keV)
          </div>
          <p>
            Bu E<sub>R</sub> ≈ 2·10⁻³ eV — yadro chiziq kengligidan (Γ ≈ 5·10⁻⁹ eV) <strong>~4·10⁵ marta katta</strong>,
            shu sababli erkin gaz yoki suyuqlikda rezonans <strong className="text-red-300">yo&apos;q</strong> — chiqarilgan
            va yutilishi kerak bo&apos;lgan γ-kvantlar spektri bir-biriga tegmaydi. Ammo <strong className="text-teal-300">qattiq
            kristallda</strong> yadro panjaraga bog&apos;langan; agar E<sub>R</sub> &lt; ħω<sub>D</sub> bo&apos;lsa (Debye
            fononi energiyasi), otdirish energiyasi qatlam butun massasi tomonidan yutiladi va M<sub>eff</sub> → ∞
            bo&apos;lgani uchun individual yadro uchun otdirish nolga yaqin bo&apos;ladi.
          </p>
          <p>
            Bu <strong className="text-emerald-300">qaytishsiz o&apos;tish ehtimoli</strong> — Lamb–Mössbauer omili
            (recoil-free fraction) deb ataladi va Debye modelida shunday ifodalanadi:
          </p>
          <div className="bg-black/40 rounded-lg p-3 text-center border border-teal-500/20 font-mono text-teal-300 text-[11px]">
            f<sub>LM</sub> = exp[ −(6 E<sub>R</sub>/k<sub>B</sub>θ<sub>D</sub>) · (¼ + (T/θ<sub>D</sub>)² · π²/6) ]
          </div>
          <p>
            Bunda <strong>θ<sub>D</sub></strong> — Debye harorati (kristall qattiqligining o&apos;lchovi). Yumshoq
            kristallar (kichik θ<sub>D</sub>) yoki yuqori harorat f ni keskin kamaytiradi — shu bois Mössbauer
            o&apos;lchovlari odatda <strong className="text-yellow-300">80 K (suyuq azot) yoki 4.2 K (suyuq geliy)</strong>
            haroratida bajariladi.
          </p>
        </div>

        {/* INTERAKTIV LAMB-MÖSSBAUER KALKULYATORI */}
        <div className="bg-purple-950/50 rounded-lg p-4 space-y-3">
          <h5 className="text-teal-400 font-bold text-xs">🧮 Lamb–Mössbauer omili kalkulyatori</h5>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">Harorat T:</span>
                <span className="text-teal-400 font-mono">{T} K</span>
              </label>
              <input type="range" min="4" max="500" step="1" value={T}
                onChange={(e) => setT(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
              <div className="flex justify-between text-[9px] text-purple-400 mt-1">
                <span>4.2 K (LHe)</span>
                <span>77 K (LN₂)</span>
                <span>295 K</span>
              </div>
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">Debye harorati θ<sub>D</sub>:</span>
                <span className="text-teal-400 font-mono">{thetaD} K</span>
              </label>
              <input type="range" min="100" max="900" step="10" value={thetaD}
                onChange={(e) => setThetaD(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
              <div className="flex justify-between text-[9px] text-purple-400 mt-1">
                <span>Yumshoq</span>
                <span>Fe metall ≈ 470</span>
                <span>Qattiq</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className={`rounded-lg p-3 text-center ${f_LM > 0.3 ? 'bg-emerald-600/20 border border-emerald-500/50' : f_LM > 0.05 ? 'bg-yellow-600/20 border border-yellow-500/50' : 'bg-red-600/20 border border-red-500/50'}`}>
              <p className="text-purple-300 text-[10px]">f<sub>LM</sub></p>
              <p className="text-teal-300 font-mono font-bold text-lg">{f_LM.toFixed(4)}</p>
            </div>
            <div className="rounded-lg p-3 text-center bg-purple-900/50">
              <p className="text-purple-300 text-[10px]">Signal intensivligi</p>
              <p className="text-yellow-300 font-mono font-bold text-lg">{(f_LM * 100).toFixed(1)} %</p>
            </div>
            <div className="rounded-lg p-3 text-center bg-purple-900/50">
              <p className="text-purple-300 text-[10px]">O&apos;lchov holati</p>
              <p className={`font-bold text-sm ${f_LM > 0.3 ? 'text-emerald-300' : f_LM > 0.05 ? 'text-yellow-300' : 'text-red-300'}`}>
                {f_LM > 0.3 ? "A&apos;lo" : f_LM > 0.05 ? "Mumkin" : "Yaroqsiz"}
              </p>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-2 text-[11px] text-purple-200">
            <strong className="text-yellow-400">Amaliy qoida:</strong> f<sub>LM</sub> &gt; 0.1 — Mössbauer o&apos;lchov mumkin.
            Ferrositlar uchun (Fe₃O₄, hemin) θ<sub>D</sub> ≈ 350–500 K, xona haroratida ham signal bor. Kompleks
            birikmalar uchun (nafis kristallar, molekulyar tuzlar) 80 K va undan past harorat majburiy.
          </div>
        </div>

        {/* GAMMA REZONANS ILLYUSTRATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-teal-400 font-bold text-xs mb-3">📊 Emitent va absorbent — rezonans sxemasi</h5>
          <svg viewBox="0 0 500 220" className="w-full h-52">
            {/* Manba */}
            <rect x="20" y="90" width="80" height="40" fill="#7c3aed" opacity="0.4" rx="4" stroke="#a78bfa" strokeWidth="1"/>
            <text x="60" y="115" fill="#fde047" fontSize="10" textAnchor="middle" fontWeight="bold">⁵⁷Co → ⁵⁷Fe*</text>
            <text x="60" y="80" fill="#c4b5fd" fontSize="9" textAnchor="middle">Manba (T=const)</text>
            <text x="60" y="150" fill="#c4b5fd" fontSize="9" textAnchor="middle">τ½ = 270 kun</text>

            {/* Doppler tezligi */}
            <line x1="100" y1="110" x2="180" y2="110" stroke="#14b8a6" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="140" y="100" fill="#5eead5" fontSize="10" textAnchor="middle" fontWeight="bold">v = ±10 mm/s</text>
            <text x="140" y="128" fill="#a78bfa" fontSize="8" textAnchor="middle">Doppler o&apos;zgarishi</text>

            {/* Gamma kvant */}
            <path d="M 180 110 Q 210 90 240 110 T 300 110" stroke="#fbbf24" strokeWidth="2" fill="none"/>
            <text x="240" y="85" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">γ (14.4 keV)</text>

            {/* Absorbent */}
            <rect x="300" y="90" width="90" height="40" fill="#0d9488" opacity="0.4" rx="4" stroke="#5eead5" strokeWidth="1"/>
            <text x="345" y="115" fill="#fde047" fontSize="10" textAnchor="middle" fontWeight="bold">Namuna ⁵⁷Fe</text>
            <text x="345" y="80" fill="#c4b5fd" fontSize="9" textAnchor="middle">Absorbent (T~namuna)</text>
            <text x="345" y="150" fill="#c4b5fd" fontSize="9" textAnchor="middle">rezonans yutish</text>

            {/* Detektor */}
            <polygon points="400,90 460,110 400,130" fill="#334155" stroke="#94a3b8" strokeWidth="1"/>
            <text x="435" y="115" fill="#e2e8f0" fontSize="9" textAnchor="middle" fontWeight="bold">detektor</text>

            {/* Pastki chiziq — signal */}
            <line x1="20" y1="180" x2="480" y2="180" stroke="#4c1d95" strokeWidth="1"/>
            <text x="250" y="205" fill="#c4b5fd" fontSize="10" textAnchor="middle">N(v) — γ-kvantlar sanoq spektri (transmissiya rejimi)</text>

            {/* Signal shakli */}
            <path d="M 20 175 L 200 175 Q 250 175 250 195 Q 250 175 300 175 L 480 175"
                  stroke="#14b8a6" strokeWidth="1.5" fill="none"/>

            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#14b8a6"/>
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. HYPERFINE O'ZARO TA'SIRLAR — δ, ΔE_Q, MAGNIT
// ============================================================================
function HyperfineParams() {
  const [tanlangan, setTanlangan] = useState("delta")

  const parametrlar = {
    delta: {
      nomi: "Izomer siljish (δ)",
      belgi: "δ",
      birlik: "mm/s",
      formula: "δ = (2π/3) · Z · e² · [|ψ_A(0)|² − |ψ_S(0)|²] · (ΔR/R)",
      tavsif: "Yadro va s-elektron zichligining elektrostatik o'zaro ta'siri natijasi. Yadro asosiy va qo'zg'algan holatlarida turlicha o'lchamga ega bo'lgani uchun (⁵⁷Fe da ΔR/R < 0 — qo'zg'algan holat kichikroq), yadro s-orbital elektronlar bilan turlicha kuchda ta'sirlashadi. Manba va absorbentdagi |ψ(0)|² farqi rezonans energiya siljishini beradi.",
      belgilar: [
        "|ψ(0)|² — yadro joyidagi s-elektron zichligi",
        "ΔR/R — yadro radiusining nisbiy o'zgarishi (⁵⁷Fe: −1.8·10⁻³)",
        "Manba — odatda ⁵⁷Co/Rh matrisada"
      ],
      diapazon: [
        { holat: "Fe(0), d⁸ (18e⁻)", delta: "−0.2 dan −0.05 gacha", misol: "[Fe(CO)₅], Fe(CN)₄²⁻" },
        { holat: "Fe(II) LS (t₂g⁶)", delta: "0.0 dan +0.5 gacha", misol: "K₄[Fe(CN)₆], [Fe(bpy)₃]²⁺" },
        { holat: "Fe(II) HS (t₂g⁴e_g²)", delta: "+0.9 dan +1.5 gacha", misol: "FeSO₄·7H₂O, [Fe(H₂O)₆]²⁺" },
        { holat: "Fe(III) LS (t₂g⁵)", delta: "−0.15 dan +0.3 gacha", misol: "K₃[Fe(CN)₆], [Fe(CN)₅NO]²⁻" },
        { holat: "Fe(III) HS (d⁵)", delta: "+0.3 dan +0.6 gacha", misol: "Fe₂O₃, FeCl₃, [Fe(H₂O)₆]³⁺" },
        { holat: "Fe(IV), Fe(V), Fe(VI)", delta: "−0.5 dan +0.15 gacha", misol: "K₂FeO₄ (ferrat), oksoferrilat" }
      ],
      izoh: "δ ni oksidlanish darajasi va spin holati bir vaqtda belgilaydi. Oksidlanish oshsa — 3d elektronlar kamayadi — s-orbitallarga skrenling kamayadi — |ψ(0)|² oshadi — δ kamayadi (Fe(II) HS: 1.2 → Fe(III) HS: 0.4). LS holatida t₂g yaxshi to'lgan, kovalent bog'lanish kuchli, s-elektron zichligi yuqori — shu bois LS δ HS ga qaraganda past.",
      rang: "text-teal-400"
    },
    quadrupole: {
      nomi: "Kvadrupol bo'linishi (ΔE_Q)",
      belgi: "ΔE_Q",
      birlik: "mm/s",
      formula: "ΔE_Q = (1/2) · e · Q · V_zz · √(1 + η²/3)",
      tavsif: "Yadroning kvadrupol momenti Q (⁵⁷Fe uchun I=3/2 qo'zg'algan holatda Q = +0.16 barn) va yadro joyidagi elektr maydon gradienti (EFG, V_ij tenzori) o'zaro ta'siri. Sferik simmetriyada V_zz = 0, bo'linish yo'q (singlet). Simmetriya buzilganda EFG hosil bo'ladi, yadroning ±1/2 va ±3/2 subholatlari ajraladi — spektrda dublet ko'rinadi.",
      belgilar: [
        "V_zz — EFG tenzorining eng katta komponenti",
        "η = (V_xx − V_yy)/V_zz — asimmetriya parametri (0 ≤ η ≤ 1)",
        "Q — yadro kvadrupol momenti (⁵⁷Fe*: +0.16 barn)"
      ],
      diapazon: [
        { holat: "Sferik simmetrik (O_h, T_d)", delta: "0.0 − 0.3 mm/s", misol: "Fe(III) HS d⁵, Fe(II) LS d⁶" },
        { holat: "Bir oz buzilgan oktaedr", delta: "0.3 − 1.0 mm/s", misol: "Fe(III) LS, aralash ligand" },
        { holat: "Kuchli buzilgan (Jahn-Teller)", delta: "1.0 − 2.5 mm/s", misol: "Fe(II) LS buzilishi" },
        { holat: "Fe(II) HS asimmetrik", delta: "2.0 − 3.5 mm/s", misol: "FeSO₄·7H₂O, Fe(II) proteinlar" },
        { holat: "Kvadratik (square-planar)", delta: "2.0 − 4.0 mm/s", misol: "[Fe(salen)Cl], porfirinlar" }
      ],
      izoh: "EFG ikki manbadan kelib chiqadi: (1) valent hissa V_val — Fe ning noto'liq to'lgan d-orbitallari asimmetriyasi (Fe(II) HS: t₂g⁴e_g² asimmetrik → katta ΔE_Q; Fe(III) HS: d⁵ sferik → kichik ΔE_Q); (2) panjara hissa V_lat — atrofdagi ligandlar zaryadining fazoviy taqsimoti. ΔE_Q(T) haroratga bog'liq — Boltzmann bo'linishi orqali (Fe(II) HS uchun). Bu magnit anizotropiya bilan bog'liq.",
      rang: "text-yellow-400"
    },
    magnetic: {
      nomi: "Magnit o'ta nozik tuzilish (H_hf, Zeeman sekstet)",
      belgi: "H_hf",
      birlik: "Tesla (T)",
      formula: "H_hf = H_F + H_L + H_D + H_dip + H_ext",
      tavsif: "Yadro spini I ning ichki magnit maydonda energetik bo'linishi (yadro Zeeman effekti). Har bir energetik pod-daraja (m_I) uchun rezonans tezligi turlicha — spektrda 6 ta chiziqli sekstet ko'rinadi (ΔI=1, ΔmI=0,±1 tanlash qoidasi). Chiziqlar intensivligi 3:2:1:1:2:3 nisbatida (poroshok namunasi uchun).",
      belgilar: [
        "H_F — Fermi kontakt hissa (asosiy, s-elektronlarning polarizatsiyasi)",
        "H_L — orbital hissa (LS coupling)",
        "H_D — spin-dipol hissa",
        "H_dip — qo'shni ionlar dipol hissasi",
        "H_ext — tashqi qo'llanilgan maydon"
      ],
      diapazon: [
        { holat: "Paramagnit (tez relaksatsiya)", delta: "0 T (dublet/singlet)", misol: "Ko'p kompleks tuzlar" },
        { holat: "Paramagnit (sekin relaksatsiya)", delta: "40−60 T", misol: "Fe(III) HS, past T da" },
        { holat: "α-Fe metall (BCC, RT)", delta: "33.0 T", misol: "Metall temir standarti" },
        { holat: "α-Fe₂O₃ (hematit)", delta: "51.8 T (RT), 54.2 T (4K)", misol: "Antiferromagnit oksid" },
        { holat: "Fe₃O₄ (magnetit)", delta: "49 T (A) + 46 T (B)", misol: "Ferrimagnit spinel" },
        { holat: "FeF₃, FeCl₃·6H₂O", delta: "44−48 T (past T)", misol: "Antiferromagnit galogenidlar" }
      ],
      izoh: "H_hf katta bo'lishi uchun elektron spin relaksatsiyasi Larmor frekventsiyasidan sekin bo'lishi kerak (τ_e > 1/ω_L ≈ 10⁻⁸ s). Paramagnit ionlar odatda tez relaksatsiya qiladi va sekstet ko'rinmaydi. Ammo past T da (4.2 K) yoki magnit tartibli materiallar (T < T_N/T_C) da sekstet aniq. Tashqi maydon qo'llash asimmetriyani aniqlashda foydalidir.",
      rang: "text-emerald-400"
    }
  }

  const p = parametrlar[tanlangan]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🎛️</span>
        <div>
          <h3 className="text-white font-bold text-lg">Uchta giperkichik o&apos;zaro ta&apos;sir</h3>
          <p className="text-purple-400 text-xs">Mössbauer spektrini shakllantiradigan uchta asosiy parametr</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Object.entries(parametrlar).map(([key, val]) => (
          <button key={key} onClick={() => setTanlangan(key)}
            className={`px-3 py-2 rounded-lg text-left transition-all ${
              tanlangan === key
                ? "bg-teal-600/30 border-2 border-teal-400"
                : "bg-purple-900/50 border border-transparent hover:bg-purple-800/50"
            }`}>
            <div className={`font-bold text-sm ${val.rang}`}>{val.belgi}</div>
            <div className="text-purple-300 text-[10px] mt-1">{val.nomi.split("(")[0]}</div>
          </button>
        ))}
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className={`font-bold text-lg ${p.rang}`}>{p.nomi}</h4>
          <span className="text-purple-400 text-xs bg-purple-950/50 px-2 py-1 rounded">Birlik: {p.birlik}</span>
        </div>

        <div className="bg-black/40 rounded-lg p-3 text-center border border-teal-500/20 font-mono text-teal-300 text-sm">
          {p.formula}
        </div>

        <p className="text-purple-200 text-xs leading-relaxed">{p.tavsif}</p>

        <div className="bg-purple-950/50 rounded-lg p-3">
          <h5 className="text-yellow-400 font-bold text-xs mb-2">Belgilar:</h5>
          <ul className="text-purple-300 text-[11px] space-y-1 list-disc list-inside">
            {p.belgilar.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-3">
          <h5 className="text-yellow-400 font-bold text-xs mb-2">Tipik qiymatlar diapazoni:</h5>
          <div className="space-y-1">
            {p.diapazon.map((d, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 text-[11px] bg-purple-900/40 rounded p-2">
                <div className="col-span-5 text-teal-300 font-semibold">{d.holat}</div>
                <div className="col-span-3 text-emerald-400 font-mono">{d.delta}</div>
                <div className="col-span-4 text-purple-300 text-[10px]">{d.misol}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Fizik ma&apos;no:</p>
          <p className="text-purple-200 leading-relaxed">{p.izoh}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. MÖSSBAUER SPEKTR SIMULYATORI (KENGAYTIRILGAN)
// ============================================================================
function MossbauerSpectrumSimulator() {
  const [delta, setDelta] = useState(0.4)
  const [deltaQ, setDeltaQ] = useState(0.5)
  const [H, setH] = useState(0)
  const [linewidth, setLinewidth] = useState(0.3)
  const [spectrumType, setSpectrumType] = useState("transmission")
  const [preset, setPreset] = useState("custom")

  const presets = {
    custom: { name: "🎛️ Erkin", d: null },
    "fe2-hs": { name: "Fe²⁺ HS", d: { delta: 1.20, deltaQ: 3.00, H: 0, lw: 0.3 } },
    "fe2-ls": { name: "Fe²⁺ LS", d: { delta: -0.06, deltaQ: 0.0, H: 0, lw: 0.3 } },
    "fe3-hs": { name: "Fe³⁺ HS", d: { delta: 0.40, deltaQ: 0.20, H: 0, lw: 0.3 } },
    "fe3-ls": { name: "Fe³⁺ LS", d: { delta: -0.12, deltaQ: 0.38, H: 0, lw: 0.3 } },
    "alpha-fe": { name: "α-Fe metall", d: { delta: 0.00, deltaQ: 0.0, H: 33, lw: 0.28 } },
    "hematite": { name: "α-Fe₂O₃", d: { delta: 0.38, deltaQ: 0.0, H: 51.8, lw: 0.3 } },
  }

  useEffect(() => {
    if (preset !== "custom" && presets[preset].d) {
      const d = presets[preset].d
      setDelta(d.delta)
      setDeltaQ(d.deltaQ)
      setH(d.H)
      setLinewidth(d.lw)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset])

  const spectrum = useMemo(() => {
    const points = []
    const vMin = -12
    const vMax = 12
    const steps = 500

    for (let i = 0; i <= steps; i++) {
      const v = vMin + (i / steps) * (vMax - vMin)
      let absorption = 0

      // 57Fe: g_n(ground)=0.181, g_n(excited)=-0.103, mu_N=0.315245 mm/s per Tesla
      // ground state (I=1/2): splitting = g_n * mu_N * H = 0.181*0.315*H ≈ 0.057*H mm/s
      // excited state (I=3/2): splitting = |g_n|*mu_N*H ≈ 0.033*H mm/s
      const g_ground = 0.181
      const g_excited = -0.103
      const muN = 0.315245 // mm/s per Tesla

      const positions = []
      const intensities = []

      if (H > 0.1) {
        // 6 chiziq: (mI_e, mI_g) transitions with ΔmI = 0, ±1
        // Line positions (v) = delta + (mI_e * g_excited - mI_g * g_ground) * muN * H + quadrupole
        const eps = deltaQ / 4 // first-order quadrupole shift for large H
        const eg_lines = [
          { me: -3/2, mg: -1/2, I: 3 },
          { me: -1/2, mg: -1/2, I: 2 },
          { me:  1/2, mg: -1/2, I: 1 },
          { me: -1/2, mg:  1/2, I: 1 },
          { me:  1/2, mg:  1/2, I: 2 },
          { me:  3/2, mg:  1/2, I: 3 },
        ]
        eg_lines.forEach(l => {
          const pos = delta + (l.me * g_excited - l.mg * g_ground) * muN * H + (l.me === 3/2 || l.me === -3/2 ? eps : -eps)
          positions.push(pos)
          intensities.push(l.I)
        })
      } else if (deltaQ > 0.05) {
        positions.push(delta - deltaQ / 2)
        positions.push(delta + deltaQ / 2)
        intensities.push(1, 1)
      } else {
        positions.push(delta)
        intensities.push(2)
      }

      // Lorentzian
      for (let j = 0; j < positions.length; j++) {
        const x0 = positions[j]
        const amp = intensities[j]
        const halfWidth = linewidth / 2
        absorption += amp / (1 + Math.pow((v - x0) / halfWidth, 2))
      }

      const norm = H > 0.1 ? 6 : 3
      absorption = Math.min(1, absorption / norm)

      points.push({
        v,
        y: spectrumType === "absorption" ? absorption : 100 - absorption * 30
      })
    }
    return points
  }, [delta, deltaQ, H, linewidth, spectrumType])

  const maxY = spectrumType === "absorption"
    ? Math.max(...spectrum.map(p => p.y), 0.1)
    : 100

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">📊</span>
        <div>
          <h3 className="text-white font-bold text-lg">Interaktiv Mössbauer spektr simulyatori</h3>
          <p className="text-purple-400 text-xs">δ, ΔE<sub>Q</sub>, H<sub>hf</sub> parametrlarini o&apos;zgartiring va spektr shakli qanday o&apos;zgarishini kuzating</p>
        </div>
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">

        {/* PRESET TUGMALARI */}
        <div>
          <p className="text-yellow-400 text-xs font-bold mb-2">🎯 Standart namunalar (tugmani bosing):</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(presets).map(([k, v]) => (
              <button key={k} onClick={() => setPreset(k)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  preset === k
                    ? "bg-teal-500 text-white"
                    : "bg-purple-900/60 text-teal-300 hover:bg-purple-800/60 border border-teal-700/40"
                }`}>
                {v.name}
              </button>
            ))}
          </div>
        </div>

        {/* Boshqaruv */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">δ (izomer siljish):</span>
                <span className="text-teal-400 font-mono">{delta.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="-0.4" max="1.8" step="0.01" value={delta}
                onChange={(e) => { setDelta(parseFloat(e.target.value)); setPreset("custom") }}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">ΔE<sub>Q</sub>:</span>
                <span className="text-teal-400 font-mono">{deltaQ.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0" max="4" step="0.05" value={deltaQ}
                onChange={(e) => { setDeltaQ(parseFloat(e.target.value)); setPreset("custom") }}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">H<sub>hf</sub>:</span>
                <span className="text-teal-400 font-mono">{H.toFixed(1)} T</span>
              </label>
              <input type="range" min="0" max="55" step="0.5" value={H}
                onChange={(e) => { setH(parseFloat(e.target.value)); setPreset("custom") }}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">Γ (chiziq kengligi):</span>
                <span className="text-teal-400 font-mono">{linewidth.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0.15" max="0.8" step="0.01" value={linewidth}
                onChange={(e) => { setLinewidth(parseFloat(e.target.value)); setPreset("custom") }}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
          </div>
        </div>

        {/* Spektr */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-teal-400 font-bold text-xs">
              {spectrumType === "absorption" ? "Yutilish spektri A(v)" : "Transmissiya spektri T(v) — real o'lchov"}
            </h5>
            <button onClick={() => setSpectrumType(spectrumType === "absorption" ? "transmission" : "absorption")}
              className="text-xs px-3 py-1 bg-purple-800 hover:bg-purple-700 rounded transition-colors">
              {spectrumType === "absorption" ? "→ Transmissiya" : "→ Yutilish"}
            </button>
          </div>

          <svg viewBox="0 0 500 220" className="w-full h-56">
            {/* Grid */}
            {[-10, -5, 0, 5, 10].map(v => (
              <g key={v}>
                <line x1={40 + ((v + 12) / 24) * 440} y1="20" x2={40 + ((v + 12) / 24) * 440} y2="180"
                  stroke="#4c1d95" strokeWidth="0.3" strokeDasharray="2,3"/>
                <text x={40 + ((v + 12) / 24) * 440} y="195" fill="#a78bfa" fontSize="8" textAnchor="middle">{v}</text>
              </g>
            ))}
            <line x1="40" y1={spectrumType === "absorption" ? "180" : "50"} x2="480" y2={spectrumType === "absorption" ? "180" : "50"}
                  stroke="#4c1d95" strokeWidth="0.6" strokeDasharray="4,3"/>
            <line x1="40" y1="20" x2="40" y2="180" stroke="#a78bfa" strokeWidth="1"/>

            <text x="260" y="212" fill="#c4b5fd" fontSize="10" textAnchor="middle" fontWeight="bold">v (mm/s), α-Fe ga nisbatan</text>
            <text x="20" y="100" fill="#a78bfa" fontSize="9" textAnchor="middle" transform="rotate(-90, 20, 100)">
              {spectrumType === "absorption" ? "Absorbtsiya" : "Transmissiya (%)"}
            </text>

            {/* Spektr */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / spectrum.length) * 440
                const y = spectrumType === "absorption"
                  ? 180 - (p.y / maxY) * 155
                  : 50 + ((100 - p.y) / 30) * 130
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#14b8a6" strokeWidth="1.8"
            />

            {/* Markaz */}
            <line x1={40 + ((delta + 12) / 24) * 440} y1="15" x2={40 + ((delta + 12) / 24) * 440} y2="180"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="1,2" opacity="0.6"/>
            <text x={40 + ((delta + 12) / 24) * 440} y="12" fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">
              δ={delta.toFixed(2)}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className={`rounded p-2 ${deltaQ < 0.1 && H < 0.1 ? 'bg-lime-600/30 border border-lime-500/50' : 'bg-purple-900/50'}`}>
            <p className="text-purple-400">Singlet</p>
            <p className="text-teal-400 font-bold">1 chiziq</p>
            <p className="text-purple-300 text-[10px] mt-1">O<sub>h</sub>/T<sub>d</sub> simmetriya</p>
          </div>
          <div className={`rounded p-2 ${deltaQ >= 0.1 && H < 0.1 ? 'bg-lime-600/30 border border-lime-500/50' : 'bg-purple-900/50'}`}>
            <p className="text-purple-400">Dublet</p>
            <p className="text-teal-400 font-bold">2 chiziq</p>
            <p className="text-purple-300 text-[10px] mt-1">Simmetriya buzilgan</p>
          </div>
          <div className={`rounded p-2 ${H >= 0.1 ? 'bg-lime-600/30 border border-lime-500/50' : 'bg-purple-900/50'}`}>
            <p className="text-purple-400">Sekstet</p>
            <p className="text-teal-400 font-bold">6 chiziq (3:2:1:1:2:3)</p>
            <p className="text-purple-300 text-[10px] mt-1">Magnit tartib / relaks.</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Kuzatishlar va tanlash qoidalari:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>δ o&apos;ngga siljisa (musbat)</strong> → yuqori s-elektron zichligi (past oksidlanish, HS)</li>
            <li><strong>ΔE<sub>Q</sub> oshsa</strong> → past simmetriya, katta EFG (Jahn-Teller, aralash koord.)</li>
            <li><strong>H<sub>hf</sub> paydo bo&apos;lsa</strong> → magnit tartib (ferro/anti-/ferri) yoki sekin relaks.</li>
            <li><strong>Γ kichik (≈0.24 mm/s)</strong> → yuqori rezolyutsiya, monofazali kristallik namuna</li>
            <li><strong>Γ katta (&gt;0.4 mm/s)</strong> → chiziq kengayishi: amorf, ko&apos;p sayt, relaksatsiya</li>
            <li><strong>Sekstet asimmetriyasi</strong> → ε = ΔE<sub>Q</sub>/4 (birinchi tartib buzilish)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. IZOMER SILJISH KALKULYATORI (KENGAYTIRILGAN)
// ============================================================================
function IsomerShiftCalc() {
  const [selectedState, setSelectedState] = useState("fe2-hs")

  const states = {
    "fe6": { name: "Fe⁶⁺ (d²)", delta: "−0.9 dan −0.7 gacha", deltaQ: "1.5 − 2.0", config: "d²", example: "K₂FeO₄ (ferrat(VI))", rang: "from-red-500 to-red-700", tavsif: "Yuqori oksidlanish, kuchli π-donorlar bilan stabillashadi." },
    "fe4": { name: "Fe⁴⁺ (d⁴)", delta: "−0.05 dan +0.15 gacha", deltaQ: "1.0 − 3.5", config: "t₂g⁴ (LS)", example: "Ferril [Fe(IV)=O], SrFeO₃", rang: "from-orange-500 to-orange-700", tavsif: "Katalitik oraliq (Kompound I/II ferrilat)." },
    "fe3-hs": { name: "Fe³⁺ HS (S=5/2)", delta: "+0.30 dan +0.60 gacha", deltaQ: "0.0 − 0.8", config: "t₂g³ eg² (5/2)", example: "[Fe(H₂O)₆]³⁺, Fe₂O₃", rang: "from-red-400 to-orange-500", tavsif: "Sferik simmetrik d⁵ — kichik ΔE_Q." },
    "fe3-ls": { name: "Fe³⁺ LS (S=1/2)", delta: "−0.15 dan +0.30 gacha", deltaQ: "0.4 − 3.0", config: "t₂g⁵ (1/2)", example: "K₃[Fe(CN)₆], porfirin", rang: "from-blue-500 to-blue-700", tavsif: "Kuchli maydon ligandlari; t₂g⁵ asimmetrik." },
    "fe2-hs": { name: "Fe²⁺ HS (S=2)", delta: "+0.90 dan +1.50 gacha", deltaQ: "2.0 − 3.5", config: "t₂g⁴ eg² (2)", example: "FeSO₄·7H₂O, [Fe(H₂O)₆]²⁺", rang: "from-green-400 to-emerald-600", tavsif: "Klassik HS; katta ΔE_Q (t₂g asimmetrik)." },
    "fe2-ls": { name: "Fe²⁺ LS (S=0)", delta: "+0.20 dan +0.50 gacha", deltaQ: "0.0 − 1.5", config: "t₂g⁶ (0)", example: "K₄[Fe(CN)₆], [Fe(bpy)₃]²⁺", rang: "from-blue-400 to-indigo-600", tavsif: "Diamagnit; t₂g⁶ sferik." },
    "fe1": { name: "Fe¹⁺ (d⁷)", delta: "+0.15 dan +0.35 gacha", deltaQ: "1.5 − 2.5", config: "t₂g⁶ eg¹ (LS)", example: "[Fe(bpy)₃]⁺, Fe(I) porfirin", rang: "from-purple-400 to-purple-700", tavsif: "Kamdan-kam, ko'p ligandli sistemalarda." },
    "fe0": { name: "Fe⁰ (d⁸, 18e⁻)", delta: "−0.20 dan +0.05 gacha", deltaQ: "0.0 − 2.5", config: "d⁸ (yopiq qobiq)", example: "[Fe(CO)₅], [Fe(CN)₆]⁴⁻ (formal 0)", rang: "from-amber-400 to-yellow-600", tavsif: "Kuchli π-akseptor bilan; back-bonding orqali stabillashadi." },
  }

  const s = states[selectedState]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">📐</span>
        <div>
          <h3 className="text-white font-bold text-lg">Izomer siljish (δ) — oksidlanish darajasi va spin holati bo&apos;yicha</h3>
          <p className="text-purple-400 text-xs">⁵⁷Fe uchun barcha ma&apos;lum oksidlanish holatlari</p>
        </div>
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(states).map(([key, val]) => (
            <button key={key} onClick={() => setSelectedState(key)}
              className={`px-4 py-3 rounded-xl text-left transition-all ${
                selectedState === key
                  ? `bg-gradient-to-r ${val.rang} border-2 border-white/40`
                  : "bg-purple-900/50 border border-transparent hover:bg-purple-800/50"
              }`}>
              <div className="flex justify-between items-center mb-1">
                <span className={`font-bold ${selectedState === key ? 'text-white' : 'text-teal-400'}`}>{val.name}</span>
                <span className={`font-mono text-xs ${selectedState === key ? 'text-yellow-200' : 'text-emerald-400'}`}>δ = {val.delta}</span>
              </div>
              <div className={`text-xs ${selectedState === key ? 'text-white/90' : 'text-purple-300'}`}>{val.example}</div>
            </button>
          ))}
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-teal-400 font-bold text-sm mb-3">Tanlangan holat: <span className="text-white">{s.name}</span></h5>
          <p className="text-purple-200 text-xs mb-3 italic">{s.tavsif}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">δ diapazoni</p>
              <p className="text-teal-400 font-mono font-bold">{s.delta}</p>
              <p className="text-purple-500 text-[9px]">mm/s</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">ΔE<sub>Q</sub></p>
              <p className="text-yellow-400 font-mono font-bold">{s.deltaQ}</p>
              <p className="text-purple-500 text-[9px]">mm/s</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">Elektron konfig.</p>
              <p className="text-emerald-400 font-bold text-sm">{s.config}</p>
            </div>
            <div className="bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">Namuna</p>
              <p className="text-purple-200 text-sm font-semibold">{s.example}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 text-xs space-y-2">
          <p className="text-yellow-400 font-bold">🔬 δ nima uchun o&apos;zgaradi? — Fizik-kimyoviy mantiq:</p>
          <p className="text-purple-200 leading-relaxed">
            <strong>Izomer siljish</strong> δ ∝ [|ψ<sub>abs</sub>(0)|² − |ψ<sub>manba</sub>(0)|²] · ΔR/R.
            ⁵⁷Fe uchun ΔR/R &lt; 0 (qo&apos;zg&apos;algan yadro kichikroq), demak <strong className="text-teal-300">yuqori s-elektron
            zichligi → past δ</strong>. Bu quyidagi omillar bilan boshqariladi:
          </p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside ml-2">
            <li><strong>Oksidlanish oshsa:</strong> Fe²⁺ → Fe³⁺ → Fe⁴⁺ — 3d elektronlar kamayadi — 3d ning
                4s ni ekranlashi kamayadi — |ψ(0)|² oshadi — <strong className="text-yellow-300">δ kamayadi</strong>.</li>
            <li><strong>Spin holati:</strong> HS → LS — t₂g yaxshi to&apos;ladi, kovalent orbital ulushi (M–L σ, π)
                oshadi — |ψ(0)|² oshadi — <strong className="text-yellow-300">δ kamayadi</strong>.</li>
            <li><strong>π-akseptor ligandlar</strong> (CN⁻, CO, NO⁺): kuchli back-bonding — orbital aralashish —
                <strong className="text-yellow-300">δ juda past</strong> (masalan, [Fe(CN)₆]⁴⁻ da δ = −0.06).</li>
            <li><strong>Koordinatsion son:</strong> CN kamaysa (6 → 5 → 4), M–L bog&apos; qisqaradi, kovalentlik oshadi,
                δ kamayadi (Fe(II) 4-koord. &lt; 6-koord.).</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. TAJRIBA VA APPARATURA
// ============================================================================
function TajribaJihoz() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🔬</span>
        <div>
          <h3 className="text-white font-bold text-lg">Tajriba usullari va apparatura</h3>
          <p className="text-purple-400 text-xs">Mössbauer o&apos;lchovni qanday amalga oshiriladi?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transmissiya */}
        <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-500/30">
          <h4 className="text-teal-400 font-bold mb-2 flex items-center gap-2">
            <span className="text-2xl">📈</span> Transmissiya rejimi (asosiy)
          </h4>
          <p className="text-purple-200 text-xs leading-relaxed mb-3">
            Manba (⁵⁷Co/Rh yoki Pd, ~10–100 mCi) elektromagnit vibratorda ±10&nbsp;mm/s tezlik bilan yurgiziladi.
            γ-fotonlar namuna (5–100 mg Fe/cm²) orqali o&apos;tadi va proporsional gaz (Kr–CH₄, Xe) yoki NaI(Tl)
            detektor 14.4 keV chiziqda sanaydi.
          </p>
          <div className="bg-black/40 rounded p-2 text-[10px] text-teal-300 font-mono">
            Manba — vibrator — namuna — kollimator — detektor — MCA
          </div>
        </div>

        {/* Konversiya */}
        <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-500/30">
          <h4 className="text-teal-400 font-bold mb-2 flex items-center gap-2">
            <span className="text-2xl">🎯</span> CEMS (Conversion Electron)
          </h4>
          <p className="text-purple-200 text-xs leading-relaxed mb-3">
            <strong>Konversiya elektronlari Mössbauer spektroskopiyasi</strong> — sirt uchun (0–300 nm chuqurlik).
            Rezonans yutildan keyingi ichki konversiya elektronlarini gaz (He–CH₄) detektor bilan qayd etadi.
            <strong className="text-yellow-300"> Faqat sirt qatlami</strong> o&apos;rganiladi — plyonkalar, korroziya, katalizatorlar uchun.
          </p>
          <div className="bg-black/40 rounded p-2 text-[10px] text-teal-300 font-mono">
            γ_manba → namuna → ichki konversiya e⁻ → gaz detektor
          </div>
        </div>

        {/* Emissiya */}
        <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-500/30">
          <h4 className="text-teal-400 font-bold mb-2 flex items-center gap-2">
            <span className="text-2xl">💥</span> Emissiya (source) rejimi
          </h4>
          <p className="text-purple-200 text-xs leading-relaxed mb-3">
            Namuna <strong>manba sifatida</strong> ishlatiladi (⁵⁷Co ni namuna ichiga dopanladi).
            Absorbent — standart K₄[Fe(CN)₆]. Kobalt kimyoviy holatida bo&apos;lgan lokal muhitni o&apos;rganish uchun.
            Diffuziya, defektlar, katalitik saytlar.
          </p>
        </div>

        {/* Sinxrotron */}
        <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-500/30">
          <h4 className="text-teal-400 font-bold mb-2 flex items-center gap-2">
            <span className="text-2xl">⚡</span> SMS / NRIXS (Sinxrotron)
          </h4>
          <p className="text-purple-200 text-xs leading-relaxed mb-3">
            <strong>Synchrotron Mössbauer Spectroscopy</strong> — puls sinxrotron nurlanishidan foydalanadi.
            Vaqt bo&apos;yicha ajratilgan spektroskopiya (nuclear forward scattering), yuqori bosim
            (olmos hujra 100+ GPa), mikro-uchastka, biopolymerlar. NRIXS — fononlar aniq DOS ni beradi.
          </p>
        </div>
      </div>

      {/* Namuna tayyorlash */}
      <div className="bg-purple-950/40 border border-teal-500/30 rounded-xl p-5">
        <h4 className="text-teal-400 font-bold mb-3 flex items-center gap-2">
          <span className="text-2xl">🧪</span> Namuna tayyorlash — muhim texnik detallar
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-purple-200">
          <div className="bg-purple-900/40 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">Optimal Fe konsentratsiyasi:</p>
            <p>t = μ·d ≈ 3–5 (rezonans qalinligi). ⁵⁷Fe uchun ~5–15&nbsp;mg⁵⁷Fe/cm² yoki ~30&nbsp;mg tabiiy Fe/cm² (⁵⁷Fe boyitilmagan bo&apos;lsa).</p>
          </div>
          <div className="bg-purple-900/40 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">Zichlashtirish:</p>
            <p>Poroshok BN yoki Al foil orasiga bosiladi (25–40 mm diametrli plyonka). Anizotropiyani kamaytirish uchun bir necha yo&apos;nalishdan o&apos;lchash mumkin.</p>
          </div>
          <div className="bg-purple-900/40 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">Kriostat va termostat:</p>
            <p>Suyuq N₂ (77 K), suyuq He (4.2 K), MPMS (2 K + 9 T), soched flow. SCO uchun 5–400 K.</p>
          </div>
          <div className="bg-purple-900/40 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">Kalibrlash:</p>
            <p>α-Fe folga (25 µm) — sekstet chiziqlari 33.0 T da. δ ning boshi (0 mm/s) = α-Fe markazi. Standart NBS #1541.</p>
          </div>
          <div className="bg-purple-900/40 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">Ma&apos;lumot yig&apos;ish vaqti:</p>
            <p>Xona T da 4–24 soat (odatiy); past T da 12–72 soat; katalizator monolayer uchun 3–7 kun. MCA — 512 yoki 1024 kanal.</p>
          </div>
          <div className="bg-purple-900/40 rounded-lg p-3">
            <p className="text-yellow-400 font-bold mb-1">Ma&apos;lumot qayta ishlash:</p>
            <p>WinNormos, Mosswinn, Recoil, MossA — Lorentzian yoki Voigt profil bilan chiziqli en-kompleksli fit. χ² &lt; 1.2 — yaxshi fit.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. HARORAT VA SPIN CROSSOVER
// ============================================================================
function TemperatureSCO() {
  const [T, setT] = useState(300)
  const [T12, setT12] = useState(175)
  const [slope, setSlope] = useState(0.15)

  const gammaHS = 1 / (1 + Math.exp(-slope * (T - T12)))
  const gammaLS = 1 - gammaHS
  const deltaAvg = gammaHS * 1.05 + gammaLS * 0.42
  const deltaQAvg = gammaHS * 2.95 + gammaLS * 0.30

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🌡️</span>
        <div>
          <h3 className="text-white font-bold text-lg">Spin Crossover (SCO) va temperaturaga bog&apos;liqlik</h3>
          <p className="text-purple-400 text-xs">Fe(II) d⁶ komplekslarida HS ↔ LS termik o&apos;tish</p>
        </div>
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">

        <div className="bg-purple-950/40 rounded-lg p-4 text-xs text-purple-200 leading-relaxed space-y-2">
          <p>
            <strong className="text-teal-300">Spin Crossover</strong> — 3d⁴–3d⁷ (asosan Fe(II) d⁶ va Fe(III) d⁵)
            komplekslarida <strong className="text-yellow-300">Δ<sub>o</sub> ≈ P</strong> (Pairing energiyasi)
            shartida yuz beradigan holat. HS holat entropiyaviy afzal (ko&apos;p mikroholatlar), LS enthalpiyaviy
            afzal (past energiya). O&apos;tish harorati T<sub>1/2</sub> = ΔH/ΔS.
          </p>
          <p>
            Mössbauer SCO ni <strong>bir vaqtning o&apos;zida</strong> ikkala fazani (LS dubleti va HS dubleti)
            ko&apos;radi va ularning nisbatini <strong>chiziq maydoni</strong> orqali aniqlaydi
            (γ<sub>HS</sub> + γ<sub>LS</sub> = 1). Kuchli kooperativ tizimlarda o&apos;tish keskin (hysteresis),
            kuchsiz kooperativlik — bosqichma-bosqich.
          </p>
          <div className="bg-black/40 rounded p-2 text-teal-300 font-mono text-[11px] text-center">
            γ<sub>HS</sub>(T) = 1 / [1 + exp(ΔG(T)/RT)],  ΔG = ΔH − TΔS
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">T (harorat):</span>
              <span className="text-teal-400 font-mono">{T} K</span>
            </label>
            <input type="range" min="50" max="450" step="1" value={T}
              onChange={(e) => setT(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">T<sub>1/2</sub>:</span>
              <span className="text-teal-400 font-mono">{T12} K</span>
            </label>
            <input type="range" min="80" max="350" step="1" value={T12}
              onChange={(e) => setT12(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Kooperativlik:</span>
              <span className="text-teal-400 font-mono">{slope.toFixed(2)}</span>
            </label>
            <input type="range" min="0.02" max="0.5" step="0.01" value={slope}
              onChange={(e) => setSlope(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
          </div>
        </div>

        {/* γ_HS grafigi */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-teal-400 font-bold text-xs mb-2">HS ulushi γ<sub>HS</sub>(T) egri chizig&apos;i</h5>
          <svg viewBox="0 0 400 200" className="w-full h-40">
            <line x1="40" y1="180" x2="380" y2="180" stroke="#a78bfa" strokeWidth="1"/>
            <line x1="40" y1="20" x2="40" y2="180" stroke="#a78bfa" strokeWidth="1"/>
            <text x="210" y="197" fill="#c4b5fd" fontSize="9" textAnchor="middle">T (K), 50 → 450</text>
            <text x="20" y="100" fill="#a78bfa" fontSize="9" textAnchor="middle" transform="rotate(-90, 20, 100)">γ_HS</text>
            <text x="35" y="25" fill="#a78bfa" fontSize="8" textAnchor="end">1</text>
            <text x="35" y="180" fill="#a78bfa" fontSize="8" textAnchor="end">0</text>

            {/* Egri */}
            <polyline
              points={Array.from({length: 100}, (_, i) => {
                const t = 50 + (i / 99) * 400
                const g = 1 / (1 + Math.exp(-slope * (t - T12)))
                return `${40 + (i / 99) * 340},${180 - g * 160}`
              }).join(' ')}
              fill="none" stroke="#14b8a6" strokeWidth="2"
            />

            {/* T12 chizig'i */}
            <line x1={40 + ((T12 - 50) / 400) * 340} y1="20" x2={40 + ((T12 - 50) / 400) * 340} y2="180"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="3,3"/>
            <text x={40 + ((T12 - 50) / 400) * 340} y="15" fill="#fbbf24" fontSize="9" textAnchor="middle">T½</text>

            {/* Joriy T */}
            <line x1={40 + ((T - 50) / 400) * 340} y1="20" x2={40 + ((T - 50) / 400) * 340} y2="180"
              stroke="#ef4444" strokeWidth="1"/>
            <circle cx={40 + ((T - 50) / 400) * 340} cy={180 - gammaHS * 160} r="4" fill="#ef4444"/>
          </svg>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400">γ<sub>HS</sub></p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{(gammaHS * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400">γ<sub>LS</sub></p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{(gammaLS * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">δ<sub>o&apos;rt</sub></p>
            <p className="text-teal-400 font-bold font-mono text-lg">{deltaAvg.toFixed(2)}</p>
            <p className="text-purple-500 text-[9px]">mm/s</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">ΔE<sub>Q,o&apos;rt</sub></p>
            <p className="text-yellow-400 font-bold font-mono text-lg">{deltaQAvg.toFixed(2)}</p>
            <p className="text-purple-500 text-[9px]">mm/s</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 SCO tizimlari xilma-xilligi:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>[Fe(phen)₂(NCS)₂]:</strong> Klassik, T<sub>1/2</sub> ≈ 176 K, keskin o&apos;tish.</li>
            <li><strong>[Fe(pic)₃]Cl₂·EtOH:</strong> Gradient (bosqichma-bosqich) o&apos;tish, plateau.</li>
            <li><strong>[Fe(pyrazolylborate)₂]:</strong> Yorug&apos;lik sabab (LIESST) HS ni past T da qamash mumkin.</li>
            <li><strong>Prussian ko&apos;k analoglari (Fe–NC–Co):</strong> Bosim, foton, elektr signal ta&apos;sirida SCO.</li>
            <li><strong>Amaliyot:</strong> Xotira qurilmalari, displaylar, sensorlar, spintronika.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. AMALIY QO'LLANILISH SOHALAR
// ============================================================================
function AmaliyQoshanish() {
  const sohalar = [
    {
      icon: "🧬",
      nomi: "Biokimyo va biomimetika",
      tavsif: "Gemoglobin, mioglobin, sitokrom P450, ferredoksin, nitrogenaza faol markazlari. Fe–S klasterlar ([2Fe–2S], [4Fe–4S]). Oksigen aktivizatsiyasi (ferrilat oraliq Fe(IV)=O — Kompound I/II).",
      misollar: "P450: LS Fe(III) (δ≈0.4, ΔE_Q≈2.2) → Kompound I (δ≈0.11, ΔE_Q≈1.05, Fe(IV)); Nitrogenaza FeMo-ko: aralash valentli klaster.",
      rang: "border-emerald-500/40"
    },
    {
      icon: "🌍",
      nomi: "Mineralogiya va geoxlmiya",
      tavsif: "Fe-tarkibli minerallar identifikatsiyasi va fazoviy nisbatlarni aniqlash: hematit (α-Fe₂O₃), magnetit (Fe₃O₄), gyot (α-FeOOH), lepidokrokit, siderit. Klay minerallari (nontronit, kloritlar), sil-mineral almashinuvi.",
      misollar: "Mars — <em>Spirit</em> va <em>Opportunity</em> roverlarida ⁵⁷Fe MIMOS-II mini-Mössbauer bilan Fe(II)/Fe(III) nisbati o&apos;lchandi. Yakabor va gyotit topilganidan suv izlari tasdiqlandi.",
      rang: "border-orange-500/40"
    },
    {
      icon: "🧲",
      nomi: "Magnit va spintronik materiallar",
      tavsif: "Ferrit va spinellar (MgFe₂O₄, ZnFe₂O₄, CoFe₂O₄), nanoferritlar, ekzo/ekzo magnitlar, giant magnetoresistiv (GMR) plyonkalar, molekulyar magnitlar (SMM). H_hf orqali magnit tartib turini aniqlash.",
      misollar: "Fe₃O₄ nanozarrachalari: RT da sekstet kengayadi (superparamagnitizm), 4.2 K da barqaror sekstet. Kritik hajm ~20 nm.",
      rang: "border-purple-500/40"
    },
    {
      icon: "⚗️",
      nomi: "Kataliz",
      tavsif: "Fe-Fischer–Tropsch katalizatorlari (Fe-karbidlar: χ-Fe₅C₂, ε-Fe₂C, θ-Fe₃C), N₂ fiksatsiya katalizatorlari, biomimet Fe-porfirin katalizatorlar, SBA-15/MCM-41 da Fe klasterlar.",
      misollar: "Hummer–Fisher: karbidlanish davomida Fe₃O₄ → Fe-karbidlar o&apos;tishi Mössbauer bilan operando kuzatiladi. Fe(III) yuqori spin ↔ karbid ferromagnitik ↔ metallik.",
      rang: "border-red-500/40"
    },
    {
      icon: "🎨",
      nomi: "San&apos;at va arxeometriya",
      tavsif: "Qadimgi keramika pigmentlari (kub, ohra, umbra), ko&apos;k pigmentlar (Prussian ko&apos;k, ultra-marin), rangli oyna. Yong&apos;in va oksidlanish sharoitlarini rekonstruksiya qilish (Fe(II)/Fe(III) nisbati).",
      misollar: "Attika qora-qizil vaza texnikasi: Fe(II)/Fe(III) nisbatlari yong&apos;in atmosferini (reduktiv/oksidlovchi) aks ettiradi. Prussian ko&apos;k Fe⁴[Fe(CN)₆]₃ da ikki farqli Fe sayti.",
      rang: "border-yellow-500/40"
    },
    {
      icon: "🔋",
      nomi: "Batareyalar va energiya",
      tavsif: "LiFePO₄ (olivin), Li-Fe-P-O katod materiallari, Fe-Ni Edison batareyalari, Fe-havo qayta zaryadlanuvchi, superkapasitorlarda Fe-oksid elektrodlar. Zaryad/razryad davomida Fe²⁺ ↔ Fe³⁺ operando.",
      misollar: "LiFePO₄ (δ=1.22, ΔE_Q=2.96) ↔ FePO₄ (δ=0.42, ΔE_Q=1.53). Operando o&apos;lchov davomida ikki fazo o&apos;rtasidagi nisbat SOC (state of charge) bilan chiziqli.",
      rang: "border-blue-500/40"
    },
    {
      icon: "☢️",
      nomi: "Yadro fizikasi va fundamental sinovlar",
      tavsif: "Umumiy nisbiylik nazariyasi sinovlari (Pound–Rebka tajribasi, 1959–60): γ-fotonning gravitatsion qizilga siljishi. Kuchsiz o&apos;zaro ta&apos;sir P-invariance sinovi. Neytron elektrik dipol momenti (nEDM).",
      misollar: "Pound–Rebka: 22.5 m minora, 14.4 keV ⁵⁷Fe, kutilgan ΔE/E = 2.5·10⁻¹⁵ o&apos;lchandi va Einshteynning bashoratini 10% aniqlik bilan tasdiqladi.",
      rang: "border-teal-500/40"
    },
    {
      icon: "💊",
      nomi: "Farmatsevtika va nanotibbiyot",
      tavsif: "Temir preparatlari (ferrous sulfat, temir(III) dekstran, karboksimaltoza), MRI kontrast agentlari (ultrasmall SPIONs), gipertermiya nanozarrachalar, temir-tarkibli terapevtik komplekslar.",
      misollar: "Feralal (ferric carboxymaltose) — Fe(III) polinuklear klaster, δ≈0.47, ΔE_Q≈0.6, ferritinga o&apos;xshash. SPION: 4–20 nm Fe₃O₄ superparamagnit, sekstet keng.",
      rang: "border-pink-500/40"
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🌐</span>
        <div>
          <h3 className="text-white font-bold text-lg">Amaliy sohalar — Mössbauer nima uchun juda muhim?</h3>
          <p className="text-purple-400 text-xs">Fundamental fizikadan Mars minerallarigacha</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sohalar.map((s, i) => (
          <div key={i} className={`bg-purple-800/30 rounded-xl p-4 border ${s.rang} hover:bg-purple-800/50 transition-all`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{s.icon}</span>
              <h4 className="text-teal-400 font-bold text-sm">{s.nomi}</h4>
            </div>
            <p className="text-purple-200 text-xs leading-relaxed mb-2">{s.tavsif}</p>
            <div className="bg-purple-950/50 rounded p-2 text-[11px] text-purple-300 border-l-2 border-yellow-500/50">
              <span className="text-yellow-400 font-bold">📌 Misol: </span>
              <span dangerouslySetInnerHTML={{__html: s.misollar}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 8. SPEKTRLAR TIPI VA TALQINI
// ============================================================================
function SpektrTiplari() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🔍</span>
        <div>
          <h3 className="text-white font-bold text-lg">Spektr shakllari — vizual talqin qo&apos;llanma</h3>
          <p className="text-purple-400 text-xs">Har bir spektr shakli qanday holat haqida ma&apos;lumot beradi?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Singlet */}
        <div className="bg-purple-800/30 rounded-xl p-4 border border-teal-500/40">
          <h4 className="text-teal-400 font-bold text-sm mb-2">1️⃣ Singlet — bitta chiziq</h4>
          <svg viewBox="0 0 200 100" className="w-full h-24 bg-purple-950/50 rounded">
            <line x1="10" y1="80" x2="190" y2="80" stroke="#4c1d95" strokeWidth="0.5" strokeDasharray="2,2"/>
            <path d="M 10 80 L 90 80 Q 100 80 100 30 Q 100 80 110 80 L 190 80" stroke="#14b8a6" strokeWidth="1.5" fill="none"/>
          </svg>
          <p className="text-purple-200 text-xs mt-2">
            <strong>Sharoit:</strong> To&apos;liq sferik simmetriya (O<sub>h</sub>, T<sub>d</sub>) yoki sferik d-konfiguratsiya (d⁵ HS, d⁶ LS, d¹⁰).
          </p>
          <p className="text-yellow-400 text-[11px] mt-1"><strong>Misollar:</strong> K₄[Fe(CN)₆], [Fe(CO)₅], γ-Fe (fcc)</p>
        </div>

        {/* Dublet */}
        <div className="bg-purple-800/30 rounded-xl p-4 border border-teal-500/40">
          <h4 className="text-teal-400 font-bold text-sm mb-2">2️⃣ Dublet — ikkita chiziq</h4>
          <svg viewBox="0 0 200 100" className="w-full h-24 bg-purple-950/50 rounded">
            <line x1="10" y1="80" x2="190" y2="80" stroke="#4c1d95" strokeWidth="0.5" strokeDasharray="2,2"/>
            <path d="M 10 80 L 70 80 Q 80 80 80 35 Q 80 80 95 80 L 105 80 Q 120 80 120 35 Q 120 80 130 80 L 190 80" stroke="#14b8a6" strokeWidth="1.5" fill="none"/>
            <line x1="80" y1="88" x2="120" y2="88" stroke="#fbbf24" strokeWidth="0.5"/>
            <text x="100" y="97" fill="#fbbf24" fontSize="7" textAnchor="middle">ΔE_Q</text>
          </svg>
          <p className="text-purple-200 text-xs mt-2">
            <strong>Sharoit:</strong> EFG ≠ 0 (koordinatsion asimmetriya, Jahn-Teller, d-orbital asimmetriyasi).
          </p>
          <p className="text-yellow-400 text-[11px] mt-1"><strong>Misollar:</strong> K₃[Fe(CN)₆], [Fe(H₂O)₆]²⁺, FeSO₄</p>
        </div>

        {/* Sekstet */}
        <div className="bg-purple-800/30 rounded-xl p-4 border border-teal-500/40">
          <h4 className="text-teal-400 font-bold text-sm mb-2">3️⃣ Sekstet — 6 chiziq (3:2:1:1:2:3)</h4>
          <svg viewBox="0 0 200 100" className="w-full h-24 bg-purple-950/50 rounded">
            <line x1="10" y1="80" x2="190" y2="80" stroke="#4c1d95" strokeWidth="0.5" strokeDasharray="2,2"/>
            {[
              { x: 30, h: 45, w: 6 },
              { x: 60, h: 30, w: 6 },
              { x: 88, h: 15, w: 6 },
              { x: 112, h: 15, w: 6 },
              { x: 140, h: 30, w: 6 },
              { x: 170, h: 45, w: 6 },
            ].map((p, i) => (
              <path key={i} d={`M ${p.x - p.w} 80 Q ${p.x} 80 ${p.x} ${80 - p.h} Q ${p.x} 80 ${p.x + p.w} 80`}
                    stroke="#14b8a6" strokeWidth="1.5" fill="none"/>
            ))}
          </svg>
          <p className="text-purple-200 text-xs mt-2">
            <strong>Sharoit:</strong> Ichki magnit maydon (magnit tartibli material yoki sekin relaksatsiyali paramagnit).
          </p>
          <p className="text-yellow-400 text-[11px] mt-1"><strong>Misollar:</strong> α-Fe, Fe₂O₃, Fe₃O₄, YIG</p>
        </div>

        {/* Aralash */}
        <div className="bg-purple-800/30 rounded-xl p-4 border border-yellow-500/40">
          <h4 className="text-yellow-400 font-bold text-sm mb-2">4️⃣ Ikki dublet — ikki sayt</h4>
          <svg viewBox="0 0 200 100" className="w-full h-24 bg-purple-950/50 rounded">
            <line x1="10" y1="80" x2="190" y2="80" stroke="#4c1d95" strokeWidth="0.5" strokeDasharray="2,2"/>
            <path d="M 10 80 L 40 80 Q 50 80 50 45 Q 50 80 65 80 Q 75 80 75 45 Q 75 80 85 80 L 120 80 Q 130 80 130 35 Q 130 80 145 80 Q 155 80 155 35 Q 155 80 165 80 L 190 80" stroke="#14b8a6" strokeWidth="1.5" fill="none"/>
          </svg>
          <p className="text-purple-200 text-xs mt-2">
            <strong>Sharoit:</strong> Ikki kristallografik yoki kimyoviy sayt (masalan, Fe²⁺ va Fe³⁺ aralashmasi).
          </p>
          <p className="text-yellow-400 text-[11px] mt-1"><strong>Misollar:</strong> Fe₃O₄ (A/B), aralash valentli klasterlar, xlorit</p>
        </div>

        {/* Superparamagnit */}
        <div className="bg-purple-800/30 rounded-xl p-4 border border-orange-500/40">
          <h4 className="text-orange-400 font-bold text-sm mb-2">5️⃣ &quot;Kollaps&quot; — superparamagnit</h4>
          <svg viewBox="0 0 200 100" className="w-full h-24 bg-purple-950/50 rounded">
            <line x1="10" y1="80" x2="190" y2="80" stroke="#4c1d95" strokeWidth="0.5" strokeDasharray="2,2"/>
            <path d="M 10 80 L 40 80 Q 60 78 80 70 Q 100 55 100 40 Q 100 55 120 70 Q 140 78 160 80 L 190 80" stroke="#14b8a6" strokeWidth="1.5" fill="none"/>
          </svg>
          <p className="text-purple-200 text-xs mt-2">
            <strong>Sharoit:</strong> Nanozarrachalar (D &lt; 20 nm) — magnit vaqti τ ≈ 1/ω_L. Sekstet + singlet aralashmasi.
          </p>
          <p className="text-yellow-400 text-[11px] mt-1"><strong>Misollar:</strong> Nano-Fe₃O₄, ferritinning yadrosi, SPION</p>
        </div>

        {/* Keng chiziq */}
        <div className="bg-purple-800/30 rounded-xl p-4 border border-red-500/40">
          <h4 className="text-red-400 font-bold text-sm mb-2">6️⃣ Keng chiziq / amorf</h4>
          <svg viewBox="0 0 200 100" className="w-full h-24 bg-purple-950/50 rounded">
            <line x1="10" y1="80" x2="190" y2="80" stroke="#4c1d95" strokeWidth="0.5" strokeDasharray="2,2"/>
            <path d="M 10 80 Q 60 78 100 45 Q 140 78 190 80" stroke="#14b8a6" strokeWidth="1.5" fill="none"/>
          </svg>
          <p className="text-purple-200 text-xs mt-2">
            <strong>Sharoit:</strong> Amorf material, ko&apos;p sayt taqsimoti, tez elektron/spin relaksatsiya.
          </p>
          <p className="text-yellow-400 text-[11px] mt-1"><strong>Misollar:</strong> Metall shishalar, gel-nano oksid, ferritin</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 9. AFZALLIK, CHEKLOV VA TAQQOSLAMA
// ============================================================================
function AfzallikChegara() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">⚖️</span>
        <div>
          <h3 className="text-white font-bold text-lg">Usulning afzalliklari, cheklovlari va boshqa usullar bilan taqqoslash</h3>
          <p className="text-purple-400 text-xs">Mössbauer qachon eng yaxshi va qachon boshqa usul kerak?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Afzalliklar */}
        <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/40 rounded-xl p-5">
          <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
            <span className="text-2xl">✅</span> Afzalliklar
          </h4>
          <ul className="text-purple-200 text-xs space-y-2 list-disc list-inside">
            <li><strong className="text-emerald-300">Yadro-selektiv:</strong> faqat ⁵⁷Fe (yoki tanlangan izotop) sanaydi — matrisa muammosi yo&apos;q.</li>
            <li><strong className="text-emerald-300">Oksidlanish + spin holati bir vaqtda:</strong> boshqa hech qaysi usul buni birga bermaydi.</li>
            <li><strong className="text-emerald-300">Miqdoriy tahlil:</strong> ikki fazoli aralashma nisbati chiziq maydonidan (f_LM bir xilligini shart bilan).</li>
            <li><strong className="text-emerald-300">Amorf va kristallik namunalar:</strong> XRD dan farqli, panjaraga bog&apos;liq emas.</li>
            <li><strong className="text-emerald-300">Nobuzuvchi:</strong> γ-nur mikro-namunaga zarar bermaydi (arxeologiya, san&apos;at).</li>
            <li><strong className="text-emerald-300">Yuqori aniqlik:</strong> ΔE/E ≈ 3·10⁻¹³ — jahon rekordi.</li>
            <li><strong className="text-emerald-300">Magnit tartibga sezgir:</strong> XRD ko&apos;rmagan magnit fazani ochadi.</li>
          </ul>
        </div>

        {/* Cheklovlar */}
        <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-500/40 rounded-xl p-5">
          <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
            <span className="text-2xl">⚠️</span> Cheklovlar
          </h4>
          <ul className="text-purple-200 text-xs space-y-2 list-disc list-inside">
            <li><strong className="text-red-300">Faqat qattiq jism:</strong> gaz, suyuqlik yoki eritma o&apos;lchab bo&apos;lmaydi (recoil-free shart).</li>
            <li><strong className="text-red-300">Cheklangan izotoplar ro&apos;yxati:</strong> ~40 dan ozi amaliy foydali (⁵⁷Fe, ¹¹⁹Sn eng ommaviy).</li>
            <li><strong className="text-red-300">Sekin o&apos;lchov:</strong> 4–72 soat / bitta spektr (statistika uchun).</li>
            <li><strong className="text-red-300">Radioaktiv manba:</strong> ⁵⁷Co/Rh 270 kunda yarim yemiriladi, licence.</li>
            <li><strong className="text-red-300">Sensitivlik chegarasi:</strong> ~0.1% Fe massa ulushi (yaxshi hollarda 10 ppm).</li>
            <li><strong className="text-red-300">Kriogen texnologiya:</strong> ko&apos;p namunalar uchun 4–80 K majburiy.</li>
            <li><strong className="text-red-300">Molekulyar geometriya bermaydi:</strong> bog&apos; uzunliklari uchun EXAFS/XRD kerak.</li>
          </ul>
        </div>
      </div>

      {/* Taqqoslama jadval */}
      <div className="bg-purple-800/30 border border-teal-700/30 rounded-xl p-5">
        <h4 className="text-teal-400 font-bold mb-3">📊 Boshqa usullar bilan taqqoslash (Fe komplekslari uchun)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-teal-500/30">
                <th className="text-left p-2 text-yellow-400">Usul</th>
                <th className="text-left p-2 text-yellow-400">Oksidlanish</th>
                <th className="text-left p-2 text-yellow-400">Spin</th>
                <th className="text-left p-2 text-yellow-400">Simmetriya</th>
                <th className="text-left p-2 text-yellow-400">Magnit</th>
                <th className="text-left p-2 text-yellow-400">Amorf</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              <tr className="border-b border-purple-800/30">
                <td className="p-2 font-bold text-teal-300">Mössbauer</td>
                <td className="p-2">✅ To&apos;liq</td>
                <td className="p-2">✅ HS/LS</td>
                <td className="p-2">✅ ΔE_Q</td>
                <td className="p-2">✅ H_hf</td>
                <td className="p-2">✅</td>
              </tr>
              <tr className="border-b border-purple-800/30">
                <td className="p-2 font-bold">EPR</td>
                <td className="p-2">⚠️ Faqat toq</td>
                <td className="p-2">✅ Detal</td>
                <td className="p-2">✅ ZFS</td>
                <td className="p-2">⚠️ Bilvosita</td>
                <td className="p-2">✅</td>
              </tr>
              <tr className="border-b border-purple-800/30">
                <td className="p-2 font-bold">UV-Vis</td>
                <td className="p-2">⚠️ Bilvosita</td>
                <td className="p-2">⚠️ Bilvosita</td>
                <td className="p-2">⚠️ d-d</td>
                <td className="p-2">❌</td>
                <td className="p-2">✅</td>
              </tr>
              <tr className="border-b border-purple-800/30">
                <td className="p-2 font-bold">SQUID</td>
                <td className="p-2">❌</td>
                <td className="p-2">✅ μ_eff</td>
                <td className="p-2">❌</td>
                <td className="p-2">✅ Detal</td>
                <td className="p-2">✅</td>
              </tr>
              <tr className="border-b border-purple-800/30">
                <td className="p-2 font-bold">XPS</td>
                <td className="p-2">✅ Sirt</td>
                <td className="p-2">❌</td>
                <td className="p-2">⚠️</td>
                <td className="p-2">❌</td>
                <td className="p-2">✅ Sirt</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">EXAFS</td>
                <td className="p-2">⚠️ Edge</td>
                <td className="p-2">❌</td>
                <td className="p-2">✅ CN</td>
                <td className="p-2">❌</td>
                <td className="p-2">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-purple-300 text-[11px] mt-3 italic">
          Mössbauer — <strong className="text-emerald-300">yagona</strong> usul, u bir vaqtda oksidlanish, spin, simmetriya
          va magnit tartibni beradi. Molekulyar geometriya uchun EXAFS/XRD, aniq g-tenzor uchun EPR bilan kombinatsiyada
          ideal.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 10. TARIXIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  const vaqta = [
    { yil: "1929", sarlavha: "Kuhn — nazariy taxmin", tavsif: "V. Kuhn rezonans yutishning gaz-o'z-o'zini sinchiklab tekshirdi va rezonansni recoil sabab yo'q qilishini ko'rsatdi." },
    { yil: "1957", sarlavha: "Rudolf Mössbauer — kashfiyot", tavsif: "Heidelberg universitetida ¹⁹¹Ir bilan ishlab, past haroratda qaytishsiz rezonansni kutilmagan tarzda kashf etdi." },
    { yil: "1958", sarlavha: "Nashr", tavsif: "Zeitschrift für Physik da klassik maqola: &quot;Kernresonanzfluoreszenz von Gammastrahlung in Ir¹⁹¹&quot;." },
    { yil: "1959", sarlavha: "⁵⁷Fe kashf etildi", tavsif: "S.S. Hanna va boshqalar ⁵⁷Fe (14.4 keV) da rezonans olishdi — kimyo uchun ochilgan yo'l." },
    { yil: "1960", sarlavha: "Pound–Rebka tajribasi", tavsif: "Harvard minorasida γ-fotonning gravitatsion siljishi ⁵⁷Fe Mössbauer bilan o'lchandi — Einshtein bashorati tasdiqlandi." },
    { yil: "1961", sarlavha: "Nobel mukofoti", tavsif: "R. Mössbauer 32 yoshida Fizika bo'yicha Nobel mukofoti oldi. Robert Hofstadter bilan birga." },
    { yil: "1960-lar", sarlavha: "Kimyo va biologiyaga tatbiq", tavsif: "Ehrenberg, Bearden, Danon: gemoglobin, ferredoksin, sitokrom P450 birinchi bor Mössbauer bilan o'rganildi." },
    { yil: "1980-lar", sarlavha: "SCO va molekulyar magnetlar", tavsif: "Gütlich guruhi Fe(II) SCO ni sistematik ravishda o'rgandi — molekulyar spintronika asosi." },
    { yil: "2004", sarlavha: "Mars — MIMOS-II", tavsif: "NASA Spirit va Opportunity roverlari Marsdagi minerallarni Mössbauer bilan o'lchadi — jetite va hematite topildi." },
    { yil: "2010-lar", sarlavha: "Sinxrotron Mössbauer", tavsif: "SPring-8, APS, ESRF, PETRA-III sinxrotronlarida SMS (Synchrotron Mössbauer Spectroscopy) yuqori bosim va vaqt bo'yicha ajratilgan usullar." },
    { yil: "2020-lar", sarlavha: "Molekulyar Fe(V), Fe(VI) va biomimet", tavsif: "Ferrilat oksoferrilar (Fe(V)=O, Fe(VI)) sintez qilindi va Mössbauer bilan xarakterlandi — biomimet oksidatsiya katalizi." }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🏛️</span>
        <div>
          <h3 className="text-white font-bold text-lg">Tarixiy taraqqiyot va milestonelar</h3>
          <p className="text-purple-400 text-xs">Nazariy taxmindan Marsdagi tadqiqotlargacha</p>
        </div>
      </div>

      <div className="relative pl-8">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 via-purple-500 to-blue-500"></div>
        <div className="space-y-4">
          {vaqta.map((v, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 border-2 border-purple-950 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-teal-500/30">
                {i + 1}
              </div>
              <div className="bg-purple-800/30 rounded-lg p-3 border border-teal-700/30 hover:border-teal-500/50 transition-all">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-yellow-400 font-bold text-sm">{v.yil}</span>
                  <span className="text-teal-300 font-semibold text-sm" dangerouslySetInnerHTML={{__html: v.sarlavha}}/>
                </div>
                <p className="text-purple-200 text-xs" dangerouslySetInnerHTML={{__html: v.tavsif}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function MossbauerSpektroskopiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* HEADER */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 sticky top-0 bg-purple-950/80 backdrop-blur-md z-10">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg transition-colors">
          ← Tahlil usullari
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-teal-400 flex items-center gap-2">
            ⚛️ Mössbauer spektroskopiyasi
          </h1>
          <p className="text-purple-400 text-xs">
            ⁵⁷Fe · Izomer siljish · Kvadrupol bo&apos;linishi · Magnit o&apos;ta nozik tuzilish · Recoil-free rezonans
          </p>
        </div>
        <div className="hidden md:flex gap-2 text-[10px]">
          <span className="bg-teal-600/20 text-teal-400 border border-teal-600/40 px-2 py-1 rounded-full">14.4 keV</span>
          <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/40 px-2 py-1 rounded-full">±10 mm/s</span>
          <span className="bg-purple-600/20 text-purple-400 border border-purple-600/40 px-2 py-1 rounded-full">Nobel 1961</span>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">

        {/* KIRISH — ILMIY ABSTRACT */}
        <IlmiyAbstract />

        {/* BIRIKMALAR KARTASI */}
        <Link
          href="/ilmiy/tahlil/mossbauer/birikmalar"
          className="group block bg-gradient-to-r from-teal-900/40 via-purple-900/40 to-blue-900/40 border border-teal-500/50 rounded-2xl p-6 hover:border-teal-400/80 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-500/20"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">⚛️</div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-teal-400 group-hover:text-teal-300 transition-colors">
                Birikmalarning Mössbauer spektrlari →
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Temir komplekslarining sistematik tahlili: δ, ΔE<sub>Q</sub>, H parametrlari, oksidlanish darajasi va
                spin holati aniq izohlar bilan. Diagnostika kalitlari, tayanch qiymatlar va spektr talqini.
              </p>
            </div>
            <div className="text-3xl text-teal-400 group-hover:translate-x-2 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-teal-600/20 text-teal-400 border border-teal-600/40 px-3 py-1 rounded-full text-xs">Fe komplekslari</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/40 px-3 py-1 rounded-full text-xs">δ (mm/s)</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/40 px-3 py-1 rounded-full text-xs">ΔE<sub>Q</sub> (mm/s)</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/40 px-3 py-1 rounded-full text-xs">H<sub>hf</sub> (T)</span>
            <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-600/40 px-3 py-1 rounded-full text-xs">HS/LS diagnostika</span>
          </div>
        </Link>

        {/* NAVIGATSIYA — QISQA */}
        <nav className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-4">
          <p className="text-yellow-400 text-xs font-bold mb-2">📍 Sahifa bo&apos;limlari:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-[11px]">
            <a href="#fizik-asos" className="bg-purple-800/40 hover:bg-teal-600/30 rounded px-2 py-1 text-center text-teal-300 transition-colors">1. Fizik asos</a>
            <a href="#hyperfine" className="bg-purple-800/40 hover:bg-teal-600/30 rounded px-2 py-1 text-center text-teal-300 transition-colors">2. Hyperfine ta&apos;sirlar</a>
            <a href="#simulyator" className="bg-purple-800/40 hover:bg-teal-600/30 rounded px-2 py-1 text-center text-teal-300 transition-colors">3. Simulyator</a>
            <a href="#izomer" className="bg-purple-800/40 hover:bg-teal-600/30 rounded px-2 py-1 text-center text-teal-300 transition-colors">4. Izomer siljish</a>
            <a href="#tajriba" className="bg-purple-800/40 hover:bg-teal-600/30 rounded px-2 py-1 text-center text-teal-300 transition-colors">5. Apparatura</a>
            <a href="#sco" className="bg-purple-800/40 hover:bg-teal-600/30 rounded px-2 py-1 text-center text-teal-300 transition-colors">6. SCO</a>
            <a href="#amaliyot" className="bg-purple-800/40 hover:bg-teal-600/30 rounded px-2 py-1 text-center text-teal-300 transition-colors">7. Amaliy sohalar</a>
            <a href="#spektr-tipi" className="bg-purple-800/40 hover:bg-teal-600/30 rounded px-2 py-1 text-center text-teal-300 transition-colors">8. Spektr tiplari</a>
            <a href="#taqqoslama" className="bg-purple-800/40 hover:bg-teal-600/30 rounded px-2 py-1 text-center text-teal-300 transition-colors">9. Taqqoslama</a>
            <a href="#tarix" className="bg-purple-800/40 hover:bg-teal-600/30 rounded px-2 py-1 text-center text-teal-300 transition-colors">10. Tarix</a>
          </div>
        </nav>

        {/* 1. FIZIK ASOS */}
        <div id="fizik-asos" className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 scroll-mt-24">
          <FizikAsos />
        </div>

        {/* 2. HYPERFINE */}
        <div id="hyperfine" className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 scroll-mt-24">
          <HyperfineParams />
        </div>

        {/* 3. SIMULYATOR */}
        <div id="simulyator" className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 scroll-mt-24">
          <MossbauerSpectrumSimulator />
        </div>

        {/* 4. IZOMER SILJISH */}
        <div id="izomer" className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 scroll-mt-24">
          <IsomerShiftCalc />
        </div>

        {/* 5. TAJRIBA */}
        <div id="tajriba" className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 scroll-mt-24">
          <TajribaJihoz />
        </div>

        {/* 6. SCO */}
        <div id="sco" className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 scroll-mt-24">
          <TemperatureSCO />
        </div>

        {/* 7. AMALIY SOHALAR */}
        <div id="amaliyot" className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 scroll-mt-24">
          <AmaliyQoshanish />
        </div>

        {/* 8. SPEKTR TIPLARI */}
        <div id="spektr-tipi" className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 scroll-mt-24">
          <SpektrTiplari />
        </div>

        {/* 9. TAQQOSLAMA */}
        <div id="taqqoslama" className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 scroll-mt-24">
          <AfzallikChegara />
        </div>

        {/* 10. TARIX */}
        <div id="tarix" className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 scroll-mt-24">
          <TarixiyKontekst />
        </div>

        {/* MUHIM PARAMETRLAR KART */}
        <div className="bg-gradient-to-br from-yellow-900/20 via-teal-900/20 to-purple-900/20 border border-yellow-500/30 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">📌 Muhim ⁵⁷Fe parametrlari (ma&apos;lumotnoma)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-purple-950/50 rounded-lg p-3 border border-teal-500/20">
              <p className="text-teal-400 font-bold">Asosiy holat spin</p>
              <p className="text-white font-mono text-lg">I = 1/2</p>
              <p className="text-purple-300 text-[10px]">g_n = +0.181</p>
            </div>
            <div className="bg-purple-950/50 rounded-lg p-3 border border-teal-500/20">
              <p className="text-teal-400 font-bold">Qo&apos;zg&apos;algan holat</p>
              <p className="text-white font-mono text-lg">I = 3/2</p>
              <p className="text-purple-300 text-[10px]">g_n = −0.103, Q = +0.16 barn</p>
            </div>
            <div className="bg-purple-950/50 rounded-lg p-3 border border-teal-500/20">
              <p className="text-teal-400 font-bold">Rezonans energiyasi</p>
              <p className="text-white font-mono text-lg">E<sub>γ</sub> = 14.4125 keV</p>
              <p className="text-purple-300 text-[10px]">λ = 0.086 nm</p>
            </div>
            <div className="bg-purple-950/50 rounded-lg p-3 border border-teal-500/20">
              <p className="text-teal-400 font-bold">Tabiiy chiziq kengligi</p>
              <p className="text-white font-mono text-lg">Γ = 0.097 mm/s</p>
              <p className="text-purple-300 text-[10px]">ΔE = 4.66 · 10⁻⁹ eV</p>
            </div>
            <div className="bg-purple-950/50 rounded-lg p-3 border border-teal-500/20">
              <p className="text-teal-400 font-bold">Yashash vaqti</p>
              <p className="text-white font-mono text-lg">τ = 141 ns</p>
              <p className="text-purple-300 text-[10px]">t½ = 97.8 ns</p>
            </div>
            <div className="bg-purple-950/50 rounded-lg p-3 border border-teal-500/20">
              <p className="text-teal-400 font-bold">Manba (ⁿ⁷Co)</p>
              <p className="text-white font-mono text-lg">t½ = 271.8 kun</p>
              <p className="text-purple-300 text-[10px]">EC → ⁵⁷Fe*</p>
            </div>
            <div className="bg-purple-950/50 rounded-lg p-3 border border-teal-500/20">
              <p className="text-teal-400 font-bold">Konversiya koeff.</p>
              <p className="text-white font-mono text-lg">α = 8.19</p>
              <p className="text-purple-300 text-[10px]">14.4 keV chiziq uchun</p>
            </div>
            <div className="bg-purple-950/50 rounded-lg p-3 border border-teal-500/20">
              <p className="text-teal-400 font-bold">⁵⁷Fe mo&apos;lligi</p>
              <p className="text-white font-mono text-lg">2.119 %</p>
              <p className="text-purple-300 text-[10px]">boyitish: 90-95%</p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-teal-600/10 to-purple-600/10 border border-teal-500/30 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>✅</span> Asosiy xulosalar
          </h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm leading-relaxed">
            <li><strong className="text-teal-400">Mössbauer effekti</strong> — qattiq jismdagi qaytishsiz gamma-rezonans (Nobel 1961), Doppler tezligi orqali (±10 mm/s) rezonans sharti bajariladi.</li>
            <li><strong className="text-teal-400">Uchta hyperfine ta&apos;sir</strong>: δ (izomer siljish), ΔE<sub>Q</sub> (kvadrupol) va H<sub>hf</sub> (magnit) yadro atrofidagi elektron muhitni to&apos;liq tavsiflaydi.</li>
            <li><strong className="text-teal-400">Izomer siljish δ</strong> ∝ |ψ(0)|² — oksidlanish darajasi va spin holatini bevosita aniqlaydi (Fe⁰ dan Fe(VI) gacha).</li>
            <li><strong className="text-teal-400">Kvadrupol bo&apos;linishi ΔE<sub>Q</sub></strong> ∝ V<sub>zz</sub> — koordinatsion simmetriya va d-orbital asimmetriyasini o&apos;lchaydi.</li>
            <li><strong className="text-teal-400">Magnit sekstet H<sub>hf</sub></strong> — magnit tartib turi (ferro/antiferro/ferri), Néel/Curie harorati, superparamagnetizm.</li>
            <li><strong className="text-teal-400">Spin Crossover (SCO)</strong> — HS ↔ LS termik o&apos;tishlari Mössbauer bilan miqdoriy o&apos;lchanadi (γ<sub>HS</sub>/γ<sub>LS</sub>).</li>
            <li><strong className="text-teal-400">Yagona usul</strong>: bir vaqtda oksidlanish + spin + simmetriya + magnit tartibni beradi — boshqa hech qaysi spektroskopiyada bu birga yo&apos;q.</li>
            <li><strong className="text-teal-400">Sohalar</strong>: koordinatsion kimyo, biokimyo (Fe–S, Fe-porfirin), mineralogiya (Mars roverlari!), kataliz, batareyalar, arxeometriya.</li>
            <li><strong className="text-teal-400">Chegaralar</strong>: faqat qattiq jism, cheklangan izotoplar (⁵⁷Fe eng ommaviy), kriogen texnologiya, sekin o&apos;lchov.</li>
          </ol>
        </div>

        {/* MANBAALAR VA ADABIYOTLAR */}
        <div className="bg-purple-900/30 border border-purple-700/40 rounded-2xl p-6">
          <h3 className="text-teal-400 font-bold mb-3 flex items-center gap-2">
            <span>📚</span> Tavsiya etilgan adabiyotlar
          </h3>
          <ul className="text-purple-200 text-xs space-y-2 list-disc list-inside">
            <li><strong>P. Gütlich, E. Bill, A.X. Trautwein</strong> — <em>Mössbauer Spectroscopy and Transition Metal Chemistry: Fundamentals and Applications</em>, Springer, 2011.</li>
            <li><strong>N.N. Greenwood, T.C. Gibb</strong> — <em>Mössbauer Spectroscopy</em>, Chapman &amp; Hall, London, 1971 (klassik).</li>
            <li><strong>G.J. Long (ed.)</strong> — <em>Mössbauer Spectroscopy Applied to Inorganic Chemistry</em>, Vol. 1–3, Plenum Press.</li>
            <li><strong>D.P.E. Dickson, F.J. Berry (eds.)</strong> — <em>Mössbauer Spectroscopy</em>, Cambridge Univ. Press, 1986.</li>
            <li><strong>R.L. Mössbauer</strong> — <em>Kernresonanzfluoreszenz von Gammastrahlung in Ir¹⁹¹</em>, Z. Physik <strong>151</strong>, 124 (1958) — asl maqola.</li>
            <li><strong>R.V. Pound, G.A. Rebka</strong> — <em>Apparent Weight of Photons</em>, Phys. Rev. Lett. <strong>4</strong>, 337 (1960).</li>
            <li><strong>Mars Exploration Rover MIMOS-II</strong> — G. Klingelhöfer et al., J. Geophys. Res. <strong>108</strong>, 8067 (2003).</li>
          </ul>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/epr" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all hover:border-purple-400 flex items-center gap-2">
            <span>←</span>
            <div className="text-left">
              <div className="text-[10px] text-purple-400">Oldingi:</div>
              <div className="font-bold">EPR spektroskopiya</div>
            </div>
          </Link>
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar" className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 rounded-xl text-white font-semibold transition-all flex items-center gap-2 shadow-lg shadow-teal-500/30">
            <div className="text-right">
              <div className="text-[10px] text-teal-100">Batafsil:</div>
              <div>Fe birikmalar tahlili</div>
            </div>
            <span>⚛️</span>
          </Link>
          <Link href="/ilmiy/tahlil/cd" className="px-6 py-3 bg-teal-600/80 rounded-xl hover:bg-teal-500 text-white font-semibold transition-all flex items-center gap-2">
            <div className="text-right">
              <div className="text-[10px] text-teal-100">Keyingi:</div>
              <div className="font-bold">CD spektroskopiya</div>
            </div>
            <span>→</span>
          </Link>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/50 mt-12 py-6 px-6 text-center">
        <p className="text-purple-400 text-xs">
          <strong className="text-teal-400">jdakimyo.uz</strong> — o&apos;zbek tilida ilmiy kompleks birikmalar platformasi
        </p>
        <p className="text-purple-500 text-[10px] mt-1">
          Mössbauer spektroskopiyasi bo&apos;limi · Tahlil usullari to&apos;plami · ⁵⁷Fe
        </p>
      </footer>
    </main>
  )
}
