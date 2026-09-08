// AI uchun deterministik dalillar mavjud masala dvigatelidan olinadi.
// Atom massalarining ikkinchi nusxasi ataylab yo'q: yagona manba masala-dvigatel.js.

import {
  ATOM_MASSALAR,
  masalaMatniniTahlilQil,
  molyarMassaHisobla,
} from "../masala-dvigatel.js";

export { ATOM_MASSALAR };

function yaroqliMolyarMassa(formula) {
  const natija = molyarMassaHisobla(formula);
  return natija > 0 ? natija : null;
}

/** Pearson diagonal krestini tekshiriladigan sonlar bilan hisoblaydi. */
export function pearsonKrestiHisobla({ w1, w2, wTarget }) {
  const v1 = Number(w1);
  const v2 = Number(w2);
  const vt = Number(wTarget);
  if (![v1, v2, vt].every(Number.isFinite)) return null;

  const yuqori = Math.max(v1, v2);
  const quyi = Math.min(v1, v2);
  if (vt <= quyi || vt >= yuqori) return null;

  const qism1 = Math.abs(vt - v2);
  const qism2 = Math.abs(v1 - vt);
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const boluvchi = gcd(Math.round(qism1 * 100), Math.round(qism2 * 100)) / 100;
  const n1 = (qism1 / boluvchi).toFixed(1).replace(/\.0$/, "");
  const n2 = (qism2 / boluvchi).toFixed(1).replace(/\.0$/, "");
  return { mavjud: true, w1: v1, w2: v2, wTarget: vt, qism1, qism2, nisbat: `${n1} : ${n2}` };
}

const PASTKI_INDEKSLAR = Object.freeze({
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4",
  "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
});

function hakamMatniniTayyorla(qiymat) {
  return String(qiymat || "")
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (belgi) => PASTKI_INDEKSLAR[belgi])
    .replace(/\\(?:ce|mathrm|text)\{([^}]*)\}/g, "$1")
    .replace(/_\{?(\d+)\}?/g, "$1")
    .replace(/[{}]/g, "")
    .replace(/,/g, ".");
}

function natijaMatnlariniOl(natija) {
  if (!natija || typeof natija !== "object") return [];
  const qatorlar = [
    natija.yakuniyJavob,
    natija.matn,
    ...(Array.isArray(natija.tenglamalar) ? natija.tenglamalar : []),
    ...(Array.isArray(natija.yonalish?.formulalar) ? natija.yonalish.formulalar : []),
  ];
  for (const bosqich of Array.isArray(natija.bosqichlar) ? natija.bosqichlar : []) {
    if (!bosqich || typeof bosqich !== "object") continue;
    qatorlar.push(bosqich.formula, bosqich.tushuntirish, bosqich.mantiq);
  }
  return qatorlar.filter((qator) => typeof qator === "string").map(hakamMatniniTayyorla);
}

function yaqinmi(berilgan, kutilgan, nisbiyFarq = 0.005) {
  return Math.abs(berilgan - kutilgan) <= Math.max(0.05, Math.abs(kutilgan) * nisbiyFarq);
}

/**
 * Modelning aniq sonli da'volarini serverdagi yagona atom massalari bilan
 * solishtiradi. Noaniq tabiiy tilga hukm chiqarmaydi: faqat tekshirish mumkin
 * bo'lgan tenglik topilganda ogohlantirish yaratadi.
 */
