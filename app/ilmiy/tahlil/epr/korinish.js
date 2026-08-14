"use client"

import Link from "next/link"
import FonTanlagich, { useFon } from "@/components/FonTanlagich"
import Ikon from "@/components/Ikon"
import { useMemo, useState } from "react"

const microwaveBands = [
  {
    name: "L-band",
    freq: 1.0,
    field: "~350 G",
    afzallik: "Biologik namunalarda chuqur kirish va to'qimalarda qulay",
    cheklov: "Anizotropiya ajralishi past",
  },
  {
    name: "S-band",
    freq: 3.0,
    field: "~1070 G",
    afzallik: "Dielektrik yo'qotishlar kamayadi",
    cheklov: "Kamroq tarqalgan apparatura",
  },
  {
    name: "X-band",
    freq: 9.5,
    field: "~3390 G",
    afzallik: "Eng universal: rutinali CW EPR uchun standart",
    cheklov: "Ba'zi katta ZFS holatlarida yetarli emas",
  },
  {
    name: "Q-band",
    freq: 35,
    field: "~12500 G",
    afzallik: "g-anizotropiya va orientatsion seleksiya kuchliroq",
    cheklov: "Namuna tayyorlash talabi yuqoriroq",
  },
  {
    name: "W-band",
    freq: 95,
    field: "~33900 G",
    afzallik: "Nozik g-tensor farqlarini ochadi",
    cheklov: "Qimmat va yuqori texnik murakkab",
  },
]

const quickFacts = [
  {
    title: "Faqat paramagnit markazlar",
    value: "toq e⁻",
    text: "EPR juftlashmagan elektronni bevosita ko'radi; diamagnit komplekslar odatda signal bermaydi.",
  },
  {
    title: "Standart ish diapazoni",
    value: "X-band 9.5 GHz",
    text: "Ko'p laboratoriyalarda g, A, ΔB va sifat tahlili aynan X-bandda olinadi.",
  },
  {
    title: "Asosiy kuzatiladigan parametrlar",
    value: "g, A, D, E",
    text: "Geometriya, simmetriya, kovalentlik va spin holati shu parametrlar orqali talqin qilinadi.",
  },
  {
    title: "Raqamli chuqurlik",
    value: "CW + pulse",
    text: "CW EPR spektr shaklini beradi, pulsli EPR esa T1, Tm, masofa va yadroviy muhitni ochadi.",
  },
]

const parameterCards = [
  {
    nom: "g-tensor",
    formula: "ν = gμB B / h",
    mazmun: "Erkin elektron uchun g ≈ 2.0023. Organik radikallarda g odatda 2 ga yaqin; o'tish metallarda spin-orbital coupling va ligand maydoni sababli g sezilarli og'adi.",
    ahamiyat: "Geometriya, orbital holat va simmetriya haqida birinchi signal.",
  },
  {
    nom: "A-tensor (gipernozik coupling)",
    formula: "Ĥhf = S·A·I",
    mazmun: "Elektron spin zichligi qaysi yadroda to'planganini ko'rsatadi. Metall yadrosi uchun metall-ligand kovalentligini, ligand yadrolari uchun spin delokalizatsiyasini ochadi.",
    ahamiyat: "Yadro turi, donor atom va spin taqsimoti aniqlanadi.",
  },
  {
    nom: "D va E (ZFS)",
    formula: "ĤZFS = D[Sz² − S(S+1)/3] + E(Sx² − Sy²)",
    mazmun: "S ≥ 1 sistemalarda nol maydonda ham sathlar ajraladi. D — aksial, E — rombik buzilish parametri.",
    ahamiyat: "Yuqori-spin komplekslar, triplet holatlar va single-molecule magnetlar uchun hal qiluvchi parametr.",
  },
  {
    nom: "ΔBpp, T1, Tm",
    formula: "linewidth ↔ relaxation",
    mazmun: "Chiziq kengligi faqat apparat emas: unresolved hyperfine, exchange, dipolyar coupling, g-strain, spin-lattice va spin-spin relaksatsiya ham ta'sir qiladi.",
    ahamiyat: "Harorat, kontsentratsiya va harakatchanlikni to'g'ri talqin qilishga yordam beradi.",
  },
]

const theoryBlocks = [
  {
    title: "1. Fizik asos",
    body:
      "Tashqi magnit maydon bo'lmaganda juftlashmagan elektron sathlari degenerat bo'lishi mumkin. B maydon qo'llanganda Zeeman bo'linish yuz beradi va sathlar orasidagi energiya farqi mikroto'lqin kvanti energiyasiga tenglashganda rezonans kuzatiladi. Odatdagi CW EPR tajribasida chastota doimiy ushlanadi, magnit maydon esa skan qilinadi.",
  },
  {
    title: "2. Spin Hamiltoniani",
    body:
      "Amaliy talqin to'liq kvant-kimyoviy emas, balki samarali spin Hamiltonian orqali yuritiladi: elektron Zeeman hadi, hyperfine had, zero-field splitting, yadroviy Zeeman va ba'zan quadrupole hadlar qo'shiladi. Demak spektr — bu oddiy cho'qqilar to'plami emas, balki magnit o'zaro ta'sirlar imzosi.",
  },
  {
    title: "3. Izotrop va anizotrop limit",
    body:
      "Suyuq eritmada molekula tez aylanib tursa g va A tensorlar o'rtachalanadi, spektr izotrop ko'rinishga o'tadi. Muzlatilgan eritma, kukun yoki kristalda esa tensorning bosh o'qlari ajraladi; g∥, g⊥ yoki g1, g2, g3 kabi qiymatlar paydo bo'ladi.",
  },
  {
    title: "4. Talqin mantig'i",
    body:
      "Avval signal bor-yo'qligi tekshiriladi, keyin g pozitsiyasi, hiperfin splitting, chiziq kengligi va temperaturaga bog'liqlik ko'riladi. Shundan so'nggina geometriya, oksidlanish darajasi, ligand turi yoki spin holati haqida xulosa chiqariladi.",
  },
]

