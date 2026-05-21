"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Boglanish3D() {
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
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 2; controls.maxDistance = 10

    scene.add(new THREE.AmbientLight(0x404060, 0.8))
    const l1 = new THREE.DirectionalLight(0xffffff, 1); l1.position.set(5, 5, 5); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0xff88cc, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)

    // ===== CHAP TOMON — NITRO [Co(NH₃)₅NO₂]²⁺ =====
    const leftCenter = new THREE.Vector3(-2.5, 0, 0)
    
    // Co — Ko'k-binafsha
    const coGeo1 = new THREE.SphereGeometry(0.32, 64, 64)
    const coMat1 = new THREE.MeshStandardMaterial({ color: 0x3D4B8C, roughness: 0.2, metalness: 0.9 })
    const co1 = new THREE.Mesh(coGeo1, coMat1); co1.position.copy(leftCenter); scene.add(co1)

    // NO₂ — N orqali (nitro)
    const nitroPos = new THREE.Vector3(-2.5 + 1.5, 0, 0)
    // N (ko'k)
    const nNitroGeo = new THREE.SphereGeometry(0.22, 32, 32)
    const nNitro = new THREE.Mesh(nNitroGeo, new THREE.MeshStandardMaterial({ color: 0x3050F8, roughness: 0.4, metalness: 0.3 }))
    nNitro.position.copy(nitroPos); scene.add(nNitro)
    // O (qizil) — 2 ta
    const oAngle = Math.PI / 4
    const oDist = 0.5
    for (const sign of [-1, 1]) {
      const ox = nitroPos.x + oDist * Math.cos(oAngle)
      const oy = sign * oDist * Math.sin(oAngle)
      const oGeo = new THREE.SphereGeometry(0.18, 32, 32)
      const oMat = new THREE.MeshStandardMaterial({ color: 0xFF0D0D, roughness: 0.4, metalness: 0.2 })
      const oMesh = new THREE.Mesh(oGeo, oMat); oMesh.position.set(ox, oy, nitroPos.z); scene.add(oMesh)
      createBond(nitroPos, new THREE.Vector3(ox, oy, nitroPos.z), 0x883333)
    }
    createBond(leftCenter, nitroPos, 0x446688)

    // 5 ta NH₃ — N (ko'k) + H (oq)
    const nh3Dirs = [
      [-1.5, 0, 1.2], [-1.5, 0, -1.2], [-2.5, 1.5, 0], [-2.5, -1.5, 0], [-2.5, 0.8, 1.0]
    ]
    nh3Dirs.forEach(dir => {
      const nx = leftCenter.x + dir[0], ny = leftCenter.y + dir[1], nz = leftCenter.z + dir[2]
      const len = Math.sqrt(dir[0]**2 + dir[1]**2 + dir[2]**2)
      const ux = dir[0]/len*1.4, uy = dir[1]/len*1.4, uz = dir[2]/len*1.4
      const nPos = new THREE.Vector3(leftCenter.x + ux, leftCenter.y + uy, leftCenter.z + uz)
      
      const nGeo = new THREE.SphereGeometry(0.2, 32, 32)
      const nMesh = new THREE.Mesh(nGeo, new THREE.MeshStandardMaterial({ color: 0x3050F8, roughness: 0.4, metalness: 0.3 }))
      nMesh.position.copy(nPos); scene.add(nMesh)

      // H atomlari
      for (let h = 0; h < 3; h++) {
        const hGeo = new THREE.SphereGeometry(0.1, 16, 16)
        const hMesh = new THREE.Mesh(hGeo, new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, metalness: 0.1 }))
        hMesh.position.set(nPos.x + (Math.random()-0.5)*0.5, nPos.y + (Math.random()-0.5)*0.5, nPos.z + (Math.random()-0.5)*0.5)
        scene.add(hMesh)
      }

      createBond(leftCenter, nPos, 0x446688)
    })

    // Label
    const leftLabel = document.createElement("div")
    leftLabel.style.cssText = "position:absolute;top:20%;left:15%;color:#FFD123;font-size:14px;font-weight:bold;text-align:center;pointer-events:none;text-shadow:0 0 10px rgba(0,0,0,0.8)"
    leftLabel.innerHTML = "NITRO<br/>[Co(NH₃)₅NO₂]²⁺<br/><span style='color:#FFD123'>Sariq</span>"
    container.appendChild(leftLabel)

    // ===== O'NG TOMON — NITRITO [Co(NH₃)₅ONO]²⁺ =====
    const rightCenter = new THREE.Vector3(2.5, 0, 0)
    
    // Co
    const coGeo2 = new THREE.SphereGeometry(0.32, 64, 64)
    const co2 = new THREE.Mesh(coGeo2, coMat1); co2.position.copy(rightCenter); scene.add(co2)

    // ONO — O orqali (nitrito)
    const oBondPos = new THREE.Vector3(2.5 + 1.3, 0, 0)
    const oBondGeo = new THREE.SphereGeometry(0.2, 32, 32)
    const oBond = new THREE.Mesh(oBondGeo, new THREE.MeshStandardMaterial({ color: 0xFF0D0D, roughness: 0.4, metalness: 0.2 }))
    oBond.position.copy(oBondPos); scene.add(oBond)
    createBond(rightCenter, oBondPos, 0x884444)

    // N (ko'k)
    const nNitritoPos = new THREE.Vector3(2.5 + 1.8, 0, 0)
    const nNitritoGeo = new THREE.SphereGeometry(0.18, 32, 32)
    const nNitrito = new THREE.Mesh(nNitritoGeo, new THREE.MeshStandardMaterial({ color: 0x3050F8, roughness: 0.4, metalness: 0.3 }))
    nNitrito.position.copy(nNitritoPos); scene.add(nNitrito)
    createBond(oBondPos, nNitritoPos, 0x446688)

    // O (qizil) — 2 ta
    for (const sign of [-1, 1]) {
      const ox = nNitritoPos.x + 0.3
      const oy = sign * 0.4
      const oGeo = new THREE.SphereGeometry(0.16, 32, 32)
      const oMesh = new THREE.Mesh(oGeo, new THREE.MeshStandardMaterial({ color: 0xFF0D0D, roughness: 0.4, metalness: 0.2 }))
      oMesh.position.set(ox, oy, nNitritoPos.z); scene.add(oMesh)
      createBond(nNitritoPos, new THREE.Vector3(ox, oy, nNitritoPos.z), 0x883333)
    }

    // 5 ta NH₃
    nh3Dirs.forEach(dir => {
      const nx = rightCenter.x + dir[0], ny = rightCenter.y + dir[1], nz = rightCenter.z + dir[2]
      const len = Math.sqrt(dir[0]**2 + dir[1]**2 + dir[2]**2)
      const ux = dir[0]/len*1.4, uy = dir[1]/len*1.4, uz = dir[2]/len*1.4
      const nPos = new THREE.Vector3(rightCenter.x + ux, rightCenter.y + uy, rightCenter.z + uz)
      
      const nGeo = new THREE.SphereGeometry(0.2, 32, 32)
      const nMesh = new THREE.Mesh(nGeo, new THREE.MeshStandardMaterial({ color: 0x3050F8, roughness: 0.4, metalness: 0.3 }))
      nMesh.position.copy(nPos); scene.add(nMesh)

      for (let h = 0; h < 3; h++) {
        const hGeo = new THREE.SphereGeometry(0.1, 16, 16)
        const hMesh = new THREE.Mesh(hGeo, new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, metalness: 0.1 }))
        hMesh.position.set(nPos.x + (Math.random()-0.5)*0.5, nPos.y + (Math.random()-0.5)*0.5, nPos.z + (Math.random()-0.5)*0.5)
        scene.add(hMesh)
      }

      createBond(rightCenter, nPos, 0x446688)
    })

    const rightLabel = document.createElement("div")
    rightLabel.style.cssText = "position:absolute;top:20%;right:15%;color:#FF6B6B;font-size:14px;font-weight:bold;text-align:center;pointer-events:none;text-shadow:0 0 10px rgba(0,0,0,0.8)"
    rightLabel.innerHTML = "NITRITO<br/>[Co(NH₃)₅ONO]²⁺<br/><span style='color:#FF6B6B'>Qizg'ish</span>"
    container.appendChild(rightLabel)

    function createBond(s, e, c) {
      const d = new THREE.Vector3().subVectors(e, s), l = d.length(), m = new THREE.Vector3().addVectors(s, e).multiplyScalar(.5)
      const bg = new THREE.CylinderGeometry(.04, .04, l, 8)
      const b = new THREE.Mesh(bg, new THREE.MeshStandardMaterial({ color: c, roughness: .5, metalness: .2, transparent: true, opacity: .45 }))
      b.position.copy(m); b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()))
      scene.add(b)
    }

    // Grid
    const grid = new THREE.GridHelper(8, 20, 0x222244, 0x111122); grid.position.y = -2.5; scene.add(grid)

    // Stars
    const starsGeo = new THREE.BufferGeometry(); const sp = new Float32Array(300 * 3)
    for (let i = 0; i < 300 * 3; i += 3) { sp[i] = (Math.random() - .5) * 12; sp[i + 1] = (Math.random() - .5) * 8; sp[i + 2] = (Math.random() - .5) * 12 }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: .01, transparent: true, opacity: .4 })))

    function animate() {
      requestAnimationFrame(animate)
      co1.rotation.y += 0.003; co2.rotation.y += 0.003
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
        <Link href="/oquv/izomeriyasi/tuzilish/boglanish" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div><h1 className="text-xl font-bold text-pink-400">🔗 Bog'lanish izomeriyasi — 3D</h1><p className="text-purple-400 text-sm">Nitro (chap) vs Nitrito (o'ng) • CPK ranglarda</p></div>
      </header>
      <div ref={containerRef} className="flex-1 w-full relative" />
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center"><div className="text-xs text-yellow-400">Nitro</div><div className="text-lg font-bold text-white">N orqali</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Farqi</div><div className="text-lg font-bold text-white">Bog'lanish atomi</div></div>
        <div className="text-center"><div className="text-xs text-red-400">Nitrito</div><div className="text-lg font-bold text-white">O orqali</div></div>
      </div>
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3D4B8C]"></div><span className="text-sm text-purple-300">Co — Kobalt</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3050F8]"></div><span className="text-sm text-purple-300">N — Azot</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#FF0D0D]"></div><span className="text-sm text-purple-300">O — Kislorod</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white"></div><span className="text-sm text-purple-300">H — Vodorod</span></div>
      </div>
    </main>
  )
}