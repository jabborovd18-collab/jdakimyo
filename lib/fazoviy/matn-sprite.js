// ═══════════════════════════════════════════════════════════════════════════
// 3D MATN SPRITE GENERATORI
// Yagona haqiqat manbai: app/oquv/fazoviy/* da atom va masofa yorliqlari
// ═══════════════════════════════════════════════════════════════════════════

import * as THREE from "three"

/**
 * Canvas orqali 3D matnli sprite yaratish
 * @param {string} text - Ko'rsatiladigan matn (masalan "Co³⁺", "N", "1.96 Å")
 * @param {object} [options={}] - Sozlamalar
 * @returns {THREE.Sprite}
 */
export function makeTextSprite(text, options = {}) {
  const {
    fontSize = 64,
    fontFamily = "Arial, sans-serif",
    color = "#ffffff",
    bgColor = "rgba(20, 10, 40, 0.85)",
    borderColor = "#a78bfa",
    borderWidth = 3,
    borderRadius = 12,
    padding = 16,
    scale = 0.5,
    renderOrder = 999
  } = options

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  ctx.font = `bold ${fontSize}px ${fontFamily}`
  const textWidth = ctx.measureText(text).width
  canvas.width = Math.ceil(textWidth + padding * 2)
  canvas.height = Math.ceil(fontSize + padding * 2)

  // Yumaloqlangan to'rtburchak fon chizish
  ctx.fillStyle = bgColor
  ctx.strokeStyle = borderColor
  ctx.lineWidth = borderWidth
  const r = Math.min(borderRadius, canvas.height / 2, canvas.width / 2)

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
  if (borderWidth > 0) {
    ctx.stroke()
  }

  // Matnni o'rtaga yozish
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
    depthWrite: false
  })

  const sprite = new THREE.Sprite(material)
  sprite.scale.set((canvas.width / fontSize) * scale, (canvas.height / fontSize) * scale, 1)
  sprite.renderOrder = renderOrder
  sprite.userData = { type: "sprite", text }

  return sprite
}
