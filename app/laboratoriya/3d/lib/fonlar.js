// 3D laboratoriya foni (mavzu) ta'riflari.
//
// Nega kerak: sahna faqat qop-qorong'i edi va to'q rangli reagentlar —
// CuO (0x111827), C (0x0f172a), I₂ (0x4c1d95) — qora fonda umuman
// ajralmasdi. Aksincha oq cho'kmalar (AgCl, BaSO₄) yorug' fonda
// yo'qoladi. Bitta "to'g'ri" fon yo'q, shuning uchun tanlov beriladi.
//
// Har bir mavzu SAHNANING hamma rang manbasini belgilaydi: fon, tuman,
// orqa devor, stol, shisha va uchala yorug'lik. Ular useSahna da bitta
// joyda qo'llanadi — yangi mavzu qo'shish uchun shu faylga yozish kifoya.

export const FONLAR = {
  qorongi: {
    nom: "Qorong'u",
    belgi: "🌙",
    izoh: "Yorqin va och rangli eritmalar uchun",
    fon: 0x0b0714,
    tumanZichligi: 0.085,
    devor: 0x181324,
    stol: 0x2a2438,
    shisha: 0xcfe8ff,
    // Sahna ustidagi yordam yozuvlari fonga qarab o'qilishi kerak
    matnQorongi: false,
    yorugliklar: {
      muhit: { rang: 0x404060, kuch: 0.9 },
      asosiy: { rang: 0xfffbeb, kuch: 1.4 },
      toldiruvchi: { rang: 0xa78bfa, kuch: 0.6 },
    },
  },

  oq: {
    nom: "Oq",
    belgi: "☀️",
    izoh: "To'q rangli moddalar va cho'kmalar uchun",
    fon: 0xeef2f7,
    // Oq fonda quyuq tuman sahnani oqartirib yuboradi — zichlik pasaytirilgan
    tumanZichligi: 0.04,
    devor: 0xdbe3ee,
    stol: 0xb9c3d1,
    // Oq fonda och-havorang shisha ko'rinmaydi, shuning uchun ko'kroq
    shisha: 0x9dbede,
    matnQorongi: true,
    yorugliklar: {
      muhit: { rang: 0xffffff, kuch: 1.5 },
      asosiy: { rang: 0xffffff, kuch: 1.6 },
      toldiruvchi: { rang: 0xdbeafe, kuch: 0.5 },
    },
  },

  kulrang: {
    nom: "Kulrang",
    belgi: "⬜",
    izoh: "Neytral studiya foni — hamma rang bir xil ko'rinadi",
    fon: 0x7a8290,
    tumanZichligi: 0.05,
    devor: 0x6b7280,
    stol: 0x4b5563,
    shisha: 0xd8e6f2,
    matnQorongi: false,
    yorugliklar: {
      muhit: { rang: 0xf1f5f9, kuch: 1.2 },
      asosiy: { rang: 0xffffff, kuch: 1.5 },
      toldiruvchi: { rang: 0xcbd5e1, kuch: 0.55 },
    },
  },

  kok: {
    nom: "Ko'k",
    belgi: "🌊",
    izoh: "Sariq, to'q sariq va qizil eritmalar uchun",
    fon: 0x0f2b45,
    tumanZichligi: 0.07,
    devor: 0x123754,
    stol: 0x1e3a5f,
    shisha: 0xd6ecff,
    matnQorongi: false,
    yorugliklar: {
      muhit: { rang: 0x5f7f9f, kuch: 1.0 },
      asosiy: { rang: 0xfff8e7, kuch: 1.45 },
      toldiruvchi: { rang: 0x7dd3fc, kuch: 0.55 },
    },
  },
};

export const SUKUT_FON = "qorongi";

// Tanlov brauzerda saqlanadi: fon shaxsiy did masalasi va uni har safar
// qayta tanlash kerak bo'lsa, tanlovning ma'nosi qolmaydi. Serverga
// yozilmaydi — bu sozlama hisobga emas, qurilma ekraniga bog'liq.
export const FON_SAQLASH_KALITI = "jda-lab3d-fon";

/** Noma'lum kalit kelsa ham har doim ishlaydigan mavzu qaytariladi. */
export function fonOl(kalit) {
  return FONLAR[kalit] || FONLAR[SUKUT_FON];
}

export function fonKalitiOqi() {
  if (typeof window === "undefined") return SUKUT_FON;
  try {
    const saqlangan = window.localStorage.getItem(FON_SAQLASH_KALITI);
    return saqlangan && FONLAR[saqlangan] ? saqlangan : SUKUT_FON;
  } catch {
    // Maxfiylik rejimida localStorage o'qish ham xato tashlashi mumkin
    return SUKUT_FON;
  }
}

export function fonKalitiniSaqla(kalit) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FON_SAQLASH_KALITI, kalit);
  } catch {
    // Saqlanmasa ham sahna ishlayveradi
  }
}

/** CSS uchun: 0x0b0714 → "#0b0714" */
export function hexCss(hex) {
  return `#${Number(hex || 0).toString(16).padStart(6, "0")}`;
}
