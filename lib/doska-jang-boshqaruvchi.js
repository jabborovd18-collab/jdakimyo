// lib/doska-jang-boshqaruvchi.js
//
// Smart Doska — Jamoalar Jangi server hakami va xona boshqaruvchisi.
// Server — yagona haqiqat manbai (AGENTS.md 2-band).
// Barcha ballar va to'g'ri javoblar serverda tekshiriladi; clientga
// to'g'ri javob test tugaguncha berilmaydi (Anti-cheat & Anti-AI).
//
// SAQLASH. Holat omborda yashaydi (lib/doska-jang-ombor.js): production'da
// Postgres, testlarda xotira. Boshqaruvchi ombor turini bilmaydi —
// shuning uchun barcha funksiyalar asinxron.
//
// XAVFSIZLIK QOIDALARI:
//   1. Ustoz harakatlari (boshlash, yakunlash, chetlatish, nom) maxfiy
//      `ustozKalit` siz bajarilmaydi. Kalit faqat xona yaratilganda BIR
//      marta ustoz brauzeriga beriladi.
//   2. Vaqt server soati bilan o'lchanadi — mijoz yuborgan soniyaga
//      ishonilmaydi (uni 0 qilib tie-breaker'ni soxtalashtirish mumkin).
//   3. Jamoa ballari saqlanmaydi — qatnashchilar yig'indisidan hisoblanadi.
//      Aks holda parallel javoblar bir-birini o'chiradi.

import crypto from "crypto";
import { ADSORBSIYA_SAVOLLARI } from "../data/doska/adsorbsiya-savollar.js";
import { omborniOl, TakrorXonaXatosi, ichkiXonaniOl } from "./doska-jang-ombor.js";

/** Jamoa standart ranglari va nomlari */
export const STANDART_JAMOALAR = [
  { id: 1, nom: "Kationlar", rang: "emerald", hex: "#10b981", suyuqlikRang: "#34d399" },
  { id: 2, nom: "Anionlar", rang: "sky", hex: "#0284c7", suyuqlikRang: "#38bdf8" },
  { id: 3, nom: "Radikallar", rang: "amber", hex: "#f59e0b", suyuqlikRang: "#fbbf24" },
  { id: 4, nom: "Komplekslar", rang: "rose", hex: "#f43f5e", suyuqlikRang: "#fb7185" },
];

/** Turli mavzulardagi kimyoviy shablonlar (o'qituvchi qiziqarli nomlar tanlashi uchun) */
export const JAMOA_SHABLONLARI = [
  { id: "adsorbsiya", nom: "Adsorbsiya", jamoalar: ["Adsorbentlar", "Adsorbatlar", "Desorbsiya", "G'ovaklar"] },
  { id: "sirt", nom: "Sirt xossalari", jamoalar: ["Gidrofillar", "Gidrofoblar", "Amfifillar", "Mitsellalar"] },
  { id: "olimlar", nom: "Buyuk Olimlar", jamoalar: ["Lengmyurchilar", "Freyndlixchilar", "BET jamoasi", "Gibbschilar"] },
  { id: "ionlar", nom: "Ionlar & Zaryad", jamoalar: ["Kationlar", "Anionlar", "Radikallar", "Komplekslar"] },
  { id: "kinetika", nom: "Kinetika", jamoalar: ["Katalizatorlar", "Ingibitorlar", "Aktivatorlar", "Promotorlar"] },
  { id: "fizkimyo", nom: "Fizikaviy kimyo", jamoalar: ["Kvantlar", "Fotonlar", "Orbitallar", "Izotoplar"] },
];

/** Har bir savolga ajratilgan maksimal vaqt — server o'lchovi shu bilan chegaralanadi */
const SAVOL_MAKS_SONIYA = 30;

/** PIN band bo'lsa necha marta qayta urinish (har safar yangi tasodifiy PIN) */
const PIN_URINISH = 10;

/** Massiv elementlarini tasodifiy aralashtirish (Fisher-Yates) */
function aralashtir(massiv) {
  const nusxa = [...massiv];
  for (let i = nusxa.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nusxa[i], nusxa[j]] = [nusxa[j], nusxa[i]];
  }
  return nusxa;
}

