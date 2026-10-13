// lib/doska-jang-ombor.js
//
// Smart Doska — Jamoalar Jangi ma'lumot ombori (adapter naqshi).
//
// NEGA IKKI ORQA TIZIM. O'yin holati production'da Postgres'da yashashi
// shart (serverless nusxalar xotirani bo'lishmaydi — K1). Lekin unit
// testlar bazasiz ishlashi kerak (`node --test` hech qanday servis
// talab qilmaydi). Shuning uchun o'yin qoidalari (boshqaruvchi) omborni
// faqat shu interfeys orqali ko'radi, orqa tizim esa muhitdan tanlanadi:
//
//   JANG_OMBOR=baza   → Postgres (Prisma)
//   JANG_OMBOR=xotira → jarayon xotirasi (testlar, lokal dev)
//   ko'rsatilmasa     → DATABASE_URL bo'lsa baza, bo'lmasa xotira
//
// IKKI ORQA TIZIM BIR XIL SEMANTIKAGA EGA: jamoa ballari saqlanmaydi
// (qatnashchilardan hisoblanadi), javob (qatnashchiId, savolId) bo'yicha
// unikal, vaqtlar millisekund soniyasida (Date emas) qaytadi.

const XONA_YOSHI_MS = 2 * 60 * 60 * 1000; // 2 soatdan eskilari tozalanadi

/** PIN takrorlanganda — xonaYarat shu xato bilan rad etadi */
export class TakrorXonaXatosi extends Error {
  constructor() {
    super("Xona kodi band");
    this.kod = "TAKROR_XONA";
  }
}

/** Qaysi orqa tizim ishlatiladi — testlar buni majburlashi mumkin */
export function omborTuri() {
  const majburiy = (process.env.JANG_OMBOR || "").trim().toLowerCase();
  if (majburiy === "baza" || majburiy === "xotira") return majburiy;
  return process.env.DATABASE_URL ? "baza" : "xotira";
}

// ═══════════════════════════════════════════════════════════════
// 1. XOTIRA OMBORI (testlar va lokal dev uchun)
// ═══════════════════════════════════════════════════════════════

if (!globalThis.__doskaXonalar) {
  globalThis.__doskaXonalar = new Map();
}
const xonalar = globalThis.__doskaXonalar;

function xotiraXonaniTozala() {
  const hozir = Date.now();
  for (const [id, x] of xonalar.entries()) {
    if (hozir - x.yaratilganVaqt > XONA_YOSHI_MS) xonalar.delete(id);
  }
}

