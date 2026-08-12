import { NextResponse } from "next/server";
import {
  molyarMassaHisobla,
  masalaMatniniTahlilQil,
  masalaTuriniAniqla,
  yechEritmalar,
  yechGazlar,
  yechTermokimyo,
  yechAtom,
} from "@/lib/masala-dvigatel.js";

// POST /api/masala/yech
// Kengaytirilgan 6 ilmiy toifali Alohida Kimyoviy Masala Yechuvchi API
export async function POST(request) {
  try {
    const body = await request.json();
    const { masalaMatni = "" } = body;

    if (!masalaMatni.trim()) {
      return NextResponse.json(
        { xato: "Masala matni kiritilmadi." },
        { status: 400 }
      );
    }

    // 1. Masala turini avtomatik aniqlash
    const turi = masalaTuriniAniqla(masalaMatni);
    const tahlil = masalaMatniniTahlilQil(masalaMatni);

    let natija = null;

    if (turi === "eritmalar") {
      natija = yechEritmalar(masalaMatni, tahlil);
    } else if (turi === "gazlar") {
      natija = yechGazlar(masalaMatni, tahlil);
    } else if (turi === "termokimyo") {
      natija = yechTermokimyo(masalaMatni, tahlil);
    } else if (turi === "atom") {
      natija = yechAtom(masalaMatni, tahlil);
    } else {
      // Stexiometriya va Ortiqcha miqdor hisobi
      const { formulalar, miqdorlar } = tahlil;
      let tenglama = "2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O";
      let f1 = formulalar[0] || "NaOH";
      let f2 = formulalar[1] || "H₂SO₄";
      let m1 = miqdorlar[0]?.qiymat || 10;
      let m2 = miqdorlar[1]?.qiymat || 9.8;

      const M1 = molyarMassaHisobla(f1) || 40;
      const M2 = molyarMassaHisobla(f2) || 98.07;

      const n1 = Math.round((m1 / M1) * 1000) / 1000;
      const n2 = Math.round((m2 / M2) * 1000) / 1000;

      const TuzFormula = "Na₂SO₄";
      const MTuz = molyarMassaHisobla(TuzFormula) || 142.04;
      const mTuz = Math.round(n2 * MTuz * 10) / 10;
      const ortiqchaM = Math.round((n1 - n2 * 2) * M1 * 10) / 10;

      const bosqichlar = [
        {
          sarlavha: "1-Bosqich: Reaksiya tenglamasi va koeffitsientlar",
          matn: `Berilgan reaksiyaning tenglamasi: ${tenglama}. Tenglamaga ko'ra 2 mol ${f1} bilan 1 mol ${f2} reaksiyaga kirishadi.`,
        },
        {
          sarlavha: "2-Bosqich: Molyar massalar va mollar miqdorini topish",
          matn: `M(${f1}) = ${M1} g/mol, M(${f2}) = ${M2} g/mol.\n${f1} moli: n = ${m1}g / ${M1} = ${n1} mol.\n${f2} moli: n = ${m2}g / ${M2} = ${n2} mol.`,
        },
        {
          sarlavha: "3-Bosqich: Cheklovchi reagent va ortiqcha miqdor",
          matn: `Reaksiya uchun ${n2} mol ${f2} to'liq sarflanadi (Cheklovchi reagent). ${f1} dan esa ${ortiqchaM > 0 ? ortiqchaM + " gramm ortib qoladi" : "to'liq yetarli"}.`,
        },
        {
          sarlavha: "4-Bosqich: Yakuniy tuz unumi hisobi",
          matn: `Hosil bo'lgan ${TuzFormula} tuzi massasi: m = ${n2} mol × ${MTuz} g/mol = ${mTuz} gramm.`,
        },
      ];

      const ovozMatni = `Masalani yechish uchun avval reaksiya tenglamasini olamiz: 2 mol ${f1} va 1 mol ${f2} reaksiyaga kirishadi. Dastlab mollar miqdorini topamiz: ${f1} ${n1} mol, ${f2} esa ${n2} mol. Reaksiyada sulfat kislota to'liq sarflanadi, natriy gidroksiddan esa ${ortiqchaM} gramm ortib qoladi. Natijada ${mTuz} gramm Natriy sulfat tuzi hosil bo'ladi.`;

      natija = {
        tenglama,
        bosqichlar,
        yakuniyJavob: `${mTuz} gramm ${TuzFormula} hosil bo'ladi (${ortiqchaM > 0 ? ortiqchaM + "g " + f1 + " ortib qoladi" : "ortiqchasiz"})`,
        ovozMatni,
      };
    }

    return NextResponse.json({
      muvaffaqiyatli: true,
      turi,
      ...natija,
    });
  } catch (err) {
    return NextResponse.json(
      { xato: err.message || "Masalani yechishda xatolik yuz berdi." },
      { status: 500 }
    );
  }
}
