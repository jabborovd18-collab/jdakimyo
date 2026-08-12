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
  Co: 0xF090A0, Pt: 0xD0D0E0, Pd: 0x006985, Ni: 0x50D050,
  Fe: 0xE06633, Cr: 0x8A99C7, Cu: 0xC88033,
  N: 0x3050F8, C: 0x909090, H: 0xFFFFFF, O: 0xFF0D0D,
  Cl: 0x1FF01F, Br: 0xA62929, I: 0x940094, F: 0x90E050,
  S: 0xFFFF30, P: 0xFF8000,
  bond: 0x8B9DC3, hbond: 0x66CCFF,
  cis:    0xFFD700,   // cis — oltin
  trans:  0x66CCFF,   // trans — moviy
  fac:    0xFF6EC7,   // fac — pushti (magenta)
  mer:    0x50E3A4,   // mer — mint yashil
  dipole: 0xFFAA00,   // dipol vektori — to'q sariq
  sigma:  0xFFD700    // σ tekislik — oltin (yorug'lik)
}

// ═══════════════════════════════════════════════════════════════════════════
// O'RINBOSAR (POZITSION) IZOMERLAR DATABASE
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  CoNH3Cl2_oct: {
    id: "CoNH3Cl2_oct",
    formula: "[Co(NH₃)₄Cl₂]⁺",
    fullSalt: "[Co(NH₃)₄Cl₂]Cl",
    name: "Tetraamminodixloridokobalt(III) xlorid",
    isomerType: "cis-trans",  // MA₄B₂ oktaedrik
    geometry: "Oktaedrik",
    coordinationNumber: 6,
    hybridization: "d²sp³",
    center: { element: "Co", color: CPK.Co, radius: 0.42, charge: "+3" },
    ligandA: { type: "NH₃", donor: "N", donorColor: CPK.N, donorRadius: 0.26, count: 4 },
    ligandB: { type: "Cl⁻", color: CPK.Cl, radius: 0.30, count: 2 },
    bondLength: 1.98,
    bondLengthReal: "Co–N: 1.97 Å, Co–Cl: 2.27 Å",
    magnetism: "Diamagnit (LS d⁶)",
    dOrbital: { tg: 6, eg: 0, type: "LS", deltaO: 22800 },
    isomers: {
      cis: {
        label: "cis",
        color: "Violet-siyoh (Praseo salt tarixiy nomi)",
        symmetry: "C₂ᵥ",
        pointGroup: "C₂ᵥ",
        dipole: 4.5,           // Debye (taxminiy)
        sigmaCount: 2,          // σᵥ tekisliklar
        stability: "Termodinamik jihatdan biroz kam barqaror",
        cotransSeparation: "Kurnakov sinovi (thiourea) — cis reaksiyaga tez kirishadi",
        historicalName: "Violeo (yorqin violet)",
        lambdaMax: 542,         // nm
        color_hex: "#8B5CF6"
      },
      trans: {
        label: "trans",
        color: "Yashil (Prussio salt tarixiy nomi)",
        symmetry: "D₄ₕ",
        pointGroup: "D₄ₕ",
        dipole: 0,              // Simmetriya bekor qiladi
        sigmaCount: 5,          // σh + 4 σᵥ
        stability: "Termodinamik jihatdan biroz barqaror",
        cotransSeparation: "Kurnakov sinovi — trans juda sekin reaksiyaga kirishadi",
        historicalName: "Praseo (yashil)",
        lambdaMax: 620,         // nm
        color_hex: "#22C55E"
      }
    },
    scientificNotes: "Werner 1893-yilda [Co(NH₃)₄Cl₂]Cl uchun cis va trans izomerlarni birinchi marta koordinatsion nazariya asosida oldindan aytdi. Bu Jorgensen (zanjir nazariyasi) bilan bahsning hal qiluvchi tajribasi bo'ldi.",
    discoveryYear: 1893,
    discoverer: "Alfred Werner"
  },
  PtNH3Cl2_sq: {
    id: "PtNH3Cl2_sq",
    formula: "[Pt(NH₃)₂Cl₂]",
    fullSalt: "cis-diamminodixloridoplatina(II) — Cisplatin",
    name: "Diamminodixloridoplatina(II)",
    isomerType: "cis-trans",  // MA₂B₂ kvadrat planar
    geometry: "Kvadrat planar",
    coordinationNumber: 4,
    hybridization: "dsp² (Pt d⁸)",
    center: { element: "Pt", color: CPK.Pt, radius: 0.44, charge: "+2" },
    ligandA: { type: "NH₃", donor: "N", donorColor: CPK.N, donorRadius: 0.26, count: 2 },
    ligandB: { type: "Cl⁻", color: CPK.Cl, radius: 0.30, count: 2 },
    bondLength: 2.05,
    bondLengthReal: "Pt–N: 2.05 Å, Pt–Cl: 2.33 Å",
    magnetism: "Diamagnit (LS d⁸)",
    dOrbital: { tg: 8, eg: 0, type: "d⁸ LS", deltaO: 33500 },
    isomers: {
      cis: {
        label: "cis",
        color: "Sariq-jigarrang kristall (Cisplatin — TIBBIY DORI)",
        symmetry: "C₂ᵥ",
        pointGroup: "C₂ᵥ",
        dipole: 8.7,            // Katta dipol — polyar
        sigmaCount: 2,
        stability: "Kinetik jihatdan Cl labil (H₂O bilan almashinadi — DNK bilan bog'lanadi)",
        cotransSeparation: "Suvda erish tezligi, rangi, tibbiy faollik",
        historicalName: "Peyrone tuzi (1844)",
        lambdaMax: 375,
        color_hex: "#EAB308",
        medicalUse: "1978-yil FDA tomonidan onkologik dori sifatida ro'yxatga olingan — tuxumdon, moyak, ko'krak raki"
      },
      trans: {
        label: "trans",
        color: "Och sariq kristall — TERAPEVTIK EMAS",
        symmetry: "D₂ₕ",
        pointGroup: "D₂ₕ",
        dipole: 0,              // Trans — apolyar
        sigmaCount: 3,
        stability: "Kinetik jihatdan Cl inert — DNK bilan bog'lanmaydi",
        cotransSeparation: "Suvda kam eriydi, tibbiy faollik yo'q",
        historicalName: "Reyzet tuzi",
        lambdaMax: 330,
        color_hex: "#FDE68A",
        medicalUse: "Antitumor faollik YO'Q — bu enantiomer/pozitsion farqning eng dramatik biologik namunasi"
      }
    },
    scientificNotes: "Barnett Rosenberg (1965) tasodifan cis-[Pt(NH₃)₂Cl₂] ning bakteriyalar bo'linishini to'xtatishini kashf qildi. Bu — koordinatsion tibbiyot davrini boshlab bergan tarixiy voqea. Trans-izomer esa bir xil formula bo'lishiga qaramay teratogen ham emas, davo ham emas — bu pozitsion izomeriya biologik ahamiyatining eng kuchli namunasi.",
    discoveryYear: 1965,
    discoverer: "Barnett Rosenberg"
  },
  CoNH3Cl3_facmer: {
    id: "CoNH3Cl3_facmer",
    formula: "[Co(NH₃)₃Cl₃]",
    fullSalt: "Triamminotrixloridokobalt(III)",
    name: "Triamminotrixloridokobalt(III)",
    isomerType: "fac-mer",  // MA₃B₃ oktaedrik
    geometry: "Oktaedrik",
    coordinationNumber: 6,
    hybridization: "d²sp³",
    center: { element: "Co", color: CPK.Co, radius: 0.42, charge: "0" },
    ligandA: { type: "NH₃", donor: "N", donorColor: CPK.N, donorRadius: 0.26, count: 3 },
    ligandB: { type: "Cl⁻", color: CPK.Cl, radius: 0.30, count: 3 },
    bondLength: 1.98,
    bondLengthReal: "Co–N: 1.98 Å, Co–Cl: 2.28 Å",
    magnetism: "Diamagnit (LS d⁶)",
    dOrbital: { tg: 6, eg: 0, type: "LS", deltaO: 22400 },
    isomers: {
      fac: {
        label: "fac",  // facial — yuz
        color: "Yashil-sariq kristall",
        symmetry: "C₃ᵥ",
        pointGroup: "C₃ᵥ",
        dipole: 5.2,            // C₃ o'q bo'ylab
        sigmaCount: 3,          // 3 σᵥ
        stability: "Oktaedrning bir uch burchakli yuzida 3 ta bir xil ligand",
        cotransSeparation: "Yorqin C₃ o'qi mavjud — dipol katta",
        historicalName: "facial (yuz)",
        lambdaMax: 530,
        color_hex: "#EC4899",
        description: "3 ta NH₃ oktaedrning bir uch burchakli yuzida (facia)"
      },
      mer: {
        label: "mer",  // meridional — meridian
        color: "To'q yashil kristall",
        symmetry: "C₂ᵥ",
        pointGroup: "C₂ᵥ",
        dipole: 3.8,            // Kichikroq dipol
        sigmaCount: 2,          // 2 σᵥ
        stability: "Oktaedrning meridianida 3 ta bir xil ligand",
        cotransSeparation: "Meridianda joylashish — dipol nisbatan kichik",
        historicalName: "meridional (meridian)",
        lambdaMax: 545,
        color_hex: "#10B981",
        description: "3 ta NH₃ oktaedrning meridianida (T-shakli) joylashadi"
      }
    },
    scientificNotes: "MA₃B₃ tipidagi oktaedrik komplekslarda ikki xil geometrik izomer mumkin: fac (facial) — 3 ta bir xil ligand oktaedrning bir uch burchakli yuzida to'planadi; mer (meridional) — 3 ta ligand oktaedrning meridianida (bir tekislikda) joylashadi. Bu farq katalitik faollik va spektroskopik xossalarga sezilarli ta'sir qiladi.",
    discoveryYear: 1911,
    discoverer: "Alfred Werner"
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁷ 4s²", oxidation: "+3", role: "Markaziy ion (oktaedrik)", color: "#F090A0" },
  Pt: { name: "Platina (Pt)", atomic: 78, mass: "195.08 u", config: "[Xe] 4f¹⁴ 5d⁹ 6s¹", oxidation: "+2", role: "Markaziy ion (kvadrat planar)", color: "#D0D0E0" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "NH₃ donor atomi", hybridization: "sp³", color: "#3050F8" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "NH₃ tarkibi", color: "#FFFFFF" },
  Cl: { name: "Xlor (Cl⁻)", atomic: 17, mass: "35.45 u", config: "[Ne] 3s² 3p⁶", charge: "-1", role: "Anionik ligand", color: "#1FF01F" }
}

