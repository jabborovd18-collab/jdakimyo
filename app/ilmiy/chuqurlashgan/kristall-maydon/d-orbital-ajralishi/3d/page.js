"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Ajralish3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(7, 4, 7)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 3; controls.maxDistance = 14

    scene.add(new THREE.AmbientLight(0x404060, 0.9))
    const l1 = new THREE.DirectionalLight(0xffffff, 1); l1.position.set(5, 8, 5); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0x8888ff, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)

    // 3 ta zonaga bo'lamiz
    const gap = 4.5

    // ===== 1. ERKIN ION (chapda) =====
    const erkinX = -gap
    addLabel(erkinX, 3.5, "Erkin ion", "#ffffff", "Barcha 5 ta orbital bir xil energiya")
    
    // 5 ta bir xil sath
    for (let i = 0; i < 5; i++) {
      const y = 2 - i * 0.9
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.15, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.2 })
      )
      bar.position.set(erkinX, y, 0)
      scene.add(bar)
    }

    // ===== 2. OKTAEDRIK MAYDON (o'rtada) =====
    const oktX = 0
    addLabel(oktX, 3.5, "Oktaedrik maydon", "#48dbfb", "t₂g + eg")
    
    // eg — qizil (2 ta, yuqorida)
    for (let i = 0; i < 2; i++) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.15, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xff4444, roughness: 0.3, metalness: 0.2, emissive: 0x330000 })
      )
      bar.position.set(oktX, 1.2 - i * 0.9, 0)
      scene.add(bar)
    }

    // t₂g — yashil (3 ta, pastda)
    for (let i = 0; i < 3; i++) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.15, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x44ff44, roughness: 0.3, metalness: 0.2, emissive: 0x003300 })
      )
      bar.position.set(oktX, -0.8 - i * 0.9, 0)
      scene.add(bar)
    }

    // Δo strelkasi
    const deltaGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.8, 8)
    const deltaMesh = new THREE.Mesh(deltaGeo, new THREE.MeshBasicMaterial({ color: 0xFFD123 }))
    deltaMesh.position.set(oktX + 2, 0.2, 0)
    scene.add(deltaMesh)
    
    // Δo label
    const deltaLabel = document.createElement("div")
    deltaLabel.style.cssText = "position:absolute;color:#FFD123;font-size:16px;font-weight:900;pointer-events:none;text-shadow:0 0 8px black"
    deltaLabel.textContent = "Δo"
    container.appendChild(deltaLabel)

    // ===== 3. TETRAEDRIK MAYDON (o'ngda) =====
    const tetX = gap
    addLabel(tetX, 3.5, "Tetraedrik maydon", "#5fdc7c", "t₂ + e (teskari)")
    
    // t₂ — qizil (3 ta, yuqorida)
    for (let i = 0; i < 3; i++) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.15, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xff6644, roughness: 0.3, metalness: 0.2 })
      )
      bar.position.set(tetX, 1.2 - i * 0.9, 0)
      scene.add(bar)
    }

    // e — yashil (2 ta, pastda)
    for (let i = 0; i < 2; i++) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.15, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x66ff66, roughness: 0.3, metalness: 0.2 })
      )
      bar.position.set(tetX, -0.8 - i * 0.9, 0)
      scene.add(bar)
    }

    // Δtet strelkasi
    const deltaTetGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 8)
    const deltaTetMesh = new THREE.Mesh(deltaTetGeo, new THREE.MeshBasicMaterial({ color: 0xFFD123 }))
    deltaTetMesh.position.set(tetX + 2, 0.2, 0)
    scene.add(deltaTetMesh)

    function addLabel(x, y, text, color, subtext) {
      const div = document.createElement("div")
      div.style.cssText = `position:absolute;color:${color};font-size:14px;font-weight:bold;pointer-events:none;text-shadow:0 0 8px black;text-align:center`
      div.innerHTML = `${text}<br/><span style='font-size:10px;color:#aaa'>${subtext}</span>`
      container.appendChild(div)
    }

    // Grid
    const grid = new THREE.GridHelper(12, 30, 0x222244, 0x111122)
    grid.position.y = -4
    scene.add(grid)

    // Stars
    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(300 * 3)
    for (let i = 0; i < 300 * 3; i += 3) {
      sp[i] = (Math.random() - 0.5) * 16
      sp[i + 1] = (Math.random() - 0.5) * 8
      sp[i + 2] = (Math.random() - 0.5) * 16
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
        <Link href="/ilmiy/chuqurlashgan/kristall-maydon/d-orbital-ajralishi" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-xl font-bold text-purple-400">📐 d-orbital ajralishi — 3D model</h1>
          <p className="text-purple-400 text-sm">Erkin ion → Oktaedrik → Tetraedrik • Energiya sathlari</p>
        </div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#888888]"></div><span className="text-sm text-purple-300">Erkin ion (degenerat)</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#ff4444]"></div><span className="text-sm text-purple-300">Destabillashgan</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#44ff44]"></div><span className="text-sm text-purple-300">Stabillashgan</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#FFD123]"></div><span className="text-sm text-purple-300">Δo / Δtet</span></div>
      </div>
    </main>
  )
}