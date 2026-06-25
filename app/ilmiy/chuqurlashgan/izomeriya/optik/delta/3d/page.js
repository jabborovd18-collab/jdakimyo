"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Delta3D() {
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

    scene.add(new THREE.AmbientLight(0x404060, 0.7))
    const l1 = new THREE.DirectionalLight(0xffffff, 1); l1.position.set(5, 5, 5); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0xffffcc, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)

    // Markaziy atom — Co (Kobalt)
    const coGeo = new THREE.SphereGeometry(0.3, 64, 64)
    const coMat = new THREE.MeshStandardMaterial({ color: 0xF0A060, roughness: 0.2, metalness: 0.85 })
    const coAtom = new THREE.Mesh(coGeo, coMat); scene.add(coAtom)
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.36, 32, 32), new THREE.MeshBasicMaterial({ color: 0xF0A060, transparent: true, opacity: 0.12 })); scene.add(glow)

    const d = 1.6

    // Δ (P-helis) — o'ng vint: N atomlari oktaedr uchlari bo'ylab, xelat halqalari P konfiguratsiyada
    // Oktaedrik 6 ta N pozitsiyasi (Δ konfiguratsiya uchun)
    const nPositions = [
      { x: d * 0.85, y: d * 0.45, z: d * 0.25, pair: 0 },
      { x: -d * 0.15, y: d * 0.45, z: d * 0.85, pair: 0 },
      { x: -d * 0.70, y: d * 0.45, z: -d * 0.60, pair: 1 },
      { x: -d * 0.85, y: -d * 0.45, z: -d * 0.25, pair: 1 },
      { x: d * 0.15, y: -d * 0.45, z: -d * 0.85, pair: 2 },
      { x: d * 0.70, y: -d * 0.45, z: d * 0.60, pair: 2 },
    ]

    const nAtoms = []
    nPositions.forEach(({ x, y, z, pair }) => {
      const nGeo = new THREE.SphereGeometry(0.18, 32, 32)
      const nMat = new THREE.MeshStandardMaterial({ color: 0x3050F0, roughness: 0.4, metalness: 0.2 })
      const nMesh = new THREE.Mesh(nGeo, nMat)
      nMesh.position.set(x, y, z)
      scene.add(nMesh)
      nAtoms.push({ mesh: nMesh, pos: new THREE.Vector3(x, y, z), pair })
      createBond(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z), 0x888888)
    })

    // Xelat halqalari — C atomlari (3 ta en ligand)
    nAtoms.forEach(({ pos, pair }) => {
      const partner = nAtoms.find(n => n.pair === pair && n.mesh !== nAtoms.find(x => x.pos === pos)?.mesh)
      if (partner) {
        const mid = new THREE.Vector3().addVectors(pos, partner.pos).multiplyScalar(0.5)
        const dir = new THREE.Vector3().subVectors(partner.pos, pos).normalize()
        const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize()
        
        const c1Pos = new THREE.Vector3().addVectors(pos, dir.clone().multiplyScalar(0.35)).add(perp.clone().multiplyScalar(0.4))
        const c2Pos = new THREE.Vector3().addVectors(partner.pos, dir.clone().multiplyScalar(-0.35)).add(perp.clone().multiplyScalar(0.4))
        
        const cGeo = new THREE.SphereGeometry(0.14, 16, 16)
        const cMat = new THREE.MeshStandardMaterial({ color: 0x404040, roughness: 0.5, metalness: 0.1 })
        
        const c1 = new THREE.Mesh(cGeo, cMat); c1.position.copy(c1Pos); scene.add(c1)
        const c2 = new THREE.Mesh(cGeo, cMat); c2.position.copy(c2Pos); scene.add(c2)
        
        createBond(pos, c1Pos, 0xAAAAAA)
        createBond(c1Pos, c2Pos, 0xAAAAAA)
        createBond(c2Pos, partner.pos, 0xAAAAAA)
      }
    })

    function createBond(s, e, c) {
      const d = new THREE.Vector3().subVectors(e, s), l = d.length(), m = new THREE.Vector3().addVectors(s, e).multiplyScalar(.5)
      const bg = new THREE.CylinderGeometry(.04, .04, l, 8)
      const b = new THREE.Mesh(bg, new THREE.MeshStandardMaterial({ color: c, roughness: .5, metalness: .2, transparent: true, opacity: .7 }))
      b.position.copy(m); b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()))
      scene.add(b)
    }

    const grid = new THREE.GridHelper(5, 20, 0x222244, 0x111122); grid.position.y = -2.5; scene.add(grid)
    const starsGeo = new THREE.BufferGeometry(); const sp = new Float32Array(200 * 3)
    for (let i = 0; i < 200 * 3; i += 3) { sp[i] = (Math.random() - .5) * 10; sp[i + 1] = (Math.random() - .5) * 6; sp[i + 2] = (Math.random() - .5) * 10 }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: .01, transparent: true, opacity: .4 })))

    function animate() {
      requestAnimationFrame(animate)
      glow.scale.setScalar(1 + Math.sin(Date.now() * .002) * .04)
      coAtom.rotation.y += .003
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
        <Link href="/ilmiy/chuqurlashgan/izomeriya/optik" className="text-purple-400 hover:text-purple-300 text-lg">← Optik izomeriya</Link>
        <div><h1 className="text-xl font-bold text-blue-400">🔷 Δ-[Co(en)₃]³⁺ — 3D</h1><p className="text-purple-400 text-sm">O'ng vint • P-helis • Tris(etilendiamin)kobalt(III)</p></div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center"><div className="text-xs text-purple-400">Konfiguratsiya</div><div className="text-lg font-bold text-white">Δ (P-helis)</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">CD signali</div><div className="text-lg font-bold text-white">Musbat (+)</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Simmetriya</div><div className="text-lg font-bold text-white">D₃</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Xelat</div><div className="text-lg font-bold text-white">δδδ (lel)</div></div>
      </div>
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#F0A060]"></div><span className="text-sm text-purple-300">Co — Kobalt</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3050F0]"></div><span className="text-sm text-purple-300">N — Azot</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#404040]"></div><span className="text-sm text-purple-300">C — Uglerod</span></div>
      </div>
    </main>
  )
}