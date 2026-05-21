"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function MODiagramma3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(6, 4, 6)
    camera.lookAt(0, 0.5, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 3; controls.maxDistance = 14

    scene.add(new THREE.AmbientLight(0x404060, 0.9))
    const l1 = new THREE.DirectionalLight(0xffffff, 1); l1.position.set(5, 8, 5); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0xffcc88, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)

    // Markaziy atom — Metall (oltin rang)
    const metalGeo = new THREE.SphereGeometry(0.3, 64, 64)
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xFFD123, roughness: 0.2, metalness: 0.9 })
    const metal = new THREE.Mesh(metalGeo, metalMat)
    metal.position.set(0, 3, 0)
    scene.add(metal)

    // Metall glow
    const metalGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.36, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xFFD123, transparent: true, opacity: 0.15 })
    )
    metalGlow.position.copy(metal.position)
    scene.add(metalGlow)

    // Metall sath — koordinata chizig'i
    const metalLevel = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.05, 0.05),
      new THREE.MeshBasicMaterial({ color: 0xFFD123 })
    )
    metalLevel.position.y = 3
    scene.add(metalLevel)

    // Ligand sathlari
    const ligandY = -2

    // 6 ta ligand — kichik sharlar (ko'k)
    const ligandGeo = new THREE.SphereGeometry(0.2, 32, 32)
    const ligandMat = new THREE.MeshStandardMaterial({ color: 0x3050F8, roughness: 0.4, metalness: 0.3 })

    for (let i = -2.5; i <= 2.5; i += 1) {
      const ligand = new THREE.Mesh(ligandGeo, ligandMat)
      ligand.position.set(i, ligandY, 0)
      scene.add(ligand)
    }

    const ligandLevel = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 0.05, 0.05),
      new THREE.MeshBasicMaterial({ color: 0x3050F8 })
    )
    ligandLevel.position.y = ligandY
    scene.add(ligandLevel)

    // MO darajalari — rangli panellar
    const moLevels = [
      { y: 2.2, label: "eg* (bo'shashtiruvchi)", color: 0xff4444, width: 2.5, electrons: "bo'sh" },
      { y: 1.0, label: "t₂g (bog'lamaydigan)", color: 0x888888, width: 3.5, electrons: "d-e⁻" },
      { y: -0.5, label: "Bog'lovchi MO (eg, t₁u, a₁g)", color: 0x44ff44, width: 5.0, electrons: "12 e⁻" },
    ]

    moLevels.forEach((level, i) => {
      // Panel
      const panelGeo = new THREE.BoxGeometry(level.width, 0.25, 0.6)
      const panelMat = new THREE.MeshStandardMaterial({
        color: level.color,
        roughness: 0.4,
        metalness: 0.2,
        transparent: true,
        opacity: 0.7
      })
      const panel = new THREE.Mesh(panelGeo, panelMat)
      panel.position.y = level.y
      scene.add(panel)

      // Label
      const div = document.createElement("div")
      div.style.cssText = `position:absolute;color:#${level.color.toString(16).padStart(6,'0')};font-size:13px;font-weight:bold;pointer-events:none;text-shadow:0 0 8px rgba(0,0,0,0.9);white-space:nowrap`
      div.innerHTML = `${level.label}<br/><span style='font-size:10px;color:#aaa'>${level.electrons}</span>`
      div.style.left = "55%"
      container.appendChild(div)
    })

    // Chiziqlar — metall va ligand orasida
    const lineMat = new THREE.LineDashedMaterial({ color: 0x445566, dashSize: 0.3, gapSize: 0.2 })

    for (let i = -2; i <= 2; i += 0.8) {
      const points = [
        new THREE.Vector3(i, ligandY + 0.3, 0),
        new THREE.Vector3(i + (Math.random() - 0.5) * 0.5, metal.position.y - 0.5, 0)
      ]
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(lineGeo, lineMat)
      line.computeLineDistances()
      scene.add(line)
    }

    // O'qlar
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    // Yuqoriga strelka
    const upArrow = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.5, 8), arrowMat)
    upArrow.position.set(3.5, 3.5, 0)
    scene.add(upArrow)

    // Pastga strelka
    const downArrow = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.5, 8), arrowMat)
    downArrow.position.set(3.5, -0.5, 0)
    downArrow.rotation.z = Math.PI
    scene.add(downArrow)

    // Grid
    const grid = new THREE.GridHelper(8, 20, 0x222244, 0x111122)
    grid.position.y = -4
    scene.add(grid)

    // Stars
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
      metal.rotation.y += 0.003
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
        <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-diagramma" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-xl font-bold text-orange-400">📊 MO diagrammasi — 3D model</h1>
          <p className="text-purple-400 text-sm">Oktaedrik kompleks • Metall + 6 ligand • MO energiya darajalari</p>
        </div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#FFD123]"></div><span className="text-sm text-purple-300">Metall orbitali</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3050F8]"></div><span className="text-sm text-purple-300">Ligand orbitallari</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#44ff44]"></div><span className="text-sm text-purple-300">Bog'lovchi MO</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#888888]"></div><span className="text-sm text-purple-300">Bog'lamaydigan (t₂g)</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#ff4444]"></div><span className="text-sm text-purple-300">Bo'shashtiruvchi (eg*)</span></div>
      </div>
    </main>
  )
}