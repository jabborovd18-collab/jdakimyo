"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. INTERAKTIV VIZUAL — CANVAS
// ═══════════════════════════════════════════════════════════════════════════════
function SimmetriyaCanvas() {
  const [selected, setSelected] = useState("cn")
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2
    ctx.clearRect(0, 0, w, h)
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120)
    grad.addColorStop(0, "#1a0a2e"); grad.addColorStop(1, "#0a0018")
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h); ctx.translate(cx, cy)
    ctx.strokeStyle = "rgba(139,92,246,0.08)"; ctx.lineWidth = 0.5
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath(); ctx.moveTo(i*35, -105); ctx.lineTo(i*35, 105); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(-105, i*35); ctx.lineTo(105, i*35); ctx.stroke()
    }
    const dr = (x,y,r,c,l,f)=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=c;ctx.strokeStyle=c;ctx.lineWidth=2;if(f)ctx.fill();ctx.stroke();if(l){ctx.fillStyle="#fff";ctx.font="bold 11px monospace";ctx.textAlign="center";ctx.fillText(l,x,y+4)}}
    const data = {
      cn:{title:"Cₙ — Aylanish o'qi", sym:"360°/n",color:"#ef4444",draw:()=>{for(let i=0;i<4;i++){const a=i*Math.PI/2,r=60;ctx.beginPath();ctx.ellipse(r*Math.cos(a),r*Math.sin(a),18,12,a,0,Math.PI*2);ctx.strokeStyle="#ef4444";ctx.lineWidth=2;ctx.stroke();ctx.fillStyle="rgba(239,68,68,0.15)";ctx.fill()}ctx.strokeStyle="#ef4444";ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(0,-100);ctx.lineTo(0,100);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#ef4444";ctx.font="bold 12px sans-serif";ctx.textAlign="center";ctx.fillText("C₄ (z)",0,-90)}},
      sigma:{title:"σ — Aks tekisligi", sym:"m",color:"#22c55e",draw:()=>{ctx.strokeStyle="#22c55e";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,80,30,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle="rgba(34,197,94,0.1)";ctx.fill();ctx.beginPath();ctx.moveTo(0,-90);ctx.lineTo(0,90);ctx.stroke();ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(-90,0);ctx.lineTo(90,0);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#22c55e";ctx.font="bold 11px sans-serif";ctx.textAlign="center";ctx.fillText("σh (xy)",55,20);ctx.fillText("σv (xz)",10,-78)}},
      inversion:{title:"i — Inversiya markazi", sym:"ī",color:"#3b82f6",draw:()=>{for(let i=0;i<6;i++){const a=i*Math.PI/3,r=55,x=r*Math.cos(a),y=r*Math.sin(a);dr(x,y,8,"#3b82f6");dr(-x,-y,8,"#60a5fa");ctx.strokeStyle="rgba(59,130,246,0.3)";ctx.lineWidth=1;ctx.setLineDash([2,3]);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(-x,-y);ctx.stroke();ctx.setLineDash([])}dr(0,0,5,"#fbbf24","i",true)}},
      sn:{title:"Sₙ — Aylanma-aks", sym:"n",color:"#a855f7",draw:()=>{for(let i=0;i<6;i++){const a=i*Math.PI/3,r=50,x=r*Math.cos(a),y=r*Math.sin(a)*0.5;dr(x,y,7,"#a855f7",String(i+1));ctx.strokeStyle="rgba(168,85,247,0.3)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(x,y);ctx.stroke()}ctx.strokeStyle="#a855f7";ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(0,-90);ctx.lineTo(0,90);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#a855f7";ctx.font="bold 11px sans-serif";ctx.textAlign="center";ctx.fillText("S₆ (z)",0,-78)}},
      identity:{title:"E — Ayniyat (identity)", sym:"1",color:"#fbbf24",draw:()=>{ctx.fillStyle="#fbbf24";ctx.font="bold 40px sans-serif";ctx.textAlign="center";ctx.fillText("E",0,15);ctx.strokeStyle="rgba(251,191,36,0.3)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,50,0,Math.PI*2);ctx.stroke()}}
    }
    const d = data[selected]; ctx.translate(-cx,-cy)
    ctx.fillStyle="#a78bfa"; ctx.font="bold 12px sans-serif"; ctx.textAlign="left"; ctx.fillText(d.title,10,18)
    ctx.fillStyle="rgba(168,85,247,0.5)"; ctx.font="10px sans-serif"; ctx.fillText(`Belgi: ${d.sym}`,10,32)
    ctx.save(); ctx.translate(cx,cy); d.draw(); ctx.restore()
  }, [selected])

  const els = { cn:{l:"Cₙ Aylanish",c:"text-red-400",b:"bg-red-600/10 border-red-500/30"}, sigma:{l:"σ Aks tekisligi",c:"text-green-400",b:"bg-green-600/10 border-green-500/30"}, inversion:{l:"i Inversiya",c:"text-blue-400",b:"bg-blue-600/10 border-blue-500/30"}, sn:{l:"Sₙ Aylanma-aks",c:"text-purple-400",b:"bg-purple-600/10 border-purple-500/30"}, identity:{l:"E Ayniyat",c:"text-yellow-400",b:"bg-yellow-600/10 border-yellow-500/30"} }
  const e = els[selected]
  const items = { cn:["C₂ (180°): H₂O","C₃ (120°): NH₃","C₄ (90°): [PtCl₄]²⁻"], sigma:["σ_v — vertikal (asosiy o'q bo'ylab)","σ_h — gorizontal (perpendikulyar)","σ_d — diagonal (45° da)"], inversion:["[Co(NH₃)₆]³⁺: oktaedr (i bor)","CH₄: tetraedr (i yo'q)","SF₆: oktaedr (i bor)"], sn:["S₆: C₃ + σh — oktaedr","S₄: C₄ + σh — tetraedr","S₁=σ, S₂=i"], identity:["Barcha molekulalarda mavjud","Guruh nazariyasida 1-element","E × R = R (istalgan amal)"] }[selected]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <div className="flex gap-1.5 flex-wrap mb-4">
        {Object.entries(els).map(([k,v])=>(
          <button key={k} onClick={()=>setSelected(k)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${selected===k ? `${v.b} ${v.c} scale-105` : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{v.l}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <canvas ref={canvasRef} width={300} height={220} className="w-full h-48 bg-purple-950/60 rounded-xl border border-purple-700/40" />
        <div className={`rounded-xl p-4 border ${e.b}`}>
          <h4 className={`font-bold text-sm ${e.c} mb-2`}>{e.l}</h4>
          <ul className="text-purple-200 text-xs space-y-1">{items.map((item,i)=><li key={i}>• {item}</li>)}</ul>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Cₙ — AYLANISH O'QI, TO'LIQ MATEMATIKA
// ═══════════════════════════════════════════════════════════════════════════════
function CnAylanish() {
  const [nVal, setNVal] = useState(4)
  const [showMath, setShowMath] = useState(true)

  const rotationMatrix = (n) => {
    const angle = 2 * Math.PI / n
    const c = Math.cos(angle).toFixed(4)
    const s = Math.sin(angle).toFixed(4)
    return (
      <div className="font-mono text-xs">
        <p className="text-yellow-300">R({360/n}°) = </p>
        <table className="inline-table mx-auto my-1">
          <tbody>
            <tr>
              <td className="px-1 border border-purple-600/40">{c}</td>
              <td className="px-1 border border-purple-600/40">−{s}</td>
              <td className="px-1 border border-purple-600/40">0</td>
            </tr>
            <tr>
              <td className="px-1 border border-purple-600/40">{s}</td>
              <td className="px-1 border border-purple-600/40">{c}</td>
              <td className="px-1 border border-purple-600/40">0</td>
            </tr>
            <tr>
              <td className="px-1 border border-purple-600/40">0</td>
              <td className="px-1 border border-purple-600/40">0</td>
              <td className="px-1 border border-purple-600/40">1</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  const examples = {
    2: { deg: "180°", complexes: "H₂O (C₂), [PtCl₄]²⁻ — 2×C₂'", det: "+1", trace: "−2", char: "−1" },
    3: { deg: "120°", complexes: "NH₃ (C₃), [Co(NH₃)₆]³⁺ — 4×C₃", det: "+1", trace: "0", char: "0" },
    4: { deg: "90°", complexes: "[Fe(CN)₆]⁴⁻ — 3×C₄, [PtCl₄]²⁻ — C₄", det: "+1", trace: "1", char: "1" },
    6: { deg: "60°", complexes: "[Cr(C₆H₆)₂] — C₆, benzinli komplekslar", det: "+1", trace: "2", char: "2" },
  }
  const ex = examples[nVal] || examples[4]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-red-400">🔄</span> Cₙ — Aylanish o'qi
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3">
          <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
            <strong className="text-yellow-400">Aylanish o'qi Cₙ</strong> — molekulani shu o'q atrofida <strong>360°/n</strong> burchakka aylantirganda 
            molekula o'zining dastlabki konfiguratsiyasiga qaytadigan o'q. n — <strong>butun son</strong> (1, 2, 3, 4, 5, 6, ∞).
            Eng yuqori tartibli aylanish o'qi <strong className="text-yellow-400">bosh o'q</strong> deb ataladi. Cₙ amali <strong>n marta</strong> takrorlanganda 
            E (ayniyat) amaliga teng bo'ladi: <strong>Cₙⁿ = E</strong>.
          </p>

          <div className="flex gap-2 flex-wrap">
            {[2,3,4,6].map(n=>(
              <button key={n} onClick={()=>setNVal(n)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${nVal===n?"bg-red-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>C{n} ({360/n}°)</button>
            ))}
          </div>

          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1 text-xs">
            <p className="flex justify-between"><span className="text-purple-400">Aylanish burchagi:</span><span className="text-yellow-300 font-mono">{ex.deg}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">det(R):</span><span className="text-yellow-300 font-mono">{ex.det}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">Iz (trace):</span><span className="text-yellow-300 font-mono">{ex.trace}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">Xarakter χ(Cₙ):</span><span className="text-yellow-300 font-mono">{ex.char}</span></p>
            <p className="text-purple-300 mt-2">{ex.complexes}</p>
          </div>
        </div>

        <div className="space-y-3">
          {showMath && (
            <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-3 text-center">
              <p className="text-purple-400 text-[10px] mb-2">Aylanish matritsasi (z o'qi atrofida):</p>
              {rotationMatrix(nVal)}
              <p className="text-purple-400 text-[10px] mt-2">
                χ(Cₙ) = 1 + 2cos(2π/n) = {ex.char}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-purple-400 font-bold text-[10px]">Kompleks birikmalarda Cₙ:</h4>
            {[
              {n:2, label:"C₂", desc:"H₂O (C₂), [PtCl₄]²⁻ (2×C₂'), oktaedrikda 6×C₂"},
              {n:3, label:"C₃", desc:"NH₃, [Co(NH₃)₆]³⁺ (4×C₃), tetraedrikda 4×C₃"},
              {n:4, label:"C₄", desc:"[Fe(CN)₆]⁴⁻ (3×C₄), [PtCl₄]²⁻ (C₄)"},
              {n:6, label:"C₆", desc:"[Cr(C₆H₆)₂], heksagonal komplekslar"},
            ].map((r,i)=>(
              <div key={i} className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2 text-[10px]">
                <span className="text-red-400 font-bold">{r.label}: </span><span className="text-purple-200">{r.desc}</span>
              </div>
            ))}
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
            <p className="text-yellow-400 font-bold">⚡ Aylanish o'qi — xarakterlar jadvalidagi χ(Cₙ) qiymatini belgilaydi.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. σ — AKS TEKISLIGI, MATEMATIK IFODA
// ═══════════════════════════════════════════════════════════════════════════════
function AksTekisligi() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><span className="text-green-400">🪞</span> σ — Aks tekisligi</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3">
          <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
            <strong className="text-yellow-400">Aks tekisligi σ</strong> — molekulani shu tekislikka nisbatan akslantirganda 
            (ko'zgudagi kabi) molekula o'zining dastlabki holatiga qaytadi. σ amalining <strong>determinanti −1</strong>.
            Aks tekisliklari <strong>3 turga</strong> bo'linadi.
          </p>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 mb-1">σ(xy) aks matritsasi:</p>
            <p className="text-yellow-300 font-mono text-center">
              (x,y,z) → (x,y,−z)
            </p>
            <p className="text-purple-400 mt-1">det = −1, iz = 1, χ(σ) = 1</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              {t:"σ_h — gorizontal",d:"Bosh o'qqa perpendikulyar. [PtCl₄]²⁻ — molekula tekisligi. χ = 1"},
              {t:"σ_v — vertikal",d:"Bosh o'qni o'z ichiga oladi. NH₃ da 3 ta σ_v. χ = 1"},
              {t:"σ_d — diagonal",d:"C₂ o'qlari orasida. [CoCl₄]²⁻ da 6 ta σ_d. χ = 1"},
            ].map((r,i)=>(
              <div key={i} className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2 text-xs">
                <span className={`text-${["green","blue","purple"][i]}-400 font-bold`}>{r.t}</span>
                <span className="text-purple-200"> — {r.d}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <h4 className="text-purple-400 font-bold mb-2">🎯 σ tekisliklarining fizik ahamiyati:</h4>
            <ul className="text-purple-200 space-y-1">
              <li>• σ_h + Cₙ → Sₙ aylanma-aks o'qini hosil qiladi</li>
              <li>• σ_h mavjudligi → molekula planar (tekis) bo'lishi mumkin</li>
              <li>• σ_v mavjudligi → dipol moment nolga teng bo'lishi mumkin</li>
              <li>• σ_d → D guruhlarida muhim (yana qo'shimcha simmetriya)</li>
              <li>• χ(σ) = 1 → xarakterlar jadvalida muhim parametr</li>
            </ul>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <h4 className="text-purple-400 font-bold mb-2">Misol — σ_h va σ_v ni aniqlash:</h4>
            <p className="text-purple-200"><strong className="text-yellow-400">[PtCl₄]²⁻:</strong> Kvadrat tekis. Molekula tekisligi = σ_h. Pt−Cl bog'lari orqali 2×σ_v. Diagonallar bo'ylab 2×σ_d.</p>
            <p className="text-purple-200 mt-2"><strong className="text-yellow-400">NH₃:</strong> Piramidal. C₃ o'qini o'z ichiga olgan 3 ta σ_v. σ_h yo'q (chunki C₃ ga perpendikulyar tekislik yo'q).</p>
          </div>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
            <p className="text-yellow-400 font-bold">⚡ σ_h mavjudligi → molekula Dₙₕ yoki Cₙₕ guruhiga kiradi. σ_v mavjudligi → Cₙᵥ.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. i — INVERSIYA MARKAZI, LAPORT QOIDASI
// ═══════════════════════════════════════════════════════════════════════════════
function Inversiya() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><span className="text-blue-400">◎</span> i — Inversiya markazi</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3">
          <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
            <strong className="text-yellow-400">Inversiya markazi i</strong> — molekuladagi shunday nuqtaki, har bir atomni (x,y,z) → (−x,−y,−z) 
            koordinataga o'zgartirganda molekula o'zining dastlabki holatiga qaytadi. <strong>det = −1</strong>, <strong>iz = −3</strong>, <strong>χ(i) = −3</strong>.
          </p>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 mb-1">Inversiya matritsasi:</p>
            <p className="text-yellow-300 font-mono text-center">
              (x,y,z) → (−x,−y,−z) &nbsp;|&nbsp; diag(−1,−1,−1)
            </p>
            <p className="text-purple-400 mt-1">det = −1, iz = −3, χ(i) = −3</p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3 text-xs">
            <p className="text-blue-400 font-bold mb-1">⚡ Laport qoidasi (seleksiya qoidasi):</p>
            <p className="text-purple-200">Inversiya markazi bo'lgan komplekslarda <strong className="text-yellow-300">g → g</strong> va <strong className="text-yellow-300">u → u</strong> o'tishlar <strong>taqiqlangan</strong>. Faqat <strong>g ↔ u</strong> o'tishlari ruxsat etilgan.</p>
            <p className="text-purple-300 mt-1">Shuning uchun oktaedrik komplekslarda d-d o'tishlar kuchsiz (ε ≈ 1−100 M⁻¹cm⁻¹), tetraedrikda esa kuchli (ε ≈ 100−1000).</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-3 text-xs">
              <p className="text-green-400 font-bold mb-1">✓ i bor — Oktaedrik, D4h, D6h</p>
              <p className="text-purple-200">[Co(NH₃)₆]³⁺, [Fe(CN)₆]⁴⁻, [PtCl₄]²⁻, [Ni(CN)₄]²⁻, [Cr(H₂O)₆]³⁺</p>
              <p className="text-purple-300 mt-1">IQ va Raman <strong className="text-yellow-300">alternativ taqiq</strong> — IQ faol tebranishlar Raman faol emas.</p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-3 text-xs">
              <p className="text-red-400 font-bold mb-1">✗ i yo'q — Tetraedrik, C₂v, C₃v</p>
              <p className="text-purple-200">[CoCl₄]²⁻, [Ni(CO)₄], CH₄, [MnO₄]⁻, H₂O, NH₃</p>
              <p className="text-purple-300 mt-1">IQ va Raman <strong className="text-yellow-300">bir-birini to'ldiradi</strong> — ba'zi modlar ikkalasida ham faol.</p>
            </div>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <h4 className="text-purple-400 font-bold mb-1">Muhim xulosalar:</h4>
            <ul className="text-purple-200 space-y-0.5">
              <li>• Tetraedrik + oktaedrik = i mavjudligi bilan farqlanadi</li>
              <li>• i bor → molekulada dipol moment = 0</li>
              <li>• g = gerade (juft, simmetrik), u = ungerade (toq, antisimmetrik)</li>
              <li>• i ga nisbatan: s, d, g orbitallar → g; p, f orbitallar → u</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Sₙ — AYLANMA-AKS + AMALLAR KO'PAYTMASI
// ═══════════════════════════════════════════════════════════════════════════════
function AylanmaAks() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><span className="text-purple-400">🔀</span> Sₙ — Aylanma-aks o'qi</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3">
          <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
            <strong className="text-yellow-400">Sₙ</strong> — ikkita ketma-ket amalning kombinatsiyasi: 
            avval Cₙ atrofida 360°/n ga aylantirish, so'ngra shu o'qqa perpendikulyar tekislikka nisbatan akslantirish (σ_h).
            <strong className="text-yellow-400"> S₁ = σ</strong> (360° aylanish + aks), <strong className="text-yellow-400">S₂ = i</strong> (180° aylanish + aks = inversiya).
          </p>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 mb-1">Sₙ = Cₙ × σ_h (kommutativ emas!)</p>
            <p className="text-yellow-300 font-mono text-center text-sm">Sₙⁿ = E (agar n juft bo'lsa)</p>
            <p className="text-purple-400 mt-1">Sₙ² = Cₙ² × σ_h² = Cₙ² (chunki σ_h² = E)</p>
          </div>
          <div className="space-y-2">
            {[
              {t:"S₄ — tetraedrikda (3 ta)", d:"[CoCl₄]²⁻. S₄ amali: 90° aylantirish + aks. Tetraedrik simmetriyaning asosiy belgisi!"},
              {t:"S₆ — oktaedrikda (4 ta)", d:"[Co(NH₃)₆]³⁺. C₃ o'qi bir vaqtning o'zida S₆. C₃ × σ_h = S₆."},
              {t:"S₂ = i", d:"C₂ × σ_h = i. Agar C₂ va σ_h bo'lsa, i avtomatik mavjud."},
            ].map((r,i)=>(
              <div key={i} className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2 text-xs">
                <span className="text-purple-300 font-bold">{r.t}</span><span className="text-purple-200"> — {r.d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-3">
            <h4 className="text-purple-400 font-bold text-[10px] mb-2">Amallar ko'paytmasi jadvali:</h4>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {[
                ["C₂ × C₂ = C₂ (yangi o'q)", "Ikki C₂ ko'paytmasi uchinchi C₂ ni beradi"],
                ["C₂ × σ_h = i", "Kvadrat-planarda C₂ + σ_h → i (inversiya)"],
                ["C₄ × σ_h = S₄", "Tetraedrikda S₄ mavjudligining sababi"],
                ["σ_v × σ'_v = Cₙ", "Ikki σ_v ko'paytmasi Cₙ ni beradi"],
                ["i × σ = C₂", "Inversiya + aks = C₂ (tekislikka perpendikulyar)"],
                ["C₃ × σ_h = S₆", "Oktaedrikda S₆ mavjudligi"],
              ].map((r,i)=>(
                <div key={i} className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2">
                  <p className="text-yellow-300 font-bold">{r[0]}</p>
                  <p className="text-purple-300 mt-0.5">{r[1]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <h4 className="text-purple-400 font-bold mb-1">Simmetriya amallari to'plami = Guruh:</h4>
            <ul className="text-purple-200 space-y-0.5">
              <li>• <strong>Yopiq:</strong> ikki amal ko'paytmasi yana guruhga tegishli</li>
              <li>• <strong>Assotsiativ:</strong> (AB)C = A(BC)</li>
              <li>• <strong>Neytral element:</strong> E (ayniyat) mavjud</li>
              <li>• <strong>Teskari element:</strong> har bir amalning teskarisi mavjud</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. XARAKTERLAR ASOSIDA SIMMETRIYA
// ═══════════════════════════════════════════════════════════════════════════════
function XarakterAsoslari() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><span className="text-cyan-400">📊</span> Simmetriya amallarining xarakteri</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {amal:"E", mat:"diag(1,1,1)", iz:"3", det:"+1", xar:"3"},
          {amal:"C₂", mat:"diag(−1,−1,1)", iz:"−1", det:"+1", xar:"−1"},
          {amal:"C₄", mat:"R(90°)", iz:"1", det:"+1", xar:"1"},
          {amal:"C₃", mat:"R(120°)", iz:"0", det:"+1", xar:"0"},
          {amal:"σ(xy)", mat:"diag(1,1,−1)", iz:"1", det:"−1", xar:"1"},
          {amal:"σ(xz)", mat:"diag(1,−1,1)", iz:"1", det:"−1", xar:"1"},
          {amal:"i", mat:"diag(−1,−1,−1)", iz:"−3", det:"−1", xar:"−3"},
          {amal:"S₄", mat:"R(90°)×σ_h", iz:"−1", det:"−1", xar:"−1"},
        ].map((r,i)=>(
          <div key={i} className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-xs">
            <p className="text-amber-300 font-bold font-mono">{r.amal}</p>
            <p className="text-purple-400 text-[9px]">mat={r.mat}</p>
            <div className="flex gap-2 mt-0.5"><span className="text-cyan-300">iz={r.iz}</span><span className="text-green-300">det={r.det}</span><span className="text-yellow-300">χ={r.xar}</span></div>
          </div>
        ))}
      </div>
      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-yellow-400 font-bold">⚡ Xarakter χ(R) = iz(R) — 3×3 aylanish/aks matritsasining izi. Xarakterlar jadvalining asosiy ma'lumoti.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. TEST — 10 SAVOL
// ═══════════════════════════════════════════════════════════════════════════════
function TestElementlar() {
  const questions = [
    { q: "Nechta asosiy simmetriya elementi mavjud?", a: "5 ta (E, Cₙ, σ, i, Sₙ)", opts: ["3 ta", "4 ta", "5 ta (E, Cₙ, σ, i, Sₙ)", "6 ta"], hint: "E, Cₙ, σ, i, Sₙ" },
    { q: "C₄ aylanish o'qi necha gradusga aylantiradi?", a: "90°", opts: ["60°", "90°", "120°", "180°"], hint: "360°/4 = 90°" },
    { q: "σ(xy) aks matritsasining determinanti?", a: "−1", opts: ["+1", "−1", "0", "±1"], hint: "Ko'zgudagi aks — determinant −1" },
    { q: "S₂ qaysi simmetriya elementiga teng?", a: "i (inversiya markazi)", opts: ["σ (aks)", "C₂ (aylanish)", "i (inversiya markazi)", "S₄"], hint: "C₂ × σ_h = i" },
    { q: "Oktaedrik va tetraedrik komplekslarni farqlash belgisi?", a: "Inversiya markazi (i)", opts: ["C₄ o'qi", "Inversiya markazi (i)", "σ_h tekisligi", "C₃ soni"], hint: "Oktaedrikda i bor, tetraedrikda yo'q" },
    { q: "Laport qoidasiga ko'ra, g→g o'tish...", a: "Taqiqlangan", opts: ["Ruxsat", "Taqiqlangan", "Kuchli", "Zaif"], hint: "Inversiya markazi bo'lgan komplekslarda g→g taqiqlangan" },
    { q: "C₃ aylanish o'qining xarakteri χ(C₃)?", a: "0", opts: ["−1", "0", "1", "3"], hint: "χ(Cₙ) = 1 + 2cos(2π/n); n=3 → 1+2cos(120°)=1−1=0" },
    { q: "σ_v va σ'_v ko'paytmasi qanday amalni beradi?", a: "Cₙ (aylanish o'qi)", opts: ["σ_h", "i", "Cₙ (aylanish o'qi)", "Sₙ"], hint: "Ikki aks tekisligi ko'paytmasi aylanish o'qini beradi" },
    { q: "Qaysi geometriyada S₄ o'qi mavjud?", a: "Tetraedrik (T_d)", opts: ["Oktaedrik (O_h)", "Tetraedrik (T_d)", "Kvadrat (D4h)", "Chiziqli"], hint: "Tetraedrik simmetriyaning belgisi" },
    { q: "Inversiya markazi bor komplekslarda IQ va Raman o'zaro...", a: "Alternativ (IQ faol = Raman faol emas)", opts: ["Bir xil faol", "Alternativ (IQ faol = Raman faol emas)", "Hech biri faol emas", "Ikkalasi ham faol"], hint: "Alternativ taqiq qoidasi" },
  ]

  const [c, setC] = useState(0); const [s, setS] = useState(null); const [sc, setSc] = useState(0)
  const [res, setRes] = useState(false); const [ans, setAns] = useState({})
  const q = questions[c]
  if (res) {
    return (
      <div className="space-y-4">
        <h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">{sc >= 8 ? "🏆" : sc >= 5 ? "👍" : "📚"}</div>
          <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
          <p className="text-purple-300 mt-2">{sc >= 8 ? "Simmetriya elementlarini mukammal o'zlashtirdingiz!" : sc >= 5 ? "Yaxshi. Yana takrorlash kerak." : "Qayta o'qib chiqing."}</p>
          <button onClick={() => { setC(0); setS(null); setSc(0); setRes(false); setAns({}) }} className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">Qayta</button>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg">📝 Bilim tekshirish — {c+1}/{questions.length}</h3>
      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-6">
        <p className="text-white font-bold text-base mb-4">{q.q}</p>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => !s && (() => { setS(opt); const ok = opt === q.a; if (ok && !ans[c]) setSc(p => p+1); setAns(p => ({...p, [c]: ok})) })()}
              className={`p-3 rounded-xl text-sm text-left border transition-all ${s === opt ? (opt === q.a ? "bg-green-600/20 border-green-500 text-green-200" : "bg-red-600/20 border-red-500 text-red-200") : s ? (opt === q.a ? "bg-green-600/20 border-green-500 text-green-200 opacity-60" : "bg-purple-800/40 border-purple-700/40 text-purple-300 opacity-50") : "bg-purple-800/40 border-purple-700/40 text-purple-200 hover:bg-purple-700/60"}`}>
              {opt}</button>
          ))}
        </div>
        {s && (
          <div className="space-y-2">
            <div className={`text-xs p-3 rounded-lg ${s === q.a ? "bg-green-600/10 border-green-500 text-green-300" : "bg-red-600/10 border-red-500 text-red-300"}`}>{s === q.a ? "✅ To'g'ri!" : "❌ Noto'g'ri"}</div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-xs"><span className="text-yellow-400 font-bold">💡 </span><span className="text-purple-200">{q.hint}</span></div>
            <button onClick={() => { if (c < questions.length-1) { setC(p => p+1); setS(null) } else setRes(true) }} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">{c < questions.length-1 ? "Keyingi →" : "Natijalarni ko'rish"}</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function Elementlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/simmetriya" className="hover:text-purple-300">Simmetriya</Link><span className="text-purple-600">›</span>
            <span className="text-red-400">Elementlar</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-red-400 flex items-center gap-2"><span>🪞</span> Simmetriya elementlari va amallari</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">Cₙ • σ • i • Sₙ • E • Matematik asoslar • Laport qoidasi • OTM darajasi</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Simmetriya elementlari — molekulalar geometriyasining tili</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Simmetriya elementi</strong> — molekulada mavjud bo'lgan geometrik obyekt 
                (o'q, tekislik, nuqta) bo'lib, unga nisbatan <strong className="text-yellow-400">simmetriya amali</strong> 
                bajarilganda molekula o'zining dastlabki holatiga qaytadi. Kompleks birikmalarda 
                <strong> 5 ta asosiy simmetriya elementi</strong> mavjud. Har bir elementning mavjudligi yoki 
                yo'qligi kompleksning dipol momenti, optik faolligi, IQ/Raman spektrlari va d-orbital ajralishini belgilaydi.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded-full text-[10px]">5 ta element</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full text-[10px]">Aylanish matritsasi</span>
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">Laport qoidasi</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-red-400 font-bold">🎯 Maqsad:</span> 5 ta simmetriya elementining matematik ifodasini, fizik ma'nosini va kompleks birikmalardagi ahamiyatini tushunish.</p>
              <p className="text-purple-300"><span className="text-red-400 font-bold">⏱️ Vaqt:</span> ~3.5 soat</p>
              <p className="text-purple-300"><span className="text-red-400 font-bold">📚 Manba:</span> F.A. Cotton — Chemical Applications of Group Theory</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-red-300 font-mono text-xs">Simmetriya — kompleks kimyosining tili!</p>
              </div>
            </div>
          </div>
        </div>

        {/* INTERAKTIV CANVAS */}
        <SimmetriyaCanvas />
        {/* MATEMATIK BO'LIMLAR */}
        <CnAylanish />
        <AksTekisligi />
        <Inversiya />
        <AylanmaAks />
        <XarakterAsoslari />
        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <TestElementlar />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">5 ta simmetriya elementi:</strong> E (identifikatsiya), Cₙ (aylanish), σ (aks), i (inversiya), Sₙ (aylanma-aks)</li>
            <li>Cₙ matritsasi: R(360°/n); χ(Cₙ) = 1 + 2cos(2π/n). C₃ → χ = 0, C₄ → χ = 1</li>
            <li>σ matritsasi: diag(1,1,−1); det = −1, χ(σ) = 1</li>
            <li>i matritsasi: diag(−1,−1,−1); det = −1, χ(i) = −3</li>
            <li><strong className="text-yellow-400">Laport qoidasi:</strong> g → g o'tish taqiqlangan. i bor → IQ/Raman alternativ taqiq</li>
            <li><strong className="text-yellow-400">S₁ = σ, S₂ = i.</strong> S₄ — tetraedrik simmetriyaning asosiy belgisi</li>
            <li>Simmetriya amallari <strong className="text-yellow-400">guruh</strong> tashkil qiladi: yopiq, assotsiativ, neytral E, teskari element</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/simmetriya" className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2"><span>←</span> Simmetriya</Link>
          <Link href="/ilmiy/chuqurlashgan/simmetriya/nuqtali-guruhlar" className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-500/20">Nuqtali guruhlar <span>→</span></Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manba:</strong> F.A. Cotton — Chemical Applications of Group Theory | Housecroft — Inorganic Chemistry</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  )
}
