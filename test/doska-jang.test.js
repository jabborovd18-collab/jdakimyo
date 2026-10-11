// test/doska-jang.test.js
//
// Smart Doska — Jamoalar Jangi server hakami testlari.
// Kvotali random, ballar hisobi, anti-cheat va moderatsiya tekshiruvi.
import test from "node:test";
import assert from "node:assert/strict";

import {
  yangiXonaYarat,
  doskaHolatiniOlish,
  qatnashchiQosh,
  oquvchiHolatiniOlish,
  jangniBoshla,
  javobniQabulQil,
  qatnashchiniChetlat,
  jangniTugat,
  tahlilniOlish,
  jamoaNominiYangila,
  JAMOA_SHABLONLARI,
} from "../lib/doska-jang-boshqaruvchi.js";

import { DOSKA_MAVZULARI, mavzuniTop } from "../lib/doska-mavzular.js";
import { ADSORBSIYA_SAVOLLARI } from "../data/doska/adsorbsiya-savollar.js";

test("Smart Doska mavzulari to'g'ri yuklanadi", () => {
  assert.ok(DOSKA_MAVZULARI.length >= 1);
  const mavzu = mavzuniTop("sirt-hodisalari-adsorbsiya");
  assert.ok(mavzu);
  assert.ok(mavzu.formulalar.length >= 4);
  assert.equal(mavzu.chuqurModullar.length, 7);
  assert.equal(mavzu.savollarSoni, 80);
  assert.equal(mavzu.oqituvchiUsername, "halim_06");
  assert.equal(mavzu.oqituvchiUserId, "859235349");
});

test("Jamoa shablonlari va maxsus nomlar bilan xona yaratish", () => {
  assert.ok(JAMOA_SHABLONLARI.length >= 5);
  // Maxsus nomlar bilan xona yaratish
  const xona = yangiXonaYarat("sirt-hodisalari-adsorbsiya", 3, ["Adsorbentlar", "Adsorbatlar", "G'ovaklar"]);
  assert.equal(xona.jamoalar[0].nom, "Adsorbentlar");
  assert.equal(xona.jamoalar[1].nom, "Adsorbatlar");
  assert.equal(xona.jamoalar[2].nom, "G'ovaklar");

  // Jamoa nomini tahrirlash
  const yangilangan = jamoaNominiYangila(xona.xonaId, 1, "Lengmyurchilar");
  assert.equal(yangilangan.jamoalar[0].nom, "Lengmyurchilar");
});

test("Yangi xona yaratish va jamoalar tuzilishi", () => {
  const xona = yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  assert.ok(xona.xonaId);
  assert.equal(xona.jamoalar.length, 2);
  assert.equal(xona.holat, "lobby");

  const doskaHolat = doskaHolatiniOlish(xona.xonaId);
  assert.equal(doskaHolat.xonaId, xona.xonaId);
  assert.equal(doskaHolat.jamoalarSoni, 2);
});

test("Kvotali random: har bir o'quvchiga aynan 20 ta savol tushadi (8-8-4)", () => {
  const xona = yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q = qatnashchiQosh(xona.xonaId, "Azizbek", 1);
  assert.ok(q.qatnashchiId);

  const oquvchiHolat = oquvchiHolatiniOlish(xona.xonaId, q.qatnashchiId);
  assert.equal(oquvchiHolat.savollar.length, 20);

  // Darajalar balansi: 8 ta d1, 8 ta d2, 4 ta d3
  const d1 = oquvchiHolat.savollar.filter((s) => s.daraja === 1);
  const d2 = oquvchiHolat.savollar.filter((s) => s.daraja === 2);
  const d3 = oquvchiHolat.savollar.filter((s) => s.daraja === 3);
  assert.equal(d1.length, 8);
  assert.equal(d2.length, 8);
  assert.equal(d3.length, 4);

  // Anti-Cheat tekshiruvi: clientga to'g'ri javoblar va izohlar berilmagan bo'lishi shart!
  oquvchiHolat.savollar.forEach((s) => {
    assert.equal(s._maxfiyTogriIndex, undefined);
    assert.equal(s.togriJavob, undefined);
    assert.equal(s.izoh, undefined);
  });
});

