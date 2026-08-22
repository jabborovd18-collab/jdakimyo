// app/laboratoriya/3d/lib/xray-dvigatel.js
//
// MORTAL KOMBAT X-RAY & SLOW-MOTION KIMYOVIY BOG'LAR UZILISHI VA ORALIQ KOMPLEKSLAR DVIGATELI.
//
// Reaksiya vaqtida vaqt sekinlashadi, kamera nano-fazoga kirib,
// kovalent/ion bog'larning taranglashib uzilishi, oraliq faollangan
// kompleks ([...]‡) va yangi molekulalar hosil bo'lishini 3D da ko'rsatadi.

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
  Al: 0x94a3b8,  // Kumushrang-kulrang
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
    id: "gaz_co2",
    nomi: "Gaz Ajralishi va Karbonatning Parchalanishi",
    tenglama: "Na₂CO₃ + 2HCl ➔ 2NaCl + H₂O + CO₂↑",
    faollanishEnergiyasi: "Ea = +28.5 kJ/mol",
    entalpiya: "ΔH = -32.4 kJ/mol (Gaz kengayishi)",
    tavsif: "Karbonat ioniga H⁺ birikib, beqaror H₂CO₃ hosil bo'ladi va darhol C-O kovalent bog'i uzilib, chiziqli CO₂ gazi pufakcha bo'lib ajraladi.",
    boshlangichMolekulalar: [
      {
        nom: "CO₃²⁻ (Planar karbonat ioni)",
        atomlar: [
          { elem: "C", pos: [-0.8, 0, 0], r: 0.35 },
          { elem: "O", pos: [-0.8, 0.45, 0], r: 0.3 },
          { elem: "O", pos: [-1.2, -0.3, 0], r: 0.3 },
          { elem: "O", pos: [-0.4, -0.3, 0], r: 0.3 },
        ],
        boglar: [[0, 1], [0, 2], [0, 3]],
      },
      {
        nom: "2H⁺ (Gidroksoniy protonlari)",
        atomlar: [
          { elem: "H", pos: [0.6, 0.3, 0], r: 0.22 },
          { elem: "H", pos: [0.6, -0.3, 0], r: 0.22 },
        ],
        boglar: [],
      },
    ],
    oraliqKompleks: {
      nom: "[H₂O ····· C(=O)₂]‡ (C-O Kovalent Bog'ining Uzilishi)",
      atomlar: [
        { elem: "C", pos: [-0.2, 0, 0], r: 0.35 },
        { elem: "O", pos: [-0.8, 0.1, 0], r: 0.3, kuch: "uzilmoqda" },
        { elem: "O", pos: [0.4, 0.2, 0], r: 0.3 },
        { elem: "O", pos: [-0.2, -0.5, 0], r: 0.3 },
        { elem: "H", pos: [-1.1, 0.3, 0], r: 0.22 },
        { elem: "H", pos: [-1.1, -0.1, 0], r: 0.22 },
      ],
      uziladiganBoglar: ["C-O kovalent bog'i uzilib gaz hosil qiladi"],
      hosilBoladiganBoglar: ["O=C=O chiziqli qo'shbog'lari", "H-O-H suv kovalent bog'i"],
    },
    mahsulotlar: [
      {
        nom: "CO₂↑ (Chiziqli 180° gaz molekulasi)",
        atomlar: [
          { elem: "C", pos: [0.8, 0, 0], r: 0.35 },
          { elem: "O", pos: [0.15, 0, 0], r: 0.3 },
          { elem: "O", pos: [1.45, 0, 0], r: 0.3 },
        ],
        boglar: [[0, 1], [0, 2]],
      },
      {
        nom: "H₂O (Suv)",
        atomlar: [
          { elem: "O", pos: [-0.8, 0, 0], r: 0.32 },
          { elem: "H", pos: [-1.15, -0.25, 0], r: 0.22 },
          { elem: "H", pos: [-0.45, -0.25, 0], r: 0.22 },
        ],
        boglar: [[0, 1], [0, 2]],
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
  {
    id: "chokma_cuoh2",
    nomi: "Mis(II) Gidroksid Cho'kishi (CuSO₄ + 2NaOH)",
    tenglama: "Cu²⁺ + 2OH⁻ ➔ Cu(OH)₂↓ (Moviy jelatin cho'kma)",
    faollanishEnergiyasi: "Ea = +18.5 kJ/mol",
    entalpiya: "ΔH = -88.6 kJ/mol",
    tavsif: "Gidratlangan Cu²⁺ ionlariga OH⁻ anionlari koordinatsiyalanib, polimer qatlamli yorqin moviy cho'kma hosil qiladi.",
    // MASOFA ESLATMASI. Quyidagi koordinatalar ANGSTREMDA EMAS — ular
    // ko'rinish uchun moslangan. Lekin NISBAT saqlangan: aksial bog'
    // ekvatorialdan ~1.19 barobar uzun, bu haqiqiy Yan-Teller
    // cho'zilishiga mos. Haqiqiy sonlar matnda aytiladi, chizmada emas
    // — chizma masshtabi aniq deb da'vo qilmaydi.
    manba:
      "Cu(II) akva-kompleksining Yan-Teller cho'zilishi — anorganik " +
      "kimyodagi standart tavsif. Aniq bog' uzunliklari tuz va " +
      "qarshi-ionga qarab o'zgaradi, shuning uchun taxminiy (~) " +
      "berilgan.",
    boshlangichMolekulalar: [
      {
        nom: "[Cu(H₂O)₆]²⁺ — geksaakvamis(II), Yan-Teller oktaedri",
        izoh:
          "Suvli eritmada yalang'och Cu²⁺ YO'Q. U olti suv molekulasi " +
          "bilan o'ralgan. Oktaedr muntazam emas: to'rt ekvatorial " +
          "Cu-O bog'i qisqa (~1.95 Å), ikki aksial bog' esa uzun " +
          "(~2.3 Å). Bu Yan-Teller effekti va aynan u misning ko'k " +
          "rangini va keyingi ligand almashinuvini belgilaydi.",
        atomlar: [
          { elem: "Cu", pos: [0, 0, 0], r: 0.43 },
          // Ekvatorial suvlar — QISQA bog'
          { elem: "O", pos: [1.30, 0, 0], r: 0.32 },
          { elem: "H", pos: [1.76, 0.42, 0], r: 0.20 },
          { elem: "H", pos: [1.76, -0.42, 0], r: 0.20 },
          { elem: "O", pos: [-1.30, 0, 0], r: 0.32 },
          { elem: "H", pos: [-1.76, 0.42, 0], r: 0.20 },
          { elem: "H", pos: [-1.76, -0.42, 0], r: 0.20 },
          { elem: "O", pos: [0, 0, 1.30], r: 0.32 },
          { elem: "H", pos: [0.42, 0.42, 1.76], r: 0.20 },
          { elem: "H", pos: [-0.42, 0.42, 1.76], r: 0.20 },
          { elem: "O", pos: [0, 0, -1.30], r: 0.32 },
          { elem: "H", pos: [0.42, 0.42, -1.76], r: 0.20 },
          { elem: "H", pos: [-0.42, 0.42, -1.76], r: 0.20 },
          // Aksial suvlar — UZUN bog' (Yan-Teller)
          { elem: "O", pos: [0, 1.55, 0], r: 0.32, kuch: "uzun" },
          { elem: "H", pos: [0.42, 1.97, 0], r: 0.20 },
          { elem: "H", pos: [-0.42, 1.97, 0], r: 0.20 },
          { elem: "O", pos: [0, -1.55, 0], r: 0.32, kuch: "uzun" },
          { elem: "H", pos: [0.42, -1.97, 0], r: 0.20 },
          { elem: "H", pos: [-0.42, -1.97, 0], r: 0.20 },
        ],
        boglar: [
          [0, 1], [1, 2], [1, 3],
          [0, 4], [4, 5], [4, 6],
          [0, 7], [7, 8], [7, 9],
          [0, 10], [10, 11], [10, 12],
          [0, 13], [13, 14], [13, 15],
          [0, 16], [16, 17], [16, 18],
        ],
      },
      {
        nom: "2OH⁻ (Gidroksid ionlari)",
        izoh:
          "Ishqordan kelgan OH⁻ suvdan kuchliroq ligand. U avval " +
          "AKSIAL, ya'ni eng bo'sh bog'langan suvni siqib chiqaradi.",
        atomlar: [
          { elem: "O", pos: [-2.6, 1.4, 0], r: 0.32 },
          { elem: "H", pos: [-3.0, 1.7, 0], r: 0.20 },
          { elem: "O", pos: [2.6, -1.4, 0], r: 0.32 },
          { elem: "H", pos: [3.0, -1.7, 0], r: 0.20 },
        ],
        boglar: [[0, 1], [2, 3]],
      },
    ],
    oraliqKompleks: {
      nom: "Ligand almashinuvi — OH⁻ aksial suvni siqib chiqaradi",
      izoh:
        "Reaksiya \"Cu²⁺ ikkita OH⁻ ni uchratdi\" degani emas. " +
        "OH⁻ suvdan kuchliroq ligand va u eng bo'sh bog'langan " +
        "AKSIAL suvni almashtiradi — Yan-Teller cho'zilishi aynan " +
        "shu joyni zaif qilib qo'ygan. Koordinatsion son o'zgarmaydi: " +
        "olti ligand oltitaligicha qoladi, faqat ikkitasi almashadi.",
      atomlar: [
        { elem: "Cu", pos: [0, 0, 0], r: 0.43 },
        { elem: "O", pos: [1.30, 0, 0], r: 0.32 },
        { elem: "H", pos: [1.76, 0.42, 0], r: 0.20 },
        { elem: "O", pos: [-1.30, 0, 0], r: 0.32 },
        { elem: "H", pos: [-1.76, 0.42, 0], r: 0.20 },
        { elem: "O", pos: [0, 0, 1.30], r: 0.32 },
        { elem: "H", pos: [0.42, 0.42, 1.76], r: 0.20 },
        { elem: "O", pos: [0, 0, -1.30], r: 0.32 },
        { elem: "H", pos: [0.42, 0.42, -1.76], r: 0.20 },
        { elem: "O", pos: [0, 2.15, 0], r: 0.32, kuch: "uzilmoqda" },
        { elem: "H", pos: [0.42, 2.55, 0], r: 0.20 },
        { elem: "O", pos: [0, -1.35, 0], r: 0.32, kuch: "hosilBolmoqda" },
        { elem: "H", pos: [0.42, -1.78, 0], r: 0.20 },
      ],
      uziladiganBoglar: [
        "Cu-OH₂ aksial bog'i (Yan-Teller tufayli eng zaif)",
      ],
      hosilBoladiganBoglar: [
        "Cu-OH koordinatsion bog'i (suvdan kuchliroq ligand)",
      ],
    },
    mahsulotlar: [
      {
        nom: "Cu(OH)₂↓ — qatlamli polimer (och ko'k jelesimon cho'kma)",
        izoh:
          "Cu(OH)₂ diskret molekula EMAS. Har mis atomi to'rtta " +
          "gidroksid bilan bog'lanadi va OH ko'priklari ularni " +
          "cheksiz qatlamga tikadi. Aynan shu tuzilish uning nega " +
          "jelesimon (amorf, suv ushlaydigan) cho'kma ekanini " +
          "tushuntiradi — kristall donacha emas.",
        atomlar: [
          { elem: "Cu", pos: [-1.15, 0, 0], r: 0.43 },
          { elem: "Cu", pos: [1.15, 0, 0], r: 0.43 },
          // Ko'prik gidroksidlar — ikkala misga ham bog'langan
          { elem: "O", pos: [0, 0.78, 0], r: 0.32, kuch: "kopruk" },
          { elem: "H", pos: [0, 1.24, 0.32], r: 0.20 },
          { elem: "O", pos: [0, -0.78, 0], r: 0.32, kuch: "kopruk" },
          { elem: "H", pos: [0, -1.24, 0.32], r: 0.20 },
          // Chekka gidroksidlar — qatlam davom etadigan tomon
          { elem: "O", pos: [-2.3, 0.78, 0], r: 0.32 },
          { elem: "H", pos: [-2.75, 1.15, 0], r: 0.20 },
          { elem: "O", pos: [-2.3, -0.78, 0], r: 0.32 },
          { elem: "H", pos: [-2.75, -1.15, 0], r: 0.20 },
          { elem: "O", pos: [2.3, 0.78, 0], r: 0.32 },
          { elem: "H", pos: [2.75, 1.15, 0], r: 0.20 },
          { elem: "O", pos: [2.3, -0.78, 0], r: 0.32 },
          { elem: "H", pos: [2.75, -1.15, 0], r: 0.20 },
        ],
        boglar: [
          [0, 2], [1, 2], [2, 3],
          [0, 4], [1, 4], [4, 5],
          [0, 6], [6, 7], [0, 8], [8, 9],
          [1, 10], [10, 11], [1, 12], [12, 13],
        ],
      },
    ],
  },
  {
    id: "parchalanish_cuoh2",
    nomi: "Mis(II) Gidroksidning Termik Parchalanishi",
    tenglama: "Cu(OH)₂ ➔ CuO + H₂O (Och ko'k cho'kma qora kukunga aylanadi)",
    faollanishEnergiyasi: "Qizdirish talab qilinadi — 80–100 °C",
    entalpiya: "Endotermik (issiqlik yutadi)",
    tavsif:
      "Qatlamli Cu(OH)₂ qizdirilganda ko'prik gidroksidlar suv " +
      "ajratadi va qatlam siqilib CuO panjarasiga aylanadi. Rang " +
      "keskin o'zgaradi: och ko'kdan qop-qoraga.",
    manba:
      "Harorat oralig'i (80–100 °C) va kuzatuv matni loyihaning kimyo " +
      "bazasidan: data/reactions/termik-parchalanish.js. Tuzilish " +
      "sifat jihatidan berilgan; aniq panjara parametrlari YOZILMADI, " +
      "chunki tekshirilgan manba yo'q.",
    boshlangichMolekulalar: [
      {
        nom: "Cu(OH)₂ — qatlam bo'lagi",
        izoh:
          "Ikki mis markazi ko'prik gidroksidlar bilan bog'langan. " +
          "Qizdirilganda aynan shu ko'priklardagi vodorodlar qo'shni " +
          "gidroksid bilan birikib suv hosil qiladi.",
        atomlar: [
          { elem: "Cu", pos: [-1.15, 0, 0], r: 0.43 },
          { elem: "Cu", pos: [1.15, 0, 0], r: 0.43 },
          { elem: "O", pos: [0, 0.78, 0], r: 0.32, kuch: "kopruk" },
          { elem: "H", pos: [0, 1.24, 0.32], r: 0.20, kuch: "uzilmoqda" },
          { elem: "O", pos: [0, -0.78, 0], r: 0.32, kuch: "kopruk" },
          { elem: "H", pos: [0, -1.24, 0.32], r: 0.20, kuch: "uzilmoqda" },
          { elem: "O", pos: [-2.3, 0, 0], r: 0.32 },
          { elem: "H", pos: [-2.75, 0.38, 0], r: 0.20 },
          { elem: "O", pos: [2.3, 0, 0], r: 0.32 },
          { elem: "H", pos: [2.75, 0.38, 0], r: 0.20 },
        ],
        boglar: [
          [0, 2], [1, 2], [2, 3],
          [0, 4], [1, 4], [4, 5],
          [0, 6], [6, 7], [1, 8], [8, 9],
        ],
      },
    ],
    oraliqKompleks: {
      nom: "Suv ajralishi — qatlam siqilmoqda",
      izoh:
        "Ikki gidroksiddan biri o'z vodorodini ikkinchisiga beradi. " +
        "Hosil bo'lgan H₂O qatlamdan chiqadi, qolgan kislorod esa " +
        "ikkala misni to'g'ridan-to'g'ri bog'laydi.",
      atomlar: [
        { elem: "Cu", pos: [-1.0, 0, 0], r: 0.43 },
        { elem: "Cu", pos: [1.0, 0, 0], r: 0.43 },
        { elem: "O", pos: [0, 0.7, 0], r: 0.32, kuch: "hosilBolmoqda" },
        { elem: "O", pos: [0, -1.6, 0], r: 0.32, kuch: "uzilmoqda" },
        { elem: "H", pos: [0.45, -1.95, 0], r: 0.20 },
        { elem: "H", pos: [-0.45, -1.95, 0], r: 0.20 },
      ],
      uziladiganBoglar: [
        "Cu-OH ko'prik bog'lari (bir kislorod suv bo'lib ketadi)",
      ],
      hosilBoladiganBoglar: [
        "Cu-O-Cu to'g'ridan-to'g'ri oksid bog'i",
        "H₂O molekulasi (bug' bo'lib chiqadi)",
      ],
    },
    mahsulotlar: [
      {
        nom: "CuO — kvadrat-tekis mis, qora kukun",
        izoh:
          "CuO da har mis atomi TO'RTTA kislorod bilan kvadrat-tekis " +
          "o'ralgan. Zich oksid panjarasi ko'rinadigan yorug'likning " +
          "deyarli hammasini yutadi — shuning uchun kukun qora.",
        atomlar: [
          { elem: "Cu", pos: [0, 0, 0], r: 0.43 },
          { elem: "O", pos: [1.25, 0.55, 0], r: 0.32 },
          { elem: "O", pos: [-1.25, 0.55, 0], r: 0.32 },
          { elem: "O", pos: [1.25, -0.55, 0], r: 0.32 },
          { elem: "O", pos: [-1.25, -0.55, 0], r: 0.32 },
          { elem: "Cu", pos: [2.5, 0, 0], r: 0.43 },
          { elem: "Cu", pos: [-2.5, 0, 0], r: 0.43 },
        ],
        boglar: [
          [0, 1], [0, 2], [0, 3], [0, 4],
          [1, 5], [3, 5], [2, 6], [4, 6],
        ],
      },
      {
        nom: "H₂O (bug')",
        atomlar: [
          { elem: "O", pos: [0, 2.2, 0], r: 0.32 },
          { elem: "H", pos: [0.5, 2.55, 0], r: 0.20 },
          { elem: "H", pos: [-0.5, 2.55, 0], r: 0.20 },
        ],
        boglar: [[0, 1], [0, 2]],
      },
    ],
  },
  {
    id: "esterifikatsiya",
    nomi: "Organik Efirlar Hosil Bo'lishi (Sirka kislota + Etanol)",
    tenglama: "CH₃COOH + C₂H₅OH ⇄ CH₃COOC₂H₅ + H₂O (Xushbo'y Efir)",
    faollanishEnergiyasi: "Ea = +75.2 kJ/mol (Katalizator H⁺ talab qiladi)",
    entalpiya: "ΔH = -4.5 kJ/mol (Muvozanatli)",
    tavsif: "Karbonil uglerodiga spirt gidroksil guruhining nukleofil hujumi, tetraedrik oraliq holat va suv molekulasining ajralishi.",
    boshlangichMolekulalar: [
      {
        nom: "CH₃COOH (Sirka kislota)",
        atomlar: [
          { elem: "C", pos: [-1.2, 0, 0], r: 0.35 },
          { elem: "O", pos: [-1.2, 0.5, 0], r: 0.3 },
          { elem: "O", pos: [-0.7, -0.3, 0], r: 0.3 },
          { elem: "H", pos: [-0.4, -0.5, 0], r: 0.22 },
        ],
        boglar: [[0, 1], [0, 2], [2, 3]],
      },
      {
        nom: "C₂H₅OH (Etanol)",
        atomlar: [
          { elem: "O", pos: [0.6, -0.2, 0], r: 0.3 },
          { elem: "H", pos: [0.4, 0.2, 0], r: 0.22 },
          { elem: "C", pos: [1.1, -0.1, 0], r: 0.35 },
        ],
        boglar: [[0, 1], [0, 2]],
      },
    ],
    oraliqKompleks: {
      nom: "[CH₃-C(OH)₂-O-C₂H₅]‡ (Tetraedrik Nukleofil Kompleks)",
      atomlar: [
        { elem: "C", pos: [-0.3, 0, 0], r: 0.35 },
        { elem: "O", pos: [-0.3, 0.5, 0], r: 0.3 },
        { elem: "O", pos: [-0.8, -0.3, 0], r: 0.3, kuch: "uzilmoqda" },
        { elem: "O", pos: [0.3, -0.2, 0], r: 0.3 },
        { elem: "H", pos: [-0.6, -0.6, 0], r: 0.22 },
        { elem: "C", pos: [0.9, -0.1, 0], r: 0.35 },
      ],
      uziladiganBoglar: ["C-OH kislota bog'i va spirt O-H bog'i"],
      hosilBoladiganBoglar: ["C-O-C murakkab efir bog'i", "H₂O suv molekulasi"],
    },
    mahsulotlar: [
      {
        nom: "CH₃COOC₂H₅ (Etilatsetat efiri)",
        atomlar: [
          { elem: "C", pos: [-0.5, 0, 0], r: 0.35 },
          { elem: "O", pos: [-0.5, 0.5, 0], r: 0.3 },
          { elem: "O", pos: [0.1, -0.2, 0], r: 0.3 },
          { elem: "C", pos: [0.7, -0.1, 0], r: 0.35 },
        ],
        boglar: [[0, 1], [0, 2], [2, 3]],
      },
      {
        nom: "H₂O (Ajralgan suv)",
        atomlar: [
          { elem: "O", pos: [-1.4, -0.3, 0], r: 0.3 },
          { elem: "H", pos: [-1.7, -0.5, 0], r: 0.22 },
          { elem: "H", pos: [-1.1, -0.5, 0], r: 0.22 },
        ],
        boglar: [[0, 1], [0, 2]],
      },
    ],
  },
];

/**
 * Reaksiyaga mos X-Ray profilini topish.
 */
// Profil ID bo'yicha olinadi, INDEKS bilan emas.
//
// Ilgari bu funksiya `XRAY_REAKSIYALAR[4]` kabi indekslarni qaytarardi.
// Ro'yxatga yangi profil o'rtaga qo'shilsa, barcha indekslar siljib
// ketardi va reaksiya JIM boshqa molekulani ko'rsatardi — xato
// bermasdan, noto'g'ri kimyo o'rgatib.
function idBoyicha(id) {
  const topilgan = XRAY_REAKSIYALAR.find((x) => x.id === id);
  if (!topilgan && process.env.NODE_ENV !== "production") {
    console.warn(`[xray] profil topilmadi: ${id}`);
  }
  return topilgan || XRAY_REAKSIYALAR[0];
}

export function xrayProfiliniTop(reaksiyaTenglamasi = "") {
  const t = String(reaksiyaTenglamasi).toLowerCase();
  // TARTIB MUHIM: aniqroq shart oldin turadi. Parchalanish tenglamasi
  // "cu(oh)2" ni o'z ichiga oladi, shuning uchun u cho'kmadan OLDIN
  // tekshiriladi — aks holda qizdirish reaksiyasi cho'kma
  // profilini ko'rsatardi.
  if (t.includes("cuo") && t.includes("cu(oh)2")) return idBoyicha("parchalanish_cuoh2");
  if (t.includes("hcl") && t.includes("naoh")) return idBoyicha("neytrallanish");
  if (t.includes("agcl") || (t.includes("agno3") && t.includes("nacl"))) return idBoyicha("chokma_agcl");
  if (t.includes("co2") || t.includes("na2co3") || t.includes("caco3")) return idBoyicha("gaz_co2");
  if (t.includes("zn") && t.includes("cu")) return idBoyicha("orin_olish_zn_cu");
  if (t.includes("cu(oh)2") || (t.includes("cuso4") && t.includes("naoh"))) return idBoyicha("chokma_cuoh2");
  if (t.includes("cooc") || (t.includes("ch3cooh") && t.includes("c2h5oh"))) return idBoyicha("esterifikatsiya");
  return XRAY_REAKSIYALAR[0];
}
