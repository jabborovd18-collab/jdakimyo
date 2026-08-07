// Kuzatuv matnini (observations) vizual 3D effektlar massiviga aylantirish funksiyalari.
// Nega: server faqat o'zbek tilidagi matn ("och ko'k cho'kma tushadi") qaytaradi,
// biz uni tahlil qilib, 3D sahnada qanday zarra va ranglar o'ynashini belgilaymiz.

const RANGLAR_LUGATI = [
  { kalit: "qizil-jigarrang", rang: 0x9a3412 },
  { kalit: "yashil-ko'k", rang: 0x0d9488 },
  { kalit: "oq", rang: 0xffffff },
  { kalit: "qora", rang: 0x1e293b },
  { kalit: "qizil", rang: 0xdc2626 },
  { kalit: "sariq", rang: 0xeab308 },
  { kalit: "yashil", rang: 0x16a34a },
  { kalit: "ko'k", rang: 0x2563eb },
  { kalit: "pushti", rang: 0xec4899 },
  { kalit: "jigarrang", rang: 0x92400e },
  { kalit: "binafsha", rang: 0x7e22ce },
  { kalit: "rangsiz", rang: 0xffffff },
];

// O'zbek tilidagi apostroflar har xil yozilishi mumkin (' ‘ ’ `). Barchasini bitta ' ga
// keltirib, kichik harfga o'tkazish orqali qidiruv barqarorligini ta'minlaymiz.
function matnniTozala(matn = "") {
  return String(matn)
    .toLowerCase()
    .replace(/['‘’`´]/g, "'");
}

// Stexiometriya holatiga qarab effekt kuchini hisoblash: chala yoki keskin ortiqcha bo'lsa
// cho'kma va pufakchalar kamroq yoki yupqaroq ko'rinadi.
function hisoblaKuch(nisbatBahosi) {
  const holat = nisbatBahosi?.holat || "togri";
  switch (holat) {
    case "chala":
      return 0.3;
    case "togri":
      return 1.0;
    case "ortiqcha":
      return 0.7;
    case "keskin-ortiqcha":
      return 0.4;
    default:
      return 1.0;
  }
}

// Matn ichidan rang so'zini aniqlash: eng birinchi topilgan mos rangni qaytaradi.
function rangniTop(matn, standartRang = 0xffffff) {
  for (let i = 0; i < RANGLAR_LUGATI.length; i++) {
    if (matn.includes(RANGLAR_LUGATI[i].kalit)) {
      return RANGLAR_LUGATI[i].rang;
    }
  }
  return standartRang;
}

export function effektlarniAniqla(observations = "", nisbatBahosi = null) {
  const matn = matnniTozala(observations);
  const kuch = hisoblaKuch(nisbatBahosi);
  const topilganRang = rangniTop(matn, 0xffffff);
  const effektlar = [];

  // Cho'kma effekti
  if (
    matn.includes("cho'kma") ||
    matn.includes("cho'kadi") ||
    matn.includes("jelesimon")
  ) {
    effektlar.push({
      turi: "chokma",
      rang: topilganRang,
      kuch,
      kechikish: 0.4,
    });
  }

  // Gaz pufakchalari effekti
  if (
    matn.includes("gaz") ||
    matn.includes("pufakcha") ||
    matn.includes("ajraladi") ||
    matn.includes("ko'pik")
  ) {
    effektlar.push({
      turi: "pufak",
      rang: 0xffffff,
      kuch,
      kechikish: 0.1,
    });
  }

  // Bug' yoki hovur
  if (matn.includes("bug'") || matn.includes("hovur")) {
    effektlar.push({
      turi: "bug",
      rang: 0xe2e8f0,
      kuch,
      kechikish: 0.2,
    });
  }

  // Hid to'lqini
  if (matn.includes("hid")) {
    effektlar.push({
      turi: "hid",
      rang: 0xc4b5fd,
      kuch: Math.min(1, kuch * 0.8),
      kechikish: 0.5,
    });
  }

  // Qizish / issiqlik ajralishi
  if (
    matn.includes("issiqlik") ||
    matn.includes("qiziydi") ||
    matn.includes("isiydi")
  ) {
    effektlar.push({
      turi: "qizish",
      rang: 0xf97316,
      kuch,
      kechikish: 0.3,
    });
  }

  // Alanga
  if (
    matn.includes("alanga") ||
    matn.includes("yonadi") ||
    matn.includes("shiddatli")
  ) {
    effektlar.push({
      turi: "alanga",
      rang: 0xfb923c,
      kuch,
      kechikish: 0.0,
    });
  }

  // Loyqalanish
  if (matn.includes("loyqa") || matn.includes("xiralashadi")) {
    effektlar.push({
      turi: "loyqa",
      rang: topilganRang,
      kuch,
      kechikish: 0.2,
    });
  }

  // Tiniqlashish
  if (matn.includes("tiniqlashadi") || matn.includes("rangsizlanadi")) {
    effektlar.push({
      turi: "tiniq",
      rang: 0xffffff,
      kuch,
      kechikish: 0.3,
    });
  }

  // Holat o'zgarishi
  if (matn.includes("eriydi") || matn.includes("qattiqlashadi")) {
    effektlar.push({
      turi: "holat",
      rang: topilganRang,
      kuch,
      kechikish: 0.4,
    });
  }

  // Indikator o'zgarishi
  if (
    matn.includes("lakmus") ||
    matn.includes("fenolftalein") ||
    matn.includes("ph")
  ) {
    effektlar.push({
      turi: "indikator",
      rang: topilganRang,
      kuch,
      kechikish: 0.1,
    });
  }

  // Agar matnda rang o'zgarishi aytilgan bo'lsa
  for (let i = 0; i < RANGLAR_LUGATI.length; i++) {
    if (matn.includes(RANGLAR_LUGATI[i].kalit)) {
      const bor = effektlar.some((e) => e.turi === "rang");
      if (!bor) {
        effektlar.push({
          turi: "rang",
          rang: RANGLAR_LUGATI[i].rang,
          kuch,
          kechikish: 0.0,
        });
      }
      break;
    }
  }

  // Hech narsa topilmasa bo'sh massiv EMAS: foydalanuvchi tugma bosilganda
  // vizual harakat ko'rishi kerak, aks holda u "tizim ishlamadi" deb o'ylaydi.
  if (effektlar.length === 0) {
    return [
      {
        turi: "aralashish",
        rang: 0xffffff,
        kuch: 1.0,
        kechikish: 0.0,
      },
    ];
  }

  // Maksimal 4 ta effekt bilan cheklaymiz: ortiqcha zarrachalar render tezligini tushiradi.
  return effektlar.slice(0, 4);
}