/** 80 talik bazadan 20 ta savolni kvotali random qilib tanlash */
function tanlaKvotaliSavollar() {
  const d1 = ADSORBSIYA_SAVOLLARI.filter((s) => s.daraja === 1);
  const d2 = ADSORBSIYA_SAVOLLARI.filter((s) => s.daraja === 2);
  const d3 = ADSORBSIYA_SAVOLLARI.filter((s) => s.daraja === 3);

  // Kvotalar: 8 ta oson, 8 ta o'rta, 4 ta murakkab
  const tanlanganD1 = aralashtir(d1).slice(0, 8);
  const tanlanganD2 = aralashtir(d2).slice(0, 8);
  const tanlanganD3 = aralashtir(d3).slice(0, 4);

  const jami = aralashtir([...tanlanganD1, ...tanlanganD2, ...tanlanganD3]);

  // Har bir savolning variantlarini ham aralashtiramiz, lekin to'g'ri indeksni
  // SERVERDA xavfsiz saqlaymiz:
  return jami.map((s, index) => {
    const togriVariantMatni = s.variantlar[s.togriJavob];
    const aralashVariantlar = aralashtir(s.variantlar);
    const yangiTogriIndex = aralashVariantlar.indexOf(togriVariantMatni);

    return {
      tartibRaqam: index + 1,
      id: s.id,
      savol: s.savol,
      bolim: s.bolim,
      variantlar: aralashVariantlar,
      daraja: s.daraja,
      slayd: s.slayd,
      izoh: s.izoh,
      // Faqat serverda tekshirish uchun:
      _maxfiyTogriIndex: yangiTogriIndex,
    };
  });
}

/** Ustoz kaliti xeshi — bazada kalitning o'zi emas, xeshi saqlanadi */
function kalitXeshi(kalit) {
  return crypto.createHash("sha256").update(String(kalit || "")).digest("hex");
}

/** Ruxsat xatosi — API buni 403 ga aylantiradi */
function ruxsatXatosi(xabar = "Bu amal uchun ustoz kaliti kerak") {
  const e = new Error(xabar);
  e.kod = "RUXSAT";
  return e;
}

/**
 * Ustoz harakatidan oldin kalitni tekshiradi.
 // timingSafeEqual — kalitni belgi-belgi topishga urinish (timing hujumi)
 // ishlamasligi uchun taqqoslash vaqti kalitga bog'liq bo'lmaydi.
 */
async function ustozniTekshir(xonaId, ustozKalit) {
  const ombor = omborniOl();
  const xona = await ombor.xonaniOl(xonaId);
  if (!xona) throw new Error("Xona topilmadi");
  if (!ustozKalit) throw ruxsatXatosi();
  const kutilgan = Buffer.from(xona.ustozKalitHash || "", "hex");
  const kelgan = Buffer.from(kalitXeshi(ustozKalit), "hex");
  if (kutilgan.length !== kelgan.length || !crypto.timingSafeEqual(kutilgan, kelgan)) {
    throw ruxsatXatosi("Ustoz kaliti noto'g'ri — bu xonani boshqara olmaysiz");
  }
  return xona;
}

/** Yangi jang xonasi yaratish */
export async function yangiXonaYarat(mavzuId = "sirt-hodisalari-adsorbsiya", jamoalarSoni = 2, maxsusNomlar = []) {
  const ombor = omborniOl();
  const soni = Math.min(4, Math.max(1, Number(jamoalarSoni) || 2));

  const jamoalar = STANDART_JAMOALAR.slice(0, soni).map((j, idx) => {
    const berilganNom = Array.isArray(maxsusNomlar) && maxsusNomlar[idx] ? String(maxsusNomlar[idx]).trim().slice(0, 25) : null;
    return { ...j, nom: berilganNom || j.nom };
  });

  // Ustoz kaliti — 32 bayt tasodifiy. Faqat xona egasi biladi va faqat
  // shu javobda BIR marta qaytariladi; boshqa hech qayerda ko'rinmaydi.
  const ustozKalit = crypto.randomBytes(32).toString("base64url");

  // PIN tasodifiy — band bo'lsa eskisini O'CHIRMAYDI, yangisini tanlaydi.
  // Avvalgi kod to'qnashuvda eski xonani o'chirib yuborardi (ma'lumot yo'qolishi).
  let oxirgiXato = null;
  for (let urinish = 0; urinish < PIN_URINISH; urinish++) {
    const xonaId = String(Math.floor(100000 + Math.random() * 900000));
    try {
      await ombor.xonaYarat({
        xonaId, mavzuId, jamoalarSoni: soni, jamoalar,
        ustozKalitHash: kalitXeshi(ustozKalit),
      });
      return { xonaId, ustozKalit, mavzuId, holat: "lobby", jamoalarSoni: soni, jamoalar };
    } catch (e) {
      if (e instanceof TakrorXonaXatosi) {
        oxirgiXato = e;
        continue;
      }
      throw e;
    }
  }
  throw oxirgiXato || new Error("Xona ochilmadi — qayta urinib ko'ring");
}

