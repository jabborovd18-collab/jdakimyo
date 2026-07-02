"use client"
import { useEffect, useCallback, useRef } from "react"
import * as THREE from "three"
import { CPK } from "../lib/constants"

// ═══════════════════════════════════════════════════════════════════════════
// SCENE EFFEKTLARI — TRIGONAL-PIRAMIDA UCHUN
// Temperatura, Bosim, Tebranish, Simmetriya, Solvatatsiya, H-bog'lar
// ═══════════════════════════════════════════════════════════════════════════

export function useSceneEffects({
  sceneRef,
  moleculeGroupsRef,
  atomsRef,
  ligandGroupsRef,
  solventMoleculesRef,
  hBondsRef,
  labelsRef,
  bondLabelsRef,
  bondsRef,
  lonePairRef,
  animationStateRef,
  clockRef,
  // State values
  showTemperature,
  temperature,
  showSolvation,
  solventType,
  solvationDensity,
  showHydrogenBonds,
  showPressure,
  pressure,
  showVibration,
  vibrationMode,
  showOuterSphere,
  showLabels,
  showBondLengths,
  viewMode,
  showSymmetry,
  symmetryElement,
  moleculeCount,
  complex,
  autoRotate,
  controlsRef,
  isAnimating,
}) {
  const symmetryHelpersRef = useRef([])
  const animationFrameRef = useRef(null)

  // ═══════════════════════════════════════════════════════════
  // ERITUVCHI MOLEKULALARI
  // ═══════════════════════════════════════════════════════════
  const createSolventMolecules = useCallback(
    (scene, count, solvent) => {
      solventMoleculesRef.current.forEach((mol) => {
        scene.remove(mol)
        mol.traverse((child) => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) child.material.dispose()
        })
      })
      solventMoleculesRef.current = []

      const minDist = 3.5
      const maxDist = 8

      for (let i = 0; i < count; i++) {
        const theta = (i * 137.5 * Math.PI) / 180
        const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
        const r = minDist + ((i % 5) / 5) * (maxDist - minDist)
        const x = r * Math.sin(phi) * Math.cos(theta)
        const y = r * Math.sin(phi) * Math.sin(theta)
        const z = r * Math.cos(phi)

        const solventGroup = new THREE.Group()
        solventGroup.position.set(x, y, z)
        solventGroup.userData = {
          type: "solvent",
          basePos: new THREE.Vector3(x, y, z),
          phase: (i * 0.7) % (Math.PI * 2),
        }

        if (solvent === "water") {
          const oGeo = new THREE.SphereGeometry(0.18, 16, 16)
          const oMat = new THREE.MeshStandardMaterial({
            color: CPK.O || 0xff0d0d,
            roughness: 0.5,
            transparent: true,
            opacity: 0.55,
          })
          const oMesh = new THREE.Mesh(oGeo, oMat)
          solventGroup.add(oMesh)

          for (let j = 0; j < 2; j++) {
            const hGeo = new THREE.SphereGeometry(0.09, 12, 12)
            const hMat = new THREE.MeshStandardMaterial({
              color: CPK.H,
              transparent: true,
              opacity: 0.5,
            })
            const hMesh = new THREE.Mesh(hGeo, hMat)
            const sign = j === 0 ? 1 : -1
            hMesh.position.set(sign * 0.2, -0.15, 0)
            solventGroup.add(hMesh)
          }
        }

        scene.add(solventGroup)
        solventMoleculesRef.current.push(solventGroup)
      }
    },
    [solventMoleculesRef]
  )

  // ═══════════════════════════════════════════════════════════
  // H-BOG'LAR
  // ═══════════════════════════════════════════════════════════
  const createHBonds = useCallback(
    (scene) => {
      hBondsRef.current.forEach((b) => {
        scene.remove(b)
        if (b.geometry) b.geometry.dispose()
        if (b.material) b.material.dispose()
      })
      hBondsRef.current = []

      if (!showHydrogenBonds || !showSolvation) return

      moleculeGroupsRef.current.forEach((mol) => {
        const molWorldPos = new THREE.Vector3()
        mol.getWorldPosition(molWorldPos)
        solventMoleculesRef.current.forEach((sol) => {
          const dist = sol.position.distanceTo(molWorldPos)
          if (dist > 3 && dist < 5) {
            const geometry = new THREE.BufferGeometry().setFromPoints([
              molWorldPos,
              sol.position,
            ])
            const material = new THREE.LineDashedMaterial({
              color: CPK.hbond,
              dashSize: 0.15,
              gapSize: 0.1,
              transparent: true,
              opacity: 0.5,
            })
            const line = new THREE.Line(geometry, material)
            line.computeLineDistances()
            scene.add(line)
            hBondsRef.current.push(line)
          }
        })
      })
    },
    [showHydrogenBonds, showSolvation, moleculeGroupsRef, solventMoleculesRef, hBondsRef]
  )

  // ═══════════════════════════════════════════════════════════
  // ANIMATSIYA LOOP (tebranish, temperatura, solvatatsiya)
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const animate = () => {
      if (!clockRef.current) return
      const elapsed = clockRef.current.getElapsedTime()

      // Temperatura effekti
      if (showTemperature) {
        const amplitude = (temperature / 298) * 0.08
        atomsRef.current.forEach((atom, i) => {
          if (!atom.userData.isCenter && atom.userData.type === "atom") {
            if (!animationStateRef.current.originalPositions.has(atom.uuid)) {
              animationStateRef.current.originalPositions.set(atom.uuid, atom.position.clone())
            }
            const orig = animationStateRef.current.originalPositions.get(atom.uuid)
            const wobbleX = Math.sin(elapsed * 4 + i * 0.7) * amplitude
            const wobbleY = Math.cos(elapsed * 3.5 + i * 1.1) * amplitude
            const wobbleZ = Math.sin(elapsed * 4.5 + i * 0.5) * amplitude
            atom.position.x = orig.x + wobbleX
            atom.position.y = orig.y + wobbleY
            atom.position.z = orig.z + wobbleZ
          }
        })
      } else {
        animationStateRef.current.originalPositions.forEach((orig, uuid) => {
          const atom = atomsRef.current.find((a) => a.uuid === uuid)
          if (atom && !atom.userData.isCenter) {
            atom.position.lerp(orig, 0.15)
          }
        })
      }

      // Solvatatsiya harakati
      if (showSolvation) {
        solventMoleculesRef.current.forEach((mol) => {
          if (mol.userData.basePos) {
            const phase = mol.userData.phase
            mol.position.x = mol.userData.basePos.x + Math.sin(elapsed * 1.2 + phase) * 0.2
            mol.position.y = mol.userData.basePos.y + Math.cos(elapsed * 1.5 + phase) * 0.2
            mol.position.z = mol.userData.basePos.z + Math.sin(elapsed * 1.8 + phase) * 0.2
          }
        })
      }

      // Tebranish rejimlari (vibration modes)
      if (showVibration && moleculeGroupsRef.current[0]) {
        const mol = moleculeGroupsRef.current[0]
        if (mol.userData.ligandGroups) {
          const t = elapsed * 4
          mol.userData.ligandGroups.forEach((lg, idx) => {
            if (!lg.userData.originalPos) return
            const dir = lg.userData.originalPos.clone().normalize()
            let amplitude = 0

            if (vibrationMode === "sym_stretch") {
              amplitude = Math.sin(t) * 0.15
            } else if (vibrationMode === "asym_stretch") {
              amplitude = Math.sin(t + idx * (2 * Math.PI / 3)) * 0.2
            } else if (vibrationMode === "bend") {
              // Egilish — perpendikulyar harakat (C₃ᵥ simmetriyasi uchun)
              const perpDir = new THREE.Vector3(
                Math.sin(t + idx * (2 * Math.PI / 3)) * 0.15,
                0,
                Math.cos(t + idx * (2 * Math.PI / 3)) * 0.15
              )
              lg.position.copy(lg.userData.originalPos).add(perpDir)
              return
            }

            const newPos = lg.userData.originalPos.clone().addScaledVector(dir, amplitude)
            lg.position.copy(newPos)
          })

          // Lone pair ham tebranadi (agar bor bo'lsa)
          if (lonePairRef.current && lonePairRef.current.length > 0) {
            lonePairRef.current.forEach((lp) => {
              lp.position.y += Math.sin(elapsed * 2) * 0.02
            })
          }
        }
      } else if (!showVibration) {
        moleculeGroupsRef.current.forEach((mol) => {
          if (mol.userData.ligandGroups) {
            mol.userData.ligandGroups.forEach((lg) => {
              if (lg.userData.originalPos) {
                lg.position.lerp(lg.userData.originalPos, 0.15)
              }
            })
          }
        })
      }

      // Markaziy atom glow
      atomsRef.current.forEach((atom) => {
        if (atom.userData.isCenter && atom.userData.glow) {
          atom.userData.glow.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.05)
        }
      })

      // Lone pair glow (trigonal-piramida uchun xos)
      if (lonePairRef.current) {
        lonePairRef.current.forEach((lp) => {
          lp.children.forEach((child, i) => {
            if (child.material && child.material.opacity !== undefined) {
              if (i < 2) {
                // Ikkita lobe
                child.material.opacity = 0.5 + Math.sin(elapsed * 3 + i * 0.5) * 0.2
              }
            }
          })
        })
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [
    showTemperature, temperature, showSolvation, showVibration,
    vibrationMode, sceneRef, clockRef, atomsRef, moleculeGroupsRef,
    solventMoleculesRef, animationStateRef, lonePairRef,
  ])

  // ═══════════════════════════════════════════════════════════
  // ERITUVCHI UPDATE
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    if (showSolvation) {
      createSolventMolecules(scene, solvationDensity, solventType)
    } else {
      solventMoleculesRef.current.forEach((mol) => {
        scene.remove(mol)
        mol.traverse((child) => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) child.material.dispose()
        })
      })
      solventMoleculesRef.current = []

      hBondsRef.current.forEach((b) => {
        scene.remove(b)
        if (b.geometry) b.geometry.dispose()
        if (b.material) b.material.dispose()
      })
      hBondsRef.current = []
    }
  }, [showSolvation, solvationDensity, solventType, createSolventMolecules, sceneRef, solventMoleculesRef, hBondsRef])

  // ═══════════════════════════════════════════════════════════
  // H-BOG'LAR UPDATE
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    createHBonds(scene)
  }, [showHydrogenBonds, showSolvation, solvationDensity, createHBonds, sceneRef])

  // ═══════════════════════════════════════════════════════════
  // BOSIM EFFEKTI
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const compression = showPressure
      ? 1 - Math.log10(Math.max(pressure, 1)) * 0.02
      : 1
    moleculeGroupsRef.current.forEach((mol) => {
      const baseScale = mol.userData.baseScale || 1
      mol.scale.setScalar(baseScale * compression)
    })
  }, [showPressure, pressure, moleculeGroupsRef])

  // ═══════════════════════════════════════════════════════════
  // TASHQI SFERA KO'RINIShI
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    // Trigonal-piramida uchun tashqi sfera odatda yo'q (neytral molekula)
    // Bu faqat kompleks tuzlarda bo'ladi
  }, [showOuterSphere])

  // ═══════════════════════════════════════════════════════════
  // YORLIQLAR KO'RINIShI
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    labelsRef.current.forEach((label) => {
      label.visible = showLabels
    })
  }, [showLabels, labelsRef])

  // ═══════════════════════════════════════════════════════════
  // BOG' UZUNLIKLARI KO'RINIShI
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    bondLabelsRef.current.forEach((label) => {
      label.visible = showBondLengths
    })
  }, [showBondLengths, bondLabelsRef])

  // ═══════════════════════════════════════════════════════════
  // KO'RINISH REJIMI (ball-stick / space-filling / wireframe)
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    atomsRef.current.forEach((atom) => {
      if (!atom.material) return
      const el = atom.userData.element
      if (viewMode === "space-filling") {
        const vdwScales = {
          N: 2.0, P: 2.2, As: 2.3,
          H: 1.6, F: 1.8, Cl: 2.3,
        }
        atom.scale.setScalar(vdwScales[el] || 1.5)
        atom.material.opacity = 0.85
        atom.material.transparent = true
      } else if (viewMode === "wireframe") {
        atom.scale.setScalar(1)
        atom.material.wireframe = true
        atom.material.opacity = 1
        atom.material.transparent = false
      } else {
        // ball-stick
        atom.scale.setScalar(1)
        atom.material.wireframe = false
        atom.material.opacity = 1
        atom.material.transparent = false
      }
    })
    bondsRef.current.forEach((bond) => {
      bond.visible = viewMode !== "space-filling"
    })
  }, [viewMode, atomsRef, bondsRef])

  // ═══════════════════════════════════════════════════════════
  // AUTO ROTATE
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = autoRotate
  }, [autoRotate, controlsRef])

  // ═══════════════════════════════════════════════════════════
  // SIMMETRIYA ELEMENTLARI (C₃ᵥ uchun)
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    // Tozalash
    symmetryHelpersRef.current.forEach((h) => {
      scene.remove(h)
      if (h.geometry) h.geometry.dispose()
      if (h.material) h.material.dispose()
    })
    symmetryHelpersRef.current = []

    if (!showSymmetry || moleculeCount !== 1) return

    const len = 4

    if (symmetryElement === "C3") {
      // C₃ o'qi — y o'qi bo'ylab (lone pair va asos markazidan)
      const points = [
        new THREE.Vector3(0, -len, 0),
        new THREE.Vector3(0, len, 0),
      ]
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color: 0xff4444,
        linewidth: 2,
        transparent: true,
        opacity: 0.8,
      })
      const line = new THREE.Line(geometry, material)
      line.userData = { type: "symmetry" }
      scene.add(line)
      symmetryHelpersRef.current.push(line)

      // Yorliq
      const label = makeTextSprite("C₃", {
        color: "#ffffff",
        bgColor: "rgba(239, 68, 68, 0.85)",
        borderColor: "#ffffff",
        scale: 0.4,
      })
      label.position.set(0, len + 0.5, 0)
      label.userData = { type: "symmetry" }
      scene.add(label)
      symmetryHelpersRef.current.push(label)
    } else if (symmetryElement === "sigma_v") {
      // 3 ta σᵥ tekislik — C₃ o'qi orqali, har bir liganddan o'tadi
      for (let i = 0; i < 3; i++) {
        const phi = (i * 2 * Math.PI) / 3
        const planeGeo = new THREE.PlaneGeometry(len * 2, len * 2)
        const planeMat = new THREE.MeshBasicMaterial({
          color: 0xff44ff,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
        })
        const plane = new THREE.Mesh(planeGeo, planeMat)
        // Tekislik y o'qi bo'ylab, phi burchakda
        plane.rotation.y = phi
        plane.userData = { type: "symmetry" }
        scene.add(plane)
        symmetryHelpersRef.current.push(plane)
      }

      const label = makeTextSprite("3σᵥ", {
        color: "#ffffff",
        bgColor: "rgba(236, 72, 153, 0.85)",
        borderColor: "#ffffff",
        scale: 0.4,
      })
      label.position.set(len + 0.5, 0, 0)
      label.userData = { type: "symmetry" }
      scene.add(label)
      symmetryHelpersRef.current.push(label)
    }
  }, [showSymmetry, symmetryElement, moleculeCount, sceneRef])

  return {
    createSolventMolecules,
    createHBonds,
    symmetryHelpersRef,
  }
}