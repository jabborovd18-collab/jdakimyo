"use client"

import Link from "next/link"
import { basicInfo } from "./data/k4-fe-cn6-data"
import EXAFSSimulator from "./components/EXAFSSimulator"
import XANESPreEdge from "./components/XANESPreEdge"
import EXAFSTable from "./components/EXAFSTable"
import MossbauerSection from "./components/MossbauerSection"
import LMCTSection from "./components/LMCTSection"
import MSSection from "./components/MSSection"
import ComparisonTable from "./components/ComparisonTable"

export default function K4FeCN6() {
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
          <span className="text-yellow-400">{basicInfo.formula}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🔮 {basicInfo.formula} — {basicInfo.tarixiy}</h1>
          <p className="text-purple-400 text-sm">
            {basicInfo.oksidlanishDarajasi} ({basicInfo.elektronKonfig}) • {basicInfo.magnitXossasi} • {basicInfo.geometriya} • {basicInfo.rang}
          </p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* Asosiy ma'lumot */}
        <div className="bg-purple-900/40 border border-yellow-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl font-extrabold font-mono text-yellow-400">{basicInfo.formula}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{basicInfo.iupac}</h2>
              <p className="text-purple-400">{`"${basicInfo.tarixiy}" — ${basicInfo.oksidlanishDarajasi} (${basicInfo.elektronKonfig})`}</p>
            </div>
          </div>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">{basicInfo.formula}</strong> — K₃[Fe(CN)₆] ning qaytarilgan shakli.
              Markaziy atom Fe²⁺ <strong>past spinli (LS, S=0)</strong> — kuchli maydon ligandlari (CN⁻) tufayli.
              <strong>Diamagnit</strong> — barcha elektronlar juftlashgan. {basicInfo.rang} rangi — 
              <strong> LMCT (CN⁻(π) → Fe²⁺(d)) ~320 nm</strong> tufayli (UB sohada, ko'rinadigan sohada zaif).
              K₃[Fe(CN)₆] bilan birgalikda <strong>Fe²⁺/Fe³⁺ redoks jufti</strong> ni tashkil qiladi (E° = +0.36 V).
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
              <p className="text-purple-400 text-xs">Oksidlanish</p>
              <p className="font-bold text-yellow-400">{basicInfo.oksidlanishDarajasi}</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
              <p className="text-purple-400 text-xs">Konfiguratsiya</p>
              <p className="font-bold text-green-400">{basicInfo.elektronKonfig}</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
              <p className="text-purple-400 text-xs">Spin</p>
              <p className="font-bold text-blue-400">{basicInfo.spinHolati}</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
              <p className="text-purple-400 text-xs">Rang</p>
              <p className="font-bold text-yellow-400">{basicInfo.rang}</p>
            </div>
          </div>
        </div>

        {/* EXAFS Simulator */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EXAFSSimulator />
        </div>

        {/* XANES Pre-Edge */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <XANESPreEdge />
        </div>

        {/* EXAFS Table */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EXAFSTable />
        </div>

        {/* Multiple Scattering */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MSSection />
        </div>

        {/* Mössbauer */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MossbauerSection />
        </div>

        {/* LMCT — Rang */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <LMCTSection />
        </div>

        {/* Comparison Table */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ComparisonTable />
        </div>

        {/* Xulosalar */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Umumiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Fe²⁺ (LS, t₂g⁶) — <strong className="text-yellow-400">diamagnit (S=0)</strong>, EPR signali yo'q</li>
            <li>Fe−C = <strong className="text-yellow-400">1.918 Å</strong> — Fe³⁺ analogidan 0.024 Å qisqaroq (π-backbonding kuchliroq)</li>
            <li>XANES: E₀ = <strong className="text-yellow-400">7126.0 eV</strong> (−1.5 eV K₃ ga nisbatan), pre-edge deyarli yo'q (~0.02−0.05)</li>
            <li>Mössbauer: δ = <strong className="text-yellow-400">−0.04 mm/s</strong>, ΔE_Q = 0.00 mm/s — mukammal simmetriya</li>
            <li>Sariq rang — <strong className="text-yellow-400">LMCT ~320 nm</strong> (UB sohada), ko'rinadigan sohada zaif yutilish</li>
            <li>Multiple Scattering — <strong className="text-yellow-400">fokuslash K₃ dan kuchliroq</strong> (qisqaroq bog', Yahn-Teller yo'q)</li>
            <li>K₃[Fe(CN)₆] bilan birgalikda <strong className="text-yellow-400">Fe²⁺/Fe³⁺ redoks jufti</strong> (E° = +0.36 V)</li>
          </ol>
        </div>

        {/* Navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/exafs/birikmalar/k3-fe-cn6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← K₃[Fe(CN)₆]</Link>
          <Link href="/ilmiy/tahlil/exafs/birikmalar" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Barcha birikmalar →</Link>
        </div>

      </section>
    </main>
  )
}