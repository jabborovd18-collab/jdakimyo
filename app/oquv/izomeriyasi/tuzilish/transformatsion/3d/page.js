"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

// ═══════════════════════════════════════════════════════════════════════════
// CPK RANGLARI (IUPAC standartlari)
// ═══════════════════════════════════════════════════════════════════════════
const CPK = {
  Co: 0xF090A0, Cr: 0x8A99C7, Fe: 0xE06633, Ca: 0x3DFF00,
  Ni: 0x50D050, Cu: 0xC88033, Pt: 0xD0D0E0, Pd: 0x006985,
  N: 0x3050F8, C: 0x909090, H: 0xFFFFFF, O: 0xFF0D0D,
  Cl: 0x1FF01F, S: 0xFFFF30, P: 0xFF8000,
  bond: 0x8B9DC3, hbond: 0x66CCFF,
  // Konformatsiya rang belgilari
  delta:    0x48DBFB,   // δ konformatsiya — moviy
  lambda:   0xF368E0,   // λ konformatsiya — pushti
  envelope: 0xFFD700,   // Envelope konformatsiya — oltin
  chair:    0x50E3A4,   // Kreslo konformatsiya — mint
  twist:    0xFF6EC7,   // Twist konformatsiya — magenta
  planar:   0xC0C0C0,   // Planar — kumush
  hbondCol: 0x66CCFF,
  strain:   0xFF4444,   // Van der Waals sterik itarilish — qizil
  berry:    0xFFAA00    // Berry pseudorotation — to'q sariq
}

// ═══════════════════════════════════════════════════════════════════════════
// TRANSFORMATSION (KONFORMATSION) IZOMER KOMPLEKSLAR DATABASE
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  Coen3_conf: {
    id: "Coen3_conf",
    formula: "[Co(en)₃]³⁺",
    fullSalt: "[Co(en)₃]Cl₃ — konformatsion izomerlar",
    name: "Tris(etilendiamin)kobalt(III) — Corey-Bailar konformatsiyalari",
    isomerType: "chelate",  // xelat halqa konformatsiyalari
    geometry: "Oktaedrik",
    coordinationNumber: 6,
    hybridization: "d²sp³",
    center: { element: "Co", color: CPK.Co, radius: 0.42, charge: "+3" },
    ligandName: "etilendiamin (en)",
    ringSize: 5,  // 5-a'zoli xelat halqa (Co-N-C-C-N)
    bondLengthReal: "Co–N: 1.98 Å  |  C–C: 1.53 Å",
    dElectrons: 6,
    isomers: {
      lel3: {
        label: "lel₃ (δδδ / λλλ)",
        shortLabel: "lel₃",
        color: "Termodinamik jihatdan barqaror",
        description: "3 ta xelat halqasi C₃ o'qi bilan PARALLEL (lel = parallel)",
        confPattern: "δδδ (yoki λλλ)",
        symmetry: "D₃",
        pointGroup: "D₃",
        energy: 0,                    // kJ/mol (nisbatan)
        occupationRatio: 0.42,        // 42%
        color_hex: "#22C55E",
        stability: "Eng barqaror izomer — 3 ta bir xil halqa yo'nalishi",
        dihedralAngle: 55,             // N-C-C-N burchagi
        stericStrain: "Minimum (0 kJ/mol)"
      },
      lel2ob: {
        label: "lel₂ob (δδλ / λλδ)",
        shortLabel: "lel₂ob",
        color: "Barqaror — statistik ko'p",
        description: "2 ta halqa lel + 1 ta ob (obliq)",
        confPattern: "δδλ (yoki λλδ)",
        symmetry: "C₂",
        pointGroup: "C₂",
        energy: 1.6,
        occupationRatio: 0.38,        // 38%
        color_hex: "#EAB308",
        stability: "Ikkinchi barqaror — statistik 3 usul",
        dihedralAngle: 52,
        stericStrain: "Zaif (1.6 kJ/mol)"
      },
      lelob2: {
        label: "lelob₂ (δλλ / λδδ)",
        shortLabel: "lelob₂",
        color: "Kam barqaror",
        description: "1 ta halqa lel + 2 ta ob",
        confPattern: "δλλ (yoki λδδ)",
        symmetry: "C₂",
        pointGroup: "C₂",
        energy: 3.2,
        occupationRatio: 0.15,        // 15%
        color_hex: "#F97316",
        stability: "Uchinchi barqaror — statistik 3 usul",
        dihedralAngle: 48,
        stericStrain: "O'rta (3.2 kJ/mol)"
      },
      ob3: {
        label: "ob₃ (δλδ / λδλ)",
        shortLabel: "ob₃",
        color: "Eng kam barqaror",
        description: "3 ta halqasi obliq — C₃ o'qi bilan qiyshiq",
        confPattern: "δλδ (yoki λδλ)",
        symmetry: "D₃",
        pointGroup: "D₃",
        energy: 4.8,
        occupationRatio: 0.05,        // 5%
        color_hex: "#DC2626",
        stability: "Eng noqulay — sterik itarilish kuchli",
        dihedralAngle: 45,
        stericStrain: "Kuchli (4.8 kJ/mol)"
      }
    },
    scientificNotes: "Corey va Bailar (1959) [Co(en)₃]³⁺ ning 4 ta konformatsion izomeri mavjudligini ko'rsatdilar: lel₃, lel₂ob, lelob₂, ob₃. Har bir en xelat halqasi C₃ asosiy o'qi bilan parallel (lel — \"parallel\") yoki qiyshiq (ob — \"obliq\") joylashishi mumkin. Bu konformatsion boylik entropik ustunlikni beradi. Xona haroratida ~42% lel₃, 38% lel₂ob, 15% lelob₂, 5% ob₃.",
    discoveryYear: 1959,
    discoverer: "E. J. Corey & J. C. Bailar Jr."
  },
  CaEDTA_conf: {
    id: "CaEDTA_conf",
    formula: "[Ca(EDTA)]²⁻",
    fullSalt: "Na₂[Ca(EDTA)] — kaltsiy edetat (dori)",
    name: "Kaltsiy edetat — EDTA konformatsion izomerlari",
    isomerType: "edta",
    geometry: "Iskaji dodekaedrik (8-koordinatsion)",
    coordinationNumber: 8,
    hybridization: "sp³d⁴",
    center: { element: "Ca", color: CPK.Ca, radius: 0.44, charge: "+2" },
    ligandName: "Etilendiamin tetraatsetat (EDTA⁴⁻)",
    ringSize: "5+5+5+5+5",  // 5 ta 5-a'zoli halqa
    bondLengthReal: "Ca–N: 2.46 Å  |  Ca–O: 2.42 Å",
    dElectrons: 0,
    isomers: {
      A: {
        label: "A-konformer",
        shortLabel: "A",
        color: "Termodinamik jihatdan afzal",
        description: "5 ta xelat halqasi klassik chair-envelope shakli",
        confPattern: "λδλδλ",
        symmetry: "C₂",
        pointGroup: "C₂",
        energy: 0,
        occupationRatio: 0.55,
        color_hex: "#3B82F6",
        stability: "Eng barqaror — kaltsiy tibbiy komplekslarida ko'p uchraydi",
        dihedralAngle: 62,
        stericStrain: "Minimum (0 kJ/mol)",
        biologicalRole: "Qo'rg'oshin, kadmiy zaharlanishida chelation therapy"
      },
      B: {
        label: "B-konformer",
        shortLabel: "B",
        color: "Kam barqaror",
        description: "Halqalar aralash konformatsiya (twist-envelope)",
        confPattern: "λλδδλ",
        symmetry: "C₁",
        pointGroup: "C₁",
        energy: 2.4,
        occupationRatio: 0.30,
        color_hex: "#F59E0B",
        stability: "Oraliq barqarorlik",
        dihedralAngle: 58,
        stericStrain: "Zaif (2.4 kJ/mol)"
      },
      C: {
        label: "C-konformer",
        shortLabel: "C",
        color: "Eng kam barqaror",
        description: "Barcha halqalari twist-boat (juda kam)",
        confPattern: "δδδδδ",
        symmetry: "C₁",
        pointGroup: "C₁",
        energy: 5.1,
        occupationRatio: 0.15,
        color_hex: "#EF4444",
        stability: "Nokulay — yuqori sterik ta'sir",
        dihedralAngle: 51,
        stericStrain: "Kuchli (5.1 kJ/mol)"
      }
    },
    scientificNotes: "EDTA (H₄edta) — poli-xelat ligand, 5 ta 5-a'zoli xelat halqasi hosil qiladi (2 ta N va 4 ta O donor). Har bir halqasi mustaqil konformatsion holatga ega — bu konformatsion boylik EDTA ning turli metallar bilan mos tushishga imkon beradi. Kaltsiy edetat — qo'rg'oshin va kadmiy zaharlanishida FDA ro'yxatiga kirgan dori. Konformatsion tanlash tibbiy samaradorlikning asosidir.",
    discoveryYear: 1935,
    discoverer: "Ferdinand Münz (IG Farben)"
  },
  Berry_TBP: {
    id: "Berry_TBP",
    formula: "[Fe(CO)₅]",
    fullSalt: "Temir pentakarbonil — Berry pseudorotation namunasi",
    name: "Temir pentakarbonil — Berry pseudorotation",
    isomerType: "berry",
    geometry: "Trigonal bipiramidal (5-koordinatsion)",
    coordinationNumber: 5,
    hybridization: "dsp³",
    center: { element: "Fe", color: CPK.Fe, radius: 0.42, charge: "0" },
    ligandName: "Karbonil (CO)",
    ringSize: "yo'q",
    bondLengthReal: "Fe–C(ekv): 1.83 Å  |  Fe–C(aks): 1.81 Å",
    dElectrons: 8,
    isomers: {
      tbp: {
        label: "Trigonal bipiramidal (TBP)",
        shortLabel: "TBP",
        color: "Asosiy holat — D₃ₕ simmetriya",
        description: "3 ta ekvatorial + 2 ta aksial CO (kutupli)",
        confPattern: "D₃ₕ",
        symmetry: "D₃ₕ",
        pointGroup: "D₃ₕ",
        energy: 0,
        occupationRatio: 0.85,
        color_hex: "#3B82F6",
        stability: "Termodinamik minimum — energiya asosiy holati",
        axialAngle: 180,
        equatorialAngle: 120,
        stericStrain: "0 kJ/mol"
      },
      sp: {
        label: "Kvadrat piramidal (SP)",
        shortLabel: "SP",
        color: "Oraliq holat — Berry o'tish paytida",
        description: "4 ekvatorial + 1 apex CO (C₄ᵥ)",
        confPattern: "C₄ᵥ",
        symmetry: "C₄ᵥ",
        pointGroup: "C₄ᵥ",
        energy: 8.5,             // kJ/mol — pseudorotation to'sig'i
        occupationRatio: 0.15,   // Oraliq holat
        color_hex: "#F59E0B",
        stability: "Berry to'siq holati — 8.5 kJ/mol yuqoriroq",
        axialAngle: 105,
        equatorialAngle: 90,
        stericStrain: "8.5 kJ/mol"
      }
    },
    scientificNotes: "Berry (1960) trigonal bipiramidal komplekslarda ligandlar orasida almashuv mexanizmini bashorat qildi: TBP ↔ SP ↔ TBP (yangi orientatsiya). Bu — pseudorotatsiya — ligandlar bog'i uzilmasdan mavqe almashadi. [Fe(CO)₅] uchun NMR spektrida barcha 5 CO ligand ekvivalent ko'rinadi (10⁷ s⁻¹ tez o'tish). Bu — konformatsion dinamikaning eng klassik va nazariy nozik namunasi.",
    discoveryYear: 1960,
    discoverer: "R. Stephen Berry (Chicago)"
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁷ 4s²", oxidation: "+3", role: "Markaziy ion (d⁶)", color: "#F090A0" },
  Ca: { name: "Kaltsiy (Ca)", atomic: 20, mass: "40.08 u", config: "[Ar]", oxidation: "+2", role: "Markaziy ion (d⁰)", color: "#3DFF00" },
  Fe: { name: "Temir (Fe)", atomic: 26, mass: "55.85 u", config: "[Ar] 3d⁶ 4s²", oxidation: "0", role: "Markaziy ion (d⁸, 5-koord)", color: "#E06633" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "En/EDTA donor atomi", hybridization: "sp³", color: "#3050F8" },
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.01 u", config: "[He] 2s² 2p²", role: "en/EDTA ko'prik", hybridization: "sp³", color: "#909090" },
  O:  { name: "Kislorod (O)", atomic: 8, mass: "16.00 u", config: "[He] 2s² 2p⁴", role: "EDTA karboksilat", hybridization: "sp²", color: "#FF0D0D" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "en/EDTA tarkibi", color: "#FFFFFF" }
}

// ═══════════════════════════════════════════════════════════════════════════
// KONFORMATSIYA TURLARI (nomenklatura)
// ═══════════════════════════════════════════════════════════════════════════
const CONFORMATION_TYPES = [
  { name: "δ (delta)",      symbol: "δ", desc: "Chelat halqasi P-tipida (o'ng qo'l vint)", color: "#48DBFB" },
  { name: "λ (lambda)",     symbol: "λ", desc: "Chelat halqasi M-tipida (chap qo'l vint)", color: "#F368E0" },
  { name: "lel (parallel)", symbol: "‖", desc: "Xelat halqasi C₃ o'qi bilan parallel", color: "#22C55E" },
  { name: "ob (obliq)",     symbol: "∠", desc: "Xelat halqasi C₃ o'qi bilan qiyshiq", color: "#F97316" },
  { name: "envelope",       symbol: "E", desc: "5-a'zoli halqada 1 atom tekislikdan tashqarida", color: "#FFD700" },
  { name: "twist",          symbol: "T", desc: "5-a'zoli halqada 2 atom qarama-qarshi tomonda", color: "#FF6EC7" },
  { name: "chair",          symbol: "C", desc: "6-a'zoli halqa kreslo shakli", color: "#50E3A4" },
  { name: "boat",           symbol: "B", desc: "6-a'zoli halqa qayiq shakli", color: "#F59E0B" }
]

