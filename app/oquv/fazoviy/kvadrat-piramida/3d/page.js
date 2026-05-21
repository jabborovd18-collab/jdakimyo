"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function KvadratPiramida3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(4, 3.5, 4)
    camera.lookAt(0, 0.3, 0)

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
    const l2 = new THREE.DirectionalLight(0xff8888, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)

    // V — Kulrang CPK: #A6A6AB
    const centerGeo = new THREE.SphereGeometry(0.4, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({ color: 0xA6A6AB, roughness: 0.2, metalness: 0.9 })
    const centerAtom = new THREE.Mesh(centerGeo, centerMat)
    centerAtom.position.set(0, 0.15, 0)
    scene.add(centerAtom)

    const glowGeo = new THREE.SphereGeometry(0.47, 32, 32)
    const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: 0xA6A6AB, transparent: true, opacity: 0.1 }))
    glow.position.copy(centerAtom.position)
    scene.add(glow)

    const baseDist = 1.8
    const baseY = -0.3

    // BAZAL LIGANDLAR — O (Qizil #FF0D0D)
    const basePositions = [
      [baseDist, baseY, 0],
      [0, baseY, baseDist],
      [-baseDist, baseY, 0],
      [0, baseY, -baseDist]
    ]

    basePositions.forEach(([x, y, z]) => {
      const oGeo = new THREE.SphereGeometry(0.26, 32, 32)
      const oMat = new THREE.MeshStandardMaterial({ color: 0xFF0D0D, roughness: 0.4, metalness: 0.3 })
      const oMesh = new THREE.Mesh(oGeo, oMat)
      oMesh.position.set(x, y, z)
      scene.add(oMesh)

      const oGlowGeo = new THREE.SphereGeometry(0.31, 16, 16)
      const oGlow = new THREE.Mesh(oGlowGeo, new THREE.MeshBasicMaterial({ color: 0xFF0D0D, transparent: true, opacity: 0.08 }))
      oGlow.position.copy(oMesh.position)
      scene.add(oGlow)

      // V—O bog'
      createBond(centerAtom.position.clone(), new THREE.Vector3(x, y, z), 0x884444)
    })

    // APIKAL LIGAND — O (Qizil #FF0D0D)
    const apicalY = 2.3
    const apGeo = new THREE.SphereGeometry(0.3, 32, 32)
    const apMat = new THREE.MeshStandardMaterial({ color: 0xFF0D0D, roughness: 0.35, metalness: 0.3 })
    const apMesh = new THREE.Mesh(apGeo, apMat)
    apMesh.position.set(0, apicalY, 0)
    scene.add(apMesh)

    const apGlowGeo = new THREE.SphereGeometry(0.36, 16, 16)
    const apGlow = new THREE.Mesh(apGlowGeo, new THREE.MeshBasicMaterial({ color: 0xFF0D0D, transparent: true, opacity: 0.1 }))
    apGlow.position.copy(apMesh.position)
    scene.add(apGlow)

    // V=O apikal bog' (qo'sh bog' — qalinroq)
    createBond(centerAtom.position.clone(), new THREE.Vector3(0, apicalY, 0), 0x884444, 0.07)

    function createBond(s, e, c, radius = 0.05) {
      const d = new THREE.Vector3().subVectors(e, s)
      const l = d.length()
      const m = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5)
      const bg = new THREE.CylinderGeometry(radius, radius, l, 16)
      const bm = new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.2, transparent: true, opacity: 0.5 })
      const b = new THREE.Mesh(bg, bm)
      b.position.copy(m)
      b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()))
      scene.add(b)
    }

    // Kvadrat asos chiziqlari
    const basePts = basePositions.map(p => new THREE.Vector3(p[0], baseY, p[2]))
    basePts.push(basePts[0].clone())
    const baseGeo = new THREE.BufferGeometry().setFromPoints(basePts)
    scene.add(new THREE.Line(baseGeo, new THREE.LineDashedMaterial({ color: 0x664444, dashSize: 0.3, gapSize: 0.15 })))

    // Yarim shaffof asos
    const shape = new THREE.Shape()
    shape.moveTo(baseDist, 0); shape.lineTo(0, baseDist); shape.lineTo(-baseDist, 0); shape.lineTo(0, -baseDist); shape.closePath()
    const shapeGeo = new THREE.ShapeGeometry(shape)
    shapeGeo.rotateX(-Math.PI / 2)
    const shapeMesh = new THREE.Mesh(shapeGeo, new THREE.MeshBasicMaterial({ color: 0xff4444, transparent: true, opacity: 0.04, side: THREE.DoubleSide }))
    shapeMesh.position.y = baseY
    scene.add(shapeMesh)

    // Grid
    const grid = new THREE.GridHelper(5, 20, 0x222244, 0x111122)
    grid.position.y = -2.5
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
      const t = Date.now() * 0.001
      glow.scale.setScalar(1 + Math.sin(t * 2) * 0.04)
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
        <Link href="/oquv/fazoviy/kvadrat-piramida" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-xl font-bold text-red-400">🏛️ Kvadrat piramida — 3D</h1>
          <p className="text-purple-400 text-sm">[VO(acac)₂] • Vanadil kompleksi • CPK ranglarda</p>
        </div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center"><div className="text-xs text-purple-400">Valent burchak</div><div className="text-lg font-bold text-white">~90°</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">KS</div><div className="text-lg font-bold text-white">5</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Gibridlanish</div><div className="text-lg font-bold text-white">sp³d</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Simmetriya</div><div className="text-lg font-bold text-white">C₄v</div></div>
      </div>
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#A6A6AB]"></div><span className="text-sm text-purple-300">V — Vanadiy</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#FF0D0D]"></div><span className="text-sm text-purple-300">O — Kislorod (bazal)</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#FF0D0D]"></div><span className="text-sm text-purple-300">O — Kislorod (apikal V=O)</span></div>
      </div>
    </main>
  )
}