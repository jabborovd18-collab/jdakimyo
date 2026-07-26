"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

// ═══════════════════════════════════════════════════════════════════════════
// CPK RANGLARI (IUPAC standartlari)
// ═══════════════════════════════════════════════════════════════════════════
const CPK = {
  Co: 0xF090A0, Cr: 0x8A99C7, N: 0x3050F8, C: 0x909090,
  H: 0xFFFFFF, O: 0xFF0D0D, Cl: 0x1FF01F, K: 0x8F40D4,
  bond: 0x8B9DC3, hbond: 0x66CCFF,
  lambda: 0x48DBFB,   // Λ — ko'k (chap qo'l)
  delta: 0xF368E0,    // Δ — pushti (o'ng qo'l)
  polarized: 0xFFD700 // Qutblangan yorug'lik — oltin sariq
}

// ═══════════════════════════════════════════════════════════════════════════
// XIRAL KOMPLEKSLAR DATABASE (optik izomerlar)
// ═══════════════════════════════════════════════════════════════════════════
const COMPLEXES = {
  Coen3: {
    id: "Coen3",
    formula: "[Co(en)₃]³⁺",
    fullSalt: "[Co(en)₃]Cl₃",
    name: "Tris(etilendiamin)kobalt(III) xlorid",
    latinName: "trichlorido tris(ethylenediamine)cobalt(III)",
    center: { element: "Co", color: CPK.Co, radius: 0.42, charge: "+3" },
    ligand: { type: "en", donor: "N", donorColor: CPK.N, donorRadius: 0.26 },
    bondLength: 1.99, bondLengthReal: "1.98 Å",
    outerIon: { element: "Cl", color: CPK.Cl, radius: 0.30, charge: "-1", count: 3 },
    hybridization: "d²sp³", magnetism: "Diamagnit",
    color: "To'q sariq-jigarrang kristall",
    geometry: "Oktaedrik (buralgan)", symmetry: "D₃",
    dOrbital: { tg: 6, eg: 0, type: "LS", deltaO: 23200 },
    dElectrons: 6,
    chirality: { hasEnantiomers: true, type: "Λ / Δ", pointGroup: "D₃", sigmaCount: 0, sn: "yo'q" },
    optical: {
      alphaD_lambda: -158, // sof Λ enantiomer uchun [α]D (°·mL/g·dm)
      alphaD_delta: +158,
      wavelength: 589,      // Na D chizig'i
      cdMax: { lambda: 490, delta: 490, sign_lambda: "-", sign_delta: "+" },
      firstResolved: "Werner (1911)",
      resolutionMethod: "Diastereomer kristallizatsiya (d-tartrat)"
    },
    scientificNotes: "Alfred Werner tomonidan 1911-yilda birinchi marta ajratilgan — koordinatsion birikmalarda xirallikning tarixiy isboti. 1913-yil Nobel mukofoti asosi."
  },
  cisCoen2Cl2: {
    id: "cisCoen2Cl2",
    formula: "cis-[Co(en)₂Cl₂]⁺",
    fullSalt: "cis-[Co(en)₂Cl₂]Cl",
    name: "cis-Dixlorido bis(etilendiamin)kobalt(III) xlorid",
    latinName: "cis-dichlorido bis(ethylenediamine)cobalt(III)",
    center: { element: "Co", color: CPK.Co, radius: 0.42, charge: "+3" },
    ligand: { type: "en", donor: "N", donorColor: CPK.N, donorRadius: 0.26 },
    extraLigand: { type: "Cl", color: CPK.Cl, radius: 0.30, count: 2 },
    bondLength: 1.98, bondLengthReal: "Co–N: 1.97 Å, Co–Cl: 2.27 Å",
    outerIon: { element: "Cl", color: CPK.Cl, radius: 0.30, charge: "-1", count: 1 },
    hybridization: "d²sp³", magnetism: "Diamagnit",
    color: "Violet-siyoh rangli kristall",
    geometry: "Oktaedrik (cis)", symmetry: "C₂",
    dOrbital: { tg: 6, eg: 0, type: "LS", deltaO: 22300 },
    dElectrons: 6,
    chirality: { hasEnantiomers: true, type: "Λ / Δ", pointGroup: "C₂", sigmaCount: 0, sn: "yo'q" },
    optical: {
      alphaD_lambda: -680, // yuqoriroq — kuchli optik faol
      alphaD_delta: +680,
      wavelength: 589,
      cdMax: { lambda: 540, delta: 540, sign_lambda: "-", sign_delta: "+" },
      firstResolved: "Werner (1911) — Xolat: Cl⁻ ligand asosidagi ilk xiral kompleks",
      resolutionMethod: "α-bromokamfora-π-sulfonat bilan diastereomer"
    },
    scientificNotes: "cis-izomer xiral (C₂ o'q), lekin trans-izomer axiral (σh tekislik mavjud). Bu geometrik va optik izomeriya birgalikda namoyon bo'lishining klassik namunasi.",
    hasTransIsomer: true
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁷ 4s²", oxidation: "+3", role: "Markaziy stereogenik ion", color: "#F090A0" },
  Cr: { name: "Xrom (Cr)", atomic: 24, mass: "52.00 u", config: "[Ar] 3d⁵ 4s¹", oxidation: "+3", role: "Markaziy stereogenik ion", color: "#8A99C7" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "En ligand donor atomi", hybridization: "sp³", color: "#3050F8" },
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.01 u", config: "[He] 2s² 2p²", role: "En ko'prik atomi (–CH₂–)", hybridization: "sp³", color: "#909090" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "En/NH tarkibi", color: "#FFFFFF" },
  Cl: { name: "Xlor (Cl⁻)", atomic: 17, mass: "35.45 u", config: "[Ne] 3s² 3p⁶", charge: "-1", role: "Ligand / tashqi sfera", color: "#1FF01F" }
}

// ═══════════════════════════════════════════════════════════════════════════
// TARIXIY VOQEALAR (Werner, Pasteur, Bijvoet, Talidomid)
// ═══════════════════════════════════════════════════════════════════════════
const HISTORY = [
  {
    year: 1848, hero: "Louis Pasteur",
    title: "Natriy-ammoniy tartrat kristallarini qo'lda ajratish",
    text: "Pasteur mikroskop ostida tartrat kristallarini shaklidagi kichik farq bo'yicha (chap va o'ng qo'l shakli) qo'lda pintset yordamida ajratdi. Bu — xirallik borligining birinchi eksperimental isboti."
  },
  {
    year: 1874, hero: "Van 't Hoff & Le Bel",
    title: "Tetraedrik uglerod nazariyasi",
    text: "Ikkala olim mustaqil ravishda 4 xil ligandli uglerodning xiral markaz ekanligini bashorat qildi. Bu — stereokimyoning zamonaviy asosi."
  },
  {
    year: 1911, hero: "Alfred Werner",
    title: "[Co(en)₃]³⁺ ni Λ va Δ ga ajratish",
    text: "Werner o'zining maktabi (Zurich) bilan birga [Co(en)₃]³⁺ kompleksini d-tartrat kislotasi orqali diastereomer kristallizatsiya usulida ajratdi. Bu koordinatsion birikmalarda xirallik borligini isbotladi va uglerodsiz xirallik nazariyasini yaratdi."
  },
  {
    year: 1913, hero: "Werner (Nobel mukofoti)",
    title: "Koordinatsion nazariya uchun Nobel mukofoti",
    text: "Werner koordinatsion birikmalar strukturasi va xirallik bo'yicha ishlari uchun Kimyo bo'yicha Nobel mukofotini oldi. Bu koordinatsion kimyoning mustaqil fan sifatida tug'ilishini belgiladi."
  },
  {
    year: 1951, hero: "J. M. Bijvoet",
    title: "Absolyut konfiguratsiya — anomal X-nur difraksiyasi",
    text: "Bijvoet Amsterdam laboratoriyasida natriy rubidiy tartrat kristali uchun anomal X-nur difraksiyasi usulida (Zn Kα nur) enantiomerning haqiqiy absolyut konfiguratsiyasini birinchi marta aniqladi. Bundan avval R/S va Λ/Δ belgilari faqat nisbiy edi."
  },
  {
    year: 1957, hero: "Talidomid halokati",
    title: "Talidomid — enantiomer farqi hayotiy",
    text: "Talidomid rasemik dori sifatida homilador ayollarga tinchlantiruvchi sifatida berildi. R-enantiomer terapevtik, lekin S-enantiomer teratogen bo'lib chiqdi — 10 000+ chaqaloq fokomeliya bilan tug'ildi. Bu enantiomerlarning biologik farqini ko'rsatuvchi dahshatli dars."
  },
  {
    year: 1966, hero: "Cahn, Ingold, Prelog",
    title: "CIP nomenklaturasi (R/S, Λ/Δ)",
    text: "IUPAC uchun xiral markazlarni bir ma'noli belgilash algoritmi joriy etildi. Koordinatsion birikmalar uchun keyinchalik Λ (chap propeller) va Δ (o'ng propeller) belgilari standartlashtirildi."
  },
  {
    year: 2005, hero: "IUPAC Red Book",
    title: "Koordinatsion birikmalar nomenklaturasi (rasmiy)",
    text: "IUPAC koordinatsion kimyo uchun rasmiy tavsiya nashr etdi (Nomenclature of Inorganic Chemistry — IUPAC Recommendations 2005): stereodesкriptорlar Λ/Δ tris-xelatlar uchun, C/A ikki xelatlar uchun."
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

// ═══════════════════════════════════════════════════════════════════════════
// 3D MATN SPRITE — namunadagidek
// ═══════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════
// XIRAL KOMPLEKS QURUVCHISI ([Co(en)₃]³⁺ — Λ yoki Δ)
// ═══════════════════════════════════════════════════════════════════════════
function buildCoen3(scene, centerPos, chirality, opts = {}) {
  // chirality: -1 (Λ), +1 (Δ)
  const { scale = 1, showLabels = false, groupRef = null } = opts
  const group = new THREE.Group()
  const dist = 1.35 * scale

  // Markaziy Co atomi
  const centerGeo = new THREE.SphereGeometry(0.38 * scale, 32, 32)
  const centerMat = new THREE.MeshStandardMaterial({
    color: CPK.Co, roughness: 0.3, metalness: 0.7,
    emissive: CPK.Co, emissiveIntensity: 0.15
  })
  const coAtom = new THREE.Mesh(centerGeo, centerMat)
  group.add(coAtom)

  // Glow
  const glowGeo = new THREE.SphereGeometry(0.5 * scale, 32, 32)
  const glowMat = new THREE.MeshBasicMaterial({
    color: CPK.Co, transparent: true, opacity: 0.12
  })
  group.add(new THREE.Mesh(glowGeo, glowMat))

  // 3 ta en ligand — propeller sxemasi (D₃ simmetriya)
  const nAtoms = []
  const cAtoms = []
  for (let k = 0; k < 3; k++) {
    const theta = (k * 2 * Math.PI) / 3
    const h = dist * 0.62
    const r = dist * 0.85
    const twist = chirality * (Math.PI / 3) // propeller yo'nalishi

    const n1 = new THREE.Vector3(
      r * Math.cos(theta), +h, r * Math.sin(theta)
    )
    const n2 = new THREE.Vector3(
      r * Math.cos(theta + twist), -h, r * Math.sin(theta + twist)
    )

    // N atomlari
    ;[n1, n2].forEach(pos => {
      const nGeo = new THREE.SphereGeometry(0.22 * scale, 24, 24)
      const nMat = new THREE.MeshStandardMaterial({
        color: CPK.N, roughness: 0.4, metalness: 0.3
      })
      const nMesh = new THREE.Mesh(nGeo, nMat)
      nMesh.position.copy(pos)
      group.add(nMesh)
      nAtoms.push(nMesh)

      // Co-N bog'i
      addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x444488, 0.04 * scale)
    })

    // Etilendiamin ko'prigi (N-CH₂-CH₂-N)
    const dir = new THREE.Vector3().subVectors(n2, n1)
    const bondLen = dir.length()
    dir.normalize()
    const c1 = new THREE.Vector3().copy(n1).add(dir.clone().multiplyScalar(bondLen / 3))
    const c2 = new THREE.Vector3().copy(n1).add(dir.clone().multiplyScalar((2 * bondLen) / 3))

    ;[c1, c2].forEach(pos => {
      const cGeo = new THREE.SphereGeometry(0.14 * scale, 20, 20)
      const cMat = new THREE.MeshStandardMaterial({
        color: 0x1A1A1A, roughness: 0.5, metalness: 0.2
      })
      const cMesh = new THREE.Mesh(cGeo, cMat)
      cMesh.position.copy(pos)
      group.add(cMesh)
      cAtoms.push(cMesh)
    })

    addBondToGroup(group, n1, c1, 0x446688, 0.035 * scale)
    addBondToGroup(group, c1, c2, 0x446688, 0.035 * scale)
    addBondToGroup(group, c2, n2, 0x446688, 0.035 * scale)
  }

  // Propeller vizual yo'nalish halqasi
  const ringColor = chirality > 0 ? CPK.delta : CPK.lambda
  const ringGeo = new THREE.TorusGeometry(dist * 0.85, 0.012 * scale, 8, 64)
  const ringMat = new THREE.MeshBasicMaterial({
    color: ringColor, transparent: true, opacity: 0.35
  })
  const ring1 = new THREE.Mesh(ringGeo, ringMat.clone())
  ring1.position.y = dist * 0.62
  ring1.rotation.x = Math.PI / 2
  group.add(ring1)
  const ring2 = new THREE.Mesh(ringGeo, ringMat.clone())
  ring2.position.y = -dist * 0.62
  ring2.rotation.x = Math.PI / 2
  group.add(ring2)

  // C₃ simmetriya o'qi (vertikal chiziq)
  const axisGeo = new THREE.CylinderGeometry(0.008 * scale, 0.008 * scale, 3.5 * scale, 8)
  const axisMat = new THREE.MeshBasicMaterial({
    color: 0xFFD700, transparent: true, opacity: 0.5
  })
  const axis = new THREE.Mesh(axisGeo, axisMat)
  group.add(axis)

  group.position.copy(centerPos)
  scene.add(group)
  if (groupRef) groupRef.current = group
  return { group, coAtom, nAtoms, cAtoms }
}

// ═══════════════════════════════════════════════════════════════════════════
// XIRAL KOMPLEKS QURUVCHISI (cis-[Co(en)₂Cl₂]⁺ — Λ yoki Δ)
// ═══════════════════════════════════════════════════════════════════════════
function buildCisCoen2Cl2(scene, centerPos, chirality, opts = {}) {
  const { scale = 1, groupRef = null } = opts
  const group = new THREE.Group()
  const dist = 1.35 * scale

  // Co markaz
  const centerGeo = new THREE.SphereGeometry(0.38 * scale, 32, 32)
  const centerMat = new THREE.MeshStandardMaterial({
    color: CPK.Co, roughness: 0.3, metalness: 0.7,
    emissive: CPK.Co, emissiveIntensity: 0.15
  })
  group.add(new THREE.Mesh(centerGeo, centerMat))

  // Glow
  const glowGeo = new THREE.SphereGeometry(0.5 * scale, 32, 32)
  const glowMat = new THREE.MeshBasicMaterial({
    color: CPK.Co, transparent: true, opacity: 0.12
  })
  group.add(new THREE.Mesh(glowGeo, glowMat))

  // Oktaedrik 6 pozitsiya (+x, -x, +y, -y, +z, -z)
  // 2 ta Cl — cis pozitsiyada (+x, +y)
  // 2 ta en ligand (har biri 2 ta N) — qolgan 4 pozitsiya
  // chirality Λ/Δ — en larning aylanish yo'nalishi orqali
  const clPositions = [
    new THREE.Vector3(+dist, 0, 0),
    new THREE.Vector3(0, +dist, 0)
  ]
  const nPositions = chirality > 0
    ? [ // Δ: (-x,-y bilan en1), (-z,+z bilan en2 buralgan)
        [new THREE.Vector3(-dist, 0, 0), new THREE.Vector3(0, 0, +dist)],
        [new THREE.Vector3(0, -dist, 0), new THREE.Vector3(0, 0, -dist)]
      ]
    : [ // Λ: oyna aksi
        [new THREE.Vector3(-dist, 0, 0), new THREE.Vector3(0, 0, -dist)],
        [new THREE.Vector3(0, -dist, 0), new THREE.Vector3(0, 0, +dist)]
      ]

  // Cl atomlari
  clPositions.forEach(pos => {
    const clGeo = new THREE.SphereGeometry(0.28 * scale, 24, 24)
    const clMat = new THREE.MeshStandardMaterial({
      color: CPK.Cl, roughness: 0.4, metalness: 0.3
    })
    const clMesh = new THREE.Mesh(clGeo, clMat)
    clMesh.position.copy(pos)
    group.add(clMesh)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x448844, 0.04 * scale)
  })

  // en ligandlari (2 ta)
  nPositions.forEach(([n1, n2]) => {
    ;[n1, n2].forEach(pos => {
      const nGeo = new THREE.SphereGeometry(0.22 * scale, 24, 24)
      const nMat = new THREE.MeshStandardMaterial({
        color: CPK.N, roughness: 0.4, metalness: 0.3
      })
      const nMesh = new THREE.Mesh(nGeo, nMat)
      nMesh.position.copy(pos)
      group.add(nMesh)
      addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x444488, 0.04 * scale)
    })

    // en ko'prigi (N-CH₂-CH₂-N) — n1 va n2 orasida
    const dir = new THREE.Vector3().subVectors(n2, n1)
    const bondLen = dir.length()
    dir.normalize()
    const c1 = new THREE.Vector3().copy(n1).add(dir.clone().multiplyScalar(bondLen / 3))
    const c2 = new THREE.Vector3().copy(n1).add(dir.clone().multiplyScalar((2 * bondLen) / 3))

    ;[c1, c2].forEach(pos => {
      const cGeo = new THREE.SphereGeometry(0.14 * scale, 20, 20)
      const cMat = new THREE.MeshStandardMaterial({
        color: 0x1A1A1A, roughness: 0.5, metalness: 0.2
      })
      const cMesh = new THREE.Mesh(cGeo, cMat)
      cMesh.position.copy(pos)
      group.add(cMesh)
    })

    addBondToGroup(group, n1, c1, 0x446688, 0.035 * scale)
    addBondToGroup(group, c1, c2, 0x446688, 0.035 * scale)
    addBondToGroup(group, c2, n2, 0x446688, 0.035 * scale)
  })

  // C₂ simmetriya o'qi (Co orqali Cl-Cl bissektrisasi)
  const c2Dir = new THREE.Vector3(1, 1, 0).normalize()
  const axisGeo = new THREE.CylinderGeometry(0.008 * scale, 0.008 * scale, 3.0 * scale, 8)
  const axisMat = new THREE.MeshBasicMaterial({
    color: 0xFFD700, transparent: true, opacity: 0.5
  })
  const axis = new THREE.Mesh(axisGeo, axisMat)
  axis.setRotationFromQuaternion(
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), c2Dir)
  )
  group.add(axis)

  group.position.copy(centerPos)
  scene.add(group)
  if (groupRef) groupRef.current = group
  return { group }
}

