"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Optik3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(5, 3, 5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 3
    controls.maxDistance = 12

    scene.add(new THREE.AmbientLight(0x404060, 0.9))
    const l1 = new THREE.DirectionalLight(0xffffff, 1)
    l1.position.set(5, 8, 5)
    scene.add(l1)
    const l2 = new THREE.DirectionalLight(0x88ff88, 0.5)
    l2.position.set(-3, -1, -2)
    scene.add(l2)
    const l3 = new THREE.PointLight(0xffffff, 0.3, 20)
    l3.position.set(0, 0, 0)
    scene.add(l3)

    // ===== RANGLAR =====
    // Co — Ko'k-binafsha #3D4B8C
    // N (en) — Ko'k #3050F8
    // Cl — Yashil #1FF01F
    // C (en) — Qora #1A1A1A
    // H — Oq #FFFFFF

    const gap = 4.5
    const dist = 1.3

    function createBond(s, e, c, radius = 0.04) {
      const d = new THREE.Vector3().subVectors(e, s)
      const l = d.length()
      const m = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5)
      const bg = new THREE.CylinderGeometry(radius, radius, l, 16)
      const bm = new THREE.MeshStandardMaterial({
        color: c,
        roughness: 0.5,
        metalness: 0.2,
        transparent: true,
        opacity: 0.5
      })
      const b = new THREE.Mesh(bg, bm)
      b.position.copy(m)
      b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0), d.normalize()
      ))
      scene.add(b)
    }

    function addAtom(x, y, z, color, size = 0.2, roughness = 0.4, metalness = 0.3) {
      const geo = new THREE.SphereGeometry(size, 32, 32)
      const mat = new THREE.MeshStandardMaterial({ color, roughness, metalness })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      scene.add(mesh)
      return mesh
    }

    function addGlow(x, y, z, color, size = 0.42) {
      const geo = new THREE.SphereGeometry(size, 32, 32)
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      scene.add(mesh)
    }

    // Oktaedr yo'nalishlari
    const oktaDirs = [
      [1, 0, 0], [-1, 0, 0],
      [0, 1, 0], [0, -1, 0],
      [0, 0, 1], [0, 0, -1]
    ]

    // ===== CHAP TOMON: Λ (lambda) =====
    const leftX = -gap / 2

    // Co markaziy atom
    addAtom(leftX, 0, 0, 0x3D4B8C, 0.35, 0.2, 0.9)
    addGlow(leftX, 0, 0, 0x3D4B8C)

    // 2 ta Cl — yonma-yon (x va z)
    const clLeft1 = addAtom(leftX + dist, 0, 0, 0x1FF01F, 0.24)
    const clLeft2 = addAtom(leftX, 0, dist, 0x1FF01F, 0.24)
    createBond(
      new THREE.Vector3(leftX, 0, 0),
      new THREE.Vector3(leftX + dist, 0, 0),
      0x448844
    )
    createBond(
      new THREE.Vector3(leftX, 0, 0),
      new THREE.Vector3(leftX, 0, dist),
      0x448844
    )

    // 4 ta N (en ligandlari) — ko'prik shaklida
    // en 1: Nlar (-1,0,0) va (0,-1,0)
    const nLeft1 = addAtom(leftX - dist, 0, 0, 0x3050F8, 0.22)
    const nLeft2 = addAtom(leftX, -dist, 0, 0x3050F8, 0.22)
    createBond(new THREE.Vector3(leftX, 0, 0), new THREE.Vector3(leftX - dist, 0, 0), 0x444488)
    createBond(new THREE.Vector3(leftX, 0, 0), new THREE.Vector3(leftX, -dist, 0), 0x444488)
    // en ko'prigi (C-C)
    const enBridge1 = new THREE.Vector3(leftX - dist * 0.5, -dist * 0.5, 0)
    addAtom(enBridge1.x, enBridge1.y, enBridge1.z, 0x1A1A1A, 0.14)
    createBond(new THREE.Vector3(leftX - dist, 0, 0), enBridge1, 0x446688)
    createBond(new THREE.Vector3(leftX, -dist, 0), enBridge1, 0x446688)

    // en 2: Nlar (0,0,-1) va (0,1,0)
    const nLeft3 = addAtom(leftX, 0, -dist, 0x3050F8, 0.22)
    const nLeft4 = addAtom(leftX, dist, 0, 0x3050F8, 0.22)
    createBond(new THREE.Vector3(leftX, 0, 0), new THREE.Vector3(leftX, 0, -dist), 0x444488)
    createBond(new THREE.Vector3(leftX, 0, 0), new THREE.Vector3(leftX, dist, 0), 0x444488)
    const enBridge2 = new THREE.Vector3(leftX, dist * 0.5, -dist * 0.5)
    addAtom(enBridge2.x, enBridge2.y, enBridge2.z, 0x1A1A1A, 0.14)
    createBond(new THREE.Vector3(leftX, 0, -dist), enBridge2, 0x446688)
    createBond(new THREE.Vector3(leftX, dist, 0), enBridge2, 0x446688)

    // Label Λ
    const leftLabel = document.createElement("div")
    leftLabel.style.cssText = "position:absolute;top:8%;left:8%;color:#48dbfb;font-size:28px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 15px rgba(72,219,251,0.5)"
    leftLabel.innerHTML = "Λ (lambda)<br/><span style='font-size:12px;color:#aaa'>Chapga buruvchi</span>"
    container.appendChild(leftLabel)

    // ===== O'NG TOMON: Δ (delta) =====
    const rightX = gap / 2

    addAtom(rightX, 0, 0, 0x3D4B8C, 0.35, 0.2, 0.9)
    addGlow(rightX, 0, 0, 0x3D4B8C)

    // 2 ta Cl — yonma-yon (lekin teskari yo'nalishda)
    const clRight1 = addAtom(rightX + dist, 0, 0, 0x1FF01F, 0.24)
    const clRight2 = addAtom(rightX, 0, -dist, 0x1FF01F, 0.24)
    createBond(new THREE.Vector3(rightX, 0, 0), new THREE.Vector3(rightX + dist, 0, 0), 0x448844)
    createBond(new THREE.Vector3(rightX, 0, 0), new THREE.Vector3(rightX, 0, -dist), 0x448844)

    // en 1: Nlar (-1,0,0) va (0,1,0) — teskari
    const nRight1 = addAtom(rightX - dist, 0, 0, 0x3050F8, 0.22)
    const nRight2 = addAtom(rightX, dist, 0, 0x3050F8, 0.22)
    createBond(new THREE.Vector3(rightX, 0, 0), new THREE.Vector3(rightX - dist, 0, 0), 0x444488)
    createBond(new THREE.Vector3(rightX, 0, 0), new THREE.Vector3(rightX, dist, 0), 0x444488)
    const enBridge3 = new THREE.Vector3(rightX - dist * 0.5, dist * 0.5, 0)
    addAtom(enBridge3.x, enBridge3.y, enBridge3.z, 0x1A1A1A, 0.14)
    createBond(new THREE.Vector3(rightX - dist, 0, 0), enBridge3, 0x446688)
    createBond(new THREE.Vector3(rightX, dist, 0), enBridge3, 0x446688)

    // en 2: Nlar (0,-1,0) va (0,0,1)
    const nRight3 = addAtom(rightX, -dist, 0, 0x3050F8, 0.22)
    const nRight4 = addAtom(rightX, 0, dist, 0x3050F8, 0.22)
    createBond(new THREE.Vector3(rightX, 0, 0), new THREE.Vector3(rightX, -dist, 0), 0x444488)
    createBond(new THREE.Vector3(rightX, 0, 0), new THREE.Vector3(rightX, 0, dist), 0x444488)
    const enBridge4 = new THREE.Vector3(rightX, -dist * 0.5, dist * 0.5)
    addAtom(enBridge4.x, enBridge4.y, enBridge4.z, 0x1A1A1A, 0.14)
    createBond(new THREE.Vector3(rightX, -dist, 0), enBridge4, 0x446688)
    createBond(new THREE.Vector3(rightX, 0, dist), enBridge4, 0x446688)

    // Label Δ
    const rightLabel = document.createElement("div")
    rightLabel.style.cssText = "position:absolute;top:8%;right:8%;color:#f368e0;font-size:28px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 15px rgba(243,104,224,0.5)"
    rightLabel.innerHTML = "Δ (delta)<br/><span style='font-size:12px;color:#aaa'>O'ngga buruvchi</span>"
    container.appendChild(rightLabel)

    // Oyna belgisi
    const mirrorLabel = document.createElement("div")
    mirrorLabel.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#FFD123;font-size:16px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 10px rgba(0,0,0,0.9)"
    mirrorLabel.innerHTML = "🪞<br/>Oyna<br/>aksi"
    container.appendChild(mirrorLabel)

    // Grid
    const grid = new THREE.GridHelper(10, 30, 0x222244, 0x111122)
    grid.position.y = -2.5
    scene.add(grid)

    // Stars
    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(400 * 3)
    for (let i = 0; i < 400 * 3; i += 3) {
      sp[i] = (Math.random() - 0.5) * 14
      sp[i + 1] = (Math.random() - 0.5) * 8
      sp[i + 2] = (Math.random() - 0.5) * 14
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.012,
      transparent: true,
      opacity: 0.5
    })))

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
    return () => {
      window.removeEventListener("resize", hr)
      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white flex flex-col">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 z-10">
        <Link href="/oquv/izomeriyasi/stereo/optik" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-xl font-bold text-green-400">🔮 Optik izomeriya — 3D</h1>
          <p className="text-purple-400 text-sm">Λ (lambda) vs Δ (delta) • [Co(en)₂Cl₂]⁺ • CPK ranglarda</p>
        </div>
      </header>
      <div ref={containerRef} className="flex-1 w-full relative" />
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3D4B8C]"></div><span className="text-sm text-purple-300">Co — Kobalt</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#1FF01F]"></div><span className="text-sm text-purple-300">Cl — Xlor</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3050F8]"></div><span className="text-sm text-purple-300">N — Azot (en)</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#1A1A1A]"></div><span className="text-sm text-purple-300">C — Uglerod (en)</span></div>
      </div>
    </main>
  )
}