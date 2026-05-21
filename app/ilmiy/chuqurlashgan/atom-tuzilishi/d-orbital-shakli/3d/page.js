"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function DOrbital3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(6, 4, 6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 3; controls.maxDistance = 12

    scene.add(new THREE.AmbientLight(0x404060, 1))
    const l1 = new THREE.DirectionalLight(0xffffff, 1); l1.position.set(5, 8, 5); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0x8888ff, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)

    const spacing = 2.8
    const colors = [0xff4444, 0x44ff44, 0x4444ff, 0xffaa00, 0xff44ff]

    // 5 ta orbital — joylashuv
    const orbitalData = [
      { name: "dxy", pos: [-spacing, spacing * 0.8, 0], shape: "dxy" },
      { name: "dxz", pos: [0, spacing * 0.8, 0], shape: "dxz" },
      { name: "dyz", pos: [spacing, spacing * 0.8, 0], shape: "dyz" },
      { name: "dz²", pos: [-spacing * 0.7, -spacing * 0.8, 0], shape: "dz2" },
      { name: "dx²−y²", pos: [spacing * 0.7, -spacing * 0.8, 0], shape: "dx2y2" },
    ]

    orbitalData.forEach((orb, index) => {
      const group = new THREE.Group()
      group.position.set(orb.pos[0], orb.pos[1], orb.pos[2])
      scene.add(group)

      const color = colors[index]
      const size = 0.8

      // Lob (bo'lak) yaratish
      const lobeGeo = new THREE.SphereGeometry(size * 0.4, 32, 32)
      lobeGeo.scale(1, 1, 1.8)

      const lobeMat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.7
      })

      const lobeMatNeg = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.4
      })

      const dist = size * 0.8
      const ang = Math.PI / 4

      if (orb.shape === "dxy") {
        [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([sx, sy]) => {
          const lobe = new THREE.Mesh(lobeGeo, sx*sy > 0 ? lobeMat : lobeMatNeg)
          lobe.position.set(sx * dist * Math.cos(ang), sy * dist * Math.sin(ang), 0)
          lobe.rotation.z = Math.PI / 4
          group.add(lobe)
        })
      } else if (orb.shape === "dxz") {
        [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([sx, sz]) => {
          const lobe = new THREE.Mesh(lobeGeo, sx*sz > 0 ? lobeMat : lobeMatNeg)
          lobe.position.set(sx * dist * Math.cos(ang), 0, sz * dist * Math.sin(ang))
          lobe.rotation.y = -Math.PI / 4
          group.add(lobe)
        })
      } else if (orb.shape === "dyz") {
        [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([sy, sz]) => {
          const lobe = new THREE.Mesh(lobeGeo, sy*sz > 0 ? lobeMat : lobeMatNeg)
          lobe.position.set(0, sy * dist * Math.cos(ang), sz * dist * Math.sin(ang))
          lobe.rotation.x = Math.PI / 4
          group.add(lobe)
        })
      } else if (orb.shape === "dz2") {
        const lobe1 = new THREE.Mesh(lobeGeo, lobeMat)
        lobe1.position.set(0, dist, 0); group.add(lobe1)
        const lobe2 = new THREE.Mesh(lobeGeo, lobeMatNeg)
        lobe2.position.set(0, -dist, 0); group.add(lobe2)
        const ringGeo = new THREE.TorusGeometry(dist * 0.55, size * 0.18, 16, 32)
        const ring = new THREE.Mesh(ringGeo, lobeMat)
        group.add(ring)
      } else if (orb.shape === "dx2y2") {
        [[1,0],[0,1],[-1,0],[0,-1]].forEach(([sx, sy]) => {
          const lobe = new THREE.Mesh(lobeGeo, (sx+sy) % 2 === 0 ? lobeMat : lobeMatNeg)
          lobe.position.set(sx * dist, sy * dist, 0)
          group.add(lobe)
        })
      }

      // Label
      const labelDiv = document.createElement("div")
      labelDiv.style.cssText = `position:absolute;color:white;font-size:14px;font-weight:bold;pointer-events:none;text-shadow:0 0 8px black`
      labelDiv.textContent = orb.name
      container.appendChild(labelDiv)
    })

    // Grid
    const grid = new THREE.GridHelper(10, 20, 0x222244, 0x111122)
    grid.position.y = -2.5
    scene.add(grid)

    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(300 * 3)
    for (let i = 0; i < 300 * 3; i += 3) {
      sp[i] = (Math.random() - 0.5) * 14
      sp[i + 1] = (Math.random() - 0.5) * 8
      sp[i + 2] = (Math.random() - 0.5) * 14
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.015, transparent: true, opacity: 0.4 })))

    function animate() {
      requestAnimationFrame(animate)
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
    return () => { window.removeEventListener("resize", hr); container.removeChild(renderer.domElement) }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white flex flex-col">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 z-10">
        <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-xl font-bold text-purple-400">🎯 d-orbitallar — 3D model</h1>
          <p className="text-purple-400 text-sm">Barcha 5 ta d-orbital • Sichqoncha bilan aylantiring</p>
        </div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-400"></div><span className="text-sm text-purple-300">dxy</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-400"></div><span className="text-sm text-purple-300">dxz</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-blue-400"></div><span className="text-sm text-purple-300">dyz</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-orange-400"></div><span className="text-sm text-purple-300">dz²</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-pink-400"></div><span className="text-sm text-purple-300">dx²−y²</span></div>
      </div>
    </main>
  )
}