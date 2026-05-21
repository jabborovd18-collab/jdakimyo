"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Dodekaedrik3D() {
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
    const l2 = new THREE.DirectionalLight(0xff88cc, 0.5)
    l2.position.set(-3, -1, -2)
    scene.add(l2)

    // Mo — Kulrang
    const centerGeo = new THREE.SphereGeometry(0.35, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({ color: 0x8B8B95, roughness: 0.2, metalness: 0.9 })
    const centerAtom = new THREE.Mesh(centerGeo, centerMat)
    scene.add(centerAtom)

    const glowGeo = new THREE.SphereGeometry(0.41, 32, 32)
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x8B8B95, transparent: true, opacity: 0.1 })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    scene.add(glow)

    // 8 ta CN: C qora, N ko'k
    const d = 1.6
    const positions = [
      [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
      [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
    ]

    positions.forEach(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z)
      const nx = x / len * d
      const ny = y / len * d
      const nz = z / len * d

      // C atomi
      const cGeo = new THREE.SphereGeometry(0.18, 32, 32)
      const cMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.4, metalness: 0.3 })
      const cMesh = new THREE.Mesh(cGeo, cMat)
      cMesh.position.set(nx * 0.7, ny * 0.7, nz * 0.7)
      scene.add(cMesh)

      // N atomi
      const nGeo = new THREE.SphereGeometry(0.16, 32, 32)
      const nMat = new THREE.MeshStandardMaterial({ color: 0x3050F8, roughness: 0.4, metalness: 0.2 })
      const nMesh = new THREE.Mesh(nGeo, nMat)
      nMesh.position.set(nx, ny, nz)
      scene.add(nMesh)

      // C≡N bog'
      const dirCN = new THREE.Vector3(nx - nx * 0.7, ny - ny * 0.7, nz - nz * 0.7)
      const lenCN = dirCN.length()
      const midCN = new THREE.Vector3(nx * 0.85, ny * 0.85, nz * 0.85)
      const geoCN = new THREE.CylinderGeometry(0.03, 0.03, lenCN, 8)
      const matCN = new THREE.MeshStandardMaterial({ color: 0x334466, roughness: 0.5, metalness: 0.2, transparent: true, opacity: 0.45 })
      const bondCN = new THREE.Mesh(geoCN, matCN)
      bondCN.position.copy(midCN)
      bondCN.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirCN.normalize()))
      scene.add(bondCN)

      // Mo—C bog'
      const dirMoC = new THREE.Vector3(nx * 0.7, ny * 0.7, nz * 0.7)
      const lenMoC = dirMoC.length()
      const midMoC = new THREE.Vector3(nx * 0.35, ny * 0.35, nz * 0.35)
      const geoMoC = new THREE.CylinderGeometry(0.04, 0.04, lenMoC, 8)
      const matMoC = new THREE.MeshStandardMaterial({ color: 0x665544, roughness: 0.5, metalness: 0.2, transparent: true, opacity: 0.45 })
      const bondMoC = new THREE.Mesh(geoMoC, matMoC)
      bondMoC.position.copy(midMoC)
      bondMoC.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirMoC.normalize()))
      scene.add(bondMoC)
    })

    // Grid
    const grid = new THREE.GridHelper(5, 20, 0x222244, 0x111122)
    grid.position.y = -3
    scene.add(grid)

    // Stars
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
        <Link href="/oquv/fazoviy/dodekaedrik" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-xl font-bold text-pink-400">⬡ Dodekaedrik — 3D</h1>
          <p className="text-purple-400 text-sm">[Mo(CN)₈]⁴⁻ • CPK ranglarda</p>
        </div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center"><div className="text-xs text-purple-400">KS</div><div className="text-lg font-bold text-white">8</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Gibridlanish</div><div className="text-lg font-bold text-white">sp³d⁴</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Simmetriya</div><div className="text-lg font-bold text-white">D₂d</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Shakl</div><div className="text-lg font-bold text-white">Dodekaedr</div></div>
      </div>
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#8B8B95]"></div><span className="text-sm text-purple-300">Mo — Molibden</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#1A1A1A]"></div><span className="text-sm text-purple-300">C — Uglerod</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3050F8]"></div><span className="text-sm text-purple-300">N — Azot</span></div>
      </div>
    </main>
  )
}