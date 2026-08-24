// lib/lab-nisbat.js sinovi — stexiometrik bahoning server hakami.
//
// NEGA _esm-require: lib/ fayllari ESM sintaksisida, package.json da esa
// "type": "module" yo'q (ularni Next.js o'zi kompilyatsiya qiladi). Oddiy
// node — jumladan CI dagi Node 20 — bunday faylni to'g'ridan-to'g'ri
// import qila olmaydi. Loyihaning o'z yechimi `scripts/_esm-require.js`
// (scripts/check-reactions.js ham xuddi shuni ishlatadi), shu sinovlar ham
// o'sha yo'ldan yuradi.
//
// QOIDA: bu sinovlar MAVJUD xatti-harakatni yozib oladi, tuzatmaydi.
// Kod shu satri o'zgartirilmadi.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const esmRequire = require('../scripts/_esm-require');

const { nisbatniBaho, xpKoeffitsiyenti, NISBAT_CHEGARALARI } = esmRequire(
  'lib/lab-nisbat.js',
  ['nisbatniBaho', 'xpKoeffitsiyenti', 'NISBAT_CHEGARALARI'],
);

// 1:2 stexiometriyali namuna reaksiya: A + 2B
const KERAK_AB = [
  { kalit: 'A', miqdor: 100 },
  { kalit: 'B', miqdor: 200 },
];

