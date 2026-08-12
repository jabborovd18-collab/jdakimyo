"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

// ═══════════════════════════════════════════════════════════════════════════
// CPK RANGLARI (IUPAC standartlari)
// ═══════════════════════════════════════════════════════════════════════════
const CPK = {
  Pt: 0xD0D0E0, Co: 0xF090A0, Cr: 0x8A99C7, Ni: 0x50D050,
  N: 0x3050F8, C: 0x909090, H: 0xFFFFFF, O: 0xFF0D0D,
  Cl: 0x1FF01F, Br: 0xA62929, I: 0x940094, F: 0x90E050,
  S: 0xFFFF30, P: 0xFF8000,
  bond: 0x8B9DC3, hbond: 0x66CCFF, highlight: 0xFFD700
}

// ═══════════════════════════════════════════════════════════════════════════
// GEOMETRIK IZOMERLAR DATABASE
// ═══════════════════════════════════════════════════════════════════════════
const ISOMERS = {
  // ── 1. Kvadrat-planar sis-trans ────────────────────────
  PtCisTrans: {
    id: "PtCisTrans",
    category: "square-planar",
    title: "Sis–trans kvadrat-planar",
    formula: "[Pt(NH₃)₂Cl₂]",
    center: { element: "Pt", color: CPK.Pt, radius: 0.42, charge: "+2" },
    geometry: "Kvadrat-planar",
    symmetry: { cis: "C₂ᵥ", trans: "D₂ₕ" },
    hybridization: "dsp²",
    coordinationNumber: 4,
    dipole: { cis: "≈ 12.8 D (qutbli)", trans: "0 D (qutbsiz)" },
    color: { cis: "Sariq-to'q sariq", trans: "Och sariq" },
    solubility: { cis: "Suvda o'rtacha (2.5 g/L)", trans: "Suvda kam (0.37 g/L)" },
    biology: {
      cis: "Sisplatin — antineoplastik dori (Bristol-Myers Squibb, 1978-yilda FDA tasdig'i). DNK'ning ikkita guanin N7 atomiga chatishib, replikatsiyani to'xtatadi.",
      trans: "Transplatin — biologik faol EMAS. Kinetik jihatdan tez gidrolizlanadi va DNK'ga yetguncha inaktivlanadi."
    },
    discovery: "1844 — Michele Peyrone (sis-shakl); 1893 — Alfred Werner koordinatsion nazariyada geometrik farqni tushuntirdi; 1965 — Barnett Rosenberg saraton hujayralari bo'linishini to'xtatuvchi ta'sirini kashf etdi.",
    ligands: [
      { name: "NH₃", donor: "N", type: "monodentat", trans_effect: "past" },
      { name: "Cl⁻", donor: "Cl", type: "monodentat", trans_effect: "o'rtacha" }
    ]
  },

  // ── 2. Oktaedrik sis-trans [Co(NH₃)₄Cl₂]⁺ ─────────────
  CoTetraAmmine: {
    id: "CoTetraAmmine",
    category: "octahedral-2",
    title: "Sis–trans oktaedrik (MA₄B₂)",
    formula: "[Co(NH₃)₄Cl₂]⁺",
    fullSalt: "[Co(NH₃)₄Cl₂]Cl",
    center: { element: "Co", color: CPK.Co, radius: 0.42, charge: "+3" },
    geometry: "Oktaedrik",
    symmetry: { cis: "C₂ᵥ", trans: "D₄ₕ" },
    hybridization: "d²sp³",
    coordinationNumber: 6,
    dipole: { cis: "≠ 0 (qutbli)", trans: "0 D (qutbsiz)" },
    color: {
      cis: "Binafsha-qizil (Praseo → Violeo)",
      trans: "Yashil (Praseo)"
    },
    discovery: "1893 — Alfred Werner ikki xil rangda kristallanuvchi izomerlarni ajratdi. Bu koordinatsion nazariyaning tajribaviy isboti bo'ldi (Nobel mukofoti, 1913).",
    ligands: [
      { name: "NH₃", donor: "N", type: "monodentat" },
      { name: "Cl⁻", donor: "Cl", type: "monodentat" }
    ],
    note: "Cis: 2 ta Cl 90° burchakda qo'shni; Trans: 2 ta Cl 180° qarama-qarshi."
  },

  // ── 3. fac-mer [Co(NH₃)₃Cl₃] ─────────────────────────
  CoFacMer: {
    id: "CoFacMer",
    category: "octahedral-3",
    title: "Fac–mer oktaedrik (MA₃B₃)",
    formula: "[Co(NH₃)₃Cl₃]",
    center: { element: "Co", color: CPK.Co, radius: 0.42, charge: "+3" },
    geometry: "Oktaedrik",
    symmetry: { fac: "C₃ᵥ", mer: "C₂ᵥ" },
    hybridization: "d²sp³",
    coordinationNumber: 6,
    dipole: { fac: "≠ 0 (qutbli)", mer: "≠ 0 (qutbli, kichikroq)" },
    color: { fac: "Binafsha", mer: "Yashil-jigarrang" },
    discovery: "fac = 'facial' (yuz) — 3 ta Cl oktaedrning bitta uchburchak yuzida joylashadi; mer = 'meridional' (meridian) — 3 ta Cl bir tekislikda, meridian bo'ylab.",
    ligands: [
      { name: "NH₃", donor: "N", type: "monodentat" },
      { name: "Cl⁻", donor: "Cl", type: "monodentat" }
    ],
    note: "Fac: 3 ta Cl orasidagi barcha burchaklar 90°; Mer: 2 tasi 180°, 1 tasi 90°."
  },

  // ── 4. Bis-xelat sis-trans [Co(en)₂Cl₂]⁺ ─────────────
  CoEnCl2: {
    id: "CoEnCl2",
    category: "octahedral-chelate",
    title: "Bis-xelat sis–trans",
    formula: "[Co(en)₂Cl₂]⁺",
    fullSalt: "[Co(en)₂Cl₂]Cl",
    center: { element: "Co", color: CPK.Co, radius: 0.42, charge: "+3" },
    geometry: "Oktaedrik",
    symmetry: { cis: "C₂", trans: "C₂ₕ" },
    hybridization: "d²sp³",
    coordinationNumber: 6,
    dipole: { cis: "≠ 0 (qutbli)", trans: "0 D (qutbsiz)" },
    color: { cis: "Binafsha", trans: "Yashil" },
    discovery: "en = etilendiamin (H₂N–CH₂–CH₂–NH₂), bidentat ligand. Cis-shakli xiral bo'lib, Δ va Λ enantiomerlariga ega. Werner uni 1911-yilda ajratib, koordinatsion birikmalarda optik izomeriyani birinchi bor isbotladi.",
    ligands: [
      { name: "en", donor: "N–N", type: "bidentat (xelat)" },
      { name: "Cl⁻", donor: "Cl", type: "monodentat" }
    ],
    note: "Faqat cis-shakli xiral! Trans-shakli ko'zgu tekisligiga ega (σₕ)."
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
const ATOM_INFO = {
  Pt: { name: "Platina (Pt)", atomic: 78, mass: "195.08 u", config: "[Xe] 4f¹⁴ 5d⁹ 6s¹", role: "Markaziy ion (d⁸)", color: "#D0D0E0" },
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁷ 4s²", oxidation: "+3", role: "Markaziy ion (d⁶)", color: "#F090A0" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "NH₃ / en donor atomi", hybridization: "sp³", color: "#3050F8" },
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.01 u", config: "[He] 2s² 2p²", role: "en tarkibi (CH₂)", hybridization: "sp³", color: "#909090" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "NH₃ / en tarkibi", color: "#FFFFFF" },
  Cl: { name: "Xlor (Cl⁻)", atomic: 17, mass: "35.45 u", config: "[Ne] 3s² 3p⁶", charge: "-1", role: "Ligand va tashqi ion", color: "#1FF01F" }
}

// ═══════════════════════════════════════════════════════════════════════════
// YORDAMCHI FUNKSIYALAR
// ═══════════════════════════════════════════════════════════════════════════
const cleanText = (str) => {
  if (!str) return ""
  return String(str).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
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
export default function GeometrikIzomeriya3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)

  const leftGroupRef = useRef(null)   // sis / fac
  const rightGroupRef = useRef(null)  // trans / mer
  const atomsRef = useRef([])
  const bondsRef = useRef([])
  const labelsRef = useRef([])
  const dipoleArrowsRef = useRef([])
  const symmetryHelpersRef = useRef([])

  // ── UI STATE'lari ───────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [currentIsomer, setCurrentIsomer] = useState("PtCisTrans")
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [viewMode, setViewMode] = useState("both") // both | left | right
  const [showLabels, setShowLabels] = useState(true)
  const [showDipole, setShowDipole] = useState(false)
  const [showSymmetry, setShowSymmetry] = useState(false)
  const [symmetryElement, setSymmetryElement] = useState("C2")
  const [showAngles, setShowAngles] = useState(false)
  const [showHydrogens, setShowHydrogens] = useState(true)
  const [showBondLengths, setShowBondLengths] = useState(false)
  const [activePanel, setActivePanel] = useState(null) // null | "info" | "biology" | "history" | "compare" | "test"
  const [expandedSection, setExpandedSection] = useState("view")
  const [fullscreenMode, setFullscreenMode] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfSections, setPdfSections] = useState({
    intro: true, geometry: true, symmetry: true,
    dipole: true, biology: true, history: true, table: true, references: true
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
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handlePanelDragMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
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

  const isomer = ISOMERS[currentIsomer]

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

  // ═══════════════════════════════════════════════════════════
  // NH₃ LIGAND
  // ═══════════════════════════════════════════════════════════
  const createNH3 = useCallback((parent, nPos, centerPos, showH) => {
    const group = new THREE.Group()
    // N atomi
    const nGeo = new THREE.SphereGeometry(0.28, 32, 32)
    const nMat = new THREE.MeshStandardMaterial({
      color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15
    })
    const nMesh = new THREE.Mesh(nGeo, nMat)
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, isDonor: true }
    group.add(nMesh)
    atomsRef.current.push(nMesh)

    // M–N bog'lanish
    createBond(group, centerPos, nPos, CPK.bond, 0.06)

    if (showH) {
      // 3 ta H atomi — N'dan tashqariga (M dan qarama-qarshi)
      const outward = nPos.clone().sub(centerPos).normalize()
      // 2 ta perpendikulyar vektor
      const up = new THREE.Vector3(0, 1, 0)
      const perp1 = new THREE.Vector3().crossVectors(outward, Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up).normalize()
      const perp2 = new THREE.Vector3().crossVectors(outward, perp1).normalize()

      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3
        const hDir = outward.clone().multiplyScalar(0.35)
          .add(perp1.clone().multiplyScalar(0.42 * Math.cos(angle)))
          .add(perp2.clone().multiplyScalar(0.42 * Math.sin(angle)))
        const hPos = nPos.clone().add(hDir)
        const hGeo = new THREE.SphereGeometry(0.12, 20, 20)
        const hMat = new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
        const hMesh = new THREE.Mesh(hGeo, hMat)
        hMesh.position.copy(hPos)
        hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H }
        group.add(hMesh)
        atomsRef.current.push(hMesh)
        createBond(group, nPos, hPos, 0x666677, 0.035, 0.5)
      }
    }
    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // en (etilendiamin) — bidentat ligand
  // Ikkita N atomini bir markaziy metallga bog'laydi.
  // N–CH₂–CH₂–N kupasi
  // ═══════════════════════════════════════════════════════════
  const createEn = useCallback((parent, n1Pos, n2Pos, centerPos, showH) => {
    const group = new THREE.Group()
    // 2 ta N
    ;[n1Pos, n2Pos].forEach((nPos) => {
      const nGeo = new THREE.SphereGeometry(0.26, 32, 32)
      const nMat = new THREE.MeshStandardMaterial({
        color: CPK.N, roughness: 0.3, metalness: 0.2, emissive: CPK.N, emissiveIntensity: 0.15
      })
      const nMesh = new THREE.Mesh(nGeo, nMat)
      nMesh.position.copy(nPos)
      nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, isDonor: true }
      group.add(nMesh)
      atomsRef.current.push(nMesh)
      createBond(group, centerPos, nPos, CPK.bond, 0.06)
    })

    // 2 ta CH₂ (uglerod) — N va N orasida "yoy" yasab
    const mid = new THREE.Vector3().addVectors(n1Pos, n2Pos).multiplyScalar(0.5)
    const bulge = mid.clone().sub(centerPos).normalize().multiplyScalar(0.6).add(mid)
    // n1 → c1 → c2 → n2 zanjirni yasash
    const c1 = n1Pos.clone().lerp(bulge, 0.5)
    const c2 = n2Pos.clone().lerp(bulge, 0.5)

    ;[c1, c2].forEach((cPos) => {
      const cGeo = new THREE.SphereGeometry(0.18, 24, 24)
      const cMat = new THREE.MeshStandardMaterial({ color: CPK.C, roughness: 0.4, metalness: 0.2 })
      const cMesh = new THREE.Mesh(cGeo, cMat)
      cMesh.position.copy(cPos)
      cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C }
      group.add(cMesh)
      atomsRef.current.push(cMesh)
    })

    // Bog'lanishlar: n1-c1, c1-c2, c2-n2
    createBond(group, n1Pos, c1, 0x777788, 0.04, 0.7)
    createBond(group, c1, c2, 0x777788, 0.04, 0.7)
    createBond(group, c2, n2Pos, 0x777788, 0.04, 0.7)

    if (showH) {
      // Har bir CH₂'da 2 ta H
      ;[[c1, n1Pos], [c2, n2Pos]].forEach(([cPos, nRef]) => {
        const outward = cPos.clone().sub(centerPos).normalize()
        const along = nRef.clone().sub(cPos).normalize()
        const perp = new THREE.Vector3().crossVectors(outward, along).normalize()
        ;[+1, -1].forEach((sign) => {
          const hPos = cPos.clone().add(perp.clone().multiplyScalar(0.3 * sign)).add(outward.clone().multiplyScalar(0.2))
          const hGeo = new THREE.SphereGeometry(0.09, 16, 16)
          const hMat = new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
          const hMesh = new THREE.Mesh(hGeo, hMat)
          hMesh.position.copy(hPos)
          hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H }
          group.add(hMesh)
          atomsRef.current.push(hMesh)
          createBond(group, cPos, hPos, 0x555566, 0.025, 0.45)
        })
      })
      // Har bir N'da 2 ta H
      ;[n1Pos, n2Pos].forEach((nPos) => {
        const outward = nPos.clone().sub(centerPos).normalize()
        const up = new THREE.Vector3(0, 1, 0)
        const perp = new THREE.Vector3().crossVectors(outward, Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up).normalize()
        ;[+1, -1].forEach((sign) => {
          const hPos = nPos.clone().add(outward.clone().multiplyScalar(0.28)).add(perp.clone().multiplyScalar(0.28 * sign))
          const hGeo = new THREE.SphereGeometry(0.1, 16, 16)
          const hMat = new THREE.MeshStandardMaterial({ color: CPK.H, roughness: 0.5, metalness: 0.1 })
          const hMesh = new THREE.Mesh(hGeo, hMat)
          hMesh.position.copy(hPos)
          hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H }
          group.add(hMesh)
          atomsRef.current.push(hMesh)
          createBond(group, nPos, hPos, 0x555566, 0.025, 0.45)
        })
      })
    }

    parent.add(group)
    return group
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // Cl⁻ ligand (yashil sharcha)
  // ═══════════════════════════════════════════════════════════
  const createChloride = useCallback((parent, pos, centerPos) => {
    const geo = new THREE.SphereGeometry(0.32, 32, 32)
    const mat = new THREE.MeshStandardMaterial({
      color: CPK.Cl, roughness: 0.3, metalness: 0.2, emissive: CPK.Cl, emissiveIntensity: 0.1
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.copy(pos)
    mesh.userData = { type: 'atom', element: 'Cl', info: ATOM_INFO.Cl }
    parent.add(mesh)
    atomsRef.current.push(mesh)
    createBond(parent, centerPos, pos, 0x448844, 0.06)
    return mesh
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // MOLEKULA QURISH — asosiy funksiya
  // ═══════════════════════════════════════════════════════════
  const buildMolecule = useCallback((group, form, isomerData, offsetX) => {
    const { center, bondLength = 1.8 } = isomerData
    const dist = bondLength * 1.15
    const centerPos = new THREE.Vector3(offsetX, 0, 0)

    // Markaziy metall atom
    const centerGeo = new THREE.SphereGeometry(center.radius, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({
      color: center.color, roughness: 0.15, metalness: 0.9,
      emissive: center.color, emissiveIntensity: 0.15
    })
    const centerMesh = new THREE.Mesh(centerGeo, centerMat)
    centerMesh.position.copy(centerPos)
    centerMesh.userData = { type: 'atom', element: center.element, info: ATOM_INFO[center.element], isCenter: true }
    group.add(centerMesh)
    atomsRef.current.push(centerMesh)

    // Formani belgilaymiz — pozitsiyalarni hisoblaymiz
    const pos = (dx, dy, dz) => new THREE.Vector3(offsetX + dx * dist, dy * dist, dz * dist)

    // ══ KVADRAT-PLANAR: [Pt(NH₃)₂Cl₂] ══
    if (isomerData.category === "square-planar") {
      // 4 ta ligand X-Z tekislikda
      // +x, -x, +z, -z
      if (form === "cis") {
        // Cl lar yonma-yon: +x va +z
        createChloride(group, pos(1, 0, 0), centerPos)
        createChloride(group, pos(0, 0, 1), centerPos)
        createNH3(group, pos(-1, 0, 0), centerPos, showHydrogens)
        createNH3(group, pos(0, 0, -1), centerPos, showHydrogens)
      } else { // trans
        // Cl lar qarama-qarshi: +x va -x
        createChloride(group, pos(1, 0, 0), centerPos)
        createChloride(group, pos(-1, 0, 0), centerPos)
        createNH3(group, pos(0, 0, 1), centerPos, showHydrogens)
        createNH3(group, pos(0, 0, -1), centerPos, showHydrogens)
      }
    }

    // ══ OKTAEDRIK MA₄B₂: [Co(NH₃)₄Cl₂]⁺ ══
    else if (isomerData.category === "octahedral-2") {
      // 6 ta pozitsiya
      if (form === "cis") {
        // 2 ta Cl 90° (masalan +x va +y)
        createChloride(group, pos(1, 0, 0), centerPos)
        createChloride(group, pos(0, 1, 0), centerPos)
        // 4 ta NH₃ qolgan
        createNH3(group, pos(-1, 0, 0), centerPos, showHydrogens)
        createNH3(group, pos(0, -1, 0), centerPos, showHydrogens)
        createNH3(group, pos(0, 0, 1), centerPos, showHydrogens)
        createNH3(group, pos(0, 0, -1), centerPos, showHydrogens)
      } else { // trans
        // 2 ta Cl 180° qarama-qarshi (+y va -y)
        createChloride(group, pos(0, 1, 0), centerPos)
        createChloride(group, pos(0, -1, 0), centerPos)
        createNH3(group, pos(1, 0, 0), centerPos, showHydrogens)
        createNH3(group, pos(-1, 0, 0), centerPos, showHydrogens)
        createNH3(group, pos(0, 0, 1), centerPos, showHydrogens)
        createNH3(group, pos(0, 0, -1), centerPos, showHydrogens)
      }
    }

    // ══ OKTAEDRIK MA₃B₃: [Co(NH₃)₃Cl₃] ══
    else if (isomerData.category === "octahedral-3") {
      if (form === "fac") {
        // 3 ta Cl bir yuzda: +x, +y, +z
        createChloride(group, pos(1, 0, 0), centerPos)
        createChloride(group, pos(0, 1, 0), centerPos)
        createChloride(group, pos(0, 0, 1), centerPos)
        // 3 ta NH₃: -x, -y, -z
        createNH3(group, pos(-1, 0, 0), centerPos, showHydrogens)
        createNH3(group, pos(0, -1, 0), centerPos, showHydrogens)
        createNH3(group, pos(0, 0, -1), centerPos, showHydrogens)
      } else { // mer
        // 3 ta Cl meridianda: +x, -x, +y
        createChloride(group, pos(1, 0, 0), centerPos)
        createChloride(group, pos(-1, 0, 0), centerPos)
        createChloride(group, pos(0, 1, 0), centerPos)
        // 3 ta NH₃: -y, +z, -z
        createNH3(group, pos(0, -1, 0), centerPos, showHydrogens)
        createNH3(group, pos(0, 0, 1), centerPos, showHydrogens)
        createNH3(group, pos(0, 0, -1), centerPos, showHydrogens)
      }
    }

    // ══ BIS-XELAT [Co(en)₂Cl₂]⁺ ══
    else if (isomerData.category === "octahedral-chelate") {
      if (form === "cis") {
        // 2 ta Cl 90° (+x, +y)
        createChloride(group, pos(1, 0, 0), centerPos)
        createChloride(group, pos(0, 1, 0), centerPos)
        // 1-en: (-x, +z) — o'zaro qo'shni
        createEn(group, pos(-1, 0, 0), pos(0, 0, 1), centerPos, showHydrogens)
        // 2-en: (-y, -z)
        createEn(group, pos(0, -1, 0), pos(0, 0, -1), centerPos, showHydrogens)
      } else { // trans
        // 2 ta Cl qarama-qarshi (+z, -z)
        createChloride(group, pos(0, 0, 1), centerPos)
        createChloride(group, pos(0, 0, -1), centerPos)
        // 1-en: (+x, +y)
        createEn(group, pos(1, 0, 0), pos(0, 1, 0), centerPos, showHydrogens)
        // 2-en: (-x, -y)
        createEn(group, pos(-1, 0, 0), pos(0, -1, 0), centerPos, showHydrogens)
      }
    }

    // Yorliqni molekulaning tepasiga qo'yamiz
    if (showLabels) {
      let labelText = ""
      if (isomerData.category === "octahedral-3") {
        labelText = form === "fac" ? `fac-${isomerData.formula}` : `mer-${isomerData.formula}`
      } else {
        labelText = form === "cis" ? `cis-${isomerData.formula}` : `trans-${isomerData.formula}`
      }
      const isRedBg = (form === "trans" || form === "mer") ? "rgba(120, 30, 30, 0.85)" : "rgba(30, 90, 50, 0.85)"
      const isRedBorder = (form === "trans" || form === "mer") ? "#ff6b6b" : "#5fdc7c"
      const sprite = makeTextSprite(labelText, {
        fontSize: 56, color: "#ffffff", bgColor: isRedBg, borderColor: isRedBorder, scale: 0.45
      })
      sprite.position.set(offsetX, 3.0, 0)
      group.add(sprite)
      labelsRef.current.push(sprite)

      // Kichkina belgi: qutbliligi
      const dipoleInfo = isomerData.dipole[form]
      if (dipoleInfo) {
        const dipoleColor = dipoleInfo.includes("0 D") ? "#88ccff" : "#ffaa66"
        const subSprite = makeTextSprite(dipoleInfo, {
          fontSize: 40, color: dipoleColor, bgColor: "rgba(15, 10, 30, 0.8)",
          borderColor: dipoleColor, scale: 0.38
        })
        subSprite.position.set(offsetX, 2.45, 0)
        group.add(subSprite)
        labelsRef.current.push(subSprite)
      }
    }
  }, [createBond, createChloride, createNH3, createEn, showHydrogens, showLabels])

  // ═══════════════════════════════════════════════════════════
  // SIMMETRIYA ELEMENTLARI
  // ═══════════════════════════════════════════════════════════
  const drawSymmetry = useCallback((scene, element) => {
    // Eski elementlarni tozalaymiz
    symmetryHelpersRef.current.forEach(m => scene.remove(m))
    symmetryHelpersRef.current = []

    if (!showSymmetry) return

    const drawAxis = (posX, dir, color, label) => {
      // Uzun tsilindr — o'q
      const axisGeo = new THREE.CylinderGeometry(0.025, 0.025, 6, 16)
      const axisMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 })
      const axis = new THREE.Mesh(axisGeo, axisMat)
      axis.position.set(posX, 0, 0)
      axis.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
      scene.add(axis)
      symmetryHelpersRef.current.push(axis)
      // Label
      const lbl = makeTextSprite(label, {
        fontSize: 40, color: "#ffee66", bgColor: "rgba(60, 40, 10, 0.85)",
        borderColor: "#ffee66", scale: 0.35
      })
      const labelPos = dir.clone().normalize().multiplyScalar(3.2)
      lbl.position.set(posX + labelPos.x, labelPos.y, labelPos.z)
      scene.add(lbl)
      symmetryHelpersRef.current.push(lbl)
    }

    const drawPlane = (posX, normal, color, label) => {
      const planeGeo = new THREE.PlaneGeometry(4, 4)
      const planeMat = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.22, side: THREE.DoubleSide,
        depthWrite: false
      })
      const plane = new THREE.Mesh(planeGeo, planeMat)
      plane.position.set(posX, 0, 0)
      plane.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal.clone().normalize())
      scene.add(plane)
      symmetryHelpersRef.current.push(plane)
      const lbl = makeTextSprite(label, {
        fontSize: 40, color: "#66ffff", bgColor: "rgba(10, 40, 60, 0.85)",
        borderColor: "#66ffff", scale: 0.35
      })
      lbl.position.set(posX + 2.3, 1.8, 0)
      scene.add(lbl)
      symmetryHelpersRef.current.push(lbl)
    }

    // Chap molekula
    if (viewMode !== "right") {
      if (element === "C2") drawAxis(-3, new THREE.Vector3(1, 1, 0), 0xffee66, "C₂ (cis)")
      if (element === "sigma") drawPlane(-3, new THREE.Vector3(1, -1, 0), 0x66ffff, "σᵥ")
      if (element === "C4") drawAxis(-3, new THREE.Vector3(0, 0, 1), 0xffee66, "C₄")
      if (element === "C3") drawAxis(-3, new THREE.Vector3(1, 1, 1), 0xffee66, "C₃ (fac)")
    }
    // O'ng molekula (trans/mer)
    if (viewMode !== "left") {
      if (element === "C2") drawAxis(3, new THREE.Vector3(1, 0, 0), 0xffee66, "C₂ (trans)")
      if (element === "sigma") drawPlane(3, new THREE.Vector3(0, 1, 0), 0x66ffff, "σₕ")
      if (element === "C4") drawAxis(3, new THREE.Vector3(0, 1, 0), 0xffee66, "C₄")
      if (element === "C3") drawAxis(3, new THREE.Vector3(0, 1, 0), 0xffee66, "C₂ (mer)")
    }
  }, [showSymmetry, viewMode])

  // ═══════════════════════════════════════════════════════════
  // DIPOL O'QLARI
  // ═══════════════════════════════════════════════════════════
  const drawDipoles = useCallback((scene) => {
    dipoleArrowsRef.current.forEach(a => scene.remove(a))
    dipoleArrowsRef.current = []

    if (!showDipole) return

    // Chap (cis/fac) — qutbli
    if (viewMode !== "right") {
      const dipInfo = isomer.dipole.cis || isomer.dipole.fac
      if (dipInfo && !dipInfo.includes("0 D")) {
        // Chap molekula uchun natijaviy dipol (yuqoriga)
        let dir = new THREE.Vector3(0.5, 0.5, 0.5).normalize()
        if (isomer.category === "square-planar") dir = new THREE.Vector3(1, 0, 1).normalize()
        else if (isomer.category === "octahedral-2") dir = new THREE.Vector3(1, 1, 0).normalize()
        else if (isomer.category === "octahedral-3") dir = new THREE.Vector3(1, 1, 1).normalize()
        else if (isomer.category === "octahedral-chelate") dir = new THREE.Vector3(1, 1, 0).normalize()

        const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(-3, 0, 0), 2.2, 0xff5555, 0.5, 0.3)
        scene.add(arrow)
        dipoleArrowsRef.current.push(arrow)
        const lbl = makeTextSprite("μ ≠ 0", {
          fontSize: 44, color: "#ffaaaa", bgColor: "rgba(60, 20, 20, 0.85)",
          borderColor: "#ff6b6b", scale: 0.4
        })
        lbl.position.set(-3 + dir.x * 2.5, dir.y * 2.5, dir.z * 2.5)
        scene.add(lbl)
        dipoleArrowsRef.current.push(lbl)
      }
    }
    // O'ng (trans/mer)
    if (viewMode !== "left") {
      const dipInfo = isomer.dipole.trans || isomer.dipole.mer
      if (dipInfo && dipInfo.includes("0 D")) {
        const lbl = makeTextSprite("μ = 0", {
          fontSize: 44, color: "#88ccff", bgColor: "rgba(15, 25, 45, 0.85)",
          borderColor: "#66aaff", scale: 0.4
        })
        lbl.position.set(3, 2.9, 0)
        scene.add(lbl)
        dipoleArrowsRef.current.push(lbl)
      } else if (dipInfo && !dipInfo.includes("0 D")) {
        // Mer — kichik dipol
        const dir = new THREE.Vector3(0, 1, 0)
        const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(3, 0, 0), 1.6, 0xffaa55, 0.4, 0.25)
        scene.add(arrow)
        dipoleArrowsRef.current.push(arrow)
        const lbl = makeTextSprite("μ ≠ 0 (kichik)", {
          fontSize: 40, color: "#ffcc99", bgColor: "rgba(45, 30, 15, 0.85)",
          borderColor: "#ffaa66", scale: 0.38
        })
        lbl.position.set(3, 2.4, 0)
        scene.add(lbl)
        dipoleArrowsRef.current.push(lbl)
      }
    }
  }, [showDipole, viewMode, isomer])

  // ═══════════════════════════════════════════════════════════
  // SCENE'ni tozalash va qayta qurish
  // ═══════════════════════════════════════════════════════════
  const rebuildScene = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return

    // Eski gruppalarni tozalaymiz
    if (leftGroupRef.current) {
      scene.remove(leftGroupRef.current)
      leftGroupRef.current.traverse(o => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose())
          else o.material.dispose()
        }
      })
    }
    if (rightGroupRef.current) {
      scene.remove(rightGroupRef.current)
      rightGroupRef.current.traverse(o => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach(m => m.dispose())
          else o.material.dispose()
        }
      })
    }

    atomsRef.current = []
    bondsRef.current = []
    labelsRef.current = []

    // Yangi gruppalar
    const leftGroup = new THREE.Group()
    const rightGroup = new THREE.Group()
    leftGroupRef.current = leftGroup
    rightGroupRef.current = rightGroup

    // Formalarni aniqlaymiz
    const isFacMer = isomer.category === "octahedral-3"
    const leftForm = isFacMer ? "fac" : "cis"
    const rightForm = isFacMer ? "mer" : "trans"

    if (viewMode === "both") {
      buildMolecule(leftGroup, leftForm, isomer, -3)
      buildMolecule(rightGroup, rightForm, isomer, 3)
    } else if (viewMode === "left") {
      buildMolecule(leftGroup, leftForm, isomer, 0)
    } else if (viewMode === "right") {
      buildMolecule(rightGroup, rightForm, isomer, 0)
    }

    scene.add(leftGroup)
    scene.add(rightGroup)

    // VS belgisi
    if (viewMode === "both") {
      const vs = makeTextSprite("VS", {
        fontSize: 72, color: "#FFD700", bgColor: "rgba(60, 40, 5, 0.9)",
        borderColor: "#FFD700", scale: 0.6
      })
      vs.position.set(0, 0.5, 0)
      scene.add(vs)
      labelsRef.current.push(vs)
    }

    drawSymmetry(scene, symmetryElement)
    drawDipoles(scene)
  }, [isomer, viewMode, buildMolecule, drawSymmetry, drawDipoles, symmetryElement])

  // ═══════════════════════════════════════════════════════════
  // THREE.JS SETUP
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Fon: nebula effekti
    const bgGeo = new THREE.SphereGeometry(50, 32, 32)
    const bgMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        color1: { value: new THREE.Color(0x0a0520) },
        color2: { value: new THREE.Color(0x1a0f38) }
      },
      vertexShader: `varying vec3 vWorldPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
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
    camera.position.set(0, 4, 10)
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
    controls.maxDistance = 22
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.8
    controlsRef.current = controls

    // Yorug'liklar
    scene.add(new THREE.AmbientLight(0x606080, 0.6))
    const l1 = new THREE.DirectionalLight(0xffffff, 0.9); l1.position.set(6, 8, 6); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0x88aaff, 0.5); l2.position.set(-5, -3, -4); scene.add(l2)
    const l3 = new THREE.PointLight(0xffaadd, 0.6, 30); l3.position.set(0, 6, 0); scene.add(l3)

    // Yulduzlar
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

    // Raycaster — atomlarga bosish
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

    // Animatsiya
    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      controls.update()
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

  // Molekulani qayta qurish — parametr o'zgarganda
  useEffect(() => {
    rebuildScene()
  }, [rebuildScene])

  // Auto-rotate o'zgarganda
  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate
  }, [autoRotate])

  // ═══════════════════════════════════════════════════════════
  // PDF GENERATSIYA — GEOMETRIK IZOMERIYA UCHUN MAXSUS
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
        purpleMid: rgb(0.65, 0.55, 0.98), purpleSoft: rgb(0.51, 0.39, 0.71),
        purpleDark: rgb(0.12, 0.11, 0.29),
        textDark: rgb(0.08, 0.08, 0.16), textMuted: rgb(0.47, 0.47, 0.55),
        textGray: rgb(0.47, 0.47, 0.47),
        orange: rgb(0.86, 0.55, 0), red: rgb(0.80, 0.20, 0.20),
        green: rgb(0.08, 0.55, 0.31), greenLight: rgb(0.85, 0.98, 0.90),
        blue: rgb(0.08, 0.31, 0.75), blueLight: rgb(0.86, 0.94, 1.0),
        grayLine: rgb(0.78, 0.78, 0.86),
        bgPurple: rgb(0.97, 0.96, 1.0), bgOrange: rgb(1.0, 0.97, 0.94),
        bgBlue: rgb(0.94, 0.98, 1.0), bgGreen: rgb(0.94, 1.0, 0.98),
        bgYellow: rgb(1.0, 0.98, 0.92), bgRed: rgb(1.0, 0.94, 0.94),
        white: rgb(1, 1, 1), pink: rgb(0.98, 0.85, 0.88)
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
          `Geometrik izomeriya 3D Lab  •  ${cleanText(isomer.formula)}  •  ${new Date().toLocaleDateString("uz-UZ")}`,
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

      // ═══════════════════════════════════════════════════════
      // 1-SAHIFA — MUQOVA
      // ═══════════════════════════════════════════════════════
      page.drawRectangle({ x: 0, y: PAGE_H - 200, width: PAGE_W, height: 200, color: C.purpleDark })
      page.drawRectangle({ x: 0, y: PAGE_H - 205, width: PAGE_W, height: 5, color: C.purple })

      const title = "GEOMETRIK IZOMERIYA"
      const tW = measure(title, boldFont, 26)
      page.drawText(title, { x: (PAGE_W - tW) / 2, y: PAGE_H - 90, size: 26, font: boldFont, color: C.white })

      const subtitle = "3D Tuzilishlar tahlili va ilmiy sharh"
      const sW = measure(subtitle, italicFont, 13)
      page.drawText(subtitle, { x: (PAGE_W - sW) / 2, y: PAGE_H - 115, size: 13, font: italicFont, color: C.purpleLight })

      const formulaText = cleanText(isomer.formula)
      const fW = measure(formulaText, boldFont, 22)
      page.drawText(formulaText, { x: (PAGE_W - fW) / 2, y: PAGE_H - 160, size: 22, font: boldFont, color: C.white })

      y = PAGE_H - 240

      drawInfoBox("Tanlangan kompleks", isomer.title + " — " + cleanText(isomer.formula), C.bgPurple, C.purple)

      const meta = [
        ["Geometriya:", isomer.geometry],
        ["Koordinatsion son:", String(isomer.coordinationNumber)],
        ["Gibridlanish:", isomer.hybridization],
        ["Markaziy ion:", `${isomer.center.element}${isomer.center.charge || ""}`]
      ]
      meta.forEach(([k, v]) => {
        checkBreak(18)
        page.drawText(cleanText(k), { x: MARGIN + 10, y, size: 11, font: boldFont, color: C.purple })
        page.drawText(cleanText(v), { x: MARGIN + 150, y, size: 11, font: regularFont, color: C.textDark })
        y -= 18
      })
      y -= 15

      // ── 1. Ilmiy kirish ──
      if (pdfSections.intro) {
        drawSectionHeader(1, "Kirish — Geometrik izomeriya nima?")
        drawParagraph(
          "Geometrik izomeriya (yoki sis-trans izomeriya) — bir xil molekulyar formulaga, bir xil bog'lanishlar to'plamiga ega, lekin ligandlarning markaziy atom atrofidagi fazoviy joylashuvi bilan farq qiladigan koordinatsion birikmalar hodisasidir. Bu stereoizomeriyaning eng muhim turlaridan biri bo'lib, molekulaning kimyoviy, fizik va biologik xossalariga jiddiy ta'sir ko'rsatadi."
        )
        drawParagraph(
          "Geometrik izomeriya asosan quyidagi koordinatsion sonli komplekslarda uchraydi:"
        )
        drawBulletPoint("Kvadrat-planar (KS = 4): sis va trans shakllar — masalan, [Pt(NH₃)₂Cl₂]")
        drawBulletPoint("Oktaedrik (KS = 6, MA₄B₂ turi): sis va trans — masalan, [Co(NH₃)₄Cl₂]⁺")
        drawBulletPoint("Oktaedrik (KS = 6, MA₃B₃ turi): fac (facial) va mer (meridional) — masalan, [Co(NH₃)₃Cl₃]")
        drawBulletPoint("Xelat komplekslarda: [Co(en)₂Cl₂]⁺ tipidagi bis-xelatlar")
      }

      // ── 2. Geometrik xususiyatlar ──
      if (pdfSections.geometry) {
        drawSectionHeader(2, "Fazoviy tuzilish va bog'lanish burchaklari")

        if (isomer.category === "square-planar") {
          drawInfoBox(
            "cis-[Pt(NH₃)₂Cl₂]",
            "Ikkita Cl⁻ ligandi qo'shni holatda (Cl–Pt–Cl burchagi = 90°). Molekulaning simmetriya guruhi C₂ᵥ. Markaziy Pt atomida qutbli bog'lanishlar bir-birini kompensatsiya qilmaydi — natijada molekulaning umumiy dipol momenti nolga teng emas.",
            C.bgGreen, C.green
          )
          drawInfoBox(
            "trans-[Pt(NH₃)₂Cl₂]",
            "Ikkita Cl⁻ ligandi qarama-qarshi holatda (Cl–Pt–Cl burchagi = 180°). Molekulaning simmetriya guruhi D₂ₕ. Qutbli bog'lanishlar bir-birini to'liq kompensatsiyalaydi — dipol momenti nolga teng.",
            C.bgRed, C.red
          )
        } else if (isomer.category === "octahedral-2") {
          drawInfoBox(
            "cis-[Co(NH₃)₄Cl₂]⁺",
            "Ikkita Cl⁻ oktaedrning qo'shni uchlarida (Cl–Co–Cl = 90°). C₂ᵥ simmetriyaga ega. Rangi binafsha-qizil (violeo).",
            C.bgGreen, C.green
          )
          drawInfoBox(
            "trans-[Co(NH₃)₄Cl₂]⁺",
            "Ikkita Cl⁻ oktaedrning qarama-qarshi uchlarida (Cl–Co–Cl = 180°). D₄ₕ simmetriyaga ega. Rangi yashil (praseo). Werner tomonidan 1893-yilda birinchi bo'lib ajratilgan.",
            C.bgRed, C.red
          )
        } else if (isomer.category === "octahedral-3") {
          drawInfoBox(
            "fac-[Co(NH₃)₃Cl₃]",
            "Uchta Cl⁻ oktaedrning bitta uchburchak yuzida (facial). Barcha Cl–Co–Cl burchaklari 90°. C₃ᵥ simmetriya. C₃ o'q markaziy atomdan uchburchak markaziga o'tadi.",
            C.bgGreen, C.green
          )
          drawInfoBox(
            "mer-[Co(NH₃)₃Cl₃]",
            "Uchta Cl⁻ meridian bo'ylab bir tekislikda (meridional). Ikkita Cl 180°, uchinchisi 90°. C₂ᵥ simmetriya. Optik faol emas (σ tekislikka ega).",
            C.bgRed, C.red
          )
        } else if (isomer.category === "octahedral-chelate") {
          drawInfoBox(
            "cis-[Co(en)₂Cl₂]⁺",
            "Ikkita Cl⁻ qo'shni (90°), ikkita etilendiamin (en) xelat halqalarni tashkil qiladi. C₂ simmetriya (faqat pastki eksa). MUHIM: cis-shakli xiral — Δ va Λ enantiomerlariga ega.",
            C.bgGreen, C.green
          )
          drawInfoBox(
            "trans-[Co(en)₂Cl₂]⁺",
            "Ikkita Cl⁻ qarama-qarshi (180°), ikkita en ekvatorial tekislikda. C₂ₕ simmetriya. Molekulada ko'zgu tekisligi (σₕ) mavjud — shuning uchun xiral EMAS.",
            C.bgRed, C.red
          )
        }
      }

      // ── 3. Simmetriya ──
      if (pdfSections.symmetry) {
        drawSectionHeader(3, "Simmetriya elementlari va nuqta guruhlari")
        drawParagraph(
          "Har bir izomerning simmetriya guruhi uning fizik xossalarini (dipol moment, IR/Raman spektrlari, optik faollik) belgilaydigan asosiy xarakteristikadir."
        )
        const forms = isomer.category === "octahedral-3" ? [["fac", isomer.symmetry.fac], ["mer", isomer.symmetry.mer]] : [["cis", isomer.symmetry.cis], ["trans", isomer.symmetry.trans]]
        forms.forEach(([f, s]) => {
          checkBreak(20)
          page.drawCircle({ x: MARGIN + 7, y: y - 3, size: 2.5, color: C.purple })
          page.drawText(`${f}-shakl:`, { x: MARGIN + 20, y, size: 11, font: boldFont, color: C.purple })
          page.drawText(cleanText(s), { x: MARGIN + 100, y, size: 11, font: regularFont, color: C.textDark })
          y -= 18
        })
        y -= 5
      }

      // ── 4. Dipol moment ──
      if (pdfSections.dipole) {
        drawSectionHeader(4, "Dipol moment va qutblanish")
        drawParagraph(
          "Molekulaning dipol momenti (μ) ligandlar simmetriyasidan kelib chiqadi. Simmetrik joylashuv (trans, D₄ₕ yoki D₂ₕ) dipol momentlarning to'liq kompensatsiyasiga olib keladi va μ = 0 bo'ladi. Qutbli va qutbsiz izomerlar bir-biridan quyidagi tajribalar bilan farqlanadi:"
        )
        drawBulletPoint("Elektr maydonida turg'unlik (qutbli molekulalar burala oladi)")
        drawBulletPoint("Erish qobiliyati (qutbli suvda yaxshi eriydi, qutbsiz kam)")
        drawBulletPoint("IR spektrida faol tebranish rejimlarining soni")

        const dipoleForms = isomer.category === "octahedral-3" ? [["fac", isomer.dipole.fac], ["mer", isomer.dipole.mer]] : [["cis", isomer.dipole.cis], ["trans", isomer.dipole.trans]]
        y -= 5
        dipoleForms.forEach(([f, d]) => {
          const bg = d && d.includes("0 D") ? C.bgBlue : C.bgOrange
          const brd = d && d.includes("0 D") ? C.blue : C.orange
          drawInfoBox(`${f}-shakl — μ`, d || "N/A", bg, brd)
        })
      }

      // ── 5. Biologik faollik (agar Pt sisplatin bo'lsa) ──
      if (pdfSections.biology && isomer.biology) {
        drawSectionHeader(5, "Biologik faollik va tibbiyotdagi ahamiyat")
        drawInfoBox("cis-shakli — SISPLATIN", cleanText(isomer.biology.cis), C.bgGreen, C.green)
        drawInfoBox("trans-shakli — TRANSPLATIN", cleanText(isomer.biology.trans), C.bgRed, C.red)
        drawParagraph(
          "Bu izomerlar orasidagi biologik farq — geometrik izomeriyaning eng dramatik namunasidir. Ikkala modda bir xil formulaga ega, lekin biri saratonni davolaydigan dori, ikkinchisi mutlaqo faolliksiz."
        )
      }

      // ── 6. Kashfiyot tarixi ──
      if (pdfSections.history) {
        drawSectionHeader(6, "Kashfiyot tarixi")
        drawParagraph(cleanText(isomer.discovery))

        if (isomer.id === "PtCisTrans") {
          drawInfoBox(
            "1965 — Barnett Rosenberg kashfiyoti",
            "Michigan universiteti fizigi Rosenberg elektr maydonining bakteriya bo'linishiga ta'sirini o'rganayotib, platinali elektroddan cis-[Pt(NH₃)₂Cl₂] ajralib chiqayotganini va u E. coli hujayralarining bo'linishini to'xtatayotganini kashf qildi. Bu tasodifiy kuzatuv butun onkologik kimyoterapiyaning asosini yaratdi.",
            C.bgYellow, C.orange
          )
        } else if (isomer.id === "CoTetraAmmine") {
          drawInfoBox(
            "1893 — Werner koordinatsion nazariyasi",
            "Alfred Werner Sürix universitetida CoCl₃·4NH₃ tarkibli birikmadan ikki xil rangda kristallanuvchi shakllarni ajratdi: praseo (yashil) va violeo (binafsha). Bu ikki xil rangdagi kristallar bir xil kimyoviy formulaga ega, lekin fazoviy tuzilishlari farq qiladi — bu geometrik izomeriyaning to'g'ridan-to'g'ri isbotidir. Werner shu ish uchun 1913-yilda Nobel mukofotini oldi.",
            C.bgPurple, C.purple
          )
        }
      }

      // ── 7. Solishtirish jadvali ──
      if (pdfSections.table) {
        drawSectionHeader(7, "Solishtirish jadvali")
        const rows = isomer.category === "octahedral-3"
          ? [
              ["Xususiyat", "fac-shakl", "mer-shakl"],
              ["Ligand joylashuvi", "3 ta B bir yuzda", "3 ta B meridianda"],
              ["Simmetriya", isomer.symmetry.fac, isomer.symmetry.mer],
              ["Dipol moment", isomer.dipole.fac, isomer.dipole.mer],
              ["Rang", isomer.color?.fac || "—", isomer.color?.mer || "—"]
            ]
          : [
              ["Xususiyat", "cis-shakl", "trans-shakl"],
              ["Ligand joylashuvi", "90° qo'shni", "180° qarama-qarshi"],
              ["Simmetriya", isomer.symmetry.cis, isomer.symmetry.trans],
              ["Dipol moment", isomer.dipole.cis, isomer.dipole.trans],
              ["Rang", isomer.color?.cis || "—", isomer.color?.trans || "—"]
            ]

        const colW = [CONTENT_W * 0.30, CONTENT_W * 0.35, CONTENT_W * 0.35]
        const rowH = 24
        checkBreak(rows.length * rowH + 10)
        rows.forEach((row, ri) => {
          const isHeader = ri === 0
          if (isHeader) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.purple })
          } else if (ri % 2 === 0) {
            page.drawRectangle({ x: MARGIN, y: y - rowH, width: CONTENT_W, height: rowH, color: C.bgPurple })
          }
          let cx = MARGIN + 8
          row.forEach((cell, ci) => {
            const txt = truncate(cleanText(cell), isHeader ? boldFont : regularFont, 9.5, colW[ci] - 12)
            page.drawText(txt, {
              x: cx, y: y - rowH + 8, size: 9.5,
              font: isHeader ? boldFont : regularFont,
              color: isHeader ? C.white : C.textDark
            })
            cx += colW[ci]
          })
          y -= rowH
        })
        y -= 10
      }

      // ── 8. Adabiyotlar ──
      if (pdfSections.references) {
        drawSectionHeader(8, "Adabiyotlar")
        const refs = [
          "Werner, A. (1893). Beitrag zur Konstitution anorganischer Verbindungen. Zeitschrift für Anorganische Chemie, 3(1), 267–330.",
          "Rosenberg, B., van Camp, L., & Krigas, T. (1965). Inhibition of Cell Division in Escherichia coli by Electrolysis Products from a Platinum Electrode. Nature, 205(4972), 698–699.",
          "Housecroft, C. E., & Sharpe, A. G. (2018). Inorganic Chemistry (5th ed.). Pearson Education. — Chapter 20: d-block Metal Chemistry, Isomerism.",
          "Miessler, G. L., Fischer, P. J., & Tarr, D. A. (2014). Inorganic Chemistry (5th ed.). Pearson. — Chapter 9: Coordination Compounds.",
          "IUPAC (2005). Nomenclature of Inorganic Chemistry — Recommendations 2005. RSC Publishing.",
          "Cotton, F. A. (1990). Chemical Applications of Group Theory (3rd ed.). Wiley-Interscience.",
          "Lippard, S. J. (1982). New chemistry of an old molecule: cis-[Pt(NH₃)₂Cl₂]. Science, 218(4577), 1075–1082."
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

      pdfDoc.setTitle(`Geometrik izomeriya — ${cleanText(isomer.formula)}`)
      pdfDoc.setSubject("Koordinatsion birikmalarning geometrik izomeriyasi")
      pdfDoc.setAuthor("JDA-Kimyo Research Platform")
      pdfDoc.setCreator("JDA-Kimyo Interactive 3D Lab")
      pdfDoc.setKeywords(["geometrik izomeriya", "sis-trans", "fac-mer", "koordinatsion kimyo"])

      const bytes = await pdfDoc.save()
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `geometrik-izomeriya-${isomer.id}.pdf`
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

      {/* HEADER */}
      {!fullscreenMode && (
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-purple-800/50 z-30 bg-purple-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            href="/oquv/izomeriyasi/stereo/geometrik"
            className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span>←</span>
            <span className="hidden sm:inline">Orqaga</span>
          </Link>
          <div className="h-8 w-px bg-purple-800 flex-shrink-0"></div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-purple-300 flex items-center gap-2 truncate">
              <span>📐</span>
              <span className="hidden sm:inline">Geometrik izomeriya — 3D Laboratoriya</span>
              <span className="sm:hidden">Geometrik 3D</span>
            </h1>
            <p className="text-purple-500 text-xs truncate">
              {isomer.formula} • {isomer.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <select
            value={currentIsomer}
            onChange={(e) => setCurrentIsomer(e.target.value)}
            className="bg-purple-900/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-purple-700/50 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[220px]"
          >
            <option value="PtCisTrans">[Pt(NH₃)₂Cl₂] — Sisplatin</option>
            <option value="CoTetraAmmine">[Co(NH₃)₄Cl₂]⁺ — Werner</option>
            <option value="CoFacMer">[Co(NH₃)₃Cl₃] — fac/mer</option>
            <option value="CoEnCl2">[Co(en)₂Cl₂]⁺ — xelat</option>
          </select>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-all text-sm ${autoRotate ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Avtomatik aylantirish"
          >🔄</button>

          <button
            onClick={() => togglePanel("info")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "info" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Ma'lumot paneli"
          >ℹ️</button>

          <button
            onClick={() => togglePanel("compare")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "compare" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Solishtirish jadvali"
          >📊</button>

          {isomer.biology && (
            <button
              onClick={() => togglePanel("biology")}
              className={`p-2 rounded-lg transition-all text-sm ${activePanel === "biology" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
              title="Biologik faollik"
            >💊</button>
          )}

          <button
            onClick={() => togglePanel("history")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "history" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Kashfiyot tarixi"
          >📜</button>

          <button
            onClick={() => togglePanel("test")}
            className={`p-2 rounded-lg transition-all text-sm ${activePanel === "test" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
            title="Test / mashqlar"
          >🧠</button>

          <button
            onClick={() => setPdfModalOpen(true)}
            className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
            title="PDF eksport"
          >📄</button>

          <button
            onClick={() => setFullscreenMode(true)}
            className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
            title="To'liq ekran"
          >🖥️</button>
        </div>
      </header>
      )}

      {fullscreenMode && (
        <button
          onClick={() => setFullscreenMode(false)}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-purple-900/70 backdrop-blur-md text-white hover:bg-purple-700/80 transition-all shadow-2xl border border-purple-500/40"
          title="Fullscreen rejimidan chiqish"
        >
          <span className="text-lg">✕</span>
        </button>
      )}

      {/* ASOSIY SCENE */}
      <div className="flex-1 flex flex-row relative overflow-hidden">

        {/* CHAP — Boshqaruv paneli */}
        {!fullscreenMode && (
        <div
          ref={panelRef}
          className={`absolute z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 w-[270px] shadow-2xl max-h-[calc(100vh-130px)] flex flex-col ${isPanelDragging ? 'shadow-purple-500/50 border-purple-500/80 select-none' : ''}`}
          style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}
        >
          <div
            onMouseDown={(e) => { if (e.button !== 0) return; e.preventDefault(); handlePanelDragStart(e.clientX, e.clientY) }}
            onTouchStart={(e) => { if (e.touches.length > 0) handlePanelDragStart(e.touches[0].clientX, e.touches[0].clientY) }}
            className={`flex items-center justify-between px-3 py-2 border-b border-purple-700/40 rounded-t-xl ${isPanelDragging ? 'cursor-grabbing bg-purple-800/60' : 'cursor-grab bg-purple-900/40 hover:bg-purple-800/50'} transition-colors select-none touch-none`}
            title="Ushlab siljiting"
          >
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-2">
              <span className="text-purple-400">⋮⋮</span>
              <span>🎛️</span> Boshqaruv paneli
            </h3>
            <span className="text-purple-400 text-[10px] opacity-70">↕ ↔</span>
          </div>
          <div className="p-3 overflow-y-auto custom-scrollbar flex-1">

            {/* — KO'RINISH — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "view" ? null : "view")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>👁️</span> Ko'rinish</span>
              <span>{expandedSection === "view" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "view" && (
              <div className="space-y-2 mb-3 px-1">
                <div className="text-[11px] text-purple-400 mb-1">Rejim:</div>
                <div className="grid grid-cols-3 gap-1">
                  <button onClick={() => setViewMode("both")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "both" ? 'bg-purple-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>Ikkalasi</button>
                  <button onClick={() => setViewMode("left")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "left" ? 'bg-purple-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>
                    {isomer.category === "octahedral-3" ? "Fac" : "Cis"}
                  </button>
                  <button onClick={() => setViewMode("right")} className={`text-[10px] px-2 py-1.5 rounded ${viewMode === "right" ? 'bg-purple-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>
                    {isomer.category === "octahedral-3" ? "Mer" : "Trans"}
                  </button>
                </div>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Yorliqlar</span>
                  <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="accent-purple-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Vodorodlar (H)</span>
                  <input type="checkbox" checked={showHydrogens} onChange={(e) => setShowHydrogens(e.target.checked)} className="accent-purple-500" />
                </label>
              </div>
            )}

            {/* — ILMIY ASBOBLAR — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "scientific" ? null : "scientific")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>🔬</span> Ilmiy asboblar</span>
              <span>{expandedSection === "scientific" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "scientific" && (
              <div className="space-y-2 mb-3 px-1">
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Dipol o'qlari (μ)</span>
                  <input type="checkbox" checked={showDipole} onChange={(e) => setShowDipole(e.target.checked)} className="accent-orange-500" />
                </label>
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Simmetriya elementlari</span>
                  <input type="checkbox" checked={showSymmetry} onChange={(e) => setShowSymmetry(e.target.checked)} className="accent-yellow-500" />
                </label>
                {showSymmetry && (
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <button onClick={() => setSymmetryElement("C2")} className={`text-[10px] px-2 py-1 rounded ${symmetryElement === "C2" ? 'bg-yellow-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>C₂ o'q</button>
                    <button onClick={() => setSymmetryElement("C3")} className={`text-[10px] px-2 py-1 rounded ${symmetryElement === "C3" ? 'bg-yellow-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>C₃ o'q</button>
                    <button onClick={() => setSymmetryElement("C4")} className={`text-[10px] px-2 py-1 rounded ${symmetryElement === "C4" ? 'bg-yellow-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>C₄ o'q</button>
                    <button onClick={() => setSymmetryElement("sigma")} className={`text-[10px] px-2 py-1 rounded ${symmetryElement === "sigma" ? 'bg-cyan-600 text-white' : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'}`}>σ tekislik</button>
                  </div>
                )}
                <label className="flex items-center justify-between text-xs text-purple-300 cursor-pointer">
                  <span>Burchaklar (90°/180°)</span>
                  <input type="checkbox" checked={showAngles} onChange={(e) => setShowAngles(e.target.checked)} className="accent-cyan-500" />
                </label>
              </div>
            )}

            {/* — EKSPORT — */}
            <button
              onClick={() => setExpandedSection(expandedSection === "export" ? null : "export")}
              className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/40 hover:bg-purple-800/50 rounded-lg text-sm font-medium text-purple-200 transition-all mb-2"
            >
              <span className="flex items-center gap-2"><span>📤</span> Eksport</span>
              <span>{expandedSection === "export" ? "▼" : "▶"}</span>
            </button>
            {expandedSection === "export" && (
              <div className="space-y-2 mb-3 px-1">
                <button
                  onClick={() => setPdfModalOpen(true)}
                  className="w-full text-xs px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-medium transition-all"
                >📄 PDF hisobot yaratish</button>
              </div>
            )}

            {/* Tez kirish */}
            <div className="mt-3 pt-3 border-t border-purple-800/40">
              <div className="text-[11px] text-purple-400 mb-2 uppercase tracking-wide">💡 Maslahat</div>
              <p className="text-[10px] text-purple-400 leading-relaxed">
                Atomga bosing — batafsil ma'lumot chiqadi. Sichqoncha bilan aylantiring va zoom qiling. Panel'ni istagan joyingizga sudrab qo'ying.
              </p>
            </div>
          </div>
        </div>
        )}

        {/* 3D Container */}
        <div ref={containerRef} className="flex-1 w-full relative" />

        {/* LOADING */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 backdrop-blur-sm z-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400 mx-auto"></div>
              <p className="mt-4 text-purple-300 text-sm">3D sahna yuklanmoqda...</p>
            </div>
          </div>
        )}

        {/* Tanlangan atom — floating */}
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
              {selectedAtom.info?.mass && <div><span className="text-purple-500">Atom massasi:</span> {selectedAtom.info.mass}</div>}
              {selectedAtom.info?.config && <div><span className="text-purple-500">Konfiguratsiya:</span> <span className="font-mono">{selectedAtom.info.config}</span></div>}
              {selectedAtom.info?.role && <div><span className="text-purple-500">Roli:</span> {selectedAtom.info.role}</div>}
              {selectedAtom.info?.hybridization && <div><span className="text-purple-500">Gibridlanish:</span> {selectedAtom.info.hybridization}</div>}
              {selectedAtom.isDonor && <div className="mt-2 text-yellow-400">⚡ Bu ligand donor atomi</div>}
              {selectedAtom.isCenter && <div className="mt-2 text-pink-400">💎 Bu markaziy metall</div>}
            </div>
          </div>
        )}

        {/* — MA'LUMOT PANELI — */}
        {activePanel === "info" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-sm w-[320px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm">
                <span>ℹ️</span> {isomer.title}
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                <div className="text-purple-400 text-[10px] uppercase tracking-wide mb-1">Formula</div>
                <div className="font-mono text-sm text-white">{isomer.formula}</div>
                {isomer.fullSalt && <div className="text-purple-400 text-[10px] mt-1">To'liq tuz: <span className="font-mono">{isomer.fullSalt}</span></div>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-900/30 rounded p-2">
                  <div className="text-purple-500 text-[9px]">Geometriya</div>
                  <div className="text-purple-100 text-xs">{isomer.geometry}</div>
                </div>
                <div className="bg-purple-900/30 rounded p-2">
                  <div className="text-purple-500 text-[9px]">KS</div>
                  <div className="text-purple-100 text-xs">{isomer.coordinationNumber}</div>
                </div>
                <div className="bg-purple-900/30 rounded p-2">
                  <div className="text-purple-500 text-[9px]">Gibridlanish</div>
                  <div className="text-purple-100 text-xs">{isomer.hybridization}</div>
                </div>
                <div className="bg-purple-900/30 rounded p-2">
                  <div className="text-purple-500 text-[9px]">Markaz</div>
                  <div className="text-purple-100 text-xs">{isomer.center.element}{isomer.center.charge}</div>
                </div>
              </div>

              <div className="bg-green-950/40 rounded-lg p-3 border border-green-700/40">
                <div className="text-green-300 text-[10px] uppercase tracking-wide mb-1 font-bold">
                  {isomer.category === "octahedral-3" ? "fac-shakl" : "cis-shakl"}
                </div>
                <div className="text-green-100 text-[11px]">
                  Simmetriya: <span className="font-mono">{isomer.category === "octahedral-3" ? isomer.symmetry.fac : isomer.symmetry.cis}</span>
                </div>
                <div className="text-green-100 text-[11px]">
                  Dipol: {isomer.category === "octahedral-3" ? isomer.dipole.fac : isomer.dipole.cis}
                </div>
                {isomer.color && (
                  <div className="text-green-100 text-[11px]">
                    Rang: {isomer.category === "octahedral-3" ? isomer.color.fac : isomer.color.cis}
                  </div>
                )}
              </div>

              <div className="bg-red-950/40 rounded-lg p-3 border border-red-700/40">
                <div className="text-red-300 text-[10px] uppercase tracking-wide mb-1 font-bold">
                  {isomer.category === "octahedral-3" ? "mer-shakl" : "trans-shakl"}
                </div>
                <div className="text-red-100 text-[11px]">
                  Simmetriya: <span className="font-mono">{isomer.category === "octahedral-3" ? isomer.symmetry.mer : isomer.symmetry.trans}</span>
                </div>
                <div className="text-red-100 text-[11px]">
                  Dipol: {isomer.category === "octahedral-3" ? isomer.dipole.mer : isomer.dipole.trans}
                </div>
                {isomer.color && (
                  <div className="text-red-100 text-[11px]">
                    Rang: {isomer.category === "octahedral-3" ? isomer.color.mer : isomer.color.trans}
                  </div>
                )}
              </div>

              {isomer.note && (
                <div className="bg-blue-950/40 rounded-lg p-3 border border-blue-700/40">
                  <div className="text-blue-300 text-[10px] uppercase tracking-wide mb-1">⚠️ Muhim</div>
                  <div className="text-blue-100 text-[11px] leading-relaxed">{isomer.note}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* — SOLISHTIRISH JADVAL — */}
        {activePanel === "compare" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-md w-[360px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-200 flex items-center gap-2 text-sm">
                <span>📊</span> Solishtirish jadvali
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-purple-800/50">
                  <th className="border border-purple-700/50 px-2 py-1.5 text-left text-purple-100">Xususiyat</th>
                  <th className="border border-purple-700/50 px-2 py-1.5 text-left text-green-300">
                    {isomer.category === "octahedral-3" ? "fac" : "cis"}
                  </th>
                  <th className="border border-purple-700/50 px-2 py-1.5 text-left text-red-300">
                    {isomer.category === "octahedral-3" ? "mer" : "trans"}
                  </th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Ligand burchagi</td><td className="border border-purple-800/50 px-2 py-1.5">90°</td><td className="border border-purple-800/50 px-2 py-1.5">180°</td></tr>
                <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Simmetriya</td><td className="border border-purple-800/50 px-2 py-1.5 font-mono">{isomer.category === "octahedral-3" ? isomer.symmetry.fac : isomer.symmetry.cis}</td><td className="border border-purple-800/50 px-2 py-1.5 font-mono">{isomer.category === "octahedral-3" ? isomer.symmetry.mer : isomer.symmetry.trans}</td></tr>
                <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Dipol moment</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.category === "octahedral-3" ? isomer.dipole.fac : isomer.dipole.cis}</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.category === "octahedral-3" ? isomer.dipole.mer : isomer.dipole.trans}</td></tr>
                {isomer.color && (
                  <tr className="bg-purple-900/30"><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Rang</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.category === "octahedral-3" ? isomer.color.fac : isomer.color.cis}</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.category === "octahedral-3" ? isomer.color.mer : isomer.color.trans}</td></tr>
                )}
                {isomer.solubility && (
                  <tr><td className="border border-purple-800/50 px-2 py-1.5 font-semibold">Eruvchanlik</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.solubility.cis}</td><td className="border border-purple-800/50 px-2 py-1.5">{isomer.solubility.trans}</td></tr>
                )}
              </tbody>
            </table>
            <div className="mt-3 text-[10px] text-purple-400 leading-relaxed">
              💡 <strong>Xotira uchun:</strong> {isomer.category === "octahedral-3" ? "fac = 'face' (yuz), mer = 'meridian' — 3 ta bir xil ligand qanday joylashganini ko'rsatadi." : "cis = 'shu tomonda' (qo'shni, 90°), trans = 'boshqa tomonda' (qarama-qarshi, 180°)"}
            </div>
          </div>
        )}

        {/* — BIOLOGIK FAOLLIK — */}
        {activePanel === "biology" && isomer.biology && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-pink-700/50 max-w-md w-[360px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-pink-200 flex items-center gap-2 text-sm">
                <span>💊</span> Biologik faollik
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-green-950/50 rounded-lg p-3 border border-green-700/50">
                <div className="text-green-300 font-bold text-sm mb-1">✅ cis-shakli (SISPLATIN)</div>
                <p className="text-green-100 text-[11px] leading-relaxed">{isomer.biology.cis}</p>
              </div>
              <div className="bg-red-950/50 rounded-lg p-3 border border-red-700/50">
                <div className="text-red-300 font-bold text-sm mb-1">❌ trans-shakli (TRANSPLATIN)</div>
                <p className="text-red-100 text-[11px] leading-relaxed">{isomer.biology.trans}</p>
              </div>
              <div className="bg-yellow-950/40 rounded-lg p-3 border border-yellow-700/40">
                <div className="text-yellow-300 font-bold text-[11px] mb-1">🎯 Sabab</div>
                <p className="text-yellow-100 text-[10px] leading-relaxed">
                  Sisplatinda ikkita Cl⁻ 90° burchakda — DNK'ning ikkita qo'shni guanin bazasidagi N7 atomlariga bir vaqtda bog'lana oladi (intra-chain cross-link). Transplatinda esa Cl⁻ lar 180° — bunday geometrik moslik yo'q.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* — TARIX — */}
        {activePanel === "history" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-amber-700/50 max-w-md w-[360px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-amber-200 flex items-center gap-2 text-sm">
                <span>📜</span> Kashfiyot tarixi
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="bg-amber-950/40 rounded-lg p-3 border border-amber-700/40">
                <p className="text-amber-100 text-[11px] leading-relaxed">{isomer.discovery}</p>
              </div>
              {isomer.id === "PtCisTrans" && (
                <>
                  <div className="border-l-2 border-purple-500 pl-3">
                    <div className="text-purple-300 font-bold text-[11px]">1844 — Michele Peyrone</div>
                    <p className="text-purple-200 text-[10px]">Italyan kimyogari birinchi bo'lib cis-[Pt(NH₃)₂Cl₂]ni ("Peyronening tuzi") sintez qildi.</p>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-3">
                    <div className="text-blue-300 font-bold text-[11px]">1893 — Alfred Werner</div>
                    <p className="text-blue-200 text-[10px]">Koordinatsion nazariya asosida ikki xil izomer borligini nazariy tushuntirdi.</p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-3">
                    <div className="text-green-300 font-bold text-[11px]">1965 — Barnett Rosenberg</div>
                    <p className="text-green-200 text-[10px]">Elektroliz tajribasida E. coli bakteriyasi bo'linishini to'xtatuvchi ta'sirini kashf qildi.</p>
                  </div>
                  <div className="border-l-2 border-pink-500 pl-3">
                    <div className="text-pink-300 font-bold text-[11px]">1978 — FDA tasdig'i</div>
                    <p className="text-pink-200 text-[10px]">Sisplatin AQSHda testikula, tuxumdon va siydik pufagi saratonini davolash uchun rasmiy tasdiqlangan.</p>
                  </div>
                </>
              )}
              {isomer.id === "CoTetraAmmine" && (
                <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-700/40">
                  <div className="text-purple-300 font-bold text-[11px] mb-1">🏆 Nobel mukofoti (1913)</div>
                  <p className="text-purple-100 text-[10px] leading-relaxed">
                    Alfred Werner "koordinatsion birikmalarda atomlarning bog'lanishini o'rganish orqali kimyoning tuzilish nazariyasiga qo'shgan hissasi uchun" Kimyo bo'yicha Nobel mukofotini oldi. Bu — noorganik kimyo bo'yicha berilgan birinchi Nobel edi.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* — TEST — */}
        {activePanel === "test" && !fullscreenMode && (
          <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-cyan-700/50 max-w-md w-[360px] shadow-2xl animate-slide-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-cyan-200 flex items-center gap-2 text-sm">
                <span>🧠</span> O'z-o'zini sinash
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-purple-200 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <TestQuestion
                q="Cis va trans izomerlar orasidagi asosiy farq nima?"
                a="Ligandlarning markaziy atom atrofidagi fazoviy joylashuvi."
              />
              <TestQuestion
                q="Nima uchun trans-[Pt(NH₃)₂Cl₂] biologik faol emas?"
                a="Cl⁻ lar 180° qarama-qarshi turgani uchun DNK'ning ikki qo'shni guaniniga bir vaqtda bog'lana olmaydi."
              />
              <TestQuestion
                q="fac va mer atamalari nima anglatadi?"
                a="fac (facial) — 3 ta ligand oktaedrning bitta yuzida; mer (meridional) — 3 ta ligand meridian bo'ylab bir tekislikda."
              />
              <TestQuestion
                q="Qaysi izomerning dipol momenti nolga teng?"
                a="Simmetrik joylashgan (trans, D₄ₕ yoki D₂ₕ) shakl — bog'lanish momentlari o'zaro kompensatsiyalanadi."
              />
              <TestQuestion
                q="[Co(en)₂Cl₂]⁺ ning cis-shakli qanday alohida xususiyatga ega?"
                a="Xiral — Δ va Λ enantiomerlariga ega bo'lib, optik faol."
              />
            </div>
          </div>
        )}

        {/* — PDF MODAL — */}
        {pdfModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPdfModalOpen(false)}>
            <div className="bg-purple-950 rounded-2xl border border-purple-600/50 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-purple-800/50">
                <h3 className="text-lg font-bold text-purple-200 flex items-center gap-2">
                  <span>📄</span> PDF hisobot yaratish
                </h3>
                <button onClick={() => setPdfModalOpen(false)} className="text-purple-400 hover:text-purple-200 text-2xl leading-none">×</button>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-xs text-purple-400 mb-2">Qaysi bo'limlarni PDFga qo'shishni tanlang:</p>
                {[
                  { k: "intro", label: "1. Kirish — geometrik izomeriya", icon: "📖" },
                  { k: "geometry", label: "2. Fazoviy tuzilish va burchaklar", icon: "📐" },
                  { k: "symmetry", label: "3. Simmetriya guruhi", icon: "🔷" },
                  { k: "dipole", label: "4. Dipol moment", icon: "⚡" },
                  { k: "biology", label: "5. Biologik faollik", icon: "💊" },
                  { k: "history", label: "6. Kashfiyot tarixi", icon: "📜" },
                  { k: "table", label: "7. Solishtirish jadvali", icon: "📊" },
                  { k: "references", label: "8. Adabiyotlar", icon: "📚" }
                ].map(({ k, label, icon }) => (
                  <label key={k} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-900/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pdfSections[k]}
                      onChange={(e) => setPdfSections({ ...pdfSections, [k]: e.target.checked })}
                      className="accent-purple-500 w-4 h-4"
                    />
                    <span className="text-sm">{icon}</span>
                    <span className="text-sm text-purple-200">{label}</span>
                  </label>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-purple-800/50 flex gap-2 justify-end">
                <button
                  onClick={() => setPdfModalOpen(false)}
                  className="px-4 py-2 bg-purple-900/50 hover:bg-purple-800/60 rounded-lg text-sm text-purple-200"
                  disabled={pdfGenerating}
                >Bekor qilish</button>
                <button
                  onClick={generatePDF}
                  disabled={pdfGenerating}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 rounded-lg text-sm text-white font-medium flex items-center gap-2"
                >
                  {pdfGenerating ? (
                    <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Yaratilmoqda...</>
                  ) : (
                    <>📄 PDFni yuklab olish</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PASTKI RANG LEGENDA */}
      {!fullscreenMode && (
        <div className="flex justify-center gap-4 py-3 px-4 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap text-xs">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#D0D0E0]"></div><span className="text-purple-300">Pt — Platina</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#F090A0]"></div><span className="text-purple-300">Co — Kobalt</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3050F8]"></div><span className="text-purple-300">N — Azot</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#1FF01F]"></div><span className="text-purple-300">Cl — Xlor</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#909090]"></div><span className="text-purple-300">C — Uglerod</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white"></div><span className="text-purple-300">H — Vodorod</span></div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(88, 28, 135, 0.1); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.4); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.6); }
        @keyframes slide-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </main>
  )
}

// ─────────────────────────────────────────────────────────────
// KICHIK KOMPONENT: Test savoli (yig'iladigan javob)
// ─────────────────────────────────────────────────────────────
function TestQuestion({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-cyan-950/30 rounded-lg border border-cyan-800/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 hover:bg-cyan-900/30 transition-colors flex items-start gap-2"
      >
        <span className="text-cyan-400 flex-shrink-0">❓</span>
        <span className="text-cyan-100 text-[11px] leading-relaxed">{q}</span>
        <span className="ml-auto text-cyan-500 text-xs flex-shrink-0">{open ? "▼" : "▶"}</span>
      </button>
      {open && (
        <div className="px-3 py-2 bg-cyan-950/50 border-t border-cyan-800/40">
          <div className="flex items-start gap-2">
            <span className="text-green-400 flex-shrink-0">✓</span>
            <span className="text-green-100 text-[11px] leading-relaxed">{a}</span>
          </div>
        </div>
      )}
    </div>
  )
}
