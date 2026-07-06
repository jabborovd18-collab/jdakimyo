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
    snapshot: true, info: true, chirality: true, optical: true,
    cd: true, ord: true, cip: true, werner: true,
    pasteur: false, bijvoet: false, talidomid: false, references: true
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
  // 📄 PDF EKSPORT — ILMIY MAQOLA USLUBIDA (optik izomeriya)
  // ═══════════════════════════════════════════════════════════
  const generatePDF = useCallback(async () => {
    if (pdfGenerating) return
    setPdfGenerating(true)
    try {
      const pdfDoc = await PDFDocument.create()
      pdfDoc.registerFontkit(fontkit)

      // ── Font yuklash (Unicode-mos font — Λ, Δ, ₃, α, ° va boshqa simvollar uchun) ──
      // Bir necha CDN manba: birinchisi ishlamasa, keyingisi sinaladi
      const fontCandidates = [
        {
          regular: "https://cdn.jsdelivr.net/npm/@fontsource/dejavu-sans@5.0.3/files/dejavu-sans-latin-400-normal.woff",
          bold:    "https://cdn.jsdelivr.net/npm/@fontsource/dejavu-sans@5.0.3/files/dejavu-sans-latin-700-normal.woff",
          italic:  "https://cdn.jsdelivr.net/npm/@fontsource/dejavu-sans@5.0.3/files/dejavu-sans-latin-400-italic.woff"
        },
        {
          regular: "https://cdn.jsdelivr.net/gh/dejavu-fonts/dejavu-fonts@version_2_37/ttf/DejaVuSans.ttf",
          bold:    "https://cdn.jsdelivr.net/gh/dejavu-fonts/dejavu-fonts@version_2_37/ttf/DejaVuSans-Bold.ttf",
          italic:  "https://cdn.jsdelivr.net/gh/dejavu-fonts/dejavu-fonts@version_2_37/ttf/DejaVuSans-Oblique.ttf"
        },
        {
          // Noto Sans — Google Fonts, Unicode qamrovi keng
          regular: "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.0.20/files/noto-sans-latin-400-normal.ttf",
          bold:    "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.0.20/files/noto-sans-latin-700-normal.ttf",
          italic:  "https://cdn.jsdelivr.net/npm/@fontsource/noto-sans@5.0.20/files/noto-sans-latin-400-italic.ttf"
        }
      ]

      let font, fontBold, fontItalic
      let unicodeFont = false // Unicode font muvaffaqiyatli yuklandi/yuklanmadi bayrog'i

      for (const set of fontCandidates) {
        try {
          const [fBytes, fbBytes, fiBytes] = await Promise.all([
            fetch(set.regular).then(r => { if (!r.ok) throw new Error("font fetch failed"); return r.arrayBuffer() }),
            fetch(set.bold).then(r => { if (!r.ok) throw new Error("font fetch failed"); return r.arrayBuffer() }),
            fetch(set.italic).then(r => { if (!r.ok) throw new Error("font fetch failed"); return r.arrayBuffer() })
          ])
          font = await pdfDoc.embedFont(fBytes, { subset: true })
          fontBold = await pdfDoc.embedFont(fbBytes, { subset: true })
          fontItalic = await pdfDoc.embedFont(fiBytes, { subset: true })
          unicodeFont = true
          break
        } catch (e) {
          // keyingi manbaga o'tamiz
          continue
        }
      }

      // Agar barcha manbalar ishlamasa — StandardFonts (WinAnsi) ga tushamiz
      if (!unicodeFont) {
        font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
        fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
      }

      // ── Unicode → ASCII transliteratsiya jadvali (fallback rejim uchun) ──
      // Unicode font yuklanmagan bo'lsa, WinAnsi ishlata olmaydigan belgilarni almashtiramiz
      const asciiMap = {
        "Λ": "Lambda", "Δ": "Delta", "λ": "lambda", "α": "alpha", "β": "beta",
        "γ": "gamma", "δ": "delta", "ε": "epsilon", "π": "pi", "σ": "sigma",
        "θ": "theta", "μ": "mu", "η": "eta", "ν": "nu", "ρ": "rho", "φ": "phi",
        "ω": "omega", "Σ": "Sigma", "Ω": "Omega",
        "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5",
        "₆": "6", "₇": "7", "₈": "8", "₉": "9", "₊": "+", "₋": "-",
        "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5",
        "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁺": "+", "⁻": "-",
        "°": " deg", "±": "+/-", "×": "x", "÷": "/", "≤": "<=", "≥": ">=",
        "≈": "~", "≠": "!=", "→": "->", "←": "<-", "↔": "<->", "⇌": "<=>",
        "↑": "^", "↓": "v",
        "·": ".", "•": "*", "–": "-", "—": "--", "…": "...",
        "\u2018": "'", "\u2019": "'", "\u201C": '"', "\u201D": '"',
        "Å": "A", "℃": "C", "℉": "F", "¼": "1/4", "½": "1/2", "¾": "3/4",
        "🪞": "[mirror]", "⚗️": "", "🧪": "", "📚": "", "📄": "",
        "🏆": "", "💎": "", "⚠️": "", "🔮": "", "☀️": "", "📊": "",
        "🌈": "", "📖": "", "🧬": "", "🎨": "", "🔬": ""
      }
      const toAscii = (s) => {
        let out = String(s || "")
        for (const [uni, ascii] of Object.entries(asciiMap)) {
          out = out.split(uni).join(ascii)
        }
        // Qolgan barcha non-WinAnsi belgilarni tashlab yuboramiz
        return out.replace(/[^\x20-\x7E\xA0-\xFF]/g, "?")
      }

      // ── Ranglar (jdakimyo.uz brand) ──
      const C = {
        purple: rgb(0.42, 0.29, 0.70),
        purpleDark: rgb(0.29, 0.20, 0.55),
        cyan: rgb(0.28, 0.86, 0.98),   // Λ
        pink: rgb(0.95, 0.41, 0.88),    // Δ
        gold: rgb(1.0, 0.84, 0.0),
        text: rgb(0.10, 0.10, 0.15),
        subtle: rgb(0.45, 0.45, 0.55),
        line: rgb(0.85, 0.85, 0.90),
        bg: rgb(0.97, 0.96, 0.99),
        green: rgb(0.20, 0.65, 0.35),
        red: rgb(0.85, 0.20, 0.20)
      }

      // ── A4 sahifa ──
      const PW = 595.28, PH = 841.89, M = 55
      let page = pdfDoc.addPage([PW, PH])
      let y = PH - M

      // ── Xavfsiz drawText helper — unicode font yuklanmagan bo'lsa avtomatik ASCII ──
      // targetPage ixtiyoriy: agar berilmasa, joriy `page` ni ishlatadi (footer uchun qulay)
      const drawText = (text, x, yPos, opts = {}) => {
        const { size = 10, font: f = font, color: col = C.text, maxWidth = PW - 2 * M, targetPage = null } = opts
        const tp = targetPage || page
        let cleaned = cleanText(text) || ""
        // Agar Unicode font yuklanmagan bo'lsa — oldindan ASCII ga o'giramiz
        if (!unicodeFont) cleaned = toAscii(cleaned)
        try {
          tp.drawText(cleaned, { x, y: yPos, size, font: f, color: col, maxWidth })
        } catch {
          // Fallback: hatto Unicode font yuklangan bo'lsa ham, agar biror belgi glyph'da yo'q bo'lsa
          try {
            tp.drawText(toAscii(cleaned), { x, y: yPos, size, font: f, color: col, maxWidth })
          } catch {
            // So'nggi chora — xatoni yutamiz, PDF hosil qilishni to'xtatmasin
            try { tp.drawText("?", { x, y: yPos, size, font: f, color: col }) } catch {}
          }
        }
      }
      const wrapText = (text, maxCharsPerLine) => {
        const words = String(text || "").split(/\s+/)
        const lines = []
        let cur = ""
        for (const w of words) {
          if ((cur + " " + w).trim().length > maxCharsPerLine) {
            if (cur) lines.push(cur.trim())
            cur = w
          } else {
            cur = (cur + " " + w).trim()
          }
        }
        if (cur) lines.push(cur.trim())
        return lines
      }
      const newPageIfNeeded = (h = 40) => {
        if (y - h < M + 40) {
          page = pdfDoc.addPage([PW, PH])
          y = PH - M
        }
      }
      const sectionHeader = (num, title) => {
        newPageIfNeeded(50)
        page.drawRectangle({
          x: M - 5, y: y - 4, width: PW - 2 * M + 10, height: 22,
          color: C.purpleDark
        })
        drawText(`${num}. ${title}`, M + 5, y + 4, {
          size: 12, font: fontBold, color: rgb(1, 1, 1)
        })
        y -= 32
      }
      const drawTable = (rows, colWidths, opts = {}) => {
        const { headerBg = C.purple, rowH = 18 } = opts
        const startX = M
        rows.forEach((row, ri) => {
          newPageIfNeeded(rowH + 4)
          const isHeader = ri === 0
          if (isHeader) {
            page.drawRectangle({
              x: startX, y: y - rowH + 4, width: colWidths.reduce((a, b) => a + b, 0),
              height: rowH, color: headerBg
            })
          } else if (ri % 2 === 0) {
            page.drawRectangle({
              x: startX, y: y - rowH + 4, width: colWidths.reduce((a, b) => a + b, 0),
              height: rowH, color: C.bg
            })
          }
          let cx = startX + 5
          row.forEach((cell, ci) => {
            drawText(cell, cx, y - 8, {
              size: 9,
              font: isHeader ? fontBold : font,
              color: isHeader ? rgb(1, 1, 1) : C.text,
              maxWidth: colWidths[ci] - 8
            })
            cx += colWidths[ci]
          })
          y -= rowH
        })
        y -= 8
      }
      const drawParagraph = (text, opts = {}) => {
        const { size = 10, indent = 0, italic = false } = opts
        const maxChars = Math.floor((PW - 2 * M - indent) / (size * 0.5))
        const lines = wrapText(text, maxChars)
        lines.forEach(line => {
          newPageIfNeeded(14)
          drawText(line, M + indent, y, {
            size, font: italic ? fontItalic : font, color: C.text,
            maxWidth: PW - 2 * M - indent
          })
          y -= size + 4
        })
        y -= 4
      }

      // ═════════════════════════════════════════════════════════
      // BOSH SAHIFA
      // ═════════════════════════════════════════════════════════
      // Yuqori dekorativ chiziq
      page.drawRectangle({
        x: 0, y: PH - 25, width: PW, height: 25, color: C.purple
      })
      drawText("JDA-KIMYO • ILMIY BYULLETEN'", M, PH - 17, {
        size: 10, font: fontBold, color: rgb(1, 1, 1)
      })
      drawText(new Date().toLocaleDateString("uz-UZ"), PW - M - 60, PH - 17, {
        size: 9, font, color: rgb(1, 1, 1)
      })

      y = PH - 60

      // Sarlavha
      drawText("OPTIK IZOMERIYA", M, y, { size: 22, font: fontBold, color: C.purpleDark })
      y -= 26
      drawText("Koordinatsion birikmalarda xirallik va enantiomerlar", M, y, {
        size: 13, font: fontItalic, color: C.subtle
      })
      y -= 20

      // Chiziq
      page.drawLine({
        start: { x: M, y: y }, end: { x: PW - M, y: y },
        thickness: 2, color: C.gold
      })
      y -= 18

      // Meta table
      drawText("Tadqiqot obyekti:", M, y, { size: 10, font: fontBold, color: C.purpleDark })
      drawText(currentComplex.formula + " (" + currentComplex.name + ")", M + 110, y, { size: 10, font, color: C.text })
      y -= 15
      drawText("Simmetriya guruhi:", M, y, { size: 10, font: fontBold, color: C.purpleDark })
      drawText(currentComplex.symmetry + " (nuqta guruhi)", M + 110, y, { size: 10, font, color: C.text })
      y -= 15
      drawText("Enantiomer jufti:", M, y, { size: 10, font: fontBold, color: C.purpleDark })
      drawText("Λ (lambda) / Δ (delta) — chap va o'ng qo'l propeller", M + 110, y, { size: 10, font, color: C.text })
      y -= 15
      drawText("Optik faollik [α]D:", M, y, { size: 10, font: fontBold, color: C.purpleDark })
      drawText(`${currentComplex.optical.alphaD_lambda}° (Λ) / +${currentComplex.optical.alphaD_delta}° (Δ) at ${currentComplex.optical.wavelength} nm`, M + 110, y, { size: 10, font, color: C.text })
      y -= 25

      // Annotatsiya
      drawText("ANNOTATSIYA", M, y, { size: 11, font: fontBold, color: C.purpleDark })
      y -= 15
      page.drawLine({
        start: { x: M, y: y + 3 }, end: { x: M + 100, y: y + 3 },
        thickness: 1, color: C.purple
      })
      y -= 5
      drawParagraph(
        `Ushbu hisobotda ${currentComplex.formula} kompleksining optik izomeriyasi ` +
        `atroflicha o'rganilgan. Λ va Δ enantiomerlarining fazoviy tuzilishi, xirallikning ` +
        `matematik asoslari (nuqta guruhi ${currentComplex.symmetry}, Sn simmetriya elementlarining yo'qligi), ` +
        `qutblangan yorug'likka ta'siri (optik faollik), CD (sirkulyar dixroizm) va ORD ` +
        `(optik burilish dispersiyasi) spektrlari, ajratish usullari (Pasteur-Werner metodi) va ` +
        `biologik ahamiyati (Talidomid halokati, dorishunoslik) tavsiflangan. ` +
        `${currentComplex.scientificNotes}`
      )

      // ═════════════════════════════════════════════════════════
      // 1. XIRALLIK VA UNING SHARTLARI
      // ═════════════════════════════════════════════════════════
      if (pdfSections.chirality) {
        sectionHeader("1", "XIRALLIK VA UNING SHARTLARI")
        drawParagraph(
          "Xirallik (yun. cheir — qo'l) — molekulaning o'z oyna aksi bilan ustma-ust " +
          "qo'yilmaslik xususiyati. Xiral molekula va uning oyna aksi enantiomerlar deb ataladi. " +
          "Bir molekula xiral bo'lishi uchun quyidagi shartlar bajarilishi kerak:"
        )
        drawTable([
          ["Shart", "Ta'rif", "Bizning kompleks"],
          ["S1 (σ) tekislik yo'q", "Simmetriya tekisligi bo'lmasligi", "σ = " + currentComplex.chirality.sigmaCount],
          ["S2 (i) markaz yo'q", "Inversiya markazi bo'lmasligi", "i = yo'q"],
          ["Sn o'q yo'q (n≥1)", "Nomtaraf aylanish o'qi bo'lmasligi", "Sn = " + currentComplex.chirality.sn],
          ["Faqat Cn ruxsat", "Sof aylanish o'qlari mumkin", currentComplex.symmetry + " ruxsat"]
        ], [130, 220, 135])
        drawParagraph(
          `${currentComplex.formula} kompleksining nuqta guruhi ${currentComplex.chirality.pointGroup} ` +
          `— faqat sof aylanish o'qlaridan iborat. Bu — xiral molekula ekanligining rasmiy isboti.`
        )
      }

      // ═════════════════════════════════════════════════════════
      // 2. Λ / Δ NOMENKLATURA (CIP QOIDASI)
      // ═════════════════════════════════════════════════════════
      if (pdfSections.cip) {
        sectionHeader("2", "Λ/Δ NOMENKLATURA (IUPAC 2005)")
        drawParagraph(
          "Koordinatsion birikmalarda xirallikni ifodalash uchun IUPAC (2005 Red Book) tavsiya etgan " +
          "usul — Λ (lambda) va Δ (delta) stereodeskriptorlari. Bu belgilar molekula C₃ (yoki asosiy Cn) " +
          "o'qi bo'ylab qaralganda xelat halqalarining aylanish yo'nalishini ko'rsatadi:"
        )
        drawTable([
          ["Deskriptor", "Aylanish", "Vint", "Yunon harfi"],
          ["Δ (delta)", "Soat mili yo'nalishida", "O'ng qo'l vint", "Yunoncha Δ (o'ng burchak)"],
          ["Λ (lambda)", "Soat miliga qarshi", "Chap qo'l vint", "Yunoncha Λ (chap burchak)"]
        ], [90, 170, 130, 95])
        drawParagraph(
          "MUHIM: R/S nomenklaturasi organik molekulalar uchun mo'ljallangan, chunki u atrofdagi 4 ta " +
          "atom orasidagi CIP ustuvorlik tartibiga asoslanadi. Xelat komplekslarida esa xirallik " +
          "ligandlarning halqa aylanishidan kelib chiqadi — shuning uchun Λ/Δ tizimi ishlatiladi. " +
          "Ba'zi holatlarda Δ ↔ P, Λ ↔ M sinonimlari ham qo'llaniladi.",
          { italic: true }
        )
      }

      // ═════════════════════════════════════════════════════════
      // 3. OPTIK FAOLLIK VA [α]D
      // ═════════════════════════════════════════════════════════
      if (pdfSections.optical) {
        sectionHeader("3", "OPTIK FAOLLIK VA MUAYYAN BURILISH [α]D")
        drawParagraph(
          "Optik faol modda tekis qutblangan yorug'likni burish qobiliyatiga ega. " +
          "Burilish burchagi α (gradus, °) polarimetrda o'lchanadi va quyidagi Biot qonuniga bo'ysunadi:"
        )
        // Biot formulasi (matn)
        drawText("[α]λ^T = α / (l · c)", M + 20, y, {
          size: 12, font: fontBold, color: C.purpleDark
        })
        y -= 20
        drawParagraph(
          "bu yerda: α — o'lchangan burilish (°); l — kyuveta uzunligi (dm); " +
          "c — konsentratsiya (g/mL); T — harorat (K); λ — yorug'lik to'lqin uzunligi (odatda 589 nm — Na D chizig'i)."
        )
        drawTable([
          ["Kattalik", "Λ-enantiomer", "Δ-enantiomer", "Rasemik (±)"],
          ["[α]D (°·mL/g·dm)", `${currentComplex.optical.alphaD_lambda}`, `+${currentComplex.optical.alphaD_delta}`, "0"],
          ["Belgi konvensiya", "(−) — laevo", "(+) — dextro", "(±)"],
          ["Yorug'lik", `${currentComplex.optical.wavelength} nm`, `${currentComplex.optical.wavelength} nm`, "—"],
          ["Erituvchi", "Suv, 298 K", "Suv, 298 K", "—"]
        ], [140, 120, 120, 105])
      }

      // ═════════════════════════════════════════════════════════
      // 4. CD SPEKTRI (Sirkulyar Dixroizm)
      // ═════════════════════════════════════════════════════════
      if (pdfSections.cd) {
        sectionHeader("4", "SIRKULYAR DIXROIZM (CD) SPEKTRI")
        drawParagraph(
          "CD spektroskopiya — chap va o'ng aylanadigan qutblangan yorug'likning ("+
          "L-CPL va R-CPL) yutilishi orasidagi farqni o'lchaydi: Δε = εL − εR. " +
          "Enantiomerlar CD spektrida bir xil to'lqin uzunligida bir xil intensivlikda, " +
          "lekin QARAMA-QARSHI ishorada peakka ega. Bu — enantiomerlarni farqlashning " +
          "eng aniq spektroskopik usuli."
        )
        drawTable([
          ["Parametr", "Λ-enantiomer", "Δ-enantiomer"],
          ["λmax (nm)", `${currentComplex.optical.cdMax.lambda}`, `${currentComplex.optical.cdMax.delta}`],
          ["Δε ishorasi", `${currentComplex.optical.cdMax.sign_lambda} (manfiy Cotton)`, `${currentComplex.optical.cdMax.sign_delta} (musbat Cotton)`],
          ["O'tish turi", "d-d (¹A₁g → ¹T₁g)", "d-d (¹A₁g → ¹T₁g)"]
        ], [155, 155, 175])
        drawParagraph(
          "Cotton effekti — CD spektrida absorbsion band atrofida ishoraning o'zgarishi. " +
          "Bu koordinatsion birikmalarda absolyut konfiguratsiyani aniqlashning empirik asosidir.",
          { italic: true }
        )
      }

      // ═════════════════════════════════════════════════════════
      // 5. ORD (Optical Rotatory Dispersion)
      // ═════════════════════════════════════════════════════════
      if (pdfSections.ord) {
        sectionHeader("5", "OPTIK BURILISH DISPERSIYASI (ORD)")
        drawParagraph(
          "ORD — [α] ning to'lqin uzunligiga bog'liqligini o'lchaydi. Drude tenglamasiga muvofiq: " +
          "[α]λ = k / (λ² − λ₀²). Absorbsion band yaqinida [α] anomal o'zgaradi — bu ham Cotton effekti " +
          "deb ataladi. ORD va CD birgalikda — enantiomerning tuzilishini aniqlashda kuchli vosita."
        )
      }

      // ═════════════════════════════════════════════════════════
      // 6. WERNER TAJRIBASI (1911)
      // ═════════════════════════════════════════════════════════
      if (pdfSections.werner) {
        sectionHeader("6", "WERNER TAJRIBASI (1911) — TARIXIY ISBOT")
        drawParagraph(
          "Alfred Werner (Sюrix universiteti) 1911-yilda [Co(en)₃]³⁺ (yoki cis-[Co(en)₂Cl₂]⁺) " +
          "kompleksini d-tartrat kislotasi bilan reaksiyaga kirishtirdi. Rasemik kompleks + optik faol " +
          "kislota → 2 ta diastereomer tuz hosil bo'ladi:"
        )
        drawText("(±)-[Co(en)₃]³⁺ + 2 d-tartrat²⁻  →  Λ-[Co(en)₃][d-tart] + Δ-[Co(en)₃][d-tart]", M, y, {
          size: 9, font: fontItalic, color: C.purpleDark
        })
        y -= 18
        drawParagraph(
          "Diastereomerlar — fizikaviy xossalari (eruvchanlik, kristall shakli) farqlanadi, shuning uchun " +
          "fraktsion kristallizatsiya yoki xromatografiya bilan ajratiladi. Ajratilgangan so'ng " +
          "OH⁻ bilan tartrat ligand olib tashlanadi va sof enantiomer olinadi. Bu Werner uchun 1913-yil " +
          "Nobel mukofotining asosi bo'ldi va koordinatsion kimyoni mustaqil fanga aylantirdi."
        )
      }

      // ═════════════════════════════════════════════════════════
      // 7. RASEMIZATSIYA KINETIKASI
      // ═════════════════════════════════════════════════════════
      if (pdfSections.pasteur) {
        sectionHeader("7", "RASEMIZATSIYA KINETIKASI")
        drawParagraph(
          "Rasemizatsiya — sof enantiomerdan rasemik (50:50 Λ:Δ) aralashma hosil bo'lish jarayoni. " +
          "Bu birinchi tartibli reaksiya: k_rac = A · exp(−Ea/RT). [Co(en)₃]³⁺ uchun rasemizatsiya " +
          "sekin (yarim yemirilish davri > 100 soat, 298 K); [Co(en)₂Cl₂]⁺ uchun tezroq. Yuqori haroratda " +
          "rasemizatsiya sezilarli darajada tezlashadi (Arrenius qonuni)."
        )
        drawTable([
          ["Harorat (K)", "t½ (soat, taxminiy)", "Rasemizatsiya"],
          ["298 (25 °C)", "~ 150", "Juda sekin"],
          ["333 (60 °C)", "~ 12", "Sekin"],
          ["373 (100 °C)", "~ 0.8", "Sezilarli"]
        ], [120, 180, 190])
      }

      // ═════════════════════════════════════════════════════════
      // 8. BIJVOET METODI (Absolyut konfiguratsiya)
      // ═════════════════════════════════════════════════════════
      if (pdfSections.bijvoet) {
        sectionHeader("8", "BIJVOET METODI — ABSOLYUT KONFIGURATSIYA")
        drawParagraph(
          "1951-yilda J. M. Bijvoet Amsterdam laboratoriyasida anomal X-nur difraksiyasi (Zn Kα, λ = 1.435 Å) " +
          "usulini qo'llagan holda natriy rubidiy tartrat kristali uchun absolyut konfiguratsiyani birinchi " +
          "marta aniqladi. Undan avval R/S va Λ/Δ belgilari faqat nisbiy edi — Fisher-Rosanoff konvensiyasiga " +
          "asoslangan taxminiy edi. Bijvoet metodi zamonaviy X-ray kristallografiya asosini yaratdi va " +
          "bugungi kunda [Co(en)₃]³⁺ ning absolyut konfiguratsiyasi ham shu usulda aniqlangan."
        )
      }

      // ═════════════════════════════════════════════════════════
      // 9. TALIDOMID VA DORISHUNOSLIK
      // ═════════════════════════════════════════════════════════
      if (pdfSections.talidomid) {
        sectionHeader("9", "TALIDOMID DARSI — ENANTIOMER FARQLARINING TIBBIY AHAMIYATI")
        drawParagraph(
          "1957-1962 yillarda 46 mamlakatda talidomid dori rasemik shaklda homilador ayollarga " +
          "tinchlantiruvchi (sedativ) va antiemetik sifatida berildi. Keyinchalik ma'lum bo'ldiki, " +
          "R-enantiomer terapevtik, S-enantiomer esa teratogen (jinnitxlik) — u DNK bilan bog'lanib " +
          "embrion rivojlanishini buzadi. Natijada 10 000+ chaqaloq fokomeliya (qo'l-oyoq " +
          "rivojlanmasligi) bilan tug'ildi."
        )
        drawParagraph(
          "Bu fojia — enantiomerlar biologik faollik jihatidan mutlaq farqlanadi degan haqiqatning " +
          "tibbiyot dunyosini larzaga solgan darsi. Bugun FDA va EMA yangi dori uchun (agar u xiral bo'lsa) " +
          "har ikkala enantiomerni alohida biologik sinash talab qiladi. \"Chiral switch\" nazariyasi — " +
          "faol enantiomerni ajratish orqali xavfsizroq versiya yaratish — hozirgi dorishunoslikning " +
          "asosiy paradigmasi. Koordinatsion tibbiyotda (masalan, sisplatin analoglari) ham enantiomer " +
          "farqi hayotiy muhim.",
          { italic: true }
        )
      }

      // ═════════════════════════════════════════════════════════
      // 10. ADABIYOTLAR (References)
      // ═════════════════════════════════════════════════════════
      if (pdfSections.references) {
        sectionHeader("10", "FOYDALANILGAN ADABIYOTLAR")
        const refs = [
          "[1] Werner A. (1911). Zur Kenntnis des asymmetrischen Kobaltatoms. Ber. Dtsch. Chem. Ges., 44, 1887–1898.",
          "[2] Werner A. (1913). Nobel Lecture: On the Constitution and Configuration of Higher-Order Compounds. Nobel Foundation.",
          "[3] Pasteur L. (1848). Recherches sur les relations qui peuvent exister entre la forme cristalline, la composition chimique et le sens de la polarisation rotatoire. Ann. Chim. Phys., 24, 442–459.",
          "[4] Bijvoet J. M., Peerdeman A. F., van Bommel A. J. (1951). Determination of the Absolute Configuration of Optically Active Compounds by Means of X-rays. Nature, 168, 271–272.",
          "[5] Cahn R. S., Ingold C. K., Prelog V. (1966). Specification of Molecular Chirality. Angew. Chem. Int. Ed., 5, 385–415.",
          "[6] IUPAC (2005). Nomenclature of Inorganic Chemistry — IUPAC Recommendations. RSC Publishing (Red Book).",
          "[7] Cotton F. A., Wilkinson G., Murillo C. A., Bochmann M. (1999). Advanced Inorganic Chemistry, 6th ed. Wiley.",
          "[8] Miessler G. L., Fischer P. J., Tarr D. A. (2014). Inorganic Chemistry, 5th ed. Pearson.",
          "[9] Housecroft C. E., Sharpe A. G. (2018). Inorganic Chemistry, 5th ed. Pearson.",
          "[10] Berova N., Nakanishi K., Woody R. W. (2000). Circular Dichroism: Principles and Applications. Wiley-VCH."
        ]
        refs.forEach(r => drawParagraph(r, { size: 9 }))
      }

      // ═════════════════════════════════════════════════════════
      // OYOQ QISM (footer)
      // ═════════════════════════════════════════════════════════
      const totalPages = pdfDoc.getPageCount()
      for (let i = 0; i < totalPages; i++) {
        const p = pdfDoc.getPage(i)
        p.drawLine({
          start: { x: M, y: 30 }, end: { x: PW - M, y: 30 },
          thickness: 0.5, color: C.line
        })
        // Xavfsiz drawText orqali — Unicode font yuklanmagan bo'lsa avtomatik ASCII ga tushadi
        drawText(
          `jdakimyo.uz • Optik izomeriya ilmiy hisoboti • ${currentComplex.formula}`,
          M, 18,
          { size: 8, font, color: C.subtle, targetPage: p }
        )
        drawText(
          `${i + 1} / ${totalPages}`,
          PW - M - 30, 18,
          { size: 8, font, color: C.subtle, targetPage: p }
        )
      }

      // Yuklab olish
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
      alert("PDF yaratishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
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
                    snapshot: true, info: true, chirality: true, optical: true,
                    cd: true, ord: true, cip: true, werner: true,
                    pasteur: false, bijvoet: false, talidomid: false, references: true
                  })}
                  className="flex-1 px-3 py-1.5 rounded text-xs bg-purple-800/40 text-purple-200 border border-purple-700/50 hover:bg-purple-700/40"
                >Standart</button>
                <button
                  onClick={() => setPdfSections({
                    snapshot: true, info: true, chirality: true, optical: true,
                    cd: true, ord: true, cip: true, werner: true,
                    pasteur: true, bijvoet: true, talidomid: true, references: true
                  })}
                  className="flex-1 px-3 py-1.5 rounded text-xs bg-gradient-to-r from-purple-700 to-pink-700 text-white font-semibold"
                >To'liq (ilmiy)</button>
                <button
                  onClick={() => setPdfSections({
                    snapshot: false, info: false, chirality: false, optical: false,
                    cd: false, ord: false, cip: false, werner: false,
                    pasteur: false, bijvoet: false, talidomid: false, references: false
                  })}
                  className="flex-1 px-3 py-1.5 rounded text-xs bg-red-900/30 text-red-300 border border-red-700/40 hover:bg-red-800/40"
                >Tozalash</button>
              </div>

              {/* Sections list */}
              <div className="text-xs text-purple-300 uppercase font-bold pt-2">Bo'limlarni tanlang:</div>
              {[
                { k: "info", l: "ℹ️ Kompleks ma'lumotlari (formula, xossalar)" },
                { k: "chirality", l: "🧬 Xirallik shartlari va simmetriya" },
                { k: "cip", l: "📖 Λ/Δ nomenklaturasi (IUPAC 2005)" },
                { k: "optical", l: "☀️ Optik faollik va [α]D" },
                { k: "cd", l: "📊 CD spektri (Sirkulyar dixroizm)" },
                { k: "ord", l: "🌈 ORD spektri (Drude tenglamasi)" },
                { k: "werner", l: "⚗️ Werner tajribasi (1911)" },
                { k: "pasteur", l: "🧪 Pasteur (1848) va rasemizatsiya kinetikasi" },
                { k: "bijvoet", l: "💎 Bijvoet metodi (1951)" },
                { k: "talidomid", l: "⚠️ Talidomid darsi va dorishunoslik" },
                { k: "references", l: "📚 Foydalanilgan adabiyotlar (10 manba)" }
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
