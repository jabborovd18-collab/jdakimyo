// ═══════════════════════════════════════════════════════════════════════════
// CPK RANGLARI (IUPAC va Jmol standartlari)
// Yagona haqiqat manbai: app/oquv/fazoviy/* barcha sahifalar uchun
// ═══════════════════════════════════════════════════════════════════════════

export const CPK = {
  // Nometallar va gazlar
  H: 0xFFFFFF,   // Vodorod — oq
  C: 0x909090,   // Uglerod — kulrang
  N: 0x3050F8,   // Azot — ko'k
  O: 0xFF0D0D,   // Kislorod — qizil
  F: 0x90E050,   // Ftor — och yashil
  Cl: 0x1FF01F,  // Xlor — yashil
  Br: 0xA62929,  // Brom — to'q qizil
  I: 0x940094,   // Yod — to'q binafsha
  P: 0xFF8000,   // Fosfor — to'q sariq
  S: 0xFFFF30,   // Oltingugurt — sariq
  B: 0xFFB5B5,   // Bor — pushti
  Si: 0xDAA520,  // Kremniy — oltin-jigarrang
  Se: 0xFFA100,  // Selen
  Te: 0xD47A00,  // Tellur

  // Ishqoriy va ishqoriy-yer metallar
  Li: 0xCC80FF,  // Litiy — binafsha
  Na: 0xAB5CF2,  // Natriy — binafsha
  K: 0x8F40D4,   // Kaliy — to'q binafsha
  Rb: 0x3F107D,  // Rubidiy
  Cs: 0x57178F,  // Seziy
  Be: 0xC2FF00,  // Berilliy
  Mg: 0x8AFF00,  // Magniy — yashil
  Ca: 0x3DFF00,  // Kalsiy — to'q yashil
  Sr: 0x00FF2C,  // Stronsiy
  Ba: 0x00C900,  // Bariy

  // d-elementlar (O'tish metallari)
  Sc: 0xE6E6E6,  Ti: 0xBFC2C7,  V: 0xA6A6AB,   Cr: 0x8A99C7,
  Mn: 0x9C7AC7,  Fe: 0xE06633,  Co: 0xF090A0,  Ni: 0x50C050,
  Cu: 0xC08040,  Zn: 0x7D80B0,  Y: 0x94FFFF,   Zr: 0x94E0E0,
  Nb: 0x73C2C9,  Mo: 0x54B5B5,  Tc: 0x3B9E9E,  Ru: 0x248F8F,
  Rh: 0x0A7D8C,  Pd: 0x7090C0,  Ag: 0xC0C0C0,  Cd: 0xFFD98F,
  Pt: 0xE0C0A0,  Au: 0xD0A040,  Hg: 0xB8B8D0,  W: 0x2194D6,

  // Bog'lar va yordamchi ranglar
  bond: 0x8B9DC3,      // Standart kovalent / koordinatsion bog'
  hbond: 0x66CCFF,     // Vodorod bog'i
  coordBond: 0xA78BFA, // Donor-akseptor bog'
  lonePair: 0xFBBF24   // Bo'sh elektron jufti
}

/**
 * Element nomiga qarab CPK rangini olish (o'nlik yoki CSS hex shaklida)
 * @param {string} element - Element belgisi (masalan 'Co', 'Cl', 'N')
 * @param {boolean} [hexString=false] - Agar true bo'lsa '#RRGGBB' formatda qaytaradi
 * @returns {number|string} Rang qiymati
 */
export function getCPKColor(element, hexString = false) {
  const colorNum = CPK[element] ?? 0xAAAAAA
  if (hexString) {
    return `#${colorNum.toString(16).padStart(6, "0")}`
  }
  return colorNum
}
