"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

// ============================================================================
// BOG' TARTIBI KALKULYATORI
// ============================================================================
function BondOrderKalkulyator() {
  const [config, setConfig] = useState("sigma2-pi4-delta2")
  const [result, setResult] = useState({ order: 4, sigma: 1, pi: 2, delta: 1, comment: "[Re₂Cl₈]²⁻ — σ²π⁴δ², bog' tartibi = 4" })

  const configurations = {
    "sigma2-pi4-delta2": { order: 4, sigma: 1, pi: 2, delta: 1, formula: "σ²π⁴δ²", example: "[Re₂Cl₈]²⁻, [Mo₂Cl₈]⁴⁻" },
    "sigma2-pi4-delta1": { order: 3.5, sigma: 1, pi: 2, delta: 0.5, formula: "σ²π⁴δ¹", example: "[Tc₂Cl₈]²⁻ (bir elektron kam)" },
    "sigma2-pi4": { order: 3, sigma: 1, pi: 2, delta: 0, formula: "σ²π⁴", example: "[Cr₂(OAc)₄] — δ yo'q" },
    "sigma2-pi2": { order: 2, sigma: 1, pi: 1, delta: 0, formula: "σ²π²", example: "[Mo₂(SO₄)₄]⁴⁻" },
  }

  const calc = () => {
    const c = configurations[config]
    setResult({ ...c, comment: `${c.example} — ${c.formula}, bog' tartibi = ${c.order}` })
  }

  useEffect(() => { calc() }, [config])

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🎯 Bog' tartibi kalkulyatori</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-purple-400 text-xs block mb-1">Elektron konfiguratsiya</label>
          <select value={config} onChange={(e) => setConfig(e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm">
            <option value="sigma2-pi4-delta2">σ²π⁴δ² — Quadruple bond</option>
            <option value="sigma2-pi4-delta1">σ²π⁴δ¹ — Bog' tartibi 3.5</option>
            <option value="sigma2-pi4">σ²π⁴ — Triple bond</option>
            <option value="sigma2-pi2">σ²π² — Double bond</option>
          </select>
        </div>
        <div className="bg-fuchsia-600/10 border border-fuchsia-500/30 rounded-xl p-4">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div><p className="text-fuchsia-400 font-bold text-lg">{result.order}</p><p className="text-purple-400">Bog' tartibi</p></div>
            <div><p className="text-blue-400 font-bold text-lg">{result.sigma}</p><p className="text-purple-400">σ bog'</p></div>
            <div><p className="text-green-400 font-bold text-lg">{result.pi}</p><p className="text-purple-400">π bog'</p></div>
            <div><p className="text-yellow-400 font-bold text-lg">{result.delta}</p><p className="text-purple-400">δ bog'</p></div>
          </div>
          <p className="text-purple-300 text-xs mt-2">{result.comment}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3D MODEL — [Re₂Cl₈]²⁻
// ============================================================================
function Re2Cl8_3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(4, 2.5, 4)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(400, 320)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 2; controls.maxDistance = 8

    scene.add(new THREE.AmbientLight(0x404060, 0.7))
    const l1 = new THREE.DirectionalLight(0xffffff, 1); l1.position.set(5, 5, 5); scene.add(l1)
    const l2 = new THREE.DirectionalLight(0xffffcc, 0.5); l2.position.set(-3, -1, -2); scene.add(l2)

    // Re atomlari
    const reGeo = new THREE.SphereGeometry(0.25, 32, 32)
    const reMat = new THREE.MeshStandardMaterial({ color: 0x88AACC, roughness: 0.2, metalness: 0.9 })
    const re1 = new THREE.Mesh(reGeo, reMat); re1.position.set(0, 0, -1.1); scene.add(re1)
    const re2 = new THREE.Mesh(reGeo, reMat); re2.position.set(0, 0, 1.1); scene.add(re2)

    // Re−Re quadruple bond — 4 ta parallel silindr
    for (let i = 0; i < 4; i++) {
      const offset = (i - 1.5) * 0.12
      createBond(new THREE.Vector3(offset, offset * 0.6, -1.1), new THREE.Vector3(offset, offset * 0.6, 1.1), 0xFFD700, 0.03)
    }

    // Cl atomlari — kvadrat planar, ekranlangan (eclipsed)
    const clGeo = new THREE.SphereGeometry(0.2, 16, 16)
    const clMat = new THREE.MeshStandardMaterial({ color: 0x00CC00, roughness: 0.4, metalness: 0.2 })
    const d = 1.6
    const clPositions1 = [[d, d, -1.1], [-d, d, -1.1], [-d, -d, -1.1], [d, -d, -1.1]]
    const clPositions2 = [[d, d, 1.1], [-d, d, 1.1], [-d, -d, 1.1], [d, -d, 1.1]]
    
    clPositions1.forEach(([x, y, z]) => {
      const cl = new THREE.Mesh(clGeo, clMat); cl.position.set(x, y, z); scene.add(cl)
      createBond(new THREE.Vector3(0, 0, -1.1), new THREE.Vector3(x, y, z), 0x888888, 0.04)
    })
    clPositions2.forEach(([x, y, z]) => {
      const cl = new THREE.Mesh(clGeo, clMat); cl.position.set(x, y, z); scene.add(cl)
      createBond(new THREE.Vector3(0, 0, 1.1), new THREE.Vector3(x, y, z), 0x888888, 0.04)
    })

    function createBond(s, e, c, r) {
      const d = new THREE.Vector3().subVectors(e, s), l = d.length(), m = new THREE.Vector3().addVectors(s, e).multiplyScalar(.5)
      const bg = new THREE.CylinderGeometry(r, r, l, 8)
      const b = new THREE.Mesh(bg, new THREE.MeshStandardMaterial({ color: c, roughness: .5, metalness: .2, transparent: true, opacity: c === 0xFFD700 ? 0.9 : 0.7 }))
      b.position.copy(m); b.setRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()))
      scene.add(b)
    }

    const grid = new THREE.GridHelper(5, 20, 0x222244, 0x111122); grid.position.y = -2.2; scene.add(grid)

    function animate() {
      requestAnimationFrame(animate)
      re1.rotation.y += 0.003; re2.rotation.y += 0.003
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => { container.removeChild(renderer.domElement) }
  }, [])

  return (
    <div>
      <h3 className="text-white font-semibold mb-3">🔮 [Re₂Cl₈]²⁻ — 3D model (quadruple bond)</h3>
      <div ref={containerRef} className="w-full h-80 rounded-xl border border-purple-700/50 bg-[#0a0716]" />
      <div className="flex justify-center gap-6 py-2 text-xs">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#88AACC]"></div><span className="text-purple-300">Re</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#00CC00]"></div><span className="text-purple-300">Cl</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FFD700]"></div><span className="text-purple-300">Quadruple bond</span></div>
      </div>
      <p className="text-purple-400 text-xs text-center mt-1">Eclipsed konformatsiya — δ bog' maksimal overlap uchun</p>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function MMBoglar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kop-yadroli" className="text-purple-400 hover:text-purple-300 text-lg">← Ko'p yadroli</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🔗 M−M bog'lar</h1>
          <p className="text-purple-400 text-sm">Quadruple bond • δ bog' • [Re₂Cl₈]²⁻ • Bog' tartibi kalkulyatori</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Metall-metall bog'lar haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-blue-400">Metall-metall (M−M) bog'lar</strong> — koordinatsion 
              kimyoning eng qiziqarli yo'nalishlaridan biri. <strong>Cotton (1964)</strong> 
              [Re₂Cl₈]²⁻ da <strong>quadruple bond</strong> (σ²π⁴δ²) kashf etgan — bu to'rtta 
              alohida bog'lovchi orbital: bitta σ, ikkita π va <strong>bitta δ bog'</strong>.
              δ bog' — d orbitallarning yonma-yon overlapidan hosil bo'ladi va faqat 
              <strong>eclipsed konformatsiyada</strong> maksimal bo'ladi. Bu konformatsion 
              preferensiya — <strong>δ bog'ning aylanish to'sig'i</strong> (~2−10 kJ/mol) orqali 
              eksperimental kuzatiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">M−M bog' turlari</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">Bog' turi</th><th className="text-left py-2 text-blue-400">Orbitallar</th><th className="text-left py-2 text-yellow-400">Bog' tartibi</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["Single","σ","1 — [Mn₂(CO)₁₀]"],["Double","σ + π","2 — [Fe₂(CO)₉]"],["Triple","σ + 2π","3 — [Mo₂(OR)₆]"],["Quadruple","σ + 2π + δ","4 — [Re₂Cl₈]²⁻"],["Quintuple","σ + 2π + 2δ","5 — [Cr₂(C₆H₃-2,6-(C₆H₂)₂)₂] (2005!)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5 font-bold">{r[0]}</td><td className="py-1.5 font-mono">{r[1]}</td><td className="py-1.5">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">δ bog' — noyob bog' turi</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>dxy−dxy overlap:</strong> Yonma-yon — to'rtta lobli o'zaro ta'sir</li>
                <li>• <strong>Eclipsed konformatsiya:</strong> δ bog' maksimal — staggered da nolga teng!</li>
                <li>• <strong>Aylanish to'sig'i:</strong> ~8−10 kJ/mol ([Re₂Cl₈]²⁻) — eksperimental kuzatilgan</li>
                <li>• <strong>δ → δ* o'tish:</strong> UV-Vis da past energiyali yutilish (~700 nm)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. [Re₂Cl₈]²⁻ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ [Re₂Cl₈]²⁻ — quadruple bond etaloni</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Re2Cl8_3D />
            </div>
            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-blue-400 font-bold text-sm mb-2">Struktura parametrlari</h3>
                <table className="w-full text-xs">
                  <tbody className="text-purple-200">
                    {[["Re−Re masofa","2.24 Å (juda qisqa!)"],["Re−Cl masofa","2.29 Å"],["Bog' tartibi","4 (σ²π⁴δ²)"],["Konformatsiya","Eclipsed (δ bog' uchun)"],["Aylanish to'sig'i","~8−10 kJ/mol"],["Rang","Ko'k-binafsha"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/20"><td className="py-1.5 text-purple-400">{r[0]}</td><td className="py-1.5 text-yellow-400">{r[1]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-yellow-400 font-bold text-sm mb-2">Nima uchun eclipsed konformatsiya?</h3>
            <p className="text-purple-200 text-sm">
              Staggered konformatsiyada δ bog' nolga teng bo'ladi (dxy orbitallar overlap bermaydi).
              Eclipsed konformatsiyada δ bog' maksimal. <strong>δ bog' energiyasi ~10 kJ/mol</strong> — 
              bu Cl−Cl sterik itarilishdan (~2−5 kJ/mol) kattaroq. Shuning uchun molekula 
              <strong>eclipsed konformatsiyani tanlaydi</strong> — oddiy organik molekulalarda (etan) 
              aksincha, staggered barqarorroq!
            </p>
          </div>
        </div>

        {/* 3. BOG' TARTIBI KALKULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <BondOrderKalkulyator />
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Quadruple bond — <strong className="text-blue-400">σ²π⁴δ²</strong>, bog' tartibi = 4</li>
            <li>δ bog' — <strong className="text-blue-400">dxy orbitallarning yonma-yon overlapi</strong></li>
            <li>Eclipsed konformatsiya — <strong className="text-blue-400">δ bog'ni maksimallashtirish uchun</strong></li>
            <li>2005-yilda <strong className="text-blue-400">quintuple bond (bog' tartibi 5)</strong> ham kashf etilgan!</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kop-yadroli" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Ko'p yadroli komplekslar</Link>
          <Link href="/ilmiy/chuqurlashgan/kop-yadroli/karbonil-klasterlar" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Karbonil klasterlar →</Link>
        </div>

      </section>
    </main>
  )
}