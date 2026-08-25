// lib/lab-erituvchi.js sinovi — suv turlari va ularning reaksiyaga ta'siri.
//
// NEGA _esm-require: lib/ ESM sintaksisida, package.json da "type":
// "module" yo'q — oddiy node (CI da Node 20) uni to'g'ridan-to'g'ri
// import qila olmaydi. Loyihaning o'z yechimi scripts/_esm-require.js.
//
// QOIDA: mavjud xatti-harakat yozib olinadi, tuzatilmaydi.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const esmRequire = require('../scripts/_esm-require');

const {
  erituvchimi,
  erituvchiOl,
  asosKaliti,
  eritmaErituvchisi,
  erituvchiBahosi,
} = esmRequire('lib/lab-erituvchi.js', [
  'erituvchimi',
  'erituvchiOl',
  'asosKaliti',
  'eritmaErituvchisi',
  'erituvchiBahosi',
]);

// Jadvaldagi ikki haqiqiy erituvchi — sinovlar qiymatlarni ulardan oladi,
// raqamlarni qayta yozib ikkinchi manba yaratmaydi.
const DISTILLANGAN = erituvchiOl('H₂O');
const JOMRAK = erituvchiOl('H₂O-oddiy');

describe('erituvchimi va erituvchiOl', () => {
  test('ikkala suv turi erituvchi: H₂O va H₂O-oddiy', () => {
    assert.equal(erituvchimi('H₂O'), true);
    assert.equal(erituvchimi('H₂O-oddiy'), true);
  });

  test('oddiy modda va prototip kalitlari erituvchi emas', () => {
    assert.equal(erituvchimi('NaOH'), false);
    assert.equal(erituvchimi('toString'), false);
    assert.equal(erituvchimi(undefined), false);
  });

  test("erituvchiOl: noma'lum — null; jo'mrak iflos va o'tkazuvchan", () => {
    assert.equal(erituvchiOl('NaCl'), null);
    assert.equal(JOMRAK.toza, false);
    assert.equal(JOMRAK.otkazuvchanlik, 400);
    assert.deepEqual(JOMRAK.aralashmalar, ['Ca²⁺', 'Mg²⁺', 'Cl⁻', 'HCO₃⁻']);
  });
});

describe('asosKaliti', () => {
  test("variant asosga aylantiriladi: jo'mrak suvi → H₂O", () => {
    assert.equal(asosKaliti('H₂O-oddiy'), 'H₂O');
  });

  test("asos o'zi va erituvchi bo'lmagan kalit o'z holida qaytadi", () => {
    // Mexanizm xavfsiz: har qanday kalitga qo\'llash mumkin.
    assert.equal(asosKaliti('H₂O'), 'H₂O');
    assert.equal(asosKaliti('NaCl'), 'NaCl');
  });

  test('undefined — undefined qaytadi (hujjatlash)', () => {
    assert.equal(asosKaliti(undefined), undefined);
  });
});

describe('eritmaErituvchisi', () => {
  test("aralashmada eng iflos (o'tkazuvchanligi baland) suv g'olib", () => {
    const r = eritmaErituvchisi(['H₂O', 'H₂O-oddiy']);
    assert.equal(r.kalit, 'H₂O-oddiy');
    assert.equal(r.xossa.toza, false);
  });

  test('faqat toza suv quyilgan — distillangan qaytadi', () => {
    assert.equal(eritmaErituvchisi(['H₂O']).kalit, 'H₂O');
  });

  test("erituvchisiz ro'yxat (modda, bo'sh, undefined) — null", () => {
    assert.equal(eritmaErituvchisi(['NaCl']), null);
    assert.equal(eritmaErituvchisi([]), null);
    assert.equal(eritmaErituvchisi(undefined), null);
  });
});

