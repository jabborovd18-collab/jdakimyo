// IDISHLAR — sig'im, material va reaksiya ularni yaroqsiz qilishi.
//
// NEGA ALOHIDA JADVAL (`LabVessel`) YARATILMADI. Birinchi qarashda har
// bir idishning o'z holati bo'lishi kerakdek tuyuladi. Lekin idishlar
// ALMASHTIRILADIGAN: "uchta probirkam bor edi, bittasi yaroqsiz bo'ldi,
// ikkita qoldi" — qaysi biri singani hech qayerda ahamiyatga ega emas.
// Sig'im va material esa TURNING xossasi, nusxaning emas.
//
// Ya'ni yaroqsiz bo'lish — bu shunchaki sanoqni kamaytirish, buni
// `inventarSarfla` allaqachon qiladi. Alohida jadval ikkinchi inventar
// tizimi bo'lardi va uni do'kon, sandiq, tajriba bilan sinxronlash kerak
// bo'lardi — aynan biz qochib kelgan narsa.
//
// (Agar kelajakda "iflos idishni yuvish" kerak bo'lsa, u ham nusxa
// talab qilmaydi: `LabItem` ga `iflosSoni` degan sanoq yetadi.)
//
// SIG'IMLAR SHU YERDA, 3D MODELLARIDA EMAS. Ilgari ular
// `app/laboratoriya/3d/lib/jihoz-modellari.js` da edi — lekin u fayl
// Three.js ni import qiladi va serverdan o'qib bo'lmaydi. Sig'im esa
// endi server tekshiruvi: idishga sig'maydigan miqdorni quyib bo'lmaydi.

/**
 * Materiallar va ularning chidamliligi.
 *
 * Qiymatlar haqiqiy: oddiy laboratoriya shishasi 500 °C atrofida
 * yumshaydi, chinni 1200 °C gacha chidaydi, kvarts 1600 °C gacha.
 * Ftorid kislota (HF) esa aynan SiO₂ ni eritadi — shishani ham,
 * kvartsni ham, lekin chinni va metallga tegmaydi.
 */
export const MATERIALLAR = {
  shisha: {
    nom: "Shisha",
    engYuqoriHarorat: 500,
    hfChidaydi: false,
    ishqorChidaydi: false,
  },
  chinni: {
    nom: "Chinni",
    engYuqoriHarorat: 1200,
    hfChidaydi: true,
    ishqorChidaydi: true,
  },
  kvarts: {
    nom: "Kvarts",
    engYuqoriHarorat: 1600,
    // Kvarts ham SiO₂ — HF uni ham eritadi.
    hfChidaydi: false,
    ishqorChidaydi: true,
  },
  metall: {
    nom: "Metall",
    engYuqoriHarorat: 1500,
    hfChidaydi: true,
    ishqorChidaydi: true,
  },
  qogoz: {
    nom: "Qog'oz",
    engYuqoriHarorat: 150,
    hfChidaydi: false,
    ishqorChidaydi: false,
  },
};

export const SUKUT_MATERIAL = "shisha";

/**
 * Idishlar: sig'im (ml) va material.
 *
 * Sig'imi noldan katta bo'lgan buyum — idish, ya'ni unga quyish mumkin.
 * Shtativ, termometr va spirtovka bu ro'yxatda yo'q: ularga hech narsa
 * quyilmaydi.
 */
export const IDISHLAR = {
  // ── Shisha idishlar ──
  probirka: { sigim: 25, material: "shisha" },
  stakan: { sigim: 100, material: "shisha" },
  kolba: { sigim: 120, material: "shisha" },
  "olchov-kolba": { sigim: 100, material: "shisha" },
  "olchov-silindr": { sigim: 50, material: "shisha" },
  "soat-shishasi": { sigim: 20, material: "shisha" },
  "konussimon-kolba": { sigim: 120, material: "shisha" },
  "dumaloq-tubli-kolba": { sigim: 150, material: "shisha" },
  kristallizator: { sigim: 80, material: "shisha" },

  // ── O'lchov asboblari ──
  byuretka: { sigim: 50, material: "shisha" },
  pipetka: { sigim: 25, material: "shisha" },
  tomizgich: { sigim: 5, material: "shisha" },

  // ── Ajratish ──
  voronka: { sigim: 30, material: "shisha" },
  "tomizuvchi-voronka": { sigim: 60, material: "shisha" },

  // ── Chinni: issiqqa va ishqorga chidaydi ──
  "chinni-kosacha": { sigim: 40, material: "chinni" },
  "shamotli-tigel": { sigim: 30, material: "chinni" },

  // ── Kvarts: eng issiqbardosh, lekin HF uni ham eritadi ──
  "kvars-naycha": { sigim: 20, material: "kvarts" },
};

