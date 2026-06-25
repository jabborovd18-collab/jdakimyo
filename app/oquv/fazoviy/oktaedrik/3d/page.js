"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

// ═══════════════════════════════════════════════════════════
// CPK RANGLARI (IUPAC/RASMOL standartlari — qatiy)
// ═══════════════════════════════════════════════════════════
const CPK = {
  Co: 0xF090A0,  // Kobalt — pushti
  Fe: 0xE06633,  // Temir — to'q sariq
  N:  0x3050F8,  // Azot — ko'k
  C:  0x909090,  // Uglerod — kulrang
  H:  0xFFFFFF,  // Vodorod — oq
  Cl: 0x1FF01F,  // Xlor — yashil
  K:  0x8F40D4,  // Kaliy — binafsha
  bond: 0x8B9DC3 // Bog' — ko'k-kulrang
}

// ═══════════════════════════════════════════════════════════
// KOMPLEKS BIRIKMALAR DATABASE
// ═══════════════════════════════════════════════════════════
const COMPLEXES = {
  CoNH3: {
    id: "CoNH3",
    formula: "[Co(NH₃)₆]³⁺",
    fullSalt: "[Co(NH₃)₆]Cl₃",
    name: "Geksaamminkobalt(III) xlorid",
    center: { element: "Co", color: CPK.Co, radius: 0.45, charge: "+3" },
    ligand: { type: "NH3", donor: "N", donorColor: CPK.N, donorRadius: 0.30 },
    bondLength: 2.0,        // Co-N: 1.96 Å (scaled)
    bondLengthReal: "1.96 Å",
    outerIon: { element: "Cl", color: CPK.Cl, radius: 0.32, charge: "-1", count: 3 },
    hybridization: "d²sp³",
    magnetism: "Diamagnit",
    color: "Sariq-jigarrang kristall",
    dOrbital: { tg: 6, eg: 0, type: "LS" }, // Low spin
    geometry: "Oktaedrik",
    symmetry: "Oh"
  },
  FeCN: {
    id: "FeCN",
    formula: "[Fe(CN)₆]⁴⁻",
    fullSalt: "K₄[Fe(CN)₆]",
    name: "Kaliy geksatsianoferrat(II)",
    center: { element: "Fe", color: CPK.Fe, radius: 0.45, charge: "+2" },
    ligand: { type: "CN", donor: "C", donorColor: CPK.C, donorRadius: 0.25 },
    bondLength: 1.95,       // Fe-C: 1.92 Å (scaled)
    bondLengthReal: "1.92 Å",
    outerIon: { element: "K", color: CPK.K, radius: 0.40, charge: "+1", count: 4 },
    hybridization: "d²sp³",
    magnetism: "Diamagnit",
    color: "Sariq kristall",
    dOrbital: { tg: 6, eg: 0, type: "LS" },
    geometry: "Oktaedrik",
    symmetry: "Oh"
  }
}

// ═══════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════
const ATOM_INFO = {
  Co: { name: "Kobalt (Co)", atomic: 27, mass: "58.93 u", config: "[Ar] 3d⁷ 4s²", oxidation: "+3", role: "Markaziy ion", color: "#F090A0" },
  Fe: { name: "Temir (Fe)", atomic: 26, mass: "55.85 u", config: "[Ar] 3d⁶ 4s²", oxidation: "+2", role: "Markaziy ion", color: "#E06633" },
  N:  { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "Ligand donor atomi", hybridization: "sp³", color: "#3050F8" },
  C:  { name: "Uglerod (C)", atomic: 6, mass: "12.01 u", config: "[He] 2s² 2p²", role: "CN⁻ donor atomi", hybridization: "sp", color: "#909090" },
  H:  { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "NH₃ tarkibi", color: "#FFFFFF" },
  Cl: { name: "Xlor (Cl⁻)", atomic: 17, mass: "35.45 u", config: "[Ne] 3s² 3p⁶", charge: "-1", role: "Tashqi sfera ioni", color: "#1FF01F" },
  K:  { name: "Kaliy (K⁺)", atomic: 19, mass: "39.10 u", config: "[Ar]", charge: "+1", role: "Tashqi sfera kation", color: "#8F40D4" }
}

// ═══════════════════════════════════════════════════════════
// 3D MATN SPRITE YARATISH (atom yorliqlari va bog' uzunliklari)
// ═══════════════════════════════════════════════════════════
function makeTextSprite(text, options = {}) {
  const {
    fontSize = 64,
    fontFamily = "Arial, sans-serif",
    color = "#ffffff",
    bgColor = "rgba(20, 10, 40, 0.85)",
    borderColor = "#a78bfa",
    padding = 16,
    scale = 0.5
  } = options

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  const textWidth = ctx.measureText(text).width
  canvas.width = textWidth + padding * 2
  canvas.height = fontSize + padding * 2

  // Background
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

  // Text
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(canvas.width / fontSize * scale, canvas.height / fontSize * scale, 1)
  sprite.renderOrder = 999
  return sprite
}

