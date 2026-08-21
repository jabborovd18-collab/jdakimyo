// ═══════════════════════════════════════════════════════════════════════════
// LIGANDLAR VA BOG'LAR GENERATORI
// Yagona haqiqat manbai: app/oquv/fazoviy/* barcha 3D modellar uchun
// ═══════════════════════════════════════════════════════════════════════════

import * as THREE from "three"
import { CPK } from "./cpk.js"
import { ATOM_INFO, getAtomInfo } from "./atom-malumot.js"
import { makeTextSprite } from "./matn-sprite.js"

/**
 * Ikki nuqta o'rtasida silindrsimon kimyoviy bog' yasash
 */
export function createBond(
  parent,
  start,
  end,
  color = CPK.bond,
  radius = 0.08,
  opacity = 0.7,
  userData = {}
) {
  const direction = new THREE.Vector3().subVectors(end, start)
  const length = direction.length()
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)

  const geometry = new THREE.CylinderGeometry(radius, radius, length, 16)
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.4,
    metalness: 0.2,
    transparent: opacity < 1.0,
    opacity
  })

  const bond = new THREE.Mesh(geometry, material)
  bond.position.copy(midpoint)
  bond.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  )
  bond.userData = { type: "bond", ...userData }
  parent.add(bond)
  return bond
}

/**
 * NH₃ Ammin ligandi
 */
export function createNH3Ligand(parent, nPos, centerPos, refs = {}) {
  const { atomsRef, labelsRef, bondsRef, ligandAtomsRef } = refs
  const group = new THREE.Group()
  group.userData = { type: "ligand", ligandType: "NH3", donorPos: nPos.clone() }

  // Azot atomi
  const nGeo = new THREE.SphereGeometry(0.30, 36, 36)
  const nMat = new THREE.MeshStandardMaterial({
    color: CPK.N,
    roughness: 0.35,
    metalness: 0.15,
    emissive: CPK.N,
    emissiveIntensity: 0.05
  })
  const nMesh = new THREE.Mesh(nGeo, nMat)
  nMesh.position.copy(nPos)
  nMesh.userData = { type: "atom", element: "N", info: ATOM_INFO.N, isDonor: true }
  nMesh.castShadow = true
  group.add(nMesh)
  if (atomsRef?.current) atomsRef.current.push(nMesh)
  if (ligandAtomsRef?.current) ligandAtomsRef.current.push(nMesh)

  // N yorlig'i
  const nLabel = makeTextSprite("N", { color: "#bfdbfe", scale: 0.35 })
  nLabel.position.copy(nPos).add(new THREE.Vector3(0, 0.4, 0))
  group.add(nLabel)
  if (labelsRef?.current) labelsRef.current.push(nLabel)

  // Vodorod atomlarini tashqariga qarata yo'naltirish (trigonal piramida)
  const nToCenter = new THREE.Vector3().subVectors(centerPos, nPos).normalize()
  const outDir = nToCenter.clone().negate()

  let perp1 = new THREE.Vector3()
  if (Math.abs(nToCenter.y) < 0.9) {
    perp1.crossVectors(nToCenter, new THREE.Vector3(0, 1, 0)).normalize()
  } else {
    perp1.crossVectors(nToCenter, new THREE.Vector3(1, 0, 0)).normalize()
  }
  const perp2 = new THREE.Vector3().crossVectors(nToCenter, perp1).normalize()

  const hnhAngle = (107 * Math.PI) / 180
  const alpha = Math.PI - Math.acos(Math.sqrt((Math.cos(hnhAngle) + 0.5) / 1.5))

  for (let i = 0; i < 3; i++) {
    const phi = (i * 2 * Math.PI) / 3 + Math.PI / 6
    const hDir = new THREE.Vector3()
      .addScaledVector(outDir, Math.cos(alpha))
      .addScaledVector(perp1, Math.sin(alpha) * Math.cos(phi))
      .addScaledVector(perp2, Math.sin(alpha) * Math.sin(phi))
      .normalize()

    const hPos = new THREE.Vector3().copy(nPos).addScaledVector(hDir, 0.55)

    const hGeo = new THREE.SphereGeometry(0.15, 20, 20)
    const hMat = new THREE.MeshStandardMaterial({
      color: CPK.H,
      roughness: 0.6,
      metalness: 0.05,
      emissive: 0xffffff,
      emissiveIntensity: 0.02
    })
    const hMesh = new THREE.Mesh(hGeo, hMat)
    hMesh.position.copy(hPos)
    hMesh.userData = { type: "atom", element: "H", info: ATOM_INFO.H }
    hMesh.castShadow = true
    group.add(hMesh)
    if (atomsRef?.current) atomsRef.current.push(hMesh)

    const bond = createBond(group, nPos, hPos, 0xcccccc, 0.04, 0.7, {
      bondType: "N-H",
      length: "1.01 Å"
    })
    if (bondsRef?.current) bondsRef.current.push(bond)
  }

  parent.add(group)
  return group
}

