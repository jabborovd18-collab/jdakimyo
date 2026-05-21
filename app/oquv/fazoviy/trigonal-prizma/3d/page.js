"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function TrigonalPrizma3D() {
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
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 2; controls.maxDistance = 8

    scene.add(new THREE.AmbientLight(0x404060, 0.8))
    const l1 = new THREE.DirectionalLight(0xffffff, 1); l1.position.set(5, 5, 5); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0xffcc88, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)

    // Zr — Kulrang CPK: #8B8B95
    const centerGeo = new THREE.SphereGeometry(0.38, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({ color: 0xA0A0A8, roughness: 0.2, metalness: 0.9 })
    const centerAtom = new THREE.Mesh(centerGeo, centerMat); scene.add(centerAtom)
    const glowGeo = new THREE.SphereGeometry(0.44, 32, 32)
    const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: 0xA0A0A8, transparent: true, opacity: 0.1 })); scene.add(glow)

    const dist = 1.8
    const height = 1.4

    // Yuqori uchburchak (3 ta C — Qora #1A1A1A)
    const topAngles = [0, 120, 240].map(d => d * Math.PI / 180)
    const topPoints = []
    topAngles.forEach(angle => {
      const x = dist * Math.cos(angle), z = dist * Math.sin(angle)
      topPoints.push(new THREE.Vector3(x, height, z))
      
      const cGeo = new THREE.SphereGeometry(0.25, 32, 32)
      const cMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.4, metalness: 0.3 })
      const cMesh = new THREE.Mesh(cGeo, cMat); cMesh.position.set(x, height, z); scene.add(cMesh)
      
      createBond(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, height, z), 0x886644)
    })

    // Pastki uchburchak (3 ta C — Qora #1A1A1A)
    const bottomPoints = []
    topAngles.forEach(angle => {
      const x = dist * Math.cos(angle), z = dist * Math.sin(angle)
      bottomPoints.push(new THREE.Vector3(x, -height, z))
      
      const cGeo = new THREE.SphereGeometry(0.25, 32, 32)
      const cMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.4, metalness: 0.3 })
      const cMesh = new THREE.Mesh(cGeo, cMat); cMesh.position.set(x, -height, z); scene.add(cMesh)
      
      createBond(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, -height, z), 0x886644)
    })

    function createBond(s, e, c) {
      const d = new THREE.Vector3().subVectors(e, s), l = d.length(), m = new THREE.Vector3().addVectors(s, e).multiplyScalar(.5)
      const bg = new THREE.CylinderGeometry(.04, .04, l, 16)
      const bm = new THREE.MeshStandardMaterial({ color: c, roughness: .5, metalness: .2, transparent: true, opacity: .45 })
      const b = new THREE.Mesh(bg, bm); b.position.copy(m)
      b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()))
      scene.add(b)
    }

    // Uchburchak qirralari
    const topClosed = [...topPoints, topPoints[0]]
    const bottomClosed = [...bottomPoints, bottomPoints[0]]
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(topClosed), new THREE.LineBasicMaterial({ color: 0x664422 })))
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(bottomClosed), new THREE.LineBasicMaterial({ color: 0x664422 })))

    // Vertikal qirralar
    for (let i = 0; i < 3; i++) {
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([topPoints[i], bottomPoints[i]]), new THREE.LineBasicMaterial({ color: 0x664422 })))
    }

    // Grid
    const grid = new THREE.GridHelper(5, 20, 0x222244, 0x111122); grid.position.y = -3; scene.add(grid)

    // Stars
    const starsGeo = new THREE.BufferGeometry(); const sp = new Float32Array(200 * 3)
    for (let i = 0; i < 200 * 3; i += 3) { sp[i] = (Math.random() - .5) * 10; sp[i + 1] = (Math.random() - .5) * 6; sp[i + 2] = (Math.random() - .5) * 10 }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: .01, transparent: true, opacity: .4 })))

    function animate() {
      requestAnimationFrame(animate)
      const t = Date.now() * .001
      glow.scale.setScalar(1 + Math.sin(t * 2) * .04)
      centerAtom.rotation.y += .003
      controls.update()
      renderer.render(scene, camera)
    }
    animate()
    const hr = () => { camera.aspect = container.clientWidth / container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth, container.clientHeight) }
    window.addEventListener("resize", hr)
    return () => { window.removeEventListener("resize", hr); container.removeChild(renderer.domElement) }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white flex flex-col">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 z-10">
        <Link href="/oquv/fazoviy/trigonal-prizma" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div><h1 className="text-xl font-bold text-yellow-400">🔶 Trigonal prizma — 3D</h1><p className="text-purple-400 text-sm">[ZrMe₆]²⁻ • CPK ranglarda</p></div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center"><div className="text-xs text-purple-400">Simmetriya</div><div className="text-lg font-bold text-white">D₃h</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">KS</div><div className="text-lg font-bold text-white">6</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Gibridlanish</div><div className="text-lg font-bold text-white">sd⁵</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Shakl</div><div className="text-lg font-bold text-white">Prizma</div></div>
      </div>
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#A0A0A8]"></div><span className="text-sm text-purple-300">Zr — Sirkoniy</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#1A1A1A]"></div><span className="text-sm text-purple-300">C — Metil guruhi</span></div>
      </div>
    </main>
  )
}