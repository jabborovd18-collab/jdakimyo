// lib/lab-birlik.js sinovi — o'lchov birligi va ulush o'tkazmalari.
//
// NEGA _esm-require: lib/ ESM sintaksisida, package.json da "type":
// "module" yo'q — oddiy node (CI da Node 20) uni to'g'ridan-to'g'ri
// import qila olmaydi. Loyihaning o'z yechimi scripts/_esm-require.js
// (u lab-birlik.js ning lab-modda.js ga bog'ligini o'zi hal qiladi).
//
// QOIDA: mavjud xatti-harakat yozib olinadi, tuzatilmaydi.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const esmRequire = require('../scripts/_esm-require');

const {
  ulush,
  donadanMiqdor,
  hajmniBirlikka,
  birlikdanHajmga,
  yetadimi,
  reagentBirligi,
  koefdanMiqdor,
} = esmRequire('lib/lab-birlik.js', [
  'ulush',
  'donadanMiqdor',
  'hajmniBirlikka',
  'birlikdanHajmga',
  'yetadimi',
  'reagentBirligi',
  'koefdanMiqdor',
]);

describe('ulush', () => {
  test('bitta "dona" nechaga teng: ml 25, gr 5, dona 1', () => {
    assert.equal(ulush('ml'), 25);
    assert.equal(ulush('gr'), 5);
    assert.equal(ulush('dona'), 1);
  });

  test("noma'lum birlik — zaxira 1 (dona kabi)", () => {
    assert.equal(ulush('xyz'), 1);
    assert.equal(ulush(undefined), 1);
  });
});

describe('donadanMiqdor', () => {
  test('eski soni → yangi miqdor: 3 dona ml = 75, 2 dona gr = 10', () => {
    assert.equal(donadanMiqdor(3, 'ml'), 75);
    assert.equal(donadanMiqdor(2, 'gr'), 10);
    assert.equal(donadanMiqdor(4, 'dona'), 4);
  });

  test('nol, undefined va NaN — nol', () => {
    assert.equal(donadanMiqdor(0, 'ml'), 0);
    assert.equal(donadanMiqdor(undefined, 'ml'), 0);
    assert.equal(donadanMiqdor(NaN, 'ml'), 0);
  });

  test("satr sifatida kelgan son ham o'qiladi", () => {
    assert.equal(donadanMiqdor('4', 'ml'), 100);
  });

  test("manfiy son o'z holida o'tadi: -2 dona → -50 ml", () => {
    // Kirish manfiy bo'lmasligi inventar tomonidan kafolatlanadi;
    // funksiya o'zi uni kesmaydi — sinov shuni qayd etadi.
    assert.equal(donadanMiqdor(-2, 'ml'), -50);
  });
});

describe('hajmniBirlikka', () => {
  test("ml uchun o'zgarmas o'tkazish", () => {
    assert.equal(hajmniBirlikka(50, 'ml'), 50);
  });

  test('ml → gr ulush nisbatida: 25 ml = 5 g, 100 ml = 20 g', () => {
    assert.equal(hajmniBirlikka(25, 'gr'), 5);
    assert.equal(hajmniBirlikka(100, 'gr'), 20);
  });

  test('kasrli hajm ham aniq: 12.5 ml = 2.5 g', () => {
    assert.equal(hajmniBirlikka(12.5, 'gr'), 2.5);
  });

  test('ml → dona: 50 ml = 2 dona', () => {
    assert.equal(hajmniBirlikka(50, 'dona'), 2);
  });

  test("undefined va son bo'lmagan kirish — 0", () => {
    assert.equal(hajmniBirlikka(undefined, 'gr'), 0);
    assert.equal(hajmniBirlikka('abc', 'ml'), 0);
  });
});

