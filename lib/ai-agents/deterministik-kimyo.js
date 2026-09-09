// AI uchun deterministik dalillar mavjud masala dvigatelidan olinadi.
// Atom massalarining ikkinchi nusxasi ataylab yo'q: yagona manba masala-dvigatel.js.

import {
  ATOM_MASSALAR,
  masalaMatniniTahlilQil,
  molyarMassaHisobla,
} from "../masala-dvigatel.js";

export { ATOM_MASSALAR };

/** Normal sharoitdagi gaz hisoblarining yagona fizik doimiylari. */
export const GAZ_DOIMIYLARI = Object.freeze({
  normalMolyarHajm: 22.4,
  havoMolyarMassasi: 28.98,
  vodorodMolyarMassasi: 2.016,
});

/** Elektrokimyoviy hisoblarda birliklar bir xil bo'lishi uchun SI doimiylari. */
export const ELEKTROKIMYO_DOIMIYLARI = Object.freeze({
  faradey: 96485,
  suvIonKopaytmasi: 1e-14,
});

function sonniOl(qiymat) {
  if (qiymat === null || qiymat === undefined || qiymat === "") return null;
  const son = Number(qiymat);
  return Number.isFinite(son) ? son : null;
}

/** Gaz masalasidagi bog'liq kattaliklarni bitta fizik modeldan hisoblaydi. */
export function gazHisobla({ mol = null, massa = null, hajm = null, molyarMassa = null, etalonMolyarMassa = null } = {}) {
  let n = sonniOl(mol);
  let m = sonniOl(massa);
  let v = sonniOl(hajm);
  const M = sonniOl(molyarMassa);
  const etalon = sonniOl(etalonMolyarMassa);

  if (n === null && v !== null) n = v / GAZ_DOIMIYLARI.normalMolyarHajm;
  if (n === null && m !== null && M && M > 0) n = m / M;
  if (v === null && n !== null) v = n * GAZ_DOIMIYLARI.normalMolyarHajm;
  if (m === null && n !== null && M !== null) m = n * M;

  return {
    mol: n,
    massa: m,
    hajm: v,
    molyarMassa: M,
    zichlik: m !== null && v !== null && v !== 0 ? m / v : null,
    nisbiyZichlik: M !== null && etalon !== null && etalon !== 0 ? M / etalon : null,
  };
}

/** Aralashma massa va massaviy ulushlari ichki mosligini tekshiradi. */
export function aralashmaBalansiniTekshir({ massalar = [], ulushlar = [], jamiMassa = null } = {}) {
  const m = massalar.map(sonniOl);
  const w = ulushlar.map(sonniOl);
  const hisoblanganMassa = m.length && m.every((qiymat) => qiymat !== null)
    ? m.reduce((yigindi, qiymat) => yigindi + qiymat, 0)
    : null;
  const ulushYigindisi = w.length && w.every((qiymat) => qiymat !== null)
    ? w.reduce((yigindi, qiymat) => yigindi + qiymat, 0)
    : null;
  const berilganJami = sonniOl(jamiMassa);

  return {
    hisoblanganMassa,
    ulushYigindisi,
    massaMos: hisoblanganMassa === null || berilganJami === null || yaqinmi(berilganJami, hisoblanganMassa, 0.01),
    ulushlarMos: ulushYigindisi === null || yaqinmi(ulushYigindisi, 1, 0.005),
  };
}

function matritsaYaroqlimi(matritsa) {
  return Array.isArray(matritsa)
    && matritsa.length >= 2
    && matritsa.length <= 3
    && matritsa.every((qator) => Array.isArray(qator)
      && qator.length === matritsa.length
      && qator.every((qiymat) => Number.isFinite(Number(qiymat))));
}

/** Ikki yoki uch noma'lumli sistemaning determinantini hisoblaydi. */
export function kramerDeterminanti(matritsa) {
  if (!matritsaYaroqlimi(matritsa)) return null;
  const a = matritsa.map((qator) => qator.map(Number));
  if (a.length === 2) return a[0][0] * a[1][1] - a[0][1] * a[1][0];
  return a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1])
    - a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0])
    + a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0]);
}

