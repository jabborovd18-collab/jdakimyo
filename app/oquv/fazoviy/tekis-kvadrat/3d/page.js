"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function TekisKvadrat3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(3, 2.5, 3)
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
    const l1 = new THREE.DirectionalLight(0xffffff, 1); l1.position.set(5, 5, 5); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0xff88cc, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)

    // Pt — Kumushrang CPK: #D0D0E0
    const centerGeo = new THREE.SphereGeometry(0.4, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({ color: 0xD0D0E0, roughness: 0.15, metalness: 0.95 })
    const centerAtom = new THREE.Mesh(centerGeo, centerMat); scene.add(centerAtom)
    const glowGeo = new THREE.SphereGeometry(0.47, 32, 32)
    const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: 0xD0D0E0, transparent: true, opacity: 0.1 })); scene.add(glow)

    // sis-[PtCl₂(NH₃)₂] — Cl yonma-yon, NH₃ yonma-yon
    const dist = 1.8
    const ligands = [
      { x: dist, z: 0, type: "Cl", color: 0x1FF01F, label: "Cl — Yashil" },
      { x: 0, z: dist, type: "Cl", color: 0x1FF01F, label: "Cl — Yashil" },
      { x: -dist, z: 0, type: "N", color: 0x3050F8, label: "N — Ko'k" },
      { x: 0, z: -dist, type: "N", color: 0x3050F8, label: "N — Ko'k" },
    ]

    ligands.forEach(({ x, z, type, color }) => {
      // Asosiy atom (Cl yoki N)
      const atomGeo = new THREE.SphereGeometry(type === "Cl" ? 0.28 : 0.25, 32, 32)
      const atomMat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.3 })
      const atomMesh = new THREE.Mesh(atomGeo, atomMat)
      atomMesh.position.set(x, 0, z)
      scene.add(atomMesh)

      const atomGlowGeo = new THREE.SphereGeometry(type === "Cl" ? 0.33 : 0.3, 16, 16)
      const atomGlow = new THREE.Mesh(atomGlowGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.08 }))
      atomGlow.position.copy(atomMesh.position)
      scene.add(atomGlow)

      // Agar N bo'lsa, H atomlarini qo'shish (NH₃)
      if (type === "N") {
        const hDist = 0.45
        const hOffset = 0.3
        const dirX = x > 0 ? 1 : (x < 0 ? -1 : 0)
        const dirZ = z > 0 ? 1 : (z < 0 ? -1 : 0)
        
        const hPositions = [
          [x + (dirX || dirZ) * hOffset, hDist, z + (dirZ || -dirX) * hOffset * 0],
          [x + (dirX || dirZ) * hOffset, -hDist / 2, z + hDist * 0.866],
          [x + (dirX || dirZ) * hOffset, -hDist / 2, z - hDist * 0.866],
        ]

        hPositions.forEach(([hx, hy, hz]) => {
          const hGeo = new THREE.SphereGeometry(0.12, 16, 16)
          const hMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, metalness: 0.1 })
          const hMesh = new THREE.Mesh(hGeo, hMat)
          hMesh.position.set(hx, hy, hz)
          scene.add(hMesh)
        })
      }

      // Bog'
      createBond(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, 0, z), type === "Cl" ? 0x448844 : 0x444488)
    })

    function createBond(s, e, c) {
      const d = new THREE.Vector3().subVectors(e, s), l = d.length(), m = new THREE.Vector3().addVectors(s, e).multiplyScalar(.5)
      const bg = new THREE.CylinderGeometry(.05, .05, l, 16)
      const bm = new THREE.MeshStandardMaterial({ color: c, roughness: .5, metalness: .2, transparent: true, opacity: .5 })
      const b = new THREE.Mesh(bg, bm); b.position.copy(m)
      b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()))
      scene.add(b)
    }

    // Kvadrat qirralari
    const corners = [[dist,0,0],[0,0,dist],[-dist,0,0],[0,0,-dist],[dist,0,0]]
    const edgeGeo = new THREE.BufferGeometry().setFromPoints(corners.map(c => new THREE.Vector3(...c)))
    scene.add(new THREE.Line(edgeGeo, new THREE.LineBasicMaterial({ color: 0x664466 })))

    // Yarim shaffof kvadrat
    const shape = new THREE.Shape()
    shape.moveTo(dist, 0); shape.lineTo(0, dist); shape.lineTo(-dist, 0); shape.lineTo(0, -dist); shape.closePath()
    const shapeGeo = new THREE.ShapeGeometry(shape)
    shapeGeo.rotateX(-Math.PI / 2)
    const shapeMesh = new THREE.Mesh(shapeGeo, new THREE.MeshBasicMaterial({ color: 0xff44ff, transparent: true, opacity: 0.04, side: THREE.DoubleSide }))
    scene.add(shapeMesh)

    // Grid
    const grid = new THREE.GridHelper(5, 20, 0x222244, 0x111122); grid.position.y = -1.5; scene.add(grid)

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
        <Link href="/oquv/fazoviy/tekis-kvadrat" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div><h1 className="text-xl font-bold text-pink-400">◻️ Tekis kvadrat — 3D model</h1><p className="text-purple-400 text-sm">sis-[PtCl₂(NH₃)₂] • SISPLATIN • CPK ranglarda</p></div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center"><div className="text-xs text-purple-400">Valent burchak</div><div className="text-lg font-bold text-white">90°</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">KS</div><div className="text-lg font-bold text-white">4</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Gibridlanish</div><div className="text-lg font-bold text-white">dsp²</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Simmetriya</div><div className="text-lg font-bold text-white">D₄h</div></div>
      </div>
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#D0D0E0]"></div><span className="text-sm text-purple-300">Pt — Platina</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#1FF01F]"></div><span className="text-sm text-purple-300">Cl — Xlor</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3050F8]"></div><span className="text-sm text-purple-300">N — Azot</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white"></div><span className="text-sm text-purple-300">H — Vodorod</span></div>
      </div>
    </main>
  )
}