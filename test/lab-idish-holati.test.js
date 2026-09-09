// app/laboratoriya/3d/lib/idish-holati.js sinovi — quyish, dekantatsiya
// va tozalash. BRIF-R01 uchun qo'shildi: yuvish bosqichida cho'kma
// QOLISHI, eritma esa KETISHI shart edi va bu qoida sinovsiz qolgan edi.
//
// NEGA _esm-require: test/lab-idish.test.js dagi bilan bir xil sabab.
// `idish-holati.js` faqat `./sozlama.js` ni import qiladi — u ham sof
// modul, rekursiv yig'iladi.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const esmRequire = require('../scripts/_esm-require');

const {
  idishYarat,
  quy,
  tozala,
  dekantatsiya,
  jamiHajm,
} = esmRequire('app/laboratoriya/3d/lib/idish-holati.js', [
  'idishYarat',
  'quy',
  'tozala',
  'dekantatsiya',
  'jamiHajm',
]);

// Sinov uchun qattiq/suyuq qoidasi: haqiqiy jadval (lib/lab-modda.js)
// 3D importlarisiz yuklanmaydi, bu yerda esa FAQAT dekantatsiya mantig'i
// sinaladi — qoida qayerdan kelishi emas.
const QATTIQ = new Set(['Cu(OH)₂', 'CuO']);
const qattiqmi = (kalit) => QATTIQ.has(kalit);

describe('dekantatsiya', () => {
  test("suyuqlik to'kiladi, cho'kma qoladi (BRIF-R01, 5-bosqich)", () => {
    let holat = idishYarat('stakan', 0);
    holat = quy(holat, 'Na₂SO₄', 30);
    holat = quy(holat, 'Cu(OH)₂', 12);

    const { holat: yuvilgan, tokilgan, qolganKalitlar } = dekantatsiya(holat, qattiqmi);

    assert.deepEqual(qolganKalitlar, ['Cu(OH)₂']);
    assert.deepEqual(tokilgan, ['Na₂SO₄']);
    assert.equal(yuvilgan.moddalar['Cu(OH)₂'].ml, 12);
    assert.equal(yuvilgan.moddalar['Na₂SO₄'], undefined);
    assert.equal(jamiHajm(yuvilgan), 12);
  });

  test("cho'kma bo'lmasa hammasi to'kiladi", () => {
    let holat = idishYarat('probirka', 0);
    holat = quy(holat, 'HCl', 10);
    holat = quy(holat, 'H₂O', 20);

    const { holat: yuvilgan, tokilgan, qolganKalitlar } = dekantatsiya(holat, qattiqmi);

    assert.deepEqual(qolganKalitlar, []);
    assert.equal(tokilgan.length, 2);
    assert.equal(jamiHajm(yuvilgan), 0);
  });

  test("bo'sh idish — buzilmaydi", () => {
    const { holat: yuvilgan, tokilgan, qolganKalitlar } = dekantatsiya(
      idishYarat('stakan', 0),
      qattiqmi,
    );
    assert.deepEqual(tokilgan, []);
    assert.deepEqual(qolganKalitlar, []);
    assert.equal(jamiHajm(yuvilgan), 0);
  });

  test('asl holat MUTATSIYA qilinmaydi', () => {
    let holat = idishYarat('stakan', 0);
    holat = quy(holat, 'Cu(OH)₂', 5);
    holat = quy(holat, 'Na₂SO₄', 15);

    dekantatsiya(holat, qattiqmi);

    // Dekantatsiyadan keyin ham asl obyektda ikkala modda turibdi —
    // 3D render kadrlarida eski holat o'qilayotgan bo'lishi mumkin.
    assert.equal(Object.keys(holat.moddalar).length, 2);
  });

  test("qattiqmi berilmasa hammasi to'kiladi (himoya)", () => {
    let holat = idishYarat('stakan', 0);
    holat = quy(holat, 'Cu(OH)₂', 5);
    const { qolganKalitlar } = dekantatsiya(holat, null);
    assert.deepEqual(qolganKalitlar, []);
  });
});

describe('tozala va dekantatsiya farqi', () => {
  test("tozala HAMMASINI o'chiradi, dekantatsiya faqat suyuqlikni", () => {
    let holat = idishYarat('stakan', 0);
    holat = quy(holat, 'Cu(OH)₂', 8);

    assert.equal(jamiHajm(tozala(holat)), 0);
    assert.equal(jamiHajm(dekantatsiya(holat, qattiqmi).holat), 8);
  });
});
