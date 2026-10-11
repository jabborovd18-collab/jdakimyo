// lib/doska-jang-boshqaruvchi.js
//
// Smart Doska — Jamoalar Jangi server hakami va xona boshqaruvchisi.
// Server — yagona haqiqat manbai (AGENTS.md 2-band).
// Barcha ballar va to'g'ri javoblar serverda tekshiriladi; clientga
// to'g'ri javob test tugaguncha berilmaydi (Anti-cheat & Anti-AI).

import { ADSORBSIYA_SAVOLLARI } from "../data/doska/adsorbsiya-savollar.js";

// Global xonalar ombori (in-memory, server qayta yuklanganda ham saqlansin)
if (!globalThis.__doskaXonalar) {
  globalThis.__doskaXonalar = new Map();
}
const xonalar = globalThis.__doskaXonalar;

/** Jamoa standart ranglari va nomlari */
export const STANDART_JAMOALAR = [
  { id: 1, nom: "Kationlar", rang: "emerald", hex: "#10b981", suyuqlikRang: "#34d399", ball: 0, suyuqlikMl: 0 },
  { id: 2, nom: "Anionlar", rang: "sky", hex: "#0284c7", suyuqlikRang: "#38bdf8", ball: 0, suyuqlikMl: 0 },
  { id: 3, nom: "Radikallar", rang: "amber", hex: "#f59e0b", suyuqlikRang: "#fbbf24", ball: 0, suyuqlikMl: 0 },
  { id: 4, nom: "Komplekslar", rang: "rose", hex: "#f43f5e", suyuqlikRang: "#fb7185", ball: 0, suyuqlikMl: 0 },
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

/** Yangi jang xonasi yaratish */
export function yangiXonaYarat(mavzuId = "sirt-hodisalari-adsorbsiya", jamoalarSoni = 2, maxsusNomlar = []) {
  const soni = Math.min(4, Math.max(1, Number(jamoalarSoni) || 2));
  // 6 raqamli qulay xona PIN kodi
  const xonaId = String(Math.floor(100000 + Math.random() * 900000));

  const jamoalar = STANDART_JAMOALAR.slice(0, soni).map((j, idx) => {
    const berilganNom = Array.isArray(maxsusNomlar) && maxsusNomlar[idx] ? String(maxsusNomlar[idx]).trim().slice(0, 25) : null;
    return {
      ...j,
      nom: berilganNom || j.nom,
      ball: 0,
      suyuqlikMl: 0,
      topIshtirokchi: null,
    };
  });

  const xona = {
    xonaId,
    mavzuId,
    holat: "lobby", // "lobby" | "jang" | "yakunlandi"
    yaratilganVaqt: Date.now(),
    boshlanganVaqt: null,
    jamoalarSoni: soni,
    jamoalar,
    qatnashchilar: {}, // qatnashchiId -> ma'lumot
    jonliLenta: [], // oxirgi 15 ta hodisa
  };

  xonalar.set(xonaId, xona);

  // Eski (2 soatdan oshgan) xonalarni xotiradan tozalash
  const hozir = Date.now();
  for (const [id, x] of xonalar.entries()) {
    if (hozir - x.yaratilganVaqt > 2 * 60 * 60 * 1000) {
      xonalar.delete(id);
    }
  }

  return xona;
}

/** Jamoa nomini yangilash (lobbyda yoki o'qituvchi istagan paytda) */
export function jamoaNominiYangila(xonaId, jamoaId, yangiNom) {
  const xona = xonaniTop(xonaId);
  if (!xona) throw new Error("Xona topilmadi");
  const tozalangan = String(yangiNom || "").trim().slice(0, 25);
  if (!tozalangan) throw new Error("Jamoa nomi bo'sh bo'lishi mumkin emas");

  const jamoa = xona.jamoalar.find((j) => j.id === Number(jamoaId));
  if (!jamoa) throw new Error("Bunday jamoa topilmadi");
  jamoa.nom = tozalangan;
  return doskaHolatiniOlish(xonaId);
}

/** Xonani topish */
export function xonaniTop(xonaId) {
  return xonalar.get(String(xonaId)) || null;
}

/** Doska ekrani uchun xavfsiz holat ma'lumoti */
export function doskaHolatiniOlish(xonaId) {
  const xona = xonaniTop(xonaId);
  if (!xona) return null;

  // Har bir jamoaning TOP ishtirokchisi va sarflangan umumiy vaqtini hisoblash
  const jamoalarNatijasi = xona.jamoalar.map((j) => {
    const jamoaAzzolari = Object.values(xona.qatnashchilar).filter(
      (q) => q.jamoaId === j.id && !q.chetlatildi
    );

    let top = null;
    if (jamoaAzzolari.length > 0) {
      jamoaAzzolari.sort((a, b) => b.ball - a.ball);
      top = {
        ism: jamoaAzzolari[0].ism,
        ball: jamoaAzzolari[0].ball,
      };
    }

    const ortacha = jamoaAzzolari.length > 0 ? Math.round(j.ball / jamoaAzzolari.length) : 0;
    const jamoaSarflanganVaqt = jamoaAzzolari.reduce(
      (sum, q) => sum + (q.sarflanganVaqtSoniya || 0),
      0
    );
    const ortachaSarflanganVaqt =
      jamoaAzzolari.length > 0 ? Math.round(jamoaSarflanganVaqt / jamoaAzzolari.length) : 0;
    const jamoaQoidabuzarliklar = jamoaAzzolari.reduce(
      (sum, q) => sum + (q.qoidabuzarliklar || 0),
      0
    );

    return {
      ...j,
      azolariSoni: jamoaAzzolari.length,
      ortachaBall: ortacha,
      sarflanganVaqt: jamoaSarflanganVaqt,
      ortachaSarflanganVaqt,
      qoidabuzarliklar: jamoaQoidabuzarliklar,
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

  const barchaAzzolar = Object.values(xona.qatnashchilar)
    .filter((q) => !q.chetlatildi)
    .map((q) => ({
      id: q.id,
      ism: q.ism,
      jamoaId: q.jamoaId,
      ball: q.ball,
      sarflanganVaqtSoniya: q.sarflanganVaqtSoniya || 0,
      qoidabuzarliklar: q.qoidabuzarliklar || 0,
      ishlaganSavollar: Object.keys(q.javoblar).length,
      tugatdi: q.tugatdi,
    }));

  return {
    xonaId: xona.xonaId,
    mavzuId: xona.mavzuId,
    holat: xona.holat,
    jamoalarSoni: xona.jamoalarSoni,
    jamoalar: jamoalarNatijasi,
    qatnashchilar: barchaAzzolar,
    jonliLenta: xona.jonliLenta.slice(-10),
    boshlanganVaqt: xona.boshlanganVaqt,
  };
}

/** O'quvchi xonaga qo'shilishi */
export function qatnashchiQosh(xonaId, ism, jamoaId) {
  const xona = xonaniTop(xonaId);
  if (!xona) throw new Error("Bunday xona topilmadi");
  if (xona.holat !== "lobby") {
    if (xona.holat === "jang") {
      throw new Error("Musobaqa allaqachon boshlangan. Yangi yoki kechikkan ishtirokchilar qabul qilinmaydi!");
    }
    throw new Error("Bu musobaqa allaqachon yakunlangan");
  }

  const tozalanganIsm = String(ism || "").trim().slice(0, 30);
  if (!tozalanganIsm) throw new Error("Ism-familiyangizni kiriting");

  // Agar bir xil ismli o'quvchilar bo'lsa, adashmaslik uchun raqam qo'shish
  const mavjudIsmlar = Object.values(xona.qatnashchilar)
    .filter((p) => !p.chetlatildi)
    .map((p) => p.ism);
  let yakuniyIsm = tozalanganIsm;
  if (mavjudIsmlar.includes(yakuniyIsm)) {
    let sanoq = 2;
    while (mavjudIsmlar.includes(`${yakuniyIsm} (${sanoq})`)) {
      sanoq++;
    }
    yakuniyIsm = `${yakuniyIsm} (${sanoq})`;
  }

  const jId = Math.min(xona.jamoalarSoni, Math.max(1, Number(jamoaId) || 1));
  const qatnashchiId = "q_" + Math.random().toString(36).substring(2, 9);

  // O'quvchiga 20 ta maxsus kvotali savollar tanlanadi
  const savollar = tanlaKvotaliSavollar();

  const qatnashchi = {
    id: qatnashchiId,
    ism: yakuniyIsm,
    jamoaId: jId,
    ball: 0,
    sarflanganVaqtSoniya: 0,
    qoidabuzarliklar: 0,
    boshlanganVaqt: Date.now(),
    javoblar: {}, // savolId -> { tanlanganIndex, togri, vaqt, sarflanganVaqtSoniya, qoidaBuzildi }
    savollar, // serverda to'liq saqlanadi
    chetlatildi: false,
    tugatdi: false,
  };

  xona.qatnashchilar[qatnashchiId] = qatnashchi;

  return {
    qatnashchiId,
    ism: yakuniyIsm,
    jamoaId: jId,
  };
}

/** O'quvchi telefoni uchun xavfsiz holat ma'lumoti */
export function oquvchiHolatiniOlish(xonaId, qatnashchiId) {
  const xona = xonaniTop(xonaId);
  if (!xona) return { xato: "Xona topilmadi" };

  const q = xona.qatnashchilar[qatnashchiId];
  if (!q) return { xato: "Ishtirokchi topilmadi" };
  if (q.chetlatildi) return { chetlatildi: true };

  // Anti-Cheat: savollar ro'yxatidan `_maxfiyTogriIndex` va `izoh` olib tashlanadi!
  const ochiqSavollar = q.savollar.map((s) => ({
    tartibRaqam: s.tartibRaqam,
    id: s.id,
    savol: s.savol,
    variantlar: s.variantlar,
    daraja: s.daraja,
  }));

  const jamoa = xona.jamoalar.find((j) => j.id === q.jamoaId);

  return {
    xonaId: xona.xonaId,
    holat: xona.holat,
    ism: q.ism,
    jamoaId: q.jamoaId,
    jamoaNomi: jamoa?.nom || "",
    jamoaRangi: jamoa?.rang || "emerald",
    ball: q.ball,
    sarflanganVaqtSoniya: q.sarflanganVaqtSoniya || 0,
    qoidabuzarliklar: q.qoidabuzarliklar || 0,
    savollar: ochiqSavollar,
    belgilanganJavoblar: Object.fromEntries(
      Object.entries(q.javoblar).map(([k, v]) => [k, v.tanlanganIndex])
    ),
    tugatdi: q.tugatdi,
  };
}

/** O'qituvchi o'yinni boshlaydi (Lobby -> Jang) */
export function jangniBoshla(xonaId) {
  const xona = xonaniTop(xonaId);
  if (!xona) throw new Error("Xona topilmadi");
  xona.holat = "jang";
  xona.boshlanganVaqt = Date.now();
  Object.values(xona.qatnashchilar).forEach((q) => {
    q.boshlanganVaqt = Date.now();
  });
  return doskaHolatiniOlish(xonaId);
}

/** O'quvchining savolga bergan javobini qabul qilish */
export function javobniQabulQil(xonaId, qatnashchiId, savolId, tanlanganIndex, sarflanganVaqtSoniya = 15, qoidaBuzildimi = false) {
  const xona = xonaniTop(xonaId);
  if (!xona) throw new Error("Xona topilmadi");
  if (xona.holat !== "jang") throw new Error("Musobaqa hozir faol emas");

  const q = xona.qatnashchilar[qatnashchiId];
  if (!q || q.chetlatildi) throw new Error("Ishtirokchi topilmadi yoki chetlatilgan");

  const sId = Number(savolId);
  // Agar bu savolga allaqachon javob bergan bo'lsa, qayta qabul qilinmaydi (Anti-spam)
  if (q.javoblar[sId]) {
    return { ok: true, qabulQilindi: true };
  }

  const savol = q.savollar.find((s) => s.id === sId);
  if (!savol) throw new Error("Savol topilmadi");

  const qoidaBuzildi = Boolean(qoidaBuzildimi);

  let togri = false;
  let qoshilganBall = 0;
  let yakuniyIndex = Number(tanlanganIndex);

  if (qoidaBuzildi) {
    yakuniyIndex = -1;
    togri = false;
    qoshilganBall = 0;
    q.qoidabuzarliklar = (q.qoidabuzarliklar || 0) + 1;

    // Jonli lentaga qoidabuzarlik hodisasi (ogohlantirish)
    const jamoa = xona.jamoalar.find((j) => j.id === q.jamoaId);
    xona.jonliLenta.push({
      id: Math.random().toString(36).substring(2, 7),
      ism: q.ism,
      jamoaId: q.jamoaId,
      jamoaNomi: jamoa ? jamoa.nom : "",
      ball: 0,
      qoidaBuzildi: true,
      matn: `${q.ism} ilovadan chiqdi yoki almashtirdi (0 ball)`,
      vaqt: Date.now(),
    });
    if (xona.jonliLenta.length > 25) xona.jonliLenta.shift();
  } else {
    const tIdx = Number(tanlanganIndex);
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

  const sarf = Math.min(30, Math.max(0, Number(sarflanganVaqtSoniya) || 0));
  q.sarflanganVaqtSoniya = (q.sarflanganVaqtSoniya || 0) + sarf;

  q.javoblar[sId] = {
    tanlanganIndex: yakuniyIndex,
    togri,
    ball: qoshilganBall,
    vaqt: Date.now(),
    sarflanganVaqtSoniya: sarf,
    qoidaBuzildi,
  };

  q.ball += qoshilganBall;

  // Jamoa hisobiga qo'shish
  const jamoa = xona.jamoalar.find((j) => j.id === q.jamoaId);
  if (jamoa && qoshilganBall > 0) {
    jamoa.ball += qoshilganBall;
    // Kolbadagi suyuqlik miqdori: har 1 ball = 1 ml (maksimal 500 ml)
    jamoa.suyuqlikMl = Math.min(500, jamoa.suyuqlikMl + qoshilganBall);

    // Jonli lentaga hodisa qo'shish
    xona.jonliLenta.push({
      id: Math.random().toString(36).substring(2, 7),
      ism: q.ism,
      jamoaId: q.jamoaId,
      jamoaNomi: jamoa.nom,
      ball: qoshilganBall,
      daraja: savol.daraja,
      vaqt: Date.now(),
    });
    if (xona.jonliLenta.length > 25) xona.jonliLenta.shift();
  }

  // Barcha 20 ta savol yechilganini tekshirish
  if (Object.keys(q.javoblar).length >= q.savollar.length) {
    q.tugatdi = true;
  }

  // DIQQAT: O'quvchiga to'g'ri/xato ekani aslo bildirilmaydi (Anti-cheat)
  return { ok: true, qabulQilindi: true, ball: q.ball, qoidaBuzildi };
}

/** O'quvchi barcha savollarni yakunlaganini qayd etish */
export function oquvchiTugatdi(xonaId, qatnashchiId, sarflanganVaqtSoniya) {
  const xona = xonaniTop(xonaId);
  if (!xona) throw new Error("Xona topilmadi");

  const q = xona.qatnashchilar[qatnashchiId];
  if (!q) throw new Error("Ishtirokchi topilmadi");

  if (sarflanganVaqtSoniya !== undefined) {
    q.sarflanganVaqtSoniya = Math.max(q.sarflanganVaqtSoniya || 0, Number(sarflanganVaqtSoniya) || 0);
  }
  q.tugatdi = true;
  return { ok: true, tugatdi: true };
}

/** O'qituvchi soxta hisobni o'yindan chetlatishi (Moderatsiya) */
export function qatnashchiniChetlat(xonaId, qatnashchiId) {
  const xona = xonaniTop(xonaId);
  if (!xona) throw new Error("Xona topilmadi");

  const q = xona.qatnashchilar[qatnashchiId];
  if (!q) throw new Error("Ishtirokchi topilmadi");

  // Agar u allaqachon chetlatilgan bo'lsa
  if (q.chetlatildi) return doskaHolatiniOlish(xonaId);

  q.chetlatildi = true;

  // U to'plagan ballarni jamoa umumiy hisobidan ayirib tashlash
  const jamoa = xona.jamoalar.find((j) => j.id === q.jamoaId);
  if (jamoa) {
    jamoa.ball = Math.max(0, jamoa.ball - q.ball);
    jamoa.suyuqlikMl = Math.max(0, jamoa.suyuqlikMl - q.ball);
  }

  return doskaHolatiniOlish(xonaId);
}

/** O'yinni yakunlash */
export function jangniTugat(xonaId) {
  const xona = xonaniTop(xonaId);
  if (!xona) throw new Error("Xona topilmadi");
  xona.holat = "yakunlandi";
  return doskaHolatiniOlish(xonaId);
}

/** Test yakunlangach to'liq tahlilni (to'g'ri javoblar va izohlar) olish */
export function tahlilniOlish(xonaId, qatnashchiId) {
  const xona = xonaniTop(xonaId);
  if (!xona) throw new Error("Xona topilmadi");

  const q = xona.qatnashchilar[qatnashchiId];
  if (!q) throw new Error("Ishtirokchi topilmadi");

  // Faqat test tugagach yoki xona yakunlangach tahlil beriladi
  return q.savollar.map((s) => {
    const javob = q.javoblar[s.id];
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
