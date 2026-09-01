import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { sanaVaqt } from "./sana.js";
import { latexniOddiyMatnga } from "./latex-oddiy-matn.js";
import { pdfVizualniTayyorla } from "./masala-pdf-vizual.js";

const W = 595.28;
const H = 841.89;
const CHAP = 34;
const ONG = 34;
const PAST = 52;
const BOSH_Y = H - 88;
const KONTENT_BALANDLIGI = BOSH_Y - PAST;

const C = Object.freeze({
  oq: rgb(1, 1, 1),
  matn: rgb(0.06, 0.09, 0.16),
  siyoh: rgb(0.07, 0.13, 0.29),
  kok: rgb(0.1, 0.36, 0.82),
  yashil: rgb(0.03, 0.5, 0.24),
  yashilOch: rgb(0.92, 0.98, 0.94),
  oltin: rgb(0.88, 0.57, 0.06),
  xira: rgb(0.39, 0.45, 0.55),
  yuza: rgb(0.97, 0.98, 0.99),
  chiziq: rgb(0.82, 0.86, 0.91),
});

async function faylBaytlari(manzil) {
  const fs = await import("fs/promises");
  const path = await import("path");
  return fs.readFile(path.join(process.cwd(), "public", manzil.replace(/^\//, "")));
}

function qatorlargaBol(matn, font, size, kenglik) {
  const sozlar = latexniOddiyMatnga(matn).split(/\s+/).filter(Boolean);
  if (sozlar.length === 0) return [];
  const qatorlar = [];
  let joriy = "";

  const uzunSozniBol = (soz) => {
    const qismlar = [];
    let qism = "";
    for (const belgi of [...soz]) {
      if (qism && font.widthOfTextAtSize(qism + belgi, size) > kenglik) {
        qismlar.push(qism);
        qism = belgi;
      } else {
        qism += belgi;
      }
    }
    if (qism) qismlar.push(qism);
    return qismlar;
  };

  for (const soz of sozlar) {
    if (font.widthOfTextAtSize(soz, size) > kenglik) {
      if (joriy) qatorlar.push(joriy);
      const qismlar = uzunSozniBol(soz);
      qatorlar.push(...qismlar.slice(0, -1));
      joriy = qismlar.at(-1) || "";
      continue;
    }
    const sinov = joriy ? `${joriy} ${soz}` : soz;
    if (font.widthOfTextAtSize(sinov, size) <= kenglik) {
      joriy = sinov;
    } else {
      if (joriy) qatorlar.push(joriy);
      joriy = soz;
    }
  }
  if (joriy) qatorlar.push(joriy);
  return qatorlar;
}

export async function masalaPdfServerdaYarat({
  foydalanuvchiNom = "Talaba",
  masalaMatni = "",
  natija = {},
}) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const [oddiyBayt, qalinBayt] = await Promise.all([
    faylBaytlari("/fonts/DejaVuSans.ttf"),
    faylBaytlari("/fonts/DejaVuSans-Bold.ttf"),
  ]);
  const oddiy = await doc.embedFont(oddiyBayt, { subset: true });
  const qalin = await doc.embedFont(qalinBayt, { subset: true });
  const hujjatId = `JDA-${Date.now().toString(36).toUpperCase()}`;
  const sahifalar = [];
  let sahifa;
  let y;

  doc.setTitle(`JDA Kimyo AI — ${latexniOddiyMatnga(masalaMatni).slice(0, 80)}`);
  doc.setAuthor("JDA KIMYO Fan va Ta'lim Portali");
  doc.setCreator("JDA Kimyo AI PDF Engine");

  const yangiSahifa = () => {
    sahifa = doc.addPage([W, H]);
    sahifalar.push(sahifa);
    sahifa.drawRectangle({ x: CHAP, y: H - 67, width: W - CHAP - ONG, height: 38, color: C.siyoh });
    sahifa.drawRectangle({ x: CHAP, y: H - 69, width: W - CHAP - ONG, height: 2, color: C.oltin });
    sahifa.drawText("JDA KIMYO", { x: CHAP + 13, y: H - 51, size: 14, font: qalin, color: C.oq });
    sahifa.drawText("AI KIMYOVIY MASALA YECHIMI", { x: CHAP + 116, y: H - 50, size: 7.5, font: qalin, color: rgb(0.82, 0.88, 0.98) });
    y = BOSH_Y;
  };

  const joyTayyorla = (balandlik) => {
    if (!sahifa || y - balandlik < PAST) yangiSahifa();
  };

  const sarlavhaYoz = (matn, keyingiMinimum = 54) => {
    // Sarlavha sahifa oxirida yolg'iz qolmasligi uchun undan keyingi
    // birinchi mazmun blokiga ham joy oldindan band qilinadi.
    joyTayyorla(26 + keyingiMinimum);
    y -= 5;
    sahifa.drawText(latexniOddiyMatnga(matn).toUpperCase(), {
      x: CHAP,
      y,
      size: 9.5,
      font: qalin,
      color: C.siyoh,
    });
    y -= 15;
  };

  const kartaYoz = (bloklar, { rang = C.yuza, chegara = C.chiziq } = {}) => {
    const kenglik = W - CHAP - ONG - 24;
    const tayyor = bloklar.flatMap((blok, indeks) => {
      const font = blok.qalin ? qalin : oddiy;
      const size = blok.size || 8.5;
      const qatorlar = qatorlargaBol(blok.matn, font, size, kenglik);
      return qatorlar.map((qator, qatorIndeksi) => ({
        qator,
        font,
        size,
        rang: blok.rang || C.matn,
        balandlik: blok.balandlik || size + 3.2,
        oldi: indeks > 0 && qatorIndeksi === 0 ? (blok.oldi ?? 4) : 0,
      }));
    });
    if (tayyor.length === 0) return;
    const jamiBalandlik = 16 + tayyor.reduce((jami, qator) => jami + qator.balandlik + qator.oldi, 0);
    if (jamiBalandlik <= KONTENT_BALANDLIGI) joyTayyorla(jamiBalandlik);

    let indeks = 0;
    while (indeks < tayyor.length) {
      if (y - PAST < 34) yangiSahifa();
      const mavjud = y - PAST;
      const parcha = [];
      let parchaBalandligi = 16;
      while (indeks < tayyor.length) {
        const qator = tayyor[indeks];
        const kerak = qator.balandlik + qator.oldi;
        if (parcha.length > 0 && parchaBalandligi + kerak > mavjud) break;
        parcha.push(qator);
        parchaBalandligi += kerak;
        indeks += 1;
      }

      const kartaY = y;
      sahifa.drawRectangle({
        x: CHAP,
        y: kartaY - parchaBalandligi,
        width: W - CHAP - ONG,
        height: parchaBalandligi,
        color: rang,
        borderColor: chegara,
        borderWidth: 0.8,
      });
      y -= 10;
      for (const qator of parcha) {
        y -= qator.oldi;
        sahifa.drawText(qator.qator, {
          x: CHAP + 12,
          y,
          size: qator.size,
          font: qator.font,
          color: qator.rang,
        });
        y -= qator.balandlik;
      }
      // Matn balandligi va ichki padding hisoblari orasidagi farq keyingi
      // sarlavhani karta chegarasiga chiqarib yubormasligi uchun aniq pastki
      // koordinatadan davom etiladi.
      y = kartaY - parchaBalandligi - 10;
      if (indeks < tayyor.length) yangiSahifa();
    }
  };

  const jadvalYoz = (jadval) => {
    const ustunlar = jadval.ustunlar;
    const jamiKenglik = W - CHAP - ONG;
    const ustunKengligi = jamiKenglik / ustunlar.length;
    const ichkiKenglik = ustunKengligi - 12;
    const matnSize = ustunlar.length >= 4 ? 7.1 : 7.8;
    const qatorOraligi = matnSize + 3;

    const katakQatorlari = (qiymat, font = oddiy) => (
      qatorlargaBol(qiymat, font, matnSize, ichkiKenglik).slice(0, 8)
    );
    const sarlavhaQatorlari = ustunlar.map((ustun) => katakQatorlari(ustun, qalin));
    const sarlavhaBalandligi = Math.max(...sarlavhaQatorlari.map((qatorlar) => qatorlar.length), 1) * qatorOraligi + 12;

    const jadvalSarlavhasiniYoz = (davomi = false) => {
      const matn = `${jadval.sarlavha}${davomi ? " (davomi)" : ""}`;
      const qatorlar = qatorlargaBol(matn, qalin, 8.8, jamiKenglik);
      const balandlik = qatorlar.length * 11 + 8;
      joyTayyorla(balandlik + sarlavhaBalandligi + 24);
      qatorlar.forEach((qator) => {
        y -= 11;
        sahifa.drawText(qator, { x: CHAP, y, size: 8.8, font: qalin, color: C.siyoh });
      });
      y -= 6;
    };

    const ustunSarlavhalariniYoz = () => {
      const tepa = y;
      ustunlar.forEach((_, indeks) => {
        const x = CHAP + indeks * ustunKengligi;
        sahifa.drawRectangle({
          x,
          y: tepa - sarlavhaBalandligi,
          width: ustunKengligi,
          height: sarlavhaBalandligi,
          color: C.siyoh,
          borderColor: C.oq,
          borderWidth: 0.5,
        });
        sarlavhaQatorlari[indeks].forEach((qator, qatorIndeksi) => {
          sahifa.drawText(qator, {
            x: x + 6,
            y: tepa - 9 - qatorIndeksi * qatorOraligi,
            size: matnSize,
            font: qalin,
            color: C.oq,
          });
        });
      });
      y -= sarlavhaBalandligi;
    };

    jadvalSarlavhasiniYoz(false);
    ustunSarlavhalariniYoz();
    jadval.qatorlar.forEach((qator) => {
      const qatorKataklari = ustunlar.map((_, indeks) => katakQatorlari(qator[indeks]));
      const qatorBalandligi = Math.max(...qatorKataklari.map((qatorlar) => qatorlar.length), 1) * qatorOraligi + 12;
      if (y - qatorBalandligi < PAST) {
        yangiSahifa();
        jadvalSarlavhasiniYoz(true);
        ustunSarlavhalariniYoz();
      }
      const tepa = y;
      qatorKataklari.forEach((qatorlar, indeks) => {
        const x = CHAP + indeks * ustunKengligi;
        sahifa.drawRectangle({
          x,
          y: tepa - qatorBalandligi,
          width: ustunKengligi,
          height: qatorBalandligi,
          color: C.yuza,
          borderColor: C.chiziq,
          borderWidth: 0.6,
        });
        qatorlar.forEach((matn, qatorIndeksi) => {
          sahifa.drawText(matn, {
            x: x + 6,
            y: tepa - 10 - qatorIndeksi * qatorOraligi,
            size: matnSize,
            font: oddiy,
            color: C.matn,
          });
        });
      });
      y -= qatorBalandligi;
    });
    y -= 12;
  };

  const grafikYoz = (grafik) => {
    const balandlik = 220;
    joyTayyorla(balandlik);
    const tepa = y;
    const past = tepa - balandlik;
    sahifa.drawRectangle({
      x: CHAP,
      y: past,
      width: W - CHAP - ONG,
      height: balandlik,
      color: C.oq,
      borderColor: C.chiziq,
      borderWidth: 0.8,
    });
    const grafikSarlavhasi = qatorlargaBol(grafik.sarlavha, qalin, 9.2, W - CHAP - ONG - 24).slice(0, 2);
    grafikSarlavhasi.forEach((qator, indeks) => {
      sahifa.drawText(qator, {
        x: CHAP + 12,
        y: tepa - 18 - indeks * 11,
        size: 9.2,
        font: qalin,
        color: C.siyoh,
      });
    });

    const plotChap = CHAP + 50;
    const plotOng = W - ONG - 17;
    const plotPast = past + 46;
    const plotTepa = tepa - 45 - Math.max(0, grafikSarlavhasi.length - 1) * 11;
    const plotW = plotOng - plotChap;
    const plotH = plotTepa - plotPast;
    const qiymatlar = grafik.nuqtalar.map((nuqta) => nuqta.qiymat);
    let min = Math.min(0, ...qiymatlar);
    let max = Math.max(0, ...qiymatlar);
    if (min === max) {
      min -= 1;
      max += 1;
    }
    const oraliq = max - min;
    const yJoy = (qiymat) => plotPast + ((qiymat - min) / oraliq) * plotH;
    const xJoy = (indeks) => plotChap + ((indeks + 0.5) / grafik.nuqtalar.length) * plotW;
    const nolY = yJoy(0);

    for (let indeks = 0; indeks < 5; indeks += 1) {
      const qiymat = min + (oraliq * indeks) / 4;
      const chiziqY = yJoy(qiymat);
      sahifa.drawLine({
        start: { x: plotChap, y: chiziqY },
        end: { x: plotOng, y: chiziqY },
        thickness: indeks === 0 ? 0.8 : 0.45,
        color: indeks === 0 ? C.xira : C.chiziq,
      });
      const belgi = Number(qiymat.toFixed(Math.abs(qiymat) < 0.1 ? 3 : 2)).toString();
      sahifa.drawText(belgi, {
        x: plotChap - 7 - oddiy.widthOfTextAtSize(belgi, 6.5),
        y: chiziqY - 2,
        size: 6.5,
        font: oddiy,
        color: C.xira,
      });
    }
    sahifa.drawLine({
      start: { x: plotChap, y: nolY },
      end: { x: plotOng, y: nolY },
      thickness: 0.9,
      color: C.xira,
    });

    if (grafik.turi === "chiziqli") {
      grafik.nuqtalar.forEach((nuqta, indeks) => {
        if (indeks > 0) {
          const oldingi = grafik.nuqtalar[indeks - 1];
          sahifa.drawLine({
            start: { x: xJoy(indeks - 1), y: yJoy(oldingi.qiymat) },
            end: { x: xJoy(indeks), y: yJoy(nuqta.qiymat) },
            thickness: 2,
            color: C.kok,
          });
        }
        sahifa.drawCircle({ x: xJoy(indeks), y: yJoy(nuqta.qiymat), size: 3.5, color: C.kok });
      });
    } else {
      const katakW = plotW / grafik.nuqtalar.length;
      const ustunW = Math.min(34, katakW * 0.55);
      grafik.nuqtalar.forEach((nuqta, indeks) => {
        const nuqtaY = yJoy(nuqta.qiymat);
        sahifa.drawRectangle({
          x: xJoy(indeks) - ustunW / 2,
          y: Math.min(nuqtaY, nolY),
          width: ustunW,
          height: Math.max(1.5, Math.abs(nuqtaY - nolY)),
          color: C.kok,
        });
      });
    }

    grafik.nuqtalar.forEach((nuqta, indeks) => {
      const qiymat = Number(nuqta.qiymat.toFixed(Math.abs(nuqta.qiymat) < 0.1 ? 3 : 2)).toString();
      const qiymatX = xJoy(indeks) - qalin.widthOfTextAtSize(qiymat, 6.5) / 2;
      const qiymatY = nuqta.qiymat >= 0 ? yJoy(nuqta.qiymat) + 6 : yJoy(nuqta.qiymat) - 11;
      sahifa.drawText(qiymat, { x: qiymatX, y: qiymatY, size: 6.5, font: qalin, color: C.siyoh });
      const nom = nuqta.nom.slice(0, 14);
      sahifa.drawText(nom, {
        x: xJoy(indeks) - oddiy.widthOfTextAtSize(nom, 6.3) / 2,
        y: plotPast - 13,
        size: 6.3,
        font: oddiy,
        color: C.xira,
      });
    });
    if (grafik.xNomi) {
      sahifa.drawText(grafik.xNomi, {
        x: plotChap + plotW / 2 - qalin.widthOfTextAtSize(grafik.xNomi, 6.8) / 2,
        y: past + 9,
        size: 6.8,
        font: qalin,
        color: C.xira,
      });
    }
    if (grafik.yNomi) {
      sahifa.drawText(grafik.yNomi, { x: CHAP + 10, y: plotTepa + 7, size: 6.8, font: qalin, color: C.xira });
    }
    y -= balandlik + 12;
  };

  yangiSahifa();
  kartaYoz([
    { matn: `Foydalanuvchi: ${foydalanuvchiNom}`, qalin: true, size: 8.5 },
    { matn: `Sana: ${sanaVaqt(new Date())}   ·   Mavzu: ${natija.masalaTuri || "umumiy kimyo"}`, size: 8, rang: C.xira },
  ]);

  sarlavhaYoz("1. Kimyoviy masala sharti");
  kartaYoz([{ matn: masalaMatni || natija.masalaMatni || "Masala sharti berilmagan.", size: 9 }]);

  const berilgan = Array.isArray(natija.berilgan) ? natija.berilgan : [];
  const topish = Array.isArray(natija.topishKerak) ? natija.topishKerak : [];
  if (berilgan.length || topish.length) {
    sarlavhaYoz("2. Boshlang'ich parametrlar");
    const qatorlar = [];
    const jami = Math.max(berilgan.length, topish.length);
    for (let i = 0; i < jami; i += 1) {
      const b = berilgan[i];
      const t = topish[i];
      qatorlar.push([
        b ? `${b.belgi || ""} = ${b.qiymat || ""}` : "",
        t ? `${t.belgi || ""}${t.nom ? ` — ${t.nom}` : ""}` : "",
      ]);
    }
    jadvalYoz({
      sarlavha: "Masala ma'lumotlari",
      ustunlar: ["Berilgan", "Topilishi kerak"],
      qatorlar,
    });
  }

  const tenglamalar = Array.isArray(natija.tenglamalar)
    ? natija.tenglamalar
    : natija.tenglama ? [natija.tenglama] : [];
  if (tenglamalar.length) {
    sarlavhaYoz("3. Kimyoviy tenglamalar");
    for (const tenglama of tenglamalar) {
      kartaYoz([{ matn: tenglama, qalin: true, size: 9.2, rang: C.siyoh }], {
        rang: rgb(0.94, 0.97, 1),
        chegara: C.kok,
      });
    }
  }

  const tuzoq = natija.tuzoqTahlili;
  if (tuzoq && Object.values(tuzoq).some(Boolean)) {
    sarlavhaYoz("4. Tuzoq va xatolar tahlili");
    kartaYoz([
      { matn: tuzoq.kalitNuqta || "", qalin: true, rang: C.siyoh },
      { matn: tuzoq.nimaUchunMuhim || "" },
      { matn: tuzoq.kengTarqalganXato || "", rang: C.xira },
    ].filter((blok) => blok.matn));
  }

  const formulalar = Array.isArray(natija.yonalish?.formulalar) ? natija.yonalish.formulalar : [];
  const reja = Array.isArray(natija.yonalish?.qadamlarRejasi) ? natija.yonalish.qadamlarRejasi : [];
  if (formulalar.length || reja.length || natija.yonalish?.maslahat) {
    sarlavhaYoz("5. Yechish yo'nalishi");
    for (const formula of formulalar) {
      kartaYoz([{ matn: formula, qalin: true, size: 9, rang: C.siyoh }]);
    }
    if (reja.length || natija.yonalish?.maslahat) {
      kartaYoz([
        ...reja.map((qadam, indeks) => ({ matn: `${indeks + 1}. ${qadam}`, size: 8.3 })),
        ...(natija.yonalish?.maslahat ? [{ matn: `Maslahat: ${natija.yonalish.maslahat}`, rang: C.xira }] : []),
      ]);
    }
  }

  const bosqichlar = Array.isArray(natija.bosqichlar) ? natija.bosqichlar : [];
  if (bosqichlar.length) {
    sarlavhaYoz("6. Bosqichma-bosqich yechim");
    bosqichlar.forEach((bosqich, indeks) => {
      kartaYoz([
        { matn: bosqich.sarlavha || `${indeks + 1}-bosqich`, qalin: true, rang: C.siyoh },
        { matn: bosqich.tushuntirish || bosqich.mantiq || bosqich.matn || "" },
        ...(bosqich.formula ? [{ matn: bosqich.formula, qalin: true, size: 9, rang: C.yashil }] : []),
      ].filter((blok) => blok.matn));
    });
  }

  const vizual = pdfVizualniTayyorla(natija);
  if (vizual.jadvallar.length || vizual.grafiklar.length) {
    sarlavhaYoz("7. Jadval va grafik tahlil", 90);
    vizual.jadvallar.forEach(jadvalYoz);
    vizual.grafiklar.forEach(grafikYoz);
  }

  if (natija.yakuniyJavob) {
    sarlavhaYoz("Yakuniy javob");
    kartaYoz([{ matn: natija.yakuniyJavob, qalin: true, size: 10, rang: C.yashil }], {
      rang: C.yashilOch,
      chegara: C.yashil,
    });
  }

  sahifalar.forEach((joriySahifa, indeks) => {
    joriySahifa.drawLine({
      start: { x: CHAP, y: 35 },
      end: { x: W - ONG, y: 35 },
      thickness: 0.7,
      color: C.chiziq,
    });
    joriySahifa.drawText(`JDA KIMYO AI · jdakimyo.uz · ${hujjatId}`, {
      x: CHAP,
      y: 21,
      size: 6.5,
      font: oddiy,
      color: C.xira,
    });
    const raqam = `${indeks + 1} / ${sahifalar.length}`;
    joriySahifa.drawText(raqam, {
      x: W - ONG - oddiy.widthOfTextAtSize(raqam, 6.5),
      y: 21,
      size: 6.5,
      font: oddiy,
      color: C.xira,
    });
  });

  return doc.save();
}
