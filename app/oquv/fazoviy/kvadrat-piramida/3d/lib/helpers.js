import * as THREE from "three"

// ═══════════════════════════════════════════════════════════════════════════
// MATN TOZALAGICH
// ═══════════════════════════════════════════════════════════════════════════
export function cleanText(str) {
  if (str === null || str === undefined) return ""
  return String(str)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
}

// ═══════════════════════════════════════════════════════════════════════════
// 3D MATN SPRITE
// ═══════════════════════════════════════════════════════════════════════════
export function makeTextSprite(text, options = {}) {
  const {
    fontSize = 64,
    fontFamily = "Arial, sans-serif",
    color = "#ffffff",
    bgColor = "rgba(20, 10, 40, 0.85)",
    borderColor = "#a78bfa",
    padding = 16,
    scale = 0.5,
  } = options

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  const textWidth = ctx.measureText(text).width
  canvas.width = textWidth + padding * 2
  canvas.height = fontSize + padding * 2

  // Fon
  ctx.fillStyle = bgColor
  ctx.strokeStyle = borderColor
  ctx.lineWidth = 3
  const r = 12
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.lineTo(canvas.width - r, 0)
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r)
  ctx.lineTo(canvas.width, canvas.height - r)
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height)
  ctx.lineTo(r, canvas.height)
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Matn
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  ctx.fillStyle = color
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(
    (canvas.width / fontSize) * scale,
    (canvas.height / fontSize) * scale,
    1
  )
  sprite.renderOrder = 999
  return sprite
}

// ═══════════════════════════════════════════════════════════════════════════
// ENSEMBLE POZITSIYALARI (ANSAMBL JOYLASHUVLARI)
// 1, 8 yoki 27 ta molekulani 3D fazoda joylashtirish
// ═══════════════════════════════════════════════════════════════════════════
export function getEnsemblePositions(count, mode) {
  const positions = []

  // Bitta molekula — markazda
  if (count === 1) {
    positions.push(new THREE.Vector3(0, 0, 0))
    return positions
  }

  if (mode === "crystal") {
    // Kristall panjara — kub shaklida (2x2x2=8 yoki 3x3x3=27)
    const n = count === 8 ? 2 : 3
    const spacing = 7
    const offset = ((n - 1) * spacing) / 2
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          positions.push(
            new THREE.Vector3(
              i * spacing - offset,
              j * spacing - offset,
              k * spacing - offset
            )
          )
        }
      }
    }
  } else {
    // Eritma (solution) — sfera ichida tasodifiy joylashuv (Fibonacci spiral)
    const radius = count === 8 ? 6 : 9
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r =
        radius * (0.6 + (((i * 9301 + 49297) % 233280) / 233280) * 0.4)
      positions.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        )
      )
    }
  }

  return positions
}