/** Qotishma va aralashma sistemalarini Kramer qoidasi bilan aniq yechadi. */
export function kramerSistemasiniYech({ koeffitsiyentlar, ozodHadlar, nomalumlar = [] } = {}) {
  if (!matritsaYaroqlimi(koeffitsiyentlar)
    || !Array.isArray(ozodHadlar)
    || ozodHadlar.length !== koeffitsiyentlar.length
    || !ozodHadlar.every((qiymat) => Number.isFinite(Number(qiymat)))) return null;

  const determinant = kramerDeterminanti(koeffitsiyentlar);
  if (determinant === null) return null;
  if (Math.abs(determinant) < 1e-12) {
    return { mavjud: false, sabab: "singulyar_sistema", determinant, yechim: null };
  }

  const determinantlar = koeffitsiyentlar[0].map((_, ustun) => kramerDeterminanti(
    koeffitsiyentlar.map((qator, qatorRaqami) => qator.map((qiymat, ustunRaqami) => (
      ustunRaqami === ustun ? Number(ozodHadlar[qatorRaqami]) : Number(qiymat)
    ))),
  ));
  const nomlar = nomalumlar.length === koeffitsiyentlar.length
    ? nomalumlar
    : ["x", "y", "z"].slice(0, koeffitsiyentlar.length);
  const yechim = Object.fromEntries(nomlar.map((nom, index) => [nom, determinantlar[index] / determinant]));
  return { mavjud: true, determinant, determinantlar, yechim };
}

/** Faradey qonuni bo'yicha elektroddagi modda massasi va zaryadni topadi. */
export function faradeyHisobla({ molyarMassa, tok, vaqtSekund, elektronSoni } = {}) {
  const M = sonniOl(molyarMassa);
  const I = sonniOl(tok);
  const t = sonniOl(vaqtSekund);
  const n = sonniOl(elektronSoni);
  if (![M, I, t, n].every((qiymat) => qiymat !== null && qiymat > 0)) return null;
  const zaryad = I * t;
  return {
    zaryad,
    massa: M * zaryad / (n * ELEKTROKIMYO_DOIMIYLARI.faradey),
    mol: zaryad / (n * ELEKTROKIMYO_DOIMIYLARI.faradey),
  };
}

/** 25 C dagi suyultirilgan eritma uchun pH/pOH ni ion konsentratsiyasidan chiqaradi. */
export function phHisobla({ vodorodIoni = null, gidroksidIoni = null } = {}) {
  const h = sonniOl(vodorodIoni);
  const oh = sonniOl(gidroksidIoni);
  if (h !== null && h > 0) {
    const pH = -Math.log10(h);
    return { pH, pOH: 14 - pH, vodorodIoni: h, gidroksidIoni: ELEKTROKIMYO_DOIMIYLARI.suvIonKopaytmasi / h };
  }
  if (oh !== null && oh > 0) {
    const pOH = -Math.log10(oh);
    return { pH: 14 - pOH, pOH, vodorodIoni: ELEKTROKIMYO_DOIMIYLARI.suvIonKopaytmasi / oh, gidroksidIoni: oh };
  }
  return null;
}

/** Ks ni erkin ionlarning muvozanat konsentratsiyalari va darajalaridan hisoblaydi. */
export function eruvchanlikKopaytmasiHisobla({ ionlar = [] } = {}) {
  if (!Array.isArray(ionlar) || ionlar.length === 0) return null;
  let Ks = 1;
  for (const ion of ionlar) {
    const konsentratsiya = sonniOl(ion?.konsentratsiya);
    const daraja = sonniOl(ion?.daraja ?? 1);
    if (konsentratsiya === null || konsentratsiya < 0 || daraja === null || daraja <= 0) return null;
    Ks *= konsentratsiya ** daraja;
  }
  return { Ks, ionlar: ionlar.map(({ nom, konsentratsiya, daraja = 1 }) => ({ nom, konsentratsiya: Number(konsentratsiya), daraja: Number(daraja) })) };
}

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

