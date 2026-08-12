"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ═══════════════════════════════════════════════════════════════════════════
// THREE.JS SCENE SETUP — TRIGONAL-PIRAMIDA LABORATORIYA UCHUN
// Scene, Camera, Renderer, Controls, Lighting, Grid, Raycaster
// ═══════════════════════════════════════════════════════════════════════════

export function useSceneSetup({ autoRotate, onLoadComplete }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const cameraRef = useRef(null)
  const clockRef = useRef(new THREE.Clock())

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ═══ SCENE ═══
    const scene = new THREE.Scene()
    scene.background = null
    scene.fog = new THREE.Fog(0x0a0a1a, 25, 60)
    sceneRef.current = scene

    // ═══ CAMERA ═══
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    )
    camera.position.set(6, 4, 7)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // ═══ RENDERER ═══
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.localClippingEnabled = true
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    // ═══ ORBIT CONTROLS ═══
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 3
    controls.maxDistance = 50
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 0.5
    controlsRef.current = controls

    // ═══ LIGHTING ═══
    scene.add(new THREE.AmbientLight(0x606080, 0.6))

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
    keyLight.position.set(8, 10, 8)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(2048, 2048)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xcc88ff, 0.4)
    fillLight.position.set(-6, -2, -4)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0x88ccff, 0.3)
    rimLight.position.set(0, -5, -8)
    scene.add(rimLight)

    // ═══ GRID ═══
    const grid = new THREE.GridHelper(20, 40, 0x333355, 0x1a1a33)
    grid.position.y = -6
    grid.material.transparent = true
    grid.material.opacity = 0.3
    scene.add(grid)

    // ═══ ANIMATION LOOP ═══
    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      clockRef.current.getDelta()
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // ═══ RESIZE ═══
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    onLoadComplete?.()

    // ═══ CLEANUP ═══
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", handleResize)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
        if (obj.material?.map) obj.material.map.dispose()
      })
      renderer.dispose()
      controls.dispose()
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-rotate update
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate
    }
  }, [autoRotate])

  return {
    containerRef,
    sceneRef,
    rendererRef,
    controlsRef,
    cameraRef,
    clockRef,
  }
}