describe('birlikdanHajmga', () => {
  test('gr → ml ulush nisbatida: 5 g = 25 ml, 2.5 g = 12.5 ml', () => {
    assert.equal(birlikdanHajmga(5, 'gr'), 25);
    assert.equal(birlikdanHajmga(2.5, 'gr'), 12.5);
  });

  test('dona → ml: 1 dona = 25 ml', () => {
    assert.equal(birlikdanHajmga(1, 'dona'), 25);
  });

  test("ml uchun o'zgarmas, nol uchun nol", () => {
    assert.equal(birlikdanHajmga(50, 'ml'), 50);
    assert.equal(birlikdanHajmga(0, 'gr'), 0);
  });

  test("borish-qaytish o'zgarmas: gr → hajm → gr", () => {
    // Stexiometrik nisbat shu o'tkazmalar orqali buzilmasligi kerak.
    // Qat'iy tenglik emas — 7.4 → 1.48 → 7.400000000000001 chiqadi,
    // yetadimi() dagi epsilon aynan shu uchun bor (AGENTS.md 7-band).
    for (const gr of [1, 2.5, 7.4, 37, 125]) {
      assert.ok(Math.abs(birlikdanHajmga(hajmniBirlikka(gr, 'gr'), 'gr') - gr) < 0.001);
    }
  });
});

describe('yetadimi', () => {
  test('bor ≥ kerak — true', () => {
    assert.equal(yetadimi(50, 50), true);
    assert.equal(yetadimi(75, 50), true);
  });

  test('epsilon: 49.999 yetadi (suzuvchi nuqta xatosi), 49.998 yetmaydi', () => {
    assert.equal(yetadimi(49.999, 50), true);
    assert.equal(yetadimi(49.998, 50), false);
  });

  test('nolga nol yetadi', () => {
    assert.equal(yetadimi(0, 0), true);
  });

  test("undefined/null ikkala tomonda nol kabi o'qiladi va yetadi", () => {
    assert.equal(yetadimi(undefined, undefined), true);
    assert.equal(yetadimi(null, null), true);
  });

  test('bor NaN — nolga aylanadi va yetmaydi', () => {
    assert.equal(yetadimi(NaN, 5), false);
  });
});

describe('reagentBirligi', () => {
  // BIRLIK HOSILAVIY: moddaning agregat holatidan chiqadi —
  // qattiq → gr, suyuq va gaz → ml (lab-modda.js yagona manba).

  test('qattiq modda gr: Fe, Cu, Zn', () => {
    assert.equal(reagentBirligi('Fe'), 'gr');
    assert.equal(reagentBirligi('Cu'), 'gr');
    assert.equal(reagentBirligi('Zn'), 'gr');
  });

  test('suyuq modda ml: H₂O, NaOH', () => {
    assert.equal(reagentBirligi('H₂O'), 'ml');
    assert.equal(reagentBirligi('NaOH'), 'ml');
  });

  test('gaz modda ml: O₂', () => {
    assert.equal(reagentBirligi('O₂'), 'ml');
  });

  test("jadvalda yo'q kalit — ml (dona emas): yangi reagent reagent bo'ladi", () => {
    assert.equal(reagentBirligi('YoqModda999'), 'ml');
    assert.equal(reagentBirligi(undefined), 'ml');
  });

  test('gaz belgisi tozalanadi: CO₂↑ → CO₂ → ml', () => {
    assert.equal(reagentBirligi('CO₂↑'), 'ml');
  });
});

describe('koefdanMiqdor', () => {
  test('"2NaOH" → 2 × 25 ml = 50 ml', () => {
    assert.equal(koefdanMiqdor(2, 'ml'), 50);
    assert.equal(koefdanMiqdor(3, 'gr'), 15);
  });

  test("nol koeffitsient 1 sifatida o'qiladi (hujjatlash): 0 → ulush", () => {
    // `Number(koef || 1)` — muvozanatlangan tenglamada koef 0 bo'lmaydi;
    // bo'lganda ham nisbat saqlanishi uchun 1 ga tushiriladi.
    assert.equal(koefdanMiqdor(0, 'gr'), 5);
    assert.equal(koefdanMiqdor(0, 'ml'), 25);
  });
});