/** Sig'imi ma'lum bo'lmagan idish uchun — 3D dagi zaxira model bilan bir xil */
export const SUKUT_SIGIM = 100;

/** Shu kalit idishmi (unga quyish mumkinmi). */
export function idishmi(kalit) {
  return Object.prototype.hasOwnProperty.call(IDISHLAR, kalit);
}

/** Idish xossalari; idish bo'lmasa null. */
export function idishOl(kalit) {
  return IDISHLAR[kalit] ?? null;
}

/** Idish sig'imi (ml). Noma'lum bo'lsa zaxira qiymat. */
export function idishSigimi(kalit) {
  return IDISHLAR[kalit]?.sigim ?? SUKUT_SIGIM;
}

/** Idish materialining xossalari. */
export function idishMateriali(kalit) {
  const material = IDISHLAR[kalit]?.material ?? SUKUT_MATERIAL;
  return MATERIALLAR[material] ?? MATERIALLAR[SUKUT_MATERIAL];
}

// ─────────────────────────────────────────────────────────────
// REAKSIYA IDISHNI YAROQSIZ QILADIMI
// ─────────────────────────────────────────────────────────────
//
// Uchta sabab, uchalasi ham bazadagi haqiqiy maydonlardan o'qiladi:
//
//   1. HF — ftorid kislota shishani (SiO₂) eritadi. Bazada u bitta
//      reaksiyada hosil bo'ladi: 2F₂ + 2H₂O → 4HF + O₂↑
//   2. Yuqori harorat — 212 ta reaksiyada `temperature` to'ldirilgan,
//      shundan 26 tasi 500 °C dan yuqori. Oddiy shisha buni ko'tarmaydi.
//   3. Qizdirilgan ishqor — shishani yemiradi. Faqat harorat bilan
//      birga: xona haroratidagi NaOH eritmasi shishaga zarar qilmaydi.

/** Qizdirilgan ishqor shishani yemira boshlaydigan harorat (°C) */
const ISHQOR_HARORATI = 300;

/** Shishani eritadigan moddalar */
const YEMIRUVCHI = ["HF"];

function matnniTozala(x) {
  return String(x ?? "")
    .toLowerCase()
    .replace(/['‘’`´]/g, "'");
}

/**
 * `temperature` matnidan eng yuqori sonni ajratadi.
 * "400-500°C" → 500, "1200 °C" → 1200, bo'sh bo'lsa 0.
 */
export function haroratniOqi(matn) {
  const sonlar = String(matn ?? "").match(/\d{2,4}/g);
  if (!sonlar) return 0;
  return Math.max(...sonlar.map(Number));
}

/**
 * Reaksiya shu idishni yaroqsiz qiladimi.
 *
 * @param {object} reaksiya — keshdagi reaksiya (temperature, environment)
 * @param {string[]} moddalar — ishtirok etgan barcha kalitlar (chap va o'ng)
 * @param {string} idishKaliti
 * @returns {{buziladimi: boolean, sabab: string|null}}
 */
export function idishXavfi(reaksiya, moddalar = [], idishKaliti) {
  const material = idishMateriali(idishKaliti);
  const harorat = haroratniOqi(reaksiya?.temperature);
  const muhit = matnniTozala(reaksiya?.environment);

  // 1. Ftorid kislota
  if (!material.hfChidaydi && moddalar.some((m) => YEMIRUVCHI.includes(m))) {
    return {
      buziladimi: true,
      sabab:
        `Ftorid kislota ${material.nom.toLowerCase()}ni eritadi — SiO₂ bilan ` +
        "reaksiyaga kirishadi. Bunday ish uchun chinni yoki plastik idish kerak.",
    };
  }

  // 2. Harorat
  if (harorat > material.engYuqoriHarorat) {
    return {
      buziladimi: true,
      sabab:
        `${harorat} °C — ${material.nom.toLowerCase()} idish ` +
        `${material.engYuqoriHarorat} °C dan yuqorisiga chidamaydi va shaklini yo'qotdi. ` +
        "Chinni tigel yoki kvarts naycha kerak edi.",
    };
  }

  // 3. Qizdirilgan ishqor
  if (
    !material.ishqorChidaydi &&
    harorat >= ISHQOR_HARORATI &&
    (muhit.includes("ishqor") || muhit.includes("suyuqlantirilgan"))
  ) {
    return {
      buziladimi: true,
      sabab:
        `Qizdirilgan ishqor ${material.nom.toLowerCase()}ni yemiradi — ` +
        "idish ichkaridan xiralashib yaroqsiz holga keldi.",
    };
  }

  return { buziladimi: false, sabab: null };
}

/** Katalogga yoziladigan xossalar — seed skripti shuni oladi. */
export function idishKatalogXossalari(kalit) {
  const idish = IDISHLAR[kalit];
  if (!idish) return null;
  return { sigim: idish.sigim, material: idish.material };
}