/** Jamoa nomini yangilash (faqat ustoz kaliti bilan) */
export async function jamoaNominiYangila(xonaId, jamoaId, yangiNom, ustozKalit) {
  const ombor = omborniOl();
  const xona = await ustozniTekshir(xonaId, ustozKalit);
  const tozalangan = String(yangiNom || "").trim().slice(0, 25);
  if (!tozalangan) throw new Error("Jamoa nomi bo'sh bo'lishi mumkin emas");

  const jamoalar = Array.isArray(xona.jamoalar) ? xona.jamoalar : [];
  const jamoa = jamoalar.find((j) => j.id === Number(jamoaId));
  if (!jamoa) throw new Error("Bunday jamoa topilmadi");
  jamoa.nom = tozalangan;
  await ombor.xonaYangila(xonaId, { jamoalar });
  return doskaHolatiniOlish(xonaId);
}

/** Xonani topish (ichki — testlar jonli obyekt uchun ichkiXonaniOl ishlatadi) */
export async function xonaniTop(xonaId) {
  return omborniOl().xonaniOl(xonaId);
}

/** Doska ekrani uchun xavfsiz holat ma'lumoti */
export async function doskaHolatiniOlish(xonaId) {
  const ombor = omborniOl();
  const xona = await ombor.xonaniOl(xonaId);
  if (!xona) return null;

  const barchasi = await ombor.xonaQatnashchilariniOl(xonaId);
  const faol = barchasi.filter((q) => !q.chetlatildi);

  const jamoalarNatijasi = (Array.isArray(xona.jamoalar) ? xona.jamoalar : []).map((j) => {
    // JAMOA BALLARI HISOBLANADI (saqlanmaydi): parallel javoblarda yozuv
    // poygasi bo'lmasligi uchun yagona manba — qatnashchilar yig'indisi.
    const azolar = faol.filter((q) => q.jamoaId === j.id);
    const ball = azolar.reduce((sum, q) => sum + (q.ball || 0), 0);
    const suyuqlikMl = Math.min(500, ball);

    let top = null;
    if (azolar.length > 0) {
      const tartibli = [...azolar].sort((a, b) => (b.ball || 0) - (a.ball || 0));
      top = { ism: tartibli[0].ism, ball: tartibli[0].ball || 0 };
    }

    const sarflanganVaqt = azolar.reduce((sum, q) => sum + (q.sarflanganVaqt || 0), 0);
    const qoidabuzarliklar = azolar.reduce((sum, q) => sum + (q.qoidabuzarliklar || 0), 0);

    return {
      ...j,
      ball,
      suyuqlikMl,
      azolariSoni: azolar.length,
      ortachaBall: azolar.length > 0 ? Math.round(ball / azolar.length) : 0,
      sarflanganVaqt,
      ortachaSarflanganVaqt: azolar.length > 0 ? Math.round(sarflanganVaqt / azolar.length) : 0,
      qoidabuzarliklar,
      topIshtirokchi: top,
    };
  });

  // Reyting tartibi va vaqt ustunligi (Tie-Breaker):
  // Ballar teng bo'lganda kamroq vaqt sarflagan jamoa yuqori o'ringa chiqadi
  jamoalarNatijasi.sort((a, b) => {
    if (b.ball !== a.ball) return b.ball - a.ball;
    return a.sarflanganVaqt - b.sarflanganVaqt;
  });

  // Teng ball bo'lib vaqt hisobiga o'zgan jamoaga belgi berish (faqat o'zidan pastdagi teng balli jamoani yutgan bo'lsa)
  jamoalarNatijasi.forEach((j, idx) => {
    const pastdagiTeng = jamoalarNatijasi
      .slice(idx + 1)
      .find((b) => b.ball === j.ball && b.ball > 0);
    j.vaqtUstunligi = !!(pastdagiTeng && j.sarflanganVaqt < pastdagiTeng.sarflanganVaqt);
    j.orin = idx + 1;
  });

  const barchaAzzolar = faol.map((q) => ({
    id: q.id,
    ism: q.ism,
    jamoaId: q.jamoaId,
    ball: q.ball || 0,
    sarflanganVaqtSoniya: q.sarflanganVaqt || 0,
    qoidabuzarliklar: q.qoidabuzarliklar || 0,
    ishlaganSavollar: q.ishlaganSavollar !== undefined
      ? q.ishlaganSavollar
      : Object.keys(q.javoblar || {}).length,
    tugatdi: !!q.tugatdi,
  }));

  const lenta = Array.isArray(xona.jonliLenta) ? xona.jonliLenta : [];
  return {
    xonaId: xona.xonaId,
    mavzuId: xona.mavzuId,
    holat: xona.holat,
    jamoalarSoni: xona.jamoalarSoni,
    jamoalar: jamoalarNatijasi,
    qatnashchilar: barchaAzzolar,
    jonliLenta: lenta.slice(-10),
    boshlanganVaqt: xona.boshlanganVaqt,
  };
}

