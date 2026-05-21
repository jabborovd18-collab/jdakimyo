"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Kinetika3D() {
  const containerRef = useRef(null)
  const [selectedMech, setSelectedMech] = useState("Id")
  const [animStep, setAnimStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(5, 4, 6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controls.minDistance = 3
    controls.maxDistance = 12

    scene.add(new THREE.AmbientLight(0x404060, 1.5))
    const light1 = new THREE.DirectionalLight(0xffffff, 2)
    light1.position.set(8, 8, 8)
    scene.add(light1)
    const light2 = new THREE.DirectionalLight(0xcc88ff, 0.8)
    light2.position.set(-4, -2, -3)
    scene.add(light2)

    const grid = new THREE.GridHelper(8, 16, 0x222244, 0x111122)
    grid.position.y = -2.5
    scene.add(grid)

    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(150 * 3)
    for (let i = 0; i < 150 * 3; i += 3) {
      sp[i] = (Math.random() - 0.5) * 14
      sp[i + 1] = (Math.random() - 0.5) * 10
      sp[i + 2] = (Math.random() - 0.5) * 14
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.015, transparent: true, opacity: 0.4 })))

    let meshes = []

    function createMetal(color = 0x4488CC, pos = [0, 0, 0], size = 0.45) {
      const geo = new THREE.SphereGeometry(size, 64, 64)
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.9 })
      const metal = new THREE.Mesh(geo, mat)
      metal.position.set(...pos)
      scene.add(metal)
      meshes.push(metal)
      return metal
    }

    function createLigand(color = 0x44AAFF, pos = [2, 0, 0], size = 0.28) {
      const geo = new THREE.SphereGeometry(size, 32, 32)
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1 })
      const ligand = new THREE.Mesh(geo, mat)
      ligand.position.set(...pos)
      scene.add(ligand)
      meshes.push(ligand)
      return ligand
    }

    function createBond(start, end, color = 0x888888, opacity = 0.5) {
      const dir = end.clone().sub(start)
      const len = dir.length()
      const mid = dir.clone().multiplyScalar(0.5).add(start)
      const geo = new THREE.CylinderGeometry(0.06, 0.06, len, 16)
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.2, transparent: true, opacity })
      const bond = new THREE.Mesh(geo, mat)
      bond.position.copy(mid)
      bond.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()))
      scene.add(bond)
      meshes.push(bond)
      return bond
    }

    function createArrow(start, end, color = 0xffff00) {
      const dir = end.clone().sub(start)
      const len = dir.length()
      const norm = dir.normalize()
      const arrowGeo = new THREE.ConeGeometry(0.12, 0.3, 8, 8)
      const arrowMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, emissive: color, emissiveIntensity: 0.6 })
      const arrow = new THREE.Mesh(arrowGeo, arrowMat)
      arrow.position.copy(end.clone().sub(norm.clone().multiplyScalar(0.4)))
      arrow.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), norm))
      scene.add(arrow)
      meshes.push(arrow)

      const lineGeo = new THREE.CylinderGeometry(0.03, 0.03, len - 0.4, 8)
      const lineMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, emissive: color, emissiveIntensity: 0.4 })
      const line = new THREE.Mesh(lineGeo, lineMat)
      const midPoint = start.clone().add(end).multiplyScalar(0.5).sub(norm.clone().multiplyScalar(0.2))
      line.position.copy(midPoint)
      line.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), norm))
      scene.add(line)
      meshes.push(line)
      return { arrow, line }
    }

    function clearScene() {
      meshes.forEach(m => scene.remove(m))
      meshes = []
    }

    function createIdModel(step) {
      clearScene()
      const metal = createMetal(0x44AA88)
      const pos = [[2,0,0],[-2,0,0],[0,2,0],[0,-2,0],[0,0,2]]
      const ligands = pos.map(p => createLigand(0x44AAFF, p))
      
      if (step < 2) {
        createLigand(0xFF6644, [0,0,-2])
        pos.forEach(p => createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(...p)))
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,-2), 0xFF6644, 0.6)
      }
      
      if (step === 2) {
        pos.forEach(p => createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(...p)))
        createArrow(new THREE.Vector3(0,0,-2.5), new THREE.Vector3(0,0,-4.5), 0xFF6644)
      }
      
      if (step === 3) {
        createLigand(0xFFAA44, [0,0,-2])
        pos.forEach(p => createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(...p)))
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,-2), 0xFFAA44, 0.6)
        createArrow(new THREE.Vector3(0,0,3.5), new THREE.Vector3(0,0,1.5), 0xFFAA44)
      }
    }

    function createIaModel(step) {
      clearScene()
      const metal = createMetal(0x4488CC)
      const pos = [[2,0,0],[-2,0,0],[0,2,0],[0,-2,0],[0,0,2],[0,0,-2]]
      const ligands = pos.map(p => createLigand(0x44AAFF, p))
      pos.forEach(p => createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(...p)))
      
      if (step === 1) {
        createLigand(0xFFAA44, [0, 2.8, 0.8])
        createArrow(new THREE.Vector3(0, 3.5, 0), new THREE.Vector3(0, 2.2, 0.5), 0xFFAA44)
      }
      
      if (step === 2) {
        createLigand(0xFFAA44, [0, 1.8, 1.2])
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1.8,1.2), 0xFFAA44, 0.4)
        createArrow(new THREE.Vector3(0, 2.8, 0), new THREE.Vector3(0, 3.8, 0), 0xFF6644)
      }
      
      if (step === 3) {
        const pos2 = [[2,0,0],[-2,0,0],[0,2,0],[0,-2,0],[0,0,2],[0,0,-2]]
        const ligands2 = pos2.map(p => createLigand(p[2] === 2 ? 0xFFAA44 : 0x44AAFF, p))
        pos2.forEach(p => createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(...p), p[2] === 2 ? 0xFFAA44 : 0x888888, 0.6))
      }
    }

    function createAModel(step) {
      clearScene()
      const metal = createMetal(0xCC8844, [0, 0, 0])
      const pos = [[2.2,0,0],[-2.2,0,0],[0,2.2,0],[0,-2.2,0]]
      const ligands = pos.map(p => createLigand(0xFF6644, p))
      pos.forEach(p => createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(...p)))
      
      if (step === 1) {
        createLigand(0x44FF44, [0, 0.6, 2.6])
        createArrow(new THREE.Vector3(0, 0, 3.5), new THREE.Vector3(0, 0.5, 2.4), 0x44FF44)
      }
      
      if (step === 2) {
        createLigand(0x44FF44, [0, 0.3, 2.3])
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0.3,2.3), 0x44FF44, 0.4)
        createArrow(new THREE.Vector3(2.5, 0, 0), new THREE.Vector3(3.5, 0, 0), 0xFF6644)
      }
      
      if (step === 3) {
        createLigand(0x44FF44, [0, 0, 2.2])
        createLigand(0xFF6644, [2.2, 0, 0])
        createLigand(0xFF6644, [-2.2, 0, 0])
        createLigand(0xFF6644, [0, -2.2, 0])
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(2.2,0,0), 0xFF6644, 0.6)
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(-2.2,0,0), 0xFF6644, 0.6)
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(0,-2.2,0), 0xFF6644, 0.6)
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,2.2), 0x44FF44, 0.6)
      }
    }

    function createTransModel(step) {
      clearScene()
      const metal = createMetal(0xCC8844, [0, 0, 0])
      if (step < 2) {
        const pos = [[2.2,0,0],[-2.2,0,0],[0,2.2,0],[0,-2.2,0]]
        pos.forEach(p => createLigand(0xFF6644, p))
        pos.forEach(p => createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(...p)))
      }
      if (step === 1) {
        createLigand(0x44FF44, [0, 0.6, 2.6])
        createArrow(new THREE.Vector3(0, 0, 3.5), new THREE.Vector3(0, 0.5, 2.4), 0x44FF44)
      }
      if (step === 2) {
        createLigand(0x44FF44, [0, 0, 2.2])
        createLigand(0xFF6644, [2.2, 0, 0])
        createLigand(0xFF6644, [-2.2, 0, 0])
        createLigand(0xFF6644, [0, -2.2, 0])
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(2.2,0,0), 0xFF6644, 0.6)
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(-2.2,0,0), 0xFF6644, 0.6)
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(0,-2.2,0), 0xFF6644, 0.6)
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,2.2), 0x44FF44, 0.6)
        createArrow(new THREE.Vector3(0, 2.5, 0), new THREE.Vector3(0, 3.5, 0), 0xFF6644)
      }
      if (step === 3) {
        createLigand(0x44FF44, [0, 2.2, 0])
        createLigand(0x44FF44, [0, -2.2, 0])
        createLigand(0xFF6644, [2.2, 0, 0])
        createLigand(0xFF6644, [-2.2, 0, 0])
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(2.2,0,0), 0xFF6644, 0.6)
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(-2.2,0,0), 0xFF6644, 0.6)
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(0,2.2,0), 0x44FF44, 0.6)
        createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(0,-2.2,0), 0x44FF44, 0.6)
      }
    }

    const models = {
      Id: createIdModel,
      Ia: createIaModel,
      A: createAModel,
      Trans: createTransModel,
    }

    models[selectedMech]?.(animStep)

    function animate() {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const hr = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", hr)

    return () => {
      window.removeEventListener("resize", hr)
      container.removeChild(renderer.domElement)
    }
  }, [selectedMech, animStep])

  const mechInfo = {
    Id: {
      name: "I<sub>d</sub> — Dissotsiativ almashinish",
      steps: ["Boshlang'ich: [ML₅X]", "X chiqishi (sekin)", "Y kirishi (tez)", "Mahsulot: [ML₅Y]"],
      color: "text-green-400",
      complex: "[Ni(H₂O)₆]²⁺ + NH₃"
    },
    Ia: {
      name: "I<sub>a</sub> — Assotsiativ almashinish",
      steps: ["Boshlang'ich: [ML₅X]", "Y yaqinlashishi", "X chiqishi", "Mahsulot: [ML₅Y]"],
      color: "text-blue-400",
      complex: "[Cr(H₂O)₆]³⁺ + SCN⁻"
    },
    A: {
      name: "A — Assotsiativ (kvadrat-planar)",
      steps: ["Boshlang'ich: [ML₄]", "Y kirishi (sekin)", "L chiqishi (tez)", "Mahsulot: [ML₃Y]"],
      color: "text-orange-400",
      complex: "[PtCl₄]²⁻ + NH₃"
    },
    Trans: {
      name: "Trans-ta'sir (kvadrat-planar)",
      steps: ["Boshlang'ich: [PtCl₄]²⁻", "NH₃ birikishi", "Trans Cl⁻ chiqishi", "sis-[Pt(NH₃)₂Cl₂]"],
      color: "text-red-400",
      complex: "sisplatin sintezi"
    }
  }

  const info = mechInfo[selectedMech]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white flex flex-col">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 z-10">
        <Link href="/ilmiy/chuqurlashgan/kinetika" className="text-purple-400 hover:text-purple-300 text-lg">
          ← Kinetika
        </Link>
        <div>
          <h1 className="text-xl font-bold text-pink-400">🔮 Ligand almashinishi 3D vizualizatsiya</h1>
          <p className="text-purple-400 text-sm">Dissotsiativ • Assotsiativ • Trans-ta&apos;sir — bosqichma-bosqich animatsiya</p>
        </div>
      </header>

      {/* Mexanizm tanlash */}
      <div className="flex justify-center gap-3 px-6 py-3 bg-purple-950/80 border-b border-purple-800/50 z-10 flex-wrap">
        {[
          { key: "Id", label: "Id — Dissotsiativ", emoji: "🔓" },
          { key: "Ia", label: "Ia — Assotsiativ (O<sub>h</sub>)", emoji: "🔒" },
          { key: "A", label: "A — Assotsiativ (Kv-Planar)", emoji: "⬛" },
          { key: "Trans", label: "Trans-ta'sir", emoji: "⚡" },
        ].map(m => (
          <button
            key={m.key}
            onClick={() => { setSelectedMech(m.key); setAnimStep(0); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedMech === m.key
                ? "bg-pink-600/60 text-white border border-pink-400/50"
                : "bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
            dangerouslySetInnerHTML={{ __html: `${m.emoji} ${m.label}` }}
          ></button>
        ))}
      </div>

      {/* 3D Viewport */}
      <div ref={containerRef} className="flex-1 w-full min-h-[400px]" />

      {/* Info panel */}
      <div className="px-6 py-3 bg-purple-950/80 border-t border-purple-800/50 z-10">
        <div className="max-w-4xl mx-auto">
          <h3 className={`text-lg font-bold ${info.color}`} dangerouslySetInnerHTML={{ __html: info.name }}></h3>
          <p className="text-purple-400 text-sm">{info.complex}</p>
        </div>
      </div>

      {/* Step buttons */}
      <div className="flex justify-center gap-3 px-6 py-3 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        {info.steps.map((step, i) => (
          <button
            key={i}
            onClick={() => setAnimStep(i)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              animStep === i
                ? "bg-pink-600/60 text-white border border-pink-400/50"
                : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            {i + 1}. {step}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 py-2 px-6 bg-purple-950/40 border-t border-purple-800/20 z-10 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#44AA88]"></div>
          <span className="text-purple-300">Metall (Ni/Cr/Pt)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#44AAFF]"></div>
          <span className="text-purple-300">Mavjud ligand</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF6644]"></div>
          <span className="text-purple-300">Chiquvchi ligand (X)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FFAA44]"></div>
          <span className="text-purple-300">Kiruvchi ligand (Y)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-yellow-400"></div>
          <span className="text-purple-300">Harakat yo'nalishi</span>
        </div>
      </div>

      <div className="text-center py-2 px-6 bg-purple-950/40 border-t border-purple-800/20 z-10">
        <p className="text-purple-400 text-xs">🖱️ Aylantiring • Kattalashtiring • Bosqichlarni ko'ring</p>
      </div>
    </main>
  )
}