// ═══════════════════════════════════════════════════════════════════════════
// TARIXIY VOQEALAR (Werner, Jorgensen, Chernyaev, Rosenberg)
// ═══════════════════════════════════════════════════════════════════════════
const HISTORY = [
  {
    year: 1844, hero: "Michele Peyrone",
    title: "cis-[Pt(NH₃)₂Cl₂] birinchi sintezi",
    text: "Italyan kimyogari Peyrone Parij laboratoriyasida platinaxlorid va ammiakdan sariq kristallar oldi — keyinchalik u \"Peyrone tuzi\" deb ataldi. 121 yildan keyin bu birikma rak dorisi bo'lib chiqishini u umuman bilmasdi."
  },
  {
    year: 1893, hero: "Alfred Werner (25 yosh)",
    title: "Koordinatsion nazariya — cis/trans bashorati",
    text: "Werner 25 yoshida Zurichda tush ko'rib uyg'onib, tunda koordinatsion nazariyani yozdi. U [Co(NH₃)₄Cl₂]⁺ uchun aynan 2 ta izomer (cis va trans) mavjud bo'lishi kerakligini bashorat qildi. Jorgensen esa boshqa nazariya (zanjir modeli) tarafdori edi."
  },
  {
    year: 1893, hero: "Sophus Mads Jorgensen",
    title: "Zanjir (Kette) nazariyasi — raqib",
    text: "Daniyalik kimyogar Jorgensen ammiaklarni –NH₃–NH₃– zanjir shaklida bog'langan deb hisoblardi. Uning nazariyasiga ko'ra [Co(NH₃)₄Cl₂]⁺ da faqat bitta izomer bo'lishi kerak edi. Werner bilan 20 yillik ilmiy bahs boshlandi."
  },
  {
    year: 1907, hero: "Werner (eksperimental g'alaba)",
    title: "cis-violeo va trans-praseo ajratish",
    text: "Werner o'zining shogirdlari bilan [Co(NH₃)₄Cl₂]Cl ning ikkala izomerini alohida ajratdi: violet-siyoh (cis) va yashil (trans). Bu rang farqi Jorgensen'ning nazariyasini butunlay yo'qqa chiqardi."
  },
  {
    year: 1913, hero: "Werner (Nobel mukofoti)",
    title: "Kimyo bo'yicha Nobel mukofoti",
    text: "Werner \"koordinatsion nazariya va atomlarning molekulada joylashuvi\" bo'yicha ishlar uchun Nobel mukofotini oldi. Jorgensen esa 1908-yilda vafot etgan edi, lekin Werner uning ishlariga hurmat bilan yondoshdi."
  },
  {
    year: 1926, hero: "Iliya Iliich Chernyaev",
    title: "Trans effekti kashfiyoti (rus maktabi)",
    text: "Moskvada Chernyaev [Pt(II)] komplekslarida ba'zi ligandlar o'zlariga trans holatda turgan ligandning almashinishini tezlashtirishini kashf qildi. Bu — Trans effekt qonuni. Ligandlar trans-ta'sir kuchi bo'yicha tartiblangan: CN⁻ > CO > NO > H⁻ > CH₃⁻ > SC(NH₂)₂ > I⁻ > Br⁻ > Cl⁻ > NH₃ > OH⁻ > H₂O. Bu rus koordinatsion kimyo maktabining eng katta hissasi."
  },
  {
    year: 1965, hero: "Barnett Rosenberg",
    title: "Cisplatin — tibbiy tasodifiy kashfiyot",
    text: "Michigan universitetida Rosenberg elektr maydonining bakteriyalar bo'linishiga ta'sirini o'rgansahri. U platina elektrodlar ishlatgan va tasodifan cis-[Pt(NH₃)₂Cl₂] hosil bo'ldi — bu birikma bakteriyalar bo'linishini butunlay to'xtatdi. Rosenberg keyinchalik uning rak hujayralarini o'ldirishini isbotladi. Bu koordinatsion tibbiyotning boshlanishi bo'ldi."
  },
  {
    year: 1978, hero: "FDA (AQSh)",
    title: "Cisplatin — rasmiy ro'yxatga olinishi",
    text: "AQSh Oziq-ovqat va Dori-darmon boshqarmasi cis-[Pt(NH₃)₂Cl₂] (Platinol) ni tuxumdon va moyak raki uchun rasmiy dori sifatida tasdiqladi. Bugungi kunda cisplatin va uning avlodlari (karboplatin, oksaliplatin) o'nlab million bemorlarning hayotini saqlab qolgan."
  },
  {
    year: 1969, hero: "L. A. Kurnakov (rus maktabi)",
    title: "Kurnakov sinovi (thiourea test)",
    text: "cis va trans izomerlarni farqlash uchun thiourea (SC(NH₂)₂) bilan sinov usuli ishlab chiqilgan. cis-izomerda ikkala Cl ham qo'shni pozitsiyada bo'lgani uchun tez almashinadi; trans-izomerda esa Cl lar bir-biriga qarama-qarshi, thiourea faqat bittasini almashtira oladi. Sinov 30 daqiqada natija beradi."
  },
  {
    year: 2005, hero: "IUPAC Red Book",
    title: "Rasmiy nomenklatura (cis, trans, fac, mer)",
    text: "IUPAC koordinatsion birikmalar uchun rasmiy tavsiya nashr etdi: cis (qo'shni pozitsiya, burchak ~90°), trans (qarama-qarshi, ~180°), fac (facial — uch burchakli yuzda), mer (meridional — meridianda)."
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// TRANS EFFEKTI QATORI (Chernyaev, 1926)
// ═══════════════════════════════════════════════════════════════════════════
const TRANS_EFFECT = [
  { ligand: "CN⁻", strength: 10, color: "#DC2626" },
  { ligand: "CO", strength: 10, color: "#DC2626" },
  { ligand: "C₂H₄", strength: 9, color: "#EA580C" },
  { ligand: "NO", strength: 9, color: "#EA580C" },
  { ligand: "H⁻", strength: 8, color: "#F59E0B" },
  { ligand: "CH₃⁻", strength: 8, color: "#F59E0B" },
  { ligand: "SC(NH₂)₂", strength: 7, color: "#EAB308" },
  { ligand: "I⁻", strength: 6, color: "#84CC16" },
  { ligand: "Br⁻", strength: 5, color: "#22C55E" },
  { ligand: "Cl⁻", strength: 4, color: "#10B981" },
  { ligand: "NH₃", strength: 2, color: "#06B6D4" },
  { ligand: "OH⁻", strength: 1, color: "#3B82F6" },
  { ligand: "H₂O", strength: 1, color: "#6366F1" }
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

function makeTextSprite(text, options = {}) {
  const {
    fontSize = 64, fontFamily = "Arial, sans-serif",
    color = "#ffffff", bgColor = "rgba(20, 10, 40, 0.85)",
    borderColor = "#a78bfa", padding = 16, scale = 0.5
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
  ctx.moveTo(r, 0)
  ctx.lineTo(canvas.width - r, 0)
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r)
  ctx.lineTo(canvas.width, canvas.height - r)
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height)
  ctx.lineTo(r, canvas.height)
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({
    map: texture, transparent: true,
    depthTest: false, depthWrite: false
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(canvas.width / fontSize * scale, canvas.height / fontSize * scale, 1)
  sprite.renderOrder = 999
  return sprite
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
  if (emissive !== null) {
    matOpts.emissive = emissive
    matOpts.emissiveIntensity = emissiveIntensity
  }
  const mat = new THREE.MeshStandardMaterial(matOpts)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.copy(pos)
  group.add(mesh)
  return mesh
}

function addGlow(group, pos, color, size = 0.5) {
  const geo = new THREE.SphereGeometry(size, 32, 32)
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12 })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.copy(pos)
  group.add(mesh)
  return mesh
}

// ═══════════════════════════════════════════════════════════════════════════
// OKTAEDRIK cis-[Co(NH₃)₄Cl₂]⁺ QURUVCHISI
// ═══════════════════════════════════════════════════════════════════════════
function buildOctahedralCisMA4B2(scene, centerPos, complex, opts = {}) {
  const { scale = 1, showDipole = false, showSigma = false, groupRef = null } = opts
  const group = new THREE.Group()
  const dist = 1.35 * scale

  // Markaziy atom
  addAtomSphere(group, new THREE.Vector3(0, 0, 0), complex.center.color, complex.center.radius * scale, {
    roughness: 0.3, metalness: 0.7, emissive: complex.center.color, emissiveIntensity: 0.15
  })
  addGlow(group, new THREE.Vector3(0, 0, 0), complex.center.color, 0.55 * scale)

  // 2 ta Cl (cis — qo'shni pozitsiya: +x va +y)
  const clPos = [
    new THREE.Vector3(+dist, 0, 0),
    new THREE.Vector3(0, +dist, 0)
  ]
  clPos.forEach(pos => {
    addAtomSphere(group, pos, complex.ligandB.color, complex.ligandB.radius * scale)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x448844, 0.04 * scale)
  })

  // 4 ta NH₃ (donor N atomi) — qolgan 4 pozitsiya: -x, -y, +z, -z
  const nPos = [
    new THREE.Vector3(-dist, 0, 0),
    new THREE.Vector3(0, -dist, 0),
    new THREE.Vector3(0, 0, +dist),
    new THREE.Vector3(0, 0, -dist)
  ]
  nPos.forEach(pos => {
    addAtomSphere(group, pos, complex.ligandA.donorColor, complex.ligandA.donorRadius * scale)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x444488, 0.04 * scale)

    // 3 ta H atomi (kichik, NH₃ ni ko'rsatish uchun)
    const dir = pos.clone().normalize()
    const perp1 = new THREE.Vector3(dir.y, -dir.x, 0).normalize()
    if (perp1.length() < 0.1) perp1.set(1, 0, 0)
    const perp2 = new THREE.Vector3().crossVectors(dir, perp1).normalize()
    for (let h = 0; h < 3; h++) {
      const angle = (h * 2 * Math.PI) / 3
      const hPos = pos.clone().add(dir.clone().multiplyScalar(0.4 * scale))
        .add(perp1.clone().multiplyScalar(0.25 * scale * Math.cos(angle)))
        .add(perp2.clone().multiplyScalar(0.25 * scale * Math.sin(angle)))
      addAtomSphere(group, hPos, 0xFFFFFF, 0.08 * scale)
      addBondToGroup(group, pos, hPos, 0x888888, 0.02 * scale, 0.4)
    }
  })

  // Dipol vektori (cis — kuchli, +x+y burchak bissektrisasi bo'ylab)
  if (showDipole) {
    const dipoleEnd = new THREE.Vector3(1.8, 1.8, 0).multiplyScalar(scale)
    const dipGeo = new THREE.CylinderGeometry(0.03 * scale, 0.03 * scale, dipoleEnd.length(), 12)
    const dipMat = new THREE.MeshBasicMaterial({ color: CPK.dipole, transparent: true, opacity: 0.8 })
    const dipMesh = new THREE.Mesh(dipGeo, dipMat)
    dipMesh.position.copy(dipoleEnd.clone().multiplyScalar(0.5))
    dipMesh.setRotationFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dipoleEnd.clone().normalize())
    )
    group.add(dipMesh)
    // Uchi (o'q)
    const arrowGeo = new THREE.ConeGeometry(0.09 * scale, 0.25 * scale, 12)
    const arrowMesh = new THREE.Mesh(arrowGeo, dipMat)
    arrowMesh.position.copy(dipoleEnd)
    arrowMesh.setRotationFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dipoleEnd.clone().normalize())
    )
    group.add(arrowMesh)
  }

  // σᵥ tekisliklar (2 ta — cis uchun)
  if (showSigma) {
    // 1) Cl-Cl bissektrisasi bo'ylab (xy tekislik, z o'q bo'ylab)
    const p1Geo = new THREE.PlaneGeometry(3.5 * scale, 3.5 * scale)
    const p1Mat = new THREE.MeshBasicMaterial({
      color: CPK.sigma, transparent: true, opacity: 0.12, side: THREE.DoubleSide
    })
    const p1 = new THREE.Mesh(p1Geo, p1Mat)
    p1.rotation.z = Math.PI / 4  // Cl-Cl bissektrisa
    group.add(p1)
    // 2) Cl-Cl to'g'ridan-to'g'ri tekislik (xz)
    const p2 = new THREE.Mesh(p1Geo, p1Mat.clone())
    p2.rotation.x = Math.PI / 2
    p2.rotation.y = Math.PI / 4
    group.add(p2)
  }

  group.position.copy(centerPos)
  scene.add(group)
  if (groupRef) groupRef.current = group
  return { group }
}

// ═══════════════════════════════════════════════════════════════════════════
// OKTAEDRIK trans-[Co(NH₃)₄Cl₂]⁺ QURUVCHISI
// ═══════════════════════════════════════════════════════════════════════════
function buildOctahedralTransMA4B2(scene, centerPos, complex, opts = {}) {
  const { scale = 1, showDipole = false, showSigma = false, groupRef = null } = opts
  const group = new THREE.Group()
  const dist = 1.35 * scale

  addAtomSphere(group, new THREE.Vector3(0, 0, 0), complex.center.color, complex.center.radius * scale, {
    roughness: 0.3, metalness: 0.7, emissive: complex.center.color, emissiveIntensity: 0.15
  })
  addGlow(group, new THREE.Vector3(0, 0, 0), complex.center.color, 0.55 * scale)

  // 2 ta Cl (trans — qarama-qarshi: +y va -y)
  const clPos = [
    new THREE.Vector3(0, +dist, 0),
    new THREE.Vector3(0, -dist, 0)
  ]
  clPos.forEach(pos => {
    addAtomSphere(group, pos, complex.ligandB.color, complex.ligandB.radius * scale)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x448844, 0.04 * scale)
  })

  // 4 ta NH₃ (ekvatorial tekislikda: +x, -x, +z, -z)
  const nPos = [
    new THREE.Vector3(+dist, 0, 0),
    new THREE.Vector3(-dist, 0, 0),
    new THREE.Vector3(0, 0, +dist),
    new THREE.Vector3(0, 0, -dist)
  ]
  nPos.forEach(pos => {
    addAtomSphere(group, pos, complex.ligandA.donorColor, complex.ligandA.donorRadius * scale)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x444488, 0.04 * scale)
    // 3 ta H
    const dir = pos.clone().normalize()
    const perp1 = new THREE.Vector3(dir.y, -dir.x, 0).normalize()
    if (perp1.length() < 0.1) perp1.set(1, 0, 0)
    const perp2 = new THREE.Vector3().crossVectors(dir, perp1).normalize()
    for (let h = 0; h < 3; h++) {
      const angle = (h * 2 * Math.PI) / 3
      const hPos = pos.clone().add(dir.clone().multiplyScalar(0.4 * scale))
        .add(perp1.clone().multiplyScalar(0.25 * scale * Math.cos(angle)))
        .add(perp2.clone().multiplyScalar(0.25 * scale * Math.sin(angle)))
      addAtomSphere(group, hPos, 0xFFFFFF, 0.08 * scale)
      addBondToGroup(group, pos, hPos, 0x888888, 0.02 * scale, 0.4)
    }
  })

  // trans — dipol = 0 (simmetriya bekor qiladi)
  // showDipole yoqilgan bo'lsa ham — kichik "0" belgisi qo'yamiz
  if (showDipole) {
    // Aslida hech qanday dipol yo'q — vizual belgi
  }

  // σh tekislik (ekvatorial, xz) + 4 σᵥ
  if (showSigma) {
    // σh — ekvatorial (Cl lar bilan perpendikulyar)
    const phGeo = new THREE.PlaneGeometry(3.5 * scale, 3.5 * scale)
    const phMat = new THREE.MeshBasicMaterial({
      color: CPK.sigma, transparent: true, opacity: 0.18, side: THREE.DoubleSide
    })
    const ph = new THREE.Mesh(phGeo, phMat)
    ph.rotation.x = Math.PI / 2
    group.add(ph)
    // 2 ta σᵥ (yuqori Cl orqali)
    for (let k = 0; k < 2; k++) {
      const pv = new THREE.Mesh(phGeo, phMat.clone())
      pv.material.opacity = 0.1
      pv.rotation.y = (k * Math.PI) / 2
      group.add(pv)
    }
  }

  group.position.copy(centerPos)
  scene.add(group)
  if (groupRef) groupRef.current = group
  return { group }
}

// ═══════════════════════════════════════════════════════════════════════════
// KVADRAT PLANAR cis-[Pt(NH₃)₂Cl₂] (Cisplatin)
// ═══════════════════════════════════════════════════════════════════════════
function buildSquarePlanarCis(scene, centerPos, complex, opts = {}) {
  const { scale = 1, showDipole = false, showSigma = false, groupRef = null } = opts
  const group = new THREE.Group()
  const dist = 1.5 * scale

  addAtomSphere(group, new THREE.Vector3(0, 0, 0), complex.center.color, complex.center.radius * scale, {
    roughness: 0.3, metalness: 0.7, emissive: complex.center.color, emissiveIntensity: 0.15
  })
  addGlow(group, new THREE.Vector3(0, 0, 0), complex.center.color, 0.55 * scale)

  // Kvadrat planar: 4 ta pozitsiya xz tekislikda
  // cis: 2 ta Cl qo'shni (+x, +z), 2 ta N qarama-qarshi (-x, -z)
  addAtomSphere(group, new THREE.Vector3(+dist, 0, 0), complex.ligandB.color, complex.ligandB.radius * scale)
  addAtomSphere(group, new THREE.Vector3(0, 0, +dist), complex.ligandB.color, complex.ligandB.radius * scale)
  addBondToGroup(group, new THREE.Vector3(0, 0, 0), new THREE.Vector3(+dist, 0, 0), 0x448844, 0.05 * scale)
  addBondToGroup(group, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, +dist), 0x448844, 0.05 * scale)

  // 2 ta NH₃
  const nPos = [
    new THREE.Vector3(-dist, 0, 0),
    new THREE.Vector3(0, 0, -dist)
  ]
  nPos.forEach(pos => {
    addAtomSphere(group, pos, complex.ligandA.donorColor, complex.ligandA.donorRadius * scale)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x444488, 0.05 * scale)
    // 3 ta H
    const dir = pos.clone().normalize()
    const perp1 = new THREE.Vector3(0, 1, 0)
    const perp2 = new THREE.Vector3().crossVectors(dir, perp1).normalize()
    for (let h = 0; h < 3; h++) {
      const angle = (h * 2 * Math.PI) / 3
      const hPos = pos.clone().add(dir.clone().multiplyScalar(0.4 * scale))
        .add(perp1.clone().multiplyScalar(0.25 * scale * Math.cos(angle)))
        .add(perp2.clone().multiplyScalar(0.25 * scale * Math.sin(angle)))
      addAtomSphere(group, hPos, 0xFFFFFF, 0.08 * scale)
      addBondToGroup(group, pos, hPos, 0x888888, 0.02 * scale, 0.4)
    }
  })

  // Dipol vektori (Cl-Cl bissektrisasi bo'ylab, ya'ni x+z yo'nalishi)
  if (showDipole) {
    const dipoleEnd = new THREE.Vector3(1.8, 0, 1.8).multiplyScalar(scale)
    const dipGeo = new THREE.CylinderGeometry(0.035 * scale, 0.035 * scale, dipoleEnd.length(), 12)
    const dipMat = new THREE.MeshBasicMaterial({ color: CPK.dipole, transparent: true, opacity: 0.85 })
    const dipMesh = new THREE.Mesh(dipGeo, dipMat)
    dipMesh.position.copy(dipoleEnd.clone().multiplyScalar(0.5))
    dipMesh.setRotationFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dipoleEnd.clone().normalize())
    )
    group.add(dipMesh)
    const arrowGeo = new THREE.ConeGeometry(0.1 * scale, 0.28 * scale, 12)
    const arrowMesh = new THREE.Mesh(arrowGeo, dipMat)
    arrowMesh.position.copy(dipoleEnd)
    arrowMesh.setRotationFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dipoleEnd.clone().normalize())
    )
    group.add(arrowMesh)
  }

  // C₂ o'qi (Cl-Cl bissektrisa bo'ylab, y o'qi)
  if (showSigma) {
    // σᵥ: xz tekislik (kvadratning o'zi)
    const p1Geo = new THREE.PlaneGeometry(3.8 * scale, 3.8 * scale)
    const p1Mat = new THREE.MeshBasicMaterial({
      color: CPK.sigma, transparent: true, opacity: 0.15, side: THREE.DoubleSide
    })
    const p1 = new THREE.Mesh(p1Geo, p1Mat)
    p1.rotation.x = Math.PI / 2
    group.add(p1)
    // σᵥ Cl-Cl bissektrisa
    const p2 = new THREE.Mesh(p1Geo, p1Mat.clone())
    p2.rotation.y = Math.PI / 4
    group.add(p2)
  }

  group.position.copy(centerPos)
  scene.add(group)
  if (groupRef) groupRef.current = group
  return { group }
}