/** O'quvchi xonaga qo'shilishi */
export async function qatnashchiQosh(xonaId, ism, jamoaId) {
  const ombor = omborniOl();
  const xona = await ombor.xonaniOl(xonaId);
  if (!xona) throw new Error("Bunday xona topilmadi");
  if (xona.holat !== "lobby") {
    if (xona.holat === "jang") {
      throw new Error("Musobaqa allaqachon boshlangan. Yangi yoki kechikkan ishtirokchilar qabul qilinmaydi!");
    }
    throw new Error("Bu musobaqa allaqachon yakunlangan");
  }

  // Faqat ko'zga ko'rinadigan ifloslik tozalanadi (bosh-oyoq bo'shliq,
  // o'ta uzunlik). XSS'dan React'ning o'zi himoya qiladi — ism hech qachon
  // dangerouslySetInnerHTML orqali chiqarilmaydi.
  const tozalanganIsm = String(ism || "").trim().slice(0, 30);
  if (!tozalanganIsm) throw new Error("Ism-familiyangizni kiriting");

  // Agar bir xil ismli o'quvchilar bo'lsa, adashmaslik uchun raqam qo'shish
  const mavjudIsmlar = await ombor.ismlarniOl(xonaId);
  let yakuniyIsm = tozalanganIsm;
  if (mavjudIsmlar.includes(yakuniyIsm)) {
    let sanoq = 2;
    while (mavjudIsmlar.includes(`${yakuniyIsm} (${sanoq})`)) {
      sanoq++;
    }
    yakuniyIsm = `${yakuniyIsm} (${sanoq})`;
  }

  const jId = Math.min(xona.jamoalarSoni, Math.max(1, Number(jamoaId) || 1));
  // Bashorat qilib bo'lmas ID: Math.random ketma-ket qiymatlari taxmin
  // qilinadi, crypto esa yo'q. Bu ID sessiya kaliti vazifasini bajaradi.
  const qatnashchiId = "q_" + crypto.randomBytes(9).toString("hex");

  // O'quvchiga 20 ta maxsus kvotali savollar tanlanadi
  const savollar = tanlaKvotaliSavollar();

  await ombor.qatnashchiQosh({ id: qatnashchiId, xonaId, ism: yakuniyIsm, jamoaId: jId, savollar });

  return { qatnashchiId, ism: yakuniyIsm, jamoaId: jId };
}

