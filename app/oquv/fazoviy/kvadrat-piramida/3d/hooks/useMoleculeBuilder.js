"use client"
import { useCallback } from "react"
import * as THREE from "three"
import { CPK, ATOM_INFO } from "../lib/constants"
import { makeTextSprite } from "../lib/helpers"

// ═══════════════════════════════════════════════════════════════════════════
// MOLEKULA QURUVCHI — TRIGONAL-PIRAMIDA GEOMETRIYA
// 3 ta ligand + 1 ta yolg'iz juft (lone pair)
// VSEPR nazariyasi: AX₃E₁ → trigonal-piramida (C₃ᵥ)
// ═══════════════════════════════════════════════════════════════════════════

export function useMoleculeBuilder({
  atomsRef,
  labelsRef,
  bondLabelsRef,
  bondsRef,
  ligandAtomsRef,
  moleculeGroupsRef,
  ligandGroupsRef,
  lonePairRef,
}) {
  // ═══════════════════════════════════════════════════════════
  // BOND YARATISH
  // ═══════════════════════════════════════════════════════════
  const createBond = useCallback(
    (parent, start, end, color = CPK.bond, radius = 0.08, opacity = 0.8) => {
      const direction = new THREE.Vector3().subVectors(end, start)
      const length = direction.length()
      const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
      const geometry = new THREE.CylinderGeometry(radius, radius, length, 16)
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.4,
        metalness: 0.2,
        transparent: true,
        opacity,
      })
      const bond = new THREE.Mesh(geometry, material)
      bond.position.copy(midpoint)
      bond.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.clone().normalize()
      )
      bond.userData = { type: "bond" }
      parent.add(bond)
      return bond
    },
    []
  )

  // ═══════════════════════════════════════════════════════════
  // YOLG'IZ JUFT (LONE PAIR) VIZUALIZATSIYASI
  // ═══════════════════════════════════════════════════════════
  const createLonePair = useCallback((parent, position, color = CPK.lonePair) => {
    const group = new THREE.Group()

    // Ikkita "bulut" — har biri elektron juftini ifodalaydi
    for (let i = 0; i < 2; i++) {
      const lobeGeo = new THREE.SphereGeometry(0.18, 24, 24)
      const lobeMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.7,
        emissive: color,
        emissiveIntensity: 0.4,
      })
      const lobe = new THREE.Mesh(lobeGeo, lobeMat)
      // Ikkita lobe yonma-yon
      const offset = i === 0 ? -0.12 : 0.12
      lobe.position.set(offset, 0, 0)
      group.add(lobe)
    }

    // "Bulut" effekti — glow
    const glowGeo = new THREE.SphereGeometry(0.35, 24, 24)
    const glowMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.15,
    })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    group.add(glow)

    group.position.copy(position)
    group.userData = { type: "lone-pair" }
    parent.add(group)

    if (lonePairRef) {
      lonePairRef.current.push(group)
    }

    return group
  }, [lonePairRef])

  // ═══════════════════════════════════════════════════════════
  // H LIGAND (Vodorod atomi)
  // ═══════════════════════════════════════════════════════════
  const createHLigand = useCallback(
    (parent, hPos) => {
      const group = new THREE.Group()
      group.userData = { type: "ligand", ligandType: "H", donorPos: hPos.clone() }

      const hGeo = new THREE.SphereGeometry(0.18, 32, 32)
      const hMat = new THREE.MeshStandardMaterial({
        color: CPK.H,
        roughness: 0.5,
        metalness: 0.1,
        emissive: 0xffffff,
        emissiveIntensity: 0.05,
      })
      const hMesh = new THREE.Mesh(hGeo, hMat)
      hMesh.position.copy(hPos)
      hMesh.userData = { type: "atom", element: "H", info: ATOM_INFO.H, isDonor: true }
      hMesh.castShadow = true
      group.add(hMesh)
      atomsRef.current.push(hMesh)
      ligandAtomsRef.current.push(hMesh)

      const hLabel = makeTextSprite("H", { color: "#e5e7eb", scale: 0.3 })
      hLabel.position.copy(hPos).add(new THREE.Vector3(0, 0.3, 0))
      group.add(hLabel)
      labelsRef.current.push(hLabel)

      parent.add(group)
      return group
    },
    [atomsRef, labelsRef, ligandAtomsRef]
  )

  // ═══════════════════════════════════════════════════════════
  // F LIGAND (Ftor atomi)
  // ═══════════════════════════════════════════════════════════
  const createFLigand = useCallback(
    (parent, fPos) => {
      const group = new THREE.Group()
      group.userData = { type: "ligand", ligandType: "F", donorPos: fPos.clone() }

      const fGeo = new THREE.SphereGeometry(0.25, 32, 32)
      const fMat = new THREE.MeshStandardMaterial({
        color: CPK.F,
        roughness: 0.35,
        metalness: 0.15,
        emissive: CPK.F,
        emissiveIntensity: 0.08,
      })
      const fMesh = new THREE.Mesh(fGeo, fMat)
      fMesh.position.copy(fPos)
      fMesh.userData = { type: "atom", element: "F", info: ATOM_INFO.F, isDonor: true }
      fMesh.castShadow = true
      group.add(fMesh)
      atomsRef.current.push(fMesh)
      ligandAtomsRef.current.push(fMesh)

      const fLabel = makeTextSprite("F", { color: "#d1fae5", scale: 0.32 })
      fLabel.position.copy(fPos).add(new THREE.Vector3(0, 0.38, 0))
      group.add(fLabel)
      labelsRef.current.push(fLabel)

      parent.add(group)
      return group
    },
    [atomsRef, labelsRef, ligandAtomsRef]
  )

  // ═══════════════════════════════════════════════════════════
  // Cl LIGAND (Xlor atomi)
  // ═══════════════════════════════════════════════════════════
  const createClLigand = useCallback(
    (parent, clPos) => {
      const group = new THREE.Group()
      group.userData = { type: "ligand", ligandType: "Cl", donorPos: clPos.clone() }

      const clGeo = new THREE.SphereGeometry(0.35, 48, 48)
      const clMat = new THREE.MeshStandardMaterial({
        color: CPK.Cl,
        roughness: 0.35,
        metalness: 0.15,
        emissive: CPK.Cl,
        emissiveIntensity: 0.08,
      })
      const clMesh = new THREE.Mesh(clGeo, clMat)
      clMesh.position.copy(clPos)
      clMesh.userData = { type: "atom", element: "Cl", info: ATOM_INFO.Cl, isDonor: true }
      clMesh.castShadow = true
      group.add(clMesh)
      atomsRef.current.push(clMesh)
      ligandAtomsRef.current.push(clMesh)

      const clLabel = makeTextSprite("Cl", { color: "#86efac", scale: 0.35 })
      clLabel.position.copy(clPos).add(new THREE.Vector3(0, 0.5, 0))
      group.add(clLabel)
      labelsRef.current.push(clLabel)

      parent.add(group)
      return group
    },
    [atomsRef, labelsRef, ligandAtomsRef]
  )

  // ═══════════════════════════════════════════════════════════
  // BITTA MOLEKULA YARATISH — TRIGONAL-PIRAMIDA
  // ═══════════════════════════════════════════════════════════
  const buildSingleMolecule = useCallback(
    (parent, complexData, centerPos = new THREE.Vector3(0, 0, 0), scale = 1) => {
      const molGroup = new THREE.Group()
      molGroup.position.copy(centerPos)
      molGroup.scale.setScalar(scale)
      molGroup.userData = { type: "molecule", baseScale: scale }

      const center = complexData.center
      const localLigandGroups = []

      // ═══ MARKAZIY ATOM ═══
      const coGeo = new THREE.SphereGeometry(center.radius, 64, 64)
      const coMat = new THREE.MeshStandardMaterial({
        color: center.color,
        roughness: 0.15,
        metalness: 0.85,
        emissive: center.color,
        emissiveIntensity: 0.15,
      })
      const coAtom = new THREE.Mesh(coGeo, coMat)
      coAtom.castShadow = true
      coAtom.userData = {
        type: "atom",
        element: center.element,
        info: ATOM_INFO[center.element],
        isCenter: true,
      }
      molGroup.add(coAtom)
      atomsRef.current.push(coAtom)

      // Markaziy atom yorlig'i
      const centerLabel = makeTextSprite(`${center.element}`, {
        color: "#ffffff",
        bgColor: `rgba(${(center.color >> 16) & 255}, ${(center.color >> 8) & 255}, ${center.color & 255}, 0.9)`,
        borderColor: "#ffffff",
        scale: 0.5,
      })
      centerLabel.position.set(0, center.radius + 0.5, 0)
      molGroup.add(centerLabel)
      labelsRef.current.push(centerLabel)

      // Glow effect
      const coGlow = new THREE.Mesh(
        new THREE.SphereGeometry(center.radius * 1.3, 32, 32),
        new THREE.MeshBasicMaterial({ color: center.color, transparent: true, opacity: 0.15 })
      )
      molGroup.add(coGlow)
      coAtom.userData.glow = coGlow

      // ═══ TRIGONAL-PIRAMIDA POZITSIYALARI ═══
      // VSEPR: AX₃E₁ → trigonal-piramida
      // bondAngle = complexData.bondAngle (107.3° NH₃, 102.5° NF₃, 100.3° PCl₃)
      const d = complexData.bondLength
      const bondAngleRad = (complexData.bondAngle * Math.PI) / 180

      // sp³ gibridlanish — 109.5° ideal, lekin lone pair tufayli kichrayadi
      // Ligandlar "pastga" (y o'qining -tomonga), lone pair "yuqoriga"
      // Har bir ligand va markaz orasidagi burchak:
      //   cos(θ) = -1/3 (ideal sp³ uchun, θ = 109.5°)
      //   Real burchak = complexData.bondAngle

      const coPos = new THREE.Vector3(0, 0, 0)
      const ligandVectors = []

      // Burchak hisoblash:
      // Ligand va y-o'q (yuqoriga) orasidagi burchak:
      // θ_ligand = bondAngle / 2 (chunki ligandlar "pastga" joylashgan)
      // Aniqrog'i: sp³ uchun ligand va lone pair orasidagi burchak ~109.5°
      // Ligandlar pastga (y = -cos(109.5°/2) * d), radius pastda

      // Oddiy yondashuv: ligandlar 3 ta, 120° oraliqda, y = -d * cos(α)
      // α = 180° - bondAngle (lone pair bilan burchak)
      // Aslida: ligand pastda, lone pair tepada
      // cos(bondAngle) = v1·v2/(|v1||v2|)
      // Agar ligandlar bir xil balandlikda va bir xil radiusda bo'lsa:
      //   cos(bondAngle) = y² + r²·cos(120°) / d²
      //   cos(bondAngle) = y²/d² - r²/(2d²)
      //   y² + r² = d²
      //   cos(bondAngle) = (y² - (d²-y²)/2) / d² = (3y² - d²) / (2d²)
      //   y² = d² · (2cos(bondAngle) + 1) / 3
      const cosAngle = Math.cos(bondAngleRad)
      const yLigand = -d * Math.sqrt((2 * cosAngle + 1) / 3)
      const rLigand = Math.sqrt(d * d - yLigand * yLigand)

      // 3 ta ligand pozitsiyasi (120° oraliqda, y o'qida pastda)
      for (let i = 0; i < 3; i++) {
        const phi = (i * 2 * Math.PI) / 3
        const x = rLigand * Math.cos(phi)
        const z = rLigand * Math.sin(phi)
        const donorPos = new THREE.Vector3(x, yLigand, z)
        ligandVectors.push(donorPos)

        // Metal-ligand bog'
        const bond = createBond(molGroup, coPos, donorPos, CPK.bond, 0.09)
        bond.userData = {
          type: "bond",
          bondType: `${center.element}-${complexData.ligand.donor}`,
          length: complexData.bondLengthReal,
          ligandIdx: i,
        }
        bondsRef.current.push(bond)

        // Bog' uzunligi yorlig'i
        const midpoint = new THREE.Vector3().addVectors(coPos, donorPos).multiplyScalar(0.5)
        const lengthLabel = makeTextSprite(complexData.bondLengthReal, {
          color: "#fef3c7",
          bgColor: "rgba(120, 53, 15, 0.9)",
          borderColor: "#fbbf24",
          fontSize: 48,
          scale: 0.35,
        })
        lengthLabel.position.copy(midpoint).add(new THREE.Vector3(0.15, 0.15, 0))
        lengthLabel.visible = false
        molGroup.add(lengthLabel)
        bondLabelsRef.current.push(lengthLabel)

        // Ligand yaratish
        let ligGroup = null
        if (complexData.ligand.type === "H") {
          ligGroup = createHLigand(molGroup, donorPos)
        } else if (complexData.ligand.type === "F") {
          ligGroup = createFLigand(molGroup, donorPos)
        } else if (complexData.ligand.type === "Cl") {
          ligGroup = createClLigand(molGroup, donorPos)
        }

        if (ligGroup) {
          ligGroup.userData.ligandIdx = i
          ligGroup.userData.bond = bond
          ligGroup.userData.originalPos = donorPos.clone()
          ligGroup.userData.coPos = coPos.clone()
          localLigandGroups.push(ligGroup)
        }
      }

      // ═══ YOLG'IZ JUFT (LONE PAIR) ═══
      if (complexData.lonePairs > 0) {
        // Lone pair yuqorida (y o'qi bo'ylab, ligandlarning aks tomonida)
        // VSEPR: lone pair ko'proq joy egallaydi, ligandlarni pastga bosadi
        const lonePairHeight = d * 0.95
        const lonePairPos = new THREE.Vector3(0, lonePairHeight, 0)
        createLonePair(molGroup, lonePairPos, CPK.lonePair)

        // Lone pair yorlig'i
        const lpLabel = makeTextSprite("yolg'iz juft", {
          color: "#fef9c3",
          bgColor: "rgba(161, 98, 7, 0.9)",
          borderColor: "#facc15",
          fontSize: 40,
          scale: 0.4,
        })
        lpLabel.position.set(0, lonePairHeight + 0.5, 0)
        molGroup.add(lpLabel)
        labelsRef.current.push(lpLabel)
      }

      // ═══ OKTAEDRIK QIRRALAR (faqat trigonal-piramida uchun emas) ═══
      // Asos uchburchagi — ligandlar orasidagi chiziqlar
      if (localLigandGroups.length === 3) {
        const edgeMaterial = new THREE.LineDashedMaterial({
          color: 0x8b5cf6,
          dashSize: 0.15,
          gapSize: 0.1,
          transparent: true,
          opacity: 0.4,
        })
        for (let i = 0; i < 3; i++) {
          const j = (i + 1) % 3
          const geometry = new THREE.BufferGeometry().setFromPoints([
            ligandVectors[i],
            ligandVectors[j],
          ])
          const line = new THREE.Line(geometry, edgeMaterial.clone())
          line.computeLineDistances()
          line.userData = { type: "edge" }
          molGroup.add(line)
        }
      }

      molGroup.userData.coAtom = coAtom
      molGroup.userData.ligandGroups = localLigandGroups
      molGroup.userData.ligandVectors = ligandVectors
      parent.add(molGroup)
      return molGroup
    },
    [createBond, createHLigand, createFLigand, createClLigand, createLonePair,
     atomsRef, labelsRef, bondLabelsRef, bondsRef, ligandAtomsRef]
  )

  // ═══════════════════════════════════════════════════════════
  // ANSAMBL QURISH (1, 8 yoki 27 ta molekula)
  // ═══════════════════════════════════════════════════════════
  const buildEnsemble = useCallback(
    (scene, complexData, positions, mode) => {
      atomsRef.current = []
      labelsRef.current = []
      bondLabelsRef.current = []
      bondsRef.current = []
      ligandAtomsRef.current = []
      moleculeGroupsRef.current = []
      ligandGroupsRef.current = []
      if (lonePairRef) lonePairRef.current = []

      const moleculeScale = positions.length === 1 ? 1 : positions.length === 8 ? 0.7 : 0.5

      positions.forEach((pos) => {
        const molGroup = buildSingleMolecule(scene, complexData, pos, moleculeScale)
        moleculeGroupsRef.current.push(molGroup)
        if (molGroup.userData.ligandGroups) {
          ligandGroupsRef.current.push(...molGroup.userData.ligandGroups)
        }
      })
    },
    [buildSingleMolecule, atomsRef, labelsRef, bondLabelsRef, bondsRef,
     ligandAtomsRef, moleculeGroupsRef, ligandGroupsRef, lonePairRef]
  )

  // ═══════════════════════════════════════════════════════════
  // BURCHAKLARNI HISOBLASH
  // ═══════════════════════════════════════════════════════════
  const computeAllAngles = useCallback(() => {
    const mol = moleculeGroupsRef.current[0]
    if (!mol || !mol.userData.ligandVectors) return []
    const vecs = mol.userData.ligandVectors
    const angles = []
    for (let i = 0; i < vecs.length; i++) {
      for (let j = i + 1; j < vecs.length; j++) {
        const v1 = vecs[i].clone().normalize()
        const v2 = vecs[j].clone().normalize()
        const angle = Math.acos(Math.max(-1, Math.min(1, v1.dot(v2)))) * (180 / Math.PI)
        angles.push({
          pair: `L${i + 1}-M-L${j + 1}`,
          angle: angle.toFixed(1),
        })
      }
    }
    return angles
  }, [moleculeGroupsRef])

  return {
    createBond,
    createLonePair,
    createHLigand,
    createFLigand,
    createClLigand,
    buildSingleMolecule,
    buildEnsemble,
    computeAllAngles,
  }
}