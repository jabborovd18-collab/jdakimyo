// ═══════════════════════════════════════════════════════════════════════════
// CPK RANGLARI (IUPAC standartlari)
// ═══════════════════════════════════════════════════════════════════════════
export const CPK = {
  N: 0x3050F8, P: 0xFF8000, As: 0xBD80E3,
  H: 0xFFFFFF, F: 0x90E050, Cl: 0x1FF01F,
  bond: 0x8B9DC3, lonePair: 0xFFFF00, hbond: 0x66CCFF
}

// ═══════════════════════════════════════════════════════════════════════════
// KOMPLEKS DATABASE — Trigonal-Piramida
// ═══════════════════════════════════════════════════════════════════════════
export const COMPLEXES = {
  NH3: {
    id: "NH3",
    formula: "NH₃",
    fullSalt: "NH₃ (ammiak)",
    name: "Ammiak (Azot gidridi)",
    center: { element: "N", color: CPK.N, radius: 0.35, charge: "0" },
    ligand: { type: "H", donor: "H", donorColor: CPK.H, donorRadius: 0.15 },
    bondLength: 1.0,
    bondLengthReal: "1.01 Å",
    bondAngle: 107.3,
    hybridization: "sp³",
    magnetism: "Diamagnit",
    color: "Rangsiz gaz",
    geometry: "Trigonal-piramida",
    symmetry: "C₃ᵥ",
    lonePairs: 1,
    molecularWeight: "17.03 g/mol",
    boilingPoint: "-33.34°C",
    dipoleMoment: "1.47 D",
    pointGroup: "C₃ᵥ"
  },
  NF3: {
    id: "NF3",
    formula: "NF₃",
    fullSalt: "NF₃ (azot trifluorid)",
    name: "Azot trifluorid",
    center: { element: "N", color: CPK.N, radius: 0.35, charge: "0" },
    ligand: { type: "F", donor: "F", donorColor: CPK.F, donorRadius: 0.20 },
    bondLength: 1.37,
    bondLengthReal: "1.37 Å",
    bondAngle: 102.5,
    hybridization: "sp³",
    magnetism: "Diamagnit",
    color: "Rangsiz gaz",
    geometry: "Trigonal-piramida",
    symmetry: "C₃ᵥ",
    lonePairs: 1,
    molecularWeight: "71.00 g/mol",
    boilingPoint: "-129°C",
    dipoleMoment: "0.23 D",
    pointGroup: "C₃ᵥ"
  },
  PCl3: {
    id: "PCl3",
    formula: "PCl₃",
    fullSalt: "PCl₃ (fosfor trixlorid)",
    name: "Fosfor trixlorid",
    center: { element: "P", color: CPK.P, radius: 0.40, charge: "0" },
    ligand: { type: "Cl", donor: "Cl", donorColor: CPK.Cl, donorRadius: 0.25 },
    bondLength: 2.04,
    bondLengthReal: "2.04 Å",
    bondAngle: 100.3,
    hybridization: "sp³",
    magnetism: "Diamagnit",
    color: "Rangsiz suyuqlik",
    geometry: "Trigonal-piramida",
    symmetry: "C₃ᵥ",
    lonePairs: 1,
    molecularWeight: "137.33 g/mol",
    boilingPoint: "76.1°C",
    dipoleMoment: "1.00 D",
    pointGroup: "C₃ᵥ"
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════
export const ATOM_INFO = {
  N: { name: "Azot (N)", atomic: 7, mass: "14.01 u", config: "[He] 2s² 2p³", role: "Markaziy atom", color: "#3050F8" },
  P: { name: "Fosfor (P)", atomic: 15, mass: "30.97 u", config: "[Ne] 3s² 3p³", role: "Markaziy atom", color: "#FF8000" },
  As: { name: "Arsen (As)", atomic: 33, mass: "74.92 u", config: "[Ar] 3d¹⁰ 4s² 4p³", role: "Markaziy atom", color: "#BD80E3" },
  H: { name: "Vodorod (H)", atomic: 1, mass: "1.008 u", config: "1s¹", role: "Ligand", color: "#FFFFFF" },
  F: { name: "Ftor (F)", atomic: 9, mass: "19.00 u", config: "[He] 2s² 2p⁵", role: "Ligand", color: "#90E050" },
  Cl: { name: "Xlor (Cl)", atomic: 17, mass: "35.45 u", config: "[Ne] 3s² 3p⁵", role: "Ligand", color: "#1FF01F" }
}