// test/doska-jang.test.js
//
// Smart Doska — Jamoalar Jangi server hakami testlari.
// Kvotali random, ballar hisobi, anti-cheat, ustoz kaliti va moderatsiya.
//
// OMBOR: testlar har doim xotira rejimida ishlaydi (JANG_OMBOR=xotira) —
// hech qanday baza talab qilinmaydi. Production'da Postgres ishlatiladi,
// lekin o'yin qoidalari bir xil (adapter bir xil semantikani kafolatlaydi).
process.env.JANG_OMBOR = "xotira";

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
  ichkiXonaniOl,
  JAMOA_SHABLONLARI,
} from "../lib/doska-jang-boshqaruvchi.js";

import { DOSKA_MAVZULARI, mavzuniTop } from "../lib/doska-mavzular.js";

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

test("Jamoa shablonlari va maxsus nomlar bilan xona yaratish", async () => {
  assert.ok(JAMOA_SHABLONLARI.length >= 5);
  // Maxsus nomlar bilan xona yaratish
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 3, ["Adsorbentlar", "Adsorbatlar", "G'ovaklar"]);
  assert.equal(xona.jamoalar[0].nom, "Adsorbentlar");
  assert.equal(xona.jamoalar[1].nom, "Adsorbatlar");
  assert.equal(xona.jamoalar[2].nom, "G'ovaklar");
  assert.ok(xona.ustozKalit, "Xona yaratilganda ustoz kaliti qaytishi shart");

  // Jamoa nomini tahrirlash (ustoz kaliti bilan)
  const yangilangan = await jamoaNominiYangila(xona.xonaId, 1, "Lengmyurchilar", xona.ustozKalit);
  assert.equal(yangilangan.jamoalar[0].nom, "Lengmyurchilar");
});

test("Yangi xona yaratish va jamoalar tuzilishi", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  assert.ok(xona.xonaId);
  assert.equal(xona.jamoalar.length, 2);
  assert.equal(xona.holat, "lobby");

  const doskaHolat = await doskaHolatiniOlish(xona.xonaId);
  assert.equal(doskaHolat.xonaId, xona.xonaId);
  assert.equal(doskaHolat.jamoalarSoni, 2);
});

test("Kvotali random: har bir o'quvchiga aynan 20 ta savol tushadi (8-8-4)", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q = await qatnashchiQosh(xona.xonaId, "Azizbek", 1);
  assert.ok(q.qatnashchiId);

  const oquvchiHolat = await oquvchiHolatiniOlish(xona.xonaId, q.qatnashchiId);
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

test("Jang jarayoni: ballar hisobi, kolba suyuqligi va moderatsiya", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const kalit = xona.ustozKalit;
  const q1 = await qatnashchiQosh(xona.xonaId, "Olim", 1);
  const q2 = await qatnashchiQosh(xona.xonaId, "Salim", 2);

  // Jangni boshlash
  await jangniBoshla(xona.xonaId, kalit);
  assert.equal((await doskaHolatiniOlish(xona.xonaId)).holat, "jang");

  // Olim 1-savolga javob beradi (to'g'ri indeksni serverdan olamiz)
  const ichki = ichkiXonaniOl(xona.xonaId);
  const ichkiQ = ichki.qatnashchilar[q1.qatnashchiId];
  const birinchiSavol = ichkiQ.savollar[0];
  const togriIndeks = birinchiSavol._maxfiyTogriIndex;

  const res = await javobniQabulQil(xona.xonaId, q1.qatnashchiId, birinchiSavol.id, togriIndeks);
  assert.ok(res.ok);
  assert.ok(res.qabulQilindi);

  // Ball qo'shilganini tekshirish
  const kutilganBall = birinchiSavol.daraja === 1 ? 5 : birinchiSavol.daraja === 2 ? 10 : 15;
  assert.equal(ichkiQ.ball, kutilganBall);

  // 1-Jamoa balli va suyuqlik hajmi oshgan (yig'indidan hisoblanadi)
  let doska = await doskaHolatiniOlish(xona.xonaId);
  const j1 = doska.jamoalar.find((j) => j.id === 1);
  assert.equal(j1.ball, kutilganBall);
  assert.equal(j1.suyuqlikMl, kutilganBall);

  // Moderatsiya: Olimni chetlatish
  await qatnashchiniChetlat(xona.xonaId, q1.qatnashchiId, kalit);
  assert.ok(ichkiQ.chetlatildi);
  // Jamoa balli qayta 0 ga tushgan bo'lishi kerak
  doska = await doskaHolatiniOlish(xona.xonaId);
  const j1keyin = doska.jamoalar.find((j) => j.id === 1);
  assert.equal(j1keyin.ball, 0);
  assert.equal(j1keyin.suyuqlikMl, 0);

  // Musobaqani yakunlash
  await jangniTugat(xona.xonaId, kalit);
  assert.equal((await doskaHolatiniOlish(xona.xonaId)).holat, "yakunlandi");

  // Salim uchun tahlilni olish
  const tahlil = await tahlilniOlish(xona.xonaId, q2.qatnashchiId);
  assert.equal(tahlil.length, 20);
  assert.ok(typeof tahlil[0].togriIndex === "number");
  assert.ok(tahlil[0].izoh);
});

