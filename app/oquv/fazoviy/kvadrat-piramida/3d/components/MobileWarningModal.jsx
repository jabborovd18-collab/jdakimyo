"use client"

import { useState } from "react"
import Link from "next/link"

// ═══════════════════════════════════════════════════════════════════════════
// 📱 MOBILE WARNING MODAL
// Mobiledan kirganlarni ogohlantiruvchi maxsus komponent
// ═══════════════════════════════════════════════════════════════════════════

export default function MobileWarningModal({ isOpen, onClose }) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleClose = () => {
    if (dontShowAgain && typeof window !== 'undefined') {
      localStorage.setItem('mobile-warning-seen', 'true')
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950 rounded-3xl border-2 border-amber-500/40 shadow-2xl shadow-amber-500/20 max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-b-2 border-amber-500/30 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl shadow-lg">
              📱
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Mobil qurilmadan kiryapsizmi?</h2>
              <p className="text-xs text-amber-200/80 mt-0.5">Muhim ogohlantirish</p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {/* Ogohlantirish matni */}
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <div className="text-sm text-amber-100 leading-relaxed">
                <p className="mb-2">
                  <strong className="text-white">3D Laboratoriya PRO</strong> interaktiv modellari
                  <strong className="text-amber-300"> kompyuter va planshetlar</strong> uchun mo'ljallangan.
                </p>
                <p>
                  Mobil telefonda 3D modellarni aylantirish, boshqaruv paneli va PDF eksport funksiyalari
                  <strong className="text-amber-300"> qotishi yoki to'liq ishlamasligi</strong> mumkin.
                </p>
              </div>
            </div>
          </div>

          {/* Tavsiyalar */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
              <span>💡</span> Tavsiyalar:
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 bg-purple-900/30 rounded-lg p-3">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <span className="text-xs text-purple-200">
                  <strong className="text-white">Kompyuter</strong> yoki <strong className="text-white">planshet</strong>dan kiring — eng yaxshi tajriba
                </span>
              </div>
              <div className="flex items-start gap-2 bg-purple-900/30 rounded-lg p-3">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <span className="text-xs text-purple-200">
                  <strong className="text-white">Gorizontal rejim</strong>ga o'tkazing (telefonda)
                </span>
              </div>
              <div className="flex items-start gap-2 bg-purple-900/30 rounded-lg p-3">
                <span className="text-blue-400 flex-shrink-0">ℹ</span>
                <span className="text-xs text-purple-200">
                  <strong className="text-white">O'quv materiallari</strong>ni mobilda ham o'qishingiz mumkin
                </span>
              </div>
            </div>
          </div>

          {/* "Boshqa ko'rsatma" checkbox */}
          <label className="flex items-center gap-2 cursor-pointer hover:bg-purple-900/20 p-2 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
            <span className="text-xs text-purple-300">
              Bu ogohlantirishni boshqa ko'rsatma
            </span>
          </label>
        </div>

        {/* TUGMALAR */}
        <div className="px-6 pb-6 pt-2 space-y-2">
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
          >
            <span>✓</span>
            <span>Tushundim, davom etamiz</span>
          </button>
          <Link
            href="/oquv"
            onClick={() => {
              if (dontShowAgain && typeof window !== 'undefined') {
                localStorage.setItem('mobile-warning-seen', 'true')
              }
            }}
            className="block w-full py-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 font-semibold text-center transition-all border border-purple-700/50 text-sm"
          >
            ← O'quv bo'limiga qaytish
          </Link>
        </div>
      </div>
    </div>
  )
}