// ═══════════════════════════════════════════════════════════════════════════
// KVADRAT PLANAR trans-[Pt(NH₃)₂Cl₂]
// ═══════════════════════════════════════════════════════════════════════════
function buildSquarePlanarTrans(scene, centerPos, complex, opts = {}) {
  const { scale = 1, showDipole = false, showSigma = false, groupRef = null } = opts
  const group = new THREE.Group()
  const dist = 1.5 * scale

  addAtomSphere(group, new THREE.Vector3(0, 0, 0), complex.center.color, complex.center.radius * scale, {
    roughness: 0.3, metalness: 0.7, emissive: complex.center.color, emissiveIntensity: 0.15
  })
  addGlow(group, new THREE.Vector3(0, 0, 0), complex.center.color, 0.55 * scale)

  // trans: 2 ta Cl qarama-qarshi (+x, -x), 2 ta N qarama-qarshi (+z, -z)
  ;[new THREE.Vector3(+dist, 0, 0), new THREE.Vector3(-dist, 0, 0)].forEach(pos => {
    addAtomSphere(group, pos, complex.ligandB.color, complex.ligandB.radius * scale)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x448844, 0.05 * scale)
  })

  ;[new THREE.Vector3(0, 0, +dist), new THREE.Vector3(0, 0, -dist)].forEach(pos => {
    addAtomSphere(group, pos, complex.ligandA.donorColor, complex.ligandA.donorRadius * scale)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x444488, 0.05 * scale)
    const dir = pos.clone().normalize()
    const perp1 = new THREE.Vector3(0, 1, 0)
    const perp2 = new THREE.Vector3().crossVectors(dir, perp1).normalize()
    for (let h = 0; h < 3; h++) {
      const angle = (h * 2 * Math.PI) / 3
      const hPos = pos.clone().add(dir.clone().multiplyScalar(0.4 * scale))
        .add(perp1.clone().multiplyScalar(0.25 * scale * Math.cos(angle)))
        .add(perp2.clone().multiplyScalar(0.25 * scale * Math.sin(angle)))
      addAtomSphere(group, hPos, 0xFFFFFF, 0.08 * scale)
      addBondToGroup(group, pos, hPos, 0x888888, 0.02 * scale, 0.4)
    }
  })

  // trans — dipol = 0

  // σh (kvadrat tekislik) + σᵥ
  if (showSigma) {
    const p1Geo = new THREE.PlaneGeometry(3.8 * scale, 3.8 * scale)
    const p1Mat = new THREE.MeshBasicMaterial({
      color: CPK.sigma, transparent: true, opacity: 0.18, side: THREE.DoubleSide
    })
    const p1 = new THREE.Mesh(p1Geo, p1Mat)
    p1.rotation.x = Math.PI / 2  // σh — kvadrat tekislik
    group.add(p1)
    // σᵥ x va z bo'ylab
    const p2 = new THREE.Mesh(p1Geo, p1Mat.clone())
    p2.material.opacity = 0.12
    group.add(p2)
    const p3 = new THREE.Mesh(p1Geo, p1Mat.clone())
    p3.material.opacity = 0.12
    p3.rotation.y = Math.PI / 2
    group.add(p3)
  }

  group.position.copy(centerPos)
  scene.add(group)
  if (groupRef) groupRef.current = group
  return { group }
}

// ═══════════════════════════════════════════════════════════════════════════
// FAC-[Co(NH₃)₃Cl₃] — 3 ta bir xil ligand oktaedrning bir uch burchakli yuzida
// ═══════════════════════════════════════════════════════════════════════════
function buildFacMA3B3(scene, centerPos, complex, opts = {}) {
  const { scale = 1, showDipole = false, showSigma = false, groupRef = null } = opts
  const group = new THREE.Group()
  const dist = 1.35 * scale

  addAtomSphere(group, new THREE.Vector3(0, 0, 0), complex.center.color, complex.center.radius * scale, {
    roughness: 0.3, metalness: 0.7, emissive: complex.center.color, emissiveIntensity: 0.15
  })
  addGlow(group, new THREE.Vector3(0, 0, 0), complex.center.color, 0.55 * scale)

  // fac: 3 ta NH₃ oktaedrning bir yuzida (+x, +y, +z)
  // 3 ta Cl esa qarshi yuzda (-x, -y, -z)
  const nPos = [
    new THREE.Vector3(+dist, 0, 0),
    new THREE.Vector3(0, +dist, 0),
    new THREE.Vector3(0, 0, +dist)
  ]
  const clPos = [
    new THREE.Vector3(-dist, 0, 0),
    new THREE.Vector3(0, -dist, 0),
    new THREE.Vector3(0, 0, -dist)
  ]

  // 3 ta NH₃ (facial yuz)
  nPos.forEach(pos => {
    addAtomSphere(group, pos, complex.ligandA.donorColor, complex.ligandA.donorRadius * scale)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x444488, 0.04 * scale)
    const dir = pos.clone().normalize()
    const perp1 = new THREE.Vector3(dir.y, -dir.x, 0).normalize()
    if (perp1.length() < 0.1) perp1.set(1, 0, 0)
    const perp2 = new THREE.Vector3().crossVectors(dir, perp1).normalize()
    for (let h = 0; h < 3; h++) {
      const angle = (h * 2 * Math.PI) / 3
      const hPos = pos.clone().add(dir.clone().multiplyScalar(0.4 * scale))
        .add(perp1.clone().multiplyScalar(0.25 * scale * Math.cos(angle)))
        .add(perp2.clone().multiplyScalar(0.25 * scale * Math.sin(angle)))
      addAtomSphere(group, hPos, 0xFFFFFF, 0.08 * scale)
      addBondToGroup(group, pos, hPos, 0x888888, 0.02 * scale, 0.4)
    }
  })

  // 3 ta Cl
  clPos.forEach(pos => {
    addAtomSphere(group, pos, complex.ligandB.color, complex.ligandB.radius * scale)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x448844, 0.04 * scale)
  })

  // Facial yuzni ko'rsatish (uchburchak) — 3 ta NH₃ N atomi orqali
  const faceGeo = new THREE.BufferGeometry()
  const faceVerts = new Float32Array([
    nPos[0].x, nPos[0].y, nPos[0].z,
    nPos[1].x, nPos[1].y, nPos[1].z,
    nPos[2].x, nPos[2].y, nPos[2].z
  ])
  faceGeo.setAttribute('position', new THREE.BufferAttribute(faceVerts, 3))
  faceGeo.setIndex([0, 1, 2])
  faceGeo.computeVertexNormals()
  const faceMat = new THREE.MeshBasicMaterial({
    color: CPK.fac, transparent: true, opacity: 0.25, side: THREE.DoubleSide
  })
  group.add(new THREE.Mesh(faceGeo, faceMat))

  // C₃ o'qi (fac uchun — asosiy simmetriya o'qi (1,1,1) diagonal bo'ylab)
  if (showSigma) {
    const c3Dir = new THREE.Vector3(1, 1, 1).normalize()
    const c3Geo = new THREE.CylinderGeometry(0.012 * scale, 0.012 * scale, 4.5 * scale, 8)
    const c3Mat = new THREE.MeshBasicMaterial({ color: CPK.sigma, transparent: true, opacity: 0.6 })
    const c3 = new THREE.Mesh(c3Geo, c3Mat)
    c3.setRotationFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), c3Dir)
    )
    group.add(c3)
  }

  // Dipol (C₃ o'qi bo'ylab)
  if (showDipole) {
    const dipDir = new THREE.Vector3(1, 1, 1).normalize()
    const dipoleEnd = dipDir.clone().multiplyScalar(2.2 * scale)
    const dipGeo = new THREE.CylinderGeometry(0.03 * scale, 0.03 * scale, dipoleEnd.length(), 12)
    const dipMat = new THREE.MeshBasicMaterial({ color: CPK.dipole, transparent: true, opacity: 0.85 })
    const dipMesh = new THREE.Mesh(dipGeo, dipMat)
    dipMesh.position.copy(dipoleEnd.clone().multiplyScalar(0.5))
    dipMesh.setRotationFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dipDir)
    )
    group.add(dipMesh)
    const arrowGeo = new THREE.ConeGeometry(0.1 * scale, 0.28 * scale, 12)
    const arrowMesh = new THREE.Mesh(arrowGeo, dipMat)
    arrowMesh.position.copy(dipoleEnd)
    arrowMesh.setRotationFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dipDir)
    )
    group.add(arrowMesh)
  }

  group.position.copy(centerPos)
  scene.add(group)
  if (groupRef) groupRef.current = group
  return { group }
}

// ═══════════════════════════════════════════════════════════════════════════
// MER-[Co(NH₃)₃Cl₃] — 3 ta bir xil ligand oktaedr meridianida
// ═══════════════════════════════════════════════════════════════════════════
function buildMerMA3B3(scene, centerPos, complex, opts = {}) {
  const { scale = 1, showDipole = false, showSigma = false, groupRef = null } = opts
  const group = new THREE.Group()
  const dist = 1.35 * scale

  addAtomSphere(group, new THREE.Vector3(0, 0, 0), complex.center.color, complex.center.radius * scale, {
    roughness: 0.3, metalness: 0.7, emissive: complex.center.color, emissiveIntensity: 0.15
  })
  addGlow(group, new THREE.Vector3(0, 0, 0), complex.center.color, 0.55 * scale)

  // mer: 3 ta NH₃ meridianda (T-shakli) — +y, -y, +x
  // 3 ta Cl esa boshqa meridianda: -x, +z, -z
  const nPos = [
    new THREE.Vector3(0, +dist, 0),
    new THREE.Vector3(0, -dist, 0),
    new THREE.Vector3(+dist, 0, 0)
  ]
  const clPos = [
    new THREE.Vector3(-dist, 0, 0),
    new THREE.Vector3(0, 0, +dist),
    new THREE.Vector3(0, 0, -dist)
  ]

  nPos.forEach(pos => {
    addAtomSphere(group, pos, complex.ligandA.donorColor, complex.ligandA.donorRadius * scale)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x444488, 0.04 * scale)
    const dir = pos.clone().normalize()
    const perp1 = new THREE.Vector3(dir.y, -dir.x, 0).normalize()
    if (perp1.length() < 0.1) perp1.set(1, 0, 0)
    const perp2 = new THREE.Vector3().crossVectors(dir, perp1).normalize()
    for (let h = 0; h < 3; h++) {
      const angle = (h * 2 * Math.PI) / 3
      const hPos = pos.clone().add(dir.clone().multiplyScalar(0.4 * scale))
        .add(perp1.clone().multiplyScalar(0.25 * scale * Math.cos(angle)))
        .add(perp2.clone().multiplyScalar(0.25 * scale * Math.sin(angle)))
      addAtomSphere(group, hPos, 0xFFFFFF, 0.08 * scale)
      addBondToGroup(group, pos, hPos, 0x888888, 0.02 * scale, 0.4)
    }
  })

  clPos.forEach(pos => {
    addAtomSphere(group, pos, complex.ligandB.color, complex.ligandB.radius * scale)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x448844, 0.04 * scale)
  })

  // Meridian chizig'ini ko'rsatish (3 ta NH₃ orqali T-shakli)
  const meridianGeo = new THREE.BufferGeometry()
  const meridianVerts = new Float32Array([
    nPos[0].x, nPos[0].y, nPos[0].z,
    0, 0, 0,
    nPos[1].x, nPos[1].y, nPos[1].z,
    0, 0, 0,
    nPos[2].x, nPos[2].y, nPos[2].z
  ])
  meridianGeo.setAttribute('position', new THREE.BufferAttribute(meridianVerts, 3))
  const meridianMat = new THREE.LineBasicMaterial({
    color: CPK.mer, transparent: true, opacity: 0.6, linewidth: 3
  })
  group.add(new THREE.Line(meridianGeo, meridianMat))

  // Meridian tekisligini ko'rsatish (xy tekislik)
  const meridPlaneGeo = new THREE.PlaneGeometry(3.5 * scale, 3.5 * scale)
  const meridPlaneMat = new THREE.MeshBasicMaterial({
    color: CPK.mer, transparent: true, opacity: 0.15, side: THREE.DoubleSide
  })
  const meridPlane = new THREE.Mesh(meridPlaneGeo, meridPlaneMat)
  group.add(meridPlane)

  // C₂ o'qi (mer uchun +x yo'nalishida)
  if (showSigma) {
    const c2Geo = new THREE.CylinderGeometry(0.012 * scale, 0.012 * scale, 4 * scale, 8)
    const c2Mat = new THREE.MeshBasicMaterial({ color: CPK.sigma, transparent: true, opacity: 0.6 })
    const c2 = new THREE.Mesh(c2Geo, c2Mat)
    c2.rotation.z = Math.PI / 2  // x o'qi bo'ylab
    group.add(c2)
  }

  // Dipol (x o'qi bo'ylab, kichikroq)
  if (showDipole) {
    const dipDir = new THREE.Vector3(1, 0, 0)
    const dipoleEnd = dipDir.clone().multiplyScalar(1.6 * scale)
    const dipGeo = new THREE.CylinderGeometry(0.03 * scale, 0.03 * scale, dipoleEnd.length(), 12)
    const dipMat = new THREE.MeshBasicMaterial({ color: CPK.dipole, transparent: true, opacity: 0.85 })
    const dipMesh = new THREE.Mesh(dipGeo, dipMat)
    dipMesh.position.copy(dipoleEnd.clone().multiplyScalar(0.5))
    dipMesh.setRotationFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dipDir)
    )
    group.add(dipMesh)
    const arrowGeo = new THREE.ConeGeometry(0.09 * scale, 0.25 * scale, 12)
    const arrowMesh = new THREE.Mesh(arrowGeo, dipMat)
    arrowMesh.position.copy(dipoleEnd)
    arrowMesh.setRotationFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dipDir)
    )
    group.add(arrowMesh)
  }

  group.position.copy(centerPos)
  scene.add(group)
  if (groupRef) groupRef.current = group
  return { group }
}

