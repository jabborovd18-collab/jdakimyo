"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function CuYanTeller3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(5, 4, 6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 3
    controls.maxDistance = 10
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.8

    // Chiroqlar
    scene.add(new THREE.AmbientLight(0x404060, 0.8))
    const light1 = new THREE.DirectionalLight(0xffffff, 1)
    light1.position.set(8, 8, 8)
    scene.add(light1)
    const light2 = new THREE.DirectionalLight(0xcc88ff, 0.5)
    light2.position.set(-4, -2, -3)
    scene.add(light2)

    // Cu — Mis CPK: #C88033
    const centerGeo = new THREE.SphereGeometry(0.45, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xC88033,
      roughness: 0.2,
      metalness: 0.9,
    })
    const centerAtom = new THREE.Mesh(centerGeo, centerMat)
    scene.add(centerAtom)

    // Glow
    const glowGeo = new THREE.SphereGeometry(0.52, 32, 32)
    const glow = new THREE.Mesh(
      glowGeo,
      new THREE.MeshBasicMaterial({ color: 0xC88033, transparent: true, opacity: 0.1 })
    )
    scene.add(glow)

    // Yan-Teller cho'zilgan oktaedr: ekvatorial qisqa, aksial uzun
    const eqDist = 1.95  // ekvatorial (Cu-O qisqa)
    const axDist = 2.85  // aksial (Cu-O uzun)

    // Ekvatorial ligandlar (XZ tekislik) — O (Qizil #FF0D0D)
    const eqPositions = [
      [eqDist, 0, 0],
      [-eqDist, 0, 0],
      [0, 0, eqDist],
      [0, 0, -eqDist],
    ]

    // Aksial ligandlar (Y o'qi) — O (Qizil #FF0D0D)
    const axPositions = [
      [0, axDist, 0],
      [0, -axDist, 0],
    ]

    const allPositions = [...eqPositions, ...axPositions]

    allPositions.forEach(([x, y, z]) => {
      // O atomi — CPK: #FF0D0D
      const oGeo = new THREE.SphereGeometry(0.28, 32, 32)
      const oMat = new THREE.MeshStandardMaterial({
        color: 0xFF0D0D,
        roughness: 0.4,
        metalness: 0.1,
      })
      const oMesh = new THREE.Mesh(oGeo, oMat)
      oMesh.position.set(x, y, z)
      scene.add(oMesh)

      // O glow
      const oGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.33, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xFF0D0D, transparent: true, opacity: 0.06 })
      )
      oGlow.position.copy(oMesh.position)
      scene.add(oGlow)

      // Bog' chizig'i
      createBond(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z), 0x888888)
    })

    function createBond(s, e, c) {
      const d = new THREE.Vector3().subVectors(e, s)
      const l = d.length()
      const m = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5)
      const bg = new THREE.CylinderGeometry(0.06, 0.06, l, 16)
      const bm = new THREE.MeshStandardMaterial({
        color: c,
        roughness: 0.5,
        metalness: 0.2,
        transparent: true,
        opacity: 0.5,
      })
      const b = new THREE.Mesh(bg, bm)
      b.position.copy(m)
      b.setRotationFromQuaternion(
        new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())
      )
      scene.add(b)
    }

    // Cho'zilgan oktaedr qirralari
    // Ekvatorial kvadrat (4 ta qirra)
    const eqVerts = eqPositions.map((p) => new THREE.Vector3(...p))
    const eqOrder = [0, 2, 1, 3, 0]
    for (let i = 0; i < eqOrder.length - 1; i++) {
      const a = eqVerts[eqOrder[i]]
      const b = eqVerts[eqOrder[i + 1]]
      const geo = new THREE.BufferGeometry().setFromPoints([a, b])
      scene.add(
        new THREE.Line(
          geo,
          new THREE.LineDashedMaterial({
            color: 0x443366,
            dashSize: 0.3,
            gapSize: 0.15,
          })
        )
      )
    }

    // Aksial → Ekvatorial qirralar (8 ta)
    const axVerts = axPositions.map((p) => new THREE.Vector3(...p))
    eqVerts.forEach((ev) => {
      axVerts.forEach((av) => {
        const geo = new THREE.BufferGeometry().setFromPoints([ev, av])
        scene.add(
          new THREE.Line(
            geo,
            new THREE.LineDashedMaterial({
              color: 0x553377,
              dashSize: 0.3,
              gapSize: 0.15,
            })
          )
        )
      })
    })

    // Grid
    const grid = new THREE.GridHelper(7, 20, 0x222244, 0x111122)
    grid.position.y = -3.5
    scene.add(grid)

    // Zarralar fon
    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(200 * 3)
    for (let i = 0; i < 200 * 3; i += 3) {
      sp[i] = (Math.random() - 0.5) * 10
      sp[i + 1] = (Math.random() - 0.5) * 6
      sp[i + 2] = (Math.random() - 0.5) * 10
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(
      new THREE.Points(
        starsGeo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.01, transparent: true, opacity: 0.4 })
      )
    )

    // Animatsiya
    function animate() {
      requestAnimationFrame(animate)
      glow.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.04)
      centerAtom.rotation.y += 0.003
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Resize
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
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white flex flex-col">
      {/* HEADER */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 z-10">
        <Link
          href="/ilmiy/chuqurlashgan/yan-teller/cu-komplekslari"
          className="text-purple-400 hover:text-purple-300 text-lg"
        >
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-xl font-bold text-orange-400">
            🧪 [Cu(H₂O)₆]²⁺ — Yan-Teller 3D model
          </h1>
          <p className="text-purple-400 text-sm">
            Cho'zilgan oktaedr • Ekvatorial 1.97 Å • Aksial 2.28 Å • CPK ranglarda
          </p>
        </div>
      </header>

      {/* 3D VIEWPORT */}
      <div ref={containerRef} className="flex-1 w-full" />

      {/* FOOTER — Geometrik parametrlar */}
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center">
          <div className="text-xs text-purple-400">Geometriya</div>
          <div className="text-lg font-bold text-orange-400">Cho'zilgan oktaedr</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-purple-400">Ekvatorial (×4)</div>
          <div className="text-lg font-bold text-blue-400">1.97 Å</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-purple-400">Aksial (×2)</div>
          <div className="text-lg font-bold text-red-400">2.28 Å</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-purple-400">Simmetriya</div>
          <div className="text-lg font-bold text-white">D₄h</div>
        </div>
      </div>

      {/* FOOTER — CPK ranglar */}
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#C88033]"></div>
          <span className="text-sm text-purple-300">Cu — Mis</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#FF0D0D]"></div>
          <span className="text-sm text-purple-300">O — Kislorod</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white"></div>
          <span className="text-sm text-purple-300">H — Vodorod</span>
        </div>
      </div>
    </main>
  )
}