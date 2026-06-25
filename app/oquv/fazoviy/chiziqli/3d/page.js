"use client"

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

// ═══════════════════════════════════════════════════════════
// CPK RANGLARI (IUPAC standartlari)
// ═══════════════════════════════════════════════════════════
const CPK = {
  Ag: 0xC0C0C0,  // Kumush — kulrang-oq
  N:  0x3050F8,  // Azot — ko'k
  H:  0xFFFFFF,  // Vodorod — oq
  bond: 0x8B9DC3 // Bog' — ko'k-kulrang
}

// ═══════════════════════════════════════════════════════════
// KIMYOVIY PARAMETRLAR (haqiqiy o'lchamlar, scaled)
// ═══════════════════════════════════════════════════════════
const CHEM = {
  agN_length: 2.2,    // Haqiqiy: 2.13 Å
  nH_length: 0.6,     // Haqiqiy: 1.01 Å (scaled)
  hnh_angle: 107 * Math.PI / 180,
  ag_radius: 0.5,
  n_radius: 0.35,
  h_radius: 0.18
}

// ═══════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════
const ATOM_INFO = {
  Ag: {
    name: "Kumush (Ag)",
    atomic: 47,
    mass: "107.87 u",
    config: "[Kr] 4d¹⁰ 5s¹",
    oxidation: "+1",
    electronConfig: "4d¹⁰",
    color: "#C0C0C0"
  },
  N: {
    name: "Azot (N)",
    atomic: 7,
    mass: "14.01 u",
    config: "[He] 2s² 2p³",
    role: "Ligand donor atomi",
    hybridization: "sp³",
    color: "#3050F8"
  },
  H: {
    name: "Vodorod (H)",
    atomic: 1,
    mass: "1.008 u",
    config: "1s¹",
    role: "Ligand tarkibi",
    color: "#FFFFFF"
  }
}