// ═══════════════════════════════════════════════════════════════════════════
// ASOSIY REACT KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════
export default function OrinbosarIzomeriya3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)

  // 3D obyektlar
  const leftGroupRef = useRef(null)   // Birinchi izomer (cis / fac)
  const rightGroupRef = useRef(null)  // Ikkinchi izomer (trans / mer)
  const domLabelsRef = useRef([])

  // ═══════════════════════════════════════════════════════════
  // UI STATE'LAR
  // ═══════════════════════════════════════════════════════════
  const [complexId, setComplexId] = useState("CoNH3Cl2_oct")
  const [viewMode, setViewMode] = useState("ball")
  const [showLabels, setShowLabels] = useState(true)
  const [showDipole, setShowDipole] = useState(false)
  const [showSigma, setShowSigma] = useState(false)
  const [showBondAngles, setShowBondAngles] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showKurnakov, setShowKurnakov] = useState(false)
  const [showTransEffect, setShowTransEffect] = useState(false)

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
    view: false, physical: false, chemistry: true, medical: true, history: true, science: true
  })

  // PDF va Citation
  const [pdfSections, setPdfSections] = useState({
    intro: true, wernerJorgensen: true, isomerTypes: true, cisPlatin: true,
    kurnakov: true, transEffect: true, statistics: true, uvvis: true,
    table: true, applications: true, references: true
  })
  const [citationFormat, setCitationFormat] = useState("APA")

  const currentComplex = COMPLEXES[complexId]
  const isomerKeys = Object.keys(currentComplex.isomers)  // ["cis","trans"] yoki ["fac","mer"]
  const isomerA = currentComplex.isomers[isomerKeys[0]]
  const isomerB = currentComplex.isomers[isomerKeys[1]]

  // ═══════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return
      if (e.key === "f" || e.key === "F") setFullscreen(v => !v)
      if (e.key === "d" || e.key === "D") setShowDipole(v => !v)
      if (e.key === "s" || e.key === "S") setShowSigma(v => !v)
      if (e.key === "l" || e.key === "L") setShowLabels(v => !v)
      if (e.key === "r" || e.key === "R") setAutoRotate(v => !v)
      if (e.key === "b" || e.key === "B") setShowBondAngles(v => !v)
      if (e.key === "1") setComplexId("CoNH3Cl2_oct")
      if (e.key === "2") setComplexId("PtNH3Cl2_sq")
      if (e.key === "3") setComplexId("CoNH3Cl3_facmer")
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  // ═══════════════════════════════════════════════════════════
  // BOSHQARUV PANELINI KO'CHIRISH
  // ═══════════════════════════════════════════════════════════
  const handlePanelMouseDown = (e) => {
    e.preventDefault()
    setDragState({
      dragging: true,
      offX: e.clientX - panelPos.x,
      offY: e.clientY - panelPos.y
    })
  }
  useEffect(() => {
    if (!dragState.dragging) return
    const handleMove = (e) => {
      setPanelPos({
        x: Math.max(0, Math.min(window.innerWidth - 290, e.clientX - dragState.offX)),
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
    camera.position.set(0, 4, 12)
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
    controls.maxDistance = 30
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.6
    controlsRef.current = controls

    // Yorug'liklar
    scene.add(new THREE.AmbientLight(0x606080, 0.7))
    const key = new THREE.DirectionalLight(0xffffff, 1.2)
    key.position.set(8, 10, 8)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xcc88ff, 0.4)
    fill.position.set(-6, -2, -4)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0x88ccff, 0.3)
    rim.position.set(0, -5, -8)
    scene.add(rim)

    const grid = new THREE.GridHelper(20, 40, 0x333355, 0x1a1a2e)
    grid.position.y = -3.5
    grid.material.transparent = true
    grid.material.opacity = 0.4
    scene.add(grid)

    // Yulduzlar
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
    // MODELLARNI QURISH (kompleks turi bo'yicha)
    // ═══════════════════════════════════════════════════════════
    const gap = 5.5

    if (currentComplex.isomerType === "cis-trans" && currentComplex.geometry === "Oktaedrik") {
      buildOctahedralCisMA4B2(scene, new THREE.Vector3(-gap / 2, 0, 0), currentComplex, {
        showDipole, showSigma, groupRef: leftGroupRef
      })
      buildOctahedralTransMA4B2(scene, new THREE.Vector3(+gap / 2, 0, 0), currentComplex, {
        showDipole, showSigma, groupRef: rightGroupRef
      })
    } else if (currentComplex.isomerType === "cis-trans" && currentComplex.geometry === "Kvadrat planar") {
      buildSquarePlanarCis(scene, new THREE.Vector3(-gap / 2, 0, 0), currentComplex, {
        showDipole, showSigma, groupRef: leftGroupRef
      })
      buildSquarePlanarTrans(scene, new THREE.Vector3(+gap / 2, 0, 0), currentComplex, {
        showDipole, showSigma, groupRef: rightGroupRef
      })
    } else if (currentComplex.isomerType === "fac-mer") {
      buildFacMA3B3(scene, new THREE.Vector3(-gap / 2, 0, 0), currentComplex, {
        showDipole, showSigma, groupRef: leftGroupRef
      })
      buildMerMA3B3(scene, new THREE.Vector3(+gap / 2, 0, 0), currentComplex, {
        showDipole, showSigma, groupRef: rightGroupRef
      })
    }

    // ═══════════════════════════════════════════════════════════
    // KO'RINISH REJIMI (wireframe)
    // ═══════════════════════════════════════════════════════════
    ;[leftGroupRef.current, rightGroupRef.current].forEach(g => {
      if (!g) return
      g.traverse(obj => {
        if (obj.isMesh && obj.material) {
          const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material
          if (viewMode === "wire") mat.wireframe = true
          else mat.wireframe = false
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
      // Chap yorliq (cis / fac)
      const leftColor = isomerKeys[0] === "cis" ? "#FFD700" : "#FF6EC7"
      addLabel(
        `${isomerA.label}<br/><span style='font-size:11px;color:#aaa'>${isomerA.pointGroup} • µ = ${isomerA.dipole} D</span>`,
        `position:absolute;top:12%;left:6%;color:${leftColor};font-size:28px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 15px ${leftColor}88`
      )
      // O'ng yorliq (trans / mer)
      const rightColor = isomerKeys[1] === "trans" ? "#66CCFF" : "#50E3A4"
      addLabel(
        `${isomerB.label}<br/><span style='font-size:11px;color:#aaa'>${isomerB.pointGroup} • µ = ${isomerB.dipole} D</span>`,
        `position:absolute;top:12%;right:6%;color:${rightColor};font-size:28px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 15px ${rightColor}88`
      )
      // Pastdagi izoh
      addLabel(
        `Formula bir xil: <b>${cleanText(currentComplex.formula)}</b> • Ligand pozitsiyasi turli • Xossalari farqli`,
        "position:absolute;bottom:5%;left:50%;transform:translateX(-50%);color:#c4b5fd;font-size:13px;font-style:italic;pointer-events:none;z-index:5;text-align:center;background:rgba(30,20,60,0.6);padding:6px 14px;border-radius:8px;border:1px solid #6d28d9"
      )
      // Bog' burchagi izohi
      if (showBondAngles) {
        addLabel(
          `${isomerA.label}: Cl–M–Cl = 90° • ${isomerB.label}: ${currentComplex.isomerType === "cis-trans" ? "Cl–M–Cl = 180°" : "3σᵥ, C₃ ↔ 2σᵥ, C₂"}`,
          "position:absolute;top:22%;left:50%;transform:translateX(-50%);color:#fbbf24;font-size:12px;font-weight:600;pointer-events:none;z-index:5;text-align:center;background:rgba(60,40,10,0.7);padding:5px 12px;border-radius:8px;border:1px solid #f59e0b"
        )
      }
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

      // Sekin aylanish
      if (leftGroupRef.current) leftGroupRef.current.rotation.y = time * 0.15
      if (rightGroupRef.current) rightGroupRef.current.rotation.y = time * 0.15

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
  }, [complexId, showDipole, showSigma, showLabels, showBondAngles, viewMode, autoRotate,
      currentComplex, isomerA, isomerB, isomerKeys])

  // ═══════════════════════════════════════════════════════════
  // 📄 PDF EKSPORT — PREMIUM ILMIY HISOBOT (namuna arxitekturasi)
  // ═══════════════════════════════════════════════════════════
  const generatePDF = useCallback(async () => {
    if (pdfGenerating) return
    setPdfGenerating(true)
    try {
      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)

      // ── Font yuklash (DejaVu Sans Unicode) ──
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

      // ── Rang palitrasi (namunangizdek) ──
      const C = {
        purple:      rgb(0.30, 0.11, 0.58),
        purpleLight: rgb(0.86, 0.78, 1.00),
        purpleMid:   rgb(0.65, 0.55, 0.98),
        purpleDark:  rgb(0.12, 0.11, 0.29),
        textDark:    rgb(0.08, 0.08, 0.16),
        textMuted:   rgb(0.47, 0.47, 0.55),
        textGray:    rgb(0.47, 0.47, 0.47),
        white:       rgb(1, 1, 1),
        gold:        rgb(0.80, 0.62, 0.05),
        blue:        rgb(0.08, 0.31, 0.75),
        orange:      rgb(0.86, 0.55, 0.00),
        red:         rgb(0.80, 0.20, 0.20),
        green:       rgb(0.08, 0.55, 0.31),
        yellow:      rgb(0.75, 0.60, 0.10),
        cyan:        rgb(0.10, 0.60, 0.80),
        pink:        rgb(0.85, 0.20, 0.75),
        grayLine:    rgb(0.78, 0.78, 0.86),
        bgPurple:    rgb(0.97, 0.96, 1.00),
        bgOrange:    rgb(1.00, 0.97, 0.94),
        bgBlue:      rgb(0.94, 0.98, 1.00),
        bgGreen:     rgb(0.94, 1.00, 0.98),
        bgYellow:    rgb(1.00, 0.98, 0.90),
        bgRed:       rgb(1.00, 0.94, 0.94),
        bgGold:      rgb(1.00, 0.98, 0.86),
        bgCyan:      rgb(0.92, 0.98, 1.00),
        bgPink:      rgb(1.00, 0.94, 0.99)
      }

      // ── A4 konstantalari ──
      const PAGE_W = 595.28
      const PAGE_H = 841.89
      const MARGIN = 55
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 50

      // ── Yordamchi funksiyalar ──
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
          if (measure(test, f, size) <= maxWidth) {
            curLine = test
          } else {
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
          end:   { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine
        })
        const dateStr = new Date().toLocaleDateString("uz-UZ")
        const brandText = `O'rinbosar izomeriya 3D Lab  •  ${cleanText(currentComplex.formula)}  •  ${dateStr}`
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

      // ═══════════════════════════════════════════════════════════
      // TITUL SAHIFA
      // ═══════════════════════════════════════════════════════════
      page.drawRectangle({ x: 0, y: PAGE_H - 200, width: PAGE_W, height: 200, color: C.purpleDark })
      page.drawRectangle({ x: 0, y: PAGE_H - 205, width: PAGE_W, height: 5, color: C.purple })

      page.drawText("JDA-KIMYO • ILMIY BYULLETEN'", {
        x: MARGIN, y: PAGE_H - 30, size: 9, font: boldFont, color: C.purpleLight
      })
      page.drawText(new Date().toLocaleDateString("uz-UZ"), {
        x: PAGE_W - MARGIN - measure(new Date().toLocaleDateString("uz-UZ"), regularFont, 9),
        y: PAGE_H - 30, size: 9, font: regularFont, color: C.purpleLight
      })

      const mainTitle = "O'RINBOSAR IZOMERIYA"
      const mtWidth = measure(mainTitle, boldFont, 24)
      page.drawText(mainTitle, {
        x: (PAGE_W - mtWidth) / 2, y: PAGE_H - 85,
        size: 24, font: boldFont, color: C.white
      })

      const subtitle = "Koordinatsion birikmalarda ligand pozitsiyasi izomeriyasi"
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

      // Izomer jufti
      const isomerPairLabel = `${isomerA.label} ↔ ${isomerB.label}`
      const iplWidth = measure(isomerPairLabel, boldFont, 16)
      page.drawText(isomerPairLabel, {
        x: (PAGE_W - iplWidth) / 2, y: PAGE_H - 170,
        size: 16, font: boldFont, color: C.purpleLight
      })

      y = PAGE_H - 235

      drawInfoBox(
        "Tanlangan kompleks va izomer jufti",
        `Formula: ${cleanText(currentComplex.formula)}  |  Nomi: ${currentComplex.name}\n` +
        `Geometriya: ${currentComplex.geometry}  |  Koord. son: ${currentComplex.coordinationNumber}  |  Gibridlanish: ${currentComplex.hybridization}\n` +
        `${isomerA.label}: ${isomerA.pointGroup} simmetriya, µ = ${isomerA.dipole} D, ${isomerA.color}\n` +
        `${isomerB.label}: ${isomerB.pointGroup} simmetriya, µ = ${isomerB.dipole} D, ${isomerB.color}`,
        { bgColor: C.bgPurple, borderColor: C.purple }
      )

      drawInfoBox(
        "Tarixiy kontekst",
        `Kashfiyot yili: ${currentComplex.discoveryYear}  |  Kashfiyot muallifi: ${currentComplex.discoverer}\n` +
        `${currentComplex.scientificNotes}`,
        { bgColor: C.bgGold, borderColor: C.gold, titleColor: C.gold }
      )

      y -= 5
      drawSectionHeader("§", "Annotatsiya")
      drawParagraph(
        `Ushbu hisobotda ${currentComplex.formula} kompleksining o'rinbosar (pozitsion) ` +
        `izomeriyasi keng qamrovli o'rganilgan. ${isomerA.label} va ${isomerB.label} izomerlarining ` +
        `fazoviy tuzilishi, simmetriya xossalari, dipol momenti farqi, spektroskopik xossalari, ` +
        `Werner-Jorgensen tarixiy bahsi, Chernyaev trans-effekti (rus koordinatsion kimyo maktabi), ` +
        `Kurnakov thiourea sinovi, biologik va tibbiy ahamiyati (Cisplatin misolida) hamda ` +
        `zamonaviy amaliy foydalanish sohalari batafsil bayon etilgan.`
      )

      addNewPage()

      // ═══════════════════════════════════════════════════════════
      // 1. KIRISH — O'RINBOSAR IZOMERIYA NIMA?
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.intro) {
        drawSectionHeader(1, "Kirish — o'rinbosar izomeriya nima?")
        drawParagraph(
          "O'rinbosar (pozitsion) izomeriya — koordinatsion birikmalarda ligandlarning markaziy atom " +
          "atrofidagi turli pozitsiyalarda joylashishi natijasida vujudga keladigan izomeriya turi. " +
          "Molekuladagi atomlar soni va turi bir xil bo'lishiga qaramay, ularning fazoviy joylashuvi " +
          "farqlanadi va bu farq fizik, kimyoviy va biologik xossalarga sezilarli ta'sir qiladi."
        )
        drawInfoBox(
          "IUPAC (2005) rasmiy ta'rif",
          "Positional isomerism (geometric isomerism): Isomers that differ in the spatial arrangement " +
          "of ligands around the central metal atom. In octahedral complexes, this includes cis/trans " +
          "(MA₄B₂ va MA₂B₄) va fac/mer (MA₃B₃) izomerlar. In square planar complexes, cis/trans (MA₂B₂).",
          { bgColor: C.bgPurple, borderColor: C.purple }
        )
        drawParagraph("Asosiy pozitsion izomeriya turlari:")
        drawBulletPoint("cis (lot. \"bir tomonda\") — ikkita bir xil ligand qo'shni pozitsiyada, burchak 90°", { bulletColor: C.gold })
        drawBulletPoint("trans (lot. \"qarshi tomonda\") — ikkita bir xil ligand qarama-qarshi pozitsiyada, burchak 180°", { bulletColor: C.blue })
        drawBulletPoint("fac (facial — \"yuz\") — 3 ta bir xil ligand oktaedrning bir uch burchakli yuzida", { bulletColor: C.pink })
        drawBulletPoint("mer (meridional — \"meridian\") — 3 ta bir xil ligand meridianda (T-shakli)", { bulletColor: C.green })
        drawInfoBox(
          "Izomeriya yuzaga kelish shartlari",
          "1) Markaziy atom yetarli koord. songa (4 yoki 6) ega bo'lishi kerak\n" +
          "2) Kamida 2 xil ligand mavjud bo'lishi kerak (MA₂B₂, MA₄B₂, MA₃B₃)\n" +
          "3) Geometriya oktaedrik yoki kvadrat planar bo'lishi kerak (tetraedrikda cis/trans yo'q)\n" +
          "4) Ligandlar bir-biriga tez almashinmasligi kerak (kinetik barqarorlik)",
          { bgColor: C.bgGreen, borderColor: C.green, titleColor: C.green }
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 2. WERNER-JORGENSEN TARIXIY BAHSI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.wernerJorgensen) {
        drawSectionHeader(2, "Werner-Jorgensen tarixiy bahsi (1893–1911)")
        drawParagraph(
          "XIX asr oxirida koordinatsion kimyoning eng katta ilmiy bahsi ikki dahoning nazariyalari " +
          "orasida bo'lib o'tdi: shveytsariyalik Alfred Werner va daniyalik Sophus Mads Jorgensen. " +
          "Bu bahs 20 yil davom etdi va koordinatsion kimyoning zamonaviy asosini yaratdi."
        )
        drawInfoBox(
          "Jorgensen — zanjir (Kette) nazariyasi (1893)",
          "Daniyalik kimyogar Jorgensen ammoniy komplekslarida ligandlar –NH₃–NH₃–NH₃– " +
          "zanjir shaklida bog'langan deb hisoblardi. Bu nazariyaga ko'ra [Co(NH₃)₄Cl₂]Cl uchun " +
          "faqat BITTA izomer bo'lishi kerak edi. Jorgensen o'z davrining eng katta koordinatsion " +
          "kimyogari edi va uning eksperimental ishlari juda aniq edi.",
          { bgColor: C.bgOrange, borderColor: C.orange, titleColor: C.orange }
        )
        drawInfoBox(
          "Werner — koordinatsion nazariya (1893)",
          "25 yoshli Werner tunda tush ko'rib uyg'onib, koordinatsion nazariyani yozdi. Uning " +
          "nazariyasiga ko'ra ligandlar markaziy atomni to'g'ridan-to'g'ri oktaedrik geometriyada " +
          "o'raydi. Bu nazariya [Co(NH₃)₄Cl₂]Cl uchun IKKITA izomer (cis va trans) bo'lishi kerakligini " +
          "matematik jihatdan bashorat qildi.",
          { bgColor: C.bgPurple, borderColor: C.purple, titleColor: C.purple }
        )
        drawParagraph(
          "1907-yilda Werner o'z shogirdlari bilan cis-[Co(NH₃)₄Cl₂]Cl (violet-siyoh, \"violeo\") va " +
          "trans-[Co(NH₃)₄Cl₂]Cl (yashil, \"praseo\") izomerlarini alohida ajratdi va ularning fizik " +
          "xossalarini o'lchadi. Bu — Jorgensen nazariyasini butunlay yo'qqa chiqargan hal qiluvchi " +
          "eksperiment bo'ldi."
        )
        drawInfoBox(
          "🏆 Nobel mukofoti (1913)",
          "Werner \"koordinatsion nazariya va atomlarning molekulada joylashuvi\" bo'yicha ishlar " +
          "uchun Kimyo bo'yicha Nobel mukofotini oldi. Bu koordinatsion kimyoning mustaqil fan sifatida " +
          "tug'ilishi edi. Jorgensen esa 1908-yilda vafot etgan bo'lsa-da, Werner umr bo'yi uning ilmiy " +
          "hurmatini saqlab qoldi va Jorgensen ishlarining aniqligini alohida ta'kidladi.",
          { bgColor: C.bgGold, borderColor: C.gold, titleColor: C.gold }
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 3. IZOMER TURLARI VA GEOMETRIYA
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.isomerTypes) {
        drawSectionHeader(3, "Izomer turlari va geometriya bo'yicha imkoniyat")
        drawParagraph(
          "Koordinatsion son va geometriya turli xil o'rinbosar izomer imkoniyatlarini beradi. " +
          "Quyidagi asosiy holatlarni ko'rib chiqamiz:"
        )
        drawInfoBox(
          "MA₂B₂ — Kvadrat planar (koord. son 4)",
          "Ikki xil ligand teng miqdorda: 2 ta cis / trans izomer mavjud. Tetraedrik holatda " +
          "izomeriya YO'Q, chunki tetraedrda barcha pozitsiyalar ekvivalent. Klassik namuna: " +
          "[Pt(NH₃)₂Cl₂] — cisplatin (dori) va transplatin (dori emas).",
          { bgColor: C.bgCyan, borderColor: C.cyan, titleColor: C.cyan }
        )
        drawInfoBox(
          "MA₄B₂ — Oktaedrik (koord. son 6)",
          "4:2 nisbat: 2 ta izomer (cis: 2 ta B qo'shni, 90°; trans: 2 ta B qarshi, 180°). Klassik " +
          "namuna: [Co(NH₃)₄Cl₂]⁺ — Werner uchun tarixiy tajriba. cis (violeo, µ ≠ 0) va trans " +
          "(praseo, µ = 0) fizikaviy jihatdan aniq farqlanadi.",
          { bgColor: C.bgYellow, borderColor: C.yellow, titleColor: C.yellow }
        )
        drawInfoBox(
          "MA₃B₃ — Oktaedrik (koord. son 6)",
          "3:3 nisbat: 2 ta izomer (fac: 3 ta B bir yuzda, C₃ᵥ simmetriya; mer: 3 ta B meridianda, " +
          "C₂ᵥ simmetriya). Namuna: [Co(NH₃)₃Cl₃] va [Rh(py)₃Cl₃]. Bu izomerlar spektroskopiya va " +
          "katalitik faollik jihatidan sezilarli farqlanadi.",
          { bgColor: C.bgPink, borderColor: C.pink, titleColor: C.pink }
        )
        drawParagraph(
          "Tetraedrik geometriyada (koord. son 4) o'rinbosar izomeriya yo'q, chunki tetraedrning " +
          "barcha 4 ta pozitsiyasi ekvivalent — cis/trans farqi mavjud emas. Bu — kvadrat planar va " +
          "oktaedrik geometriyaning o'ziga xos xususiyati.",
          { font: italicFont, color: C.textMuted }
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 4. CISPLATIN — TIBBIY MO''JIZA
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.cisPlatin) {
        drawSectionHeader(4, "Cisplatin — pozitsion izomeriyaning tibbiy mo''jizasi")
        drawInfoBox(
          "Tasodifiy kashfiyot — Rosenberg (1965)",
          "Michigan State University'da Barnett Rosenberg elektr maydonining bakteriyalar bo'linishiga " +
          "ta'sirini o'rganishardi. U platina elektrodlar ishlatgan va NH₄Cl eritmasida tasodifan " +
          "cis-[Pt(NH₃)₂Cl₂] hosil bo'ldi. Bu birikma bakteriyalar bo'linishini butunlay to'xtatdi. " +
          "Rosenberg keyinchalik uning rak hujayralarini ham o'ldirishini isbotladi.",
          { bgColor: C.bgGreen, borderColor: C.green, titleColor: C.green }
        )
        drawParagraph(
          "Cisplatin (cis-[Pt(NH₃)₂Cl₂]) 1978-yilda FDA tomonidan rasmiy dori sifatida ro'yxatga " +
          "olindi. Bugungi kunda tuxumdon, moyak, ko'krak, o'pka va boshqa turdagi raklar davosida " +
          "keng qo'llaniladi. Uning taxminiy davolash mexanizmi:"
        )
        drawBulletPoint("1) Cisplatin qonga kiradi (Cl⁻ konsentratsiyasi yuqori, 100 mM)", { bulletColor: C.blue })
        drawBulletPoint("2) Hujayra ichiga kiradi (Cl⁻ konsentratsiyasi past, 4 mM) — Cl H₂O ga almashinadi", { bulletColor: C.blue })
        drawBulletPoint("3) [Pt(NH₃)₂(H₂O)₂]²⁺ katta elektrofil — DNK guanin N7 bilan bog'lanadi", { bulletColor: C.blue })
        drawBulletPoint("4) DNK cross-link (asosan 1,2-intrastrand) — replikatsiya to'xtaydi", { bulletColor: C.blue })
        drawBulletPoint("5) DNK zararlanishi apoptoz (dasturlashgan hujayra o'limi) ga olib keladi", { bulletColor: C.blue })
        drawInfoBox(
          "trans-izomer — nima uchun DAVOLAMAYDI?",
          "trans-[Pt(NH₃)₂Cl₂] xuddi shu formula, xuddi shu atomlar, xuddi shu bog'lar. Lekin: " +
          "1) trans-Pt DNK bilan bir xil cross-link tuza olmaydi — geometriya to'g'ri kelmaydi; " +
          "2) trans-Pt ni tanadagi oqsillar tez zararsizlantiradi (deaktivatsiya); 3) trans-Pt DNK " +
          "boshqa nishonlar bilan reaksiyaga kirishadi, natijada terapevtik indeks juda past. Bu — " +
          "pozitsion izomeriyaning HAYOTI-MAMOT ahamiyatining eng dramatik namunasi.",
          { bgColor: C.bgRed, borderColor: C.red, titleColor: C.red }
        )
        drawParagraph("Cisplatin avlodlari (\"platinum drugs\"):")
        drawBulletPoint("Karboplatin (1989) — karboksilat ligand, kam nefrotoksik", { bulletColor: C.purple })
        drawBulletPoint("Oksaliplatin (1996) — DACH ligand, kolorektal rak uchun", { bulletColor: C.purple })
        drawBulletPoint("Nedaplatin (Yaponiya) va Lobaplatin (Xitoy) — hududiy versiyalar", { bulletColor: C.purple })
        drawBulletPoint("Satraplatin — birinchi og'zaki qabul qilinadigan platina dorisi", { bulletColor: C.purple })
      }

      // ═══════════════════════════════════════════════════════════
      // 5. KURNAKOV SINOVI (THIOUREA TEST)
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.kurnakov) {
        drawSectionHeader(5, "Kurnakov sinovi — cis va trans izomerlarni farqlash")
        drawParagraph(
          "Rus koordinatsion kimyo maktabi (L. A. Kurnakov va uning shogirdlari) cis va trans " +
          "izomerlarni tez va ishonchli farqlash uchun thiourea (SC(NH₂)₂) bilan sinov usulini ishlab chiqdi. " +
          "Bu usul bugungi kunda ham amalda qo'llaniladi."
        )
        drawFormula("cis-[Pt(NH₃)₂Cl₂] + 4 tu → [Pt(tu)₄]²⁺ + 2 NH₃ + 2 Cl⁻", { size: 10 })
        drawFormula("trans-[Pt(NH₃)₂Cl₂] + 2 tu → trans-[Pt(NH₃)₂(tu)₂]²⁺ + 2 Cl⁻", { size: 10 })
        drawInfoBox(
          "Farqlash prinsipi",
          "cis-izomerda ikkala Cl ham qo'shni pozitsiyada — ikkalasi ham tez almashinadi va oxir-oqibat " +
          "NH₃ ham chiqib ketadi (tu ning trans-effekti kuchli). trans-izomerda esa Cl lar bir-biriga " +
          "qarama-qarshi — tu faqat Cl larni almashtira oladi, NH₃ ligandlarga tegmaydi. Sinov " +
          "30 daqiqada tugaydi va rang farqi bilan ko'rinadi.",
          { bgColor: C.bgYellow, borderColor: C.yellow, titleColor: C.yellow }
        )
        drawParagraph("Kurnakov sinovi qadamlari:")
        drawBulletPoint("1) Kompleks eritmasini iliting (50 °C, 30 daqiqa)")
        drawBulletPoint("2) Ortiqcha thiourea (SC(NH₂)₂) qo'shiling")
        drawBulletPoint("3) cis: to'q sariq [Pt(tu)₄]²⁺ hosil bo'ladi (4 tu ligand)")
        drawBulletPoint("4) trans: och sariq trans-[Pt(NH₃)₂(tu)₂]²⁺ hosil bo'ladi (faqat 2 tu)")
        drawBulletPoint("5) UV-Vis spektri (λmax farqi) bilan tasdiqlash")
        drawParagraph(
          "Bu sinov Chernyaev trans-effekti asosida ishlaydi — thiourea kuchli trans-effektga ega, " +
          "shuning uchun u o'zining trans holatidagi ligandni tez almashtiradi. Bu rus koordinatsion " +
          "kimyo maktabining zamonaviy analitik kimyoga qo'shgan hissasi.",
          { font: italicFont, color: C.textMuted }
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 6. TRANS EFFEKTI — CHERNYAEV QONUNI (1926)
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.transEffect) {
        drawSectionHeader(6, "Trans effekti — Chernyaev qonuni (1926)")
        drawParagraph(
          "1926-yilda moskvalik kimyogar Iliya Iliich Chernyaev Pt(II) komplekslarida ba'zi ligandlar " +
          "o'zlariga TRANS holatda turgan ligandning almashinishini tezlashtirishini kashf qildi. " +
          "Bu — TRANS EFFEKT qonuni. Bu rus koordinatsion kimyo maktabining eng katta hissasi va " +
          "sintetik kimyoning asosiy vositalaridan biri."
        )
        drawInfoBox(
          "Trans-effekt qatori (kuchayish tartibida)",
          "H₂O < OH⁻ < NH₃ < py < Cl⁻ < Br⁻ < I⁻ < SCN⁻ < NO₂⁻ < SC(NH₂)₂ < CH₃⁻ < H⁻ < NO < CO ~ CN⁻ ~ C₂H₄\n" +
          "Kuchli trans-effekt beruvchi ligandlar (CN⁻, CO, C₂H₄, H⁻) o'zlariga trans-holatdagi " +
          "ligandni juda tez almashtiradi. Kuchsizlari (H₂O, NH₃) ta'sir qilmaydi.",
          { bgColor: C.bgBlue, borderColor: C.blue, titleColor: C.blue }
        )
        drawParagraph("Trans-effekt mexanizmi (2 ta nazariya):")
        drawBulletPoint("Polarizatsiya nazariyasi (Grinberg) — kuchli ligand M–L bog'ini kuchsizlantiradi", { bulletColor: C.purple })
        drawBulletPoint("π-bog' nazariyasi (Chatt-Orgel) — π-akseptor ligandlar trans-M–L ni kuchsizlantiradi", { bulletColor: C.purple })
        drawInfoBox(
          "Amaliy foydalanish — cisplatin sintezi",
          "cis va trans izomerlarni maqsadli tayyorlash uchun Trans-effekt qatori ishlatiladi. Masalan, " +
          "K₂[PtCl₄] dan cis-[Pt(NH₃)₂Cl₂] tayyorlash uchun: birinchi NH₃ Cl bilan almashadi (chunki " +
          "Cl trans-effekti NH₃ dan kuchliroq), ikkinchi NH₃ esa qo'shni pozitsiyaga o'tiradi. " +
          "Natijada 100% cis-izomer hosil bo'ladi.",
          { bgColor: C.bgGreen, borderColor: C.green, titleColor: C.green }
        )
        drawParagraph(
          "Chernyaev laboratoriyasi 40 yildan ortiq davomida Trans-effekt qatorini kengaytirdi. " +
          "Bugungi kunda bu qonun katalitik sintez, farmakologik dizayn va yangi materiallar yaratishda " +
          "asosiy vosita hisoblanadi. Chernyaev shogirdlari (Grinberg, Yatsimirskiy, Spitsyn) rus " +
          "koordinatsion kimyo maktabini butun dunyoga tanitdi.",
          { font: italicFont }
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 7. STATISTIK VA TERMODINAMIK EHTIMOL
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.statistics) {
        drawSectionHeader(7, "Statistik va termodinamik jihatlar")
        drawParagraph(
          "Ligandlar oktaedrga tasodifiy joylashsa, cis va trans izomerlar qanday nisbatda hosil " +
          "bo'lishi mumkin? Bu — kombinatorika masalasi. Oktaedrda 6 ta pozitsiya bor, ulardan 2 tasini " +
          "tanlash — C(6,2) = 15 ta usul. Bulardan:"
        )
        drawBulletPoint("cis konfiguratsiya (qo'shni juftlar): 12 ta usul (12/15 = 80%)")
        drawBulletPoint("trans konfiguratsiya (qarama-qarshi juftlar): 3 ta usul (3/15 = 20%)")
        drawInfoBox(
          "Statistik nisbat cis : trans = 4 : 1",
          "Agar ligandlar tasodifiy taqsimlansa, cis izomer 4 barobar ko'p hosil bo'lishi kerak. " +
          "Bu esa nima uchun ko'p reaksiyalarda cis-mahsulot dominant ekanini tushuntiradi.\n" +
          "MA₃B₃ uchun: fac 6 ta usul (30%), mer 12 ta usul (60%), qolgan 2 ta ekvivalent — mer:fac = 2:1",
          { bgColor: C.bgPurple, borderColor: C.purple }
        )
        drawParagraph("Termodinamik omillar:")
        drawBulletPoint("cis: 2 ta L–L bog' burchagi 90° — sterik itarilish katta", { bulletColor: C.gold })
        drawBulletPoint("trans: 2 ta L–L bog' burchagi 180° — sterik itarilish minimal", { bulletColor: C.blue })
        drawBulletPoint("cis: dipol momenti katta (µ ≠ 0) — polyar erituvchilarda barqaror", { bulletColor: C.gold })
        drawBulletPoint("trans: dipol momenti nol (µ = 0) — apolyar erituvchilarda barqaror", { bulletColor: C.blue })
        drawInfoBox(
          "Kinetik va termodinamik nazorat",
          "cis / trans nisbat ko'pincha reaksiya sharoiti bilan boshqariladi:\n" +
          "• Past haroratda (kinetik nazorat) — statistik nisbat (cis ko'p)\n" +
          "• Yuqori haroratda (termodinamik nazorat) — barqarorroq izomer (odatda trans) ko'p\n" +
          "• Trans-effekt yordamida esa maqsadli izomer tanlab olinishi mumkin",
          { bgColor: C.bgYellow, borderColor: C.yellow, titleColor: C.yellow }
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 8. UV-VIS SPEKTROSKOPIYA — IZOMERLARNI SPEKTRAL FARQLASH
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.uvvis) {
        drawSectionHeader(8, "UV-Vis spektroskopiya — spektral farqlash")
        drawParagraph(
          "cis va trans izomerlar bir xil elementar tarkibga ega bo'lishiga qaramay, d-orbital " +
          "splitting va simmetriya farqi tufayli UV-Vis yutilish spektrlari sezilarli farqlanadi. " +
          "Bu farq izomerlarni identifikatsiya qilishning eng ishonchli usullaridan biri."
        )
        drawInfoBox(
          `${isomerA.label} izomer — spektral xususiyatlar`,
          `λmax = ${isomerA.lambdaMax} nm  |  Rang: ${isomerA.color}\n` +
          `Simmetriya: ${isomerA.pointGroup}  |  d-d o'tishlar: 3 ta (past simmetriya, ko'p tarmoq)\n` +
          `Dipol momenti: ${isomerA.dipole} D (polyar molekula, IR faol)`,
          { bgColor: C.bgGold, borderColor: C.gold, titleColor: C.gold }
        )
        drawInfoBox(
          `${isomerB.label} izomer — spektral xususiyatlar`,
          `λmax = ${isomerB.lambdaMax} nm  |  Rang: ${isomerB.color}\n` +
          `Simmetriya: ${isomerB.pointGroup}  |  d-d o'tishlar: 2 ta (yuqori simmetriya, kam tarmoq)\n` +
          `Dipol momenti: ${isomerB.dipole} D`,
          { bgColor: C.bgCyan, borderColor: C.cyan, titleColor: C.cyan }
        )
        drawParagraph("Boshqa spektroskopik usullar:")
        drawBulletPoint("IR spektroskopiya: cis (2 M–Cl tarmoq); trans (1 M–Cl tarmoq)")
        drawBulletPoint("NMR: cis va trans turli kimyoviy siljish, koalensiya harorat farqi")
        drawBulletPoint("Raman: cis va trans turli simmetriya rejimlari (grup nazariyasi)")
        drawBulletPoint("X-ray difraksiya: kristall tuzilma to'liq aniqlanadi (absolyut isbot)")
        drawBulletPoint("Dipol momenti o'lchash: cis µ ≠ 0, trans µ = 0 — polyar erituvchida farq")
      }

      // ═══════════════════════════════════════════════════════════
      // 9. IZOMERLAR — SOLISHTIRISH JADVALI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.table) {
        drawSectionHeader(9, `${isomerA.label} va ${isomerB.label} izomerlarni solishtirish`)
        const rows = [
          ["Xususiyat", isomerA.label + " izomer", isomerB.label + " izomer"],
          ["Formula", cleanText(currentComplex.formula), cleanText(currentComplex.formula)],
          ["Ligand pozitsiyasi", isomerKeys[0] === "cis" ? "Qo'shni (90°)" : (isomerKeys[0] === "fac" ? "Uch burchakli yuz" : "Meridian T-shakli"),
                                 isomerKeys[1] === "trans" ? "Qarama-qarshi (180°)" : (isomerKeys[1] === "mer" ? "Meridian T-shakli" : "Uch burchakli yuz")],
          ["Simmetriya", isomerA.pointGroup, isomerB.pointGroup],
          ["σ tekislik soni", `${isomerA.sigmaCount}`, `${isomerB.sigmaCount}`],
          ["Dipol momenti µ", `${isomerA.dipole} D`, `${isomerB.dipole} D`],
          ["Polyarlik", isomerA.dipole > 0.5 ? "Polyar" : "Apolyar", isomerB.dipole > 0.5 ? "Polyar" : "Apolyar"],
          ["Rang", cleanText(isomerA.color).slice(0, 40), cleanText(isomerB.color).slice(0, 40)],
          ["λmax (UV-Vis)", `${isomerA.lambdaMax} nm`, `${isomerB.lambdaMax} nm`],
          ["Tarixiy nom", isomerA.historicalName, isomerB.historicalName]
        ]

        const colW = [CONTENT_W * 0.22, CONTENT_W * 0.39, CONTENT_W * 0.39]
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
            const txt = truncate(cleanText(cell), f, 9, colW[ci] - 14)
            let color = isHeader ? C.white : C.textDark
            if (!isHeader && ci === 1) {
              color = isomerKeys[0] === "cis" ? C.gold : (isomerKeys[0] === "fac" ? C.pink : C.textDark)
            }
            if (!isHeader && ci === 2) {
              color = isomerKeys[1] === "trans" ? C.blue : (isomerKeys[1] === "mer" ? C.green : C.textDark)
            }
            page.drawText(txt, { x: cx, y: y - rowH + 7, size: 9, font: f, color })
            cx += colW[ci]
          })
          y -= rowH
        })
        y -= 12
      }

      // ═══════════════════════════════════════════════════════════
      // 10. AMALIY QO'LLANILISHI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.applications) {
        drawSectionHeader(10, "Amaliy qo'llanilishi va zamonaviy tadqiqotlar")
        drawInfoBox(
          "Tibbiyot va farmakologiya",
          "cisplatin, karboplatin, oksaliplatin — o'nlab million bemorlarning hayotini saqlab qolgan. " +
          "Yangi platina dorilari (BBR3464, ProLindac, LA-12) klinik sinov bosqichida. " +
          "Bundan tashqari Ru(II), Ir(III), Au(I) komplekslari yangi antitumor agentlar sifatida o'rganilmoqda.",
          { bgColor: C.bgGreen, borderColor: C.green, titleColor: C.green }
        )
        drawParagraph("Zamonaviy tadqiqot sohalari:")
        drawBulletPoint("Katalitik sintez — trans-effekt asosidagi selektiv sintez (Grubbs katalizatori)")
        drawBulletPoint("Molekulyar magnetlar — cis / trans izomerlar turli magnit xossalarga ega")
        drawBulletPoint("Fotokataliz — cis-[Ru(bpy)₂L₂] tipidagi komplekslar suv bo'linishida")
        drawBulletPoint("Sensorlar va tibbiy tashxis — Gd(III), Fe(III) MRT kontrast agentlari")
        drawBulletPoint("MOFs (Metal-Organic Frameworks) — fac/mer izomeriya kanallar shakliga ta'sir")
        drawBulletPoint("Elektrokataliz — CO₂ redoksi va H₂ ishlab chiqarishda tanlangan izomerlar")
        drawInfoBox(
          "Rus koordinatsion kimyo maktabining zamonaviy vorislari",
          "Chernyaev, Grinberg, Yatsimirskiy va Spitsyn maktabining zamonaviy vorislari (Ossipiants, " +
          "Kukushkin, Ilyin) bugungi kunda ham trans-effekt, katalitik dizayn va biokoordinatsion " +
          "kimyoda dunyo darajasidagi ishlarni olib bormoqdalar. O'zbekiston koordinatsion kimyo " +
          "maktabi (M. G. Yusuxodjaev, S. A. Talipov) ham rus maktabining bevosita vorislaridan.",
          { bgColor: C.bgOrange, borderColor: C.orange, titleColor: C.orange }
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 11. ADABIYOTLAR
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.references) {
        drawSectionHeader(11, "Foydalanilgan adabiyotlar")
        const refs = [
          "Werner, A. (1893). Beitrag zur Konstitution anorganischer Verbindungen. Zeitschrift für anorganische Chemie, 3, 267–330.",
          "Werner, A. (1913). Nobel Lecture: On the Constitution and Configuration of Higher-Order Compounds. The Nobel Foundation, Stockholm.",
          "Jorgensen, S. M. (1893). Über kobaltiakverbindungen. Zeitschrift für anorganische Chemie, 5, 147–186.",
          "Chernyaev, I. I. (1926). Mono nitrites of platinum's diammines and trans-influence. Известия Института Платины, 4, 234–275.",
          "Rosenberg, B., Van Camp, L., & Krigas, T. (1965). Inhibition of Cell Division in Escherichia coli by Electrolysis Products from a Platinum Electrode. Nature, 205, 698–699.",
          "Rosenberg, B., et al. (1969). Platinum Compounds: a New Class of Potent Antitumour Agents. Nature, 222, 385–386.",
          "Kurnakov, N. S. (1893). Solubility and formation of complex compounds. Journal of the Russian Physico-Chemical Society, 25, 565.",
          "Peyrone, M. (1844). Ueber die Einwirkung des Ammoniaks auf Platinchlorür. Annalen der Chemie und Pharmacie, 51, 1–29.",
          "IUPAC (2005). Nomenclature of Inorganic Chemistry — IUPAC Recommendations 2005 (Red Book). RSC Publishing.",
          "Cotton, F. A., Wilkinson, G., Murillo, C. A., & Bochmann, M. (1999). Advanced Inorganic Chemistry, 6th ed. Wiley-Interscience.",
          "Miessler, G. L., Fischer, P. J., & Tarr, D. A. (2014). Inorganic Chemistry, 5th ed. Pearson Education.",
          "Housecroft, C. E., & Sharpe, A. G. (2018). Inorganic Chemistry, 5th ed. Pearson.",
          "Kelland, L. (2007). The resurgence of platinum-based cancer chemotherapy. Nature Reviews Cancer, 7(8), 573–584."
        ]
        refs.forEach((r, i) => {
          drawParagraph(`[${i + 1}] ${r}`, { size: 9, color: C.textDark })
        })
      }

      // ═══════════════════════════════════════════════════════════
      // Oxirgi sahifaga footer
      // ═══════════════════════════════════════════════════════════
      addFooter(page, pageNumber)

      // Metadata
      pdfDoc.setTitle(`O'rinbosar izomeriya — ${cleanText(currentComplex.formula)}`)
      pdfDoc.setSubject("O'rinbosar (pozitsion) izomeriya, cis/trans, fac/mer, koordinatsion kimyo")
      pdfDoc.setAuthor("JDA-Kimyo (jdakimyo.uz)")
      pdfDoc.setCreator("jdakimyo.uz O'rinbosar izomeriya 3D Lab")
      pdfDoc.setProducer("pdf-lib + DejaVu Sans")
      pdfDoc.setKeywords([
        "o'rinbosar izomeriya", "positional isomerism", "cis", "trans", "fac", "mer",
        "koordinatsion kimyo", "Werner", "Jorgensen", "Chernyaev", "cisplatin",
        "Kurnakov", "trans effekt", "Rosenberg"
      ])

      // Yuklab olish
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `orinbosar_izomeriya_${currentComplex.id}_${new Date().toISOString().slice(0, 10)}.pdf`
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
  }, [currentComplex, pdfSections, pdfGenerating, isomerA, isomerB, isomerKeys])

  // ═══════════════════════════════════════════════════════════
  // 📚 IQTIBOS GENERATSIYA
  // ═══════════════════════════════════════════════════════════
  const generateCitation = () => {
    const year = new Date().getFullYear()
    const date = new Date().toLocaleDateString("uz-UZ")
    const url = "https://jdakimyo.uz/oquv/izomeriyasi/geometrik/orinbosar/3d"
    switch (citationFormat) {
      case "APA":
        return `Jaka-Kimyo. (${year}). O'rinbosar izomeriya — ${currentComplex.formula}: interaktiv 3D vizualizatsiya. jdakimyo.uz. Retrieved ${date}, from ${url}`
      case "MLA":
        return `"O'rinbosar izomeriya — ${currentComplex.formula}: Interaktiv 3D vizualizatsiya." Jaka-Kimyo, ${year}, ${url}. Accessed ${date}.`
      case "Chicago":
        return `Jaka-Kimyo. "O'rinbosar izomeriya — ${currentComplex.formula}: Interaktiv 3D vizualizatsiya." Accessed ${date}. ${url}.`
      case "BibTeX":
        return `@misc{jdakimyo${year}orinbosar,\n  author = {{Jaka-Kimyo}},\n  title = {O'rinbosar izomeriya --- ${currentComplex.formula}: interaktiv 3D vizualizatsiya},\n  year = {${year}},\n  url = {${url}},\n  note = {Accessed ${date}}\n}`
      default:
        return ""
    }
  }

  const copyToClipboard = (text) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => alert("Nusxalandi!"))
  }

  // ═══════════════════════════════════════════════════════════
  // 📊 UV-Vis SPEKTRI SVG (cis va trans yutilish farqi)
  // ═══════════════════════════════════════════════════════════
  const UVVisSVG = () => {
    const width = 260, height = 160, padding = 26
    const lmA = isomerA.lambdaMax
    const lmB = isomerB.lambdaMax
    const pointsA = []
    const pointsB = []
    for (let i = 0; i <= 60; i++) {
      const lam = 300 + (700 - 300) * (i / 60)
      const absA = Math.exp(-((lam - lmA) ** 2) / (2 * 40 ** 2))
      const absB = Math.exp(-((lam - lmB) ** 2) / (2 * 40 ** 2))
      const x = padding + (i / 60) * (width - 2 * padding)
      const y1 = height - padding - absA * (height - 2 * padding)
      const y2 = height - padding - absB * (height - 2 * padding)
      pointsA.push(`${x.toFixed(1)},${y1.toFixed(1)}`)
      pointsB.push(`${x.toFixed(1)},${y2.toFixed(1)}`)
    }
    const colorA = isomerKeys[0] === "cis" ? "#FFD700" : "#FF6EC7"
    const colorB = isomerKeys[1] === "trans" ? "#66CCFF" : "#50E3A4"
    return (
      <svg width={width} height={height} className="bg-purple-950/60 rounded-lg">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#666" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#666" strokeWidth="1" />
        <text x={padding - 6} y={height - padding + 2} fill="#999" fontSize="8" textAnchor="end">0</text>
        <text x={padding - 6} y={padding + 8} fill="#999" fontSize="7" textAnchor="end">A</text>
        <text x={width - padding} y={height - 4} fill="#999" fontSize="8" textAnchor="end">λ (nm)</text>
        <text x={padding} y={height - 4} fill="#999" fontSize="8">300</text>
        <text x={width - padding - 15} y={height - 4} fill="#999" fontSize="8">700</text>
        <polyline points={pointsA.join(" ")} fill="none" stroke={colorA} strokeWidth="2" />
        <polyline points={pointsB.join(" ")} fill="none" stroke={colorB} strokeWidth="2" />
        {/* Peak labels */}
        <line x1={padding + ((lmA - 300) / 400) * (width - 2 * padding)} y1={padding}
              x2={padding + ((lmA - 300) / 400) * (width - 2 * padding)} y2={height - padding}
              stroke={colorA} strokeWidth="0.5" strokeDasharray="2,2" opacity="0.5" />
        <text x={padding + ((lmA - 300) / 400) * (width - 2 * padding) + 3} y={padding + 10}
              fill={colorA} fontSize="8">{isomerA.label}: {lmA}nm</text>
        <line x1={padding + ((lmB - 300) / 400) * (width - 2 * padding)} y1={padding}
              x2={padding + ((lmB - 300) / 400) * (width - 2 * padding)} y2={height - padding}
              stroke={colorB} strokeWidth="0.5" strokeDasharray="2,2" opacity="0.5" />
        <text x={padding + ((lmB - 300) / 400) * (width - 2 * padding) + 3} y={padding + 22}
              fill={colorB} fontSize="8">{isomerB.label}: {lmB}nm</text>
      </svg>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // 📈 TRANS EFFEKTI QATORI SVG (Chernyaev)
  // ═══════════════════════════════════════════════════════════
  const TransEffectSVG = () => {
    const width = 280, height = 180
    const barHeight = 12
    const barGap = 1
    const startY = 8
    return (
      <svg width={width} height={height} className="bg-purple-950/60 rounded-lg">
        {TRANS_EFFECT.map((item, i) => {
          const barWidth = (item.strength / 10) * (width - 90)
          const yPos = startY + i * (barHeight + barGap)
          return (
            <g key={i}>
              <text x={80} y={yPos + 9} fill="#e5e7eb" fontSize="8" textAnchor="end">{item.ligand}</text>
              <rect x={85} y={yPos} width={barWidth} height={barHeight} fill={item.color} opacity="0.85" />
              <text x={85 + barWidth + 3} y={yPos + 9} fill="#9ca3af" fontSize="7">{item.strength}</text>
            </g>
          )
        })}
        <text x={width / 2} y={height - 3} fill="#c4b5fd" fontSize="8" textAnchor="middle" fontStyle="italic">Chernyaev (1926) — kuchayish tartibida</text>
      </svg>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // 🎨 UI HELPER KOMPONENTLAR
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
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // 🖼️ RENDER (JSX)
  // ═══════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen flex flex-col text-white bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950">

      {/* ═══════════════════ HEADER ═══════════════════ */}
      {!fullscreen && (
        <header className="flex items-center gap-3 px-4 py-3 bg-purple-950/90 backdrop-blur-md border-b border-purple-800/50 z-30">
          <Link href="/oquv/izomeriyasi/geometrik" className="text-purple-400 hover:text-purple-300">← Orqaga</Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-green-400 truncate">
              🔄 O'rinbosar izomeriya — 3D interaktiv laboratoriya
            </h1>
            <p className="text-purple-400 text-xs truncate">
              {isomerA.label} / {isomerB.label} izomerlar • {currentComplex.formula} • {currentComplex.geometry} • jdakimyo.uz
            </p>
          </div>

          <select
            value={complexId}
            onChange={(e) => setComplexId(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-purple-900/50 text-purple-200 border border-purple-700/50 hover:bg-purple-800/50 cursor-pointer"
          >
            <option value="CoNH3Cl2_oct">[Co(NH₃)₄Cl₂]⁺ (cis/trans)</option>
            <option value="PtNH3Cl2_sq">[Pt(NH₃)₂Cl₂] Cisplatin</option>
            <option value="CoNH3Cl3_facmer">[Co(NH₃)₃Cl₃] (fac/mer)</option>
          </select>

          <button onClick={() => setShowHistoryPanel(v => !v)} title="Tarixiy voqealar"
            className="p-2 rounded-lg text-sm bg-purple-900/50 text-purple-300 hover:bg-purple-800/50">📖</button>
          <button onClick={() => setShowCitationModal(true)} title="Iqtibos olish"
            className="p-2 rounded-lg text-sm bg-purple-900/50 text-purple-300 hover:bg-purple-800/50">📚</button>
          <button onClick={() => setShowPDFModal(true)} title="PDF ilmiy hisobot"
            className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg">
            📄 PDF
          </button>
          <button onClick={() => setFullscreen(true)} title="To'liq ekran (F)"
            className="p-2 rounded-lg text-sm bg-purple-900/50 text-purple-300 hover:bg-purple-800/50">🖥️</button>
        </header>
      )}

      {fullscreen && (
        <button onClick={() => setFullscreen(false)}
          className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-purple-900/80 text-white hover:bg-purple-800 backdrop-blur-md border border-purple-700/50">✕</button>
      )}

      {/* ═══════════════════ 3D CANVAS ═══════════════════ */}
      <div className="flex-1 w-full relative min-h-[500px]" style={{ minHeight: fullscreen ? "100vh" : "auto" }}>
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* ═══════════════════ BOSHQARUV PANELI (draggable) ═══════════════════ */}
        {!fullscreen && (
          <div className="absolute z-20 bg-purple-950/95 backdrop-blur-md rounded-xl border border-purple-700/50 w-[290px] shadow-2xl flex flex-col"
            style={{ left: panelPos.x, top: panelPos.y, maxHeight: "calc(100vh - 200px)" }}>
            <div onMouseDown={handlePanelMouseDown}
              className="cursor-grab active:cursor-grabbing bg-purple-900/60 hover:bg-purple-800/60 px-3 py-2 rounded-t-xl flex items-center justify-between border-b border-purple-800/50">
              <span className="text-sm font-bold text-purple-200">⋮⋮ 🎛️ Boshqaruv paneli</span>
              <span className="text-purple-400 text-xs">↕ ↔</span>
            </div>

            <div className="overflow-y-auto flex-1">
              {/* Ko'rinish */}
              <Section id="view" title="Ko'rinish" icon="🎨">
                <div className="flex gap-1">
                  {[{ v: "ball", l: "🔗", t: "Ball-stick" }, { v: "cpk", l: "⚪", t: "CPK" }, { v: "wire", l: "🕸️", t: "Sim" }].map(it => (
                    <button key={it.v} onClick={() => setViewMode(it.v)} title={it.t}
                      className={`flex-1 py-1.5 rounded text-sm ${viewMode === it.v ? "bg-green-500/30 border border-green-500/50" : "bg-purple-900/40 border border-purple-700/40"}`}>
                      {it.l}
                    </button>
                  ))}
                </div>
                <Toggle label="🏷️ Atom yorliqlari" value={showLabels} onChange={setShowLabels} />
                <Toggle label="🔄 Avto aylanish" value={autoRotate} onChange={setAutoRotate} />
                <Toggle label="📐 Bog' burchagi ma'lumoti" value={showBondAngles} onChange={setShowBondAngles}
                  note="cis: 90° | trans: 180°" />
              </Section>

              {/* Fizik xossalar */}
              <Section id="physical" title="Fizik xossalar" icon="⚡">
                <Toggle label="➡️ Dipol momenti vektori" value={showDipole} onChange={setShowDipole}
                  note={`${isomerA.label}: µ=${isomerA.dipole}D | ${isomerB.label}: µ=${isomerB.dipole}D`} />
                <Toggle label="🪞 Simmetriya elementlari" value={showSigma} onChange={setShowSigma}
                  note={`σ tekislik va C_n o'qlar`} />
              </Section>

              {/* Kimyoviy tahlil */}
              <Section id="chemistry" title="Kimyoviy tahlil" icon="🧪">
                <button onClick={() => setActivePanel("kurnakov")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  🔥 Kurnakov thiourea sinovi
                </button>
                <button onClick={() => setActivePanel("transEffect")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  📈 Trans-effekt (Chernyaev 1926)
                </button>
                <button onClick={() => setActivePanel("uvvis")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  📊 UV-Vis spektri
                </button>
              </Section>

              {/* Tibbiy va tarix */}
              <Section id="medical" title="Tibbiy ahamiyat" icon="🩺">
                <button onClick={() => setActivePanel("cisplatin")}
                  className="w-full px-2 py-1.5 rounded bg-pink-900/40 border border-pink-700/40 text-xs text-pink-200 hover:bg-pink-800/40">
                  💊 Cisplatin (Rosenberg 1965)
                </button>
                <button onClick={() => setActivePanel("statistics")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  📊 Statistik nisbat (4:1)
                </button>
              </Section>

              {/* Tarix */}
              <Section id="history" title="Tarixiy kontekst" icon="📜">
                <button onClick={() => setActivePanel("werner")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  ⚗️ Werner-Jorgensen bahsi (1893)
                </button>
                <button onClick={() => setShowHistoryPanel(true)}
                  className="w-full px-2 py-1.5 rounded bg-yellow-900/40 border border-yellow-700/40 text-xs text-yellow-200 hover:bg-yellow-800/40">
                  📖 To'liq xronologiya
                </button>
              </Section>

              {/* Ilmiy panel */}
              <Section id="science" title="Ilmiy tahlil" icon="🔬">
                <button onClick={() => setActivePanel("info")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  ℹ️ Kompleks ma'lumotlari
                </button>
                <button onClick={() => setActivePanel("symmetry")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40">
                  📐 Simmetriya tahlili
                </button>
              </Section>
            </div>
          </div>
        )}

        {/* ═══════════════════ MA'LUMOT PANELI (o'ng) ═══════════════════ */}
        {!fullscreen && activePanel && (
          <div className="absolute top-3 right-3 z-30 w-[310px] max-h-[calc(100vh-200px)] overflow-y-auto bg-purple-950/95 backdrop-blur-md rounded-xl border border-purple-700/50 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-green-400">
                {activePanel === "info" && "ℹ️ Kompleks ma'lumotlari"}
                {activePanel === "uvvis" && "📊 UV-Vis spektri"}
                {activePanel === "transEffect" && "📈 Trans-effekt qatori"}
                {activePanel === "kurnakov" && "🔥 Kurnakov sinovi"}
                {activePanel === "cisplatin" && "💊 Cisplatin (tibbiy)"}
                {activePanel === "werner" && "⚗️ Werner-Jorgensen"}
                {activePanel === "symmetry" && "📐 Simmetriya tahlili"}
                {activePanel === "statistics" && "📊 Statistik nisbat"}
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-lg leading-none">×</button>
            </div>

            {/* INFO */}
            {activePanel === "info" && (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-purple-400">Formula:</div>
                  <div className="text-white font-mono">{currentComplex.formula}</div>
                  <div className="text-purple-400">IUPAC:</div>
                  <div className="text-white">{currentComplex.name}</div>
                  <div className="text-purple-400">Geometriya:</div>
                  <div className="text-white">{currentComplex.geometry}</div>
                  <div className="text-purple-400">Koord. son:</div>
                  <div className="text-white">{currentComplex.coordinationNumber}</div>
                  <div className="text-purple-400">Gibridlanish:</div>
                  <div className="text-white">{currentComplex.hybridization}</div>
                  <div className="text-purple-400">Magnit:</div>
                  <div className="text-white">{currentComplex.magnetism}</div>
                  <div className="text-purple-400">M–ligand (Å):</div>
                  <div className="text-white">{currentComplex.bondLengthReal}</div>
                </div>
                <div className="pt-2 border-t border-purple-800/50">
                  <div className="text-purple-300 font-semibold mb-1">Izomer jufti:</div>
                  <div className="flex justify-between">
                    <span style={{ color: isomerKeys[0] === "cis" ? "#FFD700" : "#FF6EC7" }}>
                      {isomerA.label}: µ = {isomerA.dipole} D
                    </span>
                    <span style={{ color: isomerKeys[1] === "trans" ? "#66CCFF" : "#50E3A4" }}>
                      {isomerB.label}: µ = {isomerB.dipole} D
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-purple-800/50">
                  <div className="text-purple-300 italic">{currentComplex.scientificNotes}</div>
                </div>
              </div>
            )}

            {/* UV-Vis */}
            {activePanel === "uvvis" && (
              <div className="space-y-2 text-xs">
                <UVVisSVG />
                <div className="text-purple-200">
                  <strong>d–d o'tishlar</strong> — cis va trans turli simmetriya tufayli spektri ham farqli.
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <div>
                    <div style={{ color: isomerKeys[0] === "cis" ? "#FFD700" : "#FF6EC7" }} className="font-bold">{isomerA.label}</div>
                    <div className="text-purple-300">λmax = {isomerA.lambdaMax} nm</div>
                    <div className="text-purple-400">{isomerA.pointGroup} — past simmetriya</div>
                  </div>
                  <div>
                    <div style={{ color: isomerKeys[1] === "trans" ? "#66CCFF" : "#50E3A4" }} className="font-bold">{isomerB.label}</div>
                    <div className="text-purple-300">λmax = {isomerB.lambdaMax} nm</div>
                    <div className="text-purple-400">{isomerB.pointGroup} — yuqori simmetriya</div>
                  </div>
                </div>
              </div>
            )}

            {/* Trans effekt */}
            {activePanel === "transEffect" && (
              <div className="space-y-2 text-xs text-purple-200">
                <div className="bg-blue-950/30 rounded p-2 border border-blue-700/40">
                  <div className="text-blue-400 font-bold">Chernyaev (1926) — Moskva</div>
                  <div className="text-purple-300 text-[11px]">Rus koordinatsion kimyo maktabining klassik hissasi</div>
                </div>
                <TransEffectSVG />
                <p>Kuchli trans-effekt beruvchi ligand o'ziga <b>qarama-qarshi</b> pozitsiyadagi ligandni tez almashtiradi. Bu — selektiv sintez asosi.</p>
                <div className="bg-purple-900/40 rounded p-2 text-[11px]">
                  <b>Amaliy misol:</b> K₂[PtCl₄] + 2 NH₃ → cis-[Pt(NH₃)₂Cl₂]. Cl ning trans-effekti NH₃ dan kuchli — birinchi NH₃ ni ikkinchisi qo'shni pozitsiyaga majburlaydi.
                </div>
              </div>
            )}

            {/* Kurnakov */}
            {activePanel === "kurnakov" && (
              <div className="space-y-2 text-xs text-purple-200">
                <div className="bg-yellow-950/30 rounded p-2 border border-yellow-700/40">
                  <div className="text-yellow-400 font-bold">🔥 Kurnakov sinovi (1893)</div>
                  <div className="text-purple-300 text-[11px]">cis vs trans farqlash — 30 daqiqada</div>
                </div>
                <p>
                  Thiourea (SC(NH₂)₂) kuchli trans-effektga ega. cis va trans izomerlarda turli reaksiya beradi:
                </p>
                <div className="bg-purple-900/40 rounded p-2 font-mono text-[10px]">
                  cis: [Pt(NH₃)₂Cl₂] + 4 tu → [Pt(tu)₄]²⁺ + 2 NH₃ + 2 Cl⁻<br />
                  trans: [Pt(NH₃)₂Cl₂] + 2 tu → trans-[Pt(NH₃)₂(tu)₂]²⁺ + 2 Cl⁻
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div className="bg-yellow-900/30 p-1.5 rounded">
                    <div className="text-yellow-400 font-bold">cis natija</div>
                    <div>To'q sariq, 4 tu</div>
                  </div>
                  <div className="bg-blue-900/30 p-1.5 rounded">
                    <div className="text-blue-400 font-bold">trans natija</div>
                    <div>Och sariq, 2 tu</div>
                  </div>
                </div>
              </div>
            )}

            {/* Cisplatin */}
            {activePanel === "cisplatin" && (
              <div className="space-y-2 text-xs text-purple-200">
                <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded p-2 border border-green-700/40">
                  <div className="text-green-400 font-bold">💊 Cisplatin — koordinatsion tibbiyot</div>
                  <div className="text-purple-300 text-[11px]">Barnett Rosenberg (1965), FDA 1978</div>
                </div>
                <p>
                  cis-[Pt(NH₃)₂Cl₂] tasodifan kashf etilgan va bugun rak davolashda inqilob qilgan dori. Tuxumdon, moyak, o'pka, ko'krak raki uchun.
                </p>
                <div className="bg-purple-900/40 rounded p-2 text-[11px]">
                  <b>Mexanizm:</b><br />
                  1) Qonda Cl⁻ ko'p → dori barqaror<br />
                  2) Hujayrada Cl⁻ kam → Cl⁻ H₂O ga almashinadi<br />
                  3) [Pt(NH₃)₂(H₂O)₂]²⁺ → DNK guanin N7 bilan bog'lanadi<br />
                  4) DNK cross-link → replikatsiya to'xtaydi<br />
                  5) Apoptoz (hujayra o'limi)
                </div>
                <div className="bg-red-900/30 p-2 rounded border border-red-700/40 text-[11px]">
                  <b className="text-red-400">MUHIM:</b> trans-izomer DAVO EMAS! Bir xil formula, lekin geometriya to'g'ri kelmaydi — DNK bilan to'g'ri cross-link tuza olmaydi.
                </div>
              </div>
            )}

            {/* Werner */}
            {activePanel === "werner" && (
              <div className="space-y-2 text-xs text-purple-200">
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded p-2 border border-yellow-700/40">
                  <div className="text-yellow-400 font-bold">🏆 Werner-Jorgensen bahsi</div>
                  <div className="text-purple-300 text-[11px]">20 yillik ilmiy tortishuv (1893-1913)</div>
                </div>
                <div className="bg-purple-900/40 rounded p-2 border-l-2 border-purple-400">
                  <div className="text-purple-300 font-bold">Werner (Zurich)</div>
                  <div>Koordinatsion nazariya: [Co(NH₃)₄Cl₂]Cl uchun 2 ta izomer (cis va trans) bo'lishi kerak</div>
                </div>
                <div className="bg-orange-900/40 rounded p-2 border-l-2 border-orange-400">
                  <div className="text-orange-300 font-bold">Jorgensen (Kopengagen)</div>
                  <div>Zanjir (Kette) nazariyasi: faqat 1 ta izomer bo'lishi kerak</div>
                </div>
                <p>1907: Werner cis-violeo va trans-praseo izomerlarini alohida ajratdi — bahs hal bo'ldi.</p>
                <p>1913: Werner Nobel mukofotini oldi. Jorgensen (1908 vafot) uning eksperimental aniqligi hurmat qilindi.</p>
              </div>
            )}

            {/* Simmetriya */}
            {activePanel === "symmetry" && (
              <div className="space-y-2 text-xs text-purple-200">
                <p>Har bir izomer o'z nuqta guruhiga ega. Bu simmetriya tekislik va o'qlar sonini belgilaydi.</p>
                <div className="grid grid-cols-2 gap-2">
                  <div style={{ backgroundColor: isomerKeys[0] === "cis" ? "#FFD70020" : "#FF6EC720" }} className="p-2 rounded border" >
                    <div style={{ color: isomerKeys[0] === "cis" ? "#FFD700" : "#FF6EC7" }} className="font-bold">{isomerA.label}</div>
                    <div>Guruh: {isomerA.pointGroup}</div>
                    <div>σ tekislik: {isomerA.sigmaCount}</div>
                    <div>µ = {isomerA.dipole} D</div>
                  </div>
                  <div style={{ backgroundColor: isomerKeys[1] === "trans" ? "#66CCFF20" : "#50E3A420" }} className="p-2 rounded border">
                    <div style={{ color: isomerKeys[1] === "trans" ? "#66CCFF" : "#50E3A4" }} className="font-bold">{isomerB.label}</div>
                    <div>Guruh: {isomerB.pointGroup}</div>
                    <div>σ tekislik: {isomerB.sigmaCount}</div>
                    <div>µ = {isomerB.dipole} D</div>
                  </div>
                </div>
                <div className="bg-purple-900/40 rounded p-2 text-[11px]">
                  <b>Xulosa:</b> {isomerB.pointGroup} yuqoriroq simmetriya ({isomerB.sigmaCount} σ tekislik) — µ = 0 (apolyar). {isomerA.label} esa polyar (µ ≠ 0).
                </div>
              </div>
            )}

            {/* Statistik */}
            {activePanel === "statistics" && (
              <div className="space-y-2 text-xs text-purple-200">
                <p>Oktaedrda 6 ta pozitsiyadan 2 tasini tanlash — C(6,2) = 15 usul:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-yellow-900/30 p-2 rounded border border-yellow-700/40">
                    <div className="text-yellow-400 font-bold">cis: 12/15</div>
                    <div className="text-2xl font-black text-yellow-300">80%</div>
                    <div className="text-[10px]">qo'shni juftlar</div>
                  </div>
                  <div className="bg-blue-900/30 p-2 rounded border border-blue-700/40">
                    <div className="text-blue-400 font-bold">trans: 3/15</div>
                    <div className="text-2xl font-black text-blue-300">20%</div>
                    <div className="text-[10px]">qarshi juftlar</div>
                  </div>
                </div>
                <div className="text-center py-2 text-purple-200">
                  Statistik nisbat <b className="text-yellow-400 text-lg">cis : trans = 4 : 1</b>
                </div>
                <p className="text-[11px] italic text-purple-300">
                  Termodinamik nazorat (yuqori T) — barqarorroq izomer ustunlik qiladi. Trans-effekt orqali esa maqsadli izomer tanlab olinishi mumkin.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ TARIX PANELI ═══════════════════ */}
        {showHistoryPanel && !fullscreen && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-2xl max-h-[50vh] overflow-y-auto bg-purple-950/95 backdrop-blur-md rounded-xl border border-yellow-700/50 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-yellow-400">📖 O'rinbosar izomeriya tarixi</h3>
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
            🖱️ aylanish · 🔍 zoom · <b>F</b> to'liq · <b>D</b> dipol · <b>S</b> σ tekislik · <b>B</b> burchak · <b>1/2/3</b> kompleks
          </div>
        )}
      </div>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      {!fullscreen && (
        <div className="bg-purple-950/90 backdrop-blur-md border-t border-purple-800/50 z-10">
          <div className="flex justify-center gap-3 sm:gap-6 py-2 px-3 sm:px-6 flex-wrap text-xs">
            <div className="flex flex-col items-center">
              <span className="text-purple-400 text-[10px]">Geometriya</span>
              <span className="text-white font-bold">{currentComplex.geometry}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-purple-400 text-[10px]">Koord. son</span>
              <span className="text-white font-bold">{currentComplex.coordinationNumber}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-purple-400 text-[10px]">Gibridlanish</span>
              <span className="text-white font-bold">{currentComplex.hybridization}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-purple-400 text-[10px]">µ ({isomerA.label})</span>
              <span style={{ color: isomerKeys[0] === "cis" ? "#FFD700" : "#FF6EC7" }} className="font-bold">{isomerA.dipole} D</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-purple-400 text-[10px]">µ ({isomerB.label})</span>
              <span style={{ color: isomerKeys[1] === "trans" ? "#66CCFF" : "#50E3A4" }} className="font-bold">{isomerB.dipole} D</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-purple-400 text-[10px]">Δo</span>
              <span className="text-white font-bold">{currentComplex.dOrbital.deltaO} cm⁻¹</span>
            </div>
          </div>
          <div className="flex justify-center gap-3 sm:gap-5 py-2 px-4 bg-purple-950/60 border-t border-purple-800/30 flex-wrap text-[11px]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: `#${currentComplex.center.color.toString(16).padStart(6, '0')}` }} />
              <span className="text-purple-300">{currentComplex.center.element} (markaz)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#3050F8" }} />
              <span className="text-purple-300">N (NH₃ donor)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#FFFFFF", border: "1px solid #666" }} />
              <span className="text-purple-300">H (NH₃)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#1FF01F" }} />
              <span className="text-purple-300">Cl (ligand)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#FFAA00" }} />
              <span className="text-purple-300">Dipol vektori</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#FFD700" }} />
              <span className="text-purple-300">Simmetriya elementi</span>
            </div>
          </div>
          <div className="text-center py-2 px-4 bg-purple-950/40 border-t border-purple-800/20 text-[11px] text-purple-400 italic">
            {currentComplex.formula} • {currentComplex.geometry} • {isomerA.label}/{isomerB.label} izomer jufti • Werner (1893), Chernyaev (1926), Rosenberg (1965)
          </div>
        </div>
      )}

      {/* ═══════════════════ PDF MODAL ═══════════════════ */}
      {showPDFModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-950 to-indigo-950 rounded-2xl border border-purple-700/50 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-purple-800/50">
              <div>
                <h2 className="text-lg font-bold text-green-400">📄 Ilmiy Hisobot — PDF eksport</h2>
                <p className="text-purple-400 text-xs">O'rinbosar izomeriya: {currentComplex.formula}</p>
              </div>
              <button onClick={() => setShowPDFModal(false)} className="text-purple-400 hover:text-purple-200 text-2xl leading-none">×</button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <button onClick={() => setPdfSections({
                  intro: true, wernerJorgensen: true, isomerTypes: true, cisPlatin: false,
                  kurnakov: false, transEffect: false, statistics: true, uvvis: true,
                  table: true, applications: false, references: true
                })} className="flex-1 px-3 py-1.5 rounded text-xs bg-purple-800/40 text-purple-200 border border-purple-700/50 hover:bg-purple-700/40">Standart</button>
                <button onClick={() => setPdfSections({
                  intro: true, wernerJorgensen: true, isomerTypes: true, cisPlatin: true,
                  kurnakov: true, transEffect: true, statistics: true, uvvis: true,
                  table: true, applications: true, references: true
                })} className="flex-1 px-3 py-1.5 rounded text-xs bg-gradient-to-r from-purple-700 to-pink-700 text-white font-semibold">To'liq (ilmiy)</button>
                <button onClick={() => setPdfSections({
                  intro: false, wernerJorgensen: false, isomerTypes: false, cisPlatin: false,
                  kurnakov: false, transEffect: false, statistics: false, uvvis: false,
                  table: false, applications: false, references: false
                })} className="flex-1 px-3 py-1.5 rounded text-xs bg-red-900/30 text-red-300 border border-red-700/40 hover:bg-red-800/40">Tozalash</button>
              </div>

              <div className="text-xs text-purple-300 uppercase font-bold pt-2">Bo'limlarni tanlang:</div>
              {[
                { k: "intro", l: "1. 📖 Kirish — o'rinbosar izomeriya nima?" },
                { k: "wernerJorgensen", l: "2. ⚗️ Werner-Jorgensen tarixiy bahsi (1893)" },
                { k: "isomerTypes", l: "3. 🧬 Izomer turlari va geometriya" },
                { k: "cisPlatin", l: "4. 💊 Cisplatin — tibbiy mo''jiza" },
                { k: "kurnakov", l: "5. 🔥 Kurnakov sinovi (thiourea test)" },
                { k: "transEffect", l: "6. 📈 Trans effekti — Chernyaev qonuni (1926)" },
                { k: "statistics", l: "7. 📊 Statistik va termodinamik ehtimol" },
                { k: "uvvis", l: "8. 📡 UV-Vis spektroskopiya" },
                { k: "table", l: `9. 📋 ${isomerA.label} vs ${isomerB.label} solishtirish jadvali` },
                { k: "applications", l: "10. 🚀 Amaliy qo'llanilishi" },
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

      {/* ═══════════════════ CITATION MODAL ═══════════════════ */}
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
