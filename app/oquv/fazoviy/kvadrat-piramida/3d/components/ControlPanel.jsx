"use client"

import { useCallback, useEffect, useRef } from "react"
import { SectionHeader, ToggleRow } from "./UIComponents"

// ═══════════════════════════════════════════════════════════════════════════
// CONTROL PANEL — Boshqaruv paneli (draggable)
// Trigonal-piramida uchun maxsus sozlamalar
// ═══════════════════════════════════════════════════════════════════════════

export default function ControlPanel({
  panelRef,
  panelPos,
  isPanelDragging,
  handlePanelDragStart,
  expandedSection,
  setExpandedSection,
  moleculeCount,
  setMoleculeCount,
  ensembleMode,
  setEnsembleMode,
  viewMode,
  setViewMode,
  showLabels,
  setShowLabels,
  showBondLengths,
  setShowBondLengths,
  showOuterSphere,
  setShowOuterSphere,
  sliceView,
  setSliceView,
  angleMeasureMode,
  setAngleMeasureMode,
  distanceMeasureMode,
  setDistanceMeasureMode,
  showAllAngles,
  setShowAllAngles,
  activePanel,
  togglePanel,
  showSolvation,
  setShowSolvation,
  solventType,
  setSolventType,
  solvationDensity,
  setSolvationDensity,
  showHydrogenBonds,
  setShowHydrogenBonds,
  showTemperature,
  setShowTemperature,
  temperature,
  setTemperature,
  showPressure,
  setShowPressure,
  pressure,
  setPressure,
  showVibration,
  setShowVibration,
  vibrationMode,
  setVibrationMode,
  showSymmetry,
  setShowSymmetry,
  symmetryElement,
  setSymmetryElement,
  showLonePair,
  setShowLonePair,
}) {
  return (
    <div
      ref={panelRef}
      className={`absolute z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 w-[260px] shadow-2xl max-h-[calc(100vh-130px)] flex flex-col ${
        isPanelDragging ? "shadow-purple-500/50 border-purple-500/80 select-none" : ""
      }`}
      style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}
    >
      {/* Sarlavha — ushlab siljitish uchun handle */}
      <div
        onMouseDown={(e) => {
          if (e.button !== 0) return
          e.preventDefault()
          handlePanelDragStart(e.clientX, e.clientY)
        }}
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            handlePanelDragStart(e.touches[0].clientX, e.touches[0].clientY)
          }
        }}
        className={`flex items-center justify-between px-3 py-2 border-b border-purple-700/40 rounded-t-xl ${
          isPanelDragging
            ? "cursor-grabbing bg-purple-800/60"
            : "cursor-grab bg-purple-900/40 hover:bg-purple-800/50"
        } transition-colors select-none touch-none`}
        title="Ushlab siljiting — panelni istagan joyingizga qo'ying"
      >
        <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-2">
          <span className="text-purple-400">⋮⋮</span>
          <span>🎛️</span> Boshqaruv paneli
        </h3>
        <span className="text-purple-400 text-[10px] opacity-70">↕ ↔</span>
      </div>

      {/* Panel tanasi — scrollable */}
      <div className="p-3 overflow-y-auto custom-scrollbar flex-1">
        {/* ═══ MOLEKULALAR SONI ═══ */}
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-2 border border-yellow-700/30 mb-2">
          <h4 className="text-[10px] text-yellow-400 uppercase mb-2 font-bold">🧬 Molekulalar</h4>
          <div className="grid grid-cols-3 gap-1 mb-2">
            {[1, 8, 27].map((n) => (
              <button
                key={n}
                onClick={() => setMoleculeCount(n)}
                className={`p-1.5 rounded text-xs font-bold transition-all ${
                  moleculeCount === n
                    ? "bg-yellow-600 text-white shadow-lg"
                    : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {moleculeCount > 1 && (
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setEnsembleMode("crystal")}
                className={`p-1 rounded text-[10px] transition-all ${
                  ensembleMode === "crystal"
                    ? "bg-cyan-600 text-white"
                    : "bg-purple-900/50 text-purple-300"
                }`}
              >
                🔷 Kristall
              </button>
              <button
                onClick={() => setEnsembleMode("solution")}
                className={`p-1 rounded text-[10px] transition-all ${
                  ensembleMode === "solution"
                    ? "bg-cyan-600 text-white"
                    : "bg-purple-900/50 text-purple-300"
                }`}
              >
                💧 Eritma
              </button>
            </div>
          )}
        </div>

        {/* ═══ BO'LIM 1: KO'RINISH ═══ */}
        <SectionHeader
          label="🎨 Ko'rinish"
          isOpen={expandedSection === "view"}
          onClick={() => setExpandedSection(expandedSection === "view" ? null : "view")}
        />
        {expandedSection === "view" && (
          <div className="space-y-2 mb-2 pl-1">
            <div>
              <label className="text-[10px] text-purple-400 uppercase block mb-1">Rejim</label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: "ball-stick", label: "🔗", title: "Ball-stick" },
                  { id: "space-filling", label: "⚪", title: "To'la" },
                  { id: "wireframe", label: "🕸️", title: "Karkas" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`p-1.5 rounded text-sm transition-all ${
                      viewMode === mode.id
                        ? "bg-purple-600 text-white"
                        : "bg-purple-900/50 text-purple-400 hover:bg-purple-800"
                    }`}
                    title={mode.title}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
            <ToggleRow label="🏷️ Atom yorliqlari" value={showLabels} onChange={setShowLabels} />
            <ToggleRow label="📏 Bog' uzunliklari" value={showBondLengths} onChange={setShowBondLengths} />
            <ToggleRow label="⚡ Yolg'iz juft" value={showLonePair} onChange={setShowLonePair} />
            <ToggleRow label="✂️ Kesim ko'rinishi" value={sliceView} onChange={setSliceView} />
            <ToggleRow
              label="📐 Burchak o'lchash"
              value={angleMeasureMode}
              onChange={(v) => {
                setAngleMeasureMode(v)
                if (v) {
                  setDistanceMeasureMode(false)
                }
              }}
            />
            <ToggleRow
              label="📏 Masofa o'lchash"
              value={distanceMeasureMode}
              onChange={(v) => {
                setDistanceMeasureMode(v)
                if (v) {
                  setAngleMeasureMode(false)
                }
              }}
            />
            <ToggleRow label="📊 Barcha burchaklar" value={showAllAngles} onChange={setShowAllAngles} />
            <button
              onClick={() => togglePanel("info")}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] transition-all ${
                activePanel === "info"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-900/40 text-purple-200 hover:bg-purple-800/60"
              }`}
            >
              <span>📋 Molekula ma'lumotlari</span>
              <span>{activePanel === "info" ? "✕" : "▸"}</span>
            </button>
            <button
              onClick={() => togglePanel("vsepr")}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] transition-all ${
                activePanel === "vsepr"
                  ? "bg-cyan-600 text-white"
                  : "bg-purple-900/40 text-purple-200 hover:bg-purple-800/60"
              }`}
            >
              <span>📐 VSEPR nazariyasi</span>
              <span>{activePanel === "vsepr" ? "✕" : "▸"}</span>
            </button>
          </div>
        )}

        {/* ═══ BO'LIM 2: SHAROITLAR ═══ */}
        <SectionHeader
          label="🧪 Sharoit / muhit"
          isOpen={expandedSection === "conditions"}
          onClick={() => setExpandedSection(expandedSection === "conditions" ? null : "conditions")}
        />
        {expandedSection === "conditions" && (
          <div className="space-y-2 mb-2 pl-1">
            <ToggleRow label="💧 Erituvchi qobig'i" value={showSolvation} onChange={setShowSolvation} />
            {showSolvation && (
              <div className="ml-2 mt-1 space-y-1 bg-purple-900/30 p-2 rounded">
                <select
                  value={solventType}
                  onChange={(e) => setSolventType(e.target.value)}
                  className="w-full text-[10px] bg-purple-800 rounded px-1 py-1"
                >
                  <option value="water">Suv (H₂O)</option>
                  <option value="acetonitrile">CH₃CN</option>
                  <option value="ethanol">Etanol</option>
                </select>
                <div>
                  <label className="text-[9px] text-purple-400">Zichlik: {solvationDensity}</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={solvationDensity}
                    onChange={(e) => setSolvationDensity(Number(e.target.value))}
                    className="w-full h-1"
                  />
                </div>
                <ToggleRow label="H-bog'lar" value={showHydrogenBonds} onChange={setShowHydrogenBonds} />
              </div>
            )}
            <ToggleRow label="🌡️ Temperatura" value={showTemperature} onChange={setShowTemperature} />
            {showTemperature && (
              <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="10"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full h-1"
                />
                <div className="text-[9px] text-purple-400 mt-1 flex justify-between">
                  <span>{temperature} K</span>
                  <span>{(temperature - 273).toFixed(0)}°C</span>
                </div>
              </div>
            )}
            <ToggleRow label="📊 Bosim" value={showPressure} onChange={setShowPressure} />
            {showPressure && (
              <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
                <input
                  type="range"
                  min="1"
                  max="50000"
                  step="500"
                  value={pressure}
                  onChange={(e) => setPressure(Number(e.target.value))}
                  className="w-full h-1"
                />
                <div className="text-[9px] text-purple-400 mt-1">{pressure.toLocaleString()} atm</div>
              </div>
            )}
          </div>
        )}

        {/* ═══ BO'LIM 3: ILMIY ═══ */}
        <SectionHeader
          label="🔬 Ilmiy tahlil"
          isOpen={expandedSection === "scientific"}
          onClick={() => setExpandedSection(expandedSection === "scientific" ? null : "scientific")}
        />
        {expandedSection === "scientific" && (
          <div className="space-y-2 pl-1">
            <ToggleRow label="🎵 Tebranishlar" value={showVibration} onChange={setShowVibration} />
            {showVibration && (
              <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
                <select
                  value={vibrationMode}
                  onChange={(e) => setVibrationMode(e.target.value)}
                  className="w-full text-[10px] bg-purple-800 rounded px-1 py-1"
                >
                  <option value="sym_stretch">Simmetrik cho'zilish</option>
                  <option value="asym_stretch">Asimmetrik cho'zilish</option>
                  <option value="bend">Egilish</option>
                </select>
              </div>
            )}
            <ToggleRow label="🔬 Simmetriya" value={showSymmetry} onChange={setShowSymmetry} />
            {showSymmetry && (
              <div className="ml-2 mt-1 bg-purple-900/30 p-2 rounded">
                <select
                  value={symmetryElement}
                  onChange={(e) => setSymmetryElement(e.target.value)}
                  className="w-full text-[10px] bg-purple-800 rounded px-1 py-1"
                >
                  <option value="C3">C₃ o'qi</option>
                  <option value="sigma_v">σᵥ tekisliklar (3 ta)</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(76, 29, 149, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
      `}</style>
    </div>
  )
}