// lib/lab-idish.js sinovi — sig'im, material va reaksiyaning idishni
// yaroqsiz qilishi.
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
  idishmi,
  idishOl,
  idishSigimi,
  idishMateriali,
  idishXavfi,
  haroratniOqi,
} = esmRequire('lib/lab-idish.js', [
  'idishmi',
  'idishOl',
  'idishSigimi',
  'idishMateriali',
  'idishXavfi',
  'haroratniOqi',
]);

describe('idishmi', () => {
  test("sig'imi bor buyum — idish: probirka, stakan", () => {
    assert.equal(idishmi('probirka'), true);
    assert.equal(idishmi('stakan'), true);
    assert.equal(idishmi('kvars-naycha'), true);
  });

  test("ularga hech narsa quyilmaydigan buyum — idish emas", () => {
    assert.equal(idishmi('shtativ'), false);
    assert.equal(idishmi('spirtovka'), false);
  });

  test("noma'lum kalit — false", () => {
    assert.equal(idishmi('yoq-idish'), false);
  });

  test('prototipdagi xossalar (toString, constructor) idish emas', () => {
    // hasOwnProperty borasida: aks holda "toString" [object Object] sig'imi
    // bilan "idish" bo'lib qolardi.
    assert.equal(idishmi('toString'), false);
    assert.equal(idishmi('constructor'), false);
    assert.equal(idishmi(undefined), false);
  });
});

describe('idishOl va idishSigimi', () => {
  test("idishOl: ma'lum kalit — sig'im va material, noma'lum — null", () => {
    assert.deepEqual(idishOl('probirka'), { sigim: 25, material: 'shisha' });
    assert.equal(idishOl('yoq-idish'), null);
  });

  test("sig'imlar jadval qiymatlarida: probirka 25, kolba 120, kvars 20", () => {
    assert.equal(idishSigimi('probirka'), 25);
    assert.equal(idishSigimi('kolba'), 120);
    assert.equal(idishSigimi('kvars-naycha'), 20);
  });

  test("noma'lum va null kalit — zaxira sig'im 100", () => {
    assert.equal(idishSigimi('yoq-idish'), 100);
    assert.equal(idishSigimi(null), 100);
    assert.equal(idishSigimi('constructor'), 100);
  });

  test("material: shisha idish — Shissa, noma'lum — zaxira shisha", () => {
    assert.equal(idishMateriali('probirka').nom, 'Shisha');
    assert.equal(idishMateriali('yoq-idish').nom, 'Shisha');
    assert.equal(idishMateriali('chinni-kosacha').nom, 'Chinni');
  });
});

describe('haroratniOqi', () => {
  test('diapazondan eng kattasi olinadi: "400-500°C" → 500', () => {
    assert.equal(haroratniOqi('400-500°C'), 500);
  });

  test('bosh joy bilan yozilgan: "1200 °C" → 1200', () => {
    assert.equal(haroratniOqi('1200 °C'), 1200);
  });

  test("bo'sh, null, undefined — 0", () => {
    assert.equal(haroratniOqi(''), 0);
    assert.equal(haroratniOqi(null), 0);
    assert.equal(haroratniOqi(undefined), 0);
  });

  test('belgili harorat "t°" — 0 (raqam yo\'q)', () => {
    assert.equal(haroratniOqi('t°'), 0);
  });

  test('bir xonali raqam ko\'rinmaydi (hujjatlash): "9°C" → 0', () => {
    // Regex \d{2,4} — kamida IKKI xona talab qiladi. Bazadagi
    // reaksiyalarda harorat 15 °C dan past uchramaydi, shuning uchun
    // bu holat amalda mavjud emas.
    assert.equal(haroratniOqi('9°C'), 0);
  });
});