test("Chegaraviy holatlar: bir xil ismli o'quvchilar va noto'g'ri variant indeksi", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q1 = await qatnashchiQosh(xona.xonaId, "Dilshod", 1);
  const q2 = await qatnashchiQosh(xona.xonaId, "Dilshod", 1);
  assert.equal(q1.ism, "Dilshod");
  assert.equal(q2.ism, "Dilshod (2)");

  await jangniBoshla(xona.xonaId, xona.ustozKalit);
  const ichkiQ = ichkiXonaniOl(xona.xonaId).qatnashchilar[q1.qatnashchiId];
  const savol = ichkiQ.savollar[0];

  // Noto'g'ri variant indeksi (masalan 99 yoki -2)
  await assert.rejects(
    javobniQabulQil(xona.xonaId, q1.qatnashchiId, savol.id, 99),
    /Yaroqsiz variant tanlandi/
  );
  await assert.rejects(
    javobniQabulQil(xona.xonaId, q1.qatnashchiId, savol.id, -2),
    /Yaroqsiz variant tanlandi/
  );
});

test("Anti-cheat: Jang boshlangandan yoki yakunlangandan keyin QR orqali yangi o'quvchi qo'shilishi rad etiladi (QR eskiradi)", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  await qatnashchiQosh(xona.xonaId, "Botir", 1);

  // Jang boshlanadi
  await jangniBoshla(xona.xonaId, xona.ustozKalit);

  // Jang davomida yangi hisob qo'shishga urinish rad etiladi
  await assert.rejects(
    qatnashchiQosh(xona.xonaId, "KechikkanOquvchi", 1),
    /Musobaqa allaqachon boshlangan/
  );

  // Jang yakunlanadi
  await jangniTugat(xona.xonaId, xona.ustozKalit);

  // Yakunlangach ham rad etiladi
  await assert.rejects(
    qatnashchiQosh(xona.xonaId, "YanaBiri", 1),
    /Bu musobaqa allaqachon yakunlangan/
  );
});

