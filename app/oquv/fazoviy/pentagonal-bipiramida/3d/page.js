"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function PentagonalBipiramida3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(4, 3.5, 4)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 2; controls.maxDistance = 8

    scene.add(new THREE.AmbientLight(0x404060, 0.8))
    const l1 = new THREE.DirectionalLight(0xffffff, 1); l1.position.set(5, 5, 5); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0x8888ff, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)

    // V — Kulrang CPK: #A6A6AB
    const centerGeo = new THREE.SphereGeometry(0.35, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({ color: 0xA6A6AB, roughness: 0.2, metalness: 0.9 })
    const centerAtom = new THREE.Mesh(centerGeo, centerMat); scene.add(centerAtom)
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.41, 32, 32), new THREE.MeshBasicMaterial({ color: 0xA6A6AB, transparent: true, opacity: 0.1 })); scene.add(glow)

    const distEq = 1.7, distAx = 2.1

    // Ekvatorial (5 ta CN: C qora #1A1A1A, N ko'k #3050F8)
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72) * Math.PI / 180
      const x = distEq * Math.cos(angle), z = distEq * Math.sin(angle)
      
      // C
      const cGeo = new THREE.SphereGeometry(0.2, 32, 32)
      const cMesh = new THREE.Mesh(cGeo, new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.4, metalness: 0.3 }))
      cMesh.position.set(x * 0.65, 0, z * 0.65); scene.add(cMesh)
      // N
      const nGeo = new THREE.SphereGeometry(0.18, 32, 32)
      const nMesh = new THREE.Mesh(nGeo, new THREE.MeshStandardMaterial({ color: 0x3050F8, roughness: 0.4, metalness: 0.2 }))
      nMesh.position.set(x, 0, z); scene.add(nMesh)
      
      createBond(new THREE.Vector3(x * 0.65, 0, z * 0.65), new THREE.Vector3(x, 0, z), 0x334466)
      createBond(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x * 0.65, 0, z * 0.65), 0x665544)
    }

    // Aksial (2 ta CN)
    for (const sign of [1, -1]) {
      const cGeo = new THREE.SphereGeometry(0.2, 32, 32)
      const cMesh = new THREE.Mesh(cGeo, new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.4, metalness: 0.3 }))
      cMesh.position.set(0, sign * distAx * 0.65, 0); scene.add(cMesh)
      const nGeo = new THREE.SphereGeometry(0.18, 32, 32)
      const nMesh = new THREE.Mesh(nGeo, new THREE.MeshStandardMaterial({ color: 0x3050F8, roughness: 0.4, metalness: 0.2 }))
      nMesh.position.set(0, sign * distAx, 0); scene.add(nMesh)
      
      createBond(new THREE.Vector3(0, sign * distAx * 0.65, 0), new THREE.Vector3(0, sign * distAx, 0), 0x334466)
      createBond(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, sign * distAx * 0.65, 0), 0x665544)
    }

    function createBond(s, e, c) {
      const d = new THREE.Vector3().subVectors(e, s), l = d.length(), m = new THREE.Vector3().addVectors(s, e).multiplyScalar(.5)
      const bg = new THREE.CylinderGeometry(.04, .04, l, 16)
      const b = new THREE.Mesh(bg, new THREE.MeshStandardMaterial({ color: c, roughness: .5, metalness: .2, transparent: true, opacity: .45 }))
      b.position.copy(m); b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()))
      scene.add(b)
    }

    // Beshburchak chizig'i
    const pentPts = []
    for (let i = 0; i <= 5; i++) {
      const a = (i * 72) * Math.PI / 180
      pentPts.push(new THREE.Vector3(distEq * Math.cos(a), 0, distEq * Math.sin(a)))
    }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pentPts), new THREE.LineBasicMaterial({ color: 0x446688 })))

    const grid = new THREE.GridHelper(5, 20, 0x222244, 0x111122); grid.position.y = -3; scene.add(grid)
    const starsGeo = new THREE.BufferGeometry(); const sp = new Float32Array(200 * 3)
    for (let i = 0; i < 200 * 3; i += 3) { sp[i] = (Math.random() - .5) * 10; sp[i + 1] = (Math.random() - .5) * 6; sp[i + 2] = (Math.random() - .5) * 10 }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: .01, transparent: true, opacity: .4 })))

    function animate() {
      requestAnimationFrame(animate)
      glow.scale.setScalar(1 + Math.sin(Date.now() * .002) * .04)
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
        <Link href="/oquv/fazoviy/pentagonal-bipiramida" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div><h1 className="text-xl font-bold text-blue-400">⬠ Pentagonal bipiramida — 3D</h1><p className="text-purple-400 text-sm">[V(CN)₇]⁴⁻ • CPK ranglarda</p></div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center"><div className="text-xs text-purple-400">Burchaklar</div><div className="text-lg font-bold text-white">72° / 90°</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">KS</div><div className="text-lg font-bold text-white">7</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Gibridlanish</div><div className="text-lg font-bold text-white">sp³d³</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Simmetriya</div><div className="text-lg font-bold text-white">D₅h</div></div>
      </div>
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#A6A6AB]"></div><span className="text-sm text-purple-300">V — Vanadiy</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#1A1A1A]"></div><span className="text-sm text-purple-300">C — Uglerod</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3050F8]"></div><span className="text-sm text-purple-300">N — Azot</span></div>
      </div>
    </main>
  )
}