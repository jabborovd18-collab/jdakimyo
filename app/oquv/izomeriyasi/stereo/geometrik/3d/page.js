"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Geometrik3D() {
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
    const l2 = new THREE.DirectionalLight(0x8899ff, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)
    const l3 = new THREE.PointLight(0xffffff, 0.3, 20); l3.position.set(0, 0, 0); scene.add(l3)

    // ===== RANGLAR =====
    // Pt — Kumushrang #D0D0E0
    // Cl — Yashil #1FF01F
    // N (NH₃) — Ko'k #3050F8
    // H — Oq #FFFFFF
    // Co — Ko'k-binafsha #3D4B8C

    // ===== 1-QISM: SIS-TRANS [PtCl₂(NH₃)₂] =====
    const sisX = -3.5
    const transX = -0.5
    const topY = 2.2
    const dist = 1.2

    // ---- SIS (chapda) ----
    const ptSisGeo = new THREE.SphereGeometry(0.35, 64, 64)
    const ptMat = new THREE.MeshStandardMaterial({ color: 0xD0D0E0, roughness: 0.15, metalness: 0.95 })
    const ptSis = new THREE.Mesh(ptSisGeo, ptMat)
    ptSis.position.set(sisX, topY, 0); scene.add(ptSis)

    // Cl lar yonma-yon (z=dist va x=dist)
    const sisLigands = [
      { x: sisX + dist, z: 0, type: "Cl", color: 0x1FF01F },
      { x: sisX, z: dist, type: "Cl", color: 0x1FF01F },
      { x: sisX - dist, z: 0, type: "N", color: 0x3050F8 },
      { x: sisX, z: -dist, type: "N", color: 0x3050F8 },
    ]

    sisLigands.forEach(({ x, z, type, color }) => {
      const size = type === "Cl" ? 0.22 : 0.2
      const geo = new THREE.SphereGeometry(size, 32, 32)
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.3 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, topY, z); scene.add(mesh)
      createBond(ptSis.position, new THREE.Vector3(x, topY, z), type === "Cl" ? 0x448844 : 0x444488)

      if (type === "N") {
        addHAtoms(x, topY, z)
      }
    })

    // Sis label
    addLabel(sisX, topY + 1.8, "sis-[PtCl₂(NH₃)₂]", "#48dbfb", "SISPLATIN — Saraton davosi")

    // ---- TRANS (o'ngda) ----
    const ptTrans = new THREE.Mesh(ptSisGeo, ptMat)
    ptTrans.position.set(transX, topY, 0); scene.add(ptTrans)

    const transLigands = [
      { x: transX + dist, z: 0, type: "Cl", color: 0x1FF01F },
      { x: transX - dist, z: 0, type: "Cl", color: 0x1FF01F },
      { x: transX, z: dist, type: "N", color: 0x3050F8 },
      { x: transX, z: -dist, type: "N", color: 0x3050F8 },
    ]

    transLigands.forEach(({ x, z, type, color }) => {
      const size = type === "Cl" ? 0.22 : 0.2
      const geo = new THREE.SphereGeometry(size, 32, 32)
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.3 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, topY, z); scene.add(mesh)
      createBond(ptTrans.position, new THREE.Vector3(x, topY, z), type === "Cl" ? 0x448844 : 0x444488)

      if (type === "N") {
        addHAtoms(x, topY, z)
      }
    })

    // Trans label
    addLabel(transX, topY + 1.8, "trans-[PtCl₂(NH₃)₂]", "#ff9f43", "Biologik faol EMAS")

    // O'rtadagi "VS" belgisi
    addLabel(-2, topY + 1.2, "VS", "#FFD123", "")

    // ===== 2-QISM: FAC-MER [Co(NH₃)₃Cl₃] =====
    const facX = -3.5
    const merX = -0.5
    const botY = -2.2
    const oktaDirs = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]

    // ---- FAC (chapda) ----
    const coFacGeo = new THREE.SphereGeometry(0.35, 64, 64)
    const coMat = new THREE.MeshStandardMaterial({ color: 0x3D4B8C, roughness: 0.2, metalness: 0.9 })
    const coFac = new THREE.Mesh(coFacGeo, coMat)
    coFac.position.set(facX, botY, 0); scene.add(coFac)

    // fac — 3 ta Cl bir yuzda (x, y, z musbat)
    const facClDirs = [[1,0,0],[0,1,0],[0,0,1]]
    const facCl = []
    const facN = []
    oktaDirs.forEach(([dx,dy,dz]) => {
      const isCl = facClDirs.some(([cx,cy,cz]) => cx===dx && cy===dy && cz===dz)
      const color = isCl ? 0x1FF01F : 0x3050F8
      const size = isCl ? 0.22 : 0.2
      const pos = new THREE.Vector3(facX + dx*dist, botY + dy*dist, dz*dist)
      
      const geo = new THREE.SphereGeometry(size, 32, 32)
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.3 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(pos); scene.add(mesh)
      createBond(coFac.position, pos, isCl ? 0x448844 : 0x444488)

      if (!isCl) addHAtoms(pos.x, pos.y, pos.z)
    })

    addLabel(facX, botY + 1.8, "fac-[Co(NH₃)₃Cl₃]", "#5fdc7c", "3 ta Cl bir yuzda")

    // ---- MER (o'ngda) ----
    const coMer = new THREE.Mesh(coFacGeo, coMat)
    coMer.position.set(merX, botY, 0); scene.add(coMer)

    // mer — 2 ta Cl qarama-qarshi (x va -x), 1 ta Cl perpendikulyar (y)
    const merClDirs = [[1,0,0],[-1,0,0],[0,1,0]]
    oktaDirs.forEach(([dx,dy,dz]) => {
      const isCl = merClDirs.some(([cx,cy,cz]) => cx===dx && cy===dy && cz===dz)
      const color = isCl ? 0x1FF01F : 0x3050F8
      const size = isCl ? 0.22 : 0.2
      const pos = new THREE.Vector3(merX + dx*dist, botY + dy*dist, dz*dist)
      
      const geo = new THREE.SphereGeometry(size, 32, 32)
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.3 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(pos); scene.add(mesh)
      createBond(coMer.position, pos, isCl ? 0x448844 : 0x444488)

      if (!isCl) addHAtoms(pos.x, pos.y, pos.z)
    })

    addLabel(merX, botY + 1.8, "mer-[Co(NH₃)₃Cl₃]", "#f368e0", "Cl lar meridian bo'ylab")

    addLabel(-2, botY + 1.2, "VS", "#FFD123", "")

    function createBond(s, e, c, radius = 0.04) {
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

    function addHAtoms(cx, cy, cz) {
      const hOffsets = [[0.3,0,0],[-0.15,0.26,0],[-0.15,-0.26,0]]
      hOffsets.forEach(([hx,hy,hz]) => {
        const hGeo = new THREE.SphereGeometry(0.08, 16, 16)
        const hMesh = new THREE.Mesh(hGeo, new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, metalness: 0.1 }))
        hMesh.position.set(cx + hx, cy + hy, cz + hz)
        scene.add(hMesh)
      })
    }

    function addLabel(x, y, text, color, subtext) {
      const div = document.createElement("div")
      div.style.cssText = `position:absolute;color:${color};font-size:12px;font-weight:bold;text-align:center;pointer-events:none;z-index:5;text-shadow:0 0 8px rgba(0,0,0,0.9);white-space:nowrap`
      div.innerHTML = subtext ? `${text}<br/><span style='font-size:10px;color:#aaa'>${subtext}</span>` : text
      div.style.left = "50%"
      div.style.top = "50%"
      // Position will be updated in animate
      div.userData = { x, y }
      container.appendChild(div)
      return div
    }

    // Grid
    const grid = new THREE.GridHelper(12, 30, 0x222244, 0x111122)
    grid.position.y = -4.5
    scene.add(grid)

    // Stars
    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(400 * 3)
    for (let i = 0; i < 400 * 3; i += 3) {
      sp[i] = (Math.random() - 0.5) * 16
      sp[i + 1] = (Math.random() - 0.5) * 10
      sp[i + 2] = (Math.random() - 0.5) * 16
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.012, transparent: true, opacity: 0.5 })))

    // Title labels
    addStaticLabel("SIS-TRANS [PtCl₂(NH₃)₂]", sisX + 1.5, topY + 2.5, "#ffffff", 16)
    addStaticLabel("FAC-MER [Co(NH₃)₃Cl₃]", facX + 1.5, botY + 2.5, "#ffffff", 16)

    function addStaticLabel(text, x, y, color, size) {
      const div = document.createElement("div")
      div.style.cssText = `position:absolute;color:${color};font-size:${size}px;font-weight:900;text-align:center;pointer-events:none;z-index:5;text-shadow:0 0 12px rgba(0,0,0,0.9);white-space:nowrap`
      div.textContent = text
      container.appendChild(div)
      return div
    }

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
        <Link href="/oquv/izomeriyasi/stereo/geometrik" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-xl font-bold text-blue-400">📐 Geometrik izomeriya — 3D</h1>
          <p className="text-purple-400 text-sm">Sis-trans + Fac-mer • CPK ranglarda</p>
        </div>
      </header>
      <div ref={containerRef} className="flex-1 w-full relative" />
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#D0D0E0]"></div><span className="text-sm text-purple-300">Pt — Platina</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3D4B8C]"></div><span className="text-sm text-purple-300">Co — Kobalt</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#1FF01F]"></div><span className="text-sm text-purple-300">Cl — Xlor</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3050F8]"></div><span className="text-sm text-purple-300">N — Azot</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white"></div><span className="text-sm text-purple-300">H — Vodorod</span></div>
      </div>
    </main>
  )
}