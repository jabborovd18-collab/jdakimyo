"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ═══════════════════════════════════════════════════════════════════════════════
// SFERIK HARMONIKALAR Y₂ᵐ — d-orbital shakllari
// ═══════════════════════════════════════════════════════════════════════════════
// d-orbital angular functions (real spherical harmonics for l=2)
function Y20(theta, phi) {
  // dz²: (3cos²θ - 1)
  const c = Math.cos(theta)
  return 0.5 * (3 * c * c - 1)
}

function Y2c2(theta, phi) {
  // dx²-y²: sin²θ · cos2φ
  const s = Math.sin(theta)
  return (Math.sqrt(3) / 2) * s * s * Math.cos(2 * phi)
}

function Y2s2(theta, phi) {
  // dxy: sin²θ · sin2φ
  const s = Math.sin(theta)
  return (Math.sqrt(3) / 2) * s * s * Math.sin(2 * phi)
}

function Y2c1(theta, phi) {
  // dxz: sinθ·cosθ·cosφ
  const s = Math.sin(theta)
  const c = Math.cos(theta)
  return Math.sqrt(3) * s * c * Math.cos(phi)
}

function Y2s1(theta, phi) {
  // dyz: sinθ·cosθ·sinφ
  const s = Math.sin(theta)
  const c = Math.cos(theta)
  return Math.sqrt(3) * s * c * Math.sin(phi)
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORBITAL MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════════
const ORBITALS = {
  dz2: {
    name: "d_z²",
    m: 0,
    color: "#f97316",
    colorNeg: "#60a5fa",
    func: Y20,
    group: "e_g",
    energy: "+0.6Δ₀",
    energyVal: 0.6,
    ohSym: "a₁g",
    symmetry: "D_∞h → D4h a₁g",
    desc: "Ikki bo'lak z o'qi bo'ylab + ekvatorial halqa. Yagona halqali d-orbital.",
    formula: "Y₂⁰ = √(5/16π)·(3cos²θ−1)",
    nodes: "2 konus (θ = 54.7°, 125.3°)",
    axis: "z",
    rScale: 1.0
  },
  dx2y2: {
    name: "d_x²−y²",
    m: 2,
    color: "#ef4444",
    colorNeg: "#60a5fa",
    func: Y2c2,
    group: "e_g",
    energy: "+0.6Δ₀",
    energyVal: 0.6,
    ohSym: "b₁g",
    symmetry: "D4h b₁g",
    desc: "4 ta bo'lak to'g'ridan-to'g'ri x va y o'qlarida. Eng yuqori energiya.",
    formula: "Y₂² ∝ sin²θ·cos2φ",
    nodes: "2 ta tekislik (45°)",
    axis: "xy",
    rScale: 1.0
  },
  dxy: {
    name: "d_xy",
    m: 2,
    color: "#3b82f6",
    colorNeg: "#f87171",
    func: Y2s2,
    group: "t₂g",
    energy: "−0.4Δ₀",
    energyVal: -0.4,
    ohSym: "b₂g",
    symmetry: "D4h b₂g",
    desc: "4 ta bo'lak x va y o'qlari orasida (45°). Ligandlardan uzoqda.",
    formula: "Y₂² ∝ sin²θ·sin2φ",
    nodes: "2 ta tekislik (xz, yz)",
    axis: "xy",
    rScale: 0.9
  },
  dxz: {
    name: "d_xz",
    m: 1,
    color: "#22c55e",
    colorNeg: "#f87171",
    func: Y2c1,
    group: "t₂g",
    energy: "−0.4Δ₀",
    energyVal: -0.4,
    ohSym: "e_g",
    symmetry: "C₂v (xz)",
    desc: "4 ta bo'lak xz tekisligida. y o'qi bo'ylab tugun.",
    formula: "Y₂¹ ∝ sinθ·cosθ·cosφ",
    nodes: "2 ta tekislik (xy, yz)",
    axis: "x",
    rScale: 0.9
  },
  dyz: {
    name: "d_yz",
    m: 1,
    color: "#a855f7",
    colorNeg: "#fbbf24",
    func: Y2s1,
    group: "t₂g",
    energy: "−0.4Δ₀",
    energyVal: -0.4,
    ohSym: "e_g",
    symmetry: "C₂v (yz)",
    desc: "4 ta bo'lak yz tekisligida. x o'qi bo'ylab tugun.",
    formula: "Y₂¹ ∝ sinθ·cosθ·sinφ",
    nodes: "2 ta tekislik (xy, xz)",
    axis: "y",
    rScale: 0.9
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3D ORBITAL GENERATOR — isosurface + wireframe
// ═══════════════════════════════════════════════════════════════════════════════
function generateOrbitalMesh(orbitalKey, isovalue = 0.04) {
  const data = ORBITALS[orbitalKey]
  const func = data.func
  const thetaSteps = 60
  const phiSteps = 60

  const posVertices = []
  const negVertices = []
  const posNormals = []
  const negNormals = []
  const posIndices = []
  const negIndices = []

  // Generate parametric surface
  for (let i = 0; i < thetaSteps; i++) {
    const theta = (i / thetaSteps) * Math.PI
    for (let j = 0; j < phiSteps; j++) {
      const phi = (j / phiSteps) * 2 * Math.PI
      const val = func(theta, phi)
      const r = Math.abs(val) * data.rScale * 2.2

      const x = r * Math.sin(theta) * Math.cos(phi)
      const y = r * Math.sin(theta) * Math.sin(phi)
      const z = r * Math.cos(theta)

      if (val >= 0) {
        posVertices.push(x, y, z)
        // normal approximation
        const nr = 1.001
        const nx = nr * Math.sin(theta) * Math.cos(phi)
        const ny = nr * Math.sin(theta) * Math.sin(phi)
        const nz = nr * Math.cos(theta)
        posNormals.push(nx - x, ny - y, nz - z)
      } else {
        negVertices.push(x, y, z)
        const nr = 1.001
        const nx = nr * Math.sin(theta) * Math.cos(phi)
        const ny = nr * Math.sin(theta) * Math.sin(phi)
        const nz = nr * Math.cos(theta)
        negNormals.push(x - nx, y - ny, z - nz)
      }
    }
  }

  const buildMesh = (vertices, normals, color, wireColor, opacity = 0.7) => {
    if (vertices.length < 12) return null
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(vertices)
    const norms = new Float32Array(normals)
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    geo.setAttribute("normal", new THREE.BufferAttribute(norms, 3))

    // Generate indices for triangles
    const idx = []
    const vpp = phiSteps
    for (let i = 0; i < thetaSteps - 1; i++) {
      for (let j = 0; j < phiSteps - 1; j++) {
        const a = i * vpp + j
        const b = i * vpp + j + 1
        const c = (i + 1) * vpp + j
        const d = (i + 1) * vpp + j + 1
        // Check if all vertices exist
        const verts = new Set([a, b, c, d])
        let allExist = true
        verts.forEach(v => {
          const idx3 = v * 3
          if (idx3 >= vertices.length) allExist = false
        })
        if (allExist) {
          idx.push(a, b, c)
          idx.push(b, d, c)
        }
      }
    }
    geo.setIndex(idx)
    geo.computeVertexNormals()

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      depthWrite: true,
      clearcoat: 0.3,
      clearcoatRoughness: 0.4,
      envMapIntensity: 0.5
    })

    const mesh = new THREE.Mesh(geo, mat)
    mesh.castShadow = true

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(wireColor),
      wireframe: true,
      transparent: true,
      opacity: 0.08
    })
    const wire = new THREE.Mesh(geo.clone(), wireMat)

    const group = new THREE.Group()
    group.add(mesh)
    group.add(wire)
    return group
  }

  const posGroup = buildMesh(posVertices, posNormals, data.color, data.color, 0.75)
  const negGroup = buildMesh(negVertices, negNormals, data.colorNeg, data.colorNeg, 0.5)

  const finalGroup = new THREE.Group()
  if (posGroup) finalGroup.add(posGroup)
  if (negGroup) finalGroup.add(negGroup)

  return finalGroup
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3D ORBITAL — point cloud version for electron density
// ═══════════════════════════════════════════════════════════════════════════════
function generateElectronCloud(orbitalKey) {
  const data = ORBITALS[orbitalKey]
  const func = data.func
  const count = 12000
  const positions = []
  const colors = []
  const cPos = new THREE.Color(data.color)
  const cNeg = new THREE.Color(data.colorNeg)

  for (let i = 0; i < count; i++) {
    const theta = Math.acos(2 * Math.random() - 1)
    const phi = 2 * Math.PI * Math.random()
    const r = Math.cbrt(Math.random()) * 2.8 * data.rScale

    const val = func(theta, phi)
    const prob = Math.abs(val) * Math.exp(-r * 1.5) * r * r

    if (Math.random() < prob * 8) {
      const x = r * Math.sin(theta) * Math.cos(phi)
      const y = r * Math.sin(theta) * Math.sin(phi)
      const z = r * Math.cos(theta)
      positions.push(x, y, z)
      if (val >= 0) {
        colors.push(cPos.r, cPos.g, cPos.b)
      } else {
        colors.push(cNeg.r, cNeg.g, cNeg.b)
      }
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

  const mat = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  })

  return new THREE.Points(geo, mat)
}

