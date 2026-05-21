"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Tetraedrik3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(3.5, 2.5, 3.5)
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
    const l1 = new THREE.DirectionalLight(0xffffff, 1); l1.position.set(5, 5, 5); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0x88ffff, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)

    // Co — Ko'k-binafsha CPK: #3D4B8C
    const centerGeo = new THREE.SphereGeometry(0.42, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({ color: 0x3D4B8C, roughness: 0.2, metalness: 0.9 })
    const centerAtom = new THREE.Mesh(centerGeo, centerMat); scene.add(centerAtom)
    const glowGeo = new THREE.SphereGeometry(0.49, 32, 32)
    const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: 0x3D4B8C, transparent: true, opacity: 0.1 })); scene.add(glow)

    // Cl — Yashil CPK: #1FF01F
    const dist = 1.8
    const tet = [[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]]
    tet.forEach(([dx,dy,dz]) => {
      const len = Math.sqrt(dx*dx+dy*dy+dz*dz)
      const x=dx/len*dist, y=dy/len*dist, z=dz/len*dist
      const clGeo = new THREE.SphereGeometry(0.28, 32, 32)
      const clMat = new THREE.MeshStandardMaterial({ color: 0x1FF01F, roughness: 0.35, metalness: 0.3 })
      const cl = new THREE.Mesh(clGeo, clMat); cl.position.set(x,y,z); scene.add(cl)
      const clGlow = new THREE.Mesh(new THREE.SphereGeometry(0.33,16,16),
        new THREE.MeshBasicMaterial({ color: 0x1FF01F, transparent: true, opacity: 0.08 }))
      clGlow.position.copy(cl.position); scene.add(clGlow)
      createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(x,y,z), 0x448844)
    })

    function createBond(s,e,c) {
      const d=new THREE.Vector3().subVectors(e,s), l=d.length(), m=new THREE.Vector3().addVectors(s,e).multiplyScalar(.5)
      const bg=new THREE.CylinderGeometry(.05,.05,l,16), bm=new THREE.MeshStandardMaterial({color:c,roughness:.5,metalness:.2,transparent:true,opacity:.5})
      const b=new THREE.Mesh(bg,bm); b.position.copy(m)
      b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()))
      scene.add(b)
    }

    // Grid
    const grid = new THREE.GridHelper(5,20,0x222244,0x111122); grid.position.y=-2; scene.add(grid)
    const starsGeo = new THREE.BufferGeometry(); const sp = new Float32Array(200*3)
    for(let i=0;i<200*3;i+=3){sp[i]=(Math.random()-.5)*10; sp[i+1]=(Math.random()-.5)*6; sp[i+2]=(Math.random()-.5)*10}
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp,3))
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({color:0xffffff,size:.01,transparent:true,opacity:.4})))

    function animate(){requestAnimationFrame(animate); const t=Date.now()*.001; glow.scale.setScalar(1+Math.sin(t*2)*.04); centerAtom.rotation.y+=.003; controls.update(); renderer.render(scene,camera)}
    animate()
    const hr=()=>{camera.aspect=container.clientWidth/container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth,container.clientHeight)}
    window.addEventListener("resize",hr)
    return ()=>{window.removeEventListener("resize",hr); container.removeChild(renderer.domElement)}
  },[])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white flex flex-col">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 z-10">
        <Link href="/oquv/fazoviy/tetraedrik" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div><h1 className="text-xl font-bold text-cyan-400">🔺 Tetraedrik — 3D model</h1><p className="text-purple-400 text-sm">[CoCl₄]²⁻ • CPK ranglarda</p></div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center"><div className="text-xs text-purple-400">Valent burchak</div><div className="text-lg font-bold text-white">109.5°</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">KS</div><div className="text-lg font-bold text-white">4</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Gibridlanish</div><div className="text-lg font-bold text-white">sp³</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Simmetriya</div><div className="text-lg font-bold text-white">Td</div></div>
      </div>
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3D4B8C]"></div><span className="text-sm text-purple-300">Co — Kobalt</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#1FF01F]"></div><span className="text-sm text-purple-300">Cl — Xlor</span></div>
      </div>
    </main>
  )
}