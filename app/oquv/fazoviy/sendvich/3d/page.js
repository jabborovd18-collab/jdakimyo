"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Sendvich3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(4, 2.5, 4)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 2; controls.maxDistance = 8

    scene.add(new THREE.AmbientLight(0x404060, 0.8))
    const l1 = new THREE.DirectionalLight(0xffffff, 1); l1.position.set(5, 5, 5); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0xcc88ff, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)

    // Fe — To'q kulrang CPK: #808090
    const feGeo = new THREE.SphereGeometry(0.35, 64, 64)
    const feMat = new THREE.MeshStandardMaterial({ color: 0x808090, roughness: 0.2, metalness: 0.9 })
    const feMesh = new THREE.Mesh(feGeo, feMat); scene.add(feMesh)
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.41, 32, 32), new THREE.MeshBasicMaterial({ color: 0x808090, transparent: true, opacity: 0.1 })); scene.add(glow)

    const ringR = 1.3, ringH = 1.1

    // Ikki halqa — C (Qora #1A1A1A)
    for (const sign of [1, -1]) {
      const ringPoints = []
      for (let i = 0; i < 5; i++) {
        const angle = (i * 72 - 18) * Math.PI / 180
        const x = ringR * Math.cos(angle)
        const z = ringR * Math.sin(angle)

        // C atomi
        const cGeo = new THREE.SphereGeometry(0.2, 32, 32)
        const cMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.4, metalness: 0.3 })
        const cMesh = new THREE.Mesh(cGeo, cMat)
        cMesh.position.set(x, sign * ringH, z)
        scene.add(cMesh)

        ringPoints.push(new THREE.Vector3(x, sign * ringH, z))

        // H atomi (tashqi tomonda)
        const hDist = 0.5
        const hx = x + (x / ringR) * hDist
        const hz = z + (z / ringR) * hDist
        const hGeo = new THREE.SphereGeometry(0.1, 16, 16)
        const hMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, metalness: 0.1 })
        const hMesh = new THREE.Mesh(hGeo, hMat)
        hMesh.position.set(hx, sign * ringH, hz)
        scene.add(hMesh)
      }

      // Beshburchak chizig'i
      ringPoints.push(ringPoints[0].clone())
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(ringPoints),
        new THREE.LineBasicMaterial({ color: 0x444444 })
      ))
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
      glow.scale.setScalar(1 + Math.sin(Date.now() * .002) * .04)
      feMesh.rotation.y += 0.005
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
        <Link href="/oquv/fazoviy/sendvich" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div><h1 className="text-xl font-bold text-purple-400">🥪 Sendvich (Ferrosen) — 3D</h1><p className="text-purple-400 text-sm">[Fe(C₅H₅)₂] • CPK ranglarda</p></div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center"><div className="text-xs text-purple-400">Bog'lar</div><div className="text-lg font-bold text-white">10 ta Fe-C</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Halqalar</div><div className="text-lg font-bold text-white">2 ta C₅H₅</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Elektron</div><div className="text-lg font-bold text-white">18 ta</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Shakl</div><div className="text-lg font-bold text-white">Sendvich</div></div>
      </div>
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#808090]"></div><span className="text-sm text-purple-300">Fe — Temir</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#1A1A1A]"></div><span className="text-sm text-purple-300">C — Uglerod</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white"></div><span className="text-sm text-purple-300">H — Vodorod</span></div>
      </div>
    </main>
  )
}