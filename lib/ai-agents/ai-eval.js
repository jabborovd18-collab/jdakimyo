// Sifat tekshiruvi tashqi modelga pul sarflamasdan, kimyo dvigateli va formula
// quvurining o'zgarmas xususiyatlarini tekshiradi. Jonli provayder ko'rigi alohida.

import { prisma } from "../prisma";
import { latexniNormallashtir } from "../latex-oddiy-matn.js";
import { deterministikKontekstTuz, molyarMassaHisobla, pearsonKrestiHisobla } from "./deterministik-kimyo.js";

function yaqin(haqiqiy, kutilgan, farq = 0.01) {
  return Math.abs(Number(haqiqiy) - kutilgan) <= farq;
}

export async function aiSifatSinoviniIshgaTushir({ adminId = null, revision = 0 } = {}) {
  const boshlandi = Date.now();
  const holatlar = [
    { id: "molyar_h2o", bajar: () => yaqin(molyarMassaHisobla("H2O"), 18.015) },
    { id: "molyar_caoh2", bajar: () => yaqin(molyarMassaHisobla("Ca(OH)2"), 74.092) },
    { id: "pearson_40_10_20", bajar: () => pearsonKrestiHisobla({ w1: 40, w2: 10, wTarget: 20 })?.nisbat === "1 : 2" },
    {
      id: "formula_qatorlari",
      bajar: () => {
        const natija = latexniNormallashtir("$$a=1$$$$b=2$$");
        return natija.includes("\\begin{aligned}") && !natija.includes("$$$$");
      },
    },
    {
      id: "deterministik_kontekst",
      bajar: () => {
        const natija = deterministikKontekstTuz("H2O ning molyar massasini toping");
        return natija.ishlatildi && natija.dalillar.some((dalil) => dalil.formula === "H2O");
      },
    },
  ];

  const details = holatlar.map((holat) => {
    try { return { id: holat.id, otildi: Boolean(holat.bajar()) }; } catch (error) {
      return { id: holat.id, otildi: false, xato: String(error?.message || "Noma'lum xato").slice(0, 160) };
    }
  });
  const passed = details.filter((holat) => holat.otildi).length;
  const natija = {
    revision: Number(revision) || 0,
    totalCases: details.length,
    passed,
    failed: details.length - passed,
    durationMs: Date.now() - boshlandi,
    details,
  };
  await prisma.aiEvalRun.create({ data: { ...natija, adminId } });
  return natija;
}