describe('idishXavfi', () => {
  // ── 1-sabab: ftorid kislota ──

  test('HF shishani eritadi — buziladi, sabab ftoriddan', () => {
    const r = idishXavfi({ temperature: '100°C' }, ['HF'], 'probirka');
    assert.equal(r.buziladimi, true);
    assert.ok(r.sabab.startsWith('Ftorid kislota'));
  });

  test("HF chinniga ta'sir qilmaydi", () => {
    assert.equal(
      idishXavfi({ temperature: '100°C' }, ['HF'], 'chinni-kosacha').buziladimi,
      false,
    );
  });

  test('HF kvartsni ham eritadi (kvarts ham SiO₂)', () => {
    assert.equal(
      idishXavfi({ temperature: '100°C' }, ['HF'], 'kvars-naycha').buziladimi,
      true,
    );
  });

  test("reaksiya null bo'lsa ham HF aniqlanadi", () => {
    assert.equal(idishXavfi(null, ['HF'], 'probirka').buziladimi, true);
  });

  // ── 2-sabab: harorat ──

  test('600 °C shisha idishni yiqitadi — sababda harorat ham chegar ham bor', () => {
    const r = idishXavfi({ temperature: '600°C' }, [], 'probirka');
    assert.equal(r.buziladimi, true);
    assert.ok(r.sabab.includes('600 °C'));
    assert.ok(r.sabab.includes('500 °C'));
  });

  test('chegara aynan 500 °C — buzilmaydi, 501 — buziladi', () => {
    assert.equal(idishXavfi({ temperature: '500°C' }, [], 'probirka').buziladimi, false);
    assert.equal(idishXavfi({ temperature: '501°C' }, [], 'probirka').buziladimi, true);
  });

  test('chinni 1200 °C gacha chidaydi, kvarts 1600 °C gacha', () => {
    assert.equal(idishXavfi({ temperature: '1200 °C' }, [], 'shamotli-tigel').buziladimi, false);
    assert.equal(idishXavfi({ temperature: '1600°C' }, [], 'kvars-naycha').buziladimi, false);
  });

  test('diapazon matnidan eng katta son olinadi: "400-600°C" → buziladi', () => {
    assert.equal(idishXavfi({ temperature: '400-600°C' }, [], 'probirka').buziladimi, true);
  });

  // ── 3-sabab: qizdirilgan ishqor ──

  test('300 °C da suyuqlantirilgan ishqor shishani yemiradi', () => {
    const r = idishXavfi(
      { temperature: '300°C', environment: 'Suyuqlantirilgan NaOH' },
      [],
      'stakan',
    );
    assert.equal(r.buziladimi, true);
    assert.ok(r.sabab.startsWith('Qizdirilgan ishqor'));
  });

  test("299 °C — hali buzmaydi (chegara qat'iy)", () => {
    assert.equal(
      idishXavfi(
        { temperature: '299°C', environment: 'Suyuqlantirilgan NaOH' },
        [],
        'stakan',
      ).buziladimi,
      false,
    );
  });

  test('xona haroratidagi ishqor shishaga zarar qilmaydi', () => {
    assert.equal(
      idishXavfi({ temperature: '25°C', environment: 'Ishqorli muhit' }, [], 'stakan')
        .buziladimi,
      false,
    );
  });

  test('chinni ishqorga chidaydi', () => {
    assert.equal(
      idishXavfi(
        { temperature: '300°C', environment: 'Suyuqlantirilgan NaOH' },
        [],
        'chinni-kosacha',
      ).buziladimi,
      false,
    );
  });

  // ── Boshqa ──

  test('HF tekshiruvi haroratdan ustun turadi', () => {
    const r = idishXavfi({ temperature: '2000°C' }, ['HF'], 'probirka');
    assert.ok(r.sabab.startsWith('Ftorid kislota'));
  });

  test("bo'sh reaksiya va moddalar — buzilmaydi", () => {
    assert.deepEqual(idishXavfi(null, [], 'probirka'), { buziladimi: false, sabab: null });
    assert.deepEqual(idishXavfi({}, [], 'probirka'), { buziladimi: false, sabab: null });
  });

  test("moddalar berilmasa standart bo'sh ro'yxat sifatida ishlaydi", () => {
    assert.equal(idishXavfi({ temperature: '600°C' }, undefined, 'probirka').buziladimi, true);
  });
});
