"use client"

import { useState } from "react"

// ═══════════════════════════════════════════════════════════════════════════
// 📚 CITATION MODAL — Ilmiy iqtibos generatsiya
// APA, MLA, Chicago, BibTeX formatlari
// ═══════════════════════════════════════════════════════════════════════════

export default function CitationModal({ isOpen, onClose, complex }) {
  const [citationFormat, setCitationFormat] = useState("apa")
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const cleanText = (str) => {
    if (str === null || str === undefined) return ""
    return String(str).replace(/\s+/g, " ").trim()
  }

  const getCitation = () => {
    const year = new Date().getFullYear()
    const accessDate = new Date().toLocaleDateString('en-GB')
    const formula = cleanText(complex.formula)
    const name = cleanText(complex.name)

    if (citationFormat === "apa") {
      return `JDA-Kimyo Research Bulletin. (${year}). Structural analysis of ${formula}: ${name}. Interactive 3D Molecular Modeling Platform. Retrieved ${accessDate}.`
    } else if (citationFormat === "mla") {
      return `"Structural Analysis of ${formula}: ${name}." JDA-Kimyo Research Bulletin, ${year}, Interactive 3D Molecular Modeling Platform. Accessed ${accessDate}.`
    } else if (citationFormat === "bibtex") {
      const key = complex.id.toLowerCase()
      return `@misc{${key}${year},\n  title = {Structural Analysis of ${formula}: ${name}},\n  author = {{JDA-Kimyo Research Bulletin}},\n  year = {${year}},\n  note = {Interactive 3D Molecular Modeling Platform},\n  url = {https://jda-kimyo.uz/oquv/fazoviy/trigonal-piramida},\n  urldate = {${accessDate}}\n}`
    } else if (citationFormat === "chicago") {
      return `JDA-Kimyo Research Bulletin. "Structural Analysis of ${formula}: ${name}." Interactive 3D Molecular Modeling Platform. ${year}. Accessed ${accessDate}.`
    }
    return ""
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCitation())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Nusxalashda xato:", err)
      alert("Nusxalashda xato. Iltimos, matnni qo'lda belgilab nusxalang.")
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-purple-950 to-indigo-950 rounded-2xl border border-purple-600/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-800/50 sticky top-0 bg-purple-950/95 backdrop-blur-md z-10">
          <h2 className="text-lg font-bold text-purple-200 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            Iqtibos olish (Citation)
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-purple-800/50 hover:bg-red-600/80 text-purple-200 hover:text-white text-xl transition-all flex items-center justify-center"
            aria-label="Yopish"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {/* KIRISH MATNI */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">ℹ️</span>
              <div className="text-sm text-blue-200">
                <strong className="text-blue-100">Nima uchun kerak?</strong>
                <p className="mt-1">
                  Ushbu iqtibosni ilmiy ishlaringizda (kurs ishi, diplom, maqola)
                  <strong className="text-blue-100"> manba sifatida</strong> ko'rsatish uchun ishlating.
                  Tanlangan formatni nusxalab, "Adabiyotlar" ro'yxatiga qo'shing.
                </p>
              </div>
            </div>
          </div>

          {/* KOMPLEKS MA'LUMOTI */}
          <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 mb-4">
            <p className="text-xs text-purple-400 uppercase tracking-wider mb-1">Joriy molekula:</p>
            <p className="text-sm font-mono text-purple-100">
              {cleanText(complex.formula)} — {cleanText(complex.name)}
            </p>
          </div>

          {/* FORMAT TANLASH */}
          <p className="text-purple-300 text-sm mb-3 font-semibold">Format tanlang:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {[
              { val: "apa", label: "APA", desc: "Eng keng tarqalgan" },
              { val: "mla", label: "MLA", desc: "Gumanitar" },
              { val: "chicago", label: "Chicago", desc: "Nashriyot" },
              { val: "bibtex", label: "BibTeX", desc: "LaTeX uchun" },
            ].map((fmt) => (
              <button
                key={fmt.val}
                onClick={() => setCitationFormat(fmt.val)}
                className={`py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                  citationFormat === fmt.val
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg border border-purple-400/50"
                    : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/60 border border-purple-700/40"
                }`}
              >
                <div className="text-base">{fmt.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{fmt.desc}</div>
              </button>
            ))}
          </div>

          {/* IQTIBOS KO'RINISHI */}
          <div className="bg-purple-950/70 border border-purple-700/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-purple-400 uppercase tracking-wider">Iqtibos:</span>
              <span className="text-xs text-purple-500">{citationFormat.toUpperCase()}</span>
            </div>
            <pre className="text-purple-100 text-sm whitespace-pre-wrap font-mono leading-relaxed break-words select-all">
              {getCitation()}
            </pre>
          </div>

          {/* NUSXALASH TUGMASI */}
          <button
            onClick={handleCopy}
            className={`w-full py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${
              copied
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
            }`}
          >
            {copied ? (
              <>
                <span>✅</span>
                <span>Nusxalandi!</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Nusxa olish</span>
              </>
            )}
          </button>

          {/* Maslahat */}
          <div className="mt-4 bg-amber-900/20 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-200 flex items-start gap-2">
            <span className="text-lg flex-shrink-0">💡</span>
            <div>
              <strong className="text-amber-100">Maslahat:</strong> Ilmiy ishingizda ushbu manbani
              "Foydalanilgan adabiyotlar" bo'limiga qo'shing. APA formati eng ko'p qabul qilinadi.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}