test("Jang jarayoni: ballar hisobi, kolba suyuqligi va moderatsiya", () => {
  const xona = yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q1 = qatnashchiQosh(xona.xonaId, "Olim", 1);
  const q2 = qatnashchiQosh(xona.xonaId, "Salim", 2);

  // Jangni boshlash
  jangniBoshla(xona.xonaId);
  assert.equal(doskaHolatiniOlish(xona.xonaId).holat, "jang");

  // Olim 1-savolga javob beradi (to'g'ri indeksni serverdan olamiz)
  const ichkiQ = xona.qatnashchilar[q1.qatnashchiId];
  const birinchiSavol = ichkiQ.savollar[0];
  const togriIndeks = birinchiSavol._maxfiyTogriIndex;

  const res = javobniQabulQil(xona.xonaId, q1.qatnashchiId, birinchiSavol.id, togriIndeks);
  assert.ok(res.ok);
  assert.ok(res.qabulQilindi);

  // Ball qo'shilganini tekshirish
  const kutilganBall = birinchiSavol.daraja === 1 ? 5 : birinchiSavol.daraja === 2 ? 10 : 15;
  assert.equal(ichkiQ.ball, kutilganBall);

  // 1-Jamoa balli va suyuqlik hajmi oshgan
  const j1 = xona.jamoalar.find((j) => j.id === 1);
  assert.equal(j1.ball, kutilganBall);
  assert.equal(j1.suyuqlikMl, kutilganBall);

  // Moderatsiya: Olimni chetlatish
  qatnashchiniChetlat(xona.xonaId, q1.qatnashchiId);
  assert.ok(ichkiQ.chetlatildi);
  // Jamoa balli qayta 0 ga tushgan bo'lishi kerak
  assert.equal(j1.ball, 0);
  assert.equal(j1.suyuqlikMl, 0);

  // Musobaqani yakunlash
  jangniTugat(xona.xonaId);
  assert.equal(doskaHolatiniOlish(xona.xonaId).holat, "yakunlandi");

  // Salim uchun tahlilni olish
  const tahlil = tahlilniOlish(xona.xonaId, q2.qatnashchiId);
  assert.equal(tahlil.length, 20);
  assert.ok(typeof tahlil[0].togriIndex === "number");
  assert.ok(tahlil[0].izoh);
});

test("Chegaraviy holatlar: bir xil ismli o'quvchilar va noto'g'ri variant indeksi", () => {
  const xona = yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q1 = qatnashchiQosh(xona.xonaId, "Dilshod", 1);
  const q2 = qatnashchiQosh(xona.xonaId, "Dilshod", 1);
  assert.equal(q1.ism, "Dilshod");
  assert.equal(q2.ism, "Dilshod (2)");

  jangniBoshla(xona.xonaId);
  const ichkiQ = xona.qatnashchilar[q1.qatnashchiId];
  const savol = ichkiQ.savollar[0];

  // Noto'g'ri variant indeksi (masalan 99 yoki -1)
  assert.throws(
    () => javobniQabulQil(xona.xonaId, q1.qatnashchiId, savol.id, 99),
    /Yaroqsiz variant tanlandi/
  );
  assert.throws(
    () => javobniQabulQil(xona.xonaId, q1.qatnashchiId, savol.id, -1),
    /Yaroqsiz variant tanlandi/
  );
});

