// components/milliy-sertifikat/KimyoJadvallarModal.jsx
"use client"

import { useState, useMemo } from "react"
import Ikon from "@/components/Ikon"

// D.I. Mendeleyev Davriy Sistemasi elementlari (asosiy va keng tarqalganlari)
const ELEMENTLAR = [
  { n: 1, s: "H", nom: "Vodorod", m: 1.008, g: "metallmas", davr: 1, guruh: 1 },
  { n: 2, s: "He", nom: "Geliy", m: 4.003, g: "inert", davr: 1, guruh: 18 },
  { n: 3, s: "Li", nom: "Litiy", m: 6.94, g: "ishqoriy", davr: 2, guruh: 1 },
  { n: 4, s: "Be", nom: "Berilliy", m: 9.012, g: "ishqoriy-yer", davr: 2, guruh: 2 },
  { n: 5, s: "B", nom: "Bor", m: 10.81, g: "metalloid", davr: 2, guruh: 13 },
  { n: 6, s: "C", nom: "Uglerod", m: 12.011, g: "metallmas", davr: 2, guruh: 14 },
  { n: 7, s: "N", nom: "Azot", m: 14.007, g: "metallmas", davr: 2, guruh: 15 },
  { n: 8, s: "O", nom: "Kislorod", m: 15.999, g: "metallmas", davr: 2, guruh: 16 },
  { n: 9, s: "F", nom: "Ftor", m: 18.998, g: "galogen", davr: 2, guruh: 17 },
  { n: 10, s: "Ne", nom: "Neon", m: 20.18, g: "inert", davr: 2, guruh: 18 },
  { n: 11, s: "Na", nom: "Natriy", m: 22.99, g: "ishqoriy", davr: 3, guruh: 1 },
  { n: 12, s: "Mg", nom: "Magniy", m: 24.305, g: "ishqoriy-yer", davr: 3, guruh: 2 },
  { n: 13, s: "Al", nom: "Alyuminiy", m: 26.982, g: "metall", davr: 3, guruh: 13 },
  { n: 14, s: "Si", nom: "Kremniy", m: 28.085, g: "metalloid", davr: 3, guruh: 14 },
  { n: 15, s: "P", nom: "Fosfor", m: 30.974, g: "metallmas", davr: 3, guruh: 15 },
  { n: 16, s: "S", nom: "Oltingugurt", m: 32.06, g: "metallmas", davr: 3, guruh: 16 },
  { n: 17, s: "Cl", nom: "Xlor", m: 35.45, g: "galogen", davr: 3, guruh: 17 },
  { n: 18, s: "Ar", nom: "Argon", m: 39.95, g: "inert", davr: 3, guruh: 18 },
  { n: 19, s: "K", nom: "Kaliy", m: 39.098, g: "ishqoriy", davr: 4, guruh: 1 },
  { n: 20, s: "Ca", nom: "Kalsiy", m: 40.078, g: "ishqoriy-yer", davr: 4, guruh: 2 },
  { n: 21, s: "Sc", nom: "Skandiy", m: 44.956, g: "otish", davr: 4, guruh: 3 },
  { n: 22, s: "Ti", nom: "Titan", m: 47.867, g: "otish", davr: 4, guruh: 4 },
  { n: 23, s: "V", nom: "Vanadiy", m: 50.942, g: "otish", davr: 4, guruh: 5 },
  { n: 24, s: "Cr", nom: "Xrom", m: 51.996, g: "otish", davr: 4, guruh: 6 },
  { n: 25, s: "Mn", nom: "Marganets", m: 54.938, g: "otish", davr: 4, guruh: 7 },
  { n: 26, s: "Fe", nom: "Temir", m: 55.845, g: "otish", davr: 4, guruh: 8 },
  { n: 27, s: "Co", nom: "Kobalt", m: 58.933, g: "otish", davr: 4, guruh: 9 },
  { n: 28, s: "Ni", nom: "Nikel", m: 58.693, g: "otish", davr: 4, guruh: 10 },
  { n: 29, s: "Cu", nom: "Mis", m: 63.546, g: "otish", davr: 4, guruh: 11 },
  { n: 30, s: "Zn", nom: "Rux", m: 65.38, g: "otish", davr: 4, guruh: 12 },
  { n: 31, s: "Ga", nom: "Galliy", m: 69.723, g: "metall", davr: 4, guruh: 13 },
  { n: 32, s: "Ge", nom: "Germaniy", m: 72.63, g: "metalloid", davr: 4, guruh: 14 },
  { n: 33, s: "As", nom: "Mishyak", m: 74.922, g: "metalloid", davr: 4, guruh: 15 },
  { n: 34, s: "Se", nom: "Selen", m: 78.971, g: "metallmas", davr: 4, guruh: 16 },
  { n: 35, s: "Br", nom: "Brom", m: 79.904, g: "galogen", davr: 4, guruh: 17 },
  { n: 36, s: "Kr", nom: "Kripton", m: 83.798, g: "inert", davr: 4, guruh: 18 },
  { n: 37, s: "Rb", nom: "Rubidiy", m: 85.468, g: "ishqoriy", davr: 5, guruh: 1 },
  { n: 38, s: "Sr", nom: "Stronsiy", m: 87.62, g: "ishqoriy-yer", davr: 5, guruh: 2 },
  { n: 47, s: "Ag", nom: "Kumush", m: 107.87, g: "otish", davr: 5, guruh: 11 },
  { n: 48, s: "Cd", nom: "Kadmiy", m: 112.41, g: "otish", davr: 5, guruh: 12 },
  { n: 50, s: "Sn", nom: "Qalay", m: 118.71, g: "metall", davr: 5, guruh: 14 },
  { n: 51, s: "Sb", nom: "Surma", m: 121.76, g: "metalloid", davr: 5, guruh: 15 },
  { n: 53, s: "I", nom: "Yod", m: 126.90, g: "galogen", davr: 5, guruh: 17 },
  { n: 54, s: "Xe", nom: "Ksenon", m: 131.29, g: "inert", davr: 5, guruh: 18 },
  { n: 55, s: "Cs", nom: "Seziy", m: 132.91, g: "ishqoriy", davr: 6, guruh: 1 },
  { n: 56, s: "Ba", nom: "Bariy", m: 137.33, g: "ishqoriy-yer", davr: 6, guruh: 2 },
  { n: 74, s: "W", nom: "Volfram", m: 183.84, g: "otish", davr: 6, guruh: 6 },
  { n: 78, s: "Pt", nom: "Platina", m: 195.08, g: "otish", davr: 6, guruh: 10 },
  { n: 79, s: "Au", nom: "Oltin", m: 196.97, g: "otish", davr: 6, guruh: 11 },
  { n: 80, s: "Hg", nom: "Simob", m: 200.59, g: "otish", davr: 6, guruh: 12 },
  { n: 82, s: "Pb", nom: "Qo'rg'oshin", m: 207.2, g: "metall", davr: 6, guruh: 14 },
  { n: 83, s: "Bi", nom: "Vismut", m: 208.98, g: "metall", davr: 6, guruh: 15 },
]

