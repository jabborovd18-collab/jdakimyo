"use client"

import Link from "next/link"
import { basicInfo } from "./data/co-nh3-6-cl3-data"
import EXAFSSimulator from "./components/EXAFSSimulator"
import XANESPreEdge from "./components/XANESPreEdge"
import EXAFSTable from "./components/EXAFSTable"
import OksidlanishKalkulyatori from "./components/OksidlanishKalkulyatori"
import MossbauerSection from "./components/MossbauerSection"
import ComparisonTable from "./components/ComparisonTable"

export default function CoNH36Cl3() {
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
          <span className="text-blue-400">{basicInfo.formula}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🔮 {basicInfo.formula} — {basicInfo.tarixiy}</h1>
          <p className="text-purple-400 text-sm">{basicInfo.oksidlanishDarajasi} ({basicInfo.elektronKonfig}) • {basicInfo.magnitXossasi} • Nobel 1913</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="bg-purple-900/40 border border-blue-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl font-extrabold font-mono text-blue-400">{basicInfo.formula}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{basicInfo.iupac}</h2>
              <p className="text-purple-400">{`"${basicInfo.tarixiy}" — ${basicInfo.olim}`}</p>
            </div>
          </div>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-blue-400">{basicInfo.formula}</strong> — {basicInfo.ahamiyati}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            {[
              { label: "Oksidlanish", value: basicInfo.oksidlanishDarajasi, color: "text-blue-400" },
              { label: "Konfiguratsiya", value: basicInfo.elektronKonfig, color: "text-green-400" },
              { label: "Spin", value: basicInfo.spinHolati, color: "text-purple-400" },
              { label: "Rang", value: basicInfo.rang, color: "text-yellow-400" },
            ].map((item, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
                <p className="text-purple-400 text-xs">{item.label}</p>
                <p className={`font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><EXAFSSimulator /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><XANESPreEdge /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><EXAFSTable /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><OksidlanishKalkulyatori /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><MossbauerSection /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><ComparisonTable /></div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Umumiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Co³⁺ (LS, t₂g⁶) — <strong className="text-blue-400">diamagnit (S=0)</strong>, inert, oktaedrik</li>
            <li>Co−N = <strong className="text-blue-400">1.961 Å</strong> — 6 ta NH₃, mukammal oktaedrik simmetriya</li>
            <li>Pre-edge deyarli yo'q (~0.03−0.05) — <strong className="text-blue-400">bo'sh d-orbital yo'q</strong></li>
            <li>Co³⁺/Co²⁺ farqi: E₀ da ~2 eV, pre-edge da 2-3×, magnitda diamagnit/paramagnit</li>
            <li>Verner klassikasi — <strong className="text-blue-400">koordinatsion nazariyaning asosiy dalili</strong>, Nobel 1913</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/exafs/birikmalar/k4-fe-cn6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← K₄[Fe(CN)₆]</Link>
          <Link href="/ilmiy/tahlil/exafs/birikmalar/sisplatin" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Sisplatin →</Link>
        </div>

      </section>
    </main>
  )
}