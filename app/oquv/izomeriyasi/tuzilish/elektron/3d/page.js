"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import DOrbitalDiagram from "./DOrbitalDiagram"

// ═══════════════════════════════════════════════════════════════════════════
// CPK RANGLARI
// ═══════════════════════════════════════════════════════════════════════════
const CPK = {
  Fe: 0xE06633, Co: 0xF090A0, Mn: 0x9C7AC7, Cu: 0xC88033, Ni: 0x50D050,
  Cr: 0x8A99C7, Ru: 0x248F8F,
  N: 0x3050F8, C: 0x909090, H: 0xFFFFFF, O: 0xFF0D0D,
  Cl: 0x1FF01F, S: 0xFFFF30,
  bond: 0x8B9DC3, highlight: 0xFFD700,
  spinUp: 0x66ffaa, spinDown: 0xff6688
}

// ═══════════════════════════════════════════════════════════════════════════
// FIZIK KONSTANTALAR
// ═══════════════════════════════════════════════════════════════════════════
const R_GAS = 8.314          // J/(mol·K)
const N_A = 6.022e23          // Avogadro
const K_B = 1.381e-23         // Boltzmann J/K
const T_ROOM = 298.15         // K
const H_PLANCK = 6.626e-34    // J·s
const C_LIGHT = 2.998e8       // m/s

// ═══════════════════════════════════════════════════════════════════════════
// ELEKTRON IZOMERLAR DATABASE
// ═══════════════════════════════════════════════════════════════════════════
const ELECTRONIC_ISOMERS = {

  // ── 1. Fe(II) SPIN-CROSSOVER — Klassik LS ↔ HS ──
  FeBpy: {
    id: "FeBpy",
    type: "spin_crossover",
    typeName: "Spin-krossover (SCO)",
    title: "[Fe(bpy)₃]²⁺ — LS/HS spin izomerlar",
    formula: "[Fe(bpy)₃]²⁺",
    description: "Temir(II) d⁶ tizimida past-spin (LS, S=0, diamagnit) va yuqori-spin (HS, S=2, paramagnit) holatlar orasidagi krossover. Bu 'elektron izomerlar' bir xil atomlar joylashuviga ega, ammo elektronlarning d-orbitallar bo'yicha taqsimoti tubdan farq qiladi.",
    metal: { element: "Fe", color: CPK.Fe, radius: 0.42, charge: "+2", d_electrons: 6, oxidation: 2 },
    ligand: { name: "2,2'-bipyridine (bpy)", type: "N-donor, bidentat", donor: "N" },
    states: {
      LS: {
        name: "Past-spin (LS)",
        nameEn: "Low-Spin",
        spin: 0, S: 0, unpaired: 0,
        magneticMoment: 0,
        magnetism: "Diamagnit",
        bondLength: 1.97, // Fe-N Å
        color: "Qizil (deep red)",
        colorHex: "#c8283a",
        wavelength: 522, // nm - MLCT
        t2g: 6, eg: 0,
        stability: "Past haroratda (T < T₁/₂) barqaror",
        deltaH: 15.0, // kJ/mol (LS → HS o'tish)
        volume: 435 // Å³
      },
      HS: {
        name: "Yuqori-spin (HS)",
        nameEn: "High-Spin",
        spin: 2, S: 2, unpaired: 4,
        magneticMoment: 4.90,  // μB, √(n(n+2)), n=4
        magnetism: "Paramagnit",
        bondLength: 2.19, // Fe-N Å (~10% uzunroq)
        color: "Rangsiz / och sariq",
        colorHex: "#f5e58a",
        wavelength: 850,
        t2g: 4, eg: 2,
        stability: "Yuqori haroratda (T > T₁/₂) barqaror",
        deltaH: 0,
        volume: 460
      }
    },
    T_half: 176, // K — o'tish harorati
    delta_o_LS: 21000, // cm⁻¹
    delta_o_HS: 12000, // cm⁻¹
    P_pairing: 17600, // cm⁻¹ (juftlik energiyasi)
    LIESST: {
      exists: true,
      wavelength: 532, // nm (yashil laser)
      T_LIESST: 78, // K
      reverseWavelength: 830 // nm (reverse-LIESST)
    },
    hysteresis: 40, // K
    discovery: "Spin-krossover hodisasini 1931-yilda L. Cambi va A. Cagnasso Fe(III)-dithiocarbamat komplekslarida birinchi bor kuzatishgan. Fe(bpy) tizimi 1964-yilda Baker va Bobonich tomonidan sistematik o'rganilgan.",
    LIESST_history: "1984-yilda Andreas Hauser (Bern universiteti) va Franz Renz LIESST hodisasini kashf qildilar — past haroratda LS holatga yorug'lik ta'sir qilinsa, u HS holatga o'tadi va uzoq muddat saqlanadi (metastabil).",
    applications: "Molekulyar switchlar, ma'lumot saqlash qurilmalari (spin-molecular memory), sensorlar, displey texnologiyalari, kvant informatika.",
    theory: "Ligand maydoni yorilishi (Δ_o) va spin juftlik energiyasi (P) orasidagi kurash. Δ_o > P bo'lsa LS; Δ_o < P bo'lsa HS. Krossover T da: G(LS) = G(HS), ya'ni ΔH = TΔS."
  },

  // ── 2. Robin-Day aralash valentli — Fe₂[Fe(CN)₆]₃ (Berlin ko'ki) ──
  PrussianBlue: {
    id: "PrussianBlue",
    type: "mixed_valence",
    typeName: "Aralash valentli (mixed-valence)",
    title: "Berlin ko'ki — Fe(II)/Fe(III) tarkib",
    formula: "Fe₄[Fe(CN)₆]₃",
    description: "Berlin ko'ki (Prussian Blue) — bir xil temir atomining ikki xil oksidlanish holatlarida (Fe²⁺ va Fe³⁺) bir vaqtda mavjud bo'lishi. CN⁻ ko'prigidan orqali intervalence charge transfer (IVCT) mumkin: Fe²⁺–CN–Fe³⁺ ↔ Fe³⁺–CN–Fe²⁺.",
    metal: { element: "Fe", color: CPK.Fe, radius: 0.42, charge: "+2/+3", d_electrons: "5/6", oxidation: "2/3" },
    ligand: { name: "CN⁻ (siano ko'prik)", type: "π-akseptor", donor: "C/N" },
    states: {
      FeII: {
        name: "Fe(II) — LS d⁶",
        nameEn: "Fe(II) center",
        spin: 0, S: 0, unpaired: 0,
        magneticMoment: 0,
        magnetism: "Diamagnit",
        bondLength: 1.92,
        color: "C-donor tomonda",
        colorHex: "#4488ff",
        t2g: 6, eg: 0,
        stability: "Kuchli π-akseptor CN⁻ LS ni majburlaydi"
      },
      FeIII: {
        name: "Fe(III) — HS d⁵",
        nameEn: "Fe(III) center",
        spin: 5/2, S: 5/2, unpaired: 5,
        magneticMoment: 5.92,
        magnetism: "Paramagnit",
        bondLength: 2.03,
        color: "N-donor tomonda",
        colorHex: "#a83232",
        t2g: 3, eg: 2,
        stability: "N-donor (kuchsiz maydon) — HS ni saqlaydi"
      }
    },
    T_half: null,
    RobinDay: "Class II — Fe(II) va Fe(III) markazlar farqli, ammo elektron ko'chib o'tishi mumkin (IVCT)",
    IVCT_wavelength: 700, // nm (kuchli qizil-yorug'lik yutilishi)
    color_intense: "Chuqur ko'k — IVCT bandi tufayli",
    discovery: "1704-yilda Berlinda tasodifan yaratilgan — bu insoniyat tarixidagi eng qadimgi sintetik pigmentlardan biri. 1970-yillarda uning tuzilishi Fe(II)-CN-Fe(III) ko'priklardan iborat ekanligi rentgen difraksiya bilan aniqlangan.",
    IVCT_history: "1967-yilda Melvin Robin va Peter Day aralash-valentli birikmalarni 3 sinfga tasnifladilar: Class I (izolyatsiyalangan), Class II (o'rtacha o'zaro ta'sir), Class III (to'liq delokalizatsiya).",
    applications: "Elektroxromik displeylar, batareylar (Na-ion, K-ion), sezuvchi elektrodlar, radiotsezium adsorbenti (Fukusima-dan keyin), rasm pigmenti.",
    theory: "IVCT bandi Marcus-Hush nazariyasi bilan tavsiflanadi. IVCT energiyasi: E_IVCT = λ (reorganizatsiya energiyasi). Class II uchun: 400 < ν(IVCT) < 12000 cm⁻¹."
  },

  // ── 3. Mn(III) — Jahn-Teller izomerlanish ──
  MnJT: {
    id: "MnJT",
    type: "jahn_teller",
    typeName: "Jahn-Teller izomerlanish",
    title: "[Mn(H₂O)₆]³⁺ — Jahn-Teller effekti",
    formula: "[Mn(H₂O)₆]³⁺",
    description: "Mn(III) d⁴ tizimi Jahn-Teller teoremasi bo'yicha buzilish beradi: 4 ekvatorial bog' qisqaradi (~2.00 Å), 2 aksial bog' uzayadi (~2.30 Å). Bu buzilish z-o'q bo'yicha yoki x-o'q bo'yicha bo'lishi mumkin — 3 xil elektron izomerlar!",
    metal: { element: "Mn", color: CPK.Mn, radius: 0.42, charge: "+3", d_electrons: 4, oxidation: 3 },
    ligand: { name: "H₂O (akva)", type: "O-donor, monodentat", donor: "O" },
    states: {
      z_elongated: {
        name: "z-aksial cho'ziq",
        nameEn: "z-elongated",
        spin: 2, S: 2, unpaired: 4,
        magneticMoment: 4.90,
        magnetism: "Paramagnit",
        bondLengthEq: 2.00,
        bondLengthAx: 2.30,
        color: "Qizil-binafsha",
        colorHex: "#983a68",
        stability: "Termodinamik afzal",
        distortion: "d_z² orbital eng past — eksial cho'zilish"
      },
      x_elongated: {
        name: "x-aksial cho'ziq",
        nameEn: "x-elongated",
        spin: 2, S: 2, unpaired: 4,
        magneticMoment: 4.90,
        magnetism: "Paramagnit",
        bondLengthEq: 2.00,
        bondLengthAx: 2.30,
        color: "Qizil-binafsha",
        colorHex: "#a83a68",
        stability: "Ekvivalent (Berry pseudorotation)",
        distortion: "d_x²-y² qismi cho'ziladi"
      },
      compressed: {
        name: "z-siqilgan",
        nameEn: "z-compressed",
        spin: 2, S: 2, unpaired: 4,
        magneticMoment: 4.90,
        magnetism: "Paramagnit",
        bondLengthEq: 2.15,
        bondLengthAx: 1.95,
        color: "Nadir hodisa",
        colorHex: "#c85a88",
        stability: "Kam uchraydi",
        distortion: "d_z² yuqori — kamdan-kam kuzatiladi"
      }
    },
    T_half: null,
    JT_energy: 25.0, // kJ/mol (stabilizatsiya)
    tunneling_barrier: 4.0, // kJ/mol (izomerlar orasidagi)
    discovery: "1937-yilda Hermann Jahn va Edward Teller UCL universitetida degeneratsiyalangan elektron holatlarning tabiati bo'yicha teorema yaratdilar. Mn(III) va Cu(II) — klassik JT ionlari.",
    JT_theorem: "Har qanday nolinorial molekulyar tizim orbital jihatdan degenerat holatda bo'lsa, u degeneratsiyani buzuvchi geometrik buzilishga uchraydi. Bu — molekulyar simmetriyaning avtomatik pasayishiga olib keladi.",
    applications: "Manganit LMO (LaMnO₃) — dvigatsimon rezistanslik (colossal magnetoresistance), MRI kontrast agentlar, ferroelektrik materiallar, magnit yozib olish.",
    theory: "Buzilish energiyasi: E_JT = ½k Q² − FQ, bu yerda Q — buzilish koordinatasi, F — vibron parametri. Mn(III) uchun tipik E_JT ≈ 25 kJ/mol."
  },

  // ── 4. Co-Dioksolat valentnost tautomeriya ──
  CoDiox: {
    id: "CoDiox",
    type: "valence_tautomerism",
    typeName: "Valentnost tautomeriya",
    title: "Co-dioksolat — Co(III)L_sq ⇌ Co(II)L_cat",
    formula: "[Co(3,5-DBSQ)(3,5-DBCat)(bpy)]",
    description: "'Redoks-noninnocent' ligand (3,5-di-tert-butilkatexol) metall bilan elektron almashishga qodir. Bir izomerda Co(III)-semikvinonat, boshqasida Co(II)-katexolat. Bu — kimyoning eng qiziqarli 'elektron shuntlash' hodisalaridan biri.",
    metal: { element: "Co", color: CPK.Co, radius: 0.42, charge: "+2/+3", d_electrons: "6/7", oxidation: "2/3" },
    ligand: { name: "3,5-DBQ (redoks-noninnocent)", type: "O,O'-donor, redoks-faol", donor: "O" },
    states: {
      LT_form: {
        name: "Past T shakl — Co(III)–Cat",
        nameEn: "Co(III)-Catecholate",
        spin: 0, S: 0, unpaired: 0,
        magneticMoment: 0,
        magnetism: "Diamagnit (LS d⁶)",
        bondLength: 1.89, // Co-O
        color: "To'q ko'k / binafsha",
        colorHex: "#3a3a95",
        oxidState: "Co(III) LS + Cat²⁻",
        stability: "Past haroratda barqaror (T < 300 K)"
      },
      HT_form: {
        name: "Yuqori T shakl — Co(II)–SQ",
        nameEn: "Co(II)-Semiquinonate",
        spin: 3/2, S: 3/2, unpaired: 3,
        magneticMoment: 3.87,
        magnetism: "Paramagnit (HS d⁷)",
        bondLength: 2.05,
        color: "Zangor / yashil",
        colorHex: "#5a9a55",
        oxidState: "Co(II) HS + SQ•⁻",
        stability: "Yuqori haroratda barqaror (T > 350 K)"
      }
    },
    T_half: 320, // K
    discovery: "1980-yilda Cortlandt Pierpont (Colorado) Co-dioksolat komplekslarida valentnost tautomerizmini kashf qildi. Bu — koordinatsion kimyoning yangi sohasini yaratdi.",
    photo_switching: "Optik nurlanish ostida Co(III)Cat → Co(II)SQ o'tish mumkin (yashil laser bilan). Bu LIESST-ga o'xshash foto-elektron izomerlanish.",
    applications: "Molekulyar switchlar, aqlli materiallar (smart materials), foto-magnit qurilmalar, protsessor xotira elementlari. Nature 2005 da 'switchable molecule'.",
    theory: "ΔH_LT→HT tayin ligand va metall orbitallar orasidagi HOMO-LUMO farqiga bog'liq. Ushbu tizim: ΔH ≈ 12 kJ/mol, ΔS ≈ 40 J/(mol·K)."
  },

  // ── 5. LIESST — Foto-inducirlangan spin o'zgarishi ──
  LIESST: {
    id: "LIESST",
    type: "photo_induced",
    typeName: "LIESST — foto-inducirlangan spin holati",
    title: "LIESST hodisasi — [Fe(ptz)₆]²⁺",
    formula: "[Fe(ptz)₆](BF₄)₂",
    description: "Light-Induced Excited Spin-State Trapping. Yorug'lik ta'sirida past haroratda LS holat HS holatga majburiy o'tadi va uzoq muddat metastabil holatda saqlanadi (soat-kunlab). Bu — molekulyar xotira uchun asos.",
    metal: { element: "Fe", color: CPK.Fe, radius: 0.42, charge: "+2", d_electrons: 6, oxidation: 2 },
    ligand: { name: "1-propyltetrazole (ptz)", type: "N-donor, monodentat", donor: "N" },
    states: {
      LS_ground: {
        name: "LS asosiy holat (¹A₁)",
        nameEn: "LS ¹A₁ ground state",
        spin: 0, S: 0, unpaired: 0,
        magneticMoment: 0,
        magnetism: "Diamagnit",
        bondLength: 1.99,
        color: "Rangsiz",
        colorHex: "#dddddd",
        wavelength: 532, // nm — MLCT excitation
        t2g: 6, eg: 0,
        stability: "T < 50 K da barqaror"
      },
      HS_metastable: {
        name: "HS metastabil (⁵T₂)",
        nameEn: "HS ⁵T₂ metastable",
        spin: 2, S: 2, unpaired: 4,
        magneticMoment: 4.90,
        magnetism: "Paramagnit",
        bondLength: 2.20,
        color: "Qizil (LIESST holatida)",
        colorHex: "#c94a4a",
        wavelength: 830, // nm — reverse-LIESST
        t2g: 4, eg: 2,
        stability: "T < T(LIESST)=50-60 K da soatlab saqlanadi",
        lifetime: "Bir necha soat—kun (past T da)"
      }
    },
    T_LIESST: 50,   // K — LIESST harorati
    T_half: 135,    // K — termik krossover
    forwardLaser: 532,  // nm (yashil, LS → HS)
    reverseLaser: 830,  // nm (IR, HS → LS)
    discovery: "1984-yilda Andreas Hauser (Bern universiteti, Şveytsariya) va uning gruppasi LIESST hodisasini birinchi bor kashf qildi va tavsifladi. 'Light-Induced Excited Spin State Trapping' atamasi shu paytdan boshlab qo'llaniladi.",
    applications: "Molekulyar xotira qurilmalari, optik switchlar, foto-magnit rejim, kvant kompyuter komponentlari, foto-litografiya, past haroratli sensorlar.",
    theory: "MLCT bandiga qo'zg'atish (¹A₁ → ¹MLCT) → ¹T₁ → ³T₁ → ⁵T₂ (HS) yakuniy holat. Aksincha, IR laser bilan HS holatdan ⁵E → ⁵T₂ orqali LS ga qaytish."
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Fe: { name: "Temir (Fe)", atomic: 26, mass: "55.85 u", config: "[Ar] 3d⁶ 4s²", role: "Markaziy ion (spin-krossover)", color: "#E06633" },
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁷ 4s²", role: "Redoks-faol markaz", color: "#F090A0" },
  Mn: { name: "Marganes (Mn)", atomic: 25, mass: "54.94 u", config: "[Ar] 3d⁵ 4s²", role: "Jahn-Teller ioni", color: "#9C7AC7" },
  Cu: { name: "Mis (Cu)", atomic: 29, mass: "63.55 u", config: "[Ar] 3d⁹", role: "d⁹ JT ioni", color: "#C88033" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "Ligand donor", hybridization: "sp²/sp³", color: "#3050F8" },
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.01 u", config: "[He] 2s² 2p²", role: "Ligand tarkibi / CN⁻", hybridization: "sp/sp²", color: "#909090" },
  O:  { name: "Kislorod (O)", atomic: 8, mass: "16.00 u", config: "[He] 2s² 2p⁴", role: "H₂O / dioksolat donor", hybridization: "sp³/sp²", color: "#FF0D0D" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "Ligand tarkibi", color: "#FFFFFF" }
}

const cleanText = (str) => {
  if (!str) return ""
  return String(str).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
}

// Spin only magnit moment
const spinOnlyMoment = (n) => Math.sqrt(n * (n + 2))

// Boltzmann taqsimoti ikki holat uchun
const twoStateBoltzmann = (deltaH_kJ, deltaS_JK, T) => {
  const deltaG = deltaH_kJ * 1000 - T * deltaS_JK  // J/mol
  const K = Math.exp(-deltaG / (R_GAS * T))
  const fracHS = K / (1 + K)
  return { LS: (1 - fracHS) * 100, HS: fracHS * 100 }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3D MATN SPRITE
// ═══════════════════════════════════════════════════════════════════════════
function makeTextSprite(text, options = {}) {
  const {
    fontSize = 64, fontFamily = "Arial, sans-serif",
    color = "#ffffff", bgColor = "rgba(20, 10, 40, 0.85)",
    borderColor = "#a78bfa", padding = 14, scale = 0.5
  } = options
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  const textWidth = ctx.measureText(text).width
  canvas.width = textWidth + padding * 2
  canvas.height = fontSize + padding * 2
  ctx.fillStyle = bgColor
  ctx.strokeStyle = borderColor
  ctx.lineWidth = 3
  const r = 12
  ctx.beginPath()
  ctx.moveTo(r, 0); ctx.lineTo(canvas.width - r, 0)
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r)
  ctx.lineTo(canvas.width, canvas.height - r)
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height)
  ctx.lineTo(r, canvas.height)
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r)
  ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath(); ctx.fill(); ctx.stroke()
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = "center"; ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(canvas.width / fontSize * scale, canvas.height / fontSize * scale, 1)
  sprite.renderOrder = 999
  return sprite
}