describe('erituvchiBahosi', () => {
  // ── Suv umuman quyilmagan ──

  test('erituvchi yo\'q — baho "mos", hech qanday jazo yo\'q', () => {
    assert.deepEqual(erituvchiBahosi({ category: "cho'ktirish" }, null), {
      holat: 'mos',
      izoh: null,
      unumKoef: 1,
      xpKoef: 1,
      kuzatuv: null,
      toxtatadimi: false,
    });
  });

  // ── Elektroliz: tok o'tkazuvchanlik shart ──

  test('elektroliz + distillangan suv — "otkazmaydi", to\'liq to\'xtatadi', () => {
    const r = erituvchiBahosi({ category: 'elektroliz' }, DISTILLANGAN);
    assert.equal(r.holat, 'otkazmaydi');
    assert.equal(r.unumKoef, 0);
    assert.equal(r.xpKoef, 0);
    assert.equal(r.toxtatadimi, true);
    assert.ok(r.izoh.includes("tokni o'tkazmaydi"));
  });

  test("elektroliz + jo'mrak suvi — 'mos' (ionlar bor, tok o'tadi)", () => {
    const r = erituvchiBahosi({ category: 'elektroliz' }, JOMRAK);
    assert.equal(r.holat, 'mos');
    assert.equal(r.unumKoef, 1);
  });

  test("elektroliz techniques ro'yxatidan ham aniqlanadi", () => {
    const r = erituvchiBahosi({ techniques: ['Elektroliz'] }, DISTILLANGAN);
    assert.equal(r.holat, 'otkazmaydi');
  });

  test("chegara aniq 50 µS/sm — hali o'tadi, 49.999 — o'tmaydi", () => {
    assert.equal(
      erituvchiBahosi({ category: 'elektroliz' }, { toza: true, otkazuvchanlik: 50 }).holat,
      'mos',
    );
    assert.equal(
      erituvchiBahosi({ category: 'elektroliz' }, { toza: true, otkazuvchanlik: 49.999 }).holat,
      'otkazmaydi',
    );
  });

  // ── Cho'ktirish va sifat tahlili: jo'mrak suvi buzadi ──

  test("cho'ktirish + jo'mrak suvi — 'ifloslandi', jazo yumshoq", () => {
    const r = erituvchiBahosi({ category: "cho'ktirish" }, JOMRAK);
    assert.equal(r.holat, 'ifloslandi');
    assert.equal(r.unumKoef, 0.6);
    assert.equal(r.xpKoef, 0.5);
    assert.equal(r.toxtatadimi, false); // reaksiya boradi, faqat natija iflos
    assert.equal(r.kuzatuv, "Eritma xiraroq — suvdagi tuzlar ham cho'kmaga tushdi.");
    assert.ok(r.izoh.includes("Jo'mrak suvidagi ionlar"));
    assert.ok(r.izoh.includes('Cl⁻'));
  });

  test("cho'ktirish + distillangan suv — 'mos'", () => {
    assert.equal(erituvchiBahosi({ category: "cho'ktirish" }, DISTILLANGAN).holat, 'mos');
  });

  test('sifat tahlili reactionType orqali ham sezgir', () => {
    const r = erituvchiBahosi({ reactionType: 'Sifat tahlili' }, JOMRAK);
    assert.equal(r.holat, 'ifloslandi');
  });

  test('kovrak apostrof (’) kategoriyada ham aniqlanadi — matn normallashadi', () => {
    const r = erituvchiBahosi({ category: 'cho’ktirish' }, JOMRAK);
    assert.equal(r.holat, 'ifloslandi');
  });

  // ── Boshqa ──

  test("sezgir bo'lmagan reaksiya — jo'mrak suvi ham buzmaydi", () => {
    assert.equal(erituvchiBahosi({}, JOMRAK).holat, 'mos');
    assert.equal(erituvchiBahosi({}, DISTILLANGAN).holat, 'mos');
  });

  test('reaksiya null — belgilar bo\'sh, har qanday erituvchi "mos"', () => {
    assert.equal(erituvchiBahosi(null, DISTILLANGAN).holat, 'mos');
    assert.equal(erituvchiBahosi(null, JOMRAK).holat, 'mos');
  });
});
