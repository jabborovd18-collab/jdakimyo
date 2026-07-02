"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { COMPLEXES, ATOM_INFO, CPK } from "./lib/constants"
import { useSceneSetup } from "./hooks/useSceneSetup"
import { useMoleculeBuilder } from "./hooks/useMoleculeBuilder"
import { useSceneEffects } from "./hooks/useSceneEffects"
import ControlPanel from "./components/ControlPanel"
import InfoPanels from "./components/InfoPanels"
import PDFModal from "./components/PDFModal"
import CitationModal from "./components/CitationModal"
import MobileWarningModal from "./components/MobileWarningModal"
import { Stat, LegendItem } from "./components/UIComponents"
import { getEnsemblePositions } from "./lib/helpers"

// ═══════════════════════════════════════════════════════════════════════════
// TRIGONAL-PIRAMIDA 3D LABORATORIYA PRO
// NH₃, NF₃, PCl₃ — VSEPR nazariyasi (AX₃E₁), sp³ gibridlanish
// ═══════════════════════════════════════════════════════════════════════════

export default function TrigonalPiramidal3D() {
  // ═══════════════════════════════════════════════════════════
  // UI STATE'LAR
  // ═══════════════════════════════════════════════════════════
  const [currentComplex, setCurrentComplex] = useState("NH3")
  const [moleculeCount, setMoleculeCount] = useState(1)
  const [ensembleMode, setEnsembleMode] = useState("crystal")
  const [viewMode, setViewMode] = useState("ball-stick")
  const [autoRotate, setAutoRotate] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showBondLengths, setShowBondLengths] = useState(false)
  const [showOuterSphere, setShowOuterSphere] = useState(false)
  const [sliceView, setSliceView] = useState(false)
  const [angleMeasureMode, setAngleMeasureMode] = useState(false)
  const [distanceMeasureMode, setDistanceMeasureMode] = useState(false)
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [activePanel, setActivePanel] = useState(null)
  const [expandedSection, setExpandedSection] = useState("view")
  const [fullscreenMode, setFullscreenMode] = useState(false)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [citationModalOpen, setCitationModalOpen] = useState(false)

  // 📱 MOBILE WARNING STATE
  const [showMobileWarning, setShowMobileWarning] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  // Sharoitlar
  const [showTemperature, setShowTemperature] = useState(false)
  const [temperature, setTemperature] = useState(298)
  const [showPressure, setShowPressure] = useState(false)
  const [pressure, setPressure] = useState(1)
  const [showSolvation, setShowSolvation] = useState(false)
  const [solventType, setSolventType] = useState("water")
  const [solvationDensity, setSolvationDensity] = useState(20)
  const [showHydrogenBonds, setShowHydrogenBonds] = useState(false)
  const [showVibration, setShowVibration] = useState(false)
  const [vibrationMode, setVibrationMode] = useState("sym_stretch")
  const [showSymmetry, setShowSymmetry] = useState(false)
  const [symmetryElement, setSymmetryElement] = useState("C3")
  const [showLonePair, setShowLonePair] = useState(true) // trigonal-piramida uchun

  const complex = COMPLEXES[currentComplex]

  // ═══════════════════════════════════════════════════════════
  // 📱 MOBILE DETECTION
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkMobile = () => {
      const width = window.innerWidth
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isMobile = width < 768 || (width < 1024 && isTouchDevice && width < 900)
      setIsMobileDevice(isMobile)

      const hasSeenWarning = localStorage.getItem('mobile-warning-seen') === 'true'
      if (isMobile && !hasSeenWarning) {
        setTimeout(() => setShowMobileWarning(true), 800)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // ═══════════════════════════════════════════════════════════
  // ⌨️ ESCAPE TUGMASI
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (citationModalOpen) setCitationModalOpen(false)
        else if (pdfModalOpen) setPdfModalOpen(false)
        else if (showMobileWarning) setShowMobileWarning(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [citationModalOpen, pdfModalOpen, showMobileWarning])

  // ═══════════════════════════════════════════════════════════
  // HOOKS
  // ═══════════════════════════════════════════════════════════
  const { containerRef, sceneRef, rendererRef, controlsRef, cameraRef, clockRef } = useSceneSetup({
    autoRotate,
    onLoadComplete: () => console.log("Trigonal-piramida scene loaded"),
  })

  const atomsRef = useRef([])
  const labelsRef = useRef([])
  const bondLabelsRef = useRef([])
  const bondsRef = useRef([])
  const ligandAtomsRef = useRef([])
  const moleculeGroupsRef = useRef([])
  const ligandGroupsRef = useRef([])
  const lonePairRef = useRef([])
  const solventMoleculesRef = useRef([])
  const hBondsRef = useRef([])
  const animationStateRef = useRef({ originalPositions: new Map() })

  const { buildEnsemble, computeAllAngles } = useMoleculeBuilder({
    atomsRef, labelsRef, bondLabelsRef, bondsRef,
    ligandAtomsRef, moleculeGroupsRef, ligandGroupsRef, lonePairRef,
  })

  useSceneEffects({
    sceneRef, moleculeGroupsRef, atomsRef, ligandGroupsRef,
    solventMoleculesRef, hBondsRef, labelsRef, bondLabelsRef,
    bondsRef, lonePairRef, animationStateRef, clockRef,
    showTemperature, temperature, showSolvation, solventType,
    solvationDensity, showHydrogenBonds, showPressure, pressure,
    showVibration, vibrationMode, showOuterSphere, showLabels,
    showBondLengths, viewMode, showSymmetry, symmetryElement,
    moleculeCount, complex, autoRotate, controlsRef,
  })

  // ═══════════════════════════════════════════════════════════
  // MOLEKULA QURISH
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    const positions = getEnsemblePositions(moleculeCount, ensembleMode)
    buildEnsemble(scene, COMPLEXES[currentComplex], positions, ensembleMode)
    setSelectedAtom(null)
  }, [currentComplex, moleculeCount, ensembleMode, buildEnsemble, sceneRef])

  // ═══════════════════════════════════════════════════════════
  // PANEL TOGGLE
  // ═══════════════════════════════════════════════════════════
  const togglePanel = (panelName) => {
    setActivePanel(prev => prev === panelName ? null : panelName)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white flex flex-col">

      {/* 📱 MOBILE WARNING MODAL */}
      <MobileWarningModal
        isOpen={showMobileWarning}
        onClose={() => setShowMobileWarning(false)}
      />

      {/* HEADER */}
      {!fullscreenMode && (
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-purple-800/50 z-30 bg-purple-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link
              href="/oquv/fazoviy/trigonal-piramida"
              className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <span>←</span>
              <span className="hidden sm:inline">Orqaga</span>
            </Link>
            <div className="h-8 w-px bg-purple-800 flex-shrink-0"></div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-purple-300 flex items-center gap-2 truncate">
                <span>🔺</span>
                <span className="hidden sm:inline">Trigonal-Piramida — 3D Laboratoriya PRO</span>
                <span className="sm:hidden">3D Lab PRO</span>
              </h1>
              <p className="text-purple-500 text-xs truncate">
                {complex.formula} • {moleculeCount} mol. • VSEPR (AX₃E₁)
                {isMobileDevice && (
                  <span className="ml-2 inline-flex items-center gap-1 text-amber-400">
                    <span className="text-[10px]">📱</span>
                    <span className="text-[10px]">Mobil</span>
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <select
              value={currentComplex}
              onChange={(e) => setCurrentComplex(e.target.value)}
              className="bg-purple-900/60 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg border border-purple-700/50 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[160px]"
            >
              <option value="NH3">NH₃ (ammiak)</option>
              <option value="NF3">NF₃</option>
              <option value="PCl3">PCl₃</option>
            </select>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-lg transition-all text-sm ${autoRotate ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
              title="Avtomatik aylantirish"
            >🔄</button>
            <button
              onClick={() => togglePanel("info")}
              className={`p-2 rounded-lg transition-all text-sm ${activePanel === "info" ? 'bg-purple-600/60 text-white' : 'bg-purple-900/50 text-purple-400 hover:bg-purple-800/50'}`}
              title="Ma'lumot paneli"
            >ℹ️</button>
            <button
              onClick={() => setPdfModalOpen(true)}
              className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
              title="PDF eksport"
            >📄</button>
            <button
              onClick={() => setCitationModalOpen(true)}
              className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
              title="Iqtibos olish"
            >📚</button>
            <button
              onClick={() => setFullscreenMode(true)}
              className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
              title="To'liq ekran"
            >🖥️</button>
            {isMobileDevice && (
              <button
                onClick={() => {
                  localStorage.removeItem('mobile-warning-seen')
                  setShowMobileWarning(true)
                }}
                className="p-2 rounded-lg transition-all text-sm bg-amber-900/40 text-amber-300 hover:bg-amber-800/50 border border-amber-600/30"
                title="Mobil ogohlantirishni qayta ko'rish"
              >📱</button>
            )}
          </div>
        </header>
      )}

      {/* FULLSCREEN EXIT */}
      {fullscreenMode && (
        <button
          onClick={() => setFullscreenMode(false)}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-purple-900/70 backdrop-blur-md text-white hover:bg-purple-700/80 transition-all shadow-2xl border border-purple-500/40"
          title="Fullscreen rejimidan chiqish"
        >
          <span className="text-lg">✕</span>
        </button>
      )}

      {/* ASOSIY SCENE */}
      <div className="flex-1 flex flex-row relative overflow-hidden">
        {/* CHAP — Boshqaruv paneli */}
        {!fullscreenMode && (
          <ControlPanel
            panelRef={null}
            panelPos={{ x: 12, y: 12 }}
            isPanelDragging={false}
            handlePanelDragStart={() => {}}
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
            moleculeCount={moleculeCount}
            setMoleculeCount={setMoleculeCount}
            ensembleMode={ensembleMode}
            setEnsembleMode={setEnsembleMode}
            viewMode={viewMode}
            setViewMode={setViewMode}
            showLabels={showLabels}
            setShowLabels={setShowLabels}
            showBondLengths={showBondLengths}
            setShowBondLengths={setShowBondLengths}
            showOuterSphere={showOuterSphere}
            setShowOuterSphere={setShowOuterSphere}
            sliceView={sliceView}
            setSliceView={setSliceView}
            angleMeasureMode={angleMeasureMode}
            setAngleMeasureMode={setAngleMeasureMode}
            distanceMeasureMode={distanceMeasureMode}
            setDistanceMeasureMode={setDistanceMeasureMode}
            showAllAngles={false}
            setShowAllAngles={() => {}}
            activePanel={activePanel}
            togglePanel={togglePanel}
            showSolvation={showSolvation}
            setShowSolvation={setShowSolvation}
            solventType={solventType}
            setSolventType={setSolventType}
            solvationDensity={solvationDensity}
            setSolvationDensity={setSolvationDensity}
            showHydrogenBonds={showHydrogenBonds}
            setShowHydrogenBonds={setShowHydrogenBonds}
            showTemperature={showTemperature}
            setShowTemperature={setShowTemperature}
            temperature={temperature}
            setTemperature={setTemperature}
            showPressure={showPressure}
            setShowPressure={setShowPressure}
            pressure={pressure}
            setPressure={setPressure}
            showVibration={showVibration}
            setShowVibration={setShowVibration}
            vibrationMode={vibrationMode}
            setVibrationMode={setVibrationMode}
            showSymmetry={showSymmetry}
            setShowSymmetry={setShowSymmetry}
            symmetryElement={symmetryElement}
            setSymmetryElement={setSymmetryElement}
            showLonePair={showLonePair}
            setShowLonePair={setShowLonePair}
          />
        )}

        {/* 3D CONTAINER */}
        <div ref={containerRef} className="flex-1 w-full relative min-h-[500px]">
          {/* TANLANGAN ATOM */}
          {!fullscreenMode && selectedAtom && (
            <div className="absolute top-3 right-3 bg-purple-950/95 backdrop-blur-md rounded-xl p-4 z-30 border border-purple-700/50 max-w-xs w-[280px] shadow-2xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full shadow-lg border-2 border-white/30" style={{ backgroundColor: selectedAtom.info.color }}></div>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedAtom.info.name}</h3>
                    <p className="text-xs text-purple-400">Z = {selectedAtom.info.atomic}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAtom(null)} className="text-purple-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-2">
                  <p className="text-purple-400 text-[10px] mb-0.5 uppercase">Atom massasi</p>
                  <p className="text-white font-mono">{selectedAtom.info.mass}</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-2">
                  <p className="text-purple-400 text-[10px] mb-0.5 uppercase">Elektron konfig.</p>
                  <p className="text-white font-mono text-xs">{selectedAtom.info.config}</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-2">
                  <p className="text-purple-400 text-[10px] mb-0.5 uppercase">Vazifasi</p>
                  <p className="text-white text-xs">{selectedAtom.info.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* O'NG — Ma'lumot panellari */}
        {!fullscreenMode && (
          <InfoPanels
            selectedAtom={selectedAtom}
            setSelectedAtom={setSelectedAtom}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
            complex={complex}
            currentComplex={currentComplex}
            fullscreenMode={fullscreenMode}
            lonePairCount={complex.lonePairs}
          />
        )}
      </div>

      {/* BOTTOM PANEL */}
      {!fullscreenMode && (
        <div className="bg-purple-950/90 backdrop-blur-md border-t border-purple-800/50 z-10">
          <div className="flex justify-center gap-3 sm:gap-6 py-3 px-3 sm:px-6 flex-wrap">
            <Stat label="Burchak" value={`${complex.bondAngle}°`} mono />
            <Stat label="Koord. son" value="3" />
            <Stat label="Gibridlanish" value={complex.hybridization} mono />
            <Stat label="Simmetriya" value={complex.symmetry} mono />
            <Stat label={`${complex.center.element}-${complex.ligand.donor}`} value={complex.bondLengthReal} mono />
            <Stat label="VSEPR" value="AX₃E₁" mono />
            <Stat label="Molekulalar" value={`${moleculeCount}`} mono />
          </div>
          <div className="flex justify-center gap-3 sm:gap-5 py-2 px-4 bg-purple-950/60 border-t border-purple-800/30 flex-wrap text-xs">
            <LegendItem color={`#${complex.center.color.toString(16).padStart(6, '0')}`} label={`${complex.center.element} — markaziy`} />
            <LegendItem color={`#${complex.ligand.donorColor.toString(16).padStart(6, '0')}`} label={`${complex.ligand.donor} — ligand`} />
            <LegendItem color="#ffff00" label="Yolg'iz juft" />
            {showSolvation && <LegendItem color={`#${(CPK.O || 0xff0d0d).toString(16).padStart(6, '0')}`} label="Erituvchi" />}
          </div>
          <div className="text-center py-2 px-4 bg-purple-950/40 border-t border-purple-800/20">
            <p className="text-xs text-purple-500">
              <span className="font-mono text-purple-300">{complex.formula}</span> • {complex.name} • {complex.geometry} ({complex.symmetry}) • {complex.bondAngle}°
            </p>
          </div>
        </div>
      )}

      {/* MODALLAR */}
      <PDFModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        complex={complex}
        currentComplex={currentComplex}
        rendererRef={rendererRef}
        sceneRef={sceneRef}
        cameraRef={cameraRef}
        controlsRef={controlsRef}
        containerRef={containerRef}
        viewMode={viewMode}
        moleculeCount={moleculeCount}
        ensembleMode={ensembleMode}
        showTemperature={showTemperature}
        temperature={temperature}
        showPressure={showPressure}
        pressure={pressure}
        showSolvation={showSolvation}
        solventType={solventType}
        solvationDensity={solvationDensity}
        computeAllAngles={computeAllAngles}
      />

      <CitationModal
        isOpen={citationModalOpen}
        onClose={() => setCitationModalOpen(false)}
        complex={complex}
      />
    </main>
  )
}