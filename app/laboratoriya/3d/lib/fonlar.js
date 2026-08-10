// 3D sahnaning fon (mavzu) ta'riflari.
//
// Nega kerak: sahna faqat qop-qorong'i bo'lsa, to'q rangli reagentlar —
// CuO (0x111827), C (0x0f172a), I₂ (0x4c1d95) — umuman ajralmaydi.
// Aksincha oq cho'kmalar (AgCl, BaSO₄) yorug' fonda yo'qoladi. Bitta
// "to'g'ri" fon yo'q, shuning uchun to'rttasi bor.
//
// KALITLAR SAYT FONI BILAN BIR XIL. Ilgari bu yerda o'z nomlari
// (qorongi, oq, kulrang, kok), o'z tanlagichi va o'z localStorage kaliti
// bor edi — ya'ni saytda ikkita mustaqil fon tizimi yashardi. Natijada
// laboratoriyada "Oq" tanlansa, oq sahna to'q binafsha interfeys ichida
// qolardi: xususiyat canvas'gacha yetgan, sahifagacha yetmagan.
//
// Endi kalit `lib/sahifa-fon.js` dagi identifikator bilan bir xil va
// tanlagich bitta — `components/FonTanlagich.jsx`. Bu fayl faqat "shu
// mavzuda SAHNA qanday ko'rinadi" degan savolga javob beradi.
//
// Sahna rangi sahifa rangining aynan nusxasi EMAS, balki uning oilasidan:
// canvas — xonaga qaralgan deraza, interfeysning davomi emas. Yorug'lik
// darajasi esa ataylab har xil, chunki maqsad kimyoviy — to'rtta mavzu
// to'rt xil o'qilishni beradi:
//   tun     — eng to'q, yorqin eritmalar uchun
//   siyoh   — to'q binafsha, saytning eski ohangi
//   grafit  — neytral va ochroq, to'q moddalar shu yerda ko'rinadi
//   kunduz  — yorug', oq cho'kmalar uchun

export const FONLAR = {
  tun: {
    nom: "Tun",
    izoh: "Eng to'q — yorqin va och rangli eritmalar uchun",
    fon: 0x070a12,
    tumanZichligi: 0.085,
    devor: 0x0e1424,
    stol: 0x1c2334,
    pol: 0x090c15,
    shisha: 0xcfe8ff,
    muhitKuchi: 0.35,
    yorugliklar: {
      muhit: { rang: 0x404060, kuch: 0.9 },
      asosiy: { rang: 0xfffbeb, kuch: 1.4 },
      toldiruvchi: { rang: 0xa78bfa, kuch: 0.6 },
    },
  },

  siyoh: {
    nom: "Siyohrang",
    izoh: "To'q binafsha — sariq va to'q sariq eritmalar uchun",
    fon: 0x140b28,
    tumanZichligi: 0.075,
    devor: 0x1d1138,
    stol: 0x2a1c4a,
    pol: 0x170d2c,
    shisha: 0xd6ecff,
    muhitKuchi: 0.42,
    yorugliklar: {
      muhit: { rang: 0x5b4a86, kuch: 1.0 },
      asosiy: { rang: 0xfff8e7, kuch: 1.45 },
      toldiruvchi: { rang: 0x67e8f9, kuch: 0.55 },
    },
  },

  grafit: {
    nom: "Grafit",
    izoh: "Neytral va ochroq — CuO, uglerod, yod shu yerda ko'rinadi",
    // Ataylab sahifadan (#101114) ancha ochroq: to'q moddalar to'q fonda
    // yo'qoladi va aynan shu mavzu ular uchun mavjud.
    fon: 0x3a3e45,
    tumanZichligi: 0.055,
    devor: 0x33373d,
    stol: 0x4b5058,
    pol: 0x2c3036,
    shisha: 0xd8e6f2,
    muhitKuchi: 0.8,
    yorugliklar: {
      muhit: { rang: 0xf1f5f9, kuch: 1.15 },
      asosiy: { rang: 0xffffff, kuch: 1.5 },
      toldiruvchi: { rang: 0xcbd5e1, kuch: 0.55 },
    },
  },

  kunduz: {
    nom: "Kunduz",
    izoh: "Yorug' — oq cho'kmalar (AgCl, BaSO₄) uchun",
    fon: 0xeef1f7,
    // Oq fonda quyuq tuman sahnani oqartirib yuboradi — zichlik pasaytirilgan
    tumanZichligi: 0.04,
    devor: 0xdbe3ee,
    stol: 0xb9c3d1,
    pol: 0xdfe5ec,
    // Oq fonda och-havorang shisha ko'rinmaydi, shuning uchun ko'kroq
    shisha: 0x9dbede,
    muhitKuchi: 1.0,
    yorugliklar: {
      muhit: { rang: 0xffffff, kuch: 1.5 },
      asosiy: { rang: 0xffffff, kuch: 1.6 },
      toldiruvchi: { rang: 0xdbeafe, kuch: 0.5 },
    },
  },
};

// `lib/sahifa-fon.js` dagi ODDIY_FON bilan bir xil bo'lishi shart.
export const SUKUT_FON = "tun";

/** Noma'lum kalit kelsa ham har doim ishlaydigan mavzu qaytariladi. */
export function fonOl(kalit) {
  return FONLAR[kalit] || FONLAR[SUKUT_FON];
}

/** CSS uchun: 0x070a12 → "#070a12" */
export function hexCss(hex) {
  return `#${Number(hex || 0).toString(16).padStart(6, "0")}`;
}