// ═══════════════════════════════════════════════════════════════════════════════
// ATOM YADROSI
// ═══════════════════════════════════════════════════════════════════════════════
function createNucleus() {
  const group = new THREE.Group()

  // Core
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 24, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.5
    })
  )
  group.add(core)

  // Glow
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 16, 16),
    new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.2
    })
  )
  group.add(glow)

  return group
}

// ═══════════════════════════════════════════════════════════════════════════════
// KOORDINATA O'QLARI
// ═══════════════════════════════════════════════════════════════════════════════
function createAxes() {
  const group = new THREE.Group()
  const len = 3.5

  const makeAxis = (to, color, label) => {
    const from = new THREE.Vector3(0, 0, 0)
    const dir = to.clone().normalize()
    const length = to.length()

    // Line
    const points = [from, to]
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({ color, linewidth: 2, transparent: true, opacity: 0.7 })
    const line = new THREE.Line(geo, mat)
    group.add(line)

    // Arrow cone
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.25, 8),
      new THREE.MeshBasicMaterial({ color })
    )
    cone.position.copy(to)
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
    group.add(cone)
  }

  makeAxis(new THREE.Vector3(len, 0, 0), 0xef4444)
  makeAxis(new THREE.Vector3(-len, 0, 0), 0xef4444)
  makeAxis(new THREE.Vector3(0, len, 0), 0x22c55e)
  makeAxis(new THREE.Vector3(0, -len, 0), 0x22c55e)
  makeAxis(new THREE.Vector3(0, 0, len), 0x3b82f6)
  makeAxis(new THREE.Vector3(0, 0, -len), 0x3b82f6)

  // Axis labels as sprites
  const makeLabel = (text, pos, color) => {
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "rgba(0,0,0,0)"
    ctx.fillRect(0, 0, 64, 64)
    ctx.font = "bold 40px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = color
    ctx.fillText(text, 32, 32)

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false })
    const sprite = new THREE.Sprite(spriteMat)
    sprite.position.copy(pos)
    sprite.scale.set(0.4, 0.4, 1)
    group.add(sprite)
  }

  makeLabel("x", new THREE.Vector3(len + 0.4, 0, 0), "#ef4444")
  makeLabel("y", new THREE.Vector3(0, len + 0.4, 0), "#22c55e")
  makeLabel("z", new THREE.Vector3(0, 0, len + 0.4), "#3b82f6")

  return group
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZARRACHALAR TIZIMI
// ═══════════════════════════════════════════════════════════════════════════════
function createParticles() {
  const count = 300
  const positions = []
  const colors = []
  const sizes = []

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 3 + Math.random() * 8
    positions.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    )
    colors.push(0.6 + Math.random() * 0.3, 0.3 + Math.random() * 0.3, 0.8 + Math.random() * 0.2)
    sizes.push(0.02 + Math.random() * 0.04)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
  geo.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1))

  const mat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  })

  return new THREE.Points(geo, mat)
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function DOrbital3D() {
  const [selected, setSelected] = useState("dxy")
  const [viewMode, setViewMode] = useState("surface")
  const [autoRotate, setAutoRotate] = useState(true)
  const [showPhase, setShowPhase] = useState(true)
  const [showCloud, setShowCloud] = useState(true)
  const [showAxes, setShowAxes] = useState(true)
  const [showParticles, setShowParticles] = useState(true)
  const [showCut, setShowCut] = useState(false)
  const [loading, setLoading] = useState(true)
  const [opacity, setOpacity] = useState(0.75)
  const [infoTab, setInfoTab] = useState("info")

  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const orbitalGroupRef = useRef(new THREE.Group())
  const cloudRef = useRef(null)
  const axesRef = useRef(null)
  const particlesRef = useRef(null)
  const animRef = useRef(null)

  const current = ORBITALS[selected]

  // ─── Scene qurish ──────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x070012)
    scene.fog = new THREE.Fog(0x070012, 12, 25)
    sceneRef.current = scene

    const w = container.clientWidth
    const h = container.clientHeight
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50)
    camera.position.set(4.5, 3, 5.5)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 2
    controls.maxDistance = 15
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.2
    controlsRef.current = controls

    // Yorug'lik
    const ambient = new THREE.AmbientLight(0x444466, 0.6)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
    keyLight.position.set(8, 12, 6)
    keyLight.castShadow = true
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.5)
    fillLight.position.set(-4, -2, -6)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0x4488ff, 0.4)
    rimLight.position.set(-2, -6, -4)
    scene.add(rimLight)

    // Grid
    const grid = new THREE.GridHelper(10, 20, 0x333366, 0x222244)
    grid.position.y = -2.8
    grid.material.transparent = true
    grid.material.opacity = 0.2
    scene.add(grid)

    // Orbital group
    const orbGroup = new THREE.Group()
    scene.add(orbGroup)
    orbitalGroupRef.current = orbGroup

    // Axes
    const axes = createAxes()
    axes.visible = true
    scene.add(axes)
    axesRef.current = axes

    // Particles
    const parts = createParticles()
    parts.visible = true
    scene.add(parts)
    particlesRef.current = parts

    // Animatsiya
    const clock = new THREE.Clock()
    const animate = () => {
      animRef.current = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Orbital pulsatsiya
      if (orbitalGroupRef.current) {
        orbGroup.children.forEach(child => {
          child.traverse(node => {
            if (node.isMesh && node.material && !node.material.wireframe) {
              const pulse = 1 + Math.sin(t * 0.5) * 0.02
              node.scale.setScalar(pulse)
            }
          })
        })
      }

      // Particle rotation
      if (particlesRef.current && showParticles) {
        particlesRef.current.rotation.y += 0.0005
        particlesRef.current.rotation.x = Math.sin(t * 0.1) * 0.05
      }

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const cw = container.clientWidth
      const ch = container.clientHeight
      camera.aspect = cw / ch
      camera.updateProjectionMatrix()
      renderer.setSize(cw, ch)
    }
    window.addEventListener("resize", handleResize)

    setTimeout(() => setLoading(false), 300)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      controls.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Orbital o'zgarganda ──────────────────────────────────────
  useEffect(() => {
    const scene = sceneRef.current
    const orbGroup = orbitalGroupRef.current
    if (!scene || !orbGroup) return

    // Remove old
    while (orbGroup.children.length > 0) {
      const child = orbGroup.children[0]
      orbGroup.remove(child)
      child.traverse(node => {
        if (node.geometry) node.geometry.dispose()
        if (node.material) node.material.dispose()
      })
    }

    // Generate new
    if (viewMode === "surface" || viewMode === "both") {
      const mesh = generateOrbitalMesh(selected)
      if (mesh) {
        mesh.visible = showPhase
        orbGroup.add(mesh)
      }
    }

    if (viewMode === "cloud" || viewMode === "both") {
      if (showCloud) {
        const cloud = generateElectronCloud(selected)
        orbGroup.add(cloud)
        cloudRef.current = cloud
      }
    }

    // Center camera transition
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0)
    }
  }, [selected, viewMode, showPhase, showCloud, opacity])

  // ─── Autorotate ────────────────────────────────────────────────
  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate
  }, [autoRotate])

  // ─── Show/hide axes ────────────────────────────────────────────
  useEffect(() => {
    if (axesRef.current) axesRef.current.visible = showAxes
  }, [showAxes])

  // ─── Show/hide particles ──────────────────────────────────────
  useEffect(() => {
    if (particlesRef.current) particlesRef.current.visible = showParticles
  }, [showParticles])

  // ─── Reset camera ──────────────────────────────────────────────
  const resetCamera = useCallback(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(4.5, 3, 5.5)
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
  }, [])

  // ─── Energiya diagrammasi ──────────────────────────────────────
  const energyLevels = Object.entries(ORBITALS).map(([key, val]) => ({
    key,
    name: val.name,
    energy: val.energyVal,
    color: val.color,
    group: val.group
  }))
  energyLevels.sort((a, b) => a.energy - b.energy)

  const minE = -0.5
  const maxE = 0.7
  const range = maxE - minE

  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-indigo-950 text-white">

      <header className="sticky top-0 z-30 bg-black/60 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="hover:text-purple-300">Atom tuzilishi</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli" className="hover:text-purple-300">d-orbital</Link>
            <span className="text-purple-600">›</span>
            <span className="text-yellow-400">3D</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-2xl font-bold text-yellow-400 flex items-center gap-2">
              <span>🔄</span> d-orbitallar 3D
            </h1>
            <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={() => setAutoRotate(!autoRotate)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${autoRotate ? "bg-yellow-600/70 text-white" : "bg-purple-800/50 text-purple-300"}`}>
                {autoRotate ? "⏸" : "▶"} Avto
              </button>
              <button onClick={resetCamera}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs bg-purple-800/50 text-purple-300 hover:bg-purple-700/60">
                🎯 Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">

          {/* CHAP PANEL — BOSHQARUV */}
          <div className="xl:col-span-1 space-y-3 sm:space-y-4 order-2 xl:order-1">

            {/* Orbital tanlash */}
            <div className="bg-black/40 border border-purple-700/40 rounded-xl p-3 sm:p-4">
              <h3 className="text-[10px] sm:text-xs font-bold text-purple-400 uppercase mb-2">🧪 Orbital</h3>
              <div className="grid grid-cols-5 xl:grid-cols-1 gap-1.5">
                {Object.entries(ORBITALS).map(([key, val]) => (
                  <button key={key} onClick={() => setSelected(key)}
                    className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-lg text-xs font-bold font-mono transition-all ${
                      selected === key
                        ? "bg-purple-700/70 text-white ring-1 ring-purple-400"
                        : "bg-purple-900/40 text-purple-300 hover:bg-purple-800/60"
                    }`}>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{ background: val.color }} />
                    <span className="hidden xl:inline">{val.name}</span>
                    <span className="xl:hidden text-[9px]">{val.name.replace("d_", "").replace("²", "2")}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ko'rinish */}
            <div className="bg-black/40 border border-purple-700/40 rounded-xl p-3 sm:p-4">
              <h3 className="text-[10px] sm:text-xs font-bold text-purple-400 uppercase mb-2">🎨 Ko'rinish</h3>
              <div className="space-y-1.5">
                {[
                  { id: "surface", label: "Sirt" },
                  { id: "cloud", label: "Elektron bulut" },
                  { id: "both", label: "Sirt + bulut" }
                ].map(m => (
                  <button key={m.id} onClick={() => setViewMode(m.id)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                      viewMode === m.id ? "bg-purple-600/60 text-white" : "bg-purple-900/40 text-purple-300 hover:bg-purple-800/60"
                    }`}>
                    {m.id === "surface" ? "🔮 " : m.id === "cloud" ? "☁️ " : "🔁 "} {m.label}
                  </button>
                ))}
              </div>

              <div className="mt-2 space-y-1.5">
                <ToggleBtn label="Fazalarni ko'rsatish" val={showPhase} set={setShowPhase} />
                <ToggleBtn label="Elektron bulut" val={showCloud} set={setShowCloud} />
                <ToggleBtn label="Koordinata o'qlari" val={showAxes} set={setShowAxes} />
                <ToggleBtn label="Zarrachalar" val={showParticles} set={setShowParticles} />
              </div>

              <div className="mt-3">
                <p className="text-[9px] text-purple-400 mb-1">Shaffoflik: {Math.round(opacity * 100)}%</p>
                <input type="range" min={0.1} max={1} step={0.05} value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-purple-800 cursor-pointer"
                  style={{ accentColor: "#a855f7" }} />
              </div>
            </div>

            {/* Energiya diagrammasi */}
            <div className="bg-black/40 border border-purple-700/40 rounded-xl p-3 sm:p-4">
              <h3 className="text-[10px] sm:text-xs font-bold text-purple-400 uppercase mb-2">⚡ Energiya</h3>
              <div className="h-36 sm:h-44 relative">
                {/* Baritsentr */}
                <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-purple-700/40" />
                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] text-purple-600">E=0</span>

                {energyLevels.map((lvl, i) => {
                  const pct = ((lvl.energy - minE) / range) * 100
                  const isSelected = lvl.key === selected
                  return (
                    <button key={lvl.key} onClick={() => setSelected(lvl.key)}
                      className={`absolute left-1 right-8 flex items-center gap-1.5 transition-all ${
                        isSelected ? "opacity-100 scale-105" : "opacity-50 hover:opacity-80"
                      }`}
                      style={{ top: `${100 - pct}%`, transform: `translateY(-50%)` }}>
                      <div className={`h-2 sm:h-2.5 flex-1 rounded-sm ${isSelected ? "ring-1 ring-white" : ""}`}
                        style={{ background: lvl.color, height: isSelected ? "10px" : "6px" }} />
                      <span className={`text-[9px] sm:text-[10px] font-mono whitespace-nowrap ${
                        isSelected ? "text-white font-bold" : "text-purple-400"
                      }`}>{lvl.name}</span>
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-between text-[8px] text-purple-500 mt-1">
                <span>t₂g (stabillashgan)</span>
                <span>e_g (destabillashgan)</span>
              </div>
            </div>
          </div>

          {/* 3D CANVAS */}
          <div className="xl:col-span-2 order-1 xl:order-2">
            <div className="relative bg-black/60 border border-purple-700/50 rounded-2xl overflow-hidden"
              style={{ height: "min(65vh, 600px)" }}>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/80">
                  <div className="text-center">
                    <div className="inline-block w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-purple-300 text-sm">🔮 3D model yuklanmoqda...</p>
                  </div>
                </div>
              )}
              <div ref={mountRef} className="w-full h-full" />

              {/* HUD */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ background: current.color }} />
                <span className="text-xs sm:text-sm font-bold font-mono" style={{ color: current.color }}>
                  {current.name}
                </span>
                <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full border ${
                  current.group === "t₂g" ? "bg-green-600/20 text-green-400 border-green-600/30" : "bg-red-600/20 text-red-400 border-red-600/30"
                }`}>{current.group}</span>
              </div>
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[9px] sm:text-[10px] text-purple-500 text-right leading-tight">
                <div>🖱️ torting</div>
                <div>🔍 g'ildirak</div>
              </div>
            </div>
          </div>

          {/* O'NG PANEL — MA'LUMOT */}
          <div className="xl:col-span-1 order-3 space-y-3 sm:space-y-4">

            {/* Tabs */}
            <div className="bg-black/40 border border-purple-700/40 rounded-xl overflow-hidden">
              <div className="flex border-b border-purple-800/40">
                {[
                  { id: "info", label: "📋 Info" },
                  { id: "math", label: "📐 Matematika" },
                  { id: "compare", label: "🔁 Taqqoslash" }
                ].map(tab => (
                  <button key={tab.id} onClick={() => setInfoTab(tab.id)}
                    className={`flex-1 py-1.5 sm:py-2 text-[9px] sm:text-xs font-semibold transition-all ${
                      infoTab === tab.id ? "bg-purple-700/60 text-white" : "text-purple-400 hover:bg-purple-800/40"
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-3 sm:p-4">

                {infoTab === "info" && (
                  <div className="space-y-2 text-[10px] sm:text-xs">
                    <h4 className="font-bold text-sm" style={{ color: current.color }}>{current.name} orbital</h4>
                    <p className="text-purple-200 leading-relaxed">{current.desc}</p>
                    <div className="bg-purple-950/70 rounded-lg p-2 space-y-1">
                      {[
                        ["Simmetriya", current.symmetry],
                        ["O_h dagi guruh", `${current.group} (${current.ohSym})`],
                        ["Energiya siljishi", current.energy],
                        ["Magnit kvant soni", `mₗ = ${current.m}`],
                        ["Tugunlar", current.nodes],
                        ["Asosiy o'q", current.axis],
                      ].map(([l, v], i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-purple-400">{l}:</span>
                          <span className="text-purple-200 font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {infoTab === "math" && (
                  <div className="space-y-2 text-[10px] sm:text-xs">
                    <h4 className="font-bold text-purple-300">Matematik ifoda</h4>
                    <div className="bg-purple-950/80 rounded-lg p-2 sm:p-3 mb-2">
                      <p className="text-center text-yellow-300 font-mono text-xs sm:text-sm">{current.formula}</p>
                    </div>
                    <p className="text-purple-300">Sferik harmonika Y₂ᵐ(θ,φ) — Shredinger tenglamasining burchak qismi.</p>
                    <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 mt-2">
                      <p className="text-yellow-400 font-bold text-[9px]">💡 Fizik ma'nosi:</p>
                      <p className="text-purple-200 text-[9px]">
                        |Y₂ᵐ|² — elektronni ma'lum burchakda topish ehtimollik zichligi.
                        Rangli qismlar ψ {'>'} 0 (musbat faza), och ranglilar ψ {'<'} 0 (manfiy faza).
                      </p>
                    </div>
                    <div className="bg-purple-950/70 rounded-lg p-2 mt-2">
                      <p className="text-purple-400 text-[9px]">Ortonormallik: ∫Yₗᵐ*·Yₗ'ᵐ' dΩ = δₗₗ'·δₘₘ'</p>
                    </div>
                  </div>
                )}

                {infoTab === "compare" && (
                  <div className="space-y-1.5 text-[10px] sm:text-xs">
                    <h4 className="font-bold text-purple-300 mb-1">5 ta d-orbital taqqoslash</h4>
                    {Object.entries(ORBITALS).map(([key, val]) => (
                      <button key={key} onClick={() => setSelected(key)}
                        className={`w-full flex items-center justify-between p-1.5 rounded-lg transition-all ${
                          selected === key ? "bg-purple-700/50" : "bg-purple-900/30 hover:bg-purple-800/40"
                        }`}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: val.color }} />
                          <span className="font-mono font-bold" style={{ color: val.color }}>{val.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] ${
                            val.group === "t₂g" ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
                          }`}>{val.group}</span>
                          <span className="text-purple-400 font-mono text-[9px]">{val.energy}</span>
                        </div>
                      </button>
                    ))}
                    <div className="bg-purple-950/60 rounded-lg p-2 mt-2 text-[9px]">
                      <p className="text-purple-400">Baritsentr qoidasi:</p>
                      <p className="text-yellow-300 font-mono">3·(−0.4Δ₀) + 2·(+0.6Δ₀) = 0</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 sm:mt-8 flex justify-between">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> Nazariy qism
          </Link>
          <div className="text-[9px] sm:text-xs text-purple-500 text-right">
            <p>JDA-Kimyo 3D Lab PRO</p>
            <p className="text-purple-600">d-orbitallar • Three.js</p>
          </div>
        </div>
      </section>
    </main>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOGGLE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function ToggleBtn({ label, val, set }) {
  return (
    <label className="flex items-center justify-between cursor-pointer px-1 py-0.5 rounded hover:bg-purple-900/30">
      <span className="text-[10px] sm:text-xs text-purple-300">{label}</span>
      <div onClick={() => set(!val)}
        className={`w-7 sm:w-8 h-3.5 sm:h-4 rounded-full transition-all relative cursor-pointer ${
          val ? "bg-purple-500" : "bg-purple-900"
        }`}>
        <div className={`absolute top-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white transition-all ${
          val ? "left-3.5 sm:left-4" : "left-0.5"
        }`} />
      </div>
    </label>
  )
}
