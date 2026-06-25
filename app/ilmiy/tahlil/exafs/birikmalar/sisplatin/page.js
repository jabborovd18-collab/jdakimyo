"use client"

import Link from "next/link"
import { basicInfo, aktivatsiya } from "./data/sisplatin-data"
import EXAFSSimulator from "./components/EXAFSSimulator"
import XANESPreEdge from "./components/XANESPreEdge"
import EXAFSTable from "./components/EXAFSTable"
import OksidlanishKalkulyatori from "./components/OksidlanishKalkulyatori"
import ComparisonTable from "./components/ComparisonTable"

export default function Sisplatin() {
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
          <h1 className="text-2xl font-bold text-yellow-400">💎 {basicInfo.formula} — {basicInfo.tarixiy}</h1>
          <p className="text-purple-400 text-sm">{basicInfo.oksidlanishDarajasi} ({basicInfo.elektronKonfig}) • {basicInfo.magnitXossasi} • {basicInfo.geometriya}</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="bg-purple-900/40 border border-yellow-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl font-extrabold font-mono text-yellow-400">{basicInfo.formula}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{basicInfo.iupac}</h2>
              <p className="text-purple-400">"{basicInfo.tarixiy}" — {basicInfo.olim}</p>
            </div>
          </div>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">{basicInfo.formula}</strong> — {basicInfo.ahamiyati}
            </p>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mb-4">
            <h3 className="text-red-400 font-bold text-sm mb-2">⚡ {aktivatsiya.title}</h3>
            <p className="text-purple-200 text-xs">{aktivatsiya.desc}</p>
            <p className="text-purple-300 text-xs mt-2"><strong>Target:</strong> {aktivatsiya.target}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            {[
              { label: "Oksidlanish", value: basicInfo.oksidlanishDarajasi, color: "text-yellow-400" },
              { label: "Konfiguratsiya", value: basicInfo.elektronKonfig, color: "text-green-400" },
              { label: "Geometriya", value: basicInfo.geometriya, color: "text-blue-400" },
              { label: "Kashfiyot", value: basicInfo.kashfiyot, color: "text-red-400" },
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
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><ComparisonTable /></div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Umumiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Pt²⁺ (d⁸) — <strong className="text-yellow-400">kvadrat tekislik, diamagnit</strong></li>
            <li>Pt−Cl = <strong className="text-yellow-400">2.328 Å</strong>, Pt−N = <strong className="text-yellow-400">2.012 Å</strong></li>
            <li>Pt L₃-chegara: E₀ = <strong className="text-yellow-400">11567 eV</strong> (Pt⁰ dan +3 eV)</li>
            <li>Prodori → faol shakl: <strong className="text-yellow-400">gidroliz</strong> orqali faollashadi</li>
            <li>Sis- vs trans- izomeriya — <strong className="text-yellow-400">faqat sis-izomer faol</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/exafs/birikmalar/co-nh3-6-cl3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [Co(NH₃)₆]Cl₃</Link>
          <Link href="/ilmiy/tahlil/exafs/birikmalar/ferrosen" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Ferrosen →</Link>
        </div>

      </section>
    </main>
  )
}