export function aiYechiminiDeterministikTekshir(natija) {
  const ogohlantirishlar = [];
  const tekshiruvlar = [];
  const matnlar = natijaMatnlariniOl(natija);

  for (const matn of matnlar) {
    const molyarNaqsh = /M\s*\(\s*([A-Z][A-Za-z0-9().·*]*)\s*\)\s*=\s*(\d+(?:\.\d+)?)/g;
    let moslik;
    while ((moslik = molyarNaqsh.exec(matn)) !== null) {
      const formula = moslik[1];
      const berilgan = Number(moslik[2]);
      const kutilgan = yaroqliMolyarMassa(formula);
      if (kutilgan === null) continue;
      const togri = yaqinmi(berilgan, kutilgan);
      tekshiruvlar.push({ turi: "molyar_massa", formula, berilgan, kutilgan, togri });
      if (!togri) {
        ogohlantirishlar.push({
          turi: "molyar_massa_xatosi",
          formula,
          berilgan,
          kutilgan,
          xabar: `M(${formula}) = ${berilgan} g/mol deb yozilgan, server qiymati ${kutilgan} g/mol.`,
        });
      }
    }

    const tenglikNaqsh = /(\d+(?:\.\d+)?)\s*[/÷]\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)/g;
    let tenglik;
    while ((tenglik = tenglikNaqsh.exec(matn)) !== null) {
      const oldingiMatn = matn.slice(Math.max(0, tenglik.index - 12), tenglik.index);
      // 200 × 10 / 100 = 20 kabi murakkab ifodada "10 / 100 = 20" ni
      // alohida tenglik deb olish noto'g'ri; u quyidagi ko'paytirish-bo'lish
      // tekshiruviga tegishli bo'ladi.
      if (/[×*]\s*$/.test(oldingiMatn)) continue;
      const surat = Number(tenglik[1]);
      const maxraj = Number(tenglik[2]);
      const berilgan = Number(tenglik[3]);
      if (maxraj === 0) continue;
      const kutilgan = surat / maxraj;
      const togri = yaqinmi(berilgan, kutilgan, 0.01);
      tekshiruvlar.push({ turi: "bolish", berilgan, kutilgan, togri });
      if (!togri) {
        ogohlantirishlar.push({
          turi: "hisob_xatosi",
          amal: "bo'lish",
          berilgan,
          kutilgan: Number(kutilgan.toFixed(6)),
          xabar: `${surat} / ${maxraj} = ${berilgan} deb yozilgan, to'g'ri qiymat ${Number(kutilgan.toFixed(6))}.`,
        });
      }
    }

    const kopaytirishNaqsh = /(\d+(?:\.\d+)?)\s*[×*]\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)/g;
    let kopaytirish;
    while ((kopaytirish = kopaytirishNaqsh.exec(matn)) !== null) {
      const chap = Number(kopaytirish[1]);
      const ong = Number(kopaytirish[2]);
      const berilgan = Number(kopaytirish[3]);
      const kutilgan = chap * ong;
      const togri = yaqinmi(berilgan, kutilgan, 0.01);
      tekshiruvlar.push({ turi: "kopaytirish", berilgan, kutilgan, togri });
      if (!togri) {
        ogohlantirishlar.push({
          turi: "hisob_xatosi",
          amal: "ko'paytirish",
          berilgan,
          kutilgan: Number(kutilgan.toFixed(6)),
          xabar: `${chap} × ${ong} = ${berilgan} deb yozilgan, to'g'ri qiymat ${Number(kutilgan.toFixed(6))}.`,
        });
      }
    }
  }

  return {
    tekshirildi: tekshiruvlar.length > 0,
    tekshiruvlar,
    ogohlantirishlar,
  };
}

/**
 * Modelga taxmin emas, server hisoblagan molyar massalarni beradi.
 * Bu hali to'liq yechim hakami emas; noto'g'ri son o'ylab topish xavfini kamaytiruvchi tayanchdir.
 */
export function deterministikKontekstTuz(matn = "") {
  const tahlil = masalaMatniniTahlilQil(String(matn || ""));
  const dalillar = (tahlil.formulalar || [])
    .slice(0, 8)
    .map((formula) => ({ formula, molyarMassa: yaroqliMolyarMassa(formula) }))
    .filter((dalil) => dalil.molyarMassa !== null);
  if (dalillar.length === 0) return { ishlatildi: false, dalillar: [], prompt: "" };

  const qatorlar = dalillar.map((dalil) => `- M(${dalil.formula}) = ${dalil.molyarMassa} g/mol`).join("\n");
  return {
    ishlatildi: true,
    dalillar,
    prompt: `\n\n<server_hakami>\nQuyidagi qiymatlar yagona kimyo dvigateli hisoblagan tekshirilgan dalillardir. Ularga zid molyar massa yozmang:\n${qatorlar}\n</server_hakami>`,
  };
}
