"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

/* ============================================================
   3D MODEL KOMPONENTI
   Cho'zilgan oktaedr: 4 ta ekvatorial qisqa + 2 ta aksial uzun bog'
============================================================ */
function Cu3DModel() {
  const mountRef = useRef(null)
  const [isRotating, setIsRotating] = useState(true)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Sahna ──
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a1a)

    // ── Kamera ──
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 50)
    camera.position.set(6, 4.5, 8)
    camera.lookAt(0, 0, 0)

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    mount.appendChild(renderer.domElement)

    // ── OrbitControls ──
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.8
    controls.target.set(0, 0, 0)
    controls.minDistance = 4
    controls.maxDistance = 15

    // ── Chiroqlar ──
    const ambientLight = new THREE.AmbientLight(0x404060, 3)
    scene.add(ambientLight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 4)
    keyLight.position.set(8, 10, 6)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0x8888ff, 2)
    fillLight.position.set(-5, -2, -4)
    scene.add(fillLight)
    const rimLight = new THREE.DirectionalLight(0xff8844, 2.5)
    rimLight.position.set(0, -3, 6)
    scene.add(rimLight)

    // ── Markaziy atom (Cu²⁺) ──
    const centerGeo = new THREE.SphereGeometry(0.45, 64, 64)
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xff6b35,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x331100,
      emissiveIntensity: 0.4,
    })
    const centerAtom = new THREE.Mesh(centerGeo, centerMat)
    scene.add(centerAtom)

    // ── Yorqin halqa (glow) ──
    const glowGeo = new THREE.SphereGeometry(0.52, 64, 64)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff8844,
      transparent: true,
      opacity: 0.18,
    })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    scene.add(glow)

    // ── Bog' chiziqlari ──
    function createBond(x, y, z, length) {
      const dir = new THREE.Vector3(x, y, z).normalize()
      const midPoint = dir.clone().multiplyScalar(length / 2)
      const geo = new THREE.CylinderGeometry(0.08, 0.08, length, 16)
      const mat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5, metalness: 0.3 })
      const bond = new THREE.Mesh(geo, mat)
      bond.position.copy(midPoint)
      // Cylinder default along Y; rotate to dir
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
      bond.setRotationFromQuaternion(quat)
      return bond
    }

    // ── Ligand (O atomi) ──
    function createLigand(x, y, z, colorHex = 0x4488ff) {
      const geo = new THREE.SphereGeometry(0.28, 32, 32)
      const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4, metalness: 0.1 })
      const ligand = new THREE.Mesh(geo, mat)
      ligand.position.set(x, y, z)
      return ligand
    }

    const eqDist = 1.95   // ekvatorial — qisqa
    const axDist = 2.85   // aksial — uzun (Yan-Teller cho'zilishi)

    // Ekvatorial ligandlar (X va Z tekislikda)
    const eqPositions = [
      [eqDist, 0, 0], [-eqDist, 0, 0],
      [0, 0, eqDist], [0, 0, -eqDist],
    ]
    eqPositions.forEach(([x, y, z]) => {
      scene.add(createBond(x, y, z, eqDist))
      scene.add(createLigand(x, y, z, 0x44aaff))
    })

    // Aksial ligandlar (Y o'qi bo'ylab — cho'zilgan)
    const axPositions = [[0, axDist, 0], [0, -axDist, 0]]
    axPositions.forEach(([x, y, z]) => {
      scene.add(createBond(x, y, z, axDist))
      scene.add(createLigand(x, y, z, 0xff6644))
    })

    // ── Yarimshaffof oktaedr konturi ──
    const edgePoints = [
      ...eqPositions.map(p => new THREE.Vector3(...p)),
      ...axPositions.map(p => new THREE.Vector3(...p)),
    ]
    // Ekvatorial kvadrat
    const eqOrder = [0, 2, 1, 3, 0]
    for (let i = 0; i < eqOrder.length - 1; i++) {
      const a = edgePoints[eqOrder[i]]
      const b = edgePoints[eqOrder[i + 1]]
      const mid = a.clone().add(b).multiplyScalar(0.5)
      const dir = b.clone().sub(a)
      const len = dir.length()
      const geo = new THREE.CylinderGeometry(0.02, 0.02, len, 8)
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 })
      const line = new THREE.Mesh(geo, mat)
      line.position.copy(mid)
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
      line.setRotationFromQuaternion(quat)
      scene.add(line)
    }
    // Aksial → ekvatorial chiziqlar
    for (let i = 0; i < 4; i++) {
      [4, 5].forEach(axIdx => {
        const a = edgePoints[axIdx]
        const b = edgePoints[i]
        const mid = a.clone().add(b).multiplyScalar(0.5)
        const dir = b.clone().sub(a)
        const len = dir.length()
        const geo = new THREE.CylinderGeometry(0.015, 0.015, len, 8)
        const mat = new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.2 })
        const line = new THREE.Mesh(geo, mat)
        line.position.copy(mid)
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
        line.setRotationFromQuaternion(quat)
        scene.add(line)
      })
    }

    // ── O'lcham ko'rsatkich chiziqlari ──
    function createDashedLine(start, end, colorHex = 0xffcc00) {
      const mid = start.clone().add(end).multiplyScalar(0.5)
      const dir = end.clone().sub(start)
      const len = dir.length()
      const geo = new THREE.CylinderGeometry(0.015, 0.015, len, 8)
      const mat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.7 })
      const line = new THREE.Mesh(geo, mat)
      line.position.copy(mid)
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
      line.setRotationFromQuaternion(quat)
      return line
    }
    // Ekvatorial o'lcham ko'rsatkichi
    scene.add(createDashedLine(new THREE.Vector3(-eqDist, -2.2, 0), new THREE.Vector3(eqDist, -2.2, 0), 0xffcc00))
    // Aksial o'lcham ko'rsatkichi
    scene.add(createDashedLine(new THREE.Vector3(2.8, axDist, 0), new THREE.Vector3(2.8, -axDist, 0), 0xff8844))

    // ── Zarralar fon ──
    const particlesGeo = new THREE.BufferGeometry()
    const particlesCount = 200
    const particlesPositions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount * 3; i++) {
      particlesPositions[i] = (Math.random() - 0.5) * 14
    }
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(particlesPositions, 3))
    const particlesMat = new THREE.PointsMaterial({ color: 0x8888cc, size: 0.03, transparent: true, opacity: 0.5 })
    const particles = new THREE.Points(particlesGeo, particlesMat)
    scene.add(particles)

    // ── Animatsiya ──
    function animate() {
      requestAnimationFrame(animate)
      controls.update()
      particles.rotation.y += 0.0003
      glow.scale.setScalar(1 + Math.sin(Date.now() * 0.003) * 0.04)
      renderer.render(scene, camera)
    }
    animate()

    // ── Resize ──
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-purple-700/50 bg-black/40">
      <div ref={mountRef} className="w-full h-full" />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 text-xs">
        <span className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-full text-orange-400 border border-orange-600/40">Cu²⁺</span>
        <span className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-full text-blue-400 border border-blue-600/40">O (ekv) 1.97 Å</span>
        <span className="bg-black/60 backdrop-blur px-3 py-1.5 rounded-full text-red-400 border border-red-600/40">O (aks) 2.28 Å</span>
      </div>
      <div className="absolute bottom-4 right-4 text-xs text-purple-400 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full">
        🖱️ Aylantiring • Kattalashtiring
      </div>
    </div>
  )
}

