// ═══════════════════════════════════════════════════════════════════════════
// MOLEKULALAR ANSAMBLI POZITSIYALARI
// Yagona haqiqat manbai: app/oquv/fazoviy/* da ko'p molekulali rejim
// ═══════════════════════════════════════════════════════════════════════════

import * as THREE from "three"

/**
 * N ta molekula uchun fazoviy markaz pozitsiyalarini hisoblash
 * @param {number} count - Molekulalar soni (1, 8 yoki 27)
 * @param {"crystal"|"solution"} mode - Kristall panjara yoki erkin eritma klasteri
 * @param {number} [spacing=7] - Panjara qadami
 * @returns {THREE.Vector3[]}
 */
export function getEnsemblePositions(count, mode = "crystal", spacing = 7) {
  const positions = []
  if (count <= 1) {
    positions.push(new THREE.Vector3(0, 0, 0))
    return positions
  }

  if (mode === "crystal") {
    // Kristall panjara: 8 ta (2x2x2) yoki 27 ta (3x3x3)
    const n = count === 8 ? 2 : 3
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
    // Eritma / tartibsiz klaster: Fibonachchi sferik taqsimoti bo'yicha
    const radius = count === 8 ? 6 : 9
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      // Deterministik psevdo-tasodifiy radius o'zgarishi
      const r = radius * (0.6 + (((i * 9301 + 49297) % 233280) / 233280) * 0.4)
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
