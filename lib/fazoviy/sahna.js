// ═══════════════════════════════════════════════════════════════════════════
// THREE.JS SAHNA VA XOTIRA BOSHQARUVI (DISPOSE)
// Yagona haqiqat manbai: app/oquv/fazoviy/* uchun sahna, kamera, renderer
// ═══════════════════════════════════════════════════════════════════════════

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

/**
 * Fazoviy 3D ko'ruvchi uchun Three.js sahnasini ishga tushirish
 * @param {HTMLElement} container - Canvas qo'yiladigan HTML div
 * @param {object} [options={}] - Sozlamalar (cameraPos, minDistance, maxDistance, fov)
 * @returns {object} { scene, camera, renderer, controls, cleanup }
 */
export function initFazoviyScene(container, options = {}) {
  if (!container) return null

  const width = container.clientWidth || window.innerWidth || 800
  const height = container.clientHeight || window.innerHeight || 600

  const {
    cameraPos = [5, 3.5, 5],
    target = [0, 0, 0],
    fov = 45,
    near = 0.1,
    far = 100,
    minDistance = 2,
    maxDistance = 25,
    dampingFactor = 0.08
  } = options

  // 1. Sahna
  const scene = new THREE.Scene()

  // 2. Kamera
  const camera = new THREE.PerspectiveCamera(fov, width / height, near, far)
  camera.position.set(...cameraPos)
  camera.lookAt(...target)

  // 3. Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true // PDF snapshot olish uchun zarur!
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.appendChild(renderer.domElement)

  // 4. OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = dampingFactor
  controls.minDistance = minDistance
  controls.maxDistance = maxDistance
  controls.target.set(...target)

  // 5. Yorug'liklar
  const ambientLight = new THREE.AmbientLight(0x404060, 0.8)
  scene.add(ambientLight)

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2)
  dirLight1.position.set(6, 8, 6)
  dirLight1.castShadow = true
  dirLight1.shadow.mapSize.width = 1024
  dirLight1.shadow.mapSize.height = 1024
  scene.add(dirLight1)

  const dirLight2 = new THREE.DirectionalLight(0x88ffff, 0.6)
  dirLight2.position.set(-5, -2, -4)
  scene.add(dirLight2)

  // 6. Yordamchi fon: Grid va Yulduzlar/Zarrachalar
  const grid = new THREE.GridHelper(10, 20, 0x3b2d54, 0x1e152f)
  grid.position.y = -2.5
  scene.add(grid)

  const starsGeo = new THREE.BufferGeometry()
  const starPositions = new Float32Array(300 * 3)
  for (let i = 0; i < 300 * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 20
    starPositions[i + 1] = (Math.random() - 0.5) * 15
    starPositions[i + 2] = (Math.random() - 0.5) * 20
  }
  starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))
  const starsMat = new THREE.PointsMaterial({
    color: 0xc4b5fd,
    size: 0.03,
    transparent: true,
    opacity: 0.4
  })
  const stars = new THREE.Points(starsGeo, starsMat)
  scene.add(stars)

  // 7. O'lcham o'zgarganda (Resize handler)
  const handleResize = () => {
    if (!container) return
    const w = container.clientWidth
    const h = container.clientHeight
    if (w === 0 || h === 0) return
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }

  window.addEventListener("resize", handleResize)

  // 8. Tozalash (Cleanup) funksiyasi
  const cleanup = () => {
    window.removeEventListener("resize", handleResize)
    disposeThreeHierarchy(scene)
    try {
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
      renderer.forceContextLoss()
    } catch (e) {
      console.warn("Renderer dispose xatosi:", e)
    }
  }

  return {
    scene,
    camera,
    renderer,
    controls,
    grid,
    stars,
    handleResize,
    cleanup
  }
}

/**
 * Three.js ob'ektlari daraxtidagi barcha resurslarni xotiradan to'liq bo'shatish
 * @param {THREE.Object3D} root
 */
export function disposeThreeHierarchy(root) {
  if (!root) return

  root.traverse((obj) => {
    // 1. Geometriyani bo'shatish
    if (obj.geometry) {
      obj.geometry.dispose()
    }

    // 2. Materiallarni va teksturalarni bo'shatish
    if (obj.material) {
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
      materials.forEach((mat) => {
        if (!mat) return

        // Teksturalarni tozalash (CanvasTexture, Map va h.k.)
        if (mat.map && typeof mat.map.dispose === "function") {
          mat.map.dispose()
        }
        if (mat.lightMap && typeof mat.lightMap.dispose === "function") {
          mat.lightMap.dispose()
        }
        if (mat.bumpMap && typeof mat.bumpMap.dispose === "function") {
          mat.bumpMap.dispose()
        }
        if (mat.normalMap && typeof mat.normalMap.dispose === "function") {
          mat.normalMap.dispose()
        }
        if (mat.specularMap && typeof mat.specularMap.dispose === "function") {
          mat.specularMap.dispose()
        }
        if (mat.alphaMap && typeof mat.alphaMap.dispose === "function") {
          mat.alphaMap.dispose()
        }
        if (mat.roughnessMap && typeof mat.roughnessMap.dispose === "function") {
          mat.roughnessMap.dispose()
        }
        if (mat.metalnessMap && typeof mat.metalnessMap.dispose === "function") {
          mat.metalnessMap.dispose()
        }

        if (typeof mat.dispose === "function") {
          mat.dispose()
        }
      })
    }
  })

  // Sahnadan barcha bolalarni olib tashlash
  while (root.children && root.children.length > 0) {
    const child = root.children[0]
    root.remove(child)
  }
}
