// app/laboratoriya/3d/lib/xray-dvigatel.js
//
// MORTAL KOMBAT X-RAY & SLOW-MOTION KIMYOVIY BOG'LAR UZILISHI VA ORALIQ KOMPLEKSLAR DVIGATELI.
//
// Reaksiya vaqtida vaqt sekinlashadi, kamera nano-fazoga kirib,
// kovalent/ion bog'larning taranglashib uzilishi, oraliq faollangan
// kompleks ([...]#) va yangi molekulalar hosil bo'lishini 3D da ko'rsatadi.

// CPK Ranglar
export const ATOM_RANGLARI = {
  H: 0xf8fafc,   // Oq
  O: 0xef4444,   // Qizil
  N: 0x3b82f6,   // Ko'k
  C: 0x334155,   // To'q kulrang
  Na: 0xf59e0b,  // Sariq/To'q sariq
  Cl: 0x22c55e,  // Yashil
  Cu: 0x06b6d4,  // Tsian/Zarxal
  Zn: 0xa855f7,  // Binafsha
  S: 0xeab308,   // Sariq
  Ag: 0xe2e8f0,  // Kumushrang
  Fe: 0xc2410c,  // Zangori to'q qizil
};

export const XRAY_REAKSIYALAR = [
  {
    id: "neytrallanish",
    nomi: "Kislota-Asos Neytrallanishi (HCl + NaOH)",
    tenglama: "HCl + NaOH ➔ NaCl + H₂O",
    faollanishEnergiyasi: "Ea = +42.5 kJ/mol (Juda tez)",
    entalpiya: "ΔH = -57.3 kJ/mol (Eksotermik)",
    tavsif: "H⁺ protonining OH⁻ gidroksid ioniga ko'chishi va mustahkam kovalent bog'li H₂O hosil bo'lishi.",
    boshlangichMolekulalar: [
      {
        nom: "HCl (Xlorid kislota)",
        atomlar: [
          { elem: "Cl", pos: [-1.2, 0, 0], r: 0.38 },
          { elem: "H", pos: [-0.65, 0.25, 0], r: 0.22 },
        ],
        boglar: [[0, 1]],
      },
      {
        nom: "NaOH (Natriy ishqori)",
        atomlar: [
          { elem: "Na", pos: [1.2, 0, 0], r: 0.42 },
          { elem: "O", pos: [0.65, 0, 0], r: 0.32 },
          { elem: "H", pos: [0.35, -0.3, 0], r: 0.22 },
        ],
        boglar: [[0, 1], [1, 2]],
      },
    ],
    oraliqKompleks: {
      nom: "[Cl⁻ ··· H⁺ ··· OH⁻ ··· Na⁺]‡ (Faollangan Kompleks)",
      atomlar: [
        { elem: "Cl", pos: [-1.0, 0, 0], r: 0.38 },
        { elem: "H", pos: [-0.2, 0.1, 0], r: 0.22, kuch: "uzilmoqda" },
        { elem: "O", pos: [0.3, 0, 0], r: 0.32 },
        { elem: "H", pos: [0.1, -0.35, 0], r: 0.22 },
        { elem: "Na", pos: [1.1, 0, 0], r: 0.42 },
      ],
      uziladiganBoglar: ["H-Cl bog'i cho'zilib uzilmoqda", "Na-O ion bog'i qutblanmoqda"],
      hosilBoladiganBoglar: ["H-O kovalent bog'i (Suv)", "Na⁺-Cl⁻ elektrostatik ion jufti"],
    },
    mahsulotlar: [
      {
        nom: "H₂O (Suv molekulasi, 104.5°)",
        atomlar: [
          { elem: "O", pos: [0, 0.2, 0], r: 0.32 },
          { elem: "H", pos: [-0.4, -0.2, 0], r: 0.22 },
          { elem: "H", pos: [0.4, -0.2, 0], r: 0.22 },
        ],
        boglar: [[0, 1], [0, 2]],
      },
      {
        nom: "NaCl (Ionli erigan tuz)",
        atomlar: [
          { elem: "Na", pos: [1.2, 0, 0], r: 0.42 },
          { elem: "Cl", pos: [-1.2, 0, 0], r: 0.38 },
        ],
        boglar: [],
      },
    ],
  },
  {
    id: "chokma_agcl",
    nomi: "Cho'kma Hosil Bo'lishi (AgNO₃ + NaCl)",
    tenglama: "Ag⁺ + Cl⁻ ➔ AgCl↓ (Oq tvorogsimon cho'kma)",
    faollanishEnergiyasi: "Ea = +12.0 kJ/mol (Diffuzion nazorat)",
    entalpiya: "ΔH = -65.5 kJ/mol (Kristall panjara energiyasi)",
    tavsif: "Ag⁺ va Cl⁻ ionlarining o'zaro elektrostatik tortilib, eruvchanligi o'ta past bo'lgan kubik kristall panjaraga o'tirishi.",
    boshlangichMolekulalar: [
      {
        nom: "Ag⁺ (Gidratlangan kumush ioni)",
        atomlar: [{ elem: "Ag", pos: [-1.0, 0, 0], r: 0.44 }],
        boglar: [],
      },
      {
        nom: "Cl⁻ (Gidratlangan xlor ioni)",
        atomlar: [{ elem: "Cl", pos: [1.0, 0, 0], r: 0.4 }],
        boglar: [],
      },
    ],
    oraliqKompleks: {
      nom: "[Ag⁺ ····· Cl⁻]‡ (Gidrat qobig'ining yorilishi)",
      atomlar: [
        { elem: "Ag", pos: [-0.4, 0, 0], r: 0.44 },
        { elem: "Cl", pos: [0.4, 0, 0], r: 0.4 },
      ],
      uziladiganBoglar: ["Suv dipollari bilan gidratlanish bog'lari"],
      hosilBoladiganBoglar: ["Ag-Cl mustahkam ion-kovalent kristall bog'i"],
    },
    mahsulotlar: [
      {
        nom: "AgCl↓ (Kristall panjara birligi)",
        atomlar: [
          { elem: "Ag", pos: [-0.28, 0, 0], r: 0.44 },
          { elem: "Cl", pos: [0.28, 0, 0], r: 0.4 },
        ],
        boglar: [[0, 1]],
      },
    ],
  },
  {
    id: "orin_olish_zn_cu",
    nomi: "Redoks O'rin Olish (Zn + CuSO₄)",
    tenglama: "Zn + Cu²⁺ ➔ Zn²⁺ + Cu↓ (Elektron ko'chishi)",
    faollanishEnergiyasi: "Ea = +35.0 kJ/mol",
    entalpiya: "ΔH = -218.7 kJ/mol (Yuqori eksotermik)",
    tavsif: "Rux atomining 2 ta valent elektronini Cu²⁺ ioniga berishi (Zn oksidlanadi, Cu qaytariladi).",
    boshlangichMolekulalar: [
      {
        nom: "Zn⁰ (Neytral metall atomi)",
        atomlar: [{ elem: "Zn", pos: [-1.1, 0, 0], r: 0.45 }],
        boglar: [],
      },
      {
        nom: "Cu²⁺ (Moviy erigan mis ioni)",
        atomlar: [{ elem: "Cu", pos: [1.1, 0, 0], r: 0.43 }],
        boglar: [],
      },
    ],
    oraliqKompleks: {
      nom: "[Zn²⁺ ··· 2e⁻ ➔ Cu²⁺]‡ (Elektron Sakrashi)",
      atomlar: [
        { elem: "Zn", pos: [-0.5, 0, 0], r: 0.45 },
        { elem: "Cu", pos: [0.5, 0, 0], r: 0.43 },
      ],
      uziladiganBoglar: ["Zn atomining 4s² elektron bog'lanishi"],
      hosilBoladiganBoglar: ["Cu atomining 3d¹⁰ 4s¹ metall kristall panjarasi"],
    },
    mahsulotlar: [
      {
        nom: "Cu↓ (Sof metall mis)",
        atomlar: [{ elem: "Cu", pos: [0.6, 0, 0], r: 0.43 }],
        boglar: [],
      },
      {
        nom: "Zn²⁺ (Eritmaga o'tgan rux ioni)",
        atomlar: [{ elem: "Zn", pos: [-0.6, 0, 0], r: 0.45 }],
        boglar: [],
      },
    ],
  },
];

/**
 * Reaksiyaga mos X-Ray profilini topish.
 */
export function xrayProfiliniTop(reaksiyaTenglamasi = "") {
  const t = String(reaksiyaTenglamasi).toLowerCase();
  if (t.includes("hcl") && t.includes("naoh")) return XRAY_REAKSIYALAR[0];
  if (t.includes("agcl") || (t.includes("agno3") && t.includes("nacl"))) return XRAY_REAKSIYALAR[1];
  if (t.includes("zn") && t.includes("cu")) return XRAY_REAKSIYALAR[2];
  return XRAY_REAKSIYALAR[0]; // Standart kislota-asos
}