test("Jamoalar bo'yicha o'rtacha ball hisobi (adolatli reyting)", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q1 = await qatnashchiQosh(xona.xonaId, "Ahmad", 1);
  await qatnashchiQosh(xona.xonaId, "Mahmud", 1);

  await jangniBoshla(xona.xonaId, xona.ustozKalit);

  // Ahmad to'g'ri javob beradi (masalan 1-daraja = 5 ball)
  const ichki = ichkiXonaniOl(xona.xonaId);
  const savol1 = ichki.qatnashchilar[q1.qatnashchiId].savollar[0];
  await javobniQabulQil(xona.xonaId, q1.qatnashchiId, savol1.id, savol1._maxfiyTogriIndex);

  const holat = await doskaHolatiniOlish(xona.xonaId);
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

test("Turnir qoidasi: teng ballarda kamroq vaqt sarflagan jamoa g'olib bo'ladi (tie-breaker)", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q1 = await qatnashchiQosh(xona.xonaId, "Ali", 1);
  const q2 = await qatnashchiQosh(xona.xonaId, "Vali", 2);

  await jangniBoshla(xona.xonaId, xona.ustozKalit);

  const ichki = ichkiXonaniOl(xona.xonaId);
  const ichkiQ1 = ichki.qatnashchilar[q1.qatnashchiId];
  const ichkiQ2 = ichki.qatnashchilar[q2.qatnashchiId];

  // Ikkala o'quvchiga ham bir xil savol darajasidagi (daraja: 1, 5 ball) to'g'ri javobni kiritamiz
  const s1 = ichkiQ1.savollar.find((s) => s.daraja === 1);
  const s2 = ichkiQ2.savollar.find((s) => s.daraja === 1);

  // Vaqt SERVER soati bilan o'lchanadi: so'nggi nuqtani orqaga suramiz.
  // Ali 25 soniyada to'g'ri topadi (mijoz 0 yuborsa ham server 25 yozadi)
  ichkiQ1.oxirgiSavolVaqti = Date.now() - 25000;
  await javobniQabulQil(xona.xonaId, q1.qatnashchiId, s1.id, s1._maxfiyTogriIndex, 0);
  // Vali tezroq — 12 soniyada to'g'ri topadi
  ichkiQ2.oxirgiSavolVaqti = Date.now() - 12000;
  await javobniQabulQil(xona.xonaId, q2.qatnashchiId, s2.id, s2._maxfiyTogriIndex, 0);

  await jangniTugat(xona.xonaId, xona.ustozKalit);

  const holat = await doskaHolatiniOlish(xona.xonaId);
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

test("Anti-Cheat: ilovadan chiqqanda yoki skrinshot olganda 0 ball va qoidabuzarlik qayd etiladi", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q = await qatnashchiQosh(xona.xonaId, "Shohruh", 1);

  await jangniBoshla(xona.xonaId, xona.ustozKalit);

  const ichkiQ = ichkiXonaniOl(xona.xonaId).qatnashchilar[q.qatnashchiId];
  const savol = ichkiQ.savollar[0];

  // O'quvchi 8 soniyadan keyin tabdan chiqib ketdi (mijoz vaqti e'tiborsiz)
  ichkiQ.oxirgiSavolVaqti = Date.now() - 8000;
  const res = await javobniQabulQil(xona.xonaId, q.qatnashchiId, savol.id, -1, 999, true);

  assert.ok(res.ok);
  assert.ok(res.qabulQilindi);
  assert.equal(res.ball, 0);
  assert.equal(res.qoidaBuzildi, true);

  // O'quvchi ma'lumotlarida qoidabuzarlik qayd etilgan, vaqt server o'lchovi (8)
  assert.equal(ichkiQ.ball, 0);
  assert.equal(ichkiQ.qoidabuzarliklar, 1);
  assert.equal(ichkiQ.sarflanganVaqt, 8);

  // Jonli lentada ogohlantirish qayd qilingan
  const holat = await doskaHolatiniOlish(xona.xonaId);
  const oxirgiLenta = holat.jonliLenta[0];
  assert.ok(oxirgiLenta);
  assert.ok(oxirgiLenta.matn.includes("ilovadan chiqdi"));
});

test("30 soniya taymer tugaganda (-1 yuborilganda) 0 ball bilan xatosiz qabul qilinadi", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q = await qatnashchiQosh(xona.xonaId, "Ulug'bek", 1);
  await jangniBoshla(xona.xonaId, xona.ustozKalit);

  const ichkiQ = ichkiXonaniOl(xona.xonaId).qatnashchilar[q.qatnashchiId];
  const savol = ichkiQ.savollar[0];

  // 30 soniya vaqt tugadi (server o'lchovi)
  ichkiQ.oxirgiSavolVaqti = Date.now() - 30000;
  const res = await javobniQabulQil(xona.xonaId, q.qatnashchiId, savol.id, -1, 5, false);
  assert.ok(res.ok);
  assert.ok(res.qabulQilindi);
  assert.equal(res.ball, 0);
  assert.equal(res.qoidaBuzildi, false);
  assert.equal(ichkiQ.javoblar[savol.id].tanlanganIndex, -1);
  assert.equal(ichkiQ.javoblar[savol.id].togri, false);
  assert.equal(ichkiQ.sarflanganVaqt, 30);
});