export default function Oktaedrik3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)
  const atomsRef = useRef([])
  const labelsRef = useRef([])
  const bondLabelsRef = useRef([])
  const bondsRef = useRef([])
  const ligandGroupsRef = useRef([])
  const outerSphereRef = useRef([])
  const clipPlaneRef = useRef(null)
  const ligandAtomsRef = useRef([]) // burchak o'lchash uchun donor atomlar

  // UI states
  const [loading, setLoading] = useState(true)
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showTooltip, setShowTooltip] = useState(true)
  const [currentComplex, setCurrentComplex] = useState("CoNH3")
  const [showOuterSphere, setShowOuterSphere] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const [showBondLengths, setShowBondLengths] = useState(false)
  const [viewMode, setViewMode] = useState("ball-stick") // ball-stick | space-filling | wireframe
  const [sliceView, setSliceView] = useState(false)
  const [angleMeasureMode, setAngleMeasureMode] = useState(false)
  const [selectedLigands, setSelectedLigands] = useState([])
  const [measuredAngle, setMeasuredAngle] = useState(null)
  const [showDOrbital, setShowDOrbital] = useState(false)
  const [showInfoPanel, setShowInfoPanel] = useState(false)

  const complex = COMPLEXES[currentComplex]

  // ═══════════════════════════════════════════════════════════
  // BOND YARATISH
  // ═══════════════════════════════════════════════════════════
  const createBond = useCallback((scene, start, end, color = CPK.bond, radius = 0.08, opacity = 0.7) => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)

    const geometry = new THREE.CylinderGeometry(radius, radius, length, 16)
    const material = new THREE.MeshStandardMaterial({
      color, roughness: 0.4, metalness: 0.2,
      transparent: true, opacity
    })
    const bond = new THREE.Mesh(geometry, material)
    bond.position.copy(midpoint)
    bond.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    )
    bond.userData = { type: 'bond' }
    scene.add(bond)
    return bond
  }, [])

  // ═══════════════════════════════════════════════════════════
  // NH₃ LIGAND YARATISH
  // ═══════════════════════════════════════════════════════════
  const createNH3Ligand = useCallback((scene, nPos, coPos) => {
    const nGeo = new THREE.SphereGeometry(0.30, 48, 48)
    const nMat = new THREE.MeshStandardMaterial({
      color: CPK.N, roughness: 0.35, metalness: 0.15,
      emissive: CPK.N, emissiveIntensity: 0.05
    })
    const nMesh = new THREE.Mesh(nGeo, nMat)
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N, isDonor: true }
    nMesh.castShadow = true
    scene.add(nMesh)
    atomsRef.current.push(nMesh)
    ligandAtomsRef.current.push(nMesh)

    // N yorlig'i
    const nLabel = makeTextSprite("N", { color: "#bfdbfe", scale: 0.35 })
    nLabel.position.copy(nPos).add(new THREE.Vector3(0, 0.4, 0))
    scene.add(nLabel)
    labelsRef.current.push(nLabel)

    // 3 ta H atomi (tetraedral)
    const nToCo = new THREE.Vector3().subVectors(coPos, nPos).normalize()
    const outDir = nToCo.clone().negate()

    let perp1 = new THREE.Vector3()
    if (Math.abs(nToCo.y) < 0.9) {
      perp1.crossVectors(nToCo, new THREE.Vector3(0, 1, 0)).normalize()
    } else {
      perp1.crossVectors(nToCo, new THREE.Vector3(1, 0, 0)).normalize()
    }
    const perp2 = new THREE.Vector3().crossVectors(nToCo, perp1).normalize()

    const hnhAngle = 107 * Math.PI / 180
    const alpha = Math.PI - Math.acos(Math.sqrt((Math.cos(hnhAngle) + 0.5) / 1.5))

    for (let i = 0; i < 3; i++) {
      const phi = (i * 2 * Math.PI / 3) + Math.PI / 6
      const hDir = new THREE.Vector3()
        .addScaledVector(outDir, Math.cos(alpha))
        .addScaledVector(perp1, Math.sin(alpha) * Math.cos(phi))
        .addScaledVector(perp2, Math.sin(alpha) * Math.sin(phi))
        .normalize()

      const hPos = new THREE.Vector3().copy(nPos).addScaledVector(hDir, 0.55)

      const hGeo = new THREE.SphereGeometry(0.15, 24, 24)
      const hMat = new THREE.MeshStandardMaterial({
        color: CPK.H, roughness: 0.6, metalness: 0.05,
        emissive: 0xFFFFFF, emissiveIntensity: 0.02
      })
      const hMesh = new THREE.Mesh(hGeo, hMat)
      hMesh.position.copy(hPos)
      hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H }
      hMesh.castShadow = true
      scene.add(hMesh)
      atomsRef.current.push(hMesh)

      const bond = createBond(scene, nPos, hPos, 0xcccccc, 0.05)
      bond.userData = { type: 'bond', bondType: 'N-H', length: '1.01 Å' }
      bondsRef.current.push(bond)
    }
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // CN⁻ LIGAND YARATISH (C donor, N tashqarida)
  // ═══════════════════════════════════════════════════════════
  const createCNLigand = useCallback((scene, cPos, fePos) => {
    // C atomi (Fe ga yaqin, donor)
    const cGeo = new THREE.SphereGeometry(0.25, 48, 48)
    const cMat = new THREE.MeshStandardMaterial({
      color: CPK.C, roughness: 0.35, metalness: 0.15,
      emissive: CPK.C, emissiveIntensity: 0.05
    })
    const cMesh = new THREE.Mesh(cGeo, cMat)
    cMesh.position.copy(cPos)
    cMesh.userData = { type: 'atom', element: 'C', info: ATOM_INFO.C, isDonor: true }
    cMesh.castShadow = true
    scene.add(cMesh)
    atomsRef.current.push(cMesh)
    ligandAtomsRef.current.push(cMesh)

    // C yorlig'i
    const cLabel = makeTextSprite("C", { color: "#d1d5db", scale: 0.32 })
    cLabel.position.copy(cPos).add(new THREE.Vector3(0, 0.35, 0))
    scene.add(cLabel)
    labelsRef.current.push(cLabel)

    // N atomi (tashqi, C-N uchligida)
    const dirOut = new THREE.Vector3().subVectors(cPos, fePos).normalize()
    const nPos = new THREE.Vector3().copy(cPos).addScaledVector(dirOut, 1.16) // C≡N: 1.16 Å

    const nGeo = new THREE.SphereGeometry(0.28, 48, 48)
    const nMat = new THREE.MeshStandardMaterial({
      color: CPK.N, roughness: 0.35, metalness: 0.15,
      emissive: CPK.N, emissiveIntensity: 0.08
    })
    const nMesh = new THREE.Mesh(nGeo, nMat)
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N }
    nMesh.castShadow = true
    scene.add(nMesh)
    atomsRef.current.push(nMesh)

    // N yorlig'i
    const nLabel = makeTextSprite("N", { color: "#bfdbfe", scale: 0.32 })
    nLabel.position.copy(nPos).add(new THREE.Vector3(0, 0.4, 0))
    scene.add(nLabel)
    labelsRef.current.push(nLabel)

    // C≡N uchlik bog' (3 ta silindr)
    const offset = 0.06
    const perpVec = new THREE.Vector3()
    if (Math.abs(dirOut.y) < 0.9) {
      perpVec.crossVectors(dirOut, new THREE.Vector3(0, 1, 0)).normalize()
    } else {
      perpVec.crossVectors(dirOut, new THREE.Vector3(1, 0, 0)).normalize()
    }

    // Markaziy bog'
    const b1 = createBond(scene, cPos, nPos, 0xaaaaaa, 0.045, 0.85)
    b1.userData = { type: 'bond', bondType: 'C≡N', length: '1.16 Å' }
    bondsRef.current.push(b1)

    // Yon bog'lar
    const cOff1 = new THREE.Vector3().copy(cPos).addScaledVector(perpVec, offset)
    const nOff1 = new THREE.Vector3().copy(nPos).addScaledVector(perpVec, offset)
    const b2 = createBond(scene, cOff1, nOff1, 0xaaaaaa, 0.035, 0.7)
    bondsRef.current.push(b2)

    const cOff2 = new THREE.Vector3().copy(cPos).addScaledVector(perpVec, -offset)
    const nOff2 = new THREE.Vector3().copy(nPos).addScaledVector(perpVec, -offset)
    const b3 = createBond(scene, cOff2, nOff2, 0xaaaaaa, 0.035, 0.7)
    bondsRef.current.push(b3)
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // KOMPLEKS YARATISH (asosiy)
  // ═══════════════════════════════════════════════════════════
  const buildComplex = useCallback((scene, complexData) => {
    // Tozalash
    atomsRef.current = []
    labelsRef.current = []
    bondLabelsRef.current = []
    bondsRef.current = []
    ligandGroupsRef.current = []
    outerSphereRef.current = []
    ligandAtomsRef.current = []

    const center = complexData.center

    // ── Markaziy atom ──
    const coGeo = new THREE.SphereGeometry(center.radius, 64, 64)
    const coMat = new THREE.MeshStandardMaterial({
      color: center.color, roughness: 0.15, metalness: 0.85,
      emissive: center.color, emissiveIntensity: 0.15
    })
    const coAtom = new THREE.Mesh(coGeo, coMat)
    coAtom.castShadow = true
    coAtom.userData = { 
      type: 'atom', 
      element: center.element, 
      info: ATOM_INFO[center.element],
      isCenter: true
    }
    scene.add(coAtom)
    atomsRef.current.push(coAtom)

    // Markaziy atom yorlig'i
    const centerLabel = makeTextSprite(`${center.element}${center.charge}`, {
      color: "#ffffff",
      bgColor: `rgba(${parseInt(center.color.toString(16).slice(0,2),16)}, ${parseInt(center.color.toString(16).slice(2,4),16)}, ${parseInt(center.color.toString(16).slice(4,6),16)}, 0.9)`,
      borderColor: "#ffffff",
      scale: 0.5
    })
    centerLabel.position.set(0, center.radius + 0.5, 0)
    scene.add(centerLabel)
    labelsRef.current.push(centerLabel)

    // Glow
    const coGlow = new THREE.Mesh(
      new THREE.SphereGeometry(center.radius * 1.3, 32, 32),
      new THREE.MeshBasicMaterial({ color: center.color, transparent: true, opacity: 0.15 })
    )
    scene.add(coGlow)
    coAtom.userData.glow = coGlow

    // ── 6 ta ligand pozitsiyasi ──
    const d = complexData.bondLength
    const ligandPositions = [
      [ d,  0,  0], [-d,  0,  0],
      [ 0,  d,  0], [ 0, -d,  0],
      [ 0,  0,  d], [ 0,  0, -d]
    ]

    const coPos = new THREE.Vector3(0, 0, 0)
    const ligandVectors = []

    ligandPositions.forEach(([x, y, z], idx) => {
      const donorPos = new THREE.Vector3(x, y, z)
      ligandVectors.push(donorPos)

      // Co-X bog' (markaz-donor)
      const bond = createBond(scene, coPos, donorPos, CPK.bond, 0.09)
      bond.userData = { 
        type: 'bond', 
        bondType: `${center.element}-${complexData.ligand.donor}`,
        length: complexData.bondLengthReal
      }
      bondsRef.current.push(bond)

      // Bog' uzunligi yorlig'i (midpoint)
      const midpoint = new THREE.Vector3().addVectors(coPos, donorPos).multiplyScalar(0.5)
      const lengthLabel = makeTextSprite(complexData.bondLengthReal, {
        color: "#fef3c7",
        bgColor: "rgba(120, 53, 15, 0.9)",
        borderColor: "#fbbf24",
        fontSize: 48,
        scale: 0.35
      })
      lengthLabel.position.copy(midpoint).add(new THREE.Vector3(0.15, 0.15, 0))
      lengthLabel.visible = false
      scene.add(lengthLabel)
      bondLabelsRef.current.push(lengthLabel)

      // Ligandni yaratish
      if (complexData.ligand.type === "NH3") {
        createNH3Ligand(scene, donorPos, coPos)
      } else if (complexData.ligand.type === "CN") {
        createCNLigand(scene, donorPos, coPos)
      }
    })

    // ── Oktaedr qirralari (dashed) ──
    const edgeMaterial = new THREE.LineDashedMaterial({
      color: 0x8B5CF6,
      dashSize: 0.15, gapSize: 0.1,
      transparent: true, opacity: 0.5
    })

    for (let i = 0; i < ligandVectors.length; i++) {
      for (let j = i + 1; j < ligandVectors.length; j++) {
        const dot = ligandVectors[i].dot(ligandVectors[j])
        if (Math.abs(dot) < 0.01) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            ligandVectors[i], ligandVectors[j]
          ])
          const line = new THREE.Line(geometry, edgeMaterial.clone())
          line.computeLineDistances()
          line.userData = { type: 'edge' }
          scene.add(line)
        }
      }
    }

    // ── Tashqi sfera ionlari ──
    const outer = complexData.outerIon
    const outerDistance = 4.5
    const outerPositions = []

    if (outer.count === 3) {
      // 3 ta Cl⁻ — uchburchak
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI / 3) + Math.PI / 4
        outerPositions.push(new THREE.Vector3(
          outerDistance * Math.cos(angle),
          0.8 * Math.sin(i * Math.PI / 2),
          outerDistance * Math.sin(angle)
        ))
      }
    } else if (outer.count === 4) {
      // 4 ta K⁺ — tetraedr
      const tetVerts = [
        [1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]
      ]
      tetVerts.forEach(v => {
        outerPositions.push(new THREE.Vector3(
          v[0] * outerDistance * 0.65,
          v[1] * outerDistance * 0.65,
          v[2] * outerDistance * 0.65
        ))
      })
    }

    outerPositions.forEach((pos, idx) => {
      // Ion mesh
      const ionGeo = new THREE.SphereGeometry(outer.radius, 32, 32)
      const ionMat = new THREE.MeshStandardMaterial({
        color: outer.color,
        roughness: 0.3, metalness: 0.4,
        emissive: outer.color, emissiveIntensity: 0.15,
        transparent: true, opacity: 0.9
      })
      const ionMesh = new THREE.Mesh(ionGeo, ionMat)
      ionMesh.position.copy(pos)
      ionMesh.userData = {
        type: 'atom',
        element: outer.element,
        info: ATOM_INFO[outer.element],
        isOuter: true
      }
      ionMesh.visible = false
      ionMesh.castShadow = true
      scene.add(ionMesh)
      atomsRef.current.push(ionMesh)
      outerSphereRef.current.push(ionMesh)

      // Ion yorlig'i
      const ionLabel = makeTextSprite(`${outer.element}${outer.charge}`, {
        color: "#ffffff",
        bgColor: `rgba(${(outer.color >> 16) & 255}, ${(outer.color >> 8) & 255}, ${outer.color & 255}, 0.85)`,
        borderColor: "#ffffff",
        scale: 0.4
      })
      ionLabel.position.copy(pos).add(new THREE.Vector3(0, outer.radius + 0.4, 0))
      ionLabel.visible = false
      scene.add(ionLabel)
      labelsRef.current.push(ionLabel)
      outerSphereRef.current.push(ionLabel)

      // Ion bog' (punktir, kompleksdan tashqi ionga)
      const ionBondGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0), pos
      ])
      const ionBondMat = new THREE.LineDashedMaterial({
        color: outer.color,
        dashSize: 0.2, gapSize: 0.15,
        transparent: true, opacity: 0.4,
        linewidth: 2
      })
      const ionBond = new THREE.Line(ionBondGeo, ionBondMat)
      ionBond.computeLineDistances()
      ionBond.visible = false
      ionBond.userData = { type: 'ionic-bond' }
      scene.add(ionBond)
      outerSphereRef.current.push(ionBond)
    })

    return { coAtom, coGlow, ligandVectors }
  }, [createBond, createNH3Ligand, createCNLigand])

  // ═══════════════════════════════════════════════════════════
  // SCENE SETUP
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = null
    scene.fog = new THREE.Fog(0x0a0a1a, 18, 40)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1, 100
    )
    camera.position.set(5.5, 4, 6.5)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.localClippingEnabled = true
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 3
    controls.maxDistance = 18
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controlsRef.current = controls

    // Lighting
    scene.add(new THREE.AmbientLight(0x606080, 0.6))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
    keyLight.position.set(8, 10, 8)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(2048, 2048)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0xcc88ff, 0.4)
    fillLight.position.set(-6, -2, -4)
    scene.add(fillLight)
    const rimLight = new THREE.DirectionalLight(0x88ccff, 0.3)
    rimLight.position.set(0, -5, -8)
    scene.add(rimLight)

    // Clip plane (kesim ko'rinishi uchun)
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    clipPlaneRef.current = clipPlane

    // Grid
    const grid = new THREE.GridHelper(10, 20, 0x333355, 0x1a1a33)
    grid.position.y = -4.5
    grid.material.transparent = true
    grid.material.opacity = 0.3
    scene.add(grid)

    // Dastlabki kompleks
    buildComplex(scene, COMPLEXES[currentComplex])

    // Raycaster
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(atomsRef.current)

      if (intersects.length > 0) {
        const atom = intersects[0].object
        if (atom.userData.type === 'atom') {
          // Burchak o'lchash rejimi
          if (angleMeasureMode && atom.userData.isDonor) {
            setSelectedLigands(prev => {
              const newList = [...prev, atom]
              if (newList.length === 2) {
                // Burchakni hisoblash
                const v1 = newList[0].position.clone().normalize()
                const v2 = newList[1].position.clone().normalize()
                const angle = Math.acos(v1.dot(v2)) * 180 / Math.PI
                setMeasuredAngle(angle.toFixed(1))
                return newList
              }
              if (newList.length > 2) {
                setMeasuredAngle(null)
                return [atom]
              }
              return newList
            })
          } else {
            setSelectedAtom(atom.userData)
          }
        }
      } else {
        if (!angleMeasureMode) setSelectedAtom(null)
      }
    }

    renderer.domElement.addEventListener('click', onMouseClick)

    // Animation
    let frameId
    const clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Markaz pulsatsiya
      atomsRef.current.forEach(atom => {
        if (atom.userData.isCenter && atom.userData.glow) {
          atom.userData.glow.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.05)
          atom.rotation.y += 0.002
        }
      })

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    setTimeout(() => setLoading(false), 500)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('click', onMouseClick)

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
          else obj.material.dispose()
        }
        if (obj.material && obj.material.map) obj.material.map.dispose()
      })

      renderer.dispose()
      controls.dispose()
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      atomsRef.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ═══════════════════════════════════════════════════════════
  // KOMPLEKS ALMASHISH
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    // Eski elementlarni o'chirish
    const toRemove = []
    scene.traverse((obj) => {
      if (obj.userData && (
        obj.userData.type === 'atom' ||
        obj.userData.type === 'bond' ||
        obj.userData.type === 'edge' ||
        obj.userData.type === 'ionic-bond'
      )) {
        toRemove.push(obj)
      }
      if (obj instanceof THREE.Sprite) toRemove.push(obj)
    })
    // Glow sferalarni ham
    scene.children.forEach(child => {
      if (child instanceof THREE.Mesh && 
          child.material && 
          child.material.transparent && 
          child.material.opacity < 0.2 &&
          !child.userData.type) {
        toRemove.push(child)
      }
    })

    toRemove.forEach(obj => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
        else obj.material.dispose()
      }
      scene.remove(obj)
    })

    // Yangi kompleksni qurish
    buildComplex(scene, COMPLEXES[currentComplex])
    setSelectedAtom(null)
    setSelectedLigands([])
    setMeasuredAngle(null)
  }, [currentComplex, buildComplex])

  // ═══════════════════════════════════════════════════════════
  // TASHQI SFERA TOGGLE
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    outerSphereRef.current.forEach(obj => {
      obj.visible = showOuterSphere
    })
  }, [showOuterSphere, currentComplex])

  // ═══════════════════════════════════════════════════════════
  // YORLIQLAR TOGGLE
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    labelsRef.current.forEach(label => {
      // Faqat tashqi sfera bo'lmaganlar
      if (!outerSphereRef.current.includes(label)) {
        label.visible = showLabels
      }
    })
  }, [showLabels, currentComplex])

  // ═══════════════════════════════════════════════════════════
  // BOG' UZUNLIKLARI TOGGLE
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    bondLabelsRef.current.forEach(label => {
      label.visible = showBondLengths
    })
  }, [showBondLengths, currentComplex])

  // ═══════════════════════════════════════════════════════════
  // KO'RINISH REJIMI (Ball-stick / Space-filling / Wireframe)
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    atomsRef.current.forEach(atom => {
      if (!atom.material) return
      const el = atom.userData.element
      
      if (viewMode === "space-filling") {
        // Van der Waals radiuslar
        const vdwScales = { Co: 2.4, Fe: 2.4, N: 2.0, C: 2.1, H: 1.6, Cl: 2.3, K: 2.6 }
        atom.scale.setScalar(vdwScales[el] || 1.5)
        atom.material.opacity = 0.85
        atom.material.transparent = true
      } else if (viewMode === "wireframe") {
        atom.scale.setScalar(1)
        atom.material.wireframe = true
        atom.material.opacity = 1
      } else {
        // ball-stick
        atom.scale.setScalar(1)
        atom.material.wireframe = false
        atom.material.opacity = 1
        atom.material.transparent = false
      }
    })

    bondsRef.current.forEach(bond => {
      if (viewMode === "space-filling") {
        bond.visible = false
      } else {
        bond.visible = true
      }
    })
  }, [viewMode, currentComplex])

  // ═══════════════════════════════════════════════════════════
  // KESIM KO'RINISHI (Slice view)
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const renderer = rendererRef.current
    const clipPlane = clipPlaneRef.current
    if (!renderer || !clipPlane) return

    atomsRef.current.forEach(atom => {
      if (atom.material) {
        atom.material.clippingPlanes = sliceView ? [clipPlane] : []
        atom.material.needsUpdate = true
      }
    })
    bondsRef.current.forEach(bond => {
      if (bond.material) {
        bond.material.clippingPlanes = sliceView ? [clipPlane] : []
        bond.material.needsUpdate = true
      }
    })
  }, [sliceView, currentComplex])

  // ═══════════════════════════════════════════════════════════
  // AUTO ROTATE
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate
  }, [autoRotate])

  // ═══════════════════════════════════════════════════════════
  // TOOLTIP AUTO-HIDE
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [showTooltip])

  // ═══════════════════════════════════════════════════════════
  // BURCHAK O'LCHASH REJIMI — TANLANGAN LIGAND HIGHLIGHT
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    // Avval barcha donorlarni tiklash
    ligandAtomsRef.current.forEach(atom => {
      if (atom.material) {
        atom.material.emissiveIntensity = 0.05
      }
    })
    // Tanlanganlarni yorqin qilish
    selectedLigands.forEach(atom => {
      if (atom.material) {
        atom.material.emissiveIntensity = 0.6
      }
    })
  }, [selectedLigands])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white flex flex-col">
      
      {/* ═════ HEADER ═════ */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-purple-800/50 z-20 bg-purple-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link 
            href="/oquv/fazoviy/oktaedrik" 
            className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span className="hidden sm:inline">Orqaga</span>
          </Link>
          <div className="h-8 w-px bg-purple-800"></div>
          <div>
            <h1 className="text-base sm:text-xl font-bold text-purple-300 flex items-center gap-2">
              <span>💎</span>
              <span className="hidden sm:inline">Oktaedrik — 3D Laboratoriya</span>
              <span className="sm:hidden">3D Lab</span>
            </h1>
            <p className="text-purple-500 text-xs">
              {complex.formula} • {complex.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Kompleks tanlash */}
          <select
            value={currentComplex}
            onChange={(e) => setCurrentComplex(e.target.value)}
            className="bg-purple-900/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-purple-700/50 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="CoNH3">[Co(NH₃)₆]³⁺</option>
            <option value="FeCN">[Fe(CN)₆]⁴⁻</option>
          </select>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-all text-sm ${
              autoRotate ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'
            }`}
            title="Avtomatik aylantirish"
          >
            🔄
          </button>

          <button
            onClick={() => setShowInfoPanel(!showInfoPanel)}
            className={`p-2 rounded-lg transition-all text-sm ${
              showInfoPanel ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'
            }`}
            title="Ma'lumot paneli"
          >
            ℹ️
          </button>
        </div>
      </header>

      {/* ═════ ASOSIY SCENE ═════ */}
      <div className="flex-1 flex flex-row relative overflow-hidden">
        
        {/* CHAP — Boshqaruv paneli */}
        <div className="absolute top-3 left-3 z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 p-3 max-w-[200px] shadow-2xl">
          <h3 className="text-xs font-bold text-purple-300 mb-2 uppercase tracking-wide">🎛️ Boshqaruv</h3>
          
          <div className="space-y-2">
            {/* Ko'rinish rejimi */}
            <div>
              <label className="text-[10px] text-purple-400 uppercase block mb-1">Ko'rinish</label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: "ball-stick", label: "🔗", title: "Ball-stick" },
                  { id: "space-filling", label: "⚪", title: "To'la" },
                  { id: "wireframe", label: "🕸️", title: "Karkas" }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`p-1.5 rounded text-sm transition-all ${
                      viewMode === mode.id 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800'
                    }`}
                    title={mode.title}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle tugmalar */}
            <div className="border-t border-purple-800/50 pt-2 space-y-1">
              <ToggleRow label="🏷️ Atom yorliqlari" value={showLabels} onChange={setShowLabels} />
              <ToggleRow label="📏 Bog' uzunliklari" value={showBondLengths} onChange={setShowBondLengths} />
              <ToggleRow label="🌐 Tashqi sfera" value={showOuterSphere} onChange={setShowOuterSphere} />
              <ToggleRow label="✂️ Kesim ko'rinishi" value={sliceView} onChange={setSliceView} />
              <ToggleRow label="📐 Burchak o'lchash" value={angleMeasureMode} onChange={(v) => {
                setAngleMeasureMode(v)
                if (!v) { setSelectedLigands([]); setMeasuredAngle(null) }
              }} />
              <ToggleRow label="⚛️ d-orbital diagramma" value={showDOrbital} onChange={setShowDOrbital} />
            </div>
          </div>
        </div>

        {/* 3D CONTAINER */}
        <div ref={containerRef} className="flex-1 w-full relative min-h-[500px]">
          
          {/* Loading */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 backdrop-blur-sm z-30">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-purple-300 text-lg">⚛️ Model yuklanmoqda...</p>
              </div>
            </div>
          )}

          {/* Tooltip */}
          {showTooltip && !loading && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-purple-950/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs text-purple-200 z-20 border border-purple-700/50 animate-fade-in">
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <span>🖱️ aylantirish</span>
                <span className="text-purple-700">•</span>
                <span>🔍 zoom</span>
                <span className="text-purple-700">•</span>
                <span>👆 atom — ma'lumot</span>
              </div>
            </div>
          )}

          {/* Burchak o'lchash holati */}
          {angleMeasureMode && !loading && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-950/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm text-amber-100 z-20 border border-amber-600/50">
              {selectedLigands.length === 0 && "📐 1-ligandni tanlang (donor atomi)"}
              {selectedLigands.length === 1 && "📐 2-ligandni tanlang..."}
              {selectedLigands.length === 2 && measuredAngle && (
                <span>
                  📐 Burchak: <strong className="text-yellow-300 text-lg">{measuredAngle}°</strong>
                  {" "}
                  {parseFloat(measuredAngle) < 95 ? "(cis)" : "(trans)"}
                </span>
              )}
            </div>
          )}

          {/* Atom info panel */}
          {selectedAtom && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-20 border border-purple-700/50 max-w-xs shadow-2xl animate-slide-in">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full shadow-lg border-2 border-white/30" 
                    style={{ backgroundColor: selectedAtom.info.color }}
                  ></div>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedAtom.info.name}</h3>
                    <p className="text-xs text-purple-400">Z = {selectedAtom.info.atomic}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAtom(null)}
                  className="text-purple-400 hover:text-white text-xl leading-none"
                >×</button>
              </div>
              
              <div className="space-y-2 text-sm">
                <InfoRow label="Atom massasi" value={selectedAtom.info.mass} mono />
                <InfoRow label="Elektron konfiguratsiya" value={selectedAtom.info.config} mono small />
                {selectedAtom.info.oxidation && <InfoRow label="Oksidlanish darajasi" value={selectedAtom.info.oxidation} mono />}
                {selectedAtom.info.charge && <InfoRow label="Zaryad" value={selectedAtom.info.charge} mono />}
                {selectedAtom.info.hybridization && <InfoRow label="Gibridlanish" value={selectedAtom.info.hybridization} mono />}
                {selectedAtom.info.role && <InfoRow label="Vazifasi" value={selectedAtom.info.role} small />}
              </div>
            </div>
          )}

          {/* d-orbital diagrammasi */}
          {showDOrbital && !loading && (
            <div className="absolute bottom-4 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-20 border border-purple-700/50 shadow-2xl max-w-[260px] animate-slide-in">
              <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                <span>⚛️</span> d-orbital splitting
              </h3>
              
              <div className="relative h-32 flex flex-col justify-between text-xs">
                {/* eg level (yuqori) */}
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 w-8">e_g</span>
                  <div className="flex-1 flex gap-1">
                    {[0, 1].map(i => (
                      <div key={i} className="flex-1 h-1 bg-purple-400 rounded relative">
                        {complex.dOrbital.eg > i * 2 && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-yellow-300">↑</div>
                        )}
                        {complex.dOrbital.eg > i * 2 + 1 && (
                          <div className="absolute -top-2 left-1/2 translate-x-1 text-yellow-300">↓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Splitting label */}
                <div className="text-center text-[10px] text-purple-500">
                  ↕ Δₒ (yorug'lik maydoni bo'linish energiyasi)
                </div>

                {/* t2g level (past) */}
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 w-8">t₂g</span>
                  <div className="flex-1 flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="flex-1 h-1 bg-purple-400 rounded relative">
                        {complex.dOrbital.tg > i * 2 && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-yellow-300">↑</div>
                        )}
                        {complex.dOrbital.tg > i * 2 + 1 && (
                          <div className="absolute -top-2 left-1/2 translate-x-1 text-yellow-300">↓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-purple-800/50 text-[10px] text-purple-400 space-y-1">
                <div>Konfiguratsiya: <span className="text-white font-mono">t₂g{complex.dOrbital.tg} e_g{complex.dOrbital.eg}</span></div>
                <div>Spin holati: <span className="text-white font-mono">{complex.dOrbital.type === "LS" ? "Past spin (LS)" : "Yuqori spin (HS)"}</span></div>
                <div>Magnit: <span className="text-white">{complex.magnetism}</span></div>
              </div>
            </div>
          )}

          {/* Kompleks info panel (header tugmasidan) */}
          {showInfoPanel && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-20 border border-purple-700/50 max-w-sm shadow-2xl animate-slide-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-purple-300">📋 Kompleks ma'lumotlari</h3>
                <button onClick={() => setShowInfoPanel(false)} className="text-purple-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="space-y-2 text-xs">
                <InfoRow label="Formula (ion)" value={complex.formula} mono />
                <InfoRow label="To'liq tuz" value={complex.fullSalt} mono />
                <InfoRow label="Nomi" value={complex.name} small />
                <InfoRow label="Geometriya" value={complex.geometry} />
                <InfoRow label="Simmetriya" value={complex.symmetry} mono />
                <InfoRow label="Gibridlanish" value={complex.hybridization} mono />
                <InfoRow label="Bog' uzunligi" value={complex.bondLengthReal} mono />
                <InfoRow label="Magnit xossa" value={complex.magnetism} />
                <InfoRow label="Rangi" value={complex.color} small />
                <InfoRow label="Tashqi sfera" value={`${complex.outerIon.count} × ${complex.outerIon.element}${complex.outerIon.charge}`} mono />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═════ BOTTOM PANEL ═════ */}
      <div className="bg-purple-950/90 backdrop-blur-md border-t border-purple-800/50 z-10">
        
        {/* Asosiy parametrlar */}
        <div className="flex justify-center gap-3 sm:gap-6 py-3 px-3 sm:px-6 flex-wrap">
          <Stat label="Valent burchak" value="90°" />
          <Stat label="Koordinatsion son" value="6" />
          <Stat label="Gibridlanish" value={complex.hybridization} mono />
          <Stat label="Simmetriya" value={complex.symmetry} mono />
          <Stat label={`${complex.center.element}-${complex.ligand.donor} bog'`} value={complex.bondLengthReal} mono />
          <Stat label="Magnit" value={complex.magnetism} />
        </div>

        {/* CPK Legend (dinamik) */}
        <div className="flex justify-center gap-3 sm:gap-5 py-2 px-4 bg-purple-950/60 border-t border-purple-800/30 flex-wrap text-xs">
          <LegendItem color={`#${complex.center.color.toString(16).padStart(6, '0')}`} label={`${complex.center.element} — ${ATOM_INFO[complex.center.element].name.split(' ')[0]}`} />
          <LegendItem color={`#${complex.ligand.donorColor.toString(16).padStart(6, '0')}`} label={`${complex.ligand.donor} — donor`} />
          {complex.ligand.type === "NH3" && <LegendItem color="#ffffff" label="H — Vodorod" />}
          {complex.ligand.type === "CN" && <LegendItem color={`#${CPK.N.toString(16).padStart(6, '0')}`} label="N — Azot" />}
          {showOuterSphere && <LegendItem color={`#${complex.outerIon.color.toString(16).padStart(6, '0')}`} label={`${complex.outerIon.element}${complex.outerIon.charge} — tashqi sfera`} />}
        </div>

        {/* Formula */}
        <div className="text-center py-2 px-4 bg-purple-950/40 border-t border-purple-800/20">
          <p className="text-xs text-purple-500">
            <span className="font-mono text-purple-300">{complex.fullSalt}</span> • {complex.name} • {complex.geometry} • {complex.magnetism}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </main>
  )
}

