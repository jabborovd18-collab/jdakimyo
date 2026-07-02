"use client"

import { InfoRow } from "./UIComponents"
import { ATOM_INFO } from "../lib/constants"

// ═══════════════════════════════════════════════════════════════════════════
// INFO PANELS — Tanlangan atom va kompleks ma'lumotlari
// ═══════════════════════════════════════════════════════════════════════════

export default function InfoPanels({
  selectedAtom,
  setSelectedAtom,
  activePanel,
  setActivePanel,
  complex,
  currentComplex,
  fullscreenMode,
  showCrystalField,
  setShowCrystalField,
  ligandFieldStrength,
  showRedox,
  oxidationState,
  lonePairCount,
}) {
  if (fullscreenMode) return null

  return (
    <>
      {/* TANLANGAN ATOM */}
      {selectedAtom && (
        <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-xs w-[280px] shadow-2xl animate-slide-in">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full shadow-lg border-2 border-white/30"
                style={{ backgroundColor: selectedAtom.info.color }}
              ></div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedAtom.info.name}</h3>
                <p className="text-xs text-purple-400">Z = {selectedAtom.info.atomic}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedAtom(null)}
              className="text-purple-400 hover:text-white text-xl leading-none"
            >×</button>
          </div>
          <div className="space-y-2 text-sm">
            <InfoRow label="Atom massasi" value={selectedAtom.info.mass} mono />
            <InfoRow label="Elektron konfig." value={selectedAtom.info.config} mono small />
            {selectedAtom.info.oxidation && (
              <InfoRow label="Oksidlanish darajasi" value={selectedAtom.info.oxidation} mono />
            )}
            {selectedAtom.info.charge && <InfoRow label="Zaryad" value={selectedAtom.info.charge} mono />}
            {selectedAtom.info.hybridization && (
              <InfoRow label="Gibridlanish" value={selectedAtom.info.hybridization} mono />
            )}
            {selectedAtom.info.role && <InfoRow label="Vazifasi" value={selectedAtom.info.role} small />}
          </div>
        </div>
      )}

      {/* INFO PANEL */}
      {!selectedAtom && activePanel === "info" && (
        <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-purple-700/50 max-w-sm w-[300px] shadow-2xl animate-slide-in">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-base font-bold text-purple-300">📋 Molekula ma'lumotlari</h3>
            <button
              onClick={() => setActivePanel(null)}
              className="text-purple-400 hover:text-white text-xl leading-none"
            >×</button>
          </div>
          <div className="space-y-2 text-xs">
            <InfoRow label="Formula" value={complex.formula} mono />
            <InfoRow label="To'liq nom" value={complex.fullSalt} mono />
            <InfoRow label="IUPAC nomi" value={complex.name} small />
            <InfoRow label="Geometriya" value={complex.geometry} />
            <InfoRow label="Simmetriya" value={complex.symmetry} mono />
            <InfoRow label="Gibridlanish" value={complex.hybridization} mono />
            <InfoRow label="Bog' uzunligi" value={complex.bondLengthReal} mono />
            <InfoRow label="Bog' burchagi" value={`${complex.bondAngle}°`} mono />
            <InfoRow label="Magnit xossa" value={complex.magnetism} />
            <InfoRow label="Rangi" value={complex.color} small />
            <InfoRow label="Molekulyar massa" value={complex.molecularWeight} mono />
            <InfoRow label="Qaynash harorati" value={complex.boilingPoint} mono />
            <InfoRow label="Dipol moment" value={complex.dipoleMoment} mono />
            {lonePairCount > 0 && (
              <InfoRow label="Yolg'iz juftlar" value={`${lonePairCount} ta`} mono />
            )}
          </div>
        </div>
      )}

      {/* VSEPR PANEL */}
      {!selectedAtom && activePanel === "vsepr" && (
        <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-25 border border-cyan-700/50 shadow-2xl w-[320px] animate-slide-in">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <span>📐</span> VSEPR Nazariyasi
            </h3>
            <button onClick={() => setActivePanel(null)} className="text-cyan-400 hover:text-white text-xl leading-none">×</button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-lg p-3">
              <p className="text-cyan-200 text-sm mb-2">
                <strong className="text-white">AX₃E₁</strong> — Trigonal-piramida
              </p>
              <ul className="text-cyan-200/80 space-y-1 text-xs">
                <li>• <strong className="text-white">A:</strong> Markaziy atom ({complex.center.element})</li>
                <li>• <strong className="text-white">X₃:</strong> 3 ta ligand</li>
                <li>• <strong className="text-white">E₁:</strong> 1 ta yolg'iz juft</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-2">
              <p className="text-purple-400 text-[10px] mb-0.5 uppercase">Ideal burchak (sp³)</p>
              <p className="text-white font-mono">109.5°</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-2">
              <p className="text-purple-400 text-[10px] mb-0.5 uppercase">Haqiqiy burchak</p>
              <p className="text-white font-mono">{complex.bondAngle}°</p>
            </div>
            <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-2 text-xs text-amber-200">
              <strong className="text-amber-100">Sabab:</strong> Yolg'iz juft ko'proq joy egallaydi, ligandlarni pastga bosadi.
            </div>
          </div>
        </div>
      )}

      {/* KRISTALL MAYDON PANEL */}
      {showCrystalField && (
        <div className="absolute bottom-4 right-3 z-20 w-[280px]">
          <div className="bg-purple-950/95 backdrop-blur-md rounded-xl p-3 border border-purple-700/50 shadow-2xl animate-slide-in">
            <h4 className="text-xs font-bold text-purple-300 mb-2 flex items-center justify-between">
              <span>💎 Kristall maydon</span>
              <button
                onClick={() => setShowCrystalField(false)}
                className="text-purple-500 hover:text-white"
              >
                ×
              </button>
            </h4>
            <div className="bg-purple-900/50 rounded p-2 space-y-1 text-[11px]">
              <div>
                Ligand kuchi: <span className="text-white capitalize">{ligandFieldStrength}</span>
              </div>
              <div>
                Burchak: <span className="text-white font-mono">{complex.bondAngle}°</span>
              </div>
              <div>
                Simmetriya: <span className="text-white font-mono">{complex.symmetry}</span>
              </div>
              <div>
                Gibridlanish: <span className="text-white font-mono">{complex.hybridization}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* YOLG'IZ JUPT INFO */}
      {lonePairCount > 0 && !selectedAtom && activePanel === null && (
        <div className="absolute bottom-4 left-3 z-20 w-[280px]">
          <div className="bg-yellow-950/90 backdrop-blur-md rounded-xl p-3 border border-yellow-600/40 shadow-2xl animate-slide-in">
            <h4 className="text-xs font-bold text-yellow-300 mb-2 flex items-center gap-2">
              <span>⚡</span> Yolg'iz elektron jufti
            </h4>
            <div className="bg-purple-900/50 rounded p-2 space-y-1 text-[11px]">
              <div>
                Soni: <span className="text-white font-mono">{lonePairCount} ta</span>
              </div>
              <div>
                Joylashuvi: <span className="text-white">Tepada (y o'qi)</span>
              </div>
              <div className="text-yellow-200/80 text-[10px] mt-1">
                Yolg'iz juft ligandlarni pastga bosadi, burchakni kichraytiradi.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}