"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function KvadratAntiprizma3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(4, 3, 4)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 2
    controls.maxDistance = 8

    scene.add(new THREE.AmbientLight(0x404060, 0.8))
    const l1 = new THREE.DirectionalLight(0xffffff, 1)
    l1.position.set(5, 5, 5)
    scene.add(l1)
    const l2 = new THREE.DirectionalLight(0xcc88ff, 0.5)
    l2.position.set(-3, -1, -2)
    scene.add(l2)

    // Mo — Kulrang CPK: #8B8B95
    const centerGeo = new THREE.SphereGeometry(0.35, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({ color: 0x8B8B95, roughness: 0.2, metalness: 0.9 })
    const centerAtom = new THREE.Mesh(centerGeo, centerMat)
    scene.add(centerAtom)

    const glowGeo = new THREE.SphereGeometry(0.41, 32, 32)
    const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: 0x8B8B95, transparent: true, opacity: 0.1 }))
    scene.add(glow)

    const r = 1.6
    const h = 1.2

    // Yuqori kvadrat (4 ta CN)
    const topAngles = [45, 135, 225, 315].map(d => d * Math.PI / 180)
    topAngles.forEach(angle => {
      const x = r * Math.cos(angle)
      const z = r * Math.sin(angle)
      addCNLigand(x, h, z)
    })

    // Pastki kvadrat (4 ta CN — 45° ga burilgan)
    const bottomAngles = [0, 90, 180, 270].map(d => d * Math.PI / 180)
    bottomAngles.forEach(angle => {
      const x = r * Math.cos(angle)
      const z = r * Math.sin(angle)
      addCNLigand(x, -h, z)
    })

    function addCNLigand(x, y, z) {
      // C atomi (qora)
      const cGeo = new THREE.SphereGeometry(0.18, 32, 32)
      const cMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.4, metalness: 0.3 })
      const cMesh = new THREE.Mesh(cGeo, cMat)
      const dist = Math.sqrt(x * x + y * y + z * z)
      cMesh.position.set(x * 0.75, y * 0.75, z * 0.75)
      scene.add(cMesh)

      // N atomi (ko'k)
      const nGeo = new THREE.SphereGeometry(0.16, 32, 32)
      const nMat = new THREE.MeshStandardMaterial({ color: 0x3050F8, roughness: 0.4, metalness: 0.2 })
      const nMesh = new THREE.Mesh(nGeo, nMat)
      nMesh.position.set(x, y, z)
      scene.add(nMesh)

      // C≡N bog'
      createBond(
        new THREE.Vector3(x * 0.75, y * 0.75, z * 0.75),
        new THREE.Vector3(x, y, z),
        0x334466,
        0.03
      )

      // Mo—C bog'
      createBond(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x * 0.75, y * 0.75, z * 0.75),
        0x665544,
        0.04
      )
    }

    function createBond(s, e, c, radius = 0.04) {
      const d = new THREE.Vector3().subVectors(e, s)
      const l = d.length()
      const m = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5)
      const bg = new THREE.CylinderGeometry(radius, radius, l, 16)
      const bm = new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.2, transparent: true, opacity: 0.45 })
      const b = new THREE.Mesh(bg, bm)
      b.position.copy(m)
      b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()))
      scene.add(b)
    }

    // Yuqori kvadrat chizig'i
    const topPts = topAngles.map(a => new THREE.Vector3(r * Math.cos(a), h, r * Math.sin(a)))
    topPts.push(topPts[0].clone())
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(topPts), new THREE.LineBasicMaterial({ color: 0x664488 })))

    // Pastki kvadrat chizig'i
    const botPts = bottomAngles.map(a => new THREE.Vector3(r * Math.cos(a), -h, r * Math.sin(a)))
    botPts.push(botPts[0].clone())
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(botPts), new THREE.LineBasicMaterial({ color: 0x664488 })))

    // Vertikal qirralar (zig-zag)
    for (let i = 0; i < 4; i++) {
      const topPt = new THREE.Vector3(r * Math.cos((45 + i * 90) * Math.PI / 180), h, r * Math.sin((45 + i * 90) * Math.PI / 180))
      const botPt1 = new THREE.Vector3(r * Math.cos((i * 90) * Math.PI / 180), -h, r * Math.sin((i * 90) * Math.PI / 180))
      const botPt2 = new THREE.Vector3(r * Math.cos(((i + 1) % 4 * 90) * Math.PI / 180), -h, r * Math.sin(((i + 1) % 4 * 90) * Math.PI / 180))
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([topPt, botPt1]), new THREE.LineDashedMaterial({ color: 0x553366, dashSize: 0.3, gapSize: 0.15 })))
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([topPt, botPt2]), new THREE.LineDashedMaterial({ color: 0x553366, dashSize: 0.3, gapSize: 0.15 })))
    }

    const grid = new THREE.GridHelper(5, 20, 0x222244, 0x111122)
    grid.position.y = -3
    scene.add(grid)

    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(200 * 3)
    for (let i = 0; i < 200 * 3; i += 3) {
      sp[i] = (Math.random() - 0.5) * 10
      sp[i + 1] = (Math.random() - 0.5) * 6
      sp[i + 2] = (Math.random() - 0.5) * 10
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.01, transparent: true, opacity: 0.4 })))

    function animate() {
      requestAnimationFrame(animate)
      glow.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.04)
      centerAtom.rotation.y += 0.003
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
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white flex flex-col">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 z-10">
        <Link href="/oquv/fazoviy/kvadrat-antiprizma" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-xl font-bold text-purple-400">🟦 Kvadrat antiprizma — 3D</h1>
          <p className="text-purple-400 text-sm">[Mo(CN)₈]⁴⁻ • CPK ranglarda</p>
        </div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center"><div className="text-xs text-purple-400">KS</div><div className="text-lg font-bold text-white">8</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Gibridlanish</div><div className="text-lg font-bold text-white">sp³d⁴</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Simmetriya</div><div className="text-lg font-bold text-white">D₄d</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Burilish</div><div className="text-lg font-bold text-white">45°</div></div>
      </div>
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#8B8B95]"></div><span className="text-sm text-purple-300">Mo — Molibden</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#1A1A1A]"></div><span className="text-sm text-purple-300">C — Uglerod</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3050F8]"></div><span className="text-sm text-purple-300">N — Azot</span></div>
      </div>
    </main>
  )
}