/** O'quvchi telefoni uchun xavfsiz holat ma'lumoti */
export async function oquvchiHolatiniOlish(xonaId, qatnashchiId) {
  const ombor = omborniOl();
  const xona = await ombor.xonaniOl(xonaId);
  if (!xona) return { xato: "Xona topilmadi" };

  const q = await ombor.qatnashchiniOl(xonaId, qatnashchiId);
  if (!q) return { xato: "Ishtirokchi topilmadi" };
  if (q.chetlatildi) return { chetlatildi: true };

  // Anti-Cheat: savollar ro'yxatidan `_maxfiyTogriIndex` va `izoh` olib tashlanadi!
  const ochiqSavollar = (q.savollar || []).map((s) => ({
    tartibRaqam: s.tartibRaqam,
    id: s.id,
    savol: s.savol,
    variantlar: s.variantlar,
    daraja: s.daraja,
  }));

  const jamoalar = Array.isArray(xona.jamoalar) ? xona.jamoalar : [];
  const jamoa = jamoalar.find((j) => j.id === q.jamoaId);

  // Jonli jamoa ballari — qatnashchilar yig'indisidan (jamoalar poygasi uchun)
  const barchasi = await ombor.xonaQatnashchilariniOl(xonaId);
  const ballYigindi = {};
  for (const a of barchasi) {
    if (a.chetlatildi) continue;
    ballYigindi[a.jamoaId] = (ballYigindi[a.jamoaId] || 0) + (a.ball || 0);
  }
  const jamoalarRoyxati = jamoalar.map((j) => ({
    id: j.id,
    nom: j.nom,
    rang: j.rang,
    hex: j.hex,
    suyuqlikRang: j.suyuqlikRang,
    ball: ballYigindi[j.id] || 0,
    suyuqlikMl: Math.min(500, ballYigindi[j.id] || 0),
  }));

  const javoblar = q.javoblar || {};
  const togriSoni = Object.values(javoblar).filter((j) => j.togri).length;
  const notogriSoni = Object.values(javoblar).filter((j) => !j.togri).length;

  return {
    xonaId: xona.xonaId,
    holat: xona.holat,
    ism: q.ism,
    jamoaId: q.jamoaId,
    jamoaNomi: jamoa?.nom || "",
    jamoaRangi: jamoa?.rang || "emerald",
    ball: q.ball || 0,
    sarflanganVaqtSoniya: q.sarflanganVaqt || 0,
    qoidabuzarliklar: q.qoidabuzarliklar || 0,
    togriSoni,
    notogriSoni,
    jamiSavollarSoni: (q.savollar || []).length,
    jamoalar: jamoalarRoyxati,
    savollar: ochiqSavollar,
    belgilanganJavoblar: Object.fromEntries(
      Object.entries(javoblar).map(([k, v]) => [k, v.tanlanganIndex])
    ),
    tugatdi: !!q.tugatdi,
  };
}

/** O'qituvchi o'yinni boshlaydi (Lobby -> Jang). Faqat ustoz kaliti bilan. */
export async function jangniBoshla(xonaId, ustozKalit) {
  const ombor = omborniOl();
  const xona = await ustozniTekshir(xonaId, ustozKalit);
  // Yakunlangan o'yinni qayta ochib bo'lmaydi — e'lon qilingan natija o'zgarmaydi
  if (xona.holat !== "lobby") {
    if (xona.holat === "yakunlandi") throw new Error("Bu musobaqa yakunlangan — yangisini oching");
    throw new Error("Musobaqa allaqachon boshlangan");
  }
  const hozir = Date.now();
  await ombor.xonaYangila(xonaId, { holat: "jang", boshlanganVaqt: hozir });
  // Hamma uchun soat noldan: birinchi savol vaqti shu ondan o'lchanadi
  await ombor.barchaningSavolVaqtiniYangila(xonaId, hozir);
  return doskaHolatiniOlish(xonaId);
}

/**
 * O'quvchining savolga bergan javobini qabul qilish.
 *
 * VAQT SERVERDA O'LCHANADI: oxirgi javob (yoki jang boshi) bilan hozirgi
 * on orasidagi farq. `mijozVaqti` parametri eski clientlar bilan moslik
 * uchun qabul qilinadi, lekin hisobga OLINMAYDI — mijoz uni 0 yuborib
 * tie-breaker'da g'olib chiqishi mumkin edi (K4).
 */