/**
 * H₂O Akva ligandi
 */
export function createH2OLigand(parent, oPos, centerPos, refs = {}) {
  const { atomsRef, labelsRef, bondsRef, ligandAtomsRef } = refs
  const group = new THREE.Group()
  group.userData = { type: "ligand", ligandType: "H2O", donorPos: oPos.clone() }

  const oGeo = new THREE.SphereGeometry(0.32, 36, 36)
  const oMat = new THREE.MeshStandardMaterial({
    color: CPK.O,
    roughness: 0.35,
    metalness: 0.15,
    emissive: CPK.O,
    emissiveIntensity: 0.08
  })
  const oMesh = new THREE.Mesh(oGeo, oMat)
  oMesh.position.copy(oPos)
  oMesh.userData = { type: "atom", element: "O", info: ATOM_INFO.O, isDonor: true }
  oMesh.castShadow = true
  group.add(oMesh)
  if (atomsRef?.current) atomsRef.current.push(oMesh)
  if (ligandAtomsRef?.current) ligandAtomsRef.current.push(oMesh)

  const oLabel = makeTextSprite("O", { color: "#fecaca", scale: 0.35 })
  oLabel.position.copy(oPos).add(new THREE.Vector3(0, 0.45, 0))
  group.add(oLabel)
  if (labelsRef?.current) labelsRef.current.push(oLabel)

  const oToCenter = new THREE.Vector3().subVectors(centerPos, oPos).normalize()
  const outDir = oToCenter.clone().negate()

  let perp1 = new THREE.Vector3()
  if (Math.abs(oToCenter.y) < 0.9) {
    perp1.crossVectors(oToCenter, new THREE.Vector3(0, 1, 0)).normalize()
  } else {
    perp1.crossVectors(oToCenter, new THREE.Vector3(1, 0, 0)).normalize()
  }

  const hohAngle = (104.5 * Math.PI) / 180
  const halfAngle = hohAngle / 2

  for (let i = 0; i < 2; i++) {
    const sign = i === 0 ? 1 : -1
    const hDir = new THREE.Vector3()
      .addScaledVector(outDir, Math.cos(halfAngle))
      .addScaledVector(perp1, Math.sin(halfAngle) * sign)
      .normalize()

    const hPos = new THREE.Vector3().copy(oPos).addScaledVector(hDir, 0.55)

    const hGeo = new THREE.SphereGeometry(0.15, 20, 20)
    const hMat = new THREE.MeshStandardMaterial({
      color: CPK.H,
      roughness: 0.6,
      metalness: 0.05
    })
    const hMesh = new THREE.Mesh(hGeo, hMat)
    hMesh.position.copy(hPos)
    hMesh.userData = { type: "atom", element: "H", info: ATOM_INFO.H }
    group.add(hMesh)
    if (atomsRef?.current) atomsRef.current.push(hMesh)

    const bond = createBond(group, oPos, hPos, 0xcccccc, 0.04, 0.7, {
      bondType: "O-H",
      length: "0.96 Å"
    })
    if (bondsRef?.current) bondsRef.current.push(bond)
  }

  parent.add(group)
  return group
}