// ═══════════════════════════════════════════════════════════════════════════
// TARIXIY VOQEALAR
// ═══════════════════════════════════════════════════════════════════════════
const HISTORY = [
  {
    year: 1935, hero: "Ferdinand Münz",
    title: "EDTA sintezi (IG Farben, Germaniya)",
    text: "Nemis kimyogari Münz IG Farben laboratoriyasida etilendiamintetraatsetat (EDTA) ni sintez qildi. Bu — koordinatsion kimyoning eng kuchli xelatlovchi ligandlaridan biri: 6 dentat (2N + 4O), 5 ta xelat halqa. Bugungi kunda tibbiyot, sanoat, tozalash mahsulotlarida keng qo'llaniladi."
  },
  {
    year: 1950, hero: "Derek Barton",
    title: "Konformatsion tahlil asosi (organik kimyo)",
    text: "Britaniya kimyogari Barton (Nobel 1969) sikloheksan konformatsiyalari uchun chair-boat modelini asosladi. Uning ishlari koordinatsion kimyoga o'tkazilib, xelat halqa konformatsiyalarining muhimligini aniqladi. \"Konformatsion tahlil\" atamasini kimyoviy leksikonga kiritdi."
  },
  {
    year: 1959, hero: "E. J. Corey & J. C. Bailar Jr.",
    title: "[Co(en)₃]³⁺ konformatsiyalari (Illinois)",
    text: "Elias James Corey (Nobel 1990) va John C. Bailar Jr. [Co(en)₃]³⁺ komplekstin 4 ta konformatsion izomer (lel₃, lel₂ob, lelob₂, ob₃) mavjud ekanligini isbotladilar. Ular \"lel\" (parallel) va \"ob\" (obliq) atamalarini kiritdilar. Bu — koordinatsion kimyoda konformatsion tahlilning tug'ilishi bo'ldi."
  },
  {
    year: 1960, hero: "R. Stephen Berry (Chicago)",
    title: "Berry pseudorotation mexanizmi",
    text: "Chicago universiteti fizik-kimyogari Berry trigonal bipiramidal (TBP) komplekslarda ligand almashinuvi mexanizmini bashorat qildi: TBP → kvadrat piramidal (SP) → yangi TBP. Bog'lar uzilmasdan ligandlar mavqei almashadi. Bu — konformatsion dinamikaning eng elegantli mexanizmi."
  },
  {
    year: 1969, hero: "Derek Barton (Nobel mukofoti)",
    title: "Konformatsion tahlil uchun Nobel mukofoti",
    text: "Barton (Odd Hassel bilan birga) konformatsion tahlil sohasi uchun Nobel mukofoti kimyo bo'yicha oldi. Uning ishlari organik va koordinatsion kimyoda molekulyar shakllarni tushunish uchun asos bo'ldi. Bu — konformatsion tahlilning ilmiy tan olinishi edi."
  },
  {
    year: 1968, hero: "P. A. Kollman",
    title: "Molekulyar mexanika (MM) usullari",
    text: "Kalifornia universitetida Kollman va uning guruhi molekulyar mexanika (MM) hisoblash usullarini ishlab chiqdilar. Bu usullar orqali xelat halqa konformatsiyalari energiyasi minimum eksperimentsiz aniq hisoblanadi. Bugungi kunda MM (AMBER, CHARMM) — hisoblash koordinatsion kimyosining asosidir."
  },
  {
    year: 1976, hero: "Kurt Wüthrich (NMR)",
    title: "Dinamik NMR spektroskopiya",
    text: "Wüthrich (Nobel 2002) NMR spektroskopiyada temperatura ta'sirini o'rgandi va konformatsion o'tishlarni real vaqtda kuzatish usullarini ishlab chiqdi. Koalensiya harorat (Tc) — bu konformatsion o'tish tezligining diagnostikasi. [Fe(CO)₅] uchun barcha CO liganlari 10⁷ s⁻¹ tez almashinishi Berry mexanizmini isbotladi."
  },
  {
    year: 1990, hero: "E. J. Corey (Nobel mukofoti)",
    title: "Retrosintez uchun Nobel mukofoti",
    text: "Corey Nobel mukofotini kimyo bo'yicha retrosintez usullari uchun oldi. 1959-yildagi [Co(en)₃]³⁺ konformatsion tahlili uning ilk fundamental ishlaridan edi. Corey va Bailar birgalikda koordinatsion kimyoda konformatsion tanlash paradigmasini yaratdilar."
  },
  {
    year: 2005, hero: "IUPAC Red Book",
    title: "Konformatsion nomenklatura standarti",
    text: "IUPAC 2005-yilda koordinatsion birikmalar uchun rasmiy konformatsion nomenklaturani nashr etdi: δ/λ (P/M), lel/ob, envelope (E)/twist (T), chair (C)/boat (B). Bu — talabalar va tadqiqotchilar uchun umumiy til bo'ldi."
  },
  {
    year: 2015, hero: "Zamonaviy tadqiqot",
    title: "Konformatsion switching — molekulyar mashinalar",
    text: "Feringa (Nobel 2016) va Sauvage (Nobel 2016) molekulyar mashinalar sohasi uchun mukofot oldilar. Konformatsion o'tishlar — bu mashinalarning ish tamoyili. Rotaksanlar, katenanlar va molekulyar motorlarda xelat halqa konformatsiyalari asosiy rol o'ynaydi."
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI FUNKSIYALAR
// ═══════════════════════════════════════════════════════════════════════════
const cleanText = (str) => {
  if (!str) return ""
  return String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
}

function addBondToGroup(group, s, e, color, radius = 0.04, opacity = 0.55) {
  const d = new THREE.Vector3().subVectors(e, s)
  const l = d.length()
  const m = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5)
  const bg = new THREE.CylinderGeometry(radius, radius, l, 16)
  const bm = new THREE.MeshStandardMaterial({
    color, roughness: 0.5, metalness: 0.2,
    transparent: true, opacity
  })
  const b = new THREE.Mesh(bg, bm)
  b.position.copy(m)
  b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0), d.clone().normalize()
  ))
  group.add(b)
  return b
}

function addAtomSphere(group, pos, color, size, opts = {}) {
  const { roughness = 0.4, metalness = 0.3, emissive = null, emissiveIntensity = 0 } = opts
  const geo = new THREE.SphereGeometry(size, 32, 32)
  const matOpts = { color, roughness, metalness }
  if (emissive !== null) { matOpts.emissive = emissive; matOpts.emissiveIntensity = emissiveIntensity }
  const mat = new THREE.MeshStandardMaterial(matOpts)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.copy(pos)
  group.add(mesh)
  return mesh
}

function addGlow(group, pos, color, size = 0.5, opacity = 0.12) {
  const geo = new THREE.SphereGeometry(size, 32, 32)
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.copy(pos)
  group.add(mesh)
  return mesh
}

// ═══════════════════════════════════════════════════════════════════════════
// [Co(en)₃]³⁺ XELAT HALQA KONFORMATSIYASI QURUVCHISI
// ═══════════════════════════════════════════════════════════════════════════
// Har bir en xelat halqasi δ yoki λ konformatsiyasida joylashadi
// lel = C₃ o'q bilan parallel, ob = qiyshiq
function buildCoen3Conformer(scene, centerPos, complex, isomerKey, opts = {}) {
  const { scale = 1, showDihedral = false, showStrain = false, groupRef = null } = opts
  const group = new THREE.Group()
  const iso = complex.isomers[isomerKey]
  const dist = 1.35 * scale

  // Markaziy Co
  addAtomSphere(group, new THREE.Vector3(0, 0, 0), complex.center.color, complex.center.radius * scale, {
    roughness: 0.3, metalness: 0.7, emissive: complex.center.color, emissiveIntensity: 0.2
  })
  addGlow(group, new THREE.Vector3(0, 0, 0), complex.center.color, 0.6 * scale)

  // Konformatsiya turi bo'yicha delta/lambda naqsh
  // lel₃ = δδδ (barcha halqalar bir tomonga), ob₃ = δλδ (galma-galma)
  let ringChiralities
  if (isomerKey === "lel3") ringChiralities = [1, 1, 1]           // δδδ
  else if (isomerKey === "lel2ob") ringChiralities = [1, 1, -1]   // δδλ
  else if (isomerKey === "lelob2") ringChiralities = [1, -1, -1]  // δλλ
  else if (isomerKey === "ob3") ringChiralities = [1, -1, 1]      // δλδ (naqshli)

  // 3 ta en xelat halqasi
  for (let k = 0; k < 3; k++) {
    const theta = (k * 2 * Math.PI) / 3
    const h = dist * 0.62
    const r = dist * 0.85
    const ringChirality = ringChiralities[k]
    const twist = ringChirality * (Math.PI / 3)

    const n1 = new THREE.Vector3(
      r * Math.cos(theta), +h, r * Math.sin(theta)
    )
    const n2 = new THREE.Vector3(
      r * Math.cos(theta + twist), -h, r * Math.sin(theta + twist)
    )

    // N atomlari
    ;[n1, n2].forEach(pos => {
      addAtomSphere(group, pos, CPK.N, 0.22 * scale)
      addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x444488, 0.04 * scale)

      // 2 ta H
      const dir = pos.clone().normalize()
      const perp1 = new THREE.Vector3(dir.y, -dir.x, 0).normalize()
      if (perp1.length() < 0.1) perp1.set(1, 0, 0)
      for (let hi = 0; hi < 2; hi++) {
        const angle = hi * Math.PI * 0.6 - Math.PI * 0.3
        const hPos = pos.clone().add(dir.clone().multiplyScalar(0.3 * scale))
          .add(perp1.clone().multiplyScalar(0.22 * scale * Math.cos(angle)))
          .add(new THREE.Vector3(0, 0.22 * scale * Math.sin(angle), 0))
        addAtomSphere(group, hPos, 0xFFFFFF, 0.08 * scale)
        addBondToGroup(group, pos, hPos, 0x888888, 0.018 * scale, 0.4)
      }
    })

    // Etilendiamin ko'prigi (N-CH₂-CH₂-N)
    // Konformatsiya (δ yoki λ) — CH₂ atomlarining N-N chizig'idan chetlashishida
    const dir = new THREE.Vector3().subVectors(n2, n1)
    const bondLen = dir.length()
    dir.normalize()
    const midpoint = new THREE.Vector3().addVectors(n1, n2).multiplyScalar(0.5)

    // Perpendikulyar yo'nalish (konformatsiya urg'usini ko'rsatish uchun)
    const perp = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize()
    const offset = perp.clone().multiplyScalar(0.25 * scale * ringChirality)

    const c1 = new THREE.Vector3().copy(n1).add(dir.clone().multiplyScalar(bondLen / 3)).add(offset.clone().multiplyScalar(0.5))
    const c2 = new THREE.Vector3().copy(n1).add(dir.clone().multiplyScalar((2 * bondLen) / 3)).add(offset.clone().multiplyScalar(0.5))

    // C atomlari
    ;[c1, c2].forEach(pos => {
      addAtomSphere(group, pos, 0x1A1A1A, 0.14 * scale)
      // 2 H (CH₂)
      const chDir = new THREE.Vector3(0, 1, 0)
      for (let hi = 0; hi < 2; hi++) {
        const hPos = pos.clone().add(chDir.clone().multiplyScalar((hi === 0 ? 0.22 : -0.22) * scale))
        addAtomSphere(group, hPos, 0xFFFFFF, 0.07 * scale)
        addBondToGroup(group, pos, hPos, 0x888888, 0.015 * scale, 0.4)
      }
    })
    addBondToGroup(group, n1, c1, 0x446688, 0.035 * scale)
    addBondToGroup(group, c1, c2, 0x446688, 0.035 * scale)
    addBondToGroup(group, c2, n2, 0x446688, 0.035 * scale)

    // Xelat halqasini vizual urg'ulash (rangli tekislik)
    const ringColor = ringChirality > 0 ? CPK.delta : CPK.lambda
    const ringGeo = new THREE.BufferGeometry()
    const ringVerts = new Float32Array([
      0, 0, 0,
      n1.x, n1.y, n1.z,
      c1.x, c1.y, c1.z,
      c2.x, c2.y, c2.z,
      n2.x, n2.y, n2.z
    ])
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringVerts, 3))
    ringGeo.setIndex([0, 1, 2,  0, 2, 3,  0, 3, 4])
    ringGeo.computeVertexNormals()
    const ringMat = new THREE.MeshBasicMaterial({
      color: ringColor, transparent: true, opacity: 0.15, side: THREE.DoubleSide
    })
    group.add(new THREE.Mesh(ringGeo, ringMat))

    // Sterik strain vizual (agar showStrain va halqa ob bo'lsa)
    if (showStrain && ringChirality < 0) {
      const strainGeo = new THREE.SphereGeometry(0.15 * scale, 12, 12)
      const strainMat = new THREE.MeshBasicMaterial({
        color: CPK.strain, transparent: true, opacity: 0.35
      })
      const strainMesh = new THREE.Mesh(strainGeo, strainMat)
      strainMesh.position.copy(midpoint.clone().add(offset))
      group.add(strainMesh)
    }

    // Dihedral burchak ko'rsatuvchi arc (agar showDihedral)
    if (showDihedral && k === 0) {
      // N-C-C-N dihedral burchagini ko'rsatish
      const arcRadius = 0.35 * scale
      const arcSegments = 20
      const arcGeo = new THREE.BufferGeometry()
      const arcVerts = []
      const startAngle = 0
      const endAngle = iso.dihedralAngle * Math.PI / 180
      for (let i = 0; i <= arcSegments; i++) {
        const t = i / arcSegments
        const angle = startAngle + (endAngle - startAngle) * t
        arcVerts.push(midpoint.x + arcRadius * Math.cos(angle))
        arcVerts.push(midpoint.y)
        arcVerts.push(midpoint.z + arcRadius * Math.sin(angle))
      }
      arcGeo.setAttribute('position', new THREE.Float32BufferAttribute(arcVerts, 3))
      const arcMat = new THREE.LineBasicMaterial({ color: CPK.envelope, linewidth: 2, transparent: true, opacity: 0.8 })
      group.add(new THREE.Line(arcGeo, arcMat))
    }
  }

  // C₃ simmetriya o'qi (vertikal)
  const axisGeo = new THREE.CylinderGeometry(0.01 * scale, 0.01 * scale, 4.5 * scale, 8)
  const axisMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.5 })
  const axis = new THREE.Mesh(axisGeo, axisMat)
  group.add(axis)

  group.position.copy(centerPos)
  scene.add(group)
  if (groupRef) groupRef.current = group
  return { group }
}