export async function javobniQabulQil(xonaId, qatnashchiId, savolId, tanlanganIndex, mijozVaqti = null, qoidaBuzildimi = false) {
  const ombor = omborniOl();
  const xona = await ombor.xonaniOl(xonaId);
  if (!xona) throw new Error("Xona topilmadi");
  if (xona.holat !== "jang") throw new Error("Musobaqa hozir faol emas");

  const q = await ombor.qatnashchiniOl(xonaId, qatnashchiId);
  if (!q || q.chetlatildi) throw new Error("Ishtirokchi topilmadi yoki chetlatilgan");

  const sId = Number(savolId);
  // Agar bu savolga allaqachon javob bergan bo'lsa, qayta qabul qilinmaydi (Anti-spam)
  if (q.javoblar && q.javoblar[sId]) {
    return { ok: true, qabulQilindi: true };
  }

  const savol = (q.savollar || []).find((s) => s.id === sId);
  if (!savol) throw new Error("Savol topilmadi");

  const qoidaBuzildi = Boolean(qoidaBuzildimi);

  let togri = false;
  let qoshilganBall = 0;
  let yakuniyIndex = Number(tanlanganIndex);

  if (qoidaBuzildi) {
    yakuniyIndex = -1;
    togri = false;
    qoshilganBall = 0;
  } else {
    const tIdx = Number(tanlanganIndex);
    if (tIdx === -1) {
      // Vaqt tugadi (30s) yoki o'quvchi javob belgila olmadi (0 ball)
      yakuniyIndex = -1;
      togri = false;
      qoshilganBall = 0;
    } else {
      if (!Number.isInteger(tIdx) || tIdx < 0 || tIdx >= savol.variantlar.length) {
        throw new Error("Yaroqsiz variant tanlandi");
      }
      yakuniyIndex = tIdx;
      togri = tIdx === savol._maxfiyTogriIndex;

      if (togri) {
        if (savol.daraja === 1) qoshilganBall = 5;
        else if (savol.daraja === 2) qoshilganBall = 10;
        else if (savol.daraja === 3) qoshilganBall = 15;
      }
    }
  }

  // Server o'lchovi: oxirgi javobdan beri o'tgan vaqt, 0..30 oralig'ida.
  // Kechikkan so'rov (tarmoq uzilishi) 30 dan oshmaydi — bitta savolga
  // 30 soniyadan ortiq yozilmaydi.
  const hozir = Date.now();
  const songiNuqta = Number(q.oxirgiSavolVaqti) || hozir;
  const sarf = Math.min(SAVOL_MAKS_SONIYA, Math.max(0, Math.round((hozir - songiNuqta) / 1000)));

  const yozuv = {
    tanlanganIndex: yakuniyIndex,
    togri,
    ball: qoshilganBall,
    vaqt: hozir,
    sarflanganVaqtSoniya: sarf,
    qoidaBuzildi,
  };

  // Unikal yozuv: ikki nusxa bir vaqtda kelsa ham bittasi o'tadi
  const natija = await ombor.javobYoz({ xonaId, qatnashchiId, savolId: sId, yozuv });
  if (natija === "mavjud") {
    return { ok: true, qabulQilindi: true };
  }

  const jamiJavoblar = Object.keys(q.javoblar || {}).length + 1;
  const tugatdimi = jamiJavoblar >= (q.savollar || []).length;

  await ombor.qatnashchiYangila(xonaId, qatnashchiId, {
    ballDelta: qoshilganBall,
    sarflanganDelta: sarf,
    qoidaDelta: qoidaBuzildi ? 1 : 0,
    oxirgiSavolVaqti: hozir,
    tugatdi: tugatdimi ? true : undefined,
  });

  const jamoalar = Array.isArray(xona.jamoalar) ? xona.jamoalar : [];
  const jamoa = jamoalar.find((j) => j.id === q.jamoaId);

  if (qoidaBuzildi) {
    // Jonli lentaga qoidabuzarlik hodisasi (ogohlantirish)
    await ombor.lentaQosh(xonaId, {
      id: crypto.randomBytes(4).toString("hex"),
      ism: q.ism,
      jamoaId: q.jamoaId,
      jamoaNomi: jamoa ? jamoa.nom : "",
      ball: 0,
      daraja: savol.daraja,
      qoidaBuzildi: true,
      matn: `${q.ism} ilovadan chiqdi yoki almashtirdi (0 ball)`,
      vaqt: hozir,
    });
  } else if (qoshilganBall > 0) {
    // Jonli lentaga hodisa qo'shish (faqat to'g'ri javoblar)
    await ombor.lentaQosh(xonaId, {
      id: crypto.randomBytes(4).toString("hex"),
      ism: q.ism,
      jamoaId: q.jamoaId,
      jamoaNomi: jamoa ? jamoa.nom : "",
      ball: qoshilganBall,
      daraja: savol.daraja,
      vaqt: hozir,
    });
  }

  // DIQQAT: O'quvchiga to'g'ri/xato ekani aslo bildirilmaydi (Anti-cheat)
  return { ok: true, qabulQilindi: true, ball: (q.ball || 0) + qoshilganBall, qoidaBuzildi };
}

