"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. 3D VIZUALIZATOR — ASOSIY KOMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function TreeDeVizualizator() {
  const containerRef = useRef(null)
  const [selectedGeo, setSelectedGeo] = useState("Oh")
  const [showAxes, setShowAxes] = useState(true)
  const [showPlanes, setShowPlanes] = useState(true)
  const [showLabels, setShowLabels] = useState(false)
  const [rotSpeed, setRotSpeed] = useState(0.6)
  const [viewMode, setViewMode] = useState("solid")
  const [info, setInfo] = useState({ name: "", complex: "", cn: 0 })

  // Geometriya ma'lumotlari
  const geometries = {
    Oh: {
      ligandPositions: [[2,0,0],[-2,0,0],[0,2,0],[0,-2,0],[0,0,2],[0,0,-2]],
      metalColor: 0x3D4B8C, ligandColor: 0x44AAFF,
      name: "Oktaedrik O\u2095", complex: "[Co(NH\u2083)\u2086]\u00B3\u207A", cn: 6,
      desc: "6 ta ligand — oktaedr uchlarida. Eng keng tarqalgan geometriya.",
      symmetry: { E:1, C4:3, C3:4, C2:6, i:1, S4:3, S6:4, sh:3, sv:6, sd:6 },
      crystal: "Kub",
      note: "Inversiya markazi mavjud",
      cAxes: [{dir:[0,1,0], n:4},{dir:[1,0,0], n:4},{dir:[0,0,1], n:4}],
      c3Axes: [{dir:[1,1,1]},{dir:[-1,1,1]},{dir:[1,-1,1]},{dir:[1,1,-1]}],
      c2Axes: [{dir:[1,1,0]},{dir:[1,-1,0]},{dir:[1,0,1]},{dir:[1,0,-1]},{dir:[0,1,1]},{dir:[0,1,-1]}],
      planes: [{normal:[0,1,0], type:'h'},{normal:[1,0,0], type:'h'},{normal:[0,0,1], type:'h'},
               {normal:[1,1,0], type:'d'},{normal:[1,-1,0], type:'d'},{normal:[1,0,1], type:'d'},
               {normal:[1,0,-1], type:'d'},{normal:[0,1,1], type:'d'},{normal:[0,1,-1], type:'d'}]
    },
    Td: {
      ligandPositions: [[1.633,1.633,1.633],[-1.633,-1.633,1.633],[1.633,-1.633,-1.633],[-1.633,1.633,-1.633]],
      metalColor: 0x3D4B8C, ligandColor: 0x44FF44,
      name: "Tetraedrik T\u2091", complex: "[CoCl\u2084]\u00B2\u207B", cn: 4,
      desc: "4 ta ligand — tetraedr uchlarida. Inversiya markazi yo'q.",
      symmetry: { E:1, C3:8, C2:3, S4:6, sd:6 },
      crystal: "Tetraedr",
      note: "Inversiya markazi YO'Q",
      cAxes: [], c3Axes: [{dir:[1,1,1]},{dir:[-1,1,1]},{dir:[1,-1,1]},{dir:[1,1,-1]}],
      c2Axes: [{dir:[1,0,0]},{dir:[0,1,0]},{dir:[0,0,1]}],
      planes: [{normal:[1,1,0], type:'d'},{normal:[1,-1,0], type:'d'},{normal:[1,0,1], type:'d'},
               {normal:[1,0,-1], type:'d'},{normal:[0,1,1], type:'d'},{normal:[0,1,-1], type:'d'}]
    },
    D4h: {
      ligandPositions: [[2.2,0,0],[-2.2,0,0],[0,2.2,0],[0,-2.2,0],[0,0,0.4],[0,0,-0.4]],
      metalColor: 0xC88033, ligandColor: 0xFF6644,
      name: "Kvadrat-planar D\u2084h", complex: "[PtCl\u2084]\u00B2\u207B", cn: 4,
      desc: "4 ta ligand XY tekisligida. d\u2078 metallar uchun xos.",
      symmetry: { E:1, C4:1, C2:1, C2_:2, C2__:2, i:1, S4:1, sh:1, sv:2, sd:2 },
      crystal: "Kvadrat",
      note: "Inversiya markazi mavjud",
      cAxes: [{dir:[0,0,1], n:4}], c3Axes: [],
      c2Axes: [{dir:[1,0,0]},{dir:[0,1,0]},{dir:[1,1,0]},{dir:[1,-1,0]}],
      planes: [{normal:[0,0,1], type:'h'},{normal:[1,0,0], type:'v'},{normal:[0,1,0], type:'v'},
               {normal:[1,1,0], type:'d'},{normal:[1,-1,0], type:'d'}]
    },
    D3h: {
      ligandPositions: [[0,2.5,0],[0,-2.5,0],[2.17,1.25,0],[-1.085,1.25,0],[1.085,-1.25,0]],
      metalColor: 0x44AA88, ligandColor: 0xFFAA44,
      name: "Trigonal-bipiramida D\u2083h", complex: "[Fe(CO)\u2085]", cn: 5,
      desc: "3 ekvatorial + 2 aksial ligand. d\u2077 va d\u2078 komplekslar.",
      symmetry: { E:1, C3:2, C2:3, sh:1, S3:2, sv:3 },
      crystal: "Trigonal",
      note: "Aylanish C3 o'qi",
      cAxes: [{dir:[0,0,1], n:3}], c3Axes: [{dir:[0,0,1]}],
      c2Axes: [{dir:[1,0,0]},{dir:[-0.5,0,0.866]},{dir:[-0.5,0,-0.866]}],
      planes: [{normal:[0,0,1], type:'h'},{normal:[1,0,0], type:'v'},
               {normal:[-0.5,0,0.866], type:'v'},{normal:[-0.5,0,-0.866], type:'v'}]
    },
    C4v: {
      ligandPositions: [[2,0,0],[-2,0,0],[0,2,0],[0,-2,0],[0,0,2.5]],
      metalColor: 0xBB44CC, ligandColor: 0x77DDFF,
      name: "Kvadrat-piramida C\u2084v", complex: "[VO(acac)\u2082]", cn: 5,
      desc: "5 ta ligand — piramida. O\u2085 geometriyasi.",
      symmetry: { E:1, C4:1, C2:1, sv:4, sd:0 },
      crystal: "Kv. piramida",
      note: "Inversiya markazi YO'Q",
      cAxes: [{dir:[0,0,1], n:4}], c3Axes: [],
      c2Axes: [{dir:[1,0,0]},{dir:[0,1,0]}],
      planes: [{normal:[1,0,0], type:'v'},{normal:[0,1,0], type:'v'},
               {normal:[1,1,0], type:'d'},{normal:[1,-1,0], type:'d'}]
    },
    C2v: {
      ligandPositions: [[2,0,0],[-2,0,0],[0,2,1.2],[0,-2,1.2]],
      metalColor: 0xDD6666, ligandColor: 0x88FF88,
      name: "Burchakli C\u2082v", complex: "cis-[PtCl\u2082(NH\u2083)\u2082]", cn: 4,
      desc: "4 ta ligand — burchakli. cis-izomerlar uchun xos.",
      symmetry: { E:1, C2:1, sv:2 },
      crystal: "Burchakli",
      note: "Eng past simmetriya",
      cAxes: [{dir:[0,0,1], n:2}], c3Axes: [],
      c2Axes: [],
      planes: [{normal:[1,0,0], type:'v'},{normal:[0,1,0], type:'v'}]
    }
  }

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
    controls.autoRotateSpeed = rotSpeed
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

    // Coordinate axes
    if (showLabels) {
      const origin = new THREE.Vector3(0, 0, 0)
      ;[ {dir:[1,0,0], col:0xff4444, lbl:"x"}, {dir:[0,1,0], col:0x44ff44, lbl:"y"}, {dir:[0,0,1], col:0x4488ff, lbl:"z"} ].forEach(a => {
        const n = new THREE.Vector3(...a.dir).normalize()
        const pts = [n.clone().multiplyScalar(-2.5), n.clone().multiplyScalar(2.8)]
        const mat = new THREE.LineBasicMaterial({ color: a.col, transparent: true, opacity: 0.4 })
        const geo = new THREE.BufferGeometry().setFromPoints(pts)
        const line = new THREE.Line(geo, mat)
        scene.add(line)
      })
    }

    // Stars background
    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(200 * 3)
    for (let i = 0; i < 200 * 3; i += 3) {
      sp[i] = (Math.random() - 0.5) * 14
      sp[i + 1] = (Math.random() - 0.5) * 10
      sp[i + 2] = (Math.random() - 0.5) * 14
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.015, transparent: true, opacity: 0.4 })))

    let meshes = []

    function createModel(geoKey) {
      meshes.forEach(m => scene.remove(m))
      meshes = []

      const geom = geometries[geoKey]
      if (!geom) return

      setInfo({ name: geom.name, complex: geom.complex, cn: geom.cn })

      // Metal center
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

      // Ligands
      geom.ligandPositions.forEach(([x,y,z]) => {
        const lGeo = new THREE.SphereGeometry(0.3, 32, 32)
        const lMat = new THREE.MeshStandardMaterial({ color: geom.ligandColor, roughness: 0.4, metalness: 0.1 })
        const ligand = new THREE.Mesh(lGeo, lMat)
        ligand.position.set(x, y, z)
        scene.add(ligand)
        meshes.push(ligand)

        // Bond
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

      // Symmetry axes
      if (showAxes) {
        geom.cAxes?.forEach(ax => {
          createAxialLine(new THREE.Vector3(ax.dir[0], ax.dir[1], ax.dir[2]), 3.5, 0xff4444, "C\u2084")
        })
        geom.c3Axes?.forEach(ax => {
          createAxialLine(new THREE.Vector3(ax.dir[0], ax.dir[1], ax.dir[2]), 3.5, 0x44ff44, "C\u2083")
        })
        geom.c2Axes?.forEach(ax => {
          createAxialLine(new THREE.Vector3(ax.dir[0], ax.dir[1], ax.dir[2]), 3.2, 0x4488ff, "C\u2082")
        })
      }

      if (showPlanes) {
        geom.planes?.forEach(p => {
          createPlane(new THREE.Vector3(p.normal[0], p.normal[1], p.normal[2]), p.type || "v")
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
        const color = type === "h" ? 0xffff44 : type === "d" ? 0xff88ff : 0x88ffff
        const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.15 })
        const plane = new THREE.Mesh(geo, mat)
        plane.position.set(0, 0, 0)
        plane.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), norm))
        scene.add(plane)
        meshes.push(plane)
      }
    }

    createModel(selectedGeo)

    let frameId

    function animate() {
      frameId = requestAnimationFrame(animate)
      controls.autoRotateSpeed = rotSpeed
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
      cancelAnimationFrame(frameId); container.removeChild(renderer.domElement); renderer.dispose()
    }
  }, [selectedGeo, showAxes, showPlanes, showLabels, rotSpeed])

  const geoList = [
    { key: "Oh", label: "O\u2095 Oktaedrik", emoji: "💎" },
    { key: "Td", label: "T\u2091 Tetraedrik", emoji: "🔺" },
    { key: "D4h", label: "D\u2084h Kv. planar", emoji: "⬛" },
    { key: "D3h", label: "D\u2083h Trig. bipir.", emoji: "🔷" },
    { key: "C4v", label: "C\u2084v Kv. piramida", emoji: "🔶" },
    { key: "C2v", label: "C\u2082v Burchakli", emoji: "🔻" },
  ]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-pink-400">🔮</span> 3D interaktiv model — Three.js
      </h3>

      {/* Geometry selection */}
      <div className="flex justify-center gap-1.5 flex-wrap mb-3">
        {geoList.map(g => (
          <button
            key={g.key}
            onClick={() => setSelectedGeo(g.key)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
              selectedGeo === g.key
                ? "bg-pink-600/60 text-white border border-pink-400/50"
                : "bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
          >
            {g.emoji} {g.label}
          </button>
        ))}
      </div>

      {/* Info bar */}
      <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2 mb-3 text-[10px] flex items-center justify-between flex-wrap gap-1">
        <span className="text-yellow-300 font-bold">{info.name}</span>
        <span className="text-cyan-300 font-mono">{info.complex}</span>
        <span className="text-purple-400">KN = {info.cn}</span>
        <span className="text-purple-300">{geometries[selectedGeo]?.desc}</span>
      </div>

      {/* 3D Viewport */}
      <div ref={containerRef} className="w-full h-72 sm:h-96 rounded-xl border border-purple-700/40" />

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        <button onClick={() => setShowAxes(!showAxes)}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
            showAxes ? "bg-red-600/40 text-red-300 border border-red-500/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50"
          }`}>
          {showAxes ? "🔄 Aylanish: ON" : "🔄 Aylanish: OFF"}
        </button>
        <button onClick={() => setShowPlanes(!showPlanes)}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
            showPlanes ? "bg-cyan-600/40 text-cyan-300 border border-cyan-500/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50"
          }`}>
          {showPlanes ? "🪞 Tekislik: ON" : "🪞 Tekislik: OFF"}
        </button>
        <button onClick={() => setShowLabels(!showLabels)}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
            showLabels ? "bg-green-600/40 text-green-300 border border-green-500/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50"
          }`}>
          {showLabels ? "📐 Koord. o'qlari: ON" : "📐 Koord. o'qlari: OFF"}
        </button>
      </div>

      {/* Rotation speed slider */}
      <div className="flex items-center gap-2 mt-3 px-2">
        <span className="text-purple-400 text-[10px]">Aylanish tezligi:</span>
        <input
          type="range" min="0" max="2" step="0.1" value={rotSpeed}
          onChange={e => setRotSpeed(parseFloat(e.target.value))}
          className="flex-1 accent-purple-500 h-1"
        />
        <span className="text-purple-300 text-[10px] w-6 text-right">{rotSpeed.toFixed(1)}</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2 pt-2 border-t border-purple-800/30 text-[9px]">
        <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-red-400"></div><span className="text-purple-300">C\u2084</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-green-400"></div><span className="text-purple-300">C\u2083</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-blue-400"></div><span className="text-purple-300">C\u2082</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400/30 border border-yellow-400/50"></div><span className="text-purple-300">\u03C3\u2095</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-cyan-400/30 border border-cyan-400/50"></div><span className="text-purple-300">\u03C3\u1D65</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-pink-400/30 border border-pink-400/50"></div><span className="text-purple-300">\u03C3\u2091</span></div>
      </div>

      <div className="text-center mt-2 text-[9px] text-purple-500">
        🖱️ Aylantiring (sichqoncha) • Kattalashtiring (scroll) • Simmetriya elementlarini boshqaring
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. SIMMETRIYA ELEMENTLARI — MA'LUMOT PANELI
// ═══════════════════════════════════════════════════════════════════════════════
function SimmetriyaElementlari() {
  const [geo, setGeo] = useState("Oh")

  const data = {
    Oh: {
      name: "O\u2095 — Oktaedrik", cn: 6, h: 48, dim: 4,
      elements: [
        {sym: "E", n: 1, desc: "Ayniyat amali" },
        {sym: "C\u2084", n: 3, desc: "4-tartibli aylanish (6 ta amal)" },
        {sym: "C\u2083", n: 4, desc: "3-tartibli aylanish (8 ta amal)" },
        {sym: "C\u2082", n: 6, desc: "2-tartibli aylanish (3 ta amal)" },
        {sym: "i", n: 1, desc: "Inversiya markazi" },
        {sym: "S\u2084", n: 3, desc: "4-tartibli aynali aylanish (3 ta)" },
        {sym: "S\u2086", n: 4, desc: "6-tartibli aynali aylanish (4 ta)" },
        {sym: "\u03C3\u2095", n: 3, desc: "Gorizontal tekislik (3 ta)" },
        {sym: "\u03C3\u1D65", n: 6, desc: "Vertikal tekislik (6 ta)" },
        {sym: "\u03C3\u2091", n: 6, desc: "Diagonal tekislik (6 ta)" },
      ],
      note: "Eng yuqori simmetriyali guruh. Inversiya markazi, C\u2084 o'qlari va \u03C3\u2095 tekisliklari mavjud."
    },
    Td: {
      name: "T\u2091 — Tetraedrik", cn: 4, h: 24, dim: 3,
      elements: [
        {sym: "E", n: 1, desc: "Ayniyat amali" },
        {sym: "C\u2083", n: 4, desc: "3-tartibli aylanish (8 ta amal)" },
        {sym: "C\u2082", n: 3, desc: "2-tartibli aylanish (3 ta amal)" },
        {sym: "S\u2084", n: 3, desc: "4-tartibli aynali aylanish (3 ta)" },
        {sym: "\u03C3\u2091", n: 6, desc: "Diagonal tekislik (6 ta)" },
      ],
      note: "Inversiya markazi YO'Q. T\u2091 o\u2085 ga izomorf. C\u2083 o'qlari tetraedr uchlaridan o'tadi."
    },
    D4h: {
      name: "D\u2084h — Kvadrat-planar", cn: 4, h: 16, dim: 4,
      elements: [
        {sym: "E", n: 1, desc: "Ayniyat amali" },
        {sym: "C\u2084", n: 1, desc: "4-tartibli aylanish (2 ta amal)" },
        {sym: "C\u2082", n: 1, desc: "2-tartibli aylanish (1 ta amal)" },
        {sym: "C\u2082\u2032", n: 2, desc: "C\u2082 gorizontal (2 ta)" },
        {sym: "C\u2082\u2033", n: 2, desc: "C\u2082 diagonal (2 ta)" },
        {sym: "i", n: 1, desc: "Inversiya markazi" },
        {sym: "S\u2084", n: 1, desc: "4-tartibli aynali aylanish" },
        {sym: "\u03C3\u2095", n: 1, desc: "XY gorizontal tekislik" },
        {sym: "\u03C3\u1D65", n: 2, desc: "Vertikal tekislik" },
        {sym: "\u03C3\u2091", n: 2, desc: "Diagonal tekislik" },
      ],
      note: "d\u2078 metallar. C\u2084 o'qi Z yo'nalishida. XY tekisligida 4 ta ligand."
    },
    D3h: {
      name: "D\u2083h — Trigonal-bipiramida", cn: 5, h: 12, dim: 3,
      elements: [
        {sym: "E", n: 1, desc: "Ayniyat amali" },
        {sym: "C\u2083", n: 1, desc: "3-tartibli aylanish (2 ta amal)" },
        {sym: "C\u2082", n: 3, desc: "2-tartibli aylanish (3 ta amal)" },
        {sym: "\u03C3\u2095", n: 1, desc: "Gorizontal tekislik" },
        {sym: "S\u2083", n: 1, desc: "3-tartibli aynali aylanish" },
        {sym: "\u03C3\u1D65", n: 3, desc: "Vertikal tekislik" },
      ],
      note: "3 ekvatorial + 2 aksial ligand. d\u2077 va d\u2078 ML\u2085 komplekslar."
    },
    C4v: {
      name: "C\u2084v — Kvadrat-piramida", cn: 5, h: 8, dim: 3,
      elements: [
        {sym: "E", n: 1, desc: "Ayniyat amali" },
        {sym: "C\u2084", n: 1, desc: "4-tartibli aylanish" },
        {sym: "C\u2082", n: 1, desc: "2-tartibli aylanish" },
        {sym: "\u03C3\u1D65", n: 4, desc: "Vertikal tekislik (4 ta)" },
      ],
      note: "Inversiya markazi YO'Q. \u03C3\u2095 va \u03C3\u2091 yo'q. C\u2084v \u2192 D\u2084h dan past."
    },
    C2v: {
      name: "C\u2082v — Burchakli", cn: 4, h: 4, dim: 2,
      elements: [
        {sym: "E", n: 1, desc: "Ayniyat amali" },
        {sym: "C\u2082", n: 1, desc: "2-tartibli aylanish" },
        {sym: "\u03C3\u1D65", n: 2, desc: "Vertikal tekislik (2 ta)" },
      ],
      note: "Eng past simmetriya. cis-izomerlar. H\u2082O (C\u2082v) va boshqa burchakli molekulalar."
    }
  }

  const d = data[geo]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">📋</span> Simmetriya elementlari — to'liq ma'lumot
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.entries(data).map(([k,v]) => (
          <button key={k} onClick={()=>setGeo(k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${geo===k ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {v.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-[10px]">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-center">
          <span className="text-purple-400">Tartib (h)</span>
          <p className="text-yellow-300 font-mono font-bold text-sm">{d.h}</p>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-center">
          <span className="text-purple-400">O'lcham</span>
          <p className="text-cyan-300 font-mono font-bold text-sm">{d.dim}</p>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-center">
          <span className="text-purple-400">KN</span>
          <p className="text-green-300 font-mono font-bold text-sm">{d.cn}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[9px] sm:text-xs">
          <thead>
            <tr className="bg-purple-800/70">
              <th className="p-1 text-left text-amber-400">Simmetriya amali</th>
              <th className="p-1 text-center text-purple-200">Soni (n)</th>
              <th className="p-1 text-left text-purple-200">Tavsif</th>
            </tr>
          </thead>
          <tbody>
            {d.elements.map((el,i) => (
              <tr key={i} className={`border-t border-purple-800/30 ${i%2===0 ? "bg-purple-900/20" : "bg-purple-950/20"} hover:bg-purple-800/30`}>
                <td className="p-1 font-mono font-bold text-cyan-300">{el.sym}</td>
                <td className="p-1 text-center text-purple-400">{el.n}</td>
                <td className="p-1 text-purple-200 text-[8px] sm:text-[10px]">{el.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-cyan-400 font-bold">💡 {d.note}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. GEOMETRIYALARNI TAQQOSLASH JADVALI
// ═══════════════════════════════════════════════════════════════════════════════
function TaqqoslashJadvali() {
  const [highlight, setHighlight] = useState(null)

  const rows = [
    { geo:"O\u2095 (Oktaedrik)", cn:6, h:48, c4:"3 ta", c3:"4 ta", c2:"6 ta", i:"Bor", sh:"3 ta", sv:"6 ta", sd:"6 ta", misol:"[Co(NH\u2083)\u2086]\u00B3\u207A" },
    { geo:"T\u2091 (Tetraedrik)", cn:4, h:24, c4:"—", c3:"4 ta", c2:"3 ta", i:"Yo'q", sh:"—", sv:"—", sd:"6 ta", misol:"[CoCl\u2084]\u00B2\u207B" },
    { geo:"D\u2084h (Kv. planar)", cn:4, h:16, c4:"1 ta", c3:"—", c2:"4 ta", i:"Bor", sh:"1 ta", sv:"2 ta", sd:"2 ta", misol:"[PtCl\u2084]\u00B2\u207B" },
    { geo:"D\u2083h (Trig. bipir.)", cn:5, h:12, c4:"—", c3:"1 ta", c2:"3 ta", i:"Yo'q", sh:"1 ta", sv:"3 ta", sd:"—", misol:"[Fe(CO)\u2085]" },
    { geo:"C\u2084v (Kv. piramida)", cn:5, h:8, c4:"1 ta", c3:"—", c2:"1 ta", i:"Yo'q", sh:"—", sv:"4 ta", sd:"—", misol:"[VO(acac)\u2082]" },
    { geo:"C\u2082v (Burchakli)", cn:4, h:4, c4:"—", c3:"—", c2:"1 ta", i:"Yo'q", sh:"—", sv:"2 ta", sd:"—", misol:"cis-[PtCl\u2082(NH\u2083)\u2082]" },
  ]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-emerald-400">📊</span> Geometriyalarni taqqoslash — simmetriya elementlari
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[8px] sm:text-[10px]">
          <thead>
            <tr className="bg-purple-800/70">
              <th className="p-1 text-left text-amber-400">Geometriya</th>
              <th className="p-1 text-center text-purple-200">KN</th>
              <th className="p-1 text-center text-purple-200">h</th>
              <th className="p-1 text-center text-purple-200">C\u2084</th>
              <th className="p-1 text-center text-purple-200">C\u2083</th>
              <th className="p-1 text-center text-purple-200">C\u2082</th>
              <th className="p-1 text-center text-purple-200">i</th>
              <th className="p-1 text-center text-purple-200">\u03C3\u2095</th>
              <th className="p-1 text-center text-purple-200">\u03C3\u1D65</th>
              <th className="p-1 text-center text-purple-200">\u03C3\u2091</th>
              <th className="p-1 text-left text-purple-200 hidden md:table-cell">Misol</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i}
                onMouseEnter={()=>setHighlight(i)}
                onMouseLeave={()=>setHighlight(null)}
                className={`border-t border-purple-800/30 cursor-pointer transition-all ${
                  i%2===0 ? "bg-purple-900/20" : "bg-purple-950/20"
                } ${highlight===i ? "bg-purple-700/40 scale-[1.01]" : ""} hover:bg-purple-800/30`}
              >
                <td className={`p-1 font-bold font-mono ${highlight===i ? "text-pink-300" : "text-yellow-300"}`}>{r.geo}</td>
                <td className="p-1 text-center text-purple-400">{r.cn}</td>
                <td className="p-1 text-center text-purple-400 font-mono">{r.h}</td>
                <td className="p-1 text-center">{r.c4==="—"?<span className="text-purple-700">·</span>:<span className="text-red-300">{r.c4}</span>}</td>
                <td className="p-1 text-center">{r.c3==="—"?<span className="text-purple-700">·</span>:<span className="text-green-300">{r.c3}</span>}</td>
                <td className="p-1 text-center">{r.c2==="—"?<span className="text-purple-700">·</span>:<span className="text-blue-300">{r.c2}</span>}</td>
                <td className="p-1 text-center">{r.i==="Bor"?<span className="text-green-400">✓</span>:<span className="text-red-400">✗</span>}</td>
                <td className="p-1 text-center">{r.sh==="—"?<span className="text-purple-700">·</span>:<span className="text-yellow-300">{r.sh}</span>}</td>
                <td className="p-1 text-center">{r.sv==="—"?<span className="text-purple-700">·</span>:<span className="text-cyan-300">{r.sv}</span>}</td>
                <td className="p-1 text-center">{r.sd==="—"?<span className="text-purple-700">·</span>:<span className="text-pink-300">{r.sd}</span>}</td>
                <td className="p-1 text-purple-200 font-mono text-[7px] sm:text-[9px] hidden md:table-cell">{r.misol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-purple-400 font-bold">Legenda:</p>
        <p className="text-purple-200">
          <span className="text-red-300">C\u2084</span> = 4-tartibli o'q &nbsp;|&nbsp;
          <span className="text-green-300">C\u2083</span> = 3-tartibli o'q &nbsp;|&nbsp;
          <span className="text-blue-300">C\u2082</span> = 2-tartibli o'q &nbsp;|&nbsp;
          <span className="text-green-400">✓</span> = inversiya bor &nbsp;|&nbsp;
          <span className="text-red-400">✗</span> = inversiya yo'q &nbsp;|&nbsp;
          <span className="text-yellow-300">\u03C3\u2095</span> gorizontal &nbsp;|&nbsp;
          <span className="text-cyan-300">\u03C3\u1D65</span> vertikal &nbsp;|&nbsp;
          <span className="text-pink-300">\u03C3\u2091</span> diagonal
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. XARAKTERLAR JADVALI SNIPPETLARI
// ═══════════════════════════════════════════════════════════════════════════════
function XarakterlarSnippet() {
  const [geo, setGeo] = useState("Oh")

  const tables = {
    Oh: {
      title: "O\u2095 xarakterlar jadvali (qisqa)",
      headers: ["O\u2095", "E", "8C\u2083", "6C\u2082", "6C\u2084", "3C\u2082", "i", "6S\u2084", "8S\u2086", "3\u03C3\u2095", "6\u03C3\u2091"],
      rows: [
        { ir:"A\u2081g", chars:"1, 1, 1, 1, 1, 1, 1, 1, 1, 1" },
        { ir:"A\u2082g", chars:"1, 1, -1, -1, 1, 1, 1, -1, 1, -1" },
        { ir:"E_g", chars:"2, -1, 0, 0, 2, 2, 0, -1, 2, 0" },
        { ir:"T\u2081g", chars:"3, 0, -1, 1, -1, 3, 1, 0, -1, -1" },
        { ir:"T\u2082g", chars:"3, 0, 1, -1, -1, 3, -1, 0, -1, 1" },
        { ir:"A\u2081u", chars:"1, 1, 1, 1, 1, -1, -1, -1, -1, -1" },
        { ir:"T\u2081u", chars:"3, 0, -1, 1, -1, -3, -1, 0, 1, 1" },
      ],
      note: "Bazis funksiyalar: x, y, z \u2192 T\u2081u; x\u00B2+y\u00B2+z\u00B2, 2z\u00B2\u2212x\u00B2\u2212y\u00B2, x\u00B2\u2212y\u00B2 \u2192 A\u2081g, E_g; xy, xz, yz \u2192 T\u2082g"
    },
    Td: {
      title: "T\u2091 xarakterlar jadvali (qisqa)",
      headers: ["T\u2091", "E", "8C\u2083", "3C\u2082", "6S\u2084", "6\u03C3\u2091"],
      rows: [
        { ir:"A\u2081", chars:"1, 1, 1, 1, 1" },
        { ir:"A\u2082", chars:"1, 1, 1, -1, -1" },
        { ir:"E", chars:"2, -1, 2, 0, 0" },
        { ir:"T\u2081", chars:"3, 0, -1, 1, -1" },
        { ir:"T\u2082", chars:"3, 0, -1, -1, 1" },
      ],
      note: "Bazis: x, y, z \u2192 T\u2082; xy, xz, yz \u2192 T\u2082; x\u00B2+y\u00B2+z\u00B2 \u2192 A\u2081"
    },
    D4h: {
      title: "D\u2084h xarakterlar jadvali (qisqa)",
      headers: ["D\u2084h", "E", "2C\u2084", "C\u2082", "2C\u2082\u2032", "2C\u2082\u2033", "i", "2S\u2084", "\u03C3\u2095", "2\u03C3\u1D65", "2\u03C3\u2091"],
      rows: [
        { ir:"A\u2081g", chars:"1, 1, 1, 1, 1, 1, 1, 1, 1, 1" },
        { ir:"B\u2081g", chars:"1, -1, 1, 1, -1, 1, -1, 1, 1, -1" },
        { ir:"B\u2082g", chars:"1, -1, 1, -1, 1, 1, -1, 1, -1, 1" },
        { ir:"E_g", chars:"2, 0, -2, 0, 0, 2, 0, -2, 0, 0" },
        { ir:"A\u2082u", chars:"1, 1, 1, -1, -1, -1, -1, -1, 1, 1" },
        { ir:"E_u", chars:"2, 0, -2, 0, 0, -2, 0, 2, 0, 0" },
      ],
      note: "A\u2082u: z (IQ); E_u: (x,y) (IQ); A\u2081g: z\u00B2 (Raman); B\u2081g: x\u00B2\u2212y\u00B2; B\u2082g: xy; E_g: (xz, yz)"
    }
  }

  const d = tables[geo] || tables.Oh

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-violet-400">📜</span> Xarakterlar jadvali — simmetriya asoslari
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.entries(tables).map(([k,v]) => (
          <button key={k} onClick={()=>setGeo(k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${geo===k ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {k==="Oh"?"O\u2095":k==="Td"?"T\u2091":"D\u2084h"}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[7px] sm:text-[9px] font-mono">
          <thead>
            <tr className="bg-purple-800/70">
              {d.headers.map((h,i) => (
                <th key={i} className="p-0.5 text-center text-purple-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.rows.map((r,i) => (
              <tr key={i} className={`border-t border-purple-800/30 ${i%2===0 ? "bg-purple-900/20" : "bg-purple-950/20"} hover:bg-purple-800/30`}>
                <td className="p-0.5 text-center text-amber-400 font-bold">{r.ir}</td>
                {r.chars.split(",").map((c,j) => (
                  <td key={j} className="p-0.5 text-center text-purple-300">{c.trim()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-yellow-400 font-bold">💡 </p>
        <p className="text-purple-200">{d.note}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. MATEMATIK ASOSLAR — SIMMETRIYA OPERATORLARI
// ═══════════════════════════════════════════════════════════════════════════════
function MatematikAsoslar() {
  const [view, setView] = useState("aylanish")

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-rose-400">📐</span> Simmetriya operatorlarining matematik ifodasi
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-3">
        {[
          {k:"aylanish", l:"Cₙ aylanish matritsasi"},
          {k:"aks", l:"σ aks ettirish"},
          {k:"inversiya", l:"Inversiya (i)"},
          {k:"aynali", l:"Sₙ aynali aylanish"},
        ].map(v => (
          <button key={v.k} onClick={()=>setView(v.k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${view===v.k ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {v.l}
          </button>
        ))}
      </div>

      <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-4 text-xs font-mono">
        {view === "aylanish" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Cₙ — aylanish operatori (Z o'qi bo'ylab):</p>
            <p className="text-purple-200">Cₙ matritsasi (θ = 2π/n):</p>
            <pre className="text-green-300 text-center my-2 text-sm">
{`[cos(θ)  -sin(θ)   0]
[sin(θ)   cos(θ)   0]
[  0        0      1]`}
            </pre>
            <p className="text-purple-200">Masalan, C₄ (θ = 90°): (x, y, z) → (y, -x, z)</p>
            <p className="text-purple-300 mt-1">C₄² = C₂: (x, y, z) → (-x, -y, z)</p>
            <p className="text-purple-300">C₄³ = C₄⁻¹: (x, y, z) → (-y, x, z)</p>
          </div>
        )}
        {view === "aks" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">σ — aks ettirish operatorlari:</p>
            <p className="text-purple-200">σ_h (XY tekislik): (x, y, z) → (x, y, -z)</p>
            <pre className="text-green-300 text-center my-2 text-sm">
{`[1  0  0]
[0  1  0]
[0  0 -1]`}
            </pre>
            <p className="text-purple-200">σ_v (XZ tekislik): (x, y, z) → (x, -y, z)</p>
            <p className="text-purple-200">σ_d (diagonal — X=Y): (x, y, z) → (y, x, z)</p>
            <p className="text-purple-300 mt-1">σ² = E (ikki marta qo'llasak asl holatga qaytamiz)</p>
          </div>
        )}
        {view === "inversiya" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">i — inversiya operatori:</p>
            <p className="text-purple-200">Barcha koordinatalar ishorasini o'zgartiradi:</p>
            <pre className="text-green-300 text-center my-2 text-sm">
{`[-1  0  0]
[ 0 -1  0]
[ 0  0 -1]`}
            </pre>
            <p className="text-purple-200">i: (x, y, z) → (-x, -y, -z)</p>
            <p className="text-purple-300 mt-1">i² = E; i · σ_h = S₂; i · C₂ = σ_h (ma'lum kombinatsiyalar)</p>
            <p className="text-purple-200 mt-2">Inversiya markazi bor → g/u simmetriyasi. <strong className="text-cyan-300">g</strong> = gerade (i·χ=+χ), <strong className="text-red-300">u</strong> = ungerade (i·χ=-χ)</p>
          </div>
        )}
        {view === "aynali" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Sₙ — aynali aylanish (improper rotation):</p>
            <p className="text-purple-200">Sₙ = σ_h · Cₙ (avval aylantirib, keyin aks ettirish):</p>
            <pre className="text-green-300 text-center my-2 text-sm">
{`[cos(θ)  -sin(θ)   0]
[sin(θ)   cos(θ)   0]
[  0        0     -1]`}
            </pre>
            <p className="text-purple-200">S₄: (x, y, z) → (y, -x, -z) — 4 ta amal: S₄, S₄²=C₂, S₄³, S₄⁴=E</p>
            <p className="text-purple-200">S₆: 6-tartibli aynali aylanish (C₃ + σ_h)</p>
            <p className="text-purple-300 mt-1">Sₙ² = Cₙ/₂ (agar n juft bo'lsa). Sₙⁿ = E (n juft). Sₙ²ⁿ = E (n toq).</p>
          </div>
        )}
      </div>

      <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-cyan-400 font-bold">⚡ 3×3 matritsalar — barcha simmetriya amallarining matematik ifodasi.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. AMALIY MISOLLAR — MOLEKULALARNING 3D SIMMETRIYASI
// ═══════════════════════════════════════════════════════════════════════════════
function AmaliyMisollar() {
  const [sel, setSel] = useState(0)

  const misollar = [
    {
      name: "[Co(NH\u2083)\u2086]\u00B3\u207A — O\u2095",
      desc: "Oktaedrik geometriya. 6 ta NH\u2083 ligand simmetrik joylashgan.",
      sym: "C\u2084, C\u2083, C\u2082, \u03C3\u2095, \u03C3\u1D65, \u03C3\u2091, i, S\u2084, S\u2086",
      h: 48, d: "d\u2076 LS (t\u2082g\u2076)",
      color: "Co\u00B3\u207A pushti",
      note: "Eng ko'p uchraydigan geometriya. d-d o'tish kuchsiz (Laport taqiqlangan)."
    },
    {
      name: "[CoCl\u2084]\u00B2\u207B — T\u2091",
      desc: "Tetraedrik. 4 ta Cl⁻ ligand. Inversiya markazi yo'q.",
      sym: "C\u2083, C\u2082, S\u2084, \u03C3\u2091",
      h: 24, d: "d\u2077 HS (e\u2074 t\u2082\u00B3)",
      color: "Co\u00B2\u207A ko'k",
      note: "d-d o'tish kuchli (i yo'q). Tetraedrik ajralish teskar: E past, T₂ yuqori."
    },
    {
      name: "[PtCl\u2084]\u00B2\u207B — D\u2084h",
      desc: "Kvadrat-planar. d\u2078 metallar. XY tekisligida 4 ta Cl.",
      sym: "C\u2084, C\u2082, \u03C3\u2095, \u03C3\u1D65, \u03C3\u2091, i, S\u2084",
      h: 16, d: "d\u2078 (b\u2081g\u00B2 a\u2081g\u00B2 b\u2082g\u00B2 e_g\u2074)",
      color: "Pt\u00B2\u207A sariq",
      note: "Δ₀ eng katta — d\u2078 da past spin. Anti-kanser dorilar."
    },
    {
      name: "[Fe(CO)\u2085] — D\u2083h",
      desc: "Trigonal-bipiramida. 3 ekvatorial + 2 aksial CO.",
      sym: "C\u2083, C\u2082, \u03C3\u2095, \u03C3\u1D65, S\u2083",
      h: 12, d: "d\u2078 (e\u2032\u2074 e\u2033\u2074)",
      color: "Fe(0) sarg'ish",
      note: "2 xil ligand joylashuvi. Ekvatorial va aksial CO larning ν(CO) farqlanadi."
    },
    {
      name: "[VO(acac)\u2082] — C\u2084v",
      desc: "Kvadrat-piramida. V=O qisqa bog'. 4 ta acac ligand.",
      sym: "C\u2084, C\u2082, \u03C3\u1D65",
      h: 8, d: "d\u00B9 (bo'sh t\u2082g)",
      color: "V\u2074\u207A to'q sariq",
      note: "C\u2084v da inversiya yo'q. V=O valent tebranishi IQ da kuchli (~985 cm⁻¹)."
    },
    {
      name: "cis-[PtCl\u2082(NH\u2083)\u2082] — C\u2082v",
      desc: "cis-izomer. 2 ta NH\u2083 va 2 ta Cl bir tomonda.",
      sym: "C\u2082, \u03C3\u1D65",
      h: 4, d: "d\u2078",
      color: "Pt\u00B2\u207A oq",
      note: "C\u2082v eng past simmetriya. cis-platin — anti-kanser preparat."
    }
  ]

  const m = misollar[sel]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-blue-400">🧪</span> Amaliy misollar — molekulalar simmetriyasi
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-3">
        {misollar.map((m,i) => (
          <button key={i} onClick={()=>setSel(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${sel===i ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {m.name.split(" —")[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-2">
          <p className="text-yellow-300 font-bold text-sm">{m.name}</p>
          <p className="text-purple-200">{m.desc}</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-2 text-[10px] space-y-1">
            <p className="flex justify-between"><span className="text-purple-400">Simmetriya elementlari:</span><span className="text-cyan-300 font-mono">{m.sym}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">Guruh tartibi (h):</span><span className="text-yellow-300 font-mono">{m.h}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">Elektron konfiguratsiya:</span><span className="text-green-300 font-mono">{m.d}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">Rangi:</span><span className="text-pink-300">{m.color}</span></p>
          </div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-2">
          <p className="text-purple-400 font-bold">Simmetriya tahlili:</p>
          <p className="text-purple-200">{m.note}</p>
          <div className="bg-purple-950/90 border border-purple-700/30 rounded-lg p-2 mt-2 text-[10px]">
            <p className="text-purple-300">
              <strong className="text-yellow-400">3D vizual:</strong> Yuqoridagi 3D modelda {m.name.split(" —")[0]} geometriyasini 
              tanlab, uning simmetriya elementlarini (Cₙ o'qlari, σ tekisliklari) yoqib/o'chirib ko'ring.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. SIMMETRIYA VA FIZIK XOSSALAR
// ═══════════════════════════════════════════════════════════════════════════════
function FizikXossalar() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-orange-400">⚡</span> Simmetriya va fizik xossalar
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          {t:"Qutblilik", d:"Agar molekula dipol momentga ega bo'lsa, uning simmetriyasi barcha o'qlar bo'ylab qutblilikni saqlaydi. Inversiya markazi bo'lgan molekulalar (O\u2095, D\u2084h) dipol momentga ega emas.",
           ex:"[Co(NH\u2083)\u2086]\u00B3\u207A — dipol = 0. H\u2082O (C\u2082v) — dipol = 1.83 D"},
          {t:"Xirallik", d:"Agar molekulada Sₙ (aynali aylanish) bo'lmasa, u xiral bo'lishi mumkin. T\u2091 guruhida S₄ bor → xiral emas. C\u2083, D\u2083 — xiral bo'lishi mumkin.",
           ex:"Tris-xelat komplekslar (D\u2083) — optik faol. Oktaedrik — xiral emas."},
          {t:"IQ va Raman spektr", d:"Simmetriya elementlari IQ (dipol) va Raman (qutblanuvchanlik) faolligini belgilaydi. i bor → alternativ taqiq.",
           ex:"O\u2095: IQ da T₁u, Raman da A₁g+E_g+T₂g. T\u2091: T₂ — IQ va Raman."},
          {t:"Magnit xossalar", d:"Simmetriya d-orbital ajralishini belgilaydi → yuqori/past spin holatini aniqlaydi. O\u2095 da kichik Δ₀ → HS, katta Δ₀ → LS.",
           ex:"[CoF\u2086]\u00B3\u207B (O\u2095, kichik Δ₀) — HS d\u2076 (S=2). [Co(NH\u2083)\u2086]\u00B3\u207A — LS d\u2076 (S=0)."},
          {t:"Yorug'lik yutilishi", d:"d-d o'tishning ruxsat/taqiqligi simmetriyaga bog'liq. i bor (O\u2095, D\u2084h) → kuchsiz yutilish. i yo'q (T\u2091) → kuchli.",
           ex:"[CoCl\u2084]\u00B2\u207B (T\u2091) — intensiv ko'k. [Co(NH\u2083)\u2086]\u00B3\u207A (O\u2095) — sarg'ish."},
          {t:"Reaksiya tanlovchanligi", d:"Simmetriya — reaksiyalarning orbital nazoratida muhim. Termik reaksiyalarda simmetriya saqlanishi (Vudvord-Hoffman qoidasi).",
           ex:"π-sistema simmetriyasi → sikloadditsiya (π2s+π2a) ruxsat."},
        ].map((r,i) => (
          <div key={i} className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1.5">
            <p className="text-yellow-400 font-bold">{r.t}</p>
            <p className="text-purple-200 leading-relaxed">{r.d}</p>
            <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 text-[9px]">
              <p className="text-cyan-300">{r.ex}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. TEST — 10 SAVOL
// ═══════════════════════════════════════════════════════════════════════════════
function Test3D() {
  const questions = [
    { q:"O\u2095 nuqtali guruhining tartibi (h) nechaga teng?", a:"48", opts:["24","48","12","36"], hint:"h = |G| — guruhdagi barcha amallar soni. O\u2095 da 48 ta." },
    { q:"Qaysi geometriyada inversiya markazi YO'Q?", a:"T\u2091 — tetraedrik", opts:["O\u2095 — oktaedrik","T\u2091 — tetraedrik","D\u2084h — kvadrat planar","D\u2083h — trigonal bipiramida"], hint:"Tetraedrda markazda atom bor, lekin i yo'q." },
    { q:"Kvadrat-planar (D\u2084h) komplekslar qaysi metallar uchun xos?", a:"d\u2078 metallar", opts:["d\u2076 metallar","d\u2077 metallar","d\u2078 metallar","d\u00B9\u2070 metallar"], hint:"Ni²⁺, Pd²⁺, Pt²⁺ — d\u2078." },
    { q:"C\u2082v simmetriyasiga ega molekulaga misol?", a:"H\u2082O", opts:["CH\u2084","CO\u2082","H\u2082O","NH\u2083"], hint:"Burchakli molekula. C\u2082 o'qi + 2 ta \u03C3\u1D65." },
    { q:"Oktaedrik O\u2095 da nechta C\u2084 o'qi bor?", a:"3 ta", opts:["1 ta","2 ta","3 ta","4 ta"], hint:"X, Y, Z o'qlari bo'ylab. Har biri orqali C₄." },
    { q:"T\u2091 da T₂ IRREPS qanday bazis funksiyalarga ega?", a:"x, y, z (va xy, xz, yz)", opts:["x², y², z²","x, y, z (va xy, xz, yz)","faqat xy, xz, yz","faqat x, y, z"], hint:"T₂ — dipol moment operatori." },
    { q:"Qaysi geometriya eng yuqori simmetriyaga ega?", a:"O\u2095 — Oktaedrik (h=48)", opts:["T\u2091 (h=24)","O\u2095 (h=48)","D\u2084h (h=16)","D\u2083h (h=12)"], hint:"h eng katta. 48 ta simmetriya amali." },
    { q:"C\u2084v simmetriyasining D\u2084h dan farqi?", a:"C\u2084v da \u03C3\u2095 va i yo'q", opts:["C\u2084v da i bor","C\u2084v da \u03C3\u2095 va i yo'q","C\u2084v da C\u2084 yo'q","C\u2084v da C\u2083 bor"], hint:"Piramida — gorizontal tekislik yo'q." },
    { q:"3D modelda qizil rangli chiziqlar qanday simmetriya elementini bildiradi?", a:"C\u2084 — 4-tartibli aylanish o'qi", opts:["C\u2082 — 2-tartibli aylanish","C\u2083 — 3-tartibli aylanish","C\u2084 — 4-tartibli aylanish o'qi","\u03C3 — aks tekisligi"], hint:"Legendaga qarang. Qizil = C₄." },
    { q:"D\u2083h trigonal-bipiramida nechta ligandga ega?", a:"5 ta (3 ekvatorial + 2 aksial)", opts:["4 ta","5 ta (3 ekvatorial + 2 aksial)","6 ta","3 ta"], hint:"Trigonal + bipiramida = 3+2=5." },
  ]

  const [c, setC] = useState(0)
  const [s, setS] = useState(null)
  const [sc, setSc] = useState(0)
  const [res, setRes] = useState(false)
  const [ans, setAns] = useState({})
  const q = questions[c]

  if (res) {
    return (
      <div className="space-y-4">
        <h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">{sc >= 8 ? "🏆" : sc >= 5 ? "👍" : "📚"}</div>
          <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
          <p className="text-purple-300 text-xs mt-2">
            {sc >= 8 ? "3D simmetriyani mukammal o'zlashtirdingiz!" : sc >= 5 ? "Yaxshi, ammo takrorlash kerak." : "Qayta o'qib chiqing."}
          </p>
          <button onClick={() => { setC(0); setS(null); setSc(0); setRes(false); setAns({}) }}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">
            Qayta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg">📝 Bilim tekshirish — {c+1}/{questions.length}</h3>
      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-6">
        <p className="text-white font-bold text-base mb-4">{q.q}</p>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => !s && (() => {
              setS(opt)
              const ok = opt === q.a
              if (ok && !ans[c]) setSc(p => p + 1)
              setAns(p => ({...p, [c]: ok}))
            })()}
              className={`p-3 rounded-xl text-sm text-left border transition-all ${
                s === opt
                  ? (opt === q.a ? "bg-green-600/20 border-green-500 text-green-200" : "bg-red-600/20 border-red-500 text-red-200")
                  : s
                    ? (opt === q.a ? "bg-green-600/20 border-green-500 text-green-200 opacity-60" : "bg-purple-800/40 border-purple-700/40 text-purple-300 opacity-50")
                    : "bg-purple-800/40 border-purple-700/40 text-purple-200 hover:bg-purple-700/60"
              }`}>
              {opt}
            </button>
          ))}
        </div>
        {s && (
          <div className="space-y-2">
            <div className={`text-xs p-3 rounded-lg ${s === q.a ? "bg-green-600/10 border-green-500 text-green-300" : "bg-red-600/10 border-red-500 text-red-300"}`}>
              {s === q.a ? "✅ To'g'ri!" : "❌ Noto'g'ri"}
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-xs">
              <span className="text-yellow-400 font-bold">💡 </span>
              <span className="text-purple-200">{q.hint}</span>
            </div>
            <button onClick={() => { if (c < questions.length - 1) { setC(p => p + 1); setS(null) } else setRes(true) }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">
              {c < questions.length - 1 ? "Keyingi →" : "Natijalarni ko'rish"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function Simmetriya3D() {
  const [view, setView] = useState("all")

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/simmetriya" className="hover:text-purple-300">Simmetriya</Link><span className="text-purple-600">›</span>
            <span className="text-pink-400">3D vizualizatsiya</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-pink-400 flex items-center gap-2"><span>🔮</span> Simmetriya 3D vizualizatsiya</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">Oₕ • Tₕ • D₄h • D₃h • C₄v • C₂v — Interaktiv 3D model • Matritsalar • Test • OTM</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 3D simmetriya — vizual tahlil</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Simmetriya 3D vizualizatsiyasi</strong> — molekulalarning nuqtali 
                guruhlarini va ularning simmetriya elementlarini <strong className="text-cyan-300">interaktiv 3D model</strong> 
                orqali o'rganish. Three.js asosidagi real-time vizualizatsiya.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">6 geometriya</span>
                <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-2 py-0.5 rounded-full text-[10px]">3D Three.js</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-pink-400 font-bold">🎯 Maqsad:</span> Nuqtali guruhlarning 3D modelini interaktiv ko'rish, simmetriya elementlarini vizual tahlil qilish.</p>
              <p className="text-purple-300"><span className="text-pink-400 font-bold">⏱️ Vaqt:</span> ~3.5 soat</p>
              <p className="text-purple-300"><span className="text-pink-400 font-bold">📚 Manba:</span> F.A. Cotton — Chemical Applications of Group Theory; Three.js dokumentatsiyasi</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-pink-300 font-mono text-xs font-bold">Simmetriyani ko'rish — tushunishning eng tez usuli</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOMPONENTLAR */}
        <TreeDeVizualizator />
        <SimmetriyaElementlari />
        <TaqqoslashJadvali />
        <XarakterlarSnippet />
        <MatematikAsoslar />
        <AmaliyMisollar />
        <FizikXossalar />

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <Test3D />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">6 geometriya:</strong> Oₕ (h=48), Tₕ (h=24), D₄h (h=16), D₃h (h=12), C₄v (h=8), C₂v (h=4)</li>
            <li><strong className="text-yellow-400">Simmetriya elementi</strong> — molekula tuzilishini saqlaydigan geometrik o'zgartirish (Cₙ, σ, i, Sₙ)</li>
            <li>Eng yuqori simmetriya: <strong className="text-cyan-300">Oₕ</strong> (oktaedrik) — 48 ta amal, inversiya markazi bor</li>
            <li>Inversiya markazi bor (Oₕ, D₄h) → g/u simmetriyasi, alternativ taqiq. Yo'q (Tₕ, C₄v, C₂v) → g/u yo'q</li>
            <li><strong className="text-yellow-400">3×3 matritsalar</strong> barcha simmetriya amallarining matematik ifodasidir</li>
            <li>Simmetriya <strong className="text-yellow-400">fizik xossalarni</strong> belgilaydi: qutblilik, xirallik, IQ/Raman spektr, magnit xossalar</li>
            <li><strong className="text-yellow-400">3D modelda</strong> qizil=C₄, yashil=C₃, ko'k=C₂, sariq=σₕ, ko'kish=σᵥ, pushti=σₕ</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/simmetriya/elektron"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> Elektron tuzilish
          </Link>
          <Link href="/ilmiy/chuqurlashgan/simmetriya"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-pink-500/20">
            Simmetriya (bosh) <span>→</span>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manba:</strong> F.A. Cotton — Chemical Applications of Group Theory | Three.js — WebGL kutubxonasi</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  )
}