export default function Chiziqli3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const atomsRef = useRef([])
  
  const [loading, setLoading] = useState(true)
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showTooltip, setShowTooltip] = useState(true)

  // ═══════════════════════════════════════════════════════════
  // BOND YARATISH
  // ═══════════════════════════════════════════════════════════
  const createBond = useCallback((scene, start, end, color = CPK.bond, radius = 0.08) => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)

    const geometry = new THREE.CylinderGeometry(radius, radius, length, 16)
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.4,
      metalness: 0.2,
      transparent: true,
      opacity: 0.7
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
  // NH₃ GURUHI YARATISH (trigonal piramidal)
  // ═══════════════════════════════════════════════════════════
  const createNH3Group = useCallback((scene, nPos, agPos, bondsArray) => {
    // N atomi
    const nGeo = new THREE.SphereGeometry(CHEM.n_radius, 48, 48)
    const nMat = new THREE.MeshStandardMaterial({
      color: CPK.N,
      roughness: 0.35,
      metalness: 0.15,
      emissive: CPK.N,
      emissiveIntensity: 0.05
    })
    const nMesh = new THREE.Mesh(nGeo, nMat)
    nMesh.position.copy(nPos)
    nMesh.userData = { type: 'atom', element: 'N', info: ATOM_INFO.N }
    scene.add(nMesh)
    atomsRef.current.push(nMesh)

    // N glow
    const nGlow = new THREE.Mesh(
      new THREE.SphereGeometry(CHEM.n_radius * 1.15, 24, 24),
      new THREE.MeshBasicMaterial({ color: CPK.N, transparent: true, opacity: 0.08 })
    )
    nGlow.position.copy(nPos)
    scene.add(nGlow)

    // Koordinata sistemasi
    const nToAg = new THREE.Vector3().subVectors(agPos, nPos).normalize()
    const outDir = nToAg.clone().negate()

    let perp1 = new THREE.Vector3()
    if (Math.abs(nToAg.y) < 0.9) {
      perp1.crossVectors(nToAg, new THREE.Vector3(0, 1, 0)).normalize()
    } else {
      perp1.crossVectors(nToAg, new THREE.Vector3(1, 0, 0)).normalize()
    }
    const perp2 = new THREE.Vector3().crossVectors(nToAg, perp1).normalize()

    // 3 ta H atomi (tetraedral geometriya)
    const alpha = Math.PI - Math.acos(Math.sqrt((Math.cos(CHEM.hnh_angle) + 0.5) / 1.5))

    for (let i = 0; i < 3; i++) {
      const phi = (i * 2 * Math.PI / 3) + Math.PI / 6

      const hDir = new THREE.Vector3()
        .addScaledVector(outDir, Math.cos(alpha))
        .addScaledVector(perp1, Math.sin(alpha) * Math.cos(phi))
        .addScaledVector(perp2, Math.sin(alpha) * Math.sin(phi))
        .normalize()

      const hPos = new THREE.Vector3()
        .copy(nPos)
        .addScaledVector(hDir, CHEM.nH_length)

      // H mesh
      const hGeo = new THREE.SphereGeometry(CHEM.h_radius, 24, 24)
      const hMat = new THREE.MeshStandardMaterial({
        color: CPK.H,
        roughness: 0.6,
        metalness: 0.05,
        emissive: 0xFFFFFF,
        emissiveIntensity: 0.02
      })
      const hMesh = new THREE.Mesh(hGeo, hMat)
      hMesh.position.copy(hPos)
      hMesh.userData = { type: 'atom', element: 'H', info: ATOM_INFO.H }
      scene.add(hMesh)
      atomsRef.current.push(hMesh)

      // N-H bond
      const bond = createBond(scene, nPos, hPos, 0xcccccc, 0.05)
      bond.userData = { type: 'bond', bondType: 'N-H', length: '1.01 Å' }
      bondsArray.push(bond)
    }
  }, [createBond])

  // ═══════════════════════════════════════════════════════════
  // SCENE SETUP
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = null
    scene.fog = new THREE.Fog(0x0a0a1a, 15, 30)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(4, 2, 5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 3
    controls.maxDistance = 15
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controlsRef.current = controls

    // Yorug'lik
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

    // MARKAZIY ATOM — Ag
    const agGeo = new THREE.SphereGeometry(CHEM.ag_radius, 64, 64)
    const agMat = new THREE.MeshStandardMaterial({
      color: CPK.Ag,
      roughness: 0.15,
      metalness: 0.85,
      emissive: CPK.Ag,
      emissiveIntensity: 0.15
    })
    const agAtom = new THREE.Mesh(agGeo, agMat)
    agAtom.castShadow = true
    agAtom.userData = { type: 'atom', element: 'Ag', info: ATOM_INFO.Ag }
    scene.add(agAtom)
    atomsRef.current.push(agAtom)

    const agGlow = new THREE.Mesh(
      new THREE.SphereGeometry(CHEM.ag_radius * 1.2, 32, 32),
      new THREE.MeshBasicMaterial({ color: CPK.Ag, transparent: true, opacity: 0.12 })
    )
    scene.add(agGlow)

    // 2 TA LIGAND (chiziqli)
    const d = CHEM.agN_length
    const ligandPositions = [
      new THREE.Vector3(d, 0, 0),
      new THREE.Vector3(-d, 0, 0)
    ]

    const bondsArray = []
    const agPos = new THREE.Vector3(0, 0, 0)

    ligandPositions.forEach(nPos => {
      // Ag-N bond
      const bond = createBond(scene, agPos, nPos, CPK.bond, 0.08)
      bond.userData = { type: 'bond', bondType: 'Ag-N', length: '2.13 Å' }
      bondsArray.push(bond)

      // NH₃ guruhi
      createNH3Group(scene, nPos, agPos, bondsArray)
    })

    // O'q chizig'i (dashed)
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3.5, 0, 0),
      new THREE.Vector3(3.5, 0, 0)
    ])
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x445566,
      dashSize: 0.3,
      gapSize: 0.15,
      transparent: true,
      opacity: 0.5
    })
    const line = new THREE.Line(lineGeo, lineMat)
    line.computeLineDistances()
    scene.add(line)

    // Grid
    const grid = new THREE.GridHelper(8, 16, 0x333355, 0x1a1a33)
    grid.position.y = -3
    grid.material.transparent = true
    grid.material.opacity = 0.3
    scene.add(grid)

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
          setSelectedAtom(atom.userData)
        }
      } else {
        setSelectedAtom(null)
      }
    }

    renderer.domElement.addEventListener('click', onMouseClick)

    // Animation
    let frameId
    const clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      agGlow.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.05)
      agAtom.rotation.y += 0.002

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    setTimeout(() => setLoading(false), 500)

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('click', onMouseClick)

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose())
          } else {
            obj.material.dispose()
          }
        }
      })

      renderer.dispose()
      controls.dispose()

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      
      atomsRef.current = []
    }
  }, [createBond, createNH3Group])

  // Controls sync
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate
    }
  }, [autoRotate])

  // Tooltip auto-hide
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showTooltip])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white flex flex-col">
      
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-purple-800/50 z-20 bg-purple-950/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link 
            href="/oquv/fazoviy/chiziqli" 
            className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span className="hidden sm:inline">Orqaga</span>
          </Link>
          <div className="h-8 w-px bg-purple-800"></div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-blue-400 flex items-center gap-2">
              <span>📏</span>
              <span>Chiziqli — 3D model</span>
            </h1>
            <p className="text-purple-500 text-xs sm:text-sm">
              [Ag(NH₃)₂]⁺ • CPK ranglarda • Interaktiv
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-all ${
              autoRotate 
                ? 'bg-purple-600/50 text-white' 
                : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'
            }`}
            title="Avtomatik aylantirish"
          >
            🔄
          </button>
        </div>
      </header>

      {/* 3D CONTAINER */}
      <div ref={containerRef} className="flex-1 w-full relative min-h-[500px]">
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-950/80 backdrop-blur-sm z-30">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
              <p className="text-purple-300 text-lg">⚛️ Model yuklanmoqda...</p>
            </div>
          </div>
        )}

        {/* Controls tooltip */}
        {showTooltip && !loading && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-purple-950/90 backdrop-blur-md px-6 py-3 rounded-xl text-sm text-purple-200 z-20 border border-purple-700/50 animate-fade-in">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span>🖱️ <strong>Sichqoncha</strong> — aylantirish</span>
              <span className="text-purple-700">•</span>
              <span>🔍 <strong>Scroll</strong> — zoom</span>
              <span className="text-purple-700">•</span>
              <span>👆 <strong>Atomni bosing</strong> — ma'lumot</span>
            </div>
          </div>
        )}

        {/* Atom info panel */}
        {selectedAtom && (
          <div className="absolute top-4 right-4 bg-purple-950/95 backdrop-blur-md rounded-xl p-5 z-20 border border-purple-700/50 max-w-xs shadow-2xl animate-slide-in">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full shadow-lg" 
                  style={{ backgroundColor: selectedAtom.info.color }}
                ></div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedAtom.info.name}</h3>
                  <p className="text-xs text-purple-400">Z = {selectedAtom.info.atomic}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAtom(null)}
                className="text-purple-400 hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="bg-purple-900/50 rounded-lg p-2">
                <p className="text-purple-400 text-xs mb-1">Atom massasi</p>
                <p className="text-white font-mono">{selectedAtom.info.mass}</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-2">
                <p className="text-purple-400 text-xs mb-1">Elektron konfiguratsiya</p>
                <p className="text-white font-mono text-xs">{selectedAtom.info.config}</p>
              </div>
              {selectedAtom.info.oxidation && (
                <div className="bg-purple-900/50 rounded-lg p-2">
                  <p className="text-purple-400 text-xs mb-1">Oksidlanish darajasi</p>
                  <p className="text-white font-mono">{selectedAtom.info.oxidation}</p>
                </div>
              )}
              {selectedAtom.info.role && (
                <div className="bg-purple-900/50 rounded-lg p-2">
                  <p className="text-purple-400 text-xs mb-1">Vazifasi</p>
                  <p className="text-white text-xs">{selectedAtom.info.role}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM PANEL */}
      <div className="bg-purple-950/90 backdrop-blur-md border-t border-purple-800/50 z-10">
        
        {/* Asosiy parametrlar */}
        <div className="flex justify-center gap-4 sm:gap-8 py-4 px-4 sm:px-6 flex-wrap">
          <div className="text-center">
            <div className="text-xs text-purple-400 mb-1">Valent burchak</div>
            <div className="text-lg sm:text-xl font-bold text-white">180°</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-purple-400 mb-1">Koordinatsion son</div>
            <div className="text-lg sm:text-xl font-bold text-white">2</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-purple-400 mb-1">Gibridlanish</div>
            <div className="text-lg sm:text-xl font-bold text-white font-mono">sp</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-purple-400 mb-1">Simmetriya</div>
            <div className="text-lg sm:text-xl font-bold text-white font-mono">D<sub>∞h</sub></div>
          </div>
          <div className="text-center">
            <div className="text-xs text-purple-400 mb-1">Ag-N bog'</div>
            <div className="text-lg sm:text-xl font-bold text-white font-mono">2.13 Å</div>
          </div>
        </div>

        {/* CPK Legend */}
        <div className="flex justify-center gap-4 sm:gap-6 py-3 px-4 sm:px-6 bg-purple-950/60 border-t border-purple-800/30 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: '#C0C0C0' }}></div>
            <span className="text-xs sm:text-sm text-purple-300">Ag — Kumush</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full shadow-md" style={{ backgroundColor: '#3050F8' }}></div>
            <span className="text-xs sm:text-sm text-purple-300">N — Azot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full shadow-md bg-white"></div>
            <span className="text-xs sm:text-sm text-purple-300">H — Vodorod</span>
          </div>
        </div>

        {/* Kimyoviy formula */}
        <div className="text-center py-2 px-4 bg-purple-950/40 border-t border-purple-800/20">
          <p className="text-xs text-purple-500">
            <span className="font-mono">[Ag(NH₃)₂]⁺</span> • Diamminkumush(I) ioni • Chiziqli geometriya • Diamagnit
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