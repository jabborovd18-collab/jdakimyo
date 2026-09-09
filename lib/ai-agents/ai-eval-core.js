// Sifat hisobini Prisma yozuvidan ajratamiz: admin natijasi testda ham aynan
// shu quvurdan o'tadi, bazaga yozish esa alohida tashqi yon ta'sir bo'lib qoladi.

import { latexniNormallashtir } from "../latex-oddiy-matn.js";
import { deterministikKontekstTuz, molyarMassaHisobla, pearsonKrestiHisobla } from "./deterministik-kimyo.js";
import { aiKimyoBenchmarkiniBajar, KENGAYTIRILGAN_KIMYO_BENCHMARKLARI } from "./ai-kimyo-benchmark.js";

function yaqin(haqiqiy, kutilgan, farq = 0.01) {
  return Math.abs(Number(haqiqiy) - kutilgan) <= farq;
}

/** Admin sifat sinovining bazaga bog'lanmagan, to'liq hisoblash qismi. */
export async function aiSifatNatijasiniHisobla({ revision = 0, javobBeruvchi = null } = {}) {
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
  const benchmark = await aiKimyoBenchmarkiniBajar({
    javobBeruvchi,
    benchmarklar: KENGAYTIRILGAN_KIMYO_BENCHMARKLARI,
  });
  details.push(...benchmark.details.map((detail) => ({ ...detail, id: `benchmark:${detail.id}` })));
  const passed = details.filter((holat) => holat.otildi).length;
  return {
    revision: Number(revision) || 0,
    totalCases: details.length,
    passed,
    failed: details.length - passed,
    details,
  };
}