describe('nisbatniBaho', () => {
  // ── To'rtta holat ──

  test("holat 'togri': aniq stexiometrik nisbat", () => {
    const r = nisbatniBaho({ A: 100, B: 200 }, KERAK_AB);
    assert.equal(r.holat, 'togri');
    assert.equal(r.unum, 1);
    assert.equal(r.nisbat, 1);
    assert.equal(r.togrilikFoizi, 1);
    assert.equal(r.cheklovchi, 'A');
    assert.equal(r.ortiqchaKalit, 'A'); // barcha ulush teng — birinchisi qoladi
    assert.deepEqual(r.qoldiq, {});
    assert.ok(r.izoh.includes("to'g'ri nisbatda"));
  });

  test("holat 'ortiqcha': nisbat 1.5 dan oshsa, behuda ketgan qoldiq qaytadi", () => {
    const r = nisbatniBaho({ A: 100, B: 300 }, KERAK_AB);
    assert.equal(r.holat, 'ortiqcha');
    assert.equal(r.nisbat, 1.5);
    assert.equal(r.togrilikFoizi, 0.667); // 1 / 1.5, 3 xonaga yaxlitlangan
    assert.equal(r.cheklovchi, 'A');
    assert.equal(r.ortiqchaKalit, 'B');
    assert.deepEqual(r.qoldiq, { B: 100 }); // 300 − 1 ulush × 200
    assert.ok(r.izoh.includes('biroz ortiqcha'));
  });

  test("holat 'keskin-ortiqcha': nisbat 3 dan oshsa", () => {
    const r = nisbatniBaho({ A: 100, B: 700 }, KERAK_AB);
    assert.equal(r.holat, 'keskin-ortiqcha');
    assert.equal(r.nisbat, 3.5);
    assert.deepEqual(r.qoldiq, { B: 500 });
    assert.ok(r.izoh.includes('3.5 barobar'));
  });

  test("holat 'chala' (oz): unum chegaradan past, lekin nol emas", () => {
    const r = nisbatniBaho({ A: 10, B: 20 }, KERAK_AB);
    assert.equal(r.holat, 'chala');
    assert.equal(r.unum, 0.1);
    assert.equal(r.nisbat, 1); // nisbat o'zi mukammal — muammo miqdorda
    assert.ok(r.izoh.includes('10%'));
  });

  test("holat 'chala' (nol): kerak reagent umuman quyilmadi", () => {
    const r = nisbatniBaho({ B: 200 }, KERAK_AB);
    assert.equal(r.holat, 'chala');
    assert.equal(r.unum, 0);
    // ICHKI nisbat Infinity — qaytarishda son emas, 0 sentinel sifatida qaytadi
    assert.equal(r.nisbat, 0);
    assert.equal(r.cheklovchi, 'A');
    assert.ok(r.izoh.includes('A umuman quyilmadi'));
    // B esa to'lig'icha behuda ketdi: sarflanadigan ulush 0
    assert.deepEqual(r.qoldiq, { B: 200 });
  });

  // ── Chegaralar ──

  test("chegara: unum aynan 0.2 — chala EMAS (chala sharti qat'iy kichik)", () => {
    const r = nisbatniBaho({ A: 20, B: 40 }, KERAK_AB);
    assert.equal(r.holat, 'togri');
  });

  test('chegara: unum 0.1999 — chala', () => {
    const r = nisbatniBaho({ A: 19.99, B: 39.98 }, KERAK_AB);
    assert.equal(r.holat, 'chala');
  });

  test('chegara: nisbat 1.4999 — togri, 1.5 — ortiqcha', () => {
    assert.equal(
      nisbatniBaho({ A: 10000, B: 14999 }, [
        { kalit: 'A', miqdor: 10000 },
        { kalit: 'B', miqdor: 10000 },
      ]).holat,
      'togri',
    );
    assert.equal(
      nisbatniBaho({ A: 10000, B: 15000 }, [
        { kalit: 'A', miqdor: 10000 },
        { kalit: 'B', miqdor: 10000 },
      ]).holat,
      'ortiqcha',
    );
  });

  test('chegara: nisbat 2.99 — ortiqcha, 3.0 — keskin-ortiqcha', () => {
    assert.equal(
      nisbatniBaho({ A: 100, B: 299 }, [
        { kalit: 'A', miqdor: 100 },
        { kalit: 'B', miqdor: 100 },
      ]).holat,
      'ortiqcha',
    );
    assert.equal(
      nisbatniBaho({ A: 100, B: 300 }, [
        { kalit: 'A', miqdor: 100 },
        { kalit: 'B', miqdor: 100 },
      ]).holat,
      'keskin-ortiqcha',
    );
  });

  // ── Tartib: "yetarlimi" savoli "mutanosibmi" savolidan OLDIN ──

  test("chala keskin-ortiqchadan ustun: bir tomchi + o'nta barobar", () => {
    const r = nisbatniBaho({ A: 1, B: 10000 }, [
      { kalit: 'A', miqdor: 100 },
      { kalit: 'B', miqdor: 100 },
    ]);
    assert.equal(r.holat, 'chala');
  });

  // ── Bo'sh va noto'g'ri kirishlar ──

  test('kerak bo\'sh: nisbat talab etilmaydi — baho "togri"', () => {
    const r = nisbatniBaho({ A: 5 }, []);
    assert.equal(r.holat, 'togri');
    assert.equal(r.unum, 1);
    assert.equal(r.nisbat, 1);
    assert.equal(r.togrilikFoizi, 1);
    assert.equal(r.cheklovchi, null);
    assert.equal(r.ortiqchaKalit, null);
    assert.deepEqual(r.qoldiq, {});
    assert.equal(r.izoh, 'Reaksiya uchun maxsus nisbat talab etilmaydi.');
  });

  test("kerak null yoki massiv emas — xuddi shu trivial 'togri' javobi", () => {
    for (const yaramas of [null, undefined, 'abc', {}]) {
      const r = nisbatniBaho({}, yaramas);
      assert.equal(r.holat, 'togri');
      assert.equal(r.izoh, 'Reaksiya uchun maxsus nisbat talab etilmaydi.');
    }
  });

  test('ikkala argument berilmasa — trivial javob, tashlamaydi', () => {
    const r = nisbatniBaho();
    assert.equal(r.holat, 'togri');
    assert.equal(r.unum, 1);
  });

  test("quyilgan bo'sh obyekt — eng kichik ulush 0, holat chala", () => {
    const r = nisbatniBaho({}, [{ kalit: 'A', miqdor: 100 }]);
    assert.equal(r.holat, 'chala');
    assert.equal(r.cheklovchi, 'A');
    assert.deepEqual(r.qoldiq, {});
  });

  // ── G'alati, lekin mavjud xatti-harakatlar ──

  test('manfiy quyilgan miqdor: nol kabi "chala", ortiqchaKalit null qoladi', () => {
    // Barcha ulush manfiy bo'lsa engKatta (0 dan boshlanadi) hech qachon
    // oshmaydi — shu sababdan ortiqchaKalit aniqlanmaydi.
    const r = nisbatniBaho({ A: -50, B: -100 }, KERAK_AB);
    assert.equal(r.holat, 'chala');
    assert.equal(r.unum, -0.5);
    assert.equal(r.ortiqchaKalit, null);
    assert.equal(r.nisbat, 0); // Infinity ichki qiymat — qaytarishda 0
  });

  test("kerakda nol talab ('miqdor: 0') — ulush 0 hisoblanib chala chiqadi", () => {
    // Kod muallifi izohida "nol talab bo'lishi mumkin emas" deb yozgan:
    // tenglamadagi koeffitsient har doim ≥ 1, demak bu holat amalda
    // uchramaydi. Sinov mavjud munosabatni qayd etadi.
    const r = nisbatniBaho({ A: 100 }, [
      { kalit: 'A', miqdor: 100 },
      { kalit: 'B', miqdor: 0 },
    ]);
    assert.equal(r.holat, 'chala');
    assert.equal(r.cheklovchi, 'B');
  });

  test("quyilgandagi ortiqcha kalitlar (kerakda yo'qlar) e'tiborga olinmaydi", () => {
    const r = nisbatniBaho({ A: 100, B: 200, C: 9999 }, KERAK_AB);
    assert.equal(r.holat, 'togri');
    assert.ok(!('C' in r.qoldiq));
  });

  // ── Aniqlik va katta sonlar ──

  test('qoldiq uch xonagacha yaxlitlanadi', () => {
    const r = nisbatniBaho({ A: 100, B: 355.1234 }, KERAK_AB);
    assert.deepEqual(r.qoldiq, { B: 155.123 });
  });

  test("aniq quyilganda qoldiq bo'sh (0.001 ostidagi ortiq-chalar tushmaydi)", () => {
    const r = nisbatniBaho({ A: 100.0005, B: 200 }, KERAK_AB);
    assert.deepEqual(r.qoldiq, {}); // A dagi 0.0005 ortiqcha chegara ostida
  });

  test('juda katta sonlar: 10^12 miqdorlarda ham togri saqlanadi', () => {
    const r = nisbatniBaho(
      { A: 1e12, B: 2e12 },
      [
        { kalit: 'A', miqdor: 1e12 },
        { kalit: 'B', miqdor: 2e12 },
      ],
    );
    assert.equal(r.holat, 'togri');
    assert.equal(r.unum, 1);
    assert.equal(r.nisbat, 1);
  });

  test('chegara konstantalari dokumentatsiyadagi qiymatlarda', () => {
    assert.equal(NISBAT_CHEGARALARI.chala, 0.2);
    assert.equal(NISBAT_CHEGARALARI.ortiqcha, 1.5);
    assert.equal(NISBAT_CHEGARALARI.keskin, 3.0);
  });
});

describe('xpKoeffitsiyenti', () => {
  test("to'rtta holatning aniq koeffitsientlari", () => {
    assert.equal(xpKoeffitsiyenti('togri'), 1.0);
    assert.equal(xpKoeffitsiyenti('ortiqcha'), 0.7);
    assert.equal(xpKoeffitsiyenti('keskin-ortiqcha'), 0.4);
    assert.equal(xpKoeffitsiyenti('chala'), 0.3);
  });

  test("noma'lum holat — to'liq koeffitsient (1.0) bilan himoyalangan", () => {
    // `?? 1.0` ataylab: notanish holat o'quvchidan XP olib qo'ymasin.
    assert.equal(xpKoeffitsiyenti('noma-lum'), 1.0);
    assert.equal(xpKoeffitsiyenti(undefined), 1.0);
    assert.equal(xpKoeffitsiyenti(null), 1.0);
  });
});