const cwVsPulse = [
  {
    nom: "CW EPR",
    qachon: "Rutin tahlil, tez skrining, g/A/ΔB talqini",
    nima: "Field modulation sabab odatda birinchi hosila spektr yoziladi. Signal shakli, hiperfin ajralishi va nisbiy intensivliklar ko'rinadi.",
    kuchli: "Tez, sezgir, oson; rutinali komplekslar uchun ideal.",
  },
  {
    nom: "Pulse EPR",
    qachon: "Murakkab muhit, masofa, relaksatsiya, yadro yaqinligi kerak bo'lsa",
    nima: "Echo usullari orqali T1, Tm, ESEEM, HYSCORE, ENDOR, DEER/PELDOR olinadi. Fazoviy yaqinlik va yadro atrof-muhiti ancha chuqur ochiladi.",
    kuchli: "Strukturaviy masofa va dinamika bo'yicha CW dan ancha boy axborot beradi.",
  },
]

const speciesGuide = [
  {
    nom: "Organik radikal / nitroksid",
    signatura: "g ≈ 2.003 atrofida, ko'pincha N bilan hiperfin",
    "ma'no": "Spin asosan p-tip SOMO da. Eritmada izotrop, muzlatilganda g va A tensorlari ajraladi.",
  },
  {
    nom: "Cu²⁺ (d⁹)",
    signatura: "Ko'pincha g∥ > g⊥ > 2 va A∥ yaxshi ajraladi",
    "ma'no": "Aksial cho'zilgan koordinatsiya va dx²−y² asosiy holat uchun juda xos. Geometriya va donor atomlar haqida kuchli signal.",
  },
  {
    nom: "VO²⁺ / V(IV)",
    signatura: "⁵¹V (I = 7/2) sabab 8 chiziqli pattern",
    "ma'no": "Oksovanadiyl markazlar uchun klassik EPR imzo; g va A bo'yicha koordinatsion muhit farqlanadi.",
  },
  {
    nom: "Mn²⁺ (d⁵, HS)",
    signatura: "⁵⁵Mn (I = 5/2) sabab 6 chiziq",
    "ma'no": "Ko'pincha g ≈ 2 atrofida. ZFS kichik bo'lsa yaxshi ko'rinadi; biologik va material namunalarda ko'p uchraydi.",
  },
  {
    nom: "Fe³⁺ / Co²⁺ yuqori-spin",
    signatura: "Katta anizotropiya, ba'zan g ≈ 4.3 yoki juda keng signal",
    "ma'no": "Katta ZFS va tez relaksatsiya sabab talqin ehtiyotkorlik bilan qilinadi; ba'zan yuqori chastota yoki past harorat kerak.",
  },
]

const noSignalReasons = [
  "S = 0 (barcha elektronlar juftlashgan) — klassik diamagnit holat.",
  "Integer-spin sistemada ZFS mikroto'lqin energiyasidan ancha katta bo'lib, X-bandda o'tishlar ko'rinmasligi.",
  "Relaksatsiya juda tez: chiziqlar haddan tashqari kengayib fon bilan qo'shilib ketadi.",
  "Exchange broadening yoki yuqori kontsentratsiya signalni yoyib yuboradi.",
  "Suv, tuz yoki o'tkazuvchan matritsa rezonator Q faktorini pasaytirib sezgirlikni tushiradi.",
  "Namuna oksidlanib/qaytarilib ketgan yoki kislorod ta'sirida spin markaz o'zgargan bo'lishi mumkin.",
]

const workflowSteps = [
  {
    step: "01",
    title: "Signal mavjudmi?",
    text: "Avval modda haqiqatan paramagnitmi, kontsentratsiya yetarlimi va apparat diapazoni to'g'rimi — shu uch savol tekshiriladi.",
  },
  {
    step: "02",
    title: "g qiymatini o'qing",
    text: "g pozitsiyasi elektronning orbital tabiati va koordinatsion muhitini ko'rsatadi. g ning 2 dan og'ishi spin-orbital coupling kuchi bilan bog'liq.",
  },
  {
    step: "03",
    title: "Hiperfin tuzilmani ajrating",
    text: "Qancha chiziq bor, ular kimga tegishli: metall yadrosigami yoki ligand yadrolarigami? A kattaligi spin zichligi haqida gapiradi.",
  },
  {
    step: "04",
    title: "Linewidth va anisotropiyani tahlil qiling",
    text: "Keng chiziq — faqat yomon spektr emas; bu relaksatsiya, almashinish, dipolyar coupling yoki heterojenlik belgisi bo'lishi mumkin.",
  },
  {
    step: "05",
    title: "Harorat va holatni solishtiring",
    text: "Eritma ↔ muzlatilgan matritsa ↔ qattiq holat taqqoslansa izotrop va tensor parametrlar ajratiladi; spin crossover ham shu bosqichda bilinadi.",
  },
]

const advancedMethods = [
  {
    nom: "ENDOR",
    text: "EPR chiziqlari ichida ko'milib qolgan yadroviy couplinglarni aniq ajratadi; donor atom va bog'lanish tabiatini kuchli yoritadi.",
  },
  {
    nom: "ESEEM / HYSCORE",
    text: "Yadroga yaqin, ammo CW EPR da to'liq ko'rinmaydigan zaif couplinglarni chiqaradi; N, H, P kabi yadrolar haqida nozik ma'lumot beradi.",
  },
  {
    nom: "DEER / PELDOR",
    text: "Ikki spin markazi orasidagi nanometr masofani o'lchaydi; supramolekulyar va bioanorganik sistemalar uchun juda foydali.",
  },
  {
    nom: "Rapid-scan / high-field EPR",
    text: "Keng chiziqlar, kuchli anizotropiya va yaxshi rezolyutsiya kerak bo'lgan holatlarda an'anaviy CW dan ustun bo'lishi mumkin.",
  },
]

const applications = [
  "Cu, V, Mn, Fe, Co markazli koordinatsion komplekslarning geometriyasi va oksidlanish darajasini aniqlash",
  "Katalitik sikllarda qisqa yashovchi radikal yoki metall-intermediatlarni ushlash",
  "Metalloproteinlar, ROS/RNS, spin-label va membrana dinamika tadqiqotlari",
  "Kristall nuqsonlari, yarimo'tkazgich tuzoqlari va oksidlar sirt markazlarini tahlil qilish",
  "Single-molecule magnet, spin crossover va almashinishli klasterlar magnit xossalarini tushuntirish",
]

