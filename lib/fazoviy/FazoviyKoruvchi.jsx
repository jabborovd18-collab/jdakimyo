"use client"

// ═══════════════════════════════════════════════════════════════════════════
// 🌟 FAZOVIY 3D KO'RUVCHI — UMUMIY REACT KOMPONENTI
// Yagona haqiqat manbai: app/oquv/fazoviy/* barcha 3D sahifalar uchun
// ═══════════════════════════════════════════════════════════════════════════

import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { CPK, getCPKColor } from "./cpk.js"
import { ATOM_INFO, getAtomInfo } from "./atom-malumot.js"
import { makeTextSprite } from "./matn-sprite.js"
import { getEnsemblePositions } from "./ansambl.js"
import { initFazoviyScene, disposeThreeHierarchy } from "./sahna.js"
import { generateFazoviyPDF, cleanText } from "./pdf-hisobot.js"

export default function FazoviyKoruvchi({
  geometryInfo = {
    id: "oktaedrik",
    name: "Oktaedrik",
    icon: "💎",
    angle: "90°, 180°",
    ks: 6,
    hybridization: "d²sp³",
    symmetry: "Oh",
    backUrl: "/oquv/fazoviy/oktaedrik"
  },
  complexes = {},
  defaultComplexId = null,
  buildGeometry = null // (group, complex, refs, state) => {}
}) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)

  const atomsRef = useRef([])
  const labelsRef = useRef([])
  const bondLabelsRef = useRef([])
  const bondsRef = useRef([])
  const outerSphereRef = useRef([])
  const ligandAtomsRef = useRef([])
  const moleculeGroupsRef = useRef([])
  const animationFrameRef = useRef(null)

  // ═══════════════════════════════════════════════════════════
  // UI HOLATLARI (STATE)
  // ═══════════════════════════════════════════════════════════
  const complexKeys = Object.keys(complexes)
  const initialComplexId = defaultComplexId || complexKeys[0] || "default"
  const [currentComplexId, setCurrentComplexId] = useState(initialComplexId)
  const complex = complexes[currentComplexId] || complexes[complexKeys[0]] || {}

  const [loading, setLoading] = useState(true)
  const [selectedAtom, setSelectedAtom] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showBondLengths, setShowBondLengths] = useState(false)
  const [viewMode, setViewMode] = useState("ball-stick") // "ball-stick" | "space-filling" | "wireframe"
  const [moleculeCount, setMoleculeCount] = useState(1)
  const [ensembleMode, setEnsembleMode] = useState("crystal") // "crystal" | "solution"

  // Ilmiy panellar
  const [activePanel, setActivePanel] = useState(null) // null | "info" | "dorbital" | "mo" | "spectra"
  const [fullscreenMode, setFullscreenMode] = useState(false)

  // O'lchov rejimlari
  const [angleMeasureMode, setAngleMeasureMode] = useState(false)
  const [selectedLigands, setSelectedLigands] = useState([])
  const [measuredAngle, setMeasuredAngle] = useState(null)
  const [distanceMeasureMode, setDistanceMeasureMode] = useState(false)
  const [selectedForDistance, setSelectedForDistance] = useState([])
  const [measuredDistance, setMeasuredDistance] = useState(null)

  // Tashqi sharoitlar
  const [temperature, setTemperature] = useState(298)
  const [pressure, setPressure] = useState(1)
  const [phLevel, setPHLevel] = useState(7)
  const [solventType, setSolventType] = useState("water")

  // Modallar
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [citationModalOpen, setCitationModalOpen] = useState(false)
  const [citationFormat, setCitationFormat] = useState("apa")
  const [pdfGenerating, setPdfGenerating] = useState(false)

  const [pdfSections, setPdfSections] = useState({
    snapshot: true,
    info: true,
    conditions: true,
    geometry: true,
    dorbital: true,
    mo: false,
    spectra: false,
    references: true
  })

  // Akkordeon (Boshqaruv paneli bo'limi)
  const [expandedSection, setExpandedSection] = useState("view") // "view" | "conditions" | "scientific" | "export"

  // ═══════════════════════════════════════════════════════════
  // 🖱️ DRAGGABLE BOSHQARUV PANELI (Sichqoncha & Touch)
  // ═══════════════════════════════════════════════════════════
  const [panelPos, setPanelPos] = useState({ x: 12, y: 12 })
  const [isPanelDragging, setIsPanelDragging] = useState(false)
  const panelRef = useRef(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const handlePanelDragStart = useCallback((clientX, clientY) => {
    if (!panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    dragOffsetRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
    setIsPanelDragging(true)
  }, [])

  const handlePanelDragMove = useCallback((clientX, clientY) => {
    if (!panelRef.current) return
    const container = panelRef.current.parentElement
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const pW = panelRef.current.offsetWidth
    const pH = panelRef.current.offsetHeight
    let nx = clientX - cRect.left - dragOffsetRef.current.x
    let ny = clientY - cRect.top - dragOffsetRef.current.y
    nx = Math.max(0, Math.min(cRect.width - pW, nx))
    ny = Math.max(0, Math.min(cRect.height - pH, ny))
    setPanelPos({ x: nx, y: ny })
  }, [])

  const handlePanelDragEnd = useCallback(() => {
    setIsPanelDragging(false)
  }, [])

  useEffect(() => {
    if (!isPanelDragging) return
    const onMouseMove = (e) => handlePanelDragMove(e.clientX, e.clientY)
    const onMouseUp = () => handlePanelDragEnd()
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handlePanelDragMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const onTouchEnd = () => handlePanelDragEnd()

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd)
    window.addEventListener("touchcancel", onTouchEnd)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("touchcancel", onTouchEnd)
    }
  }, [isPanelDragging, handlePanelDragMove, handlePanelDragEnd])

  // ═══════════════════════════════════════════════════════════
  // 3D SAHNA INIZIALIZATSIYASI VA RENDER
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sceneData = initFazoviyScene(container, {
      cameraPos: [4.5, 3.2, 4.5],
      target: [0, 0, 0]
    })
    if (!sceneData) return

    const { scene, camera, renderer, controls, cleanup } = sceneData
    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    controlsRef.current = controls

    // Modellar guruhi
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    const refs = {
      atomsRef,
      labelsRef,
      bondLabelsRef,
      bondsRef,
      outerSphereRef,
      ligandAtomsRef
    }

    // Pozitsiyalar bo'yicha molekulalarni qurish
    const positions = getEnsemblePositions(moleculeCount, ensembleMode)
    atomsRef.current = []
    labelsRef.current = []
    bondLabelsRef.current = []
    bondsRef.current = []
    outerSphereRef.current = []
    ligandAtomsRef.current = []
    moleculeGroupsRef.current = []

    positions.forEach((pos) => {
      const molGroup = new THREE.Group()
      molGroup.position.copy(pos)

      if (typeof buildGeometry === "function") {
        buildGeometry(molGroup, complex, refs, {
          viewMode,
          temperature,
          pressure,
          showLabels,
          showBondLengths
        })
      }

      mainGroup.add(molGroup)
      moleculeGroupsRef.current.push(molGroup)
    })

    // Animatsiya loopi
    let isRunning = true
    const animate = () => {
      if (!isRunning) return
      animationFrameRef.current = requestAnimationFrame(animate)

      if (autoRotate && controlsRef.current) {
        mainGroup.rotation.y += 0.003
      }

      controls.update()
      renderer.render(scene, camera)
    }

    animate()
    setLoading(false)

    // Raycaster — Atomlarni bosish (Click)
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onPointerDown = (event) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(atomsRef.current, true)

      if (intersects.length > 0) {
        const hit = intersects[0].object
        if (hit.userData?.type === "atom") {
          const info = hit.userData.info || getAtomInfo(hit.userData.element)
          setSelectedAtom({
            element: hit.userData.element,
            info,
            position: hit.position
          })

          // Masofa o'lchash rejimi
          if (distanceMeasureMode) {
            setSelectedForDistance((prev) => {
              if (prev.length >= 2) return [hit]
              const next = [...prev, hit]
              if (next.length === 2) {
                const p1 = new THREE.Vector3()
                const p2 = new THREE.Vector3()
                next[0].getWorldPosition(p1)
                next[1].getWorldPosition(p2)
                setMeasuredDistance(p1.distanceTo(p2).toFixed(2))
              }
              return next
            })
          }
        }
      }
    }

    container.addEventListener("pointerdown", onPointerDown)

    return () => {
      isRunning = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      container.removeEventListener("pointerdown", onPointerDown)
      cleanup()
    }
  }, [
    currentComplexId,
    moleculeCount,
    ensembleMode,
    viewMode,
    buildGeometry,
    complex
  ])

  // Yorliqlarni ko'rsatish/yashirish
  useEffect(() => {
    labelsRef.current.forEach((lbl) => {
      if (lbl) lbl.visible = showLabels
    })
  }, [showLabels])

  // ═══════════════════════════════════════════════════════════
  // PDF EKSPORT FUNKSIYASI
  // ═══════════════════════════════════════════════════════════
  const handleExportPDF = async () => {
    setPdfGenerating(true)
    try {
      let canvasDataUrl = null
      if (rendererRef.current) {
        canvasDataUrl = rendererRef.current.domElement.toDataURL("image/png")
      }

      const pdfBytes = await generateFazoviyPDF({
        complex,
        geometryInfo,
        canvasDataUrl,
        options: { temperature, pressure, phLevel, solvent: solventType },
        sections: pdfSections
      })

      // Faylni brauzerda yuklab olish
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${cleanText(complex.formula || geometryInfo.name)}_3D_Hisobot.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setPdfModalOpen(false)
    } catch (err) {
      console.error("PDF yaratishda xatolik:", err)
      alert("PDF hisobot yaratishda xatolik yuz berdi.")
    } finally {
      setPdfGenerating(false)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // IQTIBOS FORMATI MATNI
  // ═══════════════════════════════════════════════════════════
  const getCitationText = () => {
    const year = new Date().getFullYear()
    const title = `${cleanText(complex.formula)} — ${geometryInfo.name} 3D Fazoviy Modeli`
    const url = typeof window !== "undefined" ? window.location.href : "https://jdakimyo.uz"

    switch (citationFormat) {
      case "apa":
        return `JDA Kimyo. (${year}). ${title}. JDA Kimyo Ta'lim Portali. ${url}`
      case "mla":
        return `\"${title}.\" JDA Kimyo, ${year}, ${url}.`
      case "chicago":
        return `JDA Kimyo. \"${title}.\" O'zbekiston, ${year}. ${url}.`
      case "bibtex":
        return `@misc{jdakimyo_${complex.id || "complex"},\n  title = {${title}},\n  author = {{JDA Kimyo Jamoasi}},\n  year = {${year}},\n  url = {${url}}\n}`
      default:
        return url
    }
  }

  // ═══════════════════════════════════════════════════════════
  // JSX RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white flex flex-col relative select-none">
      {/* ── 1. HEADER ── */}
      {!fullscreenMode && (
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-purple-800/50 z-30 bg-purple-950/85 backdrop-blur-md">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link
              href={geometryInfo.backUrl || "/oquv/fazoviy"}
              className="text-purple-400 hover:text-purple-300 text-lg transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <span>←</span>
              <span className="hidden sm:inline text-sm font-medium">Orqaga</span>
            </Link>
            <div className="h-6 w-px bg-purple-800 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-purple-200 flex items-center gap-2 truncate">
                <span>{geometryInfo.icon || "💎"}</span>
                <span>{geometryInfo.name} — 3D Laboratoriya PRO</span>
              </h1>
              <p className="text-purple-400 text-xs truncate">
                {complex.formula || ""} • {moleculeCount} mol. • {ensembleMode === "crystal" ? "Kristall" : "Eritma"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {complexKeys.length > 1 && (
              <select
                value={currentComplexId}
                onChange={(e) => setCurrentComplexId(e.target.value)}
                className="bg-purple-900/70 text-white text-xs sm:text-sm px-2.5 py-1.5 rounded-lg border border-purple-700/50 focus:outline-none focus:border-purple-400 cursor-pointer max-w-[180px]"
              >
                {complexKeys.map((k) => (
                  <option key={k} value={k}>
                    {complexes[k].formula || complexes[k].name || k}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-lg transition-all text-sm ${
                autoRotate
                  ? "bg-purple-600/70 text-white shadow-md shadow-purple-600/30"
                  : "bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
              }`}
              title="Avtomatik aylantirish"
            >
              🔄
            </button>

            <button
              onClick={() => setActivePanel(activePanel === "info" ? null : "info")}
              className={`p-2 rounded-lg transition-all text-sm ${
                activePanel === "info"
                  ? "bg-purple-600/70 text-white shadow-md shadow-purple-600/30"
                  : "bg-purple-900/50 text-purple-400 hover:bg-purple-800/50"
              }`}
              title="Ma'lumot paneli"
            >
              ℹ️
            </button>

            <button
              onClick={() => setPdfModalOpen(true)}
              className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-300 hover:bg-purple-800/50 hover:text-white"
              title="PDF hisobot eksport"
            >
              📄
            </button>

            <button
              onClick={() => setCitationModalOpen(true)}
              className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-300 hover:bg-purple-800/50 hover:text-white"
              title="Iqtibos olish"
            >
              📚
            </button>

            <button
              onClick={() => setFullscreenMode(true)}
              className="p-2 rounded-lg transition-all text-sm bg-purple-900/50 text-purple-300 hover:bg-purple-800/50 hover:text-white"
              title="To'liq ekran rejimi"
            >
              🖥️
            </button>
          </div>
        </header>
      )}

      {/* ── 2. FULLSCREEN CHIQISH TUGMASI ── */}
      {fullscreenMode && (
        <button
          onClick={() => setFullscreenMode(false)}
          className="fixed top-4 right-4 z-50 p-3 rounded-full bg-purple-900/80 backdrop-blur-md text-white hover:bg-purple-700 transition-all shadow-2xl border border-purple-500/50"
          title="Fullscreen rejimidan chiqish"
        >
          ✕
        </button>
      )}

      {/* ── 3. ASOSIY 3D SAHNA VA PANELI ── */}
      <div className="flex-1 flex flex-row relative overflow-hidden">
        {/* Ko'chiriladigan boshqaruv paneli */}
        <div
          ref={panelRef}
          className={`absolute z-20 bg-purple-950/90 backdrop-blur-md rounded-xl border border-purple-700/50 w-[270px] shadow-2xl max-h-[calc(100vh-130px)] flex flex-col ${
            isPanelDragging ? "shadow-purple-500/50 border-purple-500/80" : ""
          }`}
          style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}
        >
          {/* Panel sarlavhasi (Drag handle) */}
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
            className={`flex items-center justify-between px-3.5 py-2.5 border-b border-purple-700/40 rounded-t-xl transition-colors select-none touch-none ${
              isPanelDragging ? "cursor-grabbing bg-purple-800/60" : "cursor-grab bg-purple-900/50 hover:bg-purple-800/50"
            }`}
            title="Ushlab siljiting — panelni istalgan joyga qo'yish mumkin"
          >
            <h3 className="text-xs font-bold text-purple-200 uppercase tracking-wide flex items-center gap-2">
              <span className="text-purple-400">⋮⋮</span>
              <span>🎛️</span> Boshqaruv paneli
            </h3>
            <span className="text-purple-400 text-[10px] opacity-70">↕ ↔</span>
          </div>

          {/* Panel tanasi */}
          <div className="p-3 overflow-y-auto custom-scrollbar flex-1 space-y-2.5 text-xs">
            {/* Molekulalar soni */}
            <div className="bg-purple-900/40 rounded-lg p-2.5 border border-purple-700/30">
              <h4 className="text-[10px] text-yellow-400 uppercase mb-2 font-bold flex items-center gap-1">
                <span>🧬</span> Molekulalar soni
              </h4>
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {[1, 8, 27].map((n) => (
                  <button
                    key={n}
                    onClick={() => setMoleculeCount(n)}
                    className={`py-1 rounded text-xs font-bold transition-all ${
                      moleculeCount === n
                        ? "bg-yellow-600 text-white shadow-md"
                        : "bg-purple-950/60 text-purple-300 hover:bg-purple-800/60"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {moleculeCount > 1 && (
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setEnsembleMode("crystal")}
                    className={`py-1 rounded text-[10px] font-medium transition-all ${
                      ensembleMode === "crystal" ? "bg-cyan-600 text-white" : "bg-purple-950/60 text-purple-300"
                    }`}
                  >
                    🔷 Kristall
                  </button>
                  <button
                    onClick={() => setEnsembleMode("solution")}
                    className={`py-1 rounded text-[10px] font-medium transition-all ${
                      ensembleMode === "solution" ? "bg-cyan-600 text-white" : "bg-purple-950/60 text-purple-300"
                    }`}
                  >
                    💧 Eritma
                  </button>
                </div>
              )}
            </div>

            {/* Akkordeon 1: Ko'rinish sozlamalari */}
            <div className="border border-purple-800/40 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "view" ? null : "view")}
                className="w-full flex items-center justify-between p-2 bg-purple-900/40 hover:bg-purple-800/40 text-purple-200 font-semibold"
              >
                <span>👁️ Ko'rinish sozlamalari</span>
                <span>{expandedSection === "view" ? "▲" : "▼"}</span>
              </button>
              {expandedSection === "view" && (
                <div className="p-2.5 bg-purple-950/40 space-y-2 border-t border-purple-800/30">
                  <div>
                    <label className="text-[10px] text-purple-400 uppercase font-medium">Model turi</label>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      {[
                        ["ball-stick", "Koptok"],
                        ["space-filling", "Sfera"],
                        ["wireframe", "Karkas"]
                      ].map(([m, label]) => (
                        <button
                          key={m}
                          onClick={() => setViewMode(m)}
                          className={`py-1 px-1.5 rounded text-[10px] font-medium transition-all ${
                            viewMode === m ? "bg-purple-600 text-white" : "bg-purple-900/40 text-purple-300"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-purple-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={showLabels}
                        onChange={(e) => setShowLabels(e.target.checked)}
                        className="rounded border-purple-700 text-purple-600"
                      />
                      <span>Atom nomlari (Yorliqlar)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-purple-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={distanceMeasureMode}
                        onChange={(e) => {
                          setDistanceMeasureMode(e.target.checked)
                          setSelectedForDistance([])
                          setMeasuredDistance(null)
                        }}
                        className="rounded border-purple-700 text-purple-600"
                      />
                      <span>Masofa o'lchash (Å)</span>
                    </label>
                    {distanceMeasureMode && measuredDistance && (
                      <div className="text-cyan-300 text-xs bg-cyan-950/60 p-1.5 rounded border border-cyan-800/50 text-center">
                        Masofa: <b>{measuredDistance} Å</b>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Akkordeon 2: Tashqi sharoitlar */}
            <div className="border border-purple-800/40 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "conditions" ? null : "conditions")}
                className="w-full flex items-center justify-between p-2 bg-purple-900/40 hover:bg-purple-800/40 text-purple-200 font-semibold"
              >
                <span>🌡️ Tashqi sharoitlar</span>
                <span>{expandedSection === "conditions" ? "▲" : "▼"}</span>
              </button>
              {expandedSection === "conditions" && (
                <div className="p-2.5 bg-purple-950/40 space-y-2.5 border-t border-purple-800/30">
                  <div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-purple-400">Harorat (T):</span>
                      <span className="text-cyan-300 font-mono">{temperature} K</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="600"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer mt-1"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-purple-400">Bosim (P):</span>
                      <span className="text-cyan-300 font-mono">{pressure} atm</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="50"
                      step="0.5"
                      value={pressure}
                      onChange={(e) => setPressure(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer mt-1"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-purple-400">pH darajasi:</span>
                      <span className="text-cyan-300 font-mono">{phLevel}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="14"
                      value={phLevel}
                      onChange={(e) => setPHLevel(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Akkordeon 3: Ilmiy tahlil */}
            <div className="border border-purple-800/40 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "scientific" ? null : "scientific")}
                className="w-full flex items-center justify-between p-2 bg-purple-900/40 hover:bg-purple-800/40 text-purple-200 font-semibold"
              >
                <span>⚛️ Ilmiy tahlil</span>
                <span>{expandedSection === "scientific" ? "▲" : "▼"}</span>
              </button>
              {expandedSection === "scientific" && (
                <div className="p-2.5 bg-purple-950/40 space-y-1.5 border-t border-purple-800/30">
                  <button
                    onClick={() => setActivePanel(activePanel === "dorbital" ? null : "dorbital")}
                    className={`w-full py-1.5 px-2 rounded text-left text-xs transition-all flex items-center justify-between ${
                      activePanel === "dorbital" ? "bg-purple-600 text-white font-bold" : "bg-purple-900/40 text-purple-300"
                    }`}
                  >
                    <span>📊 d-Orbital ajralishi</span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => setActivePanel(activePanel === "spectra" ? null : "spectra")}
                    className={`w-full py-1.5 px-2 rounded text-left text-xs transition-all flex items-center justify-between ${
                      activePanel === "spectra" ? "bg-purple-600 text-white font-bold" : "bg-purple-900/40 text-purple-300"
                    }`}
                  >
                    <span>🌈 UV-Vis spektri</span>
                    <span>→</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3D Canvas konteyneri */}
        <div ref={containerRef} className="w-full h-full flex-1 relative bg-gradient-to-b from-purple-950 to-blue-950" />

        {/* ── ILMIY MA'LUMOT MODAL / PANELLARI ── */}
        {activePanel === "info" && (
          <div className="absolute right-4 top-4 z-30 w-80 bg-purple-950/95 backdrop-blur-md p-4 rounded-xl border border-purple-700/60 shadow-2xl">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-purple-800/60">
              <h3 className="font-bold text-sm text-purple-200">ℹ️ Kompleks haqida ma'lumot</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 text-xs text-purple-300">
              <div><span className="text-purple-400">Formula:</span> <b className="text-white">{complex.formula}</b></div>
              <div><span className="text-purple-400">Nomi:</span> {complex.name}</div>
              <div><span className="text-purple-400">To'liq tuzilishi:</span> {complex.fullSalt}</div>
              <div><span className="text-purple-400">Gibridlanish:</span> {complex.hybridization || geometryInfo.hybridization}</div>
              <div><span className="text-purple-400">Magnit xossasi:</span> {complex.magnetism || "-"}</div>
              <div><span className="text-purple-400">Rangi:</span> {complex.color || "-"}</div>
            </div>
          </div>
        )}

        {activePanel === "dorbital" && (
          <div className="absolute right-4 top-4 z-30 w-88 bg-purple-950/95 backdrop-blur-md p-4 rounded-xl border border-purple-700/60 shadow-2xl">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-purple-800/60">
              <h3 className="font-bold text-sm text-purple-200">📊 Kristall Maydon d-Orbital Ajralishi</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-white">✕</button>
            </div>
            <div className="text-xs text-purple-300 space-y-2.5">
              {geometryInfo.dOrbitalSplitting || complex.dOrbitalSplitting ? (
                (() => {
                  const split = complex.dOrbitalSplitting || geometryInfo.dOrbitalSplitting;
                  return (
                    <>
                      <p>{split.theory || "Kristall maydon nazariyasi (CFT) bo'yicha d-orbitallarning energetik sathlarga bo'linishi:"}</p>
                      <div className="bg-purple-900/50 p-2.5 rounded border border-purple-700/50 font-mono text-[11px] space-y-1.5">
                        {split.levels?.map((lvl, idx) => (
                          <div key={idx} className={lvl.color || "text-yellow-300"}>
                            {lvl.name}: {lvl.energy} {lvl.desc ? `(${lvl.desc})` : ""}
                          </div>
                        ))}
                        {split.parameters?.map((param, idx) => (
                          <div key={idx} className="text-purple-200 pt-1 border-t border-purple-800/50 flex justify-between">
                            <span>{param.label}:</span>
                            <b className="text-yellow-300">
                              {typeof param.getValue === "function"
                                ? param.getValue(complex)
                                : param.value || complex.dOrbital?.[param.key]?.toLocaleString() || "-"}
                            </b>
                          </div>
                        ))}
                        {(complex.dOrbital?.delta1 || complex.dOrbital?.delta1_cm || complex.dOrbital?.deltaO || complex.dOrbital?.deltaTPR) && !split.parameters && (
                          <div className="text-purple-200 pt-1 border-t border-purple-800/50 flex justify-between">
                            <span>Ajralish parametri (Δ):</span>
                            <b className="text-yellow-300">
                              {(complex.dOrbital.delta1 || complex.dOrbital.delta1_cm || complex.dOrbital.deltaO || complex.dOrbital.deltaTPR).toLocaleString()} cm⁻¹
                            </b>
                          </div>
                        )}
                        {split.pairingEnergy && (
                          <div className="text-purple-300 text-[10px] flex justify-between pt-1">
                            <span>Juftlashuv energiyasi (P):</span>
                            <span>{split.pairingEnergy}</span>
                          </div>
                        )}
                        {split.note && (
                          <div className="text-purple-400 text-[10px] pt-1 italic">
                            {split.note}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()
              ) : geometryInfo.ks === 6 || complex.dOrbital?.tg !== undefined ? (
                <>
                  <p>Kristall maydon nazariyasi (CFT) bo'yicha oktaedrik d-orbital ajralishi:</p>
                  <div className="bg-purple-900/50 p-2.5 rounded border border-purple-700/50 font-mono text-[11px] space-y-1.5">
                    <div className="text-yellow-300">eg (dx²-y², dz²): +0.6 Δₒ (Yuqori sath)</div>
                    <div className="text-cyan-300">t₂g (dxy, dyz, dxz): -0.4 Δₒ (Pastki sath)</div>
                    <div className="text-purple-200 pt-1 border-t border-purple-800/50 flex justify-between">
                      <span>Δₒ parametri:</span>
                      <b className="text-yellow-300">{complex.dOrbital?.deltaO?.toLocaleString() || "23 000"} cm⁻¹</b>
                    </div>
                    <div className="text-purple-300 text-[10px] flex justify-between pt-1">
                      <span>Juftlashuv energiyasi (P):</span>
                      <span>≈ 20 000 cm⁻¹</span>
                    </div>
                  </div>
                </>
              ) : geometryInfo.ks === 4 && (geometryInfo.symmetry === "Td" || !geometryInfo.symmetry) ? (
                <>
                  <p>Kristall maydon nazariyasi (CFT) bo'yicha tetraedrik d-orbital ajralishi:</p>
                  <div className="bg-purple-900/50 p-2.5 rounded border border-purple-700/50 font-mono text-[11px] space-y-1.5">
                    <div className="text-yellow-300">t₂ (dxy, dyz, dxz): +0.4 Δₜ (Yuqori sath)</div>
                    <div className="text-cyan-300">e (dx²-y², dz²): -0.6 Δₜ (Pastki sath)</div>
                    <div className="text-purple-200 pt-1 border-t border-purple-800/50 flex justify-between">
                      <span>Δₜ parametri:</span>
                      <b className="text-yellow-300">{complex.dOrbital?.deltaT?.toLocaleString() || "4 200"} cm⁻¹</b>
                    </div>
                    <div className="text-purple-300 text-[10px] flex justify-between pt-1">
                      <span>Juftlashuv energiyasi (P):</span>
                      <span>≈ 20 000 cm⁻¹</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-purple-900/40 p-3 rounded border border-purple-800 text-xs text-purple-300 space-y-2">
                  <p className="font-semibold text-yellow-300">ℹ️ Maydon xususiyati:</p>
                  <p>
                    {geometryInfo.name || "Ushbu geometriya"} ({geometryInfo.symmetry || `KS ${geometryInfo.ks}`}) uchun klassik oktaedrik/tetraedrik kristall maydon ajralish sxemasi to'g'ri kelmaydi.
                  </p>
                  <p className="text-purple-400 text-[11px]">
                    Ushbu birikmalarning elektron tuzilishi va energetik sathlari molekulyar orbitallar (MO) yoki xos ligand maydoni hisoblari orqali aniqlanadi.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activePanel === "spectra" && (
          <div className="absolute right-4 top-4 z-30 w-88 bg-purple-950/95 backdrop-blur-md p-4 rounded-xl border border-purple-700/60 shadow-2xl">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-purple-800/60">
              <h3 className="font-bold text-sm text-purple-200">🌈 Spektroskopik Tahlil</h3>
              <button onClick={() => setActivePanel(null)} className="text-purple-400 hover:text-white">✕</button>
            </div>
            <div className="text-xs text-purple-300 space-y-2.5">
              <p>UV-Vis elektron o'tishlar va IR/Raman tebranish modlari:</p>
              <div className="bg-purple-900/50 p-2.5 rounded border border-purple-700/50 text-[11px] font-mono space-y-1 text-purple-200">
                {complex.uvVis ? (
                  <div className="text-cyan-300">UV-Vis: {complex.uvVis}</div>
                ) : complex.spectroscopy?.uvVis ? (
                  <div className="text-cyan-300">UV-Vis: {complex.spectroscopy.uvVis}</div>
                ) : (
                  <div className="text-cyan-300">UV-Vis (d–d): {complex.id === "CoNH3" ? "λmax ≈ 475 nm" : complex.id === "CoCl4" ? "λmax ≈ 660 nm" : "λmax ≈ 420 nm"}</div>
                )}
                {complex.ir ? (
                  <div className="pt-1 border-t border-purple-800/50 text-yellow-300">IR: {complex.ir}</div>
                ) : complex.spectroscopy?.ir ? (
                  <div className="pt-1 border-t border-purple-800/50 text-yellow-300">IR: {complex.spectroscopy.ir}</div>
                ) : (
                  <>
                    <div className="pt-1 border-t border-purple-800/50 text-yellow-300">
                      IR (M–L tebranish): {(geometryInfo.ks === 6 || complex.coordNumber === 6) ? "400–600 cm⁻¹" : "280–330 cm⁻¹"}
                    </div>
                    <div className="text-purple-300 text-[10px]">
                      Simmetrik cho'zilish: {(geometryInfo.ks === 6 || complex.coordNumber === 6) ? "≈ 500 cm⁻¹" : "≈ 310 cm⁻¹"}
                    </div>
                    <div className="text-purple-300 text-[10px]">
                      Asimmetrik cho'zilish: {(geometryInfo.ks === 6 || complex.coordNumber === 6) ? "≈ 450 cm⁻¹" : "≈ 295 cm⁻¹"}
                    </div>
                  </>
                )}
                {complex.raman && (
                  <div className="pt-1 border-t border-purple-800/50 text-emerald-300">Raman: {complex.raman}</div>
                )}
                {complex.spectroscopy?.raman && (
                  <div className="pt-1 border-t border-purple-800/50 text-emerald-300">Raman: {complex.spectroscopy.raman}</div>
                )}
                {complex.spectroscopy?.notes && (
                  <div className="text-purple-400 text-[10px] pt-1">{complex.spectroscopy.notes}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Atom haqida ma'lumot (Tanlangan atom modali) */}
        {selectedAtom && (
          <div className="absolute bottom-16 right-4 z-30 w-72 bg-purple-950/95 backdrop-blur-md p-3.5 rounded-xl border border-purple-600/70 shadow-2xl">
            <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-purple-800/60">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block border border-white/40"
                  style={{ backgroundColor: selectedAtom.info.color || "#FFF" }}
                />
                <h4 className="font-bold text-xs text-purple-200">{selectedAtom.info.name}</h4>
              </div>
              <button onClick={() => setSelectedAtom(null)} className="text-purple-400 hover:text-white text-xs">✕</button>
            </div>
            <div className="text-[11px] space-y-1 text-purple-300">
              <div><span className="text-purple-400">Atom massasi:</span> {selectedAtom.info.mass}</div>
              <div><span className="text-purple-400">Konfiguratsiya:</span> {selectedAtom.info.config}</div>
              <div><span className="text-purple-400">Roli:</span> {selectedAtom.info.role}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. PASTKI PARAMETRLAR (STATS BAR) ── */}
      {!fullscreenMode && (
        <div className="flex justify-around items-center py-3 px-4 bg-purple-950/90 border-t border-purple-800/50 z-10 flex-wrap gap-2">
          <div className="text-center">
            <div className="text-[10px] text-purple-400 uppercase">Valent burchak</div>
            <div className="text-sm sm:text-base font-bold text-white">{geometryInfo.angle}</div>
          </div>
          <div className="h-6 w-px bg-purple-800/60" />
          <div className="text-center">
            <div className="text-[10px] text-purple-400 uppercase">Koordinatsion son (KS)</div>
            <div className="text-sm sm:text-base font-bold text-white">{geometryInfo.ks}</div>
          </div>
          <div className="h-6 w-px bg-purple-800/60" />
          <div className="text-center">
            <div className="text-[10px] text-purple-400 uppercase">Gibridlanish</div>
            <div className="text-sm sm:text-base font-bold text-white">{geometryInfo.hybridization}</div>
          </div>
          <div className="h-6 w-px bg-purple-800/60" />
          <div className="text-center">
            <div className="text-[10px] text-purple-400 uppercase">Simmetriya</div>
            <div className="text-sm sm:text-base font-bold text-white">{geometryInfo.symmetry}</div>
          </div>
        </div>
      )}

      {/* ── 5. CPK RANGLAR LEGENDASI ── */}
      {!fullscreenMode && (
        <div className="flex justify-center items-center gap-4 sm:gap-6 py-2 px-4 bg-purple-950/60 border-t border-purple-800/30 z-10 flex-wrap text-xs text-purple-300">
          {complex.center && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: getCPKColor(complex.center.element, true) }}
              />
              <span>{complex.center.element} (Markaziy)</span>
            </div>
          )}
          {complex.ligand && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: getCPKColor(complex.ligand.donor, true) }}
              />
              <span>{complex.ligand.donor} (Donor)</span>
            </div>
          )}
          {complex.outerIon && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: getCPKColor(complex.outerIon.element, true) }}
              />
              <span>{complex.outerIon.element} (Tashqi sfera)</span>
            </div>
          )}
        </div>
      )}

      {/* ── 6. PDF EKSPORT MODALI ── */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-purple-950 border border-purple-700 rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-purple-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📄</span> 3D Ilmiy PDF Hisobot
              </h3>
              <button onClick={() => setPdfModalOpen(false)} className="text-purple-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-purple-300 mb-4">
              Ushbu molekula, uning fazoviy parametrlari va 3D rasmini o'z ichiga olgan rasmiy A4 ilmiy hisobotni yuklab oling.
            </p>
            <div className="space-y-2 mb-5 text-xs">
              {Object.keys(pdfSections).map((sec) => (
                <label key={sec} className="flex items-center gap-2 text-purple-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pdfSections[sec]}
                    onChange={(e) => setPdfSections({ ...pdfSections, [sec]: e.target.checked })}
                    className="rounded border-purple-700 text-purple-600"
                  />
                  <span className="capitalize">{sec} bo'limi</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPdfModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-300 text-xs font-medium"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleExportPDF}
                disabled={pdfGenerating}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg disabled:opacity-50"
              >
                {pdfGenerating ? "Yaratilmoqda..." : "Yuklab olish (.PDF)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. IQTIBOS (CITATION) MODALI ── */}
      {citationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-purple-950 border border-purple-700 rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-purple-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📚</span> Ilmiy Iqtibos (Citation)
              </h3>
              <button onClick={() => setCitationModalOpen(false)} className="text-purple-400 hover:text-white">✕</button>
            </div>
            <div className="flex gap-1 mb-3">
              {["apa", "mla", "chicago", "bibtex"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setCitationFormat(fmt)}
                  className={`px-3 py-1 rounded text-xs uppercase font-bold transition-all ${
                    citationFormat === fmt ? "bg-purple-600 text-white" : "bg-purple-900/40 text-purple-400"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
            <div className="bg-purple-900/50 p-3 rounded-lg border border-purple-700/40 text-xs font-mono text-purple-200 break-all mb-4">
              {getCitationText()}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getCitationText())
                  alert("Iqtibos nusxalandi!")
                }}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Nusxa olish
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
