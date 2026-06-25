"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Sisplatin3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(3.5, 2.5, 3.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 2; controls.maxDistance = 8

    scene.add(new THREE.AmbientLight(0x404060, 0.7))
    const l1 = new THREE.DirectionalLight(0xffffff, 1); l1.position.set(5, 5, 5); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0xffffcc, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)

    // Markaziy atom — Pt (Platina) — Kumush
    const ptGeo = new THREE.SphereGeometry(0.35, 64, 64)
    const ptMat = new THREE.MeshStandardMaterial({ color: 0xC0C0E0, roughness: 0.2, metalness: 0.9 })
    const ptAtom = new THREE.Mesh(ptGeo, ptMat); scene.add(ptAtom)
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), new THREE.MeshBasicMaterial({ color: 0xC0C0E0, transparent: true, opacity: 0.12 })); scene.add(glow)

    // Kvadrat planar — 90° burchak, 4 ta ligand
    const d = 1.5
    const positions = [
      { x: d, y: 0, z: 0, color: 0x00CC00, label: "Cl", type: "Cl" },    // +x — Cl (Yashil)
      { x: -d, y: 0, z: 0, color: 0x00CC00, label: "Cl", type: "Cl" },   // -x — Cl (Yashil)
      { x: 0, y: d, z: 0, color: 0x3050F0, label: "N", type: "N" },      // +y — N (Ko'k)
      { x: 0, y: -d, z: 0, color: 0x3050F0, label: "N", type: "N" },     // -y — N (Ko'k)
    ]

    positions.forEach(({ x, y, z, color, type }) => {
      // Ligand atomi
      const atomGeo = new THREE.SphereGeometry(type === "Cl" ? 0.2 : 0.18, 32, 32)
      const atomMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.2 })
      const atomMesh = new THREE.Mesh(atomGeo, atomMat)
      atomMesh.position.set(x, y, z)
      scene.add(atomMesh)

      // Bog' — Pt dan ligandga
      createBond(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z), 0x888888)

      // NH₃ uchun vodorod atomlari (N ligandlarida)
      if (type === "N") {
        const hDist = 0.5
        const hColor = 0xFFFFFF
        // H atomlari N atrofida tetraedrik joylashgan (ammiak NH₃)
        const hPositions = [
          { dx: hDist * 0.8, dy: 0, dz: 0 },
          { dx: -hDist * 0.3, dy: hDist * 0.7, dz: hDist * 0.4 },
          { dx: -hDist * 0.3, dy: -hDist * 0.7, dz: -hDist * 0.4 },
        ]
        hPositions.forEach(({ dx, dy, dz }) => {
          const hGeo = new THREE.SphereGeometry(0.08, 16, 16)
          const hMat = new THREE.MeshStandardMaterial({ color: hColor, roughness: 0.5, metalness: 0.1 })
          const hMesh = new THREE.Mesh(hGeo, hMat)
          hMesh.position.set(x + dx, y + dy, z + dz)
          scene.add(hMesh)
          createBond(new THREE.Vector3(x, y, z), new THREE.Vector3(x + dx, y + dy, z + dz), 0xCCCCCC)
        })
      }
    })

    function createBond(s, e, c) {
      const d = new THREE.Vector3().subVectors(e, s), l = d.length(), m = new THREE.Vector3().addVectors(s, e).multiplyScalar(.5)
      const bg = new THREE.CylinderGeometry(.04, .04, l, 8)
      const b = new THREE.Mesh(bg, new THREE.MeshStandardMaterial({ color: c, roughness: .5, metalness: .2, transparent: true, opacity: .7 }))
      b.position.copy(m); b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()))
      scene.add(b)
    }

    // Kvadrat planar tekislik (yarim shaffof halqa)
    const ringGeo = new THREE.TorusGeometry(d, 0.03, 16, 4)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4466aa, transparent: true, opacity: 0.3 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    scene.add(ring)

    // Grid va yulduzlar
    const grid = new THREE.GridHelper(5, 20, 0x222244, 0x111122); grid.position.y = -2.5; scene.add(grid)
    const starsGeo = new THREE.BufferGeometry(); const sp = new Float32Array(200 * 3)
    for (let i = 0; i < 200 * 3; i += 3) { sp[i] = (Math.random() - .5) * 10; sp[i + 1] = (Math.random() - .5) * 6; sp[i + 2] = (Math.random() - .5) * 10 }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: .01, transparent: true, opacity: .4 })))

    function animate() {
      requestAnimationFrame(animate)
      glow.scale.setScalar(1 + Math.sin(Date.now() * .002) * .04)
      ptAtom.rotation.y += .003
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
        <Link href="/ilmiy/chuqurlashgan/izomeriya/geometrik" className="text-purple-400 hover:text-purple-300 text-lg">← Geometrik izomeriya</Link>
        <div><h1 className="text-xl font-bold text-blue-400">🔷 sis-[PtCl₂(NH₃)₂] — 3D</h1><p className="text-purple-400 text-sm">Kvadrat planar • C₂v simmetriya • Sisplatin</p></div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center"><div className="text-xs text-purple-400">Geometriya</div><div className="text-lg font-bold text-white">Kvadrat planar</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Simmetriya</div><div className="text-lg font-bold text-white">C₂v</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Cl−Pt−Cl</div><div className="text-lg font-bold text-white">~91°</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Dipol momenti</div><div className="text-lg font-bold text-white">μ ≠ 0</div></div>
      </div>
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#C0C0E0]"></div><span className="text-sm text-purple-300">Pt — Platina</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#00CC00]"></div><span className="text-sm text-purple-300">Cl — Xlor</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3050F0]"></div><span className="text-sm text-purple-300">N — Azot</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#FFFFFF]"></div><span className="text-sm text-purple-300">H — Vodorod</span></div>
      </div>
    </main>
  )
}