test("Anti-cheat: Jang boshlangandan yoki yakunlangandan keyin QR orqali yangi o'quvchi qo'shilishi rad etiladi (QR eskiradi)", () => {
  const xona = yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  qatnashchiQosh(xona.xonaId, "Botir", 1);

  // Jang boshlanadi
  jangniBoshla(xona.xonaId);

  // Jang davomida yangi hisob qo'shishga urinish rad etiladi
  assert.throws(
    () => qatnashchiQosh(xona.xonaId, "KechikkanOquvchi", 1),
    /Musobaqa allaqachon boshlangan/
  );

  // Jang yakunlanadi
  jangniTugat(xona.xonaId);

  // Yakunlangach ham rad etiladi
  assert.throws(
    () => qatnashchiQosh(xona.xonaId, "YanaBiri", 1),
    /Bu musobaqa allaqachon yakunlangan/
  );
});

test("Jamoalar bo'yicha o'rtacha ball hisobi (adolatli reyting)", () => {
  const xona = yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q1 = qatnashchiQosh(xona.xonaId, "Ahmad", 1);
  const q2 = qatnashchiQosh(xona.xonaId, "Mahmud", 1);

  jangniBoshla(xona.xonaId);

  // Ahmad to'g'ri javob beradi (masalan 1-daraja = 5 ball)
  const savol1 = xona.qatnashchilar[q1.qatnashchiId].savollar[0];
  javobniQabulQil(xona.xonaId, q1.qatnashchiId, savol1.id, savol1._maxfiyTogriIndex);

  const holat = doskaHolatiniOlish(xona.xonaId);
  const j1 = holat.jamoalar.find((j) => j.id === 1);
  assert.equal(j1.ball, savol1.daraja === 1 ? 5 : savol1.daraja === 2 ? 10 : 15);
  assert.equal(j1.azolariSoni, 2);
  assert.equal(j1.ortachaBall, Math.round(j1.ball / 2));
});

test("7 ta chuqur ilmiy modul to'liq va regressiya R² >= 0.90", () => {
  const mavzu = mavzuniTop("sirt-hodisalari-adsorbsiya");
  assert.ok(mavzu);
  assert.equal(mavzu.chuqurModullar.length, 7);

  function getMaydonlar(qator) {
    if (qator.ce !== undefined) return { xKey: "ce", yKey: "a" };
    if (qator.pNisbiy !== undefined && qator.a !== undefined) return { xKey: "pNisbiy", yKey: "a" };
    if (qator.c !== undefined) return { xKey: "c", yKey: "sigma" };
    if (qator.r !== undefined) return { xKey: "r", yKey: "pNisbiy" };
    if (qator.tK !== undefined) return { xKey: "tK", yKey: "p" };
    if (qator.n !== undefined) return { xKey: "n", yKey: "g" };
    const keys = Object.keys(qator);
    return { xKey: keys[0] || "x", yKey: keys[1] || "y" };
  }

  for (const modul of mavzu.chuqurModullar) {
    assert.ok(modul.id, "Modul ID bo'lishi shart");
    assert.ok(modul.nomi, "Modul nomi bo'lishi shart");
    assert.ok(modul.formulaLatex, "KaTeX formulasi bo'lishi shart");
    assert.ok(Array.isArray(modul.farazlar) && modul.farazlar.length >= 3, `${modul.id} kamida 3 ta farazga ega bo'lishi kerak`);
    assert.ok(Array.isArray(modul.tajribaNamunasi) && modul.tajribaNamunasi.length >= 5, `${modul.id} kamida 5 ta tajriba nuqtasiga ega bo'lishi kerak`);
    assert.ok(typeof modul.regressiyaX === "function", `${modul.id} regressiyaX funksiyasiga ega bo'lishi kerak`);
    assert.ok(typeof modul.regressiyaY === "function", `${modul.id} regressiyaY funksiyasiga ega bo'lishi kerak`);
    assert.ok(typeof modul.doimiylarniTop === "function", `${modul.id} doimiylarniTop funksiyasiga ega bo'lishi kerak`);

    // Eng kichik kvadratlar hisobi
    const pts = modul.tajribaNamunasi.map((q) => {
      const { xKey, yKey } = getMaydonlar(q);
      return {
        x: modul.regressiyaX(q[xKey], q[yKey]),
        y: modul.regressiyaY(q[xKey], q[yKey]),
      };
    });

    const N = pts.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    pts.forEach((p) => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
    });

    const maxraj = N * sumX2 - sumX * sumX;
    assert.ok(Math.abs(maxraj) > 1e-12, `${modul.id} maxraji 0 bo'lmasligi kerak`);
    const qiyalik = (N * sumXY - sumX * sumY) / maxraj;
    const kesim = (sumY - qiyalik * sumX) / N;

    const avgY = sumY / N;
    let ssTot = 0, ssRes = 0;
    pts.forEach((p) => {
      const yBashorat = qiyalik * p.x + kesim;
      ssTot += Math.pow(p.y - avgY, 2);
      ssRes += Math.pow(p.y - yBashorat, 2);
    });
    const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;

    assert.ok(r2 >= 0.90, `${modul.id} R² ishonchliligi kamida 0.90 bo'lishi kerak (haqiqatda: ${r2})`);
    assert.ok(Number.isFinite(qiyalik), `${modul.id} qiyaligi chekli son bo'lishi kerak`);
    assert.ok(Number.isFinite(kesim), `${modul.id} kesimi chekli son bo'lishi kerak`);

    const doimiylar = modul.doimiylarniTop(qiyalik, kesim);
    assert.ok(Array.isArray(doimiylar) && doimiylar.length >= 2, `${modul.id} kamida 2 ta doimiy keltirishi kerak`);
    for (const d of doimiylar) {
      assert.ok(d.nom, "Doimiy nomi bo'lishi shart");
      assert.ok(Number.isFinite(d.qiymat), `${d.nom} chekli son bo'lishi shart`);
      assert.ok(d.birlik, `${d.nom} birlikka ega bo'lishi shart`);
    }
  }
});

