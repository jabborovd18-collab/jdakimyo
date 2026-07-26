"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. 3D MO DIAGRAMMA — ASOSIY THREE.JS VIZUALIZATSIYA
// ═══════════════════════════════════════════════════════════════════════════════
function MO3DVizual() {
  const containerRef = useRef(null)
  const [geoKey, setGeoKey] = useState("oh")
  const [showPi, setShowPi] = useState(false)
  const [autoRot, setAutoRot] = useState(true)
  const [showLines, setShowLines] = useState(true)

  const geoData = {
    oh: {
      name: "Oₕ — Oktaedrik", h: 48, ks: 6, dim: 4,
      ir: "A₁g + A₂g + E_g + T₁g + T₂g + A₁u + A₂u + E_u + T₁u + T₂u",
      metal: { s: "A₁g", p: "T₁u", d: "E_g + T₂g" },
      ligandSigma: "A₁g + E_g + T₁u", ligandPi: "T₁g + T₂g + T₁u + T₂u",
      mos: { bond: "a₁g, e_g, t₁u", nonbond: "t₂g", antibond: "e_g*, a₁g*, t₁u*" },
      note: "Eng yuqori simmetriya. t₂g orbitallari ligand σ bilan mos kelmaydi → bog'lanmaydi.",
      misol: "[Co(NH₃)₆]³⁺", mc: 0xFFD123, lc: 0x44AAFF
    },
    td: {
      name: "T_d — Tetraedrik", h: 24, ks: 4, dim: 3,
      ir: "A₁ + A₂ + E + T₁ + T₂",
      metal: { s: "A₁", p: "T₂", d: "E + T₂" },
      ligandSigma: "A₁ + T₂", ligandPi: "E + T₁ + T₂",
      mos: { bond: "a₁, t₂", nonbond: "e", antibond: "e*, t₂*, a₁*" },
      note: "T_d ≈ O. d-ajralish teskar: E (pastda) + T₂ (yuqorida). Inversiya markazi yo'q.",
      misol: "[CoCl₄]²⁻", mc: 0xFF8844, lc: 0x44FF44
    },
    d4h: {
      name: "D₄h — Kvadrat-planar", h: 16, ks: 4, dim: 4,
      ir: "A₁g + A₂g + B₁g + B₂g + E_g + A₁u + A₂u + B₁u + B₂u + E_u",
      metal: { s: "A₁g", p: "A₂u + E_u", d: "A₁g + B₁g + B₂g + E_g" },
      ligandSigma: "A₁g + B₁g + E_u",
      mos: { bond: "a₁g, b₁g, e_u", nonbond: "b₂g, e_g", antibond: "b₁g*, e_u*, a₁g*" },
      note: "d⁸ metallar (Pt²⁺, Pd²⁺, Ni²⁺). b₂g(d_xy) eng past, b₁g*(d_x²−y²) LUMO.",
      misol: "[PtCl₄]²⁻", mc: 0xC88033, lc: 0xFF6644
    },
    d3h: {
      name: "D₃h — Trigonal-bipiramida", h: 12, ks: 5, dim: 3,
      ir: "A₁′ + A₂′ + E′ + A₁″ + A₂″ + E″",
      metal: { s: "A₁′", p: "A₂″ + E′", d: "A₁′ + E′ + E″" },
      ligandSigma: "A₁′ + E′ + A₂′",
      mos: { bond: "a₁′, e′, a₁″", nonbond: "e″", antibond: "a₂″, e′*, a₁′*" },
      note: "3 ekvatorial (120°) + 2 aksial (90°). d⁷−d⁸ komplekslar.",
      misol: "[Fe(CO)₅]", mc: 0x44AA88, lc: 0xFFAA44
    },
    c4v: {
      name: "C₄v — Kvadrat-piramida", h: 8, ks: 5, dim: 3,
      ir: "A₁ + A₂ + B₁ + B₂ + E",
      metal: { s: "A₁", p: "A₁ + E", d: "A₁ + B₁ + B₂ + E" },
      ligandSigma: "A₁ + B₁ + E",
      mos: { bond: "a₁, b₁, e", nonbond: "b₂, e", antibond: "b₁*, a₁*, e*" },
      note: "σₕ va inversiya markazi yo'q. V=O kabi qisqa bog'li komplekslar.",
      misol: "[VO(acac)₂]", mc: 0xBB44CC, lc: 0x77DDFF
    },
    c2v: {
      name: "C₂v — Burchakli", h: 4, ks: 4, dim: 2,
      ir: "A₁ + A₂ + B₁ + B₂",
      metal: { s: "A₁", p: "A₁ + B₁ + B₂", d: "A₁ + A₂ + B₁ + B₂" },
      ligandSigma: "A₁ + B₁ + B₂",
      mos: { bond: "a₁, b₁, b₂", nonbond: "a₂", antibond: "a₁*, b₁*, b₂*" },
      note: "Eng past simmetriya. cis-izomerlar va H₂O tipidagi molekulalar.",
      misol: "cis-[PtCl₂(NH₃)₂]", mc: 0xDD6666, lc: 0x88FF88
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Sahna, kamera, renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(5.5, 4, 7.5)
    camera.lookAt(0, 0.2, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.autoRotate = autoRot
    controls.autoRotateSpeed = 0.5
    controls.minDistance = 2.5
    controls.maxDistance = 14

    // Yorug'lik
    scene.add(new THREE.AmbientLight(0x404080, 1.0))
    const light1 = new THREE.DirectionalLight(0xffffff, 1.8)
    light1.position.set(5, 8, 5)
    scene.add(light1)
    const light2 = new THREE.DirectionalLight(0xcc88ff, 0.5)
    light2.position.set(-3, -1, -4)
    scene.add(light2)

    // Grid
    const grid = new THREE.GridHelper(8, 16, 0x222244, 0x111122)
    grid.position.y = -3.2
    scene.add(grid)

    // Yulduzlar foni
    const starsGeo = new THREE.BufferGeometry()
    const starsPos = new Float32Array(150 * 3)
    for (let i = 0; i < 150 * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 16
      starsPos[i + 1] = (Math.random() - 0.5) * 10
      starsPos[i + 2] = (Math.random() - 0.5) * 16
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starsPos, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.015, transparent: true, opacity: 0.2 })))

    // Energiya o'qi
    const axisMat = new THREE.MeshBasicMaterial({ color: 0x8888ff, transparent: true, opacity: 0.2 })
    const axisCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 5.2, 8), axisMat)
    axisCyl.position.set(4.5, 0.4, 0)
    scene.add(axisCyl)
    const axisTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.07, 0.2, 8),
      new THREE.MeshBasicMaterial({ color: 0x8888ff, transparent: true, opacity: 0.3 })
    )
    axisTip.position.set(4.5, 3.0, 0)
    scene.add(axisTip)

    const gd = geoData[geoKey]

    // ========== METALL (chap) ==========
    const metalGroup = new THREE.Group()
    metalGroup.position.set(-2.5, 0.2, 0)

    const metalSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.33, 48, 48),
      new THREE.MeshStandardMaterial({ color: gd.mc, roughness: 0.15, metalness: 0.85, emissive: gd.mc, emissiveIntensity: 0.08 })
    )
    metalGroup.add(metalSphere)

    const metalGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 24, 24),
      new THREE.MeshBasicMaterial({ color: gd.mc, transparent: true, opacity: 0.1 })
    )
    metalGroup.add(metalGlow)

    // Metall energiya sathi
    const metalBar = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.04, 0.04),
      new THREE.MeshBasicMaterial({ color: gd.mc })
    )
    metalBar.position.y = -0.6
    metalGroup.add(metalBar)
    scene.add(metalGroup)

    // ========== LIGANDLAR (o'ng) ==========
    const ligandGroup = new THREE.Group()
    ligandGroup.position.set(2.5, 0.2, 0)

    let ligandPos = []
    if (geoKey === "oh") {
      ligandPos = [[0, 0.55, 0], [0, -0.55, 0], [0.55, 0, 0], [-0.55, 0, 0], [0, 0, 0.5], [0, 0, -0.5]]
    } else if (geoKey === "td") {
      ligandPos = [[0.5, 0.5, 0.5], [-0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [-0.5, 0.5, -0.5]]
    } else if (geoKey === "d4h") {
      ligandPos = [[0.55, 0, 0], [-0.55, 0, 0], [0, 0.55, 0], [0, -0.55, 0]]
    } else if (geoKey === "d3h") {
      ligandPos = [[0, 0.55, 0], [0, -0.55, 0], [0.5, 0.3, 0], [-0.5, 0.25, 0], [0, -0.25, 0.5]]
    } else if (geoKey === "c4v") {
      ligandPos = [[0.5, 0, 0], [-0.5, 0, 0], [0, 0.5, 0], [0, -0.5, 0], [0, 0, 0.65]]
    } else {
      ligandPos = [[0.5, 0, 0], [-0.5, 0, 0], [0, 0.45, 0.3], [0, -0.45, 0.3]]
    }

    ligandPos.forEach(([x, y, z]) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 24, 24),
        new THREE.MeshStandardMaterial({ color: gd.lc, roughness: 0.4, metalness: 0.15 })
      )
      sphere.position.set(x, y, z)
      ligandGroup.add(sphere)

      const dir = new THREE.Vector3(x, y, z)
      const len = dir.length()
      if (len > 0.01) {
        const mid = dir.clone().multiplyScalar(0.5)
        const bond = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, len, 8),
          new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.3 })
        )
        bond.position.copy(mid)
        bond.setRotationFromQuaternion(
          new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
        )
        ligandGroup.add(bond)
      }
    })

    const ligBar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.04), new THREE.MeshBasicMaterial({ color: gd.lc }))
    ligBar.position.y = -0.6
    ligandGroup.add(ligBar)
    scene.add(ligandGroup)

    // ========== MO SATHLARI (markaz) ==========
    const moGroup = new THREE.Group()

    const levels = showPi
      ? [
          { y: 1.6, w: 1.4, c: 0x22c55e, label: "π-bog'lovchi", op: 0.55 },
          { y: 1.0, w: 1.8, c: 0x22c55e, label: "σ-bog'lovchi (a₁g+e_g+t₁u)", op: 0.7 },
          { y: 0.0, w: 0.8, c: 0xa855f7, label: "t₂g↓ (π-akseptor)", op: 0.7 },
          { y: -0.7, w: 1.2, c: 0xef4444, label: "e_g* (bo'shashtiruvchi)", op: 0.7 },
          { y: -1.3, w: 1.4, c: 0xef4444, label: "a₁g*+t₁u* (bo'sh)", op: 0.45 },
        ]
      : [
          { y: 1.2, w: 2.0, c: 0x22c55e, label: "σ-bog'lovchi (a₁g+e_g+t₁u)", op: 0.75 },
          { y: 0.3, w: 1.0, c: 0xa855f7, label: "t₂g (bog'lamaydigan)", op: 0.75 },
          { y: -0.4, w: 1.0, c: 0xef4444, label: "e_g* (bo'shashtiruvchi)", op: 0.75 },
          { y: -1.2, w: 1.4, c: 0xef4444, label: "a₁g*+t₁u* (bo'sh)", op: 0.45 },
        ]

    levels.forEach(lv => {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(lv.w, 0.10, 0.3),
        new THREE.MeshStandardMaterial({ color: lv.c, roughness: 0.4, metalness: 0.15, transparent: true, opacity: lv.op })
      )
      panel.position.set(0, lv.y, 0)
      moGroup.add(panel)
    })

    // Δ₀ strelkasi (sariq)
    const deltaY1 = showPi ? 0.0 : 0.3
    const deltaY2 = showPi ? -0.7 : -0.4
    const deltaMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.55 })

    const deltaLine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, Math.abs(deltaY1 - deltaY2), 8), deltaMat
    )
    deltaLine.position.set(1.5, (deltaY1 + deltaY2) / 2, 0)
    deltaLine.rotation.z = Math.PI / 2
    moGroup.add(deltaLine)

    const dHead1 = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 8), deltaMat)
    dHead1.position.set(1.5, deltaY1, 0)
    dHead1.rotation.z = -Math.PI / 2
    moGroup.add(dHead1)

    const dHead2 = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 8), deltaMat)
    dHead2.position.set(1.5, deltaY2, 0)
    dHead2.rotation.z = Math.PI / 2
    moGroup.add(dHead2)

    scene.add(moGroup)

    // Bog'lanish chiziqlari (metall ↔ MO, ligand ↔ MO)
    if (showLines) {
      const connMat = new THREE.LineDashedMaterial({
        color: 0x446688, dashSize: 0.08, gapSize: 0.08, transparent: true, opacity: 0.12
      })

      const pairs = showPi
        ? [
            { from: [-1.3, -0.4, 0], to: [0, 1.6, 0] },
            { from: [-1.3, -0.4, 0], to: [0, 1.0, 0] },
            { from: [-1.3, -0.4, 0], to: [0, 0.0, 0] },
            { from: [1.3, -0.4, 0], to: [0, 1.6, 0] },
            { from: [1.3, -0.4, 0], to: [0, 1.0, 0] },
            { from: [1.3, -0.4, 0], to: [0, -0.7, 0] },
          ]
        : [
            { from: [-1.3, -0.4, 0], to: [0, 1.2, 0] },
            { from: [-1.3, -0.4, 0], to: [0, 0.3, 0] },
            { from: [-1.3, -0.4, 0], to: [0, -0.4, 0] },
            { from: [1.3, -0.4, 0], to: [0, 1.2, 0] },
            { from: [1.3, -0.4, 0], to: [0, -0.4, 0] },
          ]

      pairs.forEach(pair => {
        const points = [new THREE.Vector3(...pair.from), new THREE.Vector3(...pair.to)]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(geometry, connMat)
        line.computeLineDistances()
        scene.add(line)
      })
    }

    // Animatsiya
    let frameId
    function animate() {
      frameId = requestAnimationFrame(animate)
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

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(frameId); container.removeChild(renderer.domElement); renderer.dispose()
    }
  }, [geoKey, showPi, autoRot, showLines])

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-orange-400">🎯</span> 3D MO diagramma — Three.js interaktiv model
      </h3>

      {/* Geometriya tanlash */}
      <div className="flex gap-1 flex-wrap mb-2">
        {Object.entries(geoData).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setGeoKey(key)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
              geoKey === key
                ? "text-white border"
                : "bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"
            }`}
            style={geoKey === key ? {
              background: "#" + val.mc.toString(16).padStart(6, "0") + "66",
              borderColor: "#ffffff88"
            } : {}}
          >
            {val.name.split(" —")[0]}
          </button>
        ))}
      </div>

      {/* Toggle tugmalari */}
      <div className="flex gap-1 flex-wrap mb-2">
        <button onClick={() => setShowPi(false)}
          className={`px-2 py-0.5 rounded-lg text-[8px] font-bold ${!showPi ? "bg-purple-600/50 text-white" : "bg-purple-800/30 text-purple-400"}`}>
          σ-only
        </button>
        <button onClick={() => setShowPi(true)}
          className={`px-2 py-0.5 rounded-lg text-[8px] font-bold ${showPi ? "bg-purple-600/50 text-white" : "bg-purple-800/30 text-purple-400"}`}>
          σ + π
        </button>
        <button onClick={() => setAutoRot(!autoRot)}
          className={`px-2 py-0.5 rounded-lg text-[8px] font-bold ${autoRot ? "bg-purple-600/50 text-white" : "bg-purple-800/30 text-purple-400"}`}>
          {autoRot ? "Aylanish ON" : "Aylanish OFF"}
        </button>
        <button onClick={() => setShowLines(!showLines)}
          className={`px-2 py-0.5 rounded-lg text-[8px] font-bold ${showLines ? "bg-purple-600/50 text-white" : "bg-purple-800/30 text-purple-400"}`}>
          {showLines ? "Bog'lar ON" : "Bog'lar OFF"}
        </button>
      </div>

      {/* 3D viewport */}
      <div ref={containerRef} className="w-full h-64 sm:h-80 rounded-xl border border-purple-700/40" />

      {/* Ma'lumot paneli */}
      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-[10px] mt-2">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <span className="text-yellow-300 font-bold">{geoData[geoKey].name}</span>
          <span className="text-purple-400">h = {geoData[geoKey].h}</span>
          <span className="text-cyan-300">IRREPS: {geoData[geoKey].ir.length} ta</span>
          <span className="text-green-300">Misol: {geoData[geoKey].misol}</span>
        </div>
        <p className="text-purple-300 mt-1">{geoData[geoKey].note}</p>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-2 mt-1 pt-1 border-t border-purple-800/30 text-[8px]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ background: "#" + geoData[geoKey].mc.toString(16).padStart(6, "0") }}></div>
          <span className="text-purple-300">Metall</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ background: "#" + geoData[geoKey].lc.toString(16).padStart(6, "0") }}></div>
          <span className="text-purple-300">Ligand</span>
        </div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500/70 rounded"></div><span className="text-purple-300">Bog'lovchi</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500/70 rounded"></div><span className="text-purple-300">t₂g</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500/70 rounded"></div><span className="text-purple-300">Bo'shash.</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-yellow-400"></div><span className="text-purple-300">Δ₀</span></div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. SIMMETRIYA VA IRREPS TAHLLILI (Oₕ, T_d, D₄h)
// ═══════════════════════════════════════════════════════════════════════════════
function IrrepsTahlili() {
  const [geo, setGeo] = useState("oh")
  const data = {
    oh: {
      name: "Oₕ", note: "6 ta σ-SALC: A₁g + E_g + T₁u. t₂g orbitallari (d_xy, d_xz, d_yz) ligand σ bilan mos kelmaydi.",
      rows: [
        { ir: "A₁g", dim: 1, basis: "s, x²+y²+z²", salc: "σ₁+σ₂+σ₃+σ₄+σ₅+σ₆", mo: "σ bog'lovchi", en: "Eng past" },
        { ir: "A₂g", dim: 1, basis: "—", salc: "—", mo: "—", en: "—" },
        { ir: "E_g", dim: 2, basis: "(2z²−x²−y², x²−y²)", salc: "σ₁−σ₂, σ₃−σ₄", mo: "σ bog'lovchi", en: "O'rtacha" },
        { ir: "T₁g", dim: 3, basis: "(R_x, R_y, R_z)", salc: "—", mo: "—", en: "—" },
        { ir: "T₂g", dim: 3, basis: "(xy, xz, yz)", salc: "— (mos emas)", mo: "n (bog'lamaydigan)", en: "Oraliq" },
        { ir: "T₁u", dim: 3, basis: "(x, y, z)", salc: "σ₅−σ₆ va b.", mo: "σ bog'lovchi", en: "Past" },
      ]
    },
    td: {
      name: "T_d", note: "4 ta σ-SALC: A₁ + T₂. d-ajralish teskari: E (past) + T₂ (yuqori).",
      rows: [
        { ir: "A₁", dim: 1, basis: "x²+y²+z²", salc: "σ₁+σ₂+σ₃+σ₄", mo: "σ bog'lovchi", en: "Eng past" },
        { ir: "A₂", dim: 1, basis: "—", salc: "—", mo: "—", en: "—" },
        { ir: "E", dim: 2, basis: "(2z²−x²−y², x²−y²)", salc: "—", mo: "n (bog'lamaydigan)", en: "Oraliq" },
        { ir: "T₁", dim: 3, basis: "(R_x, R_y, R_z)", salc: "π", mo: "π bog'lovchi", en: "O'rtacha" },
        { ir: "T₂", dim: 3, basis: "(x, y, z); (xy, xz, yz)", salc: "3 ta SALC", mo: "σ + π", en: "Past / Yuqori" },
      ]
    },
    d4h: {
      name: "D₄h", note: "4 ta σ-SALC: A₁g + B₁g + E_u. b₂g va e_g — bog'lamaydigan.",
      rows: [
        { ir: "A₁g", dim: 1, basis: "z²", salc: "σ₁+σ₂+σ₃+σ₄", mo: "σ", en: "Eng past" },
        { ir: "B₁g", dim: 1, basis: "x²−y²", salc: "σ₁−σ₂+σ₃−σ₄", mo: "σ", en: "Past" },
        { ir: "B₂g", dim: 1, basis: "xy", salc: "—", mo: "n", en: "Oraliq" },
        { ir: "E_g", dim: 2, basis: "(xz, yz)", salc: "—", mo: "n", en: "Oraliq" },
        { ir: "A₂u", dim: 1, basis: "z", salc: "—", mo: "π", en: "O'rtacha" },
        { ir: "E_u", dim: 2, basis: "(x, y)", salc: "2 ta SALC", mo: "σ", en: "Past" },
      ]
    }
  }
  const d = data[geo] || data.oh

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-violet-400">🔬</span> Simmetriya va IRREPS tahlili
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {["oh", "td", "d4h"].map(key => (
          <button key={key} onClick={() => setGeo(key)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${geo === key ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
            {data[key].name}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[7px] sm:text-[10px]">
          <thead>
            <tr className="bg-purple-800/70">
              <th className="p-1 text-left text-amber-400">IRREPS</th>
              <th className="p-1 text-center text-purple-200">dim</th>
              <th className="p-1 text-left text-purple-200">Bazis funksiya</th>
              <th className="p-1 text-left text-purple-200">Ligand SALC</th>
              <th className="p-1 text-left text-purple-200">MO turi</th>
              <th className="p-1 text-center text-purple-200">Energiya</th>
            </tr>
          </thead>
          <tbody>
            {d.rows.map((r, i) => (
              <tr key={i} className={`border-t border-purple-800/30 ${i % 2 === 0 ? "bg-purple-900/20" : "bg-purple-950/20"} hover:bg-purple-800/30`}>
                <td className="p-1 font-mono font-bold text-cyan-300">{r.ir}</td>
                <td className="p-1 text-center text-purple-400">{r.dim}</td>
                <td className="p-1 text-purple-200 text-[6px] sm:text-[9px]">{r.basis}</td>
                <td className="p-1 text-purple-200 text-[6px] sm:text-[8px] font-mono">{r.salc}</td>
                <td className="p-1 text-purple-200 text-[6px] sm:text-[9px]">{r.mo}</td>
                <td className="p-1 text-center text-purple-300">{r.en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[9px] mt-3">
        <p className="text-yellow-400 font-bold">💡 </p>
        <p className="text-purple-200">{d.note}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. MATEMATIK ASOSLAR
// ═══════════════════════════════════════════════════════════════════════════════
function MatematikAsoslar3D() {
  const [tab, setTab] = useState("secular")
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-rose-400">📐</span> MO matematik asoslari
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {[
          { k: "secular", l: "Sekulyar tenglama" },
          { k: "delta", l: "Δ₀ va d-ajralish" },
          { k: "salc", l: "SALC qurish" },
          { k: "tanlash", l: "IQ/Raman/d-d" },
        ].map(v => (
          <button key={v.k} onClick={() => setTab(v.k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${tab === v.k ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
            {v.l}
          </button>
        ))}
      </div>
      <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-4 text-xs font-mono">
        {tab === "secular" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Sekulyar tenglama (MO energiyasini hisoblash):</p>
            <p className="text-cyan-300 text-center my-2 text-sm">det |H − E·S| = 0</p>
            <p className="text-purple-200">Ikki atomli sistema (A va B) uchun 2 × 2 determinant:</p>
            <p className="text-cyan-300 text-center text-sm">| (α − E) &nbsp;&nbsp; β | = (α − E)² − β² = 0</p>
            <p className="text-cyan-300 text-center text-sm">| &nbsp; β &nbsp;&nbsp; (α − E) |</p>
            <p className="text-purple-200 mt-2">Yechimlar:</p>
            <p className="text-purple-200">E₁ = α + β → <strong className="text-green-300">bog'lovchi MO</strong> (energiya past)</p>
            <p className="text-purple-200">E₂ = α − β → <strong className="text-red-300">bo'shashtiruvchi MO</strong> (energiya yuqori)</p>
            <p className="text-purple-200 mt-2"><strong className="text-green-300">α</strong> = ∫ ψ_A* · H · ψ_A dτ — koulomb integrali (~−10 eV)</p>
            <p className="text-purple-200"><strong className="text-blue-300">β</strong> = ∫ ψ_A* · H · ψ_B dτ — rezonans integrali (~−1 to −3 eV)</p>
            <p className="text-purple-200">|β| ∝ S (qoplanish) — katta β → kuchli bog'</p>
          </div>
        )}
        {tab === "delta" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Δ₀ = E(e_g*) − E(t₂g):</p>
            <p className="text-purple-200">Oₕ simmetriyasida d-orbital ajralishi (kristall maydon nazariyasi):</p>
            <p className="text-purple-200">E(t₂g) = α_d − 0.4Δ₀ (3 ta orbital, stabillashgan)</p>
            <p className="text-purple-200">E(e_g*) = α_d + 0.6Δ₀ (2 ta orbital, destabillashgan)</p>
            <p className="text-purple-200 mt-2"><strong className="text-cyan-300">Δ₀ ni o'zgartiruvchi omillar:</strong></p>
            <p className="text-purple-200">1. <strong className="text-yellow-300">Geometriya:</strong> Oₕ (1.0) {">"} D₄h (~0.85Δ₀) {">"} T_d (~0.44Δ₀)</p>
            <p className="text-purple-200">2. <strong className="text-yellow-300">Ligand:</strong> π-akseptor (CO) {">"} σ-donor (NH₃) {">"} π-donor (Cl⁻)</p>
            <p className="text-purple-200">3. <strong className="text-yellow-300">Metall:</strong> 5d (≈1.75×) {">"} 4d (≈1.45×) {">"} 3d (1.0×)</p>
            <p className="text-purple-200 mt-1">Δ₀(T_d) = (4/9)Δ₀(Oₕ) — geometrik munosabat</p>
          </div>
        )}
        {tab === "salc" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">SALC — simmetriya moslashtirilgan chiziqli kombinatsiya:</p>
            <p className="text-cyan-300 text-center my-2 text-sm">P^Γ = (d_Γ / h) · Σ χ_Γ(R) · R</p>
            <p className="text-purple-200">Proyeksion operator yordamida Oₕ uchun 6 ta σ-SALC:</p>
            <p className="text-purple-200"><strong className="text-green-300">A₁g:</strong> ψ₁ = (1/√6)(σ₁+σ₂+σ₃+σ₄+σ₅+σ₆)</p>
            <p className="text-purple-200"><strong className="text-cyan-300">E_g:</strong> ψ₂ = (1/2)(σ₁−σ₂); ψ₃ = (1/2)(σ₃−σ₄)</p>
            <p className="text-purple-200"><strong className="text-blue-300">T₁u:</strong> ψ₄ = (1/√2)(σ₅−σ₆); ψ₅ = (1/√2)(σ₁−σ₂); ψ₆ = (1/√2)(σ₃−σ₄)</p>
            <p className="text-purple-200 mt-2">Normalizatsiya: ∫ ψ_i* · ψ_j dτ = δ_ij (ortonormallik)</p>
            <p className="text-purple-200">Faqat <strong>bir xil IRREPS</strong> ga mansub SALC va metall AO o'zaro ta'sirlashadi</p>
          </div>
        )}
        {tab === "tanlash" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Spektroskopik tanlash qoidalari:</p>
            <p className="text-purple-200"><strong className="text-green-300">IQ faollik:</strong> Tebranish Γ_teb ⊗ Γ_dipol = Γ_teb ⊗ Γ{'{'}x,y,z{'}'}</p>
            <p className="text-purple-200">Oₕ da Γ_dipol = T₁u → faqat T₁u modlar IQ faol</p>
            <p className="text-purple-200"><strong className="text-blue-300">Raman faollik:</strong> Tebranish ⊗ Γ_qutbl = Γ_teb ⊗ Γ{'{'}x²+y², ...{'}'}</p>
            <p className="text-purple-200">Oₕ da Γ_qutbl = A₁g + E_g + T₂g → shu IRREPS lar Raman faol</p>
            <p className="text-purple-200 mt-2"><strong className="text-yellow-300">d-d o'tish (Laport qoidasi):</strong></p>
            <p className="text-purple-200">Inversiya markazi bor (Oₕ, D₄h) → g → g taqiqlangan (kuchsiz, ε≈1-100)</p>
            <p className="text-purple-200">Inversiya markazi yo'q (T_d, C₄v, C₂v) → d-d o'tish ruxsat (kuchli, ε≈100-1000)</p>
            <p className="text-purple-200"><strong className="text-yellow-300">Spin qoidasi:</strong> ΔS = 0 (spin saqlanishi)</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. XARAKTERLAR JADVALI
// ═══════════════════════════════════════════════════════════════════════════════
function XarakterlarJadvali() {
  const [geo, setGeo] = useState("oh")
  const tables = {
    oh: {
      title: "Oₕ (h = 48)", hd: ["Oₕ", "E", "8C₃", "6C₂", "6C₄", "3C₂′", "i", "6S₄", "8S₆", "3σₕ", "6σ_d"],
      rows: [
        { ir: "A₁g", c: "1,1,1,1,1,1,1,1,1,1", b: "x²+y²+z²" },
        { ir: "A₂g", c: "1,1,−1,−1,1,1,1,−1,1,−1", b: "—" },
        { ir: "E_g", c: "2,−1,0,0,2,2,0,−1,2,0", b: "(2z²−x²−y², x²−y²)" },
        { ir: "T₁g", c: "3,0,−1,1,−1,3,1,0,−1,−1", b: "(R_x, R_y, R_z)" },
        { ir: "T₂g", c: "3,0,1,−1,−1,3,−1,0,−1,1", b: "(xy, xz, yz)" },
        { ir: "T₁u", c: "3,0,−1,1,−1,−3,−1,0,1,1", b: "(x, y, z)" },
      ],
      note: "Γ_dipol = T₁u (IQ). Γ_qutbl = A₁g + E_g + T₂g (Raman)."
    },
    td: {
      title: "T_d (h = 24)", hd: ["T_d", "E", "8C₃", "3C₂", "6S₄", "6σ_d"],
      rows: [
        { ir: "A₁", c: "1,1,1,1,1", b: "x²+y²+z²" },
        { ir: "A₂", c: "1,1,1,−1,−1", b: "—" },
        { ir: "E", c: "2,−1,2,0,0", b: "(2z²−x²−y², x²−y²)" },
        { ir: "T₁", c: "3,0,−1,1,−1", b: "(R_x, R_y, R_z)" },
        { ir: "T₂", c: "3,0,−1,−1,1", b: "(x, y, z); (xy, xz, yz)" },
      ],
      note: "T_d ≈ O. Γ_dipol = T₂ (IQ + Raman). Inversiya yo'q."
    },
    d4h: {
      title: "D₄h (h = 16)", hd: ["D₄h", "E", "2C₄", "C₂", "2C₂′", "2C₂″", "i", "2S₄", "σₕ", "2σ_v", "2σ_d"],
      rows: [
        { ir: "A₁g", c: "1,1,1,1,1,1,1,1,1,1", b: "z²" },
        { ir: "B₁g", c: "1,−1,1,1,−1,1,−1,1,1,−1", b: "x²−y²" },
        { ir: "B₂g", c: "1,−1,1,−1,1,1,−1,1,−1,1", b: "xy" },
        { ir: "E_g", c: "2,0,−2,0,0,2,0,−2,0,0", b: "(xz, yz)" },
        { ir: "A₂u", c: "1,1,1,−1,−1,−1,−1,−1,1,1", b: "z" },
        { ir: "E_u", c: "2,0,−2,0,0,−2,0,2,0,0", b: "(x, y)" },
      ],
      note: "A₁g, B₁g, B₂g, E_g → Raman. A₂u, E_u → IQ."
    }
  }
  const d = tables[geo] || tables.oh

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">📜</span> Xarakterlar jadvali
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {Object.entries(tables).map(([k, v]) => (
          <button key={k} onClick={() => setGeo(k)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${geo === k ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
            {v.title}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[6px] sm:text-[8px] font-mono">
          <thead>
            <tr className="bg-purple-800/70">
              {d.hd.map((h, i) => (
                <th key={i} className="p-0.5 text-center text-purple-200">{h}</th>
              ))}
              <th className="p-0.5 text-left text-purple-200">Bazis</th>
            </tr>
          </thead>
          <tbody>
            {d.rows.map((row, i) => (
              <tr key={i} className={`border-t border-purple-800/30 ${i % 2 === 0 ? "bg-purple-900/20" : "bg-purple-950/20"} hover:bg-purple-800/30`}>
                <td className="p-0.5 text-center text-amber-400 font-bold">{row.ir}</td>
                {row.c.split(",").map((v, j) => (
                  <td key={j} className="p-0.5 text-center text-purple-300">{v.trim()}</td>
                ))}
                <td className="p-0.5 text-purple-200 text-[5px] sm:text-[7px]">{row.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[9px] mt-3">
        <p className="text-yellow-400 font-bold">💡 </p>
        <p className="text-purple-200">{d.note}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. BOG' TARTIBI HISOBLAGICI
// ═══════════════════════════════════════════════════════════════════════════════
function BogTartibiHisoblagich() {
  const [sel, setSel] = useState(0)
  const data = [
    { n: "[Co(NH₃)₆]³⁺", g: "Oₕ", me: 6, le: 12, t: 18, bo: "(12−0)/2 = 6", bov: 6, h: "t₂g⁶", ec: "d⁶ LS", st: true },
    { n: "[Fe(CN)₆]⁴⁻", g: "Oₕ", me: 6, le: 12, t: 18, bo: "(12−0)/2 = 6", bov: 6, h: "t₂g⁶", ec: "d⁶ LS", st: true },
    { n: "[Fe(H₂O)₆]²⁺", g: "Oₕ", me: 6, le: 12, t: 18, bo: "(12−0)/2 = 6", bov: 6, h: "t₂g⁴ e_g²", ec: "d⁶ HS", st: true },
    { n: "[CoCl₄]²⁻", g: "T_d", me: 7, le: 8, t: 15, bo: "(8−1)/2 = 3.5", bov: 3.5, h: "e⁴ t₂³", ec: "d⁷ HS", st: false },
    { n: "[Ni(CO)₄]", g: "T_d", me: 10, le: 8, t: 18, bo: "(8−0)/2 = 4", bov: 4, h: "t₂⁶ e⁴", ec: "d¹⁰", st: true },
    { n: "[PtCl₄]²⁻", g: "D₄h", me: 8, le: 8, t: 16, bo: "(8−0)/2 = 4", bov: 4, h: "b₂g²", ec: "d⁸", st: true },
  ]
  const c = data[sel]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-indigo-400">📊</span> Bog' tartibi (BO) va MO konfiguratsiyasi
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {data.map((d, i) => (
          <button key={i} onClick={() => setSel(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${sel === i ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
            {d.n}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-yellow-300 font-bold">{c.n} ({c.g})</p>
          <div className="flex justify-between"><span className="text-purple-400">Metall e⁻:</span><span className="text-cyan-300 font-mono">{c.me}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Ligand e⁻:</span><span className="text-green-300 font-mono">{c.le}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Jami:</span><span className={(c.t) === 18 ? "text-green-300 font-mono font-bold" : "text-orange-300 font-mono font-bold"}>{c.t} e⁻</span></div>
          <div className="flex justify-between border-t border-purple-700/30 pt-1"><span className="text-purple-400 font-bold">BO:</span><span className="text-yellow-300 font-mono font-bold">BO = {c.bo} = {c.bov}</span></div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-purple-400 font-bold">MO konfiguratsiyasi:</p>
          <p className="text-purple-200">HOMO: <span className="text-green-300 font-mono">{c.h}</span></p>
          <p className="text-purple-200">Elektron konfiguratsiya: {c.ec}</p>
          <p className="text-purple-200">Barqarorlik: {c.st ? "✅ Barqaror" : "⚠️ 15 e⁻ (toq elektron)"}</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. GEOMETRIYALARNI TAQQOSLASH
// ═══════════════════════════════════════════════════════════════════════════════
function GeometriyaTaqqoslash() {
  const [hl, setHl] = useState(null)
  const rows = [
    { g: "Oₕ — Oktaedrik", h: 48, ks: 6, dAjr: "t₂g (3) + e_g* (2)", delta: "10400−35000", nis: "10 Dq", izoh: "Eng katta Δ₀. 6 ligand." },
    { g: "T_d — Tetraedrik", h: 24, ks: 4, dAjr: "e (2) + t₂ (3) — teskari", delta: "3000−8000", nis: "0.44Δ₀(Oh)", izoh: "Teskari ajralish. i yo'q." },
    { g: "D₄h — Kv. planar", h: 16, ks: 4, dAjr: "b₂g + e_g + a₁g + b₁g", delta: "15000−25000", nis: "~1.7Δ₀(Oh)", izoh: "d⁸ da b₁g* LUMO." },
    { g: "D₃h — Trig. bipir.", h: 12, ks: 5, dAjr: "e′ + e″ (2+2)", delta: "8000−15000", nis: "~0.7Δ₀(Oh)", izoh: "5 ligand. 2 xil joy." },
    { g: "C₄v — Kv. piramida", h: 8, ks: 5, dAjr: "b₂ + e + a₁ + b₁", delta: "—", nis: "—", izoh: "σₕ yo'q. i yo'q." },
    { g: "C₂v — Burchakli", h: 4, ks: 4, dAjr: "a₁ + a₂ + b₁ + b₂", delta: "—", nis: "—", izoh: "Eng past simmetriya." },
  ]
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">📊</span> Geometriyalarni Δ₀ va d-ajralish bo'yicha taqqoslash
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[8px] sm:text-[10px]">
          <thead><tr className="bg-purple-800/70">
            <th className="p-1 text-left text-amber-400">Geometriya</th>
            <th className="p-1 text-center text-purple-200">h</th>
            <th className="p-1 text-center text-purple-200">KS</th>
            <th className="p-1 text-left text-purple-200">d-ajralish</th>
            <th className="p-1 text-center text-purple-200">Δ₀ (cm⁻¹)</th>
            <th className="p-1 text-center text-purple-200">Nisbiy</th>
            <th className="p-1 text-left text-purple-200 hidden md:table-cell">Izoh</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} onMouseEnter={() => setHl(i)} onMouseLeave={() => setHl(null)}
                className={`border-t border-purple-800/30 cursor-pointer transition-all ${i % 2 === 0 ? "bg-purple-900/20" : "bg-purple-950/20"} ${hl === i ? "bg-purple-700/40" : "hover:bg-purple-800/30"}`}>
                <td className={`p-1 font-bold font-mono ${hl === i ? "text-pink-300" : "text-yellow-300"}`}>{r.g}</td>
                <td className="p-1 text-center text-purple-400">{r.h}</td>
                <td className="p-1 text-center text-white font-bold">{r.ks}</td>
                <td className="p-1 text-purple-200">{r.dAjr}</td>
                <td className="p-1 text-center text-green-300 font-mono">{r.delta}</td>
                <td className="p-1 text-center text-cyan-300 font-mono">{r.nis}</td>
                <td className="p-1 text-purple-300 text-[7px] hidden md:table-cell">{r.izoh}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hl !== null && (
        <div className="bg-purple-950/80 border border-purple-600/50 rounded-lg p-2 text-[10px] mt-2">
          <p className="text-yellow-400 font-bold">{rows[hl].g}</p>
          <p className="text-purple-200">Koordinatsion son: {rows[hl].ks} | Tartib: h = {rows[hl].h} | {rows[hl].izoh}</p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. AMALIY MISOLLAR
// ═══════════════════════════════════════════════════════════════════════════════
function AmaliyMisollar() {
  const [sel, setSel] = useState(0)
  const misollar = [
    { n: "[Co(NH₃)₆]³⁺", g: "Oₕ", d: "d⁶ LS", de: "23000", h: "t₂g⁶", l: "e_g*", s: "S=0", r: "Sariq", e: "18", t: "¹A₁g → ¹T₁g (λ≈435 nm). NH₃ σ-donor. 18 e⁻. Diamagnit." },
    { n: "[Fe(CN)₆]⁴⁻", g: "Oₕ", d: "d⁶ LS", de: "35000", h: "t₂g⁶", l: "e_g*", s: "S=0", r: "Sariq", e: "18", t: "CN⁻ π-akseptor. t₂g↓ → Δ₀ katta. LS. Diamagnit." },
    { n: "[Fe(H₂O)₆]²⁺", g: "Oₕ", d: "d⁶ HS", de: "10400", h: "t₂g⁴ e_g²", l: "e_g*", s: "S=2", r: "Yashil", e: "18", t: "H₂O kuchsiz. ⁵T₂g → ⁵E_g. μ≈4.9 μ_B. Paramagnit." },
    { n: "[CoCl₄]²⁻", g: "T_d", d: "d⁷ HS", de: "~3000", h: "e⁴ t₂³", l: "t₂*", s: "S=3/2", r: "Ko'k", e: "15", t: "Cl⁻ π-donor. ⁴A₂ → ⁴T₁(P). Intensiv d-d. 15 e⁻." },
    { n: "[Ni(CO)₄]", g: "T_d", d: "d¹⁰", de: "0", h: "t₂⁶ e⁴", l: "t₂*", s: "S=0", r: "Rangsiz", e: "18", t: "Ni(0) d¹⁰. CO π-akseptor. 18 e⁻. Tetraedrik." },
    { n: "[PtCl₄]²⁻", g: "D₄h", d: "d⁸", de: "~20000", h: "b₂g", l: "b₁g*", s: "S=0", r: "Sariq", e: "16", t: "16 e⁻. Kv. planar d⁸. b₁g* LUMO. Anti-kanser." },
    { n: "[Fe(CO)₅]", g: "D₃h", d: "d⁸", de: "—", h: "e′⁴ e″⁴", l: "a₁′*", s: "S=0", r: "Sarg'ish", e: "18", t: "5 ta CO. Trig. bipiramida. 2 xil ν(CO)." },
    { n: "[VO(acac)₂]", g: "C₄v", d: "d¹", de: "—", h: "d_xy¹", l: "d_xz, d_yz", s: "S=1/2", r: "Ko'k", e: "11", t: "V⁴⁺ d¹. Kv. piramida. 1 juftlanmagan e⁻." },
  ]
  const c = misollar[sel]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-green-400">🧪</span> Amaliy misollar — MO bo'yicha kompleks tahlili
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {misollar.map((m, i) => (
          <button key={i} onClick={() => setSel(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${sel === i ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
            {m.n}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-yellow-300 font-bold">{c.n} ({c.g})</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-2 space-y-1">
            <div className="flex justify-between"><span className="text-purple-400">Konfiguratsiya:</span><span className="text-cyan-300 font-mono">{c.d}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">HOMO / LUMO:</span><span className="text-green-300 font-mono">{c.h} → {c.l}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Δ₀:</span><span className="text-yellow-300 font-mono">{c.de} cm⁻¹</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Elektronlar:</span><span className={c.e === "18" ? "text-green-300 font-bold" : "text-orange-300 font-bold"}>{c.e} e⁻</span></div>
          </div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3">
          <p className="text-purple-400 font-bold">MO tahlili:</p>
          <p className="text-purple-200">{c.t}</p>
          <p className="text-purple-300 mt-1">3D modelda {c.g} geometriyasini tanlab, MO sathlarini vizual ko'ring.</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function MODiagramma3D() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="hover:text-purple-300">Bog'lanish</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-diagramma" className="hover:text-purple-300">MO</Link><span className="text-purple-600">›</span>
            <span className="text-orange-400">3D</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-orange-400 flex items-center gap-2"><span>📊</span> MO diagramma — 3D vizualizatsiya</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">Three.js | 6 geometriya | IRREPS tahlili | Xarakterlar jadvali | SALC | OTM</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* Kirish */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 MO diagramma — 3D interaktiv model</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Three.js</strong> (WebGL) asosidagi 3D model 
                <strong className="text-cyan-300"> 6 xil geometriya</strong> (Oₕ, T_d, D₄h, D₃h, C₄v, C₂v) 
                uchun MO energiya diagrammasini interaktiv ko'rsatadi. Model uch qismdan iborat: 
                metall AO (chap), MO sathlari (markaz), ligandlar (o'ng). 
                <strong className="text-yellow-300">Sariq strelka</strong> = Δ₀ = E(e_g*) − E(t₂g).
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-2 py-0.5 rounded-full text-[10px]">6 geometriya</span>
                <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-2 py-0.5 rounded-full text-[10px]">Three.js 3D</span>
                <span className="bg-violet-600/20 text-violet-400 border border-violet-600/30 px-2 py-0.5 rounded-full text-[10px]">IRREPS + SALC</span>
                <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-2 py-0.5 rounded-full text-[10px]">Xarakterlar jadvali</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-orange-400 font-bold">🎯 Maqsad:</span> 6 geometriya, IRREPS tahlili va sekulyar tenglama orqali MO nazariyasini mustahkamlash.</p>
              <p className="text-purple-300"><span className="text-orange-400 font-bold">⏱ Vaqt:</span> ~3 soat</p>
              <p className="text-purple-300"><span className="text-orange-400 font-bold">📚 Manba:</span> F.A. Cotton — Chemical Applications of Group Theory | Three.js</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-orange-300 font-mono text-xs font-bold">det|H − E·S| = 0 → E = α ± β</p>
              </div>
            </div>
          </div>
        </div>

        {/* Komponentlar */}
        <MO3DVizual />
        <IrrepsTahlili />
        <MatematikAsoslar3D />
        <XarakterlarJadvali />
        <BogTartibiHisoblagich />
        <GeometriyaTaqqoslash />
        <AmaliyMisollar />

        {/* Navigatsiya */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-diagramma"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm">
            ← MO diagramma (2D)
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/elektron-qoidasi"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/20">
            18 e⁻ qoidasi →
          </Link>
        </div>

      </section>
    </main>
  )
}