const xotiraOmbor = {
  nom: "xotira",

  async xonaYarat({ xonaId, mavzuId, jamoalarSoni, jamoalar, ustozKalitHash }) {
    if (xonalar.has(String(xonaId))) throw new TakrorXonaXatosi();
    const xona = {
      xonaId: String(xonaId),
      mavzuId,
      holat: "lobby",
      jamoalarSoni,
      // Faqat statik ma'lumot: ballar qatnashchilardan hisoblanadi
      jamoalar: jamoalar.map((j) => ({
        id: j.id, nom: j.nom, rang: j.rang, hex: j.hex, suyuqlikRang: j.suyuqlikRang,
      })),
      jonliLenta: [],
      ustozKalitHash,
      boshlanganVaqt: null,
      yaratilganVaqt: Date.now(),
      qatnashchilar: {},
    };
    xonalar.set(xona.xonaId, xona);
    xotiraXonaniTozala();
    return xona;
  },

  async xonaniOl(xonaId) {
    return xonalar.get(String(xonaId)) || null;
  },

  async xonaYangila(xonaId, ozgarish) {
    const xona = xonalar.get(String(xonaId));
    if (!xona) return null;
    Object.assign(xona, ozgarish);
    return xona;
  },

  async lentaQosh(xonaId, hodisa) {
    const xona = xonalar.get(String(xonaId));
    if (!xona) return;
    xona.jonliLenta.push(hodisa);
    if (xona.jonliLenta.length > 25) xona.jonliLenta.splice(0, xona.jonliLenta.length - 25);
  },

  async ismlarniOl(xonaId) {
    const xona = xonalar.get(String(xonaId));
    if (!xona) return [];
    return Object.values(xona.qatnashchilar)
      .filter((q) => !q.chetlatildi)
      .map((q) => q.ism);
  },

  async qatnashchiQosh({ id, xonaId, ism, jamoaId, savollar }) {
    const xona = xonalar.get(String(xonaId));
    if (!xona) throw new Error("Xona topilmadi");
    const hozir = Date.now();
    xona.qatnashchilar[id] = {
      id, ism, jamoaId,
      ball: 0,
      sarflanganVaqt: 0,
      qoidabuzarliklar: 0,
      boshlanganVaqt: hozir,
      oxirgiSavolVaqti: hozir,
      savollar,
      javoblar: {},
      chetlatildi: false,
      tugatdi: false,
    };
    return xona.qatnashchilar[id];
  },

  async qatnashchiniOl(xonaId, qatnashchiId) {
    const xona = xonalar.get(String(xonaId));
    if (!xona) return null;
    return xona.qatnashchilar[qatnashchiId] || null;
  },

  async xonaQatnashchilariniOl(xonaId) {
    const xona = xonalar.get(String(xonaId));
    if (!xona) return [];
    return Object.values(xona.qatnashchilar);
  },

  /** Javob yozish — allaqachon bo'lsa 'mavjud' (idempotent) */
  async javobYoz({ xonaId, qatnashchiId, savolId, yozuv }) {
    const q = await this.qatnashchiniOl(xonaId, qatnashchiId);
    if (!q) throw new Error("Ishtirokchi topilmadi");
    if (q.javoblar[savolId]) return "mavjud";
    q.javoblar[savolId] = yozuv;
    return "yozildi";
  },

  async qatnashchiYangila(xonaId, qatnashchiId, ozgarish) {
    const q = await this.qatnashchiniOl(xonaId, qatnashchiId);
    if (!q) return null;
    if (ozgarish.ballDelta) q.ball += ozgarish.ballDelta;
    if (ozgarish.sarflanganDelta) q.sarflanganVaqt += ozgarish.sarflanganDelta;
    if (ozgarish.qoidaDelta) q.qoidabuzarliklar += ozgarish.qoidaDelta;
    if (ozgarish.oxirgiSavolVaqti !== undefined) q.oxirgiSavolVaqti = ozgarish.oxirgiSavolVaqti;
    if (ozgarish.tugatdi !== undefined) q.tugatdi = ozgarish.tugatdi;
    if (ozgarish.chetlatildi !== undefined) q.chetlatildi = ozgarish.chetlatildi;
    return q;
  },

  async barchaningSavolVaqtiniYangila(xonaId, vaqt) {
    const xona = xonalar.get(String(xonaId));
    if (!xona) return;
    for (const q of Object.values(xona.qatnashchilar)) q.oxirgiSavolVaqti = vaqt;
  },

  async eskiXonalarniTozala() {
    xotiraXonaniTozala();
  },
};

// ═══════════════════════════════════════════════════════════════
// 2. BAZA OMBORI (production — Prisma/Postgres)
// ═══════════════════════════════════════════════════════════════

// Prisma FAQAT baza rejimida yuklanadi: test muhiti va lokal dev'da
// @prisma/client bo'lmasligi mumkin va uni talab qilish xotira
// rejimini ham sindirardi. Dinamik import shu muammoni oldini oladi.
let _prisma = null;
async function bazaniOl() {
  if (!_prisma) {
    const modul = await import("./prisma.js");
    _prisma = modul.prisma || modul.default;
  }
  return _prisma;
}