test("Simulyator hisoblari fizik-kimyoviy chegaralarga mos (Gibbs, Kelvin, Termo, Traube)", () => {
  const mavzu = mavzuniTop("sirt-hodisalari-adsorbsiya");

  // 1. Gibbs: C=0.02
  const gibbs = mavzu.chuqurModullar.find((m) => m.id === "gibbs-sirt-taranglik");
  const gRes = gibbs.hisobla(0.02);
  assert.ok(gRes.sigma > 20 && gRes.sigma < 72.8, "Sirt taranglik 20..72.8 oralig'ida bo'lishi kerak");
  assert.ok(gRes.gammaMkmol > 0, "Sirt ortiqchaligi musbat bo'lishi kerak");
  assert.ok(gRes.s0 > 0.1 && gRes.s0 < 5.0, "Molekula maydoni 0.1..5.0 nm² oralig'ida bo'lishi kerak");

  // 2. Kelvin: r=4 nm
  const kelvin = mavzu.chuqurModullar.find((m) => m.id === "kelvin-kapillyar");
  const kRes = kelvin.hisobla(4);
  assert.ok(kRes.pNisbiy > 0.5 && kRes.pNisbiy < 1.0, "Mezog'ovakda kondensatsiya p/p0 < 1.0 da boshlanadi");

  // 3. Termodinamika: p1=12.4, p2=38.6, T1=273, T2=298
  const termo = mavzu.chuqurModullar.find((m) => m.id === "termodinamika-izosterik");
  const tRes = termo.hisobla(12.4, 38.6, 273, 298);
  assert.ok(tRes.qst > 20 && tRes.qst < 50, "Izosterik issiqlik 20..50 kJ/mol oralig'ida bo'lishi kerak");
  assert.ok(tRes.deltaH < 0, "Fizisorbtsiya entalpiyasi manfiy bo'lishi kerak (ekzotermik)");
  assert.ok(tRes.deltaG < 0, "O'z-o'zidan boruvchi jarayonda deltaG manfiy bo'lishi kerak");

  // 4. Traube: 5 ta kislota
  const traube = mavzu.chuqurModullar.find((m) => m.id === "dyuklo-traube-qoidasi");
  assert.equal(traube.kislotalar.length, 5);
  for (let i = 0; i < 4; i++) {
    const k1 = traube.kislotalar[i];
    const k2 = traube.kislotalar[i + 1];
    const nisbat = k2.betaDaraja / k1.betaDaraja;
    assert.ok(nisbat >= 3.0 && nisbat <= 3.5, "Har bir -CH2- guruhi uchun Traube koeffitsiyenti 3.0..3.5 bo'lishi kerak");
  }
});

