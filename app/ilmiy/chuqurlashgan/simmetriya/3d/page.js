"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Simmetriya3D() {
  const containerRef = useRef(null)
  const [selectedGeo, setSelectedGeo] = useState("Oh")
  const [showAxes, setShowAxes] = useState(true)
  const [showPlanes, setShowPlanes] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(5, 4.5, 6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.6
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
    grid.position.y = -3
    scene.add(grid)

    // Zarralar fon
    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(200 * 3)
    for (let i = 0; i < 200 * 3; i += 3) {
      sp[i] = (Math.random() - 0.5) * 14
      sp[i + 1] = (Math.random() - 0.5) * 10
      sp[i + 2] = (Math.random() - 0.5) * 14
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.015, transparent: true, opacity: 0.4 })))

    // Geometriya ma'lumotlari
    const geometries = {
      Oh: {
        ligandPositions: [[2,0,0],[-2,0,0],[0,2,0],[0,-2,0],[0,0,2],[0,0,-2]],
        metalColor: 0x3D4B8C,
        ligandColor: 0x44AAFF,
        name: "Oktaedrik Oh",
        complex: "[Co(NH₃)₆]³⁺",
        cAxes: [{dir:[0,1,0], n:4},{dir:[1,0,0], n:4},{dir:[0,0,1], n:4}],
        c3Axes: [{dir:[1,1,1]},{dir:[-1,1,1]},{dir:[1,-1,1]},{dir:[1,1,-1]}],
        c2Axes: [{dir:[1,1,0]},{dir:[1,-1,0]},{dir:[1,0,1]},{dir:[1,0,-1]},{dir:[0,1,1]},{dir:[0,1,-1]}],
        planes: [{normal:[0,1,0], type:'h'},{normal:[1,0,0], type:'h'},{normal:[0,0,1], type:'h'}],
        ks: 6
      },
      Td: {
        ligandPositions: [[1.633,1.633,1.633],[-1.633,-1.633,1.633],[1.633,-1.633,-1.633],[-1.633,1.633,-1.633]],
        metalColor: 0x3D4B8C,
        ligandColor: 0x44FF44,
        name: "Tetraedrik Td",
        complex: "[CoCl₄]²⁻",
        cAxes: [],
        c3Axes: [{dir:[1,1,1]},{dir:[-1,1,1]},{dir:[1,-1,1]},{dir:[1,1,-1]}],
        c2Axes: [{dir:[1,0,0]},{dir:[0,1,0]},{dir:[0,0,1]}],
        planes: [{normal:[1,1,0]},{normal:[1,-1,0]},{normal:[1,0,1]},{normal:[1,0,-1]},{normal:[0,1,1]},{normal:[0,1,-1]}],
        ks: 4
      },
      D4h: {
        ligandPositions: [[2.2,0,0],[-2.2,0,0],[0,2.2,0],[0,-2.2,0]],
        metalColor: 0xC88033,
        ligandColor: 0xFF6644,
        name: "Kvadrat-planar D4h",
        complex: "[PtCl₄]²⁻",
        cAxes: [{dir:[0,0,1], n:4}],
        c3Axes: [],
        c2Axes: [{dir:[1,0,0]},{dir:[0,1,0]},{dir:[1,1,0]},{dir:[1,-1,0]}],
        planes: [{normal:[0,0,1], type:'h'},{normal:[1,0,0], type:'v'},{normal:[0,1,0], type:'v'},{normal:[1,1,0], type:'d'},{normal:[1,-1,0], type:'d'}],
        ks: 4
      },
      D3h: {
        ligandPositions: [[0,2.5,0],[0,-2.5,0],[2.17,0,1.25],[-1.085,0,1.25],[1.085,0,-1.25]],
        metalColor: 0x44AA88,
        ligandColor: 0xFFAA44,
        name: "Trigonal-bipiramida D3h",
        complex: "[Fe(CO)₅]",
        cAxes: [{dir:[0,0,1], n:3}],
        c3Axes: [{dir:[0,0,1]}],
        c2Axes: [{dir:[1,0,0]},{dir:[-0.5,0,0.866]},{dir:[-0.5,0,-0.866]}],
        planes: [{normal:[0,0,1], type:'h'},{normal:[1,0,0], type:'v'},{normal:[-0.5,0,0.866], type:'v'},{normal:[-0.5,0,-0.866], type:'v'}],
        ks: 5
      }
    }

    let meshes = []

    function createModel(geo) {
      meshes.forEach(m => scene.remove(m))
      meshes = []

      const geom = geometries[geo]
      if (!geom) return

      // Metall markazi
      const centerGeo = new THREE.SphereGeometry(0.42, 64, 64)
      const centerMat = new THREE.MeshStandardMaterial({ color: geom.metalColor, roughness: 0.2, metalness: 0.9 })
      const center = new THREE.Mesh(centerGeo, centerMat)
      scene.add(center)
      meshes.push(center)

      // Glow
      const glowGeo = new THREE.SphereGeometry(0.5, 32, 32)
      const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: geom.metalColor, transparent: true, opacity: 0.1 }))
      scene.add(glow)
      meshes.push(glow)

      // Ligandlar
      geom.ligandPositions.forEach(([x,y,z]) => {
        const lGeo = new THREE.SphereGeometry(0.3, 32, 32)
        const lMat = new THREE.MeshStandardMaterial({ color: geom.ligandColor, roughness: 0.4, metalness: 0.1 })
        const ligand = new THREE.Mesh(lGeo, lMat)
        ligand.position.set(x, y, z)
        scene.add(ligand)
        meshes.push(ligand)

        // Bog' chizig'i
        const start = new THREE.Vector3(0,0,0)
        const end = new THREE.Vector3(x,y,z)
        const dir = end.clone().sub(start)
        const len = dir.length()
        const mid = dir.clone().multiplyScalar(0.5)
        const bGeo = new THREE.CylinderGeometry(0.06, 0.06, len, 16)
        const bMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.2, transparent: true, opacity: 0.5 })
        const bond = new THREE.Mesh(bGeo, bMat)
        bond.position.copy(mid)
        bond.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir.normalize()))
        scene.add(bond)
        meshes.push(bond)
      })

      // Simmetriya elementlari
      if (showAxes) {
        // C₄ o'qlari
        geom.cAxes?.forEach(ax => {
          createAxialLine(new THREE.Vector3(...Object.values(ax.dir)), 3.5, 0xff4444, `C₄`)
        })
        // C₃ o'qlari
        geom.c3Axes?.forEach(ax => {
          createAxialLine(new THREE.Vector3(...Object.values(ax.dir)), 3.5, 0x44ff44, `C₃`)
        })
        // C₂ o'qlari
        geom.c2Axes?.forEach(ax => {
          createAxialLine(new THREE.Vector3(...Object.values(ax.dir)), 3.2, 0x4488ff, `C₂`)
        })
      }

      if (showPlanes) {
        geom.planes?.forEach(p => {
          createPlane(new THREE.Vector3(...Object.values(p.normal)), p.type || 'v')
        })
      }

      function createAxialLine(dir, length, color, label) {
        const norm = dir.normalize()
        const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 })
        const points = [norm.clone().multiplyScalar(-length), norm.clone().multiplyScalar(length)]
        const geo = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(geo, mat)
        scene.add(line)
        meshes.push(line)

        // O'q uchi (konus)
        const coneGeo = new THREE.ConeGeometry(0.1, 0.3, 8, 8)
        const coneMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, emissive: color, emissiveIntensity: 0.5 })
        const cone = new THREE.Mesh(coneGeo, coneMat)
        cone.position.copy(norm.clone().multiplyScalar(length))
        cone.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), norm))
        scene.add(cone)
        meshes.push(cone)
      }

      function createPlane(normal, type) {
        const norm = normal.normalize()
        const size = 2.8
        const geo = new THREE.PlaneGeometry(size * 2, size * 2)
        const color = type === 'h' ? 0xffff44 : type === 'd' ? 0xff88ff : 0x88ffff
        const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.15 })
        const plane = new THREE.Mesh(geo, mat)
        plane.position.set(0, 0, 0)
        plane.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), norm))
        scene.add(plane)
        meshes.push(plane)
      }
    }

    createModel(selectedGeo)

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
  }, [selectedGeo, showAxes, showPlanes])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white flex flex-col">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 z-10">
        <Link href="/ilmiy/chuqurlashgan/simmetriya" className="text-purple-400 hover:text-purple-300 text-lg">
          ← Molekulalar simmetriyasi
        </Link>
        <div>
          <h1 className="text-xl font-bold text-pink-400">🔮 Simmetriya 3D vizualizatsiya</h1>
          <p className="text-purple-400 text-sm">O<sub>h</sub> • T<sub>d</sub> • D<sub>4h</sub> • D<sub>3h</sub> — Simmetriya elementlarini interaktiv ko&apos;rish</p>
        </div>
      </header>

      {/* Geometriya tanlash */}
      <div className="flex justify-center gap-3 px-6 py-3 bg-purple-950/80 border-b border-purple-800/50 z-10 flex-wrap">
        {[
          { key: "Oh", label: "Oktaedrik Oh", emoji: "💎" },
          { key: "Td", label: "Tetraedrik Td", emoji: "🔺" },
          { key: "D4h", label: "Kvadrat-planar D4h", emoji: "⬛" },
          { key: "D3h", label: "Trigonal-bipiramida D3h", emoji: "🔷" },
        ].map(g => (
          <button
            key={g.key}
            onClick={() => setSelectedGeo(g.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedGeo === g.key
                ? "bg-pink-600/60 text-white border border-pink-400/50"
                : "bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            {g.emoji} {g.label}
          </button>
        ))}
      </div>

      {/* 3D Viewport */}
      <div ref={containerRef} className="flex-1 w-full min-h-[450px]" />

      {/* Footer — boshqaruv elementlari */}
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <button
          onClick={() => setShowAxes(!showAxes)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            showAxes ? "bg-red-600/40 text-red-300 border border-red-500/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50"
          }`}
        >
          {showAxes ? "🔄 Aylanish o'qlari: ON" : "🔄 Aylanish o'qlari: OFF"}
        </button>
        <button
          onClick={() => setShowPlanes(!showPlanes)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            showPlanes ? "bg-cyan-600/40 text-cyan-300 border border-cyan-500/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50"
          }`}
        >
          {showPlanes ? "🪞 Aks tekisliklari: ON" : "🪞 Aks tekisliklari: OFF"}
        </button>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-400"></div>
          <span className="text-purple-300">C₄ o&apos;qi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-green-400"></div>
          <span className="text-purple-300">C₃ o&apos;qi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-400"></div>
          <span className="text-purple-300">C₂ o&apos;qi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400/30 border border-yellow-400/50"></div>
          <span className="text-purple-300">σ<sub>h</sub> tekislik</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cyan-400/30 border border-cyan-400/50"></div>
          <span className="text-purple-300">σ<sub>v</sub>/σ<sub>d</sub> tekislik</span>
        </div>
      </div>

      <div className="text-center py-2 px-6 bg-purple-950/40 border-t border-purple-800/20 z-10">
        <p className="text-purple-400 text-xs">🖱️ Aylantiring • Kattalashtiring • Geometriyani tanlang • Simmetriya elementlarini yoqing/o&apos;chiring</p>
      </div>
    </main>
  )
}