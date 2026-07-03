"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Optik3D() {
  const containerRef = useRef(null)
  const [model, setModel] = useState("chfclbr") // "chfclbr" | "coen3"

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ===== SCENE / CAMERA / RENDERER =====
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(5, 3, 6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 3
    controls.maxDistance = 14

    // ===== YORUG'LIKLAR =====
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

    // ===== HELPER FUNKSIYALAR =====
    // CPK ranglar:
    // C — Qora #1A1A1A
    // H — Oq #FFFFFF
    // F — Yashil-sariq #90E050
    // Cl — Yashil #1FF01F
    // Br — Jigarrang #A62929
    // Co — Ko'k-binafsha #3D4B8C
    // N — Ko'k #3050F8

    function createBond(s, e, c, radius = 0.04, opacity = 0.5) {
      const d = new THREE.Vector3().subVectors(e, s)
      const l = d.length()
      const m = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5)
      const bg = new THREE.CylinderGeometry(radius, radius, l, 16)
      const bm = new THREE.MeshStandardMaterial({
        color: c,
        roughness: 0.5,
        metalness: 0.2,
        transparent: true,
        opacity
      })
      const b = new THREE.Mesh(bg, bm)
      b.position.copy(m)
      b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0), d.clone().normalize()
      ))
      scene.add(b)
      return b
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

    // ===== LABEL ELEMENTLARI (keyinroq tozalash uchun) =====
    const domLabels = []
    function addLabel(html, styleCss) {
      const el = document.createElement("div")
      el.style.cssText = styleCss
      el.innerHTML = html
      container.appendChild(el)
      domLabels.push(el)
      return el
    }

    // ============================================================
    // MODEL 1: CHFClBr — tetraedrik uglerod (oddiy misol)
    // ============================================================
    if (model === "chfclbr") {
      const gap = 4.2
      const dist = 1.2

      // Tetraedr yo'nalishlari (mukammal 109.5°)
      const tetraDirs = [
        [1, 1, 1],
        [-1, -1, 1],
        [-1, 1, -1],
        [1, -1, -1]
      ].map(v => {
        const len = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2)
        return [v[0] / len, v[1] / len, v[2] / len]
      })

      // R va S uchun ligand konfiguratsiyalari
      // Ustuvorlik (CIP): Br(35) > Cl(17) > F(9) > H(1)
      // Chap: R-konfiguratsiya, O'ng: S-konfiguratsiya (oyna aksi)
      const ligands = [
        { color: 0xA62929, size: 0.28, name: "Br", bondColor: 0x884444 }, // Br
        { color: 0x1FF01F, size: 0.24, name: "Cl", bondColor: 0x448844 }, // Cl
        { color: 0x90E050, size: 0.20, name: "F", bondColor: 0x668844 },  // F
        { color: 0xFFFFFF, size: 0.16, name: "H", bondColor: 0x888888 }   // H
      ]

      // ===== CHAP: R-konfiguratsiya =====
      const leftX = -gap / 2
      addAtom(leftX, 0, 0, 0x1A1A1A, 0.30, 0.3, 0.4)
      addGlow(leftX, 0, 0, 0x1A1A1A, 0.38)

      ligands.forEach((lig, i) => {
        const dir = tetraDirs[i]
        const px = leftX + dir[0] * dist
        const py = dir[1] * dist
        const pz = dir[2] * dist
        addAtom(px, py, pz, lig.color, lig.size)
        createBond(
          new THREE.Vector3(leftX, 0, 0),
          new THREE.Vector3(px, py, pz),
          lig.bondColor
        )
      })

      // ===== O'NG: S-konfiguratsiya (oyna aksi — x o'qi bo'ylab) =====
      const rightX = gap / 2
      addAtom(rightX, 0, 0, 0x1A1A1A, 0.30, 0.3, 0.4)
      addGlow(rightX, 0, 0, 0x1A1A1A, 0.38)

      ligands.forEach((lig, i) => {
        const dir = tetraDirs[i]
        // Oyna aksi: x koordinatasini teskari qilamiz
        const px = rightX + (-dir[0]) * dist
        const py = dir[1] * dist
        const pz = dir[2] * dist
        addAtom(px, py, pz, lig.color, lig.size)
        createBond(
          new THREE.Vector3(rightX, 0, 0),
          new THREE.Vector3(px, py, pz),
          lig.bondColor
        )
      })

      // Labels
      addLabel(
        "R-CHFClBr<br/><span style='font-size:12px;color:#aaa'>Rectus • o'ngga</span>",
        "position:absolute;top:8%;left:8%;color:#48dbfb;font-size:26px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 15px rgba(72,219,251,0.5)"
      )
      addLabel(
        "S-CHFClBr<br/><span style='font-size:12px;color:#aaa'>Sinister • chapga</span>",
        "position:absolute;top:8%;right:8%;color:#f368e0;font-size:26px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 15px rgba(243,104,224,0.5)"
      )
      addLabel(
        "🪞<br/>Oyna<br/>aksi",
        "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#FFD123;font-size:16px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 10px rgba(0,0,0,0.9)"
      )
      addLabel(
        "Bir xil 4 ligand • Boshqa fazoviy joylashuv • Ustma-ust qo'yib bo'lmaydi",
        "position:absolute;bottom:6%;left:50%;transform:translateX(-50%);color:#c4b5fd;font-size:13px;font-style:italic;pointer-events:none;z-index:5;text-align:center;background:rgba(30,20,60,0.5);padding:6px 14px;border-radius:8px"
      )
    }

    // ============================================================
    // MODEL 2: [Co(en)₃]³⁺ — Werner klassik optik izomeri
    // ============================================================
    if (model === "coen3") {
      const gap = 5.0
      const dist = 1.3

      // Oktaedrik pozitsiyalar (6 ta N atomi uchun)
      // Har bir en ligand 2 ta qo'shni pozitsiyani egallaydi (cis)
      // 3 ta en propeller shaklida joylashadi

      function buildCoen3(centerX, chirality) {
        // chirality: +1 (Δ) yoki -1 (Λ)
        // Co markaz
        addAtom(centerX, 0, 0, 0x3D4B8C, 0.38, 0.2, 0.9)
        addGlow(centerX, 0, 0, 0x3D4B8C, 0.5)

        // 3 ta en ligand — har biri C₂ o'qi atrofida 120° ga aylantirilgan
        // Har bir en 2 ta N ni cis pozitsiyada bog'laydi
        // Δ va Λ farqi — propeller yo'nalishida (chap yoki o'ng qo'l vint)

        const enPositions = []
        for (let k = 0; k < 3; k++) {
          const theta = (k * 2 * Math.PI) / 3 // 0°, 120°, 240°
          // En ning ikki N ligand pozitsiyasi:
          // Yuqori halqa: (cos θ, +h, sin θ)
          // Pastki halqa: 60° siljigan (cos(θ+twist), -h, sin(θ+twist))
          const h = dist * 0.6
          const r = dist * 0.85

          // Δ uchun twist = +60°, Λ uchun twist = -60°
          const twist = chirality * (Math.PI / 3)

          const n1 = new THREE.Vector3(
            centerX + r * Math.cos(theta),
            +h,
            r * Math.sin(theta)
          )
          const n2 = new THREE.Vector3(
            centerX + r * Math.cos(theta + twist),
            -h,
            r * Math.sin(theta + twist)
          )
          enPositions.push({ n1, n2 })
        }

        // N atomlari + Co-N bog'lari + en ko'priklari
        enPositions.forEach(({ n1, n2 }) => {
          // N atomlari
          addAtom(n1.x, n1.y, n1.z, 0x3050F8, 0.22)
          addAtom(n2.x, n2.y, n2.z, 0x3050F8, 0.22)

          // Co-N bog'lari
          createBond(new THREE.Vector3(centerX, 0, 0), n1, 0x444488)
          createBond(new THREE.Vector3(centerX, 0, 0), n2, 0x444488)

          // Etilendiamin ko'prigi: N-CH₂-CH₂-N (2 ta C atomi)
          const mid = new THREE.Vector3().addVectors(n1, n2).multiplyScalar(0.5)
          const dir = new THREE.Vector3().subVectors(n2, n1).normalize()
          // Ikki C atomini bog' bo'ylab joylashtirish
          const bondLen = n1.distanceTo(n2)
          const c1 = new THREE.Vector3()
            .copy(n1)
            .add(dir.clone().multiplyScalar(bondLen / 3))
          const c2 = new THREE.Vector3()
            .copy(n1)
            .add(dir.clone().multiplyScalar((2 * bondLen) / 3))

          addAtom(c1.x, c1.y, c1.z, 0x1A1A1A, 0.14)
          addAtom(c2.x, c2.y, c2.z, 0x1A1A1A, 0.14)

          // N-C, C-C, C-N bog'lari (en ko'prigi)
          createBond(n1, c1, 0x446688, 0.035, 0.55)
          createBond(c1, c2, 0x446688, 0.035, 0.55)
          createBond(c2, n2, 0x446688, 0.035, 0.55)
        })

        // Propeller yo'nalishini vizual ko'rsatish uchun yumshoq halqa
        const ringGeo = new THREE.TorusGeometry(dist * 0.85, 0.01, 8, 64)
        const ringMat = new THREE.MeshBasicMaterial({
          color: chirality > 0 ? 0xf368e0 : 0x48dbfb,
          transparent: true,
          opacity: 0.25
        })
        const ring1 = new THREE.Mesh(ringGeo, ringMat)
        ring1.position.set(centerX, dist * 0.6, 0)
        ring1.rotation.x = Math.PI / 2
        scene.add(ring1)
        const ring2 = new THREE.Mesh(ringGeo, ringMat)
        ring2.position.set(centerX, -dist * 0.6, 0)
        ring2.rotation.x = Math.PI / 2
        scene.add(ring2)
      }

      // Chap: Λ (chap qo'l vint)
      buildCoen3(-gap / 2, -1)
      // O'ng: Δ (o'ng qo'l vint)
      buildCoen3(+gap / 2, +1)

      // Labels
      addLabel(
        "Λ-[Co(en)₃]³⁺<br/><span style='font-size:12px;color:#aaa'>Lambda • chap propeller</span>",
        "position:absolute;top:8%;left:6%;color:#48dbfb;font-size:24px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 15px rgba(72,219,251,0.5)"
      )
      addLabel(
        "Δ-[Co(en)₃]³⁺<br/><span style='font-size:12px;color:#aaa'>Delta • o'ng propeller</span>",
        "position:absolute;top:8%;right:6%;color:#f368e0;font-size:24px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 15px rgba(243,104,224,0.5)"
      )
      addLabel(
        "🪞<br/>Oyna<br/>aksi",
        "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#FFD123;font-size:16px;font-weight:900;pointer-events:none;z-index:5;text-shadow:0 0 10px rgba(0,0,0,0.9)"
      )
      addLabel(
        "3 ta en ligand • D₃ simmetriya • Werner 1911",
        "position:absolute;bottom:6%;left:50%;transform:translateX(-50%);color:#c4b5fd;font-size:13px;font-style:italic;pointer-events:none;z-index:5;text-align:center;background:rgba(30,20,60,0.5);padding:6px 14px;border-radius:8px"
      )
    }

    // ===== GRID =====
    const grid = new THREE.GridHelper(10, 30, 0x222244, 0x111122)
    grid.position.y = -2.5
    scene.add(grid)

    // ===== YULDUZLAR =====
    const starsGeo = new THREE.BufferGeometry()
    const sp = new Float32Array(400 * 3)
    for (let i = 0; i < 400 * 3; i += 3) {
      sp[i] = (Math.random() - 0.5) * 14
      sp[i + 1] = (Math.random() - 0.5) * 8
      sp[i + 2] = (Math.random() - 0.5) * 14
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3))
    const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.012,
      transparent: true,
      opacity: 0.5
    }))
    scene.add(stars)

    // ===== ANIMATSIYA =====
    let rafId
    function animate() {
      rafId = requestAnimationFrame(animate)
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

    // ===== CLEANUP =====
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", hr)
      // DOM labellarni o'chirish
      domLabels.forEach(el => {
        if (el && el.parentNode === container) container.removeChild(el)
      })
      // Renderer canvas ni o'chirish
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      // Three.js resurslarini bo'shatish
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
          else obj.material.dispose()
        }
      })
      renderer.dispose()
    }
  }, [model])

  // ===== LEGEND CPK ranglar (model bo'yicha) =====
  const chfclbrLegend = [
    { c: "#1A1A1A", n: "C — Uglerod" },
    { c: "#FFFFFF", n: "H — Vodorod" },
    { c: "#90E050", n: "F — Ftor" },
    { c: "#1FF01F", n: "Cl — Xlor" },
    { c: "#A62929", n: "Br — Brom" }
  ]
  const coen3Legend = [
    { c: "#3D4B8C", n: "Co — Kobalt" },
    { c: "#3050F8", n: "N — Azot (en)" },
    { c: "#1A1A1A", n: "C — Uglerod (en)" }
  ]
  const legend = model === "chfclbr" ? chfclbrLegend : coen3Legend

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white flex flex-col">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 z-10">
        <Link href="/oquv/izomeriyasi/stereo/optik" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-green-400">🔮 Optik izomeriya — 3D</h1>
          <p className="text-purple-400 text-sm">
            {model === "chfclbr"
              ? "R vs S • CHFClBr • Tetraedrik xiral uglerod"
              : "Λ (lambda) vs Δ (delta) • [Co(en)₃]³⁺ • Werner klassik namunasi"}
          </p>
        </div>
        {/* Model tanlash tugmalari */}
        <div className="flex gap-2">
          <button
            onClick={() => setModel("chfclbr")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              model === "chfclbr"
                ? "bg-green-500/20 text-green-300 border border-green-500/50"
                : "bg-purple-900/30 text-purple-300 border border-purple-700/40 hover:bg-purple-800/40"
            }`}
          >
            CHFClBr
          </button>
          <button
            onClick={() => setModel("coen3")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              model === "coen3"
                ? "bg-green-500/20 text-green-300 border border-green-500/50"
                : "bg-purple-900/30 text-purple-300 border border-purple-700/40 hover:bg-purple-800/40"
            }`}
          >
            [Co(en)₃]³⁺
          </button>
        </div>
      </header>

      <div ref={containerRef} className="flex-1 w-full relative" />

      <div className="flex justify-center gap-6 py-3 px-6 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap">
        {legend.map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-purple-700/50"
              style={{ background: it.c }}
            ></div>
            <span className="text-sm text-purple-300">{it.n}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