test("Turnir qoidasi: teng ballarda kamroq vaqt sarflagan jamoa g'olib bo'ladi (tie-breaker)", () => {
  const xona = yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q1 = qatnashchiQosh(xona.xonaId, "Ali", 1);
  const q2 = qatnashchiQosh(xona.xonaId, "Vali", 2);

  jangniBoshla(xona.xonaId);

  const ichkiQ1 = xona.qatnashchilar[q1.qatnashchiId];
  const ichkiQ2 = xona.qatnashchilar[q2.qatnashchiId];

  // Ikkala o'quvchiga ham bir xil savol darajasidagi (daraja: 1, 5 ball) to'g'ri javobni kiritamiz
  const s1 = ichkiQ1.savollar.find((s) => s.daraja === 1);
  const s2 = ichkiQ2.savollar.find((s) => s.daraja === 1);

  // Ali 25 soniyada to'g'ri topadi
  javobniQabulQil(xona.xonaId, q1.qatnashchiId, s1.id, s1._maxfiyTogriIndex, 25);
  // Vali tezroq — 12 soniyada to'g'ri topadi
  javobniQabulQil(xona.xonaId, q2.qatnashchiId, s2.id, s2._maxfiyTogriIndex, 12);

  jangniTugat(xona.xonaId);

  const holat = doskaHolatiniOlish(xona.xonaId);
  const jamoalar = holat.jamoalar;

  // Ballar teng bo'lishi kerak (ikkalasi ham bittadan to'g'ri topgan)
  assert.equal(jamoalar[0].ball, jamoalar[1].ball);

  // Kamroq vaqt sarflagan jamoa (Vali - 2-jamoa, 12s) 1-o'rinda bo'lishi kerak
  const golib = jamoalar[0];
  assert.equal(golib.id, 2);
  assert.equal(golib.sarflanganVaqt, 12);
  assert.equal(golib.vaqtUstunligi, true);

  const ikkinchi = jamoalar[1];
  assert.equal(ikkinchi.id, 1);
  assert.equal(ikkinchi.sarflanganVaqt, 25);
  assert.equal(ikkinchi.vaqtUstunligi, false);
});

test("Anti-Cheat: ilovadan chiqqanda yoki skrinshot olganda 0 ball va qoidabuzarlik qayd etiladi", () => {
  const xona = yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q = qatnashchiQosh(xona.xonaId, "Shohruh", 1);

  jangniBoshla(xona.xonaId);

  const ichkiQ = xona.qatnashchilar[q.qatnashchiId];
  const savol = ichkiQ.savollar[0];

  // O'quvchi tabdan chiqib ketdi (qoidaBuzildi: true, variantIndex: -1)
  const res = javobniQabulQil(xona.xonaId, q.qatnashchiId, savol.id, -1, 8, true);

  assert.ok(res.ok);
  assert.ok(res.qabulQilindi);
  assert.equal(res.ball, 0);
  assert.equal(res.qoidaBuzildi, true);

  // O'quvchi ma'lumotlarida qoidabuzarlik qayd etilgan
  assert.equal(ichkiQ.ball, 0);
  assert.equal(ichkiQ.qoidabuzarliklar, 1);
  assert.equal(ichkiQ.sarflanganVaqtSoniya, 8);

  // Jonli lentada ogohlantirish qayd qilingan
  const holat = doskaHolatiniOlish(xona.xonaId);
  const oxirgiLenta = holat.jonliLenta[0];
  assert.ok(oxirgiLenta);
  assert.ok(oxirgiLenta.matn.includes("ilovadan chiqdi"));
});