const references = [
  {
    title: "Chemistry LibreTexts — EPR Theory",
    href: "https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Spectroscopy/Magnetic_Resonance_Spectroscopies/Electron_Paramagnetic_Resonance/EPR_-_Theory",
  },
  {
    title: "Chemistry LibreTexts — Hyperfine Splitting",
    href: "https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Spectroscopy/Magnetic_Resonance_Spectroscopies/Electron_Paramagnetic_Resonance/Hyperfine_Splitting",
  },
  {
    title: "LibreTexts (Jenschke) — Zero-field interaction",
    href: "https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Electron_Paramagnetic_Resonance_(Jenschke)/05%3A_Electron-Electron_Interactions/5.03%3A_Zero-field_interaction",
  },
  {
    title: "Bruker — EPR 101",
    href: "https://www.bruker.com/en/resources/library/application-notes-mr/epr-101.html",
  },
  {
    title: "LibreTexts — EPR Spectroscopy (Barron)",
    href: "https://chem.libretexts.org/Bookshelves/Analytical_Chemistry/Physical_Methods_in_Chemistry_and_Nano_Science_(Barron)/04%3A_Chemical_Speciation/4.08%3A_EPR_Spectroscopy",
  },
]

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="space-y-2">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.25em] text-purple-400">{eyebrow}</p> : null}
      <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
      {subtitle ? <p className="text-sm md:text-base text-purple-200 max-w-4xl leading-relaxed">{subtitle}</p> : null}
    </div>
  )
}

function Pill({ children, tone = "lime" }) {
  const tones = {
    lime: "bg-lime-600/15 text-lime-300 border-lime-500/30",
    purple: "bg-purple-600/15 text-purple-200 border-purple-500/30",
    yellow: "bg-yellow-500/15 text-yellow-200 border-yellow-500/30",
    blue: "bg-blue-600/15 text-blue-200 border-blue-500/30",
  }

  return <span className={`px-3 py-1 rounded-full border text-xs ${tones[tone]}`}>{children}</span>
}

function ResonanceWorkbench() {
  const [freq, setFreq] = useState(9.5)
  const [g, setG] = useState(2.0023)

  const h = 6.62607015e-34
  const muB = 9.2740100783e-24
  const Btesla = (h * freq * 1e9) / (g * muB)
  const Bgauss = Btesla * 1e4
  const energyCm = freq * 0.03335641
  const closestBand = microwaveBands.reduce((best, band) =>
    Math.abs(band.freq - freq) < Math.abs(best.freq - freq) ? band : best
  )

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="interaktiv modul"
        title="Rezonans sharti: hν = gμB B"
        subtitle="EPR da chastota, magnit maydon va g qiymati bir-biriga qattiq bog'langan. g oshsa, rezonans maydoni kamayadi; chastota oshsa, kerakli maydon ortadi. Bu oddiy formula butun spektr talqinining skeletidir."
      />

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5">
        <div className="v3-panel-karta p-5 space-y-4">
          <div className="bg-purple-950/60 border border-lime-500/20 rounded-xl p-4 text-center font-mono">
            <p className="text-purple-400 text-xs mb-2">Rezonans tenglamasi</p>
            <p className="text-lime-400 text-2xl">hν = g · μB · B</p>
            <p className="text-purple-300 text-xs mt-2">g ≈ ν / (13.996 · B[T])</p>
          </div>

          <div>
            <label className="flex justify-between text-xs mb-2 text-purple-200">
              <span>Mikroto'lqin chastotasi ν</span>
              <span className="text-lime-300 font-mono">{freq.toFixed(1)} GHz</span>
            </label>
            <input
              type="range"
              min="1"
              max="95"
              step="0.5"
              value={freq}
              onChange={(e) => setFreq(parseFloat(e.target.value))}
              className="w-full accent-lime-500"
            />
          </div>

          <div>
            <label className="flex justify-between text-xs mb-2 text-purple-200">
              <span>g-faktor</span>
              <span className="text-lime-300 font-mono">{g.toFixed(4)}</span>
            </label>
            <input
              type="range"
              min="1.80"
              max="4.50"
              step="0.0005"
              value={g}
              onChange={(e) => setG(parseFloat(e.target.value))}
              className="w-full accent-lime-500"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <div className="bg-lime-600/10 border border-lime-500/30 rounded-xl p-4">
              <p className="text-lime-300 text-xs">Rezonans maydoni</p>
              <p className="text-white font-bold text-2xl font-mono">{Bgauss.toFixed(0)}</p>
              <p className="text-purple-300 text-xs">G</p>
            </div>
            <div className="bg-purple-950/50 border border-purple-700/40 rounded-xl p-4">
              <p className="text-purple-300 text-xs">Tesla</p>
              <p className="text-white font-bold text-2xl font-mono">{Btesla.toFixed(4)}</p>
              <p className="text-purple-300 text-xs">T</p>
            </div>
            <div className="bg-purple-950/50 border border-purple-700/40 rounded-xl p-4">
              <p className="text-purple-300 text-xs">hν energiya</p>
              <p className="text-white font-bold text-2xl font-mono">{energyCm.toFixed(3)}</p>
              <p className="text-purple-300 text-xs">cm⁻¹</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-lime-600/10 to-purple-900/40 border border-lime-500/20 rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-sm text-white font-semibold">Yaqin diapazon</p>
            <p className="text-lime-300 text-xl font-bold">{closestBand.name}</p>
          </div>
          <div className="space-y-2 text-sm text-purple-200 leading-relaxed">
            <p>
              <span className="text-yellow-300 font-semibold">Amaliy ma'no:</span> ayni diapazon {closestBand.afzallik.toLowerCase()}.
            </p>
            <p>
              <span className="text-yellow-300 font-semibold">Cheklov:</span> {closestBand.cheklov}.
            </p>
            <p>
              <span className="text-yellow-300 font-semibold">Talqin:</span> bir xil markazni Q yoki W-bandga ko'tarsangiz g-anizotropiya ko'pincha yaxshiroq ajraladi.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill tone="lime">g oshsa → B kamayadi</Pill>
            <Pill tone="purple">ν oshsa → B ortadi</Pill>
            <Pill tone="yellow">X-band ≈ 0.317 cm⁻¹</Pill>
          </div>
        </div>
      </div>
    </div>
  )
}