/**
 * Cl⁻ Galogenid ligandi
 */
export function createClLigand(parent, clPos, refs = {}) {
  const { atomsRef, labelsRef, ligandAtomsRef } = refs
  const group = new THREE.Group()
  group.userData = { type: "ligand", ligandType: "Cl", donorPos: clPos.clone() }

  const clGeo = new THREE.SphereGeometry(0.38, 36, 36)
  const clMat = new THREE.MeshStandardMaterial({
    color: CPK.Cl,
    roughness: 0.35,
    metalness: 0.15,
    emissive: CPK.Cl,
    emissiveIntensity: 0.08
  })
  const clMesh = new THREE.Mesh(clGeo, clMat)
  clMesh.position.copy(clPos)
  clMesh.userData = { type: "atom", element: "Cl", info: ATOM_INFO.Cl, isDonor: true }
  clMesh.castShadow = true
  group.add(clMesh)
  if (atomsRef?.current) atomsRef.current.push(clMesh)
  if (ligandAtomsRef?.current) ligandAtomsRef.current.push(clMesh)

  const clLabel = makeTextSprite("Cl⁻", { color: "#86efac", scale: 0.35 })
  clLabel.position.copy(clPos).add(new THREE.Vector3(0, 0.5, 0))
  group.add(clLabel)
  if (labelsRef?.current) labelsRef.current.push(clLabel)

  parent.add(group)
  return group
}

/**
 * CN⁻ Tsianid ligandi
 */
export function createCNLigand(parent, cPos, centerPos, refs = {}) {
  const { atomsRef, labelsRef, bondsRef, ligandAtomsRef } = refs
  const group = new THREE.Group()
  group.userData = { type: "ligand", ligandType: "CN", donorPos: cPos.clone() }

  // Uglerod donor atomi
  const cGeo = new THREE.SphereGeometry(0.25, 36, 36)
  const cMat = new THREE.MeshStandardMaterial({
    color: CPK.C,
    roughness: 0.35,
    metalness: 0.15,
    emissive: CPK.C,
    emissiveIntensity: 0.05
  })
  const cMesh = new THREE.Mesh(cGeo, cMat)
  cMesh.position.copy(cPos)
  cMesh.userData = { type: "atom", element: "C", info: ATOM_INFO.C, isDonor: true }
  cMesh.castShadow = true
  group.add(cMesh)
  if (atomsRef?.current) atomsRef.current.push(cMesh)
  if (ligandAtomsRef?.current) ligandAtomsRef.current.push(cMesh)

  const cLabel = makeTextSprite("C", { color: "#d1d5db", scale: 0.32 })
  cLabel.position.copy(cPos).add(new THREE.Vector3(0, 0.35, 0))
  group.add(cLabel)
  if (labelsRef?.current) labelsRef.current.push(cLabel)

  // Azot tashqi atomi
  const dirOut = new THREE.Vector3().subVectors(cPos, centerPos).normalize()
  const nPos = new THREE.Vector3().copy(cPos).addScaledVector(dirOut, 1.16)

  const nGeo = new THREE.SphereGeometry(0.28, 36, 36)
  const nMat = new THREE.MeshStandardMaterial({
    color: CPK.N,
    roughness: 0.35,
    metalness: 0.15,
    emissive: CPK.N,
    emissiveIntensity: 0.08
  })
  const nMesh = new THREE.Mesh(nGeo, nMat)
  nMesh.position.copy(nPos)
  nMesh.userData = { type: "atom", element: "N", info: ATOM_INFO.N }
  nMesh.castShadow = true
  group.add(nMesh)
  if (atomsRef?.current) atomsRef.current.push(nMesh)

  const nLabel = makeTextSprite("N", { color: "#bfdbfe", scale: 0.32 })
  nLabel.position.copy(nPos).add(new THREE.Vector3(0, 0.4, 0))
  group.add(nLabel)
  if (labelsRef?.current) labelsRef.current.push(nLabel)

  // C≡N uch karrali bog'
  const bond = createBond(group, cPos, nPos, CPK.bond, 0.06, 0.9, {
    bondType: "C≡N",
    length: "1.16 Å"
  })
  if (bondsRef?.current) bondsRef.current.push(bond)

  parent.add(group)
  return group
}

