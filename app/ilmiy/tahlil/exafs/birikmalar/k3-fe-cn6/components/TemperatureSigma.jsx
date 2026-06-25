"use client"

import { useState, useRef, useEffect } from "react"
import { temperatureData } from "../data/k3-fe-cn6-data"

export default function TemperatureSigma() {
  const [T, setT] = useState(300)
  const canvasRef = useRef(null)

  const thetaE = 750
  const sigmaStatic = temperatureData.sigmaStatic
  const hbar2over2mu = 0.0021 // ℏ²/2μk_B Fe−C uchun

  const sigmaThermal = (temp) => {
    if (temp <= 0) return 0
    const x = thetaE / (2 * temp)
    return hbar2over2mu * (1 / thetaE) * (Math.cosh(x) / Math.sinh(x))
  }

  const sigmaTotal = (temp) => sigmaStatic + sigmaThermal(temp)

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const W = canvas.parentElement?.offsetWidth || 500
    const H = 250
    canvas.width = W * 2
    canvas.height = H * 2
    canvas.style.width = W + "px"
    canvas.style.height = H + "px"
    const ctx = canvas.getContext("2d")
    ctx.scale(2, 2)

    const pad = { l: 55, r: 25, t: 25, b: 45 }
    const gw = W - pad.l - pad.r
    const gh = H - pad.t - pad.b

    // Fon
    ctx.fillStyle = "#0a0015"
    ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = "rgba(139, 92, 246, 0.1)"
    ctx.lineWidth = 0.5
    for (let t = 0; t <= 400; t += 100) {
      const x = pad.l + t / 400 * gw
      ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + gh); ctx.stroke()
      ctx.fillStyle = "#a78bfa"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(t + "K", x, pad.t + gh + 16)
    }

    // σ² egri chizig'i
    const pts = 200
    const sigmaVals = []
    const Tmax = 400
    for (let i = 0; i <= pts; i++) {
      const temp = Tmax * i / pts
      sigmaVals.push(sigmaTotal(temp))
    }
    const sigMin = sigmaStatic * 0.9
    const sigMax = Math.max(...sigmaVals) * 1.15
    const sigRange = sigMax - sigMin

    // σ² static
    ctx.strokeStyle = "rgba(139, 92, 246, 0.3)"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    const yStatic = pad.t + gh - (sigmaStatic - sigMin) / sigRange * gh
    ctx.beginPath(); ctx.moveTo(pad.l, yStatic); ctx.lineTo(pad.l + gw, yStatic); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = "#a78bfa"
    ctx.font = "10px sans-serif"
    ctx.fillText("σ²_stat = " + sigmaStatic.toFixed(4), pad.l + 5, yStatic - 5)

    // σ²(T)
    ctx.strokeStyle = "#f97316"
    ctx.lineWidth = 2.5
    ctx.beginPath()
    sigmaVals.forEach((v, i) => {
      const x = pad.l + i / pts * gw
      const y = pad.t + gh - (v - sigMin) / sigRange * gh
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Joriy T nuqtasi
    const currentSigma = sigmaTotal(T)
    const cx = pad.l + T / Tmax * gw
    const cy = pad.t + gh - (currentSigma - sigMin) / sigRange * gh
    ctx.fillStyle = "#fbbf24"
    ctx.beginPath()
    ctx.arc(cx, cy, 5, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.stroke()

    // O'qlar
    ctx.fillStyle = "#a78bfa"
    ctx.font = "11px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Harorat (K)", pad.l + gw / 2, H - 4)
    ctx.save()
    ctx.translate(12, pad.t + gh / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("σ² (Å²)", 0, 0)
    ctx.restore()
  }

  useEffect(() => { draw() }, [T])

  const currentSigma = sigmaTotal(T)
  const currentThermal = sigmaThermal(T)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌡️ Haroratga bog'liq Debay-Uoller faktori — σ²(T)</h3>

      <div className="bg-purple-800/20 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">σ² — Debay-Uoller faktori</strong> ikki qismdan iborat:
          <strong> σ²_stat</strong> (statik tartibsizlik) + <strong>σ²_therm(T)</strong> (termik tebranishlar).
          <strong> Einstein modeli</strong> bo'yicha: σ²_therm(T) = (ℏ²/2μk_BΘ_E) · coth(Θ_E/2T).
          Fe−C bog'i uchun <strong>Θ_E ≈ {thetaE} K</strong> (CN⁻ yuqori stretching chastotasi tufayli).
        </p>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs text-purple-400">10 K</span>
          <input
            type="range"
            min="10" max="400" step="5"
            value={T}
            onChange={(e) => setT(+e.target.value)}
            className="flex-1 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-purple-400">400 K</span>
          <span className="text-yellow-400 font-bold text-sm w-16 text-right">{T} K</span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">σ²_stat</p>
            <p className="text-blue-400 font-mono text-lg">{sigmaStatic.toFixed(4)} Å²</p>
            <p className="text-purple-500">Statik</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">σ²_therm</p>
            <p className="text-orange-400 font-mono text-lg">{currentThermal.toFixed(4)} Å²</p>
            <p className="text-purple-500">{T} K da</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3 border border-yellow-500/30">
            <p className="text-purple-400">σ²_total</p>
            <p className="text-yellow-400 font-mono text-lg">{currentSigma.toFixed(4)} Å²</p>
            <p className="text-purple-500">σ²_stat + σ²_therm</p>
          </div>
        </div>

        <div className="bg-black/20 border border-purple-700/30 rounded-xl overflow-hidden">
          <canvas ref={canvasRef} className="w-full" />
        </div>

        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun past haroratda EXAFS yaxshiroq?</p>
          <p className="text-purple-200">
            Harorat pasayganda σ²_therm <strong>kamayadi</strong> → EXAFS ossillyatsiyalari 
            <strong> kuchayadi</strong> va yuqori k qiymatlarigacha cho'ziladi → 
            <strong> aniqlik ortadi</strong>. Shuning uchun EXAFS tajribalari ko'pincha 
            <strong> 77 K (suyuq azot)</strong> yoki <strong>10 K (suyuq geliy)</strong> da o'tkaziladi.
          </p>
        </div>
      </div>
    </div>
  )
}