test("30 TALABALIK AUDITORIYA SIMULYATSIYASI: QR skaner, jamoalarga taqsimlanish, parallel javoblar, moderatsiya va yakuniy tahlil", async () => {
  // 1. Ustoz 3 ta jamoa bilan xona yaratadi
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 3, ["Adsorbentlar", "Adsorbatlar", "G'ovaklar"]);
  const xonaId = xona.xonaId;
  const kalit = xona.ustozKalit;
  const ichki = () => ichkiXonaniOl(xonaId);
  assert.equal(xona.jamoalar.length, 3);
  assert.equal(xona.holat, "lobby");

  // 2. 30 ta talaba (ism takrorlanishlari bilan: 5 ta "Jasur", 3 ta "Madina", 22 ta boshqa ismlar)
  const ismlar = [
    "Jasur", "Jasur", "Jasur", "Jasur", "Jasur",
    "Madina", "Madina", "Madina",
    "Sardor", "Nodira", "Dilshod", "Azizbek", "Shahnoza", "Bekzod", "Gulnoza",
    "Otabek", "Zilola", "Anvar", "Kamola", "Farrux", "Malika", "Javohir",
    "Rayhon", "Shavkat", "Mohira", "Sanjar", "Sevara", "Temur", "Munisa", "Ulug'bek"
  ];
  assert.equal(ismlar.length, 30);

  const talabalar = [];
  // 30 ta talaba 3 ta jamoaga (har bir jamoaga 10 tadan) taqsimlanadi
  for (let idx = 0; idx < ismlar.length; idx++) {
    const jamoaId = (idx % 3) + 1;
    const qoshilgan = await qatnashchiQosh(xonaId, ismlar[idx], jamoaId);
    assert.ok(qoshilgan.qatnashchiId);
    talabalar.push(qoshilgan);
  }

  // Takroriy ismlar to'g'ri raqamlangani tekshiriladi
  const jasurlar = talabalar.filter((t) => t.ism.startsWith("Jasur"));
  assert.equal(jasurlar.length, 5);
  assert.equal(jasurlar[0].ism, "Jasur");
  assert.equal(jasurlar[1].ism, "Jasur (2)");
  assert.equal(jasurlar[2].ism, "Jasur (3)");
  assert.equal(jasurlar[3].ism, "Jasur (4)");
  assert.equal(jasurlar[4].ism, "Jasur (5)");

  const madinalar = talabalar.filter((t) => t.ism.startsWith("Madina"));
  assert.equal(madinalar.length, 3);
  assert.equal(madinalar[0].ism, "Madina");
  assert.equal(madinalar[1].ism, "Madina (2)");
  assert.equal(madinalar[2].ism, "Madina (3)");

  // Har bir jamoada 10 nafardan a'zo bor
  const lobbyHolat = await doskaHolatiniOlish(xonaId);
  assert.equal(lobbyHolat.qatnashchilar.length, 30);
  lobbyHolat.jamoalar.forEach((j) => {
    assert.equal(j.azolariSoni, 10);
  });

  // 3. Ustoz musobaqani boshlaydi
  await jangniBoshla(xonaId, kalit);
  const jangHolat = await doskaHolatiniOlish(xonaId);
  assert.equal(jangHolat.holat, "jang");

  // Kechikkan talaba qo'shilishi bloklanadi
  await assert.rejects(qatnashchiQosh(xonaId, "KechikkanTalaba", 1), /Musobaqa allaqachon boshlangan/);

  // 4. 30 ta talaba 20 tadan savolga javob beradi (jami 600 ta javob)
  for (let tIdx = 0; tIdx < talabalar.length; tIdx++) {
    const talaba = talabalar[tIdx];
    const ichkiTalaba = ichki().qatnashchilar[talaba.qatnashchiId];
    assert.equal(ichkiTalaba.savollar.length, 20);

    for (let sIdx = 0; sIdx < ichkiTalaba.savollar.length; sIdx++) {
      const savol = ichkiTalaba.savollar[sIdx];

      // 1-talaba (Jasur) 5-savolda qoidani buzib ilovadan chiqadi
      if (tIdx === 0 && sIdx === 4) {
        ichkiTalaba.oxirgiSavolVaqti = Date.now() - 7000;
        await javobniQabulQil(xonaId, talaba.qatnashchiId, savol.id, -1, 0, true);
        continue;
      }

      // 2-talaba (Jasur 2) 10-savolda taymer tugaydi (-1)
      if (tIdx === 1 && sIdx === 9) {
        ichkiTalaba.oxirgiSavolVaqti = Date.now() - 30000;
        await javobniQabulQil(xonaId, talaba.qatnashchiId, savol.id, -1, 0, false);
        continue;
      }

      // Turli javob strategiyalari:
      // Ba'zi talabalar ko'proq to'g'ri topadi, ba'zilari xato qiladi
      const togriTopdimi = (tIdx + sIdx) % 3 !== 0; // ~66% to'g'ri javob ehtimolligi
      const tanlangan = togriTopdimi ? savol._maxfiyTogriIndex : (savol._maxfiyTogriIndex + 1) % 4;
      const sarflanganVaqt = 5 + ((tIdx * 3 + sIdx * 2) % 20); // 5..25 soniya

      // Server o'lchovi uchun so'nggi nuqtani orqaga suramiz
      ichkiTalaba.oxirgiSavolVaqti = Date.now() - sarflanganVaqt * 1000;
      await javobniQabulQil(xonaId, talaba.qatnashchiId, savol.id, tanlangan, 0, false);
    }

    assert.equal(ichkiTalaba.tugatdi, true);
    assert.equal(Object.keys(ichkiTalaba.javoblar).length, 20);
  }

  // 5. Moderatsiya: Ustoz oxirgi talabani (Ulug'bek) soxta profil deb chetlatadi
  const oxirgiTalaba = talabalar[29];
  const oxirgiBall = ichki().qatnashchilar[oxirgiTalaba.qatnashchiId].ball;
  const oxirgiJamoaId = oxirgiTalaba.jamoaId;
  const doskaOldin = await doskaHolatiniOlish(xonaId);
  const oldingiJamoaBall = doskaOldin.jamoalar.find((j) => j.id === oxirgiJamoaId).ball;

  await qatnashchiniChetlat(xonaId, oxirgiTalaba.qatnashchiId, kalit);
  assert.equal(ichki().qatnashchilar[oxirgiTalaba.qatnashchiId].chetlatildi, true);

  const doskaKeyin = await doskaHolatiniOlish(xonaId);
  const yangiJamoaBall = doskaKeyin.jamoalar.find((j) => j.id === oxirgiJamoaId).ball;
  assert.equal(yangiJamoaBall, oldingiJamoaBall - oxirgiBall);

  // 6. Ustoz o'yinni yakunlaydi
  await jangniTugat(xonaId, kalit);
  const yakuniyHolat = await doskaHolatiniOlish(xonaId);
  assert.equal(yakuniyHolat.holat, "yakunlandi");
  assert.equal(yakuniyHolat.qatnashchilar.length, 29); // 1 nafari chetlatilgan

  // Shohsupa va g'olib jamoa aniqlangan
  assert.ok(yakuniyHolat.jamoalar[0].ball >= yakuniyHolat.jamoalar[1].ball);
  assert.ok(yakuniyHolat.jamoalar[1].ball >= yakuniyHolat.jamoalar[2].ball);

  // 7. Barcha 30 ta talaba test yakunida to'liq tahlilni (tahlilniOlish) oladi
  for (const talaba of talabalar) {
    const tahlil = await tahlilniOlish(xonaId, talaba.qatnashchiId);
    assert.equal(tahlil.length, 20);
    tahlil.forEach((t) => {
      assert.ok(typeof t.togriIndex === "number");
      assert.ok(t.variantlar.length === 4);
      assert.ok(t.izoh);
      assert.ok(typeof t.slayd === "string" && t.slayd.length > 0);
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// YANGI XAVFSIZLIK TESTLARI (K1–K4 tuzatishlari uchun)
// ═══════════════════════════════════════════════════════════════

test("K3: Ustoz kalitisiz yoki noto'g'ri kalit bilan boshqaruv rad etiladi", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q = await qatnashchiQosh(xona.xonaId, "Test", 1);

  // Kalitsiz boshlash — rad
  await assert.rejects(jangniBoshla(xona.xonaId), /ustoz kaliti/i);
  // Noto'g'ri kalit bilan boshlash — rad
  await assert.rejects(jangniBoshla(xona.xonaId, "soxta-kalit"), /kaliti noto'g'ri/);

  // To'g'ri kalit bilan — ishlaydi
  await jangniBoshla(xona.xonaId, xona.ustozKalit);
  assert.equal((await doskaHolatiniOlish(xona.xonaId)).holat, "jang");

  // Chetlatish va yakunlash ham kalitsiz rad etiladi
  await assert.rejects(qatnashchiniChetlat(xona.xonaId, q.qatnashchiId, "soxta"), /kaliti noto'g'ri/);
  await assert.rejects(jangniTugat(xona.xonaId), /ustoz kaliti/i);
  await assert.rejects(jamoaNominiYangila(xona.xonaId, 1, "Buzilgan", "soxta"), /kaliti noto'g'ri/);

  // Xona PIN'ni bilgan odam nomni o'zgartira olmaganini tekshiramiz
  const holat = await doskaHolatiniOlish(xona.xonaId);
  assert.notEqual(holat.jamoalar.find((j) => j.id === 1).nom, "Buzilgan");
});

test("K3: Ustoz kaliti hech qanday holat so'rovida sizib chiqmaydi", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q = await qatnashchiQosh(xona.xonaId, "Maxfiy", 1);

  const doska = await doskaHolatiniOlish(xona.xonaId);
  const oquvchi = await oquvchiHolatiniOlish(xona.xonaId, q.qatnashchiId);

  assert.ok(!JSON.stringify(doska).includes(xona.ustozKalit), "Doska holatida kalit bo'lmasligi kerak");
  assert.ok(!JSON.stringify(oquvchi).includes(xona.ustozKalit), "O'quvchi holatida kalit bo'lmasligi kerak");
  assert.ok(!JSON.stringify(doska).toLowerCase().includes("kalit"), "Kalit maydoni umuman bo'lmasligi kerak");
});

test("Y2: Yakunlangan o'yinni qayta boshlab bo'lmaydi", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  await qatnashchiQosh(xona.xonaId, "Test", 1);
  await jangniBoshla(xona.xonaId, xona.ustozKalit);
  await jangniTugat(xona.xonaId, xona.ustozKalit);

  await assert.rejects(jangniBoshla(xona.xonaId, xona.ustozKalit), /yakunlangan/);
  assert.equal((await doskaHolatiniOlish(xona.xonaId)).holat, "yakunlandi");
});

test("Y1: 300 ta xona — PIN'lar takrorlanmaydi va eski xona o'chib ketmaydi", async () => {
  const idlar = new Set();
  let birinchiId = null;
  for (let i = 0; i < 300; i++) {
    const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
    assert.ok(!idlar.has(xona.xonaId), `PIN takrorlandi: ${xona.xonaId}`);
    idlar.add(xona.xonaId);
    if (i === 0) birinchiId = xona.xonaId;
  }
  assert.equal(idlar.size, 300);
  // Birinchi xona hali tirik (keyingi yaratishlar o'chirmagan)
  const birinchi = await doskaHolatiniOlish(birinchiId);
  assert.ok(birinchi);
  assert.equal(birinchi.xonaId, birinchiId);
});

test("K4: Mijoz yuborgan vaqt (0 soniya) hisobga olinmaydi — server o'lchovi ishlatiladi", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q = await qatnashchiQosh(xona.xonaId, "Ayyor", 1);
  await jangniBoshla(xona.xonaId, xona.ustozKalit);

  const ichkiQ = ichkiXonaniOl(xona.xonaId).qatnashchilar[q.qatnashchiId];
  const savol = ichkiQ.savollar[0];

  // O'quvchi 20 soniya o'yladi, lekin mijoz 0 yubordi (soxtalashtirish urinishi)
  ichkiQ.oxirgiSavolVaqti = Date.now() - 20000;
  await javobniQabulQil(xona.xonaId, q.qatnashchiId, savol.id, savol._maxfiyTogriIndex, 0);

  assert.equal(ichkiQ.sarflanganVaqt, 20, "Server o'lchovi (20) yozilishi kerak, mijoz 0'si emas");
});

test("Idempotent javob: bir savolga ikki marta javob ikkinchi marta ball qo'shmaydi", async () => {
  const xona = await yangiXonaYarat("sirt-hodisalari-adsorbsiya", 2);
  const q = await qatnashchiQosh(xona.xonaId, "Qayta", 1);
  await jangniBoshla(xona.xonaId, xona.ustozKalit);

  const ichkiQ = ichkiXonaniOl(xona.xonaId).qatnashchilar[q.qatnashchiId];
  const savol = ichkiQ.savollar[0];

  await javobniQabulQil(xona.xonaId, q.qatnashchiId, savol.id, savol._maxfiyTogriIndex);
  const ballBirinchi = ichkiQ.ball;
  assert.ok(ballBirinchi > 0);

  // Ikkinchi urinish (tarmoq qayta yuborishi yoki ataylab) — ball o'zgarmaydi
  const res = await javobniQabulQil(xona.xonaId, q.qatnashchiId, savol.id, savol._maxfiyTogriIndex);
  assert.ok(res.qabulQilindi);
  assert.equal(ichkiQ.ball, ballBirinchi);
});
