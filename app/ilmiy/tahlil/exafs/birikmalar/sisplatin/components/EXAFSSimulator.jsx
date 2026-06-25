"use client"

import { useState, useRef, useEffect } from "react"
import { qobiqlar } from "../data/sisplatin-data"

export default function EXAFSSimulator() {
  const canvasRef = useRef(null)
  const [mode, setMode] = useState("chi")
  const [params, setParams] = useState({
    r1: 2.328, s1: 0.0016,
    r2: 2.012, s2: 0.0015,
    r3: 3.400, s3: 0.0030,
  })
  const [activeShells, setActiveShells] = useState([true, true, false])
  const [showControls, setShowControls] = useState(false)

  const S02 = 0.82
  const N = [2, 2, 3]
  const colors = ["#F0A030", "#4F8EF7", "#EC4899"]
  const shellNames = ["Pt−Cl (1-qobiq)", "Pt−N (2-qobiq)", "Pt−Pt (3-qobiq)"]

  const fkeff = (k, shell) => {
    const f0 = [0.60, 0.45, 0.30][shell]
    const decay = [0.06, 0.05, 0.08][shell]
    return f0 * Math.exp(-decay * k)
  }

  const lambda = (k) => 8 + 0.5 * k

  const chiShell = (k, R, sig2, shell) => {
    const keff = Math.max(k, 0.5)
    const f = fkeff(keff, shell)
    const lam = lambda(keff)
    const phase = 2 * keff * R - Math.PI / 5 + 0.20 * keff
    return S02 * N[shell] * f / (keff * R * R) *
      Math.exp(-2 * sig2 * keff * keff) *
      Math.exp(-2 * R / lam) *
      Math.sin(phase)
  }

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const W = canvas.parentElement?.offsetWidth || 640
    const H = 280
    canvas.width = W * 2; canvas.height = H * 2
    canvas.style.width = W + "px"; canvas.style.height = H + "px"
    const ctx = canvas.getContext("2d"); ctx.scale(2, 2)

    const pad = { l: 55, r: 20, t: 25, b: 45 }
    const gw = W - pad.l - pad.r; const gh = H - pad.t - pad.b
    ctx.fillStyle = "#0a0015"; ctx.fillRect(0, 0, W, H)

    const kmin = 2.5, kmax = 15, pts = 300
    const kArr = []; const shData = [[], [], []]; const tots = []

    for (let i = 0; i <= pts; i++) {
      const k = kmin + (kmax - kmin) * i / pts; kArr.push(k)
      const k2 = mode === "chi" ? k * k : 1
      const c1 = chiShell(k, params.r1, params.s1, 0) * k2
      const c2 = chiShell(k, params.r2, params.s2, 1) * k2
      const c3 = chiShell(k, params.r3, params.s3, 2) * k2
      shData[0].push(c1); shData[1].push(c2); shData[2].push(c3)
      tots.push((activeShells[0]?c1:0) + (activeShells[1]?c2:0) + (activeShells[2]?c3:0))
    }

    if (mode === "ft") {
      const Rpts = 200, Rmax = 6
      const ft = (data) => {
        const res = []
        for (let ri = 0; ri <= Rpts; ri++) {
          const R = Rmax * ri / Rpts; let re = 0, im = 0
          for (let i = 0; i < kArr.length; i++) {
            const k = kArr[i]
            const w = Math.exp(-0.5 * Math.pow((k - 9) / 7, 2))
            re += data[i] * Math.cos(2 * k * R) * w
            im += data[i] * Math.sin(2 * k * R) * w
          }
          res.push(Math.sqrt(re * re + im * im) * (kArr[1] - kArr[0]))
        }
        return res
      }

      const ftTot = ft(tots)
      const ymax = Math.max(...ftTot) * 1.15 || 1

      for (let gx = 0; gx <= 6; gx++) {
        const x = pad.l + gx / Rmax * gw
        ctx.strokeStyle = "rgba(139,92,246,0.1)"; ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + gh); ctx.stroke()
        ctx.fillStyle = "#a78bfa"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
        ctx.fillText(gx, x, pad.t + gh + 16)
      }

      for (let si = 0; si < 3; si++) {
        if (!activeShells[si]) continue
        ctx.strokeStyle = colors[si] + "60"; ctx.lineWidth = 1.2
        ctx.beginPath()
        ft(shData[si]).forEach((v, i) => {
          const x = pad.l + i / Rpts * gw
          const y = pad.t + gh - v / ymax * gh
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        })
        ctx.stroke()
      }

      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2
      ctx.beginPath()
      ftTot.forEach((v, i) => {
        const x = pad.l + i / Rpts * gw
        const y = pad.t + gh - v / ymax * gh
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.stroke()
      ctx.fillStyle = "#a78bfa"; ctx.font = "11px sans-serif"; ctx.textAlign = "center"
      ctx.fillText("R (Å)", pad.l + gw / 2, H - 4)
    } else {
      const allVals = [...tots]
      const ymin = Math.min(...allVals) * 1.2
      const ymax = Math.max(...allVals) * 1.2
      const yr = ymax - ymin || 1

      for (let gx = 3; gx <= 15; gx += 2) {
        const x = pad.l + (gx - kmin) / (kmax - kmin) * gw
        ctx.strokeStyle = "rgba(139,92,246,0.1)"; ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + gh); ctx.stroke()
        ctx.fillStyle = "#a78bfa"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
        ctx.fillText(gx, x, pad.t + gh + 16)
      }

      for (let si = 0; si < 3; si++) {
        if (!activeShells[si]) continue
        ctx.strokeStyle = colors[si] + "60"; ctx.lineWidth = 1.2
        ctx.beginPath()
        shData[si].forEach((v, i) => {
          const x = pad.l + i / pts * gw
          const y = pad.t + gh - (v - ymin) / yr * gh
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        })
        ctx.stroke()
      }

      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2
      ctx.beginPath()
      tots.forEach((v, i) => {
        const x = pad.l + i / pts * gw
        const y = pad.t + gh - (v - ymin) / yr * gh
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.stroke()
      ctx.fillStyle = "#a78bfa"; ctx.font = "11px sans-serif"; ctx.textAlign = "center"
      ctx.fillText("k (Å⁻¹)", pad.l + gw / 2, H - 4)
    }
  }

  useEffect(() => { draw() }, [mode, params, activeShells])

  const handleParam = (key, value) => setParams(prev => ({ ...prev, [key]: parseFloat(value) }))
  const toggleShell = (i) => { const next = [...activeShells]; next[i] = !next[i]; setActiveShells(next) }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">📊 EXAFS χ(k) va FT simulyatori — Sisplatin</h3>
        <button onClick={() => setShowControls(!showControls)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-800/40 text-purple-300 hover:bg-purple-700/50">
          {showControls ? "⚙️ Yashirish" : "⚙️ Parametrlar"}
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setMode("chi")} className={`px-4 py-2 rounded-lg text-xs font-semibold ${mode === "chi" ? "bg-yellow-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>χ(k)·k²</button>
        <button onClick={() => setMode("ft")} className={`px-4 py-2 rounded-lg text-xs font-semibold ${mode === "ft" ? "bg-yellow-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>|FT(χ)|</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {shellNames.map((name, i) => (
          <button key={i} onClick={() => toggleShell(i)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${activeShells[i] ? "bg-purple-800/40 text-purple-300" : "bg-purple-900/20 text-purple-600 line-through"}`}
            style={{ borderLeft: activeShells[i] ? `3px solid ${colors[i]}` : "3px solid transparent" }}>{name}</button>
        ))}
      </div>

      {showControls && (
        <div className="bg-purple-800/20 rounded-lg p-4 border border-purple-700/30 space-y-3">
          {[
            { key: "r1", label: "Pt−Cl masofasi R₁", min: 2.20, max: 2.45, step: 0.001, unit: "Å", value: params.r1 },
            { key: "s1", label: "σ²₁ (Pt−Cl)", min: 0.0005, max: 0.008, step: 0.0001, unit: "Å²", value: params.s1 },
            { key: "r2", label: "Pt−N masofasi R₂", min: 1.90, max: 2.15, step: 0.001, unit: "Å", value: params.r2 },
            { key: "s2", label: "σ²₂ (Pt−N)", min: 0.0005, max: 0.008, step: 0.0001, unit: "Å²", value: params.s2 },
          ].map((p) => (
            <div key={p.key} className="flex items-center gap-3">
              <span className="text-xs text-purple-400 w-36 shrink-0">{p.label}</span>
              <input type="range" min={p.min} max={p.max} step={p.step} value={p.value} onChange={(e) => handleParam(p.key, e.target.value)} className="flex-1 h-1.5 bg-purple-700 rounded-lg cursor-pointer" />
              <span className="text-xs text-yellow-400 font-mono w-20 text-right">{p.value.toFixed(p.key.startsWith("s") ? 4 : 3)} {p.unit}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-black/20 border border-purple-700/30 rounded-xl overflow-hidden">
        <canvas ref={canvasRef} className="w-full" />
      </div>

      <div className="flex gap-4 flex-wrap text-xs">
        {shellNames.map((name, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-6 h-1 rounded" style={{ backgroundColor: colors[i], opacity: activeShells[i] ? 1 : 0.3 }}></div>
            <span className="text-purple-300">{name}</span>
          </div>
        ))}
        <div className="flex items-center gap-2"><div className="w-6 h-1 rounded bg-yellow-400"></div><span className="text-yellow-400">Umumiy</span></div>
      </div>

      <p className="text-purple-500 text-xs">Sisplatin — Pt²⁺ (d⁸), kvadrat tekislik. Pt−Cl = 2.328 Å, Pt−N = 2.012 Å. Saraton dorisi.</p>
    </div>
  )
}