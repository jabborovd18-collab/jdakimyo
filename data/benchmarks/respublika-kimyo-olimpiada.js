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
  Object.freeze({
    id: "xalqaro_elektroliz_mis",
    soha: "elektrokimyo_faradey",
    manba: "Mendeleev va IChO darajasidagi elektroliz uslubidagi masala",
    savol: "CuSO4 eritmasidan 2.00 A tok 965 s davomida o'tkazildi. Cu2+ + 2e- -> Cu deb olib, katodda ajralgan mis massasini toping (Ar(Cu) = 63.5).",
    javobNaqsh: /(?:Cu|mis)[^\n]{0,100}(?:0[.,]635\s*g)|(?:0[.,]635\s*g)[^\n]{0,100}(?:Cu|mis)/i,
    namunaNatija: Object.freeze({
      muvaffaqiyatli: true,
      turi: "yechim",
      yakuniyJavob: "Katodda 0.635 g Cu ajraladi.",
      bosqichlar: Object.freeze([
        Object.freeze({ formula: "m = 63.5 × 2 × 965 / (2 × F) = 0.635 g" }),
      ]),
    }),
  }),
  Object.freeze({
    id: "xalqaro_ph_kuchli_kislota",
    soha: "eritmalar_ph",
    manba: "Mendeleev va IChO darajasidagi eritma tahlili uslubidagi masala",
    savol: "25 C da 2.0 × 10^-3 mol/L HCl to'liq dissotsilangan deb oling. Eritmaning pH qiymatini toping.",
    javobNaqsh: /pH[^\n]{0,40}(?:2[.,]70|2[.,]7)/i,
    namunaNatija: Object.freeze({
      muvaffaqiyatli: true,
      turi: "yechim",
      yakuniyJavob: "pH = 2.70.",
      bosqichlar: Object.freeze([
        Object.freeze({ formula: "pH = -log(0.002) = 2.699" }),
      ]),
    }),
  }),
  Object.freeze({
    id: "xalqaro_ks_kalsiy_florid",
    soha: "eruvchanlik_kopaytmasi",
    manba: "Mendeleev va IChO darajasidagi cho'kma muvozanati uslubidagi masala",
    savol: "CaF2 ning to'yingan eritmasida [Ca2+] = 1.0 × 10^-3 mol/L va [F-] = 2.0 × 10^-3 mol/L. Ks(CaF2) ni hisoblang.",
    javobNaqsh: /(?:Ks|Ksp)[^\n]{0,80}(?:4[.,]0?\s*[×x*]\s*10\s*(?:\^|-)?\s*9|4e-?9)/i,
    namunaNatija: Object.freeze({
      muvaffaqiyatli: true,
      turi: "yechim",
      yakuniyJavob: "Ks(CaF2) = 4.0 × 10^-9.",
      bosqichlar: Object.freeze([
        Object.freeze({ formula: "Ks = 0.001 × (0.002)^2 = 4e-9" }),
      ]),
    }),
  }),
  Object.freeze({
    id: "xalqaro_kristallogidrat_cuso4",
    soha: "kristallogidrat",
    manba: "Mendeleev va IChO darajasidagi kristallogidrat uslubidagi masala",
    savol: "25.0 g CuSO4·xH2O qizdirilganda 9.0 g suv yo'qotib, 16.0 g suvsiz CuSO4 qoldi. Ar(Cu)=63.5, Ar(S)=32, Ar(O)=16. Kristallogidratdagi x ni toping.",
    javobNaqsh: /(?:CuSO4[^\n]{0,80}[·.]\s*5H2O|x\s*=\s*5)/i,
    namunaNatija: Object.freeze({
      muvaffaqiyatli: true,
      turi: "yechim",
      yakuniyJavob: "Tuz CuSO4·5H2O, ya'ni x = 5.",
      bosqichlar: Object.freeze([
        Object.freeze({ formula: "n(H2O) = 9 / 18 = 0.5 mol; n(CuSO4) = 16 / 159.5 = 0.1 mol" }),
        Object.freeze({ formula: "x = 0.5 / 0.1 = 5" }),
      ]),
    }),
  }),
  Object.freeze({
    id: "xalqaro_uch_gazli_aralashma",
    soha: "uch_nomalumli_gaz_aralashmasi",
    manba: "Mendeleev va IChO darajasidagi ko'p bosqichli gaz aralashmasi uslubidagi masala",
    savol: "CO, H2 va CH4 dan iborat aralashma jami 1.00 mol. To'liq yondirishdan 0.500 mol CO2 hosil bo'ldi va 0.875 mol O2 sarflandi. Har bir gazning modda miqdorini toping.",
    javobNaqsh: /(?:CO[^\n]{0,80}0[.,]25|0[.,]25[^\n]{0,80}CO).*?(?:H2[^\n]{0,80}0[.,]5|0[.,]5[^\n]{0,80}H2).*?(?:CH4[^\n]{0,80}0[.,]25|0[.,]25[^\n]{0,80}CH4)/is,
    namunaNatija: Object.freeze({
      muvaffaqiyatli: true,
      turi: "yechim",
      yakuniyJavob: "n(CO) = 0.25 mol, n(H2) = 0.50 mol, n(CH4) = 0.25 mol.",
      bosqichlar: Object.freeze([
        Object.freeze({ formula: "x + y + z = 1; x + z = 0.5; 0.5x + 0.5y + 2z = 0.875" }),
        Object.freeze({ formula: "D = 1.5; Dx = 0.375; Dy = 0.75; Dz = 0.375" }),
        Object.freeze({ formula: "x = 0.375 / 1.5 = 0.25; y = 0.75 / 1.5 = 0.5; z = 0.375 / 1.5 = 0.25" }),
      ]),
    }),
  }),
  Object.freeze({
    id: "dtm_organik_yonish_glyukoza",
    soha: "organik_yonish_tahlili",
    manba: "DTM va IChO uslubidagi organik yonish tahlili",
    savol: "1.80 g noma'lum organik modda to'liq yonganda 2.64 g CO2 va 1.08 g H2O hosil bo'ldi. M = 180 g/mol. Moddaning molekulyar formulasini toping.",
    javobNaqsh: /C6H12O6/i,
    namunaNatija: Object.freeze({
      muvaffaqiyatli: true,
      turi: "yechim",
      yakuniyJavob: "Moddaning molekulyar formulasi C6H12O6.",
      bosqichlar: Object.freeze([
        Object.freeze({ formula: "Yonish tahlili va M = 180 g/mol dan molekulyar formula C6H12O6." }),
      ]),
    }),
  }),
  Object.freeze({
    id: "dtm_asetat_bufer_ph",
    soha: "bufer_eritma",
    manba: "DTM va IChO uslubidagi asetat buferi",
    savol: "pKa = 4.76, C(kislota) = 0.10 mol/L va C(tuz) = 0.20 mol/L bo'lgan asetat buferining pH ini toping.",
    javobNaqsh: /pH\s*=\s*5[.,]06/i,
    namunaNatija: Object.freeze({
      muvaffaqiyatli: true,
      turi: "yechim",
      yakuniyJavob: "pH = 5.06.",
      bosqichlar: Object.freeze([
        Object.freeze({ formula: "pH = 4.76 + log(0.20 / 0.10) = 5.061." }),
      ]),
    }),
  }),
  Object.freeze({
    id: "dtm_pearson_kislota_suyultirish",
    soha: "pearson_kresti",
    manba: "DTM uslubidagi Pearson kresti bilan eritma tayyorlash",
    savol: "40% va 10% li HCl eritmalaridan 20% li HCl tayyorlash uchun eritmalar nisbatini Pearson kresti bilan toping.",
    javobNaqsh: /(?:40%\s*li\s*:\s*10%\s*li|1\s*:\s*2)/i,
    namunaNatija: Object.freeze({
      muvaffaqiyatli: true,
      turi: "yechim",
      yakuniyJavob: "40% li eritma : 10% li eritma = 1 : 2.",
      bosqichlar: Object.freeze([
        Object.freeze({ formula: "Pearson farqlari: 20 - 10 = 10 va 40 - 20 = 20; nisbat 10 : 20 = 1 : 2." }),
      ]),
    }),
  }),
])
