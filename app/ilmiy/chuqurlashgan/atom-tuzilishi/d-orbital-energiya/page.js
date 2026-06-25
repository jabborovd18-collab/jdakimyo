"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// INTERAKTIV ENERGETIK DIAGRAMMA
// ============================================================================
function EnergetikDiagrammaInteraktiv() {
  const [field, setField] = useState("oktaedrik")
  
  const fields = {
    erkin: {
      name: "Erkin ion",
      desc: "5 ta d-orbital degenerat — bir xil energiyada. Kristall maydon yo'q. Faqat gaz fazada yoki erkin ionda kuzatiladi.",
      splitting: "Δ = 0",
      levels: [
        { name: "dxy, dxz, dyz, dz², dx²−y²", energy: "E₀", color: "bg-gray-400", count: 5 }
      ],
      note: "Bu holatda elektronlar Xund qoidasi bo'yicha joylashadi. Hech qanday energetik afzallik yo'q.",
      color: "text-gray-400",
      bg: "bg-gray-600/10 border-gray-500/30"
    },
    oktaedrik: {
      name: "Oktaedrik maydon (O_h)",
      desc: "6 ta ligand oktaedr uchlarida. dx²−y² va dz² orbitallar ligandlarga to'g'ri yo'nalgan — energiyasi ortadi (+0.6Δ₀). dxy, dxz, dyz ligandlar orasida — energiyasi pasayadi (−0.4Δ₀).",
      splitting: "Δ₀ = 10 Dq",
      levels: [
        { name: "dz², dx²−y²", energy: "e_g: +6 Dq", color: "bg-red-500", count: 2 },
        { name: "dxy, dxz, dyz", energy: "t₂g: −4 Dq", color: "bg-blue-500", count: 3 }
      ],
      note: "Δ₀ kattaligi ligand maydon kuchiga bog'liq. Spektrokimyoviy qator: I⁻ < Br⁻ < Cl⁻ < F⁻ < H₂O < NH₃ < en < CN⁻ < CO",
      color: "text-blue-400",
      bg: "bg-blue-600/10 border-blue-500/30"
    },
    tetraedrik: {
      name: "Tetraedrik maydon (T_d)",
      desc: "4 ta ligand tetraedr uchlarida. dxy, dxz, dyz orbitallar ligandlarga yaqinroq — energiyasi ortadi. dz², dx²−y² ligandlardan uzoqroq — energiyasi pasayadi. Ajralish teskari!",
      splitting: "Δ_t ≈ 4/9 Δ₀ ≈ 4.44 Dq",
      levels: [
        { name: "dxy, dxz, dyz", energy: "t₂: +1.78 Dq", color: "bg-red-500", count: 3 },
        { name: "dz², dx²−y²", energy: "e: −2.67 Dq", color: "bg-blue-500", count: 2 }
      ],
      note: "Δ_t < Δ₀ bo'lgani uchun tetraedrik komplekslar deyarli har doim yuqori spinli. Kuchsiz maydon effekti.",
      color: "text-green-400",
      bg: "bg-green-600/10 border-green-500/30"
    },
    kvadrat: {
      name: "Kvadrat tekislik (D_4h)",
      desc: "Oktaedrdan 2 ta aksial ligand olib tashlangan. dx²−y² eng yuqori energiyada (ekvatorial ligandlarga to'g'ri yo'nalgan). dz² energiyasi pasaygan (aksial ligandlar yo'q).",
      splitting: "4 xil energiya darajasi",
      levels: [
        { name: "dx²−y²", energy: "b₁g: Eng yuqori", color: "bg-red-600", count: 1 },
        { name: "dxy", energy: "b₂g: Yuqori", color: "bg-orange-500", count: 1 },
        { name: "dz²", energy: "a₁g: O'rta", color: "bg-yellow-500", count: 1 },
        { name: "dxz, dyz", energy: "e_g: Past", color: "bg-blue-500", count: 2 }
      ],
      note: "d⁸ konfiguratsiyali metallar (Pt²⁺, Pd²⁺, Au³⁺, Ni²⁺) uchun xarakterli. dx²−y² bo'sh qoladi — kvadrat tekislik barqaror.",
      color: "text-purple-400",
      bg: "bg-purple-600/10 border-purple-500/30"
    }
  }

  const f = fields[field]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🎚️ Kristall maydon turlari — interaktiv energetik diagramma</h3>
      
      <div className="flex gap-2 flex-wrap">
        {Object.entries(fields).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setField(key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              field === key 
                ? `${val.bg} ${val.color}` 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}
          >
            {val.name}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-5 border ${f.bg}`}>
        <h4 className={`font-bold text-lg mb-2 ${f.color}`}>{f.name}</h4>
        <p className="text-purple-200 text-sm mb-4">{f.desc}</p>
        
        <div className="bg-purple-900/50 rounded-lg p-4 mb-4">
          <p className="text-yellow-400 font-bold text-sm mb-3">Ajralish energiyasi: <span className="font-mono">{f.splitting}</span></p>
          
          {/* Energetik diagramma */}
          <div className="space-y-1">
            {f.levels.map((level, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${level.color}`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200 text-xs">{level.name}</span>
                    <span className="text-purple-400 text-xs">{level.energy}</span>
                  </div>
                  <div className="flex gap-1 mt-0.5">
                    {[...Array(level.count)].map((_, j) => (
                      <div key={j} className={`w-6 h-1.5 rounded ${level.color}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 {f.note}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SPEKTROKIMYOVIY QATOR INTERAKTIV
// ============================================================================
function SpektrokimyoviyQator() {
  const [showValues, setShowValues] = useState(false)
  
  const ligands = [
    { name: "I⁻", delta: "~0.3", strength: "Eng kuchsiz", color: "bg-red-200" },
    { name: "Br⁻", delta: "~0.35", strength: "Kuchsiz", color: "bg-red-300" },
    { name: "Cl⁻", delta: "~0.4", strength: "Kuchsiz-o'rtacha", color: "bg-orange-300" },
    { name: "F⁻", delta: "~0.45", strength: "O'rtacha", color: "bg-yellow-300" },
    { name: "H₂O", delta: "1.0", strength: "O'rtacha (etalon)", color: "bg-yellow-400" },
    { name: "NH₃", delta: "~1.25", strength: "O'rtacha-kuchli", color: "bg-green-300" },
    { name: "en", delta: "~1.3", strength: "Kuchli", color: "bg-green-400" },
    { name: "bpy", delta: "~1.4", strength: "Kuchli", color: "bg-green-500" },
    { name: "CN⁻", delta: "~1.7", strength: "Juda kuchli", color: "bg-blue-400" },
    { name: "CO", delta: "~2.0", strength: "Eng kuchli", color: "bg-blue-600" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📈 Spektrokimyoviy qator — Δ₀ qiymatlari</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Spektrokimyoviy qator</strong> — ligandlarni 
          kristall maydon ajralish energiyasi (Δ₀) bo'yicha tartiblash.
          Δ₀ qancha katta bo'lsa, ligand shuncha <strong>kuchli maydon</strong> yaratadi.
          Kuchli maydon ligandlari <strong>past spinli</strong> komplekslar hosil qiladi.
        </p>

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setShowValues(!showValues)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold ${showValues ? "bg-yellow-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}
          >
            {showValues ? "Qiymatlarni yashirish" : "Δ₀ qiymatlarini ko'rsatish"}
          </button>
        </div>

        <div className="flex items-end gap-1 h-32">
          {ligands.map((l, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end group">
              <div className="text-xs text-purple-300 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {showValues ? l.delta : ""}
              </div>
              <div 
                className={`w-full ${l.color} rounded-t transition-all hover:scale-110 cursor-pointer`}
                style={{ height: `${(parseFloat(l.delta) / 2.0) * 100}%` }}
                title={`${l.name}: Δ₀ ≈ ${l.delta} (${l.strength})`}
              ></div>
              <span className="text-xs text-purple-300 mt-1">{l.name}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-xs mt-2">
          <span className="text-red-400">Kuchsiz maydon</span>
          <span className="text-yellow-400">O'rtacha</span>
          <span className="text-blue-400">Kuchli maydon</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Δ₀ GA TA'SIR ETUVCHI OMILLAR
// ============================================================================
function DeltaOmillar() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔧 Δ₀ ga ta'sir etuvchi omillar</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            {
              title: "1. Metall oksidlanish darajasi",
              desc: "Oksidlanish darajasi oshgan sari Δ₀ ORTADI. Sababi: yuqori zaryadli metall ligandlarni kuchliroq tortadi.",
              example: "[Co(H₂O)₆]²⁺: Δ₀ ≈ 9 300 sm⁻¹; [Co(H₂O)₆]³⁺: Δ₀ ≈ 18 200 sm⁻¹",
              color: "text-red-400"
            },
            {
              title: "2. Metall tabiati (davr)",
              desc: "3d → 4d → 5d o'tganda Δ₀ ORTADI (~30-50% har bir qadamda). Sababi: 4d va 5d orbitallar kengroq — ligand bilan ko'proq qoplanadi.",
              example: "[Co(NH₃)₆]³⁺: Δ₀ ≈ 23 000 sm⁻¹; [Rh(NH₃)₆]³⁺: Δ₀ ≈ 34 000 sm⁻¹; [Ir(NH₃)₆]³⁺: Δ₀ ≈ 41 000 sm⁻¹",
              color: "text-blue-400"
            },
            {
              title: "3. Ligand tabiati",
              desc: "Spektrokimyoviy qator bo'yicha ligand maydon kuchi oshgan sari Δ₀ ORTADI.",
              example: "I⁻ < Br⁻ < Cl⁻ < F⁻ < H₂O < NH₃ < en < CN⁻ < CO",
              color: "text-green-400"
            },
            {
              title: "4. Geometriya",
              desc: "Δ_tet ≈ 4/9 Δ_oct. Kvadrat tekislikda Δ eng katta. Ligandlar soni va joylashuvi muhim.",
              example: "Δ_oct = 10 Dq; Δ_tet ≈ 4.44 Dq; Δ_sq > Δ_oct",
              color: "text-yellow-400"
            },
          ].map((item, i) => (
            <div key={i} className="bg-purple-900/50 rounded-lg p-4">
              <h4 className={`font-bold text-sm mb-2 ${item.color}`}>{item.title}</h4>
              <p className="text-purple-200 mb-2">{item.desc}</p>
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-400"><strong>Misol:</strong> {item.example}</p>
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
export default function DOrbitalEnergiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300">Chuqurlashgan</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="text-purple-400 hover:text-purple-300">Atom tuzilishi</Link>
          <span className="text-purple-600">›</span>
          <span className="text-orange-400">d-orbital energiyasi</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">⚡ d-orbitallarning energiyasi</h1>
          <p className="text-purple-400 text-sm">Degenerat holat • Oktaedrik, tetraedrik, tekis kvadrat maydonlarda ajralish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Erkin ionda degenerat holat</h2>
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Erkin metall ionida</strong> barcha 5 ta d-orbital 
              <strong className="text-yellow-400"> bir xil energiyaga</strong> ega — <strong>degenerat holat</strong>.
              Ligandlar yaqinlashganda bu degeneratlik buziladi — orbitallar energetik jihatdan ajraladi.
              Bu ajralish <strong className="text-yellow-400">kristall maydon nazariyasining</strong> asosidir.
              Ajralish energiyasi <strong>Δ</strong> (yoki 10 Dq) kompleksning rangi, magnit xossalari 
              va barqarorligini belgilaydi.
            </p>
          </div>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
            <p className="text-purple-200 text-lg">Erkin ionda:</p>
            <p className="text-white font-bold text-lg font-mono">dxy = dxz = dyz = dz² = dx²−y²</p>
            <p className="text-purple-400 text-sm mt-2">Barcha 5 ta orbital — bir xil energiya (E₀)</p>
          </div>
        </div>

        {/* INTERAKTIV DIAGRAMMA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EnergetikDiagrammaInteraktiv />
        </div>

        {/* SPEKTROKIMYOVIY QATOR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpektrokimyoviyQator />
        </div>

        {/* Δ₀ OMILLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DeltaOmillar />
        </div>

        {/* TAQQOSLASH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Uchala maydonni taqqoslash</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-yellow-400">Xususiyat</th>
                  <th className="py-3 px-4 text-blue-400">Oktaedrik (O_h)</th>
                  <th className="py-3 px-4 text-green-400">Tetraedrik (T_d)</th>
                  <th className="py-3 px-4 text-purple-400">Kvadrat (D_4h)</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["Ajralish energiyasi", "Δ₀ = 10 Dq", "Δ_t ≈ 4/9 Δ₀ ≈ 4.44 Dq", "Δ_sq > Δ₀"],
                  ["Stabillashgan guruh", "t₂g (3 ta): −4 Dq", "e (2 ta): −6 Dq", "dxz, dyz: eng past"],
                  ["Destabillashgan guruh", "e_g (2 ta): +6 Dq", "t₂ (3 ta): +4 Dq", "dx²−y²: eng yuqori"],
                  ["Ajralish yo'nalishi", "e_g yuqori, t₂g past", "t₂ yuqori, e past (teskari!)", "4 xil daraja"],
                  ["Eng yuqori orbital", "dx²−y², dz²", "dxy, dxz, dyz", "dx²−y²"],
                  ["Eng past orbital", "dxy, dxz, dyz", "dz², dx²−y²", "dxz, dyz"],
                  ["Spin holati", "HS yoki LS (Δ₀ ga bog'liq)", "Deyarli har doim HS", "LS (d⁸ uchun)"],
                  ["Misol", "[Ti(H₂O)₆]³⁺", "[CoCl₄]²⁻", "[PtCl₄]²⁻"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-4"><strong>{row[0]}</strong></td>
                    <td className="py-2 px-4">{row[1]}</td>
                    <td className="py-2 px-4">{row[2]}</td>
                    <td className="py-2 px-4">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Erkin ionda 5 ta d-orbital <strong className="text-yellow-400">degenerat</strong> (bir xil energiya)</li>
            <li>Oktaedrik maydon: <strong className="text-blue-400">t₂g (−0.4Δ₀) + e_g (+0.6Δ₀)</strong> — eng muhim holat</li>
            <li>Tetraedrik maydon: <strong className="text-green-400">teskari ajralish, Δ_t ≈ 4/9 Δ₀</strong></li>
            <li>Tekis kvadrat: <strong className="text-purple-400">eng katta ajralish, 4 xil energiya darajasi</strong></li>
            <li>Δ₀ ga ta'sir etuvchi omillar: <strong className="text-yellow-400">oksidlanish darajasi, metall davri, ligand, geometriya</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/tugun-tekisliklari" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Tugun tekisliklari</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/elektron-konfig" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Elektron konfiguratsiyalar →</Link>
        </div>

      </section>
    </main>
  )
}