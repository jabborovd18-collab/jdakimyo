// lib/doska-mavzular.js
//
// Smart Doska — Kolloid kimyo va sirt hodisalari bo'yicha chuqur ilmiy baza.
// 5 ta fundamental ilmiy laboratoriya moduli:
// 1. Lengmyur va Hanes-Woolf chiziqli regressiyasi
// 2. Freyndlix va logarifmik regressiya
// 3. BET ko'p qatlamli modeli va N2 (77K) solishtirma sirti
// 4. Gibbs adsorbsiya tenglamasi va Shishkovskiy sirt tarangligi
// 5. Kelvin tenglamasi va kapillyar kondensatsiya (gisterezis)

export const DOSKA_MAVZULARI = [
  {
    id: "sirt-hodisalari-adsorbsiya",
    nomi: "Sirt hodisalari va Adsorbsiya izotermalari",
    qisqa: "Lengmyur, Freyndlix, BET, Gibbs, Kelvin va Traube modellari. Tajriba jadvallari, chiziqli regressiya va mikroskopik animatsiyalar.",
    oqituvchi: "Halimbek Murodullayev (@halim_06)",
    oqituvchiUsername: "halim_06",
    oqituvchiUserId: "859235349",
    fan: "Kolloid kimyo / Fizikaviy kimyo",
    daraja: "Oliy ta'lim / Magistratura / Litsey",
    slaydlarSoni: 40,
    savollarSoni: 80,
    holat: "faol",
    teglar: ["Lengmyur", "Freyndlix", "BET", "Gibbs", "Kelvin", "Traube", "Regressiya"],
    rang: "emerald",
    chuqurModullar: [
      {
        id: "lengmyur-regressiya",
        nomi: "Lengmyur modeli va Monomolekulyar qavat",
        belgi: "θ = (K·C)/(1 + K·C),   a = (a_m·K·C)/(1 + K·C)",
        formulaLatex: "\\theta = \\frac{K \\cdot C}{1 + K \\cdot C}, \\qquad a = \\frac{a_m \\cdot K \\cdot C_e}{1 + K \\cdot C_e}",
        chiziqliFormulaLatex: "\\frac{C_e}{a} = \\frac{1}{a_m \\cdot K} + \\frac{C_e}{a_m}",
        tavsif: "Energetik bir jinsli sirtda monomolekulyar adsorbsiya. Faol markazlar to'lgach plato (a_m) ga erishiladi.",
        belgilar: [
          { belgi: "\\theta", nom: "Sirtning qoplanish darajasi", birlik: "0..1 (0%..100%)", izoh: "Faol markazlarning molekulalar bilan bandlik ulushi" },
          { belgi: "a", nom: "Adsorbsiya miqdori", birlik: "mmol/g", izoh: "1 gramm adsorbent yuzasiga birikkan modda miqdori" },
          { belgi: "a_m", nom: "Maksimal monoqavat sig'imi", birlik: "mmol/g", izoh: "Barcha faol markazlar to'lgandagi chegaraviy plato" },
          { belgi: "K", nom: "Lengmyur doimiysi (Affinitet)", birlik: "L/mmol", izoh: "Adsorbent va adsorbatning o'zaro tortishish kuchi" },
          { belgi: "C_e", nom: "Muvozanat konsentratsiyasi", birlik: "mmol/L", izoh: "Eritmadagi erkin qolgan modda konsentratsiyasi" },
        ],
        farazlar: [
          "Adsorbent sirtidagi barcha faol markazlar energetik jihatdan teng kuchli.",
          "Har bir faol markaz faqat bitta adsorbat molekulasini tuta oladi (monoqavat).",
          "Adsorbsiyalangan molekulalar o'rtasida yonlama o'zaro ta'sir hisobga olinmaydi.",
          "Adsorbsiya va desorbsiya tezliklari tenglashganda dinamik muvozanat qaror topadi.",
        ],
        tajribaNamunasi: [
          { ce: 0.5, a: 2.1 },
          { ce: 1.0, a: 3.8 },
          { ce: 2.0, a: 5.6 },
          { ce: 4.0, a: 7.2 },
          { ce: 8.0, a: 8.7 },
          { ce: 12.0, a: 9.3 },
        ],
        xNomi: "Muvozanat konsentratsiyasi (C_e)",
        xBirlik: "mmol/L",
        yNomi: "Adsorbsiya miqdori (a)",
        yBirlik: "mmol/g",
        regressiyaX: (ce) => ce,
        regressiyaY: (ce, a) => (a > 0 ? ce / a : 0),
        regressiyaXNomi: "C_e",
        regressiyaYNomi: "C_e / a",
        doimiylarniTop: (qiyalik, kesim) => {
          const am = qiyalik > 0 ? 1 / qiyalik : 0;
          const k = am > 0 && kesim > 0 ? 1 / (am * kesim) : 0;
          return [
            { nom: "Maksimal monoqavat sig'imi (a_m)", qiymat: am, birlik: "mmol/g", izoh: "a_m = 1 / qiyalik" },
            { nom: "Lengmyur adsorbsiya doimiysi (K)", qiymat: k, birlik: "L/mmol", izoh: "K = 1 / (a_m · kesim)" },
          ];
        },
      },
      {
        id: "freyndlix-regressiya",
        nomi: "Freyndlix modeli va Geterogen sirt adsorbsiyasi",
        belgi: "a = K_F · C^(1/n),   lg a = lg K_F + (1/n) · lg C",
        formulaLatex: "a = K_F \\cdot C_e^{1/n}, \\qquad \\lg a = \\lg K_F + \\frac{1}{n} \\lg C_e",
        tavsif: "Energetik jihatdan bir jinsli bo'lmagan (geterogen) sirtlarda adsorbsiya. Avval chuqur faol markazlar to'ladi.",
        belgilar: [
          { belgi: "a", nom: "Adsorbsiya miqdori", birlik: "mmol/g", izoh: "Adsorbent yuzasiga birikkan modda miqdori" },
          { belgi: "K_F", nom: "Freyndlix sig'im doimiysi", birlik: "shartli", izoh: "Adsorbentning shartli adsorbsion quvvati" },
          { belgi: "C_e", nom: "Muvozanat konsentratsiyasi", birlik: "mmol/L", izoh: "Eritmadagi erkin modda konsentratsiyasi" },
          { belgi: "1/n", nom: "Geterogenlik ko'rsatkichi", birlik: "0..1 (o'lchovsiz)", izoh: "Sirt nobirjinsliligi (0.1..0.5 oralig'ida qulay adsorbsiya)" },
          { belgi: "n", nom: "Adsorbsiya intensivligi", birlik: "n > 1", izoh: "Jarayonning o'z-o'zidan borish layoqati" },
        ],
        farazlar: [
          "Adsorbent sirtidagi markazlar turli adsorbsiya energiyasiga ega (eksponentsial taqsimot).",
          "Avval eng chuqur/kuchli faol markazlar to'ladi, so'ngra kuchsizroq markazlar.",
          "Model chegaraviy to'yinish platosiga (a_m) ega emas, o'rta konsentratsiyalarda yaxshi ishlaydi.",
        ],
        tajribaNamunasi: [
          { ce: 0.5, a: 1.8 },
          { ce: 1.0, a: 2.7 },
          { ce: 2.0, a: 3.9 },
          { ce: 4.0, a: 5.6 },
          { ce: 8.0, a: 7.9 },
          { ce: 12.0, a: 9.8 },
        ],
        xNomi: "Muvozanat konsentratsiyasi (C_e)",
        xBirlik: "mmol/L",
        yNomi: "Adsorbsiya miqdori (a)",
        yBirlik: "mmol/g",
        regressiyaX: (ce) => Math.log10(Math.max(0.001, ce)),
        regressiyaY: (ce, a) => Math.log10(Math.max(0.001, a)),
        regressiyaXNomi: "lg C_e",
        regressiyaYNomi: "lg a",
        doimiylarniTop: (qiyalik, kesim) => {
          const birBoluvN = qiyalik;
          const n = birBoluvN > 0 ? 1 / birBoluvN : 0;
          const kf = Math.pow(10, kesim);
          return [
            { nom: "Freyndlix sig'im doimiysi (K_F)", qiymat: kf, birlik: "shartli", izoh: "K_F = 10^kesim" },
            { nom: "Adsorbsiya intensivligi (1/n)", qiymat: birBoluvN, birlik: "0..1", izoh: "1/n = qiyalik (0.1..0.5 qulay adsorbsiya)" },
            { nom: "Geterogenlik koeffitsiyenti (n)", qiymat: n, birlik: "o'lchovsiz", izoh: "n > 1 jarayon o'z-o'zidan boradi" },
          ];
        },
      },
      {
        id: "bet-modeli",
        nomi: "BET modeli va Solishtirma Sirt (S_BET)",
        belgi: "p / [a(p₀−p)] = 1/(a_m·C) + [(C−1)/(a_m·C)]·(p/p₀)",
        formulaLatex: "\\frac{p}{a(p_0 - p)} = \\frac{1}{a_m \\cdot C_{\\text{BET}}} + \\frac{C_{\\text{BET}} - 1}{a_m \\cdot C_{\\text{BET}}} \\left(\\frac{p}{p_0}\\right)",
        tavsif: "Ko'p qatlamli fizik adsorbsiya. N₂ (77 K) gazi orqali nanog'ovak adsorbentlarning haqiqiy solishtirma sirtini (S_BET) aniqlash.",
        belgilar: [
          { belgi: "p / p_0", nom: "Nisbiy bug' bosimi", birlik: "0..1 (o'lchovsiz)", izoh: "Gaz bosimining to'yingan bug' bosimiga nisbati" },
          { belgi: "a", nom: "Jami yutilgan gaz", birlik: "mmol/g", izoh: "Ko'p qatlamli kondensatsiyalangan gaz miqdori" },
          { belgi: "a_m", nom: "1-monoqavat sig'imi", birlik: "mmol/g", izoh: "Sirt to'liq bitta molekula qatlami bilan qoplangandagi miqdor" },
          { belgi: "C_{\\text{BET}}", nom: "BET energetik doimiysi", birlik: "o'lchovsiz", izoh: "1-qatlam va keyingi qatlamlar adsorbsiya issiqligi farqi" },
          { belgi: "S_{\\text{BET}}", nom: "Haqiqiy solishtirma sirt", birlik: "m²/g", izoh: "S_BET = a_m · N_A · ω (N₂ = 0.162 nm² standarti)" },
        ],
        farazlar: [
          "Fizik adsorbsiyada birinchi monoqavat ustida keyingi 2-, 3-, n-qavatlar hosil bo'ladi.",
          "Ikkinchi va keyingi qatlamlarning adsorbsiya issiqligi gazning kondensatsiya issiqligiga teng.",
          "Chiziqli oraliq odatda 0.05 < p/p0 < 0.35 oralig'ida aniq bajariladi.",
        ],
        tajribaNamunasi: [
          { pNisbiy: 0.05, a: 1.15 },
          { pNisbiy: 0.10, a: 1.48 },
          { pNisbiy: 0.15, a: 1.76 },
          { pNisbiy: 0.20, a: 2.05 },
          { pNisbiy: 0.25, a: 2.38 },
          { pNisbiy: 0.30, a: 2.75 },
        ],
        xNomi: "Nisbiy bosim (p / p₀)",
        xBirlik: "0..1",
        yNomi: "Adsorbsiya miqdori (a)",
        yBirlik: "mmol/g",
        regressiyaX: (p) => p,
        regressiyaY: (p, a) => (a * (1 - p) > 0 ? p / (a * (1 - p)) : 0),
        regressiyaXNomi: "p / p₀",
        regressiyaYNomi: "p / [a(p₀ - p)]",
        doimiylarniTop: (qiyalik, kesim) => {
          const yigindi = qiyalik + kesim;
          const am = yigindi > 0 ? 1 / yigindi : 0; // mmol/g
          const cBet = kesim > 0 ? 1 + qiyalik / kesim : 0;
          const sBet = am * 97.556;
          return [
            { nom: "Monoqavat sig'imi (a_m)", qiymat: am, birlik: "mmol/g", izoh: "a_m = 1 / (qiyalik + kesim)" },
            { nom: "BET doimiysi (C_BET)", qiymat: cBet, birlik: "o'lchovsiz", izoh: "C = 1 + qiyalik / kesim" },
            { nom: "Haqiqiy solishtirma sirt (S_BET)", qiymat: sBet, birlik: "m²/g", izoh: "S_BET = a_m · N_A · ω (N₂ = 0.162 nm²)" },
          ];
        },
      },
      {
        id: "gibbs-sirt-taranglik",
        nomi: "Gibbs Adsorbsiya Tenglamasi va Sirt Taranglik",
        belgi: "Γ = −(C / RT) · (dσ / dC),   σ = σ₀ − B · ln(1 + A·C)",
        formulaLatex: "\\Gamma = -\\frac{C}{R \\cdot T} \\left(\\frac{d\\sigma}{dC}\\right), \\qquad \\sigma = \\sigma_0 - B \\ln(1 + A \\cdot C)",
        tavsif: "Sirt faol moddalar (SFM) suv sirtida to'planib, sirt taranglikni pasaytirishi va sirt ortiqchaligini (Γ) aniqlash.",
        belgilar: [
          { belgi: "\\Gamma", nom: "Sirt ortiqchaligi (adsorbsiya)", birlik: "µmol/m²", izoh: "Suv sirtida to'plangan SFM molekulalari ortiqchaligi" },
          { belgi: "\\sigma", nom: "Sirt taranglik", birlik: "mN/m", izoh: "Suyuqlik sirtining qisqarishga intiluvchi taranglik kuchi" },
          { belgi: "\\sigma_0", nom: "Toza suv sirt tarangligi", birlik: "72.8 mN/m", izoh: "298 K dagi toza distillangan suv qiymati" },
          { belgi: "C", nom: "SFM konsentratsiyasi", birlik: "mol/L", izoh: "Eritmadagi sovun/spirt konsentratsiyasi" },
          { belgi: "s_0", nom: "Bitta molekula maydoni", birlik: "nm²", izoh: "Zich monoqavatda bitta molekula egallagan ko'ndalang yuzasi" },
        ],
        farazlar: [
          "Suvga SFM (sovun, spirt) qo'shilganda dσ/dC < 0 bo'ladi, natijada sirt ortiqchaligi musbat (Γ > 0).",
          "Shishkovskiy empirik qonuni: σ = σ₀ − B · ln(1 + A · C).",
          "Maksimal to'yinishda sirtda zich joylashgan vertikal monomolekulyar qatlam hosil bo'ladi.",
        ],
        tajribaNamunasi: [
          { c: 0.001, sigma: 68.2 },
          { c: 0.005, sigma: 58.4 },
          { c: 0.010, sigma: 51.5 },
          { c: 0.020, sigma: 43.8 },
          { c: 0.050, sigma: 34.2 },
          { c: 0.100, sigma: 28.5 },
        ],
        xNomi: "SFM konsentratsiyasi (C)",
        xBirlik: "mol/L",
        yNomi: "Sirt taranglik (σ)",
        yBirlik: "mN/m",
        regressiyaX: (c) => Math.log(1 + 65 * Math.max(0, c)),
        regressiyaY: (c, sigma) => Math.max(0, 72.8 - sigma),
        regressiyaXNomi: "ln(1 + A·C)",
        regressiyaYNomi: "Δσ = σ₀ − σ",
        doimiylarniTop: (qiyalik) => {
          const B = Math.max(0, qiyalik);
          const gammaMax = ((B * 1e-3) / (8.314 * 298)) * 1e6;
          const s0 = gammaMax > 0 ? (1 / (gammaMax * 1e-6 * 6.022e23)) * 1e18 : 0;
          return [
            { nom: "Shishkovskiy doimiysi (B)", qiymat: B, birlik: "mN/m", izoh: "B = qiyalik (B = RT·Γ_∞)" },
            { nom: "Chegaraviy sirt ortiqchaligi (Γ_∞)", qiymat: gammaMax, birlik: "µmol/m²", izoh: "Γ_∞ = B / (RT)" },
            { nom: "Zich monoqavatdagi molekula maydoni (s₀)", qiymat: s0, birlik: "nm²", izoh: "s₀ = 1 / (Γ_∞ · N_A)" },
          ];
        },
        hisobla: (C, T = 298) => {
          const R = 8.314;
          const B = 14.5e-3;
          const A = 65;
          const sigma = 72.8 - B * 1000 * Math.log(1 + A * C);
          const hosila = -(B * A) / (1 + A * C);
          const gamma = -((C / (R * T)) * hosila);
          const gammaMkmol = gamma * 1e6;
          const s0 = gamma > 0 ? (1 / (gamma * 6.022e23)) * 1e18 : 0;
          return { sigma, gammaMkmol, s0 };
        },
      },
      {
        id: "kelvin-kapillyar",
        nomi: "Kelvin Tenglamasi va Kapillyar Kondensatsiya",
        belgi: "ln(p/p₀) = −(2σ·V_m) / (r·R·T) · cos θ",
        formulaLatex: "\\ln\\left(\\frac{p}{p_0}\\right) = -\\frac{2 \\sigma V_m}{r R T} \\cos\\theta",
        tavsif: "Mezog'ovaklarda (2–50 nm) kapillyar kondensatsiya va desorbsiya gisterezis halqasi (IUPAC IV turdagi izoterma).",
        belgilar: [
          { belgi: "p / p_0", nom: "Kondensatsiya nisbiy bosimi", birlik: "0..1", izoh: "G'ovak ichida suyuqlik to'ladigan to'yingan bug' bosimi" },
          { belgi: "r", nom: "G'ovak radiusi", birlik: "nm", izoh: "Mezog'ovakning ko'ndalang radiusi (2..50 nm oralig'ida)" },
          { belgi: "\\sigma", nom: "Suyuqlik sirt tarangligi", birlik: "mN/m", izoh: "Kondensatsiyalangan suyuqlikning sirt tarangligi (suv: 72.8 mN/m)" },
          { belgi: "V_m", nom: "Molyar hajm", birlik: "m³/mol", izoh: "Suv uchun 18 sm³/mol = 18×10⁻⁶ m³/mol" },
          { belgi: "\\theta", nom: "Ho'llash burchagi", birlik: "gradus", izoh: "To'liq ho'llashda cos θ ≈ 1" },
        ],
        farazlar: [
          "Botiq menisk ustidagi to'yingan bug' bosimi tekis sirt ustidagiga nisbatan past bo'ladi.",
          "G'ovak radiusi r qancha kichik bo'lsa, kondensatsiya shuncha past bosimda yuz beradi.",
          "Adsorbsiyada menisk silindrsimon, desorbsiyada esa yarimsferik bo'lgani sababli gisterezis halqasi yuzaga keladi.",
        ],
        tajribaNamunasi: [
          { r: 2.0, pNisbiy: 0.589 },
          { r: 3.0, pNisbiy: 0.703 },
          { r: 4.0, pNisbiy: 0.768 },
          { r: 6.0, pNisbiy: 0.838 },
          { r: 8.0, pNisbiy: 0.876 },
          { r: 12.0, pNisbiy: 0.916 },
          { r: 16.0, pNisbiy: 0.936 },
        ],
        xNomi: "G'ovak radiusi (r)",
        xBirlik: "nm",
        yNomi: "Kondensatsiya nisbiy bosimi (p / p₀)",
        yBirlik: "0..1",
        regressiyaX: (r) => (r > 0 ? 1 / r : 0),
        regressiyaY: (r, p) => (p > 0 ? Math.log(p) : 0),
        regressiyaXNomi: "1 / r",
        regressiyaYNomi: "ln(p / p₀)",
        doimiylarniTop: (qiyalik) => {
          const kKelvin = -qiyalik;
          const sigmaCalc = ((kKelvin * 1e-9 * 8.314 * 298) / (2 * 18e-6)) * 1000;
          return [
            { nom: "Kelvin kapillyar doimiysi (k_K)", qiymat: kKelvin, birlik: "nm", izoh: "k_K = −qiyalik = 2σ·V_m / (RT)" },
            { nom: "Hisoblangan sirt taranglik (σ)", qiymat: sigmaCalc, birlik: "mN/m", izoh: "σ = k_K · R·T / (2·V_m)" },
          ];
        },
        parametrlar: [
          { kalit: "r", nom: "G'ovak radiusi (r)", birlik: "nm", min: 1, max: 25, standart: 4, qadam: 0.5 },
          { kalit: "T", nom: "Harorat (T)", birlik: "K", min: 273, max: 373, standart: 298, qadam: 5 },
        ],
        hisobla: (rNm, T = 298) => {
          const R = 8.314;
          const sigma = 72.8e-3;
          const Vm = 18e-6;
          const rMetr = rNm * 1e-9;
          const lnNisbiy = -((2 * sigma * Vm) / (rMetr * R * T));
          const pNisbiy = Math.exp(lnNisbiy);
          return { pNisbiy: Math.min(1, Math.max(0.01, pNisbiy)) };
        },
      },
      {
        id: "termodinamika-izosterik",
        nomi: "Adsorbsiya Termodinamikasi va Izosterik Issiqlik",
        belgi: "q_st = R · [T₁T₂/(T₂−T₁)] · ln(p₂/p₁),   ΔH = −q_st",
        formulaLatex: "q_{st} = R \\frac{T_1 T_2}{T_2 - T_1} \\ln\\left(\\frac{p_2}{p_1}\\right), \\qquad \\Delta H = -q_{st}, \\qquad \\Delta G = \\Delta H - T \\Delta S",
        tavsif: "Adsorbsiya issiqligi (ekzotermik ΔH < 0), erkin energiya va entropiya. Klapeiron-Klauzius analogi orqali q_st hisoblash.",
        belgilar: [
          { belgi: "q_{st}", nom: "Izosterik adsorbsiya issiqligi", birlik: "kJ/mol", izoh: "Adsorbsiya paytida ajraladigan issiqlik (har doim q_st > 0)" },
          { belgi: "\\Delta H", nom: "Adsorbsiya entalpiyasi", birlik: "kJ/mol", izoh: "Fizik adsorbsiya ekzotermik (ΔH = -q_st < 0)" },
          { belgi: "T_1, T_2", nom: "Izotermalar harorati", birlik: "K", izoh: "Solishtirilayotgan pastki va yuqori haroratlar" },
          { belgi: "p_1, p_2", nom: "Muvozanat bosimlari", birlik: "kPa", izoh: "Bir xil adsorbsiya qoplami (a) dagi gaz bosimlari" },
          { belgi: "\\Delta S", nom: "Entropiya o'zgarishi", birlik: "J/(mol·K)", izoh: "Gaz tartibliligi oshishi hisobiga entropiya kamayadi (ΔS < 0)" },
        ],
        farazlar: [
          "Fizikaviy adsorbsiya har doim ekzotermik jarayon (ΔH < 0, q_st > 0).",
          "Gaz molekulalari sirtga tushganda erkinlik darajalarini yo'qotadi (entropiya kamayishi, ΔS < 0).",
          "O'z-o'zidan boruvchi adsorbsiya uchun Gibbs erkin energiyasi manfiy bo'lishi shart (ΔG = ΔH - TΔS < 0).",
          "Harorat ko'tarilishi bilan adsorbsiya muvozanati desorbsiya tomon siljiydi (Le Shatelye printsipi).",
        ],
        tajribaNamunasi: [
          { tK: 273, p: 12.4 },
          { tK: 283, p: 20.0 },
          { tK: 293, p: 31.2 },
          { tK: 303, p: 47.3 },
          { tK: 313, p: 69.8 },
        ],
        xNomi: "Harorat (T)",
        xBirlik: "K",
        yNomi: "Muvozanat bosimi (p, a = 2.0 da)",
        yBirlik: "kPa",
        regressiyaX: (t) => (t > 0 ? 1 / t : 0),
        regressiyaY: (t, p) => (p > 0 ? Math.log(p) : 0),
        regressiyaXNomi: "1 / T (1/K)",
        regressiyaYNomi: "ln p",
        doimiylarniTop: (qiyalik) => {
          const R = 8.314;
          const qst = (-qiyalik * R) / 1000;
          const deltaH = -qst;
          return [
            { nom: "Izosterik adsorbsiya issiqligi (q_st)", qiymat: qst, birlik: "kJ/mol", izoh: "q_st = −qiyalik · R (Klapeiron-Klauzius)" },
            { nom: "Adsorbsiya entalpiyasi (ΔH)", qiymat: deltaH, birlik: "kJ/mol", izoh: "ΔH = −q_st (Ekzotermik)" },
          ];
        },
        parametrlar: [
          { kalit: "T1", nom: "1-Izoterma harorati (T1)", birlik: "K", min: 250, max: 320, standart: 273, qadam: 1 },
          { kalit: "T2", nom: "2-Izoterma harorati (T2)", birlik: "K", min: 280, max: 360, standart: 298, qadam: 1 },
        ],
        hisobla: (p1, p2, T1 = 273, T2 = 298) => {
          const R = 8.314;
          if (p1 <= 0 || p2 <= 0 || T2 <= T1) return { qst: 0, deltaH: 0, deltaG: 0, deltaS: 0 };
          const qst = (R * ((T1 * T2) / (T2 - T1)) * Math.log(p2 / p1)) / 1000;
          const deltaH = -qst;
          const T_avg = (T1 + T2) / 2;
          const deltaG = -R * T_avg * Math.log(Math.max(0.001, 101.325 / p1)) / 1000;
          const deltaS = ((deltaH - deltaG) * 1000) / T_avg;
          return { qst, deltaH, deltaG, deltaS };
        },
      },
      {
        id: "dyuklo-traube-qoidasi",
        nomi: "Dyuklo-Traube Qoidasi va Stalagmometr",
        belgi: "G = -dσ/dC,   β = G_(n+1) / G_n ≈ 3.2,   W = RT · ln β",
        formulaLatex: "G = -\\lim_{C \\to 0} \\frac{d\\sigma}{dC}, \\qquad \\beta = \\frac{G_{n+1}}{G_n} \\approx 3.2, \\qquad W = R \\cdot T \\cdot \\ln\\beta",
        tavsif: "Gomologik qatorda har bir -CH₂- guruhi qo'shilishi bilan sirt faolligi 3.0–3.5 barobar ortadi (Traube qoidasi).",
        belgilar: [
          { belgi: "G", nom: "Boshlang'ich sirt faolligi", birlik: "mN·L/(m·mol)", izoh: "Konsentratsiya nolga intilgandagi sirt taranglik pasayish tezligi" },
          { belgi: "n", nom: "Uglerod zanjiri soni", birlik: "dona", izoh: "Kislotadagi uglerod atomlari (-CH₂-) soni" },
          { belgi: "\\beta", nom: "Traube koeffitsiyenti", birlik: "karra (≈ 3.2)", izoh: "Har bir -CH₂- guruhi qo'shilganda sirt faollik ortish karraligi" },
          { belgi: "W", nom: "-CH₂- guruhi adsorbsiya ishi", birlik: "kJ/mol (≈ 2.8)", izoh: "Gidrofob guruhni suv hajmidan sirtga chiqarish ishi (W = RT ln β)" },
          { belgi: "\\sigma", nom: "Eritma sirt tarangligi", birlik: "mN/m", izoh: "Shishkovskiy tenglamasi bo'yicha hisoblangan sirt taranglik" },
        ],
        farazlar: [
          "Gidrofob uglevodorod zanjiri qancha uzun bo'lsa, molekulaning suv hajmidan sirtga siqib chiqarilishi shuncha kuchli bo'ladi.",
          "Suv va havo chegarasida qutbsiz dumlar havoga, qutbli kallalar esa suvga qarab yo'naladi.",
          "Har bir qo'shimcha -CH₂- guruhi adsorbsiya erkin energiyasini taxminan 2.6–3.0 kJ/mol ga kamaytiradi (W = -RT ln β).",
          "Suyultirilgan eritmalarda sirt faolligi G = -dσ/dC ning boshlang'ich qiyaligi bilan o'lchanadi.",
        ],
        tajribaNamunasi: [
          { n: 1, g: 96 },
          { n: 2, g: 325 },
          { n: 3, g: 1120 },
          { n: 4, g: 3712 },
          { n: 5, g: 12300 },
        ],
        xNomi: "Uglerod zanjiri soni (n)",
        xBirlik: "dona",
        yNomi: "Boshlang'ich sirt faolligi (G₀)",
        yBirlik: "mN·L/(m·mol)",
        regressiyaX: (n) => n,
        regressiyaY: (n, g) => (g > 0 ? Math.log(g) : 0),
        regressiyaXNomi: "n (uglerodlar soni)",
        regressiyaYNomi: "ln(G₀)",
        doimiylarniTop: (qiyalik) => {
          const beta = Math.exp(qiyalik);
          const wCh2 = (8.314 * 298 * Math.log(beta)) / 1000;
          return [
            { nom: "Traube koeffitsiyenti (β)", qiymat: beta, birlik: "karra", izoh: "β = e^qiyalik (har bir -CH₂- guruhi uchun)" },
            { nom: "Bitta -CH₂- guruhi adsorbsiya ishi (W)", qiymat: wCh2, birlik: "kJ/mol", izoh: "W = R·T · ln β" },
          ];
        },
        kislotalar: [
          { nom: "Chumoli kislota (HCOOH)", n: 1, formula: "HCOOH", betaDaraja: 1, b: 12.0, d: 8 },
          { nom: "Sirka kislota (CH₃COOH)", n: 2, formula: "CH_3COOH", betaDaraja: 3.2, b: 13.0, d: 25 },
          { nom: "Propion kislota (C₂H₅COOH)", n: 3, formula: "C_2H_5COOH", betaDaraja: 10.2, b: 14.0, d: 80 },
          { nom: "Moy kislota (C₃H₇COOH)", n: 4, formula: "C_3H_7COOH", betaDaraja: 32.8, b: 14.5, d: 256 },
          { nom: "Valerian kislota (C₄H₉COOH)", n: 5, formula: "C_4H_9COOH", betaDaraja: 105.0, b: 15.0, d: 820 },
        ],
        hisobla: (kislotaIndex, C, sigma0 = 72.8) => {
          const kislotalar = [
            { b: 12.0, d: 8 },
            { b: 13.0, d: 25 },
            { b: 14.0, d: 80 },
            { b: 14.5, d: 256 },
            { b: 15.0, d: 820 },
          ];
          const k = kislotalar[kislotaIndex] || kislotalar[2];
          const sigma = Math.max(20, sigma0 - k.b * Math.log(1 + k.d * C));
          const faollik = k.b * k.d;
          return { sigma, faollik };
        },
      },
    ],
    get formulalar() {
      return this.chuqurModullar;
    },
  },
  {
    id: "kompleks-birikmalar-geometriya",
    nomi: "Kompleks birikmalar fazoviy geometriyasi va izomeriya",
    qisqa: "Koordinatsion sonlar (4, 6), tetraedr, kvadrat-planar, oktaedr komplekslar va geometrik izomerlar.",
    oqituvchi: "Diyorbek Jabborov",
    fan: "Koordinatsion kimyo",
    daraja: "Oliy ta'lim",
    slaydlarSoni: 32,
    savollarSoni: 50,
    holat: "kutilmoqda",
    teglar: ["Oktaedr", "Koordinatsion son", "Ligandlar", "Izomeriya"],
    rang: "purple",
    chuqurModullar: [],
    get formulalar() {
      return this.chuqurModullar;
    },
  },
  {
    id: "kimyoviy-kinetika-arrenius",
    nomi: "Kimyoviy kinetika va Arrenius tenglamasi",
    qisqa: "Reaksiya tezligi, tartibi, faollashish energiyasi (Ea) va haroratga bog'liqlik.",
    oqituvchi: "Kafedra jamoasi",
    fan: "Fizikaviy kimyo",
    daraja: "Oliy ta'lim",
    slaydlarSoni: 28,
    savollarSoni: 45,
    holat: "kutilmoqda",
    teglar: ["Kinetika", "Arrenius", "Aktivlanish", "Kataliz"],
    rang: "amber",
    chuqurModullar: [],
    get formulalar() {
      return this.chuqurModullar;
    },
  },
];

export function mavzuniTop(id) {
  return DOSKA_MAVZULARI.find((m) => m.id === id) || null;
}