// Eruvchanlik jadvali: Kationlar vs Anionlar
const KATIONLAR = [
  "H⁺", "Li⁺", "Na⁺", "K⁺", "NH₄⁺", "Mg²⁺", "Ca²⁺", "Ba²⁺", "Al³⁺", "Fe²⁺", "Fe³⁺", "Cu²⁺", "Zn²⁺", "Ag⁺", "Pb²⁺"
]
const ANIONLAR = [
  "OH⁻", "NO₃⁻", "Cl⁻", "Br⁻", "I⁻", "S²⁻", "SO₃²⁻", "SO₄²⁻", "CO₃²⁻", "SiO₃²⁻", "PO₄³⁻", "CH₃COO⁻"
]

// E = eriydi, K = kam eriydi, Ch = cho'kma, M = mavjud emas / parchalanadi
const ERUVCHANLIK_MATRITSA = {
  "H⁺": ["E", "E", "E", "E", "E", "E", "E", "E", "E", "Ch", "E", "E"],
  "Li⁺": ["E", "E", "E", "E", "E", "E", "E", "E", "K", "K", "K", "E"],
  "Na⁺": ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
  "K⁺": ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
  "NH₄⁺": ["E", "E", "E", "E", "E", "E", "E", "E", "E", "M", "E", "E"],
  "Mg²⁺": ["Ch", "E", "E", "E", "E", "M", "Ch", "E", "Ch", "Ch", "Ch", "E"],
  "Ca²⁺": ["K", "E", "E", "E", "E", "M", "Ch", "K", "Ch", "Ch", "Ch", "E"],
  "Ba²⁺": ["E", "E", "E", "E", "E", "E", "Ch", "Ch", "Ch", "Ch", "Ch", "E"],
  "Al³⁺": ["Ch", "E", "E", "E", "E", "M", "M", "E", "M", "Ch", "Ch", "E"],
  "Fe²⁺": ["Ch", "E", "E", "E", "E", "Ch", "Ch", "E", "Ch", "Ch", "Ch", "E"],
  "Fe³⁺": ["Ch", "E", "E", "E", "M", "M", "M", "E", "M", "Ch", "Ch", "E"],
  "Cu²⁺": ["Ch", "E", "E", "E", "M", "Ch", "M", "E", "M", "Ch", "Ch", "E"],
  "Zn²⁺": ["Ch", "E", "E", "E", "E", "Ch", "Ch", "E", "Ch", "Ch", "Ch", "E"],
  "Ag⁺": ["M", "E", "Ch", "Ch", "Ch", "Ch", "Ch", "K", "Ch", "Ch", "Ch", "E"],
  "Pb²⁺": ["Ch", "E", "K", "K", "Ch", "Ch", "Ch", "Ch", "Ch", "Ch", "Ch", "E"],
}