// Ks odatda 10^-n tartibida bo'ladi; umumiy 0.05 absolyut bardoshlilik
// bunday sonlarda xatoni yashirib qo'ygani uchun u faqat nisbiy solishtiriladi.
function judaKichikSonYaqinmi(berilgan, kutilgan, nisbiyFarq = 0.01) {
  return Math.abs(berilgan - kutilgan) <= Math.max(1e-16, Math.abs(kutilgan) * nisbiyFarq);
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

    // Normal sharoitga xos yozuvni alohida tanish kerak: 22.4 soni oddiy
    // ko'paytirishdan farqli ravishda fizik doimiy bo'lib, birlik yo'qolsa
    // ham gaz hajmi noto'g'ri tasdiqlanib ketmasin.
    const gazHajmiNaqsh = /V\s*=\s*(\d+(?:\.\d+)?)\s*[×*]\s*22\.4\s*=\s*(\d+(?:\.\d+)?)/gi;
    let gazHajmi;
    while ((gazHajmi = gazHajmiNaqsh.exec(matn)) !== null) {
      const mol = Number(gazHajmi[1]);
      const berilgan = Number(gazHajmi[2]);
      const kutilgan = gazHisobla({ mol }).hajm;
      const togri = yaqinmi(berilgan, kutilgan, 0.01);
      tekshiruvlar.push({ turi: "gaz_hajmi", mol, berilgan, kutilgan, togri });
      if (!togri) {
        ogohlantirishlar.push({
          turi: "gaz_hajmi_xatosi", berilgan, kutilgan,
          xabar: `Normal sharoitda V = ${mol} × 22.4 = ${Number(kutilgan.toFixed(6))} L bo'ladi.`,
        });
      }
    }

    const nisbiyZichlikNaqsh = /D\s*(?:\([^)]*\))?\s*=\s*(\d+(?:\.\d+)?)\s*[/÷]\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)/gi;
    let nisbiyZichlik;
    while ((nisbiyZichlik = nisbiyZichlikNaqsh.exec(matn)) !== null) {
      const M1 = Number(nisbiyZichlik[1]);
      const M2 = Number(nisbiyZichlik[2]);
      const berilgan = Number(nisbiyZichlik[3]);
      const kutilgan = gazHisobla({ molyarMassa: M1, etalonMolyarMassa: M2 }).nisbiyZichlik;
      const togri = yaqinmi(berilgan, kutilgan, 0.01);
      tekshiruvlar.push({ turi: "nisbiy_zichlik", M1, M2, berilgan, kutilgan, togri });
      if (!togri) {
        ogohlantirishlar.push({
          turi: "nisbiy_zichlik_xatosi", berilgan, kutilgan,
          xabar: `Nisbiy zichlik D = ${M1} / ${M2} = ${Number(kutilgan.toFixed(6))}.`,
        });
      }
    }

    const massaYigindisiNaqsh = /m(?:_?(?:umumiy|jami|total))?\s*=\s*(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)/gi;
    let massaYigindisi;
    while ((massaYigindisi = massaYigindisiNaqsh.exec(matn)) !== null) {
      const massalar = [Number(massaYigindisi[1]), Number(massaYigindisi[2])];
      const berilgan = Number(massaYigindisi[3]);
      const balans = aralashmaBalansiniTekshir({ massalar, jamiMassa: berilgan });
      tekshiruvlar.push({ turi: "aralashma_massasi", massalar, berilgan, kutilgan: balans.hisoblanganMassa, togri: balans.massaMos });
      if (!balans.massaMos) {
        ogohlantirishlar.push({
          turi: "aralashma_massasi_xatosi", berilgan, kutilgan: balans.hisoblanganMassa,
          xabar: `Aralashma massasi ${massalar[0]} + ${massalar[1]} = ${balans.hisoblanganMassa} g bo'ladi.`,
        });
      }
    }

    const ulushYigindisiNaqsh = /w\s*1\s*\+\s*w\s*2\s*=\s*(\d+(?:\.\d+)?)/gi;
    let ulushYigindisi;
    while ((ulushYigindisi = ulushYigindisiNaqsh.exec(matn)) !== null) {
      const berilgan = Number(ulushYigindisi[1]);
      const togri = yaqinmi(berilgan, 1, 0.005);
      tekshiruvlar.push({ turi: "massaviy_ulush", berilgan, kutilgan: 1, togri });
      if (!togri) {
        ogohlantirishlar.push({
          turi: "massaviy_ulush_xatosi", berilgan, kutilgan: 1,
          xabar: `Massaviy ulushlar yig'indisi w₁ + w₂ = 1 bo'lishi kerak.`,
        });
      }
    }

    const faradeyNaqsh = /m\s*=\s*(\d+(?:\.\d+)?)\s*[×*]\s*(\d+(?:\.\d+)?)\s*[×*]\s*(\d+(?:\.\d+)?)\s*[/÷]\s*\(?\s*(\d+(?:\.\d+)?)\s*[×*]\s*(?:F|96485)\s*\)?\s*=\s*(\d+(?:\.\d+)?)/gi;
    let faradey;
    while ((faradey = faradeyNaqsh.exec(matn)) !== null) {
      const [M, tok, vaqtSekund, elektronSoni, berilgan] = faradey.slice(1).map(Number);
      const kutilgan = faradeyHisobla({ molyarMassa: M, tok, vaqtSekund, elektronSoni })?.massa;
      if (kutilgan === undefined) continue;
      const togri = yaqinmi(berilgan, kutilgan, 0.01);
      tekshiruvlar.push({ turi: "faradey", M, tok, vaqtSekund, elektronSoni, berilgan, kutilgan, togri });
      if (!togri) ogohlantirishlar.push({
        turi: "faradey_xatosi", berilgan, kutilgan,
        xabar: `Faradey qonunida m = ${Number(kutilgan.toFixed(6))} g bo'ladi.`,
      });
    }

    const phNaqsh = /pH\s*=\s*-?\s*log(?:10)?\s*\(\s*(\d+(?:\.\d+)?(?:e[+-]?\d+)?)\s*\)\s*=\s*(\d+(?:\.\d+)?)/gi;
    let ph;
    while ((ph = phNaqsh.exec(matn)) !== null) {
      const vodorodIoni = Number(ph[1]);
      const berilgan = Number(ph[2]);
      const kutilgan = phHisobla({ vodorodIoni })?.pH;
      if (kutilgan === undefined) continue;
      const togri = yaqinmi(berilgan, kutilgan, 0.01);
      tekshiruvlar.push({ turi: "ph", vodorodIoni, berilgan, kutilgan, togri });
      if (!togri) ogohlantirishlar.push({
        turi: "ph_xatosi", berilgan, kutilgan,
        xabar: `pH = ${Number(kutilgan.toFixed(6))} bo'ladi.`,
      });
    }

    const ksNaqsh = /K(?:s|sp)\s*=\s*(\d+(?:\.\d+)?)\s*[×*]\s*\(\s*(\d+(?:\.\d+)?)\s*\)\s*\^\s*(\d+)\s*=\s*(\d+(?:\.\d+)?(?:e[+-]?\d+)?)/gi;
    let ks;
    while ((ks = ksNaqsh.exec(matn)) !== null) {
      const [birinchiIon, ikkinchiIon, daraja, berilgan] = ks.slice(1).map(Number);
      const kutilgan = eruvchanlikKopaytmasiHisobla({
        ionlar: [{ konsentratsiya: birinchiIon }, { konsentratsiya: ikkinchiIon, daraja }],
      })?.Ks;
      if (kutilgan === undefined) continue;
      const togri = judaKichikSonYaqinmi(berilgan, kutilgan, 0.01);
      tekshiruvlar.push({ turi: "ks", birinchiIon, ikkinchiIon, daraja, berilgan, kutilgan, togri });
      if (!togri) ogohlantirishlar.push({
        turi: "ks_xatosi", berilgan, kutilgan,
        xabar: `Ks = ${kutilgan.toExponential(6)} bo'ladi.`,
      });
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
  const aslMatn = String(matn || "");
  const tahlil = masalaMatniniTahlilQil(aslMatn);
  const dalillar = (tahlil.formulalar || [])
    .slice(0, 8)
    .map((formula) => ({ formula, molyarMassa: yaroqliMolyarMassa(formula) }))
    .filter((dalil) => dalil.molyarMassa !== null);
  const apparatlar = [];
  const apparatQatorlari = [];
  if (/(?:elektroliz|faradey|tok kuchi|elektrod)/i.test(aslMatn)) {
    apparatlar.push("faradey");
    apparatQatorlari.push("- Elektrolizda m = M × I × t / (n × F), F = 96485 C/mol; t sekundda va n elektronlar sonida olinadi.");
  }
  if (/(?:\bpH\b|vodorod ioni|gidroksid ioni|kislotalilik)/i.test(aslMatn)) {
    apparatlar.push("ph");
    apparatQatorlari.push("- 25 C da pH = -log10[H+], pOH = -log10[OH-], pH + pOH = 14.");
  }
  if (/(?:\bK[sS]\b|eruvchanlik ko'?paytmasi|eruvchanlik)/i.test(aslMatn)) {
    apparatlar.push("ks");
    apparatQatorlari.push("- Eruvchanlik ko'paytmasini faqat erkin ionlar orqali Ks = Π[ion]^koeffitsiyent tarzida yozing.");
  }
  if (/(?:tenglamalar sistemasi|noma'lumli|\bx\s*,\s*y(?:\s*,\s*z)?\b)/i.test(aslMatn)) {
    apparatlar.push("kramer");
    apparatQatorlari.push("- 2 yoki 3 noma'lumli sistemada koeffitsiyentlar matritsasi, D, Dx, Dy, Dz determinantlarini yozib, x = Dx/D kabi tekshiring.");
  }
  if (dalillar.length === 0 && apparatlar.length === 0) return { ishlatildi: false, dalillar: [], apparatlar: [], prompt: "" };

  const qatorlar = dalillar.map((dalil) => `- M(${dalil.formula}) = ${dalil.molyarMassa} g/mol`).join("\n");
  const dalilMatni = [qatorlar, ...apparatQatorlari].filter(Boolean).join("\n");
  return {
    ishlatildi: true,
    dalillar,
    apparatlar,
    prompt: `\n\n<server_hakami>\nQuyidagi qiymatlar va formulalar server tekshiruvining tayanchidir. Ularga zid hisob yozmang:\n${dalilMatni}\n</server_hakami>`,
  };
}
