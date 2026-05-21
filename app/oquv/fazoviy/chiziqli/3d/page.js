"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Chiziqli3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Sahna
    const scene = new THREE.Scene()

    // Kamera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(3, 1.5, 3)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 2
    controls.maxDistance = 8

    // Yorug'lik
    scene.add(new THREE.AmbientLight(0x404060, 0.8))
    const light1 = new THREE.DirectionalLight(0xffffff, 1)
    light1.position.set(5, 5, 5)
    scene.add(light1)
    const light2 = new THREE.DirectionalLight(0x8899ff, 0.5)
    light2.position.set(-3, -1, -2)
    scene.add(light2)

    // MARKAZIY ATOM — Ag (Kumushrang CPK: #C0C0D0)
    const centerGeo = new THREE.SphereGeometry(0.45, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xC0C0D0,
      roughness: 0.2,
      metalness: 0.9
    })
    const centerAtom = new THREE.Mesh(centerGeo, centerMat)
    scene.add(centerAtom)

    // Glow
    const glowGeo = new THREE.SphereGeometry(0.52, 32, 32)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xC0C0D0,
      transparent: true,
      opacity: 0.1
    })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    scene.add(glow)

    // AZOT LIGANDLARI — N (Ko'k CPK: #3050F8)
    const dist = 1.8
    const ligandPositions = [
      { pos: [dist, 0, 0] },
      { pos: [-dist, 0, 0] }
    ]

    ligandPositions.forEach(({ pos }) => {
      // N atomi
      const nGeo = new THREE.SphereGeometry(0.3, 32, 32)
      const nMat = new THREE.MeshStandardMaterial({
        color: 0x3050F8,
        roughness: 0.4,
        metalness: 0.2
      })
      const nMesh = new THREE.Mesh(nGeo, nMat)
      nMesh.position.set(pos[0], pos[1], pos[2])
      scene.add(nMesh)

      // N glow
      const nGlowGeo = new THREE.SphereGeometry(0.36, 16, 16)
      const nGlowMat = new THREE.MeshBasicMaterial({
        color: 0x3050F8,
        transparent: true,
        opacity: 0.08
      })
      const nGlow = new THREE.Mesh(nGlowGeo, nGlowMat)
      nGlow.position.copy(nMesh.position)
      scene.add(nGlow)

      // H atomlari (NH₃ da 3 ta H) — Vodorod (Oq CPK: #FFFFFF)
      const hDist = 0.5
      const hOffset = 0.35
      const hPositions = [
        [pos[0] + (pos[0] > 0 ? hOffset : -hOffset), hDist, 0],
        [pos[0] + (pos[0] > 0 ? hOffset : -hOffset), -hDist / 2, hDist * 0.866],
        [pos[0] + (pos[0] > 0 ? hOffset : -hOffset), -hDist / 2, -hDist * 0.866]
      ]

      hPositions.forEach(([hx, hy, hz]) => {
        const hGeo = new THREE.SphereGeometry(0.15, 16, 16)
        const hMat = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          roughness: 0.5,
          metalness: 0.1
        })
        const hMesh = new THREE.Mesh(hGeo, hMat)
        hMesh.position.set(hx, hy, hz)
        scene.add(hMesh)
      })

      // Bog' (Ag — N)
      createBond(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(pos[0], pos[1], pos[2]),
        0x667788
      )
    })

    function createBond(startPos, endPos, color = 0x889999) {
      const direction = new THREE.Vector3().subVectors(endPos, startPos)
      const length = direction.length()
      const midPoint = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5)

      const bondGeo = new THREE.CylinderGeometry(0.06, 0.06, length, 16)
      const bondMat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        metalness: 0.2,
        transparent: true,
        opacity: 0.5
      })
      const bond = new THREE.Mesh(bondGeo, bondMat)
      bond.position.copy(midPoint)

      const axis = new THREE.Vector3(0, 1, 0)
      const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.normalize())
      bond.setRotationFromQuaternion(quaternion)
      scene.add(bond)
      return bond
    }

    // O'q chizig'i
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(3, 0, 0)
    ])
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x445566,
      dashSize: 0.3,
      gapSize: 0.15
    })
    const line = new THREE.Line(lineGeo, lineMat)
    line.computeLineDistances()
    scene.add(line)

    // Burchak yoyi
    const curve = new THREE.EllipseCurve(0, 0, 0.5, 0.5, 0, Math.PI, false, 0)
    const curvePoints = curve.getPoints(50)
    const arcPoints = curvePoints.map(p => new THREE.Vector3(p.x, p.y + 0.6, 0))
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints)
    const arc = new THREE.Line(arcGeo, new THREE.LineBasicMaterial({ color: 0xffffff }))
    scene.add(arc)

    // Grid
    const grid = new THREE.GridHelper(5, 20, 0x222244, 0x111122)
    grid.position.y = -1.5
    scene.add(grid)

    // Fon yulduzlari
    const starsGeo = new THREE.BufferGeometry()
    const starsPos = new Float32Array(200 * 3)
    for (let i = 0; i < 200 * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 10
      starsPos[i + 1] = (Math.random() - 0.5) * 6
      starsPos[i + 2] = (Math.random() - 0.5) * 10
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starsPos, 3))
    scene.add(new THREE.Points(starsGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.01, transparent: true, opacity: 0.4 })
    ))

    // Animatsiya
    function animate() {
      requestAnimationFrame(animate)
      const time = Date.now() * 0.001
      glow.scale.setScalar(1 + Math.sin(time * 2) * 0.04)
      centerAtom.rotation.y += 0.003
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white flex flex-col">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 z-10">
        <Link href="/oquv/fazoviy/chiziqli" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-xl font-bold text-blue-400">📏 Chiziqli — 3D model</h1>
          <p className="text-purple-400 text-sm">[Ag(NH₃)₂]⁺ • CPK ranglarda • Sichqoncha bilan aylantiring</p>
        </div>
      </header>

      {/* 3D Container */}
      <div ref={containerRef} className="flex-1 w-full" />

      {/* Info panel */}
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center">
          <div className="text-xs text-purple-400">Valent burchak</div>
          <div className="text-lg font-bold text-white">180°</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-purple-400">Koordinatsion son</div>
          <div className="text-lg font-bold text-white">2</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-purple-400">Gibridlanish</div>
          <div className="text-lg font-bold text-white">sp</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-purple-400">Simmetriya</div>
          <div className="text-lg font-bold text-white">D∞h</div>
        </div>
      </div>

      {/* Ranglar legendasi */}
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#C0C0D0]"></div>
          <span className="text-sm text-purple-300">Ag — Kumush</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#3050F8]"></div>
          <span className="text-sm text-purple-300">N — Azot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white"></div>
          <span className="text-sm text-purple-300">H — Vodorod</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#667788]"></div>
          <span className="text-sm text-purple-300">Koordinatsion bog'</span>
        </div>
      </div>
    </main>
  )
}