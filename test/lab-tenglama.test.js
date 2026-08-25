// lib/lab-tenglama.js sinovi — tenglamani katalog kalitlariga ajratish.
//
// NEGA _esm-require: lib/ ESM sintaksisida, package.json da "type":
// "module" yo'q — oddiy node (CI da Node 20) uni to'g'ridan-to'g'ri
// import qila olmaydi. Loyihaning o'z yechimi scripts/_esm-require.js.
//
// QOIDA: mavjud xatti-harakat yozib olinadi, tuzatilmaydi.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const esmRequire = require('../scripts/_esm-require');

const { azoniKalitla, tenglamaniAjrat, toplamKaliti } = esmRequire(
  'lib/lab-tenglama.js',
  ['azoniKalitla', 'tenglamaniAjrat', 'toplamKaliti'],
);

describe('azoniKalitla', () => {
  test('koeffitsient ajratiladi: "2NaOH" → NaOH × 2', () => {
    assert.deepEqual(azoniKalitla('2NaOH'), { kalit: 'NaOH', koef: 2 });
  });

  test('ikki xonali koeffitsient: "16HCl"', () => {
    assert.deepEqual(azoniKalitla('16HCl'), { kalit: 'HCl', koef: 16 });
  });

  test("koeffitsient son va formula orasidagi bosh joy o'qib tashlanadi", () => {
    assert.deepEqual(azoniKalitla('12 H₂O'), { kalit: 'H₂O', koef: 12 });
  });

  test('gaz belgisi (↑) olib tashlanadi: "H₂↑" → H₂', () => {
    assert.deepEqual(azoniKalitla('H₂↑'), { kalit: 'H₂', koef: 1 });
  });

  test('gaz belgisi koeffitsient bilan birga: "5Cl₂↑" → Cl₂ × 5', () => {
    assert.deepEqual(azoniKalitla('5Cl₂↑'), { kalit: 'Cl₂', koef: 5 });
  });

  test('cho\'kma belgisi (↓) olib tashlanadi: "AgCl↓" → AgCl', () => {
    assert.deepEqual(azoniKalitla('AgCl↓'), { kalit: 'AgCl', koef: 1 });
  });

  test('chet ellik konsentratsiya belgilari olib tashlanadi', () => {
    assert.deepEqual(azoniKalitla('HCl(dilute)'), { kalit: 'HCl', koef: 1 });
    assert.deepEqual(azoniKalitla('H₂SO₄(kons.)'), { kalit: 'H₂SO₄', koef: 1 });
  });

  test('bosh va bosh joylar: null, undefined, "" — barchasi null', () => {
    assert.equal(azoniKalitla(''), null);
    assert.equal(azoniKalitla('   '), null);
    assert.equal(azoniKalitla(null), null);
    assert.equal(azoniKalitla(undefined), null);
  });

  test('nol koeffitsient modda emas: "0" va "00H₂O" — null', () => {
    assert.equal(azoniKalitla('0'), null);
    assert.equal(azoniKalitla('00H₂O'), null);
  });

  test('reaksiya sxemasidagi shartli belgilar modda emas', () => {
    for (const belgi of ['[O]', '[H]', 'e⁻', 'hv', 'hν', 't°', 'kat', 'kat.']) {
      assert.equal(azoniKalitla(belgi), null, `"${belgi}" null bo'lishi kerak`);
    }
  });

  test('minus belgisi kalitga o\'tib ketadi (hujjatlash): "-2NaOH"', () => {
    // Regex faqat BOSHLANISHIDAGI raqamni ko'radi; "-" uni to'sib qo'yadi
    // va keyingi belgilar toza modda sifatida qoladi. Muvozanatlangan
    // tenglamalarda manfiy koeffitsient uchramaydi, shuning uchun bu
    // holat amalda ma'noga ega emas — sinov shuni qayd etadi.
    assert.deepEqual(azoniKalitla('-2NaOH'), { kalit: '-2NaOH', koef: 1 });
  });

  test('kasrli koeffitsient butun va qoldiqqa bo\'linadi (hujjatlash): "2.5H₂O"', () => {
    // "2" koef sifatida olinadi, ".5" esa kalitning boshiga yopishib qoladi.
    assert.deepEqual(azoniKalitla('2.5H₂O'), { kalit: '.5H₂O', koef: 2 });
  });
});

