"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

// ============================================================================
// ORBITAL MA'LUMOTLARI
// ============================================================================
const orbitalData = {
  dxy: {
    name: "dxy",
    color: "#ef4444",
    group: "t₂g",
    energy: "−0.4Δ₀",
    desc: "4 ta bo'lak x va y o'qlari orasida (45°). XY tekisligida. Oktaedrik maydonda stabillashgan.",
    shapeFunc: (x, y, z) => x * y
  },
  dxz: {
    name: "dxz",
    color: "#22c55e",
    group: "t₂g",
    energy: "−0.4Δ₀",
    desc: "4 ta bo'lak x va z o'qlari orasida (45°). XZ tekisligida. dyz bilan degenerat.",
    shapeFunc: (x, y, z) => x * z
  },
  dyz: {
    name: "dyz",
    color: "#3b82f6",
    group: "t₂g",
    energy: "−0.4Δ₀",
    desc: "4 ta bo'lak y va z o'qlari orasida (45°). YZ tekisligida. dxz bilan degenerat.",
    shapeFunc: (x, y, z) => y * z
  },
  dz2: {
    name: "dz²",
    color: "#f97316",
    group: "e_g",
    energy: "+0.6Δ₀",
    desc: "2 ta bo'lak z o'qi bo'ylab + xy tekisligida halqa (donut). Eng murakkab shaklli d-orbital.",
    shapeFunc: (x, y, z) => 2 * z * z - x * x - y * y
  },
  dx2y2: {
    name: "dx²−y²",
    color: "#ec4899",
    group: "e_g",
    energy: "+0.6Δ₀",
    desc: "4 ta bo'lak to'g'ridan-to'g'ri x va y o'qlarida. Eng yuqori energiyali orbital.",
    shapeFunc: (x, y, z) => x * x - y * y
  }
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function Orbital3D() {
  const [selected, setSelected] = useState("dxy")
  const [autoRotate, setAutoRotate] = useState(true)
  const [loading, setLoading] = useState(true)
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const controlsRef = useRef(null)
  const pointsRef = useRef(null)
  const animationRef = useRef(null)

  const current = orbitalData[selected]

  // ==========================================================================
  // ORBITAL NUQTALARINI YARATISH
  // ==========================================================================
  const createOrbitalPoints = (orbital, colorHex) => {
    const points = []
    const colors = []
    const N = 10000

    for (let i = 0; i < N; i++) {
      const r = 2.5 * Math.cbrt(Math.random())
      const theta = Math.acos(2 * Math.random() - 1)
      const phi = 2 * Math.PI * Math.random()

      const x = r * Math.sin(theta) * Math.cos(phi)
      const y = r * Math.sin(theta) * Math.sin(phi)
      const z = r * Math.cos(theta)

      const psi = orbital.shapeFunc(x, y, z) * Math.exp(-r / 1.5)
      const prob = psi * psi * r * r

      if (Math.random() < prob * 3) {
        const sign = psi >= 0
        points.push(x, y, z)
        
        if (sign) {
          colors.push(
            parseInt(colorHex.slice(1, 3), 16) / 255,
            parseInt(colorHex.slice(3, 5), 16) / 255,
            parseInt(colorHex.slice(5, 7), 16) / 255
          )
        } else {
          colors.push(0.6, 0.65, 0.85)
        }
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.85
    })

    return new THREE.Points(geometry, material)
  }

  // ==========================================================================
  // O'QLAR YARATISH
  // ==========================================================================
  const createAxes = () => {
    const group = new THREE.Group()

    const createAxis = (from, to, color) => {
      const dir = new THREE.Vector3().subVectors(to, from)
      const length = dir.length()
      const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)

      const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, length, 8),
        new THREE.MeshBasicMaterial({ color })
      )
      cylinder.position.copy(mid)
      cylinder.lookAt(to)
      cylinder.rotateX(Math.PI / 2)
      group.add(cylinder)

      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.1, 0.3, 8),
        new THREE.MeshBasicMaterial({ color })
      )
      cone.position.copy(to)
      cone.lookAt(new THREE.Vector3().addVectors(to, dir.normalize()))
      cone.rotateX(Math.PI / 2)
      group.add(cone)
    }

    createAxis(new THREE.Vector3(-3, 0, 0), new THREE.Vector3(3, 0, 0), 0xef4444)
    createAxis(new THREE.Vector3(0, -3, 0), new THREE.Vector3(0, 3, 0), 0x22c55e)
    createAxis(new THREE.Vector3(0, 0, -3), new THREE.Vector3(0, 0, 3), 0x3b82f6)

    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
    )
    group.add(nucleus)

    return group
  }

  // ==========================================================================
  // SAHNA YARATISH
  // ==========================================================================
  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Sahna
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0015)
    sceneRef.current = scene

    // Kamera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(4, 3, 5)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Yorug'lik
    scene.add(new THREE.AmbientLight(0x404040, 0.5))
    const light = new THREE.PointLight(0xffffff, 1, 20)
    light.position.set(10, 10, 10)
    scene.add(light)

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    controls.minDistance = 3
    controls.maxDistance = 12
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 1.5
    controlsRef.current = controls

    // O'qlar
    const axes = createAxes()
    scene.add(axes)

    // Orbital nuqtalari
    const points = createOrbitalPoints(current, current.color)
    scene.add(points)
    pointsRef.current = points

    // Animatsiya sikli
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    setLoading(false)

    // Resize
    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  // ==========================================================================
  // ORBITAL O'ZGARGANDA YANGILASH
  // ==========================================================================
  useEffect(() => {
    if (!sceneRef.current || !pointsRef.current) return

    // Eski nuqtalarni olib tashlash
    sceneRef.current.remove(pointsRef.current)
    pointsRef.current.geometry.dispose()
    pointsRef.current.material.dispose()

    // Yangi nuqtalar
    const newPoints = createOrbitalPoints(current, current.color)
    sceneRef.current.add(newPoints)
    pointsRef.current = newPoints
  }, [selected])

  // ==========================================================================
  // AUTOROTATE O'ZGARGANDA
  // ==========================================================================
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate
    }
  }, [autoRotate])

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50 bg-black/30">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli" className="text-purple-400 hover:text-purple-300">d-orbitallar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-purple-300">3D Model</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🔄 d-orbitallarning 3D modeli</h1>
          <p className="text-purple-400 text-sm">Interaktiv • Aylantirish • Kattalashtirish • 5 ta orbital</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ORBITAL TANLASH */}
        <div className="flex gap-2 flex-wrap justify-center">
          {Object.entries(orbitalData).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className="px-5 py-3 rounded-xl text-sm font-bold font-mono transition-all transform hover:scale-105"
              style={{
                backgroundColor: selected === key ? val.color + "30" : "rgba(88, 28, 135, 0.3)",
                border: `2px solid ${selected === key ? val.color : "rgba(139, 92, 246, 0.3)"}`,
                color: selected === key ? val.color : "#c4b5fd"
              }}
            >
              {val.name}
              <span className="block text-xs font-normal opacity-70 mt-1">{val.group}</span>
            </button>
          ))}
        </div>

        {/* 3D CANVAS */}
        <div className="relative bg-black/40 border border-purple-700/50 rounded-2xl overflow-hidden" style={{ height: "500px" }}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-purple-400 text-lg animate-pulse">🔄 Yuklanmoqda...</div>
            </div>
          )}
          <div ref={mountRef} className="w-full h-full" />
        </div>

        {/* BOSHQARUV TUGMALARI */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              autoRotate ? "bg-yellow-600/80 text-white" : "bg-purple-800/40 text-purple-300"
            }`}
          >
            {autoRotate ? "⏸️ Avtoaylanish: ON" : "▶️ Avtoaylanish: OFF"}
          </button>
          <button
            onClick={() => {
              if (controlsRef.current) {
                controlsRef.current.target.set(0, 0, 0)
                controlsRef.current.update()
              }
            }}
            className="px-4 py-2 bg-purple-800/40 text-purple-300 rounded-xl text-sm font-semibold hover:bg-purple-700/50"
          >
            🎯 Markazga qaytish
          </button>
        </div>

        {/* JORIY ORBITAL HAQIDA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: current.color }}></div>
            <h2 className="text-xl font-bold" style={{ color: current.color }}>{current.name} orbital</h2>
            <span className={`text-xs px-3 py-1 rounded-full border ${
              current.group === "t₂g" 
                ? "bg-green-600/20 text-green-400 border-green-600/30" 
                : "bg-red-600/20 text-red-400 border-red-600/30"
            }`}>
              {current.group} — {current.energy}
            </span>
          </div>
          <p className="text-purple-200">{current.desc}</p>
        </div>

        {/* BARCHA ORBITALLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">📂 Barcha orbitallar</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(orbitalData).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className="p-3 rounded-xl text-center transition-all hover:scale-105"
                style={{
                  backgroundColor: selected === key ? val.color + "20" : "rgba(88, 28, 135, 0.2)",
                  border: `1px solid ${selected === key ? val.color : "rgba(139, 92, 246, 0.2)"}`,
                }}
              >
                <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: val.color }}></div>
                <p className="font-mono font-bold text-sm" style={{ color: val.color }}>{val.name}</p>
                <p className="text-purple-400 text-xs mt-1">{val.group}</p>
              </button>
            ))}
          </div>
        </div>

        {/* QO'LLANMA */}
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">🖱️ Boshqarish</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-yellow-400 font-bold mb-2">🖱️ Sichqoncha</p>
              <ul className="text-purple-200 space-y-1 text-xs">
                <li>• <strong>Chap tugma + tortish:</strong> Aylantirish</li>
                <li>• <strong>O'ng tugma + tortish:</strong> Siljitish</li>
                <li>• <strong>G'ildirak:</strong> Kattalashtirish</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-yellow-400 font-bold mb-2">📱 Sensorli ekran</p>
              <ul className="text-purple-200 space-y-1 text-xs">
                <li>• <strong>Bir barmoq:</strong> Aylantirish</li>
                <li>• <strong>Ikki barmoq:</strong> Siljitish</li>
                <li>• <strong>Chimchilash:</strong> Kattalashtirish</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-yellow-400 font-bold mb-2">🎨 Ranglar</p>
              <ul className="text-purple-200 space-y-1 text-xs">
                <li>• <strong>Rangli:</strong> ψ {'>'} 0 (musbat faza)</li>
                <li>• <strong>Och ko'k:</strong> ψ {'<'} 0 (manfiy faza)</li>
                <li>• <strong>Sariq nuqta:</strong> Atom yadrosi</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dx2y2" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← dx²−y²</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/taqqoslash" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl hover:opacity-90 text-white font-semibold">Taqqoslash →</Link>
        </div>

      </section>
    </main>
  )
}