/* ============================================================
   ASOSIY SAHIFA: Cu²⁺ komplekslarida Yan-Teller
============================================================ */
export default function CuKomplekslari() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/yan-teller" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Yan-Teller
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🧪 Cu²⁺ komplekslarida Yan-Teller effekti</h1>
          <p className="text-purple-400 text-sm">[Cu(H₂O)₆]²⁺ • Aksial bog'lar uzayishi • Rang o'zgarishi sababi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 3D MODELGA O'TISH KARTASI ── */}
        <Link 
          href="/ilmiy/chuqurlashgan/yan-teller/cu-komplekslari/3d"
          className="group block bg-gradient-to-r from-orange-900/40 to-purple-900/40 border border-orange-700/50 rounded-2xl p-6 hover:bg-orange-900/60 hover:border-orange-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
              🔮
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors">
                3D holatini ko'rish
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Cho'zilgan oktaedr geometriyasini 3D modelda ko'ring. 
                Ekvatorial va aksial bog'lar farqi, Cu²⁺ ioni atrofidagi ligandlar joylashuvi.
              </p>
            </div>
            <div className="text-3xl text-orange-400 group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>
        </Link>

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Cu²⁺ — eng yorqin Yan-Teller ioni</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Cu²⁺ (d⁹ konfiguratsiya)</strong> — Yan-Teller effektining 
              <strong className="text-yellow-400"> eng ko'p o'rganilgan va eng yorqin namoyon bo'ladigan</strong> ionidir. 
              d⁹ konfiguratsiyada eg orbitallarda 3 ta elektron joylashgan bo'lib, 
              bitta elektron uchun degeneratlik mavjud (dz² yoki dx²−y²).
              Natijada oktaedrik kompleks <strong className="text-yellow-400">tetragonal cho'ziladi</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Elektron tuzilishi</h3>
              <p className="text-purple-200 text-sm">
                <strong>Cu²⁺:</strong> [Ar] 3d⁹<br/>
                <strong>Oktaedrik maydonda:</strong> t₂g⁶ eg³<br/>
                eg da 3 ta elektron → <strong>1 ta "teshik"</strong> degeneratlik
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Cho'zilish yo'nalishi</h3>
              <p className="text-purple-200 text-sm">
                Odatda <strong>Z o'qi bo'ylab</strong> cho'ziladi. 
                Buning sababi — dx²−y² orbital to'lgan (2e⁻), dz² esa 1e⁻.
                dz² dagi elektron ligandlardan kuchsizroq itariladi.
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. [Cu(H₂O)₆]²⁺ ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💧 [Cu(H₂O)₆]²⁺ — klassik misol</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-blue-400">Geksaakvamiz(II) ioni</strong> — Cu²⁺ ning suvdagi eng oddiy kompleksi.
              Oktaedrik koordinatsiyaga ega, lekin <strong className="text-yellow-400">4+2</strong> tuzilish:
              4 ta ekvatorial suv molekulasi qisqa bog' bilan, 2 ta aksial suv molekulasi uzun bog' bilan birikkan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Parametr</th>
                <th className="py-3 px-4 text-purple-300">Ekvatorial</th>
                <th className="py-3 px-4 text-purple-300">Aksial</th>
                <th className="py-3 px-4 text-purple-300">Farq</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Bog' uzunligi", "1.97 Å", "2.28 Å", "+0.31 Å"],
                  ["Ligandlar soni", "4 ta H₂O", "2 ta H₂O", "—"],
                  ["Bog' kuchi", "Kuchli", "Kuchsiz", "Sezilarli"],
                  ["Orbital", "dx²−y² (to'lgan)", "dz² (yarim to'lgan)", "—"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-orange-300">{r[2]}</td>
                    <td className="py-3 px-4 text-sm text-purple-400">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Rang sababi</h3>
              <p className="text-purple-200 text-sm">
                <strong>Oddiy oktaedrda</strong> bitta d-d o'tish kutiladi. 
                Cho'zilgan oktaedrda <strong>2-3 ta</strong> polosa kuzatiladi — 
                aynan shu <strong>ko'k rangni</strong> beradi (≈ 800 nm yutilish).
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Suv almashinishi</h3>
              <p className="text-purple-200 text-sm">
                Aksial suv molekulalari <strong>juda tez almashinadi</strong> 
                (bog' kuchsizligi tufayli). Ekvatorial suvlar sekinroq almashinadi.
                Bu — <strong>labillik</strong> xossasining sababi.
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. BOSHQA Cu²⁺ KOMPLEKSLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Boshqa Cu²⁺ komplekslari</h2>
          
          <div className="space-y-4">
            {[
              {
                formula: "[Cu(NH₃)₆]²⁺",
                xususiyat: "Geksaammin kompleksi. Kuchli Yan-Teller cho'zilishi. Aksial NH₃ lar uzoqroq masofada.",
                rang: "Ko'k-binafsha",
              },
              {
                formula: "[CuCl₄]²⁻",
                xususiyat: "Yan-Teller tufayli kvadrat-planar ko'rinish oladi. Aksial Cl⁻ lar juda uzoq — deyarli bog'lanmagan.",
                rang: "Sariq-yashil",
              },
              {
                formula: "[Cu(acac)₂]",
                xususiyat: "Kvadrat-planar kompleks. Yan-Teller cho'zilishi sababli aksial pozitsiyalar bo'sh.",
                rang: "Ko'k",
              },
              {
                formula: "[Cu(en)₃]²⁺",
                xususiyat: "Etilendiamin bilan. Cho'zilgan oktaedr. Xelat effekti barqarorlikni oshiradi.",
                rang: "Binafsha-ko'k",
              },
            ].map((k, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{k.formula}</h3>
                <p className="text-purple-200 text-sm">{k.xususiyat}</p>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-400 border border-purple-600/30">
                  🎨 {k.rang}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. GEOMETRIK PARAMETRLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Geometrik parametrlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-gray-400 font-bold mb-2">Ekvatorial bog'</h3>
              <p className="text-blue-400 font-bold text-2xl">1.97 Å</p>
              <p className="text-purple-400 text-xs mt-1">Cu-O(ekv)</p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">Aksial bog'</h3>
              <p className="text-orange-400 font-bold text-2xl">2.28 Å</p>
              <p className="text-purple-400 text-xs mt-1">Cu-O(aks)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-gray-400 font-bold mb-2">Farq (Δr)</h3>
              <p className="text-yellow-400 font-bold text-2xl">0.31 Å</p>
              <p className="text-purple-400 text-xs mt-1">~16% uzunroq</p>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mt-5">
            <p className="text-orange-300 text-sm">
              <strong>Eslatma:</strong> Bog' uzunliklari anioni va erituvchiga qarab biroz o'zgaradi. 
              Masalan, [Cu(H₂O)₆]²⁺ nitrat tuzida Cu-O(ekv) = 1.95-1.99 Å, Cu-O(aks) = 2.25-2.34 Å oralig'ida.
            </p>
          </div>
        </div>

        {/* ── 5. TERMIK TEBRANISHLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌡️ Harorat ta'siri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Past harorat (&#60; 200 K)</h3>
              <p className="text-purple-200 text-sm">
                <strong>Statik Yan-Teller effekti.</strong> Cho'zilish bir o'qda doimiy.
                Rentgen difraksiyasida aniq ko'rinadi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xona harorati (≈ 300 K)</h3>
              <p className="text-purple-200 text-sm">
                <strong>Dinamik Yan-Teller effekti.</strong> Cho'zilish o'qi 
                3 ta o'q orasida tebranadi. O'rtacha oktaedrik simmetriya kuzatiladi.
              </p>
            </div>
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-orange-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Cu²⁺ — <strong className="text-yellow-400">d⁹ konfiguratsiya</strong> tufayli Yan-Teller effekti eng kuchli namoyon bo'ladigan ion</li>
            <li><strong>[Cu(H₂O)₆]²⁺</strong> da ekvatorial bog'lar 1.97 Å, aksial bog'lar 2.28 Å</li>
            <li>Cho'zilish <strong>Z o'qi bo'ylab</strong> — dz² orbitalda 1 ta elektron, dx²−y² da 2 ta elektron</li>
            <li><strong>Rang</strong> — cho'zilgan oktaedrda 2-3 ta d-d o'tish, ko'k rangni beradi</li>
            <li>Aksial ligandlar <strong>oson almashinadi</strong> — kompleks labil</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/yan-teller/nazariyasi" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Nazariyasi
          </Link>
          <Link href="/ilmiy/chuqurlashgan/yan-teller/spektroskopik" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold transition-all">
            Spektroskopik →
          </Link>
        </div>

      </section>
    </main>
  )
}