// ═══════════════════════════════════════════════════════════
// YORDAMCHI KOMPONENTLAR
// ═══════════════════════════════════════════════════════════
function ToggleRow({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer hover:bg-purple-900/30 px-1 py-1 rounded">
      <span className="text-[11px] text-purple-200">{label}</span>
      <div
        onClick={() => onChange(!value)}
        className={`w-8 h-4 rounded-full transition-all relative ${
          value ? 'bg-purple-500' : 'bg-purple-900'
        }`}
      >
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
          value ? 'left-4' : 'left-0.5'
        }`}></div>
      </div>
    </label>
  )
}

function InfoRow({ label, value, mono, small }) {
  return (
    <div className="bg-purple-900/50 rounded-lg p-2">
      <p className="text-purple-400 text-[10px] mb-0.5 uppercase">{label}</p>
      <p className={`text-white ${mono ? 'font-mono' : ''} ${small ? 'text-xs' : 'text-sm'}`}>{value}</p>
    </div>
  )
}

function Stat({ label, value, mono }) {
  return (
    <div className="text-center">
      <div className="text-[10px] text-purple-400 mb-0.5 uppercase">{label}</div>
      <div className={`text-base sm:text-lg font-bold text-white ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full shadow-md border border-white/20" style={{ backgroundColor: color }}></div>
      <span className="text-purple-300">{label}</span>
    </div>
  )
}