// ═══════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function ElektronIzomeriya3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)

  const leftGroupRef = useRef(null)
  const rightGroupRef = useRef(null)
  const atomsRef = useRef([])
  const bondsRef = useRef([])
  const labelsRef = useRef([])
  const spinArrowsRef = useRef([])
  const photonAnimRef = useRef({ active: false, progress: 0, direction: 'forward' })

  // ── UI STATE'lari ───────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [currentSystem, setCurrentSystem] = useState("FeBpy")
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showSpinArrows, setShowSpinArrows] = useState(true)
  const [showBondLengths, setShowBondLengths] = useState(true)
  const [showHydrogens, setShowHydrogens] = useState(false)
  const [temperature, setTemperature] = useState(150)  // K
  const [triggerLaser, setTriggerLaser] = useState(false)
  const [laserWavelength, setLaserWavelength] = useState(532)  // nm
  const [activePanel, setActivePanel] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [expandedSection, setExpandedSection] = useState("view")
  const [fullscreenMode, setFullscreenMode] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfSections, setPdfSections] = useState({
    intro: true, types: true, dorbital: true, spin: true,
    magnetism: true, spectra: true, applications: true, table: true, references: true
  })

  // Ko'chiriladigan panel
  const [panelPos, setPanelPos] = useState({ x: 12, y: 12 })
  const [isPanelDragging, setIsPanelDragging] = useState(false)
  const panelRef = useRef(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const handlePanelDragStart = useCallback((clientX, clientY) => {
    if (!panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    dragOffsetRef.current = { x: clientX - rect.left, y: clientY - rect.top }
    setIsPanelDragging(true)
  }, [])
  const handlePanelDragMove = useCallback((clientX, clientY) => {
    if (!panelRef.current) return
    const container = panelRef.current.parentElement
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const pW = panelRef.current.offsetWidth
    const pH = panelRef.current.offsetHeight
    let nx = clientX - cRect.left - dragOffsetRef.current.x
    let ny = clientY - cRect.top - dragOffsetRef.current.y
    nx = Math.max(0, Math.min(cRect.width - pW, nx))
    ny = Math.max(0, Math.min(cRect.height - pH, ny))
    setPanelPos({ x: nx, y: ny })
  }, [])
  const handlePanelDragEnd = useCallback(() => setIsPanelDragging(false), [])

  useEffect(() => {
    if (!isPanelDragging) return
    const onMouseMove = (e) => handlePanelDragMove(e.clientX, e.clientY)
    const onMouseUp = () => handlePanelDragEnd()
    const onTouchMove = (e) => { if (e.touches.length > 0) { e.preventDefault(); handlePanelDragMove(e.touches[0].clientX, e.touches[0].clientY) } }
    const onTouchEnd = () => handlePanelDragEnd()
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd)
    window.addEventListener("touchcancel", onTouchEnd)
    const prevCursor = document.body.style.cursor
    const prevSelect = document.body.style.userSelect
    document.body.style.cursor = "grabbing"
    document.body.style.userSelect = "none"
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("touchcancel", onTouchEnd)
      document.body.style.cursor = prevCursor
      document.body.style.userSelect = prevSelect
    }
  }, [isPanelDragging, handlePanelDragMove, handlePanelDragEnd])

  const togglePanel = (name) => setActivePanel(activePanel === name ? null : name)

  const system = ELECTRONIC_ISOMERS[currentSystem]

  // Boltzmann taqsimoti (spin-krossover uchun)
  const boltzmannFrac = useMemo(() => {
    if (system.type !== "spin_crossover" && system.type !== "valence_tautomerism" && system.type !== "photo_induced") {
      return { LS: 50, HS: 50 }
    }
    // Approximate: ΔH ≈ deltaH_kJ, ΔS ≈ 60 J/(mol·K) (tipik SCO uchun)
    const deltaH = 15  // kJ/mol
    const deltaS = 60  // J/(mol·K) (ma'lumotlarga qarab)
    const T_half = system.T_half || 200
    // deltaH = T_half * deltaS/1000 dan deltaS ni tuzatamiz
    const adjustedDeltaS = deltaH * 1000 / T_half
    return twoStateBoltzmann(deltaH, adjustedDeltaS, temperature)
  }, [system, temperature])

  // Hozirgi spin holati (harorat asosida)
  const currentState = useMemo(() => {
    if (system.type === "spin_crossover" || system.type === "photo_induced") {
      const stateKeys = Object.keys(system.states)
      // Past T va Yuqori T shakl
      if (temperature < (system.T_half || 150)) {
        return { key: stateKeys[0], data: system.states[stateKeys[0]] }
      } else {
        return { key: stateKeys[1], data: system.states[stateKeys[1]] }
      }
    }
    // Boshqa tizimlar uchun birinchi holat default
    const firstKey = Object.keys(system.states)[0]
    return { key: firstKey, data: system.states[firstKey] }
  }, [system, temperature])

  // Sistemani o'zgartirganda default harorat
  useEffect(() => {
    if (currentSystem === "FeBpy") setTemperature(150)
    else if (currentSystem === "PrussianBlue") setTemperature(298)
    else if (currentSystem === "MnJT") setTemperature(298)
    else if (currentSystem === "CoDiox") setTemperature(300)
    else if (currentSystem === "LIESST") setTemperature(30)
  }, [currentSystem])

  // ═══════════════════════════════════════════════════════════
  // BOG'LANISH YARATISH
  // ═══════════════════════════════════════════════════════════
  const createBond = useCallback((parent, start, end, color = CPK.bond, radius = 0.06, opacity = 0.75) => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 16)
    const material = new THREE.MeshStandardMaterial({
      color, roughness: 0.4, metalness: 0.3, transparent: true, opacity
    })
    const bond = new THREE.Mesh(geometry, material)
    bond.position.copy(midpoint)
    bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
    bond.userData = { type: 'bond' }
    parent.add(bond)
    bondsRef.current.push(bond)
    return bond
  }, [])

  const createAtom = useCallback((parent, pos, element, radius = 0.25, extraInfo = {}) => {
    const color = CPK[element] || 0x888888
    const geo = new THREE.SphereGeometry(radius, 32, 32)
    const mat = new THREE.MeshStandardMaterial({
      color, roughness: 0.3, metalness: 0.2,
      emissive: color, emissiveIntensity: 0.15
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.copy(pos)
    mesh.userData = {
      type: 'atom', element,
      info: ATOM_INFO[element] || { name: element, color: `#${color.toString(16)}` },
      ...extraInfo
    }
    parent.add(mesh)
    atomsRef.current.push(mesh)
    return mesh
  }, [])

  // Spin strelka (arrow) — atom atrofida
  const createSpinArrow = useCallback((parent, position, unpaired, size = 0.8) => {
    if (unpaired <= 0) return null
    const group = new THREE.Group()
    // Faqat bitta natijaviy strelka (jami spin)
    const arrowGeo = new THREE.ConeGeometry(0.1, 0.35, 12)
    const arrowMat = new THREE.MeshStandardMaterial({
      color: CPK.spinUp, emissive: CPK.spinUp, emissiveIntensity: 0.6,
      transparent: true, opacity: 0.9
    })
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat)
    arrowMesh.position.set(0, size, 0)
    group.add(arrowMesh)
    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.025, 0.025, size, 12)
    const stemMat = new THREE.MeshStandardMaterial({
      color: CPK.spinUp, emissive: CPK.spinUp, emissiveIntensity: 0.5,
      transparent: true, opacity: 0.8
    })
    const stem = new THREE.Mesh(stemGeo, stemMat)
    stem.position.set(0, size * 0.5, 0)
    group.add(stem)
    // Label
    const lbl = makeTextSprite(`${unpaired}e⁻`, {
      fontSize: 30, color: "#88ffaa", bgColor: "rgba(10, 40, 20, 0.9)",
      borderColor: "#88ffaa", scale: 0.32
    })
    lbl.position.set(0, size + 0.5, 0)
    group.add(lbl)
    group.position.copy(position)
    parent.add(group)
    spinArrowsRef.current.push(group)
    return group
  }, [])

  // Halo (visual indicator around metal for HS/LS state)
  const createHalo = useCallback((parent, position, color, size = 1.2, opacity = 0.15) => {
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(size, 32, 32),
      new THREE.MeshBasicMaterial({
        color, transparent: true, opacity, depthWrite: false,
        side: THREE.DoubleSide
      })
    )
    halo.position.copy(position)
    halo.userData = { isHalo: true }
    parent.add(halo)
    return halo
  }, [])

  // ═══════════════════════════════════════════════════════════
  // MOLEKULANI QURISH — oktaedrik model
  // ═══════════════════════════════════════════════════════════
  const buildMolecule = useCallback((group, stateData, offsetX, labelText, colorHex) => {
    const centerPos = new THREE.Vector3(offsetX, 0, 0)
    const bondLen = stateData.bondLength || 2.0

    // Markaziy metall — halosi bilan
    const metalGeo = new THREE.SphereGeometry(system.metal.radius, 64, 64)
    const metalMat = new THREE.MeshStandardMaterial({
      color: system.metal.color, roughness: 0.15, metalness: 0.9,
      emissive: system.metal.color, emissiveIntensity: 0.2
    })
    const metalMesh = new THREE.Mesh(metalGeo, metalMat)
    metalMesh.position.copy(centerPos)
    metalMesh.userData = {
      type: 'atom', element: system.metal.element,
      info: ATOM_INFO[system.metal.element],
      isCenter: true,
      state: stateData.name,
      spin: stateData.S,
      unpaired: stateData.unpaired
    }
    group.add(metalMesh); atomsRef.current.push(metalMesh)

    // Halo — spin holatiga qarab rang
    const haloColor = new THREE.Color(colorHex)
    createHalo(group, centerPos, haloColor, system.metal.radius * 4, 0.1)

    // Spin strelka
    if (showSpinArrows && stateData.unpaired > 0) {
      createSpinArrow(group, centerPos, stateData.unpaired, 0.9)
    } else if (showSpinArrows) {
      // Diamagnit belgisi (S = 0)
      const lbl = makeTextSprite("S = 0 (diamagnit)", {
        fontSize: 32, color: "#aaddff", bgColor: "rgba(10, 30, 60, 0.9)",
        borderColor: "#66aaff", scale: 0.34
      })
      lbl.position.set(centerPos.x, centerPos.y + 1.5, centerPos.z)
      group.add(lbl); labelsRef.current.push(lbl)
    }

    // 6 ta ligand oktaedrik pozitsiyalarda
    const dirs = [
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
    ]

    dirs.forEach((dir, i) => {
      // Jahn-Teller tizim uchun ba'zi bog'lar cho'ziladi
      let currentBondLen = bondLen
      if (system.type === "jahn_teller") {
        if (i < 4) currentBondLen = stateData.bondLengthEq  // ekvatorial
        else currentBondLen = stateData.bondLengthAx  // aksial (cho'ziq/qisqa)
      }
      // Ligand donor pozitsiyasi
      const donorPos = centerPos.clone().add(dir.clone().multiplyScalar(currentBondLen))
      const donorElem = system.ligand.donor === "N" ? "N" :
                        system.ligand.donor === "O" ? "O" :
                        system.ligand.donor === "C/N" ? (i % 2 === 0 ? "C" : "N") : "N"
      const donorInfo = ATOM_INFO[donorElem]

      const donor = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 32, 32),
        new THREE.MeshStandardMaterial({
          color: CPK[donorElem] || 0x888888,
          roughness: 0.3, metalness: 0.2,
          emissive: CPK[donorElem], emissiveIntensity: 0.15
        })
      )
      donor.position.copy(donorPos)
      donor.userData = {
        type: 'atom', element: donorElem, info: donorInfo,
        role: `${system.ligand.name} donor`, isDonor: true,
        bondLen: currentBondLen
      }
      group.add(donor); atomsRef.current.push(donor)

      // Bog' — Jahn-Teller uchun rangli farq
      let bondColor = CPK.bond
      let bondOpacity = 0.75
      if (system.type === "jahn_teller" && i >= 4) {
        // Aksial cho'ziq bog'lar boshqa rangda
        bondColor = 0xffaa44
        bondOpacity = 0.6
      }
      createBond(group, centerPos, donorPos, bondColor, 0.06, bondOpacity)

      // Bog' uzunligi yorlig'i
      if (showBondLengths && i === 0) {
        const midPos = centerPos.clone().add(donorPos).multiplyScalar(0.5)
        const bondLbl = makeTextSprite(`${currentBondLen.toFixed(2)} Å`, {
          fontSize: 26, color: "#ffcc66", bgColor: "rgba(50, 30, 5, 0.85)",
          borderColor: "#ffcc66", scale: 0.28
        })
        bondLbl.position.set(midPos.x, midPos.y + 0.5, midPos.z)
        group.add(bondLbl); labelsRef.current.push(bondLbl)
      }

      // NH₃, H₂O uchun H'lar (agar kerak bo'lsa)
      if (showHydrogens && (donorElem === "N" || donorElem === "O")) {
        const outward = donorPos.clone().sub(centerPos).normalize()
        const up = new THREE.Vector3(0, 1, 0)
        const perp = new THREE.Vector3().crossVectors(outward, Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up).normalize()
        const nH = donorElem === "N" ? 3 : 2  // NH₃ yoki H₂O
        if (system.ligand.name.includes("bpy") || system.ligand.name.includes("ptz")) {
          // Bpy va ptz uchun H yo'q (aromatiq halqa) — skip
        } else {
          for (let h = 0; h < nH; h++) {
            const ang = (h * 2 * Math.PI) / nH
            const hDir = outward.clone().multiplyScalar(0.3).add(perp.clone().multiplyScalar(0.35 * Math.cos(ang)))
              .add(new THREE.Vector3().crossVectors(outward, perp).multiplyScalar(0.35 * Math.sin(ang)))
            const hPos = donorPos.clone().add(hDir)
            createAtom(group, hPos, 'H', 0.09, { role: `${donorElem} ligandi tarkibi` })
            createBond(group, donorPos, hPos, 0x555566, 0.02, 0.4)
          }
        }
      }
    })

    // Formula yorlig'i
    if (showLabels && labelText) {
      const sprite = makeTextSprite(labelText, {
        fontSize: 44, color: "#ffffff",
        bgColor: `${colorHex}44`,
        borderColor: colorHex, scale: 0.42
      })
      sprite.position.set(offsetX, 3.5, 0)
      group.add(sprite); labelsRef.current.push(sprite)

      const subSprite = makeTextSprite(stateData.magnetism, {
        fontSize: 32, color: colorHex,
        bgColor: "rgba(10, 5, 25, 0.85)",
        borderColor: colorHex, scale: 0.34
      })
      subSprite.position.set(offsetX, 2.85, 0)
      group.add(subSprite); labelsRef.current.push(subSprite)
    }
  }, [system, showSpinArrows, showBondLengths, showLabels, showHydrogens, createAtom, createBond, createSpinArrow, createHalo])

  // ═══════════════════════════════════════════════════════════
  // SCENE'ni tozalash va qayta qurish
  // ═══════════════════════════════════════════════════════════
  const rebuildScene = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return

    ;[leftGroupRef, rightGroupRef].forEach(ref => {
      if (ref.current) {
        scene.remove(ref.current)
        ref.current.traverse(o => {
          if (o.geometry) o.geometry.dispose()
          if (o.material) {
            if (Array.isArray(o.material)) o.material.forEach(m => m.dispose())
            else o.material.dispose()
          }
        })
      }
    })

    atomsRef.current = []
    bondsRef.current = []
    labelsRef.current = []
    spinArrowsRef.current = []

    const leftGroup = new THREE.Group()
    const rightGroup = new THREE.Group()
    leftGroupRef.current = leftGroup
    rightGroupRef.current = rightGroup

    // 2 ta izomer — yonma-yon
    const stateKeys = Object.keys(system.states)
    if (stateKeys.length >= 2) {
      const stateA = system.states[stateKeys[0]]
      const stateB = system.states[stateKeys[1]]
      buildMolecule(leftGroup, stateA, -3.5, stateA.name, stateA.colorHex)
      buildMolecule(rightGroup, stateB, 3.5, stateB.name, stateB.colorHex)
    }

    scene.add(leftGroup)
    scene.add(rightGroup)

    // VS / o'tish belgisi
    if (system.type === "spin_crossover" || system.type === "valence_tautomerism") {
      const swap = makeTextSprite("⇌", {
        fontSize: 96, color: "#FFD700",
        bgColor: "rgba(60, 40, 5, 0.9)",
        borderColor: "#FFD700", scale: 0.7
      })
      swap.position.set(0, 0.5, 0)
      scene.add(swap); labelsRef.current.push(swap)

      const info = makeTextSprite(`T₁/₂ = ${system.T_half || "?"} K`, {
        fontSize: 34, color: "#ffcc66",
        bgColor: "rgba(50, 30, 10, 0.85)",
        borderColor: "#ffcc66", scale: 0.36
      })
      info.position.set(0, -0.3, 0)
      scene.add(info); labelsRef.current.push(info)
    } else if (system.type === "photo_induced") {
      // LIESST — hν strelkasi
      const hv = makeTextSprite("hν", {
        fontSize: 60, color: "#ff88ff",
        bgColor: "rgba(50, 15, 55, 0.9)",
        borderColor: "#ff88ff", scale: 0.5
      })
      hv.position.set(0, 0.5, 0)
      scene.add(hv); labelsRef.current.push(hv)

      const info = makeTextSprite(`${system.forwardLaser} nm → | ← ${system.reverseLaser} nm`, {
        fontSize: 28, color: "#ffaaff",
        bgColor: "rgba(40, 15, 45, 0.85)",
        borderColor: "#ffaaff", scale: 0.3
      })
      info.position.set(0, -0.3, 0)
      scene.add(info); labelsRef.current.push(info)
    } else if (system.type === "jahn_teller") {
      const jt = makeTextSprite("Jahn-Teller", {
        fontSize: 44, color: "#ffddaa",
        bgColor: "rgba(50, 30, 10, 0.9)",
        borderColor: "#ffddaa", scale: 0.42
      })
      jt.position.set(0, 0.5, 0)
      scene.add(jt); labelsRef.current.push(jt)
    } else if (system.type === "mixed_valence") {
      const iv = makeTextSprite("IVCT (Fe²⁺ → Fe³⁺)", {
        fontSize: 34, color: "#88ffff",
        bgColor: "rgba(10, 40, 50, 0.9)",
        borderColor: "#88ffff", scale: 0.36
      })
      iv.position.set(0, 0.5, 0)
      scene.add(iv); labelsRef.current.push(iv)
    }
  }, [system, buildMolecule])

  // ═══════════════════════════════════════════════════════════
  // THREE.JS SETUP
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const bgGeo = new THREE.SphereGeometry(50, 32, 32)
    const bgMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        color1: { value: new THREE.Color(0x0a0520) },
        color2: { value: new THREE.Color(0x1a0f38) }
      },
      vertexShader: `varying vec3 vWorldPosition;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPosition = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: `uniform vec3 color1; uniform vec3 color2;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y * 0.5 + 0.5;
          gl_FragColor = vec4(mix(color1, color2, h), 1.0);
        }`
    })
    scene.add(new THREE.Mesh(bgGeo, bgMat))

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 3, 12)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x0a0520, 1)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 4
    controls.maxDistance = 24
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.6
    controlsRef.current = controls

    scene.add(new THREE.AmbientLight(0x606080, 0.6))
    const l1 = new THREE.DirectionalLight(0xffffff, 0.9); l1.position.set(6, 8, 6); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0x88aaff, 0.5); l2.position.set(-5, -3, -4); scene.add(l2)
    const l3 = new THREE.PointLight(0xffaadd, 0.6, 30); l3.position.set(0, 6, 0); scene.add(l3)

    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(600 * 3)
    for (let i = 0; i < 600 * 3; i += 3) {
      const r = 20 + Math.random() * 15
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      sp[i] = r * Math.sin(ph) * Math.cos(th)
      sp[i + 1] = r * Math.sin(ph) * Math.sin(th)
      sp[i + 2] = r * Math.cos(ph)
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.06, transparent: true, opacity: 0.6, sizeAttenuation: true
    })))

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(atomsRef.current, false)
      if (intersects.length > 0) {
        const obj = intersects[0].object
        if (obj.userData && obj.userData.type === 'atom') {
          setSelectedAtom(obj.userData)
        }
      } else {
        setSelectedAtom(null)
      }
    }
    renderer.domElement.addEventListener('click', onClick)

    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      controls.update()

      spinArrowsRef.current.forEach(g => {
        if (g && g.rotation) g.rotation.y += 0.02
      })

      if (photonAnimRef.current.active) {
        photonAnimRef.current.progress += 0.01
        if (photonAnimRef.current.progress > 1) {
          photonAnimRef.current.active = false
          photonAnimRef.current.progress = 0
          if (photonAnimRef.current.direction === 'forward') {
            setTemperature(prev => Math.min(500, prev + 50))
          } else {
            setTemperature(prev => Math.max(10, prev - 50))
          }
          setTriggerLaser(false)
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    setTimeout(() => setLoading(false), 400)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", handleResize)
      renderer.domElement.removeEventListener('click', onClick)
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      renderer.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { rebuildScene() }, [rebuildScene])
  useEffect(() => { if (controlsRef.current) controlsRef.current.autoRotate = autoRotate }, [autoRotate])

  useEffect(() => {
    if (triggerLaser) {
      photonAnimRef.current.active = true
      photonAnimRef.current.progress = 0
      photonAnimRef.current.direction = laserWavelength < 700 ? 'forward' : 'reverse'
    }
  }, [triggerLaser, laserWavelength])

  // ═══════════════════════════════════════════════════════════
  // PDF GENERATSIYA
  // ═══════════════════════════════════════════════════════════
  const generatePDF = async () => {
    setPdfGenerating(true)
    try {
      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)

      let regularFont, boldFont, italicFont
      try {
        const [rBytes, bBytes, iBytes] = await Promise.all([
          fetch("/fonts/DejaVuSans.ttf").then(r => { if (!r.ok) throw new Error("Regular"); return r.arrayBuffer() }),
          fetch("/fonts/DejaVuSans-Bold.ttf").then(r => { if (!r.ok) throw new Error("Bold"); return r.arrayBuffer() }),
          fetch("/fonts/DejaVuSans-Oblique.ttf").then(r => { if (!r.ok) throw new Error("Italic"); return r.arrayBuffer() })
        ])
        regularFont = await pdfDoc.embedFont(rBytes, { subset: true })
        boldFont = await pdfDoc.embedFont(bBytes, { subset: true })
        italicFont = await pdfDoc.embedFont(iBytes, { subset: true })
      } catch (e) {
        alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.")
        setPdfGenerating(false); return
      }

      const C = {
        purple: rgb(0.30, 0.11, 0.58), purpleLight: rgb(0.86, 0.78, 1.0),
        purpleMid: rgb(0.65, 0.55, 0.98), purpleDark: rgb(0.12, 0.11, 0.29),
        textDark: rgb(0.08, 0.08, 0.16), textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0), red: rgb(0.80, 0.20, 0.20),
        green: rgb(0.08, 0.55, 0.31), blue: rgb(0.08, 0.31, 0.75),
        yellow: rgb(0.75, 0.60, 0.10), cyan: rgb(0.15, 0.55, 0.75),
        pink: rgb(0.85, 0.35, 0.60),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0), bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0), bgGreen: rgb(0.94, 1.0, 0.98),
        bgYellow: rgb(1.0, 0.98, 0.90), bgRed: rgb(1.0, 0.94, 0.94),
        bgPink: rgb(1.0, 0.95, 0.98), bgCyan: rgb(0.92, 0.98, 1.0),
        white: rgb(1, 1, 1)
      }

      const PAGE_W = 595.28, PAGE_H = 841.89
      const MARGIN = 55
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 30

      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNum = 1

      const measure = (t, f, s) => f.widthOfTextAtSize(String(t), s)
      const truncate = (t, f, s, w) => {
        const str = String(t)
        if (measure(str, f, s) <= w) return str
        let lo = 0, hi = str.length
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1
          if (measure(str.slice(0, mid) + "…", f, s) <= w) lo = mid
          else hi = mid - 1
        }
        return str.slice(0, lo) + "…"
      }
      const wrapText = (t, f, s, w) => {
        if (!t) return [""]
        const words = String(t).split(/\s+/)
        const lines = []
        let cur = ""
        for (const wd of words) {
          const test = cur ? cur + " " + wd : wd
          if (measure(test, f, s) > w && cur) { lines.push(cur); cur = wd }
          else cur = test
          if (measure(cur, f, s) > w) {
            let piece = ""
            for (const ch of cur) {
              if (measure(piece + ch, f, s) > w) { lines.push(piece); piece = ch }
              else piece += ch
            }
            cur = piece
          }
        }
        if (cur) lines.push(cur)
        return lines
      }

      const addFooter = () => {
        const left = truncate(
          `Elektron izomeriya 3D Lab  •  ${cleanText(system.formula)}  •  ${new Date().toLocaleDateString("uz-UZ")}`,
          regularFont, 8, CONTENT_W - 30
        )
        page.drawText(left, { x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        const pStr = `${pageNum}`
        const w = measure(pStr, regularFont, 8)
        page.drawText(pStr, { x: PAGE_W - MARGIN - w, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray })
        page.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 },
          end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine
        })
      }
      const addNewPage = () => { addFooter(); page = pdfDoc.addPage([PAGE_W, PAGE_H]); pageNum++; y = PAGE_H - MARGIN }
      const checkBreak = (need) => { if (y - need < FOOTER_Y + 25) addNewPage() }

      const drawSectionHeader = (num, title) => {
        checkBreak(45)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.purple })
        page.drawText(`${num}.`, { x: MARGIN + 10, y: y - 14, size: 14, font: boldFont, color: C.purple })
        page.drawText(title, { x: MARGIN + 30, y: y - 14, size: 14, font: boldFont, color: C.textDark })
        y -= 30
      }

      const drawParagraph = (text, opts = {}) => {
        const { size = 10, font = regularFont, color = C.textDark, indent = 0 } = opts
        const lines = wrapText(cleanText(text), font, size, CONTENT_W - indent)
        for (const line of lines) {
          checkBreak(size + 4)
          page.drawText(line, { x: MARGIN + indent, y, size, font, color })
          y -= size + 4
        }
        y -= 4
      }

      const drawBulletPoint = (text, color = C.purple) => {
        const size = 10, indent = 20
        checkBreak(size + 6)
        page.drawCircle({ x: MARGIN + 7, y: y - 3, size: 2, color })
        const lines = wrapText(cleanText(text), regularFont, size, CONTENT_W - indent)
        lines.forEach((line, i) => {
          if (i > 0) checkBreak(size + 3)
          page.drawText(line, { x: MARGIN + indent, y, size, font: regularFont, color: C.textDark })
          y -= size + 3
        })
        y -= 2
      }

      const drawInfoBox = (title, body, bgColor, borderColor) => {
        const size = 10, titleSize = 11, pad = 10
        const bodyLines = wrapText(cleanText(body), regularFont, size, CONTENT_W - 2 * pad)
        const boxH = titleSize + 8 + bodyLines.length * (size + 3) + 2 * pad
        checkBreak(boxH + 8)
        page.drawRectangle({ x: MARGIN, y: y - boxH, width: CONTENT_W, height: boxH, color: bgColor })
        page.drawRectangle({ x: MARGIN, y: y - boxH, width: 3, height: boxH, color: borderColor })
        page.drawText(cleanText(title), { x: MARGIN + pad, y: y - pad - titleSize + 4, size: titleSize, font: boldFont, color: borderColor })
        let by = y - pad - titleSize - 8
        bodyLines.forEach(line => {
          page.drawText(line, { x: MARGIN + pad, y: by, size, font: regularFont, color: C.textDark })
          by -= size + 3
        })
        y -= boxH + 10
      }

      // MUQOVA
      page.drawRectangle({ x: 0, y: PAGE_H - 200, width: PAGE_W, height: 200, color: C.purpleDark })
      page.drawRectangle({ x: 0, y: PAGE_H - 205, width: PAGE_W, height: 5, color: C.purple })
      const titleText = "ELEKTRON IZOMERIYASI"
      const tW = measure(titleText, boldFont, 24)
      page.drawText(titleText, { x: (PAGE_W - tW) / 2, y: PAGE_H - 88, size: 24, font: boldFont, color: C.white })
      const subtitle = "Spin, valentnost va elektronlar taqsimoti"
      const sW = measure(subtitle, italicFont, 13)
      page.drawText(subtitle, { x: (PAGE_W - sW) / 2, y: PAGE_H - 113, size: 13, font: italicFont, color: C.purpleLight })
      const formulaText = cleanText(system.formula)
      const fW = measure(formulaText, boldFont, 20)
      page.drawText(formulaText, { x: (PAGE_W - fW) / 2, y: PAGE_H - 160, size: 20, font: boldFont, color: C.white })

      y = PAGE_H - 240
      drawInfoBox("Tanlangan sistema", `${system.title} — ${system.typeName}`, C.bgPurple, C.purple)

      const meta = [
        ["Izomeriya turi:", system.typeName],
        ["Formula:", system.formula],
        ["Markaziy metall:", `${system.metal.element}(${system.metal.charge})`],
        ["d-elektronlar:", `d${system.metal.d_electrons}`],
        ["Ligand:", system.ligand.name]
      ]
      if (system.T_half) meta.push(["T₁/₂ (o'tish harorati):", `${system.T_half} K`])
      meta.forEach(([k, v]) => {
        checkBreak(18)
        page.drawText(cleanText(k), { x: MARGIN + 10, y, size: 10.5, font: boldFont, color: C.purple })
        page.drawText(truncate(cleanText(v), regularFont, 10.5, CONTENT_W - 170), { x: MARGIN + 160, y, size: 10.5, font: regularFont, color: C.textDark })
        y -= 17
      })
      y -= 12

      if (pdfSections.intro) {
        drawSectionHeader(1, "Kirish — Elektron izomeriya nima?")
        drawParagraph(
          "Elektron izomeriya (electronic isomerism) — bir xil kimyoviy formulaga va atomlar joylashuviga ega bo'lgan koordinatsion birikmalarning elektron holati (spin holati, oksidlanish darajasi, orbital konfiguratsiyasi) bo'yicha farq qilishi. Bu izomerlar odatda tashqi omillar (harorat, bosim, yorug'lik) ta'sirida biridan boshqasiga o'ta oladi."
        )
        drawParagraph("Elektron izomeriyaning asosiy turlari:")
        drawBulletPoint("Spin-krossover (SCO) — LS ↔ HS o'zgarishi. Fe(II), Fe(III), Co(II) tizimlarida ko'p uchraydi.")
        drawBulletPoint("Valentnost tautomeriya (VT) — o'zgaruvchan oksidlanish darajasi (M(II)L↔M(III)L').")
        drawBulletPoint("Aralash valentli (mixed-valence) — bir xil metall ikki xil oksidlanish darajasida (Robin-Day tasnifi).")
        drawBulletPoint("Jahn-Teller izomerlanishi — degeneratsiyalangan tizimlar geometrik buzilishga uchraydi.")
        drawBulletPoint("LIESST — yorug'lik ta'sirida spin holatining o'zgarishi.")
        drawBulletPoint("Charge transfer (CT) izomerlar — MLCT, LMCT, IVCT excited holatlar.")
      }

      if (pdfSections.types) {
        drawSectionHeader(2, `${system.typeName} — batafsil tahlil`)
        drawParagraph(system.description)
        const stateKeys = Object.keys(system.states)
        stateKeys.forEach((key, idx) => {
          const s = system.states[key]
          const bgs = [C.bgGreen, C.bgRed, C.bgYellow]
          const brs = [C.green, C.red, C.yellow]
          drawInfoBox(
            `${s.name}`,
            `Spin (S) = ${s.S}, juftlashmagan elektronlar: ${s.unpaired}. Magnit momenti μ = ${s.magneticMoment.toFixed(2)} μ_B. Magnetizm: ${s.magnetism}. Bog' uzunligi: ${s.bondLength || (s.bondLengthEq + " / " + s.bondLengthAx)} Å. Barqarorlik: ${s.stability || "N/A"}.`,
            bgs[idx % 3], brs[idx % 3]
          )
        })
      }

      if (pdfSections.dorbital) {
        drawSectionHeader(3, "d-orbital diagrammasi va ligand maydoni")
        drawParagraph(
          "Oktaedrik ligand maydonida 5 ta d-orbital 2 guruhga bo'linadi: t₂ᵍ (past energiya, 3 orbital: d_xy, d_xz, d_yz) va e_g (yuqori energiya, 2 orbital: d_x²-y², d_z²). Farq — Δ_o (10Dq)."
        )
        drawInfoBox(
          "Spin holati mezoni",
          `Agar Δ_o > P (juftlik energiyasi) — past-spin (LS). Agar Δ_o < P — yuqori-spin (HS). ${system.id === "FeBpy" ? `Fe(bpy)₃: LS Δ_o ≈ ${system.delta_o_LS} cm⁻¹, HS Δ_o ≈ ${system.delta_o_HS} cm⁻¹, P ≈ ${system.P_pairing} cm⁻¹.` : ""}`,
          C.bgYellow, C.yellow
        )
        drawParagraph("Elektronlar taqsimoti:")
        Object.entries(system.states).forEach(([key, s]) => {
          if (s.t2g !== undefined && s.eg !== undefined) {
            drawBulletPoint(`${s.name}: (t₂ᵍ)^${s.t2g} (e_g)^${s.eg} — ${s.unpaired} juftlashmagan elektron`)
          }
        })
      }

      if (pdfSections.spin) {
        drawSectionHeader(4, "Spin va magnit xossalar")
        drawInfoBox(
          "Magnit momentini hisoblash",
          "Spin only formula: μ = √[n(n+2)] μ_B, bu yerda n — juftlashmagan elektronlar soni. Bu formula orbital moment kichik bo'lgan tizimlarda (kvenchat orbital) yaxshi mos keladi. Umumiy holda: μ_eff = g·√[S(S+1)] μ_B, g ≈ 2.00.",
          C.bgBlue, C.blue
        )
        drawParagraph("Har bir holat uchun magnit xossalar:")
        Object.entries(system.states).forEach(([key, s]) => {
          drawBulletPoint(`${s.name}: n = ${s.unpaired}, S = ${s.S}, μ_calc = ${spinOnlyMoment(s.unpaired).toFixed(2)} μ_B, magnetizm: ${s.magnetism}`)
        })
      }

      if (pdfSections.magnetism) {
        drawSectionHeader(5, "Magnit qabuliyat va harorat ta'siri")
        drawParagraph(
          "SQUID magnetometriya (Superconducting QUantum Interference Device) — o'ta sezgir magnit qabuliyat o'lchash usuli. Spin-krossover tizimlarda χT vs T grafigi o'ziga xos S-shaklda bo'ladi."
        )
        if (system.type === "spin_crossover" || system.type === "photo_induced") {
          drawInfoBox(
            "Van't Hoff tenglamasi (2-holatli muvozanat)",
            `T₁/₂ = ΔH / ΔS. T₁/₂ — 50% konversiya harorati. Ushbu tizim uchun T₁/₂ = ${system.T_half} K. ΔS odatda 30-80 J/(mol·K), asosan vibron (fonon) donolamai bilan izohlanadi.`,
            C.bgGreen, C.green
          )
        }
        if (system.hysteresis) {
          drawInfoBox(
            "Termik gisterezis",
            `${system.hysteresis} K — kooperativ o'zaro ta'sirlar (kristal panjara stress) tufayli T₁/₂↑ va T₁/₂↓ farq qiladi. Bu — molekulyar xotira uchun asos.`,
            C.bgOrange, C.orange
          )
        }
      }

      if (pdfSections.spectra) {
        drawSectionHeader(6, "UV-Vis va IR spektroskopiya")
        drawParagraph(
          "Elektron izomerlar UV-Vis spektrida turli yutilish polosalari beradi. Bu spektroskopik farq — izomerlarni ajratishning eng oson usullaridan biri."
        )
        Object.entries(system.states).forEach(([key, s]) => {
          if (s.wavelength) {
            drawBulletPoint(`${s.name}: λ_max = ${s.wavelength} nm (${s.color})`)
          }
        })
        if (system.LIESST && system.LIESST.exists) {
          drawInfoBox(
            "LIESST hodisasi",
            `Yashil laser (${system.LIESST.wavelength} nm) LS → HS o'tishni majburlaydi. T < ${system.LIESST.T_LIESST} K da HS holat metastabil, soatlab saqlanadi. Teskari IR laser (${system.LIESST.reverseWavelength} nm) HS → LS ni qaytaradi.`,
            C.bgPink, C.pink
          )
        }
      }

      if (pdfSections.applications) {
        drawSectionHeader(7, "Amaliy qo'llanilishi va zamonaviy tadqiqotlar")
        drawParagraph(system.applications || "Elektron izomerlar zamonaviy materialshunoslikda katta rol o'ynaydi.")
        drawBulletPoint("Molekulyar xotira qurilmalari (SCO va LIESST — bit yozish uchun)")
        drawBulletPoint("Kvant kompyuterlar (spin qubitlar — Cr, V, Fe komplekslar)")
        drawBulletPoint("Foto-magnit switchlar (yorug'lik → spin holati)")
        drawBulletPoint("Sensor materiallar (harorat, bosim, gaz sensorlari)")
        drawBulletPoint("Displey texnologiyalari (Berlin ko'ki — elektroxromik)")
        drawBulletPoint("Batareyalar (Prussian Blue analoglari — Na-ion, K-ion)")
        drawBulletPoint("MRI kontrast agentlar (paramagnit Mn(III), Fe(III))")
      }

      if (pdfSections.table) {
        drawSectionHeader(8, "Barcha holatlarning solishtirish jadvali")
        const rows = [["Xususiyat", ...Object.values(system.states).map(s => s.name.split('(')[0].trim().slice(0, 20))]]
        const stateArr = Object.values(system.states)
        rows.push(["Spin (S)", ...stateArr.map(s => `${s.S}`)])
        rows.push(["Juftlashmagan e⁻", ...stateArr.map(s => `${s.unpaired}`)])
        rows.push(["μ (μ_B)", ...stateArr.map(s => `${s.magneticMoment.toFixed(2)}`)])
        rows.push(["Magnetizm", ...stateArr.map(s => s.magnetism)])
        rows.push(["Rang", ...stateArr.map(s => s.color || "—")])

        const nCols = rows[0].length
        const colW = [CONTENT_W * 0.28, ...Array(nCols - 1).fill(CONTENT_W * 0.72 / (nCols - 1))]
        const rowH = 24
        checkBreak(rows.length * rowH + 10)
        rows.forEach((row, ri) => {
          const isHeader = ri === 0
          if (isHeader) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.purple })
          } else if (ri % 2 === 0) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.bgPurple })
          }
          let cx = MARGIN + 6
          row.forEach((cell, ci) => {
            const font = isHeader ? boldFont : regularFont
            const fs = isHeader ? 8.5 : 8
            const txt = truncate(cleanText(cell), font, fs, colW[ci] - 12)
            page.drawText(txt, {
              x: cx, y: y - rowH + 9, size: fs, font,
              color: isHeader ? C.white : C.textDark
            })
            cx += colW[ci]
          })
          y -= rowH
        })
        y -= 10
      }

      if (pdfSections.references) {
        drawSectionHeader(9, "Adabiyotlar")
        const refs = [
          "Cambi, L., Cagnasso, A. (1931). Anomalies in the magnetic behavior of dithiocarbamates of Fe(III). Rendiconti dell'Accademia Nazionale dei Lincei, 13, 809.",
          "Robin, M.B., Day, P. (1967). Mixed Valence Chemistry: A Survey and Classification. Advances in Inorganic Chemistry and Radiochemistry, 10, 247–422.",
          "Jahn, H.A., Teller, E. (1937). Stability of polyatomic molecules in degenerate electronic states. Proceedings of the Royal Society A, 161, 220.",
          "Decurtins, S., Gütlich, P., Köhler, C.P., Spiering, H., Hauser, A. (1984). Light-Induced Excited Spin State Trapping (LIESST). Chemical Physics Letters, 105, 1–4.",
          "Pierpont, C.G., Buchanan, R.M. (1981). Transition metal complexes of o-benzoquinone, o-semiquinone, and catecholate ligands. Coordination Chemistry Reviews, 38, 45.",
          "Hauser, A. (2004). Ligand Field Theoretical Considerations. Topics in Current Chemistry, 233, 49–58.",
          "Gütlich, P., Goodwin, H.A. (Eds.) (2004). Spin Crossover in Transition Metal Compounds I-III. Topics in Current Chemistry, Springer-Verlag.",
          "Halcrow, M.A. (Ed.) (2013). Spin-Crossover Materials — Properties and Applications. Wiley.",
          "Housecroft, C.E., Sharpe, A.G. (2018). Inorganic Chemistry (5th ed.). Pearson. Chapter 20 — d-block Metal Chemistry.",
          "Cotton, F.A., Wilkinson, G., Murillo, C.A., Bochmann, M. (1999). Advanced Inorganic Chemistry (6th ed.). Wiley-Interscience."
        ]
        refs.forEach((r, i) => {
          const size = 8.5
          const lines = wrapText(r, regularFont, size, CONTENT_W - 20)
          lines.forEach((ln, li) => {
            checkBreak(size + 3)
            const prefix = li === 0 ? `[${i + 1}]` : ""
            if (prefix) page.drawText(prefix, { x: MARGIN, y, size, font: boldFont, color: C.purple })
            page.drawText(ln, { x: MARGIN + 20, y, size, font: regularFont, color: C.textDark })
            y -= size + 3
          })
          y -= 3
        })
      }

      addFooter()

      pdfDoc.setTitle(`Elektron izomeriya — ${cleanText(system.formula)}`)
      pdfDoc.setSubject("Koordinatsion birikmalarning elektron izomeriyasi")
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo Interactive 3D Lab")
      pdfDoc.setKeywords(["elektron izomeriya", "spin-krossover", "LIESST", "Jahn-Teller", "mixed valence"])

      const bytes = await pdfDoc.save()
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `elektron-izomeriya-${system.id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setPdfModalOpen(false)
    } catch (err) {
      console.error("PDF xato:", err)
      alert("PDF yaratishda xato: " + err.message)
    } finally {
      setPdfGenerating(false)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white flex flex-col">
      {!fullscreenMode && (
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-purple-800/50 z-30 bg-purple-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link href="/oquv/izomeriyasi/tuzilish/elektron" className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0">
            <span>←</span>
            <span className="hidden sm:inline">Orqaga</span>
          </Link>
          <div className="h-8 w-px bg-purple-800 flex-shrink-0"></div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-fuchsia-300 flex items-center gap-2 truncate">
              <span>⚛️</span>
              <span className="hidden sm:inline">Elektron izomeriyasi — 3D Laboratoriya</span>
              <span className="sm:hidden">Elektron 3D</span>
            </h1>
            <p className="text-purple-500 text-xs truncate">{system.formula} • {system.typeName} • T = {temperature} K</p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <select value={currentSystem} onChange={(e) => setCurrentSystem(e.target.value)}
            className="bg-purple-900/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-purple-700/50 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[280px]">
            <option value="FeBpy">[Fe(bpy)₃]²⁺ — Spin-krossover</option>
            <option value="PrussianBlue">Berlin ko'ki — Mixed valence</option>
            <option value="MnJT">[Mn(H₂O)₆]³⁺ — Jahn-Teller</option>
            <option value="CoDiox">Co-dioksolat — Valentnost taut.</option>
            <option value="LIESST">[Fe(ptz)₆]²⁺ — LIESST</option>
          </select>
          <button onClick={() => setAutoRotate(!autoRotate)} className={`p-2 rounded-lg transition-all text-sm ${autoRotate ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Aylantirish">🔄</button>
          <button onClick={() => togglePanel("info")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "info" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Ma'lumot">ℹ️</button>
          <button onClick={() => togglePanel("dorbital")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "dorbital" ? 'bg-cyan-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="d-orbital">⚛️</button>
          <button onClick={() => togglePanel("magnetism")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "magnetism" ? 'bg-blue-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Magnit">🧲</button>
          <button onClick={() => togglePanel("temperature")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "temperature" ? 'bg-orange-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="χT-T grafigi">🌡️</button>
          {((system.LIESST && system.LIESST.exists) || system.type === "photo_induced") && (
            <button onClick={() => togglePanel("liesst")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "liesst" ? 'bg-pink-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="LIESST">💡</button>
          )}
          <button onClick={() => togglePanel("history")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "history" ? 'bg-amber-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Tarix">📜</button>
          <button onClick={() => togglePanel("test")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "test" ? 'bg-cyan-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Test">🧠</button>
          <button onClick={() => togglePanel("citation")} className={`p-2 rounded-lg transition-all text-sm ${activePanel === "citation" ? 'bg-blue-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`} title="Adabiyotlar">📚</button>
          <button onClick={() => setPdfModalOpen(true)} className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50" title="PDF">📄</button>
          <button onClick={() => setFullscreenMode(true)} className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50" title="Fullscreen">🖥️</button>
        </div>
      </header>
      )}

      {fullscreenMode && (
        <button onClick={() => setFullscreenMode(false)} className="fixed top-4 right-4 z-50 p-3 rounded-full bg-purple-900/70 backdrop-blur-md text-white hover:bg-purple-700/80 transition-all shadow-2xl border border-purple-500/40" title="Chiqish"><span className="text-lg">✕</span></button>
      )}

      <div className="flex-1 flex flex-row relative overflow-hidden">
        {!fullscreenMode && (
        <div ref={panelRef}
          className={`absolute z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 w-[290px] shadow-2xl max-h-[calc(100vh-130px)] flex flex-col ${isPanelDragging ? 'shadow-purple-500/50 border-purple-500/80 select-none' : ''}`}
          style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}>
          <div
            onMouseDown={(e) => { if (e.button !== 0) return; e.preventDefault(); handlePanelDragStart(e.clientX, e.clientY) }}
            onTouchStart={(e) => { if (e.touches.length > 0) handlePanelDragStart(e.touches[0].clientX, e.touches[0].clientY) }}
            className={`flex items-center justify-between px-3 py-2 border-b border-purple-700/40 rounded-t-xl ${isPanelDragging ? 'cursor-grabbing bg-purple-800/60' : 'cursor-grab bg-purple-900/40 hover:bg-purple-800/50'} transition-colors select-none touch-none`}
            title="Ushlab siljiting">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-2">
              <span className="text-purple-400">⋮⋮</span><span>🎛️</span> Boshqaruv paneli
            </h3>
            <span className="text-purple-400 text-[10px] opacity-70">↕ ↔</span>
          </div>
          <div className="p-3 overflow-y-auto custom-scrollbar flex-1">

            {/* Harorat slayder — asosiy interaktiv */}
            <div className="mb-3 p-3 rounded-lg border-2 border-orange-600/40 bg-orange-950/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-orange-300 uppercase tracking-wide font-bold">🌡️ Harorat (T)</span>
                <span className="text-lg font-bold text-white">{temperature} K</span>
              </div>
              <input type="range" min={10} max={500} step={5} value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full accent-orange-500 mb-2" />
              <div className="flex justify-between text-[9px] text-orange-400/70 mb-2">
                <span>10 K</span><span>298 K</span><span>500 K</span>
              </div>
              {system.T_half && (
                <div className="text-[10px] p-2 rounded bg-orange-950/60 border border-orange-700/40 text-orange-100">
                  <div>T₁/₂ = <span className="font-bold text-yellow-300">{system.T_half} K</span></div>
                  <div className="mt-1 text-[9px]">Hozirda: <span className="font-bold" style={{ color: currentState.data.colorHex }}>{currentState.data.name}</span></div>
                </div>
              )}
              {(system.type === "spin_crossover" || system.type === "photo_induced") && (
                <div className="mt-2 space-y-1.5">
                  <div className="text-[9px] text-orange-300">Boltzmann taqsimoti:</div>
                  <div className="flex items-center gap-1">
                    <div className="text-[9px] text-blue-300 w-8">LS</div>
                    <div className="flex-1 h-3 bg-purple-950/60 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all" style={{ width: `${boltzmannFrac.LS}%` }} />
                    </div>
                    <div className="text-[9px] text-blue-300 w-8 text-right">{boltzmannFrac.LS.toFixed(0)}%</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-[9px] text-red-300 w-8">HS</div>
                    <div className="flex-1 h-3 bg-purple-950/60 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 transition-all" style={{ width: `${boltzmannFrac.HS}%` }} />
                    </div>
                    <div className="text-[9px] text-red-300 w-8 text-right">{boltzmannFrac.HS.toFixed(0)}%</div>
                  </div>
                </div>
              )}
            </div>

            {/* Laser trigger */}
            {((system.LIESST && system.LIESST.exists) || system.type === "photo_induced") && (
              <div className="mb-3 p-3 rounded-lg border-2 border-pink-600/40 bg-pink-950/30">
                <div className="text-[11px] text-pink-300 uppercase tracking-wide font-bold mb-2">💡 Laser trigger</div>
                <div className="space-y-1.5">
                  <button onClick={() => { setLaserWavelength(532); setTriggerLaser(true) }}
                    className="w-full text-[10px] px-2 py-2 rounded bg-green-700 hover:bg-green-600 text-white flex items-center justify-between">
                    <span>🟢 532 nm laser (LS→HS)</span><span className="text-[9px]">forward</span>
                  </button>
                  <button onClick={() => { setLaserWavelength(830); setTriggerLaser(true) }}
                    className="w-full text-[10px] px-2 py-2 rounded bg-red-700 hover:bg-red-600 text-white flex items-center justify-between">
                    <span>🔴 830 nm laser (HS→LS)</span><span className="text-[9px]">reverse</span>
                  </button>
                </div>
                <p className="text-[9px] text-pink-400 italic mt-2">
                  Laser LIESST hodisasi simulyatsiyasi — haroratni ±50 K o'zgartiradi.
                </p>
              </div>
            )}

            {/* Ko'rinish */}
            <button onClick={() => setExpandedSection(expandedSection === "view" ? null : "view")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2">
              <span className="flex items-center gap-2"><span>👁️</span> Ko'rinish</span>
              <span>{expandedSection === "view" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "view" && (
              <div className="space-y-2 mb-3 px-1">
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Yorliqlar</span>
                  <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="accent-purple-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Spin strelkalari 🔺</span>
                  <input type="checkbox" checked={showSpinArrows} onChange={(e) => setShowSpinArrows(e.target.checked)} className="accent-green-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Bog' uzunliklari (Å)</span>
                  <input type="checkbox" checked={showBondLengths} onChange={(e) => setShowBondLengths(e.target.checked)} className="accent-yellow-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Vodorodlar</span>
                  <input type="checkbox" checked={showHydrogens} onChange={(e) => setShowHydrogens(e.target.checked)} className="accent-purple-500" />
                </label>
              </div>
            )}

            {/* Hozirgi holat */}
            <div className="mb-3 p-2.5 rounded-lg border-l-4"
              style={{ backgroundColor: `${currentState.data.colorHex}22`, borderLeftColor: currentState.data.colorHex }}>
              <div className="text-[10px] text-white/80 uppercase tracking-wide mb-1">Hozirgi elektron holat</div>
              <div className="text-sm text-white font-bold">{currentState.data.name}</div>
              <div className="grid grid-cols-2 gap-1 mt-2 text-[10px]">
                <div><div className="text-white/60">Spin (S)</div><div className="text-white font-bold">{currentState.data.S}</div></div>
                <div><div className="text-white/60">Juftlashmagan</div><div className="text-white font-bold">{currentState.data.unpaired} e⁻</div></div>
                <div><div className="text-white/60">μ (spin only)</div><div className="text-white font-bold">{currentState.data.magneticMoment.toFixed(2)} μB</div></div>
                <div><div className="text-white/60">Magnetizm</div><div className="text-white font-bold text-[9px]">{currentState.data.magnetism}</div></div>
              </div>
            </div>

            {/* Eksport */}
            <button onClick={() => setExpandedSection(expandedSection === "export" ? null : "export")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2">
              <span className="flex items-center gap-2"><span>📤</span> Eksport</span>
              <span>{expandedSection === "export" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "export" && (
              <div className="space-y-2 mb-3 px-1">
                <button onClick={() => setPdfModalOpen(true)}
                  className="w-full text-xs px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-medium transition-all">
                  📄 PDF hisobot yaratish
                </button>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-purple-800/40">
              <div className="text-[11px] text-purple-400 mb-2 uppercase tracking-wide">💡 Maslahat</div>
              <p className="text-[10px] text-purple-400 leading-relaxed">
                <span className="text-orange-400">🌡️ Harorat slayder</span> spin o'tishni boshqaradi.
                <span className="text-green-400"> 🔺 Spin strelka</span> — juftlashmagan e⁻ soni.
                <span className="text-pink-400"> 💡 Laser</span> LIESST'ni boshlaydi.
              </p>
            </div>
          </div>
        </div>
        )}

        <div ref={containerRef} className="flex-1 w-full relative" />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 backdrop-blur-sm z-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-fuchsia-400 mx-auto"></div>
              <p className="mt-4 text-fuchsia-300 text-sm">3D sahna yuklanmoqda...</p>
            </div>
          </div>
        )}

        {selectedAtom && !fullscreenMode && (
          <div className="absolute bottom-4 right-4 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-xs shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm text-purple-200 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: selectedAtom.info?.color || '#888' }}></span>
                {selectedAtom.info?.name || selectedAtom.element}
              </h4>
              <button onClick={() => setSelectedAtom(null)} className="text-purple-400 hover:text-purple-200 text-lg leading-none">×</button>
            </div>
            <div className="space-y-1 text-xs text-purple-300">
              {selectedAtom.info?.atomic && <div><span className="text-purple-500">Atom raqami:</span> {selectedAtom.info.atomic}</div>}
              {selectedAtom.info?.mass && <div><span className="text-purple-500">Massa:</span> {selectedAtom.info.mass}</div>}
              {selectedAtom.info?.config && <div><span className="text-purple-500">Konfig:</span> <span className="font-mono">{selectedAtom.info.config}</span></div>}
              {selectedAtom.role && <div><span className="text-purple-500">Roli:</span> {selectedAtom.role}</div>}
              {selectedAtom.state && <div className="text-emerald-400 font-bold">🌀 Holat: {selectedAtom.state}</div>}
              {selectedAtom.spin !== undefined && <div className="text-yellow-400">Spin S = {selectedAtom.spin}</div>}
              {selectedAtom.unpaired !== undefined && selectedAtom.unpaired > 0 && <div className="text-green-400 font-bold">{selectedAtom.unpaired} juftlashmagan e⁻</div>}
              {selectedAtom.isDonor && <div className="text-yellow-400 font-bold">⚡ Donor</div>}
              {selectedAtom.isCenter && <div className="text-pink-400 font-bold">🌟 Markaziy metall</div>}
              {selectedAtom.bondLen && <div><span className="text-purple-500">Bog':</span> <span className="font-mono">{selectedAtom.bondLen.toFixed(2)} Å</span></div>}
            </div>
          </div>
        )}

        {activePanel === "info" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-sm w-[340px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm"><span>ℹ️</span> {system.title}</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-400 text-[10px] uppercase tracking-wide mb-1">Formula</div>
                <div className="font-mono text-lg text-white text-center">{system.formula}</div>
              </div>
              <div className="bg-fuchsia-900/40 rounded-lg p-3 border border-fuchsia-700/40">
                <div className="text-fuchsia-300 text-[10px] uppercase tracking-wide mb-1 font-bold">Izomeriya turi</div>
                <div className="text-white text-sm">{system.typeName}</div>
              </div>
              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 text-[10px] uppercase tracking-wide mb-1 font-bold">📖 Tavsif</div>
                <p className="text-blue-100 text-[10px] leading-relaxed">{system.description}</p>
              </div>
              {Object.entries(system.states).map(([key, s]) => (
                <div key={key} className="rounded-lg p-3 border-2" style={{ backgroundColor: `${s.colorHex}22`, borderColor: s.colorHex }}>
                  <div className="text-[10px] uppercase tracking-wide mb-1 font-bold" style={{ color: s.colorHex }}>{s.name}</div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-white/90">
                    <div>S = <strong>{s.S}</strong></div>
                    <div>Juftlashmagan: <strong>{s.unpaired}</strong></div>
                    <div>μ = <strong>{s.magneticMoment.toFixed(2)} μB</strong></div>
                    <div>Rang: <strong>{s.color}</strong></div>
                  </div>
                </div>
              ))}
              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 text-[10px] uppercase tracking-wide mb-1 font-bold">🧠 Nazariya</div>
                <p className="text-yellow-100 text-[10px] leading-relaxed">{system.theory}</p>
              </div>
              <div className="bg-pink-950/40 rounded-lg p-3 border border-pink-700/40">
                <div className="text-pink-300 text-[10px] uppercase tracking-wide mb-1 font-bold">💼 Qo'llanilishi</div>
                <p className="text-pink-100 text-[10px] leading-relaxed">{system.applications}</p>
              </div>
            </div>
          </div>
        )}

        {activePanel === "dorbital" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-cyan-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-cyan-200 flex items-center gap-2 text-sm"><span>⚛️</span> d-orbital diagrammasi</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-cyan-950/40 rounded-lg p-3 border border-cyan-700/40">
                <p className="text-cyan-100 text-[11px] leading-relaxed">Oktaedrik ligand maydonida 5 ta d-orbital 2 guruhga bo'linadi: <strong>t₂ᵍ</strong> (past, 3 orbital) va <strong>e_g</strong> (yuqori, 2 orbital). Farq — <strong>Δ_o</strong> (10Dq).</p>
              </div>
              {Object.entries(system.states).filter(([k, s]) => s.t2g !== undefined).map(([key, s]) => (
                <div key={key} className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                  <div className="text-[11px] font-bold mb-2" style={{ color: s.colorHex }}>{s.name}</div>
                  <DOrbitalDiagram t2g={s.t2g} eg={s.eg} unpaired={s.unpaired} />
                  <div className="text-[10px] text-white/80 mt-2 space-y-0.5">
                    <div>Konfiguratsiya: <span className="font-mono">(t₂ᵍ)^{s.t2g} (e_g)^{s.eg}</span></div>
                    <div>Juftlashmagan e⁻: <span className="font-bold text-green-300">{s.unpaired}</span></div>
                    <div>Bog' uzunligi: <span className="font-mono">{s.bondLength || s.bondLengthEq} Å</span></div>
                  </div>
                </div>
              ))}
              {system.delta_o_LS && (
                <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                  <div className="text-yellow-300 font-bold text-[11px] mb-1">📊 Ligand maydoni parametrlari</div>
                  <div className="text-[10px] text-yellow-100 space-y-1">
                    <div>Δ_o (LS) = <span className="font-mono font-bold">{system.delta_o_LS} cm⁻¹</span></div>
                    <div>Δ_o (HS) = <span className="font-mono font-bold">{system.delta_o_HS} cm⁻¹</span></div>
                    <div>P (juftlik) = <span className="font-mono font-bold">{system.P_pairing} cm⁻¹</span></div>
                    <div className="text-yellow-300 mt-1 italic">Δ_o &gt; P → LS afzal; Δ_o &lt; P → HS afzal</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activePanel === "magnetism" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-blue-700/50 max-w-md w-[380px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-blue-200 flex items-center gap-2 text-sm"><span>🧲</span> Magnit xossalari va spin</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[11px] mb-1">📐 Spin only formula</div>
                <div className="p-2 bg-blue-950/60 rounded font-mono text-[11px] text-white text-center">μ = √[n(n+2)] μ_B</div>
                <p className="text-blue-100 text-[10px] leading-relaxed mt-2">n — juftlashmagan elektronlar soni.</p>
              </div>
              {Object.entries(system.states).map(([key, s]) => (
                <div key={key} className="rounded-lg p-3 border" style={{ backgroundColor: `${s.colorHex}22`, borderColor: `${s.colorHex}77` }}>
                  <div className="text-[11px] font-bold mb-1" style={{ color: s.colorHex }}>{s.name}</div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-white/90">
                    <div className="bg-black/30 rounded p-1.5 text-center"><div className="text-white/60 text-[9px]">n</div><div className="font-bold text-lg">{s.unpaired}</div></div>
                    <div className="bg-black/30 rounded p-1.5 text-center"><div className="text-white/60 text-[9px]">S</div><div className="font-bold text-lg">{s.S}</div></div>
                    <div className="bg-black/30 rounded p-1.5 text-center"><div className="text-white/60 text-[9px]">μ_B</div><div className="font-bold text-lg">{s.magneticMoment.toFixed(1)}</div></div>
                  </div>
                  <div className="text-[10px] text-center mt-2" style={{ color: s.colorHex }}>{s.magnetism}</div>
                </div>
              ))}
              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-1">🔬 SQUID magnetometriya</div>
                <p className="text-purple-100 text-[10px] leading-relaxed">Superconducting QUantum Interference Device — o'ta sezgir magnit qabuliyat o'lchagichi.</p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            HARORAT VA BOLTZMANN PANEL
            ═══════════════════════════════════════════════════════════ */}
        {activePanel === "temperature" && !fullscreenMode && (
          <div className="fixed top-20 right-4 w-80 max-h-[85vh] overflow-y-auto rounded-xl border border-orange-500/50 bg-gradient-to-br from-orange-950/95 to-red-950/95 backdrop-blur-md shadow-2xl z-40">
            <div className="sticky top-0 bg-gradient-to-r from-orange-800/90 to-red-800/90 px-4 py-3 border-b border-orange-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌡️</span>
                <h3 className="text-orange-200 font-bold text-sm">Harorat & Boltzmann</h3>
              </div>
              <button onClick={() => setActivePanel(null)} className="text-orange-300 hover:text-white text-lg">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-200 text-xs font-bold">Harorat (T)</span>
                  <span className="text-orange-100 text-lg font-mono font-bold">{temperature} K</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[9px] text-orange-300 mt-1">
                  <span>10 K</span><span>T₁/₂</span><span>500 K</span>
                </div>
                <div className="text-[10px] text-orange-100 mt-2 text-center">
                  {temperature < 80 && '❄️ Kriogen — LS barqaror'}
                  {temperature >= 80 && temperature < 200 && '🧊 Sovuq — LS ustun'}
                  {temperature >= 200 && temperature < 350 && '🌡️ Xona harorati — muvozanat'}
                  {temperature >= 350 && '🔥 Issiq — HS ustun'}
                </div>
              </div>

              <div className="bg-red-900/40 rounded-lg p-3 border border-red-700/40">
                <div className="text-red-300 font-bold text-[11px] mb-2">📊 Boltzmann taqsimoti</div>
                <p className="text-red-100 text-[10px] leading-relaxed mb-2">
                  N_HS/N_LS = g·exp(−ΔH/RT − ΔS/R)
                </p>
                {(() => {
                  // Yon paneldagi bilan bir xil hisob — nomuvofiqlik bo'lmasligi uchun
                  const lsPct = boltzmannFrac.LS
                  const hsPct = boltzmannFrac.HS
                  return (
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[10px] text-white/80 mb-1">
                          <span>LS (Low‑Spin)</span><span>{lsPct.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-black/40 rounded overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-purple-700" style={{ width: `${lsPct}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-white/80 mb-1">
                          <span>HS (High‑Spin)</span><span>{hsPct.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-black/40 rounded overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: `${hsPct}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[11px] mb-1">⚖️ T₁/₂ — kritik harorat</div>
                <p className="text-yellow-100 text-[10px] leading-relaxed mb-2">
                  50% LS = 50% HS holatidagi harorat. Har bir tizim uchun turlicha:
                </p>
                <div className="space-y-1 text-[10px] text-white/85">
                  <div className="flex justify-between"><span>[Fe(phen)₂(NCS)₂]:</span><span className="font-mono">T₁/₂ ≈ 176 K</span></div>
                  <div className="flex justify-between"><span>[Fe(bpy)₃]²⁺:</span><span className="font-mono">Faqat LS</span></div>
                  <div className="flex justify-between"><span>[Fe(H₂O)₆]²⁺:</span><span className="font-mono">Faqat HS</span></div>
                  <div className="flex justify-between"><span>[Fe(pic)₃]Cl₂:</span><span className="font-mono">T₁/₂ ≈ 114 K</span></div>
                </div>
              </div>

              <div className="bg-indigo-900/40 rounded-lg p-3 border border-indigo-700/40">
                <div className="text-indigo-300 font-bold text-[11px] mb-1">📐 Termodinamik parametrlar</div>
                <div className="space-y-1 text-[10px] text-white/85 font-mono">
                  <div className="flex justify-between"><span>ΔH (LS→HS):</span><span>≈ 20 kJ/mol</span></div>
                  <div className="flex justify-between"><span>ΔS (LS→HS):</span><span>≈ 60 J/(mol·K)</span></div>
                  <div className="flex justify-between"><span>ΔG (T=T₁/₂):</span><span>= 0</span></div>
                </div>
                <p className="text-indigo-100 text-[10px] mt-2">
                  T₁/₂ = ΔH/ΔS — entropiya harorat oshgan sari HS ni afzallik beradi.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            LIESST VA FOTOMAGNETIZM PANEL
            ═══════════════════════════════════════════════════════════ */}
        {activePanel === "liesst" && !fullscreenMode && (
          <div className="fixed top-20 left-4 w-80 max-h-[85vh] overflow-y-auto rounded-xl border border-yellow-500/50 bg-gradient-to-br from-yellow-950/95 to-amber-950/95 backdrop-blur-md shadow-2xl z-40">
            <div className="sticky top-0 bg-gradient-to-r from-yellow-800/90 to-amber-800/90 px-4 py-3 border-b border-yellow-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">💡</span>
                <h3 className="text-yellow-200 font-bold text-sm">LIESST — Fotomagnetizm</h3>
              </div>
              <button onClick={() => setActivePanel(null)} className="text-yellow-300 hover:text-white text-lg">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[11px] mb-2">🔬 LIESST nima?</div>
                <p className="text-yellow-100 text-[11px] leading-relaxed">
                  <strong>Light‑Induced Excited Spin State Trapping</strong> — 1984‑yilda A. Hauser tomonidan kashf etilgan hodisa. Kriogen haroratda (T &lt; 50 K) LS holatidagi Fe(II) kompleksiga yashil yorug'lik (λ ≈ 514 nm) tushirilsa, u metastabil HS holatiga o'tadi va kunlab saqlanadi.
                </p>
              </div>

              <div className="bg-amber-900/40 rounded-lg p-3 border border-amber-700/40">
                <div className="text-amber-300 font-bold text-[11px] mb-2">⚡ Mexanizm (3 bosqich)</div>
                <ol className="space-y-2 text-[10px] text-amber-100 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-amber-400 font-bold flex-shrink-0">1.</span>
                    <span><strong className="text-amber-300">¹A₁g → ¹T₁g:</strong> Yashil yorug'lik (514 nm) singdiriladi, LS Fe(II) qo'zg'algan singlet holatga o'tadi.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-400 font-bold flex-shrink-0">2.</span>
                    <span><strong className="text-amber-300">¹T₁g → ³T₁g:</strong> Interkombinatsion o'tish (ISC) — spin‑orbital ta'sir orqali triplet holat hosil bo'ladi.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-400 font-bold flex-shrink-0">3.</span>
                    <span><strong className="text-amber-300">³T₁g → ⁵T₂g:</strong> Yana ISC — metastabil HS kvintet holat, uzoq umr ko'radi (soatlab–kunlab).</span>
                  </li>
                </ol>
              </div>

              <div className="bg-red-900/40 rounded-lg p-3 border border-red-700/40">
                <div className="text-red-300 font-bold text-[11px] mb-2">↩️ Reverse‑LIESST</div>
                <p className="text-red-100 text-[10px] leading-relaxed">
                  Qizil yorug'lik (λ ≈ 830 nm) tushirilsa, HS → LS ga qaytadi. Bu <strong>fotomagnetik xotira</strong> uchun asos — bir bit ma'lumot bitta molekulada saqlanadi (molekulyar kompyuter!).
                </p>
              </div>

              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-300 font-bold text-[11px] mb-2">🌡️ T(LIESST)</div>
                <p className="text-purple-100 text-[10px] leading-relaxed mb-2">
                  HS metastabil holat 50% aholi yo'qotgan harorat. Har bir birikma uchun individual:
                </p>
                <div className="space-y-1 text-[10px] font-mono">
                  <div className="flex justify-between text-white/85"><span>[Fe(phen)₂(NCS)₂]:</span><span className="text-yellow-300">78 K</span></div>
                  <div className="flex justify-between text-white/85"><span>[Fe(pic)₃]Cl₂:</span><span className="text-yellow-300">63 K</span></div>
                  <div className="flex justify-between text-white/85"><span>[Fe(ptz)₆](BF₄)₂:</span><span className="text-yellow-300">50 K</span></div>
                </div>
              </div>

              <div className="bg-blue-900/40 rounded-lg p-3 border border-blue-700/40">
                <div className="text-blue-300 font-bold text-[11px] mb-2">🎯 Amaliy qo'llanilish</div>
                <ul className="space-y-1 text-[10px] text-blue-100 leading-relaxed">
                  <li>• 💾 <strong>Molekulyar xotira</strong> — 1 bit/molekula (klassik ~10⁶ atom)</li>
                  <li>• 🔬 <strong>Nano‑sensorlar</strong> — bosim, harorat, yorug'lik</li>
                  <li>• 🎨 <strong>Termoxrom bo'yoqlar</strong> — rangi haroratga qarab</li>
                  <li>• ⚛️ <strong>Kvant kompyuter</strong> — molekulyar qubit</li>
                </ul>
              </div>

              <div className="bg-green-900/40 rounded-lg p-3 border border-green-700/40">
                <div className="text-green-300 font-bold text-[11px] mb-1">💡 Interaktiv namoyish</div>
                <button
                  onClick={() => { setLaserWavelength(532); setTriggerLaser(true) }}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-[11px] font-bold hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg"
                >
                  💚 hν (514 nm) — LS → HS
                </button>
                <p className="text-green-100 text-[9px] mt-2 text-center italic">
                  Yashil lazer bilan spin holatini o'zgartiring
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TARIX PANEL (History)
            ═══════════════════════════════════════════════════════════ */}
        {activePanel === "history" && !fullscreenMode && (
          <div className="fixed top-20 right-4 w-80 max-h-[85vh] overflow-y-auto rounded-xl border border-amber-500/50 bg-gradient-to-br from-amber-950/95 to-orange-950/95 backdrop-blur-md shadow-2xl z-40">
            <div className="sticky top-0 bg-gradient-to-r from-amber-800/90 to-orange-800/90 px-4 py-3 border-b border-amber-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                <h3 className="text-amber-200 font-bold text-sm">Kashfiyot tarixi</h3>
              </div>
              <button onClick={() => setActivePanel(null)} className="text-amber-300 hover:text-white text-lg">✕</button>
            </div>
            <div className="p-4 space-y-3">
              {[
                { year: '1929', name: 'Hans Bethe', event: 'Kristall maydon nazariyasi (CFT) asoslari — d‑orbitallar bo\'linishi izohlangan.' },
                { year: '1931', name: 'Linus Pauling', event: 'Valentlik bog\'lanish nazariyasi (VBT) — magnit xossalar orqali hibridlanish aniqlangan.' },
                { year: '1931', name: 'Cambi & Szegő', event: 'Fe(III) dithiocarbamate kompleksida birinchi Spin Crossover (SCO) kuzatilgan.' },
                { year: '1937', name: 'Jahn & Teller', event: 'Jahn‑Teller teoremasi: nochiziqli qo\'zg\'algan holat geometriya buzilishi orqali barqarorlashadi.' },
                { year: '1952', name: 'Orgel', event: 'Ligand maydon nazariyasi (LFT) — CFT + MOT kombinatsiyasi.' },
                { year: '1964', name: 'Baker & Bobonich', event: '[Fe(phen)₂(NCS)₂] uchun aniq termodinamik SCO o\'lchash.' },
                { year: '1967', name: 'Robin & Day', event: 'Aralash valentli komplekslar tasnifi — I, II, III sinflar (Class I/II/III).' },
                { year: '1969', name: 'Creutz & Taube', event: '[(NH₃)₅Ru‑pyrazine‑Ru(NH₃)₅]⁵⁺ — Class II/III chegara kompleksi.' },
                { year: '1984', name: 'Decurtins & Gütlich', event: 'LIESST hodisasi kashf etilgan — yorug\'lik orqali spin holatini o\'zgartirish.' },
                { year: '1994', name: 'Hauser', event: 'Reverse‑LIESST — qizil yorug\'lik bilan qaytish (830 nm).' },
                { year: '2004', name: 'Bousseksou', event: 'Molekulyar xotira uchun SCO qo\'llanilishi — nanotexnologiya.' },
                { year: '2011', name: 'Létard', event: 'T(LIESST) universal empirik qonuni: T(LIESST) = T₀ − 0.3·T₁/₂' },
                { year: '2019', name: 'Halcrow', event: 'SCO monografiyasi — zamonaviy tekshiruvlar sintezi.' },
              ].map((h, i) => (
                <div key={i} className="bg-amber-900/40 rounded-lg p-2.5 border border-amber-700/40">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-300 font-bold text-xs bg-amber-950/60 px-2 py-0.5 rounded font-mono">{h.year}</span>
                    <span className="text-amber-200 font-semibold text-[11px]">{h.name}</span>
                  </div>
                  <p className="text-amber-100 text-[10px] leading-relaxed">{h.event}</p>
                </div>
              ))}
              <div className="bg-orange-900/40 rounded-lg p-3 border border-orange-700/40">
                <div className="text-orange-300 font-bold text-[11px] mb-1">🏆 Nobel mukofotlari</div>
                <ul className="space-y-1 text-[10px] text-orange-100">
                  <li>• 1913 — Alfred Werner (koordinatsion kimyo)</li>
                  <li>• 1954 — Linus Pauling (kimyoviy bog'lanish)</li>
                  <li>• 1966 — Robert Mulliken (MO nazariyasi)</li>
                  <li>• 1981 — Fukui & Hoffmann (orbitallar simmetriyasi)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TEST PANEL (Quiz)
            ═══════════════════════════════════════════════════════════ */}
        {activePanel === "test" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setActivePanel(null)}>
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-green-500/50 bg-gradient-to-br from-green-950/95 to-emerald-950/95 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-green-800/95 to-emerald-800/95 px-5 py-4 border-b border-green-500/40 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-green-100 font-bold text-lg">Elektron izomeriya testi</h3>
                </div>
                <button onClick={() => setActivePanel(null)} className="text-green-300 hover:text-white text-2xl">✕</button>
              </div>
              <div className="p-5 space-y-4">
                {[
                  {
                    q: '1. LS va HS holatlari orasidagi asosiy farq nima?',
                    opts: [
                      'Metall atomining o\'zi almashadi',
                      'Ligandlarning turi o\'zgaradi',
                      'd‑elektronlar taqsimoti (t₂g/eg) farqlanadi',
                      'Kompleksning umumiy zaryadi o\'zgaradi'
                    ],
                    correct: 2,
                    exp: 'Elektron izomeriyada faqat elektronlarning d‑orbitallar bo\'yicha taqsimoti farqlanadi.'
                  },
                  {
                    q: '2. Fe(II) d⁶ ioni uchun HS holatida nechta juftlashmagan elektron bor?',
                    opts: ['0', '2', '4', '6'],
                    correct: 2,
                    exp: 'HS Fe(II): t₂g⁴ eg² — 4 juftlashmagan elektron (S=2, μ=4.9 μ_B).'
                  },
                  {
                    q: '3. Spin‑only magnit moment formulasi qanday?',
                    opts: [
                      'μ = n(n+2)',
                      'μ = √(n(n+2))',
                      'μ = √(n·2)',
                      'μ = n²+2'
                    ],
                    correct: 1,
                    exp: 'μ_S = √(n(n+2)) Bohr magnetonlarida, n — juftlashmagan elektronlar soni.'
                  },
                  {
                    q: '4. LIESST hodisasi qaysi yilda va kim tomonidan kashf etilgan?',
                    opts: [
                      '1929 – Bethe',
                      '1984 – Decurtins/Gütlich',
                      '2001 – Hauser',
                      '1913 – Werner'
                    ],
                    correct: 1,
                    exp: 'LIESST 1984‑yilda Decurtins va Gütlich guruhi tomonidan kashf etilgan.'
                  },
                  {
                    q: '5. LIESST tajribasida qanday to\'lqin uzunligi ishlatiladi (LS→HS)?',
                    opts: ['UV — 254 nm', 'Yashil — 514 nm', 'Qizil — 830 nm', 'IK — 1064 nm'],
                    correct: 1,
                    exp: 'Yashil argon lazer (514 nm) LS→HS uchun, qizil (830 nm) esa reverse‑LIESST uchun ishlatiladi.'
                  },
                  {
                    q: '6. Jahn‑Teller effektining sababi nima?',
                    opts: [
                      'Metall ioni ortadi',
                      'Nochiziqli qo\'zg\'algan elektron konfiguratsiya energiyasini pasaytirish uchun buziladi',
                      'Ligandlar juda katta',
                      'Harorat oshadi'
                    ],
                    correct: 1,
                    exp: 'Jahn‑Teller teoremasi: elektron degeneratsiyasi geometrik buzilish orqali yo\'qoladi. Cu²⁺ (d⁹) uchun klassik misol.'
                  },
                  {
                    q: '7. Robin‑Day tasnifida Class III qanday xususiyatga ega?',
                    opts: [
                      'Mahalliy valentli, aloqasiz',
                      'Yarim delokalizatsiya, kuchsiz aloqa',
                      'To\'liq delokalizatsiya, valentlik teng',
                      'Fotoreaktiv holat'
                    ],
                    correct: 2,
                    exp: 'Class III — elektron to\'liq delokalizatsiyalangan, metallar formal valentligi teng (masalan Creutz‑Taube).'
                  },
                  {
                    q: '8. Cu²⁺ (d⁹) ioni uchun Jahn‑Teller natijasi qanday?',
                    opts: [
                      'Oktaedr o\'zgarmaydi',
                      'Ikki aksial bog\' cho\'ziladi (tetragonal buzilish)',
                      'Sferaviy simmetriya',
                      'Tetraedr'
                    ],
                    correct: 1,
                    exp: 'Cu²⁺ (d⁹, eg³): aksial bog\'lar cho\'ziladi (~2.3 Å), ekvatorial qisqaradi (~2.0 Å). Tetragonal buzilish.'
                  },
                  {
                    q: '9. Termodinamikada T₁/₂ = ΔH/ΔS ifodasi nimani ko\'rsatadi?',
                    opts: [
                      'Faqat entalpiya bilan aniqlanadi',
                      'LS va HS aholining 50/50 bo\'lishi harorati',
                      'Erish harorati',
                      'Faqat entropiya bilan bog\'liq'
                    ],
                    correct: 1,
                    exp: 'ΔG=0 bo\'lganda T=T₁/₂, ya\'ni 50% LS + 50% HS. Bu SCO tizimlar uchun asosiy parametr.'
                  },
                  {
                    q: '10. Valentlik tautomerizmi (VT) qaysi ligandlar bilan bog\'liq?',
                    opts: [
                      'Faqat halogenidlar',
                      'Non‑innocent (redoks‑faol) ligandlar — masalan katexolat',
                      'Faqat H₂O',
                      'Metall karbonillar'
                    ],
                    correct: 1,
                    exp: 'VT — non‑innocent ligand (dioxolen, semixinon, katexolat) va metall orasida ichki elektron ko\'chishi.'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-green-900/40 rounded-lg p-4 border border-green-700/40">
                    <div className="text-green-100 font-semibold text-sm mb-3">{item.q}</div>
                    <div className="space-y-2">
                      {item.opts.map((opt, oi) => {
                        const isSelected = quizAnswers[idx] === oi
                        const isCorrect = oi === item.correct
                        const showResult = quizAnswers[idx] !== undefined
                        return (
                          <button
                            key={oi}
                            onClick={() => setQuizAnswers({ ...quizAnswers, [idx]: oi })}
                            className={`w-full text-left px-3 py-2 rounded-lg text-[12px] transition-all border ${
                              showResult
                                ? isCorrect
                                  ? 'bg-emerald-800/60 border-emerald-400/70 text-emerald-100'
                                  : isSelected
                                    ? 'bg-red-800/60 border-red-400/70 text-red-100'
                                    : 'bg-green-950/40 border-green-800/40 text-green-300/70'
                                : 'bg-green-950/40 border-green-800/40 text-green-100 hover:bg-green-800/60 hover:border-green-500/50'
                            }`}
                          >
                            <span className="font-mono mr-2">{String.fromCharCode(65 + oi)}.</span>
                            {opt}
                            {showResult && isCorrect && <span className="float-right">✓</span>}
                            {showResult && isSelected && !isCorrect && <span className="float-right">✗</span>}
                          </button>
                        )
                      })}
                    </div>
                    {quizAnswers[idx] !== undefined && (
                      <div className="mt-3 p-2 rounded bg-emerald-950/60 border border-emerald-700/40 text-emerald-100 text-[11px] leading-relaxed">
                        <strong className="text-emerald-300">💡 Izoh:</strong> {item.exp}
                      </div>
                    )}
                  </div>
                ))}
                <div className="bg-gradient-to-r from-green-800/60 to-emerald-800/60 rounded-lg p-4 border border-green-500/40 text-center">
                  <div className="text-green-200 font-bold text-lg mb-1">
                    Natija: {Object.entries(quizAnswers).filter(([i, a]) => {
                      const corrects = [2,2,1,1,1,1,2,1,1,1]
                      return a === corrects[parseInt(i)]
                    }).length} / 10
                  </div>
                  <div className="text-green-100 text-xs">
                    Har bir savol ustida ishlab, tushunchani mustahkamlab boring.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            PDF MODAL
            ═══════════════════════════════════════════════════════════ */}
        {pdfGenerating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="rounded-2xl border border-indigo-500/50 bg-gradient-to-br from-indigo-950/95 to-purple-950/95 p-6 max-w-md shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                <div>
                  <div className="text-indigo-200 font-bold">PDF tayyorlanmoqda...</div>
                  <div className="text-indigo-300 text-xs">Bir necha soniya kuting</div>
                </div>
              </div>
              <div className="text-indigo-100 text-[11px] leading-relaxed">
                DejaVu Sans fonti yuklanmoqda, 10 bo'limli ilmiy hisobot generatsiya qilinmoqda: kirish, LS/HS holatlari, Jahn‑Teller, valentlik tautomerizmi, aralash valentli, LIESST, magnit xossalar, adabiyotlar...
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            CITATION MODAL (Iqtiboslar)
            ═══════════════════════════════════════════════════════════ */}
        {activePanel === "citation" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setActivePanel(null)}>
            <div
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-blue-500/50 bg-gradient-to-br from-blue-950/95 to-indigo-950/95 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-800/95 to-indigo-800/95 px-5 py-4 border-b border-blue-500/40 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  <h3 className="text-blue-100 font-bold text-lg">Ilmiy adabiyotlar</h3>
                </div>
                <button onClick={() => setActivePanel(null)} className="text-blue-300 hover:text-white text-2xl">✕</button>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { n: 1, ref: 'Cambi, L.; Szegő, L. Über die magnetische Susceptibilität der komplexen Verbindungen. Ber. Dtsch. Chem. Ges. 1931, 64, 2591.' },
                  { n: 2, ref: 'Bethe, H. Termaufspaltung in Kristallen. Ann. Phys. 1929, 395, 133–208.' },
                  { n: 3, ref: 'Jahn, H. A.; Teller, E. Stability of Polyatomic Molecules in Degenerate Electronic States. Proc. R. Soc. Lond. A 1937, 161, 220–235.' },
                  { n: 4, ref: 'Robin, M. B.; Day, P. Mixed Valence Chemistry — A Survey and Classification. Adv. Inorg. Chem. Radiochem. 1967, 10, 247–422.' },
                  { n: 5, ref: 'Creutz, C.; Taube, H. Direct Approach to Measuring the Franck–Condon Barrier. J. Am. Chem. Soc. 1969, 91, 3988.' },
                  { n: 6, ref: 'Decurtins, S.; Gütlich, P.; Köhler, C. P.; Spiering, H.; Hauser, A. Light‑induced excited spin state trapping. Chem. Phys. Lett. 1984, 105, 1–4.' },
                  { n: 7, ref: 'Hauser, A. Reversibility of light‑induced excited spin state trapping. Coord. Chem. Rev. 1991, 111, 275–290.' },
                  { n: 8, ref: 'Gütlich, P.; Hauser, A.; Spiering, H. Thermal and Optical Switching of Iron(II) Complexes. Angew. Chem. Int. Ed. 1994, 33, 2024.' },
                  { n: 9, ref: 'Létard, J.‑F. Photomagnetism of iron(II) spin crossover complexes — the T(LIESST) approach. J. Mater. Chem. 2006, 16, 2550–2559.' },
                  { n: 10, ref: 'Halcrow, M. A. Spin‑Crossover Materials: Properties and Applications. Wiley, 2013, ISBN 978‑1‑119‑99867‑9.' },
                  { n: 11, ref: 'Housecroft, C. E.; Sharpe, A. G. Inorganic Chemistry, 5th ed. Pearson, 2018, Ch. 20.' },
                  { n: 12, ref: 'Miessler, G. L.; Fischer, P. J.; Tarr, D. A. Inorganic Chemistry, 5th ed. Pearson, 2014, Ch. 11.' },
                  { n: 13, ref: 'Shriver & Atkins\' Inorganic Chemistry, 6th ed. Oxford Univ. Press, 2014, Ch. 20.' },
                  { n: 14, ref: 'Bousseksou, A.; Molnár, G.; Salmon, L.; Nicolazzi, W. Molecular spin crossover phenomenon: recent advances. Chem. Soc. Rev. 2011, 40, 3313–3335.' },
                ].map((c) => (
                  <div key={c.n} className="bg-blue-900/40 rounded-lg p-3 border border-blue-700/40">
                    <div className="flex gap-2">
                      <span className="text-blue-300 font-mono font-bold text-xs flex-shrink-0">[{c.n}]</span>
                      <span className="text-blue-100 text-[11px] leading-relaxed">{c.ref}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
      {/* /flex-1 flex flex-row konteyner tugadi */}

        {/* ═══════════════════════════════════════════════════════════
            PASTKI STATUS BAR
            ═══════════════════════════════════════════════════════════ */}
        {!fullscreenMode && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-blue-950/90 backdrop-blur-md border-t border-purple-500/30 py-2 px-4 z-30">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-purple-200">
              <div className="flex items-center gap-4">
                <span>🧪 <strong>{system.formula}</strong></span>
                <span className="hidden md:inline">🌡️ T = {temperature} K</span>
                <span className="hidden md:inline">⚡ Holat: <strong style={{ color: currentState.data.colorHex }}>{currentState.data.name}</strong></span>
                <span className="hidden lg:inline">🧲 μ = {currentState.data.magneticMoment.toFixed(2)} μ_B</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-purple-300">
                <span>JDA‑Kimyo.uz</span>
                <span>•</span>
                <span>Elektron izomeriya PRO</span>
              </div>
            </div>
          </div>
        )}
      </main>
  )
}