// ═══════════════════════════════════════════════════════════════════════════
// TRANS-[Co(en)₂Cl₂]⁺ (axial-axial Cl-lar) — AXIRAL (σh mavjud)
// Bu qism trans ni Ko'rsatib, taqqoslash uchun
// ═══════════════════════════════════════════════════════════════════════════
function buildTransCoen2Cl2(scene, centerPos, opts = {}) {
  const { scale = 1 } = opts
  const group = new THREE.Group()
  const dist = 1.35 * scale

  // Co
  const centerMat = new THREE.MeshStandardMaterial({
    color: CPK.Co, roughness: 0.3, metalness: 0.7,
    emissive: CPK.Co, emissiveIntensity: 0.15
  })
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.38 * scale, 32, 32), centerMat))

  // Cl atomlari — trans (yuqori va past)
  ;[new THREE.Vector3(0, +dist, 0), new THREE.Vector3(0, -dist, 0)].forEach(pos => {
    const clMat = new THREE.MeshStandardMaterial({
      color: CPK.Cl, roughness: 0.4, metalness: 0.3
    })
    const clMesh = new THREE.Mesh(new THREE.SphereGeometry(0.28 * scale, 24, 24), clMat)
    clMesh.position.copy(pos)
    group.add(clMesh)
    addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x448844, 0.04 * scale)
  })

  // 2 ta en ekvatorial tekislikda
  const enPairs = [
    [new THREE.Vector3(+dist, 0, 0), new THREE.Vector3(0, 0, +dist)],
    [new THREE.Vector3(-dist, 0, 0), new THREE.Vector3(0, 0, -dist)]
  ]
  enPairs.forEach(([n1, n2]) => {
    ;[n1, n2].forEach(pos => {
      const nMat = new THREE.MeshStandardMaterial({
        color: CPK.N, roughness: 0.4, metalness: 0.3
      })
      const nMesh = new THREE.Mesh(new THREE.SphereGeometry(0.22 * scale, 24, 24), nMat)
      nMesh.position.copy(pos)
      group.add(nMesh)
      addBondToGroup(group, new THREE.Vector3(0, 0, 0), pos, 0x444488, 0.04 * scale)
    })
    const dir = new THREE.Vector3().subVectors(n2, n1)
    const bondLen = dir.length()
    dir.normalize()
    const c1 = new THREE.Vector3().copy(n1).add(dir.clone().multiplyScalar(bondLen / 3))
    const c2 = new THREE.Vector3().copy(n1).add(dir.clone().multiplyScalar((2 * bondLen) / 3))
    ;[c1, c2].forEach(pos => {
      const cMat = new THREE.MeshStandardMaterial({
        color: 0x1A1A1A, roughness: 0.5, metalness: 0.2
      })
      const cMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14 * scale, 20, 20), cMat)
      cMesh.position.copy(pos)
      group.add(cMesh)
    })
    addBondToGroup(group, n1, c1, 0x446688, 0.035 * scale)
    addBondToGroup(group, c1, c2, 0x446688, 0.035 * scale)
    addBondToGroup(group, c2, n2, 0x446688, 0.035 * scale)
  })

  // σh tekislik (axirallikni vizualizatsiya qilish uchun)
  const planeGeo = new THREE.PlaneGeometry(3.5 * scale, 3.5 * scale)
  const planeMat = new THREE.MeshBasicMaterial({
    color: 0xFFD700, transparent: true, opacity: 0.15, side: THREE.DoubleSide
  })
  const plane = new THREE.Mesh(planeGeo, planeMat)
  plane.rotation.x = Math.PI / 2
  group.add(plane)

  group.position.copy(centerPos)
  scene.add(group)
  return { group }
}

// ═══════════════════════════════════════════════════════════════════════════
// BOG' YARATISH (helper)
// ═══════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════
// QUTBLANGAN YORUG'LIK CHIZIQ (Sinusoidal to'lqin — Λ chapga buradi, Δ o'ngga)
// ═══════════════════════════════════════════════════════════════════════════
function createPolarizedLightBeam(scene, startX, endX, y, chirality, rotationDeg = 30) {
  const group = new THREE.Group()
  const segments = 120
  const amplitude = 0.4
  const wavelength = 0.6

  // Bir necha polarizatsiya tekisligini ko'rsatish uchun 3 chiziq
  for (let planeIdx = 0; planeIdx < 3; planeIdx++) {
    const rotationBefore = 0
    const rotationAfter = chirality * (rotationDeg * Math.PI / 180) // molekula orqali o'tgach buriladi
    const planeOffset = (planeIdx - 1) * Math.PI / 6

    const points = []
    const colors = []
    const color1 = new THREE.Color(0xFFD700)
    const color2 = new THREE.Color(chirality > 0 ? CPK.delta : CPK.lambda)

    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const x = startX + t * (endX - startX)

      // Molekula 0.5-0.7 orasida joylashgan — o'sha oraliqda buriladi
      let rotation
      if (t < 0.4) rotation = rotationBefore + planeOffset
      else if (t > 0.7) rotation = rotationAfter + planeOffset
      else rotation = rotationBefore + (rotationAfter - rotationBefore) * ((t - 0.4) / 0.3) + planeOffset

      const wavePhase = (x / wavelength) * 2 * Math.PI
      const localY = amplitude * Math.sin(wavePhase) * Math.cos(rotation)
      const localZ = amplitude * Math.sin(wavePhase) * Math.sin(rotation)

      points.push(new THREE.Vector3(x, y + localY, localZ))
      const mix = t < 0.5 ? 0 : Math.min(1, (t - 0.5) * 2)
      const c = color1.clone().lerp(color2, mix)
      colors.push(c.r, c.g, c.b)
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points)
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    const mat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.85, linewidth: 2
    })
    group.add(new THREE.Line(geo, mat))
  }

  scene.add(group)
  return group
}

