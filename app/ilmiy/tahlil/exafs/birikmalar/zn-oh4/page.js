"use client"

import Link from "next/link"
import { basicInfo } from "./data/zn-oh4-data"
import EXAFSSimulator from "./components/EXAFSSimulator"
import XANESPreEdge from "./components/XANESPreEdge"
import EXAFSTable from "./components/EXAFSTable"
import OksidlanishKalkulyatori from "./components/OksidlanishKalkulyatori"
import ComparisonTable from "./components/ComparisonTable"

export default function ZnOH4() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link><span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/exafs" className="text-purple-400 hover:text-purple-300">EXAFS/XANES</Link><span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/exafs/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link><span className="text-purple-600">›</span>
          <span className="text-blue-400">{basicInfo.formula}</span>
        </div>
        <div><h1 className="text-2xl font-bold text-blue-400">⚪ {basicInfo.formula}</h1><p className="text-purple-400 text-sm">{basicInfo.oksidlanishDarajasi} ({basicInfo.elektronKonfig}) • {basicInfo.magnitXossasi} • {basicInfo.geometriya}</p></div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-purple-900/40 border border-blue-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl font-extrabold font-mono text-blue-400">{basicInfo.formula}</span>
            <div><h2 className="text-xl font-bold text-white">{basicInfo.iupac}</h2><p className="text-purple-400">{basicInfo.ahamiyati}</p></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            {[{ label: "Oksidlanish", value: basicInfo.oksidlanishDarajasi, color: "text-blue-400" },{ label: "Konfiguratsiya", value: basicInfo.elektronKonfig, color: "text-green-400" },{ label: "CFSE", value: "0 (d¹⁰)", color: "text-yellow-400" },{ label: "Bog' uzunligi", value: "Zn−O = 1.972 Å", color: "text-purple-400" }].map((item, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30"><p className="text-purple-400 text-xs">{item.label}</p><p className={`font-bold ${item.color}`}>{item.value}</p></div>
            ))}
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><EXAFSSimulator /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><XANESPreEdge /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><EXAFSTable /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><OksidlanishKalkulyatori /></div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><ComparisonTable /></div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Umumiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Zn²⁺ (d¹⁰) — <strong className="text-blue-400">tetraedrik, diamagnit, rangsiz, CFSE=0</strong></li>
            <li>Zn−O = <strong className="text-blue-400">1.972 Å</strong> — ion radiuslariga mos</li>
            <li>XANES: oq chiziq <strong className="text-blue-400">kuchli</strong> (4p bo'sh)</li>
            <li>d¹⁰ — <strong className="text-blue-400">d−d o'tish yo'q</strong>, rang LMCT dan (UB sohada)</li>
            <li>Zn²⁺ — <strong className="text-blue-400">karboangidraza fermentida</strong> muhim rol o'ynaydi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/exafs/birikmalar/fe-co5" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [Fe(CO)₅]</Link>
          <Link href="/ilmiy/tahlil/exafs/birikmalar/cr-h2o6" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">[Cr(H₂O)₆]³⁺ →</Link>
        </div>
      </section>
    </main>
  )
}