/**
 * Universal bitta atomli ligand (F⁻, Br⁻, I⁻ va h.k.)
 */
export function createSimpleLigand(parent, pos, element, labelText, radius = 0.35, refs = {}) {
  const { atomsRef, labelsRef, ligandAtomsRef } = refs
  const group = new THREE.Group()
  group.userData = { type: "ligand", ligandType: element, donorPos: pos.clone() }

  const info = getAtomInfo(element)
  const geo = new THREE.SphereGeometry(radius, 36, 36)
  const mat = new THREE.MeshStandardMaterial({
    color: CPK[element] ?? 0xAAAAAA,
    roughness: 0.35,
    metalness: 0.15,
    emissive: CPK[element] ?? 0xAAAAAA,
    emissiveIntensity: 0.08
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.copy(pos)
  mesh.userData = { type: "atom", element, info, isDonor: true }
  mesh.castShadow = true
  group.add(mesh)
  if (atomsRef?.current) atomsRef.current.push(mesh)
  if (ligandAtomsRef?.current) ligandAtomsRef.current.push(mesh)

  if (labelText) {
    const label = makeTextSprite(labelText, { color: "#ffffff", scale: 0.35 })
    label.position.copy(pos).add(new THREE.Vector3(0, radius + 0.15, 0))
    group.add(label)
    if (labelsRef?.current) labelsRef.current.push(label)
  }

  parent.add(group)
  return group
}

/**
 * Tashqi sfera ionlari (masalan K⁺ yoki Cl⁻)
 */
export function createOuterSphereIons(parent, centerPos, outerIonConfig, refs = {}) {
  const { outerSphereRef, atomsRef, labelsRef } = refs
  const { element = "Cl", count = 3, radius = 0.32, charge = "-1" } = outerIonConfig
  const info = getAtomInfo(element)
  const dist = 3.8

  const group = new THREE.Group()
  group.userData = { type: "outerSphere" }

  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / Math.max(1, count - 1 || 1))
    const theta = Math.sqrt(count * Math.PI) * phi
    const pos = new THREE.Vector3(
      centerPos.x + dist * Math.sin(phi) * Math.cos(theta),
      centerPos.y + dist * Math.sin(phi) * Math.sin(theta),
      centerPos.z + dist * Math.cos(phi)
    )

    const geo = new THREE.SphereGeometry(radius, 24, 24)
    const mat = new THREE.MeshStandardMaterial({
      color: CPK[element] ?? 0x8F40D4,
      roughness: 0.4,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.copy(pos)
    mesh.userData = { type: "atom", element, info: { ...info, role: `Tashqi sfera (${charge})` } }
    group.add(mesh)
    if (atomsRef?.current) atomsRef.current.push(mesh)

    const formatCharge = (elem, ch) => {
      if (ch === "+1") return `${elem}⁺`
      if (ch === "-1") return `${elem}⁻`
      if (ch === "+2") return `${elem}²⁺`
      if (ch === "-2") return `${elem}²⁻`
      return `${elem}${ch}`
    }

    const label = makeTextSprite(formatCharge(element, charge), {
      color: "#e9d5ff",
      scale: 0.26
    })
    label.position.copy(pos).add(new THREE.Vector3(0, radius + 0.25, 0))
    group.add(label)
    if (labelsRef?.current) labelsRef.current.push(label)
  }

  parent.add(group)
  if (outerSphereRef?.current) outerSphereRef.current.push(group)
  return group
}
