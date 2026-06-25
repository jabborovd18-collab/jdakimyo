"use client"

import Link from "next/link"
import { basicInfo } from "./data/k3-fe-cn6-data"
import EXAFSSimulator from "./components/EXAFSSimulator"
import XANESPreEdge from "./components/XANESPreEdge"
import OksidlanishKalkulyatori from "./components/OksidlanishKalkulyatori"
import EXAFSTable from "./components/EXAFSTable"
import MossbauerSection from "./components/MossbauerSection"
import EPRSection from "./components/EPRSection"
import LMCTSection from "./components/LMCTSection"
import MSSection from "./components/MSSection"
import TemperatureSigma from "./components/TemperatureSigma"
import ComparisonTable from "./components/ComparisonTable"

export default function K3FeCN6() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/exafs" className="text-purple-400 hover:text-purple-300">EXAFS/XANES</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/exafs/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-red-400">{basicInfo.formula}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🔮 {basicInfo.formula} — {basicInfo.tarixiy}</h1>
          <p className="text-purple-400 text-sm">
            {basicInfo.oksidlanishDarajasi} ({basicInfo.elektronKonfig}) • {basicInfo.magnitXossasi} • {basicInfo.geometriya} • {basicInfo.rang}
          </p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* Asosiy ma'lumot */}
        <div className="bg-purple-900/40 border border-red-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl font-extrabold font-mono text-red-400">{basicInfo.formula}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{basicInfo.iupac}</h2>
              <p className="text-purple-400">"{basicInfo.tarixiy}" — {basicInfo.oksidlanishDarajasi} ({basicInfo.elektronKonfig})</p>
            </div>
          </div>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-red-400">{basicInfo.formula}</strong> — klassik koordinatsion birikma.
              Markaziy atom Fe³⁺ <strong>past spinli (LS, S=1/2)</strong> — kuchli maydon ligandlari (CN⁻) tufayli.
              <strong>Paramagnit</strong> — 1 ta toq elektron. {basicInfo.rang} rangi — 
              <strong> LMCT (CN⁻(π) → Fe³⁺(d)) ~420 nm</strong> tufayli.
              Redoks potensiali: <strong>{basicInfo.redoksPotensiali}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            {[
              { label: "Oksidlanish", value: basicInfo.oksidlanishDarajasi, color: "text-red-400" },
              { label: "Konfiguratsiya", value: basicInfo.elektronKonfig, color: "text-yellow-400" },
              { label: "Spin", value: basicInfo.spinHolati, color: "text-blue-400" },
              { label: "Rang", value: basicInfo.rang, color: "text-red-400" },
            ].map((item, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
                <p className="text-purple-400 text-xs">{item.label}</p>
                <p className={`font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Barcha komponentlar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EXAFSSimulator />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <XANESPreEdge />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <OksidlanishKalkulyatori />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EXAFSTable />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MSSection />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TemperatureSigma />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MossbauerSection />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EPRSection />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <LMCTSection />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ComparisonTable />
        </div>

        {/* Xulosalar */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Umumiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Fe³⁺ (LS, t₂g⁵) — <strong className="text-red-400">paramagnit (S=1/2)</strong>, kuchli EPR signali</li>
            <li>Fe−C = <strong className="text-red-400">1.942 Å</strong> — Fe²⁺ analogidan 0.024 Å uzunroq (π-backbonding zaifroq)</li>
            <li>XANES: E₀ = <strong className="text-red-400">7127.5 eV</strong> (+1.5 eV siljish), pre-edge ~0.18−0.25 (kuchli)</li>
            <li>EXAFS: <strong className="text-red-400">3 ta qobiq + MS yo'llari</strong> yuqori aniqlikda aniqlandi</li>
            <li>Mössbauer: δ = <strong className="text-red-400">−0.12 mm/s</strong>, ΔE_Q = 0.38 mm/s — LS Fe³⁺</li>
            <li>EPR: <strong className="text-red-400">g₁≠g₂≠g₃</strong> — rombik simmetriya, Yahn-Teller buzilishi</li>
            <li>{basicInfo.rang} rang — <strong className="text-red-400">LMCT ~420 nm</strong>, redoks indikator</li>
            <li>Multiple Scattering — <strong className="text-red-400">fokuslash effekti</strong> tufayli MS {'>'} SS</li>
            <li>σ²(T) — <strong className="text-red-400">past haroratda EXAFS sifati yuqori</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/exafs/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Birikmalar</Link>
          <Link href="/ilmiy/tahlil/exafs/birikmalar/k4-fe-cn6" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">K₄[Fe(CN)₆] →</Link>
        </div>

      </section>
    </main>
  )
}