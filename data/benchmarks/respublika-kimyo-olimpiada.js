// Respublika kimyo olimpiadasi uslubidagi ochiq murakkab masalalar.
//
// Benchmarkda faqat savol va tekshiriladigan natija saqlanadi. Yechim namunasi
// modelga yuborilmaydi, aks holda sifat sinovi mustaqil bo'lmay qoladi.

export const RESPUBLIKA_KIMYO_OLIMPIADA_BENCHMARKLARI = Object.freeze([
  Object.freeze({
    id: "respublika_qotishma_magniy_mis",
    soha: "qotishma_va_stexiometriya",
    manba: "Respublika kimyo olimpiadasi uslubidagi qotishma masalasi",
    savol: "10.0 g Mg va Cu qotishmasi ortiqcha HCl bilan reaksiyaga kirishganda normal sharoitda 4.48 L H2 ajraldi. Qotishmadagi Mg va Cu massalarini toping. Aralashma massasi balansini tekshiring.",
    javobNaqsh: /(?:Mg[^\n]{0,80}(?:4[.,]8|4\.80)\s*g|(?:4[.,]8|4\.80)\s*g[^\n]{0,80}Mg).*?(?:Cu[^\n]{0,80}(?:5[.,]2|5\.20)\s*g|(?:5[.,]2|5\.20)\s*g[^\n]{0,80}Cu)/is,
    namunaNatija: Object.freeze({
      muvaffaqiyatli: true,
      turi: "yechim",
      yakuniyJavob: "m(Mg) = 4.8 g, m(Cu) = 5.2 g.",
      bosqichlar: Object.freeze([
        Object.freeze({ formula: "n(H2) = 4.48 / 22.4 = 0.2 mol; n(Mg) = 0.2 mol" }),
        Object.freeze({ formula: "m(Mg) = 0.2 × 24 = 4.8 g; m(Cu) = 10.0 - 4.8 = 5.2 g" }),
        Object.freeze({ formula: "m_umumiy = 4.8 + 5.2 = 10.0 g" }),
      ]),
    }),
  }),
  Object.freeze({
    id: "respublika_gaz_aralashmasi_yonish",
    soha: "gazlar_aralashmasi",
    manba: "Respublika kimyo olimpiadasi uslubidagi gazlar aralashmasi masalasi",
    savol: "Normal sharoitdagi 11.2 L CH4 va H2 aralashmasi to'liq yondirilganda 4.48 L CO2 hosil bo'ldi. Aralashmadagi gazlar hajmini va sarflangan O2 massasini toping.",
    javobNaqsh: /(?:CH4[^\n]{0,80}4[.,]48\s*L|4[.,]48\s*L[^\n]{0,80}CH4).*?(?:H2[^\n]{0,80}6[.,]72\s*L|6[.,]72\s*L[^\n]{0,80}H2).*?(?:17[.,]6\s*g)/is,
    namunaNatija: Object.freeze({
      muvaffaqiyatli: true,
      turi: "yechim",
      yakuniyJavob: "V(CH4) = 4.48 L, V(H2) = 6.72 L; m(O2) = 17.6 g.",
      bosqichlar: Object.freeze([
        Object.freeze({ formula: "x + y = 11.2 / 22.4 = 0.5; x = n(CO2) = 4.48 / 22.4 = 0.2" }),
        Object.freeze({ formula: "y = 0.5 - 0.2 = 0.3 mol; V(H2) = 0.3 × 22.4 = 6.72 L" }),
        Object.freeze({ formula: "n(O2) = 2x + 0.5y = 0.55 mol; m(O2) = 0.55 × 32 = 17.6 g" }),
      ]),
    }),
  }),
])