/** O'quvchi barcha savollarni yakunlaganini qayd etish */
export async function oquvchiTugatdi(xonaId, qatnashchiId) {
  const ombor = omborniOl();
  const xona = await ombor.xonaniOl(xonaId);
  if (!xona) throw new Error("Xona topilmadi");

  const q = await ombor.qatnashchiniOl(xonaId, qatnashchiId);
  if (!q) throw new Error("Ishtirokchi topilmadi");

  // Vaqt faqat javob yozilganda server tomonidan qo'shiladi — mijoz
  // yuborgan jami vaqt qabul qilinmaydi (K4 bilan bir sabab).
  await ombor.qatnashchiYangila(xonaId, qatnashchiId, { tugatdi: true });
  return { ok: true, tugatdi: true };
}

/** O'qituvchi soxta hisobni o'yindan chetlatishi (Moderatsiya). Faqat ustoz kaliti bilan. */
export async function qatnashchiniChetlat(xonaId, qatnashchiId, ustozKalit) {
  const ombor = omborniOl();
  await ustozniTekshir(xonaId, ustozKalit);

  const q = await ombor.qatnashchiniOl(xonaId, qatnashchiId);
  if (!q) throw new Error("Ishtirokchi topilmadi");

  // Agar u allaqachon chetlatilgan bo'lsa
  if (q.chetlatildi) return doskaHolatiniOlish(xonaId);

  await ombor.qatnashchiYangila(xonaId, qatnashchiId, { chetlatildi: true });
  // Jamoa ballaridan ayirish shart emas: ballar chetlatilmaganlar
  // yig'indisidan hisoblanadi, shuning uchun avtomatik kamayadi.

  return doskaHolatiniOlish(xonaId);
}

/** O'yinni yakunlash. Faqat ustoz kaliti bilan. */
export async function jangniTugat(xonaId, ustozKalit) {
  const ombor = omborniOl();
  const xona = await ustozniTekshir(xonaId, ustozKalit);
  if (xona.holat === "yakunlandi") return doskaHolatiniOlish(xonaId);
  await ombor.xonaYangila(xonaId, { holat: "yakunlandi" });
  return doskaHolatiniOlish(xonaId);
}

/** Test yakunlangach to'liq tahlilni (to'g'ri javoblar va izohlar) olish */
export async function tahlilniOlish(xonaId, qatnashchiId) {
  const ombor = omborniOl();
  const xona = await ombor.xonaniOl(xonaId);
  if (!xona) throw new Error("Xona topilmadi");

  const q = await ombor.qatnashchiniOl(xonaId, qatnashchiId);
  if (!q) throw new Error("Ishtirokchi topilmadi");

  // Xavfsizlik: test davom etayotganda to'g'ri javoblarni bermaslik
  if (xona.holat !== "yakunlandi") {
    throw new Error("Musobaqa hali yakunlanmagan");
  }

  const javoblar = q.javoblar || {};
  // Faqat test xona darajasida yakunlangach tahlil beriladi
  return (q.savollar || []).map((s) => {
    const javob = javoblar[s.id];
    return {
      tartibRaqam: s.tartibRaqam,
      id: s.id,
      savol: s.savol,
      variantlar: s.variantlar,
      daraja: s.daraja,
      slayd: s.slayd,
      izoh: s.izoh,
      togriIndex: s._maxfiyTogriIndex,
      tanlanganIndex: javob ? javob.tanlanganIndex : null,
      togriTopdimi: javob ? javob.togri : false,
      ball: javob ? javob.ball : 0,
    };
  });
}

// Testlar uchun qayta eksport: xotira rejimidagi jonli xona obyekti.
// Production kodi buni ishlatmaydi — faqat testlar ichki holatni o'qiydi.
export { ichkiXonaniOl };