function pascalRow(n) {
  const row = [1]
  for (let k = 1; k <= n; k += 1) {
    row[k] = Math.round((row[k - 1] * (n - k + 1)) / k)
  }
  return row
}

function HyperfineWorkbench() {
  const [nuclei, setNuclei] = useState(3)
  const [I, setI] = useState(0.5)
  const [A, setA] = useState(16)
  const [linewidth, setLinewidth] = useState(5)

  const lines = Math.round(2 * nuclei * I + 1)
  const intensities = I === 0.5 ? pascalRow(nuclei) : Array.from({ length: lines }, () => 1)
  const maxIntensity = Math.max(...intensities)

  const spectrum = useMemo(() => {
    const pts = []
    const center = 3390
    const totalWidth = Math.max(180, lines * A * 1.2)
    const positions = Array.from({ length: lines }, (_, idx) => center + (idx - (lines - 1) / 2) * A)

    for (let i = 0; i < 500; i += 1) {
      const x = center - totalWidth / 2 + (i / 499) * totalWidth
      let absorb = 0
      positions.forEach((pos, idx) => {
        const amp = intensities[idx]
        absorb += amp * Math.exp(-0.5 * ((x - pos) / linewidth) ** 2)
      })
      pts.push({ x, absorb })
    }

    const deriv = pts.map((pt, idx) => {
      const next = pts[idx + 1] || pt
      return { x: pt.x, deriv: (next.absorb - pt.absorb) * 20 }
    })

    return { pts, deriv, positions }
  }, [A, I, linewidth, lines, nuclei, intensities])

  const derivMax = Math.max(...spectrum.deriv.map((p) => Math.abs(p.deriv)), 0.01)

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="interaktiv modul"
        title="Gipernozik va supergipernozik tuzilma"
        subtitle="Bir juftlashmagan elektron yaqinidagi yadrolar bilan o'zaro ta'sirlashganda EPR chiziqlari mayda bo'linadi. Bu bo'linish elektron spin zichligi qayerda joylashganini ko'rsatadi. S = 1/2 uchun birinchi tartib tanlanish qoidasi odatda ΔmS = ±1, ΔmI = 0 bo'ladi."
      />

      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-5">
        <div className="v3-panel-karta p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="flex justify-between text-xs mb-2 text-purple-200">
                <span>Ekvivalent yadrolar soni (n)</span>
                <span className="text-lime-300 font-mono">{nuclei}</span>
              </label>
              <input type="range" min="1" max="6" step="1" value={nuclei} onChange={(e) => setNuclei(parseInt(e.target.value))} className="w-full accent-lime-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-2 text-purple-200">
                <span>Yadro spini (I)</span>
                <span className="text-lime-300 font-mono">{I}</span>
              </label>
              <select value={I} onChange={(e) => setI(parseFloat(e.target.value))} className="w-full bg-purple-950/70 border border-purple-700 rounded-xl px-3 py-2 text-sm text-white">
                <option value="0.5">1/2 (¹H, ³¹P, ¹⁹F)</option>
                <option value="1">1 (¹⁴N, ²H)</option>
                <option value="1.5">3/2 (⁶³Cu, ⁶⁵Cu)</option>
                <option value="2.5">5/2 (⁵⁵Mn)</option>
                <option value="3.5">7/2 (⁵¹V, ⁵⁹Co)</option>
              </select>
            </div>
            <div>
              <label className="flex justify-between text-xs mb-2 text-purple-200">
                <span>A coupling</span>
                <span className="text-lime-300 font-mono">{A} G</span>
              </label>
              <input type="range" min="2" max="60" step="1" value={A} onChange={(e) => setA(parseInt(e.target.value))} className="w-full accent-lime-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-2 text-purple-200">
                <span>Chiziq kengligi</span>
                <span className="text-lime-300 font-mono">{linewidth} G</span>
              </label>
              <input type="range" min="2" max="20" step="0.5" value={linewidth} onChange={(e) => setLinewidth(parseFloat(e.target.value))} className="w-full accent-lime-500" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <div className="bg-lime-600/10 border border-lime-500/30 rounded-xl p-3">
              <p className="text-lime-300 text-xs">Kutilgan chiziqlar</p>
              <p className="text-white text-2xl font-bold">{lines}</p>
              <p className="text-purple-300 text-xs">2nI + 1</p>
            </div>
            <div className="bg-purple-950/50 border border-purple-700/40 rounded-xl p-3">
              <p className="text-purple-300 text-xs">Ajralish</p>
              <p className="text-white text-2xl font-bold">{A}</p>
              <p className="text-purple-300 text-xs">G</p>
            </div>
            <div className="bg-purple-950/50 border border-purple-700/40 rounded-xl p-3">
              <p className="text-purple-300 text-xs">Izoh</p>
              <p className="text-white text-sm font-semibold">{I === 0.5 ? "Pascal" : "ko'p-sathli"}</p>
              <p className="text-purple-300 text-xs">intensivlik modeli</p>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm text-purple-100 leading-relaxed">
            <p><span className="text-yellow-300 font-semibold">Muhim eslatma:</span> bitta yadroning oddiy holatida chiziqlar soni 2I + 1. n ta ekvivalent yadro bo'lsa, birinchi tartib limitda chiziqlar soni 2nI + 1 bo'ladi. I = 1/2 uchun intensivliklar Pascal uchburchagi bo'yicha ketadi.</p>
          </div>
        </div>

        <div className="v3-panel-karta p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-white font-semibold">Simulyatsiya: absorbsiya va birinchi hosila</p>
            <div className="flex flex-wrap gap-2">
              <Pill tone="blue">CW EPR odatda derivative ko'rsatadi</Pill>
              <Pill tone="purple">A kattalashsa chiziqlar uzoqlashadi</Pill>
            </div>
          </div>

          <svg viewBox="0 0 520 240" className="w-full h-64 rounded-xl bg-purple-950/50 border border-[var(--v3-chiziq)]">
            <line x1="40" y1="190" x2="490" y2="190" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="30" x2="40" y2="210" stroke="#4c1d95" strokeWidth="1" />
            <text x="265" y="228" textAnchor="middle" fill="#c4b5fd" fontSize="11">Magnit maydon B (G)</text>
            <text x="18" y="120" textAnchor="middle" transform="rotate(-90 18 120)" fill="#c4b5fd" fontSize="11">Signal</text>

            <polyline
              fill="none"
              stroke="#84cc16"
              strokeWidth="2"
              points={spectrum.pts.map((p, idx) => `${40 + (idx / 499) * 450},${185 - (p.absorb / maxIntensity) * 85}`).join(" ")}
            />
            <polyline
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2"
              points={spectrum.deriv.map((p, idx) => `${40 + (idx / 499) * 450},${110 - (p.deriv / derivMax) * 55}`).join(" ")}
            />

            {spectrum.positions.map((pos, idx) => {
              const x = 40 + ((pos - spectrum.pts[0].x) / (spectrum.pts[spectrum.pts.length - 1].x - spectrum.pts[0].x)) * 450
              return <line key={idx} x1={x} y1="40" x2={x} y2="190" stroke="#fbbf24" strokeDasharray="4 4" strokeWidth="1" opacity="0.6" />
            })}
          </svg>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/40">
              <p className="text-lime-300 font-semibold mb-2">Intensivlik modeli</p>
              <p className="text-purple-200">
                {I === 0.5
                  ? `n = ${nuclei} uchun nisbiy intensivliklar: ${intensities.join(":")}.`
                  : `I = ${I} bo'lgani uchun bu modul faqat chiziqlar sonini birinchi tartib limitda ko'rsatadi; haqiqiy intensivliklar yanada murakkab bo'lishi mumkin.`}
              </p>
            </div>
            <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/40">
              <p className="text-lime-300 font-semibold mb-2">Kimyoviy talqin</p>
              <p className="text-purple-200">A kattaligi odatda yadroda spin zichligi ortishini bildiradi. Metall A si va ligand supergipernozik ajralishi metall–ligand kovalentligini taqqoslashda juda foydali.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ZFSWorkbench() {
  const [D, setD] = useState(0.35)
  const [E, setE] = useState(0.04)
  const [freq, setFreq] = useState(9.5)

  const maxEAllowed = Math.abs(D) / 3
  const safeE = Math.min(E, maxEAllowed)
  const ex = D / 3 + safeE
  const ey = D / 3 - safeE
  const ez = (-2 * D) / 3
  const hvCm = freq * 0.03335641
  const ratio = Math.abs(D) / hvCm

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="interaktiv modul"
        title="ZFS: yuqori-spin sistemalarning kaliti"
        subtitle="S ≥ 1 bo'lganda nol maydonda ham sathlar ajralishi mumkin. Bu ayniqsa triplet holatlar, Mn, Fe, Co, Ni markazlari va single-molecule magnetlar talqinida juda muhim. Quyidagi diagramma S = 1 triplet uchun sxematik ko'rinish beradi."
      />

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5">
        <div className="v3-panel-karta p-5 space-y-4">
          <div className="bg-purple-950/60 border border-lime-500/20 rounded-xl p-4 text-center font-mono">
            <p className="text-purple-400 text-xs mb-2">Triplet (S = 1) uchun</p>
            <p className="text-lime-400 text-sm">Ĥ = D[Sz² − 2/3] + E(Sx² − Sy²)</p>
          </div>

          <div>
            <label className="flex justify-between text-xs mb-2 text-purple-200">
              <span>D (cm⁻¹)</span>
              <span className="text-lime-300 font-mono">{D.toFixed(3)}</span>
            </label>
            <input type="range" min="-1.20" max="1.20" step="0.01" value={D} onChange={(e) => setD(parseFloat(e.target.value))} className="w-full accent-lime-500" />
          </div>

          <div>
            <label className="flex justify-between text-xs mb-2 text-purple-200">
              <span>E (cm⁻¹)</span>
              <span className="text-lime-300 font-mono">{safeE.toFixed(3)}</span>
            </label>
            <input type="range" min="0" max={Math.max(maxEAllowed, 0.01)} step="0.005" value={safeE} onChange={(e) => setE(parseFloat(e.target.value))} className="w-full accent-lime-500" />
          </div>

          <div>
            <label className="flex justify-between text-xs mb-2 text-purple-200">
              <span>Spektrometr chastotasi</span>
              <span className="text-lime-300 font-mono">{freq.toFixed(1)} GHz</span>
            </label>
            <input type="range" min="3" max="95" step="0.5" value={freq} onChange={(e) => setFreq(parseFloat(e.target.value))} className="w-full accent-lime-500" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-lime-600/10 border border-lime-500/30 rounded-xl p-3">
              <p className="text-lime-300 text-xs">|D| / hν</p>
              <p className="text-white text-2xl font-bold">{ratio.toFixed(2)}</p>
              <p className="text-purple-300 text-xs">Xulosa uchun asosiy nisbat</p>
            </div>
            <div className="bg-purple-950/50 border border-purple-700/40 rounded-xl p-3">
              <p className="text-purple-300 text-xs">E/D</p>
              <p className="text-white text-2xl font-bold">{Math.abs(D) > 0 ? (safeE / Math.abs(D)).toFixed(2) : "0.00"}</p>
              <p className="text-purple-300 text-xs">0 → aksial, 1/3 → maksimal rombik</p>
            </div>
          </div>
        </div>

        <div className="v3-panel-karta p-5 space-y-4">
          <svg viewBox="0 0 520 240" className="w-full h-64 rounded-xl bg-purple-950/50 border border-[var(--v3-chiziq)]">
            <line x1="70" y1="25" x2="70" y2="210" stroke="#4c1d95" strokeWidth="1" />
            <line x1="70" y1="118" x2="485" y2="118" stroke="#6d28d9" strokeDasharray="4 4" strokeWidth="1" />
            <text x="22" y="120" transform="rotate(-90 22 120)" fill="#c4b5fd" fontSize="11">Energiya</text>
            <text x="270" y="22" textAnchor="middle" fill="#84cc16" fontSize="12" fontWeight="700">Triplet sathlari (S = 1)</text>
            {[
              { label: "Tx", value: ex, color: "#84cc16" },
              { label: "Ty", value: ey, color: "#60a5fa" },
              { label: "Tz", value: ez, color: "#fbbf24" },
            ].map((level, idx) => {
              const scale = 70 / Math.max(Math.abs(ex), Math.abs(ey), Math.abs(ez), 0.1)
              const y = 118 - level.value * scale
              return (
                <g key={idx}>
                  <line x1="120" y1={y} x2="430" y2={y} stroke={level.color} strokeWidth="4" />
                  <text x="108" y={y + 4} textAnchor="end" fill={level.color} fontSize="12" fontWeight="700">{level.label}</text>
                  <text x="442" y={y + 4} fill="#e9d5ff" fontSize="11">{level.value.toFixed(3)} cm⁻¹</text>
                </g>
              )
            })}
          </svg>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/40">
              <p className="text-lime-300 font-semibold mb-2">Qachon ZFS hal qiluvchi bo'ladi?</p>
              <p className="text-purple-200">Agar |D| mikroto'lqin energiyasi bilan taqqoslanarli yoki undan katta bo'lsa, odatiy yuqori-maydon yaqinlashuvi zaiflashadi va spektrni soddalashtirib talqin qilish xavfli bo'ladi.</p>
            </div>
            <div className="bg-purple-950/50 rounded-xl p-4 border border-purple-700/40">
              <p className="text-lime-300 font-semibold mb-2">EPR silent ko'rinishi</p>
              <p className="text-purple-200">Ayniqsa integer-spin sistemalarda katta ZFS sabab X-bandda signal yo'qdek ko'rinishi mumkin. Bu modda diamagnit degani emas; yuqori chastota yoki boshqacha harorat rejimi kerak bo'lishi mumkin.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InterpretationWorkbench() {
  const [active, setActive] = useState(1)
  const current = speciesGuide[active]

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="talqin laboratoriyasi"
        title="Spektrni qanday o'qiymiz?"
        subtitle="EPR da biror bitta cho'qqi hech qachon alohida o'qilmaydi. g, hiperfin, ZFS, linewidth va temperaturaga bog'liqlik birgalikda ko'riladi. Quyidagi modul keng tarqalgan markazlar uchun diagnostik signaturalarni jamlaydi."
      />

      <div className="grid lg:grid-cols-[0.72fr_1.28fr] gap-5">
        <div className="v3-panel-karta p-5 space-y-3">
          {speciesGuide.map((item, idx) => (
            <button
              key={item.nom}
              onClick={() => setActive(idx)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                active === idx
                  ? "bg-lime-600/15 border-lime-500/40 shadow-lg shadow-lime-900/20"
                  : "bg-purple-950/40 border-purple-700/40 hover:bg-purple-900/50"
              }`}
            >
              <p className="text-white font-semibold">{item.nom}</p>
              <p className="text-xs text-purple-300 mt-1">{item.signatura}</p>
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-950/60 border border-lime-500/20 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Pill tone="lime">Diagnostik markaz</Pill>
            <Pill tone="blue">{current.signatura}</Pill>
          </div>
          <h3 className="text-2xl font-bold text-white">{current.nom}</h3>
          <p className="text-purple-100 leading-relaxed">{current["ma'no"]}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-950/50 rounded-xl border border-purple-700/40 p-4">
              <p className="text-lime-300 font-semibold mb-2">Nimani tekshirasiz?</p>
              <ul className="space-y-2 text-sm text-purple-200 list-disc pl-5">
                <li>Signal izotropmi yoki tensorli ko'rinish bormi?</li>
                <li>Metall yadro va ligand yadrolari bo'yicha splitting ajraladimi?</li>
                <li>Harorat pasayganda signal kuchayadimi yoki kengayadimi?</li>
                <li>Q-band/W-band ga o'tganda g komponentlar ochiladimi?</li>
              </ul>
            </div>
            <div className="bg-purple-950/50 rounded-xl border border-purple-700/40 p-4">
              <p className="text-lime-300 font-semibold mb-2">Eng ko'p xato qilinadigan nuqta</p>
              <p className="text-sm text-purple-200">Birgina g qiymatidan geometriyani qat'iy aytib yuborish. To'g'ri talqin uchun g bilan birga A, linewidth, namuna holati va boshqa usullar (UV-Vis, magnit, XRD) ham ko'rilishi kerak.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EPRSpektroskopiya() {
  const [fonKaliti, fonniOzgartir] = useFon();
  return (
    <div data-fon={fonKaliti} className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-purple-950/70 border-b border-[var(--v3-chiziq)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <Link href="/ilmiy/tahlil" className="text-purple-300 hover:text-white transition-colors">
              ← Tahlil usullari
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-lime-400"> EPR spektroskopiya</h1>
              <p className="text-sm text-purple-300">Elektron Paramagnit Rezonans • g-tensor • hiperfin • ZFS • CW va pulse EPR</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill tone="lime">Nazariya + talqin</Pill>
            <Pill tone="purple">O'zbekcha ilmiy sahifa</Pill>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14 space-y-10">
        <div className="grid xl:grid-cols-[1.18fr_0.82fr] gap-6 items-stretch">
          <div className="relative overflow-hidden rounded-3xl border border-lime-500/20 bg-gradient-to-br from-lime-600/10 via-purple-900/55 to-purple-950/80 p-7 md:p-9">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(132,204,22,0.16),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.12),transparent_28%)]" />
            <div className="relative space-y-5">
              <div className="flex flex-wrap gap-2">
                <Pill tone="lime">Paramagnit markazlar uchun eng bevosita usul</Pill>
                <Pill tone="yellow">g, A, D, E ni bir sahifada yig'adi</Pill>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white">
                EPR sahifasi endi <span className="text-lime-400">nazariy jihatdan to'liqroq</span>,
                talqin nuqtai nazaridan esa ancha chuqurroq.
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-purple-100 max-w-3xl">
                Bu sahifa EPR ni faqat “toq elektron bor-yo'qligi” bilan cheklamaydi. Endi unda rezonans sharti,
                samarali spin Hamiltoniani, g-tensor, hiperfin va supergipernozik coupling, zero-field splitting,
                CW va pulse EPR farqi, tipik o'tish-metall signaturalari, namuna tayyorlash va talqin algoritmi
                bir butun ilmiy hikoya sifatida beriladi.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-2xl border border-purple-700/40 bg-purple-950/45 p-4">
                  <p className="text-purple-300 text-xs uppercase tracking-[0.2em]">Asosiy tenglama</p>
                  <p className="text-lime-400 font-bold text-xl mt-2">hν = gμB B</p>
                </div>
                <div className="rounded-2xl border border-purple-700/40 bg-purple-950/45 p-4">
                  <p className="text-purple-300 text-xs uppercase tracking-[0.2em]">Tanlanish qoidasi</p>
                  <p className="text-lime-400 font-bold text-xl mt-2">ΔmS = ±1</p>
                </div>
                <div className="rounded-2xl border border-purple-700/40 bg-purple-950/45 p-4">
                  <p className="text-purple-300 text-xs uppercase tracking-[0.2em]">Nazariy markaz</p>
                  <p className="text-lime-400 font-bold text-xl mt-2">Spin Hamiltonian</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-1 gap-4">
            {quickFacts.map((item) => (
              <div key={item.title} className="rounded-2xl border border-purple-700/40 bg-purple-900/40 p-5">
                <p className="text-purple-300 text-xs uppercase tracking-[0.2em]">{item.title}</p>
                <p className="text-lime-400 font-bold text-2xl mt-2">{item.value}</p>
                <p className="text-sm text-purple-100 mt-2 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/ilmiy/tahlil/epr/birikmalar"
          className="group block rounded-3xl border border-lime-500/25 bg-gradient-to-r from-lime-600/10 to-purple-900/50 p-6 hover:border-lime-400/40 hover:shadow-xl hover:shadow-lime-900/20 transition-all"
        >
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-purple-300">bog'langan sahifa</p>
              <h3 className="text-2xl font-bold text-lime-400 group-hover:text-lime-300">Birikmalarning EPR tahlili</h3>
              <p className="text-sm text-purple-100 max-w-3xl">Umumiy nazariyani shu sahifada berib, alohida birikmalar sahifasida Cu²⁺, Fe³⁺, Cr³⁺, Co²⁺, Mn²⁺ va boshqa markazlarning konkret spektr imzolariga o'tish eng to'g'ri tuzilma bo'ladi.</p>
            </div>
            <div className="text-3xl text-lime-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
        </Link>

        <div className="rounded-3xl border border-purple-700/40 bg-purple-900/35 p-7 space-y-6">
          <SectionTitle
            eyebrow="nazariy karkas"
            title="EPR ni to'liq yoritadigan asosiy bloklar"
            subtitle="Sahifa endi foydalanuvchi ko'zi bilan emas, spektroskopist tafakkuri bilan qurilgan: fizik asos → matematik model → spektr parametrlari → amaliy talqin → cheklovlar → ilg'or usullar."
          />
          <div className="grid md:grid-cols-2 gap-4">
            {theoryBlocks.map((block) => (
              <div key={block.title} className="rounded-2xl border border-purple-700/35 bg-purple-950/45 p-5">
                <h3 className="text-lg font-bold text-lime-400">{block.title}</h3>
                <p className="text-sm text-purple-100 mt-3 leading-relaxed">{block.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-purple-700/40 bg-purple-900/35 p-7 space-y-6">
          <SectionTitle
            eyebrow="kalit parametrlar"
            title="Spektrdan olinadigan ilmiy axborot"
            subtitle="EPR talqinida eng katta xato — g ni alohida, A ni alohida, linewidth ni alohida ko'rish. Aslida ularning barchasi bitta magnit modelning turli ko'rinishlari."
          />
          <div className="grid md:grid-cols-2 gap-4">
            {parameterCards.map((item) => (
              <div key={item.nom} className="rounded-2xl border border-lime-500/15 bg-gradient-to-br from-purple-950/55 to-purple-900/35 p-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Pill tone="lime">{item.nom}</Pill>
                  <Pill tone="purple">{item.formula}</Pill>
                </div>
                <p className="text-sm text-purple-100 leading-relaxed">{item.mazmun}</p>
                <p className="text-sm text-lime-300 mt-3"><span className="font-semibold">Nega muhim:</span> {item.ahamiyat}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-purple-700/40 bg-purple-900/35 p-7">
          <ResonanceWorkbench />
        </div>

        <div className="grid xl:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-purple-700/40 bg-purple-900/35 p-7">
            <HyperfineWorkbench />
          </div>
          <div className="rounded-3xl border border-purple-700/40 bg-purple-900/35 p-7">
            <ZFSWorkbench />
          </div>
        </div>

        <div className="rounded-3xl border border-purple-700/40 bg-purple-900/35 p-7">
          <InterpretationWorkbench />
        </div>

        <div className="grid xl:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-purple-700/40 bg-purple-900/35 p-7 space-y-6">
            <SectionTitle
              eyebrow="eksperimental mantiq"
              title="CW EPR va pulse EPR: qaysi biri nimani beradi?"
              subtitle="Nazariy sahifa foydalanuvchiga shu ikkisini aniq ajratib berishi kerak. CW — rutinali interpretatsiya; pulse — chuqur strukturaviy va dinamik ma'lumot."
            />
            <div className="space-y-4">
              {cwVsPulse.map((item) => (
                <div key={item.nom} className="rounded-2xl border border-purple-700/35 bg-purple-950/45 p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Pill tone={item.nom === "CW EPR" ? "lime" : "blue"}>{item.nom}</Pill>
                    <Pill tone="purple">{item.qachon}</Pill>
                  </div>
                  <p className="text-sm text-purple-100 leading-relaxed">{item.nima}</p>
                  <p className="text-sm text-lime-300 mt-3"><span className="font-semibold">Kuchli tomoni:</span> {item.kuchli}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-purple-700/40 bg-purple-900/35 p-7 space-y-6">
            <SectionTitle
              eyebrow="amaliy diagnostika"
              title="Signal ko'rinmasa, darrov xulosa chiqarmang"
              subtitle="EPR signal yo'qligi har doim diamagnitlikni anglatmaydi. Ayniqsa yuqori-spin va katta ZFS sistemalarda bu juda muhim ogohlantirish."
            />
            <div className="rounded-2xl border border-yellow-500/25 bg-yellow-500/10 p-5">
              <ul className="space-y-3 text-sm text-purple-100 list-disc pl-5">
                {noSignalReasons.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-purple-700/35 bg-purple-950/45 p-5">
              <p className="text-lime-300 font-semibold mb-2">Namuna tayyorlash bo'yicha qisqa chek-list</p>
              <ul className="space-y-2 text-sm text-purple-200 list-disc pl-5">
                <li>Eritma EPR uchun xona haroratida izotrop, muzlatilganda esa tensor ma'lumot berishini oldindan biling.</li>
                <li>Kontsentratsiyani juda oshirib yubormang — dipolyar va exchange broadening kuchayadi.</li>
                <li>Kislorod, suv va o'tkazuvchan matritsa rezonator sifatiga ta'sir qilishi mumkin.</li>
                <li>Quantitativ tahlilda double integration va standart namuna bilan taqqoslashni unutmang.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-purple-700/40 bg-purple-900/35 p-7 space-y-6">
          <SectionTitle
            eyebrow="talqin algoritmi"
            title="Bosqichma-bosqich spektr o'qish sxemasi"
            subtitle="Talabaga ham, tadqiqotchiga ham bir xil foydali bo'ladigan qisqa algoritm: EPR spektr ko'rilganda fikr yuritish aynan shu tartibda ketishi kerak."
          />
          <div className="grid md:grid-cols-5 gap-4">
            {workflowSteps.map((item) => (
              <div key={item.step} className="rounded-2xl border border-lime-500/15 bg-gradient-to-b from-purple-950/55 to-purple-900/35 p-4">
                <p className="text-lime-400 text-2xl font-bold">{item.step}</p>
                <h3 className="text-white font-semibold mt-3">{item.title}</h3>
                <p className="text-sm text-purple-200 mt-2 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-6">
          <div className="rounded-3xl border border-purple-700/40 bg-purple-900/35 p-7 space-y-6">
            <SectionTitle
              eyebrow="tipik markazlar"
              title="Ko'p uchraydigan EPR signaturalari"
              subtitle="Bular qat'iy identifikator emas, ammo sahifada bunday orientirlar bo'lsa foydalanuvchi spektrni tezroq tanib oladi va noto'g'ri umumlashtirish kamayadi."
            />
            <div className="space-y-4">
              {speciesGuide.map((item) => (
                <div key={item.nom} className="rounded-2xl border border-purple-700/35 bg-purple-950/45 p-5">
                  <h3 className="text-lg font-bold text-lime-400">{item.nom}</h3>
                  <p className="text-sm text-purple-200 mt-2"><span className="text-white font-semibold">Spektr ko'rinishi:</span> {item.signatura}</p>
                  <p className="text-sm text-purple-100 mt-2 leading-relaxed">{item["ma'no"]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-purple-700/40 bg-purple-900/35 p-7 space-y-6">
            <SectionTitle
              eyebrow="ilg'or usullar"
              title="Nazariy sahifada tilga olinishi shart bo'lgan qo'shimcha EPR metodlari"
              subtitle={"Umumiy nazariya sahifasi foydalanuvchiga \"EPR faqat bitta spektr emas\" degan fikrni berishi kerak. Aynan shu bo'lim sahifani ilmiy darajada jonlantiradi."}
            />
            <div className="space-y-4">
              {advancedMethods.map((item) => (
                <div key={item.nom} className="rounded-2xl border border-purple-700/35 bg-purple-950/45 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill tone="blue">{item.nom}</Pill>
                  </div>
                  <p className="text-sm text-purple-100 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-purple-700/40 bg-gradient-to-br from-lime-600/10 to-purple-900/45 p-7 space-y-6">
          <SectionTitle
            eyebrow="qo'llanilish"
            title="Kompleks birikmalar kimyosida EPR nimani hal qiladi?"
            subtitle="Sahifa foydalanuvchini formuladan amaliyotga olib o'tishi kerak. Quyidagi qo'llanilishlar aynan kompleks birikmalar saytiga mos ravishda tanlandi."
          />
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {applications.map((item) => (
              <div key={item} className="rounded-2xl border border-lime-500/15 bg-purple-950/45 p-5 text-sm text-purple-100 leading-relaxed">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-purple-700/40 bg-purple-900/35 p-7 space-y-6">
          <SectionTitle
            eyebrow="adabiyot"
            title="Sahifa tayangan manbalar"
            subtitle="Quyidagi manbalar EPR nazariyasi, hiperfin splitting, ZFS va amaliy qo'llanilish bo'yicha sahifa matnini ilmiy jihatdan mustahkamlaydi."
          />
          <div className="grid md:grid-cols-2 gap-4">
            {references.map((item) => (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="rounded-2xl border border-purple-700/35 bg-purple-950/45 p-5 hover:border-lime-500/35 transition-colors">
                <p className="text-white font-semibold">{item.title}</p>
                <p className="text-sm text-purple-300 mt-2 break-all">{item.href}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-lime-500/20 bg-gradient-to-r from-lime-600/10 to-purple-600/10 p-7">
          <h2 className="text-2xl font-bold text-white mb-4"> Ushbu qayta yozilgan sahifaning asosiy yutug'i</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
            <div className="rounded-2xl bg-purple-950/45 border border-purple-700/35 p-4 text-purple-100">EPR endi faqat "toq elektron" darajasida emas, balki spin Hamiltonian darajasida tushuntiriladi.</div>
            <div className="rounded-2xl bg-purple-950/45 border border-purple-700/35 p-4 text-purple-100">g, A, D, E, linewidth va relaksatsiya o'zaro bog'liq ilmiy parametrlar sifatida ko'rsatiladi.</div>
            <div className="rounded-2xl bg-purple-950/45 border border-purple-700/35 p-4 text-purple-100">CW/pulse EPR, ilg'or metodlar va tipik o'tish-metall signaturalari qo'shildi.</div>
            <div className="rounded-2xl bg-purple-950/45 border border-purple-700/35 p-4 text-purple-100">Dizayn rang sxemasini saqlagan holda ancha jonli, modul-mantiqli va ilmiy chuqur ko'rinishga o'tdi.</div>
          </div>
        </div>

        <div className="flex justify-between pt-2 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd" className="px-6 py-3 border border-purple-500 rounded-2xl hover:bg-purple-800/50 text-purple-200 transition-colors">
            ← CD spektroskopiya
          </Link>
          <Link href="/ilmiy/tahlil/mossbauer" className="px-6 py-3 bg-lime-600/80 rounded-2xl hover:bg-lime-500 text-white font-semibold transition-colors">
            Mössbauer spektroskopiya →
          </Link>
        </div>
      </section>
    </div>
  )
}
