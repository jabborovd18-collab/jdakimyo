// ═══════════════════════════════════════════════════════════════════════════
// ATOM MA'LUMOTLARI BAZASI
// Yagona haqiqat manbai: app/oquv/fazoviy/* uchun atom tavsiflari
// ═══════════════════════════════════════════════════════════════════════════

export const ATOM_INFO = {
  // Markaziy d-elementlar
  Co: {
    name: "Kobalt (Co)", atomic: 27, mass: "58.93 u",
    config: "[Ar] 3d⁷ 4s²", oxidation: "+2, +3",
    role: "Markaziy ion", color: "#F090A0",
    description: "Oktaedrik va tetraedrik komplekslarning eng mashhur markaziy atomi."
  },
  Fe: {
    name: "Temir (Fe)", atomic: 26, mass: "55.85 u",
    config: "[Ar] 3d⁶ 4s²", oxidation: "+2, +3",
    role: "Markaziy ion", color: "#E06633",
    description: "Geksatsianoferratlar va gemoglobinning faol markazi."
  },
  Ni: {
    name: "Nikel (Ni)", atomic: 28, mass: "58.69 u",
    config: "[Ar] 3d⁸ 4s²", oxidation: "+2",
    role: "Markaziy ion", color: "#50C050",
    description: "Tekis kvadrat va tetraedrik komplekslar hosil qiladi."
  },
  Cu: {
    name: "Mis (Cu)", atomic: 29, mass: "63.55 u",
    config: "[Ar] 3d¹⁰ 4s¹", oxidation: "+1, +2",
    role: "Markaziy ion", color: "#C08040",
    description: "Yan-Teller buzilishi va to'q ko'k ammin komplekslari bilan mashhur."
  },
  Zn: {
    name: "Sink (Zn)", atomic: 30, mass: "65.38 u",
    config: "[Ar] 3d¹⁰ 4s²", oxidation: "+2",
    role: "Markaziy ion", color: "#7D80B0",
    description: "d¹⁰ to'liq elektron qavati tufayli rangsiz tetraedrik va oktaedrik komplekslar beradi."
  },
  Pt: {
    name: "Platina (Pt)", atomic: 78, mass: "195.08 u",
    config: "[Xe] 4f¹⁴ 5d⁹ 6s¹", oxidation: "+2, +4",
    role: "Markaziy ion", color: "#E0C0A0",
    description: "Splatina va tekis kvadrat komplekslar asoschisi."
  },
  Pd: {
    name: "Palladiy (Pd)", atomic: 46, mass: "106.42 u",
    config: "[Kr] 4d¹⁰", oxidation: "+2",
    role: "Markaziy ion", color: "#7090C0",
    description: "Tekis kvadrat va katalitik faol komplekslar markazi."
  },
  Cr: {
    name: "Xrom (Cr)", atomic: 24, mass: "51.996 u",
    config: "[Ar] 3d⁵ 4s¹", oxidation: "+3, +6",
    role: "Markaziy ion", color: "#8A99C7",
    description: "Yuqori kinetik inertlikka ega oktaedrik komplekslar hosil qiladi."
  },
  Mn: {
    name: "Marganets (Mn)", atomic: 25, mass: "54.94 u",
    config: "[Ar] 3d⁵ 4s²", oxidation: "+2, +4, +7",
    role: "Markaziy ion", color: "#9C7AC7",
    description: "Yuqori spinli d⁵ va turli xil geometriyalar beradi."
  },

  // Ligand donor va tashqi atomlar
  N: {
    name: "Azot (N)", atomic: 7, mass: "14.01 u",
    config: "[He] 2s² 2p³", role: "Ligand donor atomi (NH₃, NO₂⁻, en)",
    hybridization: "sp³", color: "#3050F8",
    description: "Kuchli va o'rtacha maydon hosil qiluvchi $\\sigma$-donor ligand."
  },
  C: {
    name: "Uglerod (C)", atomic: 6, mass: "12.01 u",
    config: "[He] 2s² 2p²", role: "Donor atom (CN⁻, CO)",
    hybridization: "sp", color: "#909090",
    description: "Spektrokimyoviy qatorda eng kuchli maydon yaratuvchi $\\pi$-akseptor donor."
  },
  H: {
    name: "Vodorod (H)", atomic: 1, mass: "1.008 u",
    config: "1s¹", role: "Ligand tarkibi (NH₃, H₂O)",
    color: "#FFFFFF",
    description: "Molekula periferiyasidagi vodorod bog'lari hosil qiluvchi element."
  },
  O: {
    name: "Kislorod (O)", atomic: 8, mass: "16.00 u",
    config: "[He] 2s² 2p⁴", role: "Donor atom (H₂O, ox²⁻, OH⁻)",
    hybridization: "sp³", color: "#FF0D0D",
    description: "Akva va oksalat komplekslarida asosiy donor atom."
  },
  F: {
    name: "Ftor (F⁻)", atomic: 9, mass: "19.00 u",
    config: "[He] 2s² 2p⁶", charge: "-1",
    role: "Galogenid ligand", color: "#90E050",
    description: "Kuchli $\\pi$-donor, lekin kuchsiz maydon ligandi."
  },
  Cl: {
    name: "Xlor (Cl⁻)", atomic: 17, mass: "35.45 u",
    config: "[Ne] 3s² 3p⁶", charge: "-1",
    role: "Tashqi sfera ioni / ligand", color: "#1FF01F",
    description: "Tashqi sfera anioni yoki kuchsiz maydon galogenid ligandi."
  },
  Br: {
    name: "Brom (Br⁻)", atomic: 35, mass: "79.90 u",
    config: "[Ar] 3d¹⁰ 4s² 4p⁶", charge: "-1",
    role: "Tashqi sfera / ligand", color: "#A62929"
  },
  I: {
    name: "Yod (I⁻)", atomic: 53, mass: "126.90 u",
    config: "[Kr] 4d¹⁰ 5s² 5p⁶", charge: "-1",
    role: "Tashqi sfera / ligand", color: "#940094"
  },
  S: {
    name: "Oltingugurt (S)", atomic: 16, mass: "32.06 u",
    config: "[Ne] 3s² 3p⁴", role: "Donor / tashqi ion (SO₄²⁻, SCN⁻)",
    color: "#FFFF30"
  },
  P: {
    name: "Fosfor (P)", atomic: 15, mass: "30.97 u",
    config: "[Ne] 3s² 3p³", role: "Fosfin donor atomi (PR₃)",
    color: "#FF8000"
  },
  K: {
    name: "Kaliy (K⁺)", atomic: 19, mass: "39.10 u",
    config: "[Ar]", charge: "+1",
    role: "Tashqi sfera kationi", color: "#8F40D4",
    description: "Anion komplekslarni neytrallovchi tashqi sfera kationi."
  },
  Na: {
    name: "Natriy (Na⁺)", atomic: 11, mass: "22.99 u",
    config: "[Ne]", charge: "+1",
    role: "Tashqi sfera kationi", color: "#AB5CF2"
  },
  Ca: {
    name: "Kalsiy (Ca²⁺)", atomic: 20, mass: "40.08 u",
    config: "[Ar]", charge: "+2",
    role: "Tashqi sfera kationi", color: "#3DFF00"
  }
}

/**
 * Element haqida ma'lumot olish (agar topilmasa xavfsiz standart qaytaradi)
 * @param {string} element
 * @returns {object}
 */
export function getAtomInfo(element) {
  if (ATOM_INFO[element]) {
    return ATOM_INFO[element]
  }
  return {
    name: element,
    atomic: "-",
    mass: "-",
    config: "-",
    role: "Atom",
    color: "#AAAAAA",
    description: `${element} atomi.`
  }
}