// ═══════════════════════════════════════════════════════════════════════════
// [Ca(EDTA)]²⁻ QURUVCHISI — 8-koordinatsion iskaji dodekaedrik
// ═══════════════════════════════════════════════════════════════════════════
function buildCaEDTAConformer(scene, centerPos, complex, isomerKey, opts = {}) {
  const { scale = 1, showRings = true, showStrain = false, groupRef = null } = opts
  const group = new THREE.Group()
  const iso = complex.isomers[isomerKey]

  // Markaziy Ca
  addAtomSphere(group, new THREE.Vector3(0, 0, 0), complex.center.color, complex.center.radius * scale, {
    roughness: 0.3, metalness: 0.5, emissive: complex.center.color, emissiveIntensity: 0.2
  })
  addGlow(group, new THREE.Vector3(0, 0, 0), complex.center.color, 0.7 * scale)

  // 2 ta N (aksial pozitsiyada, +y va -y)
  const distN = 1.5 * scale
  const nPos = [
    new THREE.Vector3(0, +distN, 0),
    new THREE.Vector3(0, -distN, 0)
  ]
  nPos.forEach(pos => {
    addAtomSphere(group, pos, CPK.N, 0.24 * scale)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x444488, 0.045 * scale)
  })

  // 4 ta O (karboksilat, ekvatorial tekislikda)
  // Konformatsiya turi bo'yicha O larning pozitsiyalari biroz farqli
  const distO = 1.4 * scale
  const twistFactor = isomerKey === "A" ? 0 : (isomerKey === "B" ? Math.PI / 8 : Math.PI / 4)
  const oPos = []
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI / 2) + twistFactor
    const height = (i % 2 === 0 ? 0.3 : -0.3) * scale  // biroz burchak
    oPos.push(new THREE.Vector3(
      distO * Math.cos(angle),
      height,
      distO * Math.sin(angle)
    ))
  }
  oPos.forEach(pos => {
    addAtomSphere(group, pos, CPK.O, 0.22 * scale)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x884444, 0.045 * scale)
  })

  // Etilendiamin ko'prigi (N-CH₂-CH₂-N) va 4 ta atsetat guruhi (-CH₂-COO⁻)
  // Etilendiamin ko'prigi (yuqori N dan pastki N ga)
  const midY = new THREE.Vector3(0, 0, 0)
  const c1n = new THREE.Vector3(0.3 * scale, distN * 0.5, 0.3 * scale)
  const c2n = new THREE.Vector3(0.3 * scale, -distN * 0.5, 0.3 * scale)
  addAtomSphere(group, c1n, 0x1A1A1A, 0.13 * scale)
  addAtomSphere(group, c2n, 0x1A1A1A, 0.13 * scale)
  addBondToGroup(group, nPos[0], c1n, 0x666688, 0.03 * scale, 0.5)
  addBondToGroup(group, c1n, c2n, 0x666688, 0.03 * scale, 0.5)
  addBondToGroup(group, c2n, nPos[1], 0x666688, 0.03 * scale, 0.5)

  // 4 ta atsetat guruhi (-CH₂-COO⁻) — har bir N ga 2 ta atsetat
  for (let i = 0; i < 4; i++) {
    const nAtom = nPos[Math.floor(i / 2)]
    const oAtom = oPos[i]

    // C1 (CH₂) — N va C2 orasida
    const c1 = nAtom.clone().add(oAtom.clone().sub(nAtom).multiplyScalar(0.4))
    // C2 (COO⁻ karbon) — oxirgi O ga yaqin
    const c2 = oAtom.clone().add(nAtom.clone().sub(oAtom).multiplyScalar(0.3))

    addAtomSphere(group, c1, 0x1A1A1A, 0.12 * scale)
    addAtomSphere(group, c2, 0x1A1A1A, 0.12 * scale)
    addBondToGroup(group, nAtom, c1, 0x666688, 0.028 * scale, 0.45)
    addBondToGroup(group, c1, c2, 0x666688, 0.028 * scale, 0.45)
    addBondToGroup(group, c2, oAtom, 0x884444, 0.03 * scale, 0.5)

    // Ikkinchi karboksilat O (=O)
    const o2 = c2.clone().add(new THREE.Vector3(0, 0.35, 0).multiplyScalar(scale))
    addAtomSphere(group, o2, CPK.O, 0.18 * scale)
    // Ikkilangan bog' (2 chiziq)
    addBondToGroup(group, c2, o2, 0x884444, 0.02 * scale, 0.6)
    addBondToGroup(group,
      c2.clone().add(new THREE.Vector3(0.04, 0, 0.04)),
      o2.clone().add(new THREE.Vector3(0.04, 0, 0.04)),
      0x884444, 0.02 * scale, 0.5)

    // Xelat halqasini urg'ulash
    if (showRings) {
      const ringColor = i % 2 === 0 ? CPK.delta : CPK.lambda
      const ringGeo = new THREE.BufferGeometry()
      const ringVerts = new Float32Array([
        0, 0, 0,
        nAtom.x, nAtom.y, nAtom.z,
        c1.x, c1.y, c1.z,
        c2.x, c2.y, c2.z,
        oAtom.x, oAtom.y, oAtom.z
      ])
      ringGeo.setAttribute('position', new THREE.BufferAttribute(ringVerts, 3))
      ringGeo.setIndex([0, 1, 2, 0, 2, 3, 0, 3, 4])
      ringGeo.computeVertexNormals()
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColor, transparent: true, opacity: 0.12, side: THREE.DoubleSide
      })
      group.add(new THREE.Mesh(ringGeo, ringMat))
    }
  }

  // Sterik strain vizual (C-konformer uchun)
  if (showStrain && isomerKey === "C") {
    const strainGeo = new THREE.SphereGeometry(0.2 * scale, 12, 12)
    const strainMat = new THREE.MeshBasicMaterial({
      color: CPK.strain, transparent: true, opacity: 0.4
    })
    const strain1 = new THREE.Mesh(strainGeo, strainMat)
    strain1.position.set(1.2 * scale, 0.5 * scale, 0.5 * scale)
    group.add(strain1)
    const strain2 = new THREE.Mesh(strainGeo, strainMat.clone())
    strain2.position.set(-1.2 * scale, -0.5 * scale, -0.5 * scale)
    group.add(strain2)
  }

  group.position.copy(centerPos)
  scene.add(group)
  if (groupRef) groupRef.current = group
  return { group }
}

// ═══════════════════════════════════════════════════════════════════════════
// [Fe(CO)₅] TBP yoki SP QURUVCHISI (Berry pseudorotation)
// ═══════════════════════════════════════════════════════════════════════════
function buildBerryComplex(scene, centerPos, complex, isomerKey, opts = {}) {
  const { scale = 1, showTransition = false, groupRef = null } = opts
  const group = new THREE.Group()
  const iso = complex.isomers[isomerKey]

  // Markaziy Fe
  addAtomSphere(group, new THREE.Vector3(0, 0, 0), complex.center.color, complex.center.radius * scale, {
    roughness: 0.3, metalness: 0.7, emissive: complex.center.color, emissiveIntensity: 0.2
  })
  addGlow(group, new THREE.Vector3(0, 0, 0), complex.center.color, 0.65 * scale)

  const dist = 1.5 * scale

  let coPositions = []
  if (isomerKey === "tbp") {
    // TBP: 2 aksial (yuqori-past) + 3 ekvatorial (120° ga uchburchak)
    coPositions = [
      { pos: new THREE.Vector3(0, +dist, 0), type: "axial" },
      { pos: new THREE.Vector3(0, -dist, 0), type: "axial" },
      { pos: new THREE.Vector3(dist, 0, 0), type: "equatorial" },
      { pos: new THREE.Vector3(-dist * 0.5, 0, +dist * 0.866), type: "equatorial" },
      { pos: new THREE.Vector3(-dist * 0.5, 0, -dist * 0.866), type: "equatorial" }
    ]
  } else if (isomerKey === "sp") {
    // SP (kvadrat piramidal): 1 apex + 4 bazasal (kvadrat)
    coPositions = [
      { pos: new THREE.Vector3(0, +dist, 0), type: "apex" },
      { pos: new THREE.Vector3(+dist * 0.85, -dist * 0.3, 0), type: "basal" },
      { pos: new THREE.Vector3(-dist * 0.85, -dist * 0.3, 0), type: "basal" },
      { pos: new THREE.Vector3(0, -dist * 0.3, +dist * 0.85), type: "basal" },
      { pos: new THREE.Vector3(0, -dist * 0.3, -dist * 0.85), type: "basal" }
    ]
  }

  // CO ligandlar qurish
  coPositions.forEach(({ pos, type }) => {
    // C atomi (donor)
    addAtomSphere(group, pos, CPK.C, 0.20 * scale)
    // Aksial CO'lar kuchli aksentda
    const bondColor = (type === "axial" || type === "apex") ? 0x666633 : 0x666666
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, bondColor, 0.045 * scale)

    // O atomi (tashqi)
    const dir = pos.clone().normalize()
    const oPos = pos.clone().add(dir.clone().multiplyScalar(0.55 * scale))
    addAtomSphere(group, oPos, CPK.O, 0.22 * scale)

    // C≡O triple bond (3 chiziq)
    for (let b = -1; b <= 1; b++) {
      const offset = new THREE.Vector3(b * 0.05 * scale, 0, 0)
      if (Math.abs(dir.x) > 0.9) offset.set(0, b * 0.05 * scale, 0)
      addBondToGroup(group,
        pos.clone().add(offset),
        oPos.clone().add(offset),
        0x999999, 0.015 * scale, 0.7)
    }
  })

  // Berry o'tish yo'nalishini ko'rsatish (agar showTransition)
  if (showTransition && isomerKey === "tbp") {
    // Aksial va ekvatorial CO larni bog'lash (strelka)
    const arrowGeo = new THREE.BufferGeometry()
    const arrowVerts = new Float32Array([
      // Yuqori aksial CO dan ekvatorial CO ga
      0, dist * 0.9, 0,
      dist * 0.7, dist * 0.3, 0,
      // Pastki aksial CO dan ekvatorial CO ga
      0, -dist * 0.9, 0,
      -dist * 0.35, -dist * 0.3, dist * 0.6
    ])
    arrowGeo.setAttribute('position', new THREE.BufferAttribute(arrowVerts, 3))
    const arrowMat = new THREE.LineBasicMaterial({
      color: CPK.berry, transparent: true, opacity: 0.7, linewidth: 3
    })
    group.add(new THREE.LineSegments(arrowGeo, arrowMat))
  }

  // Simmetriya o'qi
  const axisGeo = new THREE.CylinderGeometry(0.008 * scale, 0.008 * scale, 4 * scale, 8)
  const axisMat = new THREE.MeshBasicMaterial({
    color: isomerKey === "tbp" ? 0xFFD700 : CPK.berry,
    transparent: true, opacity: 0.5
  })
  const axis = new THREE.Mesh(axisGeo, axisMat)
  group.add(axis)

  group.position.copy(centerPos)
  scene.add(group)
  if (groupRef) groupRef.current = group
  return { group }
}