const bazaOmbor = {
  nom: "baza",

  async xonaYarat({ xonaId, mavzuId, jamoalarSoni, jamoalar, ustozKalitHash }) {
    const prisma = await bazaniOl();
    try {
      const xona = await prisma.doskaXona.create({
        data: {
          xonaId: String(xonaId),
          mavzuId,
          jamoalarSoni,
          jamoalar: jamoalar.map((j) => ({
            id: j.id, nom: j.nom, rang: j.rang, hex: j.hex, suyuqlikRang: j.suyuqlikRang,
          })),
          jonliLenta: [],
          ustozKalitHash,
        },
      });
      await this.eskiXonalarniTozala();
      return xona;
    } catch (e) {
      // P2002 — PIN band (parallel yaratishda). Boshqaruvchi qayta urinadi.
      if (e?.code === "P2002") throw new TakrorXonaXatosi();
      throw e;
    }
  },

  async xonaniOl(xonaId) {
    const prisma = await bazaniOl();
    const xona = await prisma.doskaXona.findUnique({ where: { xonaId: String(xonaId) } });
    if (!xona) return null;
    return {
      ...xona,
      boshlanganVaqt: xona.boshlanganVaqt ? xona.boshlanganVaqt.getTime() : null,
      yaratilganVaqt: xona.yaratilganVaqt ? xona.yaratilganVaqt.getTime() : Date.now(),
    };
  },

  async xonaYangila(xonaId, ozgarish) {
    const prisma = await bazaniOl();
    const data = { ...ozgarish };
    // Boshqaruvchi millisekund beradi, baza Date kutadi
    if (data.boshlanganVaqt !== undefined) {
      data.boshlanganVaqt = data.boshlanganVaqt === null ? null : new Date(data.boshlanganVaqt);
    }
    delete data.yaratilganVaqt;
    try {
      return await prisma.doskaXona.update({ where: { xonaId: String(xonaId) }, data });
    } catch (e) {
      if (e?.code === "P2025") return null;
      throw e;
    }
  },

  async lentaQosh(xonaId, hodisa) {
    const prisma = await bazaniOl();
    // Lenta — kosmetik oqim: ikki yozuv to'qnashib bittasi tushib qolsa,
    // o'yinga ta'siri yo'q. Shuning uchun oddiy o'qib-yozish yetadi.
    const xona = await prisma.doskaXona.findUnique({
      where: { xonaId: String(xonaId) },
      select: { jonliLenta: true },
    });
    if (!xona) return;
    const lenta = Array.isArray(xona.jonliLenta) ? xona.jonliLenta : [];
    lenta.push(hodisa);
    await prisma.doskaXona.update({
      where: { xonaId: String(xonaId) },
      data: { jonliLenta: lenta.slice(-25) },
    });
  },

  async ismlarniOl(xonaId) {
    const prisma = await bazaniOl();
    const royxat = await prisma.doskaQatnashchi.findMany({
      where: { xonaId: String(xonaId), chetlatildi: false },
      select: { ism: true },
    });
    return royxat.map((q) => q.ism);
  },

  async qatnashchiQosh({ id, xonaId, ism, jamoaId, savollar }) {
    const prisma = await bazaniOl();
    const q = await prisma.doskaQatnashchi.create({
      data: { id, xonaId: String(xonaId), ism, jamoaId, savollar },
    });
    return {
      ...q,
      sarflanganVaqt: q.sarflanganVaqt,
      oxirgiSavolVaqti: q.oxirgiSavolVaqti.getTime(),
      javoblar: {},
    };
  },

  async qatnashchiniOl(xonaId, qatnashchiId) {
    const prisma = await bazaniOl();
    const q = await prisma.doskaQatnashchi.findFirst({
      where: { id: qatnashchiId, xonaId: String(xonaId) },
      include: { javoblar: true },
    });
    if (!q) return null;
    const javoblar = {};
    for (const j of q.javoblar) {
      javoblar[j.savolId] = {
        tanlanganIndex: j.tanlanganIndex,
        togri: j.togri,
        ball: j.ball,
        vaqt: j.vaqt.getTime(),
        sarflanganVaqtSoniya: j.sarflangan,
        qoidaBuzildi: j.qoidaBuzildi,
      };
    }
    return {
      id: q.id,
      ism: q.ism,
      jamoaId: q.jamoaId,
      ball: q.ball,
      sarflanganVaqt: q.sarflanganVaqt,
      qoidabuzarliklar: q.qoidabuzarliklar,
      boshlanganVaqt: q.boshlanganVaqt.getTime(),
      oxirgiSavolVaqti: q.oxirgiSavolVaqti.getTime(),
      savollar: q.savollar,
      javoblar,
      chetlatildi: q.chetlatildi,
      tugatdi: q.tugatdi,
    };
  },

  async xonaQatnashchilariniOl(xonaId) {
    const prisma = await bazaniOl();
    const royxat = await prisma.doskaQatnashchi.findMany({
      where: { xonaId: String(xonaId) },
      select: {
        id: true, ism: true, jamoaId: true, ball: true,
        sarflanganVaqt: true, qoidabuzarliklar: true,
        chetlatildi: true, tugatdi: true,
        _count: { select: { javoblar: true } },
      },
    });
    return royxat.map((q) => ({ ...q, ishlaganSavollar: q._count.javoblar }));
  },

  async javobYoz({ xonaId, qatnashchiId, savolId, yozuv }) {
    const prisma = await bazaniOl();
    try {
      await prisma.doskaJavob.create({
        data: {
          qatnashchiId,
          savolId: Number(savolId),
          tanlanganIndex: yozuv.tanlanganIndex,
          togri: yozuv.togri,
          ball: yozuv.ball,
          sarflangan: yozuv.sarflanganVaqtSoniya,
          qoidaBuzildi: yozuv.qoidaBuzildi,
        },
      });
      return "yozildi";
    } catch (e) {
      // P2002 — bu savolga javob bor (qayta yuborish yoki poyga)
      if (e?.code === "P2002") return "mavjud";
      // P2003 — qatnashchi o'chirilgan (chetlatish cascade'i)
      if (e?.code === "P2003") throw new Error("Ishtirokchi topilmadi yoki chetlatilgan");
      throw e;
    }
  },

  async qatnashchiYangila(xonaId, qatnashchiId, ozgarish) {
    const prisma = await bazaniOl();
    const data = {};
    // increment — atomar: bir vaqtda kelgan javoblar bir-birini o'chirmaydi
    if (ozgarish.ballDelta) data.ball = { increment: ozgarish.ballDelta };
    if (ozgarish.sarflanganDelta) data.sarflanganVaqt = { increment: ozgarish.sarflanganDelta };
    if (ozgarish.qoidaDelta) data.qoidabuzarliklar = { increment: ozgarish.qoidaDelta };
    if (ozgarish.oxirgiSavolVaqti !== undefined) data.oxirgiSavolVaqti = new Date(ozgarish.oxirgiSavolVaqti);
    if (ozgarish.tugatdi !== undefined) data.tugatdi = ozgarish.tugatdi;
    if (ozgarish.chetlatildi !== undefined) data.chetlatildi = ozgarish.chetlatildi;
    try {
      await prisma.doskaQatnashchi.update({ where: { id: qatnashchiId }, data });
    } catch (e) {
      if (e?.code === "P2025") return null;
      throw e;
    }
    return true;
  },

  async barchaningSavolVaqtiniYangila(xonaId, vaqt) {
    const prisma = await bazaniOl();
    await prisma.doskaQatnashchi.updateMany({
      where: { xonaId: String(xonaId) },
      data: { oxirgiSavolVaqti: new Date(vaqt) },
    });
  },

  async eskiXonalarniTozala() {
    const prisma = await bazaniOl();
    // Cascade o'chiradi: qatnashchilar va javoblar xona bilan ketadi
    await prisma.doskaXona.deleteMany({
      where: { yaratilganVaqt: { lt: new Date(Date.now() - XONA_YOSHI_MS) } },
    });
  },
};

// ═══════════════════════════════════════════════════════════════
// 3. TANLASH
// ═══════════════════════════════════════════════════════════════

/** Joriy muhit uchun ombor — boshqaruvchi faqat shu orqali ishlaydi */
export function omborniOl() {
  return omborTuri() === "baza" ? bazaOmbor : xotiraOmbor;
}

/** Testlar uchun: xotira omboridagi jonli xona obyekti (baza rejimida yo'q) */
export function ichkiXonaniOl(xonaId) {
  if (omborTuri() !== "xotira") throw new Error("ichkiXonaniOl faqat xotira rejimida");
  return xonalar.get(String(xonaId)) || null;
}
