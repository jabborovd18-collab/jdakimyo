"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Uchburchak3D() {
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
    const light1 = new THREE.DirectionalLight(0xffffff, 1)
    light1.position.set(5, 5, 5)
    scene.add(light1)
    const light2 = new THREE.DirectionalLight(0x88ff88, 0.5)
    light2.position.set(-3, -1, -2)
    scene.add(light2)

    // MARKAZIY ATOM — Cu (Mis rang CPK: #C88033)
    const centerGeo = new THREE.SphereGeometry(0.4, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xC88033,
      roughness: 0.25,
      metalness: 0.85
    })
    const centerAtom = new THREE.Mesh(centerGeo, centerMat)
    scene.add(centerAtom)

    const glowGeo = new THREE.SphereGeometry(0.47, 32, 32)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xC88033,
      transparent: true,
      opacity: 0.1
    })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    scene.add(glow)

    // LIGANDLAR — CN⁻ (C qora #1A1A1A, N ko'k #3050F8)
    const dist = 1.8
    const angles = [0, 120, 240].map(d => d * Math.PI / 180)
    
    angles.forEach(angle => {
      const x = dist * Math.cos(angle)
      const z = dist * Math.sin(angle)
      
      // C atomi (qora)
      const cGeo = new THREE.SphereGeometry(0.25, 32, 32)
      const cMat = new THREE.MeshStandardMaterial({
        color: 0x1A1A1A,
        roughness: 0.4,
        metalness: 0.3
      })
      const cMesh = new THREE.Mesh(cGeo, cMat)
      cMesh.position.set(x * 0.65, 0, z * 0.65)
      scene.add(cMesh)

      // N atomi (ko'k)
      const nGeo = new THREE.SphereGeometry(0.22, 32, 32)
      const nMat = new THREE.MeshStandardMaterial({
        color: 0x3050F8,
        roughness: 0.4,
        metalness: 0.2
      })
      const nMesh = new THREE.Mesh(nGeo, nMat)
      nMesh.position.set(x, 0, z)
      scene.add(nMesh)

      // N glow
      const nGlowGeo = new THREE.SphereGeometry(0.27, 16, 16)
      const nGlow = new THREE.Mesh(nGlowGeo, new THREE.MeshBasicMaterial({
        color: 0x3050F8,
        transparent: true,
        opacity: 0.06
      }))
      nGlow.position.copy(nMesh.position)
      scene.add(nGlow)

      // C≡N bog' (C va N orasida)
      createBond(
        new THREE.Vector3(x * 0.65, 0, z * 0.65),
        new THREE.Vector3(x, 0, z),
        0x446688
      )

      // Cu—C bog'
      createBond(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x * 0.65, 0, z * 0.65),
        0x886644
      )
    })

    function createBond(startPos, endPos, color = 0x889999) {
      const direction = new THREE.Vector3().subVectors(endPos, startPos)
      const length = direction.length()
      const midPoint = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5)
      const bondGeo = new THREE.CylinderGeometry(0.05, 0.05, length, 16)
      const bondMat = new THREE.MeshStandardMaterial({
        color, roughness: 0.5, metalness: 0.2, transparent: true, opacity: 0.5
      })
      const bond = new THREE.Mesh(bondGeo, bondMat)
      bond.position.copy(midPoint)
      const axis = new THREE.Vector3(0, 1, 0)
      const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction.normalize())
      bond.setRotationFromQuaternion(quaternion)
      scene.add(bond)
      return bond
    }

    // Uchburchak qirralari
    const cornerPoints = angles.map(a => new THREE.Vector3(dist * Math.cos(a), 0, dist * Math.sin(a)))
    cornerPoints.push(cornerPoints[0].clone())
    const triGeo = new THREE.BufferGeometry().setFromPoints(cornerPoints)
    scene.add(new THREE.Line(triGeo, new THREE.LineDashedMaterial({
      color: 0x446644, dashSize: 0.3, gapSize: 0.15
    })))

    // Yarim shaffof uchburchak
    const shape = new THREE.Shape()
    shape.moveTo(cornerPoints[0].x, cornerPoints[0].z)
    shape.lineTo(cornerPoints[1].x, cornerPoints[1].z)
    shape.lineTo(cornerPoints[2].x, cornerPoints[2].z)
    shape.closePath()
    const shapeGeo = new THREE.ShapeGeometry(shape)
    shapeGeo.rotateX(-Math.PI / 2)
    const shapeMesh = new THREE.Mesh(shapeGeo, new THREE.MeshBasicMaterial({
      color: 0x44ff44, transparent: true, opacity: 0.05, side: THREE.DoubleSide
    }))
    scene.add(shapeMesh)

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

    function animate() {
      requestAnimationFrame(animate)
      const time = Date.now() * 0.001
      glow.scale.setScalar(1 + Math.sin(time * 2) * 0.04)
      centerAtom.rotation.y += 0.003
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

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
        <Link href="/oquv/fazoviy/uchburchak" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-xl font-bold text-green-400">📐 Uchburchak — 3D model</h1>
          <p className="text-purple-400 text-sm">[Cu(CN)₃]²⁻ • CPK ranglarda • Sichqoncha bilan aylantiring</p>
        </div>
      </header>

      <div ref={containerRef} className="flex-1 w-full" />

      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center">
          <div className="text-xs text-purple-400">Valent burchak</div>
          <div className="text-lg font-bold text-white">120°</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-purple-400">Koordinatsion son</div>
          <div className="text-lg font-bold text-white">3</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-purple-400">Gibridlanish</div>
          <div className="text-lg font-bold text-white">sp²</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-purple-400">Simmetriya</div>
          <div className="text-lg font-bold text-white">D₃h</div>
        </div>
      </div>

      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#C88033]"></div>
          <span className="text-sm text-purple-300">Cu — Mis</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#1A1A1A]"></div>
          <span className="text-sm text-purple-300">C — Uglerod</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#3050F8]"></div>
          <span className="text-sm text-purple-300">N — Azot</span>
        </div>
      </div>
    </main>
  )
}