export default function KimyoJadvallarModal({ ochiq, onYopish }) {
  const [faolVkladka, setFaolVkladka] = useState("davriy")
  const [elementQidiruv, setElementQidiruv] = useState("")

  const saralanganElementlar = useMemo(() => {
    if (!elementQidiruv.trim()) return ELEMENTLAR
    const q = elementQidiruv.toLowerCase()
    return ELEMENTLAR.filter(
      (e) =>
        e.s.toLowerCase().includes(q) ||
        e.nom.toLowerCase().includes(q) ||
        String(e.n).includes(q)
    )
  }, [elementQidiruv])

  if (!ochiq) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="ms-akademik ms-karta w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col text-white">
        {/* Modal Sarlavhasi */}
        <div className="p-4 sm:p-5 border-b border-sky-400/25 flex items-center justify-between gap-3 bg-[#0c1d54]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/50 flex items-center justify-center text-amber-300">
              <Ikon nom="atom" olcham={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
                Kimyoviy ma&apos;lumotnomalar &amp; Jadvallar
              </h2>
              <p className="text-xs text-sky-200/90">
                Milliy sertifikat va Rasch imtihoni uchun rasmiy yordamchi jadvallar
              </p>
            </div>
          </div>

          <button
            onClick={onYopish}
            className="p-2 rounded-xl bg-[#112566]/80 hover:bg-rose-900/70 border border-sky-400/35 hover:border-rose-400/70 text-sky-100 hover:text-white transition"
            title="Yopish"
          >
            <Ikon nom="yopish" olcham={18} />
          </button>
        </div>

        {/* Vkladkalar */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-sky-400/20 bg-[#0a1847]/85 overflow-x-auto text-xs">
          <button
            onClick={() => setFaolVkladka("davriy")}
            className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              faolVkladka === "davriy"
                ? "bg-amber-400/25 text-amber-200 border border-amber-300/55 shadow-sm"
                : "bg-[#10225e]/80 text-sky-200 hover:bg-[#163082] border border-transparent"
            }`}
          >
            <Ikon nom="atom" olcham={14} />
            <span>Davriy jadval (Mendeleyev)</span>
          </button>

          <button
            onClick={() => setFaolVkladka("eruvchanlik")}
            className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              faolVkladka === "eruvchanlik"
                ? "bg-amber-400/25 text-amber-200 border border-amber-300/55 shadow-sm"
                : "bg-[#10225e]/80 text-sky-200 hover:bg-[#163082] border border-transparent"
            }`}
          >
            <Ikon nom="kolba" olcham={14} />
            <span>Eruvchanlik jadvali</span>
          </button>

          <button
            onClick={() => setFaolVkladka("formulalar")}
            className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              faolVkladka === "formulalar"
                ? "bg-amber-400/25 text-amber-200 border border-amber-300/55 shadow-sm"
                : "bg-[#10225e]/80 text-sky-200 hover:bg-[#163082] border border-transparent"
            }`}
          >
            <Ikon nom="formula" olcham={14} />
            <span>Formulalar &amp; Doimiylar</span>
          </button>
        </div>

        {/* Modal Ichki Mazmuni */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* ═══ 1. DAVRIY JADVAL ═══ */}
          {faolVkladka === "davriy" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-300">
                    <Ikon nom="qidiruv" olcham={14} />
                  </span>
                  <input
                    type="text"
                    value={elementQidiruv}
                    onChange={(e) => setElementQidiruv(e.target.value)}
                    placeholder="Element nomi, belgisi yoki raqami (masalan, Fe, 26, Mis)..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#0d1f59]/85 border border-sky-400/40 focus:border-amber-300 text-white placeholder-sky-200/55 outline-none"
                  />
                </div>
                <div className="text-[11px] text-sky-100/90 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Ishqoriy</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Ishqoriy-yer</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> O&apos;tish metallari</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Metallmas</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-400" /> Inert gaz</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {saralanganElementlar.map((el) => {
                  let rang = "border-sky-400/45 bg-[#102464]/75 text-sky-100"
                  if (el.g === "ishqoriy") rang = "border-rose-400/60 bg-rose-500/20 text-rose-200"
                  if (el.g === "ishqoriy-yer") rang = "border-amber-400/60 bg-amber-500/20 text-amber-200"
                  if (el.g === "otish") rang = "border-sky-400/60 bg-sky-500/20 text-sky-200"
                  if (el.g === "metallmas") rang = "border-emerald-400/60 bg-emerald-500/20 text-emerald-200"
                  if (el.g === "galogen") rang = "border-cyan-400/60 bg-cyan-500/20 text-cyan-200"
                  if (el.g === "inert") rang = "border-violet-400/60 bg-violet-500/20 text-violet-200"

                  return (
                    <div
                      key={el.n}
                      className={`p-2.5 rounded-xl border ${rang} flex flex-col justify-between hover:scale-105 transition-transform cursor-pointer shadow-sm`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-90 font-mono">
                        <span>{el.n}</span>
                        <span>{el.m}</span>
                      </div>
                      <div className="text-center py-1">
                        <span className="text-xl font-bold tracking-wider text-white">{el.s}</span>
                        <span className="block text-[10px] truncate opacity-95">{el.nom}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ═══ 2. ERUVCHANLIK JADVALI ═══ */}
          {faolVkladka === "eruvchanlik" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-sky-100">
                <span className="inline-flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-emerald-500/25 text-emerald-300 font-bold flex items-center justify-center text-[10px] border border-emerald-400/60">E</span> Eriydi</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-amber-500/25 text-amber-300 font-bold flex items-center justify-center text-[10px] border border-amber-400/60">K</span> Kam eriydi</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-rose-500/25 text-rose-300 font-bold flex items-center justify-center text-[10px] border border-rose-400/60">Ch</span> Cho&apos;kma</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-slate-500/30 text-slate-200 font-bold flex items-center justify-center text-[10px] border border-slate-400/60">—</span> Parchalanadi</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-sky-400/30 bg-[#091642]/90">
                <table className="w-full text-center border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#11266b] border-b border-sky-400/30">
                      <th className="p-2.5 text-left font-bold text-amber-300 border-r border-sky-400/30 sticky left-0 bg-[#11266b]">
                        Kation / Anion
                      </th>
                      {ANIONLAR.map((anion) => (
                        <th key={anion} className="p-2 font-bold text-cyan-200 border-r border-sky-400/20 min-w-[48px]">
                          {anion}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {KATIONLAR.map((kat) => (
                      <tr key={kat} className="border-b border-sky-400/15 hover:bg-sky-400/10">
                        <td className="p-2.5 text-left font-bold text-amber-200 border-r border-sky-400/30 sticky left-0 bg-[#0d1e57]">
                          {kat}
                        </td>
                        {ERUVCHANLIK_MATRITSA[kat]?.map((belgi, idx) => {
                          let badgeRang = "text-emerald-300 bg-emerald-500/20"
                          if (belgi === "K") badgeRang = "text-amber-300 bg-amber-500/20"
                          if (belgi === "Ch") badgeRang = "text-rose-300 bg-rose-500/25 font-bold"
                          if (belgi === "M") badgeRang = "text-slate-200 bg-slate-500/20"

                          return (
                            <td key={idx} className="p-1.5 border-r border-sky-400/15">
                              <span className={`inline-block w-6 py-0.5 rounded text-[11px] ${badgeRang}`}>
                                {belgi === "M" ? "—" : belgi}
                              </span>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══ 3. FORMULALAR & DOIMIYLAR ═══ */}
          {faolVkladka === "formulalar" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Asosiy doimiylar */}
              <div className="ms-karta-ichki p-4 rounded-2xl space-y-2.5">
                <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Ikon nom="atom" olcham={16} />
                  <span>Fundamental Kimyoviy Doimiylar</span>
                </h3>
                <ul className="space-y-1.5 text-sky-100">
                  <li className="flex justify-between border-b border-sky-400/20 pb-1">
                    <span>Avogadro doimiysi (N_A):</span>
                    <strong className="text-white font-mono">6.02 × 10²³ mol⁻¹</strong>
                  </li>
                  <li className="flex justify-between border-b border-sky-400/20 pb-1">
                    <span>Normal sharoitda gaz hajmi (V_m):</span>
                    <strong className="text-white font-mono">22.4 L / mol</strong>
                  </li>
                  <li className="flex justify-between border-b border-sky-400/20 pb-1">
                    <span>Faradey doimiysi (F):</span>
                    <strong className="text-white font-mono">96500 Kl / mol (A·s)</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Universal gaz doimiysi (R):</span>
                    <strong className="text-white font-mono">8.314 J / (mol·K)</strong>
                  </li>
                </ul>
              </div>

              {/* Eritmalar konsentratsiyalari */}
              <div className="ms-karta-ichki p-4 rounded-2xl space-y-2.5">
                <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Ikon nom="kolba" olcham={16} />
                  <span>Eritmalar Formulalari</span>
                </h3>
                <ul className="space-y-1.5 text-sky-100">
                  <li className="border-b border-sky-400/20 pb-1">
                    Massa ulush: <strong className="text-white font-mono">ω = (m_eri / m_eritma) × 100%</strong>
                  </li>
                  <li className="border-b border-sky-400/20 pb-1">
                    Molyar konsentratsiya: <strong className="text-white font-mono">C_M = n / V = (10·ω·ρ) / M</strong>
                  </li>
                  <li className="border-b border-sky-400/20 pb-1">
                    Eruvchanlik koeffitsiyenti: <strong className="text-white font-mono">S = (m_tuz / m_suv) × 1000</strong>
                  </li>
                  <li>
                    pH va pOH munosabati: <strong className="text-white font-mono">pH = -log[H⁺], pH + pOH = 14</strong>
                  </li>
                </ul>
              </div>

              {/* Gazlar va Stexiometriya */}
              <div className="ms-karta-ichki p-4 rounded-2xl space-y-2.5">
                <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Ikon nom="kristall" olcham={16} />
                  <span>Gazlar va Stexiometriya</span>
                </h3>
                <ul className="space-y-1.5 text-sky-100">
                  <li className="border-b border-sky-400/20 pb-1">
                    Mendeleyev-Klapeyron tenglamasi: <strong className="text-white font-mono">P·V = (m/M)·R·T</strong>
                  </li>
                  <li className="border-b border-sky-400/20 pb-1">
                    Zichlik bo&apos;yicha molyar massa: <strong className="text-white font-mono">M_aralashma = D × M_standart</strong>
                  </li>
                  <li>
                    Reaksiya amaliy unumi: <strong className="text-white font-mono">η = (m_amaliy / m_nazariy) × 100%</strong>
                  </li>
                </ul>
              </div>

              {/* Kinetika va Elektroliz */}
              <div className="ms-karta-ichki p-4 rounded-2xl space-y-2.5">
                <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Ikon nom="chaqmoq" olcham={16} />
                  <span>Kinetika va Elektroliz</span>
                </h3>
                <ul className="space-y-1.5 text-sky-100">
                  <li className="border-b border-sky-400/20 pb-1">
                    Faradey qonuni: <strong className="text-white font-mono">m = (M · I · t) / (z · F)</strong>
                  </li>
                  <li className="border-b border-sky-400/20 pb-1">
                    Vant-Goff qoidasi: <strong className="text-white font-mono">v₂ / v₁ = γ^((T₂ - T₁)/10)</strong>
                  </li>
                  <li>
                    Kimyoviy muvozanat doimiysi: <strong className="text-white font-mono">K_c = [C]^c·[D]^d / ([A]^a·[B]^b)</strong>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Pastki Qismi */}
        <div className="p-4 border-t border-sky-400/25 bg-[#0a1745] flex justify-end">
          <button
            onClick={onYopish}
            className="px-5 py-2 rounded-xl bg-sky-500/25 hover:bg-sky-500/35 border border-sky-400/50 text-white font-semibold text-xs transition"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  )
}