// ═══════════════════════════════════════════════════════════════════════════
// ASOSIY REACT KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════
export default function TransformatsionIzomeriya3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)

  // Barcha izomerlar uchun ref
  const groupRefs = useRef([null, null, null, null])
  const domLabelsRef = useRef([])

  // ═══════════════════════════════════════════════════════════
  // UI STATE'LAR
  // ═══════════════════════════════════════════════════════════
  const [complexId, setComplexId] = useState("Coen3_conf")
  const [viewMode, setViewMode] = useState("ball")
  const [showLabels, setShowLabels] = useState(true)
  const [showDihedral, setShowDihedral] = useState(false)
  const [showStrain, setShowStrain] = useState(false)
  const [showRings, setShowRings] = useState(true)
  const [showTransition, setShowTransition] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [animateBerry, setAnimateBerry] = useState(false)

  // Dihedral burchak slider
  const [dihedralAngle, setDihedralAngle] = useState(55)

  // Harorat (konformatsion population uchun)
  const [temperature, setTemperature] = useState(298)

  // Panellar
  const [activePanel, setActivePanel] = useState("info")
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [showCitationModal, setShowCitationModal] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)

  // Boshqaruv paneli
  const [panelPos, setPanelPos] = useState({ x: 12, y: 70 })
  const [dragState, setDragState] = useState({ dragging: false, offX: 0, offY: 0 })
  const [collapsedSection, setCollapsedSection] = useState({
    view: false, conformation: false, energy: true, dynamics: true, science: true, history: true
  })

  // PDF va Citation
  const [pdfSections, setPdfSections] = useState({
    intro: true, theory: true, coreyBailar: true, ringEnergy: true, ramachandran: true,
    berry: true, vanderwaals: true, nmr: true, edta: true, table: true, references: true
  })
  const [citationFormat, setCitationFormat] = useState("APA")

  const currentComplex = COMPLEXES[complexId]
  const isomerKeys = Object.keys(currentComplex.isomers)
  const isomers = isomerKeys.map(k => currentComplex.isomers[k])

  // ═══════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return
      if (e.key === "f" || e.key === "F") setFullscreen(v => !v)
      if (e.key === "d" || e.key === "D") setShowDihedral(v => !v)
      if (e.key === "s" || e.key === "S") setShowStrain(v => !v)
      if (e.key === "l" || e.key === "L") setShowLabels(v => !v)
      if (e.key === "r" || e.key === "R") setAutoRotate(v => !v)
      if (e.key === "b" || e.key === "B") setAnimateBerry(v => !v)
      if (e.key === "1") setComplexId("Coen3_conf")
      if (e.key === "2") setComplexId("CaEDTA_conf")
      if (e.key === "3") setComplexId("Berry_TBP")
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  // ═══════════════════════════════════════════════════════════
  // BOSHQARUV PANELINI KO'CHIRISH
  // ═══════════════════════════════════════════════════════════
  const handlePanelMouseDown = (e) => {
    e.preventDefault()
    setDragState({ dragging: true, offX: e.clientX - panelPos.x, offY: e.clientY - panelPos.y })
  }
  useEffect(() => {
    if (!dragState.dragging) return
    const handleMove = (e) => {
      setPanelPos({
        x: Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragState.offX)),
        y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragState.offY))
      })
    }
    const handleUp = () => setDragState({ dragging: false, offX: 0, offY: 0 })
    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseup", handleUp)
    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseup", handleUp)
    }
  }, [dragState])

  // ═══════════════════════════════════════════════════════════
  // 🎬 3D SAHNANI QURISH
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x0a0a1a, 20, 55)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      45, container.clientWidth / container.clientHeight, 0.1, 200
    )
    camera.position.set(0, 4, 14)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 4
    controls.maxDistance = 35
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.5
    controlsRef.current = controls

    // Yorug'liklar
    scene.add(new THREE.AmbientLight(0x606080, 0.7))
    const key = new THREE.DirectionalLight(0xffffff, 1.2)
    key.position.set(8, 10, 8); scene.add(key)
    const fill = new THREE.DirectionalLight(0xcc88ff, 0.4)
    fill.position.set(-6, -2, -4); scene.add(fill)
    const rim = new THREE.DirectionalLight(0x88ccff, 0.3)
    rim.position.set(0, -5, -8); scene.add(rim)

    // Grid + yulduzlar
    const grid = new THREE.GridHelper(24, 48, 0x333355, 0x1a1a2e)
    grid.position.y = -3.5
    grid.material.transparent = true; grid.material.opacity = 0.4
    scene.add(grid)

    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(600 * 3)
    for (let i = 0; i < 600 * 3; i += 3) {
      sp[i] = (Math.random() - 0.5) * 30
      sp[i + 1] = (Math.random() - 0.5) * 15
      sp[i + 2] = (Math.random() - 0.5) * 30
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.02, transparent: true, opacity: 0.5
    })))

    // ═══════════════════════════════════════════════════════════
    // MODELLARNI QURISH
    // ═══════════════════════════════════════════════════════════
    groupRefs.current = [null, null, null, null]

    if (currentComplex.isomerType === "chelate") {
      // 4 ta konformatsion izomer — 2x2 setka
      const positions = [
        new THREE.Vector3(-3.5, 1.8, 0),
        new THREE.Vector3(+3.5, 1.8, 0),
        new THREE.Vector3(-3.5, -1.8, 0),
        new THREE.Vector3(+3.5, -1.8, 0)
      ]
      isomerKeys.forEach((key, i) => {
        const ref = { current: null }
        buildCoen3Conformer(scene, positions[i], currentComplex, key, {
          scale: 0.75, showDihedral, showStrain, groupRef: ref
        })
        groupRefs.current[i] = ref.current
      })
    } else if (currentComplex.isomerType === "edta") {
      // 3 ta konformatsion izomer
      const gap = 5.5
      isomerKeys.forEach((key, i) => {
        const x = (i - 1) * gap
        const ref = { current: null }
        buildCaEDTAConformer(scene, new THREE.Vector3(x, 0, 0), currentComplex, key, {
          scale: 0.85, showRings, showStrain, groupRef: ref
        })
        groupRefs.current[i] = ref.current
      })
    } else if (currentComplex.isomerType === "berry") {
      // 2 ta pseudorotation holati
      const gap = 5.5
      isomerKeys.forEach((key, i) => {
        const x = (i - 0.5) * gap * 2 - gap
        const ref = { current: null }
        buildBerryComplex(scene, new THREE.Vector3(x, 0, 0), currentComplex, key, {
          scale: 1, showTransition, groupRef: ref
        })
        groupRefs.current[i] = ref.current
      })
    }

    // Wireframe
    groupRefs.current.forEach(g => {
      if (!g) return
      g.traverse(obj => {
        if (obj.isMesh && obj.material) {
          const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material
          mat.wireframe = viewMode === "wire"
        }
      })
    })

    // ═══════════════════════════════════════════════════════════
    // DOM YORLIQLARI
    // ═══════════════════════════════════════════════════════════
    const addLabel = (html, css) => {
      const el = document.createElement("div")
      el.style.cssText = css
      el.innerHTML = html
      container.appendChild(el)
      domLabelsRef.current.push(el)
    }

    if (showLabels) {
      if (currentComplex.isomerType === "chelate") {
        // 4 ta yorliq — 2x2 setka
        const positions = [
          { top: "10%", left: "8%",  align: "left" },
          { top: "10%", right: "8%", align: "right" },
          { bottom: "20%", left: "8%",  align: "left" },
          { bottom: "20%", right: "8%", align: "right" }
        ]
        isomerKeys.forEach((key, i) => {
          const iso = currentComplex.isomers[key]
          const pos = positions[i]
          const posStr = Object.entries(pos).filter(([k]) => k !== "align")
            .map(([k, v]) => `${k}:${v}`).join(";")
          addLabel(
            `${iso.shortLabel}<br/><span style='font-size:10px;color:#aaa'>${iso.confPattern} • ${iso.energy} kJ/mol • ${(iso.occupationRatio * 100).toFixed(0)}%</span>`,
            `position:absolute;${posStr};color:${iso.color_hex};font-size:18px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 12px ${iso.color_hex}88;text-align:${pos.align}`
          )
        })
      } else if (currentComplex.isomerType === "edta") {
        const positions = [
          { top: "12%", left: "8%" },
          { top: "12%", left: "50%", transform: "translateX(-50%)" },
          { top: "12%", right: "8%" }
        ]
        isomerKeys.forEach((key, i) => {
          const iso = currentComplex.isomers[key]
          const pos = positions[i]
          const posStr = Object.entries(pos).map(([k, v]) => `${k}:${v}`).join(";")
          addLabel(
            `${iso.label}<br/><span style='font-size:10px;color:#aaa'>${iso.energy} kJ/mol • ${(iso.occupationRatio * 100).toFixed(0)}%</span>`,
            `position:absolute;${posStr};color:${iso.color_hex};font-size:16px;font-weight:800;pointer-events:none;z-index:5;text-shadow:0 0 12px ${iso.color_hex}88;text-align:center`
          )
        })
      } else if (currentComplex.isomerType === "berry") {
        isomerKeys.forEach((key, i) => {
          const iso = currentComplex.isomers[key]
          const side = i === 0 ? "left" : "right"
          addLabel(
            `${iso.label}<br/><span style='font-size:11px;color:#aaa'>${iso.pointGroup} • ${iso.energy} kJ/mol</span>`,
            `position:absolute;top:12%;${side}:6%;color:${iso.color_hex};font-size:20px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 15px ${iso.color_hex}88`
          )
        })
      }

      // Pastdagi izoh
      let bottomText = ""
      if (currentComplex.isomerType === "chelate") bottomText = "Corey-Bailar tahlili: 4 ta konformatsion izomer (lel₃ ↔ lel₂ob ↔ lelob₂ ↔ ob₃). Farq faqat en xelat halqa yo'nalishida"
      if (currentComplex.isomerType === "edta") bottomText = "EDTA — 5 ta xelat halqa, har birining konformatsiyasi mustaqil. Tibbiy chelation therapy asosi"
      if (currentComplex.isomerType === "berry") bottomText = "Berry pseudorotation: TBP ↔ SP oraliq. Ligandlar bog'i uzilmasdan mavqe almashadi. NMR koalensiya isbotladi"
      addLabel(
        `${bottomText}`,
        "position:absolute;bottom:5%;left:50%;transform:translateX(-50%);color:#c4b5fd;font-size:12px;font-style:italic;pointer-events:none;z-index:5;text-align:center;background:rgba(30,20,60,0.6);padding:6px 14px;border-radius:8px;border:1px solid #6d28d9;max-width:85%"
      )
    }

    // ═══════════════════════════════════════════════════════════
    // ANIMATSIYA LOOP
    // ═══════════════════════════════════════════════════════════
    let rafId
    let time = 0
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      time += 0.008
      controls.autoRotate = autoRotate
      controls.update()

      // Har bir izomer aylanadi
      groupRefs.current.forEach(g => {
        if (g) g.rotation.y = time * 0.15
      })

      // Berry animatsiyasi (TBP ↔ SP tebranish)
      if (animateBerry && currentComplex.isomerType === "berry") {
        const berryPhase = 0.5 + 0.5 * Math.sin(time * 1.5)
        if (groupRefs.current[0]) {
          groupRefs.current[0].scale.set(1, 1 - 0.15 * berryPhase, 1)
        }
        if (groupRefs.current[1]) {
          groupRefs.current[1].scale.set(1, 1 - 0.15 * (1 - berryPhase), 1)
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

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", handleResize)
      domLabelsRef.current.forEach(el => {
        if (el && el.parentNode === container) container.removeChild(el)
      })
      domLabelsRef.current = []
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
          else obj.material.dispose()
        }
      })
      renderer.dispose()
    }
  }, [complexId, showDihedral, showStrain, showRings, showTransition, showLabels,
      viewMode, autoRotate, animateBerry, currentComplex, isomerKeys])

  // ═══════════════════════════════════════════════════════════
  // 📄 PDF EKSPORT — PREMIUM ILMIY HISOBOT (transformatsion izomeriya)
  // ═══════════════════════════════════════════════════════════
  const generatePDF = useCallback(async () => {
    if (pdfGenerating) return
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
      } catch (err) {
        alert("Font yuklanmadi. public/fonts/ papkasida DejaVuSans*.ttf fayllari borligini tekshiring.")
        setPdfGenerating(false)
        return
      }

      const C = {
        purple: rgb(0.30, 0.11, 0.58), purpleLight: rgb(0.86, 0.78, 1.00),
        purpleMid: rgb(0.65, 0.55, 0.98), purpleDark: rgb(0.12, 0.11, 0.29),
        textDark: rgb(0.08, 0.08, 0.16), textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47), white: rgb(1, 1, 1),
        gold: rgb(0.80, 0.62, 0.05), blue: rgb(0.08, 0.31, 0.75),
        orange: rgb(0.86, 0.55, 0.00), red: rgb(0.80, 0.20, 0.20),
        green: rgb(0.08, 0.55, 0.31), yellow: rgb(0.75, 0.60, 0.10),
        cyan: rgb(0.10, 0.60, 0.80), pink: rgb(0.85, 0.20, 0.75),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.00), bgOrange: rgb(1.00, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.00), bgGreen: rgb(0.94, 1.00, 0.98),
        bgYellow: rgb(1.00, 0.98, 0.90), bgRed: rgb(1.00, 0.94, 0.94),
        bgGold: rgb(1.00, 0.98, 0.86), bgCyan: rgb(0.92, 0.98, 1.00),
        bgPink: rgb(1.00, 0.94, 0.99)
      }

      const PAGE_W = 595.28, PAGE_H = 841.89, MARGIN = 55
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 50

      const measure = (text, f, size) => {
        try { return f.widthOfTextAtSize(String(text || ""), size) }
        catch { return String(text || "").length * size * 0.5 }
      }
      const truncate = (text, f, size, maxWidth) => {
        const str = String(text || "")
        if (measure(str, f, size) <= maxWidth) return str
        let lo = 0, hi = str.length
        while (lo < hi) {
          const mid = Math.floor((lo + hi + 1) / 2)
          if (measure(str.slice(0, mid) + "…", f, size) <= maxWidth) lo = mid
          else hi = mid - 1
        }
        return str.slice(0, lo) + "…"
      }
      const wrapText = (text, f, size, maxWidth) => {
        const clean = cleanText(text)
        if (!clean) return [""]
        const words = clean.split(/\s+/)
        const lines = []
        let curLine = ""
        for (const w of words) {
          const test = curLine ? curLine + " " + w : w
          if (measure(test, f, size) <= maxWidth) curLine = test
          else {
            if (curLine) lines.push(curLine)
            if (measure(w, f, size) > maxWidth) {
              let chunk = ""
              for (const ch of w) {
                if (measure(chunk + ch, f, size) <= maxWidth) chunk += ch
                else { lines.push(chunk); chunk = ch }
              }
              curLine = chunk
            } else curLine = w
          }
        }
        if (curLine) lines.push(curLine)
        return lines
      }

      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNumber = 1

      const addFooter = (p, pn) => {
        p.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 },
          end: { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine
        })
        const dateStr = new Date().toLocaleDateString("uz-UZ")
        const brandText = `Transformatsion izomeriya 3D Lab  •  ${cleanText(currentComplex.formula)}  •  ${dateStr}`
        p.drawText(truncate(brandText, regularFont, 8, CONTENT_W - 30), {
          x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray
        })
        const pageStr = `${pn}`
        p.drawText(pageStr, {
          x: PAGE_W - MARGIN - measure(pageStr, regularFont, 8),
          y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray
        })
      }
      const addNewPage = () => {
        addFooter(page, pageNumber)
        page = pdfDoc.addPage([PAGE_W, PAGE_H])
        pageNumber += 1
        y = PAGE_H - MARGIN
      }
      const checkBreak = (need) => {
        if (y - need < FOOTER_Y + 25) addNewPage()
      }

      const drawSectionHeader = (num, title) => {
        checkBreak(50)
        page.drawRectangle({ x: MARGIN, y: y - 18, width: 4, height: 18, color: C.purple })
        page.drawText(`${num}.`, { x: MARGIN + 10, y: y - 14, size: 14, font: boldFont, color: C.purple })
        page.drawText(cleanText(title), { x: MARGIN + 30, y: y - 14, size: 14, font: boldFont, color: C.textDark })
        y -= 30
      }
      const drawParagraph = (text, opts = {}) => {
        const { size = 10, color = C.textDark, font: f = regularFont, indent = 0 } = opts
        const lines = wrapText(text, f, size, CONTENT_W - indent)
        for (const line of lines) {
          checkBreak(size + 4)
          page.drawText(line, { x: MARGIN + indent, y: y - size, size, font: f, color })
          y -= size + 4
        }
        y -= 4
      }
      const drawBulletPoint = (text, opts = {}) => {
        const { size = 10, color = C.textDark, bulletColor = C.purple } = opts
        const lines = wrapText(text, regularFont, size, CONTENT_W - 20)
        checkBreak(size + 3)
        page.drawCircle({ x: MARGIN + 7, y: y - size + 2, size: 2, color: bulletColor })
        page.drawText(lines[0] || "", { x: MARGIN + 20, y: y - size, size, font: regularFont, color })
        y -= size + 3
        for (let i = 1; i < lines.length; i++) {
          checkBreak(size + 3)
          page.drawText(lines[i], { x: MARGIN + 20, y: y - size, size, font: regularFont, color })
          y -= size + 3
        }
        y -= 2
      }
      const drawInfoBox = (title, body, opts = {}) => {
        const { bgColor = C.bgPurple, borderColor = C.purple, titleColor = C.purple, textColor = C.textDark } = opts
        const titleLines = wrapText(title, boldFont, 11, CONTENT_W - 24)
        const bodyLines = wrapText(body, regularFont, 10, CONTENT_W - 24)
        const boxHeight = 10 + titleLines.length * 14 + bodyLines.length * 14 + 10
        checkBreak(boxHeight + 8)
        page.drawRectangle({ x: MARGIN, y: y - boxHeight, width: CONTENT_W, height: boxHeight, color: bgColor })
        page.drawRectangle({ x: MARGIN, y: y - boxHeight, width: 3, height: boxHeight, color: borderColor })
        let ty = y - 10
        for (const line of titleLines) {
          page.drawText(line, { x: MARGIN + 12, y: ty - 11, size: 11, font: boldFont, color: titleColor })
          ty -= 14
        }
        ty -= 2
        for (const line of bodyLines) {
          page.drawText(line, { x: MARGIN + 12, y: ty - 10, size: 10, font: regularFont, color: textColor })
          ty -= 14
        }
        y -= boxHeight + 8
      }
      const drawFormula = (formula, opts = {}) => {
        const { size = 12, color = C.purpleDark, center = false } = opts
        checkBreak(size + 8)
        const width = measure(formula, boldFont, size)
        const x = center ? MARGIN + (CONTENT_W - width) / 2 : MARGIN + 20
        page.drawText(cleanText(formula), { x, y: y - size, size, font: boldFont, color })
        y -= size + 8
      }

      // TITUL SAHIFA
      page.drawRectangle({ x: 0, y: PAGE_H - 200, width: PAGE_W, height: 200, color: C.purpleDark })
      page.drawRectangle({ x: 0, y: PAGE_H - 205, width: PAGE_W, height: 5, color: C.purple })

      page.drawText("JDA-KIMYO • ILMIY BYULLETEN'", {
        x: MARGIN, y: PAGE_H - 30, size: 9, font: boldFont, color: C.purpleLight
      })
      page.drawText(new Date().toLocaleDateString("uz-UZ"), {
        x: PAGE_W - MARGIN - measure(new Date().toLocaleDateString("uz-UZ"), regularFont, 9),
        y: PAGE_H - 30, size: 9, font: regularFont, color: C.purpleLight
      })

      const mainTitle = "TRANSFORMATSION IZOMERIYA"
      const mtWidth = measure(mainTitle, boldFont, 22)
      page.drawText(mainTitle, {
        x: (PAGE_W - mtWidth) / 2, y: PAGE_H - 85,
        size: 22, font: boldFont, color: C.white
      })

      const subtitle = "Konformatsion izomerlar va xelat halqa dinamikasi"
      const stWidth = measure(subtitle, italicFont, 12)
      page.drawText(subtitle, {
        x: (PAGE_W - stWidth) / 2, y: PAGE_H - 108,
        size: 12, font: italicFont, color: C.purpleLight
      })

      const formulaStr = cleanText(currentComplex.formula)
      const fWidth = measure(formulaStr, boldFont, 15)
      page.drawText(formulaStr, {
        x: (PAGE_W - fWidth) / 2, y: PAGE_H - 140,
        size: 15, font: boldFont, color: C.white
      })

      let isomerPairLabel = ""
      if (currentComplex.isomerType === "chelate") isomerPairLabel = "lel₃ ↔ lel₂ob ↔ lelob₂ ↔ ob₃"
      else if (currentComplex.isomerType === "edta") isomerPairLabel = "A ↔ B ↔ C konformerlar"
      else if (currentComplex.isomerType === "berry") isomerPairLabel = "TBP ⇌ SP (Berry pseudorotation)"
      const iplWidth = measure(isomerPairLabel, boldFont, 15)
      page.drawText(isomerPairLabel, {
        x: (PAGE_W - iplWidth) / 2, y: PAGE_H - 170,
        size: 15, font: boldFont, color: C.purpleLight
      })

      y = PAGE_H - 235

      drawInfoBox(
        "Tanlangan kompleks va konformatsion izomeriya",
        `Formula: ${cleanText(currentComplex.formula)}\n` +
        `Nomi: ${currentComplex.name}\n` +
        `Geometriya: ${currentComplex.geometry}  |  Koord. son: ${currentComplex.coordinationNumber}  |  Gibridlanish: ${currentComplex.hybridization}\n` +
        `Bog' uzunliklari: ${currentComplex.bondLengthReal}\n` +
        `Xelat halqa hajmi: ${currentComplex.ringSize}\n` +
        `Izomer soni: ${isomerKeys.length} ta`,
        { bgColor: C.bgPurple, borderColor: C.purple }
      )

      drawInfoBox(
        "Tarixiy kontekst",
        `Kashfiyot yili: ${currentComplex.discoveryYear}  |  Muallif: ${currentComplex.discoverer}\n` +
        cleanText(currentComplex.scientificNotes),
        { bgColor: C.bgGold, borderColor: C.gold, titleColor: C.gold }
      )

      y -= 5
      drawSectionHeader("§", "Annotatsiya")
      drawParagraph(
        `Ushbu hisobotda ${currentComplex.formula} kompleksining transformatsion (konformatsion) ` +
        `izomeriyasi keng qamrovli o'rganilgan. Corey-Bailar (1959) konformatsion tahlili, xelat halqa ` +
        `energetikasi, Barton konformatsion nazariyasi (Nobel 1969), Berry pseudorotation mexanizmi (1960), ` +
        `Van der Waals sterik ta'siri, dihedral burchak dinamikasi, dinamik NMR spektroskopiya orqali ` +
        `kuzatish (Wüthrich) va zamonaviy molekulyar mashinalar sohasi batafsil bayon etilgan.`
      )

      addNewPage()

      // 1. KIRISH
      if (pdfSections.intro) {
        drawSectionHeader(1, "Kirish — transformatsion izomeriya nima?")
        drawParagraph(
          "Transformatsion izomeriya (conformational isomerism) — koordinatsion birikmalarda bir xil " +
          "formula, bir xil geometriya va bir xil bog'lanish tartibiga ega bo'lgan molekulaning turli " +
          "fazoviy shakllarga (konformatsiyalarga) o'ta olishi. Bu izomerlar orasidagi farq faqat bog' " +
          "aylanishlaridadir — bog' uzilishi yoki hosil bo'lishi yo'q."
        )
        drawInfoBox(
          "Konformatsion vs Konfiguratsion izomeriya",
          "KONFIGURATSION (cis/trans, R/S, Λ/Δ): izomerlar orasida o'tish uchun bog' uzilishi kerak. " +
          "Xona haroratida IZOLYATSIYA qilinadi.\n" +
          "KONFORMATSION (δ/λ, lel/ob, TBP/SP): izomerlar orasida faqat bog' aylanishida o'tadi. " +
          "Xona haroratida TEZ (10⁻⁹ – 10⁻⁶ soniya) o'tish sodir bo'ladi.",
          { bgColor: C.bgPurple, borderColor: C.purple }
        )
        drawParagraph("Konformatsion izomeriyaning asosiy belgilari:")
        drawBulletPoint("Bog' uzilmasdan, faqat aylanish orqali izomerlar orasida o'tish", { bulletColor: C.gold })
        drawBulletPoint("Har konformatsiya o'z minimum energiyasiga ega (PES yuzasi)", { bulletColor: C.blue })
        drawBulletPoint("Barqarorlik farqi kJ/mol darajasida (~1-10 kJ/mol)", { bulletColor: C.green })
        drawBulletPoint("Boltzmann taqsimoti bo'yicha populyatsiya nisbatlari", { bulletColor: C.red })
        drawBulletPoint("NMR dinamikasi va X-ray difraksiya orqali kuzatiladi", { bulletColor: C.purple })
        drawInfoBox(
          "Amaliy ahamiyat",
          "Konformatsion izomeriya — biologiyaning eng muhim tushunchalaridan biri. Oqsillarning 3D " +
          "shakli, DNK zanjiri, ferment aktiv joyi, dori-molekula interaksiyasi — bularning barchasi " +
          "konformatsion tanlash tamoyiliga bo'ysunadi. EDTA, gemoglobin, cisplatin va boshqa muhim " +
          "dori-komplekslar konformatsion boyligi bilan ish ko'radi.",
          { bgColor: C.bgYellow, borderColor: C.yellow, titleColor: C.yellow }
        )
      }

      // 2. BARTON NAZARIYASI
      if (pdfSections.theory) {
        drawSectionHeader(2, "Konformatsion nazariya asoslari (Barton, Nobel 1969)")
        drawParagraph(
          "Britaniyalik kimyogar Derek Barton (Nobel mukofoti kimyo bo'yicha, 1969) organik va " +
          "koordinatsion kimyoda \"konformatsion tahlil\" sohasini yaratdi. Uning ishlari sikloheksan " +
          "konformatsiyalari (chair, boat, twist-boat) misolida boshlanib, keyinchalik xelat halqalar " +
          "dinamikasiga ko'chirildi."
        )
        drawInfoBox(
          "Potentsial energiya yuzasi (PES)",
          "Har bir konformatsiya PES da lokal minimum sifatida joylashadi. Izomerlar orasida o'tish " +
          "energiya to'sig'ini (Ea) bosib o'tishni talab qiladi:\n\n" +
          "Ea ≈ 2-15 kJ/mol — 5-a'zoli halqalar (en xelat)\n" +
          "Ea ≈ 10-40 kJ/mol — 6-a'zoli halqalar (sikloheksan)\n" +
          "Ea ≈ 40-80 kJ/mol — vodorod bog' bilan cheklangan tizimlar",
          { bgColor: C.bgBlue, borderColor: C.blue, titleColor: C.blue }
        )
        drawFormula("k = A · exp(−Ea / RT)   [Arrhenius tenglamasi]", { center: true, size: 12 })
        drawParagraph(
          "bu yerda k — o'tish tezlik konstantasi (s⁻¹), A — pre-eksponensial omil (~10¹³ s⁻¹), " +
          "Ea — aktivatsiya energiyasi, R — gaz konstantasi (8.314 J/mol·K), T — harorat (K)."
        )
        drawInfoBox(
          "Boltzmann populyatsiya nisbati",
          "Ikkita konformatsiya orasidagi termodinamik nisbat:\n\n" +
          "N_A / N_B = exp(−ΔG / RT)\n\n" +
          "ΔG = 1 kJ/mol da: ~1.5:1 nisbat\n" +
          "ΔG = 5 kJ/mol da: ~7:1 nisbat\n" +
          "ΔG = 10 kJ/mol da: ~55:1 nisbat\n" +
          "ΔG = 20 kJ/mol da: ~3000:1 (deyarli faqat A konformatsiyasi)",
          { bgColor: C.bgGreen, borderColor: C.green, titleColor: C.green }
        )
        drawParagraph("Barton konformatsion nazariyasining asosiy tamoyillari:")
        drawBulletPoint("Molekula eng past energiyali konformatsiyani afzal ko'radi")
        drawBulletPoint("Sterik itarilish (steric strain) barqarorlikni kamaytiradi")
        drawBulletPoint("Torsion strain (dihedral burchak buzilishi) energetik zarar keltiradi")
        drawBulletPoint("Vodorod bog' va van der Waals ta'sirlari muhim omillar")
      }

      // 3. COREY-BAILAR
      if (pdfSections.coreyBailar) {
        drawSectionHeader(3, "Corey-Bailar konformatsiyalari (1959)")
        drawParagraph(
          "1959-yilda E. J. Corey (Nobel 1990) va J. C. Bailar Jr. Illinois universitetida " +
          "[Co(en)₃]³⁺ komplekstin konformatsion tahlilini o'tkazdilar. Ular aniqladilarki: har bir en " +
          "xelat halqasi C₃ asosiy o'qi bilan parallel (lel) yoki qiyshiq (ob) joylashishi mumkin. " +
          "Bu — [Co(en)₃]³⁺ uchun 4 ta konformatsion izomerga olib keladi."
        )
        drawInfoBox(
          "lel₃ (δδδ / λλλ) — eng barqaror",
          "3 ta xelat halqasi C₃ o'qi bilan parallel. Sterik itarilish minimum. Xona haroratida ~42% " +
          "populyatsiya. Statistik jihatdan 1 usul. Simmetriya: D₃.",
          { bgColor: C.bgGreen, borderColor: C.green, titleColor: C.green }
        )
        drawInfoBox(
          "lel₂ob (δδλ / λλδ) — ikkinchi barqaror",
          "2 ta lel + 1 ta ob halqa. 3 usul. ~38% populyatsiya. Energiya lel₃ dan 1.6 kJ/mol yuqori. " +
          "Simmetriya: C₂.",
          { bgColor: C.bgYellow, borderColor: C.yellow, titleColor: C.yellow }
        )
        drawInfoBox(
          "lelob₂ (δλλ / λδδ) — uchinchi barqaror",
          "1 ta lel + 2 ta ob halqa. 3 usul. ~15% populyatsiya. Energiya lel₃ dan 3.2 kJ/mol yuqori. " +
          "Ob halqalari sterik itarilishga uchraydi.",
          { bgColor: C.bgOrange, borderColor: C.orange, titleColor: C.orange }
        )
        drawInfoBox(
          "ob₃ (δλδ / λδλ) — eng kam barqaror",
          "3 ta halqasi ob. Faqat ~5% populyatsiya. Energiya lel₃ dan 4.8 kJ/mol yuqori. Kuchli sterik " +
          "itarilish. Simmetriya: D₃.",
          { bgColor: C.bgRed, borderColor: C.red, titleColor: C.red }
        )
        drawParagraph(
          "Boltzmann taqsimoti bo'yicha xona haroratida (T=298K) 4 ta konformatsion izomer nisbati: " +
          "42% lel₃, 38% lel₂ob, 15% lelob₂, 5% ob₃. Bu — konformatsion boylikning klassik namunasi va " +
          "koordinatsion kimyoda konformatsion tahlilning tug'ilishi."
        )
      }

      // 4. XELAT HALQA ENERGETIKASI
      if (pdfSections.ringEnergy) {
        drawSectionHeader(4, "Xelat halqa energetikasi va sterik strain")
        drawParagraph(
          "Xelat halqasi hajmi va tarkibi konformatsion barqarorlikning asosiy omillaridir. Ligand " +
          "molekulasining torsion burilishlari, van der Waals ta'sirlari va vodorod bog' hosilalari " +
          "har bir konformatsiyaning umumiy energiyasini belgilaydi."
        )
        drawInfoBox(
          "Xelat halqa hajmi va barqarorlik",
          "5-a'zoli halqa (en, Co–N–C–C–N): burchaklar minimal deformatsiya, eng barqaror\n" +
          "6-a'zoli halqa (tn = 1,3-propandiamin): kreslo shakli mumkin, ba'zan afzal\n" +
          "7-a'zoli halqa: sterik strain kuchli, kam uchraydi\n" +
          "4-a'zoli halqa: juda kuchli angular strain, deyarli hech qachon uchramaydi",
          { bgColor: C.bgPurple, borderColor: C.purple }
        )
        drawParagraph("Sterik strain turlari:")
        drawBulletPoint("Torsion strain (Pitzer strain) — bog'lar aylanishida to'siqlar")
        drawBulletPoint("Angle strain (Baeyer strain) — bog' burchagi ideal qiymatidan chetlashishi")
        drawBulletPoint("Steric strain (van der Waals) — atomlar juda yaqinlashishi (< 3 Å)")
        drawBulletPoint("Transannular strain — halqa ichidagi atomlar bir-biriga ta'siri")
        drawFormula("E_total = E_torsion + E_angle + E_steric + E_H-bond + E_electrostatic", { size: 11 })
        drawParagraph(
          "Molekulyar mexanika (MM) hisoblashlarida bu barcha komponentlar alohida hisoblanadi. " +
          "AMBER, CHARMM, MMFF94 kabi force field'lar orqali konformatsion energiya ~1 kJ/mol " +
          "aniqlikda hisoblanadi."
        )
      }

      // 5. RAMACHANDRAN
      if (pdfSections.ramachandran) {
        drawSectionHeader(5, "Ramachandran-tipli tahlil — konformatsion xarita")
        drawParagraph(
          "Ramachandran diagrammasi — oqsillar konformatsiyasini tahlil qilish uchun 1963-yilda " +
          "hindiston olimi G. N. Ramachandran tomonidan yaratilgan. Bu usul koordinatsion kimyoda ham " +
          "xelat halqa konformatsiyalari uchun mo'ljallangan."
        )
        drawInfoBox(
          "Dihedral burchaklar (ψ, φ)",
          "5-a'zoli en xelat halqasi uchun asosiy dihedral burchak: N–C–C–N.\n" +
          "δ konformatsiya: dihedral ≈ +55°\n" +
          "λ konformatsiya: dihedral ≈ −55°\n" +
          "Envelope (E) holati: 4 atom tekislikda, 1 chetda (0°)\n" +
          "Twist (T) holati: 2 atom qarama-qarshi (±40°)",
          { bgColor: C.bgBlue, borderColor: C.blue, titleColor: C.blue }
        )
        drawParagraph(
          "Ramachandran-tipli xarita ikki o'qli chizmadir: bir o'qda φ (masalan N-Co-N ekvatorial " +
          "burchagi), ikkinchi o'qda ψ (halqa dihedral burchagi). Ruxsat etilgan mintaqalar — energiya " +
          "minimumlari (lel₃, lel₂ob va h.k.), taqiqlangan zonalar — yuqori sterik strain."
        )
        drawInfoBox(
          "Amaliy foydalanishi",
          "1) Yangi kompleks konformatsion barqarorligini bashorat qilish\n" +
          "2) MM/MD simulyatsiyalari uchun boshlang'ich strukturani tanlash\n" +
          "3) X-ray tuzilma tahlilida noaniq konformatsiyani hal qilish\n" +
          "4) Katalitik faollikning konformatsion asoslarini o'rganish\n" +
          "5) Dori-molekula interaksiyasida ligand konformatsiyasini bashorat qilish",
          { bgColor: C.bgGreen, borderColor: C.green, titleColor: C.green }
        )
      }

      // 6. BERRY
      if (pdfSections.berry) {
        drawSectionHeader(6, "Berry pseudorotation mexanizmi (1960)")
        drawParagraph(
          "1960-yilda Chicago universiteti fizik-kimyogari R. Stephen Berry trigonal bipiramidal (TBP) " +
          "geometriyada ligandlar mavqei almashinishning nozik va matematik jihatdan elegantli " +
          "mexanizmini bashorat qildi. Bu — Berry pseudorotation deb ataladi."
        )
        drawInfoBox(
          "TBP → SP → TBP' mexanizmi",
          "Boshlang'ich TBP: 2 aksial (top-bottom) + 3 ekvatorial CO. Berry o'tishida:\n" +
          "1) 2 aksial CO bir-biriga yaqinlashadi (180° → 105°)\n" +
          "2) 2 ekvatorial CO uzoqlashadi (120° → 180°)\n" +
          "3) Oraliq: kvadrat piramidal (SP), C₄ᵥ simmetriya\n" +
          "4) Yakuniy: yangi TBP, lekin aksial va ekvatorial ligandlar almashgan",
          { bgColor: C.bgOrange, borderColor: C.orange, titleColor: C.orange }
        )
        drawParagraph(
          "Aylanish faqat kichik geometrik siljish (~30°) ni talab qiladi. Berry to'sig'i taxminan " +
          "8-15 kJ/mol — bu xona haroratida juda tez o'tishga imkon beradi (10⁷ s⁻¹)."
        )
        drawInfoBox(
          "[Fe(CO)₅] eksperimental tasdiqlash",
          "[Fe(CO)₅] uchun NMR spektrida barcha 5 ta CO ligand EKVIVALENT ko'rinadi. Bu termodinamik " +
          "jihatdan imkonsiz — chunki TBP da aksial va ekvatorial holatlar farqli. Berry pseudorotation " +
          "orqali ligandlar shu qadar tez almashadiki (10⁷ s⁻¹ > 10² s⁻¹ NMR vaqt shkalasi), NMR " +
          "ularni bir xil deb ko'radi. Bu — Berry mexanizmining klassik isbotidir.",
          { bgColor: C.bgPurple, borderColor: C.purple }
        )
        drawParagraph("Berry mexanizmi kuzatiladigan tizimlar:")
        drawBulletPoint("Metal karbonillar: [Fe(CO)₅], [Mn(CO)₅]⁻, [Cr(CO)₅L]")
        drawBulletPoint("Fosforan: PF₅, PCl₅ (5-koordinatsion asosiy guruh birikmalar)")
        drawBulletPoint("Silikat va germanat: SiF₅⁻, GeF₅⁻")
        drawBulletPoint("5-koordinatsion o'tkinchi metall komplekslar: [Ni(CN)₅]³⁻")
      }

      // 7. VAN DER WAALS
      if (pdfSections.vanderwaals) {
        drawSectionHeader(7, "Van der Waals ta'siri va sterik strain")
        drawParagraph(
          "Van der Waals kuchlari — atomlar orasidagi qisqa-oraliqli itarilish (r⁻¹²) va uzoq-oraliqli " +
          "tortilish (dispersion, r⁻⁶) ta'sirlari. Konformatsion izomerlar orasidagi energiya farqlarining " +
          "asosiy manbai."
        )
        drawFormula("E_vdW = 4ε [(σ/r)¹² − (σ/r)⁶]   [Lennard-Jones potensiali]", { size: 11 })
        drawParagraph(
          "bu yerda ε — potensial chuqurligi, σ — atomlar orasi zerolik nuqtasi, r — atomlar orasi masofa."
        )
        drawInfoBox(
          "Van der Waals radiusi jadvali",
          "H: 1.20 Å  |  C: 1.70 Å  |  N: 1.55 Å  |  O: 1.52 Å  |  F: 1.47 Å\n" +
          "Cl: 1.75 Å  |  Br: 1.85 Å  |  Metallar: ~2.00 Å\n\n" +
          "Ikki H atomi orasida 2.4 Å dan yaqin bo'lsa — sterik strain paydo bo'ladi.",
          { bgColor: C.bgGreen, borderColor: C.green, titleColor: C.green }
        )
        drawParagraph("[Co(en)₃]³⁺ da van der Waals strain manbalari:")
        drawBulletPoint("N-H ↔ N-H itarilish (qo'shni en halqalari orasida)")
        drawBulletPoint("C-H ↔ C-H itarilish (metilen guruhlari orasida)")
        drawBulletPoint("N-H ↔ C-H (halqalar bir-biriga yaqin joylashsa)")
        drawBulletPoint("ob konformatsiyada — H atomlar C₃ o'qiga yaqin, itarilish katta")
        drawInfoBox(
          "Nima uchun lel₃ afzal?",
          "lel₃ konformatsiyada barcha 3 ta en halqa C₃ o'q bilan parallel joylashadi. H atomlari " +
          "ekvatorial (ochilgan) tomonlarga yo'nalgan — sterik itarilish minimum. Ob halqalarida H " +
          "atomlar C₃ o'qi tomon yo'nalgan va bir-biriga yaqinlashib, van der Waals itarilishini " +
          "kuchaytiradi.",
          { bgColor: C.bgYellow, borderColor: C.yellow, titleColor: C.yellow }
        )
      }

      // 8. NMR
      if (pdfSections.nmr) {
        drawSectionHeader(8, "Dinamik NMR spektroskopiya (Wüthrich, Nobel 2002)")
        drawParagraph(
          "Konformatsion o'tishlarni real vaqtda kuzatishning asosiy usuli — NMR spektroskopiya. " +
          "Kurt Wüthrich (Nobel 2002) bu usulda temperatura effektlari va koalensiya harorati (Tc) " +
          "tushunchasini rivojlantirdi."
        )
        drawInfoBox(
          "Koalensiya harorat (Tc)",
          "Ikkita konformatsiya orasida ligandlar tez almashinsa (k > 10³ s⁻¹), NMR piklari birlashadi. " +
          "Sekin o'tishda (k < 10² s⁻¹) esa alohida piklar ko'rinadi. O'tish nuqtasi — Tc.\n\n" +
          "k_c = π · Δν / √2\n" +
          "Ea = 2.3 · R · Tc · (10.32 + log(Tc / k_c))",
          { bgColor: C.bgPurple, borderColor: C.purple }
        )
        drawParagraph(
          "Xona haroratida ko'p konformatsion izomerlar juda tez almashinadi — NMR ularni \"o'rtacha\" " +
          "holat sifatida ko'radi. Past haroratlarda (-100 °C) individual konformatsiyalarni ajratib " +
          "kuzatish mumkin."
        )
        drawParagraph("Dinamik NMR bilan aniqlanadigan parametrlar:")
        drawBulletPoint("Aktivatsiya energiyasi Ea (kJ/mol) — Arrhenius grafigi")
        drawBulletPoint("Aktivatsiya entalpiyasi ΔH‡ (Eyring tenglamasi)")
        drawBulletPoint("Aktivatsiya entropiyasi ΔS‡ (o'tish holati tuzilishi)")
        drawBulletPoint("Konformatsion nisbat (integrsiya orqali populyatsiya)")
        drawInfoBox(
          "[Fe(CO)₅] mashhur NMR misoli",
          "Xona haroratida ¹³C NMR spektrida bitta pik (barcha 5 CO ekvivalent). Past haroratda " +
          "(−170 °C) esa 2 pik ajraladi (aksial va ekvatorial CO 2:3 nisbatda). Berry aktivatsiya " +
          "energiyasi: Ea ≈ 15 kJ/mol.",
          { bgColor: C.bgOrange, borderColor: C.orange, titleColor: C.orange }
        )
      }

      // 9. EDTA
      if (pdfSections.edta) {
        drawSectionHeader(9, "EDTA konformatsion boyligi va tibbiy ahamiyat")
        drawParagraph(
          "Etilendiamintetraatsetat (EDTA⁴⁻) — koordinatsion kimyoning eng ko'p ishlatiladigan " +
          "poli-xelat ligandlaridan biri. 6 dentat (2 N + 4 O donor), 5 ta 5-a'zoli xelat halqa. Har bir " +
          "halqa mustaqil konformatsiyaga ega — taxminan 8 ta mumkin bo'lgan izomer."
        )
        drawInfoBox(
          "EDTA konformatsion moslashuvchanligi",
          "5 ta halqa har biri δ yoki λ konformatsiyada bo'lishi mumkin (2⁵ = 32 nazariy imkoniyat). " +
          "Simmetriya va sterik cheklovlar tufayli haqiqiy izomer soni ~8. Bu \"konformatsion boylik\" " +
          "EDTA ning turli metallar bilan mos tushishga imkon beradi — Ca²⁺, Mg²⁺, Fe³⁺, Cu²⁺, Pb²⁺, " +
          "Cd²⁺, Hg²⁺ va 25+ metallar.",
          { bgColor: C.bgGreen, borderColor: C.green, titleColor: C.green }
        )
        drawParagraph("EDTA ning tibbiy foydalanishi:")
        drawBulletPoint("Chelation therapy — qo'rg'oshin, kadmiy, simob zaharlanishi (FDA)", { bulletColor: C.red })
        drawBulletPoint("Ca-EDTA — poydevor tozalash agenti, gemodializ uchun")
        drawBulletPoint("Fe-EDTA — o'g'itlarda temir yetishmovchiligini davolash")
        drawBulletPoint("Gd-EDTA analoglari — MRT kontrast dorilar (Magnevist, Dotarem)")
        drawBulletPoint("Anti-koagulyant qonda EDTA yordamida saqlanadi")
        drawInfoBox(
          "Konformatsion tanlash — dori dizayni asosi",
          "EDTA tibbiy samaradorligi konformatsion moslashuvchanlikka bog'liq. Turli metallar uchun " +
          "EDTA turli konformatsiyada joylashadi. Bu — \"induced fit\" tamoyili — metall EDTA halqa " +
          "konformatsiyasini o'ziga moslashtiradi. Zamonaviy dori dizaynida (drug design) konformatsion " +
          "moslashuvchanlik — kalit tushuncha.",
          { bgColor: C.bgPurple, borderColor: C.purple }
        )
      }

      // 10. TABLE
      if (pdfSections.table) {
        drawSectionHeader(10, "Konformatsion izomerlar solishtirish jadvali")

        const rows = [["Xususiyat"]]
        isomerKeys.forEach(k => rows[0].push(currentComplex.isomers[k].shortLabel || currentComplex.isomers[k].label))

        if (currentComplex.isomerType === "chelate") {
          rows.push(["Naqsh"].concat(isomerKeys.map(k => currentComplex.isomers[k].confPattern)))
        }
        rows.push(["Simmetriya"].concat(isomerKeys.map(k => currentComplex.isomers[k].pointGroup)))
        rows.push(["Energiya (kJ/mol)"].concat(isomerKeys.map(k => `${currentComplex.isomers[k].energy}`)))
        rows.push(["Populyatsiya (%)"].concat(isomerKeys.map(k => `${(currentComplex.isomers[k].occupationRatio * 100).toFixed(0)}`)))
        if (currentComplex.isomerType === "chelate" || currentComplex.isomerType === "edta") {
          rows.push(["Dihedral (°)"].concat(isomerKeys.map(k => `${currentComplex.isomers[k].dihedralAngle}`)))
        }
        rows.push(["Sterik strain"].concat(isomerKeys.map(k => currentComplex.isomers[k].stericStrain)))

        const numCols = rows[0].length
        const firstColW = CONTENT_W * 0.28
        const otherColW = (CONTENT_W - firstColW) / (numCols - 1)
        const colW = [firstColW].concat(Array(numCols - 1).fill(otherColW))

        const rowH = 22
        checkBreak(rows.length * rowH + 15)

        rows.forEach((row, ri) => {
          const isHeader = ri === 0
          if (isHeader) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.purple })
          } else if (ri % 2 === 0) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.bgPurple })
          }
          let cx = MARGIN + 8
          row.forEach((cell, ci) => {
            const f = isHeader ? boldFont : regularFont
            const txt = truncate(cleanText(cell), f, 8, colW[ci] - 14)
            let color = isHeader ? C.white : C.textDark
            if (!isHeader && ci > 0) {
              const iso = currentComplex.isomers[isomerKeys[ci - 1]]
              if (iso.color_hex) {
                const hex = iso.color_hex.replace("#", "")
                const r = parseInt(hex.slice(0, 2), 16) / 255
                const g = parseInt(hex.slice(2, 4), 16) / 255
                const b = parseInt(hex.slice(4, 6), 16) / 255
                color = rgb(r * 0.7, g * 0.7, b * 0.7)
              }
            }
            page.drawText(txt, { x: cx, y: y - rowH + 7, size: 8, font: f, color })
            cx += colW[ci]
          })
          y -= rowH
        })
        y -= 12

        drawParagraph(
          `Jami ${isomerKeys.length} ta konformatsion izomer. Statistik populyatsiya nisbati Boltzmann ` +
          `qonuniga bo'ysunadi: N_i / N_0 = exp(-ΔE / RT). Xona haroratida (298 K) faqat quyi energiyali ` +
          `izomerlar sezilarli miqdorda mavjud.`,
          { font: italicFont, color: C.textMuted }
        )
      }

      // 11. REFERENCES
      if (pdfSections.references) {
        drawSectionHeader(11, "Foydalanilgan adabiyotlar")
        const refs = [
          "Corey, E. J., & Bailar, J. C. Jr. (1959). The Stereochemistry of Complex Inorganic Compounds. XX. Stereospecific Effects in Complex Ions. Journal of the American Chemical Society, 81(11), 2620–2629.",
          "Barton, D. H. R. (1950). The Conformation of the Steroid Nucleus. Experientia, 6(8), 316–320.",
          "Barton, D. H. R. (1969). The Principles of Conformational Analysis (Nobel Lecture). Nobel Foundation.",
          "Berry, R. S. (1960). Correlation of Rates of Intramolecular Tunneling Processes, with Application to Some Group V Compounds. Journal of Chemical Physics, 32(3), 933–938.",
          "Ramachandran, G. N., & Sasisekharan, V. (1968). Conformation of Polypeptides and Proteins. Advances in Protein Chemistry, 23, 283–437.",
          "Wüthrich, K. (2003). NMR Studies of Structure and Function of Biological Macromolecules (Nobel Lecture). Angewandte Chemie International Edition, 42(29), 3340–3363.",
          "Münz, F. (1935). Amino polycarboxylic acids and their salts. Patent DE 718 981 (IG Farben).",
          "Feringa, B. L. (2017). The Art of Building Small (Nobel Lecture). Angewandte Chemie International Edition, 56(37), 11060–11078.",
          "Cotton, F. A., Wilkinson, G., Murillo, C. A., & Bochmann, M. (1999). Advanced Inorganic Chemistry, 6th ed. Wiley-Interscience.",
          "Miessler, G. L., Fischer, P. J., & Tarr, D. A. (2014). Inorganic Chemistry, 5th ed. Pearson Education.",
          "Hancock, R. D. (1989). Molecular mechanics calculations as a tool in coordination chemistry. Progress in Inorganic Chemistry, 37, 187–291.",
          "Comba, P., Hambley, T. W., & Martin, B. (2009). Molecular Modeling of Inorganic Compounds, 3rd ed. Wiley-VCH.",
          "IUPAC (2005). Nomenclature of Inorganic Chemistry — IUPAC Recommendations 2005 (Red Book). RSC Publishing."
        ]
        refs.forEach((r, i) => {
          drawParagraph(`[${i + 1}] ${r}`, { size: 9, color: C.textDark })
        })
      }

      addFooter(page, pageNumber)

      pdfDoc.setTitle(`Transformatsion izomeriya — ${cleanText(currentComplex.formula)}`)
      pdfDoc.setSubject("Transformatsion (konformatsion) izomeriya, xelat halqa, Berry pseudorotation")
      pdfDoc.setAuthor("JDA-Kimyo (jdakimyo.uz)")
      pdfDoc.setCreator("jdakimyo.uz Transformatsion izomeriya 3D Lab")
      pdfDoc.setProducer("pdf-lib + DejaVu Sans")
      pdfDoc.setKeywords([
        "transformatsion izomeriya", "konformatsion izomeriya", "Corey-Bailar",
        "Berry pseudorotation", "xelat halqa", "Barton", "koordinatsion kimyo",
        "lel", "ob", "delta", "lambda", "EDTA", "Fe(CO)5", "dinamik NMR"
      ])

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `transformatsion_izomeriya_${currentComplex.id}_${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setShowPDFModal(false)
    } catch (err) {
      console.error("PDF generatsiyasida xatolik:", err)
      alert("PDF yaratishda xatolik yuz berdi:\n" + (err?.message || err))
    } finally {
      setPdfGenerating(false)
    }
  }, [currentComplex, pdfSections, pdfGenerating, isomerKeys])

  // ═══════════════════════════════════════════════════════════
  // 📚 IQTIBOS GENERATSIYA
  // ═══════════════════════════════════════════════════════════
  const generateCitation = () => {
    const year = new Date().getFullYear()
    const date = new Date().toLocaleDateString("uz-UZ")
    const url = "https://jdakimyo.uz/oquv/izomeriyasi/transformatsion/3d"
    switch (citationFormat) {
      case "APA":
        return `Jaka-Kimyo. (${year}). Transformatsion izomeriya — ${currentComplex.formula}: interaktiv 3D vizualizatsiya. jdakimyo.uz. Retrieved ${date}, from ${url}`
      case "MLA":
        return `"Transformatsion izomeriya — ${currentComplex.formula}: Interaktiv 3D vizualizatsiya." Jaka-Kimyo, ${year}, ${url}. Accessed ${date}.`
      case "Chicago":
        return `Jaka-Kimyo. "Transformatsion izomeriya — ${currentComplex.formula}: Interaktiv 3D vizualizatsiya." Accessed ${date}. ${url}.`
      case "BibTeX":
        return `@misc{jdakimyo${year}transformatsion,\n  author = {{Jaka-Kimyo}},\n  title = {Transformatsion izomeriya --- ${currentComplex.formula}: interaktiv 3D vizualizatsiya},\n  year = {${year}},\n  url = {${url}},\n  note = {Accessed ${date}}\n}`
      default:
        return ""
    }
  }

  const copyToClipboard = (text) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => alert("Nusxalandi!"))
  }

  // ═══════════════════════════════════════════════════════════
  // 📊 KONFORMATSIYA ENERGIYA DIAGRAMMASI SVG
  // ═══════════════════════════════════════════════════════════
  const EnergyDiagramSVG = () => {
    const width = 280, height = 180, padding = 30
    const maxEnergy = Math.max(...isomers.map(i => i.energy)) + 1
    return (
      <svg width={width} height={height} className="bg-purple-950/60 rounded-lg">
        {/* Y o'q */}
        <line x1={padding} y1={padding / 2} x2={padding} y2={height - padding} stroke="#666" strokeWidth="1" />
        {/* X o'q */}
        <line x1={padding} y1={height - padding} x2={width - 10} y2={height - padding} stroke="#666" strokeWidth="1" />
        <text x={5} y={padding / 2 + 6} fill="#c4b5fd" fontSize="9">E (kJ/mol)</text>
        <text x={width - 15} y={height - padding + 12} fill="#c4b5fd" fontSize="9" textAnchor="end">Konf.</text>

        {/* Baraslar */}
        {isomers.map((iso, i) => {
          const barW = (width - padding - 20) / isomers.length - 5
          const x = padding + 5 + i * (barW + 5)
          const barH = (iso.energy / maxEnergy) * (height - padding - padding / 2)
          const y2 = height - padding - barH
          return (
            <g key={i}>
              <rect x={x} y={y2} width={barW} height={barH} fill={iso.color_hex} opacity="0.85" />
              <text x={x + barW / 2} y={y2 - 3} fill={iso.color_hex} fontSize="8" textAnchor="middle" fontWeight="bold">{iso.energy}</text>
              <text x={x + barW / 2} y={height - padding + 10} fill="#e5e7eb" fontSize="8" textAnchor="middle">{iso.shortLabel || iso.label.substring(0, 6)}</text>
            </g>
          )
        })}
      </svg>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // 📊 BOLTZMANN POPULYATSIYA SVG (pie chart)
  // ═══════════════════════════════════════════════════════════
  const PopulationSVG = () => {
    const width = 260, height = 180, cx = 90, cy = 90, radius = 65
    let angleStart = -Math.PI / 2
    return (
      <svg width={width} height={height} className="bg-purple-950/60 rounded-lg">
        {isomers.map((iso, i) => {
          const angleEnd = angleStart + iso.occupationRatio * 2 * Math.PI
          const x1 = cx + radius * Math.cos(angleStart)
          const y1 = cy + radius * Math.sin(angleStart)
          const x2 = cx + radius * Math.cos(angleEnd)
          const y2 = cy + radius * Math.sin(angleEnd)
          const largeArc = iso.occupationRatio > 0.5 ? 1 : 0
          const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
          // Legend
          const legendY = 15 + i * 22
          const percentAngle = (angleStart + angleEnd) / 2
          const px = cx + (radius * 0.65) * Math.cos(percentAngle)
          const py = cy + (radius * 0.65) * Math.sin(percentAngle)
          const el = (
            <g key={i}>
              <path d={pathData} fill={iso.color_hex} opacity="0.85" stroke="#0a0a1a" strokeWidth="1" />
              {iso.occupationRatio > 0.08 && (
                <text x={px} y={py} fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">
                  {(iso.occupationRatio * 100).toFixed(0)}%
                </text>
              )}
              {/* Legend */}
              <rect x={175} y={legendY - 8} width={10} height={10} fill={iso.color_hex} />
              <text x={190} y={legendY} fill="#e5e7eb" fontSize="9">
                {iso.shortLabel || iso.label.substring(0, 8)}
              </text>
            </g>
          )
          angleStart = angleEnd
          return el
        })}
      </svg>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // 🎨 UI HELPER
  // ═══════════════════════════════════════════════════════════
  const Section = ({ id, title, icon, children }) => (
    <div className="border-b border-purple-800/40 last:border-b-0">
      <button
        onClick={() => setCollapsedSection(s => ({ ...s, [id]: !s[id] }))}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-purple-900/30 transition-colors"
      >
        <span className="text-sm font-semibold text-purple-200">{icon} {title}</span>
        <span className="text-purple-400 text-xs">{collapsedSection[id] ? "▼" : "▲"}</span>
      </button>
      {!collapsedSection[id] && <div className="px-3 pb-3 space-y-2">{children}</div>}
    </div>
  )

  const Toggle = ({ label, value, onChange, note }) => (
    <div className="flex items-center justify-between text-xs">
      <div>
        <div className="text-purple-200">{label}</div>
        {note && <div className="text-purple-400 text-[10px]">{note}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full transition-colors ${value ? "bg-green-500" : "bg-purple-800"} relative flex-shrink-0`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // 🖼️ RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen flex flex-col text-white bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950">

      {/* HEADER */}
      {!fullscreen && (
        <header className="flex items-center gap-3 px-4 py-3 bg-purple-950/90 backdrop-blur-md border-b border-purple-800/50 z-30">
          <Link href="/oquv/izomeriyasi" className="text-purple-400 hover:text-purple-300">← Orqaga</Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-green-400 truncate">
              🔄 Transformatsion izomeriya — 3D interaktiv laboratoriya
            </h1>
            <p className="text-purple-400 text-xs truncate">
              Konformatsion izomerlar • {currentComplex.formula} • {currentComplex.geometry} • jdakimyo.uz
            </p>
          </div>

          <select
            value={complexId}
            onChange={(e) => setComplexId(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-purple-900/50 text-purple-200 border border-purple-700/50 hover:bg-purple-800/50 cursor-pointer"
          >
            <option value="Coen3_conf">[Co(en)₃]³⁺ Corey-Bailar</option>
            <option value="CaEDTA_conf">[Ca(EDTA)]²⁻ tibbiy</option>
            <option value="Berry_TBP">[Fe(CO)₅] Berry</option>
          </select>

          <button onClick={() => setShowHistoryPanel(v => !v)} title="Tarixiy voqealar"
            className="p-2 rounded-lg text-sm bg-purple-900/50 text-purple-300 hover:bg-purple-800/50">📖</button>
          <button onClick={() => setShowCitationModal(true)} title="Iqtibos olish"
            className="p-2 rounded-lg text-sm bg-purple-900/50 text-purple-300 hover:bg-purple-800/50">📚</button>
          <button onClick={() => setShowPDFModal(true)} title="PDF ilmiy hisobot"
            className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg">
            📄 PDF
          </button>
          <button onClick={() => setFullscreen(true)} title="To'liq ekran"
            className="p-2 rounded-lg text-sm bg-purple-900/50 text-purple-300 hover:bg-purple-800/50">🖥️</button>
        </header>
      )}

      {fullscreen && (
        <button onClick={() => setFullscreen(false)}
          className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-purple-900/80 text-white hover:bg-purple-800 backdrop-blur-md border border-purple-700/50">✕</button>
      )}

      {/* 3D CANVAS */}
      <div className="flex-1 w-full relative min-h-[500px]" style={{ minHeight: fullscreen ? "100vh" : "auto" }}>
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* BOSHQARUV PANELI */}
        {!fullscreen && (
          <div className="absolute z-20 bg-purple-950/95 backdrop-blur-md rounded-xl border border-purple-700/50 w-[290px] shadow-2xl flex flex-col"
            style={{ left: panelPos.x, top: panelPos.y, maxHeight: "calc(100vh - 200px)" }}>
            <div onMouseDown={handlePanelMouseDown}
              className="cursor-grab active:cursor-grabbing bg-purple-900/60 hover:bg-purple-800/60 px-3 py-2 rounded-t-xl flex items-center justify-between border-b border-purple-800/50">
              <span className="text-sm font-bold text-purple-200">⋮⋮ 🎛️ Boshqaruv paneli</span>
              <span className="text-purple-400 text-xs">↕ ↔</span>
            </div>

            <div className="overflow-y-auto flex-1">
              <Section id="view" title="Ko'rinish" icon="🎨">
                <div className="flex gap-1">
                  {[{ v: "ball", l: "🔗" }, { v: "cpk", l: "⚪" }, { v: "wire", l: "🕸️" }].map(it => (
                    <button key={it.v} onClick={() => setViewMode(it.v)}
                      className={`flex-1 py-1.5 rounded text-sm ${viewMode === it.v ? "bg-green-500/30 border border-green-500/50" : "bg-purple-900/40 border border-purple-700/40"}`}>
                      {it.l}
                    </button>
                  ))}
                </div>
                <Toggle label="🏷️ Atom yorliqlari" value={showLabels} onChange={setShowLabels} />
                <Toggle label="🔄 Avto aylanish" value={autoRotate} onChange={setAutoRotate} />
              </Section>

              <Section id="conformation" title="Konformatsiya" icon="🔬">
                {currentComplex.isomerType === "chelate" && (
                  <>
                    <Toggle label="📐 Dihedral burchak" value={showDihedral} onChange={setShowDihedral}
                      note="N-C-C-N burchagi" />
                    <Toggle label="⚠️ Sterik strain" value={showStrain} onChange={setShowStrain}
                      note="ob halqalar itarilishi" />
                  </>
                )}
                {currentComplex.isomerType === "edta" && (
                  <>
                    <Toggle label="🔗 Xelat halqalar" value={showRings} onChange={setShowRings}
                      note="5 ta halqa (rangli)" />
                    <Toggle label="⚠️ Sterik strain" value={showStrain} onChange={setShowStrain} />
                  </>
                )}
                {currentComplex.isomerType === "berry" && (
                  <>
                    <Toggle label="🌀 Berry o'tish yo'nalishi" value={showTransition} onChange={setShowTransition}
                      note="TBP → SP → TBP'" />
                    <Toggle label="▶️ Berry animatsiyasi" value={animateBerry} onChange={setAnimateBerry}
                      note="Real vaqt tebranish" />
                  </>
                )}
              </Section>

              <Section id="energy" title="Energiya tahlili" icon="⚡">
                <button onClick={() => setActivePanel("energyDiagram")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  📊 Energiya diagrammasi
                </button>
                <button onClick={() => setActivePanel("population")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  📈 Boltzmann populyatsiya
                </button>
                <button onClick={() => setActivePanel("nmr")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  🔊 Dinamik NMR (Wüthrich)
                </button>
              </Section>

              <Section id="dynamics" title="Dinamika" icon="🌀">
                <button onClick={() => setActivePanel("barton")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  ⚗️ Barton nazariyasi (Nobel 1969)
                </button>
                <button onClick={() => setActivePanel("berry")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  🌀 Berry pseudorotation
                </button>
                <button onClick={() => setActivePanel("vdw")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  🔴 Van der Waals ta'siri
                </button>
              </Section>

              <Section id="science" title="Ilmiy tahlil" icon="🔬">
                <button onClick={() => setActivePanel("info")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  ℹ️ Kompleks ma'lumotlari
                </button>
                <button onClick={() => setActivePanel("coreyBailar")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  📐 Corey-Bailar (1959)
                </button>
                <button onClick={() => setActivePanel("edta")}
                  className="w-full px-2 py-1.5 rounded bg-green-900/40 border border-green-700/40 text-xs text-green-200 hover:bg-green-800/40">
                  💊 EDTA — tibbiy ahamiyat
                </button>
              </Section>

              <Section id="history" title="Tarix" icon="📜">
                <button onClick={() => setShowHistoryPanel(true)}
                  className="w-full px-2 py-1.5 rounded bg-yellow-900/40 border border-yellow-700/40 text-xs text-yellow-200 hover:bg-yellow-800/40">
                  📖 To'liq xronologiya
                </button>
              </Section>
            </div>
          </div>
        )}

        {/* MA'LUMOT PANELI */}
        {!fullscreen && activePanel && (
          <div className="absolute top-3 right-3 z-30 w-[320px] max-h-[calc(100vh-200px)] overflow-y-auto bg-purple-950/95 backdrop-blur-md rounded-xl border border-purple-700/50 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-green-400">
                {activePanel === "info" && "ℹ️ Kompleks ma'lumotlari"}
                {activePanel === "energyDiagram" && "📊 Energiya diagrammasi"}
                {activePanel === "population" && "📈 Boltzmann populyatsiya"}
                {activePanel === "nmr" && "🔊 Dinamik NMR"}
                {activePanel === "barton" && "⚗️ Barton nazariyasi"}
                {activePanel === "berry" && "🌀 Berry pseudorotation"}
                {activePanel === "vdw" && "🔴 Van der Waals"}
                {activePanel === "coreyBailar" && "📐 Corey-Bailar (1959)"}
                {activePanel === "edta" && "💊 EDTA tibbiy"}
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-lg leading-none">×</button>
            </div>

            {/* INFO */}
            {activePanel === "info" && (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-purple-400">Formula:</div>
                  <div className="text-white font-mono">{currentComplex.formula}</div>
                  <div className="text-purple-400">Ligand:</div>
                  <div className="text-white">{currentComplex.ligandName}</div>
                  <div className="text-purple-400">Geometriya:</div>
                  <div className="text-white">{currentComplex.geometry}</div>
                  <div className="text-purple-400">Koord. son:</div>
                  <div className="text-white">{currentComplex.coordinationNumber}</div>
                  <div className="text-purple-400">Gibridlanish:</div>
                  <div className="text-white">{currentComplex.hybridization}</div>
                  <div className="text-purple-400">Halqa hajmi:</div>
                  <div className="text-white">{currentComplex.ringSize}</div>
                  <div className="text-purple-400">Bog' (Å):</div>
                  <div className="text-white">{currentComplex.bondLengthReal}</div>
                </div>
                <div className="pt-2 border-t border-purple-800/50">
                  <div className="text-purple-300 font-semibold mb-1">{isomerKeys.length} ta konformatsion izomer:</div>
                  {isomers.map((iso, i) => (
                    <div key={i} className="text-[11px]">
                      <span style={{ color: iso.color_hex }} className="font-bold">{iso.shortLabel || iso.label}</span>: {iso.energy} kJ/mol ({(iso.occupationRatio * 100).toFixed(0)}%)
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-purple-800/50 text-purple-300 italic text-[11px]">
                  {currentComplex.scientificNotes}
                </div>
              </div>
            )}

            {/* ENERGY DIAGRAM */}
            {activePanel === "energyDiagram" && (
              <div className="space-y-2 text-xs">
                <EnergyDiagramSVG />
                <p className="text-purple-300">Har bir konformatsion izomerning nisbiy energiyasi (kJ/mol). Eng past — barqarorroq.</p>
                <div className="bg-purple-900/40 rounded p-2 text-[11px]">
                  <b>Boltzmann taqsimoti:</b> N_i / N_0 = exp(−ΔE / RT)<br />
                  T = 298 K: ΔE = 1 kJ/mol → 1.5:1 nisbat
                </div>
              </div>
            )}

            {/* POPULATION */}
            {activePanel === "population" && (
              <div className="space-y-2 text-xs">
                <PopulationSVG />
                <p className="text-purple-300">Xona haroratida (298 K) konformatsion izomerlar populyatsiya nisbati.</p>
              </div>
            )}

            {/* NMR */}
            {activePanel === "nmr" && (
              <div className="space-y-2 text-xs text-purple-200">
                <div className="bg-orange-950/40 rounded p-2 border border-orange-700/40">
                  <div className="text-orange-400 font-bold">Kurt Wüthrich (Nobel 2002)</div>
                  <div className="text-purple-300 text-[11px]">Dinamik NMR spektroskopiya</div>
                </div>
                <p>Konformatsion o'tishlar NMR spektrida koalensiya effektini beradi:</p>
                <div className="bg-purple-900/40 rounded p-2 font-mono text-[10px]">
                  k_c = π · Δν / √2<br/>
                  Ea = 2.3 · R · Tc · (10.32 + log(Tc/k_c))
                </div>
                <div className="bg-yellow-900/30 p-2 rounded text-[11px]">
                  <b>[Fe(CO)₅]:</b> xona T da 1 pik, −170 °C da 2 pik. Ea ≈ 15 kJ/mol.
                </div>
              </div>
            )}

            {/* BARTON */}
            {activePanel === "barton" && (
              <div className="space-y-2 text-xs text-purple-200">
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded p-2 border border-yellow-700/40">
                  <div className="text-yellow-400 font-bold">🏆 Derek Barton (Nobel 1969)</div>
                  <div className="text-purple-300 text-[11px]">Konformatsion tahlil asoschisi</div>
                </div>
                <p>Barton konformatsion nazariya asoslarini ishlab chiqdi: PES yuzasi, potentsial minimumlar, energiya to'sig'i.</p>
                <div className="bg-purple-900/40 rounded p-2 font-mono text-[10px]">
                  k = A · exp(−Ea / RT)
                </div>
                <p className="text-[11px]">Xelat halqalar uchun Ea ≈ 2-15 kJ/mol — xona haroratida tez o'tish.</p>
              </div>
            )}

            {/* BERRY */}
            {activePanel === "berry" && (
              <div className="space-y-2 text-xs text-purple-200">
                <div className="bg-blue-950/40 rounded p-2 border border-blue-700/40">
                  <div className="text-blue-400 font-bold">R. Stephen Berry (Chicago, 1960)</div>
                  <div className="text-purple-300 text-[11px]">TBP ⇌ SP pseudorotation</div>
                </div>
                <p>5-koordinatsion komplekslarda ligandlar bog'i uzilmasdan mavqe almashadi:</p>
                <div className="bg-purple-900/40 rounded p-2 text-[11px]">
                  1) 2 aksial CO yaqinlashadi (180° → 105°)<br/>
                  2) 2 ekvatorial CO uzoqlashadi (120° → 180°)<br/>
                  3) Oraliq: SP shakli (C₄ᵥ)<br/>
                  4) Yakuniy: yangi TBP, mavqelar almashgan
                </div>
                <p className="text-[11px] italic">Ea ≈ 8-15 kJ/mol, tezlik 10⁷ s⁻¹.</p>
              </div>
            )}

            {/* VDW */}
            {activePanel === "vdw" && (
              <div className="space-y-2 text-xs text-purple-200">
                <p>Van der Waals kuchlari — atomlar orasidagi qisqa-oraliqli itarilish va uzoq-oraliqli tortilish.</p>
                <div className="bg-purple-900/40 rounded p-2 font-mono text-[10px]">
                  E_vdW = 4ε [(σ/r)¹² − (σ/r)⁶]<br />
                  Lennard-Jones potensiali
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div>H: 1.20 Å</div><div>N: 1.55 Å</div>
                  <div>C: 1.70 Å</div><div>O: 1.52 Å</div>
                  <div>Cl: 1.75 Å</div><div>Br: 1.85 Å</div>
                </div>
                <p className="text-[11px] italic">Ikki H atomi &lt; 2.4 Å — sterik strain.</p>
              </div>
            )}

            {/* COREY-BAILAR */}
            {activePanel === "coreyBailar" && (
              <div className="space-y-2 text-xs text-purple-200">
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded p-2 border border-yellow-700/40">
                  <div className="text-yellow-400 font-bold">🏆 E. J. Corey (Nobel 1990) & J. C. Bailar Jr.</div>
                  <div className="text-purple-300 text-[11px]">Illinois universiteti, 1959</div>
                </div>
                <p>[Co(en)₃]³⁺ da 4 ta konformatsion izomer:</p>
                <div className="grid gap-1 text-[10px]">
                  <div className="bg-green-900/30 p-1.5 rounded"><b className="text-green-400">lel₃</b> — 42%, D₃, 0 kJ/mol</div>
                  <div className="bg-yellow-900/30 p-1.5 rounded"><b className="text-yellow-400">lel₂ob</b> — 38%, C₂, 1.6 kJ/mol</div>
                  <div className="bg-orange-900/30 p-1.5 rounded"><b className="text-orange-400">lelob₂</b> — 15%, C₂, 3.2 kJ/mol</div>
                  <div className="bg-red-900/30 p-1.5 rounded"><b className="text-red-400">ob₃</b> — 5%, D₃, 4.8 kJ/mol</div>
                </div>
              </div>
            )}

            {/* EDTA */}
            {activePanel === "edta" && (
              <div className="space-y-2 text-xs text-purple-200">
                <div className="bg-green-950/40 rounded p-2 border border-green-700/40">
                  <div className="text-green-400 font-bold">💊 EDTA — koordinatsion tibbiyot</div>
                  <div className="text-purple-300 text-[11px]">Münz 1935, chelation therapy</div>
                </div>
                <p>EDTA⁴⁻ — 6 dentat ligand, 5 ta 5-a'zoli xelat halqa. Konformatsion boylik → 25+ metallar bilan kompleks.</p>
                <div className="bg-purple-900/40 rounded p-2 text-[11px]">
                  <b>Tibbiy foydalanish:</b><br/>
                  • Pb, Cd, Hg zaharlanishi (FDA)<br/>
                  • Ca-EDTA — gemodializ<br/>
                  • Gd-EDTA — MRT kontrast<br/>
                  • Fe-EDTA — anemiya
                </div>
                <p className="text-[11px] italic">Konformatsion tanlash — zamonaviy dori dizayni asosi.</p>
              </div>
            )}
          </div>
        )}

        {/* TARIX PANELI */}
        {showHistoryPanel && !fullscreen && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-2xl max-h-[50vh] overflow-y-auto bg-purple-950/95 backdrop-blur-md rounded-xl border border-yellow-700/50 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-yellow-400">📖 Transformatsion izomeriya tarixi</h3>
              <button onClick={() => setShowHistoryPanel(false)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3">
              {HISTORY.map((h, i) => (
                <div key={i} className="border-l-2 border-yellow-500/50 pl-3 py-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-yellow-400 font-bold text-sm">{h.year}</span>
                    <span className="text-green-400 font-semibold text-xs">{h.hero}</span>
                  </div>
                  <div className="text-purple-200 text-xs font-semibold mt-0.5">{h.title}</div>
                  <div className="text-purple-300 text-[11px] mt-0.5">{h.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Klaviatura hint */}
        {!fullscreen && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-purple-950/70 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] text-purple-300 z-10 border border-purple-800/50 pointer-events-none">
            🖱️ aylanish · 🔍 zoom · <b>F</b> to'liq · <b>D</b> dihedral · <b>S</b> strain · <b>B</b> Berry · <b>1/2/3</b> kompleks
          </div>
        )}
      </div>

      {/* FOOTER */}
      {!fullscreen && (
        <div className="bg-purple-950/90 backdrop-blur-md border-t border-purple-800/50 z-10">
          <div className="flex justify-center gap-3 sm:gap-6 py-2 px-3 sm:px-6 flex-wrap text-xs">
            <div className="flex flex-col items-center">
              <span className="text-purple-400 text-[10px]">Geometriya</span>
              <span className="text-white font-bold text-[10px]">{currentComplex.geometry}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-purple-400 text-[10px]">Koord. son</span>
              <span className="text-white font-bold">{currentComplex.coordinationNumber}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-purple-400 text-[10px]">Gibrid.</span>
              <span className="text-white font-bold text-[10px]">{currentComplex.hybridization}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-purple-400 text-[10px]">Izomerlar</span>
              <span className="text-green-300 font-bold">{isomerKeys.length}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-purple-400 text-[10px]">Eng barqaror</span>
              <span style={{ color: isomers[0].color_hex }} className="font-bold text-[10px]">{isomers[0].shortLabel || isomers[0].label.substring(0, 8)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-purple-400 text-[10px]">Populyatsiya</span>
              <span className="text-yellow-300 font-bold">{(isomers[0].occupationRatio * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div className="flex justify-center gap-3 sm:gap-5 py-2 px-4 bg-purple-950/60 border-t border-purple-800/30 flex-wrap text-[11px]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: `#${currentComplex.center.color.toString(16).padStart(6, '0')}` }} />
              <span className="text-purple-300">{currentComplex.center.element}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#3050F8" }} />
              <span className="text-purple-300">N donor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#FF0D0D" }} />
              <span className="text-purple-300">O donor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#48DBFB" }} />
              <span className="text-cyan-300">δ halqa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#F368E0" }} />
              <span className="text-pink-300">λ halqa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#FF4444" }} />
              <span className="text-red-300">Sterik strain</span>
            </div>
          </div>
          <div className="text-center py-2 px-4 bg-purple-950/40 border-t border-purple-800/20 text-[11px] text-purple-400 italic">
            {currentComplex.formula} • {isomerKeys.length} konformatsion izomer • Corey-Bailar (1959), Berry (1960), Barton (Nobel 1969)
          </div>
        </div>
      )}

      {/* PDF MODAL */}
      {showPDFModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-950 to-indigo-950 rounded-2xl border border-purple-700/50 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-purple-800/50">
              <div>
                <h2 className="text-lg font-bold text-green-400">📄 Ilmiy Hisobot — PDF eksport</h2>
                <p className="text-purple-400 text-xs">Transformatsion izomeriya: {currentComplex.formula}</p>
              </div>
              <button onClick={() => setShowPDFModal(false)} className="text-purple-400 hover:text-purple-200 text-2xl leading-none">×</button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <button onClick={() => setPdfSections({
                  intro: true, theory: true, coreyBailar: true, ringEnergy: true, ramachandran: false,
                  berry: true, vanderwaals: false, nmr: false, edta: false, table: true, references: true
                })} className="flex-1 px-3 py-1.5 rounded text-xs bg-purple-800/40 text-purple-200 border border-purple-700/50 hover:bg-purple-700/40">Standart</button>
                <button onClick={() => setPdfSections({
                  intro: true, theory: true, coreyBailar: true, ringEnergy: true, ramachandran: true,
                  berry: true, vanderwaals: true, nmr: true, edta: true, table: true, references: true
                })} className="flex-1 px-3 py-1.5 rounded text-xs bg-gradient-to-r from-purple-700 to-pink-700 text-white font-semibold">To'liq (ilmiy)</button>
                <button onClick={() => setPdfSections({
                  intro: false, theory: false, coreyBailar: false, ringEnergy: false, ramachandran: false,
                  berry: false, vanderwaals: false, nmr: false, edta: false, table: false, references: false
                })} className="flex-1 px-3 py-1.5 rounded text-xs bg-red-900/30 text-red-300 border border-red-700/40 hover:bg-red-800/40">Tozalash</button>
              </div>

              <div className="text-xs text-purple-300 uppercase font-bold pt-2">Bo'limlarni tanlang:</div>
              {[
                { k: "intro", l: "1. 📖 Kirish — transformatsion izomeriya nima?" },
                { k: "theory", l: "2. ⚗️ Barton nazariyasi (Nobel 1969)" },
                { k: "coreyBailar", l: "3. 📐 Corey-Bailar konformatsiyalari (1959)" },
                { k: "ringEnergy", l: "4. 💫 Xelat halqa energetikasi" },
                { k: "ramachandran", l: "5. 🗺️ Ramachandran-tipli tahlil" },
                { k: "berry", l: "6. 🌀 Berry pseudorotation (1960)" },
                { k: "vanderwaals", l: "7. 🔴 Van der Waals ta'siri" },
                { k: "nmr", l: "8. 🔊 Dinamik NMR (Wüthrich, Nobel 2002)" },
                { k: "edta", l: "9. 💊 EDTA konformatsion boyligi" },
                { k: "table", l: "10. 📋 Solishtirish jadvali" },
                { k: "references", l: "11. 📚 Foydalanilgan adabiyotlar (13 manba)" }
              ].map(it => (
                <label key={it.k} className="flex items-center gap-2 text-sm text-purple-200 cursor-pointer hover:bg-purple-900/30 p-1.5 rounded">
                  <input type="checkbox" checked={pdfSections[it.k] || false}
                    onChange={(e) => setPdfSections(s => ({ ...s, [it.k]: e.target.checked }))}
                    className="accent-green-500" />
                  <span>{it.l}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 p-4 border-t border-purple-800/50">
              <button onClick={() => setShowPDFModal(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm bg-purple-900/40 text-purple-300 hover:bg-purple-800/40">Bekor qilish</button>
              <button onClick={generatePDF} disabled={pdfGenerating}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {pdfGenerating ? "⏳ Yaratilmoqda..." : "📄 Yuklab olish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CITATION MODAL */}
      {showCitationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-950 to-indigo-950 rounded-2xl border border-purple-700/50 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-purple-800/50">
              <h2 className="text-lg font-bold text-green-400">📚 Iqtibos olish</h2>
              <button onClick={() => setShowCitationModal(false)} className="text-purple-400 hover:text-purple-200 text-2xl leading-none">×</button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2 flex-wrap">
                {["APA", "MLA", "Chicago", "BibTeX"].map(fmt => (
                  <button key={fmt} onClick={() => setCitationFormat(fmt)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold ${citationFormat === fmt ? "bg-green-500/30 text-green-200 border border-green-500/50" : "bg-purple-900/40 text-purple-300 border border-purple-700/40"}`}>
                    {fmt}
                  </button>
                ))}
              </div>
              <textarea readOnly value={generateCitation()}
                className="w-full h-32 p-3 bg-purple-900/30 border border-purple-700/40 rounded text-xs text-purple-200 font-mono resize-none" />
              <button onClick={() => copyToClipboard(generateCitation())}
                className="w-full px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500">
                📋 Nusxa olish
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