describe('tenglamaniAjrat', () => {
  test("suv sintezi: chap va ong to'laqonle ajratiladi", () => {
    assert.deepEqual(tenglamaniAjrat('2H₂ + O₂ → 2H₂O'), {
      chap: [
        { kalit: 'H₂', koef: 2 },
        { kalit: 'O₂', koef: 1 },
      ],
      ong: [{ kalit: 'H₂O', koef: 2 }],
    });
  });

  test("bir tomonda takrorlangan modda yig'indi qilinadi", () => {
    assert.deepEqual(tenglamaniAjrat('H₂ + H₂ + O₂ → 2H₂O'), {
      chap: [
        { kalit: 'H₂', koef: 2 },
        { kalit: 'O₂', koef: 1 },
      ],
      ong: [{ kalit: 'H₂O', koef: 2 }],
    });
  });

  test("murakkab amaliy tenglama to'liq ajratiladi (KMnO₄ + HCl)", () => {
    const r = tenglamaniAjrat('2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂↑ + 8H₂O');
    assert.deepEqual(r.chap, [
      { kalit: 'KMnO₄', koef: 2 },
      { kalit: 'HCl', koef: 16 },
    ]);
    assert.deepEqual(r.ong, [
      { kalit: 'KCl', koef: 2 },
      { kalit: 'MnCl₂', koef: 2 },
      { kalit: 'Cl₂', koef: 5 },
      { kalit: 'H₂O', koef: 8 },
    ]);
  });

  test("qaytar reaksiya strelkasi (⇌) ham bo'luvchi", () => {
    const r = tenglamaniAjrat('N₂ + 3H₂ ⇌ 2NH₃');
    assert.deepEqual(r.chap, [
      { kalit: 'N₂', koef: 1 },
      { kalit: 'H₂', koef: 3 },
    ]);
    assert.deepEqual(r.ong, [{ kalit: 'NH₃', koef: 2 }]);
  });

  test("ikki yo'nalishli strelka (↔) ham bo'luvchi", () => {
    const r = tenglamaniAjrat('A ↔ B');
    assert.deepEqual(r.chap, [{ kalit: 'A', koef: 1 }]);
    assert.deepEqual(r.ong, [{ kalit: 'B', koef: 1 }]);
  });

  test('teng belgisi (=) ham strelka sifatida qabul qilinadi', () => {
    const r = tenglamaniAjrat('A + B = C');
    assert.deepEqual(r.chap, [
      { kalit: 'A', koef: 1 },
      { kalit: 'B', koef: 1 },
    ]);
    assert.deepEqual(r.ong, [{ kalit: 'C', koef: 1 }]);
  });

  test("ion zaryadlari (⁺/⁻) bo'linishni buzmaydi: Ag⁺ + Cl⁻", () => {
    const r = tenglamaniAjrat('Ag⁺ + Cl⁻ → AgCl↓');
    assert.deepEqual(r.chap, [
      { kalit: 'Ag⁺', koef: 1 },
      { kalit: 'Cl⁻', koef: 1 },
    ]);
    assert.deepEqual(r.ong, [{ kalit: 'AgCl', koef: 1 }]);
  });

  test("strelka yo'q — null", () => {
    assert.equal(tenglamaniAjrat('NaCl'), null);
  });

  test('strelka faqat bitta bo\'lishi kerak: "A → B → C" — null', () => {
    assert.equal(tenglamaniAjrat('A → B → C'), null);
  });

  test("tomonlardan biri bo'sh — null", () => {
    assert.equal(tenglamaniAjrat('A →'), null);
    assert.equal(tenglamaniAjrat('→ B'), null);
  });

  test("bo'sh, null va undefined kirish — null", () => {
    assert.equal(tenglamaniAjrat(''), null);
    assert.equal(tenglamaniAjrat(null), null);
    assert.equal(tenglamaniAjrat(undefined), null);
  });

  test("barcha a'zolar modda bo'lmasa (kat, t°) — tomon bo'sh, null", () => {
    assert.equal(tenglamaniAjrat('kat + t° → X'), null);
  });
});

describe('toplamKaliti', () => {
  test('takrorlar olib tashlanib, tartibga solinadi', () => {
    assert.equal(toplamKaliti(['B', 'A', 'A']), 'A + B');
  });

  test('kirish tartibi ahamiyatsiz — barmoq izi bir xil', () => {
    assert.equal(toplamKaliti(['O₂', 'H₂']), toplamKaliti(['H₂', 'O₂']));
    assert.equal(toplamKaliti(['H₂', 'O₂']), 'H₂ + O₂');
  });

  test("bo'sh ro'yxat — bo'sh satr", () => {
    assert.equal(toplamKaliti([]), '');
  });

  test("yakka kalit o'zidan iborat", () => {
    assert.equal(toplamKaliti(['H₂O']), 'H₂O');
  });

  test('undefined tashlamaydi — bo\'sh to\'plam sifatida "" qaytadi', () => {
    // new Set(undefined) hatolik bermaydi, bo'sh to'plam yasaydi.
    assert.equal(toplamKaliti(undefined), '');
  });
});