// ═══════════════════════════════════════════════════════════════════════════
// ASOSIY REACT KOMPONENTI
// ═══════════════════════════════════════════════════════════════════════════
export default function OptikIzomeriya3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)

  // 3D obyektlar
  const lambdaGroupRef = useRef(null)
  const deltaGroupRef = useRef(null)
  const transGroupRef = useRef(null)
  const polarizedBeamRef = useRef(null)
  const mirrorPlaneRef = useRef(null)
  const domLabelsRef = useRef([])

  // ═══════════════════════════════════════════════════════════
  // UI STATE'LAR
  // ═══════════════════════════════════════════════════════════
  const [complexId, setComplexId] = useState("Coen3") // "Coen3" | "cisCoen2Cl2"
  const [viewMode, setViewMode] = useState("ball") // "ball" | "cpk" | "wire"
  const [showLabels, setShowLabels] = useState(true)
  const [showMirrorPlane, setShowMirrorPlane] = useState(true)
  const [showPolarizedBeam, setShowPolarizedBeam] = useState(false)
  const [rotationAngle, setRotationAngle] = useState(30) // burilish burchagi (°)
  const [showC3Axis, setShowC3Axis] = useState(true)
  const [showTransComparison, setShowTransComparison] = useState(false) // faqat cis-Coen2Cl2 uchun
  const [superimposeMode, setSuperimposeMode] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

  // Optik xossalar
  const [enantiomericExcess, setEnantiomericExcess] = useState(100) // ee%
  const [showCDSpectrum, setShowCDSpectrum] = useState(false)
  const [showORDSpectrum, setShowORDSpectrum] = useState(false)

  // Rasemizatsiya kinetikasi
  const [temperature, setTemperature] = useState(298) // K
  const [showRacemization, setShowRacemization] = useState(false)
  const [racemizationTime, setRacemizationTime] = useState(0) // soat

  // Diastereomer / Pasteur
  const [showPasteurExperiment, setShowPasteurExperiment] = useState(false)

  // Panellar
  const [activePanel, setActivePanel] = useState("info") // "info" | "cd" | "ord" | "cip" | "werner" | "talidomid" | "pasteur" | "bijvoet"
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [showCitationModal, setShowCitationModal] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)

  // Boshqaruv paneli
  const [panelPos, setPanelPos] = useState({ x: 12, y: 70 })
  const [dragState, setDragState] = useState({ dragging: false, offX: 0, offY: 0 })
  const [collapsedSection, setCollapsedSection] = useState({
    view: false, optical: false, chirality: false, kinetics: true, science: true, history: true
  })

  // Panellarga tegishli tanlovlar
  const [cdWavelength, setCdWavelength] = useState(490)
  const [ordWavelength, setOrdWavelength] = useState(589)
  const [pdfSections, setPdfSections] = useState({
    chirality: true, cip: true, optical: true,
    cd: true, ord: true, werner: true,
    pasteur: true, bijvoet: true, table: true, talidomid: true,
    references: true
  })
  const [citationFormat, setCitationFormat] = useState("APA")

  const currentComplex = COMPLEXES[complexId]

  // ═══════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return
      if (e.key === "f" || e.key === "F") setFullscreen(v => !v)
      if (e.key === "m" || e.key === "M") setShowMirrorPlane(v => !v)
      if (e.key === "p" || e.key === "P") setShowPolarizedBeam(v => !v)
      if (e.key === "l" || e.key === "L") setShowLabels(v => !v)
      if (e.key === "s" || e.key === "S") setSuperimposeMode(v => !v)
      if (e.key === "r" || e.key === "R") setAutoRotate(v => !v)
      if (e.key === "1") setComplexId("Coen3")
      if (e.key === "2") setComplexId("cisCoen2Cl2")
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
        x: Math.max(0, Math.min(window.innerWidth - 280, e.clientX - dragState.offX)),
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
  // 🎬 3D SAHNANI QURISH VA YANGILASH
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x0a0a1a, 20, 55)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45, container.clientWidth / container.clientHeight, 0.1, 200
    )
    camera.position.set(0, 4, 12)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls
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

    // Grid
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
    // MODELNI QURISH
    // ═══════════════════════════════════════════════════════════
    const gap = 5.5

    if (complexId === "Coen3") {
      // Λ va Δ [Co(en)₃]³⁺
      buildCoen3(scene, new THREE.Vector3(-gap / 2, 0, 0), -1, { groupRef: lambdaGroupRef })
      buildCoen3(scene, new THREE.Vector3(+gap / 2, 0, 0), +1, { groupRef: deltaGroupRef })
    } else if (complexId === "cisCoen2Cl2") {
      buildCisCoen2Cl2(scene, new THREE.Vector3(-gap / 2, 0, 0), -1, { groupRef: lambdaGroupRef })
      buildCisCoen2Cl2(scene, new THREE.Vector3(+gap / 2, 0, 0), +1, { groupRef: deltaGroupRef })

      // Trans-izomerni yon tomonda ko'rsatish (ixtiyoriy)
      if (showTransComparison) {
        buildTransCoen2Cl2(scene, new THREE.Vector3(0, -5, 0), { scale: 0.8 })
      }
    }

    // ═══════════════════════════════════════════════════════════
    // OYNA TEKISLIGI (Λ va Δ orasida)
    // ═══════════════════════════════════════════════════════════
    if (showMirrorPlane) {
      const mirrorGeo = new THREE.PlaneGeometry(6, 6)
      const mirrorMat = new THREE.MeshBasicMaterial({
        color: 0xFFD700, transparent: true, opacity: 0.12, side: THREE.DoubleSide
      })
      const mirror = new THREE.Mesh(mirrorGeo, mirrorMat)
      mirror.rotation.y = Math.PI / 2
      scene.add(mirror)
      mirrorPlaneRef.current = mirror
    }

    // ═══════════════════════════════════════════════════════════
    // QUTBLANGAN YORUG'LIK
    // ═══════════════════════════════════════════════════════════
    if (showPolarizedBeam) {
      polarizedBeamRef.current = createPolarizedLightBeam(
        scene, -10, 10, -1.8, +1, rotationAngle
      )
    }

    // ═══════════════════════════════════════════════════════════
    // SUPERIMPOZITSIYA REJIMI (Λ ustiga Δ)
    // ═══════════════════════════════════════════════════════════
    if (superimposeMode && deltaGroupRef.current) {
      deltaGroupRef.current.position.set(-gap / 2, 0, 0)
      // Sof yarim shaffof effect
      deltaGroupRef.current.traverse(obj => {
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => { m.transparent = true; m.opacity = 0.4 })
          } else {
            obj.material.transparent = true
            obj.material.opacity = 0.4
          }
        }
      })
    }

    // ═══════════════════════════════════════════════════════════
    // KO'RINISH REJIMI (ball / cpk / wire)
    // ═══════════════════════════════════════════════════════════
    ;[lambdaGroupRef.current, deltaGroupRef.current].forEach(g => {
      if (!g) return
      g.traverse(obj => {
        if (obj.isMesh && obj.material) {
          const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material
          if (viewMode === "wire") {
            mat.wireframe = true
          } else {
            mat.wireframe = false
            if (viewMode === "cpk") {
              // Space-filling: barcha atomlarni kattaroq qilamiz
              // (masshtabni o'zgartirish o'rniga material o'zgarmaydi — sodda)
            }
          }
        }
      })
    })

    // ═══════════════════════════════════════════════════════════
    // DOM YORLIQLARI (Λ, Δ, Oyna)
    // ═══════════════════════════════════════════════════════════
    const addLabel = (html, css) => {
      const el = document.createElement("div")
      el.style.cssText = css
      el.innerHTML = html
      container.appendChild(el)
      domLabelsRef.current.push(el)
    }

    if (showLabels) {
      addLabel(
        `Λ (lambda)<br/><span style='font-size:11px;color:#aaa'>Chapga buruvchi • ${currentComplex.optical.alphaD_lambda}°</span>`,
        "position:absolute;top:12%;left:5%;color:#48dbfb;font-size:26px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 15px rgba(72,219,251,0.5)"
      )
      addLabel(
        `Δ (delta)<br/><span style='font-size:11px;color:#aaa'>O'ngga buruvchi • +${currentComplex.optical.alphaD_delta}°</span>`,
        "position:absolute;top:12%;right:5%;color:#f368e0;font-size:26px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 15px rgba(243,104,224,0.5)"
      )
      if (showMirrorPlane && !superimposeMode) {
        addLabel(
          "🪞<br/>Oyna<br/>tekisligi",
          "position:absolute;top:45%;left:50%;transform:translate(-50%,-50%);color:#FFD700;font-size:14px;font-weight:900;pointer-events:none;z-index:5;text-align:center;text-shadow:0 0 10px rgba(0,0,0,0.9)"
        )
      }
      if (superimposeMode) {
        addLabel(
          "⚠️ Λ va Δ ni ustma-ust qo'yib bo'lmaydi<br/><span style='font-size:11px;color:#fbbf24'>Bu — xirallikning ta'rifi</span>",
          "position:absolute;bottom:12%;left:50%;transform:translateX(-50%);color:#f59e0b;font-size:14px;font-weight:800;pointer-events:none;z-index:5;text-align:center;background:rgba(60,30,10,0.7);padding:8px 18px;border-radius:10px;border:1px solid #f59e0b"
        )
      }
      if (showPolarizedBeam) {
        addLabel(
          `☀️ Qutblangan yorug'lik → burilish α = ${rotationAngle}° (${currentComplex.optical.wavelength} nm)`,
          "position:absolute;bottom:5%;left:50%;transform:translateX(-50%);color:#fbbf24;font-size:13px;font-weight:700;pointer-events:none;z-index:5;text-align:center;background:rgba(30,20,10,0.7);padding:6px 14px;border-radius:8px;border:1px solid #fbbf24"
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

      // Λ va Δ ni qarama-qarshi yo'nalishlarda propeller aylanishi
      if (!superimposeMode) {
        if (lambdaGroupRef.current) lambdaGroupRef.current.rotation.y = -time * 0.2
        if (deltaGroupRef.current) deltaGroupRef.current.rotation.y = +time * 0.2
      } else {
        if (lambdaGroupRef.current) lambdaGroupRef.current.rotation.y = time * 0.15
        if (deltaGroupRef.current) deltaGroupRef.current.rotation.y = time * 0.15
      }

      // Rasemizatsiya effekti — vaqt o'tishi bilan ee% pasayadi
      if (showRacemization) {
        // faqat vizual: Δ ni yorishtirib beramiz (rasemik aralashma yaqinlashayotganini ko'rsatadi)
      }

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    // ═══════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════
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
  }, [complexId, showMirrorPlane, showPolarizedBeam, rotationAngle, showLabels,
      superimposeMode, viewMode, autoRotate, showTransComparison, showRacemization,
      currentComplex.optical.alphaD_lambda, currentComplex.optical.alphaD_delta,
      currentComplex.optical.wavelength])

  // ═══════════════════════════════════════════════════════════
  // 📄 PDF EKSPORT — ILMIY MAQOLA USLUBIDA (premium arxitektura)
  // Namuna: koordinatsion izomeriya PDF engine (jdakimyo.uz standarti)
  // ═══════════════════════════════════════════════════════════
  const generatePDF = useCallback(async () => {
    if (pdfGenerating) return
    setPdfGenerating(true)
    try {
      // ═══════════════════════════════════════════════════════════
      // FONT YUKLASH (DejaVu Sans — Unicode: Λ, Δ, α, ₃, ° va h.k.)
      // ═══════════════════════════════════════════════════════════
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

      // ═══════════════════════════════════════════════════════════
      // RANG PALITRASI (jdakimyo.uz brand)
      // ═══════════════════════════════════════════════════════════
      const C = {
        // Asosiy binafsha oilasi
        purple:      rgb(0.30, 0.11, 0.58),
        purpleLight: rgb(0.86, 0.78, 1.00),
        purpleMid:   rgb(0.65, 0.55, 0.98),
        purpleDark:  rgb(0.12, 0.11, 0.29),
        // Matnlar
        textDark:    rgb(0.08, 0.08, 0.16),
        textMuted:   rgb(0.47, 0.47, 0.55),
        textGray:    rgb(0.47, 0.47, 0.47),
        white:       rgb(1, 1, 1),
        // Aktsentlar
        gold:        rgb(0.80, 0.62, 0.05),
        blue:        rgb(0.08, 0.31, 0.75),
        orange:      rgb(0.86, 0.55, 0.00),
        red:         rgb(0.80, 0.20, 0.20),
        green:       rgb(0.08, 0.55, 0.31),
        yellow:      rgb(0.75, 0.60, 0.10),
        cyan:        rgb(0.10, 0.60, 0.80),  // Λ
        pink:        rgb(0.85, 0.20, 0.75),  // Δ
        // Yo'nalish/chiziqlar
        grayLine:    rgb(0.78, 0.78, 0.86),
        // Info box fonlari
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

      // ═══════════════════════════════════════════════════════════
      // GEOMETRIK KONSTANTALAR (A4)
      // ═══════════════════════════════════════════════════════════
      const PAGE_W = 595.28
      const PAGE_H = 841.89
      const MARGIN = 55
      const CONTENT_W = PAGE_W - 2 * MARGIN
      const FOOTER_Y = 50

      // ═══════════════════════════════════════════════════════════
      // YORDAMCHI FUNKSIYALAR
      // ═══════════════════════════════════════════════════════════
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
            // Agar bitta so'z ham sig'masa — belgi-belgi bo'lib boradi
            if (measure(w, f, size) > maxWidth) {
              let chunk = ""
              for (const ch of w) {
                if (measure(chunk + ch, f, size) <= maxWidth) chunk += ch
                else { lines.push(chunk); chunk = ch }
              }
              curLine = chunk
            } else {
              curLine = w
            }
          }
        }
        if (curLine) lines.push(curLine)
        return lines
      }

      // ═══════════════════════════════════════════════════════════
      // SAHIFA BOSHQARUVI
      // ═══════════════════════════════════════════════════════════
      let page = pdfDoc.addPage([PAGE_W, PAGE_H])
      let y = PAGE_H - MARGIN
      let pageNumber = 1

      const addFooter = (p, pn) => {
        // Chiziq
        p.drawLine({
          start: { x: MARGIN, y: FOOTER_Y + 12 },
          end:   { x: PAGE_W - MARGIN, y: FOOTER_Y + 12 },
          thickness: 0.3, color: C.grayLine
        })
        // Chap: brand + formula + sana
        const dateStr = new Date().toLocaleDateString("uz-UZ")
        const brandText = `Optik izomeriya 3D Lab  •  ${cleanText(currentComplex.formula)}  •  ${dateStr}`
        const truncatedBrand = truncate(brandText, regularFont, 8, CONTENT_W - 30)
        p.drawText(truncatedBrand, {
          x: MARGIN, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray
        })
        // O'ng: sahifa raqami
        const pageStr = `${pn}`
        const pageWidth = measure(pageStr, regularFont, 8)
        p.drawText(pageStr, {
          x: PAGE_W - MARGIN - pageWidth, y: FOOTER_Y, size: 8, font: regularFont, color: C.textGray
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

      // ═══════════════════════════════════════════════════════════
      // TUZUVCHI PRIMITIVLAR
      // ═══════════════════════════════════════════════════════════
      const drawSectionHeader = (num, title) => {
        checkBreak(50)
        // Vertikal binafsha aksent
        page.drawRectangle({
          x: MARGIN, y: y - 18, width: 4, height: 18, color: C.purple
        })
        // Raqam
        page.drawText(`${num}.`, {
          x: MARGIN + 10, y: y - 14, size: 14, font: boldFont, color: C.purple
        })
        // Sarlavha
        page.drawText(cleanText(title), {
          x: MARGIN + 30, y: y - 14, size: 14, font: boldFont, color: C.textDark
        })
        y -= 30
      }

      const drawParagraph = (text, opts = {}) => {
        const { size = 10, color = C.textDark, font: f = regularFont, indent = 0 } = opts
        const lines = wrapText(text, f, size, CONTENT_W - indent)
        for (const line of lines) {
          checkBreak(size + 4)
          page.drawText(line, {
            x: MARGIN + indent, y: y - size, size, font: f, color
          })
          y -= size + 4
        }
        y -= 4
      }

      const drawBulletPoint = (text, opts = {}) => {
        const { size = 10, color = C.textDark, bulletColor = C.purple } = opts
        const lines = wrapText(text, regularFont, size, CONTENT_W - 20)
        checkBreak(size + 3)
        // Nuqta
        page.drawCircle({
          x: MARGIN + 7, y: y - size + 2, size: 2, color: bulletColor
        })
        // Matn
        page.drawText(lines[0] || "", {
          x: MARGIN + 20, y: y - size, size, font: regularFont, color
        })
        y -= size + 3
        for (let i = 1; i < lines.length; i++) {
          checkBreak(size + 3)
          page.drawText(lines[i], {
            x: MARGIN + 20, y: y - size, size, font: regularFont, color
          })
          y -= size + 3
        }
        y -= 2
      }

      const drawInfoBox = (title, body, opts = {}) => {
        const {
          bgColor = C.bgPurple, borderColor = C.purple,
          titleColor = C.purple, textColor = C.textDark
        } = opts
        const titleLines = wrapText(title, boldFont, 11, CONTENT_W - 24)
        const bodyLines = wrapText(body, regularFont, 10, CONTENT_W - 24)
        const boxHeight = 10 + titleLines.length * 14 + bodyLines.length * 14 + 10
        checkBreak(boxHeight + 8)
        // Fon
        page.drawRectangle({
          x: MARGIN, y: y - boxHeight, width: CONTENT_W, height: boxHeight, color: bgColor
        })
        // Chap chegara (qalin)
        page.drawRectangle({
          x: MARGIN, y: y - boxHeight, width: 3, height: boxHeight, color: borderColor
        })
        let ty = y - 10
        // Sarlavha
        for (const line of titleLines) {
          page.drawText(line, {
            x: MARGIN + 12, y: ty - 11, size: 11, font: boldFont, color: titleColor
          })
          ty -= 14
        }
        ty -= 2
        // Tana
        for (const line of bodyLines) {
          page.drawText(line, {
            x: MARGIN + 12, y: ty - 10, size: 10, font: regularFont, color: textColor
          })
          ty -= 14
        }
        y -= boxHeight + 8
      }

      const drawFormula = (formula, opts = {}) => {
        const { size = 12, color = C.purpleDark, center = false } = opts
        checkBreak(size + 8)
        const width = measure(formula, boldFont, size)
        const x = center ? MARGIN + (CONTENT_W - width) / 2 : MARGIN + 20
        page.drawText(cleanText(formula), {
          x, y: y - size, size, font: boldFont, color
        })
        y -= size + 8
      }

      // ═══════════════════════════════════════════════════════════
      // TITUL SAHIFA (Cover page)
      // ═══════════════════════════════════════════════════════════
      // Yuqori binafsha blok
      page.drawRectangle({
        x: 0, y: PAGE_H - 200, width: PAGE_W, height: 200, color: C.purpleDark
      })
      page.drawRectangle({
        x: 0, y: PAGE_H - 205, width: PAGE_W, height: 5, color: C.purple
      })

      // JDA-KIMYO byulleten qatori (yuqori chap)
      page.drawText("JDA-KIMYO • ILMIY BYULLETEN'", {
        x: MARGIN, y: PAGE_H - 30, size: 9, font: boldFont, color: C.purpleLight
      })
      page.drawText(new Date().toLocaleDateString("uz-UZ"), {
        x: PAGE_W - MARGIN - measure(new Date().toLocaleDateString("uz-UZ"), regularFont, 9),
        y: PAGE_H - 30, size: 9, font: regularFont, color: C.purpleLight
      })

      // Asosiy sarlavha
      const mainTitle = "OPTIK IZOMERIYA"
      const mtWidth = measure(mainTitle, boldFont, 26)
      page.drawText(mainTitle, {
        x: (PAGE_W - mtWidth) / 2, y: PAGE_H - 90,
        size: 26, font: boldFont, color: C.white
      })

      // Subtitl
      const subtitle = "Koordinatsion birikmalarda xirallik va enantiomerlar"
      const stWidth = measure(subtitle, italicFont, 12)
      page.drawText(subtitle, {
        x: (PAGE_W - stWidth) / 2, y: PAGE_H - 115,
        size: 12, font: italicFont, color: C.purpleLight
      })

      // Kompleks formulasi
      const formulaStr = cleanText(currentComplex.formula)
      const fWidth = measure(formulaStr, boldFont, 15)
      page.drawText(formulaStr, {
        x: (PAGE_W - fWidth) / 2, y: PAGE_H - 145,
        size: 15, font: boldFont, color: C.white
      })

      // Yunon harflari
      const greekLine = "Λ (lambda) ↔ Δ (delta)"
      const gWidth = measure(greekLine, boldFont, 14)
      page.drawText(greekLine, {
        x: (PAGE_W - gWidth) / 2, y: PAGE_H - 175,
        size: 14, font: boldFont, color: C.purpleLight
      })

      // Titul ostidagi bo'sh joy
      y = PAGE_H - 235

      // "Tadqiqot obyekti" info bloki
      drawInfoBox(
        "Tanlangan xiral kompleks",
        `Formula: ${cleanText(currentComplex.formula)}  |  Tuz: ${cleanText(currentComplex.fullSalt)}\n` +
        `IUPAC nomi: ${currentComplex.name}\n` +
        `Nuqta guruh: ${currentComplex.chirality.pointGroup} (${currentComplex.symmetry})  |  ` +
        `Gibridlanish: ${currentComplex.hybridization}\n` +
        `Enantiomer jufti: Λ va Δ  |  σ = 0  |  Sn = yo'q  |  Xirallik: ✓`,
        { bgColor: C.bgPurple, borderColor: C.purple }
      )

      // Optik faollik info bloki
      drawInfoBox(
        "Optik xossalar (Na D chizig'i, 589 nm, 298 K, suv)",
        `[α]D (Λ) = ${currentComplex.optical.alphaD_lambda}° (laevo, chapga buruvchi)\n` +
        `[α]D (Δ) = +${currentComplex.optical.alphaD_delta}° (dextro, o'ngga buruvchi)\n` +
        `CD λmax = ${currentComplex.optical.cdMax.lambda} nm  |  ` +
        `Cotton effekti: Λ = ${currentComplex.optical.cdMax.sign_lambda} , Δ = ${currentComplex.optical.cdMax.sign_delta}\n` +
        `d-orbital splitting Δo = ${currentComplex.dOrbital.deltaO} cm⁻¹ (${currentComplex.dOrbital.type})`,
        { bgColor: C.bgGold, borderColor: C.gold, titleColor: C.gold }
      )

      // Annotatsiya
      y -= 5
      drawSectionHeader("§", "Annotatsiya")
      drawParagraph(
        `Ushbu hisobotda ${currentComplex.formula} kompleksining optik izomeriyasi keng qamrovli ` +
        `o'rganilgan. Λ va Δ enantiomerlarining fazoviy tuzilishi, xirallikning matematik asoslari ` +
        `(nuqta guruh ${currentComplex.chirality.pointGroup}, S₁/σ va Sn simmetriya elementlarining yo'qligi), ` +
        `qutblangan yorug'likka ta'siri (optik faollik, Biot qonuni), CD (sirkulyar dixroizm) va ORD ` +
        `(optik burilish dispersiyasi) spektrlari, Werner-Pasteur ajratish usullari, Bijvoet absolyut ` +
        `konfiguratsiya metodi va enantiomerlarning biologik ahamiyati (Talidomid darsi, chiral switch ` +
        `paradigmasi) batafsil bayon etilgan.`
      )
      drawParagraph(currentComplex.scientificNotes, { font: italicFont, color: C.textMuted })

      addNewPage()

      // ═══════════════════════════════════════════════════════════
      // 1. XIRALLIK — TA'RIF VA MATEMATIK ASOSLARI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.chirality) {
        drawSectionHeader(1, "Xirallik — ta'rif va matematik asoslari")
        drawParagraph(
          "Xirallik (yunoncha \"cheir\" — qo'l) — molekulaning o'z oyna aksi bilan ustma-ust qo'yilmaslik " +
          "xususiyati. Xiral molekula va uning oyna aksi enantiomerlar deb ataladi. Enantiomerlar bir xil " +
          "atomlardan iborat, bir xil bog'lar tartibiga ega, lekin fazoviy joylashuvi bir-birining oyna " +
          "aksidir."
        )
        drawInfoBox(
          "IUPAC (2013) rasmiy ta'rif",
          "Chirality: The geometric property of a rigid object of being non-superposable on its mirror " +
          "image. Xiral molekulaga simmetriya S₁ (= σ, oyna tekislik), S₂ (= i, inversiya markazi) va " +
          "umuman hech qanday Sn (n ≥ 1) o'q bo'lmasligi shart.",
          { bgColor: C.bgPurple, borderColor: C.purple }
        )
        drawParagraph("Molekulaning xirallik shartlari (barchasi bajarilishi kerak):")
        drawBulletPoint("S₁ (σ) — simmetriya tekislik bo'lmasligi kerak", { bulletColor: C.green })
        drawBulletPoint("S₂ (i) — inversiya markazi bo'lmasligi kerak", { bulletColor: C.green })
        drawBulletPoint("Sn (n ≥ 1) — hech qanday nomtaraf (improper) aylanish o'qi bo'lmasligi kerak", { bulletColor: C.green })
        drawBulletPoint("Faqat Cn (n ≥ 1) — sof aylanish o'qlari ruxsat etiladi", { bulletColor: C.green })
        drawInfoBox(
          `${cleanText(currentComplex.formula)} — xirallik tekshiruvi`,
          `Nuqta guruh: ${currentComplex.chirality.pointGroup}  |  ` +
          `σ (tekislik) = ${currentComplex.chirality.sigmaCount}  |  ` +
          `i (markaz) = yo'q  |  Sn = ${currentComplex.chirality.sn}\n` +
          `Xulosa: Molekula xirallik shartlarini to'liq bajaradi — ${currentComplex.chirality.type} ` +
          `enantiomer jufti mavjud.`,
          { bgColor: C.bgGreen, borderColor: C.green, titleColor: C.green }
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 2. Λ/Δ NOMENKLATURA (IUPAC 2005 RED BOOK)
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.cip) {
        drawSectionHeader(2, "Λ/Δ nomenklatura — IUPAC 2005 Red Book")
        drawParagraph(
          "Koordinatsion birikmalarda xirallikni ifodalash uchun IUPAC (2005 Red Book) tavsiya etgan " +
          "usul — Λ (lambda) va Δ (delta) stereodeskriptorlari. Bu belgilar molekula asosiy Cn o'qi " +
          "bo'ylab qaralganda xelat halqalarining propeller yo'nalishini ko'rsatadi."
        )
        drawInfoBox(
          "Δ (delta) — o'ng qo'l propeller",
          "Molekulani asosiy simmetriya o'qi bo'ylab qaraganda xelat halqalari SOAT MILI YO'NALISHIDA " +
          "aylanadi. Sinonim: P-konfiguratsiya. O'ng qo'l vint (dextro-rotatory tendensiya, lekin bu " +
          "aloqasi umumiy emas — ba'zi Δ manfiy [α] beradi).",
          { bgColor: C.bgPink, borderColor: C.pink, titleColor: C.pink }
        )
        drawInfoBox(
          "Λ (lambda) — chap qo'l propeller",
          "Molekulani asosiy simmetriya o'qi bo'ylab qaraganda xelat halqalari SOAT MILIGA QARSHI " +
          "aylanadi. Sinonim: M-konfiguratsiya. Chap qo'l vint. Δ ning aynan oyna aksi.",
          { bgColor: C.bgCyan, borderColor: C.cyan, titleColor: C.cyan }
        )
        drawParagraph(
          "MUHIM: R/S nomenklaturasi organik molekulalar uchun mo'ljallangan — u xiral markaz " +
          "atrofidagi 4 ta guruhning CIP ustuvorlik tartibiga asoslanadi. Xelat komplekslarida esa " +
          "xirallik ligandlarning halqa aylanishidan kelib chiqadi — shuning uchun Λ/Δ tizimi qo'llaniladi.",
          { font: italicFont, color: C.textMuted }
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 3. OPTIK FAOLLIK — BIOT QONUNI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.optical) {
        drawSectionHeader(3, "Optik faollik — Biot qonuni va [α]D")
        drawParagraph(
          "Optik faol modda tekis qutblangan yorug'likni burish qobiliyatiga ega. Bu jarayon " +
          "polarimetr asbobida o'lchanadi. Burilish burchagi α (gradus, °) quyidagi Biot qonuniga bo'ysunadi:"
        )
        drawFormula("[α]λ^T  =  α / (l · c)", { center: true, size: 14 })
        drawParagraph("Formula parametrlari:")
        drawBulletPoint("α — o'lchangan burilish burchagi (gradus, °)", { bulletColor: C.gold })
        drawBulletPoint("l — polarimetr kyuvetasi uzunligi (dm, detsimetr)", { bulletColor: C.gold })
        drawBulletPoint("c — modda konsentratsiyasi (g/mL yoki g/cm³)", { bulletColor: C.gold })
        drawBulletPoint("T — harorat (odatda 298 K = 25 °C)", { bulletColor: C.gold })
        drawBulletPoint("λ — yorug'lik to'lqin uzunligi (odatda 589 nm — natriy D chizig'i)", { bulletColor: C.gold })
        drawInfoBox(
          `${cleanText(currentComplex.formula)} uchun eksperimental qiymatlar`,
          `Λ-enantiomer: [α]D = ${currentComplex.optical.alphaD_lambda}°  (laevo, chapga burish, "−" belgi)\n` +
          `Δ-enantiomer: [α]D = +${currentComplex.optical.alphaD_delta}°  (dextro, o'ngga burish, "+" belgi)\n` +
          `Rasemik aralashma (±): [α]D = 0°  —  Λ va Δ effekti bir-birini bekor qiladi\n` +
          `O'lchov sharoiti: λ = ${currentComplex.optical.wavelength} nm (Na D), T = 298 K, erituvchi = suv`,
          { bgColor: C.bgGold, borderColor: C.gold, titleColor: C.gold }
        )
        drawParagraph(
          "Enantiomer ortiqchaligi (ee, enantiomeric excess) — nomunifikatsiya darajasini o'lchaydi:",
          { color: C.textDark }
        )
        drawFormula("ee (%) = ([R] − [S]) / ([R] + [S]) × 100%", { center: true, size: 12 })
        drawParagraph(
          "ee = 100%: sof enantiomer  •  ee = 0%: rasemik aralashma (50:50)  •  ee = 50%: 75:25 nisbat",
          { font: italicFont, color: C.textMuted }
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 4. CD SPEKTRI (Sirkulyar Dixroizm)
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.cd) {
        drawSectionHeader(4, "Sirkulyar Dixroizm (CD) spektroskopiyasi")
        drawParagraph(
          "CD spektroskopiya — chap va o'ng aylanadigan qutblangan yorug'likning (L-CPL va R-CPL) " +
          "yutilishi orasidagi farqni o'lchaydi. Bu enantiomerlarni farqlashning eng aniq spektroskopik usulidir."
        )
        drawFormula("Δε(λ) = εL(λ) − εR(λ)", { center: true, size: 14 })
        drawParagraph(
          "Enantiomerlar CD spektrida bir xil to'lqin uzunligida bir xil intensivlikda, lekin " +
          "QARAMA-QARSHI ISHORADA peak beradi — bu Cotton effekti deb ataladi."
        )
        drawInfoBox(
          "Cotton effekti — Λ enantiomer",
          `λmax = ${currentComplex.optical.cdMax.lambda} nm  |  Δε ishorasi: ${currentComplex.optical.cdMax.sign_lambda} (MANFIY Cotton)\n` +
          "O'tish turi: d–d (¹A₁g → ¹T₁g) — kobalt(III) uchun spin-taqiqlangan lekin CD da kuchli.\n" +
          "Manfiy Cotton effekti — Λ konfiguratsiyaning empirik markeri.",
          { bgColor: C.bgCyan, borderColor: C.cyan, titleColor: C.cyan }
        )
        drawInfoBox(
          "Cotton effekti — Δ enantiomer",
          `λmax = ${currentComplex.optical.cdMax.delta} nm  |  Δε ishorasi: ${currentComplex.optical.cdMax.sign_delta} (MUSBAT Cotton)\n` +
          "O'tish turi: d–d (¹A₁g → ¹T₁g) — Λ bilan bir xil, lekin ishora teskari.\n" +
          "Musbat Cotton effekti — Δ konfiguratsiyaning empirik markeri.",
          { bgColor: C.bgPink, borderColor: C.pink, titleColor: C.pink }
        )
        drawParagraph(
          "CD spektri koordinatsion birikmalarning absolyut konfiguratsiyasini aniqlashning eng " +
          "keng qo'llaniladigan usuli hisoblanadi. Bijvoet metodidan (X-ray) farqli o'laroq, " +
          "eritmada ham o'lchash mumkin."
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 5. ORD SPEKTRI (Optik Burilish Dispersiyasi)
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.ord) {
        drawSectionHeader(5, "Optik Burilish Dispersiyasi (ORD)")
        drawParagraph(
          "ORD — [α] burilish burchagining yorug'lik to'lqin uzunligi λ ga bog'liqligini o'lchaydi. " +
          "Absorbsion band yaqinida [α] anomal o'zgaradi — bu Cotton effekti deb ataladi. " +
          "ORD Drude tenglamasi bilan tavsiflanadi:"
        )
        drawFormula("[α]λ = k / (λ² − λ₀²)", { center: true, size: 14 })
        drawParagraph("bu yerda k — modda konstantasi, λ₀ — absorbsion peak markazi.")
        drawInfoBox(
          "CD va ORD — birgalikda kuchli vosita",
          "CD spektri o'tish energiyasi darajasini aniq ko'rsatadi (peak λmax); ORD esa peak atrofidagi " +
          "burilish o'zgarishini (S-shaklidagi egri) ko'rsatadi. Ikkalasi ham birga ishlatilganda, " +
          "koordinatsion birikmaning absolyut konfiguratsiyasini aniqlash empirik jihatdan juda ishonchli.",
          { bgColor: C.bgPurple, borderColor: C.purpleMid, titleColor: C.purple }
        )
        drawParagraph("Amaliy foydalanish:")
        drawBulletPoint("Absolyut konfiguratsiya aniqlash (Bijvoet metodi bilan birgalikda)")
        drawBulletPoint("Enantiomer ortiqchaligi (ee%) hisoblash — ORD asosida")
        drawBulletPoint("Reaksiya mexanizmini tekshirish (SN1 vs SN2 — rasemizatsiya darajasi)")
        drawBulletPoint("Biomolekulalar konformatsiyasini o'rganish (oqsillar, DNK)")
      }

      // ═══════════════════════════════════════════════════════════
      // 6. WERNER TAJRIBASI (1911) — TARIXIY ISBOT
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.werner) {
        drawSectionHeader(6, "Werner tajribasi (1911) — tarixiy isbot")
        drawParagraph(
          "Alfred Werner (1866–1919, Sюrix universiteti) 1911-yilda [Co(en)₃]³⁺ va cis-[Co(en)₂Cl₂]⁺ " +
          "komplekslarini enantiomerlarga ajratdi. Bu — koordinatsion birikmalarda xirallik borligining " +
          "birinchi eksperimental isboti bo'ldi va uglerodsiz xirallik nazariyasini yaratdi."
        )
        drawInfoBox(
          "Ajratish reaksiyasi — diastereomer kristallizatsiya",
          "Rasemik kompleks + optik faol kislota (d-tartrat) → 2 ta diastereomer tuz. " +
          "Diastereomerlar fizikaviy xossalari (eruvchanlik, kristall shakli) bilan farqlanadi, " +
          "shuning uchun fraktsion kristallizatsiya bilan ajratiladi.",
          { bgColor: C.bgYellow, borderColor: C.yellow, titleColor: C.yellow }
        )
        drawFormula("(±)-[Co(en)₃]³⁺ + 2 d-tart²⁻  →  Λ-[Co(en)₃][d-tart] + Δ-[Co(en)₃][d-tart]", { size: 10 })
        drawParagraph("Ajratish qadamlar (Werner protokoli):")
        drawBulletPoint("1) Rasemik kompleks eritmasiga optik faol d-tartrat qo'shiladi")
        drawBulletPoint("2) Ikki diastereomer tuz hosil bo'ladi — biri kam eruvchan, cho'kadi")
        drawBulletPoint("3) Filtrat orqali ikkinchi diastereomer ajratiladi")
        drawBulletPoint("4) Sof enantiomerdan OH⁻ bilan tartrat ligand olib tashlanadi")
        drawBulletPoint("5) Polarimetrda [α]D o'lchanadi va tasdiqlanadi")
        drawInfoBox(
          "🏆 1913 Nobel mukofoti (Kimyo)",
          "Werner \"koordinatsion nazariya va atomlarning molekulada joylashuvi\" bo'yicha ishlar uchun " +
          "Kimyo bo'yicha Nobel mukofotini oldi. Bu koordinatsion kimyoni mustaqil fanga aylantirdi " +
          "va zamonaviy stereokimyo asosini yaratdi.",
          { bgColor: C.bgGold, borderColor: C.gold, titleColor: C.gold }
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 7. PASTEUR (1848) VA RASEMIZATSIYA KINETIKASI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.pasteur) {
        drawSectionHeader(7, "Pasteur (1848) va rasemizatsiya kinetikasi")
        drawInfoBox(
          "Louis Pasteur — 1848-yil",
          "Pasteur mikroskop ostida natriy-ammoniy tartrat kristallarini qo'lda pintset yordamida " +
          "ajratdi — hemihedral yuzlarining chap va o'ng shakli bo'yicha. Har bir ajratilgan " +
          "to'plam qutblangan yorug'likni teskari yo'nalishda burdi. Bu — xirallikning birinchi " +
          "eksperimental isboti bo'ldi. 60 yildan keyin Werner shu usulni koordinatsion komplekslarga qo'lladi.",
          { bgColor: C.bgOrange, borderColor: C.orange, titleColor: C.orange }
        )
        drawParagraph(
          "Rasemizatsiya — sof enantiomerdan rasemik (50:50 Λ:Δ) aralashma hosil bo'lish jarayoni. " +
          "Bu birinchi tartibli kinetika Arrenius qonuniga bo'ysunadi:"
        )
        drawFormula("k_rac = A · exp(−Ea / RT)", { center: true, size: 14 })
        drawParagraph(
          "bu yerda A — pre-eksponensial omil, Ea — aktivatsiya energiyasi, R — universal gaz " +
          "konstantasi (8.314 J/mol·K), T — harorat (K)."
        )
        drawInfoBox(
          "Rasemizatsiya haroratga bog'liqligi (namuna qiymatlar)",
          "T = 298 K (25 °C):  t½ ≈ 150 soat  —  juda sekin (labor sharoiti)\n" +
          "T = 333 K (60 °C):  t½ ≈ 12 soat  —  sekin, lekin sezilarli\n" +
          "T = 373 K (100 °C):  t½ ≈ 0.8 soat  —  tez rasemizatsiya\n" +
          "Ea taxminan ≈ 100 kJ/mol  |  Mexanizm: Bailar twist (trigonal prizmatik oraliq holat)",
          { bgColor: C.bgYellow, borderColor: C.yellow, titleColor: C.yellow }
        )
        drawParagraph("Rasemizatsiya mexanizmlari (koordinatsion birikmalar uchun):")
        drawBulletPoint("Bailar twist — trigonal prizmatik oraliq holat orqali (C₃v)")
        drawBulletPoint("Ray–Dutt twist — noaniq (rombik) oraliq holat orqali")
        drawBulletPoint("Bond rupture — Co–N bog'i uzilishi orqali (dissotsiativ)")
        drawBulletPoint("Photorasemization — ultra binafsha nurlanish ta'sirida")
      }

      // ═══════════════════════════════════════════════════════════
      // 8. BIJVOET METODI (1951) — ABSOLYUT KONFIGURATSIYA
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.bijvoet) {
        drawSectionHeader(8, "Bijvoet metodi (1951) — absolyut konfiguratsiya")
        drawParagraph(
          "1951-yilda J. M. Bijvoet Amsterdam laboratoriyasida anomal X-nur difraksiyasi (Zn Kα, " +
          "λ = 1.435 Å) usulini qo'llagan holda natriy rubidiy tartrat kristali uchun absolyut " +
          "konfiguratsiyani birinchi marta aniqladi. Undan avval R/S va Λ/Δ belgilari faqat nisbiy edi " +
          "(Fisher–Rosanoff konvensiyasi asosidagi taxminiy qiymatlar)."
        )
        drawInfoBox(
          "Ish tamoyili — anomal dispersiya",
          "Og'ir atom yaqinida X-nurning anomal dispersiyasi (rezonans yutilishi) Friedel qonunini " +
          "buzadi. Natijada Bijvoet juftlari (hkl vs h̄k̄l̄) intensivligi turlicha bo'ladi. Bu farq " +
          "orqali kristallda atomlarning aynan qaysi kongfiguratsiyada joylashishi aniqlanadi.",
          { bgColor: C.bgBlue, borderColor: C.blue, titleColor: C.blue }
        )
        drawParagraph("Ahamiyati:")
        drawBulletPoint("Zamonaviy X-ray kristallografiya asosi (Nobel 1985 — Karle & Hauptman)")
        drawBulletPoint("[Co(en)₃]³⁺ ning absolyut konfiguratsiyasi Bijvoet metodi bilan aniqlangan")
        drawBulletPoint("D-glyukoza va D-tartratning absolyut konfiguratsiyasi tasdiqlangan")
        drawBulletPoint("Bugungi kunda synchrotron va kriogen X-ray bilan yanada aniq")
        drawParagraph(
          "Nature jurnalidagi 1951 yildagi maqola (Bijvoet, Peerdeman, van Bommel) stereokimyo tarixidagi " +
          "eng muhim maqolalardan biri hisoblanadi.",
          { font: italicFont, color: C.textMuted }
        )
      }

      // ═══════════════════════════════════════════════════════════
      // 9. Λ vs Δ SOLISHTIRISH JADVALI
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.table !== false) {
        drawSectionHeader(9, "Λ va Δ enantiomerlar — solishtirish jadvali")
        const rows = [
          ["Xususiyat", "Λ-enantiomer", "Δ-enantiomer"],
          ["Belgi", "Λ (lambda)", "Δ (delta)"],
          ["Sinonim", "M-konfiguratsiya", "P-konfiguratsiya"],
          ["Propeller", "Chap qo'l (soat miliga qarshi)", "O'ng qo'l (soat mili)"],
          ["[α]D (°)", `${currentComplex.optical.alphaD_lambda}° (laevo, −)`, `+${currentComplex.optical.alphaD_delta}° (dextro, +)`],
          ["CD Cotton", "Manfiy (−) at " + currentComplex.optical.cdMax.lambda + " nm", "Musbat (+) at " + currentComplex.optical.cdMax.delta + " nm"],
          ["Simmetriya", currentComplex.chirality.pointGroup + " (chap)", currentComplex.chirality.pointGroup + " (o'ng)"],
          ["Ranglar (vizual)", "Sxema: cyan/moviy", "Sxema: pushti/magenta"],
          ["Biologik farq", "Turli enzim ta'siri", "Turli enzim ta'siri"]
        ]

        const colW = [CONTENT_W * 0.24, CONTENT_W * 0.38, CONTENT_W * 0.38]
        const rowH = 24
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
            // Λ ustuni cyan, Δ ustuni pink
            if (!isHeader && ci === 1) color = C.cyan
            if (!isHeader && ci === 2) color = C.pink
            page.drawText(txt, {
              x: cx, y: y - rowH + 8, size: 9, font: f, color
            })
            cx += colW[ci]
          })
          y -= rowH
        })
        y -= 12
      }

      // ═══════════════════════════════════════════════════════════
      // 10. TALIDOMID DARSI VA DORISHUNOSLIK
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.talidomid) {
        drawSectionHeader(10, "Talidomid darsi — enantiomerlarning tibbiy ahamiyati")
        drawInfoBox(
          "⚠️ Talidomid halokati (1957–1962)",
          "46 mamlakatda talidomid rasemik dori sifatida homilador ayollarga tinchlantiruvchi va " +
          "antiemetik dori sifatida sotildi. Keyinchalik ma'lum bo'ldiki: R-enantiomer terapevtik, " +
          "S-enantiomer esa teratogen — u DNK bilan bog'lanib embrion rivojlanishini buzadi. " +
          "Natijada 10 000+ chaqaloq fokomeliya (qo'l-oyoq rivojlanmasligi) bilan tug'ildi.",
          { bgColor: C.bgRed, borderColor: C.red, titleColor: C.red }
        )
        drawParagraph("Enantiomer farqlarining tibbiy natijalari:")
        drawBulletPoint("R-talidomid: sedativ, antiemetik (terapevtik faol)", { bulletColor: C.green })
        drawBulletPoint("S-talidomid: teratogen, DNK bilan interkalyatsiya (jinnix kasal qiluvchi)", { bulletColor: C.red })
        drawBulletPoint("In vivo racemization — R shakl ham tanada S ga aylanishi mumkin", { bulletColor: C.orange })
        drawInfoBox(
          "Chiral Switch — zamonaviy paradigma",
          "FDA (AQSh) va EMA (Yevropa) 1992-yildan boshlab har bir yangi xiral dori uchun har ikkala " +
          "enantiomerni alohida biologik sinash talab qiladi. \"Chiral switch\" — mavjud rasemik dorining " +
          "sof enantiomer versiyasini yaratish orqali xavfsizlik va samaradorlikni oshirish strategiyasi. " +
          "Misollar: (S)-omeprazol (Nexium), (S)-citalopram (Escitalopram), levofloksatsin.",
          { bgColor: C.bgGreen, borderColor: C.green, titleColor: C.green }
        )
        drawParagraph("Koordinatsion tibbiyot va xirallik:")
        drawBulletPoint("Sisplatin va oksaliplatin — Pt(II) va Pt(IV) kompleks dorilari (o'sma davolash)")
        drawBulletPoint("Λ-[Ru(bpy)₃]²⁺ va Δ-[Ru(bpy)₃]²⁺ — DNK bilan turli affinlik (rak diagnostika)")
        drawBulletPoint("Gd(III) MRT kontrast agentlari — xirallik nishonlash aniqligiga ta'sir qiladi")
        drawBulletPoint("Fe(III) va Co(III) xelatlari — anemiya va B₁₂ vitamin analoglari")
      }

      // ═══════════════════════════════════════════════════════════
      // 11. ADABIYOTLAR (References)
      // ═══════════════════════════════════════════════════════════
      if (pdfSections.references) {
        drawSectionHeader(11, "Foydalanilgan adabiyotlar")
        const refs = [
          "Werner, A. (1911). Zur Kenntnis des asymmetrischen Kobaltatoms. Berichte der Deutschen Chemischen Gesellschaft, 44(2), 1887–1898.",
          "Werner, A. (1913). Nobel Lecture: On the Constitution and Configuration of Higher-Order Compounds. The Nobel Foundation, Stockholm.",
          "Pasteur, L. (1848). Recherches sur les relations qui peuvent exister entre la forme cristalline, la composition chimique et le sens de la polarisation rotatoire. Annales de Chimie et de Physique, 24, 442–459.",
          "Bijvoet, J. M., Peerdeman, A. F., & van Bommel, A. J. (1951). Determination of the Absolute Configuration of Optically Active Compounds by Means of X-rays. Nature, 168, 271–272.",
          "Cahn, R. S., Ingold, C. K., & Prelog, V. (1966). Specification of Molecular Chirality. Angewandte Chemie International Edition, 5(4), 385–415.",
          "IUPAC (2005). Nomenclature of Inorganic Chemistry — IUPAC Recommendations 2005 (Red Book). RSC Publishing, Cambridge.",
          "Cotton, F. A., Wilkinson, G., Murillo, C. A., & Bochmann, M. (1999). Advanced Inorganic Chemistry, 6th ed. Wiley-Interscience, New York.",
          "Miessler, G. L., Fischer, P. J., & Tarr, D. A. (2014). Inorganic Chemistry, 5th ed. Pearson Education, Boston.",
          "Housecroft, C. E., & Sharpe, A. G. (2018). Inorganic Chemistry, 5th ed. Pearson, Harlow.",
          "Berova, N., Nakanishi, K., & Woody, R. W. (2000). Circular Dichroism: Principles and Applications, 2nd ed. Wiley-VCH, New York.",
          "Van 't Hoff, J. H., & Le Bel, J. A. (1874). Sur les formules de structure dans l'espace. Bulletin de la Société Chimique de France, 22, 337–347.",
          "Bailar, J. C. Jr. (1958). Some problems in the stereochemistry of coordination compounds. Journal of Inorganic and Nuclear Chemistry, 8, 165–175.",
          "IUPAC (2013). Compendium of Chemical Terminology, 2nd ed. (the \"Gold Book\"). Compiled by A. D. McNaught and A. Wilkinson. Blackwell Scientific Publications, Oxford."
        ]
        refs.forEach((r, i) => {
          drawParagraph(`[${i + 1}] ${r}`, { size: 9, color: C.textDark })
        })
      }

      // ═══════════════════════════════════════════════════════════
      // OXIRGI SAHIFAGA FOOTER
      // ═══════════════════════════════════════════════════════════
      addFooter(page, pageNumber)

      // ═══════════════════════════════════════════════════════════
      // METADATA
      // ═══════════════════════════════════════════════════════════
      pdfDoc.setTitle(`Optik izomeriya — ${cleanText(currentComplex.formula)}`)
      pdfDoc.setSubject("Optik izomeriya, xirallik, Λ/Δ enantiomerlar — ilmiy hisobot")
      pdfDoc.setAuthor("JDA-Kimyo (jdakimyo.uz)")
      pdfDoc.setCreator("jdakimyo.uz Optik izomeriya 3D Lab")
      pdfDoc.setProducer("pdf-lib + DejaVu Sans")
      pdfDoc.setKeywords([
        "optik izomeriya", "xirallik", "lambda", "delta", "enantiomer",
        "koordinatsion kimyo", "Werner", "Pasteur", "Bijvoet", "CD spektri",
        "ORD", "chirality", "coordination chemistry"
      ])

      // ═══════════════════════════════════════════════════════════
      // FAYLNI YUKLAB OLISH
      // ═══════════════════════════════════════════════════════════
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `optik_izomeriya_${currentComplex.id}_${new Date().toISOString().slice(0, 10)}.pdf`
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
  }, [currentComplex, pdfSections, pdfGenerating])

  // ═══════════════════════════════════════════════════════════
  // 📚 IQTIBOS (Citation) GENERATSIYA
  // ═══════════════════════════════════════════════════════════
  const generateCitation = () => {
    const y = new Date().getFullYear()
    const d = new Date().toLocaleDateString("uz-UZ")
    const url = "https://jdakimyo.uz/oquv/izomeriyasi/stereo/optik/3d"
    switch (citationFormat) {
      case "APA":
        return `Jaka-Kimyo. (${y}). Optik izomeriya — ${currentComplex.formula}: interaktiv 3D vizualizatsiya. jdakimyo.uz. Retrieved ${d}, from ${url}`
      case "MLA":
        return `"Optik izomeriya — ${currentComplex.formula}: Interaktiv 3D vizualizatsiya." Jaka-Kimyo, ${y}, ${url}. Accessed ${d}.`
      case "Chicago":
        return `Jaka-Kimyo. "Optik izomeriya — ${currentComplex.formula}: Interaktiv 3D vizualizatsiya." Accessed ${d}. ${url}.`
      case "BibTeX":
        return `@misc{jdakimyo${y}optik,\n  author = {{Jaka-Kimyo}},\n  title = {Optik izomeriya --- ${currentComplex.formula}: interaktiv 3D vizualizatsiya},\n  year = {${y}},\n  url = {${url}},\n  note = {Accessed ${d}}\n}`
      default:
        return ""
    }
  }

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => alert("Nusxalandi!"))
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 🧬 CD SPEKTRI SVG KOMPONENTI (React ichida)
  // ═══════════════════════════════════════════════════════════
  const CDSpectrumSVG = () => {
    // λ 350-700 nm, Δε peakigi cdMax da
    const cdMax = currentComplex.optical.cdMax.lambda
    const width = 260, height = 140, padding = 24
    const points = []
    const points2 = []
    for (let i = 0; i <= 60; i++) {
      const lam = 350 + (700 - 350) * (i / 60)
      // Gauss shakli
      const deLambda = -1.5 * Math.exp(-((lam - cdMax) ** 2) / (2 * 40 ** 2))
      const deDelta = +1.5 * Math.exp(-((lam - cdMax) ** 2) / (2 * 40 ** 2))
      const x = padding + (i / 60) * (width - 2 * padding)
      const y1 = height / 2 - deLambda * 25
      const y2 = height / 2 - deDelta * 25
      points.push(`${x.toFixed(1)},${y1.toFixed(1)}`)
      points2.push(`${x.toFixed(1)},${y2.toFixed(1)}`)
    }
    return (
      <svg width={width} height={height} className="bg-purple-950/60 rounded-lg">
        {/* Axis */}
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#666" strokeWidth="1" />
        <line x1={padding} y1={padding / 2} x2={padding} y2={height - padding / 2} stroke="#666" strokeWidth="1" />
        {/* Zero line */}
        <text x={padding - 6} y={height / 2 + 3} fill="#999" fontSize="8" textAnchor="end">0</text>
        <text x={padding - 6} y={padding / 2 + 6} fill="#999" fontSize="7" textAnchor="end">+Δε</text>
        <text x={padding - 6} y={height - padding / 2 + 2} fill="#999" fontSize="7" textAnchor="end">−Δε</text>
        <text x={width - padding} y={height - 4} fill="#999" fontSize="8" textAnchor="end">λ (nm)</text>
        <text x={padding} y={height - 4} fill="#999" fontSize="8">350</text>
        <text x={width - padding - 15} y={height - 4} fill="#999" fontSize="8">700</text>
        {/* Λ curve */}
        <polyline points={points.join(" ")} fill="none" stroke="#48dbfb" strokeWidth="2" />
        {/* Δ curve */}
        <polyline points={points2.join(" ")} fill="none" stroke="#f368e0" strokeWidth="2" />
        {/* peak label */}
        <line x1={padding + ((cdMax - 350) / 350) * (width - 2 * padding)} y1={padding / 2}
              x2={padding + ((cdMax - 350) / 350) * (width - 2 * padding)} y2={height - padding / 2}
              stroke="#FFD700" strokeWidth="0.5" strokeDasharray="2,2" />
        <text x={padding + ((cdMax - 350) / 350) * (width - 2 * padding) + 3} y={padding + 4}
              fill="#FFD700" fontSize="8">λmax {cdMax} nm</text>
      </svg>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // 🌊 ORD SPEKTRI SVG
  // ═══════════════════════════════════════════════════════════
  const ORDSpectrumSVG = () => {
    const width = 260, height = 140, padding = 24
    const lam0 = currentComplex.optical.cdMax.lambda
    const points = []
    const points2 = []
    for (let i = 0; i <= 60; i++) {
      const lam = 350 + (700 - 350) * (i / 60)
      // Drude tenglama modeli — Cotton effekti
      const denom = (lam ** 2 - lam0 ** 2) || 1
      let alpha = 100000 / denom
      alpha = Math.max(-3, Math.min(3, alpha))
      const x = padding + (i / 60) * (width - 2 * padding)
      const y1 = height / 2 + alpha * 25 // Λ: manfiy
      const y2 = height / 2 - alpha * 25 // Δ: musbat
      points.push(`${x.toFixed(1)},${y1.toFixed(1)}`)
      points2.push(`${x.toFixed(1)},${y2.toFixed(1)}`)
    }
    return (
      <svg width={width} height={height} className="bg-purple-950/60 rounded-lg">
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#666" strokeWidth="1" />
        <line x1={padding} y1={padding / 2} x2={padding} y2={height - padding / 2} stroke="#666" strokeWidth="1" />
        <text x={padding - 6} y={height / 2 + 3} fill="#999" fontSize="8" textAnchor="end">0</text>
        <text x={padding - 6} y={padding / 2 + 6} fill="#999" fontSize="7" textAnchor="end">+[α]</text>
        <text x={padding - 6} y={height - padding / 2 + 2} fill="#999" fontSize="7" textAnchor="end">−[α]</text>
        <text x={width - padding} y={height - 4} fill="#999" fontSize="8" textAnchor="end">λ (nm)</text>
        <polyline points={points.join(" ")} fill="none" stroke="#48dbfb" strokeWidth="2" />
        <polyline points={points2.join(" ")} fill="none" stroke="#f368e0" strokeWidth="2" />
      </svg>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // 🎨 RENDER (JSX)
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
        className={`w-10 h-5 rounded-full transition-colors ${value ? "bg-green-500" : "bg-purple-800"} relative`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  )

  return (
    <main className={`min-h-screen flex flex-col text-white bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 ${fullscreen ? "" : ""}`}>
      {/* ═══════════════════ HEADER ═══════════════════ */}
      {!fullscreen && (
        <header className="flex items-center gap-3 px-4 py-3 bg-purple-950/90 backdrop-blur-md border-b border-purple-800/50 z-30">
          <Link href="/oquv/izomeriyasi/stereo/optik" className="text-purple-400 hover:text-purple-300">← Orqaga</Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-green-400 truncate">🔮 Optik izomeriya — 3D interaktiv laboratoriya</h1>
            <p className="text-purple-400 text-xs truncate">
              Λ / Δ enantiomerlar • {currentComplex.formula} • {currentComplex.symmetry} simmetriya • jdakimyo.uz
            </p>
          </div>

          {/* Kompleks tanlash */}
          <select
            value={complexId}
            onChange={(e) => setComplexId(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-purple-900/50 text-purple-200 border border-purple-700/50 hover:bg-purple-800/50 cursor-pointer"
          >
            <option value="Coen3">[Co(en)₃]³⁺</option>
            <option value="cisCoen2Cl2">cis-[Co(en)₂Cl₂]⁺</option>
          </select>

          {/* Action tugmalar */}
          <button
            onClick={() => setShowHistoryPanel(v => !v)}
            title="Tarixiy voqealar"
            className="p-2 rounded-lg text-sm bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
          >📖</button>
          <button
            onClick={() => setShowCitationModal(true)}
            title="Iqtibos olish"
            className="p-2 rounded-lg text-sm bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
          >📚</button>
          <button
            onClick={() => setShowPDFModal(true)}
            title="PDF ilmiy hisobot"
            className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg"
          >📄 PDF</button>
          <button
            onClick={() => setFullscreen(true)}
            title="To'liq ekran (F)"
            className="p-2 rounded-lg text-sm bg-purple-900/50 text-purple-300 hover:bg-purple-800/50"
          >🖥️</button>
        </header>
      )}

      {/* Fullscreen close */}
      {fullscreen && (
        <button
          onClick={() => setFullscreen(false)}
          className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-purple-900/80 text-white hover:bg-purple-800 backdrop-blur-md border border-purple-700/50"
        >✕</button>
      )}

      {/* ═══════════════════ 3D CANVAS ═══════════════════ */}
      <div className="flex-1 w-full relative min-h-[500px]" style={{ minHeight: fullscreen ? "100vh" : "auto" }}>
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* ═══════════════════ BOSHQARUV PANELI (draggable) ═══════════════════ */}
        {!fullscreen && (
          <div
            className="absolute z-20 bg-purple-950/95 backdrop-blur-md rounded-xl border border-purple-700/50 w-[280px] shadow-2xl flex flex-col"
            style={{ left: panelPos.x, top: panelPos.y, maxHeight: "calc(100vh - 200px)" }}
          >
            {/* Drag handle */}
            <div
              onMouseDown={handlePanelMouseDown}
              className="cursor-grab active:cursor-grabbing bg-purple-900/60 hover:bg-purple-800/60 px-3 py-2 rounded-t-xl flex items-center justify-between border-b border-purple-800/50"
            >
              <span className="text-sm font-bold text-purple-200">⋮⋮ 🎛️ Boshqaruv paneli</span>
              <span className="text-purple-400 text-xs">(sudrash)</span>
            </div>

            {/* Sections */}
            <div className="overflow-y-auto flex-1">
              {/* Ko'rinish */}
              <Section id="view" title="Ko'rinish" icon="🎨">
                <div className="flex gap-1">
                  {[
                    { v: "ball", l: "🔗", t: "Ball-stick" },
                    { v: "cpk", l: "⚪", t: "CPK" },
                    { v: "wire", l: "🕸️", t: "Sim" }
                  ].map(it => (
                    <button
                      key={it.v}
                      onClick={() => setViewMode(it.v)}
                      title={it.t}
                      className={`flex-1 py-1.5 rounded text-sm ${viewMode === it.v ? "bg-green-500/30 border border-green-500/50" : "bg-purple-900/40 border border-purple-700/40"}`}
                    >{it.l}</button>
                  ))}
                </div>
                <Toggle label="🏷️ Atom yorliqlari (Λ/Δ)" value={showLabels} onChange={setShowLabels} />
                <Toggle label="🪞 Oyna tekisligi" value={showMirrorPlane} onChange={setShowMirrorPlane} />
                <Toggle label="📐 C₃/C₂ simmetriya o'qi" value={showC3Axis} onChange={setShowC3Axis} />
                <Toggle label="🔄 Avto aylanish" value={autoRotate} onChange={setAutoRotate} />
                <Toggle
                  label="⚠️ Superimpozitsiya sinovi"
                  value={superimposeMode}
                  onChange={setSuperimposeMode}
                  note="Λ ustiga Δ ni qo'yish urinishi"
                />
                {complexId === "cisCoen2Cl2" && (
                  <Toggle
                    label="↔️ trans-izomerni ko'rsatish"
                    value={showTransComparison}
                    onChange={setShowTransComparison}
                    note="trans axiral (σh tekislik)"
                  />
                )}
              </Section>

              {/* Optik xossalar */}
              <Section id="optical" title="Optik xossalar" icon="☀️">
                <Toggle
                  label="🌊 Qutblangan yorug'lik"
                  value={showPolarizedBeam}
                  onChange={setShowPolarizedBeam}
                  note="Sinusoidal to'lqin animatsiyasi"
                />
                {showPolarizedBeam && (
                  <div>
                    <div className="text-xs text-purple-300 mb-1">Burilish burchagi α = {rotationAngle}°</div>
                    <input
                      type="range" min="0" max="90" step="1"
                      value={rotationAngle}
                      onChange={(e) => setRotationAngle(Number(e.target.value))}
                      className="w-full accent-yellow-400"
                    />
                  </div>
                )}
                <Toggle
                  label="📊 CD spektri (Sirkulyar dixroizm)"
                  value={showCDSpectrum}
                  onChange={(v) => { setShowCDSpectrum(v); if (v) setActivePanel("cd") }}
                  note="Cotton effekti — Λ vs Δ peak ishoralari"
                />
                <Toggle
                  label="🌈 ORD spektri (Optik burilish dispersiyasi)"
                  value={showORDSpectrum}
                  onChange={(v) => { setShowORDSpectrum(v); if (v) setActivePanel("ord") }}
                  note="Drude tenglamasi bo'yicha"
                />
                <div>
                  <div className="text-xs text-purple-300 mb-1">
                    Enantiomer ortiqchaligi (ee) = {enantiomericExcess}%
                  </div>
                  <input
                    type="range" min="0" max="100" step="1"
                    value={enantiomericExcess}
                    onChange={(e) => setEnantiomericExcess(Number(e.target.value))}
                    className="w-full accent-pink-400"
                  />
                  <div className="flex justify-between text-[10px] text-purple-400 mt-0.5">
                    <span>Rasemik (±)</span>
                    <span>Sof enantiomer</span>
                  </div>
                </div>
              </Section>

              {/* Xirallik va nomenklatura */}
              <Section id="chirality" title="Xirallik va CIP" icon="🧬">
                <button
                  onClick={() => setActivePanel("cip")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40"
                >📖 Λ / Δ nomenklaturasi (IUPAC 2005)</button>
                <button
                  onClick={() => setActivePanel("werner")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40"
                >⚗️ Werner tajribasi (1911)</button>
                <button
                  onClick={() => setActivePanel("bijvoet")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40"
                >💎 Bijvoet metodi (1951)</button>
              </Section>

              {/* Rasemizatsiya kinetikasi */}
              <Section id="kinetics" title="Rasemizatsiya" icon="⚗️">
                <Toggle
                  label="🔁 Rasemizatsiya vizual"
                  value={showRacemization}
                  onChange={setShowRacemization}
                  note="Λ ↔ Δ konversiya jarayoni"
                />
                <div>
                  <div className="text-xs text-purple-300 mb-1">
                    Harorat T = {temperature} K ({(temperature - 273).toFixed(0)} °C)
                  </div>
                  <input
                    type="range" min="273" max="450" step="1"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full accent-red-400"
                  />
                  <div className="text-[10px] text-purple-400 mt-1">
                    Arrenius: k = A·exp(−Ea/RT). Yuqori T → tez rasemizatsiya.
                  </div>
                </div>
                <button
                  onClick={() => setActivePanel("pasteur")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40"
                >🧪 Pasteur ajratish (1848)</button>
              </Section>

              {/* Ilmiy tahlil */}
              <Section id="science" title="Ilmiy tahlil" icon="🔬">
                <button
                  onClick={() => setActivePanel("info")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40"
                >ℹ️ Kompleks ma'lumotlari</button>
                <button
                  onClick={() => setActivePanel("cd")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40"
                >📊 CD spektri paneli</button>
                <button
                  onClick={() => setActivePanel("ord")}
                  className="w-full px-2 py-1.5 rounded bg-purple-900/40 border border-purple-700/40 text-xs text-purple-200 hover:bg-purple-800/40"
                >🌈 ORD spektri paneli</button>
                <button
                  onClick={() => setActivePanel("talidomid")}
                  className="w-full px-2 py-1.5 rounded bg-pink-900/40 border border-pink-700/40 text-xs text-pink-200 hover:bg-pink-800/40"
                >⚠️ Talidomid darsi</button>
              </Section>
            </div>
          </div>
        )}

        {/* ═══════════════════ MA'LUMOT PANELI (o'ng) ═══════════════════ */}
        {!fullscreen && activePanel && (
          <div className="absolute top-3 right-3 z-30 w-[300px] max-h-[calc(100vh-200px)] overflow-y-auto bg-purple-950/95 backdrop-blur-md rounded-xl border border-purple-700/50 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-green-400">
                {activePanel === "info" && "ℹ️ Kompleks ma'lumotlari"}
                {activePanel === "cd" && "📊 CD spektri"}
                {activePanel === "ord" && "🌈 ORD spektri"}
                {activePanel === "cip" && "📖 Λ/Δ nomenklaturasi"}
                {activePanel === "werner" && "⚗️ Werner tajribasi (1911)"}
                {activePanel === "bijvoet" && "💎 Bijvoet metodi (1951)"}
                {activePanel === "pasteur" && "🧪 Pasteur (1848)"}
                {activePanel === "talidomid" && "⚠️ Talidomid darsi"}
              </h3>
              <button
                onClick={() => setActivePanel(null)}
                className="text-purple-400 hover:text-purple-200 text-lg leading-none"
              >×</button>
            </div>

            {/* INFO */}
            {activePanel === "info" && (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-purple-400">Formula:</div>
                  <div className="text-white font-mono">{currentComplex.formula}</div>
                  <div className="text-purple-400">Tuz:</div>
                  <div className="text-white">{currentComplex.fullSalt}</div>
                  <div className="text-purple-400">IUPAC nomi:</div>
                  <div className="text-white">{currentComplex.name}</div>
                  <div className="text-purple-400">Simmetriya:</div>
                  <div className="text-white">{currentComplex.symmetry} ({currentComplex.chirality.pointGroup})</div>
                  <div className="text-purple-400">Gibridlanish:</div>
                  <div className="text-white">{currentComplex.hybridization}</div>
                  <div className="text-purple-400">Magnit:</div>
                  <div className="text-white">{currentComplex.magnetism}</div>
                  <div className="text-purple-400">Rang:</div>
                  <div className="text-white">{currentComplex.color}</div>
                  <div className="text-purple-400">Co–N (Å):</div>
                  <div className="text-white">{currentComplex.bondLengthReal}</div>
                </div>
                <div className="pt-2 border-t border-purple-800/50">
                  <div className="text-purple-300 font-semibold mb-1">Optik faollik:</div>
                  <div className="flex justify-between">
                    <span className="text-cyan-300">Λ: {currentComplex.optical.alphaD_lambda}°</span>
                    <span className="text-pink-300">Δ: +{currentComplex.optical.alphaD_delta}°</span>
                  </div>
                  <div className="text-purple-400 mt-1">λ = {currentComplex.optical.wavelength} nm (Na D)</div>
                </div>
                <div className="pt-2 border-t border-purple-800/50">
                  <div className="text-purple-300 italic">{currentComplex.scientificNotes}</div>
                </div>
              </div>
            )}

            {/* CD */}
            {activePanel === "cd" && (
              <div className="space-y-2 text-xs">
                <CDSpectrumSVG />
                <div className="text-purple-200">
                  <strong>Sirkulyar Dixroizm (CD)</strong> — Δε = εL − εR
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <div>
                    <div className="text-cyan-400 font-bold">Λ</div>
                    <div className="text-purple-300">peak: −{" "}({currentComplex.optical.cdMax.lambda} nm)</div>
                    <div className="text-purple-400">Manfiy Cotton</div>
                  </div>
                  <div>
                    <div className="text-pink-400 font-bold">Δ</div>
                    <div className="text-purple-300">peak: + ({currentComplex.optical.cdMax.delta} nm)</div>
                    <div className="text-purple-400">Musbat Cotton</div>
                  </div>
                </div>
                <div className="text-purple-300 pt-2 border-t border-purple-800/50">
                  d–d o'tishi: ¹A₁g → ¹T₁g. CD peak d-orbital splitting bilan bog'liq (Δo ≈ {currentComplex.dOrbital.deltaO} cm⁻¹).
                </div>
              </div>
            )}

            {/* ORD */}
            {activePanel === "ord" && (
              <div className="space-y-2 text-xs">
                <ORDSpectrumSVG />
                <div className="text-purple-200">
                  <strong>Optik burilish dispersiyasi (ORD)</strong>
                </div>
                <div className="font-mono text-purple-300 text-[11px]">
                  [α]λ = k / (λ² − λ₀²)
                </div>
                <div className="text-purple-300">
                  Drude tenglamasi — absorbsion band yaqinida [α] anomal (Cotton effekti).
                  Bu absolyut konfiguratsiyani aniqlashning muhim usuli.
                </div>
              </div>
            )}

            {/* CIP */}
            {activePanel === "cip" && (
              <div className="space-y-2 text-xs text-purple-200">
                <p>
                  <strong className="text-green-400">IUPAC 2005 (Red Book)</strong> tris-xelat komplekslar uchun
                  <strong> Λ</strong> va <strong>Δ</strong> stereodeskriptorlarini standartlashtiradi.
                </p>
                <div className="bg-purple-900/40 rounded p-2 border-l-2 border-cyan-400">
                  <div className="text-cyan-400 font-bold">Λ (lambda)</div>
                  <div>Chap qo'l vint (soat miliga qarshi)</div>
                  <div className="text-purple-400 mt-1">Sinonim: M-konfiguratsiya</div>
                </div>
                <div className="bg-purple-900/40 rounded p-2 border-l-2 border-pink-400">
                  <div className="text-pink-400 font-bold">Δ (delta)</div>
                  <div>O'ng qo'l vint (soat mili yo'nalishida)</div>
                  <div className="text-purple-400 mt-1">Sinonim: P-konfiguratsiya</div>
                </div>
                <p className="text-purple-300 italic">
                  R/S — organik molekulalar (uglerod stereo-markazi) uchun. Λ/Δ — xelat komplekslar uchun.
                </p>
              </div>
            )}

            {/* WERNER */}
            {activePanel === "werner" && (
              <div className="space-y-2 text-xs text-purple-200">
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded p-2 border border-yellow-700/40">
                  <div className="text-yellow-400 font-bold">🏆 1913 Nobel mukofoti</div>
                  <div className="text-purple-300 text-[11px]">Alfred Werner (1866-1919), Sюrix</div>
                </div>
                <p>
                  Werner 1911-yilda <strong>[Co(en)₃]³⁺</strong> ni <strong>d-tartrat</strong> kislotasi bilan
                  diastereomer kristallizatsiya usulida ajratdi.
                </p>
                <div className="bg-purple-900/40 rounded p-2 font-mono text-[10px] text-cyan-300">
                  (±)-[Co(en)₃]³⁺ + 2 d-tart²⁻<br />
                  → Λ-[Co(en)₃][d-tart] + Δ-[Co(en)₃][d-tart]
                </div>
                <p className="text-purple-300">
                  Bu — <strong>uglerodsiz xirallik</strong>ning birinchi eksperimental isboti.
                  Koordinatsion kimyoning mustaqil fan sifatida tug'ilishi.
                </p>
              </div>
            )}

            {/* BIJVOET */}
            {activePanel === "bijvoet" && (
              <div className="space-y-2 text-xs text-purple-200">
                <p>
                  <strong className="text-cyan-400">J. M. Bijvoet (1951)</strong> anomal X-nur difraksiyasi
                  (Zn Kα, λ=1.435 Å) yordamida <strong>absolyut konfiguratsiya</strong>ni
                  birinchi marta aniqladi.
                </p>
                <p>
                  Undan avval R/S va Λ/Δ belgilari faqat <em>nisbiy</em> edi
                  (Fisher-Rosanoff konvensiyasi). Bijvoet metodi bilan koordinatsion
                  komplekslarning <em>haqiqiy</em> 3D tuzilishi tasdiqlandi.
                </p>
                <div className="bg-purple-900/40 rounded p-2">
                  <div className="text-purple-300 text-[11px]">
                    <strong>Ish tamoyili:</strong> og'ir atom yaqinida anomal dispersiya
                    Friedel qonunini buzadi → Bijvoet juftlari (hkl vs h̄k̄l̄) farqlanadi.
                  </div>
                </div>
              </div>
            )}

            {/* PASTEUR */}
            {activePanel === "pasteur" && (
              <div className="space-y-2 text-xs text-purple-200">
                <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/30 rounded p-2 border border-purple-700/40">
                  <div className="text-pink-400 font-bold">🧪 Louis Pasteur (1848)</div>
                  <div className="text-purple-300 text-[11px]">Xirallikning birinchi eksperimental isboti</div>
                </div>
                <p>
                  Pasteur mikroskop ostida <strong>natriy-ammoniy tartrat</strong> kristallarini
                  qo'lda pintset yordamida ajratdi — hemihedral yuzlarining chap va o'ng shakli
                  bo'yicha.
                </p>
                <p className="text-purple-300">
                  Har bir ajratilgan to'plam qutblangan yorug'likni <strong>teskari yo'nalishda</strong> burdi
                  — bu enantiomerlar mavjudligini isbotladi. 60 yildan keyin Werner shu usulni
                  koordinatsion komplekslarga qo'lladi.
                </p>
              </div>
            )}

            {/* TALIDOMID */}
            {activePanel === "talidomid" && (
              <div className="space-y-2 text-xs text-purple-200">
                <div className="bg-red-950/40 rounded p-2 border border-red-700/40">
                  <div className="text-red-400 font-bold">⚠️ Talidomid halokati (1957-1962)</div>
                  <div className="text-red-200/70 text-[11px]">Enantiomer farqlarining dahshatli darsi</div>
                </div>
                <p>
                  Talidomid rasemik dori sifatida 46 mamlakatda homilador ayollarga tinchlantiruvchi va
                  antiemetik dori sifatida sotildi.
                </p>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <div className="bg-green-900/30 p-1.5 rounded border border-green-700/40">
                    <div className="text-green-400 font-bold">R-enantiomer</div>
                    <div className="text-green-200/80">Terapevtik ta'sir</div>
                  </div>
                  <div className="bg-red-900/30 p-1.5 rounded border border-red-700/40">
                    <div className="text-red-400 font-bold">S-enantiomer</div>
                    <div className="text-red-200/80">Teratogen ta'sir</div>
                  </div>
                </div>
                <p className="text-purple-300">
                  10 000+ chaqaloq fokomeliya bilan tug'ildi. Bu voqea FDA/EMA ni har ikkala
                  enantiomerni alohida sinash talab qilishga majburladi. <strong>"Chiral switch"</strong> — hozirgi
                  dorishunoslikning asosiy paradigmasi.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ TARIX PANELI ═══════════════════ */}
        {showHistoryPanel && !fullscreen && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-2xl max-h-[50vh] overflow-y-auto bg-purple-950/95 backdrop-blur-md rounded-xl border border-yellow-700/50 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-yellow-400">📖 Optik izomeriya tarixi</h3>
              <button
                onClick={() => setShowHistoryPanel(false)}
                className="text-purple-400 hover:text-purple-200 text-xl leading-none"
              >×</button>
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

        {/* ═══════════════════ KLAVIATURA HINT ═══════════════════ */}
        {!fullscreen && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-purple-950/70 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] text-purple-300 z-10 border border-purple-800/50 pointer-events-none">
            🖱️ aylantirish · 🔍 zoom · <b>F</b> to'liq ekran · <b>M</b> oyna · <b>P</b> nur · <b>S</b> superimpoze · <b>1/2</b> kompleks
          </div>
        )}
      </div>

      {/* ═══════════════════ FOOTER STATS ═══════════════════ */}
      {!fullscreen && (
        <>
          <div className="bg-purple-950/90 backdrop-blur-md border-t border-purple-800/50 z-10">
            <div className="flex justify-center gap-3 sm:gap-6 py-2 px-3 sm:px-6 flex-wrap text-xs">
              <div className="flex flex-col items-center">
                <span className="text-purple-400 text-[10px]">Simmetriya</span>
                <span className="text-white font-bold">{currentComplex.symmetry}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-purple-400 text-[10px]">[α]D (Λ)</span>
                <span className="text-cyan-300 font-bold">{currentComplex.optical.alphaD_lambda}°</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-purple-400 text-[10px]">[α]D (Δ)</span>
                <span className="text-pink-300 font-bold">+{currentComplex.optical.alphaD_delta}°</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-purple-400 text-[10px]">λmax CD</span>
                <span className="text-yellow-300 font-bold">{currentComplex.optical.cdMax.lambda} nm</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-purple-400 text-[10px]">Δo</span>
                <span className="text-white font-bold">{currentComplex.dOrbital.deltaO} cm⁻¹</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-purple-400 text-[10px]">Gibridlanish</span>
                <span className="text-white font-bold">{currentComplex.hybridization}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-purple-400 text-[10px]">Xiral</span>
                <span className="text-green-300 font-bold">✓ Λ / Δ</span>
              </div>
            </div>
            {/* Legend */}
            <div className="flex justify-center gap-3 sm:gap-5 py-2 px-4 bg-purple-950/60 border-t border-purple-800/30 flex-wrap text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#F090A0" }}></div>
                <span className="text-purple-300">Co (markaz)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#3050F8" }}></div>
                <span className="text-purple-300">N (en donor)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#909090" }}></div>
                <span className="text-purple-300">C (en ko'prigi)</span>
              </div>
              {complexId === "cisCoen2Cl2" && (
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#1FF01F" }}></div>
                  <span className="text-purple-300">Cl (ligand)</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#48dbfb" }}></div>
                <span className="text-cyan-300 font-semibold">Λ (chapga)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#f368e0" }}></div>
                <span className="text-pink-300 font-semibold">Δ (o'ngga)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#FFD700" }}></div>
                <span className="text-yellow-300">Simmetriya elementi</span>
              </div>
            </div>
            {/* Ilmiy izoh */}
            <div className="text-center py-2 px-4 bg-purple-950/40 border-t border-purple-800/20 text-[11px] text-purple-400 italic">
              {currentComplex.formula} • Nuqta guruh {currentComplex.chirality.pointGroup} • σ = 0 • Sn = yo'q • xiral molekula • Werner (1911), Nobel 1913
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════ PDF MODAL ═══════════════════ */}
      {showPDFModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-950 to-indigo-950 rounded-2xl border border-purple-700/50 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-purple-800/50">
              <div>
                <h2 className="text-lg font-bold text-green-400">📄 Ilmiy Hisobot — PDF eksport</h2>
                <p className="text-purple-400 text-xs">Optik izomeriya: {currentComplex.formula}</p>
              </div>
              <button
                onClick={() => setShowPDFModal(false)}
                className="text-purple-400 hover:text-purple-200 text-2xl leading-none"
              >×</button>
            </div>

            <div className="p-4 space-y-3">
              {/* Quick select */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPdfSections({
                    chirality: true, cip: true, optical: true,
                    cd: true, ord: true, werner: true,
                    pasteur: false, bijvoet: false, table: true,
                    talidomid: false, references: true
                  })}
                  className="flex-1 px-3 py-1.5 rounded text-xs bg-purple-800/40 text-purple-200 border border-purple-700/50 hover:bg-purple-700/40"
                >Standart</button>
                <button
                  onClick={() => setPdfSections({
                    chirality: true, cip: true, optical: true,
                    cd: true, ord: true, werner: true,
                    pasteur: true, bijvoet: true, table: true,
                    talidomid: true, references: true
                  })}
                  className="flex-1 px-3 py-1.5 rounded text-xs bg-gradient-to-r from-purple-700 to-pink-700 text-white font-semibold"
                >To'liq (ilmiy)</button>
                <button
                  onClick={() => setPdfSections({
                    chirality: false, cip: false, optical: false,
                    cd: false, ord: false, werner: false,
                    pasteur: false, bijvoet: false, table: false,
                    talidomid: false, references: false
                  })}
                  className="flex-1 px-3 py-1.5 rounded text-xs bg-red-900/30 text-red-300 border border-red-700/40 hover:bg-red-800/40"
                >Tozalash</button>
              </div>

              {/* Sections list */}
              <div className="text-xs text-purple-300 uppercase font-bold pt-2">Bo'limlarni tanlang:</div>
              {[
                { k: "chirality", l: "1. 🧬 Xirallik — ta'rif va matematik asoslar" },
                { k: "cip", l: "2. 📖 Λ/Δ nomenklatura (IUPAC 2005 Red Book)" },
                { k: "optical", l: "3. ☀️ Optik faollik — Biot qonuni va [α]D" },
                { k: "cd", l: "4. 📊 Sirkulyar Dixroizm (CD) — Cotton effekti" },
                { k: "ord", l: "5. 🌈 Optik Burilish Dispersiyasi (ORD) — Drude" },
                { k: "werner", l: "6. ⚗️ Werner tajribasi (1911) — Nobel 1913" },
                { k: "pasteur", l: "7. 🧪 Pasteur (1848) va rasemizatsiya kinetikasi" },
                { k: "bijvoet", l: "8. 💎 Bijvoet metodi (1951) — absolyut konfiguratsiya" },
                { k: "table", l: "9. 📋 Λ vs Δ solishtirish jadvali" },
                { k: "talidomid", l: "10. ⚠️ Talidomid darsi va dorishunoslik" },
                { k: "references", l: "11. 📚 Foydalanilgan adabiyotlar (13 manba)" }
              ].map(it => (
                <label key={it.k} className="flex items-center gap-2 text-sm text-purple-200 cursor-pointer hover:bg-purple-900/30 p-1.5 rounded">
                  <input
                    type="checkbox"
                    checked={pdfSections[it.k] || false}
                    onChange={(e) => setPdfSections(s => ({ ...s, [it.k]: e.target.checked }))}
                    className="accent-green-500"
                  />
                  <span>{it.l}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 p-4 border-t border-purple-800/50">
              <button
                onClick={() => setShowPDFModal(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm bg-purple-900/40 text-purple-300 hover:bg-purple-800/40"
              >Bekor qilish</button>
              <button
                onClick={generatePDF}
                disabled={pdfGenerating}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
              <button
                onClick={() => setShowCitationModal(false)}
                className="text-purple-400 hover:text-purple-200 text-2xl leading-none"
              >×</button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2 flex-wrap">
                {["APA", "MLA", "Chicago", "BibTeX"].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setCitationFormat(fmt)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold ${citationFormat === fmt ? "bg-green-500/30 text-green-200 border border-green-500/50" : "bg-purple-900/40 text-purple-300 border border-purple-700/40"}`}
                  >{fmt}</button>
                ))}
              </div>
              <textarea
                readOnly
                value={generateCitation()}
                className="w-full h-32 p-3 bg-purple-900/30 border border-purple-700/40 rounded text-xs text-purple-200 font-mono resize-none"
              />
              <button
                onClick={() => copyToClipboard(generateCitation())}
                className="w-full px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500"
              >📋 Nusxa olish</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
