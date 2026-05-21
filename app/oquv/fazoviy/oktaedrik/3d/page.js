"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Oktaedrik3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(4, 3, 5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 2; controls.maxDistance = 10

    scene.add(new THREE.AmbientLight(0x404060, 0.8))
    const l1 = new THREE.DirectionalLight(0xffffff, 1); l1.position.set(8, 8, 8); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0xcc88ff, 0.5); l2.position.set(-4, -2, -3); scene.add(l2)

    // Co — Ko'k-binafsha CPK: #3D4B8C
    const centerGeo = new THREE.SphereGeometry(0.42, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({ color: 0x3D4B8C, roughness: 0.2, metalness: 0.9 })
    const centerAtom = new THREE.Mesh(centerGeo, centerMat); scene.add(centerAtom)

    const glowGeo = new THREE.SphereGeometry(0.5, 32, 32)
    const glow = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ color: 0x3D4B8C, transparent: true, opacity: 0.1 })); scene.add(glow)

    const dist = 2.0
    // 6 ta NH₃ — N (Ko'k #3050F8)
    const positions = [[dist,0,0],[-dist,0,0],[0,dist,0],[0,-dist,0],[0,0,dist],[0,0,-dist]]

    positions.forEach(([x,y,z]) => {
      // N atomi
      const nGeo = new THREE.SphereGeometry(0.25, 32, 32)
      const nMat = new THREE.MeshStandardMaterial({ color: 0x3050F8, roughness: 0.4, metalness: 0.3 })
      const nMesh = new THREE.Mesh(nGeo, nMat); nMesh.position.set(x,y,z); scene.add(nMesh)

      const nGlow = new THREE.Mesh(new THREE.SphereGeometry(0.3,16,16),
        new THREE.MeshBasicMaterial({ color: 0x3050F8, transparent: true, opacity: 0.06 }))
      nGlow.position.copy(nMesh.position); scene.add(nGlow)

      // H atomlari (3 ta)
      const hDist = 0.45, hOff = 0.3
      const ax = Math.abs(x), ay = Math.abs(y), az = Math.abs(z)
      let hPos = []
      if(ax>0.5) hPos=[[x+(x>0?hOff:-hOff),hDist,0],[x+(x>0?hOff:-hOff),-hDist/2,hDist*0.866],[x+(x>0?hOff:-hOff),-hDist/2,-hDist*0.866]]
      else if(ay>0.5) hPos=[[0,y+(y>0?hOff:-hOff),hDist],[hDist*0.866,y+(y>0?hOff:-hOff),-hDist/2],[-hDist*0.866,y+(y>0?hOff:-hOff),-hDist/2]]
      else hPos=[[hDist,0,z+(z>0?hOff:-hOff)],[-hDist/2,hDist*0.866,z+(z>0?hOff:-hOff)],[-hDist/2,-hDist*0.866,z+(z>0?hOff:-hOff)]]
      
      hPos.forEach(([hx,hy,hz])=>{
        const hGeo = new THREE.SphereGeometry(0.12,16,16)
        const hMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5, metalness: 0.1 })
        const hMesh = new THREE.Mesh(hGeo, hMat); hMesh.position.set(hx,hy,hz); scene.add(hMesh)
      })

      createBond(new THREE.Vector3(0,0,0), new THREE.Vector3(x,y,z), 0x5566aa)
    })

    function createBond(s,e,c){
      const d=new THREE.Vector3().subVectors(e,s), l=d.length(), m=new THREE.Vector3().addVectors(s,e).multiplyScalar(.5)
      const bg=new THREE.CylinderGeometry(.05,.05,l,16), bm=new THREE.MeshStandardMaterial({color:c,roughness:.5,metalness:.2,transparent:true,opacity:.45})
      const b=new THREE.Mesh(bg,bm); b.position.copy(m)
      b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()))
      scene.add(b)
    }

    // Oktaedr qirralari (12 ta)
    const verts = positions.map(p=>new THREE.Vector3(...p))
    for(let i=0;i<verts.length;i++){
      for(let j=i+1;j<verts.length;j++){
        if(Math.abs(verts[i].dot(verts[j]))<0.01){
          const geo=new THREE.BufferGeometry().setFromPoints([verts[i],verts[j]])
          scene.add(new THREE.Line(geo, new THREE.LineDashedMaterial({color:0x443366,dashSize:.3,gapSize:.15})))
        }
      }
    }

    const grid=new THREE.GridHelper(5,20,0x222244,0x111122); grid.position.y=-3; scene.add(grid)
    const starsGeo=new THREE.BufferGeometry(); const sp=new Float32Array(200*3)
    for(let i=0;i<200*3;i+=3){sp[i]=(Math.random()-.5)*10; sp[i+1]=(Math.random()-.5)*6; sp[i+2]=(Math.random()-.5)*10}
    starsGeo.setAttribute("position",new THREE.BufferAttribute(sp,3))
    scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xffffff,size:.01,transparent:true,opacity:.4})))

    function animate(){requestAnimationFrame(animate); glow.scale.setScalar(1+Math.sin(Date.now()*.002)*.04); centerAtom.rotation.y+=.003; controls.update(); renderer.render(scene,camera)}
    animate()
    const hr=()=>{camera.aspect=container.clientWidth/container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth,container.clientHeight)}
    window.addEventListener("resize",hr)
    return ()=>{window.removeEventListener("resize",hr); container.removeChild(renderer.domElement)}
  },[])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white flex flex-col">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 z-10">
        <Link href="/oquv/fazoviy/oktaedrik" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div><h1 className="text-xl font-bold text-purple-400">💎 Oktaedrik — 3D model</h1><p className="text-purple-400 text-sm">[Co(NH₃)₆]³⁺ • CPK ranglarda</p></div>
      </header>
      <div ref={containerRef} className="flex-1 w-full" />
      <div className="flex justify-center gap-8 py-4 px-6 bg-purple-950/80 border-t border-purple-800/50 z-10 flex-wrap">
        <div className="text-center"><div className="text-xs text-purple-400">Valent burchak</div><div className="text-lg font-bold text-white">90°</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">KS</div><div className="text-lg font-bold text-white">6</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Gibridlanish</div><div className="text-lg font-bold text-white">d²sp³</div></div>
        <div className="text-center"><div className="text-xs text-purple-400">Simmetriya</div><div className="text-lg font-bold text-white">Oh</div></div>
      </div>
      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3D4B8C]"></div><span className="text-sm text-purple-300">Co — Kobalt</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3050F8]"></div><span className="text-sm text-purple-300">N — Azot</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-white"></div><span className="text-sm text-purple-300">H — Vodorod</span></div>
      </div>
    </main>
  )
}