// JDA Kimyo AI so'rovlarini tezkor, oddiy va murakkab yo'nalishga ajratadi.
// Nega alohida modul: UI, orkestrator va gateway bir xil chegaralarni ishlatishi
// kerak; aks holda foydalanuvchiga ko'rsatilgan rejim haqiqiy model yo'lidan uziladi.

export const AI_YONALISH_TANLOVLARI = Object.freeze([
  "avtomatik",
  "tezkor",
  "oddiy",
  "murakkab",
]);

export const AI_YONALISH_SOZLAMALARI = Object.freeze({
  tezkor: Object.freeze({
    id: "tezkor",
    nom: "Tez javob",
    tavsif: "Qisqa suhbat va sodda nazariy savol",
    urinishChegarasi: 2,
    urinishVaqtiMs: 8_000,
    umumiyVaqtMs: 14_000,
    tokenChegarasi: 800,
  }),
  oddiy: Object.freeze({
    id: "oddiy",
    nom: "Oddiy yechim",
    tavsif: "DTM va standart hisoblash masalasi",
    urinishChegarasi: 2,
    urinishVaqtiMs: 16_000,
    umumiyVaqtMs: 30_000,
    tokenChegarasi: 2_500,
  }),
  murakkab: Object.freeze({
    id: "murakkab",
    nom: "Chuqur yechim",
    tavsif: "Olimpiada va ko'p bosqichli masala",
    urinishChegarasi: 2,
    urinishVaqtiMs: 26_000,
    umumiyVaqtMs: 48_000,
    tokenChegarasi: 4_000,
  }),
});

const HISOBLASH_BELGILARI = [
  "toping", "hisoblang", "aniqlang", "necha gramm", "necha litr", "necha foiz",
  "necha mol", "nechta atom", "nechta molekula", "molyar massasi", "massaviy ulushi",
  "hajmi", "unumi", "eritma tayyorlash", "necha ml", "a)", "b)", "c)", "d)",
  "a )", "b )", "c )", "d )",
];

const OLIMPIADA_SOZLARI = [
  "noma'lum modda", "zanjir", "izotop", "kvant son", "proton", "neytron",
  "elektron konfiguratsiya", "qotishma", "aralashma tarkibi", "x modda", "y modda",
];

const TERMO_SOZLARI = [
  "entalpiya", "issiqlik effekti", "reaksiya tezligi", "vant-goff", "muvozanat",
  "le shatelye", "k_c", "k_p", "koeffitsiyent gamma", "kj", "kkal",
];

const ANORGANIK_SOZLARI = [
  "cho'kma", "gidroliz", "ph", "muhit", "amfoter", "ionli tenglama",
  "sifat reaksiya", "tvorogsimon", "tuz gidrolizi",
];

const ORGANIK_SOZLARI = [
  "gomolog", "izomer", "metil", "etil", "alkan", "alken", "alkin", "dien", "aren",
  "benzol", "spirt", "aldegid", "keton", "karbon kislota", "efir", "uglevod", "oqsil",
  "aminokislota", "geksan", "pentan", "butan", "propan", "metan", "tsiklo",
];

const ERITMA_SOZLARI = [
  "eritma", "eruvchanlik", "massaviy ulush", "molyar konsentratsiya", "kristallogidrat",
  "kuporos", "suv qo'shildi", "bug'latildi", "cho'kma tushdi", "titr", "erigan", "% li", "w=",
];

const STEXIO_SOZLARI = [
  "reaksiya", "ajraldi", "sarflandi", "koeffitsiyent", "unumi", "elektroliz", "faradey",
  "gaz", "litr", "normal sharoit", "aralashma", "oksidlanish", "qaytarilish", "redoks",
  "ovr", "mollari",
];

const MURAKKABLIK_BELGILARI = [
  "qotishma", "aralashma", "zanjir", "noma'lum", "bosqich", "hosil bo'lgan cho'kma",
  "gazlar aralashmasi", "zichligi bo'yicha", "vodorodga nisbatan zichligi", "geliyga nisbatan",
  "havoga nisbatan", "tenglamalar sistemasi", "nisbiy zichligi", "elektron konfiguratsiya",
  "faradey", "elektroliz", "unum", "ortiqcha", "kamlik", "tuzoq",
];

function birortasiBor(matn, belgilar) {
  return belgilar.some((belgi) => matn.includes(belgi));
}
export function masalaTuriniAniqlash(matn = "") {
  const kichik = String(matn).toLowerCase();
  const hisoblashmi = birortasiBor(kichik, HISOBLASH_BELGILARI)
    || /\d+\s*(g|ml|l|mol|%|kg|litr|gramm)\b/i.test(kichik);

  if (!hisoblashmi) return "suhbat";
  if (birortasiBor(kichik, OLIMPIADA_SOZLARI)) return "olimpiada";
  if (birortasiBor(kichik, TERMO_SOZLARI)) return "termo";
  if (birortasiBor(kichik, ANORGANIK_SOZLARI)) return "anorganik";
  if (birortasiBor(kichik, ORGANIK_SOZLARI)) return "organik";
  if (birortasiBor(kichik, ERITMA_SOZLARI)) return "eritmalar";
  if (birortasiBor(kichik, STEXIO_SOZLARI)) return "stexiometriya";
  return "umumiy";
}

export function otaMurakkabMasalami(matn = "", masalaTuri = "") {
  if (masalaTuri === "suhbat") return false;
  if (masalaTuri === "olimpiada") return true;

  const kichik = String(matn).toLowerCase();
  const belgilarSoni = MURAKKABLIK_BELGILARI.filter((belgi) => kichik.includes(belgi)).length;
  return belgilarSoni >= 2 || (kichik.length > 160 && belgilarSoni >= 1);
}

export function aiYonalishniAniqlash({
  matn = "",
  rasm = null,
  masalaTuri = null,
  tanlov = "avtomatik",
} = {}) {
  const xavfsizTanlov = AI_YONALISH_TANLOVLARI.includes(tanlov) ? tanlov : "avtomatik";
  if (xavfsizTanlov !== "avtomatik") {
    return {
      ...AI_YONALISH_SOZLAMALARI[xavfsizTanlov],
      avtomatik: false,
    };
  }

  const aniqlanganTur = masalaTuri || masalaTuriniAniqlash(matn);
  let id = "oddiy";

  if (aniqlanganTur === "suhbat" && !rasm) {
    id = "tezkor";
  } else if (otaMurakkabMasalami(matn, aniqlanganTur)) {
    id = "murakkab";
  }

  return {
    ...AI_YONALISH_SOZLAMALARI[id],
    avtomatik: true,
  };
}
