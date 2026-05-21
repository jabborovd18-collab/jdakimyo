"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function UchYoqliPrizma3D() {
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

    // Re — Kulrang
    const centerGeo = new THREE.SphereGeometry(0.32, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({ color: 0x9A9AA5, roughness: 0.2, metalness: 0.9 })
    const centerAtom = new THREE.Mesh(centerGeo, centerMat); scene.add(centerAtom)
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), new THREE.MeshBasicMaterial({ color: 0x9A9AA5, transparent: true, opacity: 0.1 })); scene.add(glow)

    const d = 1.5, h = 1.3
    const angles = [0, 120, 240].map(deg => deg * Math.PI / 180)

    // Prizma ligandlari — H (Oq)
    angles.forEach(angle => {
      const x = d * Math.cos(angle), z = d * Math.sin(angle)
      // Yuqori
      const h1Geo = new THREE.SphereGeometry(0.12, 16, 16)
      const h1 = new THREE.Mesh(h1Geo, new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, metalness: 0.1 }))
      h1.position.set(x, h, z); scene.add(h1)
      createBond(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, h, z), 0x888888)
      // Pastki
      const h2 = new THREE.Mesh(h1Geo, new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, metalness: 0.1 }))
      h2.position.set(x, -h, z); scene.add(h2)
      createBond(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, -h, z), 0x888888)
    })

    // Uchta yopiq ligand — yuzlar ustida
    for (let i = 0; i < 3; i++) {
      const a1 = angles[i], a2 = angles[(i + 1) % 3]
      const midX = d * (Math.cos(a1) + Math.cos(a2)) / 2 * 0.85
      const midZ = d * (Math.sin(a1) + Math.sin(a2)) / 2 * 0.85
      const hGeo = new THREE.SphereGeometry(0.14, 16, 16)
      const hMesh = new THREE.Mesh(hGeo, new THREE.MeshStandardMaterial({ color: 0xEEEEEE, roughness: 0.5, metalness: 0.1 }))
      hMesh.position.set(midX, 0, midZ); scene.add(hMesh)
      createBond(new THREE.Vector3(0, 0, 0), new THREE.Vector3(midX, 0, midZ), 0x888888, 0.05)
    }

    function createBond(s, e, c, r = 0.03) {
      const dir = new THREE.Vector3().subVectors(e, s), l = dir.length(), m = new THREE.Vector3().addVectors(s, e).multiplyScalar(.5)
      const bg = new THREE.CylinderGeometry(r, r, l, 8)
      const b = new THREE.Mesh(bg, new THREE.MeshStandardMaterial({ color: c, roughness: .5, metalness: .2, transparent: true, opacity: .4 }))
      b.position.copy(m); b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()))
      scene.add(b)
    }

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
        <Link href="/oquv/fazoviy/uch-yoqli-prizma" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div><h1 className="text-xl font-bold text-orange-400">📐 Uch yoqli prizma — 3D</h1><p className="text-purple-400 text-sm">[ReH₉]²⁻ • CPK ranglarda</p></div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center"><div className="text-xs text-purple-400">KS</div><div className="text-lg font-bold text-white">9</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Gibridlanish</div><div className="text-lg font-bold text-white">sp³d⁵</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Shakl</div><div className="text-lg font-bold text-white">3 yoqli prizma</div></div>
      </div>
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#9A9AA5]"></div><span className="text-sm text-purple-300">Re — Reniy</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white"></div><span className="text-sm text-purple-300">H — Vodorod</span></div>
      </div>
    </main>
  )
}